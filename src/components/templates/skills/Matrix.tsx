'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps, SkillsData } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

/**
 * Terminal-aesthetic dot/cell matrix grid.
 * Rows = skills, columns = level indicators.
 * Cells glow with accent color at varying intensities.
 */
export function SkillsMatrix({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const skillsData = data as SkillsData;
  const categories = skillsData?.categories ?? [];
  const allSkills = categories.flatMap((c: any) => c.skills ?? []);
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  // Limit displayed skills to fit in 1 viewport
  const MAX_SKILLS = 20;
  const limitedCategories = (() => {
    let count = 0;
    return categories.map((c: any) => {
      const skills = c.skills ?? [];
      const remaining = MAX_SKILLS - count;
      if (remaining <= 0) return { ...c, skills: [] };
      const limited = skills.slice(0, remaining);
      count += limited.length;
      return { ...c, skills: limited };
    }).filter((c: any) => c.skills.length > 0);
  })();

  // Global skill index for revealStyle
  let globalIdx = 0;

  return (
    <div className="h-full w-full overflow-hidden bg-white">
      {/* CRT-like scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-20 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
        }}
      />

      {/* CSS keyframe background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1f`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8 h-full flex flex-col">
        {/* Terminal header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: baseDelay }}
          className="flex-1 min-h-0 flex flex-col"
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 rounded-t-lg border border-gray-200 bg-gray-50/50 px-4 py-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500/70" />
            <div className="h-2 w-2 rounded-full bg-yellow-500/70" />
            <div className="h-2 w-2 rounded-full bg-green-500/70" />
            <span className="ml-3 font-mono text-[10px] text-gray-800">
              skills --matrix --format=visual
            </span>
          </div>

          {/* Terminal body */}
          <div className="flex-1 min-h-0 flex flex-col rounded-b-lg border border-t-0 border-gray-200 bg-white/40 p-3 sm:p-4 backdrop-blur-sm">
            {/* Header line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...SPRING_ENTER, delay: baseDelay + 0.2 }}
              className="mb-1 font-mono text-[10px]"
              style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
            >
              <span style={{ color: palette.glow }}>$</span>
              <span className="text-gray-800"> loading skill matrix...</span>

            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + 0.4, duration: 0.3 }}
              className="mb-3 font-mono text-[10px] text-gray-800"
            >
              -- {allSkills.length} skills across {categories.length} categories --
            </motion.div>

            {/* Matrix Header Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + 0.5, duration: 0.3 }}
              className={`mb-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-800 ${mirror ? 'flex-row-reverse' : ''}`}
            >
              <span className={`${mirror ? 'text-right' : 'text-left'} w-28 shrink-0 sm:w-36`}>
                SKILL
              </span>
              <div className="flex flex-1 items-center gap-0.5">
                {['L1', 'L2', 'L3', 'L4', 'L5'].map((label) => (
                  <span key={label} className="w-6 text-center sm:w-8">
                    {label}
                  </span>
                ))}
              </div>
              <span className="w-10 text-center">YRS</span>
            </motion.div>

            {/* Separator */}
            <motion.div
              className="mb-2 h-px"
              style={{
                background: `linear-gradient(90deg, ${palette.primary}30, ${palette.primary}10, transparent)`,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: baseDelay + 0.55, duration: 0.6 }}
            />

            {/* Matrix rows grouped by category - reduced row height */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {limitedCategories.map((category: any, catIdx: number) => {
                const catDelay = baseDelay + 0.6 + stagger * catIdx;
                const skills = category.skills ?? [];

                return (
                  <div key={catIdx} className="mb-2 last:mb-0">
                    {/* Category label */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: catDelay, duration: 0.3 }}
                      className={`mb-1 font-mono text-[9px] font-bold uppercase tracking-wide ${mirror ? 'text-right' : 'text-left'}`}
                      style={{ color: palette.glow + '80' }}
                    >
                      /* {category.name?.en ?? category.name?.ja ?? ''} */
                    </motion.div>

                    {/* Skill rows - compact */}
                    {skills.map((skill: any, skillIdx: number) => {
                      const level = Math.min(Math.max(skill.level ?? 0, 0), 5);
                      const rowDelay = catDelay + 0.05 + stagger * skillIdx;
                      const currentIdx = globalIdx++;

                      return (
                        <motion.div
                          key={skillIdx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ ...SPRING_ENTER, delay: rowDelay }}
                          className={`group mb-0.5 flex items-center gap-1.5 rounded-sm px-1 py-0.5 font-mono transition-colors hover:bg-gray-50 ${mirror ? 'flex-row-reverse' : ''}`}
                          style={{ ...revealStyle(currentIdx), transform: 'translateZ(15px)' }}
                        >
                          {/* Skill name */}
                          <span
                            className={`w-28 shrink-0 truncate text-[11px] text-gray-800 transition-colors group-hover:text-gray-900 sm:w-36 ${mirror ? 'text-right' : 'text-left'}`}
                          >
                            {skill.name}
                          </span>

                          {/* Level cells - reduced size */}
                          <div className="flex flex-1 items-center gap-0.5">
                            {Array.from({ length: 5 }, (_, cellIdx) => {
                              const isActive = cellIdx < level;
                              const cellDelay = rowDelay + 0.15 + stagger * cellIdx;
                              const intensity = isActive
                                ? 0.4 + (cellIdx / 4) * 0.6
                                : 0;

                              return (
                                <motion.div
                                  key={cellIdx}
                                  className="flex h-5 w-6 items-center justify-center rounded-sm sm:h-5 sm:w-8"
                                  style={{
                                    backgroundColor: isActive
                                      ? `${palette.primary}${Math.round(intensity * 40).toString(16).padStart(2, '0')}`
                                      : 'rgba(0,0,0,0.03)',
                                    border: `1px solid ${isActive ? palette.primary + '30' : 'rgba(0,0,0,0.06)'}`,
                                    boxShadow: isActive
                                      ? `0 0 ${cellIdx * 4 + 4}px ${palette.glow}${Math.round(intensity * 30).toString(16).padStart(2, '0')}`
                                      : 'none',
                                    transform: 'translateZ(20px)',
                                  }}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ ...SPRING_ENTER, delay: cellDelay }}
                                  whileHover={
                                    isActive
                                      ? {
                                          scale: 1.1,
                                        }
                                      : {}
                                  }
                                >
                                  {isActive && (
                                    <motion.div
                                      className="h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2"
                                      style={{
                                        backgroundColor: palette.glow,
                                        opacity: intensity,
                                        boxShadow: `0 0 6px ${palette.glow}80`,
                                      }}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ ...SPRING_ENTER, delay: cellDelay + 0.1 }}
                                    />
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Years */}
                          <motion.span
                            className="w-10 text-center font-mono text-[10px] text-gray-800"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: rowDelay + 0.4, duration: 0.3 }}
                          >
                            {skill.yearsOfExperience != null
                              ? `${skill.yearsOfExperience}y`
                              : '\u2014'}
                          </motion.span>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Footer stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + 1.2, duration: 0.4 }}
              className="mt-2 border-t border-gray-200 pt-2"
            >
              <div className="flex flex-wrap gap-3 font-mono text-[9px] text-gray-800">
                <span>
                  <span style={{ color: palette.glow }}>TOTAL:</span>{' '}
                  {allSkills.length} skills
                </span>
                <span>
                  <span style={{ color: palette.glow }}>AVG_LVL:</span>{' '}
                  {allSkills.length > 0
                    ? (
                        allSkills.reduce(
                          (acc: number, s: any) => acc + (s.level ?? 0),
                          0
                        ) / allSkills.length
                      ).toFixed(2)
                    : '0.00'}
                </span>
                <span>
                  <span style={{ color: palette.glow }}>MAX_LVL:</span>{' '}
                  {allSkills.length > 0
                    ? Math.max(...allSkills.map((s: any) => s.level ?? 0))
                    : 0}
                </span>
                <span>
                  <span style={{ color: palette.glow }}>CATEGORIES:</span>{' '}
                  {categories.length}
                </span>
              </div>
            </motion.div>

            {/* Blinking cursor */}
            <motion.div className="mt-2 font-mono text-[10px]">
              <span style={{ color: palette.glow }}>$</span>
              <motion.span
                className="ml-1 inline-block h-3 w-1.5"
                style={{ backgroundColor: palette.glow }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: baseDelay + 1.5 }}
            className="mt-3 border border-gray-200 bg-white/50 p-4 backdrop-blur-sm"
            style={{ borderRadius: organicRadius }}
          >
            <div className="prose prose-sm max-w-none prose-p:text-gray-800 prose-strong:text-gray-900 prose-a:text-indigo-600">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
