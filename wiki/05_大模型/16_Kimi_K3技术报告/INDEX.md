---
title: Kimi K3 技术报告
type: index
created: 2026-08-05
updated: 2026-08-05
sources: ["https://github.com/MoonshotAI/Kimi-K3"]
name_zh: "Kimi K3 技术报告"
name_en: "Kimi K3 Technical Report"
---

# Kimi K3 技术报告

> 中文简称：Kimi K3 技术报告 ｜ English Name: Kimi K3 Technical Report

Kimi K3 是月之暗面（Moonshot AI）于 2026 年 7 月发布的旗舰开源原生多模态 MoE 大模型。

## 文件导航

| 文件 | 说明 |
|------|------|
| [[05_大模型/16_Kimi_K3技术报告/00_Kimi_K3_分析|Kimi K3 深度分析]] | 技术报告深度解析：架构、训练、推理、Benchmark |

## 核心参数

| 参数 | 数值 |
|------|------|
| 总参数 | 2.8 万亿 |
| 激活参数 | 1040 亿 |
| 架构 | MoE（896 路由专家 + 2 共享专家） |
| 注意力机制 | KDA 混合线性注意力 + Gated MLA |
| 上下文窗口 | 1,048,576 Token（1M） |
| 视觉编码器 | MoonViT-V2（401M） |

## Related

- [[05_大模型/14_中国LLM生态/13_Kimi_Moonshot_深入分析|Kimi K2 及 Moonshot AI 全系列]]
- [[05_大模型/14_中国LLM生态/README|中国大模型生态]]
- [[05_大模型/README|大模型域首页]]

## 统计

| 指标 | 数值 |
|------|------|
| 文件数 | 1 |
| 最后更新 | 2026-08-05 |

---
*Last updated: 2026-08-05*
