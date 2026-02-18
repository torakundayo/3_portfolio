'use client';

import { useMemo, useRef } from 'react';
import type { BehaviorState } from './useBehaviorObserver';
import { templateRegistry } from '@/components/templates/registry';

/* ═══ Types ═══ */

export interface ProactiveResponse {
  /** 0-1: boost to MouseGlow opacity */
  glowIntensity: number;
  /** 0-1: particle drift bias toward center */
  particleAttraction: number;
  /** Zone IDs to visually emphasize */
  highlightZones: string[];
  /** Keywords to float near input */
  suggestedKeywords: string[];
  /** Ambient AI whisper (fades into environment) */
  ambientMessage: string | null;
}

/* ═══ Constants ═══ */

const DEFAULT_KEYWORDS = ['スキル', '経歴', 'プロジェクト', '連絡先'];

const WELCOME_KEYWORDS = ['スキル', '経歴', 'プロジェクト', '価値観', '連絡先', 'このサイト'];

/** Context-aware ambient messages keyed by current template category.
 *  These should feel like quiet thoughts, not UI instructions.
 *  Never tell the user what to click or how to interact. */
const AMBIENT_MESSAGES: Record<string, string[]> = {
  welcome: [],
  profile: [
    '実はプロジェクトの裏側にもっと面白い話がある',
    '技術選定にはいつもこだわりがある',
  ],
  projects: [
    'どのプロジェクトにも技術的な挑戦があった',
    '最近はAIとUIの境界を探っている',
  ],
  skills: [
    '数字だけでは見えない経験値がある',
    'スキルはプロジェクトの中で磨かれてきた',
  ],
  career: [
    '転機ごとに新しい技術領域に飛び込んできた',
    'チーム開発で一番学んだのは技術以外のこと',
  ],
  values: [
    'コードは手段、目的はいつもユーザー体験',
  ],
  contact: [],
  text: [],
};

/** Quiet hints when user has viewed the same category repeatedly */
const EXPLORATION_SUGGESTIONS: Record<string, string> = {
  profile: '技術の裏側にもストーリーがある',
  projects: 'キャリアの転機にはいつも理由がある',
  skills: '数字の奥にプロジェクトの経験がある',
  career: 'キャリアを動かしてきた価値観がある',
  values: '信念が形になったプロジェクトがある',
  contact: '',
};

/* ═══ Helpers ═══ */

function getCategoryFromTemplateId(templateId: string): string {
  const entry = templateRegistry[templateId];
  return entry?.meta.category ?? 'text';
}

function pickRandom<T>(arr: T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ═══ Hook ═══ */

export function useProactiveResponse(
  behavior: BehaviorState,
  templateId: string,
  usedTemplates: string[],
): ProactiveResponse {
  const category = getCategoryFromTemplateId(templateId);
  const isWelcome = templateId === 'welcome';

  // Pre-compute random ambient message outside useMemo to avoid impure memo
  const prevCatRef = useRef(category);
  const prevStageRef = useRef(behavior.idleStage);
  const randomAmbientRef = useRef<string | null>(null);

  if (prevCatRef.current !== category || prevStageRef.current !== behavior.idleStage) {
    prevCatRef.current = category;
    prevStageRef.current = behavior.idleStage;
    if (behavior.idleStage === 'suggest') {
      const messages = AMBIENT_MESSAGES[category] ?? AMBIENT_MESSAGES.text;
      randomAmbientRef.current = pickRandom(messages) ?? null;
    }
  }

  return useMemo(() => {
    let glowIntensity = 0;
    let particleAttraction = 0;
    const highlightZones: string[] = [];
    let suggestedKeywords: string[] = [];
    let ambientMessage: string | null = null;

    // ── Idle responses — perceptible intensity progression ──
    if (behavior.idleStage === 'nudge') {
      glowIntensity = 0.5;
      particleAttraction = 0.3;
    }

    if (behavior.idleStage === 'hint') {
      glowIntensity = 0.8;
      particleAttraction = 0.5;
      suggestedKeywords = isWelcome ? WELCOME_KEYWORDS : DEFAULT_KEYWORDS;
    }

    if (behavior.idleStage === 'suggest') {
      glowIntensity = 1.2;
      particleAttraction = 0.7;
      suggestedKeywords = isWelcome ? WELCOME_KEYWORDS : DEFAULT_KEYWORDS;

      // Use pre-computed random ambient message (avoids Math.random() inside useMemo)
      ambientMessage = randomAmbientRef.current;
    }

    // ── Cursor speed: searching → highlight main zones ──
    if (behavior.cursorSpeed === 'searching') {
      highlightZones.push('input-field', 'main-content');
      glowIntensity = Math.max(glowIntensity, 0.6);
    }

    // ── Cursor dwell → highlight dwelt zone ──
    if (behavior.dwellTarget) {
      highlightZones.push(behavior.dwellTarget);
    }

    // ── Focus without typing → suggest keywords ──
    if (behavior.focusIdleDuration > 0 && suggestedKeywords.length === 0) {
      suggestedKeywords = isWelcome ? WELCOME_KEYWORDS : DEFAULT_KEYWORDS;
    }

    // ── Repeated viewing → suggest exploring elsewhere ──
    if (behavior.repeatedAreas.size > 0) {
      // Find the most-repeated category
      let maxCat = '';
      let maxCount = 0;
      for (const [cat, count] of behavior.repeatedAreas) {
        if (count > maxCount) {
          maxCat = cat;
          maxCount = count;
        }
      }
      if (maxCat && EXPLORATION_SUGGESTIONS[maxCat] && !ambientMessage) {
        ambientMessage = EXPLORATION_SUGGESTIONS[maxCat];
      }
    }

    return {
      glowIntensity,
      particleAttraction,
      highlightZones,
      suggestedKeywords,
      ambientMessage,
    };
  }, [
    behavior.idleStage,
    behavior.cursorSpeed,
    behavior.dwellTarget,
    behavior.focusIdleDuration,
    behavior.repeatedAreas,
    category,
    isWelcome,
  ]);
}
