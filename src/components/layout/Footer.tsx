import React from "react";
import * as Icons from "lucide-react";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import { siteConfig } from "../../config/site";

export function Footer({ 
  onAdminClick, 
  onPolicyClick,
  onPageChange
}: { 
  onAdminClick: () => void, 
  onPolicyClick: (policy: "privacy" | "terms" | "cancellation") => void,
  onPageChange: (page: "landing" | "gallery") => void
}) {
  const { contact, hours, brand } = siteConfig;
  const BrandIcon = (Icons as any)[brand.logoIconName || "Scissors"] || Icons.Scissors;

  return (
    <footer className="bg-zinc-100 dark:bg-black py-20 px-6 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-light rounded flex items-center justify-center">
              <BrandIcon className="text-zinc-950" size={18} />
            </div>
            <button 
              className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-100 transition-colors duration-300 uppercase hover:text-accent-light transition-colors"
              onClick={() => onPageChange("landing")}
            >
              {brand.name}
            </button>
          </div>
          <p className="text-zinc-600 dark:text-zinc-300 transition-colors duration-300 text-sm leading-relaxed max-w-xs">
            {brand.tagline}
          </p>
          <div className="flex gap-4">
            {contact.social.instagram && (
              <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-full text-zinc-500 dark:text-zinc-400 transition-colors duration-300 hover:text-accent-light transition-colors">
                <Instagram size={18} />
              </a>
            )}
            {contact.social.facebook && (
              <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-full text-zinc-500 dark:text-zinc-400 transition-colors duration-300 hover:text-accent-light transition-colors">
                <Facebook size={18} />
              </a>
            )}
            {contact.social.twitter && (
              <a href={contact.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-zinc-900 transition-colors duration-300 rounded-full text-zinc-500 dark:text-zinc-400 transition-colors duration-300 hover:text-accent-light transition-colors">
                <Twitter size={18} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-zinc-950 dark:text-white font-bold uppercase tracking-widest text-sm mb-6">Explore</h4>
          <ul className="space-y-4 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-sm">
            {siteConfig.features.showServices && (
              <li><button onClick={() => onPageChange("landing")} className="hover:text-accent-light transition-colors cursor-pointer">Our Services</button></li>
            )}
            {siteConfig.features.showTeam && (
              <li><button onClick={() => onPageChange("landing")} className="hover:text-accent-light transition-colors cursor-pointer">The Team</button></li>
            )}
            {siteConfig.features.showLocation && (
              <li><button onClick={() => onPageChange("landing")} className="hover:text-accent-light transition-colors cursor-pointer">Location</button></li>
            )}
            {siteConfig.features.showGallery && (
              <li><button onClick={() => onPageChange("gallery")} className="hover:text-accent-light transition-colors cursor-pointer">Portfolio</button></li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-300 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 text-[10px] uppercase tracking-[0.2em]">
        <p>© 2026 {brand.name}. All Rights Reserved.</p>
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={() => onPolicyClick("privacy")} className="hover:text-accent-light transition-colors cursor-pointer">Privacy Policy</button>
          <button onClick={() => onPolicyClick("terms")} className="hover:text-accent-light transition-colors cursor-pointer">Terms of Service</button>
          <button onClick={() => onPolicyClick("cancellation")} className="hover:text-accent-light transition-colors cursor-pointer">Cancellation Policy</button>
          <button 
             onClick={onAdminClick}
             className="hover:text-accent-light transition-colors cursor-pointer"
          >
            Admin Panel
          </button>
        </div>
      </div>
    </footer>
  );
}
