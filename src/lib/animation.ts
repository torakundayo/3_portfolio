import type { CSSProperties } from 'react';

/* ═══ Spring configs (design-principles compliant) ═══ */
export const SPRING_ENTER = { type: 'spring' as const, stiffness: 60, damping: 18 };
export const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 300, damping: 24 };

/* ═══ Fade transition (for opacity/filter which don't support spring) ═══ */
export const FADE_EASE = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

/* ═══ PRNG ═══ */
export function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

/* ═══ Organic border radius ═══ */
export const organicRadius = '2rem 1.4rem 2.4rem 1.6rem / 1.6rem 2rem 1.4rem 2.2rem';

/* ═══ ai-breathe style generator ═══ */
export function breatheStyle(index: number): CSSProperties {
  return {
    animation: `ai-breathe ${3.2 + index * 0.7}s ease-in-out infinite`,
    animationDelay: `${1.5 + index * 0.4}s`,
  };
}

/* ═══ ai-reveal style generator — text reveals left-to-right via clipPath ═══ */
export function revealStyle(index: number): CSSProperties {
  return {
    animation: `ai-reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) both`,
    animationDelay: `${index * 0.15}s`,
  };
}

/* ═══ Focus-in: card/node elements emerge from blur + scale ═══ */
export const FOCUS_IN_VARIANTS = {
  hidden: { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/* ═══ Text reveal: clipPath wipe (no translateY) ═══ */
export const TEXT_REVEAL_VARIANTS = {
  hidden: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
  visible: (i: number) => ({
    opacity: 1,
    clipPath: 'inset(0 0% 0 0)',
    transition: {
      duration: 0.8,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/* ═══ Card float — structural liveliness for card containers ═══ */
export function cardFloatStyle(index: number): CSSProperties {
  return {
    animation: `card-float ${8 + index * 1.5}s ease-in-out infinite`,
    animationDelay: `${index * 0.6}s`,
  };
}

/* ═══ Element drift — for decorative elements ═══ */
export function driftStyle(index: number): CSSProperties {
  return {
    animation: `element-drift ${12 + index * 2}s ease-in-out infinite`,
    animationDelay: `${index * 0.8}s`,
  };
}

/* ═══ Layout variant classifier (T-021) ═══ */
export type LayoutVariant = 'A' | 'B' | 'C';

export function getLayoutVariant(layoutVariant: number): LayoutVariant {
  if (layoutVariant < 0.33) return 'A';
  if (layoutVariant < 0.66) return 'B';
  return 'C';
}

/* ═══ Seed-based stagger for entry animations (T-022) ═══ */
export function seededStagger(seed: number) {
  const r = seededRandom(Math.round(seed * 1000));
  const stagger = 0.12 + r() * 0.12; // 0.12–0.24s
  const reverse = r() > 0.5;
  return { stagger, reverse };
}

/* ═══ Seed-based decoration offset (T-022) ═══ */
export function seededDecoration(seed: number, index: number) {
  const r = seededRandom(Math.round(seed * 1000) + index * 37);
  return {
    angle: r() * 360,
    offsetX: r() * 30 - 15,
    offsetY: r() * 20 - 10,
    gridSize: 50 + Math.round(r() * 30),
  };
}
