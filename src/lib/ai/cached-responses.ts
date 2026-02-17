/**
 * Pre-generated response bank.
 * Each intent category has multiple variants (template + commentary).
 * The system picks one that hasn't been recently used, ensuring variety.
 *
 * Commentary rules:
 * - Never describe the template format ("タイムライン形式で", "カード形式で" etc.)
 * - Provide genuine insights, context, or personality that the visual can't convey
 * - Write as a person sharing their story, not as a UI narrating itself
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
        'フルスタックの中でも特にフロントエンドとUX設計に情熱を持っています。気になる点があれば、もっと詳しくお話しできますよ。',
    },
    {
      templateId: 'profile-centered-bio',
      dataTools: [{ toolName: 'getProfile', output: profile }],
      commentary:
        '技術とデザインの両方を追求するエンジニアです。「使って気持ちいい」を基準にものづくりをしています。',
    },
    {
      templateId: 'profile-card-stack',
      dataTools: [{ toolName: 'getProfile', output: profile }],
      commentary:
        'エンジニアリングだけでなく、プロダクト全体を見渡せる視点を大切にしています。',
    },
    {
      templateId: 'profile-full-portrait',
      dataTools: [{ toolName: 'getProfile', output: profile }],
      commentary:
        '何でもお気軽に聞いてください。技術スキルやプロジェクトの詳細もお話しできます。',
    },
  ],

  projects: [
    {
      templateId: 'projects-horizontal-slider',
      dataTools: [{ toolName: 'getProjects', output: projects }],
      commentary:
        'それぞれのプロジェクトが異なる技術的チャレンジを解決しています。特に興味のあるものがあれば詳しく聞いてください。',
    },
    {
      templateId: 'projects-grid-gallery',
      dataTools: [{ toolName: 'getProjects', output: projects }],
      commentary:
        '個人開発からチーム開発まで、規模も技術スタックも多様なプロジェクトに取り組んできました。',
    },
    {
      templateId: 'projects-spotlight',
      dataTools: [{ toolName: 'getProjects', output: projects }],
      commentary:
        '技術選定からUI設計、実装まで一貫して手がけたプロジェクトです。',
    },
    {
      templateId: 'projects-timeline',
      dataTools: [{ toolName: 'getProjects', output: projects }],
      commentary:
        '新しいプロジェクトごとに技術の幅を広げてきました。最近はAIとフロントエンドの融合に注力しています。',
    },
    {
      templateId: 'projects-showcase-stack',
      dataTools: [{ toolName: 'getProjects', output: projects }],
      commentary:
        'どのプロジェクトも「ユーザーにとって本当に価値があるか」を基準に設計しています。',
    },
  ],

  skills: [
    {
      templateId: 'skills-bar-chart',
      dataTools: [{ toolName: 'getSkills', output: skills }],
      commentary:
        'フロントエンドが最も得意な領域ですが、バックエンドやインフラも一通りカバーしています。',
    },
    {
      templateId: 'skills-radar-chart',
      dataTools: [{ toolName: 'getSkills', output: skills }],
      commentary:
        'React + TypeScriptを軸に、必要に応じて技術スタックを柔軟に選べるのが強みです。',
    },
    {
      templateId: 'skills-tag-cloud',
      dataTools: [{ toolName: 'getSkills', output: skills }],
      commentary:
        '新しい技術を試すのが好きで、プロジェクトごとに最適な選択をするよう心がけています。',
    },
    {
      templateId: 'skills-category-cards',
      dataTools: [{ toolName: 'getSkills', output: skills }],
      commentary:
        '各技術は実際のプロジェクトで使い込んで身につけたものです。机上の知識ではありません。',
    },
    {
      templateId: 'skills-matrix',
      dataTools: [{ toolName: 'getSkills', output: skills }],
      commentary:
        '経験の深さと幅のバランスを意識してスキルを磨いてきました。',
    },
  ],

  career: [
    {
      templateId: 'career-vertical-timeline',
      dataTools: [{ toolName: 'getCareer', output: career }],
      commentary:
        '各ポジションで新しい挑戦を求め、技術的な成長を続けてきました。',
    },
    {
      templateId: 'career-horizontal-timeline',
      dataTools: [{ toolName: 'getCareer', output: career }],
      commentary:
        'キャリアを通じて一貫しているのは、ユーザー体験への強いこだわりです。',
    },
    {
      templateId: 'career-company-cards',
      dataTools: [{ toolName: 'getCareer', output: career }],
      commentary:
        'それぞれの環境で異なるスケールの課題に取り組み、視野を広げてきました。',
    },
    {
      templateId: 'career-journey',
      dataTools: [{ toolName: 'getCareer', output: career }],
      commentary:
        '技術だけでなく、チーム開発やプロダクト思考も経験の中で培ってきました。',
    },
  ],

  values: [
    {
      templateId: 'values-quote-card',
      dataTools: [{ toolName: 'getValues', output: values }],
      commentary:
        '技術は手段であり、目的はユーザーの体験を良くすること。その信念がすべての開発の根底にあります。',
    },
    {
      templateId: 'values-manifesto',
      dataTools: [{ toolName: 'getValues', output: values }],
      commentary:
        '次世代のWebは、ユーザーが探し回るのではなく、必要な情報が自然に届く世界。このサイト自体がそのビジョンの実証です。',
    },
    {
      templateId: 'values-story-format',
      dataTools: [{ toolName: 'getValues', output: values }],
      commentary:
        'コードを書くだけでなく、「なぜ作るのか」を常に考えるエンジニアでありたいと思っています。',
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
        'どのチャネルからでもお待ちしています。お気軽にどうぞ。',
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
        'ページ遷移は一切なく、あなたの質問に応じてAIがデザインそのものをリアルタイムに生成します。\n\n将来のWebサービスは、ユーザーがページを探し回るのではなく、AIに話しかけるだけで必要な情報が最適な形で提示される — そんな世界観を体現しています。',
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
