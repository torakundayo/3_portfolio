/**
 * Client-side intent classification via keyword matching.
 * Returns null when no pattern matches → falls through to live AI.
 */

export type IntentCategory =
  | 'profile'
  | 'projects'
  | 'skills'
  | 'career'
  | 'values'
  | 'contact'
  | 'about-site';

interface PatternDef {
  category: IntentCategory;
  /** Any of these substrings triggers a match (case-insensitive) */
  keywords: string[];
}

const patterns: PatternDef[] = [
  {
    category: 'profile',
    keywords: [
      '自己紹介', 'プロフィール', '誰', 'あなた', '紹介',
      'who are you', 'introduce', 'about you', 'tell me about',
      'profile', 'yourself',
    ],
  },
  {
    category: 'projects',
    keywords: [
      'プロジェクト', '実績', '開発', '作品', '作った', 'ポートフォリオ',
      'project', 'portfolio', 'built', 'developed', 'work', 'products',
    ],
  },
  {
    category: 'skills',
    keywords: [
      'スキル', '技術', 'テック', '言語', 'フレームワーク', '得意',
      'skill', 'tech', 'stack', 'technology', 'language', 'framework',
      'expertise', 'proficien',
    ],
  },
  {
    category: 'career',
    keywords: [
      '経歴', '職歴', 'キャリア', '会社', '仕事', '転職', '経験',
      'career', 'experience', 'company', 'job', 'history', 'work history',
    ],
  },
  {
    category: 'values',
    keywords: [
      '価値観', 'ビジョン', '信念', '哲学', '考え', '思い', '大切',
      'vision', 'values', 'belief', 'philosophy', 'mission', 'goal',
    ],
  },
  {
    category: 'contact',
    keywords: [
      '連絡', 'コンタクト', 'メール', 'email', 'github', 'linkedin',
      'contact', 'reach', 'hire', '採用', '応募',
    ],
  },
  {
    category: 'about-site',
    keywords: [
      'このサイト', 'サイトについて', 'どう作った', '仕組み', 'アーキテクチャ',
      'this site', 'how does this work', 'architecture', 'how built',
    ],
  },
];

export function classifyIntent(message: string): IntentCategory | null {
  const lower = message.toLowerCase();
  for (const pattern of patterns) {
    if (pattern.keywords.some((kw) => lower.includes(kw))) {
      return pattern.category;
    }
  }
  return null;
}
