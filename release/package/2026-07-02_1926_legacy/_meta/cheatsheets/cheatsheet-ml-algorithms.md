---
title: "机器学习算法速查表"
tags: [cheatsheet, ml, machine-learning, algorithms, supervised, unsupervised, ensemble, deep-learning]
type: cheatsheet
created: 2026-06-24
updated: 2026-06-24
tier: core
summary: "机器学习核心算法速查：监督学习（线性/树/集成）、无监督学习（聚类/降维）、深度学习、强化学习的关键算法、优缺点、适用场景与选型决策树。"
---

# 机器学习算法速查表

> **核心洞察**：2026 年的 ML 工程师需要掌握 **5 大类算法 + 选型决策**。没有"最好的算法"，只有"最匹配场景的算法"。**集成方法（XGBoost/LightGBM）** 在结构化数据上仍是 SOTA；**深度学习** 在图像/文本/语音上统治；**Transformer/RL** 在大模型时代独占鳌头。
> 详见 [[02_Machine_Learning]] · [[ML_For_Beginners]] · [[ML_Fundamentals]]

## 算法全景分类

```
机器学习
├── 监督学习 (有标签)
│   ├── 分类: Logistic / SVM / 决策树 / RF / XGBoost / 深度网络
│   └── 回归: 线性 / Ridge / Lasso / 树 / XGBoost / 深度网络
├── 无监督学习 (无标签)
│   ├── 聚类: K-Means / DBSCAN / 层次 / GMM
│   ├── 降维: PCA / t-SNE / UMAP / Autoencoder
│   └── 生成: VAE / GAN / Diffusion / Flow
├── 半监督学习
│   └── Self-Training / Co-Training / MixMatch
├── 强化学习
│   └── Q-Learning / DQN / PPO / SAC / GRPO
└── 自监督学习 (2020+)
    └── SimCLR / MAE / BERT pretrain / GPT pretrain
```

## 监督学习 - 分类算法

| 算法 | 原理 | 复杂度 | 强项 | 弱项 | 适合数据规模 |
|------|------|--------|------|------|------------|
| **Logistic Regression** | 线性 + sigmoid | O(n·d) | 解释性强、快速 | 仅线性 | 任意 |
| **Decision Tree** | 树分裂 | O(n·log n·d) | 可解释 | 易过拟合 | < 10K |
| **Random Forest** | Bagging + 多树 | O(n·log n·k) | 鲁棒、抗过拟合 | 模型大 | 10K-1M |
| **XGBoost** | Boosting + GBDT | O(n·d·depth) | **结构化数据 SOTA** | 超参多 | 1M-100M |
| **LightGBM** | Histogram + GOSS | O(n·d) | 比 XGBoost 快 5-10x | 小数据过拟合 | 100M+ |
| **CatBoost** | 类别特征优化 | O(n·d) | 类别特征原生 | 较慢 | 100M+ |
| **SVM** | 核函数映射 | O(n²·d) | 高维数据 | 大数据慢 | < 100K |
| **KNN** | 近邻投票 | O(n·d) | 无训练 | 推理慢 | < 10K |
| **Naive Bayes** | 贝叶斯条件独立 | O(n·d) | 极快 | 假设强 | 文本分类 |
| **神经网络 (MLP)** | 多层感知机 | O(n·d·h) | 灵活 | 需大量数据 | 10K+ |
| **TabNet / FT-Transformer** | 表格深度学习 | O(n·d²) | 表格 SOTA | 调参难 | 100K+ |

## 监督学习 - 回归算法

| 算法 | 适用 | 关键参数 |
|------|------|---------|
| **Linear Regression** | 线性关系 | - |
| **Ridge (L2)** | 多重共线性 | alpha |
| **Lasso (L1)** | 特征选择 | alpha |
| **ElasticNet** | L1+L2 | alpha, l1_ratio |
| **Polynomial** | 非线性 | degree |
| **XGBoost/LightGBM** | **复杂非线性首选** | max_depth, learning_rate |
| **Quantile Regression** | 分位数预测 | quantile |
| **Gaussian Process** | 小数据 + 不确定性 | kernel |

## 无监督学习

### 聚类算法

| 算法 | 原理 | K 需求 | 强项 | 弱项 |
|------|------|--------|------|------|
| **K-Means** | 中心点距离 | 必填 | 简单快速 | 仅球形簇 |
| **DBSCAN** | 密度可达 | 无 | 任意形状、异常检测 | 密度不均难 |
| **HDBSCAN** | 层次密度 | 无 | 多密度簇 | 慢 |
| **Hierarchical** | 自底向上 | 无 | 树状结构 | O(n²) |
| **Gaussian Mixture (GMM)** | 高斯混合 | 必填 | 软聚类 | 仅椭球 |
| **Spectral** | 谱聚类 | 必填 | 复杂形状 | 大数据慢 |
| **Mean Shift** | 密度峰值 | 无 | 自动找 K | 慢 |

### 降维算法

| 算法 | 类型 | 保留 | 强项 |
|------|------|------|------|
| **PCA** | 线性 | 全局方差 | 快速、可解释 |
| **t-SNE** | 非线性 | 局部结构 | 可视化 |
| **UMAP** | 非线性 | 局部 + 全局 | **可视化首选** |
| **Autoencoder** | 非线性 | 学习表示 | 灵活、可生成 |
| **LDA** | 监督线性 | 类别区分 | 文本/分类 |
| **MDS** | 非线性 | 距离保持 | 经典 |
| **PHATE** | 非线性 | 轨迹结构 | 生物信息 |

## 集成学习

### Bagging vs Boosting vs Stacking

```
Bagging (Bootstrap Aggregating)
├── 训练: 并行训练 k 个基模型（不同 bootstrap 样本）
├── 预测: 投票/平均
└── 代表: Random Forest

Boosting (Sequential)
├── 训练: 串行训练，每轮修正前轮错误
├── 预测: 加权求和
└── 代表: AdaBoost / GBDT / XGBoost / LightGBM

Stacking
├── 训练: 多个异质模型 + 元学习器
├── 预测: 元学习器组合
└── 代表: 多模型融合
```

### GBDT 主流框架

| 框架 | 训练速度 | 类别特征 | 分布式 | GPU |
|------|---------|---------|--------|-----|
| **XGBoost** | 中 | 需编码 | ✅ | ✅ |
| **LightGBM** | **快 5-10x** | ✅ 原生 | ✅ | ✅ |
| **CatBoost** | 慢 | ✅✅ 原生 | ✅ | ✅ |
| **HistGradientBoosting (sklearn)** | 中 | ❌ | ❌ | ❌ |
| **NGBoost** | 慢 | ❌ | ❌ | ❌ |
| **DART** | 慢 | ❌ | ❌ | ❌ |

## 深度学习

### 主流架构对比

| 架构 | 适用 | 代表模型 |
|------|------|---------|
| **MLP** | 表格、简单特征 | - |
| **CNN** | 图像、视频 | ResNet、EfficientNet、ConvNeXt |
| **RNN/LSTM/GRU** | 时序、文本（老） | - |
| **Transformer** | 文本、视觉、多模态 | BERT、GPT、ViT |
| **MoE** | 大模型 | Mixtral、DeepSeek-V3 |
| **SSM/Mamba** | 长序列 | Mamba、RWKV |
| **Diffusion** | 图像/视频/音频生成 | Stable Diffusion、Sora |
| **GAN** | 图像生成 | StyleGAN |
| **VAE** | 生成、压缩 | - |
| **NeRF** | 3D 重建 | - |
| **GNN** | 图数据 | GraphSAGE、GAT |

### 训练技巧速查

| 技巧 | 用途 |
|------|------|
| **AdamW** | 默认优化器 |
| **Cosine LR Schedule** | 平滑收敛 |
| **Mixed Precision (BF16)** | 提速 + 省显存 |
| **Gradient Accumulation** | 等效大 batch |
| **EMA** | 测试时提升 |
| **Data Augmentation** | 防过拟合 |
| **Dropout / DropPath** | 正则化 |
| **Gradient Clipping** | 防梯度爆炸 |
| **Warmup + Decay** | 稳定训练 |

## 强化学习

### 算法分类

| 类别 | 算法 | 适用 |
|------|------|------|
| **Value-based** | Q-Learning、DQN | 离散动作 |
| **Policy-based** | REINFORCE、A2C | 连续动作 |
| **Actor-Critic** | PPO、SAC | 通用 |
| **Model-based** | MuZero、AlphaZero | 游戏、规划 |
| **Multi-Agent** | MADDPG、QMIX | 协作/竞争 |
| **LLM RL** | RLHF、GRPO、DPO | 大模型对齐 |
| **Offline RL** | CQL、IQL | 离线数据 |

### 应用场景

- 游戏：AlphaGo、AlphaStar、OpenAI Five
- 机器人：Sim-to-Real RL、Soft Actor-Critic
- 推荐系统：Contextual Bandit
- 大模型对齐：RLHF / DPO / GRPO

## 选型决策树

```
数据规模？
├── < 1K → KNN / Naive Bayes / 简单线性
├── 1K-10K → Logistic / SVM / Decision Tree
├── 10K-1M → Random Forest / XGBoost
├── 1M-100M → LightGBM / CatBoost / XGBoost (分布式)
└── > 100M → LightGBM / Deep Learning (分布式)

数据类型？
├── 表格数据 → XGBoost / LightGBM / CatBoost
├── 图像 → CNN (ResNet) / ViT
├── 文本 → Transformer (BERT / GPT)
├── 时序 → Transformer / LSTM / SSM
├── 语音 → Wav2Vec / Whisper
└── 图 → GNN

需要可解释性？
├── 高 → 线性模型 / Decision Tree / SHAP 分析
├── 中 → Random Forest / LightGBM + SHAP
└── 低 → 深度学习（黑盒）

类别分布？
├── 平衡 → 任意算法
└── 不平衡 → SMOTE / Class Weight / Focal Loss
```

## 评估指标速查

### 分类

| 指标 | 公式 | 适用 |
|------|------|------|
| **Accuracy** | (TP+TN) / Total | 平衡数据 |
| **Precision** | TP / (TP+FP) | 假阳性代价高 |
| **Recall** | TP / (TP+FN) | 假阴性代价高 |
| **F1** | 2·P·R/(P+R) | 综合 |
| **ROC-AUC** | 曲线下面积 | 排序质量 |
| **PR-AUC** | Precision-Recall 曲线 | 不平衡数据 |
| **Log Loss** | 交叉熵 | 概率校准 |
| **MCC** | Matthews 相关系数 | 不平衡 |

### 回归

| 指标 | 公式 | 说明 |
|------|------|------|
| **MSE** | mean(y-ŷ)² | 放大异常值 |
| **RMSE** | √MSE | 同量纲 |
| **MAE** | mean\|y-ŷ\| | 鲁棒 |
| **R²** | 1-SS_res/SS_tot | 解释方差比例 |
| **MAPE** | mean\|y-ŷ\|/y | 百分比误差 |

## 常见陷阱

| 陷阱 | 现象 | 解决 |
|------|------|------|
| **数据泄漏** | 测试集表现虚高 | 严格分离、时序交叉验证 |
| **类别不平衡** | 模型偏向多数类 | SMOTE、class_weight、阈值调整 |
| **过拟合** | 训练好测试差 | 正则化、早停、数据增强 |
| **特征未标准化** | 收敛慢 | StandardScaler、MinMax |
| **缺失值未处理** | 报错 | 填充（均值/中位数/KNN） |
| **类别特征未编码** | 报错 | One-Hot、Target Encoding |
| **超参未调优** | 性能差 | Optuna / Hyperopt |
| **分布漂移** | 模型失效 | 监控 + 定期重训 |

## 框架速查

| 框架 | 强项 | 适合 |
|------|------|------|
| **scikit-learn** | 通用 ML、API 一致 | 传统 ML |
| **XGBoost / LightGBM / CatBoost** | GBDT SOTA | 结构化数据 |
| **PyTorch** | 灵活、研究主流 | 深度学习 |
| **TensorFlow / Keras** | 生产部署 | 工业落地 |
| **HuggingFace** | 预训练模型 | NLP/多模态 |
| **JAX** | 高性能、函数式 | 研究/大规模训练 |
| **Optuna** | 超参优化 | 全场景 |
| **MLflow** | 实验追踪 | 团队协作 |
| **Ray** | 分布式 | 大规模训练/推理 |

---

**参见**：[[02_Machine_Learning]] · [[ML_Fundamentals]] · [[ML_For_Beginners]] · [[scikit-learn_overview]] · [[xgboost_overview]] · [[lightgbm_overview]] · [[catboost_overview]]