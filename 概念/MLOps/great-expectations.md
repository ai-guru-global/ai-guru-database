---
title: "Great Expectations"
category: -concepts
tags: ["mlops", "data-validation", "data-quality", "alibaba-cloud"]
summary: "Great Expectations（GE）是开源的数据验证框架，通过声明式 expectation suite 对数据进行 schema、统计和分布层面的校验。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "GE"
  - "Great Expectations 数据验证"
relationships:
  - target: "概念/data-validation"
    type: implements
  - target: "概念/mlops"
    type: related_to
sources: []
---

# Great Expectations

> **一句话理解**: Great Expectations 是一个让你用「期望」来描述数据应该长什么样的框架，数据不符时就报警。

## 核心要点

- **Expectation Suite**: 一组数据验证规则的集合。
- **Checkpoint**: 定时或事件触发执行验证。
- **Data Docs**: 自动生成数据质量报告。
- **集成**: 可与 Pandas、Spark、SQL 数据库、S3/OSS 集成。
- **常用规则**: `expect_column_to_exist`、`expect_column_values_to_not_be_null`、`expect_column_mean_to_be_between`。

## 示例

```python
import great_expectations as gx

context = gx.get_context()
suite = context.add_expectation_suite("my_suite")

validator = context.get_validator(
    batch_request=batch_request,
    expectation_suite=suite
)
validator.expect_column_values_to_not_be_null("label")
validator.expect_column_mean_to_be_between("age", min_value=18, max_value=80)
validator.save_expectation_suite(discard_failed_expectations=False)
```

## 阿里云专有云关联

在阿里云专有云 MLOps 流水线中，GE 可部署在 ACK 上，对 MaxCompute/OSS 中的训练数据进行验证。工单中「数据验证失败」时，需查看 GE Data Docs 和 checkpoint 日志定位具体失败的 expectation。

## Related

- [[概念/data-validation|Data Validation]]
- [[概念/pandera|Pandera]]
- [[概念/mlops|MLOps]]
- [[模型运维/Troubleshooting/Data_Validation_Failure_Runbook|数据验证失败 Runbook]]

---

## 2026 Great Expectations 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Great Expectations** | 数据质量框架 | GA |
| **Expectations** | 声明式数据期望 | GA |
| **Data Docs** | 自动生成数据文档 | GA |
| **Checkpoint** | 验证检查点 | GA |
| **Cloud 版** | 托管数据质量服务 | GA |

## 生产最佳实践

1. **期望定义**：为关键数据定义 Expectations
2. **CI/CD 集成**：数据验证集成到 CI/CD
3. **Data Docs**：自动生成数据质量文档
4. **与 Pandera 对比**：GE 更强大，Pandera 更轻量
5. **监控告警**：数据质量失败时告警
