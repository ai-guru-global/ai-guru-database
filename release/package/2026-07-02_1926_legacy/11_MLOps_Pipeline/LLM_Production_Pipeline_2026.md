---
title: "LLM 生产流水线深度指南"
category: "11-mlops-pipeline"
tags: ["mlops", "llmops", "llm", "production-pipeline", "ci-cd", "deployment", "monitoring", "cost-management", "mlflow", "vllm", "langsmith", "prometheus"]
summary: "> **一句话理解**: LLM 生产流水线不是传统 ML Pipeline 的简单延伸，而是一套以 Prompt 为变更核心、以 Token 为成本单位、以 LLM-as-Judge 为质量门禁的全新工程体系——本文是这套体系的端到端实战蓝图。"
created: 2026-06-15
updated: 2026-06-15
tier: supporting
parent: "[[MLOps/LLMOps_2026]]"
aliases:
  - "Llm Production Pipeline 2026"
  - "LLM Production Pipeline 2026"
  - LLM_Production_Pipeline_2026

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# LLM 生产流水线深度指南

> **一句话理解**: LLM 生产流水线不是传统 ML Pipeline 的简单延伸，而是一套以 Prompt 为变更核心、以 Token 为成本单位、以 LLM-as-Judge 为质量门禁的全新工程体系——本文是这套体系的端到端实战蓝图。

本文是 [[LLMOps_2026]] 的工程实践深扩，聚焦**流水线构建**而非理念阐述。评估细节见 [[LLM_Evaluation_Pipeline]]，监控细节见 [[LLM_Observability]] 和 [[Model_Monitoring_and_Drift_Detection_2026]]，CI/CD 见 [[ML_CI_CD]]。

---

## 目录

| 章节 | 内容 | 难度 |
|------|------|------|
| [1. LLM 生产流水线总览](#1-llm-生产流水线总览) | 与传统 ML 差异、七阶段架构图 | 入门 |
| [2. 数据流水线](#2-数据流水线) | 数据治理、版本化、合成数据、质量门禁 | 进阶 |
| [3. 模型训练流水线](#3-模型训练流水线) | 实验跟踪、分布式训练、Checkpoint、HPO | 进阶 |
| [4. 评估流水线](#4-评估流水线) | 自动化门禁、LLM-as-Judge、A/B 测试、回归检测 | 进阶 |
| [5. 部署流水线](#5-部署流水线) | Model Registry、灰度发布、蓝绿部署、多模型路由 | 实战 |
| [6. 监控与可观测性](#6-监控与可观测性) | 核心指标、漂移检测、告警、反馈闭环 | 实战 |
| [7. LLM 应用 CI/CD](#7-llm-应用-cicd) | Prompt 版本控制、Eval-as-Test、基础设施即代码 | 实战 |
| [8. 成本管理](#8-成本管理) | Token 预算、模型级联、缓存策略、批处理 | 实战 |
| [9. 端到端案例](#9-端到端案例mlflow--vllm--langsmith--prometheus) | 完整生产流水线实战 | 综合 |
| [10. 相关文档](#10-相关文档) | 导航与延伸阅读 | 导航 |

---

## 1. LLM 生产流水线总览

### 1.1 传统 ML Pipeline vs LLM Production Pipeline

传统 ML Pipeline 遵循 **数据 → 训练 → 评估 → 部署** 的线性流程，变更单元是模型权重（GB 级，月级迭代）。LLM 生产流水线是**七阶段闭环系统**，变更单元是 Prompt + RAG 配置 + 模型版本的组合（KB 级，日级迭代）。

| 维度 | 传统 ML Pipeline | LLM Production Pipeline |
|------|-----------------|------------------------|
| **变更频率** | 月/季度级（模型重训练） | 日/小时级（Prompt 修改、RAG 索引更新） |
| **变更单元** | 模型权重 | Prompt + Model + RAG Config 三层组合 |
| **评估方式** | 固定测试集 + 数值指标 | Golden Set + LLM-as-Judge + 人工抽检 |
| **部署目标** | 单一模型 Serving | 多模型路由 + 级联 + A/B |
| **成本模型** | GPU 算力为主 | Token 费用 + GPU 算力 + 人工评审 |
| **监控核心** | 数据漂移、模型性能下降 | 幻觉率、毒性、越狱、PII 泄露、成本 |
| **反馈闭环** | 标注 → 重训练 | 人工修订 → Prompt 迭代 / Fine-tune / RAG 扩充 |

### 1.2 七阶段闭环架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LLM Production Pipeline (7 Stages)               │
│                                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │  Stage 1  │───▶│  Stage 2  │───▶│  Stage 3  │───▶│  Stage 4  │    │
│  │   Data    │    │ Training  │    │Evaluation │    │ Deployment│    │
│  │ Pipeline  │    │ Pipeline  │    │ Pipeline  │    │ Pipeline  │    │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│       ▲                                                  │          │
│       │                                                  ▼          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                      │
│  │  Stage 7  │◀──│  Stage 6  │◀──│  Stage 5  │                      │
│  │ Iteration │    │ Feedback  │    │Monitoring │                      │
│  │  Loop     │    │  Loop     │    │& Observe  │                      │
│  └──────────┘    └──────────┘    └──────────┘                      │
│                                                                     │
│  横切关注点 (Cross-Cutting Concerns):                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  CI/CD  ·  Cost Management  ·  Security  ·  Compliance     │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

**各阶段职责速览**:

| 阶段 | 核心职责 | 关键工具 |
|------|---------|---------|
| **Data** | 数据采集、清洗、版本化、质量门禁 | DVC, LakeFS, Argilla |
| **Training** | 实验跟踪、分布式训练、Checkpoint 管理 | MLflow, W&B, DeepSpeed, FSDP |
| **Evaluation** | 自动化评估、LLM-as-Judge、回归检测 | Ragas, DeepEval, Promptfoo |
| **Deployment** | 模型注册、灰度发布、多模型路由 | vLLM, Triton, KServe, Ray Serve |
| **Monitoring** | 延迟、吞吐、成本、质量指标 | Prometheus, Grafana, LangSmith |
| **Feedback** | 用户反馈收集、标注工作流 | Argilla, Label Studio, LangSmith |
| **Iteration** | Prompt 优化、Fine-tune、RAG 扩充 | Promptfoo, OpenAI Fine-tuning |

### 1.3 三种生产模式

并非所有 LLM 应用都需要完整七阶段流水线。根据**模型所有权**和**定制深度**，分为三种模式：

| 模式 | 描述 | 典型场景 | 跳过的阶段 |
|------|------|---------|-----------|
| **Prompt-Only** | 使用基座 API + Prompt Engineering | 客服机器人、内容生成 | Training, 部分 Data |
| **RAG-Augmented** | 基座 API + 检索增强 | 知识问答、文档助手 | Training |
| **Fine-Tuned** | 自训/微调模型 + 自托管 | 垂直领域、低延迟场景 | 无（全阶段） |

---

## 2. 数据流水线

数据是 LLM 生产流水线的基石。与传统 ML 不同，LLM 数据流水线需同时处理**预训练语料**、**SFT 微调数据**和 **RAG 知识库**三类数据。

### 2.1 数据版本化

LLM 项目中，数据变更频率极高（知识库日更、SFT 数据周迭代）。没有版本化，就无法复现任何实验。

**工具对比**:

| 工具 | 存储模型 | 优势 | 劣势 |
|------|---------|------|------|
| **DVC** | Git-like CLI + 远程存储 | 轻量、与 Git 深度集成 | 大规模数据性能一般 |
| **LakeFS** | Git-like on Object Store | 原子分支、合并、时间旅行 | 需要自建服务 |
| **Hugging Face Datasets** | Hub + Parquet | 社区生态、流式加载 | 依赖 HF 平台 |
| **Delta Lake** | Delta Log + Parquet | ACID 事务、Schema Evolution | Spark 生态绑定 |

**DVC 数据版本化示例**:

```bash
# 初始化 DVC 并配置远程存储
dvc init
dvc remote add -d storage s3://my-bucket/dvc-store

# 追踪数据目录
dvc add data/sft_training_data/
git add data/sft_training_data.dvc .gitignore
git commit -m "v1.0: initial SFT dataset (10k samples)"

# 数据更新后创建新版本
dvc add data/sft_training_data/
git add data/sft_training_data.dvc
git commit -m "v1.1: added medical domain samples (+2k)"

# 回滚到任意版本
git checkout v1.0 -- data/sft_training_data.dvc
dvc checkout
```

### 2.2 合成数据生成

高质量标注数据稀缺且昂贵。2026 年的主流做法是 **LLM 辅助生成 + 人工审核**：

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Seed Data   │────▶│  LLM Gen     │────▶│  Quality     │
│  (少量人工)   │     │  (Self-Instruct│     │  Filter      │
│              │     │   Evol-Instruct)│    │  (规则+模型)  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │  Human       │
                                         │  Review      │
                                         │  (抽检 10-20%)│
                                         └──────────────┘
```

**合成数据质量门禁链**:

```python
class SyntheticDataPipeline:
    def __init__(self):
        self.gates = [
            DeduplicationGate(threshold=0.85),      # 去重（MinHash）
            ToxicityGate(max_score=0.1),             # 毒性过滤
            PIIRedactionGate(patterns=["email", "phone", "ssn"]),  # PII 脱敏
            LengthGate(min_tokens=50, max_tokens=4096),             # 长度过滤
            LanguageGate(target="zh", min_confidence=0.95),         # 语言检测
            QualityGate(model="reward-model", min_score=0.7),       # 质量打分
        ]

    def run(self, raw_data: list[dict]) -> list[dict]:
        cleaned = raw_data
        for gate in self.gates:
            before = len(cleaned)
            cleaned = gate.filter(cleaned)
            print(f"{gate.name}: {before} → {len(cleaned)} "
                  f"(dropped {before - len(cleaned)})")
        return cleaned
```

### 2.3 SFT 数据格式

Supervised Fine-Tuning (SFT) 数据的格式直接影响训练效果。2026 年主流格式：

```json
{
  "messages": [
    {"role": "system", "content": "你是一个专业的医疗助手。"},
    {"role": "user", "content": "头痛的常见原因有哪些？"},
    {"role": "assistant", "content": "头痛的常见原因包括：\n1. 紧张性头痛...\n2. 偏头痛..."}
  ],
  "metadata": {
    "source": "synthetic_v2.1",
    "domain": "medical",
    "quality_score": 0.92
  }
}
```

**关键规范**:
- 使用 `messages` 数组格式，与 OpenAI Chat Completions API 兼容
- `metadata` 字段用于数据血缘追踪和质量过滤
- 每条数据应有唯一 `id`，用于去重和错误回溯
- 长文本应标注 token count，便于训练时的 packing 策略

---

## 3. 模型训练流水线

### 3.1 实验跟踪

实验跟踪是训练流水线的核心。没有它，你无法回答"上周那个好模型用了什么配置"。

**主流工具对比 (2026)**:

| 工具 | 部署方式 | 核心优势 | 适用场景 |
|------|---------|---------|---------|
| **MLflow** | 自建 / Databricks | 开源、Model Registry 完善 | 团队协作、模型治理 |
| **Weights & Biases** | SaaS / 自建 | 可视化最强、Sweeps 集成 | 研究探索、HPO |
| **ClearML** | 自建 / SaaS | 全栈（数据+训练+部署） | 端到端管理 |
| **LangSmith** | SaaS | LLM 专用、Trace 可视化 | LLM 应用开发 |

**MLflow 训练跟踪示例**:

```python
import mlflow
from transformers import TrainingArguments, Trainer

mlflow.set_experiment("llm-sft-medical-v2")

with mlflow.start_run(run_name="llama-3.1-8b-sft-epoch3"):
    mlflow.log_params({
        "base_model": "meta-llama/Llama-3.1-8B",
        "learning_rate": 2e-5,
        "batch_size": 4,
        "gradient_accumulation_steps": 8,
        "epochs": 3,
        "lora_r": 16,
        "lora_alpha": 32,
        "max_seq_length": 4096,
        "dataset_version": "v1.1",
        "dataset_size": 12000,
    })

    training_args = TrainingArguments(
        output_dir="./checkpoints",
        per_device_train_batch_size=4,
        gradient_accumulation_steps=8,
        learning_rate=2e-5,
        num_train_epochs=3,
        save_strategy="steps",
        save_steps=500,
        logging_steps=10,
        evaluation_strategy="steps",
        eval_steps=500,
        load_best_model_at_end=True,
        metric_for_best_model="eval_loss",
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=eval_ds,
        callbacks=[MLflowCallback()],
    )
    trainer.train()

    # 记录最终指标
    mlflow.log_metrics({
        "final_train_loss": trainer.training_loss,
        "best_eval_loss": min(trainer.state.log_history, key=lambda x: x.get("eval_loss", float("inf")))["eval_loss"],
    })

    # 注册模型
    mlflow.transformers.log_model(
        model=model,
        tokenizer=tokenizer,
        artifact_path="model",
        registered_model_name="medical-assistant-8b",
    )
```

### 3.2 分布式训练编排

大模型训练需要分布式策略。2026 年主流方案：

| 策略 | 适用规模 | 显存效率 | 通信开销 |
|------|---------|---------|---------|
| **DDP** | < 1B | 低 | 低 |
| **FSDP** | 1B - 70B | 高 | 中 |
| **DeepSpeed ZeRO-3** | 1B - 70B+ | 最高 | 高 |
| **Megatron-LM** | 70B+ | 高 | 最高（Tensor Parallel） |

**分布式训练编排架构**:

```
┌─────────────────────────────────────────────────────────┐
│              Training Orchestrator (e.g., Ray, Slurm)    │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ Node 0  │  │ Node 1  │  │ Node 2  │  │ Node 3  │   │
│  │ GPU 0-7 │  │ GPU 0-7 │  │ GPU 0-7 │  │ GPU 0-7 │   │
│  │ (Master)│  │         │  │         │  │         │   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │
│       │            │            │            │         │
│       └────────────┴────────────┴────────────┘         │
│                    NCCL / Gloo                          │
│                                                         │
│  Checkpoint Manager ──▶ Object Store (S3/GCS)           │
│  Metrics Collector  ──▶ MLflow / W&B                    │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Checkpoint 管理

Checkpoint 是训练流水线中最昂贵的产出物。管理不善会导致：

- **存储爆炸**: 70B 模型每 checkpoint ~140GB，每 500 步存一次，3 epoch 轻松数 TB
- **无法复现**: 不知道哪个 checkpoint 对应哪个配置
- **恢复困难**: 训练中断后找不到最近的 checkpoint

**最佳实践**:

```python
from dataclasses import dataclass
from datetime import datetime

@dataclass
class CheckpointPolicy:
    save_interval_steps: int = 500
    keep_last_n: int = 3
    keep_best_n: int = 2
    metric_for_best: str = "eval_loss"
    storage_backend: str = "s3://checkpoints-bucket"
    cleanup_after_registration: bool = True

    def should_save(self, step: int, total_steps: int) -> bool:
        if step == total_steps:  # 最后一步必存
            return True
        return step % self.save_interval_steps == 0

    def cleanup(self, checkpoints: list[dict]) -> list[str]:
        """保留 last-N 和 best-N，删除其余"""
        by_loss = sorted(checkpoints, key=lambda c: c["eval_loss"])
        keep = set()
        keep.update(c["step"] for c in checkpoints[-self.keep_last_n:])
        keep.update(c["step"] for c in by_loss[:self.keep_best_n])
        return [c["path"] for c in checkpoints if c["step"] not in keep]
```

### 3.4 超参数优化 (HPO)

LLM Fine-tuning 的 HPO 空间相对有限，但关键参数的影响巨大：

| 超参数 | 推荐搜索范围 | 影响程度 |
|--------|------------|---------|
| Learning Rate | 1e-6 ~ 5e-5 | ★★★★★ |
| LoRA Rank (r) | 8, 16, 32, 64 | ★★★★ |
| Batch Size (effective) | 32 ~ 128 | ★★★ |
| Warmup Ratio | 0.03 ~ 0.1 | ★★ |
| Weight Decay | 0.0 ~ 0.1 | ★★ |
| Max Seq Length | 2048 ~ 8192 | ★★★ |

**HPO 与实验跟踪集成**（W&B Sweeps 示例）:

```yaml
# sweep_config.yaml
program: train.py
method: bayes
metric:
  name: eval/loss
  goal: minimize
parameters:
  learning_rate:
    distribution: log_uniform_values
    min: 1e-6
    max: 5e-5
  lora_r:
    values: [8, 16, 32]
  lora_alpha:
    values: [16, 32, 64]
  warmup_ratio:
    distribution: uniform
    min: 0.03
    max: 0.1
```

---

## 4. 评估流水线

评估流水线是 LLM 生产流水线的**质量门禁**。详细评估方法论见 [[LLM_Evaluation_Pipeline]]，本节聚焦流水线集成。

### 4.1 自动化评估门禁

每次 Prompt 修改、模型切换或 RAG 配置变更，都必须通过评估门禁才能部署：

```
┌─────────────────────────────────────────────────────────┐
│                  Evaluation Gate Pipeline                │
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │  Change  │───▶│  Golden  │───▶│  Auto    │          │
│  │  Detected│    │  Set Eval│    │  Metrics │          │
│  └──────────┘    └──────────┘    └────┬─────┘          │
│                                       │                 │
│                              ┌────────▼────────┐        │
│                              │  Gate Decision  │        │
│                              │  (Thresholds)   │        │
│                              └───┬────────┬────┘        │
│                                  │        │             │
│                             PASS ▼        ▼ FAIL        │
│                          ┌──────────┐ ┌──────────┐     │
│                          │ LLM-as-  │ │ Block +  │     │
│                          │ Judge    │ │ Notify   │     │
│                          │ (sample) │ │          │     │
│                          └────┬─────┘ └──────────┘     │
│                               │                         │
│                          ┌────▼─────┐                   │
│                          │ Deploy   │                   │
│                          │ (Canary) │                   │
│                          └──────────┘                   │
└─────────────────────────────────────────────────────────┘
```

**评估门禁配置示例**:

```python
@dataclass
class EvalGateConfig:
    # 自动化指标阈值
    min_faithfulness: float = 0.85       # RAG 忠实度
    min_answer_relevancy: float = 0.80   # 答案相关性
    max_hallucination_rate: float = 0.05 # 幻觉率上限
    max_toxicity_rate: float = 0.01      # 毒性率上限
    max_pii_leak_rate: float = 0.0       # PII 泄露零容忍

    # 性能阈值
    max_p95_latency_ms: float = 5000     # P95 延迟
    max_cost_per_query_usd: float = 0.05 # 单次查询成本上限

    # 回归检测
    max_regression_pct: float = 2.0      # 指标回归容忍度 (%)

    def evaluate(self, results: dict) -> tuple[bool, list[str]]:
        failures = []
        for metric, threshold in self.thresholds().items():
            if not self._check(metric, results.get(metric), threshold):
                failures.append(f"{metric}: {results[metric]} vs {threshold}")
        return len(failures) == 0, failures
```

### 4.2 LLM-as-Judge 流水线

LLM-as-Judge 是 2026 年 LLM 评估的标配，但需要注意**偏差校正**：

```python
class LLMJudgePipeline:
    """多 Judge 投票 + 偏差校正"""

    def __init__(self):
        self.judges = [
            JudgeModel("gpt-4o", weight=1.0),
            JudgeModel("claude-sonnet-4", weight=1.0),
            JudgeModel("deepseek-v3", weight=0.8),
        ]
        self.position_bias_correction = True  # 位置偏差校正

    async def evaluate(self, query: str, response: str,
                       reference: str | None = None) -> JudgeResult:
        scores = []
        for judge in self.judges:
            # 位置偏差校正：每个 Judge 跑两次，交换选项顺序
            if self.position_bias_correction:
                score_a = await judge.score(query, response, reference, order="normal")
                score_b = await judge.score(query, response, reference, order="reversed")
                score = (score_a + (5 - score_b)) / 2  # 校正后取均值
            else:
                score = await judge.score(query, response, reference)
            scores.append(Score(value=score, weight=judge.weight, model=judge.name))

        weighted_avg = sum(s.value * s.weight for s in scores) / sum(s.weight for s in scores)
        return JudgeResult(
            score=weighted_avg,
            agreement=self._calc_agreement(scores),
            details=scores,
        )
```

### 4.3 A/B 测试框架

线上 A/B 测试是评估的最终仲裁：

```
                        ┌──────────────┐
                        │  Traffic     │
                        │  Router      │
                        └──┬───────┬───┘
                           │       │
                    50%    ▼       ▼    50%
                 ┌──────────┐ ┌──────────┐
                 │ Model A  │ │ Model B  │
                 │ (Control)│ │(Treatment)│
                 └────┬─────┘ └────┬─────┘
                      │            │
                      ▼            ▼
                 ┌─────────────────────┐
                 │  Metrics Collector  │
                 │  (LangSmith/Prom)   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Statistical Test   │
                 │  (Mann-Whitney U)   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Decision Engine    │
                 │  (Auto-Promote/Rollback)│
                 └─────────────────────┘
```

---

## 5. 部署流水线

### 5.1 Model Registry 与版本管理

Model Registry 是部署流水线的入口，连接训练和 Serving：

**MLflow Model Registry 工作流**:

```python
import mlflow

# 训练完成后注册模型
model_uri = "runs:/<run_id>/model"
mv = mlflow.register_model(model_uri, "medical-assistant-8b")

# 状态转换：None → Staging → Production → Archived
client = mlflow.tracking.MlflowClient()
client.transition_model_version_stage(
    name="medical-assistant-8b",
    version=mv.version,
    stage="staging",
)

# 评估通过后升级到 Production
client.transition_model_version_stage(
    name="medical-assistant-8b",
    version=mv.version,
    stage="production",
)
```

### 5.2 部署策略

| 策略 | 描述 | 风险 | 回滚速度 |
|------|------|------|---------|
| **Canary** | 小比例流量验证新版本 | 低 | 秒级（流量切换） |
| **Blue-Green** | 两套环境切换 | 中（资源开销 2x） | 秒级（DNS/LB 切换） |
| **Shadow** | 新版本接收真实流量但不返回结果 | 无 | N/A（仅观察） |
| **Rolling** | 逐步替换旧版本 Pod | 中 | 分钟级（Pod 重启） |

**Canary 部署配置示例** (Kubernetes + KServe):

```yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: medical-assistant
spec:
  predictor:
    canaryTrafficPercent: 10  # 10% 流量到新版本
    model:
      modelFormat:
        name: vllm
      storageUri: s3://models/medical-assistant-v2.1
      resources:
        limits:
          nvidia.com/gpu: "1"
        requests:
          memory: "16Gi"
---
# 自动晋升规则
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: medical-assistant
  annotations:
    serving.kserve.io/canary-traffic-percent: "100"  # 验证后全量
```

### 5.3 多模型路由

生产环境中，不同类型的请求应路由到不同的模型：

```python
class ModelRouter:
    """基于请求特征的智能路由"""

    def __init__(self):
        self.routes = {
            "simple": ModelEndpoint("gpt-4o-mini", cost_per_1k=0.00015),
            "complex": ModelEndpoint("gpt-4o", cost_per_1k=0.005),
            "medical": ModelEndpoint("medical-finetuned-8b", cost_per_1k=0.001),
            "code": ModelEndpoint("deepseek-coder-v3", cost_per_1k=0.0008),
        }
        self.classifier = IntentClassifier()

    async def route(self, request: ChatRequest) -> ModelEndpoint:
        intent = await self.classifier.classify(request)

        # 规则优先
        if request.metadata.get("domain") == "medical":
            return self.routes["medical"]
        if intent.code_related:
            return self.routes["code"]

        # 复杂度路由：简单问题用小模型省钱
        if intent.complexity < 0.3:
            return self.routes["simple"]
        return self.routes["complex"]
```

---

## 6. 监控与可观测性

详细监控方案见 [[LLM_Observability]] 和 [[Model_Monitoring_and_Drift_Detection_2026]]，本节聚焦核心指标体系。

### 6.1 四维指标体系

```
┌─────────────────────────────────────────────────────────┐
│              LLM Observability - 4 Dimensions            │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Latency    │  │  Quality    │  │   Cost      │     │
│  │             │  │             │  │             │     │
│  │  P50/P95/P99│  │ Hallucinate │  │ Token/Query │     │
│  │  TTFT       │  │ Toxicity    │  │ $/Query     │     │
│  │  TPS        │  │ Relevancy   │  │ Budget Util │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  ┌─────────────┐                                        │
│  │ Reliability │                                        │
│  │             │                                        │
│  │ Error Rate  │                                        │
│  │ Timeout %   │                                        │
│  │ Retry Rate  │                                        │
│  └─────────────┘                                        │
└─────────────────────────────────────────────────────────┘
```

### 6.2 核心指标定义

| 指标 | 定义 | 告警阈值示例 | 采集方式 |
|------|------|------------|---------|
| **Latency P50** | 50% 请求的响应时间 | < 2s | Prometheus histogram |
| **Latency P95** | 95% 请求的响应时间 | < 5s | Prometheus histogram |
| **Latency P99** | 99% 请求的响应时间 | < 10s | Prometheus histogram |
| **TTFT** | Time to First Token | < 500ms | 应用层埋点 |
| **TPS** | Tokens per Second (生成) | > 30 | 应用层计算 |
| **Error Rate** | 5xx 错误比例 | < 0.1% | HTTP 状态码 |
| **Hallucination Rate** | 幻觉检出率 | < 5% | LLM-as-Judge 采样 |
| **Toxicity Rate** | 毒性内容检出率 | < 1% | 分类器 |
| **Token Usage** | 每查询平均 Token 数 | 趋势监控 | API 响应解析 |
| **Cost per Query** | 每查询平均成本 | < $0.05 | Token 数 × 单价 |

### 6.3 Prometheus 监控配置

```yaml
# prometheus_alerts.yml
groups:
  - name: llm_serving
    rules:
      - alert: LLMLatencyP99High
        expr: histogram_quantile(0.99, rate(llm_request_duration_seconds_bucket[5m])) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "LLM P99 latency > 10s for 5 minutes"

      - alert: LLMErrorRateHigh
        expr: rate(llm_requests_total{status=~"5.."}[5m]) / rate(llm_requests_total[5m]) > 0.001
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "LLM error rate > 0.1%"

      - alert: LLMCostBudgetExceeded
        expr: llm_cost_usd_total > llm_cost_budget_usd * 0.8
        labels:
          severity: warning
        annotations:
          summary: "LLM cost approaching budget limit (80%)"

      - alert: LLMHallucinationRateHigh
        expr: rate(llm_hallucination_detected_total[1h]) / rate(llm_evaluated_total[1h]) > 0.05
        for: 30m
        labels:
          severity: critical
        annotations:
          summary: "Hallucination rate > 5% in last hour"
```

### 6.4 漂移检测

LLM 的"漂移"不同于传统 ML（数据分布偏移），主要表现为：

| 漂移类型 | 症状 | 检测方法 |
|---------|------|---------|
| **输入漂移** | 用户提问模式变化 | Embedding 距离监控（PSI / KS Test） |
| **输出漂移** | 响应质量/风格变化 | 评估指标趋势分析 |
| **概念漂移** | 事实正确性下降 | 知识库新鲜度 vs 响应对比 |
| **模型 API 漂移** | 底层模型静默更新 | 响应一致性采样对比 |

---

## 7. LLM 应用 CI/CD

传统 CI/CD 测试代码；LLM CI/CD 测试 **Prompt + 代码 + 数据** 的组合。详细方案见 [[ML_CI_CD]]。

### 7.1 Prompt 版本控制

```
prompts/
├── medical_qa/
│   ├── v1.0.0.md          # 初始版本
│   ├── v1.1.0.md          # 增加输出格式约束
│   ├── v1.1.1.md          # 修复边界情况
│   ├── eval_results/
│   │   ├── v1.0.0.json    # 评估结果快照
│   │   ├── v1.1.0.json
│   │   └── v1.1.1.json
│   └── CHANGELOG.md
└── code_review/
    └── ...
```

**Prompt 与评估结果关联**:

```python
class PromptVersion:
    def __init__(self, path: str):
        self.content = Path(path).read_text()
        self.version = self._extract_version(path)
        self.eval_results = self._load_eval_results(path)

    def is_safe_to_deploy(self, gate_config: EvalGateConfig) -> bool:
        if not self.eval_results:
            raise ValueError(f"No eval results for {self.version}")
        passed, failures = gate_config.evaluate(self.eval_results)
        return passed
```

### 7.2 CI/CD Pipeline 完整流程

```yaml
# .github/workflows/llm-ci-cd.yml
name: LLM CI/CD Pipeline

on:
  pull_request:
    paths:
      - 'prompts/**'
      - 'rag_config/**'
      - 'eval_sets/**'

jobs:
  eval-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Golden Set Evaluation
        run: |
          python -m eval.run_golden_set \
            --prompt prompts/medical_qa/v1.1.1.md \
            --eval-set eval_sets/medical_golden_v2.json \
            --output results.json

      - name: Check Gate Thresholds
        run: |
          python -m eval.check_gate \
            --results results.json \
            --config eval_gate_config.yaml

      - name: Run LLM-as-Judge (Sample)
        if: success()
        run: |
          python -m eval.llm_judge \
            --results results.json \
            --sample-size 50 \
            --judges gpt-4o,claude-sonnet-4

      - name: Upload Eval Results
        uses: actions/upload-artifact@v4
        with:
          name: eval-results-${{ github.sha }}
          path: results.json
```

### 7.3 Evaluation-as-Test

将评估结果转化为类似测试的通过/失败信号：

```python
import pytest
from eval.golden_set import load_golden_set, evaluate_response

class TestMedicalPromptRegression:
    @pytest.fixture
    def golden_set(self):
        return load_golden_set("eval_sets/medical_golden_v2.json")

    @pytest.fixture
    def prompt(self):
        return load_prompt("prompts/medical_qa/v1.1.1.md")

    def test_faithfulness_above_threshold(self, golden_set, prompt):
        results = evaluate_response(golden_set, prompt)
        faithfulness = results["faithfulness"]
        assert faithfulness >= 0.85, f"Faithfulness {faithfulness} < 0.85"

    def test_no_hallucinations_on_critical_cases(self, golden_set, prompt):
        critical_cases = [c for c in golden_set if c["critical"]]
        results = evaluate_response(critical_cases, prompt)
        assert results["hallucination_rate"] == 0.0, \
            f"Hallucination detected in {results['hallucinations']} critical cases"

    def test_latency_within_slo(self, golden_set, prompt):
        results = evaluate_response(golden_set, prompt)
        assert results["p95_latency_ms"] < 5000, \
            f"P95 latency {results['p95_latency_ms']}ms exceeds 5000ms SLO"
```

---

## 8. 成本管理

LLM 的 Token 计费模型使成本管理成为生产流水线的一等公民。详见 [[LLM_Cost_Latency_SLO]] 和 [[Cost_Optimization_MLOps]]。

### 8.1 成本构成分析

```
┌─────────────────────────────────────────────────────────┐
│              LLM Cost Breakdown (2026)                   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  API Token Costs (40-60%)                        │   │
│  │  Input Tokens + Output Tokens + Cached Tokens    │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  GPU Compute (20-35%)                            │   │
│  │  Self-hosted inference + Training                │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Evaluation & Review (5-15%)                     │   │
│  │  LLM-as-Judge costs + Human review               │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Infrastructure (5-10%)                          │   │
│  │  Storage + Networking + Monitoring               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 8.2 模型级联 (Model Cascading)

最有效的成本优化策略：先用小模型尝试，仅在不确定时升级到大模型：

```python
class ModelCascade:
    """级联路由：小模型优先，不确定时升级"""

    def __init__(self):
        self.tiers = [
            CascadeTier(model="gpt-4o-mini", cost_per_1k=0.00015,
                        confidence_threshold=0.8),
            CascadeTier(model="gpt-4o", cost_per_1k=0.005,
                        confidence_threshold=0.7),
            CascadeTier(model="claude-opus-4", cost_per_1k=0.015,
                        confidence_threshold=0.0),  # 最终兜底
        ]

    async def infer(self, query: str) -> CascadeResult:
        for tier in self.tiers:
            response = await self._call_model(tier.model, query)
            confidence = await self._estimate_confidence(response)
            if confidence >= tier.confidence_threshold:
                return CascadeResult(
                    response=response,
                    model_used=tier.model,
                    confidence=confidence,
                    escalated=False,
                )
        # 所有模型都不确定，返回最高质量模型的结果
        return CascadeResult(response=response, model_used=self.tiers[-1].model,
                            confidence=confidence, escalated=True)

    async def _estimate_confidence(self, response: str) -> float:
        """基于响应特征估计置信度"""
        # 方法1: 自我评估 (Self-evaluation)
        # 方法2: 输出 logprobs (如果可用)
        # 方法3: 响应结构化程度 (格式越规范，置信度越高)
        ...
```

### 8.3 缓存策略

| 缓存层 | 策略 | 命中率预期 | 适用场景 |
|--------|------|----------|---------|
| **Exact Match** | 完全相同的 query → 缓存响应 | 10-30% | FAQ、客服 |
| **Semantic Cache** | Embedding 相似度 > 0.95 | 20-40% | 知识问答 |
| **Prefix Cache** | 共享 System Prompt 前缀 | 持续节省 | 所有场景 |
| **KV Cache** | 推理层面的 KV 缓存 | 内部优化 | 自托管模型 |

```python
class SemanticCache:
    def __init__(self, embedding_model="text-embedding-3-small",
                 similarity_threshold=0.95):
        self.embedder = embedding_model
        self.threshold = similarity_threshold
        self.cache = VectorStore()  # Redis with vector search

    async def get_or_compute(self, query: str, compute_fn) -> str:
        query_embedding = await self.embed(query)
        cached = await self.cache.search(query_embedding, top_k=1)

        if cached and cached[0].score >= self.threshold:
            return cached[0].response  # Cache hit

        response = await compute_fn(query)
        await self.cache.insert(query_embedding, response)
        return response
```

### 8.4 Token 预算管理

```python
class TokenBudgetManager:
    def __init__(self, daily_budget_usd: float = 100.0):
        self.daily_budget = daily_budget_usd
        self.usage_tracker = UsageTracker()

    async def check_and_record(self, request: TokenRequest) -> bool:
        current_usage = await self.usage_tracker.get_daily_usage()
        estimated_cost = self._estimate_cost(request)

        if current_usage + estimated_cost > self.daily_budget:
            # 触发降级策略
            await self._trigger_degradation()
            return False

        await self.usage_tracker.record(request)
        return True

    async def _trigger_degradation(self):
        """预算耗尽时的降级策略"""
        # 1. 切换到更便宜的模型
        # 2. 限制最大输出 token 数
        # 3. 启用更积极的缓存
        # 4. 非关键请求返回缓存/排队
        ...
```

---

## 9. 端到端案例：MLflow + vLLM + LangSmith + Prometheus

本节展示一个完整的生产流水线，使用 2026 年主流开源工具栈。

### 9.1 架构总览

```
┌─────────────────────────────────────────────────────────────────────┐
│                   End-to-End LLM Production Pipeline                 │
│                                                                     │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐     │
│  │  DVC    │   │  MLflow  │   │Eval Gate │   │   KServe     │     │
│  │  Data   │──▶│  Train   │──▶│(Promptfoo│──▶│  + vLLM      │     │
│  │  Store  │   │  + Track │   │+Ragas)   │   │  Serving     │     │
│  └─────────┘   └──────────┘   └──────────┘   └──────┬───────┘     │
│                                                      │              │
│                                                      ▼              │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────┐     │
│  │Prometheus│◀──│ Grafana  │◀──│LangSmith │◀──│  Application │     │
│  │ Alerts  │   │Dashboard │   │  Traces  │   │  Layer       │     │
│  └─────────┘   └──────────┘   └──────────┘   └──────────────┘     │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              GitHub Actions CI/CD Pipeline                   │    │
│  │  Prompt PR → Eval → Gate → Canary Deploy → Monitor → Promote│    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 数据阶段

```bash
# 数据版本化
dvc add data/training/ && git commit -m "training data v2.1"
dvc add data/eval/golden_set.json && git commit -m "golden set v3.0"

# 数据质量检查
python -m data.quality_check \
  --input data/training/ \
  --checks dedup,toxicity,pii,length \
  --output data/quality_report.json
```

### 9.3 训练阶段

```python
# train.py — MLflow 集成的 LoRA 训练脚本
import mlflow
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, get_peft_model

mlflow.set_experiment("medical-assistant-sft")

with mlflow.start_run():
    model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B")
    lora_config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"])
    model = get_peft_model(model, lora_config)

    mlflow.log_params({"lora_r": 16, "lora_alpha": 32, "base_model": "Llama-3.1-8B"})
    # ... training loop ...
    mlflow.transformers.log_model(model=model, tokenizer=tokenizer,
                                   artifact_path="model",
                                   registered_model_name="medical-assistant")
```

### 9.4 评估阶段

```python
# eval_pipeline.py — Ragas + Promptfoo 集成
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy

# 自动化评估
results = evaluate(
    dataset=eval_dataset,
    metrics=[faithfulness, answer_relevancy],
    llm=judge_llm,
)

gate_passed = (
    results["faithfulness"] >= 0.85 and
    results["answer_relevancy"] >= 0.80
)

if not gate_passed:
    raise EvalGateFailure(f"Gate failed: {results}")
```

### 9.5 部署阶段

```python
# deploy.py — vLLM + KServe 部署
import requests

# vLLM 服务配置 (通过 KServe InferenceService YAML 部署)
vllm_config = {
    "model": "s3://models/medical-assistant-v2.1",
    "tensor_parallel_size": 1,
    "max_model_len": 4096,
    "gpu_memory_utilization": 0.9,
    "enable_prefix_caching": True,  # 启用前缀缓存
}
```

### 9.6 监控阶段

```python
# instrumentation.py — LangSmith + Prometheus 集成
from langsmith import traceable
from prometheus_client import Histogram, Counter

LATENCY = Histogram("llm_request_duration_seconds", "Request latency",
                     buckets=[0.1, 0.5, 1, 2, 5, 10, 30])
TOKENS = Counter("llm_tokens_total", "Total tokens", ["type"])
COST = Counter("llm_cost_usd_total", "Total cost in USD")

@traceable(run_type="chain", name="medical-qa")
async def handle_query(query: str) -> str:
    with LATENCY.time():
        response = await llm.generate(query)

    TOKENS.labels(type="input").inc(response.usage.prompt_tokens)
    TOKENS.labels(type="output").inc(response.usage.completion_tokens)
    COST.inc(calculate_cost(response.usage))

    return response.content
```

### 9.7 完整 Pipeline 串联

```yaml
# 完整 CI/CD 流程
stages:
  - name: data-quality
    script: python -m data.quality_check

  - name: train
    script: python train.py
    artifacts:
      - model/

  - name: eval-gate
    script: python -m eval.run_gate
    gate:
      min_faithfulness: 0.85
      max_regression_pct: 2.0

  - name: deploy-canary
    script: kubectl apply -f kserve-canary.yaml
    canary_percent: 10

  - name: monitor-24h
    script: python -m monitor.canary_watch --duration 24h
    rollback_on:
      - error_rate > 0.1%
      - p99_latency > 10s

  - name: promote
    script: kubectl apply -f kserve-production.yaml
```

---

## 10. 相关文档

### 紧密关联

| 文档 | 关系 | 说明 |
|------|------|------|
| [[LLMOps_2026]] | 母文档 | LLMOps 理念与架构总览 |
| [[LLM_Evaluation_Pipeline]] | 子专题 | 评估方法论与工具深度展开 |
| [[ML_CI_CD]] | 子专题 | CI/CD 工程实践 |
| [[Model_Monitoring_and_Drift_Detection_2026]] | 子专题 | 漂移检测与在线监控 |
| [[LLM_Observability]] | 子专题 | 可观测性体系构建 |
| [[LLM_Cost_Latency_SLO]] | 子专题 | 成本与延迟 SLO 管理 |

### 工具深度文档

| 文档 | 说明 |
|------|------|
| [[运维/LangSmith_Deep_Dive]] | LangSmith 追踪与评估平台 |
| [[部署推理/Inference_Engines/vLLM_Deep_Dive]] | vLLM 高性能推理引擎 |
| [[Experiment_Tracking_Deep_Dive]] | 实验跟踪最佳实践 |
| [[Model_Registry_and_Cards_Deep_Dive]] | 模型注册与治理 |
| [[Data_Versioning_DVC_LakeFS]] | 数据版本化方案 |
| [[Cost_Optimization_MLOps]] | 成本优化策略 |

### 扩展阅读

| 文档 | 说明 |
|------|------|
| [[RAG_Pipeline_Ops]] | RAG 流水线运维 |
| [[Prompt_Engineering_Ops]] | Prompt 工程化运维 |
| [[Privacy_Compliance_Pipeline]] | 隐私合规流水线 |
| [[MLOps_Maturity_Model]] | MLOps 成熟度模型 |
| [[Automated_Retraining]] | 自动化重训练 |

---

> **下一步**: 如果你正在搭建第一条 LLM 生产流水线，建议从 **Prompt-Only 模式** 起步——先用 MLflow 做实验跟踪 + LangSmith 做 Trace + 一个简单的评估门禁，跑通后再逐步加入数据版本化、分布式训练、多模型路由等高级能力。
