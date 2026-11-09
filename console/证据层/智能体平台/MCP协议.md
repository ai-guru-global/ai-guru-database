---
线索: MCP协议
主题: 智能体平台
别名: [Model Context Protocol, MCP]
状态: 活跃
创建: 2026-07-30
更新: 2026-09-04
关键角色: [Anthropic, OpenAI, Google, Microsoft]
---

# MCP协议

> Anthropic 开源的模型-工具连接标准，一年内被全行业采纳，成为 Agent 生态的「USB-C」。

## 概述

Model Context Protocol（MCP）是 Anthropic 于 2024 年 11 月开源的开放协议，标准化 LLM 应用连接外部数据源与工具的方式：服务端暴露 tools/resources/prompts，客户端（Claude Desktop、IDE、Agent 框架）统一接入。它解决了「每个模型 × 每个工具都要写一遍集成」的 M×N 问题。

2025 年 OpenAI、Google、Microsoft 相继宣布支持，MCP 事实上赢得了 Agent 工具层的标准之争，社区服务器数量以千计。2026 年 7 月的规范修订将协议重构为 stateless、可缓存的 Web 式架构，目标是支撑全球可扩展的企业级 Agent 工具调用；同年 8 月 Google 联合亚马逊、微软推出 Agent Plugins 规范，工具层标准进入多方竞争阶段。

### 2026-09

- **2026-09-30** · [Google DeepMind 发布 SynthID Bio，为 AI 生成的蛋白质嵌入可验证水印](https://aihot.news/items/deivg466iwv9ypddacud3hd7d)
  DeepMind：SynthID Bio 作为面向 AI 生成生物设计的新型水印方法家族，首次实现将不可感知的签名直接嵌入蛋白质序列、且不影响其生物功能——与 SynthID 文本 / 图像 / 音频 / 视频系列衔接。
- **2026-09-24** · [Google Cloud API Gateway 推出 MCP 支持，可将现有 REST API 直接暴露为智能体工具](https://aihot.news/items/cmufsle61073uroxzkvtgtnyg)
  Google Developers Blog：API Gateway 直接支持 MCP 协议，企业现有 REST API 不改后端即可作为智能体工具——MCP 从「客户端 / 客户端框架」扩展到「企业 API 网关层」，是 MCP 协议从开发者工具向企业基础设施推进的关键一步。
- **2026-09-17** · [Google 与 Speakeasy 开源 OpenAPI SDK 生成套件](https://aihot.news/items/cmu5whj4t04n6roiqgera0t3j)
  Google Developers Blog：与 Speakeasy 合作开源 OpenAPI SDK 生成套件，把 OpenAPI 规范直接转译为 MCP 兼容的智能体工具——MCP 工具侧从「手写 SDK」过渡到「OpenAPI 自动生成」。

### 2026-08

- **2026-08-06** · [Agent Plugins 1.0.0 发布：谷歌、亚马逊、微软等支持的统一智能体插件规范](https://aihot.virxact.com/items/cmshra4es0oycronk0wcvjv03)
  Google Developers Blog 发布统一智能体插件规范 Agent Plugins 1.0.0，获谷歌、亚马逊、微软等共同支持——MCP 之外，超巨头开始共建自己的 Agent 工具层标准，协议层竞争再起。

### 2026-07

- **2026-07-28** · [MCP 2026-07-28 规范发布](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
  MCP 转向 stateless、可缓存、可路由、可全球扩展的 Web 式架构；与旧版本 wire-incompatible；Anthropic 在全 Claude 产品线推进支持。这是 MCP 自开源以来最大的架构升级，目标是支撑企业级、可全球扩展的 Agent 工具调用。

### 2026-05

- **2026-05-27** · [OpenAI 产品支持私有 MCP 服务器安全连接](https://aihot.virxact.com/items/cmpoevkk105k2slv4iklwg0qm)
  OpenAI 开发者账号宣布 ChatGPT、Codex 与 Responses API 可通过仅出站 HTTPS 隧道接入企业内网 MCP 服务器，无需暴露公网——MCP 从开发者生态走向企业生产环境的关键补全。

### 2025-12

- **2025-12** · MCP 捐赠给 Linux 基金会
  Anthropic 宣布将 MCP 移交中立治理（Agentic AI 基金会方向），回应「单一厂商控制标准」的顾虑，巩固其行业标准地位。

### 2025-05

- **2025-05** · Microsoft 宣布 Windows 原生支持 MCP
  Build 大会上微软将 MCP 纳入 Windows Agent 基础设施，GitHub/VS Code/Copilot Studio 全线接入，MCP 进入操作系统层。

### 2025-04

- **2025-04** · Google 确认 Gemini 将支持 MCP
  Demis Hassabis 公开表态支持，配合 Google 自家的 A2A（Agent2Agent，主打 Agent 间通信）形成互补而非对抗的姿态。

### 2025-03

- **2025-03** · OpenAI 宣布采纳 MCP
  Sam Altman 宣布 Agents SDK、ChatGPT 桌面端将支持 MCP——最大竞争对手的采纳被视为 MCP 标准战的决定性胜利。

### 2024-11

- **2024-11-25** · [MCP 开源发布](https://www.anthropic.com/news/model-context-protocol)
  首发即提供 SDK、协议规范与 Google Drive/Slack/GitHub/Postgres 等参考服务器，Claude Desktop 率先支持本地 MCP 连接。

## 分析

1. **标准战的教科书打法**：MCP 赢在三点——发布即完整（协议+SDK+参考实现）、对竞品友好（模型无关设计）、时机精准（Agent 爆发前夜）。相比之下各家私有插件体系（如早期 ChatGPT Plugins）均已消亡。

2. **安全是最大隐患**：MCP 服务器的提示注入、工具投毒、凭证泄露等攻击面在 2025 年被安全社区反复验证，「谁来审核数千个社区服务器」仍无良方，企业落地的主要阻力即在于此。

3. **协议即权力**：即便移交基金会，Anthropic 通过定义 MCP 获得了 Agent 生态的议程设置权。工具层标准化后，竞争焦点上移至编排层（Agent SDK 之争）与 Agent 间通信（A2A）。

## 关联线索

- [[智能体平台/ClaudeAgentSDK]]
- [[Agentic编码/ClaudeCode]]
- [[开发者工具/GitHubCopilot]]
