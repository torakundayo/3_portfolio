'use client';

import { useEffect } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';

/**
 * Global breathing cycle that modulates ALL environment animations.
 *
 * Returns a MotionValue<number> oscillating between 0 and 1:
 * - 1 = "inhale" peak — environment is fully active
 * - 0 = "exhale" trough — environment quiets down
 *
 * Asymmetric cycle: inhale is faster (3s), exhale is slower (5s).
 * Total period: 8 seconds.
 *
 * Uses requestAnimationFrame + MotionValue → zero React re-renders.
 * Consumers use useTransform() to derive their own values.
 */

const PERIOD = 8000; // 8 seconds per breath
const INHALE_RATIO = 0.375; // 3s / 8s = 0.375

export function useBreathingCycle(): MotionValue<number> {
  const phase = useMotionValue(0.5); // Start at mid-breath

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) % PERIOD;
      const t = elapsed / PERIOD;

      // Asymmetric sine wave:
      // 0 → INHALE_RATIO: fast rise from 0 to 1 (inhale)
      // INHALE_RATIO → 1: slow descent from 1 to 0 (exhale)
      const value = t < INHALE_RATIO
        ? Math.sin((t / INHALE_RATIO) * Math.PI * 0.5) // 0→1 in 3s
        : Math.cos(((t - INHALE_RATIO) / (1 - INHALE_RATIO)) * Math.PI * 0.5); // 1→0 in 5s

      phase.set(value);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  return phase;
}
