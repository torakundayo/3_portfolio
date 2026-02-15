'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

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

  const featured = projects[0];
  const others = projects.slice(1);

  return (
    <div className="h-full w-full overflow-auto bg-black">
      {/* Theatrical spotlight background */}
      <div className="fixed inset-0 -z-0">
        {/* Main spotlight cone */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[800px]"
          animate={{
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: `conic-gradient(from 180deg at 50% 0%, transparent 40%, ${palette.glow}15 47%, ${palette.primary}20 50%, ${palette.glow}15 53%, transparent 60%)`,
          }}
        />
        {/* Subtle ambient glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 opacity-10"
          style={{
            background: `linear-gradient(to top, ${palette.primary}20, transparent)`,
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: baseDelay }}
            className="mb-10 text-center"
          >
            <div className="max-w-xl mx-auto prose prose-sm prose-invert prose-p:text-zinc-500 prose-headings:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {commentary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* Featured project - large center card */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: baseDelay + 0.2,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="relative mb-12 group"
          >
            <div
              className="relative rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md overflow-hidden"
              style={{
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

              <div className="p-8 sm:p-10">
                {/* Image area */}
                {featured.image && (
                  <div
                    className="w-full h-48 sm:h-64 rounded-xl mb-6 overflow-hidden"
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

                {/* Featured badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: baseDelay + 0.6, duration: 0.5 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                    style={{
                      color: palette.glow,
                      background: `linear-gradient(135deg, ${palette.primary}20, ${palette.secondary}15)`,
                      border: `1px solid ${palette.primary}30`,
                    }}
                  >
                    Featured
                  </span>
                  {featured.year && (
                    <span className="text-xs font-mono text-zinc-600">
                      {featured.year}
                    </span>
                  )}
                </motion.div>

                {/* Name */}
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                  {featured.name}
                </h2>

                {/* Tagline */}
                {(featured.tagline?.en || featured.tagline?.ja) && (
                  <p
                    className="text-lg mb-4"
                    style={{ color: `${palette.glow}dd` }}
                  >
                    {featured.tagline?.en || featured.tagline?.ja}
                  </p>
                )}

                {/* Description */}
                {(featured.description?.en || featured.description?.ja) && (
                  <p className="text-sm text-zinc-400 mb-6 max-w-2xl leading-relaxed">
                    {featured.description?.en || featured.description?.ja}
                  </p>
                )}

                {/* Stack */}
                {featured.stack && featured.stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featured.stack.map((tech, techIdx) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: baseDelay + 0.7 + techIdx * 0.05, duration: 0.4 }}
                        className="text-xs font-medium px-3 py-1 rounded-full border"
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
                <div className="flex gap-4">
                  {featured.url && (
                    <a
                      href={featured.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-300 hover:scale-105"
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
                      className="text-sm font-medium px-5 py-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/25 transition-all duration-300"
                    >
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other projects - smaller cards in a row */}
        {others.length > 0 && (
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + 0.8, duration: 0.5 }}
              className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-4 text-center"
            >
              Other Projects
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map((project, i) => {
                const tagline = project.tagline?.en || project.tagline?.ja || '';
                const cardDelay = baseDelay + 0.9 + i * 0.1;

                return (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: cardDelay,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                    className="group"
                  >
                    <div
                      className="relative rounded-xl border border-white/5 bg-zinc-950/60 backdrop-blur-sm p-5 h-full transition-all duration-500 hover:border-white/15"
                      style={{
                        boxShadow: `0 0 0 0px ${palette.primary}00`,
                      }}
                    >
                      {/* Hover spotlight effect */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at 50% 0%, ${palette.glow}08, transparent 70%)`,
                        }}
                      />

                      <div className="flex items-center gap-2 mb-2">
                        {project.year && (
                          <span className="text-[10px] font-mono" style={{ color: palette.glow }}>
                            {project.year}
                          </span>
                        )}
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: palette.primary }}
                        />
                      </div>

                      <h3 className="text-base font-bold text-white mb-1 tracking-tight">
                        {project.name}
                      </h3>

                      {tagline && (
                        <p className="text-xs text-zinc-500 mb-3 line-clamp-2">
                          {tagline}
                        </p>
                      )}

                      {project.stack && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.stack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.stack.length > 3 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-600">
                              +{project.stack.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 mt-auto">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-medium transition-colors duration-300 hover:underline"
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
                            className="text-[11px] font-medium text-zinc-600 hover:text-zinc-400 transition-colors duration-300 hover:underline"
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
