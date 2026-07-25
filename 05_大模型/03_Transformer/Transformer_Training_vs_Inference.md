---
tier: supporting
title: Transformer 在大模型训练与推理中的应用
tags:
  - transformer
  - llm
  - training
  - inference
  - decoding
  - sft
  - rlhf
  - mixed-precision
  - kv-cache
  - beam-search
  - distributed-training
  - dpo
  - grpo
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# Transformer 在大模型训练与推理中的应用

## 一句话结论

Transformer 是 LLM 的**基础架构**，既用于训练时学习知识，也用于推理时运用知识；**训练得到参数，推理使用参数**。两个阶段的网络结构相同，但计算流程、优化目标和工程重点完全不同。

---

## 目录

1. [训练 vs 推理：宏观对比](#训练阶段-vs-推理阶段)
2. [Transformer 核心机制回顾](#transformer-核心机制回顾)
3. [训练阶段详解](#训练阶段详解)
4. [推理阶段详解](#推理阶段详解)
5. [推理解码策略](#推理解码策略)
6. [训练关键技术](#训练关键技术)
7. [性能优化工程实践](#性能优化工程实践)
8. [评估与调参建议](#评估与调参建议)
9. [总结速查表](#总结速查表)
10. [延伸阅读与参考](#延伸阅读与参考)

---

## 训练阶段 vs 推理阶段

| 维度 | 训练阶段 | 推理阶段 |
|---|---|---|
| **目标** | 通过大量数据学习模型参数 | 用已训练好的模型生成输出 |
| **是否更新权重** | ✅ 是，反向传播更新参数 | ❌ 否，权重固定 |
| **是否使用标签** | ✅ 是，用 (输入, 目标输出) 对 | ❌ 否，只有输入 prompt |
| **计算重点** | 前向传播 + 反向传播 + 优化 | 主要是前向传播 + 解码策略 |
| **并行性** | 可高度并行，一次性处理整个序列 | 通常是自回归逐 token 生成，并行度较低 |
| **显存占用** | 大（参数 + 梯度 + 优化器状态 + 激活值） | 相对小，但随序列长度增长 |
| **典型技术** | 预训练、SFT、RLHF、混合精度、分布式训练 | KV Cache、贪心/采样解码、温度缩放、Top-p、Beam Search |
| **主要硬件瓶颈** | 显存、通信带宽、计算 FLOPs | 显存带宽、解码延迟、吞吐量 |

### 训练时：并行处理

训练时，输入是一整段文本，模型通过 **Self-Attention** 一次性看到所有 token，并用 **因果掩码（Causal Mask）** 防止看到未来的 token，从而并行计算每个位置的预测损失。

数学上，训练目标是最大化下一个 token 的似然：

```
L = - sum_t log P(t_t | t_1, t_2, ..., t_{t-1}; θ)
```

其中 `θ` 是模型参数，通过反向传播和优化器（如 AdamW）更新。

### 推理时：自回归生成

推理通常按以下步骤进行：

1. 输入 prompt，模型生成第一个 token；
2. 将生成的 token 拼回输入，继续生成下一个 token；
3. 重复直到遇到结束符 `<|endoftext|>`、`<|im_end|>` 或达到最大生成长度。

为了加速，推理时通常使用 **[[概念/kv-cache|KV Cache]]**，避免对已经计算过的 token 重复计算 key/value。

---

## Transformer 核心机制回顾

### 1. Self-Attention（自注意力）

Transformer 的核心是 Scaled Dot-Product Attention：

```
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V
```

- **Q（Query）**：当前 token 在问“我需要关注哪些信息”。
- **K（Key）**：每个 token 提供“我是什么信息”的标识。
- **V（Value）**：每个 token 提供的实际内容。
- **sqrt(d_k)**：缩放因子，防止点积过大导致 softmax 梯度消失。

在因果语言模型中，会对未来位置施加 `-inf` 掩码，确保模型只能看到当前及之前的 token。

### 2. Multi-Head Attention（多头注意力）

将 Q、K、V 投影到多个子空间，分别计算注意力，再拼接：

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O
```

- 不同头可以关注不同的语言模式（语法、语义、指代、位置等）。
- 现代大模型通常有 16、32、64 甚至更多头。

### 3. Feed-Forward Network（FFN）

每个 Transformer 层包含一个前馈网络：

```
FFN(x) = max(0, xW_1 + b_1) W_2 + b_2
```

现代变体常用 SwiGLU：

```
SwiGLU(x) = (xW ⊙ SiLU(xV)) W_2
```

FFN 占模型参数的大部分，是模型“记忆”知识的主要载体。

### 4. Layer Normalization & Residual Connection

- **残差连接**：缓解梯度消失，支持深层网络训练。
- **层归一化**：稳定训练动态，现代模型常用 **RMSNorm**。

### 5. Position Encoding（位置编码）

由于 Attention 本身对位置不敏感，需要显式注入位置信息：

| 类型 | 说明 |
|---|---|
| **绝对位置编码** | 原始 Transformer 使用正弦/余弦函数 |
| **可学习位置编码** | BERT、GPT 使用可学习的位置嵌入 |
| **旋转位置编码（RoPE）** | LLaMA、Qwen、ChatGLM 等主流模型使用，将位置信息融入 Q/K |
| **ALiBi** | 通过惩罚远距离注意力实现外推 |

---

## 训练阶段详解

### 1. 预训练（Pre-training）

**目标**：在大规模无标注文本上学习通用语言表示和世界知识。

- **数据**：网页、书籍、代码、论文、对话等。
- **任务**：自回归语言建模（Next Token Prediction）。
- **数据量**：通常数千亿到数万亿 token。
- **计算量**：占模型训练成本的绝大部分。

#### 预训练三要素

| 要素 | 说明 |
|---|---|
| **数据质量** | 去重、过滤低质内容、平衡领域分布 |
| **数据配比** | 代码、百科、网页、书籍等的比例显著影响模型能力 |
| **训练稳定性** | 学习率调度、梯度裁剪、损失尖峰处理 |

### 2. 持续预训练（Continued Pre-training）

在通用预训练后，继续在某些领域数据（如法律、医疗、金融）上训练：

- **用途**：提升特定领域知识、术语理解。
- **注意**：学习率通常比预训练小 1~2 个数量级，避免灾难性遗忘。

### 3. 监督微调（SFT）

**目标**：让模型学会遵循指令、按期望格式输出。

- **数据形式**：高质量 `(prompt, response)` 对。
- **数据来源**：人工标注、合成数据、蒸馏数据。
- **训练目标**：标准语言建模损失，只计算 response 部分的损失。

```python
# SFT 损失计算示意
loss = -log P(response | prompt; θ)
```

**数据质量原则**：

- 多样性：覆盖多种任务类型、长度、风格。
- 准确性：标注错误会直接传授给模型。
- 格式一致性：指令模板、特殊 token 需统一。

### 4. 基于人类反馈的强化学习（RLHF）

**目标**：让模型输出更符合人类偏好（有用、无害、诚实、风格一致）。

#### 三阶段流程

1. **SFT 模型**：得到初始策略模型。
2. **训练奖励模型（Reward Model）**：
   - 对同一 prompt 采样多个回答；
   - 人类标注偏好顺序；
   - 训练 RM 预测人类偏好。
3. **强化学习微调**：
   - 使用 PPO 优化策略模型；
   - 目标：最大化 RM 分数，同时用 KL 散度约束偏离 SFT 模型的程度。

```
J(θ) = E[R(x, y)] - β KL(π_θ(y|x) || π_SFT(y|x))
```

#### RLHF 的替代方案

| 方法 | 核心思想 | 优点 |
|---|---|---|
| **DPO** | 直接用偏好数据优化策略，无需显式奖励模型 | 更简单、更稳定 |
| **IPO** | 对 DPO 的改进，缓解过拟合 | 偏好数据利用更高效 |
| **KTO** | 只需要二元偏好（好/坏）| 降低标注成本 |
| **GRPO** | DeepSeek 提出的组相对策略优化 | 无需价值函数，节省显存 |

### 5. 训练中的优化器与学习率

| 组件 | 常见选择 | 说明 |
|---|---|---|
| **优化器** | AdamW | 带权重衰减的自适应优化器 |
| **学习率调度** | Warmup + Cosine Decay | 先线性 warmup，再余弦衰减 |
| **Batch Size** | 大 batch（百万级 token）| 需要配合学习率缩放 |
| **梯度裁剪** | clip_grad_norm | 防止梯度爆炸 |
| **正则化** | Dropout、Weight Decay | 防止过拟合 |

### 6. 分布式训练

大模型训练必须分布式进行：

| 并行策略 | 切分对象 | 解决的问题 |
|---|---|---|
| **数据并行（DP）** | 数据 batch | 加速训练 |
| **模型并行（MP）** | 模型层/参数 | 单卡放不下模型 |
| **张量并行（TP）** | 每层参数 | 单卡放不下某一层 |
| **流水线并行（PP）** | 不同层 | 提升设备利用率 |
| **序列并行（SP）** | 序列维度 | 长序列训练 |
| **Zero（FSDP）** | 优化器状态/梯度/参数 | 减少显存占用 |

主流框架：`Megatron-LM`、`DeepSpeed`、`FSDP`、`vLLM`（推理为主）。

---

## 推理阶段详解

### 1. 自回归生成流程

```python
# 伪代码
input_ids = tokenizer.encode(prompt)
for _ in range(max_new_tokens):
    logits = model(input_ids)  # 前向传播
    next_token_id = decode(logits[:, -1, :])  # 选择下一个 token
    input_ids.append(next_token_id)
    if next_token_id == eos_token_id:
        break
```

### 2. KV Cache

**问题**：自回归生成时，每一步都要重新计算所有历史 token 的 Key 和 Value，造成大量重复计算。

**解决方案**：缓存之前 token 的 K 和 V，下一步只计算新 token 的 K/V，再拼接。

```
# 第 t 步
K_t = Concat(K_1, K_2, ..., K_t)
V_t = Concat(V_1, V_2, ..., V_t)
Attention_t = softmax(Q_t K_t^T / sqrt(d_k)) V_t
```

**KV Cache 的显存占用**：

```
Cache ≈ 2 × num_layers × num_heads × head_dim × batch_size × seq_len × bytes_per_value
```

- 长上下文推理时，KV Cache 可能成为显存瓶颈。
- 优化方向：**[[概念/paged-attention|PagedAttention]]**（vLLM）、**MQA（Multi-Query Attention）**、**GQA（Grouped-Query Attention）**。

### 3. 推理中的关键指标

| 指标 | 说明 | 优化方向 |
|---|---|---|
| **TTFT（Time To First Token）** | 首个 token 返回时间 | 减少预填充计算、提升并行 |
| **TPOT（Time Per Output Token）** | 每个生成 token 的时间 | KV Cache 优化、低精度量化、解码批处理 |
| **Throughput** | 单位时间生成的 token 数 | Continuous Batching、Speculative Decoding |
| **Latency** | 端到端延迟 | 模型量化、蒸馏、服务调度 |

---

## 推理解码策略

### 1. 贪心解码（Greedy Decoding）

**原理**：每一步都选择概率最高的 token。

```
t_t = argmax P(t_t | t_1, t_2, ..., t_{t-1})
```

| 优点 | 缺点 | 适用场景 |
|---|---|---|
| 确定性强、输出稳定 | 容易陷入局部最优、重复单调 | 代码生成、数学推理、事实问答 |

### 2. 束搜索（Beam Search）

**原理**：每一步保留概率最高的 `k` 个候选序列，逐步扩展。

```
# beam width = k
at each step:
  expand each of k beams with all possible next tokens
  keep top-k sequences by cumulative log probability
```

| 优点 | 缺点 | 适用场景 |
|---|---|---|
| 比贪心解码质量好 | 计算量增加、可能生成不自然文本 | 机器翻译、摘要、结构化输出 |

### 3. 采样解码（Sampling Decoding）

**原理**：按模型输出的概率分布随机抽取下一个 token。

| 优点 | 缺点 |
|---|---|
| 生成自然、多样、有创造性 | 随机性过强可能导致不连贯或跑题 |

通常配合 Temperature、Top-k、Top-p 使用。

### 4. 温度缩放（Temperature Scaling）

在 softmax 前将 logits 除以 `T`：

```
P(t_i) = exp(z_i / T) / sum_j exp(z_j / T)
```

| 温度 | 效果 | 推荐场景 |
|---|---|---|
| `T → 0` | 趋近贪心解码 | 确定性任务 |
| `T = 1` | 保持原分布 | 通用场景 |
| `T < 1`（0.3~0.7）| 分布更尖锐，输出保守 | 代码、数学、推理 |
| `T > 1`（0.8~1.2）| 分布更平缓，输出多样 | 创意写作、头脑风暴 |

### 5. Top-k 采样

**原理**：只从概率最高的前 `k` 个 token 中采样。

- `k = 1` 等价于贪心解码。
- `k` 越大，候选越多，多样性越强。
- **缺点**：固定 `k` 不够灵活，概率分布平坦时可能纳入很多低质 token。

### 6. Top-p 采样（Nucleus Sampling）

**原理**：从累积概率达到 `p` 的最小 token 集合中采样。

例如 `p = 0.9`：

1. 按概率从高到低排序；
2. 选择前 `n` 个 token，使累积概率 ≥ 0.9；
3. 在这 `n` 个 token 中按重新归一化概率采样。

| 优点 | 常见取值 |
|---|---|
| 动态调整候选集，平衡质量与多样性 | `p = 0.9 ~ 0.95` |

**Top-k vs Top-p**：

| 方法 | 调整方式 | 灵活性 |
|---|---|---|
| Top-k | 固定候选数量 | 低 |
| Top-p | 按概率质量动态截断 | 高 |

### 7. 重复惩罚（Repetition Penalty）

**原理**：降低已经生成过的 token 的概率，避免重复。

```
P'(t_i) = P(t_i) / repetition_penalty  if t_i in generated_tokens
```

- 常见取值：`1.0 ~ 1.2`。
- 过高会导致模型避开正常词汇，输出不自然。

### 8. 推测解码（Speculative Decoding）

**原理**：用一个小的草稿模型（draft model）快速生成候选 token，再用大模型一次性验证。

| 优点 | 挑战 |
|---|---|
| 可显著加速推理 | 草稿模型与大模型需匹配，验证本身有开销 |

### 9. 常见解码参数组合

| 场景 | temperature | top_p | top_k | repetition_penalty |
|---|---|---|---|---|
| 代码生成 | 0.2 ~ 0.4 | 0.95 | 40 | 1.0 ~ 1.1 |
| 数学推理 | 0.0 ~ 0.3 | 0.95 | 40 | 1.0 |
| 创意写作 | 0.8 ~ 1.2 | 0.9 ~ 1.0 | 50 ~ 100 | 1.0 ~ 1.1 |
| 对话聊天 | 0.6 ~ 0.9 | 0.9 | 50 | 1.1 ~ 1.2 |
| 知识问答 | 0.1 ~ 0.5 | 0.95 | 40 | 1.0 |

---

## 训练关键技术

### SFT（Supervised Fine-Tuning）

**原理**：在预训练模型基础上，用高质量 `(prompt, response)` 指令数据继续训练。

**关键要点**：

- 数据质量 > 数据数量。
- response 部分计算 loss，prompt 部分可 mask。
- 学习率通常比预训练低 10~100 倍。
- 需要统一 prompt 模板和 special token。

### RLHF

**奖励模型损失函数**：

```
L_RM = -E[log σ(r_θ(x, y_w) - r_θ(x, y_l))]
```

其中 `y_w` 是人类偏好的回答，`y_l` 是较差的回答。

**PPO 目标**：

```
J(θ) = E[R(x, y)] - β KL(π_θ || π_ref)
```

### DPO（Direct Preference Optimization）

直接优化策略模型，无需奖励模型：

```
L_DPO = -E[log σ(β log(π_θ(y_w|x) / π_ref(y_w|x)) - β log(π_θ(y_l|x) / π_ref(y_l|x)))]
```

- 更简单、训练更稳定。
- 已成为许多开源模型的首选对齐方法。

### 混合精度训练

**原理**：同时使用 FP16/BF16 和 FP32：

- **前向/反向**：FP16/BF16，加速计算、节省显存。
- **Master Weights**：FP32，保证更新精度。

**FP16 vs BF16 vs FP32**：

| 特性 | FP32 | FP16 | BF16 |
|---|---|---|---|
| 位宽 | 32 bit | 16 bit | 16 bit |
| 指数位 | 8 bit | 5 bit | 8 bit |
| 尾数位 | 23 bit | 10 bit | 7 bit |
| 动态范围 | 最大 | 较小 | 与 FP32 相同 |
| 精度 | 最高 | 较高 | 较低 |
| 显存占用 | 最大 | 最小 | 较小 |
| 稳定性 | 最稳定 | 需 Loss Scaling | 较稳定 |

**Loss Scaling 流程**：

1. 前向计算 loss；
2. loss 乘以 scale factor（如 2^16）；
3. 反向传播计算梯度；
4. 梯度除以 scale factor；
5. 检查是否有 inf/NaN，动态调整 scale。

**实现**：

```python
# PyTorch AMP 示例
from torch.cuda.amp import autocast, GradScaler
scaler = GradScaler()
with autocast():
    outputs = model(inputs)
    loss = criterion(outputs, targets)
scaler.scale(loss).backward()
scaler.step(optimizer)
scaler.update()
```

---

## 性能优化工程实践

### 训练优化

| 技术 | 作用 |
|---|---|
| **Gradient Checkpointing** | 用计算换显存，只保存部分激活值 |
| **FlashAttention** | 减少 Attention 的 HBM 访问，加速并省显存 |
| **DeepSpeed ZeRO** | 切分优化器状态、梯度、参数到多卡 |
| **LoRA / QLoRA** | 低秩适配，微调时只训练少量参数 |
| **数据并行 + 张量并行** | 扩展模型规模和训练速度 |

### 推理优化

| 技术 | 作用 |
|---|---|
| **KV Cache** | 避免重复计算历史 token |
| **PagedAttention** | 更高效管理 KV Cache，支持更大 batch |
| **Continuous Batching** | 动态批处理，提升 GPU 利用率 |
| **模型量化** | INT8/INT4/FP8 降低显存和计算 |
| **TensorRT-LLM / vLLM** | 高性能推理引擎 |
| **Speculative Decoding** | 用小模型加速大模型生成 |

---

## 评估与调参建议

### 训练评估指标

| 指标 | 说明 |
|---|---|
| **Perplexity（PPL）** | 困惑度，越低表示模型对文本预测越准确 |
| **Loss** | 训练/验证损失 |
| **BLEU / ROUGE** | 生成质量（机器翻译、摘要）|
| **Exact Match** | 问答、代码任务的精确匹配 |
| **Human Evaluation** | 人类偏好评估 |

### 推理评估指标

| 指标 | 说明 |
|---|---|
| **相关性 / 有用性** | 回答是否切题、有帮助 |
| **流畅性** | 语言是否自然通顺 |
| **事实准确性** | 是否包含幻觉或错误 |
| **安全性** | 是否有害、偏见、泄露隐私 |

### 调参检查清单

- [ ] 学习率是否过高导致 loss 发散？
- [ ] warmup 步数是否足够？
- [ ] batch size 是否充分利用 GPU？
- [ ] 是否使用了梯度裁剪？
- [ ] 数据是否有足够多样性和质量？
- [ ] 推理时 temperature/top_p 是否适合任务？
- [ ] 长序列时 KV Cache 是否成为显存瓶颈？

---

## 总结速查表

| 概念 | 一句话解释 |
|---|---|
| **Transformer** | 基于 Self-Attention 的序列建模架构，训练学和推理用 |
| **训练** | 用数据更新参数，目标是最大化下一个 token 概率 |
| **推理** | 用固定参数自回归生成 token |
| **KV Cache** | 缓存历史 K/V，避免重复计算，加速自回归解码 |
| **贪心解码** | 每步选概率最高的 token，确定性高但缺乏多样性 |
| **Beam Search** | 保留多个候选序列，逐步扩展，质量优于贪心 |
| **采样解码** | 按概率分布随机选 token，增加多样性但需控制随机性 |
| **温度缩放** | 调节 softmax 概率分布的尖锐/平缓程度 |
| **Top-k** | 只在前 k 个高概率 token 中采样 |
| **Top-p** | 从累积概率达 p 的最小 token 集合中采样，动态平衡质量与多样性 |
| **重复惩罚** | 降低已生成 token 的概率，减少重复 |
| **SFT** | 用高质量指令数据微调预训练模型，使其学会按指令回答 |
| **RLHF** | 用人类偏好训练奖励模型，再用强化学习优化模型输出 |
| **DPO** | 无需奖励模型，直接用偏好数据优化策略 |
| **混合精度训练** | 训练时用 FP16/BF16 加速省显存，用 FP32 保持权重更新稳定 |
| **FlashAttention** | 优化 Attention 内存访问模式，加速并降低显存 |
| **PagedAttention** | 将 KV Cache 分页管理，提升推理吞吐 |

---

## 延伸阅读与参考

### 学术论文

- Vaswani et al., "Attention Is All You Need" (2017)
- OpenAI InstructGPT / RLHF 论文
- Rafailov et al., "Direct Preference Optimization" (2023)
- DeepSeekMath / GRPO
- FlashAttention (Dao et al.)
- vLLM: PagedAttention
- Press et al., "ALiBi: Attention with Linear Biases" (2021)
- Hugging Face `transformers` 文档
- PyTorch AMP 官方教程

### 相关概念页

- [[概念/next-token-prediction|下一个 Token 预测]]
- [[概念/causal-mask|因果掩码]]
- [[概念/decoding-strategies|解码策略总览]]
- [[概念/greedy-decoding|贪心解码]]
- [[概念/beam-search|束搜索]]
- [[概念/sampling-decoding|随机采样]]
- [[概念/temperature-scaling|温度缩放]]
- [[概念/top-p-sampling|Top-p 采样]]
- [[概念/top-k-sampling|Top-k 采样]]
- [[概念/autoregressive-generation|自回归生成]]
- [[概念/pre-training|预训练]]
- [[概念/reward-modeling|奖励模型]]
- [[概念/perplexity|困惑度 PPL]]
- [[概念/alibi|ALiBi]]
- [[概念/ttft|TTFT]]
- [[概念/tpot|TPOT]]
- [[概念/decoding-strategies-decision-tree|解码策略决策树]]
- [[概念/llm-inference-checklist|推理上线检查清单]]
- [[概念/llm-training-checklist|训练检查清单]]
- [[概念/huggingface-generate-deep-dive|Hugging Face generate()]]
- [[概念/vllm-practical|vLLM 实战]]
- [[概念/tensorrt-llm-practical|TensorRT-LLM 实战]]
- [[概念/long-context-llm|长上下文 LLM]]
- [[概念/model-compression-methods|模型压缩方法对比]]
- [[概念/alignment-practical-pipeline|对齐实战 Pipeline]]
- [[概念/llama-series|LLaMA 系列]]
- [[概念/qwen-series|Qwen 系列]]
- [[概念/deepseek-series|DeepSeek 系列]]
- [[概念/gpt-series-evolution|GPT 系列演进]]
- [[概念/multimodal-llm|多模态 LLM]]
- [[概念/vision-language-model|视觉语言模型]]
- [[概念/tool-use|Tool Use]]
- [[概念/function-calling|Function Calling]]
- [[概念/react-agent|ReAct Agent]]
- [[概念/llm-benchmarks|LLM Benchmarks]]
- [[概念/llm-benchmarks-deep-dive|Benchmark 详解]]
- [[概念/prefill-decode-disaggregated|Prefill-Decode 分离]]
- [[概念/inference-cluster-scheduling|推理集群调度]]
- [[概念/llm-inference-cost-optimization|推理成本优化]]
- [[概念/test-time-compute|Test-Time Compute]]
- [[概念/world-models|World Models]]
- [[概念/neuro-symbolic-ai|Neuro-Symbolic AI]]
- [[概念/llm-papers-courses-index|论文与课程资源索引]]

---

> 关联索引：[[概念/llm-training-inference-key-concepts|LLM 训练与推理关键概念索引]]

## Related

- [[05_大模型/README|04 自然语言处理与大模型 (NLP & LLMs)]]
