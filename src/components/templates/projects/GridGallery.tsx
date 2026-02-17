'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, cardFloatStyle, organicRadius } from '@/lib/animation';

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

  return (
    <div className="h-full w-full overflow-hidden bg-zinc-950 flex flex-col">
      {/* CSS keyframe background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transform: 'translateZ(-20px)' }}>
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1f`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite' }} />
      </div>

      <div className="relative z-10 flex flex-col h-full overflow-y-auto px-6 py-6">
        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ opacity: { duration: 0.7, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }, y: { ...SPRING_ENTER, delay: baseDelay } }}
            className="mb-5 flex-shrink-0"
          >
            <div className="max-w-3xl mx-auto prose prose-sm prose-invert prose-p:text-zinc-400 prose-headings:text-white prose-strong:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {commentary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* 2-column masonry-style grid */}
        <div className="max-w-4xl mx-auto w-full grid grid-cols-2 gap-4 pb-20">
          {projects.map((project, i) => {
            const tagline = project.tagline?.en || project.tagline?.ja || '';
            const description = project.description?.en || project.description?.ja || '';
            // Alternate between tall and compact cards for visual rhythm
            const isTall = i % 3 === 0;

            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  opacity: { duration: 0.6, delay: baseDelay + 0.1 * i, ease: [0.22, 1, 0.36, 1] as const },
                  y: { ...SPRING_ENTER, delay: i * 0.08 },
                  scale: { ...SPRING_ENTER, delay: i * 0.08 },
                }}
                className={`group ${isTall ? 'row-span-2' : ''}`}
                style={{ ...revealStyle(i), ...cardFloatStyle(i), transform: 'translateZ(20px)' }}
              >
                <div
                  className={`relative border backdrop-blur-xl bg-white/5 p-4 overflow-hidden transition-all duration-500 hover:bg-white/8 cursor-default h-full flex flex-col ${
                    isTall ? 'min-h-[280px]' : 'min-h-[160px]'
                  }`}
                  style={{
                    borderRadius: organicRadius,
                    borderColor: `${palette.primary}20`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      borderRadius: organicRadius,
                      boxShadow: `inset 0 0 0 1px ${palette.primary}40, 0 0 30px ${palette.glow}08`,
                    }}
                  />

                  {/* Image (only for tall cards) */}
                  {project.image && isTall && (
                    <div
                      className="w-full h-28 rounded-lg mb-3 overflow-hidden flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${palette.primary}15, ${palette.secondary}08)`,
                      }}
                    >
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Year + Name */}
                  <div className="flex items-center gap-2 mb-1">
                    {project.year && (
                      <span
                        className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded"
                        style={{ color: palette.glow, backgroundColor: `${palette.primary}12` }}
                      >
                        {project.year}
                      </span>
                    )}
                    <h3
                      className="text-base font-bold text-white tracking-tight"
                      style={{ ...breatheStyle(i), transform: 'translateZ(40px)' }}
                    >
                      {project.name}
                    </h3>
                  </div>

                  {/* Tagline */}
                  {tagline && (
                    <p className="text-xs mb-2 leading-relaxed line-clamp-1" style={{ color: `${palette.glow}cc` }}>
                      {tagline}
                    </p>
                  )}

                  {/* Description (tall cards only) */}
                  {description && isTall && (
                    <p className="text-[11px] text-zinc-500 mb-2 leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  )}

                  {/* Stack */}
                  {project.stack && project.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2 mt-auto">
                      {project.stack.slice(0, isTall ? 6 : 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded-full border transition-colors duration-300"
                          style={{ color: `${palette.glow}aa`, borderColor: `${palette.primary}25`, backgroundColor: `${palette.primary}08` }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3 mt-auto pt-1 border-t border-white/5">
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] font-medium transition-colors duration-300 hover:underline"
                        style={{ color: palette.glow }}>
                        Visit
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] font-medium text-zinc-600 hover:text-zinc-400 transition-colors duration-300 hover:underline">
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
