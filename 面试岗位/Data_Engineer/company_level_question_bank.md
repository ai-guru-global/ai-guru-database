---
title: Data Engineer 按公司/级别区分的题库
category: 21-interviews-data-engineer
tags: ["interviews", "career", "data-engineering", "company-specific", "level-specific", "etl", "data-warehouse"]
summary: "Data Engineer 面试题库，按公司类型（大厂/独角兽/外企/创业）和级别（Junior/Mid/Senior/Staff）区分，含具体公司示例。"
created: 2026-07-23
updated: 2026-07-23
tier: supporting
sources: []
---

# Data Engineer 按公司/级别区分的题库

---

## 按公司类型

### 大厂/平台型 (字节/阿里/腾讯/百度)

- PB 级数据湖和数仓的架构演进（Hive → Spark → Lakehouse）？
- 千万级 QPS 的实时数据管道（Kafka + Flink）稳定性？
- 多业务线统一数据中台的设计（避免烟囱式建设）？
- 数据质量和血缘的全公司治理体系？
- 自研 vs 开源大数据组件（如字节 ByteHouse）的取舍？

### 独角兽/明星创企 (小红书/B站/快手/滴滴)

- 从 0 搭建公司数据仓库和 BI 体系的路径？
- 中等规模下实时数仓（StarRocks/Doris）的落地？
- 数据团队与算法团队的高效协作（特征平台）？
- 成长期的数据技术债管理（业务快跑 vs 架构优化）？

### 外企 (Amazon/Microsoft/Meta/Google/Netflix)

- 云原生数据栈（EMR/Snowflake/BigQuery）的最佳实践？
- 跨区域数据同步和合规（GDPR/数据本地化）？
- 数据 mesh / data fabric 的组织级落地？
- 开源贡献文化（Netflix 开源数据工具）？

### 创业公司/中小团队

- 预算有限，用云托管（Snowflake/BigQuery）vs 自建 Hadoop？
- 现代 data stack（Fivetran + dbt + Snowflake + Looker）如何快速搭建？
- 单人/小团队的 Data Platform 如何避免运维陷阱？
- 没有专职数据团队时，全栈工程师如何兼顾数据管道？

---

## 具体公司示例

### 字节跳动 (Data 团队)
- 抖音/今日头条的实时数据管道（火山引擎数据）？
- ByteHouse（ClickHouse 衍生）的内部实践？
- 数据血缘和治理（DataLeap）的大规模落地？

### 阿里巴巴 (数据中台/MaxCompute)
- 阿里数据中台方法论（OneData/OneID/OneService）？
- MaxCompute + Flink 的大规模批流一体？
- 双 11 数据保障（峰值 + 准确性）？

### Netflix
- Keystone 数据管道（Kafka + Flink）的架构？
- 数据即产品（Data as Product）的实践？
- 开源生态（Iceberg 等）的贡献与内部使用？

### Uber
- Hudi 的诞生背景与内部应用？
- 实时数据基础设施（如 Athena）？
- 多团队数据自治（Data Mesh 思路）？

### Airbnb
- 数据仓库 + dbt 的标准化建模实践？
- 数据质量和 SLA 的全公司治理？
- 数据民主化（让非工程师用数据）的工具建设？

---

## 按级别

### 初级 (Junior, 0-3 年)
- 写 SQL 完成数据查询和 ETL
- 用 Airflow 配置基本的数据管道
- 处理数据清洗的常见问题
- 描述一次你参与的数据项目
- 手撕: 窗口函数 / Pandas 数据处理

### 中级 (Mid, 3-5 年)
- 独立设计一个业务域的数据仓库（分层/建模）
- 优化 Spark/Flink 任务的性能
- 实现实时数据管道（Kafka + Flink）
- 保证数据质量和 SLA
- 与分析师/科学家协作交付数据资产

### 高级 (Senior, 5-8 年)
- 主导公司级数据平台架构（批流一体/Lakehouse）
- 设计 Feature Store 支撑 ML 训练/推理一致性
- 建立数据治理体系（血缘/质量/合规）
- 处理 PB 级数据的性能和成本优化
- 指导团队建立数据工程最佳实践

### Staff/Principal (8+ 年)
- 公司级数据战略（平台/治理/组织）
- 设计下一代数据基础设施（如 Data Mesh）
- 推动数据驱动的组织变革
- 影响开源社区（贡献/标准）
- 培养数据工程领军人才

---

## 按面试轮次侧重

| 轮次 | 侧重 | 典型问题 |
|------|------|---------|
| 一面（SQL+编程） | SQL/Python | 复杂查询、Spark/Pandas |
| 二面（数据建模） | 数仓设计 | 分层/维度建模 |
| 三面（系统设计） | 架构 | 设计实时数仓/管道 |
| 四面（行为/协作） | 落地与协作 | 讲一次数据项目、跨团队协作 |

---

## 岗位细分方向

| 方向 | 重点 | 技术栈 |
|------|------|--------|
| 数据仓库工程师 | 建模/SQL/ETL | Hive/Spark/数仓工具 |
| 实时数据工程师 | 流处理 | Kafka/Flink |
| 数据平台工程师 | 基础设施 | K8s/调度/监控 |
| Analytics Engineer | dbt/BI | dbt/Looker/Tableau |
| ML Data Engineer | 特征/训练数据 | Feature Store/Spark |

---

*Last updated: 2026-07-23*

## Related

- [[面试岗位/Data_Engineer/question_bank|Data Engineer 题库]]
- [[面试岗位/Data_Engineer/interview_answers|Data Engineer 面试题实例答案]]
- [[面试岗位/Data_Engineer/index|Data Engineer 首页]]
- [[模型运维/index|模型运维]]
- [[模型运维/Data_Engineering/index|数据工程]]
- [[模型运维/Feature_Store/index|Feature Store]]
- [[面试岗位/Interview_Guide/System_Design_for_AI|AI 系统设计面试]]
- [[面试岗位/jobs|AI 相关岗位与工种清单]]
