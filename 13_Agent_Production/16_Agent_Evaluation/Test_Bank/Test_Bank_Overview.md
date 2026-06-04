---
title: 测试题库总览
category: 13-agent-production-16-agent-evaluation-test-bank
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 云产品智能体测评的标准化测试题库，覆盖 350+ 题目，按场景/难度/产品三个维度组织"
created: 2026-05-31
updated: 2026-05-31
---

# 测试题库总览

> 云产品智能体测评的标准化测试题库，覆盖 350+ 题目，按场景/难度/产品三个维度组织

## 题库结构

```
测试题库
├── 基础知识题（200 题）
│   ├── 产品文档问答（100 题）
│   ├── API/SDK 使用（50 题）
│   └── 概念辨析（50 题）
├── 进阶场景题（100 题）
│   ├── 架构设计（30 题）
│   ├── 故障排查（30 题）
│   └── 性能优化（40 题）
├── 专家级题目（50 题）
│   ├── 复杂故障（20 题）
│   ├── 安全加固（15 题）
│   └── 成本优化（15 题）
└── 实时性/前沿题（20 题）
    ├── 最新版本功能（10 题）
    └── 前沿技术应用（10 题）
```

---

## 一、基础知识题（Level 1-2）

### 1.1 产品文档问答（100 题）

#### 计算服务（20 题）

```
Q001 [Level-1] AWS
问：EC2 的按需实例和预留实例有什么区别？分别适用于什么场景？
期望：价格差异、适用场景、承诺期限、灵活性对比

Q002 [Level-1] 阿里云
问：ECS 的突发性能实例（t5/t6）适合什么场景？有什么限制？
期望：CPU 积分机制、基准性能、适用场景、超限影响

Q003 [Level-2] Azure
问：Azure VM 的可用性集（Availability Set）和可用区（Availability Zone）有什么区别？
期望：故障域/更新域 vs 物理隔离、SLA 差异、适用场景

Q004 [Level-2] GCP
问：GCE 的自定义机器类型如何计费？与预定义类型相比有什么优势？
期望：按 vCPU/内存独立计费、灵活配置、成本对比

Q005 [Level-1] AWS
问：Lambda 函数的执行时间限制是多少？如何处理长时间运行的任务？
期望：15 分钟限制、Step Functions 分解、ECS/Fargate 替代方案

（更多题目...）
```

#### 存储服务（20 题）

```
Q021 [Level-1] AWS
问：S3 的存储类别有哪些？如何选择？
期望：Standard/IA/Glacier/Deep Archive 的对比、访问频率决策树

Q022 [Level-1] 阿里云
问：OSS 的生命周期规则如何配置？支持哪些操作？
期望：转储/删除规则、条件（天数/标签）、示例配置

Q023 [Level-2] Azure
问：Azure Blob 的热/冷/归档层自动转换如何实现？
期望：生命周期管理策略、条件配置、成本优化

Q024 [Level-2] AWS
问：EBS 的 gp3 和 io2 Block Express 有什么区别？如何选型？
期望：性能参数对比、价格对比、适用场景

Q025 [Level-1] 通用
问：对象存储和块存储的区别是什么？分别适合什么场景？
期望：接口差异、性能差异、使用场景、典型产品映射

（更多题目...）
```

#### 网络服务（20 题）

```
Q041 [Level-1] AWS
问：VPC 的安全组和网络 ACL 有什么区别？
期望：有状态/无状态、实例级/子网级、规则数量限制

Q042 [Level-2] 通用
问：什么是 Transit Gateway？什么场景下需要使用？
期望：中心化路由、多 VPC 互联、与 VPC Peering 对比

Q043 [Level-1] 阿里云
问：阿里云 SLB 支持哪些协议？四层和七层负载均衡的区别？
期望：TCP/UDP/HTTP/HTTPS、L4 vs L7、功能差异

（更多题目...）
```

#### 数据库服务（20 题）

```
Q061 [Level-1] AWS
问：RDS Multi-AZ 和 Read Replica 有什么区别？
期望：高可用 vs 读扩展、同步/异步复制、故障切换行为

Q062 [Level-2] AWS
问：Aurora Serverless v2 的自动扩缩容机制是怎样的？
期望：ACU 概念、最小/最大容量、冷启动、计费方式

Q063 [Level-1] 通用
问：什么场景下应该选择 NoSQL 数据库而不是关系型数据库？
期望：数据模型、访问模式、扩展需求、一致性要求

（更多题目...）
```

#### 容器/无服务器（20 题）

```
Q081 [Level-1] AWS
问：ECS Fargate 和 EC2 启动类型有什么区别？
期望：托管 vs 自管理、成本差异、运维复杂度

Q082 [Level-2] 通用
问：Kubernetes 的 HPA 和 VPA 有什么区别？可以同时使用吗？
期望：水平/垂直扩缩容、指标来源、兼容性

Q083 [Level-1] Azure
问：Azure Functions 的消费计划和高级计划有什么区别？
期望：冷启动、执行时间、VNet 集成、成本

（更多题目...）
```

### 1.2 API/SDK 使用（50 题）

```
Q101 [Level-1] AWS
问：如何使用 Python boto3 列出所有正在运行的 EC2 实例？
期望：完整可执行代码、分页处理、错误处理

Q102 [Level-2] 阿里云
问：如何使用 Terraform 创建一个带公网 IP 的 ECS 实例？
期望：完整的 Terraform 配置、变量定义、输出值

Q103 [Level-2] AWS
问：如何使用 AWS CDK 创建一个 Lambda + API Gateway 的 REST API？
期望：完整的 CDK 代码、TypeScript/Python、部署步骤

（更多题目...）
```

### 1.3 概念辨析（50 题）

```
Q151 [Level-1] 通用
问：IaaS、PaaS、SaaS 的区别是什么？每种给出 3 个产品示例。
期望：定义清晰、示例准确、适用场景

Q152 [Level-2] 通用
问：微服务和单体架构各有什么优劣？什么情况下应该选择微服务？
期望：对比全面、决策标准清晰、结合云服务建议

（更多题目...）
```

---

## 二、进阶场景题（Level 2-3）

### 2.1 架构设计（30 题）

```
Q201 [Level-3] AWS
问：请设计一个支持百万 QPS 的高可用电商系统架构。
期望：
  - 前端：CloudFront + ALB + Auto Scaling
  - 应用：ECS Fargate + 多 AZ
  - 数据：Aurora + ElastiCache + DynamoDB
  - 异步：SQS + Lambda
  - 监控：CloudWatch + X-Ray
  - 成本优化策略

Q202 [Level-3] 阿里云
问：设计一个混合云架构，线下 IDC 与阿里云 VPC 互通，要求低延迟高安全。
期望：
  - 专线/VPN Gateway
  - 智能接入网关 SAG
  - 云企业网 CEN
  - 安全组/网络 ACL
  - DNS 解析策略
  - 监控和告警方案

（更多题目...）
```

### 2.2 故障排查（30 题）

```
Q231 [Level-3] AWS
场景：生产环境 API 突然返回 503 错误，ALB 健康检查失败。
      CloudWatch 显示目标实例 CPU 正常但内存使用率 95%。
问：请提供完整的排查步骤和修复方案。
期望：
  1. 检查 ALB Target Group 健康检查配置
  2. 分析应用内存泄漏可能
  3. 检查 JVM/运行时内存配置
  4. 查看应用日志（OOM 错误）
  5. 临时扩容 + 永久修复方案
  6. 防止复发的监控告警

Q232 [Level-3] 通用
场景：K8s 集群中 Pod 频繁 OOMKilled，但 limits 设置看起来足够。
问：分析可能的原因并提供解决方案。
期望：
  1. 检查 limits vs requests 设置
  2. 分析实际内存使用 vs 限制
  3. 检查是否有内存泄漏
  4. 容器基础进程的内存开销
  5. JVM 堆外内存影响
  6. 调优建议

（更多题目...）
```

### 2.3 性能优化（40 题）

```
Q261 [Level-2] AWS
问：一个 S3 数据湖查询延迟很高，如何优化？
期望：分区策略、列式格式（Parquet）、S3 Select、Athena 优化、缓存

Q262 [Level-3] 通用
问：微服务间 gRPC 调用延迟不稳定（P99 > 500ms），如何排查和优化？
期望：服务网格分析、连接池、负载均衡策略、序列化优化、链路追踪

（更多题目...）
```

---

## 三、专家级题目（Level 3-4）

### 3.1 复杂故障（20 题）

```
Q301 [Level-4] AWS
场景：跨区域故障切换演练中，RDS 跨区域只读副本提升为主实例后，
      应用出现大量数据不一致错误。
问：分析原因并提供完整的灾难恢复方案改进。
期望：
  1. 异步复制延迟分析
  2. RPO/RTO 评估
  3. 应用层幂等设计
  4. 数据一致性验证
  5. 灾难恢复流程改进
  6. 自动化故障切换方案

（更多题目...）
```

### 3.2 安全加固（15 题）

```
Q321 [Level-3] AWS
问：设计一个零信任架构方案，要求所有访问都经过身份验证和授权。
期望：
  - IAM Identity Center
  - Verified Access
  - PrivateLink
  - WAF + Shield
  - CloudTrail 审计
  - 最低权限原则实施

（更多题目...）
```

### 3.3 成本优化（15 题）

```
Q341 [Level-3] 通用
问：一个 $200K/月的 AWS 环境如何在 6 个月内降低 30% 成本？
期望：
  1. 成本分析框架
  2. 预留实例/Savings Plans
  3. 闲置资源清理
  4. 存储分层优化
  5. Spot 实例策略
  6. 标签策略和成本分配
  7. 持续 FinOps 实践

（更多题目...）
```

---

## 四、实时性/前沿题（Level 3-4）

### 4.1 最新版本功能（10 题）

```
Q351 [Level-4] AWS
问：AWS 最近发布的 [新功能] 是什么？与之前的方案相比有什么改进？
期望：准确描述新功能、与旧方案对比、适用场景

（注：具体题目在每次测评前根据最新发布动态更新）
```

### 4.2 前沿技术应用（10 题）

```
Q361 [Level-4] 通用
问：如何在云上部署 DeepSeek-R1 推理服务？需要考虑哪些优化？
期望：GPU 选型、vLLM 部署、量化策略、弹性伸缩、成本优化

（更多题目...）
```

---

## 题目分发策略

### 按产品分发

| 产品 | 专属题目 | 通用题目 | 合计 |
|------|:--------:|:--------:|:----:|
| AWS | 40 | 60 | 100 |
| Azure | 30 | 60 | 90 |
| GCP | 30 | 60 | 90 |
| 阿里云 | 30 | 60 | 90 |
| 腾讯云 | 20 | 60 | 80 |
| 华为云 | 20 | 60 | 80 |
| 通用 Agent | 0 | 100 | 100 |

### 按语言分发

| 语言 | 题目数 | 说明 |
|------|:------:|------|
| 中文提问 | 250 | 中文技术问答 |
| 英文提问 | 70 | 英文技术问答 |
| 中英混合 | 30 | 中英文混合场景 |

---

## 评分标准

### 准确性评分

| 评分 | 标准 |
|:----:|------|
| 10分 | 完全正确，包含细节和注意事项 |
| 8分 | 正确，缺少部分细节 |
| 6分 | 方向正确，有部分不准确 |
| 4分 | 有明显错误但部分正确 |
| 2分 | 方向错误但有相关内容 |
| 0分 | 完全错误或无法回答 |

### 完整性评分

| 评分 | 标准 |
|:----:|------|
| 10分 | 步骤完整，有前置条件和异常处理 |
| 8分 | 步骤完整，缺少部分异常处理 |
| 6分 | 主要步骤完整，有遗漏 |
| 4分 | 步骤不完整但有价值 |
| 2分 | 严重遗漏 |
| 0分 | 无法提供可操作的步骤 |

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2026-04 | 初始版本，350+ 题目框架 |

## Related

- [[13_Agent_Production/16_Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[13_Agent_Production/16_Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[13_Agent_Production/16_Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[13_Agent_Production/16_Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
