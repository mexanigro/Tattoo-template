import React from "react";
import { motion } from "motion/react";
import { Link2, LayoutGrid } from "lucide-react";
import { siteConfig } from "../../config/site";

export function Gallery({ onViewFull }: { onViewFull: () => void }) {
  const { gallery, sections } = siteConfig;
  const { gallery: sectionConfig } = sections;
  const previewImages = gallery.slice(0, 6);

  return (
    <section id="gallery" className="py-24 bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-center mb-16">
          <h2 className="text-accent-light font-bold uppercase tracking-[0.3em] text-xs mb-4">{sectionConfig.title}</h2>
          <h3 className="text-4xl md:text-5xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter">{sectionConfig.subtitle}</h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {previewImages.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-900 transition-colors duration-300"
            >
              <img
                src={src}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                alt={`Portfolio piece ${i + 1}`}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={onViewFull}
          className="group relative inline-flex items-center gap-4 bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 hover:border-accent-light hover:bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 text-zinc-950 dark:text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all overflow-hidden"
        >
          <LayoutGrid size={20} className="text-accent-light group-hover:scale-125 transition-transform" />
          <span>View Full Manifest</span>
          <div className="absolute inset-0 bg-accent-light/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </motion.button>
      </div>
    </section>
  );
}
