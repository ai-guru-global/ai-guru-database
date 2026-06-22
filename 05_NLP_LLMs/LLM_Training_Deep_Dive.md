---
title: "LLM 训练深度剖析：预训练、分布式训练与对齐"
category: 05-nlp-llms
tags: ["pretraining", "autoregressive-LM", "masked-LM", "scaling-laws", "distributed-training", "data-parallel", "tensor-parallel", "pipeline-parallel", "ZeRO", "activation-checkpointing", "mixed-precision", "SFT", "RLHF", "DPO", "LoRA", "PEFT"]
summary: "> 从预训练目标（自回归/掩码 LM）到规模定律，从分布式训练四维并行（数据/张量/流水线/ZeRO）到混合精度与激活检查点，再到对齐三阶段（SFT→RLHF→DPO）与参数高效微调（LoRA/QLoRA），系统覆盖 LLM 训练全链路。"
source: "_sources/yeasy/llm_internals/ (Ch5-8)"
created: 2026-06-17
updated: 2026-06-17
---

# LLM 训练深度剖析：预训练、分布式训练与对齐

> **核心链路**: 预训练（学会语言）→ 分布式训练（解决规模问题）→ SFT（学会对话格式）→ RLHF/DPO（对齐人类偏好）→ PEFT/LoRA（降低微调门槛）

---

## TL;DR

- **自回归 LM**: 预测下一个词元，迫使模型学习语法/语义/知识/推理，GPT/Llama/DeepSeek 均采用
- **规模定律**: $L(N) \propto N^{-0.076}$，性能与参数/数据/计算量呈可预测幂律关系；Chinchilla 指出模型与数据应同比例增长
- **3D 并行**: 节点内张量并行（NVLink）+ 跨节点流水线并行（InfiniBand）+ 数据并行/ZeRO
- **ZeRO**: 分片优化器状态/梯度/参数，消除数据并行的显存冗余
- **SFT → RLHF → DPO**: 对齐三阶段演进，DPO 将奖励模型数学吸收到策略优化中，大幅简化训练
- **LoRA/QLoRA**: 低秩适配 + 4-bit 量化，单卡消费级 GPU 即可微调 65B 模型

---

## 关联文档

- [[05_NLP_LLMs/Transformer_Deep_Dive]] — Transformer 核心架构
- [[05_NLP_LLMs/LLM_Inference_Deep_Dive]] — 推理优化
- [[05_NLP_LLMs/LLM_Architecture_Evolution]] — 架构演进
- [[05_NLP_LLMs/Fine_tuning_Techniques/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail]] — LoRA/RLHF/DPO 实战
- [[05_NLP_LLMs/Fine_tuning_Techniques/PEFT_Advanced_2026]] — PEFT 前沿

---

## 1. 预训练范式

### 1.1 自回归语言模型（Autoregressive LM）

$$\mathcal{L} = -\sum_{t=1}^{n} \log P(x_t | x_1, x_2, \dots, x_{t-1})$$

**为什么"预测下一个词"能学到知识**:
- "法国的首都是___" → 需要**世界知识**
- "如果 x > 5 且 x < 10，那么___" → 需要**逻辑推理**
- 完美预测需要理解语言的所有层面，因此语言建模是通用的无监督学习信号

**架构**: 使用带因果掩码的 Transformer 解码器，训练和推理在数学上完全一致——训练时可并行计算所有位置的损失，推理时逐步生成。

### 1.2 掩码语言模型（Masked LM）

BERT 的方案：随机遮盖 15% 词元（80% [MASK] / 10% 随机词 / 10% 不变），让模型用双向上下文预测。

| 特性 | 自回归 LM | 掩码 LM |
|------|----------|---------|
| 上下文方向 | 单向（左→右） | 双向 |
| 训练效率 | 每个词元贡献损失 | 仅 15% 贡献 |
| 适合任务 | 文本生成 | 自然语言理解 |
| 代表模型 | GPT, Llama | BERT, RoBERTa |

### 1.3 规模定律（Scaling Laws）

$$L(N) \propto N^{-\alpha_N}, \quad L(D) \propto D^{-\alpha_D}, \quad L(C) \propto C^{-\alpha_C}$$

**Kaplan et al. (2020)**: 模型越大/数据越多/训练越充分，性能越好——改善可预测、连续。

**Chinchilla (2022)**: 给定固定计算预算，模型参数量和训练数据量应**同比例增长**（$N \propto C^{0.5}$，$D \propto C^{0.5}$）。许多大模型实际"过大欠训练"。

**现代修正**: Llama 3 (8B) 使用 15T 词元（约 1875 词元/参数），远超 Chinchilla 估计。DeepSeek-V3 等实践表明：用远超 Chinchilla 最优比例的数据训练，虽不满足训练期计算最优，但在**推理成本受限**场景下总体经济效益更好——训练计算的一次性投入可通过降低推理长期成本摊销。

### 1.4 数据质量

- **去重**: 防止模型过拟合重复内容
- **过滤**: 分类器评估文本质量，过滤低质内容
- **领域混合**: 增加代码数据比例可提升推理能力
- **数据治理**: 记录来源、许可、版本，满足版权和隐私审查

---

## 2. 分布式训练

### 2.1 数据并行（Data Parallelism）

每张 GPU 持有完整模型副本，处理不同数据子集，通过 AllReduce 同步梯度。

**通信优化**: Ring AllReduce 将每卡通信量从 $O(KM)$ 降至 $O(M)$（与 GPU 数基本无关）。PyTorch DDP 通过梯度桶化 + 计算-通信重叠进一步优化。

**局限**: 70B 模型（FP16）仅参数需 140GB，加上优化器状态约 1.12TB——远超单卡显存。

### 2.2 ZeRO（零冗余优化器）

消除数据并行中每张 GPU 的完整模型状态冗余拷贝：

| 阶段 | 分片内容 | 显存节省 | 性能开销 |
|------|---------|---------|---------|
| ZeRO-1 | 优化器状态 | ~4x | 几乎无 |
| ZeRO-2 | + 梯度 | ~8x | 几乎无 |
| ZeRO-3 | + 参数 | 线性于 GPU 数 | 约 10-20% |

ZeRO-1/2 通信量与 DDP 相同（不同原语但总量等价），ZeRO-3 需额外 AllGather 但通过参数预取控制开销。PyTorch FSDP 是 ZeRO-3 的官方实现。

### 2.3 张量并行（Tensor Parallelism）

**核心**: 将单层权重矩阵切分到多张 GPU 上。Megatron-LM 的精髓是将相邻矩阵"一列一行"成对切分：
- FFN: $W_1$ 按列切 → GeLU 独立计算（无需通信）→ $W_2$ 按行切 → 一次 AllReduce
- 每个 Transformer 层前向仅需 **2 次 AllReduce**（注意力 + FFN 各一次）

**通信约束**: 仅限节点内（NVLink ~900 GB/s），跨节点 InfiniBand (~100 GB/s) 延迟过高。

### 2.4 流水线并行（Pipeline Parallelism）

将模型不同层分配到不同 GPU。微批量调度减少气泡：
$$\text{bubble\_ratio} \approx \frac{p-1}{p-1+m}$$

当 $m \gg p$ 时气泡趋近于零。1F1B 调度（前向/反向交替）将激活显存与微批量数解耦。

### 2.5 3D 并行策略

```
节点内: 张量并行 (4-8路, NVLink)
节点间: 流水线并行 (2-8路, InfiniBand)
全局:   数据并行 / ZeRO (扩展吞吐)
```

超长上下文训练还可引入第四维度——**序列/上下文并行**（Ring Attention）。

### 2.6 激活重计算（Activation Checkpointing）

前向传播中丢弃段内中间激活，反向传播时重新计算。均匀检查点将显存从 $O(L)$ 降至 $O(\sqrt{L})$，代价约 20-50% 额外前向计算。

**选择性重计算**: 只对"显存大但重算快"的操作（Softmax/Dropout）重算，"显存小但计算慢"的（矩阵乘法）保留。

### 2.7 混合精度训练

| 精度 | 位宽 | 特点 |
|------|------|------|
| FP32 | 32 bit | 全精度基准 |
| FP16 | 16 bit | 需损失缩放防下溢 |
| **BF16** | 16 bit | 与 FP32 同数值范围，不需损失缩放，当前主流 |
| FP8 | 8 bit | H100/H200 支持，需 per-tensor 动态缩放 |

标准流程：FP16/BF16 前向 + 反向，FP32 master weights 更新，再截断回低精度。

---

## 3. 对齐（Alignment）

### 3.1 监督微调（SFT）

在高质量**指令-回答对**上训练，教会模型"收到指令 → 生成回答"的映射模式。

- 损失只在回答部分计算（指令不参与）
- 学习率远小于预训练（~1e-5 vs 1e-4）
- **LIMA 论文**: 仅 1000 条精心编写的示例即可获得接近数万条数据的效果
- SFT 没有"教"新知识，而是激活并重组预训练已学到的能力

### 3.2 RLHF（基于人类反馈的强化学习）

**三阶段流程**:
1. **SFT**: 获得基本对话能力
2. **训练奖励模型**: 人类标注偏好对 → 训练 RM 预测偏好分数
3. **PPO 优化**: 以 RM 分数为奖励信号优化策略，KL 约束防偏离

**PPO 的裁剪目标**:
$$\max_\theta \mathbb{E}_t \left[\min\left(\frac{\pi_\theta}{\pi_{\text{old}}} A_t, \; \text{clip}\left(\frac{\pi_\theta}{\pi_{\text{old}}}, 1-\epsilon, 1+\epsilon\right) A_t\right)\right]$$

**挑战**: 需同时管理 4 个模型（策略/参考/奖励/价值），PPO 超参数敏感，奖励模型可能学到表面模式。

### 3.3 DPO（直接偏好优化）

**核心洞察**: 奖励模型可被数学"吸收"到策略优化目标中，完全省去 RM 训练和 PPO。

$$\mathcal{L}_{\text{DPO}} = -\log \sigma\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)$$

**推导三步**:
1. Bradley-Terry 偏好模型: $P(y_1 \succ y_2) = \sigma(r(x,y_1) - r(x,y_2))$
2. KL 约束最优策略解析解: 反解 $r(x,y)$ 为 $\beta \log \frac{\pi^*(y|x)}{\pi_{\text{ref}}(y|x)} + \beta \log Z(x)$
3. 代入消除: $Z(x)$ 在奖励差中相消，直接用策略对数概率比替代 RM

**优势**: 显存只需 2 个模型（vs PPO 的 4 个），无需 PPO 超参调优，训练稳定。

**更多方法**: GRPO（组内标准化优势，无需价值网络）、KTO（二元标注）、Constitutional AI（AI 自我评估）。

---

## 4. 参数高效微调（PEFT）

### 4.1 LoRA（低秩适配）

$$W = W_0 + \Delta W = W_0 + BA, \quad B \in \mathbb{R}^{d \times r}, A \in \mathbb{R}^{r \times d}, r \ll d$$

冻结 $W_0$，只训练 $A$ 和 $B$，参数量从 $d^2$ 降至 $2dr$，减少数百倍。

**核心假设**: 微调中权重变化 $\Delta W$ 是低秩的——大模型的微调在低维子空间中进行。

| 秩 $r$ | 适用场景 |
|--------|---------|
| 4 | 简单领域适配/风格调整 |
| 8-16 | 大多数指令微调（最常用） |
| 32-64 | 复杂任务/大幅调整模型行为 |

**应用层**: 在所有线性层（注意力 + FFN）低秩应用 > 在少数层高秩应用。

### 4.2 LoRA 变体

- **DoRA (2024)**: 将权重分解为幅度 $m$ + 方向 $\hat{W}$，分别适配，更精确模拟全参数微调
- **LoRA+ (2024)**: $A$ 和 $B$ 使用不同学习率（$B$ 的学习率是 $A$ 的数倍）
- **rsLoRA**: 引入 $1/\sqrt{r}$ 缩放，解决大秩性能下降

### 4.3 QLoRA

将冻结基础模型量化到 4-bit（NF4），LoRA 在 16-bit 下训练。65B 模型可在单卡 48GB GPU 上微调，效果与 16-bit 基线几乎无差异。

### 4.4 各方法对比

| 方法 | 可训练参数 | 显存需求 | 效果 |
|------|-----------|---------|------|
| 全参数微调 | 100% | 极高 | 最优 |
| LoRA (r=16) | ~0.1% | 低 | 接近全参数 |
| DoRA (r=16) | ~0.1% | 低 | 略优于 LoRA |
| QLoRA | ~0.1% | 极低 | 接近 LoRA |

**生产实践**: LoRA 合并（部署时无额外开销）、多 LoRA 服务（同一基础模型动态切换 adapter）、LoRA 堆叠（知识 + 风格组合）。

---

## 参考来源

- 原始书籍: `_sources/yeasy/llm_internals/05_pretraining/` (Ch5: 预训练)
- 原始书籍: `_sources/yeasy/llm_internals/06_training_techniques/` (Ch6: 训练技术)
- 原始书籍: `_sources/yeasy/llm_internals/07_distributed_training/` (Ch7: 分布式训练)
- 原始书籍: `_sources/yeasy/llm_internals/08_alignment/` (Ch8: 对齐)
