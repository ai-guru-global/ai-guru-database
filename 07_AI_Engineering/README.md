# 07 AI 工程化与 MLOps (AI Engineering & MLOps)

本章聚焦将 AI 模型落地生产的工程实践，涵盖模型部署（推理加速/量化）、RAG 系统架构、MLOps 流水线（CI/CD/监控）和模型评估。这是 AI 从实验室走向产品的关键环节。

## 学习路径 (Learning Path)

```
    ┌──────────────────────┐
    │  模型评估             │
    │  Model Evaluation    │
    │  (指标/A/B测试)       │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │  模型部署与推理       │
    │  Deployment &        │
    │  Inference           │
    │  (vLLM/量化)         │
    └──────────┬───────────┘
               │
               ├────────────────────┐
               ▼                    ▼
    ┌──────────────────┐   ┌───────────────┐
    │  RAG 系统         │   │  MLOps 流水线 │
    │  RAG Systems     │   │  MLOps        │
    │  (检索增强)       │   │  Pipeline     │
    └──────────────────┘   └───────────────┘
```

## 🚀 速成指南 (In-Nutshell Quick Start)

> 面向初级运维人员的入门材料，包含丰富的 Mermaid 图示。支持 **运维工程师 → AI Agent 工程师** 转型学习路径。

```mermaid
flowchart LR
    A[模型训练] --> B[模型推理]
    B --> C[RAG 系统]
    C --> D[AI 技能]
    D --> E[AI 工作流]
    E --> F[AI 测试]
    F --> G[AI 网关]
    G --> H[AI Ops]
    H --> I[云产品运维]
```

| 主题 | 描述 | 速成文档 |
|------|------|----------|
| 模型训练 | 从零开始训练 AI/ML 模型 | [Model-Training-in-nutshell.md](./Model_Training/Model-Training-in-nutshell.md) |
| 模型推理 | 生产环境使用模型进行预测 | [Inference-in-nutshell.md](./Deployment_Inference/Inference-in-nutshell.md) |
| RAG 系统 | 检索增强生成，访问私有知识 | [RAG-in-nutshell.md](./RAG_Systems/RAG-in-nutshell.md) |
| AI 技能 | 构建智能体的可复用能力 | [Skills-in-nutshell.md](./AI_Skills/Skills-in-nutshell.md) |
| AI 工作流 | 编排生产级自动化流水线 | [Workflow-in-nutshell.md](./AI_Workflow/Workflow-in-nutshell.md) |
| **AI 测试** | 测试、评估和验证 AI 系统 | [AI-Testing-in-nutshell.md](./AI_Testing/AI-Testing-in-nutshell.md) |
| **AI 网关** | 企业 AI 统一入口，智能路由 | [Gateway-in-nutshell.md](./AI_Gateway/Gateway-in-nutshell.md) |
| **AI Ops** | 智能监控、异常检测、自愈 | [AIOps-in-nutshell.md](./AI_Ops/AIOps-in-nutshell.md) |
| **云产品运维** | 云产品运维 Agent 架构 | [CloudOps-in-nutshell.md](./Cloud_Product_Ops/CloudOps-in-nutshell.md) |

---

## 内容索引 (Content Index)

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 模型部署与推理 (Deployment & Inference) | 进阶 | vLLM、TensorRT、量化技术（AWQ/GPTQ），优化推理性能 | [Deployment_Inference.md](./Deployment_Inference/Deployment_Inference.md) |
| RAG 系统 (RAG Systems) | 实战 | 向量数据库、混合检索、重排序，构建知识增强应用 | [RAG_Systems.md](./RAG_Systems/RAG_Systems.md) |
| MLOps 流水线 (MLOps Pipeline) | 实战 | 实验跟踪、模型注册、CI/CD、监控告警，自动化 ML 工作流 | [MLOps_Pipeline/](./MLOps_Pipeline/) |
| 模型评估 (Model Evaluation) | 进阶 | 离线指标、在线 A/B 测试、LLM 评估（MT-Bench/AlpacaEval） | [Model_Evaluation/](./Model_Evaluation/) |
| 模型训练 (Model Training) | 实战 | 训练循环、超参数、监控、检查点管理 | [Model_Training/](./Model_Training/) |
| AI 技能 (AI Skills) | 实战 | 构建智能体的可复用能力模块 | [AI_Skills/](./AI_Skills/) |
| AI 工作流 (AI Workflow) | 实战 | 流水线编排、错误处理、监控告警 | [AI_Workflow/](./AI_Workflow/) |
| AI 测试 (AI Testing) | 实战 | 测试、评估和验证 AI 系统，确保生产环境可靠性 | [AI_Testing/](./AI_Testing/) |
| **OpenClaw 生态系统** (OpenClaw Ecosystem) | 实战 | AI Agent 框架、技能市场、桌面控制，构建自主行动的 AI 助手 | [OpenClaw_Ecosystem/](./OpenClaw_Ecosystem/) |
| Agent 生产部署 (Agent Production) | 实战 | 企业级Agent架构、K8s部署、监控、CI/CD最佳实践 | [Agent_Production/](./Agent_Production/) |
| RAG高级实践 2026 (RAG Advanced) | 进阶 | 混合检索、重排序、Agentic RAG、上下文压缩 | [RAG_Advanced_2026/](./RAG_Advanced_2026/) |
| AI编程助手 2026 (AI Coding Assistants) | 实战 | Cursor/Claude Code/Windsurf/Devin对比选型 | [AI_Coding_Assistants/](./AI_Coding_Assistants/) |
| **Vibe Coding 方法论 2026** (Vibe Coding) | 实战 | 自然语言驱动开发方法论、DGRV循环、生产环境实践、提示工程体系 | [Vibe_Coding/](./Vibe_Coding/) |
| **AI 网关 2026** (AI Gateway) | 实战 | 企业级AI统一入口、智能路由、安全管控、成本优化、多租户支持 | [AI_Gateway_2026.md](./AI_Gateway/AI_Gateway_2026.md) |
| **AI Ops 2026** (AI Ops) | 进阶 | 智能监控、异常检测、根因分析、自动修复、容量规划 | [AI_Ops_2026.md](./AI_Ops/AI_Ops_2026.md) |
| **云产品运维 2026** (Cloud Product Ops) | 实战 | 云产品运维Agent架构、工具系统、安全权限管理、生产部署 | [Cloud_Product_Ops_2026.md](./Cloud_Product_Ops/Cloud_Product_Ops_2026.md) |

## 前置知识 (Prerequisites)

- **必修**: [神经网络核心](../03_Deep_Learning/Neural_Network_Core/Neural_Network_Core.md)（理解模型结构）
- **必修**: [大语言模型架构](../04_NLP_LLMs/LLM_Architectures/LLM_Architectures.md)（部署 LLM）
- **推荐**: [分布式系统](../01_Fundamentals/Distributed_Systems/Distributed_Systems.md)（分布式推理）
- **推荐**: [Transformer 革命](../04_NLP_LLMs/Transformer_Revolution/Transformer_Revolution.md)（理解 RAG 中的编码器）

## 关键术语速查 (Key Terms)

- **推理加速 (Inference Optimization)**: 通过量化、剪枝、蒸馏提升模型推理速度
- **量化 (Quantization)**: 降低模型精度（FP16/INT8）减少显存和延迟
- **vLLM**: 高性能 LLM 推理引擎，支持连续批处理和 PagedAttention
- **TensorRT**: NVIDIA 推理优化库，深度优化 GPU 计算
- **RAG (Retrieval-Augmented Generation)**: 检索外部知识增强生成，缓解幻觉问题
- **向量数据库 (Vector Database)**: 存储和检索高维嵌入向量（Milvus/Qdrant）
- **重排序 (Reranking)**: 对初步检索结果精细排序，提升召回质量
- **MLOps**: 机器学习运维，覆盖训练、部署、监控全生命周期
- **Feature Store**: 特征存储系统，统一管理训练和推理特征
- **模型漂移 (Model Drift)**: 生产环境数据分布变化导致性能下降
- **AI Agent**: 能够自主执行任务的 AI 系统，不只是对话而是实际行动
- **OpenClaw**: 开源 AI Agent 框架，支持多平台控制和技能扩展
- **Skills (技能)**: AI Agent 的可扩展能力模块，通过 ClawHub 市场分发
- **Computer Use**: AI 直接操控用户电脑的能力，包括文件管理、应用控制
- **Vibe Coding**: 自然语言驱动AI生成代码的开发范式，开发者从"编码者"转变为"架构师+审计师"
- **DGRV循环**: Describe(描述)→Generate(生成)→Review(审查)→Verify(验证)的迭代开发流程
- **规则文件**: .cursorrules/AGENTS.md等配置文件，为AI提供项目级持久化上下文

---
*Last updated: 2026-04-11*
