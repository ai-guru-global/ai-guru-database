---
title: "L01 - 人工智能介绍与历史"
category: "90-learn-courses-microsoft"
tags: ["microsoft-ai-course", "ai-intro", "ai-history", "turing-test", "symbolic-ai"]
summary: "从‘什么是智能’出发，区分弱 AI 与强 AI、符号推理与神经网络两条路线，并梳理 AI 从专家系统到深度学习的历史脉络。"
source_url: "https://raw.githubusercontent.com/microsoft/AI-For-Beginners/main/lessons/1-Intro/README.md"
created: "2026-06-12"
updated: "2026-06-12"
tier: supporting
aliases:
  - "L01 Introduction And History Of Ai"
  - "L01 Introduction and History of AI"
  - L01_Introduction_and_History_of_AI

---
# L01 - 人工智能介绍与历史

> **一句话理解**: 人工智能研究的是如何让计算机表现出需要“智能”才能完成、但我们又难以用明确步骤描述的任务能力。

## 本课概览

本课是 Microsoft AI For Beginners 系列的第一课，不直接涉及代码，而是建立整个课程的认知坐标系。它先回答“什么是 AI”——不是简单的“让机器像人一样思考”，而是强调一类**无法被显式编程、却能从数据或交互中学习**的任务。随后介绍两种主流实现思路：自上而下的符号推理（Symbolic Reasoning）与自下而上的神经网络（Neural Networks），并回顾 AI 从 20 世纪中期的符号主义高峰、70 年代的 AI 寒冬，到 2010 年代后深度学习复兴的历史。

学习目标：
- 理解 AI 与常规算法任务的本质区别。
- 能区分弱人工智能（Weak AI / Narrow AI）与强人工智能（Strong AI / AGI）。
- 了解图灵测试（Turing Test）作为智能判定标准的思想与局限。
- 掌握符号推理与神经网络两种方法的核心差异与历史演变。
- 认识 ImageNet、CNN、ResNet、BERT、GPT 等推动现代 AI 的关键节点。

## 核心概念

- **人工智能（Artificial Intelligence, AI）**
  研究如何让计算机表现出通常需要人类智能才能完成的行为。关键特征是：任务难以用“先做什么、再做什么”的精确步骤描述，但可以通过示例、数据或经验让系统学会。

- **弱人工智能 / 狭义人工智能（Weak AI / Narrow AI）**
  为特定任务设计并训练的 AI，例如 Siri、Alexa、推荐算法、客服聊天机器人。它们在限定域内表现优异，但不具备通用理解、意识或跨域迁移能力。

- **强人工智能 / 通用人工智能（Strong AI / Artificial General Intelligence, AGI）**
  具备人类水平通用智能的理论系统，能完成任何人类智力任务、跨域适应，并可能拥有自我意识。目前 AGI 仍是研究目标，尚无系统达到。

- **图灵测试（Turing Test）**
  阿兰·图灵提出的智能判定方式：如果人类审讯者通过纯文本对话无法区分对方是真人还是机器，则机器可被视为具有智能。2014 年的 Eugene Goostman 聊天机器人曾让 30% 评委误判，但这是通过设定“13 岁乌克兰男孩”的人设规避知识缺陷，而非真正证明智能。

- **符号推理 / 自上而下方法（Symbolic Reasoning / Top-down Approach）**
  模仿人类显式推理过程：将专家知识提取为规则或符号表示，再由计算机进行逻辑推理。典型代表是专家系统（Expert Systems）。难点在于知识获取昂贵、规则维护困难，且许多任务（如从照片判断年龄）无法归结为符号操作。

- **神经网络 / 自下而上方法（Neural Networks / Bottom-up Approach）**
  模仿大脑中大量简单神经元（Neurons）的连接与学习机制。通过提供训练数据（Training Data），人工神经网络（Artificial Neural Network）可以从示例中自动调整权重并学会任务，更接近婴儿通过观察学习世界的方式。

- **机器学习（Machine Learning, ML）**
  AI 的一个子领域，让计算机基于数据学习解决问题。本课程主要聚焦神经网络与深度学习，经典 ML（如决策树、SVM）可参考微软 [ML-For-Beginners](https://github.com/microsoft/ML-For-Beginners) 或本库 [[机器学习/README]]。

## 关键知识点

- **AI 适合解决的任务特征**：人类能凭直觉完成，但难以写出完整、精确的步骤序列。例如图像识别、语音识别、自然语言理解、棋类游戏决策。
- **弱 AI 已广泛部署**：地图导航、语音助手、流媒体的推荐系统、游戏中的 NPC 行为等，都是弱 AI 的成功应用。
- **AGI 尚无实现路径**：当前所有系统都是 Narrow AI，强 AI 仍是理论与伦理讨论的焦点。
- **智能难以定义**：没有 universally accepted 的智能定义，因此图灵测试用“不可区分性”绕开定义难题，但它也容易被技巧绕过。
- **两条路线此消彼长**：
  - 1950s–1970s：符号 AI 主导，专家系统取得局部成功。
  - 1970s–1980s：知识工程瓶颈导致 **AI 寒冬（AI Winter）**。
  - 1990s–2000s：计算成本下降、数据增多，神经网络方法开始复兴。
  - 2010s 至今：深度学习在大规模数据集上展现优势，AI 几乎成为“神经网络”的代名词。
- **棋类程序的演进缩影**：
  - 早期：基于搜索与 alpha-beta 剪枝的显式算法。
  - 中期：基于案例推理（Case-based Reasoning），从人类棋局中学习相似局面。
  - 现代：神经网络 + 强化学习（Reinforcement Learning），如 AlphaZero 通过自我对弈学习。
- **对话系统的演进缩影**：
  - 早期 ELIZA：基于简单语法规则重写输入。
  - 现代助手（Cortana/Siri/Google Assistant）：神经网络负责语音转文本与意图识别，再用规则或显式算法执行动作。
  - 未来趋势：端到端神经网络模型，如 GPT 系列与 Turing-NLG。
- **近年里程碑**：
  | 年份 | 达到人类水平或接近人类水平的任务 |
  |------|----------------------------------|
  | 2015 | ImageNet 图像分类（ResNet） |
  | 2016 | 会话语音识别 |
  | 2018 | 中英自动机器翻译 |
  | 2020 | 图像描述生成（Image Captioning） |
- **大语言模型兴起的原因**：海量通用文本数据 + 预训练（Pre-training）+ 微调（Fine-tuning）范式，使 BERT、GPT-3 等模型能捕捉语言结构与语义。

## 代码/实验说明

本课为纯理论导入，不附带可运行 Jupyter Notebook。官方提供的是：

- **课前测验（Pre-lecture quiz）**: [在线测验](https://ff-quizzes.netlify.app/en/ai/quiz/1)
- **课后测验（Post-lecture quiz）**: [在线测验](https://ff-quizzes.netlify.app/en/ai/quiz/2)
- **课后作业（Assignment）**: [Game Jam](https://github.com/microsoft/AI-For-Beginners/blob/main/lessons/1-Intro/assignment.md) —— 鼓励学员调研一个自己最感兴趣的 AI 应用场景（如地图应用、语音转文字、电子游戏），分析其系统构建方式。

如果希望结合代码开启后续课程，可先完成课程环境配置（[Lesson 00 环境设置](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/0-Course-Setup)），并确保已安装 PyTorch 或 TensorFlow。

## 本课不覆盖与延伸

- **不覆盖**：
  - 如何具体实现神经网络训练（后续 L03–L05 逐步展开）。
  - 经典机器学习算法细节（推荐配合 [[机器学习/README]] 或 ML-For-Beginners 课程）。
  - AI 伦理与负责任 AI（L24 专门讨论）。
- **延伸**：
  - 想深入 AI 发展时间线：[[AI入门/AI_History_Timeline]]
  - 想巩固 AI 基础概念：[[AI入门/AI_Fundamentals]]
  - 想了解神经网络核心机制：[[深度学习/Neural_Network_Core/Neural_Network_Core]]
  - 想了解现代深度学习爆发背景：[[大模型/LLM_Architectures/LLM_Architectures]]、[[计算机视觉/README]]

## 相关阅读

- 课程索引：[[90_Learn/courses/microsoft/microsoft_ai_for_beginners]]
- 本库相关页面：[[AI入门/AI_Fundamentals]]、[[AI入门/AI_History_Timeline]]
