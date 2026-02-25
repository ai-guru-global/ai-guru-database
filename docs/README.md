# AI Guru 知识库 (AI Guru Knowledge Base)

欢迎来到 **AI Guru** 知识库。这是目前业界最完整、最专业的 AI 知识体系指南，旨在为开发者、研究人员和 AI 爱好者提供从底层原理到前沿应用的深度解析。

## 知识体系大纲 (Knowledge System Taxonomy)

本知识库按照以下逻辑构建，您可以点击链接进入对应的专题进行深入学习。

### [01 基础理论 (Fundamentals)](./01_Fundamentals/README.md)
*   **数学基础**: 线性代数、微积分、概率论与数理统计、最优化理论。
*   **计算机科学基础**: 数据结构与算法、分布式系统。
*   **来源**: 
    *   [Deep Learning Book - Ian Goodfellow](https://www.deeplearningbook.org/)
    *   [Mathematics for Machine Learning](https://mml-book.github.io/)

### [02 经典机器学习 (Classical Machine Learning)](./02_Machine_Learning/README.md)
*   **监督学习**: 线性回归、逻辑回归、支持向量机 (SVM)、决策树与随机森林、梯度提升树 (XGBoost/LightGBM)。
*   **无监督学习**: 聚类 (K-Means)、降维 (PCA/t-SNE)。
*   **特征工程**: 数据清洗、特征选择、特征转换。
*   **来源**:
    *   [Scikit-learn Documentation](https://scikit-learn.org/stable/user_guide.html)
    *   [Pattern Recognition and Machine Learning - Christopher Bishop](https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf)

### [03 深度学习基础 (Deep Learning Foundations)](./03_Deep_Learning/README.md)
*   **神经网络**: 多层感知机 (MLP)、反向传播算法。
*   **优化与正则化**: SGD, Adam, Dropout, Batch Norm。
*   **计算框架**: PyTorch 深度解析、TensorFlow 原理。
*   **来源**:
    *   [PyTorch Tutorials](https://pytorch.org/tutorials/)
    *   [CS231n: Deep Learning for Computer Vision](http://cs231n.stanford.edu/)

### [04 自然语言处理与大模型 (NLP & LLMs)](./04_NLP_LLMs/README.md)
*   **序列模型**: RNN, LSTM, GRU。
*   **Transformer 架构**: Attention Mechanism, Self-Attention, Multi-head Attention。
*   **大语言模型 (LLMs)**: GPT 系列、LLaMA 系列、BERT、T5。
*   **微调与对齐**: SFT, RLHF, DPO, LoRA, QLoRA。
*   **来源**:
    *   [Attention Is All You Need (Vaswani et al., 2017)](https://arxiv.org/abs/1706.03762)
    *   [Hugging Face Course](https://huggingface.co/learn/nlp-course/)

### [05 计算机视觉 (Computer Vision)](./05_Computer_Vision/README.md)
*   **图像处理**: 卷积神经网络 (CNN)、ResNet、EfficientNet。
*   **目标检测与分割**: YOLO 系列、Mask R-CNN。
*   **生成模型**: GANs, Diffusion Models (Stable Diffusion), Variational Autoencoders (VAEs)。
*   **来源**:
    *   [Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385)
    *   [DALL-E 3 / Stable Diffusion technical reports](https://openai.com/research/dall-e-3-system-card)

### [06 强化学习与智能体 (RL & Agents)](./06_Reinforcement_Learning/README.md)
*   **强化学习基础**: 马尔可夫决策过程 (MDP)、Q-Learning、Policy Gradient。
*   **深度强化学习**: DQN, PPO, SAC。
*   **AI Agents**: 工具调用 (Tool Calling)、记忆机制、多智能体协作 (Multi-Agent Systems)。
*   **来源**:
    *   [Reinforcement Learning: An Introduction - Sutton & Barto](http://incompleteideas.net/book/the-book-2nd.html)
    *   [OpenAI Spinning Up in Deep RL](https://spinningup.openai.com/)

### [07 AI 工程化与 MLOps (AI Engineering & MLOps)](./07_AI_Engineering/README.md)
*   **模型部署**: ONNX, TensorRT, Serving (vLLM, TGI)。
*   **量化与压缩**: INT8, FP8, AWQ, GGUF。
*   **向量数据库**: Milvus, Pinecone, FAISS, RAG (检索增强生成)。
*   **来源**:
    *   [vLLM: Easy, Fast, and Cheap LLM Serving](https://github.com/vllm-project/vllm)
    *   [Pinecone Learning Center](https://www.pinecone.io/learn/)

### [08 AI 伦理、安全与对齐 (Ethics, Safety & Alignment)](./08_Ethics_Safety/README.md)
*   **偏见与公平性**: 数据偏见、算法公平。
*   **安全对齐**: 红队测试 (Red Teaming)、提示词注入防御。
*   **法律法规**: 欧盟 AI 法案、中国生成式人工智能服务管理办法。
*   **来源**:
    *   [Anthropic: Core Views on AI Safety](https://www.anthropic.com/news/core-views-on-ai-safety)
    *   [AI Ethics Guidelines by IEEE](https://ethicsinaction.ieee.org/)

### [09 业界观点与演讲 (Talks & Perspectives)](./09_talks/elon_musk/sayings.md)
*   **Elon Musk**: 风险与监管。[查看](./09_talks/elon_musk/sayings.md)
*   **Fei-Fei Li (李飞飞)**: 人本 AI、多样性。[查看](./09_talks/fei_fei_li/sayings.md)
*   **Andrew Ng**: “AI 是新的电力”。[查看](./09_talks/andrew_ng/sayings.md)
*   **Geoffrey Hinton / Yann LeCun / Yoshua Bengio**: 深度学习三巨头的安全与开放立场。[Hinton](./09_talks/geoffrey_hinton/sayings.md) / [LeCun](./09_talks/yann_lecun/sayings.md) / [Bengio](./09_talks/yoshua_bengio/sayings.md)
*   **Demis Hassabis / Dario Amodei / Ilya Sutskever / Sam Altman**: AGI、对齐与治理。[Hassabis](./09_talks/demis_hassabis/sayings.md) / [Amodei](./09_talks/dario_amodei/sayings.md) / [Sutskever](./09_talks/ilya_sutskever/sayings.md) / [Altman](./09_talks/sam_altman/sayings.md)
*   **Jensen Huang / Satya Nadella / Sundar Pichai / Bill Gates / Mark Zuckerberg**: 产业与平台战略。[Huang](./09_talks/jensen_huang/sayings.md) / [Nadella](./09_talks/satya_nadella/sayings.md) / [Pichai](./09_talks/sundar_pichai/sayings.md) / [Gates](./09_talks/bill_gates/sayings.md) / [Zuckerberg](./09_talks/mark_zuckerberg/sayings.md)
*   **Mustafa Suleyman / Emad Mostaque / Andrej Karpathy / Richard Socher / Mira Murati / Sebastian Thrun**: 开源、去中心化、产品化与教育变革。[Suleyman](./09_talks/mustafa_suleyman/sayings.md) / [Mostaque](./09_talks/emad_mostaque/sayings.md) / [Karpathy](./09_talks/andrej_karpathy/sayings.md) / [Socher](./09_talks/richard_socher/sayings.md) / [Murati](./09_talks/mira_murati/sayings.md) / [Thrun](./09_talks/sebastian_thrun/sayings.md)

### [10 必读 AI 论文清单 (Essential Papers)](./10_papers/README.md)
*   **学习路径**: 从基础训练与优化到大模型、生成式、强化学习、工程化与安全对齐的完整必读路线。[查看](./10_papers/README.md)

### [11 AI 面试与岗位 (Interviews & Roles)](./11_interviews/jobs.md)
*   **岗位地图**: 研究、工程、产品与安全方向的岗位清单与面试准备。[查看](./11_interviews/jobs.md)

---
*Last updated: 2026-02-26*
