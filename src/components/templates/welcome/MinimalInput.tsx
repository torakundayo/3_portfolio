'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
import type { TemplateProps } from '@/lib/types';
import type { IdleStage } from '@/hooks/useBehaviorObserver';
import { seededRandom } from '@/lib/animation';
import { accentPalettes } from '@/lib/visual-seed';

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

/* ── Floating keyword with cursor proximity and glow ── */
function DriftingKeyword({
  kw,
  path,
  mouseX,
  mouseY,
  onClick,
  glowColor,
  breathIndex,
}: {
  kw: (typeof KEYWORDS)[number];
  path: {
    baseX: number; baseY: number;
    entryDelay: number;
  };
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  onClick: () => void;
  glowColor: string;
  breathIndex: number;
}) {
  const proximity = useTransform(
    [mouseX, mouseY],
    ([mx, my]: number[]) => {
      if (typeof window === 'undefined') return 0;
      const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
      const kwX = window.innerWidth / 2 + path.baseX * vmin;
      const kwY = window.innerHeight / 2 + path.baseY * vmin;
      const dist = Math.hypot(mx - kwX, my - kwY);
      return Math.max(0, 1 - dist / 220);
    },
  );

  const smoothProx = useSpring(proximity, { stiffness: 80, damping: 20 });
  const proxScale = useTransform(smoothProx, [0, 0.5, 1], [1, 1.08, 1.18]);
  const proxGlow = useTransform(smoothProx, [0, 0.5, 1], [0.4, 0.7, 1]);

  return (
    <motion.div
      className="absolute z-20"
      style={{ left: '50%', top: '50%' }}
    >
      <motion.button
        onClick={onClick}
        className="group pointer-events-auto select-none cursor-pointer
                   text-gray-800 text-xl md:text-2xl font-semibold z-20 relative whitespace-nowrap
                   hover:text-gray-900 transition-colors duration-200"
        style={{
          scale: proxScale,
          opacity: proxGlow,
        }}
        initial={{ opacity: 0, scale: 0.5, filter: 'blur(12px)' }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          x: `calc(${path.baseX}vmin - 50%)`,
          y: `calc(${path.baseY}vmin - 50%)`,
        }}
        exit={{ opacity: 0, scale: 0.8, filter: 'blur(6px)', transition: { duration: 0.4 } }}
        transition={{
          opacity: { duration: 0.8, delay: path.entryDelay },
          scale: { type: 'spring', stiffness: 50, damping: 18, delay: path.entryDelay },
          filter: { duration: 0.8, delay: path.entryDelay },
          x: { type: 'spring', stiffness: 30, damping: 22, delay: path.entryDelay },
          y: { type: 'spring', stiffness: 30, damping: 22, delay: path.entryDelay },
        }}
      >
        {/* Glow circle behind keyword */}
        <span
          className="absolute inset-0 -z-10 rounded-full blur-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${glowColor}80, ${glowColor}30 50%, transparent 75%)`,
            transform: 'scale(4)',
            animation: `ai-breathe ${4 + breathIndex * 0.7}s ease-in-out infinite`,
            animationDelay: `${breathIndex * 0.8}s`,
          }}
        />
        {kw.label}
        {/* Hover underline indicator */}
        <span
          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)` }}
        />
      </motion.button>
    </motion.div>
  );
}

export function WelcomeMinimalInput({ onKeywordClick, visualSeed }: WelcomeProps) {
  const palette = accentPalettes[(visualSeed?.accentIndex ?? 0) % accentPalettes.length];
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [showKeywords, setShowKeywords] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [mouseX, mouseY]);

  // Show keywords after a short delay — always visible once shown
  useEffect(() => {
    const timer = setTimeout(() => setShowKeywords(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const paths = useMemo(() => {
    const r = seededRandom(77);
    return KEYWORDS.map((_, i) => {
      const baseAngle = (i / KEYWORDS.length) * Math.PI * 2 - Math.PI / 2;
      const angleJitter = (r() - 0.5) * 0.4;
      const angle = baseAngle + angleJitter;
      const radius = 18 + r() * 10;

      return {
        baseX: Math.cos(angle) * radius,
        baseY: Math.sin(angle) * radius * 0.6,
        entryDelay: 0.1 + i * 0.1,
      };
    });
  }, []);

  return (
    <div className="h-full w-full relative">
      <AnimatePresence>
        {showKeywords && KEYWORDS.map((kw, i) => (
          <DriftingKeyword
            key={kw.label}
            kw={kw}
            path={paths[i]}
            mouseX={mouseX}
            mouseY={mouseY}
            onClick={() => onKeywordClick?.(kw.query)}
            glowColor={i % 2 === 0 ? palette.primary : palette.glow}
            breathIndex={i}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
