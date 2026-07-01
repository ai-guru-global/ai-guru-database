---
title: "阿里云专有云 K8s 工单智能体语料建设规划"
category: 18-cloud-ops-agent-docs-corpus
tags: ["cloud-ops", "kubernetes", "alibaba-cloud", "proprietary-cloud", "corpus", "k8s-agent", "work-order"]
summary: "> 本规划把当前知识库从『AI on K8s / CNCF 云原生大模型』能力，补齐到『通用 K8s 运维 + 阿里云专有云 K8s 工单处理』能力，支撑可正式输出的工单智能体语料。"
created: 2026-06-26
updated: 2026-06-26
tier: core
---

> **执行状态**: 2026-06-26 已完成首轮补齐（通用 K8s）、第二轮 AI-First 补齐和第三轮领域知识深化。累计新增概念页 90+、专题深度页/Runbook/Cheat Sheet 25+；仓库总断链从 578 降至 503；断链检查中由新增内容引入的缺失概念已清零。

# 阿里云专有云 K8s 工单智能体语料建设规划

> **目标**：补齐支撑「阿里云专有云 K8s 工单智能体」的语料。项目主航道是 **大模型训练/推理/部署/运维**；K8s / 云原生是运行上下文，不是独立目标。语料应优先覆盖 AI/LLM 工作负载在 K8s 上的故障、部署、调度、可观测与 MLOps/LLMOps 场景。
> **范围**：以 AI/LLM 训练、推理、MLOps/LLMOps、RAG 等领域知识为主；K8s 仅作为运行上下文补充；云厂商内容仅聚焦 **阿里云专有云 / AI Stack / PAI** 的概念与集成关系，不写入具体产品操作文档（内部语料覆盖）。
> **产出**：AI 训练/推理故障 Runbook、模型部署与回滚指南、推理可观测性/SLO 专题、MLOps 排障手册、国产芯片推理落地页、阿里云 AI Stack/PAI 上下文、AI 基础设施领域知识（网络/存储/安全/事故响应/混沌工程/成本治理）、实战命令速查表与诊断工作流。

---

## 一、背景与结论

当前仓库在以下方向已非常强：
- CNCF 云原生大模型项目全景（KServe / KAITO / Volcano / Kueue / kagent / K8sGPT 等 20 个项目）
- kagent：K8s 原生 DevOps Agent 框架
- 容器运行时与 CRI（containerd / nerdctl / crictl / CDI / DRA）
- AI Stack 软硬一体机的 K8s 运维命令
- GPU / 国产芯片 / AI 基础设施

但面向「阿里云专有云 K8s 工单智能体」，仍有以下缺口：
1. **K8s 核心资源概念缺失**：没有 Pod / Deployment / Service / Ingress / ConfigMap / Secret / StatefulSet / DaemonSet / HPA / NetworkPolicy / PVC 等原子概念页。
2. **K8s 控制平面组件讲解不足**：kube-apiserver / scheduler / controller-manager / kubelet / kube-proxy / etcd 深度不够。
3. **K8s 网络与存储专题缺失**：CNI、Service、DNS、Ingress、CSI、PV/PVC、StatefulSet 等。
4. **通用 K8s 运维排障体系缺失**：Pending / CrashLoopBackOff / ImagePullBackOff / OOMKilled / 节点 NotReady 等系统级排障。
5. **可观测、安全、GitOps、Service Mesh 生态不完整**。
6. **阿里云专有云上下文不足**：专有云产品形态（Apsara Stack）、飞天底座、ACK 专有版 / 敏捷版、ASCM / 天基 / 女娲 / 盘古等运维体系与 K8s 的对应关系。

---

## 二、执行原则

1. **以 Agent 语料可用性为第一目标**：每篇文档都要能被转化为 instruction-following、tool-calling、few-shot、评估用例。
2. **聚焦阿里云专有云**：涉及云厂商时，优先使用阿里云专有云术语（ASCM、天基、ACK 专有版/敏捷版、神龙、洛神、盘古、女娲等），避免 AWS/GCP/Azure 细节。
3. **保持现有风格**：frontmatter 完整、一句话理解、核心要点、代码块、表格、Related 双向链接。
4. **最小破坏现有结构**：新内容优先放入 `_concepts/` 和 `12_Architecture_Infrastructure/` 及 `13_AI_Ops/`，必要时新建子目录。
5. **可验证**：每批内容产出后运行 `_tools/check_links.py` 与 frontmatter 校验。

---

## 三、任务清单与优先级

### 🔴 P0 — 必须补齐（直接影响 Agent 基础能力）

| # | 任务 | 目标位置 | 说明 |
|---|------|---------|------|
| 1 | K8s 核心资源概念页 | `_concepts/` | Pod、Deployment、Service、Ingress、ConfigMap、Secret、StatefulSet、DaemonSet、Job、CronJob、ReplicaSet |
| 2 | K8s 调度与资源控制概念页 | `_concepts/` | Node、Namespace、Label/Selector/Annotation、Taint/Toleration/Affinity、HPA、VPA、PDB、ResourceQuota、LimitRange |
| 3 | K8s 身份与网络概念页 | `_concepts/` | ServiceAccount、Role/ClusterRole、RoleBinding、NetworkPolicy、CNI |
| 4 | K8s 网络专题 | `12_Architecture_Infrastructure/` | CNI 对比、Service 与 DNS、Ingress、NetworkPolicy |
| 5 | K8s 存储专题 | `12_Architecture_Infrastructure/` | PV/PVC/StorageClass、CSI、StatefulSet 有状态服务 |
| 6 | K8s 核心组件专题 | `12_Architecture_Infrastructure/` | 控制平面与节点组件深度解析 |

### 🟡 P1 — 重点补齐（提升语料覆盖度）

| # | 任务 | 目标位置 | 说明 |
|---|------|---------|------|
| 7 | K8s 运维排障 Playbook | `13_AI_Ops/` | Pod/节点/网络/存储/调度问题系统排查 |
| 8 | K8s 可观测性栈 | `_concepts/` + `12_Architecture_Infrastructure/` | Loki、Jaeger/Tempo、OpenTelemetry、Fluent Bit |
| 9 | K8s 安全加固 | `_concepts/` + `12_Architecture_Infrastructure/` | Pod Security、cert-manager、Trivy、镜像扫描、Secrets 管理 |
| 10 | GitOps / CI/CD | `_concepts/` | Flux、Tekton、Argo Rollouts、Backstage |
| 11 | Service Mesh | `_concepts/` + `12_Architecture_Infrastructure/` | Istio、Linkerd、Gateway API |

### 🟢 P2 — 增强补齐（按需）

| # | 任务 | 目标位置 | 说明 |
|---|------|---------|------|
| 12 | 多集群 / 边缘 K8s | `_concepts/` | Karmada、K3s、OpenClusterManagement |
| 13 | 阿里云专有云 K8s 上下文 | `12_Architecture_Infrastructure/` 或 `_projects/Cloud_Ops_Agent/` | 专有云产品形态、ACK 专有版/敏捷版、ASCM / 天基运维体系 |
| 14 | K8s 面试题扩充 | `21_Interviews/` | 增加 K8s 专项题库 |

---

## 四、内容标准

每篇新增文档必须包含：
- **frontmatter**：title、category、tags、summary、created、updated、tier
- **一句话理解**：blockquote 形式
- **核心要点**：3-7 条 bullet
- **至少一个代码块或 YAML 示例**
- **至少一张表格**（对比、选型、命令速查）
- **阿里云专有云关联**（如适用）：说明在专有云中的对应产品/术语
- **Related 双向链接**：指向相关 `_concepts/` 和章节文档

概念页额外要求：
- `aliases`：2-4 个常见别名
- `relationships`：3-5 条相关概念双向引用
- 正文 2-5 KB

---

## 五、验收标准

1. 全部 P0 概念页创建完成，且被至少一个上层文档引用。
2. 新增内容 frontmatter 100% 合规，无坏链。
3. 至少产出一份《阿里云专有云 K8s 工单处理场景映射》。
4. 至少产出一份《K8s 运维排障 Playbook》。
5. `_tools/check_links.py` 通过（断链率 < 2%）。

---

---

## 六、第二轮（AI-First Pivot）—— 当前执行重点

> 用户反馈：AI Guru 核心是大模型训练/推理，K8s 只是运行上下文。本轮补齐应 **AI/LLM 优先**，K8s 仅作为故障定位的载体。

### 当前强项（无需重复）

- LLM 训练基础、PEFT、对齐（RLHF/DPO/GRPO）
- 分布式训练框架（DeepSpeed / FSDP / Megatron / Ray / Swift）
- 推理引擎百科（vLLM / SGLang / TGI / TensorRT-LLM / llama.cpp 等）
- 推理优化概念（KV Cache / PagedAttention / Continuous Batching / Speculative Decoding / Quantization）
- MLOps/LLMOps 工具链（MLflow / Kubeflow / Airflow / DVC / Feast 等）

### 本轮缺口（P0）

| # | 任务 | 目标位置 | 说明 |
|---|------|---------|------|
| 1 | LLM 训练失败 Runbook（K8s 运行上下文） | `07_Model_Training/Monitoring/` | 把训练失败模式（NaN、NCCL、OOM、数据格式）与 K8s Pod 事件/日志结合 | ✅ |
| 2 | 分布式训练 Hang 排障 | `07_Model_Training/Distributed_Training/` | NCCL/RDMA/InfiniBand/NVLink 诊断流程 | ✅ |
| 3 | GPU OOM 排障指南 | `13_AI_Ops/SRE_Reliability/` | 区分 host OOM / container OOM / CUDA OOM / HAMi vGPU oversell | ✅ |
| 4 | LLM 推理延迟/不可用 Runbook | `13_AI_Ops/SRE_Reliability/` | TTFT/TPOT、KServe、Ingress、GPU 利用率、ACK/SLB 联动 | ✅ |
| 5 | 模型热加载失败 / 回滚 Playbook | `10_Deployment_Inference/` 或 `11_MLOps_Pipeline/` | weight/tokenizer/LoRA/quant-config 一致性检查与回滚 | ✅ |
| 6 | RAG 检索延迟优化 | `14_RAG_Systems/` | HNSW/IVF、hybrid search、reranker 成本、向量索引调参 | ✅ |
| 7 | MLOps 排障 Runbook | `11_MLOps_Pipeline/Troubleshooting/` | MLflow tracking 不可达、数据验证失败、模型版本回滚 | ✅ |

### 本轮缺口（P1）

| # | 任务 | 目标位置 | 说明 |
|---|------|---------|------|
| 8 | AI 诊断概念页 | `_concepts/` | `nccl`、`infiniBand`、`nvlink`、`gpu-oom`、`gradient-checkpointing`、`tensor-parallelism`、`model-rollback`、`retrieval-latency`、`hnsw`、`bm25` 等 | ✅ |
| 9 | 国产芯片推理落地页 | `10_Deployment_Inference/Hardware/` | 昇腾 NPU、寒武纪/海光/摩尔线程推理栈与 HAMi 集成 | ✅ |
| 10 | 阿里云 PAI / AI Stack 上下文 | `12_Architecture_Infrastructure/Cloud_Providers/` | PAI-DSW / DLC / EAS 与 ACK/专有云关系 | ✅ |
| 11 | 推理可观测性与 SLO | `11_MLOps_Pipeline/Observability/` | TTFT/TPOT/QPS/KV Cache 指标与 Prometheus/Grafana 集成 | ✅ |

### 本轮执行原则补充

- 每篇 Runbook 必须包含：**现象 → K8s/运行层信号 → 根因判断 → 命令/操作 → 修复/回滚**。
- 优先使用现有 Deep Dive 的双向链接，不重复复制原理内容。
- 阿里云内容只写 PAI、AI Stack、ACK 专有/敏捷版、ASCM、天基，不写 AWS/Azure/GCP。

---

## 七、相关文档

- [语料工程指南](./index.md) — 语料设计、Prompt、SFT/RLHF、评估数据
- [云产品运维 Agent 体系](../../Cloud_Product_Ops_2026.md) — Cloud Ops Agent 总体架构
- [kagent 深度解析](../../../12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/kagent_Deep_Dive.md) — K8s 原生 Agent 框架
- [AI Stack K8s 编排指南](../../../12_Architecture_Infrastructure/AI_Stack/AI_Stack_K8s_Operations_Guide.md) — 现有 K8s 运维命令

## Related

- [[18_Cloud_Ops_Agent/docs/corpus/index]] — 语料工程总指南
- [[18_Cloud_Ops_Agent/Cloud_Product_Ops_2026]] — 云产品运维 Agent 体系
- [[12_Architecture_Infrastructure/CNCF_Cloud_Native_AI/kagent_Deep_Dive]] — kagent K8s Agent 框架
- [[12_Architecture_Infrastructure/AI_Stack/AI_Stack_K8s_Operations_Guide]] — AI Stack K8s 运维
- [[_concepts/kubernetes]] — Kubernetes 概念
