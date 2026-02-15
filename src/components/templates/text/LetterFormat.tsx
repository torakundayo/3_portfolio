'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function TextLetterFormat({ commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;

  return (
    <div className="h-full w-full overflow-auto flex items-center justify-center bg-gray-100/50">
      {/* Subtle texture bg */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)`,
        }}
      />

      <motion.div
        className="max-w-2xl w-full mx-6 my-12"
        initial={{ opacity: 0, y: 30, rotateX: 2 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }}
      >
        {/* Paper card */}
        <div
          className="bg-white rounded-lg px-10 md:px-16 py-12 md:py-16 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]"
          style={{
            backgroundImage: `
              linear-gradient(${palette.primary}04 1px, transparent 1px)
            `,
            backgroundSize: '100% 2rem',
          }}
        >
          {/* Date area */}
          <motion.div
            className="text-right mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 0.2, duration: 0.5 }}
          >
            <span className="text-sm text-gray-400 italic">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </motion.div>

          {/* Greeting */}
          <motion.p
            className="text-lg text-gray-700 mb-8"
            style={{ fontFamily: 'Georgia, "Noto Serif JP", serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 0.3, duration: 0.5 }}
          >
            Dear visitor,
          </motion.p>

          {/* Letter body */}
          <motion.div
            className="prose prose-gray max-w-none prose-p:leading-[1.9] prose-p:mb-6 prose-p:text-gray-600"
            style={{ fontFamily: 'Georgia, "Noto Serif JP", serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 0.4, duration: 0.8 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary || ''}</ReactMarkdown>
          </motion.div>

          {/* Sign-off */}
          <motion.div
            className="mt-12 text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 0.7, duration: 0.6 }}
          >
            <p
              className="text-base text-gray-500 italic"
              style={{ fontFamily: 'Georgia, "Noto Serif JP", serif' }}
            >
              Sincerely,
            </p>
            {/* Signature line */}
            <div
              className="mt-4 ml-auto"
              style={{
                width: '120px',
                height: '2px',
                background: `linear-gradient(to right, transparent, ${palette.primary}40, ${palette.secondary}40)`,
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
