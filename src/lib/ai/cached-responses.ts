/**
 * Pre-generated response bank.
 * Each intent category has multiple variants (template + commentary).
 * The system picks one that hasn't been recently used, ensuring variety.
 */

import type { IntentCategory } from './intent-classifier';
import profile from '@/data/profile.json';
import projects from '@/data/projects.json';
import skills from '@/data/skills.json';
import career from '@/data/career.json';
import values from '@/data/values.json';
import contact from '@/data/contact.json';

export interface CachedResponse {
  templateId: string;
  /** Which data tool(s) this response simulates calling */
  dataTools: { toolName: string; output: unknown }[];
  /** AI commentary text displayed in the template */
  commentary: string;
}

/* ═══ Response bank — 2-4 variants per category ═══ */

const responseBank: Record<IntentCategory, CachedResponse[]> = {
  profile: [
    {
      templateId: 'profile-hero-split',
      dataTools: [{ toolName: 'getProfile', output: profile }],
      commentary:
        'こちらが基本的なプロフィールです。気になる点があれば、もっと詳しくお話しできますよ。',
    },
    {
      templateId: 'profile-centered-bio',
      dataTools: [{ toolName: 'getProfile', output: profile }],
      commentary:
        '自己紹介をまとめました。技術スキルやプロジェクトについても聞いてみてください。',
    },
    {
      templateId: 'profile-card-stack',
      dataTools: [{ toolName: 'getProfile', output: profile }],
      commentary:
        'カードスタック形式でプロフィールを表示しています。各カードをご覧ください。',
    },
    {
      templateId: 'profile-full-portrait',
      dataTools: [{ toolName: 'getProfile', output: profile }],
      commentary:
        'フルスクリーンで自己紹介をお届けします。何でもお気軽にどうぞ。',
    },
  ],

  projects: [
    {
      templateId: 'projects-horizontal-slider',
      dataTools: [{ toolName: 'getProjects', output: projects }],
      commentary:
        '開発したプロジェクトの一覧です。横にスクロールして各プロジェクトをご覧ください。',
    },
    {
      templateId: 'projects-grid-gallery',
      dataTools: [{ toolName: 'getProjects', output: projects }],
      commentary:
        'プロジェクトをギャラリー形式で並べました。それぞれが異なる課題を解決しています。',
    },
    {
      templateId: 'projects-spotlight',
      dataTools: [{ toolName: 'getProjects', output: projects }],
      commentary:
        'プロジェクトをスポットライト形式でフィーチャーしています。',
    },
    {
      templateId: 'projects-timeline',
      dataTools: [{ toolName: 'getProjects', output: projects }],
      commentary:
        '時系列でプロジェクトを並べました。開発の成長過程がわかるかと思います。',
    },
    {
      templateId: 'projects-showcase-stack',
      dataTools: [{ toolName: 'getProjects', output: projects }],
      commentary:
        'カードスタック形式でプロジェクトを紹介します。インパクトのあるプロジェクトばかりです。',
    },
  ],

  skills: [
    {
      templateId: 'skills-bar-chart',
      dataTools: [{ toolName: 'getSkills', output: skills }],
      commentary:
        '技術スキルをレベル別に表示しています。フロントエンドが特に強みです。',
    },
    {
      templateId: 'skills-radar-chart',
      dataTools: [{ toolName: 'getSkills', output: skills }],
      commentary:
        'レーダーチャートでスキルのバランスを可視化しました。',
    },
    {
      templateId: 'skills-tag-cloud',
      dataTools: [{ toolName: 'getSkills', output: skills }],
      commentary:
        'タグクラウド形式で技術スタックの広がりを表現しています。',
    },
    {
      templateId: 'skills-category-cards',
      dataTools: [{ toolName: 'getSkills', output: skills }],
      commentary:
        'カテゴリ別にスキルを整理しました。各技術の習熟度もご確認いただけます。',
    },
    {
      templateId: 'skills-matrix',
      dataTools: [{ toolName: 'getSkills', output: skills }],
      commentary:
        '経験年数とレベルの2軸でスキルをマッピングしています。',
    },
  ],

  career: [
    {
      templateId: 'career-vertical-timeline',
      dataTools: [{ toolName: 'getCareer', output: career }],
      commentary:
        '職歴をタイムライン形式でまとめました。各ポジションでの経験が見えます。',
    },
    {
      templateId: 'career-horizontal-timeline',
      dataTools: [{ toolName: 'getCareer', output: career }],
      commentary:
        'キャリアの流れを横型タイムラインで表示しています。',
    },
    {
      templateId: 'career-company-cards',
      dataTools: [{ toolName: 'getCareer', output: career }],
      commentary:
        '会社ごとのカード形式で経歴を紹介します。各社での成果もご覧ください。',
    },
    {
      templateId: 'career-journey',
      dataTools: [{ toolName: 'getCareer', output: career }],
      commentary:
        'キャリアジャーニーとしてストーリー形式で表現しました。',
    },
  ],

  values: [
    {
      templateId: 'values-quote-card',
      dataTools: [{ toolName: 'getValues', output: values }],
      commentary:
        '大切にしている価値観をまとめました。技術だけでなく、ビジョンも見ていただけると嬉しいです。',
    },
    {
      templateId: 'values-manifesto',
      dataTools: [{ toolName: 'getValues', output: values }],
      commentary:
        'マニフェスト形式で信念を表現しています。次世代のWebに対するビジョンです。',
    },
    {
      templateId: 'values-story-format',
      dataTools: [{ toolName: 'getValues', output: values }],
      commentary:
        'ストーリー形式で価値観をお伝えします。このポートフォリオ自体がそのビジョンの実証です。',
    },
  ],

  contact: [
    {
      templateId: 'contact-card',
      dataTools: [{ toolName: 'getContact', output: contact }],
      commentary:
        'お気軽にご連絡ください。GitHub、LinkedIn、メールいずれでも大丈夫です。',
    },
    {
      templateId: 'contact-minimal-links',
      dataTools: [{ toolName: 'getContact', output: contact }],
      commentary:
        '連絡先をシンプルにまとめました。どのチャネルからでもお待ちしています。',
    },
    {
      templateId: 'contact-fullscreen-cta',
      dataTools: [{ toolName: 'getContact', output: contact }],
      commentary:
        'ご興味をお持ちいただけましたら、ぜひご連絡ください。',
    },
  ],

  'about-site': [
    {
      templateId: 'text-magazine-layout',
      dataTools: [{ toolName: 'getValues', output: values }],
      commentary:
        'このポートフォリオは「AIキャンバス方式」を採用しています。従来のWebサービスはユーザーがページを移動して機能を使う方式ですが、次世代SaaSではトップページ1枚にAIを配置し、自然言語入力に対してAIがUI生成まで一貫して行います。このサイト自体がその概念実証です。\n\n技術スタックはNext.js 16 + Vercel AI SDK + Gemini 2.5 Flash + Framer Motion。30以上のデザインテンプレートをAIが質問に応じて選択し、毎回異なるビジュアルで情報を提示します。',
    },
    {
      templateId: 'text-centered-prose',
      dataTools: [{ toolName: 'getValues', output: values }],
      commentary:
        'このサイトはAIチャットボットファーストのポートフォリオです。ページ遷移は一切なく、あなたの質問に応じてAIがデザインそのものをリアルタイムに生成します。\n\n「次世代SaaSのUI/UX」の概念実証として開発しました。将来のWebサービスは、ユーザーがページを探し回るのではなく、AIに話しかけるだけで必要な情報が最適な形で提示される — そんな世界観を体現しています。',
    },
    {
      templateId: 'text-qa-format',
      dataTools: [{ toolName: 'getValues', output: values }],
      commentary:
        '**Q: このサイトはどう動いているの？**\n\nAIがあなたの質問を理解し、30以上のデザインテンプレートから最適なものを選んで表示しています。技術的にはNext.js + Vercel AI SDK + Gemini 2.5 Flashで構成されており、Function CallingでAIがテンプレートとデータを制御しています。\n\nページ遷移もスクロールもない、トップページ1枚＋AI対話のみという次世代UIの実験です。',
    },
  ],
};

/**
 * Pick a cached response for the given intent, avoiding recently used templates.
 * Returns null if all variants have been used (unlikely with enough variants).
 */
export function getCachedResponse(
  intent: IntentCategory,
  usedTemplates: string[],
): CachedResponse | null {
  const variants = responseBank[intent];
  if (!variants || variants.length === 0) return null;

  // Prefer templates not yet used in this session
  const unused = variants.filter((v) => !usedTemplates.includes(v.templateId));
  const pool = unused.length > 0 ? unused : variants;

  // Random pick from the pool
  return pool[Math.floor(Math.random() * pool.length)];
}
