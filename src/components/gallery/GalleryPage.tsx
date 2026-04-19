import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Maximize2, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { siteConfig } from "../../config/site";
import { cn } from "../../lib/utils";

export function GalleryPage({ onBack }: { onBack: () => void }) {
  const { gallery, sections } = siteConfig;
  const { gallery: sectionConfig } = sections;
  const [selectedImage, setSelectedImage] = React.useState<number | null>(null);

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % gallery.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + gallery.length) % gallery.length);
    }
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 uppercase text-[10px] font-black tracking-[0.2em]"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Return to Base
            </button>
            <h1 className="text-5xl md:text-7xl font-black text-zinc-950 dark:text-white uppercase tracking-tighter leading-none mb-4">
              Visual <span className="text-accent-light">Manifest</span>
            </h1>
            <p className="text-zinc-500 max-w-xl text-sm leading-relaxed uppercase tracking-widest font-medium">
              {sectionConfig.title}: {sectionConfig.subtitle} - A comprehensive documentation of operational excellence.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
             <div className="w-10 h-10 bg-accent-light/10 rounded-xl flex items-center justify-center text-accent-light">
                <Camera size={20} />
             </div>
             <div>
                <p className="text-zinc-950 dark:text-white text-sm font-black uppercase tracking-tight">{gallery.length} DEPLOYMENTS</p>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">In Archive</p>
             </div>
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {gallery.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative group rounded-3xl overflow-hidden cursor-zoom-in break-inside-avoid shadow-2xl"
              onClick={() => setSelectedImage(i)}
            >
              <img
                src={src}
                className="w-full h-auto grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                alt={`Operational Documentation ${i + 1}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-accent-light text-[8px] font-black uppercase tracking-widest mb-1">Sector 0{i + 1}</p>
                       <p className="text-zinc-950 dark:text-white text-[10px] font-black uppercase tracking-[0.1em]">Visual Record</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-zinc-950 dark:text-white">
                       <Maximize2 size={14} />
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-xl p-4 md:p-10 transition-colors"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-zinc-950/50 dark:text-white/50 hover:text-zinc-950 dark:hover:text-white p-3 hover:bg-surface-dark/10 dark:hover:bg-white/10 rounded-full transition-all"
            >
              <X size={32} />
            </button>

            <button 
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-950/50 dark:text-white/50 hover:text-zinc-950 dark:hover:text-white p-4 hover:bg-surface-dark/10 dark:hover:bg-white/10 rounded-full transition-all hidden md:block"
            >
              <ChevronLeft size={40} />
            </button>

            <button 
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-950/50 dark:text-white/50 hover:text-zinc-950 dark:hover:text-white p-4 hover:bg-surface-dark/10 dark:hover:bg-white/10 rounded-full transition-all hidden md:block"
            >
              <ChevronRight size={40} />
            </button>

            <motion.div
              layoutId={gallery[selectedImage]}
              className="relative max-w-5xl w-full max-h-full aspect-auto rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.1)] border border-white/5"
            >
              <img
                src={gallery[selectedImage]}
                className="w-full h-full object-contain"
                alt="Selected Documentation"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
                 <p className="text-accent-light text-xs font-black uppercase tracking-[0.3em] mb-2">Operational Frame 0{selectedImage + 1}</p>
                 <h2 className="text-zinc-950 dark:text-white text-2xl md:text-3xl font-black uppercase tracking-tight">Project Documentation Archive</h2>
                 <p className="text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-xs uppercase tracking-widest mt-2">{selectedImage + 1} / {gallery.length} Records</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
