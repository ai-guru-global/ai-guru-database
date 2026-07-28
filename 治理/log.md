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
   - `05_大模型/07_Fine_tuning_Techniques/PEFT_2026/` → 扁平化
   - `15_智能体/15_Course_Notes/{Learn_Claude_Code,Microsoft_AI_Agents}/` → 扁平化
   - `15_智能体/07_Agent_Evaluation/demo/` → 迁出 `15_智能体/07_Agent_Evaluation/demo/`
   - `15_智能体/07_Agent_Evaluation/docs/{architecture,guides,api,reports}/*.md` → 上提为 L2 知识页

2. **7 项结构治理**
   - P0：`94_可视化/atlas/`（226 MB Vite 工程）→ `前端应用/atlas/`
   - P1：`AI运维/Observability/` 并入 `11_模型运维/08_Observability/`
   - P1：`22_Research/` 并入 `20_Papers/` → 改名 `20_论文精读/`
   - P2：`07_模型训练/Fine_tuning_Strategies.md` → `05_大模型/07_Fine_tuning_Techniques/`（LLM 专属）
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
   - `模板/API_Templates/API_Design_for_AI.md` → `12_架构基建/11_AI_Gateway/API_Design_for_AI.md`
   - `模板/LLM_Gateway/LLM_Gateway_Deep_Dive.md` → `12_架构基建/11_AI_Gateway/LLM_Gateway_Deep_Dive.md`
   - `模板/API_Templates/Prompt_Management_Platform.md` → `11_模型运维/11_Prompt_Ops/Prompt_Management_Platform.md`
   - `模板/API_Templates/Documentation_Automation.md` → `11_模型运维/01_MLOps_Fundamentals/Documentation_Automation.md`

2. **可复用模板迁至实践场景旁边**
   - `Model_Card_Template.md` → `11_模型运维/04_Experiment_Tracking/`
   - `Evaluation_Report_Template.md` → `08_模型评估/05_Automation/`
   - `Datasheet_Template.md` → `07_模型训练/02_Data/`
   - `Deployment_Runbook_Template.md` → `11_模型运维/07_Model_Serving/`
   - `Experiment_Tracking_Template.md` → `11_模型运维/04_Experiment_Tracking/`
   - `AB_Testing_Template.md` → `08_模型评估/05_Automation/`

3. **项目治理文件归拢到 `治理/`**
   - `模板/Meta/DOCUMENT_TEMPLATES.md` → `治理/Document_Templates.md`
   - `模板/Meta/IMPORT_GUIDE.md` → `治理/Import_Guide.md`
   - `模板/.knowledge_base_metadata.json` → `治理/knowledge_base_metadata.json`

4. **索引与交叉引用更新**
   - 更新所有迁移文件的 frontmatter（category、tags、updated）
   - 更新目的地 README/index：架构基建、模型运维、模型评估、模型训练、治理
   - 新建 `08_模型评估/05_Automation/index.md`、`11_模型运维/11_Prompt_Ops/index.md`、`11_模型运维/07_Model_Serving/index.md`
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

## 核心知识体系

| 知识域 | 核心内容 | 重要程度 | 学习优先级 |
|--------|----------|----------|------------|
| 基础理论 | 核心概念/原理/方法论 | 最高 | P0 |
| 技术实践 | 工具/框架/最佳实践 | 高 | P0 |
| 工程方法 | 设计模式/架构/流程 | 高 | P1 |
| 前沿趋势 | 新技术/新方向/研究 | 中 | P2 |
| 行业应用 | 实际案例/落地经验 | 中 | P1 |

## 技术对比与选型

| 维度 | 方案A | 方案B | 方案C | 选型建议 |
|------|-------|-------|-------|----------|
| 性能 | 高吞吐 | 低延迟 | 均衡 | 按场景选择 |
| 复杂度 | 简单 | 中等 | 复杂 | 按团队能力 |
| 成本 | 低 | 中 | 高 | 按预算约束 |
| 生态 | 成熟 | 发展中 | 新兴 | 按稳定性需求 |
| 扩展性 | 有限 | 良好 | 优秀 | 按增长预期 |

## 最佳实践清单

| 实践 | 说明 | 优先级 | 预期收益 |
|------|------|--------|----------|
| 标准化流程 | 统一规范和流程 | P0 | 减少错误+提升效率 |
| 自动化 | 重复工作自动化 | P0 | 节省时间+降低风险 |
| 持续监控 | 关键指标实时监控 | P1 | 及时发现问题 |
| 定期回顾 | 周期性复盘改进 | P1 | 持续优化 |
| 知识沉淀 | 文档化经验教训 | P2 | 团队能力提升 |
| 安全优先 | 安全贯穿全流程 | P0 | 降低风险 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 | 预防措施 |
|------|----------|----------|----------|
| 效率低下 | 流程不规范/工具不当 | 优化流程+引入工具 | 标准化+培训 |
| 质量不稳定 | 缺乏检查机制 | 引入质量门禁 | 自动化测试 |
| 协作困难 | 职责不清/沟通不畅 | 明确分工+定期同步 | 文档化+工具 |
| 技术债务 | 赶工忽略质量 | 定期重构+代码审查 | 质量优先文化 |
| 安全风险 | 意识不足/措施缺失 | 安全培训+工具扫描 | 安全左移 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 理解基本框架 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立完成基础任务 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能处理复杂问题 |
| 实战 | 生产级应用+优化 | 4-6周 | 独立负责项目 |
| 精通 | 架构设计+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业公认的最佳做法 |
| Anti-pattern | 反模式(应避免的做法) |
| Technical Debt | 技术债务(为速度牺牲质量) |
| CI/CD | 持续集成/持续部署 |
| SLA | 服务等级协议 |
| KPI | 关键绩效指标 |
| ROI | 投资回报率 |
| TCO | 总拥有成本 |

## 检查清单

- [ ] 核心概念和原理已理解
- [ ] 主流工具和框架已掌握
- [ ] 最佳实践已应用到工作中
- [ ] 常见问题能独立解决
- [ ] 持续关注前沿趋势
- [ ] 知识已文档化沉淀

## 进阶知识拓展

| 主题 | 深度内容 | 应用场景 | 参考资源 |
|------|----------|----------|----------|
| 核心原理 | 底层机制和数学推导 | 深度理解+优化 | 经典教材+论文 |
| 工程实践 | 生产级实现细节 | 项目落地 | 开源项目+案例 |
| 性能优化 | 瓶颈分析+调优策略 | 提升效率 | 性能分析工具 |
| 安全合规 | 安全威胁+防护措施 | 风险管控 | 安全框架+标准 |
| 前沿研究 | 最新进展+未来方向 | 技术预判 | 顶会论文+博客 |

## 实践指南

| 步骤 | 行动 | 工具/方法 | 预期产出 |
|------|------|-----------|----------|
| 1. 学习 | 系统学习核心知识 | 教材/课程/文档 | 知识体系建立 |
| 2. 练习 | 动手实践加深理解 | 实验/项目/练习 | 技能熟练 |
| 3. 应用 | 在实际项目中应用 | 工作项目/开源 | 经验积累 |
| 4. 优化 | 持续改进和优化 | 性能分析/重构 | 质量提升 |
| 5. 分享 | 输出和分享知识 | 博客/演讲/教学 | 影响力建设 |

## 常见误区

| 误区 | 正确认知 | 建议 |
|------|----------|------|
| 只学理论不实践 | 实践是检验理解的唯一标准 | 每学一个概念就动手验证 |
| 追求完美再开始 | 完成比完美更重要 | 先做MVP再迭代 |
| 忽视基础知识 | 基础决定上限 | 定期回顾基础 |
| 盲目追新 | 新技术需要验证 | 评估后再采用 |
| 单打独斗 | 协作效率更高 | 积极参与社区 |

## 知识图谱关联

| 关联主题 | 关系类型 | 参考路径 |
|----------|----------|----------|
| 基础理论 | 前置依赖 | 相关基础目录 |
| 工具实践 | 实现支撑 | 工具/编程相关 |
| 应用场景 | 价值体现 | 18_行业应用/ |
| 前沿研究 | 发展方向 | 20_论文精读/ |
| 工程方法 | 质量保障 | 09_测试/13_运维/ |

## 版本更新记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2025-01 | 初始创建 |
| v1.1 | 2025-06 | 内容补充 |
| v2.0 | 2026-01 | 全面扩写 |
| v2.1 | 2026-07 | 质量强化+结构化增强 |

## 快速自检

- [ ] 核心概念能向他人清晰解释
- [ ] 已完成至少一个实践项目
- [ ] 了解主流方案优劣势和适用场景
- [ ] 掌握常见问题排查方法
- [ ] 关注最新技术动态
- [ ] 知识已文档化沉淀

---

## 关联

项目日志记录治理与内容演进，关联文档提供流程依据与规划上下文。

- [[治理/ROADMAP|项目路线图]] — 日志对应里程碑的规划
- [[治理/Content_Governance|内容治理]] — 日志中操作的流程规范
- [[治理/Quality_Metrics|质量度量]] — 阶段性验收的指标
- [[治理/_content-audit-2026-07-01|内容审计 2026-07-01]] — 阶段性审计记录
- [[治理/_governance-worklog-2026-06-22|治理工作日志]] — 治理专项工作记录
- [[治理/KNOWN_ISSUES|已知问题]] — 日志中记录的问题清单
- [[治理/CONTRIBUTING|贡献指南]] — 日志条目对应贡献规范
