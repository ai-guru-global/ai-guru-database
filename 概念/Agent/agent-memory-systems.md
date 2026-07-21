---
title: "Agent 记忆系统（Memory）"
category: -concepts
tags: ["agent", "memory", "short-term", "long-term", "episodic", "semantic", "context"]
relationships:
  - target: "概念/Agent/ai-agents"
    type: core_ability
  - target: "概念/Agent/agent-planning"
    type: supports
  - target: "概念/Agent/agent-loop"
    type: used_by
sources:
  - "https://arxiv.org/abs/2309.02427"  # Cognitive Architectures for LLM Agents
summary: "Agent 记忆系统让 Agent 跨步骤、跨会话保持信息。短期记忆（上下文窗口）处理当前任务，长期记忆（向量库/知识图谱）沉淀经验，情景记忆记录过往交互，三者配合让 Agent 从'金鱼记忆'进化为'有经验的学习者'。"
lifecycle: reviewed
tier: core
created: 2026-06-23
updated: 2026-07-21
aliases:
  - "Agent Memory Systems"
  - "agent memory systems"
---

# Agent 记忆系统（Memory）

## 核心要点

- **无记忆的 Agent**：每步都"失忆"，无法累积经验、保持一致
- **三种记忆**：短期（工作记忆/上下文窗口）、长期（持久化知识）、情景（过往交互记录）
- **实现**：短期=LLM 上下文；长期=向量数据库/知识图谱；情景=对话日志检索

## 一句话理解

记忆系统让 Agent 从"每次都从零开始的实习生"变成"记得上次怎么解决问题的资深员工"，长程任务和个性化都依赖它。

## 记忆类型对比

| 类型 | 类比 | 存储 | 容量 | 用途 |
|------|------|------|------|------|
| **短期记忆** | 工作记忆（RAM） | LLM 上下文窗口 | 8K-2M token | 当前任务的中间状态 |
| **长期记忆** | 知识（硬盘） | 向量库/知识图谱 | 无限 | 跨会话的事实与偏好 |
| **情景记忆** | 经历（日记） | 对话日志+检索 | 无限 | "上次类似问题怎么解决的" |
| **程序记忆** | 技能（肌肉记忆） | 工具配置/工作流 | 固定 | "怎么做"的操作知识 |

## 短期记忆管理（上下文工程）

### 问题

上下文窗口有限（即使 1M token 也不够长程任务），且窗口越长成本越高、注意力越分散。

### 管理策略

| 策略 | 原理 | 适用场景 |
|------|------|----------|
| **滑动窗口** | 只保留最近 N 轮对话 | 简单对话 |
| **摘要压缩** | 把早期对话摘要为简短总结 | 长对话 |
| **选择性保留** | 用注意力分数保留重要片段 | 多主题对话 |
| **外部卸载** | 把中间结果存数据库，需要时检索 | 长程任务 |
| **分层加载** | 核心信息常驻 + 详细信息按需加载 | 复杂 Agent |

```python
# 摘要压缩示例
def compress_context(messages, max_tokens=4000):
    if count_tokens(messages) <= max_tokens:
        return messages
    
    # 保留最近 5 轮 + 摘要早期内容
    recent = messages[-10:]  # 最近 5 轮对话
    early = messages[:-10]
    summary = llm.summarize(early)
    
    return [SystemMessage(f"早期对话摘要: {summary}")] + recent
```

## 长期记忆实现

### 写入流程

```
用户交互 → 提取关键事实 → 去重/冲突检测 → embedding → 存向量库
                                              → 元数据（时间戳、来源、置信度）
```

### 读取流程

```
当前任务 → embedding 查询 → 检索 Top-K 相关记忆 → 重排序 → 注入上下文
```

### 代码示例

```python
class AgentMemory:
    def __init__(self, vector_store, llm):
        self.store = vector_store
        self.llm = llm
    
    def remember(self, interaction):
        """提取并存储记忆"""
        facts = self.llm.extract_facts(interaction)
        for fact in facts:
            # 冲突检测
            existing = self.store.search(fact.text, top_k=3)
            if self._conflicts(fact, existing):
                self.store.update(existing[0].id, fact)  # 更新而非重复
            else:
                self.store.add(fact)
    
    def recall(self, query, top_k=5):
        """检索相关记忆"""
        results = self.store.search(query, top_k=top_k)
        # 时间衰减：近期记忆权重更高
        return self._apply_recency_boost(results)
```

### 进阶实现

| 技术 | 说明 | 优势 |
|------|------|------|
| **知识图谱记忆** | 存实体-关系，支持结构化推理 | 多跳推理、关系查询 |
| **分层记忆** | 近期（高频访问）vs 归档（冷存储） | 成本优化 |
| **遗忘机制** | 淘汰过时/低价值记忆 | 防记忆库膨胀 |
| **反思整合** | 定期将情景记忆整合为语义记忆 | 经验沉淀 |

## 记忆系统的挑战

| 挑战 | 问题 | 解法 |
|------|------|------|
| **记忆污染** | 错误信息被记住，误导未来 | 置信度过滤 + 人工审核 |
| **检索噪声** | 检索到不相关记忆 | 重排序（reranker）+ 时间衰减 |
| **一致性** | 新旧记忆冲突 | 时间戳优先 + 冲突检测 |
| **隐私** | 记忆含敏感信息 | 差分隐私 + 加密存储 + 过期删除 |
| **膨胀** | 记忆无限增长 | 定期整合 + 重要性评分 + 淘汰 |

## 主流框架的记忆实现

| 框架/产品 | 记忆机制 | 特点 |
|----------|----------|------|
| **ChatGPT Memory** | 自动提取用户偏好 | 用户可查看/删除 |
| **Claude Projects** | 项目级知识 + 对话记忆 | 结构化项目上下文 |
| **Mem0** | 开源记忆层 | 自动提取、去重、更新 |
| **LangMem** | LangChain 记忆模块 | 多种记忆类型可组合 |
| **CrewAI Memory** | 四层记忆 | 短期/长期/实体/用户 |
| **Zep** | 企业级记忆服务 | 知识图谱 + 向量混合 |

## 2026 趋势

- **超长上下文（1M+）减少外部记忆依赖**：但成本高，短期记忆仍需管理
- **记忆即 RAG**：长期记忆本质是"对自己的 RAG"，复用 RAG 技术栈
- **Agent 个性化**：基于记忆实现用户偏好学习
- **记忆安全**：防止记忆注入攻击（prompt injection 持久化）
- **多 Agent 共享记忆**：团队级知识库，Agent 间经验共享

## 最佳实践

1. **写入时验证**：存储前检查事实性和一致性
2. **读取时重排**：检索后用 reranker 精排，提高相关性
3. **定期整合**：将零散情景记忆整合为结构化语义记忆
4. **用户可控**：允许用户查看、编辑、删除记忆
5. **时间感知**：记忆带时间戳，近期记忆权重更高
6. **容量管理**：设置上限，淘汰低价值记忆

## Related

- [[概念/Agent/ai-agents|AI Agent]] — Agent 基础
- [[概念/Agent/agent-loop|Agent Loop]] — 记忆在循环中的读写
- [[概念/Agent/agent-planning|Agent 规划]] — 规划依赖记忆中的经验
- [[概念/LLM/context-window|Context Window]] — 短期记忆的载体
- [[概念/LLM/context-engineering|上下文工程]] — 短期记忆管理技术
- [[RAG系统/RAG_Fundamentals/RAG_Fundamentals|RAG 基础]] — 记忆检索的技术基础
- [[智能体/Agent_Foundations/AI_Agents|AI Agents 详解]]
