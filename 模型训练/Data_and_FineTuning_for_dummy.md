---
title: "数据与微调大白话：数据清洗 Pipeline、DoRA、RS-LoRA"
category: "07-model-training"
tags: ["data-cleaning", "dora", "rs-lora", "fine-tuning", "peft", "for-dummy"]
summary: "> **一句话理解**: 训练大模型就像养孩子——先给干净、均衡的‘食物’（数据清洗 Pipeline），再用省力的方法教它新技能（DoRA、RS-LoRA），不用把全身神经都重写一遍。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Data And Finetuning For Dummy"
  - "Data and FineTuning for dummy"
  - Data_and_FineTuning_for_dummy
sources: []

---
# 数据与微调大白话：数据清洗 Pipeline、DoRA、RS-LoRA

> **一句话理解**: 训练大模型就像养孩子——先给干净、均衡的“食物”（数据清洗 Pipeline），再用省力的方法教它新技能（DoRA、RS-LoRA），不用把全身神经都重写一遍。

---

## 1. 数据清洗 Pipeline：给 AI 做饭前先洗菜

### 1.1 一句话理解

数据清洗 Pipeline 就像中央厨房的备菜流程：把从菜市场（互联网）拉来的各种原料，挑掉烂的、洗干净、切好、按比例搭配，最后做成适合大模型“吃”的营养餐。

### 1.2 为什么原料干净很重要？

大模型是“喂什么学什么”：
- 喂重复内容 → 模型死记硬背。
- 喂垃圾网页 → 模型学会胡说八道。
- 喂有毒内容 → 模型可能输出有害信息。
- 喂配比失衡 → 模型某些能力过强，某些能力缺失。

### 1.3 Pipeline 主要步骤

```
原始数据
  ↓ 采集：网页、书籍、代码、论文、对话
  ↓ 去重：去掉重复/近似重复内容
  ↓ 格式清洗：HTML 转文本、统一编码
  ↓ 质量打分：去掉乱码、过短、机器生成垃圾
  ↓ 安全过滤：去掉隐私、仇恨、成人内容
  ↓ 数据配比：按领域/语言/难度混合
  ↓ 高质量训练语料
```

### 1.4 不同阶段关注点

| 阶段 | 关注点 | 例子 |
|------|--------|------|
| **预训练** | 规模、多样性、去重 | 万亿 token 网页+书籍+代码 |
| **SFT 微调** | 指令格式、答案质量 | Alpaca、ShareGPT |
| **RLHF 对齐** | 偏好对、安全边界 | HH-RLHF |

---

## 2. LoRA：只改一点点就能学会新技能

在讲 DoRA 和 RS-LoRA 之前，先回忆一下 **LoRA**。

**LoRA 的核心思想**：大模型有几百亿参数，但微调一个新任务时，其实只需要调整其中很小一部分。于是我们只训练两个很小的矩阵，把它们加到原权重上。

```
原权重 W₀（很大，冻结不动）
+ 小矩阵 B × A（很小，只训练它）
= 新权重 W
```

优点：省显存、速度快、效果接近全量微调。

---

## 3. DoRA：把“方向”和“大小”分开调

### 3.1 一句话理解

DoRA 就像调方向盘：LoRA 是连方向盘和油门一起改，DoRA 是只调方向盘角度，让转弯更精准、不容易失控。

### 3.2 它改进了什么？

LoRA 直接学一个增量 ΔW，但方向更新可能和原始权重“拧巴”。

DoRA 把权重拆成两部分：
- **幅度（magnitude）**：数值大小。
- **方向（direction）**：数值指向哪里。

它固定幅度，只微调方向。数学上更稳定，效果通常更好，尤其在小 rank 时。

### 3.3 什么时候用？

- 希望效果接近全量微调，但显存不够。
- rank 很小（如 r=8）时，DoRA 比 LoRA 更稳。

---

## 4. RS-LoRA：用很小的 rank 也能学好

### 4.1 一句话理解

RS-LoRA 就像给近视眼配了一副“自动变焦眼镜”：即使镜片很小（rank 很低），也能通过特殊调校看清远处细节。

### 4.2 它解决了什么问题？

LoRA 有个超参 α/r 控制更新幅度。rank 很小时，这个比例容易过大或过小，导致训练不稳定或学不动。

RS-LoRA 把缩放改成与 √r 相关，让小 rank 也能稳定学习。

### 4.3 LoRA vs DoRA vs RS-LoRA

| 方法 | 核心特点 | 适合场景 |
|------|----------|----------|
| **LoRA** | 通用低秩微调 | rank 中等，资源一般 |
| **DoRA** | 只调方向，更稳定 | 追求接近全量微调效果 |
| **RS-LoRA** | 小 rank 也能学 | 显存极度受限 |

---

## 5. 一张图记清楚

```
训练大模型
  ├─ 预训练：数据清洗 Pipeline → 大量干净语料
  └─ 微调
      ├─ LoRA：小矩阵增量学习
      ├─ DoRA：方向/幅度分离，更稳定
      └─ RS-LoRA：极小 rank 也能学
```

---

## 6. 核心概念速查表

| 概念 | 一句话 | 解决什么问题 |
|------|--------|--------------|
| **数据清洗 Pipeline** | 给 AI 准备干净食材 | 训练数据脏、乱、有毒 |
| **DoRA** | 只调方向不调大小 | LoRA 不稳定、效果不够好 |
| **RS-LoRA** | 小 rank 稳定学习 | 显存极少时的微调 |

---

*Last updated: 2026-06-16*

## Related

- [[_concepts/data-cleaning-pipeline|数据清洗 Pipeline]]
- [[_concepts/dora|DoRA]]
- [[_concepts/rs-lora|RS-LoRA]]
- [[_concepts/lora-peft|LoRA 与参数高效微调]]
- [[_concepts/llm-data-engineering|大模型数据工程]]
- [[模型训练/Data/Data_Curation_and_Mixture_2026|数据策展与配比 2026]]
- [[大模型/Fine_tuning_Techniques/LoRA_QLoRA_SFT_RLHF_DPO_in_Detail|LoRA/QLoRA/SFT/RLHF/DPO 详解]]
