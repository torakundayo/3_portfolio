'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { TemplateProps, ValuesData } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { breatheStyle, seededRandom } from '@/lib/animation';

export function ValuesSpatialBeliefs({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const valuesData = data as ValuesData;
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;

  // Extract belief keywords from beliefs text
  const beliefs = valuesData?.beliefs?.ja || valuesData?.beliefs?.en || '';
  const vision = valuesData?.visionForFutureSaaS?.ja || valuesData?.visionForFutureSaaS?.en || '';

  const textBlocks = useMemo(() => {
    const blocks: { text: string; importance: number }[] = [];
    if (beliefs) blocks.push({ text: beliefs, importance: 1.0 });
    if (vision) blocks.push({ text: vision, importance: 0.8 });
    return blocks;
  }, [beliefs, vision]);

  // Generate spatial positions for text blocks
  const positions = useMemo(() => {
    const r = seededRandom(visualSeed.accentIndex * 17 + 33);
    return textBlocks.map((block, i) => {
      const angle = (i / Math.max(textBlocks.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const radius = 8 + i * 12;
      const side = mirror ? -1 : 1;
      return {
        x: 50 + Math.cos(angle) * radius * side + (r() - 0.5) * 10,
        y: 35 + Math.sin(angle) * radius * 0.6 + (r() - 0.5) * 8,
        z: 30 + block.importance * 30,
        scale: 0.85 + block.importance * 0.15,
      };
    });
  }, [textBlocks, mirror, visualSeed.accentIndex]);

  return (
    <div className="h-full w-full overflow-hidden relative bg-white">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{
            background: `${palette.primary}18`,
            left: '25%',
            top: '15%',
            animation: 'bg-drift-1 14s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[45vw] h-[45vh] rounded-full blur-3xl"
          style={{
            background: `${palette.secondary}12`,
            right: '20%',
            bottom: '20%',
            animation: 'bg-drift-2 16s ease-in-out infinite',
          }}
        />
      </div>

      {/* Text blocks floating in space */}
      {textBlocks.map((block, i) => {
        const pos = positions[i];
        if (!pos) return null;

        return (
          <motion.div
            key={i}
            className="absolute z-20 max-w-sm md:max-w-md"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate3d(-50%, -50%, ${pos.z}px) scale(${pos.scale})`,
              ...breatheStyle(i),
            }}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
            animate={{ opacity: 0.9, scale: pos.scale, filter: 'blur(0px)' }}
            transition={{
              duration: 1,
              delay: baseDelay + i * 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Glow behind text */}
            <div
              className="absolute inset-0 -z-10 rounded-full blur-2xl pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${i === 0 ? palette.primary : palette.glow}15, transparent 70%)`,
                transform: 'scale(2)',
              }}
            />

            <p className="text-sm md:text-base text-gray-800 leading-[1.9] font-normal">
              {block.text}
            </p>
          </motion.div>
        );
      })}

      {/* Commentary */}
      {commentary && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-xs z-30
                     opacity-50 hover:opacity-85 transition-opacity duration-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.2, delay: baseDelay + 1 }}
          style={breatheStyle(3)}
        >
          <p className="text-xs text-gray-800 leading-relaxed line-clamp-3">{commentary}</p>
        </motion.div>
      )}
    </div>
  );
}
