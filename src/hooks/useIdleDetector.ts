'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type IdleStage = 'active' | 'nudge' | 'hint' | 'suggest';

const STAGE_THRESHOLDS = {
  nudge: 3000,    // 3s: strengthen input pulse
  hint: 6000,     // 6s: show floating keyword nodes
  suggest: 10000, // 10s: keywords start pulsing
} as const;

/**
 * Detects user idle state in stages.
 * Resets on mousemove, keydown, touchstart, or focus events.
 * Only active when `enabled` is true (e.g., welcome state).
 */
export function useIdleDetector(enabled: boolean) {
  const [stage, setStage] = useState<IdleStage>('active');
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const resetTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setStage('active');

    if (!enabledRef.current) return;

    timerRef.current.push(
      setTimeout(() => setStage('nudge'), STAGE_THRESHOLDS.nudge),
      setTimeout(() => setStage('hint'), STAGE_THRESHOLDS.hint),
      setTimeout(() => setStage('suggest'), STAGE_THRESHOLDS.suggest),
    );
  }, []);

  useEffect(() => {
    if (!enabled) {
      timerRef.current.forEach(clearTimeout);
      timerRef.current = [];
      setStage('active');
      return;
    }

    resetTimers();

    const events = ['mousemove', 'keydown', 'touchstart', 'pointerdown'] as const;
    events.forEach(e => window.addEventListener(e, resetTimers, { passive: true }));

    return () => {
      timerRef.current.forEach(clearTimeout);
      timerRef.current = [];
      events.forEach(e => window.removeEventListener(e, resetTimers));
    };
  }, [enabled, resetTimers]);

  return stage;
}
