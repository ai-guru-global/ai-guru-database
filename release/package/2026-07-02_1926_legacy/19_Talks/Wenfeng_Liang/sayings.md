---
title: "梁文锋关于 AI 的观点 (Wenfeng Liang on AI)"
category: 19-talks-wenfeng-liang
tags: [wenfeng-liang, deepseek, high-flyer, moe, efficiency, open-source, chinese-ai, talks, insights]
summary: "1. **"效率比规模更重要——$5.6M 训练出 GPT-4 级别的模型，证明了算法创新比烧钱更有价值。"**"
created: 2026-06-24
updated: 2026-06-24
tier: supporting
aliases:
  - Sayings

---
# 梁文锋关于 AI 的观点 (Wenfeng Liang on AI)

1. **"效率比规模更重要——$5.6M 训练出 GPT-4 级别的模型，证明了算法创新比烧钱更有价值。"**
   - **上下文**: DeepSeek-V3 以 671B 参数、$5.6M 训练成本达到与 GPT-4 媲美的性能，震惊全球 AI 界。
   - **来源**: DeepSeek-V3 技术报告 (2024.12)

2. **"全面开源不是慈善——当你的技术足够领先，开源就是最好的护城河。"**
   - **上下文**: DeepSeek 全系列模型（V3/R1/V4）均 MIT/Apache 2.0 开源，权重、代码、训练细节完全公开。
   - **来源**: 2025 开发者社区公开信

3. **"GRPO 的灵感来自量化交易——不需要 Critic 网络，直接用组内相对优势做 RL。"**
   - **上下文**: GRPO (Group Relative Policy Optimization) 是 DeepSeek-R1 的核心对齐算法，无需额外 Critic 模型。
   - **来源**: DeepSeek-R1 技术报告 (2025)

4. **"MoE 的细粒度专家 + 共享专家设计，让每个 Token 都能找到最适合的'专家门诊'。"**
   - **上下文**: DeepSeekMoE 的 256 experts + 共享专家架构，成为 MoE 领域的新范式。
   - **来源**: DeepSeekMoE 论文 (2024)

5. **"MLA 把 KV Cache 压缩了 95%——长上下文不再是奢侈品，而是标配。"**
   - **上下文**: Multi-head Latent Attention (MLA) 通过低秩压缩将 KV Cache 从数百 GB 降到数 GB。
   - **来源**: DeepSeek-V2 技术报告 (2024)

6. **"我们不追求参数最大，追求每 FLOP 的智能密度最高。"**
   - **上下文**: 回应 OpenAI 和 Google 的万亿参数竞赛路线，强调效率优先。
   - **来源**: 2025 内部技术讨论 (公开披露)

7. **"量化交易的思维方式天然适合 AI——两者都是在高维空间中寻找最优策略。"**
   - **上下文**: 解释幻方量化为何投入 AI 研究：从金融市场的 Alpha 信号到大模型的涌现能力。
   - **来源**: 幻方量化年度报告 (2023)

8. **"DeepSeek-R1 的推理链不是刻意设计的——它是 RL 训练的自然涌现，模型自己学会了'思考'。"**
   - **上下文**: R1 在 RL 训练中自发产生 CoT 推理链，包括反思、回溯、多步推理等行为。
   - **来源**: DeepSeek-R1 技术报告 (2025)

## 近期动态与更新入口
- **DeepSeek 官网**: [deepseek.com](https://www.deepseek.com/)
- **GitHub**: [deepseek-ai](https://github.com/deepseek-ai) (全部开源)
- **HuggingFace**: [deepseek-ai](https://huggingface.co/deepseek-ai)

---

## Related

- [[业界观点/Wenfeng_Liang/about]] — 梁文锋简介
- [[大模型/Chinese_LLM_Ecosystem/DeepSeek_Deep_Dive]] — DeepSeek 深度解析
- [[论文精读/Scaling/Scaling_Laws_Deep_Dive]] — Scaling Laws 论文解读

---

*Last updated: 2026-06-24*

- [[业界观点/README|AI 名人演讲与观点 (Talks)]]
