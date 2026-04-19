import React, { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { siteConfig } from "../../config/site";

export function QuickInquiry() {
  const { sections } = siteConfig;
  const { contact: sectionConfig } = sections;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-accent-light font-bold uppercase tracking-[0.3em] text-xs mb-4">{sectionConfig.title}</h2>
          <h3 className="text-4xl md:text-5xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter mb-6">{sectionConfig.subtitle}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300">{sectionConfig.description}</p>
        </div>

        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 p-4 rounded-2xl outline-none focus:border-accent-light text-zinc-950 dark:text-white transition-all"
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 p-4 rounded-2xl outline-none focus:border-accent-light text-zinc-950 dark:text-white transition-all"
              />
            </div>
            <input
              type="text"
              placeholder="Subject (Optional)"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 p-4 rounded-2xl outline-none focus:border-accent-light text-zinc-950 dark:text-white transition-all"
            />
            <textarea
              required
              rows={4}
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 p-4 rounded-2xl outline-none focus:border-accent-light text-zinc-950 dark:text-white transition-all resize-none"
            />

            <button
              disabled={status === "submitting"}
              type="submit"
              className="w-full bg-accent hover:bg-accent-light disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-500 dark:disabled:text-zinc-400 p-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 text-white"
            >
              {status === "submitting" ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={20} />
                  <span>Send Message</span>
                </>
              )}
            </button>

            <AnimatePresence>
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-500 text-sm font-bold"
                >
                  <CheckCircle size={18} />
                  <span>Message sent! We'll get back to you soon.</span>
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
                >
                  <AlertCircle size={18} />
                  <span>Something went wrong. Please try again.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
}
