'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger, seededDecoration } from '@/lib/animation';

export function ProfileHeroSplit({ data, commentary, visualSeed }: TemplateProps) {
  const profile = data as any;
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const gradientAngle = 135 + visualSeed.colorOffset * 0.25;
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const variant = getLayoutVariant(visualSeed.layoutVariant);
  const { stagger, reverse } = seededStagger(visualSeed.colorOffset);
  const deco = seededDecoration(visualSeed.colorOffset, 0);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        staggerDirection: reverse ? -1 : 1,
        delayChildren: baseDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const leftContent = (
    <motion.div
      className="flex flex-col justify-center px-8 md:px-16 py-12 relative z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative line */}
      <motion.div
        className="w-12 h-1 rounded-full mb-8 origin-left"
        style={{ backgroundColor: palette.primary, transform: 'translateZ(-20px)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ ...SPRING_ENTER, delay: baseDelay }}
      />

      {/* Name */}
      <motion.h1
        data-observe-zone="profile-name"
        variants={itemVariants}
        className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight"
        style={{ transform: 'translateZ(40px)', ...breatheStyle(0) }}
      >
        {profile?.name?.ja || profile?.name?.en || 'Name'}
      </motion.h1>

      {profile?.name?.en && profile?.name?.ja && (
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-800 mt-2 font-normal tracking-normal"
          style={{ transform: 'translateZ(25px)' }}
        >
          {profile.name.en}
        </motion.p>
      )}

      {/* Title */}
      <motion.p
        variants={itemVariants}
        className="text-xl md:text-2xl font-medium mt-6"
        style={{ color: palette.glow, transform: 'translateZ(25px)', ...breatheStyle(1) }}
      >
        {profile?.title?.ja || profile?.title?.en || ''}
      </motion.p>

      {/* Location */}
      {(profile?.location?.ja || profile?.location?.en) && (
        <motion.p
          variants={itemVariants}
          className="text-sm text-gray-800 mt-3 flex items-center gap-2"
          style={{ transform: 'translateZ(15px)' }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: palette.glow }} />
          {profile.location.ja || profile.location.en}
        </motion.p>
      )}

      {/* Links */}
      {profile?.links && (
        <motion.div variants={itemVariants} className="flex gap-4 mt-8">
          {profile.links.github && (
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-gray-800 border border-gray-200
                         hover:border-gray-400 hover:text-gray-900 transition-all duration-300"
              style={{ borderRadius: organicRadius }}
            >
              GitHub
            </a>
          )}
          {profile.links.linkedin && (
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-gray-800 border border-gray-200
                         hover:border-gray-400 hover:text-gray-900 transition-all duration-300"
              style={{ borderRadius: organicRadius }}
            >
              LinkedIn
            </a>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  const rightContent = (
    <motion.div
      className="flex flex-col justify-center px-8 md:px-16 py-12 overflow-hidden"
      initial={{ opacity: 0, x: mirror ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...SPRING_ENTER, delay: baseDelay + 0.3, opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } }}
    >
      {/* Introduction */}
      {(profile?.introduction?.ja || profile?.introduction?.en) && (
        <div className="mb-8" style={revealStyle(0)}>
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: palette.glow, transform: 'translateZ(25px)' }}>
            Introduction
          </p>
          <p className="text-base md:text-lg text-gray-800 leading-relaxed font-normal line-clamp-5" style={{ transform: 'translateZ(15px)' }}>
            {profile.introduction.ja || profile.introduction.en}
          </p>
        </div>
      )}

      {/* Background */}
      {(profile?.background?.ja || profile?.background?.en) && (
        <div className="mb-8" style={revealStyle(1)}>
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: palette.glow, transform: 'translateZ(25px)' }}>
            Background
          </p>
          <p className="text-sm md:text-base text-gray-800 leading-relaxed font-normal line-clamp-4" style={{ transform: 'translateZ(15px)' }}>
            {profile.background.ja || profile.background.en}
          </p>
        </div>
      )}

      {/* AI Commentary */}
      {commentary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: baseDelay + 0.6 }}
          className="mt-4 pt-6 border-t border-gray-200"
          style={revealStyle(2)}
        >
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: palette.secondary, transform: 'translateZ(25px)' }}>
            AI Commentary
          </p>
          <div className="prose prose-sm prose-p:text-gray-800 max-w-none line-clamp-6" style={{ transform: 'translateZ(15px)' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="h-full w-full overflow-hidden relative bg-white">
      {/* CSS keyframe background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1F`, left: mirror ? '40%' : '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: mirror ? '40%' : '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
      </div>

      {/* Subtle grid pattern overlay — seed-varied angle and size */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${deco.angle}deg, ${palette.primary}40 1px, transparent 1px), linear-gradient(${deco.angle + 90}deg, ${palette.primary}40 1px, transparent 1px)`,
          backgroundSize: `${deco.gridSize}px ${deco.gridSize}px`,
          transform: 'translateZ(-20px)',
        }}
      />

      {/* Layout — variant A: 50/50 split, B: centered single-col, C: 1/3 + 2/3 asymmetric */}
      {variant === 'B' ? (
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 md:px-20">
          {leftContent}
          <div className="w-full max-w-2xl mt-4">
            {/* Horizontal divider */}
            <motion.div
              className="w-1/3 mx-auto h-px mb-6"
              style={{ background: `linear-gradient(90deg, transparent, ${palette.primary}40, transparent)` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ ...SPRING_ENTER, delay: baseDelay + 0.2 }}
            />
            {rightContent}
          </div>
        </div>
      ) : (
        <div className={`relative z-10 h-full grid grid-cols-1 ${
          variant === 'C' ? 'md:grid-cols-[1fr_2fr]' : 'md:grid-cols-2'
        } ${mirror ? 'md:[direction:rtl]' : ''}`}>
          <div className={mirror ? 'md:[direction:ltr]' : ''}>{leftContent}</div>
          <div className={`relative ${mirror ? 'md:[direction:ltr]' : ''}`}>
            {/* Divider line */}
            <motion.div
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-2/3"
              style={{
                background: `linear-gradient(180deg, transparent, ${palette.primary}40, transparent)`,
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ ...SPRING_ENTER, delay: baseDelay + 0.2 }}
            />
            {rightContent}
          </div>
        </div>
      )}
    </div>
  );
}
