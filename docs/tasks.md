# 実装タスク一覧

**基準:** [evaluation.md](evaluation.md) の評価結果 (42/100) + [design-principles.md](design-principles.md)
**前回スコア:** 18/100 → **現在:** 42/100（+24）
**最終評価日:** 2026-02-18
**評価手法:** コードベース全量読解 + Playwright 31テスト全通過 + DOMメトリクス自動収集

---

## 完了済みタスク

### P0: データが画面に表示されること（情報伝達の回復）

| タスク | 内容 | 状態 |
|--------|------|------|
| T-001 | Career テンプレートのデータ参照修正（`positions` → `history`） | **完了** |
| T-002 | Skills ノードラベル可読性修正（maxWidth撤廃、フォントサイズ拡大） | **完了** |
| T-003 | 空間テンプレート6つの `as any` 排除・型定義追加 | **完了** |

### P1: モバイルレイアウトの修正

| タスク | 内容 | 状態 |
|--------|------|------|
| T-005 | 空間座標計算のレスポンシブ対応 | **完了** |
| T-006 | Skills (Constellation) のモバイルレイアウト | **完了** |
| T-007 | Projects (SpatialOrbit) のモバイルレイアウト | **完了** |
| T-008 | Profile (SpatialHero) のモバイルレイアウト | **完了** |

### P2: Welcome画面・体験品質の改善

| タスク | 内容 | 状態 |
|--------|------|------|
| T-009 | 入力欄の視覚的存在感強化（プレースホルダー改善、グロー強化） | **完了** |
| T-010 | Welcome キーワードのホバーアンダーライン追加 | **完了** |
| T-011 | 背景環境の存在感強化（パーティクル増量、軌道リングopacity引上げ） | **完了** |
| T-012 | 行動観察の視覚応答をDwellHighlight等で知覚可能に引上げ | **完了** |

### P3: コード品質・保守性

| タスク | 内容 | 状態 |
|--------|------|------|
| T-013 | StaticFallback リファクタリング（重複コンポーネント→TemplateShellからimport、932→833行） | **完了** |
| T-014 | React規約違反修正（useMemo内Math.random()→ref、Map直接変更→immutable更新） | **完了** |
| T-015 | モジュールレベル可変状態解消（`let msgCounter` → `useRef`） | **完了** |
| T-016 | ErrorBoundary追加（TemplateErrorBoundary → StaticFallbackフォールバック） | **完了** |
| T-017 | レートリミットのメモリリーク対策 + クライアント側スロットル追加 | **完了** |

---

## 未完了・新規タスク

### P0: データの完成度（最大のスコア向上要因）

### T-004: 実データの投入
- **問題:** BUG-003 — 全画面にプレースホルダーデータ（「あなたの名前」「株式会社○○」）
- **影響:** 全カテゴリのスコアに直接影響。推定 +15〜20 ポイント
- **修正箇所:** `src/data/` 配下の全 JSON ファイル
  - `profile.json` — 実名、タイトル、自己紹介文
  - `career.json` — 実際の職歴（複数エントリで空間配置の効果が発揮される）
  - `skills.json` — 実際のスキルセットと習熟度
  - `projects.json` — 実プロジェクト情報
  - `values.json` — 実際の価値観
  - `contact.json` — 実際の連絡先
- **状態:** ユーザーのデータ提供待ち
- **確認画面:** D05-profile, D11-career, M03-profile-mobile, M06-career-mobile

---

## 完了済みタスク（第3回修正 2026-02-18）

### P0: コード品質

| タスク | 内容 | 状態 |
|--------|------|------|
| T-018 | 非空間テンプレート26ファイル + `route.ts` + `useVoiceInput.ts` の `as any` 排除。全テンプレートで型安全なキャスト（`ProfileData`, `SkillsData`, `ProjectsData`, `CareerData`, `ValuesData`, `ContactData`）に置換。キャリアテンプレートのローカル `CareerEntry` 重複型も削除。`tsc --noEmit` エラーなし | **完了** |

### P1: 視覚的インパクト・可読性

| タスク | 内容 | 状態 |
|--------|------|------|
| T-019 | Projects テンプレート（SpatialOrbit）の低コントラストテキスト修正。tagline を `palette.glow` → `text-gray-700`、stackバッジを `palette.glow` → `palette.primary` に変更 | **完了** |
| T-020 | Welcome の第一印象強化。GradientMesh に `intensified` モード追加（blob サイズ拡大・opacity増・3つ目のblob追加）、OrbitalRings opacity引上げ（0.15-0.30→0.20-0.40）、FloatingInput の入力欄ハロー強化（サイズ・opacity増）、Ghost下線にboxShadow追加 | **完了** |
| T-021 | 行動観察の応答を知覚可能レベルに強化。DwellHighlight の boxShadow/border/scale/背景を大幅強化、コンテンツハイライトの inset shadow を0.04→0.10に引上げ、ProactiveResponse のアイドル応答パラメータ増強（nudge 0.3→0.5, hint 0.6→0.8, suggest 1.0→1.2, searching 0.4→0.6） | **完了** |

### P2: モバイル完成度

| タスク | 内容 | 状態 |
|--------|------|------|
| T-022 | StaticFallback のモバイルレイアウト修正。`computeLayout` を早期リターン方式でモバイル専用レイアウトに分離（radius 20→30、y圧縮0.55→0.85、scale 0.65→0.55、x方向0.6倍で左右スタガー） | **完了** |
| T-023 | Projects モバイルの右端はみ出し修正。SpatialOrbit でモバイル時にposition x を18-82%に追加クランプ（ノードピクセル幅を考慮） | **完了** |
| T-024 | StaticFallback のヒットエリア修正。`-inset-10` div に `pointer-events-none` を追加し、隣接ノードへのクリック横取りを解消 | **完了** |

---

## 確認結果

- `tsc --noEmit`: エラーなし ✓
- `next build`: 成功 ✓
- `as any` 残存: テンプレート・route.ts・useVoiceInput.ts 全てゼロ ✓

---

## 完了基準

各タスク完了時に以下を確認:
1. `tsc --noEmit` でコンパイルエラーなし
2. `next build` が成功
3. Playwright でデスクトップ + モバイルのスクリーンショットを再撮影し、修正を目視確認
4. 修正箇所が他のテンプレート・画面に悪影響を与えていないこと
5. `eval-screenshots/metrics.json` の該当メトリクスが改善していること
