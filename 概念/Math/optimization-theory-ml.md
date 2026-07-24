---
title: "优化理论 / 凸优化 (Convex Optimization / ADMM / Proximal / 深度学习优化)"
category: concepts
tags:
  - math
  - optimization
  - convex-optimization
  - admm
  - proximal-method
  - lasso
  - sgd
aliases:
  - Convex Optimization
  - ADMM
  - Proximal Methods
  - LASSO
  - SGD Theory
  - Deep Learning Optimization
relationships:
  - target: "概念/optimization-regularization"
    type: extends
  - target: "概念/gradient-descent"
    type: related_to
  - target: "概念/linear-algebra"
    type: related_to
  - target: "概念/probability-statistics"
    type: related_to
summary: "凸优化是 2024-2026 ML 理论核心——凸集、凸函数、LASSO、Ridge、ADMM(交替方向乘子法)、Proximal Methods(近端方法)、SGD / Adam 理论。是深度学习优化器、模型正则化、大规模优化的数学基础。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# 凸优化 / Convex Optimization

> **一句话理解**:凸优化是 ML 的"数学之母"——凸集、凸函数、LASSO、Ridge、ADMM、Proximal、随机梯度下降(SGD)理论。深度学习所有优化器(SGD / Adam / Lion / Shampoo)的理论基础,是理解"为什么这能收敛"的必备。

---

## 一、什么是凸优化?

凸优化问题:
- 目标函数 **凸函数**
- 可行域 **凸集**
- 局部最优 = 全局最优

**核心价值**:理论保证 + 实用算法成熟。

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 凸集 | Convex Set | 两点连线仍在集内 |
| 凸函数 | Convex Function | f(λx+(1-λ)y) ≤ λf(x)+(1-λ)f(y) |
| 凸优化 | Convex Optimization | 凸问题的求解 |
| 强凸 | Strongly Convex | 强凸函数 |
| 光滑 | Smooth | Lipschitz 连续梯度 |
| LASSO | L1-Regularized Least Squares | L1 正则化 |
| Ridge | L2-Regularized Least Squares | L2 正则化 |
| Elastic Net | Elastic Net | L1 + L2 |
| 交替方向乘子法 | Alternating Direction Method of Multipliers(ADMM) | 大规模优化 |
| 近端方法 | Proximal Methods | 处理非光滑 |
| 近端算子 | Proximal Operator | 近端映射 |
| 镜像下降 | Mirror Descent | 几何视角 |
| 次梯度 | Subgradient | 不可微情况 |
| 拉格朗日对偶 | Lagrangian Duality | 对偶问题 |
| KKT 条件 | Karush-Kuhn-Tucker Conditions | 最优性条件 |
| 投影梯度法 | Projected Gradient | 约束优化 |
| 随机梯度下降 | Stochastic Gradient Descent(SGD) | ML 标准 |
| 小批量 SGD | Mini-Batch SGD | 实际使用 |
| Adam | Adaptive Moment Estimation | 自适应学习率 |
| L-BFGS | Limited-memory BFGS | 拟牛顿法 |

---

## 三、凸优化分类

| 类别 | 例子 | 求解器 |
|---|---|---|
| **线性规划(LP)** | 单纯形法 | GLPK / CPLEX / Gurobi |
| **二次规划(QP)** | SVM | OSQP / Gurobi |
| **二次约束 QCQP** | 投资组合 | Gurobi |
| **二阶锥规划(SOCP)** | Lasso 变种 | ECOS / Mosek |
| **半正定规划(SDP)** | Max-Cut | Mosek / SCS |
| **几何规划(GP)** | 电路设计 | GGPLAB |
| **锥规划(CP)** | 统一框架 | Mosek / Gurobi |

---

## 四、LASSO 与稀疏性

### 4.1 LASSO

$$
\min_{\beta} \frac{1}{2n} \|y - X\beta\|_2^2 + \lambda \|\beta\|_1
$$

- L1 范数 → 稀疏解(部分 β = 0)
- 用于特征选择

### 4.2 Ridge

$$
\min_{\beta} \frac{1}{2n} \|y - X\beta\|_2^2 + \lambda \|\beta\|_2^2
$$

- L2 范数 → 小系数
- 不稀疏但稳定

### 4.3 Elastic Net

- L1 + L2 结合
- 处理 p > n(变量多于样本)

---

## 五、ADMM 详解

### 5.1 思想

分解大问题为小子问题:
$$
\min f(x) + g(z) \quad s.t. \quad Ax + Bz = c
$$

**增广拉格朗日**:
$$
L_\rho(x,z,\lambda) = f(x) + g(z) + \lambda^T(Ax+Bz-c) + \frac{\rho}{2}\|Ax+Bz-c\|_2^2
$$

### 5.2 更新规则

```
x^{k+1} = argmin_x L_ρ(x, z^k, λ^k)
z^{k+1} = argmin_z L_ρ(x^{k+1}, z, λ^k)
λ^{k+1} = λ^k + ρ(Ax^{k+1} + Bz^{k+1} - c)
```

### 5.3 应用

- LASSO
- 矩阵分解
- 分布式优化
- 大规模 ML

### 5.4 工具

- CVXPY [github.com/cvxpy/cvxpy](https://github.com/cvxpy/cvxpy)
- OSQP [github.com/osqp/osqp](https://github.com/osqp/osqp)
- Mosek [mosek.com](https://www.mosek.com/)

---

## 六、近端方法

### 6.1 近端算子

$$
\text{prox}_{\lambda f}(v) = \arg\min_x \left( f(x) + \frac{1}{2\lambda}\|x-v\|_2^2 \right)
$$

### 6.2 ISTA / FISTA

- ISTA:近端梯度法
- FISTA:加速版(Nesterov 加速)
- 用于 LASSO / 稀疏编码

### 6.3 实战(LASSO 用 ISTA)

```python
def ista(X, y, lmbda, n_iter=1000):
    n, d = X.shape
    L = np.linalg.norm(X, 2)**2 / n  # Lipschitz
    beta = np.zeros(d)
    for _ in range(n_iter):
        grad = -X.T @ (y - X @ beta) / n
        beta = soft_threshold(beta - grad / L, lmbda / L)
    return beta

def soft_threshold(x, t):
    return np.sign(x) * np.maximum(np.abs(x) - t, 0)
```

---

## 七、深度学习优化理论

### 7.1 SGD 理论

- 收敛率:O(1/√T) 凸,O(1/T) 强凸
- 方差缩减:SVRG / SAGA
- 学习率调度

### 7.2 自适应优化器

- **Adam**(2015):一阶 + 二阶动量
- **AdamW**(2019):解耦权重衰减
- **Lion**(2023,Google):符号动量
- **Shampoo**(2018,Google):二阶近似
- **Sophia**(2023,Stanford):对角 Hessian 近似

### 7.3 大模型优化挑战

- 损失函数 landscape 极复杂
- Loss spike / collapse
- 二阶信息难用(> 1B 参数)
- 分布式优化

---

## 八、生产最佳实践

1. **小规模问题用 CVXPY**:建模简洁,自动选求解器。
2. **大规模 ML 用 SGD / AdamW**:实践验证,理论保障弱。
3. **LASSO 用 FISTA / ADMM**:高效求解。
4. **大模型用 AdamW**:解耦权重衰减,稳定。
5. **凸性验证**:ML 实际不凸,凸优化是"参考点"。
6. **学习率调度**:Warmup + Cosine。
7. **梯度裁剪**:防止 loss spike。
8. **混合精度**:FP16 + FP32 优化器状态。
9. **ZeRO / FSDP**:大模型训练必用。
10. **理论 + 实践结合**:理论提供洞察,实践给效果。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **CVXPY** | v1.6,标准建模工具 |
| **OSQP** | v0.6,QP SOTA |
| **Mosek** | v11,商业 SOTA |
| **PyTorch Optim** | AdamW / Lion / Shampoo |
| **JAX Opt** | 谷歌优化库 |
| **分布式优化** | DeepSpeed / FSDP / Megatron |
| **理论** | 二阶优化、分布式、随机优化 |
| **市场规模** | 优化器 ARR $200M+(含商业) |
| **主要竞品** | CVXPY / OSQP / Mosek / PyTorch / JAX / Gurobi / CPLEX |

---

## 十、See Also(官方源)

### 求解器

- CVXPY [github.com/cvxpy/cvxpy](https://github.com/cvxpy/cvxpy)
- OSQP [github.com/osqp/osqp](https://github.com/osqp/osqp)
- Mosek [mosek.com](https://www.mosek.com/)
- Gurobi [gurobi.com](https://www.gurobi.com/)
- ECOS [github.com/embotech/ecos](https://github.com/embotech/ecos)

### 机器学习

- Adam [arxiv.org/abs/1412.6980](https://arxiv.org/abs/1412.6980)
- AdamW [arxiv.org/abs/1711.05101](https://arxiv.org/abs/1711.05101)
- Lion [arxiv.org/abs/2302.06675](https://arxiv.org/abs/2302.06675)
- Shampoo [arxiv.org/abs/1802.01548](https://arxiv.org/abs/1802.01548)
- Sophia [arxiv.org/abs/2305.14342](https://arxiv.org/abs/2305.14342)

### 教材

- Boyd & Vandenberghe "Convex Optimization" [stanford.edu/~boyd/cvxbook](https://stanford.edu/~boyd/cvxbook/)
- "Proximal Algorithms" [proximal-operator.herokuapp.com](https://proximal-operator.herokuapp.com/)
- "ADMM" 综述 [web.stanford.edu/~boyd/papers/admm_distr_stats.html](https://web.stanford.edu/~boyd/papers/admm_distr_stats.html)

### 工具

- PyTorch Optim [pytorch.org/docs/stable/optim.html](https://pytorch.org/docs/stable/optim.html)
- JAX Opt [github.com/google-deepmind/optax](https://github.com/google-deepmind/optax)
- Optax [github.com/google-deepmind/optax](https://github.com/google-deepmind/optax)

---

## 十一、相关概念卡

- [[概念/optimization-regularization|Optimization Regularization]]
- [[概念/gradient-descent|Gradient Descent]]
- [[概念/linear-algebra|Linear Algebra]]
- [[概念/probability-statistics|Probability Statistics]]
- [[概念/zero-redundancy-optimizers|Zero Redundancy Optimizers]]
- [[概念/pre-training|Pre Training]]
- [[概念/distributed-training|Distributed Training]]
- [[概念/feature-engineering|Feature Engineering]]
