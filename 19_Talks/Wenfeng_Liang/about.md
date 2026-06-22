---
title: "梁文锋 (Wenfeng Liang) — DeepSeek 创始人"
category: 19-talks-wenfeng-liang
tags: [wenfeng-liang, deepseek, high-flyer, moe, mla, open-source, chinese-ai, efficiency]
summary: "梁文锋是幻方量化联合创始人、DeepSeek 创始人，用 $5.6M 训练出媲美 GPT-4 的模型，以开源和效率震惊全球 AI 界。"
created: 2026-06-12
updated: 2026-06-12
---

# 梁文锋 (Wenfeng Liang) — DeepSeek 创始人

> **一句话概括**: 从量化交易巨头转身 AI 创业，用不到 $6M 训练出 671B 参数的 DeepSeek-V3，证明了"效率比规模更重要"，并以全面开源震撼了整个行业。

---

## 核心贡献

- **幻方量化 (High-Flyer Capital)**: 联合创始人，中国顶级量化基金，管理数百亿资产
- **DeepSeek 系列**: 从 7B 到 V4 (1.6T)，全部开源，成为开源 LLM 标杆
- **DeepSeekMoE**: 细粒度专家 + 共享专家，开创 MoE 新范式
- **MLA (Multi-head Latent Attention)**: KV Cache 压缩 95%，使长上下文成为可能
- **GRPO 算法**: 无 Critic 的 RL 对齐方法，DeepSeek-R1 的核心创新
- **FP8 训练**: 首个大规模 FP8 混合精度训练，成本降 50%

## 代表性成果

1. **DeepSeek-V2** (2024.5): 236B/21B MoE + MLA，$8.1M 训练
   - 首次将 MoE + MLA 结合，引发行业关注

2. **DeepSeek-V3** (2024.12): 671B/37B MoE，$5.6M 训练
   - MMLU 88.5，媲美 GPT-4o
   - 训练成本仅为 GPT-4 的 1/20，震惊全球

3. **DeepSeek-R1** (2025.1): RL 推理模型
   - AIME 79.8%，Codeforces 96th percentile
   - 自发的"顿悟时刻"(Aha Moment)
   - 蒸馏出 1.5B-70B 系列，全面开源

4. **DeepSeek-V4** (2026.4): 1.6T/49B Pro + 284B/13B Flash
   - CSA/HCA 混合注意力，1M 上下文
   - Muon 优化器，自适应推理模式

## 技术观点

- **效率优于规模**: "不是谁的 GPU 多谁就赢，而是谁的算法更好"
- **开源是最好的策略**: "开源让全世界帮你验证和改进，闭源是自我封闭"
- **量化基金思维**: 将量化交易的效率思维带入 AI 训练
- **成本意识**: 每篇技术报告都公布训练成本，推动行业透明化

## 名言金句

> "We trained DeepSeek-V3 for $5.6 million. GPT-4 cost over $100 million. Efficiency matters."

> "Open source is not a strategy, it's a belief. The best AI should belong to everyone."

> "MoE is the future. You don't need to activate all parameters for every token."

> "中国不需要 10000 张 H100 来证明实力，需要的是 2048 张 H800 加上更好的算法。"

> "DeepSeek 不是要与 OpenAI 竞争，而是要证明高效训练是可能的。"

## 公司/团队

| 维度 | 详情 |
|------|------|
| **公司** | DeepSeek (深度求索) / 幻方量化 |
| **成立** | DeepSeek: 2023; 幻方: 2015 |
| **总部** | 杭州/上海 |
| **GPU 集群** | 2048 NVIDIA H800 (V3 训练) |
| **开源策略** | 全部模型开源 (MIT/DeepSeek License) |
| **团队规模** | ~100 人 (精而小) |

## 商业哲学

- **不做 API 生意**: 不以 API 收入为目标，专注技术突破
- **成本透明**: 每篇论文公布训练成本，推动行业对标
- **小团队**: 100 人左右的精英团队，而非大厂模式
- **长期主义**: 幻方量化的长期资金支持，不急于商业化

---

## 相关文档

- [DeepSeek 技术全景](../../05_NLP_LLMs/Chinese_LLM_Ecosystem/DeepSeek_Deep_Dive.md)
- [MoE 案例研究](../../05_NLP_LLMs/LLM_Architectures/MoE_Case_Studies_DeepSeek_Mixtral.md)
- [DeepSeek-R1 技术分析](../../05_NLP_LLMs/Reasoning_Models/DeepSeek_R1_Technical_Analysis.md)

---

*Last updated: 2026-06-12*
