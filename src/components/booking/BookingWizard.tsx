import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Scissors, User, Calendar as CalendarIcon, Clock, CheckCircle, X, ChevronRight, ChevronLeft, Phone, Mail, UserCircle, CreditCard, AlertCircle } from "lucide-react";
import { Service, StaffMember, Appointment, PaymentStatus, AppointmentStatus } from "../../types";
import { format, addDays } from "date-fns";
import { generateSlots } from "../../lib/booking";
import { cn } from "../../lib/utils";
import { dbService } from "../../services/db";
import { siteConfig } from "../../config/site";
import { aiService } from "../../services/ai";
import { Sparkles, Send } from "lucide-react";

type Step = "service" | "staff" | "datetime" | "details" | "payment" | "success";

export function BookingWizard({ onClose }: { onClose: () => void }) {
  const { services: SERVICES, staff: STAFF, brand, payment: PAYMENT_CONFIG, sections } = siteConfig;
  const { booking: config } = sections;
  /** When false, no Stripe step; new appointments are stored as `confirmed` without card flow. */
  const paymentsRequired = PAYMENT_CONFIG.enabled && PAYMENT_CONFIG.mode !== "none";
  const [step, setStep] = React.useState<Step>("service");

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("booking_status") === "success") {
      setStep("success");
    }
  }, []);

  const [selectedService, setSelectedService] = React.useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = React.useState<StaffMember | null>(null);
  const [anySpecialist, setAnySpecialist] = React.useState(false);
  const [staffList, setStaffList] = React.useState<StaffMember[]>(STAFF);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    dbService.getStaff().then(setStaffList);
  }, []);
  
  const [customerInfo, setCustomerInfo] = React.useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [appointmentId, setAppointmentId] = React.useState<string | null>(null);
  const [existingAppointments, setExistingAppointments] = React.useState<Appointment[]>([]);
  const [isCancelling, setIsCancelling] = React.useState(false);

  React.useEffect(() => {
    if (selectedStaff && selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      dbService.getAppointmentsForDate(dateStr).then(apps => {
        setExistingAppointments(apps.filter(a => a.staffId === selectedStaff.id && a.status !== 'cancelled'));
      });
    }
  }, [selectedDate, selectedStaff, step]);
  const [isCancelled, setIsCancelled] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);

  // AI Consultation State
  const [showAiConsult, setShowAiConsult] = React.useState(false);
  const [aiQuery, setAiQuery] = React.useState("");
  const [isConsulting, setIsConsulting] = React.useState(false);
  const [aiAdvice, setAiAdvice] = React.useState<string | null>(null);

  const handleClose = () => {
    // Clean up URL params
    const url = new URL(window.location.href);
    url.searchParams.delete("booking_status");
    url.searchParams.delete("session_id");
    window.history.replaceState({}, "", url);
    onClose();
  };

  const availableSlots = React.useMemo(() => {
    if (!selectedService) return [];
    
    if (anySpecialist) {
      // Aggregate slots from ALL staff
      const allSlots = new Set<string>();
      staffList.forEach(b => {
        const slots = generateSlots(selectedDate, b, selectedService, existingAppointments.filter(a => a.staffId === b.id));
        slots.forEach(s => allSlots.add(s));
      });
      return Array.from(allSlots).sort();
    }

    if (!selectedStaff) return [];
    return generateSlots(selectedDate, selectedStaff, selectedService, existingAppointments);
  }, [selectedDate, selectedStaff, selectedService, existingAppointments, anySpecialist, staffList]);

  const handleConfirm = async () => {
    if (!selectedService || (!selectedStaff && !anySpecialist) || !selectedTime) return;
    
    setIsSubmitting(true);
    setPaymentError(null);
    
    let targetStaff = selectedStaff;

    // If "Any Specialist", find the first one available for this specific time
    if (anySpecialist) {
      targetStaff = staffList.find(b => {
        const slots = generateSlots(selectedDate, b, selectedService, existingAppointments.filter(a => a.staffId === b.id));
        return slots.includes(selectedTime);
      }) || null;
    }

    if (!targetStaff) {
      console.error("No specialist available for chosen time.");
      setIsSubmitting(false);
      return;
    }

    let initialStatus: AppointmentStatus = "pending";
    let initialPaymentStatus: PaymentStatus | undefined;
    if (paymentsRequired) {
      initialStatus = "pending";
      if (PAYMENT_CONFIG.mode === "deposit") initialPaymentStatus = "deposit_required";
      else if (PAYMENT_CONFIG.mode === "full") initialPaymentStatus = "pending";
    } else {
      initialStatus = "confirmed";
    }

    const newAppointment: Omit<Appointment, "id" | "createdAt"> = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      serviceId: selectedService.id,
      staffId: targetStaff.id,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      duration: selectedService.duration,
      status: initialStatus,
      ...(initialPaymentStatus !== undefined ? { paymentStatus: initialPaymentStatus } : {}),
    };

    try {
      const id = await dbService.saveAppointment(newAppointment);
      setAppointmentId(id);

      // Trigger owner notification (background)
      fetch("/api/notify-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          appointmentId: id, 
          details: { ...newAppointment, service: selectedService.name, staff: targetStaff.name } 
        }),
      }).catch(err => console.error("Notification trigger failed:", err));

      if (paymentsRequired) {
        const amount = PAYMENT_CONFIG.mode === 'deposit' 
          ? PAYMENT_CONFIG.depositAmount || 2000 
          : selectedService.price * 100;

        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentId: id,
            price: amount,
            name: selectedService.name,
            customerEmail: customerInfo.email,
            mode: PAYMENT_CONFIG.mode,
          }),
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
          return;
        } else {
          console.warn("Stripe redirect failed:", data.error);
          setPaymentError(typeof data.error === "string" ? data.error : "Checkout could not be started.");
          setStep("payment");
        }
      } else {
        setStep("success");
      }
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!appointmentId) return;
    setIsCancelling(true);
    try {
      await dbService.updateAppointment(appointmentId, { status: "cancelled" });
      setIsCancelled(true);
    } catch (error) {
      console.error("Cancellation failed:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const runAiConsultation = async () => {
    if (!aiQuery.trim()) return;
    setIsConsulting(true);
    setAiAdvice(null);
    try {
      const result = await aiService.getStyleConsultation(aiQuery, SERVICES);
      if (result) {
        setAiAdvice(result.advice);
        if (result.serviceId) {
          const service = SERVICES.find(s => s.id === result.serviceId);
          if (service) setSelectedService(service);
        }
      }
    } catch (err) {
      console.error("AI Consult failed:", err);
    } finally {
      setIsConsulting(false);
    }
  };

  const renderHeader = () => {
    const steps: { key: Step; label: string; icon: any }[] = [
      { key: "service", label: config.steps.service, icon: Scissors },
      { key: "staff", label: config.steps.staff, icon: User },
      { key: "datetime", label: config.steps.datetime, icon: CalendarIcon },
      { key: "details", label: config.steps.details, icon: UserCircle },
      ...(paymentsRequired ? [{ key: "payment", label: config.steps.payment, icon: CreditCard } as const] : []),
    ];

    if (step === "success") return null;

    return (
      <div className="flex items-center justify-between mb-8 px-2 overflow-x-auto no-scrollbar">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.key;
          const isDone = steps.findIndex(st => st.key === step) > idx;

          return (
             <React.Fragment key={s.key}>
                <div className="flex flex-col items-center gap-2 min-w-[60px]">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    isActive ? "bg-accent-light border-accent-light text-zinc-950 scale-110" : 
                    isDone ? "bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 border-zinc-200 dark:border-zinc-800 transition-colors duration-300 text-accent-light" :
                    "bg-white dark:bg-zinc-900 transition-colors duration-300 border-zinc-200 dark:border-zinc-800 transition-colors duration-300 text-zinc-500 dark:text-zinc-400 transition-colors duration-300"
                  )}>
                    <Icon size={18} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-tighter",
                    isActive ? "text-accent-light" : "text-zinc-500 dark:text-zinc-400 transition-colors duration-300"
                  )}>{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-[2px] bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 mx-4 min-w-[20px]" />
                )}
             </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">{config.title}</h2>
           <p className="text-zinc-600 dark:text-zinc-300 transition-colors duration-300 text-xs uppercase tracking-widest font-bold">{config.tagline}</p>
        </div>
        <button onClick={handleClose} className="p-2 hover:bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 rounded-full transition-colors text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
          <X size={24} />
        </button>
      </div>

      {renderHeader()}

      <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
        <AnimatePresence mode="wait">
          {step === "service" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key="service"
              className="space-y-4"
            >
              <h3 className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Choose a service</h3>
              
              {/* AI Consultant Trigger */}
              <div className="bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 border border-zinc-200 dark:border-zinc-900 transition-colors duration-300 rounded-3xl p-6 mb-6 group relative overflow-hidden transition-all hover:border-accent-light/50">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles size={60} />
                 </div>
                 
                 {!showAiConsult ? (
                   <div className="flex items-center justify-between gap-4">
                      <div>
                         <p className="text-accent-light text-[9px] font-black uppercase tracking-[0.2em] mb-1">{config.aiConsultant.title}</p>
                         <h4 className="text-zinc-950 dark:text-white text-sm font-black uppercase tracking-tight">{config.aiConsultant.subtitle}</h4>
                         <p className="text-zinc-500 text-[10px] mt-1">{config.aiConsultant.description}</p>
                      </div>
                      <button 
                        onClick={() => setShowAiConsult(true)}
                        className="p-3 bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-xl text-accent-light hover:bg-accent-light hover:text-zinc-950 transition-all shadow-xl active:scale-90"
                      >
                         <Sparkles size={20} />
                      </button>
                   </div>
                 ) : (
                   <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                         <p className="text-accent-light text-[9px] font-black uppercase tracking-[0.2em]">{config.aiConsultant.agentLabel}</p>
                         <button onClick={() => setShowAiConsult(false)} className="text-zinc-600 hover:text-white transition-colors">
                            <X size={14} />
                         </button>
                      </div>
                      <div className="flex gap-2">
                         <input 
                           autoFocus
                           value={aiQuery}
                           onChange={(e) => setAiQuery(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && runAiConsultation()}
                           placeholder={config.aiConsultant.placeholder}
                           className="flex-1 bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 p-3 rounded-xl text-xs text-zinc-950 dark:text-white outline-none focus:border-accent-light transition-all"
                         />
                         <button 
                           onClick={runAiConsultation}
                           disabled={isConsulting || !aiQuery.trim()}
                           className="p-3 bg-accent text-white rounded-xl hover:bg-accent-light disabled:bg-zinc-100 dark:disabled:bg-zinc-800 transition-all flex items-center justify-center min-w-[44px]"
                         >
                            {isConsulting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
                         </button>
                      </div>
                      {aiAdvice && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50"
                        >
                           <p className="text-xs text-zinc-600 dark:text-zinc-300 transition-colors duration-300 italic leading-relaxed">"{aiAdvice}"</p>
                           {selectedService && (
                             <div className="mt-2 flex items-center gap-2">
                                <CheckCircle size={12} className="text-green-500" />
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Selected: {selectedService.name}</span>
                             </div>
                           )}
                        </motion.div>
                      )}
                   </div>
                 )}
              </div>

              <div className="grid gap-3">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedService(s); setStep("staff"); }}
                    className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-2xl hover:border-accent-light transition-all text-left group"
                  >
                    <div>
                      <h4 className="font-bold text-zinc-950 dark:text-white group-hover:text-accent-light transition-colors">{s.name}</h4>
                      <p className="text-zinc-600 dark:text-zinc-300 transition-colors duration-300 text-xs mt-1">{s.duration} mins • ${s.price}</p>
                    </div>
                    <ChevronRight size={20} className="text-zinc-700 group-hover:text-accent-light transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "staff" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key="staff"
              className="space-y-4"
            >
              <button 
                onClick={() => setStep("service")}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 transition-colors duration-300 hover:text-white transition-colors mb-4"
              >
                <ChevronLeft size={14} /> Back to services
              </button>
              <h3 className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Choose a staff member</h3>
              <div className="grid gap-4">
                {/* Any Specialist Option */}
                <button
                  onClick={() => { setAnySpecialist(true); setSelectedStaff(null); setStep("datetime"); }}
                  className="flex items-center gap-5 p-4 bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-2xl hover:border-accent-light transition-all text-left group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 transition-colors duration-300 flex items-center justify-center text-accent-light group-hover:scale-105 transition-all">
                    <User size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-zinc-950 dark:text-white group-hover:text-accent-light transition-colors">Any Available Specialist</h4>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Maximum Operational Flexibility</p>
                  </div>
                  <ChevronRight size={20} className="text-zinc-700 group-hover:text-accent-light transition-colors" />
                </button>

                <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 my-2" />

                {staffList.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { setSelectedStaff(b); setAnySpecialist(false); setStep("datetime"); }}
                    className="flex items-center gap-5 p-4 bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-2xl hover:border-accent-light transition-all text-left group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                      <img src={b.photoUrl} className="w-full h-full object-cover" alt={b.name} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-950 dark:text-white group-hover:text-accent-light transition-colors">{b.name}</h4>
                      <p className="text-zinc-600 dark:text-zinc-300 transition-colors duration-300 text-[10px] uppercase font-bold tracking-widest mt-1">{b.specialty}</p>
                    </div>
                    <ChevronRight size={20} className="text-zinc-700 group-hover:text-accent-light transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "datetime" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key="datetime"
              className="space-y-6"
            >
              <button 
                onClick={() => setStep("staff")}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 transition-colors duration-300 hover:text-white transition-colors"
              >
                <ChevronLeft size={14} /> Back to staff
              </button>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 font-black uppercase text-[9px] tracking-[0.3em]">Temporal Selection</h3>
                  <span className="text-[10px] font-bold text-accent-light/50 uppercase tracking-widest">Next 14 Days</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const d = addDays(new Date(), i);
                    const isSelected = format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                    const isToday = format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(d)}
                        className={cn(
                          "flex flex-col items-center justify-center min-w-[70px] py-4 rounded-xl border transition-all duration-300 relative group",
                          isSelected 
                            ? "bg-accent-light border-accent-light text-zinc-950 scale-105 shadow-lg shadow-accent-light/20" 
                            : "bg-white dark:bg-zinc-900 transition-colors duration-300 border-zinc-200 dark:border-zinc-800 transition-colors duration-300 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 hover:border-zinc-700 hover:text-zinc-200"
                        )}
                      >
                        {isToday && !isSelected && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-light rounded-full animate-pulse" />
                        )}
                        <span className="text-[9px] font-black uppercase tracking-tighter mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          {format(d, "EEE")}
                        </span>
                        <span className="text-xl font-black leading-none flex flex-col items-center">
                          {format(d, "d")}
                          <span className="text-[8px] font-bold uppercase mt-1 opacity-40">
                            {format(d, "MMM")}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 font-bold uppercase text-[10px] tracking-[0.2em]">Available Times</h3>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => { setSelectedTime(time); setStep("details"); }}
                        className={cn(
                          "py-3 rounded-xl border text-sm font-bold transition-all",
                          selectedTime === time ? "bg-accent-light border-accent-light text-zinc-950" : "bg-white dark:bg-zinc-900 transition-colors duration-300 border-zinc-200 dark:border-zinc-800 transition-colors duration-300 text-zinc-600 dark:text-zinc-300 transition-colors duration-300 hover:border-zinc-500"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800/50 text-center">
                    <p className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-sm font-bold uppercase tracking-widest italic">Fully booked for this date</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === "details" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key="details"
              className="space-y-6"
            >
              <button 
                onClick={() => setStep("datetime")}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 transition-colors duration-300 hover:text-white transition-colors"
              >
                <ChevronLeft size={14} /> Back to time selection
              </button>

              <div className="bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-900 transition-colors duration-300 space-y-4 shadow-inner">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-accent-light text-[10px] font-black uppercase tracking-widest mb-1">Appointment Summary</p>
                       <h4 className="text-zinc-950 dark:text-white text-xl font-black uppercase tracking-tight">{selectedService?.name}</h4>
                    </div>
                    <span className="text-zinc-600 dark:text-zinc-300 transition-colors duration-300 font-black">${selectedService?.price}</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300 text-xs">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
                       <User size={14} className="text-accent-light" />
                       {anySpecialist ? "Any Available Specialist" : selectedStaff?.name}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
                       <Clock size={14} className="text-accent-light" />
                       {format(selectedDate, "MMM d")} @ {selectedTime}
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 font-bold uppercase text-[10px] tracking-[0.2em]">Contact Details</h3>
                <div className="space-y-3">
                  <div className="relative group">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 group-focus-within:text-accent-light transition-colors" size={20} />
                    <input
                      placeholder="Full Name"
                      className="w-full bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 p-4 pl-12 rounded-2xl outline-none focus:border-accent-light text-zinc-950 dark:text-white transition-all"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 group-focus-within:text-accent-light transition-colors" size={20} />
                    <input
                      placeholder="Email Address"
                      className="w-full bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 p-4 pl-12 rounded-2xl outline-none focus:border-accent-light text-zinc-950 dark:text-white transition-all"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 group-focus-within:text-accent-light transition-colors" size={20} />
                    <input
                      placeholder="Phone Number"
                      className="w-full bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 p-4 pl-12 rounded-2xl outline-none focus:border-accent-light text-zinc-950 dark:text-white transition-all"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone || isSubmitting}
                onClick={handleConfirm}
                className="w-full bg-accent hover:bg-accent-light disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-500 dark:disabled:text-zinc-400 p-5 rounded-2xl font-black uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={22} />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              key="payment"
              className="space-y-6 text-center py-6"
            >
              <div className="w-20 h-20 bg-accent-light/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-light/20">
                <AlertCircle className="text-accent-light" size={40} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">Stripe Setup Required</h3>
                <p className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-sm leading-relaxed max-w-sm mx-auto">
                  {paymentError || "The payment system is being configured. Please contact the administrator to complete your booking."}
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 p-6 rounded-3xl text-left space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Wait-list Reserved</p>
                 <p className="text-zinc-950 dark:text-white text-sm font-bold">Your details for {format(selectedDate, "MMM d")} @ {selectedTime} have been saved.</p>
                 <p className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-xs">Once Stripe is configured, you will receive a payment link via email.</p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-white text-zinc-950 p-5 rounded-2xl font-black uppercase tracking-widest transition-all mt-4"
              >
                Close & Notify Me Later
              </button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key="success"
              className="text-center py-12 space-y-6"
            >
              {isCancelled ? (
                <>
                  <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                    <X className="text-red-500" size={60} />
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">{config.success.cancelled}</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 max-w-xs mx-auto text-sm leading-relaxed">
                    Your appointment has been successfully cancelled.
                  </p>
                  
                  <button
                    onClick={handleClose}
                    className="w-full bg-white text-zinc-950 p-4 rounded-xl font-bold uppercase tracking-widest transition-all mt-4"
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                    <CheckCircle className="text-green-500" size={60} />
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                    {
                      (new URLSearchParams(window.location.search).get("booking_status") === "success" || !paymentsRequired)
                       ? config.success.confirmed 
                       : config.success.requestSaved
                    }
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 max-w-xs mx-auto text-sm leading-relaxed">
                    {
                      new URLSearchParams(window.location.search).get("booking_status") === "success" 
                        ? "Excellent. Your payment was successful and your spot is strictly reserved." 
                        : !paymentsRequired
                          ? "Success! Your chair is reserved and we've added you to the calendar. We'll see you soon."
                          : "Your booking is saved in our system! We're just waiting for payment verification. A team member will review it and confirm your final slot shortly."
                    }
                  </p>
                  
                  {selectedService && (
                    <div className="bg-white dark:bg-zinc-900 transition-colors duration-300 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 inline-block text-left w-full">
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 transition-colors duration-300 mb-2 underline decoration-accent-light underline-offset-4">Your Appointment</p>
                       <p className="text-zinc-950 dark:text-white font-bold">{format(selectedDate, "EEEE, MMMM do")}</p>
                       <p className="text-accent-light font-black text-2xl tracking-tighter">{selectedTime}</p>
                       <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-300">
                          <User size={14} className="text-accent-light" />
                          {anySpecialist ? "Assigned Specialist" : `Staff: ${selectedStaff?.name}`}
                       </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={handleCancel}
                      disabled={isCancelling || !appointmentId}
                      className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 hover:border-red-500/50 hover:text-red-500 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 p-4 rounded-xl font-bold uppercase tracking-widest transition-all text-xs disabled:opacity-50"
                    >
                      {isCancelling ? "Cancelling..." : "Cancel"}
                    </button>
                    <button
                      onClick={handleClose}
                      className="w-full bg-white text-zinc-950 p-4 rounded-xl font-bold uppercase tracking-widest transition-all text-xs"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
