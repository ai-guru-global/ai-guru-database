---
title: 度量学习 (Metric Learning)
category: 02-machine-learning
tags: ["metric-learning", "siamese", "triplet-loss", "contrastive", "embedding"]
summary: "度量学习核心方法：Siamese 网络、Triplet Loss、对比损失、ArcFace/CosFace，以及在人脸识别、检索、少样本学习和 RAG Embedding 中的应用。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "度量学习"
---
# 度量学习 (Metric Learning)

> 中文简称：度量学习

## 1. 核心思想

### 1.1 什么是度量学习？

```
传统分类: 学习 "输入 → 类别" 的映射
度量学习: 学习 "输入 → 嵌入空间" 的映射
         使得: 相似样本距离近，不相似样本距离远

核心: 学习一个距离函数 d(x₁, x₂)
- 同类: d(x₁, x₂) 小
- 异类: d(x₁, x₂) 大

嵌入空间中的几何:
  同类样本 → 聚成簇
  异类样本 → 簇间距离大
```

### 1.2 为什么重要？

| 应用 | 度量学习的角色 |
|------|---------------|
| 人脸识别 | 同一人距离 < 不同人距离 |
| 图像检索 | 相似图片在嵌入空间中接近 |
| 少样本学习 | 新类别只需几个样本定义"中心" |
| RAG 检索 | 语义相似的文档向量接近 |
| 推荐系统 | 用户-物品相似度计算 |
| 异常检测 | 正常样本聚集，异常远离 |
| 聚类 | 好的嵌入 → 好的聚类 |

## 2. 损失函数

### 2.1 对比损失 (Contrastive Loss)

```python
import torch
import torch.nn.functional as F

def contrastive_loss(anchor, positive, negative, margin=1.0):
    """
    对比损失: 拉近正对，推远负对
    anchor, positive: 同类样本对
    negative: 异类样本
    """
    d_pos = F.pairwise_distance(anchor, positive)
    d_neg = F.pairwise_distance(anchor, negative)
    
    # 正对: 距离越小越好
    loss_pos = d_pos.pow(2)
    # 负对: 距离大于 margin 即可
    loss_neg = F.relu(margin - d_neg).pow(2)
    
    return (loss_pos + loss_neg).mean()
```

### 2.2 三元组损失 (Triplet Loss)

```python
def triplet_loss(anchor, positive, negative, margin=0.3):
    """
    Triplet Loss: FaceNet 核心
    要求: d(a,p) + margin < d(a,n)
    """
    d_pos = F.pairwise_distance(anchor, positive)
    d_neg = F.pairwise_distance(anchor, negative)
    
    loss = F.relu(d_pos - d_neg + margin)
    return loss.mean()

# 难负样本挖掘 (Hard Negative Mining):
# 选择 "最难的负样本" — 离 anchor 最近的异类
# 选择 "最难的正样本" — 离 anchor 最远的同类
def hard_negative_mining(anchor, positives, negatives):
    """选择最难的三元组"""
    d_pos = torch.cdist(anchor, positives)
    d_neg = torch.cdist(anchor, negatives)
    
    # 最难正样本: 距离最大的同类
    hardest_pos = d_pos.max(dim=1).indices
    # 最难负样本: 距离最小的异类
    hardest_neg = d_neg.min(dim=1).indices
    
    return hardest_pos, hardest_neg
```

### 2.3 N-Pair 损失与 InfoNCE

```python
def info_nce_loss(anchor, positives, negatives, temperature=0.07):
    """
    InfoNCE: 对比学习标准损失 (SimCLR/CPC)
    1个正样本 vs N-1个负样本
    """
    # 正对相似度
    pos_sim = F.cosine_similarity(anchor, positives) / temperature
    
    # 负对相似度
    neg_sim = torch.mm(anchor, negatives.t()) / temperature
    
    # logits: [正对, 负对1, 负对2, ...]
    logits = torch.cat([pos_sim.unsqueeze(1), neg_sim], dim=1)
    
    # 标签: 正对在第0位
    labels = torch.zeros(anchor.size(0), dtype=torch.long)
    
    return F.cross_entropy(logits, labels)
```

### 2.4 角度边距损失 (ArcFace/CosFace)

```python
import math

class ArcFaceLoss(torch.nn.Module):
    """
    ArcFace: 人脸识别 SOTA 损失
    在角度空间加入边距，增强类间分离
    """
    def __init__(self, embedding_dim, num_classes, s=64.0, m=0.5):
        super().__init__()
        self.s = s  # 缩放因子
        self.m = m  # 角度边距
        self.W = torch.nn.Parameter(torch.randn(num_classes, embedding_dim))
    
    def forward(self, embeddings, labels):
        # 归一化
        embeddings = F.normalize(embeddings)
        W = F.normalize(self.W)
        
        # cos(θ)
        cos_theta = torch.mm(embeddings, W.t())
        
        # 对目标类加入角度边距: cos(θ + m)
        theta = torch.acos(cos_theta.clamp(-1+1e-7, 1-1e-7))
        target_logits = torch.cos(theta[range(len(labels)), labels] + self.m)
        
        cos_theta[range(len(labels)), labels] = target_logits
        
        return F.cross_entropy(self.s * cos_theta, labels)
```

## 3. 网络架构

### 3.1 Siamese 网络

```python
class SiameseNetwork(torch.nn.Module):
    """
    孪生网络: 共享权重的双塔结构
    输入: 两个样本 → 共享编码器 → 距离计算
    """
    def __init__(self, encoder):
        super().__init__()
        self.encoder = encoder  # 共享权重!
    
    def forward(self, x1, x2):
        z1 = self.encoder(x1)
        z2 = self.encoder(x2)
        distance = F.pairwise_distance(z1, z2)
        return distance
    
    def predict_similarity(self, x1, x2):
        """推理: 计算相似度"""
        with torch.no_grad():
            z1 = F.normalize(self.encoder(x1))
            z2 = F.normalize(self.encoder(x2))
            return F.cosine_similarity(z1, z2)
```

### 3.2 双塔模型 (Two-Tower)

```python
class TwoTowerModel(torch.nn.Module):
    """
    双塔模型: 检索/推荐标准架构
    Query Tower + Item Tower → 内积/余弦相似度
    """
    def __init__(self, query_encoder, item_encoder, dim=128):
        super().__init__()
        self.query_encoder = query_encoder
        self.item_encoder = item_encoder
        self.projection = torch.nn.Linear(dim, dim)
    
    def encode_query(self, query):
        return F.normalize(self.projection(self.query_encoder(query)))
    
    def encode_item(self, item):
        return F.normalize(self.projection(self.item_encoder(item)))
    
    def forward(self, query, item):
        q = self.encode_query(query)
        i = self.encode_item(item)
        return (q * i).sum(dim=-1)  # 内积相似度
```

## 4. 应用场景

### 4.1 少样本学习 (Few-Shot)

```python
# 原型网络 (Prototypical Networks):
# 每个类别的"原型" = 该类样本嵌入的均值
# 分类 = 找最近的原型

def prototypical_classification(support_embeddings, support_labels, 
                                 query_embedding):
    """
    support: 每类 k 个样本 (k-shot)
    query: 待分类样本
    """
    # 计算每类原型
    classes = support_labels.unique()
    prototypes = []
    for c in classes:
        mask = support_labels == c
        prototype = support_embeddings[mask].mean(dim=0)
        prototypes.append(prototype)
    prototypes = torch.stack(prototypes)
    
    # 计算到各原型的距离
    distances = torch.cdist(query_embedding.unsqueeze(0), prototypes)
    
    # 最近原型 = 预测类别
    predicted_class = distances.argmin(dim=1)
    return classes[predicted_class]
```

### 4.2 RAG Embedding 模型

```python
# 2026 RAG 检索中的度量学习:
# Embedding 模型本质上是度量学习:
# - 训练: 对比学习 (query, positive_doc, negative_docs)
# - 推理: 余弦相似度检索

# 训练数据构造:
# 正对: (query, 相关文档)
# 负对: (query, 不相关文档)
# 难负样本: BM25 高分但不相关的文档

# 评估指标:
# - Recall@K: Top-K 中命中相关文档的比例
# - MRR: 第一个相关文档的排名倒数
# - NDCG: 考虑排名位置的检索质量
```

## 5. 评估指标

| 指标 | 含义 | 适用场景 |
|------|------|----------|
| Recall@K | Top-K 命中率 | 检索 |
| mAP | 平均精度均值 | 检索/排序 |
| Rank-1 | 第一个匹配正确率 | 人脸识别 |
| AUC | ROC 曲线下面积 | 验证/检索 |
| 类间距离/类内距离比 | 簇分离度 | 通用 |

## 相关文档

- [[02_机器学习/13_Learning_Paradigms/Semi_Supervised_Learning|半监督学习]] — 对比学习
- [[14_RAG系统/02_Embeddings/|Embedding 模型]] — RAG 检索
- [[03_深度学习/06_Self_Supervised_Learning/|自监督学习]] — 表示学习
- [[04_计算机视觉/|计算机视觉]] — 人脸识别/检索
- [[02_机器学习/10_Recommendation_Systems/|推荐系统]] — 相似度计算
