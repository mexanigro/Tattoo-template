import React from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { siteConfig } from "../../config/site";

export function Location() {
  const { contact, hours, sections } = siteConfig;
  const { location: sectionConfig } = sections;

  return (
    <section id="location" className="py-24 bg-white dark:bg-zinc-900 transition-colors duration-300 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div>
              <h2 className="text-accent-light font-bold uppercase tracking-[0.3em] text-xs mb-4">{sectionConfig.title}</h2>
              <h3 className="text-4xl md:text-6xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter">{sectionConfig.subtitle}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold uppercase text-xs tracking-widest mb-4">
                     <MapPin className="text-accent-light" size={18} />
                     <span>Address</span>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-sm">
                     {contact.address.street}<br />
                     {contact.address.district}<br />
                     {contact.address.cityStateZip}
                  </p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${contact.address.street}, ${contact.address.district}, ${contact.address.cityStateZip}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-light hover:text-white transition-colors group"
                  >
                    <span>Open in Maps</span>
                    <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
               </div>

               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold uppercase text-xs tracking-widest mb-4">
                     <Phone className="text-accent-light" size={18} />
                     <span>Contact</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a href={`tel:${contact.phone}`} className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-sm hover:text-accent-light transition-colors">
                       Phone: {contact.phone}
                    </a>
                    <a href={`mailto:${contact.email}`} className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-sm hover:text-accent-light transition-colors">
                       Email: {contact.email}
                    </a>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 border border-zinc-200 dark:border-zinc-800 transition-colors duration-300 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-accent-light font-bold uppercase text-xs tracking-widest mb-2">
                <Clock size={18} />
                <span>Hours of Operation</span>
              </div>
              <ul className="space-y-3 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-sm">
                <li className="flex justify-between border-b border-zinc-200 dark:border-zinc-900 transition-colors duration-300 pb-2">
                  <span>Monday - Thursday</span> 
                  <span className="text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-bold">
                    {hours.monday?.start} - {hours.monday?.end}
                  </span>
                </li>
                <li className="flex justify-between border-b border-zinc-200 dark:border-zinc-900 transition-colors duration-300 pb-2">
                  <span>Friday</span> 
                  <span className="text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-bold">
                    {hours.friday?.start} - {hours.friday?.end}
                  </span>
                </li>
                <li className="flex justify-between border-b border-zinc-200 dark:border-zinc-900 transition-colors duration-300 pb-2">
                  <span>Saturday</span> 
                  <span className="text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-bold">
                    {hours.saturday?.start} - {hours.saturday?.end}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span> 
                  {hours.sunday ? (
                    <span className="text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-bold">{hours.sunday.start} - {hours.sunday.end}</span>
                  ) : (
                    <span className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 font-black uppercase text-[10px]">Closed</span>
                  )}
                </li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="aspect-video lg:aspect-square rounded-3xl overflow-hidden grayscale border border-zinc-200 dark:border-zinc-800 transition-colors duration-300"
            >
              {/* This would be a Google Map in a real world app */}
              <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 transition-colors duration-300 flex items-center justify-center p-12 text-center text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
                 <div className="space-y-4">
                    <MapPin size={48} className="text-accent-light mx-auto" />
                    <p className="text-xl font-bold italic tracking-tight">MAP REPRESENTATION</p>
                    <p className="text-zinc-600 dark:text-zinc-300 transition-colors duration-300 text-xs uppercase tracking-widest">Integrating Google Maps API...</p>
                 </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1512690196236-724d90957dc3?auto=format&fit=crop&q=80&w=1000"
                className="w-full h-full object-cover opacity-20"
                alt="Map Background"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
