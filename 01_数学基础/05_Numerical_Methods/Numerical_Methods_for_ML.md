---
title: "数值方法与机器学习: 从浮点精度到混合精度训练的数学基础"
category: "01-fundamentals-calculus-optimization"
tags: ["numerical-methods", "floating-point", "matrix-decomposition", "automatic-differentiation", "sparse-optimization", "mixed-precision", "GPU-computing", "numerical-stability"]
summary: "> **一句话理解**: 数值方法是ML的'工程数学'——浮点精度决定了训练的稳定性，矩阵分解是线性代数的计算实现，自动微分让反向传播成为可能，混合精度训练在数值精度和计算效率间取得平衡，理解这些才能让模型在GPU上稳定收敛。"
created: 2026-07-19
updated: 2026-07-19
tier: supporting
aliases:
  - "Numerical Methods for ML"
  - Numerical_Methods_for_ML
sources: []

name_zh: "数值方法与机器学习: 从浮点精度到混合精度训练的数学基础"
---
# 数值方法与机器学习: 从浮点精度到混合精度训练的数学基础

> 中文简称：数值方法与机器学习: 从浮点精度到混合精度训练的数学基础

> **一句话理解**: 数值方法是 ML 的"工程数学"——浮点精度决定了训练的稳定性，矩阵分解是线性代数的计算实现，自动微分让反向传播成为可能，混合精度训练在数值精度和计算效率间取得平衡，理解这些才能让模型在 GPU 上稳定收敛。

---

## 1. 概述 (Overview)

### 1.1 为什么 ML 需要数值方法

```
数值方法 (Numerical Methods) 的核心问题:
├── 实数在计算机中如何表示？ → 浮点数 (IEEE 754)
├── 线性代数如何高效计算？ → 矩阵分解 (LU/QR/SVD)
├── 导数如何精确计算？ → 自动微分 (AD)
├── 大规模系统如何求解？ → 迭代法 / 稀疏方法
└── 精度和速度如何平衡？ → 混合精度训练

与 ML 的深度关联:
┌─────────────────────────────────────────────────────────────────────┐
│  数值方法概念                  ML 中的应用                           │
├──────────────────────────────┬──────────────────────────────────────┤
│  IEEE 754 浮点              │  FP32/FP16/BF16 训练精度选择          │
│  数值稳定性                 │  梯度消失/爆炸、Loss 为 NaN           │
│  LU/QR/SVD 分解            │  线性层、正交初始化、PCA、LoRA        │
│  自动微分 (前向/反向)       │  反向传播 = 反向模式 AD              │
│  共轭梯度法                 │  大规模线性系统、二阶优化             │
│  稀疏矩阵                   │  Transformer 注意力、图神经网络       │
│  混合精度                   │  AMP (Automatic Mixed Precision)      │
│  条件数                     │  优化景观分析、学习率选择             │
└──────────────────────────────┴──────────────────────────────────────┘
```

### 1.2 一个动机性问题

```
为什么不能直接用"数学公式"编程？

问题 1: 0.1 + 0.2 ≠ 0.3 (浮点舍入误差在深度网络中累积)
问题 2: exp(1000) = inf → NaN (需要 log-sum-exp trick)
问题 3: sigmoid'(x) ≤ 0.25 → 100层: 0.25^100 ≈ 10^{-60} (梯度消失)
问题 4: n=10000 的矩阵直接求逆 O(n³) 不可行 (需要迭代法)
问题 5: FP16 范围 ±65504, 精度 ~3位 → 梯度下溢 (需要 loss scaling)
```

---

## 2. 核心定义与定理

### 2.1 IEEE 754 浮点表示

```
浮点数格式: x = (-1)^s × 2^(e-bias) × (1 + f)

┌─────────────────────────────────────────────────────────────────┐
│  格式        符号  指数  尾数   范围          精度              │
├────────────┬─────┬─────┬─────┬─────────────┬──────────────────┤
│  FP32      │  1  │  8  │ 23  │ ±3.4×10³⁸  │ ~7 位有效数字    │
│  FP16      │  1  │  5  │ 10  │ ±65504     │ ~3.3 位有效数字  │
│  BF16      │  1  │  8  │  7  │ ±3.4×10³⁸  │ ~2.4 位有效数字  │
│  TF32      │  1  │  8  │ 10  │ ±3.4×10³⁸  │ ~3.3 位有效数字  │
│  FP8(E4M3) │  1  │  4  │  3  │ ±448       │ ~1.7 位有效数字  │
└────────────┴─────┴─────┴─────┴─────────────┴──────────────────┘

机器精度 (Machine Epsilon):
  ε_FP32 = 2^{-23} ≈ 1.19 × 10^{-7}
  ε_FP16 = 2^{-10} ≈ 9.77 × 10^{-4}
  ε_BF16 = 2^{-7}  ≈ 7.81 × 10^{-3}

含义: fl(x) = x(1 + δ), |δ| ≤ ε/2 (每次浮点运算引入 ≤ ε/2 的相对误差)

ML 中的选择:
  - FP32: 传统训练默认; BF16: 大模型训练主流 (范围=FP32, 速度快2x)
  - FP16: 需要 loss scaling; FP8: 推理/量化 (2024-2026 前沿)
  - 参见: [[Mixed_Precision_Training]]
```

### 2.2 数值稳定性与条件数

```
条件数: κ(A) = ‖A‖ · ‖A⁻¹‖ = σ_max(A) / σ_min(A)
  = "输出相对误差 / 输入相对误差" 的最大放大倍数

条件数的 ML 意义:
  1. 线性系统 Ax=b: κ(A) 大 → b 的微小扰动导致 x 的巨大变化
  2. 优化景观: Hessian H 的条件数 κ(H) = L/μ
     L = 最大曲率, μ = 最小曲率; κ(H) 大 → 梯度下降慢
     → 需要自适应学习率 (Adam) 或二阶方法
  3. 神经网络: 权重矩阵条件数大 → 梯度方向偏斜
     BatchNorm/LayerNorm 隐式改善条件数; 正交初始化使 κ(W) ≈ 1

数值稳定性原则:
  - 避免大数相减 (catastrophic cancellation)
  - 使用 log 域计算 (log-sum-exp trick)
  - 使用稳定算法 (Householder > Gram-Schmidt)
```

### 2.3 矩阵分解的数值实现

```
┌─────────────────────────────────────────────────────────────────┐
│  分解类型    公式              复杂度    ML 应用                 │
├────────────┬────────────────┬────────┬─────────────────────────┤
│  LU        │ PA = LU        │ O(n³)  │ 线性方程组求解          │
│  QR        │ A = QR         │ O(n³)  │ 最小二乘、正交化        │
│  Cholesky  │ A = LL^T       │ O(n³/3)│ 正定系统、GP、自然梯度  │
│  SVD       │ A = UΣV^T      │ O(n³)  │ PCA、LoRA、压缩         │
│  特征分解  │ A = QΛQ⁻¹      │ O(n³)  │ 谱方法、图卷积          │
└────────────┴────────────────┴────────┴─────────────────────────┘

LU 分解 (带部分主元): PA = LU
  部分主元保证 |lᵢⱼ| ≤ 1 → 数值稳定; 无主元可能不稳定!

QR 分解: A = QR, Q^TQ = I, R 上三角
  方法稳定性: Householder 反射 > Modified Gram-Schmidt > 经典 GS
  ML: 正交初始化 W = Q; 参见: [[Weight_Initialization]]

SVD: A = UΣV^T
  截断 SVD: A ≈ U_r Σ_r V_r^T (Eckart-Young: 最优秩-r近似)
  ML: PCA, LoRA (W = W₀ + BA, r << min(n,m)), 模型压缩
  参见: [[LoRA]], [[PCA]], [[Model_Compression]]
```

### 2.4 自动微分 (Automatic Differentiation)

```
核心思想: 任何程序 = 基本运算的组合 → 链式法则

┌─────────────────────────────────────────────────────────────────┐
│  前向模式 (Forward Mode / Tangent):                            │
│  一次前向: 计算 ∂f/∂xᵢ (一个输入方向)                        │
│  复杂度: O(1) × 前向 (对每个输入)                             │
│  适用: 输入少, 输出多 (n << m)                                 │
│                                                                 │
│  反向模式 (Reverse Mode / Adjoint):                            │
│  一次反向: 计算 ∂f/∂xᵢ (所有输入!)                           │
│  复杂度: O(1) × 前向 (对所有输入)                             │
│  适用: 输入多, 输出少 (n >> m) ← 深度学习!                    │
│                                                                 │
│  反向传播 = 反向模式 AD 的特例!                                │
│  损失 L 是标量 (m=1), 参数 θ 是百万维 (n=10⁶+)               │
│  → 一次反向传播得到所有 ∂L/∂θᵢ                               │
│                                                                 │
│  内存代价: 需存储所有中间激活值                                │
│  → 梯度检查点 (Gradient Checkpointing): 用计算换内存          │
└─────────────────────────────────────────────────────────────────┘

AD 不是近似! 它精确计算导数 (到机器精度)
  - 不是数值微分 (没有截断误差)
  - 不是符号微分 (没有表达式膨胀)
  - 是"精确的数值方法": 跟踪计算, 反向应用链式法则
```

### 2.5 大规模线性系统与稀疏优化

```
共轭梯度法 (CG): 求解 Ax=b (A 对称正定)
  等价于: min_x ½x^T Ax - b^T x
  关键性质:
  - 最多 n 步精确收敛; 实际 O(√κ(A)) 步达到 ε 精度
  - 只需矩阵-向量乘 A·v (不需要显式 A!)
  → 可以用 Hessian-vector product 实现二阶优化!
  ML: 自然梯度 F⁻¹g 用 CG 求解; 参见: Natural_Gradient

稀疏性来源:
┌─────────────────────────────────────────────────────────────────┐
│  注意力掩码 (因果/局部) │ 图神经网络 (邻接矩阵)               │
│  词嵌入 (One-hot)       │ 剪枝 (非结构化/结构化)              │
│  混合专家 MoE (Top-k)  │ 高维稀疏特征 (推荐系统)             │
└─────────────────────────────────────────────────────────────────┘
  参见: [[Sparse_Attention]], [[Mixture_of_Experts]], [[Model_Pruning]]
```

### 2.6 混合精度训练的数学基础

```
核心思想: 不同计算用不同精度
┌─────────────────────────────────────────────────────────────────┐
│  操作              精度      原因                                │
├──────────────────┬────────┬─────────────────────────────────────┤
│  权重存储/更新    │ FP32   │ 需要精度累积小梯度                  │
│  前向 matmul      │ BF16   │ 速度快, Tensor Core                 │
│  Loss/LayerNorm   │ FP32   │ 避免溢出, 统计量需要精度            │
│  Softmax          │ FP32   │ exp 需要精度                        │
└──────────────────┴────────┴─────────────────────────────────────┘

Loss Scaling (FP16 专用):
  问题: FP16 最小正数 ≈ 6×10⁻⁸, 梯度常 < 此值 → 下溢为 0
  解决: Loss×S → 反向 → 梯度/S → 更新
  动态: 连续 N 步无 inf → S×2; 出现 inf → S/2, 跳过该步

BF16 vs FP16:
  BF16: 指数位=8 (范围大), 尾数位=7 → 通常不需要 loss scaling
  FP16: 指数位=5 (范围小), 尾数位=10 → 需要 loss scaling
  参见: [[Mixed_Precision_Training]], GPU_Architecture
```

---

## 3. 直觉解释 (Intuition)

### 3.1 浮点误差的累积

```
类比: "传话游戏" — 每次浮点运算引入微小误差
  单次: ~10⁻⁷ (FP32) 或 ~10⁻³ (FP16)
  100层后: FP32: 100×10⁻⁷ = 10⁻⁵ (可接受); FP16: 100×10⁻³ = 0.1 (危险!)

  反向传播更危险: 梯度 = 链式法则 = 连乘
  若每层 Jacobian 范数 > 1: 梯度爆炸; < 1: 梯度消失
  → 数值方法 + 架构设计 (ResNet, LayerNorm) 共同解决
```

### 3.2 矩阵分解的几何直觉

```
SVD: A = UΣV^T → 旋转(V^T) → 缩放(Σ) → 旋转(U)
  单位圆 → 椭圆; σ₁ = 长轴, σ₂ = 短轴, σ₁/σ₂ = κ(A)
  低秩近似: 只保留前 r 个奇异值 → 椭圆退化为低维椭球
  → 这就是 PCA / LoRA 的几何意义!

QR: A = QR → 把 A 的列向量正交化
  ML: 正交初始化让网络初始"各方向等权"，避免某些方向被过度放大/缩小
```

### 3.3 混合精度的直觉

```
类比: "画家调色"
  FP32 = 24位色深 (精确但慢); BF16 = 16位 (快但略偏); FP8 = 8位 (很快但色带)
  混合精度 = "草图用低精度，细节用高精度"
  - 大面积铺色 (matmul): BF16 够了
  - 精细描边 (权重更新): 需要 FP32 (微小差异会累积)

  GPU Tensor Core: BF16 matmul 2x 吞吐, FP8 4x; 累加器始终 FP32!
```

---

## 4. 与 ML 的连接 (Applications)

### 4.1 反向传播 = 反向模式 AD

```
每个运算的 VJP (Vector-Jacobian Product):
┌─────────────────────────────────────────────────────┐
│  运算          前向              反向 (VJP)         │
├──────────────┬────────────────┬────────────────────┤
│  y = Wx      │  matmul        │  ∂L/∂W = (∂L/∂y)x^T│
│              │                │  ∂L/∂x = W^T(∂L/∂y)│
│  y = x₁⊙x₂ │  mul           │  ∂L/∂x₁=x₂⊙∂L/∂y │
│  y = ReLU(x) │  max(0,x)     │  ∂L/∂x=1[x>0]⊙∂L/∂y│
│  y = softmax │  exp/sum      │  Jacobian 特殊结构  │
└──────────────┴────────────────┴────────────────────┘

内存优化:
  - 存储所有激活: O(L × batch × hidden) → 可能 OOM
  - 梯度检查点: 只存部分, 反向时重算 → 时间换空间
  - 参见: [[概念/Training/gradient-checkpointing|Gradient_Checkpointing]], [[Memory_Efficient_Training]]
```

### 4.2 数值稳定的常见技巧

```
┌─────────────────────────────────────────────────────────────────┐
│  问题                    不稳定写法          稳定写法            │
├────────────────────────┬──────────────────┬────────────────────┤
│  Softmax 溢出         │  exp(x)/Σexp(x)  │  exp(x-max)/Σ...  │
│  Log-sum-exp          │  log(Σexp(x))    │  max+log(Σexp(x-max))│
│  方差计算            │  E[x²]-E[x]²      │  Welford 在线算法  │
│  矩阵求逆            │  inv(A)           │  solve(A, I) / LU  │
│  KL 散度            │  Σp·log(p/q)      │  Σp·(logp-logq)   │
└────────────────────────┴──────────────────┴────────────────────┘

Log-Sum-Exp Trick (最重要):
  log(Σᵢ exp(xᵢ)) = m + log(Σᵢ exp(xᵢ - m)), m = max(xᵢ)
  应用: softmax, cross-entropy, VAE ELBO, CTCLoss
```

### 4.3 LoRA 的数值线性代数

```
LoRA: W = W₀ + ΔW = W₀ + BA, B∈R^{d×r}, A∈R^{r×k}, r << min(d,k)
  - ΔW 是秩-r 矩阵 (SVD 只有 r 个非零奇异值)
  - 假设: 微调的"有效维度"远小于参数维度
  - 初始化: A ~ N(0, σ²), B = 0 → 初始 ΔW = 0
  - 秩选择: r = 4~64 (与 ΔW 奇异值衰减速度相关)
  - 存储: O(r(d+k)) vs O(dk); 参见: [[LoRA]], [[概念/Training/lora-peft|Parameter_Efficient_Fine_Tuning]]
```

### 4.4 GPU 计算的数值考量

```
┌─────────────────────────────────────────────────────────────────┐
│  组件              数值特性                                      │
├──────────────────┬──────────────────────────────────────────────┤
│  Tensor Core     │ BF16×BF16→FP32 累加; FP8×FP8→FP16/FP32     │
│  归约操作        │ 非确定性! (并行归约顺序不固定)              │
│  共享内存        │ 低延迟, FlashAttention 分块                   │
└──────────────────┴──────────────────────────────────────────────┘

关键问题:
  1. 非确定性归约: (a+b)+(c+d) vs (a+c)+(b+d) → 不同舍入
  2. Tensor Core: 维度必须是 8/16 的倍数; 输入 BF16, 累加 FP32
  3. FlashAttention: 在线 softmax + 分块, 内存 O(N) vs O(N²)
     参见: [[概念/LLM/flash-attention-kernels|FlashAttention]], [[Efficient_Transformers]]
  4. 分布式 AllReduce: 多 GPU 梯度聚合, 通信精度影响收敛
     参见: [[概念/Training/distributed-training|Distributed_Training]]
```

---

## 5. 代码示例 (Code Examples)

### 5.1 浮点精度与数值稳定性

```python
import numpy as np
import torch

# === IEEE 754 浮点精度 ===
print(f"FP32 epsilon: {np.finfo(np.float32).eps:.2e}")
print(f"FP16 epsilon: {np.finfo(np.float16).eps:.2e}")
print(f"0.1 + 0.2 == 0.3? {0.1 + 0.2 == 0.3}")  # False!

# 大数吃小数
big = np.float32(1e8)
print(f"FP32: 1e8 + 1 - 1e8 = {big + np.float32(1.0) - big}")  # 0, not 1!

# === Log-Sum-Exp Trick ===
x = torch.tensor([1000.0, 1001.0, 1002.0])
# 不稳定: torch.log(torch.exp(x).sum()) → inf!
m = x.max()
stable = m + torch.log(torch.exp(x - m).sum())
print(f"稳定 log-sum-exp: {stable.item():.6f}")

# === 稳定 Softmax ===
logits = torch.tensor([1000.0, 1001.0, 1002.0])
print(f"不稳定: {torch.exp(logits)/torch.exp(logits).sum()}")  # nan!
print(f"稳定: {torch.softmax(logits, dim=0)}")  # 正确
```

### 5.2 矩阵分解与条件数

```python
import numpy as np

# === 条件数与误差放大 ===
np.random.seed(42)
n = 100

def make_matrix(n, kappa):
    U, _ = np.linalg.qr(np.random.randn(n, n))
    V, _ = np.linalg.qr(np.random.randn(n, n))
    sigma = np.linspace(1, 1/kappa, n)
    return U @ np.diag(sigma) @ V.T

for kappa in [1, 100, 1e6]:
    A = make_matrix(n, kappa)
    x_true = np.random.randn(n)
    b = A @ x_true + 1e-10 * np.random.randn(n)
    x_solved = np.linalg.solve(A, b)
    rel_err = np.linalg.norm(x_solved - x_true) / np.linalg.norm(x_true)
    print(f"κ(A)={np.linalg.cond(A):.0e}, 相对误差={rel_err:.2e}")

# === SVD 低秩近似 (LoRA 基础) ===
A = np.random.randn(512, 256)
U, S, Vt = np.linalg.svd(A, full_matrices=False)
print(f"\n奇异值衰减: {S[:5].round(2)}...")
for r in [4, 16, 64]:
    A_r = U[:, :r] @ np.diag(S[:r]) @ Vt[:r, :]
    error = np.linalg.norm(A - A_r) / np.linalg.norm(A)
    lora_params = r * (512 + 256)
    print(f"  秩 r={r}: 误差={error:.4f}, LoRA参数={lora_params} ({lora_params/A.size*100:.1f}%)")
```

### 5.3 自动微分: 前向 vs 反向模式

```python
import torch
import torch.autograd as autograd

# 反向模式: 多输入→少输出 (深度学习!)
x = torch.randn(1000, requires_grad=True)
y = (x ** 2).sum()  # 标量输出
y.backward()  # 一次反向得到所有 1000 个梯度
print(f"反向模式: grad shape={x.grad.shape}, 前5个={x.grad[:5]}")

# 前向模式: 少输入→多输出
x_fwd = torch.randn(1000)
tangent = torch.ones(1000)
with autograd.forward_ad.dual_level():
    dual_x = autograd.forward_ad.make_dual(x_fwd, tangent)
    y_fwd = dual_x ** 2
    _, y_tangent = autograd.forward_ad.unpack_dual(y_fwd)
print(f"前向模式: tangent shape={y_tangent.shape}")

# 计算图与链式法则
x = torch.tensor(2.0, requires_grad=True)
w = torch.tensor(3.0, requires_grad=True)
y = w * x + 1.0
y.backward()
print(f"\ny=wx+1: ∂y/∂x={x.grad.item()} (=w=3), ∂y/∂w={w.grad.item()} (=x=2)")

# 梯度检查点
from torch.utils.checkpoint import checkpoint
class BigModel(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = torch.nn.ModuleList([torch.nn.Linear(1024, 1024) for _ in range(10)])
    def forward(self, x, use_ckpt=False):
        for layer in self.layers:
            x = checkpoint(layer, x, use_reentrant=False) if use_ckpt else layer(x)
        return x

model = BigModel()
x_in = torch.randn(32, 1024, requires_grad=True)
y_out = model(x_in, use_ckpt=True)
print(f"\n梯度检查点: 反向时重算激活, 内存节省 ~50%")
```

### 5.4 共轭梯度法与混合精度

```python
import numpy as np
from scipy.sparse import random as sparse_random
from scipy.sparse.linalg import cg
import torch
from torch.cuda.amp import autocast, GradScaler

# === CG 求解大规模稀疏系统 ===
np.random.seed(42)
n = 10000
A_sparse = sparse_random(n, n, density=0.001, format='csr', random_state=42)
A_sparse = A_sparse @ A_sparse.T + n * np.eye(n)
b = np.random.randn(n)
x_cg, info = cg(A_sparse, b, tol=1e-8, maxiter=1000)
print(f"CG: 收敛={'是' if info==0 else '否'}, "
      f"残差={np.linalg.norm(A_sparse@x_cg - b)/np.linalg.norm(b):.2e}")
print(f"非零元素: {A_sparse.nnz}/{n*n} ({A_sparse.nnz/n/n*100:.2f}%)")

# CG 用于自然梯度 (只需 Hessian-vector product!)
d = 1000
H = np.random.randn(d, d); H = H @ H.T / d + 0.1 * np.eye(d)
grad = np.random.randn(d)

def conjugate_gradient(hvp_fn, b, max_iter=100, tol=1e-8):
    x = np.zeros_like(b)
    r = b - hvp_fn(x); p = r.copy(); rs_old = r @ r
    for i in range(max_iter):
        Ap = hvp_fn(p)
        alpha = rs_old / (p @ Ap)
        x += alpha * p; r -= alpha * Ap
        rs_new = r @ r
        if np.sqrt(rs_new) < tol: break
        p = r + (rs_new / rs_old) * p; rs_old = rs_new
    return x, i+1

g_nat, iters = conjugate_gradient(lambda v: H @ v, grad)
print(f"\nCG 自然梯度: {iters} 步, 误差={np.linalg.norm(g_nat - np.linalg.solve(H, grad)):.2e}")

# === 混合精度训练 (PyTorch AMP) ===
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = torch.nn.Sequential(*[torch.nn.Linear(1024, 1024) for _ in range(4)]).to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
scaler = GradScaler(enabled=(device=='cuda'))

for step in range(3):
    x = torch.randn(64, 1024, device=device)
    optimizer.zero_grad()
    with autocast(enabled=(device=='cuda')):
        loss = model(x).pow(2).mean()
    scaler.scale(loss).backward()
    scaler.unscale_(optimizer)
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    scaler.step(optimizer); scaler.update()
    print(f"  Step {step}: loss={loss.item():.4f}, scale={scaler.get_scale():.0f}")

# 内存对比
params = sum(p.numel() for p in model.parameters())
print(f"\n内存: FP32={params*4/1e6:.1f}MB, BF16={params*2/1e6:.1f}MB, FP8={params/1e6:.1f}MB")
```

### 5.5 稀疏计算与在线 Softmax

```python
import torch, numpy as np, torch.nn.functional as F
from scipy import sparse
import time

# 稀疏 vs 稠密
n, density = 10000, 0.01
A_dense = np.random.randn(n, n) * (np.random.rand(n, n) < density)
A_sparse = sparse.csr_matrix(A_dense)
x = np.random.randn(n)

t0 = time.time(); y_d = A_dense @ x; t_dense = time.time() - t0
t0 = time.time(); y_s = A_sparse @ x; t_sparse = time.time() - t0
print(f"稠密: {t_dense*1000:.1f}ms ({A_dense.nbytes/1e6:.0f}MB)")
print(f"稀疏: {t_sparse*1000:.1f}ms ({(A_sparse.data.nbytes+A_sparse.indices.nbytes)/1e6:.1f}MB)")
print(f"加速: {t_dense/t_sparse:.1f}x")

# 在线 Softmax (FlashAttention 核心)
def online_softmax(x):
    """不需要存储完整行, 内存 O(1)"""
    m, d = float('-inf'), 0.0
    for i in range(len(x)):
        m_new = max(m, x[i])
        d = d * np.exp(m - m_new) + np.exp(x[i] - m_new)
        m = m_new
    return np.array([np.exp(x[i] - m) / d for i in range(len(x))])

x_test = np.random.randn(1000)
err = np.max(np.abs(online_softmax(x_test) - F.softmax(torch.tensor(x_test), dim=0).numpy()))
print(f"\n在线 softmax 误差: {err:.2e} → 数值等价, 内存 O(1) vs O(N)")
print("→ FlashAttention 用此技巧避免存储 N×N 注意力矩阵")
print("→ 参见: [[概念/LLM/flash-attention-kernels|FlashAttention]]")
```

---

## 6. 进一步阅读 (Further Reading)

```
数值线性代数:
├── 《Numerical Linear Algebra》 - Trefethen & Bau (1997) (最佳入门)
├── 《Matrix Computations》 - Golub & Van Loan (2013) (百科全书)
└── 《Numerical Optimization》 - Nocedal & Wright (2006)

自动微分:
├── 《Evaluating Derivatives》 - Griewank & Walther (2008) (AD 圣经)
├── PyTorch 源码: torch/autograd/ (工程实现)
└── JAX 文档: 函数式 AD 的现代设计

混合精度与 GPU:
├── 《Mixed Precision Training》 - Micikevicius et al. (2018) (AMP 原论文)
├── NVIDIA: "Mixed Precision Training Guide"
└── 《Programming Massively Parallel Processors》 - Kirk & Hwu

软件工具:
├── NumPy/SciPy: BLAS/LAPACK 封装
├── PyTorch: torch.autograd, torch.cuda.amp, torch.sparse
├── JAX: jax.grad, jax.lax (精确控制数值行为)
└── 调试: torch.autograd.detect_anomaly(), gradcheck
```

---

## 7. 相关概念 (Related Concepts)

### 7.1 前置知识

- Linear_Algebra_Essentials — 矩阵分解的数学理论
- Calculus_Fundamentals — 链式法则、多元微积分
- GPU_Architecture — Tensor Core、内存层次

### 7.2 直接应用

- Backpropagation — 反向传播 = 反向模式 AD
- [[Mixed_Precision_Training]] — AMP 的完整实践
- [[LoRA]] — 低秩适应的数值实现
- [[概念/LLM/flash-attention-kernels|FlashAttention]] — 数值稳定的高效注意力
- [[概念/Training/gradient-checkpointing|Gradient_Checkpointing]] — 用计算换内存

### 7.3 延伸连接

- Optimization_Methods — SGD/Adam 的数值行为
- [[概念/Training/distributed-training|Distributed_Training]] — 多 GPU 数值一致性
- [[概念/Inference/quantization|Model_Quantization]] — 低精度推理
- Neural_ODE — ODE 数值求解
- [[概念/General/diffusion-models|Diffusion_Models]] — SDE/ODE 采样器
- Natural_Gradient — Fisher 矩阵的 CG 求解
- [[Measure_Theory_for_ML]] — 数值积分的测度论基础
- [[Optimal_Transport_for_ML]] — Sinkhorn 的数值实现

---

## 8. 总结: 数值方法思维清单

```
┌─────────────────────────────────────────────────────────────────┐
│  当你实现/调试 ML 算法时，想想数值方法:                         │
│                                                                 │
│  □ 精度选择: FP32/BF16/FP16/FP8 哪个适合这一步?               │
│  □ 溢出风险: exp/log 是否需要 log-sum-exp trick?               │
│  □ 条件数: 矩阵/优化问题是否病态? 需要正则化吗?               │
│  □ 稳定性: 算法是否向后稳定? (Householder > Gram-Schmidt)     │
│  □ 内存: 能否用稀疏/低秩/检查点减少内存?                      │
│  □ 规模: n 多大? 直接法还是迭代法?                            │
│  □ 并行: GPU 上的归约是否引入非确定性?                        │
│                                                                 │
│  黄金法则:                                                      │
│  1. 永远不要在 FP16 中做累加 (用 FP32 累加器)                 │
│  2. 永远用 log 域处理概率 (避免 exp 溢出)                      │
│  3. 永远检查条件数 (κ > 10⁶ 就要小心)                         │
│  4. 永远用稳定算法 (即使慢一点)                                │
│  5. 永远验证: 数值结果 vs 理论预期 (gradcheck)                 │
│                                                                 │
│  调试 NaN/Inf:                                                  │
│  ├── 学习率太大? (梯度爆炸)                                   │
│  ├── log(0) 或 exp(大数)? (溢出)                               │
│  ├── 混合精度 loss scale 不合适?                               │
│  └── 数据有异常值/NaN 输入?                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

> **核心收获**: 数值方法是连接"数学公式"和"可运行代码"的桥梁。理解浮点精度让你选择正确的数据类型，理解矩阵分解让你高效实现线性代数，理解自动微分让你掌握反向传播的本质，理解混合精度让你在速度和精度间取得平衡。在 GPU 上训练万亿参数模型，本质上是一个数值方法问题。
