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

export function ProjectsHorizontalSlider({ data, commentary, visualSeed }: TemplateProps) {
  const projectsData = data as any;
  const projects: Project[] = projectsData?.projects ?? [];
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const gradientAngle = 135 + visualSeed.colorOffset * 0.25;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-zinc-950">
      {/* Subtle animated background gradient */}
      <motion.div
        className="absolute inset-0 -z-0"
        animate={{
          background: [
            `radial-gradient(ellipse at 20% 50%, ${palette.primary}15, transparent 60%)`,
            `radial-gradient(ellipse at 80% 50%, ${palette.secondary}15, transparent 60%)`,
            `radial-gradient(ellipse at 20% 50%, ${palette.primary}15, transparent 60%)`,
          ],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Commentary section */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }}
            className="px-8 pt-8 pb-4 flex-shrink-0"
          >
            <div className="max-w-2xl mx-auto prose prose-sm prose-invert prose-p:text-zinc-300 prose-headings:text-white prose-strong:text-white max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {commentary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* Horizontal scrolling area */}
        <div className="flex-1 flex items-center overflow-x-auto overflow-y-hidden px-8 pb-8 pt-4 gap-6 scroll-smooth snap-x snap-mandatory">
          {projects.map((project, i) => {
            const cardDelay = baseDelay + 0.15 * i;
            const tagline = project.tagline?.en || project.tagline?.ja || '';

            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, x: 120, rotateY: -8 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{
                  duration: 0.7,
                  delay: cardDelay,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
                className="flex-shrink-0 w-[340px] snap-center group"
              >
                <div
                  className="relative h-[420px] rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-sm p-6 flex flex-col overflow-hidden transition-all duration-500 hover:border-white/20"
                  style={{
                    boxShadow: `0 0 0 1px ${palette.primary}10`,
                  }}
                >
                  {/* Top accent line */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary}, ${palette.glow})`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: cardDelay + 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                  />

                  {/* Hover glow effect */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, ${palette.glow}12, transparent 70%)`,
                    }}
                  />

                  {/* Project image placeholder */}
                  {project.image && (
                    <div
                      className="w-full h-32 rounded-lg mb-4 overflow-hidden flex-shrink-0"
                      style={{
                        background: `linear-gradient(${gradientAngle}deg, ${palette.primary}20, ${palette.secondary}10)`,
                      }}
                    >
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    </div>
                  )}

                  {/* Year badge */}
                  {project.year && (
                    <span
                      className="inline-block self-start text-xs font-mono px-2 py-0.5 rounded-full mb-2"
                      style={{
                        color: palette.glow,
                        backgroundColor: `${palette.primary}15`,
                        border: `1px solid ${palette.primary}30`,
                      }}
                    >
                      {project.year}
                    </span>
                  )}

                  {/* Name */}
                  <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
                    {project.name}
                  </h3>

                  {/* Tagline */}
                  {tagline && (
                    <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                      {tagline}
                    </p>
                  )}

                  {/* Stack badges */}
                  {project.stack && project.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3 mt-auto pt-2">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium transition-colors duration-300 hover:underline"
                        style={{ color: palette.glow }}
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors duration-300 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* End spacer for scroll padding */}
          <div className="flex-shrink-0 w-4" />
        </div>

        {/* Scroll hint */}
        {projects.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + projects.length * 0.15 + 0.5, duration: 0.5 }}
            className="absolute bottom-4 right-8 flex items-center gap-2 text-zinc-600 text-xs"
          >
            <span>scroll</span>
            <motion.span
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              &rarr;
            </motion.span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
