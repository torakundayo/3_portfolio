'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius } from '@/lib/animation';

export function TextHighlightBox({ commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const gradientAngle = 135 + visualSeed.colorOffset * 0.3;

  // Extract first sentence/paragraph as the highlight pull-quote
  const lines = (commentary || '').split('\n').filter((l) => l.trim());
  const highlight = lines[0]?.replace(/^[#*_`>-]+\s*/, '') || '';
  const remaining = lines.slice(1).join('\n');

  return (
    <div className="h-full w-full overflow-hidden flex flex-col items-center justify-center bg-gray-950 relative">
      {/* CSS keyframe bg blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1a`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 20s ease-in-out infinite' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}12`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 24s ease-in-out infinite' }} />
      </div>

      <div className="max-w-3xl w-full px-6 py-10 relative z-10">
        {/* Highlight box with organic radius */}
        {highlight && (
          <motion.div
            className="relative mb-8 p-8 md:p-12 text-center overflow-hidden"
            style={{
              borderRadius: organicRadius,
              background: `linear-gradient(${gradientAngle}deg, ${palette.primary}18, ${palette.secondary}10)`,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING_ENTER, delay: baseDelay }}
          >
            {/* Decorative glow */}
            <div
              className="absolute inset-0 -z-10 opacity-40"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${palette.glow}20 0%, transparent 60%)`,
                transform: 'translateZ(-20px)',
              }}
            />

            {/* Large quote mark */}
            <motion.div
              className="text-7xl font-serif leading-none mb-4 select-none"
              style={{
                color: `${palette.primary}35`,
                transform: 'translateZ(-20px)',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: baseDelay + 0.2, duration: 0.6 }}
            >
              &ldquo;
            </motion.div>

            {/* Highlight text */}
            <motion.p
              className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug"
              style={{
                color: palette.primary,
                ...breatheStyle(0),
                transform: 'translateZ(30px)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_ENTER, delay: baseDelay + 0.3 }}
            >
              {highlight}
            </motion.p>

            {/* Bottom accent */}
            <motion.div
              className="mx-auto mt-6"
              style={{
                width: '60px',
                height: '3px',
                borderRadius: '2px',
                background: `linear-gradient(to right, ${palette.primary}, ${palette.secondary})`,
                transform: 'translateZ(-20px)',
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
            className="prose prose-lg prose-invert max-w-none leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_ENTER, delay: baseDelay + 0.6 }}
            style={{ transform: 'translateZ(15px)' }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="text-gray-300" style={revealStyle(0)}>
                    {children}
                  </p>
                ),
                h1: ({ children }) => (
                  <h1
                    className="text-gray-100"
                    style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    className="text-gray-100"
                    style={{ ...breatheStyle(1), transform: 'translateZ(40px)' }}
                  >
                    {children}
                  </h2>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    className="border-l-2 pl-4 italic text-gray-400"
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
              {remaining}
            </ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
