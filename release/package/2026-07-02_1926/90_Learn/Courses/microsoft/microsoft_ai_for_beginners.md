---
title: "Microsoft AI For Beginners：12 周初学者课程映射"
category: "90-learn-courses-microsoft"
tags: ["learning-paths", "microsoft", "ai-beginners", "course-catalog", "pytorch", "tensorflow"]
summary: "> **一句话理解**: Microsoft 官方出品的 12 周 24 课 AI 入门课程，覆盖符号 AI、神经网络、CV、NLP、RL、伦理等主题，并附带 PyTorch/TensorFlow 双框架 Notebook，是本库零基础到进阶的极佳外部学习路线。"
created: "2026-06-12"
updated: "2026-06-12"
source_url: "https://github.com/microsoft/AI-For-Beginners/blob/main/translations/zh-CN/README.md"
tier: core
aliases:
  - "Microsoft Ai For Beginners"
  - "microsoft ai for beginners"
  - microsoft_ai_for_beginners
sources: []

---
# Microsoft AI For Beginners：12 周初学者课程映射

> **一句话理解**: [Microsoft AI For Beginners](https://microsoft.github.io/AI-For-Beginners/) 是微软开源的 12 周、24 课 AI 入门课程。它涵盖符号 AI、神经网络、计算机视觉、自然语言处理、强化学习、AI 伦理等核心主题，并为每节课提供 **PyTorch / TensorFlow 双框架可运行 Notebook** 与部分实验。本页将课程的完整课表映射到 `ai-guru-database` 的对应章节，方便你在阅读本库理论后，通过官方 Notebook 动手实践。

---

## 课程概览

| 属性 | 说明 |
|------|------|
| **官方站点** | [microsoft.github.io/AI-For-Beginners](https://microsoft.github.io/AI-For-Beginners/) |
| **GitHub 仓库** | [microsoft/AI-For-Beginners](https://github.com/microsoft/AI-For-Beginners) |
| **中文 README** | [translations/zh-CN/README.md](https://github.com/microsoft/AI-For-Beginners/blob/main/translations/zh-CN/README.md) |
| **课程周期** | 12 周 |
| **课时数量** | 24 节课 + 环境设置 |
| **编程框架** | PyTorch、TensorFlow / Keras |
| **前置要求** | 基础 Python；部分课程需要线性代数与概率论基础（可参考本库 [[数学基础/Linear_Algebra/Linear_Algebra]] 与 [[数学基础/Probability_Statistics/Probability_Statistics]]） |

---

## 你将学到什么

- 不同的人工智能方法，包括“老派”的符号方法以及 **知识表示** 与推理（GOFAI）。
- 现代 AI 核心的 **神经网络** 和 **深度学习**，通过 TensorFlow 和 PyTorch 代码示例讲解。
- 用于处理图像和文本的 **神经架构**（CNN、RNN、Transformer 等）。
- 较少见的 AI 方法，如 **遗传算法** 和 **多智能体系统**。

## 本课程不覆盖的内容

> 以下主题在微软其他课程或本库其他章节中有更详细讲解：

- **AI 在商业中的应用案例** → 本库 [[行业应用/README]] 系列。
- **经典机器学习** → 微软另有 [ML-For-Beginners](https://github.com/microsoft/ML-For-Beginners)；本库 [[机器学习/README]] 章节。
- **基于认知服务的实际 AI 应用** → 微软 Learn 模块。
- **特定 ML 云框架**（Azure ML、Microsoft Fabric 等） → 微软 Learn 路径。
- **会话式 AI 与聊天机器人** → 本库 [[大模型/Prompt_Engineering/Prompt_Engineering]] 与 [[Agent/README]] 章节。
- **深度学习背后的深度数学** → 本库 [[数学基础/README]] 与 [Deep Learning 教材](https://www.deeplearningbook.org/)。

---

## 完整课程表与章节映射

| 模块 | 课号 | 本地课程页 | 本库建议配合阅读 | 官方 Notebook / 实验 |
|------|------|------------|------------------|----------------------|
| **环境设置** | 00 | [[90_Learn/courses/microsoft/L00_Course_Setup|课程环境设置]] | [[数学基础/AI_Development_Environment_Setup]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/0-course-setup) |
| **I. 人工智能简介** | 01 | [[90_Learn/courses/microsoft/L01_Introduction_and_History_of_AI|人工智能介绍与历史]] | [[入门/AI_Fundamentals]]、[[入门/AI_History_Timeline]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/1-Intro) |
| **II. 符号 AI** | 02 | [[90_Learn/courses/microsoft/L02_Knowledge_Representation_and_Expert_Systems|知识表示与专家系统]] | [[入门/AI_Fundamentals]]、[[大模型/Reasoning_Models/Neuro_Symbolic_and_Formal_Verification_2026]]（符号推理的现代延续） | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/2-Symbolic) |
| **III. 神经网络简介** | 03 | [[90_Learn/courses/microsoft/L03_Perceptron|感知器]] | [[深度学习/Neural_Network_Core/Neural_Network_Core]]、[[深度学习/Neural_Network_Core/Your_First_Neural_Network]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/3-NeuralNetworks/03-Perceptron) |
| | 04 | [[90_Learn/courses/microsoft/L04_Multi_Layered_Perceptron|多层感知器及创建自己的框架]] | [[深度学习/Neural_Network_Core/Neural_Network_Core]]、[[深度学习/Optimization/Optimization]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/3-NeuralNetworks/04-OwnFramework) |
| | 05 | [[90_Learn/courses/microsoft/L05_Frameworks_and_Overfitting|框架简介与过拟合]] | [[深度学习/Optimization/Optimization]]、[[机器学习/Supervised_Learning/Supervised_Learning]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/3-NeuralNetworks/05-Frameworks) |
| **IV. 计算机视觉** | 06 | [[90_Learn/courses/microsoft/L06_Intro_to_Computer_Vision|计算机视觉简介与 OpenCV]] | [[计算机视觉/README]]、[[计算机视觉/Image_Classification_Detection/Image_Classification_Detection]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/06-IntroCV) |
| | 07 | [[90_Learn/courses/microsoft/L07_CNN_and_Architectures|卷积神经网络与 CNN 架构]] | [[计算机视觉/Image_Classification_Detection/Image_Classification_Detection]]、[[计算机视觉/CV-in-nutshell]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/07-ConvNets) |
| | 08 | [[90_Learn/courses/microsoft/L08_Transfer_Learning_and_Training_Tricks|预训练网络、迁移学习与训练技巧]] | [[计算机视觉/Image_Classification_Detection/Image_Classification_Detection]]、[[大模型/Fine_tuning_Techniques/Fine_tuning_Strategies]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/08-TransferLearning) |
| | 09 | [[90_Learn/courses/microsoft/L09_Autoencoders_and_VAEs|自编码器与变分自编码器（VAE）]] | [[计算机视觉/Generative_Models/Generative_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/09-Autoencoders) |
| | 10 | [[90_Learn/courses/microsoft/L10_GANs_and_Style_Transfer|生成对抗网络与艺术风格迁移]] | [[计算机视觉/Generative_Models/Generative_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/10-GANs) |
| | 11 | [[90_Learn/courses/microsoft/L11_Object_Detection|目标检测]] | [[计算机视觉/Image_Classification_Detection/Image_Classification_Detection]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/11-ObjectDetection) |
| | 12 | [[90_Learn/courses/microsoft/L12_Semantic_Segmentation|语义分割与 U-Net]] | [[计算机视觉/Segmentation/Segmentation]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/4-ComputerVision/12-Segmentation) |
| **V. 自然语言处理** | 13 | [[90_Learn/courses/microsoft/L13_Text_Representation|文本表示：词袋模型与 TF-IDF]] | [[大模型/LLM_Data_Engineering/LLM_Data_Engineering_Deep_Dive]]、[[大模型/Sequence_Models/Sequence_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/13-TextRep) |
| | 14 | [[90_Learn/courses/microsoft/L14_Semantic_Word_Embeddings|语义词嵌入：Word2Vec 与 GloVe]] | [[大模型/Sequence_Models/Sequence_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/14-Embeddings) |
| | 15 | [[90_Learn/courses/microsoft/L15_Language_Modeling|语言建模与自定义嵌入训练]] | [[大模型/Sequence_Models/Sequence_Models]]、[[大模型/LLM_Data_Engineering/LLM_Data_Engineering_Deep_Dive]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/15-LanguageModeling) |
| | 16 | [[90_Learn/courses/microsoft/L16_Recurrent_Neural_Networks|循环神经网络（RNN）]] | [[大模型/Sequence_Models/Sequence_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/16-RNN) |
| | 17 | [[90_Learn/courses/microsoft/L17_Generative_Recurrent_Networks|生成循环网络]] | [[大模型/Sequence_Models/Sequence_Models]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/17-GenerativeNetworks) |
| | 18 | [[90_Learn/courses/microsoft/L18_Transformers_and_BERT|Transformer 与 BERT]] | [[大模型/Transformer_Revolution/Transformer_Revolution]]、[[大模型/LLM_Architectures/LLM_Architectures]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/18-Transformers) |
| | 19 | [[90_Learn/courses/microsoft/L19_Named_Entity_Recognition|命名实体识别（NER）]] | [[大模型/Sequence_Models/Sequence_Models]]、[[大模型/Fine_tuning_Techniques/Fine_tuning_Techniques]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/19-NER) |
| | 20 | [[90_Learn/courses/microsoft/L20_Large_Language_Models|大语言模型、提示编程与少样本任务]] | [[大模型/LLM_Architectures/LLM_Architectures]]、[[大模型/Prompt_Engineering/Prompt_Engineering]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/5-NLP/20-LangModels) |
| **VI. 其他 AI 技术** | 21 | [[90_Learn/courses/microsoft/L21_Genetic_Algorithms|遗传算法]] | [[强化学习/RL-in-nutshell]]、[[机器学习/ML-in-nutshell]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/6-Other/21-GeneticAlgorithms) |
| | 22 | [[90_Learn/courses/microsoft/L22_Deep_Reinforcement_Learning|深度强化学习]] | [[强化学习/Deep_RL/Deep_RL]]、[[强化学习/RL_Foundations/RL_Foundations]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/6-Other/22-DeepRL) |
| | 23 | [[90_Learn/courses/microsoft/L23_Multi_Agent_Systems|多智能体系统]] | [[强化学习/AI_Agents/AI_Agents]]、[[Agent/README]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/6-Other/23-MultiagentSystems) |
| **VII. AI 伦理** | 24 | [[90_Learn/courses/microsoft/L24_AI_Ethics_and_Responsible_AI|AI 伦理与负责任的 AI]] | [[伦理安全/Ethics-in-nutshell]]、[[伦理安全/AI_Governance_Compliance_2026]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/7-Ethics) |
| **IX. 附加内容** | 25 | [[90_Learn/courses/microsoft/L25_Multi_Modal_Networks|多模态网络、CLIP 与 VQGAN]] | [[计算机视觉/Multimodal_Vision/CLIP_Deep_Dive]]、[[大模型/Multimodal_Models/Multimodal_Models_for_dummy]] | [GitHub](https://github.com/microsoft/AI-For-Beginners/tree/main/lessons/X-Extras/X1-MultiModal) |

---

## 学习建议

1. **先建立概念框架**：每节课前，先阅读本库对应章节的核心概念页（如 [[深度学习/Neural_Network_Core/Neural_Network_Core]]），再进入官方 Notebook。
2. **选择一个框架深入**：每节课通常提供 PyTorch 和 TensorFlow 两个版本。建议初学者主攻 **PyTorch**，工业界应用更广的再补充 **TensorFlow/Keras**。
3. **完成实验**：标有“Lab”的课程（如感知器、CNN、目标检测等）配有动手实验，是巩固理解的关键。
4. **结合本库进阶**：完成 MS 课程后，可继续阅读本库 [[模型训练/README]]、[[模型评估/README]]、[[部署推理/README]]、[[RAG系统/README]]、[[Agent/README]] 等工程实践章节。

---

## 每节课包含什么

根据官方说明，每节课通常包括：

- **预习材料**：课前阅读的理论背景。
- **可执行 Jupyter Notebook**：通常分为 PyTorch 与 TensorFlow 两个版本，Notebook 中也包含大量理论讲解。
- **实验（Lab）**：部分课程提供，帮助你将理论应用到具体问题。
- **Microsoft Learn 模块链接**：部分章节附带官方 MS Learn 扩展阅读。
- **测验**：每节课的测验位于 `etc/quiz-app`，也可[在线访问](https://microsoft.github.io/AI-For-Beginners/)。

---

## 相关阅读

- [[90_Learn/courses/hugging_face/official_courses]] — Hugging Face 官方 NLP / RL / Audio 系统课程
- [[90_Learn/courses/deeplearning_ai/short_courses]] — DeepLearning.AI 前沿短课程映射
- [[90_Learn/guides/learning_paths_2026]] — 本库 6 条学习路径总览
- [[入门/AI_Learning_Resources]] — AI 学习资源与方法论
- [[_references/microsoft-ai-for-beginners]] — 外部源引用索引
