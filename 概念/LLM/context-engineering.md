---
title: "Context Engineering (上下文工程)"
tags: [context-engineering, prompt-engineering, rag-systems, agent-harness, memory-architecture]
created: 2026-06-17
updated: 2026-07-21
tier: core
aliases:
  - "Context Engineering"
  - "context engineering"
category: -concepts
lifecycle: reviewed
relationships:
  - target: "概念/LLM/context-window"
    type: optimizes
  - target: "概念/Agent/agent-harness"
    type: part_of
sources:
  - "https://www.anthropic.com/engineering/claude-code-best-practices"
---

# Context Engineering (上下文工程)

## 定义

上下文工程是一门系统性的工程学科，研究如何设计、组织、优化和管理大语言模型所需的全部信息环境，以确保模型在正确的时间获得正确的信息，从而产生准确、可靠、符合预期的输出。核心命题是：**在正确的时间，将正确的信息，以正确的格式，提供给模型。**

## 从提示词工程到上下文工程的演进

| 维度 | 提示词工程 (Prompt Engineering) | 上下文工程 (Context Engineering) |
|------|------|------|
| 范围 | 单次提示的写法 | 整个信息环境的设计 |
| 时间 | 静态、一次性 | 动态、随任务演进 |
| 来源 | 用户手写 | 系统提示 + RAG + 记忆 + 工具结果 |
| 目标 | 让模型理解意图 | 让模型拥有完成任务的全部信息 |
| 复杂度 | 低（单变量） | 高（多源协调） |
| 典型角色 | 用户/开发者 | Agent Harness / 编排层 |

## 上下文的四大来源

```
┌─────────────────────────────────────────────┐
│              LLM 上下文窗口                  │
├─────────────────────────────────────────────┤
│ 1. System Prompt（系统提示）                 │
│    - 角色定义、行为约束、输出格式           │
├─────────────────────────────────────────────┤
│ 2. RAG 检索结果                              │
│    - 向量检索、关键词检索、知识图谱         │
├─────────────────────────────────────────────┤
│ 3. 记忆系统                                  │
│    - 短期记忆、长期记忆、用户偏好         │
├─────────────────────────────────────────────┤
│ 4. 工具执行结果                              │
│    - API 响应、代码输出、文件内容           │
└─────────────────────────────────────────────┘
```

## 核心策略

### 1. 信息筛选（What to include）

- **相关性过滤**：只注入与当前任务相关的信息
- **重要性排序**：关键信息放在窗口头部或尾部
- **去重与压缩**：避免重复信息浪费窗口

### 2. 格式优化（How to present）

- **结构化标记**：用 XML/Markdown 标签组织信息
- **分层呈现**：摘要 → 详情 → 原始数据
- **示例驱动**：用 Few-shot 示例代替冗长说明

### 3. 动态管理（When to update）

- **懒加载**：只在需要时检索信息
- **过期淘汰**：移除不再相关的旧信息
- **增量更新**：只添加新信息，而非全量重建

### 4. 预算分配（How much）

| 组件 | 典型占比 | 说明 |
|------|----------|------|
| System Prompt | 10-20% | 角色 + 规则 |
| RAG 结果 | 30-50% | 检索到的知识 |
| 对话历史 | 20-30% | 近期对话 |
| 工具结果 | 10-20% | 最新执行结果 |
| 输出预留 | 20-30% | 模型生成空间 |

## Agent 中的上下文工程

在 Agent 系统中，上下文工程尤为关键：

```python
# Agent 每轮循环的上下文组装
def assemble_context(task, memory, tools):
    context = []
    
    # 1. 系统提示（固定）
    context.append(system_prompt)
    
    # 2. 任务相关记忆（检索）
    relevant_memories = memory.recall(task.query, top_k=5)
    context.append(format_memories(relevant_memories))
    
    # 3. 工具结果（最新）
    for result in tool_results[-3:]:  # 只保留最近 3 个
        context.append(truncate(result, max_chars=2000))
    
    # 4. 对话历史（压缩）
    context.append(compress_history(conversation))
    
    return context
```

## 常见反模式

| 反模式 | 问题 | 解法 |
|--------|------|------|
| **信息过载** | 塞入太多无关内容 | 严格相关性过滤 |
| **Lost in Middle** | 关键信息被淡化 | 重要内容放头/尾 |
| **格式混乱** | 模型难以解析 | 统一结构化标记 |
| **过期信息** | 旧数据误导决策 | 时间戳 + 过期策略 |
| **窗口浪费** | 重复/冗余内容 | 去重 + 摘要压缩 |

## 2026 趋势

- **上下文工程 > 提示词工程**：Agent 时代的核心技能
- **自动化上下文管理**：框架自动处理检索、压缩、淘汰
- **多模态上下文**：图片、音频、视频纳入上下文管理
- **上下文即代码**：用代码而非自然语言管理上下文

## See Also (深度专题)

- [[大模型/Prompt_Engineering/Context_Engineering_Guide|上下文工程指南]] — 系统性方法论
- [[大模型/Prompt_Engineering/Context_Engineering_Patterns|上下文工程模式]] — 工程实践
- [[大模型/Prompt_Engineering/Hello_Agents_L09_Context_Engineering|Agent 上下文工程]] — Agent 中的上下文管理
- [[概念/LLM/context-window|Context Window]] — 上下文的物理限制
- [[概念/LLM/prompt-engineering|Prompt Engineering]] — 上下文工程的前身
- [[概念/Agent/agent-memory-systems|Agent 记忆系统]] — 上下文的记忆来源
- [[RAG系统/RAG_Fundamentals/RAG_Fundamentals|RAG 基础]] — 上下文的检索来源