---
title: 02 经典机器学习 (Classical Machine Learning)
category: 02-machine-learning
tags: ["machine-learning", "supervised", "unsupervised"]
summary: "本章介绍深度学习之前的主流机器学习方法，包括监督学习（分类/回归/集成）、无监督学习（聚类/降维）和特征工程。这些技术至今仍在工业界广泛应用，是理解 AI 建模思路的重要基础。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

---
# 02 经典机器学习 (Classical Machine Learning)

本章介绍深度学习之前的主流机器学习方法，包括监督学习（分类/回归/集成）、无监督学习（聚类/降维）和特征工程。这些技术至今仍在工业界广泛应用，是理解 AI 建模思路的重要基础。

## 学习路径 (Learning Path)

```
    ┌────────────────────┐
    │  监督学习           │
    │  Supervised        │
    │  Learning          │
    └──────────┬─────────┘
               │
               ▼
    ┌────────────────────┐
    │  特征工程           │
    │  Feature           │
    │  Engineering       │
    └──────────┬─────────┘
               │
               ▼
    ┌────────────────────┐
    │  无监督学习          │
    │  Unsupervised      │
    │  Learning          │
    └────────────────────┘
```

## 内容索引 (Content Index)

### 基础方法

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 监督学习 (Supervised Learning) | 入门 | 分类、回归、集成学习（XGBoost/LightGBM），掌握有标签数据建模 | [Supervised_Learning.md](./Supervised_Learning/Supervised_Learning.md) |
| 特征工程 (Feature Engineering) | 进阶 | 特征选择、特征构造、特征编码，提升模型性能的关键技能 | [Feature_Engineering/](./Feature_Engineering/) |
| 无监督学习 (Unsupervised Learning) | 进阶 | 聚类（K-Means/DBSCAN）、降维（PCA/t-SNE），挖掘无标签数据 | [Unsupervised_Learning.md](./Unsupervised_Learning/Unsupervised_Learning.md) |
| **经典算法速查表** | **入门** | **12 个经典 ML 算法对比，用类比建立算法选择直觉** | **[ML_Algorithms_Cheatsheet.md](./ML_Algorithms_Cheatsheet.md)** |

### 进阶主题

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 集成学习 (Ensemble Learning) | 进阶 | Bagging/Boosting/Stacking，XGBoost/LightGBM/CatBoost 全面对比 | [Ensemble_Learning.md](./Ensemble_Learning/Ensemble_Learning.md) |
| 时间序列 (Time Series) | 进阶 | ARIMA/Prophet/Transformer 时序方法，预测未来趋势 | [Time_Series_Analysis.md](./Time_Series/Time_Series_Analysis.md) |
| 异常检测 (Anomaly Detection) | 进阶 | Isolation Forest/AutoEncoder/统计方法，发现数据中的异常 | [Anomaly_Detection.md](./Anomaly_Detection/Anomaly_Detection.md) |
| 推荐系统 (Recommendation Systems) | 进阶 | 协同过滤/矩阵分解/深度推荐，淘宝/Netflix 核心技术 | [Recommendation_Systems.md](./Recommendation_Systems/Recommendation_Systems.md) |
| AutoML | 进阶 | 自动化模型选择与调参，Optuna/Ray Tune/FLAML 实战 | [AutoML.md](./AutoML/AutoML.md) |

### 小白版 (for Dummy)

| 主题 | 文档链接 |
|------|---------|
| 集成学习入门 | [Ensemble_Learning_for_dummy.md](./Ensemble_Learning/Ensemble_Learning_for_dummy.md) |
| 时间序列入门 | [Time_Series_for_dummy.md](./Time_Series/Time_Series_for_dummy.md) |
| 异常检测入门 | [Anomaly_Detection_for_dummy.md](./Anomaly_Detection/Anomaly_Detection_for_dummy.md) |
| 推荐系统入门 | [Recommendation_Systems_for_dummy.md](./Recommendation_Systems/Recommendation_Systems_for_dummy.md) |
| AutoML 入门 | [AutoML_for_dummy.md](./AutoML/AutoML_for_dummy.md) |
| **数据预处理入门** | [Data_Preprocessing_for_dummy.md](./Feature_Engineering/Data_Preprocessing_for_dummy.md) |
| **第一个 ML 模型** | [Your_First_ML_Model.md](./Supervised_Learning/Your_First_ML_Model.md) |
| **EDA 快速入门** | [EDA_Quick_Start.md](./Supervised_Learning/EDA_Quick_Start.md) |

## 前置知识 (Prerequisites)

- **必修**: [线性代数](../数学基础/Linear_Algebra/Linear_Algebra.md)、[概率统计](../数学基础/Probability_Statistics/Probability_Statistics.md)
- **推荐**: Python 数据分析库（Pandas、Scikit-learn）
- **可选**: [数据结构与算法](../数学基础/Data_Structures_Algorithms/Data_Structures_Algorithms.md)（理解树模型）

## 关键术语速查 (Key Terms)

- **过拟合 (Overfitting)**: 模型在训练集上表现好但泛化差，需通过正则化缓解
- **正则化 (Regularization)**: L1/L2 惩罚项，防止模型参数过大导致过拟合
- **交叉验证 (Cross-Validation)**: 数据分割技术，评估模型真实泛化能力
- **集成学习 (Ensemble Learning)**: 组合多个弱模型提升性能（Bagging/Boosting）
- **梯度提升 (Gradient Boosting)**: 顺序训练模型修正前序误差，如 XGBoost/LightGBM
- **特征工程 (Feature Engineering)**: 从原始数据构造有效特征，往往决定模型上限
- **主成分分析 (PCA)**: 线性降维方法，提取数据主要方差方向
- **t-SNE**: 非线性降维技术，常用于高维数据可视化
- **K-Means**: 经典聚类算法，通过距离划分数据簇
- **DBSCAN**: 基于密度的聚类，可发现任意形状簇并处理噪声

---
*Last updated: 2026-02-10*

## Related
- [[机器学习/README_for_dummy|经典机器学习 - 新手导航]]

- [[机器学习/Ensemble_Learning/Ensemble_Learning]] — 集成学习 (Ensemble Learning) - 完全指南 (共享: machine-learning, ml, supervised, unsupervised)
- [[机器学习/Feature_Engineering/Feature_Engineering]] — 特征工程 (Feature Engineering) (共享: machine-learning, ml, supervised, unsupervised)
- [[机器学习/Feature_Engineering/Feature_Engineering_for_dummy]] — 特征工程 - 小白版 (共享: machine-learning, ml, supervised, unsupervised)
- [[机器学习/ML-in-nutshell]] — 机器学习速成指南 (共享: machine-learning, ml, supervised, unsupervised)
- [[机器学习/Anomaly_Detection/Anomaly_Detection_for_dummy]] — Anomaly_Detection_for_dummy
- [[机器学习/Anomaly_Detection/Anomaly_Detection]] — Anomaly_Detection
- [[机器学习/Recommendation_Systems/Recommendation_Systems]] — Recommendation_Systems
- [[机器学习/Recommendation_Systems/Recommendation_Systems_for_dummy]] — Recommendation_Systems_for_dummy
- [[机器学习/AutoML/AutoML]] — AutoML
- [[机器学习/AutoML/AutoML_for_dummy]] — AutoML_for_dummy
- [[机器学习/Unsupervised_Learning/Unsupervised_Learning]] — Unsupervised_Learning
- [[机器学习/Unsupervised_Learning/Unsupervised_Learning_for_dummy]] — 无监督学习 - 小白版
- [[机器学习/Time_Series/Time_Series_for_dummy]] — Time_Series_for_dummy
- [[机器学习/Time_Series/Time_Series_Analysis]] — 时间序列分析 (Time Series Analysis) - 完全指南
- [[机器学习/Supervised_Learning/Supervised_Learning_for_dummy]] — Supervised_Learning_for_dummy
- [[机器学习/Supervised_Learning/Supervised_Learning]] — Supervised_Learning
- [[机器学习/Ensemble_Learning/Ensemble_Learning_for_dummy]] — Ensemble_Learning_for_dummy
- [[机器学习/README_for_dummy.md|README_for_dummy]]
- [[概念/feature-engineering.md|feature-engineering]]

## 相关页面
- [[机器学习/Bayesian_Methods/Bayesian_Methods_Deep_Dive|贝叶斯方法深度解读: 从贝叶斯定理到概率编程]]
- [[机器学习/Bayesian_Methods/README|贝叶斯方法 (Bayesian Methods)]]
- [[机器学习/Causal_Inference/Causal_Inference_Deep_Dive|因果推断深度解读: 从相关到因果的 AI 新范式]]
- [[机器学习/Causal_Inference/README|因果推断 (Causal Inference)]]

- [[概念/recommendation-systems|Recommendation Systems]]

- [[概念/time-series-analysis|Time Series Analysis]]

- [[概念/automl|Automl]]

- [[概念/ensemble-learning|Ensemble Learning]]

- [[概念/anomaly-detection|Anomaly Detection]]

## 相关资源

- [[机器学习/ML_Frameworks/scikit-learn_overview|Scikit-learn]]
- [[机器学习/ML_Frameworks/xgboost_overview|XGBoost]]
- [[机器学习/ML_Frameworks/lightgbm_overview|LightGBM]]
- [[机器学习/ML_Frameworks/catboost_overview|CatBoost]]
- [[机器学习/kaggle_overview|Kaggle 数据科学竞赛平台概览]]

## 进阶知识拓展

| 主题 | 深度内容 | 应用场景 | 参考资源 |
|------|----------|----------|----------|
| 核心原理 | 底层机制和数学推导 | 深度理解+优化 | 经典教材+论文 |
| 工程实践 | 生产级实现细节 | 项目落地 | 开源项目+案例 |
| 性能优化 | 瓶颈分析+调优策略 | 提升效率 | 性能分析工具 |
| 安全合规 | 安全威胁+防护措施 | 风险管控 | 安全框架+标准 |
| 前沿研究 | 最新进展+未来方向 | 技术预判 | 顶会论文+博客 |

## 实践指南

| 步骤 | 行动 | 工具/方法 | 预期产出 |
|------|------|-----------|----------|
| 1. 学习 | 系统学习核心知识 | 教材/课程/文档 | 知识体系建立 |
| 2. 练习 | 动手实践加深理解 | 实验/项目/练习 | 技能熟练 |
| 3. 应用 | 在实际项目中应用 | 工作项目/开源 | 经验积累 |
| 4. 优化 | 持续改进和优化 | 性能分析/重构 | 质量提升 |
| 5. 分享 | 输出和分享知识 | 博客/演讲/教学 | 影响力建设 |

## 常见误区

| 误区 | 正确认知 | 建议 |
|------|----------|------|
| 只学理论不实践 | 实践是检验理解的唯一标准 | 每学一个概念就动手验证 |
| 追求完美再开始 | 完成比完美更重要 | 先做MVP再迭代 |
| 忽视基础知识 | 基础决定上限 | 定期回顾基础 |
| 盲目追新 | 新技术需要验证 | 评估后再采用 |
| 单打独斗 | 协作效率更高 | 积极参与社区 |

## 知识图谱关联

| 关联主题 | 关系类型 | 参考路径 |
|----------|----------|----------|
| 基础理论 | 前置依赖 | 相关基础目录 |
| 工具实践 | 实现支撑 | 工具/编程相关 |
| 应用场景 | 价值体现 | 行业应用/ |
| 前沿研究 | 发展方向 | 论文精读/ |
| 工程方法 | 质量保障 | 测试/运维/ |

## 版本更新记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2025-01 | 初始创建 |
| v1.1 | 2025-06 | 内容补充 |
| v2.0 | 2026-01 | 全面扩写 |
| v2.1 | 2026-07 | 质量强化+结构化增强 |

## 快速自检

- [ ] 核心概念能向他人清晰解释
- [ ] 已完成至少一个实践项目
- [ ] 了解主流方案优劣势和适用场景
- [ ] 掌握常见问题排查方法
- [ ] 关注最新技术动态
- [ ] 知识已文档化沉淀

## 深度对比分析

| 对比维度 | 传统方法 | 现代方法 | AI原生方法 | 趋势判断 |
|----------|----------|----------|------------|----------|
| 效率 | 人工为主 | 半自动化 | 全自动化 | AI原生是方向 |
| 质量 | 依赖经验 | 标准化流程 | 数据驱动 | 数据驱动更可靠 |
| 成本 | 高人力成本 | 工具降低成本 | 边际成本趋零 | 长期成本最优 |
| 扩展性 | 线性增长 | 亚线性 | 指数级 | 指数级扩展 |
| 创新速度 | 慢(月级) | 中(周级) | 快(天级) | 持续加速 |

## 实施路线图

| 阶段 | 时间 | 目标 | 关键里程碑 |
|------|------|------|------------|
| 评估期 | 第1周 | 现状评估+目标定义 | 评估报告+目标文档 |
| 试点期 | 第2-4周 | 小范围验证 | 试点成功+经验总结 |
| 推广期 | 第5-8周 | 全面推广 | 全覆盖+培训完成 |
| 优化期 | 第9-12周 | 持续优化 | 指标达标+流程固化 |
| 成熟期 | 持续 | 卓越运营 | 行业领先+创新引领 |

## 风险与应对

| 风险 | 概率 | 影响 | 应对策略 |
|------|------|------|----------|
| 技术选型失误 | 中 | 高 | 充分调研+POC验证 |
| 团队能力不足 | 中 | 高 | 培训+引入专家 |
| 进度延期 | 高 | 中 | 缓冲时间+敏捷迭代 |
| 需求变更 | 高 | 中 | 变更管理+灵活架构 |
| 安全漏洞 | 低 | 极高 | 安全审计+持续监控 |

## 度量与评估

| 指标类别 | 具体指标 | 目标值 | 度量方法 |
|----------|----------|--------|----------|
| 效率指标 | 完成时间/吞吐量 | 提升50% | 前后对比 |
| 质量指标 | 错误率/返工率 | 降低70% | 缺陷追踪 |
| 成本指标 | 单位成本/ROI | ROI>3x | 财务分析 |
| 满意度 | 用户/团队满意度 | >4.5/5 | 问卷调查 |
| 创新指标 | 新方案/专利数 | 每季度1+ | 成果统计 |

## 资源与工具

| 类别 | 推荐资源 | 用途 | 获取方式 |
|------|----------|------|----------|
| 学习 | 经典教材+在线课程 | 知识建立 | 图书馆/平台 |
| 实践 | 开源项目+实验环境 | 技能锻炼 | GitHub/云服务 |
| 参考 | 技术文档+最佳实践 | 实施指导 | 官方文档 |
| 社区 | 技术论坛+会议 | 交流成长 | 线上/线下 |
| 工具 | 专业工具链 | 效率提升 | 官网/包管理 |

## 总结与行动项

- [ ] 已完成现状评估和目标设定
- [ ] 已制定详细实施计划
- [ ] 已完成试点验证
- [ ] 已全面推广并培训
- [ ] 已建立度量和反馈机制
- [ ] 持续优化和改进中
