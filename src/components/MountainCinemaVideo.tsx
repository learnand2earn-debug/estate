'use client';

import React, { useEffect, useRef, useState } from 'react';

interface MountainCinemaVideoProps {
  mode?: 'hero' | 'section';
  atmosphere?: 'golden-sunset' | 'morning-mist' | 'alpine-twilight';
  className?: string;
}

export function MountainCinemaVideo({
  mode = 'hero',
  atmosphere = 'golden-sunset',
  className = '',
}: MountainCinemaVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let startTime = performance.now();

    // Generate deterministic cloud & mist particles
    const clouds = Array.from({ length: 14 }, (_, i) => ({
      x: (i * 137) % 1280,
      y: 130 + ((i * 53) % 210),
      w: 260 + (i % 4) * 90,
      h: 36 + (i % 3) * 16,
      speed: 0.18 + (i % 5) * 0.06,
      alpha: 0.08 + (i % 4) * 0.04,
    }));

    const drawFrame = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Sky Gradient based on atmosphere
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (atmosphere === 'golden-sunset') {
        skyGrad.addColorStop(0, '#09120F');
        skyGrad.addColorStop(0.38, '#102B24');
        skyGrad.addColorStop(0.72, '#3C3626');
        skyGrad.addColorStop(1, '#101614');
      } else if (atmosphere === 'morning-mist') {
        skyGrad.addColorStop(0, '#0D1B17');
        skyGrad.addColorStop(0.48, '#1B3D33');
        skyGrad.addColorStop(0.82, '#4A635A');
        skyGrad.addColorStop(1, '#101614');
      } else {
        skyGrad.addColorStop(0, '#060B09');
        skyGrad.addColorStop(0.5, '#0E221C');
        skyGrad.addColorStop(0.85, '#1B352D');
        skyGrad.addColorStop(1, '#101614');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Golden Sun / Moon Glow
      const sunX = w * 0.72 + Math.sin(elapsed * 0.25) * 20;
      const sunY = h * 0.28;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, w * 0.42);
      sunGrad.addColorStop(
        0,
        atmosphere === 'alpine-twilight'
          ? 'rgba(220, 229, 224, 0.45)'
          : 'rgba(243, 215, 155, 0.55)'
      );
      sunGrad.addColorStop(0.35, 'rgba(199, 166, 106, 0.18)');
      sunGrad.addColorStop(1, 'rgba(16, 43, 36, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, w, h);

      // 3. Multi-layered Parallax Himalayan Ridges
      const drawRidge = (
        baseY: number,
        amp: number,
        freq: number,
        speedOffset: number,
        fill: string
      ) => {
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 24) {
          const nx = x * freq + elapsed * speedOffset;
          const y =
            baseY -
            Math.sin(nx) * amp -
            Math.cos(nx * 2.1) * (amp * 0.45) -
            Math.sin(nx * 0.5) * (amp * 0.3);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
      };

      drawRidge(h * 0.54, 68, 0.0032, 0.08, 'rgba(19, 46, 38, 0.75)');
      drawRidge(h * 0.63, 55, 0.0045, 0.14, 'rgba(14, 35, 29, 0.88)');

      // 4. Moving Volumetric Clouds Between Mountain Ridges
      for (const c of clouds) {
        const cx = ((c.x + elapsed * c.speed * 60) % (w + c.w)) - c.w * 0.5;
        const cloudGrad = ctx.createRadialGradient(
          cx,
          c.y,
          c.h * 0.2,
          cx,
          c.y,
          c.w * 0.5
        );
        cloudGrad.addColorStop(0, `rgba(220, 229, 224, ${c.alpha})`);
        cloudGrad.addColorStop(1, 'rgba(220, 229, 224, 0)');
        ctx.fillStyle = cloudGrad;
        ctx.fillRect(cx - c.w * 0.5, c.y - c.h, c.w, c.h * 2);
      }

      // 5. Foreground Pine Forest Silhouette & Glowing Mountain Chalets
      drawRidge(h * 0.74, 42, 0.006, 0.22, '#0B1A15');

      // Warm Distant Villa Lights on the Ridge
      const villaPositions = [
        { rx: 0.22, ry: 0.67 },
        { rx: 0.235, ry: 0.675 },
        { rx: 0.58, ry: 0.64 },
        { rx: 0.595, ry: 0.645 },
        { rx: 0.78, ry: 0.69 },
      ];
      villaPositions.forEach((vp, idx) => {
        const vx = vp.rx * w - ((elapsed * 8) % 40);
        const vy = vp.ry * h;
        const pulse = 0.75 + 0.25 * Math.sin(elapsed * 2 + idx);
        ctx.fillStyle = `rgba(255, 220, 150, ${0.8 * pulse})`;
        ctx.fillRect(vx, vy, 8, 5);
        ctx.fillRect(vx + 11, vy, 8, 5);
      });

      if (!prefersReducedMotion && isPlaying) {
        animId = requestAnimationFrame(drawFrame);
      }
    };

    // Draw initial frame immediately
    drawFrame(performance.now());

    // Stream canvas into the <video> element so a genuine HTML5 <video> plays continuously
    if (video && typeof (canvas as any).captureStream === 'function') {
      try {
        const stream = (canvas as any).captureStream(24);
        if (video.srcObject !== stream) {
          video.srcObject = stream;
          video.play().catch(() => {
            // Autoplay fallback handled silently by underlying canvas
          });
        }
      } catch {
        // Fallback to direct canvas visibility
      }
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [atmosphere, isPlaying]);

  return (
    <div className={`relative overflow-hidden bg-[#101614] ${className}`}>
      {/* Underlying live procedural canvas */}
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Genuine HTML5 looping background video element */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Crect width='1600' height='900' fill='%23101614'/%3E%3C/svg%3E"
        className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none"
        data-testid={mode === 'hero' ? 'hero-background-video' : 'section-background-video'}
      />

      {/* Cinematic Dark Forest & Mist Scrim Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(16,22,20,0.72) 0%, rgba(16,43,36,0.38) 45%, rgba(16,22,20,0.92) 100%)',
        }}
      />

      {mode === 'section' && (
        <div className="absolute bottom-5 right-6 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="px-3.5 py-1.5 rounded-md bg-[#101614]/85 border border-[#C7A66A]/40 text-xs font-medium text-[#DCE5E0] hover:border-[#C7A66A] transition-colors whitespace-nowrap shrink-0"
          >
            {isPlaying ? 'Pause Aerial Reel' : 'Play Aerial Reel'}
          </button>
        </div>
      )}
    </div>
  );
}
