---
title: "闫俊杰 (Junjie Yan) — MiniMax 创始人"
category: 19-talks-junjie-yan
tags: [junjie-yan, minimax, lightning-attention, hailuo, talkie, chinese-ai, multimodal, moe, chinese-six-dragons, senseTime]
summary: "闫俊杰是前商汤科技 VP，MiniMax 创始人，打造了 Lightning Attention 和 Hailuo 视频生成，以全模态产品线切入 AI 赛道——中国 AI 六小龙中最注重 C 端产品和多模态能力的公司。"
created: 2026-06-12
updated: 2026-07-11
tier: supporting
aliases:
  - About
sources: []

---
# 闫俊杰 (Junjie Yan) — MiniMax 创始人

## 一句话概括

> 从商汤科技副总裁转身创业，用 Lightning Attention 实现百万 Token 上下文，打造了覆盖文本/视频/语音/音乐的 AI 全模态帝国——MiniMax 是中国 AI 六小龙中唯一以 C 端产品（Talkie/海螺 AI）起家并以全模态为核心战略的公司。

---

## 核心贡献 (Key Contributions)

- **MiniMax 创始** (2021.12): 离开商汤创办 MiniMax，定位为"全模态通用 AI 平台"。MiniMax 名字的含义是"用最小化的计算实现最大化的智能 (Minimum compute, Maximum intelligence)"，体现了创始人对效率的核心追求。MiniMax 成为中国 AI 六小龙之一。
- **Lightning Attention**: 线性复杂度 O(n) 的注意力机制，突破传统 Softmax Attention 的 O(n²) 复杂度瓶颈。这一创新使 MiniMax 模型能够处理百万级 Token 的超长上下文（训练上下文 1M，推理外推至 4M），在长上下文赛道与 [[业界观点/Zhilin_Yang/about]] 的 Kimi 形成直接竞争。
- **abab 模型系列**: 从 abab 5 到 abab 7，为 Talkie（星野）和海螺 AI 提供基础模型能力。abab 系列在国内各项评测中持续名列前茅，尤其在多轮对话和角色扮演方面表现突出。
- **MiniMax-Text-01** (2025.1): 456B/45.9B MoE + Lightning Attention，训练上下文 1M tokens，推理外推至 4M tokens。性能匹配 GPT-4o 和 Claude 3.5 Sonnet，同时保持极低的推理成本。
- **M2.5/M2.7** (2026): M2.5 (230B/10B 稀疏 MoE) 在 SWE-bench Verified 达 80.2%，Multi-SWE-bench 第一名，比前版本快 37%。MiniMax 在编码能力上实现了对多个国际模型的超越。
- **Hailuo (海螺 AI) 视频生成**: 01→02→2.3 系列，支持 1080p 原生输出和物理模拟。Hailuo 视频生成在全球范围内被公认为可与 Sora、Kling（快手）、Veo（Google）竞争的第一梯队产品。
- **语音与音乐生成**: 40 种语言 TTS（文字转语音），5 秒声音克隆，高质量音乐生成。MiniMax 是中国最早实现商业化语音克隆的公司之一，Talkie 的角色配音能力是其核心竞争优势。

---

## 代表性成果与技术里程碑

### 1. MiniMax-Text-01 (2025.1): 456B MoE + Lightning Attention

- 训练上下文 1M tokens，推理外推至 4M tokens
- 性能匹配 GPT-4o 和 Claude 3.5-Sonnet
- Lightning Attention 使推理成本远低于同规模 Dense 模型
- 证明了线性注意力在超大规模 MoE 上的可行性

### 2. Hailuo AI 视频生成 (2024-2025)

- Hailuo 01: 文本/图像到视频，对标早期 Sora
- Hailuo 02: 1080p 原生分辨率输出，物理模拟（重力、碰撞、流体）
- Hailuo 2.3: 更长时长、更复杂场景、更自然的运动
- 在全球视频生成评测中位列第一梯队，与 Sora、Kling、Veo 竞争

### 3. M2.5 (2026.2): 230B/10B 稀疏 MoE

- SWE-bench Verified: 80.2%——开源/开放模型中的编码能力新标杆
- Multi-SWE-bench 第一名（多语言编程评测）
- 比前版本推理速度快 37%，效率持续提升

### 4. Talkie (星野) 全球化成功

- Talkie 在美国等海外市场获得数千万月活用户
- AI 角色扮演+配音+长对话能力是其核心差异化
- 证明了中国 AI 产品在海外 C 端市场的竞争力

---

## 技术观点 (Technical Positions & Beliefs)

### 全模态是必然趋势

> *"未来的 AI 不是一个文本模型，而是能看、能听、能说、能创造的全模态系统。"*

闫俊杰的核心信念是"单一模态的 AI 无法满足真实世界需求"。MiniMax 从第一天起就布局文本、视频、语音、音乐的全模态产品线，这在中国 AI 六小龙中是独一无二的。他认为多模态不只是"加一个视觉编码器"，而是需要从模型架构层面实现真正的跨模态理解。

### Lightning Attention 是基础设施

> *"线性复杂度不是优化技巧，而是让 AI 处理真实世界长序列的基础。"*

闫俊杰认为传统 Softmax Attention 的 O(n²) 复杂度是 LLM 处理真实世界长文本（整本书、完整代码库、长视频）的根本障碍。Lightning Attention 的线性复杂度不是"锦上添花"，而是"让 AI 能像人类一样阅读整本书"的基础设施。参见 [[业界观点/Zhilin_Yang/about]] 的长上下文理念，二者从不同技术路径（Lightning Attention vs 长窗口）追求同一目标。

### C 端产品驱动

与 DeepSeek（研究驱动）和智谱 AI（学术驱动）不同，MiniMax 选择了"先做 C 端产品获取用户"的路径。闫俊杰认为"AI 的价值首先在 C 端产品中体现，只有被用户使用和验证的技术才有意义"。Talkie（星野）和海螺 AI 的成功证明了这一策略——先通过 C 端产品建立用户基础和数据飞轮，再做 API 平台和企业服务。

### 效率优先

> *"MiniMax 的名字来源于我们的目标——用最小化的计算实现最大化的智能。"*

MiniMax 在相对较少的融资规模下做出了与头部公司比肩的全模态产品。闫俊杰将这种"以少胜多"的能力归因于工程效率和架构创新（Lightning Attention、MoE）。

---

## 对 AI 领域的影响力评估 (Impact Assessment)

闫俊杰带领 MiniMax 实现了三个维度的突破：**技术层面**（Lightning Attention 成为线性注意力的标杆，M2.5 的编码能力进入全球第一梯队）；**产品层面**（Talkie 成为中国 AI 产品出海最成功的案例之一，Hailuo 视频生成进入全球第一梯队）；**战略层面**（开创了"全模态+C 端产品先行"的中国 AI 新模式）。MiniMax 是中国 AI 六小龙中最注重消费级产品的公司，也是唯一在海外 C 端市场取得显著成功的中国 AI 公司（Talkie 在美国月活超千万）。Hailuo 视频生成的崛起则打破了 Sora 在视频生成领域的"神话"，证明了中国团队在多模态生成领域的竞争力。

---

## 名言金句 (Memorable Quotes)

1. **"Lightning Attention 让 AI 能像人类一样阅读整本书，而不是只能看几页。"**

2. **"我们不只是做文本模型，我们在做一个能感知和创造多模态内容的 AI 系统。"**

3. **"Talkie 的成功证明，AI 的价值首先在 C 端产品中体现。"**

4. **"SWE-bench 80.2% 不是终点，而是 AI 编程能力的起点。"**

5. **"MiniMax 的名字来源于我们的目标——用最小化的计算实现最大化的智能。"**

---

## 公司/团队 (Current Role & Organization)

| 项目 | 详情 |
|------|------|
| **公司** | MiniMax (稀宇科技) |
| **成立** | 2021 年 12 月 |
| **总部** | 上海 |
| **融资** | 数十亿美元（腾讯、阿里、米哈游、红杉中国等），估值超 $25 亿 |
| **产品** | Talkie (星野)、Hailuo AI (海螺AI)、MiniMax API |
| **定位** | 中国 AI 六小龙之一，唯一以全模态+C 端为核心 |
| **团队规模** | ~500 人，核心来自商汤、微软、Google |

---

## 职业背景

- 商汤科技 (SenseTime) 副总裁，负责 NLP 和多模态研究
- 在商汤期间领导了多项视觉+NLP 的核心研究
- 2021 年底离开商汤，创办 MiniMax
- 团队核心来自商汤、微软亚洲研究院、Google
- 学术背景: 计算机视觉与机器学习博士

---

## 交叉引用 (Cross-References)

- [MiniMax 技术全景](../../大模型/Chinese_LLM_Ecosystem/MiniMax_Deep_Dive.md)
- [中国大模型生态全景](../../大模型/Chinese_LLM_Ecosystem/README.md)
- [长上下文模型 2026](../../大模型/LLM_Architectures/Long_Context_Models_2026.md)
- [[业界观点/Zhilin_Yang/about]] — Kimi 与 MiniMax 在长上下文上的技术竞赛
- [[业界观点/Wenfeng_Liang/about]] — DeepSeek 与 MiniMax 的效率路线对比
- [[业界观点/Jie_Tang/about]] — 智谱与 MiniMax 的多模态竞争
- [[业界观点/Jinze_Bai/about]] — Qwen 与 MiniMax 的全栈产品线对比
- [[业界观点/Sam_Altman/about]] — Sora vs Hailuo 在视频生成上的竞争

---

## 最新动态与权威来源 (Latest Updates & Sources)

- **MiniMax 官网**: [minimaxi.com](https://www.minimaxi.com/)
- **海螺 AI**: [hailuoai.video](https://hailuoai.video/)
- **Talkie**: [talkie-ai.com](https://talkie-ai.com/)
- **MiniMax 开源**: [HuggingFace — MiniMax](https://huggingface.co/MiniMaxAI)

---

*Last updated: 2026-07-11*

- [[业界观点/README|AI 名人演讲与观点 (Talks)]]
