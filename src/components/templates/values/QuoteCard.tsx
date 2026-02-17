'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius } from '@/lib/animation';

export function ValuesQuoteCard({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const d = data as any;
  const beliefs = d?.beliefs?.ja ?? d?.beliefs?.en ?? '';
  const baseDelay = visualSeed.animationDelay;

  return (
    <div className="h-full w-full overflow-hidden bg-gray-950 flex items-center justify-center">
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

      <div className="max-w-3xl mx-auto px-8 py-8 text-center">
        {/* Large quote marks */}
        <motion.div
          className="relative inline-block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: baseDelay }}
        >
          {/* Opening quote */}
          <motion.span
            className="absolute -top-12 -left-8 text-[100px] leading-none font-serif select-none pointer-events-none"
            style={{ color: `${palette.primary}25` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_ENTER, delay: baseDelay + 0.2 }}
          >
            &ldquo;
          </motion.span>

          {/* Closing quote */}
          <motion.span
            className="absolute -bottom-16 -right-8 text-[100px] leading-none font-serif select-none pointer-events-none"
            style={{ color: `${palette.primary}25` }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_ENTER, delay: baseDelay + 0.4 }}
          >
            &rdquo;
          </motion.span>

          {/* Beliefs as quote — ai-breathe on main quote */}
          <motion.blockquote
            className="relative text-2xl md:text-3xl lg:text-4xl font-light text-white leading-relaxed tracking-wide"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              ...breatheStyle(0),
              transform: 'translateZ(40px)',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_ENTER, delay: baseDelay + 0.3 }}
          >
            {beliefs}
          </motion.blockquote>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="mx-auto mt-8 mb-6"
          style={{
            width: '80px',
            height: '2px',
            background: `linear-gradient(to right, transparent, ${palette.primary}, ${palette.secondary}, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: baseDelay + 0.6 }}
        />

        {/* Vision & Work Style — ai-reveal */}
        <div className="space-y-4 mt-4">
          {d?.visionForFutureSaaS && (
            <motion.div
              style={{ ...revealStyle(0), transform: 'translateZ(20px)' }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_ENTER, delay: baseDelay + 0.7 }}
            >
              <p
                className="text-xs font-mono tracking-[0.3em] uppercase mb-1"
                style={{ color: palette.glow, ...breatheStyle(1), transform: 'translateZ(25px)' }}
              >
                Vision
              </p>
              <p className="text-base text-gray-400 leading-relaxed max-w-xl mx-auto">
                {d.visionForFutureSaaS?.ja ?? d.visionForFutureSaaS?.en ?? ''}
              </p>
            </motion.div>
          )}

          {d?.workStyle && (
            <motion.div
              style={{ ...revealStyle(1), transform: 'translateZ(20px)' }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_ENTER, delay: baseDelay + 0.9 }}
            >
              <p
                className="text-xs font-mono tracking-[0.3em] uppercase mb-1"
                style={{ color: palette.glow, ...breatheStyle(2), transform: 'translateZ(25px)' }}
              >
                Work Style
              </p>
              <p className="text-base text-gray-400 leading-relaxed max-w-xl mx-auto">
                {d.workStyle?.ja ?? d.workStyle?.en ?? ''}
              </p>
            </motion.div>
          )}
        </div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            className="mt-10 prose prose-invert prose-gray max-w-none text-left"
            style={{ transform: 'translateZ(20px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: baseDelay + 1.1 }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
}
