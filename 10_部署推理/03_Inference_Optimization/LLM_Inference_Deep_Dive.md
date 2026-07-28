---
title: "LLM 推理深度剖析：解码策略、推理优化与服务引擎"
category: 05-nlp-llms
tags: ["decoding", "greedy-search", "beam-search", "sampling", "temperature", "top-p", "kv-cache", "flash-attention", "quantization", "speculative-decoding", "continuous-batching", "PagedAttention", "disaggregated-serving", "prefill-decode"]
summary: "> 系统覆盖 LLM 推理全链路：解码策略（贪心/束搜索/温度/Top-k/Top-p/Gumbel-Max）、推理优化（KV 缓存/GQA/MLA/Flash Attention/量化/投机解码）、服务引擎（连续批处理/PagedAttention/分离式 Prefill-Decode）。"
source: "来源/yeasy/llm_internals/ (Ch9-11)"
created: 2026-06-17
updated: 2026-06-17
tier: supporting
aliases:
  - "Llm Inference Deep Dive"
  - "LLM Inference Deep Dive"
  - LLM_Inference_Deep_Dive
sources: []

name_zh: "LLM 推理深度剖析：解码策略、推理优化与服务引擎"
---
# LLM 推理深度剖析：解码策略、推理优化与服务引擎

> 中文简称：LLM 推理深度剖析：解码策略、推理优化与服务引擎

> **推理三层次**: 解码策略决定"如何选词" → 推理优化决定"如何加速计算" → 服务引擎决定"如何高效调度请求"

---

## TL;DR

- **解码策略**: 贪心/束搜索适合确定性任务；Top-p 采样根据分布熵自适应调整范围，是当前主流
- **KV 缓存**: 避免重复计算历史 K/V，是推理效率的基石；GQA 减至 1/8 缓存，MLA 再压缩 5-7x
- **Flash Attention**: IO 感知分块 + Online Softmax，避免写回 $n \times n$ 注意力矩阵，2-4x 加速
- **量化**: INT8 几乎无损，INT4 (GPTQ/AWQ) 精度可控，FP8 是高端 GPU 新路线
- **投机解码**: 小模型草稿 + 大模型验证，数学保证分布不变，1.5-2.5x 加速
- **连续批处理 + PagedAttention**: 每步动态换入换出请求，碎片浪费 < 4%，吞吐提升 2-10x
- **分离式 Prefill-Decode**: 计算密集/访存密集分离到独立 GPU 池，消除延迟干扰

---

## 关联文档

- [[05_大模型/Transformer_Deep_Dive]] — Transformer 架构基础
- [[07_模型训练/01_Training_Fundamentals/LLM_Training_Deep_Dive]] — 训练技术
- [[05_大模型/05_LLM_Architectures/LLM_Architecture_Evolution]] — 架构演进
- [[05_大模型/12_Edge_LLM/Edge_LLM_Deep_Dive]] — 端侧推理

---

## 1. 解码策略

### 1.1 贪心搜索与束搜索

**贪心搜索**: 每步选 $\arg\max_x P(x|x_{1:t-1})$，最快但局部最优不等于全局最优。

**束搜索**: 维护 $B$ 条候选序列，每步从 $B \times |V|$ 候选中选 Top-$B$。按长度归一化消除短序列偏好：$\log P(y) / |y|^\alpha$。计算和 KV 缓存约为贪心的 $B$ 倍。

束搜索适合翻译等有"正确答案"的任务，但对创造性文本往往产生重复、保守的输出。

### 1.2 采样策略

**温度采样**: $P(x_i) = \exp(z_i/T) / \sum_j \exp(z_j/T)$
- $T < 1$: 分布更尖锐，输出更确定
- $T > 1$: 分布更均匀，输出更多样

**Top-k 采样**: 只保留概率最高的 $k$ 个词元（常用 $k=50$）。局限：$k$ 固定，不随分布熵自适应。

**Top-p 采样 (Nucleus Sampling)**: 选择最小集合使累积概率 $\geq p$（常用 $p=0.9$）。

$$S = \{x_{(1)}, \ldots, x_{(m)}\} \text{ s.t. } \sum_{i=1}^{m} P(x_{(i)}) \geq p$$

**信息论优势**: 分布熵低时集合自动收缩，熵高时自动扩大——用固定累积概率预算匹配分布的"有效支撑集"大小，比 Top-k 更合理。

**Min-p 采样**: 阈值绑定当前最高概率 $p_{\max}$，只保留 $P(x_i) \geq \alpha \cdot p_{\max}$ 的词元，高温采样更稳。

**重复惩罚**: 对已出现词元的 logit 施加惩罚（除以/乘以 $\theta > 1$），OpenAI 风格的频次/存在惩罚为加性变体。

**典型配置**: $T=0.7$, Top-p=0.9。

### 1.3 Gumbel-Max 采样：GPU 友好的等价方案

$$\text{sample}(p) \overset{d}{=} \arg\max_i (\ln p_i + g_i), \quad g_i \sim \text{Gumbel}(0,1)$$

vLLM 实现：`probs.div_(torch.empty_like(probs).exponential_()).argmax(dim=-1)`

将采样拆解为三个完全并行的 element-wise 操作 + 一次 argmax，避免多项式采样的前缀和依赖链。在张量并行场景下通信量从 $O(V)$ 降至 $O(\text{world\_size})$。

---

## 2. 推理优化

### 2.1 KV 缓存

**核心观察**: 因果掩码保证历史词元的 K/V 不受未来影响，只需计算一次后缓存复用。

每步新增词元只需：计算新 Q/K/V → 追加缓存 → Q 与全部缓存 K 计算注意力 → 加权求和缓存 V。

**显存公式**: $\text{KV 缓存} = 2 \times B \times L \times H_{kv} \times d_h \times t \times \text{bytes}$

| 模型 | KV 头数 | 4096 词 FP16 缓存 |
|------|---------|-----------------|
| Llama 2-70B (GQA) | 8 | ~1.25 GiB |
| 同参数 MHA | 64 | ~10 GiB |

**GQA 为何几乎无损**: KV 表征存在大量冗余；注意力多样性主要由 Q 驱动而非 KV；合并 KV 头后续训 5% 即可恢复质量。

**前缀缓存**: 共享前缀（系统提示词）的 KV 缓存跨请求复用。商业 API 对缓存命中收费更低。应将不变内容放前面、变化内容放后面以最大化缓存命中。

**MLA (DeepSeek-V3)**: 将所有头的 K/V 压缩为 512 维隐向量 + 64 维 RoPE 键（共 576 维 vs 全维度 32768），单词元 KV 缓存仅 70KB（Llama-3.1-405B 的 516KB 的 1/7）。

### 2.2 Flash Attention

**核心思想**: IO 感知分块计算 + 核内重计算，避免将完整 $n \times n$ 注意力矩阵写入 HBM。

**Online Softmax**: 维护 $(m, \ell, \tilde{O})$ 三个状态变量，每遇新块增量更新：
$$m_{\text{new}} = \max(m_{\text{old}}, x_i), \quad \ell_{\text{new}} = \ell_{\text{old}} \cdot e^{m_{\text{old}} - m_{\text{new}}} + e^{x_i - m_{\text{new}}}$$

修正因子 $e^{m_{\text{old}} - m_{\text{new}}}$ 在新最大值出现时重缩放历史累积，保证与全局 Softmax 完全一致。

**LSE 压缩**: $\text{LSE} = m + \ln \ell$，每行只需 1 个 FP32 标量，HBM 写带宽减半。

| 版本 | 目标架构 | 关键创新 |
|------|---------|---------|
| FA1 | SM75-80 | 分块 + Online Softmax，避免 $O(n^2)$ HBM 写入 |
| FA2 | SM80 | 减少非矩阵乘 FLOPs，优化 Warp 间工作划分 |
| FA3 | SM90 (Hopper) | TMA 异步加载 + Warp 特化 + GEMM-Softmax 交错 |
| FA4 | SM100 (Blackwell) | TMEM 新存储层 + 更细粒度异步 + SFU 软件模拟 |

**序列并行**: Ring Attention 将序列在序列维度分割，通过环形拓扑异步传输 K/V 块，可处理序列长度随设备数线性扩展。

### 2.3 模型量化

| 精度 | 每参占用 | 压缩比 | 精度损失 |
|------|---------|-------|---------|
| FP16 | 2 bytes | 1x | 基准 |
| INT8 | 1 byte | 2x | 极小 |
| INT4 | 0.5 byte | 4x | 小到中等 |

**PTQ 方案**:
- **GPTQ**: 基于二阶信息的逐层量化
- **AWQ**: 根据激活分布识别"显著权重"，对其保留更高精度
- **SmoothQuant**: 逐通道缩放将激活侧量化难度迁移到权重侧，W8A8 基本不掉点

**量化粒度**: 张量级 → 通道级 → 块级，粒度越细越能保留异常值。

**组件敏感度**: 权重 < 权重+激活值 < KV 缓存 < 注意力敏感路径（logit/Softmax/LN）。早期层和输出层常保留较高精度。

### 2.4 投机解码

**核心思想**: 小草稿模型快速猜测 $K$ 个词元 → 大目标模型并行验证 → 数学保证分布不变。

**为什么有效**: 大量词元实际"容易预测"（常见词组/语法词/标点），小模型猜测通常与大模型一致。统计上一次通常接受 1-3 个词元，吞吐提升 1.5-2.5x。

**变体**:
- **Medusa**: 目标模型增加多个解码头 + 树状注意力
- **EAGLE**: 在倒数第二层特征空间预测草稿
- **Lookahead Decoding**: 并行 n-gram 候选和验证

**工程约束**:
- 高温采样降低接受率
- 低 batch 最有效（GPU 有空闲资源验证）
- 草稿模型在不同领域的准确度差异影响接受率

---

## 3. 服务引擎

### 3.1 连续批处理

**静态批处理**: 等待批次所有请求完成才处理下一批。短请求完成后资源闲置。

**连续批处理**: 每个解码步检查 → 完成请求立即移出 → 等待请求立即插入。GPU 始终满负载，吞吐提升 2-10x。

### 3.2 PagedAttention

借鉴操作系统**虚拟内存**页式管理：

1. 物理显存划分为固定大小"页"（默认 16 词元/页）
2. 每个请求维护逻辑-物理页面映射表
3. 按需分配，不预分配最大长度
4. 跨请求共享前缀页面（写时复制）

**效果**: 将传统 60-80% 的碎片化浪费压低到 < 4%，等价于显著增加可服务并发数。

### 3.3 分块 Prefill

长 Prompt 的 Prefill 可能耗时数秒，造成 Head-of-Line 阻塞。

**解决方案**: 将长 Prompt 分解为 512-1024 词元的块，与 Decode 请求交错处理。Prefill 总耗时不变，但中间穿插 Decode 保证 TPOT 平稳。Sarathi-Serve 报告在满足严格 P99 SLO 下可服务容量提升 2.6-5.6x。

### 3.4 分离式 Prefill-Decode 架构

**单体架构问题**:
- Prefill（计算密集）和 Decode（访存密集）计算特征冲突
- 新请求 Prefill 拉长批次计算时间，导致 Decode 请求 TPOT 飙升
- 资源配置僵化，无法独立扩容

**分离式架构**:
- **Prefill 集群**: 专用计算密集型 GPU，处理长文本理解
- **Decode 集群**: 优先看显存容量与带宽，专注逐词生成

**KV 缓存传输挑战**: 32K 词元 Llama-70B 约 5-10 GiB，标准万兆以太网需 4-9 秒。优化手段：
- InfiniBand + GPU Direct RDMA
- 异步流水线传输（计算与传输重叠）
- KV 缓存分级压缩（近期 FP16 / 历史 FP8）
- 前缀缓存预热（预计算常见前缀）

**条件分离**: 智能网关根据请求特征动态决定——长输入走分离，短输入/已缓存走单体。

**异构张量并行**: Prefill 引擎用低 TP（算力饱和快），Decode 引擎用高 TP（分散权重增加并发）。

### 3.5 缓存感知路由

多实例集群中，根据请求 Prompt 哈希值路由到已缓存该前缀的实例，最大化前缀缓存命中。

### 3.6 MoE 模型的专家并行

每张 GPU 持有部分专家，词元根据路由决策通过 All-to-All 通信发送到目标专家。DeepSeek-V3 (671B, 256 路由专家, Top-8) 依赖 RDMA 网络处理通信瓶颈。

---

## 参考来源

- 原始书籍: `来源/yeasy/llm_internals/09_decoding/` (Ch9: 解码策略)
- 原始书籍: `来源/yeasy/llm_internals/10_inference_optimization/` (Ch10: 推理优化)
- 原始书籍: `来源/yeasy/llm_internals/11_serving/` (Ch11: 服务引擎)
