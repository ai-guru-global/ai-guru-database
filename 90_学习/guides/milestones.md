---
title: 里程碑自测
category: 90-learn-guides
tags: ["learning", "education", "courses", "study-path"]
summary: "> **用这些问题检验你对每个 Stage 的理解程度。如果能回答大部分问题，说明你已经达到了该阶段的学习目标。**"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - Milestones
sources: []

name_zh: "里程碑自测"
---
# 里程碑自测

> 中文简称：里程碑自测

> **用这些问题检验你对每个 Stage 的理解程度。如果能回答大部分问题，说明你已经达到了该阶段的学习目标。**

---

## Stage 0: AI 觉醒

### 自测问题

**Q1.** 用一句话解释什么是 AI。它和传统软件最大的区别是什么？

**Q2.** 当前 AI（ANI）擅长什么？不擅长什么？请各举 3 个具体例子。

**Q3.** 按时间顺序说出 AI 发展的四次浪潮，并标注每个浪潮的核心技术。

**Q4.** 请列举 3 个你认为最关键的 AI 伦理问题，并简述各方观点。

**Q5.** 机器学习和传统编程的范式区别是什么？各举一个生活中的例子。

**Q6.** 你用过哪些 AI 工具？请描述一个你体验过的、印象最深的 AI 能力。

### 通过标准

- 能正确回答 Q1-Q3 → 基础认知达标
- 能正确回答 Q4-Q6 → 全面理解达标
- 全部能回答 → Stage 0 完成 ✓

### 未通过时的补救

| 问题 | 补救建议 |
|------|---------|
| Q1-Q3 | 回到 [Stage 0 概念卡](../concepts/stage0_awakening.md)，重点阅读 AI 定义、AI 能力边界、历史部分 |
| Q4 | 阅读 [AI 伦理与社会影响](00_入门/04_Ethics_and_Future/AI_Ethics_Society.md) |
| Q5-Q6 | 阅读 [监督学习入门](02_机器学习/02_Supervised_Learning/Supervised_Learning_for_dummy.md) |

---

## Stage 1: 基础概念

### 自测问题

**Q1.** 数据、特征、模型三者之间的关系是什么？请用房价预测举例说明。

**Q2.** 训练和推理的区别是什么？请从目标、耗时、算力需求三个维度对比。

**Q3.** 什么是损失函数？举一个分类问题和回归问题常用的损失函数。

**Q4.** 请画出欠拟合 / 刚好 / 过拟合三种情况的误差-复杂度曲线图，并说明如何应对过拟合。

**Q5.** 为什么不能用测试集的结果来调整模型？请解释 Train / Val / Test 各自的作用。

**Q6.** 准确率在什么情况下会误导我们？什么指标能解决这个问题？

**Q7.** 监督学习、无监督学习、强化学习三者的核心区别是什么？请各举一个实际应用场景。

### 通过标准

- 能正确回答 Q1-Q4 → 基础理解达标
- 能正确回答 Q5-Q7 → 深入理解达标
- 全部能回答 → Stage 1 完成 ✓

### 未通过时的补救

| 问题 | 补救建议 |
|------|---------|
| Q1 | 阅读 [监督学习](02_机器学习/02_Supervised_Learning/Supervised_Learning_for_dummy.md) |
| Q2-Q3 | 阅读 [神经网络核心](03_深度学习/02_Neural_Network_Core/Neural_Network_Core_for_dummy.md) + [优化](03_深度学习/03_Optimization/Optimization_for_dummy.md) |
| Q4-Q5 | 阅读 [监督学习](02_机器学习/02_Supervised_Learning/Supervised_Learning_for_dummy.md) 中的过拟合章节 |
| Q6 | 阅读 [模型评估](08_模型评估/01_Evaluation_Fundamentals/Model_Evaluation_for_dummy.md) |
| Q7 | 阅读 [无监督学习](02_机器学习/03_Unsupervised_Learning/Unsupervised_Learning_for_dummy.md) + [强化学习基础](06_强化学习/01_RL_Foundations/RL_Foundations_for_dummy.md) |

---

## Stage 2: 核心技术

### 自测问题

**Q1.** 请画出神经网络的基本结构图（输入层 + 至少 2 个隐藏层 + 输出层），并解释每个神经元计算什么。

**Q2.** 反向传播的核心思想是什么？为什么它让深层网络的训练成为可能？

**Q3.** CNN 和 RNN 分别擅长处理什么类型的数据？Transformer 为什么能替代 RNN？

**Q4.** Attention 机制解决了 RNN 的什么问题？请用自己的话描述 Self-Attention 的计算过程。

**Q5.** 请解释 GPT 和 BERT 的核心区别（预训练目标、架构特点、适用场景）。

**Q6.** 什么是涌现能力？举一个例子，并说明规模达到什么程度会出现。

**Q7.** 预训练和微调的核心区别是什么？LoRA 为什么能大幅降低微调成本？

**Q8.** 扩散模型生成图像的基本原理是什么？它和 GAN 相比有什么优势？

### 通过标准

- 能正确回答 Q1-Q4 → 神经网络和 Transformer 理解达标
- 能正确回答 Q5-Q7 → LLM 理解达标
- 能正确回答 Q8 → 生成模型理解达标
- 全部能回答 → Stage 2 完成 ✓

### 未通过时的补救

| 问题 | 补救建议 |
|------|---------|
| Q1-Q2 | 阅读 [神经网络核心（小白版）](03_深度学习/02_Neural_Network_Core/Neural_Network_Core_for_dummy.md) |
| Q3 | 阅读 [序列模型（小白版）](05_大模型/02_Sequence_Models/Sequence_Models_for_dummy.md) + [图像分类（小白版）](04_计算机视觉/02_Image_Classification_Detection/Image_Classification_Detection_for_dummy.md) |
| Q4-Q5 | 阅读 [Transformer 革命（小白版）](05_大模型/04_Transformer_Revolution/Transformer_Revolution_for_dummy.md) |
| Q6-Q7 | 阅读 [LLM 架构（小白版）](05_大模型/05_LLM_Architectures/LLM_Architectures_for_dummy.md) + [微调技术（小白版）](05_大模型/07_Fine_tuning_Techniques/Fine_tuning_Techniques_for_dummy.md) |
| Q8 | 阅读 [生成模型（小白版）](04_计算机视觉/06_Generative_Models/Generative_Models_for_dummy.md) |

---

## Stage 3: 工程实践

### 自测问题

**Q1.** 请画出 RAG 的完整工作流程图，并标注每个环节的核心技术。

**Q2.** 向量数据库和普通关系型数据库的核心区别是什么？什么场景必须用向量数据库？

**Q3.** 请列举至少 5 个 Prompt Engineering 技巧，并说明每个技巧适合什么场景。

**Q4.** 请描述一个 AI Agent 的核心组成部分（规划、记忆、工具、反思），并设计一个简单的 Agent 架构。

**Q5.** MLOps 和传统 DevOps 的核心区别是什么？为什么 ML 系统需要特殊的运维实践？

**Q6.** AI 评估为什么比传统软件测试更难？请从质量、安全、性能三个维度各举一个指标。

**Q7.** AI Gateway 的核心功能有哪些？为什么一个应用可能需要同时调用多个 LLM？

### 通过标准

- 能正确回答 Q1-Q2 → RAG / 向量数据库理解达标
- 能正确回答 Q3-Q4 → Agent 理解达标
- 能正确回答 Q5-Q7 → 工程实践理解达标
- 全部能回答 → Stage 3 完成 ✓

### 未通过时的补救

| 问题 | 补救建议 |
|------|---------|
| Q1-Q2 | 阅读 [RAG 系统（小白版）](14_RAG系统/01_RAG_Fundamentals/RAG_Systems_for_dummy.md) |
| Q3 | 阅读 [提示词工程（小白版）](05_大模型/08_Prompt_Engineering/Prompt_Engineering_for_dummy.md) |
| Q4 | 阅读 [AI Agent（小白版）](../../15_智能体/01_Agent_Foundations/AI_Agents_for_dummy.md) |
| Q5 | 阅读 [MLOps 流水线（小白版）](11_模型运维/01_MLOps_Fundamentals/MLOps_Pipeline_for_dummy.md) |
| Q6 | 阅读 [模型评估（小白版）](08_模型评估/01_Evaluation_Fundamentals/Model_Evaluation_for_dummy.md) |
| Q7 | 阅读 [AI Gateway（速查版）](12_架构基建/11_AI_Gateway/Gateway-in-nutshell.md) |

---

## Stage 4: 前沿探索

### 自测问题

**Q1.** 原生多模态架构和拼接式多模态的核心区别是什么？为什么 2026 年是原生多模态的爆发年？

**Q2.** 请解释 JEPA（联合嵌入预测架构）的核心思想。为什么它不直接预测像素，而是预测抽象表示？

**Q3.** VLA (Vision-Language-Action Model) 和 VLM (Vision-Language Model) 的核心区别是什么？

**Q4.** 请讨论 AGI 的两种定义（窄义 / 广义）以及当前距离 AGI 还有多远。

**Q5.** 请列举 3 个 AI Safety 领域的核心问题，并简述当前的主流应对方法。

**Q6.** Scaling Law 的核心发现是什么？2026 年为什么出现"数据墙"问题？有哪些应对方向？

### 通过标准

- 能正确回答 Q1-Q2 → 多模态 / 世界模型理解达标
- 能正确回答 Q3-Q4 → AGI / 具身智能理解达标
- 能正确回答 Q5-Q6 → AI Safety / 前沿趋势理解达标
- 全部能回答 → Stage 4 完成 ✓

### 未通过时的补救

| 问题 | 补救建议 |
|------|---------|
| Q1 | 阅读 [多模态视觉（小白版）](04_计算机视觉/08_Multimodal_Vision/Multimodal_Vision_for_dummy.md) |
| Q2 | 阅读 [世界模型 2026](03_深度学习/07_World_Models/World_Models_2026.md) |
| Q3 | 阅读 [机器人与具身智能 2026](06_强化学习/05_Robotics_Embodied_AI/Embodied_AI_2026.md) |
| Q4 | 阅读 [AI 未来趋势](00_入门/04_Ethics_and_Future/AI_Future_Trends.md) |
| Q5 | 阅读 [AI 安全与红队（小白版）](17_伦理安全/04_AI_Safety_RedTeaming/AI_Safety_RedTeaming_for_dummy.md) |
| Q6 | 回到 [Stage 4 概念卡](../concepts/stage4_frontier.md) 的 Scaling Law 部分 |

---

## 路径完成检查

完成每条路径后，检查以下内容：

### 零基础通识路径
- [ ] 能理解 AI 的基本概念和历史
- [ ] 能使用至少 3 个 AI 工具
- [ ] 能和 AI 从业者进行基础技术对话
- [ ] 能评估一个 AI 产品/工具的能力边界

### ML 从业者路径
- [ ] 能用 scikit-learn / PyTorch 训练模型
- [ ] 能构建端到端的 ML pipeline
- [ ] 能部署模型并优化推理性能
- [ ] 完成至少 1 个端到端项目（可放简历）

### LLM 工程师路径
- [ ] 能用 Prompt Engineering 显著提升 LLM 效果
- [ ] 能构建完整的 RAG 应用
- [ ] 能用 LangGraph 构建 AI Agent
- [ ] 能部署和优化 LLM 推理服务

### AI 研究者路径
- [ ] 能独立阅读和复现 NeurIPS / ICLR 论文
- [ ] 对某个前沿方向有深入理解
- [ ] 能提出有价值的研究问题

### AI 产品经理路径
- [ ] 能评估 AI 需求的可行性和成本
- [ ] 能设计包含 AI 功能的完整产品方案
- [ ] 能制定 AI 产品路线图

---

## 学习资源推荐

如果某个阶段特别困难，可以考虑以下补充资源：

| 资源类型 | 推荐 |
|---------|------|
| 视频课程 | Andrew Ng 的 ML / Deep Learning 系列（Coursera） |
| 互动编程 | Kaggle Learn、fast.ai |
| 论文追踪 | ArXiv (cs.AI/cs.LG/cs.CL)、 Papers With Code |
| 社区讨论 | Hugging Face 论坛、Reddit r/MachineLearning |
| 项目练手 | Kaggle 竞赛、Hugging Face Spaces |

---

*本文档是 AI Guru 知识库概念入门路径的里程碑自测系统。每个 Stage 的问题设计参考了 [AI 概念知识图谱](../../治理/notes/AI_Concept_Knowledge_Graph.md) 中的概念依赖关系。*

## Related

- [[90_学习/pathways/absolute-beginner]] — 零基础通识路径
- [[90_学习/pathways/ml-practitioner]] — ML 从业者路径
- [[90_学习/pathways/llm-engineer]] — LLM 工程师路径
- [[90_学习/pathways/ai-researcher]] — AI 研究者路径
- [[90_学习/pathways/product-manager]] — AI 产品经理路径
- [[90_学习/pathways/java-developer]] — Java 开发者 AI 路径
- [[90_学习/guides/learning_paths_2026]] — 五大 AI 职业角色学习路径全景指南
- [[90_学习/README|Learn — AI Guru 概念入门路径]]
- [[90_学习/README_for_dummy|90 Learn — 小白版]]
