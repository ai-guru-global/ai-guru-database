---
title: 概念卡片索引 (Concept Cards Index)
category: -concepts
tags: [concepts, knowledge-graph, index]
summary: 584 张 AI 概念卡片，覆盖 AI 全栈核心概念，按 12 个子域组织，与主章节通过 sources 字段关联。
created: 2026-06-03
updated: 2026-07-10
tier: core
sources: []

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
| [mamba](./mamba.md) | 03_Deep_Learning | 选择性状态空间、长序列、线性复杂度 |
| [retnet](./retnet.md) | 03_Deep_Learning | 保留机制、无 KV Cache、Transformer 替代 |
| [graph-neural-networks](./graph-neural-networks.md) | 03_Deep_Learning | GCN、GAT、消息传递、分子预测 |
| [self-supervised-learning](./self-supervised-learning.md) | 03_Deep_Learning | SimCLR、MoCo、MAE、对比学习 |
| [distributed-systems](./distributed-systems.md) | 01_Fundamentals | CAP 定理、一致性、分布式训练 |

### NLP 与大模型（22 张）

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
| [lora-qlora-sft-rlhf-dpo](./lora-qlora-sft-rlhf-dpo.md) | 04_NLP_LLMs | LoRA、QLoRA、SFT、RLHF、DPO 大白话串讲 |
| [llm-data-engineering](./llm-data-engineering.md) | 04_NLP_LLMs | 预训练数据、SFT数据、合成数据、数据配比 |
| [edge-llm](./edge-llm.md) | 04_NLP_LLMs | 小模型、量化、llama.cpp、端侧部署 |
| [kv-cache-compression](./kv-cache-compression.md) | 05_NLP_LLMs | KV Cache 压缩、量化、GQA、MLA |
| [agentic-rag](./agentic-rag.md) | 14_RAG_Systems | Agentic RAG、Self-RAG、CRAG |
| [text2sql](./text2sql.md) | 14_RAG_Systems / 16_AI_Coding | 自然语言转 SQL、数据库查询 |
| [code-generation-workflow](./code-generation-workflow.md) | 17_AI_Coding | AI 辅助代码工作流、CI/CD |
| [claude-series](./claude-series.md) | 04_NLP_LLMs | Anthropic Claude 3/3.5/3.7/Opus 4.5/4.6 + MCP 协议 + Claude Code |
| [mistral-series](./mistral-series.md) | 04_NLP_LLMs | Mistral 7B / Mixtral 8x7B / Mistral Large 3 675B MoE |
| [phi-series](./phi-series.md) | 04_NLP_LLMs | Microsoft Phi-1 → Phi-3 → Phi-4 / Phi-4 Multimodal |
| [gemma-series](./gemma-series.md) | 04_NLP_LLMs | Google Gemma 1/2/3 + PaliGemma + CodeGemma + ShieldGemma |
| [yi-series](./yi-series.md) | 04_NLP_LLMs | 01.AI Yi-6B/9B/34B/VL/Lightning |
| [chinese-llm-others](./chinese-llm-others.md) | 04_NLP_LLMs | 百度文心 / 华为盘古 / 昆仑天工 / 智源悟道 / CodeGeeX |
| [prm-process-reward-model](./prm-process-reward-model.md) | 04_NLP_LLMs | PRM 过程奖励模型 / o1 核心 / PRM800K |
| [mamba-2-ssm](./mamba-2-ssm.md) | 04_NLP_LLMs | Mamba-2 / SSD 状态空间对偶 / 训练 2-8× 加速 |

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
| [tool-calling](./tool-calling.md) | 15_Agent_Production | 函数调用、API、MCP |
| [tool-calling-safety](./tool-calling-safety.md) | 15_Agent_Production / 17_Ethics_Safety | 工具调用安全、护栏、审计 |
| [agent-evaluation-benchmarks](./agent-evaluation-benchmarks.md) | 08_Model_Evaluation / 13_Agent_Production | Agent 评估、SWE-bench、GAIA |
| [ai-hardware](./ai-hardware.md) | 01_Fundamentals | GPU、TPU、H100/B200 |

### 工程与部署（12 张）

| 概念 | 来源章节 | 关键词 |
|------|----------|--------|
| [model-training](./model-training.md) | 07_Model_Training | 损失函数、优化器、学习率 |
| [model-evaluation](./model-evaluation.md) | 08_Model_Evaluation | 指标、基准、A/B 测试 |
| [model-deployment](./model-deployment.md) | 09_Deployment_Inference | 部署策略、蓝绿、金丝雀 |
| [model-serving](./model-serving.md) | 09_Deployment_Inference | vLLM、SGLang、模型服务 |
| [model-inference](./model-inference.md) | 09_Deployment_Inference | 自回归生成、条件概率、前向传播、采样策略 |
| [model-compression](./model-compression.md) | 09_Deployment_Inference | 量化、蒸馏、剪枝 |
| [model-precision](./model-precision.md) | 09_Deployment_Inference | 数值精度、模型准确性、FP32/FP16/BF16/FP8/FP4/INT8/INT4 |
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
| [inference-performance-gaps](./inference-performance-gaps.md) | 09_Deployment_Inference | 推理性能缺口、边缘、异构、能耗 |
| [expert-parallelism](./expert-parallelism.md) | 09_Deployment_Inference | MoE、All-to-All、专家并行 |
| [request-scheduling](./request-scheduling.md) | 09_Deployment_Inference | Continuous Batching、抢占、SLO-aware |
| [inference-autoscaling](./inference-autoscaling.md) | 09_Deployment_Inference | HPA、负载均衡、扩缩容 |
| [grouped-query-attention](./grouped-query-attention.md) | 12_Architecture_Infrastructure | GQA、MQA、KV Cache 压缩 |
| [flops](./flops.md) | 01_Fundamentals | GPU 算力、FLOPS |
| [ttft](./ttft.md) | 09_Deployment_Inference | 首字等待时间、TTFT |
| [quantization](./quantization.md) | 09_Deployment_Inference | FP8/INT8/INT4、量化 |
| [prefill-decode-disaggregation](./prefill-decode-disaggregation.md) | 09_Deployment_Inference | PD 分离、Disaggregated Serving |
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
| [data-cleaning-pipeline](./data-cleaning-pipeline.md) | 07_Model_Training | 数据清洗、去重、质量过滤、配比 |
| [dora](./dora.md) | 05_NLP_LLMs / 07_Model_Training | 权重分解 LoRA、方向微调 |
| [rs-lora](./rs-lora.md) | 05_NLP_LLMs / 07_Model_Training | Rank-Stabilized LoRA、小 rank 稳定训练 |
| [sglang](./sglang.md) | 10_Deployment_Inference | RadixAttention、结构化生成 |
| [dynamic-batch-scheduling](./dynamic-batch-scheduling.md) | 10_Deployment_Inference | 动态批调度、Continuous Batching |
| [gguf](./gguf.md) | 10_Deployment_Inference | llama.cpp、单文件量化格式 |
| [smoothquant](./smoothquant.md) | 10_Deployment_Inference | INT8 量化、激活平滑 |
| [tensorrt-llm](./tensorrt-llm.md) | 10_Deployment_Inference | NVIDIA 编译优化、FP8、端到端 |
| [code-generation](./code-generation.md) | 16_AI_Coding | AI 代码生成、补全、测试生成 |
| [llm-safety](./llm-safety.md) | 17_Ethics_Safety | LLM 安全、护栏、对齐、红队 |
| [bbh](./bbh.md) | 08_Model_Evaluation | Big-Bench Hard、复杂推理基准 |
| [llm-arena](./llm-arena.md) | 08_Model_Evaluation | Chatbot Arena、人类偏好、Elo 排名 |
| [red-teaming](./red-teaming.md) | 17_Ethics_Safety / 08_Model_Evaluation | 红队测试、越狱、安全评估 |
| [ci-integrated-evaluation](./ci-integrated-evaluation.md) | 11_MLOps_Pipeline / 08_Model_Evaluation | CI 集成评估、回归测试 |
| [ab-testing-framework](./ab-testing-framework.md) | 11_MLOps_Pipeline / 08_Model_Evaluation | A/B 测试、在线评估、统计检验 |
| [online-evaluation](./online-evaluation.md) | 08_Model_Evaluation | 在线评估、影子部署、金丝雀 |
| [llm-production-pipeline](./llm-production-pipeline.md) | 11_MLOps_Pipeline | LLM 生产流水线、MLOps |
| [cuda-platform](./cuda-platform.md) | 12_Architecture_Infrastructure | CUDA、Tensor Core、NVCC、cuDNN |
| [checkpoint](./checkpoint.md) | 07_Model_Training | 检查点、分布式容错、Sharded/Full |
| [single-tenant-architecture](./single-tenant-architecture.md) | 12_Architecture_Infrastructure | 单租户、物理隔离、AI Stack |
| [sso-saml](./sso-saml.md) | 12_Architecture_Infrastructure | SSO、SAML2、AzureAD、企业认证 |
| [apsara-stack](./apsara-stack.md) | 12_Architecture_Infrastructure | 飞天企业版、Apsara Stack、全栈私有云 |
| [model-registry](./model-registry.md) | 12_Architecture_Infrastructure | 模型仓库、版本管理、一键部署 |
| [modelscope](./modelscope.md) | 04_NLP_LLMs | ModelScope 魔搭、SWIFT、中文模型社区 |
| [a-speed](./a-speed.md) | 12_Architecture_Infrastructure | A-Speed 加速推理套件、AI Stack 核心引擎 |
| [bailian-exclusive](./bailian-exclusive.md) | 12_Architecture_Infrastructure | 百炼专属版、RAG、智能体平台 |
| [qwen3-pro](./qwen3-pro.md) | 12_Architecture_Infrastructure | Qwen3-Pro 专有优化、1.9× 性能 |
| [deepseek-models](./deepseek-models.md) | 04_NLP_LLMs | DeepSeek R1/V3/V4、MLA/MoE/MTP |
| [nvidia-smi](./nvidia-smi.md) | 12_Architecture_Infrastructure | GPU 监控、nvidia-smi/ppu-smi/rocm-smi |
| [torchrun](./torchrun.md) | 07_Model_Training | 分布式训练启动器、弹性训练、DDP |
| [ollama](./ollama.md) | 09_Deployment_Inference | 本地 LLM 运行、GGUF、OpenAI 兼容 API |
| [nerdctl](./nerdctl.md) | 12_Architecture_Infrastructure | 容器管理 CLI、containerd、Docker 替代 |
| [synapse-gateway](./synapse-gateway.md) | 12_Architecture_Infrastructure | Synapse 模型网关、负载均衡、API-Key |
| [apg-gpu](./apg-gpu.md) | 12_Architecture_Infrastructure | APG 自研加速卡、CUDA 兼容、700GB/s |
| [ascend-npu](./ascend-npu.md) | 12_Architecture_Infrastructure | 华为昇腾 NPU、CANN、910B/910C |
| [deepgemm](./deepgemm.md) | 12_Architecture_Infrastructure | DeepGEMM FP8 算子、Hopper 优化 |
| [huggingface-cli](./huggingface-cli.md) | 04_NLP_LLMs | HF Hub CLI、模型下载/上传/管理 |
| [git-lfs](./git-lfs.md) | 09_Deployment_Inference | Git LFS 大文件存储、模型权重版本控制 |
| [accelerate](./accelerate.md) | 07_Model_Training | HF Accelerate、5行代码分布式、FSDP |
| [kubectl](./kubectl.md) | 12_Architecture_Infrastructure | Kubernetes CLI、K8s 运维、Pod 管理 |
| [moonshot-kimi](./moonshot-kimi.md) | 12_Architecture_Infrastructure | Moonshot AI / Kimi 长上下文模型 |
| [zhipu-glm](./zhipu-glm.md) | 12_Architecture_Infrastructure | 智谱 AI / GLM 模型（ChatGLM 起家） |
| [reranker](./reranker.md) | 12_Architecture_Infrastructure | 重排序模型、Cross-Encoder、bge-reranker |
| [qwq](./qwq.md) | 12_Architecture_Infrastructure | QwQ-32B 推理模型、CoT 思维链 |
| [hygon](./hygon.md) | 12_Architecture_Infrastructure | 海光国产 x86 CPU、AMD Zen 授权 |
| [dualpipe](./dualpipe.md) | 12_Architecture_Infrastructure | DualPipe 双向流水线、DeepSeek 开源 |
| [fp8](./fp8.md) | 09_Deployment_Inference | FP8 浮点精度、E4M3/E5M2、Hopper 原生 |
| [safetensors](./safetensors.md) | 09_Deployment_Inference | 安全模型格式、替代 pickle、零拷贝 |
| [flashinfer](./flashinfer.md) | 09_Deployment_Inference | FlashInfer 注意力算子库、MLSys 2025 Best Paper |
| [flashmla](./flashmla.md) | 09_Deployment_Inference | FlashMLA 注意力加速、DeepSeek MLA 内核 |
| [crictl](./crictl.md) | 12_Architecture_Infrastructure | CRI 容器调试 CLI、底层容器排查 |
| [ppu-smi](./ppu-smi.md) | 12_Architecture_Infrastructure | APG GPU 监控工具、对标 nvidia-smi |
| [stackops](./stackops.md) | 12_Architecture_Infrastructure | AI Stack 专属运维工具、一键部署/诊断 |
| [swift](./swift.md) | 07_Model_Training | ModelScope SWIFT 微调框架、100+ 模型 |
| [docling](./docling.md) | 11_RAG_Systems | IBM 文档解析工具、PDF/DOCX 结构化提取 |
| [mtp](./mtp.md) | 09_Deployment_Inference | Multi-Token Prediction、DeepSeek-V3 加速 |
| [gradio](./gradio.md) | 13_Agent_Production | Gradio ML 应用框架、模型 Web UI |
| [3fs](./3fs.md) | 12_Architecture_Infrastructure | DeepSeek 3FS 分布式文件系统 |
| [lemix](./lemix.md) | 12_Architecture_Infrastructure | LeMix 训推统一调度 |
| [rocm-smi](./rocm-smi.md) | 12_Architecture_Infrastructure | AMD GPU 监控工具 (ROCm) |
| [sentencepiece](./sentencepiece.md) | 04_NLP_LLMs | SentencePiece 分词库 (BPE/Unigram) |
| [eagle](./eagle.md) | 09_Deployment_Inference | EAGLE 特征级推测解码 |
| [langflow](./langflow.md) | 11_RAG_Systems | LangFlow 可视化 LLM 编排 |
| [reward-model](./reward-model.md) | 07_Model_Training | 奖励模型 (RLHF/GRPO 偏好评估) |
| [dify](./dify.md) | 11_RAG_Systems | Dify 开源 LLM 应用平台 |
| [ragflow](./ragflow.md) | 11_RAG_Systems | RAGFlow 深度文档理解 RAG 引擎 |
| [llama-index](./llama-index.md) | 11_RAG_Systems | LlamaIndex 数据框架 (索引/查询) |
| [medusa](./medusa.md) | 09_Deployment_Inference | Medusa 多头推测解码 |
| [simpo](./simpo.md) | 07_Model_Training | SimPO 简化偏好优化 (无参考模型) |
| [qlora](./qlora.md) | 07_Model_Training | QLoRA 4-bit 量化 LoRA 微调 |
| [ctr](./ctr.md) | 12_Architecture_Infrastructure | ctr containerd 原生 CLI |
| [streamlit](./streamlit.md) | 13_Agent_Production | Streamlit 数据应用框架 |
| [haystack](./haystack.md) | 11_RAG_Systems | Haystack (deepset) Pipeline RAG 框架 |
| [flowise](./flowise.md) | 11_RAG_Systems | Flowise Node.js 可视化 LLM 编排 |
| [opik](./opik.md) | 16_AI_Ops | Opik LLM 可观测性平台 (Comet) |
| [chainlit](./chainlit.md) | 13_Agent_Production | Chainlit 生产级 AI 聊天界面 |
| [pissa](./pissa.md) | 07_Model_Training | PiSSA 奇异值适配 (SVD 初始化) |
| [bitsandbytes](./bitsandbytes.md) | 07_Model_Training | bitsandbytes 量化优化库 (NF4/8bit) |
| [peft](./peft.md) | 07_Model_Training | PEFT 参数高效微调统一框架 |
| [onnx](./onnx.md) | 09_Deployment_Inference | ONNX 开放神经网络交换格式 |
| [openvino](./openvino.md) | 09_Deployment_Inference | OpenVINO Intel 推理优化工具包 |
| [triton-server](./triton-server.md) | 09_Deployment_Inference | NVIDIA Triton 推理服务器 |
| [exllama](./exllama.md) | 09_Deployment_Inference | ExLlamaV2 量化 LLM 推理引擎 |
| [colossalai](./colossalai.md) | 07_Model_Training | ColossalAI 分布式训练框架 |
| [rslora](./rslora.md) | 07_Model_Training | rsLoRA 秩稳定 LoRA |
| [langsmith](./langsmith.md) | 16_AI_Ops | LangSmith LLM 可观测性平台 |
| [ragas](./ragas.md) | 11_RAG_Systems | Ragas RAG 评估框架 |
| [deepeval](./deepeval.md) | 08_Model_Evaluation | DeepEval LLM 评估框架 |
| [mlflow](./mlflow.md) | 10_MLOps_Pipeline | MLflow 实验追踪与模型管理 |
| [wandb](./wandb.md) | 10_MLOps_Pipeline | Weights & Biases 实验追踪 |
| [litellm](./litellm.md) | 架构基建/AI_Gateway | LiteLLM 统一 LLM API 代理 |
| [outlines](./outlines.md) | 09_Deployment_Inference | Outlines 结构化 LLM 生成 |
| [helicone](./helicone.md) | 16_AI_Ops | Helicone LLM API 监控 |
| [trulens](./trulens.md) | 08_Model_Evaluation | TruLens LLM 评估反馈 |
| [promptfoo](./promptfoo.md) | 08_Model_Evaluation | Promptfoo Prompt 测试框架 |
| [ray-tune](./ray-tune.md) | 10_MLOps_Pipeline | Ray Tune 分布式超参数调优 |
| [guidance](./guidance.md) | 04_NLP_LLMs | Microsoft Guidance 结构化生成库 |
| [lm-format-enforcer](./lm-format-enforcer.md) | 09_Deployment_Inference | LM Format Enforcer LLM 输出格式约束 |
| [ne-mo](./ne-mo.md) | 07_Model_Training | NVIDIA NeMo 训练与推理框架 |
| [lisa](./lisa.md) | 07_Model_Training | LISA 层级采样高效微调 |
| [miniconda](./miniconda.md) | 01_Fundamentals | Miniconda 轻量级 Python 环境管理 |
| [flash-attn](./flash-attn.md) | 03_Deep_Learning | Flash Attention 高效注意力内核 |
| [guardrails-ai](./guardrails-ai.md) | 19_Ethics_Safety | Guardrails AI 安全防护框架 |
| [presidio](./presidio.md) | 19_Ethics_Safety | Microsoft Presidio PII 检测与脱敏 |
| [sglang-frontend](./sglang-frontend.md) | 09_Deployment_Inference | SGLang API 服务层 |
| [vllm-tp-attention](./vllm-tp-attention.md) | 09_Deployment_Inference | vLLM 张量并行注意力机制 |
| [detect-secrets](./detect-secrets.md) | 19_Ethics_Safety | Yelp detect-secrets 密钥泄露检测 |
| [llm-guard](./llm-guard.md) | 19_Ethics_Safety | LLM Guard 安全防护中间件 |
| [nemo-guardrails](./nemo-guardrails.md) | 19_Ethics_Safety | NVIDIA NeMo Guardrails 对话控制 |
| [torch-tensorrt](./torch-tensorrt.md) | 09_Deployment_Inference | Torch-TensorRT PyTorch 编译器 |
| [lm-eval-harness](./lm-eval-harness.md) | 08_Model_Evaluation | LM Evaluation Harness 标准化评估 |
| [giskard](./giskard.md) | 08_Model_Evaluation | Giskard AI 模型测试与评估平台 |
| [huggingface-hub](./huggingface-hub.md) | 07_Model_Training | Hugging Face Hub AI 模型托管平台 |
| [gptcache](./gptcache.md) | 09_Deployment_Inference | GPTCache LLM 语义缓存引擎 |
| [langserve](./langserve.md) | 12_Architecture_Infrastructure | LangServe LangChain 一键部署 |
| [zep](./zep.md) | 13_Agent_Production | Zep LLM 长期记忆平台 |
| [langfuse](./langfuse.md) | 16_AI_Ops | Langfuse 开源 LLM 可观测性 |
| [transformers-js](./transformers-js.md) | 09_Deployment_Inference | Transformers.js 浏览器端 AI 推理 |
| [llamaindex-cloud](./llamaindex-cloud.md) | 11_RAG_Systems | LlamaIndex Cloud 云端 RAG 平台 |
| [phoenix-langsmith](./phoenix-langsmith.md) | 16_AI_Ops | Arize Phoenix LLM 可观测性 |
| [mem0](./mem0.md) | 13_Agent_Production | Mem0 AI 记忆层基础设施 |
| [letta](./letta.md) | 13_Agent_Production | Letta (MemGPT) 有状态 Agent 框架 |
| [agentops](./agentops.md) | 16_AI_Ops | AgentOps AI Agent 可观测性 |
| [humanloop](./humanloop.md) | 04_NLP_LLMs | Humanloop Prompt 工程与评估 |
| [promptlayer](./promptlayer.md) | 04_NLP_LLMs | Promptlayer Prompt 版本管理 |
| [arthur-ai](./arthur-ai.md) | 19_Ethics_Safety | Arthur AI LLM 安全监控平台 |
| [whylogs](./whylogs.md) | 16_AI_Ops | whylogs 数据质量与 ML 可观测性 |
| [feast](./feast.md) | 10_MLOps_Pipeline | Feast 开源特征存储平台 |
| [label-studio](./label-studio.md) | 01_Fundamentals | Label Studio 开源数据标注平台 |
| [scale-ai](./scale-ai.md) | 01_Fundamentals | Scale AI 数据标注与 RLHF 平台 |
| [snorkel-ai](./snorkel-ai.md) | 01_Fundamentals | Snorkel AI 弱监督数据编程平台 |
| [dataherald](./dataherald.md) | 11_RAG_Systems | DataHerald 自然语言转 SQL 引擎 |
| [dspy](./dspy.md) | 04_NLP_LLMs | DSPy Stanford LLM 编程框架 |
| [autogen-studio](./autogen-studio.md) | 13_Agent_Production | AutoGen Studio 多 Agent 可视化 IDE |
| [crewai-tools](./crewai-tools.md) | 13_Agent_Production | CrewAI Tools Agent 工具集 |
| [smolagents](./smolagents.md) | 13_Agent_Production | SmolAgents HuggingFace 轻量 Agent |

---


## 2026-07-23 新增与错位修正

> 本次由 taste_top 质量基线补齐 14 张 LLM 核心概念卡(13 个新增 + 1 个升级),并修正 4 张错位文件(应放 GPU/K8s 而非 LLM)。

### 新增 13 张概念卡(LLM 子域)

| 概念 | 类别 | 关键来源 |
|------|------|----------|
| [agent-benchmarks](./agent-benchmarks.md) | Agent 评估综合 | SWE-bench / GAIA / WebArena / OSWorld / ARC-AGI / HLE |
| [chinchilla-scaling-laws](./chinchilla-scaling-laws.md) | Scaling 理论 | DeepMind arXiv:2203.15556 NeurIPS 2022 Outstanding |
| [constitutional-ai](./constitutional-ai.md) | 对齐 / RLAIF | Anthropic arXiv:2212.08073, Claude 3-Opus 4.5 训练基线 |
| [diffusion-llm](./diffusion-llm.md) | 新架构 / 范式 | LLaDA arXiv:2502.09992, Mercury 商用 1000 t/s |
| [doubao-series](./doubao-series.md) | 国产主流 | ByteDance Doubao 1.5 / Seed1.5-VL |
| [emergent-abilities](./emergent-abilities.md) | Scaling 现象 | Wei arXiv:2206.07682, Schaeffer Mirage NeurIPS 2023 Outstanding |
| [glm-4-5-series](./glm-4-5-series.md) | 国产主流 | 智谱 GLM-4.5 (HuggingFace) |
| [hunyuan-series](./hunyuan-series.md) | 国产主流 | 腾讯 Hunyuan-Large arXiv:2411.02265 |
| [internlm-3-series](./internlm-3-series.md) | 国产主流 | 上海 AI Lab InternLM3 / InternVL 3.5 |
| [nsa-sparse-attention](./nsa-sparse-attention.md) | 架构 / 推理加速 | DeepSeek arXiv:2502.11089, 64K 序列 11.6× 加速 |
| [rlvr](./rlvr.md) | 训练范式 / GRPO | DeepSeek-R1 arXiv:2501.12948 Nature 2025 |
| [self-rewarding](./self-rewarding.md) | 自改进 | Meta arXiv:2401.10020 |
| [stepfun-series](./stepfun-series.md) | 国产主流 | StepFun Step-3 / Step-Audio 2 / Step-Video-T2V |

### 升级 1 张(test-time-compute)

| 概念 | 升级内容 |
|------|----------|
| [test-time-compute](./test-time-compute.md) | 由"Test Time Compute"占位升级为完整卡(Snell arXiv:2408.03314、o1/R1 工业落地) |

### 错位修正 4 张(移出 LLM,迁至正确子域)

| 错位文件 | 原位置 | 正确位置 | 类型 |
|----------|--------|----------|------|
| `nvidia-smi.md` | 概念/LLM/ | 概念/GPU/ | GPU 监控工具 |
| `ppu-smi.md` | 概念/LLM/ | 概念/GPU/ | APG GPU 监控 |
| `rocm-smi.md` | 概念/LLM/ | 概念/GPU/ | AMD GPU 监控 |
| `securitycontext.md` | 概念/LLM/ | 概念/K8s/ | K8s 安全 |

---

## 2026-07-23 查漏补缺(8 张新卡)

> 在 14 张基础卡完成后,基于 108 个 LLM 文件做覆盖度扫描,识别 8 个空缺主题并以 taste_top 质量补齐:覆盖国际旗舰(Claude/Mistral/Phi/Gemma)、国产次主流(文心/盘古/天工/悟道/CodeGeeX)、关键算法(PRM 过程奖励、Mamba-2 状态空间对偶)、中文长上下文主力(Yi)。

### 新增 8 张概念卡(LLM 子域)

| 概念 | 类别 | 关键来源 |
|------|------|----------|
| [claude-series](./claude-series.md) | 国际旗舰 | Anthropic Claude 3/3.5/3.7/Opus 4.5/4.6 + MCP 协议,2026 估值 3800 亿 |
| [mistral-series](./mistral-series.md) | 国际旗舰 | Mistral 7B / Mixtral 8x7B (arXiv:2401.04088) / Mistral Large 3 675B MoE |
| [phi-series](./phi-series.md) | 国际旗舰 | Microsoft Phi-1→Phi-4,arXiv:2404.14219 / arXiv:2412.08905 |
| [gemma-series](./gemma-series.md) | 国际旗舰 | Google Gemma 1/2/3 1B-27B 多模态,128K 上下文,5:1 局部-全局注意力 |
| [yi-series](./yi-series.md) | 国产主流 | 01.AI Yi-6B/9B/34B/VL/Lightning,200K 长上下文 |
| [chinese-llm-others](./chinese-llm-others.md) | 国产次主流合并卡 | 百度文心 4.5/X1 / 华为盘古 5.0 / 昆仑天工 Skywork 4 / 智源悟道 3.0 / CodeGeeX / BGE |
| [prm-process-reward-model](./prm-process-reward-model.md) | 训练范式 | Lightman arXiv:2305.20050 Let's Verify Step by Step,PRM800K,o1 核心 |
| [mamba-2-ssm](./mamba-2-ssm.md) | 架构创新 | Dao & Gu arXiv:2405.21060 SSD,ICML 2024,训练 2-8× 加速 |

---

## 元数据规范

每张概念卡片遵循以下 frontmatter 规范：

```yaml
---
title: 概念名称
category: -concepts
tags: [tag1, tag2]
relationships:
  - target: "概念/related-concept"
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

- **总数**: 584 张概念卡片(2026-07-23 更新:基础 14 张 + 查漏 8 张 = 新增 22 张,移动 4 张至正确子域)（12 个子域）
- **平均大小**: ~6.2 KB
- **覆盖章节**: 00-19 全部 20 个主章节
- **关系类型**: related_to、prerequisite、builds_on
- **质量标准**: 每张卡片 200+ 行，含 YAML frontmatter、2026 生态现状、生产最佳实践、wikilink 交叉引用

### 子域统计

| 子域 | 文件数 | 说明 |
|------|------|------|
| **General** | 147 | 基础与通识、平台工具、通用概念 |
| **LLM** | 116 | 大语言模型架构、训练、对齐 |
| **K8s** | 70 | Kubernetes 与云原生 AI 基础设施 |
| **Training** | 49 | 模型训练、分布式训练、优化 |
| **Inference** | 35 | 推理引擎、服务化、优化 |
| **RAG** | 33 | 检索增强生成、向量数据库 |
| **Agent** | 30 | AI 智能体、工具调用、多智能体 |
| **GPU** | 30 | GPU 硬件、CUDA、集群管理 |
| **MLOps** | 23 | ML 运维、CI/CD、监控 |
| **Math** | 18 | 数学基础、优化理论 |
| **Vision** | 18 | 计算机视觉、多模态 |
| **Safety** | 15 | AI 安全、对齐、伦理 |

## 相关页面

- [[概念/concept-dependency-graph|概念间依赖关系图谱]] — 240+ 概念的四层拓扑结构与学习路径
- [[概念/speech-audio-ai|语音与音频 AI (Speech & Audio AI)]]
- [[概念/llm-data-engineering|LLM 数据工程 (LLM Data Engineering)]]
- [[概念/edge-llm|端侧 LLM (Edge LLM)]]
- [[概念/README|概念卡片索引 (Concept Cards Index)]]
- [[概念/causal-inference|因果推断 (Causal Inference)]]
- [[概念/federated-learning|联邦学习 (Federated Learning)]]
