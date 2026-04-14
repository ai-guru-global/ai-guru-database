# 10 经典与必读 AI 论文清单 (Essential AI Papers)

本清单聚焦“必学必会”的核心论文，覆盖从深度学习基础到大模型、生成式模型、强化学习、工程化与安全对齐等关键脉络。建议按照下方“阅读路径”循序渐进。

## 阅读路径建议

1. **基础训练与优化** → 2. **视觉/表征学习** → 3. **NLP 与 Transformer** → 4. **生成式模型** → 5. **强化学习与智能体** → 6. **工程化与高效推理** → 7. **安全与对齐**

## 必读论文清单

### 01 深度学习基础与优化
- **Deep Learning (2015)** — 现代深度学习全景综述，系统把握核心概念与趋势。[论文链接](https://arxiv.org/abs/1504.08361)
- **ImageNet Classification with Deep Convolutional Neural Networks (2012)** — AlexNet 开启深度学习复兴。[论文链接](https://papers.nips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf)
- **Dropout: A Simple Way to Prevent Neural Networks from Overfitting (2014)** — 经典正则化技术，防止过拟合。[论文链接](https://jmlr.org/papers/v15/srivastava14a.html)
- **Batch Normalization: Accelerating Deep Network Training (2015)** — 训练稳定性与收敛速度的关键突破。[论文链接](https://arxiv.org/abs/1502.03167)
- **Adam: A Method for Stochastic Optimization (2014)** — 最常用的自适应优化器之一。[论文链接](https://arxiv.org/abs/1412.6980)

### 02 视觉与表征学习
- **Deep Residual Learning for Image Recognition (2015)** — ResNet，极深网络训练的核心方法。[论文链接](https://arxiv.org/abs/1512.03385)
- **U-Net: Convolutional Networks for Biomedical Image Segmentation (2015)** — 语义分割的经典架构。[论文链接](https://arxiv.org/abs/1505.04597)
- **Faster R-CNN (2015)** — 目标检测从两阶段走向实用化。[论文链接](https://arxiv.org/abs/1506.01497)
- **An Image is Worth 16x16 Words: Vision Transformers (2020)** — ViT 把 Transformer 引入视觉主流。[论文链接](https://arxiv.org/abs/2010.11929)

### 03 NLP 与 Transformer
- **Attention Is All You Need (2017)** — Transformer 的起点与自注意力机制。[论文链接](https://arxiv.org/abs/1706.03762)
- **BERT: Pre-training of Deep Bidirectional Transformers (2018)** — 预训练范式奠基。[论文链接](https://arxiv.org/abs/1810.04805)
- **Language Models are Few-Shot Learners (GPT-3, 2020)** — 规模化的关键拐点。[论文链接](https://arxiv.org/abs/2005.14165)
- **Training language models to follow instructions with human feedback (InstructGPT, 2022)** — RLHF 系统化方法。[论文链接](https://arxiv.org/abs/2203.02155)
- **LLaMA: Open and Efficient Foundation Language Models (2023)** — 开源大模型的重要里程碑。[论文链接](https://arxiv.org/abs/2302.13971)

### 04 生成式模型
- **Auto-Encoding Variational Bayes (2013)** — VAE 的核心理论与实践。[论文链接](https://arxiv.org/abs/1312.6114)
- **Generative Adversarial Nets (2014)** — GAN 的开创性工作。[论文链接](https://arxiv.org/abs/1406.2661)
- **Denoising Diffusion Probabilistic Models (2020)** — 现代扩散模型基石。[论文链接](https://arxiv.org/abs/2006.11239)
- **High-Resolution Image Synthesis with Latent Diffusion Models (2021)** — LDM，Stable Diffusion 的理论基础。[论文链接](https://arxiv.org/abs/2112.10752)

### 05 强化学习与智能体
- **Playing Atari with Deep Reinforcement Learning (2013)** — 深度 RL 的早期代表作（DQN）。[论文链接](https://arxiv.org/abs/1312.5602)
- **Proximal Policy Optimization Algorithms (2017)** — 工程上最常用的策略优化算法之一。[论文链接](https://arxiv.org/abs/1707.06347)
- **Mastering the Game of Go with Deep Neural Networks and Tree Search (2016)** — AlphaGo 标志性成果。[论文链接](https://www.nature.com/articles/nature16961)

### 06 规模化与工程化
- **Scaling Laws for Neural Language Models (2020)** — 规模化训练的经验法则。[论文链接](https://arxiv.org/abs/2001.08361)
- **Switch Transformers: Scaling to Trillion Parameter Models (2021)** — MoE 规模化的代表作。[论文链接](https://arxiv.org/abs/2101.03961)
- **ZeRO: Memory Optimizations Toward Training Trillion Parameter Models (2020)** — 分布式训练内存优化关键技术。[论文链接](https://arxiv.org/abs/1910.02054)
- **LoRA: Low-Rank Adaptation of Large Language Models (2021)** — 高效微调的经典方案。[论文链接](https://arxiv.org/abs/2106.09685)
- **QLoRA: Efficient Finetuning of Quantized LLMs (2023)** — 低成本微调实践的重要里程碑。[论文链接](https://arxiv.org/abs/2305.14314)
- **FlashAttention: Fast and Memory-Efficient Exact Attention (2022)** — 推理与训练加速的关键优化。[论文链接](https://arxiv.org/abs/2205.14135)

### 07 对齐与安全
- **Concrete Problems in AI Safety (2016)** — 安全问题拆解与研究路线图。[论文链接](https://arxiv.org/abs/1606.06565)
- **AI Safety via Debate (2018)** — 对齐研究的重要范式之一。[论文链接](https://arxiv.org/abs/1805.00899)
- **Constitutional AI: Harmlessness from AI Feedback (2022)** — 以规则与自我监督实现对齐。[论文链接](https://arxiv.org/abs/2212.08073)
- **Direct Preference Optimization (DPO, 2023)** — 简化对齐流程的关键方法。[论文链接](https://arxiv.org/abs/2305.18290)

---
*Last updated: 2026-02-26*
