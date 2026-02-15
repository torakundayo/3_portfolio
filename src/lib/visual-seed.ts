import type { AccentPalette, VisualSeed } from './types';

export function generateVisualSeed(): VisualSeed {
  return {
    colorOffset: Math.random() * 360,
    layoutVariant: Math.random(),
    animationDelay: Math.random() * 0.3,
    accentIndex: Math.floor(Math.random() * 5),
    mirrorLayout: Math.random() > 0.5,
  };
}

export const accentPalettes: AccentPalette[] = [
  { primary: '#6366f1', secondary: '#8b5cf6', glow: '#a78bfa' },
  { primary: '#06b6d4', secondary: '#0ea5e9', glow: '#67e8f9' },
  { primary: '#f43f5e', secondary: '#e11d48', glow: '#fda4af' },
  { primary: '#10b981', secondary: '#059669', glow: '#6ee7b7' },
  { primary: '#f59e0b', secondary: '#d97706', glow: '#fcd34d' },
];
