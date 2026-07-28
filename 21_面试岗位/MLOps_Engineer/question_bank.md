---
title: MLOps Engineer 题库
category: 21-interviews-mlops-engineer
tags: ["interviews", "career", "mlops", "ci-cd", "model-pipeline", "model-registry", "monitoring", "deployment", "llmops"]
summary: "MLOps Engineer 题库，覆盖 ML 流水线、CI/CD、模型注册、部署、监控、实验追踪与 LLMOps，含难度与频率标注。"
created: 2026-07-23
updated: 2026-07-23
tier: supporting
sources: []
name_zh: "MLOps Engineer 题库"
---

# MLOps Engineer 题库

> 中文简称：MLOps Engineer 题库

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

---

## MLOps 基础与成熟度 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | Google MLOps 成熟度 Level 0/1/2 的区别？如何升级？ | ⭐⭐ | 🔴 |
| 2 | MLOps 和 DevOps 的核心区别？为什么 ML 需要 Ops？ | ⭐⭐ | 🔴 |
| 3 | MLOps 的核心组件（数据/模型/流水线/服务/监控）如何协同？ | ⭐⭐ | 🔴 |
| 4 | 解释 Continuous Training (CT) 与 CI/CD 的关系？ | ⭐⭐ | 🟡 |
| 5 | Feature Store / Model Registry / Experiment Tracking 各自职责？ | ⭐⭐ | 🟡 |
| 6 | LLMOps 与传统 MLOps 的关键差异？ | ⭐⭐⭐ | 🔴 |
| 7 | MLOps 平台选型：自建 vs 全托管（Vertex/SageMaker）？ | ⭐⭐ | 🟡 |
| 8 | 如何度量 MLOps 平台的成熟度和 ROI？ | ⭐⭐⭐ | 🟢 |

---

## 实验管理与模型注册 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 9 | MLflow / W&B / Comet 的对比和选型？ | ⭐⭐ | 🔴 |
| 10 | 实验追踪应该记录什么（参数/指标/模型/数据版本/环境）？ | ⭐⭐ | 🟡 |
| 11 | Model Registry 如何管理模型生命周期（staging/prod/archived）？ | ⭐⭐ | 🔴 |
| 12 | 模型版本化与数据版本化的协同（DVC）？ | ⭐⭐⭐ | 🟡 |
| 13 | 如何做模型的血缘追踪（数据→训练→模型→部署）？ | ⭐⭐⭐ | 🟡 |
| 14 | 模型审批和发布流程（多人协作/审计）如何设计？ | ⭐⭐ | 🟡 |
| 15 | 如何保证实验可复现（环境/依赖/随机种子）？ | ⭐⭐ | 🟡 |
| 16 | 大规模实验（数百并发）的资源和成本管理？ | ⭐⭐⭐ | 🟢 |

---

## CI/CD 与流水线 (9 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 17 | ML 的 CI/CD 与传统软件 CI/CD 的差异（数据/模型测试）？ | ⭐⭐⭐ | 🔴 |
| 18 | 设计一个自动化训练 Pipeline（触发→训练→评估→发布） | ⭐⭐⭐ | 🔴 |
| 19 | 模型测试应包含哪些（数据/特征/模型/推理/集成）？ | ⭐⭐ | 🟡 |
| 20 | Kubeflow Pipelines / Argo Workflows / Airflow 如何选？ | ⭐⭐ | 🟡 |
| 21 | 训练任务的容器化（镜像/依赖/GPU 驱动）最佳实践？ | ⭐⭐ | 🟡 |
| 22 | 如何实现 Continuous Training（定时/事件触发/漂移触发）？ | ⭐⭐⭐ | 🟡 |
| 23 | Pipeline 的失败重试和幂等性如何设计？ | ⭐⭐ | 🟡 |
| 24 | 训练和推理的代码/特征一致性如何在 CI 中校验？ | ⭐⭐⭐ | 🔴 |
| 25 | 金丝雀发布 / 影子部署 / 多臂老虎机发布的取舍？ | ⭐⭐⭐ | 🟡 |

---

## 模型部署与服务 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 26 | 在线推理 / 批推理 / 流推理的架构和适用场景？ | ⭐⭐ | 🔴 |
| 27 | 模型服务框架对比：TorchServe/Triton/BentoML/vLLM？ | ⭐⭐⭐ | 🟡 |
| 28 | 推理优化：量化/剪枝/蒸馏/算子融合如何组合？ | ⭐⭐⭐ | 🟡 |
| 29 | KServe / Seldon Core 的模型服务架构？ | ⭐⭐ | 🟢 |
| 30 | 如何做模型的 A/B 测试和多臂老虎线（MAB）路由？ | ⭐⭐⭐ | 🟡 |
| 31 | 边缘部署（TF-Lite/ONNX Runtime）的特殊考量？ | ⭐⭐ | 🟢 |
| 32 | 大模型推理服务（vLLM/SGLang/TensorRT-LLM）部署要点？ | ⭐⭐⭐ | 🔴 |
| 33 | 多模型混部（GPU 共享）的资源调度？ | ⭐⭐⭐ | 🟡 |

---

## 监控与可观测性 (7 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 34 | ML 监控 vs 软件监控的差异（数据/模型漂移）？ | ⭐⭐ | 🔴 |
| 35 | Data Drift / Concept Drift / Prediction Drift 如何区分检测？ | ⭐⭐⭐ | 🔴 |
| 36 | 漂移检测方法：PSI / KS / ADWIN / KL 散度的适用？ | ⭐⭐⭐ | 🟡 |
| 37 | 监控指标分级：系统指标 / 模型指标 / 业务指标？ | ⭐⭐ | 🟡 |
| 38 | 如何建立自动化重训练触发机制（阈值/频率）？ | ⭐⭐⭐ | 🟡 |
| 39 | LLM 专属监控（幻觉率/毒性/成本）如何设计？ | ⭐⭐⭐ | 🔴 |
| 40 | 异常检测在 ML 监控中的应用（统计/ML 方法）？ | ⭐⭐ | 🟢 |

---

## LLMOps 与前沿 (6 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 41 | LLMOps 工具链（LangSmith/Langfuse/Helicone）的核心能力？ | ⭐⭐ | 🔴 |
| 42 | Prompt 版本管理和 A/B 测试如何做？ | ⭐⭐ | 🟡 |
| 43 | RAG 系统的持续评估和优化 Pipeline？ | ⭐⭐⭐ | 🔴 |
| 44 | Agent 的可观测性（多步/工具调用）监控？ | ⭐⭐⭐ | 🟡 |
| 45 | 微调（LoRA/QLoRA）的 CI/CD 如何设计？ | ⭐⭐⭐ | 🟡 |
| 46 | LLM 应用的成本和 Token 监控治理？ | ⭐⭐ | 🟡 |

---

## 行为面试 (4 题)

| # | 问题 | 频率 |
|---|------|------|
| 47 | 描述一次你从 0 搭建 MLOps 平台并推动团队采纳的经历 | 🔴 |
| 48 | 当模型上线后效果下降，你的排查和应急流程？ | 🔴 |
| 49 | 你如何说服数据科学家接受 MLOps 规范（被视为束缚）？ | 🟡 |
| 50 | 描述一次你通过自动化显著提升交付效率的经历 | 🟡 |

---

## 编程与系统设计 (4 题)

| # | 方向 | 频率 | 示例 |
|---|------|------|------|
| 51 | 系统设计 | 🔴 | 设计端到端 MLOps 平台 |
| 52 | Python 工具链 | 🔴 | 写一个模型发布脚本 |
| 53 | 监控脚本 | 🟡 | 实现漂移检测 + 告警 |
| 54 | 流水线编排 | 🟡 | 用 Airflow/KFP 配置训练流水线 |

---

## 工具栈速查

| 能力 | 主流工具 |
|------|---------|
| 实验追踪 | MLflow / W&B / Comet / SageMaker |
| 模型注册 | MLflow Registry / Vertex Model Registry / W&B |
| 数据版本 | DVC / Lakehouse Time Travel |
| 流水线 | Kubeflow / Argo / Airflow / Prefect / Vertex Pipelines |
| CI/CD | GitHub Actions / GitLab CI / Jenkins + ML 插件 |
| 服务 | KServe / Triton / TorchServe / BentoML / vLLM |
| 监控 | Evidently / Arize / Fiddler / Prometheus |
| LLMOps | Langfuse / LangSmith / Helicone / Promptfoo |

---

*Last updated: 2026-07-23*

## Related

- [[21_面试岗位/MLOps_Engineer/interview_answers|MLOps Engineer 面试题实例答案]]
- [[21_面试岗位/MLOps_Engineer/company_level_question_bank|MLOps Engineer 按公司/级别区分的题库]]
- [[21_面试岗位/MLOps_Engineer/index|MLOps Engineer 首页]]
- [[11_模型运维/index|模型运维]]
- [[10_部署推理/index|部署推理]]
- [[11_模型运维/06_CI_CD/index|CI/CD for ML]]
- [[21_面试岗位/Interview_Guide/System_Design_for_AI|AI 系统设计面试]]
- [[21_面试岗位/Interview_Guide/jobs|AI 相关岗位与工种清单]]
