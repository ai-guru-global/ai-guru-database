---
title: 度量学习 (Metric Learning)
category: 02-machine-learning
tags: ["metric-learning", "siamese", "embedding"]
summary: "度量学习子目录：学习样本间的距离/相似度度量。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 度量学习 (Metric Learning)

## 内容索引

| 主题 | 难度 | 文档链接 |
|------|------|---------|
| 度量学习总论 | 进阶 | [Metric_Learning.md](./Metric_Learning.md) |

## 核心方法

- **Siamese 网络**: 共享权重双塔，学习距离函数
- **Triplet Loss**: 锚-正-负三元组，FaceNet 核心
- **InfoNCE**: 对比学习标准损失
- **ArcFace/CosFace**: 角度边距，人脸识别 SOTA
- **原型网络**: 少样本学习的度量方法

## 相关文档

- [[机器学习/README|机器学习总览]]
- [[RAG系统/Embeddings/|Embedding 模型]]
