'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius } from '@/lib/animation';

export function TextCenteredProse({ commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];

  return (
    <div className="h-full w-full flex items-center justify-center overflow-hidden p-8 bg-white relative">
      {/* CSS keyframe bg blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1a`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 20s ease-in-out infinite' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}12`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 24s ease-in-out infinite' }} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...SPRING_ENTER, delay: 0 }}
        className="max-w-2xl w-full relative z-10"
        style={{ transform: 'translateZ(15px)' }}
      >
        {commentary && (
          <div
            className="prose prose-lg max-w-none leading-relaxed max-h-[70vh] overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1
                    className="text-gray-900"
                    style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    className="text-gray-900"
                    style={{ ...breatheStyle(1), transform: 'translateZ(40px)' }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    className="text-gray-900"
                    style={{ ...breatheStyle(2), transform: 'translateZ(40px)' }}
                  >
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p
                    className="text-gray-800"
                    style={{ ...revealStyle(0), transform: 'translateZ(15px)' }}
                  >
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    className="border-l-2 pl-4 italic text-gray-800"
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
              {commentary}
            </ReactMarkdown>
          </div>
        )}
      </motion.div>
    </div>
  );
}
