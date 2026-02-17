'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

/**
 * Placeholder template used for not-yet-implemented templates.
 * Displays commentary with a colored gradient background.
 */
export function Placeholder({ commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];

  return (
    <div className="h-full w-full flex items-center justify-center overflow-auto p-8">
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, ${palette.primary}10, ${palette.secondary}08, white)`,
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        className="max-w-2xl w-full"
      >
        {commentary && (
          <div className="prose prose-lg prose-gray max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {commentary}
            </ReactMarkdown>
          </div>
        )}
      </motion.div>
    </div>
  );
}
