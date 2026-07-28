---
title: "Data Validation"
category: -concepts
tags: ["mlops", "data-quality", "pipeline", "alibaba-cloud"]
summary: "Data Validation 是在 ML/LLM 训练流水线中对输入数据进行自动化校验的过程，确保数据符合预期的 schema、统计分布和语义质量。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "数据验证"
relationships:
  - target: "概念/mlops"
    type: part_of
  - target: "概念/great-expectations"
    type: implemented_by
  - target: "概念/pandera"
    type: implemented_by
sources: []
name_zh: "数据校验"
---

# Data Validation

> 中文简称：数据校验

> **一句话理解**: 数据验证就是训练流水线的「质检员」——在数据进模型之前，自动检查它有没有缺字段、类型对不对、分布有没有漂移。

## 核心要点

- **四层验证**:
  - L0 Schema: 字段存在、类型、非空
  - L1 Statistics: 均值、方差、分位数、类别分布
  - L2 Distribution: 训练/服务数据分布漂移
  - L3 Semantic: 文本质量、毒性、PII、重复
- **CI/CD 门禁**: 验证失败可阻断训练任务。
- **工具**: Great Expectations、Pandera、Evidently、WhyLabs、Deequ。

## 常见规则

| 规则 | 目的 |
|------|------|
| expect_column_to_exist | 防止上游删字段 |
| expect_column_values_to_not_be_null | 防止空值 |
| expect_column_mean_to_be_between | 防止分布漂移 |
| expect_table_row_count_to_be_between | 防止数据量异常 |

## 阿里云专有云关联

在阿里云专有云环境中，数据验证任务常作为 ACK Job 或 Airflow DAG 运行，数据源来自盘古 OSS / MaxCompute / DataWorks，失败告警接入 ASCM。

## Related

- [[概念/great-expectations|Great Expectations]]
- [[概念/pandera|Pandera]]
- [[概念/evidently|Evidently]]
- [[概念/mlops|MLOps]]
- [[11_模型运维/12_Troubleshooting/Data_Validation_Failure_Runbook|数据验证失败 Runbook]]

---

## 2026 数据验证生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Great Expectations** | 数据质量框架 | GA |
| **Pandera** | Python 数据验证库 | GA |
| **Evidently** | 数据漂移检测 | GA |
| **Schema 验证** | 数据结构验证 | GA |
| **统计检查** | 数据分布统计检查 | GA |

## 生产最佳实践

1. **Schema 验证**：数据处理前验证 Schema
2. **CI/CD 集成**：数据验证集成到 CI/CD
3. **漂移检测**：监控数据漂移
4. **与 Pandera 对比**：GE 更强大，Pandera 更轻量
5. **告警配置**：数据验证失败时告警

## 验证架构分层

| 层级 | 验证内容 | 工具 | 触发时机 |
|------|------|------|------|
| L0 Schema | 字段存在、类型、非空 | Pandera/GE | 每次数据加载 |
| L1 统计 | 均值、方差、分位数 | Evidently | 每日/每批 |
| L2 分布 | 训练/服务分布漂移 | Evidently/WhyLabs | 每周 |
| L3 语义 | 文本质量、毒性、PII | 自定义规则 | 数据入库前 |

## 配置示例

```python
import pandera as pa
from pandera import Column, DataFrameSchema

# 训练数据 Schema 验证
train_schema = DataFrameSchema({
    "text": Column(str, nullable=False, str_length={"min_value": 10}),
    "label": Column(int, pa.Check.in_range(0, 9)),
    "score": Column(float, pa.Check.in_range(0.0, 1.0)),
    "timestamp": Column("datetime64[ns]"),
})

# 验证失败时抛出异常，阻断训练
validated_df = train_schema.validate(raw_df, lazy=True)
```

## 工具对比

| 工具 | 优势 | 劣势 | 适用场景 |
|------|------|------|------|
| Great Expectations | 功能全面、可视化 | 学习曲线陡 | 企业级数据质量 |
| Pandera | 轻量、Python 原生 | 功能较少 | 快速验证 |
| Evidently | 漂移检测强 | 不做 Schema | 监控阶段 |
| WhyLabs | SaaS、无代码 | 付费 | 快速上手 |
| Deequ | Spark 原生 | 仅 Spark | 大数据场景 |

## LLM 数据验证特殊考虑

| 检查项 | 说明 | 工具 |
|------|------|------|
| 文本长度 | 过滤过短/过长文本 | 自定义规则 |
| 语言检测 | 确保目标语言 | langdetect |
| 毒性检测 | 过滤有害内容 | Perspective API |
| PII 检测 | 移除个人信息 | Presidio |
| 重复检测 | 去除重复样本 | MinHash/SimHash |
| 编码质量 | 检查乱码/特殊字符 | charset-normalizer |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 上游字段缺失 | 数据源变更 | Schema 验证 + 告警 |
| 分布漂移 | 季节性/业务变化 | 定期重新基线 |
| 空值突增 | 上游故障 | 非空检查 + 回滚 |
| 数据量异常 | 采集故障 | 行数检查 |
| 类型不匹配 | 格式变更 | 类型强制转换 |

## 相关概念

- [[概念/mlops|MLOps]] — ML 运维体系
- [[概念/data-cleaning-pipeline|Data Cleaning Pipeline]] — 数据清洗流水线
- [[概念/online-evaluation|Online Evaluation]] — 在线评估

> 💡 数据验证是 ML 流水线的第一道防线——“垃圾进，垃圾出”，没有数据质量保证，模型质量无从谈起。

## CI/CD 集成示例

```yaml
# GitHub Actions 数据验证步骤
- name: Data Validation
  run: |
    python -m great_expectations checkpoint run train_data
    if [ $? -ne 0 ]; then
      echo "Data validation failed, blocking training"
      exit 1
    fi
- name: Train Model
  run: python train.py --data validated_data.parquet
```

## 监控与告警架构

| 组件 | 职责 | 工具 |
|------|------|------|
| 数据采集 | 收集验证指标 | Prometheus |
| 可视化 | 数据质量仪表板 | Grafana |
| 告警 | 验证失败通知 | AlertManager |
| 存储 | 验证结果历史 | PostgreSQL |
| 编排 | 定期验证任务 | Airflow/CronJob |

## 生产检查清单

1. 定义数据 Schema 并版本化管理
2. 配置 L0-L3 四层验证规则
3. 集成到 CI/CD 流水线作为门禁
4. 配置漂移检测定期任务
5. 设置验证失败告警和回滚机制
6. 建立数据质量 SLI/SLO
7. 定期审视验证规则有效性
8. 记录验证结果用于审计追溯

## 版本兼容性

| 工具 | 版本 | Python | 状态 |
|------|------|------|------|
| Great Expectations | 1.0+ | 3.9+ | GA |
| Pandera | 0.20+ | 3.9+ | GA |
| Evidently | 0.4+ | 3.8+ | GA |
| WhyLabs | SaaS | 3.8+ | GA |

## 数据验证 vs 数据测试

| 维度 | 数据验证 | 数据测试 |
|------|------|------|
| 时机 | 运行时/流水线中 | 开发时/CI |
| 范围 | 全量数据 | 采样/单元测试 |
| 目的 | 生产质量保证 | 开发质量保证 |
| 工具 | GE/Pandera/Evidently | pytest/dbt test |
| 失败处理 | 告警/回滚/降级 | 阻断发布 |

## 相关概念

- [[概念/great-expectations|Great Expectations]] — 数据质量框架
- [[概念/pandera|Pandera]] — Python 数据验证
- [[概念/evidently|Evidently]] — 数据漂移检测
