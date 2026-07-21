---
title: 知识蒸馏 (Knowledge Distillation)
category: 03-deep-learning
tags: ["knowledge-distillation", "teacher-student", "model-compression"]
summary: "知识蒸馏子目录：将大模型知识迁移到小模型。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 知识蒸馏 (Knowledge Distillation)

## 内容索引

| 主题 | 难度 | 文档链接 |
|------|------|---------|
| 知识蒸馏总论 | 进阶 | [Knowledge_Distillation.md](./Knowledge_Distillation.md) |

## 核心方法

- **Hinton KD**: 软标签 + 温度缩放
- **特征蒸馏**: 中间层表示对齐
- **关系蒸馏**: 样本间关系结构迁移
- **自蒸馏**: EMA 教师 / 深层→浅层
- **LLM 蒸馏**: 思维链蒸馏 / 数据蒸馏
- **在线互蒸馏**: 多模型协同训练

## 相关文档

- [[深度学习/README|深度学习总览]]
- [[部署推理/Model_Compression/|模型压缩]]
- [[大模型/Reasoning_Models/|推理模型]]
