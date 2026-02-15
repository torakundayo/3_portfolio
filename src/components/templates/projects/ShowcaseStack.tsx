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

export function ProjectsShowcaseStack({ data, commentary, visualSeed }: TemplateProps) {
  const projectsData = data as any;
  const projects: Project[] = projectsData?.projects ?? [];
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const mirrorLayout = visualSeed.mirrorLayout;

  // Fan-out angles for card deck effect
  const getFanTransform = (index: number, total: number) => {
    if (total <= 1) return { rotate: 0, x: 0, y: 0 };
    const center = (total - 1) / 2;
    const offset = index - center;
    const maxRotation = 6;
    const maxXOffset = 40;
    const direction = mirrorLayout ? -1 : 1;
    return {
      rotate: offset * maxRotation * direction * (1 / Math.max(total * 0.3, 1)),
      x: offset * maxXOffset * direction,
      y: Math.abs(offset) * 8,
    };
  };

  return (
    <div className="h-full w-full overflow-auto bg-zinc-950">
      {/* Background */}
      <div className="fixed inset-0 -z-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(ellipse at 50% 60%, ${palette.primary}10, transparent 70%)`,
              `radial-gradient(ellipse at 50% 40%, ${palette.secondary}10, transparent 70%)`,
              `radial-gradient(ellipse at 50% 60%, ${palette.primary}10, transparent 70%)`,
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        {/* Subtle floor reflection */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/4"
          style={{
            background: `linear-gradient(to top, ${palette.primary}06, transparent)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 flex flex-col items-center min-h-full">
        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-12 text-center w-full"
          >
            <div className="max-w-xl mx-auto prose prose-sm prose-invert prose-p:text-zinc-400 prose-headings:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {commentary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* Stacked card deck area */}
        <div className="relative w-full max-w-lg flex-1 flex items-center justify-center py-8">
          <div className="relative w-full" style={{ minHeight: '360px' }}>
            {projects.map((project, i) => {
              const fan = getFanTransform(i, projects.length);
              const cardDelay = baseDelay + 0.2 + i * 0.15;
              const tagline = project.tagline?.en || project.tagline?.ja || '';
              const description = project.description?.en || project.description?.ja || '';
              const zIndex = projects.length - i;

              // Each card gets a slightly different gradient from the palette
              const gradientRotation = 135 + i * 30 + visualSeed.colorOffset * 0.1;

              return (
                <motion.div
                  key={project.name}
                  className="absolute inset-0 group cursor-default"
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                    rotate: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: fan.rotate,
                    x: fan.x,
                    y: fan.y,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: cardDelay,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  whileHover={{
                    scale: 1.04,
                    rotate: 0,
                    x: 0,
                    y: -10,
                    zIndex: 50,
                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
                  }}
                  style={{ zIndex }}
                >
                  <div
                    className="relative h-full rounded-2xl border border-white/10 bg-zinc-900/90 backdrop-blur-md p-6 overflow-hidden transition-shadow duration-500"
                    style={{
                      boxShadow: `
                        0 4px 6px rgba(0,0,0,0.3),
                        0 10px 30px rgba(0,0,0,0.2),
                        0 0 0 1px ${palette.primary}08
                      `,
                    }}
                  >
                    {/* Top gradient accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 opacity-80"
                      style={{
                        background: `linear-gradient(${gradientRotation}deg, ${palette.primary}, ${palette.glow}, ${palette.secondary})`,
                      }}
                    />

                    {/* Card subtle gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-5 pointer-events-none"
                      style={{
                        background: `linear-gradient(${gradientRotation}deg, ${palette.primary}, transparent 60%)`,
                      }}
                    />

                    {/* Content */}
                    <div className="relative flex flex-col h-full">
                      {/* Image */}
                      {project.image && (
                        <div
                          className="w-full h-32 rounded-lg mb-4 overflow-hidden flex-shrink-0"
                          style={{
                            background: `linear-gradient(${gradientRotation}deg, ${palette.primary}15, ${palette.secondary}08)`,
                          }}
                        >
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                          />
                        </div>
                      )}

                      {/* Year + Name */}
                      <div className="flex items-center gap-3 mb-1">
                        {project.year && (
                          <span
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                            style={{
                              color: palette.glow,
                              backgroundColor: `${palette.primary}15`,
                            }}
                          >
                            {project.year}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-white mb-1 tracking-tight">
                        {project.name}
                      </h3>

                      {tagline && (
                        <p
                          className="text-sm mb-3"
                          style={{ color: `${palette.glow}cc` }}
                        >
                          {tagline}
                        </p>
                      )}

                      {description && (
                        <p className="text-xs text-zinc-500 mb-4 leading-relaxed line-clamp-2">
                          {description}
                        </p>
                      )}

                      {/* Stack */}
                      {project.stack && project.stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                          {project.stack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                              style={{
                                color: `${palette.glow}99`,
                                borderColor: `${palette.primary}20`,
                                backgroundColor: `${palette.primary}06`,
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex gap-3 mt-auto">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-300 hover:scale-105"
                            style={{
                              color: 'white',
                              background: `linear-gradient(135deg, ${palette.primary}cc, ${palette.secondary}cc)`,
                              boxShadow: `0 2px 10px ${palette.primary}25`,
                            }}
                          >
                            View
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium px-4 py-1.5 rounded-lg border border-white/10 text-zinc-500 hover:text-white hover:border-white/20 transition-all duration-300"
                          >
                            Source
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Card count indicator */}
        {projects.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 0.2 + projects.length * 0.15 + 0.5, duration: 0.5 }}
            className="flex items-center gap-2 mt-6 mb-4"
          >
            {projects.map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === 0 ? palette.primary : `${palette.primary}30`,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Hover instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: baseDelay + 1.5, duration: 0.5 }}
          className="text-[11px] text-zinc-700 tracking-wider"
        >
          hover cards to explore
        </motion.p>
      </div>
    </div>
  );
}
