'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

export function TextLetterFormat({ commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  return (
    <div className="h-full w-full overflow-hidden flex items-center justify-center bg-gray-100/50 relative">
      {/* CSS keyframe bg blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1a`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 20s ease-in-out infinite' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}12`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 24s ease-in-out infinite' }} />
      </div>

      {/* Subtle texture bg */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)`,
        }}
      />

      <motion.div
        className="max-w-2xl w-full mx-6 relative z-10"
        initial={{ opacity: 0, rotateX: 2 }}
        animate={{ opacity: 1, rotateX: 0 }}
        transition={{ ...SPRING_ENTER, delay: baseDelay }}
      >
        {/* Paper card with organic radius */}
        <div
          className="bg-white px-10 md:px-16 py-10 md:py-14 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]"
          style={{
            borderRadius: organicRadius,
            backgroundImage: `
              linear-gradient(${palette.primary}04 1px, transparent 1px)
            `,
            backgroundSize: '100% 2rem',
            transform: 'translateZ(15px)',
          }}
        >
          {/* Date area */}
          <motion.div
            className="text-right mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 0.2, duration: 0.5 }}
            style={{ transform: 'translateZ(-20px)' }}
          >
            <span className="text-sm text-gray-800 italic">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </motion.div>

          {/* Greeting */}
          <motion.p
            className="text-lg text-gray-800 mb-6"
            style={{
              fontFamily: 'Georgia, "Noto Serif JP", serif',
              ...breatheStyle(0),
              transform: 'translateZ(40px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 0.3, duration: 0.5 }}
          >
            Dear visitor,
          </motion.p>

          {/* Letter body - clamped to 6 lines */}
          <motion.div
            className="prose prose-gray max-w-none prose-p:leading-[1.9] prose-p:mb-4 prose-p:text-gray-800 line-clamp-6"
            style={{
              fontFamily: 'Georgia, "Noto Serif JP", serif',
              transform: 'translateZ(15px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 0.4, duration: 0.8 }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p style={revealStyle(0)}>{children}</p>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    style={{
                      ...breatheStyle(1),
                      transform: 'translateZ(30px)',
                      borderColor: palette.primary,
                    }}
                  >
                    {children}
                  </blockquote>
                ),
              }}
            >
              {commentary || ''}
            </ReactMarkdown>
          </motion.div>

          {/* Sign-off */}
          <motion.div
            className="mt-8 text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 0.7, duration: 0.6 }}
            style={{ transform: 'translateZ(15px)' }}
          >
            <p
              className="text-base text-gray-800 italic"
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
                transform: 'translateZ(-20px)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
