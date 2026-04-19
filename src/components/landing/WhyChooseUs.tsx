import React from "react";
import * as Icons from "lucide-react";
import { motion } from "motion/react";
import { siteConfig } from "../../config/site";

export function WhyChooseUs() {
  const { sections } = siteConfig;
  const { whyChooseUs: sectionConfig } = sections;

  return (
    <section id="why-choose-us" className="py-24 bg-white dark:bg-zinc-900 transition-colors duration-300 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-square rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-colors duration-300"
            >
              <img
                src={sectionConfig.mainImage}
                className="w-full h-full object-cover"
                alt="Operational Standard"
              />
            </motion.div>
            <div className="absolute -bottom-10 -right-10 hidden md:block w-64 p-8 bg-accent-light rounded-3xl shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500">
               <Icons.Star className="text-zinc-950 mb-4" size={40} fill="currentColor" />
               <h4 className="text-2xl font-black text-zinc-950 uppercase leading-tight whitespace-pre-line">
                  {sectionConfig.badge}
               </h4>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="text-accent-light font-bold uppercase tracking-[0.3em] text-xs mb-4">{sectionConfig.title}</h2>
              <h3 className="text-4xl md:text-6xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter">{sectionConfig.subtitle}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {sectionConfig.benefits.map((benefit, i) => {
                const IconComponent = (Icons as any)[benefit.iconName] || Icons.HelpCircle;
                return (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="space-y-4"
                  >
                    <div className="w-12 h-12 bg-accent-light/10 rounded-xl flex items-center justify-center">
                      <IconComponent className="text-accent-light" size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">{benefit.title}</h4>
                    <p className="text-zinc-600 dark:text-zinc-300 transition-colors duration-300 text-sm leading-relaxed">
                      {benefit.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
