'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useMotionValue } from 'framer-motion';

/* ═══ Types ═══ */

export type IdleStage = 'active' | 'nudge' | 'hint' | 'suggest';

export type CursorSpeed = 'normal' | 'searching';

export interface BehaviorState {
  idleStage: IdleStage;
  cursorSpeed: CursorSpeed;
  dwellTarget: string | null;
  focusIdleDuration: number;
  repeatedAreas: Map<string, number>;
}

export interface BehaviorObserverOptions {
  /** 'welcome' = original thresholds, 'template' = longer thresholds */
  scope: 'welcome' | 'template';
  /** Template categories already viewed (for repeated-viewing detection) */
  viewedCategories?: string[];
  /** Whether input is focused without typing */
  inputFocusedEmpty?: boolean;
}

/* ═══ Constants ═══ */

const IDLE_THRESHOLDS = {
  welcome: { nudge: 3000, hint: 6000, suggest: 10000 },
  template: { nudge: 5000, hint: 10000, suggest: 18000 },
} as const;

/** px/s threshold to consider cursor movement as "searching" */
const SPEED_THRESHOLD = 400;
/** ms the cursor must stay fast to trigger 'searching' */
const SPEED_SUSTAIN_MS = 500;

/** px radius within which cursor is considered "dwelling" */
const DWELL_RADIUS = 30;
/** ms the cursor must stay within dwell radius */
const DWELL_THRESHOLD_MS = 2000;

/** How many views of the same category to trigger repeated-viewing */
const REPEAT_VIEW_THRESHOLD = 3;

/** Focus-without-typing threshold in ms */
const FOCUS_IDLE_MS = 3000;

/* ═══ Hook ═══ */

export function useBehaviorObserver(options: BehaviorObserverOptions): BehaviorState {
  const { scope, viewedCategories = [], inputFocusedEmpty = false } = options;

  // ── Idle detection (ported from useIdleDetector, scope-aware) ──
  const [idleStage, setIdleStage] = useState<IdleStage>('active');
  const idleTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scopeRef = useRef(scope);
  scopeRef.current = scope;

  const resetIdle = useCallback(() => {
    idleTimersRef.current.forEach(clearTimeout);
    idleTimersRef.current = [];
    setIdleStage('active');

    const thresholds = IDLE_THRESHOLDS[scopeRef.current];
    idleTimersRef.current.push(
      setTimeout(() => setIdleStage('nudge'), thresholds.nudge),
      setTimeout(() => setIdleStage('hint'), thresholds.hint),
      setTimeout(() => setIdleStage('suggest'), thresholds.suggest),
    );
  }, []);

  // Track last mouse position for movement-threshold idle reset
  const lastIdleMouseRef = useRef<{ x: number; y: number } | null>(null);
  /** Minimum px movement to count as "active" (template scope only) */
  const MOUSE_IDLE_THRESHOLD = 50;

  useEffect(() => {
    resetIdle();

    // Mouse movement handling:
    // - welcome: mouse movement does NOT reset idle (user is exploring, not "operating")
    //   → keywords appear naturally after 3-6s regardless of mouse position
    // - template: only significant movement (>50px) resets idle
    const handleMouseMove = (e: MouseEvent) => {
      if (scopeRef.current === 'welcome') return;

      const last = lastIdleMouseRef.current;
      if (last) {
        const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
        if (dist > MOUSE_IDLE_THRESHOLD) {
          lastIdleMouseRef.current = { x: e.clientX, y: e.clientY };
          resetIdle();
        }
      } else {
        lastIdleMouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    // Active interactions (click, key, touch) always reset idle
    const activeEvents = ['keydown', 'touchstart', 'pointerdown'] as const;
    activeEvents.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      idleTimersRef.current.forEach(clearTimeout);
      idleTimersRef.current = [];
      activeEvents.forEach((e) => window.removeEventListener(e, resetIdle));
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [resetIdle]);

  // ── Cursor speed detection ──
  const [cursorSpeed, setCursorSpeed] = useState<CursorSpeed>('normal');
  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const fastSinceRef = useRef<number | null>(null);
  const speedRafRef = useRef<number>(0);

  // Use MotionValue to avoid re-renders on every mousemove
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawMouseX.set(e.clientX);
      rawMouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawMouseX, rawMouseY]);

  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      const x = rawMouseX.get();
      const y = rawMouseY.get();
      const last = lastPosRef.current;

      if (last) {
        const dt = now - last.time;
        if (dt > 0) {
          const dist = Math.hypot(x - last.x, y - last.y);
          const speed = dist / (dt / 1000); // px/s

          if (speed > SPEED_THRESHOLD) {
            if (fastSinceRef.current === null) fastSinceRef.current = now;
            if (now - fastSinceRef.current > SPEED_SUSTAIN_MS) {
              setCursorSpeed('searching');
            }
          } else {
            fastSinceRef.current = null;
            setCursorSpeed('normal');
          }
        }
      }

      lastPosRef.current = { x, y, time: now };
      speedRafRef.current = requestAnimationFrame(tick);
    };

    // Sample at ~10fps to reduce overhead (every 6 frames at 60fps)
    let frameCount = 0;
    const throttledTick = () => {
      frameCount++;
      if (frameCount % 6 === 0) tick();
      else speedRafRef.current = requestAnimationFrame(throttledTick);
    };

    speedRafRef.current = requestAnimationFrame(throttledTick);
    return () => cancelAnimationFrame(speedRafRef.current);
  }, [rawMouseX, rawMouseY]);

  // ── Cursor dwell detection ──
  const [dwellTarget, setDwellTarget] = useState<string | null>(null);
  const dwellAnchorRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const checkDwell = (e: MouseEvent) => {
      const anchor = dwellAnchorRef.current;

      if (anchor) {
        const dist = Math.hypot(e.clientX - anchor.x, e.clientY - anchor.y);
        if (dist > DWELL_RADIUS) {
          // Cursor moved out of dwell zone — reset
          dwellAnchorRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
          if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
          setDwellTarget(null);

          dwellTimerRef.current = setTimeout(() => {
            // If we're still here after threshold, set dwell target
            const el = document.elementFromPoint(e.clientX, e.clientY);
            const zone = el?.closest('[data-observe-zone]');
            setDwellTarget(zone?.getAttribute('data-observe-zone') ?? null);
          }, DWELL_THRESHOLD_MS);
        }
      } else {
        dwellAnchorRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
        dwellTimerRef.current = setTimeout(() => {
          const el = document.elementFromPoint(e.clientX, e.clientY);
          const zone = el?.closest('[data-observe-zone]');
          setDwellTarget(zone?.getAttribute('data-observe-zone') ?? null);
        }, DWELL_THRESHOLD_MS);
      }
    };

    window.addEventListener('mousemove', checkDwell, { passive: true });
    return () => {
      window.removeEventListener('mousemove', checkDwell);
      if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
    };
  }, []);

  // ── Focus-without-typing detection ──
  const [focusIdleDuration, setFocusIdleDuration] = useState(0);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);

    if (inputFocusedEmpty) {
      focusTimerRef.current = setTimeout(() => {
        setFocusIdleDuration(FOCUS_IDLE_MS);
      }, FOCUS_IDLE_MS);
    } else {
      setFocusIdleDuration(0);
    }

    return () => {
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    };
  }, [inputFocusedEmpty]);

  // ── Repeated-viewing detection ──
  const [repeatedAreas, setRepeatedAreas] = useState(() => new Map<string, number>());

  useEffect(() => {
    // Count category occurrences
    const counts = new Map<string, number>();
    for (const cat of viewedCategories) {
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
    // Only keep categories that hit the threshold
    const next = new Map<string, number>();
    for (const [cat, count] of counts) {
      if (count >= REPEAT_VIEW_THRESHOLD) {
        next.set(cat, count);
      }
    }
    setRepeatedAreas(next);
  }, [viewedCategories]);

  return {
    idleStage,
    cursorSpeed,
    dwellTarget,
    focusIdleDuration,
    repeatedAreas,
  };
}
