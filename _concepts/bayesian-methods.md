---
title: "贝叶斯方法 (Bayesian Methods)"
category: -concepts
tags: ["machine-learning", "bayesian", "MCMC", "variational-inference", "probabilistic-programming", "uncertainty"]
relationships:
  - target: "_concepts/probability-statistics"
    type: builds_on
  - target: "_concepts/information-theory"
    type: related_to
  - target: "_concepts/optimization-regularization"
    type: related_to
sources:
  - 02_Machine_Learning/Bayesian_Methods
summary: "贝叶斯方法将参数视为随机变量，通过先验+似然=后验的框架量化不确定性。核心工具包括MCMC采样、变分推断、贝叶斯神经网络和贝叶斯优化。"
provenance:
  extracted: 0.45
  inferred: 0.45
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: stable
tier: core
created: 2026-06-04
updated: 2026-06-04
---

# 贝叶斯方法 (Bayesian Methods)

> 让 AI 不仅给出答案，还告诉你「有多不确定」——概率思维的数学框架。

---

## 1. 定义

**贝叶斯方法**将模型参数 \(\theta\) 视为**随机变量**（而非固定值），通过贝叶斯定理从先验信念和数据中联合推断后验分布：

\[
P(\theta | \mathcal{D}) = \frac{P(\mathcal{D} | \theta) \cdot P(\theta)}{P(\mathcal{D})} = \frac{\text{Likelihood} \times \text{Prior}}{\text{Evidence}}
\]

**核心价值**：不只给出点估计，而是给出完整的**不确定性分布**——知道模型「不知道什么」。

---

## 2. 频率学派 vs 贝叶斯学派

| 维度 | 频率学派 (Frequentist) | 贝叶斯学派 (Bayesian) |
|------|----------------------|---------------------|
| **参数** | 固定但未知的常数 | 随机变量，有分布 |
| **估计** | MLE: \(\hat{\theta} = \arg\max P(D\|\theta)\) | MAP/后验: \(P(\theta\|D)\) |
| **不确定性** | 置信区间 (CI) | 可信区间 (Credible Interval) |
| **先验知识** | 不使用 | 通过先验分布注入 |
| **模型选择** | AIC/BIC、交叉验证 | 贝叶斯因子、ELBO |
| **计算** | 通常解析解 | 通常需要近似推断 |

---

## 3. 核心工具

### 3.1 MCMC 采样 (Markov Chain Monte Carlo)

当后验分布无解析解时，通过构造马尔可夫链从后验中采样：

| 方法 | 原理 | 效率 | 适用场景 |
|------|------|------|----------|
| **Metropolis-Hastings** | 提议-接受/拒绝 | 低（高维） | 通用 |
| **Gibbs Sampling** | 逐维度条件采样 | 中等 | 共轭模型 |
| **HMC (Hamiltonian MC)** | 模拟哈密顿动力学 | 高 | 连续参数空间 |
| **NUTS (No-U-Turn Sampler)** | 自适应 HMC | 最高 | Stan/PyMC 默认 |

### 3.2 变分推断 (Variational Inference, VI)

将后验推断转化为优化问题——在简单分布族 \(\mathcal{Q}\) 中寻找最逼近真实后验的分布：

\[
q^*(\theta) = \arg\min_{q \in \mathcal{Q}} D_{KL}(q(\theta) \| P(\theta|\mathcal{D}))
\]

等价于最大化 **ELBO**（Evidence Lower Bound）：

\[
\text{ELBO} = \mathbb{E}_{q}[\log P(\mathcal{D}|\theta)] - D_{KL}(q(\theta) \| P(\theta))
\]

| 对比 | MCMC | 变分推断 |
|------|------|----------|
| **精度** | 渐近精确 | 有偏（低估不确定性） |
| **速度** | 慢（需大量采样） | 快（优化问题） |
| **可扩展性** | 数据量大时困难 | 支持 mini-batch（SVI） |
| **典型工具** | Stan, PyMC | Pyro, TensorFlow Probability |

### 3.3 贝叶斯神经网络 (BNN)

将神经网络权重视为分布而非点估计：

| 方法 | 原理 | 开销 | 质量 |
|------|------|------|------|
| **Full BNN** | 全部权重为分布 | 极高 | 理论最优 |
| **MC Dropout** | 推理时保持 Dropout | 极低 | 近似贝叶斯 |
| **Bayes by Backprop** | 变分推断训练 BNN | 高 | 好 |
| **SWA-Gaussian** | SGD 轨迹拟合高斯 | 低 | 较好 |
| **Deep Ensemble** | 多个独立训练的模型 | 中 | 实际效果好 |

### 3.4 贝叶斯优化 (Bayesian Optimization)

高效优化昂贵的黑盒函数（如超参数调优）：

```
循环:
1. 高斯过程 (GP) 拟合已知点 → 均值 μ(x) + 不确定性 σ(x)
2. 采集函数 α(x) 平衡 探索(exploration) vs 利用(exploitation)
3. 选择 x* = argmax α(x) 并评估
4. 更新 GP
```

| 采集函数 | 策略 |
|----------|------|
| **EI (Expected Improvement)** | 期望改进最大 |
| **UCB (Upper Confidence Bound)** | 均值 + β×不确定性 |
| **PI (Probability of Improvement)** | 改进概率最大 |

---

## 4. 贝叶斯方法在 LLM 中的应用

| 应用 | 技术 | 说明 |
|------|------|------|
| **不确定性量化** | MC Dropout / Deep Ensemble | 识别 LLM 幻觉（高不确定性 = 可能错误） |
| **超参数调优** | 贝叶斯优化 (Optuna) | 高效搜索学习率、batch size 等 |
| **知识蒸馏** | KL 散度最小化 | 贝叶斯视角下的教师-学生框架 |
| **RLHF** | PPO + 贝叶斯正则化 | 奖励模型的贝叶斯不确定性 |
| **主动学习** | 贝叶斯不确定性采样 | 选择模型最不确定的样本标注 |

---

## 5. 概率编程框架对比

| 框架 | 语言 | 推断引擎 | 特色 |
|------|------|----------|------|
| **Stan** | Stan DSL | NUTS (HMC) | 金标准 MCMC |
| **PyMC** | Python | NUTS + VI | 生态最完善 |
| **Pyro** | Python | SVI (变分) | PyTorch 原生 |
| **NumPyro** | Python | NUTS (JAX) | GPU 加速 MCMC |
| **TensorFlow Probability** | Python | HMC + VI | TFP 生态 |

---

## 6. 局限与开放问题

1. **计算代价**：精确后验推断在高维空间不可行，近似引入偏差
2. **先验选择**：非信息先验的选择缺乏统一标准（Jeffreys, reference priors）
3. **模型错误指定**：如果模型族不含真实数据生成过程，后验可能误导
4. **LLM 规模**：全贝叶斯化十亿参数模型仍不现实，当前主要用 MC Dropout / Ensemble
5. **因果 vs 贝叶斯**：贝叶斯网络编码条件独立，不等于因果关系（需因果贝叶斯网络）

---

## Related

- [[02_Machine_Learning/Bayesian_Methods]] — 贝叶斯方法深度解析
- [[_concepts/probability-statistics]] — 概率统计基础
- [[_concepts/information-theory]] — 信息论（KL 散度与变分推断）
- [[_concepts/optimization-regularization]] — 优化与正则化（贝叶斯视角下的正则化）
