'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps, ValuesData } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

export function ValuesStoryFormat({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as ValuesData;
  const baseDelay = visualSeed.animationDelay;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  const beliefs = d?.beliefs?.ja ?? d?.beliefs?.en ?? '';
  const vision = d?.visionForFutureSaaS?.ja ?? d?.visionForFutureSaaS?.en ?? '';
  const workStyle = d?.workStyle?.ja ?? d?.workStyle?.en ?? '';

  return (
    <div className="h-full w-full overflow-hidden">
      {/* Warm, paper-like background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg, #fafaf8 0%, #f5f3ef 40%, #fafaf8 100%)`,
        }}
      />

      {/* CSS keyframe background drifts (rose/violet) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transform: 'translateZ(-20px)' }}>
        <div
          className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{
            background: `${palette.primary}1f`,
            left: '20%',
            top: '15%',
            animation: 'bg-drift-1 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{
            background: `${palette.secondary}14`,
            right: '15%',
            bottom: '20%',
            animation: 'bg-drift-2 22s ease-in-out infinite',
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-8 py-8">
        {/* Opening ornament */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: baseDelay }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-12" style={{ backgroundColor: `${palette.primary}30` }} />
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: `${palette.primary}40` }} />
            <div className="h-px w-12" style={{ backgroundColor: `${palette.primary}30` }} />
          </div>
        </motion.div>

        {/* Beliefs section — ai-breathe on heading, ai-reveal, line-clamp-3 */}
        {beliefs && (
          <motion.section
            className="mb-8"
            style={{ ...revealStyle(0), borderRadius: organicRadius }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...SPRING_ENTER, delay: baseDelay + 0.2 }}
          >
            <p
              className="text-lg md:text-xl text-gray-800 leading-[1.9] tracking-normal line-clamp-3"
              style={{
                fontFamily: 'Georgia, "Noto Serif JP", serif',
                ...breatheStyle(0),
                transform: 'translateZ(40px)',
              }}
            >
              {beliefs}
            </p>
          </motion.section>
        )}

        {/* Divider */}
        {vision && (
          <>
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.5 }}
            >
              <div className="flex items-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: `${palette.primary}40` }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Vision section — ai-reveal, line-clamp-3 */}
            <motion.section
              className="mb-8"
              style={{ ...revealStyle(1), borderRadius: organicRadius }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...SPRING_ENTER, delay: baseDelay + 0.6 }}
            >
              <motion.div
                className="pl-6 border-l-2 mb-4"
                style={{ borderColor: `${palette.primary}30` }}
              >
                <span
                  className="text-xs font-medium tracking-[0.2em] uppercase"
                  style={{
                    color: palette.primary,
                    ...breatheStyle(1),
                    transform: 'translateZ(25px)',
                  }}
                >
                  Vision
                </span>
              </motion.div>
              <p
                className="text-lg text-gray-800 leading-[1.9] tracking-normal line-clamp-3"
                style={{
                  fontFamily: 'Georgia, "Noto Serif JP", serif',
                  transform: 'translateZ(20px)',
                }}
              >
                {vision}
              </p>
            </motion.section>
          </>
        )}

        {/* Work Style section — ai-reveal, line-clamp-3 */}
        {workStyle && (
          <>
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.9 }}
            >
              <div className="flex items-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: `${palette.primary}40` }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.section
              className="mb-8"
              style={{ ...revealStyle(2), borderRadius: organicRadius }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...SPRING_ENTER, delay: baseDelay + 1.0 }}
            >
              <motion.div
                className="pl-6 border-l-2 mb-4"
                style={{ borderColor: `${palette.secondary}30` }}
              >
                <span
                  className="text-xs font-medium tracking-[0.2em] uppercase"
                  style={{
                    color: palette.secondary,
                    ...breatheStyle(2),
                    transform: 'translateZ(25px)',
                  }}
                >
                  Work Style
                </span>
              </motion.div>
              <p
                className="text-lg text-gray-800 leading-[1.9] tracking-normal line-clamp-3"
                style={{
                  fontFamily: 'Georgia, "Noto Serif JP", serif',
                  transform: 'translateZ(20px)',
                }}
              >
                {workStyle}
              </p>
            </motion.section>
          </>
        )}

        {/* Closing ornament */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: baseDelay + 1.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-12" style={{ backgroundColor: `${palette.primary}30` }} />
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: `${palette.primary}40` }} />
            <div className="h-px w-12" style={{ backgroundColor: `${palette.primary}30` }} />
          </div>
        </motion.div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="prose prose-gray max-w-none prose-p:leading-relaxed"
            style={{ transform: 'translateZ(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 1.5 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
