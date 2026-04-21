import React, { useEffect, useRef, useState } from "react";
import CoffeeWaves from "./CoffeeWaves";

type SteamParticlesProps = {
  count?: number;
};

const SteamParticles = ({ count = 5 }: SteamParticlesProps) => {
  const config = [
    { left: "20%", delay: "0s", size: 60 },
    { left: "40%", delay: "1.5s", size: 80 },
    { left: "60%", delay: "3s", size: 60 },
    { left: "30%", delay: "4.5s", size: 50 },
    { left: "70%", delay: "2s", size: 70 },
  ];

  return (
    <>
      {config.slice(0, count).map((p, i) => (
        <div
          key={i}
          className="animate-steam pointer-events-none absolute bottom-0 rounded-full"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            background: "radial-gradient(circle, rgba(245,230,211,0.4) 0%, transparent 70%)",
          }}
        />
      ))}
    </>
  );
};

export function Hero({ onBookClick: _onBookClick }: { onBookClick: () => void }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const steamRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!contentRef.current || !steamRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      contentRef.current.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
      steamRef.current.style.transform = `translateX(calc(-50% + ${x}px))`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      setScrollProgress(progress);
      if (contentRef.current) {
        contentRef.current.style.opacity = String(1 - progress);
        contentRef.current.style.transform = `translateY(${-progress * 50}px)`;
      }
      if (steamRef.current) steamRef.current.style.opacity = String(1 - progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const titleText = "Aroma Vivo";

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-[#1a0f0a] font-serif">
      <style>{`
        @keyframes steam {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          15% { opacity: 0.6; }
          50% { transform: translateY(-150px) translateX(20px) scale(1.5); opacity: 0.3; }
          100% { transform: translateY(-350px) translateX(-30px) scale(2); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes letterReveal {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(1); opacity: 0.6; }
          50% { transform: scaleY(0.5); opacity: 1; }
        }
        .animate-steam { animation: steam 6s infinite ease-out; }
        .animate-fadeInUp { animation: fadeInUp 1s ease forwards; }
        .animate-letterReveal { animation: letterReveal 0.8s ease forwards; }
        .animate-scrollPulse { animation: scrollPulse 2s infinite; }
      `}</style>

      <CoffeeWaves scrollProgress={scrollProgress} />

      <div
        ref={steamRef}
        className="absolute bottom-[20%] left-1/2 z-[2] h-[300px] w-[200px] -translate-x-1/2 pointer-events-none transition-opacity duration-300 md:h-[400px] md:w-[300px]"
      >
        <SteamParticles count={5} />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 px-4 text-center text-[#F5E6D3] transition-opacity duration-300 will-change-transform"
      >
        <p
          className="animate-fadeInUp mb-8 text-xs uppercase tracking-[6px] text-[#D4A574] md:text-sm"
          style={{ animationDelay: "0.5s", opacity: 0 }}
        >
          Desde 2024 · Tostado Artesanal
        </p>

        <h1 className="mb-6 text-[clamp(3rem,8vw,7rem)] font-light leading-none">
          {titleText.split("").map((char, i) => (
            <span
              key={i}
              className="animate-letterReveal inline-block"
              style={{
                animationDelay: `${0.8 + i * 0.1}s`,
                textShadow: "0 4px 30px rgba(212,165,116,0.3)",
                opacity: 0,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <p
          className="animate-fadeInUp mx-auto mb-10 max-w-[500px] px-4 text-base leading-relaxed text-[#D4A574] md:text-xl"
          style={{ animationDelay: "2s", opacity: 0 }}
        >
          Cada taza cuenta una historia. Deja que el cafe te hable antes del primer sorbo.
        </p>

        <a
          href="#menu"
          className="animate-fadeInUp group relative z-[1] inline-block overflow-hidden border border-[#D4A574] px-8 py-3 text-xs uppercase tracking-[3px] text-[#F5E6D3] transition-colors duration-400 md:px-10 md:py-4 md:text-sm"
          style={{ animationDelay: "2.3s", opacity: 0 }}
        >
          <span className="absolute left-1/2 top-1/2 -z-[1] h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4A574] transition-all duration-600 group-hover:h-[300px] group-hover:w-[300px]" />
          <span className="relative z-10 transition-colors duration-400 group-hover:text-[#2C1810]">
            Descubri el Menu
          </span>
        </a>
      </div>

      <div
        className="animate-fadeInUp absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        style={{ animationDelay: "3s", opacity: 0 }}
      >
        <div className="animate-scrollPulse h-[60px] w-px bg-gradient-to-b from-[#D4A574] to-transparent" />
      </div>
    </section>
  );
}
