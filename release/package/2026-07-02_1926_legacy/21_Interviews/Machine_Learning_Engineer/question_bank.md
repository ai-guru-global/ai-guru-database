---
title: Machine Learning Engineer 题库
category: 21-interviews-machine-learning-engineer
tags: ["interviews", "career", "machine-learning", "engineering", "model-training", "deployment"]
summary: "Machine Learning Engineer 面试题库，覆盖 ML 基础、深度学习、系统设计、工程实践和编程题，含难度与频率标注。"
created: 2026-05-31
updated: 2026-06-04
tier: supporting
---

# Machine Learning Engineer 题库

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

---

## ML 基础理论 (12 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 解释偏差-方差权衡。如何在实际项目中控制过拟合？ | ⭐ | 🔴 |
| 2 | L1 和 L2 正则化的区别？L1 为什么能产生稀疏解？ | ⭐ | 🔴 |
| 3 | 梯度下降、SGD、Adam 的区别和适用场景？ | ⭐ | 🔴 |
| 4 | 交叉验证的目的？K-Fold 和 Stratified K-Fold 何时使用？ | ⭐ | 🟡 |
| 5 | 解释 Precision、Recall、F1、AUC-ROC 的关系和选择策略 | ⭐ | 🔴 |
| 6 | 如何处理类别不平衡？SMOTE、代价敏感、阈值调整的优劣 | ⭐⭐ | 🔴 |
| 7 | 特征工程中，连续变量和类别变量分别如何处理？ | ⭐ | 🟡 |
| 8 | 解释 XGBoost 与 LightGBM 的核心区别（直方图 vs 精确分裂） | ⭐⭐ | 🟡 |
| 9 | 决策树中信息增益和基尼不纯度有什么区别？ | ⭐ | 🟢 |
| 10 | 解释核方法（Kernel Trick）及其在 SVM 中的应用 | ⭐⭐ | 🟢 |
| 11 | 贝叶斯分类器的决策边界在什么条件下是线性的？ | ⭐⭐ | 🟢 |
| 12 | 集成学习中 Bagging vs Boosting vs Stacking 的区别 | ⭐ | 🟡 |

---

## 深度学习 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 13 | 解释 BatchNorm 的训练和推理区别，为什么推理时不更新统计量？ | ⭐⭐ | 🔴 |
| 14 | Dropout 在训练和推理时的行为差异？为什么等效于模型集成？ | ⭐⭐ | 🔴 |
| 15 | ResNet 残差连接如何解决梯度消失？数学直觉是什么？ | ⭐⭐ | 🔴 |
| 16 | 解释 Attention 机制的 Q/K/V 计算过程，为什么除以 √d_k？ | ⭐⭐ | 🔴 |
| 17 | Transformer 的位置编码为什么用正弦函数？RoPE 的改进点？ | ⭐⭐⭐ | 🟡 |
| 18 | 解释 MoE（Mixture of Experts）的负载均衡问题和解决方案 | ⭐⭐⭐ | 🟡 |
| 19 | GAN 训练不稳定的原因？模式崩溃如何处理？ | ⭐⭐ | 🟡 |
| 20 | 对比学习（SimCLR）的核心组件和 NT-Xent Loss 的直觉 | ⭐⭐⭐ | 🟢 |
| 21 | 解释 LoRA 的原理，为什么秩 r 的选择很重要？ | ⭐⭐ | 🔴 |
| 22 | 扩散模型的前向加噪和反向去噪过程？DDPM 的损失函数？ | ⭐⭐⭐ | 🟡 |

---

## 系统设计 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 23 | 设计一个推荐系统的完整 ML Pipeline（从数据到上线） | ⭐⭐⭐ | 🔴 |
| 24 | 设计一个实时欺诈检测系统（延迟 <50ms，日处理 1 亿请求） | ⭐⭐⭐ | 🔴 |
| 25 | 设计一个搜索排序系统（query → 候选 → 精排 → 重排） | ⭐⭐⭐ | 🟡 |
| 26 | 如何在资源受限环境（边缘设备）部署一个 NLP 模型？ | ⭐⭐ | 🟡 |
| 27 | 设计一个 A/B 测试平台，支持多指标同时评估 | ⭐⭐⭐ | 🟡 |
| 28 | 设计一个模型特征存储（Feature Store），支持在线/离线一致性 | ⭐⭐⭐ | 🟢 |
| 29 | 如何设计一个 LLM 应用的后端架构（RAG + 缓存 + 限流）？ | ⭐⭐⭐ | 🔴 |
| 30 | 设计一个模型监控和自动回滚系统 | ⭐⭐⭐ | 🟡 |

---

## 工程实践 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 31 | 训练和推理的数据不一致（Training-Serving Skew）如何处理？ | ⭐⭐ | 🔴 |
| 32 | 模型上线后效果逐渐下降（模型漂移），如何检测和应对？ | ⭐⭐ | 🔴 |
| 33 | 如何设计特征工程的可复现流水线？ | ⭐⭐ | 🟡 |
| 34 | 大规模数据集训练时如何处理内存不足？（分片/增量/流式） | ⭐⭐ | 🟡 |
| 35 | 分布式训练中的数据并行 vs 模型并行 vs 流水线并行？ | ⭐⭐⭐ | 🟡 |
| 36 | 模型量化（INT8/INT4）对精度的影响？何时选择量化？ | ⭐⭐ | 🔴 |
| 37 | 如何处理线上模型的冷启动问题（无历史数据）？ | ⭐⭐ | 🟡 |
| 38 | 模型服务的 SLA 如何设计（延迟/吞吐/可用性的权衡）？ | ⭐⭐ | 🟡 |

---

## 行为面试 (7 题)

| # | 问题 | 频率 |
|---|------|------|
| 39 | 描述一个你主导的 ML 项目从 0 到 1 的过程，遇到最大的挑战是什么？ | 🔴 |
| 40 | 你和产品经理在模型指标选择上有分歧时如何处理？ | 🔴 |
| 41 | 描述一次模型上线后效果不达预期的经历，你如何快速迭代？ | 🔴 |
| 42 | 如何在有限时间和资源下选择"足够好"的方案 vs 最优方案？ | 🟡 |
| 43 | 描述一次跨团队协作经历（与数据团队/产品团队/后端团队） | 🟡 |
| 44 | 如何在团队中推动技术改进（如引入新的实验追踪工具）？ | 🟡 |
| 45 | 描述一次你犯过的最大的技术错误，以及从中学到了什么 | 🟡 |

---

## 编程题方向 (5 题)

| # | 方向 | 频率 | 示例 |
|---|------|------|------|
| 46 | 手撕算法 | 🔴 | 实现 KMeans / Softmax / Beam Search |
| 47 | 数据处理 | 🔴 | Pandas 特征工程 / SQL 窗口函数 |
| 48 | 模型实现 | 🟡 | 手写 Transformer Encoder / Logistic Regression |
| 49 | 系统设计编码 | 🟡 | 实现一个简单的 A/B 测试分析器 |
| 50 | 在线推理 | 🟢 | 实现一个带批处理的模型服务 API |

---

*Last updated: 2026-06-04*

## Related

- [[21_Interviews/Machine_Learning_Engineer/interview_answers|Machine Learning Engineer 面试题实例答案]]
- [[21_Interviews/Machine_Learning_Engineer/company_level_question_bank|Machine Learning Engineer 按公司/级别区分的题库]]
- [[21_Interviews/Machine_Learning_Engineer/interview_preparing|Machine Learning Engineer 面试准备]]
- [[21_Interviews/README|AI 面试准备 (Interviews)]]
- [[21_Interviews/jobs|AI 相关岗位与工种清单]]
---
title: Machine Learning Engineer 题库
category: 21-interviews-machine-learning-engineer
tags: ["interviews", "career", "experience", "practitioners"]
summary: "解释过拟合与欠拟合的差异，并给出常见处理方法。"
created: 2026-05-31
updated: 2026-06-04
tier: supporting
aliases:
  - "Question Bank"
  - "question bank"
  - question_bank

---
# Machine Learning Engineer 题库

## 基础
- 解释过拟合与欠拟合的差异，并给出常见处理方法。
- AUC、PR、F1 各自适用于什么场景？
- 特征缩放对不同模型的影响有哪些？

## 项目
- 描述一个从数据到上线的端到端建模项目。
- 你如何进行特征工程与特征选择？
- 离线评估与线上指标不一致时如何处理？

## 系统设计
- 设计一个低延迟在线推理服务架构。
- 如何实现特征存储与训练/在线一致性？
- 模型版本管理与灰度发布策略是什么？

## 案例
- 线上模型效果突然下降，如何排查？
- 数据分布变化导致性能退化，你的解决方案？
- 业务冷启动场景如何建模？

---
*Last updated: 2026-06-04*

## Related

- [[21_Interviews/Machine_Learning_Engineer/company_level_question_bank|Machine Learning Engineer 按公司/级别区分的题库]]
- [[21_Interviews/Machine_Learning_Engineer/interview_answers|Machine Learning Engineer 面试题实例答案]]
- [[21_Interviews/Machine_Learning_Engineer/interview_preparing|Machine Learning Engineer 面试准备]]
- [[21_Interviews/README|AI 面试准备 (Interviews)]]
- [[21_Interviews/jobs|AI 相关岗位与工种清单]]
