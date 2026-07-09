---
title: "MLflow 实验追踪与模型管理 (MLflow)"
category: -concepts
tags: ["mlflow", "experiment-tracking", "model-registry", "mlops", "databricks"]
relationships:
  - target: "_concepts/wandb"
    type: related_to
  - target: "_concepts/agent-evaluation"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "MLflow 是 Databricks 开源的 ML 生命周期管理平台——提供实验追踪、模型注册、模型部署和项目复现。是 MLOps 领域最成熟的开源方案，LLM 时代也扩展了 LLM 评估功能。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.90
lifecycle: stable
tier: core
---

# MLflow 实验追踪与模型管理

> **一句话理解**: MLflow 是"ML 实验的 Git"——追踪每次实验的参数/指标/产物，让 ML 研究可复现、可比较、可部署。

---

## 1. 核心定位

| 维度 | 说明 |
|------|------|
| **开发商** | Databricks（原由 databricks 收购） |
| **开源协议** | Apache 2.0 |
| **GitHub** | 19K+ ⭐ |
| **核心价值** | ML 全生命周期管理 |
| **四大组件** | Tracking / Projects / Models / Registry |

---

## 2. 四大组件

```
┌─────────────────────────────────────────┐
│          MLflow 四大组件                │
├─────────────────────────────────────────┤
│                                         │
│  1. Tracking（实验追踪）                │
│     ├── 参数 (hyperparameters)          │
│     ├── 指标 (accuracy, loss...)        │
│     ├── 产物 (模型文件、图表)           │
│     └── 源码版本                        │
│                                         │
│  2. Projects（项目打包）                │
│     ├── MLproject 配置文件              │
│     ├── 可复现运行                      │
│     └── 参数化运行                      │
│                                         │
│  3. Models（模型部署）                  │
│     ├── 统一模型格式                   │
│     ├── 多后端 (sklearn, pytorch, ...)  │
│     └── 部署到 REST / Spark / K8s      │
│                                         │
│  4. Model Registry（模型注册表）        │
│     ├── 版本管理                        │
│     ├── 阶段标记 (Staging/Production)   │
│     └── 审批流程                        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. 核心用法

### 3.1 实验追踪

```python
import mlflow

# 启动实验
mlflow.set_experiment("llm-fine-tuning")

with mlflow.start_run(run_name="lora-r16"):
    # 记录参数
    mlflow.log_param("model", "Llama-3-8B")
    mlflow.log_param("lora_r", 16)
    mlflow.log_param("learning_rate", 2e-4)
    
    # 训练...
    for epoch in range(10):
        loss = train_step()
        mlflow.log_metric("loss", loss, step=epoch)
    
    # 记录模型
    mlflow.pytorch.log_model(model, "model")
```

### 3.2 LLM 评估（新功能）

```python
import mlflow
from mlflow.metrics.genai import answer_relevancy, faithfulness

# MLflow LLM 评估
results = mlflow.evaluate(
    data=eval_dataset,
    model=my_rag_model,
    evaluators="default",
    evaluator_config={
        "answer_relevancy": answer_relevancy(),
        "faithfulness": faithfulness(),
    }
)
```

### 3.3 模型注册与部署

```python
# 注册模型
mlflow.register_model(
    "runs:/run_id/model",
    "llm-rag-model"
)

# 部署到 REST 端点
mlflow models serve -m "models:/llm-rag-model/Production" -p 5000

# 调用
curl -X POST localhost:5000/invocations \
  -H "Content-Type: application/json" \
  -d '{"inputs": ["什么是 vLLM？"]}'
```

---

## 4. 与 W&B 对比

| 特性 | MLflow | Weights & Biases |
|------|--------|-----------------|
| **开源** | ✅ Apache 2.0 | ❌ (有开源客户端) |
| **自托管** | ✅ | ❌ (云服务) |
| **实验追踪** | ★★★★★ | ★★★★★ |
| **可视化** | 基础 | ★★★★★ 极强 |
| **模型部署** | ✅ 内置 | ❌ |
| **模型注册** | ✅ | ✅ |
| **LLM 评估** | ✅ 新增 | ✅ |
| **超参搜索** | 有限 | Sweeps |
| **企业采用** | ★★★★★ | ★★★★★ |

---

## 5. AI Stack 中的定位

```
┌─────────────────────────────────────────┐
│     ML 实验追踪选型                     │
├─────────────────────────────────────────┤
│                                         │
│  MLflow  ← 开源自托管、企业标配 ★      │
│  W&B     ← 可视化最强、研究首选         │
│  Neptune ← 轻量级替代                   │
│  TensorBoard ← 免费基础方案             │
│  Comet   ← 全功能平台                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. 关键要点

1. **开源免费**：Apache 2.0，企业可自托管，数据完全自主
2. **ML 标准**：MLOps 领域最成熟的开源方案，行业标准工具
3. **LLM 新能力**：新增 LLM 评估功能，支持 RAG/Agent 评估
4. **全生命周期**：从实验到注册到部署，覆盖 ML 全流程
5. **Databricks 生态**：与 Databricks 平台深度集成
6. **广泛采用**：几乎所有企业 ML 团队都在使用
