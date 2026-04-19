import React from 'react';
import { motion } from 'motion/react';
import { Scissors, Clock, Calendar, Shield, AlertCircle, Save, ChevronRight, User, Coffee, X } from 'lucide-react';
import { StaffMember, WeeklySchedule, WorkDay, TimeRange } from '../../types';
import { siteConfig } from '../../config/site';
import { dbService } from '../../services/db';
import { cn } from '../../lib/utils';

export function StaffLogistics() {
  const [staff, setStaff] = React.useState<StaffMember[]>(siteConfig.staff);
  const { sections } = siteConfig;
  const { staff: config } = sections.admin;
  const [selectedStaffId, setSelectedStaffId] = React.useState<string>(staff[0]?.id || '');
  const [isSaving, setIsSaving] = React.useState(false);
  const [overrides, setOverrides] = React.useState<Record<string, any>>({});

  const selectedStaffMember = staff.find(b => b.id === selectedStaffId);

  React.useEffect(() => {
    fetchOverrides();
  }, []);

  const fetchOverrides = async () => {
    const data = await dbService.getStaffOverrides();
    setOverrides(data);
  };

  const handleToggleDay = (day: keyof WeeklySchedule) => {
    if (!selectedStaffMember) return;
    const newSchedule = { 
        ...selectedStaffMember.schedule, 
        [day]: { 
            ...selectedStaffMember.schedule[day], 
            isOpen: !selectedStaffMember.schedule[day].isOpen 
        } 
    };
    updateStaffState(newSchedule, selectedStaffMember.blockedDates || []);
  };

  const handleTimeChange = (day: keyof WeeklySchedule, field: 'start' | 'end', value: string) => {
    if (!selectedStaffMember) return;
    const newSchedule = {
      ...selectedStaffMember.schedule,
      [day]: {
        ...selectedStaffMember.schedule[day],
        hours: { ...selectedStaffMember.schedule[day].hours, [field]: value }
      }
    };
    updateStaffState(newSchedule, selectedStaffMember.blockedDates || []);
  };

  const handleAddBreak = (day: keyof WeeklySchedule) => {
    if (!selectedStaffMember) return;
    const newSchedule = {
      ...selectedStaffMember.schedule,
      [day]: {
        ...selectedStaffMember.schedule[day],
        breaks: [...selectedStaffMember.schedule[day].breaks, { start: "12:00", end: "13:00", label: "Break" }]
      }
    };
    updateStaffState(newSchedule, selectedStaffMember.blockedDates || []);
  };

  const handleRemoveBreak = (day: keyof WeeklySchedule, index: number) => {
    if (!selectedStaffMember) return;
    const newSchedule = {
      ...selectedStaffMember.schedule,
      [day]: {
        ...selectedStaffMember.schedule[day],
        breaks: selectedStaffMember.schedule[day].breaks.filter((_, i) => i !== index)
      }
    };
    updateStaffState(newSchedule, selectedStaffMember.blockedDates || []);
  };

  const handleBreakChange = (day: keyof WeeklySchedule, index: number, field: 'start' | 'end', value: string) => {
    if (!selectedStaffMember) return;
    const newSchedule = {
      ...selectedStaffMember.schedule,
      [day]: {
        ...selectedStaffMember.schedule[day],
        breaks: selectedStaffMember.schedule[day].breaks.map((brk, i) => i === index ? { ...brk, [field]: value } : brk)
      }
    };
    updateStaffState(newSchedule, selectedStaffMember.blockedDates || []);
  };

  const handleToggleBlockedDate = (date: string) => {
    if (!selectedStaffMember) return;
    const currentPaths = selectedStaffMember.blockedDates || [];
    const newPaths = currentPaths.includes(date) 
      ? currentPaths.filter(d => d !== date)
      : [...currentPaths, date];
    updateStaffState(selectedStaffMember.schedule, newPaths);
  };

  const updateStaffState = (newSchedule: WeeklySchedule, newBlockedDates: string[]) => {
    setStaff(prev => prev.map(b => b.id === selectedStaffId ? { ...b, schedule: newSchedule, blockedDates: newBlockedDates } : b));
  };

  const handleSave = async () => {
    if (!selectedStaffMember) return;
    setIsSaving(true);
    try {
      await dbService.saveStaffOverride(selectedStaffId, { 
        schedule: selectedStaffMember.schedule,
        blockedDates: selectedStaffMember.blockedDates || []
      });
      await fetchOverrides();
    } catch (error) {
      console.error("Failed to sync personnel data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Side Profile Selector */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 px-2">{config.title}</h3>
        <div className="space-y-2">
          {staff.map(member => (
            <button
              key={member.id}
              onClick={() => setSelectedStaffId(member.id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 group",
                selectedStaffId === member.id 
                  ? "bg-accent-light/10 border-accent-light/50" 
                  : "bg-white dark:bg-zinc-900 transition-colors duration-300 border-zinc-200 dark:border-zinc-800 transition-colors duration-300 hover:border-zinc-700"
              )}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 transition-colors duration-300 shrink-0">
                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="min-w-0">
                <p className={cn("text-xs font-black uppercase truncate", selectedStaffId === member.id ? "text-accent-light" : "text-zinc-950 dark:text-white")}>
                  {member.name.split(' ')[0]}
                </p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest truncate">{member.specialty}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Configuration */}
      <div className="lg:col-span-3 space-y-8">
        {selectedStaffMember ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-[32px] overflow-hidden"
          >
            <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300 flex items-center justify-between bg-zinc-900/30">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-accent-light/10 rounded-2xl border border-accent-light/20">
                  <Clock className="text-accent-light" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 dark:text-white mb-1">{config.scheduleTitle}</h2>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Personnel: {selectedStaffMember.name}</p>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-3 px-6 py-3 bg-accent hover:bg-accent-light disabled:bg-zinc-100 dark:disabled:bg-zinc-800 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-accent/10"
              >
                {isSaving ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={16} />
                    <span>{config.commitButton}</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-8">
              <div className="space-y-4">
                {(Object.keys(selectedStaffMember.schedule) as Array<keyof WeeklySchedule>).map((day) => {
                  const dayConfig = selectedStaffMember.schedule[day];
                  return (
                    <div 
                      key={day}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                        dayConfig.isOpen ? "bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 transition-colors duration-300" : "bg-surface-dark/50 border-zinc-200 dark:border-zinc-900 transition-colors duration-300 opacity-50"
                      )}
                    >
                      <div className="flex items-center gap-6 w-1/4">
                        <button
                          onClick={() => handleToggleDay(day)}
                          className={cn(
                            "w-12 h-6 rounded-full relative transition-all",
                            dayConfig.isOpen ? "bg-green-500/20" : "bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full transition-all",
                            dayConfig.isOpen ? "right-1 bg-green-500" : "left-1 bg-zinc-600"
                          )} />
                        </button>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 transition-colors duration-300 w-24">{day}</span>
                      </div>

                      <div className="flex items-center gap-8 flex-1 justify-end">
                        {dayConfig.isOpen ? (
                          <div className="space-y-4 flex-1 flex flex-col items-end">
                            <div className="flex items-center gap-6 justify-end w-full">
                                <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-zinc-600 uppercase">Commence</span>
                                <input
                                    type="time"
                                    value={dayConfig.hours.start}
                                    onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                                    className="bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 border border-zinc-700 px-3 py-2 rounded-lg text-xs text-zinc-950 dark:text-white outline-none focus:border-accent-light/50"
                                />
                                </div>
                                <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-zinc-600 uppercase">Cease</span>
                                <input
                                    type="time"
                                    value={dayConfig.hours.end}
                                    onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                                    className="bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 border border-zinc-700 px-3 py-2 rounded-lg text-xs text-zinc-950 dark:text-white outline-none focus:border-accent-light/50"
                                />
                                </div>
                            </div>
                            
                            {/* Breaks Section */}
                            <div className="w-full pl-32">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Coffee size={12} className="text-zinc-500" />
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Tactical Breaks</span>
                                    </div>
                                    <button 
                                        onClick={() => handleAddBreak(day)}
                                        className="text-[8px] font-black uppercase text-accent-light hover:text-accent-light bg-accent-light/5 px-2 py-1 rounded-md border border-accent-light/10"
                                    >
                                        + Add Interval
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {dayConfig.breaks.map((brk, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-surface-dark/50 p-2 rounded-lg border border-zinc-800/50">
                                            <input
                                                type="time"
                                                value={brk.start}
                                                onChange={(e) => handleBreakChange(day, idx, 'start', e.target.value)}
                                                className="bg-transparent border-none text-[10px] text-zinc-500 dark:text-zinc-400 transition-colors duration-300 outline-none w-16"
                                            />
                                            <span className="text-[8px] text-zinc-700">TO</span>
                                            <input
                                                type="time"
                                                value={brk.end}
                                                onChange={(e) => handleBreakChange(day, idx, 'end', e.target.value)}
                                                className="bg-transparent border-none text-[10px] text-zinc-500 dark:text-zinc-400 transition-colors duration-300 outline-none w-16"
                                            />
                                            <div className="flex-1" />
                                            <button 
                                                onClick={() => handleRemoveBreak(day, idx)}
                                                className="text-zinc-600 hover:text-red-500 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    {dayConfig.breaks.length === 0 && (
                                        <div className="text-[9px] text-zinc-700 italic border border-dashed border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-lg p-2 text-center">
                                            No mandatory rest intervals defined
                                        </div>
                                    )}
                                </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-zinc-600">
                             <AlertCircle size={14} />
                             <span className="text-[10px] font-black uppercase tracking-tighter">Inactive Sector</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 space-y-6">
                <div className="p-6 bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar size={18} className="text-accent-light" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950 dark:text-white">Blocked Operational Dates</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                        {[0,1,2,3,4,5,6].map(i => {
                            const date = new Date();
                            date.setDate(date.getDate() + i);
                            const dateStr = date.toISOString().split('T')[0];
                            const isBlocked = selectedStaffMember.blockedDates?.includes(dateStr);
                            
                            return (
                                <button
                                    key={dateStr}
                                    onClick={() => handleToggleBlockedDate(dateStr)}
                                    className={cn(
                                        "p-3 rounded-xl border text-[9px] font-black uppercase text-center transition-all",
                                        isBlocked 
                                            ? "bg-red-500/10 border-red-500/30 text-red-500" 
                                            : "bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 border-zinc-200 dark:border-zinc-800 transition-colors duration-300 text-zinc-500 hover:border-zinc-700"
                                    )}
                                >
                                    <div className="opacity-50 mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                    <div>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                </button>
                            );
                        })}
                    </div>
                    <p className="mt-4 text-[9px] text-zinc-500 uppercase tracking-tight italic">* Toggle dates to lock operational capacity for this specialist.</p>
                </div>

                <div className="p-6 bg-accent-light/[0.03] border border-accent-light/10 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <Shield className="text-accent-light/40 shrink-0" size={20} />
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-accent-light/60 uppercase tracking-widest">{config.enforcementTitle}</p>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                {config.enforcementDesc}
                            </p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center text-zinc-700 space-y-4">
             <User size={48} className="opacity-20" />
             <p className="text-xs font-black uppercase tracking-widest">Select personnel to view tactical schedule</p>
          </div>
        )}
      </div>
    </div>
  );
}
