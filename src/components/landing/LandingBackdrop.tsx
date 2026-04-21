import React from "react";
import { siteConfig } from "../../config/site";

/**
 * Fondo tipo “parallax”: la imagen va `sticky` al viewport solo mientras el bloque
 * Hero + Servicios está en pantalla; al terminar Servicios sube con el scroll y no
 * queda detrás del resto del sitio.
 */
export function LandingBackdrop({ children }: { children: React.ReactNode }) {
  const { hero } = siteConfig;

  return (
    <div className="relative isolate">
      {/* Capa sticky (100svh): se pega arriba hasta que este bloque termina */}
      <div
        className="pointer-events-none sticky top-0 z-[5] h-[100svh] w-full overflow-hidden"
        aria-hidden
      >
        <img
          src={hero.backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-background" />
      </div>

      {/* Contenido encima de la ranura sticky (solapa exactamente la altura del viewport) */}
      <div className="relative z-10 -mt-[100svh]">{children}</div>
    </div>
  );
}
