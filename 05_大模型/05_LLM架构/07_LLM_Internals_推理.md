---
title: "大模型推理与部署：从解码到生产引擎"
tags: [llm, inference, kv-cache, flash-attention, quantization, speculative-decoding, vllm, serving]
source: yeasy/llm_internals
created: 2026-06-19
updated: 2026-07-25
tier: peripheral
aliases:
  - "Llm Internals Inference"
  - "LLM Internals Inference"
  - LLM_Internals_Inference
sources: []

name_zh: "大模型推理与部署：从解码到生产引擎"
---
# 大模型推理与部署：从解码到生产引擎

> 中文简称：大模型推理与部署：从解码到生产引擎

> **核心命题**：推理的瓶颈到底在哪？如何用 KV 缓存、Flash Attention、量化、连续批处理把吞吐量提升数十倍？

本文系统提炼《大模型原理与架构》第三部分（推理与部署篇，第 9–11 章），覆盖解码策略、推理优化与生产部署。相关深入内容可参见 [[10_部署推理/03_推理优化/02_LLM推理_深入分析]]、[[05_大模型/05_LLM架构/04_LLM_架构_Evolution]] 与 [[概念/LLM/context-engineering]]。

---

## 1. 解码策略：模型如何生成文本

### 1.1 自回归解码的机制

自回归模型逐词生成：每步用新词元的 Q 与所有历史 K/V 计算注意力，预测下一个词元。两种截然不同的阶段特性是所有推理优化的起点。

### 1.2 推理的两阶段与瓶颈

| 阶段 | 特性 | 瓶颈 |
|------|------|------|
| **Prefill**（处理输入） | 一次性算所有输入词元间的注意力，类似训练前向 | **计算密集型**（GPU 算力） |
| **Decode**（生成新词） | 每步只算一个新词元，加载完整权重+KV 缓存但计算量极小 | **访存密集型**（显存带宽） |

> **访存瓶颈的数学**：70B FP16 模型权重约 140GB，单卡 H100 SXM 仅 80GB。decode 阶段算术强度（每字节访存的 FLOPS）极低，计算单元大部分时间在等数据加载。

优化三大方向：① 减少访存量（量化、剪枝）；② 减少重复计算（KV 缓存）；③ 提高并行度（投机解码、连续批处理）。

### 1.3 确定性解码：贪心搜索与束搜索

- **贪心搜索**：每步选概率最高词元。快但易重复、平庸
- **束搜索（Beam Search）**：同时维护 $k$ 条候选路径，选总体概率最高的。质量更好但无法生成多样化输出，且偏向短而通用的回答

### 1.4 采样策略：温度、Top-k、Top-p

**温度（Temperature）**：在 softmax 前缩放 logits，控制分布锐度：

$$P(x_i)=\frac{\exp(z_i/T)}{\sum_j\exp(z_j/T)}$$

- $T<1$：更尖锐，确定、聚焦（事实问答）
- $T>1$：更均匀，多样、随机（创意写作）

**Top-k**：只在概率最高 $k$ 个词元中采样（常用 $k=50$）。固定 $k$ 的局限：确定性高的位置（如"中华人民___"只能接"共和国"）引入太多噪声。

**Top-p（核采样 Nucleus）**：选累积概率达 $p$ 的最小集合（常用 $p=0.9\sim0.95$）。**自适应**——分布集中时集合小，分散时自动扩大。信息论上根据条件熵自适应匹配"有效支撑集"，比固定 Top-k 更合理，是当前最常用策略。

**Min-p**：阈值绑定到最高概率词元 $P(x_i)\ge\alpha p_{\max}$，高温采样时常比固定 Top-k/p 更稳。

> **重复惩罚家族**（直接改 logits 抑制复读）：① 重复惩罚（出现过的词 logit 除/乘 $\theta$，常 1.1–1.3）；② 频次惩罚（按出现次数扣减）；③ 存在惩罚（出现过就扣固定值，鼓励新话题）。三者都作用在 softmax 之前，可与温度、截断组合。

### 1.5 Gumbel-Max：GPU 友好的等价采样

传统多项式采样需前缀和+查找，有 CPU-GPU 同步。**Gumbel-Max Trick** 数学等价但 GPU 极度友好：

$$\text{sample}(p)\overset{d}{=}\arg\max_i(\ln p_i+g_i),\quad g_i\sim\text{Gumbel}(0,1)$$

全是并行 element-wise 运算 + 一次 argmax。vLLM 的实现用指数噪声等价形式：

```python
probs = logits.softmax(dim=-1, dtype=torch.float32)
q = torch.empty_like(probs); q.exponential_()
return probs.div_(q).argmax(dim=-1)
```

> 词表沿张量并行切到多卡时，传统需 all-gather 整张 logits（$O(V)$），Gumbel-Max 只需每卡局部 max+索引再 All-Reduce（$O(\text{world\_size})$）。贪心（argmax）与随机采样在 kernel 上完全统一——后者只多做一步"除以噪声"。

### 1.6 结构化输出与约束解码

通过约束解码（如 JSON schema、正则、语法）保证输出符合特定格式，用于工具调用、数据抽取等。推理时扩展（test-time scaling）见 [[LLM_Internals_Models_Frontiers]]。

---

## 2. 推理优化：第一性原理

### 2.1 KV 缓存：避免重复计算

**原理**：之前词元的 K/V 在后续步骤不变（因果掩码保证），首次计算后缓存复用。每步只：① 算新词元 Q/K/V；② K/V 追加缓存；③ 新 Q 与所有缓存 K 算注意力；④ 加权求和缓存 V。

> 注意力子问题从 $O(t^2 d)$ 降至 $O(t d)$。但完整 decoder 层每步仍需 07_QKV 投影、MLP、输出投影——非常数成本。

**显存代价**：

$$\text{KV 缓存}=2\times B\times L\times H_{kv}\times d_h\times t\times\text{bytes}$$

Llama 2-70B（80 层、8 KV 头、128 维、GQA），$B=1$、4096 词元、FP16 约 1.25GiB；若用标准 MHA（64 头）则约 10GiB。

### 2.2 GQA：减小 KV 缓存

**分组查询注意力**（Llama 2-70B、Mistral 等）让多个查询头共享一组 KV 头。Llama 2-70B：64 查询头但仅 8 KV 头，KV 缓存减为 1/8。

| 方案 | KV 头数 | KV 缓存 | 质量 | 吞吐 |
|------|---------|---------|------|------|
| MHA | $H$(64) | 1× | 基准 | 1× |
| **GQA** | $G$(8) | 1/8 | ≈99.5%+ | 1.5–2× |
| MQA | 1 | 1/64 | ≈97–99% | 2–3× |

> **为何几乎无损**：① KV 表征存在大量冗余（均值池化合并后稍加续训即恢复）；② 查询的 Q 投影仍独立，注意力多样性主要由 Q 驱动。

### 2.3 MLA：DeepSeek 的 KV 压缩

**多头隐向量注意力**（DeepSeek-V2/V3）将所有头的 K/V 压缩为一个低维隐向量（V3 中 512 维 + 64 维共享 RoPE = 576 维，约为全维度 32768 的 1/57），推理时通过**投影吸收**在压缩域完成主要注意力计算，无需显式解压。

DeepSeek-V3（671B）单词元 KV 缓存仅 70KB，而 GQA 的 Llama-3.1-405B 需 516KB——**压缩比约 5–7 倍**。在访存密集的 decode 阶段，这比额外矩阵变换更关键。

### 2.4 前缀缓存：跨请求复用

共享相同前缀的请求（如同一系统提示），第二个可直接复用第一个已计算的 KV 缓存。商业 API（Anthropic、OpenAI）对缓存命中词元收更低费用。

> **排列顺序决定缓存效率**：不变内容（系统提示、文档）放前面，变化内容（用户输入）放后面，最大化共享前缀。KV 缓存量化（FP8）可存更多条目并加快读取。

### 2.5 PagedAttention：解决显存碎片化

传统为每请求预分配最大长度连续显存块，浪费 60–80%。**PagedAttention**（vLLM）借鉴 OS 虚拟内存：
- 物理显存划为固定大小"页"（默认 16 词元/页）
- 每请求维护逻辑-物理页映射表
- 按需动态分配，完成后释放
- 跨请求共享前缀页面（写时复制）

碎片浪费压低到 <4%，显著提升可服务并发数。

### 2.6 Flash Attention：IO 感知的算法设计

标准注意力瓶颈不在浮点计算量，而在**内存访问**——$QK^T$ 在 HBM 生成 $n\times n$ 矩阵，构成大量非必要访存。

**核心思想**：分块（Tiling）+ 核内重计算，**从不在 HBM 存完整 $n\times n$ 注意力矩阵**。IO 复杂度从 $O(n^2)$ 降至 $O(n^2 d^2/M)$（$M$ 为 SRAM 大小），实测 2–4 倍加速 + 显存节省。

**关键支撑——Online Softmax**：分块计算时如何保证与全局 softmax 等价？维护运行态 $(m,\ell)$，遇新元素时修正：

$$m_{\text{new}}=\max(m_{\text{old}},x_i),\quad \ell_{\text{new}}=\ell_{\text{old}}\cdot e^{m_{\text{old}}-m_{\text{new}}}+e^{x_i-m_{\text{new}}}$$

修正因子 $e^{m_{\text{old}}-m_{\text{new}}}$ 将历史累积重缩放到新基准。扩展到整条 attention 流水线，循环结束时一次除法 $O=\tilde{O}/\ell$。**LSE**（$=m+\ln\ell$）进一步压缩状态为单标量，化除法为减法，HBM 写带宽减半。

**演进——与硬件协同演化**：

| 版本 | 架构 | 瓶颈 | 关键新原语 | 利用率 |
|------|------|------|-----------|--------|
| FA1 | Turing-Ampere | HBM 反复读写 $n\times n$ | `mma.sync` | — |
| FA2 | Ampere | 非矩阵乘 FLOPs、SM 并行度 | `cp.async` 异步 | A100 上 50–73% |
| FA3 | Hopper | 加载与计算串行 | TMA、WGMMA、Warp 特化 | H100 上 ~75%（FP16 ~740 TFLOPS） |
| FA4 | Blackwell | SFU 的 $e^x$ 跟不上张量核 | TMEM、`tcgen05.mma` | B200 上 ~1.3× cuDNN |

> FA3 的三大优化：① **异步流水线**（TMA 生产者 Warp 加载 + 消费者 Warp 计算）；② **GEMM-Softmax 交错**（Tensor Core 算下块 GEMM 时 CUDA Core 算上块 Softmax）；③ **FP8 块级量化 + 非相干处理**。
>
> FA4 应对**不对称扩展**（Tensor Core 算力提升远大于 SFU/带宽），把 $\tilde{O}$ 长驻 TMEM，部分 $e^x$ 用多项式 FMA 模拟让 SFU 与 ALU 并行。
>
> **核心方法论**：算法必须与硬件架构协同演化——每代新硬件引入的新原语都需把计算流水线推倒重设才能释放算力。

### 2.7 序列并行：超长上下文的分布式注意力

单卡装不下超长序列 KV 缓存时（1M+ 词元），用**序列并行**分散到多卡。**Ring Attention**：序列在序列维分割，环形拓扑异步传输 K/V 块，通信与块级注意力重叠，可处理长度近似随设备数线性扩展（稠密注意力总计算仍为二次）。

### 2.8 模型量化：更少位数表示

| 精度 | 每参数 | 压缩比(vs FP16) | 精度损失 |
|------|--------|----------------|---------|
| FP16 | 2 字节 | 1× | 基准 |
| INT8 | 1 字节 | 2× | 极小 |
| INT4 | 0.5 字节 | 4× | 小到中等 |
| INT3/2 | <0.5 | 5–8× | 中到大 |

**两类方案**：① **PTQ**（训练后量化，GPTQ 二阶信息逐层、AWQ 激活感知识别"显著权重"保留高精度）；② **QAT**（量化感知训练，精度更好但更贵）。

**量化粒度**：张量级（简单）→ 通道级（平衡）→ 块级（精度最高，异常值保留最强，但缩放因子开销多）。

> **组件敏感度层次**（不能简单按"是否参数"判断）：① 权重量化（Weight-only，最简单）；② 权重+激活（W8A8/FP8，需处理激活异常值，**SmoothQuant** 把激活难度迁移到权重侧）；③ KV 缓存量化；④ 注意力敏感路径（logit、softmax、归一化、输出层常保留 BF16/FP16）。早期层和晚期层也常保留高精度。

### 2.9 剪枝与知识蒸馏

- **剪枝**：移除不重要的权重/神经元/头，减少参数
- **知识蒸馏**：大模型（教师）指导小模型（学生），学生学软标签

### 2.10 投机解码：先猜后验

打破"每步只生成一词元"限制。用小**草稿模型**快速猜多个词元，大**目标模型**并行验证。**数学保证无损**——验证后产生与原始自回归完全相同的分布。

> **为何有效**：大量词元"容易预测"（常见词组、语法词、标点），小模型猜测常与大模型一致，一次接受多个。统计上每步接受 1–3 词元，吞吐提升 1.5–2.5 倍。

**性能三因素**：① 草稿词元成本（验证远比生成快，类比数独：解题难但检查答案容易）；② 草稿序列长度（被拒词元后全丢弃，求短而高命中）；③ 词元接受率（序列早期高，随深度递减）。

**工程约束**：高温降低有效性；低批量最有效（GPU 有空闲），大批量需动态禁用；草稿模型在不同领域准确度不同。变体：Medusa（树状多头候选）、EAGLE（倒数第二层特征预测）、Lookahead Decoding（n-gram 候选）。

---

## 3. 推理引擎与生产部署

### 3.1 推理引擎架构概览

现代推理引擎（vLLM、TensorRT-LLM、SGLang 等）核心组件：调度器、KV 缓存管理、注意力 kernel（Flash Attention）、批处理引擎、模型加载与并行。

### 3.2 连续批处理与 PagedAttention

**静态批处理**的问题：不同请求生成长度差异巨大，短请求完成后资源空闲直到长请求完成（"等最慢者"）。

**连续批处理**（Iteration-level Batching）：每个解码步检查批次——完成的立即移出，等待中的立即插入空位，GPU 始终满负载。请求到达率较高时吞吐量为静态的 **2–10 倍**。

> 核心：不是"批次更大"，而是"批次边解码边换人"。

**分块 Prefill（Chunked Prefill）**：超长 Prompt 突然到达会造成 Head-of-Line 阻塞（HOLB），decode 请求被迫等待。将长 Prompt 分成 512–1024 词元块，与 decode 交错处理。Sarathi-Serve 报告在满足严格 P99 TBT SLO 下，可服务容量提升 2.6–5.6 倍。

**缓存感知路由**：多实例集群中，共享前缀的请求路由到同一实例最大化缓存命中（哈希/语义亲和性）。

### 3.3 分离式 Prefill-Decode 架构

2024–2025 最重要的架构创新，直击单实例**资源错配**：

1. **计算特征冲突**：Prefill 计算密集（Tensor Core），Decode 访存密集（带宽），混调导致两者轮流闲置
2. **延迟相互干扰**：新长 Prompt 的 Prefill 拉长批次，使正在 decode 的请求卡顿（TPOT 飙升）
3. **配置僵化**：无法为不同阶段独立扩容

**分离式架构**物理划分两池：
- **Prefill 集群**：强算力 GPU，batch 受控（合批主要用于聚合短 Prompt，超算力饱和点后只拉长 TTFT）
- **Decode 集群**：看显存容量与带宽，大 batch 摊薄权重/KV 读取成本

> **核心挑战是状态交接**：Prefill 算出的 KV 缓存必须传给 Decode。32K 词元、Llama-70B 的 KV 缓存约 5GiB（FP8）/10GiB（FP16），万兆以太网理想线速也需 4.3–8.6 秒——足以抵消收益。优化：① 高速网络（IB/RoCE + GPU Direct RDMA）；② 异步流水线传输（层/块算完即发）；③ KV 分级压缩（近期 FP16、历史 INT8）；④ 前缀缓存预热（离线预计算常见前缀）。
>
> Mooncake、DistServe、DeepSeek 内部设施均采用此方向，但收益是 workload-specific 的。**条件分离**（智能网关按请求特征动态路由）比固定分离更适合真实混合流量。

### 3.4 MoE 模型的分布式推理

DeepSeek-V3（671B，37B 激活）需专门策略。**专家并行（EP）**：不同专家分布到不同设备，词元按路由发送到目标专家，经 All-to-All 通信汇总。

| 并行方式 | 适用 | 通信 | 场景 |
|--------|------|------|------|
| 张量并行 TP | 密集 | NVLink（层内反复） | 单节点低延迟 |
| 流水线并行 PP | 密集 | RDMA（层间异步） | 多节点 |
| 序列并行 SP | 长上下文 | Ring Attention | 1M+ 词元 |
| **专家并行 EP** | MoE | RDMA All-to-All | MoE Prefill/Decode |

> EP 通信瓶颈是 All-to-All。许多部署混合：注意力层用 TP 保延迟，MoE 层用 EP 提吞吐。MoE 特有优化：专家预取、专家缓存（热门专家常驻）、动态批处理（合并选相同专家的词元）。

### 3.5 硬件选型

| 硬件 | 特点 | 适用 |
|------|------|------|
| GPU（H100/B200） | 通用、生态成熟 | 主流 |
| TPU | Google 定制，XLA | Gemini 生态 |
| 专用加速器 | 极致效率 | 特定场景 |

Flash Attention 系列的演进揭示：**算法设计必须与硬件架构协同演化**。Blackwell 的 FP4 支持、TMEM、新异步原语持续重塑优化空间。

### 3.6 生产部署最佳实践

- **指标体系**：TTFT（首词延迟）、TPOT（每词延迟）、TBT（词间延迟）、吞吐量、goodput（满足 SLO 的有效吞吐）
- **SLO 驱动**：根据 P99/P50 延迟要求选择并行度与批量
- **可观测性**：监控 KV 缓存占用、缓存命中率、批处理利用率
- **成本优化**：量化降低显存、前缀缓存减少重复计算、分离式架构匹配负载

> 推理系统的演进方向：从单体引擎 → 类微服务的分布式系统（Prefill/Decode 分离、专家分布、异构 TP、缓存感知路由）。理解访存瓶颈、KV 缓存、批处理三大主线，是设计高效 LLM 服务的基础。

## 4. 源码级实现印证

本节把上述原理落到本仓库归档的四大引擎发布版源码，证据详见各 Deep Dive 的「源码级实现解析」章节：

| 原理（本文章节） | 源码落点 | 归档 |
|---|---|---|
| 连续批处理（3.2） | vLLM `Scheduler.schedule()` 统一 token 预算；TGI `batching_task` 每轮增删请求 | `code/vllm-0.9.1`、`code/llm-frameworks/text-generation-inference-v3.3.7` |
| PagedAttention（3.2） | vLLM `BlockPool` + `KVCacheManager`；TRT-LLM C++ `BlockManager`/`WindowBlockManager` | `code/vllm-0.9.1`、`code/llm-frameworks/TensorRT-LLM-v1.3.0rc22` |
| 缓存感知路由（3.2） | SGLang `RadixCache` + longest-prefix-first 调度；TRT-LLM `KVCacheAwareADPRouter` | `code/sglang-0.5.9`、`code/llm-frameworks/TensorRT-LLM-v1.3.0rc22` |
| Prefill/Decode 分离（3.3） | TRT-LLM `cacheTransceiver.cpp`/`dataTransceiver.cpp`（KV 跨节点传输） | `code/llm-frameworks/TensorRT-LLM-v1.3.0rc22` |
| 投机解码（2） | TRT-LLM `_torch/speculative/`（eagle3/mtp/ngram）；TGI `layers/medusa.py` | 同上 |

印证结论：四大引擎在「进程解耦 + continuous batching + paged KV + CUDA Graph」上已完全收敛，工程差异集中在前缀缓存数据结构（block 哈希 vs 基数树）与调度语言栈（Python/C++/Rust）。

## Related

- [[10_部署推理/02_推理引擎/29_vLLM_深入分析|vLLM 深度解析]]
- [[10_部署推理/02_推理引擎/23_SGLang_深入分析|SGLang 深度解析]]
- [[10_部署推理/02_推理引擎/25_TensorRT_LLM_深入分析|TensorRT-LLM 深度解析]]
- [[10_部署推理/02_推理引擎/26_TGI_深入分析|TGI 深度解析]]
- [[10_部署推理/02_推理引擎/17_LLM_推理引擎_选型_指南|LLM 推理引擎选型指南]]
