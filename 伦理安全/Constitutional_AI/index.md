---
title: Constitutional AI (宪法式 AI)
category: 伦理安全/Constitutional_AI
tags: [ai-safety, alignment, constitutional-ai, rlaif, anthropic]
summary: Anthropic 提出的基于宪法原则的 AI 对齐方法，通过 RLAIF 替代人类反馈实现安全对齐。
---

# Constitutional AI (宪法式 AI)

本目录收录 Constitutional AI 相关文档，包括 Anthropic 的原始方法、RAIAF 框架、以及与 RLHF/DPO 的对比。

## 内容导航

| 文档 | 说明 | 适用读者 |
|------|------|---------|
| [[Constitutional_AI_Deep_Dive]] | Constitutional AI 深度解析：原理、RAIAF 框架、与 RLHF 对比 | 安全工程师、研究员 |

## 核心概念

- **Constitutional AI**: 通过一组"宪法原则"（如有益、无害、诚实）引导 AI 自我评估和自我修正
- **RLAIF (RL from AI Feedback)**: 用 AI 模型替代人类标注者提供偏好信号，大幅降低对齐成本
- **Critique-Revision Loop**: AI 先生成回答 → 自我批评 → 修订 → 最终输出更安全的版本

## Related

- [[../Value_Alignment/Value_Alignment_for_dummy|价值对齐入门]]
- [[../Ethics_Fundamentals/AI_Ethics_And_Future|AI 伦理与未来]]
- [[../../模型训练/Alignment/GRPO_Deep_Dive|GRPO 深度解析]]
- [[../../论文精读/Alignment/DPO_Deep_Dive|DPO 论文精读]]
