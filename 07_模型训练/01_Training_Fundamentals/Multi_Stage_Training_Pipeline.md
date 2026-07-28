---
title: "多阶段训练流水线: Pretrain→Annealing→SFT→RLHF→DPO (Multi-Stage Training Pipeline)"
category: "07-model-training"
tags: ["multi-stage-training", "pretraining", "annealing", "sft", "rlhf", "dpo", "pipeline", "deepseek", "llama", "qwen"]
summary: "> **一句话理解**: 多阶段训练流水线就像培养一个博士生——本科打基础（Pretrain），研究生做方向（Annealing），博士做课题（SFT），博后做精修（RLHF/DPO）。每个阶段目标不同、数据不同、方法不同，但知识必须一脉相承，不能'读了博士忘了本科'。"
created: 2026-07-19
updated: 2026-07-19
tier: supporting
aliases:
  - "Multi-Stage Training Pipeline"
  - "多阶段训练流水线"
  - Multi_Stage_Training_Pipeline
sources: []

name_zh: "多阶段训练流水线"
---
# 多阶段训练流水线: Pretrain→Annealing→SFT→RLHF→DPO (Multi-Stage Training Pipeline)

> 中文简称：多阶段训练流水线

> **一句话理解**: 多阶段训练流水线就像培养一个博士生——本科打基础（Pretrain），研究生做方向（Annealing），博士做课题（SFT），博后做精修（RLHF/DPO）。每个阶段目标不同、数据不同、方法不同，但知识必须一脉相承，不能"读了博士忘了本科"。

---

## 目录

1. [概述](#1-概述)
2. [核心原理](#2-核心原理)
3. [完整 Pipeline 详解](#3-完整-pipeline-详解)
4. [各阶段数据/超参/目标差异](#4-各阶段数据超参目标差异)
5. [阶段间知识保持](#5-阶段间知识保持)
6. [实践架构](#6-实践架构)
7. [DeepSeek/LLaMA/Qwen 训练策略对比](#7-deepseekllamaqwen-训练策略对比)
8. [对比表](#8-对比表)
9. [代码与配置示例](#9-代码与配置示例)
10. [2026 趋势](#10-2026-趋势)
11. [相关概念](#11-相关概念)

---

## 1. 概述

### 1.1 为什么需要多阶段训练

单一阶段无法同时优化所有目标:

- **预训练**优化"下一个 token 预测"→ 获得世界知识和语言能力
- **SFT**优化"指令跟随"→ 学会按要求格式回答
- **RLHF/DPO**优化"人类偏好"→ 变得有用、安全、诚实

这三个目标存在张力:
- 预训练数据是"续写"，SFT 数据是"问答"，分布不同
- 过度 SFT 会损害预训练知识 (catastrophic forgetting)
- 过度 RLHF 会导致 alignment tax (能力退化)

多阶段训练通过**渐进式目标切换**平衡这些张力。

### 1.2 2026 年标准 Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    2026 标准 LLM 训练 Pipeline                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐   ┌──────────┐   ┌─────┐   ┌──────┐   ┌──────────┐    │
│  │Pretrain  │──▶│ Annealing│──▶│ SFT │──▶│ RLHF │──▶│ DPO/     │    │
│  │(预训练)  │   │ (退火)   │   │     │   │/GRPO │   │ SimPO    │    │
│  └──────────┘   └──────────┘   └─────┘   └──────┘   └──────────┘    │
│       │              │            │          │             │            │
│       ▼              ▼            ▼          ▼             ▼            │
│  世界知识        精细化        指令跟随   偏好对齐     精细偏好        │
│  语言能力        能力聚焦      格式规范   安全对齐     风格调优        │
│  推理基础        质量提升      多轮对话   奖励优化     最终打磨        │
│                                                                         │
│  数据量:    15T tokens   1-2T tokens  500K-2M  100K-500K  50K-200K    │
│  计算占比:  ~85%         ~8%          ~3%      ~3%          ~1%        │
│  时间(70B): 2-4 周       2-4 天       1-2 天   3-7 天       1-2 天    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Pipeline 的演进

| 时期 | Pipeline | 代表模型 |
|------|----------|---------|
| 2022 | Pretrain → SFT → RLHF (PPO) | InstructGPT, ChatGPT |
| 2023 | Pretrain → SFT → DPO | Zephyr, Tulu |
| 2024 | Pretrain → Annealing → SFT → RLHF | LLaMA-3, Qwen-2 |
| 2025 | Pretrain → Annealing → SFT → GRPO + DPO | DeepSeek-R1, Qwen-2.5 |
| 2026 | Pretrain → Annealing → SFT → Multi-round RL → DPO polish | 前沿模型 |

---

## 2. 核心原理

### 2.1 各阶段的优化目标

```
Pretrain:   L = -Σ_t log P(x_t | x_{<t})           — 最大化语料似然
Annealing:  L = -Σ_t log P(x_t | x_{<t})           — 同预训练, 数据更精选
SFT:        L = -Σ_t log P(y_t | x, y_{<t})        — 只计算 response 部分
RLHF (PPO): L = E[r(x,y)] - β·KL(π||π_ref)        — 最大化奖励+KL约束
DPO:        L = -E[log σ(β·(log π(y_w|x)/π_ref(y_w|x) - log π(y_l|x)/π_ref(y_l|x)))]
```

### 2.2 阶段间的关系

```
Pretrain ──▶ 提供: 世界知识, 语言能力, 推理基础
     │ (知识保持: 不能丢失)
     ▼
Annealing ──▶ 提供: 精细化知识, 特定能力增强
     │ (格式转换: 从续写 → 问答)
     ▼
SFT ──▶ 提供: 指令跟随, 格式规范, 多轮能力
     │ (偏好注入: 从"能做" → "做得好")
     ▼
RLHF/DPO ──▶ 提供: 人类偏好对齐, 安全性, 风格

核心矛盾: 每个后续阶段都可能损害前序阶段的能力
```

### 2.3 为什么不能合并阶段

| 合并方案 | 问题 |
|---------|------|
| Pretrain + SFT 合并 | SFT 数据被海量预训练数据稀释 |
| SFT + RLHF 合并 | 奖励信号稀疏, 格式学习不稳定 |
| 全部合并 | 目标冲突, 超参无法同时最优, 调试困难 |

分阶段优势: 独立优化超参、独立评估效果、问题定位、checkpoint 复用

---

## 3. 完整 Pipeline 详解

### 3.1 Stage 1: Pretraining

```
┌─────────────────────────────────────────────────────────────────┐
│  数据: 10-20T tokens                                            │
│  · Web (50-60%) + Code (15-20%) + Books (10%)                  │
│  · Academic (5-10%) + Wikipedia (3-5%) + Math (5%)             │
│  · 格式: 纯文本续写 (next token prediction)                     │
│                                                                 │
│  超参:                                                          │
│  · LR: 3e-4 (peak), cosine decay, warmup 2000 steps            │
│  · Batch: 4M-16M tokens                                        │
│  · Optimizer: AdamW (β1=0.9, β2=0.95, ε=1e-8)                 │
│  · Weight Decay: 0.1, Gradient Clipping: 1.0                   │
│  · Precision: BF16 mixed precision                              │
│                                                                 │
│  基础设施: 3D parallelism (TP+PP+DP), 1024-16000 GPUs          │
│  输出: Base Model (只会续写, 无指令跟随能力)                     │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Stage 2: Annealing

```
┌─────────────────────────────────────────────────────────────────┐
│  数据: 1-2T tokens (预训练的 5-15%), 最高质量子集               │
│  · Top 10% Web (质量分类器) + 数学/推理 (25%)                   │
│  · 高质量代码 (20%) + 合成教科书 (15%) + 学术 (10%)            │
│                                                                 │
│  超参:                                                          │
│  · LR: 从 peak/3 线性衰减到 0, 无 warmup (接续预训练)          │
│  · Batch: 同预训练或略小                                        │
│                                                                 │
│  关键: LR 必须衰减到 0, 数据质量 > 数量                        │
│  效果: 提升 benchmark 2-5%, 是"性价比"最高的阶段               │
│  输出: Refined Base Model                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Stage 3: SFT

```
┌─────────────────────────────────────────────────────────────────┐
│  数据: 500K-2M 条指令对                                        │
│  · 格式: ChatML / ShareGPT / Alpaca                            │
│  · 来源: 人工编写 + 合成 (Evol-Instruct, Rejection Sampling)    │
│  · 覆盖: 通用QA, 代码, 数学, 写作, 多轮对话, 安全拒绝          │
│                                                                 │
│  超参:                                                          │
│  · LR: 1e-5~5e-5 (比预训练低 10-30x, 防止遗忘)                 │
│  · Epochs: 2-3, Batch: 128-512 sequences                       │
│  · Loss: 只计算 response tokens (mask prompt)                   │
│  · Max Seq Length: 8192-32768                                   │
│                                                                 │
│  关键: 需包含安全/拒绝样本, 多轮对话数据不可少                  │
│  输出: Instruct Model (能跟随指令, 但未对齐偏好)                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Stage 4: RLHF / GRPO

```
┌─────────────────────────────────────────────────────────────────┐
│  数据: 50K-200K prompts, 每个生成 4-16 responses                │
│  奖励: RM 打分 / 可验证奖励 / 混合                             │
│                                                                 │
│  超参 (GRPO):                                                   │
│  · LR: 1e-6~5e-6 (极低)                                        │
│  · KL Coefficient (β): 0.01-0.1, Clip: 0.2                    │
│  · Temperature (生成): 0.7-1.0, Group Size: 8-16               │
│  · Episodes: 2-5, Batch: 256-1024 prompts                      │
│                                                                 │
│  关键: 需要 Reference Model (frozen SFT model)                  │
│  监控: reward hacking, KL 爆炸, 生成质量                       │
│  输出: RL-aligned Model                                         │
└─────────────────────────────────────────────────────────────────┘
```

### 3.5 Stage 5: DPO / SimPO

```
┌─────────────────────────────────────────────────────────────────┐
│  数据: 50K-200K 偏好对                                         │
│  · 来源: 人工标注 + RLAIF + 用户反馈                            │
│  · 聚焦: RL 后仍不满意的特定问题                                │
│                                                                 │
│  超参:                                                          │
│  · LR: 5e-7~5e-6 (极低, 精细调整)                              │
│  · β (DPO): 0.1-0.5, Epochs: 1-2                              │
│  · Reference: RL 后的模型 (frozen)                              │
│                                                                 │
│  关键: 数据质量要求最高, 通常只做 1 epoch                       │
│  定位: 是"最后 1%"的打磨                                       │
│  输出: Final Aligned Model (发布版)                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. 各阶段数据/超参/目标差异

### 4.1 全景对比表

| 维度 | Pretrain | Annealing | SFT | RLHF/GRPO | DPO |
|------|----------|-----------|-----|-----------|-----|
| **数据量** | 10-20T tokens | 1-2T tokens | 500K-2M 条 | 50K-200K prompts | 50K-200K 对 |
| **数据格式** | 纯文本 | 纯文本 (高质量) | 指令-回复对 | Prompt+生成 | 偏好对 |
| **Learning Rate** | 3e-4 | 1e-4→0 | 1e-5~5e-5 | 1e-6~5e-6 | 5e-7~5e-6 |
| **Batch Size** | 4M-16M tokens | 同 Pretrain | 128-512 seqs | 256-1024 prompts | 64-256 pairs |
| **Epochs** | 1-2 | 1 | 2-3 | 2-5 episodes | 1-2 |
| **Loss 计算** | 所有 tokens | 所有 tokens | 仅 response | 策略梯度 | 偏好对比 |
| **序列长度** | 4K-8K | 8K-32K | 8K-32K | 4K-16K | 4K-8K |
| **GPU (70B)** | 1024+ | 512+ | 64-128 | 256-512 | 64-128 |
| **核心风险** | 训练不稳定 | 过拟合 | 灾难性遗忘 | Reward hacking | 过度对齐 |

### 4.2 学习率全程变化

```
LR
3e-4 ─╲                                           Pretrain
       ╲──────────╲                               Annealing (→0)
1e-4 ──────────────╲
                    ╲── 5e-5 ──╲                  SFT
1e-6 ────────────────────────────╲── 2e-6 ──╲   RLHF
5e-7 ──────────────────────────────────────────╲  DPO
0  ───┴──────────┴──────────────┴──────────┴──┴──
     0%        85%    93%    96%   99%   100%   Progress
```

---

## 5. 阶段间知识保持

### 5.1 灾难性遗忘问题

| 过渡 | 风险 | 表现 | 原因 |
|------|------|------|------|
| Pretrain → SFT | 预训练知识被覆盖 | MMLU 下降 | SFT 数据分布窄, LR 过高 |
| SFT → RLHF | 指令跟随被扭曲 | 格式退化 | Reward hacking |
| RLHF → DPO | RL 偏好被覆盖 | 安全性退化 | DPO 数据与 RL 奖励不一致 |

### 5.2 知识保持策略

| 策略 | 适用阶段 | 方法 |
|------|---------|------|
| 低学习率 | SFT/RLHF/DPO | LR 比预训练低 10-100x |
| 数据混合 | SFT | 混入 5-10% 预训练数据 |
| KL 正则 | RLHF/DPO | 约束与 reference 的距离 |
| 早停 | 所有后续阶段 | 监控 benchmark, 适时停止 |
| Replay | SFT/RLHF | 定期回放前序数据 |
| 模型合并 | 任意 | 不同 checkpoint 加权平均 |

### 5.3 知识保持监控

```python
class KnowledgeRetentionMonitor:
    EVAL_SUITE = {
        "knowledge": ["mmlu", "triviaqa"],
        "reasoning": ["gsm8k", "arc_challenge"],
        "code": ["humaneval", "mbpp"],
        "safety": ["toxicity", "bias_eval"],
        "instruction": ["mt_bench", "alpaca_eval"],
    }
    
    def evaluate_retention(self, model, baseline_scores: dict) -> dict:
        current_scores = self.run_eval_suite(model)
        alerts = []
        for bench, baseline in baseline_scores.items():
            current = current_scores.get(bench, 0)
            if current < baseline * 0.97:  # 退化 > 3%
                alerts.append(f"⚠️ {bench}: {baseline:.1f} → {current:.1f}")
        return {"scores": current_scores, "alerts": alerts}
```

---

## 6. 实践架构

### 6.1 端到端 Pipeline 系统架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    多阶段训练 Pipeline 系统架构                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Orchestration: Pipeline Controller (Airflow/Kubeflow/Custom)    │   │
│  │  · 阶段调度 · Checkpoint 管理 · 评估触发 · 告警 · 回滚          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│         ┌────────────────────┼────────────────────┐                     │
│  ┌──────▼──────┐    ┌───────▼───────┐    ┌──────▼──────┐              │
│  │  Data Layer  │    │ Training Layer│    │  Eval Layer  │              │
│  │ · Pretrain   │    │ · Megatron-LM │    │ · Auto Bench │              │
│  │ · Anneal     │    │ · DeepSpeed   │    │ · LLM Judge  │              │
│  │ · SFT Data   │    │ · OpenRLHF    │    │ · Human Eval │              │
│  │ · RL Prompts │    │ · TRL / verl  │    │ · Red Team   │              │
│  │ · DPO Pairs  │    │               │    │ · Regression │              │
│  └─────────────┘    └───────────────┘    └──────────────┘              │
│                                                                         │
│  Checkpoint Registry:                                                   │
│  pretrain_v1/ → anneal_v1/ → sft_v1/ → rlhf_v1/ → final/             │
│  (每阶段保存, 支持回滚和分支实验)                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 阶段过渡流程

```
Stage N 完成 → 自动评估 (benchmark suite) → 质量门控
    │                                           │
    │  不通过 → 回滚/重新训练                    │ 通过
    │                                           ▼
    └──────────────────────────────── 数据准备 → 配置生成 → Stage N+1 启动
```

---

## 7. DeepSeek/LLaMA/Qwen 训练策略对比

### 7.1 DeepSeek-V3 / R1

- **V3**: 14.8T tokens, MoE (671B total/37B active), FP8 训练, Multi-Token Prediction
- **R1**: 基于 V3-Base → 冷启动 SFT → 大规模 GRPO (可验证奖励) → 多轮 RL → 最终 SFT 融合
- **关键创新**: GRPO 替代 PPO (节省 50% 资源), 可验证奖励 (无 reward hacking), 纯 RL 扩展推理

### 7.2 LLaMA-3/4 (Meta)

- **LLaMA-3**: 15T+ tokens, 精细过滤, 多阶段课程, 最后 5% 高质量退火 (+2-5%)
- **SFT**: 大规模人工+合成, 多轮拒绝采样
- **RLHF**: 多维度 RM, 多轮迭代 RL, 在线 A/B 测试驱动
- **LLaMA-4**: MoE (Scout/Maverick), 多模态预训练, 10M tokens 上下文

### 7.3 Qwen-2.5/3 (阿里)

- **Qwen-2.5**: 18T tokens, 多语言 (中英+29 种), 代码 (92 种语言), 多阶段 SFT
- **SFT**: 阶段 1 通用 → 阶段 2 推理/代码 → 阶段 3 长文本/多轮
- **RLHF**: DPO + GRPO, 迭代式对齐
- **Qwen-3**: MoE+Dense 双版本, 思考模式切换, 强化推理 RL

### 7.4 核心差异

| 维度 | DeepSeek | LLaMA (Meta) | Qwen (阿里) |
|------|----------|-------------|-------------|
| 架构 | MoE (稀疏) | Dense → MoE | Dense + MoE |
| 核心创新 | GRPO + 可验证奖励 | 规模化工程 + 退火 | 多语言 + 多阶段 SFT |
| RL 方法 | GRPO (无 RM) | PPO (多 RM) | DPO + GRPO |
| 数据策略 | 算法驱动, 精简 | 工程驱动, 大规模 | 平衡, 多语言 |
| 成本效率 | 极高 | 中 (资源充足) | 高 |

### 7.5 Pipeline 流程对比图

```
DeepSeek-R1 Pipeline:
┌──────────┐   ┌────────────┐   ┌──────────────────┐   ┌──────────┐
│ V3-Base  │──▶│ Cold Start │──▶│ GRPO (多轮, 3-5) │──▶│ Final SFT│
│ (14.8T)  │   │ SFT (少量) │   │ 可验证奖励       │   │ (融合)   │
└──────────┘   └────────────┘   └──────────────────┘   └──────────┘
                                    │ 每轮: 数学/代码/通用
                                    ▼
                              推理能力逐步涌现

LLaMA-3 Pipeline:
┌──────────┐   ┌────────────┐   ┌──────────┐   ┌──────────────┐   ┌─────┐
│ Pretrain │──▶│ Annealing  │──▶│ SFT (大规│──▶│ RLHF (多轮   │──▶│ DPO │
│ (15T+)   │   │ (Top 5%)   │   │ 模人工+  │   │ PPO, 多 RM)  │   │     │
└──────────┘   └────────────┘   │ 合成)    │   └──────────────┘   └─────┘
                                 └──────────┘
                                    │ 拒绝采样 × 多轮
                                    ▼
                              质量逐步提升

Qwen-2.5 Pipeline:
┌──────────┐   ┌────────────┐   ┌──────────────────────┐   ┌──────────┐
│ Pretrain │──▶│ Annealing  │──▶│ 多阶段 SFT           │──▶│ DPO+GRPO │
│ (18T)    │   │ (多语言)   │   │ S1:通用→S2:推理→S3:长│   │ (迭代)   │
└──────────┘   └────────────┘   └──────────────────────┘   └──────────┘
                                    │ 3 个子阶段
                                    ▼
                              能力逐步聚焦
```

### 7.6 关键启示

| 启示 | 来源 | 说明 |
|------|------|------|
| RL 可以替代大量 SFT | DeepSeek-R1 | 纯 RL 扩展推理能力, SFT 只做冷启动 |
| 退火是性价比之王 | LLaMA-3 | 5% 数据量带来 2-5% 提升 |
| 多阶段 SFT 优于单阶段 | Qwen-2.5 | 分阶段聚焦不同能力, 减少冲突 |
| 可验证奖励消除 hacking | DeepSeek | 数学/代码有确定答案, 无需 RM |
| 多轮 RL 优于单轮 | 三家共识 | 2-5 轮迭代, 每轮聚焦不同能力 |
| 数据质量 > 数据数量 | 三家共识 | 退火/SFT/DPO 阶段尤为明显 |

---

## 8. 对比表

### 8.1 各阶段关键指标

| 指标 | Pretrain | Annealing | SFT | RLHF | DPO |
|------|----------|-----------|-----|------|-----|
| 数据质量要求 | 中 | 很高 (top 10%) | 高 | 中 | 很高 |
| 过拟合风险 | 低 | 中 | 高 | 中 | 高 |
| 遗忘风险 | N/A | 低 | 高 | 中 | 中 |
| 对最终性能影响 | 60-70% | 10-15% | 10-15% | 5-10% | 2-5% |

### 8.2 常见 Pipeline 变体

| 变体 | Pipeline | 适用场景 | 代表 |
|------|----------|---------|------|
| 标准 | PT→Anneal→SFT→RLHF→DPO | 通用大模型 | LLaMA-3 |
| 推理强化 | PT→Anneal→SFT→GRPO(多轮)→SFT | 推理模型 | DeepSeek-R1 |
| 轻量 | PT→SFT→DPO | 资源有限 | Zephyr, Tulu |
| 多模态 | PT(多模态)→Anneal→SFT→RLHF | 多模态模型 | GPT-4o |
| 持续训练 | PT(续)→Anneal→SFT→RLHF | 领域适配 | 行业模型 |

---

## 9. 代码与配置示例

### 9.1 Pipeline 配置 (核心部分)

```yaml
# full_pipeline_config.yaml (70B Dense Model)
pipeline:
  name: "llm_70b_v1"
  stages:
    pretrain:
      checkpoint: null
      data: {total_tokens: "15T", sequence_length: 8192}
      training:
        learning_rate: 3.0e-4
        lr_schedule: "cosine"
        warmup_steps: 2000
        batch_size_tokens: 8388608
      infrastructure: {gpus: 1024, framework: "megatron-lm"}
    
    annealing:
      checkpoint: "${pretrain.output}"
      data: {total_tokens: "1.5T", sequence_length: 32768}
      training:
        learning_rate: 1.0e-4
        lr_schedule: "linear_decay_to_zero"
        warmup_steps: 0
    
    sft:
      checkpoint: "${annealing.output}"
      data: {path: "data/sft/sft_v3.jsonl", num_samples: 1000000, format: "chatml"}
      training:
        learning_rate: 2.0e-5
        epochs: 3
        batch_size: 256
        loss_mask: "response_only"
      quality_gate: {min_mmlu: 75.0, max_regression: 3.0}
    
    rlhf:
      checkpoint: "${sft.output}"
      algorithm: "grpo"
      data: {num_prompts: 200000, generations_per_prompt: 8}
      training:
        learning_rate: 2.0e-6
        kl_coeff: 0.05
        clip_range: 0.2
        episodes: 3
      quality_gate: {max_kl: 15.0, min_safety_score: 0.95}
    
    dpo:
      checkpoint: "${rlhf.output}"
      data: {num_pairs: 100000}
      training:
        learning_rate: 5.0e-7
        beta: 0.1
        epochs: 1
      quality_gate: {min_alpaca_eval_winrate: 70.0, max_regression: 1.5}

global:
  evaluation:
    benchmark_suite: ["mmlu", "gsm8k", "humaneval", "mt_bench", "alpaca_eval", "safety_bench"]
  rollback: {enabled: true, max_regression_threshold: 5.0}
```

### 9.2 阶段过渡控制器

```python
"""多阶段训练 Pipeline 控制器"""
import json
from dataclasses import dataclass
from typing import Optional, Dict, List
from pathlib import Path

@dataclass
class StageConfig:
    name: str
    checkpoint_path: str
    eval_results: Dict[str, float]

class PipelineController:
    def __init__(self, pipeline_config: dict, output_dir: str):
        self.config = pipeline_config
        self.output_dir = Path(output_dir)
        self.stage_history: List[StageConfig] = []
    
    def validate_stage_transition(self, from_stage: str, eval_results: Dict[str, float],
                                   baseline: Optional[Dict[str, float]] = None) -> tuple:
        """验证阶段过渡是否满足质量门控"""
        warnings, passed = [], True
        quality_gate = self.config["stages"][from_stage].get("quality_gate", {})
        
        for metric, threshold in quality_gate.items():
            if metric.startswith("min_") and metric[4:] in eval_results:
                if eval_results[metric[4:]] < threshold:
                    warnings.append(f"❌ {metric[4:]}: {eval_results[metric[4:]]:.2f} < {threshold}")
                    passed = False
            elif metric.startswith("max_") and metric[4:] in eval_results:
                if eval_results[metric[4:]] > threshold:
                    warnings.append(f"❌ {metric[4:]}: {eval_results[metric[4:]]:.2f} > {threshold}")
                    passed = False
        
        if baseline:
            max_reg = quality_gate.get("max_regression", 3.0)
            for m, base_score in baseline.items():
                if m in eval_results and base_score - eval_results[m] > max_reg:
                    warnings.append(f"⚠️ {m} regression: {base_score:.1f} → {eval_results[m]:.1f}")
                    if base_score - eval_results[m] > max_reg * 2:
                        passed = False
        return passed, warnings
    
    def transition(self, current: str, next_stage: str, checkpoint: str,
                   eval_results: Dict[str, float]) -> bool:
        baseline = self.stage_history[-1].eval_results if self.stage_history else None
        passed, warnings = self.validate_stage_transition(current, eval_results, baseline)
        for w in warnings:
            print(w)
        if not passed:
            print(f"🚫 BLOCKED: {current} → {next_stage}")
            return False
        self.stage_history.append(StageConfig(current, checkpoint, eval_results))
        print(f"✅ {current} → {next_stage} | Checkpoint: {checkpoint}")
        return True
    
    def rollback(self, target: str) -> Optional[str]:
        for stage in reversed(self.stage_history):
            if stage.name == target:
                return stage.checkpoint_path
        return None
```

### 9.3 SFT 训练 (关键配置)

```python
"""SFT: 从 Annealing checkpoint 继续, 关键是知识保持"""
from trl import SFTTrainer, SFTConfig

sft_config = SFTConfig(
    output_dir="checkpoints/sft_v1/",
    learning_rate=2e-5,           # 比预训练低 10-30x (防止遗忘)
    lr_scheduler_type="cosine",
    warmup_ratio=0.03,
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=16,
    max_seq_length=32768,
    packing=True,
    weight_decay=0.01,
    bf16=True,
    deepspeed="configs/ds_zero3.json",
    dataset_text_field="text",
    response_template="<|im_start|>assistant\n",  # 只计算 response loss
)
```

---

## 10. 2026 趋势

### 10.1 阶段融合 (Stage Merging)

```
传统 (2023): [Pretrain] ──硬切换──▶ [SFT] ──硬切换──▶ [RLHF]
融合 (2026): [Pretrain ──▶ Annealing ──▶ SFT+RL 混合] (渐进过渡, 联合优化)

具体方式:
1. Pretrain + Annealing: 渐进调整数据配比和 LR, 不再硬切换
2. SFT + RL: SFT 后期引入 RL 信号, 或 RL 中混入 SFT 数据
3. 多轮迭代: (SFT → RL → SFT → RL) × N, 边界越来越模糊
```

### 10.2 端到端对齐

- **Alignment during Pretraining**: 预训练数据中混入对齐数据 (如安全对话、高质量 QA)
- **Constitutional Pretraining**: 预训练时引入安全约束, 用规则过滤有害续写
- **Joint Training**: SFT + RL 联合优化, 共享 batch, 动态调整 loss 权重
- **现状**: 研究阶段, 尚未在大规模模型验证; 小模型 (7B) 实验显示可行

```
传统: [Pretrain] ──硬切换──▶ [SFT] ──硬切换──▶ [RL]
融合: [Pretrain + 5% 对齐数据] ──渐进──▶ [SFT + RL 联合] ──▶ [DPO]
优势: 减少阶段间分布偏移, 降低遗忘风险
挑战: 超参空间更大, 调试更困难, 需要更精细的 loss 平衡
```

### 10.3 推理模型的特殊 Pipeline

```
Pretrain → Annealing(数学/代码强化) → Cold Start SFT(少量推理数据)
→ Reasoning RL(大规模 GRPO, 可验证奖励, 多轮迭代)
→ Final SFT(融合推理+通用能力) → DPO Polish

关键区别: RL 占比 30-50%, 可验证奖励为主, 多轮 RL (3-10 轮)
```

### 10.4 持续训练与在线更新

```
用户反馈 → 数据筛选 → 增量 SFT/DPO → 部署 → 用户反馈 → ... (每周迭代)

解决方案: LoRA 增量更新 / 模型合并 / 自动回归测试 / 金丝雀发布
关键挑战: 防止灾难性遗忘, 保持版本一致性, 控制更新频率
```

### 10.5 自适应 Pipeline

- **自动阶段过渡**: 基于 validation loss 拐点 / benchmark 饱和检测, 自动触发下一阶段
- **动态数据配比**: 基于各域 loss 变化率, 实时调整数据混合比例 (类似 DoReMi)
- **自动回滚**: 检测到能力退化 (benchmark 下降 > 阈值) 时自动恢复上一 checkpoint
- **LLM-as-Controller**: 用 LLM 分析训练日志, 生成超参调整建议和异常诊断
- **A/B 分支训练**: 同一 checkpoint 分叉多条路径, 自动评估选优

```
自适应 Pipeline 循环:
训练 → 评估 → 分析 (LLM/规则) → 决策 (继续/过渡/回滚/调参) → 训练 → ...
人工介入: 仅在重大决策 (如是否发布) 时需要人工确认
```

---

## 11. 相关概念

- [[RLHF_at_Scale_2026]] - 大规模 RLHF 工业化实践
- [[GRPO_and_New_Alignment_Methods]] - GRPO 与新一代对齐方法
- [[Synthetic_Data_Training_2026]] - 合成数据训练
- [[Curriculum_Learning_for_LLMs]] - 课程学习与数据调度
- [[Data_Curation_and_Mixture_2026]] - 数据配比与清洗
- [[Scaling_Laws_and_Training_Dynamics]] - Scaling Laws
- [[Training_Cost_Optimization_and_FinOps_2026]] - 训练成本优化
- [[alignment-rlhf]] - RLHF 基础
- [[TRL_RLHF_DPO_Guide]] - TRL 实战指南
- [[Distributed_Training_Hang_Runbook]] - 分布式训练故障排查
- [[Megatron_LM_Deep_Dive]] - Megatron-LM 详解
- [[FSDP_Deep_Dive]] - FSDP 详解
- [[Optimizer_Advanced_2026]] - 高级优化器
- [[Hyperparameter_Tuning]] - 超参数调优

---

## 附录: Pipeline 故障排查

| 问题 | 可能阶段 | 原因 | 解决方案 |
|------|---------|------|---------|
| SFT 后 MMLU 大幅下降 | SFT | LR 过高 / 数据太窄 | 降低 LR, 混入预训练数据 |
| RL 后模型"变傻" | RLHF | Reward hacking | 增大 KL, 早停, Ensemble RM |
| DPO 后安全性退化 | DPO | 偏好数据不含安全样本 | 混入安全偏好对 |
| Annealing 后 PPL 上升 | Annealing | 数据分布偏移太大 | 渐进调整配比 |
| 多轮 RL 后能力偏科 | RLHF | 奖励只覆盖部分能力 | 多维度奖励, 混入通用数据 |
| 阶段过渡时 loss spike | 任意 | 数据分布突变 | 渐进过渡, 数据混合 |
| 最终模型格式不稳定 | SFT/DPO | SFT 数据格式不一致 | 统一格式模板 |
| 长文本能力退化 | SFT/RL | 训练序列太短 | 混入长文本数据 |
