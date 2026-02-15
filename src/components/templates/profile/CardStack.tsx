'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

export function ProfileCardStack({ data, commentary, visualSeed }: TemplateProps) {
  const profile = data as any;
  const palette = accentPalettes[visualSeed.accentIndex % accentPalettes.length];
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const rotationBase = mirror ? -2 : 2;

  const cards = [
    // Card 1: Name & Title
    {
      id: 'identity',
      rotation: rotationBase * 1.2,
      offsetX: mirror ? 20 : -20,
      offsetY: -10,
      content: (
        <>
          <div className="mb-4">
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-medium"
              style={{ color: palette.primary }}
            >
              Profile
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {profile?.name?.ja || profile?.name?.en || 'Name'}
          </h2>
          {profile?.name?.en && profile?.name?.ja && (
            <p className="text-sm text-white/30 mt-2 tracking-wide">{profile.name.en}</p>
          )}
          <p className="text-lg font-light mt-4" style={{ color: palette.glow }}>
            {profile?.title?.ja || profile?.title?.en || ''}
          </p>
          {(profile?.location?.ja || profile?.location?.en) && (
            <p className="text-xs text-white/30 mt-2">{profile.location.ja || profile.location.en}</p>
          )}
        </>
      ),
    },
    // Card 2: Introduction
    ...(profile?.introduction?.ja || profile?.introduction?.en
      ? [
          {
            id: 'intro',
            rotation: rotationBase * -0.8,
            offsetX: mirror ? -15 : 15,
            offsetY: 5,
            content: (
              <>
                <div className="mb-4">
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] font-medium"
                    style={{ color: palette.secondary }}
                  >
                    Introduction
                  </span>
                </div>
                <p className="text-base text-white/70 leading-relaxed font-light">
                  {profile.introduction.ja || profile.introduction.en}
                </p>
              </>
            ),
          },
        ]
      : []),
    // Card 3: Background
    ...(profile?.background?.ja || profile?.background?.en
      ? [
          {
            id: 'background',
            rotation: rotationBase * 0.5,
            offsetX: mirror ? 10 : -10,
            offsetY: 15,
            content: (
              <>
                <div className="mb-4">
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] font-medium"
                    style={{ color: palette.glow }}
                  >
                    Background
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  {profile.background.ja || profile.background.en}
                </p>
              </>
            ),
          },
        ]
      : []),
    // Card 4: Links
    ...(profile?.links
      ? [
          {
            id: 'links',
            rotation: rotationBase * -1.5,
            offsetX: mirror ? -25 : 25,
            offsetY: 0,
            content: (
              <>
                <div className="mb-4">
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] font-medium"
                    style={{ color: palette.primary }}
                  >
                    Connect
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {profile.links.github && (
                    <a
                      href={profile.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group"
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10
                                   group-hover:border-white/30 transition-all"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </span>
                      <span className="text-sm">GitHub</span>
                    </a>
                  )}
                  {profile.links.linkedin && (
                    <a
                      href={profile.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group"
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10
                                   group-hover:border-white/30 transition-all"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </span>
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                </div>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="h-full w-full overflow-auto relative bg-gray-950">
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 30% 40%, ${palette.primary}12 0%, transparent 50%),
             radial-gradient(circle at 70% 60%, ${palette.secondary}08 0%, transparent 50%)`,
            `radial-gradient(circle at 40% 50%, ${palette.secondary}12 0%, transparent 50%),
             radial-gradient(circle at 60% 40%, ${palette.glow}08 0%, transparent 50%)`,
            `radial-gradient(circle at 30% 40%, ${palette.primary}12 0%, transparent 50%),
             radial-gradient(circle at 70% 60%, ${palette.secondary}08 0%, transparent 50%)`,
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 h-full flex items-center justify-center px-6 py-16">
        <div className="relative w-full max-w-lg">
          {/* Stacked cards */}
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className="relative mb-6"
              initial={{
                opacity: 0,
                y: 60,
                rotate: card.rotation * 2,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                delay: baseDelay + index * 0.15,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.3 },
              }}
            >
              <div
                className="relative p-6 md:p-8 rounded-2xl border border-white/[0.06]
                           backdrop-blur-sm overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
                }}
              >
                {/* Card edge accent */}
                <div
                  className="absolute top-0 left-0 w-full h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${palette.primary}30, transparent)`,
                  }}
                />
                {card.content}
              </div>
            </motion.div>
          ))}

          {/* AI Commentary card */}
          {commentary && (
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: baseDelay + cards.length * 0.15,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              <div
                className="relative p-6 md:p-8 rounded-2xl border border-white/[0.06]
                           backdrop-blur-sm overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${palette.primary}08, ${palette.secondary}04)`,
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${palette.secondary}40, transparent)`,
                  }}
                />
                <div className="mb-4">
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] font-medium"
                    style={{ color: palette.secondary }}
                  >
                    AI Commentary
                  </span>
                </div>
                <div className="prose prose-sm prose-invert prose-p:text-white/50 prose-p:font-light max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
