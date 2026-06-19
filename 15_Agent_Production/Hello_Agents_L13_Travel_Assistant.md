---
title: "Hello-Agents L13：智能旅行助手（多 Agent + MCP 实战）"
category: "13-agent-production"
tags:
  - ai-agents
  - multi-agent
  - mcp
  - travel-assistant
  - fastapi
  - vue3
  - hello-agents
sources:
  - "_raw/github-sources/hello-agents/docs/chapter13/第十三章 智能旅行助手.md"
  - "https://github.com/datawhalechina/hello-agents"
summary: "Datawhale Hello-Agents 第十三章笔记：综合运用 ReAct、MCP、多 Agent 协作与前后端分离架构，构建可规划行程、计算预算、地图可视化与导出分享的智能旅行助手。"
provenance:
  extracted: 0.76
  inferred: 0.19
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: draft
tier: supporting
created: 2026-06-12
updated: 2026-06-12
---

# Hello-Agents L13：智能旅行助手

> **一句话理解**: 本章将前面章节实现的 HelloAgents 框架能力综合落地，构建一个真实可用的**智能旅行助手**：智能行程规划、地图可视化、预算计算、行程编辑、PDF/图片导出。

---

## 1. 项目解决的问题

传统旅行规划的痛点：

- **信息分散**: 景点、天气、酒店信息分散在不同平台
- **缺少个性化**: 通用攻略不考虑个人偏好、预算、出行时间
- **难以调整**: 修改行程需要重新规划顺序、时间、预算 ^[extracted]

---

## 2. 核心功能

1. **智能行程规划**: 输入目的地、日期、偏好，自动生成完整行程
2. **地图可视化**: 标注景点位置、绘制游览路线
3. **预算计算**: 自动计算门票、酒店、餐饮、交通费用
4. **行程编辑**: 添加、删除、调整景点，实时更新地图
5. **导出功能**: 导出为 PDF 或图片 ^[extracted]

---

## 3. 技术架构

采用经典**前后端分离**四层架构 ^[extracted]：

```
智能旅行助手
├── 前端层 (Vue3 + TypeScript)
│   └── 用户交互、数据展示、地图可视化
├── 后端层 (FastAPI)
│   └── API 路由、数据验证、业务逻辑
├── 智能体层 (HelloAgents)
│   └── 4 个专门 Agent：任务分解、工具调用、结果整合
└── 外部服务层
    ├── 高德地图 API
    ├── Unsplash API
    └── LLM API
```

### 3.1 数据流转

1. 用户在前端填写表单
2. 后端验证数据并调用智能体系统
3. 智能体依次调用景点搜索、天气查询、酒店推荐、行程规划 Agent
4. 每个 Agent 通过 **MCP 协议**调用外部 API
5. 整合结果返回前端渲染展示 ^[extracted]

---

## 4. 多 Agent 协作设计

- 系统包含 4 个专门 Agent，分别负责不同子任务 ^[extracted]
- 通过 MCP 协议统一接入高德地图、Unsplash 等外部服务
- 避免为每个 API 手写专属 Tool 类，提升可维护性 ^[inferred]

---

## 5. 运行方式

- **后端**: `uvicorn app.api.main:app --reload`
- **前端**: `npm run dev`
- 需要配置 LLM API Key、高德地图 Web 服务 Key、Unsplash Access Key ^[extracted]

---

## 6. 工程收获

- 将 Agent 范式、工具系统、通信协议整合到完整产品
- 理解多 Agent 分工与 MCP 在真实场景中的价值
- 掌握 FastAPI + Vue3 + HelloAgents 的集成模式 ^[inferred]

---

## 7. 关联阅读

- [[13_Agent_Production/Hello_Agents_L10_Agent_Protocols]] — MCP / A2A / ANP 协议
- [[13_Agent_Production/Hello_Agents_L08_Memory_RAG]] — 记忆与 RAG
- [[13_Agent_Production/GenAI_L17_AI_Agents]] — AI Agent 基础
- [[11_RAG_Systems/Agentic_RAG_Guide]] — Agentic RAG 指南
- [[13_Agent_Production/Hello_Agents_L15_Cyber_Town]] — 另一个综合项目：赛博小镇
