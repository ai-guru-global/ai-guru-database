---
title: 'Stage 0: AI 觉醒'
category: '90-learn-concepts'
tags: ["learning", "education", "courses", "study-path"]
summary: '> **"在你学习如何建造之前，先理解你在建造什么。"**'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Stage0 Awakening"
  - "stage0 awakening"
  - stage0_awakening

---
# Stage 0: AI 觉醒

> **"在你学习如何建造之前，先理解你在建造什么。"**
>
> 本层目标：建立对 AI 的直觉认知，消除神秘感，知道 AI 能做什么、不能做什么。

## 本层概要

| 属性 | 值 |
|------|---|
| 包含核心概念 | 8 个 |
| 预计学习时间 | 3-5 小时 |
| 前置依赖 | 无（起点） |
| 适合人群 | 所有人 |

---

## 概念列表

### 1. AI 是什么 (Artificial Intelligence)

- **一句话定义**：让机器表现出需要智能才能完成的行为的技术总称。
- **为什么重要**：这是所有后续学习的出发点。不理解定义，就无法判断什么算 AI、什么不算。
- **通俗类比**：AI 就像教小孩子——不是把答案写进脑子里，而是让它通过"看例子"、"试错"、"得反馈"来自己学会。
- **入门阅读**：[AI 基础概念入门](../../00_AI_Introduction/AI_Fundamentals.md)
- **深入学习**：[AI 技术全景概览](../../00_AI_Introduction/AI_Technology_Landscape.md)
- **关联概念**：AI 三大类型、机器学习、深度学习

### 2. AI 的三大类型

- **一句话定义**：
  - **弱人工智能 (ANI)**：擅长单一任务（如下棋、识图）的 AI —— 现阶段所有 AI 都属于此类
  - **通用人工智能 (AGI)**：具备人类级别全面智能的 AI —— 尚未实现，是研究目标
  - **超人工智能 (ASI)**：远超人类所有认知能力的 AI —— 更遥远的未来概念
- **为什么重要**：帮你正确评估当前 AI 的能力边界。ChatGPT 很强，但它仍然是 ANI。
- **通俗类比**：ANI 是计算器（只会算数），AGI 是一个博学的人（什么都能学），ASI 是爱因斯坦 + 达芬奇 + 所有领域顶尖大脑的总和。
- **入门阅读**：[AI 基础概念入门](../../00_AI_Introduction/AI_Fundamentals.md) → "AI 的三大类型" 章节
- **关联概念**：AI 能力边界、AGI 路径

### 3. AI 能力边界

- **一句话定义**：当前 AI 擅长和不擅长的领域分界线。
- **为什么重要**：避免过度神话 AI，也避免低估 AI。正确的预期是有效使用 AI 的前提。
- **当前 AI 擅长的**：模式识别（图像/语音/文本）、生成内容（文字/图片/代码）、大规模信息处理、确定性规则的自动化
- **当前 AI 不擅长的**：真正的新颖推理、长期规划、因果理解、常识判断、跨域迁移
- **入门阅读**：[AI 基础概念入门](../../00_AI_Introduction/AI_Fundamentals.md) → "AI 的能力与局限" 章节
- **关联概念**：AI 三大类型、幻觉问题 (Hallucination)

### 4. 机器学习 vs 传统编程

- **一句话定义**：
  - **传统编程**：人写规则 → 计算机执行
  - **机器学习**：人给数据 + 期望输出 → 计算机自己学会规则
- **为什么重要**：这是理解整个 AI 领域最关键的思维转换。
- **通俗类比**：传统编程像给菜谱让厨师照做；机器学习像是让厨师尝了一百道菜后自己总结出做法。
- **入门阅读**：[AI 基础概念入门](../../00_AI_Introduction/AI_Fundamentals.md) → "AI 工作原理" 章节
- **深入学习**：[监督学习入门](../../02_Machine_Learning/Supervised_Learning/Supervised_Learning_for_dummy.md)
- **关联概念**：训练数据、模型、特征

### 5. 经典 AI 案例

- **一句话定义**：改变历史进程的里程碑式 AI 系统。
- **为什么重要**：通过具体案例建立感性认识，每个案例代表一个技术时代的巅峰。

| 案例 | 年份 | 代表意义 | 关联技术 |
|------|------|---------|---------|
| Deep Blue 击败卡斯帕罗夫 | 1997 | AI 在封闭规则领域超越人类 | 搜索 + 评估函数 |
| ImageNet 分类超越人类 | 2015 | 深度学习在视觉上的突破 | CNN |
| AlphaGo 击败李世石 | 2016 | RL + 深度学习的结合 | 强化学习 + 策略网络 |
| GPT-3 / ChatGPT | 2020-2022 | 大语言模型的涌现能力 | Transformer + 预训练 |
| Sora 视频生成 | 2024 | 扩散模型在视频生成上的突破 | Diffusion + Transformer |

- **入门阅读**：[AI 经典案例分析集](../../00_AI_Introduction/AI_Classic_Cases.md)
- **关联概念**：深度学习、Transformer、强化学习、扩散模型

### 6. AI 发展历史与四次浪潮

- **一句话定义**：AI 从 1950 年代至今的演进脉络，大致经历了四次主要浪潮。

| 浪潮 | 时期 | 核心技术 | 代表成就 |
|------|------|---------|---------|
| 符号主义 | 1956-1980 | 规则推理、专家系统 | 逻辑理论机、专家系统 |
| 统计学习 | 1980-2010 | SVM、概率图模型、贝叶斯方法 | 垃圾邮件过滤、推荐系统 |
| 深度学习 | 2012-2022 | CNN、RNN、Attention、Transformer | AlphaGo、图像识别超越人类 |
| 大模型 | 2020-至今 | GPT 系列、预训练+微调、多模态 | ChatGPT、Sora、Claude |

- **入门阅读**：[AI 历史与发展时间线](../../00_AI_Introduction/AI_History_Timeline.md)
- **关联概念**：Transformer、GPT、AGI 路径

### 7. 当前 AI 工具生态

- **一句话定义**：2026 年你可以直接使用的 AI 产品和工具矩阵。

| 类别 | 代表工具 | 用途 |
|------|---------|------|
| 对话型 LLM | ChatGPT (GPT-5.2)、Claude (4.5)、Gemini | 对话、写作、分析、编程 |
| 编程助手 | Cursor、Claude Code、Windsurf、Devin | 代码生成、调试、重构 |
| 图像生成 | Midjourney、DALL-E、Stable Diffusion | 图片创作、设计 |
| Agent 平台 | Dify、Coze、LangGraph | 构建 AI Agent 工作流 |
| 开源框架 | PyTorch、Hugging Face、vLLM | 模型训练与部署 |

- **入门阅读**：[AI 工具与实践指南](../../00_AI_Introduction/AI_Tools_Practical_Guide.md)
- **关联概念**：LLM、Agent、部署推理

### 8. AI 伦理与社会影响

- **一句话定义**：AI 发展带来的社会变革、风险和治理议题。
- **核心议题**：算法偏见与公平性、隐私保护、就业影响、信息生态（深假/虚假信息）、AI 治理与法规（如 EU AI Act）
- **入门阅读**：[AI 伦理与社会影响](../../00_AI_Introduction/AI_Ethics_Society.md)
- **深入学习**：[价值对齐](../../17_Ethics_Safety/Value_Alignment/Value_Alignment_for_dummy.md) | [AI 安全与红队](../../17_Ethics_Safety/AI_Safety_RedTeaming/AI_Safety_RedTeaming_for_dummy.md)

---

## 学完本层的标志

- [ ] 能用自己的话解释什么是 AI，以及它与传统软件的区别
- [ ] 能说出 AI 目前的能力边界（至少各举 2 例擅长和不擅长的）
- [ ] 能按时间顺序说出 AI 发展的四次浪潮及代表性技术
- [ ] 至少亲手使用过 2 种以上 AI 工具（如 ChatGPT + Cursor）
- [ ] 能列举至少 3 个 AI 伦理相关的真实问题

## 下一步

完成 Stage 0 后：
- **想系统学技术** → 进入 [Stage 1: 基础概念](./stage1_foundation.md)
- **只想通识了解** → 进入 [零基础通识路径](../pathways/absolute-beginner.md)
- **想做产品/管理** → 进入 [AI 产品经理路径](../pathways/product-manager.md)

## Related

- [[00_AI_Introduction/AI_Learning_Resources.md|AI_Learning_Resources]]
