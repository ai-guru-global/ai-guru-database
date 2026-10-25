---
title: 持续学习 (Continual Learning)
category: 03-deep-learning
tags: ["continual-learning", "catastrophic-forgetting", "ewc", "progressive-networks", "lifelong-learning"]
summary: "持续学习完整技术体系：灾难性遗忘问题、正则化方法（EWC/SI）、回放方法（Experience Replay）、架构方法（渐进网络/LoRA），以及 LLM 持续对齐和终身学习的 2026 实践。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "持续学习"
---
# 持续学习 (Continual Learning)

> 中文简称：持续学习

## 1. 核心问题：灾难性遗忘

### 1.1 什么是灾难性遗忘？

```
场景: 模型先学任务 A，再学任务 B
结果: 学完 B 后，A 的性能大幅下降

原因:
- 神经网络参数是"共享"的
- 学习 B 时更新参数 → 覆盖 A 的知识
- 没有"选择性保护"机制

类比:
- 人脑: 学新技能不会忘记旧技能 (海马体→皮层巩固)
- 神经网络: 学新任务直接覆盖旧权重 (无巩固机制)

量化:
  遗忘率 = Acc_A(after) - Acc_A(before)
  典型: 学完 5 个任务后，第 1 个任务准确率从 95% → 20%
```

### 1.2 持续学习的三种场景

| 场景 | 定义 | 难度 | 示例 |
|------|------|------|------|
| 任务增量 (Task-IL) | 知道当前是哪个任务 | 最易 | 多语言模型 |
| 域增量 (Domain-IL) | 输入分布变化，任务不变 | 中等 | 不同风格手写识别 |
| 类增量 (Class-IL) | 新类别加入，需区分所有类 | 最难 | 持续目标检测 |

## 2. 正则化方法

### 2.1 EWC (Elastic Weight Consolidation)

```python
import torch
from copy import deepcopy

class EWC:
    """
    EWC: 用 Fisher 信息矩阵衡量参数重要性
    重要参数 (对旧任务关键) → 更新时加大惩罚
    不重要参数 → 自由更新
    """
    def __init__(self, model, lambda_ewc=5000):
        self.model = model
        self.lambda_ewc = lambda_ewc
        self.fisher = {}      # Fisher 信息 (参数重要性)
        self.optimal_params = {}  # 旧任务最优参数
    
    def compute_fisher(self, dataloader):
        """
        计算 Fisher 信息矩阵 (对角近似)
        F_i = E[(∂log p(y|x,θ) / ∂θ_i)²]
        直觉: 梯度方差大 → 参数对输出影响大 → 重要
        """
        self.model.eval()
        fisher = {n: torch.zeros_like(p) 
                  for n, p in self.model.named_parameters() 
                  if p.requires_grad}
        
        for x, y in dataloader:
            self.model.zero_grad()
            output = self.model(x)
            loss = torch.nn.functional.cross_entropy(output, y)
            loss.backward()
            
            for n, p in self.model.named_parameters():
                if p.requires_grad and p.grad is not None:
                    fisher[n] += p.grad.data.pow(2)
        
        # 归一化
        n_samples = len(dataloader.dataset)
        for n in fisher:
            fisher[n] /= n_samples
        
        self.fisher = fisher
        self.optimal_params = {n: p.data.clone() 
                              for n, p in self.model.named_parameters()
                              if p.requires_grad}
    
    def penalty(self):
        """
        EWC 正则项: Σ_i F_i × (θ_i - θ*_i)²
        重要参数偏离旧值 → 大惩罚
        """
        loss = 0
        for n, p in self.model.named_parameters():
            if n in self.fisher:
                loss += (self.fisher[n] * 
                        (p - self.optimal_params[n]).pow(2)).sum()
        return self.lambda_ewc * loss
    
    def update_task(self, dataloader):
        """学完一个任务后，计算并保存 Fisher"""
        self.compute_fisher(dataloader)

# 训练循环:
# for task in tasks:
#     train(model, task_data, ewc_penalty=ewc.penalty)
#     ewc.update_task(task_data)  # 保存当前任务的 Fisher
```

### 2.2 SI (Synaptic Intelligence)

```python
class SynapticIntelligence:
    """
    SI: 在线估计参数重要性 (无需额外前向)
    追踪每个参数对 loss 下降的贡献
    """
    def __init__(self, model, epsilon=1e-7):
        self.model = model
        self.epsilon = epsilon
        self.omega = {}  # 累积重要性
        self.W = {}      # 当前任务的贡献
        self.p_old = {}  # 任务开始时的参数
        
        for n, p in model.named_parameters():
            if p.requires_grad:
                self.omega[n] = torch.zeros_like(p)
                self.W[n] = torch.zeros_like(p)
                self.p_old[n] = p.data.clone()
    
    def update_importance(self):
        """每个训练步后更新"""
        for n, p in self.model.named_parameters():
            if p.requires_grad and p.grad is not None:
                # 贡献 = -梯度 × 参数变化
                self.W[n] += (-p.grad.data * (p.data - self.p_old[n]))
                self.p_old[n] = p.data.clone()
    
    def task_done(self):
        """任务结束时，归一化并累积"""
        for n, p in self.model.named_parameters():
            if n in self.omega:
                delta = (p.data - self.p_old[n]).pow(2) + self.epsilon
                self.omega[n] += self.W[n] / delta
                self.W[n].zero_()
    
    def penalty(self):
        loss = 0
        for n, p in self.model.named_parameters():
            if n in self.omega:
                loss += (self.omega[n] * 
                        (p - self.p_old[n]).pow(2)).sum()
        return loss
```

## 3. 回放方法 (Replay)

### 3.1 经验回放 (Experience Replay)

```python
import random
from collections import deque

class ExperienceReplay:
    """
    保存旧任务的少量样本，学习新任务时混合训练
    """
    def __init__(self, buffer_size=1000):
        self.buffer = deque(maxlen=buffer_size)
    
    def add(self, samples):
        """任务结束后，保存代表性样本"""
        for sample in samples:
            self.buffer.append(sample)
    
    def sample(self, batch_size):
        """从缓冲区随机采样"""
        return random.sample(list(self.buffer), 
                           min(batch_size, len(self.buffer)))
    
    def get_rehearsal_batch(self, new_batch, replay_ratio=0.5):
        """混合新数据和旧数据"""
        n_replay = int(len(new_batch) * replay_ratio)
        n_new = len(new_batch) - n_replay
        
        replay_samples = self.sample(n_replay)
        combined = list(new_batch[:n_new]) + replay_samples
        random.shuffle(combined)
        return combined

# 变体:
# - 随机回放: 随机保存样本
# - 梯度回放: 保存梯度方向最有代表性的样本
# - 生成回放: 用生成模型生成旧任务的伪样本
# - 特征回放: 保存中间特征而非原始数据 (隐私友好)
```

### 3.2 生成式回放 (Generative Replay)

```python
# 用生成模型 (VAE/GAN/Diffusion) 生成旧任务数据
# 优势: 无需存储真实数据 (隐私)

class GenerativeReplay:
    def __init__(self, generator):
        self.generator = generator  # 生成旧数据的模型
    
    def generate_old_samples(self, n_samples, task_id):
        """生成旧任务的伪样本"""
        with torch.no_grad():
            z = torch.randn(n_samples, self.generator.latent_dim)
            task_embedding = self.get_task_embedding(task_id)
            fake_samples = self.generator(z, task_embedding)
        return fake_samples
    
    def train_with_replay(self, model, new_data, old_task_ids):
        """混合真实新数据 + 生成的旧数据"""
        fake_old = self.generate_old_samples(
            len(new_data), random.choice(old_task_ids)
        )
        combined = torch.cat([new_data, fake_old])
        # 正常训练...
```

## 4. 架构方法

### 4.1 渐进网络 (Progressive Networks)

```python
# 核心思想: 每个新任务添加新列，旧列冻结
# 优势: 零遗忘 (旧参数完全不动)
# 劣势: 模型无限增长

class ProgressiveNetwork(torch.nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.columns = torch.nn.ModuleList()
        self.add_task(input_dim, hidden_dim, output_dim)
    
    def add_task(self, input_dim, hidden_dim, output_dim):
        """新任务: 添加新列"""
        # 冻结所有旧列
        for col in self.columns:
            for param in col.parameters():
                param.requires_grad = False
        
        # 新列 (带横向连接)
        new_col = TaskColumn(input_dim, hidden_dim, output_dim,
                            n_prev_columns=len(self.columns))
        self.columns.append(new_col)
    
    def forward(self, x, task_id=None):
        if task_id is None:
            task_id = len(self.columns) - 1
        
        # 前向通过所有列到 task_id
        activations = [x]
        for i, col in enumerate(self.columns[:task_id+1]):
            prev_acts = activations if i > 0 else None
            act = col(activations[-1], prev_acts)
            activations.append(act)
        
        return activations[-1]
```

### 4.2 LoRA 持续学习 (2024-2026)

```python
# LoRA 天然适合持续学习:
# - 基础权重冻结 (保留通用知识)
# - 每个任务/领域一个 LoRA 适配器
# - 推理时选择/组合对应 LoRA

class LoRAContinualLearner:
    """
    每个新任务训练一个新 LoRA，旧 LoRA 保存
    """
    def __init__(self, base_model, rank=16):
        self.base_model = base_model  # 冻结
        self.lora_adapters = {}       # task_id → LoRA 权重
    
    def learn_new_task(self, task_id, task_data):
        """为新任务训练 LoRA"""
        # 冻结基础模型
        for param in self.base_model.parameters():
            param.requires_grad = False
        
        # 添加新 LoRA
        lora = inject_lora(self.base_model, rank=16)
        
        # 训练 LoRA
        train(lora, task_data)
        
        # 保存并卸载
        self.lora_adapters[task_id] = extract_lora_weights(lora)
        remove_lora(self.base_model)
    
    def inference(self, x, task_id):
        """加载对应 LoRA 推理"""
        load_lora(self.base_model, self.lora_adapters[task_id])
        output = self.base_model(x)
        remove_lora(self.base_model)
        return output
    
    def merge_adapters(self, task_ids, weights=None):
        """合并多个 LoRA (多任务推理)"""
        if weights is None:
            weights = [1.0/len(task_ids)] * len(task_ids)
        
        merged = {}
        for tid, w in zip(task_ids, weights):
            for name, param in self.lora_adapters[tid].items():
                if name not in merged:
                    merged[name] = w * param
                else:
                    merged[name] += w * param
        
        return merged
```

## 5. LLM 持续学习 (2025-2026)

### 5.1 持续对齐

```
问题: LLM 部署后需要持续学习新偏好/新知识
挑战: 更新时不能遗忘已有能力

方案:
1. LoRA 热插拔: 每个领域/时期一个 LoRA
2. 知识编辑: 精确修改特定知识 (ROME/MEMIT)
3. 持续 RLHF: 增量偏好数据 + 正则化
4. RAG 补充: 新知识放检索库，不改模型
5. 定期重训: 累积数据后全量重训 (成本高)
```

### 5.2 方法选择指南

```
持续学习需求 → 推荐方案:
├── 新增领域知识
│   ├── 知识量小 → RAG (不改模型)
│   ├── 知识量大 → 领域 LoRA 微调
│   └── 需要精确编辑 → 知识编辑 (MEMIT)
├── 新增用户偏好
│   ├── 少量偏好 → In-Context Learning
│   └── 大量偏好 → 增量 DPO + EWC 正则
├── 新增任务能力
│   ├── 独立任务 → 新 LoRA 适配器
│   └── 相关任务 → 渐进式微调 + 回放
└── 模型升级
    ├── 小版本 → 继续训练 + 回放
    └── 大版本 → 全量重训 + 蒸馏旧知识
```

## 6. 评估指标

| 指标 | 公式 | 含义 |
|------|------|------|
| 平均准确率 | (1/T)Σ A_i | 所有任务的平均性能 |
| 遗忘率 | A_i^init - A_i^final | 学完后旧任务下降多少 |
| 前向迁移 | A_i^init - A_i^random | 旧知识对新任务的帮助 |
| 后向迁移 | A_i^final - A_i^isolated | 新知识对旧任务的帮助 |
| 学习效率 | 达到目标性能的训练量 | 学习速度 |

## 相关文档

- [[03_深度学习/01_深度学习基础/|深度学习基础]]
- [[05_大模型/06_微调技术/|微调技术]] — LoRA/QLoRA
- [[概念/Math/online-learning.md|在线学习]] — 流式更新
- [[07_模型训练/03_训练优化/|优化方法]] — 正则化
- [[05_大模型/04_LLM架构/|LLM 架构]] — 模块化设计
