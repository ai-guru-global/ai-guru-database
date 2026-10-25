---
title: "课程学习 (Curriculum Learning / Baby Steps / Easy-to-Hard / 训练策略)"
category: concepts
tags:
  - training
  - curriculum-learning
  - easy-to-hard
  - baby-steps
  - self-paced-learning
  - data-curriculum
aliases:
  - Curriculum Learning
  - Easy-to-Hard
  - Baby Steps
  - Self-Paced Learning
  - Training Curriculum
relationships:
  - target: "概念/data-mixing"
    type: extends
  - target: "概念/synthetic-data"
    type: related_to
  - target: "概念/data-cleaning-pipeline"
    type: related_to
summary: "课程学习(Curriculum Learning)是 2023-2026 突破"训练数据乱序"的关键训练范式——从易到难(Bengio 2009)、Baby Steps(2017)、Self-Paced Learning(2010)、Difficulty-Aware Sampling。在 LLM 训练中表现为:前 90% 大数据通用,后 10% 高质量推理 / 代码;SFT 阶段 简单 → 复杂;RL 阶段 易题 → 难题。Llama 3 / Qwen 3 / DeepSeek V3 全部采用。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
name_zh: "课程学习"
---

# 课程学习 (Curriculum Learning)

> 中文简称：课程学习

> **一句话理解**:课程学习让模型像人一样"从易到难"——先学简单任务,后学复杂任务。LLM 训练中表现为:预训练(通用大数据)+ 退火(高质量数据)、SFT(简单指令 → 复杂)、RL(易题 → 难题)。Llama 3 / Qwen 3 / DeepSeek V3 公开报告全部采用。

---

## 一、为什么需要课程学习?

随机采样训练的问题:
- **样本利用不均**:模型在简单题上学不到,在难题上卡住
- **收敛慢**:杂乱信息分散学习信号
- **灾难性遗忘**:学新忘旧
- **效率低**:难样本浪费计算

课程学习解法:
- **从易到难**:建立知识基础后再学复杂
- **自适应难度**:动态调整
- **数据利用率高**:难样本更有效

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 课程学习 | Curriculum Learning | 从易到难 |
| 自我节奏学习 | Self-Paced Learning | 模型自主选样本 |
| 婴儿步 | Baby Steps | 小步前进 |
| 难度评估 | Difficulty Estimation | 评估样本难度 |
| 难度感知采样 | Difficulty-Aware Sampling | 按难度采样 |
| 退火 | Annealing | 训练末段切高质量数据 |
| 学习进度 | Learning Progress | 当前学到的能力 |
| 知识点 | Knowledge Point | 概念 / 技能 |
| 技能图 | Skill Graph | 技能依赖 |
| 反课程 | Anti-Curriculum | 从难到易 |
| 课程设计 | Curriculum Design | 设计学习顺序 |
| 转移学习 | Transfer Learning | 任务间迁移 |
| 预训练 | Pre-Training | 大规模通用 |
| 监督微调 | Supervised Fine-Tuning(SFT) | 任务特定 |
| 强化学习 | Reinforcement Learning(RL) | 偏好优化 |
| 思维链 | Chain-of-Thought(CoT) | 推理路径 |
| 程序验证 | Programmatic Verification | 自动验证 |

---

## 三、主流方法对比(2026-02 快照)

| 方法 | 团队 | 核心创新 | 适合 |
|---|---|---|---|
| **CL(Bengio 2009)** | Yoshua Bengio | 经典从易到难 | 计算机视觉 |
| **Self-Paced Learning** | UCI | 模型自选样本 | 半监督 |
| **Baby Steps** | Google 2017 | 渐进式扩展 | 机器翻译 |
| **RHO-Loss** | Microsoft 2023 | 损失值定义难度 | LLM 预训练 |
| **Skill-It** | MIT 2024 | 技能图 + 顺序 | 推理任务 |
| **DAPO 动态采样** | 字节 2025 | 动态跳过太易/太难 | 长 CoT RL |
| **Anneal(退火)** | Llama 3 / Qwen | 后 5-10% 高质量数据 | 预训练 |
| **CoT Curriculum** | 2024 | 短 CoT → 长 CoT | 推理微调 |
| **Difficulty-Aware RL** | DeepSeek | 难题 + 易题分组 | 推理 RL |

---

## 四、LLM 训练三阶段课程

### 4.1 阶段 1:预训练(Pretraining)

```
T0: 大数据 + 多源 → 基础能力
T1: 高质量数据 → 强化推理
T2: 退火(5-10% 时间) → 教科书 / 论文
```

- **Llama 3 退火**:后 40M tokens 用高质量数据(类 DoReMi 风格)
- **Qwen 2.5 退火**:最后 5% 提升明显
- **DeepSeek V3**:14T tokens + 退火

### 4.2 阶段 2:SFT(监督微调)

```
Phase A: 通用指令(10K-50K 条)→ 学会指令
Phase B: 复杂指令(50K-200K 条)→ 提升质量
Phase C: 高级推理(20K-50K 条)→ 推理
```

**典型实践**:
- 简单 Q&A → CoT 推理 → 多步推理
- 短答案 → 长答案
- 单一任务 → 多任务

### 4.3 阶段 3:RL(强化学习)

```
Stage 1: 简单题 + 答案可验证 → 建立 RL 信号
Stage 2: 中等题 → 提升稳定性
Stage 3: 困难题 + 反思 → SOTA
```

**DAPO 动态采样**:跳过准确率 = 1 或 = 0 的样本(过易/过难),专注中间难度。

---

## 五、RHO-Loss 详解

### 5.1 核心思想

用**损失值**作为难度指标:
- 高 loss = 模型不会 = 难
- 低 loss = 模型会了 = 易

### 5.2 训练流程

1. 先正常训几步
2. 收集每样本 loss
3. 按 loss 排序
4. 高 loss 样本 = 难样本,优先训
5. 动态调整(模型学会后,该样本变易,降权重)

### 5.3 优势

- 自动:无需外部难度标注
- 适应:难度随训练变化
- 高效:聚焦有信息样本

### 5.4 论文

- "RHO-LOSS: Utilizing Language Model Loss for Data Filtering" [arxiv.org/abs/2401.06414](https://arxiv.org/abs/2401.06414)

---

## 六、生产最佳实践

1. **预训练必做退火**:最后 5-10% 切高质量数据。
2. **SFT 三阶段**:通用 → 复杂 → 推理。
3. **RL 用动态采样**:跳过太易/太难,聚焦中间。
4. **难度评估**:用 loss / 模型置信度 / LLM 评分。
5. **课程设计要平滑**:难度跳跃不要太大。
6. **Self-Paced 优于固定**:模型自主选样本。
7. **同主题分组**:避免难 / 易样本穿插。
8. **A/B 测试**:有 / 无课程对比,通常优 3-8%。
9. **避免过早专门化**:前阶段不能全学一类。
10. **多任务平衡**:在多任务训练中,按任务难度配比。

---

## 七、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **退火** | Llama 3 / Qwen 3 / DeepSeek V3 全部公开 |
| **RHO-Loss** | 微软 2024,自动难度评估 |
| **DAPO 动态采样** | 字节,长 CoT RL 标配 |
| **Skill-It** | MIT 2024,推理任务 SOTA |
| **Self-Paced** | 持续用于半监督学习 |
| **CoT Curriculum** | 推理模型训练标配 |
| **企业应用** | 大模型预训练 / SFT / RL 全流程 |
| **市场规模** | 训练框架 ARR $200M+ |
| **主要竞品** | HuggingFace / DeepSpeed / Megatron / ColossalAI |
| **未来** | "自适应课程"(随模型状态调整) |

---

## 八、See Also(官方源)

### 核心论文

- Bengio 2009 [proceedings.mlr.press/v9/bengio09a.html](https://proceedings.mlr.press/v9/bengio09a.html)
- RHO-Loss [arxiv.org/abs/2401.06414](https://arxiv.org/abs/2401.06414)
- Skill-It [arxiv.org/abs/2307.14330](https://arxiv.org/abs/2307.14330)
- DAPO [arxiv.org/abs/2503.14476](https://arxiv.org/abs/2503.14476)

### 实战参考

- Llama 3 [arxiv.org/abs/2407.21783](https://arxiv.org/abs/2407.21783)
- DeepSeek V3 [arxiv.org/abs/2412.19437](https://arxiv.org/abs/2412.19437)
- Qwen 2.5 [qwenlm.github.io/blog/qwen2.5](https://qwenlm.github.io/blog/qwen2.5/)

### 工具

- HuggingFace trl [github.com/huggingface/trl](https://github.com/huggingface/trl)
- OpenRLHF [github.com/OpenRLHF/OpenRLHF](https://github.com/OpenRLHF/OpenRLHF)
- verl [github.com/volcengine/verl](https://github.com/volcengine/verl)

---

## 九、相关概念卡

- [[概念/data-mixing|Data Mixing]]
- [[概念/synthetic-data|Synthetic Data]]
- [[概念/online-dpo-rl|Online Dpo Rl]]
- [[概念/data-cleaning-pipeline|Data Cleaning Pipeline]]
- [[概念/pretrain-vs-finetune-vs-rag|Pretrain Vs Finetune Vs Rag]]
- [[概念/pre-training|Pre Training]]
- [[概念/sft|Sft]]
- [[概念/grpo|Grpo]]
