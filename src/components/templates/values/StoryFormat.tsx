'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function ValuesStoryFormat({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const baseDelay = visualSeed.animationDelay;

  const beliefs = d?.beliefs?.ja ?? d?.beliefs?.en ?? '';
  const vision = d?.visionForFutureSaaS?.ja ?? d?.visionForFutureSaaS?.en ?? '';
  const workStyle = d?.workStyle?.ja ?? d?.workStyle?.en ?? '';

  return (
    <div className="h-full w-full overflow-auto">
      {/* Warm, paper-like background */}
      <motion.div
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, #fafaf8 0%, #f5f3ef 40%, #fafaf8 100%)`,
        }}
      />

      {/* Soft colored accents */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 30%, ${palette.primary}06 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, ${palette.secondary}06 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-2xl mx-auto px-8 py-20">
        {/* Opening ornament */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: baseDelay }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-12" style={{ backgroundColor: `${palette.primary}30` }} />
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: `${palette.primary}40` }} />
            <div className="h-px w-12" style={{ backgroundColor: `${palette.primary}30` }} />
          </div>
        </motion.div>

        {/* Beliefs section */}
        {beliefs && (
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: baseDelay + 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          >
            {/* Drop cap style first paragraph */}
            <p
              className="text-lg md:text-xl text-gray-700 leading-[1.9] tracking-wide"
              style={{ fontFamily: 'Georgia, "Noto Serif JP", serif' }}
            >
              {beliefs}
            </p>
          </motion.section>
        )}

        {/* Divider */}
        {vision && (
          <>
            <motion.div
              className="flex justify-center mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.5 }}
            >
              <div className="flex items-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: `${palette.primary}40` }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Vision section */}
            <motion.section
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: baseDelay + 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <motion.div
                className="pl-6 border-l-2 mb-6"
                style={{ borderColor: `${palette.primary}30` }}
              >
                <span
                  className="text-xs font-medium tracking-[0.2em] uppercase"
                  style={{ color: palette.primary }}
                >
                  Vision
                </span>
              </motion.div>
              <p
                className="text-lg text-gray-700 leading-[1.9] tracking-wide"
                style={{ fontFamily: 'Georgia, "Noto Serif JP", serif' }}
              >
                {vision}
              </p>
            </motion.section>
          </>
        )}

        {/* Work Style section */}
        {workStyle && (
          <>
            <motion.div
              className="flex justify-center mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.9 }}
            >
              <div className="flex items-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: `${palette.primary}40` }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.section
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: baseDelay + 1.0, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <motion.div
                className="pl-6 border-l-2 mb-6"
                style={{ borderColor: `${palette.secondary}30` }}
              >
                <span
                  className="text-xs font-medium tracking-[0.2em] uppercase"
                  style={{ color: palette.secondary }}
                >
                  Work Style
                </span>
              </motion.div>
              <p
                className="text-lg text-gray-700 leading-[1.9] tracking-wide"
                style={{ fontFamily: 'Georgia, "Noto Serif JP", serif' }}
              >
                {workStyle}
              </p>
            </motion.section>
          </>
        )}

        {/* Closing ornament */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: baseDelay + 1.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-12" style={{ backgroundColor: `${palette.primary}30` }} />
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: `${palette.primary}40` }} />
            <div className="h-px w-12" style={{ backgroundColor: `${palette.primary}30` }} />
          </div>
        </motion.div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="prose prose-gray max-w-none prose-p:leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay + 1.5 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
