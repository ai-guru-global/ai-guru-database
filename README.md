# AI Guru: 业界最完整的 AI 知识库与实践指南

![AI Guru Banner](https://img.shields.io/badge/AI-Knowledge_Base-blueviolet?style=for-the-badge&logo=openai)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Expert Level](https://img.shields.io/badge/Content-Expert_Level-gold?style=for-the-badge)

**AI Guru** 是一个致力于整理和沉淀业界最顶尖人工智能知识的开源项目。本项目由领域专家撰写，涵盖了从底层数学原理到最前沿的分布式系统、大语言模型 (LLM) 及 AI 伦理的全方位内容。

## 🌟 项目亮点

-   **专业性 (Professionalism)**: 深度解析底层原理，如奇异值分解 (SVD)、ZeRO 优化协议、Attention 机制等。
-   **权威性 (Authority)**: 所有知识点均追溯至学术论文 (arXiv) 或 Google、OpenAI、NVIDIA 等顶级机构的工程实践。
-   **结构化 (Structured)**: 从基础理论到工程落地，逻辑清晰，适合系统性学习。
-   **双语术语 (Bilingual Terminology)**: 核心概念同时提供中英文对照，确保学术交流的准确性。

## 📚 知识体系索引

您可以点击下方主题进入对应的深度文档。

### [01 基础理论 (Fundamentals)](./docs/01_Fundamentals/README.md)
*   **[线性代数](./docs/01_Fundamentals/Linear_Algebra/Linear_Algebra.md)**: 张量、SVD、特征值。
*   **[概率与统计](./docs/01_Fundamentals/Probability_Statistics/Probability_Statistics.md)**: 贝叶斯、MLE/MAP、信息熵。
*   **[算法与数据结构](./docs/01_Fundamentals/Data_Structures_Algorithms/Data_Structures_Algorithms.md)**: 计算图、HNSW、自动微分。
*   **[分布式系统](./docs/01_Fundamentals/Distributed_Systems/Distributed_Systems.md)**: NCCL、模型并行、流水线并行。

### [02 经典机器学习 (Classical Machine Learning)](./docs/02_Machine_Learning/README.md)
*   **[监督学习](./docs/02_Machine_Learning/Supervised_Learning/Supervised_Learning.md)**: 逻辑回归、XGBoost、随机森林。
*   **[无监督学习](./docs/02_Machine_Learning/Unsupervised_Learning/Unsupervised_Learning.md)**: K-Means、DBSCAN、PCA、t-SNE。

### [03 深度学习基础 (Deep Learning Foundations)](./docs/03_Deep_Learning/README.md)
*   **[神经网络核心](./docs/03_Deep_Learning/Neural_Network_Core/Neural_Network_Core.md)**: 反向传播、激活函数、归一化。
*   **[训练优化](./docs/03_Deep_Learning/Optimization/Optimization.md)**: AdamW、正则化、早停法。

### [04 NLP 与大模型 (NLP & LLMs)](./docs/04_NLP_LLMs/README.md)
*   **[Transformer 革命](./docs/04_NLP_LLMs/Transformer_Revolution/Transformer_Revolution.md)**: Self-Attention、位置编码。
*   **[LLM 架构](./docs/04_NLP_LLMs/LLM_Architectures/LLM_Architectures.md)**: GPT、BERT、MoE。
*   **[微调技术](./docs/04_NLP_LLMs/Fine_tuning_Techniques/Fine_tuning_Techniques.md)**: LoRA、QLoRA。

### [05 计算机视觉 (Computer Vision)](./docs/05_Computer_Vision/README.md)
*   **[图像分类与检测](./docs/05_Computer_Vision/Image_Classification_Detection/Image_Classification_Detection.md)**: ResNet、ViT、YOLOv8。
*   **[生成模型](./docs/05_Computer_Vision/Generative_Models/Generative_Models.md)**: 扩散模型、Stable Diffusion。

### [06 强化学习与智能体 (RL & Agents)](./docs/06_Reinforcement_Learning/README.md)
*   **[RL 基础](./docs/06_Reinforcement_Learning/RL_Foundations/RL_Foundations.md)**: MDP、贝尔曼方程。
*   **[深度 RL](./docs/06_Reinforcement_Learning/Deep_RL/Deep_RL.md)**: DQN、PPO、离线 RL。
*   **[AI Agents](./docs/06_Reinforcement_Learning/AI_Agents/AI_Agents.md)**: 规划、记忆、工具使用。

### [07 AI 工程化 (AI Engineering & MLOps)](./docs/07_AI_Engineering/README.md)
*   **[推理与量化](./docs/07_AI_Engineering/Deployment_Inference/Deployment_Inference.md)**: vLLM、TensorRT、AWQ。
*   **[RAG 系统](./docs/07_AI_Engineering/RAG_Systems/RAG_Systems.md)**: 向量索引、混合搜索、重排序。

### [08 安全与伦理 (Ethics, Safety & Alignment)](./docs/08_Ethics_Safety/README.md)
*   **[价值对齐](./docs/08_Ethics_Safety/Value_Alignment/Value_Alignment.md)**: RLHF、DPO、偏好优化。
*   **[安全与红队](./docs/08_Ethics_Safety/AI_Safety_RedTeaming/AI_Safety_RedTeaming.md)**: 提示词注入、越狱、防御护栏。

### [09 业界观点与演讲 (Talks & Perspectives)](./docs/09_talks/elon_musk/sayings.md)
*   **Elon Musk**: 风险与监管。[查看](./docs/09_talks/elon_musk/sayings.md)
*   **Fei-Fei Li (李飞飞)**: 人本 AI。[查看](./docs/09_talks/fei_fei_li/sayings.md)
*   **Andrew Ng**: “AI 是新的电力”。[查看](./docs/09_talks/andrew_ng/sayings.md)
*   **三巨头 Hinton / LeCun / Bengio**: 安全、开放与深度学习未来。[Hinton](./docs/09_talks/geoffrey_hinton/sayings.md) / [LeCun](./docs/09_talks/yann_lecun/sayings.md) / [Bengio](./docs/09_talks/yoshua_bengio/sayings.md)
*   **AGI/对齐**: [Demis Hassabis](./docs/09_talks/demis_hassabis/sayings.md) / [Dario Amodei](./docs/09_talks/dario_amodei/sayings.md) / [Ilya Sutskever](./docs/09_talks/ilya_sutskever/sayings.md) / [Sam Altman](./docs/09_talks/sam_altman/sayings.md)
*   **产业与平台**: [Jensen Huang](./docs/09_talks/jensen_huang/sayings.md) / [Satya Nadella](./docs/09_talks/satya_nadella/sayings.md) / [Sundar Pichai](./docs/09_talks/sundar_pichai/sayings.md) / [Bill Gates](./docs/09_talks/bill_gates/sayings.md) / [Mark Zuckerberg](./docs/09_talks/mark_zuckerberg/sayings.md)
*   **开源/产品/教育**: [Mustafa Suleyman](./docs/09_talks/mustafa_suleyman/sayings.md) / [Emad Mostaque](./docs/09_talks/emad_mostaque/sayings.md) / [Andrej Karpathy](./docs/09_talks/andrej_karpathy/sayings.md) / [Richard Socher](./docs/09_talks/richard_socher/sayings.md) / [Mira Murati](./docs/09_talks/mira_murati/sayings.md) / [Sebastian Thrun](./docs/09_talks/sebastian_thrun/sayings.md)

### [10 必读 AI 论文清单 (Essential Papers)](./docs/10_papers/README.md)
*   **学习路径**: 从基础训练与优化到大模型、生成式、强化学习、工程化与安全对齐的完整必读路线。[查看](./docs/10_papers/README.md)

### [11 AI 面试与岗位 (Interviews & Roles)](./docs/11_interviews/jobs.md)
*   **岗位地图**: 研究、工程、产品与安全方向的岗位清单与面试准备。[查看](./docs/11_interviews/jobs.md)

---
*Powered by AI Guru Team*
