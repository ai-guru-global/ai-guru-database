---
title: "评估结果可视化"
category: 94-visualization
tags: ["visualization", "evaluation", "metrics", "comparison", "charts"]
summary: "模型评估结果的可视化最佳实践——从混淆矩阵到 ROC 曲线、从性能对比到错误分析，让评估结果一目了然。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "Evaluation Visualization"
  - "Metrics Visualization"
---

# 评估结果可视化 (Evaluation Result Visualization)

> 模型评估结果的可视化最佳实践——从混淆矩阵到 ROC 曲线、从性能对比到错误分析，让评估结果一目了然。

---

## 1. 混淆矩阵

```python
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

def plot_confusion_matrix(y_true, y_pred, class_names, title="Confusion Matrix"):
    """绘制高质量混淆矩阵。"""
    cm = confusion_matrix(y_true, y_pred)
    cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    
    fig, axes = plt.subplots(1, 2, figsize=(16, 6))
    
    # 绝对数值
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=class_names, yticklabels=class_names, ax=axes[0])
    axes[0].set_title('Absolute Counts')
    axes[0].set_ylabel('True Label')
    axes[0].set_xlabel('Predicted Label')
    
    # 归一化
    sns.heatmap(cm_normalized, annot=True, fmt='.2%', cmap='Blues',
                xticklabels=class_names, yticklabels=class_names, ax=axes[1])
    axes[1].set_title('Normalized')
    axes[1].set_ylabel('True Label')
    axes[1].set_xlabel('Predicted Label')
    
    plt.suptitle(title, fontsize=14)
    plt.tight_layout()
    plt.savefig('confusion_matrix.png', dpi=150, bbox_inches='tight')
    plt.show()
```

---

## 2. ROC 曲线与 PR 曲线

```python
from sklearn.metrics import roc_curve, auc, precision_recall_curve, average_precision_score

def plot_roc_pr_curves(y_true, y_scores, model_names):
    """绘制多模型的 ROC 和 PR 曲线对比。"""
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))
    
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    
    # ROC 曲线
    for i, (scores, name) in enumerate(zip(y_scores, model_names)):
        fpr, tpr, _ = roc_curve(y_true, scores)
        roc_auc = auc(fpr, tpr)
        axes[0].plot(fpr, tpr, color=colors[i], lw=2,
                     label=f'{name} (AUC = {roc_auc:.3f})')
    
    axes[0].plot([0, 1], [0, 1], 'k--', lw=1, alpha=0.5)
    axes[0].set_xlabel('False Positive Rate')
    axes[0].set_ylabel('True Positive Rate')
    axes[0].set_title('ROC Curve')
    axes[0].legend(loc='lower right')
    axes[0].grid(True, alpha=0.3)
    
    # PR 曲线
    for i, (scores, name) in enumerate(zip(y_scores, model_names)):
        precision, recall, _ = precision_recall_curve(y_true, scores)
        ap = average_precision_score(y_true, scores)
        axes[1].plot(recall, precision, color=colors[i], lw=2,
                     label=f'{name} (AP = {ap:.3f})')
    
    axes[1].set_xlabel('Recall')
    axes[1].set_ylabel('Precision')
    axes[1].set_title('Precision-Recall Curve')
    axes[1].legend(loc='lower left')
    axes[1].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('roc_pr_curves.png', dpi=150, bbox_inches='tight')
    plt.show()
```

---

## 3. 模型对比雷达图

```python
import numpy as np
import matplotlib.pyplot as plt

def plot_model_radar(metrics_dict, model_names):
    """多模型多指标雷达图对比。"""
    categories = list(metrics_dict.keys())
    num_vars = len(categories)
    
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
    
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    
    for i, model_name in enumerate(model_names):
        values = [metrics_dict[cat][i] for cat in categories]
        values += values[:1]
        
        ax.plot(angles, values, 'o-', linewidth=2, 
                label=model_name, color=colors[i])
        ax.fill(angles, values, alpha=0.1, color=colors[i])
    
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories, size=10)
    ax.set_ylim(0, 1)
    ax.set_title('Model Comparison', size=14, pad=20)
    ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.0))
    ax.grid(True)
    
    plt.tight_layout()
    plt.savefig('model_radar.png', dpi=150, bbox_inches='tight')
    plt.show()

# 使用示例
metrics = {
    "Accuracy": [0.93, 0.91, 0.95],
    "F1 Score": [0.92, 0.90, 0.94],
    "Precision": [0.94, 0.89, 0.96],
    "Recall": [0.90, 0.91, 0.92],
    "Latency": [0.85, 0.90, 0.70],  # 归一化
}
plot_model_radar(metrics, ["Model A", "Model B", "Model C"])
```

---

## 4. 性能对比柱状图

```python
def plot_metric_comparison(models, metrics, values, errors=None):
    """多模型指标对比柱状图。"""
    x = np.arange(len(metrics))
    width = 0.8 / len(models)
    
    fig, ax = plt.subplots(figsize=(12, 6))
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    
    for i, model in enumerate(models):
        offset = (i - len(models) / 2 + 0.5) * width
        bars = ax.bar(x + offset, values[i], width, label=model,
                      color=colors[i], alpha=0.85,
                      yerr=errors[i] if errors else None,
                      capsize=3)
    
    ax.set_ylabel('Score')
    ax.set_title('Model Performance Comparison')
    ax.set_xticks(x)
    ax.set_xticklabels(metrics)
    ax.legend()
    ax.set_ylim(0, 1.1)
    ax.grid(axis='y', alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('metric_comparison.png', dpi=150, bbox_inches='tight')
    plt.show()
```

---

## 5. 学习曲线

```python
def plot_learning_curves(train_sizes, train_scores, val_scores):
    """绘制学习曲线（训练集大小 vs 性能）。"""
    train_mean = np.mean(train_scores, axis=1)
    train_std = np.std(train_scores, axis=1)
    val_mean = np.mean(val_scores, axis=1)
    val_std = np.std(val_scores, axis=1)
    
    plt.figure(figsize=(10, 6))
    
    plt.fill_between(train_sizes, train_mean - train_std,
                     train_mean + train_std, alpha=0.1, color='#FF6B6B')
    plt.fill_between(train_sizes, val_mean - val_std,
                     val_mean + val_std, alpha=0.1, color='#4ECDC4')
    
    plt.plot(train_sizes, train_mean, 'o-', color='#FF6B6B', label='Training Score')
    plt.plot(train_sizes, val_mean, 'o-', color='#4ECDC4', label='Validation Score')
    
    plt.xlabel('Training Set Size')
    plt.ylabel('Score')
    plt.title('Learning Curves')
    plt.legend(loc='lower right')
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('learning_curves.png', dpi=150, bbox_inches='tight')
    plt.show()
```

---

## 6. 错误分析可视化

```python
def plot_error_analysis(y_true, y_pred, features, feature_names):
    """错误样本的特征分布分析。"""
    errors = y_true != y_pred
    
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))
    
    for i, (ax, feat_name) in enumerate(zip(axes.flat, feature_names)):
        # 正确样本 vs 错误样本的特征分布
        ax.hist(features[~errors, i], bins=30, alpha=0.5, 
                label='Correct', color='#4ECDC4', density=True)
        ax.hist(features[errors, i], bins=30, alpha=0.5, 
                label='Error', color='#FF6B6B', density=True)
        ax.set_title(feat_name)
        ax.legend()
    
    plt.suptitle('Feature Distribution: Correct vs Error Predictions')
    plt.tight_layout()
    plt.savefig('error_analysis.png', dpi=150, bbox_inches='tight')
    plt.show()
```

---

## 7. 校准曲线

```python
from sklearn.calibration import calibration_curve

def plot_calibration_curves(y_true, prob_dict):
    """绘制多模型的校准曲线。"""
    plt.figure(figsize=(8, 8))
    
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    
    for i, (name, probs) in enumerate(prob_dict.items()):
        fraction_positive, mean_predicted = calibration_curve(
            y_true, probs, n_bins=10
        )
        plt.plot(mean_predicted, fraction_positive, 's-',
                 color=colors[i], label=name, markersize=6)
    
    plt.plot([0, 1], [0, 1], 'k--', label='Perfectly Calibrated')
    plt.xlabel('Mean Predicted Probability')
    plt.ylabel('Fraction of Positives')
    plt.title('Calibration Curves')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('calibration_curves.png', dpi=150, bbox_inches='tight')
    plt.show()
```

---

## 8. LLM 评估可视化

```python
def plot_llm_benchmark_radar(benchmark_results):
    """LLM 基准测试雷达图。"""
    benchmarks = list(benchmark_results.keys())
    models = list(benchmark_results[benchmarks[0]].keys())
    
    num_vars = len(benchmarks)
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(10, 10), subplot_kw=dict(polar=True))
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
    
    for i, model in enumerate(models):
        values = [benchmark_results[b][model] for b in benchmarks]
        values += values[:1]
        ax.plot(angles, values, 'o-', linewidth=2, label=model, color=colors[i])
        ax.fill(angles, values, alpha=0.1, color=colors[i])
    
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(benchmarks, size=9)
    ax.set_ylim(0, 100)
    ax.set_title('LLM Benchmark Comparison', size=14, pad=20)
    ax.legend(loc='upper right', bbox_to_anchor=(1.3, 1.0))
    
    plt.tight_layout()
    plt.savefig('llm_benchmark_radar.png', dpi=150, bbox_inches='tight')
    plt.show()

# 示例
benchmark_results = {
    "MMLU": {"GPT-4o": 88.7, "Claude-3.5": 88.3, "Llama-3-70B": 82.0},
    "HumanEval": {"GPT-4o": 90.2, "Claude-3.5": 92.0, "Llama-3-70B": 81.7},
    "MATH": {"GPT-4o": 76.6, "Claude-3.5": 71.1, "Llama-3-70B": 54.8},
    "HellaSwag": {"GPT-4o": 95.3, "Claude-3.5": 94.2, "Llama-3-70B": 88.0},
}
plot_llm_benchmark_radar(benchmark_results)
```

---

## 相关资源

- Evaluation Metrics: 评估指标详解
- [[Evaluation_Report_Template]]: 评估报告模板
- [[Unified_Benchmark_Comparison]]: 基准测试对比
- [[AI_System_Dashboard]]: 系统仪表盘

---

*Last updated: 2026-07-02*
