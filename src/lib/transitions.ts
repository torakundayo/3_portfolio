import type { TransitionVariant } from './types';
import type { Variants } from 'framer-motion';

export const transitionVariants: Record<TransitionVariant, Variants> = {
  clipExpand: {
    initial: { clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
    animate: { clipPath: 'circle(150% at 50% 50%)', opacity: 1 },
    exit: { clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
  },
  slideOver: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-30%', opacity: 0 },
  },
  scaleBlur: {
    initial: { scale: 1.1, filter: 'blur(20px)', opacity: 0 },
    animate: { scale: 1, filter: 'blur(0px)', opacity: 1 },
    exit: { scale: 0.95, filter: 'blur(10px)', opacity: 0 },
  },
  verticalSplit: {
    initial: { clipPath: 'inset(50% 0 50% 0)', opacity: 0 },
    animate: { clipPath: 'inset(0% 0 0% 0)', opacity: 1 },
    exit: { clipPath: 'inset(50% 0 50% 0)', opacity: 0 },
  },
};

export const transitionConfig: Record<TransitionVariant, object> = {
  clipExpand: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  slideOver: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  scaleBlur: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  verticalSplit: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
};
