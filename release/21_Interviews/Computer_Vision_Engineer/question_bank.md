---
title: Computer Vision Engineer 题库
category: 21-interviews-computer-vision-engineer
tags: ["interviews", "career", "computer-vision", "cnn", "vit", "detection", "segmentation"]
summary: "Computer Vision Engineer 面试题库，覆盖 CNN/ViT 基础、检测/分割、3D 视觉、部署优化，含难度与频率标注。"
created: 2026-05-31
updated: 2026-06-04
tier: supporting
---

# Computer Vision Engineer 题库

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced

## CNN/ViT 基础 (6 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | CNN 与 ViT 的主要差异？各自优劣势？ | ⭐ | 🔴 |
| 2 | ResNet 的残差连接解决了什么问题？ | ⭐ | 🔴 |
| 3 | 解释 Batch Normalization 的原理和推理时的处理 | ⭐ | 🔴 |
| 4 | 常见数据增强方法？MixUp/CutMix/Mosaic 的原理 | ⭐⭐ | 🟡 |
| 5 | ViT 的 Patch Embedding 和位置编码？ | ⭐⭐ | 🟡 |
| 6 | MAE/DINOv2 等自监督视觉预训练方法？ | ⭐⭐⭐ | 🟡 |

## 检测与分割 (6 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 解释 mAP、IoU 与 F1 的关系 | ⭐ | 🔴 |
| 2 | YOLO 系列的演进：v1→v8 的核心改进 | ⭐⭐ | 🔴 |
| 3 | U-Net 架构为什么适合分割？跳跃连接的作用 | ⭐⭐ | 🔴 |
| 4 | 小目标检测效果差如何改进？ | ⭐⭐ | 🟡 |
| 5 | 如何处理类别不平衡问题？Focal Loss 的原理 | ⭐⭐ | 🟡 |
| 6 | 实例分割 vs 语义分割 vs 全景分割的区别？ | ⭐⭐ | 🟡 |

## 部署与优化 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 端侧推理优化方案？TensorRT/Core ML/TFLite | ⭐⭐ | 🔴 |
| 2 | 模型量化与剪枝的取舍？ | ⭐⭐ | 🟡 |
| 3 | 如何进行多模型版本管理和 A/B 测试？ | ⭐⭐ | 🟡 |
| 4 | 线上延迟超标如何优化？(算子融合/半精度/批处理) | ⭐⭐ | 🟡 |
| 5 | ONNX 模型导出和跨平台部署的注意事项？ | ⭐⭐ | 🟢 |

## 行为面试 (3 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 描述一个检测/分割项目的完整流程和遇到的挑战 | ⭐⭐ | 🔴 |
| 2 | 标签噪声导致性能下降如何修复？ | ⭐⭐ | 🟡 |
| 3 | 如何在精度和速度之间做工程权衡？ | ⭐⭐ | 🟡 |

---

## Related

- [[21_Interviews/Computer_Vision_Engineer/company_level_question_bank|CV Engineer 按公司/级别区分的题库]]
- [[21_Interviews/Computer_Vision_Engineer/interview_answers|CV Engineer 面试题实例答案]]
- [[21_Interviews/Computer_Vision_Engineer/interview_preparing|CV Engineer 面试准备]]
- [[21_Interviews/README|AI 面试准备 (Interviews)]]
---
title: Computer Vision Engineer 题库
category: 21-interviews-computer-vision-engineer
tags: ["interviews", "career", "experience", "practitioners", "computer-vision"]
summary: "CNN 与 ViT 的主要差异是什么？"
created: 2026-05-31
updated: 2026-06-04
tier: supporting
aliases:
  - "Question Bank"
  - "question bank"
  - question_bank

---
# Computer Vision Engineer 题库

## 基础
- CNN 与 ViT 的主要差异是什么？
- 解释 mAP、IoU 与 F1 的关系。
- 常见数据增强方法有哪些？

## 项目
- 描述一个检测/分割项目的完整流程。
- 如何处理类别不平衡问题？
- 如何设计训练与验证的划分策略？

## 系统设计
- 设计一个端侧推理优化方案。
- 模型量化与剪枝的取舍是什么？
- 如何进行多模型版本管理？

## 案例
- 标签噪声导致性能下降如何修复？
- 线上延迟超标如何优化？
- 小目标检测效果差如何改进？

---
*Last updated: 2026-06-04*

## Related

- [[21_Interviews/Computer_Vision_Engineer/company_level_question_bank|Computer Vision Engineer 按公司/级别区分的题库]]
- [[21_Interviews/Computer_Vision_Engineer/interview_answers|Computer Vision Engineer 面试题实例答案]]
- [[21_Interviews/Computer_Vision_Engineer/interview_preparing|Computer Vision Engineer 面试准备]]
- [[21_Interviews/README|AI 面试准备 (Interviews)]]
- [[21_Interviews/jobs|AI 相关岗位与工种清单]]
