---
title: "迁移学习 (Transfer Learning)"
category: 03-deep-learning
tags: ["deep-learning", "transfer-learning", "fine-tuning", "pre-training", "domain-adaptation", "peft", "lora"]
summary: "迁移学习是现代 AI 的核心范式——从 ImageNet 预训练到大语言模型，迁移学习让模型复用已有知识解决新任务。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "Transfer Learning"
  - "Transfer_Learning"
  - "迁移学习"

---

# 迁移学习 (Transfer Learning)

> 迁移学习是现代 AI 的核心范式——从 ImageNet 预训练到大语言模型，迁移学习让模型复用已有知识解决新任务。

---

## 1. 概述 (Overview)

迁移学习（Transfer Learning）是指将在一个任务或数据集上学到的知识应用到另一个相关任务上的机器学习方法。它是现代 AI 进步的核心驱动力之一——从 BERT 到 GPT，从 ResNet 到 ViT，几乎所有突破性模型都建立在迁移学习的基础之上。

### 为什么迁移学习如此重要？

```
从零训练一个 LLM:
  数据: 数万亿 token
  计算: 数千 GPU × 数月
  成本: 数千万美元

微调一个预训练模型:
  数据: 数千-数万样本
  计算: 1-8 GPU × 数小时-数天
  成本: 数百-数千美元

→ 迁移学习让 AI 民主化
```

### 迁移学习的三个时代

```
时代 1: 特征提取 (2014-2018)
  ImageNet 预训练 → 冻结特征 → 训练分类头
  代表: VGG, ResNet 特征 + SVM/MLP

时代 2: 微调 (2018-2022)
  预训练模型 → 全参微调 → 适配下游任务
  代表: BERT fine-tuning, GPT fine-tuning

时代 3: 参数高效微调 (2022-2026)
  预训练模型 → 冻结主体 + 轻量适配器 → 适配下游任务
  代表: LoRA, QLoRA, Adapter, Prefix Tuning
```

---

## 2. 核心概念 (Core Concepts)

### 2.1 迁移学习分类

```
迁移学习
├── 归纳迁移学习 (Inductive)
│   ├── 源任务和目标任务相同，但数据分布不同
│   └── 例: ImageNet → 医学图像分类
│
├── 直推迁移学习 (Transductive)
│   ├── 源任务和目标任务相同，但域不同
│   └── 例: 英文情感分析 → 中文情感分析
│
└── 无监督迁移学习 (Unsupervised)
    ├── 源任务和目标任务都无标签
    └── 例: 自监督预训练 → 下游任务
```

### 2.2 特征迁移 vs 参数迁移

| 迁移类型 | 方法 | 优势 | 劣势 |
|---------|------|------|------|
| **特征迁移** | 使用预训练模型提取特征 | 简单、快速 | 可能丢失任务特定信息 |
| **参数迁移** | 加载预训练权重并微调 | 更好的性能适配 | 需要更多计算资源 |
| **知识蒸馏** | 教师模型指导学生模型 | 模型压缩 | 可能损失精度 |

### 2.3 预训练-微调范式

```
阶段 1: 预训练 (Pre-training)
  目标: 学习通用表示
  数据: 大规模无标注数据
  任务: 自监督任务 (MLM, CLM, MAE, etc.)

  例:
  - BERT: 掩码语言模型 (MLM) + 下一句预测 (NSP)
  - GPT: 因果语言模型 (CLM)
  - ViT: 掩码图像建模 (MAE) 或 对比学习 (DINO)

阶段 2: 微调 (Fine-tuning)
  目标: 适配特定任务
  数据: 任务特定标注数据
  任务: 下游任务 (分类, QA, 生成, etc.)

  微调策略:
  - 全参微调: 更新所有参数
  - 冻结微调: 冻结底层，只训练顶层
  - 参数高效微调: 只训练少量新增参数
```

---

## 3. 计算机视觉中的迁移学习

### 3.1 经典迁移学习流程

```python
import torch
import torchvision.models as models

# 1. 加载预训练模型
model = models.resnet50(weights="IMAGENET1K_V2")

# 2. 冻结所有层
for param in model.parameters():
    param.requires_grad = False

# 3. 替换分类头
num_classes = 10  # 你的任务类别数
model.fc = torch.nn.Linear(model.fc.in_features, num_classes)

# 4. 只训练分类头
optimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-3)
```

### 3.2 CV 迁移学习策略

| 数据量 | 与预训练数据相似度 | 推荐策略 |
|--------|-------------------|---------|
| **小** | 高 | 冻结特征提取，只训练分类头 |
| **小** | 低 | 冻结底层，微调高层 + 数据增强 |
| **大** | 高 | 全参微调，小学习率 |
| **大** | 低 | 全参微调，底层更小学习率 |

### 3.3 视觉基础模型

```
2026 年主流视觉基础模型:
├── DINOv2 (Meta): 自监督视觉特征，零样本能力强
├── SAM 2 (Meta): 通用分割模型，可提示分割
├── CLIP (OpenAI): 图文对齐，零样本分类
├── SigLIP (Google): 改进的图文对齐
└── InternVL (上海AI Lab): 中文多模态基础模型
```

---

## 4. NLP 中的迁移学习

### 4.1 语言模型预训练

```
BERT 式 (Encoder-only):
  预训练: MLM + NSP
  微调: 添加任务特定头
  适用: 分类、NER、QA、句子相似度

GPT 式 (Decoder-only):
  预训练: CLM (下一个 token 预测)
  微调: 指令微调 + RLHF
  适用: 文本生成、对话、推理

T5 式 (Encoder-Decoder):
  预训练: span corruption
  微调: 文本到文本格式
  适用: 翻译、摘要、QA
```

### 4.2 NLP 迁移学习演进

```
2018: ELMo → 上下文词向量
2018: BERT → 预训练 + 微调范式
2019: GPT-2 → 零样本能力初现
2020: GPT-3 → In-context Learning
2022: ChatGPT → 指令微调 + RLHF
2023: GPT-4 → 多模态 + 推理
2024-2026: 开源 LLM → LoRA/QLoRA 微调民主化
```

---

## 5. 参数高效微调 (PEFT)

详见 [[05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques]] 获取完整 PEFT 方法对比。

### 5.1 主流 PEFT 方法

| 方法 | 原理 | 可训练参数占比 | 性能 |
|------|------|---------------|------|
| **LoRA** | 低秩分解权重更新 | 0.1%-1% | 接近全参微调 |
| **QLoRA** | 量化 + LoRA | 0.1%-1% | 略低于 LoRA |
| **Adapter** | 插入适配器层 | 1%-5% | 接近全参微调 |
| **Prefix Tuning** | 学习前缀向量 | 0.1%-1% | 接近全参微调 |
| **Prompt Tuning** | 学习软提示 | <0.01% | 大模型上好 |
| **IA3** | 缩放激活值 | <0.01% | 大模型上好 |

### 5.2 PEFT 选型指南

```
你的场景是什么？
├── 资源充足 + 追求最佳性能 → 全参微调
├── 单 GPU + 中等数据 → LoRA (rank=16-64)
├── 消费级 GPU + 大模型 → QLoRA (4-bit 量化 + LoRA)
├── 多任务部署 → Adapter 或 LoRA (可热切换)
└── 极低资源 → Prefix Tuning 或 Prompt Tuning
```

---

## 6. 域适应 (Domain Adaptation)

### 6.1 域适应的挑战

```
源域 (Source Domain): 训练数据的分布
目标域 (Target Domain): 实际应用数据的分布

问题: 源域和目标域分布不同 → 模型性能下降

例:
  源域: 清晰的自然图像
  目标域: 医学 X 光片

  直接迁移 → 性能大幅下降
```

### 6.2 域适应方法

| 方法 | 原理 | 适用场景 |
|------|------|---------|
| **对抗域适应** | 训练域判别器，学习域不变特征 | 有大量无标注目标数据 |
| **最大均值差异 (MMD)** | 最小化源域和目标域的分布距离 | 特征对齐 |
| **自训练** | 用伪标签训练目标域数据 | 半监督场景 |
| **数据增强** | 模拟目标域特征 | 简单有效 |

---

## 7. 迁移学习的理论基础

### 7.1 何时迁移有效？

```
Ben-David 域适应理论:

目标域误差 ≤ 源域误差 + 域距离 + 最小联合误差

要使迁移有效:
  1. 源域误差要小 (源任务学得好)
  2. 域距离要小 (源域和目标域相似)
  3. 最小联合误差要小 (存在好的共享表示)
```

### 7.2 负迁移 (Negative Transfer)

当源域和目标域差异太大时，迁移反而会降低性能。

```
负迁移的例子:
  - 用自然语言模型迁移到代码生成 (早期)
  - 用西方医学数据迁移到中医诊断
  - 用城市驾驶数据迁移到越野驾驶

避免负迁移:
  - 评估域相似度
  - 选择合适的源域
  - 使用域适应技术
  - 监控迁移后的性能
```

---

## 8. 2026 前沿进展

### 8.1 基础模型迁移

```
2026 年的迁移学习已经进化为"基础模型 + 适配"范式:

基础模型 (Foundation Model)
  ├── 通用知识 (预训练)
  ├── 指令遵循 (SFT)
  └── 人类偏好 (RLHF/DPO)

适配 (Adaptation)
  ├── 任务特定微调 (LoRA/QLoRA)
  ├── 上下文学习 (In-context Learning)
  ├── 检索增强 (RAG)
  └── 工具使用 (Function Calling)
```

### 8.2 跨模态迁移

```
文本知识 → 视觉任务:
  - LLaVA: 用 LLM 理解图像
  - GPT-4V: 多模态推理

视觉知识 → 文本任务:
  - DINOv2 特征用于文本检索
  - 视觉 grounding 用于 QA
```

### 8.3 持续学习与迁移

```
挑战: 模型在学习新任务时遗忘旧任务 (灾难性遗忘)

解决方案:
  - 弹性权重巩固 (EWC): 保护重要参数
  - 渐进式网络: 为新任务添加新模块
  - 回放机制: 混合新旧数据训练
  - LoRA 热切换: 为不同任务加载不同 LoRA
```

---

## 9. 工程实践 (Engineering Practice)

### 9.1 迁移学习最佳实践

```
1. 选择合适的预训练模型
   - 任务相似度高的预训练模型
   - 数据量充足的大模型
   - 社区验证过的模型

2. 决定微调策略
   - 数据量 < 1K: 冻结 + 分类头
   - 数据量 1K-100K: LoRA/Adapter
   - 数据量 > 100K: 全参微调

3. 学习率设置
   - 预训练层: 1e-5 ~ 5e-5
   - 新增层: 1e-4 ~ 1e-3
   - 使用学习率预热 + 衰减

4. 监控过拟合
   - 验证集性能
   - 早停策略
   - 正则化 (dropout, weight decay)

5. 评估迁移效果
   - 对比从零训练的基线
   - 分析不同层的迁移贡献
   - 检查注意力模式变化
```

---

## 10. 生产环境 checklist

```
□ 明确任务与预训练任务的相似度
□ 选择经过生产验证的预训练模型与版本
□ 划分训练/验证/测试集，防止数据泄漏
□ 根据数据量与算力选择微调策略
□ 固定随机种子，保证实验可复现
□ 记录超参数、数据版本、模型 checkpoint
□ 监控训练/验证损失、过拟合、灾难性遗忘
□ 评估下游指标，并与从零训练基线对比
□ 部署前进行模型压缩/量化/蒸馏（如需要）
□ 建立模型版本管理与回滚机制
```

---

## 相关阅读

- [[03_Deep_Learning/Neural_Network_Core/Neural_Network_Core]] — 神经网络核心
- [[05_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques]] — 微调技术
- [[05_NLP_LLMs/LLM_Training_Deep_Dive]] — LLM 训练深度解析
- [[04_Computer_Vision/Multimodal_Vision/CLIP_Deep_Dive]] — CLIP 对比学习
- [[07_Model_Training/Alignment/TRL_RLHF_DPO_Guide]] — 对齐训练
- [[03_Deep_Learning/Self_Supervised_Learning/Self_Supervised_Learning_Deep_Dive]] — 自监督学习
