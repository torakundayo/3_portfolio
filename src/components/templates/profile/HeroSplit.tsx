'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function ProfileHeroSplit({ data, commentary, visualSeed }: TemplateProps) {
  const profile = data as any;
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const gradientAngle = 135 + visualSeed.colorOffset * 0.25;
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: baseDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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
        variants={itemVariants}
        className="w-12 h-1 rounded-full mb-8"
        style={{ backgroundColor: palette.primary }}
      />

      {/* Name */}
      <motion.h1
        variants={itemVariants}
        className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight"
      >
        {profile?.name?.ja || profile?.name?.en || 'Name'}
      </motion.h1>

      {profile?.name?.en && profile?.name?.ja && (
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/50 mt-2 font-light tracking-wide"
        >
          {profile.name.en}
        </motion.p>
      )}

      {/* Title */}
      <motion.p
        variants={itemVariants}
        className="text-xl md:text-2xl font-medium mt-6"
        style={{ color: palette.glow }}
      >
        {profile?.title?.ja || profile?.title?.en || ''}
      </motion.p>

      {/* Location */}
      {(profile?.location?.ja || profile?.location?.en) && (
        <motion.p
          variants={itemVariants}
          className="text-sm text-white/40 mt-3 flex items-center gap-2"
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
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 border border-white/10
                         hover:border-white/30 hover:text-white transition-all duration-300"
            >
              GitHub
            </a>
          )}
          {profile.links.linkedin && (
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 border border-white/10
                         hover:border-white/30 hover:text-white transition-all duration-300"
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
      className="flex flex-col justify-center px-8 md:px-16 py-12 overflow-auto"
      initial={{ opacity: 0, x: mirror ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: baseDelay + 0.3, ease: [0.22, 1, 0.36, 1] as const }}
    >
      {/* Introduction */}
      {(profile?.introduction?.ja || profile?.introduction?.en) && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: palette.glow }}>
            Introduction
          </p>
          <p className="text-base md:text-lg text-white/80 leading-relaxed font-light">
            {profile.introduction.ja || profile.introduction.en}
          </p>
        </div>
      )}

      {/* Background */}
      {(profile?.background?.ja || profile?.background?.en) && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: palette.glow }}>
            Background
          </p>
          <p className="text-sm md:text-base text-white/60 leading-relaxed font-light">
            {profile.background.ja || profile.background.en}
          </p>
        </div>
      )}

      {/* AI Commentary */}
      {commentary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: baseDelay + 0.6 }}
          className="mt-4 pt-6 border-t border-white/10"
        >
          <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: palette.secondary }}>
            AI Commentary
          </p>
          <div className="prose prose-sm prose-invert prose-p:text-white/60 prose-p:font-light max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="h-full w-full overflow-auto relative bg-gray-950">
      {/* Background gradient blob */}
      <motion.div
        className="absolute inset-0 -z-0"
        animate={{
          background: [
            `radial-gradient(ellipse at ${mirror ? '70%' : '30%'} 50%, ${palette.primary}15 0%, transparent 70%)`,
            `radial-gradient(ellipse at ${mirror ? '60%' : '40%'} 40%, ${palette.secondary}15 0%, transparent 70%)`,
            `radial-gradient(ellipse at ${mirror ? '70%' : '30%'} 50%, ${palette.primary}15 0%, transparent 70%)`,
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${palette.primary}40 1px, transparent 1px), linear-gradient(90deg, ${palette.primary}40 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Split layout */}
      <div className={`relative z-10 h-full grid grid-cols-1 md:grid-cols-2 ${mirror ? 'md:[direction:rtl]' : ''}`}>
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
            transition={{ duration: 1, delay: baseDelay + 0.2 }}
          />
          {rightContent}
        </div>
      </div>
    </div>
  );
}
