# Wiki Operations Log

本文件记录对本知识库的重大维护动作，作为 `/wiki-status`、`/wiki-lint`、`/wiki-synthesize`、`/cross-linker` 等技能的时间线 baseline。

---

## 2026-06-30 — 全面结构治理 + 状态审计（本 session）

### 阶段 A：目录结构治理（由主 agent 直接执行）

1. **深度拉齐**：知识目录最深从 L5 压到 L3
   - `大模型/Fine_tuning_Techniques/PEFT_2026/` → 扁平化
   - `Agent/Course_Notes/{Learn_Claude_Code,Microsoft_AI_Agents}/` → 扁平化
   - `Agent/Agent_Evaluation/demo/` → 迁出 `_projects/Agent_Evaluation/demo/`
   - `Agent/Agent_Evaluation/docs/{architecture,guides,api,reports}/*.md` → 上提为 L2 知识页

2. **7 项结构治理**
   - P0：`94_Visualization/atlas/`（226 MB Vite 工程）→ `_projects/atlas/`
   - P1：`AI运维/Observability/` 并入 `MLOps/Observability/`
   - P1：`22_Research/` 并入 `20_Papers/` → 改名 `论文精读/`
   - P2：`模型训练/Fine_tuning_Strategies.md` → `大模型/Fine_tuning_Techniques/`（LLM 专属）
   - P2：`Agent/README.md` 加 4 分组索引（能力/评测/生态/工具与学习）
   - P2：`93_Tools/` 改名 `93_Templates/`（消除与 `_tools/` 和 `AI编程/Tools/` 的歧义）
   - P3：`91_Notes/` `92_Plan/` 归档到 `_meta/notes/` `_meta/plan/`

3. **wikilink 批量重写**：约 170+ 处跨文件引用更新，7 类旧路径残留全部归零

4. **章数**：L1 从 27 减到 25（-22_Research，-91_Notes/92_Plan 合并入 _meta）

### 阶段 B：状态审计（`/wiki-status` 输出）

- 总页面 1225 · 已摄取源 37 · 摄取滞后 11 天
- Token 足迹 ~4.5M（4 chars/token 启发式；`core` 占 74%）
- Tier 分布：597 core / 577 supporting / 50 peripheral / 1 deep-dive（非标值）
- 锚点页 Top 3：`面试岗位/README`(123)、`面试岗位/jobs`(110)、`Agent/.../Evaluation_Workflow`(69)
- 桥页 Top 1：`90_Learn/guides/ai_engineering_roadmap_2026.md`（跨 66 章）
- 孤儿页 706（按章：05=101, 15=91, 21=90, 12=52, 19=31）
- 陈旧核心页（updated ≥90 天 且 incoming ≥5）：0
- `_synthesis/` 目录当前 4 篇，hot.md 引用 OK，但跨域综合扫描 overdue
- `_raw/github-sources/` 含 13548 文件（多为 `ailearning` 第三方归档）

### 阶段 C：后续动作（本 session 继续）

- [ ] 规范化 tier 非标值（deep-dive → supporting）
- [ ] tier 重平衡（按入链 + 新鲜度启发式）
- [ ] `/cross-linker`：修 706 孤儿
- [ ] `/wiki-synthesize`：生成本轮跨域综合页
- [x] `/wiki-lint`：建立 baseline → `_meta/_lint-report-2026-06-30.md`
- [x] 21_Interviews 同质化调研（88 份 question_bank 是否应合并）

- [2026-06-30T22:30:00] 21_INTERVIEWS_ANALYSIS: 22 role dirs (14 thin/template + 7 rich + 1 stub), 85 subdirectory .md files, recommendation=OPTION_C (hybrid merge thin roles into 14 consolidated pages, keep 7 rich roles as separate files, fix double-frontmatter bug in AI_Evaluation_Engineer/question_bank.md, convert README.md relative links to wikilinks)
- [2026-06-30T22:30:00] LINT baseline: pages=1156 edges=8081 orphans=297 broken_links=199 missing_fm=81 missing_summary=65 stale=0 fragmented_tags=120 tier(supporting=1299,core=369,peripheral=87) synthesis_gaps=5_top_pairs report=_meta/_lint-report-2026-06-30.md
- [2026-06-30T23:30:00] WIKI_SYNTHESIZE pages_scanned=1156 synthesis_created=4 candidates_skipped=2 created=[_synthesis/finetuning-rag-decision.md(微调×RAG),_synthesis/chinese-chips-inference.md(国产芯片×推理引擎),_synthesis/llm-observability-aiops.md(LLM可观测×AIOps),_synthesis/testing-agents.md(测试×Agent)] skipped=[rag-agents(已有),agent-evaluation-model-evaluation(已有)]

---

_本文件作为 wiki 维护操作时间线 baseline，后续每次 `/wiki-lint`、`/wiki-synthesize`、`/cross-linker`、`/wiki-rebuild` 都在此追加记录。_
- [2026-07-01T00:30:00] 21_INTERVIEWS_MERGE option_c: merged 14 thin roles (4 files each) into 15 consolidated pages (incl. Cloud_Ops stub); kept 7 rich roles (28 files) untouched; fixed AI_Evaluation_Engineer double-frontmatter bug; converted README.md relative Markdown links to wikilinks; expanded jobs.md Related with 15 consolidated role links; cleaned generic aliases (Interview Preparing / Question Bank / ...) from consolidated pages; deduped Related sections. files=85→43 (−42).
- [2026-07-01T00:30:00] RESCAN post-merge: pages=1650 edges=10531 orphans=26 (19 _concepts concept-cards + 3 cheat-sheets + 3 root/system). broken_thin-role_refs=0. rich-role internal cross-links intact.
- [2026-06-25T15:59:34] CAPTURE type=concept page="_concepts/activation-value.md" title="激活值 (Activation Value)"
- [2026-06-25T15:59:34] CAPTURE type=concept page="_concepts/gradient-descent.md" title="梯度下降 (Gradient Descent)"
