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

export function ProjectsTimeline({ data, commentary, visualSeed }: TemplateProps) {
  const projectsData = data as any;
  const projects: Project[] = projectsData?.projects ?? [];
  const palette = accentPalettes[visualSeed.accentIndex];
  const baseDelay = visualSeed.animationDelay;
  const mirrorLayout = visualSeed.mirrorLayout;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  // Sort projects by year descending
  const sorted = [...projects].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

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

      <div className="relative z-10 flex flex-col h-full px-6 py-5">
        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ opacity: { duration: 0.7, delay: baseDelay, ease: [0.22, 1, 0.36, 1] as const } }}
            className="mb-4 text-center flex-shrink-0"
          >
            <div className="max-w-xl mx-auto prose prose-sm prose-p:text-gray-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {commentary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {/* Horizontal timeline */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Horizontal line */}
          <div className="relative">
            <motion.div
              className="absolute left-0 right-0 h-[2px] top-1/2 -translate-y-px"
              style={{
                background: `linear-gradient(to right, transparent, ${palette.primary}40, ${palette.primary}40, transparent)`,
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ ...SPRING_ENTER, delay: baseDelay + 0.3 }}
            />

            {/* Cards along horizontal line */}
            <div className="flex items-center gap-4 overflow-x-auto overflow-y-hidden px-4 py-2">
              {sorted.map((project, i) => {
                const tagline = project.tagline?.en || project.tagline?.ja || '';
                const description = project.description?.en || project.description?.ja || '';
                const isAbove = mirrorLayout ? i % 2 !== 0 : i % 2 === 0;

                return (
                  <div
                    key={project.name}
                    className="flex-shrink-0 flex flex-col items-center"
                    style={{ width: '220px' }}
                  >
                    {/* Card above or below the line */}
                    {isAbove ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            opacity: { duration: 0.6, delay: baseDelay + 0.4 + stagger * i, ease: [0.22, 1, 0.36, 1] as const },
                            scale: { ...SPRING_ENTER, delay: stagger * i },
                          }}
                          className="mb-3 w-full"
                          style={{ ...revealStyle(i), ...cardFloatStyle(i), transform: 'translateZ(20px)' }}
                        >
                          <TimelineCard
                            project={project}
                            tagline={tagline}
                            description={description}
                            palette={palette}
                            index={i}
                          />
                        </motion.div>

                        {/* Node */}
                        <TimelineNode
                          project={project}
                          palette={palette}
                          baseDelay={baseDelay}
                          cardDelay={baseDelay + 0.4 + stagger * i}
                        />
                      </>
                    ) : (
                      <>
                        {/* Node */}
                        <TimelineNode
                          project={project}
                          palette={palette}
                          baseDelay={baseDelay}
                          cardDelay={baseDelay + 0.4 + stagger * i}
                        />

                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            opacity: { duration: 0.6, delay: baseDelay + 0.4 + stagger * i, ease: [0.22, 1, 0.36, 1] as const },
                            scale: { ...SPRING_ENTER, delay: stagger * i },
                          }}
                          className="mt-3 w-full"
                          style={{ ...revealStyle(i), ...cardFloatStyle(i), transform: 'translateZ(20px)' }}
                        >
                          <TimelineCard
                            project={project}
                            tagline={tagline}
                            description={description}
                            palette={palette}
                            index={i}
                          />
                        </motion.div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Timeline node (dot + year label) */
function TimelineNode({
  project,
  palette,
  baseDelay: _baseDelay,
  cardDelay,
}: {
  project: Project;
  palette: { primary: string; secondary: string; glow: string };
  baseDelay: number;
  cardDelay: number;
}) {
  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...SPRING_ENTER, delay: cardDelay - 0.05 }}
        className="relative"
      >
        <div
          className="w-3.5 h-3.5 rounded-full border-2"
          style={{
            borderColor: palette.primary,
            backgroundColor: 'rgb(255 255 255)',
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

      {project.year && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: cardDelay + 0.2, duration: 0.4 }}
          className="mt-1 text-[9px] font-mono font-bold tracking-wider"
          style={{ color: palette.glow }}
        >
          {project.year}
        </motion.span>
      )}
    </div>
  );
}

/* Extracted card component */
function TimelineCard({
  project,
  tagline,
  description,
  palette,
  index,
}: {
  project: Project;
  tagline: string;
  description: string;
  palette: { primary: string; secondary: string; glow: string };
  index: number;
}) {
  return (
    <div
      className="group relative border border-gray-200 backdrop-blur-xl bg-gray-50/5 p-3 transition-all duration-500 hover:border-gray-200"
      style={{
        borderRadius: organicRadius,
      }}
    >
      {/* Accent edge */}
      <div
        className="absolute top-3 bottom-3 left-0 w-[2px]"
        style={{
          background: `linear-gradient(to bottom, ${palette.primary}60, ${palette.glow}30, transparent)`,
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          borderRadius: organicRadius,
          background: `radial-gradient(ellipse at 50% 0%, ${palette.glow}06, transparent 60%)`,
        }}
      />

      {/* Image */}
      {project.image && (
        <div
          className="w-full h-20 rounded-lg mb-2 overflow-hidden"
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
        className="text-sm font-bold text-gray-900 mb-0.5 tracking-tight"
        style={{ ...breatheStyle(index), transform: 'translateZ(40px)' }}
      >
        {project.name}
      </h3>

      {tagline && (
        <p
          className="text-[11px] mb-1 line-clamp-1"
          style={{ color: `${palette.glow}bb` }}
        >
          {tagline}
        </p>
      )}

      {description && (
        <p className="text-[10px] text-gray-800 mb-2 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}

      {project.stack && project.stack.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {project.stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-800 border border-gray-200"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 3 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-800">
              +{project.stack.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2">
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
  );
}
