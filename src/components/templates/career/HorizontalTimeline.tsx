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

export function CareerHorizontalTimeline({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const history: CareerEntry[] = d?.history ?? [];
  const baseDelay = visualSeed.animationDelay;

  return (
    <div className="h-full w-full overflow-auto flex flex-col">
      {/* Background */}
      <motion.div
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, white 0%, ${palette.primary}04 50%, white 100%)`,
        }}
      />

      <div className="flex-1 flex flex-col justify-center py-12 px-6">
        {/* Horizontal scroll area */}
        <div className="overflow-x-auto pb-6 -mb-6">
          <div className="relative min-w-max px-8">
            {/* Horizontal line */}
            <motion.div
              className="absolute h-px left-0 right-0"
              style={{
                top: '50%',
                background: `linear-gradient(to right, transparent, ${palette.primary}50, ${palette.secondary}50, transparent)`,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }}
            />

            <div className="flex items-center gap-0">
              {history.map((entry, i) => {
                const isAbove = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    className="relative flex flex-col items-center"
                    style={{ width: '320px', minWidth: '320px' }}
                    initial={{ opacity: 0, y: isAbove ? -30 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: baseDelay + 0.2 * i,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                  >
                    {/* Card above or below */}
                    <div
                      className={`flex flex-col ${isAbove ? 'order-1 mb-6' : 'order-3 mt-6'}`}
                    >
                      <div
                        className="rounded-xl border border-gray-100 bg-white/90 backdrop-blur-sm p-5 shadow-sm hover:shadow-lg transition-all duration-300 w-72"
                        style={{
                          borderTopColor: isAbove ? palette.primary : undefined,
                          borderBottomColor: !isAbove ? palette.primary : undefined,
                          borderTopWidth: isAbove ? '2px' : undefined,
                          borderBottomWidth: !isAbove ? '2px' : undefined,
                        }}
                      >
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {entry.company?.ja ?? entry.company?.en ?? ''}
                        </h3>
                        <p className="text-sm font-semibold mb-2" style={{ color: palette.primary }}>
                          {entry.role?.ja ?? entry.role?.en ?? ''}
                        </p>
                        {(entry.description?.ja || entry.description?.en) && (
                          <p className="text-xs text-gray-500 leading-relaxed mb-2">
                            {entry.description?.ja ?? entry.description?.en}
                          </p>
                        )}
                        {(entry.highlights?.ja?.length || entry.highlights?.en?.length) ? (
                          <ul className="space-y-1">
                            {(entry.highlights?.ja ?? entry.highlights?.en ?? []).slice(0, 3).map((h: string, j: number) => (
                              <li key={j} className="flex items-start gap-1.5 text-xs text-gray-600">
                                <span
                                  className="mt-1 h-1 w-1 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: palette.secondary }}
                                />
                                {h}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>

                    {/* Center dot + period marker */}
                    <div className="order-2 flex flex-col items-center z-10">
                      <motion.div
                        className="w-4 h-4 rounded-full border-[3px] border-white shadow-md"
                        style={{
                          backgroundColor: palette.primary,
                          boxShadow: `0 0 16px ${palette.glow}50`,
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: baseDelay + 0.2 * i + 0.15, type: 'spring', stiffness: 300 }}
                      />
                      <span
                        className="mt-1 text-[11px] font-medium tracking-wide whitespace-nowrap"
                        style={{ color: palette.primary }}
                      >
                        {entry.period}
                      </span>
                    </div>

                    {/* Spacer for opposite side */}
                    <div className={`${isAbove ? 'order-3 h-32' : 'order-1 h-32'}`} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="max-w-2xl mx-auto mt-12 prose prose-gray prose-sm max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.2 * history.length + 0.3 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
