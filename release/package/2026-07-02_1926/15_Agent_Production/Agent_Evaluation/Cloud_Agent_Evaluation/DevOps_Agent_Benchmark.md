---
title: 云运维/DevOps Agent 专项测评
category: 15-agent-production-agent-evaluation-cloud-agent-evaluation
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> 专注于云基础设施运维场景的 Agent 能力评估，覆盖故障排查、自动化部署、监控告警、安全合规等核心运维能力"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Devops Agent Benchmark"
  - "DevOps Agent Benchmark"
  - DevOps_Agent_Benchmark
sources: []

---
# 云运维/DevOps Agent 专项测评

> 专注于云基础设施运维场景的 Agent 能力评估，覆盖故障排查、自动化部署、监控告警、安全合规等核心运维能力

## 概述

云运维/DevOps Agent 是企业生产环境中使用最频繁的智能体类型。本专项测评聚焦实际运维场景，评估 Agent 在真实工作流中的表现。

---

## 测评对象

| Agent | 厂商 | 定位 | 核心能力 |
|-------|------|------|----------|
| AWS Copilot | Amazon | 全栈部署助手 | ECS/EKS 部署、CI/CD、IaC |
| Azure Copilot | Microsoft | 云管理助手 | 资源管理、成本优化、安全 |
| Google Cloud Assist | Google | 运维诊断助手 | 故障诊断、性能优化、推荐 |
| 阿里云运维助手 | 阿里云 | 中文运维 Agent | ECS 运维、监控告警、自动化 |
| 腾讯云智维 | 腾讯云 | AIOps 智能运维 | 智能告警、根因分析、自愈 |
| 华为云 AIOps | 华为云 | 智能运维中心 | 全栈监控、异常检测、容量预测 |

---

## 测评维度

### 六大运维能力模型

```
┌─────────────────────────────────────────────────────────────┐
│              DevOps Agent 六大能力模型                         │
├──────────────┬──────┬──────────────────────────────────────┤
│ 能力          │ 权重 │ 评估要点                               │
├──────────────┼──────┼──────────────────────────────────────┤
│ 故障排查      │ 25%  │ 根因分析、日志解读、排障决策树           │
│ 部署自动化    │ 20%  │ IaC 生成、CI/CD 配置、蓝绿/金丝雀发布    │
│ 监控告警      │ 20%  │ 指标理解、告警配置、SLO/SLI 设计        │
│ 安全加固      │ 15%  │ 权限最小化、网络隔离、合规检查           │
│ 成本优化      │ 10%  │ 资源选型、浪费识别、FinOps 实践          │
│ 容量规划      │ 10%  │ 负载预测、弹性策略、性能基准             │
└──────────────┴──────┴──────────────────────────────────────┘
```

---

## 场景化测试题库

### 场景一：故障排查（25题）

#### 1.1 实例/服务不可用（10题）

```
测试用例示例：

Case 1: EC2 实例 Status Check 失败
  问题：一台生产环境 EC2 实例显示 "Status Check Failed (Instance)"，
        应用无法访问，请帮我排查。
  期望：分步骤排障（检查系统日志 → 安全组 → 网络 → 存储）
  评分：步骤完整性 + 命令准确性 + 修复方案可行性

Case 2: ECS 任务反复重启
  问题：ECS Fargate 任务持续重启，CloudWatch 日志显示 OOMKilled。
  期望：识别内存溢出问题 → 建议调整 Task Definition 内存配置
        → 提供内存优化建议

Case 3: Pod CrashLoopBackOff
  问题：Kubernetes Pod 处于 CrashLoopBackOff 状态。
  期望：kubectl describe/logs 命令 → 分析原因 → 提供解决方案
```

#### 1.2 网络连通性问题（8题）

```
Case 4: 跨 VPC 通信失败
  问题：VPC Peering 已建立，但两端的 EC2 实例无法互相访问。
  期望：检查路由表 → 安全组规则 → NACL → DNS 解析

Case 5: DNS 解析异常
  问题：VPC 内的 EC2 实例无法解析外部域名。
  期望：检查 DHCP Options Set → Route 53 配置 → 安全组出站规则
```

#### 1.3 数据库问题（7题）

```
Case 6: RDS 连接数耗尽
  问题：RDS MySQL 报错 "Too many connections"。
  期望：分析连接来源 → 建议连接池 → 调整 max_connections
        → 检查应用连接泄漏

Case 7: 数据库性能骤降
  问题：RDS PostgreSQL 突然变慢，CPU 使用率飙升至 100%。
  期望：识别活跃查询 → 分析锁等待 → 建议索引优化 → 参数调优
```

### 场景二：部署自动化（20题）

#### 2.1 IaC 代码生成（10题）

```
Case 8: Terraform VPC 模块
  问题：请生成一个 Terraform 模块，创建包含公私子网的 VPC，
        支持 NAT Gateway，3 个可用区。
  期望：完整可执行的 Terraform 代码，包含变量定义、输出值

Case 9: CloudFormation ECS Fargate
  问题：生成 CloudFormation 模板部署 ECS Fargate 服务，
        包含 ALB、Auto Scaling、CloudWatch 日志。
  期望：完整模板，资源依赖正确，参数化设计合理

Case 10: K8s Deployment + HPA
  问题：生成 Kubernetes 部署文件，包含 Deployment、Service、
        HPA，基于 CPU 和内存自动扩缩容。
  期望：正确的 YAML 配置，resource requests/limits 合理
```

#### 2.2 CI/CD 流水线（5题）

```
Case 11: GitHub Actions 部署到 AWS
  问题：创建 GitHub Actions 工作流，构建 Docker 镜像推送到 ECR，
        然后部署到 ECS Fargate。
  期望：完整的工作流 YAML，含安全 OIDC 认证

Case 12: 蓝绿发布策略
  问题：设计一个基于 Terraform 的蓝绿发布方案。
  期望：方案设计 + 切换脚本 + 回滚策略
```

#### 2.3 容器化部署（5题）

```
Case 13: Dockerfile 优化
  问题：优化以下 Dockerfile，减小镜像体积并提升安全性。
  期望：多阶段构建、基础镜像选择、安全最佳实践

Case 14: Helm Chart
  问题：创建一个 Helm Chart 部署微服务，支持环境变量注入、
        健康检查、资源限制。
  期望：完整的 Chart 结构 + values.yaml 设计
```

### 场景三：监控告警（20题）

#### 3.1 监控配置（8题）

```
Case 15: CloudWatch 监控方案
  问题：为一个三层架构（ALB + ECS + RDS）设计 CloudWatch 监控方案。
  期望：指标选择 → Dashboard 设计 → 告警规则 → 日志聚合

Case 16: Prometheus + Grafana
  问题：在 EKS 上部署 Prometheus + Grafana 监控栈。
  期望：Helm 安装 → ServiceMonitor 配置 → Dashboard JSON
```

#### 3.2 SLO/SLI 设计（6题）

```
Case 17: API 服务 SLO 设计
  问题：为一个 99.9% 可用性的 API 服务设计 SLO 和错误预算。
  期望：SLI 定义 → SLO 目标 → 错误预算计算 → 告警策略
```

#### 3.3 告警优化（6题）

```
Case 18: 告警降噪
  问题：当前有 200+ 条活跃告警，运维团队告警疲劳严重。
        请设计告警优化方案。
  期望：告警分级 → 聚合策略 → 噪声消除 → On-call 流程优化
```

### 场景四：安全加固（15题）

#### 4.1 IAM 最小权限（5题）

```
Case 19: IAM Policy 生成
  问题：为只读审计角色生成最小权限 IAM Policy，仅允许查看
        EC2、S3、CloudTrail 的只读操作。
  期望：精确的 Policy JSON，遵循最小权限原则

Case 20: 权限审计
  问题：分析以下 IAM 配置中的安全风险...
  期望：识别过度权限、提权路径、合规风险
```

#### 4.2 网络安全（5题）

```
Case 21: 安全组审计
  问题：审查以下安全组配置，识别安全风险并提供加固建议。
  期望：识别 0.0.0.0/0 入站、未使用端口、跨环境访问等风险

Case 22: WAF 规则
  问题：为 Web 应用配置 WAF 规则，防护 OWASP Top 10 攻击。
  期望：规则集设计 + 速率限制 + 地理封禁 + Bot 防护
```

#### 4.3 合规检查（5题）

```
Case 23: 合规扫描
  问题：设计 AWS Config 合规规则，确保所有 EBS 卷已加密、
        安全组不允许 22 端口公网访问。
  期望：Config Rule 定义 + 修复自动化
```

### 场景五：成本优化（10题）

```
Case 24: 成本分析
  问题：上月 AWS 账单 $50,000，请分析可能的优化方向。
  期望：资源利用率分析 → 预留实例建议 → 存储分层 → 闲置资源清理

Case 25: FinOps 策略
  问题：设计一套企业级 FinOps 实践方案。
  期望：标签策略 → 成本分配 → 预算告警 → 优化自动化
```

### 场景六：容量规划（10题）

```
Case 26: Auto Scaling 策略
  问题：为电商大促设计 Auto Scaling 策略，平时 10 台，
        大促时需要支持 100 倍流量。
  期望：预热策略 → 弹性策略 → 容量预留 → 降级方案

Case 27: 性能基准测试
  问题：设计 ECS Fargate 服务的性能基准测试方案。
  期望：测试工具选择 → 场景设计 → 指标收集 → 结果分析
```

---

## 评分标准

### 操作指引评分

| 等级 | 标准 | 分数 |
|:----:|------|:----:|
| S | 步骤完整、命令准确、有安全注意事项、提供替代方案 | 95-100 |
| A | 步骤完整、命令基本准确 | 85-94 |
| B | 主要步骤正确，部分细节缺失 | 70-84 |
| C | 方向正确但步骤不完整 | 60-69 |
| D | 方向错误或信息过时 | <60 |

### 代码生成评分

| 等级 | 标准 | 分数 |
|:----:|------|:----:|
| S | 可直接执行，遵循最佳实践，有注释和文档 | 95-100 |
| A | 可执行，基本遵循最佳实践 | 85-94 |
| B | 需少量修改后可执行 | 70-84 |
| C | 需较多修改，框架正确 | 60-69 |
| D | 无法执行或设计有重大缺陷 | <60 |

---

## 综合排行榜

| 排名 | Agent | 故障排查 | 部署自动化 | 监控告警 | 安全加固 | 成本优化 | 容量规划 | 综合 | 等级 |
|:----:|-------|:--------:|:----------:|:--------:|:--------:|:--------:|:--------:|:----:|:----:|
| 1 | AWS Copilot | — | — | — | — | — | — | — | — |
| 2 | Azure Copilot | — | — | — | — | — | — | — | — |
| 3 | Google Cloud Assist | — | — | — | — | — | — | — | — |
| 4 | 阿里云运维助手 | — | — | — | — | — | — | — | — |
| 5 | 腾讯云智维 | — | — | — | — | — | — | — | — |
| 6 | 华为云 AIOps | — | — | — | — | — | — | — | — |

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2026-04 | 初始版本，100 题运维场景测试库 |

## Related

- [[Agent/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[Agent/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
