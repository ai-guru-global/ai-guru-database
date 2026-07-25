---
title: "LoRA 与参数高效微调 (PEFT)"
category: -concepts
tags: ["lora", "peft", "fine-tuning", "parameter-efficient", "qlora", "adapter"]
relationships:
  - target: "概念/fine-tuning-techniques"
    type: belongs_to
  - target: "概念/lora-qlora-sft-rlhf-dpo"
    type: related_to
  - target: "概念/model-compression"
    type: complements
  - target: "概念/distributed-parallelism"
    type: reduces_need_for
  - target: "概念/dora"
    type: related_to
  - target: "概念/rs-lora"
    type: related_to
sources:
  - 05_大模型/07_Fine_tuning_Techniques/
  - 12_架构基建/AI_Stack_Deep_Dive.md
summary: "LoRA 通过低秩矩阵分解实现仅微调 <1% 参数，是 LLM 微调的主流方案。QLoRA 结合 4-bit 量化可在单卡 24GB GPU 上微调 70B 模型。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.92
lifecycle: reviewed
tier: core
created: 2026-06-04
updated: 2026-07-21
aliases:
  - "Lora Peft"
  - "lora peft"

---
# LoRA 与参数高效微调 (PEFT)

> 用 1% 的参数改动，获得 90% 的全量微调效果。

---

## 1. 定义

**PEFT**（Parameter-Efficient Fine-Tuning）是一类仅更新模型少量参数即可完成微调的技术族。代表方案：

| 方法 | 核心思想 | 参数量占比 |
|------|----------|-----------|
| **LoRA** | 低秩矩阵分解 ΔW = BA | 0.1-1% |
| **QLoRA** | 4-bit 量化 + LoRA | 0.1-1%（显存更小） |
| **DoRA** | 权重分解 LoRA（分离方向和幅度） | ~1% |
| **Adapter** | 插入小型适配器层 | 1-5% |
| **Prefix Tuning** | 训练可学习的前缀向量 | <0.1% |
| **Prompt Tuning** | 训练 soft prompt 嵌入 | <0.1% |

---

## 2. LoRA 原理

### 核心公式

全量微调更新权重矩阵 \(W_0 \in \mathbb{R}^{d \times k}\)：

\[
W = W_0 + \Delta W = W_0 + BA
\]

其中 \(B \in \mathbb{R}^{d \times r}\)，\(A \in \mathbb{R}^{r \times k}\)，\(r \ll \min(d, k)\)。

- **秩 r**：通常 8-64，控制可学习参数量
- **缩放因子 α**：\(\Delta W\) 乘以 \(\alpha/r\) 控制更新幅度
- **合并推理**：训练后可将 \(BA\) 合并回 \(W_0\)，**推理零开销**

```
全量微调:  W₀ (d×k) → W₀ + ΔW (d×k)     参数量: d×k
LoRA:     W₀ (冻结) + B(d×r) × A(r×k)    参数量: r×(d+k) << d×k

示例 (Llama-70B, r=16):
  全量微调: 140B 参数
  LoRA:     ~140M 参数 (0.1%)
```

---

## 3. 主流 PEFT 方法对比

| 方法 | 论文 | 优势 | 劣势 | 适用场景 |
|------|------|------|------|----------|
| **LoRA** | Hu et al. 2021 | 推理零开销，广泛支持 | 表达能力受限于秩 r | 通用微调 |
| **QLoRA** | Dettmers et al. 2023 | 显存降低 60% | 量化可能影响精度 | 单卡微调大模型 |
| **DoRA** | Liu et al. 2024 | 分解方向+幅度 | 略多参数 | 高精度微调 |
| **Adapter** | Houlsby et al. 2019 | 模块化，可插拔 | 推理有额外延迟 | 多任务切换 |
| **IA³** | Liu et al. 2022 | 极少参数（~0.01%） | 表达能力较弱 | 快速实验 |
| **Prompt Tuning** | Lester et al. 2021 | 不改模型结构 | 需要大模型才有效 | 超大规模模型 |

---

## 4. QLoRA：单卡微调 70B

QLoRA 是 LoRA + 4-bit 量化的组合：

| 技术 | 说明 |
|------|------|
| **NF4 量化** | 将基础模型量化为 4-bit NormalFloat |
| **双重量化** | 量化常数本身也被量化，进一步节省显存 |
| **分页优化器** | 内存不足时自动卸载到 CPU |
| **LoRA 适配器** | 仅训练 LoRA 参数（BF16） |

**显存需求对比**：

| 模型 | 全量微调 | LoRA (FP16) | QLoRA (4-bit) |
|------|----------|-------------|---------------|
| **7B** | 56 GB | 16 GB | 6 GB |
| **13B** | 104 GB | 28 GB | 10 GB |
| **70B** | 560 GB | 160 GB | 36 GB |
| **405B** | >3 TB | >800 GB | 144 GB |

---

## 5. 关键超参数

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| **r** (rank) | LoRA 秩，控制可学习参数量 | 8（简单）/ 16（中等）/ 64（复杂） |
| **α** (alpha) | 缩放因子 | α = 2r（如 r=16, α=32） |
| **target_modules** | 应用 LoRA 的层 | q_proj, v_proj（最少）或 all_linear（最多） |
| **dropout** | LoRA 层 dropout | 0.05-0.1 |
| **lr** | 学习率 | 1e-4 ~ 3e-4（比全量微调高） |

---

## 6. 工程最佳实践

| 关注点 | 建议 |
|--------|------|
| **秩选择** | 简单任务（风格调整）r=8，复杂任务（领域适配）r=32-64 |
| **目标模块** | 仅 q/v_proj 参数最少；all_linear 效果最好但参数更多 |
| **合并策略** | 训练后合并回基础模型，推理零额外延迟 |
| **多适配器** | 一个基础模型 + 多个 LoRA 适配器，按需切换 |
| **梯度累积** | 小显存时使用梯度累积模拟大 batch |
| **评估频率** | 每 500-1000 步评估一次，避免过拟合 |

---

## 7. 在 AI Stack 中的应用

| 场景 | 说明 |
|------|------|
| **领域适配** | 在通用模型上微调行业知识（医疗/金融/法律） |
| **风格调整** | 调整模型回答风格（简洁/详细/专业） |
| **指令跟随** | 增强模型的指令跟随能力 |
| **安全对齐** | 微调模型遵守安全规则 |

---

## 8. 局限与开放问题

1. **表达能力**：低秩假设可能不适用于所有微调场景
2. **灾难性遗忘**：LoRA 可能遗忘基础模型的通用能力
3. **多 LoRA 冲突**：同时加载多个 LoRA 适配器时的干扰问题
4. **长序列**：LoRA 在长上下文微调中的效果待验证
5. **自动秩选择**：目前缺少自动确定最优秩的方法

---

## 9. LoRA 怎么省显存（大白话）

> **一句话理解**：不动原模型的 700 亿个旋钮，只外挂 100 万个"小旋钮"来调，显存省 99%。

### 核心思想：只改一小撮"补丁参数"

- 全量微调 = 改模型的全部旋钮（700 亿个），显存爆掉
- LoRA = 把原旋钮**冻住**，在旁边挂两个**很小的矩阵 B×A** 来学"微调量"

```
原模型:  W₀ (4096×4096) = 16M 参数  ← 冻结，不学
LoRA 补丁: B(4096×8) × A(8×4096)    ← 学这个
补丁参数量: 8 × (4096+4096) = 6.5 万  ← 只有原来的 0.04%
```

### 显存去哪儿了？

训练一张 70B 模型，显存主要被 4 样东西吃光：

| 显存消耗项 | 全量微调 | LoRA | 原因 |
|----------|---------|------|------|
| **模型权重** | 140 GB | 140 GB | 都得加载 |
| **梯度** | 140 GB | 几乎为 0 | LoRA 冻住大部分，不算梯度 |
| **优化器状态**（Adam） | 280 GB | ~1 GB | Adam 要存 2 倍参数，LoRA 参数小 |
| **激活值** | 几十 GB | 几十 GB | 跟 batch/序列长度相关 |
| **合计** | **>600 GB** | **~160 GB** |  |

**QLoRA 进一步压到 ~36 GB**：
- 把"模型权重"从 FP16 → 4-bit → 省 4 倍
- 加上"双重量化"、"分页优化器"等 trick
- 单张 RTX 4090 就能跑 70B 微调

### 为什么低秩（r=8）够用？

经验发现：微调时权重的变化量 ΔW **本质是低秩的**——就像你的脸有几百块肌肉，但"表情"主要靠 20 块肌肉控制。r=8 / 16 通常就能捕获 90% 的微调效果。

### 推理时的"零成本"

训练完，把 B×A 算出来，直接加回 W₀，合并成新的 W：

```
W_final = W₀ + B×A
```

推理时跟原模型一模一样，**没有任何额外延迟**。

### 一句话总结

> LoRA = 冻结原模型 + 学一个小补丁，显存省 10 倍，效果保留 90%+，推理零成本。
> QLoRA = LoRA + 把原模型压成 4-bit，显存再省 4 倍，单卡能玩 70B。

---

## Related

- [[概念/fine-tuning-techniques]] — 微调技术（LoRA 的上级概念）
- [[概念/lora-qlora-sft-rlhf-dpo]] — LoRA / QLoRA / SFT / RLHF / DPO 大白话串讲
- [[概念/model-compression]] — 模型压缩（量化是 QLoRA 的基础）
- [[概念/distributed-parallelism]] — 分布式并行（全量微调的替代方案）
- [[概念/model-training]] — 模型训练（训练流程）
- [[05_大模型/Fine_tuning_Techniques]] — 微调技术详解
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI Stack
- [[概念/dora]] — DoRA
- [[概念/rs-lora]] — RS-LoRA
- [[07_模型训练/Data_and_FineTuning_for_dummy]] — 数据与微调大白话

---

## 2026 LoRA/PEFT 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **PEFT 0.15+** | HuggingFace 参数高效微调库 | GA |
| **LoRA** | 低秩适配微调 | GA |
| **QLoRA** | 量化 + LoRA 极低显存微调 | GA |
| **DoRA** | 权重分解低秩适配 | GA |
| **多 LoRA 服务** | 单模型多 LoRA 切换 | GA |

## 生产最佳实践

1. **秩选择**：rank 8-64 通常足够，过大增加显存且收益递减
2. **目标模块**：优先微调 attention 的 q/v 投影层
3. **学习率**：LoRA 学习率通常比全量微调高 10x
4. **合并部署**：生产环境将 LoRA 合并到基座模型
5. **多 LoRA**：多租户场景用 LoRA 切换，避免多模型部署
