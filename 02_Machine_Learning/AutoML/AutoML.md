# AutoML - 自动化机器学习

> **一句话秒懂**: AutoML 就是让机器学习自己学会怎么学——自动选模型、调参数、做特征工程，让你从"炼丹师"变成"指挥官"。

## 目录

- [什么是 AutoML](#什么是-automl)
- [AutoML 工作流程](#automl-工作流程)
- [自动化特征工程](#自动化特征工程)
- [模型选择](#模型选择)
- [超参数优化](#超参数优化)
- [Optuna 深度解析](#optuna-深度解析)
- [Ray Tune 分布式 HPO](#ray-tune-分布式-hpo)
- [神经架构搜索 NAS](#神经架构搜索-nas)
- [AutoML 平台对比](#automl-平台对比)
- [实战工作流与最佳实践](#实战工作流与最佳实践)

---

## 什么是 AutoML

AutoML（Automated Machine Learning）旨在将机器学习 pipeline 中的重复性、高门槛步骤自动化，降低 ML 应用门槛、提升效率。

```mermaid
graph LR
    A[原始数据] --> B[数据预处理]
    B --> C[特征工程]
    C --> D[模型选择]
    D --> E[超参数优化]
    E --> F[模型评估]
    F -->|不满意| D
    F -->|满意| G[部署上线]

    style A fill:#e1f5fe
    style G fill:#c8e6c9
    style D fill:#fff9c4
    style E fill:#fff9c4
```

**手动 vs AutoML 对比：**

| 步骤 | 手动流程 | AutoML 流程 |
|------|----------|-------------|
| 特征工程 | 领域专家手动构造 | 自动生成候选特征 |
| 模型选择 | 试错法逐一测试 | 智能搜索空间遍历 |
| 超参数调优 | 网格搜索/经验值 | 贝叶斯优化/进化算法 |
| 耗时 | 数天到数周 | 数分钟到数小时 |
| 门槛 | 需要 ML 专家 | 数据科学家即可 |

---

## AutoML 工作流程

```mermaid
flowchart TB
    subgraph 数据准备
        A1[数据收集] --> A2[数据清洗]
        A2 --> A3[数据分割]
    end

    subgraph 自动搜索
        B1[特征工程<br/>Featuretools] --> B2[模型候选集<br/>Auto-sklearn/FLAML]
        B2 --> B3[超参数优化<br/>Optuna/Ray Tune]
        B3 --> B4[交叉验证评估]
        B4 -->|next trial| B2
    end

    subgraph 输出
        C1[最优 Pipeline]
        C2[模型报告]
        C3[部署包]
    end

    A3 --> B1
    B4 -->|搜索结束| C1
    B4 -->|搜索结束| C2
    C1 --> C3
```

---

## 自动化特征工程

### Featuretools

Featuretools 是最流行的自动化特征工程库，核心概念是 **深度特征合成（Deep Feature Synthesis, DFS）**。

```mermaid
graph TD
    subgraph 实体关系
        Customers[客户表<br/>customer_id, age, region]
        Transactions[交易表<br/>transaction_id, customer_id, amount, time]
        Products[产品表<br/>product_id, category, price]
    end

    Customers -->|1:N| Transactions
    Products -->|1:N| Transactions

    subgraph 自动生成特征
        F1[客户总消费金额]
        F2[客户平均交易额]
        F3[客户交易频率]
        F4[客户最近交易时间]
        F5[客户购买品类数]
    end

    Transactions --> F1
    Transactions --> F2
    Transactions --> F3
    Transactions --> F4
    Transactions --> F5
```

```python
import featuretools as ft
import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "age": [25, 40, 35],
    "region": ["北京", "上海", "广州"],
})

transactions = pd.DataFrame({
    "transaction_id": [1, 2, 3, 4, 5, 6],
    "customer_id": [1, 1, 2, 2, 3, 3],
    "amount": [100, 200, 150, 300, 50, 80],
    "time": pd.to_datetime([
        "2024-01-01", "2024-01-15", "2024-01-05",
        "2024-02-01", "2024-01-20", "2024-02-10",
    ]),
})

es = ft.EntitySet(id="retail")
es = es.add_dataframe(
    dataframe_name="customers",
    dataframe=customers,
    index="customer_id",
)
es = es.add_dataframe(
    dataframe_name="transactions",
    dataframe=transactions,
    index="transaction_id",
    time_index="time",
)
es = es.add_relationship("customers", "customer_id", "transactions", "customer_id")

feature_matrix, feature_defs = ft.dfs(
    entityset=es,
    target_dataframe_name="customers",
    agg_primitives=["sum", "mean", "count", "max", "min"],
    trans_primitives=["month", "year", "day"],
    max_depth=2,
)

print(feature_matrix.head())
print(f"\n自动生成了 {len(feature_defs)} 个特征")
```

**常用聚合原语（Aggregation Primitives）：**

| 原语 | 功能 | 适用场景 |
|------|------|----------|
| `sum` | 求和 | 消费总额、点击总量 |
| `mean` | 均值 | 平均交易额 |
| `count` | 计数 | 交易次数 |
| `mode` | 众数 | 最常购买品类 |
| `std` | 标准差 | 行为稳定性 |
| `median` | 中位数 | 抗异常值统计 |
| `trend` | 趋势 | 消费趋势变化 |
| `time_since_last` | 距上次时间 | 活跃度度量 |

---

## 模型选择

### Auto-sklearn

基于 Bayesian Optimization + Meta-learning 自动选择 sklearn pipeline。

```python
from autosklearn.classification import AutoSklearnClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

automl = AutoSklearnClassifier(
    time_left_for_this_task=300,
    per_run_time_limit=30,
    n_jobs=-1,
    metric="accuracy",
)
automl.fit(X_train, y_train)

print(f"测试集准确率: {automl.score(X_test, y_test):.4f}")
print(automl.sprint_statistics())
print(automl.leaderboard())
```

### FLAML（Fast and Lightweight AutoML）

微软出品，高效且轻量，特别适合资源有限场景。

```python
from flaml import AutoML
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split

X, y = load_diabetes(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

automl = AutoML()
automl.fit(
    X_train, y_train,
    task="regression",
    metric="rmse",
    time_budget=120,
    estimator_list=["xgboost", "lgbm", "rf", "extra_tree"],
    ensemble=True,
)

print(f"最佳模型: {automl.best_estimator}")
print(f"最佳配置: {automl.best_config}")
print(f"最佳损失: {automl.best_loss:.4f}")
print(f"测试 R²: {automl.score(X_test, y_test):.4f}")
```

### TPOT

基于遗传编程的 AutoML，自动搜索最优 pipeline。

```python
from tpot import TPOTClassifier
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split

X, y = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

tpot = TPOTClassifier(
    generations=10,
    population_size=50,
    verbosity=2,
    random_state=42,
    n_jobs=-1,
)
tpot.fit(X_train, y_train)

print(f"测试集准确率: {tpot.score(X_test, y_test):.4f}")
tpot.export("best_pipeline.py")
```

**模型选择工具对比：**

| 特性 | Auto-sklearn | FLAML | TPOT |
|------|-------------|-------|------|
| 搜索策略 | 贝叶斯 + 元学习 | 经济型 CFL | 遗传编程 |
| 速度 | 中等 | 快 | 慢 |
| 可扩展性 | 一般 | 好 | 一般 |
| 支持任务 | 分类/回归 | 分类/回归/时序 | 分类/回归 |
| 集成学习 | 支持 | 支持 | 支持 |
| 输出 Pipeline | sklearn pipeline | 配置字典 | Python 脚本 |
| 适合场景 | 通用 ML | 快速实验 | 探索性分析 |

---

## 超参数优化

### 方法总览

```mermaid
graph TD
    HPO[超参数优化 HPO] --> GS[网格搜索<br/>Grid Search]
    HPO --> RS[随机搜索<br/>Random Search]
    HPO --> BO[贝叶斯优化<br/>Bayesian Optimization]
    HPO --> MB[多臂赌博机<br/>Multi-fidelity]

    BO --> GP[高斯过程<br/>GP-based]
    BO --> TPE[TPE<br/>Tree Parzen Estimator]
    BO --> SMAC[SMAC<br/>Random Forest]

    MB --> HB[Hyperband<br/>ASHA]
    MB --> BOHB[BOHB<br/>Bayesian + Hyperband]

    style TPE fill:#fff9c4
    style BOHB fill:#fff9c4
```

### 方法详细对比

| 方法 | 原理 | 优点 | 缺点 | 适用场景 |
|------|------|------|------|----------|
| 网格搜索 | 遍历所有组合 | 简单、可并行 | 维度灾难 | 低维、预算充足 |
| 随机搜索 | 随机采样 | 比网格搜索高效 | 可能错过最优点 | 中等维度 |
| 贝叶斯优化(GP) | 概率代理模型 | 样本效率高 | 高维计算贵 | 昂贵评估函数 |
| TPE | 核密度估计 | 处理高维好 | 需要足够样本 | 通用场景 |
| Hyperband/ASHA | 逐级淘汰 | 高效利用资源 | 可能丢好配置 | 大搜索空间 |
| BOHB | 贝叶斯+淘汰 | 兼顾效率与质量 | 实现复杂 | 大规模搜索 |

### 网格搜索 vs 随机搜索可视化

```
网格搜索 (Grid Search)              随机搜索 (Random Search)
┌─────────────────────────┐     ┌─────────────────────────┐
│  ·  ·  ·  ·  ·  ·  ·  │     │  ·     ·  ·       ·     │
│  ·  ·  ·  ·  ·  ·  ·  │     │     ·        ·  ·       │
│  ·  ·  ★  ·  ·  ·  ·  │     │  ·     ★        ·    ·  │
│  ·  ·  ·  ·  ·  ·  ·  │     │     ·     ·        ·   │
│  ·  ·  ·  ·  ·  ·  ·  │     │  ·        ·  ·         │
│  ·  ·  ·  ·  ·  ·  ·  │     │     ·  ·       ·    ·  │
└─────────────────────────┘     └─────────────────────────┘
  均匀覆盖但浪费在差区域           随机探索更容易找到好区域
  ★ = 最优参数组合                 ★ = 最优参数组合
```

### 贝叶斯优化流程

```mermaid
sequenceDiagram
    participant O as 优化器
    participant S as 代理模型(高斯过程)
    participant E as 目标函数

    O->>S: 初始随机采样几个点
    loop 迭代优化
        S->>O: 返回采集函数最大值点
        O->>E: 评估该点的超参数
        E-->>O: 返回性能指标
        O->>S: 更新代理模型
    end
    O->>O: 返回最优超参数
```

```python
from skopt import BayesSearchCV
from skopt.space import Real, Integer, Categorical
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

search_space = {
    "n_estimators": Integer(50, 500),
    "max_depth": Integer(3, 15),
    "learning_rate": Real(0.01, 0.3, prior="log-uniform"),
    "min_samples_split": Integer(2, 20),
    "subsample": Real(0.6, 1.0),
}

opt = BayesSearchCV(
    GradientBoostingClassifier(random_state=42),
    search_space,
    n_iter=50,
    cv=5,
    scoring="accuracy",
    random_state=42,
    n_jobs=-1,
)
opt.fit(X_train, y_train)

print(f"最佳参数: {opt.best_params_}")
print(f"最佳分数: {opt.best_score_:.4f}")
print(f"测试分数: {opt.score(X_test, y_test):.4f}")
```

---

## Optuna 深度解析

Optuna 是目前最流行的超参数优化框架，核心特性：**Define-by-Run** API、TPE 采样器、高效剪枝。

### 核心概念

```mermaid
graph TD
    Study[Study<br/>优化任务] --> T1[Trial 1]
    Study --> T2[Trial 2]
    Study --> T3[Trial 3]
    Study --> TN[Trial N...]

    T1 --> S1[Suggest 参数]
    S1 --> E1[评估目标函数]
    E1 --> R1[记录结果]

    T2 --> S2[Suggest 参数]
    S2 --> E2[评估目标函数]
    E2 --> P2{剪枝?}
    P2 -->|是| PRUNE[剪枝终止]
    P2 -->|否| R2[记录结果]

    style Study fill:#e1f5fe
    style PRUNE fill:#ffcdd2
```

| 概念 | 说明 | 类比 |
|------|------|------|
| Study | 一次完整的优化任务 | 一场考试 |
| Trial | 一次参数试验 | 考试中的一道题 |
| Suggest | 采样一个参数值 | 填写答案 |
| Objective | 评估函数 | 评分标准 |
| Pruning | 提前终止差的 trial | 答不出来就跳过 |
| Distribution | 参数分布 | 答案的可选范围 |

### 基础用法

```python
import optuna
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
import numpy as np

def objective(trial):
    n_estimators = trial.suggest_int("n_estimators", 50, 500)
    max_depth = trial.suggest_int("max_depth", 3, 20)
    min_samples_split = trial.suggest_int("min_samples_split", 2, 20)
    min_samples_leaf = trial.suggest_int("min_samples_leaf", 1, 10)
    max_features = trial.suggest_categorical("max_features", ["sqrt", "log2", None])
    bootstrap = trial.suggest_categorical("bootstrap", [True, False])

    clf = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf,
        max_features=max_features,
        bootstrap=bootstrap,
        random_state=42,
        n_jobs=-1,
    )

    X, y = load_breast_cancer(return_X_y=True)
    scores = cross_val_score(clf, X, y, cv=5, scoring="accuracy")
    return scores.mean()

study = optuna.create_study(
    direction="maximize",
    sampler=optuna.samplers.TPESampler(seed=42),
)

study.optimize(objective, n_trials=100, show_progress_bar=True)

print(f"最佳准确率: {study.best_value:.4f}")
print(f"最佳参数: {study.best_params}")
```

### 进阶：剪枝（Pruning）

```python
import optuna
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
import torch
import torch.nn as nn
import torch.optim as optim

def objective_with_pruning(trial):
    lr = trial.suggest_float("lr", 1e-5, 1e-1, log=True)
    hidden_dim = trial.suggest_int("hidden_dim", 32, 256)
    n_layers = trial.suggest_int("n_layers", 1, 4)
    dropout = trial.suggest_float("dropout", 0.1, 0.5)

    X, y = load_digits(return_X_y=True)
    X_train, X_val, y_train, y_val = train_test_split(
        X / 16.0, y, test_size=0.2, random_state=42
    )

    X_train_t = torch.FloatTensor(X_train)
    y_train_t = torch.LongTensor(y_train)
    X_val_t = torch.FloatTensor(X_val)
    y_val_t = torch.LongTensor(y_val)

    layers = [nn.Linear(64, hidden_dim), nn.ReLU(), nn.Dropout(dropout)]
    for _ in range(n_layers - 1):
        layers.extend([
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
        ])
    layers.append(nn.Linear(hidden_dim, 10))
    model = nn.Sequential(*layers)

    optimizer = optim.Adam(model.parameters(), lr=lr)
    criterion = nn.CrossEntropyLoss()

    for epoch in range(50):
        model.train()
        optimizer.zero_grad()
        output = model(X_train_t)
        loss = criterion(output, y_train_t)
        loss.backward()
        optimizer.step()

        model.eval()
        with torch.no_grad():
            val_output = model(X_val_t)
            val_acc = (val_output.argmax(1) == y_val_t).float().mean().item()

        trial.report(val_acc, epoch)
        if trial.should_prune():
            raise optuna.TrialPruned()

    return val_acc

study = optuna.create_study(direction="maximize")
study.optimize(objective_with_pruning, n_trials=50)

print(f"最佳准确率: {study.best_value:.4f}")
print(f"最佳参数: {study.best_params}")
```

### Optuna 可视化

```python
import optuna

study = optuna.load_study(study_name="my_study", storage="sqlite:///optuna.db")

fig1 = optuna.visualization.plot_optimization_history(study)
fig1.show()

fig2 = optuna.visualization.plot_param_importances(study)
fig2.show()

fig3 = optuna.visualization.plot_parallel_coordinate(study)
fig3.show()

fig4 = optuna.visualization.plot_contour(study, params=["lr", "hidden_dim"])
fig4.show()

fig5 = optuna.visualization.plot_slice(study, params=["n_layers", "dropout"])
fig5.show()
```

### 采样器对比

| 采样器 | 原理 | 何时使用 |
|--------|------|----------|
| `TPESampler` | 核密度估计分离好/坏参数 | 通用默认选择 |
| `GPSampler` | 高斯过程回归 | 昂贵评估（<100次） |
| `CMAESampler` | 协方差矩阵自适应进化 | 连续参数空间 |
| `NSGAIISampler` | 多目标进化算法 | 多目标优化 |
| `BruteForceSampler` | 穷举搜索 | 小搜索空间验证 |
| `RandomSampler` | 纯随机采样 | Baseline 对比 |

---

## Ray Tune 分布式 HPO

Ray Tune 是分布式超参数优化框架，支持大规模并行搜索。

```mermaid
graph TD
    Driver[Ray Driver] --> W1[Worker 1<br/>Trial A]
    Driver --> W2[Worker 2<br/>Trial B]
    Driver --> W3[Worker 3<br/>Trial C]
    Driver --> W4[Worker 4<br/>Trial D]

    W1 -->|结果| SearchAlg[搜索算法<br/>Optuna/Ax]
    W2 -->|结果| SearchAlg
    W3 -->|结果| SearchAlg
    W4 -->|结果| SearchAlg

    SearchAlg -->|新参数| Scheduler[调度器<br/>ASHA]
    Scheduler -->|分配| Driver

    style Driver fill:#e1f5fe
    style SearchAlg fill:#fff9c4
    style Scheduler fill:#c8e6c9
```

```python
from ray import tune
from ray.tune.search.optuna import OptunaSearch
from ray.tune.schedulers import ASHAScheduler
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

def trainable(config):
    X, y = load_breast_cancer(return_X_y=True)
    clf = GradientBoostingClassifier(
        n_estimators=config["n_estimators"],
        max_depth=config["max_depth"],
        learning_rate=config["learning_rate"],
        min_samples_split=config["min_samples_split"],
        subsample=config["subsample"],
        random_state=42,
    )
    scores = cross_val_score(clf, X, y, cv=5, scoring="accuracy")
    tune.report(accuracy=scores.mean(), loss=1.0 - scores.mean())

search_space = {
    "n_estimators": tune.randint(50, 500),
    "max_depth": tune.randint(3, 15),
    "learning_rate": tune.loguniform(1e-3, 0.3),
    "min_samples_split": tune.randint(2, 20),
    "subsample": tune.uniform(0.6, 1.0),
}

scheduler = ASHAScheduler(
    max_t=100,
    grace_period=10,
    reduction_factor=3,
)

tuner = tune.Tuner(
    trainable,
    tune_config=tune.TuneConfig(
        search_alg=OptunaSearch(),
        scheduler=scheduler,
        num_samples=100,
        metric="accuracy",
        mode="max",
    ),
    param_space=search_space,
)

results = tuner.fit()
best = results.get_best_result()
print(f"最佳准确率: {best.metrics['accuracy']:.4f}")
print(f"最佳配置: {best.config}")
```

**Ray Tune 支持的搜索算法：**

| 搜索算法 | 集成 | 特点 |
|-----------|------|------|
| Optuna | `OptunaSearch` | TPE，通用 |
| Ax (BoTorch) | `AxSearch` | 贝叶斯优化，实验设计 |
| HyperOpt | `HyperOptSearch` | TPE，成熟稳定 |
| BayesOpt | `BayesOptSearch` | 高斯过程 |
| FLAML | `FLAMLSearch` | 经济型搜索 |
| HEBO | `HEBOSearch` | 多目标贝叶斯优化 |
| Dragonfly | `DragonflySearch` | 黑箱优化 |

---

## 神经架构搜索 NAS

```mermaid
graph TD
    NAS[神经架构搜索] --> SearchSpace[搜索空间]
    NAS --> SearchStrategy[搜索策略]
    NAS --> EvalStrategy[评估策略]

    SearchSpace --> SS1[链式结构]
    SearchSpace --> SS2[Cell-based]
    SearchSpace --> SS3[层次结构]

    SearchStrategy --> ST1[随机搜索]
    SearchStrategy --> ST2[进化算法]
    SearchStrategy --> ST3[强化学习]
    SearchStrategy --> ST4[可微搜索 DARTS]

    EvalStrategy --> E1[完整训练]
    EvalStrategy --> E2[代理模型]
    EvalStrategy --> E3[权重共享]
    EvalStrategy --> E4[早停]

    style DARTS fill:#fff9c4
```

### DARTS 简化示例

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class DARTSCell(nn.Module):
    def __init__(self, input_dim, output_dim, num_ops=4):
        super().__init__()
        self.ops = nn.ModuleList([
            nn.Linear(input_dim, output_dim),
            nn.Sequential(nn.Linear(input_dim, output_dim), nn.ReLU()),
            nn.Sequential(nn.Linear(input_dim, output_dim), nn.Tanh()),
            nn.Identity() if input_dim == output_dim else nn.Linear(input_dim, output_dim),
        ])
        self.alpha = nn.Parameter(torch.zeros(num_ops))

    def forward(self, x):
        weights = F.softmax(self.alpha, dim=0)
        out = sum(w * op(x) for w, op in zip(weights, self.ops))
        return out


class DARTSNetwork(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_classes, num_cells=3):
        super().__init__()
        self.cells = nn.ModuleList()
        dim = input_dim
        for i in range(num_cells):
            out_dim = hidden_dim if i < num_cells - 1 else num_classes
            self.cells.append(DARTSCell(dim, out_dim))
            dim = out_dim

    def forward(self, x):
        for cell in self.cells:
            x = cell(x)
        return x

    def get_architecture(self):
        arch = []
        for cell in self.cells:
            idx = cell.alpha.argmax().item()
            arch.append(idx)
        return arch
```

---

## AutoML 平台对比

```mermaid
graph LR
    subgraph 开源方案
        ASK[Auto-sklearn]
        FL[FLAML]
        TP[TPOT]
        EF[EvalML]
    end

    subgraph 云服务
        GCP[Google Vertex AI<br/>AutoML]
        H2O[H2O AutoML]
        AZ[Azure AutoML]
        AWS[SageMaker<br/>Autopilot]
    end

    subgraph 优化框架
        OPT[Optuna]
        RAY[Ray Tune]
        AX[Ax/BoTorch]
        SM[SigOpt]
    end

    style GCP fill:#e1f5fe
    style H2O fill:#c8e6c9
    style AZ fill:#e1bee7
    style OPT fill:#fff9c4
```

| 平台 | 类型 | 优势 | 劣势 | 适用场景 |
|------|------|------|------|----------|
| **Google Vertex AI AutoML** | 云服务 | 深度学习强、图像/NLP 好 | 贵、锁定 GCP | 图像、NLP、表格 |
| **H2O AutoML** | 开源+企业 | 功能全面、可解释 | 社区版有限制 | 企业级表格数据 |
| **Azure AutoML** | 云服务 | 集成 Azure 生态 | 贵、锁定 Azure | Azure 用户 |
| **Auto-sklearn** | 开源 | sklearn 生态、稳定 | 仅表格数据 | 学术研究、中小项目 |
| **FLAML** | 开源 | 轻量快速 | 社区较小 | 快速原型 |
| **TPOT** | 开源 | Pipeline 导出 | 慢、遗传算法不稳定 | 探索性分析 |
| **SageMaker Autopilot** | 云服务 | AWS 集成 | 贵 | AWS 用户 |
| **DataRobot** | 企业 | 功能最强 | 非常贵 | 大型企业 |

### H2O AutoML 示例

```python
import h2o
from h2o.automl import H2OAutoML

h2o.init()

train = h2o.import_file("train.csv")
test = h2o.import_file("test.csv")

x = train.columns
y = "target"
x.remove(y)

aml = H2OAutoML(
    max_models=20,
    max_runtime_secs=600,
    seed=42,
    balance_classes=True,
    stopping_metric="AUC",
    sort_metric="AUC",
)
aml.train(x=x, y=y, training_frame=train)

lb = aml.leaderboard
print(lb.head(rows=10))

print(f"\n最佳模型: {aml.leader.model_id}")
print(f"最佳 AUC: {aml.leader.model_performance(test).auc():.4f}")

preds = aml.leader.predict(test)
```

---

## 实战工作流与最佳实践

### 推荐工作流

```mermaid
flowchart LR
    A[手动 Baseline] --> B[AutoML 快速搜索]
    B --> C[分析 Top-K 模型]
    C --> D[针对性调优]
    D --> E[集成优化]
    E --> F[部署监控]

    style A fill:#ffcdd2
    style B fill:#fff9c4
    style C fill:#fff9c4
    style D fill:#c8e6c9
    style E fill:#c8e6c9
    style F fill:#e1f5fe
```

### 最佳实践清单

```python
import optuna
from optuna.pruners import SuccessiveHalvingPruner
from optuna.samplers import TPESampler
from optuna.integration import PyTorchLightningPruningCallback

study = optuna.create_study(
    direction="maximize",
    sampler=TPESampler(
        seed=42,
        n_startup_trials=10,
        multivariate=True,
        constant_liar=True,
    ),
    pruner=SuccessiveHalvingPruner(
        min_resource=1,
        reduction_factor=4,
        min_early_stopping_rate=0,
    ),
    study_name="production_model_v2",
    storage="postgresql://user:pass@localhost/optuna",
    load_if_exists=True,
)

study.optimize(
    objective,
    n_trials=200,
    timeout=3600,
    n_jobs=4,
    gc_after_trial=True,
    show_progress_bar=True,
)
```

**最佳实践总结：**

| 实践 | 说明 | 优先级 |
|------|------|--------|
| 先建 Baseline | 手动跑一个简单模型作为参照 | 高 |
| 合理设搜索空间 | 基于经验缩小范围，避免无效探索 | 高 |
| 使用 Pruning | 早停差的 trial 节省资源 | 高 |
| 日志与存储 | 持久化 study 到数据库，可恢复 | 中 |
| 多目标优化 | 同时优化准确率和推理速度 | 中 |
| 交叉验证 | 避免过拟合单一数据划分 | 高 |
| 集成学习 | 组合 Top-K 模型提升鲁棒性 | 中 |
| 可复现性 | 固定种子、记录版本 | 高 |
| 监控与告警 | 跟踪 HPO 资源消耗 | 低 |
| 分阶段搜索 | 先粗搜索再细搜索 | 中 |

### 资源预算参考

| 数据规模 | 模型复杂度 | 推荐 AutoML 时间 | 推荐工具 |
|----------|-----------|-----------------|----------|
| <10K 行 | 简单 | 5-15 分钟 | FLAML |
| 10K-100K | 中等 | 30-120 分钟 | Optuna + FLAML |
| 100K-1M | 复杂 | 2-8 小时 | Ray Tune + ASHA |
| >1M | 深度学习 | 8-48 小时 | Ray Tune + GPU 集群 |

---

## 参考资料

- [Optuna 官方文档](https://optuna.readthedocs.io/)
- [Ray Tune 文档](https://docs.ray.io/en/latest/tune/)
- [Featuretools 文档](https://featuretools.alteryx.com/)
- [Auto-sklearn 论文](https://automl.github.io/auto-sklearn/)
- [FLAML GitHub](https://github.com/microsoft/FLAML)
- [DARTS 论文](https://arxiv.org/abs/1806.09055)
- [H2O AutoML 文档](https://docs.h2o.ai/)
