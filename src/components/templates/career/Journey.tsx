'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

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
  const { stagger } = seededStagger(visualSeed.colorOffset);

  // Limit chapters to 2 for single-viewport fit
  const displayed = history.slice(0, 2);
  const hiddenCount = history.length - displayed.length;

  return (
    <div className="h-full w-full overflow-hidden bg-white">
      {/* CSS keyframe background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1f`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 h-full flex flex-col justify-center">
        <div className="space-y-6">
          {displayed.map((entry, i) => {
            const isOdd = i % 2 !== 0;
            const align = mirror ? (isOdd ? 'left' : 'right') : (isOdd ? 'right' : 'left');

            return (
              <motion.section
                key={i}
                className={`${align === 'right' ? 'text-right' : 'text-left'}`}
                style={revealStyle(i)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  ...SPRING_ENTER,
                  delay: baseDelay + stagger * i,
                }}
              >
                {/* Chapter number */}
                <motion.span
                  className="inline-block text-6xl font-black leading-none mb-2 select-none"
                  style={{ color: `${palette.primary}15` }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    opacity: { duration: 0.6, delay: baseDelay + stagger * i + 0.1 },
                    scale: { ...SPRING_ENTER, delay: baseDelay + stagger * i + 0.1 },
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </motion.span>

                {/* Period */}
                <motion.div
                  className="mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ opacity: { duration: 0.4, delay: baseDelay + stagger * i + 0.2 } }}
                >
                  <span
                    className="text-xs font-mono tracking-widest uppercase"
                    style={{ color: palette.glow }}
                  >
                    {entry.period}
                  </span>
                </motion.div>

                {/* Role as large title */}
                <h2
                  className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1 leading-tight"
                  style={{ ...breatheStyle(1), transform: 'translateZ(25px)' }}
                >
                  {entry.role?.ja ?? entry.role?.en ?? ''}
                </h2>

                {/* Company */}
                <p
                  className="text-base text-gray-800 mb-4"
                  style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
                >
                  {entry.company?.ja ?? entry.company?.en ?? ''}
                  {entry.company?.en && entry.company?.ja && (
                    <span className="text-gray-800 ml-2">/ {entry.company.en}</span>
                  )}
                </p>

                {/* Decorative line */}
                <motion.div
                  className="mb-4"
                  style={{
                    width: '60px',
                    height: '3px',
                    borderRadius: '2px',
                    background: `linear-gradient(to right, ${palette.primary}, ${palette.secondary})`,
                    marginLeft: align === 'right' ? 'auto' : '0',
                    marginRight: align === 'left' ? 'auto' : '0',
                    transform: 'translateZ(10px)',
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ ...SPRING_ENTER, delay: baseDelay + stagger * i + 0.3 }}
                />

                {/* Description — line-clamp-3 */}
                {(entry.description?.ja || entry.description?.en) && (
                  <p className="text-sm text-gray-800 leading-relaxed mb-3 max-w-2xl line-clamp-3"
                    style={{ marginLeft: align === 'right' ? 'auto' : '0' }}
                  >
                    {entry.description?.ja ?? entry.description?.en}
                  </p>
                )}

                {/* Highlights as flowing text */}
                {(entry.highlights?.ja?.length || entry.highlights?.en?.length) ? (
                  <div
                    className="space-y-1.5 max-w-2xl"
                    style={{ marginLeft: align === 'right' ? 'auto' : '0' }}
                  >
                    {(entry.highlights?.ja ?? entry.highlights?.en ?? []).slice(0, 3).map((h: string, j: number) => (
                      <motion.p
                        key={j}
                        className="text-sm text-gray-800 leading-relaxed pl-3 border-l-2"
                        style={{
                          borderColor: `${palette.primary}30`,
                          ...revealStyle(i * 4 + j),
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          opacity: { duration: 0.4, delay: baseDelay + stagger * i + 0.4 + stagger * j },
                        }}
                      >
                        {h}
                      </motion.p>
                    ))}
                  </div>
                ) : null}
              </motion.section>
            );
          })}
        </div>

        {/* "+N more" indicator */}
        {hiddenCount > 0 && (
          <motion.p
            className="text-center text-sm text-gray-800 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ opacity: { duration: 0.6, delay: baseDelay + stagger * displayed.length + 0.3 } }}
          >
            +{hiddenCount} more
          </motion.p>
        )}

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="mt-6 pt-4 border-t border-gray-200 prose prose-gray prose-sm max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              opacity: { duration: 0.6, delay: baseDelay + stagger * displayed.length + 0.5 },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
