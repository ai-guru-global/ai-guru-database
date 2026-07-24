---
title: "蒙特卡洛方法与变分推断 (MCMC / VI / M-H / HMC / NUTS / 采样算法)"
category: concepts
tags:
  - math
  - monte-carlo
  - mcmc
  - variational-inference
  - hamiltonian-mc
  - nuts
  - sampling
aliases:
  - MCMC
  - Monte Carlo Methods
  - Variational Inference
  - VI
  - M-H Sampling
  - HMC
  - NUTS
  - Metropolis-Hastings
  - Hamiltonian Monte Carlo
relationships:
  - target: "概念/bayesian-methods"
    type: extends
  - target: "概念/probability-statistics"
    type: related_to
  - target: "概念/information-geometry"
    type: related_to
  - target: "概念/feature-engineering"
    type: related_to
summary: "蒙特卡洛(MCMC)与变分推断(VI)是 2024-2026 贝叶斯 ML 的两大主流——MCMC 精准但慢(M-H / HMC / NUTS / Slice),VI 快但近似(平均场 / 摊销 / 引导流)。在 LLM 时代表现为:RLHF 中的 MC 估计、扩散模型采样、贝叶斯神经网络。是"概率机器学习"的根。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# 蒙特卡洛方法与变分推断

> **一句话理解**:MCMC 与 VI 是贝叶斯推断的"两大武器"——MCMC 精准采样(M-H / HMC / NUTS / Slice / Gibbs),VI 快速近似(平均场 / 摊销 / 引导流)。在 LLM 时代:RLHF 中 MC 估计 PPO、扩散模型 DDPM 采样、贝叶斯 LLM 推理。是"概率 ML"的根。

---

## 一、为什么需要 MCMC / VI?

**问题**:贝叶斯推断需要后验 $p(\theta|x)$,
$$
p(\theta|x) = \frac{p(x|\theta) p(\theta)}{p(x)}
$$

但分母(证据)$p(x) = \int p(x|\theta) p(\theta) d\theta$ 在高维空间**难计算**。

**MCMC 解法**:从后验采样,逼近分布。
**VI 解法**:用简单分布 $q(\theta)$ 近似后验,优化 KL 散度。

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 蒙特卡洛 | Monte Carlo | 随机模拟方法 |
| 马尔可夫链 | Markov Chain | 无记忆状态序列 |
| 蒙特卡洛马尔可夫链 | Markov Chain Monte Carlo(MCMC) | MCMC |
| Metropolis-Hastings | M-H Sampling | 经典 MCMC |
| 哈密顿蒙特卡洛 | Hamiltonian Monte Carlo(HMC) | 物理启发 |
| 纽曼无 U 转折采样 | No-U-Turn Sampler(NUTS) | HMC 自动 |
| 吉布斯采样 | Gibbs Sampling | 条件采样 |
| 切片采样 | Slice Sampling | 几何 |
| 变分推断 | Variational Inference(VI) | 近似后验 |
| 平均场 | Mean-Field | 假设独立 |
| 摊销变分推断 | Amortized VI | 神经网络参数化 |
| 引导流 | Normalizing Flow | 可逆变换 |
| 证据下界 | Evidence Lower Bound(ELBO) | VI 优化目标 |
| 重要性采样 | Importance Sampling | 估计期望 |
| 拒绝采样 | Rejection Sampling | 简单实现 |
| 后验 | Posterior | $p(\theta|x)$ |
| 先验 | Prior | $p(\theta)$ |
| 似然 | Likelihood | $p(x|\theta)$ |
| 自相关 | Autocorrelation | 采样相关性 |
| 预热 | Burn-in | 丢弃初始样本 |
| 有效样本量 | Effective Sample Size(ESS) | 质量指标 |

---

## 三、MCMC 算法对比

| 算法 | 接受率 | 速度 | 适用 | 代表 |
|---|---|---|---|---|
| **Metropolis-Hastings** | 自适应 | 慢 | 通用 | MCMC 经典 |
| **Gibbs Sampling** | 100% | 中 | 条件易采 | BUGS / JAGS |
| **Slice Sampling** | 自适应 | 中 | 单变量 | Neal 2003 |
| **HMC** | 接近 100% | 快(梯度) | 连续分布 | Duane 1987 |
| **NUTS** | 100%(自动) | 快 | 默认选择 | Stan 默认 |
| **Langevin MC** | 高 | 快 | 大规模 | Welling 2011 |
| **SGLD** | 高 | 快 | 在线学习 | Mandt 2017 |
| **HMC-NUTS** | 100% | 最快 | 主流 | Stan / PyMC |

---

## 四、Metropolis-Hastings 详解

### 4.1 核心思想

1. 从当前状态 $\theta$ 提出 $\theta'$
2. 计算接受率 $\alpha = \min\left(1, \frac{p(\theta'|x) q(\theta|\theta')}{p(\theta|x) q(\theta'|\theta)}\right)$
3. 以 $\alpha$ 概率接受

### 4.2 优缺点

- ✓ 通用、简单
- ✓ 渐近正确
- ✗ 维数灾难(> 100 维困难)
- ✗ 自相关长(需要稀疏化)

---

## 五、HMC 详解

### 5.1 核心思想

引入辅助动量 $p$,构造哈密顿量:
$$
H(\theta, p) = U(\theta) + K(p) = -\log p(\theta|x) + \frac{1}{2}p^T M^{-1} p
$$

- 模拟物理系统
- Leap-frog 积分
- 长轨迹

### 5.2 优势

- 高维友好
- 低自相关
- 高接受率

### 5.3 工具

- **Stan** [mc-stan.org](https://mc-stan.org/)(NUTS 默认)
- **PyMC** [github.com/pymc-devs/pymc](https://github.com/pymc-devs/pymc)
- **NumPyro** [github.com/pyro-ppl/numpyro](https://github.com/pyro-ppl/numpyro)

---

## 六、NUTS 详解

### 6.1 核心思想

HMC 的自动调参:
- 自动选择 leap-frog 步数
- 自动选择步长
- 不用手动调

### 6.2 优势

- 默认采样器(Stan / PyMC)
- 几乎不用调参
- 大数据友好

### 6.3 实战

```python
import pymc as pm
import numpy as np

with pm.Model() as model:
    # 先验
    mu = pm.Normal("mu", mu=0, sigma=10)
    sigma = pm.HalfNormal("sigma", sigma=1)
    
    # 似然
    obs = pm.Normal("obs", mu=mu, sigma=sigma, observed=data)
    
    # NUTS 采样
    trace = pm.sample(2000, nuts_sampler="numpyro", chains=4)
```

---

## 七、变分推断(VI)详解

### 7.1 核心思想

用简单分布 $q(\theta)$ 近似 $p(\theta|x)$:
$$
\min_{q} D_{KL}(q(\theta) \| p(\theta|x))
$$

### 7.2 ELBO

$$
\log p(x) \geq \mathbb{E}_{q(\theta)}[\log p(x|\theta)] - D_{KL}(q(\theta) \| p(\theta)) = \text{ELBO}
$$

最大化 ELBO = 最小化 KL

### 7.3 平均场 VI

- 假设 $q(\theta) = \prod_i q(\theta_i)$
- 坐标上升
- 简单但假设强

### 7.4 摊销变分推断(AVI)

- 用神经网络参数化 $q_\phi$
- 一个网络,所有数据
- VAE 经典

### 7.5 引导流(Normalizing Flow)

- 用可逆变换 $f$ 构造复杂分布
- RealNVP / Glow / FFJORD

---

## 八、Pyro / NumPyro 实战

```python
import pyro
import pyro.distributions as dist
from pyro.infer import MCMC, NUTS

def model(data):
    mu = pyro.sample("mu", dist.Normal(0, 10))
    sigma = pyro.sample("sigma", dist.HalfNormal(1))
    with pyro.plate("data", len(data)):
        pyro.sample("obs", dist.Normal(mu, sigma), obs=data)

# NUTS 采样
kernel = NUTS(model)
mcmc = MCMC(kernel, num_samples=2000, warmup_steps=500)
mcmc.run(data)
```

---

## 九、生产最佳实践

1. **首选 NUTS**:Stan / PyMC / NumPyro 默认。
2. **简单后验用 M-H**:教学 / 简单问题。
3. **大模型 / 在线用 SGLD**:随机梯度,在线。
4. **实时应用用 VI**:比 MCMC 快 100-1000x。
5. **MCMC 验收**:ESS / 自相关 / 多链。
6. **VI 用引导流**:质量高。
7. **Pyro / NumPyro 是 JAX 友好**:GPU 加速。
8. **Stan 是 R / Python 友好**:传统。
9. **贝叶斯神经网络**:MCMC 慢,VI 主流。
10. **理论 + 实践**:MCMC 渐近正确,VI 近似。

---

## 十、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **Stan** | v2.36,经典 SOTA |
| **PyMC** | v5.0,Python 友好 |
| **NumPyro** | v0.18,JAX 加速 |
| **Pyro** | v1.9,Uber |
| **BlackJAX** | v0.9,JAX 加速 |
| **扩散模型** | DDPM / DDIM 用 MCMC 思想 |
| **RLHF** | MC 估计 |
| **贝叶斯 LLM** | 2026 研究热点 |
| **市场规模** | 概率编程 $200M+ |
| **主要竞品** | Stan / PyMC / NumPyro / BlackJAX |

---

## 十一、See Also(官方源)

### 工具

- Stan [mc-stan.org](https://mc-stan.org/)
- PyMC [github.com/pymc-devs/pymc](https://github.com/pymc-devs/pymc)
- NumPyro [github.com/pyro-ppl/numpyro](https://github.com/pyro-ppl/numpyro)
- Pyro [github.com/pyro-ppl/pyro](https://github.com/pyro-ppl/pyro)
- BlackJAX [github.com/blackjax-devs/blackjax](https://github.com/blackjax-devs/blackjax)
- TensorFlow Probability [github.com/tensorflow/probability](https://github.com/tensorflow/probability)

### 教材

- "Bayesian Data Analysis" Gelman [stat.columbia.edu/~gelman/book](https://stat.columbia.edu/~gelman/book/)
- "Monte Carlo Statistical Methods" Robert & Casella [springer.com](https://link.springer.com/book/10.1007/978-1-4757-4145-2)
- "Pattern Recognition and Machine Learning" Bishop [microsoft.com/en-us/research/people/cmbishop](https://www.microsoft.com/en-us/research/people/cmbishop/)

### 论文

- HMC Duane et al. [arxiv.org/abs/2212.07854](https://arxiv.org/abs/2212.07854) (重述)
- NUTS Hoffman & Gelman [arxiv.org/abs/1111.4246](https://arxiv.org/abs/1111.4246)
- VI Blei et al. [arxiv.org/abs/1601.00670](https://arxiv.org/abs/1601.00670)
- VAE Kingma & Welling [arxiv.org/abs/1312.6114](https://arxiv.org/abs/1312.6114)
- Normalizing Flow [arxiv.org/abs/1505.05770](https://arxiv.org/abs/1505.05770)

---

## 十二、相关概念卡

- [[概念/bayesian-methods|Bayesian Methods]]
- [[概念/probability-statistics|Probability Statistics]]
- [[概念/information-geometry|Information Geometry]]
- [[概念/feature-engineering|Feature Engineering]]
- [[概念/optimization-theory-ml|Optimization Theory Ml]]
- [[概念/gradient-descent|Gradient Descent]]
- [[概念/anomaly-detection|Anomaly Detection]]
- [[概念/diffusion-llm-inference|Diffusion Llm Inference]]
