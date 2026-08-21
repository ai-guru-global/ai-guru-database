---
title: 神经架构搜索 (Neural Architecture Search)
category: 03-deep-learning
tags: ["nas", "darts", "one-shot", "auto-design", "efficient-architectures"]
summary: "神经架构搜索完整技术体系：搜索空间设计、搜索策略（RL/进化/梯度）、One-Shot NAS、DARTS，以及 2026 年 LLM 架构自动设计的前沿进展。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "神经架构搜索"
---
# 神经架构搜索 (Neural Architecture Search)

> 中文简称：神经架构搜索

## 1. NAS 核心框架

### 1.1 三要素

```
NAS = 搜索空间 + 搜索策略 + 性能评估

┌─────────────────────────────────────────────────┐
│  搜索空间 (Search Space):                       │
│  定义"哪些架构是可能的"                         │
│  - 链式/单元式/层级式                          │
│  - 操作集合: Conv3×3, Conv5×5, Skip, Pool...   │
│  - 连接模式: 密集/残差/多分支                  │
├─────────────────────────────────────────────────┤
│  搜索策略 (Search Strategy):                    │
│  定义"如何探索搜索空间"                         │
│  - 强化学习 (RL Controller)                    │
│  - 进化算法 (Mutation/Crossover)               │
│  - 梯度优化 (DARTS/连续松弛)                   │
│  - 贝叶斯优化 (高斯过程/TPE)                   │
├─────────────────────────────────────────────────┤
│  性能评估 (Performance Estimation):             │
│  定义"如何快速评价一个架构"                     │
│  - 完整训练 (准确但极慢)                       │
│  - 权重共享 (One-Shot, 快但有偏)               │
│  - 代理任务 (小数据集/少轮次)                  │
│  - 性能预测器 (学习曲线外推)                   │
└─────────────────────────────────────────────────┘
```

### 1.2 NAS 演进

| 时期 | 代表方法 | 搜索成本 | 特点 |
|------|----------|----------|------|
| 2017 | NASNet (RL) | 2000 GPU-days | 开创性，极贵 |
| 2018 | ENAS (权重共享) | 0.5 GPU-day | 效率突破 |
| 2018 | PNAS (渐进) | 100 GPU-days | 由简到繁 |
| 2019 | DARTS (梯度) | 1.5 GPU-days | 连续松弛 |
| 2019 | OFA (一次训练) | 40 GPU-days | 多分辨率 |
| 2020 | BigNAS/AlphaNet | 10 GPU-days | 移动端 |
| 2021 | AutoFormer (Transformer) | 12 GPU-days | Transformer NAS |
| 2023 | LLM-NAS | 100+ GPU-days | LLM 架构搜索 |
| 2025 | AI-Driven Design | - | LLM 辅助架构设计 |

## 2. 搜索空间设计

### 2.1 单元搜索空间 (Cell-Based)

```python
# NASNet/DARTS 风格: 搜索"单元"结构，堆叠成网络
# 单元 = 有向无环图 (DAG)
# 节点 = 中间特征图
# 边 = 操作 (operation)

# 操作集合:
OPERATIONS = [
    'sep_conv_3x3',    # 深度可分离卷积 3×3
    'sep_conv_5x5',    # 深度可分离卷积 5×5
    'dil_conv_3x3',    # 膨胀卷积 3×3
    'dil_conv_5x5',    # 膨胀卷积 5×5
    'avg_pool_3x3',    # 平均池化
    'max_pool_3x3',    # 最大池化
    'skip_connect',    # 跳跃连接
    'zero',            # 零操作 (断开)
]

# 搜索: 每个单元选 4 条边 × 8 种操作 = 组合空间 ~10^18
# DARTS 将其松弛为连续优化问题
```

### 2.2 Transformer 搜索空间

```python
# AutoFormer/NASFormer 搜索维度:
TRANSFORMER_SEARCH_SPACE = {
    'num_layers': [6, 12, 18, 24],        # 层数
    'num_heads': [4, 8, 12, 16],          # 注意力头数
    'hidden_dim': [256, 512, 768, 1024],  # 隐藏维度
    'ffn_dim': [1024, 2048, 3072, 4096],  # FFN 维度
    'ffn_type': ['standard', 'gated', 'moe'],  # FFN 类型
    'attention_type': ['full', 'gqa', 'linear'],  # 注意力类型
    'norm_type': ['layernorm', 'rmsnorm', 'prenorm'],  # 归一化
    'activation': ['gelu', 'swiglu', 'relu2'],  # 激活函数
}

# 2026 趋势: 搜索混合架构
# - Transformer + SSM 层的排列
# - 不同层使用不同注意力类型
# - MoE 专家数量和路由策略
```

## 3. 搜索策略

### 3.1 DARTS (可微分 NAS)

```python
import torch
import torch.nn.functional as F

class DARTSCell(torch.nn.Module):
    """
    DARTS: 将离散选择松弛为连续权重
    每条边不是"选一个操作"，而是"所有操作的加权和"
    """
    def __init__(self, n_nodes=4, n_ops=8):
        super().__init__()
        self.n_nodes = n_nodes
        self.n_ops = n_ops
        
        # 架构参数 α (可学习!)
        # 每条边有 n_ops 个权重 (softmax 归一化)
        self.arch_params = torch.nn.Parameter(
            torch.randn(n_nodes * (n_nodes + 1) // 2, n_ops) * 1e-3
        )
        
        # 所有可能的操作
        self.ops = torch.nn.ModuleList([
            build_operation(op_name) for op_name in OPERATIONS
        ])
    
    def forward(self, x):
        # 架构权重 (softmax 归一化)
        weights = F.softmax(self.arch_params, dim=-1)
        
        # 每条边 = 所有操作的加权和
        # output = Σ_i α_i × op_i(x)
        # 训练时: 同时优化网络权重 w 和架构权重 α
        # 交替优化:
        #   step 1: 固定 α, 更新 w (正常训练)
        #   step 2: 固定 w, 更新 α (架构搜索)
        pass
    
    def derive_architecture(self):
        """训练后: 选择每条边权重最大的操作"""
        weights = F.softmax(self.arch_params, dim=-1)
        selected_ops = weights.argmax(dim=-1)
        return selected_ops

# DARTS 训练流程:
# 1. 构建超网 (所有操作并存)
# 2. 交替优化 w 和 α (~50 epochs)
# 3. 离散化: 选择 top-2 操作
# 4. 从头训练最终架构 (~600 epochs)
```

### 3.2 One-Shot NAS (权重共享)

```python
# 核心思想: 训练一个"超网"包含所有子网络
# 评估时: 从超网中采样子网络，共享权重

class SuperNet(torch.nn.Module):
    """
    超网: 包含搜索空间中所有可能的路径
    每次前向: 随机采样一条路径
    """
    def __init__(self, search_space):
        super().__init__()
        self.layers = torch.nn.ModuleList()
        for layer_choices in search_space:
            # 每层包含所有候选操作
            layer_ops = torch.nn.ModuleDict({
                name: build_op(name) for name in layer_choices
            })
            self.layers.append(layer_ops)
    
    def forward(self, x, architecture=None):
        if architecture is None:
            # 训练: 随机采样架构
            architecture = self.random_sample()
        
        for layer_ops, choice in zip(self.layers, architecture):
            x = layer_ops[choice](x)
        return x
    
    def random_sample(self):
        """均匀随机采样一个子网络"""
        return [
            random.choice(list(layer.keys())) 
            for layer in self.layers
        ]
    
    def evaluate_subnet(self, architecture, val_loader):
        """评估特定子网络的性能"""
        self.eval()
        correct = 0
        for x, y in val_loader:
            pred = self.forward(x, architecture)
            correct += (pred.argmax(1) == y).sum()
        return correct / len(val_loader.dataset)

# 搜索: 进化算法/随机搜索在超网中找最优子网
# 优势: 一次训练，评估任意子网 (秒级)
# 劣势: 权重共享引入排序不一致性
```

### 3.3 进化算法 NAS

```python
import random

def evolutionary_nas(search_space, population_size=50, 
                     generations=100, mutation_rate=0.1):
    """
    进化 NAS: 架构作为"基因"，通过变异和交叉进化
    """
    # 初始化种群
    population = [random_architecture(search_space) 
                  for _ in range(population_size)]
    
    for gen in range(generations):
        # 评估适应度 (训练+验证)
        fitness = [evaluate(arch) for arch in population]
        
        # 选择 (锦标赛选择)
        parents = tournament_select(population, fitness)
        
        # 生成下一代
        offspring = []
        for _ in range(population_size):
            parent1, parent2 = random.sample(parents, 2)
            
            # 交叉: 从两个父代各取一部分
            child = crossover(parent1, parent2)
            
            # 变异: 随机改变某些选择
            child = mutate(child, mutation_rate, search_space)
            
            offspring.append(child)
        
        # 精英保留
        elite = sorted(zip(population, fitness), 
                      key=lambda x: -x[1])[:5]
        population = [e[0] for e in elite] + offspring[:-5]
    
    return max(population, key=evaluate)

def mutate(arch, rate, search_space):
    """随机变异架构"""
    new_arch = arch.copy()
    for i in range(len(new_arch)):
        if random.random() < rate:
            new_arch[i] = random.choice(search_space[i])
    return new_arch
```

## 4. 2026 前沿：LLM 辅助架构设计

### 4.1 LLM 作为架构搜索器

```python
# 2025-2026 新范式: 用 LLM 生成和评估架构

def llm_architecture_search(task_description, constraints):
    """
    用 LLM 生成候选架构 → 自动评估 → 迭代优化
    """
    prompt = f"""
    设计一个神经网络架构，满足以下要求:
    - 任务: {task_description}
    - 约束: {constraints}
    - 目标: 最大化精度，最小化 FLOPs
    
    请输出架构的 Python 代码 (PyTorch):
    """
    
    # LLM 生成候选架构
    candidates = [call_llm(prompt) for _ in range(10)]
    
    # 自动评估
    results = []
    for code in candidates:
        try:
            model = execute_and_build(code)
            accuracy = quick_evaluate(model)
            flops = count_flops(model)
            results.append((code, accuracy, flops))
        except:
            continue
    
    # 反馈给 LLM 迭代改进
    best = max(results, key=lambda x: x[1] / x[2])
    return best
```

### 4.2 手动设计 vs NAS

```
2026 现实:
- 大多数 SOTA 模型仍是人工设计 (GPT/LLaMA/Qwen)
- NAS 在特定约束下有价值 (边缘/移动端)
- LLM 辅助设计正在兴起 (但尚未超越专家)
- 混合趋势: 人工设计大框架 + NAS 优化细节

NAS 最有价值的场景:
1. 边缘设备: 严格延迟/功耗约束
2. 特定硬件: 针对特定芯片优化
3. 多目标: 精度-速度-大小帕累托前沿
4. 重复性设计: 每个新任务自动搜索
```

## 5. 实践建议

| 场景 | 推荐方法 | 预算 |
|------|----------|------|
| 学术研究 | DARTS/P-DARTS | 1-2 GPU-days |
| 移动端部署 | OFA/BigNAS | 10-40 GPU-days |
| Transformer 优化 | AutoFormer | 12 GPU-days |
| 快速原型 | 随机搜索 + 权重共享 | 0.5 GPU-day |
| 生产级 | 人工设计 + 消融实验 | 专家时间 |

## 相关文档

- [[概念/Training/knowledge-distillation.md|知识蒸馏]] — 模型压缩
- [[03_深度学习/08_DL框架/|深度学习框架]] — 实现工具
- [[05_大模型/04_LLM架构/|LLM 架构]] — 手动设计
- [[07_模型训练/03_训练优化/|优化方法]] — 训练策略
- [[10_部署推理/01_部署基础/04_边缘_部署|边缘部署]] — 约束优化
