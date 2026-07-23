---
title: "注意力可视化深度解析 (Attention Visualization Deep Dive)"
category: visualization
tags: ["attention-visualization", "interpretability", "transformer", "nlp", "cv"]
summary: "> **一句话理解**: 注意力可视化把 Transformer 的'注意力'变成热力图——看清模型在每一步关注输入的哪些 token 或图像区域，从而诊断模型行为与可解释性。"
created: 2026-07-23
updated: 2026-07-23
tier: core
sources: []
---

# 注意力可视化深度解析 (Attention Visualization)

> **一句话理解**: 注意力可视化把 Transformer 的"注意力"变成热力图——看清模型在每一步关注输入的哪些 token 或图像区域，从而诊断模型行为与可解释性。

---

## 目录

1. [背景与动机](#1-背景与动机)
2. [核心原理与数学](#2-核心原理与数学)
3. [NLP 中的注意力可视化](#3-nlp-中的注意力可视化)
4. [CV 中的注意力可视化](#4-cv-中的注意力可视化)
5. [注意力头分析](#5-注意力头分析)
6. [注意力 vs 归因：关键争议](#6-注意力-vs-归因关键争议)
7. [可视化实现要点](#7-可视化实现要点)
8. [工具链](#8-工具链)
9. [对比表](#9-对比表)
10. [应用场景](#10-应用场景)
11. [局限与误区](#11-局限与误区)
12. [关联](#关联)

---

## 1. 背景与动机

Transformer 架构以自注意力（self-attention）为核心，但注意力权重天然是一个"软对齐"矩阵，直观上像是模型在看哪里。**注意力可视化**（Attention Visualization）把这些权重以热力图、连接图、弧线图等形式呈现，成为理解 Transformer 的第一手段。

### 1.1 为什么要可视化注意力

| 目的 | 说明 |
|------|------|
| 理解行为 | 模型是否在关注任务相关的 token/区域 |
| 调试错误 | 错误样本中注意力是否偏离 |
| 分析结构 | 是否学到了语法/对齐/共指等结构 |
| 可解释性 | 给用户一个"为什么"的直觉 |
| 模型对比 | 不同层/头/模型关注点差异 |

### 1.2 注意力可视化的两面性

注意力图直观诱人，但"注意力是否等于解释"自 2019 年起就有激烈争议（Jain & Wallace, "Attention is not Explanation"）。本篇既介绍方法，也厘清边界。

---

## 2. 核心原理与数学

### 2.1 缩放点积注意力

给定查询 $Q$、键 $K$、值 $V$，注意力权重：

$$\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

可视化对象是中间的**注意力权重矩阵**：

$$A = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) \in \mathbb{R}^{n\times n}, \quad A_{ij}\geq 0,\ \sum_j A_{ij}=1$$

其中 $A_{ij}$ 表示第 $i$ 个 query 对第 $j$ 个 key 的注意力强度。

### 2.2 多头注意力

每层有 $h$ 个头，每个头有独立的 $A^{(k)}$。可视化时需要决定:

- 单头单层：最细粒度，但数量爆炸（layers × heads 张图）；
- 头平均：损失头间差异；
- 头rollup：按头聚类后选代表。

### 2.3 交叉注意力

在 encoder-decoder（如翻译）中，decoder 第 $t$ 步对 encoder 的注意力 $A_{t,:}$ 揭示对齐关系，是经典可视化对象。

---

## 3. NLP 中的注意力可视化

### 3.1 token-token 热力图

最常见的形式：行=query token，列=key token，颜色深浅=注意力强度。

```
        The   cat   sat   on   mat
The   [0.5   0.2   0.1   0.1   0.1]
cat   [0.1   0.6   0.1   0.1   0.1]
sat   [0.05  0.15  0.5   0.2   0.1]
...
```

### 3.2 弧线图（BertViz 风格）

用连接 token 的弧线粗细表示注意力，适合展示头部的"关系"（如指代消解、依存）。

### 3.3 颜色编码单词

把当前 query token 对所有 key 的注意力高亮到原文，生成"注意力高亮句"。

### 3.4 典型发现

| 现象 | 含义 |
|------|------|
| 关注相邻 token | 局部模式 |
| 关注 [CLS]/[SEP] | 结构性注意（未必有意义） |
| 跨长距离对齐 | 语法/指代/对齐 |
| 关注标点 | 常见噪声模式 |

---

## 4. CV 中的注意力可视化

### 4.1 ViT 的 patch 注意力

ViT 把图像切成 patch，注意力矩阵是 patch-patch 热力图。把某个 patch 的注意力reshape 回图像网格，得到**空间注意力图**。

### 4.2 class token 注意力

取 [class] token 对各 patch 的注意力，叠加到原图，显示模型用于分类的区域。

### 4.3 多层注意力融合

浅层关注纹理/边缘，深层关注语义对象。可按层叠加或取差异图。

### 4.4 生成式模型中的交叉注意力

Stable Diffusion 中 UNet 的 cross-attention（text→image）揭示每个 prompt 词影响哪些图像区域，是 prompt 工程与可控生成的核心可视化。

---

## 5. 注意力头分析

### 5.1 头的功能分类

通过可视化与探针（probe），研究者发现不同头承担不同功能：

| 头类型 | 行为 | 可视化特征 |
|--------|------|------------|
| 前向/后向头 | 关注相邻 token | 对角线带 |
| 依存头 | 关注语法相关词 | 跨距弧线 |
| 指代头 | 关注指代对象 | 长距离弧 |
| 定位头 | 关注绝对位置 | 固定列亮 |
| 内容头 | 关注语义相关 | 语义聚类 |

### 5.2 头重要性分析

通过注意力剪枝（head pruning）可视化：移除某头后性能下降程度，量化头的贡献。

### 5.3 注意力熵

每个 query 的注意力分布熵 $H_i = -\sum_j A_{ij}\log A_{ij}$ 反映"聚焦 vs 发散"。低熵=聚焦，高熵=发散。

---

## 6. 注意力 vs 归因：关键争议

### 6.1 争议核心

- **支持方**: 注意力直观、无需额外计算、模型内生。
- **反对方**: 注意力权重不满足归因的一致性公理；存在"对抗性注意力"（权重变但预测不变）。

### 6.2 实践建议

| 情况 | 建议 |
|------|------|
| 需要严格归因 | 用 [[可视化/Evaluation_Viz/Model_Interpretability_Visualization\|SHAP/积分梯度]] 为主，注意力为辅 |
| 探索性理解 | 注意力图直观有效 |
| 报告/论文 | 明确声明"注意力是相关性而非因果" |
| 对比模型 | 注意力差异需结合性能差异 |

### 6.3 注意力展开（Attention Rollout）

Abnar & Zuidema 提出把多层注意力矩阵相乘（考虑残差），得到从输入到输出的"累积注意力"，缓解单层注意力噪声。

$$R^{(l)} = \overline{A}^{(l)} R^{(l-1)}, \quad R^{(0)} = I$$

其中 $\overline{A}$ 是加上残差/均值池化的注意力。

---

## 7. 可视化实现要点

### 7.1 提取注意力（HuggingFace）

```python
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

model = AutoModelForSequenceClassification.from_pretrained(
    "bert-base-uncased", output_attentions=True)
tok = AutoTokenizer.from_pretrained("bert-base-uncased")
inputs = tok("The cat sat on the mat", return_tensors="pt")
outputs = model(**inputs)
# outputs.attentions: tuple of (1, n_heads, seq, seq), 每层一个
attn = outputs.attentions[0]  # 第 0 层
```

### 7.2 绘制热力图

```python
import matplotlib.pyplot as plt
import seaborn as sns
tokens = tok.convert_ids_to_tokens(inputs["input_ids"][0])
head = attn[0, 0]  # 第 0 个头
sns.heatmap(head.detach().numpy(), xticklabels=tokens, yticklabels=tokens, cmap="viridis")
plt.show()
```

### 7.3 设计原则

| 原则 | 说明 |
|------|------|
| 标注层/头 | 每张图标明 layer-head |
| 选合适 colormap | viridis/colorblind 安全 |
| 归一化 | 按行（query）归一便于解读 |
| 交互 | 大序列用交互式（hover 显示值） |
| 对比 | 同样本多模型/多头并排 |

---

## 8. 工具链

| 工具 | 功能 | 关联 |
|------|------|------|
| BertViz | NLP 注意力多视图（头/层/模型） | jupyter 交互 |
| Captum | PyTorch 归因含注意力 | 可解释性 |
| AttentionVis / exBERT | 在线注意力探索 | 研究 |
| TransformerLens | Transformer 机制可解释性 | 超越注意力 |
| ECharts/d3 | 自建交互热力图 | 仪表盘 |

---

## 9. 对比表

### 9.1 可解释性方法对比

| 方法 | 是否需重训 | 计算成本 | 因果严谨 | 直观度 |
|------|-----------|----------|----------|--------|
| 注意力图 | 否 | 低 | 弱 | 高 |
| Attention Rollout | 否 | 低 | 中 | 中 |
| Saliency/Grad-CAM | 否 | 中 | 中 | 中 |
| 积分梯度 | 否 | 中高 | 高 | 中 |
| SHAP | 否 | 高 | 高 | 中 |
| 探针任务 | 需训探针 | 中 | 中（功能） | 低 |

### 9.2 NLP vs CV 注意力可视化

| 维度 | NLP | CV |
|------|-----|-----|
| 基本单位 | token | patch/region |
| 典型图 | 矩阵热力图/弧线 | 空间叠加图 |
| 序列长度 | 通常 < 512 | patch 数可很大 |
| 交互需求 | 中 | 高（需叠图） |
| 常见工具 | BertViz | Captum/自建 |

---

## 10. 应用场景

| 场景 | 用法 |
|------|------|
| 机器翻译 | 可视化交叉注意力对齐 |
| 文本分类 | class token 关注哪些词 |
| 问答 | 关注问题与段落的相关片段 |
| ViT 分类 | 关注物体区域 |
| 文生图 | prompt 词→图像区域 |
| 对话 | 关注历史哪轮 |
| 代码模型 | 关注跨文件依赖 |
| 多模态 | 图文对齐区域 |

---

## 11. 局限与误区

| 局限/误区 | 说明 |
|-----------|------|
| 注意力≠因果 | 权重高不代表因果贡献大 |
| 对抗性注意力 | 权重可被操纵而预测不变 |
| 多头冗余 | 很多头可剪枝，注意力未必有意义 |
| 结构性注意 | 对 [CLS]/[SEP]/标点的注意常是噪声 |
| 平均掩盖差异 | 头平均会丢失功能性差异 |
| 跨层不可比 | 不同层注意力语义不同 |
| 可视化偏差 | 选图时易确认偏差 |


---

## 附录 A：注意力可视化常见模式图鉴

| 模式 | 热力图特征 | 典型含义 |
|------|------------|----------|
| 对角带 | 主对角线附近亮 | 局部/n-gram 关注 |
| 整行亮 | 某行全亮 | 关注所有/结构性 |
| 单点聚焦 | 一个格极亮 | 强对齐 |
| 散斑 | 随机亮点 | 噪声头 |
| 列亮 | 某列全亮 | 关注特定位置（如 [CLS]） |
| 块状 | 子矩阵亮 | 簇内关注 |

---

## 附录 B：头功能探针流程

```mermaid
flowchart LR
    M[训练好的模型] --> E[取每层每头注意力]
    E --> P[设计探针任务]
    P --> S[计算头在任务上的得分]
    S --> R[排序+可视化头功能]
    R --> C[分类: 依存/指代/位置/内容]
```

---

## 附录 C：注意力可视化的伦理边界

| 风险 | 说明 | 缓解 |
|------|------|------|
| 过度信任 | 把注意力当因果 | 明确声明相关性 |
| 选择性展示 | 只展示支持结论的图 | 报告全样本统计 |
| 隐私泄露 | 注意力暴露训练数据 | 脱敏/聚合 |
| 误导决策 | 基于错误解释做决策 | 结合定量归因 |


---

## 附录 D：跨模态注意力可视化

| 模态对 | 方法 | 关注 |
|--------|------|------|
| 文本→文本 | token 矩阵 | 语法/对齐 |
| 图像→文本 | patch-token | 区域-词对齐 |
| 音频→文本 | frame-token | 时间-词对齐 |
| 视频→文本 | clip-token | 片段-词对齐 |

### D.1 文生图（Stable Diffusion）

UNet 的 cross-attention 揭示每个 prompt token 影响的图像区域，是 AttendAndRemix/提示词编辑的基础。

### D.2 多模态大模型（VLM）

VLM 的视觉 token 与文本 token 间注意力揭示"模型看了图的哪里来回答"。

---

## 附录 E：注意力可视化的进阶技术

| 技术 | 说明 |
|------|------|
| Attention Rollout | 多层累积注意力 |
| Attention Flow | 用最大流松弛传播 |
| Relaxed Attention | 考虑残差后的注意力 |
| Function Attention | 把头功能可视化 |
| Probe-based | 用探针任务量化头功能 |

---

## 附录 F：术语速查

| 术语 | 含义 |
|------|------|
| Self-Attention | 自注意力 |
| Cross-Attention | 交叉注意力 |
| Multi-Head | 多头 |
| Attention Head | 注意力头 |
| Attention Rollout | 累积注意力 |
| Saliency | 显著性 |
| Attribution | 归因 |
| Probe | 探针任务 |

---

## 附录 G：注意力可视化工具实战对比

### G.1 BertViz 三视图

| 视图 | 形式 | 适用 |
|------|------|------|
| Head view | 网格热力图（层×头） | 浏览所有头 |
| Model view | 模型级连接 | 看整体结构 |
| Neuron view | 单头细粒度 | 深入单个头 |

### G.2 自建交互热力图（Plotly）

```python
import plotly.express as px
fig = px.imshow(head.numpy(),
                x=tokens, y=tokens,
                color_continuous_scale="Viridis",
                title=f"Layer {l} Head {h} 注意力")
fig.update_layout(coloraxis_colorbar=dict(title="权重"))
fig.show()
```

### G.3 大序列的策略

| 策略 | 说明 |
|------|------|
| 分块 | 按句/段分块可视化 |
| 聚合 | 平均相邻 token |
| 采样 | 抽样关键 token |
| 聚焦 | 只画与目标 token 相关行 |

---

## 附录 H：注意力可视化的论文里程碑

| 论文 | 贡献 | 年份 |
|------|------|------|
| Attention is All You Need | 提出 self-attention | 2017 |
| BertViz | 工具化多头可视化 | 2019 |
| Attention is not Explanation | 引发争议 | 2019 |
| Attention is not not Explanation | 反驳争议 | 2019 |
| Quantifying Attention Flow | Attention Rollout | 2020 |
| TransformerLens | 机制可解释性 | 2023 |
---

## 关联

- [[可视化/index|可视化首页]]
- [[可视化/Evaluation_Viz/index|Evaluation Viz]]
- [[可视化/Evaluation_Viz/Model_Interpretability_Visualization|模型可解释性可视化]]
- [[深度学习/index|深度学习]]
- [[深度学习/Attention_Mechanisms/Attention_Mechanisms|注意力机制]]
- [[大模型/index|大模型]]
- [[计算机视觉/index|计算机视觉]]
- [[伦理安全/index|伦理安全]]

---

*Last updated: 2026-07-23*
