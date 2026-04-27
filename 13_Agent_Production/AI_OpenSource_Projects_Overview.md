# AI 开源项目全景图

> **一句话理解**: 本知识库收录了 AI 领域 50+ 主流开源项目的深度文档，覆盖 LLM、Agent、RAG、推理部署、评估等全链路。

---

## 分类总览

```
AI 开源项目分类
═══════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────────┐
│                        AI 开源项目生态                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  LLM & 模型                                                       │
│  ├── 开源模型: Llama, Mistral, Qwen, DeepSeek, Gemma             │
│  ├── 微调框架: Axonn, Unsloth, LLaMA Factory                     │
│  └── 基础模型: Transformer, Diffusion                           │
│                                                                   │
│  Agent 框架                                                       │
│  ├── 多 Agent 编排: LangGraph, AutoGen, CrewAI, AgentScope       │
│  ├── 自主执行: AutoGPT, OpenGPT, SmolAgents, agno               │
│  └── 平台: Dify, Coze, LangFlow, Flowise                        │
│                                                                   │
│  RAG 系统                                                          │
│  ├── 框架: LangChain, LlamaIndex, Haystack                       │
│  ├── 可视化: LangFlow, Flowise, Dify                            │
│  └── 向量存储: Chroma, Qdrant, Milvus, Weaviate                  │
│                                                                   │
│  推理部署                                                          │
│  ├── 推理引擎: vLLM, SGLang, TensorRT-LLM, LMDeploy             │
│  ├── 本地部署: Ollama, llama.cpp, LM Studio                     │
│  └── 网关: LiteLLM, Portkey, Bifrost                            │
│                                                                   │
│  AI 编程                                                          │
│  ├── IDE: Cursor, Windsurf, VS Code (Cody)                      │
│  ├── CLI: Claude Code, OpenCode, Devin                          │
│  └── 工具: Aider, Continue, CodeRabbit                           │
│                                                                   │
│  评估测试                                                          │
│  ├── 基准: SWE-bench, BigCodeEval, RAGAS                        │
│  ├── 框架: AgentEval, LangSmith, Phoenix                        │
│  └── 工具: Promptfoo, RAGAS, BigCode                            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 1. Agent 框架

### 1.1 多 Agent 编排框架

| 框架 | 开发商 | 协作模式 | 特点 | 文档 |
|------|--------|----------|------|------|
| **LangGraph** | LangChain | 状态机 | 高度灵活，复杂工作流 | [Deep Dive](./Agent_Frameworks/LangGraph_Deep_Dive.md) |
| **AutoGen** | Microsoft | 对话式 | Group Chat，代码执行 | [Deep Dive](./Agent_Frameworks/AutoGen_Deep_Dive.md) |
| **CrewAI** | CrewAI | 角色+任务 | 简单易用，角色扮演 | [Deep Dive](./Agent_Frameworks/CrewAI_Deep_Dive.md) |
| **AgentScope** | 阿里巴巴 | Actor-Staged | 大规模并发，中文 | [Deep Dive](./Agent_Frameworks/AgentScope_Deep_Dive.md) |

### 1.2 自主执行框架

| 框架 | 特点 | 场景 | 文档 |
|------|------|------|------|
| **AutoGPT** | 自主规划执行 | 复杂任务 | [Deep Dive](./Agent_Frameworks/AutoGPT_Deep_Dive.md) |
| **SmolAgents** | 轻量级，HF 集成 | 快速实验 | [Deep Dive](./Agent_Frameworks/SmolAgents_Deep_Dive.md) |
| **agno** | 知识+记忆内置 | 生产级 Agent | [Deep Dive](./Agent_Frameworks/Agno_Deep_Dive.md) |

### 1.3 LLM 应用框架

| 框架 | 特点 | 场景 | 文档 |
|------|------|------|------|
| **LangChain** | 全能，组件丰富 | LLM 应用开发 | [Deep Dive](./Agent_Frameworks/LangChain_Deep_Dive.md) |
| **LangChain Agents** | 工具调用框架 | ReAct、Plan-and-Execute | [Deep Dive](./Agent_Frameworks/LangChain_Agents_Deep_Dive.md) |
| **Transformers Agents** | HuggingFace 原生 | 代码执行、多模态工具 | [Deep Dive](./Agent_Frameworks/Transformers_Agents_Deep_Dive.md) |

---

## 2. RAG 系统

### 2.1 RAG 框架

| 框架 | 特点 | 文档 |
|------|------|------|
| **LlamaIndex** | 数据索引优先，查询优化 | [Deep Dive](../11_RAG_Systems/LlamaIndex_Deep_Dive.md) |
| **LangChain** | 生态丰富，链式调用 | (见 Agent 框架) |
| **Haystack** | 模块化，Pipeline 架构 | [Deep Dive](../11_RAG_Systems/Haystack_Deep_Dive.md) |

### 2.2 可视化平台

| 平台 | 特点 | 文档 |
|------|------|------|
| **Dify** | 开源可视化，RAG+Agent | [Deep Dive](../11_RAG_Systems/Dify_Deep_Dive.md) |
| **LangFlow** | LangChain 可视化 | [Deep Dive](../11_RAG_Systems/LangFlow_Deep_Dive.md) |
| **Flowise** | 低代码，快速原型 | [Deep Dive](../11_RAG_Systems/Flowise_Deep_Dive.md) |

### 2.3 向量存储

| 存储 | 类型 | 特点 | 适用场景 |
|------|------|------|----------|
| **Chroma** | 开源 | 轻量级，本地优先 | 原型、小规模 | [Deep Dive](../11_RAG_Systems/Chroma_Deep_Dive.md) |
| **Qdrant** | 开源 | 高性能，混合检索 | 生产环境 | [Deep Dive](../11_RAG_Systems/Qdrant_Deep_Dive.md) |
| **Milvus** | 开源+云 | 大规模，向量检索 | 超大规模 | [Deep Dive](../11_RAG_Systems/Milvus_Deep_Dive.md) |
| **Typesense** | 开源 | 极速，搜索友好 | 搜索优先 | [Deep Dive](../11_RAG_Systems/Typesense_Deep_Dive.md) |
| **Weaviate** | 开源 | 混合检索，GraphQL | 多模态 | [Deep Dive](../11_RAG_Systems/Weaviate_Deep_Dive.md) |

---

## 3. 推理部署

### 3.1 推理引擎

| 引擎 | 开发商 | 吞吐量 | 特点 | 文档 |
|------|--------|--------|------|------|
| **SGLang** | LMSYS | 16,215 tok/s | RadixAttention，前缀缓存 | [Deep Dive](../09_Deployment_Inference/SGLang_Deep_Dive.md) |
| **vLLM** | UC Berkeley | 12,553 tok/s | PagedAttention，生态成熟 | [Deep Dive](../09_Deployment_Inference/vLLM_Deep_Dive.md) |
| **LMDeploy** | 上海 AI 实验室 | 16,132 tok/s | TurboMind，国产优化 | [Deep Dive](../09_Deployment_Inference/LMDeploy_Deep_Dive.md) |
| **TensorRT-LLM** | NVIDIA | 10,000+ tok/s | 单请求低延迟 | [Deep Dive](../09_Deployment_Inference/TensorRT_LLM_Deep_Dive.md) |
| **llama.cpp** | 开源社区 | ~6,000 tok/s | 纯 C/C++，CPU 推理 | [Deep Dive](../09_Deployment_Inference/llama_cpp_Deep_Dive.md) |

### 3.2 本地部署

| 工具 | 特点 | 文档 |
|------|------|------|
| **Ollama** | 零配置，一键运行 | [Deep Dive](../09_Deployment_Inference/Ollama_Deep_Dive.md) |
| **llama.cpp** | CPU 推理，GGUF | [Deep Dive](../09_Deployment_Inference/llama_cpp_Deep_Dive.md) |
| **LM Studio** | 桌面应用 | (见 Deployment_Inference.md) |

### 3.3 AI Gateway

| 方案 | 模型支持 | 特点 | 文档 |
|------|----------|------|------|
| **LiteLLM** | 100+ | 统一接口，智能路由 | [Deep Dive](../14_AI_Gateway/LiteLLM_Deep_Dive.md) |
| **Portkey** | 50+ | 企业级，可观测性 | [Deep Dive](../14_AI_Gateway/Portkey_Deep_Dive.md) |
| **Cohere** | Embedding+LLM | 企业级 embedding | [Deep Dive](../14_AI_Gateway/Cohere_Deep_Dive.md) |

### 3.4 Embedding 模型

| 模型 | 特点 | 文档 |
|------|------|------|
| **Sentence-Transformers** | 开源，多语言 | [Deep Dive](../11_RAG_Systems/Sentence_Transformers_Deep_Dive.md) |
| **Cohere Embed** | 企业级，高精度 | [Deep Dive](../14_AI_Gateway/Cohere_Deep_Dive.md) |
| **OpenAI Embedding** | API 调用 | (见 OpenAI API 文档) |

---

## 4. 多模态模型

### 4.1 开源视觉-语言模型

| 模型 | 开发商 | 特点 | 文档 |
|------|--------|------|------|
| **LLaVA** | 微软 | 开源图文对话 | [Deep Dive](../04_NLP_LLMs/Multimodal_Models/LLaVA_Deep_Dive.md) |
| **Qwen-VL** | 阿里巴巴 | 中文优化 | (见 Multimodal_Architectures_2026.md) |
| **InternVL** | 智谱 | 通用视觉 | (见 Multimodal_Architectures_2026.md) |
| **BakLLaVA** | Mistral | 轻量级 | (见 Multimodal_Architectures_2026.md) |

### 4.2 视觉编码器

| 模型 | 特点 | 文档 |
|------|------|------|
| **CLIP** | 图文对比 | (见 05_Computer_Vision) |
| **SigLIP** | 高性能 | (见 Multimodal_Architectures_2026.md) |

---

## 5. AI 编程工具

### 5.1 Agentic Coding 工具

| 工具 | 类型 | 开发商 | 文档 |
|------|------|--------|------|
| **Claude Code** | CLI | Anthropic | [Deep Dive](../Agentic_Coding_Tools/Claude_Code_Deep_Dive.md) |
| **OpenCode** | CLI | OpenCode | [Deep Dive](../Agentic_Coding_Tools/OpenCode_Deep_Dive.md) |
| **Cursor** | IDE | Cursor | [Deep Dive](../Agentic_Coding_Tools/Windsurf_Cursor_Devin_Dive.md) |
| **Windsurf** | IDE | Codeium | [Deep Dive](../Agentic_Coding_Tools/Windsurf_Cursor_Devin_Dive.md) |
| **Devin** | SA Agent | Cognition | [Deep Dive](../Agentic_Coding_Tools/Windsurf_Cursor_Devin_Dive.md) |

### 5.2 编程辅助

| 工具 | 类型 | 文档 |
|------|------|------|
| **Aider** | 命令行代码编辑 | [Deep Dive](./Agentic_Coding_Tools/Aider_Deep_Dive.md) |
| **Continue** | VS Code 插件 | [Deep Dive](./Agentic_Coding_Tools/Continue_Deep_Dive.md) |
| **CodeRabbit** | 代码审查 | (见 International_Agentic_Tools.md) |
| **Gradio** | ML Demo 框架 | [Deep Dive](./Gradio_Deep_Dive.md) |

### 5.3 模型服务

| 工具 | 特点 | 文档 |
|------|------|------|
| **BentoML** | 一键打包 API | [Deep Dive](../09_Deployment_Inference/BentoML_Deep_Dive.md) |
| **Gradio** | Demo 界面 | [Deep Dive](./Gradio_Deep_Dive.md) |
| **LangServe** | LangChain 服务 | (见 LangChain_Deep_Dive.md) |

---

## 6. 国内开源项目

### 6.1 Agent 框架

| 项目 | 开发商 | 特点 | 文档 |
|------|--------|------|------|
| **AgentScope** | 阿里巴巴 | Actor-Staged 架构 | [Deep Dive](./Agent_Frameworks/AgentScope_Deep_Dive.md) |
| **CoPaw** | 阿里 | 个人 AI 助手 | (见 23_OpenClaw_Ecosystem) |
| **ChatDev** | 清华大学 | 虚拟软件公司 | (见 Agent_Ecosystem_CN) |
| **XAgent** | 上海 AI 实验室 | 通用自主 Agent | (见 Agent_Ecosystem_CN) |
| **MetaGPT** | 研究院 | SOP 驱动 | (见 Agent_Ecosystem_CN) |

### 6.2 模型

| 模型 | 开发商 | 特点 | 文档 |
|------|--------|------|------|
| **Qwen** | 阿里巴巴 | 开源 72B，中文优化 | (见 04_NLP_LLMs) |
| **DeepSeek** | 深度求索 | 代码专用，高性价比 | (见 04_NLP_LLMs) |

---

## 7. MLOps 与数据工具

### 7.1 实验追踪

| 工具 | 特点 | 文档 |
|------|------|------|
| **MLflow** | 全流程，开源 | [Deep Dive](../16_AI_Ops/MLflow_Deep_Dive.md) |
| **Weights & Biases** | SaaS，易用 | [Deep Dive](../15_Testing/Weights_Biases_Deep_Dive.md) |
| **ClearML** | 一站式，开源 | [Deep Dive](../16_AI_Ops/ClearML_Deep_Dive.md) |

### 7.2 数据版本控制

| 工具 | 特点 | 文档 |
|------|------|------|
| **DVC** | Git 工作流 | [Deep Dive](../16_AI_Ops/DVC_Deep_Dive.md) |
| **LakeFS** | 数据湖版本 | [Deep Dive](../16_AI_Ops/LakeFS_Deep_Dive.md) |

### 7.3 提示词管理

| 工具 | 特点 | 文档 |
|------|------|------|
| **PromptLayer** | 请求追踪 | [Deep Dive](../16_AI_Ops/PromptLayer_Deep_Dive.md) |
| **LangSmith** | LLM 调试 | [Deep Dive](../16_AI_Ops/LangSmith_Deep_Dive.md) |

### 7.4 MLOps 平台

| 工具 | 特点 | 文档 |
|------|------|------|
| **Kubeflow** | 云原生，K8s | [Deep Dive](../16_AI_Ops/Kubeflow_Deep_Dive.md) |
| **Prefect** | Python 原生流水线 | [Deep Dive](../16_AI_Ops/Prefect_Deep_Dive.md) |
| **MLflow** | 全流程，开源 | [Deep Dive](../16_AI_Ops/MLflow_Deep_Dive.md) |
| **ClearML** | 一站式开源 | [Deep Dive](../16_AI_Ops/ClearML_Deep_Dive.md) |
| **Feast** | 特征存储 | [Deep Dive](../16_AI_Ops/Feast_Deep_Dive.md) |

### 7.5 LLM 安全

| 工具 | 特点 | 文档 |
|------|------|------|
| **Guardrails AI** | 输入/输出护栏 | [Deep Dive](../16_AI_Ops/Guardrails_Deep_Dive.md) |
| **Llama Guard** | 内容安全 | (见 AI_Safety_2026.md) |

### 7.6 LLM 评估

| 工具 | 特点 | 文档 |
|------|------|------|
| **Braintrust** | 开源评估 | [Deep Dive](../16_AI_Ops/Braintrust_Deep_Dive.md) |
| **Helicone** | 可观测性 | [Deep Dive](../16_AI_Ops/Helicone_Deep_Dive.md) |
| **Promptfoo** | Prompt 测试 | [Deep Dive](../15_Testing/Promptfoo_Deep_Dive.md) |
| **RAGAS** | RAG 评估 | [Deep Dive](../15_Testing/RAGAS_Deep_Dive.md) |
| **DeepEval** | LLM 评估 | [Deep Dive](../15_Testing/DeepEval_Deep_Dive.md) |

### 7.7 结构化输出

| 框架 | 特点 | 文档 |
|------|------|------|
| **Instructor** | Python 原生，类型安全 | [Deep Dive](../04_NLP_LLMs/Prompt_Engineering/Instructor_Deep_Dive.md) |
| **Guidance** | 微软，引导式生成 | [Deep Dive](../04_NLP_LLMs/Prompt_Engineering/Guidance_Deep_Dive.md) |
| **Outlines** | CFG 约束，高速 | [Deep Dive](../04_NLP_LLMs/Prompt_Engineering/Outlines_Deep_Dive.md) |
| **DSPy** | 可编程 Prompt 优化 | [Deep Dive](../04_NLP_LLMs/Prompt_Engineering/DSPy_Deep_Dive.md) |

### 7.8 微调框架

| 框架 | 特点 | 文档 |
|------|------|------|
| **Unsloth** | 2x 加速，24GB 单卡 | [Deep Dive](../04_NLP_LLMs/Fine_tuning_Techniques/Unsloth_Deep_Dive.md) |
| **Axolotl** | 全参数/LoRA/QLoRA | [Deep Dive](../04_NLP_LLMs/Fine_tuning_Techniques/Axolotl_Deep_Dive.md) |

### 7.9 多模态模型

| 模型 | 特点 | 文档 |
|------|------|------|
| **LLaVA** | 开源图文对话 | [Deep Dive](../04_NLP_LLMs/Multimodal_Models/LLaVA_Deep_Dive.md) |

---

## 8. 选型决策树

```
选型决策树
═══════════════════════════════════════════════════════════════════

需要构建 AI 应用?
├── 是 → 需要可视化?
│         ├── 是 → Dify / LangFlow / Flowise
│         └── 否 → 需要复杂编排?
│                   ├── 是 → LangGraph / AutoGen
│                   └── 否 → 快速原型?
│                             ├── 是 → CrewAI / SmolAgents
│                             └── 否 → LangChain / LlamaIndex
│
└── 否 → 需要本地部署?
          ├── 是 → Ollama / llama.cpp
          └── 否 → 需要推理性能?
                    ├── 是 → SGLang / vLLM
                    └── 否 → 多模型管理?
                              └── LiteLLM

需要 Agent 能力?
├── 是 → 多 Agent 协作?
│         ├── 是 → AutoGen / CrewAI / LangGraph
│         └── 否 → 自主执行?
│                   ├── 是 → AutoGPT / agno
│                   └── 否 → 工具调用?
│                             └── SmolAgents / LangChain Agent
│
└── 否 → 只需要 LLM 调用?
          └── LangChain / LiteLLM
```

---

## 文档贡献指南

如果想添加新的开源项目文档：

1. **确定分类**: Agent 框架 → `13_Agent_Production/Agent_Frameworks/`
2. **命名规范**: `<Project>_Deep_Dive.md`
3. **文档结构**:
   - 一句话理解
   - 概述 (定位、特点)
   - 核心概念
   - 架构设计
   - 代码示例
   - 对比与选择
   - 参考资源

---

*Last updated: 2026-04-26*
*Version: 1.1.0*