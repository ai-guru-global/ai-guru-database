---
title: Computer Vision Engineer 面试题实例答案
category: 21-interviews-computer-vision-engineer
tags: ["interviews", "career", "computer-vision", "cnn", "detection", "segmentation"]
summary: "CV Engineer 高频面试题深度参考答案，覆盖 CNN/ViT、检测分割、部署优化和行为面试。"
created: 2026-05-31
updated: 2026-06-04
tier: supporting
sources: []
---

# Computer Vision Engineer 面试题实例答案

> 每个答案采用 **结论 → 展开 → 追问预判** 结构。

---

### Q1: CNN 与 ViT 的主要差异？

**结论**: CNN 用卷积提取局部特征 (平移不变性、局部性)，ViT 用 Self-Attention 建模全局关系。CNN 小数据好，ViT 大数据好。

**展开**:
- **CNN**: 归纳偏置强 (局部性+平移不变)→ 小数据集表现好。计算复杂度 O(n) 线性
- **ViT**: 归纳偏置弱 → 需要大数据预训练。但能捕获全局依赖，注意力可视化好
- **融合趋势**: Swin Transformer (窗口注意力恢复局部性)、ConvNeXt (用 CNN 技巧增强)
- **实际选择**: 移动端/实时 → CNN (YOLO/MobileNet)；精度优先 → ViT (SAM/DINOv2)

**追问预判**: "为什么 YOLO 不用 ViT？"
→ ViT 计算量大、推理慢，实时检测场景 CNN 更适合。但 RT-DETR 已在尝试 Transformer。

### Q2: YOLO 系列的演进？

**结论**: YOLOv1 (单阶段回归) → v3 (多尺度+FPN) → v5 (工程化+数据增强) → v8 (Anchor-free+解耦头) → v10/v11 (注意力+NMS-free)。

**展开**:
- **v1**: 将检测转为回归问题，单次前向预测 bbox+class
- **v3**: 引入 Darknet-53 + FPN 多尺度检测
- **v5**: 工程友好 (PyTorch)、Mosaic 增强、自适应 Anchor
- **v8**: Anchor-free 检测头 + 解耦分类/回归分支 + Task-aligned Assigner
- **最新**: YOLO-World (开放词汇检测)、YOLOv10 (NMS-free 训练)

### Q3: U-Net 架构为什么适合分割？

**结论**: 编码器提取语义特征，解码器恢复空间分辨率，跳跃连接融合低层细节和高层语义，解决"知道是什么但不知道在哪里"的问题。

**展开**:
- **编码器**: 逐步下采样，获取高层语义 (是什么)
- **解码器**: 逐步上采样 (转置卷积/插值)，恢复空间分辨率 (在哪里)
- **跳跃连接**: 拼接编码器同层特征到解码器，补充边缘/纹理等低层信息
- **变体**: U-Net++ (密集跳跃)、nnU-Net (自适应预处理)、Stable Diffusion U-Net

### Q4: 端侧推理优化方案？

**结论**: 模型压缩 (量化/剪枝/蒸馏) + 推理引擎优化 (算子融合/内存复用) + 硬件适配 (NPU/DSP)。

**展开**:
- **量化**: INT8 量化 (TensorRT/ONNX Runtime) 减少 4x 计算
- **架构**: MobileNet (深度可分离卷积)、EfficientNet (NAS 搜索)
- **引擎**: TensorRT (NVIDIA)、Core ML (Apple)、TFLite (Android/嵌入式)
- **实战**: 模型导出 ONNX → TensorRT 优化 → 精度验证 → 部署测试

### Q5: 描述一个检测/分割项目的完整流程 (STAR)

**答案结构**:
- **Situation**: "工厂需要自动检测产品缺陷，缺陷类型多且样本不均衡"
- **Task**: "设计从数据采集到在线部署的完整视觉检测系统"
- **Action**: "①数据采集 + 标注 (含合成数据增强) ②模型选型 (YOLOv8 + 缺陷分类头) ③Focal Loss 解决类别不平衡 ④TensorRT INT8 量化部署 ⑤在线监控 + 误检人工反馈闭环"
- **Result**: "检测准确率 99.2%，推理延迟 < 10ms，产线效率提升 30%"

---

## Related

- [[21_Interviews/Computer_Vision_Engineer/company_level_question_bank|CV Engineer 按公司/级别区分的题库]]
- [[21_Interviews/Computer_Vision_Engineer/interview_preparing|CV Engineer 面试准备]]
- [[21_Interviews/Computer_Vision_Engineer/question_bank|CV Engineer 题库]]
- [[21_Interviews/README|AI 面试准备 (Interviews)]]
---
title: Computer Vision Engineer 面试题实例答案
category: 21-interviews-computer-vision-engineer
tags: ["interviews", "career", "experience", "practitioners", "computer-vision"]
summary: "**答**：优先增强数据与标注质量，使用更高分辨率输入或多尺度训练；模型层可引入 FPN、注意力与更合适的 anchor 配置；评测上使用分尺度 mAP 监控变化。"
created: 2026-05-31
updated: 2026-06-04
tier: supporting
aliases:
  - "Interview Answers"
  - "interview answers"
  - interview_answers

---
# Computer Vision Engineer 面试题实例答案

## Q1: 小目标检测效果差如何改进？
**答**：优先增强数据与标注质量，使用更高分辨率输入或多尺度训练；模型层可引入 FPN、注意力与更合适的 anchor 配置；评测上使用分尺度 mAP 监控变化。

## Q2: 如何处理类别不平衡？
**答**：采用重采样、类别权重或 Focal Loss；同时补充难样本与数据增强，并用分布一致的评测集验证改善效果。

## Q3: 线上延迟超标怎么办？
**答**：从模型压缩（量化/剪枝）、硬件加速与 batch 策略入手；系统层优化 I/O 与并发策略；必要时做端云协同与模型分级。

---
*Last updated: 2026-06-04*

## Related

- [[21_Interviews/Computer_Vision_Engineer/company_level_question_bank|Computer Vision Engineer 按公司/级别区分的题库]]
- [[21_Interviews/Computer_Vision_Engineer/interview_preparing|Computer Vision Engineer 面试准备]]
- [[21_Interviews/Computer_Vision_Engineer/question_bank|Computer Vision Engineer 题库]]
- [[21_Interviews/README|AI 面试准备 (Interviews)]]
- [[21_Interviews/jobs|AI 相关岗位与工种清单]]
