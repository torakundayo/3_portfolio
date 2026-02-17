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

/* ═══ DepthLayer — parallax layer driven by mouse ═══ */
function DepthLayer({
  depth, mouseX, mouseY, children, className = '',
}: {
  depth: number; mouseX: MotionValue<number>; mouseY: MotionValue<number>;
  children: React.ReactNode; className?: string;
}) {
  const stiffness = 45 - depth * 5;
  const sx = useSpring(mouseX, { stiffness, damping: 22 });
  const sy = useSpring(mouseY, { stiffness, damping: 22 });
  const factor = Math.max(0, (3 - depth) * 5);
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

/* ═══ OrbitalRings — subtle rotating ellipses ═══ */
function OrbitalRings({ palette }: { palette: AccentPalette }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {[14, 27, 40].map((r, i) => (
        <motion.ellipse
          key={i} cx="50%" cy="50%" rx={`${r}%`} ry={`${r * 0.42}%`}
          fill="none" stroke={`${palette.primary}${i === 0 ? '08' : '05'}`}
          strokeWidth="0.5" strokeDasharray="2 14"
          animate={{ opacity: [0.01, 0.04, 0.01], rotate: i % 2 === 0 ? [0, 360] : [360, 0] }}
          transition={{
            opacity: { duration: 18, repeat: Infinity, ease: 'easeInOut', delay: i * 5 },
            rotate: { duration: 100 + i * 30, repeat: Infinity, ease: 'linear' },
          }}
          style={{ transformOrigin: '50% 50%' }}
        />
      ))}
    </svg>
  );
}

/* ═══ AmbientParticles — with optional center-attract for welcome state ═══ */
function AmbientParticles({ count = 8, palette, centerAttract = false }: {
  count?: number; palette: AccentPalette; centerAttract?: boolean;
}) {
  const particles = useMemo(() => {
    const r = seededRandom(42);
    return Array.from({ length: count }, (_, i) => {
      const x = (r() - 0.5) * 88;
      const y = (r() - 0.5) * 88;
      // When centerAttract is enabled, bias drift paths toward center
      // Particles further from center get a stronger inward pull
      const attractBias = centerAttract ? 0.35 : 0;
      const dx = [
        (r() - 0.5) * 45 - x * attractBias,
        (r() - 0.5) * 35 - x * attractBias * 0.5,
        (r() - 0.5) * 40,
      ];
      const dy = [
        (r() - 0.5) * 40 - y * attractBias,
        (r() - 0.5) * 45 - y * attractBias * 0.5,
        (r() - 0.5) * 30,
      ];
      return {
        id: i, x, y,
        size: 0.8 + r() * 2,
        dur: 24 + r() * 26, delay: r() * 10,
        dx, dy,
        op: 0.04 + r() * 0.12,
        glow: r() > 0.8,
      };
    });
  }, [count, centerAttract]);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size, height: p.size,
            left: `calc(50% + ${p.x}vw)`, top: `calc(50% + ${p.y}vh)`,
            background: p.glow ? `${palette.glow}40` : `rgba(255,255,255,${p.op})`,
            boxShadow: p.glow ? `0 0 ${p.size * 6}px ${palette.glow}25` : undefined,
          }}
          animate={{
            x: [0, p.dx[0], p.dx[1], p.dx[2], 0],
            y: [0, p.dy[0], p.dy[1], p.dy[2], 0],
            opacity: [p.op, p.op * 1.8, p.op * 0.2, p.op * 1.5, p.op],
            scale: [1, 1.4, 0.6, 1.3, 1],
          }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}
    </>
  );
}

/* ═══ MouseGlow — fixed: use transform instead of left/top ═══ */
function MouseGlow({ mouseX, mouseY, palette }: {
  mouseX: MotionValue<number>; mouseY: MotionValue<number>; palette: AccentPalette;
}) {
  const sx = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const sy = useSpring(mouseY, { stiffness: 50, damping: 30 });
  const x = useTransform(sx, (v) => (v + 1) * 50 - 50);
  const y = useTransform(sy, (v) => (v + 1) * 50 - 50);
  return (
    <motion.div
      className="absolute w-[360px] h-[360px] rounded-full pointer-events-none"
      style={{
        left: 'calc(50% - 180px)', top: 'calc(50% - 180px)',
        x: useTransform(x, (v) => `${v}%`),
        y: useTransform(y, (v) => `${v}%`),
        background: `radial-gradient(circle, ${palette.primary}09 0%, ${palette.secondary}06 40%, transparent 70%)`,
      }}
      animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ═══ GradientMesh — performant CSS keyframe background ═══ */
function GradientMesh({ palette }: { palette: AccentPalette }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
        style={{
          background: `${palette.primary}20`,
          left: '20%', top: '15%',
          animation: 'bg-drift-1 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
        style={{
          background: `${palette.secondary}15`,
          right: '15%', bottom: '20%',
          animation: 'bg-drift-2 22s ease-in-out infinite',
        }}
      />
    </div>
  );
}

/* ═══ Main TemplateShell ═══ */
export function TemplateShell({
  children,
  accentIndex = 0,
  disabled = false,
  centerAttract = false,
}: {
  children: React.ReactNode;
  accentIndex?: number;
  disabled?: boolean;
  centerAttract?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const palette = accentPalettes[accentIndex % accentPalettes.length];

  const tiltConfig = { stiffness: 14, damping: 28 };
  const tiltX = useSpring(useTransform(mouseX, (v) => v * 1.2), tiltConfig);
  const tiltY = useSpring(useTransform(mouseY, (v) => v * -0.9), tiltConfig);

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
          <GradientMesh palette={palette} />
          <OrbitalRings palette={palette} />
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
          <AmbientParticles count={8} palette={palette} centerAttract={centerAttract} />
          <MouseGlow mouseX={mouseX} mouseY={mouseY} palette={palette} />
        </DepthLayer>
      </motion.div>
    </div>
  );
}
