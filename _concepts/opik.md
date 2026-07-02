---
title: "Opik LLM 可观测性平台 (Opik by Comet)"
category: -concepts
tags: ["opik", "comet", "llm-observability", "tracing", "evaluation", "monitoring"]
relationships:
  - target: "_concepts/observability"
    type: related_to
  - target: "_concepts/agent-evaluation"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "Opik 是 Comet 开源的 LLM 可观测性平台——提供 LLM 调用追踪、Agent 调试、自动评估、成本监控等功能。支持 LangChain/LlamaIndex/OpenAI 等主流框架，是 LLM 应用生产化的关键基础设施。"
provenance:
  extracted: 0.15
  inferred: 0.75
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: reviewed
tier: supporting
---

# Opik LLM 可观测性平台

> **一句话理解**: Opik 是"LLM 应用的黑匣子记录仪"——追踪每一次 LLM 调用、每一个 Agent 决策，帮你理解、调试、优化 AI 应用。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **开发商** | Comet（ML 实验追踪公司） |
| **开源协议** | Apache 2.0 |
| **GitHub** | 8K+ ⭐ |
| **语言** | Python + Java (后端) |
| **核心能力** | LLM 追踪 + 评估 + 监控 |
| **部署** | 自托管 / Comet Cloud |

---

## 2. 核心功能

```
┌─────────────────────────────────────────┐
│          Opik 功能全景                   │
├─────────────────────────────────────────┤
│                                         │
│  1. Tracing（追踪）                     │
│     ├── LLM 调用追踪（输入/输出/延迟）  │
│     ├── Agent 工具调用链                │
│     ├── RAG 检索链路                    │
│     └── 嵌套 Span 可视化               │
│                                         │
│  2. Evaluation（评估）                  │
│     ├── 内置评估指标                    │
│     ├── LLM-as-Judge                   │
│     ├── 数据集管理                      │
│     └── 自动化评估实验                  │
│                                         │
│  3. Monitoring（监控）                  │
│     ├── 成本追踪                        │
│     ├── 延迟统计                        │
│     ├── Token 用量                      │
│     └── 异常检测                        │
│                                         │
└─────────────────────────────────────────┘
```

### 2.1 Tracing 追踪

```python
import opik

# 方式1: 装饰器追踪
@opik.track
def my_rag_pipeline(query: str) -> str:
    docs = retrieve_documents(query)
    response = generate_answer(query, docs)
    return response

# 方式2: 上下文管理器
with opik.track_session(project="my-rag-app"):
    result = my_rag_pipeline("什么是 vLLM？")

# 方式3: 自动集成（LangChain / LlamaIndex）
opik.configure(use_local=True)  # 本地部署
# LangChain 回调自动记录所有 LLM 调用
```

### 2.2 评估框架

```python
from opik.evaluation import evaluate
from opik.evaluation.metrics import Hallucination, AnswerRelevance

# 定义评估数据集
dataset = opik.create_dataset(
    name="rag-eval",
    items=[
        {"input": "vLLM 是什么？", "expected_output": "高性能推理引擎"},
        {"input": "MoE 含义？", "expected_output": "混合专家模型"},
    ]
)

# 运行评估
evaluation = evaluate(
    dataset=dataset,
    task=my_rag_task,
    metrics=[Hallucination(), AnswerRelevance()],
    project_name="my-rag-app"
)
```

---

## 3. 集成生态

| 集成框架 | 集成方式 | 追踪内容 |
|---------|---------|---------|
| **OpenAI** | `opik.track_openai()` | 调用、Token、延迟 |
| **LangChain** | Callback Handler | Chain、Agent、Tool 全链路 |
| **LlamaIndex** | Callback Handler | 索引、查询、检索 |
| **Haystack** | Component 集成 | Pipeline 执行 |
| **Litellm** | 代理层 | 多模型调用 |

---

## 4. 与其他可观测性工具对比

| 特性 | Opik | LangSmith | Helicone | Arize Phoenix |
|------|------|-----------|----------|---------------|
| **开源** | ✅ Apache 2.0 | ❌ | ❌ | ✅ |
| **自托管** | ✅ | ❌ | ❌ | ✅ |
| **追踪** | ✅ | ✅ | ✅ | ✅ |
| **评估** | ✅ 内置 | ✅ 强 | ❌ | 有限 |
| **Agent 支持** | ✅ | ✅ | 有限 | ✅ |
| **成本** | 免费 (自托管) | 付费 | 付费 | 免费 (自托管) |
| **数据存储** | 自控 | Comet 云 | Helicone 云 | 自控 |

---

## 5. AI Stack 中的定位

```
┌─────────────────────────────────────────┐
│      LLM 可观测性工具分层               │
├─────────────────────────────────────────┤
│                                         │
│  Opik        ← 开源自托管首选           │
│  LangSmith   ← LangChain 生态标配       │
│  Helicone    ← API 代理层轻量监控       │
│  Arize       ← ML 全栈可观测性          │
│  Weights & Biases ← 实验追踪 + LLM      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. 部署

```bash
# Docker Compose 自托管
docker compose up -d  # Opik UI + ClickHouse + MySQL

# Python SDK
pip install opik

# 配置连接
opik configure --use-local
```

---

## 7. 关键要点

1. **开源自托管**：数据完全在企业内部，满足合规要求
2. **追踪粒度细**：支持嵌套 Span，完整还原 Agent 决策链和 RAG 检索路径
3. **评估一体化**：追踪 + 评估在同一平台，可直接用追踪数据做评估
4. **框架无关**：不绑定特定 LLM 框架，通过 SDK 和回调集成
5. **Comet 背书**：Comet 在 ML 可观测性领域有多年积累
6. **生产必备**：LLM 应用上线后的"眼睛"，没有可观测性等于盲飞
