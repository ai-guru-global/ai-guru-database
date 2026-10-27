---
title: P0 任务清单 2026-10
category: 92-plan
tags: ["strategy", "task-list", "p0", "2026-10"]
summary: "内容战略体检 2026-10 的 P0 深度专题执行清单：Deep Research 专题（14_RAG系统/08_Deep_Research）、Agent 记忆专题化（15_智能体/06_记忆基础设施）、Computer Use 专题（15_智能体/21_Computer_Use），含落点编号、工作量估算与收尾门禁。"
created: 2026-10-25
updated: 2026-10-27
tier: supporting
aliases: ["P0 任务清单", "P0 Task List 2026-10"]
sources: []
name_zh: "P0 任务清单 2026-10"
---

# P0 任务清单 2026-10

> 中文简称：P0 任务清单 2026-10

> **一句话理解**: 体检报告 P0 结论的深度专题执行版——三个面试必考专题（Deep Research / Agent 记忆 / Computer Use）的新建目录、落点编号、工作量与门禁全表；快赢部分已由体检页 P0 清单完成，本清单承载尚未动工的体系化部分。

---

> 来源：[[治理/Content_Strategy_Audit_2026_10|内容战略体检 2026-10]] P0 结论（原 HTML 可视化版已随本文入库而废弃）。
> 现状已于 2026-10-25 实测核实：Deep Research 全库 0 篇；Computer Use 无章节级页面（仅 gui-agent 概念卡 273 行）；Agent 记忆在 `15_智能体/06_记忆基础设施` 已有 4 篇内容页 + 2 张重复概念卡。
> 工作量标记：S ≤半天 / M ≈1 天 / L ≈2 天。
> **状态（2026-10-27 入库）**：体检页 P0 快赢已完成（Deep Research 总览落 `15_智能体/17_Agent应用/02_Deep_Research_Agent.md`、Computer Use 乱码修复、记忆主页 2026 增量）；本清单的深度专题（新建目录 + 成体系页面）尚未动工。

## 总览

| 专题 | 落点 | 现状 | 新增/改写 | 合计工作量 | 建议顺序 |
|------|------|------|-----------|-----------|---------|
| P0-1 Deep Research | `14_RAG系统/08_Deep_Research/`（新目录） | 全库 0 覆盖 | 5 篇 + 1 概念卡 + 互链 | ~5 天 | ① 先做，面试必问且零覆盖 |
| P0-3 Agent 记忆专题化 | `15_智能体/06_记忆基础设施/` | 已有 4 篇（含 1 薄页）+ 2 重复卡 | 4 新 + 1 扩写 + 卡合并 + 互链 | ~3.5 天 | ② 底料最厚，最快出成果，直接服务本地千问项目 |
| P0-2 Computer Use / GUI Agent | `15_智能体/21_Computer_Use/`（新目录）+ 28 系列 1 篇 | 仅 1 张概念卡 | 4 篇 + 28 系列 1 篇 + 1 扩写卡 + 1 新卡 + 互链 | ~5.5 天 | ③ 工作量最大，可与其他并行 |

纯写作约 14 个工作日；AI 辅助可压缩到 3–4 个会话。

---

## P0-1 Deep Research 专题（新建目录 `wiki/14_RAG系统/08_Deep_Research/`）

- [ ] **1.1 全景页** `01_Deep_Research_全景_2026.md`（M）
  - 一句话理解；定义：RAG 的 Agent 化演进（规划 → 并行检索 → 交叉验证 → 综合成报）
  - 辨析表：Deep Research vs 传统 RAG vs Agentic RAG vs 普通聊天搜索
  - 产品格局：OpenAI / Gemini / Claude Research / Perplexity / 开源（open-deep-research、smolagents、LangChain deep agents）
  - 能力边界与典型失败模式；≥3 出链（`概念/RAG/rag`、`15_智能体`、`02_嵌入技术`）
- [ ] **1.2 架构拆解页** `02_架构拆解_四阶段流水线.md`（L，本专题核心深度页）
  - 四阶段逐一拆：规划器（问题分解/子问题生成）、检索编排（多源并行/迭代补检）、交叉验证（证据冲突检测/引用对齐）、综合（长文结构化/引用规范）
  - 每阶段伪代码 + 工程参数（并行度、上下文预算、终止条件）；Mermaid flowchart + subgraph
  - 测试时计算视角（与 o1/R1 推理模型的关系，互链 06_强化学习/推理模型相关页）
- [ ] **1.3 开源实现对比页** `03_开源实现对比与最小复现.md`（M）
  - 对比表（框架/检索器/并行策略/验证机制/成本）；Mac M4 本地跑 minimal DR 的落点（与 `15_智能体/20_Agentic_Infra/04` 互链）
- [ ] **1.4 评测页** `04_Deep_Research_评测.md`（S–M）
  - 评测集（BrowseComp/GAIA 等）与指标（引用准确率/事实一致性/任务完成率）；与 `07_RAG评估` 的差异
- [ ] **1.5 面试快问快答** `05_面试快问快答_30题.md`（S，版式参照 `28/13_Sandbox_快问快答_50题.md`）
- [ ] **1.6 概念卡** `概念/RAG/deep-research.md`（S）
  - aliases 必含：深度搜索、深度研究、DeepResearch；relationships 连 rag / tool-use / agent-planning
- [ ] **1.7 互链收拢**（S）：14 章 README/INDEX、`04_高级RAG` 与 `05_RAG生产实践` 各 1–2 页加"演进 → Deep Research"出链、`RAG-in-nutshell.md` 延伸阅读段

## P0-3 Agent 记忆系统专题化（`wiki/15_智能体/06_记忆基础设施/`，注意 03 编号历史空缺，新文件从 06 起编）

- [ ] **3.1 总览 hub 页** `00_记忆系统总览_决策树.md`（M，新建）
  - 三类记忆（工作/情景/语义）× 两场景（个人助手/多租户平台）选型决策树；「什么时候不需要记忆系统」反模式；对 01/02/04/05/06 的分工导航
- [ ] **3.2 薄页扩写** `02_Agent_Memory_技术.md`（S，现仅 6.7K）
  - 补：写入策略（何时写/写什么）、检索策略（混合检索/时间衰减/相关性）、更新与冲突消解
- [ ] **3.3 产品选型页** `06_记忆产品选型对比_2026.md`（M，新建）
  - Mem0（31 处提及）/ Zep（38）/ Letta·MemGPT（17+14）/ LangMem（4）/ 自建 对比表（架构/检索/成本/多租户/生态）；给本地千问办公 Agent 的选型结论（与 `20_Agentic_Infra/04` 互链）
- [ ] **3.4 压缩与遗忘页** `07_压缩_遗忘_分层策略.md`（M，新建）
  - context compaction、分层摘要、reflection 提炼、遗忘策略；与长上下文的辨析（互链 05_大模型 长上下文页）
- [ ] **3.5 面试快问快答** `08_面试快问快答_20题.md`（S）
- [ ] **3.6 概念卡合并**（S，⚠️ 触碰「只增不减」边界）
  - `agent-memory-2.md`（359 行）与 `agent-memory-systems.md`（224 行）内容合并至主卡；另一张改 stub 重定向（保留文件与别名壳，不物理删除——遵循治理原则，物理删除属高风险动作需单独确认）
- [ ] **3.7 互链收拢**（S）：15 章 README、06 目录 INDEX、`20_Agentic_Infra/04`、`05_Agent技能`、`概念/Agent` 域索引

## P0-2 Computer Use / GUI Agent 专题（新建目录 `wiki/15_智能体/21_Computer_Use/`）

- [ ] **2.1 全景页** `01_GUI_Agent_Computer_Use_全景_2026.md`（M）
  - 辨析：Computer Use（操作真实 OS）vs GUI Agent（网页内）vs Browser Use；产品格局（Claude Computer Use / OpenAI Operator·CUA / Gemini Mariner / Manus / 开源 browser-use）；四条技术路线（像素截图 / DOM / 无障碍树 / VLA）
- [ ] **2.2 技术拆解页** `02_技术拆解_感知_决策_执行.md`（L，核心深度页）
  - 感知（截图/Set-of-Mark/无障碍树）、决策（动作空间：click/type/scroll/hotkey、层级策略）、执行（CDP/Playwright/pyautogui/系统 API）；轨迹数据格式（Anthropic / OpenAI CUA）；Mermaid
- [ ] **2.3 权限与安全页** `03_权限与安全模型.md`（M）
  - 最小权限、人类在环确认、敏感操作门（支付/删除）、网页内容提示注入防护、沙箱隔离——互链 `28/04_Sandbox`、`28/13_快问快答`、`20_Agentic_Infra/09`、`12_架构基建/10_安全/05_gVisor`，形成「执行体」故事线
- [ ] **2.4 评测页** `04_评测与失败模式.md`（M）
  - OSWorld（22 处散提及）/ WebArena（28）/ AndroidWorld（3）基准与 SOTA 区间；常见失败（grounding 错误/长任务漂移/验证缺失）；自建评测 checklist
- [ ] **2.5 面试快问快答** `21_面试岗位/28_Agent_Runtime工程师/15_Computer_Use_快问快答_30题.md`（S，接 28 系列现有 14 篇编号）
- [ ] **2.6 概念卡**（S）：扩写 `概念/Agent/gui-agent.md`（273 行 → 补 2026 产品/路线）；新建 `概念/Agent/computer-use.md` 与 gui-agent 辨析；aliases 补 Computer Use / CUA
- [ ] **2.7 互链收拢**（S）：15 章 README/INDEX、28 系列 README、`概念/Agent` 域索引

## P0-X 通用收尾门禁（每个专题完成后必跑）

- [ ] 每页过根目录 AGENTS.md「创建/编辑页面 checklist」：frontmatter 完整（title/name_zh/tier/tags/summary/created/updated bump/sources/aliases）、`> 中文简称：` 与 `> **一句话理解**:` blockquote、`---` 分节、`*Last updated:*` 页脚、≥2 出链
- [ ] `python3 code/工具/check_links.py` —— 不新增断链（link_gate 棘轮基线 1467/746/767/1057，只降不升）
- [ ] `code/工具/fix_spacing.py`（已带 wikilink 目标保护）
- [ ] 更新所在章节 README/INDEX；根 `index.md` 由工具再生成，勿手编
- [ ] `wiki/治理/ROADMAP.md` Q4 表补记任务与状态；概念卡合并动作记入治理 log
- [ ] 小窗口 commit + push（并行会话竞态防护；被拒时 fetch + cherry-pick 快进，绝不 force）
- [ ] 新建前沿页建议加 `review_by: 2027-01-25`（示范体检报告的时效性引擎建议）

## 风险与注意

1. 概念卡「合并」用 stub 重定向方案，不物理删除文件（只增不减原则；删除属 HIGH-RISK 需单独确认）。
2. 新目录编号已核实不冲突：14 章现有 01–07（新目录取 08）；15 章现有 01–20（新目录取 21）；28 系列现有 01–14（快问快答取 15）。
3. `06_记忆基础设施` 缺 03 编号属历史空缺，新文件从 06 起编避开。
4. Deep Research / Computer Use 内容时效敏感，写完即设 review_by，纳入到期提醒。

---

## 交叉引用

- 来源报告：[[治理/Content_Strategy_Audit_2026_10|内容战略体检 2026-10]]
- 姊妹清单：[[治理/plan/Task_List_P1_2026_10|P1 任务清单 2026-10]]
- 路线图登记：[[治理/ROADMAP|AI Guru 知识库路线图]]

---

*Last updated: 2026-10-27*
