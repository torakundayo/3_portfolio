'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps, ProjectsData } from '@/lib/types';
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

export function ProjectsShowcaseStack({ data, commentary, visualSeed }: TemplateProps) {
  const projectsData = data as ProjectsData;
  const projects: Project[] = projectsData?.projects ?? [];
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const mirrorLayout = visualSeed.mirrorLayout;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  // Limit to max 4 cards
  const visibleProjects = projects.slice(0, 4);

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

      {/* Subtle floor reflection */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/4 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${palette.primary}06, transparent)`,
          transform: 'translateZ(-20px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center h-full px-6 py-5">
        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ opacity: { duration: 0.7, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const } }}
            className="mb-4 text-center w-full flex-shrink-0"
          >
            <div className="max-w-xl mx-auto prose prose-sm prose-p:text-gray-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {commentary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* Stacked card deck area — constrained height */}
        <div className="relative w-full max-w-lg flex-1 flex items-center justify-center" style={{ maxHeight: '340px' }}>
          <div className="relative w-full h-full">
            {visibleProjects.map((project, i) => {
              const fan = getFanTransform(i, visibleProjects.length);
              const cardDelay = baseDelay + 0.2 + stagger * i;
              const tagline = project.tagline?.en || project.tagline?.ja || '';
              const description = project.description?.en || project.description?.ja || '';
              const zIndex = visibleProjects.length - i;

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
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: fan.rotate,
                  }}
                  transition={{
                    opacity: { duration: 0.8, delay: cardDelay, ease: [0.22, 1, 0.36, 1] as const },
                    scale: { ...SPRING_ENTER, delay: stagger * i },
                    rotate: { ...SPRING_ENTER, delay: stagger * i },
                  }}
                  whileHover={{
                    scale: 1.04,
                    rotate: 0,
                    zIndex: 50,
                    transition: { ...SPRING_ENTER },
                  }}
                  style={{ zIndex, ...revealStyle(i), ...cardFloatStyle(i), transform: `translateZ(20px) translateX(${fan.x}px) translateY(${fan.y}px)` }}
                >
                  <div
                    className="relative h-full border border-gray-200 backdrop-blur-xl bg-white/20 p-5 overflow-hidden transition-shadow duration-500"
                    style={{
                      borderRadius: organicRadius,
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
                        borderRadius: organicRadius,
                        background: `linear-gradient(${gradientRotation}deg, ${palette.primary}, transparent 60%)`,
                      }}
                    />

                    {/* Content */}
                    <div className="relative flex flex-col h-full">
                      {/* Image */}
                      {project.image && (
                        <div
                          className="w-full h-24 rounded-lg mb-3 overflow-hidden flex-shrink-0"
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

                      <h3
                        className="text-lg font-black text-gray-900 mb-1 tracking-tight"
                        style={{ ...breatheStyle(i), transform: 'translateZ(40px)' }}
                      >
                        {project.name}
                      </h3>

                      {tagline && (
                        <p
                          className="text-xs mb-2 line-clamp-1"
                          style={{ color: `${palette.glow}cc` }}
                        >
                          {tagline}
                        </p>
                      )}

                      {description && (
                        <p className="text-[11px] text-gray-800 mb-3 leading-relaxed line-clamp-2">
                          {description}
                        </p>
                      )}

                      {/* Stack */}
                      {project.stack && project.stack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3 mt-auto">
                          {project.stack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="text-[9px] font-medium px-1.5 py-0.5 rounded-full border"
                              style={{
                                color: `${palette.glow}99`,
                                borderColor: `${palette.primary}20`,
                                backgroundColor: `${palette.primary}06`,
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.stack.length > 4 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-800">
                              +{project.stack.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex gap-3 mt-auto">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold px-3 py-1 rounded-lg transition-all duration-300 hover:scale-105"
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
                            className="text-xs font-medium px-3 py-1 rounded-lg border border-gray-200 text-gray-800 hover:text-gray-900 hover:border-gray-200 transition-all duration-300"
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
        {visibleProjects.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay + 0.2 + visibleProjects.length * stagger + 0.5, duration: 0.5 }}
            className="flex items-center gap-2 mt-4 mb-2"
          >
            {visibleProjects.map((_, i) => (
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
          className="text-[11px] text-gray-800 tracking-wider"
        >
          hover cards to explore
        </motion.p>
      </div>
    </div>
  );
}
