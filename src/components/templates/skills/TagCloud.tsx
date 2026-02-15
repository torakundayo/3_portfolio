'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

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
        floatX: (seededRandom(i, 2) - 0.5) * 30,
        floatY: (seededRandom(i, 3) - 0.5) * 20,
        floatDuration: 4 + seededRandom(i, 4) * 6,
        delay: baseDelay + i * 0.06,
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
    <div className="h-full w-full overflow-auto bg-gray-950">
      {/* Deep space background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 50%, ${palette.primary}08, transparent),
            radial-gradient(ellipse 40% 30% at ${mirror ? '70%' : '30%'} 30%, ${palette.secondary}06, transparent),
            radial-gradient(ellipse 50% 40% at ${mirror ? '30%' : '70%'} 70%, ${palette.glow}04, transparent)
          `,
        }}
      />

      <div className="relative z-10 flex h-full min-h-screen flex-col">
        {/* Title */}
        <motion.div
          className="px-6 pt-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: baseDelay }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
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
        <div className="relative mx-auto w-full max-w-4xl flex-1 px-4" style={{ minHeight: '60vh' }}>
          {tagLayout.map((tag: any, i: number) => {
            const style = getLevelStyle(tag.level);

            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${tag.x}%`,
                  top: `${tag.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: tag.delay,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1] as const,
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
                  <motion.span
                    className="inline-block cursor-default rounded-full border px-3 py-1.5 font-medium whitespace-nowrap transition-all duration-300 hover:scale-110"
                    style={{
                      fontSize: `${tag.fontSize}rem`,
                      color: style.color,
                      textShadow: style.textShadow,
                      borderColor: style.borderColor,
                      backgroundColor: style.backgroundColor,
                    }}
                    whileHover={{
                      boxShadow: `0 0 24px ${palette.glow}50, 0 0 48px ${palette.primary}30`,
                    }}
                  >
                    {tag.skill.name}
                    {tag.level >= 4 && (
                      <span className="ml-1 text-[0.6em] opacity-60">
                        Lv.{tag.level}
                      </span>
                    )}
                  </motion.span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: baseDelay + allSkills.length * 0.06 + 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-4 px-6 pb-4 text-xs text-gray-600"
        >
          {[1, 2, 3, 4, 5].map((lvl) => (
            <span key={lvl} className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor: palette.glow,
                  opacity: 0.3 + (lvl / 5) * 0.7,
                  boxShadow: `0 0 ${lvl * 2}px ${palette.glow}40`,
                }}
              />
              Lv.{lvl}
            </span>
          ))}
        </motion.div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: baseDelay + allSkills.length * 0.06 + 0.6 }}
            className="mx-auto mb-10 w-full max-w-2xl px-6"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="prose prose-sm prose-invert max-w-none prose-p:text-gray-400 prose-strong:text-gray-200 prose-a:text-indigo-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
