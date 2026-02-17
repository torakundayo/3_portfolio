'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, cardFloatStyle, organicRadius } from '@/lib/animation';

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
    <div className="h-full w-full overflow-hidden bg-gray-950">
      {/* CSS keyframe background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1f`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 h-full flex flex-col">
        {/* Compact grid — smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {history.map((entry, i) => (
            <motion.div
              key={i}
              className="group relative p-[1px] overflow-hidden"
              style={{ borderRadius: organicRadius, ...revealStyle(i), ...cardFloatStyle(i) }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                ...SPRING_ENTER,
                delay: baseDelay + 0.1 * i,
              }}
            >
              {/* Accent border gradient */}
              <div
                className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  borderRadius: organicRadius,
                  background: `linear-gradient(135deg, ${palette.primary}80, transparent 40%, transparent 60%, ${palette.secondary}80)`,
                }}
              />

              {/* Card inner — glassmorphism + organic */}
              <div
                className="relative backdrop-blur-xl bg-white/[0.06] border border-white/10 p-5"
                style={{ borderRadius: organicRadius, transform: 'translateZ(20px)' }}
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    borderRadius: organicRadius,
                    background: `radial-gradient(ellipse at 50% 0%, ${palette.glow}08 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Period badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border"
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
                  <h3
                    className="text-lg font-bold text-white mb-0.5"
                    style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
                  >
                    {entry.company?.ja ?? entry.company?.en ?? ''}
                  </h3>
                  {entry.company?.en && (
                    <p className="text-xs text-gray-500 mb-2">{entry.company.en}</p>
                  )}

                  {/* Role */}
                  <p
                    className="text-sm font-semibold mb-3"
                    style={{ color: palette.primary, ...breatheStyle(1), transform: 'translateZ(25px)' }}
                  >
                    {entry.role?.ja ?? entry.role?.en ?? ''}
                  </p>

                  {/* Description — line-clamp for compactness */}
                  {(entry.description?.ja || entry.description?.en) && (
                    <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
                      {entry.description?.ja ?? entry.description?.en}
                    </p>
                  )}

                  {/* Highlights */}
                  {(entry.highlights?.ja?.length || entry.highlights?.en?.length) ? (
                    <ul className="space-y-1 border-t border-white/10 pt-3">
                      {(entry.highlights?.ja ?? entry.highlights?.en ?? []).slice(0, 3).map((h: string, j: number) => (
                        <motion.li
                          key={j}
                          className="flex items-start gap-2 text-xs text-gray-300"
                          style={revealStyle(i * 4 + j)}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            opacity: { duration: 0.4, delay: baseDelay + 0.1 * i + 0.3 + 0.06 * j },
                            x: { ...SPRING_ENTER, delay: baseDelay + 0.1 * i + 0.3 + 0.06 * j },
                          }}
                        >
                          <span
                            className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: palette.glow }}
                          />
                          <span className="line-clamp-1">{h}</span>
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
            className="mt-6 prose prose-invert prose-gray prose-sm max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              opacity: { duration: 0.6, delay: baseDelay + 0.1 * history.length + 0.4 },
              y: { ...SPRING_ENTER, delay: baseDelay + 0.1 * history.length + 0.4 },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
