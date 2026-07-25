---
title: "神经架构搜索 (Neural Architecture Search)"
category: 03-deep-learning-neural-network-core
tags: ["deep-learning", "nas", "architecture-search", "darts", "efficientnet", "auto-ml", "hardware-aware"]
summary: "系统解析 NAS 的搜索空间设计、主流方法(DARTS/PNAS/ENAS/EfficientNet)、One-for-All 网络、硬件感知搜索，以及 2026 年 LLM-driven NAS 与自动架构发现的前沿进展。"
created: 2026-07-19
updated: 2026-07-19
tier: core
aliases:
  - "Neural Architecture Search"
  - "NAS"
  - NAS_Theory
sources: []

---
# 神经架构搜索 (Neural Architecture Search)

> 从暴力搜索到 LLM 驱动，系统解析自动化神经网络架构设计的理论、方法与前沿。

---

## 1. 概述 (Overview)

Neural Architecture Search (NAS) 是 AutoML 的核心子领域，旨在自动化设计神经网络架构，替代人工试错。从 2017 年 Zoph & Le 的开创性工作到 2026 年 LLM 驱动的架构发现，NAS 已经从学术探索走向工业应用。

### 为什么需要 NAS？

- **人工设计瓶颈**: 架构设计依赖专家经验，迭代周期长
- **搜索空间巨大**: 可能的架构组合是天文数字
- **硬件多样性**: 不同部署目标需要不同的最优架构
- **任务特异性**: 没有放之四海而皆准的最优架构

### NAS 的三要素

```
NAS = 搜索空间 (Search Space) + 搜索策略 (Search Strategy) + 性能估计 (Performance Estimation)
```

```
┌─────────────────────────────────────────────────────┐
│                    NAS 框架                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐    ┌──────────────┐    ┌──────────┐  │
│  │ 搜索空间 │ →  │  搜索策略    │ →  │ 性能估计 │  │
│  │          │    │              │    │          │  │
│  │ 定义所有 │    │ 如何在空间中 │    │ 如何评估 │  │
│  │ 可能架构 │    │ 高效搜索     │    │ 候选架构 │  │
│  └──────────┘    └──────────────┘    └──────────┘  │
│       ↑                                    │       │
│       └────────────── 反馈 ────────────────┘       │
└─────────────────────────────────────────────────────┘
```

### NAS 发展历程

```
2017: Zoph & Le — RL-based NAS (NASNet), 800 GPU-hours
2018: ENAS — 权重共享, 0.5 GPU-day
2018: PNAS — 渐进式搜索
2019: DARTS — 可微分搜索, 1 GPU-day
2019: EfficientNet — 复合缩放 + NAS
2020: Once-for-All — 训练一次，部署任意子网
2021: NAS + Transformer (AutoFormer, BossNAS)
2023: LLM 辅助架构设计
2025: LLM-driven NAS, 零样本架构评估
2026: 自动架构发现, 进化+LLM 混合搜索
```

---

## 2. 核心原理 (Core Principles)

### 2.1 搜索空间设计

搜索空间定义了 NAS 可以探索的所有可能架构。设计原则:

**1. 链式搜索空间 (Chain-structured)**:
```
每层从候选操作集合中选择一个操作:
  操作集 = {3×3 Conv, 5×5 Conv, 3×3 Depthwise, Skip, Zero, ...}
  层数 = N (固定或可变)
  
  搜索空间大小 = |操作集|^N
  例: 8 种操作 × 20 层 = 8^20 ≈ 10^18
```

**2. 细胞搜索空间 (Cell-based)**:
```
搜索一个"细胞"(Cell)的结构，然后重复堆叠:
  Cell = DAG (有向无环图)
  节点: 中间特征
  边: 从操作集中选择
  
  Normal Cell: 保持分辨率
  Reduction Cell: 降低分辨率 (stride=2)
  
  最终网络: Stem → [Normal]×N → [Reduction] → [Normal]×N → ...
```

```python
# Cell-based 搜索空间示意
class CellSearchSpace:
    """DARTS 风格细胞搜索空间"""
    
    OPS = [
        'none',           # 零操作
        'avg_pool_3x3',   # 平均池化
        'max_pool_3x3',   # 最大池化
        'skip_connect',   # 恒等映射
        'sep_conv_3x3',   # 深度可分离卷积 3×3
        'sep_conv_5x5',   # 深度可分离卷积 5×5
        'dil_conv_3x3',   # 空洞卷积 3×3
        'dil_conv_5x5',   # 空洞卷积 5×5
    ]
    
    def __init__(self, num_nodes=4, num_ops=8):
        self.num_nodes = num_nodes  # 中间节点数
        self.num_ops = num_ops
        # 每条边有 num_ops 种选择
        # 每个节点选择 2 个输入
        # 总搜索空间: C(num_ops × edges, 2) per node
```

**3. 层次搜索空间 (Hierarchical)**:
```
多层级搜索:
  Level 1: 宏观结构 (层数、宽度模式)
  Level 2: 细胞结构 (操作连接)
  Level 3: 操作超参 (kernel size、expansion ratio)
```

### 2.2 搜索策略

#### 强化学习 (RL-based)

```
架构编码为序列 → RNN Controller 生成 → 训练评估 → 奖励反馈

Controller: LSTM
  输入: 上一步的选择
  输出: 当前步操作的概率分布
  
奖励: R = 验证集准确率
优化: REINFORCE / PPO

θ_controller ← θ_controller + α · ∇_θ log π(a|s) · R
```

#### 进化算法 (Evolution-based)

```
种群初始化 → 选择 → 变异/交叉 → 评估 → 下一代

变异操作:
  - 替换一条边的操作
  - 添加/删除一条边
  - 改变节点连接
  
选择策略: Tournament / NSGA-II (多目标)
```

#### 可微分搜索 (Differentiable)

```
核心思想: 将离散选择松弛为连续优化

每条边不是选择一个操作，而是所有操作的加权和:
  ō(x) = Σ_i softmax(α)_i · o_i(x)
  
其中 α 是架构参数 (architecture parameters)

双层优化:
  min_α L_val(w*(α), α)          # 外层: 优化架构
  s.t. w*(α) = argmin_w L_train(w, α)  # 内层: 优化权重
```

### 2.3 性能估计策略

| 策略 | 耗时 | 准确度 | 代表方法 |
|------|------|--------|---------|
| 完整训练 | 极高 (GPU-days) | 最高 | NASNet, PNAS |
| 权重共享 | 低 (GPU-hours) | 中 | ENAS, DARTS |
| 代理任务 | 中 | 中 | 小数据集/少 epoch |
| 性能预测器 | 极低 | 中-高 | Bayesian NAS |
| 零成本代理 | 几乎为零 | 低-中 | NASWOT, SynFlow |
| LLM 评估 | 低 | 中 (2026) | LLM-NAS |

---

## 3. 技术详解 (Technical Deep Dive)

### 3.1 DARTS (Differentiable Architecture Search)

**论文**: Liu, Simonyan & Yang, "DARTS: Differentiable Architecture Search", ICLR 2019

**核心创新**: 将架构搜索转化为连续优化问题

```python
class DARTSCell(nn.Module):
    """DARTS 可微分搜索细胞"""
    
    def __init__(self, num_nodes=4, C_prev=64, C=16):
        super().__init__()
        self.num_nodes = num_nodes
        self.ops = nn.ModuleList()
        self.num_ops = 8  # 操作集大小
        
        # 架构参数 α (每条边一组 softmax 权重)
        # 对于 node j, 有 j+2 个输入 (2个初始 + j个中间)
        self.arch_params = nn.ParameterList()
        for j in range(num_nodes):
            num_inputs = j + 2
            # 每条边有 num_ops 个权重
            self.arch_params.append(
                nn.Parameter(torch.randn(num_inputs, self.num_ops) * 1e-3)
            )
        
        # 操作集合
        for j in range(num_nodes):
            for i in range(j + 2):
                self.ops.append(nn.ModuleList([
                    self._build_op(op_name, C) for op_name in self.OPS
                ]))
    
    def forward(self, s0, s1):
        """s0, s1: 前两个细胞的输出"""
        states = [s0, s1]
        
        offset = 0
        for j in range(self.num_nodes):
            # 对所有输入做加权求和
            s_j = sum(
                F.softmax(self.arch_params[j][i], dim=-1).unsqueeze(-1).unsqueeze(-1).unsqueeze(-1)
                * sum(
                    weight * self.ops[offset + i][k](states[i])
                    for k, weight in enumerate(F.softmax(self.arch_params[j][i], dim=-1))
                )
                for i in range(j + 2)
            )
            states.append(s_j)
            offset += j + 2
        
        return torch.cat(states[2:], dim=1)  # 拼接中间节点
```

**DARTS 的双层优化**:

```python
# 搜索阶段伪代码
for epoch in range(search_epochs):
    # Step 1: 固定 α, 更新 w (在训练集上)
    w = w - ξ · ∇_w L_train(w, α)
    
    # Step 2: 固定 w, 更新 α (在验证集上)
    # 使用一阶近似:
    α = α - η · ∇_α L_val(w, α)
    
    # 或使用二阶近似 (更准确但更慢):
    # w' = w - ξ · ∇_w L_train(w, α)
    # α = α - η · ∇_α L_val(w', α)

# 离散化: 选择每条边权重最大的操作
final_arch = discretize(α)
```

**DARTS 的问题与改进**:
- **性能坍塌**: 倾向选择 skip_connect (参数少，梯度大)
- **搜索-评估差距**: 搜索时的连续松弛与离散化后不一致
- **改进**: P-DARTS (渐进), Fair DARTS, R-DARTS (正则化)

### 3.2 PNAS (Progressive Neural Architecture Search)

**论文**: Liu, Simonyan & Yang, "Progressive Neural Architecture Search", ECCV 2018

**核心思想**: 从简单到复杂，逐步增加搜索空间

```
Stage 1: 搜索 1 个节点的 cell
Stage 2: 搜索 2 个节点的 cell (继承 Stage 1 结果)
Stage 3: 搜索 3 个节点的 cell
...
Stage K: 搜索 K 个节点的 cell (最终)

每个 Stage 使用 SMBO (Sequential Model-Based Optimization):
  1. 用已有评估训练代理模型 (predictor)
  2. 代理模型预测候选架构性能
  3. 选择最有希望的候选进行真实评估
  4. 更新代理模型
```

### 3.3 ENAS (Efficient Neural Architecture Search)

**论文**: Pham et al., "Efficient Neural Architecture Search via Parameter Sharing", ICML 2018

**核心创新**: 所有子网络共享参数，一次训练即可评估任意子网

```
┌─────────────────────────────────────────┐
│         超网 (Supernet)                  │
│                                         │
│  ┌───┐  ┌───┐  ┌───┐  ┌───┐           │
│  │Op1│  │Op2│  │Op3│  │Op4│  ← 所有操作│
│  └─┬─┘  └─┬─┘  └─┬─┘  └─┬─┘           │
│    │      │      │      │              │
│    └──────┴──┬───┴──────┘              │
│              │                          │
│     子网 A: Op1 → Op3                  │
│     子网 B: Op2 → Op4                  │
│     子网 C: Op1 → Op2 → Op4           │
│                                         │
│  所有子网共享同一组权重!                 │
└─────────────────────────────────────────┘
```

```python
class ENASSupernet(nn.Module):
    """ENAS 超网: 所有子网共享参数"""
    
    def __init__(self, num_layers, num_ops, channels):
        super().__init__()
        # 每层所有操作共享一个参数池
        self.layers = nn.ModuleList()
        for l in range(num_layers):
            layer_ops = nn.ModuleList([
                build_op(op, channels) for op in range(num_ops)
            ])
            self.layers.append(layer_ops)
    
    def forward(self, x, architecture):
        """architecture: 每层选择的操作索引"""
        for l, op_idx in enumerate(architecture):
            x = self.layers[l][op_idx](x)
        return x

# 训练循环:
# 1. 采样一个子网架构
# 2. 用共享权重前向/反向 (更新权重)
# 3. 用 REINFORCE 更新 Controller
```

### 3.4 EfficientNet 与复合缩放

**论文**: Tan & Le, "EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks", ICML 2019

**核心创新**: NAS 搜索基线网络 + 复合缩放系数

```
复合缩放 (Compound Scaling):
  深度: depth = α^φ
  宽度: width = β^φ  
  分辨率: resolution = γ^φ
  
  约束: α · β² · γ² ≈ 2  (计算量约翻倍)
  φ: 缩放因子 (控制总计算量)

EfficientNet-B0: NAS 搜索得到的基线 (φ=1)
EfficientNet-B1~B7: 增大 φ 得到更大模型
```

| 模型 | 深度系数 α | 宽度系数 β | 分辨率 γ | 参数量 | Top-1 |
|------|-----------|-----------|---------|--------|-------|
| B0 | 1.0 | 1.0 | 224 | 5.3M | 77.1% |
| B1 | 1.0 | 1.0 | 240 | 7.8M | 79.1% |
| B2 | 1.1 | 1.1 | 260 | 9.2M | 80.1% |
| B3 | 1.2 | 1.2 | 300 | 12M | 81.6% |
| B4 | 1.4 | 1.4 | 380 | 19M | 82.9% |
| B5 | 1.6 | 1.6 | 456 | 30M | 83.6% |
| B6 | 1.8 | 1.8 | 528 | 43M | 84.0% |
| B7 | 2.0 | 2.0 | 600 | 66M | 84.3% |

### 3.5 Once-for-All (OFA)

**论文**: Cai, Gan & Han, "Once-for-All: Train One Network and Specialize it for Efficient Deployment", ICLR 2020

**核心思想**: 训练一个超网，推理时按需提取子网

```
训练阶段: 随机采样子网训练 (Progressive Shrinking)
  - 随机深度: 每层随机跳过
  - 随机宽度: 每层随机选择通道数
  - 随机分辨率: 输入分辨率随机
  - 随机 kernel: 3×3, 5×5, 7×7 随机

部署阶段: 根据硬件约束搜索最优子网
  - 目标: max Accuracy s.t. Latency < T
  - 方法: 进化算法 + 硬件延迟查找表
```

```python
class OFANetwork(nn.Module):
    """Once-for-All 超网"""
    
    def __init__(self, max_depth=7, max_width=6, kernel_sizes=[3,5,7]):
        super().__init__()
        self.blocks = nn.ModuleList()
        for d in range(max_depth):
            block = OFABlock(
                max_channels=max_width * 16,
                kernel_sizes=kernel_sizes,
                expand_ratios=[3, 4, 6]
            )
            self.blocks.append(block)
    
    def forward(self, x, active_config):
        """active_config: 指定每层的深度/宽度/kernel"""
        for d in range(active_config['depth']):
            x = self.blocks[d](
                x,
                active_width=active_config['width'][d],
                active_kernel=active_config['kernel'][d],
                active_expand=active_config['expand'][d]
            )
        return x
```

---

## 4. 实验与基准 (Experiments & Benchmarks)

### 4.1 NAS 方法效率对比

| 方法 | 搜索耗时 | GPU | 搜索数据集 | ImageNet Top-1 | 参数量 |
|------|---------|-----|-----------|---------------|--------|
| NASNet-A | 7 GPU-days | 450 P100 | CIFAR-10 | 82.7% | 5.3M |
| PNAS | 3 GPU-days | 100 P100 | CIFAR-10 | 82.9% | 5.1M |
| ENAS | 0.5 GPU-days | 1 P100 | CIFAR-10 | 82.6% | 4.6M |
| DARTS | 1 GPU-day | 1 V100 | CIFAR-10 | 82.3% | 4.7M |
| EfficientNet-B0 | 搜索+缩放 | 450 TPU | ImageNet | 77.1% | 5.3M |
| OFA | 训练一次 | 8 V100 | ImageNet | 80.0% | 5.1M |
| BigNAS | 1.2 GPU-days | 8 V100 | ImageNet | 79.7% | 5.1M |

### 4.2 NAS vs 手工设计

ImageNet 上的对比 (相似计算量 ~600M FLOPs):

| 架构 | 设计方式 | Top-1 | FLOPs | 参数量 |
|------|---------|-------|-------|--------|
| ResNet-50 | 手工 | 76.1% | 4.1G | 25.6M |
| EfficientNet-B0 | NAS+缩放 | 77.1% | 390M | 5.3M |
| NASNet-A | NAS | 82.7% | 564M | 5.3M |
| RegNetY-4GF | 手工(设计空间) | 78.6% | 4.0G | 20.6M |
| ConvNeXt-T | 手工(现代化) | 82.1% | 4.5G | 28.6M |
| EfficientNetV2-S | NAS+改进 | 83.9% | 8.8G | 21.5M |

**关键洞察**: 
- NAS 在小模型 (mobile) 上优势明显
- 大模型上手工设计 + 现代 trick 可以追平
- 2024+ 手工设计的 ConvNeXt 证明好的设计空间比搜索更重要

### 4.3 硬件感知 NAS 结果

在移动设备上的延迟-精度权衡:

| 方法 | 设备 | 延迟 | Top-1 | FLOPs |
|------|------|------|-------|-------|
| EfficientNet-B0 | Pixel 1 | 143ms | 77.1% | 390M |
| MnasNet-A1 | Pixel 1 | 78ms | 75.2% | 312M |
| FBNet-C | Pixel 1 | 62ms | 74.9% | 375M |
| OFA (searched) | Pixel 1 | 78ms | 76.9% | 300M |
| MCUNet | STM32 | 15ms | 65.2% | 10M |

---

## 5. 代码实现要点 (Implementation)

### 5.1 简化 DARTS 实现

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class MixedOp(nn.Module):
    """DARTS 混合操作: 所有候选操作的加权和"""
    
    OPS = {
        'none': lambda C: Zero(),
        'avg_pool': lambda C: nn.AvgPool2d(3, stride=1, padding=1, count_include_pad=False),
        'max_pool': lambda C: nn.MaxPool2d(3, stride=1, padding=1),
        'skip': lambda C: Identity(),
        'sep_conv_3x3': lambda C: SepConv(C, C, 3, 1),
        'sep_conv_5x5': lambda C: SepConv(C, C, 5, 2),
        'dil_conv_3x3': lambda C: DilConv(C, C, 3, 1, 2),
        'dil_conv_5x5': lambda C: DilConv(C, C, 5, 2, 4),
    }
    
    def __init__(self, C):
        super().__init__()
        self.ops = nn.ModuleList([
            op_fn(C) for op_fn in self.OPS.values()
        ])
    
    def forward(self, x, weights):
        """weights: softmax 后的架构权重"""
        return sum(w * op(x) for w, op in zip(weights, self.ops))


class DARTSSearchCell(nn.Module):
    """DARTS 搜索细胞"""
    
    def __init__(self, C, num_nodes=4):
        super().__init__()
        self.num_nodes = num_nodes
        self.num_ops = 8
        
        # 架构参数
        self.arch_params = nn.ParameterList()
        self.mixed_ops = nn.ModuleList()
        
        for j in range(num_nodes):
            num_inputs = j + 2
            self.arch_params.append(
                nn.Parameter(torch.zeros(num_inputs, self.num_ops))
            )
            for i in range(num_inputs):
                self.mixed_ops.append(MixedOp(C))
    
    def forward(self, states):
        """states: [s0, s1] 前两个细胞输出"""
        offset = 0
        for j in range(self.num_nodes):
            num_inputs = j + 2
            weights = F.softmax(self.arch_params[j], dim=-1)
            
            s_j = sum(
                self.mixed_ops[offset + i](states[i], weights[i])
                for i in range(num_inputs)
            )
            states.append(s_j)
            offset += num_inputs
        
        return torch.cat(states[2:], dim=1)
```

### 5.2 零成本代理指标 (Zero-Cost Proxies)

```python
def naswot_score(model, data_loader, num_batches=1):
    """NASWOT: 无需训练即可评估架构质量
    
    基于 Jacobian 矩阵的 kernel 质量
    分数越高 → 架构表达能力越强
    """
    model.eval()
    K_sum = None
    
    for i, (inputs, _) in enumerate(data_loader):
        if i >= num_batches:
            break
        
        inputs = inputs[:64]  # 小 batch
        inputs.requires_grad_(True)
        
        # 前向
        output = model(inputs)
        
        # 计算 Jacobian
        # 使用 logdet(K) 其中 K = J @ J^T
        # 简化: 用梯度相关性近似
        output.sum().backward()
        
        grad = inputs.grad.view(inputs.size(0), -1)
        K = grad @ grad.T  # (B, B) kernel matrix
        
        if K_sum is None:
            K_sum = K
        else:
            K_sum += K
    
    # log|K| 作为分数
    sign, logdet = torch.slogdet(K_sum)
    return logdet.item()


def synflow_score(model, input_shape):
    """SynFlow: 基于参数敏感度的零成本代理"""
    # 将所有参数取绝对值
    for p in model.parameters():
        p.data.abs_()
    
    # 全 1 输入
    x = torch.ones(1, *input_shape)
    
    # 前向
    output = model(x)
    
    # 反向 (全 1 梯度)
    output.sum().backward()
    
    # SynFlow = Σ |θ_i * ∂L/∂θ_i|
    score = sum(
        (p * p.grad).abs().sum().item()
        for p in model.parameters()
        if p.grad is not None
    )
    return score
```

### 5.3 硬件延迟查找表

```python
class HardwareLatencyLookup:
    """硬件延迟查找表: 预测量每个操作的延迟"""
    
    def __init__(self, device='pixel_4'):
        self.device = device
        self.latency_table = self._build_table()
    
    def _build_table(self):
        """预测量所有 (input_res, output_res, kernel, channels) 组合"""
        table = {}
        for h_in in [14, 28, 56, 112, 224]:
            for h_out in [14, 28, 56, 112, 224]:
                for k in [3, 5, 7]:
                    for c_in in [16, 24, 32, 48, 64, 96, 128]:
                        for c_out in [16, 24, 32, 48, 64, 96, 128]:
                            key = (h_in, h_out, k, c_in, c_out)
                            table[key] = self._measure_latency(key)
        return table
    
    def predict_latency(self, architecture):
        """预测整个网络的延迟"""
        total = 0
        for layer_config in architecture:
            key = self._config_to_key(layer_config)
            total += self.latency_table.get(key, self._estimate(key))
        return total
    
    def _measure_latency(self, config, warmup=10, repeat=50):
        """在真实硬件上测量"""
        # 实际实现: 在设备上运行并计时
        import time
        # ... 省略具体实现
        return 0.0  # placeholder
```

---

## 6. 对比表 (Comparison Tables)

### 6.1 NAS 方法全面对比

| 方法 | 搜索策略 | 搜索空间 | 权重共享 | 搜索成本 | 可迁移性 |
|------|---------|---------|---------|---------|---------|
| NASNet | RL | Cell-based | 否 | 极高 | 中 |
| PNAS | SMBO | Cell-based | 否 | 高 | 中 |
| ENAS | RL + 共享 | Cell-based | 是 | 低 | 中 |
| DARTS | 梯度 | Cell-based | 是 | 很低 | 中 |
| EfficientNet | NAS + 缩放 | MBConv | N/A | 中 | 高 |
| OFA | 随机训练 | 弹性网络 | 是 | 一次训练 | 很高 |
| BigNAS | 随机训练 | 弹性网络 | 是 | 低 | 高 |
| AlphaNet | RL + 硬件 | 弹性网络 | 是 | 中 | 高 |

### 6.2 NAS vs 手工设计: 何时选择

```
选择 NAS:
├── 部署目标特殊 (IoT, 特定 NPU)
├── 需要极致效率 (延迟/能耗约束严格)
├── 新硬件/新算子 (无经验可参考)
└── 需要多目标优化 (精度+延迟+内存)

选择手工设计:
├── 大模型训练 (Transformer/LLM)
├── 需要可解释性/理论保证
├── 搜索空间不明确
├── 计算资源有限 (无法搜索)
└── 追求训练稳定性
```

---

## 7. 2026 前沿进展 (Frontier 2026)

### 7.1 LLM-driven NAS

2025-2026 年最热门方向: 利用 LLM 的代码生成和推理能力进行架构搜索

```python
class LLMDrivenNAS:
    """用 LLM 作为架构搜索的'大脑'"""
    
    def __init__(self, llm_client):
        self.llm = llm_client
        self.archive = []  # 已评估的架构
    
    def search(self, task_description, constraints):
        prompt = f"""
        你是一个神经网络架构设计专家。
        
        任务: {task_description}
        约束: {constraints}
        
        已尝试的架构及结果:
        {self.format_archive()}
        
        请设计一个新的架构，用 PyTorch 代码表示。
        要求:
        1. 与已有架构不同
        2. 解释你的设计思路
        3. 预测其性能
        """
        
        response = self.llm.generate(prompt)
        architecture = self.parse_code(response)
        return architecture
    
    def evolutionary_loop(self, num_iterations=50):
        """LLM + 进化: LLM 生成变异，评估后反馈"""
        for i in range(num_iterations):
            # LLM 生成候选
            candidate = self.search(
                self.task, self.constraints
            )
            # 评估
            score = self.evaluate(candidate)
            self.archive.append((candidate, score))
            
            # 保留 Top-K 作为下一轮参考
            self.archive.sort(key=lambda x: x[1], reverse=True)
            self.archive = self.archive[:20]
```

### 7.2 自动架构发现 (Automated Architecture Discovery)

2026 年趋势: 从"搜索预定义空间"到"发现新算子"

```
传统 NAS: 在 {Conv3x3, Conv5x5, Pool, Skip, ...} 中选择
2026 NAS: 让 AI 发现全新的计算原语

方法:
1. 程序合成: LLM 生成新的算子代码
2. 符号回归: 发现新的激活函数/连接模式
3. 神经算子搜索: 搜索连续函数空间
4. 跨模态迁移: 从其他领域借鉴结构
```

### 7.3 NAS for LLM Architecture

将 NAS 应用于 Transformer/LLM 架构设计:

```
搜索维度:
- 注意力头数 & 维度
- FFN 扩展比
- 层数分配
- MoE 专家数 & Top-K
- 归一化位置 & 类型
- 位置编码方案
- 残差连接模式

挑战:
- 评估成本极高 (LLM 训练昂贵)
- 需要代理任务/小规模评估
- 搜索空间维度灾难
```

### 7.4 One-for-All 网络的扩展

```
2020 OFA: 一个 CNN 超网 → 任意移动子网
2026 OFA-LLM: 一个 LLM 超网 → 任意规模子模型

实现:
- 弹性深度: 跳过任意层
- 弹性宽度: 每层可选维度
- 弹性注意力: 头数可变
- 弹性 MoE: 专家数/Top-K 可变

部署: 根据 API 请求的延迟预算，动态选择子网
```

---

## 8. 与手工设计的对比 (NAS vs Manual Design)

### 8.1 历史视角

```
2012-2018: NAS 超越手工设计 (在 CNN 小模型上)
  - NASNet > ResNet (相同 FLOPs)
  - EfficientNet > 所有手工 CNN

2019-2022: 手工设计反击
  - RegNet: 设计空间工程 > 盲目搜索
  - ConvNeXt: 现代化 CNN 追平 ViT
  - Swin Transformer: 人工设计 > NAS Transformer

2023-2026: 融合时代
  - LLM 辅助设计: 人类直觉 + AI 搜索
  - NAS 用于特定约束 (边缘设备)
  - 大模型架构仍主要靠人工 + 消融实验
```

### 8.2 为什么大模型时代 NAS 式微？

1. **评估成本**: 训练一个 LLM 候选需要数百万美元
2. **搜索空间不明确**: LLM 创新更多在训练策略而非架构
3. **涌现能力**: 小模型上的性能不能预测大模型行为
4. **工程复杂度**: 分布式训练、混合精度等使评估更困难
5. **设计直觉有效**: Transformer 变体的改进多来自理论洞察

---

## 9. 相关概念 (Related Concepts)

- [[Attention_Mechanisms_Deep_Dive]] — Transformer 架构搜索
- [[Neural_Network_Core]] — 神经网络核心架构
- [[Optimization]] — NAS 中的双层优化
- [[Convolutional_Architectures_Evolution]] — CNN 架构演进与 NAS
- [[Mixture_of_Experts_Theory]] — MoE 架构的自动搜索
- [[03_深度学习/08_DL_Frameworks/index|深度学习框架]] — NNI, AutoKeras 等 NAS 工具
- [[03_深度学习/03_Optimization/index|优化]] — 超参数优化与 NAS 的关系

---

## 10. 参考文献 (References)

1. Zoph, B. & Le, Q.V. (2017). "Neural Architecture Search with Reinforcement Learning." ICLR.
2. Liu, C. et al. (2018). "Progressive Neural Architecture Search." ECCV.
3. Pham, H. et al. (2018). "Efficient Neural Architecture Search via Parameter Sharing." ICML.
4. Liu, H., Simonyan, K. & Yang, Y. (2019). "DARTS: Differentiable Architecture Search." ICLR.
5. Tan, M. & Le, Q.V. (2019). "EfficientNet: Rethinking Model Scaling for CNNs." ICML.
6. Cai, H., Gan, C. & Han, S. (2020). "Once-for-All: Train One Network and Specialize it." ICLR.
7. Radosavovic, I. et al. (2020). "Designing Network Design Spaces." CVPR (RegNet).
8. Liu, Z. et al. (2022). "A ConvNet for the 2020s." CVPR (ConvNeXt).
