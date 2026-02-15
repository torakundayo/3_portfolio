'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

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

  // Level dots renderer
  const LevelDots = ({ level }: { level: number }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: i < level ? palette.primary : 'rgba(255,255,255,0.1)',
            boxShadow: i < level ? `0 0 8px ${palette.glow}50` : 'none',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: baseDelay + 0.8 + i * 0.05, duration: 0.3 }}
        />
      ))}
    </div>
  );

  return (
    <div className="h-full w-full overflow-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated background layers */}
      <motion.div
        className="pointer-events-none fixed inset-0 -z-0"
        animate={{
          background: [
            `radial-gradient(ellipse 70% 50% at ${mirror ? '60%' : '40%'} 30%, ${palette.primary}10, transparent)`,
            `radial-gradient(ellipse 70% 50% at ${mirror ? '40%' : '60%'} 60%, ${palette.secondary}10, transparent)`,
            `radial-gradient(ellipse 70% 50% at ${mirror ? '60%' : '40%'} 30%, ${palette.primary}10, transparent)`,
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Decorative blurred orbs */}
      <div
        className="pointer-events-none fixed -z-0"
        style={{
          width: '40vw',
          height: '40vw',
          top: '10%',
          left: mirror ? '60%' : '-10%',
          background: `radial-gradient(circle, ${palette.primary}08, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />
      <div
        className="pointer-events-none fixed -z-0"
        style={{
          width: '30vw',
          height: '30vw',
          bottom: '5%',
          right: mirror ? '-5%' : '60%',
          background: `radial-gradient(circle, ${palette.secondary}06, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: baseDelay }}
          className={`mb-10 ${mirror ? 'text-right' : 'text-left'}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
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
            className="mt-3 h-0.5 w-24"
            style={{
              background: `linear-gradient(90deg, ${palette.primary}, ${palette.glow}00)`,
              marginLeft: mirror ? 'auto' : 0,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.2 }}
          />
        </motion.div>

        {/* Card Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: any, catIdx: number) => {
            const cardDelay = baseDelay + 0.2 + catIdx * 0.12;
            const skills = category.skills ?? [];

            return (
              <motion.div
                key={catIdx}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: cardDelay, ease: [0.22, 1, 0.36, 1] as const }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group relative overflow-hidden rounded-2xl"
              >
                {/* Glassmorphism background */}
                <div
                  className="absolute inset-0 rounded-2xl border border-white/10"
                  style={{
                    background: `linear-gradient(${gradientAngle}deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                />

                {/* Hover glow border */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    border: `1px solid ${palette.primary}40`,
                    boxShadow: `inset 0 0 30px ${palette.primary}08, 0 0 30px ${palette.primary}08`,
                  }}
                />

                {/* Card Content */}
                <div className="relative p-6">
                  {/* Category header */}
                  <div className="mb-5 flex items-center gap-3">
                    {/* Accent dot */}
                    <motion.div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: palette.primary,
                        boxShadow: `0 0 12px ${palette.glow}60`,
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 12px ${palette.glow}60`,
                          `0 0 20px ${palette.glow}40`,
                          `0 0 12px ${palette.glow}60`,
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {category.name?.ja ?? category.name?.en ?? ''}
                      </h3>
                      {category.name?.en && category.name?.ja && (
                        <p className="text-xs text-gray-500">{category.name.en}</p>
                      )}
                    </div>
                  </div>

                  {/* Skills list */}
                  <div className="space-y-3">
                    {skills.map((skill: any, skillIdx: number) => {
                      const level = Math.min(Math.max(skill.level ?? 0, 0), 5);
                      const skillItemDelay = cardDelay + 0.15 + skillIdx * 0.05;

                      return (
                        <motion.div
                          key={skillIdx}
                          initial={{ opacity: 0, x: mirror ? 10 : -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: skillItemDelay, duration: 0.4 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-200">
                              {skill.name}
                            </span>
                            {skill.yearsOfExperience != null && (
                              <span className="text-[10px] text-gray-500">
                                {skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <LevelDots level={level} />
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Skill count footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-xs text-gray-600">
                      {skills.length} skill{skills.length !== 1 ? 's' : ''}
                    </span>
                    <span
                      className="text-xs font-medium"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: baseDelay + categories.length * 0.12 + 0.6 }}
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
