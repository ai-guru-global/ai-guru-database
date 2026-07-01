---
title: "杨植麟 (Zhilin Yang) — 月之暗面/Moonshot AI 创始人"
category: 19-talks-zhilin-yang
tags: [zhilin-yang, moonshot-ai, kimi, long-context, transformer-xl, xlnet, chinese-ai, agi]
summary: "杨植麟是月之暗面创始人，Transformer-XL 和 XLNet 共同发明人，29 岁创业，坚信长上下文是通往 AGI 的关键。"
created: 2026-06-12
updated: 2026-06-12
tier: supporting
aliases:
  - About

---
# 杨植麟 (Zhilin Yang) — 月之暗面创始人

> **一句话概括**: 29 岁创办月之暗面，Transformer-XL 共同发明人，用"长上下文是 AGI 关键"的信念，打造了 Kimi 这款改变中国 AI 格局的产品。

---

## 核心贡献

- **Transformer-XL** (2019): 共同发明人，首次实现 Transformer 的超长序列建模，引入 segment-level recurrence 和 relative position encoding
- **XLNet** (2019): 共同发明人，融合 BERT 双向理解和 GPT 自回归生成的优势，在多项 NLP 基准超越 BERT
- **月之暗面 (Moonshot AI)** (2023.3): 30 岁创办，获数亿美元融资，成为中国 AI 六小龙之一
- **Kimi 产品线**: moonshot-v1 (200K 上下文) → k1.5 (RL reasoning) → K2 (1T MoE) → K2.5 → K2.6 (256K 多模态)
- **MuonClip 优化器**: Kimi K2 的创新，结合 Muon + QK-Clip 稳定万亿参数训练

## 代表性论文与演讲

1. **"Transformer-XL: Attentive Language Models Beyond a Fixed-Length Context"** (2019)
   - 与 Google Brain 合作，引用 3000+
   - 核心创新: 引入循环机制让 Transformer 处理超长文本

2. **"XLNet: Generalized Autoregressive Pretraining for Language Understanding"** (2019)
   - NeurIPS 2019，引用 5000+
   - 排列语言建模 + Transformer-XL，统一 BERT 和 GPT

3. **"Kimi k1.5: Scaling Reinforcement Learning with LLMs"** (2025)
   - 证明纯 RL + 长上下文即可匹配 OpenAI o1
   - Long2Short 方法: 将长思维链能力迁移到短回答

## 技术观点

- **长上下文是 AGI 关键**: "如果你给模型足够长的上下文，它就能记住所有需要的知识，不需要外部检索"
- **RL 优于搜索**: k1.5 证明不需要 MCTS、value function 等复杂搜索，纯 RL scaling 即可
- **中国 AI 独立路线**: 在美国制裁背景下，走出独立的技术路线 (MuonClip, Long2Short)
- **产品先行**: 先做 Kimi Chat 产品，再逐步开放 API，不同于传统 AI 公司的路径

## 名言金句

> "Long context is the key to AGI. If you give a model enough context, it doesn't need retrieval."

> "We don't need Monte Carlo Tree Search. Pure RL scaling with long context is enough."

> "中国 AI 不需要跟随 OpenAI 的路线，我们有自己的创新路径。"

> "29 岁创业并不早，Transformer-XL 让我理解了序列建模的本质。"

> "Kimi 不是聊天机器人，它是能处理 20 万字文档的 AI 工作伙伴。"

## 公司/团队

| 维度 | 详情 |
|------|------|
| **公司** | 月之暗面 (Moonshot AI) |
| **成立** | 2023 年 3 月 |
| **总部** | 北京 |
| **融资** | 数亿美元 (红杉、阿里、腾讯等) |
| **产品** | Kimi Chat, Kimi API |
| **团队** | 来自清华、CMU、Google、Meta 的顶尖研究者 |

## 学术背景

- 清华大学计算机系本科
- CMU Language Technologies Institute (LTI) 博士，导师 Graham Neubig
- Google Brain 实习 (Transformer-XL 合作)
- 博士期间发表 Transformer-XL、XLNet 等里程碑论文

---

## 相关文档

- [Kimi/Moonshot AI 技术全景](../../05_NLP_LLMs/Chinese_LLM_Ecosystem/Kimi_Moonshot_Deep_Dive.md)
- [中国大模型生态全景](../../05_NLP_LLMs/Chinese_LLM_Ecosystem/README.md)
- [Reasoning Models 2026](../../05_NLP_LLMs/LLM_Architectures/Reasoning_Models_2026.md)

---

*Last updated: 2026-06-12*

- [[19_Talks/README|AI 名人演讲与观点 (Talks)]]
