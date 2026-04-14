# 模型评估 (Model Evaluation)

> **一句话理解**: 模型评估就像考试——你需要出不同类型的考题（评估指标），用合理的考试规则（评估方法），才能判断学生（模型）是否真的学好了，而不是只会背答案（过拟合）。

## 1. 概述 (Overview)

模型评估 (Model Evaluation) 是判断机器学习模型性能优劣的系统化方法。一个好的评估体系不仅要选择正确的指标，还要采用合适的评估方法论，确保模型在未见数据上的泛化能力。

### 为什么评估如此重要？

- **防止过拟合**: 训练集上 99% 准确率不代表模型好，测试集表现才是真实能力
- **指导模型选择**: 不同指标会导致不同的模型排名，选错指标可能选错模型
- **业务决策依据**: "准确率 95%"对医学诊断和垃圾邮件过滤意味着完全不同的事情
- **持续改进**: 评估结果指导特征工程、超参调优和架构设计的方向

### 评估的核心原则

1. **永远不要在训练集上评估**: 用测试集或交叉验证
2. **选择与业务目标一致的指标**: 准确率不总是最佳选择
3. **考虑类别不平衡**: 在 99:1 的不平衡数据上，"全预测为多数类"准确率就有 99%
4. **统计显著性**: 模型差异需要有统计检验支撑

---

## 2. 核心概念 (Core Concepts)

### 2.1 分类任务指标 (Classification Metrics)

#### 混淆矩阵 (Confusion Matrix)

所有分类指标的基础：

```
                  预测值
              正例 (P)    负例 (N)
实  正例  │   TP          FN      │  TP+FN = 实际正例总数
际  负例  │   FP          TN      │  FP+TN = 实际负例总数
         └──────────────────────┘
             TP+FP        FN+TN
          预测正例总数   预测负例总数

TP (True Positive)  : 预测正确的正例 — "正确的报警"
FP (False Positive) : 预测错误的正例 — "虚警"（误报）
FN (False Negative) : 预测错误的负例 — "漏报"
TN (True Negative)  : 预测正确的负例 — "正确的放行"
```

#### 核心指标公式与直觉

| 指标 | 公式 | 直觉 | 关注点 |
|------|------|------|--------|
| **准确率 (Accuracy)** | $\frac{TP+TN}{TP+TN+FP+FN}$ | 预测对了多少？ | 类别均衡时使用 |
| **精确率 (Precision)** | $\frac{TP}{TP+FP}$ | 预测为正的有多少真的是正？ | 关注"误报成本" |
| **召回率 (Recall)** | $\frac{TP}{TP+FN}$ | 实际为正的找出了多少？ | 关注"漏报成本" |
| **F1 分数 (F1-Score)** | $\frac{2 \times P \times R}{P + R}$ | Precision 和 Recall 的调和平均 | 平衡两者 |
| **特异性 (Specificity)** | $\frac{TN}{TN+FP}$ | 实际为负的判对了多少？ | 医学检测中重要 |

#### Precision vs Recall 权衡

```
Precision 和 Recall 的跷跷板关系:

高 Precision + 低 Recall: "宁可放过也不错杀"
  → 适用: 垃圾邮件过滤（把正常邮件标为垃圾很烦）
  
低 Precision + 高 Recall: "宁可错杀也不放过"
  → 适用: 癌症筛查（漏诊比误诊后果严重得多）

F1-Score: 两者的平衡点
  → 适用: 不确定哪个更重要时的默认选择
```

#### AUC-ROC 曲线

ROC 曲线绘制不同阈值下的 TPR (Recall) vs FPR (1-Specificity)：

```
ROC 曲线:
  TPR │        ╱────── 完美模型 (AUC=1.0)
  1.0 │       ╱
      │      ╱──── 好模型 (AUC=0.85)
      │     ╱
  0.5 │   ╱──── 随机猜测 (AUC=0.5)
      │  ╱
  0.0 │╱───────────────────
      0.0    0.5    1.0   FPR
      
AUC 解读:
  0.9-1.0 : 优秀
  0.8-0.9 : 良好
  0.7-0.8 : 一般
  0.5-0.7 : 较差
  0.5     : 等同于随机猜测
```

**AUC 的优势**: 不依赖特定阈值，反映模型在所有阈值下的整体排序能力。

#### PR 曲线 (Precision-Recall Curve)

在类别严重不平衡时（如欺诈检测：正例 0.1%），AUC-ROC 可能过于乐观。此时 PR 曲线（及 AP/Average Precision）更有意义。

### 2.2 回归任务指标 (Regression Metrics)

| 指标 | 公式 | 特点 | 适用场景 |
|------|------|------|---------|
| **MSE** | $\frac{1}{n}\sum(y_i - \hat{y}_i)^2$ | 对大误差惩罚重（平方） | 对离群值敏感 |
| **RMSE** | $\sqrt{MSE}$ | 与目标变量同量纲 | 最常用的回归指标 |
| **MAE** | $\frac{1}{n}\sum\|y_i - \hat{y}_i\|$ | 对大误差不过度敏感 | 有离群值时更稳健 |
| **MAPE** | $\frac{1}{n}\sum\|\frac{y_i - \hat{y}_i}{y_i}\|$ | 百分比误差，直观 | 目标值不含0 |
| **R² (决定系数)** | $1 - \frac{SS_{res}}{SS_{tot}}$ | 1=完美, 0=均值水平 | 衡量解释方差比例 |

**选择建议**: 
- 默认用 RMSE
- 有离群值用 MAE
- 需要百分比解释用 MAPE
- 需要相对好坏用 R²

### 2.3 排序/推荐任务指标

| 指标 | 说明 | 应用 |
|------|------|------|
| **NDCG@K** | 考虑排序位置的加权评估 | 搜索引擎、推荐系统 |
| **MAP@K** | 各查询 AP 的平均值 | 信息检索 |
| **MRR** | 第一个相关结果的排名倒数 | 问答系统 |
| **Hit Rate@K** | Top-K 中包含相关物品的比例 | 推荐系统 |

---

## 3. 关键技术详解 (Key Techniques)

### 3.1 生成任务评估指标

#### 文本生成指标

| 指标 | 计算方式 | 适用任务 | 局限性 |
|------|---------|---------|--------|
| **BLEU** | N-gram 精确率 | 机器翻译 | 只看精确匹配，不考虑语义 |
| **ROUGE-L** | 最长公共子序列 | 文本摘要 | 无法评估流畅性 |
| **BERTScore** | BERT 嵌入相似度 | 通用文本生成 | 计算成本高 |
| **METEOR** | 考虑同义词的匹配 | 机器翻译 | 依赖语言资源 |

#### LLM 评估基准

| 基准 | 评估维度 | 说明 |
|------|---------|------|
| **MMLU** | 知识广度 | 57 个学科的多选题，测试知识覆盖面 |
| **HumanEval** | 代码生成 | 164 个编程题，pass@k 指标 |
| **MT-Bench** | 对话质量 | 多轮对话评估，GPT-4 作为评委 |
| **GSM8K** | 数学推理 | 小学数学应用题 |
| **TruthfulQA** | 真实性 | 测试模型是否会生成误导信息 |
| **AlpacaEval** | 指令跟随 | 对比模型回答质量 |

### 3.2 LLM-as-Judge

用强大的 LLM（如 GPT-4）作为评委评估其他模型的输出质量：

```python
judge_prompt = """
请评估以下AI助手的回答质量，从1-10打分。

评估维度:
- 准确性 (0-3分): 信息是否正确
- 完整性 (0-3分): 是否覆盖了问题的所有方面
- 有用性 (0-2分): 对用户是否有实际帮助
- 清晰度 (0-2分): 表达是否清晰易懂

用户问题: {question}
AI回答: {answer}

请以JSON格式输出评分和理由。
"""
```

**优势**: 可扩展、成本低于人工评估
**局限**: 存在评委偏好（偏好长回答、偏好自己的风格）

### 3.3 评估方法论

#### K-Fold 交叉验证

```
5-Fold 交叉验证:

Fold 1: [Test] [Train] [Train] [Train] [Train] → Score₁
Fold 2: [Train] [Test] [Train] [Train] [Train] → Score₂
Fold 3: [Train] [Train] [Test] [Train] [Train] → Score₃
Fold 4: [Train] [Train] [Train] [Test] [Train] → Score₄
Fold 5: [Train] [Train] [Train] [Train] [Test] → Score₅

最终分数 = mean(Score₁...Score₅) ± std(Score₁...Score₅)
```

**选择 K 值**:
- K=5 或 K=10: 最常用，偏差-方差平衡好
- K=n (Leave-One-Out): 数据极少时使用
- 分层 K-Fold (StratifiedKFold): 保持每折中类别比例一致

#### 时间序列评估：前向验证

时间序列数据不能随机划分（会导致未来信息泄露）：

```
时间序列前向验证 (Time Series Split):

       Train        │Test│
  ──────────────────│────│
  ─────────────────────────│────│
  ────────────────────────────────│────│
  
  每次用过去的数据训练，预测未来的数据
```

---

## 4. 代码实战 (Hands-on Code)

### 4.1 完整分类评估报告

```python
import numpy as np
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score,
    precision_recall_curve, average_precision_score, roc_curve
)
from sklearn.model_selection import StratifiedKFold, cross_val_score

def comprehensive_classification_eval(model, X_test, y_test, class_names=None):
    """生成完整的分类模型评估报告"""
    
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]  # 二分类正例概率
    
    # 1. 分类报告
    print("=" * 60)
    print("分类报告 (Classification Report)")
    print("=" * 60)
    print(classification_report(y_test, y_pred, target_names=class_names))
    
    # 2. 混淆矩阵
    cm = confusion_matrix(y_test, y_pred)
    print(f"\n混淆矩阵:\n{cm}")
    
    # 3. AUC-ROC
    auc = roc_auc_score(y_test, y_proba)
    print(f"\nAUC-ROC: {auc:.4f}")
    
    # 4. Average Precision (PR-AUC)
    ap = average_precision_score(y_test, y_proba)
    print(f"Average Precision (PR-AUC): {ap:.4f}")
    
    # 5. 最优阈值（F1 最大化）
    precision, recall, thresholds = precision_recall_curve(y_test, y_proba)
    f1_scores = 2 * precision * recall / (precision + recall + 1e-8)
    best_threshold = thresholds[np.argmax(f1_scores)]
    print(f"最优阈值 (F1 最大化): {best_threshold:.4f}")
    
    return {"auc": auc, "ap": ap, "best_threshold": best_threshold}

# 交叉验证评估
cv_scores = cross_val_score(
    model, X, y, cv=StratifiedKFold(n_splits=5, shuffle=True, random_state=42),
    scoring='roc_auc'
)
print(f"\n5-Fold CV AUC: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
```

### 4.2 回归模型评估

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np

def regression_eval(y_true, y_pred, dataset_name="Test"):
    """回归模型评估报告"""
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    
    # MAPE (Mean Absolute Percentage Error)
    mask = y_true != 0
    mape = np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100
    
    print(f"\n{dataset_name} 回归指标:")
    print(f"  RMSE:  {rmse:.4f}")
    print(f"  MAE:   {mae:.4f}")
    print(f"  MAPE:  {mape:.2f}%")
    print(f"  R²:    {r2:.4f}")
    
    return {"rmse": rmse, "mae": mae, "mape": mape, "r2": r2}
```

---

## 5. 应用场景与案例 (Applications & Cases)

### 指标选择指南

| 业务场景 | 首选指标 | 理由 |
|---------|---------|------|
| **疾病诊断** | Recall + Specificity | 漏诊代价极高 |
| **垃圾邮件过滤** | Precision | 误判正常邮件为垃圾很烦人 |
| **欺诈检测** | PR-AUC, Recall@FPR | 类别极度不均衡 |
| **搜索排序** | NDCG@10, MAP | 排序位置很重要 |
| **房价预测** | RMSE, MAPE | 需要知道预测偏差程度 |
| **推荐系统** | Hit Rate@K, NDCG@K | 用户只看前几条 |
| **LLM 问答** | BERTScore + 人工评估 | 自动指标不足以评估质量 |
| **代码生成** | pass@k | 生成代码能否通过测试 |

---

## 6. 进阶话题 (Advanced Topics)

### 6.1 统计显著性检验

两个模型的性能差异可能只是随机波动，需要统计检验：

- **配对 t 检验**: 比较两个模型在多折 CV 上的分数差异
- **McNemar 检验**: 比较两个分类器在相同测试集上的错误模式差异
- **Bootstrap 检验**: 重采样测试集，计算指标的置信区间

### 6.2 校准 (Calibration)

模型输出的概率应该接近真实概率（预测 80% 概率的事件确实约有 80% 发生）。

- **校准曲线**: 绘制预测概率 vs 实际频率
- **校准方法**: Platt Scaling（逻辑回归校准）、Isotonic Regression
- **指标**: 期望校准误差 (Expected Calibration Error, ECE)

### 6.3 公平性评估

- **Demographic Parity**: 不同群体获得正面预测的比例是否相当
- **Equalized Odds**: 不同群体的 TPR 和 FPR 是否相当
- **工具**: AIF360 (IBM), Fairlearn (Microsoft)

→ 详见 [价值对齐](../../08_Ethics_Safety/Value_Alignment/Value_Alignment.md)

### 6.4 常见陷阱

1. **指标操纵**: 通过调整阈值人为提高某个指标，忽略其他指标的下降
2. **数据泄露**: 验证集包含了训练集的信息（如时间序列随机划分）
3. **评估集过小**: 小样本上指标波动大，结论不可靠
4. **忽略基线**: 不与简单基线（如随机猜测、均值预测）对比

---

## 7. 与其他主题的关联 (Connections)

### 前置知识
- [概率论与数理统计](../../01_Fundamentals/Probability_Statistics/Probability_Statistics.md) — 理解统计检验和置信区间
- [监督学习](../../02_Machine_Learning/Supervised_Learning/Supervised_Learning.md) — 偏差-方差权衡

### 进阶方向
- [MLOps Pipeline](../MLOps_Pipeline/MLOps_Pipeline.md) — 评估自动化和持续监控
- [价值对齐](../../08_Ethics_Safety/Value_Alignment/Value_Alignment.md) — 公平性评估
- [特征工程](../../02_Machine_Learning/Feature_Engineering/Feature_Engineering.md) — 评估指导特征改进

---

## 8. 面试高频问题 (Interview FAQs)

**Q1: 什么时候不应该用准确率 (Accuracy)？**
> 当类别严重不平衡时。例如信用卡欺诈检测中，欺诈交易只占 0.1%，一个永远预测"正常"的模型准确率就有 99.9%，但毫无用处。此时应使用 PR-AUC、F1-Score 或 Recall@指定FPR。

**Q2: AUC-ROC 和 PR-AUC 的区别？什么时候用哪个？**
> AUC-ROC 衡量模型区分正负例的整体能力，在类别均衡时表现好。但在类别极度不均衡时（如 1:1000），即使 FPR 很小（如 0.01），绝对误报数量也很多，AUC-ROC 会高估性能。此时 PR-AUC（不使用 TN）更能反映模型对少数类的识别能力。

**Q3: 如何评估 LLM 的生成质量？**
> 多层次评估：(1) 自动指标——BLEU、ROUGE、BERTScore 做初步筛选；(2) 基准测试——MMLU（知识）、HumanEval（代码）、GSM8K（推理）；(3) LLM-as-Judge——用 GPT-4 打分；(4) 人工评估——最终的金标准。实践中通常组合使用。

**Q4: K-Fold 交叉验证的 K 应该取多少？**
> 最常用 K=5 或 K=10，它们在偏差和方差之间取得了良好平衡。K 越大，训练集越大（偏差低），但各折之间越相似（方差高）、计算成本越大。数据量极少时可用 Leave-One-Out（K=n）。时间序列数据必须用时间序列划分，不能随机分折。

**Q5: 什么是模型校准？为什么重要？**
> 模型校准指模型输出的概率应该接近真实概率。例如，模型预测"下雨概率 80%"的那些天中，确实约 80% 下了雨。这在医学诊断、风控评分等需要基于概率做决策的场景至关重要。神经网络通常过度自信（输出概率偏高），需要用 Platt Scaling 或温度缩放 (Temperature Scaling) 校准。

---

## 9. 参考资源 (References)

### 经典论文与书籍
- [The Elements of Statistical Learning - Chapter 7: Model Assessment](https://web.stanford.edu/~hastie/ElemStatLearn/) — 评估理论的权威参考
- [On Calibration of Modern Neural Networks (Guo et al., 2017)](https://arxiv.org/abs/1706.04599) — 神经网络校准问题

### 工具
- [scikit-learn Metrics Module](https://scikit-learn.org/stable/modules/model_evaluation.html) — sklearn 评估指标文档
- [Evidently AI](https://www.evidentlyai.com/) — 模型监控与评估
- [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) — LLM 评估框架
- [OpenCompass](https://opencompass.org.cn/) — 中文 LLM 评估平台

### 教程
- [Google ML Crash Course - Classification Metrics](https://developers.google.com/machine-learning/crash-course/classification) — Google 机器学习评估教程
- [Papers with Code - Benchmarks](https://paperswithcode.com/benchmarks) — 各任务 SOTA 排行榜

---
*Last updated: 2026-02-10*
