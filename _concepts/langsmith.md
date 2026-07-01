---
title: "LangSmith LLM 可观测性平台 (LangSmith by LangChain)"
category: -concepts
tags: ["langsmith", "langchain", "llm-observability", "tracing", "evaluation", "debugging"]
relationships:
  - target: "_concepts/opik"
    type: related_to
  - target: "_concepts/agent-evaluation"
    type: related_to
sources:
  - 12_Architecture_Infrastructure/AI_Stack_Deep_Dive.md
summary: "LangSmith 是 LangChain 官方推出的 LLM 可观测性与评估平台——深度集成 LangChain 生态，提供调用追踪、数据集管理、自动化评估和 Prompt 调试。是 LangChain 用户的标配可观测方案。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: stable
tier: supporting
---

# LangSmith LLM 可观测性平台

> **一句话理解**: LangSmith 是"LangChain 应用的 X 光机"——看到每个 LLM 调用、每次 Tool 执行、每个 Agent 决策的全过程。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **开发商** | LangChain Inc. |
| **类型** | 云服务 (SaaS) |
| **核心价值** | LangChain 生态的追踪 + 评估 + 调试 |
| **定价** | 免费层 + Developer + Enterprise |
| **集成** | LangChain / LangGraph 原生 |

---

## 2. 核心功能

```
┌─────────────────────────────────────────┐
│          LangSmith 功能全景             │
├─────────────────────────────────────────┤
│                                         │
│  1. Tracing（追踪）                     │
│     ├── LLM 调用追踪                   │
│     ├── Chain 执行链路                 │
│     ├── Agent 工具调用                  │
│     ├── LangGraph 状态图               │
│     └── 嵌套 Run 树形展示              │
│                                         │
│  2. Evaluation（评估）                  │
│     ├── 内置评估器 (准确性/相关性)      │
│     ├── LLM-as-Judge                   │
│     ├── 代码评估器                      │
│     ├── 数据集管理                      │
│     └── 批量评估实验                    │
│                                         │
│  3. Playground（调试）                  │
│     ├── Prompt 在线编辑 + 测试          │
│     ├── 多模型 A/B 对比                │
│     └── 版本管理                        │
│                                         │
│  4. Monitoring（监控）                  │
│     ├── 延迟/成本/Token 统计           │
│     ├── 异常检测                        │
│     └── 用户反馈分析                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. 使用方法

### 3.1 一行开启追踪

```python
import os
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = "lsv2_..."
os.environ["LANGSMITH_PROJECT"] = "my-rag-app"

# 之后所有 LangChain 调用自动追踪
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

chain = RetrievalQA.from_chain_type(llm, retriever=retriever)
chain.invoke("什么是 vLLM？")  # 自动记录到 LangSmith
```

### 3.2 评估实验

```python
from langsmith import Client
from langsmith.evaluation import evaluate

client = Client()

# 创建数据集
dataset = client.create_dataset("rag-eval-v1")
client.create_examples(
    inputs=[{"question": "vLLM 是什么？"}],
    outputs=[{"answer": "高性能 LLM 推理引擎"}],
    dataset_id=dataset.id,
)

# 运行评估
results = evaluate(
    my_rag_app,
    data="rag-eval-v1",
    evaluators=[correctness_evaluator, relevance_evaluator],
    experiment_prefix="v2-gpt4",
)
```

---

## 4. LangGraph 可视化

```
LangSmith 对 LangGraph Agent 的追踪:

  ┌─ User Input
  │
  ├─ Agent 节点
  │   ├── LLM 调用 (thinking...)
  │   ├── Tool: search_web("vLLM 推理")
  │   └── Tool 结果
  │
  ├─ Agent 节点 (第二轮)
  │   ├── LLM 调用 (final answer)
  │   └── 输出结果
  │
  └─ 总耗时: 2.3s | Token: 1,240 | Cost: $0.03
```

---

## 5. 与其他平台对比

| 特性 | LangSmith | Opik | Helicone | Arize |
|------|-----------|------|----------|-------|
| **LangChain 集成** | ★★★★★ 原生 | ★★★★☆ | ★★★☆☆ | ★★★☆☆ |
| **开源** | ❌ SaaS | ✅ | ❌ | ✅ |
| **自托管** | ❌ | ✅ | ❌ | ✅ |
| **LangGraph 支持** | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | ★★☆☆☆ |
| **评估功能** | ★★★★★ | ★★★★☆ | ❌ | ★★★☆☆ |
| **Playground** | ✅ | ❌ | ❌ | ❌ |
| **价格** | 付费 (有免费层) | 免费 (自托管) | 付费 | 免费 (自托管) |

---

## 6. AI Stack 中的定位

```
┌─────────────────────────────────────────┐
│    LLM 可观测性选型指南                │
├─────────────────────────────────────────┤
│                                         │
│  LangChain 用户 → LangSmith ★          │
│  开源自托管   → Opik                    │
│  轻量 API 监控 → Helicone              │
│  ML 全栈       → Arize Phoenix          │
│  生产级追踪   → LangSmith / Opik        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 7. 关键要点

1. **LangChain 原生**：与 LangChain/LangGraph 深度集成，零配置追踪
2. **闭源 SaaS**：不开源，数据存储在 LangChain 云端（合规注意）
3. **评估强**：内置评估器 + LLM-as-Judge + 自定义评估器
4. **Playground 独特**：在线调试 Prompt，A/B 对比不同模型
5. **LangGraph 可视化**：Agent 状态图的每个节点都可追踪
6. **付费但值得**：免费层够个人用，企业级需要 Developer/Enterprise 方案
