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

/* ═══ ai-reveal style generator ═══ */
export function revealStyle(index: number): CSSProperties {
  return {
    animation: `ai-reveal 0.5s ease-out both`,
    animationDelay: `${index * 0.1}s`,
  };
}

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
