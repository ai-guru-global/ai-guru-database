---
title: "CNCF 与大模型产品导入路线图"
category: "92-plan"
tags: ["roadmap", "cncf", "llm", "product-import", "knowledge-base", "planning"]
summary: "> **一句话理解**: 本路线图规划如何将 CNCF 云原生生态与大模型相关核心产品/项目按批次导入 AI Guru 知识库，含分类体系、候选清单、优先级、导入 SOP 与验收标准。"
created: "2026-06-16"
updated: "2026-06-16"
---

# CNCF 与大模型产品导入路线图

> **一句话理解**: 本路线图规划如何将 CNCF 云原生生态与大模型相关核心产品/项目按批次导入 AI Guru 知识库，含分类体系、候选清单、优先级、导入 SOP 与验收标准。

---

## 目录

1. [目标与范围](#1-目标与范围)
2. [分类体系](#2-分类体系)
3. [CNCF 项目候选清单](#3-cncf-项目候选清单)
4. [大模型产品候选清单](#4-大模型产品候选清单)
5. [导入批次与优先级](#5-导入批次与优先级)
6. [标准化导入流程 (SOP)](#6-标准化导入流程-sop)
7. [文档模板与命名规范](#7-文档模板与命名规范)
8. [验收标准](#8-验收标准)
9. [进度跟踪](#9-进度跟踪)
10. [相关资源](#10-相关资源)

---

## 1. 目标与范围

### 1.1 目标

- 系统性补齐 AI Guru 知识库在 **CNCF 云原生 AI 基础设施** 与 **大模型生态产品** 方面的覆盖。
- 建立可复用的产品导入 SOP，使后续新增项目能按统一标准快速落地。
- 与已有章节（部署推理、训练、RAG、Agent、MLOps、架构基础设施）形成交叉引用网络。

### 1.2 范围

- **CNCF 项目**：从 CNCF Landscape / CNAI Landscape 中筛选与 AI/LLM 强相关的项目。
- **大模型产品**：开源推理引擎、训练框架、模型服务、向量数据库、Agent 框架、评估工具、云平台等。
- **不包含**：纯应用层产品（如某个具体的 AI 应用）、非技术类商业产品。

---

## 2. 分类体系

所有待导入产品按以下四个维度分类：

| 维度 | 说明 | 示例 |
|------|------|------|
| **生命周期阶段** | 训练 / 推理 / 部署 / 运维 / 安全 | Kubeflow / vLLM / BentoML / Prometheus |
| **技术层次** | 运行时 / 编排 / 调度 / 网关 / 可观测 | containerd / Kubernetes / HAMi / Envoy / Grafana |
| **厂商/归属** | CNCF / 云厂商 / 开源社区 / 商业产品 | HAMi（CNCF）/ TGI（HuggingFace）/ KServe / 阿里云 AI Stack |
| **与 LLM 相关性** | 核心 / 支撑 / 可选 | vLLM（核心）/ Helm（支撑） |

---

## 3. CNCF 项目候选清单

### 3.1 云原生基础层

| 项目 | 定位 | 建议位置 | 优先级 |
|------|------|----------|--------|
| **containerd** | 容器运行时 | `_concepts/containerd.md` + `12_Architecture_Infrastructure/` | P2 |
| **CRI-O** | 容器运行时 | `_concepts/cri-o.md` | P2 |
| **Kubernetes** | 编排平台 | `01_Fundamentals/` 或 `12_Architecture_Infrastructure/` | P1 |
| **K3s** | 轻量 K8s 发行版 | `12_Architecture_Infrastructure/` | P2 |
| **Helm** | 包管理 | `11_MLOps_Pipeline/` | P1 |
| **etcd** | 分布式配置存储 | `12_Architecture_Infrastructure/` | P2 |

### 3.2 AI/ML 工作负载

| 项目 | 定位 | 建议位置 | 优先级 |
|------|------|----------|--------|
| **Kubeflow** | ML 工作流平台 | `11_MLOps_Pipeline/` | P1 |
| **KServe** | 模型服务 | `10_Deployment_Inference/` | P1 |
| **Ray / KubeRay** | 分布式 AI 框架 | `07_Model_Training/` / `10_Deployment_Inference/` | P1 |
| **Volcano** | 批处理调度器 | `12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/` | P1 |
| **Kueue** | 作业排队/配额 | `12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/` | P1 |
| **HAMi** | 异构 GPU 虚拟化 | `12_Architecture_Infrastructure/` ✅ 已完成 | — |
| **KAI Scheduler** | 万卡级 GPU 调度 | `12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/` ✅ 已存在 |

### 3.3 可观测与网关

| 项目 | 定位 | 建议位置 | 优先级 |
|------|------|----------|--------|
| **Prometheus** | 监控/告警 | `11_MLOps_Pipeline/` / `13_AI_Ops/` | P1 |
| **Grafana** | 可视化 | `11_MLOps_Pipeline/` / `13_AI_Ops/` | P1 |
| **OpenTelemetry** | 可观测标准 | `13_AI_Ops/` | P1 |
| **Jaeger** | 分布式追踪 | `13_AI_Ops/` | P2 |
| **Envoy** | 服务代理 / AI Gateway | `12_Architecture_Infrastructure/AI_Gateway/` | P1 |
| **Istio** | 服务网格 | `12_Architecture_Infrastructure/AI_Gateway/` | P2 |

### 3.4 安全与策略

| 项目 | 定位 | 建议位置 | 优先级 |
|------|------|----------|--------|
| **OPA** | 策略引擎 | `17_Ethics_Safety/` | P2 |
| **Kyverno** | K8s 策略管理 | `17_Ethics_Safety/` | P2 |
| **Falco** | 运行时安全 | `17_Ethics_Safety/` | P2 |

### 3.5 新兴/AI 原生

| 项目 | 定位 | 建议位置 | 优先级 |
|------|------|----------|--------|
| **CDI** | 容器设备接口 | `_concepts/cdi.md` ✅ 已存在 |
| **DRA** | 动态资源分配 | `_concepts/dra.md` ✅ 已存在 |
| **NVIDIA GPU Operator** | GPU 全栈运维 | `_concepts/gpu-operator.md` ✅ 已存在 |
| **RunAI** | 商业 GPU 调度 | `12_Architecture_Infrastructure/` | P2 |

---

## 4. 大模型产品候选清单

### 4.1 推理引擎

| 产品 | 定位 | 建议位置 | 优先级 | 状态 |
|------|------|----------|--------|------|
| **vLLM** | 高吞吐 LLM 推理 | `10_Deployment_Inference/` ✅ 已存在 |
| **TGI (Text Generation Inference)** | HuggingFace 推理服务 | `10_Deployment_Inference/` | P1 | 待创建 |
| **TensorRT-LLM** | NVIDIA 推理优化 | `10_Deployment_Inference/` | P1 | 待创建 |
| **SGLang** | 结构化生成推理 | `10_Deployment_Inference/` | P2 | 待创建 |
| **LMDeploy** | 多后端推理服务 | `10_Deployment_Inference/` | P2 | 待创建 |
| **llama.cpp** | 边缘/本地推理 | `10_Deployment_Inference/` | P2 | 待创建 |
| **DeepSpeed-Inference** | 微软分布式推理 | `10_Deployment_Inference/` | P2 | 待创建 |

### 4.2 模型服务与部署平台

| 产品 | 定位 | 建议位置 | 优先级 | 状态 |
|------|------|----------|--------|------|
| **KServe** | K8s 标准化推理平台 | `10_Deployment_Inference/` | P1 | 待创建 |
| **BentoML** | 模型服务框架 | `10_Deployment_Inference/` ✅ 已存在 |
| **Triton Inference Server** | NVIDIA 推理服务 | `10_Deployment_Inference/` | P2 | 待创建 |
| **Modal** | 无服务器 GPU 平台 | `10_Deployment_Inference/` | P2 | 待创建 |
| **Replicate** | 模型托管与 API | `10_Deployment_Inference/` | P2 | 待创建 |
| **Fireworks AI** | 快速推理 API | `10_Deployment_Inference/` ✅ 已存在 |

### 4.3 训练框架与工具

| 产品 | 定位 | 建议位置 | 优先级 | 状态 |
|------|------|----------|--------|------|
| **DeepSpeed** | 微软分布式训练 | `07_Model_Training/` | P1 | 待创建 |
| **Megatron-LM** | NVIDIA 大规模训练 | `07_Model_Training/` | P1 | 待创建 |
| **FSDP** | PyTorch 完全分片数据并行 | `07_Model_Training/` | P1 | 待创建 |
| **Colossal-AI** | 统一训练/推理/部署 | `07_Model_Training/` | P2 | 待创建 |
| **Unsloth** | 高效微调 | `07_Model_Training/` | P2 | 待创建 |
| **TRL** | Transformers 强化学习 | `07_Model_Training/` | P2 | 待创建 |
| **OpenRLHF** | 开源 RLHF 框架 | `07_Model_Training/` | P2 | 待创建 |
| **LLaMA-Factory** | 一站式微调 | `07_Model_Training/` | P2 | 待创建 |

### 4.4 RAG 与向量数据库

| 产品 | 定位 | 建议位置 | 优先级 | 状态 |
|------|------|----------|--------|------|
| **Chroma** | 向量数据库 | `14_RAG_Systems/` ✅ 已存在 |
| **Milvus/Zilliz** | 分布式向量数据库 | `14_RAG_Systems/` | P1 | 待创建 |
| **Weaviate** | 向量搜索引擎 | `14_RAG_Systems/` | P2 | 待创建 |
| **Qdrant** | 高性能向量数据库 | `14_RAG_Systems/` | P2 | 待创建 |
| **pgvector** | Postgres 向量扩展 | `14_RAG_Systems/` | P2 | 待创建 |
| **Pinecone** | 托管向量数据库 | `14_RAG_Systems/` | P2 | 待创建 |

### 4.5 Agent 与工具编排

| 产品 | 定位 | 建议位置 | 优先级 | 状态 |
|------|------|----------|--------|------|
| **LangChain** | LLM 应用框架 | `15_Agent_Production/` | P1 | 待创建 |
| **LlamaIndex** | RAG/Agent 数据框架 | `15_Agent_Production/` | P1 | 待创建 |
| **AutoGen** | 多 Agent 对话框架 | `15_Agent_Production/` | P1 | 待创建 |
| **CrewAI** | 角色扮演 Agent 团队 | `15_Agent_Production/` | P2 | 待创建 |
| **MCP (Model Context Protocol)** | 模型上下文协议 | `15_Agent_Production/` ✅ 已存在 |

### 4.6 评估与基准

| 产品 | 定位 | 建议位置 | 优先级 | 状态 |
|------|------|----------|--------|------|
| **LM Evaluation Harness** | EleutherAI 评测框架 | `08_Model_Evaluation/` | P1 | 待创建 |
| **OpenCompass** | 司南评测平台 | `08_Model_Evaluation/` | P1 | 待创建 |
| **HELM** | 斯坦福全面评测 | `08_Model_Evaluation/` | P2 | 待创建 |

### 4.7 模型仓库与数据工程

| 产品 | 定位 | 建议位置 | 优先级 | 状态 |
|------|------|----------|--------|------|
| **HuggingFace Hub** | 模型/数据集仓库 | `11_MLOps_Pipeline/` | P1 | 待创建 |
| **ModelScope** | 魔搭社区 | `11_MLOps_Pipeline/` | P2 | 待创建 |
| **Safetensors** | 安全模型格式 | `11_MLOps_Pipeline/` ✅ 已存在 |
| **HuggingFace Datasets** | 数据集工具 | `07_Model_Training/LLM_Data_Engineering/` | P2 | 待创建 |

### 4.8 云厂商 AI 平台

| 产品 | 定位 | 建议位置 | 优先级 | 状态 |
|------|------|----------|--------|------|
| **阿里云 AI Stack** | 政企私有化推理一体机 | `12_Architecture_Infrastructure/` ✅ 已存在 |
| **AWS Bedrock** | 托管基础模型服务 | `12_Architecture_Infrastructure/` | P1 | 待创建 |
| **Azure OpenAI** | 企业级 OpenAI 服务 | `12_Architecture_Infrastructure/` | P1 | 待创建 |
| **Google Vertex AI** | GCP 统一 AI 平台 | `12_Architecture_Infrastructure/` | P1 | 待创建 |
| **火山引擎方舟** | 字节跳动大模型平台 | `12_Architecture_Infrastructure/` | P2 | 待创建 |
| **百度千帆** | 企业级大模型平台 | `12_Architecture_Infrastructure/` | P2 | 待创建 |

---

## 5. 导入批次与优先级

### 第一批（P1，立即执行）

> 补齐当前知识库中最明显的缺口，与已有内容形成互补。

1. **KServe** — K8s 标准化模型服务
2. **TGI** — HuggingFace 推理引擎
3. **Ray / KubeRay** — 分布式 AI 框架
4. **DeepSpeed** — 分布式训练
5. **Prometheus + Grafana** — 监控可观测基座

### 第二批（P1-P2，短期）

1. **TensorRT-LLM** / **SGLang** / **LMDeploy**
2. **Milvus** / **Qdrant** / **Weaviate**
3. **LangChain** / **LlamaIndex** / **AutoGen**
4. **Kubeflow** / **Volcano** / **Kueue**
5. **LM Evaluation Harness** / **OpenCompass**

### 第三批（P2，中期）

1. **containerd / CRI-O / Helm / etcd** 概念卡片
2. **OPA / Kyverno / Falco** 安全策略
3. **AWS Bedrock / Azure OpenAI / Google Vertex AI**
4. **Megatron-LM / FSDP / Colossal-AI**
5. **Triton / Modal / Replicate**

---

## 6. 标准化导入流程 (SOP)

对每个产品/项目执行以下步骤：

### 6.1 信息收集

- 官方网站与文档
- GitHub 仓库（README、release notes、issues）
- CNCF Landscape / CNAI Landscape 页面
- 权威博客、论文、案例研究

### 6.2 内容蒸馏

每篇深度文档至少包含：

- **一句话定义**：用通俗语言说明是什么。
- **核心架构图**：ASCII 图或 Mermaid 图。
- **关键特性对比**：与同类产品的差异。
- **快速开始**：最小可运行示例。
- **与 LLM/AI 场景的结合**：为什么对大模型有用。
- **最佳实践**：生产环境注意事项。
- **常见问题**：≥5 条 FAQ 或排错项。

### 6.3 文档生成

| 文档类型 | 命名格式 | 位置 |
|----------|----------|------|
| 深度文档 | `{Topic}_Deep_Dive.md` | 最相关章节 |
| 入门文档 | `{Topic}_for_dummy.md` | 最相关章节 |
| 概念卡片 | `{kebab-case}.md` | `_concepts/` |
| 运维/排错 | `{Topic}_Operation_Guide.md` / `{Topic}_Troubleshooting_Guide.md` | 对应章节 |

### 6.4 交叉链接

- 关联到相关概念卡片（`_concepts/`）。
- 关联到相关章节深度文档。
- 在 `_synthesis/` 下创建跨域综合文档（如需要）。

### 6.5 质量检查

- [ ] Frontmatter 完整（title, category, tags, summary, created, updated）。
- [ ] Wikilink 有效，无死链。
- [ ] 运行 `_tools/check_links.py`（如适用）。
- [ ] 字数达标（Deep Dive ≥ 8KB，for dummy ≥ 4KB，concept ≥ 3KB）。
- [ ] 图片/代码块可正常渲染。

### 6.6 索引更新

- 更新章节目录 `README.md`。
- 更新根目录 `index.md`。
- 必要时更新 `ROADMAP.md`。

---

## 7. 文档模板与命名规范

### 7.1 Frontmatter 模板

```yaml
---
title: "{Topic} 深度解析"
category: "92-plan"
tags: ["{tag1}", "{tag2}", "{tag3}"]
summary: "> **一句话理解**: {一句话描述}"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
---
```

### 7.2 命名示例

| 产品 | 深度文档 | 入门文档 | 概念卡片 |
|------|---------|---------|---------|
| KServe | `10_Deployment_Inference/Inference_Engines/KServe_Deep_Dive.md` | `10_Deployment_Inference/KServe_for_dummy.md` | `_concepts/kserve.md` |
| Ray | `07_Model_Training/Distributed_Training/Ray_Deep_Dive.md` | `07_Model_Training/Ray_for_dummy.md` | `_concepts/ray.md` |
| Prometheus | `13_AI_Ops/Prometheus_Deep_Dive.md` | `13_AI_Ops/Prometheus_for_dummy.md` | `_concepts/prometheus.md` |

---

## 8. 验收标准

- [ ] 第一批 P1 产品（KServe/TGI/Ray/DeepSpeed/Prometheus）文档完成并入库。
- [ ] 每个新产品至少有 1 个概念卡片 + 1 个深度文档。
- [ ] 所有新文档与现有内容实现双向链接。
- [ ] 章节目录 `README.md` 与根目录 `index.md` 同步更新。
- [ ] 链接检查脚本无报错。
- [ ] 每个深度文档包含 ≥5 条 FAQ 或排错项。

---

## 9. 进度跟踪

| 批次 | 产品 | 状态 | 负责人 | 完成日期 |
|------|------|------|--------|----------|
| 第一批 | KServe | 待创建 | — | — |
| 第一批 | TGI | 待创建 | — | — |
| 第一批 | Ray / KubeRay | 待创建 | — | — |
| 第一批 | DeepSpeed | 待创建 | — | — |
| 第一批 | Prometheus + Grafana | 待创建 | — | — |
| 已落地 | HAMi | ✅ 已完成 | AI Agent | 2026-06-16 |

---

## 10. 相关资源

- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/README]] — CNCF 云原生大模型项目全景
- [[12_Architecture_Infrastructure/HAMi_Deep_Dive]] — HAMi 深度解析（导入范例）
- [[_meta/_directory-conventions]] — 目录结构与命名规范
- [[_meta/_content-gap-analysis]] — 内容缺口分析
- [[ROADMAP]] — 年度路线图
