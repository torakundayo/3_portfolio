'use client';

import { motion } from 'framer-motion';

export function LoadingOverlay() {
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

      {/* Pulsing dots */}
      <div className="relative z-10 flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-400/60"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
