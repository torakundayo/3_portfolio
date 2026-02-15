'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function TextMagazineLayout({ commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;

  // Split commentary into paragraphs for magazine layout
  const paragraphs = (commentary || '').split('\n\n').filter((p) => p.trim());
  const pullQuote = paragraphs.length > 2 ? paragraphs[1] : paragraphs[0] || '';

  return (
    <div className="h-full w-full overflow-auto">
      {/* Subtle magazine bg */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, #fafafa 0%, white 30%, white 70%, #fafafa 100%)`,
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Magazine header line */}
        <motion.div
          className="flex items-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: baseDelay }}
        >
          <div className="h-px flex-1" style={{ backgroundColor: `${palette.primary}30` }} />
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: palette.primary }} />
          <div className="h-px flex-1" style={{ backgroundColor: `${palette.primary}30` }} />
        </motion.div>

        <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 ${mirror ? 'direction-rtl' : ''}`}>
          {/* Main column */}
          <motion.div
            className={`${mirror ? 'md:col-start-6 md:col-span-7' : 'md:col-span-7'}`}
            style={{ direction: 'ltr' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: baseDelay + 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          >
            {/* Drop cap on first paragraph */}
            <div className="prose prose-lg prose-gray max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children, ...props }) => {
                    const isFirst = props.node?.position?.start.line === 1;
                    if (isFirst && typeof children === 'string' && children.length > 0) {
                      const firstChar = children[0];
                      const rest = children.slice(1);
                      return (
                        <p className="text-gray-700 leading-[1.85] mb-6">
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
                    return <p className="text-gray-700 leading-[1.85] mb-6">{children}</p>;
                  },
                }}
              >
                {commentary || ''}
              </ReactMarkdown>
            </div>
          </motion.div>

          {/* Side column with pull quote */}
          <motion.div
            className={`${mirror ? 'md:col-start-1 md:col-span-4' : 'md:col-start-9 md:col-span-4'}`}
            style={{ direction: 'ltr' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: baseDelay + 0.4, ease: [0.22, 1, 0.36, 1] as const }}
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
                    style={{ color: palette.primary }}
                  >
                    {pullQuote.replace(/[#*_`]/g, '').slice(0, 120)}
                    {pullQuote.length > 120 ? '...' : ''}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="mt-8 space-y-3">
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
          className="flex items-center gap-4 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: baseDelay + 0.6 }}
        >
          <div className="h-px flex-1" style={{ backgroundColor: `${palette.primary}20` }} />
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `${palette.primary}40` }} />
          <div className="h-px flex-1" style={{ backgroundColor: `${palette.primary}20` }} />
        </motion.div>
      </div>
    </div>
  );
}
