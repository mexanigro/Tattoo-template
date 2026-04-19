import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { siteConfig } from "../../config/site";

type PolicyType = "privacy" | "terms" | "cancellation";

export function PolicyModal({ type, onClose }: { type: PolicyType; onClose: () => void }) {
  const renderContent = () => {
    switch (type) {
      case "privacy":
        return (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300 transition-colors duration-300 leading-relaxed max-w-prose">
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white mb-6">Privacy Policy</h2>
            <p>At {siteConfig.brand.name}, we are committed to protecting your privacy and ensuring the security of your personal information.</p>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2">1. Information We Collect</h3>
            <p>We may collect personal information such as your name, email address, and phone number when you book an appointment, create an account, or contact us. We also collect information about the services you request and your service history.</p>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2">2. How We Use Your Information</h3>
            <p>We use your information to facilitate your bookings, communicate schedule changes, and improve our services. We do not sell or share your personal data with third parties for marketing purposes.</p>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2">3. Data Security</h3>
            <p>We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.</p>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2">4. Contact Us</h3>
            <p>If you have any questions or concerns regarding this Privacy Policy, please contact us at {siteConfig.contact.email} or {siteConfig.contact.phone}.</p>
          </div>
        );
      case "terms":
        return (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300 transition-colors duration-300 leading-relaxed max-w-prose">
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white mb-6">Terms and Conditions</h2>
            <p>Welcome to {siteConfig.brand.name}. By booking an appointment or using our services, you agree to be bound by these Terms and Conditions.</p>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2">1. Services</h3>
            <p>We offer professional grooming services as listed on our website. Prices and services are subject to change without prior notice.</p>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2">2. Booking and Punctuality</h3>
            <p>Appointments can be booked online or via phone. We highly recommend arriving 5 minutes before your scheduled appointment. If you are significantly late, we may need to reschedule your appointment or shorten your service to avoid delaying the next client.</p>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2">3. Refusal of Service</h3>
            <p>We reserve the right to refuse service to anyone demonstrating inappropriate behavior, posing a health or safety risk, or violating our policies.</p>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2">4. Liability</h3>
            <p>{siteConfig.brand.name} is not liable for any allergic reactions or injuries unless directly resulting from demonstrable negligence on our part. Please inform your service provider of any skin sensitivities or conditions prior to your service.</p>
          </div>
        );
      case "cancellation":
        return (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300 transition-colors duration-300 leading-relaxed max-w-prose">
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white mb-6">Cancellation Policy</h2>
            <p>We value your time, as well as the time of our team. To ensure we can accommodate all our clients, we enforce the following cancellation policy:</p>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2">1. Required Notice</h3>
            <p>We require at least 2 hours' notice for any cancellations or rescheduling of an appointment.</p>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2">2. No-Shows and Late Cancellations</h3>
            <p>If you fail to show up for your appointment or cancel within 2 hours of your scheduled time, you may be marked as a 'no-show'. Multiple no-shows may require you to prepay for future appointments.</p>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2">3. How to Cancel</h3>
            <p>You can cancel your appointment directly through the confirmation page of the booking portal, or by calling us at {siteConfig.contact.phone}.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-zinc-900 transition-colors duration-300 w-full max-w-2xl max-h-[85vh] rounded-[32px] p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 shadow-2xl flex flex-col"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 rounded-full transition-colors text-zinc-500 dark:text-zinc-400 transition-colors duration-300 z-10">
          <X size={24} />
        </button>
        <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
}
