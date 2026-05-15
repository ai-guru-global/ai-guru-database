# MLOps 流水线 (MLOps Pipeline)

> **一句话理解**: MLOps 就像 DevOps 的"AI 版"——如果说开发一个模型像造一辆车，MLOps 就是建造并运营整条汽车生产线，确保模型能持续、稳定、高效地在生产环境中运行。

## 1. 概述 (Overview)

MLOps (Machine Learning Operations) 是将机器学习模型从实验环境稳定、高效地部署到生产环境，并进行持续监控和迭代的工程实践体系。它融合了机器学习、DevOps 和数据工程的最佳实践。

### 为什么需要 MLOps？

在没有 MLOps 的情况下，常见的问题是：
- **模型在笔记本上跑得很好，上线就崩**: 环境不一致、数据格式差异
- **实验无法复现**: 不知道哪个版本的数据、代码、超参产生了最优模型
- **模型逐渐"变坏"**: 线上数据分布漂移，模型性能下降却无人知晓
- **更新模型如同噩梦**: 手动流程、缺乏自动化测试和回滚机制

### MLOps 成熟度模型

```
Level 0: 手动流程
  Jupyter Notebook → 手动导出模型 → 手动部署
  问题: 不可复现，无法规模化

Level 1: ML Pipeline 自动化
  数据处理 → 训练 → 评估 → 部署 (Pipeline 自动化)
  特征存储 + 实验跟踪
  
Level 2: CI/CD for ML
  代码提交 → 自动测试 → 自动训练 → 自动评估 → 自动部署
  持续监控 → 自动触发再训练
  完整的反馈闭环
```

---

## 2. 核心概念 (Core Concepts)

### 2.1 ML 生命周期管理

```
完整的 ML 生命周期:

  [数据收集] → [数据处理] → [特征工程] → [模型训练] → [模型评估]
       ↑                                                    ↓
       │                                              [模型注册]
       │                                                    ↓
  [数据监控] ← [模型监控] ← [线上服务] ← [模型部署]
       ↑                                                    
       └──────── 反馈闭环（发现问题 → 再训练）──────────────┘
```

### 2.2 核心组件对比

| 组件 | 作用 | 代表工具 |
|------|------|---------|
| **版本控制** | 代码 + 数据 + 模型版本化 | Git, DVC, LakeFS |
| **实验跟踪** | 记录超参、指标、工件 | MLflow, W&B, Neptune |
| **Pipeline 编排** | 自动化训练流程 | Airflow, Kubeflow, Prefect |
| **特征存储** | 统一管理离线/在线特征 | Feast, Tecton, Hopsworks |
| **模型注册** | 模型版本管理与元数据 | MLflow Model Registry, Seldon |
| **模型服务** | 在线推理 API | vLLM, TorchServe, Triton |
| **监控告警** | 模型性能与数据质量监控 | Evidently, WhyLabs, Grafana |

---

## 3. 关键技术详解 (Key Techniques)

### 3.1 数据版本控制 (Data Version Control)

代码用 Git 版本控制，但数据文件（几 GB~TB）不适合放 Git。DVC 解决了这个问题。

**DVC 工作原理**:
```
├── data/
│   └── training_data.csv    ← 实际数据（不入 Git）
├── data/
│   └── training_data.csv.dvc ← DVC 元数据文件（入 Git）
├── .dvc/
│   └── config               ← 远程存储配置（S3/GCS）
└── dvc.lock                 ← Pipeline 锁定文件
```

```bash
# DVC 基本工作流
dvc init                           # 初始化 DVC
dvc add data/training_data.csv     # 跟踪数据文件
dvc remote add -d s3 s3://my-bucket/dvc-store  # 配置远程存储
dvc push                           # 推送数据到远程
git add data/.gitignore data/training_data.csv.dvc
git commit -m "Add training data v1"
dvc pull                           # 拉取数据
```

### 3.2 实验跟踪 (Experiment Tracking)

#### MLflow 实验跟踪

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score

# 设置实验
mlflow.set_experiment("credit_scoring_v2")

with mlflow.start_run(run_name="rf_baseline"):
    # 记录超参数
    params = {"n_estimators": 200, "max_depth": 10, "min_samples_split": 5}
    mlflow.log_params(params)
    
    # 训练模型
    model = RandomForestClassifier(**params, random_state=42)
    model.fit(X_train, y_train)
    
    # 记录指标
    y_pred = model.predict(X_test)
    mlflow.log_metric("accuracy", accuracy_score(y_test, y_pred))
    mlflow.log_metric("f1_score", f1_score(y_test, y_pred))
    
    # 保存模型
    mlflow.sklearn.log_model(model, "model")
    
    # 记录额外工件（如混淆矩阵图）
    # mlflow.log_artifact("confusion_matrix.png")
```

#### Weights & Biases (W&B) 实验跟踪

```python
import wandb

wandb.init(project="credit_scoring", name="rf_baseline", config={
    "n_estimators": 200, "max_depth": 10
})

# 训练循环中记录指标
for epoch in range(num_epochs):
    train_loss, val_loss = train_one_epoch(model, train_loader, val_loader)
    wandb.log({"train_loss": train_loss, "val_loss": val_loss, "epoch": epoch})

wandb.finish()
```

### 3.3 特征存储 (Feature Store)

特征存储统一管理离线训练和在线推理的特征，解决"训练-服务偏差" (Training-Serving Skew)。

```
特征存储架构:

  ┌──────────────────────────────────────────────┐
  │                Feature Store                  │
  │                                               │
  │  离线存储 (Batch)          在线存储 (Real-time) │
  │  ┌─────────────┐         ┌─────────────┐      │
  │  │ Parquet/     │ ──同步──→│ Redis/      │     │
  │  │ Delta Lake   │         │ DynamoDB    │      │
  │  └──────┬──────┘         └──────┬──────┘      │
  │         ↓                        ↓             │
  │    训练数据生成              在线特征查询         │
  └──────────────────────────────────────────────┘
         ↓                          ↓
    [模型训练]                 [模型推理服务]
```

#### Feast 使用示例

```python
from feast import FeatureStore

store = FeatureStore(repo_path="feature_repo/")

# 离线：获取训练数据（历史特征）
training_df = store.get_historical_features(
    entity_df=entity_df,  # 包含 entity_id 和 event_timestamp
    features=[
        "user_features:age",
        "user_features:total_purchases",
        "user_features:avg_order_value",
    ],
).to_df()

# 在线：获取实时推理特征
online_features = store.get_online_features(
    features=["user_features:age", "user_features:total_purchases"],
    entity_rows=[{"user_id": 12345}]
).to_dict()
```

### 3.4 模型监控与漂移检测 (Model Monitoring & Drift Detection)

#### 漂移类型

| 漂移类型 | 定义 | 检测方法 | 示例 |
|---------|------|---------|------|
| **数据漂移 (Data Drift)** | 输入特征分布变化 | PSI, KS 检验, KL 散度 | 用户年龄分布变化 |
| **概念漂移 (Concept Drift)** | 输入-输出关系变化 | 性能指标下降监控 | 用户行为模式变化 |
| **标签漂移 (Label Drift)** | 目标变量分布变化 | 标签分布统计 | 欺诈率季节性波动 |
| **预测漂移 (Prediction Drift)** | 模型预测分布变化 | 预测值分布监控 | 模型预测偏移 |

#### 使用 Evidently 检测数据漂移

```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset, TargetDriftPreset

# 比较参考数据集和当前数据集
report = Report(metrics=[
    DataDriftPreset(),      # 检测特征漂移
    TargetDriftPreset(),    # 检测标签漂移
])

report.run(
    reference_data=train_df,   # 训练时的数据分布
    current_data=production_df  # 当前生产数据
)

# 生成 HTML 报告
report.save_html("drift_report.html")

# 编程方式获取结果
result = report.as_dict()
drift_detected = result["metrics"][0]["result"]["dataset_drift"]
print(f"数据漂移检测: {'是' if drift_detected else '否'}")
```

### 3.5 CI/CD for ML

```
ML CI/CD Pipeline:

  代码提交 (Git Push)
       ↓
  [CI: 代码质量检查]
  - 单元测试
  - 代码风格 (Linting)
  - 数据验证（Schema 检查）
       ↓
  [CD: 模型训练与评估]
  - 触发训练 Pipeline
  - 自动评估（指标阈值检查）
  - A/B 测试或影子模式部署
       ↓
  [部署决策]
  - 指标优于当前模型 → 自动发布
  - 指标不达标 → 阻止发布，通知团队
       ↓
  [持续监控]
  - 模型性能指标
  - 数据漂移检测
  - 资源使用监控
```

---

## 4. 代码实战 (Hands-on Code)

### 4.1 完整的 MLflow Pipeline 示例

```python
import mlflow
from mlflow.tracking import MlflowClient

# 模型注册与版本管理
client = MlflowClient()

# 注册新模型
model_uri = f"runs:/{run_id}/model"
model_version = mlflow.register_model(model_uri, "credit_scoring_model")

# 模型阶段管理（生命周期）
client.transition_model_version_stage(
    name="credit_scoring_model",
    version=model_version.version,
    stage="Staging"    # None → Staging → Production → Archived
)

# 加载生产模型进行推理
production_model = mlflow.pyfunc.load_model(
    model_uri="models:/credit_scoring_model/Production"
)
predictions = production_model.predict(new_data)
```

### 4.2 GitHub Actions 自动化 ML Pipeline

```yaml
# .github/workflows/ml_pipeline.yml
name: ML Training Pipeline

on:
  push:
    paths: ['src/**', 'data/**', 'configs/**']

jobs:
  train-and-evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Pull data with DVC
        run: dvc pull
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      
      - name: Run training pipeline
        run: python src/train.py --config configs/production.yaml
      
      - name: Evaluate model
        run: python src/evaluate.py --threshold 0.85
      
      - name: Register model (if improved)
        if: success()
        run: python src/register_model.py
```

---

## 5. 应用场景与案例 (Applications & Cases)

### MLOps 工具选型指南

| 团队规模 | 推荐方案 | 说明 |
|---------|---------|------|
| **个人/小团队** | MLflow + DVC + GitHub Actions | 开源免费，学习成本低 |
| **中型团队** | W&B + Airflow + Seldon | 更好的协作和可视化 |
| **大型企业** | 云平台方案（SageMaker/Vertex AI）+ Feast + Kubeflow | 全托管，企业级支持 |

### 云平台 MLOps 对比

| 功能 | AWS SageMaker | Google Vertex AI | Azure ML | 
|------|--------------|-----------------|----------|
| 实验跟踪 | SageMaker Experiments | Vertex Experiments | ML Studio |
| Pipeline | SageMaker Pipelines | Vertex Pipelines | Azure Pipelines |
| 模型注册 | Model Registry | Model Registry | Model Registry |
| Feature Store | Feature Store | Feature Store | 需第三方 |
| 监控 | Model Monitor | Model Monitoring | 需第三方 |

---

## 6. 进阶话题 (Advanced Topics)

### 6.1 LLMOps — 大模型时代的 MLOps

传统 MLOps 聚焦分类/回归模型，LLMOps 面临新挑战：

| 维度 | 传统 MLOps | LLMOps |
|------|-----------|--------|
| 训练成本 | 数小时~数天 | 数周~数月，百万美元级 |
| 评估方式 | 固定指标（Accuracy/F1） | 人工评估 + LLM-as-Judge |
| 版本管理 | 模型权重 | 模型 + Prompt + RAG 配置 |
| 监控重点 | 预测准确率 | 幻觉率、安全性、延迟 |
| 反馈循环 | 标签收集 → 再训练 | 用户反馈 → Prompt 优化/微调 |

### 6.2 A/B 测试

```
A/B 测试架构:

用户请求 → [流量分配器] →  90% → 模型A (当前版本)
                          →  10% → 模型B (候选版本)
                                         ↓
                               [指标收集与统计检验]
                               - 转化率差异显著性
                               - p-value < 0.05?
                                         ↓
                               [决策: 发布或回滚]
```

### 6.3 常见陷阱

1. **训练-服务偏差 (Training-Serving Skew)**: 训练时和推理时的特征计算逻辑不一致 → 使用 Feature Store 统一
2. **数据泄露**: Pipeline 中数据处理顺序错误 → 严格的 Pipeline DAG 和数据验证
3. **过度工程**: 小团队引入过于复杂的 MLOps 平台 → 根据团队规模选择工具
4. **忽视监控**: 只关注部署不关注运行 → 上线第一天就配好监控告警

---

## 7. LLMOps 2026 最佳实践

> **一句话理解**: LLMOps是MLOps的"大模型升级版"——不仅关注模型训练和部署，更强调提示词版本控制、语义缓存、智能路由和Agent编排。

### 7.1 MLOps vs LLMOps 对比

| 维度 | 传统MLOps | LLMOps (2026) |
|------|----------|---------------|
| **版本控制** | 代码 + 数据 + 模型 | + 提示词 + RAG文档 + Agent配置 |
| **评估方式** | 准确率、F1、AUC | 语义评估、人工反馈、LLM-as-Judge |
| **推理优化** | 批处理、模型量化 | 连续批处理、FP8、投机解码 |
| **成本优化** | 模型压缩、蒸馏 | 智能路由、语义缓存、多层级优化 |
| **监控重点** | 数据漂移、概念漂移 | Token使用、延迟、幻觉检测 |
| **部署单元** | 单个模型 | 模型 + 提示 + 工具 + Agent |

### 7.2 三层缓存架构

```
┌─────────────────────────────────────────────────────────────┐
│                   LLMOps 三层缓存架构                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 3: 精确匹配缓存 (L1)                                   │
│  ├── 存储: Redis/Memory                                      │
│  ├── 键: 哈希(完整提示)                                       │
│  ├── 延迟: <1ms                                              │
│  └── 节省: 10-20%                                            │
│                                                              │
│  Layer 2: 语义缓存 (L2)                                       │
│  ├── 存储: Vector DB + Redis                                 │
│  ├── 相似度: >0.95 (Cosine)                                  │
│  ├── 延迟: 5-10ms                                            │
│  └── 节省: 30-50%                                            │
│                                                              │
│  Layer 1: LLM调用 (L3)                                        │
│  ├── 实际请求LLM API                                          │
│  ├── 延迟: 100-500ms                                         │
│  └── 成本: 基准                                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘

总节省: 40-70% (典型工作负载)
```

**语义缓存实现**:
```python
class SemanticCache:
    def __init__(self):
        self.redis = Redis()
        self.vector_db = Pinecone()
        self.embeddings = OpenAIEmbeddings()
    
    async def get(self, query: str) -> Optional[str]:
        # L1: 精确匹配
        cache_key = hash(query)
        if cached := await self.redis.get(cache_key):
            return cached
        
        # L2: 语义匹配
        query_vec = await self.embeddings.embed(query)
        similar = await self.vector_db.query(
            query_vec, 
            top_k=1,
            threshold=0.95
        )
        
        if similar:
            return similar[0].response
        return None
    
    async def set(self, query: str, response: str):
        # 存储到L1和L2
        await self.redis.set(hash(query), response, ex=3600)
        
        query_vec = await self.embeddings.embed(query)
        await self.vector_db.upsert(
            id=hash(query),
            vector=query_vec,
            metadata={"response": response}
        )
```

### 7.3 智能路由与成本优化

**路由策略**:
```python
class LLMRouter:
    def __init__(self):
        self.models = {
            "gpt-4o-mini": {"cost": 0.15, "strength": "simple"},
            "gpt-4o": {"cost": 5.0, "strength": "complex"},
            "claude-haiku": {"cost": 0.25, "strength": "simple"},
        }
    
    async def route(self, query: str, context: dict) -> str:
        # 基于复杂度路由
        complexity = await self._classify_complexity(query)
        
        if complexity == "simple":
            return "gpt-4o-mini"  # 节省90%成本
        elif complexity == "medium":
            return "claude-haiku"
        else:
            return "gpt-4o"
    
    async def _classify_complexity(self, query: str) -> str:
        # 简单启发式规则
        if len(query) < 100 and not any(kw in query for kw in ["代码", "分析", "推理"]):
            return "simple"
        elif "```" in query or len(query) > 500:
            return "complex"
        return "medium"
```

**级联路由 (Cascading)**:
```python
async def cascade_route(query: str) -> Response:
    """先尝试便宜模型，不满意再升级"""
    
    # Tier 1: 便宜模型
    response = await call("gpt-4o-mini", query)
    confidence = await evaluate_quality(response)
    
    if confidence > 0.8:
        return response  # 省钱！
    
    # Tier 2: 升级模型
    return await call("gpt-4o", query)
```

**成本优化效果**:
| 策略 | 节省比例 | 实现复杂度 |
|------|---------|-----------|
| 智能路由 | 40-70% | 低 |
| 语义缓存 | 40-50% | 中 |
| 提示压缩 | 20-30% | 低 |
| **组合使用** | **70-90%** | 中 |

### 7.4 LLM评估与CI/CD

**语义评估流水线**:
```yaml
# .github/workflows/llm-evaluation.yml
name: LLM Evaluation

on:
  push:
    paths:
      - 'prompts/**'
      - 'configs/**'

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # 运行语义评估
      - name: Semantic Evaluation
        run: |
          python -m evaluation.evaluate \
            --test-suite tests/golden_set.json \
            --metrics bleu,rouge,llm_judge \
            --threshold 0.85
      
      # 幻觉检测
      - name: Hallucination Check
        run: |
          python -m evaluation.hallucination_detection \
            --sample-size 100 \
            --max-hallucination-rate 0.05
      
      # 成本基准测试
      - name: Cost Benchmark
        run: |
          python -m evaluation.cost_benchmark \
            --max-cost-per-request 0.01
```

**LLM-as-Judge评估**:
```python
async def llm_judge_evaluate(prediction: str, ground_truth: str) -> dict:
    """使用LLM作为评估器"""
    
    prompt = f"""
    请评估以下预测结果与标准答案的一致性。
    
    标准答案: {ground_truth}
    预测结果: {prediction}
    
    请输出:
    1. 一致性评分 (0-10)
    2. 评估理由
    3. 改进建议
    """
    
    response = await llm.generate(prompt)
    
    return {
        "score": parse_score(response),
        "reasoning": response.reasoning,
        "passed": score >= 7.0
    }
```

### 7.5 Prompt版本控制

```
prompts/
├── system/
│   ├── v1.0.0/
│   │   └── customer_service.txt    # 初始版本
│   ├── v1.1.0/
│   │   └── customer_service.txt    # 添加了退货政策
│   └── v2.0.0/
│       └── customer_service.txt    # 重构提示结构
│
└── user/
    ├── v1.0.0/
    └── v1.1.0/
```

**版本管理代码**:
```python
from pathlib import Path

class PromptRegistry:
    def __init__(self, prompts_dir: str):
        self.prompts_dir = Path(prompts_dir)
    
    def load(self, name: str, version: str) -> str:
        prompt_path = self.prompts_dir / name / version / "prompt.txt"
        return prompt_path.read_text()
    
    def list_versions(self, name: str) -> list:
        prompt_dir = self.prompts_dir / name
        return sorted([d.name for d in prompt_dir.iterdir() if d.is_dir()])
    
    def compare_versions(self, name: str, v1: str, v2: str) -> dict:
        """对比两个版本的差异"""
        p1 = self.load(name, v1)
        p2 = self.load(name, v2)
        return {
            "added": len(set(p2.split()) - set(p1.split())),
            "removed": len(set(p1.split()) - set(p2.split())),
        }
```

### 7.6 Agent编排与监控

**Agent编排**:
```python
# 多Agent工作流编排
class AgentOrchestrator:
    def __init__(self):
        self.agents = {
            "research": ResearchAgent(),
            "writer": WriterAgent(),
            "reviewer": ReviewerAgent()
        }
    
    async def execute_workflow(self, task: str) -> str:
        # 研究
        research_result = await self.agents["research"].run(task)
        
        # 写作
        draft = await self.agents["writer"].run(research_result)
        
        # 审核
        final = await self.agents["reviewer"].run(draft)
        
        return final
```

**可观测性**:
```python
# Agent追踪
@traceable(name="research_agent")
async def research_agent(query: str):
    # 自动追踪:
    # - LLM调用次数
    # - Token使用量
    # - 工具调用序列
    # - 执行时间
    pass

# 监控指标
METRICS = {
    "llm_cost_per_request": Histogram(),
    "llm_latency_seconds": Histogram(),
    "token_usage_total": Counter(),
    "cache_hit_rate": Gauge(),
    "routing_accuracy": Gauge(),
}
```

### 7.7 LLMOps工具链 (2026)

| 类别 | 工具 | 用途 |
|------|------|------|
| **Prompt管理** | Langfuse, Promptlayer | 版本控制、A/B测试 |
| **评估** | TruLens, Ragas, Arize | 语义评估、幻觉检测 |
| **路由** | LiteLLM, Bifrost | 智能路由、成本控制 |
| **缓存** | Redis, LangCache | 语义缓存 |
| **观测** | LangSmith, Langfuse | Agent追踪、成本监控 |
| **网关** | Portkey, Kong AI | 统一入口、治理 |

**参考**: [AI Infrastructure 2026](../12_Architecture_Infrastructure/AI_Infrastructure_2026.md)

---

## 8. 与其他主题的关联 (Connections)

### 前置知识
- [监督学习](../../02_Machine_Learning/Supervised_Learning/Supervised_Learning.md) — 理解模型训练流程
- [特征工程](../../02_Machine_Learning/Feature_Engineering/Feature_Engineering.md) — Feature Store 的基础
- [分布式系统](../../01_Fundamentals/Distributed_Systems/Distributed_Systems.md) — 分布式训练基础设施

### 进阶方向
- [模型部署与推理](../09_Deployment_Inference/Deployment_Inference.md) — MLOps 的推理服务层
- [模型评估](../08_Model_Evaluation/Model_Evaluation.md) — Pipeline 中的评估环节
- [RAG 系统](../11_RAG_Systems/RAG_Systems.md) — LLMOps 中 RAG Pipeline 的管理

---

## 9. 面试高频问题 (Interview FAQs)

**Q1: MLOps 和 DevOps 的核心区别是什么？**
> MLOps 除了代码版本控制外，还需要管理数据版本、模型版本和实验元数据。此外，ML 系统的"构建"不仅是编译代码，而是训练模型——这个过程是非确定性的。ML 系统还面临独特挑战：数据漂移、概念漂移、训练-服务偏差等。

**Q2: 什么是训练-服务偏差？如何解决？**
> 指训练时使用的特征和推理时使用的特征计算方式不一致，导致模型线上表现不如预期。例如，训练时用全量数据计算均值做标准化，但线上只能用历史窗口数据。解决方案：(1) 使用 Feature Store 统一离线和在线特征计算；(2) 在 Pipeline 中保存预处理参数；(3) 端到端测试验证一致性。

**Q3: 如何检测模型是否需要重新训练？**
> (1) 监控模型性能指标是否下降；(2) 使用 PSI/KS 检验检测数据漂移；(3) 监控预测分布变化；(4) 设置基于规则的触发器（如 AUC 下降 >2%、PSI >0.25 自动触发再训练）。

**Q4: 为什么需要 Feature Store？**
> Feature Store 解决三个问题：(1) 训练-服务一致性——同一份特征计算逻辑同时服务训练和推理；(2) 特征复用——不同模型/团队可以共享特征，避免重复计算；(3) 时间旅行——可以获取任意历史时间点的特征快照，避免数据泄露。

**Q5: 小团队应该如何开始实施 MLOps？**
> 从最痛点开始，逐步建设：(1) 第一步：用 Git 管理代码 + MLflow 跟踪实验（几小时搞定）；(2) 第二步：用 DVC 管理数据版本；(3) 第三步：用 GitHub Actions 自动化训练和评估；(4) 第四步：加入模型监控（Evidently）。不要一开始就引入 Kubeflow/Airflow，等团队和模型规模增长后再考虑。

---

## 10. 参考资源 (References)

### 经典文献
- [Hidden Technical Debt in Machine Learning Systems (Sculley et al., 2015)](https://papers.nips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html) — ML 系统技术债务的经典论文
- [MLOps: Continuous delivery and automation pipelines in ML (Google Cloud)](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning) — Google 的 MLOps 成熟度模型

### 开源工具
- [MLflow](https://mlflow.org/) — 实验跟踪 + 模型注册
- [DVC](https://dvc.org/) — 数据版本控制
- [Feast](https://feast.dev/) — 开源 Feature Store
- [Evidently AI](https://www.evidentlyai.com/) — 模型监控与漂移检测
- [Kubeflow](https://www.kubeflow.org/) — Kubernetes 上的 ML Pipeline
- [Weights & Biases](https://wandb.ai/) — 实验跟踪与可视化

### 教程
- [Made With ML - MLOps Course](https://madewithml.com/) — 免费 MLOps 实战课程
- [Full Stack Deep Learning](https://fullstackdeeplearning.com/) — ML 工程化最佳实践

---
*Last updated: 2026-04-01*
*Version: 2.0.0 - LLMOps Update*
