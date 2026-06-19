---
title: "Hello-Agents L15：构建赛博小镇（AI NPC + 游戏引擎 + 记忆好感度）"
category: "13-agent-production"
tags:
  - ai-agents
  - ai-npc
  - godot
  - game-ai
  - memory
  - relationship-system
  - hello-agents
sources:
  - "_raw/github-sources/hello-agents/docs/chapter15/第十五章 构建赛博小镇.md"
  - "https://github.com/datawhalechina/hello-agents"
summary: "Datawhale Hello-Agents 第十五章笔记：将 LLM Agent 与 Godot 游戏引擎结合，构建拥有记忆、好感度与自然语言对话能力的 AI NPC 赛博小镇。"
provenance:
  extracted: 0.75
  inferred: 0.20
  ambiguous: 0.05
base_confidence: 0.84
lifecycle: draft
tier: supporting
created: 2026-06-12
updated: 2026-06-12
---

# Hello-Agents L15：构建赛博小镇

> **一句话理解**: 本章将 Agent 技术与 **Godot 游戏引擎**结合，构建一个 2D 像素风格的 AI 小镇，其中 NPC 具备自然语言对话、短期/长期记忆、好感度系统与情感分析能力。

---

## 1. 为什么要构建 AI 小镇

传统游戏 NPC 的局限：

- 台词固定或仅能通过预设对话树有限互动
- 缺乏真正的“智能”与“生命力” ^[extracted]

AI 小镇的愿景：

- NPC 理解玩家自然语言，不限于预设选项
- NPC 记住历史互动、关系与玩家喜好
- 每个 NPC 有独立职业、性格、说话风格
- NPC 态度随互动从陌生 → 熟悉 → 友好 → 亲密 ^[extracted]

---

## 2. 应用场景

- 教育游戏：历史人物、科学家与学生互动式教学
- 虚拟办公室：同事/导师 NPC 提供帮助与建议
- 心理健康：陪伴型 NPC 进行情感交流
- 传统游戏：增强 NPC 体验 ^[extracted]

---

## 3. 核心功能

1. **智能 NPC 对话系统**: 基于角色设定与记忆的自然语言回应
2. **记忆系统**: 短期记忆 + 长期记忆
3. **好感度系统**: 随互动动态变化
4. **游戏化交互**: 2D 像素办公室场景自由移动
5. **实时日志系统**: 记录对话与互动用于调试分析 ^[extracted]

---

## 4. 技术架构

采用**游戏引擎 + 后端服务**分离架构 ^[extracted]：

```
赛博小镇
├── 前端层 (Godot 4.5)
│   ├── 游戏渲染、玩家控制、NPC 显示、对话 UI
│   └── 2D 像素风格办公室场景
├── 后端层 (FastAPI)
│   ├── API 路由、NPC 状态管理、对话处理、日志记录
├── 智能体层 (HelloAgents)
│   ├── 每个 NPC 是一个 SimpleAgent 实例
│   ├── 独立记忆与状态
│   └── 好感度计算
└── 外部服务层
    ├── LLM API
    ├── Qdrant 向量数据库
    └── SQLite 关系数据库
```

### 4.1 数据流转

1. 玩家在 Godot 中按 E 键与 NPC 互动
2. Godot 通过 HTTP API 发送对话请求到 FastAPI 后端
3. 后端调用 HelloAgents SimpleAgent 处理对话
4. Agent 从记忆系统检索相关历史
5. 调用 LLM 生成回复
6. 后端更新 NPC 状态与好感度，记录日志
7. 返回回复给 Godot 前端展示 ^[extracted]

---

## 5. 好感度系统

- 后端实现，每次对话根据消息内容与情感分析调整好感度值
- 状态示例：陌生 → 熟悉 → 友好 → 亲密 → 挚友
- 日志记录：当前好感度、检索记忆、回复、变化量、变化原因、情感分析结果 ^[extracted]
- 可通过 `python view_logs.py` 实时查看 ^[extracted]

---

## 6. 运行方式

- **后端**: `python main.py`
- **前端**: Godot 4.2+ 导入 `helloagents-ai-town/scenes/main.tscn` 后按 F5 运行
- 需要配置 LLM API Key ^[extracted]

---

## 7. 工程收获

- 理解 LLM Agent 与游戏引擎的集成模式
- 掌握 NPC 记忆、好感度、情感分析的设计方法
- 认识 Agent 在虚拟社交/娱乐场景中的应用潜力 ^[inferred]

---

## 8. 关联阅读

- [[15_Agent_Production/Hello_Agents_L08_Memory_RAG]] — 记忆与 RAG 系统
- [[15_Agent_Production/Hello_Agents_L13_Travel_Assistant]] — 另一个综合项目
- [[15_Agent_Production/GenAI_L17_AI_Agents]] — AI Agent 基础
- [[15_Agent_Production/Agent_Frameworks/README]] — Agent 框架总览
