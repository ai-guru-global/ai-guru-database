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
name_zh: "数据验证框架"
---

# Great Expectations

> 中文简称：数据验证框架

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
- [[11_模型运维/12_Troubleshooting/Data_Validation_Failure_Runbook|数据验证失败 Runbook]]

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

## 2026 Great Expectations 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **GX Cloud** | 托管 SaaS 平台 | GA |
| **GX 1.0+** | 新架构，性能提升 | GA |
| **Spark 支持** | 分布式数据验证 | GA |
| **Airflow 集成** | DAG 中数据质量检查 | GA |
| **dbt 集成** | dbt 模型验证 | GA |

## 架构：数据质量流程

```
数据源 → Expectation Suite 验证 → 通过 → 下游处理
                ↓ 失败
        Validation Result → Data Docs → 告警
```

## 代码示例：定义期望

```python
import great_expectations as gx

# 创建上下文
context = gx.get_context()

# 添加数据源
datasource = context.sources.add_postgres("my_pg", connection_string="...")
asset = datasource.add_table_asset("users", table_name="users")
batch_request = asset.build_batch_request()

# 定义期望
suite = context.add_expectation_suite("user_quality")
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToNotBeNull("email")
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToBeBetween("age", min_value=0, max_value=150)
)
suite.add_expectation(
    gx.expectations.ExpectColumnValuesToMatchRegex("email", r"^[\w.-]+@[\w.-]+\.\w+$")
)

# 验证
validator = context.get_validator(batch_request=batch_request, expectation_suite_name="user_quality")
results = validator.validate()
print(results)
```

## 常用 Expectations

| Expectation | 说明 |
|------|------|
| `ExpectColumnToExist` | 列存在 |
| `ExpectColumnValuesToNotBeNull` | 非空 |
| `ExpectColumnValuesToBeUnique` | 唯一 |
| `ExpectColumnValuesToBeBetween` | 范围检查 |
| `ExpectColumnValuesToMatchRegex` | 正则匹配 |
| `ExpectTableRowCountToBeBetween` | 行数范围 |

## 延伸阅读

- [[概念/MLOps/pandera|Pandera]] — 轻量级数据验证
- [[概念/MLOps/data-pipeline|Data Pipeline]] — 数据管道
- [[概念/MLOps/evidently|Evidently]] — 数据漂移监控

> ℹ️ Great Expectations 是企业级数据质量框架，提供完整的验证、文档和告警能力。

## 生产最佳实践

1. **Expectation Suite 版本控制**：纳入 Git 管理
2. **Data Docs 自动生成**：每次验证后生成文档
3. **Airflow 集成**：DAG 中嵌入数据质量检查
4. **告警配置**：验证失败时发送 Slack/邮件
5. **基线管理**：建立数据质量基线
6. **增量验证**：大数据集用增量验证
7. **自定义 Expectation**：业务规则用自定义 Expectation
8. **多环境支持**：开发/09_测试/生产环境分离
9. **性能优化**：合理设置验证频率
10. **团队协作**：Expectation Suite 团队共享

## 检查清单

- [ ] Expectation Suite 定义完整
- [ ] 关键列有非空/唯一检查
- [ ] 数值列有范围检查
- [ ] 验证集成到数据管道
- [ ] Data Docs 自动生成
- [ ] 验证失败有告警机制
- [ ] 多环境配置分离

## 工具对比

| 工具 | 适用场景 | 特点 |
|------|------|------|
| **Great Expectations** | 企业级数据质量 | 功能强大 |
| **Pandera** | Python 数据验证 | 轻量 |
| **dbt Tests** | dbt 项目 | 集成好 |
| **Soda** | 数据质量 | 简单 |

## 常见问题

| 问题 | 解决方案 |
|------|------|
| 配置复杂 | 用 GX Cloud |
| 性能问题 | 用 Spark 后端 |
| 学习曲线 | 从简单 Expectation 开始 |
| 文档生成 | 自动 Data Docs |

## 进阶用法

### 自定义 Expectation

```python
from great_expectations.core import ExpectationConfiguration
from great_expectations.expectations.expectation import Expectation

class ExpectColumnValuesToBeValidEmail(Expectation):
    """验证邮箱格式"""
    
    def _validate(self, metrics, runtime_configuration):
        # 自定义验证逻辑
        pass
```

### Checkpoint 配置

```yaml
# checkpoints/user_quality.yml
name: user_quality
config_version: 1.0
class_name: Checkpoint
validations:
  - batch_request:
      datasource_name: my_pg
      data_asset_name: users
    expectation_suite_name: user_quality
action_list:
  - name: store_validation_result
    action: StoreValidationResultAction
  - name: update_data_docs
    action: UpdateDataDocsAction
```
