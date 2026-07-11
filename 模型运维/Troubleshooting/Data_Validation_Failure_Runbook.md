---
title: "数据验证失败 Runbook"
category: 11-mlops-pipeline
subcategory: troubleshooting
tags: ["mlops", "data-validation", "great-expectations", "pandera", "kubernetes", "k8s", "alibaba-cloud"]
summary: "面向 K8s 上 ML/LLM 训练流水线的数据验证失败排障：定位 schema、统计分布、语义层问题，并给出隔离、重跑与复盘流程。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# 数据验证失败 Runbook

> **一句话理解**: 数据验证失败是训练流水线的「门禁报警」——不是简单重跑就能解决，要定位是哪层期望被违反、上游数据出了什么问题。

## 目录

- [1. 数据验证四层模型](#1-数据验证四层模型)
- [2. 定位失败层级](#2-定位失败层级)
- [3. Schema 层失败](#3-schema-层失败)
- [4. 统计分布层失败](#4-统计分布层失败)
- [5. 语义层失败](#5-语义层失败)
- [6. 处理流程](#6-处理流程)
- [7. 阿里云专有云关联](#7-阿里云专有云关联)
- [Related](#related)

---

## 1. 数据验证四层模型

| 层级 | 验证内容 | 工具示例 |
|------|---------|---------|
| L0 Schema | 字段存在、类型正确、非空 | Pandera、Great Expectations |
| L1 Statistics | 均值/方差/分位数、类别分布 | Great Expectations、Evidently |
| L2 Distribution | 训练/服务数据分布漂移 | Evidently、WhyLabs |
| L3 Semantic | 文本质量、毒性、PII、重复 | 自定义规则、Argilla、LangCheck |

---

## 2. 定位失败层级

```bash
# 查看流水线日志
kubectl logs <pipeline-pod> -n <ns>

# 常见输出
# GREAT EXPECTATIONS: expectation suite failed
# - expectation: expect_column_values_to_not_be_null
# - column: label
# - unexpected_percent: 12.5%
```

**关键信息**：
- 哪个 expectation 失败
- 涉及哪些列/字段
- 异常比例
- 失败时间（是否对应上游 ETL 调度）

---

## 3. Schema 层失败

### 3.1 常见原因

- 上游表结构变更（字段重命名、删除）
- ETL 输出空文件
- JSON/CSV 解析异常
- 时间格式不一致

### 3.2 处理

1. 联系上游数据负责人确认 schema 变更
2. 更新训练代码或验证规则
3. 对历史失败样本做 quarantine

---

## 4. 统计分布层失败

### 4.1 常见原因

- 数据源切换导致分布变化
- 节假日/活动导致数据偏移
- 采样策略变化

### 4.2 处理

1. 对比训练集与服务集分布
2. 判断是否为真实漂移（需重训）还是噪声
3. 调整验证阈值（避免过于敏感）
4. 重新训练 baseline 模型

---

## 5. 语义层失败

### 5.1 LLM 训练数据常见问题

| 问题 | 检查方法 | 处理 |
|------|---------|------|
| 重复样本 | MinHash/SSHash 去重 | 去重或降采样 |
| PII 泄露 | 正则 / NER 检测 | 脱敏或删除 |
| 毒性内容 | 毒性分类器 | 过滤 |
| 格式错误 | JSON schema 校验 | 清洗或丢弃 |
| 语言混杂 | 语言检测 | 按语言拆分 |

---

## 6. 处理流程

```text
Step 1: 从 CI/CD 日志提取失败 expectation
Step 2: 判断失败层级（L0-L3）
Step 3: 定位上游数据源 / ETL 任务
Step 4: 隔离异常数据样本
Step 5: 决定：修复数据后重跑 / 跳过本次训练 / 调整规则
Step 6: 重跑验证并通知模型负责人
Step 7: 记录 incident 与数据质量报告
```

---

## 7. 阿里云专有云关联

在阿里云专有云环境中：
- 数据通常存储在 **盘古 OSS / MaxCompute 私有化 / DataWorks**
- 数据验证任务可能以 ACK Job / Airflow DAG / Kubeflow Pipeline 运行
- 质量报告可对接 **DataWorks 数据质量** 或自研看板

**排查入口**：
- DataWorks / 调度平台查看上游 ETL 状态
- OSS 控制台查看数据文件大小/时间戳
- ACK 查看验证 Job 日志

---

## Related

- [[概念/data-validation|Data Validation]]
- [[概念/great-expectations|Great Expectations]]
- [[概念/pandera|Pandera]]
- [[概念/evidently|Evidently]]
- [[模型运维/CI_CD/ML_CI_CD|ML CI/CD]]
- [[模型训练/Data/Data_Curation_and_Mixture_2026|数据策展与混合]]
