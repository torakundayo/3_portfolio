import type { TransitionVariant } from './types';
import type { Variants } from 'framer-motion';

/**
 * Origin-aware clipExpand: content expands from the interaction point.
 * Default origin: center (50%, 50%).
 */
export function makeClipExpandVariants(
  originX = 50, originY = 50,
): Variants {
  const origin = `${originX}% ${originY}%`;
  return {
    initial: { clipPath: `circle(0% at ${origin})`, opacity: 0 },
    animate: { clipPath: `circle(150% at ${origin})`, opacity: 1 },
    exit: { clipPath: `circle(0% at ${origin})`, opacity: 0 },
  };
}

export const transitionVariants: Record<TransitionVariant, Variants> = {
  clipExpand: makeClipExpandVariants(),
  slideOver: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-30%', opacity: 0 },
  },
  scaleBlur: {
    initial: { scale: 1.02, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.99, opacity: 0 },
  },
  verticalSplit: {
    initial: { clipPath: 'inset(50% 0 50% 0)', opacity: 0 },
    animate: { clipPath: 'inset(0% 0 0% 0)', opacity: 1 },
    exit: { clipPath: 'inset(50% 0 50% 0)', opacity: 0 },
  },
};

/* Spring-based transitions per design-principles.md
   clipPath/filter don't support spring — use tween for those,
   spring for transform/opacity properties */
export const transitionConfig: Record<TransitionVariant, object> = {
  clipExpand: {
    clipPath: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    opacity: { type: 'spring', stiffness: 60, damping: 18 },
  },
  slideOver: {
    x: { type: 'spring', stiffness: 80, damping: 20 },
    opacity: { type: 'spring', stiffness: 60, damping: 18 },
  },
  scaleBlur: {
    scale: { type: 'spring', stiffness: 60, damping: 18 },
    opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  verticalSplit: {
    clipPath: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    opacity: { type: 'spring', stiffness: 60, damping: 18 },
  },
};
