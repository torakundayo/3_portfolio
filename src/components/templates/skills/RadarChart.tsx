'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';
import { SPRING_ENTER, breatheStyle, revealStyle, organicRadius, getLayoutVariant, seededStagger } from '@/lib/animation';

/**
 * CSS/SVG-only radar chart -- no external chart libraries.
 * Displays a polygon representing skill levels with labels around the edges.
 */
export function SkillsRadarChart({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const skillsData = data as any;
  const categories = skillsData?.categories ?? [];
  const allSkills = categories.flatMap((c: any) => c.skills ?? []);
  const baseDelay = visualSeed.animationDelay;
  const mirror = visualSeed.mirrorLayout;
  const { stagger } = seededStagger(visualSeed.colorOffset);

  // Take up to 12 skills for a readable radar
  const skills = allSkills.slice(0, 12);
  const n = skills.length;

  // SVG parameters
  const cx = 200;
  const cy = 200;
  const maxR = 150;
  const levels = 5;

  // Calculate polygon points for a given set of values (0-5)
  const getPolygonPoints = useMemo(() => {
    return (values: number[]) => {
      if (values.length === 0) return '';
      const angleStep = (2 * Math.PI) / values.length;
      const startAngle = -Math.PI / 2; // start from top
      return values
        .map((val, i) => {
          const angle = startAngle + i * angleStep;
          const r = ((val || 0) / levels) * maxR;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return `${Number.isFinite(x) ? x : cx},${Number.isFinite(y) ? y : cy}`;
        })
        .join(' ');
    };
  }, [n, levels, maxR, cx, cy]);

  // Grid ring points (for concentric pentagons/polygons)
  const gridRings = useMemo(() => {
    return Array.from({ length: levels }, (_, level) => {
      const vals = Array(n).fill(level + 1);
      return getPolygonPoints(vals);
    });
  }, [n, getPolygonPoints]);

  // Data polygon
  const dataValues = skills.map((s: any) => Math.min(Math.max(s.level ?? 0, 0), 5));
  const dataPoints = getPolygonPoints(dataValues);

  // Label positions (slightly outside the chart)
  const labelPositions = useMemo(() => {
    const angleStep = (2 * Math.PI) / n;
    const startAngle = -Math.PI / 2;
    const labelR = maxR + 30;
    return skills.map((_: any, i: number) => {
      const angle = startAngle + i * angleStep;
      return {
        x: cx + labelR * Math.cos(angle),
        y: cy + labelR * Math.sin(angle),
        anchor:
          Math.abs(Math.cos(angle)) < 0.1
            ? ('middle' as const)
            : Math.cos(angle) > 0
              ? ('start' as const)
              : ('end' as const),
        baseline:
          Math.abs(Math.sin(angle)) < 0.1
            ? ('middle' as const)
            : Math.sin(angle) > 0
              ? ('hanging' as const)
              : ('auto' as const),
      };
    });
  }, [n]);

  // Axis lines
  const axisLines = useMemo(() => {
    const angleStep = (2 * Math.PI) / n;
    const startAngle = -Math.PI / 2;
    return Array.from({ length: n }, (_, i) => {
      const angle = startAngle + i * angleStep;
      return {
        x2: cx + maxR * Math.cos(angle),
        y2: cy + maxR * Math.sin(angle),
      };
    });
  }, [n]);

  if (n === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-950 text-gray-700">
        No skill data available
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      {/* CSS keyframe background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] rounded-full blur-3xl"
          style={{ background: `${palette.primary}1f`, left: '20%', top: '15%',
                   animation: 'bg-drift-1 18s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
        <div className="absolute w-[50vw] h-[50vh] rounded-full blur-3xl"
          style={{ background: `${palette.secondary}14`, right: '15%', bottom: '20%',
                   animation: 'bg-drift-2 22s ease-in-out infinite', transform: 'translateZ(-20px)' }} />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-8 lg:py-10 h-full">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...SPRING_ENTER, delay: baseDelay }}
          className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          style={{ ...breatheStyle(0), transform: 'translateZ(40px)' }}
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${palette.primary}, ${palette.glow})`,
            }}
          >
            Skill Radar
          </span>
        </motion.h2>

        {/* Radar Chart SVG — centered, takes available space */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING_ENTER, delay: baseDelay + 0.1 }}
          className={`w-full max-w-lg flex-1 min-h-0 ${mirror ? 'scale-x-[-1]' : ''}`}
          style={{ transform: `${mirror ? 'scaleX(-1) ' : ''}translateZ(20px)` }}
        >
          <svg viewBox="-10 -10 420 420" className="w-full h-full drop-shadow-2xl" style={{ maxHeight: '60vh' }}>
            <defs>
              <radialGradient id={`radarGlow-${visualSeed.accentIndex}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={palette.glow} stopOpacity="0.3" />
                <stop offset="100%" stopColor={palette.primary} stopOpacity="0.05" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid rings */}
            {gridRings.map((points, i) => (
              <motion.polygon
                key={`ring-${i}`}
                points={points}
                fill="none"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth={i === levels - 1 ? 1.5 : 0.8}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: baseDelay + 0.2 + stagger * i, duration: 0.4 }}
              />
            ))}

            {/* Axis lines */}
            {axisLines.map((line, i) => (
              <motion.line
                key={`axis-${i}`}
                x1={cx}
                y1={cy}
                x2={line.x2}
                y2={line.y2}
                stroke="rgba(0,0,0,0.08)"
                strokeWidth={0.8}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: baseDelay + 0.3 + stagger * i, duration: 0.5 }}
              />
            ))}

            {/* Data polygon fill — no points string animation (causes NaN in framer-motion) */}
            <motion.polygon
              points={dataPoints}
              fill={`url(#radarGlow-${visualSeed.accentIndex})`}
              stroke={palette.primary}
              strokeWidth={2}
              filter="url(#glow)"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SPRING_ENTER, delay: baseDelay + 0.5 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />

            {/* Data points (dots) */}
            {dataValues.map((val: number, i: number) => {
              const angleStep = (2 * Math.PI) / n;
              const startAngle = -Math.PI / 2;
              const angle = startAngle + i * angleStep;
              const r = (val / levels) * maxR;
              const dotX = cx + r * Math.cos(angle);
              const dotY = cy + r * Math.sin(angle);

              return (
                <motion.circle
                  key={`dot-${i}`}
                  cx={dotX}
                  cy={dotY}
                  r={4}
                  fill={palette.glow}
                  stroke={palette.primary}
                  strokeWidth={2}
                  filter="url(#glow)"
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 4, opacity: 1 }}
                  transition={{ ...SPRING_ENTER, delay: baseDelay + 0.8 + stagger * i }}
                />
              );
            })}

            {/* Labels */}
            {skills.map((skill: any, i: number) => {
              const pos = labelPositions[i];
              return (
                <motion.text
                  key={`label-${i}`}
                  x={pos.x}
                  y={pos.y}
                  textAnchor={pos.anchor}
                  dominantBaseline={pos.baseline}
                  className="text-[11px] font-medium"
                  fill="rgba(0,0,0,0.6)"
                  style={mirror ? { transform: `scaleX(-1)`, transformOrigin: `${pos.x}px ${pos.y}px` } : undefined}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: baseDelay + 1.0 + stagger * i, duration: 0.4 }}
                >
                  {skill.name}
                </motion.text>
              );
            })}

            {/* Center dot */}
            <circle cx={cx} cy={cy} r={2} fill="rgba(0,0,0,0.2)" />
          </svg>
        </motion.div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: baseDelay + 1.4 }}
            className="mt-4 w-full max-w-2xl border border-gray-200 bg-white/50 p-5 backdrop-blur-sm"
            style={{ borderRadius: organicRadius }}
          >
            <div className="prose prose-sm max-w-none prose-p:text-gray-800 prose-strong:text-gray-900 prose-a:text-indigo-600">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
