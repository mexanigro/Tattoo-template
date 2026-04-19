import React from "react";
import { ChevronRight, Calendar, Star } from "lucide-react";
import { motion } from "motion/react";
import { siteConfig } from "../../config/site";

export function Hero({ onBookClick }: { onBookClick: () => void }) {
  const { hero } = siteConfig;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-zinc-50 dark:from-black/80 dark:via-black/60 dark:to-surface-dark z-10 transition-colors duration-300" />
        <img
          src={hero.backgroundImage}
          className="w-full h-full object-cover scale-105"
          alt="Salon atmosphere"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 mb-8"
        >
          <Star className="text-accent-light" size={16} fill="currentColor" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300 transition-colors duration-300">
            {siteConfig.brand.tagline}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.9] text-zinc-950 dark:text-white"
        >
          {hero.titlePrefix} <span className="text-accent-light">{hero.titleHighlight}</span><br />
          {hero.titleSuffix}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-zinc-500 dark:text-zinc-400 transition-colors duration-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {siteConfig.features.showBooking && (
            <button
              onClick={onBookClick}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-zinc-950 hover:bg-accent-light px-10 py-5 rounded-full text-lg font-black transition-all group"
            >
              <Calendar size={22} />
              <span>{hero.ctaPrimary}</span>
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
          {siteConfig.features.showServices && (
            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white dark:bg-zinc-900 transition-colors duration-300 hover:bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 text-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 px-10 py-5 rounded-full text-lg font-bold transition-all"
            >
              {hero.ctaSecondary}
            </a>
          )}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-accent-light to-transparent" />
      </div>
    </section>
  );
}
