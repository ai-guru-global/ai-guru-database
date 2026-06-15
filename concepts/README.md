---
title: 概念卡片索引 (Concept Cards Index)
category: meta
tags: [concepts, knowledge-graph, index]
summary: 90 张 AI 概念卡片，每张 5-9KB，覆盖 AI 全栈核心概念，与主章节通过 sources 字段关联。
created: 2026-06-03
updated: 2026-06-15
---

# 概念卡片索引 (Concept Cards)

> **定位**: 轻量级概念摘要层（每张 5-9KB），与主章节通过 `sources` 字段关联，构成知识图谱的节点网络。
>
> **与主章节的关系**: 每个概念卡片的 `sources` 指向主目录中对应的深度文档，形成"速查卡 → 深度文"的阅读路径。

---

## 按领域分类

### 基础与通识（8 张）

| 概念 | 来源章节 | 关键词 |
|------|----------|--------|
| [ai-fundamentals](./ai-fundamentals.md) | 00_AI_Introduction | AI 定义、类型、核心概念 |
| [ai-history](./ai-history.md) | 00_AI_Introduction | 1950-2026、4 次浪潮 |
| [ai-ethics](./ai-ethics.md) | 19_Ethics_Safety | 偏见、隐私、治理 |
| [ai-future-trends](./ai-future-trends.md) | 00_AI_Introduction | AGI 路径、2026-2040 |
| [ai-technology-landscape](./ai-technology-landscape.md) | 00_AI_Introduction | 技术栈、工具链 |
| [linear-algebra](./linear-algebra.md) | 01_Fundamentals | 矩阵、向量、特征分解 |
| [probability-statistics](./probability-statistics.md) | 01_Fundamentals | 贝叶斯、分布、假设检验 |
| [information-theory](./information-theory.md) | 01_Fundamentals | 熵、交叉熵、KL散度、互信息 |
| [data-structures-algorithms](./data-structures-algorithms.md) | 01_Fundamentals | 树、图、排序、搜索 |

### 机器学习（8 张）

| 概念 | 来源章节 | 关键词 |
|------|----------|--------|
| [supervised-learning](./supervised-learning.md) | 02_Machine_Learning | 回归、分类、损失函数 |
| [unsupervised-learning](./unsupervised-learning.md) | 02_Machine_Learning | 聚类、降维、异常检测 |
| [ensemble-learning](./ensemble-learning.md) | 02_Machine_Learning | Bagging、Boosting、XGBoost |
| [feature-engineering](./feature-engineering.md) | 02_Machine_Learning | 特征选择、编码、缩放 |
| [anomaly-detection](./anomaly-detection.md) | 02_Machine_Learning | 孤立森林、自编码器 |
| [recommendation-systems](./recommendation-systems.md) | 02_Machine_Learning | 协同过滤、内容推荐 |
| [time-series-analysis](./time-series-analysis.md) | 02_Machine_Learning | ARIMA、Prophet、LSTM |
| [automl](./automl.md) | 02_Machine_Learning | 自动特征、超参优化、NAS |
| [causal-inference](./causal-inference.md) | 02_Machine_Learning | 因果图、do-演算、工具变量 |
| [bayesian-methods](./bayesian-methods.md) | 02_Machine_Learning | 先验后验、MCMC、变分推断 |

### 深度学习（6 张）

| 概念 | 来源章节 | 关键词 |
|------|----------|--------|
| [neural-networks](./neural-networks.md) | 03_Deep_Learning | MLP、反向传播、激活函数 |
| [optimization-regularization](./optimization-regularization.md) | 03_Deep_Learning | SGD、Adam、Dropout、权重衰减 |
| [world-models-jepa](./world-models-jepa.md) | 03_Deep_Learning | JEPA、V-JEPA、LeCun AGI 路径 |
| [state-space-models](./state-space-models.md) | 03_Deep_Learning | Mamba、RWKV、线性注意力 |
| [graph-neural-networks](./graph-neural-networks.md) | 03_Deep_Learning | GCN、GAT、消息传递、分子预测 |
| [self-supervised-learning](./self-supervised-learning.md) | 03_Deep_Learning | SimCLR、MoCo、MAE、对比学习 |
| [distributed-systems](./distributed-systems.md) | 01_Fundamentals | CAP 定理、一致性、分布式训练 |

### NLP 与大模型（14 张）

| 概念 | 来源章节 | 关键词 |
|------|----------|--------|
| [transformer-architecture](./transformer-architecture.md) | 04_NLP_LLMs | 自注意力、位置编码、多头 |
| [llm-architectures](./llm-architectures.md) | 04_NLP_LLMs | GPT、LLaMA、MoE |
| [sequence-models](./sequence-models.md) | 04_NLP_LLMs | RNN、LSTM、Seq2Seq |
| [prompt-engineering](./prompt-engineering.md) | 04_NLP_LLMs | CoT、Few-shot、ReAct |
| [fine-tuning-techniques](./fine-tuning-techniques.md) | 04_NLP_LLMs | LoRA、QLoRA、PEFT |
| [rlhf](./rlhf.md) | 04_NLP_LLMs | RLHF、DPO、PPO |
| [reasoning-models](./reasoning-models.md) | 04_NLP_LLMs | o1、R1、CoT 推理 |
| [long-context-models](./long-context-models.md) | 04_NLP_LLMs | 128K+、长上下文、Ring Attention |
| [multimodal-models](./multimodal-models.md) | 04_NLP_LLMs | GPT-4V、Gemini、Flamingo |
| [speech-audio-ai](./speech-audio-ai.md) | 04_NLP_LLMs | Whisper、CosyVoice、AudioLM |
| [tokenization](./tokenization.md) | 04_NLP_LLMs | BPE、SentencePiece、Tokenizer |
| [mixture-of-experts](./mixture-of-experts.md) | 04_NLP_LLMs | MoE、稀疏激活、DeepSeek-V3 |
| [lora-peft](./lora-peft.md) | 04_NLP_LLMs | LoRA、QLoRA、低秩微调、参数高效 |
| [llm-data-engineering](./llm-data-engineering.md) | 04_NLP_LLMs | 预训练数据、SFT数据、合成数据、数据配比 |
| [edge-llm](./edge-llm.md) | 04_NLP_LLMs | 小模型、量化、llama.cpp、端侧部署 |

### 计算机视觉（6 张）

| 概念 | 来源章节 | 关键词 |
|------|----------|--------|
| [computer-vision](./computer-vision.md) | 05_Computer_Vision | CNN、图像分类 |
| [object-detection](./object-detection.md) | 05_Computer_Vision | YOLO、Faster R-CNN |
| [image-segmentation](./image-segmentation.md) | 05_Computer_Vision | U-Net、SAM、语义分割 |
| [generative-vision-models](./generative-vision-models.md) | 05_Computer_Vision | Diffusion、GAN、VAE |
| [multimodal-vision](./multimodal-vision.md) | 05_Computer_Vision | CLIP、BLIP、视觉语言 |
| [video-generation](./video-generation.md) | 05_Computer_Vision | Veo3、Kling、Sora |

### 强化学习与智能体（4 张）

| 概念 | 来源章节 | 关键词 |
|------|----------|--------|
| [reinforcement-learning](./reinforcement-learning.md) | 06_Reinforcement_Learning | MDP、Q-Learning、策略梯度 |
| [deep-reinforcement-learning](./deep-reinforcement-learning.md) | 06_Reinforcement_Learning | DQN、PPO、SAC |
| [ai-agents](./ai-agents.md) | 06_Reinforcement_Learning | ReAct、Tool Calling、MCP |
| [ai-hardware](./ai-hardware.md) | 01_Fundamentals | GPU、TPU、H100/B200 |

### 工程与部署（11 张）

| 概念 | 来源章节 | 关键词 |
|------|----------|--------|
| [model-training](./model-training.md) | 07_Model_Training | 损失函数、优化器、学习率 |
| [model-evaluation](./model-evaluation.md) | 08_Model_Evaluation | 指标、基准、A/B 测试 |
| [model-deployment](./model-deployment.md) | 09_Deployment_Inference | 部署策略、蓝绿、金丝雀 |
| [model-serving](./model-serving.md) | 09_Deployment_Inference | vLLM、SGLang、模型服务 |
| [model-inference](./model-inference.md) | 09_Deployment_Inference | 自回归生成、条件概率、前向传播、采样策略 |
| [model-compression](./model-compression.md) | 09_Deployment_Inference | 量化、蒸馏、剪枝 |
| [knowledge-distillation](./knowledge-distillation.md) | 09_Deployment_Inference | Teacher-Student、logit蒸馏、DeepSeek-R1蒸馏 |
| [mlops](./mlops.md) | 10_MLOps_Pipeline | CI/CD、实验追踪、特征存储 |
| [rag-systems](./rag-systems.md) | 11_RAG_Systems | 向量数据库、混合检索 |
| [embedding-models](./embedding-models.md) | 11_RAG_Systems | GTE、bge、MTEB、双塔、交叉编码器 |
| [vector-database](./vector-database.md) | 11_RAG_Systems | Milvus、Qdrant、Chroma |
| [ai-architecture](./ai-architecture.md) | 12_Architecture_Infrastructure | 四层模型、多租户、高可用 |
| [llm-infrastructure](./llm-infrastructure.md) | 12_Architecture_Infrastructure | AI Gateway、推理集群 |
| [multi-head-latent-attention](./multi-head-latent-attention.md) | 12_Architecture_Infrastructure | MLA、FlashMLA、KV Cache压缩、DeepSeek |
| [kv-cache](./kv-cache.md) | 12_Architecture_Infrastructure | KV Cache、显存墙、五大优化技术族 |
| [paged-attention](./paged-attention.md) | 12_Architecture_Infrastructure | PagedAttention、虚拟内存、vLLM |
| [radix-attention](./radix-attention.md) | 12_Architecture_Infrastructure | RadixAttention、基数树、SGLang |
| [speculative-decoding](./speculative-decoding.md) | 12_Architecture_Infrastructure | 投机解码、Draft-Verify、MTP |
| [continuous-batching](./continuous-batching.md) | 12_Architecture_Infrastructure | Continuous Batching、动态调度、Orca |
| [prefix-caching](./prefix-caching.md) | 12_Architecture_Infrastructure | 前缀缓存、System Prompt 复用 |
| [attention-variants](./attention-variants.md) | 12_Architecture_Infrastructure | GQA、MQA、SWA、注意力变体 |
| [training-inference-unification](./training-inference-unification.md) | 12_Architecture_Infrastructure | 训推一体、LeMix、共置调度 |
| [heterogeneous-gpu](./heterogeneous-gpu.md) | 12_Architecture_Infrastructure | 异构GPU、国产芯片、统一纳管 |
| [flash-attention-kernels](./flash-attention-kernels.md) | 12_Architecture_Infrastructure | FlashMLA、FlashInfer、FlashAttention |
| [inference-performance](./inference-performance.md) | 09_Deployment_Inference | TTFT、TPOT、吞吐、推理优化 |
| [expert-parallelism](./expert-parallelism.md) | 09_Deployment_Inference | MoE、All-to-All、专家并行 |
| [request-scheduling](./request-scheduling.md) | 09_Deployment_Inference | Continuous Batching、抢占、SLO-aware |
| [inference-autoscaling](./inference-autoscaling.md) | 09_Deployment_Inference | HPA、负载均衡、扩缩容 |
| [rdma-roce](./rdma-roce.md) | 12_Architecture_Infrastructure | RDMA、RoCE、GPU 高速网络 |
| [gpu-interconnect](./gpu-interconnect.md) | 12_Architecture_Infrastructure | NVLink、NVSwitch、PCIe、HCCS |
| [prefill-decode](./prefill-decode.md) | 12_Architecture_Infrastructure | Prefill/Decode阶段、TTFT、TPS |
| [mixed-precision](./mixed-precision.md) | 07_Model_Training | BF16、FP8、AMP、混合精度 |
| [rbac](./rbac.md) | 12_Architecture_Infrastructure | RBAC、三权分立、访问控制 |
| [model-gateway](./model-gateway.md) | 12_Architecture_Infrastructure | AI Gateway、Synapse、负载均衡 |
| [rope](./rope.md) | 04_NLP_LLMs | RoPE、旋转位置编码、长度外推 |
| [ai-for-science](./ai-for-science.md) | 20_AI_Applications_Industry | AlphaFold、药物发现、气象预测、材料设计 |
| [distributed-parallelism](./distributed-parallelism.md) | 07_Model_Training | TP/PP/DP/EP、Megatron、DeepSpeed |
| [gpu-virtualization](./gpu-virtualization.md) | 12_Architecture_Infrastructure | MIG、GPU共享、算力/显存隔离 |
| [federated-learning](./federated-learning.md) | 19_Ethics_Safety | FedAvg、差分隐私、安全聚合、联邦LLM |

---

## 元数据规范

每张概念卡片遵循以下 frontmatter 规范：

```yaml
---
title: 概念名称
category: concepts
tags: [tag1, tag2]
relationships:
  - target: "concepts/related-concept"
    type: related_to | prerequisite | builds_on
sources:
  - XX_Chapter/Specific_Document.md
summary: 一句话概括
provenance:
  extracted: 0.XX    # 从原文直接提取的比例
  inferred: 0.XX     # AI 推断的比例
  ambiguous: 0.XX    # 不确定的比例
base_confidence: 0.XX
lifecycle: draft | review | stable
tier: core | supporting
---
```

---

## 统计

- **总数**: 90 张概念卡片
- **平均大小**: ~5.8 KB
- **覆盖章节**: 00-19 全部 20 个主章节
- **关系类型**: related_to、prerequisite、builds_on

## 相关页面

- [[concepts/speech-audio-ai|语音与音频 AI (Speech & Audio AI)]]
- [[concepts/llm-data-engineering|LLM 数据工程 (LLM Data Engineering)]]
- [[concepts/edge-llm|端侧 LLM (Edge LLM)]]
- [[concepts/README|概念卡片索引 (Concept Cards Index)]]
- [[concepts/causal-inference|因果推断 (Causal Inference)]]
- [[concepts/federated-learning|联邦学习 (Federated Learning)]]
