'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

export function ProfileMinimalIntro({ data, commentary, visualSeed }: TemplateProps) {
  const profile = data as any;
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const { stagger: seededStaggerVal } = seededStagger(visualSeed.colorOffset);

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: seededStaggerVal,
        delayChildren: baseDelay + 0.2,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const slideUp = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div className="h-full w-full overflow-hidden relative bg-white">
      {/* CSS keyframe background blobs - subtle for light theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}0A`, left: mirror ? '40%' : '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}06`, right: mirror ? '40%' : '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
      </div>

      <div
        className={`relative z-10 h-full flex items-center px-8 md:px-20 lg:px-32 py-16 ${
          mirror ? 'justify-end text-right' : 'justify-start text-left'
        }`}
      >
        <motion.div
          className="max-w-xl w-full"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Name in light gray - very large */}
          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-7xl lg:text-8xl font-semibold text-gray-800 leading-none tracking-tight select-none"
            style={{ transform: 'translateZ(40px)', ...breatheStyle(0) }}
          >
            {profile?.name?.ja || profile?.name?.en || 'Name'}
          </motion.h1>

          {/* English name, almost invisible */}
          {profile?.name?.en && profile?.name?.ja && (
            <motion.p
              variants={fadeIn}
              className="text-sm text-gray-800 mt-2 font-normal tracking-normal"
              style={{ transform: 'translateZ(25px)' }}
            >
              {profile.name.en}
            </motion.p>
          )}

          {/* Thin accent line */}
          <motion.div
            variants={slideUp}
            className={`h-px w-16 mt-10 mb-8 ${mirror ? 'ml-auto' : ''}`}
            style={{ backgroundColor: palette.primary }}
          />

          {/* Title */}
          <motion.p
            variants={slideUp}
            className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed"
            style={{ transform: 'translateZ(25px)', ...breatheStyle(1) }}
          >
            {profile?.title?.ja || profile?.title?.en || ''}
          </motion.p>

          {/* Location */}
          {(profile?.location?.ja || profile?.location?.en) && (
            <motion.p
              variants={slideUp}
              className="text-sm text-gray-800 mt-2 tracking-normal"
              style={{ transform: 'translateZ(15px)' }}
            >
              {profile.location.ja || profile.location.en}
            </motion.p>
          )}

          {/* Introduction - clean, readable */}
          {(profile?.introduction?.ja || profile?.introduction?.en) && (
            <motion.p
              variants={slideUp}
              className="text-base text-gray-800 leading-[1.9] mt-10 font-normal line-clamp-5"
              style={{ ...revealStyle(0), transform: 'translateZ(15px)' }}
            >
              {profile.introduction.ja || profile.introduction.en}
            </motion.p>
          )}

          {/* Background - even more subtle */}
          {(profile?.background?.ja || profile?.background?.en) && (
            <motion.p
              variants={slideUp}
              className="text-sm text-gray-800 leading-[1.8] mt-6 font-normal line-clamp-3"
              style={{ ...revealStyle(1), transform: 'translateZ(15px)' }}
            >
              {profile.background.ja || profile.background.en}
            </motion.p>
          )}

          {/* Links - barely there */}
          {profile?.links && (
            <motion.div
              variants={slideUp}
              className={`flex gap-6 mt-10 ${mirror ? 'justify-end' : 'justify-start'}`}
            >
              {profile.links.github && (
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-800 hover:text-gray-900 transition-colors duration-500
                             tracking-wider uppercase"
                >
                  GitHub
                </a>
              )}
              {profile.links.linkedin && (
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-800 hover:text-gray-900 transition-colors duration-500
                             tracking-wider uppercase"
                >
                  LinkedIn
                </a>
              )}
            </motion.div>
          )}

          {/* AI Commentary */}
          {commentary && (
            <motion.div
              variants={slideUp}
              className="mt-16 pt-8 border-t border-gray-100"
              style={revealStyle(2)}
            >
              <p className="text-xs text-gray-800 uppercase tracking-normal mb-5" style={{ transform: 'translateZ(25px)' }}>
                Commentary
              </p>
              <div className="prose prose-sm prose-gray prose-p:text-gray-800 prose-p:leading-relaxed max-w-none line-clamp-5" style={{ transform: 'translateZ(15px)' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
