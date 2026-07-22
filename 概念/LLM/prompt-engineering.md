---
title: 提示工程
category: -concepts
tags: [fine-tuning-techniques, prompt-engineering, cot, few-shot, llm-infrastructure]
relationships:
  - target: "[[概念/llm-architectures]]"
    type: applies_to
  - target: "概念/fine-tuning-techniques"
    type: alternative_to
  - target: "概念/reasoning-models"
    type: enables
sources: [大模型/Prompt_Engineering/Prompt_Engineering.md]
summary: 提示工程是设计和优化输入提示词以引导LLM产生期望输出的技术，不需要修改模型参数。核心技术从Zero-shot、Few-shot到思维链（CoT）和思维树（ToT），是使用LLM最低成本、最高效的优化手段。
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-07-21
tier: core
created: 2026-05-31T00:00:00Z
updated: 2026-07-21T00:00:00Z
aliases:
  - "Prompt Engineering"
  - "prompt engineering"

---
# 提示工程

## 概述

提示工程（Prompt Engineering）是设计和优化输入提示词以引导大语言模型产生期望输出的技术。不需要修改模型参数，仅通过构造更好的输入来提升模型表现，是使用LLM最低成本的优化手段。

优化优先级：先优化Prompt → 不够再加RAG → 还不行再 微调。

## Prompt基本结构

| 组件 | 说明 |
|------|------|
| 系统提示（System Prompt） | 定义模型角色和行为准则 |
| 任务指令（Instruction） | 明确告诉模型要做什么 |
| 上下文（long-context-models） | 背景信息或参考资料 |
| 示例（Examples） | 输入-输出对展示期望格式 |
| 输入（Input） | 需要处理的实际内容 |
| 输出格式约束 | 指定输出格式 |

## 核心技术

### 零样本提示（Zero-shot）

直接给出指令，不提供示例。优化技巧：使用明确动词、指定输出长度、定义角色。适用于翻译、摘要等简单任务。

### 少样本提示（Few-shot）

提供2-5个输入-输出示例让模型模仿。示例要多样化、类别均衡，最近的示例影响力最大。适用于分类、信息提取。

### 思维链提示（Chain-of-Thought, CoT）

引导模型展示中间推理步骤，对数学、逻辑、多步推理任务效果显著。

- **手动CoT**：提供推理示例
- **零样本CoT**：添加"Let's think step by step"即可激活推理能力

研究表明CoT在GPT-3级（100B+参数）模型上效果最显著，小模型提升有限。

### 自我一致性（Self-Consistency）

对同一问题多次采样，取多数答案。结合CoT使用，N=8-16时性价比最优。

### 思维树（Tree-of-Thought, ToT）

允许模型在多个推理路径中搜索，评估器判断每条路径的可行性并剪枝。适用于需要探索和回溯的复杂问题。

### 结构化输出

引导模型输出JSON、XML等结构化格式。现代API支持`response_format`参数强制JSON输出。提供JSON Schema或示例输出可提高格式遵从度。

## 系统提示词设计

```
你是一位资深后端工程师，专精于分布式系统。

## 行为准则
- 回答必须基于事实，如不确定请明确说明
- 给出代码建议时必须考虑生产环境安全性

## 输出要求
- 代码使用 Python 3.10+
- 必须包含错误处理和日志记录
```

设计原则：角色定义、行为约束、格式要求、安全边界。

## 应用场景与策略

| 场景 | 推荐策略 | 关键要点 |
|------|---------|---------|
| 文本分类 | Few-shot | 每类2-3个示例，注意平衡 |
| 数学/逻辑推理 | CoT + Self-Consistency | 必须引导逐步推理 |
| 代码生成 | System Prompt + 结构化输出 | 明确语言/框架/风格 |
| 信息提取 | Few-shot + JSON Schema | 提供目标格式示例 |
| rag-systems问答 | Context Injection + 指令 | "仅基于以下内容回答" |
| AI ai-agents | ReAct + Tool Description | 定义工具接口和使用时机 |

## 常见反模式

| 反模式 | 问题 | 改进 |
|--------|------|------|
| "帮我写个好文章" | 过于模糊 | 具体化主题、长度、风格 |
| 一次塞入过多任务 | 模型容易遗漏 | 拆分为多个独立Prompt |
| 负面指令"不要做X" | 模型理解差 | 改为正面指令"请做Y" |
| 无格式约束 | 输出不稳定 | 明确指定输出格式 |

## 进阶话题

### 自动化Prompt优化

- **DSPy**：将Prompt工程转化为可编程优化问题
- **OPRO**：用LLM优化自身的Prompt
- **PromptBench**：Prompt鲁棒性评估

### 安全提示词设计

防御Prompt Injection攻击：输入净化（过滤特殊标记）、输出验证、分层隔离（System Prompt与用户输入分离）、权限最小化。

### 成本优化

Prefix Caching缓存共享的System Prompt前缀；LLMLingua等工具压缩长Prompt；批量处理利用API的batch定价。

## 关联主题

- LLM架构：理解不同模型的能力边界
- 微调技术：Prompt优化不够时的下一步
- 推理模型：CoT/ToT是推理模型的核心策略
## Related

- [[论文精读/Architecture/BERT_Deep_Dive.md]] — BERT 深度解读
- [[论文精读/Scaling/GPT3_Deep_Dive.md]] — GPT-3 深度解读
- [[入门/AI_Practical_Labs.md]] — AI 实践实验室
- [[入门/AI_Tools_Practical_Guide.md]] — AI 工具实战指南
- [[概念/sequence-models.md|sequence-models]]

## See Also (深度专题)

- [[../../大模型/Prompt_Engineering/Prompt_Engineering|提示工程完全指南]] — CoT/Few-shot/ReAct 等策略的系统性方法论
- [[../../大模型/Prompt_Engineering/Context_Engineering_Guide|上下文工程指南]] — 从 Prompt Engineering 到 Context Engineering 的演进
- [[../../大模型/Prompt_Engineering/DSPy_Deep_Dive|DSPy 深度解析]] — 编程化提示 优化框架

---

## 2026 提示工程生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Context Engineering** | 从 Prompt Engineering 演进，关注上下文管理 | GA |
| **DSPy** | 编程化提示优化框架，自动优化提示 | GA |
| **结构化输出** | JSON Schema/Pydantic 约束输出格式 | GA |
| **思维链 (CoT)** | 逐步推理，提升复杂任务表现 | GA |
| **ReAct** | 推理 + 行动交替，支持工具调用 | GA |

## 生产最佳实践

1. **角色设定**：明确模型角色和任务边界，提高输出质量
2. **Few-shot 示例**：提供 2-3 个高质量示例，比零样本效果好 20-30%
3. **输出格式约束**：用 JSON Schema 约束输出，避免格式错误
4. **迭代优化**：用 DSPy 等工具自动优化提示，减少手工调优
5. **版本管理**：提示词纳入版本控制，支持 A/B 测试和回滚
6. **思维链 (CoT)**：复杂推理任务启用 CoT，提升准确率
7. **上下文工程**：从 Prompt Engineering 演进到 Context Engineering

## Prompt 设计检查清单

| 检查项 | 说明 |
|--------|------|
| 角色明确 | 是否清晰定义了模型角色？ |
| 任务具体 | 是否明确说明了任务要求？ |
| 示例充分 | 是否提供了 2-3 个 Few-shot 示例？ |
| 格式约束 | 是否用 JSON Schema 约束输出？ |
| 边界清晰 | 是否说明了什么不该做？ |
| 错误处理 | 是否说明了如何处理异常情况？ |

## 延伸阅读

- [[概念/LLM/context-engineering|上下文工程]]
- [[概念/LLM/promptfoo|Promptfoo 测试]]
- [[概念/Agent/react-agent|ReAct Agent]]
- [[大模型/Prompt_Engineering/Prompt_Engineering_Guide_2026|Prompt 工程指南 2026]]

## Prompt 模板示例

```markdown
# 角色
你是一位专业的 {domain} 专家。

# 任务
请根据以下输入，{task_description}。

# 输入
{input}

# 输出格式
请以 JSON 格式输出：
{{"result": "...", "confidence": 0.95}}

# 示例
输入: {example_input}
输出: {example_output}
```
