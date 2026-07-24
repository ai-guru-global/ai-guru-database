---
title: "信息几何 (Information Geometry / 概率流形 / KL 散度 / Fisher 信息)"
category: concepts
tags:
  - math
  - information-geometry
  - kl-divergence
  - fisher-information
  - manifold
  - natural-gradient
  - information-theory
aliases:
  - Information Geometry
  - Information Geometry
  - Information Geometry
  - KL Divergence
  - Fisher Information
  - Natural Gradient
  - Manifold Learning
relationships:
  - target: "概念/information-theory"
    type: extends
  - target: "概念/probability-statistics"
    type: extends
  - target: "概念/optimization-theory-ml"
    type: related_to
  - target: "概念/neural-networks"
    type: related_to
summary: "信息几何是 1980-2026 用微分几何研究概率分布的数学框架——把概率分布族看作黎曼流形,KL 散度是流形上的"距离",Fisher 信息矩阵是流形的"黎曼度量"。在 ML 中表现为:自然梯度下降、变分推断、生成模型的隐空间结构。是深度学习理论的"高观点"。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# 信息几何

> **一句话理解**:信息几何用微分几何视角研究概率分布——把"概率分布族"看作"流形",KL 散度是流形距离,Fisher 信息矩阵是黎曼度量。在 ML 中表现为:自然梯度下降、变分推断、生成模型隐空间。是理解深度学习的"高观点"。

---

## 一、核心思想

把概率分布族 $P_\theta$ 参数化:
- 每个 $\theta$ 对应一个分布
- 所有分布构成 $\theta$ 空间(统计流形)
- 装备 Fisher 信息作为"黎曼度量"
- KL 散度是"流形上的测地线距离"

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 信息几何 | Information Geometry | 概率 + 微分几何 |
| 统计流形 | Statistical Manifold | 概率分布族 |
| 黎曼度量 | Riemannian Metric | 流形上的内积 |
| Fisher 信息 | Fisher Information | 自然度量 |
| Fisher 信息矩阵 | Fisher Information Matrix(FIM) | 二阶统计量 |
| KL 散度 | Kullback-Leibler Divergence | 非对称距离 |
| 詹森散度 | Jensen-Shannon Divergence | 对称距离 |
| 布雷格曼散度 | Bregman Divergence | 凸函数生成 |
| 自然参数 | Natural Parameter | 指数族 |
| 期望参数 | Expectation Parameter | 指数族 |
| 仿射联络 | Affine Connection | 流形上的"导数" |
| e-联络 | e-Connection | 期望参数化 |
| m-联络 | m-Connection | 自然参数化 |
| 测地线 | Geodesic | 流形上的"直线" |
| 投影 | Projection | 流形间映射 |
| 自然梯度 | Natural Gradient | Fisher 度量下的梯度 |
| 自然梯度下降 | Natural Gradient Descent | 优化方法 |
| 变分推断 | Variational Inference | VI 思想 |
| 指数族 | Exponential Family | 标准分布族 |
| 混合模型 | Mixture Model | 多个分布混合 |

---

## 三、信息几何的关键概念

### 3.1 Fisher 信息矩阵

$$
g_{ij}(\theta) = \mathbb{E}\left[ \frac{\partial \log p(x|\theta)}{\partial \theta_i} \frac{\partial \log p(x|\theta)}{\partial \theta_j} \right]
$$

- 衡量参数估计的"信息量"
- 用作统计流形的黎曼度量

### 3.2 KL 散度

$$
D_{KL}(P \| Q) = \int p(x) \log \frac{p(x)}{q(x)} dx
$$

- 非对称:$D_{KL}(P \| Q) \neq D_{KL}(Q \| P)$
- 布雷格曼散度的特例

### 3.3 自然梯度

$$
\tilde{\nabla}_\theta L = F^{-1} \nabla_\theta L
$$

其中 $F$ 是 Fisher 信息矩阵。

- 优点:不依赖参数化方式
- 等价于 KL 散度最小化方向

### 3.4 指数族的双结构

- **自然参数** $\eta$ 与**期望参数** $\mu$ 双对偶
- **e-联络** 与 **m-联络** 双平坦
- 这是信息几何的"魔幻"

---

## 四、在 ML 中的应用

### 4.1 自然梯度下降(NGD)

- Fisher 信息作为"距离"
- 适合 KL 散度优化
- 例:变分自编码器(VAE)

### 4.2 变分推断(VI)

- 用 KL 散度度量分布距离
- 证据下界(ELBO)推导
- 概率编程的数学基础

### 4.3 生成模型

- **VAE**:隐空间 + KL 正则
- **GAN**:JSD 距离
- **Diffusion**:前向 KL + 反向 KL
- **Normalizing Flow**:微分同胚变换

### 4.4 信息瓶颈(Information Bottleneck)

- 最小化 $I(X;T) - \beta I(T;Y)$
- 信息瓶颈理论
- 与表示学习相关

---

## 五、Fisher 信息矩阵实战

### 5.1 计算

```python
import torch

def fisher_information_matrix(model, data_loader):
    fim = {n: torch.zeros_like(p) for n, p in model.named_parameters()}
    for x, y in data_loader:
        model.zero_grad()
        loss = loss_fn(model(x), y)
        loss.backward()
        for n, p in model.named_parameters():
            fim[n] += p.grad ** 2
    for n in fim:
        fim[n] /= len(data_loader)
    return fim
```

### 5.2 自然梯度

```python
def natural_gradient_step(model, fim, lr=1e-3):
    for n, p in model.named_parameters():
        if n in fim:
            p.data -= lr * p.grad / (fim[n] + 1e-8)
```

### 5.3 K-FAC / Shampoo

- **K-FAC**(Kronecker-Factored Approximate Curvature):FIM 的 Kronecker 分解
- **Shampoo**:类似思路
- 大模型优化的理论基础

---

## 六、深度学习的几何视角

### 6.1 损失景观

- 神经网络参数空间是高维流形
- 损失函数 = 流形上的函数
- 局部极小可能很多(平坦 / 尖锐)

### 6.2 模式连通性

- 不同 SGD 找到的极小点之间有"低损失路径"
- 暗示损失 landscape 可能有"线性模式"
- 启示:模型合并 / 权重平均

### 6.3 神经正切核(NTK)

- 无限宽度网络 → 线性
- NTK 是"Gram 矩阵"
- 信息几何的简化版

---

## 七、生产最佳实践

1. **理解 KL 散度的方向**:前向 KL 偏好"覆盖",反向 KL 偏好"集中"。
2. **VAE 用反向 KL**:训练稳定的潜空间。
3. **GAN 用 JSD**:对称距离,生成器与判别器平衡。
4. **Fisher 信息是优化利器**:K-FAC / Shampoo / Sophia 都基于此。
5. **信息瓶颈指导表示学习**:压缩 + 预测的权衡。
6. **指数族双参数化**:熟悉 $\eta \leftrightarrow \mu$。
7. **自然梯度在小模型中更实用**:大模型 FIM 计算昂贵。
8. **理论指导实践**:Fisher 信息是"信息量"的精确化。

---

## 八、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **K-FAC** | 主流二阶优化 |
| **Shampoo** | Google 主力,大模型应用 |
| **Sophia** | GPT / LLaMA 训练应用 |
| **Fisher 信息** | 理论教学标准 |
| **变分推断** | Pyro / NumPyro / Stan 框架 |
| **自然梯度** | JAX Opt / Optax 支持 |
| **模式连通性** | 模型合并理论基础 |
| **市场规模** | 二阶优化 ARR $50M+ |
| **主要竞品** | K-FAC / Shampoo / Sophia / Soap / Muon |

---

## 九、See Also(官方源)

### 理论教材

- Amari "Information Geometry and Its Applications" [springer.com](https://link.springer.com/book/10.1007/978-4-431-55978-8)
- Ay et al. "Information Geometry" [nowpublishers.com](https://www.nowpublishers.com/article/Details/MAL-076)
- "Information Theory, Inference, and Learning Algorithms" MacKay [inference.org.uk/itila](https://www.inference.org.uk/itila/)

### 论文

- "Natural Gradient Works Efficiently in Learning" Amari [link.springer.com/article/10.1007/BF02345013](https://link.springer.com/article/10.1007/BF02345013)
- "K-FAC" Martens & Grosse [arxiv.org/abs/1503.05671](https://arxiv.org/abs/1503.05671)
- "Shampoo" Gupta et al. [arxiv.org/abs/1802.01548](https://arxiv.org/abs/1802.01548)
- "Sophia" Liu et al. [arxiv.org/abs/2305.14342](https://arxiv.org/abs/2305.14342)
- "Loss Landscape" Li et al. [arxiv.org/abs/1712.09913](https://arxiv.org/abs/1712.09913)
- "Mode Connectivity" Garipov et al. [arxiv.org/abs/1802.10026](https://arxiv.org/abs/1802.10026)

### 工具

- Pyro [github.com/pyro-ppl/pyro](https://github.com/pyro-ppl/pyro)
- NumPyro [github.com/pyro-ppl/numpyro](https://github.com/pyro-ppl/numpyro)
- Stan [mc-stan.org](https://mc-stan.org/)
- Optax [github.com/google-deepmind/optax](https://github.com/google-deepmind/optax)

### 相关

- VAE [arxiv.org/abs/1312.6114](https://arxiv.org/abs/1312.6114)
- Information Bottleneck [arxiv.org/abs/physics/0004057](https://arxiv.org/abs/physics/0004057)

---

## 十、相关概念卡

- [[概念/information-theory|Information Theory]]
- [[概念/probability-statistics|Probability Statistics]]
- [[概念/optimization-theory-ml|Optimization Theory Ml]]
- [[概念/optimization-regularization|Optimization Regularization]]
- [[概念/neural-networks|Neural Networks]]
- [[概念/bayesian-methods|Bayesian Methods]]
- [[概念/feature-engineering|Feature Engineering]]
- [[概念/gradient-descent|Gradient Descent]]
