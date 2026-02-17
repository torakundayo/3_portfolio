# AI Canvas Portfolio — 現状評価と改善計画

作成日: 2026-02-17
最終更新: 2026-02-17（P0〜P3全タスク完了後）
対象: design-principles.md に定義された基準に対する現状評価

---

## 総合評価: 75/100（前回: 60/100）

基盤アーキテクチャ（AI会話→テンプレート選択→動的レンダリング）は70点相当。
P0〜P3の全タスク（T-001〜T-026）が完了。ContentPillarsの接続線・グロー強化、
FloatingInputのGhost統合・opacity遷移、全テンプレートへのlayoutVariant 3パターン実装、
seeded stagger適用、density属性によるAIコメンタリー長さ制御、パーティクルのCSS @keyframes化、
will-change/contain最適化が完了し、体験品質が大幅に向上。

---

## 1. 根本テーマ「HTML/CSSの制約からの解放」 — 40/100（前回: 25/100）

### 改善内容（T-008〜T-011で実施）

- **`profile-spatial-hero`テンプレート新規作成**: 全要素をabsolute + translate3dで空間配置。名前が中心に浮遊、紹介文はホバーで展開、リンクはホバーでラベル表示。従来のgrid/flexレイアウトからの脱却を実現
- **`skills-constellation`テンプレート新規作成**: スキルを星座のように空間配置。ノードサイズ＝レベル、輝度＝レベル、カテゴリごとに色分け。SVG接続線で関連性を視覚化
- **`spatial-layout.ts`ユーティリティ作成**: `calculateSpatialPositions()` でアイテムの重要度ベースの空間座標を算出。seeded randomで決定的な変化

### 残る問題

| ファイル | 問題 | 原則との乖離 |
|----------|------|-------------|
| 既存テンプレート全体 | grid/flex依存のまま | 空間テンプレートは2つのみ。他29テンプレートは従来構造 |
| `ProfileHeroSplit.tsx` | `grid grid-cols-1 md:grid-cols-2` で左右分割 | ただしAIのsystem-promptでspatial-heroを推奨設定済み |
| `SkillsBarChart.tsx` | 水平バーチャート | constellationが推奨だが、バリエーションとして残存 |

### 今後の方針

空間テンプレートが「推奨」として登録済み。AIが優先選択するため、実質的な体験は向上。
全テンプレートの空間化はP2以降で段階的に進める。

---

## 2. ビジュアルテーマ・配色 — 65/100（前回: 55/100）

### 改善内容（T-005で実施）

- **GradientMeshの不透明度引き上げ**: `${palette.primary}20` → `${palette.primary}35`、`${palette.secondary}15` → `${palette.secondary}28`
- 白背景上で色の存在が明確に認識できるようになった

### 残る問題

| 問題 | 箇所 | 詳細 |
|------|------|------|
| テンプレート背景球との二重描画 | 各テンプレートの bg-drift | TemplateShellとテンプレート両方に球がある（意図的にレイヤーを分けている側面もあり） |
| 色とコンテンツの意味対応がない | `visual-seed.ts` | `accentIndex`がランダム。カテゴリ固有の色マッピングは未実装 |

### 今後の方針

- カテゴリ→アクセントカラーの推奨マッピングはP2で検討

---

## 3. コア原則の評価

### 原則1「見せる、説明しない」 — 40/100（前回: 20/100）

#### 改善内容

- **`skills-constellation`**: スキルレベルを円のサイズと輝度で視覚的に表現。数字ラベルなしで強弱が直感的に伝わる
- **`profile-spatial-hero`**: セクションラベルを廃止。紹介文はホバーで展開、リンクはアイコンのみでホバー時にラベル表示
- **AI Commentary**: spatial-heroでは空間の端に透明度0.5で配置。ホバーで0.8に。「セクション」ではなく空間に溶け込むテキスト

#### 残る問題

| 箇所 | 問題 |
|------|------|
| `ProfileHeroSplit.tsx` | 既存テンプレートにはまだ `Introduction` / `Background` / `AI Commentary` ラベルが残存 |
| `SkillsBarChart.tsx` | 水平バーとyrバッジは従来通り（constellationが推奨で優先選択される） |

#### 今後の方針

- 空間テンプレートがAIに推奨設定済みのため、実質的な問題は軽減
- 既存テンプレートのラベル削除は既存バリエーションの価値を損なう可能性があるため慎重に検討

---

### 原則2「行動を観察し、先回りする」 — 70/100（前回: 45/100）

#### 改善内容（T-012〜T-014で実施）

検出は以前から優秀だったが、**UI応答の実装が完了**:

- **T-012: dwellTarget UI応答**: `DwellHighlight`コンポーネント新規作成。`[data-observe-zone]`属性の要素にscale(1.03) + グローオーバーレイで反応。spring物理で滑らかに出現/退場
- **T-013: cursorSpeed='searching' UI応答**: ContentPillarsのドットが10→16pxに拡大、FloatingInputのグロー不透明度が0.25→0.5にブースト。cursorSpeed='normal'復帰で段階的に元に戻る
- **T-014: サジェストキーワード空間化**: `flex justify-center gap-3` のリストを廃止し、入力欄上方に放射状(arc)配置。三角関数で角度・半径を計算し、キーワードが「浮遊するヒント」として出現

#### 現在の行動応答マトリクス

| 行動シグナル | 応答状況 |
|-------------|---------|
| 3秒以上操作なし | ✅ ambientMessage + 入力欄パルス |
| カーソルが要素近くに留まる | ✅ DwellHighlight（scale + グロー） |
| 素早くカーソルを動かす | ✅ ContentPillars拡大 + 入力欄グロー強化 |
| フォーカスしたが打たない | ✅ 放射状浮遊キーワード出現 |
| 同じ領域を繰り返し見る | ❌ 未実装（P2以降） |

---

### 原則3「AIがインターフェースそのもの」 — 60/100（前回: 50/100）

#### 改善内容

- **行動応答がUI変化として実現**: dwellTarget検出→DwellHighlight、searching→ドット拡大+グロー強化、focus-idle→放射状キーワード。テキストメッセージではなく「環境の変化」で応答
- **空間テンプレートでのAI Commentary**: 静的セクションではなく、空間の端に透明度の高いテキストとして溶け込む

#### 残る課題

- ai-revealパターン（AIがコンテンツを生成しているかのようなスタガー出現）は未実装
- パーティクルが文字を形成→散る等の高度な表現は未着手

---

### 原則4「空間で思考する」 — 35/100（前回: 15/100）

#### 改善内容（T-008〜T-011で実施）

**Phase 1 完了**: 空間配置テンプレートの作成

- **`spatial-layout.ts`**: `calculateSpatialPositions(items, viewport, seed)` — 重要度ベースの空間座標計算。中心=主役、周辺=文脈、グループ近接=関連性。seeded randomで決定的変化
- **`profile-spatial-hero`**: 全要素absolute + translate3d(x, y, z)。名前がz=60pxの最前面、タイトルがz=35px、紹介文がz=25px。depth layerで空間を構築
- **`skills-constellation`**: スキルノードを空間配置。ノードサイズ(20-48px)とグロー強度がレベルに連動。SVG接続線でカテゴリ内関連性を視覚化
- **AIのsystem-promptで両テンプレートを「推奨」に設定**: 初回表示時に空間テンプレートが優先選択される

#### 残る問題

| パターン | 使用箇所 | 状況 |
|----------|---------|------|
| `grid grid-cols-2` | ProfileHeroSplit | 空間テンプレートが推奨だが、バリエーションとして残存 |
| `flex gap-4` | SkillsBarChart categories | 同上 |
| `max-w-6xl mx-auto` | 複数テンプレート | 既存テンプレートの構造。段階的に改善 |

#### 今後の方針

Phase 2（空間配置の全テンプレートへの拡大）はP2で実施。
現状は2つの空間テンプレートが推奨優先選択されるため、主要な体験は空間的になっている。

---

### 原則5「矩形を疑う」 — 35/100（前回: 20/100）

#### 改善内容

- **skills-constellation**: 円形ノード + 放射状配置 + SVG接続線。完全に矩形を脱却
- **profile-spatial-hero**: absolute配置で矩形グリッドから解放。要素が空間に浮遊
- **FloatingInputサジェスト**: 放射状arc配置（T-014）。`flex gap-3`の矩形リストを廃止
- **DwellHighlight**: rounded-2xlのグローオーバーレイ

#### 残る問題

- 既存テンプレート（29個中27個）はカード、セクション、コンテナが矩形ボックスのまま
- clip-pathによる不規則な形状は未実装

#### 今後の方針

- 空間テンプレートの追加（他カテゴリ向け）で段階的に矩形を減らす
- カード形状のclip-path化はP2で検討

---

### 原則6「呼吸するインターフェース」 — 75/100（前回: 55/100）

#### 改善内容（T-015 + T-016で実施）

| 層 | 呼吸状態 |
|----|---------|
| GradientMesh | ✅ breathPhase連動 |
| OrbitalRings | ✅ breathPhase連動 |
| AmbientParticles | ✅ breathPhase連動 |
| MouseGlow | ✅ breathPhase連動 |
| テンプレートコンテンツ | ✅ `breatheStyle(index)` で位相差つき呼吸（T-015） |
| 入力欄グロー | ✅ 独自conic-gradient回転 + proximity sensing |
| ContentPillars | ✅ `scale: [1, 1.06, 1]` + staggered delay + パレットカラーグロー（T-016） |

- **T-015**: `ai-breathe` CSSキーフレームを不規則リズムに修正（正弦波→perlin的な変化）。`breatheStyle(index)` で `animation-delay` をindexベースでずらし、「一人ずつが語る」を実現
- **T-016**: ContentPillarsの各ドットに微細なスケール脈動（3〜5秒周期、位相差 index*0.8秒）。アクティブドットにパレットカラーの固定グロー（boxShadowはアニメーションなし、静的）

#### 残る課題

- 入力欄のグロー回転とbreathPhaseの同期は未実装（独自リズムで十分に機能中）

---

### 原則7「毎回異なる体験」 — 75/100（前回: 50/100）

#### 改善内容（T-021 + T-022で実施）

- **空間テンプレート2つ追加**: テンプレート数が29→31に。Profile 6個、Skills 6個
- **spatial-layout.tsがVisualSeedを活用**: seeded randomで同じデータでもseedが変わると配置が変化
- **layoutVariant 3パターン実装（T-021）**: 全テンプレートで`layoutVariant`を A/B/C の3区間に分割し、各区間で異なる配置パターンを適用。例: ProfileHeroSplit A=50/50分割, B=中央単カラム, C=1/3+2/3非対称
- **seeded stagger全テンプレート適用（T-022）**: `seededStagger(colorOffset)` で全32テンプレートのアニメーションタイミング（stagger値 0.10〜0.20s）と方向（reverse）がseedで変化。装飾要素の角度・位置も `seededDecoration()` で変化
- 同じテンプレートの2回目表示が「明らかに違う配置・動き」になる

---

### 原則8「情報は知性的に提示する」 — 60/100（前回: 40/100）

#### 改善内容（T-023 + T-024で実施）

- **skills-constellation**: 情報を高密度に視覚化。レベル→ノードサイズ/輝度、カテゴリ→色、関連性→接続線
- **profile-spatial-hero**: 紹介文はline-clamp-3でクリックで展開。情報の段階的開示
- **density属性追加（T-023）**: `TemplateMeta`に`density: 'high' | 'medium' | 'low'`を追加。Skills系→high, Profile/Career/Projects→medium, Values/Contact→low
- **AIコメンタリー長さ制御（T-024）**: system-promptにdensityベースの指示追加。high=1文のみ, medium=2〜4文, low=3〜6文（ストーリーテリング可）

---

## 4. Welcome設計 — 65/100（前回: 30/100）

### 改善内容（T-004〜T-007で実施）

| 要素 | 改善前 | 改善後 |
|------|--------|--------|
| パーティクル | 8個、不透明度4〜16% | ✅ 20〜24個、不透明度8〜28%、サイズ1.2〜4.7px、glow率35%（T-004） |
| グラデーション球 | `${palette.primary}20` | ✅ `${palette.primary}35`、`${palette.secondary}28`（T-005） |
| キーワード | `text-sm` テキストリンク | ✅ `text-base`/`text-lg` + グロー背景円 + 3深度層 + 呼吸脈動（T-006） |
| 入力欄引力 | 近接グロー増幅のみ | ✅ パーティクルが時間経過で中心に引き寄せられ、距離依存の加速（T-007） |
| 全体印象 | 検索エンジンのトップ | ✅ パーティクルが漂い、キーワードが深度層で浮遊し、入力欄に引力がある空間 |

### 残る課題

- 「ここは普通のサイトではない」という印象のさらなる強化（初見で明確に伝わるか要検証）
- パーティクルの散開リアクション（ユーザーがクリック/入力時）は未実装

---

## 5. アニメーション設計 — 70/100（前回: 35/100）

### 原則違反の修正状況（T-001〜T-003で実施）

| 禁止ルール | 修正状況 | 対応内容 |
|-----------|---------|---------|
| `fade-in` / `slide-up` 禁止 | ✅ 修正済み | 全テンプレート（profile/skills/career/values/contact/text/projects）のitemVariantsからy移動を削除。テキストはopacityのみ、非テキストはscale/clipPathで出現 |
| テキストの `translateY` 禁止 | ✅ 修正済み | 全テンプレートの見出し・本文のtranslateYアニメーションを削除 |
| 微小距離アニメーション禁止 | ✅ 修正済み | ContentPillarsラベル `x:-4→0` → opacityのみ、FloatingInput Enter hint `x:4→0` → opacityのみ |
| `background`/`box-shadow` アニメ禁止 | ✅ 修正済み | shimmerをCSS translateXに変更、boxShadowを固定shadow+opacity切り替えに変更。stroke-dasharray（SVG固有）は許容 |

### 未実装の重要パターン

| パターン | 説明 | 現状 |
|---------|------|------|
| `ai-reveal` | AIがコンテンツを生成しているかのようなスタガー出現 | 未実装 |
| 退場アニメーション | 不要要素の滑らかな退場 | clipPathで隠れるだけ。個別要素の退場なし |
| 意味のある動き | 近づく=関連、離れる=無関係、光る=注目 | ✅ 部分実装: DwellHighlightで「光る=注目」を実現。skills-constellationで「近い=関連性高い」を実現 |

---

## 6. ContentPillars — 80/100（前回: 60/100）

### 改善内容（T-002 + T-013 + T-016 + T-017 + T-018で実施）

| 問題 | 修正状況 |
|------|---------|
| ホバーラベル `x:-4→0` | ✅ opacityのみに変更（T-002） |
| 完全に静的 | ✅ 各ドットにscale脈動 `[1, 1.06, 1]` + staggered delay index*0.8秒（T-016） |
| 状態変化が色のみ | ✅ アクティブドットにパレットカラーの固定グロー `boxShadow: 0 0 14px 4px` 追加（T-017） |
| searching時の応答なし | ✅ cursorSpeed='searching'でドットサイズ拡大（T-013） |
| ドットサイズが小さい | ✅ inactive 14px, active 22pxに拡大（T-017） |
| ノード間の接続線がない | ✅ 18px高の接続線を描画、アクティブ隣接で呼吸opacity（T-018） |
| 訪問済みドットの色つき未実装 | ✅ パレットカラー10%で着色 + 40% border（T-017） |

---

## 7. FloatingInput — 80/100（前回: 65/100）

### 改善内容（T-013 + T-014 + T-019 + T-020で実施）

| 問題 | 修正状況 |
|------|---------|
| サジェストが空間的でない | ✅ 放射状arc配置に変更（T-014） |
| searching時の応答なし | ✅ グロー不透明度ブースト（T-013） |
| コンテンツとの視覚的分離 | ✅ 冗長な`z-50`を削除、Canvas.tsx側のラッパーに統合（T-019） |
| layout アニメーション | ✅ `layout` prop除去、opacity fade-out/fade-inで遷移、遷移中はinput disabled（T-020） |

---

## 8. パフォーマンス関連の問題

### 現状の良い点

- GPU合成プロパティ（transform, opacity）のアニメーション方針 → ✅ 全テンプレートで遵守（T-003完了）
- `useMemo` によるレイアウト計算キャッシュ → 実装済み（spatial-layout.tsでも活用）
- MotionValue でマウス座標管理 → 不要な再レンダー防止済み
- CSS `@keyframes` で繰り返しアニメーション → ai-breathe, bg-drift, glow-rotate等
- boxShadowアニメーション → ✅ 固定shadow + opacity切り替えに修正済み（T-003）

### P3改善内容（T-025 + T-026で実施）

| 問題 | 修正状況 |
|------|---------|
| Framer Motionの繰り返しアニメーション | ✅ パーティクルをCSS `@keyframes`に移行。`useMemo`でユニークなキーフレームを生成、compositorスレッドで実行（T-025） |
| `will-change` の不在 | ✅ パーティクルに`will-change: transform`、OrbitalRings/MouseGlowに`will-change: transform, opacity`を付与（T-026） |
| `contain: layout paint` 不足 | ✅ TemplateShellに既に適用済みを確認。`isolation: isolate`もDepthLayerに適用済み（T-026） |

---

## 優先度マトリクス

| 優先度 | 改善領域 | 状況 |
|--------|---------|------|
| ~~**P0**~~ | ~~アニメーション原則違反の修正~~ | ✅ 完了（T-001〜T-003） |
| ~~**P0**~~ | ~~Welcome画面の強化~~ | ✅ 完了（T-004〜T-007） |
| ~~**P1**~~ | ~~テンプレートの空間配置化~~ | ✅ 完了（T-008〜T-011）profile-spatial-hero + skills-constellation |
| ~~**P1**~~ | ~~行動応答の強化~~ | ✅ 完了（T-012〜T-014）DwellHighlight + searching応答 + 放射状サジェスト |
| ~~**P1**~~ | ~~コンテンツ層の呼吸追加~~ | ✅ 完了（T-015〜T-016）ai-breathe改善 + ContentPillars脈動 |
| ~~**P2**~~ | ~~ContentPillarsの改善~~ | ✅ 完了（T-017〜T-018）ドット拡大+グロー+接続線 |
| ~~**P2**~~ | ~~FloatingInputの空間統合~~ | ✅ 完了（T-019〜T-020）Ghost統合+opacity遷移 |
| ~~**P2**~~ | ~~VisualSeedバリエーション強化~~ | ✅ 完了（T-021〜T-022）layoutVariant A/B/C+seeded stagger |
| ~~**P3**~~ | ~~情報密度の動的制御~~ | ✅ 完了（T-023〜T-024）density属性+AIコメンタリー長さ制御 |
| ~~**P3**~~ | ~~パフォーマンス最適化~~ | ✅ 完了（T-025〜T-026）CSS @keyframes+will-change |
