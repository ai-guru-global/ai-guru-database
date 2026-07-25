---
title: Andrej Karpathy 简介 (Andrej Karpathy)
category: 19-talks-andrej-karpathy
tags: ["talks", "speeches", "insights", "leaders", "Tesla", "OpenAI", "Software-2.0", "Vibe-Coding", "AI-education", "autonomous-driving"]
summary: "**一句话概括**: 前 Tesla AI 总监、OpenAI 创始成员、知名 AI 教育者——"Software 2.0" 概念提出者、"Vibe Coding" 术语首创者，将前沿 AI 研究转化为大众可及的教育内容的标杆人物。"
created: 2026-05-31
updated: 2026-07-11
tier: supporting
aliases:
  - About
sources: []

---
# Andrej Karpathy 简介 (Andrej Karpathy)

## 一句话概括

> 前 Tesla AI 总监（2017-2022）、OpenAI 创始成员（2015-2017, 2023-2024）、知名 AI 教育者——"Software 2.0"概念提出者、"Vibe Coding"术语首创者，Stanford CS231n 课程的缔造者，将自动驾驶、大模型和深度学习教育融为一体，是全球最具影响力的 AI 实践型布道者之一。

---

## 核心贡献 (Key Contributions)

- **"Software 2.0" 概念 (2017)**: 提出现代软件正在从"人写代码"（Software 1.0）转向"用数据训练神经网络"（Software 2.0）的范式转移。神经网络权重本身就是一种新型"源代码"，通过数据而非人工逻辑来定义程序行为。这一概念深刻影响了行业对 AI 工程化的认知，被广泛引用。
- **Stanford CS231n 课程**: 在 Fei-Fei Li 指导下，创建并主讲了斯坦福第一门深度学习视觉课程 CS231n: Convolutional Neural Networks for Visual Recognition。课程内容（讲义、作业）全部开源，成为全球深度学习教育的标杆教材，影响了无数工程师和研究者。
- **Tesla Autopilot 感知栈**: 担任 Tesla AI 总监期间，领导自动驾驶视觉感知系统的开发，推动从基于规则的方案转向纯端到端神经网络方案。Tesla 的纯视觉（Pure Vision）路线——不依赖激光雷达，仅用摄像头——在很大程度上体现了 Karpathy 的技术哲学。
- **"Vibe Coding" 术语 (2025.02)**: 2025 年 2 月在 X (Twitter) 上提出 "Vibe Coding" 概念，描述一种全新的开发范式——开发者完全用自然语言指挥 AI（如 Claude、Cursor）编写代码，根据"感觉"（vibes）迭代，不再细究每一行代码。该词迅速成为行业热词。
- **LLM 教育与 nanogpt**: 从零开始构建 nanoGPT（一个约 300 行的 GPT 架构实现）和 llm.c（纯 C/CUDA 的 GPT 训练代码），以最简洁的形式教育大众理解大模型内部原理。他的 YouTube 教学视频（如"Let's build GPT from scratch"）观看量数百万。

---

## 代表性演讲与论文 (Notable Talks & Papers)

### 1. "Software 2.0" 博文 (2017.11)

> *"神经网络的权重就是 Software 2.0 的'源代码'。"*

- **核心要点**: 系统论证了 AI 正在重新定义软件开发范式——从人写规则转向数据驱动学习
- **来源**: [Software 2.0 (Medium)](https://karpathy.medium.com/software-2-0-a64152b37c35)
- **影响**: 被广泛引用和讨论，成为理解 AI 工程化的核心框架

### 2. "State of Computer Vision & AI at Tesla" 演讲 (2019)

> *"我们需要一个端到端可微的神经网络——从摄像头像素到方向盘控制。"*

- **核心要点**: 在 CVPR 等场合详细阐述 Tesla 的纯视觉自动驾驶方案和数据引擎
- **影响**: 展示了大规模 AI 系统在真实生产环境中的工程实践

### 3. "Vibe Coding" 推文 (2025.02)

> *"一种新的编程方式——你完全用自然语言指挥 AI……接受一切，你几乎不看代码。"*

- **核心要点**: 用幽默而生动的语言描述了 AI 辅助编程的最新形态，引发了行业对"编程范式变革"的广泛讨论
- **来源**: [Vibe Coding 原始推文](https://x.com/karpathy/status/1886192184808213008)
- **影响**: "Vibe Coding"成为 2025 年最具传播力的 AI 术语之一

### 4. "Let's build GPT: from scratch, in code" YouTube 系列

> *"理解一个东西最好的方式，就是从零开始重建它。"*

- **核心要点**: 用数小时的视频从零构建一个 GPT 模型，让大众真正理解 Transformer 的内部机制
- **影响**: 成为 AI 教育领域最经典的内容之一

---

## 技术观点 (Technical Positions & Beliefs)

### Software 2.0：神经网络将取代传统编程

Karpathy 的核心信念：
- 越来越多的传统软件任务（视觉、语言、决策）将被神经网络取代
- 这不是"AI 辅助编程"，而是编程范式本身的根本转变
- Vibe Coding 是 Software 2.0 在开发工具层面的进一步体现——开发者从"写代码"变成"指挥 AI"

### 端到端学习优于模块化设计

- 在 Tesla 期间坚定推动纯视觉端到端方案
- 认为从原始数据到最终行为的端到端可微网络，优于人工拆分模块
- 这一哲学影响了自动驾驶乃至机器人系统的设计趋势

### 教育民主化

- Karpathy 坚信最好的教育内容应该是免费和开源的
- 他的 CS231n 讲义、YouTube 视频、nanoGPT 代码都体现了这一理念
- 他被业界称为"AI 领域最好的老师"

### 务实开源

- 支持开源，但更关注实用价值而非意识形态争论
- 从 Stanford 到 Tesla 到 OpenAI 再到独立创业，他始终在推动 AI 知识和工具的可及性

---

## 公司/团队 (Current Role & Organization)

| 项目 | 详情 |
|------|------|
| **当前职位** | Eureka Labs 创始人（2024 至今）——专注 AI 教育的创业公司 |
| **前身** | OpenAI 创始成员（2015-2017）；Tesla AI 总监（2017-2022）；OpenAI（2023-2024 短暂回归） |
| **公司总部** | 美国 |
| **关键产品/研究** | Tesla Autopilot 视觉栈、nanoGPT、llm.c、CS231n、"Software 2.0"、"Vibe Coding" |
| **个人荣誉** | ICML 最佳论文奖；被 MIT Tech Review 评为 35 岁以下创新者 |
| **学术背景** | 斯坦福大学计算机科学博士（2015，师从 Fei-Fei Li）；多伦多大学本科；UBC 硕士 |

---

## 关键时间线 (Timeline)

```
2011    在 Stanford 跟随 Fei-Fei Li 攻读博士
2015    创建 CS231n 课程；获斯坦福博士学位
2015    作为创始成员加入 OpenAI
2017    加入 Tesla，担任 AI 总监（Autopilot 感知团队）
2017.11 发表 "Software 2.0" 博文
2022.07 离开 Tesla
2023    短暂回归 OpenAI
2024    创立 Eureka Labs（AI 教育公司）
2025.02 提出 "Vibe Coding" 概念，引爆行业讨论
```

---

## 名言金句 (Memorable Quotes)

1. **"Software 1.0 is code we write. Software 2.0 is code learned from data."**
   *"Software 1.0 是我们写的代码。Software 2.0 是从数据中学到的代码。"*
2. **"There's a new kind of coding I call 'vibe coding'... You just give in to the vibes, accept everything."**
   *"有一种新的编程方式我称之为'Vibe Coding'……你就随着感觉走，接受一切。"*
3. **"The best way to understand something is to build it from scratch."**
   *"理解一个东西最好的方式，就是从零开始构建它。"*
4. **"A lot of the most exciting progress in AI comes from removing human-engineered components."**
   *"AI 中最令人兴奋的进步，往往来自于移除人工设计的组件。"*
5. **"If you're not embarrassed by your first version, you've launched too late."**
   *"如果你不对你的第一个版本感到尴尬，那你发布得太晚了。"*

---

## 交叉引用 (Cross-References)

- [Talks 主题合成 2026](业界观点/Talks_Synthesis/Talks_Synthesis_2026.md) — 查看 Karpathy 在各主题中的立场
- [[业界观点/Fei_Fei_Li/about]] — Fei-Fei Li 是 Karpathy 的博士导师
- [[业界观点/Elon_Musk/about]] — Musk 是 Tesla CEO，Karpathy 在其麾下领导 AI
- [Vibe Coding 方法论](编程/Methodology/Vibe_Coding_Methodology.md) — 详细方法论
- [AI 历史时间线](入门/Fundamentals/AI_History_Timeline.md) — Software 2.0 与自动驾驶
- [深度学习基础](../../深度学习/README.md) — CS231n 与视觉模型
- [大模型基础](../../大模型/README.md) — nanoGPT 与 GPT 架构

---

## 最新动态与权威来源 (Latest Updates & Sources)

- **个人主页 (Official Site)**: [karpathy.ai](https://karpathy.ai/)
- **Vibe Coding 原始推文**: [2025 年 2 月提出 "Vibe Coding" 概念](https://x.com/karpathy/status/1886192184808213008)
- **Software 2.0 博文**: [karpathy.medium.com](https://karpathy.medium.com/software-2-0-a64152b37c35)
- **Vibe Coding 方法论详解**: [Vibe Coding 方法论](编程/Methodology/Vibe_Coding_Methodology.md)
- **YouTube 频道**: [Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy)
- **GitHub**: [github.com/karpathy](https://github.com/karpathy)

---

*Last updated: 2026-07-11*

## Related

- [[业界观点/Andrew_Ng/about]] — Andrew Ng 简介 (Andrew Ng) (共享: insights, leaders, speeches, talks)
- [[业界观点/Andrew_Ng/sayings]] — Andrew Ng 关于 AI 的观点与格言 (共享: insights, leaders, speeches, talks)
- [[业界观点/Bill_Gates/about]] — Bill Gates 简介 (Bill Gates) (共享: insights, leaders, speeches, talks)
- [[业界观点/Bill_Gates/sayings]] — Bill Gates 关于 AI 的观点 (Bill Gates on AI) (共享: insights, leaders, speeches, talks)
- [[业界观点/README.md|README]]
- [[业界观点/Andrej_Karpathy/sayings.md|sayings]]

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
