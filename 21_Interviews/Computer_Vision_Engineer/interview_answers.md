---
title: Computer Vision Engineer 面试题实例答案
category: 23-interviews-computer-vision-engineer
tags: ["interviews", "career", "experience", "practitioners", "computer-vision"]
summary: "**答**：优先增强数据与标注质量，使用更高分辨率输入或多尺度训练；模型层可引入 FPN、注意力与更合适的 anchor 配置；评测上使用分尺度 mAP 监控变化。"
created: 2026-05-31
updated: 2026-05-31
---

# Computer Vision Engineer 面试题实例答案

## Q1: 小目标检测效果差如何改进？
**答**：优先增强数据与标注质量，使用更高分辨率输入或多尺度训练；模型层可引入 FPN、注意力与更合适的 anchor 配置；评测上使用分尺度 mAP 监控变化。

## Q2: 如何处理类别不平衡？
**答**：采用重采样、类别权重或 Focal Loss；同时补充难样本与数据增强，并用分布一致的评测集验证改善效果。

## Q3: 线上延迟超标怎么办？
**答**：从模型压缩（量化/剪枝）、硬件加速与 batch 策略入手；系统层优化 I/O 与并发策略；必要时做端云协同与模型分级。

---
*Last updated: 2026-02-26*

## Related

- [[21_Interviews/Computer_Vision_Engineer/company_level_question_bank]] — Computer Vision Engineer 按公司/级别区分的题库 (共享: career, computer-vision, experience, interviews, practitione)
- [[21_Interviews/Computer_Vision_Engineer/interview_preparing]] — Computer Vision Engineer 面试准备 (共享: career, computer-vision, experience, interviews, practitione)
- [[21_Interviews/Computer_Vision_Engineer/question_bank]] — Computer Vision Engineer 题库 (共享: career, computer-vision, experience, interviews, practitione)
- [[21_Interviews/AI_Data_Analyst/company_level_question_bank]] — AI Data Analyst 按公司/级别区分的题库 (共享: career, experience, interviews, practitioners)
- [[21_Interviews/Machine_Learning_Engineer/interview_answers.md|interview_answers]]
