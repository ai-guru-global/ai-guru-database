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
sources: []

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

## 2. 开源影响与全球反响 (Open Source Impact & Global Response)

9. **"芯片禁令确实增加了困难，但 DeepSeek 的效率优先路线恰恰是对限制的最佳回应。"**
   - **上下文**: 面对 US 芯片出口管制，DeepSeek 通过极致的工程优化（FP8 训练、MLA 压缩、MoE 路由）在有限算力下实现前沿性能。
   - **解读**: 梁文锋将算力限制转化为创新驱动力——当硬件资源受限，算法和工程的极致优化反而成为差异化优势。
   - **来源**: DeepSeek 技术社区公开信 (2025)

10. **"R1 开源后全球开发者复现和改进——这证明了开放科学比封闭开发更高效。"**
    - **上下文**: DeepSeek-R1 开源后，全球研究者在几天内基于其方法发布数十个衍生模型，推动整个行业推理能力跃升。
    - **解读**: 梁文锋用 R1 的开源效应证明：在 AI 前沿，社区协作的速度远超任何单一公司——开放就是最快的创新路径。
    - **来源**: 2025 开发者社区公开信

## 3. 工程文化与组织哲学 (Engineering Culture & Organizational Philosophy)

11. **"DeepSeek 的文化是极客驱动——没有层级，没有 PPT，代码和实验数据是唯一的语言。"**
    - **上下文**: 描述 DeepSeek（幻方量化背景）极度扁平、技术导向的组织文化，年轻工程师直接驱动核心创新。
    - **解读**: 梁文锋认为 AI 突破来自一线工程师的自由探索，而非自上而下的规划——这种文化是 DeepSeek 以小博大的底层原因。
    - **来源**: 2025 媒体专访 & 招聘公开信

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
