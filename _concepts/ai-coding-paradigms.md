---
title: "AI 编程范式（AI Coding Paradigms）"
category: -concepts
tags: ["ai-coding", "paradigms", "copilot", "cursor", "agent-coding", "vibe-coding", "claude-code"]
relationships:
  - target: "_concepts/code-generation"
    type: classifies
  - target: "_concepts/ai-agents"
    type: uses
  - target: "_concepts/code-generation-workflow"
    type: evolves
sources:
  - 16_AI_Coding/README.md
  - 16_AI_Coding/Theory/README.md
summary: "AI 编程范式按自主度分为四级：补全（Copilot，补一行）→ 编辑（Cursor，改一段）→ Agent（Claude Code，自主完成多文件任务）→ Vibe Coding（自然语言驱动全程，人只描述意图）。从辅助到主导，AI 在编程中的角色不断升级。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.80
lifecycle: stable
lifecycle_changed: 2026-06-23
tier: core
created: 2026-06-23
updated: 2026-06-23
---

# AI 编程范式（AI Coding Paradigms）

## 核心要点

- **四级演进**：补全 → 编辑 → Agent → Vibe Coding，自主度递增。
- **核心转变**：从"AI 帮人写代码"到"人指导 AI 写代码"。
- **2026 现状**：补全/编辑已普及，Agent 编程（Cursor Agent/Claude Code）快速崛起，Vibe Coding 仍处早期。

## 一句话理解

Copilot 像"聪明的输入法"补全你的想法；Cursor Agent 像"结对编程伙伴"理解项目改多文件；Vibe Coding 像"你当产品经理，AI 当全栈工程师"，只描述要什么不写怎么写。

## 详细内容

### 四级范式

```
Level 1: 补全（Completion）— GitHub Copilot
  人写代码，AI 补全下一行/函数
  自主度：极低（只补全，不决策）
  上下文：当前文件 + 光标位置
  适合：所有开发者日常提速

Level 2: 编辑（Edit）— Cursor Composer / Copilot Edit
  人描述意图，AI 修改一段代码或多处
  自主度：中（改什么人指定，怎么改 AI 定）
  上下文：多文件 + 项目结构
  适合：重构、批量修改、实现明确功能

Level 3: Agent（自主）— Claude Code / Cursor Agent / Devin
  人给任务（"修复这个 bug"），AI 自主：
  - 探索代码库理解上下文
  - 规划修改方案
  - 编辑多文件
  - 运行测试验证
  - 迭代直到完成
  自主度：高（AI 决策执行路径）
  上下文：整个代码库 + 工具（终端/浏览器）
  适合：明确边界的工程任务

Level 4: Vibe Coding（氛围编程）— 自然语言全程
  人只描述"我想要一个 XX 应用"，AI 从零搭建：
  - 技术选型
  - 架构设计
  - 全部代码
  - 部署
  人不写一行代码，全程自然语言交互
  自主度：极高（AI 主导全流程）
  适合：原型/MVP、非开发者构建应用
  风险：代码质量/可维护性难保证
```

### 代表工具映射

| 范式 | 代表工具 | 2026 定位 |
|------|----------|----------|
| 补全 | GitHub Copilot、Codex | 普及，IDE 标配 |
| 编辑 | Cursor Composer、Copilot Edit | 主流，开发者日常 |
| Agent | Claude Code、Cursor Agent、Devin、Windsurf | 快速增长，工程主力 |
| Vibe Coding | Lovable、Bolt、v0、Replit Agent | 早期，非开发者入场 |

### Agent 编程的关键能力

```
Agent 编程区别于补全/编辑的核心：
1. 代码库理解：能"阅读"整个项目（embedding 检索 + 长上下文）
2. 工具使用：运行命令、执行测试、查看错误、浏览文档
3. 多步规划：分解复杂任务为子步骤
4. 自我验证：跑测试确认改动正确，错了自我修正
5. 上下文管理：长期任务中维护"我在做什么"的状态
```

### 挑战与边界

| 挑战 | 说明 |
|------|------|
| **代码质量** | AI 生成的代码可能"能跑但难维护" |
| **安全性** | Agent 可能引入漏洞或不安全依赖 |
| **可控性** | 自主度高时，人难追踪 AI 做了什么 |
| **成本** | Agent 编程的 token 消耗远超补全 |
| **适用边界** | 复杂系统设计/性能优化仍需人类专家 |

### 2026 趋势

- **Agent IDE 兴起**：Cursor/Windsurf 等"原生 AI IDE"挑战 VS Code
- **终端 Agent**：Claude Code/GitHub Codex CLI 在终端自主工作
- **Spec-driven 开发**：先写规格（spec），Agent 按规格实现
- **多 Agent 协作编程**：一个 Agent 设计、一个实现、一个测试

## Related

- [[_concepts/code-generation|代码生成]] — 基础概念
- [[_concepts/code-generation-workflow|代码生成工作流]] — 工程实践
- [[_concepts/ai-agents|AI Agent]] — Agent 编程的基础
- [[16_AI_Coding/README|AI 编程]] — 章节主页
- [[16_AI_Coding/README|AI 编程]] — 范式理论
