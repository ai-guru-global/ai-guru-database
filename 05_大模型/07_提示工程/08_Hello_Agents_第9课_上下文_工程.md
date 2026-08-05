---
title: "Hello-Agents L09：上下文工程（Context Engineering）"
category: "05-nlp-llms-prompt-engineering"
tags:
  - context-engineering
  - prompt-engineering
  - ai-agents
  - long-context
  - sub-agent
  - hello-agents
sources:
  - "原始/github-sources/hello-agents/docs/chapter9/第九章 上下文工程.md"
  - "https://github.com/datawhalechina/hello-agents"
summary: "Datawhale Hello-Agents 第九章笔记：上下文工程是提示工程的演进，关注如何在推理阶段策划与维护最优信息集合，解决上下文腐蚀与长时程任务连贯性问题。"
provenance:
  extracted: 0.73
  inferred: 0.22
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: draft
tier: supporting
created: 2026-06-12
updated: 2026-06-12
aliases:
  - "Hello Agents L09 Context Engineering"
  - Hello_Agents_L09_Context_Engineering

name_zh: "Hello-Agents L09：上下文工程"
---
# Hello-Agents L09：上下文工程

> 中文简称：Hello-Agents L09：上下文工程

> **一句话理解**: 上下文工程关注“在每次模型调用前，如何以可复用、可度量、可演进的方式拼装并优化输入上下文”，是提示工程在 Agent 长程交互场景下的自然延伸。

---

## 1. 上下文工程 vs 提示工程

| 维度 | 提示工程（Prompt Engineering） | 上下文工程（Context Engineering） |
|------|------------------------------|----------------------------------|
| 关注点 | 如何编写有效提示 | 如何策划与维护最优信息集合（tokens） |
| 范围 | 单次/少轮交互 | 多轮、长时程、工具调用、外部数据 |
| 核心问题 | 提示措辞与结构 | 哪些 tokens 应进入有限的上下文窗口 |

表格基于教材图 9.1 与文字总结 ^[extracted]。

---

## 2. 为什么上下文工程重要

### 2.1 上下文腐蚀（Context Rot）

- 随着上下文 tokens 增加，模型准确回忆信息的能力反而下降
- 上下文是**有限资源**，具有边际收益递减特性 ^[extracted]

### 2.2 Transformer 架构约束

- 自注意力理论上形成 $n^2$ 级别两两关系
- 长序列下注意力被“拉薄”，长程推理精度下降 ^[extracted]

---

## 3. 有效上下文的“解剖学”

### 3.1 系统提示（System Prompt）

- 信息层级“刚刚好”，避免过度硬编码的 if-else 逻辑
- 避免过于空泛，缺少具体信号
- 建议分区组织：`<background_information>`、`<instructions>`、工具指引、输出描述 ^[extracted]

### 3.2 工具（Tools）

- 职责单一、接口语义清晰、对错误鲁棒
- 入参描述明确，充分发挥模型推理能力
- 警惕“臃肿工具集”：若工程师都说不准用哪个工具，Agent 也难以做好选择 ^[extracted]

### 3.3 示例（Few-shot）

- 精挑细选**多样且典型**的示例
- 对 LLM 而言，好的示例胜过千言万语 ^[extracted]

总指导思想：**信息充分但紧致** ^[extracted]。

---

## 4. 上下文检索与智能体式搜索

- 从“推理前一次性检索”过渡到 **JIT（Just-in-Time）上下文**
- 维护**轻量化引用**（文件路径、存储查询、URL），运行时动态加载
- 允许智能体使用 `head`/`tail`、`glob`、`grep` 等原语自主导航 ^[extracted]
- 目录层级、命名约定、时间戳等元数据本身帮助精化行为 ^[inferred]

### 4.1 混合策略

- 前置加载少量高价值上下文保证速度
- 允许智能体按需继续自主探索 ^[extracted]

---

## 5. 面向长时程任务的上下文工程

### 5.1 压缩整合（Compaction）

- 当对话接近上下文上限时，进行高保真总结
- 用摘要重启新上下文窗口，维持长程连贯性
- 保留架构性决策、未解决缺陷、实现细节，丢弃重复工具输出与噪声 ^[extracted]

### 5.2 结构化笔记（Structured Note-taking）

- 智能体以固定频率将关键信息写入上下文外的持久化存储
- 维护 TODO 列表、NOTES.md、关键结论/依赖/阻塞项索引 ^[extracted]
- 结合 `MemoryTool` 实现文件式/向量式外部记忆 ^[extracted]

### 5.3 子代理架构（Sub-agent Architectures）

- 主代理负责高层规划与综合
- 专长子代理在干净上下文窗口中深入探索，仅回传凝练摘要（通常 1,000–2,000 tokens）
- 适合并行探索的复杂研究/分析任务 ^[extracted]

### 5.4 方法取舍

| 方法 | 适合场景 |
|------|----------|
| 压缩整合 | 需要长对话连续性的任务 |
| 结构化笔记 | 有里程碑/阶段性成果的迭代任务 |
| 子代理架构 | 复杂研究与分析，可从并行探索获益 |

表格基于教材整理 ^[inferred]。

---

## 6. HelloAgents ContextBuilder

- 实现 **GSSC（Gather-Select-Structure-Compress）** 流水线
- 输出固定骨架模板：
  - `[Role & Policies]`: 角色定位与行为准则
  - `[Task]`: 当前具体任务
  - `[State]`: 当前状态与上下文信息
  - `[Evidence]`: 外部知识库检索证据
  - `[Context]`: 历史对话与相关记忆 ^[extracted]

---

## 7. 关联阅读

- [[05_大模型/07_提示工程/16_Prompt工程]] — 提示工程基础
- [[05_大模型/07_提示工程/Prompt_Engineering_Principles_Ng]] — Ng 提示工程原则
- [[15_智能体/Hello_Agents_L08_Memory_RAG]] — 记忆与 RAG
- [[15_智能体/03_Agent工作流/06_工作流_简明指南]] — Agent 工作流总览
- [[05_大模型/07_提示工程/Hello_Agents_L04_ReAct|ReAct 模式]]

## 8. 代码示例：ContextBuilder

```python
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class ContextBuilder:
    """GSSC 上下文构建器"""
    role: str
    task: str
    state: dict
    evidence: List[str]
    history: List[dict]
    max_tokens: int = 8000
    
    def gather(self) -> List[str]:
        """收集所有可用信息"""
        items = []
        items.append(f"[Role] {self.role}")
        items.append(f"[Task] {self.task}")
        items.append(f"[State] {self.state}")
        items.extend([f"[Evidence] {e}" for e in self.evidence])
        items.extend([f"[History] {h}" for h in self.history[-5:]])
        return items
    
    def select(self, items: List[str]) -> List[str]:
        """选择最相关的信息"""
        # 简单策略：按相关性排序，截断到 max_tokens
        return items[:self.max_tokens // 100]
    
    def structure(self, items: List[str]) -> str:
        """结构化组织上下文"""
        return "\n\n".join(items)
    
    def compress(self, context: str) -> str:
        """压缩过长上下文"""
        if len(context) > self.max_tokens * 4:
            # 调用 LLM 进行摘要
            return self._summarize(context)
        return context
    
    def build(self) -> str:
        """GSSC 流水线"""
        items = self.gather()
        selected = self.select(items)
        structured = self.structure(selected)
        return self.compress(structured)
```

## 9. 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 上下文超限 | 信息太多 | 压缩整合 |
| 信息丢失 | 过度压缩 | 结构化笔记 |
| 检索不准 | 查询模糊 | JIT 上下文 |
| 长任务失败 | 上下文腐蚀 | 子代理架构 |

## 10. 生产检查清单

1. ✅ 实现 GSSC 上下文流水线
2. ✅ 设置上下文窗口限制
3. ✅ 实现压缩整合机制
4. ✅ 使用结构化笔记持久化
5. ✅ 对复杂任务使用子代理
6. ✅ 监控上下文使用率
7. ✅ 实现 JIT 上下文检索
8. ✅ 建立上下文质量评估

## 总结

上下文工程是提示工程在 Agent 长程交互场景下的自然演进。它关注如何在有限的上下文窗口内策划并维护最优信息集合，解决上下文腐蚀和长时程任务连贯性问题。GSSC（Gather-Select-Structure-Compress）流水线是上下文工程的核心方法论，配合压缩整合、结构化笔记和子代理架构，可以构建可靠的长程 Agent。

> 💡 上下文工程的核心：不是"塞得越多越好"，而是"选得越准越好"——在有限的上下文窗口内，放入最相关的信息，才能获得最佳的推理效果。
