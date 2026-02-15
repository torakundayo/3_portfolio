'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function ProfileMinimalIntro({ data, commentary, visualSeed }: TemplateProps) {
  const profile = data as any;
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
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
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div className="h-full w-full overflow-auto relative bg-white">
      {/* Very subtle gradient wash */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: `radial-gradient(ellipse at ${mirror ? '80%' : '20%'} 20%, ${palette.primary}06 0%, transparent 60%)`,
        }}
      />

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
            className="text-5xl md:text-7xl lg:text-8xl font-extralight text-gray-200 leading-none tracking-tight select-none"
          >
            {profile?.name?.ja || profile?.name?.en || 'Name'}
          </motion.h1>

          {/* English name, almost invisible */}
          {profile?.name?.en && profile?.name?.ja && (
            <motion.p
              variants={fadeIn}
              className="text-sm text-gray-300 mt-2 font-light tracking-widest"
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
            className="text-lg md:text-xl text-gray-700 font-light leading-relaxed"
          >
            {profile?.title?.ja || profile?.title?.en || ''}
          </motion.p>

          {/* Location */}
          {(profile?.location?.ja || profile?.location?.en) && (
            <motion.p
              variants={slideUp}
              className="text-xs text-gray-400 mt-2 tracking-wider"
            >
              {profile.location.ja || profile.location.en}
            </motion.p>
          )}

          {/* Introduction - clean, readable */}
          {(profile?.introduction?.ja || profile?.introduction?.en) && (
            <motion.p
              variants={slideUp}
              className="text-base text-gray-500 leading-[1.9] mt-10 font-light"
            >
              {profile.introduction.ja || profile.introduction.en}
            </motion.p>
          )}

          {/* Background - even more subtle */}
          {(profile?.background?.ja || profile?.background?.en) && (
            <motion.p
              variants={slideUp}
              className="text-sm text-gray-400 leading-[1.8] mt-6 font-light"
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
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors duration-500
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
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors duration-500
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
            >
              <p className="text-[10px] text-gray-300 uppercase tracking-[0.3em] mb-5">
                Commentary
              </p>
              <div className="prose prose-sm prose-gray prose-p:text-gray-400 prose-p:font-light prose-p:leading-relaxed max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
