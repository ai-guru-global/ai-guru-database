---
title: "大语言模型基础 (LLM Fundamentals)"
category: 05-nlp-llms
tags: ["llm", "transformer", "pretraining", "fine-tuning", "inference"]
summary: '> **一句话理解**: 大语言模型 (LLM) = Transformer 架构 + 海量文本预训练 + 人类反馈对齐——它不"理解"语言，但通过预测下一个 token 的概率分布，涌现出了翻译、推理、编程等惊人能力。'
created: 2026-06-12
updated: 2026-06-12
tier: supporting
aliases:
  - "Llm Fundamentals"
  - "LLM Fundamentals"
  - LLM_Fundamentals
sources: []

---
# 大语言模型基础 (LLM Fundamentals)

> **一句话理解**: 大语言模型 (LLM) = Transformer 架构 + 海量文本预训练 + 人类反馈对齐——它不"理解"语言，但通过预测下一个 token 的概率分布，涌现出了翻译、推理、编程等惊人能力。

---

## TL;DR

- **LLM 本质**: 基于 Transformer Decoder 的自回归语言模型，核心任务是 next-token prediction
- **三阶段流水线**: Pretraining → SFT (Supervised Fine-Tuning) → RLHF/DPO (人类偏好对齐)
- **关键架构**: GPT 系列 (Decoder-only)、BERT (Encoder-only)、T5 (Encoder-Decoder)
- **Scaling Laws**: 参数量、数据量、计算量三者与性能的幂律关系
- **推理优化**: KV Cache、量化 (INT4/INT8)、Speculative Decoding、PagedAttention
- **上下文窗口**: 从 2K (GPT-3) 到 1M+ (Gemini)，长上下文成为核心竞争力
- **微调范式**: 全量微调 → LoRA → QLoRA，参数高效微调降低门槛

---

## 本章节索引

本文是 LLM 领域的总入口，向下链接四个核心子模块：

| 子模块 | 核心内容 | 链接 |
|--------|---------|------|
| **Transformer 革命** | Self-Attention、位置编码、架构详解 | [[05_NLP_LLMs/Transformer_Revolution/Transformer_Revolution]] |
| **LLM 架构生态** | GPT、LLaMA、Claude、Gemini 等模型对比 | [[05_NLP_LLMs/LLM_Architectures/LLM_Architectures]] |
| **Prompt Engineering** | Zero-shot、Few-shot、CoT、系统提示词 | [[05_NLP_LLMs/Prompt_Engineering/Prompt_Engineering]] |
| **微调技术** | LoRA、QLoRA、RLHF、DPO | [[05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques]] |

---

## 1. 什么是大语言模型 (What is an LLM)

大语言模型是参数量达到数十亿至数万亿级别的 Transformer 模型，通过在海量文本上进行自监督预训练，学习语言的统计规律和世界知识。

**核心能力涌现**：
- **In-context Learning**: 无需更新参数，仅通过 prompt 中的示例即可学习新任务
- **Chain-of-Thought**: 逐步推理，显著提升数学和逻辑能力
- **代码生成**: 从自然语言描述生成可执行代码
- **多语言能力**: 跨语言理解与翻译

### 1.1 LLM 的规模与能力关系

```
Scaling Laws (Chinchilla, 2022):

模型性能 (Loss) ∝ N^(-α) · D^(-β) · C^(-γ)

其中:
├── N = 参数量 (Parameters)
├── D = 训练数据量 (Tokens)
├── C = 计算量 (FLOPs)
└── α, β, γ 为经验常数

关键发现:
├── 数据与参数应同步扩展 (20 tokens/param)
├── 过小模型 + 过多数据 = 欠拟合
├── 过大模型 + 过少数据 = 过拟合
└── 最优分配需要三者平衡
```

---

## 2. LLM 生命周期 (Lifecycle)

```mermaid
flowchart TB
    subgraph "阶段一: 预训练 (Pretraining)"
        A1[海量文本语料<br/>Books/Web/Code] --> A2[Tokenization<br/>BPE/SentencePiece]
        A2 --> A3[自监督训练<br/>Next-Token Prediction]
        A3 --> A4[Base Model<br/>GPT-4-base]
    end

    subgraph "阶段二: 监督微调 (SFT)"
        B1[指令数据集<br/>Instruction-Response] --> B2[有监督微调<br/>LoRA / 全量]
        B2 --> B3[SFT Model<br/>遵循指令能力]
    end

    subgraph "阶段三: 对齐 (Alignment)"
        C1[人类偏好数据<br/>好回答 vs 坏回答] --> C2[RLHF / DPO]
        C2 --> C3[Aligned Model<br/>安全、有用、诚实]
    end

    A4 --> B1
    B3 --> C1

    style A4 fill:#e3f2fd
    style B3 fill:#fff3e0
    style C3 fill:#e8f5e9
```

### 2.1 各阶段关键参数

| 阶段 | 数据规模 | 计算量 | 训练时长 | 输出 |
|------|---------|--------|---------|------|
| **Pretraining** | 1-15T tokens | 10²⁴ FLOPs | 数周~数月 | Base Model |
| **SFT** | 10K-1M 样本 | 10²⁰ FLOPs | 数小时~数天 | Instruction Model |
| **RLHF/DPO** | 10K-100K 偏好对 | 10¹⁹ FLOPs | 数小时 | Aligned Model |

---

## 3. 关键架构对比 (Key Architectures)

```mermaid
flowchart LR
    subgraph "Encoder-only"
        E1[BERT] --> E2["双向注意力<br/>理解任务"]
    end
    subgraph "Decoder-only"
        D1[GPT/LLaMA] --> D2["因果注意力<br/>生成任务"]
    end
    subgraph "Encoder-Decoder"
        ED1[T5/BART] --> ED2["编码器理解<br/>解码器生成"]
    end
```

| 架构类型 | 注意力机制 | 代表模型 | 优势 | 典型任务 |
|---------|-----------|---------|------|---------|
| **Encoder-only** | 双向 (Bidirectional) | BERT, RoBERTa | 深层语义理解 | 分类、NER、检索 |
| **Decoder-only** | 因果 (Causal) | GPT-4, LLaMA, Claude | 自回归生成、In-context Learning | 对话、创作、推理 |
| **Encoder-Decoder** | 交叉注意力 | T5, BART, FLAN-T5 | 序列到序列 | 翻译、摘要、问答 |

**2026 现状**: Decoder-only 架构已成为 LLM 的绝对主流，因其 Scaling Laws 表现最优且 In-context Learning 能力最强。

---

## 4. 推理优化 (Inference Optimization)

LLM 推理的核心瓶颈是**内存带宽**而非算力——每次生成一个 token 都需要加载整个模型权重。

| 优化技术 | 原理 | 加速比 | 适用场景 |
|---------|------|--------|---------|
| **KV Cache** | 缓存已计算的 Key/Value 向量 | 避免重复计算 | 所有自回归生成 |
| **量化 (Quantization)** | FP16→INT8→INT4 降低精度 | 2-4x 内存节省 | 边缘部署、消费级 GPU |
| **Speculative Decoding** | 小模型草稿 + 大模型验证 | 2-3x 生成加速 | 高吞吐服务 |
| **PagedAttention** | 分页管理 KV Cache | 4x 吞吐提升 | vLLM 等推理引擎 |
| **Continuous Batching** | 动态批处理请求 | 高利用率 | 在线服务 |
| **Flash Attention** | IO 感知注意力计算 | 2-4x 注意力加速 | 训练 + 推理 |

---

## 5. 微调范式演进 (Fine-tuning Evolution)

```mermaid
flowchart LR
    A["全量微调<br/>Full Fine-tuning<br/>更新所有参数"] --> B["Adapter<br/>插入小型模块<br/>(2019)"]
    B --> C["LoRA<br/>低秩分解<br/>(2021)"]
    C --> D["QLoRA<br/>量化 + LoRA<br/>(2023)"]
    D --> E["DPO/RLHF<br/>偏好对齐<br/>(2023-2026)"]

    style A fill:#ffcdd2
    style C fill:#fff9c4
    style D fill:#c8e6c9
    style E fill:#b3e5fc
```

| 方法 | 可训练参数 | GPU 需求 (7B) | 性能 | 使用场景 |
|------|-----------|--------------|------|---------|
| **Full FT** | 100% | 8×A100 80G | 最佳 | 大规模定制 |
| **LoRA** | <1% | 1×A100 80G | 接近全量 | 通用微调 |
| **QLoRA** | <1% | 1×RTX 4090 24G | 接近 LoRA | 消费级 GPU |
| **Prefix Tuning** | <0.1% | 1×V100 | 略差 | 轻量适配 |

---

## 延伸阅读 (Further Reading)

- [[05_NLP_LLMs/Transformer_Revolution/Transformer_Revolution]] — Transformer 架构革命
- [[05_NLP_LLMs/LLM_Architectures/LLM_Architectures]] — 主流 LLM 架构生态
- [[05_NLP_LLMs/Prompt_Engineering/Prompt_Engineering]] — 提示词工程实战
- [[05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques]] — 微调技术全景
- [[05_NLP_LLMs/LLM_Architectures/Long_Context_Models_2026]] — 长上下文模型 2026
- [[05_NLP_LLMs/GenAI_L02_Exploring_and_Comparing_LLMs]] — LLM 对比与选型
