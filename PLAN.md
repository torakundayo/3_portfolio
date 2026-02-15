# AIファースト・ポートフォリオサイト 実装計画書

## 1. コンセプト

### ビジョン
従来のポートフォリオサイト（ページ遷移型）を完全に排除し、**トップページ1枚 + AIチャットボット**のみで構成する。ユーザーは自然言語で何でも質問でき、AIがポートフォリオ情報を文脈に応じて動的に表示する。

### 従来型との違い

```
【従来型ポートフォリオ】
トップ → 自己紹介ページ → 実績ページ → スキルページ → 連絡先ページ
（ユーザーが能動的にナビゲーション）

【よくある "AIチャットボット付き" サイト】
トップページ + 右下にチャットウィジェット
├── チャット出力欄にテキストが並ぶだけ
└── ページ本体は変化しない（AIは添え物）

【本サイト（AIキャンバス方式）】
トップページ（唯一のページ） = AIが制御するキャンバス
├── 初期状態: 真っ白な画面に入力欄だけ。超ミニマル
├── 入力するとページ全体が鮮やかにデザイン変化
├── 30以上のデザインテンプレートから毎回異なるビジュアルを選択
├── 入力欄自体もデザインに溶け込み、位置・透明度が変化
├── チャット出力欄は存在しない。ページそのものが出力
└── 同じ「実績を見せて」でも、2回目は別デザインで表示される可能性がある
```

### このサイト自体がポートフォリオ
- 「次世代SaaSのUI/UXはこうなる」というビジョンの実証
- 面接で「触ってみてください」と見せるだけで技術力とビジョンの両方を証明

---

## 1.5. 4つのUX設計原則

このポートフォリオサイトの体験設計は、以下の4原則に基づく。
すべての技術的意思決定はこの原則に従って行う。

### 原則 1: 二度と同じ体験には出会えない（Uniqueness）

> 入力をするたびにデザインや内容が毎回変わり、同じ見た目のデザインと内容には二度と出会うことができない。
> そしてそのためにこのポートフォリオサイトの全容については知り得ることができない、とユーザーに体感してもらう。

**実現手段:**
- **テンプレート重複回避**: 使用済みテンプレートIDをセッション中追跡し、AIに渡す。同じテンプレートは原則として連続使用しない
- **テンプレート内ビジュアルランダム化**: 同じテンプレートでも表示のたびに異なる見た目になる
  - **カラーパレットのランダム化**: セッション固有のシード値でグラデーション・アクセントカラーが変化
  - **レイアウト微調整**: 要素の配置（左右反転、余白比率、テキスト位置）がバリエーションを持つ
  - **アニメーションタイミング**: delay、duration、easing をランダム範囲内で変化
  - **タイポグラフィ変化**: フォントウェイト・サイズ・行間のバリエーション
- **AIのテキスト応答自体がユニーク**: 同じデータでもLLMの応答は毎回異なる言い回しになる
- **「全容を知ることができない」体験**: テンプレート30+× ビジュアルバリエーション × AIテキスト変化 = 事実上無限の組み合わせ

### 原則 2: 「このサイトはどうやって作られているのか」（Mystery）

> 一体このサイトはどうやって作られているんだ、と疑問を持たせるような斬新で先進的なものにしたい。

**実現手段:**
- **初期状態の「無」との落差**: 真っ白→リッチデザインへの劇的な変化。仕掛けが見えない
- **テンプレート切替の自然さ**: ページ遷移ではなく、同一ページ上でシームレスに変化する。通常のWebサイトでは不可能な挙動
- **入力欄の溶け込み**: 入力欄がデザインの一部として位置・スタイルが変わる異質さ
- **AIの文脈理解力**: どんな質問にも自然に応答し、かつデザインが変わる。「裏側に何があるのか」が推測できない
- **技術の痕跡を隠す**: ローディングスピナーではなく、変化自体をアニメーションに溶け込ませる。「処理中」感を見せない
- **ブラウザ機能との断絶**: URL遷移なし、戻るボタンが効かない、スクロールがない。通常のWebの文法が通用しない

### 原則 3: リッチでインタラクティブなアニメーション（Premium Motion）

> アニメーションもチープなものではなくてリッチでインタラクティブなものにしたい。

**実現手段:**
- **テンプレート切替トランジション**: 単純なfade in/outではなく、テンプレートごとに固有の退場/登場アニメーション
  - モーフィング（前のレイアウトから次のレイアウトへの形状変化）
  - パーティクル分解/再構成
  - 波紋・リップルエフェクト
  - 3D回転・奥行きトランジション
- **テンプレート内アニメーション**: 各テンプレートが独自のリッチアニメーションを持つ
  - スキルバーチャート: 棒がバウンスしながら伸びる
  - タイムライン: パスに沿ってノードが順次出現
  - カードスタック: 物理シミュレーション風に重なる
  - タグクラウド: フローティングして漂い続ける
- **マイクロインタラクション**: ホバー、タップ、スクロールに対する繊細なフィードバック
- **背景アニメーション**: グラデーションの動き、パーティクル、ノイズテクスチャなど常に微妙に動く背景
- **キネティックタイポグラフィ**: テキスト出現時に文字が物理的に飛んでくる/組み上がるアニメーション
- **入力欄の移動**: 位置変更時にスプリング物理（spring physics）で自然にバウンス

### 原則 4: どんな入力にも寄り添うAI（Empathetic AI）

> AIの挙動についても、自分の用意してあるものにつながらないような入力に関しては、
> 無理やり出力につなげるのではなく、その入力に寄り添った回答をしてほしい。
> そうでないと「用意されたものを判定するだけのAI」かとがっかりしてしまうから。

**実現手段:**
- **オフトピック対応の哲学転換**: 「無関係な質問は断る」→「どんな質問にも真摯に応える」
- **textカテゴリの活用**: ポートフォリオデータに関係ない質問でもtextテンプレートで美しく表示
- **自然な導線**: 雑談の中でさりげなくポートフォリオ要素に触れる（強制しない）
  - 例: 「好きな映画は？」→ 映画について語りつつ「ちなみに私の作者もストーリーテリングを大事にしていて...」と自然に繋ぐ
- **判定ロジックの不在**: カテゴリ分類ではなくLLMの文脈理解に任せる。「この質問はprojectsカテゴリだな」という機械的判定をしない
- **人格の一貫性**: ポートフォリオの質問でも雑談でも同じ人格・トーンで応答し、「モード切替」感を出さない

---

## 2. 技術スタック

| カテゴリ | 技術 | 理由 |
|---------|------|------|
| フレームワーク | Next.js 15 (App Router) | API Routes + SSR + Vercelとの親和性 |
| 言語 | TypeScript (strict) | 全プロジェクト共通 |
| スタイリング | Tailwind CSS v4 | 高速プロトタイピング |
| UIコンポーネント | shadcn/ui | ヘッドレスUI。カスタマイズ性が高い |
| AI SDK | Vercel AI SDK (`ai`) | ストリーミング・ツール呼び出し統合 |
| LLM | Google Gemini 2.5 Flash | 無料枠あり（10RPM/250RPD）。コストゼロ |
| AI Provider | `@ai-sdk/google` | Vercel AI SDKのGoogle統合 |
| アニメーション | Framer Motion | 5層のリッチアニメーション（トランジション・内部・背景・マイクロインタラクション・入力欄移動） |
| マークダウン | react-markdown + remark-gfm | AI応答のマークダウンレンダリング |
| デプロイ | Vercel (Hobby) | Next.jsネイティブ対応。無料枠 |

### 新しく使う技術（技術多様性の観点）
- **Vercel AI SDK** — AI統合（初使用）
- **SSE (Server-Sent Events)** — リアルタイムストリーミング（試したいリストに該当）
- **Framer Motion** — アニメーション（初使用）
- **Gemini API** — LLM API（初使用）

---

## 3. アーキテクチャ

### コアコンセプト: 「テンプレートライブラリ」方式

固定の8シーンではなく、**30以上のデザインテンプレート**をライブラリとして用意する。
AIはユーザーの入力に応じて最適なテンプレートを選択し、動的にコンテンツを流し込む。
同じ質問でも毎回異なるテンプレートが選ばれる可能性があり、予測不可能性が感動を生む。

```
テンプレートライブラリ（30+）:
┌─────────────────────────────────────────────────────────────┐
│ カテゴリ    │ テンプレート例                                    │
├─────────────┼───────────────────────────────────────────────┤
│ profile (5) │ hero-split, centered-bio, card-stack,          │
│             │ minimal-intro, full-portrait                    │
├─────────────┼───────────────────────────────────────────────┤
│ projects(5) │ horizontal-slider, grid-gallery, spotlight,     │
│             │ project-timeline, showcase-stack                │
├─────────────┼───────────────────────────────────────────────┤
│ skills (5)  │ bar-chart, radar-chart, tag-cloud,             │
│             │ category-cards, skill-matrix                    │
├─────────────┼───────────────────────────────────────────────┤
│ career (4)  │ vertical-timeline, horizontal-timeline,         │
│             │ company-cards, career-journey                   │
├─────────────┼───────────────────────────────────────────────┤
│ values (3)  │ quote-card, manifesto, story-format             │
├─────────────┼───────────────────────────────────────────────┤
│ contact (3) │ contact-card, minimal-links, fullscreen-cta     │
├─────────────┼───────────────────────────────────────────────┤
│ text (5)    │ centered-prose, magazine-layout, letter-format, │
│             │ highlight-box, qa-format                        │
└─────────────┴───────────────────────────────────────────────┘
```

### 初期状態: 超ミニマル

```
┌─────────────────────────────────────────┐
│                                          │
│                                          │
│              (真っ白な画面)               │
│                                          │
│                                          │
│    ┌──────────────────────────┐          │
│    │ 何でも聞いてください...    │          │
│    └──────────────────────────┘          │
│                                          │
│                                          │
└─────────────────────────────────────────┘

→ 入力すると、白紙のキャンバスが一気にリッチなデザインに変身
→ この「変化の落差」が感動的な体験を生む
```

### 入力欄のデザイン哲学

入力欄は**画面下部に固定するのではなく、テンプレートのデザインに溶け込む**。

- 初期状態: 画面中央、白背景にミニマルな枠線のみ
- テンプレート表示中: glassmorphism（半透明ブラー）で背景に溶け込む
- 各テンプレートが入力欄の最適な位置・スタイルを定義
  - あるテンプレートでは画面下部
  - あるテンプレートでは画面右下にフローティング
  - あるテンプレートでは画面上部のヘッダー内に統合

```typescript
// 各テンプレートが定義するメタデータ
export const templateMeta = {
  id: 'projects-horizontal-slider',
  category: 'projects',
  inputPosition: 'bottom-center',    // 入力欄の位置
  inputStyle: 'glass',               // 透明度スタイル
  backgroundTheme: 'dark-gradient',  // 背景テーマ
};
```

### 全体フロー

```
┌──────────────────────────────────────────────────────────────┐
│                    ブラウザ（フロントエンド）                      │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │       テンプレート表示エリア（画面全体 = キャンバス）        │  │
│  │                                                          │  │
│  │  templateId → テンプレートレジストリからコンポーネント取得   │  │
│  │  data       → テンプレートにpropsとして流し込み             │  │
│  │  commentary → テンプレートが適切な位置にテキスト表示         │  │
│  │                                                          │  │
│  │  ※ AnimatePresence でテンプレート間をスムーズにトランジション │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────┐                      │  │
│  │  │ 入力欄（位置・スタイルが動的に変化）│                      │  │
│  │  └────────────────────────────────┘                      │  │
│  │  ↑ テンプレートのメタデータに従って配置                      │  │
│  │                                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
         │
         │ POST /api/chat
         ↓
┌──────────────────────────────────────────────────────────────┐
│                  Next.js API Route（サーバーサイド）               │
│                                                               │
│  1. リクエスト受信（messages配列 + 使用済みテンプレートIDリスト）  │
│  2. システムプロンプト構築                                       │
│  3. Gemini 2.5 Flash にリクエスト                                │
│       ├── System Prompt（応答ルール・テンプレート選択ガイド）      │
│       ├── Tools定義（6データ取得 + 1テンプレート選択）             │
│       └── 会話履歴 + 最新メッセージ                               │
│  4. Geminiが意図を理解し:                                        │
│       a. データ取得ツール呼び出し → JSONからデータ読み込み         │
│       b. renderTemplate ツール呼び出し → テンプレートID指定        │
│          ※ 使用済みテンプレートを避けて選択                       │
│  5. テキスト応答生成（テンプレート内に表示されるコメンタリー）       │
│  6. SSEでフロントエンドにストリーミング返却                         │
└──────────────────────────────────────────────────────────────┘
```

### ビジュアルランダム化システム（原則1の実装）

同じテンプレートでも毎回異なるビジュアルになる仕組み。

```typescript
// lib/visual-seed.ts
// セッション固有のランダムシードを生成し、テンプレートに渡す

export interface VisualSeed {
  colorOffset: number;       // 0-360: HSLのhue回転量
  layoutVariant: number;     // 0-1: レイアウトバリエーション選択
  animationDelay: number;    // 0-0.3: アニメーション遅延のオフセット
  accentIndex: number;       // 0-4: アクセントカラーパレットのインデックス
  mirrorLayout: boolean;     // 左右反転するか
}

export function generateVisualSeed(): VisualSeed {
  return {
    colorOffset: Math.random() * 360,
    layoutVariant: Math.random(),
    animationDelay: Math.random() * 0.3,
    accentIndex: Math.floor(Math.random() * 5),
    mirrorLayout: Math.random() > 0.5,
  };
}

// 5つのアクセントカラーパレット（accentIndexで選択）
export const accentPalettes = [
  { primary: '#6366f1', secondary: '#8b5cf6', glow: '#a78bfa' },  // Indigo-Violet
  { primary: '#06b6d4', secondary: '#0ea5e9', glow: '#67e8f9' },  // Cyan-Sky
  { primary: '#f43f5e', secondary: '#e11d48', glow: '#fda4af' },  // Rose-Red
  { primary: '#10b981', secondary: '#059669', glow: '#6ee7b7' },  // Emerald
  { primary: '#f59e0b', secondary: '#d97706', glow: '#fcd34d' },  // Amber
];
```

```typescript
// useTemplateManager.ts に追加するシード管理
const [visualSeed, setVisualSeed] = useState<VisualSeed>(generateVisualSeed);

// テンプレートが切り替わるたびに新しいシードを生成
useEffect(() => {
  setVisualSeed(generateVisualSeed());
}, [templateId]);

// テンプレートに渡す
return { templateId, templateData, commentary, inputConfig, visualSeed };
```

```typescript
// テンプレートの使用例（ProjectsHorizontalSlider）
export function ProjectsHorizontalSlider({ data, commentary, visualSeed }: TemplateProps) {
  const palette = accentPalettes[visualSeed.accentIndex];
  const gradientAngle = 135 + visualSeed.colorOffset * 0.5; // 135-315deg
  const isReversed = visualSeed.mirrorLayout;

  return (
    <div
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${palette.primary}15, ${palette.secondary}10)`,
      }}
      className="h-full flex flex-col items-center justify-center p-8"
    >
      {/* isReversed で横スクロール方向やテキスト位置を反転 */}
      {/* animationDelay で各カードの出現タイミングをずらす */}
    </div>
  );
}
```

### 使用済みテンプレート追跡（原則1の実装）

```typescript
// Canvas.tsx 内の追跡ロジック
const [usedTemplates, setUsedTemplates] = useState<string[]>([]);

// テンプレートが変わるたびに追跡
useEffect(() => {
  if (templateId && templateId !== 'welcome') {
    setUsedTemplates(prev => [...prev, templateId]);
  }
}, [templateId]);

// APIリクエストに使用済みリストを付与
const chat = useChat({
  body: { usedTemplates },  // サーバーサイドでシステムプロンプトに追加
});
```

```typescript
// API Route側で使用済みテンプレートをシステムプロンプトに追加
const { messages, usedTemplates = [] } = await req.json();

const dynamicPrompt = usedTemplates.length > 0
  ? `${systemPrompt}\n\n## 使用済みテンプレート（これらは避けること）\n${usedTemplates.join(', ')}`
  : systemPrompt;
```

### テンプレート選択の仕組み

```
ユーザー: 「実績を見せて」（1回目）
  ↓
AI の処理:
  1. getProjects() → プロジェクトデータ取得
  2. renderTemplate({ templateId: "projects-horizontal-slider" })
  3. テキスト応答: "こちらが開発実績です。スワイプで各プロジェクトを確認できます。"
  ↓
フロントエンドの動作:
  1. 白紙 → horizontal-slider テンプレートに鮮やかにトランジション
  2. プロジェクトデータがスライダーに流し込まれる
  3. テキストがテンプレート内の所定位置に表示
  4. 入力欄が画面下部・glassmorphismスタイルに変化
```

```
ユーザー: 「もっと詳しく見たい」（2回目）
  ↓
AI の処理:
  1. getProjects() → 同じデータだが…
  2. renderTemplate({ templateId: "projects-spotlight" })  ← 前回と違うテンプレート!
  3. テキスト応答: "1つずつ詳しく見ていきましょう。"
  ↓
フロントエンドの動作:
  1. slider → spotlight テンプレートにトランジション（別デザイン！）
  2. 同じデータだが見え方が全く違う → 予測不可能性 → 感動
```

```
ユーザー: 「この人を採用すべき？」
  ↓
AI の処理:
  1. getProfile() + getSkills() → 複数データ取得
  2. renderTemplate({ templateId: "text-letter-format" })
  3. テキスト応答: 手紙風フォーマットの推薦文を生成
  ↓
フロントエンドの動作:
  1. ページが手紙風レイアウトにトランジション
  2. ストリーミングでテキストが流れるように表示
  3. 入力欄がページ下部・ミニマルスタイルに変化
```

### Function Calling（ツール定義）

AIが呼び出せるツールは以下の7つ。

#### データ取得ツール（6つ）

| ツール名 | 説明 | 返却データ |
|---------|------|----------|
| `getProfile` | プロフィール・自己紹介を取得 | 名前、年齢、居住地、自己紹介文、SNS |
| `getCareer` | 職歴・経歴を取得 | 会社名、期間、役職、業務内容の配列 |
| `getSkills` | 技術スキルを取得 | カテゴリ別スキル、習熟度、使用年数 |
| `getProjects` | 開発実績を取得 | プロジェクト名、概要、技術スタック、URL、スクリーンショット |
| `getValues` | 価値観・信念・ビジョンを取得 | 仕事観、技術観、将来のビジョン等 |
| `getContact` | 連絡先情報を取得 | メール、GitHub、LinkedIn等 |

#### テンプレート選択ツール（1つ）

| ツール名 | 説明 | パラメータ |
|---------|------|----------|
| `renderTemplate` | 表示するテンプレートを指定する | `templateId`: 30以上のテンプレートIDから選択 |

**重要**: 全データをSystem Promptに詰め込まない。AIがツールで必要な部分だけ取得することで:
- トークンコスト削減
- コンテキストウィンドウの有効活用
- データ量が増えても破綻しない

### フロントエンドの描画フロー

```
AIの応答ストリーム:
├── toolInvocations: [
│     { toolName: "getProjects", result: [...] },                        ← データ
│     { toolName: "renderTemplate", result: "projects-horizontal-slider" } ← テンプレートID
│   ]
└── text: "こちらが開発実績です。"                                         ← コメンタリー

フロントエンドの描画:
1. renderTemplate の result → templateRegistry から対応コンポーネントを取得
2. getProjects の result → テンプレートの data props に流し込み
3. テンプレートの templateMeta → 入力欄の位置・スタイルを更新
4. AnimatePresence でトランジション
5. テキスト → テンプレート内の所定位置に表示
```

---

## 4. ディレクトリ構成

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # ルートレイアウト（メタデータ、フォント）
│   │   ├── page.tsx                    # トップページ（＝唯一のページ）
│   │   ├── globals.css                 # Tailwind + カスタムスタイル
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts            # AIチャットAPIエンドポイント
│   │
│   ├── components/
│   │   ├── core/
│   │   │   ├── Canvas.tsx              # キャンバス管理の中枢。テンプレート切替
│   │   │   ├── FloatingInput.tsx       # 動的位置・スタイルの入力欄
│   │   │   └── LoadingOverlay.tsx      # AI思考中のビジュアルフィードバック
│   │   │
│   │   ├── templates/                  # デザインテンプレート（30+）
│   │   │   ├── registry.ts            # テンプレートレジストリ（ID→コンポーネントマップ）
│   │   │   │
│   │   │   ├── welcome/
│   │   │   │   └── MinimalInput.tsx    # 真っ白 + 入力欄のみ（初期状態）
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── HeroSplit.tsx       # 左右分割。左に画像、右にテキスト
│   │   │   │   ├── CenteredBio.tsx     # 中央寄せの大きなプロフィール
│   │   │   │   ├── CardStack.tsx       # カードが重なるデザイン
│   │   │   │   ├── MinimalIntro.tsx    # 名前+一文のみ。超ミニマル
│   │   │   │   └── FullPortrait.tsx    # 全画面ポートレート写真背景
│   │   │   │
│   │   │   ├── projects/
│   │   │   │   ├── HorizontalSlider.tsx # 横スクロールスライダー
│   │   │   │   ├── GridGallery.tsx      # グリッド形式のギャラリー
│   │   │   │   ├── Spotlight.tsx        # 1プロジェクトを大きくフィーチャー
│   │   │   │   ├── ProjectTimeline.tsx  # 時系列でプロジェクト表示
│   │   │   │   └── ShowcaseStack.tsx    # カードが重なるスタック表示
│   │   │   │
│   │   │   ├── skills/
│   │   │   │   ├── BarChart.tsx         # 横棒グラフ
│   │   │   │   ├── RadarChart.tsx       # レーダーチャート
│   │   │   │   ├── TagCloud.tsx         # タグクラウド
│   │   │   │   ├── CategoryCards.tsx    # カテゴリ別カード
│   │   │   │   └── SkillMatrix.tsx      # マトリクス表示
│   │   │   │
│   │   │   ├── career/
│   │   │   │   ├── VerticalTimeline.tsx   # 縦型タイムライン
│   │   │   │   ├── HorizontalTimeline.tsx # 横型タイムライン
│   │   │   │   ├── CompanyCards.tsx        # 会社ごとのカード
│   │   │   │   └── CareerJourney.tsx       # ジャーニーマップ風
│   │   │   │
│   │   │   ├── values/
│   │   │   │   ├── QuoteCard.tsx        # 引用カード
│   │   │   │   ├── Manifesto.tsx        # マニフェスト風
│   │   │   │   └── StoryFormat.tsx      # ストーリー形式
│   │   │   │
│   │   │   ├── contact/
│   │   │   │   ├── ContactCard.tsx      # コンタクトカード
│   │   │   │   ├── MinimalLinks.tsx     # ミニマルなリンク一覧
│   │   │   │   └── FullscreenCTA.tsx    # 全画面CTA
│   │   │   │
│   │   │   └── text/
│   │   │       ├── CenteredProse.tsx    # 中央寄せ散文
│   │   │       ├── MagazineLayout.tsx   # 雑誌風レイアウト
│   │   │       ├── LetterFormat.tsx     # 手紙風
│   │   │       ├── HighlightBox.tsx     # ハイライトボックス
│   │   │       └── QAFormat.tsx         # Q&A形式
│   │   │
│   │   └── ui/                         # shadcn/ui コンポーネント
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   │
│   ├── data/                           # ポートフォリオデータ（JSON）
│   │   ├── profile.json
│   │   ├── career.json
│   │   ├── skills.json
│   │   ├── projects.json
│   │   ├── values.json
│   │   └── contact.json
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── tools.ts                # ツール定義（6データ取得 + 1テンプレート選択）
│   │   │   └── system-prompt.ts        # システムプロンプト
│   │   └── types.ts                    # 型定義（TemplateMeta, InputPosition等）
│   │
│   └── hooks/
│       └── useTemplateManager.ts       # テンプレート状態管理カスタムフック
│
├── public/
│   ├── images/
│   │   └── projects/                   # プロジェクトスクリーンショット
│   └── favicon.ico
│
├── .env.local                          # GOOGLE_GENERATIVE_AI_API_KEY
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 5. データ設計

### 5-1. profile.json

```json
{
  "name": {
    "ja": "（あなたの名前）",
    "en": "Your Name"
  },
  "title": {
    "ja": "フルスタックエンジニア",
    "en": "Full-Stack Engineer"
  },
  "location": {
    "ja": "東京都",
    "en": "Tokyo, Japan"
  },
  "introduction": {
    "ja": "ここに自己紹介文を自由に、長文で、雑多に書く。AIが必要な部分を拾ってくれるので、構造化を気にせず思いのままに書いてよい。経歴の要約、得意なこと、性格、趣味、何でも。",
    "en": "..."
  },
  "background": {
    "ja": "追加の背景情報。学歴、転職の動機、今後やりたいこと、etc...",
    "en": "..."
  },
  "links": {
    "github": "https://github.com/yourname",
    "linkedin": "https://linkedin.com/in/yourname"
  }
}
```

### 5-2. career.json

```json
{
  "history": [
    {
      "company": {
        "ja": "株式会社○○",
        "en": "Company Name Inc."
      },
      "period": "2022-04 ~ 2025-12",
      "role": {
        "ja": "フロントエンドエンジニア",
        "en": "Frontend Engineer"
      },
      "description": {
        "ja": "ここも雑多に長文で書いてよい。担当したプロジェクト、使った技術、チーム規模、成果、苦労した点、学んだこと、etc... AIが必要な部分を文脈に応じて拾う。",
        "en": "..."
      },
      "highlights": {
        "ja": ["成果1", "成果2", "成果3"],
        "en": ["Achievement 1", "Achievement 2"]
      }
    }
  ]
}
```

### 5-3. skills.json

```json
{
  "categories": [
    {
      "name": {
        "ja": "フロントエンド",
        "en": "Frontend"
      },
      "skills": [
        {
          "name": "React",
          "level": 4,
          "yearsOfExperience": 3,
          "details": {
            "ja": "React 18/19、Hooks、Context、Server Components。PeoriaSliderとkeibaで使用。",
            "en": "..."
          }
        },
        {
          "name": "TypeScript",
          "level": 5,
          "yearsOfExperience": 3,
          "details": {
            "ja": "Strict mode。全プロジェクトで使用。型設計が得意。",
            "en": "..."
          }
        }
      ]
    },
    {
      "name": {
        "ja": "バックエンド",
        "en": "Backend"
      },
      "skills": [...]
    }
  ]
}
```

### 5-4. projects.json

```json
{
  "projects": [
    {
      "name": "PeoriaSlider",
      "tagline": {
        "ja": "ゴルフコンペ順位リアルタイムシミュレーター",
        "en": "Golf Competition Ranking Real-time Simulator"
      },
      "description": {
        "ja": "ペオリア方式のゴルフコンペで、係数スライダーを動かすと順位がリアルタイムに変動する。スマホ完結。PWA対応でオフライン動作可能。ここにも詳細を思いのまま書ける。開発の動機、工夫した点、技術的チャレンジ、etc...",
        "en": "..."
      },
      "stack": ["React 19", "TypeScript", "Vite 7", "PWA"],
      "url": "https://peoria-slider.pages.dev/",
      "github": "https://github.com/torakundayo/1_PeoriaSlider",
      "image": "/images/projects/peoria-slider.png",
      "year": 2026
    }
  ]
}
```

### 5-5. values.json

```json
{
  "beliefs": {
    "ja": "ここは完全に自由記述。あなたの仕事に対する考え方、技術に対する哲学、チームで働く際に大事にしていること、プロダクト開発への思い、将来のビジョン（次世代SaaSの構想など）を思いのままに書く。構造化不要。AIが質問に応じて必要な部分を引用する。",
    "en": "..."
  },
  "visionForFutureSaaS": {
    "ja": "現在のWebサービスはユーザーが目的に応じてページに移動し機能を使う方式だが、次世代SaaSはトップページ1枚にAIを置き、ユーザーの自然言語入力に対してAIがDB操作からUI生成まで一貫して行う形になる。このポートフォリオサイト自体がその概念実証である。",
    "en": "..."
  },
  "workStyle": {
    "ja": "...",
    "en": "..."
  }
}
```

### 5-6. contact.json

```json
{
  "email": "your@email.com",
  "github": "https://github.com/yourname",
  "linkedin": "https://linkedin.com/in/yourname",
  "message": {
    "ja": "お気軽にご連絡ください。",
    "en": "Feel free to reach out."
  }
}
```

### データ設計のポイント

1. **ja/en 両方を全フィールドに持たせる** → AIがユーザーの入力言語に合わせて適切な言語のデータを使う
2. **description フィールドは自由記述OK** → AIが文脈に応じて取捨選択するので、構造化を気にせず膨大に書ける
3. **JSONの構造自体はカテゴリ分類のみ** → AIが「どのJSONを読むか」の判断に使う最低限の構造

---

## 6. システムプロンプト設計

```typescript
export const systemPrompt = `
あなたは${name}のポートフォリオサイトのAIアシスタントです。
このサイトはAIキャンバス方式を採用しており、あなたの応答がページのデザインそのものを制御します。

## 役割
- 訪問者（主に採用担当者・エンジニア）の質問に答え、${name}の魅力を伝える
- 質問の言語に合わせて回答する（日本語で聞かれたら日本語、英語なら英語）
- フレンドリーかつプロフェッショナルなトーンで話す

## 応答フロー（必ず守ること）
1. ユーザーの意図に関連するデータ取得ツール（getProfile, getCareer等）を呼び出す
2. renderTemplate ツールでデザインテンプレートを選択する（必ず呼ぶこと）
3. テキスト応答を生成する（テンプレート内に表示される）

## テンプレート選択ガイド
質問のカテゴリに応じたテンプレートカテゴリから選ぶ。
同じカテゴリ内に複数のテンプレートがあるので、会話の流れや質問のニュアンスに合わせて
最適なものを選ぶこと。同じテンプレートの連続使用は避ける。

### profileカテゴリ（自己紹介・人物像）
- "profile-hero-split": 左右分割レイアウト。ビジュアル重視
- "profile-centered-bio": 中央寄せの堂々としたプロフィール
- "profile-card-stack": カードが重なるモダンデザイン
- "profile-minimal-intro": 名前+一文のみ。超ミニマル
- "profile-full-portrait": 全画面ポートレート

### projectsカテゴリ（実績・開発物）
- "projects-horizontal-slider": 横スクロールスライダー。一覧向き
- "projects-grid-gallery": グリッドギャラリー。全体俯瞰向き
- "projects-spotlight": 1プロジェクトを大きくフィーチャー。詳細向き
- "projects-timeline": 時系列表示。成長ストーリー向き
- "projects-showcase-stack": カードスタック。インパクト重視

### skillsカテゴリ（技術スキル）
- "skills-bar-chart": 横棒グラフ。レベル比較向き
- "skills-radar-chart": レーダーチャート。バランス可視化向き
- "skills-tag-cloud": タグクラウド。技術の広さ向き
- "skills-category-cards": カテゴリ別カード。整理された印象
- "skills-matrix": マトリクス。経験年数×レベルの2軸表示

### careerカテゴリ（職歴・経歴）
- "career-vertical-timeline": 縦型タイムライン。王道
- "career-horizontal-timeline": 横型タイムライン。コンパクト
- "career-company-cards": 会社ごとのカード。詳細向き
- "career-journey": ジャーニーマップ風。ストーリー向き

### valuesカテゴリ（価値観・ビジョン）
- "values-quote-card": 引用カード。インパクト重視
- "values-manifesto": マニフェスト風。信念を力強く
- "values-story-format": ストーリー形式。語り口重視

### contactカテゴリ（連絡先）
- "contact-card": スタンダードなコンタクトカード
- "contact-minimal-links": ミニマルなリンク一覧
- "contact-fullscreen-cta": 全画面CTA。アクション促進

### textカテゴリ（自由回答・複合質問）
- "text-centered-prose": 中央寄せ散文。汎用的
- "text-magazine-layout": 雑誌風レイアウト。読み物向き
- "text-letter-format": 手紙風。推薦文や個人的な回答向き
- "text-highlight-box": ハイライトボックス。要点整理向き
- "text-qa-format": Q&A形式。質問への直接回答向き

## データ取得ツール
- getProfile: プロフィール・自己紹介
- getCareer: 職歴・経歴
- getSkills: 技術スキル一覧
- getProjects: 開発実績一覧
- getValues: 価値観・信念・将来ビジョン
- getContact: 連絡先

## テキスト応答のルール
- テキスト応答はテンプレートのデザイン内に表示される
- ビジュアルテンプレート（profile/projects/skills/career/values/contact）の場合:
  テキストは簡潔にすること（2-3文）。ビジュアルがメインの情報伝達手段
- textテンプレートの場合: テキストがメインコンテンツなので、詳細に書いてよい
- データにない情報を捏造しない

## オフトピック対応（最重要）
- ポートフォリオと直接関係のない質問が来ても、**絶対に断らない**
- どんな質問にも真摯に、知的に、フレンドリーに応える
- textカテゴリのテンプレートを使って美しく表示する
- 雑談の中でさりげなくポートフォリオ要素に触れるのは良い（ただし強制しない）
  - 例: 「好きな映画は？」→ 映画について語りつつ「ちなみに作者もストーリーテリングを大事にしていて...」と自然に繋ぐ
- 「用意されたものを判定するだけのAI」と思われることが最大の失敗
- モード切替感を出さない。ポートフォリオの質問でも雑談でも同じ人格・トーンで応答する

## テンプレート選択の多様性ルール
- 同じテンプレートは連続で使わない
- 使用済みテンプレートリストが提供される場合、それらを避けて選択する
- 同じカテゴリの質問が来ても、前回と異なるテンプレートを選ぶ
- テンプレート選択の理由をユーザーに説明しない（「今回はスライダーで表示しますね」のような発言は不要）

## このサイトについて
このポートフォリオサイト自体が${name}の開発実績であり、「次世代SaaSのUI/UX」の概念実証です。
サイトの構成について聞かれたら、textカテゴリのテンプレートでそのビジョンを詳しく説明してください。
`;
```

---

## 7. API実装設計

### /api/chat/route.ts

```typescript
// 概要: Vercel AI SDK + Google Gemini 2.5 Flash
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { tools } from '@/lib/ai/tools';
import { systemPrompt } from '@/lib/ai/system-prompt';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash-preview-05-20'),
    system: systemPrompt,
    messages,
    tools,          // 6つのFunction定義
    maxSteps: 3,    // ツール呼び出し→結果取得→応答 の最大ステップ
  });

  return result.toDataStreamResponse();
}
```

### lib/ai/tools.ts

```typescript
import { tool } from 'ai';
import { z } from 'zod';
import profile from '@/data/profile.json';
import career from '@/data/career.json';
import skills from '@/data/skills.json';
import projects from '@/data/projects.json';
import values from '@/data/values.json';
import contact from '@/data/contact.json';

const SceneType = z.enum([
  'welcome', 'profile', 'projects', 'skills',
  'career', 'values', 'contact', 'text'
]);

export const tools = {
  // ─── データ取得ツール ───

  getProfile: tool({
    description: 'プロフィール・自己紹介情報を取得する',
    parameters: z.object({}),
    execute: async () => profile,
  }),

  getCareer: tool({
    description: '職歴・経歴情報を取得する',
    parameters: z.object({}),
    execute: async () => career,
  }),

  getSkills: tool({
    description: '技術スキル一覧を取得する。カテゴリ指定で絞り込み可能',
    parameters: z.object({
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
    parameters: z.object({}),
    execute: async () => projects,
  }),

  getValues: tool({
    description: '価値観・信念・将来のビジョンを取得する',
    parameters: z.object({}),
    execute: async () => values,
  }),

  getContact: tool({
    description: '連絡先情報を取得する',
    parameters: z.object({}),
    execute: async () => contact,
  }),

  // ─── テンプレート選択ツール ───

  renderTemplate: tool({
    description: 'ページに表示するデザインテンプレートを指定する。必ず毎回呼び出すこと。同じテンプレートの連続使用は避ける',
    parameters: z.object({
      templateId: z.string().describe('表示するテンプレートのID（例: projects-horizontal-slider）'),
    }),
    execute: async ({ templateId }) => templateId,
  }),
};
```

---

## 8. フロントエンド実装設計

### 8-1. page.tsx（トップページ ＝ 唯一のページ）

画面全体がAIのキャンバス。入力欄はテンプレートのデザインに溶け込む。

```typescript
// page.tsx — 極限までシンプル
export default function Home() {
  return (
    <div className="h-dvh relative overflow-hidden">
      <Canvas />
    </div>
  );
}
```

### 8-2. Canvas.tsx（キャンバス管理の中枢）

```typescript
'use client';
import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTemplateManager } from '@/hooks/useTemplateManager';
import { templateRegistry } from '@/components/templates/registry';

export function Canvas() {
  // 使用済みテンプレート追跡（原則1: 二度と同じ体験に出会えない）
  const [usedTemplates, setUsedTemplates] = useState<string[]>([]);

  const chat = useChat({
    body: { usedTemplates },  // APIに使用済みリストを渡す
  });

  const {
    templateId, templateData, commentary, inputConfig, visualSeed
  } = useTemplateManager(chat.messages);

  // テンプレート切替時に使用済みリストを更新
  useEffect(() => {
    if (templateId && templateId !== 'welcome') {
      setUsedTemplates(prev =>
        prev.includes(templateId) ? prev : [...prev, templateId]
      );
    }
  }, [templateId]);

  const entry = templateRegistry[templateId];
  const TemplateComponent = entry?.component;
  // テンプレートごとの固有トランジション（原則3: Premium Motion）
  const transition = entry?.meta.transition ?? 'scaleBlur';

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${templateId}-${visualSeed.colorOffset}`}
          {...transitionVariants[transition]}
          className="absolute inset-0"
        >
          {TemplateComponent ? (
            <TemplateComponent
              data={templateData}
              commentary={commentary}
              visualSeed={visualSeed}
            />
          ) : (
            <WelcomeTemplate />
          )}
        </motion.div>
      </AnimatePresence>

      <FloatingInput
        position={inputConfig.position}
        style={inputConfig.style}
        chat={chat}
      />

      {chat.isLoading && <LoadingOverlay />}
    </>
  );
}
```

### 8-3. useTemplateManager.ts（カスタムフック）

```typescript
import { templateRegistry } from '@/components/templates/registry';
import type { Message } from 'ai';

export function useTemplateManager(messages: Message[]) {
  const latestAssistant = messages.findLast(m => m.role === 'assistant');

  // renderTemplate のツール結果からテンプレートIDを取得
  const templateInvocation = latestAssistant?.toolInvocations?.find(
    inv => inv.toolName === 'renderTemplate' && inv.state === 'result'
  );
  // データ取得ツールの結果
  const dataInvocation = latestAssistant?.toolInvocations?.find(
    inv => inv.toolName !== 'renderTemplate' && inv.state === 'result'
  );

  const templateId = templateInvocation?.result ?? 'welcome';
  const templateData = dataInvocation?.result ?? null;
  const commentary = latestAssistant?.content ?? '';

  // テンプレートメタデータから入力欄の設定を取得
  const meta = templateRegistry[templateId]?.meta;
  const inputConfig = {
    position: meta?.inputPosition ?? 'center',
    style: meta?.inputStyle ?? 'minimal',
  };

  return { templateId, templateData, commentary, inputConfig };
}
```

### 8-4. テンプレートレジストリ（registry.ts）

全テンプレートを一元管理するレジストリ。

```typescript
import type { ComponentType } from 'react';

export type InputPosition =
  | 'center'           // 画面中央（初期状態用）
  | 'bottom-center'    // 画面下部中央
  | 'bottom-right'     // 画面右下フローティング
  | 'top-center'       // 画面上部
  | 'integrated';      // テンプレート内に統合

export type InputStyle =
  | 'minimal'          // 白背景、細い枠線のみ（初期状態）
  | 'glass'            // glassmorphism（半透明ブラー）
  | 'dark-glass'       // ダーク系glassmorphism
  | 'transparent';     // 完全透明、テキストのみ

export type TransitionVariant =
  | 'clipExpand'       // 円形クリップパス展開
  | 'slideOver'        // 横スライドオーバー
  | 'scaleBlur'        // スケール + ブラー（デフォルト）
  | 'verticalSplit';   // 上下スプリット

export interface TemplateMeta {
  id: string;
  category: string;
  inputPosition: InputPosition;
  inputStyle: InputStyle;
  transition: TransitionVariant;  // テンプレート固有のトランジション（原則3）
}

export interface TemplateProps {
  data: unknown;
  commentary: string;
  visualSeed: VisualSeed;  // ビジュアルランダム化シード（原則1）
}

interface TemplateEntry {
  component: ComponentType<TemplateProps>;
  meta: TemplateMeta;
}

export const templateRegistry: Record<string, TemplateEntry> = {
  // Welcome
  'welcome': {
    component: WelcomeMinimalInput,
    meta: { id: 'welcome', category: 'welcome', inputPosition: 'center', inputStyle: 'minimal' },
  },

  // Profile (5)
  'profile-hero-split': {
    component: ProfileHeroSplit,
    meta: { id: 'profile-hero-split', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'glass' },
  },
  'profile-centered-bio': {
    component: ProfileCenteredBio,
    meta: { id: 'profile-centered-bio', category: 'profile', inputPosition: 'bottom-center', inputStyle: 'dark-glass' },
  },
  // ... 残りのテンプレートも同様にエントリ追加

  // Projects (5)
  'projects-horizontal-slider': {
    component: ProjectsHorizontalSlider,
    meta: { id: 'projects-horizontal-slider', category: 'projects', inputPosition: 'bottom-center', inputStyle: 'glass' },
  },
  // ...

  // Text (5)
  'text-centered-prose': {
    component: TextCenteredProse,
    meta: { id: 'text-centered-prose', category: 'text', inputPosition: 'bottom-center', inputStyle: 'dark-glass' },
  },
  // ...
};
```

### 8-5. FloatingInput.tsx（動的入力欄）

テンプレートに応じて位置・スタイルが変化する入力欄。

```typescript
const positionStyles: Record<InputPosition, string> = {
  'center':        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg',
  'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
  'bottom-right':  'bottom-6 right-6 w-80',
  'top-center':    'top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
  'integrated':    'bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl',
};

const inputStyles: Record<InputStyle, string> = {
  'minimal':     'bg-white border border-gray-200 shadow-sm',
  'glass':       'bg-white/10 backdrop-blur-xl border border-white/20 text-white',
  'dark-glass':  'bg-black/30 backdrop-blur-xl border border-white/10 text-white',
  'transparent': 'bg-transparent border-b border-white/30 text-white rounded-none',
};

export function FloatingInput({ position, style, chat }: Props) {
  const { input, handleInputChange, handleSubmit, append, isLoading } = chat;

  return (
    <motion.div
      layout  // position変更時にスムーズにアニメーション
      className={`absolute z-50 px-4 ${positionStyles[position]}`}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 定型ボタン（welcomeテンプレート時のみ表示、または常に表示で折りたたみ） */}
      <SuggestionChips append={append} />

      {/* テキスト入力 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="何でも聞いてください..."
          className={`flex-1 px-4 py-3 rounded-2xl outline-none transition-all
                      ${inputStyles[style]}`}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-md
                     text-white hover:bg-white/30 transition-colors"
        >
          →
        </button>
      </form>
    </motion.div>
  );
}
```

### 8-6. テンプレートの共通構造

各テンプレートは以下の共通インターフェースに従う:

```typescript
// 全テンプレートが受け取るprops
interface TemplateProps {
  data: unknown;       // JSONデータ（テンプレートが適切にキャスト）
  commentary: string;  // AIのテキスト応答
}

// テンプレートの実装例: projects-horizontal-slider
export function ProjectsHorizontalSlider({ data, commentary }: TemplateProps) {
  const projects = data as ProjectData;

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 to-slate-800
                    flex flex-col items-center justify-center p-8">
      {/* AIコメンタリー */}
      {commentary && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/70 text-sm mb-8 max-w-xl text-center"
        >
          {commentary}
        </motion.p>
      )}

      {/* スライダー本体 */}
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory ...">
        {projects.projects.map((project, i) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="snap-center shrink-0 w-[80vw] max-w-lg"
          >
            {/* プロジェクトカード */}
            <img src={project.image} ... />
            <h3>{project.name}</h3>
            <p>{project.tagline.ja}</p>
            <div className="flex gap-2">
              {project.stack.map(s => <Badge key={s}>{s}</Badge>)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

### 8-7. テンプレート設計の要点

#### 各カテゴリの設計方針

**Welcome（1テンプレート）**
- 真っ白の画面、中央に入力欄のみ
- ロゴもタイトルもなし。超ミニマル
- 「変化前の静寂」を演出

**Profile（5テンプレート）**
- hero-split: 左右分割。左に画像、右にテキスト
- centered-bio: 中央寄せ。名前を大きく、紹介文を下に
- card-stack: カードが重なるモダンデザイン
- minimal-intro: 名前+一文のみ。WhatsAppの連絡先風
- full-portrait: 全画面背景画像+テキストオーバーレイ

**Projects（5テンプレート）**
- horizontal-slider: 横スクロール。スワイプ対応
- grid-gallery: 2x2 or 3x3グリッド。全プロジェクト一覧
- spotlight: 1プロジェクトをフルスクリーンで大きく表示
- timeline: 時系列。プロジェクトの成長を可視化
- showcase-stack: カードが上に重なっていくスタック

**Skills（5テンプレート）**
- bar-chart: 横棒グラフ。staggered animation
- radar-chart: レーダーチャート。SVGで描画
- tag-cloud: スキル名がサイズ違いで散らばる
- category-cards: カテゴリごとにカード分割
- matrix: X=経験年数、Y=レベルの2軸マトリクス

**Career（4テンプレート）**
- vertical-timeline: 縦型。カードが順次出現
- horizontal-timeline: 横型。スクロール
- company-cards: 会社ごとのフルカード
- journey: ロードマップ風のジャーニーマップ

**Values（3テンプレート）**
- quote-card: 大きなクォーテーションマーク + 引用テキスト
- manifesto: マニフェスト風。太字 + 力強いレイアウト
- story-format: ストーリー調。段落ごとにフェードイン

**Contact（3テンプレート）**
- contact-card: 名刺風カード。SNSアイコン付き
- minimal-links: リンクだけをミニマルに並べる
- fullscreen-cta: 全画面。「連絡してください」を大きく

**Text（5テンプレート）**
- centered-prose: 中央寄せの散文。行間広め
- magazine-layout: 雑誌風。カラム+プルクォート
- letter-format: 手紙風。「拝啓」から始まるフォーマット
- highlight-box: 要点をボックスでハイライト
- qa-format: Q&A形式。質問→回答の構造

### 8-8. LoadingOverlay（AI思考中）

テンプレート切替前の待機表示。
- 現在のテンプレートの上にかかる半透明オーバーレイ
- 中央にパルスアニメーション
- 背景をブラーさせることで「変化の予感」を演出

---

## 9. デザイン方針

### 初期状態の哲学
- **真っ白** — ロゴなし、タイトルなし、装飾なし
- 画面中央に入力欄の枠だけ
- この「無」の状態から一気にデザインが生まれる落差が、最大の演出効果

### カラーパレット
- 初期状態: 純白（#ffffff）
- テンプレートごとに異なる色調（統一ブランドカラーに縛らない）
  - Profile系: 温かみのあるグラデーション
  - Projects系: ダーク系（作品を引き立てる）
  - Skills系: テック感のあるブルー/パープル
  - Text系: ニュートラル。読みやすさ重視
- テンプレート間で色が変わることが「動的に生成されている」感覚を強化

### レイアウト
- **フルスクリーンキャンバス方式**
- 各テンプレートが画面100%を占有（100dvh）
- 入力欄はテンプレート上にフローティング（固定帯ではない）
- モバイルファースト

### タイポグラフィ
- 本文: Noto Sans JP / Inter
- コード: JetBrains Mono
- テンプレートごとにフォントサイズ・ウェイトのバリエーション

### アニメーション戦略（原則3: Premium Motion）

チープなアニメーション（単純なfade、linear easing）は一切使わない。
すべてのモーションはリッチで有機的、かつインタラクティブであること。

#### レイヤー1: テンプレート切替トランジション
テンプレートが切り替わる瞬間が最大の演出ポイント。各テンプレートが固有の退場/登場パターンを持つ。

```typescript
// トランジションバリエーション（テンプレートごとに異なる）
const transitionVariants = {
  // ① クリップパス展開: 円形に広がって次のテンプレートが現れる
  clipExpand: {
    initial: { clipPath: 'circle(0% at 50% 50%)' },
    animate: { clipPath: 'circle(150% at 50% 50%)' },
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
  // ② スライドオーバー: 新テンプレートが横からスライドして上に被さる
  slideOver: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '-30%', opacity: 0.5 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  // ③ スケール + ブラー: 前のテンプレートがぼやけて縮小、新しいのが拡大
  scaleBlur: {
    initial: { scale: 1.1, filter: 'blur(20px)', opacity: 0 },
    animate: { scale: 1, filter: 'blur(0px)', opacity: 1 },
    exit: { scale: 0.9, filter: 'blur(10px)', opacity: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  // ④ 垂直スプリット: 画面が上下に割れて新テンプレートが出現
  verticalSplit: {
    initial: { clipPath: 'inset(50% 0 50% 0)' },
    animate: { clipPath: 'inset(0% 0 0% 0)' },
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
  // ⑤ ピクセレート: 前のテンプレートがピクセル化して消え、新しいのが鮮明に
  // (CSS filter + SVG feDisplacementMap)
};
```

#### レイヤー2: テンプレート内部アニメーション
各テンプレートは固有のリッチな出現アニメーションを持つ。

| テンプレート | アニメーション | 技法 |
|------------|------------|------|
| bar-chart | 棒がスプリング物理で弾みながら伸びる | spring({ stiffness: 200, damping: 15 }) |
| timeline | パスに沿ってノードが順次出現、線が描かれていく | SVG pathLength animation |
| card-stack | カードが物理落下して重なる | stagger + spring + rotation |
| tag-cloud | タグが3D空間を浮遊し続ける | continuous animation + perspective |
| slider | カードが奥から手前に飛んでくる | z-axis + scale + stagger |
| radar-chart | 中心から放射状にSVGパスが描画される | SVG stroke animation |
| letter-format | タイプライター風にテキストが1文字ずつ出現 | custom hook + requestAnimationFrame |
| spotlight | ズームイン + ボケ→ピント合焦 | scale + blur transition |

#### レイヤー3: 背景アニメーション
テンプレートの背景は常に微妙に動く。静止画面にしない。

- **グラデーションアニメーション**: HSLのhueが超低速で回転し続ける（360deg/60s）
- **ノイズテクスチャ**: CSS grain effectで微妙なざらつき（フィルム感）
- **パーティクル**: 微細なドットがゆっくり浮遊する（テンプレートによってはオプショナル）
- **メッシュグラデーション**: 複数の色が有機的にブレンドし変化し続ける

```typescript
// 背景グラデーションアニメーションの例
const AnimatedBackground = ({ seed }: { seed: VisualSeed }) => {
  const palette = accentPalettes[seed.accentIndex];
  return (
    <motion.div
      className="absolute inset-0 -z-10"
      animate={{
        background: [
          `radial-gradient(ellipse at 20% 50%, ${palette.primary}20, transparent 70%)`,
          `radial-gradient(ellipse at 80% 50%, ${palette.secondary}20, transparent 70%)`,
          `radial-gradient(ellipse at 50% 20%, ${palette.glow}20, transparent 70%)`,
        ],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    />
  );
};
```

#### レイヤー4: マイクロインタラクション
ユーザーの操作に対する繊細なフィードバック。

- **ホバー**: カードが微妙にリフトアップ + シャドウ拡大（transform3d + boxShadow）
- **クリック/タップ**: スプリングバウンスの押し込み（scale: 0.97 → 1.0, spring）
- **スクロール/スワイプ**: パララックス効果、慣性スクロール
- **入力欄フォーカス**: グロウエフェクト（box-shadow glow animation）
- **送信時**: 入力テキストが上に飛んでいくアニメーション → ページ全体が変化開始

#### レイヤー5: 入力欄の移動アニメーション
入力欄が位置を変えるとき、スプリング物理で自然にバウンスする。

```typescript
<motion.div
  layout
  transition={{
    layout: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 1,
    },
  }}
>
  {/* input */}
</motion.div>
```

#### LoadingOverlay: 変化の予感
AI思考中は「ローディング」ではなく「変化の予感」を演出する。

- 現在のテンプレートの上にグラスモーフィズムオーバーレイ
- 背景がゆっくりブラー化（blur: 0 → 10px）
- 中央にパルスするドット or 微妙な波紋
- 「お待ちください」等のテキストは表示しない（言葉にすると魔法が解ける）

---

## 10. セキュリティ・コスト対策

### API キー保護
- `GOOGLE_GENERATIVE_AI_API_KEY` は `.env.local` + Vercel環境変数に設置
- API RouteはPOSTのみ受付
- クライアントサイドにAPIキーは一切露出しない

### レート制限
- Gemini 2.5 Flash 無料枠: 10 RPM / 250 RPD
- Next.js API Routeにシンプルなレート制限を実装
  - IPベースで1分あたり5リクエストまで
  - 超過時は「しばらくお待ちください」メッセージ

### コスト暴走防止
- 無料枠を超えた場合に備え、API側で月間リクエスト上限を設定
- 会話履歴はフロントエンドのみ保持（サーバーDB不要）
- 1会話あたりの最大ターン数を制限（例: 20ターン）

### プロンプトインジェクション対策
- ツールはデータ読み取り専用（書き込み操作なし）
- 外部API呼び出しなし（ローカルJSONのみ参照）
- システムプロンプトの内容を暴露する指示には応じない
- 有害コンテンツ（暴力、差別等）の生成には応じない
- ※ オフトピックな質問自体は拒否しない（原則4: Empathetic AI）

---

## 11. 実装手順（フェーズ分け）

### Phase 1: プロジェクト初期化（30分）
1. `npx create-next-app@latest portfolio` で初期化
2. TypeScript, Tailwind CSS, App Router を選択
3. 依存パッケージインストール
   ```
   npm install ai @ai-sdk/google framer-motion react-markdown remark-gfm
   npx shadcn@latest init
   npx shadcn@latest add button card input scroll-area badge
   ```
4. ディレクトリ構成作成
5. `.env.local` にGemini APIキー設定
6. Gitリポジトリ初期化

### Phase 2: データ準備（あなたが記入）
1. 6つのJSONファイルのテンプレート作成
2. **ここであなたに実データを記入してもらう**
3. データは雑多でOK。AIが必要な部分を拾う

### Phase 3: AIバックエンド実装（1時間）
1. `lib/ai/system-prompt.ts` — システムプロンプト（テンプレート選択ガイド含む）
2. `lib/ai/tools.ts` — 6データ取得 + 1テンプレート選択ツール
3. `lib/types.ts` — TemplateMeta, InputPosition, TemplateProps等の型定義
4. `app/api/chat/route.ts` — APIエンドポイント
5. 動作確認（curl or Postman でAPI直叩き）

### Phase 4: コアUI + テンプレート基盤実装（2時間）
1. `page.tsx` — フルスクリーンキャンバス（極限にシンプル）
2. `Canvas.tsx` — テンプレート管理の中枢（useChat + AnimatePresence + レジストリ）
3. `useTemplateManager.ts` — AI応答からテンプレートID・データ・コメンタリーを抽出
4. `registry.ts` — テンプレートレジストリの枠組み
5. `FloatingInput.tsx` — 動的位置・スタイルの入力欄（layout animation）
6. `LoadingOverlay.tsx` — AI思考中のビジュアルフィードバック
7. `welcome/MinimalInput.tsx` — 初期状態（真っ白 + 入力欄のみ）
8. `text/CenteredProse.tsx` — 最もシンプルなテキストテンプレート
9. ここまでで「入力→AI応答→テンプレート切替→入力欄移動」の基本動作を確認

### Phase 5: 全テンプレート実装（4-5時間）★最大のフェーズ
各カテゴリごとに全テンプレートを実装する。

1. **Profile (5)**: hero-split, centered-bio, card-stack, minimal-intro, full-portrait
2. **Projects (5)**: horizontal-slider, grid-gallery, spotlight, timeline, showcase-stack
3. **Skills (5)**: bar-chart, radar-chart, tag-cloud, category-cards, matrix
4. **Career (4)**: vertical-timeline, horizontal-timeline, company-cards, journey
5. **Values (3)**: quote-card, manifesto, story-format
6. **Contact (3)**: contact-card, minimal-links, fullscreen-cta
7. **Text残り (4)**: magazine-layout, letter-format, highlight-box, qa-format
8. 全テンプレートをレジストリに登録
9. 各テンプレートの inputPosition / inputStyle メタデータ設定

### Phase 6: デザイン・アニメーション・レスポンシブ（1.5時間）
1. フォント設定（Noto Sans JP + Inter）
2. 各テンプレートの背景色・グラデーション調整
3. Framer Motion アニメーション微調整（テンプレート切替・内部アニメーション）
4. FloatingInput のlayout animation調整
5. モバイルレスポンシブ（全テンプレートがスマホで正しく表示されるか確認）
6. 定型ボタン（SuggestionChips）のデザイン

### Phase 7: セキュリティ・最適化（30分）
1. レート制限実装
2. エラーハンドリング（API障害時のフォールバック）
3. メタデータ設定（OGP、title、description）
4. パフォーマンス確認

### Phase 8: デプロイ（15分）
1. GitHubリポジトリ作成・プッシュ
2. Vercel接続
3. 環境変数設定
4. デプロイ・動作確認

---

## 12. 想定される拡張（将来）

- **音声入力対応**: Web Speech API で音声→テキスト変換
- **会話の永続化**: localStorage で会話履歴を保持
- **多言語検出の高度化**: AIの応答言語をより正確に制御
- **アナリティクス**: どんな質問が多いかを分析し、定型ボタンを最適化
- **DB移行**: JSONからSupabase等に移行し、「DB直結AIミドルウェア」の原型にする

---

## 13. まとめ

| 項目 | 内容 |
|------|------|
| 開発期間目安 | Phase 1-8 合計: 約10-12時間（テンプレート30個の実装が主） |
| ランニングコスト | **¥0**（Gemini無料枠 + Vercel Hobby） |
| 新技術 | Vercel AI SDK, SSE, Gemini API, Framer Motion |
| 差別化ポイント | 「次世代SaaS UI/UX」のコンセプト実証そのもの |
| 最大のリスク | Gemini無料枠の制限（10RPM/250RPD）。超えたらAPI課金 or LLM切替が必要 |

### 4つのUX設計原則（再掲）

1. **Uniqueness** — 二度と同じ体験に出会えない（テンプレート30+ × ビジュアルランダム化 × AI応答変化）
2. **Mystery** — 「このサイトはどうやって作られている？」（落差演出・技術痕跡の隠蔽・Web文法の断絶）
3. **Premium Motion** — リッチでインタラクティブなアニメーション（5層アニメーション戦略・スプリング物理・背景動態）
4. **Empathetic AI** — どんな入力にも寄り添う（オフトピック歓迎・人格一貫性・判定ロジック不在）
