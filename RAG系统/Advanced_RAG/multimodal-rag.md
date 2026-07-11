---
title: "多模态 × RAG: 当检索增强遇上图文音视频"
category: -synthesis
tags: ["multimodal", "rag", "vision-language", "retrieval", "embedding", "synthesis"]
sources:
  - "大模型/Multimodal_Models/Native_Multimodal_Architectures"
  - "大模型/Multimodal_Models/Modality_Fusion_Mechanisms"
  - "RAG系统/Advanced_RAG/RAG_Advanced_2026"
  - "RAG系统/Vector_Database_for_dummy"
created: 2026-06-01
updated: 2026-06-01
summary: "探索多模态内容（图像、视频、音频）与 RAG 系统的融合路径——从跨模态嵌入到多模态重排序，构建能'看懂'和'听懂'的知识检索系统。"
provenance:
  extracted: 0.3
  inferred: 0.6
  ambiguous: 0.1
base_confidence: 0.75
lifecycle: draft
lifecycle_changed: 2026-06-01
tier: core
aliases:
  - "Multimodal Rag"
  - "multimodal rag"

---
# 多模态 × RAG: 当检索增强遇上图文音视频

## The Connection

传统 RAG 只处理文本，但现实世界 80% 的信息是非文本的。多模态 RAG 的核心理念是：**让检索系统能理解图像、视频、音频，并将它们与文本知识统一检索和生成**。^[inferred]

这不是简单的"把图片转成文字再检索"——真正的多模态 RAG 需要在嵌入空间层面实现跨模态对齐。^[inferred]

## Where They Co-occur

多模态 RAG 正在以下场景快速落地：
- **企业知识库**: 产品手册（文本）+ 设计图（图像）+ 演示视频（视频）统一检索
- **医疗诊断**: 病历文本 + CT/MRI 影像 + 医生语音记录综合查询
- **电商客服**: 用户上传商品图片 → 检索相似产品 + 相关文本描述 + 使用教程视频
- **法律证据**: 合同文本 + 现场照片 + 监控录像 + 录音证词交叉验证

## Cross-cutting Insight

多模态 RAG 的关键突破点在于**统一嵌入空间**的设计：

```
传统 RAG (文本 only):
查询文本 ──▶ 文本嵌入 ──▶ 向量数据库 ──▶ 文本片段 ──▶ LLM 生成

多模态 RAG:
查询(文本/图像/视频) ──▶ 统一嵌入空间 ──▶ 多模态向量数据库 ──▶ 混合片段 ──▶ 多模态 LLM 生成
                    │
                    └── CLIP 式对比学习让图像和文本共享同一语义空间
```

三种主流架构范式：
1. **桥接式 (Bridge)**: 各模态独立嵌入 + 跨模态投影层对齐（如 CLIP）
2. **原生式 (Native)**: 统一编码器直接处理多模态输入（如 Gemini 的原生多模态嵌入）
3. **延迟融合 (Late Fusion)**: 各模态分别检索 + 多模态重排序（适合已有系统的渐进改造）

## Tensions and Trade-offs

| 维度 | 挑战 | 权衡 |
|------|------|------|
| **嵌入对齐** | 图文语义粒度不同（"苹果"水果 vs 苹果公司 logo） | 细粒度对齐需要更多标注数据，粗粒度对齐影响检索精度 |
| **存储成本** | 视频嵌入 = 数百帧 × 高维向量 | 关键帧提取 vs 全帧嵌入的精度-成本权衡 |
| **查询歧义** | "红色那款"——指图片中的红色产品还是红色包装？ | 需要多模态查询理解 + 用户意图消歧 |
| **延迟** | 视频检索比文本慢 10-100x | 预提取关键帧 vs 实时处理的延迟-新鲜度权衡 |

## Open Questions

- 当检索到的文本片段和图像片段矛盾时，LLM 如何仲裁？（多模态幻觉问题）^[ambiguous]
- 视频的时间维度如何有效编码？目前多数方案将视频视为"图像序列"，丢失了时序因果关系。^[inferred]
- 多模态 RAG 的评测体系几乎空白——如何量化"检索到的图像是否真正相关"？^[ambiguous]

## Related

- [[大模型/Multimodal_Models/Native_Multimodal_Architectures]]
- [[大模型/Multimodal_Models/Modality_Fusion_Mechanisms]]
- [[RAG系统/Advanced_RAG/RAG_Advanced_2026]]
- [[RAG系统/Vector_Database_for_dummy]]
- [[概念/multimodal-vision]]
