---
title: "vLLM TP Attention (张量并行注意力机制)"
category: -concepts
tags: ["vllm", "tensor-parallelism", "attention", "distributed", "inference", "gpu"]
relationships:
  - target: "_concepts/vllm"
    type: related_to
  - target: "_concepts/flash-attn"
    type: related_to
  - target: "_concepts/sglang"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "vLLM 中实现多 GPU 张量并行推理的核心注意力分发机制，将 QKV 投影切分到多 GPU 并行计算后聚合，是 70B+ 模型多卡推理的关键技术。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.82
lifecycle: stable
tier: supporting
---

# vLLM TP Attention (张量并行注意力)

vLLM TP Attention 是 vLLM 推理引擎中实现**张量并行（Tensor Parallelism, TP）**的核心注意力分发机制。当模型过大无法装入单张 GPU（如 Llama-3-70B、Qwen-72B 等），TP Attention 将 Transformer 层中的 QKV 投影矩阵**切分到多张 GPU** 上并行计算，然后通过 AllReduce/AllGather 通信聚合结果。这是大模型多卡推理的**基础架构技术**。

## 核心原理

### 张量并行 vs 其他并行策略

```
大模型推理并行策略:

张量并行 (Tensor Parallelism, TP):
  - 将单个层的权重矩阵切分到多 GPU
  - 适合: 单层大于单卡显存
  - 通信: AllReduce (高频、低延迟)
  - 拓扑: NVLink/NVSwitch (同节点)

流水线并行 (Pipeline Parallelism, PP):
  - 将不同层分配到不同 GPU
  - 适合: 跨节点模型切分
  - 通信: 点对点 (低频、可容忍延迟)
  - 拓扑: InfiniBand/RoCE (跨节点)

数据并行 (Data Parallelism, DP):
  - 每个 GPU 持有完整模型，处理不同数据
  - 适合: 高吞吐
  - 通信: AllReduce (低频)
```

### TP Attention 计算流程

```
张量并行注意力 (TP=4, 4 GPU):

输入: X [batch, seq, hidden_dim]

1. QKV 投影 (列切分):
   W_q = [W_q1 | W_q2 | W_q3 | W_q4]  (按 head 切分)
   W_k = [W_k1 | W_k2 | W_k3 | W_k4]
   W_v = [W_v1 | W_v2 | W_v3 | W_v4]
   
   GPU0: Q0 = X @ W_q0, K0 = X @ W_k0, V0 = X @ W_v0
   GPU1: Q1 = X @ W_q1, K1 = X @ W_k1, V1 = X @ W_v1
   GPU2: Q2 = X @ W_q2, K2 = X @ W_k2, V2 = X @ W_v2
   GPU3: Q3 = X @ W_q3, K3 = X @ W_k3, V3 = X @ W_v3

2. Attention 计算 (每 GPU 独立):
   GPU_i: O_i = Attention(Q_i, K_i, V_i)
   → 使用 Flash Attention / FlashInfer / PagedAttention

3. 输出聚合 (AllReduce):
   O = AllReduce([O0, O1, O2, O3])
   → 通过 NVLink 高速通信聚合

4. 输出投影:
   Y = O @ W_o (行切分, 各 GPU 持有部分)
```

## vLLM 中的实现

### 配置张量并行

```python
from vllm import LLM

# 4 GPU 张量并行
llm = LLM(
    model="meta-llama/Llama-3-70B-Instruct",
    tensor_parallel_size=4,      # TP 并行度
    gpu_memory_utilization=0.90,
    max_model_len=8192,
    dtype="float16"
)

# vLLM 自动:
# 1. 将模型权重按 head 切分到 4 GPU
# 2. 配置 NCCL 通信组
# 3. 设置 PagedAttention 的 TP 模式
# 4. 管理每 GPU 的 KV Cache
```

### CLI 启动

```bash
# 4 GPU 张量并行服务
python -m vllm.entrypoints.openai.api_server \
    --model meta-llama/Llama-3-70B-Instruct \
    --tensor-parallel-size 4 \
    --gpu-memory-utilization 0.90 \
    --max-model-len 8192 \
    --port 8000
```

### 典型 TP 配置

| 模型 | 参数量 | 推荐 TP | GPU 配置 |
|------|--------|---------|----------|
| Llama-3-8B | 8B | 1 | 1×A100 |
| Llama-3-70B | 70B | 4-8 | 4-8×A100 |
| Qwen-72B | 72B | 4-8 | 4-8×A100 |
| Llama-3-405B | 405B | 8+PP | 8×H100 + PP |
| Mixtral-8x22B | 141B | 8 | 8×H100 |

## TP 与 KV Cache 的关系

```
张量并行下的 KV Cache:

TP=4, 32 heads → 每 GPU 管理 8 heads 的 KV Cache

GPU0: KV Cache (8 heads) ← 管理自己的 head 分片
GPU1: KV Cache (8 heads)
GPU2: KV Cache (8 heads)
GPU3: KV Cache (8 heads)

PagedAttention 在每 GPU 上独立管理自己的 KV Cache 分片
→ 总 KV Cache 容量 = 4 × 单卡容量
→ 支持更长的上下文或更多并发
```

## TP + DP Attention (混合并行)

```
TP+DP Attention (vLLM 0.6+):

场景: 8 GPU, TP=4, DP=2

GPU 0-3: TP Group 0 (模型分片 A, 处理请求 batch 0)
GPU 4-7: TP Group 1 (模型分片 A, 处理请求 batch 1)

→ 相同模型分片，不同请求数据
→ 吞吐量翻倍，延迟不变

注意: TP+DP 要求相同 TP 配置
```

## 性能特性

### TP 度 vs 延迟/吞吐

| TP | 首 Token 延迟 | 生成速度 | 显存/GPU | 吞吐 |
|----|-------------|---------|---------|------|
| 1 | 最低 | 受限于OOM | 全部 | N/A |
| 2 | 低 | 高 | 1/2 | 基准 |
| 4 | 中 | 很高 | 1/4 | ~2x |
| 8 | 高(通信) | 极高 | 1/8 | ~3x |

> TP 度越高，AllReduce 通信开销越大。一般 TP ≤ 8（单节点 NVLink 范围）。

### 通信开销

```
TP 通信热点:

1. QKV AllReduce: 每次 Attention 后聚合
   → 数据量: batch × seq × hidden_dim
   
2. FFN AllReduce: 每次 FFN 后聚合
   → 数据量: batch × seq × intermediate_dim

NVLink 带宽: A100 = 600 GB/s, H100 = 900 GB/s
→ TP=8 时通信成为瓶颈
```

## 与 AI Stack 的集成

在 AI Stack 中，TP Attention 的集成点：

1. **vLLM** — 核心并行策略，自动管理 TP 切分
2. **SGLang** — 同样支持 TP，结合 RadixAttention
3. **K8s** — 通过 GPU 资源声明配置 TP 度
4. **NCCL** — NVIDIA 集合通信库，TP 的底层通信

## K8s 部署配置

```yaml
# 4 GPU 张量并行
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-tp4
spec:
  template:
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        args:
        - --model
        - meta-llama/Llama-3-70B-Instruct
        - --tensor-parallel-size
        - "4"
        - --gpu-memory-utilization
        - "0.90"
        resources:
          limits:
            nvidia.com/gpu: 4    # 必须等于 TP 度
        env:
        - name: NCCL_DEBUG
          value: "WARN"
        - name: NCCL_SOCKET_IFNAME
          value: "eth0"
```

## 参考资源

- [vLLM 文档: Tensor Parallelism](https://docs.vllm.ai/en/latest/)
- [Megatron-LM TP 论文](https://arxiv.org/abs/1909.08053)
- [NCCL 文档](https://docs.nvidia.com/deeplearning/nccl/)

## 相关概念

- [[_concepts/vllm]] — vLLM 高性能推理引擎
- [[_concepts/flash-attn]] — Flash Attention 高效注意力内核
- [[_concepts/sglang]] — SGLang 结构化生成语言
- [[_concepts/colossalai]] — ColossalAI 分布式训练
