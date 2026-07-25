---
title: "表格基础模型 (2026)"
category: "ML_Fundamentals"
tags:
  - tabular-data
  - foundation-models
  - TabPFN
  - FT-Transformer
  - XGBoost
  - LightGBM
  - enterprise-ML
  - tabular-agent
summary: "表格基础模型的最新进展：TabPFN/TabT/FT-Transformer架构解析，表格数据异质性挑战，与XGBoost/LightGBM的系统对比，企业ML场景应用，以及2026年通用表格智能体前沿。"
created: 2026-07-19
updated: 2026-07-19
---

# 表格基础模型 (2026)

## 概述

表格数据（Tabular Data）占据企业数据的80%以上，是风控、推荐、广告、医疗等核心场景的主要数据形态。然而，与NLP和CV领域Foundation Model的辉煌成功不同，表格数据的Foundation Model化长期面临独特挑战。2023-2026年，以TabPFN、TabT、FT-Transformer为代表的模型开始打破GBDT（Gradient Boosted Decision Trees）在表格数据上的统治地位。

### 为什么表格数据特殊

表格数据与文本/图像的根本区别：

| 特性 | 文本/图像 | 表格数据 |
|------|-----------|----------|
| 语义结构 | 天然有序（语法/空间） | 列无序（permutation invariant） |
| 特征类型 | 同质（token/pixel） | 异质（连续/类别/有序/二元） |
| 缺失值 | 罕见 | 普遍（5-50%） |
| 尺度 | 相对统一 | 跨列差异巨大 |
| 分布 | 相对稳定 | 高度非平稳 |
| 维度 | 高维稀疏 | 低维密集（通常<1000列） |
| 样本量 | 通常充足 | 经常不足（<10K） |

### 发展时间线

```
2019: FT-Transformer (Gorishniy et al.) - Transformer用于表格
2022: TabPFN (Hollmann et al.) - 预训练表格分类器
2023: Trompt, ExcelFormer - 表格预训练探索
2024: TabT, UniTab - 通用表格表征
2025: TabAgent, TabGPT - 表格基础模型+Agent
2026: 通用表格智能体 - 零样本表格理解与决策
```

---

## 核心原理

### 表格数据的形式化定义

一个表格数据集 $\mathcal{D} = \{(x_i, y_i)\}_{i=1}^n$，其中：

$$x_i = (x_i^{(1)}, x_i^{(2)}, ..., x_i^{(d)}) \in \mathcal{X}_1 \times \mathcal{X}_2 \times ... \times \mathcal{X}_d$$

每个特征空间 $\mathcal{X}_j$ 可以是：
- 连续型：$\mathcal{X}_j \subseteq \mathbb{R}$
- 类别型：$\mathcal{X}_j = \{c_1, c_2, ..., c_{K_j}\}$
- 有序型：$\mathcal{X}_j = \{o_1 < o_2 < ... < o_{K_j}\}$
- 二元型：$\mathcal{X}_j = \{0, 1\}$

### 为什么表格数据难：数学分析

**1. 异质性 (Heterogeneity)**

不同列的统计性质完全不同，无法用统一的tokenization：

$$p(x^{(j)}) = \begin{cases} \mathcal{N}(\mu_j, \sigma_j^2) & \text{连续特征} \\ \text{Cat}(\pi_j) & \text{类别特征} \\ \text{Bernoulli}(p_j) & \text{二元特征} \end{cases}$$

**2. 缺失值 (Missing Values)**

缺失机制分三类（Rubin, 1976）：
- MCAR (Missing Completely At Random): $P(M=1|X) = p$
- MAR (Missing At Random): $P(M=1|X) = f(X_{\text{obs}})$
- MNAR (Missing Not At Random): $P(M=1|X) = f(X)$

MNAR情况下，缺失本身携带信息：

$$p(y|x, m) \neq p(y|x) \quad \text{其中 } m \text{ 为缺失指示器}$$

**3. 列置换不变性 (Permutation Invariance)**

表格的列顺序无语义意义，模型应满足：

$$f(x_1, x_2, ..., x_d) = f(x_{\pi(1)}, x_{\pi(2)}, ..., x_{\pi(d)})$$

对任意置换 $\pi$。这与文本的序列性根本矛盾。

**4. 特征交互的稀疏性**

表格数据中，有效特征交互通常是稀疏的：

$$y = \sum_{j} f_j(x^{(j)}) + \sum_{j<k} f_{jk}(x^{(j)}, x^{(k)}) + \epsilon$$

其中高阶交互 $f_{jk...}$ 大多为零。GBDT天然擅长发现稀疏交互。

### TabPFN的数学框架

TabPFN (Prior-data Fitted Networks) 的核心思想：在合成数据分布上预训练，使模型学会"如何学习表格分类"。

**预训练目标**：

$$\theta^* = \arg\min_\theta \mathbb{E}_{\mathcal{D} \sim p(\mathcal{D})} \left[ \sum_{i=1}^{n_{\text{test}}} -\log p_\theta(y_i | x_i, \mathcal{D}_{\text{train}}) \right]$$

其中 $p(\mathcal{D})$ 是通过结构因果模型 (SCM) 生成的合成表格数据分布。

**推理时（零样本）**：

$$p(y_{\text{test}} | x_{\text{test}}, \mathcal{D}_{\text{train}}) = f_\theta(x_{\text{test}}, \mathcal{D}_{\text{train}})$$

整个训练集作为"上下文"输入，无需梯度更新。

**SCM数据生成**：

$$x^{(j)} = g_j(\text{pa}(x^{(j)}), \epsilon_j), \quad y = h(x, \epsilon_y)$$

通过随机采样因果图结构、函数形式和噪声分布，生成多样化的表格数据集。

### FT-Transformer架构

**特征Tokenizer**：

将每个特征独立映射到embedding空间：

$$e_j = W_j \cdot x^{(j)} + b_j \quad \text{(连续特征)}$$
$$e_j = E_j[x^{(j)}] \quad \text{(类别特征，查表)}$$

其中 $e_j \in \mathbb{R}^{d_{\text{model}}}$。

**[CLS] Token + Transformer**：

$$[e_{\text{CLS}}, e_1, e_2, ..., e_d] \xrightarrow{\text{Transformer}} [h_{\text{CLS}}, h_1, ..., h_d]$$

$$\hat{y} = \text{MLP}(h_{\text{CLS}})$$

**关键设计**：
- 每个特征一个token（而非整行一个token）
- 注意力机制自动学习特征交互
- [CLS] token聚合全局信息

### TabT: 表格Tokenization

**数值特征离散化**：

$$x^{(j)} \rightarrow \text{bin}_k(x^{(j)}) \in \{1, 2, ..., K\}$$

使用分位数分箱或学习式分箱。

**统一Token序列**：

$$\text{seq}(x) = [\text{COL}_1, \text{VAL}_1, \text{COL}_2, \text{VAL}_2, ..., \text{COL}_d, \text{VAL}_d]$$

其中 $\text{COL}_j$ 为列标识token，$\text{VAL}_j$ 为值token。

---

## 算法详解

### GBDT基线：XGBoost/LightGBM

**XGBoost目标函数**：

$$\mathcal{L} = \sum_{i=1}^n l(y_i, \hat{y}_i) + \sum_{k=1}^K \Omega(f_k)$$

$$\Omega(f) = \gamma T + \frac{1}{2}\lambda \|w\|^2$$

其中 $T$ 为叶子数，$w$ 为叶子权重。

**LightGBM的直方图加速**：

将连续特征离散化为 $B$ 个bin，分裂增益计算从 $O(n)$ 降至 $O(B)$：

$$\text{Gain} = \frac{1}{2}\left[\frac{G_L^2}{H_L + \lambda} + \frac{G_R^2}{H_R + \lambda} - \frac{(G_L+G_R)^2}{H_L+H_R+\lambda}\right] - \gamma$$

### TabPFN推理算法

```
输入: 训练集 D_train = {(x_i, y_i)}_{i=1}^n, 测试点 x_test
输出: p(y|x_test, D_train)

1. 对 D_train 进行标准化（每列独立）
2. 处理缺失值（特殊token标记）
3. 构建输入序列: [x_1, y_1, x_2, y_2, ..., x_n, y_n, x_test, ?]
4. 前向传播通过预训练Transformer
5. 输出位置 ? 处的预测分布
```

**关键约束**（TabPFN v1）：
- 最大训练样本：1024
- 最大特征数：500
- 仅支持分类（v1），回归（v2）

### 预训练表格模型的挑战与突破

**挑战1：缺乏自然预训练语料**

文本有互联网，图像有ImageNet/LAION，但表格数据：
- 分散在各企业/机构
- Schema不统一
- 隐私限制严格

**突破：合成数据预训练**

TabPFN的解决方案：用SCM生成无限多样的表格数据集：

$$p(\mathcal{D}) = \int p(\mathcal{D}|\mathcal{G}, \mathcal{F}) \cdot p(\mathcal{G}) \cdot p(\mathcal{F}) \, d\mathcal{G} \, d\mathcal{F}$$

其中 $\mathcal{G}$ 为因果图，$\mathcal{F}$ 为函数族。

**挑战2：列数可变**

不同表格列数不同（5列~1000列）。

**突破：列子采样 + 位置编码**

- 训练时随机采样列子集
- 使用可学习列位置编码
- 推理时支持任意列数（外推）

**挑战3：特征类型混合**

**突破：类型感知Tokenizer**

$$e_j = \begin{cases} W_{\text{num}} \cdot [x^{(j)}, \mathbb{1}_{\text{missing}}] + b_{\text{num}} & \text{连续} \\ E_{\text{cat}}[x^{(j)}] + b_{\text{cat}} & \text{类别} \\ W_{\text{bin}} \cdot x^{(j)} + b_{\text{bin}} & \text{二元} \end{cases}$$

### 2026突破：通用表格智能体

**TabAgent架构**：

```
用户意图 → 意图解析 → 数据理解 → 策略选择 → 07_模型训练/推理 → 结果解释
                ↓              ↓            ↓
          LLM理解层     元数据分析层   AutoML决策层
```

**核心能力**：
1. 零样本表格理解：自动识别列语义（ID/特征/目标/时间）
2. 自动特征工程：基于LLM的领域知识注入
3. 自适应模型选择：根据数据特性选择最优pipeline
4. 自然语言交互：用自然语言描述建模需求

---

## 实验与基准

### 标准基准数据集

| 数据集 | 样本数 | 特征数 | 类型 | 来源 |
|--------|--------|--------|------|------|
| California Housing | 20,640 | 8 | 回归 | sklearn |
| Adult Income | 48,842 | 14 | 分类 | UCI |
| Higgs Boson | 11,000,000 | 28 | 分类 | UCI |
| Covertype | 581,012 | 54 | 分类 | UCI |
| OpenML-CC18 | 多样 | 多样 | 混合 | OpenML |
| TabZilla | 36数据集 | 多样 | 混合 | 综合基准 |

### 性能对比（分类任务，AUC-ROC）

```
数据集          | XGBoost  | LightGBM | FT-Trans | TabPFN  | TabT
---------------|----------|----------|----------|---------|------
Adult          | 0.923    | 0.925    | 0.921    | 0.928   | 0.927
Bank Marketing | 0.935    | 0.937    | 0.932    | 0.941   | 0.939
Credit Card    | 0.982    | 0.983    | 0.979    | 0.985   | 0.984
Diabetes       | 0.831    | 0.833    | 0.828    | 0.842   | 0.838
Titanic        | 0.872    | 0.874    | 0.869    | 0.881   | 0.878
```

**关键发现**：
- 小数据集（<10K样本）：TabPFN显著优于GBDT
- 大数据集（>100K样本）：GBDT仍具竞争力
- 高缺失率数据：表格基础模型优势明显
- 类别特征多：FT-Transformer/TabT表现好

### 效率对比

| 方法 | 训练时间(10K样本) | 推理延迟(单样本) | 内存占用 |
|------|------------------|-----------------|----------|
| XGBoost | 2-5s | <1ms | 10-50MB |
| LightGBM | 1-3s | <1ms | 5-30MB |
| FT-Transformer | 30-120s | 5-20ms | 100-500MB |
| TabPFN | 0s (预训练) | 50-200ms | 200MB |
| TabT | 0s (预训练) | 30-100ms | 300MB |

---

## 代码示例

### TabPFN使用示例

```python
from tabpfn import TabPFNClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

# 加载数据
X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# TabPFN: 无需训练，直接预测
clf = TabPFNClassifier(device='cuda', N_ensemble_configurations=32)
clf.fit(X_train, y_train)  # 实际只是存储训练数据

# 零样本预测
y_prob = clf.predict_proba(X_test)[:, 1]
print(f"TabPFN AUC: {roc_auc_score(y_test, y_prob):.4f}")
```

### FT-Transformer实现

```python
import torch
import torch.nn as nn

class FeatureTokenizer(nn.Module):
    """将表格特征映射为token序列"""
    
    def __init__(self, n_num_features, cat_cardinalities, d_token):
        super().__init__()
        self.n_num_features = n_num_features
        self.d_token = d_token
        
        # 数值特征：线性投影
        if n_num_features > 0:
            self.num_weight = nn.Parameter(torch.randn(n_num_features, d_token))
            self.num_bias = nn.Parameter(torch.zeros(n_num_features, d_token))
        
        # 类别特征：Embedding
        self.cat_embeddings = nn.ModuleList([
            nn.Embedding(card + 1, d_token)  # +1 for missing
            for card in cat_cardinalities
        ])
    
    def forward(self, x_num, x_cat):
        tokens = []
        
        # 数值特征tokenize
        if self.n_num_features > 0:
            # x_num: (batch, n_num) -> (batch, n_num, d_token)
            num_tokens = x_num.unsqueeze(-1) * self.num_weight + self.num_bias
            tokens.append(num_tokens)
        
        # 类别特征tokenize
        for i, emb in enumerate(self.cat_embeddings):
            cat_token = emb(x_cat[:, i]).unsqueeze(1)
            tokens.append(cat_token)
        
        return torch.cat(tokens, dim=1)  # (batch, n_features, d_token)


class FTTransformer(nn.Module):
    """Feature Tokenizer + Transformer"""
    
    def __init__(self, n_num_features, cat_cardinalities, d_token=192,
                 n_layers=3, n_heads=8, d_ffn=256, dropout=0.1, n_classes=2):
        super().__init__()
        
        self.tokenizer = FeatureTokenizer(n_num_features, cat_cardinalities, d_token)
        
        # [CLS] token
        self.cls_token = nn.Parameter(torch.randn(1, 1, d_token))
        
        # Transformer
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_token, nhead=n_heads,
            dim_feedforward=d_ffn, dropout=dropout,
            batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=n_layers)
        
        # 输出头
        self.head = nn.Sequential(
            nn.LayerNorm(d_token),
            nn.ReLU(),
            nn.Linear(d_token, n_classes)
        )
    
    def forward(self, x_num, x_cat):
        # Tokenize
        tokens = self.tokenizer(x_num, x_cat)
        
        # 添加[CLS] token
        batch_size = tokens.shape[0]
        cls_tokens = self.cls_token.expand(batch_size, -1, -1)
        tokens = torch.cat([cls_tokens, tokens], dim=1)
        
        # Transformer编码
        encoded = self.transformer(tokens)
        
        # 取[CLS]输出
        cls_output = encoded[:, 0]
        
        return self.head(cls_output)
```

### XGBoost vs TabPFN对比实验

```python
import xgboost as xgb
from sklearn.model_selection import cross_val_score
import numpy as np
import time

def compare_models(X, y, dataset_name):
    """系统对比XGBoost与TabPFN"""
    results = {}
    
    # XGBoost with tuned hyperparameters
    xgb_model = xgb.XGBClassifier(
        n_estimators=500,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        reg_alpha=0.1,
        reg_lambda=1.0,
        eval_metric='auc',
        early_stopping_rounds=50
    )
    
    start = time.time()
    xgb_scores = cross_val_score(xgb_model, X, y, cv=5, scoring='roc_auc')
    xgb_time = time.time() - start
    results['XGBoost'] = {
        'auc_mean': xgb_scores.mean(),
        'auc_std': xgb_scores.std(),
        'time': xgb_time
    }
    
    # TabPFN (zero-shot)
    from tabpfn import TabPFNClassifier
    tabpfn = TabPFNClassifier(device='cuda')
    
    start = time.time()
    tabpfn_scores = cross_val_score(tabpfn, X, y, cv=5, scoring='roc_auc')
    tabpfn_time = time.time() - start
    results['TabPFN'] = {
        'auc_mean': tabpfn_scores.mean(),
        'auc_std': tabpfn_scores.std(),
        'time': tabpfn_time
    }
    
    print(f"\n{'='*50}")
    print(f"Dataset: {dataset_name} (n={X.shape[0]}, d={X.shape[1]})")
    print(f"{'='*50}")
    for name, res in results.items():
        print(f"{name:12s}: AUC={res['auc_mean']:.4f}±{res['auc_std']:.4f}, Time={res['time']:.1f}s")
    
    return results
```

### 企业级表格智能体示例

```python
class TabularAgent:
    """2026通用表格智能体：自动理解、建模、解释"""
    
    def __init__(self, llm_client):
        self.llm = llm_client
        self.model_registry = {}
    
    def understand_data(self, df):
        """LLM驱动的表格理解"""
        schema_description = self._generate_schema(df)
        
        prompt = f"""分析以下表格数据的schema，识别：
        1. 目标变量（预测目标）
        2. ID列（应排除）
        3. 时间列（需特殊处理）
        4. 类别特征 vs 数值特征
        5. 可能的数据质量问题
        
        Schema:
        {schema_description}
        
        前5行数据:
        {df.head().to_string()}
        """
        
        analysis = self.llm.generate(prompt)
        return self._parse_analysis(analysis)
    
    def auto_model(self, df, target_col, task_type='auto'):
        """自适应模型选择与训练"""
        n_samples, n_features = df.shape
        
        # 规则引擎 + LLM判断
        if n_samples < 10000:
            # 小数据：TabPFN优先
            model = self._train_tabpfn(df, target_col)
        elif n_features > 100 and n_samples > 100000:
            # 大数据高维：LightGBM
            model = self._train_lightgbm(df, target_col)
        else:
            # 中等规模：集成方法
            model = self._train_ensemble(df, target_col)
        
        return model
    
    def explain_prediction(self, model, sample, df_context):
        """自然语言解释预测结果"""
        shap_values = self._compute_shap(model, sample)
        top_features = self._get_top_features(shap_values, k=5)
        
        prompt = f"""用通俗语言解释以下预测：
        预测结果: {model.predict(sample)}
        主要影响因子: {top_features}
        数据背景: {df_context.describe().to_string()}
        """
        
        return self.llm.generate(prompt)
```

---

## 对比表

### 表格模型全维度对比

| 维度 | XGBoost | LightGBM | CatBoost | FT-Transformer | TabPFN | TabT |
|------|---------|----------|----------|----------------|--------|------|
| 算法类型 | GBDT | GBDT | GBDT | Transformer | Pre-trained | Pre-trained |
| 训练需求 | 每任务训练 | 每任务训练 | 每任务训练 | 每任务训练 | 零样本 | 零样本 |
| 小数据(<1K) | 中 | 中 | 中 | 良 | 优 | 优 |
| 大数据(>100K) | 优 | 优 | 优 | 良 | 不支持 | 良 |
| 缺失值处理 | 内置 | 内置 | 内置 | 需预处理 | 内置 | 内置 |
| 类别特征 | 需编码 | 内置 | 原生支持 | Embedding | 内置 | 内置 |
| 可解释性 | 高(SHAP) | 高(SHAP) | 高(SHAP) | 低 | 低 | 低 |
| 训练速度 | 快 | 最快 | 中 | 慢 | 无需训练 | 无需训练 |
| 推理速度 | 极快 | 极快 | 快 | 中 | 慢 | 中 |
| 超参敏感度 | 高 | 中 | 低 | 高 | 无 | 无 |
| 部署复杂度 | 低 | 低 | 低 | 中 | 中(GPU) | 中(GPU) |

### 企业场景适用性

| 场景 | 数据特点 | 推荐方案 | 原因 |
|------|----------|----------|------|
| 实时风控 | 低延迟、流式 | LightGBM + 规则 | <1ms延迟要求 |
| 离线风控 | 高缺失、不平衡 | TabPFN + XGBoost集成 | 缺失值处理+可解释性 |
| 推荐系统 | 大规模、稀疏 | Deep模型 + GBDT | 规模+交互 |
| 广告CTR | 超大规模、实时 | LightGBM/DIN | 效率优先 |
| 医疗诊断 | 小样本、高维 | TabPFN/FT-Transformer | 小数据优势 |
| 金融量化 | 时序、非平稳 | LightGBM + 时序特征 | 可解释+快速迭代 |
| 客户流失 | 中等规模、混合 | CatBoost/TabT | 类别特征+自动化 |

### 预训练策略对比

| 策略 | 代表 | 预训练数据 | 优势 | 局限 |
|------|------|-----------|------|------|
| SCM合成 | TabPFN | 因果模型生成 | 无限数据、多样性 | 与真实分布gap |
| 公开数据聚合 | TabT | OpenML+Kaggle | 真实分布 | 数据量有限 |
| 自监督 | ExcelFormer | 单表内重建 | 无需外部数据 | 表征质量有限 |
| 多任务 | UniTab | 多数据集联合 | 跨任务迁移 | 负迁移风险 |
| LLM增强 | TabAgent | LLM生成描述 | 语义理解 | 计算成本高 |

---

## 2026前沿

### 通用表格智能体 (Universal Tabular Agent)

2026年的终极愿景：一个Agent处理所有表格任务。

**能力矩阵**：

```
输入: 任意表格 + 自然语言指令
输出: 预测/分析/94_可视化/报告

支持任务:
├── 预测: 分类、回归、时序预测
├── 理解: 异常检测、聚类、关联规则
├── 生成: 数据增强、缺失填充、合成数据
├── 解释: SHAP、因果推断、What-if分析
└── 决策: 最优策略推荐、约束优化
```

**技术栈**：

$$\text{TabAgent} = \text{LLM} + \text{TabFM} + \text{AutoML} + \text{Tool Use}$$

### 表格数据的大规模预训练

**2026数据引擎**：

1. **公开数据爬取**：OpenML, Kaggle, UCI, 政府开放数据
2. **合成数据生成**：基于真实Schema的SCM生成
3. **LLM辅助标注**：用LLM为无标签表格生成伪标签
4. **跨表对齐**：通过列名/语义匹配实现跨数据集预训练

**规模目标**：
- 预训练数据集：100万+表格
- 总行数：10亿+
- 覆盖领域：金融、医疗、电商、制造、政务

### 表格Foundation Model + RAG

```python
# 2026范式：表格RAG
class TabularRAG:
    """检索增强的表格推理"""
    
    def predict(self, query_table, query_row):
        # 1. 检索相似历史表格
        similar_tables = self.retriever.search(query_table.schema)
        
        # 2. 检索相关领域知识
        domain_knowledge = self.knowledge_base.query(
            query_table.column_descriptions
        )
        
        # 3. 构建增强prompt
        context = self.build_context(similar_tables, domain_knowledge)
        
        # 4. TabFM推理
        prediction = self.tab_foundation_model.predict(
            query_row, 
            context=context,
            training_data=query_table
        )
        
        return prediction
```

### 隐私保护表格学习

企业表格数据高度敏感，2026年方向：

1. **联邦表格学习**：多机构联合训练，数据不出域（参见[[Federated_Learning_ML_Perspective]]）
2. **差分隐私TabFM**：在预训练中注入噪声
3. **安全多方计算**：加密状态下的表格推理
4. **合成数据替代**：生成保真合成表格用于开发

### 表格模型的Scaling Law

初步发现（2025-2026）：

$$\text{TabPerf}(N_{\text{pretrain\_tables}}, d_{\text{model}}) \sim N_{\text{pretrain\_tables}}^{0.3} \cdot d_{\text{model}}^{0.4}$$

- 预训练表格数量的scaling指数（~0.3）低于NLP（~0.5）
- 模型深度的收益更显著（表格交互需要多层注意力）
- 存在"数据多样性瓶颈"：表格分布空间远大于文本

---

## 相关概念

- [[Foundation_Models_ML_Paradigm]] - 基础模型范式转变总论
- [[XGBoost_LightGBM_CatBoost]] - GBDT三巨头详解
- [[Feature_Engineering]] - 特征工程方法论
- [[Tabular_Data_Processing]] - 表格数据预处理
- [[Federated_Learning_ML_Perspective]] - 联邦学习（隐私保护表格学习）
- [[AutoML]] - 自动机器学习
- [[SHAP_Interpretability]] - SHAP可解释性
- [[Transformer_Architecture]] - Transformer架构基础
- [[In-Context_Learning]] - 上下文学习机制
- [[Scaling_Laws]] - 规模定律
- [[Enterprise_ML_Deployment]] - 企业ML部署
- [[Missing_Data_Imputation]] - 缺失值填充
- [[Categorical_Feature_Encoding]] - 类别特征编码
- [[ML_Algorithms_Cheatsheet]] - ML算法速查
- [[Supervised_Learning]] - 监督学习基础
