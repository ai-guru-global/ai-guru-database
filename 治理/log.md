---
name_zh: "全库操作日志"
---
# Wiki Operations Log

> 中文简称：全库操作日志

本文件记录对本知识库的重大维护动作，作为 `/wiki-status`、`/wiki-lint`、`/wiki-synthesize`、`/cross-linker` 等技能的时间线 baseline。

---

## 2026-06-30 — 全面结构治理 + 状态审计（本 session）

### 阶段 A：目录结构治理（由主 agent 直接执行）

1. **深度拉齐**：知识目录最深从 L5 压到 L3
   - `05_大模型/06_微调技术/PEFT_2026/` → 扁平化
   - `15_智能体/15_课程笔记/{Learn_Claude_Code,Microsoft_AI_Agents}/` → 扁平化
   - `15_智能体/07_Agent评估/demo/` → 迁出 `15_智能体/07_Agent评估/demo/`
   - `15_智能体/07_Agent评估/docs/{architecture,guides,api,reports}/*.md` → 上提为 L2 知识页

2. **7 项结构治理**
   - P0：`94_可视化/atlas/`（226 MB Vite 工程）→ `前端应用/atlas/`
   - P1：`AI运维/Observability/` 并入 `11_模型运维/08_可观测性/`
   - P1：`22_Research/` 并入 `20_Papers/` → 改名 `20_论文精读/`
   - P2：`07_模型训练/Fine_tuning_Strategies.md` → `05_大模型/06_微调技术/`（LLM 专属）
   - P2：`15_智能体/README.md` 加 4 分组索引（能力/评测/生态/工具与学习）
   - P2：`93_Tools/` 改名 `模板/`（消除与 `工具/` 和 `AI编程/Tools/` 的歧义）
   - P3：`91_Notes/` `92_Plan/` 归档到 `治理/notes/` `治理/plan/`

3. **wikilink 批量重写**：约 170+ 处跨文件引用更新，7 类旧路径残留全部归零

4. **章数**：L1 从 27 减到 25（-22_Research，-91_Notes/92_Plan 合并入 治理）

---

## 2026-07-10 — 模板/ 目录全面并入其他章节并删除

### 背景
`模板/` 目录长期存在定位漂移：既承载 AI 工具领域知识文章，又包含真正的可复用模板，还混有项目治理文件（文档模板规范、导入指南）。目录名与实际内容不符，README 出现重复 frontmatter，且与 `工具/`（项目脚本）容易混淆。

### 执行动作

1. **知识类长文迁回对应知识章节**
   - `模板/API_Templates/API_Design_for_AI.md` → `12_架构基建/11_AI网关/API_Design_for_AI.md`
   - `模板/LLM_Gateway/LLM_Gateway_Deep_Dive.md` → `12_架构基建/11_AI网关/LLM_Gateway_Deep_Dive.md`
   - `模板/API_Templates/Prompt_Management_Platform.md` → `11_模型运维/11_Prompt运维/Prompt_Management_Platform.md`
   - `模板/API_Templates/Documentation_Automation.md` → `11_模型运维/01_MLOps基础/Documentation_Automation.md`

2. **可复用模板迁至实践场景旁边**
   - `Model_Card_Template.md` → `11_模型运维/04_实验追踪/`
   - `Evaluation_Report_Template.md` → `08_模型评估/05_自动化评估/`
   - `Datasheet_Template.md` → `07_模型训练/02_数据工程/`
   - `Deployment_Runbook_Template.md` → `11_模型运维/07_模型服务/`
   - `Experiment_Tracking_Template.md` → `11_模型运维/04_实验追踪/`
   - `AB_Testing_Template.md` → `08_模型评估/05_自动化评估/`

3. **项目治理文件归拢到 `治理/`**
   - `模板/Meta/DOCUMENT_TEMPLATES.md` → `治理/Document_Templates.md`
   - `模板/Meta/IMPORT_GUIDE.md` → `治理/Import_Guide.md`
   - `模板/.knowledge_base_metadata.json` → `治理/knowledge_base_metadata.json`

4. **索引与交叉引用更新**
   - 更新所有迁移文件的 frontmatter（category、tags、updated）
   - 更新目的地 README/index：架构基建、模型运维、模型评估、模型训练、治理
   - 新建 `08_模型评估/05_自动化评估/索引.md`、`11_模型运维/11_Prompt运维/索引.md`、`11_模型运维/07_模型服务/索引.md`
   - 更新其他章节中指向 `模板/` 的 wikilink 与相对链接（AI Gateway、部署推理、模型训练、概念、行业应用、治理 plan/notes 等）

5. **清理**
   - 删除 `模板/` 目录及其全部残留索引、README、子目录

### 结果
- `模板/` 目录已不存在
- 所有迁移后的文件均已在目的地 README/index 中登记
- 迁移文件内部 Related/交叉引用已指向新位置
- 历史审计报告（`_content-audit-*`、`_improvement-execution-*` 等）保留原样，作为变更前状态记录

### 阶段 B：状态审计（`/wiki-status` 输出）

- 总页面 1225 · 已摄取源 37 · 摄取滞后 11 天
- Token 足迹 ~4.5M（4 chars/token 启发式；`core` 占 74%）
- Tier 分布：597 core / 577 supporting / 50 peripheral / 1 deep-dive（非标值）
- 锚点页 Top 3：`21_面试岗位/README`(123)、`21_面试岗位/jobs`(110)、`15_智能体/.../Evaluation_Workflow`(69)
- 桥页 Top 1：`90_学习/guides/ai_engineering_roadmap_2026.md`（跨 66 章）
- 孤儿页 706（按章：05=101, 15=91, 21=90, 12=52, 19=31）
- 陈旧核心页（updated ≥90 天 且 incoming ≥5）：0
- `治理/` 目录当前 4 篇，治理/hot.md 引用 OK，但跨域综合扫描 overdue
- `原始/github-sources/` 含 13548 文件（多为 `ailearning` 第三方归档）

### 阶段 C：后续动作（本 session 继续）

- [ ] 规范化 tier 非标值（deep-dive → supporting）
- [ ] tier 重平衡（按入链 + 新鲜度启发式）
- [ ] `/cross-linker`：修 706 孤儿
- [ ] `/wiki-synthesize`：生成本轮跨域综合页
- [x] `/wiki-lint`：建立 baseline → `治理/_lint-report-2026-06-30.md`
- [x] 21_Interviews 同质化调研（88 份 question_bank 是否应合并）

- [2026-06-30T22:30:00] 21_INTERVIEWS_ANALYSIS: 22 role dirs (14 thin/template + 7 rich + 1 stub), 85 subdirectory .md files, recommendation=OPTION_C (hybrid merge thin roles into 14 consolidated pages, keep 7 rich roles as separate files, fix double-frontmatter bug in AI_Evaluation_Engineer/question_bank.md, convert README.md relative links to wikilinks)
- [2026-06-30T22:30:00] LINT baseline: pages=1156 edges=8081 orphans=297 broken_links=199 missing_fm=81 missing_summary=65 stale=0 fragmented_tags=120 tier(supporting=1299,core=369,peripheral=87) synthesis_gaps=5_top_pairs report=治理/_lint-report-2026-06-30.md
- [2026-06-30T23:30:00] WIKI_SYNTHESIZE pages_scanned=1156 synthesis_created=4 candidates_skipped=2 created=[治理/finetuning-rag-decision.md(微调×RAG),治理/chinese-chips-inference.md(国产芯片×推理引擎),治理/llm-observability-aiops.md(LLM可观测×AIOps),治理/testing-agents.md(测试×Agent)] skipped=[rag-agents(已有),agent-evaluation-model-evaluation(已有)]

---

_本文件作为 wiki 维护操作时间线 baseline，后续每次 `/wiki-lint`、`/wiki-synthesize`、`/cross-linker`、`/wiki-rebuild` 都在此追加记录。_
- [2026-07-01T00:30:00] 21_INTERVIEWS_MERGE option_c: merged 14 thin roles (4 files each) into 15 consolidated pages (incl. Cloud_Ops stub); kept 7 rich roles (28 files) untouched; fixed AI_Evaluation_Engineer double-frontmatter bug; converted README.md relative Markdown links to wikilinks; expanded jobs.md Related with 15 consolidated role links; cleaned generic aliases (Interview Preparing / Question Bank / ...) from consolidated pages; deduped Related sections. files=85→43 (−42).
- [2026-07-01T00:30:00] RESCAN post-merge: pages=1650 edges=10531 orphans=26 (19 概念 concept-cards + 3 cheat-sheets + 3 root/system). broken_thin-role_refs=0. rich-role internal cross-links intact.
- [2026-06-25T15:59:34] CAPTURE type=concept page="概念/activation-value.md" title="激活值 (Activation Value)"
- [2026-06-25T15:59:34] CAPTURE type=concept page="概念/gradient-descent.md" title="梯度下降 (Gradient Descent)"

## 关联

项目日志记录治理与内容演进，关联文档提供流程依据与规划上下文。

- [[治理/ROADMAP|项目路线图]] — 日志对应里程碑的规划
- [[治理/Content_Governance|内容治理]] — 日志中操作的流程规范
- [[治理/Quality_Metrics|质量度量]] — 阶段性验收的指标
- [[治理/_content-audit-2026-07-01|内容审计 2026-07-01]] — 阶段性审计记录
- [[治理/_governance-worklog-2026-06-22|治理工作日志]] — 治理专项工作记录
- [[治理/KNOWN_ISSUES|已知问题]] — 日志中记录的问题清单
- [[治理/CONTRIBUTING|贡献指南]] — 日志条目对应贡献规范
