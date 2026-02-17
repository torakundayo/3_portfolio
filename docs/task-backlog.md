# AI Canvas Portfolio — タスクバックログ

作成日: 2026-02-17
参照: [improvement-plan.md](./improvement-plan.md) / [design-principles.md](./design-principles.md)

ステータス凡例: `[ ]` 未着手 / `[→]` 進行中 / `[✓]` 完了

---

## P0: 原則違反の修正（基礎品質の確保）

これらは design-principles.md で明確に「禁止」「やってはいけない」と書かれたパターンの排除。
他の改善の前提となる基礎作業。

### T-001: テキスト要素の translateY アニメーション撤廃
- `[✓]` ステータス: 完了
- 影響範囲: 全テンプレート（profile/, skills/, career/, values/, contact/, text/, welcome/）
- 作業内容:
  - 全テンプレートの `itemVariants` から `y: 30` 等のtranslateYを削除
  - テキスト要素（h1, h2, h3, p, span）のアニメーションを `opacity` のみに変更
  - 非テキスト要素（デコライン、バー、カード枠）は `scale` or `clipPath` で出現に変更
- 確認基準: テキストがサブピクセルでぼやけないこと

### T-002: 微小距離アニメーションの修正
- `[✓]` ステータス: 完了
- 影響範囲:
  - `ContentPillars.tsx` — ラベル出現 `x: -4 → 0`
  - `FloatingInput.tsx` — Enter hint `x: 4 → 0`
  - 各テンプレートの小さな `x/y` 移動
- 作業内容:
  - 20px未満の移動アニメーションを全て削除
  - 代替として `opacity` のみの出現 or 意味のある距離（20px以上）の移動に変更
- 確認基準: 全アニメーションが視覚的に意味のある変化を伴うこと

### T-003: 禁止プロパティのアニメーション排除
- `[✓]` ステータス: 完了
- 影響範囲:
  - `SkillsBarChart.tsx` — shimmer の `background` 変化
  - `LoadingOverlay.tsx` — `stroke-dasharray` アニメーション
  - `Canvas.tsx:337` — `boxShadow` アニメーション（content-highlight）
  - 各所の `filter` 変化
- 作業内容:
  - boxShadow アニメーション → 固定shadow + opacity切り替え
  - shimmer → CSS @keyframes の translateX による光の移動（背景変化ではなく）
  - stroke-dasharray → そのまま許容（SVG固有、GPUプロパティ相当）
- 確認基準: DevTools Performance タブで Paint が発生しないこと

---

## P0: Welcome画面の強化（ファーストインプレッション）

### T-004: パーティクル密度・存在感の強化
- `[✓]` ステータス: 完了
- 影響範囲: `TemplateShell.tsx` AmbientParticles
- 作業内容:
  - Welcome時のパーティクル数を 8 → 20〜24 に増加
  - 基本不透明度を `0.04 + r() * 0.12` → `0.08 + r() * 0.20` に引き上げ
  - サイズ範囲を `0.8 + r() * 2` → `1.2 + r() * 3.5` に拡大
  - glow パーティクルの割合を20% → 35%に増加
- 確認基準: 白背景上でパーティクルの存在が自然に認識できること

### T-005: グラデーション球の存在感強化
- `[✓]` ステータス: 完了
- 影響範囲: `TemplateShell.tsx` GradientMesh + 各テンプレートの bg-drift
- 作業内容:
  - GradientMesh: `${palette.primary}20` → `${palette.primary}35`
  - GradientMesh: `${palette.secondary}15` → `${palette.secondary}28`
  - テンプレート固有のbg-drift球との二重描画を整理（TemplateShellに統合 or テンプレート側を削除）
- 確認基準: 背景に色の存在が感じられ、パレット変化が明確にわかること

### T-006: キーワードの視覚的強化
- `[✓]` ステータス: 完了
- 影響範囲: `welcome/MinimalInput.tsx` DriftingKeyword
- 作業内容:
  - テキストサイズを `text-sm` → `text-base` or `text-lg` に拡大
  - 各キーワードの背後にグロー円を追加（`radial-gradient` + `blur-xl`、パレット色）
  - 3つの深度層に分散: `translateZ(10px)`, `translateZ(30px)`, `translateZ(50px)`
  - 手前のキーワードは大きく、奥は小さくぼやける（perspective効果）
  - 微細な呼吸脈動を追加（breathPhaseと連動、位相差あり）
- 確認基準: キーワードが「メニューリンク」ではなく「空間に浮遊する存在」に見えること

### T-007: 入力欄へのパーティクル引力表現
- `[✓]` ステータス: 完了
- 影響範囲: `TemplateShell.tsx` AmbientParticles
- 作業内容:
  - Welcome + idle時: パーティクルの移動先座標にビューポート中心方向へのバイアスを強化
  - 現在の `quantizedAttraction` ロジックを改善: 引力を時間経過で段階的に増加
  - パーティクルの移動速度に近似距離依存の加速を追加（近いほど速く中心へ）
  - ユーザーがクリック/入力時 → パーティクルが一瞬散開するリアクション
- 確認基準: 「パーティクルが入力欄に引き寄せられている」と直感的に感じること

---

## P1: テンプレートの空間配置化

### T-008: 空間配置ユーティリティの作成
- `[✓]` ステータス: 完了
- 新規ファイル: `src/lib/spatial-layout.ts`
- 作業内容:
  - `calculateSpatialPositions(items, viewport, seed)` — アイテム群の空間座標を算出
  - 入力: アイテムの重要度、関連性グラフ、ビューポートサイズ
  - 出力: 各アイテムの `{ x, y, z, scale, opacity }` 座標
  - 中心=主役、周辺=文脈、近い=関連性高い のルールを実装
  - VisualSeedで座標にランダム性を付与
- 確認基準: 同じデータでもseedが変わると異なる配置が生成されること

### T-009: profile-spatial-hero テンプレートの作成
- `[✓]` ステータス: 完了
- 新規ファイル: `src/components/templates/profile/SpatialHero.tsx`
- 作業内容:
  - 名前: 空間の中心やや上、最大サイズ、`translateZ(60px)`
  - 肩書き: 名前の下方、パレットカラー、微細な脈動
  - 紹介文: 名前の右方、`opacity: 0.85`、ホバーで全文展開
  - リンク: 名前の左下、アイコンのみ、近づくとラベル展開
  - セクションラベル（Introduction, Background）は使わない
  - AI Commentary はテンプレート右端に透明度の高い散文として配置
  - 全要素 `position: absolute` + `transform: translate3d()`
- 確認基準: 「空間にオブジェクトが浮かんでいる」という印象を受けること
- 依存: T-008

### T-010: skills-constellation テンプレートの作成
- `[✓]` ステータス: 完了
- 新規ファイル: `src/components/templates/skills/Constellation.tsx`
- 作業内容:
  - 各スキルを円形ノードで表現: サイズ=レベル、輝度=レベル
  - カテゴリごとに色分け（パレットのprimary/secondary/glow）
  - 同カテゴリのスキルは近くに配置、異なるカテゴリは離して配置
  - ノード間に薄い接続線（同カテゴリ内）
  - ホバーで詳細展開（年数、説明）— インラインで
  - テキストラベル（年数yr）ではなく、円のサイズと輝度で伝える
- 確認基準: 数字ラベルなしでスキルの強弱が視覚的に伝わること
- 依存: T-008

### T-011: テンプレートレジストリへの空間テンプレート追加
- `[✓]` ステータス: 完了
- 影響範囲: `src/components/templates/registry.ts`, `src/lib/ai/system-prompt.ts`
- 作業内容:
  - 新テンプレートをregistryに登録
  - system-promptにテンプレート選択の指示を追加
  - 空間テンプレートの優先度を上げる（従来テンプレートはフォールバック）
- 依存: T-009, T-010

---

## P1: 行動応答の強化

### T-012: dwellTarget検出後のUI応答実装
- `[✓]` ステータス: 完了
- 影響範囲: テンプレート内の要素 + 新規コンポーネント
- 作業内容:
  - テンプレート内の主要要素に `data-observe-zone` 属性を追加
  - dwell検出時: 対象要素を `scale(1.05)` + `opacity` 変化で微かに拡大
  - 対象要素の近傍に関連情報をradial方向に展開（opacityのみでfade-in）
  - dwell解除時: 滑らかに元に戻る（spring物理で）
- 確認基準: カーソルを2秒留めると要素が「反応している」と感じること

### T-013: cursorSpeed='searching' 時のUI応答
- `[✓]` ステータス: 完了
- 影響範囲: `ContentPillars.tsx`, `FloatingInput.tsx`, `TemplateShell.tsx`
- 作業内容:
  - ContentPillars: ドットサイズを一時的に拡大（10→16px）
  - FloatingInput: グロー不透明度を引き上げ
  - TemplateShell: パーティクルの明るさを一時的に上げる
  - 全変化はcursorSpeedが'normal'に戻ると段階的に復帰
- 確認基準: 素早くマウスを動かすと「サイトが助けようとしている」と感じること

### T-014: テンプレート表示中のサジェストキーワード空間化
- `[✓]` ステータス: 完了
- 影響範囲: `FloatingInput.tsx` のサジェスト表示部分
- 作業内容:
  - 現在の `flex justify-center gap-3` リストを廃止
  - 入力欄の周囲にキーワードを放射状配置（DriftingKeywordと同様の手法）
  - ただし半径は小さめ（入力欄の近傍に留まる）
  - 出現はopacityのみ、スケールは固定
- 確認基準: サジェストが「リスト」ではなく「浮遊するヒント」に見えること

---

## P1: コンテンツ層の呼吸追加

### T-015: テンプレート内要素への呼吸適用
- `[✓]` ステータス: 完了
- 影響範囲: `src/lib/animation.ts` + 全テンプレート
- 作業内容:
  - `breatheStyle(index)` の改良: `animation-delay` で位相差を制御
  - CSS `ai-breathe` キーフレームの見直し: 不規則なリズム（正弦波ではなくperlin的）
  - 各テンプレートの主要要素（見出し、主コンテンツ、デコレーション）に適用
  - 適用密度: 全要素ではなく、3〜5個の主要要素のみ（過剰適用は痙攣）
- 確認基準: テンプレート表示後も要素が「生きている」と感じること

### T-016: ContentPillarsへの呼吸脈動追加
- `[✓]` ステータス: 完了
- 影響範囲: `ContentPillars.tsx`
- 作業内容:
  - 各ドットに微細なスケール脈動を追加（`scale: [1, 1.06, 1]`、3〜5秒周期）
  - 位相差をindex * 0.8秒でずらす
  - アクティブドットのグロー効果を追加（パレットカラーの薄い`box-shadow`を固定で適用、アニメーションなし）
- 確認基準: ナビゲーションが「静的なドット列」ではなく「呼吸する存在」に見えること

---

## P2: ContentPillarsの改善

### T-017: ドットサイズとグロー効果の強化
- `[✓]` ステータス: 完了
- 影響範囲: `ContentPillars.tsx`
- 作業内容:
  - ドットサイズを拡大: inactive 10→14px, active 14→22px
  - アクティブドットにパレットカラーのグロー追加
  - 訪問済みドットに薄い色つき（パレットカラーの10%）
  - ノード間に細い接続線を描画（SVG or CSS）
  - ホバーラベルのアニメーションを `x:-4→0` から `opacity` のみに変更

### T-018: ノード間の接続線描画
- `[✓]` ステータス: 完了
- 影響範囲: `ContentPillars.tsx`
- 作業内容:
  - 6つのドット間に細い縦線を描画（`border-left` or SVG path）
  - アクティブノードの上下のセグメントをパレットカラーで着色
  - 呼吸と連動したopacity変化
- 依存: T-017

---

## P2: FloatingInputの空間統合

### T-019: 入力欄のコンテンツ融合改善
- `[✓]` ステータス: 完了
- 影響範囲: `FloatingInput.tsx`, `Canvas.tsx`
- 作業内容:
  - Ghost スタイルの徹底: デフォルトで透明背景 + 下線のみ
  - フォーカス時のみ `bg-white/60 backdrop-blur-sm` で実体化
  - `z-50` の構造を見直し: テンプレートとの視覚的連続性を確保
  - 下部フェードグラデーションとの自然な融合を検証

### T-020: position遷移のopacity制限
- `[✓]` ステータス: 完了
- 影響範囲: `FloatingInput.tsx`
- 作業内容:
  - `layout` アニメーションを除去（position変更時にy軸移動が発生するため）
  - center → bottom-center 等の遷移を opacity fade-out → fade-in で処理
  - 遷移中は入力を disabled にして不整合を防止

---

## P2: VisualSeedバリエーション強化

### T-021: layoutVariantのテンプレート活用
- `[✓]` ステータス: 完了
- 影響範囲: 全テンプレート
- 作業内容:
  - `layoutVariant` (0〜1) を3区間に分割: A(0〜0.33), B(0.33〜0.66), C(0.66〜1)
  - 各テンプレートで区間ごとに異なる配置パターンを実装
  - 例: ProfileHeroSplit のVariant B → 名前が中央、情報が放射状
  - 例: SkillsBarChart のVariant C → カテゴリが横ではなく放射状

### T-022: アニメーションタイミングのseed連動
- `[✓]` ステータス: 完了
- 影響範囲: `src/lib/animation.ts` + 全テンプレート
- 作業内容:
  - `animationDelay` をテンプレート内で活用: entry順序、方向をseedで変化
  - 装飾要素（背景グリッド、デコライン）の位置・角度をseedで変化
  - 同じテンプレートの2回目表示が「明らかに違う動き」になること

---

## P3: 情報密度の動的制御

### T-023: テンプレートメタへのdensity属性追加
- `[✓]` ステータス: 完了
- 影響範囲: `src/lib/types.ts`, `src/components/templates/registry.ts`
- 作業内容:
  - `TemplateMeta` に `density: 'high' | 'medium' | 'low'` を追加
  - Skills系 → high, Profile系 → medium, Values系 → low
  - AIのsystem-promptにdensityに応じたcommentary長さの指示を追加

### T-024: 余白設計のdensity連動
- `[✓]` ステータス: 完了
- 影響範囲: 全テンプレート
- 作業内容:
  - high: padding小、フォントサイズ小、情報密度最大
  - medium: バランスの取れた余白
  - low: 余白多め、一文を大きく表示、呼吸の間を重視
- 依存: T-023

---

## P3: パフォーマンス最適化

### T-025: パーティクルのCSS @keyframes移行
- `[✓]` ステータス: 完了
- 影響範囲: `TemplateShell.tsx` AmbientParticles
- 作業内容:
  - Framer Motion `animate` + `repeat: Infinity` → CSS `@keyframes` + `animation`
  - 各パーティクルの座標を `--px-start`, `--px-end` 等のCSS変数で制御
  - compositorスレッドで実行されるため、JSオーバーヘッドを回避

### T-026: will-change と contain の適用
- `[✓]` ステータス: 完了
- 影響範囲: `TemplateShell.tsx`, 各テンプレート
- 作業内容:
  - 頻繁にアニメーションする要素（パーティクル、グロー、orbital rings）に `will-change: transform` 付与
  - テンプレートコンテナに `contain: layout paint` 追加
  - `isolation: isolate` で各レイヤーのスタッキングコンテキストを分離

---

## タスク依存関係

```
T-001 ─┐
T-002 ─┤
T-003 ─┴──→ [P0完了] ──→ T-015（呼吸適用はアニメーション修正後）
                      ──→ T-021, T-022（バリエーション強化）
                      ──→ T-025, T-026（パフォーマンス最適化）

T-004 ─┐
T-005 ─┤
T-006 ─┤
T-007 ─┴──→ [Welcome強化完了]

T-008 ──→ T-009 ──→ T-011
       ──→ T-010 ──→ T-011

T-012, T-013, T-014 は独立して着手可能
T-015, T-016 は独立して着手可能
T-017 ──→ T-018
T-019, T-020 は独立して着手可能
T-023 ──→ T-024
```

---

## 推奨着手順序

1. ~~**T-001 + T-002 + T-003** — アニメーション原則違反の修正~~ ✅ 完了
2. ~~**T-004 + T-005 + T-006** — Welcome パーティクル・グラデーション・キーワード強化~~ ✅ 完了
3. ~~**T-007** — パーティクル引力~~ ✅ 完了
4. ~~**T-015 + T-016** — コンテンツ層の呼吸追加~~ ✅ 完了
5. ~~**T-008** — 空間配置ユーティリティ作成~~ ✅ 完了
6. ~~**T-009 + T-010** — 空間テンプレート作成~~ ✅ 完了
7. ~~**T-011** — テンプレートレジストリ登録~~ ✅ 完了
8. ~~**T-012 + T-013 + T-014** — 行動応答の実装~~ ✅ 完了
9. ~~**T-017 + T-018** — ContentPillarsの改善（P2）~~ ✅ 完了
10. ~~**T-019 + T-020** — FloatingInputの空間統合（P2）~~ ✅ 完了
11. ~~**T-021 + T-022** — VisualSeedバリエーション強化（P2）~~ ✅ 完了
12. ~~**T-023 + T-024** — 情報密度の動的制御（P3）~~ ✅ 完了
13. ~~**T-025 + T-026** — パフォーマンス最適化（P3）~~ ✅ 完了
