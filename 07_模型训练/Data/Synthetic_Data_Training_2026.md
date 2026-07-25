---
title: "合成数据训练: 自蒸馏与 Model Collapse (Synthetic Data Training 2026)"
category: "07-model-training"
tags: ["synthetic-data", "self-distillation", "model-collapse", "data-quality", "phi", "deepseek", "pretraining", "sft", "rlhf"]
summary: "> **一句话理解**: 合成数据训练就像用老师的笔记教学生——如果笔记质量够高、覆盖面够广，学生甚至能超越老师；但如果学生只读自己的笔记再教下一代，知识就会像复印件的复印件一样逐渐模糊失真（Model Collapse）。"
created: 2026-07-19
updated: 2026-07-19
tier: supporting
aliases:
  - "Synthetic Data Training 2026"
  - "合成数据训练"
  - Synthetic_Data_Training_2026
sources: []

---
# 合成数据训练: 自蒸馏与 Model Collapse (Synthetic Data Training 2026)

> **一句话理解**: 合成数据训练就像用老师的笔记教学生——如果笔记质量够高、覆盖面够广，学生甚至能超越老师；但如果学生只读自己的笔记再教下一代，知识就会像复印件的复印件一样逐渐模糊失真（Model Collapse）。

---

## 目录

1. [概述](#1-概述)
2. [核心原理](#2-核心原理)
3. [自蒸馏 (Self-Distillation)](#3-自蒸馏-self-distillation)
4. [合成数据质量评估](#4-合成数据质量评估)
5. [数据多样性保证](#5-数据多样性保证)
6. [Model Collapse 问题与缓解](#6-model-collapse-问题与缓解)
7. [合成数据在各阶段的角色](#7-合成数据在各阶段的角色)
8. [实践架构](#8-实践架构)
9. [对比表](#9-对比表)
10. [代码与配置示例](#10-代码与配置示例)
11. [2026 前沿实践](#11-2026-前沿实践)
12. [相关概念](#12-相关概念)

---

## 1. 概述

### 1.1 为什么需要合成数据

2026 年，高质量自然数据（human-generated data）面临枯竭:

- **Web 数据天花板**: 高质量网页文本约 10-15T tokens，已被充分挖掘
- **标注成本**: 人工编写 SFT 数据每条 $5-50，百万级数据成本巨大
- **领域覆盖**: 专业领域（医学、法律、数学）自然数据稀缺
- **质量控制**: 自然数据噪声大，清洗成本高

合成数据 (Synthetic Data) 成为突破数据瓶颈的核心策略:

```
数据供给演进:
2020: 100% 自然数据  ████████████████████████████████████████
2023: 90% 自然 + 10% 合成  ████████████████████████████████████░░░░
2025: 70% 自然 + 30% 合成  ████████████████████████████░░░░░░░░░░░░
2026: 50-60% 自然 + 40-50% 合成  ████████████████████████░░░░░░░░░░░░░░░░
```

### 1.2 合成数据的核心价值

| 价值维度 | 说明 |
|---------|------|
| 规模扩展 | 从有限种子生成百万级训练样本 |
| 质量可控 | 通过过滤/验证确保数据质量 |
| 领域定制 | 针对特定能力定向生成 |
| 成本效率 | 比人工标注便宜 10-100x |
| 隐私保护 | 避免使用真实用户数据 |
| 多样性增强 | 覆盖自然数据中的长尾分布 |

---

## 2. 核心原理

### 2.1 合成数据生成范式

```
┌─────────────────────────────────────────────────────────────────┐
│              合成数据生成范式分类                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Self-Instruct: Seed Tasks → LLM 生成指令+回复 → 过滤        │
│  2. Evol-Instruct: 简单指令 → 逐步增加复杂度 → 高质量数据        │
│  3. Self-Distillation: 强模型输出 → 弱模型训练目标 → 知识迁移    │
│  4. Rejection Sampling: 生成 N 个回复 → 验证器筛选 → 训练数据    │
│  5. Back-Translation: 源文本 → 翻译 → 回译验证 → 多语言数据     │
│  6. Augmentation: 原始数据 → 改写/扩展/变换 → 增加多样性        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 合成数据的理论基础

合成数据训练本质上是隐式知识蒸馏:

```
Teacher Model (强模型) → 生成 (prompt, response) pairs → Student Model 训练
```

损失函数等价于最小化:
```
L_student = -Σ_i log P_student(y_i | x_i)
KL(P_teacher || P_student) ≈ H(P_teacher) - E_teacher[log P_student]
```

信息论视角: 合成数据质量取决于 Teacher 输出的信息熵——高熵覆盖广但含噪声，低熵质量高但多样性不足，最优解是在质量约束下最大化多样性。

### 2.3 合成数据 vs 自然数据

| 特征 | 自然数据 | 合成数据 |
|------|---------|---------|
| 分布 | 长尾, 幂律分布 | 相对均匀 (受生成策略影响) |
| 噪声 | 高 (拼写错误, 逻辑不通) | 低 (模型输出流畅) |
| 多样性 | 极高 (人类创造力) | 有限 (受模型能力约束) |
| 事实性 | 混合 (有对有错) | 偏向模型"知识" (可能有幻觉) |
| 风格 | 多样 (个人风格) | 趋同 (模型风格) |
| 覆盖 | 不均匀 (热门话题多) | 可定向补充 |

---

## 3. 自蒸馏 (Self-Distillation)

### 3.1 自蒸馏分类

```
┌─────────────────────────────────────────────────────────────────┐
│  Type 1: Cross-Model Distillation (跨模型蒸馏)                  │
│  Teacher (405B) ──生成数据──▶ Student (7B) 训练                  │
│                                                                 │
│  Type 2: Self-Play Distillation (自博弈蒸馏)                    │
│  Model v_N ──生成数据──▶ Model v_N+1 训练                       │
│                                                                 │
│  Type 3: Ensemble Self-Distillation (集成自蒸馏)                │
│  Model A + B + C ──共识/Best-of-N──▶ 训练数据                   │
│                                                                 │
│  Type 4: Iterative Self-Distillation (迭代自蒸馏)               │
│  v1 → 生成 → 筛选 → 训练 → v2 → ... (⚠️ Model Collapse 风险)   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Phi 系列 "Textbook Quality" 自蒸馏

Microsoft Phi 系列是自蒸馏的标杆实践，核心思想: 用 GPT-4 生成"教科书质量"合成数据训练小模型。

| 模型 | 参数 | 数据策略 | 特色 |
|------|------|---------|------|
| Phi-1 | 1.3B | 6B tokens GPT-3.5 合成 | 聚焦代码+推理 |
| Phi-2 | 2.7B | 250B tokens 合成+Web | 知识迁移 |
| Phi-3 | 3.8B-14B | 3.3T tokens 多阶段合成 | Safety 合成数据 |
| Phi-4 | 14B | 60-70% 合成数据 | 结构化推理为主 |

### 3.3 DeepSeek 数据策略

- **数学**: 强模型生成题目+解题过程, 通过答案验证筛选
- **代码**: 生成代码+测试用例, 通过执行验证正确性
- **推理链**: 生成 Chain-of-Thought, 最终答案正确性反向验证
- **多轮对话**: AI 模拟用户-助手多轮交互
- **核心原则**: 可验证性 (verifiability) 是合成数据质量的金标准

---

## 4. 合成数据质量评估

### 4.1 质量评估维度

```
┌─────────────────────────────────────────────────────────────────┐
│  Dimension 1: Correctness (正确性)                              │
│  · 事实准确 · 逻辑正确 · 代码可执行                             │
│                                                                 │
│  Dimension 2: Coherence (连贯性)                                │
│  · 内部一致 · 结构完整 · 语义流畅                               │
│                                                                 │
│  Dimension 3: Diversity (多样性)                                │
│  · 话题多样 · 风格多样 · 难度梯度                               │
│                                                                 │
│  Dimension 4: Informativeness (信息量)                          │
│  · 非平凡 · 有深度 · 有教育意义                                 │
│                                                                 │
│  Dimension 5: Safety (安全性)                                   │
│  · 无有害内容 · 无偏见 · 无隐私泄露                             │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 自动化质量评估方法

| 方法 | 原理 | 适用场景 | 成本 |
|------|------|---------|------|
| Perplexity Filter | 独立 LM 计算困惑度, 过滤异常 | 通用 | 低 |
| LLM-as-Judge | 强模型评分 (1-10) | 通用 | 中 |
| Verifier-based | 答案/代码验证 | 数学/代码 | 低 |
| N-gram Overlap | 检测与已有数据的重复度 | 去重 | 低 |
| Embedding Distance | 语义空间距离检测异常 | 异常检测 | 中 |
| Human Spot Check | 人工抽样审核 | 最终验证 | 高 |
| Training Signal | 小模型训练后 benchmark 变化 | 端到端验证 | 高 |

### 4.3 质量过滤 Pipeline

```python
class SyntheticDataFilter:
    def filter(self, data_batch):
        # Stage 1: 基础过滤
        data = self.remove_empty_and_short(data_batch)
        data = self.remove_repetitive(data)       # n-gram 重复检测
        data = self.remove_unsafe(data)           # 安全过滤
        # Stage 2: 质量评分
        scores = self.llm_judge(data)             # LLM 打分 (1-10)
        data = [d for d, s in zip(data, scores) if s >= 7]
        # Stage 3: 可验证性检查
        if self.task_type == "math":
            data = self.verify_math_answers(data)
        elif self.task_type == "code":
            data = self.run_unit_tests(data)
        # Stage 4: 多样性保证
        data = self.ensure_diversity(data)        # embedding 去重
        data = self.balance_difficulty(data)      # 难度均衡
        return data
```

---

## 5. 数据多样性保证

### 5.1 多样性退化的原因

- **模式坍缩**: LLM 倾向于生成高概率 (常见) 的模式
- **风格趋同**: 同一模型生成的文本风格相似
- **知识边界**: 模型只能生成其"已知"的内容
- **温度限制**: 低温度 → 确定性高 → 多样性低

### 5.2 多样性增强策略

```
┌─────────────────────────────────────────────────────────────────┐
│  策略 1: Prompt 多样性                                          │
│  · 多来源 seed prompts (Web/学术/用户日志)                       │
│  · Prompt 改写/扩展 (增加约束/变换角度)                          │
│  · 分层采样 (按领域/难度/类型分层)                               │
│                                                                 │
│  策略 2: 生成多样性                                             │
│  · 多温度采样 (T = 0.3, 0.7, 1.0, 1.3)                         │
│  · 多模型生成 (GPT-4 + Claude + Llama 混合)                     │
│  · 多 system prompt (不同角色/风格)                              │
│                                                                 │
│  策略 3: 后处理多样性                                           │
│  · Embedding 去重 (cosine > 0.9 去除)                           │
│  · 话题聚类 + 均衡采样                                          │
│  · 难度分桶 + 均匀采样                                          │
│                                                                 │
│  策略 4: 课程式多样性                                           │
│  · 由简到难渐进生成 · 跨领域交叉组合 · 对抗性生成               │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 多样性度量指标

| 指标 | 计算方法 | 目标值 |
|------|---------|--------|
| Topic Coverage | LDA/BERTopic 聚类覆盖 | > 90% 目标主题 |
| Lexical Diversity | Type-Token Ratio (TTR) | > 0.7 |
| Embedding Diversity | 样本间平均 cosine distance | > 0.3 |
| N-gram Novelty | 新 n-gram 占比 | > 60% |
| Difficulty Spread | 难度分布标准差 | σ > 1.5 |

---

## 6. Model Collapse 问题与缓解

### 6.1 Model Collapse 机制

```
Generation 0 (真实数据): ████████████████████████████ (宽, 多样)  ★★★★★
Generation 1 (G0合成):   ██████████████████████ (略窄)           ★★★★☆
Generation 3 (G2合成):   ████████████████ (明显窄)               ★★★☆☆
Generation 5+:           ████████ (严重坍缩)                     ★★☆☆☆
Generation 10+:          ███ (几乎完全坍缩, 重复/无意义)          ★☆☆☆☆

数学直觉:
· 每次自蒸馏引入误差 ε → P_model^(n) = P_real × (1-ε)^n → 指数衰减
· 尾部 token (低频重要知识) 首先丢失
· 最终: 分布坍缩到少数高概率模式
```

### 6.2 缓解策略

| 策略 | 方法 | 效果 |
|------|------|------|
| 数据混合 | 每代混入 30-50% 真实数据 | 最有效, 作为"锚点" |
| 多源生成 | 多个不同模型生成 | 避免单一偏见累积 |
| 质量过滤 | 独立验证器过滤低质量 | 保证正确性 |
| 正则化 | Replay + KL 正则 + 早停 | 防止分布偏移 |
| 可验证性约束 | 只使用可验证正确的数据 | 根本消除 collapse |
| 课程式引入 | 先真实后合成, 渐进增加 | 平滑过渡 |

### 6.3 监控指标

| 指标 | 正常范围 | 告警阈值 | 检测方法 |
|------|---------|---------|---------|
| 输出方差 | 稳定或缓降 | 下降 > 30% | 多次采样计算 |
| TTR | > 0.6 | < 0.4 | 滑动窗口统计 |
| 重复率 | < 5% | > 15% | N-gram 检测 |
| Held-out PPL | 稳定 | 上升 > 20% | 定期评估 |
| Benchmark | 稳定/上升 | 下降 > 5% | 定期跑评测 |
| 文本相似度 | < 0.5 | > 0.8 | Embedding cosine |

---

## 7. 合成数据在各阶段的角色

### 7.1 各阶段使用比例

```
预训练 (Pretraining):  [████████████░░░░░░░░] 30-40% 合成
  · 高质量文本补充 + 代码增强 + 数学推理 + 多语言翻译

退火 (Annealing):      [████████████████░░░░] 40-60% 合成
  · 聚焦高质量教科书式数据

SFT:                   [██████████████████░░] 60-90% 合成
  · 主力使用场景, 但需人工审核

RLHF/DPO:             [████████████████████] 70-100% 合成
  · RLAIF, 自动红队, prompt 扩展
```

### 7.2 SFT 阶段合成方法

| 方法 | 描述 | 代表工作 |
|------|------|---------|
| Self-Instruct | 种子任务生成新指令+回复 | Alpaca, WizardLM |
| Evol-Instruct | 逐步增加指令复杂度 | WizardLM, WizardCoder |
| Magpie | 利用自回归特性直接生成 | Magpie (2024) |
| Persona-driven | 不同角色生成多样数据 | Persona Hub |
| Rejection Sampling | 多回复取最佳 | Llama-2, DeepSeek |
| Multi-turn Synthesis | 模拟多轮对话 | UltraChat |

---

## 8. 实践架构

### 8.1 合成数据生产 Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    合成数据工业化生产 Pipeline                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────┐   ┌────────────┐   ┌──────────────┐   ┌────────────┐  │
│  │ Seed Data │──▶│ Generation │──▶│ Quality      │──▶│ Diversity  │  │
│  │ Collection│   │ Engine     │   │ Filtering    │   │ Enhancement│  │
│  │           │   │ (多模型)   │   │ (多层过滤)   │   │ (去重+均衡)│  │
│  └───────────┘   └────────────┘   └──────────────┘   └─────┬──────┘  │
│                                                              │         │
│  ┌───────────────────────────────────────────────────────────▼──────┐  │
│  │  Human Verification (5-10% 抽检) → Final Assembly (混合+版本化)  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  质量验证闭环:                                                          │
│  Generate → Auto Filter → Small Model Trial → Benchmark → Scale Up     │
│                    ↓ 不通过          ↓ 退化                             │
│              丢弃/重新生成      调整数据配比                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9. 对比表

### 9.1 主要合成数据方法对比

| 方法 | 成本 | 质量 | 多样性 | 可验证性 | 适用阶段 |
|------|------|------|--------|---------|---------|
| Self-Instruct | 低 | 中 | 中 | 低 | SFT |
| Evol-Instruct | 中 | 中高 | 高 | 低 | SFT |
| Rejection Sampling | 中 | 高 | 中 | 高 | SFT/RL |
| Textbook Generation | 高 | 很高 | 中 | 中 | Pretrain |
| Math/Code Gen | 中 | 很高 | 中 | 很高 | 全阶段 |
| RLAIF | 中 | 高 | 高 | 中 | RLHF |
| Persona-driven | 低 | 中 | 很高 | 低 | SFT |

### 9.2 Phi vs DeepSeek vs Llama 数据策略

| 维度 | Phi-4 | DeepSeek-V3/R1 | Llama-4 |
|------|-------|----------------|---------|
| 合成比例 | 60-70% | 30-50% | 20-40% |
| 核心策略 | Textbook quality | 可验证生成 | 大规模过滤 |
| 数学数据 | GPT-4 生成+验证 | 自生成+答案验证 | 合成+开源 |
| 质量控制 | 多轮 LLM 过滤 | 可验证性优先 | 分类器过滤 |
| Collapse 防御 | 混入真实数据 | 可验证性约束 | 配比控制 |
| 开源程度 | 论文公开 | 完全开源 | 部分公开 |

### 9.3 合成数据工具链

| 工具 | 用途 | 特色 |
|------|------|------|
| distilabel | 大规模合成数据 | 分布式, 多模型 |
| DataDreamer | 合成数据框架 | 多策略支持 |
| Argilla | 标注+合成 | HuggingFace 集成 |
| Cosmopedia | 教科书式生成 | HF 出品 |
| Persona Hub | 角色驱动生成 | 高多样性 |

---

## 10. 代码与配置示例

### 10.1 Evol-Instruct 数据生成

```python
"""Evol-Instruct: 逐步进化指令复杂度"""
import random
from openai import OpenAI

client = OpenAI()

EVOLUTION_PROMPTS = {
    "add_constraint": "请在以下指令基础上增加一个约束条件:\n{instruction}",
    "increase_depth": "请将以下指令深化，要求更深入的推理:\n{instruction}",
    "add_steps": "请将以下指令扩展为多步骤复杂任务:\n{instruction}",
    "change_domain": "请将以下指令迁移到不同专业领域:\n{instruction}",
}

def evolve_instruction(instruction: str, num_evolutions: int = 3) -> list:
    """对指令进行多轮进化"""
    evolved = [instruction]
    current = instruction
    for i in range(num_evolutions):
        strategy = random.choice(list(EVOLUTION_PROMPTS.keys()))
        prompt = EVOLUTION_PROMPTS[strategy].format(instruction=current)
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8, max_tokens=512,
        )
        current = response.choices[0].message.content.strip()
        evolved.append(current)
    return evolved

def create_evol_dataset(seed_instructions: list, num_evolutions: int = 3):
    """创建 Evol-Instruct 数据集"""
    dataset = []
    for seed in seed_instructions:
        evolved_instructions = evolve_instruction(seed, num_evolutions)
        for instr in evolved_instructions:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "你是知识渊博的专家助手。"},
                    {"role": "user", "content": instr}
                ],
                temperature=0.7, max_tokens=2048,
            )
            dataset.append({
                "instruction": instr,
                "output": response.choices[0].message.content,
                "evolution_depth": evolved_instructions.index(instr),
            })
    return dataset
```

### 10.2 Rejection Sampling (可验证任务)

```python
"""Rejection Sampling: 生成多个回复, 验证器筛选最佳"""
import asyncio
from openai import AsyncOpenAI

async def rejection_sampling_math(problem: str, correct_answer: str, n_samples: int = 16):
    """数学题 Rejection Sampling"""
    client = AsyncOpenAI()
    tasks = [
        client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "请详细解题，展示完整推理过程。"},
                {"role": "user", "content": f"请解决:\n{problem}"}
            ],
            temperature=0.7 + (i % 4) * 0.1,
            max_tokens=4096,
        )
        for i in range(n_samples)
    ]
    responses = await asyncio.gather(*tasks)
    
    correct_solutions = []
    for resp in responses:
        solution = resp.choices[0].message.content
        if verify_answer(extract_final_answer(solution), correct_answer):
            correct_solutions.append(solution)
    
    if not correct_solutions:
        return None
    return {
        "problem": problem,
        "solution": max(correct_solutions, key=len),  # 最详细的正确解法
        "success_rate": len(correct_solutions) / n_samples,
    }
```

### 10.3 Model Collapse 监控

```python
"""Model Collapse 监控"""
import numpy as np
from collections import Counter

class ModelCollapseMonitor:
    def __init__(self, tokenizer):
        self.tokenizer = tokenizer
        self.history = []
    
    def compute_metrics(self, generated_texts: list) -> dict:
        all_tokens = []
        for text in generated_texts:
            all_tokens.extend(self.tokenizer.encode(text))
        unique_ratio = len(set(all_tokens)) / len(all_tokens)
        bigrams = [tuple(all_tokens[i:i+2]) for i in range(len(all_tokens)-1)]
        repeat_rate = 1 - len(set(bigrams)) / max(len(bigrams), 1)
        lengths = [len(self.tokenizer.encode(t)) for t in generated_texts]
        return {
            "type_token_ratio": unique_ratio,
            "bigram_repeat_rate": repeat_rate,
            "length_variance": np.var(lengths),
        }
    
    def check_collapse(self, metrics: dict, generation: int) -> list:
        warnings = []
        if metrics["type_token_ratio"] < 0.4:
            warnings.append(f"[Gen {generation}] TTR 过低: {metrics['type_token_ratio']:.3f}")
        if metrics["bigram_repeat_rate"] > 0.15:
            warnings.append(f"[Gen {generation}] 重复率过高: {metrics['bigram_repeat_rate']:.3f}")
        if self.history and metrics["type_token_ratio"] < self.history[-1]["type_token_ratio"] * 0.7:
            warnings.append(f"[Gen {generation}] TTR 急剧下降")
        self.history.append(metrics)
        return warnings
```

### 10.4 数据配比配置

```yaml
# synthetic_data_config.yaml
data_mixture:
  pretraining:
    composition:
      web_crawl: 0.40
      code: 0.15
      synthetic_textbook: 0.15
      books: 0.10
      synthetic_math: 0.10
      synthetic_code: 0.05
      wikipedia: 0.05
  sft:
    composition:
      human_written: 0.15
      evol_instruct: 0.30
      rejection_sampling: 0.25
      persona_driven: 0.15
      multi_turn_synth: 0.15

collapse_prevention:
  max_synthetic_ratio: 0.70
  min_real_data_ratio: 0.30
  diversity_check_interval: 1000
  ttr_threshold: 0.45
  multi_source_generation: true
  generation_models: ["gpt-4o", "claude-sonnet-4-20250514", "deepseek-chat"]
```

---

## 11. 2026 前沿实践

### 11.1 可验证合成数据

2026 核心趋势: **只使用可验证正确的合成数据**

```
┌─────────────────────────────────────────────────────────────────┐
│  数学: 生成题目 → 生成解答 → 验证答案 → 只保留正确的            │
│  代码: 生成代码 → 生成测试 → 执行测试 → 只保留通过的            │
│  事实: 生成 QA → 知识库交叉验证 → 只保留事实正确的              │
│  逻辑: 生成推理链 → 形式逻辑验证 → 只保留逻辑正确的            │
│                                                                 │
│  优势: 完全消除 Model Collapse 风险                              │
│  限制: 只适用于有明确正确答案的任务                              │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Self-Play 数据生成

```
┌─────────────────────────────────────────────────────────────────┐
│  模式 1: 出题-解题 Self-Play                                    │
│  ┌──────────┐         ┌──────────┐                             │
│  │ Model A  │──出题──▶│ Model B  │                             │
│  │ (出题者) │◀──验证──│ (解题者) │                             │
│  └──────────┘         └──────────┘                             │
│  · A 生成越来越难的题目, B 尝试解答, A 验证                    │
│  · 双方共同进化, 数据难度自然递增                               │
│                                                                 │
│  模式 2: 辩论式 Self-Play                                       │
│  · 对同一问题从正反两面论证 → 高质量辩证数据                    │
│  · 培养模型的多角度思考能力                                     │
│                                                                 │
│  模式 3: 师生 Self-Play                                         │
│  · Student 提出困惑点 → Teacher 针对性解释 → 教学数据           │
│  · 自动发现知识盲区, 定向补充                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 11.3 数据飞轮 (Data Flywheel)

```
用户交互 → 收集反馈 → 筛选高质量 → 训练 → 更好模型 → 更多用户 → ...
```

关键设计:
- **隐式反馈**: 用户是否复制/继续对话/点赞
- **显式反馈**: A/B 对比选择
- **自动筛选**: 只保留高质量交互进入训练集
- **隐私保护**: 差分隐私 + 数据脱敏

### 11.4 合成数据 Scaling Law

初步研究发现合成数据也存在 scaling law:

- 合成数据质量随 Teacher 规模 log-linear 增长
- Student 性能随合成数据量 power law 提升，存在饱和点
- 最优合成数据量 ≈ 3-5x Chinchilla optimal tokens
- 超过饱和点后收益递减，甚至可能有害
- Teacher-Student 规模差越大，蒸馏效率越高 (但存在容量瓶颈)

### 11.5 多模态合成数据

2026 年合成数据已扩展到多模态:

| 模态 | 方法 | 应用 |
|------|------|------|
| 图文对 | VLM 生成描述 | 训练图文理解 |
| 视频 QA | 合成视频问答 | 视频理解 |
| GUI 交互 | 合成 UI 截图+操作指令 | Agent 训练 |
| 3D 场景 | 程序化生成+描述 | 空间理解 |
| 音频-文本 | TTS 生成语音+文本 | 语音理解 |

### 11.6 合成数据治理与溯源

2026 年合成数据治理成为重要议题:

- **数据血缘追踪**: 记录每条合成数据的生成模型、prompt、温度等元信息
- **版本管理**: 合成数据集版本化，支持回滚和对比实验
- **许可证合规**: 确保 Teacher 模型的输出不侵犯版权
- **标注透明度**: 在发布数据时明确标注"AI 生成"
- **质量审计**: 定期回顾合成数据质量，检测系统性偏见
- **水印技术**: 在合成数据中嵌入统计水印，便于溯源和检测
- **合规框架**: 遵循 EU AI Act 等法规对合成数据的披露要求

---

## 12. 相关概念

- [[Data_Curation_and_Mixture_2026]] - 数据配比与清洗
- [[pretraining-synthetic-data]] - 预训练合成数据基础
- [[RLHF_at_Scale_2026]] - 大规模 RLHF (RLAIF)
- [[Curriculum_Learning_for_LLMs]] - 课程学习与数据排序
- [[Multi_Stage_Training_Pipeline]] - 多阶段训练流水线
- [[GRPO_and_New_Alignment_Methods]] - GRPO 与对齐方法
- [[Scaling_Laws_and_Training_Dynamics]] - Scaling Laws
- [[Data_Augmentation]] - 数据增强技术
- [[Tokenizer_Design_2026]] - Tokenizer 设计
- [[Training_Cost_Optimization_and_FinOps_2026]] - 训练成本优化

---

## 附录: 合成数据发布前检查清单

```markdown
### 基础质量
- [ ] 无空回复或截断
- [ ] 无重复 (exact + fuzzy dedup)
- [ ] 无有害/不安全内容
- [ ] 无 PII (个人身份信息)

### 内容质量
- [ ] LLM-Judge 平均分 > 7/10
- [ ] 事实性抽查正确率 > 95%
- [ ] 代码可执行率 > 90% (如适用)
- [ ] 数学答案正确率 > 98% (如适用)

### 多样性
- [ ] TTR > 0.6
- [ ] 话题覆盖 > 90% 目标领域
- [ ] 文本间相似度 < 0.5
- [ ] 无单一模式占比 > 20%

### Collapse 防御
- [ ] 合成比例 ≤ 70%
- [ ] 混入 ≥ 30% 真实数据
- [ ] 使用 ≥ 2 个生成模型
- [ ] 小模型 trial training 无退化
```
