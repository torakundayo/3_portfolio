'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps, SkillsData } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, cardFloatStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

export function SkillsBarChart({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const skillsData = data as SkillsData;
  const categories = skillsData?.categories ?? [];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const variant = getLayoutVariant(visualSeed.layoutVariant);
  const { stagger } = seededStagger(visualSeed.colorOffset);

  // Flatten all skills with a global index for revealStyle
  let globalSkillIdx = 0;

  return (
    <div className="h-full w-full overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      {/* CSS keyframe background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1f`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10 h-full flex flex-col">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, x: mirror ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING_ENTER, delay: baseDelay }}
          className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
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
        </motion.h2>

        {/* Categories — A: side-by-side, B: stacked vertical, C: 2-col grid */}
        <div className={`flex-1 min-h-0 overflow-hidden ${
          variant === 'B' ? 'flex flex-col gap-4 overflow-y-auto'
          : variant === 'C' ? 'grid grid-cols-2 gap-4'
          : 'flex gap-4'
        }`}>
          {categories.map((category: any, catIdx: number) => {
            const catDelay = baseDelay + catIdx * stagger;
            const catStartIdx = globalSkillIdx;

            return (
              <motion.div
                key={catIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...SPRING_ENTER, delay: catDelay }}
                className={variant === 'B' ? 'flex flex-col' : 'flex-1 min-w-0 flex flex-col'}
              >
                {/* Category name */}
                <div className="mb-3 flex items-center gap-2">
                  <motion.div
                    className="h-px flex-1"
                    style={{ background: `linear-gradient(${mirror ? '270deg' : '90deg'}, ${palette.primary}60, transparent)`, transformOrigin: mirror ? 'right' : 'left' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: catDelay + 0.1 }}
                  />
                  <h3 className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-800">
                    {category.name?.ja ?? category.name?.en ?? ''}
                    {category.name?.en && (
                      <span className="ml-1.5 text-[10px] font-normal text-gray-800">
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

                {/* Skill bars - compact */}
                <div className="space-y-1.5 flex-1 min-h-0">
                  {(category.skills ?? []).map((skill: any, skillIdx: number) => {
                    const level = Math.min(Math.max(skill.level ?? 0, 0), 5);
                    const pct = (level / 5) * 100;
                    const skillDelay = catDelay + 0.2 + skillIdx * 0.08;
                    const revealIdx = catStartIdx + skillIdx;
                    // Advance globalSkillIdx only on first category render pass — store for later use
                    const currentGlobalIdx = (() => { globalSkillIdx++; return revealIdx; })();

                    return (
                      <motion.div
                        key={skillIdx}
                        initial={{ opacity: 0, x: mirror ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...SPRING_ENTER, delay: skillDelay }}
                        className="group"
                        style={{ ...revealStyle(currentGlobalIdx), ...cardFloatStyle(currentGlobalIdx), transform: 'translateZ(15px)' }}
                      >
                        <div
                          className={`flex items-center gap-2 ${mirror ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                          {/* Skill name */}
                          <span
                            className={`w-24 shrink-0 text-xs font-medium text-gray-800 truncate ${mirror ? 'text-right' : 'text-left'}`}
                          >
                            {skill.name}
                          </span>

                          {/* Bar track — glow intensity scales with proficiency */}
                          <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-gray-100 backdrop-blur-sm">
                            {/* Animated fill using scaleX */}
                            <motion.div
                              className="absolute inset-y-0 left-0 right-0 rounded-md"
                              style={{
                                background: `linear-gradient(90deg, ${palette.primary}${level >= 4 ? 'ff' : level >= 3 ? 'cc' : '99'}, ${palette.secondary})`,
                                boxShadow: `0 0 ${8 + level * 6}px ${palette.glow}${Math.round(15 + level * 12).toString(16).padStart(2, '0')}`,
                                transformOrigin: 'left',
                              }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: pct / 100 }}
                              transition={{
                                ...SPRING_ENTER,
                                delay: skillDelay + 0.15,
                              }}
                            />

                            {/* Shimmer — only on high-proficiency bars */}
                            {level >= 4 && (
                              <motion.div
                                className="absolute inset-y-0 left-0 rounded-md"
                                style={{
                                  width: `${pct}%`,
                                  background: `linear-gradient(90deg, transparent, ${palette.glow}30, transparent)`,
                                }}
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                              />
                            )}
                          </div>

                          {/* Years badge */}
                          {skill.yearsOfExperience != null && (
                            <motion.span
                              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-800 ring-1 ring-gray-200"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ ...SPRING_ENTER, delay: skillDelay + 0.5 }}
                            >
                              {skill.yearsOfExperience}yr
                            </motion.span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: baseDelay + categories.length * 0.15 + 0.5 }}
            className="mt-6 border border-gray-200 bg-white/50 p-5 backdrop-blur-sm"
            style={{ borderRadius: organicRadius, transform: 'translateZ(5px)' }}
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
