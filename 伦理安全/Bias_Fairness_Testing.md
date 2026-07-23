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
- [[伦理安全/Model_Card_Documentation|模型卡]]
- [[伦理安全/AI_Liability/|AI 责任]]
- [[模型评估/|模型评估]]
- [[行业应用/Public_Safety|公共安全 (偏见风险)]]

## 核心知识体系

| 知识域 | 核心内容 | 重要程度 | 学习优先级 |
|--------|----------|----------|------------|
| 基础理论 | 核心概念/原理/方法论 | 最高 | P0 |
| 技术实践 | 工具/框架/最佳实践 | 高 | P0 |
| 工程方法 | 设计模式/架构/流程 | 高 | P1 |
| 前沿趋势 | 新技术/新方向/研究 | 中 | P2 |
| 行业应用 | 实际案例/落地经验 | 中 | P1 |

## 技术对比与选型

| 维度 | 方案A | 方案B | 方案C | 选型建议 |
|------|-------|-------|-------|----------|
| 性能 | 高吞吐 | 低延迟 | 均衡 | 按场景选择 |
| 复杂度 | 简单 | 中等 | 复杂 | 按团队能力 |
| 成本 | 低 | 中 | 高 | 按预算约束 |
| 生态 | 成熟 | 发展中 | 新兴 | 按稳定性需求 |
| 扩展性 | 有限 | 良好 | 优秀 | 按增长预期 |

## 最佳实践清单

| 实践 | 说明 | 优先级 | 预期收益 |
|------|------|--------|----------|
| 标准化流程 | 统一规范和流程 | P0 | 减少错误+提升效率 |
| 自动化 | 重复工作自动化 | P0 | 节省时间+降低风险 |
| 持续监控 | 关键指标实时监控 | P1 | 及时发现问题 |
| 定期回顾 | 周期性复盘改进 | P1 | 持续优化 |
| 知识沉淀 | 文档化经验教训 | P2 | 团队能力提升 |
| 安全优先 | 安全贯穿全流程 | P0 | 降低风险 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 | 预防措施 |
|------|----------|----------|----------|
| 效率低下 | 流程不规范/工具不当 | 优化流程+引入工具 | 标准化+培训 |
| 质量不稳定 | 缺乏检查机制 | 引入质量门禁 | 自动化测试 |
| 协作困难 | 职责不清/沟通不畅 | 明确分工+定期同步 | 文档化+工具 |
| 技术债务 | 赶工忽略质量 | 定期重构+代码审查 | 质量优先文化 |
| 安全风险 | 意识不足/措施缺失 | 安全培训+工具扫描 | 安全左移 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 理解基本框架 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立完成基础任务 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能处理复杂问题 |
| 实战 | 生产级应用+优化 | 4-6周 | 独立负责项目 |
| 精通 | 架构设计+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业公认的最佳做法 |
| Anti-pattern | 反模式(应避免的做法) |
| Technical Debt | 技术债务(为速度牺牲质量) |
| CI/CD | 持续集成/持续部署 |
| SLA | 服务等级协议 |
| KPI | 关键绩效指标 |
| ROI | 投资回报率 |
| TCO | 总拥有成本 |

## 检查清单

- [ ] 核心概念和原理已理解
- [ ] 主流工具和框架已掌握
- [ ] 最佳实践已应用到工作中
- [ ] 常见问题能独立解决
- [ ] 持续关注前沿趋势
- [ ] 知识已文档化沉淀
