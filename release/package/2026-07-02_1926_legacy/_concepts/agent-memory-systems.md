---
title: "Agent 记忆系统（Memory）"
category: -concepts
tags: ["agent", "memory", "short-term", "long-term", "episodic", "semantic", "context"]
relationships:
  - target: "_concepts/ai-agents"
    type: core_ability
  - target: "_concepts/agent-planning"
    type: supports
  - target: "_concepts/rag-systems"
    type: related_to
sources:
  - Agent/Agent_Foundations/AI_Agents.md
  - RAG系统/README.md
summary: "Agent 记忆系统让 Agent 跨步骤、跨会话保持信息。短期记忆（上下文窗口）处理当前任务，长期记忆（向量库/知识图谱）沉淀经验，情景记忆记录过往交互，三者配合让 Agent 从'金鱼记忆'进化为'有经验的学习者'。"
provenance:
  extracted: 0.7
  inferred: 0.25
  ambiguous: 0.05
base_confidence: 0.78
lifecycle: stable
lifecycle_changed: 2026-06-23
tier: core
created: 2026-06-23
updated: 2026-06-23
aliases:
  - "Agent Memory Systems"
  - "agent memory systems"

---
# Agent 记忆系统（Memory）

## 核心要点

- **无记忆的 Agent**：每步都"失忆"，无法累积经验、保持一致。
- **三种记忆**：短期（工作记忆/上下文窗口）、长期（持久化知识）、情景（过往交互记录）。
- **实现**：短期=LLM 上下文；长期=向量数据库/知识图谱；情景=对话日志检索。

## 一句话理解

记忆系统让 Agent 从"每次都从零开始的实习生"变成"记得上次怎么解决问题的资深员工"，长程任务和个性化都依赖它。

## 详细内容

### 记忆类型对比

| 类型 | 类比 | 存储 | 容量 | 用途 |
|------|------|------|------|------|
| **短期记忆** | 工作记忆（RAM） | LLM 上下文窗口 | 8K-2M token | 当前任务的中间状态 |
| **长期记忆** | 知识（硬盘） | 向量库/知识图谱 | 无限 | 跨会话的事实与偏好 |
| **情景记忆** | 经历（日记） | 对话日志+检索 | 无限 | "上次类似问题怎么解决的" |

### 短期记忆管理（上下文工程）

```
问题：上下文窗口有限（即使 1M token 也不够长程任务）

策略：
1. 滑动窗口：只保留最近 N 轮对话
2. 摘要压缩：把早期对话摘要为简短总结
3. 选择性保留：用注意力分数保留重要片段
4. 外部卸载：把中间结果存数据库，需要时检索回上下文

  → 这就是"上下文工程"（Context Engineering），2026 热点
```

### 长期记忆实现

```
写入：用户交互 → 提取关键事实 → embedding → 存向量库
读取：当前任务 → embedding 查询 → 检索相关记忆 → 注入上下文

进阶：
  - 知识图谱记忆：存实体-关系，支持结构化推理
  - 分层记忆：近期（高频访问）vs 归档（冷存储）
  - 遗忘机制：淘汰过时/低价值记忆，防记忆库膨胀
```

### 记忆系统的挑战

| 挑战 | 问题 | 解法 |
|------|------|------|
| **记忆污染** | 错误信息被记住，误导未来 | 置信度过滤 + 人工审核 |
| **检索噪声** | 检索到不相关记忆 | 重排序（reranker）+ 时间衰减 |
| **一致性** | 新旧记忆冲突 | 时间戳优先 + 冲突检测 |
| **隐私** | 记忆含敏感信息 | 差分隐私 + 加密存储 + 过期删除 |

### 2026 趋势

- **超长上下文（1M+）减少外部记忆依赖**：但成本高，短期记忆仍需管理
- **记忆即 RAG**：长期记忆本质是"对自己的 RAG"，复用 RAG 技术栈
- **Agent 个性化**：基于记忆实现用户偏好学习（如 ChatGPT Memory）

## Related

- [[_concepts/ai-agents|AI Agent]] — Agent 基础
- [[_concepts/rag-systems|RAG 系统]] — 记忆检索的技术基础
- [[_concepts/agent-planning|Agent 规划]] — 规划依赖记忆中的经验
- [[_concepts/kv-cache|KV Cache]] — 短期记忆的底层优化
- [[RAG系统/README|RAG 系统]] — 检索增强章节
- [[Agent/Agent_Foundations/AI_Agents|AI Agents 详解]]
