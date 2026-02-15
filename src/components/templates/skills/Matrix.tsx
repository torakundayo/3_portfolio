'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

/**
 * Terminal-aesthetic dot/cell matrix grid.
 * Rows = skills, columns = level indicators.
 * Cells glow with accent color at varying intensities.
 */
export function SkillsMatrix({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const skillsData = data as any;
  const categories = skillsData?.categories ?? [];
  const allSkills = categories.flatMap((c: any) => c.skills ?? []);
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;

  // Find which category a skill belongs to
  const skillWithCategory = categories.flatMap((c: any) =>
    (c.skills ?? []).map((s: any) => ({
      ...s,
      categoryName: c.name?.ja ?? c.name?.en ?? '',
    }))
  );

  return (
    <div className="h-full w-full overflow-auto bg-gray-950">
      {/* CRT-like scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-20 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      {/* Subtle ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 50% 40%, ${palette.primary}08, transparent)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-8 lg:py-14">
        {/* Terminal header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: baseDelay }}
          className="mb-8"
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 rounded-t-lg border border-white/10 bg-white/5 px-4 py-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            <span className="ml-3 font-mono text-xs text-gray-500">
              skills --matrix --format=visual
            </span>
          </div>

          {/* Terminal body */}
          <div className="rounded-b-lg border border-t-0 border-white/10 bg-black/40 p-4 sm:p-6 backdrop-blur-sm">
            {/* Header line */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: baseDelay + 0.2, duration: 0.5 }}
              className="mb-2 font-mono text-xs"
            >
              <span style={{ color: palette.glow }}>$</span>
              <span className="text-gray-500"> loading skill matrix...</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + 0.4, duration: 0.3 }}
              className="mb-6 font-mono text-xs text-gray-600"
            >
              ── {allSkills.length} skills across {categories.length} categories ──
            </motion.div>

            {/* Matrix Header Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + 0.5, duration: 0.3 }}
              className={`mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-gray-600 ${mirror ? 'flex-row-reverse' : ''}`}
            >
              <span className={`${mirror ? 'text-right' : 'text-left'} w-32 shrink-0 sm:w-40`}>
                SKILL
              </span>
              <div className="flex flex-1 items-center gap-1">
                {['L1', 'L2', 'L3', 'L4', 'L5'].map((label) => (
                  <span key={label} className="w-8 text-center sm:w-10">
                    {label}
                  </span>
                ))}
              </div>
              <span className="w-12 text-center">YRS</span>
            </motion.div>

            {/* Separator */}
            <motion.div
              className="mb-3 h-px"
              style={{
                background: `linear-gradient(90deg, ${palette.primary}30, ${palette.primary}10, transparent)`,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: baseDelay + 0.55, duration: 0.6 }}
            />

            {/* Matrix rows grouped by category */}
            {categories.map((category: any, catIdx: number) => {
              const catDelay = baseDelay + 0.6 + catIdx * 0.1;
              const skills = category.skills ?? [];

              return (
                <div key={catIdx} className="mb-4 last:mb-0">
                  {/* Category label */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: catDelay, duration: 0.3 }}
                    className={`mb-2 font-mono text-[10px] font-bold uppercase tracking-widest ${mirror ? 'text-right' : 'text-left'}`}
                    style={{ color: palette.glow + '80' }}
                  >
                    /* {category.name?.en ?? category.name?.ja ?? ''} */
                  </motion.div>

                  {/* Skill rows */}
                  {skills.map((skill: any, skillIdx: number) => {
                    const level = Math.min(Math.max(skill.level ?? 0, 0), 5);
                    const rowDelay = catDelay + 0.05 + skillIdx * 0.06;

                    return (
                      <motion.div
                        key={skillIdx}
                        initial={{ opacity: 0, x: mirror ? 15 : -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rowDelay, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                        className={`group mb-1 flex items-center gap-2 rounded-sm px-1 py-1 font-mono transition-colors hover:bg-white/[0.03] ${mirror ? 'flex-row-reverse' : ''}`}
                      >
                        {/* Skill name */}
                        <span
                          className={`w-32 shrink-0 truncate text-xs text-gray-400 transition-colors group-hover:text-gray-200 sm:w-40 ${mirror ? 'text-right' : 'text-left'}`}
                        >
                          {skill.name}
                        </span>

                        {/* Level cells */}
                        <div className="flex flex-1 items-center gap-1">
                          {Array.from({ length: 5 }, (_, cellIdx) => {
                            const isActive = cellIdx < level;
                            const cellDelay = rowDelay + 0.15 + cellIdx * 0.04;
                            const intensity = isActive
                              ? 0.4 + (cellIdx / 4) * 0.6
                              : 0;

                            return (
                              <motion.div
                                key={cellIdx}
                                className="flex h-6 w-8 items-center justify-center rounded-sm sm:h-7 sm:w-10"
                                style={{
                                  backgroundColor: isActive
                                    ? `${palette.primary}${Math.round(intensity * 40).toString(16).padStart(2, '0')}`
                                    : 'rgba(255,255,255,0.03)',
                                  border: `1px solid ${isActive ? palette.primary + '30' : 'rgba(255,255,255,0.05)'}`,
                                  boxShadow: isActive
                                    ? `0 0 ${cellIdx * 4 + 4}px ${palette.glow}${Math.round(intensity * 30).toString(16).padStart(2, '0')}`
                                    : 'none',
                                }}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: cellDelay, duration: 0.3 }}
                                whileHover={
                                  isActive
                                    ? {
                                        boxShadow: `0 0 16px ${palette.glow}60`,
                                        scale: 1.1,
                                      }
                                    : {}
                                }
                              >
                                {isActive && (
                                  <motion.div
                                    className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
                                    style={{
                                      backgroundColor: palette.glow,
                                      opacity: intensity,
                                      boxShadow: `0 0 6px ${palette.glow}80`,
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: cellDelay + 0.1, duration: 0.2 }}
                                  />
                                )}
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Years */}
                        <motion.span
                          className="w-12 text-center font-mono text-xs text-gray-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: rowDelay + 0.4, duration: 0.3 }}
                        >
                          {skill.yearsOfExperience != null
                            ? `${skill.yearsOfExperience}y`
                            : '—'}
                        </motion.span>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}

            {/* Footer stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + 1.2, duration: 0.4 }}
              className="mt-6 border-t border-white/5 pt-4"
            >
              <div className="flex flex-wrap gap-4 font-mono text-[10px] text-gray-600">
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
            <motion.div className="mt-4 font-mono text-xs">
              <span style={{ color: palette.glow }}>$</span>
              <motion.span
                className="ml-1 inline-block h-3.5 w-1.5"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: baseDelay + 1.5 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className="prose prose-sm prose-invert max-w-none prose-p:text-gray-400 prose-strong:text-gray-200 prose-a:text-indigo-400">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
