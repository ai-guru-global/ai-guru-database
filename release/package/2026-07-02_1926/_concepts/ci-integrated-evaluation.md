---
title: "CI 集成评估"
category: -concepts
tags: ["ci-cd", "evaluation", "automation", "regression-testing", "model-evaluation", "mlops"]
relationships:
  - target: "_concepts/model-evaluation"
    type: implements
  - target: "_concepts/mlops"
    type: belongs_to
  - target: "_concepts/ab-testing-framework"
    type: precedes
  - target: "_concepts/llm-production-pipeline"
    type: part_of
sources:
  - 08_Model_Evaluation/Evaluation_Automation_2026.md
  - 11_MLOps_Pipeline/Evaluation/LLM_Evaluation_Pipeline.md
  - 11_MLOps_Pipeline/CI_CD/CI_CD_Pipeline_AI_2026.md
summary: "CI 集成评估是把模型评估嵌入持续集成流水线。每次代码或模型变更都自动跑一组基准测试，像软件项目的单元测试一样，确保新版本不会在某些能力上‘开倒车’。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.82
lifecycle: reviewed
lifecycle_changed: 2026-06-16
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - "Ci Integrated Evaluation"
  - "ci integrated evaluation"

---
# CI 集成评估

## 核心要点

- **CI = Continuous Integration（持续集成）**：每次提交代码都自动构建、测试。
- **CI 集成评估 = 把模型评估也放进这个自动化流程**。
- **核心目标**：
  - 防止模型能力 regress（退化）。
  - 让评估结果可复现、可追踪。
  - 把评估从‘人工跑脚本’变成‘流水线自动跑’。

## 一句话理解

CI 集成评估就像给大模型装了一个‘自动化月考系统’：每次改代码或换模型，系统自动出题、自动阅卷、自动告诉你有没有考砸。

## 详细内容

### 为什么需要 CI 集成评估？

传统评估的问题：
- 靠人工在本地跑脚本，容易漏跑、错配环境。
- 模型版本、数据版本、评估代码版本对不上，结果不可复现。
- 小改动可能意外影响某类能力，但没人发现。

CI 集成评估让这些问题变成流水线的一部分。

### 典型流水线

```
代码/模型提交
  ↓
拉取固定版本的数据集
  ↓
运行基准测试（MMLU、GSM8K、HumanEval、自定义业务测试）
  ↓
与上一版本对比
  ↓
质量门禁：指标是否下降超过阈值？
  ├─ 通过 → 允许合并/发布
  └─ 失败 → 阻止发布，通知开发者
```

### 关键要素

| 要素 | 说明 |
|------|------|
| **版本锁定** | 模型、数据、代码、环境都固定版本 |
| **回归对比** | 新结果 vs 基线结果 |
| **阈值控制** | 单指标下降 > x% 即失败 |
| **可复现环境** | Docker、conda、随机种子固定 |
| **报告可视化** | 指标趋势图、差异明细 |
| **并行加速** | 多 GPU/多节点同时跑不同基准 |

### 常用工具

| 工具 | 用途 |
|------|------|
| **GitHub Actions / GitLab CI** | 触发流水线 |
| **MLflow / Weights & Biases** | 记录实验和指标 |
| **Docker** | 环境隔离 |
| **DVC / LakeFS** | 数据版本管理 |
| **lm-eval-harness** | 跑学术基准 |
| **自定义业务测试集** | 测真实业务指标 |

## 开放问题

- 评估时间与开发迭代速度的平衡。
- 如何设计‘足够敏感但不过敏’的阈值。
- 多模态、Agent 等复杂系统的 CI 评估标准化。

## Related

- [[_concepts/model-evaluation]] — 模型评估
- [[_concepts/mlops]] — MLOps
- [[_concepts/ab-testing-framework]] — A/B 测试框架
- [[_concepts/llm-production-pipeline]] — LLM 生产流水线
- [[08_Model_Evaluation/Evaluation_Automation_2026]] — 评估自动化 2026
- [[11_MLOps_Pipeline/Evaluation/LLM_Evaluation_Pipeline]] — LLM 评估流水线
