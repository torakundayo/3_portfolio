'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

interface CareerEntry {
  company: { ja: string; en: string };
  period: string;
  role: { ja: string; en: string };
  description: { ja: string; en: string };
  highlights: { ja: string[]; en: string[] };
}

export function CareerJourney({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const history: CareerEntry[] = d?.history ?? [];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;

  return (
    <div className="h-full w-full overflow-auto">
      {/* Animated gradient background */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          background: [
            `linear-gradient(160deg, ${palette.primary}06 0%, white 40%, ${palette.secondary}04 100%)`,
            `linear-gradient(160deg, ${palette.secondary}06 0%, white 40%, ${palette.primary}04 100%)`,
            `linear-gradient(160deg, ${palette.primary}06 0%, white 40%, ${palette.secondary}04 100%)`,
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-4xl mx-auto px-6 py-20">
        {history.map((entry, i) => {
          const isOdd = i % 2 !== 0;
          const align = mirror ? (isOdd ? 'left' : 'right') : (isOdd ? 'right' : 'left');

          return (
            <motion.section
              key={i}
              className={`mb-24 last:mb-12 ${align === 'right' ? 'text-right' : 'text-left'}`}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: baseDelay + 0.2 * i,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              {/* Chapter number */}
              <motion.span
                className="inline-block text-8xl font-black leading-none mb-4 select-none"
                style={{ color: `${palette.primary}12` }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: baseDelay + 0.2 * i + 0.1, duration: 0.6 }}
              >
                {String(i + 1).padStart(2, '0')}
              </motion.span>

              {/* Period */}
              <motion.div
                className="mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: baseDelay + 0.2 * i + 0.2 }}
              >
                <span
                  className="text-sm font-mono tracking-widest uppercase"
                  style={{ color: palette.primary }}
                >
                  {entry.period}
                </span>
              </motion.div>

              {/* Role as large title */}
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
                {entry.role?.ja ?? entry.role?.en ?? ''}
              </h2>

              {/* Company */}
              <p className="text-lg text-gray-500 mb-6">
                {entry.company?.ja ?? entry.company?.en ?? ''}
                {entry.company?.en && entry.company?.ja && (
                  <span className="text-gray-300 ml-2">/ {entry.company.en}</span>
                )}
              </p>

              {/* Decorative line */}
              <motion.div
                className="mb-6"
                style={{
                  width: '60px',
                  height: '3px',
                  borderRadius: '2px',
                  background: `linear-gradient(to right, ${palette.primary}, ${palette.secondary})`,
                  marginLeft: align === 'right' ? 'auto' : '0',
                  marginRight: align === 'left' ? 'auto' : '0',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: baseDelay + 0.2 * i + 0.3, duration: 0.5 }}
              />

              {/* Description */}
              {(entry.description?.ja || entry.description?.en) && (
                <p className="text-base text-gray-600 leading-relaxed mb-5 max-w-2xl"
                  style={{ marginLeft: align === 'right' ? 'auto' : '0' }}
                >
                  {entry.description?.ja ?? entry.description?.en}
                </p>
              )}

              {/* Highlights as flowing text */}
              {(entry.highlights?.ja?.length || entry.highlights?.en?.length) ? (
                <div
                  className="space-y-2 max-w-2xl"
                  style={{ marginLeft: align === 'right' ? 'auto' : '0' }}
                >
                  {(entry.highlights?.ja ?? entry.highlights?.en ?? []).map((h: string, j: number) => (
                    <motion.p
                      key={j}
                      className="text-sm text-gray-500 leading-relaxed pl-4 border-l-2"
                      style={{ borderColor: `${palette.primary}30` }}
                      initial={{ opacity: 0, x: align === 'right' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: baseDelay + 0.2 * i + 0.4 + 0.08 * j }}
                    >
                      {h}
                    </motion.p>
                  ))}
                </div>
              ) : null}
            </motion.section>
          );
        })}

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="mt-12 pt-12 border-t border-gray-100 prose prose-gray max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.2 * history.length + 0.5 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
