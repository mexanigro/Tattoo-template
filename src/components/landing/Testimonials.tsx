import React from "react";
import { Quote, Star } from "lucide-react";
import { motion } from "motion/react";
import { siteConfig } from "../../config/site";

export function Testimonials() {
  const { testimonials, sections } = siteConfig;
  const { testimonials: sectionConfig } = sections;

  return (
    <section className="py-24 bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-accent-light font-bold uppercase tracking-[0.3em] text-xs mb-4">{sectionConfig.title}</h2>
          <h3 className="text-4xl md:text-5xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter">{sectionConfig.subtitle}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-[2.5rem] relative"
            >
              <Quote className="absolute top-8 right-8 text-zinc-800" size={60} />
              
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="text-accent-light" size={16} fill="currentColor" />
                ))}
              </div>

              <p className="text-zinc-600 dark:text-zinc-300 transition-colors duration-300 text-lg mb-8 leading-relaxed italic">
                "{review.text}"
              </p>

              <div>
                <h4 className="text-zinc-950 dark:text-white font-bold text-lg">{review.name}</h4>
                <p className="text-zinc-600 dark:text-zinc-300 transition-colors duration-300 text-xs uppercase tracking-widest mt-1">{review.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
