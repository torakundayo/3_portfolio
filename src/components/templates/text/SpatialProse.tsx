'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { breatheStyle, seededRandom } from '@/lib/animation';

export function TextSpatialProse({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;

  // Split commentary into paragraphs for spatial placement
  const paragraphs = useMemo(() => {
    if (!commentary) return [];
    return commentary
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [commentary]);

  // Generate spatial positions for each paragraph at different depths
  const positions = useMemo(() => {
    const r = seededRandom(visualSeed.accentIndex * 23 + 51);
    return paragraphs.map((_, i) => {
      const totalCount = paragraphs.length;
      const verticalSpread = Math.min(50, totalCount * 12);
      const yCenter = 40;
      const yOffset = totalCount > 1
        ? (i / (totalCount - 1) - 0.5) * verticalSpread
        : 0;
      const side = mirror ? -1 : 1;
      const xOffset = (i % 2 === 0 ? -1 : 1) * side * (8 + r() * 10);

      return {
        x: 50 + xOffset,
        y: yCenter + yOffset,
        z: 20 + (1 - i / Math.max(totalCount - 1, 1)) * 40,
        opacity: 1 - i * 0.1,
      };
    });
  }, [paragraphs, mirror, visualSeed.accentIndex]);

  return (
    <div className="h-full w-full overflow-hidden relative bg-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[55vw] h-[55vh] rounded-full blur-3xl"
          style={{
            background: `${palette.primary}15`,
            left: '25%',
            top: '15%',
            animation: 'bg-drift-1 14s ease-in-out infinite',
          }}
        />
      </div>

      {/* Paragraphs floating at different depths */}
      {paragraphs.map((text, i) => {
        const pos = positions[i];
        if (!pos) return null;

        return (
          <motion.div
            key={i}
            className="absolute z-20 max-w-md px-4"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate3d(-50%, -50%, ${pos.z}px)`,
              ...breatheStyle(i),
            }}
            initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ opacity: pos.opacity, clipPath: 'inset(0 0% 0 0)' }}
            transition={{
              duration: 0.8,
              delay: baseDelay + i * 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Subtle glow */}
            <div
              className="absolute inset-0 -z-10 rounded-full blur-2xl pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${palette.glow}10, transparent 70%)`,
                transform: 'scale(2)',
              }}
            />

            <div className="prose prose-sm prose-p:text-gray-800 prose-p:leading-[1.8] max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
