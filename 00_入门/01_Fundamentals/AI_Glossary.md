---
title: AI术语表与概念词典
category: 00-ai-introduction
tags: ["ai", "glossary", "terminology", "reference"]
summary: "## A"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Ai Glossary"
  - "AI Glossary"
  - AI_Glossary
sources: []

---
# AI 术语表与概念词典

> 本术语表收录人工智能领域核心概念，按字母顺序排列，提供简明定义和深度解释，适合通识课教学使用。

---

## A

**AGI (Artificial General Intelligence) - 通用人工智能**
- **定义**: 具备人类水平通用智能的AI系统，能够学习、理解和执行任何智力任务
- **对比**: 与狭义AI（只能完成特定任务）相对
- **现状**: 尚未实现，是当前AI研究的终极目标
- **预测**: 可能于2030-2050年间实现（2026年处于智能体普及阶段）

**Agentic AI (智能体AI) - 2026年主流范式**
- **定义**: 能够自主规划、执行多步骤任务、与环境交互的AI系统
- **核心能力**: 推理、工具使用、记忆、自主执行
- **协议**: MCP (Model Context Protocol), A2A (Agent-to-Agent)
- **应用**: 自动化工作流、企业业务流程、个人助理

**AI (Artificial Intelligence) - 人工智能**
- **定义**: 使机器能够模拟人类智能行为的科学与技术
- **核心能力**: 感知、推理、学习、决策、语言理解
- **三要素**: 算法、数据、算力
- **分类**: 狭义AI → 通用AI → 超级AI

**Algorithm - 算法**
- **定义**: 解决特定问题的一系列明确步骤和规则
- **AI中的算法**: 从简单的决策树到复杂的深度神经网络
- **示例**: 排序算法、搜索算法、机器学习算法

**Alignment - 对齐**
- **定义**: 确保AI系统的目标和行为与人类价值观和意图保持一致
- **重要性**: 防止AI系统产生有害或意外的行为
- **方法**: RLHF、宪法AI、价值学习

**AlphaGo**
- **定义**: DeepMind开发的围棋AI，2016年击败世界冠军李世石
- **技术**: 深度学习 + 蒙特卡洛树搜索 + 强化学习
- **意义**: 证明AI可在复杂策略游戏中超越人类

**ANNs (Artificial Neural Networks) - 人工神经网络**
- **定义**: 受生物神经网络启发的计算模型
- **结构**: 输入层、隐藏层、输出层
- **应用**: 图像识别、语音识别、自然语言处理

**Attention Mechanism - 注意力机制**
- **定义**: 让模型能够聚焦于输入数据中最相关部分的技术
- **突破**: Transformer架构的核心，解决长距离依赖问题
- **变体**: Self-Attention、Cross-Attention、Multi-Head Attention

**AutoML - 自动机器学习**
- **定义**: 自动化机器学习流程的技术，降低AI使用门槛
- **自动化内容**: 特征工程、模型选择、超参数调优
- **代表**: Google AutoML、H2O.ai

**Autoregressive Model - 自回归模型**
- **定义**: 基于前面生成的内容预测下一个元素的生成模型
- **代表**: GPT系列、PixelCNN
- **应用**: 文本生成、图像生成

---

## B

**Backpropagation - 反向传播**
- **定义**: 训练神经网络的核心算法，通过链式法则计算梯度
- **过程**: 前向传播 → 计算损失 → 反向传播梯度 → 更新权重
- **发明**: 1986 年由 Rumelhart、Hinton 等人推广

**Bias (Inductive Bias) - 归纳偏置**
- **定义**: 学习算法对解决方案的预设偏好
- **作用**: 帮助模型从有限数据泛化
- **示例**: CNN 的空间局部性偏置、RNN 的时序偏置

**Bias (Statistical) - 统计偏差**
- **定义**: 算法或数据中的系统性误差，导致不公平结果
- **类型**: 选择偏差、确认偏差、历史偏差
- **缓解**: 公平性约束、数据重平衡

**Big Data - 大数据**
- **定义**: 规模巨大、类型多样、处理速度快的数据集
- **特征** (5V): Volume(大量)、Velocity(高速)、Variety(多样)、Veracity(真实)、Value(价值)
- **与 AI 关系**: 大数据为 AI 提供训练燃料

**BERT (Bidirectional Encoder Representations from Transformers)**
- **定义**: Google 2018 年发布的预训练语言模型
- **创新**: 双向上下文理解
- **应用**: 搜索、问答、文本分类

**Black Box - 黑盒**
- **定义**: 内部工作机制不透明、难以解释的 AI 系统
- **问题**: 可解释性差、难以调试、信任问题
- **对策**: 可解释 AI(XAI)研究

**Bounding Box - 边界框**
- **定义**: 计算机视觉中表示物体位置和大小的矩形框
- **格式**: (x, y, width, height) 或 (x1, y1, x2, y2)
- **应用**: 目标检测、图像标注

---

## C

**ChatGPT**
- **定义**: OpenAI 2022年发布的对话AI，基于GPT架构
- **影响**: 2个月用户破1亿，引发全球AI应用热潮
- **能力**: 对话、写作、编程、分析、创意

**CNN (Convolutional Neural Network) - 卷积神经网络**
- **定义**: 专门处理网格状数据（如图像）的神经网络
- **核心操作**: 卷积、池化
- **代表**: LeNet、AlexNet、ResNet、EfficientNet

**Computer Vision - 计算机视觉**
- **定义**: 使机器能够"看懂"图像和视频的技术领域
- **任务**: 分类、检测、分割、生成、视频分析
- **应用**: 医疗影像、自动驾驶、人脸识别

**Continual Learning - 持续学习**
- **定义**: AI系统在不遗忘旧知识的情况下学习新知识的能力
- **挑战**: 灾难性遗忘
- **应用**: 个人助手、推荐系统

**Contrastive Learning - 对比学习**
- **定义**: 通过比较相似和不相似样本学习表示的自监督方法
- **代表**: SimCLR、MoCo、CLIP
- **优势**: 减少对标注数据的依赖

**Cross-Validation - 交叉验证**
- **定义**: 评估模型泛化能力的统计方法
- **方法**: K折交叉验证、留一法
- **目的**: 防止过拟合、更可靠地评估模型

---

## D

**Data Augmentation - 数据增强**
- **定义**: 通过对训练数据进行变换来增加数据多样性的技术
- **图像**: 旋转、翻转、裁剪、颜色变换
- **文本**: 同义词替换、回译、随机插入

**Deep Learning - 深度学习**
- **定义**: 基于多层神经网络的机器学习方法
- **深度**: 通常指 3 层以上隐藏层
- **突破**: 2012 年 AlexNet 引发深度学习革命

**Diffusion Model - 扩散模型**
- **定义**: 通过逐步去噪生成数据的生成模型
- **原理**: 前向加噪 → 学习去噪 → 反向生成
- **代表**: Stable Diffusion、DALL-E、Midjourney

**DPO (Direct Preference Optimization) - 直接偏好优化**
- **定义**: 绕过奖励模型直接优化语言模型以符合人类偏好的方法
- **对比**: 比 RLHF 更简单高效
- **应用**: 大语言模型对齐

**Dropout**
- **定义**: 随机丢弃神经网络中部分神经元的正则化技术
- **作用**: 防止过拟合、提高泛化能力
- **使用**: 训练时随机失活，推理时使用全部

**Dataset - 数据集**
- **定义**: 用于训练、验证和测试 AI 模型的数据集合
- **划分**: 训练集、验证集、测试集
- **著名数据集**: ImageNet、COCO、C4、LAION-5B

---

## E

**Embedding - 嵌入/向量表示**
- **定义**: 将离散对象（词、图、用户）映射到连续向量空间的技术
- **特性**: 语义相似的对象在向量空间距离近
- **应用**: Word2Vec、Item Embedding、Knowledge Graph Embedding

**Emergent Abilities - 涌现能力**
- **定义**: 大模型在规模达到某个阈值后突然展现的新能力
- **示例**: 上下文学习、思维链推理
- **讨论**: 是否真的"涌现"还是连续变化的错觉

**Ensemble Learning - 集成学习**
- **定义**: 组合多个模型预测来提高性能的方法
- **方法**: Bagging、Boosting、Stacking
- **代表**: Random Forest、XGBoost、LightGBM

**Epoch - 轮次**
- **定义**: 训练过程中完整遍历训练数据集一次的迭代
- **设置**: 太少会欠拟合，太多会过拟合
- **配合**: Early Stopping防止过拟合

**Ethics of AI - AI伦理**
- **定义**: 研究AI开发和应用中道德问题的学科
- **核心议题**: 公平性、隐私、透明度、问责、自主性
- **框架**: 欧盟AI法案、IEEE伦理标准

**Explainable AI (XAI) - 可解释AI**
- **定义**: 使AI决策过程对人类可理解的技术和方法
- **方法**: LIME、SHAP、注意力可视化
- **重要性**: 医疗、金融等高风险领域的必要要求

---

## F

**Federated Learning - 联邦学习**
- **定义**: 数据不出本地、模型在分布式设备上协同训练的技术
- **优势**: 隐私保护、数据主权
- **应用**: 手机输入法、健康应用

**Few-Shot Learning - 少样本学习**
- **定义**: 从极少样本（通常 1-5 个）学习新任务的能力
- **方法**: 元学习、原型网络、提示学习
- **意义**: 减少对大量标注数据的依赖

**Fine-tuning - 微调**
- **定义**: 在预训练模型基础上，针对特定任务进行进一步训练
- **优势**: 节省训练成本、提高小数据集性能
- **变体**: Full Fine-tuning、LoRA、Adapter、Prompt Tuning

**Foundation Model - 基础模型**
- **定义**: 在大规模数据上训练、可适应多种下游任务的大模型
- **代表**: GPT-4、BERT、CLIP、Stable Diffusion
- **特征**: 涌现能力、上下文学习、泛化能力强

**FP/BP/RL - 前向/反向/强化**
- **FP (Forward Propagation)**: 输入通过网络产生输出的过程
- **BP (Backpropagation)**: 计算梯度并更新权重的算法
- **RL (Reinforcement Learning)**: 通过奖励信号学习最优策略的方法

---

## G

**GAN (Generative Adversarial Network) - 生成对抗网络**
- **定义**: 由生成器和判别器对抗训练组成的生成模型
- **结构**: 生成器造假 → 判别器鉴别 → 共同提升
- **代表**: StyleGAN、CycleGAN、BigGAN

**Generative AI - 生成式AI**
- **定义**: 能够创造新内容（文本、图像、音频、视频、代码）的AI
- **代表**: ChatGPT、Midjourney、Suno、Runway
- **影响**: 2022-2024引发内容创作革命

**GPU (Graphics Processing Unit) - 图形处理器**
- **定义**: 并行计算能力强大的处理器，AI训练的主力硬件
- **代表**: NVIDIA H100/H200、AMD MI300X
- **演进**: 从图形渲染 → 通用计算 → AI专用

**Gradient Descent - 梯度下降**
- **定义**: 通过沿损失函数梯度反方向更新参数来最小化损失的优化算法
- **变体**: SGD、Adam、RMSprop、AdamW
- **关键参数**: 学习率、批量大小

**Ground Truth - 真值/标签**
- **定义**: 数据的真实标签或正确答案
- **获取**: 人工标注、自动标注、仿真生成
- **质量**: 影响模型性能的关键因素

---

## H

**Hallucination - 幻觉**
- **定义**: AI 生成看似合理但实际错误或无意义内容的现象
- **类型**: 事实幻觉、逻辑幻觉、来源幻觉
- **缓解**: RAG、事实核查、人类审核

**Hyperparameter - 超参数**
- **定义**: 训练前设定、不在训练过程中学习的参数
- **示例**: 学习率、批量大小、网络层数、隐藏单元数
- **调优**: 网格搜索、随机搜索、贝叶斯优化

**Human-in-the-Loop - 人在回路**
- **定义**: 将人类判断纳入 AI 决策过程的人机协作模式
- **应用**: 标注、审核、纠错、强化学习
- **优势**: 结合 AI 效率与人类判断力

**Hybrid AI - 混合 AI**
- **定义**: 结合符号推理和神经网络的 AI 系统
- **优势**: 结合符号 AI 的可解释性和神经网络的感知能力
- **方向**: Neuro-symbolic AI

---

## I

**ImageNet**
- **定义**: 大规模图像识别数据集，包含1400万张图像、2万类别
- **影响**: 2012年ImageNet竞赛催生深度学习革命
- **意义**: 计算机视觉领域的"Hello World"

**Inference - 推理**
- **定义**: 使用训练好的模型对新数据进行预测的过程
- **对比**: 训练(Training)是构建模型，推理是使用模型
- **优化**: 量化、剪枝、蒸馏提升推理速度

**IoU (Intersection over Union) - 交并比**
- **定义**: 衡量目标检测准确度的指标，预测框与真实框的交集除以并集
- **阈值**: 通常IoU>0.5认为检测正确
- **应用**: 目标检测评估、非极大值抑制

**J

**JEPA (Joint Embedding Predictive Architecture)**
- **定义**: Yann LeCun提出的自监督学习架构
- **核心**: 学习世界的抽象表示和预测
- **目标**: 通向通用AI的路径之一

---

## K

**Knowledge Distillation - 知识蒸馏**
- **定义**: 将大模型(教师)的知识迁移到小模型(学生)的技术
- **优势**: 模型压缩、推理加速
- **代表**: DistilBERT、TinyBERT

**Knowledge Graph - 知识图谱**
- **定义**: 以图形式表示实体及其关系的结构化知识库
- **结构**: 实体(节点) + 关系(边) + 属性
- **应用**: 搜索增强、问答系统、推荐

**K-Means - K 均值聚类**
- **定义**: 将数据划分为 K 个簇的无监督学习算法
- **过程**: 随机初始化中心 → 分配样本 → 更新中心 → 迭代
- **应用**: 客户分群、图像分割、文档聚类

---

## L

**Label - 标签**
- **定义**: 监督学习中数据的正确答案或类别标注
- **类型**: 分类标签、回归目标、序列标注
- **获取**: 人工标注、半自动标注、弱监督

**Large Language Model (LLM) - 大语言模型**
- **定义**: 参数量巨大(通常>10亿)、在海量文本上训练的语言模型
- **代表**: GPT-4、Claude、Gemini、Llama
- **能力**: 生成、理解、推理、知识问答

**Latent Space - 隐空间**
- **定义**: 数据经过编码后的低维表示空间
- **特性**: 语义相似的数据在隐空间距离近
- **应用**: 生成模型、表示学习、插值

**Learning Rate - 学习率**
- **定义**: 梯度下降中每次参数更新的步长
- **重要性**: 太大不收玫，太小收敛慢
- **策略**: 学习率衰减、Warmup、自适应

**LLaMA (Large Language Model Meta AI)**
- **定义**: Meta开源的大语言模型系列
- **特点**: 开源可商用、性能强劲
- **影响**: 推动开源大模型生态发展

**LoRA (Low-Rank Adaptation)**
- **定义**: 低秩适应的微调方法，只训练少量参数
- **优势**: 显存占用小、训练速度快、可合并
- **应用**: 大模型高效微调

**Loss Function - 损失函数**
- **定义**: 衡量模型预测与真实值差距的函数
- **目标**: 最小化损失函数
- **类型**: MSE、交叉熵、对比损失、感知损失

---

## M

**Machine Learning - 机器学习**
- **定义**: 使计算机能够从数据中学习规律的 AI 方法
- **范式**: 监督学习、无监督学习、强化学习
- **关系**: AI ⊃ ML ⊃ Deep Learning

**Mask/Masking - 掩码**
- **定义**: 隐藏输入的部分内容让模型预测的技术
- **BERT**: Masked Language Modeling
- **Transformer**: Attention Mask 处理变长序列

**Memory (AI) - 记忆**
- **定义**: AI 系统存储和回忆信息的能力
- **类型**: 短期记忆(上下文)、长期记忆(向量数据库)
- **应用**: 对话系统、Agent、个性化

**Meta-Learning - 元学习**
- **定义**: "学会学习"的能力，快速适应新任务
- **方法**: MAML、原型网络、记忆增强
- **目标**: 少样本学习、快速适应

**MLP (Multilayer Perceptron) - 多层感知机**
- **定义**: 最基本的前馈神经网络
- **结构**: 输入层 + 隐藏层 + 输出层
- **历史**: 神经网络的基础形式

**Model Collapse - 模型崩溃**
- **定义**: 使用 AI 生成数据训练模型导致的性能退化现象
- **原因**: 合成数据缺乏真实数据的尾部分布
- **警示**: AI 训练数据质量的重要性

**MoE (Mixture of Experts) - 混合专家**
- **定义**: 将模型分为多个"专家"网络，按需激活的架构
- **优势**: 扩大模型容量同时控制推理成本
- **代表**: GPT-4、Llama 4、DeepSeek V3
- **2026**: 成为大型模型标配架构

**MLOps - 机器学习运维**
- **定义**: 将 DevOps 实践应用于机器学习系统的工程学科
- **内容**: 模型版本管理、自动化训练、部署监控
- **工具**: MLflow、Kubeflow、Weights & Biases

**Multi-Modal - 多模态**
- **定义**: 能够处理和理解多种数据类型(文本、图像、音频、视频)的 AI
- **代表**: GPT-4V、Gemini、CLIP
- **趋势**: 统一架构处理多种模态

---

## N

**NAS (Neural Architecture Search) - 神经架构搜索**
- **定义**: 自动搜索最优神经网络结构的技术
- **方法**: 强化学习、进化算法、可微分搜索
- **代表**: EfficientNet、AutoML

**NeRF (Neural Radiance Field) - 神经辐射场**
- **定义**: 用神经网络表示3D场景的新视图合成技术
- **输入**: 多视角2D图像
- **输出**: 任意视角的3D渲染

**Neural Network - 神经网络**
- **定义**: 受生物神经元启发、由 interconnected nodes 组成的计算模型
- **基本单元**: 神经元 = 加权求和 + 激活函数
- **训练**: 反向传播 + 梯度下降

**NLP (Natural Language Processing) - 自然语言处理**
- **定义**: 使计算机能够理解、处理和生成人类语言的技术
- **任务**: 分类、翻译、摘要、问答、生成
- **里程碑**: 2017 Transformer、2022 ChatGPT

**N-shot Learning - N样本学习**
- **定义**: 从N个样本学习新任务的能力
- **Zero-shot**: 零样本，完全泛化
- **One-shot**: 一个样本学习
- **Few-shot**: 少量样本学习

---

## O

**Object Detection - 目标检测**
- **定义**: 识别图像中物体类别和位置的计算机视觉任务
- **输出**: 边界框 + 类别标签
- **代表**: YOLO、Faster R-CNN、DETR

**One-Hot Encoding - 独热编码**
- **定义**: 将类别变量转换为二进制向量的编码方式
- **示例**: "猫" → [1,0,0], "狗" → [0,1,0]
- **用途**: 分类任务的标签表示

**Optimization - 优化**
- **定义**: 寻找使目标函数最小化(或最大化)的参数的过程
- **AI 中的优化**: 损失函数最小化
- **算法**: SGD、Adam、L-BFGS

**Overfitting - 过拟合**
- **定义**: 模型在训练数据上表现好但在新数据上表现差的现象
- **原因**: 模型复杂度过高、训练数据不足
- **缓解**: 正则化、Dropout、早停、数据增强

---

## P

**Parameter - 参数**
- **定义**: 模型从数据中学习得到的变量
- **对比**: 超参数是人工设定的
- **规模**: 从数千到数万亿(GPT-4)

**Perceptron - 感知机**
- **定义**: 最简单的神经网络单元，二元分类器
- **历史**: 1957年由Rosenblatt发明
- **局限**: 无法解决异或问题(XOR)

**Pipeline - 流水线**
- **定义**: 将多个处理步骤串联起来的工作流程
- **ML Pipeline**: 数据 → 预处理 → 特征工程 → 模型 → 评估
- **工具**: Scikit-learn Pipeline、Kubeflow

**Pooling - 池化**
- **定义**: 降低特征图维度的操作
- **类型**: Max Pooling、Average Pooling
- **作用**: 降维、平移不变性

**Pre-training - 预训练**
- **定义**: 在大规模数据上训练模型获得通用表示的过程
- **后续**: Fine-tuning针对特定任务
- **优势**: 节省训练成本、提高小数据性能

**Prompt - 提示词**
- **定义**: 输入给大语言模型的指令或问题
- **工程**: 设计有效提示以获得期望输出
- **技巧**: 角色设定、上下文提供、示例、约束

**PPO (Proximal Policy Optimization) - 近端策略优化**
- **定义**: 强化学习中稳定的策略梯度算法
- **应用**: RLHF中的对齐训练
- **特点**: 训练稳定、样本效率高

---

## Q

**Quantization - 量化**
- **定义**: 降低模型权重精度的压缩技术
- **类型**: INT8 量化、INT4 量化、二值化
- **优势**: 减少模型大小、加速推理

---

## R

**RAG (Retrieval-Augmented Generation) - 检索增强生成**
- **定义**: 结合信息检索和文本生成的技术
- **流程**: 检索相关文档 → 注入上下文 → 生成回答
- **优势**: 减少幻觉、提供可溯源信息
- **2026**: 向多模态RAG和Agentic RAG发展

**Reasoning Models (推理模型) - 2025-2026爆发**
- **定义**: 通过延长推理时间换取更准确答案的模型
- **技术**: Chain-of-Thought、Self-Verification、Monte Carlo Tree Search
- **代表**: GPT-5.2、Claude 4.5、o1/o3 (OpenAI)
- **特点**: 思考时间越长，答案越准确（类似人类慢思考）

**RLHF (Reinforcement Learning from Human Feedback) - 人类反馈强化学习**
- **定义**: 通过人类反馈训练奖励模型，再优化语言模型的方法
- **流程**: 收集偏好数据 → 训练奖励模型 → PPO优化
- **应用**: ChatGPT、Claude等对齐训练
- **2026进展**: DPO成为RLHF替代方案

**Random Forest - 随机森林**
- **定义**: 由多棵决策树组成的集成学习方法
- **原理**: Bagging + 随机特征选择
- **优势**: 不易过拟合、可解释性强

**Recall/Precision/F1 - 召回率/精确率/F1分数**
- **Recall**: 正样本中被正确预测的比例
- **Precision**: 预测为正样本中真正为正的比例
- **F1**: 召回率和精确率的调和平均

**Rectified Linear Unit (ReLU) - 修正线性单元**
- **定义**: 最常用的激活函数：f(x) = max(0, x)
- **优势**: 计算简单、缓解梯度消失
- **变体**: Leaky ReLU、GELU、SwiGLU

**Recurrent Neural Network (RNN) - 循环神经网络**
- **定义**: 处理序列数据、具有记忆能力的神经网络
- **问题**: 长序列梯度消失/爆炸
- **改进**: LSTM、GRU、Transformer

**Regularization - 正则化**
- **定义**: 防止过拟合的技术
- **方法**: L1/L2正则化、Dropout、早停、数据增强
- **原理**: 限制模型复杂度

**Reinforcement Learning (RL) - 强化学习**
- **定义**: 通过试错、基于奖励信号学习最优策略的方法
- **要素**: 智能体、环境、状态、动作、奖励
- **应用**: 游戏、机器人、推荐、资源调度

**Representation Learning - 表示学习**
- **定义**: 自动学习数据有效表示的技术
- **目标**: 将原始数据映射到适合任务的特征空间
- **深度学习的核心**: 端到端学习表示

**Robotics - 机器人学**
- **定义**: 设计、构建和应用机器人的学科
- **AI+机器人**: 感知、规划、控制、学习
- **具身智能**: 物理世界中的AI

**RNN (Recurrent Neural Network) - 循环神经网络**
- **参见**: Recurrent Neural Network

---

## S

**Self-Attention - 自注意力**
- **定义**: 计算序列中每个元素与其他所有元素相关性的机制
- **优势**: 并行计算、捕获长距离依赖
- **应用**: Transformer 的核心组件

**Self-Supervised Learning - 自监督学习**
- **定义**: 从数据本身构造监督信号的学习方法
- **方法**: 预测掩码、对比学习、自回归
- **代表**: BERT、GPT、SimCLR、MAE

**Semantic Segmentation - 语义分割**
- **定义**: 将图像每个像素分类到特定类别的任务
- **输出**: 像素级别的类别图
- **应用**: 自动驾驶、医学影像

**Sentiment Analysis - 情感分析**
- **定义**: 识别文本情感倾向(正面/负面/中性)的任务
- **应用**: 舆情监测、产品评价分析
- **方法**: 基于规则、机器学习、深度学习

**SGD (Stochastic Gradient Descent) - 随机梯度下降**
- **定义**: 每次使用小批量样本计算梯度的优化算法
- **优势**: 计算效率高、内存友好
- **变体**: Momentum、Adam、AdamW

**Softmax**
- **定义**: 将向量转换为概率分布的函数
- **公式**: softmax(x_i) = exp(x_i) / Σexp(x_j)
- **应用**: 多分类输出的最后一层

**Supervised Learning - 监督学习**
- **定义**: 使用标注数据训练模型的机器学习方法
- **任务**: 分类、回归
- **对比**: 无监督学习、强化学习

**SVM (Support Vector Machine) - 支持向量机**
- **定义**: 寻找最优分类边界的监督学习算法
- **核心**: 最大化间隔、支持向量
- **核技巧**: 处理非线性问题

**Synthetic Data - 合成数据**
- **定义**: 人工生成而非真实收集的数据
- **生成**: GAN、扩散模型、仿真
- **应用**: 隐私保护、数据增强、稀有场景

---

## T

**Temperature - 温度**
- **定义**: 控制生成模型输出随机性的参数
- **效果**: 低温度更确定，高温度更多样
- **应用**: 文本生成、采样策略

**Tensor - 张量**
- **定义**: 多维数组，AI中的基本数据结构
- **维度**: 标量(0D)、向量(1D)、矩阵(2D)、张量(3D+)
- **框架**: PyTorch、TensorFlow基于张量运算

**Test Set - 测试集**
- **定义**: 用于评估模型最终性能的独立数据集
- **原则**: 只在训练和验证完成后使用一次
- **避免**: 测试集泄露、基于测试结果调参

**Token - 词元**
- **定义**: 文本被分词后的最小单位
- **类型**: 字、子词(BPE)、词
- **示例**: "ChatGPT很好" → ["Chat", "G", "PT", "很", "好"]

**Tokenization - 分词**
- **定义**: 将文本拆分为Token序列的过程
- **算法**: BPE、WordPiece、SentencePiece
- **影响**: 影响模型词汇表大小和表达能力

**Transfer Learning - 迁移学习**
- **定义**: 将在一个任务上学到的知识应用到相关任务
- **形式**: 预训练+微调、特征提取、域适应
- **优势**: 数据效率高、训练快速

**Transformer - Transformer架构**
- **定义**: 基于自注意力的序列建模架构
- **论文**: "Attention Is All You Need" (2017)
- **影响**: 统一了NLP和CV的架构基础

**Turing Test - 图灵测试**
- **定义**: 测试机器是否能表现出人类智能的实验
- **提出**: 1950年阿兰·图灵
- **争议**: 行为模仿是否等于智能

**Type I/II Error - 一类/二类错误**
- **Type I (假阳性)**: 预测为正，实际为负
- **Type II (假阴性)**: 预测为负，实际为正
- **权衡**: 根据应用场景决定容忍哪种错误

---

## U

**Underfitting - 欠拟合**
- **定义**: 模型过于简单、未能捕捉数据规律的现象
- **表现**: 训练集和测试集表现都差
- **解决**: 增加模型复杂度、更多特征、减少正则化

**Unsupervised Learning - 无监督学习**
- **定义**: 从未标注数据中学习的机器学习方法
- **任务**: 聚类、降维、密度估计、生成
- **代表**: K-Means、PCA、GAN、VAE

---

## V

**Validation Set - 验证集**
- **定义**: 用于模型选择和调参的数据集
- **用途**: 早停、超参数选择、模型比较
- **交叉验证**: K折交叉验证更充分利用数据

**Vanishing Gradient - 梯度消失**
- **定义**: 反向传播中梯度逐层减小导致深层网络难以训练的问题
- **原因**: 激活函数导数小于1的连乘
- **解决**: ReLU、残差连接、批归一化

**Variational Autoencoder (VAE) - 变分自编码器**
- **定义**: 学习数据潜在分布的生成模型
- **结构**: 编码器(推断分布) + 解码器(生成样本)
- **应用**: 生成、插值、表示学习

**Vector Database - 向量数据库**
- **定义**: 专门存储和检索高维向量数据的数据库
- **应用**: RAG、推荐、相似度搜索
- **代表**: Pinecone、Milvus、Weaviate、PGVector

**Vision Transformer (ViT) - 视觉Transformer**
- **定义**: 将Transformer应用于图像分类的架构
- **方法**: 图像分块 → 线性嵌入 → Transformer处理
- **意义**: 证明Transformer可统一CV和NLP

---

## W

**Weak Supervision - 弱监督学习**
- **定义**: 使用不完美或噪声标注的训练方法
- **来源**: 启发式规则、远程监督、众包
- **优势**: 降低标注成本

**Weight - 权重**
- **定义**: 神经网络中连接的强度参数
- **训练目标**: 找到最优权重组合
- **初始化**: 随机初始化、预训练权重

**World Model - 世界模型** - 2026 年资本热点
- **定义**: AI 系统内部对世界运转规律的学习和表示
- **目标**: 预测行动后果、支撑规划决策
- **技术路线**: JEPA、视频生成模型、物理仿真
- **代表**: JEPA (Meta)、Sora (OpenAI)、机器人世界模型
- **应用**: 具身智能、自动驾驶、科学发现

**Weak Supervision - 弱监督学习**

---

## X

**XAI (Explainable AI) - 可解释AI**
- **参见**: Explainable AI

**XGBoost**
- **定义**: 高效的梯度提升树实现
- **优势**: 速度快、精度高、可并行
- **应用**: 竞赛常胜、工业界广泛使用

---

## Y

**YOLO (You Only Look Once)**
- **定义**: 实时目标检测算法
- **特点**: 单次前向传播完成检测和分类
- **演进**: YOLOv1-v8 持续改进

---

## Z

**Zero-Shot Learning - 零样本学习**
- **定义**: 模型在没有见过某类样本的情况下识别该类
- **方法**: 属性预测、语义嵌入
- **大模型**: GPT等通过上下文实现零样本

**ZeRO (Zero Redundancy Optimizer)**
- **定义**: 减少大模型训练显存占用的技术
- **原理**: 分割优化器状态、梯度、参数
- **应用**: 大模型分布式训练

---

## 附录：术语分类索引

### 按主题分类

**基础概念**
AI、ML、Deep Learning、Neural Network、Algorithm、Data、Model

**技术架构**
Transformer、CNN、RNN、LSTM、GRU、Attention、GAN、VAE、Diffusion

**训练相关**
Training、Fine-tuning、Backpropagation、Gradient Descent、Loss Function、Learning Rate、Epoch、Batch、Overfitting、Underfitting

**大模型专项**
LLM、GPT、BERT、LLaMA、Prompt、RLHF、DPO、LoRA、RAG、Agent、Token、Embedding、推理模型、Agentic AI、世界模型、MoE

**评估指标**
Accuracy、Precision、Recall、F1、IoU、BLEU、ROUGE、Perplexity

**硬件与部署**
GPU、TPU、NPU、Quantization、Pruning、Distillation、Inference、Edge AI

**伦理与安全**
Bias、Fairness、Privacy、Explainable AI、Alignment、Hallucination

---

*Last updated: 2026-04-01* (通识课教材版)

## Related

- [[16_编程/08_OpenRouter/05-openrouter-api-reference]] — 05-openrouter-api-reference (共享: ai, reference)
