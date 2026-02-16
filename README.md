# AI Canvas Portfolio

AIが動的にUIを生成するポートフォリオサイト。従来の「ページ遷移型」を排除し、トップページ1枚 + AIチャットのみで構成。ユーザーの入力に応じてAIがテンプレートを選択し、コンテンツを動的に表示する。

## コンセプト

- **AIキャンバス方式**: 入力欄に何でも入力すると、白紙のキャンバスがリッチなデザインに変身
- **二度と同じ体験に出会えない**: テンプレート × ビジュアルランダム化 × AI応答変化 = 無限の組み合わせ
- **このサイト自体がポートフォリオ**: 次世代SaaS UI/UXの概念実証

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router, Turbopack) |
| 言語 | TypeScript (strict) |
| スタイリング | Tailwind CSS v4 |
| AI | Vercel AI SDK + Google Gemini 2.5 Flash |
| アニメーション | Framer Motion 12 + CSS @keyframes |
| マークダウン | react-markdown + remark-gfm |
| デプロイ | Vercel |

## セットアップ

```bash
npm install
```

`.env.local` を作成:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

## 開発

```bash
npm run dev
```

http://localhost:3000 で確認。

## StaticFallback

API接続エラー時やオフライン環境では、空間配置型のStaticFallbackが表示される。

- 太陽系的な軌道配置でプロフィール情報を空間的に展示
- ホバーでノードが展開、クリックでズームイン詳細表示
- パララックス、パーティクル、ニューラルラインによる没入感

## ドキュメント

- [PLAN.md](PLAN.md) — 実装計画書
- [docs/design-principles.md](docs/design-principles.md) — デザイン原則・実装ガイドライン
