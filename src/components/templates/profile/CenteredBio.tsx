'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps, ProfileData } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

export function ProfileCenteredBio({ data, commentary, visualSeed }: TemplateProps) {
  const profile = data as ProfileData;
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const gradientAngle = 160 + visualSeed.colorOffset * 0.3;
  const baseDelay = visualSeed.animationDelay;
  const { stagger: seededStaggerVal } = seededStagger(visualSeed.colorOffset);

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: seededStaggerVal,
        delayChildren: baseDelay,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const scaleFade = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { ...SPRING_ENTER, opacity: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
    },
  };

  return (
    <div className="h-full w-full overflow-hidden relative bg-white">
      {/* CSS keyframe background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1F`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        transform: 'translateZ(-20px)',
      }} />

      <div className="relative z-10 h-full flex items-center justify-center px-6 py-16">
        <motion.div
          className="max-w-2xl w-full text-center"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Name - hero size */}
          <motion.h1
            variants={fadeUp}
            className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tight leading-none"
            style={{ transform: 'translateZ(40px)', ...breatheStyle(0) }}
          >
            {profile?.name?.ja || profile?.name?.en || 'Name'}
          </motion.h1>

          {/* English name subtitle */}
          {profile?.name?.en && profile?.name?.ja && (
            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-gray-800 mt-3 font-normal tracking-normal uppercase"
              style={{ transform: 'translateZ(25px)' }}
            >
              {profile.name.en}
            </motion.p>
          )}

          {/* Accent divider */}
          <motion.div
            variants={scaleFade}
            className="mx-auto mt-8 mb-8 h-px w-24"
            style={{
              background: `linear-gradient(90deg, transparent, ${palette.primary}, transparent)`,
            }}
          />

          {/* Title */}
          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl font-medium"
            style={{ color: palette.glow, transform: 'translateZ(25px)', ...breatheStyle(1) }}
          >
            {profile?.title?.ja || profile?.title?.en || ''}
          </motion.p>

          {/* Location */}
          {(profile?.location?.ja || profile?.location?.en) && (
            <motion.p
              variants={fadeUp}
              className="text-sm text-gray-800 mt-3 tracking-normal"
              style={{ transform: 'translateZ(15px)' }}
            >
              {profile.location.ja || profile.location.en}
            </motion.p>
          )}

          {/* Introduction */}
          {(profile?.introduction?.ja || profile?.introduction?.en) && (
            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-gray-800 leading-relaxed mt-10 font-normal max-w-xl mx-auto line-clamp-4"
              style={{ ...revealStyle(0), transform: 'translateZ(15px)' }}
            >
              {profile.introduction.ja || profile.introduction.en}
            </motion.p>
          )}

          {/* Background */}
          {(profile?.background?.ja || profile?.background?.en) && (
            <motion.p
              variants={fadeUp}
              className="text-sm text-gray-800 leading-relaxed mt-6 max-w-lg mx-auto font-normal line-clamp-3"
              style={{ ...revealStyle(1), transform: 'translateZ(15px)' }}
            >
              {profile.background.ja || profile.background.en}
            </motion.p>
          )}

          {/* Links - minimal icon buttons */}
          {profile?.links && (
            <motion.div variants={fadeUp} className="flex justify-center gap-3 mt-10">
              {profile.links.github && (
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 rounded-full flex items-center justify-center
                             border border-gray-200 hover:border-gray-400 transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle, ${palette.glow}, transparent)` }}
                  />
                </a>
              )}
              {profile.links.linkedin && (
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 rounded-full flex items-center justify-center
                             border border-gray-200 hover:border-gray-400 transition-all duration-300"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle, ${palette.glow}, transparent)` }}
                  />
                </a>
              )}
            </motion.div>
          )}

          {/* AI Commentary */}
          {commentary && (
            <motion.div
              variants={fadeUp}
              className="mt-12 text-left max-w-lg mx-auto opacity-60 hover:opacity-90 transition-opacity duration-500"
              style={revealStyle(2)}
            >
              <div className="prose prose-sm prose-p:text-gray-800 prose-p:leading-relaxed max-w-none line-clamp-6" style={{ transform: 'translateZ(15px)' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
