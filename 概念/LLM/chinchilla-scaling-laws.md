---
title: Chinchilla 缩放定律(Compute-Optimal Scaling Laws)
category: concepts
tags:
  - llm
  - scaling-laws
  - chinchilla
  - compute-optimal
  - deepmind
  - pretraining
aliases:
  - Chinchilla Scaling Laws
  - Training Compute-Optimal Large Language Models
  - 计算最优缩放定律
relationships:
  - target: "概念/llm-architectures"
    type: related_to
  - target: "概念/emergent-abilities"
    type: related_to
  - target: "概念/test-time-compute"
    type: related_to
  - target: "概念/foundation-model"
    type: evolves_from
summary: Chinchilla 缩放定律(DeepMind, Hoffmann et al. 2022)是 LLM 预训练最重要的"算力-参数-数据"分配指南:在固定算力下,模型参数 N 与训练 token D 应**等比例扩展**(N_opt ∝ C^0.5, D_opt ∝ C^0.5),即每 1B 参数约需 20B tokens。Chinchilla 70B 用 1.4T tokens 训练后,以 1/4 算力超越 Gopher 280B,获 NeurIPS 2022 Outstanding Paper。
lifecycle: reviewed
tier: core
created: 2026-07-23
updated: 2026-07-23
sources:
  - arXiv:2203.15556
  - DeepMind 官方博客
  - NeurIPS 2022 Outstanding Paper
  - OpenAI Scaling Laws (Kaplan et al. 2020)
  - Llama 2 论文(Touvron et al. 2023)
  - Llama 3 论文(Meta AI 2024)
name_zh: "Chinchilla 缩放定律"
---

# Chinchilla 缩放定律(Compute-Optimal Scaling Laws)

> 中文简称：Chinchilla 缩放定律

## 一句话总结

**Chinchilla 缩放定律** 指出:在固定算力预算下,LLM 预训练应**等比例**扩展模型参数 N 与训练 token D(N_opt ∝ C^0.5, D_opt ∝ C^0.5),典型比例 **1B 参数配 20B tokens**;它终结了"只追大参数"的 2020-2022 时代,是 LLaMA、Qwen、DeepSeek 等所有现代开源 LLM 训练决策的底层基线。

---

## 1. 核心定义

| 符号 | 含义 |
|---|---|
| **C** | 训练总算力(以 FLOPs 衡量),C ≈ 6ND |
| **N** | 模型参数(不含 embedding 与 positional encoding) |
| **D** | 训练 token 数 |
| **L** | 测试集交叉熵损失 |
| **C_min** | 达到目标 L 所需的最小算力(OpenAI 定义) |

### 1.1 三条幂律关系(Scaling Laws)

| 关系 | 含义 | 出处 |
|---|---|---|
| **L ∝ C^(-α_C)** | 算力翻倍,损失按幂律下降 | Kaplan 2020 / Hoffmann 2022 |
| **L ∝ N^(-α_N)** | 模型越大,损失越低 | Kaplan 2020 |
| **L ∝ D^(-α_D)** | 数据越多,损失越低 | Kaplan 2020 |

> 关键观察:**三个变量之间任意两个都呈幂律关系**,但这并不直接告诉你"该如何分配"算力。

---

## 2. Chinchilla 的核心结论(2022 重大发现)

Hoffmann 等人(DeepMind, 2022)用 **400+ 模型、70M-16B 参数、5-500B tokens** 做了 **9 个算力档位** 的完整消融,得到反直觉结论:

### 2.1 等比例扩展(Compute-Optimal)

$$
N_{\text{opt}}(C) \propto C^{0.5}, \quad D_{\text{opt}}(C) \propto C^{0.5}
$$

> **翻译**:算力翻 10 倍,**模型大小与数据量都应扩大 ~3.16 倍**(√10),不是只把模型做大。

### 2.2 1:20 黄金比例

**每 1B 参数 ≈ 20B tokens**,这是 LLaMA 1/2 的训练标准。

| 模型 | 参数量 | 训练 tokens | 比例 | 是否 Chinchilla-optimal |
|---|---|---|---|---|
| **GPT-3** | 175B | 300B | 1.7:1 | ❌ 严重**欠训练** |
| **Gopher** | 280B | 300B | 1.1:1 | ❌ 严重欠训练 |
| **Chinchilla** | 70B | 1.4T | 1:20 | ✅ 算力最优 |
| **LLaMA-1 7B** | 6.7B | 1T | 1:150 | ⚠️ 过度训练(over-training) |
| **LLaMA-2 7B** | 6.7B | 2T | 1:300 | ⚠️ 进一步过度训练 |
| **LLaMA-3 8B** | 8B | 15T+ | 1:1875 | ⚠️ 极致过度训练 |

### 2.3 与 OpenAI Scaling Laws(2020)的对比

| 维度 | OpenAI(2020) | DeepMind(2022) |
|---|---|---|
| **核心主张** | 算力 ×10 → 模型 ×5.5、数据 ×1.8 | 算力 ×10 → 模型 ×3.16、数据 ×3.16 |
| **数据相对地位** | 次要 | **与参数等权** |
| **代表模型** | GPT-3(175B/300B) | Chinchilla(70B/1.4T) |
| **影响** | 推动"越大越好"军备竞赛 | 终结军备竞赛,转向"性价比" |

> **OpenAI 错在哪?** Hoffmann 指出 Kaplan 2020 对所有模型用了**单一的 cosine annealing 学习率调度**,导致欠训练的小模型损失被人为抬高,拟合出了错误的指数。修正后,数据与参数同等重要。

---

## 3. Chinchilla 模型实测(2022)

DeepMind 用与 Gopher(280B) **相同的算力预算**训练了 Chinchilla:

| 指标 | Gopher | Chinchilla | 优势 |
|---|---|---|---|
| **参数** | 280B | 70B(1/4) | 推理成本大幅下降 |
| **训练 tokens** | 300B | 1.4T(4.7×) | 数据量翻 4.7 倍 |
| **MMLU 平均** | 60.0% | **67.5%** | +7.5% |
| **BIG-bench** | 多数任务次优 | **>50% 任务超越 Gopher** | 全面胜出 |
| **下游任务(204 项)** | 基线 | 显著优于 Gopher、GPT-3、Jurassic-1、MT-NLG(530B) | 1/4 算力击败 530B |
| **推理算力** | 高 | 低 4× | 部署成本低 |

---

## 4. Chinchilla 之后的演进:Over-Training 范式

### 4.1 Meta LLaMA 系列的"过度训练"革命

LLaMA 团队 2023 率先打破 Chinchilla,主张**"推理侧"算力比"训练侧"更稀缺**:

> Hoffmann 的 Chinchilla 假设每个模型都用于**等量推理**,但实际部署时,小模型被调用**数百万次**,因此**略微过度训练**划算。

| 模型 | 训练 tokens | 比例 | 算力开销(相对 Chinchilla-optimal) |
|---|---|---|---|
| **LLaMA-1 7B** | 1T | 1:150 | +12% 训练算力 |
| **LLaMA-1 65B** | 1.4T | 1:21 | 接近 Chinchilla |
| **LLaMA-2 7B** | 2T | 1:300 | ~40% |
| **LLaMA-3 8B** | **15T+** | 1:1875 | ~500%(极致 over-training) |
| **DeepSeek-V3** | 14.8T | 1:11(670B MoE,激活 37B) | MoE 例外 |

> **结论**:2024-2026 主流开源 LLM 都选择 **over-trained 小模型**(LLaMA-3、Qwen-2.5、Mistral、Gemma),即"牺牲训练算力换推理算力"。

### 4.2 临界模型大小(Critical Model Size)

Harm de Vries(2023)推导:当模型缩到 Chinchilla-optimal 的 **30%**,训练算力仅翻倍(2×);**40-60%** 时仅多 10-42%。**LLaMA-7B 仅多 12% 算力换 4× 推理效率**——极划算。

---

## 5. 2026 生态速览

| 流派 | 代表 | 数据/参数 | 哲学 |
|---|---|---|---|
| **Chinchilla-strict** | Chinchilla、Hoffmann 系列 | 1:20 | 训练算力最优 |
| **Over-trained** | LLaMA-1/2/3、Qwen-2.5、Mistral、Gemma | 1:150 ~ 1:2000 | 推理成本优化 |
| **MoE 流派** | DeepSeek-V3、Mixtral | 1:10 ~ 1:15 | 总参数大、激活参数小、数据相对少 |
| **Test-time scaling** | OpenAI o1/o3、DeepSeek-R1 | — | 不增数据,改在推理时多算 |
| **多模态扩展** | Chameleon、Gemini | 早期融合 | 推翻 Chinchilla,NMM 需更大模型 |

---

## 6. 生产最佳实践

### 6.1 训练预算规划

```text
给定 GPU 时长 G、单卡 FLOPs/s F:
  总算力 C = G × F × 利用率(通常 30-50% MFU)

按 Chinchilla 1:20 比例:
  N_opt ≈ (C / 6 / 20)^(1/3)  [粗略估算,需用 IsoFLOP profile 精修]

按 Over-training 1:300 比例(更省推理):
  N_opt ≈ (C / 6 / 300)^(1/3)
```

### 6.2 决策树

| 场景 | 比例建议 |
|---|---|
| **API 高频推理服务** | 1:300(LLaMA 风格),推理算力最稀缺 |
| **内部工具、低 QPS** | 1:20 ~ 1:50,Chinchilla-strict |
| **MoE 架构** | 总参数/激活参数 8-16,数据 1T+ |
| **多模态早期融合** | 1:10 ~ 1:20,模型稍大 |
| **CPT/DPO 后续训练** | over-trained 基模即可 |

### 6.3 常见误区

| 误区 | 修正 |
|---|---|
| "模型越大越好" | 同时按比例扩数据,否则欠训练 |
| "固定数据,扩模型" | GPT-3 错过的路,Chinchilla 已证伪 |
| "小模型训练快所以省钱" | 推理侧调用上百万次后,over-trained 小模型总成本更低 |
| "Chinchilla 公式可直接套用所有模态" | 2025 Shukor et al. 证明多模态 N/D 平衡点已偏移 |

---

## 7. See Also(官方源)

| 来源 | 链接 |
|---|---|
| **Hoffmann et al. 2022, arXiv** | https://arxiv.org/abs/2203.15556 |
| **DeepMind 官方博客** | https://www.deepmind.com/blog/training-compute-optimal-large-language-models |
| **NeurIPS 2022 Outstanding Paper** | https://papers.nips.cc/paper_files/paper/2022/hash/c1e2faff6f588870935f114ebe04a3e5-Abstract.html |
| **Kaplan et al. 2020, OpenAI Scaling Laws** | https://arxiv.org/abs/2001.08361 |
| **Llama 2 论文(Touvron et al. 2023)** | https://arxiv.org/abs/2307.09288 |
| **Llama 3 论文(Grattafiori et al. 2024)** | https://arxiv.org/abs/2407.21783 |
| **Harm de Vries 临界模型分析** | https://www.harmdevries.com/post/model-size-vs-compute-overhead/ |
| **DataLearner 解读** | https://www.datalearner.com/blog/1051649049249455 |
| **Shukor 2025 多模态 Scaling** | https://arxiv.org/abs/2504.07951 |
| **Chinchilla 关键术语英中对照** | Compute-Optimal / Chinchilla / IsoFLOP profile / over-training / critical model size |

---

## 8. 一句话结论(2026)

**Chinchilla 给了"算力最优"的**上限**,但 2024-2026 的工业实践已经**全部偏向 over-training**,因为推理侧成本才是真正的瓶颈;理解 1:20 是基线、1:200 ~ 1:300 是工程现实、1:2000 是 LLaMA-3 极致,才算是真正读懂了缩放定律。**

## 相关链接

- [[概念/LLM/emergent-abilities|涌现能力]] — 缩放定律驱动的涌现现象
- [[07_模型训练/01_训练基础/03_LLM_训练_深入分析|LLM 训练深度解析]] — 缩放定律指导训练
- [[07_模型训练/03_训练优化/Scaling_Laws_and_Training_Dynamics|缩放定律与训练动力学]] — 缩放定律深入
- [[05_大模型/14_全球LLM生态/07_Meta_LLaMA_深入分析|Meta LLaMA 深度解析]] — 应用 Chinchilla 定律的代表
- [[05_大模型/05_LLM架构/05_LLM架构|大语言模型架构]] — 缩放定律影响架构设计
