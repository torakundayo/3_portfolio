'use client';

import { motion } from 'framer-motion';
import type { TemplateProps } from '@/lib/types';

export function WelcomeMinimalInput(_props: TemplateProps) {
  return (
    <div className="h-full w-full bg-white flex items-center justify-center">
      {/* Pure white. The FloatingInput is positioned by Canvas via inputPosition: 'center' */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-8 text-gray-300 text-xs tracking-widest"
      >
        type anything
      </motion.div>
    </div>
  );
}
