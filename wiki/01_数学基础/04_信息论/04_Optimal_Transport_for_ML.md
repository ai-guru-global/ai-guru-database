---
title: "最优传输与机器学习: 从 Monge 问题到 WGAN 和 LLM 对齐"
category: "01-fundamentals-information-theory"
tags: ["optimal-transport", "wasserstein-distance", "WGAN", "sinkhorn-algorithm", "generative-models", "domain-adaptation", "fairness", "LLM-alignment"]
summary: "> **一句话理解**: 最优传输回答'把一个分布变成另一个分布的最小代价是多少'——Wasserstein 距离为生成模型提供了比 KL 散度更鲁棒的度量，WGAN 解决了训练不稳定性，Sinkhorn 算法让 OT 可扩展到大规模数据，2026年 OT 正在进入 LLM 对齐的前沿。"
created: 2026-07-19
updated: 2026-07-19
tier: supporting
aliases:
  - "Optimal Transport for ML"
  - Optimal_Transport_for_ML
sources: []

name_zh: "最优传输与机器学习: 从 Monge 问题到 WGAN 和 LLM 对齐"
---
# 最优传输与机器学习: 从 Monge 问题到 WGAN 和 LLM 对齐

> 中文简称：最优传输与机器学习: 从 Monge 问题到 WGAN 和 LLM 对齐

> **一句话理解**: 最优传输回答"把一个分布变成另一个分布的最小代价是多少"——Wasserstein 距离为生成模型提供了比 KL 散度更鲁棒的度量，WGAN 解决了训练不稳定性，Sinkhorn 算法让 OT 可扩展到大规模数据，2026年 OT 正在进入 LLM 对齐的前沿。

---

## 1. 概述 (Overview)

### 1.1 为什么 ML 需要最优传输

```
最优传输 (Optimal Transport, OT) 的核心问题:
├── 给定源分布 μ 和目标分布 ν
├── 找到"搬运方案"将 μ 的质量移动到 ν
├── 使得总搬运代价最小
└── 最小代价 = Wasserstein 距离

为什么 ML 需要 OT:
┌─────────────────────────────────────────────────────────────────────┐
│  传统度量的问题              OT 的优势                              │
├────────────────────────────┬────────────────────────────────────────┤
│  KL 散度: 不对称,          │  Wasserstein: 对称, 真正的度量         │
│  支撑集不重叠时 = ∞        │  即使支撑集不重叠也有限                │
│  JS 散度: 不重叠时常数     │  提供有意义的梯度                      │
│  TV 距离: 不反映几何       │  编码底层空间的几何结构                │
│  MMD: 依赖核选择           │  有清晰的物理/几何解释                 │
└────────────────────────────┴────────────────────────────────────────┘

ML 中的应用版图:
├── 生成模型: WGAN, OT-GAN, 扩散模型中的 OT 路径
├── 域适应: 对齐源域和目标域的特征分布
├── 公平性: 确保模型输出对不同群体"传输公平"
├── 单细胞生物学: 细胞轨迹推断 (Waddington-OT)
├── NLP: 文本相似度 (Word Mover's Distance)
├── 强化学习: 分布鲁棒优化
└── LLM 对齐: 2026前沿探索
```

### 1.2 历史脉络

```
1781  Monge 提出原始问题 (土方工程)
1942  Kantorovich 线性规划松弛 → 对偶理论
1958  Kantorovich 获诺贝尔经济学奖 (资源分配)
2013  Cuturi: Sinkhorn 算法 — OT 计算复杂度从 O(n³log n) 到 O(n²)
2017  WGAN (Arjovsky et al.) — OT 在深度学习的爆发点
2018  WGAN-GP, OT-GAN, Sliced Wasserstein
2020s OT 在扩散模型、公平性、生物学中广泛应用
2025-2026  OT 在 LLM 对齐、多模态对齐中的前沿探索
```

---

## 2. 核心定义与定理

### 2.1 Monge 问题 (1781)

```
原始问题 (Monge's Problem):
给定:
  - 源概率测度 μ ∈ P(X) (如: 土方的初始分布)
  - 目标概率测度 ν ∈ P(Y) (如: 土方的目标分布)
  - 代价函数 c: X × Y → R₊ (如: 欧氏距离 |x-y|²)

寻找: 传输映射 T: X → Y，使得:
  (1) T#μ = ν  (T 把 μ 推前为 ν，即质量守恒)
  (2) 最小化: inf_T ∫_X c(x, T(x)) dμ(x)

Monge 问题的困难:
  1. 约束 T#μ = ν 是非线性的
  2. 可能无解: 若 μ = δ₀ (Dirac), ν 非退化
     → 一个点的质量不能"分裂"到多个目标!
  3. 即使有解，优化空间 (所有可测映射) 太大
  → 需要松弛...
```

### 2.2 Kantorovich 松弛与对偶

```
Kantorovich 松弛 (1942):
允许"质量分裂" — 用耦合 (coupling) 替代映射:

  γ ∈ Π(μ,ν) = {γ ∈ P(X×Y) : π₁#γ = μ, π₂#γ = ν}
  γ(x,y) 表示"从 x 运到 y 的质量比例"

Kantorovich 问题:
  W_c(μ,ν) = inf_{γ ∈ Π(μ,ν)} ∫_{X×Y} c(x,y) dγ(x,y)

为什么 Kantorovich 松弛更好:
  1. 约束是线性的! (边际约束)
  2. 总是有解 (Π(μ,ν) 非空: μ⊗ν ∈ Π(μ,ν))
  3. 是线性规划 → 有强对偶
  4. 当最优 γ 集中在图 {(x,T(x))} 上时，退化为 Monge 解

Kantorovich 对偶:
  W_c(μ,ν) = sup_{(φ,ψ) ∈ Φ_c} ∫φ dμ + ∫ψ dν
  其中 Φ_c = {(φ,ψ) : φ(x) + ψ(y) ≤ c(x,y), ∀x,y}

  进一步简化 (c-变换):
  W_c(μ,ν) = sup_φ ∫φ dμ + ∫φ^c dν
  其中 φ^c(y) = inf_x [c(x,y) - φ(x)]

对偶的 ML 意义:
  φ 和 ψ 称为 Kantorovich 势 (Kantorovich potentials)
  WGAN 的判别器 (critic) 就是在优化 Kantorovich 势!

  W₁(μ,ν) = sup_{‖f‖_L ≤ 1} E_μ[f(x)] - E_ν[f(y)]
  其中 ‖f‖_L = sup_{x≠y} |f(x)-f(y)|/|x-y| (Lipschitz 常数)
  → 判别器 f 就是 1-Lipschitz 的 Kantorovich 势!
```

### 2.3 Wasserstein 距离

```
定义 (p-Wasserstein 距离):
  W_p(μ,ν) = (inf_{γ ∈ Π(μ,ν)} ∫ |x-y|^p dγ(x,y))^{1/p}

特殊情况:
┌─────────────────────────────────────────────────────────────────┐
│  W₁ (Earth Mover's Distance):                                   │
│  W₁(μ,ν) = inf_γ ∫|x-y| dγ(x,y)                             │
│           = sup_{‖f‖_L≤1} E_μ[f] - E_ν[f]  (Kantorovich-Rubinstein)│
│  直觉: 移动单位质量的最小"功"                                  │
│                                                                 │
│  W₂ (二次 Wasserstein):                                         │
│  W₂²(μ,ν) = inf_γ ∫|x-y|² dγ(x,y)                           │
│  性质: 赋予 P₂(R^d) 黎曼流形结构 (Otto 微积分)               │
│  应用: 梯度流、扩散模型                                        │
│                                                                 │
│  W_∞:                                                           │
│  W_∞(μ,ν) = inf_γ ess-sup_{(x,y)~γ} |x-y|                   │
│  直觉: 最远的那个点需要移动多远                                 │
└─────────────────────────────────────────────────────────────────┘

Wasserstein 距离的性质:
  (1) 对称性: W_p(μ,ν) = W_p(ν,μ)
  (2) 三角不等式: W_p(μ,ρ) ≤ W_p(μ,ν) + W_p(ν,ρ)
  (3) 正定性: W_p(μ,ν) = 0 ⟺ μ = ν
  (4) metrizes 弱收敛 + 矩收敛
  → 是真正的度量! (KL 散度不是)
```

### 2.4 离散 OT 与熵正则化

```
经验测度上的 OT:
  μ = Σᵢ aᵢ δ_{xᵢ},  ν = Σⱼ bⱼ δ_{yⱼ}
  传输计划: 矩阵 P ∈ R^{n×m}, Pᵢⱼ = 从 xᵢ 运到 yⱼ 的质量
  约束: P·1_m = a, P^T·1_n = b, P ≥ 0
  目标: min_P <C, P> = Σᵢⱼ Cᵢⱼ Pᵢⱼ

计算复杂度:
  - 精确解 (线性规划): O(n³ log n)
  - Sinkhorn (熵正则化): O(n² · k), k 为迭代次数
  - Sliced Wasserstein: O(n log n · K), K 为投影方向数

熵正则化 OT (Cuturi, 2013):
  W_ε(μ,ν) = min_{P ∈ Π(a,b)} <C, P> + ε·H(P)
  其中 H(P) = -Σᵢⱼ Pᵢⱼ (log Pᵢⱼ - 1)
  ε → 0: 恢复精确 OT; ε > 0: 光滑化，可用 Sinkhorn 迭代

Sinkhorn 算法:
  初始化: K = exp(-C/ε)  (Gibbs 核)
  迭代:
    u ← a / (K·v)      (行归一化)
    v ← b / (K^T·u)    (列归一化)
  收敛: P* = diag(u) · K · diag(v)

为什么 Sinkhorn 有效:
  1. 熵正则化使目标严格凸 → 唯一解
  2. KKT 条件 → 交替投影 (Bregman 投影)
  3. 每步迭代: O(n²) 矩阵-向量乘
  4. 几何收敛速率: O(exp(-ε·k))
  5. 完全可微! → 可以嵌入深度学习 pipeline

数值稳定性:
  - 直接在 log 域操作 (log-Sinkhorn)
  - ε 太小 → 数值不稳定; ε 太大 → 偏离真实 OT
```

### 2.5 Brenier 定理与半离散 OT

```
Brenier 定理 (二次代价的特殊结构):
  若 c(x,y) = |x-y|²/2 且 μ 绝对连续:
  → 存在唯一最优映射 T = ∇φ (某个凸函数 φ 的梯度)
  → Monge 问题有解!
  → 这给出了 P₂(R^d) 上的黎曼结构 (Otto 微积分)

半离散 OT (一个连续，一个离散):
  μ 连续, ν = Σⱼ bⱼ δ_{yⱼ}
  → 最优传输将空间分割为 Laguerre 胞腔 (power diagram)
  → 对偶变量 ψ ∈ R^m (有限维!)
  应用: 生成模型 (连续数据→离散码本), 最优向量量化
  参见: [[Vector_Quantization]]
```

---

## 3. 直觉解释 (Intuition)

### 3.1 土方工程类比

```
原始直觉 (Monge, 1781):

  你有一堆土 (源分布 μ) 需要填到一个坑里 (目标分布 ν)
  每搬运一单位土走一单位距离花费 1 元
  问题: 最省钱的搬运方案是什么？

  ┌─────────────────────────────────────────────────────┐
  │  源 (土堆)          目标 (坑)                       │
  │    ██               ░░░░                           │
  │   ████    →        ░░░░░░    代价 = Σ 质量×距离   │
  │    ██               ░░░░                           │
  │  最优方案: 就近搬运，不要交叉!                     │
  │  (交叉的运输线可以交换端点来减少总距离)            │
  └─────────────────────────────────────────────────────┘

  W₁ = 最小总搬运费; W₂ = 最小总搬运费 (距离按平方计算)
  关键洞察: OT 编码了几何!
  - 两个分布"形状相似但位置不同" → W 小
  - 两个分布"形状完全不同" → W 大
  - KL 散度完全忽略几何!
```

### 3.2 Wasserstein vs KL: 几何直觉

```
例: 两个 1D 高斯 N(m₁, σ²) 和 N(m₂, σ²)
  KL(N(m₁,σ²) ‖ N(m₂,σ²)) = (m₁-m₂)²/(2σ²)
  W₂(N(m₁,σ²), N(m₂,σ²)) = |m₁-m₂|

  当 σ → 0 (分布退化为 Dirac):
  - KL → ∞ (灾难!)
  - W₂ = |m₁-m₂| (仍然有意义!)

  ┌─────────────────────────────────────────────────────┐
  │  KL 散度: "你在我不该出现的地方出现了多少？"       │
  │  → 支撑集不重叠 = 完全无法比较 = ∞                │
  │                                                     │
  │  Wasserstein: "把你的形状变成我的形状要搬多远？"   │
  │  → 总是有限的，且反映几何距离                     │
  │                                                     │
  │  这就是为什么 GAN 训练初期 (生成分布和真实分布    │
  │  几乎不重叠) KL/JS 给不出有用梯度，               │
  │  而 Wasserstein 距离仍然可以!                     │
  └─────────────────────────────────────────────────────┘
```

### 3.3 Sinkhorn 的直觉

```
类比: 迭代比例拟合 (IPF) / 矩阵缩放

  给定代价矩阵 C，想找传输计划 P:
  Step 0: P = exp(-C/ε)  (按代价分配初始权重)
  Step 1: 调整行 → 使行和 = a (源约束)
  Step 2: 调整列 → 使列和 = b (目标约束)
  Step 3-4: 反复调整... 直到行和列约束同时满足!

  就像反复"归一化"一个矩阵的行和列，直到满足所有边际约束

  ε 的角色:
  - ε 大 → P 接近均匀 (最大熵) → 快但不精确
  - ε 小 → P 接近精确 OT → 慢但精确
  - 实践: 从大 ε 开始，逐渐减小 (退火)
```

---

## 4. 与 ML 的连接 (Applications)

### 4.1 WGAN: Wasserstein GAN

```
核心思想 (Arjovsky et al., 2017):

  原始 GAN:
    min_G max_D E_x[log D(x)] + E_z[log(1-D(G(z)))]
    问题: 训练不稳定, 模式崩塌, 梯度消失

  WGAN:
    min_G max_{‖f‖_L≤1} E_x[f(x)] - E_z[f(G(z))]
                ↑
        1-Lipschitz 约束 (Kantorovich-Rubinstein 对偶)

  判别器 → "评论家" (Critic): 不再输出概率，输出实值分数
  损失: W₁ ≈ E[f(real)] - E[f(fake)]

Lipschitz 约束的实现:
  1. Weight Clipping (WGAN 原始): w ← clip(w, -c, c)
  2. Gradient Penalty (WGAN-GP):
     L = E[f(fake)] - E[f(real)] + λ·E[(‖∇_x̂ f(x̂)‖₂ - 1)²]
     x̂ = α·real + (1-α)·fake, α~U(0,1)
  3. Spectral Normalization (SN-GAN): W_SN = W / σ(W)

WGAN 的测度论基础:
  - 即使 P_real ⊥ P_fake, W₁ 仍然有限且连续
  - W₁ metrizes 弱收敛 → 优化 W₁ 等价于让生成分布弱收敛到真实分布
  - Critic 的最优解 = Kantorovich 势 → 提供有意义的梯度方向
  - 参见: [[01_数学基础/04_信息论/03_Measure_理论_for_ML]], GAN_Architectures
```

### 4.2 域适应与公平性

```
OT 域适应 (OTDA, Courty et al., 2017):
  1. 计算源域和目标域特征之间的 OT 映射
  2. 用传输计划对齐特征分布
  3. 在对齐后的空间中训练分类器
  数学: γ* = argmin_{γ ∈ Π(μ_s, μ_t)} <C, γ> + λ·正则化
  变体: JDOT (同时对齐特征和标签), Deep OTDA (端到端)
  参见: Domain_Adaptation, [[Transfer_Learning]]

OT 在算法公平性中:
  1. 人口统计奇偶: 用传输映射将不同群体的预测分布对齐
  2. 机会均等: 条件传输 (conditional OT)
  3. 公平表示学习: min L_task + λ·W₂(P_{Z|A=0}, P_{Z|A=1})
  优势: 连续的公平性度量, 可权衡准确性和公平性, 几何感知
  参见: Fairness_in_ML
```

### 4.3 Sliced Wasserstein 距离

```
高维 OT 的计算瓶颈 → Sliced Wasserstein Distance (SWD):
  SW_p(μ,ν) = (∫_{S^{d-1}} W_p^p(Proj_θ#μ, Proj_θ#ν) dθ)^{1/p}
  即: 在所有 1D 投影方向上计算 W_p，然后平均

  流程: 高维分布 → 投影到方向 θ → 1D W (有闭式解!) → 对所有方向平均
  1D Wasserstein 闭式: W_p(F,G) = (∫₀¹ |F⁻¹(t)-G⁻¹(t)|^p dt)^{1/p}
  复杂度: O(n log n · K), K = 投影方向数 (通常 50-200)

  变体: Max-SWD (对抗性), Distributional SWD, Generalized SWD
```

### 4.4 2026 前沿: OT 在 LLM 对齐中的探索

```
背景: RLHF/DPO 的局限
  - KL 约束可能过于保守或过于激进
  - 离散 token 空间上的分布比较困难

OT 对齐的新方向 (2025-2026):
  1. Wasserstein RLHF:
     min_π -E[r(x,y)] + λ·W₁(π(·|x), π_ref(·|x))
     优势: 对 token 概率的微小重分配更鲁棒

  2. 序列级 OT:
     将完整回复视为序列空间中的点
     用 OT 比较"回复分布"而非逐 token 比较

  3. 多模态对齐中的 OT:
     视觉-语言模型: OT 匹配图像 patch 和文本 token
     跨语言对齐: 不同语言表示空间的 OT 映射
     参见: Multimodal_Learning

  4. 知识蒸馏中的 OT:
     教师和学生 logits 之间的 OT 距离
     比 KL 散度更好地捕捉分布形状

  5. 开放挑战:
     - 高维离散空间 (vocabulary ~100K) 上的高效 OT
     - 变长序列的 OT 度量
     - 理论保证: OT 对齐是否比 KL 对齐有更好的泛化?
     - 参见: [[概念/Training/rlhf]]
```

---

## 5. 代码示例 (Code Examples)

### 5.1 离散 OT 与 Sinkhorn 算法

```python
import numpy as np
from scipy.optimize import linear_sum_assignment
from scipy.spatial.distance import cdist

# === 精确 OT vs Sinkhorn ===
np.random.seed(42)
n, m = 50, 50
source = np.random.randn(n, 2) + np.array([0, 0])
target = np.random.randn(m, 2) + np.array([3, 3])
a = np.ones(n) / n
b = np.ones(m) / m
C = cdist(source, target, 'sqeuclidean')

# 精确 OT (均匀权重 → 指派问题)
row_ind, col_ind = linear_sum_assignment(C)
exact_cost = C[row_ind, col_ind].sum() / n
print(f"精确 OT 代价: {exact_cost:.4f}")

# Sinkhorn 算法 (log 域, 数值稳定)
def sinkhorn(C, a, b, epsilon=0.1, max_iter=1000, tol=1e-9):
    log_K = -C / epsilon
    log_a, log_b = np.log(a), np.log(b)
    log_u, log_v = np.zeros(len(a)), np.zeros(len(b))
    for i in range(max_iter):
        log_u_prev = log_u.copy()
        log_u = log_a - np.logaddexp.reduce(log_K + log_v[None, :], axis=1)
        log_v = log_b - np.logaddexp.reduce(log_K + log_u[:, None], axis=0)
        if np.max(np.abs(log_u - log_u_prev)) < tol:
            break
    P = np.exp(log_u[:, None] + log_K + log_v[None, :])
    return P, np.sum(P * C), i+1

for eps in [1.0, 0.1, 0.01]:
    P, cost, iters = sinkhorn(C, a, b, epsilon=eps)
    print(f"Sinkhorn (ε={eps}): cost={cost:.4f}, iters={iters}, "
          f"row_err={np.max(np.abs(P.sum(1)-a)):.2e}")
```

### 5.2 Wasserstein 距离 vs KL 散度

```python
import numpy as np
from scipy.stats import wasserstein_distance
import matplotlib.pyplot as plt

# === 分布分离时 W₁ vs KL vs JS 的行为 ===
np.random.seed(42)
separations = np.linspace(0, 5, 100)
sigma = 0.3  # 小方差 → 近似奇异
kl_values, w1_values, js_values = [], [], []

for d in separations:
    x1 = np.random.normal(0, sigma, 10000)
    x2 = np.random.normal(d, sigma, 10000)
    w1_values.append(wasserstein_distance(x1, x2))

    bins = np.linspace(-3, 8, 200)
    p1, _ = np.histogram(x1, bins=bins, density=True)
    p2, _ = np.histogram(x2, bins=bins, density=True)
    p1, p2 = p1 + 1e-10, p2 + 1e-10
    p1, p2 = p1 / p1.sum(), p2 / p2.sum()
    kl_values.append(np.sum(p1 * np.log(p1 / p2)))
    m_dist = 0.5 * (p1 + p2)
    js_values.append(0.5*np.sum(p1*np.log(p1/m_dist)) + 0.5*np.sum(p2*np.log(p2/m_dist)))

plt.figure(figsize=(12, 4))
plt.subplot(1,3,1); plt.plot(separations, w1_values, 'b-', lw=2)
plt.title('W₁: 线性增长，始终有梯度'); plt.grid(True, alpha=0.3)
plt.subplot(1,3,2); plt.plot(separations, kl_values, 'r-', lw=2); plt.ylim(0,20)
plt.title('KL: 快速爆炸到 ∞'); plt.grid(True, alpha=0.3)
plt.subplot(1,3,3); plt.plot(separations, js_values, 'g-', lw=2)
plt.axhline(y=np.log(2), color='k', ls='--', label='log2')
plt.title('JS: 饱和到 log2 (无梯度!)'); plt.legend(); plt.grid(True, alpha=0.3)
plt.suptitle('分布分离时: W₁ vs KL vs JS', fontsize=14)
plt.tight_layout(); plt.savefig('w1_vs_kl_vs_js.png', dpi=150); plt.show()
print("结论: 分布不重叠时, KL→∞, JS→log2(常数), 只有W₁提供有用梯度")
```

### 5.3 WGAN-GP 核心训练循环 (PyTorch)

```python
import torch
import torch.nn as nn
import torch.autograd as autograd

class Critic(nn.Module):
    """WGAN Critic: 输出实值分数，无 sigmoid"""
    def __init__(self, dim=2, hidden=256):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(dim, hidden), nn.LeakyReLU(0.2),
            nn.Linear(hidden, hidden), nn.LeakyReLU(0.2),
            nn.Linear(hidden, 1))  # 无激活!
    def forward(self, x): return self.net(x)

class Generator(nn.Module):
    def __init__(self, latent_dim=64, output_dim=2, hidden=256):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(latent_dim, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
            nn.Linear(hidden, output_dim))
    def forward(self, z): return self.net(z)

def gradient_penalty(critic, real, fake, lambda_gp=10.0):
    """WGAN-GP: 强制 critic 梯度范数 ≈ 1 (近似 1-Lipschitz)"""
    alpha = torch.rand(real.size(0), 1, device=real.device)
    interpolated = (alpha * real + (1 - alpha) * fake).requires_grad_(True)
    d_interp = critic(interpolated)
    gradients = autograd.grad(d_interp, interpolated,
        grad_outputs=torch.ones_like(d_interp),
        create_graph=True, retain_graph=True)[0]
    grad_norm = gradients.view(real.size(0), -1).norm(2, dim=1)
    return lambda_gp * ((grad_norm - 1) ** 2).mean()

def wgan_gp_step(critic, generator, real_data, latent_dim=64):
    # Critic: 最大化 W 估计
    z = torch.randn(real_data.size(0), latent_dim)
    fake_data = generator(z).detach()
    d_real, d_fake = critic(real_data).mean(), critic(fake_data).mean()
    gp = gradient_penalty(critic, real_data, fake_data)
    critic_loss = -d_real + d_fake + gp
    # Generator: 最小化 -E[f(fake)]
    z = torch.randn(real_data.size(0), latent_dim)
    generator_loss = -critic(generator(z)).mean()
    return critic_loss, generator_loss, d_real.item() - d_fake.item()

print("WGAN-GP: critic_loss = -E[f(real)] + E[f(fake)] + λ·GP")
print("  GP = E[(||∇f(x̂)||₂ - 1)²] → 近似 1-Lipschitz → Kantorovich 对偶")
```

### 5.4 Sinkhorn 散度与 Sliced Wasserstein (PyTorch)

```python
import torch
import numpy as np

def sinkhorn_divergence(x, y, epsilon=0.05, max_iter=50):
    """S_ε(x,y) = W_ε(x,y) - ½W_ε(x,x) - ½W_ε(y,y) (去偏, 可微)"""
    def sinkhorn_cost(C, n, m, eps, n_iter):
        log_K = -C / eps
        log_a = -torch.log(torch.tensor(float(n), device=C.device))
        log_b = -torch.log(torch.tensor(float(m), device=C.device))
        log_u = torch.zeros(n, device=C.device)
        log_v = torch.zeros(m, device=C.device)
        for _ in range(n_iter):
            log_u = log_a - torch.logsumexp(log_K + log_v.unsqueeze(0), dim=1)
            log_v = log_b - torch.logsumexp(log_K + log_u.unsqueeze(1), dim=0)
        P = torch.exp(log_u.unsqueeze(1) + log_K + log_v.unsqueeze(0))
        return (P * C).sum()

    C_xy = torch.cdist(x, y, p=2).pow(2)
    C_xx = torch.cdist(x, x, p=2).pow(2)
    C_yy = torch.cdist(y, y, p=2).pow(2)
    n, m = x.shape[0], y.shape[0]
    return (sinkhorn_cost(C_xy, n, m, epsilon, max_iter)
            - 0.5*sinkhorn_cost(C_xx, n, n, epsilon, max_iter)
            - 0.5*sinkhorn_cost(C_yy, m, m, epsilon, max_iter))

# 验证可微性
x = torch.randn(100, 2, requires_grad=True)
y = torch.randn(100, 2) + 2.0
loss = sinkhorn_divergence(x, y, epsilon=0.1)
loss.backward()
print(f"Sinkhorn 散度: {loss.item():.4f}, 梯度范数: {x.grad.norm():.4f}")
print("→ 完全可微，可嵌入端到端训练!")

# Sliced Wasserstein Distance
def sliced_wasserstein(x, y, n_projections=200):
    d = x.shape[1]
    projections = torch.randn(n_projections, d)
    projections = projections / projections.norm(dim=1, keepdim=True)
    swd = 0.0
    for proj in projections:
        x_sorted = torch.sort(x @ proj)[0]
        y_sorted = torch.sort(y @ proj)[0]
        swd += (x_sorted - y_sorted).abs().mean()
    return swd / n_projections

torch.manual_seed(42)
x_h = torch.randn(500, 128)
y_h = torch.randn(500, 128) + 0.5
swd = sliced_wasserstein(x_h, y_h)
print(f"\nSliced Wasserstein (d=128, n=500): {swd.item():.4f}")
print(f"理论 W₂ (两个高斯): {np.sqrt(128 * 0.25):.4f}")
```

---

## 6. 进一步阅读 (Further Reading)

```
入门级:
├── 《Optimal Transport for Applied Mathematicians》 - Santambrogio (2015)
│   (最佳入门: 从应用到理论，例子丰富)
├── 《Computational Optimal Transport》 - Peyré & Cuturi (2019)
│   (计算导向，免费 PDF) https://optimaltransport.github.io/
└── WGAN 原论文: Arjovsky et al. (ICML 2017)

进阶级:
├── 《Topics in Optimal Transportation》 - Villani (2003)
├── 《Optimal Transport: Old and New》 - Villani (2009) (900页巨著)
└── WGAN-GP: Gulrajani et al. (NeurIPS 2017)

软件工具:
├── POT (Python Optimal Transport): pip install pot
├── geomloss: PyTorch 原生 Sinkhorn 散度 (GPU加速)
├── ott-jax: JAX 版 OT 工具
└── scipy.stats.wasserstein_distance: 1D Wasserstein
```

---

## 7. 相关概念 (Related Concepts)

### 7.1 前置知识

- [[01_数学基础/04_信息论/03_Measure_理论_for_ML]] — OT 的测度论基础 (推前测度、耦合)
- Linear_Algebra_Essentials — 传输计划是矩阵，SVD 用于低秩 OT
- Convex_Optimization — Kantorovich 问题是线性规划
- Probability_Distributions — 概率测度空间

### 7.2 直接应用

- GAN_Architectures — WGAN 是 OT 在生成模型的标志性应用
- [[概念/General/diffusion-models|Diffusion_Models]] — OT 路径、Rectified Flow
- Domain_Adaptation — OT 域适应
- Fairness_in_ML — OT 公平性约束
- Normalizing_Flows — 最优传输映射 vs 可逆映射

### 7.3 延伸连接

- [[概念/Math/information-geometry|Information_Geometry]] — KL 几何 vs Wasserstein 几何
- Optimization_Methods — Sinkhorn 是 Bregman 投影
- Kernel_Methods — MMD vs Wasserstein
- [[概念/General/reinforcement-learning|Reinforcement_Learning]] — 分布鲁棒 RL、OT 策略优化
- Multimodal_Learning — 跨模态 OT 对齐
- [[概念/Training/rlhf]] — LLM 对齐中的 OT 探索
- [[Numerical_Methods_for_ML]] — Sinkhorn 的数值实现

---

## 8. 总结: OT 思维框架

```
┌─────────────────────────────────────────────────────────────────┐
│  当你需要比较/对齐两个分布时，考虑 OT:                         │
│                                                                 │
│  □ 分布可能不重叠？ → 用 W 替代 KL                            │
│  □ 需要几何感知？ → W₂ 编码空间结构                           │
│  □ 需要可微损失？ → Sinkhorn 散度                             │
│  □ 高维数据？ → Sliced Wasserstein                             │
│  □ 需要映射/对齐？ → OT 传输计划                              │
│  □ 需要公平性？ → OT 约束分布接近                             │
│  □ 生成模型训练不稳？ → WGAN 的 Lipschitz critic              │
│                                                                 │
│  计算选择:                                                      │
│  ├── 小规模 (n<1000): 精确 OT (LP)                            │
│  ├── 中规模 (n~10000): Sinkhorn (ε=0.01-0.1)                  │
│  ├── 大规模 (n>100000): Sliced / 低秩 / 小 batch              │
│  └── 连续分布: 半离散 OT / 参数化映射                         │
│                                                                 │
│  核心公式:                                                      │
│  W_p(μ,ν) = (inf_{γ∈Π(μ,ν)} ∫|x-y|^p dγ)^{1/p}             │
│  W₁ = sup_{‖f‖_L≤1} E_μ[f] - E_ν[f]  (WGAN 的理论基础)     │
│  Sinkhorn: u←a/(Kv), v←b/(K^Tu), K=exp(-C/ε)                │
└─────────────────────────────────────────────────────────────────┘
```

---

> **核心收获**: 最优传输为 ML 提供了一种"几何感知"的分布比较方式。当 KL 散度因为支撑集不重叠而失效时，Wasserstein 距离仍然提供有意义的梯度和度量。从 WGAN 到域适应，从公平性到 LLM 对齐，OT 正在成为 ML 工具箱中不可或缺的数学工具。
