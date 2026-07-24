---
title: "在线学习 / 随机过程 (Online Learning / Stochastic Process / Bandit)"
category: concepts
tags:
  - math
  - online-learning
  - stochastic-process
  - bandit
  - regret
  - adversarial
  - time-series
aliases:
  - Online Learning
  - Stochastic Process
  - Bandit Algorithm
  - Multi-Armed Bandit
  - Regret Analysis
  - Adversarial Learning
  - Time Series
relationships:
  - target: "概念/time-series-analysis"
    type: extends
  - target: "概念/probability-statistics"
    type: related_to
  - target: "概念/optimization-theory-ml"
    type: related_to
  - target: "概念/rlhf"
    type: related_to
summary: "在线学习 / 随机过程是 2024-2026 突破"流式数据 + 持续优化"的关键——Online Learning(在线凸优化 / FTPL / OGD)、Multi-Armed Bandit(UCB / Thompson / 上下文 bandit)、Adversarial Learning、Stochastic Process。在 LLM 时代:持续微调、在线 RLHF、推荐系统、实时决策。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# 在线学习 / 随机过程

> **一句话理解**:在线学习让模型"持续学习"——Online Convex Optimization(OGD / FTPL / Online Mirror Descent)、Multi-Armed Bandit(UCB / Thompson Sampling / Contextual)、Adversarial Online Learning。在 LLM 时代:在线微调、推荐系统、实时决策、广告投放。

---

## 一、为什么需要在线学习?

**批量学习**的痛点:
- 数据全部到达
- 训练一次
- 部署运行
- 难适应新数据

**在线学习**解法:
- 数据逐条到达
- 持续更新
- 适应数据分布变化
- 计算 / 存储高效

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 在线学习 | Online Learning | 逐条 / 逐批学习 |
| 在线凸优化 | Online Convex Optimization(OCO) | 凸函数在线 |
| 在线梯度下降 | Online Gradient Descent(OGD) | 经典算法 |
| Follow The Leader | FTL | 简单在线 |
| Follow The Regularized Leader | FTRL | 工业主流 |
| 在线镜像下降 | Online Mirror Descent(OMD) | 几何视角 |
| 多臂老虎机 | Multi-Armed Bandit(MAB) | 探索 vs 利用 |
| 上置信界 | Upper Confidence Bound(UCB) | bandit 经典 |
| 汤普森采样 | Thompson Sampling | Bayesian bandit |
| 上下文老虎机 | Contextual Bandit | 带特征 |
| 遗憾界 | Regret Bound | 性能指标 |
| 后悔最小化 | Regret Minimization | 框架 |
| 后悔匹配 | Regret Matching | 博弈论 |
| 对抗学习 | Adversarial Learning | 恶意数据 |
| 在线集成 | Online Ensemble | 多个在线模型 |
| 漂移检测 | Drift Detection | 数据分布变化 |
| 概念漂移 | Concept Drift | 标签变化 |
| 随机过程 | Stochastic Process | 时间序列理论 |
| 布朗运动 | Brownian Motion | 维纳过程 |
| 鞅 | Martingale | 公平博弈 |
| 马尔可夫过程 | Markov Process | 无记忆 |

---

## 三、在线学习算法对比(2026-02 快照)

| 算法 | 假设 | 遗憾界 | 适合 |
|---|---|---|---|
| **OGD** | 凸 | O(√T) | 通用 |
| **FTL** | 凸 | O(T) | 教学 |
| **FTRL** | 凸 | O(√T log T) | 工业 |
| **OMD** | 凸 | O(√T) | 几何 |
| **Adagrad** | 凸 + 平滑 | O(√T) | 稀疏 |
| **Adam(在线)** | 凸 + 平滑 | O(√T) | 默认 |
| **Hedge** | 凸 | O(√T) | 集成 |
| **EXP3** | 任意 | O(√T K) | bandit |
| **UCB1** | 亚高斯 | O(√T K log T) | bandit |
| **Thompson Sampling** | Bayesian | 经验性能 | bandit |
| **LinUCB** | 线性 | O(d √T log T) | contextual |
| **神经网络在线学习** | 任意 | 实验 | LLM |

---

## 四、Online Gradient Descent(OGD)详解

### 4.1 步骤

```
For t = 1, 2, ..., T:
    Receive loss function l_t(θ)
    Predict θ_t
    Observe loss l_t(θ_t)
    Update: θ_{t+1} = Π_Θ(θ_t - η_t ∇l_t(θ_t))
```

### 4.2 遗憾界

$$
\text{Regret}(T) = \sum_{t=1}^T l_t(\theta_t) - \min_{\theta^*} \sum_{t=1}^T l_t(\theta^*) \leq O(\sqrt{T})
$$

### 4.3 实战

```python
def ogd(theta, grad, eta, projection):
    theta = theta - eta * grad
    return projection(theta)
```

---

## 五、FTRL 详解(工业主流)

### 5.1 核心思想

$$
\theta_{t+1} = \arg\min_{\theta} \sum_{s=1}^t l_s(\theta) + \frac{1}{2\eta_t} \|\theta - \theta_s\|^2
$$

- "Follow the regularized leader"
- 强凸正则 + 历史损失

### 5.2 优势

- 工程友好
- 稀疏友好
- Google 工业部署 10+ 年

### 5.3 实战

```python
# FTRL-Proximal
def ftrl_proximal(grad, theta, alpha, beta, l1, l2):
    # 累积梯度
    n += grad ** 2
    sigma = (sqrt(n) - sqrt(n_old)) / alpha
    z += grad - sigma * theta
    n_old = n.copy()
    
    # 求解
    theta = sign(z) * max(0, abs(z) - l1) / (l2 + (beta + sqrt(n)) / alpha)
    return theta
```

---

## 六、Multi-Armed Bandit 详解

### 6.1 问题

- K 个 arm(老虎机)
- 每步选一个 arm,获得奖励
- 目标:累计奖励最大化

### 6.2 UCB1

$$
a_t = \arg\max_a \left( \hat{\mu}_a + c \sqrt{\frac{\log t}{n_a}} \right)
$$

- $\hat{\mu}_a$:经验奖励
- $c \sqrt{\log t / n_a}$:探索项

### 6.3 Thompson Sampling

- 假设奖励分布(伯努利 / Beta)
- 后验采样
- 选后验均值最大的

### 6.4 Contextual Bandit

- 每次有特征 $x_t$
- 学习 $\pi(a|x)$
- LinUCB / 神经网络

### 6.5 实战

```python
import numpy as np

class UCB1:
    def __init__(self, n_arms):
        self.n_arms = n_arms
        self.counts = np.zeros(n_arms)
        self.values = np.zeros(n_arms)
    
    def select(self, t):
        # 探索 + 利用
        for a in range(self.n_arms):
            if self.counts[a] == 0:
                return a
        ucb = self.values + np.sqrt(2 * np.log(t) / self.counts)
        return np.argmax(ucb)
    
    def update(self, arm, reward):
        self.counts[arm] += 1
        self.values[arm] += (reward - self.values[arm]) / self.counts[arm]
```

---

## 七、随机过程基础

### 7.1 关键概念

- **马尔可夫链**:无记忆过程
- **平稳分布**:长期分布
- **鞅**:公平博弈
- **布朗运动**:连续鞅
- **泊松过程**:事件计数
- **隐马尔可夫模型(HMM)**:状态 + 观测

### 7.2 应用

- **HMM**:语音识别 / 词性标注
- **MCMC**:见 MCMC 卡
- **强化学习**:状态转移
- **时间序列**:ARIMA / GARCH

---

## 八、在 LLM 中的应用

### 8.1 在线微调

- 数据逐批到达
- 持续 SFT / RLHF
- 避免灾难性遗忘

### 8.2 在线评估

- 实时反馈
- 持续优化
- A/B 测试

### 8.3 推荐 / 搜索

- 多臂 bandit
- 探索 / 利用
- 个性化

### 8.4 广告投放

- Contextual Bandit
- 实时竞价
- 持续学习

---

## 九、生产最佳实践

1. **工业用 FTRL-Proximal**:Google 验证,稀疏高效。
2. **实验用 OGD / OMD**:理论清晰。
3. **Bandit 用 Thompson Sampling**:Bayesian 优雅。
4. **Contextual Bandit 用 LinUCB / 神经网络**:带特征。
5. **在线学习监控**:Regret / 性能 / 漂移。
6. **概念漂移检测**:DDM / ADWIN / Page-Hinkley。
7. **在线 + 离线混合**:冷启动离线,稳定后在线。
8. **灾难性遗忘**:EWC / Rehearsal / 渐进神经网络。
9. **A/B 测试 + 影子部署**:见 MLOps 卡。
10. **数据版本化**:DVC / Delta / Iceberg。

---

## 十、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **FTRL** | Google 10+ 年,工业标配 |
| **Vowpal Wabbit** | Microsoft,在线学习经典 |
| **River** | Python 在线 ML 库 |
| **BanditLib** | Multi-Armed Bandit |
| **Online ML 框架** | Vowpal Wabbit / River / scikit-multiflow |
| **LLM 在线** | Online SFT / Online RLHF |
| **推荐** | Bandit + DL 工业 |
| **市场规模** | 在线学习 ARR $200M+ |
| **主要竞品** | VW / River / scikit-multiflow |

---

## 十一、See Also(官方源)

### 工具

- Vowpal Wabbit [github.com/VowpalWabbit/vowpal_wabbit](https://github.com/VowpalWabbit/vowpal_wabbit)
- River [github.com/online-ml/river](https://github.com/online-ml/river)
- scikit-multiflow [github.com/scikit-multiflow/scikit-multiflow](https://github.com/scikit-multiflow/scikit-multiflow)

### 教材

- "Introduction to Online Convex Optimization" Hazan [arxiv.org/abs/1909.05207](https://arxiv.org/abs/1909.05207)
- "Regret Analysis of Stochastic and Nonstochastic Multi-armed Bandit Problems" Bubeck [arxiv.org/abs/1204.5721](https://arxiv.org/abs/1204.5721)
- "Prediction, Learning, and Games" Cesa-Bianchi & Lugosi [nowpublishers.com](https://www.nowpublishers.com/article/Details/MAL-012)

### 论文

- FTRL McMahan et al. [proceedings.mlr.press/v15/mcmahan11b.html](https://proceedings.mlr.press/v15/mcmahan11b.html)
- Adagrad Duchi et al. [jmlr.org/papers/v12/duchi11a.html](https://www.jmlr.org/papers/v12/duchi11a.html)
- UCB1 Auer et al. [link.springer.com/article/10.1007/s004539910001](https://link.springer.com/article/10.1007/s004539910001)
- Thompson Sampling [proceedings.mlr.press/v23/agrawal12.html](https://proceedings.mlr.press/v23/agrawal12.html)
- LinUCB [arxiv.org/abs/1003.0146](https://arxiv.org/abs/1003.0146)

### 漂移检测

- DDM [github.com/scikit-multiflow/scikit-multiflow](https://github.com/scikit-multiflow/scikit-multiflow)
- ADWIN [github.com/online-ml/river](https://github.com/online-ml/river)

---

## 十二、相关概念卡

- [[概念/time-series-analysis|Time Series Analysis]]
- [[概念/probability-statistics|Probability Statistics]]
- [[概念/optimization-theory-ml|Optimization Theory Ml]]
- [[概念/rlhf|Rlhf]]
- [[概念/bayesian-methods|Bayesian Methods]]
- [[概念/mcmc-vi|Mcmc Vi]]
- [[概念/feature-engineering|Feature Engineering]]
- [[概念/reinforcement-learning|Reinforcement Learning]]
