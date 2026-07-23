---
title: 多模态模型目录
category: 05-nlp-llms-multimodal-models
tags: ['multimodal', 'overview', 'index']
summary: 多模态模型 相关内容的索引和概览。
created: 2026-06-12
updated: 2026-07-21
tier: peripheral
sources: []

---
# 多模态模型

本目录包含 多模态模型 相关的深度技术内容。

## 内容索引

## 页面列表

- [[大模型/Multimodal_Models/Native_Multimodal_Architectures|Native Multimodal Architectures: From GPT-4V to Gemini 2.5]]
- [[大模型/Multimodal_Models/Modality_Fusion_Mechanisms|Modality Fusion Mechanisms: Deep Dive]]
- [[大模型/Multimodal_Models/Video_Understanding_Architectures|Video Understanding Architectures]]

## 相关页面

- [[大模型/Multimodal_Models/Multimodal_Models_for_dummy|多模态模型小白指南 (Multimodal Models for Dummy)]]
- [[大模型/Multimodal_Models/README|多模态模型目录]]
- [[大模型/Multimodal_Models/LLaVA_Deep_Dive|LLaVA: 开源多模态大模型]]

## Related

- [[大模型/README|04 自然语言处理与大模型 (NLP & LLMs)]]

## 多模态模型对比

| 模型 | 厂商 | 模态 | 特点 |
|------|------|------|------|
| GPT-4o | OpenAI | 图文音视频 | 原生 |
| Gemini 2 | Google | 图文音视频 | 长上下文 |
| Claude 3.5 | Anthropic | 图文 | 视觉 |
| LLaVA | 开源 | 图文 | 可定制 |
| Qwen-VL | 阿里 | 图文 | 中文 |

## 架构类型

| 架构 | 说明 | 代表 |
|------|------|------|
| 组合式 | 编码器+LLM | LLaVA |
| 原生 | 统一 Transformer | GPT-4o |
| 早期融合 | 输入层融合 | Gemini |
| 晚期融合 | 输出层融合 | 早期 |

## 学习路径

| 阶段 | 内容 | 目标 |
|------|------|------|
| 入门 | 多模态概念 | 理解基础 |
| 进阶 | 架构设计 | 技术原理 |
| 实践 | LLaVA | 开源实现 |
| 拓展 | 视频理解 | 时序建模 |

## 常见问题

| 问题 | 解答 |
|------|------|
| 原生 vs 组合？ | 原生更好 |
| 视觉编码器？ | ViT/CLIP |
| 难点？ | 模态对齐 |
| 开源选择？ | LLaVA/Qwen-VL |

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 20 |
| 最后更新 | 2026-07-21 |

> 💡 多模态是 AI 的必然趋势，让机器像人类一样通过多种感官理解世界。

## 附录：视觉编码器

| 编码器 | 说明 | 代表 |
|------|------|------|
| ViT | Vision Transformer | DALL-E |
| CLIP | 对比学习 | OpenAI |
| SigLIP | 改进 CLIP | Google |
| EVA | 大规模 ViT | BAAI |

## 附录：2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 原生多模态 | 统一架构 | 更好融合 |
| 视频生成 | Sora/Runway | 创意产业 |
| 实时交互 | 语音+视觉 | 自然交互 |
| 3D 理解 | 空间智能 | 机器人 |

## 附录：应用场景

| 场景 | 模态 | 应用 |
|------|------|------|
| 图像问答 | 图+文 | 视觉助手 |
| 文档理解 | 图+文 | OCR+理解 |
| 视频分析 | 视频+文 | 内容审核 |
| 图像生成 | 文→图 | 创意工具 |
| 语音助手 | 音+文 | 智能客服 |

## 附录：评估基准

| 基准 | 模态 | 说明 |
|------|------|------|
| MMBench | 图文 | 多模态理解 |
| MMMU | 图文 | 多学科 |
| MathVista | 图文 | 数学视觉 |
| Video-MME | 视频 | 视频理解 |

## 附录：模态对齐方法

| 方法 | 原理 | 代表 |
|------|------|------|
| 对比学习 | 拉近匹配对 | CLIP |
| 投影层 | 线性映射 | LLaVA |
| Q-Former | 可学习查询 | BLIP-2 |
| Perceiver | 交叉注意力 | Flamingo |

## 附录：开源生态

| 模型 | 特点 | 许可证 |
|------|------|------|
| LLaVA | 图文理解 | Apache |
| Qwen-VL | 中文优化 | Apache |
| CogVLM | 清华 | 商用 |
| InternVL | 上海 AI Lab | Apache |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 模态 | Modality | 信息类型 |
| 编码器 | Encoder | 特征提取 |
| 对齐 | Alignment | 语义匹配 |
| 幻觉 | Hallucination | 虚假内容 |
| 接地 | Grounding | 区域定位 |

## 附录：训练数据

| 数据类型 | 来源 | 规模 |
|------|------|------|
| 图文对 | 网页爬取 | 数十亿 |
| 视频字幕 | YouTube | 数百万小时 |
| 文档 OCR | 扫描文档 | 数亿页 |
| 指令数据 | 人工标注 | 数十万 |

## 附录：推理优化

| 技术 | 说明 | 加速 |
|------|------|------|
| Token 压缩 | 减少冗余 | 2-4x |
| 动态分辨率 | 自适应切片 | 质量↑ |
| KV Cache | 跨模态缓存 | 1.5x |
| 量化 | INT8/INT4 | 2-4x |

## 附录：安全与伦理

| 议题 | 说明 | 应对 |
|------|------|------|
| 深度伪造 | 图像生成滥用 | 水印检测 |
| 偏见 | 视觉刻板印象 | 公平性审计 |
| 隐私 | 人脸识别 | 差分隐私 |
| 版权 | AI 生成图像 | 法律框架 |

## Related

- [[大模型/Speech_Audio_AI/index|Speech Audio AI]]
- [[计算机视觉/index|计算机视觉]]
- [[大模型/index|大模型首页]]

## 附录：视频理解

| 任务 | 说明 | 代表 |
|------|------|------|
| 视频问答 | 视频内容问答 | Video-LLaVA |
| 动作识别 | 行为检测 | TimeSformer |
| 视频摘要 | 内容概括 | LLoVi |
| 时序定位 | 事件定位 | Moment-DETR |

> 💡 多模态融合让 AI 能够像人类一样，通过多种感官全面理解世界。

## 附录：图像生成

| 模型 | 厂商 | 特点 |
|------|------|------|
| DALL-E 3 | OpenAI | 文本到图像 |
| Midjourney | Midjourney | 艺术风格 |
| Stable Diffusion | Stability | 开源 |

## 附录：参考

| 资源 | 说明 |
|------|------|
| LLaVA | 开源多模态 |

---
*Last updated: 2026-07-21*
