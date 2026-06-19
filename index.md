---
title: Wiki Index
---

# Wiki Index

*This index is automatically maintained. Last updated: 2026-06-19*

## Concepts

- [[concepts/matryoshka-representation-learning]] — Matryoshka 表示学习：可截断的多尺度嵌入 ( #embeddings #rag #vector-database #matryoshka)
- [[concepts/cdi]] — CDI 容器设备接口：GPU/异构加速器统一接入容器的标准 ( #cdi #kubernetes #gpu #containerd)
- [[concepts/dra]] — DRA 动态资源分配：K8s 设备分配的现代机制，与 CDI 配对 ( #dra #kubernetes #gpu #scheduling)
- [[concepts/hami]] — HAMi：CNCF Sandbox 异构 GPU 虚拟化中间件 ( #hami #gpu-virtualization #cncf #kubernetes #heterogeneous)
- [[concepts/gpu-operator]] — NVIDIA GPU Operator：K8s 上 GPU 全栈运维的事实标准 ( #gpu-operator #kubernetes #nvidia)
- [[concepts/kserve]] — KServe：CNCF Kubernetes 标准化模型服务平台 ( #kserve #cncf #kubernetes #model-serving)
- [[concepts/tgi]] — TGI：HuggingFace 生产级 LLM 推理引擎 ( #tgi #huggingface #inference #llm)
- [[concepts/ray]] — Ray / KubeRay：Python 分布式 AI 计算框架 ( #ray #kuberay #distributed #training)
- [[concepts/deepspeed]] — DeepSpeed：微软大模型训练与推理优化库 ( #deepspeed #distributed-training #microsoft)
- [[concepts/prometheus]] — Prometheus：云原生监控与告警系统 ( #prometheus #monitoring #observability #cncf)
- [[concepts/grafana]] — Grafana：可观测可视化与监控平台 ( #grafana #dashboard #observability)
- [[concepts/lmdeploy]] — LMDeploy：国产 LLM 推理部署工具（TurboMind/PyTorch 双后端） ( #lmdeploy #inference #chinese-llm #deployment)
- [[concepts/tensorrt-llm]] — TensorRT-LLM：NVIDIA LLM 推理优化引擎 ( #tensorrt-llm #nvidia #inference #optimization)
- [[concepts/sglang]] — SGLang：高性能 LLM 推理框架（RadixAttention） ( #sglang #inference #radix-attention)
- [[concepts/milvus]] — Milvus：分布式向量数据库 ( #milvus #vector-database #rag #distributed)
- [[concepts/qdrant]] — Qdrant：Rust 高性能向量数据库 ( #qdrant #vector-database #rag #rust)
- [[concepts/weaviate]] — Weaviate：AI 原生向量数据库 ( #weaviate #vector-database #rag #ai-native)
- [[concepts/langchain]] — LangChain：LLM 应用开发框架 ( #langchain #agent #rag #framework)
- [[concepts/llamaindex]] — LlamaIndex：LLM 数据框架与 RAG ( #llamaindex #rag #data-framework #indexing)
- [[concepts/autogen]] — AutoGen：微软多 Agent 对话框架 ( #autogen #agent #multi-agent #microsoft)
- [[concepts/kubeflow]] — Kubeflow：K8s MLOps 平台 ( #kubeflow #kubernetes #mlops #cncf)
- [[concepts/volcano]] — Volcano：K8s 批处理调度器（CNCF 孵化） ( #volcano #kubernetes #scheduling #batch)
- [[concepts/kueue]] — Kueue：K8s 原生作业排队与配额系统 ( #kueue #kubernetes #scheduling #quota)
- [[concepts/lm-evaluation-harness]] — LM Evaluation Harness：EleutherAI LLM 评测框架 ( #lm-evaluation-harness #evaluation #benchmark)
- [[concepts/opencompass]] — OpenCompass：一站式大模型评测平台 ( #opencompass #evaluation #benchmark #chinese-llm)
- [[concepts/oci-runtime]] — OCI Runtime Spec：容器运行时标准，CDI 注入的最终落点 ( #oci #container-runtime #runc)
- [[concepts/gpustack]] — GPUStack：开源 GPU 集群管理与私有 MaaS 平台 ( #deployment #inference #gpu-cluster #maas)
- [[concepts/embeddings-vectors-mrl-plain]] — Embedding、向量与 MRL 大白话 ( #embedding #vector #matryoshka #for-dummy)
- [[concepts/mcp]] — MCP 模型上下文协议：AI 系统的标准化外部能力接入 ( #mcp #agent #protocol #anthropic)
- [[concepts/agent-loop]] — Agent Loop：智能体核心运行时循环（感知→推理→执行→观察） ( #agent-loop #agent #runtime)
- [[concepts/agent-harness]] — Agent Harness：将 LLM 包装为生产级智能体的执行与治理层 ( #agent-harness #agent #production)
- [[concepts/context-engineering]] — 上下文工程：从提示词工程进阶的系统化信息环境设计 ( #context-engineering #prompt-engineering #llm)
- [[concepts/prompt-injection]] — 提示注入：LLM 系统的核心输入攻击向量与分层防御 ( #prompt-injection #security #jailbreak)
- [[concepts/hallucination]] — 幻觉：LLM 生成不实内容的根因、类型与缓解策略 ( #hallucination #reliability #rag)
- [[concepts/a2a-protocol]] — A2A 协议：Google 智能体间互操作通信标准 ( #a2a #agent #protocol #google)
- [[concepts/guardrails]] — AI 护栏：输入输出过滤、工具策略、沙箱与结构化输出校验 ( #guardrails #security #safety)

## Deep Dives

- [[11_RAG_Systems/Matryoshka_Representation_Learning_Deep_Dive]] — Matryoshka Representation Learning 深度解析 ( #embeddings #rag #matryoshka)
- [[11_RAG_Systems/Matryoshka_Representation_Learning_for_dummy]] — Matryoshka Representation Learning — 小白版 ( #embeddings #for-dummy #matryoshka)
- [[22_Papers/Matryoshka_Representation_Learning_Deep_Dive]] — 论文深度解读: Matryoshka Representation Learning ( #paper #matryoshka)
- [[concepts/embeddings-vectors-mrl-plain]] — Embedding、向量与 MRL 大白话 ( #embedding #vector #matryoshka #for-dummy)

## Entities

## Skills

## References

### 中国大模型生态
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/README]] — 中国大模型生态全景 (15家厂商) ( #chinese-llm #ecosystem)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Chinese_LLM_Comparison_Matrix]] — 全厂商对比矩阵 ( #chinese-llm #comparison)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Chinese_LLM_Training_Inference_Platforms]] — 训练推理平台实战参考 ( #chinese-llm #training #inference)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/DeepSeek_Deep_Dive]] — DeepSeek 深度解析 (MLA+MoE+FP8) ( #chinese-llm #deepseek #moe)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Qwen_Deep_Dive]] — 通义千问深度解析 ( #chinese-llm #qwen)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/GLM_Zhipu_Deep_Dive]] — 智谱 GLM 深度解析 (GLM-5.2 · 1M 上下文 · MIT 开源) ( #chinese-llm #glm)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Kimi_Moonshot_Deep_Dive]] — Kimi 月之暗面深度解析 ( #chinese-llm #kimi)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/MiniMax_Deep_Dive]] — MiniMax 深度解析 ( #chinese-llm #minimax)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Xiaomi_MiMo_Deep_Dive]] — 小米 MiMo 深度解析 ( #chinese-llm #xiaomi)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Baidu_ERNIE_Deep_Dive]] — 百度文心深度解析 ( #chinese-llm #baidu #ernie)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Baichuan_Deep_Dive]] — 百川智能深度解析 ( #chinese-llm #baichuan)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Yi_01AI_Deep_Dive]] — 零一万物 Yi 深度解析 ( #chinese-llm #yi)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/StepFun_Deep_Dive]] — 阶跃星辰深度解析 ( #chinese-llm #stepfun)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Tencent_Hunyuan_Deep_Dive]] — 腾讯混元深度解析 ( #chinese-llm #tencent #hunyuan)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/iFlytek_Spark_Deep_Dive]] — 讯飞星火深度解析 ( #chinese-llm #iflytek)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/SenseTime_SenseNova_Deep_Dive]] — 商汤日日新深度解析 ( #chinese-llm #sensetime)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/InternLM_Deep_Dive]] — 书生浦语深度解析 ( #chinese-llm #internlm)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/ByteDance_Doubao_Deep_Dive]] — 字节豆包深度解析 ( #chinese-llm #bytedance #doubao)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Chinese_Open_Source_Top100]] — 中国开源大模型生态 Top 100 项目全景 ( #chinese-llm #open-source #foundation #top100)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/ModelScope_Model_Catalog]] — ModelScope 15 厂商模型目录 (1,621 模型 · Top 精选 + 统计) ( #chinese-llm #modelscope #model-hub)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/ModelScope_Model_Index]] — ModelScope 全量模型索引表 (1,621 模型完整清单) ( #chinese-llm #modelscope #index #reference)

### 国产 AI 芯片
- [[01_Fundamentals/AI_Hardware/Chinese_AI_Chips_Deep_Dive]] — 国产 AI 芯片12家厂商深度解析 ( #ai-chip #ascend #cambricon #biren #chinese-llm)

### 容器与设备接入
- [[12_Architecture_Infrastructure/CDI_Deep_Dive]] — CDI 容器设备接口标准:GPU/异构加速器统一接入 K8s ( #cdi #kubernetes #gpu #containerd #device-plugin)
- [[12_Architecture_Infrastructure/DRA_Deep_Dive]] — DRA 动态资源分配:K8s 设备分配的未来,与 CDI 配对 ( #dra #kubernetes #gpu #scheduling)
- [[12_Architecture_Infrastructure/MIG_Deep_Dive]] — MIG (Multi-Instance GPU):A100/H100/PPU 硬件级切片,多租户强隔离推理 ( #mig #gpu-partitioning #multi-tenant #a100 #h100)
- [[12_Architecture_Infrastructure/HAMi_Deep_Dive]] — HAMi 深度解析:CNCF Sandbox 异构 GPU 虚拟化与调度 ( #hami #cncf #gpu-virtualization #kubernetes #heterogeneous)
- [[12_Architecture_Infrastructure/HAMi_for_dummy]] — HAMi 入门:让 Kubernetes GPU 像 CPU 一样共享 ( #hami #for-dummy #gpu-sharing)
- [[12_Architecture_Infrastructure/HAMi_Operation_Guide]] — HAMi 运维指南:安装、配置、升级与监控 ( #hami #operations #kubernetes)
- [[16_AI_Ops/HAMi_Troubleshooting_Guide]] — HAMi 问题排查与故障解决指南 ( #hami #troubleshooting #ops)
- [[references/cdi-spec]] — CDI 规范官方源引用(CNCF/Apache-2.0/运行时支持矩阵) ( #cdi #cncf #references)

### CNCF 云原生大模型 (Cloud Native AI)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/README]] — CNCF 生态 18 个大模型项目五层架构全景与选型决策树 ( #cncf #kubernetes #cloud-native #llm #genai)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/KServe_Deep_Dive]] — KServe:K8s 标准化推理平台 (CNCF 孵化) ( #cncf #kserve #inference #kubernetes)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/KAITO_Deep_Dive]] — KAITO:一行 preset 部署 LLM 的 Operator (CNCF 沙箱) ( #cncf #kaito #inference #azure)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/llm-d_Deep_Dive]] — llm-d:分布式 + 共享 KV Cache 推理框架 ( #cncf #llm-d #distributed #kv-cache)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/llmaz_Deep_Dive]] — llmaz:易用优先的多引擎 K8s 推理平台 ( #cncf #llmaz #vllm #sglang)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/AIBrix_Deep_Dive]] — AIBrix:模块化 vLLM 推理基础设施组件 ( #cncf #aibrix #vllm #autoscaling)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/Volcano_Deep_Dive]] — Volcano:Gang Scheduling 批处理调度器 (CNCF 孵化) ( #cncf #volcano #scheduling #batch)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/KAI_Scheduler_Deep_Dive]] — KAI Scheduler:万卡级拓扑感知 GPU 调度器 (CNCF 沙箱) ( #cncf #kai-scheduler #gpu #topology)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/Kueue_Deep_Dive]] — Kueue:K8s 原生作业排队/配额系统 (SIGs) ( #cncf #kueue #scheduling #quota)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/KubeRay_Deep_Dive]] — KubeRay:Ray on K8s,vLLM 分布式底座 ( #cncf #kuberay #ray #distributed)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/KitOps_Deep_Dive]] — KitOps/ModelKit:大模型制品打包标准 (CNCF 沙箱) ( #cncf #kitops #modelkit #oci #packaging)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/Dragonfly_Deep_Dive]] — Dragonfly:P2P 加速权重分发 (CNCF 毕业) ( #cncf #dragonfly #p2p #distribution)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/K8sGPT_Deep_Dive]] — K8sGPT:给 K8s 装一个 AI SRE (CNCF 沙箱) ( #cncf #k8sgpt #aiops #sre)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/HolmesGPT_Deep_Dive]] — HolmesGPT:AI 事故调查员 (CNCF 沙箱) ( #cncf #holmesgpt #aiops #incident-response)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/kagent_Deep_Dive]] — kagent:K8s 原生 DevOps Agent 框架 (CNCF 沙箱) ( #cncf #kagent #agent #devops)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/Knative_Deep_Dive]] — Knative:LLM 服务 scale-to-zero (CNCF 毕业) ( #cncf #knative #serverless #autoscaling)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/Envoy_AI_Gateway_Deep_Dive]] — Envoy AI Gateway:基于 Envoy 的 GenAI 统一入口 ( #cncf #envoy #ai-gateway)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/Kgateway_Deep_Dive]] — Kgateway:Envoy 内核 API+AI 双模网关 ( #cncf #kgateway #envoy #gateway-api)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/AgentGateway_Deep_Dive]] — AgentGateway:AI Agent 与 MCP 服务器代理网关 ( #cncf #agentgateway #mcp #agent)

### 学习课程
- [[90_Learn/courses/microsoft/microsoft_ai_for_beginners]] — Microsoft 官方 12 周 AI 初学者课程映射 ( #learning-paths #microsoft #course)
- [[references/microsoft-ai-for-beginners]] — Microsoft AI For Beginners 外部源引用索引 ( #references #microsoft)
- [[90_Learn/courses/microsoft/microsoft_genai_for_beginners]] — Microsoft 21 课生成式 AI 初学者课程映射 ( #learning-paths #microsoft #generative-ai #course)
- [[references/microsoft-genai-for-beginners]] — Microsoft Generative AI For Beginners 外部源引用索引 ( #references #microsoft #generative-ai)
- [[01_Fundamentals/GenAI_L00_Course_Setup]] — L00 课程环境设置 ( #microsoft-genai-course #setup)
- [[00_AI_Introduction/GenAI_L01_Intro_to_GenAI_and_LLMs]] — L01 生成式 AI 与 LLM 简介 ( #microsoft-genai-course #generative-ai)
- [[04_NLP_LLMs/GenAI_L02_Exploring_and_Comparing_LLMs]] — L02 探索与比较不同 LLM ( #microsoft-genai-course #llm)
- [[19_Ethics_Safety/GenAI_L03_Using_GenAI_Responsibly]] — L03 负责任地使用生成式 AI ( #microsoft-genai-course #ethics)
- [[04_NLP_LLMs/Prompt_Engineering/GenAI_L04_Prompt_Engineering_Fundamentals]] — L04 提示工程基础 ( #microsoft-genai-course #prompt-engineering)
- [[04_NLP_LLMs/Prompt_Engineering/GenAI_L05_Advanced_Prompts]] — L05 创建高级提示 ( #microsoft-genai-course #prompt-engineering)
- [[13_Agent_Production/GenAI_L06_Text_Generation_Apps]] — L06 构建文本生成应用 ( #microsoft-genai-course #text-generation)
- [[13_Agent_Production/GenAI_L07_Building_Chat_Applications]] — L07 构建聊天应用 ( #microsoft-genai-course #chat)
- [[11_RAG_Systems/GenAI_L08_Building_Search_Applications]] — L08 构建搜索应用 ( #microsoft-genai-course #search)
- [[04_NLP_LLMs/Multimodal_Models/GenAI_L09_Building_Image_Applications]] — L09 构建图像生成应用 ( #microsoft-genai-course #image-generation)
- [[20_AI_Applications_Industry/GenAI_L10_Building_Low_Code_AI_Applications]] — L10 构建低代码 AI 应用 ( #microsoft-genai-course #low-code)
- [[13_Agent_Production/GenAI_L11_Integrating_with_Function_Calling]] — L11 使用函数调用集成外部应用 ( #microsoft-genai-course #function-calling)
- [[13_Agent_Production/GenAI_L12_Designing_UX_for_AI_Applications]] — L12 设计 AI 应用用户体验 ( #microsoft-genai-course #ux)
- [[19_Ethics_Safety/GenAI_L13_Securing_AI_Applications]] — L13 保障生成式 AI 应用安全 ( #microsoft-genai-course #security)
- [[10_MLOps_Pipeline/GenAI_L14_GenAI_Application_Lifecycle]] — L14 生成式 AI 应用生命周期 ( #microsoft-genai-course #mlops)
- [[11_RAG_Systems/GenAI_L15_RAG_and_Vector_Databases]] — L15 RAG 与向量数据库 ( #microsoft-genai-course #rag)
- [[04_NLP_LLMs/GenAI_L16_Open_Source_Models_and_Hugging_Face]] — L16 开源模型与 Hugging Face ( #microsoft-genai-course #open-source)
- [[13_Agent_Production/GenAI_L17_AI_Agents]] — L17 AI 代理 ( #microsoft-genai-course #agents)
- [[04_NLP_LLMs/Fine_tuning_Techniques/GenAI_L18_Fine_Tuning_LLMs]] — L18 微调大型语言模型 ( #microsoft-genai-course #fine-tuning)
- [[04_NLP_LLMs/Edge_LLM/GenAI_L19_Building_with_SLMs]] — L19 使用小型语言模型构建 ( #microsoft-genai-course #slm)
- [[04_NLP_LLMs/Global_LLM_Ecosystem/GenAI_L20_Building_with_Mistral]] — L20 使用 Mistral 模型构建 ( #microsoft-genai-course #mistral)
- [[04_NLP_LLMs/Global_LLM_Ecosystem/GenAI_L21_Building_with_Meta]] — L21 使用 Meta 模型构建 ( #microsoft-genai-course #meta)

### Agent 课程
- [[90_Learn/courses/other/hello_agents]] — Datawhale 中文 Agent 教程：16 章 + 综合项目 ( #learning-paths #ai-agents #datawhale #course)
- [[references/hello-agents]] — Hello-Agents 外部源引用索引 ( #references #ai-agents)
- [[90_Learn/courses/microsoft/microsoft_ai_agents_for_beginners]] — 微软官方 16 课 AI Agent 入门课程映射 ( #learning-paths #microsoft #ai-agents #course)
- [[references/ai-agents-for-beginners]] — Microsoft AI Agents for Beginners 外部源引用索引 ( #references #microsoft #ai-agents)

### Microsoft AI Agents for Beginners — 17 课深度页面
- [[13_Agent_Production/Microsoft_AI_Agents_L00_Course_Setup]] — L00 课程环境：Python/.NET/Azure CLI/Foundry 与 keyless 认证 ( #microsoft-ai-agents-course #setup #azure-foundry)
- [[13_Agent_Production/Microsoft_AI_Agents_L01_Intro]] — L01 AI Agent 简介与七种类型 ( #microsoft-ai-agents-course #agent-types)
- [[13_Agent_Production/Microsoft_AI_Agents_L02_Frameworks]] — L02 MAF 与 Azure AI Agent Service 框架选型 ( #microsoft-ai-agents-course #frameworks)
- [[13_Agent_Production/Microsoft_AI_Agents_L03_Design_Principles]] — L03 Agentic 设计三原则：Space/Time/Core ( #microsoft-ai-agents-course #design-principles #hax)
- [[13_Agent_Production/Microsoft_AI_Agents_L04_Tool_Use]] — L04 工具使用设计模式与函数调用 ( #microsoft-ai-agents-course #tool-use)
- [[13_Agent_Production/Microsoft_AI_Agents_L05_Agentic_RAG]] — L05 Agentic RAG 迭代检索-评估-自纠 ( #microsoft-ai-agents-course #rag)
- [[13_Agent_Production/Microsoft_AI_Agents_L06_Trustworthy_Agents]] — L06 系统消息框架+五类威胁+HITL ( #microsoft-ai-agents-course #trust #security)
- [[13_Agent_Production/Microsoft_AI_Agents_L07_Planning_Design]] — L07 任务分解+结构化输出+迭代重规划 ( #microsoft-ai-agents-course #planning)
- [[13_Agent_Production/Microsoft_AI_Agents_L08_Multi_Agent]] — L08 多 Agent 模式：组聊/Hand-off/协同过滤 ( #microsoft-ai-agents-course #multi-agent)
- [[13_Agent_Production/Microsoft_AI_Agents_L09_Metacognition]] — L09 元认知+Corrective RAG+代码生成 ( #microsoft-ai-agents-course #metacognition #corrective-rag)
- [[13_Agent_Production/Microsoft_AI_Agents_L10_Production]] — L10 可观测性+离线/在线评估+成本三策略 ( #microsoft-ai-agents-course #production #observability)
- [[13_Agent_Production/Microsoft_AI_Agents_L11_Agentic_Protocols]] — L11 MCP/A2A/NLWeb 三大协议对比 ( #microsoft-ai-agents-course #mcp #a2a #nlweb #protocols)
- [[13_Agent_Production/Microsoft_AI_Agents_L12_Context_Engineering]] — L12 上下文工程+四类上下文+四大失败模式 ( #microsoft-ai-agents-course #context-engineering)
- [[13_Agent_Production/Microsoft_AI_Agents_L13_Agent_Memory]] — L13 七种记忆+Mem0/Cognee/Azure AI Search ( #microsoft-ai-agents-course #memory)
- [[13_Agent_Production/Microsoft_AI_Agents_L14_Microsoft_Agent_Framework]] — L14 MAF 深度：Agents/Threads/Middleware/Workflows ( #microsoft-ai-agents-course #maf #workflows)
- [[13_Agent_Production/Microsoft_AI_Agents_L15_Browser_Use]] — L15 浏览器 Agent：Browser-Use+Playwright+CDP ( #microsoft-ai-agents-course #cua #browser-use)
- [[13_Agent_Production/Microsoft_AI_Agents_L18_Securing_AI_Agents]] — L18 加密审计收据：Ed25519+JCS+哈希链 ( #microsoft-ai-agents-course #security #cryptography #audit)
- [[90_Learn/courses/share_ai/learn_claude_code]] — 20 课 Claude Code 式 Harness 工程教程映射 ( #learning-paths #claude-code #agent-harness #course)
- [[references/learn-claude-code]] — Learn Claude Code 外部源引用索引 ( #references #claude-code)

### LLM 与 AI 基础课程
- [[90_Learn/courses/other/hands_on_llms]] — 《Hands-On Large Language Models》12 章课程映射 ( #learning-paths #llm #course)
- [[references/books/hands-on-llms-alammar]] — Hands-On Large Language Models 书籍引用索引 ( #references #book #llm)
- [[90_Learn/courses/apachecn/ailearning_guide]] — ApacheCN 中文全栈 AI 学习资料库指南 ( #learning-paths #chinese-ai #course)
- [[references/apachecn-ailearning]] — ApacheCN AILearning 外部源引用索引 ( #references #chinese-ai)

### 项目合集
- [[references/500-ai-projects]] — 500+ AI/ML/DL/CV/NLP 实战项目合集索引 ( #references #projects)

### 推理与成本优化
- [[09_Deployment_Inference/Batch_API_Comparison_2026]] — LLM Batch API 全面对比：OpenAI/Anthropic/Google/DeepSeek 批量处理 ( #batch-api #cost-optimization #inference)
- [[09_Deployment_Inference/KServe_Deep_Dive]] — KServe 深度解析：Kubernetes 标准化模型服务平台 ( #kserve #cncf #kubernetes #model-serving)
- [[09_Deployment_Inference/TGI_Deep_Dive]] — TGI 深度解析：HuggingFace 生产级 LLM 推理引擎 ( #tgi #huggingface #inference #llm)
- [[09_Deployment_Inference/TensorRT_LLM_Deep_Dive]] — TensorRT-LLM 深度解析：NVIDIA LLM 推理优化引擎 ( #tensorrt-llm #nvidia #inference)
- [[09_Deployment_Inference/SGLang_Deep_Dive]] — SGLang 深度解析：RadixAttention 高性能推理框架 ( #sglang #inference #radix-attention)
- [[09_Deployment_Inference/LMDeploy_Deep_Dive]] — LMDeploy 深度解析：国产 LLM 推理部署工具 ( #lmdeploy #inference #chinese-llm)

### 训练与分布式计算
- [[07_Model_Training/Ray_Deep_Dive]] — Ray 深度解析：Python 分布式 AI 计算框架 ( #ray #distributed #training #inference)
- [[07_Model_Training/DeepSpeed_Deep_Dive]] — DeepSpeed 深度解析：微软大模型训练与推理优化库 ( #deepspeed #distributed-training #microsoft)
- [[10_MLOps_Pipeline/Kubeflow_Deep_Dive]] — Kubeflow 深度解析：K8s 端到端 MLOps 平台 ( #kubeflow #kubernetes #mlops)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/Volcano_Deep_Dive]] — Volcano 深度解析：K8s 批处理调度器 ( #volcano #kubernetes #scheduling)
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/Kueue_Deep_Dive]] — Kueue 深度解析：K8s 原生作业排队与配额系统 ( #kueue #kubernetes #scheduling)

### RAG 与向量数据库
- [[11_RAG_Systems/Milvus_Deep_Dive]] — Milvus 深度解析：分布式向量数据库 ( #milvus #vector-database #rag)
- [[11_RAG_Systems/Qdrant_Deep_Dive]] — Qdrant 深度解析：Rust 高性能向量数据库 ( #qdrant #vector-database #rag)
- [[11_RAG_Systems/Weaviate_Deep_Dive]] — Weaviate 深度解析：AI 原生向量数据库 ( #weaviate #vector-database #rag)
- [[11_RAG_Systems/LlamaIndex_Deep_Dive]] — LlamaIndex 深度解析：LLM 数据框架与 RAG ( #llamaindex #rag #data-framework)

### Agent 框架
- [[13_Agent_Production/Agent_Frameworks/LangChain_Deep_Dive]] — LangChain 深度解析：LLM 应用开发框架 ( #langchain #agent #framework)
- [[13_Agent_Production/Agent_Frameworks/LangChain_Agents_Deep_Dive]] — LangChain Agents 深度解析 ( #langchain #agent #tool-use)
- [[13_Agent_Production/Agent_Frameworks/AutoGen_Deep_Dive]] — AutoGen 深度解析：微软多 Agent 对话框架 ( #autogen #agent #multi-agent)

### 模型评估
- [[08_Model_Evaluation/LM_Evaluation_Harness_Deep_Dive]] — LM Evaluation Harness 深度解析：EleutherAI LLM 评测框架 ( #lm-evaluation-harness #evaluation #benchmark)
- [[08_Model_Evaluation/OpenCompass_Deep_Dive]] — OpenCompass 深度解析：一站式大模型评测平台 ( #opencompass #evaluation #benchmark)

### 可观测与监控
- [[16_AI_Ops/Prometheus_Grafana_Deep_Dive]] — Prometheus + Grafana 深度解析：AI 系统监控与可视化基座 ( #prometheus #grafana #monitoring #observability)

### 安全与对齐
- [[19_Ethics_Safety/Constitutional_AI_Deep_Dive]] — Constitutional AI 深度解析：Anthropic 核心安全方法论 ( #constitutional-ai #alignment #anthropic #safety)

### MLOps 流水线
- [[10_MLOps_Pipeline/LLM_Production_Pipeline_2026]] — LLM 生产流水线完全指南：七阶段闭环架构 ( #mlops #llm-pipeline #production #ci-cd)
- [[10_MLOps_Pipeline/Kubeflow_Deep_Dive]] — Kubeflow 深度解析：K8s 端到端 MLOps 平台 ( #kubeflow #kubernetes #mlops)

### 大模型技术生态评估
- [[_llm-ecosystem-analysis-2026-06-15]] — 大模型技术生态内容完整性分析 ( #meta #audit #llm-ecosystem)

### Yeasy AI 知识库系列 — 提示词与上下文工程
- [[04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering_Complete_Guide]] — 提示词工程核心技术：结构、最佳实践、少样本、CoT、ReAct ( #prompt-engineering #llm)
- [[04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering_Advanced_Apps]] — 提示词高级应用：RAG、多模态、安全、PromptOps ( #prompt-engineering #rag #multimodal)
- [[04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering_Templates_Patterns]] — 提示词模板库、反模式与决策树 ( #prompt-engineering #templates #anti-patterns)
- [[04_NLP_LLMs/Context_Engineering_Guide]] — 上下文工程权威指南：写入/选择/压缩/隔离四大策略 ( #context-engineering #llm)
- [[04_NLP_LLMs/Context_Engineering_Patterns]] — 上下文工程模式：记忆架构、Graph RAG、XML 标签、反模式 ( #context-engineering #graph-rag #memory)

### Yeasy AI 知识库系列 — LLM 原理与架构
- [[04_NLP_LLMs/Transformer_Deep_Dive]] — Transformer 深度解析：QKV 注意力、位置编码（RoPE/ALiBi）、完整架构 ( #transformer #attention #position-encoding)
- [[04_NLP_LLMs/LLM_Training_Deep_Dive]] — LLM 训练深度解析：预训练、分布式训练（ZeRO/3D 并行）、对齐（RLHF/DPO/LoRA） ( #llm-training #distributed #rlhf #lora)
- [[04_NLP_LLMs/LLM_Inference_Deep_Dive]] — LLM 推理深度解析：解码策略、KV Cache、Flash Attention、投机解码、PagedAttention ( #llm-inference #kv-cache #flash-attention)
- [[04_NLP_LLMs/LLM_Architecture_Evolution]] — LLM 架构演进：BERT/GPT/Llama/DeepSeek 家族、MoE、SSM/Mamba ( #llm-architecture #moe #ssm)
- [[04_NLP_LLMs/LLM_Internals_Architecture]] — 大模型架构内幕：序列建模演进、注意力机制详解、Transformer 组件、位置编码设计 ( #transformer #attention #rope #alibi)
- [[04_NLP_LLMs/LLM_Internals_Training]] — 大模型训练内幕：预训练范式与 Scaling Law、AdamW/学习率调度、分布式训练、对齐 SFT/RLHF/DPO/LoRA ( #llm-training #scaling-law #distributed #alignment)
- [[04_NLP_LLMs/LLM_Internals_Inference]] — 大模型推理内幕：解码策略、KV Cache/GQA/MLA、Flash Attention、量化、投机解码、连续批处理 ( #llm-inference #kv-cache #quantization #speculative-decoding)
- [[04_NLP_LLMs/LLM_Internals_Models_Frontiers]] — 大模型家族与前沿：BERT 编码器、GPT/Llama/DeepSeek/Gemini/Claude 解码器、MoE/SSM/测试时计算 ( #llm #moe #mamba #test-time-compute)

### Yeasy AI 知识库系列 — AI 入门
- [[00_AI_Introduction/AI_Reasoning_Models_Guide]] — 推理模型指南：System 1/2、推理计算、主流推理模型对比 ( #reasoning-models #inference-compute)
- [[00_AI_Introduction/AI_New_Architectures]] — 新架构与创新：SSM/Mamba、Jamba、DeepSeek MLA/MoE/R1 ( #new-architectures #ssm #deepseek)
- [[00_AI_Introduction/AI_Multimodal_GenAI]] — 多模态与生成式 AI：扩散模型、视频/音频生成、具身智能 ( #multimodal #genai #diffusion)
- [[00_AI_Introduction/AI_Beginner_Fundamentals]] — AI 入门基础：定义/历史/强弱 AI、AI⊃ML⊃DL 套娃、数据算法模型、技术生态与云边端 ( #ai-fundamentals #ai-history #tech-stack)
- [[02_Machine_Learning/ML_For_Beginners]] — 机器学习入门：归纳法本质、监督/无监督/强化/自监督四大范式、评估指标与选型 ( #machine-learning #supervised #reinforcement-learning)
- [[03_Deep_Learning/Deep_Learning_For_Beginners]] — 深度学习入门：神经网络、梯度下降、CNN/RNN/Transformer/GAN/Diffusion 架构与局限 ( #deep-learning #neural-network #cnn)
- [[04_NLP_LLMs/LLM_For_Beginners]] — 大语言模型入门：Next Token Prediction、Token/温度、QKV 注意力、预训练→微调→RLHF、推理部署 ( #llm #transformer #pretraining)
- [[00_AI_Introduction/AI_Application_Scenarios]] — AI 应用场景与工具：BROKE 提示词框架、上下文工程三层、职场/学习/编程/生活五大场景、ReAct 智能体 ( #prompt-engineering #ai-applications #react)
- [[19_Ethics_Safety/AI_Ethics_And_Future_For_Beginners]] — AI 伦理与未来：偏见/对齐、Deepfake/隐私/注入、就业影响、AGI/奇点、GPU/TPU/NPU 与量子计算 ( #ai-ethics #agi #ai-hardware)

### Yeasy AI 知识库系列 — Claude 与 AI 编码
- [[17_AI_Coding/02_Tools/Claude_Complete_Guide]] — Claude 完整指南：模型家族、XML 提示、工具使用、MCP、Computer Use ( #claude #anthropic #mcp)
- [[17_AI_Coding/02_Tools/Claude_Code_Deep_Dive]] — Claude Code 深度解析：CLI、SDK、IDE、Routines、Hooks ( #claude-code #ai-coding)
- [[17_AI_Coding/01_Theory/Claude_Agent_Architecture]] — Claude Agent 架构：设计模式、扩展思考、多 Agent 协作、Agent SDK ( #claude #agent #multi-agent)

### Yeasy AI 知识库系列 — 智能体与 Harness
- [[13_Agent_Production/Agent_Foundations/Agentic_AI_Complete_Guide]] — 智能体 AI 完整指南：认知层级、推理、记忆、工具、MCP ( #agent #reasoning #memory)
- [[13_Agent_Production/Agent_Foundations/Multi_Agent_Systems_Guide]] — 多智能体系统指南：协作架构、SOP、A2A、博弈论、评估 ( #multi-agent #collaboration #a2a)
- [[13_Agent_Production/Agent_Workflow/AgentOps_Production_Guide]] — AgentOps 生产指南：框架生态、Harness、可观测性、反模式 ( #agentops #production #observability)
- [[13_Agent_Production/Agent_Harness/Harness_Engineering_Complete_Guide]] — Harness 工程完整指南：五大子系统、设计原则、架构 ( #agent-harness #architecture)
- [[13_Agent_Production/Agent_Harness/Harness_Core_Subsystems]] — Harness 核心子系统：运行时引擎、工具层、记忆、输出治理 ( #agent-harness #runtime #tool-layer)
- [[13_Agent_Production/Agent_Harness/Harness_Production_Security]] — Harness 生产安全：编排、MCP、可靠性、安全威胁模型 ( #agent-harness #security #mcp)

### Yeasy AI 知识库系列 — OpenClaw
- [[13_Agent_Production/23_OpenClaw_Ecosystem/OpenClaw_Complete_Guide]] — OpenClaw 完整指南：安装、配置、工具、记忆、多渠道、多 Agent ( #openclaw #agent-framework)
- [[13_Agent_Production/23_OpenClaw_Ecosystem/OpenClaw_Internals]] — OpenClaw 内部实现：Gateway 五平面、Agent Loop、可靠性、插件 ( #openclaw #internals #gateway)

### Yeasy AI 知识库系列 — 安全
- [[19_Ethics_Safety/LLM_Security_Complete_Guide]] — LLM 安全完整指南：威胁全景、OWASP/NIST/ATLAS、攻击技术 ( #llm-security #owasp #prompt-injection)
- [[19_Ethics_Safety/LLM_Security_Defense_Guide]] — LLM 安全防御指南：纵深防御、I/O 防护、安全运营、治理 ( #llm-security #defense #red-teaming)
- [[19_Ethics_Safety/Agent_RAG_Security]] — Agent 与 RAG 安全：攻击面、工具安全、多 Agent 安全、Rule of Two ( #agent-security #rag-security)

### Yeasy 深度蒸馏 — 综合页与速查表
- [[_meta/synthesis-engineering-evolution]] — 从提示词工程到上下文工程到 Harness 工程的三阶演进 ( #synthesis #engineering-evolution)
- [[_meta/synthesis-llm-security-pipeline]] — 大模型安全全链路：从训练投毒到推理防御 ( #synthesis #security)
- [[_meta/synthesis-architecture-selection-guide]] — AI 系统架构选型决策树：从任务类型到技术栈 ( #synthesis #architecture #decision-tree)
- [[_meta/synthesis-memory-systems]] — AI 系统记忆体系全景：从 KV Cache 到长期知识图谱 ( #synthesis #memory)
- [[_meta/cheatsheet-llm-inference]] — LLM 推理技术速查表：模型选型、优化技术、解码策略、引擎对比 ( #cheatsheet #inference)
- [[_meta/cheatsheet-agent-design]] — 智能体架构设计速查表：认知层级、推理技术、记忆、框架选型 ( #cheatsheet #agent)
- [[_meta/cheatsheet-security-defense]] — LLM 安全防御速查表：攻击映射、OWASP Top 10、分层检查清单 ( #cheatsheet #security)

## Synthesis

- [[synthesis/hami-cdi-dra]] — HAMi × CDI × DRA：异构 GPU 共享与设备注入的协作关系 ( #hami #cdi #dra #gpu-virtualization #synthesis)

## Journal
