import type { VisualSeed } from './types';
import { seededRandom } from './animation';

/* ═══ Types ═══ */

export interface SpatialItem {
  id: string;
  /** 0–1, higher = more central and prominent */
  importance: number;
  /** Items sharing a group are placed closer together */
  group?: string;
}

export interface SpatialPosition {
  /** % of viewport width  (0–100) */
  x: number;
  /** % of viewport height (0–100) */
  y: number;
  /** Depth for translateZ (px) */
  z: number;
  /** Visual scale multiplier */
  scale: number;
  /** Visual opacity (0–1) */
  opacity: number;
}

/* ═══ Core algorithm ═══ */

/**
 * Compute spatial coordinates for a set of items.
 *
 * Rules:
 *   - centre = protagonist (highest importance)
 *   - periphery = context (lowest importance)
 *   - proximity = relatedness (same group → closer)
 *   - VisualSeed introduces deterministic variation
 */
export function calculateSpatialPositions(
  items: SpatialItem[],
  viewport: { width: number; height: number },
  seed: VisualSeed,
): SpatialPosition[] {
  if (items.length === 0) return [];

  const r = seededRandom(
    Math.round(seed.colorOffset * 100) + seed.accentIndex * 7 + 42,
  );

  // Sort by importance descending — most important first
  const sorted = items
    .map((item, originalIndex) => ({ ...item, originalIndex }))
    .sort((a, b) => b.importance - a.importance);

  // Assign group angles — each group gets a sector of the circle
  const groups = [...new Set(sorted.map((s) => s.group).filter(Boolean))] as string[];
  const groupAngleBase: Record<string, number> = {};
  const mirrorFlip = seed.mirrorLayout ? Math.PI : 0;
  groups.forEach((g, i) => {
    groupAngleBase[g] = ((i / Math.max(groups.length, 1)) * Math.PI * 2) + mirrorFlip;
  });

  // Centre point with slight seed-based offset
  const cx = 50 + (seed.layoutVariant - 0.5) * 6;
  const cy = 46 + (seed.colorOffset / 360 - 0.5) * 6;

  const positions: { pos: SpatialPosition; originalIndex: number }[] = [];

  sorted.forEach((item, rank) => {
    const t = items.length > 1 ? rank / (items.length - 1) : 0; // 0=most important, 1=least

    // Distance from centre: most important is near centre, least at edge
    const baseRadius = t * 34 + 2; // 2–36 in viewport %

    // Angle: influenced by group sector + rank spiral + seed jitter
    let angle: number;
    if (item.group && groupAngleBase[item.group] !== undefined) {
      const groupBase = groupAngleBase[item.group];
      const groupMembers = sorted.filter((s) => s.group === item.group);
      const indexInGroup = groupMembers.indexOf(item);
      const spread = Math.min(0.8, 0.3 + groupMembers.length * 0.1);
      angle = groupBase + (indexInGroup - (groupMembers.length - 1) / 2) * spread * 0.4;
    } else {
      // Golden-angle spiral for ungrouped items
      angle = rank * 2.399 + mirrorFlip;
    }

    // Add seed-based jitter
    const jitterAngle = (r() - 0.5) * 0.6;
    const jitterRadius = (r() - 0.5) * 4;
    angle += jitterAngle;
    const radius = baseRadius + jitterRadius;

    // Aspect-ratio compensation: squash Y so layout fits viewport
    const aspect = viewport.width / viewport.height;
    const aspectCompY = Math.min(1, 1 / aspect);
    const aspectCompX = Math.min(1, aspect);

    const x = cx + Math.cos(angle) * radius * aspectCompX;
    const y = cy + Math.sin(angle) * radius * aspectCompY;

    // Depth, scale, opacity all correlate with importance
    const z = 10 + item.importance * 50; // 10–60px
    const scale = 0.7 + item.importance * 0.3; // 0.7–1.0
    const opacity = 0.6 + item.importance * 0.4; // 0.6–1.0

    positions.push({
      pos: {
        x: clamp(x, 5, 95),
        y: clamp(y, 5, 95),
        z,
        scale,
        opacity,
      },
      originalIndex: item.originalIndex,
    });
  });

  // Return in original item order
  const result: SpatialPosition[] = new Array(items.length);
  positions.forEach(({ pos, originalIndex }) => {
    result[originalIndex] = pos;
  });
  return result;
}

/* ═══ Helpers ═══ */

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Generate connection lines between items in the same group.
 * Returns pairs of indices that should be visually connected.
 */
export function calculateConnections(
  items: SpatialItem[],
): [number, number][] {
  const connections: [number, number][] = [];
  const groupMap = new Map<string, number[]>();

  items.forEach((item, i) => {
    if (item.group) {
      const arr = groupMap.get(item.group) || [];
      arr.push(i);
      groupMap.set(item.group, arr);
    }
  });

  groupMap.forEach((indices) => {
    // Connect sequential members within each group
    for (let i = 0; i < indices.length - 1; i++) {
      connections.push([indices[i], indices[i + 1]]);
    }
  });

  return connections;
}
