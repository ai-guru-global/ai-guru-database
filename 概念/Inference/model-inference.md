---
title: 模型推理原理 (Model Inference)
category: -concepts
tags: [inference, autoregressive, transformer, next-token-prediction, decoding]
relationships:
  - target: "概念/model-deployment"
    type: informs
  - target: "概念/model-serving"
    type: implemented_by
  - target: "概念/kv-cache"
    type: optimized_by
  - target: "概念/speculative-decoding"
    type: accelerated_by
  - target: "概念/model-compression"
    type: optimized_by
sources:
  - 部署推理/README.md
  - 大模型/LLM_Fundamentals.md
  - 大模型/Transformer_Architecture.md
summary: 模型推理的本质是自回归的"条件概率计算"——给定前文，预测下一个 token。整个过程分三步：token 编码（embedding）、前向传播（数十层 Transformer 的矩阵运算）、概率采样输出。GPU 擅长密集矩阵乘法，因此推理速度快。2026 年核心优化手段包括 KV Cache、量化、连续批处理、投机解码和 PagedAttention。
provenance:
  extracted: 0.9
  inferred: 0.08
  ambiguous: 0.02
base_confidence: 0.85
lifecycle: draft
lifecycle_changed: 2026-06-15
tier: core
created: 2026-06-15 00:00:00+00:00
updated: 2026-07-21
aliases:
  - "Model Inference"
  - "model inference"

---
# 模型推理原理 (Model Inference)

## 核心要点

- **本质是"条件概率接龙"**：模型学到的唯一能力是——给定前面所有 token，下一个 token 的概率分布是什么
- **三步流水线**：Token 编码（Embedding）→ 前向传播（数十层 Transformer 矩阵运算）→ 概率采样输出
- **自回归循环**：每次只生成一个 token，拼回输入后再跑一遍，直到遇到结束符（EOS）
- **GPU 友好的根本原因**：推理全程是密集矩阵乘法 + 加法，正是 GPU 擅长的计算模式

## 详细内容

### 推理三步流水线

```
用户输入 "今天天气"
    │
    ▼
[Step 1: Tokenize + Embedding]
  "今天" "天气"  →  [0.12, -0.87, ..., 0.45]   (每个 token 变成高维向量)
    │
    ▼
[Step 2: Forward Pass — 数十层 Transformer]
  每层做两件事:
    ┌─ Attention: 每个 token 看其他所有 token，算"我该重点关注谁"
    └─ FFN:       非线性变换，提取更深层语义
  (全是矩阵乘法 + 加法，GPU 密集并行计算)
    │
    ▼
[Step 3: Output Head — 输出概率分布]
  P("晴") = 0.30, P("不错") = 0.20, P("很") = 0.15, ...
    │
    ▼
  采样策略选择下一个 token (贪心/Top-K/Top-P/Temperature)
    │
    ▼
  生成 "晴"，拼回输入 → "今天天气晴" → 重新跑一遍 → 生成下一个 token
  循环直到遇到 EOS token
```

### 自回归生成的本质

```
输入序列:  [t1, t2, t3]
第 1 步:   P(t4 | t1, t2, t3)         → 采样得 t4
第 2 步:   P(t5 | t1, t2, t3, t4)     → 采样得 t5
第 3 步:   P(t6 | t1, t2, t3, t4, t5) → 采样得 t6
...
```

每个新 token 的生成都依赖之前所有 token，这就是"自回归"（autoregressive）的含义。序列越长，每步计算量越大——这正是 [[概念/kv-cache|KV Cache]] 要解决的问题。

### Attention 机制的直觉

Attention 解决的是"指代消解"问题——当模型看到"它"时，需要知道"它"指的是前文的哪个词。

```
输入: "小猫 坐在 垫子 上 因为 它 很 软"

生成"它"时，Attention 权重分布:
  小猫: 0.05
  垫子: 0.75  ← 重点关注"垫子"
  其他: 0.20
```

每层 Transformer 有几十组"注意力头"（Attention Head），每组学到不同维度的关注模式（语法关系、语义相似性、位置关系等）。

### 采样策略对比

| 策略 | 原理 | 效果 |
|------|------|------|
| **Greedy** | 永远选概率最高的 token | 确定性输出，但容易重复 |
| **Top-K** | 只在概率最高的 K 个 token 中采样 | 控制多样性，K 越大越发散 |
| **Top-P (Nucleus)** | 在累积概率达 P 的最小 token 集合中采样 | 自适应候选集大小 |
| **Temperature** | 用 T 缩放 logits（T<1 更确定，T>1 更随机） | 平滑调节生成温度 |

### 核心推理优化技术

| 优化技术 | 解决什么问题 | 效果 |
|----------|------------|------|
| [[概念/kv-cache|KV Cache]] | 避免每步重算已有 token 的注意力 | 将复杂度从 O(T²) 降至 O(T) |
| [[概念/paged-attention|PagedAttention]] | KV Cache 显存碎片化浪费 | 显存利用率接近 100% |
| [[概念/speculative-decoding|投机解码]] | 自回归逐 token 生成太慢 | 2-3× 延迟降低，输出分布不变 |
| [[概念/model-compression|量化]] | FP16 参数太大，显存装不下 | INT4 量化后模型体积缩小 4× |
| [[概念/continuous-batching|连续批处理]] | 单请求 GPU 利用率低 | 多请求动态拼批，吞吐提升数倍 |

### Pre-fill vs Decode 两阶段

推理实际上分为两个计算特征截然不同的阶段：

```
[Pre-fill 阶段]                    [Decode 阶段]
输入整个 prompt (并行计算)          逐 token 生成 (串行)
计算密集型 (大矩阵乘法)             访存密集型 (每次只算一个 token)
延迟可控                           延迟决定用户体验 (TTFT vs TPOT)
```

这一区分催生了 [[概念/prefill-decode|Prefill-Decode 分离架构]]——用不同硬件配置分别优化两个阶段。

## 来源

- Vaswani et al., "Attention Is All You Need," NeurIPS 2017
- [[大模型/LLM_Fundamentals]] — LLM 基础知识
- [[大模型/Transformer_Architecture]] — Transformer 架构详解

## Related

- [[概念/decoding-strategies]] — 解码策略总览
- [[概念/greedy-decoding]] — 贪心解码
- [[概念/sampling-decoding]] — 随机采样解码
- [[概念/temperature-scaling]] — 温度缩放
- [[概念/top-p-sampling]] — Top-p 采样
- [[概念/top-k-sampling]] — Top-k 采样
- [[概念/beam-search]] — 束搜索
- [[概念/autoregressive-generation]] — 自回归生成
- [[概念/ttft]] — 首 token 延迟
- [[概念/tpot]] — 每 token 延迟
- [[概念/kv-cache]] — KV Cache 推理优化核心
- [[概念/llm-inference-checklist]] — LLM 推理上线检查清单
- [[概念/model-deployment]] — 模型部署（推理的生产落地）
- [[概念/model-serving]] — 推理引擎选型（vLLM/SGLang/TensorRT-LLM）
- [[概念/speculative-decoding]] — 投机解码加速
- [[概念/prefill-decode]] — Prefill-Decode 分离架构
- [[概念/mixture-of-experts]] — MoE 稀疏激活降低推理计算量

## 推理优化技术全景

| 技术 | 加速比 | 复杂度 | 适用场景 |
|------|--------|--------|----------|
| **Continuous Batching** | 2-5x | 低 | 所有服务 |
| **PagedAttention** | 1.5-2x | 低 | 显存受限 |
| **Flash Attention** | 1.5-2x | 低 | 长序列 |
| **量化 (FP8/INT4)** | 1.5-3x | 中 | 生产部署 |
| **投机解码** | 2-3x | 中 | 延迟敏感 |
| **KV Cache 压缩** | 1.5-2x | 中 | 长上下文 |
| **PD 分离** | 1.5-2x | 高 | 大规模服务 |
| **TensorRT 编译** | 2-4x | 高 | 极致性能 |

## 推理流程图解

```
输入 Token 化 → Prefill (并行计算 KV) → Decode (逐 Token 生成)
                    │                          │
                    └─ TTFT                    └─ TPOT
                    │                          │
                    └─ Flash Attn              └─ 投机解码
                    └─ Chunked Prefill         └─ KV Cache

输出: Token → 反 Token 化 → 文本
```

## 生产最佳实践

1. **引擎选择**：通用服务用 vLLM/SGLang，极致性能用 TensorRT-LLM
2. **量化必用**：H100+ 用 FP8，其他用 INT8/INT4
3. **监控 TTFT/TPOT**：分别监控两个阶段延迟
4. **批处理调优**：调整 max_num_seqs 平衡吐吐量与延迟
5. **显存管理**：监控 KV Cache 使用率，避免 OOM

## 延伸阅读

- [[概念/Inference/prefill-decode|Prefill/Decode]] — 推理两阶段
- [[概念/Inference/continuous-batching|连续批处理]] — 批处理优化
- [[概念/Inference/quantization|量化]] — 模型压缩
- [[概念/Inference/model-serving|模型服务]] — 服务架构

> ℹ️ 模型推理是 LLM 生产化的核心环节，优化空间巨大。

---

## 2026 模型推理生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **vLLM 0.8+** | 最流行的开源 LLM 推理引擎 | GA |
| **SGLang** | 高性能结构化生成推理 | GA |
| **TensorRT-LLM** | NVIDIA 官方 LLM 推理优化 | GA |
| **推理成本优化** | 量化+缓存+批处理综合降本 | GA |
| **边缘推理** | 端侧小模型推理方案成熟 | GA |

## 生产最佳实践

1. **引擎选择**：通用场景 vLLM，结构化输出 SGLang，极致性能 TRT-LLM
2. **量化部署**：AWQ/GPTQ INT4 量化降低 50%+ 显存
3. **批处理优化**：Continuous Batching 是基本要求
4. **监控体系**：TTFT/TPOT/吐吐量/GPU 利用率全链路监控
5. **容量规划**：基于峰值流量 1.5x 规划 GPU 资源
