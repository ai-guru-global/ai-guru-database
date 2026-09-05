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

---

## 2026-09-04 — 项目整体评估报告沉淀

- 新增 [[治理/_meta/_evaluation-2026-09-04|项目整体评估 2026-09-04]]：综合评分 4/5（骨架 90 分 / 执行 70 分）。
- 实测读数（eval_scan 口径）：2,821 文件 / 90 万行 / 32.7 MB / 24,622 wikilinks；真断链 2,944 次 / 879 唯一目标（对 07-27 严口径基线 679 次 / 446 目标显著回归）；孤立 204。
- 关键判定：P0-5 / P2-6 巡检工具 CI 化未落地是回归根因；多工具度量口径分裂导致 [[治理/ROADMAP|路线图]] OKR 数字失真。
- 行动项：断链批修（smart_fix_links / batch_fix_links）→ CI 门禁落地 → 统一度量口径 → 仓库瘦身（.git 1.1 GB）→ 重写 [[治理/KNOWN_ISSUES|已知问题]]，详见评估报告 §七。

## 2026-09-04（下午） — P2-6 断链门禁落地 + 首轮断链批修

- **重映射修复**：新增 `工具/fix_wikilinks_precise.py`（只重写 wikilink 目标、保留别名 / 锚点 / 表格转义、默认 dry-run、路径容器校验），按人工核实的 41 项映射批量修复 **358 处断链**（252 文件）。主因是 6-7 月批量改名迁移：如 `MoE_Case_Studies_DeepSeek_Mixtral` → `12_MoE_案例_Studies_深度Seek_Mixtral`、`Tool_Calling_Best_Practices` → `14_工具调用_最佳实践`。
- **补建枢纽页**：4 个被高频引用但从未创建的页面（50 处引用随之解析）——`15_智能体/Agent_Production_Deployment_Runbook`、`00_入门/02_技术概览/AI_New_Architectures`、`02_机器学习/ML-in-nutshell`、`17_伦理安全/Ethics-in-nutshell`，均含完整 frontmatter 与 ≥4 条真实出链。
- **门禁落地（P2-6 ✅）**：`工具/link_gate.py`（runpy 进程内复用 check_wikilinks 扫描逻辑）+ 基线 `治理/_meta/link-health-baseline.json`（断链 1795）+ pre-commit 钩子扩展（暂存 .md 时触发，实测约 5s）+ `.github/workflows/link-health.yml`。正反测试通过：注入临时断链即被阻断，清理后恢复通过。
- **指标变化（check_wikilinks 口径）**：断链 2,201 → **1,795** 次（-18.4%），唯一目标 628 → 580，断链率 8.9% → **7.2%**；eval_scan 口径 2,944 → 2,560。剩余 580 个缺失目标多为「规划中未建页」（GenAI L01-L06 课程页、Dashboard / Cheat_Sheet 类），留待后续内容补齐；门禁已锁定回归。
- 治理同步：[[治理/ROADMAP|路线图]] P2-6 状态 ⏳ → ✅。

## 2026-09-04（傍晚） — 发展计划制定 + 第一阶段执行

- **沉淀 [[治理/_meta/development-plan-2026-09|发展计划 2026-09]]**：三阶段主线（门禁补完 / 内容收敛 / 产品化），含任务拆解与验收标准。
- **任务 1.1 ✅**：新增 `工具/move_page.py` 改名安全工具（移动 + 全库入链重写 + dry-run 默认 + relative_to 容器校验）。实战首用：`12_MoE_案例_Studies_深度Seek_Mixtral` 恢复规范名 `12_MoE_Case_Studies_DeepSeek_Mixtral`，31 处入链同步重写，门禁通过并收紧基线至 **1,794**（裸名称断链随之解析 -1）。
- **任务 1.3 🔄**：README / README_EN 徽章与章节表、[[治理/ROADMAP|路线图]] 指标表与 OKR 当前值（KR1.1 / KR2.1-KR2.3）全部刷新为 eval_scan 唯一事实源实测口径（2,826 篇 / 1,928 万字 / 断链率 7.2%），消除 3 倍失真。
- **任务 1.4 ✅**：[[治理/KNOWN_ISSUES|已知问题]]全面重写为真实问题登记簿（ISS-101~107，含根因 / 处置 / 验收标准），替换原模板演示内容。
- **任务 1.5 ✅**：`.gitignore` 排除 `.mimosa/`（阻断工具噪音入库）；自本日起提交采用 conventional commits。
- 门禁最终态：断链 1,794 / 率 7.2%，基线锁定。

## 2026-09-04（晚） — INDEX 陈旧化巡检 + basename 回退修复

- 证伪「mkdocs 副本兜底解析」假说：`AI_Governance_Compliance_2026` 等旧英文名链接本就计在断链清单内（共 37 处），mkdocs 下同名项是目录而非文件；`performance` 为全路径有效链接（扫描误报）。库内不存在「隐性断链」类。
- `工具/fix_wikilinks_precise.py` 升级：新增 basename 回退匹配（6 项旧英文名 → 现中文名映射）与**已解析链接保护**（basename 回退仅对断链生效，杜绝误改）。
- 追加修复 **111 处**（85 文件 / 38 目标）——主要是此前精确匹配漏掉的「带章节前缀变体」（如 `13_运维/02_SRE与可靠性/GPU_OOM_Troubleshooting_Guide` ×9）。
- 基线收紧：1,794 → **1,683**（断链率 7.2% → **6.7%**）；治理文档（KNOWN_ISSUES / ROADMAP 指标表与 OKR / 发展计划）数字同步。

## 2026-09-04（深夜） — 查漏补缺：门禁 v2 + mimosa 出库 + 内容冲刺

- **合入期回归修复**：会话间协作者编辑引入 12 处新断链实例，经 diff 解析定位后以 7 项新映射批量修复 67 处（含 `AI_Research_Engineer` ×9、`Scaling_Laws_and_Training_Dynamics` → `06_扩展定律_and_训练_Dynamics` 等）。
- **`.mimosa/` 出库**：`git rm -r --cached` 解除 1,783 个已追踪工具状态文件（.gitignore 昨已排除，本步补齐存量）。
- **任务 1.2 ✅（2/3）**：`工具/link_gate.py` v2 —— runpy 进程内复用 checker 函数，一次扫描产出三项指标（断链 / 孤立页 / frontmatter 8 字段完整性），全部基线化只降不升；三类反向测试均正确拦截；基线 1,598 / 779 / 770 已持久化。中英间距检查待编排 `fix_spacing.py`。
- **内容冲刺**：补建 [[14_RAG系统/RAG-in-nutshell|RAG 速览]]（9 处引用解析）与 [[05_大模型/09_多模态模型/Multimodal_Models_for_dummy|多模态模型大白话]]（9 处引用解析）。
- **任务 1.3 收尾**：[[治理/Quality_Metrics|质量度量]] 增加口径声明（eval_scan 唯一事实源 + 门禁基线指针）。
- 门禁终态：断链 **1,598 / 6.4%**、孤立 779、frontmatter 缺失 770，三项基线锁定。

## 2026-09-04（收官） — 第一阶段完成 + 周运营节奏确立

- **任务 1.2 补齐第 4 项 ✅**：中英间距检查以 `fix_spacing.py` 差分复用接入 link_gate v2.1（规则与修复工具零漂移，零自造正则），基线 1,678 持久化；四类反向测试全部通过。**第一阶段 1.1–1.5 全部完成。**
- **§1.6 周巡检 Runbook** 制定（每周 30 分钟：gate → 断链三分类 → 冲刺 → 收紧基线；月底 eval_scan 刷新指标表）。
- **§3.2 RAG 助手 MVP 提前至 Q4**：范围收敛为向量检索 + 引用溯源 + 门禁数据质检层，目标两周 demo。
- **22-FDE 定位决策**：保持专项目录（连字符命名，不纳入章节编号），README 增加定位声明并与工信部 414 号文政策页互链；`gen_subdir_indexes.py` 判定不重跑（与禁跑的迁移脚本耦合），INDEX 陈旧化已由批修与门禁覆盖（两个 INDEX 旧名残留实测为 0）。

## 关联

项目日志记录治理与内容演进，关联文档提供流程依据与规划上下文。

- [[治理/ROADMAP|项目路线图]] — 日志对应里程碑的规划
- [[治理/Content_Governance|内容治理]] — 日志中操作的流程规范
- [[治理/Quality_Metrics|质量度量]] — 阶段性验收的指标
- [[治理/_content-audit-2026-07-01|内容审计 2026-07-01]] — 阶段性审计记录
- [[治理/_governance-worklog-2026-06-22|治理工作日志]] — 治理专项工作记录
- [[治理/KNOWN_ISSUES|已知问题]] — 日志中记录的问题清单
- [[治理/CONTRIBUTING|贡献指南]] — 日志条目对应贡献规范
