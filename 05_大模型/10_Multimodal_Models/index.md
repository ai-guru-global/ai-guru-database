---
title: Multimodal Models
type: index
created: 2026-07-02
updated: 2026-07-21
sources: []
name_zh: "多模态模型"
name_en: "Multimodal Models"
---

# Multimodal Models

> 中文简称：多模态模型 ｜ English Name: Multimodal Models

多模态模型 — 融合文本、图像、音频、视频等多种模态的大模型架构与应用。

## 子域简介

本子域聚焦多模态 AI 技术：

- **原生多模态**: GPT-4o/Gemini 2 统一架构
- **模态融合**: 图文、音视频融合机制
- **视频理解**: 视频分析与生成
- **应用实践**: 图像应用构建

## 文件导航

| 文件 | 说明 |
|------|------|
| [[05_大模型/10_Multimodal_Models/Multimodal_Models_for_dummy|入门版]] | 零基础多模态模型入门 |
| [[05_大模型/10_Multimodal_Models/Multimodal_Architectures_2026|多模态架构 2026]] | 多模态架构研究进展 |
| [[05_大模型/10_Multimodal_Models/Native_Multimodal_Architectures|原生多模态]] | 原生多模态架构设计 |
| [[05_大模型/10_Multimodal_Models/Modality_Fusion_Mechanisms|模态融合机制]] | 多模态融合方法详解 |
| [[05_大模型/10_Multimodal_Models/Video_Understanding_Architectures|视频理解]] | 视频理解架构 |
| [[05_大模型/10_Multimodal_Models/LLaVA_Deep_Dive|LLaVA]] | LLaVA 多模态模型深度解读 |
| [[05_大模型/10_Multimodal_Models/GenAI_L09_Building_Image_Applications|图像应用构建]] | 多模态图像应用实践 |
| [[05_大模型/10_Multimodal_Models/README|README]] | 目录说明 |

## 核心概念速查

| 概念 | 说明 | 代表 |
|------|------|------|
| 原生多模态 | 统一架构处理所有模态 | GPT-4o/Gemini 2 |
| 模态融合 | 多模态信息整合 | Cross-Attention |
| Vision Encoder | 视觉编码器 | ViT/CLIP |
| 视频理解 | 时序视觉理解 | Video-LLaVA |
| 图像生成 | 文本到图像 | DALL-E/SD |

## 多模态模型对比

| 模型 | 厂商 | 模态 | 特点 |
|------|------|------|------|
| GPT-4o | OpenAI | 图文音视频 | 原生多模态 |
| Gemini 2 | Google | 图文音视频 | 长上下文 |
| Claude 3.5 | Anthropic | 图文 | 视觉理解 |
| LLaVA | 开源 | 图文 | 可定制 |
| Qwen-VL | 阿里 | 图文 | 中文优化 |

## 学习路径建议

| 阶段 | 推荐文档 | 目标 |
|------|------|------|
| 入门 | Multimodal_Models_for_dummy | 理解概念 |
| 进阶 | Multimodal_Architectures_2026 | 架构设计 |
| 实践 | LLaVA_Deep_Dive | 开源实现 |
| 拓展 | Video_Understanding_Architectures | 视频理解 |

## 常见问题

| 问题 | 解答 |
|------|------|
| 原生 vs 组合多模态？ | 原生统一架构更好 |
| 视觉编码器作用？ | 将图像转为 token |
| 多模态难点？ | 模态对齐和融合 |
| 如何选择？ | 根据模态需求选择 |

## Related

- [[04_计算机视觉/08_Multimodal_Vision/index|Multimodal Vision]]
- [[05_大模型/02_Sequence_Models/index|Sequence Models]]
- [[05_大模型/index|大模型首页]]
- [[概念/multimodal-models|多模态模型概念]]

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 8 |
| 最后更新 | 2026-07-21 |

> 💡 多模态是 AI 的必然趋势，让机器像人类一样通过多种感官理解世界。

## 附录：多模态架构类型

| 架构 | 说明 | 代表 |
|------|------|------|
| 组合式 | 模态编码器+LLM | LLaVA |
| 原生 | 统一 Transformer | GPT-4o |
| 早期融合 | 输入层融合 | Gemini |
| 晚期融合 | 输出层融合 | 早期模型 |

## 附录：视觉编码器

| 编码器 | 说明 | 代表 |
|------|------|------|
| ViT | Vision Transformer | DALL-E |
| CLIP | 对比学习 | OpenAI |
| SigLIP | 改进 CLIP | Google |
| EVA | 大规模 ViT | BAAI |

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

## 附录：2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 原生多模态 | 统一架构 | 更好融合 |
| 视频生成 | Sora/Runway | 创意产业 |
| 实时交互 | 语音+视觉 | 自然交互 |
| 3D 理解 | 空间智能 | 机器人 |
| 端侧多模态 | 手机本地 | 隐私保护 |

## 附录：开源生态

| 模型 | 特点 | 许可证 |
|------|------|------|
| LLaVA | 图文理解 | Apache |
| Qwen-VL | 中文优化 | Apache |
| CogVLM | 清华 | 商用 |
| InternVL | 上海 AI Lab | Apache |

## 附录：模态对齐方法

| 方法 | 原理 | 代表 |
|------|------|------|
| 对比学习 | 拉近匹配对 | CLIP |
| 投影层 | 线性映射 | LLaVA |
| Q-Former | 可学习查询 | BLIP-2 |
| Perceiver | 交叉注意力 | Flamingo |
| 统一 Tokenizer | 离散化所有模态 | Chameleon |

## 附录：训练数据构建

| 数据类型 | 来源 | 规模 |
|------|------|------|
| 图文对 | 网页爬取 | 数十亿对 |
| 视频字幕 | YouTube | 数百万小时 |
| 文档 OCR | 扫描文档 | 数亿页 |
| 指令数据 | 人工标注 | 数十万条 |
| 合成数据 | GPT-4V 生成 | 数百万条 |

## 附录：多模态推理优化

| 技术 | 说明 | 加速比 |
|------|------|------|
| 视觉 Token 压缩 | 减少冗余 Token | 2-4x |
| 动态分辨率 | 自适应图像切片 | 质量↑ |
| KV Cache 共享 | 跨模态缓存 | 1.5x |
| 投机解码 | 小模型预测 | 2-3x |
| 量化部署 | INT8/INT4 | 2-4x |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 模态 | Modality | 信息类型（图/文/音） |
| 编码器 | Encoder | 模态特征提取 |
| 对齐 | Alignment | 跨模态语义匹配 |
| 幻觉 | Hallucination | 生成不存在内容 |
| 接地 | Grounding | 定位到具体区域 |
| 交错 | Interleaved | 多模态混合输入 |

## 附录：多模态安全与伦理

| 议题 | 说明 | 应对 |
|------|------|------|
| 深度伪造 | 图像/视频生成滥用 | 水印检测 |
| 偏见放大 | 视觉刻板印象 | 公平性审计 |
| 隐私侵犯 | 人脸/场景识别 | 差分隐私 |
| 内容审核 | 有害图像生成 | 安全过滤器 |
| 版权归属 | AI 生成图像版权 | 法律框架 |

> 💡 多模态融合是通向 AGI 的关键路径，让 AI 具备类人的多感官理解与生成能力。

## 快速导航

| 需求 | 推荐 |
|------|------|
| 入门 | Multimodal_Models_for_dummy |

---
*Last updated: 2026-07-21*
