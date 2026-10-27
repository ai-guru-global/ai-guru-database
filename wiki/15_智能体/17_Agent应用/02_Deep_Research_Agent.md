---
title: Deep Research Agent 深度研究智能体
category: 15-agent-applications
tags: ["deep-research", "web-agent", "agentic-search", "tongyi", "information-synthesis", "2026"]
summary: "Deep Research 总览：多轮搜索→交叉验证→长文综合的研究循环智能体——2026 产品格局（OpenAI/Gemini/Perplexity/Tongyi DeepResearch）、技术解剖（循环/上下文管理/训练三阶段）、与 RAG 的边界、面试快问快答。"
created: 2026-10-25
updated: 2026-10-25
tier: core
aliases: ["Deep Research", "深度研究智能体", "DeepResearch Agent", "深度研究"]
sources:
  - arXiv 2510.24701 (Tongyi DeepResearch Technical Report, 2025-10)
  - tongyi-agent.github.io/blog/introducing-tongyi-deep-research
review_by: 2027-01-25
name_zh: "深度研究智能体"
---

# Deep Research Agent 深度研究智能体

> 中文简称：深度研究智能体

> **一句话理解**: Deep Research 给大模型装上「多轮搜索 → 交叉验证 → 长文综合」的研究循环——你问一个问题，它像人类研究员一样拆解、检索、阅读、反思、迭代，几分钟后交出一份带引用来源的结构化研报。

---

## 1. 为什么 2025–2026 爆发

三个条件在 2024 底到 2025 年同时成熟：

1. **推理模型就位** — o 系列 / DeepSeek-R1 类长思考模型能支撑「规划-反思-迭代」循环（见 [AI 推理模型指南](../../00_入门/02_技术概览/04_AI_推理模型_指南.md)）。没有推理能力，循环退化为搜索结果拼接。
2. **搜索与网页工具化** — 搜索 API、无头浏览器、页面抽取（readability 类）成为廉价原语。
3. **上下文窗口 + 上下文工程** — 百万级窗口配合压缩/笔记技术，才能装下几十个网页的阅读痕迹。

> 定位：Deep Research 是 **Web Agent 的第一个大规模商业落地形态**——比 [[概念/Agent/computer-use|Computer Use]] 更早产品化，因为其动作空间（搜索/阅读）天然可验证、风险低。

---

## 2. 2026-10 产品格局

| 产品 | 厂商 | 驱动模型 | 关键特征 |
|------|------|------|------|
| Deep Research | OpenAI（2025-02） | o3 系 | GAIA 基准旗舰展示，ChatGPT Pro 首发后下放 |
| Gemini Deep Research | Google（2024-12） | Gemini | 最早产品化，与 Workspace/搜索生态整合 |
| Deep Research | Perplexity（2025-02） | 自选模型 | 搜索索引起家，引用密度最高（见 [Perplexity 概览](../../05_大模型/12_LLM产品/09_perplexity_概览.md)） |
| Research | Anthropic（2025） | Claude | 长思考 + 网页搜索 + 多源综合 |
| **Tongyi DeepResearch** | **阿里通义（2025-10）** | 30B MoE / 3B 激活 | **首个全开源对标 OpenAI Deep Research 的 Web Agent**，agentic mid-training + post-training |
| 开源参考实现 | 社区 | — | GPT-Researcher、OpenDeepResearch、Search-R1 复现、WebThinker |

**2026 趋势两条**：

- **API 化/基础设施化** — Deep Research 作为 API 被其他 Agent 调用（Parallel、Exa 等专供低时延研究 API），从「产品功能」变成「Agent 生态的原语」。
- **开源追平闭源** — Tongyi DeepResearch 证明 30B 级（3B 激活）开源模型 + 正确训练范式可达商用深度；2026-08 社区评测中开源四强已能在多数任务接近 ChatGPT/Gemini 模式。

---

## 3. 技术解剖

### 3.1 核心循环

```
用户问题
   │
   ▼
┌─────────┐    ┌──────────┐    ┌──────────┐
│ 规划     │───▶│ 并行搜索  │───▶│ 阅读抽取  │
│ 拆子问题 │    │ multi-query│    │ 爬取+摘要 │
└─────────┘    └──────────┘    └────┬─────┘
    ▲                                 │
    │          ┌──────────┐           ▼
    └──────────│ 反思     │◀── ┌──────────┐
   生成新子问题 │ 缺口检测  │    │ 笔记本    │
               └────┬─────┘    │ scratchpad│
                    │          └──────────┘
              信息饱和/预算用尽
                    │
                    ▼
              ┌──────────┐
              │ 综合成文  │
              │ 带引用地图 │
              └──────────┘
```

### 3.2 四个关键工程点

| 工程点 | 问题 | 主流做法 |
|--------|------|------|
| **上下文管理** | 单个网页 10K+ token，几十页塞爆窗口 | 逐页抽取→写入外部笔记本（scratchpad），窗口内只保留笔记与规划状态 |
| **并行度** | 串行搜索=小时级墙钟 | 子问题 fan-out 并行检索，把分钟级体验做出来 |
| **引用追溯** | 报告级输出必须可核查 | claim→source 映射表；综合阶段强制「无引用不落笔」约束 |
| **停止条件** | 无限循环烧钱 | 时间预算/迭代上限/信息增益饱和检测三重闸 |

### 3.3 训练范式三阶段演进

| 阶段 | 时间 | 代表 | 思路 |
|------|------|------|------|
| 工作流拼接 | 2024 | GPT-Researcher 等 | 大模型 + 搜索 API 编排，纯 prompt 工程，模型本身不变 |
| RL 训练搜索智能体 | 2025 H1 | Search-R1、WebThinker | RL 让模型学会「何时搜、搜什么、怎么读」，搜索作为环境动作 |
| **Agentic mid-training** | 2025 Q4 | **Tongyi DeepResearch** | 把海量 agentic 轨迹灌进 **mid-training 阶段**（预训练与后训练之间），再 post-training 强化——从「教模型用工具」升级为「预训练期就学会做研究」 |

> Tongyi 的关键启示：能力不只来自后训练对齐，**中间训练阶段的 agentic 数据配比**是开源追平闭源的杠杆。这与本库 [Agentic 工作流设计模式](../03_Agent工作流/02_Agentic_工作流_设计_模式_2026.md) 中「训练与编排两条腿」的判断一致。

---

## 4. 与相邻概念的边界

| 维度 | RAG（[[概念/RAG/agentic-rag-2\|Agentic RAG]]） | Deep Research | Computer Use |
|------|------|------|------|
| 形态 | 单轮/少轮检索增强生成 | 多轮 agentic 研究循环 | 通用 GUI 操作智能体 |
| 面向 | 问答/知识注入 | 报告/决策支撑 | 任务执行 |
| 动作空间 | 检索器 | 搜索+阅读+反思 | 点击/输入/滚动 |
| 时延 | 秒级 | 分钟级 | 分钟~小时级 |
| 检索角色 | 目标本身 | 子例程 | 无（或取网页内容） |

一句话：**Deep Research = 把 RAG 当工具用的长循环 Agent**；RAG 解决「知识在哪」，Deep Research 解决「研究怎么做」。

---

## 5. 面试快问快答

1. **Deep Research 和 RAG 的区别？** — RAG 是单轮检索增强（面向 QA），Deep Research 是多轮自主循环（面向报告）；检索在前者是目标、在后者是子例程；前者秒级、后者分钟级。
2. **为什么必须推理模型驱动？** — 循环中的规划拆解、缺口反思、来源交叉验证都是长推理任务；非推理模型只能做「搜三次拼答案」。
3. **Tongyi DeepResearch 的创新点？** — 30B/3B 激活 MoE + agentic mid-training（轨迹数据灌入中间训练）+ post-training 强化；证明开源小尺寸可追平闭源深度。
4. **上下文塞不下几十个网页怎么办？** — 外部笔记本/scratchpad 模式：逐页抽取写笔记，窗口只留笔记+规划状态；笔记本体可结构化（实体/事实/引用三元组）。
5. **如何评估 Deep Research 质量？** — 事实性（claim 级核查/FactScore 类）、引用覆盖与可追溯性、报告结构完整性、成本与时延、与人类专家盲评对比。
6. **停止条件怎么设计？** — 时间预算 + 迭代上限 + 信息增益饱和（新检索对笔记的边际贡献低于阈值）三重闸。
7. **和 Computer Use 什么关系？** — 同属 Web/Computer Agent 谱系；Deep Research 动作空间收敛于搜索阅读（可验证、低风险），Computer Use 操作任意 GUI（通用、高风险），前者先产品化。
8. **主要安全风险？** — 被检索网页里的提示注入（间接注入）：恶意页面指令劫持研究循环；缓解为内容沙箱、来源分级、动作白名单。
9. **自建还是采购？** — 有领域语料/合规要求→基于 Tongyi DeepResearch 或 GPT-Researcher 自建；通用研报→直接调 OpenAI/Gemini/Parallel API，按「时延×成本×引用密度」三角选型。
10. **2026 的业态方向？** — API 化（成为其他 Agent 的原语）+ 垂域化（金融/医药/法律研报）+ 与记忆系统结合（研究员画像跨会话累积）。

---

## 6. 本库落点与延伸

- 推理基础: [AI 推理模型指南](../../00_入门/02_技术概览/04_AI_推理模型_指南.md)
- 编排模式: [Agentic 工作流设计模式](../03_Agent工作流/02_Agentic_工作流_设计_模式_2026.md)
- 评估方法: [Agent 评估](../07_Agent评估/README.md)
- 相邻形态: [[概念/Agent/computer-use|Computer Use]] ｜ [Voice Agent](./03_Voice_Agent.md)
- 概念卡（待建）: `概念/Agent/deep-research`——按 P2 行动清单，本页发布后应补建概念卡并挂入图谱

> 本页 frontmatter 带 `review_by: 2027-01-25`——前沿格局页按《[内容战略体检 2026-10](../../治理/Content_Strategy_Audit_2026_10.md)》提出的机制做定期复审示范。

---

*Last updated: 2026-10-25*
