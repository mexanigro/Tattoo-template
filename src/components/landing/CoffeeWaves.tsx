import React, { useRef, useEffect } from "react";

type CoffeeWavesProps = {
  scrollProgress?: number;
};

const CoffeeWaves = ({ scrollProgress = 0 }: CoffeeWavesProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#2C1810", "#3E2723", "#4E342E", "#6F4E37", "#8D6E63"];

    const drawWave = (
      yBase: number,
      amplitude: number,
      frequency: number,
      speed: number,
      color: string,
      alpha: number,
    ) => {
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 2) {
        const y =
          yBase +
          Math.sin(x * frequency + timeRef.current * speed) * amplitude +
          Math.sin(x * frequency * 0.5 + timeRef.current * speed * 1.3) * (amplitude * 0.5);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      timeRef.current += 0.01 + scrollProgress * 0.05;
      ctx.fillStyle = "#1a0f0a";
      ctx.fillRect(0, 0, width, height);

      drawWave(height * 0.85, 30, 0.003, 1.0, colors[1], 0.8);
      drawWave(height * 0.8, 25, 0.004, 1.2, colors[2], 0.7);
      drawWave(height * 0.75, 35, 0.0025, 0.8, colors[3], 0.6);
      drawWave(height * 0.7, 20, 0.005, 1.5, colors[4], 0.4);

      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.6,
        0,
        width * 0.5,
        height * 0.6,
        width * 0.8,
      );
      gradient.addColorStop(0, "rgba(212, 165, 116, 0.08)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [scrollProgress]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full z-[1]" />;
};

export default CoffeeWaves;
