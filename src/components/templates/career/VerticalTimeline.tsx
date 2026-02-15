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

export function CareerVerticalTimeline({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const history: CareerEntry[] = d?.history ?? [];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;

  return (
    <div className="h-full w-full overflow-auto">
      {/* Subtle animated bg */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          background: [
            `radial-gradient(ellipse at ${mirror ? '80%' : '20%'} 20%, ${palette.primary}0a 0%, transparent 60%)`,
            `radial-gradient(ellipse at ${mirror ? '20%' : '80%'} 80%, ${palette.secondary}0a 0%, transparent 60%)`,
            `radial-gradient(ellipse at ${mirror ? '80%' : '20%'} 20%, ${palette.primary}0a 0%, transparent 60%)`,
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: mirror ? 'calc(100% - 1.25rem)' : '1.25rem',
              background: `linear-gradient(to bottom, transparent, ${palette.primary}40, ${palette.secondary}40, transparent)`,
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }}
            style-origin="top"
          />

          {history.map((entry, i) => (
            <motion.div
              key={i}
              className="relative mb-12 last:mb-0"
              style={{ paddingLeft: mirror ? '0' : '3.5rem', paddingRight: mirror ? '3.5rem' : '0' }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: baseDelay + 0.15 * i,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              {/* Dot */}
              <motion.div
                className="absolute top-2 w-3 h-3 rounded-full ring-4 ring-white"
                style={{
                  left: mirror ? 'auto' : '0.625rem',
                  right: mirror ? '0.625rem' : 'auto',
                  backgroundColor: palette.primary,
                  boxShadow: `0 0 12px ${palette.glow}60`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: baseDelay + 0.15 * i + 0.2, type: 'spring', stiffness: 300 }}
              />

              {/* Card */}
              <div
                className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Period */}
                <span
                  className="inline-block text-xs font-medium tracking-wider uppercase mb-2 px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${palette.primary}10`, color: palette.primary }}
                >
                  {entry.period}
                </span>

                {/* Company */}
                <h3 className="text-xl font-bold text-gray-900 mb-0.5">
                  {entry.company?.ja ?? entry.company?.en ?? ''}
                </h3>
                {entry.company?.en && (
                  <p className="text-sm text-gray-400 mb-2">{entry.company.en}</p>
                )}

                {/* Role */}
                <p className="text-base font-semibold mb-3" style={{ color: palette.primary }}>
                  {entry.role?.ja ?? entry.role?.en ?? ''}
                </p>

                {/* Description */}
                {(entry.description?.ja || entry.description?.en) && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {entry.description?.ja ?? entry.description?.en}
                  </p>
                )}

                {/* Highlights */}
                {(entry.highlights?.ja?.length || entry.highlights?.en?.length) && (
                  <ul className="space-y-1.5">
                    {(entry.highlights?.ja ?? entry.highlights?.en ?? []).map((h: string, j: number) => (
                      <motion.li
                        key={j}
                        className="flex items-start gap-2 text-sm text-gray-600"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: baseDelay + 0.15 * i + 0.3 + 0.05 * j }}
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: palette.secondary }}
                        />
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="mt-16 prose prose-gray max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.15 * history.length + 0.3 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
