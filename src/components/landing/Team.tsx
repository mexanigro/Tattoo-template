import React from "react";
import { motion } from "motion/react";
import { Instagram, Twitter, ExternalLink, ShieldCheck, Database, Fingerprint } from "lucide-react";
import { siteConfig } from "../../config/site";
import { cn } from "../../lib/utils";

export function Team({ onBookClick }: { onBookClick: () => void }) {
  const { sections } = siteConfig;
  const { team: sectionConfig } = sections;

  return (
    <section id="team" className="py-32 bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 px-6 relative overflow-hidden">
      {/* Structural Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-zinc-900 via-transparent to-transparent opacity-30" />
      <div className="absolute top-1/4 left-0 w-full h-px bg-white dark:bg-zinc-900 transition-colors duration-300 opacity-20" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-24 gap-12">
          <div className="relative">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "40px" }}
              viewport={{ once: true }}
              className="h-1 bg-accent-light mb-6"
            />
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-accent-light font-black uppercase tracking-[0.4em] text-[10px] mb-2"
            >
              {sectionConfig.title}
            </motion.h2>
            <motion.h3 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter leading-[0.85]"
            >
              {sectionConfig.subtitle.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word === "Legends" ? <span className="text-accent-light">{word}</span> : word}
                  {i === 1 && <br />}
                  {i !== sectionConfig.subtitle.split(' ').length - 1 && " "}
                </React.Fragment>
              ))}
            </motion.h3>
          </div>
          
          <div className="md:pt-16 max-w-sm">
             <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={16} className="text-accent-light/50" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Verified Mastery</span>
             </div>
             <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-sm leading-relaxed border-l border-zinc-200 dark:border-zinc-900 transition-colors duration-300 pl-6"
              >
                {sectionConfig.description}
              </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900/50 border border-zinc-200 dark:border-zinc-900 transition-colors duration-300">
          {siteConfig.staff.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={cn(
                "group relative bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 p-8 hover:bg-zinc-900/40 transition-colors duration-500",
                siteConfig.features.showBooking && "cursor-pointer"
              )}
              onClick={siteConfig.features.showBooking ? onBookClick : undefined}
            >
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                 <Fingerprint size={40} className="text-accent-light" />
              </div>
              
              <div className="mb-8 relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-accent-light/30 group-hover:border-accent-light transition-colors" />
                <div className="aspect-[4/5] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 relative z-10">
                  <img
                    src={member.photoUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    alt={member.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                </div>
                
                {/* ID Tag overlay */}
                <div className="absolute -bottom-4 -right-4 bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 p-3 z-20 group-hover:border-accent-light/50 transition-colors shadow-2xl">
                   <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Index ID</p>
                   <p className="font-mono text-[10px] text-accent-light font-bold">LEGEND_{member.id.toUpperCase()}_0{index + 1}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-2xl font-black text-zinc-950 dark:text-white uppercase tracking-tight group-hover:text-accent-light transition-colors">
                     {member.name}
                   </h4>
                   <ExternalLink size={14} className="text-zinc-700 group-hover:text-accent-light transition-colors" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                   <span className="px-2 py-0.5 bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                      {member.specialty}
                   </span>
                   <span className="px-2 py-0.5 bg-white dark:bg-zinc-900 transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded text-[9px] font-black text-accent-light/50 uppercase tracking-widest">
                      Active Deployment
                   </span>
                </div>

                <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3 group-hover:text-zinc-600 dark:text-zinc-300 transition-colors duration-300 transition-colors">
                  {member.bio}
                </p>

                <div className="pt-6 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300 group-hover:border-zinc-200 dark:border-zinc-800 transition-colors duration-300 transition-colors">
                   <div className="flex gap-4">
                      {member.social?.instagram && (
                        <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-zinc-700 hover:text-accent-light transition-colors">
                          <Instagram size={16} />
                        </a>
                      )}
                      {member.social?.twitter && (
                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-zinc-700 hover:text-accent-light transition-colors">
                          <Twitter size={16} />
                        </a>
                      )}
                   </div>
                   {siteConfig.features.showBooking && (
                     <div className="flex items-center gap-2 text-accent-light">
                        <Database size={12} className="animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Request Access</span>
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.1);
        }
        .group:hover .outline-text {
          -webkit-text-stroke: 1px rgba(245, 158, 11, 0.3);
        }
      `}</style>
    </section>
  );
}
