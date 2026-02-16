'use client';

import { motion } from 'framer-motion';

export function LoadingOverlay() {
  const r = 28;
  const circumference = 2 * Math.PI * r;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex items-center justify-center"
    >
      {/* Glass overlay */}
      <motion.div
        className="absolute inset-0 backdrop-blur-sm"
        animate={{ backdropFilter: ['blur(0px)', 'blur(8px)'] }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Morphing rings */}
      <div className="relative z-10">
        {/* Ripple pulse */}
        <motion.div
          className="absolute inset-0 m-auto w-20 h-20 rounded-full"
          style={{ border: '1px solid rgba(139, 92, 246, 0.15)' }}
          animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-0 m-auto w-20 h-20 rounded-full"
          style={{ border: '1px solid rgba(6, 182, 212, 0.12)' }}
          animate={{ scale: [1, 2.2], opacity: [0.2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.7 }}
        />

        <svg width="80" height="80" viewBox="0 0 64 64" fill="none">
          {/* Outer ring — clockwise */}
          <motion.circle
            cx="32"
            cy="32"
            r={r}
            stroke="url(#ring1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            animate={{
              strokeDashoffset: [circumference, 0],
              rotate: [0, 360],
            }}
            transition={{
              strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' },
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
            }}
            style={{ transformOrigin: 'center' }}
          />

          {/* Inner ring — counter-clockwise */}
          <motion.circle
            cx="32"
            cy="32"
            r={20}
            stroke="url(#ring2)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={2 * Math.PI * 20}
            animate={{
              strokeDashoffset: [2 * Math.PI * 20, 0],
              rotate: [360, 0],
            }}
            transition={{
              strokeDashoffset: { duration: 2, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' },
              rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
            }}
            style={{ transformOrigin: 'center' }}
          />

          {/* Center dot */}
          <motion.circle
            cx="32"
            cy="32"
            r="2"
            fill="rgba(139, 92, 246, 0.6)"
            animate={{ r: [2, 3, 2], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <defs>
            <linearGradient id="ring1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.8)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
            </linearGradient>
            <linearGradient id="ring2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.6)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.2)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  );
}
