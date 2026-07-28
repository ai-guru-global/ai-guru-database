---
title: "Mamba-2 / SSD 状态空间模型 (Mamba-2 / State Space Duality)"
category: concepts
tags:
  - llm
  - mamba
  - ssm
  - state-space-model
  - mamba-2
  - ssd
  - selective-state-space
  - architecture
  - linear-time
  - long-context
aliases:
  - Mamba-2
  - Mamba-2 / SSD
  - State Space Duality(SSD)
  - Mamba-2 SSM
  - Structured State Space Duality
relationships:
  - target: "概念/mamba"
    type: extends
  - target: "概念/transformer"
    type: related_to
  - target: "概念/long-context-llm"
    type: related_to
  - target: "概念/linear-attention"
    type: related_to
summary: "Mamba-2(2024-05,Princeton + CMU)是 Mamba 架构的全面升级——通过**SSD(State Space Duality)**理论统一 SSM 与线性注意力,训练速度提升 2-8 倍,在语言建模上追平 Transformer 同时保持 O(n) 线性复杂度。是 2024-2026 年"非 Transformer 架构"路线的代表,与 RetNet/RWKV/Mamba 共同挑战 Attention 的统治地位。"
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources: []
name_zh: "Mamba-2 / SSD 状态空间模型"
---

# Mamba-2 / SSD 状态空间模型

> 中文简称：Mamba-2 / SSD 状态空间模型

> **一句话理解**:Mamba-2 把"状态空间模型(SSM)"与"线性注意力"在数学上证明是**对偶的**——这一理论突破让 Mamba-2 既能像 SSM 一样 O(n) 线性推理,又能像 Attention 一样用成熟的 GPU 优化(Tensor Cores)。是"Transformer 不再一统天下"路线的旗舰架构。

---

## 一、背景与动机

### 1.1 Transformer 的"二次方问题"

- 标准 Self-Attention 计算复杂度 **O(n²)**(n 为序列长度),显存占用 O(n²)。
- 长上下文(100K+)场景下,显存与算力爆炸式增长。
- 这推动了"次二次方架构"研究:Linear Attention、RetNet、RWKV、SSM、Hyena 等。

### 1.2 Mamba(2023-12,第一代)

- 论文:"Mamba: Linear-Time Sequence Modeling with Selective State Spaces"(Gu & Dao,2023)
- 引入**选择性状态空间(Selective SSM / S6)**:让 SSM 能"选择性记住或遗忘"信息,语言建模上首次追平 Transformer。
- 推理复杂度 **O(n)**,长序列(>2K)速度优势明显。
- arXiv:[2312.00752](https://arxiv.org/abs/2312.00752)(Mamba)

### 1.3 Mamba-2 的理论突破(2024-05)

- 论文:"Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality"(Dao & Gu,2024-05)
- arXiv:[2405.21060](https://arxiv.org/abs/2405.21060)
- 会议:**ICML 2024**(Oral)
- 核心:**SSD(State Space Duality)**——证明 SSM 与线性注意力在数学上**互为对偶**,可以用 Attention 的算法框架实现 SSM,反之亦然。
- 关键收益:
  1. 训练速度 **2-8 倍**于 Mamba-1
  2. 用 NVIDIA Tensor Core 优化,硬件利用率高
  3. 可以混合 SSM + Attention 层(已实现的 Jamba、Mamba-2-Hybrid)
  4. 在 1.3B~2.8B 规模语言建模上追平同尺寸 Transformer

---

## 二、关键术语中英对照

| 中文 | 英文 | 说明 |
|---|---|---|
| 状态空间模型 | State Space Model(SSM) | 用"状态向量"压缩历史信息的序列模型 |
| 状态空间对偶 | State Space Duality(SSD) | SSM 与线性注意力在数学上互为对偶 |
| 选择性扫描 | Selective Scan | Mamba 引入,让 SSM 按内容选择性记忆/遗忘 |
| 选择性状态空间 | Selective State Space(S6) | Mamba 核心模块 |
| 隐藏状态 | Hidden State | SSM 中"压缩历史"的向量 |
| 线性注意力 | Linear Attention | 注意力去掉 softmax,变成线性计算 |
| 次二次方架构 | Sub-Quadratic Architecture | 计算复杂度低于 O(n²) 的架构 |
| 张量核 | Tensor Core | NVIDIA GPU 的矩阵加速单元 |
| 混合架构 | Hybrid Architecture | SSM + Attention 混合的层结构 |
| 长上下文 | Long Context | 100K+ 上下文窗口 |
| 循环神经网络 | Recurrent Neural Network(RNN) | 序列式推理的神经网络 |
| 因果卷积 | Causal Convolution | SSM 常用的局部特征提取 |
| 平移不变性 | Shift Invariance | SSM 核心属性,参数不依赖输入位置 |

---

## 三、SSD 理论核心

### 3.1 SSM 基础

- 连续形式:
  ```
  h'(t) = A·h(t) + B·x(t)   (状态转移)
  y(t)  = C·h(t) + D·x(t)   (输出)
  ```
  - A、B、C、D 是参数矩阵,h 是隐藏状态,x 是输入,y 是输出
  - 离散化后(HiPPO / S4 / S6)可作序列建模

### 3.2 Mamba-1 的 Selective SSM(S6)

- 关键创新:让 B、C、A **依赖输入** x(t)(不再是"平移不变")
- 带来"选择性记忆"能力,但破坏了 SSM 的卷积并行性
- 必须用 **selective scan** 算法(类似 RNN)逐步计算,难以用 Tensor Core

### 3.3 Mamba-2 / SSD 核心定理

- Dao & Gu(2024)证明:
  - **Selective SSM(2 阶) ≡ 半因果线性注意力**
  - 即:`y = SSD(x, A, B, C, Δ) = LinearAttention(x, Q=Q(x), K=K(x), V=V(x))`
  - 反之,带"特定 mask"的线性注意力可写成 SSM 形式

- **算法影响**:
  - SSM 现在可以用 Attention 的高效算法(scan 算法 + matmul 复用 Tensor Core)
  - 注意力层可以替换为 SSM,推理 O(n)
  - 二者数学上**等价**,只是**算法实现**不同

### 3.4 关键性能提升

| 维度 | Mamba-1 | Mamba-2 |
|---|---|---|
| **训练速度** | 1× | **2-8×** |
| **GPU 利用率** | 较低(无 Tensor Core) | 高(可用 Tensor Core) |
| **序列长度扩展** | O(n) | O(n) |
| **语言建模(2.8B)** | 与 Transformer 持平 | **追平/略超** Transformer |
| **长上下文(1M)** | 支持 | **支持 + 更稳定** |

---

## 四、模型族与变体

### 4.1 Mamba-2 基础模型(Princeton 2024-07)

- **Mamba-2 130M / 370M / 780M / 1.3B / 2.7B**(2024-07 开源)
- 在 Pile / The Stack 训练
- 在语言建模、推理、长上下文多基准与同尺寸 Transformer 持平

### 4.2 Jamba(AI21,2024-03)

- 首个商业 Mamba + Transformer 混合架构
- 论文:"Jamba: A Hybrid Transformer-Mamba Language Model"(AI21,2024)
- 7B active / 52B total MoE + 交替的 Mamba / Attention 层
- 256K 上下文

### 4.3 Codestral Mamba 2(Mistral,2024-07)

- **Codestral Mamba 7B**:Mamba-2 架构的代码模型
- Apache 2.0,支持"无限上下文"(理论上)
- HumanEval ~75%

### 4.4 Zamba / Zamba 2(MosaicML → Databricks,2024)

- 7B 混合架构,Alternating Mamba / Attention
- 训练数据高效,Inference 速度快
- Zamba 2 引入 **shared transformer layers** 进一步优化

### 4.5 Bamba / IBM(2024-09)

- IBM Research + Princeton 合作,9B Mamba-2
- 与 Llama 3.1 8B 在多项基准持平,推理速度快 2×

### 4.6 Falcon Mamba(TII,2024-08)

- **Falcon Mamba 7B**:基于 Mamba-2 架构
- 训练数据 7T tokens
- Apache 2.0,长上下文(>1M)表现稳定

### 4.7 Nemotron-H(NVIDIA,2025-01)

- NVIDIA 推出的 Mamba-2 + Attention 混合架构
- 56B/47B active MoE,推理速度对标 Llama 3.1 70B,显存仅 1/3

### 4.8 混合架构理论(2024-2025)

- 业界共识:**全 SSM 全 Attention 各有局限,最佳实践是混合**
  - 2:1 / 3:1 / 4:1(SSM:Attention)是常见配置
  - 底层用 Mamba 处理"长程、平滑"信息
  - 上层用 Attention 处理"关键 token 检索"

---

## 五、模型矩阵对比(2026-02 快照)

| 模型 | 参数量 | 架构 | 上下文 | 许可证 | 定位 |
|---|---|---|---|---|---|
| **Mamba-2 2.7B** | 2.7B | 纯 Mamba-2 | 2K | Apache 2.0 | 原生基座 |
| **Jamba 1.5 Large** | 52B/12B | Mamba+Attn+MoE | 256K | 商业 | 商业混合旗舰 |
| **Codestral Mamba 2 7B** | 7B | 纯 Mamba-2 | 128K | Apache 2.0 | 代码模型 |
| **Zamba 2 7B** | 7B | Mamba+Attn | 8K | Apache 2.0 | 训练高效 |
| **Bamba 9B** | 9B | Mamba+Attn | 8K | 研究 | IBM 混合 |
| **Falcon Mamba 7B** | 7B | 纯 Mamba-2 | >1M | Apache 2.0 | 长上下文 SOTA |
| **Nemotron-H 56B** | 56B/47B | Mamba+Attn+MoE | 128K | 商业 | 推理优化旗舰 |
| **Jamba 1.6(2025-06)** | 94B/12B | Mamba+Attn+MoE | 256K | 商业 | 商业混合旗舰 |

---

## 六、关键能力与生态

### 6.1 训练框架

- **mamba-ssm**(官方 PyTorch 实现)[github.com/state-spaces/mamba](https://github.com/state-spaces/mamba)
- **mamba.py**(David Rein 简化版)
- **NeurIPS-Scaling-Mamba**(LLM 训练代码)

### 6.2 推理优化

- **TensorRT-LLM**:已支持 Mamba-2
- **vLLM**:已支持(Mamba-2 kernel)
- **SGLang**:支持 Mamba-2 推理
- **llama.cpp / GGUF**:Mamba-2 量化支持(2025-01 起)
- **MLX**(Apple Silicon):原生 Mamba-2 支持

### 6.3 微调

- **LoRA / QLoRA**:**不完全支持**(Mamba 状态需特殊处理)
- **TRL(HF)**:对 Mamba-2 提供了 SFT 支持,RLHF 仍有限
- **Axolotl**:支持 Mamba-2 全参 + LoRA 微调

### 6.4 显存与速度对比(2.7B 规模)

| 指标 | Transformer | Mamba-1 | Mamba-2 |
|---|---|---|---|
| **训练速度** | 1× | 0.6× | **2-8×** |
| **推理速度(2K)** | 1× | 1.2× | 1.5× |
| **推理速度(128K)** | 0.05× | 1× | **1.2×** |
| **KV 显存** | O(n²) | O(1) | **O(1)** |
| **生成速度** | O(n²) | O(n) | **O(n)** |

---

## 七、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **架构选型** | "全 Attention"→"混合(Attention + SSM)"已是大势所趋 |
| **Mamba 商业化** | AI21 Jamba、Codestral Mamba、Falcon Mamba 已是商业产品 |
| **Jamba 进展** | AI21 2025-06 发布 Jamba 1.6(94B/12B),256K 上下文,商用对话 SOTA |
| **训练基础设施** | TPU v5e/v6、Hopper GPU(WGMMA 指令)对 Mamba-2 优化成熟 |
| **生态成熟度** | 2024-2025 主要框架(vLLM / TRT-LLM / HF)已支持 Mamba-2 |
| **NVIDIA 押注** | Nemotron-H 系列明确 Mamba-2 + Attention 混合是"后 Transformer"路线 |
| **学术研究** | Stanford、Princeton、CMU 持续在"长序列建模"方向深耕,SSD 理论已应用到多模态(VideoMamba) |
| **竞品** | RWKV-7(2025-10)、RetNet、Hyena、Striped Hyena、Griffin |

---

## 八、生产最佳实践

1. **长上下文场景首选 Mamba-2 / Falcon Mamba 7B**:>128K 上下文推理显存仅 O(n),Transformer KV 显存 O(n²) 不可行。
2. **混合架构是主流**:不要全 SSM 也不要全 Attention,用 2:1~4:1 配比。
3. **微调谨慎**:LoRA/QLoRA 对 Mamba-2 支持有限,优先全参或 PEFT 厂商支持的方案。
4. **推理框架选 vLLM / TensorRT-LLM**:已稳定支持,Hopper 架构 WGMMA 指令加速。
5. **端侧部署选 Codestral Mamba 2**:7B 模型 GGUF Q4 量化,iPhone 15 Pro 可跑。
6. **生产代码仍是 Attention 主流**:Mamba-2 在代码任务尚未稳超同尺寸 Transformer,谨慎评估。
7. **关注新模型**:Jamba 1.6、Falcon Mamba 2、Nemotron-H 是商业部署可选项。

---

## 九、See Also(官方源)

### 核心论文

- Mamba-1 [arxiv.org/abs/2312.00752](https://arxiv.org/abs/2312.00752)
- **Mamba-2 / SSD(核心论文)**[arxiv.org/abs/2405.21060](https://arxiv.org/abs/2405.21060)
- Structured State Space Duality(算法视角)[arxiv.org/abs/2407.04071](https://arxiv.org/abs/2407.04071)
- Jamba(混合架构)[arxiv.org/abs/2403.19887](https://arxiv.org/abs/2403.19887)
- Hyena(替代方案)[arxiv.org/abs/2302.10866](https://arxiv.org/abs/2302.10866)
- RWKV-7 [arxiv.org/abs/2503.14456](https://arxiv.org/abs/2503.14456)

### 官方仓库

- Mamba 官方代码 [github.com/state-spaces/mamba](https://github.com/state-spaces/mamba)
- Mamba-2 官方代码 [github.com/state-spaces/mamba](https://github.com/state-spaces/mamba)(同 repo)
- Jamba 商业模型 [docs.ai21.com](https://docs.ai21.com/)
- Falcon Mamba [github.com/tiiuae/Falcon](https://github.com/tiiuae/Falcon)
- Codestral Mamba [github.com/mistralai](https://github.com/mistralai)

### 博客与教程

- Tri Dao 解读 [tridao.me/blog/2024/mamba2-part1-modeling](https://tridao.me/blog/2024/mamba2-part1-modeling/)
- Albert Gu 解读 [goombalab.github.io/blog/2024/mamba2-part1-math](https://goombalab.github.io/blog/2024/mamba2-part1-math/)
- Hugging Face Mamba-2 文档 [huggingface.co/docs/transformers/model_doc/mamba2](https://huggingface.co/docs/transformers/model_doc/mamba2)

---

## 十、相关概念卡

- [[概念/mamba|Mamba]]
- [[概念/LLM/transformer-architecture|Transformer]]
- [[概念/long-context-llm|Long Context Llm]]
- [[概念/LLM/attention-variants|Linear Attention]]
- [[概念/flash-attention-kernels|Flash Attention Kernels]]
- [[概念/llm-architectures|Llm Architectures]]
- [[概念/LLM/state-space-models|State Space Model]]
- [[概念/gemma-series|Gemma Series]]
- [[概念/mistral-series|Mistral Series]]
