---
title: "MLabonne LLM 课程 (80k)"
category: "-references"
tags: ["llm", "learning-resource", "github-repo", "fine-tuning", "quantization", "roadmap"]
summary: "GitHub 最受欢迎的 LLM 学习路线(80k star),含三大部分:LLM 基础、LLM 科学家、LLM 工程师,附带 Colab 实战 Notebook。"
sources:
  - "https://github.com/mlabonne/llm-course"
created: 2026-06-12
updated: 2026-06-12
lifecycle: reviewed
tier: core
aliases:
  - "Llm Course Mlabonne"
  - "llm course mlabonne"

---
# MLabonne LLM 课程 (80k)

> **一句话理解**: GitHub 最受欢迎的 LLM 学习路线(80k star),含三大部分:LLM 基础、LLM 科学家、LLM 工程师,附带 Colab 实战 Notebook。

## 项目概况

- **仓库**: [mlabonne/llm-course](https://github.com/mlabonne/llm-course)
- **Star**: 80,000+ | Fork: 9,300+
- **作者**: Maxime Labonne
- **许可证**: Apache-2.0
- **配套书籍**: LLM Engineer's Handbook

## 课程结构

课程分为三大部分,每部分都有详细的路线图和 Colab Notebook:

### 第一部分:LLM 基础(可选)

覆盖数学、Python 和神经网络的基础知识,供按需查阅:

| 主题 | 核心内容 |
|------|---------|
| **数学基础** | 线性代数(向量、矩阵、特征值)、微积分(梯度、优化)、概率统计(贝叶斯推断、MLE) |
| **Python** | 基础语法、NumPy/Pandas/Matplotlib、Scikit-learn、数据预处理 |
| **神经网络** | 前向/反向传播、激活函数、损失函数、优化器(Adam)、正则化(Dropout、L1/L2) |
| **NLP 基础** | 分词、词嵌入(Word2Vec、GloVe)、RNN/LSTM/GRU |

### 第二部分:LLM 科学家

聚焦于使用最新技术构建最佳 LLM:

| 章节 | 核心内容 |
|------|---------|
| **LLM 架构** | Transformer 架构演进、分词策略、注意力机制、采样策略(贪心/束搜索/温度采样/核采样) |
| **预训练** | 数据准备(FineWeb 15T tokens)、分布式训练(数据/流水线/张量并行)、训练优化(AdamW、混合精度) |
| **后训练数据集** | ShareGPT/OpenAI 格式、ChatML/Alpaca 模板、合成数据生成(GPT-4o)、质量过滤 |
| **监督微调(SFT)** | LoRA/QLoRA、全量微调、超参数调优、数据质量优先 |
| **偏好对齐** | RLHF(PPO)、DPO、KTO、ORPO、奖励模型训练 |
| **评估** | 自动评估(LLM-as-Judge)、人工评估、基准测试(MMLU、HumanEval) |
| **量化** | GGUF、GPTQ、EXL2、AWQ、HQQ 格式对比 |
| **模型合并** | MergeKit 工具、SLERP/TIES/DARE 合并策略、MoE 构建 |

### 第三部分:LLM 工程师

聚焦于构建 LLM 应用并部署:

| 章节 | 核心内容 |
|------|---------|
| **运行 LLM** | LM Studio、Ollama、llama.cpp、API 服务 |
| **向量数据库** | Pinecone、ChromaDB、Qdrant、FAISS |
| **RAG** | 编排器(LangChain/LlamaIndex)、检索器(HyDE/CoRAG)、记忆机制、评估(Ragas/DeepEval) |
| **高级 RAG** | 查询构建(SQL/Cypher)、工具使用、后处理(重排序/RAG-Fusion)、DSPy |
| **Agent** | 思维-行动-观察循环、MCP/A2A 协议、LangGraph/LlamaIndex/CrewAI 框架 |
| **推理优化** | Flash Attention、KV Cache(MQA/GQA)、投机解码(EAGLE-3) |
| **部署** | 本地部署(LM Studio/Ollama)、Demo(Gradio/Streamlit)、生产(TGI/vLLM)、边缘(MLC LLM) |
| **安全** | 提示注入、后门攻击、防御措施(garak 红队测试、Langfuse 监控) |

## 实战 Notebook 精选

| Notebook | 描述 |
|----------|------|
| Fine-tune Llama 3.1 with Unsloth | 超高效 SFT(Google Colab) |
| Fine-tune Llama 3 with ORPO | 单阶段更便宜更快的微调 |
| Merge LLMs with MergeKit | 无需 GPU 即可合并模型 |
| Introduction to Quantization | 8-bit 量化入门 |
| 4-bit Quantization using GPTQ | 消费级硬件运行 LLM |
| Quantization with GGUF | llama.cpp 量化并上传 HF Hub |

## 适用人群

- 想系统学习 LLM 全栈的工程师
- 有 ML 基础想深入 LLM 领域的研究者
- 需要从零构建 LLM 应用的开发者

> **关联**: -> [[大模型|NLP/LLM]] | [[模型训练|模型训练]] | [[部署推理|部署推理]] | [[90_Learn/guides/ai_engineering_roadmap_2026|AI 工程路线图]]

