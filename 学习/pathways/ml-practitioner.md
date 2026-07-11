---
title: ML 从业者路径
category: 90-learn-pathways
tags: ["learning", "education", "courses", "study-path"]
summary: "> **面向：有编程基础，想系统成为 AI 工程师 | 前置要求：Python 基础 | 预计时间：60-80 小时**"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Ml Practitioner"
  - "ml practitioner"
sources: []

---
# ML 从业者路径

> **面向：有编程基础，想系统成为 AI 工程师 | 前置要求：Python 基础 | 预计时间：60-80 小时**

从数学基础到工程落地，完整覆盖 AI 工程师的核心技能栈。学完后你能：训练自己的模型、部署上线、做 RAG 应用。

---

## 路径概况

| 属性 | 值 |
|------|---|
| 目标人群 | 有编程经验的开发者（建议 Python 1年+） |
| 前置要求 | Python 基本语法、简单的数据结构概念 |
| 预计时间 | 60-80 小时（每天 2-3 小时，约 1-2 个月） |
| 核心产出 | 端到端 ML 能力：数据处理 → 模型训练 → 部署上线 |
| 适合你如果…… | 想转行 AI 工程师，或者在工作中需要自己训练/部署模型 |

---

## 完整路线图

```
Phase 1: 数学与编程基础（可选深入）
Phase 2: 机器学习核心
Phase 3: 深度学习核心
Phase 4: 选择专业方向（NLP/CV/RL）
Phase 5: 工程化与部署
Phase 6: 完成端到端项目
```

---

## 学习阶段

### Phase 1: 数学与编程基础（第 1-2 周，可选）

**🎯 目标**：补齐数学基础，理解为什么 AI 需要线性代数和概率统计。

**📚 核心概念**：[Stage 1: 基础概念](学习/concepts/stage1_foundation.md)（重点关注损失函数、梯度下降相关概念）

**🔗 深入阅读**：
- [线性代数（小白版）](数学基础/Linear_Algebra/Linear_Algebra_for_dummy.md)
- [概率统计（小白版）](数学基础/Probability_Statistics/Probability_Statistics_for_dummy.md)
- [数据结构与算法（小白版）](数学基础/Data_Structures_Algorithms/Data_Structures_Algorithms_for_dummy.md)

**💡 重点**：
- 线性代数：向量、矩阵、点积（理解神经网络中的矩阵运算）
- 概率统计：概率分布、贝叶斯、期望值
- 数据结构：图、树、哈希表（理解 AI 工具链中的数据流）

**✅ 学会标志**：能理解机器学习论文中涉及的数学符号；能自己实现简单的梯度下降

---

### Phase 2: 机器学习核心（第 2-3 周）

**🎯 目标**：掌握经典 ML 的三大范式：监督学习、无监督学习、特征工程。

**📚 核心概念**：[Stage 1](学习/concepts/stage1_foundation.md) + [Stage 2 前半](学习/concepts/stage2_core_tech.md)

**🔗 深入阅读**：
- [监督学习（小白版）](机器学习/Supervised_Learning/Supervised_Learning_for_dummy.md)
- [无监督学习（小白版）](机器学习/Unsupervised_Learning/Unsupervised_Learning_for_dummy.md)
- [特征工程（小白版）](机器学习/Feature_Engineering/Feature_Engineering_for_dummy.md)
- [监督学习（完整版）](机器学习/Supervised_Learning/Supervised_Learning.md)

**💡 动手实践建议**：
- 用 scikit-learn 跑一遍 Kaggle 入门比赛（如 Titanic 生存预测）
- 实现 KNN、决策树、线性回归的简化版本
- 用 Matplotlib 可视化模型决策边界

**✅ 学会标志**：
- 能用 scikit-learn 训练一个分类/回归模型
- 能解释训练集/验证集/测试集的作用
- 能选择合适的评估指标（分类用 F1，回归用 MAE）
- 理解过拟合并知道如何应对（正则化、交叉验证）

---

### Phase 3: 深度学习核心（第 3-4 周）

**🎯 目标**：理解神经网络、反向传播、CNN、Transformer 的工作原理。

**📚 核心概念**：[Stage 2: 核心技术](学习/concepts/stage2_core_tech.md)

**🔗 深入阅读**：
- [神经网络核心（小白版）](深度学习/Neural_Network_Core/Neural_Network_Core_for_dummy.md)
- [优化（小白版）](模型训练/Optimization/Optimization_for_dummy.md)
- [Transformer 革命（小白版）](大模型/Transformer_Revolution/Transformer_Revolution_for_dummy.md)

**💡 动手实践建议**：
- 用 PyTorch 实现一个简单的手写数字识别（MNIST）
- 跑一遍 Hugging Face 的快速入门教程（10 行代码做文本分类）
- 用 `torchinfo` 可视化一个 CNN 的结构

**✅ 学会标志**：
- 能用 PyTorch 定义、训练、评估一个神经网络
- 能解释反向传播的核心思想
- 能说出 CNN 和 Transformer 的核心区别
- 能解释 Attention 机制解决了什么问题

---

### Phase 4: 选择专业方向（第 4-6 周）

从下面选择 **一个方向** 深入学习：

#### 方向 A: NLP / 大模型（推荐）

- [序列模型（小白版）](大模型/Sequence_Models/Sequence_Models_for_dummy.md)
- [LLM 架构（小白版）](大模型/LLM_Architectures/LLM_Architectures_for_dummy.md)
- [微调技术（小白版）](大模型/Fine_tuning_Techniques/Fine_tuning_Techniques_for_dummy.md)
- [提示词工程（小白版）](大模型/Prompt_Engineering/Prompt_Engineering_for_dummy.md)

**动手项目**：用 Hugging Face PEFT 库对 LLaMA 做 LoRA 微调

#### 方向 B: 计算机视觉

- [图像分类与检测（小白版）](计算机视觉/Image_Classification_Detection/Image_Classification_Detection_for_dummy.md)
- [生成模型（小白版）](计算机视觉/Generative_Models/Generative_Models_for_dummy.md)
- [多模态视觉（小白版）](计算机视觉/Multimodal_Vision/Multimodal_Vision_for_dummy.md)

**动手项目**：用 diffusers 库跑一遍 Stable Diffusion 图像生成

#### 方向 C: 强化学习 / Agent

- [强化学习基础（小白版）](强化学习/RL_Foundations/RL_Foundations_for_dummy.md)
- [AI Agent（小白版）](智能体/Agent_Foundations/AI_Agents_for_dummy.md)

**动手项目**：用 LangGraph 构建一个能调用搜索工具的对话 Agent

---

### Phase 5: 工程化与部署（第 6-8 周）

**🎯 目标**：掌握将模型部署上线的完整工程能力。

**📚 核心概念**：[Stage 3: 工程实践](学习/concepts/stage3_engineering.md)

**🔗 深入阅读**：
- [部署与推理（小白版）](部署推理/Deployment_Inference_for_dummy.md)
- [RAG 系统（小白版）](RAG系统/RAG_Systems_for_dummy.md)
- [MLOps 流水线（小白版）](模型运维/MLOps_Pipeline_for_dummy.md)
- [模型评估（小白版）](模型评估/Model_Evaluation_for_dummy.md)
- [AI 工作流（速查版）](智能体/Agent_Workflow/Workflow-in-nutshell.md)

**💡 动手实践建议**：
- 用 vLLM 部署一个开源 LLM（如 Qwen），测试其推理性能
- 用 LangChain + ChromaDB 构建一个本地 RAG 应用
- 用 Docker 容器化部署一个简单的 FastAPI + LLM 服务
- 用 LangGraph 设计一个多步骤的 AI 工作流

**✅ 学会标志**：
- 能用 vLLM 部署并优化一个 LLM 推理服务
- 能构建一个完整的 RAG 应用（文档切分 → 向量化 → 检索 → 生成）
- 理解 MLOps 全流程，能用 DVC 管理数据和模型版本
- 能用 LangGraph 构建包含工具调用的 Agent

---

### Phase 6: 完成端到端项目（第 8-10 周）

**🎯 目标**：用学到的所有技能完成一个完整的端到端项目，写入简历。

**💡 推荐项目方向**：
- 基于 RAG 的私人知识库（PDF 问答、数据分析助手）
- AI 编程助手（代码审查、自动化测试生成）
- 多模态应用（图片描述 + 检索 + 生成）
- Agent 自动化工作流（自动处理邮件/文档/数据）

**🔗 参考**：
- [AI 面试指南 - Machine Learning Engineer](../../11_Interviews/Machine_Learning_Engineer/)
- [AI 面试指南 - LLM Platform Engineer](../../11_Interviews/LLM_Platform_Engineer/)

---

## 里程碑自测

完成本路径后，请回顾 [milestones.md](学习/guides/milestones.md) 中 Stage 1-3 的自测题。

## 下一步推荐

| 你的打算 | 推荐去向 |
|---------|---------|
| 想专注 LLM 应用开发 | [LLM 工程师路径](学习/pathways/llm-engineer.md) |
| 想做 AI 研究/读论文 | [AI 研究者路径](学习/pathways/ai-researcher.md) |
| 想系统评估/测试 AI | [Agent 评估框架](../../智能体/Agent_Evaluation/README.md) |

---

*本路径覆盖 AI 工程师的核心技能，但深度有限。如需在某个方向更深入，请参考对应章节的完整版文档。*

## Related

- [[学习/guides/milestones]] — 里程碑自测 (共享: courses, education, learning, study-path)
- [[学习/pathways/absolute-beginner]] — 零基础通识路径 (共享: courses, education, learning, study-path)
- [[学习/pathways/ai-researcher]] — AI 研究者路径 (共享: courses, education, learning, study-path)
- [[学习/pathways/java-developer]] — Java 开发者 AI 路径 (共享: courses, education, learning, study-path)
