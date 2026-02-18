'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { seededRandom } from '@/lib/animation';
import type { AccentPalette } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { useBreathingCycle } from '@/hooks/useBreathingCycle';

/* ═══ DepthLayer — parallax layer driven by mouse ═══ */
export function DepthLayer({
  depth, mouseX, mouseY, children, className = '', factorMultiplier = 2,
}: {
  depth: number; mouseX: MotionValue<number>; mouseY: MotionValue<number>;
  children: React.ReactNode; className?: string; factorMultiplier?: number;
}) {
  const stiffness = 45 - depth * 5;
  const sx = useSpring(mouseX, { stiffness, damping: 22 });
  const sy = useSpring(mouseY, { stiffness, damping: 22 });
  const factor = Math.max(0, (3 - depth) * factorMultiplier);
  const x = useTransform(sx, (v) => v * factor);
  const y = useTransform(sy, (v) => v * factor);
  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ x, y, willChange: 'transform', isolation: 'isolate' as const }}
    >
      {children}
    </motion.div>
  );
}

/* ═══ OrbitalRings — subtle rotating ellipses with breathing modulation ═══ */
export function OrbitalRings({ palette, breathPhase }: {
  palette: AccentPalette; breathPhase: MotionValue<number>;
}) {
  // Modulate stroke opacity with breathing: exhale 0.3x → inhale 1.0x
  const breathOpacity = useTransform(breathPhase, [0, 1], [0.3, 1.0]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {[14, 27, 40].map((r, i) => (
        <motion.ellipse
          key={i} cx="50%" cy="50%" rx={`${r}%`} ry={`${r * 0.42}%`}
          fill="none" stroke={`${palette.primary}${i === 0 ? '25' : '18'}`}
          strokeWidth="0.7" strokeDasharray="4 16"
          animate={{ opacity: [0.20, 0.40, 0.20], rotate: i % 2 === 0 ? [0, 360] : [360, 0] }}
          transition={{
            opacity: { duration: 14, repeat: Infinity, ease: 'easeInOut', delay: i * 4 },
            rotate: { duration: 100 + i * 30, repeat: Infinity, ease: 'linear' },
          }}
          style={{ transformOrigin: '50% 50%', opacity: breathOpacity, willChange: 'transform, opacity' }}
        />
      ))}
    </svg>
  );
}

/* ═══ AmbientParticles — CSS @keyframes driven (T-025) ═══ */
export function AmbientParticles({ count = 8, palette, attractionStrength = 0, breathPhase }: {
  count?: number; palette: AccentPalette; attractionStrength?: number;
  breathPhase: MotionValue<number>;
}) {
  // Quantize attraction to avoid excessive re-memos (0, 0.15, 0.35, 0.6)
  const quantizedAttraction = attractionStrength > 0.25 ? 0.6
    : attractionStrength > 0.15 ? 0.35
    : attractionStrength > 0.05 ? 0.15
    : 0;

  const particles = useMemo(() => {
    const r = seededRandom(42);
    return Array.from({ length: count }, (_, i) => {
      const x = (r() - 0.5) * 88;
      const y = (r() - 0.5) * 88;
      const attractBias = quantizedAttraction;
      const distFromCenter = Math.sqrt(x * x + y * y) / 44;
      const distFactor = 0.5 + distFromCenter * 0.5;
      const dx = [
        (r() - 0.5) * 45 * (1 - attractBias * 0.4) - x * attractBias * distFactor,
        (r() - 0.5) * 35 * (1 - attractBias * 0.3) - x * attractBias * 0.7 * distFactor,
        (r() - 0.5) * 40 * (1 - attractBias * 0.2) - x * attractBias * 0.3,
      ];
      const dy = [
        (r() - 0.5) * 40 * (1 - attractBias * 0.4) - y * attractBias * distFactor,
        (r() - 0.5) * 45 * (1 - attractBias * 0.3) - y * attractBias * 0.7 * distFactor,
        (r() - 0.5) * 30 * (1 - attractBias * 0.2) - y * attractBias * 0.3,
      ];
      return {
        id: i, x, y,
        size: 2.0 + r() * 5.0,
        dur: attractBias > 0.3 ? 18 + r() * 20 : 24 + r() * 26,
        delay: r() * 10,
        dx, dy,
        op: 0.15 + r() * 0.35,
        glow: r() > 0.65,
      };
    });
  }, [count, quantizedAttraction]);

  // Generate unique CSS @keyframes for each particle (runs on compositor thread)
  const keyframesCSS = useMemo(() =>
    particles.map(p =>
      `@keyframes pd-${p.id}{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(${p.dx[0]}px,${p.dy[0]}px) scale(1.4)}50%{transform:translate(${p.dx[1]}px,${p.dy[1]}px) scale(0.6)}75%{transform:translate(${p.dx[2]}px,${p.dy[2]}px) scale(1.3)}}`
    ).join(''),
    [particles]
  );

  // Breathing modulation for particle opacity: exhale 0.3x → inhale 1.0x
  const breathMod = useTransform(breathPhase, [0, 1], [0.3, 1.0]);

  return (
    <>
      <style>{keyframesCSS}</style>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size, height: p.size,
            left: `calc(50% + ${p.x}vw)`, top: `calc(50% + ${p.y}vh)`,
            background: p.glow ? `${palette.glow}50` : `${palette.primary}${Math.round(p.op * 255).toString(16).padStart(2, '0')}`,
            boxShadow: p.glow ? `0 0 ${p.size * 8}px ${palette.glow}40` : undefined,
            opacity: breathMod,
            animation: `pd-${p.id} ${p.dur}s ease-in-out ${p.delay}s infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </>
  );
}

/* ═══ MouseGlow — cursor-following radial gradient with breathing ═══ */
export function MouseGlow({ mouseX, mouseY, palette, intensityBoost = 0, breathPhase }: {
  mouseX: MotionValue<number>; mouseY: MotionValue<number>; palette: AccentPalette;
  intensityBoost?: number; breathPhase: MotionValue<number>;
}) {
  const sx = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const sy = useSpring(mouseY, { stiffness: 50, damping: 30 });
  const x = useTransform(sx, (v) => (v + 1) * 50 - 50);
  const y = useTransform(sy, (v) => (v + 1) * 50 - 50);

  // Breathing modulation for glow: exhale 0.4x → inhale 1.0x
  const breathGlow = useTransform(breathPhase, [0, 1], [0.4, 1.0]);

  return (
    <motion.div
      className="absolute w-[360px] h-[360px] rounded-full pointer-events-none"
      style={{
        left: 'calc(50% - 180px)', top: 'calc(50% - 180px)',
        x: useTransform(x, (v) => `${v}%`),
        y: useTransform(y, (v) => `${v}%`),
        background: `radial-gradient(circle, ${palette.primary}1a 0%, ${palette.secondary}12 40%, transparent 70%)`,
        opacity: breathGlow,
        willChange: 'transform, opacity',
      }}
      animate={{
        scale: [1, 1.06, 1],
        opacity: [0.8 + intensityBoost, 1 + intensityBoost * 0.5, 0.8 + intensityBoost],
      }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ═══ GradientMesh — performant CSS keyframe background with breathing ═══ */
export function GradientMesh({ palette, breathPhase, intensified = false }: {
  palette: AccentPalette; breathPhase: MotionValue<number>; intensified?: boolean;
}) {
  // Breathing modulation for mesh blobs: exhale 0.3x → inhale 1.0x
  const breathMesh = useTransform(breathPhase, [0, 1], [0.3, 1.0]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className={`absolute rounded-full blur-3xl ${intensified ? 'w-[75vw] h-[75vh]' : 'w-[60vw] h-[60vh]'}`}
        style={{
          background: `${palette.primary}${intensified ? '90' : '60'}`,
          left: '15%', top: '10%',
          animation: 'bg-drift-1 14s ease-in-out infinite',
          opacity: breathMesh,
        }}
      />
      <motion.div
        className={`absolute rounded-full blur-3xl ${intensified ? 'w-[65vw] h-[65vh]' : 'w-[50vw] h-[50vh]'}`}
        style={{
          background: `${palette.secondary}${intensified ? '70' : '50'}`,
          right: '10%', bottom: '15%',
          animation: 'bg-drift-2 16s ease-in-out infinite',
          opacity: breathMesh,
        }}
      />
      {/* Third blob for richer atmosphere when intensified */}
      {intensified && (
        <motion.div
          className="absolute w-[45vw] h-[45vh] rounded-full blur-3xl"
          style={{
            background: `${palette.glow}50`,
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'bg-drift-1 20s ease-in-out infinite reverse',
            opacity: breathMesh,
          }}
        />
      )}
    </div>
  );
}

/* ═══ Main TemplateShell ═══ */
export function TemplateShell({
  children,
  accentIndex = 0,
  disabled = false,
  centerAttract = false,
  glowIntensity = 0,
  particleAttraction = 0,
}: {
  children: React.ReactNode;
  accentIndex?: number;
  disabled?: boolean;
  centerAttract?: boolean;
  /** 0-1: behavior-driven boost to MouseGlow opacity */
  glowIntensity?: number;
  /** 0-1: behavior-driven particle attraction toward center */
  particleAttraction?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const palette = accentPalettes[accentIndex % accentPalettes.length];

  // Global breathing cycle — all sub-components modulate in sync
  const breathPhase = useBreathingCycle();

  const tiltConfig = { stiffness: 14, damping: 28 };
  const tiltX = useSpring(useTransform(mouseX, (v) => v * 0.3), tiltConfig);
  const tiltY = useSpring(useTransform(mouseY, (v) => v * -0.2), tiltConfig);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  if (disabled || !mounted) {
    return <>{children}</>;
  }

  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{ perspective: '1200px', contain: 'layout paint' }}
    >
      <motion.div className="absolute inset-0" style={{ rotateX: tiltY, rotateY: tiltX }}>
        {/* Background parallax layer */}
        <DepthLayer depth={3} mouseX={mouseX} mouseY={mouseY}>
          <GradientMesh palette={palette} breathPhase={breathPhase} intensified={centerAttract} />
          <OrbitalRings palette={palette} breathPhase={breathPhase} />
        </DepthLayer>

        {/* Content layer with 3D context */}
        <DepthLayer depth={1} mouseX={mouseX} mouseY={mouseY} className="z-[10]">
          <div
            className="absolute inset-0 pointer-events-auto"
            style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
          >
            {children}
          </div>
        </DepthLayer>

        {/* Foreground layer */}
        <DepthLayer depth={-1} mouseX={mouseX} mouseY={mouseY} className="z-[30]">
          <AmbientParticles
            count={centerAttract ? 40 : 20}
            palette={palette}
            attractionStrength={centerAttract ? 0.35 : particleAttraction}
            breathPhase={breathPhase}
          />
          <MouseGlow
            mouseX={mouseX} mouseY={mouseY}
            palette={palette}
            intensityBoost={glowIntensity}
            breathPhase={breathPhase}
          />
        </DepthLayer>
      </motion.div>
    </div>
  );
}
