'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function TextCenteredProse({ commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const gradientAngle = 135 + visualSeed.colorOffset * 0.25;

  return (
    <div className="h-full w-full flex items-center justify-center overflow-auto p-8">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            `linear-gradient(${gradientAngle}deg, ${palette.primary}08, ${palette.secondary}05, white)`,
            `linear-gradient(${gradientAngle + 60}deg, ${palette.secondary}08, ${palette.glow}05, white)`,
            `linear-gradient(${gradientAngle}deg, ${palette.primary}08, ${palette.secondary}05, white)`,
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        className="max-w-2xl w-full"
      >
        {commentary && (
          <div className="prose prose-lg prose-gray max-w-none leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {commentary}
            </ReactMarkdown>
          </div>
        )}
      </motion.div>
    </div>
  );
}
