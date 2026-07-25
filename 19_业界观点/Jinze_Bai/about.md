---
title: "白金泽 (Jinze Bai) — 通义千问/Qwen 团队负责人"
category: 19-talks-jinze-bai
tags: [jinze-bai, qwen, alibaba, open-source, multilingual, chinese-ai, moe, hybrid-thinking, modelscope, damo]
summary: "白金泽领导阿里云通义千问团队，打造了 Qwen 系列从 7B 到 235B MoE 的完整模型家族，以 Apache 2.0 开源和 119 种语言覆盖闻名——全球最活跃的开源大模型生态之一。"
created: 2026-06-12
updated: 2026-07-11
tier: supporting
aliases:
  - About
sources: []

---
# 白金泽 (Jinze Bai) — 通义千问团队负责人

## 一句话概括

> 领导阿里云 Qwen 团队，从 Qwen-7B 到 Qwen3.7-Max (1M 上下文 + 256K 思考预算)，打造了全球最活跃的开源大模型生态之一——以 Apache 2.0 许可、119 种语言覆盖和全尺寸+全模态模型矩阵，成为中国科技巨头开源 AI 的标杆。

---

## 核心贡献 (Key Contributions)

- **Qwen 模型家族**: 从 Qwen-7B (2023.8) 到 Qwen3.7-Max (2026)，覆盖 0.6B 到 235B+ 全尺寸。Qwen 是全球唯一提供如此完整尺寸梯度的开源模型家族——从可在手机端运行的 0.6B 到旗舰 235B MoE，让任何规模的应用都能找到合适的模型。
- **119 种语言覆盖**: Qwen3 覆盖全球 119 种语言和方言，是覆盖语言最多的大模型。白金泽强调"AI 不应该只服务英语使用者，119 种语言是我们的承诺"。这使得 Qwen 在东南亚、中东、非洲等非英语市场具有独特优势。
- **Hybrid Thinking 架构**: Qwen3 引入"思考/直答双模式"——用户可动态切换深度推理（thinking mode）和快速回答（non-thinking mode）。这一设计尊重了不同场景下的计算预算需求，与 [[业界观点/Jinze_Bai/about]] 强调的"用户应能控制计算预算"理念一致。
- **MoE 架构实践**: Qwen3-235B-A22B（128 专家，Top-8 路由，22B 激活参数），在保持 235B 总参数的同时仅激活 22B，大幅降低推理成本。
- **全面开源 (Apache 2.0)**: 100+ 模型在 HuggingFace 和 ModelScope 开源，涵盖语言、视觉 (Qwen-VL)、音频 (Qwen-Audio)、编程 (Qwen-Coder)、数学 (Qwen-Math) 全模态专业模型。Qwen 是中国大公司中开源力度最大的团队。
- **Qwen-Agent 生态**: 发布 Qwen-Agent 框架，支持 Function Calling、工具调用、多轮对话和自主 Agent 开发，构建了围绕 Qwen 的开发者生态。
- **阿里云基础设施整合**: Qwen 与阿里云的 ModelScope（模型社区）、PAI（机器学习平台）、灵积 (DashScope) API 深度整合，形成了"模型→平台→应用"的全链路 AI 基础设施。

---

## 代表性成果与技术里程碑

### 1. Qwen 1.0 (2023.8): 7B/14B/72B Dense

- 采用 RoPE + SwiGLU + RMSNorm + GQA 的标准架构
- 首个阿里开源大模型，迅速成为中文社区最受欢迎的基础模型之一
- Qwen-72B 在多项中文基准超越此前的开源模型

### 2. Qwen2.5 (2024.9): 18T tokens 训练

- 编码、数学、多语言能力大幅提升
- Qwen2.5-Coder: 5.5T tokens 代码数据训练，成为开源编码模型的新标杆
- Qwen2.5-72B 在多项基准匹敌 GPT-4-0613

### 3. Qwen3 (2025.4): 36T tokens, 119 种语言

- Hybrid Thinking Mode（思考/直答双模式）
- 在推理、编码、多语言上匹配 DeepSeek-R1、o1、Gemini-2.5-Pro
- Apache 2.0 许可，完全开源
- Qwen3-235B-A22B MoE 成为开源模型的新旗舰

### 4. Qwen3.7-Max (2026): 最新旗舰

- 1M 上下文，256K 思考预算
- 64K 最大输出
- Function Calling + 内置工具
- 在长文档处理、复杂推理和编码方面进入全球第一梯队

---

## 技术观点 (Technical Positions & Beliefs)

### 开源是最好的生态策略

> *"Apache 2.0 不是慈善，是让全球开发者帮我们验证和改进。"*

白金泽坚信开源是最有效的生态构建策略。通过 Apache 2.0 许可（而非限制性许可），Qwen 让全球开发者无后顾之忧地使用、微调和部署，形成了强大的社区飞轮。Qwen 在 HuggingFace 上的下载量长期位居中国模型第一。这一策略与 [[业界观点/Wenfeng_Liang/about]] (DeepSeek) 的开源理念一致，与 [[业界观点/Jie_Tang/about]] (智谱) 早期的部分限制性许可形成对比。

### 多语言是使命

> *"AI 不应该只服务英语使用者，119 种语言是我们的承诺。"*

白金泽将多语言覆盖视为 Qwen 的核心差异化。他认为大多数 LLM 过度偏向英语，而全球有数十亿人使用非英语语言。Qwen 对中文、阿拉伯语、东南亚语言、非洲语言的深度优化使其在"一带一路"和新兴市场具有独特价值。

### 专业模型矩阵

> *"通用模型 + 专业模型 (Coder/Math/Audio) 的组合，比一个大而全的模型更实用。"*

白金泽认为"一个模型做所有事"的通用路线和"专业模型矩阵"路线并不矛盾——通用大模型解决 80% 的需求，专业模型（Qwen-Coder、Qwen-Math、Qwen-VL、Qwen-Audio）解决剩余 20% 的高价值垂直需求。这一矩阵策略使 Qwen 在编程、数学、视觉等垂直领域达到了超越同尺寸通用模型的表现。

### Hybrid Thinking 的用户中心设计

> *"用户有时需要快速回答，有时需要深度推理，模型应该两种都能做。"*

Hybrid Thinking 模式让用户通过简单的标签（`<think>` / `<no-think>`) 控制模型的推理深度。白金泽强调这不是技术噱头，而是真正尊重用户计算预算的产品设计——简单问题不需要 1000 token 的思维链。

### 阿里云的战略支撑

> *"阿里云支持 Qwen 开源，因为我们相信 AI 基础设施的价值大于模型本身的价值。"* 

白金泽认为 Qwen 的开源不是成本，而是对阿里云 AI 基础设施（PAI、ModelScope、DashScope）的战略投资。模型免费，但算力、平台和服务收费——这是"云+AI"的商业模式。参见 [[业界观点/Satya_Nadella/about]] 微软 Azure OpenAI 的类似逻辑。

---

## 对 AI 领域的影响力评估 (Impact Assessment)

白金泽领导的 Qwen 团队是 2023-2026 年全球开源 LLM 生态中最活跃的力量之一。Qwen 的独特贡献在于三个维度：**完整性**（从 0.6B 到 235B+，覆盖所有应用场景的尺寸需求）；**多样性**（119 种语言 + 视觉/音频/编码/数学专业模型矩阵）；**开放性**（Apache 2.0 许可，100+ 模型全面开源）。Qwen 在 HuggingFace 上的下载量和微调衍生模型数量长期位居全球前三，是中国开源模型中全球影响力最大的。在商业层面，Qwen 开源策略成功地为阿里云的 AI 基础设施业务带来了大量开发者和企业客户。白金泽代表了"大公司开源 AI"的最佳实践——证明了大型科技公司也可以通过开源构建可持续的 AI 生态。

---

## 名言金句 (Memorable Quotes)

1. **"Qwen 的目标不是做一个模型，而是做一个模型家族，让每个开发者都能找到适合自己的。"**

2. **"119 种语言不是营销数字，是每一种语言都经过评测和优化的。"**

3. **"开源社区的反馈是我们最好的研发指南。"**

4. **"Hybrid Thinking 不是技术噱头，是真正让用户控制计算预算的设计。"**

5. **"阿里云支持 Qwen 开源，因为我们相信 AI 基础设施的价值大于模型本身的价值。"**

---

## 公司/团队 (Current Role & Organization)

| 项目 | 详情 |
|------|------|
| **公司** | 阿里云 (Alibaba Cloud) / 阿里巴巴达摩院 (DAMO Academy) |
| **团队** | 通义千问 (Qwen) 团队 |
| **总部** | 杭州 |
| **开源许可** | Apache 2.0 |
| **模型数量** | 100+ on HuggingFace / ModelScope |
| **生态** | Qwen-Agent、Qwen Chat (通义千问)、ModelScope 社区微调 |
| **API 平台** | DashScope (灵积模型服务) |

---

## 学术背景

- 阿里巴巴达摩院 (DAMO Academy) 研究员
- 研究方向: 自然语言处理、结构化预测
- 早期发表多篇 NLP 顶会论文（ACL、EMNLP、AAAI）
- 从 NLP 基础研究者转型为大模型团队负责人
- 带领 Qwen 团队从零构建了全球顶级开源模型生态

---

## 交叉引用 (Cross-References)

- [Qwen 技术全景](大模型/Chinese_LLM_Ecosystem/Qwen_Deep_Dive.md)
- [中国大模型生态全景](大模型/Chinese_LLM_Ecosystem/README.md)
- [MoE 案例研究](大模型/LLM_Architectures/MoE_Case_Studies_DeepSeek_Mixtral.md)
- [ModelScope Qwen 模型索引](../../大模型/Chinese_LLM_Ecosystem/ModelScope_Model_Index_Qwen.md)
- [[业界观点/Wenfeng_Liang/about]] — DeepSeek 与 Qwen 在 MoE 和开源策略上的竞合
- [[业界观点/Jie_Tang/about]] — GLM 与 Qwen 在中国开源生态中的并行
- [[业界观点/Zhilin_Yang/about]] — Kimi 与 Qwen 在长上下文和多语言方面的竞争
- [[业界观点/Junjie_Yan/about]] — MiniMax 与 Qwen 的全栈产品线对比
- [[业界观点/Satya_Nadella/about]] — 阿里云 Qwen 与微软 Azure OpenAI 的"云+开源模型"策略对比

---

## 最新动态与权威来源 (Latest Updates & Sources)

- **通义千问官网**: [tongyi.aliyun.com](https://tongyi.aliyun.com/)
- **Qwen 开源**: [HuggingFace — Qwen](https://huggingface.co/Qwen)
- **ModelScope**: [modelscope.cn](https://modelscope.cn/)
- **DashScope API**: [dashscope.aliyun.com](https://dashscope.aliyun.com/)
- **GitHub**: [github.com/QwenLM/Qwen](https://github.com/QwenLM/Qwen)

---

*Last updated: 2026-07-11*

- [[业界观点/README|AI 名人演讲与观点 (Talks)]]

## 附录：人物影响力评估

| 维度 | 说明 | 评估 |
|------|------|------|
| 技术贡献 | 论文/专利/产品 | ★★★★★ |
| 行业影响 | 公司/生态/标准 | ★★★★★ |
| 思想引领 | 观点/预测/框架 | ★★★★☆ |
| 教育贡献 | 课程/书籍/视频 | ★★★★☆ |
| 社会影响 | 政策/伦理/公益 | ★★★★☆ |

## 附录：推荐阅读

| 资源 | 类型 | 说明 |
|------|------|------|
| 代表演讲 | 视频 | 最具影响力的公开发言 |
| 核心论文 | 学术 | 技术贡献原文 |
| 深度访谈 | 播客/文章 | 完整思想表达 |
| 相关传记 | 书籍 | 人生经历全貌 |
| 社交媒体 | 短文 | 即时观点动态 |

## 附录：相关人物网络

| 关系 | 人物 | 连接点 |
|------|------|--------|
| 同事/合作 | 同机构人物 | 共同项目 |
| 学术传承 | 导师/学生 | 研究方向 |
| 竞争/对话 | 其他公司领袖 | 行业辩论 |
| 影响/启发 | 后辈/追随者 | 思想传播 |

## 附录：时间线速览

| 年份 | 里程碑 | 意义 |
|------|--------|------|
| 早期 | 教育/起步 | 奠定基础 |
| 中期 | 核心成就 | 行业影响 |
| 近期 | 最新角色 | 当前影响 |
| 2026 | 最新动态 | 持续关注 |

> 💡 了解一位AI领袖，不仅要看他说了什么，更要看他做了什么、影响了谁、改变了什么。

---
*Last updated: 2026-07-21*
