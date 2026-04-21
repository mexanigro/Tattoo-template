import React from "react";
import * as Icons from "lucide-react";
import { motion } from "motion/react";
import { siteConfig } from "../../config/site";

export function SplashScreen() {
  const { brand, hero, splash } = siteConfig;
  /** 4ª imagen del portfolio del preset (`gallery[3]`). */
  const fourthPortfolio = siteConfig.gallery?.[3];
  const imageSrc = splash.image ?? fourthPortfolio ?? hero.backgroundImage;
  const BrandIcon =
    (Icons as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[
      brand.logoIconName || "Scissors"
    ] || Icons.Scissors;

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${brand.name} welcome`}
      className="fixed inset-0 z-[260] flex flex-col items-center justify-center bg-black will-change-transform"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.03,
        transition: {
          duration: 1,
          ease: [0.18, 0.82, 0.22, 1],
        },
      }}
    >
      {/* Brand image */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={imageSrc}
          alt=""
          className="h-full w-full object-cover opacity-85"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/85"
          aria-hidden
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-w-lg flex-col items-center gap-8 px-8 text-center"
      >
        {brand.logo ? (
          <img
            src={brand.logoDark ?? brand.logo}
            alt={brand.name}
            className="h-16 w-auto max-w-[min(280px,85vw)] object-contain drop-shadow-xl md:h-20"
          />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-elevated md:h-24 md:w-24">
              <BrandIcon className="text-primary-foreground" size={40} />
            </div>
            <h1 className="font-serif text-4xl font-black tracking-wide text-white drop-shadow-md md:text-5xl">
              {brand.name}
            </h1>
          </div>
        )}

        <p className="text-sm font-medium uppercase tracking-[0.35em] text-white/75">
          {brand.tagline}
        </p>
      </motion.div>
    </motion.div>
  );
}
