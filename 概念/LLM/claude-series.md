---
title: "Claude / Anthropic 模型系列 (Claude 3 → Opus 4.5 / 4.6)"
category: concepts
tags:
  - llm
  - claude
  - anthropic
  - claude-code
  - mcp
  - constitutional-ai
  - reasoning
  - agent
  - long-context
aliases:
  - Claude Series
  - Claude 3 / 3.5 / 3.7 / Opus 4.5 / 4.6
  - Anthropic Claude
  - Claude Code
relationships:
  - target: "概念/constitutional-ai"
    type: extends
  - target: "概念/long-context-llm"
    type: related_to
  - target: "概念/agent-benchmarks"
    type: related_to
  - target: "概念/test-time-compute"
    type: extends
summary: "Claude 是 Anthropic 的闭源大模型旗舰系列,从 Claude 3(2024-03)起稳居全球前二,2026-02 推出 Opus 4.5、4.6,200K 上下文,Computer Use、Claude Code、MCP 协议三大能力组合,是企业级 Agent 与编程助手的事实标准。Anthropic 2026 年估值达 3800 亿美元,ARR 突破 50 亿美元。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
---

# Claude / Anthropic 模型系列

> **一句话理解**:Anthropic 的"安全为先"闭源旗舰——从 Claude 3 的多模态起步,经 3.5 Sonnet 横扫基准、3.7 引入混合推理,到 Opus 4.5/4.6 强化长时 Agent 与编程能力,叠加 MCP 协议与 Claude Code,正在重塑企业 AI 落地路径。

---

## 一、公司与团队背景

| 维度 | 信息 |
|---|---|
| **公司** | Anthropic(美国旧金山,2021 年由 OpenAI 前高管 Dario & Daniela Amodei 创立) |
| **核心理念** | 安全优先(Safety First)、可解释性、Constitutional AI |
| **关键投资方** | Google、Amazon(40 亿美元注资,AWS 为主要云供应商)、Spark Capital |
| **2026 估值** | 3800 亿美元(2026 年初融资轮) |
| **2026 ARR** | 50 亿美元+(2026 Q2) |
| **API 入口** | [platform.claude.com](https://platform.claude.com/) |
| **消费端** | [claude.ai](https://claude.ai/)(Web/iOS/Android) |
| **模型矩阵** | Haiku(小)、Sonnet(中)、Opus(大)三档 |

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 对齐宪法 | Constitutional AI(CAI) | 用自然语言"宪法"代替人类反馈,让模型自评自改 |
| 代理型编程 | Agentic Coding | 模型自主调用工具、写文件、跑命令完成多步编程任务 |
| 工具调用 | Tool Use / Function Calling | 模型按 JSON Schema 调用外部 API/函数 |
| 模型上下文协议 | Model Context Protocol(MCP) | Anthropic 主导的开源协议,标准化 LLM ↔ 工具/数据源的双向通信 |
| 混合推理 | Hybrid Reasoning | 一个模型同时支持"快思考"(无 CoT)和"慢思考"(长 CoT) |
| 扩展思考 | Extended Thinking | 显式启用模型思考预算(类似 o1),可在 API 中设置 token 上限 |
| 提示缓存 | Prompt Caching | 复用长 system prompt / 文档前缀以降低延迟与成本 |
| 长期记忆 | Long-Term Memory(Projects) | 项目级知识持久化,跨会话保持上下文 |
| 计算机使用 | Computer Use | 让模型直接看屏幕、操控键鼠完成桌面任务 |
| 文本生成 | Text Generation | 主流对话与续写任务 |

---

## 三、模型代际演进

### 3.1 Claude 3 系列(2024-03)

- **Haiku / Sonnet / Opus** 三档同发,Opus 替代 GPT-4 成为新基准王。
- 引入 **Vision(视觉输入)**,支持图像、图表、PDF 解析。
- 上下文窗口:200K tokens(全系标配)。
- 多语言能力显著提升(对中文、日文友好)。

### 3.2 Claude 3.5 系列(2024-10~2025-02)

- **Claude 3.5 Sonnet**(2024-10):在编码(SWE-bench Verified 49%)、推理(MATH 96.4%)多项基准超越 GPT-4o、Llama 3.1 405B,定价仅 $3/$15 per 1M tokens。
- **Claude 3.5 Haiku**(2024-11):小模型,延迟更低、价格更便宜,部分场景对齐 3 Opus。
- **Computer Use**(2024-10):业界首个开放 Computer Use 能力,在 OSWorld 基准首次突破 14.9%。

### 3.3 Claude 3.7 Sonnet(2025-02)

- 业界首个 **Hybrid Reasoning** 模型:用户可选"标准模式"或"扩展思考模式",API 暴露 `thinking` 字段。
- SWE-bench Verified 达 **63.7%**,刷新 SOTA。
- 引入 "Claude Code" 终端编程助手(sdk),深度集成 Bash/Edit/Grep 工具。

### 3.4 Claude 4 / Opus 4 / Sonnet 4(2025-05)

- 真正"长时 Agent"模型,可持续工作 **数小时** 完成多文件重构。
- SWE-bench Verified 进一步推至 **72.5%**(Sonnet 4)/ **79.4%**(Opus 4)。
- 强化"细颗粒度指令遵循"与"工具编排"。

### 3.5 Claude Opus 4.5 / 4.6(2026-02)

- **200K+ 上下文 + 长期记忆**:跨会话保持项目状态。
- **Opus 4.5** 在 Terminal-Bench、TAU-bench 拿下 SOTA,定位"企业 AI 员工"。
- **Opus 4.6** 进一步推升长时 Agent 稳定性,引入"agentic self-correction"。

---

## 四、模型矩阵对比(2026-02 快照)

| 模型 | 上下文 | 主要用途 | 定价($/MTok 输入/输出) | 旗舰基准 |
|---|---|---|---|---|
| **Claude Haiku 4.5** | 200K | 低延迟、批处理、分类 | $1 / $5 | 接近 3.5 Sonnet,适合实时应用 |
| **Claude Sonnet 4.5** | 200K (1M beta) | 主力推理 / 编程 / 工具 | $3 / $15 | SWE-bench Verified 77.2%,Terminal-Bench 65.4% |
| **Claude Opus 4.5** | 200K (1M beta) | 复杂 Agent / 长任务 | $15 / $75 | TAU-bench 92.3%,SWE-bench Verified 80.9% |
| **Claude Opus 4.6** | 200K (1M beta) | 长时自主 Agent | $15 / $75 | 强化多日级任务稳定性 |

> 注:1M tokens 上下文窗口为 Sonnet 4.5 / Opus 4.5/4.6 的 beta 功能,按比例额外计费。

---

## 五、关键能力与生态

### 5.1 MCP 协议(Model Context Protocol)

- 2024-11 由 Anthropic 开源,2025 年被 OpenAI、Google、Microsoft 采纳为跨厂商标准。
- 核心思想:**LLM ↔ MCP Server ↔ 工具/数据源** 的统一 JSON-RPC 接口。
- 类比:LSP(语言服务器协议)之于 IDE,MCP 之于 LLM 应用。
- 生态:[modelcontextprotocol.io](https://modelcontextprotocol.io/)、官方 SDK(Python/TypeScript/Go/Rust/Java)。

### 5.2 Claude Code

- Anthropic 官方终端编程 Agent,定位"AI 结对工程师"。
- 内置工具:Read/Write/Edit/Glob/Grep/Bash/WebFetch。
- 支持 `CLAUDE.md` 项目指令、`/mcp` 命令加载 MCP Server。
- 2025-05 GA,被广泛用于 Devin / Cursor / Windsurf 之外的"纯命令行"流。

### 5.3 Computer Use(2024-10 至今)

- 模型直接看屏幕截图,通过虚拟键鼠操作 macOS / Linux / Windows 桌面。
- OSWorld 基准:Claude Opus 4.5 达 **38.1%**(2026-02),逼近人类水平(72%)。
- 应用场景:浏览器自动化、桌面软件测试、无 API 系统的 AI 化接入。

### 5.4 提示缓存与长上下文

- **Prompt Caching**:命中缓存 5 分钟/1 小时,输入价降至 **$0.30 / MTok**(写)、**$3.75 / MTok**(读),降幅 90%。
- **200K 标配** + **1M beta**:可一次性吃下整本代码库或百页财报。

### 5.5 工具生态

- 官方 SDK 覆盖 Python / TypeScript / Go / Java。
- 第三方生态:[Claude Code SDK](https://docs.claude.com/en/docs/claude-code/sdk)、[Vercel AI SDK](https://sdk.vercel.ai/)、[LangChain](https://www.langchain.com/)、[LlamaIndex](https://www.llamaindex.com/)、[LiteLLM](https://github.com/BerriAI/litellm)。
- 监控/可观测:[Langfuse](https://langfuse.com/)、[LangSmith](https://www.langchain.com/langsmith)、[Helicone](https://www.helicone.ai/)。

---

## 六、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **市场份额** | 企业 LLM API 约 35%,与 OpenAI 并列第一梯队 |
| **ARR** | 50 亿美元+(2026 Q2),企业客户 > 1000 家 |
| **旗舰产品** | Claude Code(编程)、Cowork(办公)、Projects(项目长记忆) |
| **MCP 生态** | 1000+ 官方/社区 MCP Server,涵盖 GitHub/Slack/Notion/Linear/Postgres |
| **监管动态** | 与 FTC、欧盟 AI Act 积极沟通,公开"Responsible Scaling Policy" |
| **主要竞品** | GPT-5 系列(OpenAI)、Gemini 2.5 Pro(Google)、Llama 4(Meta) |

---

## 七、生产最佳实践

1. **路由分层**:Haiku 4.5 跑分类/路由 → Sonnet 4.5 跑主力推理 → Opus 4.5/4.6 跑长时 Agent/复杂编码,综合成本可降 60%+。
2. **MCP 优先**:能用 MCP Server 接入的数据源(数据库、API)就**不要**走 RAG,延迟低 5-10 倍。
3. **Prompt Caching**:长 system prompt / 工具说明 / Few-shot 示例必开缓存,单次请求成本可降 80%。
4. **混合推理门控**:`thinking` 字段按需启用,简单对话用标准模式,数学/代码/规划任务用扩展思考,平均 token 节省 40%。
5. **安全护栏**:Anthropic 推荐用 "Constitutional" 提示词 + 工具白名单 + 输出 schema 校验三层防御。
6. **Computer Use 兜底**:无 API 的遗留系统,Computer Use 是最后一道"AI 化"通道,务必设置"高危操作确认"中断。
7. **项目隔离**:用 `Projects` 隔离租户上下文,避免长记忆串台泄露。

---

## 八、See Also(官方源)

- 官方文档 [docs.claude.com](https://docs.claude.com/)
- 模型发布日志 [anthropic.com/news](https://www.anthropic.com/news)
- Claude 3.5 Sonnet 公告 [anthropic.com/news/claude-3-5-sonnet](https://www.anthropic.com/news/claude-3-5-sonnet)
- Computer Use 公告 [anthropic.com/news/computer-use](https://www.anthropic.com/news/3-5-models-and-computer-use)
- Claude 3.7 公告 [anthropic.com/news/claude-3-7-sonnet](https://www.anthropic.com/news/claude-3-7-sonnet)
- MCP 协议 [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- Claude Code 文档 [docs.claude.com/en/docs/claude-code](https://docs.claude.com/en/docs/claude-code)
- Anthropic 论文:"Constitutional AI" [arxiv.org/abs/2212.08073](https://arxiv.org/abs/2212.08073)
- Anthropic Responsible Scaling Policy [anthropic.com/res](https://www.anthropic.com/res)

---

## 九、相关概念卡

- [[概念/constitutional-ai|Constitutional AI]]
- [[概念/agent-benchmarks|Agent Benchmarks]]
- [[概念/test-time-compute|Test Time Compute]]
- [[概念/long-context-llm|Long Context Llm]]
- [[概念/llm-as-judge|Llm As Judge]]
- [[概念/llm-arena|Llm Arena]]
