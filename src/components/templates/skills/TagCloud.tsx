'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

/**
 * Floating tag cloud visualization.
 * Tags vary in size by skill level and float with subtle random motion.
 */
export function SkillsTagCloud({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const skillsData = data as any;
  const categories = skillsData?.categories ?? [];
  const allSkills = categories.flatMap((c: any) => c.skills ?? []);
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  // Deterministic pseudo-random from seed
  const seededRandom = (index: number, offset: number = 0) => {
    const x = Math.sin((index + 1) * 9301 + offset * 4297 + visualSeed.colorOffset * 7919) * 10000;
    return x - Math.floor(x);
  };

  // Calculate tag positions with some spread to avoid overlap
  const tagLayout = useMemo(() => {
    return allSkills.map((skill: any, i: number) => {
      const level = Math.min(Math.max(skill.level ?? 1, 1), 5);
      // Font size ranges from 0.75rem (level 1) to 1.75rem (level 5)
      const fontSize = 0.75 + (level - 1) * 0.25;
      // Positioning: distribute in a roughly circular/organic pattern
      const angle = (i / Math.max(allSkills.length, 1)) * 2 * Math.PI + seededRandom(i, 0) * 0.8;
      const radius = 20 + seededRandom(i, 1) * 25;
      const xPct = 50 + radius * Math.cos(angle) * (mirror ? -1 : 1);
      const yPct = 45 + radius * Math.sin(angle) * 0.7;

      return {
        skill,
        level,
        fontSize,
        x: Math.max(8, Math.min(92, xPct)),
        y: Math.max(8, Math.min(85, yPct)),
        floatX: (seededRandom(i, 2) - 0.5) * 50,
        floatY: (seededRandom(i, 3) - 0.5) * 44,
        floatDuration: 4 + seededRandom(i, 4) * 6,
        delay: baseDelay + stagger * i,
      };
    });
  }, [allSkills, baseDelay, mirror, visualSeed.colorOffset]);

  // Level-dependent opacity and glow
  const getLevelStyle = (level: number) => {
    const intensity = 0.3 + (level / 5) * 0.7;
    return {
      color: palette.glow,
      opacity: intensity,
      textShadow: `0 0 ${level * 6}px ${palette.glow}${Math.round(intensity * 80).toString(16).padStart(2, '0')}`,
      borderColor: `${palette.primary}${Math.round(intensity * 60).toString(16).padStart(2, '0')}`,
      backgroundColor: `${palette.primary}${Math.round(intensity * 20).toString(16).padStart(2, '0')}`,
    };
  };

  return (
    <div className="h-full w-full overflow-hidden bg-white">
      {/* CSS keyframe background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1f`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* Title */}
        <motion.div
          className="px-6 pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING_ENTER, delay: baseDelay }}
        >
          <h2
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${palette.primary}, ${palette.glow})`,
              }}
            >
              Skills
            </span>
          </h2>
        </motion.div>

        {/* Tag Cloud area */}
        <div className="relative mx-auto w-full max-w-4xl flex-1 px-4" style={{ minHeight: '55vh' }}>
          {tagLayout.map((tag: any, i: number) => {
            const style = getLevelStyle(tag.level);

            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${tag.x}%`,
                  top: `${tag.y}%`,
                  transform: 'translate(-50%, -50%) translateZ(15px)',
                  ...revealStyle(i),
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  ...SPRING_ENTER,
                  delay: tag.delay,
                }}
              >
                <motion.div
                  animate={{
                    x: [0, tag.floatX, -tag.floatX * 0.5, 0],
                    y: [0, tag.floatY, -tag.floatY * 0.6, 0],
                  }}
                  transition={{
                    duration: tag.floatDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <span
                    className="inline-block cursor-default rounded-full border px-3 py-1.5 font-medium whitespace-nowrap transition-all duration-300 hover:scale-110"
                    style={{
                      fontSize: `${tag.fontSize}rem`,
                      color: style.color,
                      textShadow: style.textShadow,
                      borderColor: style.borderColor,
                      backgroundColor: style.backgroundColor,
                      boxShadow: `0 0 24px ${palette.glow}50, 0 0 48px ${palette.primary}30`,
                    }}
                  >
                    {tag.skill.name}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: baseDelay + allSkills.length * stagger + 0.6 }}
            className="mx-auto mb-6 w-full max-w-2xl px-6"
          >
            <div
              className="border border-gray-200 bg-white/50 p-5 backdrop-blur-sm"
              style={{ borderRadius: organicRadius }}
            >
              <div className="prose prose-sm max-w-none prose-p:text-gray-800 prose-strong:text-gray-900 prose-a:text-indigo-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
