---
title: "LLM 课程学习: 数据排序与调度策略 (Curriculum Learning for LLMs)"
category: "07-model-training"
tags: ["curriculum-learning", "data-ordering", "data-scheduling", "data-mixture", "pretraining", "sft", "adaptive-curriculum"]
summary: "> **一句话理解**: 课程学习就像教小孩读书——先读绘本，再读童话，最后读名著。如果一上来就啃《红楼梦》，孩子不但学不会，还会产生厌学情绪（训练不稳定）。LLM 训练同理：数据的呈现顺序和配比调度，直接影响收敛速度和最终性能。"
created: 2026-07-19
updated: 2026-07-19
tier: supporting
aliases:
  - "Curriculum Learning for LLMs"
  - "LLM课程学习"
  - Curriculum_Learning_for_LLMs
sources: []

name_zh: "LLM 课程学习: 数据排序与调度策略"
---
# LLM 课程学习: 数据排序与调度策略 (Curriculum Learning for LLMs)

> 中文简称：LLM 课程学习: 数据排序与调度策略

> **一句话理解**: 课程学习就像教小孩读书——先读绘本，再读童话，最后读名著。如果一上来就啃《红楼梦》，孩子不但学不会，还会产生厌学情绪（训练不稳定）。LLM 训练同理：数据的呈现顺序和配比调度，直接影响收敛速度和最终性能。

---

## 目录

1. [概述](#1-概述)
2. [核心原理](#2-核心原理)
3. [数据排序策略](#3-数据排序策略)
4. [在线课程学习](#4-在线课程学习)
5. [数据混合调度](#5-数据混合调度)
6. [与数据配比的关系](#6-与数据配比的关系)
7. [预训练阶段课程](#7-预训练阶段课程)
8. [SFT 阶段课程](#8-sft-阶段课程)
9. [实践架构](#9-实践架构)
10. [对比表](#10-对比表)
11. [代码与配置示例](#11-代码与配置示例)
12. [2026 前沿](#12-2026-前沿)
13. [相关概念](#13-相关概念)

---

## 1. 概述

### 1.1 什么是课程学习

课程学习 (Curriculum Learning) 由 Bengio et al. (2009) 提出，核心思想是:

> **按照从易到难的顺序呈现训练数据，可以加速收敛并提升最终性能。**

对于 LLM 训练，课程学习体现在三个层面:

1. **数据排序 (Ordering)**: 单个数据域内的呈现顺序
2. **数据调度 (Scheduling)**: 不同数据域的配比随训练进程变化
3. **数据选择 (Selection)**: 动态选择当前最有价值的数据

### 1.2 为什么 LLM 需要课程学习

```
无课程 (Random Shuffle):          有课程 (Easy → Hard):
Loss                              Loss
 │╲                                │╲
 │  ╲  ╱╲  ╱╲  ← 震荡大           │  ╲
 │   ╲╱  ╲╱  ╲╱╲                  │   ╲    ← 平滑下降
 │              ╲── ← loss 较高    │    ╲──── ← loss 更低
 └──────────── Steps               └──────────── Steps

优势: 收敛速度 +20-40%, 最终性能 +1-3%, 训练稳定性显著改善
```

### 1.3 LLM 课程学习的独特挑战

| 挑战 | 说明 |
|------|------|
| 数据规模巨大 | 数万亿 tokens，无法逐一评估难度 |
| 多域混合 | Web/Code/Math/Books 等多域并行 |
| 难度定义模糊 | 文本的"难度"没有统一标准 |
| 计算成本 | 在线评估难度的额外开销 |
| 长训练周期 | 数月训练，课程策略需鲁棒 |
| 数据不可重复 | 通常只训练 1-2 epochs |

---

## 2. 核心原理

### 2.1 课程学习的理论基础

**假设 1: 简单样本提供更好的初始梯度方向**
- 简单样本的梯度噪声小，方向更一致
- 先用简单样本建立"粗略表示"，再用难样本精调
- 类似于凸优化中的"warm start"

**假设 2: 渐进增加难度避免局部最优**
- 如果一开始就训练难样本，模型可能陷入差的局部最优
- 简单样本帮助模型建立全局结构

**假设 3: 课程模拟人类学习过程**
- 语言习得: 单词 → 句子 → 段落 → 文章
- 数学: 加减 → 乘除 → 方程 → 微积分

### 2.2 LLM 中的"难度"定义

```
┌─────────────────────────────────────────────────────────────────┐
│  维度 1: 语言复杂度 (词汇难度/句法复杂度/篇章结构)              │
│  维度 2: 知识密度 (专业术语/信息熵/推理步骤数)                  │
│  维度 3: 模型困惑度 (当前模型 PPL / KL divergence)              │
│  维度 4: 数据质量 (质量分类器分数/信息密度)                      │
│  维度 5: 领域专业度 (通用→专业 / 描述→推理)                     │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 课程学习的数学形式化

设训练数据 D = {(x_i, y_i)}，难度函数 d(x_i) ∈ [0, 1]

- **标准课程**: sort(D, key=d) — 按难度升序
- **反课程**: sort(D, key=-d) — 按难度降序 (有时有效)
- **自适应课程**: x_t = argmax utility(x, model_t) — 选"最近发展区"数据

其中 utility 可以是: 模型当前困惑度、梯度范数、学习进度 (刚好在能力边界的样本)

---

## 3. 数据排序策略

### 3.1 基于难度的排序

| 方法 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| Perplexity-based | 小模型计算 PPL, 低 PPL = 简单 | 自动化, 可大规模 | PPL ≠ 学习价值 |
| Classifier-based | 训练难度分类器 | 快速推理 | 需标注数据训练 |
| Heuristic-based | 长度/词频/句法复杂度 | 零成本 | 粗糙, 不总是有效 |
| Learning-based | 观察 loss 下降速度 | 最准确 | 需额外训练步骤 |

### 3.2 基于质量的排序

| 质量信号 | 计算方法 | 排序策略 |
|---------|---------|---------|
| 文本质量分类器 | fastText/BERT 分类器 | 高质量优先 |
| Perplexity (参考模型) | Wikipedia 训练的 LM | 低 PPL 优先 |
| LLM 评分 | GPT-4 打分 (1-10) | 高分优先 |
| 用户互动信号 | 点赞/阅读时长 | 高互动优先 |

### 3.3 基于领域的排序

```
Phase 1 (0-30%): 通用基础 — Wikipedia + 简单 Web + 基础代码
Phase 2 (30-70%): 能力扩展 — 复杂 Web + 书籍 + 学术 + 高质量代码
Phase 3 (70-100%): 专精提升 — 数学/逻辑 + 专业领域 + 长文本
```

---

## 4. 在线课程学习

### 4.1 在线 vs 离线课程

| 类型 | 描述 | 优点 | 缺点 |
|------|------|------|------|
| 离线课程 | 训练前确定顺序 | 无额外开销 | 不随模型调整 |
| 在线课程 | 训练中动态调整 | 自适应 | 计算开销大 |
| 混合课程 | 离线粗排+在线微调 | 平衡 | 实现复杂 |

### 4.2 在线课程学习架构

```
┌─────────────────────────────────────────────────────────────────┐
│  Data Pool ──▶ Scoring Module ──▶ Sampler (动态采样)            │
│                    ▲                       │                     │
│                    │                       ▼                     │
│              Model State ◀──────── Training Loop                │
│                                                                 │
│  在线评分策略:                                                   │
│  · 每 N steps 重新评估数据难度                                   │
│  · 选择 "zone of proximal development" (最近发展区)              │
│    - 不太简单 (已学会, 无新信息)                                 │
│    - 不太困难 (学不会, 梯度噪声大)                               │
│    - 刚好在能力边界 (学习价值最大)                               │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Competence-based Curriculum

```python
def compute_competence(model, validation_set):
    """模型能力值 c(t) ∈ [0, 1], 表示当前能处理的难度上限"""
    accuracy = evaluate(model, validation_set)
    return accuracy

def select_data_by_competence(data_pool, competence, window=0.2):
    """选择难度在 [c-window, c+window] 的"最近发展区"数据"""
    lower = max(0, competence - window)
    upper = min(1, competence + window)
    return [d for d in data_pool if lower <= d.difficulty <= upper]
```

---

## 5. 数据混合调度

### 5.1 调度策略分类

| 策略 | 描述 | 适用场景 |
|------|------|---------|
| 固定比例 | 全程不变 | 基线, 简单场景 |
| 线性调度 | 比例线性变化 | 已知最优终态比例 |
| 阶梯调度 | 分阶段切换比例 | 明确阶段划分 |
| 余弦调度 | 按余弦曲线变化 | 平滑过渡 |
| 自适应调度 | 基于模型表现动态调整 | 最优但复杂 |
| 温度调度 | 用温度参数控制域间分布 | DoReMi 风格 |

### 5.2 DoReMi: 自动化数据配比

```
Step 1: 用均匀分布训练小模型 (280M) → 得到 reference loss
Step 2: 用 Group DRO 训练 Proxy Model → 学习最优域权重 α
Step 3: 将 α 应用到大模型 (8B) 训练
效果: 在 The Pile 上提升 2-3% (vs 均匀分布)
```

### 5.3 数据调度配置示例

```yaml
data_schedule:
  type: "staged"
  stages:
    - name: "foundation"
      start_ratio: 0.0
      end_ratio: 0.3
      mixture: {web: 0.60, books: 0.15, code: 0.10, wikipedia: 0.10, math: 0.05}
    - name: "expansion"
      start_ratio: 0.3
      end_ratio: 0.7
      mixture: {web: 0.45, code: 0.20, academic: 0.10, books: 0.10, math: 0.10, multilingual: 0.05}
    - name: "specialization"
      start_ratio: 0.7
      end_ratio: 1.0
      mixture: {web: 0.30, code: 0.25, math: 0.20, academic: 0.15, multilingual: 0.10}
  transition: "cosine"
  min_domain_ratio: 0.05
```

---

## 6. 与数据配比的关系

```
┌─────────────────────────────────────────────────────────────────┐
│  数据配比 (Data Mixture): 回答 "各域数据占多少比例?" — 静态     │
│  课程学习 (Curriculum):   回答 "数据以什么顺序呈现?" — 动态     │
│                                                                 │
│  关系: 课程学习 ⊃ 数据配比 (课程是配比的时序扩展)               │
│  好的课程 = 好的配比 + 好的时序                                 │
│  最终比例相同，但课程不同 → 性能可能差 1-3%                     │
│                                                                 │
│  最佳实践:                                                      │
│  1. 先确定目标配比 (DoReMi/消融实验)                            │
│  2. 再设计课程路径 (如何从初始配比过渡到目标配比)                │
│  3. 最后微调时序 (过渡速度、阶段划分)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. 预训练阶段课程

### 7.1 典型预训练课程 (70B, 15T tokens)

```
┌─────────────────────────────────────────────────────────────────┐
│  Phase 1: 语言基础 (0-3T, 20%)                                  │
│  · 高质量 Web + Wikipedia + 简单书籍                            │
│  · 短文本为主, 通用词汇, 简单句法                               │
│  · LR warmup (0 → 3e-4)                                        │
│                                                                 │
│  Phase 2: 知识扩展 (3T-9T, 40%)                                 │
│  · 复杂 Web + 书籍 + 学术 + 代码                                │
│  · 长文本增加, 专业内容, 多语言                                 │
│  · LR 峰值 (3e-4)                                              │
│                                                                 │
│  Phase 3: 能力深化 (9T-13T, 27%)                                │
│  · 数学 + 代码 + 学术 + 专业领域                                │
│  · 高难度, 长推理链, 结构化数据                                 │
│  · LR 衰减 (3e-4 → 1e-4)                                      │
│                                                                 │
│  Phase 4: Annealing (13T-15T, 13%)                              │
│  · 最高质量子集 + 合成教科书 + 指令式数据                       │
│  · 质量 > 数量, 多样性保持                                      │
│  · LR 快速衰减 (1e-4 → 0)                                      │
│  · 效果: 提升 benchmark 2-5%                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 关键发现

| 发现 | 来源 | 影响 |
|------|------|------|
| 代码数据提前引入有益 | LLaMA, StarCoder | 提升推理能力 |
| 数学数据后期集中 | DeepSeek, Qwen | 避免干扰语言建模 |
| 高质量数据退火阶段用 | LLaMA-3, Phi | 显著提升 benchmark |
| 多语言数据均匀分布 | Qwen, BLOOM | 避免低资源语言退化 |
| 长文本数据渐进引入 | LongLLaMA, YaRN | 稳定长上下文能力 |
| 数据质量 > 数据顺序 | FineWeb, DCLM | 质量过滤比排序更重要 |

### 7.3 Annealing 阶段的课程设计

退火 (Annealing) 是预训练最后的 5-15% tokens，对最终性能影响巨大:

- 高质量 Web (top 10%): 30%
- 数学/推理: 25%
- 代码: 20%
- 合成教科书: 15%
- 学术/专业: 10%
- LR: 从 peak 的 1/3 线性衰减到 0
- 效果: 可提升 benchmark 2-5%

---

## 8. SFT 阶段课程

### 8.1 SFT 课程设计

```
┌─────────────────────────────────────────────────────────────────┐
│  Epoch 1 前半: 格式学习                                         │
│  · 简单指令跟随 (单轮, 短回复)                                  │
│  · 格式规范 (JSON, Markdown, 列表)                              │
│                                                                 │
│  Epoch 1 后半: 能力建立                                         │
│  · 复杂指令 (多约束, 多步骤)                                    │
│  · 长文本生成, 代码生成, 推理任务                               │
│                                                                 │
│  Epoch 2: 精调与对齐                                            │
│  · 高质量难样本, 多轮对话                                       │
│  · 安全/拒绝样本, 边界案例                                      │
│                                                                 │
│  原则: 简单→复杂, 单轮→多轮, 通用→专业, 安全数据贯穿始终       │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 SFT 数据难度信号

| 信号 | 简单 | 困难 |
|------|------|------|
| 约束数量 | 0-1 个 | 3+ 个 |
| 回复长度 | < 200 tokens | > 1000 tokens |
| 推理深度 | 直接回答 | 多步推理 |
| 对话轮数 | 1-2 轮 | 5+ 轮 |
| 格式要求 | 自由文本 | 严格结构化 |
| 知识要求 | 常识 | 专业知识 |

---

## 9. 实践架构

### 9.1 课程学习系统架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    课程学习系统架构                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Data Preparation Layer                                           │   │
│  │  Raw Data → Difficulty Scoring → Domain Tagging → Indexed Storage │   │
│  │  (PPL-based + Classifier + Heuristic ensemble)                    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│  ┌───────────────────────────▼──────────────────────────────────────┐   │
│  │  Curriculum Controller                                            │   │
│  │  Schedule Config + Competence Estimator + Domain Mixer            │   │
│  │                    → Batch Assembler                              │   │
│  └───────────────────────────┬──────────────────────────────────────┘   │
│                              │                                           │
│  ┌───────────────────────────▼──────────────────────────────────────┐   │
│  │  Training Loop                                                    │   │
│  │  for step in range(total_steps):                                  │   │
│  │      batch = curriculum_controller.get_batch(step)                │   │
│  │      loss = model.forward(batch)                                  │   │
│  │      loss.backward(); optimizer.step()                            │   │
│  │      curriculum_controller.update(model, step, loss)              │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.2 数据索引结构

```
Index: domain → difficulty_bucket → [doc_ids]

Metadata per document:
{
  "doc_id": "web_001234",
  "domain": "web",
  "difficulty": 0.65,
  "quality_score": 8.2,
  "language": "en",
  "length_tokens": 1024,
  "topic_cluster": 42
}
```

---

## 10. 对比表

### 10.1 课程学习策略对比

| 策略 | 复杂度 | 额外开销 | 效果 | 适用规模 | 代表 |
|------|--------|---------|------|---------|------|
| Random Shuffle | 无 | 无 | baseline | 所有 | 默认 |
| 难度排序 (离线) | 低 | 中 | +1-2% | 所有 | Bengio 2009 |
| 质量排序 | 低 | 中 | +1-3% | 所有 | FineWeb |
| 分阶段配比 | 中 | 无 | +1-2% | 大规模 | LLaMA, Qwen |
| DoReMi | 高 | 高 | +2-3% | 大规模 | DoReMi 2023 |
| 在线自适应 | 很高 | 很高 | +2-4% | 中等 | 研究阶段 |
| LLM-as-Curriculum | 高 | 高 | +2-3% | 中等 | 2025-2026 |
| Annealing | 低 | 无 | +2-5% | 所有 | LLaMA-3 |

### 10.2 各模型预训练课程对比

| 模型 | Tokens | 课程策略 | Annealing | 特色 |
|------|--------|---------|-----------|------|
| LLaMA-3 (70B) | 15T | 分阶段+退火 | 最后 5% | 高质量退火数据 |
| Qwen-2.5 (72B) | 18T | 分阶段+多语言 | 最后 10% | 多语言课程 |
| DeepSeek-V3 | 14.8T | 分阶段+代码提前 | 最后 5% | 代码/数学强化 |
| Phi-4 (14B) | ~10T | 合成数据为主 | 合成退火 | Textbook 课程 |
| Gemma-2 (27B) | ~8T | 分阶段 | 有 | 质量过滤优先 |

### 10.3 预训练 vs SFT 课程对比

| 维度 | 预训练课程 | SFT 课程 |
|------|-----------|---------|
| 数据规模 | 数万亿 tokens | 数十万-百万条 |
| 课程粒度 | 域级别 (web/code/math) | 样本级别 (每条指令) |
| 调度方式 | 分阶段配比 | 难度排序+类型混合 |
| 主要目标 | 知识获取+语言能力 | 指令跟随+格式规范 |
| 难度定义 | PPL / 领域 / 长度 | 指令复杂度 / 推理深度 |
| 典型 epochs | 1-2 | 2-3 |
| 影响程度 | 中 (1-3%) | 大 (3-5%) |

---

## 11. 代码与配置示例

### 11.1 课程学习 DataLoader

```python
"""课程学习采样器: 分阶段域配比 + 难度排序"""
import numpy as np
from torch.utils.data import Sampler
from typing import Dict, List

class CurriculumSampler(Sampler):
    def __init__(self, data_index: Dict[str, Dict[int, List[int]]],
                 schedule: List[dict], total_steps: int, batch_size: int,
                 difficulty_ordering: str = "easy_to_hard"):
        self.data_index = data_index  # domain -> difficulty_bucket -> [indices]
        self.schedule = schedule
        self.total_steps = total_steps
        self.batch_size = batch_size
        self.difficulty_ordering = difficulty_ordering
        self._prepare_schedule()
    
    def _prepare_schedule(self):
        self.stage_boundaries = []
        for stage in self.schedule:
            start = int(stage["start_ratio"] * self.total_steps)
            end = int(stage["end_ratio"] * self.total_steps)
            self.stage_boundaries.append((start, end, stage["mixture"]))
    
    def _get_current_mixture(self, step: int) -> Dict[str, float]:
        """获取当前步骤的域配比 (cosine 过渡)"""
        for i, (start, end, mixture) in enumerate(self.stage_boundaries):
            if start <= step < end:
                if i < len(self.stage_boundaries) - 1:
                    next_mix = self.stage_boundaries[i + 1][2]
                    transition = int(0.1 * (end - start))
                    if step > end - transition:
                        progress = (step - (end - transition)) / transition
                        alpha = (1 - np.cos(progress * np.pi)) / 2
                        return {d: (1-alpha)*mixture.get(d,0) + alpha*next_mix.get(d,0)
                                for d in set(list(mixture) + list(next_mix))}
                return mixture
        return self.stage_boundaries[-1][2]
    
    def _sample_from_domain(self, domain: str, n: int, step: int) -> List[int]:
        """从指定域采样, 根据进度引入更难样本"""
        buckets = self.data_index[domain]
        progress = step / self.total_steps
        max_diff = int(progress * len(buckets))
        available = []
        for bid in range(max_diff + 1):
            if bid in buckets:
                available.extend(buckets[bid])
        if not available:
            available = [idx for b in buckets.values() for idx in b]
        return np.random.choice(available, size=min(n, len(available)), replace=False).tolist()
    
    def __iter__(self):
        for step in range(self.total_steps):
            mixture = self._get_current_mixture(step)
            batch = []
            for domain, ratio in mixture.items():
                if ratio <= 0 or domain not in self.data_index:
                    continue
                n = max(1, int(self.batch_size * ratio))
                batch.extend(self._sample_from_domain(domain, n, step))
            np.random.shuffle(batch)
            yield from batch[:self.batch_size]
    
    def __len__(self):
        return self.total_steps * self.batch_size
```

### 11.2 在线难度评估器

```python
"""在线难度评估器: 基于模型当前 loss 动态评估数据难度"""
import torch
import numpy as np

class OnlineDifficultyEstimator:
    def __init__(self, model, tokenizer, eval_interval=1000, num_buckets=10):
        self.model = model
        self.tokenizer = tokenizer
        self.eval_interval = eval_interval
        self.num_buckets = num_buckets
        self.difficulty_cache = {}
    
    @torch.no_grad()
    def compute_perplexity(self, texts: list) -> list:
        self.model.eval()
        ppls = []
        for text in texts:
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=2048)
            inputs = {k: v.to(self.model.device) for k, v in inputs.items()}
            outputs = self.model(**inputs, labels=inputs["input_ids"])
            ppls.append(np.exp(outputs.loss.item()))
        return ppls
    
    def update_difficulty_scores(self, data_pool: list, step: int):
        if step % self.eval_interval != 0:
            return
        sample_idx = np.random.choice(len(data_pool), size=min(10000, len(data_pool)), replace=False)
        texts = [data_pool[i]["text"] for i in sample_idx]
        ppls = self.compute_perplexity(texts)
        # 用 percentile 归一化为 [0, 1]
        ppls_arr = np.array(ppls)
        percentiles = np.searchsorted(np.sort(ppls_arr), ppls_arr) / len(ppls_arr)
        for idx, ppl, diff in zip(sample_idx, ppls, percentiles):
            self.difficulty_cache[data_pool[idx]["doc_id"]] = float(diff)
```

### 11.3 完整课程配置

```yaml
# curriculum_config.yaml
curriculum:
  enabled: true
  type: "staged_with_difficulty"
  difficulty:
    method: "ensemble"
    num_buckets: 10
    ordering: "easy_to_hard"
    update_interval: 5000
  stages:
    - name: "language_foundation"
      start_ratio: 0.0
      end_ratio: 0.20
      mixture: {web_general: 0.55, wikipedia: 0.15, books: 0.15, code: 0.10, math: 0.05}
      difficulty_range: [0.0, 0.4]
      max_seq_length: 4096
    - name: "knowledge_expansion"
      start_ratio: 0.20
      end_ratio: 0.55
      mixture: {web: 0.40, code: 0.20, academic: 0.15, books: 0.10, math: 0.10, multilingual: 0.05}
      difficulty_range: [0.2, 0.7]
      max_seq_length: 8192
    - name: "capability_deepening"
      start_ratio: 0.55
      end_ratio: 0.85
      mixture: {code: 0.25, math: 0.20, academic: 0.20, web_hq: 0.20, multilingual: 0.10, books: 0.05}
      difficulty_range: [0.5, 1.0]
      max_seq_length: 16384
    - name: "annealing"
      start_ratio: 0.85
      end_ratio: 1.0
      mixture: {math_verified: 0.25, web_top: 0.25, code_verified: 0.20, synthetic: 0.20, academic: 0.10}
      difficulty_range: [0.6, 1.0]
      max_seq_length: 32768
      lr_schedule: "cosine_to_zero"
  transition: {type: "cosine", duration_ratio: 0.05}
  online_adjustment:
    enabled: true
    metric: "validation_loss_by_domain"
    adjust_interval: 2000
    max_adjustment: 0.1
    strategy: "boost_lagging_domains"
```

---

## 12. 2026 前沿

### 12.1 自适应课程 (Adaptive Curriculum)

2026 年的前沿是**完全自适应的课程学习**——不需要人工设计阶段，由算法自动决定:

```
┌─────────────────────────────────────────────────────────────────┐
│  方法 1: RL-based Curriculum                                    │
│  · State: 模型状态 (loss, gradient stats)                       │
│  · Action: 选择下一个 batch 的数据组合                          │
│  · Reward: 验证集 loss 下降                                    │
│  · 用 PPO/SAC 训练 curriculum policy                           │
│                                                                 │
│  方法 2: Gradient-based Selection (LESS)                        │
│  · 计算每个样本的梯度与验证集梯度的对齐度                       │
│  · 选择梯度方向最有利于验证集的样本                             │
│                                                                 │
│  方法 3: Bandit-based Scheduling                                │
│  · 每个域视为一个 arm, UCB/Thompson Sampling 决定比例           │
│  · 自动平衡 exploration vs exploitation                         │
│                                                                 │
│  方法 4: Influence Function                                     │
│  · 估计每个样本对最终性能的影响, 选 influence 最大的            │
│  · 计算昂贵, 但最准确                                           │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 LLM-as-Curriculum

用 LLM 本身来设计课程:
- **自动难度评估**: 用 LLM 评估文本难度 (比 PPL 更语义化)
- **课程规划**: 让 LLM 根据学习目标规划数据顺序
- **动态调整**: LLM 分析训练日志，建议配比调整
- **数据增强**: LLM 生成"过渡数据"填补难度间隙

### 12.3 多粒度课程

```
Level 1: 域级别 — Web/Code/Math/Books 配比调度 (最粗, 所有模型都用)
Level 2: 子域级别 — Code 内 Python/Java/Rust 配比
Level 3: 难度级别 — 每个子域内 Easy→Medium→Hard
Level 4: 样本级别 — 在线选择最有价值的样本
Level 5: Token 级别 — 不同 token 的 loss 权重 (Selective LM, 2026 新方向)
```

### 12.4 课程学习与 Scaling Law

- **小模型 (< 1B)**: 效果显著 (+3-5%)
- **中等模型 (1-70B)**: 效果中等 (+1-3%)
- **大模型 (> 70B)**: 效果较小 (+0.5-1%)，但 annealing 仍有效
- 数据有限时优势更明显: 等价于"免费"增加 10-20% 训练数据
- 对低资源语言/领域尤为关键

### 12.5 与 MoE 架构的交互

- **Expert 专业化课程**: 不同阶段激活不同 expert
- **Routing 课程**: 早期均匀路由，后期专业化路由
- **Expert 数据分配**: 每个 expert 看不同难度/领域的数据

---

## 13. 相关概念

- [[Data_Curation_and_Mixture_2026]] - 数据配比与清洗
- [[概念/Training/synthetic-data]] - 合成数据训练
- [[07_模型训练/01_训练基础/05_Multi_Stage_训练_流水线]] - 多阶段训练流水线
- [[Scaling_Laws_and_Training_Dynamics]] - Scaling Laws 与训练动态
- [[07_模型训练/06_对齐训练/04_RLHF_at_Scale_2026]] - 大规模 RLHF
- [[GRPO_and_New_Alignment_Methods]] - GRPO 与对齐方法
- [[概念/General/finops]] - 训练成本优化
- [[07_模型训练/03_训练优化/01_Hyperparameter_Tuning]] - 超参数调优
- [[07_模型训练/02_数据工程/07_pretraining_synthetic_data]] - 预训练合成数据
- [[概念/Vision/data-augmentation-cv]] - 数据增强

---

## 附录: 课程学习实验设计模板

```markdown
## 课程学习消融实验设计

### 实验目标
验证 [具体课程策略] 对 [模型规模] 训练效果的影响

### 对照组
- Baseline: Random shuffle, 固定配比
- Treatment: [课程策略描述]

### 评估指标
- 训练效率: 达到目标 loss 所需 steps
- 最终性能: MMLU / GSM8K / HumanEval / MT-Bench
- 训练稳定性: Loss spike 次数, 梯度范数方差
- 各域表现: 分域 validation loss

### 控制变量
- 总 tokens 数相同
- 最终数据配比相同 (只改顺序/调度)
- 超参相同 (LR, batch size, etc.)
- 随机种子: 跑 3 个种子取平均

### 预期结果
- 收敛速度: 提升 __%
- 最终性能: 提升 __%
- 稳定性: loss spike 减少 __%
```
