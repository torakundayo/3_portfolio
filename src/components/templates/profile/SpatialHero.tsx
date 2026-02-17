'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { breatheStyle } from '@/lib/animation';

export function ProfileSpatialHero({ data, commentary, visualSeed }: TemplateProps) {
  const profile = data as any;
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const [introExpanded, setIntroExpanded] = useState(false);

  // Mirror flips horizontal placement
  const side = mirror ? -1 : 1;

  return (
    <div className="h-full w-full overflow-hidden relative bg-white">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{
            background: `${palette.primary}1A`,
            left: '20%',
            top: '10%',
            animation: 'bg-drift-1 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{
            background: `${palette.secondary}10`,
            right: '15%',
            bottom: '15%',
            animation: 'bg-drift-2 22s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── Name — centre, dominant ── */}
      <motion.h1
        data-observe-zone="profile-name"
        className="absolute left-1/2 select-none pointer-events-none
                   text-6xl md:text-8xl lg:text-9xl font-bold text-gray-900
                   leading-none tracking-tight whitespace-nowrap"
        style={{
          top: '32%',
          transform: `translate3d(-50%, -50%, 60px)`,
          ...breatheStyle(0),
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: baseDelay, ease: [0.22, 1, 0.36, 1] }}
      >
        {profile?.name?.ja || profile?.name?.en || 'Name'}
      </motion.h1>

      {/* ── English name sub — just below the main name ── */}
      {profile?.name?.en && profile?.name?.ja && (
        <motion.p
          className="absolute left-1/2 text-sm md:text-base text-gray-800 font-normal tracking-normal"
          style={{
            top: '42%',
            transform: 'translate3d(-50%, 0, 40px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: baseDelay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {profile.name.en}
        </motion.p>
      )}

      {/* ── Title — below name, palette-coloured, pulsing ── */}
      <motion.p
        className="absolute left-1/2 text-lg md:text-xl font-medium"
        style={{
          top: '48%',
          transform: 'translate3d(-50%, 0, 35px)',
          color: palette.glow,
          ...breatheStyle(1),
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: baseDelay + 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {profile?.title?.ja || profile?.title?.en || ''}
      </motion.p>

      {/* ── Location — near title ── */}
      {(profile?.location?.ja || profile?.location?.en) && (
        <motion.p
          className="absolute left-1/2 text-xs text-gray-800 tracking-normal flex items-center gap-1.5"
          style={{
            top: '53%',
            transform: 'translate3d(-50%, 0, 20px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: baseDelay + 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="inline-block w-1 h-1 rounded-full"
            style={{ backgroundColor: palette.glow }}
          />
          {profile.location.ja || profile.location.en}
        </motion.p>
      )}

      {/* ── Introduction — offset to one side, hover to expand ── */}
      {(profile?.introduction?.ja || profile?.introduction?.en) && (
        <motion.div
          data-observe-zone="profile-intro"
          className="absolute max-w-xs md:max-w-sm cursor-pointer group"
          style={{
            top: '30%',
            ...(side > 0
              ? { right: '6%' }
              : { left: '6%' }),
            transform: 'translate3d(0, 0, 25px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 1, delay: baseDelay + 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setIntroExpanded((v) => !v)}
        >
          <p
            className={`text-sm text-gray-800 leading-relaxed font-normal transition-all duration-500 ${
              introExpanded ? '' : 'line-clamp-3'
            }`}
          >
            {profile.introduction.ja || profile.introduction.en}
          </p>
        </motion.div>
      )}

      {/* ── Background — opposite side from intro ── */}
      {(profile?.background?.ja || profile?.background?.en) && (
        <motion.div
          className="absolute max-w-xs"
          style={{
            bottom: '18%',
            ...(side > 0
              ? { left: '8%' }
              : { right: '8%' }),
            transform: 'translate3d(0, 0, 15px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          whileHover={{ opacity: 0.9 }}
          transition={{ duration: 1, delay: baseDelay + 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs text-gray-800 leading-relaxed font-normal line-clamp-3">
            {profile.background.ja || profile.background.en}
          </p>
        </motion.div>
      )}

      {/* ── Links — below name to the left, icons initially ── */}
      {profile?.links && (
        <motion.div
          data-observe-zone="profile-links"
          className="absolute flex gap-4"
          style={{
            bottom: '22%',
            ...(side > 0
              ? { right: '10%' }
              : { left: '10%' }),
            transform: 'translate3d(0, 0, 20px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: baseDelay + 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {profile.links.github && (
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-1.5 text-gray-800 hover:text-gray-900
                         transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-xs opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">
                GitHub
              </span>
            </a>
          )}
          {profile.links.linkedin && (
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-1.5 text-gray-800 hover:text-gray-900
                         transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-xs opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">
                LinkedIn
              </span>
            </a>
          )}
        </motion.div>
      )}

      {/* ── AI Commentary — far edge, high transparency ── */}
      {commentary && (
        <motion.div
          className="absolute max-w-[200px] md:max-w-[240px]"
          style={{
            top: '55%',
            ...(side > 0
              ? { right: '4%' }
              : { left: '4%' }),
            transform: 'translate3d(0, 0, 10px)',
            ...breatheStyle(2),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 0.8 }}
          transition={{ duration: 1.2, delay: baseDelay + 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.2em] mb-2"
            style={{ color: palette.secondary }}
          >
            AI Commentary
          </p>
          <div className="prose prose-sm prose-p:text-gray-800 prose-p:text-xs prose-p:leading-relaxed max-w-none line-clamp-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
}
