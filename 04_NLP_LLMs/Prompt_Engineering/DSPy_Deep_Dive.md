# DSPy: 可编程的 Prompt 优化框架

> **一句话理解**: DSPy 是斯坦福的可编程 Prompt 优化框架——用 Python 代码而非字符串定义 Prompt、自动优化模块组合、学会提示而非手工撰写。

---

## 目录

1. [概述](#1-概述)
2. [核心概念](#2-核心概念)
3. [架构设计](#3-架构设计)
4. [快速开始](#4-快速开始)
5. [高级用法](#5-高级用法)
6. [对比与选择](#6-对比与选择)

---

## 1. 概述

### 1.1 定位

```
DSPy: 可编程 Prompt 优化框架
═══════════════════════════════════════════════════════════════════

定位: 斯坦福大学开源的 Prompt 编程框架，用代码而非字符串来管理提示

核心理念:
───────────────────────────────────────────────────────────────────
• 编程而非字符串: 用 Python 定义提示
• 自动优化: 自动学习最佳提示组合
• 模块化: 声明式组合 LLM 模块
• 可学习: 端到端优化提示参数
• 框架无关: 支持任意 LLM
• 复用性: 模块可复用和组合
```

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| **签名 (Signature)** | 声明式输入/输出规范 |
| **模块 (Module)** | 可组合的 LLM 单元 |
| **优化器 (Optimizer)** | 自动提示调优 |
| ** teleporter** | 上下文压缩 |
| **评估器 (Evaluator)** | 自动质量评估 |
| **多模型** | OpenAI/Claude/本地 |

### 1.3 解决的问题

| 问题 | DSPy 方案 |
|------|----------|
| Prompt 维护困难 | 模块化 + 签名 |
| 手工调优耗时 | 自动优化 |
| 跨模型迁移 | 框架无关 |
| 少样本效果差 | 自动化示例选择 |

---

## 2. 核心概念

### 2.1 签名 (Signature)

```
DSPy Signature
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        Signature 定义                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  # 方式1: 字符串格式                                             │
│  signature = "question -> answer"                                 │
│                                                                   │
│  # 方式2: 类格式                                                │
│  class GenerateAnswer(dspy.Signature):                            │
│      """回答问题"""                                               │
│      question = dspy.InputField()                                 │
│      answer = dspy.OutputField()                                 │
│                                                                   │
│  Signature 的作用:                                               │
│  • 定义输入/输出                                                │
│  • 自动生成提示模板                                              │
│  • 提供字段描述                                                  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 模块 (Module)

```
DSPy 模块
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        DSPy 模块                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  dspy.ChainOfThought:                                            │
│  • 链式思考推理                                                │
│  • 自动添加 "Let's think step by step"                           │
│                                                                   │
│  dspy.Prediction:                                               │
│  • 基础预测模块                                                │
│  • 执行签名定义的任务                                           │
│                                                                   │
│  dspy.MultiChainComparison:                                       │
│  • 多条推理结果比较                                            │
│  • 选择最佳答案                                                │
│                                                                   │
│  dspy.Retrieve:                                                 │
│  • 检索模块                                                    │
│  • 集成 RAG                                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. 架构设计

### 3.1 系统架构

```
DSPy 架构
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                        DSPy 架构                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Python Program                               │   │
│   │  • Signature (输入/输出定义)                           │   │
│   │  • Module (LLM 模块组合)                              │   │
│   │  • Program (整体程序)                                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Optimizer (优化器)                           │   │
│   │  • Bootstrap Few-shot                                 │   │
│   │  • MIPRO (Bayesian 优化)                              │   │
│   │  • COPRO (Coordinate 优化)                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              LLM Backend                                 │   │
│   │  • OpenAI                                             │   │
│   │  • Anthropic                                          │   │
│   │  • Local models (Ollama)                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 优化流程

```
DSPy 优化流程
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        优化流程                                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. 定义任务                                                     │
│  ───────────────────────────────────────────────────────────   │
│  class RAG(dspy.Module):                                       │
│      def __init__(self):                                        │
│          self.retrieve = dspy.Retrieve(k=3)                   │
│          self.generate = dspy.ChainOfThought(GenerateAnswer)   │
│                                                                   │
│      def forward(self, question):                                │
│          context = self.retrieve(question).passages             │
│          return self.generate(context=context, question=question)│
│                                                                   │
│  2. 定义优化目标                                                │
│  ───────────────────────────────────────────────────────────   │
│  optimizer = dspy.MIPRO(metric=dspy.evaluate.answer_exact_match)│
│                                                                   │
│  3. 运行优化                                                    │
│  ───────────────────────────────────────────────────────────   │
│  optimized = optimizer.compile(RAG(), trainset=trainset)          │
│                                                                   │
│  4. 使用优化后的程序                                            │
│  ───────────────────────────────────────────────────────────   │
│  result = optimized(question="什么是 DSPy?")                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. 快速开始

### 4.1 安装

```bash
pip install dspy-ai
```

### 4.2 基础使用

```python
import dspy

# 配置 LLM
dspy.settings.configure(lm=dspy.OpenAI(model='gpt-4o'))

# 定义签名
class QASignature(dspy.Signature):
    """回答问题"""
    question = dspy.InputField()
    answer = dspy.OutputField()

# 使用模块
qa = dspy.Prediction(QASignature)

# 运行
result = qa(question="1+1等于几?")
print(result.answer)  # "2"
```

### 4.3 ChainOfThought

```python
import dspy

dspy.settings.configure(lm=dspy.OpenAI(model='gpt-4o'))

# 定义签名
class MathReasoning(dspy.Signature):
    """数学推理"""
    problem = dspy.InputField()
    reasoning = dspy.OutputField()  # 中间推理过程
    answer = dspy.OutputField()

# 使用 CoT 模块
cot = dspy.ChainOfThought(MathReasoning)

# 运行
result = cot(problem="小明有5个苹果，小红给了他3个，小明现在有多少个?")
print(result.reasoning)  # "小明原来有5个..."
print(result.answer)  # "8个"
```

### 4.4 RAG 示例

```python
import dspy

dspy.settings.configure(lm=dspy.OpenAI(model='gpt-4o'))

# 定义签名
class RAGSignature(dspy.Signature):
    """基于上下文回答问题"""
    context = dspy.InputField(desc="相关上下文")
    question = dspy.InputField()
    answer = dspy.OutputField()

# 定义 RAG 程序
class RAGProgram(dspy.Module):
    def __init__(self):
        # 使用 BM25 或向量检索
        self.retrieve = dspy.Retrieve(k=3)
        self.generate = dspy.ChainOfThought(RAGSignature)

    def forward(self, question):
        # 检索相关上下文
        context = self.retrieve(question).passages

        # 生成答案
        prediction = self.generate(context=context, question=question)
        return prediction

# 使用
rag = RAGProgram()
result = rag(question="DSPy 是什么?")
print(result.answer)
```

---

## 5. 高级用法

### 5.1 自定义优化器

```python
import dspy

# 定义优化器
optimizer = dspy.MIPRO(
    metric=lambda pred, example: pred.answer == example.answer,
    num_threads=4
)

# 编译程序
compiled_rag = optimizer.compile(
    RAGProgram(),
    trainset=train_examples,
    max_iters=50
)
```

### 5.2 多模块组合

```python
class FullQASystem(dspy.Module):
    def __init__(self):
        # 检索 -> 重写问题 -> 生成 -> 验证
        self.retrieve = dspy.Retrieve(k=5)
        self.rewrite = dspy.ChainOfThought(QuestionRewrite)
        self.generate = dspy.MultiChainComparison(GenerateAnswer)
        self.verify = dspy.ChainOfThought(AnswerVerification)

    def forward(self, question):
        # 检索
        passages = self.retrieve(question).passages

        # 重写问题
        rewritten = self.rewrite(question=question).rewritten_question

        # 多路径生成
        multi_result = self.generate(context=passages, question=rewritten)

        # 验证
        verified = self.verify(
            context=passages,
            question=rewritten,
            answer=multi_result.answer
        )

        return verified
```

### 5.3 Teleporter (上下文压缩)

```python
class CompressedRAG(dspy.Module):
    def __init__(self):
        self.compress = dspy.Teleporter(...)
        self.generate = dspy.ChainOfThought(GenerateAnswer)

    def forward(self, question):
        # 检索大量上下文
        raw_context = self.retrieve(question).passages

        # 压缩上下文
        compressed = self.compress(context=raw_context, question=question)

        # 生成
        return self.generate(context=compressed, question=question)
```

---

## 6. 对比与选择

### 6.1 Prompt 框架对比

| 维度 | DSPy | LangChain Prompt | Guidance |
|------|------|------------------|-----------|
| **编程模型** | 声明式 | 字符串模板 | 模板语法 |
| **自动优化** | ⭐⭐⭐⭐⭐ | ❌ | ❌ |
| **学习能力** | ⭐⭐⭐⭐⭐ | ❌ | ❌ |
| **复杂度** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **框架依赖** | 独立 | LangChain | 独立 |

### 6.2 选型建议

| 场景 | 推荐 |
|------|------|
| Prompt 自动优化 | DSPy |
| 快速原型 | LangChain |
| 精确格式控制 | Guidance |
| 复杂工作流 | LangChain + DSPy |

---

## 参考资源

- [DSPy GitHub](https://github.com/stanfordnlp/dspy)
- [DSPy 文档](https://dspy.ai/)
- [DSPy 论文](https://arxiv.org/abs/2310.03714)

---

*Last updated: 2026-04-26*
*Version: 1.0.0*
