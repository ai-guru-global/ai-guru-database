---
title: "实验跟踪记录模板"
category: 93-templates
tags: ["templates", "experiment", "tracking", "ml", "reproducibility"]
summary: "标准化的 ML 实验记录模板——确保每次实验可追溯、可复现，是实验管理和知识积累的基础。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "Experiment Tracking Template"
  - "ML Experiment Log"
---

# 实验跟踪记录模板 (Experiment Tracking Template)

> 标准化的 ML 实验记录模板——确保每次实验可追溯、可复现，是实验管理和知识积累的基础。

---

## 模板

```markdown
# 实验记录: [实验名称]

## 基本信息

| 字段 | 内容 |
|------|------|
| 实验ID | EXP-YYYYMMDD-NNN |
| 日期 | YYYY-MM-DD |
| 负责人 | [姓名] |
| 项目 | [项目名称] |
| 状态 | 进行中 / 完成 / 放弃 |

## 1. 实验目标

### 假设
> [本次实验要验证的假设]

### 成功标准
- [指标1]: [目标值]
- [指标2]: [目标值]

## 2. 实验配置

### 数据

| 配置项 | 值 |
|--------|-----|
| 训练集 | [数据集名称, N条] |
| 验证集 | [数据集名称, N条] |
| 测试集 | [数据集名称, N条] |
| 数据版本 | [commit hash / DVC tag] |

### 模型

| 配置项 | 值 |
|--------|-----|
| 基础模型 | [模型名称] |
| 参数量 | [125M / 7B / ...] |
| 架构变更 | [无 / 说明] |

### 训练超参数

```yaml
learning_rate: 3e-4
batch_size: 32
epochs: 10
optimizer: AdamW
weight_decay: 0.01
warmup_steps: 500
scheduler: cosine
seed: 42
```

### 环境

| 配置项 | 值 |
|--------|-----|
| 硬件 | [8x H100] |
| 框架版本 | [PyTorch 2.4.0] |
| CUDA版本 | [12.4] |
| 代码版本 | [git commit hash] |

## 3. 实验结果

### 核心指标

| 指标 | 训练集 | 验证集 | 测试集 | 基线 | 变化 |
|------|--------|--------|--------|------|------|
| Accuracy | 95.2% | 93.1% | 92.8% | 91.5% | +1.3% |
| F1 Score | 0.948 | 0.925 | 0.920 | 0.905 | +0.015 |
| Loss | 0.12 | 0.18 | 0.19 | 0.22 | -0.03 |

### 训练曲线
[附图: loss曲线、accuracy曲线]

### 资源消耗

| 指标 | 值 |
|------|-----|
| 训练时长 | [X小时] |
| GPU显存峰值 | [XX GB] |
| GPU利用率 | [XX%] |

## 4. 分析与结论

### 观察
- [观察1]
- [观察2]

### 假设验证
> [实验结果是否支持初始假设？为什么？]

### 错误分析
- [典型错误案例]
- [错误分布]

## 5. 后续行动

- [ ] [行动1]
- [ ] [行动2]
- [ ] [行动3]

## 6. 备注

- [其他需要记录的信息]
```

---

## 实验编号规范

```
EXP-YYYYMMDD-NNN

示例:
EXP-20260702-001  第1个实验
EXP-20260702-002  同日第2个实验
EXP-20260703-001  次日第1个实验
```

---

## 工具集成

| 工具 | 用途 | 集成方式 |
|------|------|---------|
| MLflow | 实验跟踪、模型注册 | `mlflow.log_*` |
| Weights & Biases | 实验可视化、对比 | `wandb.log` |
| ClearML | 全流程管理 | `Task.init()` |
| DVC | 数据和模型版本 | `dvc exp` |

---

## 相关资源

- [[Experiment_Tracking_Deep_Dive]]: 实验跟踪深入
- [[MLflow_Deep_Dive]]: MLflow 使用指南
- [[Model_Card_Template]]: 模型卡片模板

---

*Last updated: 2026-07-02*
