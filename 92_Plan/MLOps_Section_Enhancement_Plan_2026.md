---
title: "10_MLOps_Pipeline 章节加强计划 2026"
category: "92-plan"
tags: ["planning", "mlops", "llmops", "enhancement", "boundary", "roadmap"]
summary: "> 10_MLOps_Pipeline 章节的内容完整性诊断与多阶段加强路线图，含与 16_AI_Ops 的边界划分、深度提升、缺口填充和教程补充。"
created: 2026-06-15
updated: 2026-06-15
status: in-progress
related_section: 10_MLOps_Pipeline
---

# 10_MLOps_Pipeline 章节加强计划 2026

> **制定日期**: 2026-06-15
> **当前章节评分**: ⭐⭐⭐⭐☆（4/5）
> **目标评分**: ⭐⭐⭐⭐⭐（5/5）
> **基线对照**: [[_quality-assessment|2026-06-15 全库评估]]、[[_project-evaluation|2026-06-03 基线]]

---

## 一、诊断快照（2026-06-15）

### 1.1 已完成（两轮加强）

| 轮次 | 文件数 | 总字节 | 关键产出 |
|------|--------|--------|---------|
| 基线（06-03） | 13 | 163 KB | 传统 MLOps 主线 |
| 第一轮（LLMOps 主轴） | 17 | 245 KB | LLMOps_2026 + Prompt/Eval/RAG 三专题 |
| 第二轮（横切+扩展） | 24 | 310 KB | Cost/Observability + 5 个 P2 横切主题 |
| **当前** | **24** | **310 KB** | LLMOps 主线 + 传统 MLOps + 横切关注点 |

### 1.2 四个核心缺口

#### 🔴 缺口 1：与 16_AI_Ops 边界重叠（最大隐患）

`16_AI_Ops/` 有 14 个工具深度解析与章节 10 高度重叠：

| 16_AI_Ops 文件 | 章节 10 对应 | 重叠度 |
|---------------|------------|--------|
| `DVC_Deep_Dive.md` | `Data_Versioning_DVC_LakeFS.md` | 🔴 高 |
| `LakeFS_Deep_Dive.md` | `Data_Versioning_DVC_LakeFS.md` | 🔴 高 |
| `Feast_Deep_Dive.md` | `Feature_Store_Deep_Dive.md` | 🔴 高 |
| `MLflow_Deep_Dive.md` | `Experiment_Tracking_Deep_Dive.md` | 🔴 高 |
| `Kubeflow_Deep_Dive.md` | `Data_Pipeline_Orchestration.md` | 🟡 中 |
| `ClearML_Deep_Dive.md` | `Experiment_Tracking_Deep_Dive.md` | 🟡 中 |
| `LangSmith_Deep_Dive.md` | `LLM_Evaluation_Pipeline.md` / `LLM_Observability.md` | 🟡 中 |
| `Helicone_Deep_Dive.md` | `LLM_Observability.md` | 🟡 中 |
| `Braintrust_Deep_Dive.md` | `LLM_Evaluation_Pipeline.md` | 🟡 中 |
| `Guardrails_Deep_Dive.md` | `Privacy_Compliance_Pipeline.md` | 🟡 中 |
| `AI_Observability_*` (3 篇) | `ML_Observability_SLO.md` + `LLM_Observability.md` | 🔴 高 |
| `CI_CD_Pipeline_AI_2026.md` | `ML_CI_CD.md` | 🟡 中 |

**不解决边界，后续填充只会制造重复。**

#### 🟡 缺口 2：6 篇原始 "伪 Deep Dive" 偏浅

| 文件 | 当前词数 | 标杆要求 | 差距 |
|------|---------|---------|------|
| `Feature_Store_Deep_Dive.md` | 1285 | 2500+ | -48% |
| `Experiment_Tracking_Deep_Dive.md` | 1242 | 2500+ | -50% |
| `ML_CI_CD.md` | 1224 | 2500+ | -51% |
| `Data_Pipeline_Orchestration.md` | 1182 | 2500+ | -53% |
| `Model_Registry_and_Cards_Deep_Dive.md` | 1138 | 2500+ | -54% |
| `Model_Monitoring_and_Drift_Detection_2026.md` | 887 | 2500+ | -65% |

全章节仅 2 篇达标（`MLOps_Pipeline.md` 2285、`LLMOps_2026.md` 2092）。

#### 🟡 缺口 3：6 个常见 MLOps 主题零覆盖

| 缺失主题 | 关键词扫描 | 重要性 |
|---------|-----------|--------|
| Model Serving 模式 | 0 提及 | 高（需与 09 划界） |
| Data Quality 数据质量 | 2 提及 | 高 |
| Annotation Pipeline 标注流水线 | 0 提及 | 中 |
| Active Learning 主动学习 | 0 提及 | 中 |
| Human-in-the-Loop 人审闭环 | 0 提及 | 中 |
| Champion-Challenger / Shadow Deploy | 0 提及 | 中 |

#### 🟢 缺口 4：零可运行教程

24 篇全是概念性文档，无端到端可运行教程。

---

## 二、加强路线图（4 阶段）

### 🔴 阶段 P0：边界划分（前置必做）

**目标**: 解决 10 vs 16 的职责重叠，建立权威源（Single Source of Truth）。

**划分原则（方案 A）**：
- **10_MLOps_Pipeline = 「如何建设 ML/LLM 流水线」**（Engineering / Build-time）
- **16_AI_Ops = 「如何运维线上 AI 系统」**（Operations / Run-time / SRE）

**交付物**：
- `10_MLOps_Pipeline/_boundary-with-16.md` — 边界声明与归属矩阵
- 更新 10 与 16 的 README，互相引用边界
- 14 个重叠文件的「主场」标注

**状态**: ⏳ 进行中（本计划之后立即执行）

**详细方案**: 见 [[10_MLOps_Pipeline/_boundary-with-16]]

---

### 🟡 阶段 P1：扩 6 篇原始 Deep Dive 到标杆级

**目标**: 把 6 篇 ~1000-1300 词的"伪 Deep Dive"扩到 2500+ 词标杆级。

**优先级排序**（按 ROI）：

| # | 文件 | 当前 → 目标 | 补充重点 |
|---|------|-----------|---------|
| 1 | `Model_Monitoring_and_Drift_Detection_2026.md` | 887 → 3000 | 生产代码 + 多案例 |
| 2 | `Feature_Store_Deep_Dive.md` | 1285 → 2800 | Feast 完整代码 + 训练-服务偏差实战 |
| 3 | `Experiment_Tracking_Deep_Dive.md` | 1242 → 2800 | MLflow/W&B 端到端示例 |
| 4 | `ML_CI_CD.md` | 1224 → 2500 | GitHub Actions 完整 workflow |
| 5 | `Model_Registry_and_Cards_Deep_Dive.md` | 1138 → 2500 | 真实 Model Card 模板 |
| 6 | `Data_Pipeline_Orchestration.md` | 1182 → 2500 | Airflow/Dagster DAG 完整示例 |

**预计工时**: 2-3 天
**状态**: ⏳ 待启动（P0 完成后）

---

### 🟡 阶段 P2：补 4 个缺失主题

**目标**: 填补 6 个零覆盖主题中的高价值 4 个。

| 新文件 | 内容 | 依赖 |
|--------|------|------|
| `Data_Quality_Management.md` | Great Expectations/Pandera、schema 验证、数据门禁 | 独立 |
| `Annotation_Pipeline.md` | 标注流程、主动学习、人审闭环、弱监督 | 与 `Automated_Retraining` 协同 |
| `Deployment_Strategies.md` | Shadow/Canary/Champion-Challenger/Blue-Green 对比 | 与 09 协调 |
| `Model_Serving_Patterns.md` | 在线/批/流式推理、模型路由 | **需先与 09 划界** |

**预计工时**: 2 天
**状态**: ⏳ 待启动（P1 完成后）

---

### 🟢 阶段 P3：加 2 篇端到端教程

**目标**: 让读者能动手实操。

| 新文件 | 内容 |
|--------|------|
| `Tutorial_MLOps_End_to_End.md` | DVC + MLflow + Feast + GitHub Actions + Evidently 完整流水线 |
| `Tutorial_LLMOps_End_to_End.md` | Langfuse + Promptfoo + Ragas + LiteLLM 完整流水线 |

**预计工时**: 1-2 天
**状态**: ⏳ 待启动（P2 完成后）

---

### 🟢 阶段 P4：概念页补全

| 新文件 | 内容 |
|--------|------|
| `concepts/llmops.md` | LLMOps 概念页（呼应 `concepts/mlops.md`） |
| `concepts/feature-store.md` | 特征存储概念 |
| `concepts/experiment-tracking.md` | 实验追踪概念 |
| `concepts/model-registry.md` | 模型注册概念 |

**预计工时**: 0.5 天
**状态**: ⏳ 待启动

---

## 三、目标终态

| 指标 | 当前 | P0+P1 后 | 全部完成后 |
|------|------|---------|-----------|
| 文件数 | 24 | 24（提质不增量） | 30 |
| 总词数 | 2.78 万 | 4.5 万 | 5.5 万 |
| 2000+ 词标杆长文 | 2 篇 | 8 篇 | 10 篇 |
| 与 16 的重复 | 14 处 | 0（边界清晰） | 0 |
| 可运行教程 | 0 | 0 | 2 |
| 章节评分 | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐⭐ |

---

## 四、执行原则

1. **先定边界，再填内容** — P0 必须先于 P1/P2，否则新内容继续制造重复
2. **扩旧优先于建新** — P1（扩 6 篇）优先于 P2（建 4 篇），提升存量价值
3. **代码示例是质量分水岭** — 标杆级长文必须有可运行代码，不只是概念
4. **边界=双向链接** — 不强行迁移文件，用权威源标注 + 强交叉链接解决重叠
5. **每阶段验证 wikilink** — 完成后跑坏链检查，保证图谱健康

---

## 五、进度追踪

| 阶段 | 计划完成日 | 实际完成日 | 状态 | 备注 |
|------|----------|----------|------|------|
| P0 边界划分 | 2026-06-15 | — | 🟡 进行中 | |
| P1 扩 6 篇 Deep Dive | 2026-06-18 | — | ⏳ 待启动 | |
| P2 补 4 个缺失主题 | 2026-06-20 | — | ⏳ 待启动 | |
| P3 加 2 篇教程 | 2026-06-22 | — | ⏳ 待启动 | |
| P4 概念页补全 | 2026-06-22 | — | ⏳ 待启动 | |

---

## Related

- [[_quality-assessment]] — 全库质量评估（2026-06-15）
- [[_project-evaluation]] — 项目整体评估基线（2026-06-03）
- [[_content-gap-analysis]] — LLM 全生命周期缺口分析
- [[10_MLOps_Pipeline/Boundary_with_16]] — 10 vs 16 边界声明（P0 交付物）
- [[10_MLOps_Pipeline/README]] — 章节导航
- [[Implementation_Plan_2026]] — 2026 年度实施计划

---

*计划制定: 2026-06-15 · 维护者: opencode*
