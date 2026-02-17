'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

export function TextMagazineLayout({ commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  // Split commentary into paragraphs for magazine layout
  const paragraphs = (commentary || '').split('\n\n').filter((p) => p.trim());
  const pullQuote = paragraphs.length > 2 ? paragraphs[1] : paragraphs[0] || '';

  return (
    <div className="h-full w-full overflow-hidden bg-white relative">
      {/* CSS keyframe bg blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1a`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 20s ease-in-out infinite' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}12`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 24s ease-in-out infinite' }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 h-full flex flex-col relative z-10">
        {/* Magazine header line */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: baseDelay }}
          style={{ transform: 'translateZ(-20px)' }}
        >
          <div className="h-px flex-1" style={{ backgroundColor: `${palette.primary}30` }} />
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: palette.primary }} />
          <div className="h-px flex-1" style={{ backgroundColor: `${palette.primary}30` }} />
        </motion.div>

        <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 flex-1 min-h-0 ${mirror ? 'direction-rtl' : ''}`}>
          {/* Main column */}
          <motion.div
            className={`${mirror ? 'md:col-start-6 md:col-span-7' : 'md:col-span-7'} overflow-hidden`}
            style={{ direction: 'ltr', transform: 'translateZ(15px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...SPRING_ENTER, delay: baseDelay + 0.2 }}
          >
            {/* Drop cap on first paragraph */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children, ...props }) => {
                    const isFirst = props.node?.position?.start.line === 1;
                    if (isFirst && typeof children === 'string' && children.length > 0) {
                      const firstChar = children[0];
                      const rest = children.slice(1);
                      return (
                        <p className="text-gray-800 leading-[1.85] mb-6" style={revealStyle(0)}>
                          <span
                            className="float-left text-6xl font-bold leading-[0.8] mr-3 mt-1"
                            style={{ color: palette.primary }}
                          >
                            {firstChar}
                          </span>
                          {rest}
                        </p>
                      );
                    }
                    return (
                      <p className="text-gray-800 leading-[1.85] mb-6" style={revealStyle(1)}>
                        {children}
                      </p>
                    );
                  },
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
                }}
              >
                {commentary || ''}
              </ReactMarkdown>
            </div>
          </motion.div>

          {/* Side column with pull quote */}
          <motion.div
            className={`${mirror ? 'md:col-start-1 md:col-span-4' : 'md:col-start-9 md:col-span-4'}`}
            style={{ direction: 'ltr', transform: 'translateZ(30px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...SPRING_ENTER, delay: baseDelay + 0.4 }}
          >
            {/* Pull quote */}
            {pullQuote && (
              <div className="sticky top-16">
                <div
                  className="border-l-4 pl-5 py-2"
                  style={{ borderColor: palette.primary }}
                >
                  <p
                    className="text-xl font-semibold leading-relaxed italic"
                    style={{
                      color: palette.primary,
                      ...breatheStyle(0),
                      transform: 'translateZ(30px)',
                    }}
                  >
                    {pullQuote.replace(/[#*_`]/g, '').slice(0, 120)}
                    {pullQuote.length > 120 ? '...' : ''}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="mt-8 space-y-3" style={{ transform: 'translateZ(-20px)' }}>
                  <div
                    className="h-px w-full"
                    style={{ backgroundColor: `${palette.primary}15` }}
                  />
                  <div
                    className="h-px w-3/4"
                    style={{ backgroundColor: `${palette.secondary}15` }}
                  />
                  <div
                    className="h-px w-1/2"
                    style={{ backgroundColor: `${palette.primary}10` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer line */}
        <motion.div
          className="flex items-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: baseDelay + 0.6 }}
          style={{ transform: 'translateZ(-20px)' }}
        >
          <div className="h-px flex-1" style={{ backgroundColor: `${palette.primary}20` }} />
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `${palette.primary}40` }} />
          <div className="h-px flex-1" style={{ backgroundColor: `${palette.primary}20` }} />
        </motion.div>
      </div>
    </div>
  );
}
