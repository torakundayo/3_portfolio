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

export function CareerVerticalTimeline({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const history: CareerEntry[] = d?.history ?? [];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const variant = getLayoutVariant(visualSeed.layoutVariant);
  const { stagger } = seededStagger(visualSeed.colorOffset);

  // Limit to 2 latest entries for single-viewport fit
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

      <div className="max-w-3xl mx-auto px-6 py-10 h-full flex flex-col justify-center">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — variant B: centered, others: side */}
          <motion.div
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: variant === 'B' ? '50%' : mirror ? 'calc(100% - 1.25rem)' : '1.25rem',
              background: `linear-gradient(to bottom, transparent, ${palette.primary}40, ${palette.secondary}40, transparent)`,
              transform: 'translateZ(10px)',
            }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ ...SPRING_ENTER, delay: baseDelay }}
          />

          {displayed.map((entry, i) => {
            // Variant B: alternate sides; C: compact cards without timeline dots
            const altSide = variant === 'B' ? i % 2 === 0 : mirror;
            return (
            <motion.div
              key={i}
              className="relative mb-6 last:mb-0"
              style={{
                paddingLeft: variant === 'B' ? (altSide ? '0' : 'calc(50% + 1.5rem)') : (mirror ? '0' : '3.5rem'),
                paddingRight: variant === 'B' ? (altSide ? 'calc(50% + 1.5rem)' : '0') : (mirror ? '3.5rem' : '0'),
                ...revealStyle(i),
                transform: 'translateZ(20px)',
              }}
              initial={{ opacity: 0, rotateX: 2 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{
                ...SPRING_ENTER,
                delay: baseDelay + stagger * i,
                rotateX: { ...SPRING_ENTER, delay: baseDelay + stagger * i },
              }}
            >
              {/* Dot */}
              {variant !== 'C' && (
              <motion.div
                className="absolute top-2 w-3 h-3 rounded-full ring-4 ring-white"
                style={{
                  left: variant === 'B' ? 'calc(50% - 6px)' : (mirror ? 'auto' : '0.625rem'),
                  right: mirror && variant !== 'B' ? '0.625rem' : 'auto',
                  backgroundColor: palette.primary,
                  boxShadow: `0 0 12px ${palette.glow}60`,
                  transform: 'translateZ(10px)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...SPRING_ENTER, delay: baseDelay + stagger * i + 0.2 }}
              />
              )}

              {/* Card — glassmorphism + organic shape */}
              <div
                className="backdrop-blur-xl bg-white/[0.06] border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ borderRadius: organicRadius }}
              >
                {/* Period */}
                <span
                  className="inline-block text-xs font-medium tracking-wider uppercase mb-2 px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${palette.primary}20`, color: palette.glow }}
                >
                  {entry.period}
                </span>

                {/* Company */}
                <h3
                  className="text-xl font-bold text-gray-900 mb-0.5"
                  style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
                >
                  {entry.company?.ja ?? entry.company?.en ?? ''}
                </h3>
                {entry.company?.en && (
                  <p className="text-sm text-gray-800 mb-2">{entry.company.en}</p>
                )}

                {/* Role */}
                <p
                  className="text-base font-semibold mb-3"
                  style={{ color: palette.primary, ...breatheStyle(1), transform: 'translateZ(25px)' }}
                >
                  {entry.role?.ja ?? entry.role?.en ?? ''}
                </p>

                {/* Description */}
                {(entry.description?.ja || entry.description?.en) && (
                  <p className="text-sm text-gray-800 leading-relaxed mb-3">
                    {entry.description?.ja ?? entry.description?.en}
                  </p>
                )}

                {/* Highlights */}
                {(entry.highlights?.ja?.length || entry.highlights?.en?.length) && (
                  <ul className="space-y-1.5">
                    {(entry.highlights?.ja ?? entry.highlights?.en ?? []).map((h: string, j: number) => (
                      <motion.li
                        key={j}
                        className="flex items-start gap-2 text-sm text-gray-800"
                        style={revealStyle(i * 4 + j)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          opacity: { duration: 0.4, delay: baseDelay + 0.1 * i + 0.3 + 0.05 * j },
                        }}
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
            );
          })}

          {/* "+N more" indicator */}
          {hiddenCount > 0 && (
            <motion.p
              className="text-center text-sm text-gray-800 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ opacity: { duration: 0.6, delay: baseDelay + 0.1 * displayed.length + 0.3 } }}
            >
              +{hiddenCount} more
            </motion.p>
          )}
        </div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="mt-6 prose prose-gray max-w-none"
            style={{ transform: 'translateZ(5px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              opacity: { duration: 0.6, delay: baseDelay + 0.1 * displayed.length + 0.3 },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
