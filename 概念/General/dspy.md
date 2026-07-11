---
title: "DSPy (Stanford LLM 编程框架)"
category: -concepts
tags: ["llm-programming", "prompt-optimization", "pipeline", "stanford", "nlp"]
relationships:
  - target: "概念/langchain"
    type: related_to
  - target: "概念/llamaindex"
    type: related_to
  - target: "概念/humanloop"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "Stanford NLP 开发的 LLM 编程框架，用声明式 Module 替代手写 Prompt，通过编译器自动优化 Prompt 和 Pipeline，是 Prompt Engineering 的范式革新。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
tier: core
---

# DSPy

[DSPy](https://github.com/stanfordnlp/dspy)（**D**eclarative **S**elf-improving **Py**thon）是 Stanford NLP 开发的 **LLM 编程框架**，它彻底颠覆了传统的 Prompt Engineering 范式。核心理念：**不要写 Prompt，而是写程序**——通过声明式的 Module 和 Signature 定义 LLM 的输入输出规范，DSPy 的编译器自动优化 Prompt 和 Few-shot 示例，让 LLM 达到最佳性能。

## 核心问题

```
传统 Prompt Engineering:
- 手写 Prompt → 反复试错 → 换模型后重来
- 不同 LLM 需要不同的 Prompt
- 多步 Pipeline 的 Prompt 调优是 NP-Hard

DSPy 方案:
- 声明式定义 → 编译器自动优化
- 换模型只需重新编译
- Pipeline 优化自动化
```

## 核心概念

### Signature (签名)

```python
import dspy

# 定义输入输出规范（不写 Prompt）
class SentimentClassifier(dspy.Signature):
    """Classify the sentiment of a sentence."""
    sentence = dspy.InputField()
    sentiment = dspy.OutputField(desc="positive, negative, or neutral")

# DSPy 自动根据 Signature 生成最优 Prompt
classifier = dspy.Predict(SentimentClassifier)
result = classifier(sentence="This movie was great!")
# sentiment → "positive"
```

### Module (模块)

```python
class RAG(dspy.Module):
    def __init__(self, num_passages=3):
        self.retrieve = dspy.Retrieve(k=num_passages)
        self.generate = dspy.ChainOfThought("context, question -> answer")
    
    def forward(self, question):
        context = self.retrieve(question).passages
        answer = self.generate(context=context, question=question)
        return answer

rag = RAG()
result = rag("What is DSPy?")
```

### 编译器 (Optimizer)

```python
# 定义训练数据和评估指标
trainset = [
    dspy.Example(question="...", answer="...").with_inputs("question"),
    ...
]

def validate(example, pred):
    return pred.answer.lower() == example.answer.lower()

# 编译：自动优化 Prompt
optimizer = dspy.BootstrapFewShot(metric=validate, num_threads=4)
compiled_rag = optimizer.compile(rag, trainset=trainset)

# 编译后的 RAG 自动包含最优 Few-shot 示例
compiled_rag("What is machine learning?")
```

### 可用 Optimizer

| Optimizer | 原理 | 适用场景 |
|-----------|------|----------|
| **BootstrapFewShot** | 自动选择 Few-shot 示例 | 通用 |
| **MIPRO** | 多轮迭代 Prompt 优化 | 高准确率要求 |
| **BootstrapFinetune** | 生成微调数据 | 需要微调模型 |
| **COPRO** | 指令优化 | 指令敏感任务 |

## 典型应用场景

- **RAG 优化**: 自动优化检索和生成步骤的 Prompt
- **Agent Pipeline**: 多步 Agent 工作流的自动优化
- **评估**: 用声明式指标评估 LLM 系统
- **研究**: 快速实验不同的 LLM Pipeline 架构

## 安装

```bash
pip install dspy-ai
```

## 参考资源

- [DSPy GitHub](https://github.com/stanfordnlp/dspy)
- [DSPy 论文 (arXiv)](https://arxiv.org/abs/2310.03714)
- [Stanford NLP](https://nlp.stanford.edu/)

## 相关概念

- [[概念/langchain]] — LangChain LLM 应用框架
- [[概念/llamaindex]] — LlamaIndex RAG 框架
- [[概念/humanloop]] — Humanloop Prompt 工程与评估
