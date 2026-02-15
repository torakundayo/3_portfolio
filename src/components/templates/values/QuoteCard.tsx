'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function ValuesQuoteCard({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const beliefs = d?.beliefs?.ja ?? d?.beliefs?.en ?? '';
  const baseDelay = visualSeed.animationDelay;
  const gradientAngle = 135 + visualSeed.colorOffset * 0.2;

  return (
    <div className="h-full w-full overflow-auto bg-gray-950 flex items-center justify-center">
      {/* Deep ambient glow */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, ${palette.primary}12 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, ${palette.secondary}0a 0%, transparent 50%),
            #030712
          `,
        }}
      />

      <div className="max-w-3xl mx-auto px-8 py-16 text-center">
        {/* Large quote marks */}
        <motion.div
          className="relative inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: baseDelay }}
        >
          {/* Opening quote */}
          <motion.span
            className="absolute -top-16 -left-8 text-[120px] leading-none font-serif select-none pointer-events-none"
            style={{ color: `${palette.primary}25` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.2 }}
          >
            &ldquo;
          </motion.span>

          {/* Closing quote */}
          <motion.span
            className="absolute -bottom-20 -right-8 text-[120px] leading-none font-serif select-none pointer-events-none"
            style={{ color: `${palette.primary}25` }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.4 }}
          >
            &rdquo;
          </motion.span>

          {/* Beliefs as quote */}
          <motion.blockquote
            className="relative text-2xl md:text-3xl lg:text-4xl font-light text-white leading-relaxed tracking-wide"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: baseDelay + 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          >
            {beliefs}
          </motion.blockquote>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="mx-auto mt-12 mb-8"
          style={{
            width: '80px',
            height: '2px',
            background: `linear-gradient(to right, transparent, ${palette.primary}, ${palette.secondary}, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: baseDelay + 0.6 }}
        />

        {/* Vision & Work Style */}
        <div className="space-y-6 mt-8">
          {d?.visionForFutureSaaS && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: baseDelay + 0.7 }}
            >
              <p className="text-xs font-mono tracking-[0.3em] uppercase mb-2" style={{ color: palette.glow }}>
                Vision
              </p>
              <p className="text-base text-gray-400 leading-relaxed max-w-xl mx-auto">
                {d.visionForFutureSaaS?.ja ?? d.visionForFutureSaaS?.en ?? ''}
              </p>
            </motion.div>
          )}

          {d?.workStyle && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: baseDelay + 0.9 }}
            >
              <p className="text-xs font-mono tracking-[0.3em] uppercase mb-2" style={{ color: palette.glow }}>
                Work Style
              </p>
              <p className="text-base text-gray-400 leading-relaxed max-w-xl mx-auto">
                {d.workStyle?.ja ?? d.workStyle?.en ?? ''}
              </p>
            </motion.div>
          )}
        </div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="mt-16 prose prose-invert prose-gray max-w-none text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay + 1.1 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
