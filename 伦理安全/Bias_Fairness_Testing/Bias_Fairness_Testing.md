---
title: 偏见与公平性测试 (Bias & Fairness Testing)
category: 05-ethics
tags: ["bias", "fairness", "testing", "mitigation", "equity"]
summary: "AI 偏见与公平性测试完整指南：偏见类型、公平性指标、检测工具（AIF360/Fairlearn）、缓解策略、LLM 偏见评估、2026 合规要求。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 偏见与公平性测试 (Bias & Fairness Testing)

## 1. AI 偏见全景

```
偏见来源:
1. 数据偏见: 训练数据不均衡/历史歧视
2. 算法偏见: 优化目标忽视公平性
3. 标注偏见: 标注者的主观偏见
4. 部署偏见: 使用场景与训练分布不匹配
5. 反馈循环: AI 决策强化既有偏见

偏见类型:
- 性别: 招聘 AI 偏好男性简历
- 种族: 人脸识别对深肤色准确率低
- 年龄: 信贷模型歧视老年人
- 地域: 内容推荐地域偏见
- 语言: 多语言模型对低资源语言表现差
```

## 2. 公平性指标

```python
FAIRNESS_METRICS = {
    "群体公平": {
        "Demographic Parity": "P(Ŷ=1|A=0) = P(Ŷ=1|A=1) 各组正例率相同",
        "Equalized Odds": "TPR 和 FPR 在各组相同",
        "Equal Opportunity": "TPR 在各组相同 (只关注正例)",
        "Predictive Parity": "PPV 在各组相同",
    },
    "个体公平": {
        "定义": "相似个体应得到相似预测",
        "度量": "一致性 (Consistency)",
    },
    "LLM 公平": {
        "刻板印象": "模型是否输出刻板印象内容",
        "代表性": "不同群体的代表性是否均衡",
        "拒绝率": "对不同群体的拒绝率是否一致",
    },
}

# 注意: 不可能同时满足所有公平性指标!
# (Impossibility Theorem: 除非完美分类或组间基准率相同)
```

## 3. 检测工具

```python
# 使用 Fairlearn 检测偏见:
from fairlearn.metrics import (
    demographic_parity_difference,
    equalized_odds_difference,
    MetricFrame,
)

def evaluate_fairness(y_true, y_pred, sensitive_features):
    """评估模型公平性"""
    # 分群指标
    metric_frame = MetricFrame(
        metrics=accuracy_score,
        y_true=y_true,
        y_pred=y_pred,
        sensitive_features=sensitive_features,  # 如: 性别/种族
    )
    
    print("各组准确率:")
    print(metric_frame.by_group)
    
    # 公平性差异
    dp_diff = demographic_parity_difference(
        y_true, y_pred, sensitive_features=sensitive_features
    )
    print(f"Demographic Parity 差异: {dp_diff:.4f}")
    # |dp_diff| < 0.1 通常认为可接受
    
    return metric_frame

# 使用 AIF360 (IBM):
from aif360.datasets import BinaryLabelDataset
from aif360.metrics import BinaryLabelDatasetMetric

dataset = BinaryLabelDataset(df=data, label_names=['income'],
                             protected_attribute_names=['gender', 'race'])
metric = BinaryLabelDatasetMetric(dataset, privileged_groups=[{'gender': 1}])
print(f"统计偏见差异: {metric.statistical_parity_difference():.4f}")
```

## 4. 缓解策略

```python
BIAS_MITIGATION = {
    "数据层": [
        "重采样: 过采样少数群体/欠采样多数群体",
        "数据增强: 合成少数群体样本",
        "去偏: 移除敏感属性的关联",
    ],
    "算法层": [
        "公平约束: 将公平性加入优化目标",
        "对抗去偏: 让模型无法预测敏感属性",
        "后处理: 调整不同组的阈值",
    ],
    "LLM 层": [
        "RLHF: 在偏好数据中包含公平性",
        "Constitutional AI: 公平性原则",
        "Prompt: 明确要求公平/无偏见回答",
        "红队: 测试偏见触发场景",
    ],
    "流程层": [
        "多样性团队: 开发团队多元化",
        "影响评估: 上线前公平性审计",
        "持续监控: 部署后分群性能追踪",
    ],
}
```

## 5. 交叉引用

- [[伦理安全/|伦理安全]]
- [[伦理安全/Model_Card_Documentation/Model_Card_Documentation|模型卡]]
- [[伦理安全/AI_Liability/|AI 责任]]
- [[模型评估/|模型评估]]
- [[行业应用/Public_Safety/Public_Safety|公共安全 (偏见风险)]]
