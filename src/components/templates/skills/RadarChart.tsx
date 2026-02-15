'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TemplateProps } from '@/lib/types';
import { accentPalettes } from '@/lib/visual-seed';

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
          const r = (val / levels) * maxR;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return `${x},${y}`;
        })
        .join(' ');
    };
  }, [n]);

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

  // Collapsed polygon (all zeros) for animation
  const zeroPoints = getPolygonPoints(Array(n).fill(0));

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
      <div className="h-full w-full flex items-center justify-center bg-gray-950 text-gray-500">
        No skill data available
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 45%, ${palette.primary}10, transparent)`,
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-12 lg:py-16">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: baseDelay }}
          className="mb-8 text-3xl font-bold tracking-tight text-white sm:text-4xl"
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

        {/* Radar Chart SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: baseDelay + 0.1, ease: [0.22, 1, 0.36, 1] as const }}
          className={`w-full max-w-lg ${mirror ? 'scale-x-[-1]' : ''}`}
          style={{ transform: mirror ? 'scaleX(-1)' : undefined }}
        >
          <svg viewBox="-10 -10 420 420" className="w-full drop-shadow-2xl">
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
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={i === levels - 1 ? 1.5 : 0.8}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: baseDelay + 0.2 + i * 0.06, duration: 0.4 }}
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
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={0.8}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: baseDelay + 0.3 + i * 0.04, duration: 0.5 }}
              />
            ))}

            {/* Data polygon fill */}
            <motion.polygon
              points={dataPoints}
              fill={`url(#radarGlow-${visualSeed.accentIndex})`}
              stroke={palette.primary}
              strokeWidth={2}
              filter="url(#glow)"
              initial={{ points: zeroPoints, opacity: 0 }}
              animate={{ points: dataPoints, opacity: 1 }}
              transition={{
                points: { duration: 1.2, delay: baseDelay + 0.5, ease: [0.22, 1, 0.36, 1] as const },
                opacity: { duration: 0.4, delay: baseDelay + 0.5 },
              }}
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
                  transition={{ delay: baseDelay + 0.8 + i * 0.05, duration: 0.4 }}
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
                  fill="rgba(255,255,255,0.7)"
                  style={mirror ? { transform: `scaleX(-1)`, transformOrigin: `${pos.x}px ${pos.y}px` } : undefined}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: baseDelay + 1.0 + i * 0.05, duration: 0.4 }}
                >
                  {skill.name}
                </motion.text>
              );
            })}

            {/* Center dot */}
            <circle cx={cx} cy={cy} r={2} fill="rgba(255,255,255,0.3)" />
          </svg>
        </motion.div>

        {/* Skill list below chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: baseDelay + 1.4, duration: 0.6 }}
          className="mt-8 grid w-full max-w-lg grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3"
        >
          {skills.map((skill: any, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: palette.primary,
                  boxShadow: `0 0 6px ${palette.glow}60`,
                }}
              />
              <span>{skill.name}</span>
              <span className="ml-auto text-xs text-gray-600">{skill.level}/5</span>
            </div>
          ))}
        </motion.div>

        {/* Commentary */}
        {commentary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: baseDelay + 1.6 }}
            className="mt-12 w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className="prose prose-sm prose-invert max-w-none prose-p:text-gray-400 prose-strong:text-gray-200 prose-a:text-indigo-400">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{commentary}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
