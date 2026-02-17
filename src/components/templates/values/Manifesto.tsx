'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

export function ValuesManifesto({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  const sections = [
    {
      label: 'BELIEFS',
      text: d?.beliefs?.ja ?? d?.beliefs?.en ?? '',
    },
    {
      label: 'VISION FOR FUTURE',
      text: d?.visionForFutureSaaS?.ja ?? d?.visionForFutureSaaS?.en ?? '',
    },
    {
      label: 'WORK STYLE',
      text: d?.workStyle?.ja ?? d?.workStyle?.en ?? '',
    },
  ].filter((s) => s.text);

  return (
    <div className="h-full w-full overflow-hidden bg-white">
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title — ai-breathe on main heading */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING_ENTER, delay: baseDelay }}
        >
          <h1
            className="text-3xl md:text-5xl font-black tracking-tight uppercase"
            style={{
              background: `linear-gradient(135deg, ${palette.primary}, ${palette.glow}, ${palette.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              ...breatheStyle(0),
              transform: 'translateZ(40px)',
            }}
          >
            Manifesto
          </h1>
          <motion.div
            className="mx-auto mt-4"
            style={{
              width: '120px',
              height: '3px',
              background: `linear-gradient(to right, ${palette.primary}, ${palette.secondary})`,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.3 }}
          />
        </motion.div>

        {/* Sections — reduced spacing, ai-reveal */}
        <div className="space-y-6">
          {sections.map((section, i) => {
            const alignRight = mirror ? i % 2 === 0 : i % 2 !== 0;

            return (
              <motion.section
                key={i}
                className={`${alignRight ? 'text-right' : 'text-left'}`}
                style={{ ...revealStyle(i), borderRadius: organicRadius }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  ...SPRING_ENTER,
                  delay: baseDelay + 0.3 + stagger * i,
                }}
              >
                {/* Section label — ai-breathe on section headings */}
                <motion.span
                  className="inline-block text-xs font-mono tracking-[0.4em] uppercase mb-3 px-4 py-1.5 border"
                  style={{
                    color: palette.glow,
                    borderColor: `${palette.primary}30`,
                    backgroundColor: `${palette.primary}08`,
                    borderRadius: organicRadius,
                    ...breatheStyle(i + 1),
                    transform: 'translateZ(25px)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: baseDelay + 0.3 + stagger * i + 0.15 }}
                >
                  {section.label}
                </motion.span>

                {/* Text — reduced from 4xl to 2xl */}
                <motion.p
                  className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-snug max-w-3xl"
                  style={{
                    marginLeft: alignRight ? 'auto' : '0',
                    transform: 'translateZ(20px)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: baseDelay + 0.3 + stagger * i + 0.25 }}
                >
                  {section.text}
                </motion.p>

                {/* Accent underline */}
                <motion.div
                  className="mt-3"
                  style={{
                    width: '40px',
                    height: '2px',
                    background: palette.primary,
                    marginLeft: alignRight ? 'auto' : '0',
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: baseDelay + 0.3 + stagger * i + 0.35, duration: 0.5 }}
                />
              </motion.section>
            );
          })}
        </div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="mt-8 pt-6 border-t border-gray-200 prose prose-gray max-w-none"
            style={{ transform: 'translateZ(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.3 + stagger * sections.length + 0.4 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
