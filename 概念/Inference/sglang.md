---
title: "SGLang"
category: -concepts
tags: ["sglang", "inference", "serving", "vllm", "radix-attention", "prefix-caching", "structured-output", "agent"]
relationships:
  - target: "概念/Inference/model-serving"
    type: belongs_to
  - target: "概念/Inference/vllm"
    type: related_to
  - target: "概念/Inference/radix-attention"
    type: uses
  - target: "概念/Inference/continuous-batching"
    type: synergizes_with
  - target: "概念/Inference/flashinfer"
    type: uses
  - target: "概念/Inference/prefix-caching"
    type: implements
sources:
  - 10_部署推理/02_Inference_Engines/SGLang_Deep_Dive.md
  - 10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide.md
  - 12_架构基建/AI_Stack_Inference_Serving_Guide.md
  - "https://arxiv.org/abs/2312.07104"
summary: "SGLang 是由 LMSYS/UC Berkeley 开发的高性能 LLM 推理框架。通过 RadixAttention（基数树前缀缓存）、零开销调度、压缩有限状态机结构化生成三大核心技术，在多轮对话、Agent 工作流、结构化输出场景下吞吐量领先 vLLM 1.2-2×。2026 年已成为 Agent 系统和结构化生成的首选引擎。"
provenance:
  extracted: 0.85
  inferred: 0.10
  ambiguous: 0.05
base_confidence: 0.88
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Sglang
  - "SGLang Runtime"
  - "SGLang 推理引擎"

---
# SGLang

> SGLang = **S**tructured **G**eneration **Lang**uage —— 一家"会记笔记的餐厅"：相同前缀不重复计算，结构化输出零额外开销。

## 核心要点

- **RadixAttention**：用 Radix Tree 自动缓存和复用不同请求的公共前缀 KV Cache，多轮对话/Agent 命中率 70-90%
- **零开销调度**：调度器与 GPU 计算完全重叠，调度延迟 < 1μs，不占用推理时间
- **压缩有限状态机 (Compressed FSM)**：结构化输出（JSON/正则/EBNF）约束生成，无额外延迟
- **2026 定位**：Agent 系统、多轮对话、结构化生成场景的首选引擎

## 三大核心技术

### 1. RadixAttention（基数树前缀缓存）

```
Radix Tree 结构:
root
├── "System: You are..." (10K tokens) → KV Cache 节点 A
│   ├── "Document: {article}" (50K tokens) → KV Cache 节点 B
│   │   ├── "Q: 总结" → 请求 1
│   │   └── "Q: 翻译" → 请求 2  ← 命中 A+B，仅计算增量
│   └── "Tools: [search, calc]" → KV Cache 节点 C
│       └── "User: 查询天气" → 请求 3  ← 命中 A+C
└── 其他前缀...
```

- 新请求自动匹配最长公共前缀，命中率在多轮场景达 70-90%
- 相比 vLLM 的哈希精确匹配，Radix Tree 支持任意共享前缀

### 2. 零开销批调度

| 特性 | 传统调度 | SGLang 零开销调度 |
|------|---------|------------------|
| 调度时机 | GPU 空闲时 | 与 GPU 计算重叠 |
| 调度延迟 | 100-500μs | < 1μs |
| 对吞吐影响 | 5-15% 损失 | 几乎为零 |
| 实现方式 | 串行 | 异步 CPU-GPU 流水线 |

### 3. 压缩 FSM 结构化生成

```python
import sglang as sgl

# JSON Schema 约束生成
@sgl.function
def extract_info(s, text):
    s += sgl.system("从文本中提取结构化信息")
    s += sgl.user(text)
    s += sgl.assistant(sgl.gen(
        "result",
        max_tokens=512,
        regex=r'\{"name": "[^"]+", "age": \d+, "city": "[^"]+"\}'
    ))
```

- 将正则/JSON Schema 编译为压缩 FSM，每步仅允许合法 token
- 相比 Outlines/guidance 等方案，无额外解码延迟

## 性能基准 (2026)

| 场景 | vLLM (tok/s) | SGLang (tok/s) | 提升 |
|------|:-----------:|:-------------:|:----:|
| 单轮短对话 | 3200 | 3400 | +6% |
| 多轮对话 (5轮) | 2800 | 4200 | **+50%** |
| Agent 工具调用 | 2500 | 4500 | **+80%** |
| 结构化 JSON 输出 | 2600 | 3800 | **+46%** |
| 多采样 (n=8) | 3000 | 5200 | **+73%** |

> 测试条件: Qwen2.5-72B, 4×A100-80G, TP=4, 并发 64

## 部署配置示例

```bash
# 启动 SGLang 服务
python -m sglang.launch_server \
    --model-path Qwen/Qwen2.5-72B-Instruct \
    --tp 4 \
    --mem-fraction-static 0.88 \
    --enable-radix-cache \
    --schedule-conservativeness 0.8 \
    --port 30000

# OpenAI 兼容 API 调用
curl http://localhost:30000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "Qwen2.5-72B-Instruct", "messages": [{"role": "user", "content": "Hello"}]}'
```

## 适用场景决策

| 场景 | 为什么选 SGLang | 命中率/收益 |
|------|----------------|------------|
| Agent 工作流 | 系统提示+工具描述反复命中 | 70-85% |
| 多轮对话 | 历史消息天然形成前缀 | 60-80% |
| 多采样/Self-consistency | 同一 prompt 采样 N 次 | 90%+ |
| 结构化输出 | FSM 零开销约束 | 无额外延迟 |
| Tree-of-Thought | 分支探索共享父节点 | 50-70% |

## SGLang vs vLLM (2026)

| 维度 | vLLM | SGLang |
|------|------|--------|
| 核心优化 | PagedAttention + APC | RadixAttention + 零开销调度 |
| 前缀缓存 | 哈希精确匹配 | Radix Tree 任意前缀 |
| 结构化输出 | 依赖 Outlines | 原生 FSM |
| 多轮对话吞吐 | 高 | **更高 (+50%)** |
| 生态成熟度 | 最成熟 | 快速追赶 |
| 生产验证 | 广泛 | 逐步落地 |
| 底层算子 | 自研 CUDA | FlashInfer |
| MoE 支持 | ✅ | ✅ |

## 2026 生态进展

| 版本/特性 | 状态 | 说明 |
|-----------|------|------|
| SGLang v0.4+ | ✅ 稳定 | RadixAttention + 零开销调度 |
| FlashInfer 集成 | ✅ 默认 | MLSys 2025 Best Paper 算子库 |
| 多模态 (VLM) | ✅ 支持 | InternVL、Qwen-VL 等 |
| Speculative Decoding | ✅ 支持 | EAGLE-2 集成 |
| Multi-LoRA | ✅ 支持 | 动态适配器切换 |
| K8s 部署 | ✅ Helm Chart | 云原生就绪 |
| DP Attention | ✅ 实验 | 数据并行注意力 |

## 生产最佳实践

1. **保持前缀稳定**：System Prompt 和 Tool 描述放在最前面且顺序不变，最大化 Radix Tree 命中
2. **合理设置 mem-fraction-static**：默认 0.88，高并发可降至 0.82 留出调度余量
3. **启用 Chunked Prefill**：长 prompt (>4K tokens) 场景启用，避免 prefill 阻塞 decode
4. **结构化输出用原生 FSM**：避免外部 JSON 校验重试，直接在 gen() 中指定 regex/schema
5. **监控 cache hit rate**：通过 `/get_server_info` 端点监控命中率，低于 40% 需检查前缀设计
6. **Agent 场景配合 DP**：高并发 Agent 系统使用 `--dp 2 --tp 2` 平衡吞吐和延迟

## 开放问题

- 超长上下文 (>1M tokens) 下 Radix Tree 的内存碎片管理
- 与 Speculative Decoding 结合时前缀缓存的一致性保证
- 多租户隔离：不同租户的前缀缓存是否应隔离

## Related

- [[概念/Inference/model-serving]] — 模型服务
- [[概念/Inference/continuous-batching]] — Continuous Batching
- [[概念/Inference/radix-attention]] — RadixAttention
- [[概念/Inference/paged-attention]] — PagedAttention
- [[概念/Inference/flashinfer]] — FlashInfer 算子库
- [[概念/Inference/prefix-caching]] — 前缀缓存
- [[10_部署推理/02_Inference_Engines/SGLang_Deep_Dive]] — SGLang 深度解析
- [[10_部署推理/02_Inference_Engines/LLM_Inference_Engine_Selection_Guide]] — LLM 推理引擎选型指南

## SGLang vs vLLM 对比

| 维度 | SGLang | vLLM |
|------|--------|------|
| **核心创新** | RadixAttention | PagedAttention |
| **前缀缓存** | Token 级 Radix Tree | Block 级 Hash |
| **结构化生成** | 原生支持 (最强) | 支持 |
| **多模态** | 支持 | 支持 |
| **硬件** | NVIDIA | NVIDIA/AMD/TPU |
| **社区** | LMSYS | UC Berkeley |
| **适用场景** | 结构化输出/Agent | 通用服务 |

## SGLang 部署示例

```bash
# 启动 SGLang 服务
python -m sglang.launch_server \
  --model-path Qwen/Qwen3-8B \
  --port 8000 \
  --tp 1 \
  --mem-fraction-static 0.85

# 结构化生成 (JSON Schema)
import sglang as sgl

@sgl.function
def structured_gen(s, question):
    s += sgl.system("You are a helpful assistant.")
    s += sgl.user(question)
    s += sgl.assistant(sgl.gen("answer", max_tokens=256))
```

## 生产最佳实践

1. **结构化输出选 SGLang**：JSON/正则约束生成性能最优
2. **前缀缓存利用**：保持 System Prompt 不变，最大化 Radix Tree 命中
3. **与 vLLM 对比测试**：生产前用目标场景对比两个引擎
4. **FlashInfer 必装**：SGLang 依赖 FlashInfer 算子库
5. **监控缓存命中率**：prefix cache hit rate 低于 30% 需调整
