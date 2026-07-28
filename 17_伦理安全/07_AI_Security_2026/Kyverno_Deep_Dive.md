---
tier: supporting
title: "Kyverno 深度解析: Kubernetes 原生策略引擎"
category: "17-ethics-safety"
tags: ["kyverno", "kubernetes", "policy", "security", "admission-control", "yaml", "compliance"]
summary: "> **一句话理解**: Kyverno 是专为 Kubernetes 设计的策略引擎，使用原生 YAML 定义验证、变更、生成和镜像验证策略，无需学习 Rego，是 K8s 安全基线和资源合规的轻量选择。"
created: "2026-06-16"
updated: "2026-06-16"
sources: []
name_zh: "Kyverno 深度解析: Kubernetes 原生策略引擎"
---

# Kyverno 深度解析：Kubernetes 原生策略引擎

> 中文简称：Kyverno 深度解析: Kubernetes 原生策略引擎

> **一句话理解**: Kyverno 是专为 Kubernetes 设计的策略引擎，使用原生 YAML 定义验证、变更、生成和镜像验证策略，无需学习 Rego，是 K8s 安全基线和资源合规的轻量选择。

> **官方站点**: https://kyverno.io

---

## 目录

1. [核心能力](#1-核心能力)
2. [策略类型](#2-策略类型)
3. [典型策略示例](#3-典型策略示例)
4. [AI 场景应用](#4-ai-场景应用)
5. [生产最佳实践](#5-生产最佳实践)
6. [常见问题](#6-常见问题)
7. [官方资源](#7-官方资源)

---

## 1. 核心能力

| 能力 | 说明 |
|------|------|
| **Validate** | 拒绝不合规资源 |
| **Mutate** | 自动修改资源 |
| **Generate** | 自动创建关联资源 |
| **Verify Images** | 验证镜像签名 |
| **Policy Reports** | 展示集群合规状态 |

---

## 2. 策略类型

| 类型 | 用途 |
|------|------|
| **ClusterPolicy** | 集群级策略 |
| **Policy** | 命名空间级策略 |

---

## 3. 典型策略示例

### 3.1 禁止 Privileged 容器

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: disallow-privileged
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-privileged
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "Privileged containers are not allowed"
        pattern:
          spec:
            containers:
              - securityContext:
                  privileged: "false"
```

### 3.2 强制资源限制

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-resources-limits
spec:
  validationFailureAction: Enforce
  rules:
    - name: check-limits
      match:
        resources:
          kinds:
            - Pod
      validate:
        message: "CPU and memory limits are required"
        pattern:
          spec:
            containers:
              - resources:
                  limits:
                    memory: "?*"
                    cpu: "?*"
```

---

## 4. AI 场景应用

- 要求所有 GPU Pod 使用指定 toleration。
- 自动为 AI 命名空间添加成本中心标签。
- 禁止模型服务镜像来自公共仓库。
- 强制训练 Job 设置 activeDeadlineSeconds。

---

## 5. 生产最佳实践

1. 先用 `Audit` 模式观察，再切 `Enforce`。
2. 使用 `exclude` 排除 kube-system 等系统命名空间。
3. 定期查看 Policy Reports。
4. 与 ArgoCD/Flux 集成做 GitOps 策略管理。

---

## 6. 常见问题

### Q1: Kyverno 与 OPA 怎么选？

**A**: K8s 原生简单场景选 Kyverno；复杂跨平台策略选 OPA。

### Q2: Kyverno 会拖慢 API Server 吗？

**A**: 通常影响很小，可通过副本数和资源请求调优。

### Q3: 如何验证策略？

**A**: 使用 `kyverno test` 命令或 Kyverno CLI。

---

## 7. 官方资源

- **官网**: https://kyverno.io
- **GitHub**: https://github.com/kyverno/kyverno
- **文档**: https://kyverno.io/docs/

---

## Related

- [[概念/kyverno]] — Kyverno 概念卡片
- [[概念/opa]] — OPA
- [[概念/falco]] — Falco
- [[概念/kubernetes]] — Kubernetes

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
