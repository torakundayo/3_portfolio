'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius } from '@/lib/animation';

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
    <div className="h-full w-full overflow-hidden bg-gray-950 flex flex-col">
      {/* CSS keyframe background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1f`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
      </div>

      <div className="flex-1 flex flex-col justify-center py-6 px-6">
        {/* Horizontal scroll area — keep horizontal scroll, remove vertical */}
        <div className="overflow-x-auto overflow-y-hidden pb-4 -mb-4">
          <div className="relative min-w-max px-4">
            {/* Horizontal line */}
            <motion.div
              className="absolute h-px left-0 right-0"
              style={{
                top: '50%',
                background: `linear-gradient(to right, transparent, ${palette.primary}50, ${palette.secondary}50, transparent)`,
                transform: 'translateZ(10px)',
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ ...SPRING_ENTER, delay: baseDelay }}
            />

            <div className="flex items-center gap-0">
              {history.map((entry, i) => {
                const isAbove = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    className="relative flex flex-col items-center"
                    style={{ width: '260px', minWidth: '260px', ...revealStyle(i) }}
                    initial={{ opacity: 0, y: isAbove ? -30 : 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      ...SPRING_ENTER,
                      delay: baseDelay + 0.1 * i,
                    }}
                  >
                    {/* Card above or below — glassmorphism + organic */}
                    <div
                      className={`flex flex-col ${isAbove ? 'order-1 mb-4' : 'order-3 mt-4'}`}
                    >
                      <div
                        className="backdrop-blur-xl bg-white/[0.06] border border-white/10 p-4 shadow-sm hover:shadow-lg transition-all duration-300 w-56"
                        style={{
                          borderRadius: organicRadius,
                          borderTopColor: isAbove ? `${palette.primary}60` : undefined,
                          borderBottomColor: !isAbove ? `${palette.primary}60` : undefined,
                          borderTopWidth: isAbove ? '2px' : undefined,
                          borderBottomWidth: !isAbove ? '2px' : undefined,
                          transform: 'translateZ(20px)',
                        }}
                      >
                        <h3
                          className="text-base font-bold text-white mb-1 leading-tight"
                          style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
                        >
                          {entry.company?.ja ?? entry.company?.en ?? ''}
                        </h3>
                        <p
                          className="text-xs font-semibold mb-1.5"
                          style={{ color: palette.primary, ...breatheStyle(1), transform: 'translateZ(25px)' }}
                        >
                          {entry.role?.ja ?? entry.role?.en ?? ''}
                        </p>
                        {(entry.description?.ja || entry.description?.en) && (
                          <p className="text-[11px] text-gray-400 leading-relaxed mb-1.5 line-clamp-2">
                            {entry.description?.ja ?? entry.description?.en}
                          </p>
                        )}
                        {(entry.highlights?.ja?.length || entry.highlights?.en?.length) ? (
                          <ul className="space-y-0.5">
                            {(entry.highlights?.ja ?? entry.highlights?.en ?? []).slice(0, 2).map((h: string, j: number) => (
                              <li
                                key={j}
                                className="flex items-start gap-1.5 text-[11px] text-gray-400"
                                style={revealStyle(i * 3 + j)}
                              >
                                <span
                                  className="mt-1 h-1 w-1 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: palette.secondary }}
                                />
                                <span className="line-clamp-1">{h}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>

                    {/* Center dot + period marker */}
                    <div className="order-2 flex flex-col items-center z-10">
                      <motion.div
                        className="w-3.5 h-3.5 rounded-full border-[3px] border-gray-950 shadow-md"
                        style={{
                          backgroundColor: palette.primary,
                          boxShadow: `0 0 16px ${palette.glow}50`,
                          transform: 'translateZ(10px)',
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ ...SPRING_ENTER, delay: baseDelay + 0.1 * i + 0.15 }}
                      />
                      <span
                        className="mt-1 text-[10px] font-medium tracking-wide whitespace-nowrap"
                        style={{ color: palette.glow }}
                      >
                        {entry.period}
                      </span>
                    </div>

                    {/* Spacer for opposite side — compact */}
                    <div className={`${isAbove ? 'order-3 h-24' : 'order-1 h-24'}`} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="max-w-2xl mx-auto mt-6 prose prose-invert prose-sm max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              opacity: { duration: 0.6, delay: baseDelay + 0.1 * history.length + 0.3 },
              y: { ...SPRING_ENTER, delay: baseDelay + 0.1 * history.length + 0.3 },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
