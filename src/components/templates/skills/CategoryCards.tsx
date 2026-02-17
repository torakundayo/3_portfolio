'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, cardFloatStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

/**
 * Glassmorphism card grid -- one card per skill category.
 * Each card lists the skills inside it with level indicators.
 */
export function SkillsCategoryCards({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const skillsData = data as any;
  const categories = skillsData?.categories ?? [];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const gradientAngle = 135 + visualSeed.colorOffset * 0.5;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  // Level dots renderer
  const LevelDots = ({ level }: { level: number }) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: i < level ? palette.primary : 'rgba(0,0,0,0.08)',
            boxShadow: i < level ? `0 0 6px ${palette.glow}50` : 'none',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING_ENTER, delay: baseDelay + 0.8 + stagger * i }}
        />
      ))}
    </div>
  );

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

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10 h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING_ENTER, delay: baseDelay }}
          className={`mb-6 ${mirror ? 'text-right' : 'text-left'}`}
        >
          <h2
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(${gradientAngle}deg, ${palette.primary}, ${palette.glow})`,
              }}
            >
              Skills & Expertise
            </span>
          </h2>
          <motion.div
            className="mt-2 h-0.5 w-24"
            style={{
              background: `linear-gradient(90deg, ${palette.primary}, ${palette.glow}00)`,
              marginLeft: mirror ? 'auto' : 0,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.2 }}
          />
        </motion.div>

        {/* Card Grid - compact, more columns */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 flex-1 min-h-0 auto-rows-min">
          {categories.map((category: any, catIdx: number) => {
            const cardDelay = baseDelay + 0.2 + stagger * catIdx;
            const skills = category.skills ?? [];

            return (
              <motion.div
                key={catIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...SPRING_ENTER, delay: cardDelay }}
                whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
                className="group relative overflow-hidden"
                style={{ borderRadius: organicRadius, ...cardFloatStyle(catIdx), transform: 'translateZ(15px)' }}
              >
                {/* Glassmorphism background with organic shape */}
                <div
                  className="absolute inset-0 border border-gray-200"
                  style={{
                    borderRadius: organicRadius,
                    background: `linear-gradient(${gradientAngle}deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))`,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                />

                {/* Hover glow border */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    borderRadius: organicRadius,
                    border: `1px solid ${palette.primary}40`,
                    boxShadow: `inset 0 0 30px ${palette.primary}08, 0 0 30px ${palette.primary}08`,
                  }}
                />

                {/* Card Content - compact padding */}
                <div className="relative p-4">
                  {/* Category header */}
                  <div className="mb-3 flex items-center gap-2">
                    {/* Accent dot */}
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: palette.primary,
                        boxShadow: `0 0 12px ${palette.glow}60`,
                      }}
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {category.name?.ja ?? category.name?.en ?? ''}
                      </h3>
                      {category.name?.en && category.name?.ja && (
                        <p className="text-[10px] text-gray-800">{category.name.en}</p>
                      )}
                    </div>
                  </div>

                  {/* Skills list - compact */}
                  <div className="space-y-1.5">
                    {skills.map((skill: any, skillIdx: number) => {
                      const level = Math.min(Math.max(skill.level ?? 0, 0), 5);

                      return (
                        <motion.div
                          key={skillIdx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ ...SPRING_ENTER, delay: cardDelay + 0.15 + stagger * skillIdx }}
                          className="flex items-center justify-between"
                          style={revealStyle(catIdx * 10 + skillIdx)}
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-800">
                              {skill.name}
                            </span>
                            {skill.yearsOfExperience != null && (
                              <span className="text-[9px] text-gray-800">
                                {skill.yearsOfExperience}yr
                              </span>
                            )}
                          </div>
                          <LevelDots level={level} />
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Skill count footer - compact */}
                  <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-2">
                    <span className="text-[10px] text-gray-800">
                      {skills.length} skill{skills.length !== 1 ? 's' : ''}
                    </span>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: palette.glow }}
                    >
                      Avg. Lv.{skills.length > 0
                        ? (skills.reduce((acc: number, s: any) => acc + (s.level ?? 0), 0) / skills.length).toFixed(1)
                        : '0'}
                    </span>
                  </div>
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
            transition={{ duration: 0.7, delay: baseDelay + categories.length * stagger + 0.6 }}
            className="mt-4 border border-gray-200 bg-white/50 p-5 backdrop-blur-sm"
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
