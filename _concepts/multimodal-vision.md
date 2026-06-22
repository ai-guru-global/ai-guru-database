---
title: '多模态视觉'
category: '-concepts'
tags: ["computer-vision", "multimodal", "clip", "llava", "multimodal-models", "blip"]
aliases: [Multimodal Vision, 多模态, 视觉-语言模型, VLM]
relationships:
  - target: "[[_concepts/computer-vision]]"
    type: related_to
  - target: "_concepts/generative-vision-models"
    type: related_to
  - target: "_concepts/ai-agents"
    type: related_to
sources:
  - 05_computer-vision_Vision/Multimodal_Vision/Multimodal_Vision.md
  - 04_Computer_Vision/Multimodal_Vision/CLIP_deep-reinforcement-learning_Dive.md
summary: '多模态视觉连接视觉和语言，CLIP实现零样本分类，LLaVA将视觉注入LLM，开启视觉问答和推理时代。'
provenance:
  extracted: '0.80'
  inferred: '0.15'
  ambiguous: '0.05'
created: 2026-06-12
---

# 多模态视觉

多模态视觉（Multimodal Vision）将视觉信息与语言信息融合理解，让AI同时"看"和"说"。CLIP在4亿图文对上通过对比学习实现零样本分类，LLaVA用线性投影将视觉long-context-models注入LLM，BLIP-2通过Q-Former高效桥接冻结的视觉编码器和语言模型。多模态视觉是AI智能体视觉感知能力的基础。

## 核心要点

- **CLIP**通过对比学习对齐图像和文本到同一语义空间，实现零样本分类和跨模态检索
- **BLIP-2**的Q-Former用32个可学习Query压缩视觉信息，只训练188M参数即可桥接冻结大模型
- **LLaVA**用简单线性投影层将视觉特征映射到llm-infrastructure输入空间，两阶段训练即可获得视觉对话能力
- 多模态融合策略：早期融合（拼接Token）、晚期融合（对比对齐）、交叉注意力（Q-Former）
- 核心挑战包括视觉幻觉（描述不存在的物体）和视觉Token压缩效率

## 详细内容

### CLIP：多模态里程碑

CLIP的双编码器在4亿图文对上训练，使用InfoNCE对比损失最大化匹配对的余弦相似度。零样本分类流程：将类别名填入模板"a photo of a {class}"，计算图像嵌入与所有文本嵌入的相似度，取最高者。CLIP ViT-L/14在ImageNet上零样本达到76.2%，接近有监督ResNet-50的76.5%，但跨数据集泛化能力远超后者。

**CLIP局限**：对组合概念理解弱（"骑自行车的猫"vs"骑猫的自行车"难以区分），精细属性（计数、空间关系）理解有限。

### 三大架构对比

| 模型 | 融合策略 | 可训练参数 | 特点 |
|------|---------|-----------|------|
| CLIP | 晚期融合 | 全部 | 检索强，交互浅 |
| BLIP-2 | 交叉注意力 | 188M | 高效，冻结大模型 |
| LLaVA | 早期融合 | 投影层+LLM | 深度交互，对话强 |

### 视觉Token压缩

视觉编码器产生大量Token（ViT-L对336×336图像产生576个），直接拼接到LLM会大幅增加计算量。解决方案：Q-Former固定32个Query压缩视觉信息（BLIP-2），Perceiver Resampler使用可变数量Latent Query（Flamingo），动态分辨率根据图像复杂度调整Token数（InternVL）。

### 应用场景

电商搜索（以图搜商品，用户上传照片搜同款）、文档理解（GPT-4V/DocVQA自动提取发票合同信息）、医学影像辅助诊断（结合影像和病历文本）、内容审核（CLIP+分类器检测违规图文组合）、辅助功能（为视障用户描述图片内容）、自动驾驶（视觉-语言场景理解）。

### 商用模型格局

GPT-4V/4o（OpenAI，最强闭源）、Gemini Pro Vision（Google，原生多模态长上下文1M tokens）、Claude 3.5 Sonnet（Anthropic，多图对比分析强）、Qwen-VL（阿里，中文场景优）、InternVL（上海AI Lab，动态分辨率开源最强之一）。

### 开放词汇检测与分割

结合CLIP的开放词汇能力与检测/分割模型：Grounding DINO实现文本引导的任意类别目标检测，GLIP将检测统一为grounding任务，OpenSeg实现开放词汇语义分割。这些方法使模型不再受限于预定义类别，可以检测和分割训练时未见过的物体类别。

### CLIP的后续影响

CLIP的对比学习范式催生了大量衍生工作：OpenCLIP在大规模LAION-2B数据上训练并支持中文，GLIP将CLIP扩展到文本引导目标检测，CLIPSeg实现零样本图像分割，Stable Diffusion使用CLIP Text Encoder作为文生图的条件编码器。CLIP证明了"自然语言是视觉学习的监督信号"这一关键思想。

## 开放问题

- 多模态幻觉（描述不存在的物体）的缓解方案（rlhf/DPO对齐、视觉定位验证）仍在探索 ^[ambiguous]
- 高分辨率图像的Token效率和计算成本的平衡
- 视频理解中帧采样策略和时间建模的最优方案未定
- 开放词汇检测/分割（Grounding DINO、GLIP）的精度仍需提升
- OCR准确性在小文字场景下仍不满意，高分辨率编码器+OCR预训练是改进方向 ^[inferred]

## 来源

- 04_Computer_Vision/Multimodal_Vision/Multimodal_Vision.md
- 04_Computer_Vision/Multimodal_Vision/CLIP_Deep_Dive.md

## Related

- [[_concepts/computer-vision.md|computer-vision]]
- [[_concepts/generative-vision-models.md|generative-vision-models]]
- [[_concepts/object-detection.md|object-detection]]
- [[04_Computer_Vision/3D_Vision/3D_Vision.md|3D_Vision]]
- [[04_Computer_Vision/3D_Vision/3D_Vision_for_dummy.md|3D_Vision_for_dummy]]
