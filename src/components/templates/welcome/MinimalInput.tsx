'use client';

import { useMemo, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
import type { TemplateProps } from '@/lib/types';
import type { IdleStage } from '@/hooks/useIdleDetector';
import { seededRandom } from '@/lib/animation';

interface WelcomeProps extends TemplateProps {
  idleStage?: IdleStage;
  onKeywordClick?: (keyword: string) => void;
}

const KEYWORDS = [
  { label: 'Profile', query: 'プロフィールを見せて' },
  { label: 'Projects', query: 'プロジェクトを教えて' },
  { label: 'Skills', query: 'スキルは？' },
  { label: 'Career', query: '経歴を教えて' },
  { label: 'Values', query: '大切にしていることは？' },
  { label: 'Contact', query: '連絡先を教えて' },
];

/* ── Keyword that senses cursor proximity ── */
function ProximityKeyword({
  kw,
  pos,
  mouseX,
  mouseY,
  isSuggesting,
  onClick,
}: {
  kw: (typeof KEYWORDS)[number];
  pos: { x: number; y: number; delay: number };
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  isSuggesting: boolean;
  onClick: () => void;
}) {
  // Derive proximity factor (0–1) from cursor distance to this keyword
  const proximity = useTransform(
    [mouseX, mouseY],
    ([mx, my]: number[]) => {
      if (typeof window === 'undefined') return 0;
      const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
      const kwX = window.innerWidth / 2 + pos.x * vmin;
      const kwY = window.innerHeight / 2 + pos.y * vmin;
      const dist = Math.hypot(mx - kwX, my - kwY);
      return Math.max(0, 1 - dist / 220);
    },
  );

  // Smooth the proximity for organic feel
  const smoothProx = useSpring(proximity, { stiffness: 80, damping: 20 });

  // Proximity-driven visual effects
  const proxScale = useTransform(smoothProx, [0, 1], [1, 1.18]);
  const proxOpacity = useTransform(smoothProx, [0, 1], [0, 0.5]);
  const proxTextBrightness = useTransform(
    smoothProx,
    [0, 0.3, 1],
    [1, 1.2, 2.2],
  );

  return (
    // Outer wrapper: proximity-driven scale (composites with inner animate)
    <motion.div
      className="absolute z-20"
      style={{ left: '50%', top: '50%', scale: proxScale }}
    >
      <motion.button
        onClick={onClick}
        className="pointer-events-auto select-none cursor-pointer
                   text-white/30 text-xs tracking-widest uppercase
                   font-light z-20 relative"
        style={{ filter: useTransform(proxTextBrightness, (v) => `brightness(${v})`) }}
        initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
        animate={{
          opacity: isSuggesting ? [0.3, 0.6, 0.3] : 0.3,
          scale: 1,
          x: `calc(${pos.x}vmin - 50%)`,
          y: `calc(${pos.y}vmin - 50%)`,
        }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{
          opacity: isSuggesting
            ? { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: pos.delay }
            : { duration: 1.2, delay: pos.delay },
          scale: { type: 'spring', stiffness: 60, damping: 18, delay: pos.delay },
          x: { type: 'spring', stiffness: 40, damping: 20, delay: pos.delay },
          y: { type: 'spring', stiffness: 40, damping: 20, delay: pos.delay },
        }}
        whileHover={{
          scale: 1.15,
          opacity: 0.8,
          transition: { duration: 0.3 },
        }}
      >
        {kw.label}
      </motion.button>

      {/* Proximity glow behind keyword */}
      <motion.div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          opacity: proxOpacity,
          x: `calc(${pos.x}vmin - 50%)`,
          y: `calc(${pos.y}vmin - 50%)`,
        }}
      >
        <div
          className="w-16 h-8 -ml-4 -mt-2 rounded-full blur-xl"
          style={{
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.4), rgba(6,182,212,0.2), transparent)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function WelcomeMinimalInput({ idleStage = 'active', onKeywordClick }: WelcomeProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [mouseX, mouseY]);

  const positions = useMemo(() => {
    const r = seededRandom(77);
    return KEYWORDS.map((_, i) => {
      const angle = (i / KEYWORDS.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 22 + r() * 4;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.7,
        floatDx: (r() - 0.5) * 8,
        floatDy: (r() - 0.5) * 6,
        delay: i * 0.12,
      };
    });
  }, []);

  const showKeywords = idleStage === 'hint' || idleStage === 'suggest';
  const isSuggesting = idleStage === 'suggest';

  return (
    <div className="h-full w-full relative">
      <AnimatePresence>
        {showKeywords && KEYWORDS.map((kw, i) => (
          <ProximityKeyword
            key={kw.label}
            kw={kw}
            pos={positions[i]}
            mouseX={mouseX}
            mouseY={mouseY}
            isSuggesting={isSuggesting}
            onClick={() => onKeywordClick?.(kw.query)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
