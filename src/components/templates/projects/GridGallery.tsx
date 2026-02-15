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

export function ProjectsGridGallery({ data, commentary, visualSeed }: TemplateProps) {
  const projectsData = data as any;
  const projects: Project[] = projectsData?.projects ?? [];
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;

  // Masonry-like heights: alternate between tall and short
  const getCardHeight = (index: number): string => {
    const pattern = [380, 320, 350, 300, 360];
    return `${pattern[index % pattern.length]}px`;
  };

  return (
    <div className="h-full w-full overflow-auto bg-zinc-950">
      {/* Background mesh */}
      <div
        className="fixed inset-0 -z-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${palette.primary}08 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${palette.secondary}08 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-10"
          >
            <div className="max-w-2xl prose prose-sm prose-invert prose-p:text-zinc-400 prose-headings:text-white prose-strong:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {commentary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* 2-column masonry grid */}
        <div className="columns-1 sm:columns-2 gap-5 space-y-5">
          {projects.map((project, i) => {
            const cardDelay = baseDelay + 0.12 * i;
            const tagline = project.tagline?.en || project.tagline?.ja || '';
            const description = project.description?.en || project.description?.ja || '';

            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.65,
                  delay: cardDelay,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                className="break-inside-avoid group"
              >
                <div
                  className="relative rounded-xl border bg-zinc-900/60 backdrop-blur-sm p-5 overflow-hidden transition-all duration-500 hover:bg-zinc-900/80 cursor-default"
                  style={{
                    minHeight: getCardHeight(i),
                    borderColor: `${palette.primary}20`,
                  }}
                >
                  {/* Hover border highlight */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 0 1px ${palette.primary}40, 0 0 30px ${palette.glow}08`,
                    }}
                  />

                  {/* Corner accent */}
                  <div
                    className="absolute top-0 right-0 w-20 h-20 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 100% 0%, ${palette.glow}, transparent 70%)`,
                    }}
                  />

                  {/* Image */}
                  {project.image && (
                    <motion.div
                      className="w-full h-36 rounded-lg mb-4 overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${palette.primary}15, ${palette.secondary}08)`,
                      }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                      />
                    </motion.div>
                  )}

                  {/* Year + Name row */}
                  <div className="flex items-center gap-3 mb-2">
                    {project.year && (
                      <span
                        className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          color: palette.glow,
                          backgroundColor: `${palette.primary}12`,
                        }}
                      >
                        {project.year}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:translate-x-0.5 transition-transform duration-300">
                      {project.name}
                    </h3>
                  </div>

                  {/* Tagline */}
                  {tagline && (
                    <p
                      className="text-sm mb-3 leading-relaxed"
                      style={{ color: `${palette.glow}cc` }}
                    >
                      {tagline}
                    </p>
                  )}

                  {/* Description */}
                  {description && (
                    <p className="text-xs text-zinc-500 mb-4 leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  )}

                  {/* Stack */}
                  {project.stack && project.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors duration-300"
                          style={{
                            color: `${palette.glow}aa`,
                            borderColor: `${palette.primary}25`,
                            backgroundColor: `${palette.primary}08`,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3 mt-auto pt-2 border-t border-white/5">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium flex items-center gap-1 transition-colors duration-300 hover:underline"
                        style={{ color: palette.glow }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-zinc-600 hover:text-zinc-400 flex items-center gap-1 transition-colors duration-300 hover:underline"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
