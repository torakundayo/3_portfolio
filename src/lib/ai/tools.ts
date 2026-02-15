import { tool } from 'ai';
import { z } from 'zod';
import profile from '@/data/profile.json';
import career from '@/data/career.json';
import skills from '@/data/skills.json';
import projects from '@/data/projects.json';
import values from '@/data/values.json';
import contact from '@/data/contact.json';

export const tools = {
  getProfile: tool({
    description: 'プロフィール・自己紹介情報を取得する',
    inputSchema: z.object({}),
    execute: async () => profile,
  }),

  getCareer: tool({
    description: '職歴・経歴情報を取得する',
    inputSchema: z.object({}),
    execute: async () => career,
  }),

  getSkills: tool({
    description: '技術スキル一覧を取得する。カテゴリ指定で絞り込み可能',
    inputSchema: z.object({
      category: z.string().optional().describe('絞り込むカテゴリ名（例: フロントエンド）'),
    }),
    execute: async ({ category }) => {
      if (category) {
        return skills.categories.filter(c =>
          c.name.ja.includes(category) || c.name.en.toLowerCase().includes(category.toLowerCase())
        );
      }
      return skills;
    },
  }),

  getProjects: tool({
    description: '開発実績一覧を取得する',
    inputSchema: z.object({}),
    execute: async () => projects,
  }),

  getValues: tool({
    description: '価値観・信念・将来のビジョンを取得する',
    inputSchema: z.object({}),
    execute: async () => values,
  }),

  getContact: tool({
    description: '連絡先情報を取得する',
    inputSchema: z.object({}),
    execute: async () => contact,
  }),

  renderTemplate: tool({
    description: 'ページに表示するデザインテンプレートを指定する。必ず毎回呼び出すこと。同じテンプレートの連続使用は避ける',
    inputSchema: z.object({
      templateId: z.string().describe('表示するテンプレートのID（例: projects-horizontal-slider）'),
    }),
    execute: async ({ templateId }) => templateId,
  }),
};
