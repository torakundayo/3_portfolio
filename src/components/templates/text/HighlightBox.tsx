'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function TextHighlightBox({ commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const gradientAngle = 135 + visualSeed.colorOffset * 0.3;

  // Extract first sentence/paragraph as the highlight pull-quote
  const lines = (commentary || '').split('\n').filter((l) => l.trim());
  const highlight = lines[0]?.replace(/^[#*_`>-]+\s*/, '') || '';
  const remaining = lines.slice(1).join('\n');

  return (
    <div className="h-full w-full overflow-auto flex flex-col items-center justify-center">
      {/* Soft bg */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          background: [
            `linear-gradient(${gradientAngle}deg, ${palette.primary}06, white 40%, white 60%, ${palette.secondary}04)`,
            `linear-gradient(${gradientAngle + 30}deg, ${palette.secondary}06, white 40%, white 60%, ${palette.primary}04)`,
            `linear-gradient(${gradientAngle}deg, ${palette.primary}06, white 40%, white 60%, ${palette.secondary}04)`,
          ],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-3xl w-full px-6 py-16">
        {/* Highlight box */}
        {highlight && (
          <motion.div
            className="relative mb-12 rounded-2xl p-10 md:p-14 text-center overflow-hidden"
            style={{
              background: `linear-gradient(${gradientAngle}deg, ${palette.primary}10, ${palette.secondary}08)`,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }}
          >
            {/* Decorative glow */}
            <div
              className="absolute inset-0 -z-10 opacity-40"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${palette.glow}20 0%, transparent 60%)`,
              }}
            />

            {/* Large quote mark */}
            <motion.div
              className="text-7xl font-serif leading-none mb-4 select-none"
              style={{ color: `${palette.primary}25` }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: baseDelay + 0.2, duration: 0.6 }}
            >
              &ldquo;
            </motion.div>

            {/* Highlight text */}
            <motion.p
              className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug"
              style={{ color: palette.primary }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: baseDelay + 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
            >
              {highlight}
            </motion.p>

            {/* Bottom accent */}
            <motion.div
              className="mx-auto mt-8"
              style={{
                width: '60px',
                height: '3px',
                borderRadius: '2px',
                background: `linear-gradient(to right, ${palette.primary}, ${palette.secondary})`,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: baseDelay + 0.5, duration: 0.5 }}
            />
          </motion.div>
        )}

        {/* Remaining text */}
        {remaining && (
          <motion.div
            className="prose prose-lg prose-gray max-w-none leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.6 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{remaining}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
