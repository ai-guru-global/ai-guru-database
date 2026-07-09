---
title: "SGLang"
category: -concepts
tags: ["sglang", "inference", "serving", "vllm", "radix-attention", "prefix-caching"]
relationships:
  - target: "_concepts/model-serving"
    type: belongs_to
  - target: "_concepts/vllm"
    type: related_to
  - target: "_concepts/radix-attention"
    type: uses
  - target: "_concepts/continuous-batching"
    type: synergizes_with
sources:
  - 部署推理/Inference_Engines/SGLang_Deep_Dive.md
  - 部署推理/Inference_Engines/LLM_Inference_Engine_Selection_Guide.md
  - 架构基建/AI_Stack_Inference_Serving_Guide.md
summary: "SGLang 是一个高性能大模型推理框架，由 UC Berkeley 开发。它通过 RadixAttention（基数树前缀缓存）和结构化生成语言（SGLang）来压榨 GPU 吞吐，特别适合多轮对话、复杂 Agent 工作流等需要反复命中相同前缀的场景。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Sglang

---
# SGLang

## 核心要点

- **SGLang 是高性能 LLM 推理引擎**，由 LMSYS / UC Berkeley 团队开发。
- **杀手锏是 RadixAttention**：自动把不同请求中相同的前缀缓存成树状结构，多轮对话和 Agent 调用时命中率极高。
- **另一特色是 SGLang 编程语言**：用 Python 风格的 DSL 描述多轮、分支、并行的生成流程，方便写复杂提示逻辑。
- **性能定位**：吞吐量通常高于 vLLM，尤其在多轮对话、多采样、结构化输出场景。

## 一句话理解

SGLang 就像一家‘会记笔记的餐厅’：不同客人点的菜如果开头步骤一样，厨师不用重复备菜，直接从缓存里拿，出餐速度飞快。

## 详细内容

### 为什么比 vLLM 还快？

vLLM 用 PagedAttention 管理 KV Cache，已经很高效。SGLang 在此基础上加了 **RadixAttention**：

```
请求 A: "请总结这篇文章：{article}" → 前缀缓存
请求 B: "请总结这篇文章：{article}，并用三句话" → 直接命中前缀
请求 C: "请翻译这篇文章：{article}" → 前缀部分也命中
```

相同前缀的 KV Cache 被组织成一棵 Radix Tree，新请求来时自动匹配最长公共前缀。

### SGLang 编程语言

除了推理引擎，SGLang 还提供一种结构化生成 DSL：

```python
from sglang import function, gen, select

@function
def qa(s, question):
    s += f"Q: {question}\nA:"
    s += gen("answer", max_tokens=256)
    return s["answer"]
```

这让你可以像写程序一样控制多步生成、分支、并行调用，比手写字符串拼接更优雅。

### 适合场景

| 场景 | 为什么适合 |
|------|------------|
| 多轮对话 | 历史记录天然形成可复用前缀 |
| Agent 工作流 | 多次调用中系统提示、工具描述重复 |
| 多采样/self-consistency | 同一段提示采样多次，前缀共享 |
| 结构化输出 | 用 DSL 约束 JSON/函数调用格式 |

### SGLang vs vLLM

| 维度 | vLLM | SGLang |
|------|------|--------|
| 核心优化 | PagedAttention | RadixAttention + 结构化 DSL |
| 多轮对话吞吐 | 高 | 更高 |
| 生态成熟度 | 更成熟 | 快速追赶 |
| 易用性 | 标准 OpenAI API | API + DSL |
| 生产部署 | 广泛验证 | 逐步落地 |

## 开放问题

- SGLang 的 RadixAttention 在超长前缀下的内存管理策略。
- 与多 LoRA、多模态、speculative decoding 的结合。
- 在云原生/K8s 环境中的成熟度。

## Related

- [[_concepts/model-serving]] — 模型服务
- [[_concepts/continuous-batching]] — Continuous Batching
- [[_concepts/radix-attention]] — RadixAttention
- [[_concepts/paged-attention]] — PagedAttention
- [[部署推理/Inference_Engines/SGLang_Deep_Dive]] — SGLang 深度解析
- [[部署推理/Inference_Engines/LLM_Inference_Engine_Selection_Guide]] — LLM 推理引擎选型指南
