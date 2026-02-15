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

export function CareerCompanyCards({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const history: CareerEntry[] = d?.history ?? [];
  const baseDelay = visualSeed.animationDelay;

  return (
    <div className="h-full w-full overflow-auto bg-gray-950">
      {/* Dark ambient glow */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${palette.primary}15 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, ${palette.secondary}10 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map((entry, i) => (
            <motion.div
              key={i}
              className="group relative rounded-2xl p-[1px] overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: baseDelay + 0.12 * i,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              {/* Accent border gradient */}
              <div
                className="absolute inset-0 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${palette.primary}80, transparent 40%, transparent 60%, ${palette.secondary}80)`,
                }}
              />

              {/* Card inner */}
              <div className="relative rounded-2xl bg-gray-900/95 backdrop-blur-xl p-7">
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${palette.glow}08 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Period badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full border"
                      style={{
                        color: palette.glow,
                        borderColor: `${palette.primary}30`,
                        backgroundColor: `${palette.primary}10`,
                      }}
                    >
                      {entry.period}
                    </span>
                  </div>

                  {/* Company name */}
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {entry.company?.ja ?? entry.company?.en ?? ''}
                  </h3>
                  {entry.company?.en && (
                    <p className="text-sm text-gray-500 mb-3">{entry.company.en}</p>
                  )}

                  {/* Role */}
                  <p className="text-base font-semibold mb-4" style={{ color: palette.primary }}>
                    {entry.role?.ja ?? entry.role?.en ?? ''}
                  </p>

                  {/* Description */}
                  {(entry.description?.ja || entry.description?.en) && (
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {entry.description?.ja ?? entry.description?.en}
                    </p>
                  )}

                  {/* Highlights */}
                  {(entry.highlights?.ja?.length || entry.highlights?.en?.length) ? (
                    <ul className="space-y-2 border-t border-gray-800 pt-4">
                      {(entry.highlights?.ja ?? entry.highlights?.en ?? []).map((h: string, j: number) => (
                        <motion.li
                          key={j}
                          className="flex items-start gap-2.5 text-sm text-gray-300"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: baseDelay + 0.12 * i + 0.3 + 0.06 * j }}
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: palette.glow }}
                          />
                          {h}
                        </motion.li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="mt-16 prose prose-invert prose-gray max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.12 * history.length + 0.4 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
