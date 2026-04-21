import React from "react";
import * as Icons from "lucide-react";
import { motion } from "motion/react";
import { siteConfig } from "../../config/site";

/** Nombre escrito “a mano”: letras en secuencia con ligera irregularidad. */
function HandwrittenName({
  text,
  delayStart,
}: {
  text: string;
  delayStart: number;
}) {
  const chars = React.useMemo(() => text.split(""), [text]);
  const stagger =
    chars.length > 0 ? Math.min(0.07, 1.15 / Math.max(chars.length, 10)) : 0.06;

  const container = {
    hidden: {},
    show: {
      transition: {
        delayChildren: delayStart,
        staggerChildren: stagger,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 6, rotate: -3 },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      animate="show"
      aria-hidden
      className="flex flex-wrap justify-center gap-y-1 text-center font-[family-name:'Caveat',cursive] text-4xl font-semibold tracking-wide text-white md:text-5xl"
      style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={item}
          className="inline-block min-w-[0.15em]"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.p>
  );
}

export function SplashScreen() {
  const { brand } = siteConfig;
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
      initial={{ y: 0 }}
      exit={{
        y: "-100%",
        transition: {
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
    >
      <h1 className="sr-only">{brand.name}</h1>

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-8 px-8 text-center">
        {brand.logo ? (
          <>
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="will-change-[clip-path]"
              aria-hidden
            >
              <img
                src={brand.logoDark ?? brand.logo}
                alt=""
                className="h-16 w-auto max-w-[min(280px,85vw)] object-contain md:h-20"
              />
            </motion.div>
            <HandwrittenName text={brand.name} delayStart={0.35} />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-elevated md:h-24 md:w-24"
              aria-hidden
            >
              <BrandIcon className="text-primary-foreground" size={40} />
            </motion.div>
            <HandwrittenName text={brand.name} delayStart={0.2} />
          </>
        )}
      </div>
    </motion.div>
  );
}
