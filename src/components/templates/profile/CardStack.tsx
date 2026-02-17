'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, cardFloatStyle, organicRadius } from '@/lib/animation';

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
          <div className="mb-3">
            <span
              className="text-[10px] uppercase tracking-[0.25em] font-medium"
              style={{ color: palette.primary }}
            >
              Profile
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-white leading-tight"
            style={{ transform: 'translateZ(40px)', ...breatheStyle(0) }}
          >
            {profile?.name?.ja || profile?.name?.en || 'Name'}
          </h2>
          {profile?.name?.en && profile?.name?.ja && (
            <p className="text-sm text-white/30 mt-2 tracking-wide" style={{ transform: 'translateZ(25px)' }}>
              {profile.name.en}
            </p>
          )}
          <p
            className="text-base font-light mt-3"
            style={{ color: palette.glow, transform: 'translateZ(25px)', ...breatheStyle(1) }}
          >
            {profile?.title?.ja || profile?.title?.en || ''}
          </p>
          {(profile?.location?.ja || profile?.location?.en) && (
            <p className="text-xs text-white/30 mt-2" style={{ transform: 'translateZ(15px)' }}>
              {profile.location.ja || profile.location.en}
            </p>
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
                <div className="mb-3">
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] font-medium"
                    style={{ color: palette.secondary }}
                  >
                    Introduction
                  </span>
                </div>
                <p
                  className="text-sm text-white/70 leading-relaxed font-light line-clamp-4"
                  style={{ ...revealStyle(0), transform: 'translateZ(15px)' }}
                >
                  {profile.introduction.ja || profile.introduction.en}
                </p>
              </>
            ),
          },
        ]
      : []),
    // Card 3: Background + Links combined to reduce card count
    ...(profile?.background?.ja || profile?.background?.en || profile?.links
      ? [
          {
            id: 'background-links',
            rotation: rotationBase * 0.5,
            offsetX: mirror ? 10 : -10,
            offsetY: 15,
            content: (
              <>
                {(profile?.background?.ja || profile?.background?.en) && (
                  <>
                    <div className="mb-3">
                      <span
                        className="text-[10px] uppercase tracking-[0.25em] font-medium"
                        style={{ color: palette.glow }}
                      >
                        Background
                      </span>
                    </div>
                    <p
                      className="text-xs text-white/60 leading-relaxed font-light line-clamp-3"
                      style={{ ...revealStyle(1), transform: 'translateZ(15px)' }}
                    >
                      {profile.background.ja || profile.background.en}
                    </p>
                  </>
                )}
                {profile?.links && (
                  <div className={`flex gap-3 ${profile?.background?.ja || profile?.background?.en ? 'mt-4 pt-3 border-t border-white/[0.06]' : ''}`}>
                    {profile.links.github && (
                      <a
                        href={profile.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                      >
                        <span
                          className="w-7 h-7 flex items-center justify-center border border-white/10
                                     group-hover:border-white/30 transition-all"
                          style={{ borderRadius: organicRadius }}
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </span>
                        <span className="text-xs">GitHub</span>
                      </a>
                    )}
                    {profile.links.linkedin && (
                      <a
                        href={profile.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                      >
                        <span
                          className="w-7 h-7 flex items-center justify-center border border-white/10
                                     group-hover:border-white/30 transition-all"
                          style={{ borderRadius: organicRadius }}
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </span>
                        <span className="text-xs">LinkedIn</span>
                      </a>
                    )}
                  </div>
                )}
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="h-full w-full overflow-hidden relative bg-gray-950">
      {/* CSS keyframe background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1F`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-6 py-12">
        <div className="relative w-full max-w-lg">
          {/* Stacked cards */}
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className="relative mb-4"
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
                ...SPRING_ENTER,
                delay: baseDelay + index * 0.15,
                opacity: { duration: 0.8, delay: baseDelay + index * 0.15, ease: [0.22, 1, 0.36, 1] as const },
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.3 },
              }}
            >
              <div
                className="relative p-5 md:p-6 border border-white/[0.06]
                           backdrop-blur-sm overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
                  borderRadius: organicRadius,
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
                ...SPRING_ENTER,
                delay: baseDelay + cards.length * 0.15,
                opacity: { duration: 0.8, delay: baseDelay + cards.length * 0.15, ease: [0.22, 1, 0.36, 1] as const },
              }}
            >
              <div
                className="relative p-5 md:p-6 border border-white/[0.06]
                           backdrop-blur-sm overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${palette.primary}08, ${palette.secondary}04)`,
                  borderRadius: organicRadius,
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${palette.secondary}40, transparent)`,
                  }}
                />
                <div className="mb-3">
                  <span
                    className="text-[10px] uppercase tracking-[0.25em] font-medium"
                    style={{ color: palette.secondary }}
                  >
                    AI Commentary
                  </span>
                </div>
                <div
                  className="prose prose-sm prose-invert prose-p:text-white/50 prose-p:font-light max-w-none line-clamp-4"
                  style={{ ...revealStyle(2), transform: 'translateZ(15px)' }}
                >
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
