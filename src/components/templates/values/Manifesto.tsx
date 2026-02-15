'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function ValuesManifesto({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;

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
    <div className="h-full w-full overflow-auto bg-gray-950">
      {/* Dramatic gradient backdrop */}
      <motion.div
        className="fixed inset-0 -z-10"
        animate={{
          background: [
            `linear-gradient(170deg, ${palette.primary}0d 0%, transparent 30%, transparent 70%, ${palette.secondary}08 100%)`,
            `linear-gradient(170deg, ${palette.secondary}0d 0%, transparent 30%, transparent 70%, ${palette.primary}08 100%)`,
            `linear-gradient(170deg, ${palette.primary}0d 0%, transparent 30%, transparent 70%, ${palette.secondary}08 100%)`,
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Title */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <h1
            className="text-5xl md:text-7xl font-black tracking-tight uppercase"
            style={{
              background: `linear-gradient(135deg, ${palette.primary}, ${palette.glow}, ${palette.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Manifesto
          </h1>
          <motion.div
            className="mx-auto mt-6"
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

        {/* Sections */}
        <div className="space-y-24">
          {sections.map((section, i) => {
            const alignRight = mirror ? i % 2 === 0 : i % 2 !== 0;

            return (
              <motion.section
                key={i}
                className={`${alignRight ? 'text-right' : 'text-left'}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: baseDelay + 0.3 + 0.25 * i,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                {/* Section label */}
                <motion.span
                  className="inline-block text-xs font-mono tracking-[0.4em] uppercase mb-6 px-4 py-1.5 rounded-full border"
                  style={{
                    color: palette.glow,
                    borderColor: `${palette.primary}30`,
                    backgroundColor: `${palette.primary}08`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: baseDelay + 0.3 + 0.25 * i + 0.15 }}
                >
                  {section.label}
                </motion.span>

                {/* Large bold text */}
                <motion.p
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-snug max-w-3xl"
                  style={{ marginLeft: alignRight ? 'auto' : '0' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: baseDelay + 0.3 + 0.25 * i + 0.25 }}
                >
                  {section.text}
                </motion.p>

                {/* Accent underline */}
                <motion.div
                  className="mt-6"
                  style={{
                    width: '40px',
                    height: '2px',
                    background: palette.primary,
                    marginLeft: alignRight ? 'auto' : '0',
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: baseDelay + 0.3 + 0.25 * i + 0.35, duration: 0.5 }}
                />
              </motion.section>
            );
          })}
        </div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="mt-24 pt-12 border-t border-gray-800 prose prose-invert prose-gray max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.3 + 0.25 * sections.length + 0.4 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
