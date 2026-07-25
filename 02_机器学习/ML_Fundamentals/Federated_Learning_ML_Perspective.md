---
title: "联邦学习 (ML算法视角)"
category: "ML_Fundamentals"
tags:
  - federated-learning
  - FedAvg
  - FedProx
  - SCAFFOLD
  - differential-privacy
  - communication-efficiency
  - non-IID
  - privacy-preserving-ML
summary: "从ML算法视角深入联邦学习：FedAvg/FedProx/SCAFFOLD的完整数学推导，通信效率压缩方法，Non-IID异构性挑战与解决方案，差分隐私与Secure Aggregation，大规模实践案例，以及2026年联邦基础模型前沿。"
created: 2026-07-19
updated: 2026-07-19
---

# 联邦学习 (ML算法视角)

## 概述

联邦学习 (Federated Learning, FL) 是一种分布式机器学习范式，允许多个参与方在不共享原始数据的前提下协作训练模型。与传统的集中式训练不同，FL将计算推向数据所在地，仅交换模型更新（梯度或参数），从根本上解决数据隐私、数据孤岛和通信带宽问题。

### 核心动机

$$\text{传统ML}: \quad \text{数据} \rightarrow \text{中心服务器} \rightarrow \text{训练模型}$$
$$\text{联邦学习}: \quad \text{模型} \rightarrow \text{各数据方} \rightarrow \text{聚合更新}$$

### 联邦学习分类

| 类型 | 参与方 | 数据分布 | 典型场景 |
|------|--------|----------|----------|
| 横向联邦 (Horizontal FL) | 特征相同，样本不同 | 按用户/地区分片 | 手机键盘、IoT |
| 纵向联邦 (Vertical FL) | 样本相同，特征不同 | 按特征分片 | 银行+电商联合风控 |
| 联邦迁移 (Federated Transfer) | 特征和样本均不同 | 完全不同领域 | 跨域医疗 |

### 系统架构

```
┌─────────────────────────────────────────┐
│           中心服务器 (Server)             │
│  ┌─────────────────────────────────┐    │
│  │  全局模型 w^t                    │    │
│  │  聚合算法 (FedAvg/FedProx/...)  │    │
│  │  客户端选择策略                   │    │
│  └─────────────────────────────────┘    │
└────────┬──────────┬──────────┬──────────┘
         │          │          │
    ┌────▼───┐ ┌───▼────┐ ┌──▼─────┐
    │Client 1│ │Client 2│ │Client K│
    │本地数据 │ │本地数据 │ │本地数据 │
    │本地训练 │ │本地训练 │ │本地训练 │
    └────────┘ └────────┘ └────────┘
```

---

## 核心原理

### 问题形式化

设 $K$ 个客户端，第 $k$ 个客户端有 $n_k$ 个样本 $\mathcal{D}_k = \{(x_i^k, y_i^k)\}_{i=1}^{n_k}$。

**全局目标**：

$$\min_w F(w) = \sum_{k=1}^K p_k F_k(w)$$

其中 $p_k = n_k / n$（$n = \sum_k n_k$），本地目标为：

$$F_k(w) = \frac{1}{n_k} \sum_{i=1}^{n_k} f_i(w; x_i^k, y_i^k)$$

**关键约束**：
- 原始数据 $\mathcal{D}_k$ 永远不离开客户端 $k$
- 仅交换模型参数 $w$ 或梯度 $\nabla F_k(w)$
- 客户端可能异构（不同计算能力、数据量、可用性）

### 与集中式训练的数学对比

**集中式SGD**：

$$w^{t+1} = w^t - \eta \cdot \frac{1}{|B|}\sum_{i \in B} \nabla f_i(w^t)$$

其中 $B$ 从全部数据 $\mathcal{D} = \cup_k \mathcal{D}_k$ 中均匀采样。

**联邦学习**：

$$w^{t+1} = w^t - \eta \cdot \sum_{k \in S^t} p_k \cdot \Delta w_k^t$$

其中 $S^t$ 为第 $t$ 轮选中的客户端子集，$\Delta w_k^t$ 为客户端 $k$ 的本地更新。

**核心差异**：
1. 梯度估计的方差更大（客户端级采样 vs 样本级采样）
2. 本地多步更新引入"客户端漂移" (Client Drift)
3. Non-IID数据导致各客户端梯度方向不一致

### 收敛性分析框架

**假设**：
- (A1) $F_k$ 是 $L$-光滑的：$\|\nabla F_k(w) - \nabla F_k(w')\| \leq L\|w - w'\|$
- (A2) $F_k$ 是 $\mu$-强凸的：$F_k(w') \geq F_k(w) + \langle \nabla F_k(w), w'-w \rangle + \frac{\mu}{2}\|w'-w\|^2$
- (A3) 梯度方差有界：$\mathbb{E}\|\nabla f_i(w) - \nabla F_k(w)\|^2 \leq \sigma^2$
- (A4) 异构性有界：$\|\nabla F_k(w) - \nabla F(w)\|^2 \leq \zeta^2$

**集中式SGD收敛率**：

$$\mathbb{E}[F(w^T)] - F^* \leq \mathcal{O}\left(\frac{L\sigma^2}{\mu T} + \frac{\|w^0 - w^*\|^2}{T}\right)$$

**FedAvg收敛率**（含异构性项）：

$$\mathbb{E}[F(w^T)] - F^* \leq \mathcal{O}\left(\frac{L\sigma^2}{\mu KT} + \frac{\zeta^2}{\mu T} + \frac{\|w^0 - w^*\|^2}{T}\right)$$

注意额外的 $\zeta^2/\mu T$ 项——异构性导致的不可消除误差。

---

## 算法详解

### FedAvg (Federated Averaging)

**McMahan et al., 2017** — 联邦学习的奠基算法。

**算法流程**：

```
Algorithm: FedAvg
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
服务器初始化全局模型 w^0

For each round t = 0, 1, 2, ...:
  服务器:
    1. 选择客户端子集 S^t (|S^t| = C·K, C为参与比例)
    2. 下发全局模型 w^t 给 S^t 中所有客户端
  
  各客户端 k ∈ S^t (并行):
    3. 接收 w^t
    4. 执行 E 轮本地SGD:
       w_k^{t,0} = w^t
       For e = 1, ..., E:
         w_k^{t,e} = w_k^{t,e-1} - η_l ∇F_k(w_k^{t,e-1})
    5. 上传本地更新: Δw_k = w_k^{t,E} - w^t
  
  服务器:
    6. 加权聚合:
       w^{t+1} = w^t + Σ_{k∈S^t} (n_k/n_{S^t}) · Δw_k
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**数学表达**：

$$w^{t+1} = \sum_{k \in S^t} \frac{n_k}{n_{S^t}} w_k^{t,E}$$

**特殊情况**：
- $E=1, C=1$（全部参与，单步本地更新）：退化为标准SGD
- $E=\infty$（本地训练至收敛）：退化为独立训练+平均

**收敛保证**（IID, 凸）：

$$\mathbb{E}[F(w^T)] - F^* \leq \mathcal{O}\left(\frac{1}{\sqrt{KT}} + \frac{E\eta_l}{\sqrt{T}}\right)$$

### FedProx

**Li et al., 2020** — 通过近端项处理异构性。

**核心改进**：在本地目标中添加近端正则项：

$$F_k^{\text{prox}}(w) = F_k(w) + \frac{\mu_p}{2}\|w - w^t\|^2$$

其中 $\mu_p > 0$ 为近端系数，$w^t$ 为当前全局模型。

**本地更新变为**：

$$w_k^{t,e} = w_k^{t,e-1} - \eta_l \left(\nabla F_k(w_k^{t,e-1}) + \mu_p(w_k^{t,e-1} - w^t)\right)$$

**直觉**：近端项约束本地更新不偏离全局模型太远，缓解客户端漂移。

**收敛保证**（Non-IID, 非凸）：

$$\frac{1}{T}\sum_{t=0}^{T-1}\mathbb{E}\|\nabla F(w^t)\|^2 \leq \mathcal{O}\left(\frac{F(w^0)-F^*}{\eta T} + \eta L\sigma^2 + \frac{\eta^2 L^2 \zeta^2}{\mu_p}\right)$$

**$\mu_p$ 的选择**：
- $\mu_p = 0$：退化为FedAvg
- $\mu_p \rightarrow \infty$：本地更新被完全抑制
- 实践推荐：$\mu_p \in [0.001, 1.0]$，通过验证集调优

### SCAFFOLD

**Karimireddy et al., 2020** — 通过控制变量消除客户端漂移。

**核心思想**：使用控制变量 (Control Variates) 修正本地梯度方向。

**算法流程**：

```
Algorithm: SCAFFOLD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
服务器初始化: w^0, c^0 = 0 (服务器控制变量)
各客户端初始化: c_k = 0 (客户端控制变量)

For each round t:
  服务器:
    1. 选择 S^t, 下发 (w^t, c^t)
  
  各客户端 k ∈ S^t:
    2. 接收 (w^t, c^t)
    3. 本地更新 (E步):
       w_k^{t,0} = w^t
       For e = 1, ..., E:
         g_k^e = ∇F_k(w_k^{t,e-1})
         w_k^{t,e} = w_k^{t,e-1} - η_l(g_k^e - c_k + c^t)
    
    4. 计算新控制变量:
       c_k^+ = c_k - c^t + (w^t - w_k^{t,E})/(E·η_l)
    
    5. 上传: (Δw_k, Δc_k) = (w_k^{t,E} - w^t, c_k^+ - c_k)
  
  服务器:
    6. 聚合:
       w^{t+1} = w^t + (1/|S^t|) Σ_{k∈S^t} Δw_k
       c^{t+1} = c^t + (1/K) Σ_{k∈S^t} Δc_k
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**数学原理**：

修正后的本地梯度为：

$$\tilde{g}_k = \nabla F_k(w) - c_k + c$$

其中 $c_k \approx \nabla F_k(w^*)$（本地梯度的"偏差"），$c \approx \nabla F(w^*)$（全局梯度）。

因此 $\tilde{g}_k \approx \nabla F_k(w) - \nabla F_k(w^*) + \nabla F(w^*)$，在 $w^*$ 附近无偏。

**收敛保证**（Non-IID, 非凸）：

$$\frac{1}{T}\sum_{t=0}^{T-1}\mathbb{E}\|\nabla F(w^t)\|^2 \leq \mathcal{O}\left(\frac{1}{\sqrt{KT}} + \frac{\zeta^2}{K^{2/3}T^{2/3}}\right)$$

**关键优势**：对异构性 $\zeta^2$ 的依赖从 $\mathcal{O}(\zeta^2)$ 降至 $\mathcal{O}(\zeta^{2/3})$。

### 算法对比总结

| 算法 | 本地更新 | 服务器聚合 | 异构性处理 | 通信轮次 |
|------|----------|-----------|-----------|----------|
| FedAvg | $E$步SGD | 加权平均 | 无 | 基准 |
| FedProx | $E$步SGD+近端项 | 加权平均 | 近端约束 | ~FedAvg |
| SCAFFOLD | $E$步修正SGD | 平均+控制变量 | 控制变量 | <FedAvg |
| FedNova | $E$步SGD | 归一化平均 | 归一化 | ~FedAvg |
| MOON | $E$步SGD+对比损失 | 加权平均 | 表征对齐 | ~FedAvg |

---

## 通信效率压缩

### 问题量化

模型参数 $w \in \mathbb{R}^d$，每轮通信量：
- 下行：$|S^t| \times d \times 4$ bytes（FP32）
- 上行：$|S^t| \times d \times 4$ bytes

对于100M参数模型：每轮 ~800MB（100客户端参与）。

### 压缩方法

**1. 梯度量化 (Gradient Quantization)**

1-bit SGD / SignSGD：

$$\text{sign}(\nabla F_k(w)) \in \{-1, +1\}^d$$

通信量压缩 $32\times$（FP32→1bit）。

QSGD（随机量化）：

$$Q(v)_i = \|v\| \cdot \text{sign}(v_i) \cdot \mathbb{1}\left[\frac{|v_i|}{\|v\|} > \xi_i\right]$$

其中 $\xi_i \sim U[0,1]$。无偏估计，方差可控。

**2. 稀疏化 (Sparsification)**

Top-k稀疏化：

$$\text{TopK}(\nabla F_k)_i = \begin{cases} (\nabla F_k)_i & \text{if } i \in \text{top-k indices} \\ 0 & \text{otherwise} \end{cases}$$

压缩比：$d/k$。通常 $k = 0.01d$（1%稀疏），压缩 $100\times$。

**误差补偿**：

$$r_k^{t+1} = r_k^t + \nabla F_k(w^t) - \text{TopK}(\nabla F_k(w^t) + r_k^t)$$

残差 $r_k$ 累积未传输的梯度信息。

**3. 低秩分解**：

$$\Delta w_k \approx U_k V_k^T, \quad U_k \in \mathbb{R}^{d \times r}, V_k \in \mathbb{R}^{r}$$

通信量：$d \times r + r$ vs $d$（当 $r \ll d$）。

**4. 知识蒸馏压缩**：

不传输完整模型，仅传输logits或soft labels：

$$\text{通信量} = n_{\text{public}} \times C \quad \text{(公开数据量 × 类别数)}$$

### 压缩方法对比

| 方法 | 压缩比 | 无偏性 | 额外计算 | 精度损失 |
|------|--------|--------|----------|----------|
| 1-bit量化 | 32x | 有偏 | 极低 | 中 |
| QSGD | 8-32x | 无偏 | 低 | 低 |
| Top-k稀疏 | 10-100x | 有偏(需补偿) | 中 | 低 |
| 低秩分解 | 5-50x | 近似 | 中 | 中 |
| 蒸馏 | 100-1000x | N/A | 高 | 中-高 |
| 异步+压缩 | 变化 | 变化 | 低 | 低 |

---

## 异构性 (Non-IID) 挑战

### Non-IID的形式化

**标签分布偏斜 (Label Skew)**：

$$p_k(y) \neq p_{k'}(y) \quad \text{for } k \neq k'$$

极端情况：每个客户端只有部分类别（如客户端1只有数字0-3，客户端2只有4-9）。

**特征分布偏斜 (Feature Skew)**：

$$p_k(x|y) \neq p_{k'}(x|y)$$

例如：不同医院的CT设备导致图像特征分布不同。

**数量偏斜 (Quantity Skew)**：

$$n_k \gg n_{k'} \quad \text{for some } k, k'$$

### Non-IID的影响分析

**梯度方向分歧**：

$$\cos(\nabla F_k(w), \nabla F_{k'}(w)) \ll 1 \quad \text{甚至} < 0$$

当客户端梯度方向相反时，聚合后更新可能抵消。

**客户端漂移的量化**：

$$\text{Drift} = \mathbb{E}\left\|w_k^{t,E} - w^t - \eta E \nabla F(w^t)\right\|^2 \leq \mathcal{O}(\eta^2 E^2 \zeta^2)$$

漂移与本地步数 $E$、学习率 $\eta$、异构度 $\zeta$ 正相关。

### 解决方案谱系

| 方法类别 | 代表算法 | 核心思想 |
|----------|----------|----------|
| 正则化 | FedProx, MOON | 约束本地更新方向 |
| 方差缩减 | SCAFFOLD, FedDyn | 修正梯度偏差 |
| 数据混合 | FedMix, FedShuffle | 共享少量公开数据 |
| 个性化 | pFedMe, Per-FedAvg | 全局+个性化双层 |
| 聚类 | IFCA, CFL | 相似客户端分组 |
| 归一化 | FedNova | 消除本地步数影响 |

### 个性化联邦学习

**pFedMe**：

$$\min_{w, \theta_k} \sum_k p_k \left[ F_k(\theta_k) + \frac{\lambda}{2}\|\theta_k - w\|^2 \right]$$

$w$ 为全局模型，$\theta_k$ 为个性化模型。

**Per-FedAvg (MAML-based)**：

$$w^{t+1} = w^t - \eta \sum_k p_k \nabla F_k(w^t - \alpha \nabla F_k(w^t))$$

学习一个"好的初始化"，使少量本地微调即可适配。

---

## 隐私保证

### 差分隐私 (Differential Privacy)

**定义**：机制 $\mathcal{M}$ 满足 $(\epsilon, \delta)$-DP，当且仅当对任意相邻数据集 $D, D'$：

$$\Pr[\mathcal{M}(D) \in S] \leq e^\epsilon \cdot \Pr[\mathcal{M}(D') \in S] + \delta$$

**联邦DP-SGD**：

每个客户端上传前：
1. 梯度裁剪：$g_k \leftarrow g_k / \max(1, \|g_k\|/C)$
2. 添加噪声：$g_k \leftarrow g_k + \mathcal{N}(0, \sigma^2 C^2 I)$

**隐私预算计算**（Rényi DP）：

经过 $T$ 轮，每轮采样率 $q = |S^t|/K$：

$$\epsilon_{\text{total}} \leq \sqrt{2T \ln(1/\delta)} \cdot q \cdot \sigma^{-1} \cdot C$$

**隐私-效用权衡**：

| 噪声乘数 $\sigma$ | 隐私 $\epsilon$ (T=100) | 精度损失 |
|-------------------|------------------------|----------|
| 0.5 | ~10 | 显著 (>5%) |
| 1.0 | ~5 | 中等 (2-5%) |
| 2.0 | ~2 | 轻微 (<2%) |
| 5.0 | ~0.5 | 极小 (<1%) |

### Secure Aggregation

**目标**：服务器只能看到聚合结果 $\sum_k w_k$，无法看到任何单个 $w_k$。

**Bonawitz et al., 2017 协议**：

```
1. 密钥协商: 每对客户端 (i,j) 协商共享密钥 s_{ij}
2. 掩码生成: 客户端 k 生成掩码
   mask_k = Σ_{j>k} PRG(s_{kj}) - Σ_{j<k} PRG(s_{jk})
3. 上传: 客户端 k 上传 w_k + mask_k
4. 聚合: Σ_k (w_k + mask_k) = Σ_k w_k (掩码自动抵消)
```

**计算开销**：$O(K^2)$ 密钥协商，$O(Kd)$ 掩码生成。

### 隐私方法对比

| 方法 | 保护对象 | 隐私强度 | 精度影响 | 通信开销 |
|------|----------|----------|----------|----------|
| DP (本地) | 单样本 | 强(可量化) | 中-高 | 无额外 |
| DP (中心) | 聚合结果 | 中 | 低 | 无额外 |
| Secure Aggregation | 模型更新 | 强(密码学) | 无 | 2-5x |
| 同态加密 | 计算过程 | 极强 | 无 | 10-100x |
| 可信执行环境 | 硬件隔离 | 中(依赖硬件) | 无 | 低 |

---

## 实验与基准

### 标准实验设置

| 数据集 | 客户端数 | Non-IID方式 | 评估指标 |
|--------|----------|-------------|----------|
| MNIST | 100 | Dirichlet(α=0.5) | Accuracy |
| CIFAR-10 | 100 | Dirichlet(α=0.1) | Accuracy |
| FEMNIST | 3500 | 自然(按用户) | Accuracy |
| Shakespeare | 1129 | 自然(按角色) | Perplexity |
| CelebA | 9343 | 自然(按用户) | Accuracy |

### 算法性能对比 (CIFAR-10, Non-IID α=0.1)

```
算法        | 通信轮次(达80%Acc) | 最终精度(500轮) | 通信量(MB)
-----------|-------------------|----------------|----------
FedAvg     | ~350              | 78.2%          | 350×model
FedProx    | ~300              | 79.5%          | 300×model
SCAFFOLD   | ~180              | 82.1%          | 360×model
FedNova    | ~320              | 79.8%          | 320×model
MOON       | ~250              | 80.3%          | 250×model
集中式      | N/A               | 91.5%          | N/A
```

### 大规模实践数据

**Google Gboard键盘**：
- 参与设备：数百万台手机
- 模型大小：~4MB（量化后）
- 训练轮次：每日1轮
- 隐私：DP (ε=8) + Secure Aggregation
- 效果：下一词预测准确率提升24%

**医疗联邦学习 (NVIDIA FLARE)**：
- 参与机构：20+医院
- 数据：不出医院
- 模型：3D U-Net (脑肿瘤分割)
- 效果：接近集中式训练（Dice差<2%）
- 训练时间：2天（vs 集中式需数据汇聚数周）

---

## 代码示例

### FedAvg从零实现

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Subset
import copy
import numpy as np

class FedAvgServer:
    """FedAvg服务器端"""
    
    def __init__(self, global_model, n_clients, client_sample_ratio=0.3):
        self.global_model = global_model
        self.n_clients = n_clients
        self.client_sample_ratio = client_sample_ratio
    
    def select_clients(self):
        """随机选择参与客户端"""
        n_selected = max(1, int(self.n_clients * self.client_sample_ratio))
        return np.random.choice(self.n_clients, n_selected, replace=False)
    
    def aggregate(self, client_models, client_data_sizes):
        """加权平均聚合"""
        total_size = sum(client_data_sizes)
        
        global_state = self.global_model.state_dict()
        
        for key in global_state:
            global_state[key] = torch.zeros_like(global_state[key], dtype=torch.float)
            for model, size in zip(client_models, client_data_sizes):
                weight = size / total_size
                global_state[key] += weight * model.state_dict()[key].float()
        
        self.global_model.load_state_dict(global_state)
        return self.global_model


class FedAvgClient:
    """FedAvg客户端"""
    
    def __init__(self, client_id, local_data, model_class, model_args):
        self.client_id = client_id
        self.local_data = local_data
        self.model_class = model_class
        self.model_args = model_args
        self.n_samples = len(local_data)
    
    def local_train(self, global_model, local_epochs=5, lr=0.01, batch_size=32):
        """本地训练"""
        model = copy.deepcopy(global_model)
        model.train()
        
        optimizer = torch.optim.SGD(model.parameters(), lr=lr, momentum=0.9)
        dataloader = DataLoader(self.local_data, batch_size=batch_size, shuffle=True)
        
        for epoch in range(local_epochs):
            for batch_x, batch_y in dataloader:
                optimizer.zero_grad()
                output = model(batch_x)
                loss = nn.CrossEntropyLoss()(output, batch_y)
                loss.backward()
                optimizer.step()
        
        return model, self.n_samples


def run_fedavg(model_class, model_args, client_datasets, 
               n_rounds=100, local_epochs=5, lr=0.01):
    """完整FedAvg训练流程"""
    
    n_clients = len(client_datasets)
    global_model = model_class(**model_args)
    server = FedAvgServer(global_model, n_clients)
    
    clients = [
        FedAvgClient(i, data, model_class, model_args)
        for i, data in enumerate(client_datasets)
    ]
    
    for round_t in range(n_rounds):
        # 选择客户端
        selected = server.select_clients()
        
        # 本地训练
        client_models = []
        client_sizes = []
        for k in selected:
            model, size = clients[k].local_train(
                server.global_model, local_epochs=local_epochs, lr=lr
            )
            client_models.append(model)
            client_sizes.append(size)
        
        # 聚合
        server.aggregate(client_models, client_sizes)
        
        if (round_t + 1) % 10 == 0:
            acc = evaluate(server.global_model, test_loader)
            print(f"Round {round_t+1}: Accuracy = {acc:.4f}")
    
    return server.global_model
```

### SCAFFOLD实现

```python
class SCAFFOLDClient:
    """SCAFFOLD客户端：使用控制变量修正梯度"""
    
    def __init__(self, client_id, local_data, model):
        self.client_id = client_id
        self.local_data = local_data
        self.n_samples = len(local_data)
        # 客户端控制变量
        self.c_k = {name: torch.zeros_like(param) 
                    for name, param in model.named_parameters()}
    
    def local_train(self, global_model, server_control, 
                    local_epochs=5, lr=0.01):
        """SCAFFOLD本地训练：修正梯度方向"""
        model = copy.deepcopy(global_model)
        model.train()
        
        optimizer = torch.optim.SGD(model.parameters(), lr=lr)
        dataloader = DataLoader(self.local_data, batch_size=32, shuffle=True)
        
        global_params = {name: param.clone() 
                        for name, param in global_model.named_parameters()}
        
        n_steps = 0
        for epoch in range(local_epochs):
            for batch_x, batch_y in dataloader:
                optimizer.zero_grad()
                output = model(batch_x)
                loss = nn.CrossEntropyLoss()(output, batch_y)
                loss.backward()
                
                # 修正梯度: g - c_k + c (服务器控制变量)
                for name, param in model.named_parameters():
                    if param.grad is not None:
                        param.grad.data += (
                            -self.c_k[name] + server_control[name]
                        )
                
                optimizer.step()
                n_steps += 1
        
        # 更新客户端控制变量
        # c_k^+ = c_k - c + (w^t - w_k^{t,E}) / (E * η)
        new_c_k = {}
        delta_w = {}
        for name, param in model.named_parameters():
            delta_w[name] = global_params[name] - param.data
            new_c_k[name] = (
                self.c_k[name] - server_control[name] 
                + delta_w[name] / (n_steps * lr)
            )
        
        # 计算控制变量增量
        delta_c = {name: new_c_k[name] - self.c_k[name] 
                   for name in new_c_k}
        
        # 更新本地控制变量
        self.c_k = new_c_k
        
        return model, delta_w, delta_c, self.n_samples


class SCAFFOLDServer:
    """SCAFFOLD服务器"""
    
    def __init__(self, global_model, n_clients):
        self.global_model = global_model
        self.n_clients = n_clients
        # 服务器控制变量
        self.c = {name: torch.zeros_like(param) 
                  for name, param in global_model.named_parameters()}
    
    def aggregate(self, client_results):
        """聚合模型更新和控制变量"""
        n_selected = len(client_results)
        
        global_state = self.global_model.state_dict()
        
        for name in global_state:
            # 聚合模型更新
            avg_delta_w = torch.zeros_like(global_state[name], dtype=torch.float)
            avg_delta_c = torch.zeros_like(self.c[name], dtype=torch.float)
            
            for model, delta_w, delta_c, _ in client_results:
                avg_delta_w += delta_w[name].float() / n_selected
                avg_delta_c += delta_c[name].float() / n_selected
            
            # 更新全局模型
            global_state[name] = global_state[name].float() - avg_delta_w
            
            # 更新服务器控制变量
            self.c[name] = self.c[name].float() + avg_delta_c * (n_selected / self.n_clients)
        
        self.global_model.load_state_dict(global_state)
```

### 差分隐私联邦学习

```python
class DPFedAvgClient:
    """差分隐私联邦学习客户端"""
    
    def __init__(self, client_id, local_data, clip_norm=1.0, noise_multiplier=1.0):
        self.client_id = client_id
        self.local_data = local_data
        self.clip_norm = clip_norm  # 梯度裁剪范数 C
        self.noise_multiplier = noise_multiplier  # 噪声乘数 σ
    
    def local_train_with_dp(self, global_model, local_epochs=5, lr=0.01):
        """带差分隐私的本地训练"""
        model = copy.deepcopy(global_model)
        model.train()
        
        dataloader = DataLoader(self.local_data, batch_size=32, shuffle=True)
        
        for epoch in range(local_epochs):
            for batch_x, batch_y in dataloader:
                model.zero_grad()
                output = model(batch_x)
                loss = nn.CrossEntropyLoss()(output, batch_y)
                loss.backward()
                
                # Step 1: 梯度裁剪
                total_norm = torch.nn.utils.clip_grad_norm_(
                    model.parameters(), self.clip_norm
                )
                
                # Step 2: 添加高斯噪声
                for param in model.parameters():
                    if param.grad is not None:
                        noise = torch.normal(
                            mean=0,
                            std=self.noise_multiplier * self.clip_norm,
                            size=param.grad.shape
                        )
                        param.grad.data += noise / len(batch_x)
                
                # Step 3: 更新参数
                with torch.no_grad():
                    for param in model.parameters():
                        param.data -= lr * param.grad.data
        
        return model, len(self.local_data)
```

### Non-IID数据模拟

```python
def create_non_iid_splits(dataset, n_clients, alpha=0.1):
    """使用Dirichlet分布创建Non-IID数据划分
    
    Args:
        dataset: PyTorch数据集
        n_clients: 客户端数量
        alpha: Dirichlet浓度参数
               alpha→0: 极端Non-IID (每客户端仅1-2类)
               alpha→∞: 接近IID
    """
    n_classes = len(set(dataset.targets))
    labels = np.array(dataset.targets)
    
    # 按类别分组索引
    class_indices = {c: np.where(labels == c)[0] for c in range(n_classes)}
    
    # 为每个客户端采样Dirichlet分布
    client_indices = [[] for _ in range(n_clients)]
    
    for c in range(n_classes):
        indices = class_indices[c]
        np.random.shuffle(indices)
        
        # Dirichlet分配
        proportions = np.random.dirichlet(np.repeat(alpha, n_clients))
        proportions = proportions / proportions.sum()
        
        # 按比例分配
        splits = (np.cumsum(proportions) * len(indices)).astype(int)
        splits = np.clip(splits, 0, len(indices))
        
        start = 0
        for k in range(n_clients):
            end = splits[k]
            client_indices[k].extend(indices[start:end].tolist())
            start = end
    
    # 创建子数据集
    client_datasets = [
        Subset(dataset, indices) for indices in client_indices
    ]
    
    return client_datasets
```

---

## 对比表

### 联邦学习 vs 集中式训练

| 维度 | 集中式训练 | 联邦学习 |
|------|-----------|----------|
| 数据位置 | 全部汇聚到中心 | 留在各客户端 |
| 隐私风险 | 高（数据集中） | 低（仅交换模型） |
| 通信需求 | 一次性数据传输 | 持续多轮通信 |
| 计算分布 | 中心GPU集群 | 边缘设备分布式 |
| 数据异构 | 可统一预处理 | 需处理Non-IID |
| 收敛速度 | 快（标准SGD） | 慢（通信瓶颈+异构） |
| 最终精度 | 基准（最优） | 通常低1-5% |
| 合规性 | 可能违反数据法规 | 满足GDPR等要求 |
| 适用场景 | 数据可汇聚 | 数据不可/不应汇聚 |
| 系统复杂度 | 低 | 高（异步/掉线/异构） |

### FL框架对比 (2026)

| 框架 | 维护方 | 语言 | 特点 | 适用规模 |
|------|--------|------|------|----------|
| Flower | Flower Labs | Python | 轻量、框架无关 | 1-10000客户端 |
| FedML | FedML Inc. | Python | 全栈、云原生 | 大规模 |
| NVIDIA FLARE | NVIDIA | Python | 医疗优化 | 中规模 |
| PySyft | OpenMined | Python | 隐私计算集成 | 中规模 |
| TFF | Google | Python | 研究导向 | 模拟 |
| PaddleFL | 百度 | Python | 中文生态 | 工业级 |

---

## 2026前沿

### 联邦基础模型 (Federated Foundation Models)

2026年最热门方向：在联邦设置下训练/适配Foundation Model。

**挑战**：
- 基础模型参数量巨大（7B-405B），无法下发到边缘设备
- 通信成本极高
- 需要新的聚合策略

**解决方案**：

1. **联邦LoRA**：
   - 服务器持有冻结的基础模型
   - 各客户端仅训练本地LoRA适配器
   - 聚合LoRA参数（通信量降低1000x）

$$\Delta W_k = B_k A_k, \quad \text{仅传输 } A_k, B_k \text{ (参数量 } 2dr \ll d^2\text{)}$$

2. **联邦Prompt Tuning**：
   - 各客户端学习本地soft prompts
   - 服务器聚合prompt embeddings
   - 通信量：仅 $L \times d$ 参数（$L$为prompt长度）

3. **Split Learning + Foundation Model**：
   - 基础模型在服务器
   - 客户端仅运行浅层编码器
   - 中间表征传输（需加噪保护）

### 联邦学习 + RAG

```
2026架构: 联邦RAG
━━━━━━━━━━━━━━━━━━━━━━━━
各客户端:
  - 本地知识库 (私有文档)
  - 本地Embedding模型
  - 本地向量索引

服务器:
  - 全局LLM (推理)
  - 聚合检索策略
  - 隐私保护查询路由

查询流程:
  1. 用户查询 → 本地Embedding
  2. 本地检索 → 相关文档片段
  3. (可选) 联邦检索 → 跨客户端知识
  4. LLM生成 → 回答
━━━━━━━━━━━━━━━━━━━━━━━━
```

### 异步联邦学习

**问题**：同步FL等待最慢客户端（straggler问题）。

**2026方案**：

$$w^{t+1} = w^t + \eta_s \sum_{k \in S^t} \alpha_k^t \cdot \Delta w_k^{\tau_k}$$

其中 $\tau_k$ 为客户端 $k$ 使用的模型版本（可能过时），$\alpha_k^t$ 为staleness-aware权重：

$$\alpha_k^t = \frac{1}{1 + \lambda_{\text{stale}} \cdot (t - \tau_k)}$$

### 联邦学习的理论前沿

**开放问题**（2026）：Non-IID下的紧收敛界（现有界是否可改进？）、个性化vs全局化的最优权衡 $\min_w \max_k [F_k(w) + \lambda \cdot d(w, w_k^{\text{personal}})]$、联邦学习的PAC-Bayes泛化界、动态异构性（客户端数据随时间变化）、联邦基础模型的Scaling Law $\text{FedPerf}(N, K, T, \zeta) = ?$。

### 跨设备联邦学习的工程挑战

2026年大规模部署需解决：设备异构（自适应本地步数+模型裁剪）、网络不稳定（异步聚合+梯度压缩）、电量限制（能量感知调度）、数据时变（持续学习+遗忘机制）、参与率低（激励机制+半监督FL）、安全攻击（拜占庭鲁棒聚合）。

---

## 相关概念

- [[Foundation_Models_ML_Paradigm]] - 基础模型范式（联邦基础模型的基础）
- [[Tabular_Foundation_Models_2026]] - 表格基础模型（联邦表格学习）
- [[Differential_Privacy]] - 差分隐私理论
- [[Distributed_Optimization]] - 分布式优化基础
- [[SGD_Variants]] - SGD及其变体
- [[Communication_Efficient_ML]] - 通信高效ML
- [[Privacy_Preserving_ML]] - 隐私保护机器学习
- [[Edge_ML]] - 边缘机器学习
- [[Transfer_Learning]] - 迁移学习
- [[Multi_Task_Learning]] - 多任务学习
- [[Bias_Variance_Tradeoff]] - 偏差-方差权衡
- [[ML_Algorithms_Cheatsheet]] - ML算法速查
- [[Supervised_Learning]] - 监督学习基础
