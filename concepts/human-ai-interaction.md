---
title: "人机交互 (Human-AI Interaction)"
category: concepts
tags: ["hci", "human-ai-interaction", "ux", "agentic-ui"]
summary: "人机交互研究人类如何与 AI 系统有效协作——从传统的 GUI 到对话式 AI 再到 Agentic UI 的演进。"
created: 2026-06-12
updated: 2026-06-12
---

# 人机交互 (Human-AI Interaction)

> 人机交互研究人类如何与 AI 系统有效协作——从传统的 GUI 到对话式 AI 再到 Agentic UI 的演进。

## 交互范式演进

```
CLI → GUI → Touch → Voice → Conversational AI → Agentic UI
命令    图形   触控    语音     对话式 AI          代理式界面
```

## Agentic UI 设计原则

1. **透明度**: 让用户理解 AI 在做什么、为什么
2. **可控性**: 人类可随时介入、修正、终止
3. **渐进信任**: 从建议模式 → 自动模式逐步放权
4. **可解释性**: AI 的决策过程对用户可见
5. **容错设计**: AI 犯错时人类能轻松纠正

## 设计模式

- **Canvas 模式**: AI 生成草稿，人类在 Canvas 上编辑（Cursor、Notion AI）
- **Chat + Actions**: 对话中嵌入可执行动作（ChatGPT Plugins）
- **Agent Dashboard**: 监控 Agent 运行状态，必要时人工介入
- **Diff Review**: AI 修改以 diff 形式呈现，逐条审批

## 相关阅读

- [[13_Agent_Production/Agent_Workflow/Agentic_UI_UX_Design_2026]] — Agentic UI/UX 设计
- [[13_Agent_Production/GenAI_L12_Designing_UX_for_AI_Applications]] — AI 应用 UX 设计
