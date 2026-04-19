import React from "react";
import * as Icons from "lucide-react";
import { Menu, X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { siteConfig } from "../../config/site";
import { ThemeToggle } from "../theme/ThemeToggle";

export function Navbar({ onBookClick, onPageChange, currentPage }: { 
  onBookClick: () => void, 
  onPageChange: (page: "landing" | "gallery") => void,
  currentPage: string 
}) {
  const BrandIcon = (Icons as any)[siteConfig.brand.logoIconName || "Scissors"] || Icons.Scissors;
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services", type: "anchor", enabled: siteConfig.features.showServices },
    { name: "Team", href: "#team", type: "anchor", enabled: siteConfig.features.showTeam },
    { name: "Why Us", href: "#why-choose-us", type: "anchor", enabled: siteConfig.features.showWhyChooseUs },
    { name: "Gallery", href: "#gallery", type: "page", enabled: siteConfig.features.showGallery },
    { name: "Stories", href: "#testimonials", type: "anchor", enabled: siteConfig.features.showTestimonials },
    { name: "Contact", href: "#contact", type: "anchor", enabled: siteConfig.features.showInquiry },
    { name: "Location", href: "#location", type: "anchor", enabled: siteConfig.features.showLocation },
  ].filter((link) => link.enabled);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange("landing");
    if (currentPage === "landing") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/90 dark:bg-surface-dark/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-200 dark:border-zinc-900 transition-colors duration-300" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a 
          href="/"
          onClick={handleHomeClick} 
          className="flex items-center gap-2 group outline-none"
        >
          <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
            <BrandIcon className="text-zinc-950" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-100 transition-colors duration-300 uppercase">
             {siteConfig.brand.name}
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.type === "anchor" && currentPage === "landing" ? (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-zinc-600 dark:text-zinc-500 dark:text-zinc-400 transition-colors duration-300 hover:text-accent-light transition-colors uppercase tracking-widest"
              >
                {link.name}
              </a>
            ) : (
              <button
                key={link.name}
                onClick={() => {
                  if (link.name === "Gallery") {
                    onPageChange("gallery");
                  } else {
                    if (link.href.startsWith('#')) {
                      window.location.hash = link.href;
                    }
                    onPageChange("landing");
                  }
                  setIsOpen(false);
                }}
                className={cn(
                  "text-sm font-semibold transition-colors uppercase tracking-widest",
                  currentPage === "gallery" && link.name === "Gallery" ? "text-accent-light" : "text-zinc-500 dark:text-zinc-400 transition-colors duration-300 hover:text-accent-light"
                )}
              >
                {link.name}
              </button>
            )
          ))}
          {siteConfig.features.showBooking && (
            <button
              onClick={onBookClick}
              className="flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 active:scale-95"
            >
              <Calendar size={18} />
              <span>BOOK NOW</span>
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="text-zinc-900 dark:text-zinc-100 transition-colors duration-300 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-zinc-50 dark:bg-surface-dark transition-colors duration-300 border-b border-zinc-200 dark:border-zinc-200 dark:border-zinc-900 transition-colors duration-300 p-6 md:hidden shadow-2xl transition-colors"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                link.type === "anchor" && currentPage === "landing" ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold text-zinc-900 dark:text-zinc-100 transition-colors duration-300 hover:text-accent-light transition-colors uppercase tracking-widest"
                  >
                    {link.name}
                  </a>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => {
                      if (link.name === "Gallery") {
                        onPageChange("gallery");
                      } else {
                        if (link.href.startsWith('#')) {
                          window.location.hash = link.href;
                        }
                        onPageChange("landing");
                      }
                      setIsOpen(false);
                    }}
                    className={cn(
                      "text-lg font-bold uppercase tracking-widest text-left transition-colors",
                      currentPage === "gallery" && link.name === "Gallery" ? "text-accent-light" : "text-zinc-900 dark:text-zinc-100 transition-colors duration-300 hover:text-accent-light"
                    )}
                  >
                    {link.name}
                  </button>
                )
              ))}
              {siteConfig.features.showBooking && (
                <button
                  onClick={() => {
                    onBookClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-white py-4 rounded-xl text-lg font-bold"
                >
                  <Calendar size={20} />
                  <span>BOOK APPOINTMENT</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
