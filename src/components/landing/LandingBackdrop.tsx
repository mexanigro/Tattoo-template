import React from "react";
import { siteConfig } from "../../config/site";

/**
 * Imagen de fondo fija en viewport mientras el usuario recorre Hero + Servicios;
 * el contenido encima hace scroll con z-index superior.
 */
export function LandingBackdrop({ children }: { children: React.ReactNode }) {
  const { hero } = siteConfig;

  return (
    <div className="relative isolate">
      <div className="pointer-events-none fixed inset-0 z-[5]" aria-hidden>
        <img
          src={hero.backgroundImage}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        {/* Ayuda a fundir con la siguiente sección (Team, etc.) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-background" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
