import React from "react";
import { Clock, DollarSign, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { siteConfig } from "../../config/site";

export function Services({ onBookClick }: { onBookClick: () => void }) {
  const { sections } = siteConfig;
  const { services: sectionConfig } = sections;

  return (
    <section id="services" className="py-24 bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent-light font-black uppercase tracking-[0.3em] text-xs mb-4"
          >
            {sectionConfig.title}
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter"
          >
            {sectionConfig.subtitle}
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {siteConfig.services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-3xl overflow-hidden hover:border-accent-light/50 transition-all flex flex-col sm:flex-row",
                siteConfig.features.showBooking && "cursor-pointer"
              )}
              onClick={siteConfig.features.showBooking ? onBookClick : undefined}
            >
              <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto relative overflow-hidden">
                 <img 
                    src={sectionConfig.images[index % sectionConfig.images.length]} 
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 sm:bg-gradient-to-r sm:from-transparent to-transparent sm:to-zinc-900" />
              </div>
              
              <div className="p-8 sm:w-3/5 flex flex-col justify-center">
                {siteConfig.features.showBooking && (
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                    <ChevronRight className="text-accent-light" />
                  </div>
                )}

                <h4 className="text-2xl font-black text-zinc-950 dark:text-white mb-3 tracking-tight group-hover:text-accent-light transition-colors">
                  {service.name}
                </h4>
                <p className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-sm mb-8 leading-relaxed max-w-sm">
                  {service.description}
                </p>

                <div className="flex items-center gap-6 mt-auto">
                  <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
                    <DollarSign size={16} className="text-accent-light" />
                    <span>{service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-xs uppercase tracking-widest font-semibold">
                    <Clock size={14} className="text-zinc-500" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
