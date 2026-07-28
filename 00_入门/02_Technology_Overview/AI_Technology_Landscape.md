---
title: AI技术全景概览
category: 00-ai-introduction
tags: ["ai", "landscape", "overview", "ecosystem"]
summary: "AI技术生态像一座冰山——你看到的ChatGPT只是水面上的尖端，水面下是数十年积累的数学理论、算法创新、工程实践和基础设施。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Ai Technology Landscape"
  - "AI Technology Landscape"
  - AI_Technology_Landscape
sources: []

name_zh: "AI技术全景概览"
---
# AI 技术全景概览

> 中文简称：AI技术全景概览

> **一句话理解**: AI 技术生态像一座冰山——你看到的 ChatGPT 只是水面上的尖端，水面下是数十年积累的数学理论、算法创新、工程实践和基础设施。

---

## 1. AI技术生态总览

### 1.1 技术栈全景图

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AI应用层                                    │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐          │
│  │ 智能助手 │ 推荐系统 │ 自动驾驶 │ 医疗诊断 │ 内容创作 │          │
│  │ ChatGPT  │ 抖音     │ Tesla    │ 影像AI   │ Midjourney          │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘          │
├─────────────────────────────────────────────────────────────────────┤
│                         AI模型层                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  基础模型 (Foundation Models)                                 │  │
│  │  ├── 大语言模型: GPT-5.2, Claude 4.5, Llama 4, Gemini 2.0  │  │
│  │  ├── 视觉模型: SAM 2, DINOv2, CLIP                          │  │
│  │  ├── 多模态: GPT-4o, Gemini 2.0, Qwen-VL                    │  │
│  │  └── 语音: Whisper 4, GPT-4o Audio                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────┬──────────────┬──────────────┐                    │
│  │ 领域模型      │ 任务模型      │ 小型模型      │                    │
│  │ 医疗/法律/金融 │ 检测/分割/NER │ 端侧部署     │                    │
│  └──────────────┴──────────────┴──────────────┘                    │
├─────────────────────────────────────────────────────────────────────┤
│                         AI算法层                                    │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐     │
│  │ 机器学习      │ 深度学习      │ 强化学习      │ 生成模型      │     │
│  │ SVM/XGBoost  │ CNN/RNN/Transformer│ PPO/DPO/Q-learning│ GAN/Diffusion│     │
│  └──────────────┴──────────────┴──────────────┴──────────────┘     │
├─────────────────────────────────────────────────────────────────────┤
│                         AI框架层                                    │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐     │
│  │ PyTorch 2.x  │ TensorFlow 2.x│ JAX          │ 国产框架      │     │
│  │ 研究首选      │ 工业部署      │ 高效计算      │ Paddle/MindSpore│   │
│  └──────────────┴──────────────┴──────────────┴──────────────┘     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ 应用框架: LangChain, LlamaIndex, Hugging Face, Dify, vLLM  │    │
│  └────────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                         基础设施层                                  │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐     │
│  │ 计算硬件      │ 存储系统      │ 网络通信      │ 云平台        │     │
│  │ GPU/TPU/NPU  │ 向量数据库    │ InfiniBand   │ AWS/Azure    │     │
│  │ H100/B200    │ Milvus/PGVector│ NCCL         │ 阿里云        │     │
│  └──────────────┴──────────────┴──────────────┴──────────────┘     │
├─────────────────────────────────────────────────────────────────────┤
│                         数据层                                      │
│  ┌──────────────┬──────────────┬──────────────┐                    │
│  │ 训练数据      │ 标注平台      │ 数据治理      │                    │
│  │ 公开数据集    │ Scale/LabelBox│ 质量/安全/隐私│                    │
│  └──────────────┴──────────────┴──────────────┘                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 技术演进时间线

```
AI技术代际演进:

第一代 (1950s-1980s): 符号AI
├── 专家系统
├── 知识表示
├── 逻辑推理
└── 局限: 知识获取瓶颈

第二代 (1990s-2010s): 统计机器学习
├── SVM、随机森林
├── 朴素贝叶斯
├── 特征工程时代
└── 局限: 特征需要人工设计

第三代 (2010s-2020s): 深度学习
├── CNN革命 (2012 AlexNet)
├── RNN/LSTM序列建模
├── Transformer统一架构 (2017)
└── 局限: 需要大量标注数据

第四代 (2020s-至今): 基础模型时代
├── 预训练 + 提示/微调
├── 大语言模型 (GPT-3/4, Claude)
├── 多模态统一
└── 特征: 涌现能力、上下文学习
```

---

## 2. 核心技术详解

### 2.1 机器学习算法族谱

```
机器学习算法分类:

监督学习 (Supervised Learning)
├── 分类 (Classification)
│   ├── 逻辑回归 (Logistic Regression)
│   ├── 支持向量机 (SVM)
│   ├── 决策树 / 随机森林
│   ├── 梯度提升树 (XGBoost/LightGBM)
│   └── 神经网络
├── 回归 (Regression)
│   ├── 线性回归
│   ├── 多项式回归
│   └── 神经网络回归
└── 序列标注
    ├── CRF (条件随机场)
    └── BiLSTM+CRF

无监督学习 (Unsupervised Learning)
├── 聚类 (Clustering)
│   ├── K-Means
│   ├── DBSCAN
│   └── 层次聚类
├── 降维 (Dimensionality Reduction)
│   ├── PCA (主成分分析)
│   ├── t-SNE
│   └── UMAP
├── 异常检测 (Anomaly Detection)
└── 关联规则 (Apriori)

强化学习 (Reinforcement Learning)
├── 基于值函数
│   ├── Q-Learning
│   ├── DQN
│   └── Double DQN
├── 基于策略梯度
│   ├── REINFORCE
│   ├── Actor-Critic
│   ├── A3C
│   └── PPO (Proximal Policy Optimization)
└── 基于模型
    ├── AlphaGo / AlphaZero
    └── MuZero
```

### 2.2 深度学习架构演进

```
神经网络架构演进史:

多层感知机 (MLP) - 1986
├── 全连接层堆叠
├── 非线性激活函数
└── 反向传播训练

卷积神经网络 (CNN) - 1998 (LeNet), 2012爆发 (AlexNet)
├── 卷积层: 提取局部特征
├── 池化层: 降维
├── 全连接层: 分类
└── 代表: AlexNet, VGG, ResNet, EfficientNet

循环神经网络 (RNN) - 1980s, 2010s流行
├── 处理序列数据
├── 记忆历史信息
├── 变体: LSTM, GRU (解决长程依赖)
└── 应用: 语音识别、机器翻译

Transformer - 2017 (Attention Is All You Need)
├── 自注意力机制 (Self-Attention)
├── 并行计算 (优于RNN串行)
├── 长距离依赖建模
└── 统一了NLP和CV的架构

视觉Transformer (ViT) - 2020
├── 将图像切成patch
├── 用Transformer处理
├── 挑战CNN在CV的地位
└── 代表: ViT, Swin Transformer

生成模型家族
├── VAE (变分自编码器) - 2013
├── GAN (生成对抗网络) - 2014
├── Flow-based - 2014
├── Diffusion - 2020 (图像生成SOTA)
└── Autoregressive - GPT系列
```

### 2.3 大语言模型技术拆解

```
大语言模型核心技术栈:

预训练 (Pre-training)
├── 数据: 数万亿token互联网文本
├── 目标: 预测下一个token
├── 计算: 数千GPU训练数月
├── 成本: 数百万到数千万美元
└── 输出: 基础模型 (如GPT-3)

架构组件
├── Tokenizer: 文本 → token序列
├── Embedding: token → 向量表示
├── Transformer Block × N层
│   ├── Multi-Head Self-Attention
│   ├── Feed-Forward Network
│   └── Layer Norm + Residual
├── 输出层: 预测下一个token概率
└── 参数量: 7B到1T+

对齐技术 (Alignment)
├── SFT (监督微调)
│   └── 高质量对话数据微调
├── RLHF (人类反馈强化学习)
│   ├── 训练奖励模型
│   └── PPO优化策略
├── DPO (直接偏好优化)
│   └── 绕过奖励模型直接优化
└── 目的: 有用、无害、诚实

推理优化
├── 量化 (INT8/INT4)
├── KV Cache优化
├── 投机解码
├── 模型并行
└── 连续批处理
```

### 2.4 计算机视觉技术栈

```
计算机视觉任务与技术:

图像分类 (Image Classification)
├── 任务: 图片属于哪个类别？
├── 技术: CNN → Vision Transformer
├── 数据集: ImageNet (1000类)
└── 应用: 医学影像诊断、质量检测

目标检测 (Object Detection)
├── 任务: 在哪里？是什么？
├── 技术演进:
│   ├── R-CNN系列 (两阶段)
│   ├── YOLO系列 (单阶段、实时)
│   └── DETR (基于Transformer)
└── 应用: 自动驾驶、安防监控

图像分割 (Segmentation)
├── 语义分割: 每个像素的类别
├── 实例分割: 区分不同个体
├── 技术: U-Net, Mask R-CNN, SAM
└── 应用: 医学影像、自动驾驶

图像生成 (Image Generation)
├── GAN: 对抗训练生成
├── Diffusion: 逐步去噪生成
├── 代表: DALL-E 3, Midjourney, SD
└── 应用: 艺术创作、设计辅助

多模态理解
├── 任务: 图像+文本联合理解
├── 技术: CLIP (图文对齐)
├── 应用: 图文检索、视觉问答
└── 代表: GPT-4V, Gemini Pro Vision
```

### 2.5 语音与音频技术

```
语音技术栈:

语音识别 (ASR - Automatic Speech Recognition)
├── 输入: 音频波形
├── 输出: 文本
├── 技术: CTC → Attention → Whisper
├── 代表: Whisper (OpenAI), 科大讯飞
└── 应用: 语音输入、字幕生成

语音合成 (TTS - Text to Speech)
├── 输入: 文本
├── 输出: 自然语音
├── 技术演进:
│   ├── 拼接合成
│   ├── 参数合成
│   └── 神经网络端到端
├── 代表: ElevenLabs, Azure TTS
└── 应用: 有声书、智能客服

音乐生成
├── 符号音乐生成: MIDI
├── 音频生成: 原始波形
├── 代表: MusicLM, Suno, Udio
└── 应用: 配乐创作、辅助作曲

声音克隆
├── 少量样本克隆音色
├── 代表: ElevenLabs Voice Cloning
└── 应用: 个性化语音助手
```

---

## 3. 支撑技术体系

### 3.1 数据工程

```
AI数据 pipeline:

数据采集
├── 公开数据集 (ImageNet, C4, LAION-5B)
├── 网络爬取 (Common Crawl)
├── 众包标注 (Amazon Mechanical Turk)
├── 合成数据 (Simulation, GAN生成)
└── 领域专有数据

数据清洗
├── 去重 (Near-deduplication)
├── 过滤 (低质量、有害内容)
├── 去标识化 (PII移除)
├── 平衡 (类别均衡)
└── 格式统一

数据标注
├── 分类标注
├── 边界框标注
├── 分割标注
├── 序列标注
└── 人类偏好标注 (RLHF)

数据版本管理
├── DVC (Data Version Control)
├── 数据血缘追踪
└── 质量监控
```

### 3.2 AI基础设施

```
AI计算基础设施:

硬件层
├── GPU (通用并行计算)
│   ├── NVIDIA: H100, H200, B200
│   ├── AMD: MI300X
│   └── Intel: Gaudi
├── TPU (Google专用)
├── NPU (端侧)
│   ├── Apple Neural Engine
│   ├── Qualcomm Hexagon
│   └── 华为昇腾
└── 推理专用芯片
    ├── Groq
    ├── Cerebras
    └── SambaNova

存储系统
├── 对象存储: S3, GCS, OSS
├── 高速存储: NVMe SSD
├── 分布式文件系统
└── 向量数据库
    ├── Milvus
    ├── Pinecone
    ├── Weaviate
    └── PGVector

网络通信
├── InfiniBand (高速互联)
├── RDMA (远程直接内存访问)
├── NCCL (NVIDIA集合通信库)
└── 分布式训练网络拓扑
```

### 3.3 模型部署与工程

```
模型部署技术栈:

模型格式
├── PyTorch (.pt, .pth)
├── TensorFlow (.pb, SavedModel)
├── ONNX (跨框架标准)
├── TensorRT (NVIDIA优化)
└── GGML/GGUF (端侧量化)

推理优化
├── 量化 (Quantization)
│   ├── INT8: 速度↑, 精度轻微↓
│   ├── INT4: 模型大小↓75%
│   └── GPTQ/AWQ: 大模型量化
├── 剪枝 (Pruning)
│   └── 移除不重要权重
├── 蒸馏 (Distillation)
│   └── 大模型 → 小模型
└── 编译优化
    ├── TorchScript
    ├── TVM
    └── MLIR

服务化框架 (2026主流)
├── vLLM: 高吞吐LLM服务，PagedAttention
├── SGLang: 结构化生成，RadixAttention
├── TensorRT-LLM: NVIDIA官方优化
├── llama.cpp/llamafile: 端侧推理
├── Ollama: 本地模型运行
└── Inference Endpoints: 云端托管服务

部署架构
├── 云端部署
│   ├── Serverless (AWS Lambda)
│   ├── 容器化 (K8s)
│   └── 专用实例
├── 边缘部署
│   ├── 边缘服务器
│   ├── 移动端
│   └── IoT设备
└── 混合部署
```

---

## 4. 前沿技术趋势 (2026)

### 4.1 Agentic AI (智能体 AI)

```
AI Agent技术栈 (2026):

核心能力
├── 推理规划 (Reasoning)
│   └── CoT (Chain of Thought)、推理模型
├── 工具使用 (Tool Use)
│   ├── Function Calling / MCP协议
│   └── API调用、Web浏览、代码执行
├── 记忆管理 (Memory)
│   ├── 短期记忆 (上下文窗口)
│   └── 长期记忆 (向量数据库+RAG)
└── 自主执行 (Autonomy)
    ├── 目标分解与规划
    ├── 自我纠错与反思
    └── 多步骤任务执行

架构模式
├── ReAct: 推理+行动交替
├── Plan-and-Execute: 先规划后执行
├── Multi-Agent: 多智能体协作 (CrewAI, AutoGen)
├── Reflexion: 自我反思改进
└── Supervisor: 单智能体监控多子智能体

协议标准 (2026)
├── MCP (Model Context Protocol) - Anthropic主导
├── A2A (Agent-to-Agent) - Agent间通信
├── ACP (Agent Communication Protocol) - 阿里主导
└── 已成行业事实标准，主流厂商采用
```

### 4.2 多模态统一

```
多模态AI技术:

模态融合
├── 早期融合: 原始数据层融合
├── 中期融合: 特征层融合
├── 晚期融合: 决策层融合
└── 统一架构: 单一模型处理多模态

代表模型
├── GPT-4V: 视觉+语言
├── Gemini: 原生多模态
├── CLIP: 图文对齐
└── Whisper: 语音+语言

应用场景
├── 图文理解: 看图说话
├── 视频分析: 时序理解
├── 跨模态检索: 以图搜文
└── 多模态生成: 文生图、图生文
```

### 4.3 世界模型与具身智能

```
世界模型 (World Models) - 2026年热点:

概念
├── 学习世界的动态规律
├── 预测行动后果
├── 支撑规划决策
└── 2026年资本和研究热点

技术路线
├── JEPA (Joint Embedding Predictive Architecture)
│   └── Yann LeCun主推，Meta持续投入
├── Sora/视频生成模型
│   └── 学习物理世界规律
├── 神经辐射场 (NeRF)
│   └── 3D场景重建
├── 3D高斯溅射 (3D Gaussian Splatting)
│   └── 实时高保真3D渲染
└── 世界模型+强化学习
    └── 内部仿真环境学习

具身智能 (Embodied AI) - 2026商业化元年:
├── VLA模型 (Vision-Language-Action)
│   ├── RT-2 (Google)
│   ├── π0 (Physical Intelligence)
│   ├── OpenVLA (Stanford)
│   └── 2026: 工厂/物流场景突破
├── Sim-to-Real迁移
│   └── 仿真到现实趋于成熟
└── 人形机器人
    ├── Tesla Optimus (2026工厂部署)
    ├── Figure 01 (BMW工厂测试)
    ├── Unitree H1 (开源)
    └── 宇树科技、傅利叶等国产
```

### 4.4 效率与优化

```
2026效率优化趋势:

模型架构优化
├── MoE (Mixture of Experts)
│   ├── 稀疏激活，推理效率↑
│   └── GPT-4、Llama 4等大型模型采用
├── Mamba / State Space Models
│   └── 线性复杂度序列建模，长上下文
├── 线性注意力
│   └── 降低注意力计算成本
└── 混合模态架构
    └── 统一处理文本、图像、视频

训练效率
├── 混合精度训练 (FP16/BF16)
├── 梯度检查点
├── ZeRO优化 (DeepSpeed)
├── FSDP (PyTorch)
└── 流水并行 + 张量并行

推理效率
├── 投机解码 (Speculative Decoding)
│   └── 小模型预测，大模型验证，2-3倍加速
├── 分页注意力 (PagedAttention)
│   └── vLLM核心技术，显存利用率↑
├── 连续批处理 (Continuous Batching)
│   └── GPU利用率最大化
├── INT4/INT8 量化
│   └── GPTQ、AWQ、GGUF格式
└── 动态批处理

端侧部署
├── 模型压缩 (剪枝、知识蒸馏)
├── NPU优化 (Apple Neural Engine、Qualcomm Hexagon)
├── 联邦学习
└── 边缘-云协同推理
```

---

## 5. 开源生态与工具链

### 5.1 开源模型生态

```
开源大模型生态 (2026):

基础模型
├── Llama 4 (Meta)
│   ├── 8B, 70B, 405B
│   └── 开源可商用
├── Qwen 3 (阿里巴巴)
│   ├── 多尺寸、多模态
│   └── 中英双语优化
├── DeepSeek V3
│   ├── 高性价比训练
│   └── 推理优化领先
├── Mistral (欧洲)
├── Gemma 3 (Google)
└── 其他: Yi, Baichuan, ChatGLM4

领域模型
├── 代码: CodeLlama 3, StarCoder 2, DeepSeek-Coder V3
├── 数学: DeepSeek-Math, Qwen-Math
├── 多模态: LLaVA 2, Qwen-VL 2
└── 医疗: Meditron 4, HuatuoGPT
```

### 5.2 开发工具链

```
AI开发工具全景:

模型开发
├── PyTorch (研究首选)
├── TensorFlow (工业界)
├── JAX (Google, 高效计算)
├── PaddlePaddle (百度)
└── MindSpore (华为)

模型库与平台
├── Hugging Face
│   ├── Transformers库
│   ├── Datasets库
│   ├── Tokenizers库
│   └── Model Hub
├── ModelScope (阿里巴巴)
└── 魔乐社区 (华为)

应用开发
├── LangChain (LLM应用框架)
├── LlamaIndex (RAG框架)
├── AutoGPT (自主Agent)
├── CrewAI (Multi-Agent)
└── Dify / Flowise (低代码)

实验管理
├── Weights & Biases
├── MLflow
├── TensorBoard
└── ClearML
```

---

## 6. 技术选型指南

### 6.1 按任务选型

| 任务 | 推荐技术 | 代表模型/工具 |
|------|----------|--------------|
| **文本分类** | Transformer 编码器 | BERT, RoBERTa |
| **文本生成** | Transformer 解码器 | GPT-4, Llama, Qwen |
| **机器翻译** | Encoder-Decoder | T5, mBART, NLLB |
| **图像分类** | CNN / ViT | ResNet, EfficientNet, ViT |
| **目标检测** | YOLO / DETR | YOLOv8, RT-DETR |
| **图像分割** | U-Net / SAM | SAM 2, SegFormer |
| **图像生成** | Diffusion | SDXL, DALL-E 3, Flux |
| **语音识别** | CTC / Attention | Whisper, Wav2Vec 2.0 |
| **推荐系统** | 深度学习+传统 | DeepFM, DSSM |
| **时序预测** | LSTM / Transformer | TFT, N-BEATS |

### 6.2 按场景选型

```
场景1: 研究实验
├── 框架: PyTorch
├── 模型: Hugging Face Transformers
├── 实验: W&B
└── 计算: 实验室GPU服务器

场景2: 生产部署
├── 训练: PyTorch/TensorFlow
├── 优化: TensorRT/ONNX
├── 服务: vLLM/Triton
└── 监控: Prometheus/Grafana

场景3: 端侧应用
├── 框架: ONNX Runtime
├── 模型: MobileNet, EfficientNet-Lite
├── 量化: INT8
└── 部署: Core ML, TFLite

场景4: 快速原型
├── 平台: Hugging Face Spaces
├── API: OpenAI/Claude API
├── 框架: LangChain
└── 部署: Gradio/Streamlit
```

---

## 7. 学习路径建议

### 7.1 技术学习路线图

```
阶段1: 基础 (1-2个月)
├── Python编程
├── 数学基础 (线性代数、概率论)
├── NumPy, Pandas, Matplotlib
└── 机器学习基础概念

阶段2: 核心 (2-3个月)
├── 经典机器学习算法
├── Scikit-learn实践
├── 深度学习基础 (神经网络)
├── PyTorch/TensorFlow入门

阶段3: 进阶 (3-6个月)
├── CNN计算机视觉
├── RNN/Transformer NLP
├── 大语言模型
├── 项目实战

阶段4: 专精 (持续)
├── 选定方向深入
├── 阅读论文
├── 参与开源
└── 解决实际问题
```

---

## 8. 参考资源

### 技术文档
- [Papers With Code](https://paperswithcode.com/) - 论文+代码
- [Hugging Face Docs](https://huggingface.co/docs) - 模型库文档
- [PyTorch Tutorials](https://pytorch.org/tutorials/)

### 技术博客
- Distill.pub (可视化解释)
- Lil'Log (技术深度文章)
- Google AI Blog
- OpenAI Blog

### 社区
- Hugging Face Community
- Reddit r/MachineLearning
- 知乎 AI 话题
- Twitter/X AI researchers

---

*Last updated: 2026-04-01* (通识课教材版)

## Related

- [[概念/ai-technology-landscape]] — AI 技术全景
- [[概念/ai-fundamentals]] — AI 基础概念
- [[概念/ai-hardware]] — AI 硬件
