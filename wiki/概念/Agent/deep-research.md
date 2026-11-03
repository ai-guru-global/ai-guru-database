---
title: Deep Research（深度研究）
category: -concepts
aliases:
  - Deep Research
  - DeepResearch
  - 深度搜索
  - 深度研究
  - Deep Research Agent
tags:
  - deep-research
  - agentic-rag
  - web-agent
relationships:
  - target: '概念/RAG/rag-systems'
    type: related_to
  - target: '概念/RAG/agentic-rag-2'
    type: related_to
  - target: '概念/Agent/tool-use'
    type: related_to
  - target: '概念/Agent/agent-planning'
    type: related_to
  - target: '概念/Agent/browser-agent'
    type: related_to
  - target: '概念/Agent/computer-use'
    type: related_to
sources:
  - arXiv 2510.24701 (Tongyi DeepResearch Technical Report, 2025-10)
  - 14_RAG系统/08_Deep_Research/01_Deep_Research_全景_2026.md
summary: "Deep Research 是检索增强的第四级演进形态：模型自主规划研究计划、多轮并行检索、交叉验证证据，产出带引用地图的长报告——检索从目标降级为子例程。"
tier: core
created: 2026-11-03
updated: 2026-11-03
review_by: 2027-01-25
name_zh: "Deep Research（深度研究）"
---

# Deep Research（深度研究）

> 中文简称：Deep Research（深度研究）

> **一句话理解**: 让模型像研究员一样工作——拆解课题、多轮检索、交叉验证信源，最后交出一份每条论断都能回查出处的报告。

## 核心要点

- **定位**：检索增强的第四级演进（搜索 → RAG → Agentic RAG → Deep Research）；RAG 解决「知识在哪」，Deep Research 解决「研究怎么做」。
- **四阶段架构**：规划器（澄清+子问题分解）→ 检索编排（multi-query 扩展 + fan-out 并行 + 增益闸）→ 交叉验证（claim→source 映射 + 冲突消解）→ 综合（分节生成 + 无引用不落笔）。
- **三个贯穿设计**：笔记外置（scratchpad）、增益饱和检测、硬预算闸——分别防上下文爆仓、过度检索、无限循环。
- **2026 格局三分法**：闭源产品（OpenAI/Gemini/Perplexity/Anthropic）、开源模型（Tongyi DeepResearch 30B-A3B 等）、开源编排框架（GPT-Researcher / open-deep-research 等）。

## 与相邻概念

| 概念 | 关系 |
|------|------|
| [[概念/RAG/rag-systems\|RAG]] | 前置形态——检索是目标；Deep Research 中检索降级为子例程 |
| [[概念/RAG/agentic-rag-2\|Agentic RAG]] | 中间形态——少轮循环（2–5 次），输出仍是答案而非报告 |
| [[概念/Agent/tool-use\|Tool Use]] | 实现机制——搜索/浏览/代码执行都是工具调用 |
| [[概念/Agent/agent-planning\|Agent 规划]] | 核心能力——研究计划即规划产物 |
| [[概念/Agent/browser-agent\|Browser Agent]] | 动作空间更宽的兄弟形态 |
| [[概念/Agent/computer-use\|Computer Use]] | 同谱系高风险端——操作任意 GUI，Deep Research 先产品化因其低风险 |

## 开放问题

- 长任务（>20 分钟）的漂移尚无根治方案，只有缓解（计划回锚、笔记外置）。
- 间接提示注入：检索内容作为「不可信数据」进入上下文的安全边界仍在演进。
- Deep Research 与记忆系统结合（研究员画像跨会话累积）是 2026 的活跃方向。

## 深入阅读

- 工程系列（RAG 章视角）：[[14_RAG系统/08_Deep_Research/01_Deep_Research_全景_2026|全景]] → [[14_RAG系统/08_Deep_Research/02_架构拆解_四阶段流水线|架构拆解]] → [[14_RAG系统/08_Deep_Research/03_开源实现对比与最小复现|开源复现]] → [[14_RAG系统/08_Deep_Research/04_Deep_Research_评测|评测]] → [[14_RAG系统/08_Deep_Research/05_面试快问快答_30题|快答 30 题]]
- Agent 视角总览（产品格局 + 训练范式三阶段）：[[15_智能体/17_Agent应用/02_Deep_Research_Agent|深度研究智能体先导页]]
- 测试时计算视角：[[05_大模型/08_推理模型/08_Test_Time_算力_2026|Test-Time 算力扩展]]

---

*Last updated: 2026-11-03*
