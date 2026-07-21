---
title: 多模态论文精读 (Multimodal Papers)
category: 06-papers
tags: ["multimodal", "clip", "llava", "gpt-4v", "vision-language"]
summary: "多模态核心论文精读：CLIP/BLIP-2/LLaVA/GPT-4V/Flamingo，每篇含核心思想、架构解析、实验结果、后续影响。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 多模态论文精读 (Multimodal Papers)

## 1. 论文列表

| 论文 | 年份 | 机构 | 核心贡献 | 引用 |
|------|------|------|----------|------|
| CLIP | 2021 | OpenAI | 对比学习连接视觉-语言 | 20K+ |
| Flamingo | 2022 | DeepMind | 少样本多模态学习 | 3K+ |
| BLIP-2 | 2023 | Salesforce | Q-Former 桥接 | 4K+ |
| LLaVA | 2023 | UW-Madison | 简单有效的视觉LLM | 5K+ |
| GPT-4V(ision) | 2023 | OpenAI | 商用多模态标杆 | - |
| Gemini | 2024 | Google | 原生多模态 | 3K+ |

## 2. CLIP (2021)

```
核心思想: 用对比学习将图像和文本映射到同一空间

架构:
  图像 → Image Encoder (ViT/ResNet) → 图像向量
  文本 → Text Encoder (Transformer) → 文本向量
  训练: 对比损失 (匹配的拉近, 不匹配的推远)

数据: 4 亿图文对 (WebImageText)

关键创新:
- 零样本迁移: 不需要微调就能分类
- 开放词汇: 不受预定义类别限制
- 强泛化: 对比学习学到的表示非常通用

影响:
- 开启了 "视觉-语言对齐" 范式
- 后续几乎所有 VLM 都基于 CLIP 初始化
- DALL-E/Stable Diffusion 用 CLIP 做文本引导
```

## 3. LLaVA (2023)

```
核心思想: 用简单的线性投影连接视觉编码器和 LLM

架构:
  图像 → CLIP ViT-L → 视觉 token
  视觉 token → 线性投影 → LLM token 空间
  文本 + 视觉 token → LLM (Vicuna) → 回答

训练:
  阶段 1: 冻结视觉编码器和 LLM, 只训练投影层
  阶段 2: 解冻 LLM, 指令微调

关键创新:
- 极简架构: 没有复杂的桥接模块
- GPT-4 生成指令数据: 用 GPT-4 生成多模态训练数据
- 效果惊人: 简单方法达到 SOTA

影响:
- 证明了 "简单连接" 的有效性
- 开源社区大量复现/改进
- LLaVA-NeXT/1.6 持续迭代
```

## 4. 论文阅读方法

```python
PAPER_READING_METHOD = {
    "第一遍 (5min)": [
        "读标题/摘要/结论",
        "看图表",
        "判断是否值得深读",
    ],
    "第二遍 (30min)": [
        "理解架构图",
        "理解训练/推理流程",
        "看实验设置和主要结果",
        "标记不理解的部分",
    ],
    "第三遍 (2h+)": [
        "推导数学公式",
        "理解每个设计选择的原因",
        "对比相关工作",
        "思考局限性和改进方向",
    ],
    "复现 (可选)": [
        "跑通官方代码",
        "在小数据集上验证",
        "尝试改进",
    ],
}
```

## 5. 交叉引用

- [[论文精读/|论文精读]]
- [[论文精读/Agent_Papers/|Agent 论文]]
- [[论文精读/Reasoning_Papers/|推理论文]]
- [[大模型/Multimodal_Models/|多模态模型]]
- [[深度学习/|深度学习]]
