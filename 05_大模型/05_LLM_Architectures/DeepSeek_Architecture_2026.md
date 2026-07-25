---
title: "DeepSeek 架构深度解析 2026"
category: 03-deep-learning
tags: [deepseek, mla, moe, fp8, mtp, llm-architecture, inference-optimization, production, 2026]
summary: "从 MLA、DeepSeekMoE、FP8 训练到 MTP 与推理模型，系统拆解 DeepSeek 2024-2026 年的架构创新与生产落地要点，兼顾高校教学深度与企业级工程视角。"
created: 2026-07-02
updated: 2026-07-02
tier: advanced
aliases:
  - "DeepSeek Architecture 2026"
  - "DeepSeek 架构"
  - DeepSeek_Architecture_2026
sources: []
---

# DeepSeek 架构深度解析 2026

> 本章节聚焦 DeepSeek 在模型架构层面的核心创新：MLA 注意力、DeepSeekMoE、FP8 训练与 Multi-Token Prediction，并从生产环境视角讨论训练/推理的工程化挑战与最佳实践。

---

## 目录

1. [[#1. 概述：为什么是 DeepSeek|1. 概述]]
2. [[#2. 核心概念与架构原理|2. 核心概念与架构原理]]
   - [[#2.1 Multi-head Latent Attention (MLA)|2.1 MLA]]
   - [[#2.2 DeepSeekMoE|2.2 DeepSeekMoE]]
   - [[#2.3 FP8 低精度训练|2.3 FP8 训练]]
   - [[#2.4 Multi-Token Prediction (MTP)|2.4 MTP]]
3. [[#3. 工程实践与生产考量|3. 工程实践与生产考量]]
4. [[#4. 2026 行业现状与主流方案|4. 2026 行业现状与主流方案]]
5. [[#5. 最佳实践 Checklist|5. 最佳实践 Checklist]]
6. [[#6. 相关阅读|6. 相关阅读]]

---

## 1. 概述：为什么是 DeepSeek

DeepSeek（深度求索）在 2024-2025 年连续推出的 V2、V3、R1 系列，展示了在算力受限条件下通过**架构创新**实现 Scaling 的新路径。其核心思路不是简单堆叠参数量，而是在以下四个维度做联合优化：

| 维度 | 传统 Dense/标准 Transformer | DeepSeek 方案 | 收益 |
|------|------------------------------|---------------|------|
| 注意力显存 | 标准 MHA/GQA，KV Cache 随头数线性增长 | **MLA**：将 KV 压缩到低维潜在向量 | 推理 KV Cache 减少 90%+ |
| 参数效率 | 所有参数每次前向都参与计算 | **DeepSeekMoE**：细粒度专家 + 共享专家，仅激活少量参数 | 总参数量大但激活量小 |
| 训练成本 | BF16/FP32 训练，显存与通信开销高 | **FP8 混合精度训练** | 显存与通信量接近减半 |
| 推理吞吐 | 单 token 自回归生成 | **MTP**：一次预测多个未来 token，可转投机解码 | 训练信号更密，推理可加速 |

这套架构组合使 DeepSeek-V3（671B 总参数，37B 激活参数）在训练成本上远低于同性能闭源模型，同时让长上下文、高并发推理在消费级/企业级 GPU 集群上成为可能。

---

## 2. 核心概念与架构原理

### 2.1 Multi-head Latent Attention (MLA)

#### 2.1.1 问题：标准 MHA 的 KV Cache 爆炸

标准多头注意力（MHA）在推理时需要缓存每个头的 K 和 V：

```
KV Cache 大小/层 = 2 × batch × num_heads × seq_len × head_dim × bytes_per_elem
```

对于 60 层、128 头、head_dim=64 的模型，处理 128K 上下文时，FP16 KV Cache 可达 **~120 GB**，严重限制长上下文推理的并发与成本。

#### 2.1.2 MLA 的核心思想

MLA 将 Key/Value 压缩到一个**共享的低维潜在向量** `c_t`，推理时只缓存 `c_t`，需要时再分别通过低秩上投影恢复为 K、V：

```python
import torch
import torch.nn as nn

class MLA(nn.Module):
    """
    简化版 Multi-head Latent Attention 示意。
    实际 DeepSeek-V3 实现还包括 RoPE 位置编码、Q 的压缩与解压缩等细节。
    """
    def __init__(self, d_model=7168, latent_dim=512, num_heads=128, head_dim=64):
        super().__init__()
        self.latent_dim = latent_dim
        self.num_heads = num_heads
        self.head_dim = head_dim
        kv_hidden = num_heads * head_dim

        # 压缩投影：将输入 x 压缩为低维 latent vector
        self.W_DK = nn.Linear(d_model, latent_dim, bias=False)  # down-projection for K cache
        self.W_DV = nn.Linear(d_model, latent_dim, bias=False)  # down-projection for V cache

        # 解压缩投影：从 latent vector 恢复 K/V
        self.W_UK = nn.Linear(latent_dim, kv_hidden, bias=False)
        self.W_UV = nn.Linear(latent_dim, kv_hidden, bias=False)

        # Query 保持标准投影（生产实现中通常也对 Q 做压缩，以进一步减少参数量）
        self.W_Q = nn.Linear(d_model, kv_hidden, bias=False)
        self.out_proj = nn.Linear(kv_hidden, d_model, bias=False)

    def forward(self, x, kv_cache=None):
        """
        x: [batch, seq_len, d_model]
        kv_cache: 可选，[batch, cache_len, latent_dim] 的 (c_K, c_V) tuple
        """
        b, s, _ = x.shape

        # 1. 压缩 K/V 到 latent space
        c_K = self.W_DK(x)  # [b, s, latent_dim]
        c_V = self.W_DV(x)  # [b, s, latent_dim]

        # 2. 推理时：拼接历史 cache
        if kv_cache is not None:
            past_K, past_V = kv_cache
            c_K = torch.cat([past_K, c_K], dim=1)
            c_V = torch.cat([past_V, c_V], dim=1)
        new_cache = (c_K, c_V)

        # 3. 解压缩为多头 K/V
        K = self.W_UK(c_K).view(b, -1, self.num_heads, self.head_dim).transpose(1, 2)
        V = self.W_UV(c_V).view(b, -1, self.num_heads, self.head_dim).transpose(1, 2)

        # 4. 标准缩放点积注意力
        Q = self.W_Q(x).view(b, s, self.num_heads, self.head_dim).transpose(1, 2)
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.head_dim ** 0.5)
        attn = torch.softmax(scores, dim=-1)
        out = torch.matmul(attn, V).transpose(1, 2).contiguous().view(b, s, -1)
        out = self.out_proj(out)
        return out, new_cache
```

#### 2.1.3 为什么 MLA 能在效果上不掉队？

- **低秩假设**：注意力头之间高度相关，KV 信息存在大量冗余，压缩不会显著损失表示能力。
- **解耦位置编码**：DeepSeek 在 Q、K 压缩后引入独立的 RoPE 嵌入，避免位置信息与语义信息耦合导致的精度损失。
- **训练目标一致**：潜在向量在预训练中被迫学习对后续所有头都有用的"浓缩"表示，反而提升了泛化效率。

实际效果：在 DeepSeek-V2/V3 中，MLA 将 KV Cache 压缩到标准 MHA 的 **~5-7%**，即减少 **93%** 以上。

---

### 2.2 DeepSeekMoE

#### 2.2.1 标准 MoE 的困境

传统 MoE（如 Switch Transformer）存在三个工程难题：

1. **负载不均衡**：某些专家被频繁选中，另一些几乎闲置，导致 GPU 利用率不均。
2. **通信放大**：Top-K 路由需要在多个设备间做 All-to-All 交换激活值。
3. **专家粒度过粗**：专家数量少，组合空间有限，难以形成高度专业化分工。

#### 2.2.2 DeepSeekMoE 的三项设计

| 设计 | 说明 | 工程意义 |
|------|------|----------|
| **细粒度专家** | 每个专家容量远小于标准 FFN，专家数量从 8 提升到 64/256 | 组合空间指数级扩大，专业化更细 |
| **共享专家** | 1-2 个专家对所有 token 始终激活 | 保证通用语言能力，缓解灾难性遗忘 |
| **负载均衡损失** | 在路由损失外添加专家级/设备级/通信级辅助损失 | 提升集群利用率，避免 GPU 过热或闲置 |

#### 2.2.3 前向伪代码

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class DeepSeekMoELayer(nn.Module):
    """
    简化版 DeepSeekMoE。
    实际实现会包含专家并行(EP)、All-to-All 通信、FP8 量化等。
    """
    def __init__(self, d_model=7168, num_routed_experts=256,
                 num_shared_experts=1, top_k=8, expert_dim=2048):
        super().__init__()
        self.top_k = top_k
        self.num_routed_experts = num_routed_experts

        # 共享专家：每个 token 都经过
        self.shared_experts = nn.ModuleList([
            nn.Sequential(
                nn.Linear(d_model, expert_dim),
                nn.GELU(),
                nn.Linear(expert_dim, d_model)
            ) for _ in range(num_shared_experts)
        ])

        # 路由专家：动态选择
        self.routed_experts = nn.ModuleList([
            nn.Sequential(
                nn.Linear(d_model, expert_dim),
                nn.GELU(),
                nn.Linear(expert_dim, d_model)
            ) for _ in range(num_routed_experts)
        ])

        # 路由门控网络
        self.gate = nn.Linear(d_model, num_routed_experts, bias=False)

    def forward(self, x, aux_loss_weight=0.01):
        b, s, d = x.shape
        x_flat = x.view(-1, d)  # [b*s, d]

        # 1. 计算路由分数
        logits = self.gate(x_flat)  # [b*s, num_routed_experts]
        weights, selected = torch.topk(F.softmax(logits, dim=-1), self.top_k, dim=-1)
        weights = weights / weights.sum(dim=-1, keepdim=True)  # 归一化

        # 2. 负载均衡辅助损失（仅训练时）
        router_prob = F.softmax(logits, dim=-1).mean(dim=0)  # 每个专家被平均选中的概率
        target_prob = 1.0 / self.num_routed_experts
        aux_loss = aux_loss_weight * self.num_routed_experts * (
            router_prob * router_prob
        ).sum() - aux_loss_weight  # 简化版，鼓励均匀分布

        # 3. 计算共享专家输出
        shared_out = sum(exp(x_flat) for exp in self.shared_experts)

        # 4. 计算被选中路由专家的加权和
        routed_out = torch.zeros_like(x_flat)
        for k in range(self.top_k):
            expert_idx = selected[:, k]
            w = weights[:, k:k+1]
            # 效率较低：逐 token 路由；生产环境会用分组/专家并行实现
            for token_i in range(x_flat.size(0)):
                e_idx = expert_idx[token_i].item()
                routed_out[token_i] += w[token_i] * self.routed_experts[e_idx](x_flat[token_i])

        output = shared_out + routed_out
        return output.view(b, s, d), aux_loss
```

> 上述代码为教学用伪代码，未做专家并行优化；真实生产实现参见 DeepSeek-V3 开源仓库与 Megatron-LM/DeepSpeed-MoE。

---

### 2.3 FP8 低精度训练

#### 2.3.1 为什么要用 FP8

DeepSeek-V3 是首个在超大规模 LLM 训练中成功落地 FP8 的模型。相比 BF16：

- 显存占用降低约 **50%**（激活、权重、优化器状态）。
- 矩阵乘计算吞吐量在 H100/H200 上提升约 **1.5-2 倍**。
- 节点间通信量降低约 **50%**（梯度/激活也按 FP8 发送）。

#### 2.3.2 精度保持策略

FP8 的动态范围窄（E4M3/E5M2），直接使用会导致梯度下溢和激活溢出。DeepSeek 采用以下策略：

| 技术 | 作用 |
|------|------|
| **Tile-wise / Block-wise 量化** | 对矩阵乘的输入按小 tile（如 1x128）分别计算缩放因子，避免全局分布差异 |
| **延迟缩放 (Delayed Scaling)** | 使用历史最大绝对值估计当前缩放，减少运行时量化统计开销 |
| **高精度累加** | 在 Tensor Core 内部用 FP32 累加，中间结果再转 FP8 |
| **关键层保留 BF16** | 注意力 Softmax、LayerNorm、Embedding 等敏感层保留 BF16 |

```python
import torch

class FP8Linear(torch.autograd.Function):
    """
    教学用 FP8 线性层伪代码。
    实际生产请使用 torch._scaled_mm 或 Transformer Engine。
    """
    @staticmethod
    def forward(ctx, x, weight, x_scale, w_scale):
        # 1. 量化输入和权重到 FP8 (E4M3)
        x_fp8 = (x / x_scale).to(torch.float8_e4m3fn)
        w_fp8 = (weight / w_scale).to(torch.float8_e4m3fn)

        # 2. FP8 矩阵乘，内部 FP32 累加
        out_fp32 = torch._scaled_mm(x_fp8, w_fp8.t(),
                                    scale_a=x_scale,
                                    scale_b=w_scale,
                                    out_dtype=torch.bfloat16)
        ctx.save_for_backward(x_fp8, w_fp8, x_scale, w_scale)
        return out_fp32

    @staticmethod
    def backward(ctx, grad_output):
        x_fp8, w_fp8, x_scale, w_scale = ctx.saved_tensors
        # 类似地量化梯度，此处省略
        return grad_output @ w_fp8.to(torch.bfloat16), x_fp8.t() @ grad_output, None, None


def delayed_scaling(tensor, history_max, eps=1e-12):
    """基于历史最大值的延迟缩放，用于 FP8 量化。"""
    current_max = tensor.abs().max().item()
    amax = max(current_max, history_max)
    scale = 448.0 / (amax + eps)  # E4M3 最大可表示值约为 448
    return scale, amax
```

#### 2.3.3 生产风险

- **数值不稳定**：某些层对 FP8 敏感，需保留 BF16 或做混合精度。
- **硬件绑定**：FP8 训练目前主要依赖 NVIDIA H100/H200/Blackwell；国产芯片支持参差不齐。
- **调试困难**：下溢/溢出不会立即报错，需在训练监控中跟踪损失缩放和梯度范数。

---

### 2.4 Multi-Token Prediction (MTP)

#### 2.4.1 原理

传统自回归模型每次只预测下一个 token，训练信号稀疏。MTP 在输入位置 `t` 同时预测 `t+1, t+2, ..., t+D` 共 D 个未来 token：

```
输入:  x_1, x_2, ..., x_t
MTP(D=2): 预测 x_{t+1}, x_{t+2}
损失:  sum_{d=1}^{D} CE( p_d(x_{t+d} | x_{<=t+d-1}), label )
```

#### 2.4.2 架构实现

DeepSeek-V3 使用**顺序 MTP 模块**：每个 MTP 模块共享主模型的 Embedding，接收前一个位置的隐藏状态作为输入，预测下一个未来 token。

```python
class MTPModule(nn.Module):
    """
    简化版 Multi-Token Prediction 模块。
    共享 token embedding，顺序预测未来 token。
    """
    def __init__(self, d_model, vocab_size, num_mtp_tokens=2):
        super().__init__()
        self.num_mtp_tokens = num_mtp_tokens
        self.transformer_blocks = nn.ModuleList([
            nn.TransformerEncoderLayer(d_model=d_model, nhead=8,
                                       dim_feedforward=4*d_model,
                                       batch_first=True)
            for _ in range(num_mtp_tokens)
        ])
        self.lm_heads = nn.ModuleList([
            nn.Linear(d_model, vocab_size, bias=False)
            for _ in range(num_mtp_tokens)
        ])

    def forward(self, hidden_states, future_tokens, token_embedding):
        """
        hidden_states: [b, s, d]，主模型在 t 时刻的输出
        future_tokens: [b, s, D]，未来 D 个 token 的 id
        """
        losses = []
        cur_h = hidden_states
        for d in range(self.num_mtp_tokens):
            # 将当前预测 token 的嵌入与隐藏状态相加作为下一 MTP 步输入
            next_emb = token_embedding(future_tokens[:, :, d])
            cur_h = self.transformer_blocks[d](cur_h + next_emb)
            logits = self.lm_heads[d](cur_h)
            losses.append(F.cross_entropy(
                logits.view(-1, logits.size(-1)),
                future_tokens[:, :, d].reshape(-1),
                ignore_index=-100
            ))
        return sum(losses) / len(losses)
```

#### 2.4.3 推理阶段的价值

MTP 训练完成后，可**直接转作投机解码（Speculative Decoding）**的 draft 模型：

- 主模型负责验证，MTP head 负责一次生成多个候选 token。
- 在长序列、低拒绝率的文本场景中，可将推理吞吐提升 **1.5-2 倍**。
- 相比单独训练 draft 模型，MTP 是"零额外成本"的投机解码来源。

---

## 3. 工程实践与生产考量

### 3.1 训练侧：从千卡集群到 FP8 全链路

#### 3.1.1 并行策略组合

DeepSeek-V3 671B 的训练需要在 H800 集群上做三维并行：

| 并行维度 | 用途 | 在 DeepSeek-V3 中的典型配置 |
|----------|------|------------------------------|
| 数据并行 (DP) | 扩展 batch size | ZeRO-1/FSDP 减少显存 |
| 张量并行 (TP) | 切分单个大矩阵 | TP=8 覆盖单个节点内 NVLink |
| 流水线并行 (PP) | 切分模型层 | PP 跨节点，配合 1F1B 调度 |
| 专家并行 (EP) | MoE 专家分片 | EP=64，All-to-All 路由 token |

> 实际配置会随集群拓扑（节点数、NVLink/IB 带宽）动态调整。

#### 3.1.2 通信优化

- **DualPipe**：重叠前向、反向和 All-to-All 通信，减少流水线气泡。
- **All-to-All 压缩**：FP8 激活和梯度传输，降低带宽占用。
- **专家放置感知路由**：负载均衡损失会考虑跨节点通信成本，避免把 token 频繁路由到远端节点。

```bash
# 典型 DeepSpeed-MoE 启动片段（示意）
deepspeed --num_gpus 8 train.py \
  --model deepseek-v3-671b \
  --tensor-parallel-size 8 \
  --pipeline-parallel-size 8 \
  --expert-parallel-size 64 \
  --moe-top-k 8 \
  --fp8-training \
  --zero-stage 1
```

#### 3.1.3 Checkpoint 与容错

- **高频异步 checkpoint**：每隔 50-100 步保存到并行文件系统或对象存储。
- **FP8/BF16 双份 checkpoint**：FP8 用于继续训练，BF16 副本用于下游微调和推理导出。
- **热迁移**：当 HBM 报错或 NCCL 超时时，自动回滚到最近 checkpoint 并跳过异常节点。

### 3.2 推理侧：长上下文与高并发

#### 3.2.1 KV Cache 预算

得益于 MLA，DeepSeek-V3/R1 在 128K 上下文下的 KV Cache 约为同规模 GQA 模型的 **1/15-1/20**：

| 上下文长度 | 标准 671B GQA KV Cache (FP16) | DeepSeek MLA KV Cache (FP16) |
|------------|-------------------------------|------------------------------|
| 4K         | ~3.9 GB                       | ~0.25 GB                     |
| 32K        | ~31 GB                        | ~2.0 GB                      |
| 128K       | ~124 GB                       | ~8.0 GB                      |

这意味着：单卡 80GB H100 可以承载更大 batch 或更长上下文。

#### 3.2.2 推理引擎选型

当前主流引擎对 DeepSeek 架构的支持情况：

| 引擎 | MLA | DeepSeekMoE | FP8 | MTP/投机解码 | 适用场景 |
|------|-----|-------------|-----|--------------|----------|
| **vLLM** | ✅ 完整支持 | ✅ 专家并行/动态加载 | ✅ 部分量化 | ✅ 实验性 | 通用在线服务 |
| **SGLang** | ✅ | ✅ | ✅ | ✅ | 高并发、多轮对话 |
| **TensorRT-LLM** | ✅ | ✅ | ✅ | ✅ | 高吞吐、固定 batch |
| **llama.cpp** | ⚠️ 社区版 | ⚠️ 有限 | ✅ INT4/FP8 | ⚠️ 有限 | 端侧/边缘 |
| **昇腾 MindIE** | ✅ 国产化适配 | ✅ | ⚠️ 转 BF16 | ⚠️ | 国产信创环境 |

```bash
# 使用 vLLM 启动 DeepSeek-V3（双节点 8xH100，TP=16 示意）
vllm serve deepseek-ai/DeepSeek-V3 \
  --tensor-parallel-size 16 \
  --max-num-seqs 256 \
  --max-model-len 65536 \
  --quantization fp8 \
  --enable-prefix-caching \
  --gpu-memory-utilization 0.92
```

#### 3.2.3 负载均衡与弹性

- **专家热度监控**：实时统计每个专家的命中频率，发现"过热"或"过冷"专家。
- **Prefix Caching**：对系统提示、文档前缀复用 KV Cache，降低首 token 延迟。
- **PD 分离（Prefill-Decode Disaggregation）**：将长序列的 prefill 与短生成 decode 分配到不同节点，避免互相阻塞。

### 3.3 可观测性与成本治理

生产环境需要关注的关键指标：

| 指标类型 | 具体指标 | 报警阈值建议 |
|----------|----------|--------------|
| 吞吐 | tokens/s, inter-token latency (ITL) | ITL P99 > 100ms 触发扩容 |
| 显存 | KV Cache 占用、GPU HBM 利用率 | >90% 触发告警 |
| 负载均衡 | 专家命中率标准差 | 超过均值 30% 时调参 |
| 成本 | $/1M tokens, GPU 小时成本 | 按业务线做预算分摊 |
| 质量 | 幻觉率、推理格式合规率 | 偏离基线 >5% 触发人工审核 |

---

## 4. 2026 行业现状与主流方案

### 4.1 DeepSeek 模型族演进

| 模型 | 发布时间 | 参数量 | 核心定位 | 生产状态 |
|------|----------|--------|----------|----------|
| DeepSeek-V2 | 2024.05 | 236B/21B | MLA + 细粒度 MoE 首秀 | 已大量用于国内 API |
| DeepSeek-V2.5 | 2024.09 | 236B/21B | 通用能力升级 | 主流生产基座 |
| DeepSeek-V3 | 2024.12 | 671B/37B | FP8 训练 + MTP | 2025-2026 主力模型 |
| DeepSeek-R1 | 2025.01 | 671B/37B | 推理模型，纯 RL | 复杂任务首选 |
| DeepSeek-R1-0528 | 2025.05 | 671B/37B | 推理能力增强 | 逐步替代 R1 |
| R1-Distill 系列 | 2025.01 | 1.5B-70B | 小模型强推理 | 端侧/低成本场景 |

### 4.2 行业应用格局

- **国产云厂商**：阿里云、腾讯云、火山引擎、硅基流动等均提供 DeepSeek-R1/V3 API 与私有化部署。
- **信创场景**：昇腾 910B、海光 DCU、寒武纪 MLU 已陆续完成 DeepSeek-V3/R1 推理适配，训练支持仍在追赶。
- **海外生态**：vLLM/SGLang/TensorRT-LLM 已原生支持；Hugging Face、Ollama 等提供一键下载与量化版本。
- **竞争格局**：DeepSeek 促使闭源模型降价 30-50%，推动 MLA/MoE/FP8 成为新一代 LLM 的标配设计方向。

### 4.3 主流复现路线

对于希望复现 DeepSeek 架构的团队，2026 年常用路径：

1. **基座复现**：基于 Qwen2.5/Llama-3 架构，替换 FFN 为 MoE，引入 MLA。
2. **训练框架**：使用 Megatron-LM + Transformer Engine（FP8）或 DeepSpeed-MoE（BF16）。
3. **数据配比**：中文 30-40%、英文 30%、代码 20%、数学/科学 10%。
4. **推理部署**：vLLM 0.7.x+ 或 SGLang，结合 FP8 量化与 MTP 投机解码。

---

## 5. 最佳实践 Checklist

### 5.1 架构选型

- [ ] 长上下文（>32K）场景优先考虑 MLA/GQA，避免标准 MHA。
- [ ] 超大模型（>100B）优先考虑 MoE，平衡总容量与激活成本。
- [ ] 训练新模型时评估 FP8 可行性，优先在 H100/Blackwell 上试点。
- [ ] 对延迟敏感的在线服务保留 BF16/FP16 路径，避免 FP8 精度风险。

### 5.2 训练阶段

- [ ] 使用 tile-wise 量化缩放，避免全局 FP8 量化导致的精度崩塌。
- [ ] 在路由损失中加入专家级/设备级/通信级负载均衡项。
- [ ] 每 50-100 步异步保存 checkpoint，并保留 BF16 浮点副本。
- [ ] 监控梯度范数、损失缩放因子、专家命中率分布。
- [ ] 对敏感层（Embedding、LayerNorm、Attention Softmax）保留 BF16。

### 5.3 推理阶段

- [ ] 根据上下文长度和并发量计算 KV Cache 预算，避免 OOM。
- [ ] 启用 Prefix Caching 和 chunked prefill，降低首 token 延迟。
- [ ] 对高吞吐场景开启 MTP/投机解码，并监控接受率。
- [ ] 使用 PD 分离避免长 prompt 阻塞短请求。
- [ ] 建立多模型路由：简单任务走蒸馏小模型，复杂任务走 R1。

### 5.4 生产治理

- [ ] 定义推理 SLO：TTFT（Time To First Token）、TPOT（Time Per Output Token）、P99 ITL。
- [ ] 建立成本分摊机制：按项目/业务线统计 tokens、GPU 小时、API 费用。
- [ ] 实施内容安全护栏：输入过滤、输出审核、推理过程审计。
- [ ] 制定回滚方案：模型版本、推理配置、KV Cache 格式需向前兼容。
- [ ] 定期进行灾难演练：节点故障、NCCL 超时、checkpoint 损坏恢复。

---

## 6. 相关阅读

- [[05_大模型/13_LLM_Products/deepseek_overview|DeepSeek 深度解析]] — DeepSeek 全貌与 API 使用
- [[05_大模型/09_Reasoning_Models/DeepSeek_R1_Technical_Analysis|DeepSeek-R1 技术深度解析]] — R1 训练流程与 GRPO 细节
- [[05_大模型/05_LLM_Architectures/MoE_Case_Studies_DeepSeek_Mixtral|MoE 案例研究：DeepSeek-MoE 与 Mixtral]] — MoE 路由与专家设计对比
- [[03_深度学习/02_Neural_Network_Core/Attention_Mechanisms_Deep_Dive|注意力机制深度解析]] — 标准 MHA / GQA / MLA 的关系
- [[05_大模型/05_LLM_Architectures/LLM_Architectures|大模型架构全景]] — LLM 架构演进路线
- [[07_模型训练/03_Optimization/Mixed_Precision_Training|混合精度训练]] — FP16/BF16/FP8 原理
- [[07_模型训练/04_Distributed_Training/Distributed_Training_2026|分布式训练 2026]] — 训练并行策略
- [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive|vLLM 深度解析]] — DeepSeek 推理部署首选引擎
- [[10_部署推理/04_Inference_Performance/Prefill_Decode_Disaggregation|Prefill-Decode 分离]] — 推理性能优化
- [[13_运维/02_SRE_Reliability/AI_SRE_Runbook|AI SRE Runbook]] — 生产上线与事故响应
