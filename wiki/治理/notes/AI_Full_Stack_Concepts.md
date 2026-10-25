---
title: AI 全链路 Concept 清单
category: 91-notes
tags: ["notes", "drafts", "ideas", "observations"]
summary: "> 从数学原理到 AI Infra 到 AI Agent 的完整概念体系"
created: 2026-05-31
updated: 2026-05-31
tier: core
aliases:
  - "Ai Full Stack Concepts"
  - "AI Full Stack Concepts"
  - AI_Full_Stack_Concepts
sources: []

name_zh: "AI 全链路 Concept 清单"
---
# AI 全链路 Concept 清单

> 中文简称：AI 全链路 Concept 清单

> 从数学原理到 AI Infra 到 AI Agent 的完整概念体系
> 
> 版本: 2026.04 | 收录概念: 300+ | 分层: 7 层

---

## 📋 目录

1. [数学原理层 (Mathematical Foundations)](#一数学原理层-mathematical-foundations)
2. [机器学习层 (Machine Learning)](#二机器学习层-machine-learning)
3. [深度学习层 (Deep Learning)](#三深度学习层-deep-learning)
4. [大模型与 NLP 层 (LLMs & NLP)](#四大模型与-nlp-层-llms--nlp)
5. [AI 基础设施层 (AI Infrastructure)](#五-ai-基础设施层-ai-infrastructure)
6. [AI Agent 层 (AI Agents)](#六-ai-agent-层-ai-agents)
7. [伦理与安全层 (Ethics & Safety)](#七伦理与安全层-ethics--safety)
8. [附录：权威来源索引](#八附录权威来源索引)

---

## 一、数学原理层 (Mathematical Foundations)

### 1.1 线性代数 (Linear Algebra)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Vector | 向量 | 具有大小和方向的量，一维数组 | 词嵌入、特征表示 |
| Matrix | 矩阵 | 二维数组，线性变换的表示 | 权重矩阵、图像数据 |
| Tensor | 张量 | 多维数组，AI 中的基本数据结构 | PyTorch/TensorFlow 基础 |
| Dot Product | 点积 | 两个向量的内积，衡量相似性 | 注意力机制、相似度计算 |
| Matrix Multiplication | 矩阵乘法 | 线性代数核心运算 | 神经网络前向传播 |
| Eigenvalue/Eigenvector | 特征值/特征向量 | 矩阵变换的不变方向和缩放因子 | PCA 降维、图分析 |
| Singular Value Decomposition (SVD) | 奇异值分解 | 矩阵分解为 UΣVᵀ | 推荐系统、降维 |
| Norm (L1/L2) | 范数 | 向量大小的度量 | 正则化、距离计算 |
| Gradient | 梯度 | 多元函数导数，指向函数增长最快方向 | 梯度下降优化 |
| Jacobian Matrix | 雅可比矩阵 | 多元函数的一阶偏导数矩阵 | 反向传播、优化 |
| Hessian Matrix | 海森矩阵 | 二阶偏导数矩阵 | 二阶优化方法 |
| Covariance Matrix | 协方差矩阵 | 变量间协方差的矩阵表示 | 多元高斯分布、PCA |
| Orthogonal Matrix | 正交矩阵 | 满足 QᵀQ = I 的方阵 | 旋转矩阵、正交变换 |
| Determinant | 行列式 | 方阵的标量值，表示线性变换的缩放 | 矩阵可逆性判断 |
| Rank | 秩 | 矩阵线性无关行/列的最大数量 | 降维、特征选择 |

### 1.2 概率统计 (Probability & Statistics)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Probability Distribution | 概率分布 | 随机变量取值的概率规律 | 数据建模、生成模型 |
| Normal/Gaussian Distribution | 正态分布/高斯分布 | 钟形曲线分布 | 噪声建模、初始化 |
| Bayesian Theorem | 贝叶斯定理 | P(A\|B) = P(B\|A)P(A)/P(B) | 贝叶斯神经网络 |
| Maximum Likelihood Estimation (MLE) | 最大似然估计 | 找到使观测数据概率最大的参数 | 参数估计 |
| Maximum A Posteriori (MAP) | 最大后验估计 | 加入先验的贝叶斯估计 | 正则化、先验知识 |
| Expectation | 期望 | 随机变量的平均值 | 损失函数、策略梯度 |
| Variance | 方差 | 数据分散程度 | 模型不确定性 |
| Covariance | 协方差 | 两个变量的联合变化程度 | 特征关系分析 |
| Correlation | 相关系数 | 标准化的协方差 | 特征相关性 |
| Conditional Probability | 条件概率 | 给定某事件发生后的概率 | 因果推断 |
| Joint Probability | 联合概率 | 多个事件同时发生的概率 | 多变量建模 |
| Marginal Probability | 边缘概率 | 对其他变量求和后的概率 | 变量消去 |
| Chain Rule | 链式法则 | 复合函数求导法则 | 反向传播核心 |
| KL Divergence | KL 散度 | 衡量两个分布的差异 | VAE、知识蒸馏 |
| Entropy | 熵 | 信息量的期望，衡量不确定性 | 决策树、策略优化 |
| Cross-Entropy | 交叉熵 | 两个分布间的信息差异 | 分类损失函数 |
| Mutual Information | 互信息 | 两个变量共享的信息量 | 特征选择 |
| Markov Chain | 马尔可夫链 | 下一状态只依赖于当前状态 | 强化学习、采样 |
| Monte Carlo Method | 蒙特卡洛方法 | 随机采样近似计算 | 策略梯度、Dropout |
| Confidence Interval | 置信区间 | 估计值的不确定性范围 | A/B 测试 |
| Hypothesis Testing | 假设检验 | 统计显著性检验 | 模型比较 |
| Central Limit Theorem | 中心极限定理 | 大样本均值趋于正态分布 | 统计推断基础 |

### 1.3 优化理论 (Optimization Theory)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Convex Optimization | 凸优化 | 目标函数和约束都是凸的优化问题 | SVM、逻辑回归 |
| Lagrange Multiplier | 拉格朗日乘子 | 带约束优化的求解方法 | 约束优化问题 |
| Gradient Descent | 梯度下降 | 沿负梯度方向更新参数 | 神经网络训练 |
| Stochastic Gradient Descent (SGD) | 随机梯度下降 | 使用小批量样本的梯度下降 | 深度学习优化 |
| Learning Rate | 学习率 | 梯度下降的步长 | 训练超参数 |
| Learning Rate Schedule | 学习率调度 | 动态调整学习率 | 收敛加速 |
| Momentum | 动量 | 累积历史梯度方向 | 加速收敛 |
| AdaGrad | 自适应梯度 | 按历史梯度调整学习率 | 稀疏特征优化 |
| RMSprop | 均方根传播 | 指数移动平均梯度平方 | 非平稳目标 |
| Adam | 自适应矩估计 | Momentum + RMSprop | 默认优化器 |
| AdamW | 解耦权重衰减 Adam | 正确实现 L2 正则化 | Transformer 训练 |
| Second-Order Optimization | 二阶优化 | 使用 Hessian 矩阵的优化 | 大规模优化 |
| Constraint Optimization | 约束优化 | 带约束条件的优化问题 | 资源限制场景 |
| Non-Convex Optimization | 非凸优化 | 存在多个局部最优的优化 | 神经网络训练 |
| Global vs Local Minimum | 全局/局部最优 | 函数的最小值点 | 优化目标 |
| Saddle Point | 鞍点 | 某些方向极小、某些方向极大的点 | 高维优化挑战 |
| Vanishing Gradient | 梯度消失 | 反向传播梯度逐层衰减 | 深层网络问题 |
| Exploding Gradient | 梯度爆炸 | 反向传播梯度逐层放大 | RNN 训练问题 |

### 1.4 信息论 (Information Theory)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Information | 信息量 | -log(p)，事件的不确定性 | 编码理论 |
| Shannon Entropy | 香农熵 | 平均信息量 | 压缩、特征选择 |
| Cross Entropy Loss | 交叉熵损失 | 分类任务标准损失 | 多分类问题 |
| Bits | 比特 | 信息量的单位 | 模型复杂度衡量 |
| Information Gain | 信息增益 | 特征对分类的纯度提升 | 决策树分裂 |
| Perplexity | 困惑度 | 2^(交叉熵)，语言模型指标 | NLP 评估 |

---

## 二、机器学习层 (Machine Learning)

### 2.1 基础概念 (Fundamentals)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Supervised Learning | 监督学习 | 使用标注数据训练模型 | 分类、回归 |
| Unsupervised Learning | 无监督学习 | 从未标注数据中发现模式 | 聚类、降维 |
| Semi-Supervised Learning | 半监督学习 | 结合少量标注和大量未标注数据 | 标注成本高场景 |
| Self-Supervised Learning | 自监督学习 | 从数据本身构造监督信号 | 预训练、表示学习 |
| Reinforcement Learning | 强化学习 | 通过奖励信号学习最优策略 | 游戏、机器人 |
| Transfer Learning | 迁移学习 | 将知识从一个任务迁移到另一个 | 小样本学习 |
| Meta-Learning | 元学习 | 学会学习的能力 | 快速适应新任务 |
| Few-Shot Learning | 少样本学习 | 从少量样本学习新任务 | 罕见类别识别 |
| Zero-Shot Learning | 零样本学习 | 无需样本识别新类别 | 开放词汇识别 |
| Multi-Task Learning | 多任务学习 | 同时学习多个相关任务 | 共享表示学习 |
| Curriculum Learning | 课程学习 | 从简单到难组织训练样本 | 训练加速 |
| Active Learning | 主动学习 | 模型选择最有价值的样本标注 | 降低标注成本 |
| Online Learning | 在线学习 | 数据流式到达，持续更新 | 实时推荐 |
| Federated Learning | 联邦学习 | 数据不出本地的分布式训练 | 隐私保护 |

### 2.2 监督学习算法 (Supervised Learning)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Linear Regression | 线性回归 | 假设输出是输入的线性组合 | 连续值预测 |
| Logistic Regression | 逻辑回归 | 使用 sigmoid 的分类模型 | 二分类问题 |
| Decision Tree | 决策树 | 基于特征划分的树形模型 | 可解释分类 |
| Random Forest | 随机森林 | 多棵决策树的集成 | 通用分类/回归 |
| Gradient Boosting | 梯度提升 | 串行训练弱学习器修正错误 | XGBoost、LightGBM |
| XGBoost | 极端梯度提升 | 高效梯度提升实现 | 竞赛常胜 |
| LightGBM | 轻量梯度提升 | 基于直方图的快速 GBDT | 大规模数据 |
| CatBoost | 类别特征提升 | 处理类别特征的梯度提升 | 含类别特征数据 |
| SVM (Support Vector Machine) | 支持向量机 | 最大间隔分类器 | 高维数据分类 |
| Kernel Trick | 核技巧 | 隐式映射到高维空间 | 非线性分类 |
| Naive Bayes | 朴素贝叶斯 | 基于贝叶斯定理的假设独立分类 | 文本分类 |
| K-Nearest Neighbors (KNN) | K近邻 | 基于邻近样本投票 | 简单分类 |
| Neural Network (Shallow) | 浅层神经网络 | 1-2 个隐藏层的网络 | 传统 ML 任务 |

### 2.3 无监督学习算法 (Unsupervised Learning)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| K-Means Clustering | K均值聚类 | 将数据分为 K 个簇 | 客户分群 |
| Hierarchical Clustering | 层次聚类 | 自底向上或自顶向下聚类 | 层次结构发现 |
| DBSCAN | 密度聚类 | 基于密度的空间聚类 | 异常形状簇 |
| Gaussian Mixture Model (GMM) | 高斯混合模型 | 多个高斯分布的混合 | 软聚类 |
| Principal Component Analysis (PCA) | 主成分分析 | 线性降维方法 | 特征降维 |
| t-SNE | t分布随机近邻嵌入 | 非线性降维可视化 | 高维数据可视化 |
| UMAP | 一致流形逼近 | t-SNE 的改进版 | 更快更好的可视化 |
| Autoencoder | 自编码器 | 学习数据压缩表示的神经网络 | 降维、去噪 |
| Anomaly Detection | 异常检测 | 识别偏离正常模式的数据 | 欺诈检测 |
| Density Estimation | 密度估计 | 估计数据的概率密度函数 | 数据建模 |

### 2.4 模型评估 (Model Evaluation)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Train/Val/Test Split | 数据集划分 | 训练/验证/测试集分离 | 防止过拟合 |
| Cross-Validation | 交叉验证 | K折交叉验证评估泛化能力 | 小数据集评估 |
| Accuracy | 准确率 | 正确预测的比例 | 平衡数据集 |
| Precision | 精确率 | 预测为正样本中真正为正的比例 | 假阳性代价高 |
| Recall/Sensitivity | 召回率 | 真正为正样本中被正确预测的比例 | 假阴性代价高 |
| F1-Score | F1分数 | 精确率和召回率的调和平均 | 不平衡数据集 |
| ROC Curve | ROC曲线 | 真正例率 vs 假正例率曲线 | 分类阈值选择 |
| AUC | 曲线下面积 | ROC曲线下的面积 | 模型比较 |
| Confusion Matrix | 混淆矩阵 | 预测 vs 真实的分类表格 | 错误分析 |
| Mean Squared Error (MSE) | 均方误差 | 预测与真实值差的平方平均 | 回归评估 |
| Mean Absolute Error (MAE) | 平均绝对误差 | 预测与真实值差的绝对值平均 | 回归评估 |
| R² Score | 决定系数 | 模型解释的数据方差比例 | 回归评估 |
| Log Loss | 对数损失 | 预测概率的负对数似然 | 概率校准 |
| Bias-Variance Tradeoff | 偏差-方差权衡 | 模型复杂度与泛化能力的平衡 | 模型选择 |
| Overfitting | 过拟合 | 模型在训练集表现好但泛化差 | 模型过于复杂 |
| Underfitting | 欠拟合 | 模型过于简单未能捕捉规律 | 模型能力不足 |
| Regularization | 正则化 | 限制模型复杂度的技术 | 防止过拟合 |
| L1 Regularization (Lasso) | L1正则化 | 权重绝对值之和惩罚 | 稀疏特征选择 |
| L2 Regularization (Ridge) | L2正则化 | 权重平方和惩罚 | 权重衰减 |
| Dropout | 随机失活 | 训练时随机丢弃神经元 | 神经网络正则化 |
| Early Stopping | 早停 | 验证集性能下降时停止训练 | 节省训练时间 |
| Data Augmentation | 数据增强 | 变换训练数据增加多样性 | 图像/文本增强 |

---

## 三、深度学习层 (Deep Learning)

### 3.1 神经网络基础 (Neural Network Basics)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Perceptron | 感知机 | 最简单的神经网络单元 | 线性分类 |
| Multilayer Perceptron (MLP) | 多层感知机 | 前馈神经网络 | 通用函数逼近 |
| Activation Function | 激活函数 | 引入非线性的函数 | 网络表达能力 |
| ReLU (Rectified Linear Unit) | 修正线性单元 | f(x) = max(0, x) | 默认激活函数 |
| Leaky ReLU | 带泄露 ReLU | 负数区域有小的斜率 | 缓解神经元死亡 |
| GELU | 高斯误差线性单元 | 平滑的 ReLU 变体 | Transformer |
| Sigmoid | S 型函数 | f(x) = 1/(1+e^(-x)) | 二分类输出 |
| Tanh | 双曲正切 | 零中心的 S 型函数 | RNN 隐藏层 |
| Softmax | 软最大 | 转换为概率分布 | 多分类输出 |
| Swish/SiLU | Swish 激活 | x * sigmoid(x) | 自动搜索发现 |
| Layer Normalization | 层归一化 | 对每层输入归一化 | Transformer |
| Batch Normalization | 批归一化 | 对批次数据归一化 | CNN 加速训练 |
| Group Normalization | 组归一化 | 通道分组归一化 | 小批次训练 |
| Weight Initialization | 权重初始化 | 网络权重初始值设定 | 训练稳定性 |
| Xavier/Glorot Initialization | Xavier 初始化 | 保持前向后向方差一致 | Tanh/Sigmoid |
| He Initialization | He 初始化 | 适应 ReLU 的初始化 | ReLU 网络 |

### 3.2 训练机制 (Training Mechanisms)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Forward Propagation | 前向传播 | 输入通过网络产生输出 | 推理和训练 |
| Backpropagation | 反向传播 | 计算梯度并更新权重的算法 | 训练核心 |
| Chain Rule | 链式法则 | 复合函数求导法则 | 反向传播基础 |
| Gradient Descent | 梯度下降 | 沿负梯度方向更新参数 | 优化基础 |
| Mini-Batch | 小批量 | 每次使用一部分样本计算梯度 | 内存与速度平衡 |
| Epoch | 轮次 | 完整遍历训练数据集一次 | 训练迭代计数 |
| Iteration | 迭代 | 一次参数更新 | 训练步骤 |
| Loss Function | 损失函数 | 衡量预测与真实值差距 | 优化目标 |
| Mean Squared Error (MSE) | 均方误差 | 预测值与真实值差的平方 | 回归任务 |
| Cross-Entropy Loss | 交叉熵损失 | 分类任务标准损失 | 分类任务 |
| Contrastive Loss | 对比损失 | 拉近正样本推远负样本 | 表示学习 |
| Triplet Loss | 三元组损失 | 锚点与正负样本的距离关系 | 人脸识别 |
| Learning Rate Decay | 学习率衰减 | 随训练降低学习率 | 精细收敛 |
| Warmup | 预热 | 训练初期逐渐增加学习率 | 训练稳定性 |
| Gradient Clipping | 梯度裁剪 | 限制梯度大小防止爆炸 | RNN 训练 |

### 3.3 架构组件 (Architecture Components)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Convolution | 卷积 | 局部感受野的权重共享操作 | CNN 核心 |
| Kernel/Filter | 卷积核 | 卷积操作的权重矩阵 | 特征提取 |
| Stride | 步长 | 卷积核移动的间隔 | 下采样 |
| Padding | 填充 | 输入边缘补零 | 保持尺寸 |
| Pooling | 池化 | 降低特征图维度的操作 | 降维、平移不变 |
| Max Pooling | 最大池化 | 取窗口内最大值 | 特征选择 |
| Average Pooling | 平均池化 | 取窗口内平均值 | 信息聚合 |
| Dilated Convolution | 空洞卷积 | 带间隔的卷积 | 扩大感受野 |
| Transposed Convolution | 转置卷积 | 上采样卷积 | 图像生成 |
| Skip Connection | 跳跃连接 | 绕过某些层的连接 | 残差网络 |
| Residual Block | 残差块 | 带跳跃连接的块 | ResNet |
| Attention Mechanism | 注意力机制 | 动态聚焦输入的不同部分 | 序列建模 |
| Self-Attention | 自注意力 | 序列内部元素间的注意力 | Transformer |
| Multi-Head Attention | 多头注意力 | 多组并行的注意力计算 | 捕获不同关系 |
| Cross-Attention | 交叉注意力 | 两个序列间的注意力 | 编码器-解码器 |
| Positional Encoding | 位置编码 | 注入位置信息的编码 | Transformer 序列 |
| Embedding | 嵌入 | 离散对象到连续向量的映射 | 词嵌入、图嵌入 |

### 3.4 经典架构 (Classic Architectures)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| CNN (Convolutional Neural Network) | 卷积神经网络 | 专门处理网格数据的网络 | 图像处理 |
| RNN (Recurrent Neural Network) | 循环神经网络 | 处理序列数据的网络 | 时序建模 |
| LSTM (Long Short-Term Memory) | 长短期记忆网络 | 带门控机制的 RNN | 长序列建模 |
| GRU (Gated Recurrent Unit) | 门控循环单元 | LSTM 的简化版 | 序列建模 |
| Transformer | Transformer | 基于自注意力的架构 | NLP、CV 通用 |
| ResNet | 残差网络 | 带残差连接的深层网络 | 图像分类 |
| DenseNet | 密集连接网络 | 每层与后面所有层连接 | 特征重用 |
| Inception | Inception 网络 | 多尺度卷积并行 | 多尺度特征 |
| U-Net | U 型网络 | 编码器-解码器带跳跃连接 | 图像分割 |
| VAE (Variational Autoencoder) | 变分自编码器 | 学习潜在分布的生成模型 | 生成、表示学习 |
| GAN (Generative Adversarial Network) | 生成对抗网络 | 生成器与判别器对抗训练 | 图像生成 |
| Diffusion Model | 扩散模型 | 逐步去噪的生成模型 | 高质量图像生成 |
| Flow-Based Model | 流模型 | 可逆变换的生成模型 | 精确似然计算 |
| Autoregressive Model | 自回归模型 | 逐元素生成的模型 | 文本/图像生成 |

### 3.5 优化与正则化高级技术 (Advanced Optimization)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Label Smoothing | 标签平滑 | 软化 one-hot 标签 | 防止过自信 |
| Mixup | 混合增强 | 样本和标签的线性插值 | 数据增强 |
| Cutout/Random Erasing | 随机擦除 | 随机遮挡图像区域 | 提高鲁棒性 |
| Stochastic Depth | 随机深度 | 随机丢弃整个残差块 | 深度网络正则化 |
| DropBlock | 块级失活 | 连续区域失活 | 空间特征正则化 |
| Knowledge Distillation | 知识蒸馏 | 大模型知识迁移到小模型 | 模型压缩 |
| Teacher-Student Model | 师生模型 | 教师指导学生学习 | 蒸馏框架 |
| Model Compression | 模型压缩 | 减小模型大小和计算量 | 边缘部署 |
| Quantization | 量化 | 降低权重和激活精度 | 推理加速 |
| Pruning | 剪枝 | 移除不重要的权重/神经元 | 稀疏化 |
| Neural Architecture Search (NAS) | 神经架构搜索 | 自动搜索最优架构 | AutoML |

---

## 四、大模型与 NLP 层 (LLMs & NLP)

### 4.1 基础概念 (Fundamentals)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Token | 词元 | 文本分词后的最小单位 | 模型输入单元 |
| Tokenization | 分词 | 将文本拆分为 Token | 预处理 |
| BPE (Byte Pair Encoding) | 字节对编码 | 子词分词算法 | GPT 系列 |
| WordPiece | 词片 | 类似 BPE 的分词算法 | BERT |
| SentencePiece | 句子片段 | 语言无关的分词 | 多语言模型 |
| Vocabulary | 词汇表 | 模型认识的所有 Token | 模型容量 |
| Embedding Layer | 嵌入层 | 将 Token 映射为向量 | 词表示 |
| Context Window | 上下文窗口 | 模型能处理的最大长度 | 长文本处理 |
| Position Embedding | 位置嵌入 | 表示位置信息的向量 | 序列顺序 |
| Rotary Position Embedding (RoPE) | 旋转位置编码 | 相对位置的旋转编码 | 长上下文模型 |
| ALiBi | 注意力线性偏置 | 基于距离的位置编码 | 外推能力 |

### 4.2 预训练任务 (Pre-training Tasks)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Masked Language Modeling (MLM) | 掩码语言建模 | 预测被掩码的 Token | BERT 预训练 |
| Autoregressive Language Modeling | 自回归语言建模 | 预测下一个 Token | GPT 预训练 |
| Causal Masking | 因果掩码 | 只能看到前面的 Token | 自回归模型 |
| Span Corruption | 跨度损坏 | 预测连续的掩码片段 | T5 预训练 |
| Permutation Language Modeling | 排列语言建模 | 随机排列后自回归 | XLNet |
| Next Sentence Prediction (NSP) | 下一句预测 | 判断两句话是否连续 | BERT 原始 |
| Sentence Order Prediction (SOP) | 句子顺序预测 | 判断句子顺序 | ALBERT 改进 |
| Contrastive Learning | 对比学习 | 拉近正样本推远负样本 | 表示学习 |
| CLIP (Contrastive Language-Image) | 对比语言图像预训练 | 图文对齐的对比学习 | 多模态 |

### 4.3 架构演进 (Architecture Evolution)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Encoder-Decoder | 编码器-解码器 | 分别编码输入解码输出 | 翻译、摘要 |
| Encoder-Only | 仅编码器 | 双向编码表示 | 理解任务 |
| Decoder-Only | 仅解码器 | 自回归生成 | 生成任务 |
| Transformer-XL | 扩展 Transformer | 片段级递归机制 | 超长序列 |
| XLNet | XLNet | 排列语言建模 | 理解+生成 |
| BERT | 双向编码器表示 | 双向 Transformer 编码器 | 理解任务 |
| RoBERTa | 鲁棒优化 BERT | BERT 的优化训练 | 理解任务 |
| ALBERT | 轻量 BERT | 参数共享和分解 | 轻量化 |
| DeBERTa | 解耦注意力 BERT | 解耦内容和位置注意力 | SOTA 理解 |
| GPT (Generative Pre-trained Transformer) | 生成预训练 Transformer | 自回归生成模型 | 文本生成 |
| GPT-2/3/4 | GPT 系列 | 规模递增的 GPT 模型 | 通用生成 |
| LLaMA | 大语言模型 Meta AI | Meta 开源大模型 | 开源生态 |
| T5 (Text-to-Text Transfer Transformer) | 文本到文本迁移 Transformer | 统一文本到文本框架 | 多任务 |
| BART | 双向自回归 Transformer | BERT + GPT 结合 | 生成理解 |
| Switch Transformer | 开关 Transformer | 稀疏专家混合 | 规模扩展 |

### 4.4 微调与对齐 (Fine-tuning & Alignment)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Fine-tuning | 微调 | 在预训练模型基础上继续训练 | 下游任务适应 |
| Full Fine-tuning | 全参数微调 | 更新所有参数 | 数据充足时 |
| Parameter-Efficient Fine-Tuning (PEFT) | 参数高效微调 | 只更新少量参数 | 资源受限 |
| LoRA (Low-Rank Adaptation) | 低秩适应 | 低秩矩阵近似更新 | 高效微调 |
| QLoRA | 量化 LoRA | 4-bit 量化 + LoRA | 单卡微调大模型 |
| AdaLoRA | 自适应 LoRA | 动态分配低秩预算 | 更高效的 LoRA |
| DoRA | 权重分解低秩适应 | 分解为幅度和方向 | 稳定性更好 |
| Prefix Tuning | 前缀微调 | 训练连续前缀向量 | 生成任务 |
| Prompt Tuning | 提示微调 | 训练软提示嵌入 | 分类任务 |
| P-Tuning | P 微调 | 用 LSTM 生成虚拟 Token | NLU 任务 |
| Adapter | 适配器 | 插入小型可训练模块 | 多任务适应 |
| Instruction Tuning | 指令微调 | 用指令数据训练 | 指令遵循 |
| Chain-of-Thought (CoT) | 思维链 | 展示推理过程的示例 | 推理能力 |
| In-Context Learning | 上下文学习 | 从上下文中学习新任务 | 少样本学习 |
| RLHF (Reinforcement Learning from Human Feedback) | 人类反馈强化学习 | 用人类偏好训练奖励模型 | 对齐训练 |
| PPO (Proximal Policy Optimization) | 近端策略优化 | RLHF 中的策略优化算法 | 对齐训练 |
| DPO (Direct Preference Optimization) | 直接偏好优化 | 绕过奖励模型直接优化 | 简化 RLHF |
| Constitutional AI | 宪法 AI | 用原则自我修正 | 价值对齐 |
| RAG (Retrieval-Augmented Generation) | 检索增强生成 | 结合检索和生成 | 知识问答 |
| SFT (Supervised Fine-Tuning) | 监督微调 | 有监督的指令微调 | 基础对齐 |

### 4.5 提示工程 (Prompt Engineering)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Zero-Shot Prompting | 零样本提示 | 直接描述任务 | 简单任务 |
| Few-Shot Prompting | 少样本提示 | 提供示例 | 复杂任务 |
| Chain-of-Thought (CoT) | 思维链提示 | 展示推理步骤 | 推理任务 |
| Zero-Shot CoT | 零样本思维链 | 添加"让我们逐步思考" | 自动推理 |
| Self-Consistency | 自一致性 | 多次采样投票 | 提高准确性 |
| Tree of Thoughts (ToT) | 思维树 | 多路径探索推理 | 复杂决策 |
| Graph of Thoughts (GoT) | 思维图 | 图结构组织思维 | 复杂推理 |
| ReAct (Reasoning + Acting) | 推理+行动 | 交替推理和行动 | 工具使用 |
| Prompt Template | 提示模板 | 可复用的提示结构 | 工程化 |
| System Prompt | 系统提示 | 设定全局行为的提示 | 角色设定 |
| Role Prompting | 角色提示 | 指定模型扮演的角色 | 风格控制 |
| Context Window | 上下文窗口 | 模型能处理的最大长度 | 长文本 |

### 4.6 模型评估 (Model Evaluation)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Perplexity | 困惑度 | 2^(平均交叉熵)，语言模型指标 | 语言建模 |
| BLEU | 双语评估替补 | n-gram 精确率 | 机器翻译 |
| ROUGE | 面向召回的概要评估 | n-gram 召回率 | 摘要生成 |
| METEOR | 显式排序翻译评估 | 考虑同义词和词干 | 翻译评估 |
| BERTScore | BERT 分数 | 基于嵌入的相似度 | 生成评估 |
| MMLU | 大规模多任务语言理解 | 57 个学科知识测试 | 知识评估 |
| HellaSwag | 常识推理 | 句子补全常识推理 | 常识评估 |
| ARC | AI2 推理挑战 | 科学考试问题 | 推理评估 |
| TruthfulQA | 真实问答 | 模型是否说真话 | 真实性评估 |
| HumanEval | 人工评估 | 代码生成能力测试 | 代码评估 |
| MT-Bench | 多轮对话基准 | 多轮对话质量评估 | 对话评估 |
| Arena Elo | 竞技场 ELO | 两两对战评分 | 人类偏好 |
| Toxicity | 毒性 | 有害内容生成检测 | 安全性评估 |
| Bias | 偏见 | 刻板印象和歧视检测 | 公平性评估 |

---

## 五、AI 基础设施层 (AI Infrastructure)

### 5.1 硬件层 (Hardware)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| CPU (Central Processing Unit) | 中央处理器 | 通用计算处理器 | 数据预处理 |
| GPU (Graphics Processing Unit) | 图形处理器 | 并行计算处理器，AI 主力 | 训练/推理 |
| TPU (Tensor Processing Unit) | 张量处理器 | Google AI 专用芯片 | 云端训练 |
| NPU (Neural Processing Unit) | 神经网络处理器 | 端侧 AI 芯片 | 手机/边缘 |
| ASIC (Application-Specific IC) | 专用集成电路 | 特定应用定制芯片 | 推理加速 |
| FPGA (Field-Programmable Gate Array) | 现场可编程门阵列 | 可编程硬件 | 灵活推理 |
| NVIDIA H100/H200/B200 | NVIDIA GPU | 最新代数据中心 GPU | 大模型训练 |
| AMD MI300X | AMD GPU | AMD 数据中心 GPU | 替代方案 |
| Memory Bandwidth | 内存带宽 | GPU 与显存数据传输速度 | 训练瓶颈 |
| VRAM (Video RAM) | 显存 | GPU 专用内存 | 模型大小限制 |
| HBM (High Bandwidth Memory) | 高带宽内存 | 3D 堆叠高速显存 | 高端 GPU |
| Interconnect | 互联 | GPU 之间高速连接 | 分布式训练 |
| NVLink | NVLink | NVIDIA GPU 高速互联 | 多卡通信 |
| InfiniBand | 无限带宽 | 高性能计算网络 | 集群互联 |
| RDMA (Remote Direct Memory Access) | 远程直接内存访问 | 绕过 CPU 直接内存访问 | 网络加速 |

### 5.2 分布式训练 (Distributed Training)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Data Parallelism | 数据并行 | 数据分片，模型复制 | 主流并行 |
| Model Parallelism | 模型并行 | 模型分片，数据复制 | 大模型训练 |
| Pipeline Parallelism | 流水线并行 | 层分配到不同设备 | 大模型训练 |
| Tensor Parallelism | 张量并行 | 层内张量切分 | 大模型训练 |
| ZeRO (Zero Redundancy Optimizer) | 零冗余优化器 | 切分优化器状态 | 显存优化 |
| DeepSpeed | DeepSpeed | Microsoft 分布式训练库 | 大模型训练 |
| Megatron-LM | Megatron-LM | NVIDIA 大模型训练框架 | GPT 训练 |
| Fully Sharded Data Parallel (FSDP) | 完全分片数据并行 | PyTorch 分布式方案 | 分布式训练 |
| Mixed Precision Training | 混合精度训练 | FP16/BF16 + FP32 | 加速训练 |
| Gradient Accumulation | 梯度累积 | 多步累积后更新 | 大批次模拟 |
| Gradient Checkpointing | 梯度检查点 | 重新计算代替存储 | 显存优化 |
| Activation Checkpointing | 激活检查点 | 同梯度检查点 | 显存优化 |
| Offloading | 卸载 | 将数据移到 CPU/磁盘 | 超大规模模型 |

### 5.3 推理优化 (Inference Optimization)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Quantization | 量化 | 降低数值精度 | 推理加速 |
| INT8/INT4 Quantization | 8/4 位量化 | 权重量化到 INT8/INT4 | 边缘部署 |
| AWQ (Activation-Aware Weight Quantization) | 激活感知权重量化 | 考虑激活的量化 | 4-bit 推理 |
| GPTQ | GPTQ | 逐层量化方法 | 后训练量化 |
| GGUF/GGML | GGUF/GGML | llama.cpp 量化格式 | 本地推理 |
| KV Cache | 键值缓存 | 存储 Attention KV 避免重复计算 | 自回归加速 |
| Continuous Batching | 连续批处理 | 动态批处理请求 | 吞吐优化 |
| PagedAttention | 分页注意力 | 类似虚拟内存的 KV 管理 | vLLM 核心 |
| Speculative Decoding | 投机解码 | 小模型草稿+大模型验证 | 解码加速 |
| TensorRT | TensorRT | NVIDIA 推理优化器 | 生产推理 |
| ONNX Runtime | ONNX 运行时 | 跨平台推理引擎 | 模型部署 |
| OpenVINO | OpenVINO | Intel 推理工具包 | Intel 硬件 |

### 5.4 模型服务 (Model Serving)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| vLLM | vLLM | 高吞吐 LLM 推理引擎 | 生产部署 |
| Text Generation Inference (TGI) | 文本生成推理 | Hugging Face 推理服务 | 快速部署 |
| SGLang | SGLang | 结构化生成语言 | 编程代理 |
| llama.cpp | llama.cpp | C++ 实现的 LLaMA 推理 | 本地部署 |
| Ollama | Ollama | 本地大模型管理工具 | 开发测试 |
| Triton Inference Server | Triton 推理服务器 | NVIDIA 模型服务 | 生产环境 |
| TorchServe | TorchServe | PyTorch 模型服务 | PyTorch 部署 |
| KServe | KServe | Kubernetes 模型服务 | 云原生 |
| BentoML | BentoML | 模型服务框架 | ML 服务 |
| Model Registry | 模型注册表 | 模型版本管理 | MLOps |
| A/B Testing | A/B 测试 | 模型版本对比测试 | 效果验证 |
| Canary Deployment | 金丝雀部署 | 小流量验证新模型 | 风险控制 |
| Blue-Green Deployment | 蓝绿部署 | 两套环境切换 | 零停机 |

### 5.5 向量数据库与检索 (Vector DB & Retrieval)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Vector Database | 向量数据库 | 存储和检索高维向量的数据库 | RAG 核心 |
| Embedding | 嵌入/向量 | 数据的向量表示 | 语义检索 |
| Similarity Search | 相似度搜索 | 查找最相似的向量 | 语义检索 |
| Approximate Nearest Neighbor (ANN) | 近似最近邻 | 快速近似相似度搜索 | 大规模检索 |
| HNSW (Hierarchical Navigable Small World) | 层次可导航小世界 | 图索引算法 | 高性能 ANN |
| IVF (Inverted File Index) | 倒排文件索引 | 聚类+倒排索引 | 平衡速度精度 |
| Cosine Similarity | 余弦相似度 | 向量夹角余弦值 | 方向相似性 |
| Euclidean Distance | 欧氏距离 | 向量间直线距离 | 距离度量 |
| Dot Product | 点积 | 向量内积 | 相似度度量 |
| L2 Normalization | L2 归一化 | 向量长度归一化 | 距离计算 |
| Pinecone | Pinecone | 托管向量数据库 | 生产 RAG |
| Milvus | Milvus | 开源向量数据库 | 大规模部署 |
| Weaviate | Weaviate | 开源向量数据库 | GraphQL 接口 |
| Chroma | Chroma | 轻量级向量数据库 | 开发测试 |
| pgvector | pgvector | PostgreSQL 向量扩展 | SQL 场景 |
| Redis Vector | Redis 向量 | Redis 向量搜索 | 缓存场景 |

### 5.6 MLOps 与数据管理 (MLOps & Data)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| MLOps | 机器学习运维 | ML 系统的 DevOps 实践 | 生产化 |
| MLflow | MLflow | 开源 MLOps 平台 | 实验管理 |
| Kubeflow | Kubeflow | Kubernetes 上的 ML 工作流 | K8s ML |
| Weights & Biases (W&B) | W&B | 实验跟踪和可视化 | 实验管理 |
| TensorBoard | TensorBoard | TensorFlow 可视化工具 | 训练监控 |
| Data Versioning | 数据版本控制 | 数据集版本管理 | 可复现性 |
| DVC (Data Version Control) | 数据版本控制 | Git 式数据版本管理 | 数据管理 |
| Feature Store | 特征存储 | 特征共享和管理平台 | 特征工程 |
| Feast | Feast | 开源特征存储 | 特征服务 |
| Tecton | Tecton | 商业特征平台 | 企业级 |
| Data Pipeline | 数据管道 | 数据处理工作流 | ETL/ELT |
| Apache Airflow | Airflow | 工作流编排工具 | 数据管道 |
| Prefect | Prefect | 现代工作流编排 | 数据管道 |
| Dagster | Dagster | 数据编排平台 | 数据资产 |

---

## 六、AI Agent 层 (AI Agents)

### 6.1 Agent 基础 (Agent Fundamentals)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| AI Agent | AI 智能体 | 能感知、决策、行动的自主系统 | 自动化任务 |
| Autonomous Agent | 自主智能体 | 无需人工干预的 Agent | 全自动流程 |
| Agent Architecture | Agent 架构 | Agent 的组件和组织方式 | 系统设计 |
| Perception | 感知 | 接收和处理环境信息 | 输入理解 |
| Reasoning | 推理 | 基于信息做出决策 | 规划思考 |
| Planning | 规划 | 制定行动序列 | 任务分解 |
| Action | 行动 | 执行具体操作 | 工具调用 |
| Tool Use | 工具使用 | 调用外部工具完成任务 | 扩展能力 |
| Memory | 记忆 | 存储和回忆信息 | 上下文保持 |
| Short-Term Memory | 短期记忆 | 当前会话的上下文 | 对话历史 |
| Long-Term Memory | 长期记忆 | 跨会话的持久化记忆 | 个性化 |
| Episodic Memory | 情景记忆 | 特定事件的记忆 | 经验学习 |
| Semantic Memory | 语义记忆 | 事实性知识记忆 | 知识库 |
| Procedural Memory | 程序记忆 | 技能和流程的记忆 | 工具使用 |

### 6.2 Agent 设计模式 (Agent Patterns)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| ReAct (Reasoning + Acting) | 推理+行动 | 交替推理和行动的循环 | 工具使用 Agent |
| Plan-and-Solve | 规划-执行 | 先规划后执行的模式 | 复杂任务 |
| Reflection | 反思 | 自我评估和改进 | 质量提升 |
| Chain-of-Thought | 思维链 | 展示推理过程 | 复杂推理 |
| Tree of Thoughts | 思维树 | 多路径探索推理 | 决策搜索 |
| Multi-Agent | 多智能体 | 多个 Agent 协作 | 复杂系统 |
| Agent Collaboration | Agent 协作 | 多个 Agent 配合工作 | 团队任务 |
| Agent Competition | Agent 竞争 | 多个 Agent 相互竞争 | 博弈场景 |
| Hierarchical Agents | 层次化 Agent | 分层的 Agent 组织 | 大规模系统 |
| Role-Based Agents | 基于角色的 Agent | 分配不同角色 | 专业分工 |
| Observer Pattern | 观察者模式 | Agent 观察状态变化 | 事件响应 |
| State Machine | 状态机 | 基于状态转移的 Agent | 流程控制 |

### 6.3 Agent 框架 (Agent Frameworks)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| LangChain | LangChain | LLM 应用开发框架 | Agent 开发 |
| LangGraph | LangGraph | 状态化多 Agent 编排 | 复杂工作流 |
| LangSmith | LangSmith | LLM 应用监控平台 | 可观测性 |
| LlamaIndex | LlamaIndex | LLM 数据连接框架 | RAG 应用 |
| AutoGPT | AutoGPT | 自主 GPT Agent | 自主任务 |
| BabyAGI | BabyAGI | 任务驱动的自主 Agent | 任务管理 |
| CrewAI | CrewAI | 多角色 Agent 编排 | 团队协作 |
| AutoGen | AutoGen | 微软多 Agent 对话框架 | 对话系统 |
| Semantic Kernel | Semantic Kernel | 微软 Agent SDK | 企业开发 |
| Haystack | Haystack | NLP 应用框架 | 搜索问答 |
| Transformers Agents | Transformers Agents | Hugging Face Agent | 工具调用 |
| OpenAI Assistants API | OpenAI 助手 API | OpenAI 的 Agent 接口 | 快速开发 |

### 6.4 工具与协议 (Tools & Protocols)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Function Calling | 函数调用 | LLM 调用定义好的函数 | 工具使用 |
| Tool Definition | 工具定义 | 描述工具的 Schema | 工具注册 |
| Tool Registry | 工具注册表 | 管理和发现工具 | 工具管理 |
| API Integration | API 集成 | 连接外部服务 | 扩展能力 |
| MCP (Model Context Protocol) | 模型上下文协议 | Anthropic 的 Agent 协议 | 工具标准化 |
| A2A (Agent-to-Agent) | Agent 间协议 | Google 的 Agent 通信协议 | 多 Agent 协作 |
| UCP (Universal Compute Protocol) | 通用计算协议 | 跨平台计算协议 | 计算资源 |
| OpenAPI | OpenAPI | REST API 规范 | API 描述 |
| JSON Schema | JSON 模式 | 数据结构验证 | 工具参数 |
| WebSocket | WebSocket | 全双工通信协议 | 实时交互 |
| gRPC | gRPC | 高性能 RPC 框架 | 内部通信 |

### 6.5 Agent 能力扩展 (Agent Capabilities)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Code Generation | 代码生成 | 生成可执行代码 | 编程助手 |
| Code Execution | 代码执行 | 安全执行生成的代码 | 沙箱环境 |
| Web Browsing | 网页浏览 | 自动化浏览网页 | 信息获取 |
| Web Scraping | 网页抓取 | 提取网页内容 | 数据采集 |
| File Operations | 文件操作 | 读写文件 | 文档处理 |
| Database Query | 数据库查询 | 执行 SQL 查询 | 数据检索 |
| Image Generation | 图像生成 | 调用图像生成模型 | 创意生成 |
| Speech Recognition | 语音识别 | 音频转文本 | 语音交互 |
| Text-to-Speech | 文本转语音 | 文本转音频 | 语音输出 |
| Vision Understanding | 视觉理解 | 理解图像内容 | 多模态 |
| Browser Automation | 浏览器自动化 | 控制浏览器操作 | 网页交互 |
| Computer Use | 计算机使用 | 控制计算机 GUI | 通用操作 |

### 6.6 Agent 评估与监控 (Agent Evaluation)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Agent Evaluation | Agent 评估 | 评估 Agent 性能 | 质量保证 |
| Task Completion Rate | 任务完成率 | 成功完成任务的比例 | 成功率 |
| Correctness | 正确性 | 输出是否正确 | 准确性 |
| Helpfulness | 有用性 | 输出是否有帮助 | 用户体验 |
| Harmlessness | 无害性 | 是否产生有害内容 | 安全性 |
| Honesty | 诚实性 | 是否如实回答 | 可信度 |
| Trajectory Evaluation | 轨迹评估 | 评估执行路径 | 过程质量 |
| Tool Use Accuracy | 工具使用准确率 | 正确选择和使用工具 | 工具能力 |
| LLM-as-Judge | LLM 评判 | 用 LLM 评估输出 | 自动评估 |
| Human Evaluation | 人工评估 | 人类评判质量 | 黄金标准 |
| A/B Testing | A/B 测试 | 对比不同版本 | 效果比较 |
| User Feedback | 用户反馈 | 收集用户评价 | 持续改进 |
| Tracing | 追踪 | 记录执行轨迹 | 调试分析 |
| Observability | 可观测性 | 监控 Agent 运行 | 运维管理 |
| LangSmith Tracing | LangSmith 追踪 | 详细的执行追踪 | 调试优化 |

---

## 七、伦理与安全层 (Ethics & Safety)

### 7.1 AI 伦理 (AI Ethics)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| AI Ethics | AI 伦理 | AI 开发和应用的道德准则 | 负责任 AI |
| Fairness | 公平性 | 不对特定群体产生偏见 | 算法公平 |
| Bias | 偏见 | 系统性的偏好或歧视 | 偏见检测 |
| Algorithmic Bias | 算法偏见 | 算法产生的偏见 | 公平性评估 |
| Data Bias | 数据偏见 | 训练数据中的偏见 | 数据质量 |
| Selection Bias | 选择偏见 | 样本选择不当导致的偏见 | 采样设计 |
| Confirmation Bias | 确认偏见 | 只关注支持预期的数据 | 评估客观 |
| Historical Bias | 历史偏见 | 反映历史不公的偏见 | 社会公平 |
| Transparency | 透明性 | 决策过程可理解 | 可解释 AI |
| Explainability | 可解释性 | 模型决策可解释 | 高风险决策 |
| Accountability | 可问责性 | 明确责任归属 | 法律合规 |
| Privacy | 隐私保护 | 保护个人数据 | 数据合规 |
| Consent | 知情同意 | 获得数据使用的同意 | 数据收集 |
| Data Sovereignty | 数据主权 | 数据的地域管辖权 | 跨境数据 |

### 7.2 AI 安全 (AI Safety)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| AI Safety | AI 安全 | 防止 AI 系统产生危害 | 安全研究 |
| Value Alignment | 价值对齐 | AI 目标与人类价值观一致 | 安全基础 |
| Reward Hacking | 奖励黑客 | 利用奖励函数漏洞 | 强化学习安全 |
| Specification Gaming | 规格游戏 | 钻目标定义的空子 | 目标设定 |
| Goal Misgeneralization | 目标误泛化 | 学习到错误的目标 | 泛化安全 |
| Deceptive Alignment | 欺骗性对齐 | 表面对齐实际隐藏目标 | 深度安全 |
| Emergent Behaviors | 涌现行为 | 规模增大后意外出现的行为 | 预测困难 |
| Capability Overhang | 能力悬垂 | 未被发现的能力 | 能力评估 |
| Jailbreaking | 越狱 | 绕过安全限制 | 提示安全 |
| Prompt Injection | 提示注入 | 通过输入操控模型 | 输入安全 |
| Adversarial Attack | 对抗攻击 | 故意构造误导输入 | 鲁棒性 |
| Backdoor Attack | 后门攻击 | 训练时植入触发器 | 供应链安全 |
| Data Poisoning | 数据投毒 | 污染训练数据 | 数据安全 |
| Model Extraction | 模型提取 | 窃取模型参数 | 知识产权保护 |
| Membership Inference | 成员推断 | 推断数据是否在训练集 | 隐私泄露 |

### 7.3 安全实践 (Safety Practices)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| Red Teaming | 红队测试 | 模拟攻击者测试系统 | 安全评估 |
| Blue Teaming | 蓝队防御 | 防御和响应安全威胁 | 安全防护 |
| Adversarial Training | 对抗训练 | 用对抗样本训练 | 提高鲁棒性 |
| Constituional AI | 宪法 AI | 用原则约束模型行为 | 价值对齐 |
| RLHF for Safety | 安全 RLHF | 用人类反馈进行安全对齐 | 安全训练 |
| Content Moderation | 内容审核 | 过滤有害内容 | 输出安全 |
| Safety Filters | 安全过滤器 | 拦截有害生成 | 实时防护 |
| Input Sanitization | 输入净化 | 清理和验证输入 | 输入安全 |
| Output Filtering | 输出过滤 | 审查和过滤输出 | 输出安全 |
| Monitoring & Alerting | 监控告警 | 实时安全监控 | 运维安全 |
| Incident Response | 事件响应 | 安全事件处理流程 | 应急响应 |
| Responsible Disclosure | 负责任披露 | 安全漏洞披露流程 | 漏洞管理 |

### 7.4 治理与合规 (Governance & Compliance)

| Concept | 中文 | 定义 | 应用场景 |
|---------|------|------|----------|
| AI Governance | AI 治理 | AI 系统的管理和监督 | 组织管理 |
| AI Regulation | AI 监管 | 政府制定的 AI 法规 | 法律合规 |
| EU AI Act | 欧盟 AI 法案 | 欧盟的 AI 监管法规 | 欧洲市场 |
| Risk-Based Approach | 基于风险的方法 | 按风险等级分类管理 | 风险管理 |
| High-Risk AI System | 高风险 AI 系统 | 可能造成严重伤害的 AI | 重点监管 |
| Conformity Assessment | 合格评定 | 验证符合法规要求 | 市场准入 |
| AI Bill of Materials (AI BOM) | AI 物料清单 | AI 系统组件清单 | 供应链透明 |
| Model Card | 模型卡片 | 模型信息和性能文档 | 模型透明 |
| Datasheet | 数据表 | 数据集信息和文档 | 数据透明 |
| System Card | 系统卡片 | 完整系统的文档 | 系统透明 |
| Impact Assessment | 影响评估 | 评估 AI 的社会影响 | 事前评估 |
| Algorithmic Impact Assessment | 算法影响评估 | 专门的算法评估 | 公平性评估 |

---

## 八、附录：权威来源索引

### 8.1 国际标准与组织

| 来源 | 网址 | 说明 |
|------|------|------|
| ISO/IEC 23053:2022 | https://www.iso.org | AI 系统框架国际标准 |
| IEEE AI Standards | https://standards.ieee.org | AI 技术标准 |
| ISTQB Glossary | https://www.istqb.org/glossary/ | 软件测试术语 |
| NIST AI Framework | https://www.nist.gov/itl/ai | 美国 AI 框架 |

### 8.2 企业技术文档

| 来源 | 网址 | 说明 |
|------|------|------|
| Google AI Glossary | https://developers.google.com/machine-learning/glossary | 最全面的 ML 术语 |
| NVIDIA Glossary | https://www.nvidia.com/en-us/glossary/ | 硬件到软件全栈 |
| Microsoft Azure AI | https://learn.microsoft.com/en-us/azure/ai-foundamentals/glossary | 企业级 AI |
| AWS ML Glossary | https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/glossary.html | 云原生视角 |
| IBM Data Science | https://www.ibm.com/data-science-glossary | 学术研究导向 |

### 8.3 开源项目与框架

| 来源 | 网址 | 说明 |
|------|------|------|
| Hugging Face Docs | https://huggingface.co/docs | Transformers 生态 |
| LangChain Docs | https://python.langchain.com/docs | Agent 开发框架 |
| LlamaIndex Docs | https://docs.llamaindex.ai | RAG 框架 |
| PyTorch Docs | https://pytorch.org/docs | 深度学习框架 |
| TensorFlow Docs | https://www.tensorflow.org/api_docs | 深度学习框架 |

### 8.4 研究论文与博客

| 来源 | 网址 | 说明 |
|------|------|------|
| Papers with Code | https://paperswithcode.com | 论文+代码 |
| Distill.pub | https://distill.pub | 可视化解释 |
| The Gradient | https://thegradient.pub | AI 研究博客 |
| BAIR Blog | https://bair.berkeley.edu/blog/ | 伯克利 AI 研究 |
| OpenAI Blog | https://openai.com/blog | 前沿研究 |
| Anthropic Research | https://www.anthropic.com/research | AI 安全研究 |

### 8.5 行业报告与地图

| 来源 | 网址 | 说明 |
|------|------|------|
| State of AI Report | https://www.stateof.ai | 年度 AI 报告 |
| AI Index Report | https://aiindex.stanford.edu | 斯坦福 AI 指数 |
| ExploreDatabase | https://www.exploredatabase.com | AI 架构图 |
| Madrona Ventures | https://www.madrona.com | 投资视角 AI 地图 |
| IA40 | https://www.ia40.com | AI 基础设施 40 强 |

---

## 📌 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0 | 2026-04-03 | 初始版本，收录 300+ 概念，分 7 层 |

---

## 🔗 相关文档索引

所有概念已在以下文档中详细展开：

### 核心概念文档

| 文档 | 路径 | 内容 |
|------|------|------|
| **Agent 协议详解** | `06_强化学习/AI_Agents/Agent_Protocols_Detail.md` | MCP、A2A、UCP 完整解析 |
| **多模态模型架构** | `05_大模型/09_多模态模型/Multimodal_Architectures_2026.md` | GPT-4.5、Gemini 2.0、Claude 4 |
| **VLA 模型** | `06_强化学习/05_机器人与具身智能/VLA_Models_2026.md` | π0、RDT、OpenVLA 详解 |
| **JEPA 深度解析** | `03_深度学习/07_世界模型/JEPA_Architecture_2026.md` | LeCun 世界模型完整指南 |
| **具身智能指南** | `06_强化学习/05_机器人与具身智能/Embodied_AI_Complete_2026.md` | 人形机器人、技术栈 |
| **Agent Harness** | `15_智能体/07_Agent评估/Agent_Harness_Complete_2026.md` | Agent 评估框架详解 |
| **Agent 未来路线图** | `06_强化学习/AI_Agents/Agent_Future_Roadmap_2026_2030.md` | 2026-2030 技术预测 |
| **AI 基础设施趋势** | `12_架构基建/AI_Infrastructure_2026.md` | H100/B200、SGLang、成本优化 |
| **概念知识图谱** | `AI_Concept_Knowledge_Graph.md` | 概念依赖关系与学习路径 |

### 概念完成状态

- [x] MCP / A2A / UCP 协议详解
- [x] VLA (Vision-Language-Action) 模型
- [x] JEPA / World Models 概念
- [x] 具身智能 (Embodied AI) 概念
- [x] AI 硬件最新趋势 (H100/H200/B200)
- [x] 多模态模型架构 (GPT-4V, Gemini)
- [x] Agent Harness 评估框架
- [x] Agent 未来发展方向 2026-2030
- [x] 概念依赖关系图
- [x] 映射到本仓库具体文档路径

---

*Generated by AI Guru Knowledge Base | 让 AI 学习更系统*

## Related

- [[治理/notes/AI_Concept_Knowledge_Graph]] — AI 概念知识图谱 (共享: drafts, ideas, notes, observations)
- [[治理/notes/KNOWLEDGE_BASE]] — 🧠 AI Guru Knowledge Base (共享: drafts, ideas, notes, observations)
- [[治理/notes/README|README_for_dummy]]
