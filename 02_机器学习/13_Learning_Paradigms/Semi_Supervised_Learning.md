---
title: 半监督学习 (Semi-Supervised Learning)
category: 02-machine-learning
tags: ["semi-supervised", "pseudo-label", "contrastive-learning", "self-training", "ssl"]
summary: "半监督学习核心方法：自训练、伪标签、一致性正则化、对比学习、MixMatch/FixMatch，以及在 LLM 数据标注和少样本场景中的 2026 实践。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "半监督学习"
---
# 半监督学习 (Semi-Supervised Learning)

> 中文简称：半监督学习

## 1. 为什么需要半监督学习？

### 1.1 标注瓶颈

```
现实困境:
- 标注数据昂贵: 医疗影像标注 ~$50/张
- 标注耗时: 法律文档分类 ~10min/篇
- 专家稀缺: 罕见病诊断需要主任医师
- 数据量大: 互联网数据 PB 级，标注覆盖率 <1%

半监督学习: 用少量标注 + 大量未标注数据
  标注数据: 100-10,000 条 (有标签)
  未标注数据: 100,000-10,000,000 条 (无标签)
  目标: 接近全监督性能，标注成本降低 10-100×
```

### 1.2 核心假设

| 假设 | 含义 | 对应方法 |
|------|------|----------|
| 平滑假设 | 相近的点标签相同 | 标签传播 |
| 聚类假设 | 同一簇内标签一致 | 伪标签/自训练 |
| 流形假设 | 数据在低维流形上 | 流形正则化 |
| 低密度分离 | 决策边界在低密度区 | 一致性正则 |

## 2. 自训练 (Self-Training)

### 2.1 基本流程

```python
import numpy as np
from sklearn.base import BaseEstimator

def self_training(model, X_labeled, y_labeled, X_unlabeled, 
                  threshold=0.95, max_rounds=10):
    """
    自训练: 用高置信度预测作为伪标签
    """
    X_train = X_labeled.copy()
    y_train = y_labeled.copy()
    X_pool = X_unlabeled.copy()
    
    for round_idx in range(max_rounds):
        # 1. 用当前模型预测未标注数据
        model.fit(X_train, y_train)
        proba = model.predict_proba(X_pool)
        max_proba = proba.max(axis=1)
        pseudo_labels = proba.argmax(axis=1)
        
        # 2. 选择高置信度样本
        confident_mask = max_proba >= threshold
        if confident_mask.sum() == 0:
            threshold -= 0.05  # 逐步降低阈值
            continue
        
        # 3. 加入训练集
        X_train = np.vstack([X_train, X_pool[confident_mask]])
        y_train = np.concatenate([y_train, pseudo_labels[confident_mask]])
        X_pool = X_pool[~confident_mask]
        
        print(f"Round {round_idx}: 新增 {confident_mask.sum()} 伪标签, "
              f"剩余 {len(X_pool)} 未标注")
        
        if len(X_pool) == 0:
            break
    
    return model
```

### 2.2 确认偏差 (Confirmation Bias)

```
自训练的核心风险:
- 模型错误预测 → 被当作"正确标签" → 强化错误
- 错误累积: 每轮都可能引入噪声
- 类别不平衡: 多数类更容易被高置信度选中

缓解策略:
1. 高阈值 (≥0.95) + 逐步降低
2. 每类固定配额 (平衡伪标签)
3. 多模型投票 (集成自训练)
4. 定期用真实标注验证
```

## 3. 一致性正则化 (Consistency Regularization)

### 3.1 核心思想

```
对同一输入施加不同扰动，模型输出应一致:
  f(x) ≈ f(augment(x))

扰动方式:
- 数据增强: 翻转/裁剪/颜色抖动
- Dropout: 随机丢弃神经元
- 噪声注入: 高斯噪声
- Cutout/Mixup: 遮挡/混合
```

### 3.2 FixMatch (2020, Google)

```python
import torch
import torch.nn.functional as F

def fixmatch_loss(model, x_labeled, y_labeled, x_unlabeled, 
                  threshold=0.95, lambda_u=1.0):
    """
    FixMatch: 弱增强生成伪标签 + 强增强一致性
    """
    # 有标签损失
    logits_l = model(x_labeled)
    loss_l = F.cross_entropy(logits_l, y_labeled)
    
    # 无标签: 弱增强 → 伪标签
    with torch.no_grad():
        logits_weak = model(weak_augment(x_unlabeled))
        proba = F.softmax(logits_weak, dim=-1)
        max_proba, pseudo_label = proba.max(dim=-1)
        mask = max_proba >= threshold  # 高置信度筛选
    
    # 无标签: 强增强 → 一致性
    logits_strong = model(strong_augment(x_unlabeled))
    loss_u = (F.cross_entropy(logits_strong, pseudo_label, reduction='none') 
              * mask.float()).mean()
    
    return loss_l + lambda_u * loss_u

# 弱增强: 随机翻转 + 平移
# 强增强: RandAugment (多种增强组合)
```

### 3.3 方法演进

| 方法 | 年份 | 核心创新 | 10% 标签 CIFAR-10 |
|------|------|----------|-------------------|
| Π-Model | 2017 | 两次 Dropout 一致性 | ~78% |
| Mean Teacher | 2017 | EMA 教师模型 | ~80% |
| MixMatch | 2019 |  holistic 半监督 | ~89% |
| ReMixMatch | 2020 | 分布对齐 + 增强 | ~95% |
| FixMatch | 2020 | 弱→强 + 阈值筛选 | ~95% |
| FlexMatch | 2021 | 自适应阈值 | ~96% |
| SoftMatch | 2023 | 软阈值 + 截断 | ~97% |

## 4. 对比学习 (Contrastive Learning)

### 4.1 自监督预训练

```python
# SimCLR 框架: 学习通用表示
# 正样本对: 同一图片的两种增强
# 负样本对: 不同图片

def simclr_loss(z_i, z_j, temperature=0.5):
    """
    NT-Xent 对比损失
    z_i, z_j: 同一 batch 中每个样本的两个增强视图的表示
    """
    batch_size = z_i.shape[0]
    z = torch.cat([z_i, z_j], dim=0)  # [2B, d]
    z = F.normalize(z, dim=1)
    
    # 相似度矩阵
    sim = torch.mm(z, z.t()) / temperature  # [2B, 2B]
    
    # 正样本: (i, i+B) 和 (i+B, i)
    # 负样本: 所有其他
    labels = torch.cat([
        torch.arange(batch_size, 2*batch_size),
        torch.arange(0, batch_size)
    ])
    
    # 去掉自身相似度
    mask = ~torch.eye(2*batch_size, dtype=bool)
    sim = sim[mask].reshape(2*batch_size, -1)
    labels = labels - (labels > torch.arange(2*batch_size)).long()
    
    return F.cross_entropy(sim, labels)
```

### 4.2 半监督对比学习

```
流程:
1. 自监督预训练: 对比学习学习通用表示 (无需标签)
2. 半监督微调: 少量标注数据微调分类头
3. 伪标签扩展: 用微调模型给未标注数据打标签
4. 联合训练: 标注 + 伪标签一起训练

2026 实践:
- LLM 预训练本身就是最大的"自监督学习"
- 少样本微调 = 半监督学习的极端情况
- 对比学习用于 Embedding 模型训练 (RAG 检索)
```

## 5. 标签传播与图半监督

### 5.1 标签传播算法

```python
from sklearn.semi_supervised import LabelPropagation, LabelSpreading

# 构建相似度图 → 标签沿图传播
lp = LabelSpreading(kernel='rbf', gamma=20, alpha=0.8)
lp.fit(X_all, y_all)  # y_all 中未标注为 -1

# 原理:
# 1. 构建 k-NN 图或 RBF 核图
# 2. 已标注节点的标签沿边传播
# 3. 迭代直到收敛
# 4. 未标注节点获得传播来的标签
```

## 6. 2026 实践：LLM 时代的半监督

### 6.1 LLM 作为标注器

```python
# 用 LLM 生成伪标签 (现代版自训练)
def llm_pseudo_labeling(texts, model="gpt-4o", few_shot_examples=None):
    """
    用 LLM 给未标注数据打标签
    """
    prompt = f"""你是一个文本分类专家。
    
类别: [正面, 负面, 中性]

{f'示例: {few_shot_examples}' if few_shot_examples else ''}

请对以下文本进行分类，只输出类别名:
文本: "{text}"
类别: """
    
    # 批量调用 LLM
    labels = [call_llm(prompt.format(text=t)) for t in texts]
    
    # 置信度筛选: 多次采样取一致性
    confident_labels = []
    for text in texts:
        samples = [call_llm(prompt.format(text=text)) for _ in range(5)]
        majority = max(set(samples), key=samples.count)
        confidence = samples.count(majority) / 5
        if confidence >= 0.8:
            confident_labels.append(majority)
        else:
            confident_labels.append(None)  # 不确定，跳过
    
    return confident_labels
```

### 6.2 主动学习 + 半监督

```python
# 主动学习: 选择最有价值的样本去标注
# 半监督: 用未标注数据提升模型

# 组合策略:
# 1. 初始: 标注 100 条 → 训练初始模型
# 2. 主动选择: 模型最不确定的 50 条 → 人工标注
# 3. 半监督: 高置信度预测 → 伪标签
# 4. 重复 2-3 直到预算用完

# 不确定性采样策略:
# - 最小置信度: 选 max_proba 最小的
# - 熵: 选预测分布最均匀的
# - 委员会分歧: 多模型预测不一致的
```

## 7. 方法选择指南

```
数据情况 → 推荐方法:
├── 标注极少 (<100) + 大量未标注
│   └── 对比学习预训练 + FixMatch
├── 标注少 (100-1000) + 中等未标注
│   └── FixMatch / FlexMatch
├── 图结构数据 (社交网络/知识图谱)
│   └── 标签传播 / GNN 半监督
├── 文本/NLP 数据
│   └── LLM 伪标签 + 自训练
└── 标注预算有限
    └── 主动学习 + 半监督组合
```

## 相关文档

- [[02_机器学习/02_Supervised_Learning/Supervised_Learning|监督学习]]
- [[02_机器学习/03_Unsupervised_Learning/Unsupervised_Learning|无监督学习]]
- [[03_深度学习/06_Self_Supervised_Learning/|自监督学习]]
- [[05_大模型/07_Fine_tuning_Techniques/|微调技术]] — 少样本学习
- [[08_模型评估/02_Benchmarks/index|评估数据集]] — 标注质量
