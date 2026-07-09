---
title: "信息论 (Information Theory)"
category: -concepts
tags: ["fundamentals", "information-theory", "entropy", "cross-entropy", "KL-divergence", "mutual-information", "perplexity"]
relationships:
  - target: "_concepts/probability-statistics"
    type: builds_on
  - target: "_concepts/llm-architectures"
    type: related_to
  - target: "_concepts/model-evaluation"
    type: related_to
sources:
  - 数学基础/Information_Theory
summary: "信息论量化信息的基本理论——熵、交叉熵、KL散度、互信息，是几乎所有ML损失函数和模型评估指标的数学基础。"
provenance:
  extracted: 0.50
  inferred: 0.40
  ambiguous: 0.10
base_confidence: 0.92
lifecycle: reviewed
tier: core
created: 2026-06-04
updated: 2026-06-04
aliases:
  - "Information Theory"
  - "information theory"

---
# 信息论 (Information Theory)

> AI 的数学灵魂——交叉熵是分类损失函数，KL散度衡量分布距离，互信息发现特征关联。

---

## 1. 定义与历史

**信息论**（Information Theory）由 Claude Shannon 于 1948 年创立，研究信息的量化、存储和传输。在机器学习中，信息论提供了衡量不确定性、分布差异和变量关联的数学工具，是几乎所有损失函数和评估指标的底层语言。

---

## 2. 核心概念速查表

| 概念 | 公式 | 直觉含义 | ML 应用 |
|------|------|----------|---------|
| **香农熵** \(H(X)\) | \(-\sum p(x)\log p(x)\) | 随机变量的不确定性 | 决策树分裂准则（ID3/C4.5） |
| **联合熵** \(H(X,Y)\) | \(-\sum p(x,y)\log p(x,y)\) | 两变量联合的不确定性 | 多变量信息分析 |
| **条件熵** \(H(Y\|X)\) | \(-\sum p(x)H(Y\|X=x)\) | 已知 X 后 Y 的残余不确定性 | 特征选择 |
| **交叉熵** \(H(P,Q)\) | \(-\sum p(x)\log q(x)\) | 用 Q 编码 P 的平均比特数 | **分类损失函数**（CE Loss） |
| **KL 散度** \(D_{KL}(P\|Q)\) | \(\sum p(x)\log\frac{p(x)}{q(x)}\) | 分布 P 与 Q 的「距离」 | VAE 正则化、知识蒸馏 |
| **JS 散度** | \(\frac{1}{2}D_{KL}(P\|M)+\frac{1}{2}D_{KL}(Q\|M)\) | 对称版 KL，满足三角不等式 | GAN 训练、分布比较 |
| **互信息** \(I(X;Y)\) | \(H(X)-H(X\|Y)\) | 两变量共享的信息量 | 特征选择、对比学习（InfoNCE） |
| **困惑度** PPL | \(e^{H(P,Q)}\) | 模型对文本的「困惑程度」 | LLM 核心评估指标 |

---

## 3. 关键公式推导

### 3.1 交叉熵 = 熵 + KL 散度

\[
H(P,Q) = H(P) + D_{KL}(P \| Q)
\]

- **熵** \(H(P)\) 是真实分布的固有不确定性（常数）
- **KL 散度** 衡量模型分布 Q 偏离真实分布 P 的程度
- 因此**最小化交叉熵** ≡ **最小化 KL 散度** ≡ **让模型逼近真实分布**

### 3.2 二分类交叉熵 (BCE)

\[
\text{BCE} = -\frac{1}{N}\sum_{i=1}^{N}[y_i\log\hat{y}_i + (1-y_i)\log(1-\hat{y}_i)]
\]

这是 LLM next-token prediction 损失函数的本质形式。

### 3.3 困惑度与交叉熵的关系

\[
\text{PPL} = \exp\left(-\frac{1}{N}\sum_{i=1}^{N}\log P(w_i|w_{<i})\right) = e^{H(P,Q)}
\]

- PPL = 1：完美预测（概率为 1）
- PPL = 100：每个位置平均在 100 个候选中犹豫
- GPT-4 级模型在常见基准上 PPL < 10

---

## 4. 信息论在 LLM 中的应用

| 应用场景 | 信息论工具 | 说明 |
|----------|-----------|------|
| **训练损失** | 交叉熵 | LLM 训练 = 最小化 next-token 交叉熵 |
| **模型评估** | 困惑度 (PPL) | 越低越好，衡量模型对文本的预测能力 |
| **Tokenization** | 熵 & 编码定理 | BPE 逼近最优编码率（= 熵） |
| **知识蒸馏** | KL 散度 | 让学生分布逼近教师分布 |
| **VAE** | KL 散度 | 正则化后验分布逼近先验（标准正态） |
| **GAN** | JS 散度 / Wasserstein | 生成分布逼近真实分布 |
| **对比学习** | 互信息 (InfoNCE) | 最大化正样本对的互信息 |
| **特征选择** | 互信息 / 信息增益 | 选择与目标变量互信息最大的特征 |

---

## 5. 编码定理与 Tokenization

### Shannon 源编码定理

> 无损压缩的极限 = 信源的熵 \(H(X)\)。

这意味着：对于英语文本（熵 ≈ 1 bit/character），理论最优压缩只需 1 bit/字符。

### BPE (Byte-Pair Encoding) 的信息论解读

| 步骤 | 信息论解释 |
|------|-----------|
| 从字节开始 | 初始编码率 = 8 bits/字节（远高于英语熵） |
| 迭代合并最高频 pair | 贪心逼近最优编码 |
| 最终 vocab ~50K tokens | 接近英文条件熵的编码方案 |

BPE 不是最优的（贪心算法），但在实践中是计算效率与压缩率的优秀平衡。

---

## 6. 信息论 vs 统计学 vs 贝叶斯

| 维度 | 信息论 | 频率统计 | 贝叶斯 |
|------|--------|----------|--------|
| **核心对象** | 比特、熵 | 参数、p-value | 后验分布 |
| **假设检验** | MDL (最小描述长度) | 显著性检验 | 贝叶斯因子 |
| **模型选择** | AIC/BIC (信息准则) | 交叉验证 | 贝叶斯模型比较 |
| **哲学** | 最优编码 = 最优理解 | 数据生成过程 | 信念更新 |

---

## 7. 工程实践要点

| 关注点 | 建议 |
|--------|------|
| **数值稳定性** | 计算交叉熵时用 `log_softmax` 而非 `softmax + log`，避免下溢 |
| **类别不平衡** | 加权交叉熵或 Focal Loss（降低易分样本权重） |
| **Label Smoothing** | 将 one-hot 标签软化为 \([1-\epsilon, \epsilon/(K-1)]\)，正则化效果 |
| **PPL 计算** | 使用滑动窗口避免超长序列溢出，注意 token-level vs word-level |

---

## 8. 局限与开放问题

1. **语义鸿沟**：信息论衡量统计信息，不区分语义（"国王-男人+女人≈女王"不在信息论框架内）
2. **计算瓶颈**：精确 KL 散度在高维空间难以计算，常用采样估计（ELBO、FID）
3. **因果盲区**：互信息检测关联而非因果，需结合因果推断工具
4. **超越香农**：量子信息论（冯·诺依曼熵）和算法信息论（Kolmogorov 复杂度）是更广义的框架

---

## Related

- [[数学基础/Information_Theory/README]] — 信息论基础
- [[_concepts/probability-statistics]] — 概率统计基础
- [[_concepts/llm-architectures]] — LLM 架构（交叉熵与困惑度）
- [[_concepts/model-evaluation]] — 模型评估（PPL、信息准则）
- [[_concepts/bayesian-methods]] — 贝叶斯方法（KL 散度与变分推断）
