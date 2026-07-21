---
title: 半监督学习 (Semi-Supervised Learning)
category: 02-machine-learning
tags: ["semi-supervised", "pseudo-label", "contrastive-learning"]
summary: "半监督学习子目录：利用少量标注数据和大量未标注数据提升模型性能。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 半监督学习 (Semi-Supervised Learning)

## 内容索引

| 主题 | 难度 | 文档链接 |
|------|------|---------|
| 半监督学习总论 | 进阶 | [Semi_Supervised_Learning.md](./Semi_Supervised_Learning.md) |

## 核心方法

- **自训练 (Self-Training)**: 高置信度预测作为伪标签
- **一致性正则化**: FixMatch/FlexMatch/SoftMatch
- **对比学习**: SimCLR/MoCo/BYOL 自监督预训练
- **标签传播**: 图结构上的标签扩散
- **LLM 伪标注**: 2026 大模型辅助标注

## 相关文档

- [[机器学习/README|机器学习总览]]
- [[深度学习/Self_Supervised_Learning/|自监督学习]]
