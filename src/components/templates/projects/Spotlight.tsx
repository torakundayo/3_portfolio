'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, cardFloatStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

interface Project {
  name: string;
  tagline?: { ja?: string; en?: string };
  description?: { ja?: string; en?: string };
  stack?: string[];
  url?: string;
  github?: string;
  image?: string;
  year?: number;
}

export function ProjectsSpotlight({ data, commentary, visualSeed }: TemplateProps) {
  const projectsData = data as any;
  const projects: Project[] = projectsData?.projects ?? [];
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  const featured = projects[0];
  const others = projects.slice(1);

  return (
    <div className="h-full w-full overflow-hidden bg-white flex flex-col">
      {/* CSS keyframe background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transform: 'translateZ(-20px)' }}>
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1f`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite' }} />
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(255,255,255,0.6) 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-6 py-5">
        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: baseDelay }}
            className="mb-3 text-center flex-shrink-0"
          >
            <div className="max-w-xl mx-auto prose prose-sm prose-p:text-gray-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {commentary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* Featured project - compact card */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              opacity: { duration: 0.9, delay: baseDelay + 0.2, ease: [0.22, 1, 0.36, 1] as const },
              scale: { ...SPRING_ENTER, delay: baseDelay + 0.2 },
            }}
            className="relative mb-4 group flex-shrink-0"
            style={{ ...revealStyle(0), ...cardFloatStyle(0), transform: 'translateZ(20px)' }}
          >
            <div
              className="relative border border-gray-200 backdrop-blur-xl bg-white/20 overflow-hidden"
              style={{
                borderRadius: organicRadius,
                boxShadow: `0 0 80px ${palette.primary}15, 0 0 30px ${palette.glow}08`,
              }}
            >
              {/* Top glow bar */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${palette.primary}, ${palette.glow}, ${palette.secondary}, transparent)`,
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="p-5 sm:p-6 flex gap-5">
                {/* Image area */}
                {featured.image && (
                  <div
                    className="w-40 h-28 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block"
                    style={{
                      background: `linear-gradient(135deg, ${palette.primary}15, ${palette.secondary}08)`,
                    }}
                  >
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Featured badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ opacity: { duration: 0.5, delay: baseDelay + 0.6, ease: [0.22, 1, 0.36, 1] as const } }}
                    className="flex items-center gap-3 mb-1"
                  >
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-0.5 rounded-full"
                      style={{
                        color: palette.glow,
                        background: `linear-gradient(135deg, ${palette.primary}20, ${palette.secondary}15)`,
                        border: `1px solid ${palette.primary}30`,
                      }}
                    >
                      Featured
                    </span>
                    {featured.year && (
                      <span className="text-xs font-mono text-gray-800">
                        {featured.year}
                      </span>
                    )}
                  </motion.div>

                  {/* Name */}
                  <h2
                    className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 tracking-tight"
                    style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
                  >
                    {featured.name}
                  </h2>

                  {/* Tagline */}
                  {(featured.tagline?.en || featured.tagline?.ja) && (
                    <p
                      className="text-sm mb-2 line-clamp-1"
                      style={{ color: `${palette.glow}dd` }}
                    >
                      {featured.tagline?.en || featured.tagline?.ja}
                    </p>
                  )}

                  {/* Description */}
                  {(featured.description?.en || featured.description?.ja) && (
                    <p className="text-sm text-gray-800 mb-3 max-w-2xl leading-relaxed line-clamp-2">
                      {featured.description?.en || featured.description?.ja}
                    </p>
                  )}

                  {/* Stack */}
                  {featured.stack && featured.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {featured.stack.map((tech, techIdx) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ opacity: { delay: baseDelay + 0.7 + stagger * techIdx, duration: 0.4 } }}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                          style={{
                            color: `${palette.glow}bb`,
                            borderColor: `${palette.primary}25`,
                            backgroundColor: `${palette.primary}08`,
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3">
                    {featured.url && (
                      <a
                        href={featured.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-300 hover:scale-105"
                        style={{
                          color: 'white',
                          background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                          boxShadow: `0 4px 15px ${palette.primary}30`,
                        }}
                      >
                        View Project
                      </a>
                    )}
                    {featured.github && (
                      <a
                        href={featured.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium px-4 py-1.5 rounded-lg border border-gray-200 text-gray-800 hover:text-gray-900 hover:border-gray-200 transition-all duration-300"
                      >
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other projects - small pill/badge row */}
        {others.length > 0 && (
          <div className="flex-shrink-0 mt-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + 0.8, duration: 0.5 }}
              className="text-[10px] uppercase tracking-[0.2em] text-gray-800 mb-2 text-center"
            >
              Other Projects
            </motion.p>
            <div className="flex flex-wrap justify-center gap-2">
              {others.map((project, i) => {
                const tagline = project.tagline?.en || project.tagline?.ja || '';

                return (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      opacity: { duration: 0.5, delay: baseDelay + 0.9 + stagger * i, ease: [0.22, 1, 0.36, 1] as const },
                    }}
                    className="group"
                    style={revealStyle(i + 1)}
                  >
                    <div
                      className="relative border border-gray-200 backdrop-blur-xl bg-gray-50/5 px-4 py-2.5 transition-all duration-500 hover:border-gray-200 hover:bg-gray-50/8 flex items-center gap-3"
                      style={{
                        borderRadius: organicRadius,
                      }}
                    >
                      {/* Hover spotlight effect */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{
                          borderRadius: organicRadius,
                          background: `radial-gradient(ellipse at 50% 0%, ${palette.glow}08, transparent 70%)`,
                        }}
                      />

                      <div className="flex items-center gap-2">
                        {project.year && (
                          <span className="text-[9px] font-mono" style={{ color: palette.glow }}>
                            {project.year}
                          </span>
                        )}
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: palette.primary }}
                        />
                      </div>

                      <h3 className="text-sm font-bold text-gray-900 tracking-tight whitespace-nowrap">
                        {project.name}
                      </h3>

                      {tagline && (
                        <p className="text-[10px] text-gray-800 line-clamp-1 hidden sm:block max-w-[120px]">
                          {tagline}
                        </p>
                      )}

                      <div className="flex gap-2 ml-1">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-medium transition-colors duration-300 hover:underline"
                            style={{ color: palette.glow }}
                          >
                            Visit
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-medium text-gray-800 hover:text-gray-900 transition-colors duration-300 hover:underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
