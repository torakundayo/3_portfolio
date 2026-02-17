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

export function ProjectsHorizontalSlider({ data, commentary, visualSeed }: TemplateProps) {
  const projectsData = data as any;
  const projects: Project[] = projectsData?.projects ?? [];
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const gradientAngle = 135 + visualSeed.colorOffset * 0.25;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white">
      {/* CSS keyframe background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transform: 'translateZ(-20px)' }}>
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1f`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite' }} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Commentary section */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ opacity: { duration: 0.7, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const } }}
            className="px-8 pt-6 pb-2 flex-shrink-0"
          >
            <div className="max-w-2xl mx-auto prose prose-sm prose-p:text-gray-800 prose-strong:text-gray-900 max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {commentary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* Horizontal scrolling area — vertical overflow hidden, horizontal scroll kept */}
        <div className="flex-1 flex items-center overflow-x-auto overflow-y-hidden px-8 pb-6 pt-2 gap-6 scroll-smooth snap-x snap-mandatory">
          {projects.map((project, i) => {
            const tagline = project.tagline?.en || project.tagline?.ja || '';

            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  opacity: { duration: 0.7, delay: baseDelay + stagger * i, ease: [0.22, 1, 0.36, 1] as const },
                  scale: { ...SPRING_ENTER, delay: stagger * i },
                }}
                className="flex-shrink-0 w-[320px] snap-center group"
                style={{ ...revealStyle(i), ...cardFloatStyle(i), transform: 'translateZ(20px)' }}
              >
                <div
                  className="relative h-[360px] border border-gray-200 backdrop-blur-xl bg-gray-50/5 p-5 flex flex-col overflow-hidden transition-all duration-500 hover:border-gray-200"
                  style={{
                    borderRadius: organicRadius,
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
                    transition={{ ...SPRING_ENTER, delay: baseDelay + stagger * i + 0.3 }}
                  />

                  {/* Hover glow effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      borderRadius: organicRadius,
                      background: `radial-gradient(ellipse at 50% 0%, ${palette.glow}12, transparent 70%)`,
                    }}
                  />

                  {/* Project image */}
                  {project.image && (
                    <div
                      className="w-full h-28 rounded-lg mb-3 overflow-hidden flex-shrink-0"
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
                  <h3
                    className="text-xl font-bold text-gray-900 mb-1 tracking-tight"
                    style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
                  >
                    {project.name}
                  </h3>

                  {/* Tagline */}
                  {tagline && (
                    <p className="text-sm text-gray-800 mb-3 line-clamp-2">
                      {tagline}
                    </p>
                  )}

                  {/* Stack badges */}
                  {project.stack && project.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3 mt-auto">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-50 text-gray-800 border border-gray-200"
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
                        className="text-xs font-medium text-gray-800 hover:text-gray-900 transition-colors duration-300 hover:underline"
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
            transition={{ delay: baseDelay + projects.length * stagger + 0.5, duration: 0.5 }}
            className="absolute bottom-4 right-8 flex items-center gap-2 text-gray-800 text-xs"
          >
            <span>scroll</span>
            <span>
              &rarr;
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
