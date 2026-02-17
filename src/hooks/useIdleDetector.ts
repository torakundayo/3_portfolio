'use client';

/**
 * @deprecated Use `useBehaviorObserver` instead. This hook is kept for backward compatibility.
 * The new hook provides all idle detection functionality plus cursor speed, dwell, and focus tracking.
 */

// Re-export IdleStage type from the new hook for backward compatibility
export type { IdleStage } from './useBehaviorObserver';

import { useBehaviorObserver } from './useBehaviorObserver';

/**
 * @deprecated Use `useBehaviorObserver` instead.
 */
export function useIdleDetector(enabled: boolean) {
  const behavior = useBehaviorObserver({
    scope: enabled ? 'welcome' : 'template',
  });
  return behavior.idleStage;
}
