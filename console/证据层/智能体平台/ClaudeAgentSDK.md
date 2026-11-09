---
线索: ClaudeAgentSDK
主题: 智能体平台
别名: [Claude Agent SDK, Claude Code SDK]
状态: 活跃
创建: 2026-07-30
更新: 2026-09-04
关键角色: [Anthropic]
---

# ClaudeAgentSDK

> Anthropic 把 Claude Code 的 agentic 内核抽成通用 SDK，意图成为 Agent 开发的默认底座。

## 概述

Claude Agent SDK 前身是 2025 年 6 月发布的 Claude Code SDK，同年 9 月更名，提供 Python 与 TypeScript 实现。它将 Claude Code 内部打磨的 Agent 循环（工具调用、文件操作、上下文管理、子代理编排）封装为可嵌入任意应用的开发框架，支持 subagents、hooks、MCP 工具接入。

该线索追踪 Anthropic 的 Agent 平台化战略及其与 LangChain、OpenAI Agents SDK 等框架的竞争。2026 年 Anthropic 将 SDK 进一步平台化为 Claude 托管智能体（Managed Agents），并通过收购 Vercept、Stainless 补强 computer use 与 SDK/MCP 工具链。

### 2026-10

- **2026-10-01** · [Claude Code 推出 mods，可用 TypeScript 函数改写提示词、替换内置功能](https://aihot.news/items/qzfc4nrsqe4rk8yxlk16ox6in)
  Anthropic：Claude Code 的可编程面正式开放——用户可用 TypeScript 自定义 Token Weather 等插件；与 9-29 dots 常驻智能体形成「Claude Code 升级 mods + ChatGPT Work 升级 dots」的双侧可编程智能体平台格局。

### 2026-09

- **2026-09-29** · [OpenAI 发布常驻智能体 dots，由 GPT-6 Astra 驱动](https://aihot.news/items/r9nae38v4x5x29jrec46olsl4)
  DevDay 2026 一揽子发布：常驻智能体 dots 由 GPT-6 Astra 驱动，可跨会话保留上下文；Agents API 公测、全双工语音模型 GPT-Live-1、ChatGPT Work 的 Data agent 同日发布——常驻智能体正式进入「前沿厂商产品标配」阶段。
- **2026-09-29** · [Anthropic 评测 GLM-5.3：能自主构建端到端网络漏洞利用且防护易被绕过](https://aihot.news/items/eqf3o3tlak08851t52unuji2o)
  Anthropic Research：GLM-5.3 能自主构建端到端网络漏洞利用，且现有防护易被绕过——继 9-10 红队评测之后，前沿实验室首次以官方报告点名评估一家中国开源前沿模型的网络安全能力。
- **2026-09-24** · [Claude Code 云会话正式上线，Pro 和 Max 订阅者可领一次性额度](https://aihot.news/items/cmueurvwl03tvroyqdzcth166)
  Claude Devs 官宣：编码会话可托管在云端运行（不再强制本地），Pro 与 Max 订阅者获一次性额度，是 Claude Code 从「本地终端 IDE」向「云端会话」过渡的产品级里程碑。
- **2026-09-22** · [Claude Code v2.1.280 发布，新增 Claude Opus 5.5 为默认 Opus 模型](https://aihot.news/items/cmucxceh40salroedruwhn0ee)
  Claude Code：v2.1.280 默认 Opus 模型由 Opus 5 升 Opus 5.5，与 9-22 Opus 5.5 官方发布同日。
- **2026-09-17** · [Claude Code Projects 改版：从文件夹到对话式协调](https://aihot.news/items/cmu5tujnp0jvoroqoq64oqnjr)
  Claude Blog：Projects 从「文件夹式代码集合」升级为「对话式协调」，多 agent 协同编排从「主从式」（8-07 会话间消息）扩展到「项目级协调」。
- **2026-09-16** · [Anthropic 将 Claude Cowork 与聊天合并为统一 Claude，并推出 Docs 和 Slides](https://aihot.news/items/cmu4c8qar0hzero4w3b6n1jyf)
  Claude Blog：Claude Cowork 与 Claude 聊天合并为统一入口，同日推出 Docs 与 Slides —— Claude 从「聊天 + Cowork 双入口」走向「统一 Claude + Docs / Slides 套件」。
- **2026-09-02** · [Claude 在 Cowork 和 Claude Code 中支持后台操作电脑](https://aihot.virxact.com/items/cmtkh71ky017vrolly7trswyx)
  官方 X 宣布 Cowork 与 Claude Code 支持后台操作电脑，computer use 从「前台接管」走向「后台异步执行」，长时间运行的多任务智能体形态进一步成熟。

### 2026-08

- **2026-08-26** · [Claude in Chrome 正式全面上线](https://aihot.virxact.com/items/cmtaej1vz0czhroj2aybdbq26)
  官方博客宣布浏览器扩展全面可用，浏览器成为 Claude 智能体的常驻执行环境，与 Cowork、Claude Code 构成「桌面-浏览器-终端」三端 Agent 布局。
- **2026-08-20** · [Claude Platform 正式上线 Computer Use、Skills API 与 Files API，新增浏览器操作工具](https://aihot.virxact.com/items/cmt1z1q5n0c93roovlvh40tew)
  官方博客宣布平台级 Computer Use、Skills API 与 Files API 正式上线，computer use 从产品功能升级为可编程的平台 API，Agent SDK 的核心能力全面开放给开发者。

### 2026-05

- **2026-05-19** · [Claude 托管智能体平台新增自托管沙箱与 MCP 隧道](https://aihot.virxact.com/items/cmpcew7mp01s5slaemjh52y5b)
  官方博客宣布 Managed Agents 平台支持自托管沙箱（工具执行留在企业基础设施内，支持 Cloudflare/Daytona/Modal/Vercel）与 MCP 隧道（仅出站连接即可让智能体访问内网 MCP 服务器），补齐金融、医疗等合规行业的部署拼图。
- **2026-05-18** · [Anthropic 收购 SDK 与 MCP 服务器工具开发商 Stainless](https://aihot.virxact.com/items/cmpbgh7e51779slnz95461dox)
  官方宣布收购为 OpenAI/Anthropic 等生成 API SDK 的工具商 Stainless，其能力覆盖 API SDK 与 MCP 服务器代码生成，强化 Anthropic 开发者平台与 Agent SDK 工具链。

### 2026-04

- **2026-04-02** · [Claude Cowork 与 Claude Code Desktop 的 Computer use 支持 Windows](https://aihot.virxact.com/items/cmnw1yoll00h4slc3xrj73xz7)
  官方 X 宣布 computer use 能力扩展到 Windows 平台，Claude 的桌面智能体（Cowork、Claude Code Desktop）自此覆盖两大桌面系统。

### 2026-02

- **2026-02-24** · [Anthropic 收购 Vercept 推进 computer use](https://aihot.virxact.com/items/cmnw1xugc00eqslc37cpu40e9)
  官方宣布收购机器人视觉-语言-动作初创 Vercept，为 Claude 的 computer use（操作 GUI）能力补齐感知与动作模型团队。

### 2025-09

- **2025-09** · Claude Code SDK 更名为 Claude Agent SDK
  更名标志能力定位从「编码」扩展到通用 Agent 编排：官方示例覆盖客服、研究、数据处理等非编码场景，与 Claude Sonnet 4.5 同期发布。

### 2025-06

- **2025-06-16** · Claude Code SDK 发布
  面向「自定义 Agent」与集成场景，开发者可在自己的工作流中复用 Claude Code 的 agentic 能力（工具执行、权限控制、会话管理）。

### 2025-05

- **2025-05** · Claude Code GA 并开放扩展机制
  随 Claude 4 发布，Claude Code 正式可用并陆续开放 Hooks、Subagents 等机制，为 SDK 化铺路。

### 2024-11

- **2024-11-25** · [MCP（Model Context Protocol）开源发布](https://www.anthropic.com/news/model-context-protocol)
  Anthropic 开源模型上下文协议，统一 LLM 连接外部工具/数据源的接口标准，后成为 Agent SDK 的工具生态基座。

## 分析

1. **产品反哺框架**：与 LangChain「先框架后场景」相反，Agent SDK 是从 Claude Code 这个被验证的产品中反向提炼的框架——「在生产中打磨过的 Agent 循环」是其对开发者的核心说服力。

2. **协议 + SDK 双层卡位**：MCP 负责工具连接标准（已被 OpenAI、Google 采纳），Agent SDK 负责编排层。Anthropic 试图同时定义 Agent 生态的「USB 接口」与「主板」。

3. **与模型绑定的风险**：SDK 深度绑定 Claude 模型，在企业多模型策略盛行的背景下，这既是商业护城河，也是被中立框架（LangGraph 等）替代的隐患。

## 关联线索

- [[Agentic编码/ClaudeCode]]
- [[智能体平台/MCP协议]]
- [[基础模型/Claude]]
