'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function SkillsBarChart({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const skillsData = data as any;
  const categories = skillsData?.categories ?? [];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;

  return (
    <div className="h-full w-full overflow-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Subtle animated background glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 -z-0"
        animate={{
          background: [
            `radial-gradient(ellipse 80% 60% at ${mirror ? '70%' : '30%'} 30%, ${palette.primary}12, transparent)`,
            `radial-gradient(ellipse 80% 60% at ${mirror ? '30%' : '70%'} 70%, ${palette.secondary}12, transparent)`,
            `radial-gradient(ellipse 80% 60% at ${mirror ? '70%' : '30%'} 30%, ${palette.primary}12, transparent)`,
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:py-16">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, x: mirror ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-10 text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${palette.primary}, ${palette.glow})`,
            }}
          >
            Skills
          </span>
        </motion.h2>

        {/* Categories */}
        {categories.map((category: any, catIdx: number) => {
          const catDelay = baseDelay + catIdx * 0.15;

          return (
            <motion.div
              key={catIdx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: catDelay, ease: [0.22, 1, 0.36, 1] as const }}
              className="mb-10 last:mb-0"
            >
              {/* Category name */}
              <div className="mb-4 flex items-center gap-3">
                <motion.div
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(${mirror ? '270deg' : '90deg'}, ${palette.primary}60, transparent)` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: catDelay + 0.1 }}
                  style-origin={mirror ? 'right' : 'left'}
                />
                <h3 className="shrink-0 text-sm font-semibold uppercase tracking-widest text-gray-400">
                  {category.name?.ja ?? category.name?.en ?? ''}
                  {category.name?.en && (
                    <span className="ml-2 text-xs font-normal text-gray-600">
                      {category.name.en}
                    </span>
                  )}
                </h3>
                <motion.div
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(${mirror ? '90deg' : '270deg'}, ${palette.primary}60, transparent)` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: catDelay + 0.1 }}
                />
              </div>

              {/* Skill bars */}
              <div className="space-y-3">
                {(category.skills ?? []).map((skill: any, skillIdx: number) => {
                  const level = Math.min(Math.max(skill.level ?? 0, 0), 5);
                  const pct = (level / 5) * 100;
                  const skillDelay = catDelay + 0.2 + skillIdx * 0.08;

                  return (
                    <motion.div
                      key={skillIdx}
                      initial={{ opacity: 0, x: mirror ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: skillDelay, ease: [0.22, 1, 0.36, 1] as const }}
                      className="group"
                    >
                      <div
                        className={`flex items-center gap-4 ${mirror ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {/* Skill name */}
                        <span
                          className={`w-32 shrink-0 text-sm font-medium text-gray-300 ${mirror ? 'text-right' : 'text-left'}`}
                        >
                          {skill.name}
                        </span>

                        {/* Bar track */}
                        <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-white/5 backdrop-blur-sm">
                          {/* Animated fill */}
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-md"
                            style={{
                              background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
                              boxShadow: `0 0 20px ${palette.glow}30`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              duration: 1.0,
                              delay: skillDelay + 0.15,
                              ease: [0.22, 1, 0.36, 1] as const,
                            }}
                          />

                          {/* Shimmer overlay */}
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              width: `${pct}%`,
                              background: `linear-gradient(90deg, transparent, ${palette.glow}20, transparent)`,
                            }}
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                          />

                          {/* Level text inside bar */}
                          <motion.span
                            className="absolute inset-y-0 flex items-center px-3 text-xs font-bold text-white/90"
                            style={{ left: 0 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: skillDelay + 0.7, duration: 0.4 }}
                          >
                            {level}/5
                          </motion.span>
                        </div>

                        {/* Years badge */}
                        {skill.yearsOfExperience != null && (
                          <motion.span
                            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-400 ring-1 ring-white/10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: skillDelay + 0.5, duration: 0.3 }}
                          >
                            {skill.yearsOfExperience}yr
                          </motion.span>
                        )}
                      </div>

                      {/* Details tooltip on hover */}
                      {(skill.details?.ja || skill.details?.en) && (
                        <div
                          className={`mt-1 max-h-0 overflow-hidden text-xs text-gray-500 transition-all duration-300 group-hover:max-h-20 group-hover:mt-2 ${mirror ? 'text-right pr-2' : 'text-left pl-36'}`}
                        >
                          {skill.details?.ja ?? skill.details?.en}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: baseDelay + categories.length * 0.15 + 0.5 }}
            className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
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
