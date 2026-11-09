---
线索: ClaudeCode
主题: Agentic编码
别名: [Claude Code, Anthropic 编码助手]
状态: 活跃
创建: 2026-07-21
更新: 2026-09-04
关键角色: [Anthropic]
---

# ClaudeCode

> Anthropic 推出的 agentic 命令行编码助手，在终端内自主理解代码库、执行多步编程任务。

## 概述

Claude Code 是 Anthropic 于 2025 年 2 月推出的 agentic 编码工具，定位为「终端内的自主编程代理」。区别于传统的代码补全或对话式助手，它直接在命令行运行，能浏览整个代码库、运行命令、编辑多文件、执行测试，并围绕「任务」而非「单次问答」组织交互。

它是 Agentic Coding 这一细分赛道最具代表性的产品之一，其演进（研究预览 → GA → SDK → Subagents/Skills/Hooks/Plugins 生态）清晰折射出「AI 编码从助手走向自主工程师」的产业趋势。

### 2026-10

- **2026-10-01** · [Claude Code 推出 mods，可用 TypeScript 函数改写提示词、替换内置功能](https://aihot.news/items/qzfc4nrsqe4rk8yxlk16ox6in)
  Anthropic 将 Claude Code 的可编程面正式开放：用户可用 TypeScript 自定义 Token Weather 等插件；与 [Claude Devs 同步发文](https://aihot.news/items/qzfc4nrsqe4rk8yxlk16ox6in) + [Anthropic 开发者博客入门教程：从零构建 Token Weather 上下文窗口预报插件](https://aihot.virxact.com/items/qzfc4nrsqe4rk8yxlk16ox6in) 三方同发，把 Claude Code 从「终端 IDE」升级为「可注入扩展的运行时」。这是自 8-07 默认自动模式、会话间消息（8-07）、Claude Code Projects（9-17）之后的关键一次扩展面开放。
- **2026-10-01** · [Anthropic 介绍用 Claude Code 与 claude-api skill 自动化评测设计与 hillclimbing](https://aihot.virxact.com/items/qqvpv4tiarctdrthhbx7447b2)
  Anthropic 开发者博客：「Claude-as-a-judge」自动化评测范式落地 Claude Code，评测与优化两个动作首次以可编程面打通；与同日 mods 发布组合，意味着 Claude Code 既是「被评测对象」也是「评测工具」。

### 2026-09

- **2026-09-28** · [H Company 发布 Holo4 智能体模型系列](https://aihot.news/items/y1thdkq6a9giiitpxb6e13hwo)
  Hugging Face Blog：Holo4 含 27B 与 35B-A3B 两个版本，与 Claude Code 同步出现「非大厂但主打开源智能体」新模型——编码 / Agent 生态的开源端补位。
- **2026-09-25** · [Anthropic 员工实测 Claude Code 的 effort 档位如何影响 Fable 5.1 与 Opus 5.5 输出质量](https://aihot.news/items/d4vqt9ctlmz0oyf3cv3m5e8mp)
  Claude Devs：实测 effort 档位对模型输出的影响，是 9-22 Opus 5.5 + Claude Code v2.1.280 落地的官方教程延伸；同日 [Opus 5.5 上一个任务要花多少钱：Claude Code 成本拆解](https://aihot.news/items/lllayx4fdocosmfgrzeujx1ud) 与 [Claude Devs 测算 Opus 5.5 相比 Opus 5 在 Claude Code 任务中的成本变化](https://aihot.news/items/cmuhazjqv076rro3b6ta3dnck) 三件套发布，把「能力 + 价格」的双坐标拆开评估。
- **2026-09-24** · [Claude Code 云会话正式上线，Pro 和 Max 订阅者可领一次性额度](https://aihot.news/items/cmueurvwl03tvroyqdzcth166)
  Claude Devs 官宣：编码会话可托管在云端运行（不再强制本地），Pro 与 Max 订阅者获一次性额度，是 Claude Code 从「本地终端 IDE」向「云端会话」过渡的产品级里程碑。
- **2026-09-22** · [Claude Code v2.1.280 发布，新增 Claude Opus 5.5 为默认 Opus 模型](https://aihot.news/items/cmucxceh40salroedruwhn0ee)
  Claude Code：GitHub Releases：v2.1.280 默认 Opus 模型由 Opus 5 升 Opus 5.5，与 9-22 Opus 5.5 官方发布同日；同日 [Claude 详解 Opus 5.5 一次 Claude Code 任务的成本构成](https://aihot.virxact.com/items/cmucz06v905eironivy08mtvk) 与 [如何在 Claude 与 Claude Code 中用好 Opus 5.5](https://aihot.news/items/cmucxceh40salroedruwhn0ee) 发布。
- **2026-09-17** · [Claude Code Projects 改版：从文件夹到对话式协调](https://aihot.news/items/cmu5tujnp0jvoroqoq64oqnjr)
  Claude Blog：Projects 从「文件夹式代码集合」升级为「对话式协调」，多 agent 协同编排从「主从式」（8-07 会话间消息）扩展到「项目级协调」。
- **2026-09-02** · [Claude 在 Cowork 和 Claude Code 中支持后台操作电脑](https://aihot.virxact.com/items/cmtkh71ky017vrolly7trswyx)
  官方 X 账号宣布 Claude 可在 Cowork 与 Claude Code 中后台操作电脑，编码智能体在跑编码任务的同时并行处理 GUI 操作，computer use 与终端 Agent 正式合流。
- **2026-09-01** · [Claude Fable 5.1 上线 Claude Code 与 Claude Platform，缓存读取降价 75%](https://aihot.virxact.com/items/cmtj0fqet001lroh9hyk6rqu0)
  Claude Devs 宣布新一代模型发布即进入 Claude Code，同步将缓存读取价格下调 75%，长会话编码场景的边际成本显著下降。

### 2026-08

- **2026-08-07** · [Claude Code 八月起默认自动模式](https://aihot.virxact.com/items/cmsjaksyd04hlroo5hdy2qd4i)
  Claude Devs 官宣 8 月起自动模式成为默认：权限确认大幅减少，Agent 自主执行从可选项变成产品的默认形态。
- **2026-08-07** · [Claude Code 会话间可互发消息](https://aihot.virxact.com/items/cmsjdsk6p076rroo561c8askl)
  官方公布会话间消息传递能力，多个 Claude Code 会话可互相通信协作，多 agent 编排从「主从式」走向「点对点」，随后 Codex 侧也出现同类跨会话工作流讨论。

### 2026-07

- **2026-07-28** · [MCP 2026-07-28 规范发布](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
  MCP 转向 stateless、可缓存、可路由、可全球扩展的 Web 式架构；与旧版本 wire-incompatible；Anthropic 在全 Claude 产品线推进支持。→ [[智能体平台/MCP协议]]



- **2026-06-29 至 07-03** · Claude Code Week 27 更新
  内置 Explore agent 改为继承主会话模型（上限 Opus）而非 Haiku；background agents 持续更新。

### 2026-06

- **2026-06-09** · [Claude Code 支持嵌套子智能体](https://aihot.virxact.com/items/cmq6ndeig09zysl5ic7g7i7ts)
  Claude Code 负责人 Boris Cherny 官宣支持嵌套子智能体，agent 可自主生成并调用 subagent 处理子任务，多 agent 编排能力升级，与 Cursor 预告的「递归子 agent」方向看齐。

### 2026-05

- **2026-05-28** · [在 Claude Code 中引入动态工作流](https://aihot.virxact.com/items/cmpprfa7400hmslm6nclfncqk)
  官方工程博客介绍「动态工作流」机制，任务执行路径可按上下文动态生成与调整；同期 v2.1.154 版本更新加入对 Opus 4.8 的支持。
- **2026-05-13** · [Claude 付费计划将提供月度编程使用额度](https://aihot.virxact.com/items/cmp4c7tem04o0sljxh2fqtht1)
  官方 X 账号 Claude Devs 宣布付费计划提供月度编程使用额度，Claude Code 的计费向「订阅内含额度」模式调整。
- **2026-05** · Code with Claude 2026 大会
  旧金山举办，发布 managed offerings 与 Claude API 平台相关公告。

### 2026-03

- **2026-03-13** · [Opus 4.6 1M 成为 Claude Code 默认模型](https://aihot.virxact.com/items/cmnw1yon300j6slc3vjbweaeh)
  Boris Cherny 宣布 100 万 token 上下文的 Opus 4.6 成为 Max、Team 及企业版 Claude Code 用户的默认模型，百万级长上下文在终端编码场景成为标配。
- **2026-03** · Claude Code 月度更新
  新增 computer use、auto mode、remote control、scheduled tasks、visuals 等。

### 2025-11

- **2025-11-24** · [Introducing Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5)
  Anthropic 发布 Claude Opus 4.5，称其为当时全球最强的编码/Agent/计算机使用模型，定价 $5/$25 每百万 tokens。Claude Code 随之获得更强的长程任务执行能力。
  > 官方表述：在编码、agents、computer use 上达到业界最佳。

### 2025-09

- **2025-09** · Claude Code SDK 更名为 Claude Agent SDK
  原 6 月发布的 Claude Code SDK 更名为 Claude Agent SDK，强调其能力已超出「编码」场景，扩展到通用 Agent 编排。提供 Python 与 TypeScript 实现，内嵌 CLI 二进制并支持 subagents。

### 2025-06

- **2025-06-16** · Claude Code SDK 发布
  Anthropic 推出 Claude Code SDK，面向「自定义 Agent」与集成场景，使开发者能在自己的工作流中嵌入 Claude Code 的 agentic 能力。

### 2025-05

- **2025-05-22** · [Introducing Claude 4](https://www.anthropic.com/news/claude-4)
  随 Claude 4 系列发布，Claude Code 进入正式可用阶段，成为 Anthropic 在编码与 Agent 赛道的旗舰入口。

### 2025-02

- **2025-02-24** · Claude Code 研究预览版发布
  随 Claude 3.7 Sonnet（Anthropic 首个混合推理模型）一同推出研究预览版，定位为终端内 agentic 命令行编码工具，强调「简洁与直接的终端内效用」。

## 分析

Claude Code 2025 全年迭代 176 次更新，演进脉络可归纳为三条主线：

1. **从助手到自主工程师**：起步是「终端里能跑工具的助手」，到年底已具备长程自主任务执行、上下文管理（Microcompact 延长会话）、多 Agent 协作能力。产品定位从「辅助编码」升级为「承担工程任务」。

2. **能力外溢为平台**：SDK 的发布与更名（Code SDK → Agent SDK）是关键信号——Anthropic 把 Claude Code 的 agentic 内核抽成可嵌入能力，意图让其成为通用 Agent 底座，而非只是一个编码工具。

3. **生态化**：Subagents（支持 @-mention 与模型选择）、Skills、Hooks、Plugins 等机制陆续加入，标志其从单一产品走向可扩展平台，社区围绕它生长出 subagents 合集、教程生态。

竞争格局上，Agentic Coding 赛道（Cursor、Cline、Windsurf、GitHub Copilot Workspace 等）高度拥挤，Claude Code 的差异化在于「终端原生 + Anthropic 自研最强编码模型 + SDK 平台化」三者结合。

## 关联线索

- [[基础模型/Claude]]
- [[智能体平台/ClaudeAgentSDK]]
