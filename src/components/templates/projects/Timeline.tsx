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

export function ProjectsTimeline({ data, commentary, visualSeed }: TemplateProps) {
  const projectsData = data as any;
  const projects: Project[] = projectsData?.projects ?? [];
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const mirrorLayout = visualSeed.mirrorLayout;

  // Sort projects by year descending
  const sorted = [...projects].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  const isLeft = (index: number): boolean => {
    const natural = index % 2 === 0;
    return mirrorLayout ? !natural : natural;
  };

  return (
    <div className="h-full w-full overflow-auto bg-zinc-950">
      {/* Background */}
      <div className="fixed inset-0 -z-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(${palette.primary}06 1px, transparent 1px),
              linear-gradient(90deg, ${palette.primary}06 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full opacity-10"
          style={{ backgroundColor: palette.primary }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-14 text-center"
          >
            <div className="max-w-xl mx-auto prose prose-sm prose-invert prose-p:text-zinc-400 prose-headings:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {commentary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <motion.div
            className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-[2px] hidden sm:block"
            style={{
              background: `linear-gradient(to bottom, transparent, ${palette.primary}40, ${palette.primary}40, transparent)`,
            }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: baseDelay + 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          />

          {/* Mobile line (left-aligned) */}
          <motion.div
            className="absolute left-4 top-0 bottom-0 w-[2px] sm:hidden"
            style={{
              background: `linear-gradient(to bottom, transparent, ${palette.primary}40, ${palette.primary}40, transparent)`,
            }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: baseDelay + 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          />

          {sorted.map((project, i) => {
            const left = isLeft(i);
            const cardDelay = baseDelay + 0.4 + i * 0.18;
            const tagline = project.tagline?.en || project.tagline?.ja || '';
            const description = project.description?.en || project.description?.ja || '';

            return (
              <div
                key={project.name}
                className="relative mb-12 last:mb-0"
              >
                {/* Desktop layout */}
                <div className="hidden sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-6 items-start">
                  {/* Left content or spacer */}
                  <div className={left ? '' : 'order-3'}>
                    {left && (
                      <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.7,
                          delay: cardDelay,
                          ease: [0.22, 1, 0.36, 1] as const,
                        }}
                        className="text-right"
                      >
                        <ProjectCard
                          project={project}
                          tagline={tagline}
                          description={description}
                          palette={palette}
                          align="right"
                          delay={cardDelay}
                          baseDelay={baseDelay}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Center node */}
                  <div className="flex flex-col items-center pt-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: cardDelay - 0.05,
                        ease: [0.22, 1, 0.36, 1] as const,
                      }}
                      className="relative"
                    >
                      <div
                        className="w-4 h-4 rounded-full border-2"
                        style={{
                          borderColor: palette.primary,
                          backgroundColor: 'rgb(9 9 11)',
                          boxShadow: `0 0 12px ${palette.glow}40`,
                        }}
                      />
                      {/* Pulsing ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: `1px solid ${palette.glow}` }}
                        animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                        transition={{
                          duration: 2,
                          delay: cardDelay + 0.3,
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                      />
                    </motion.div>

                    {/* Year label */}
                    {project.year && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: cardDelay + 0.2, duration: 0.4 }}
                        className="mt-2 text-[10px] font-mono font-bold tracking-wider"
                        style={{ color: palette.glow }}
                      >
                        {project.year}
                      </motion.span>
                    )}
                  </div>

                  {/* Right content or spacer */}
                  <div className={left ? 'order-3' : ''}>
                    {!left && (
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.7,
                          delay: cardDelay,
                          ease: [0.22, 1, 0.36, 1] as const,
                        }}
                      >
                        <ProjectCard
                          project={project}
                          tagline={tagline}
                          description={description}
                          palette={palette}
                          align="left"
                          delay={cardDelay}
                          baseDelay={baseDelay}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Mobile layout - always right of line */}
                <div className="sm:hidden flex gap-4 items-start">
                  {/* Node */}
                  <div className="flex flex-col items-center flex-shrink-0 pt-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: cardDelay - 0.05 }}
                      className="w-3 h-3 rounded-full border-2"
                      style={{
                        borderColor: palette.primary,
                        backgroundColor: 'rgb(9 9 11)',
                        boxShadow: `0 0 8px ${palette.glow}30`,
                      }}
                    />
                    {project.year && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: cardDelay + 0.2, duration: 0.4 }}
                        className="mt-1 text-[9px] font-mono font-bold"
                        style={{ color: palette.glow }}
                      >
                        {project.year}
                      </motion.span>
                    )}
                  </div>

                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: cardDelay }}
                    className="flex-1"
                  >
                    <ProjectCard
                      project={project}
                      tagline={tagline}
                      description={description}
                      palette={palette}
                      align="left"
                      delay={cardDelay}
                      baseDelay={baseDelay}
                    />
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* Extracted card component */
function ProjectCard({
  project,
  tagline,
  description,
  palette,
  align,
  delay,
  baseDelay: _baseDelay,
}: {
  project: Project;
  tagline: string;
  description: string;
  palette: { primary: string; secondary: string; glow: string };
  align: 'left' | 'right';
  delay: number;
  baseDelay: number;
}) {
  return (
    <div
      className="group relative rounded-xl border border-white/8 bg-zinc-900/50 backdrop-blur-sm p-5 transition-all duration-500 hover:border-white/15"
      style={{
        boxShadow: `0 0 0 0px ${palette.primary}00`,
      }}
    >
      {/* Accent edge */}
      <div
        className={`absolute top-4 bottom-4 w-[2px] ${align === 'right' ? 'right-0' : 'left-0'}`}
        style={{
          background: `linear-gradient(to bottom, ${palette.primary}60, ${palette.glow}30, transparent)`,
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${align === 'right' ? '100%' : '0%'} 50%, ${palette.glow}06, transparent 60%)`,
        }}
      />

      {/* Image */}
      {project.image && (
        <div
          className="w-full h-28 rounded-lg mb-3 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${palette.primary}12, ${palette.secondary}06)`,
          }}
        >
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          />
        </div>
      )}

      <h3
        className={`text-lg font-bold text-white mb-1 tracking-tight ${align === 'right' ? 'text-right' : 'text-left'}`}
      >
        {project.name}
      </h3>

      {tagline && (
        <p
          className={`text-sm mb-3 ${align === 'right' ? 'text-right' : 'text-left'}`}
          style={{ color: `${palette.glow}bb` }}
        >
          {tagline}
        </p>
      )}

      {description && (
        <p
          className={`text-xs text-zinc-500 mb-3 leading-relaxed line-clamp-2 ${align === 'right' ? 'text-right' : 'text-left'}`}
        >
          {description}
        </p>
      )}

      {project.stack && project.stack.length > 0 && (
        <div
          className={`flex flex-wrap gap-1.5 mb-3 ${align === 'right' ? 'justify-end' : 'justify-start'}`}
        >
          {project.stack.map((tech, techIdx) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.3 + techIdx * 0.04, duration: 0.3 }}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      )}

      <div
        className={`flex gap-3 ${align === 'right' ? 'justify-end' : 'justify-start'}`}
      >
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
  );
}
