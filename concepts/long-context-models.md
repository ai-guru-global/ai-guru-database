---
title: 长上下文模型
category: concepts
tags: [nlp, long-context, attention, kv-cache, scaling]
relationships:
  - target: "[[concepts/transformer-architecture]]"
    type: extends
  - target: "concepts/llm-architectures"
    type: related_to
  - target: "concepts/multimodal-models"
    type: related_to
sources: [04_NLP_LLMs/Long_Context_world-models-jepa_2026.md]
summary: 长上下文模型将LLM的上下文窗口从数千token扩展到百万级，通过稀疏注意力、KV Cache压缩、位置编码外推和分布式注意力（Ring Attention）等技术创新，实现整代码库分析、长篇文档理解和跨文档知识综合。
provenance:
  extracted: 0.80
  inferred: 0.12
  ambiguous: 0.08
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-05-31
tier: core
created: 2026-05-31T00:00:00Z
updated: 2026-05-31T00:00:00Z
---

# 长上下文模型

## 概述

上下文窗口从2022年GPT-3的2K token扩展到2026年llm-architectures 4 Scout的**1000万token**，重新定义了AI能处理的问题规模。长上下文使整代码库分析、长篇小说理解、多文档法律审查成为可能。

但标准 Self-Attention 的$O(n^2)$复杂度在百万token时不可承受，催生了全新的工程范式。

## 核心技术挑战

### 注意力复杂度

| 上下文长度 | 计算量 | 可行性 |
|-----------|--------|--------|
| 4K | 16M ops | 可接受 |
| 100K | 10B ops | 需要优化 |
| 1M | 1T ops | 无法直接计算 |

### KV Cache内存

每个token的KV向量约32KB，不同上下文长度的Cache大小：4K→128MB、100K→3.2GB、1M→32GB、10M→320GB（不可直接存储）。

## 稀疏注意力

核心思想：不是所有token都对当前token重要。Longformer采用三种注意力模式：
- **局部窗口**：周围512个token
- **全局token**：固定间隔的关键位置
- **随机稀疏**：增加探索性

复杂度从$O(n^2)$降至$O(n \times w)$（$w$为窗口大小）。

## model-training Attention

通过分块计算和在线Softmax技巧避免存储完整的$n \times n$注意力矩阵。减少GPU HBM和SRAM之间的数据移动，实现2-4×速度提升，无精度损失。

## Ring Attention（环形注意力）

将序列分割到多个GPU，K/V在GPU环中传递，每GPU计算本地Q与传递来的K/V的注意力。

优势：打破单GPU显存限制、线性扩展到任意长度、保持精确注意力（非近似）。

## 上下文压缩技术

### H2O（Heavy Hitter Oracle）

保留被多次关注的"重击者"token和最近窗口的KV，压缩率50-80%，准确率损失<2%。

### StreamingLLM

保留初始"汇点token"（如[CLS]）和最近窗口，支持无限长度生成。关键发现：transformer-architecture初始token成为注意力汇点。

### 学习型压缩

训练小型网络动态评估每个token的重要性，选择性保留。更灵活但需额外训练。

## 位置编码外推

模型在长度$L$上训练，要在$L' > L$上推理：

| 方法 | 原理 | 效果 |
|------|------|------|
| Position Interpolation | 线性缩放位置索引 | 简单，长距离关系可能受损 |
| NTK-Aware Scaling | 修改RoPE频率基数 | 外推性好 |
| YaRN | 低频插值+高频保持+平滑过渡 | 极长序列表现最佳 |

## 大海捞针测试

在大量无关文本中插入特殊信息，测试模型在不同位置、不同深度下的检索准确率。2026年基准：multimodal-models 1.5在1M上下文达95%，Claude 3.5在200K达98%。

## 评估基准

| 基准 | 最大长度 | 任务类型 |
|------|---------|---------|
| LongBench | 67K | 检索、摘要、代码 |
| L-Eval | 200K | 真实场景问答 |
| NeedleBench | 1M | 信息定位 |
| InfiniteBench | 500K | 极长上下文推理 |

## 技术选型指南

| 场景 | 推荐技术 |
|-----|---------|
| <32K | Flash Attention 2 |
| 32K-128K | Ring Attention + KV压缩 |
| 128K-1M | Ring Attention + H2O压缩 |
| >1M | 稀疏注意力 + 上下文压缩 |

## 关联主题

- Transformer架构：注意力机制的基础
- LLM架构：长上下文扩展的载体
- 多模态模型：超长视频理解依赖长上下文能力

## Related

- [[22_Papers/Attention_Is_All_You_Need_Deep_Dive]] — Attention Is All You Need 深度解读 (共享: attention, nlp)
- [[concepts/transformer-architecture]] — Transformer 架构 (共享: attention, nlp)
- [[synthesis/transformer-llm-architecture]] — Transformer 架构 × LLM 架构 (共享: attention, nlp)
- [[concepts/multi-head-latent-attention]] — Multi-head Latent Attention (MLA): DeepSeek 提出的 KV Cache 压缩架构，128K 上下文从 213GB 降至 7.6GB
