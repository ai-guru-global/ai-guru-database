---
title: "Pandera"
category: -concepts
tags: ["mlops", "data-validation", "pandas", "data-quality", "alibaba-cloud"]
summary: "Pandera 是面向 DataFrame 的声明式数据验证库，为 Pandas、Polars、Dask、PySpark 等提供 schema 校验能力。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Pandera Data Validation"
relationships:
  - target: "_concepts/data-validation"
    type: implements
  - target: "_concepts/pandas"
    type: related_to
---

# Pandera

> **一句话理解**: Pandera 是给 DataFrame 加「类型检查」的工具，让 Pandas 数据也能像静态类型一样被自动校验。

## 核心要点

- **声明式 Schema**: 用类 Pydantic 的语法定义 DataFrame 结构。
- **多后端支持**: Pandas、Polars、Dask、PySpark、Modin。
- **类型检查**: 列类型、 nullable、取值范围、唯一性。
- **统计校验**: 列均值、标准差、分布。
- **轻量**: 比 Great Expectations 更简单，适合代码内嵌验证。

## 示例

```python
import pandera as pa
from pandera import Column, DataFrameSchema

schema = DataFrameSchema({
    "age": Column(int, checks=pa.Check.between(0, 120)),
    "label": Column(str, nullable=False),
})

schema.validate(df)
```

## 阿里云专有云关联

在阿里云专有云 MLOps 流水线中，Pandera 常用于训练前的数据 schema 校验，作为轻量门禁。工单中「数据格式错误」时，可检查 Pandera schema 是否与上游 ETL 输出一致。

## Related

- [[_concepts/data-validation|Data Validation]]
- [[_concepts/great-expectations|Great Expectations]]
- [[_concepts/mlops|MLOps]]
