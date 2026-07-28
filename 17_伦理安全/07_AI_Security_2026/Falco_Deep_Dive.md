---
tier: supporting
title: "Falco 深度解析: 容器运行时安全检测"
category: "17-ethics-safety"
tags: ["falco", "runtime-security", "kubernetes", "syscall", "threat-detection", "ebpff", "security"]
summary: "> **一句话理解**: Falco 是 CNCF Incubating 的运行时安全检测工具，通过 eBPF 或内核模块监控系统调用和 K8s 审计日志，发现容器逃逸、权限提升、敏感文件访问等运行时威胁。"
created: "2026-06-16"
updated: "2026-06-16"
sources: []
name_zh: "Falco 深度解析: 容器运行时安全检测"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# Falco 深度解析：容器运行时安全检测

> 中文简称：Falco 深度解析: 容器运行时安全检测

> **一句话理解**: Falco 是 CNCF Incubating 的运行时安全检测工具，通过 eBPF 或内核模块监控系统调用和 K8s 审计日志，发现容器逃逸、权限提升、敏感文件访问等运行时威胁。

> **官方站点**: https://falco.org

---

## 目录

1. [核心能力](#1-核心能力)
2. [架构组件](#2-架构组件)
3. [规则示例](#3-规则示例)
4. [AI 场景应用](#4-ai-场景应用)
5. [部署方式](#5-部署方式)
6. [生产最佳实践](#6-生产最佳实践)
7. [常见问题](#7-常见问题)
8. [官方资源](#8-官方资源)

---

## 1. 核心能力

| 能力 | 说明 |
|------|------|
| **系统调用监控** | eBPF / 内核模块采集 |
| **K8s 审计日志** | 监听 API Server 事件 |
| **规则引擎** | YAML 定义检测规则 |
| **输出集成** | stdout、file、syslog、Webhook、Prometheus |
| **容器上下文** | 关联 Pod/Namespace/Container 信息 |

---

## 2. 架构组件

```
Falco DaemonSet
  ├── Driver (eBPF / kernel module)
  ├── Userspace Engine
  ├── Rule Engine
  └── Outputs
```

---

## 3. 规则示例

### 3.1 检测容器内 shell 启动

```yaml
- rule: Terminal shell in container
  desc: Detect shell launched in container
  condition: spawned_process and shell_procs and container
  output: >
    Shell launched in container
    (user=%user.name container=%container.name shell=%proc.name)
  priority: WARNING
```

### 3.2 检测敏感文件读取

```yaml
- rule: Read sensitive file
  desc: Read /etc/shadow or model weights
  condition: >
    sensitive_files and open_read
  output: "Sensitive file read (file=%fd.name user=%user.name)"
  priority: NOTICE
```

---

## 4. AI 场景应用

- 检测训练容器异常网络连接。
- 监控模型权重文件访问。
- 发现容器内未经授权的代码执行。
- 检测特权容器和挂载异常。

---

## 5. 部署方式

### 5.1 Helm 安装

```bash
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm install falco falcosecurity/falco -n falco --create-namespace
```

### 5.2 输出到 Prometheus

```yaml
falcosidekick:
  enabled: true
  config:
    prometheus:
      enabled: true
```

---

## 6. 生产最佳实践

1. 先收集一段时间的基线事件，再配置告警。
2. 使用 eBPF 驱动减少内核兼容性风险。
3. 与 Alertmanager/PagerDuty 集成。
4. 定期更新规则集。
5. 对高噪声规则添加例外。

---

## 7. 常见问题

### Q1: Falco 与 OPA/Kyverno 怎么分工？

**A**: OPA/Kyverno 做准入控制（部署前），Falco 做运行时检测（部署后）。

### Q2: eBPF 和内核模块怎么选？

**A**: 优先 eBPF，兼容性更好。

### Q3:  Falco 能检测 LLM 特定攻击吗？

**A**: 可检测运行时异常（如模型文件被拷贝），但提示词攻击需结合应用层工具。

---

## 8. 官方资源

- **官网**: https://falco.org
- **GitHub**: https://github.com/falcosecurity/falco
- **文档**: https://falco.org/docs/

---

## Related

- [[概念/falco]] — Falco 概念卡片
- [[概念/opa]] — OPA
- [[概念/kyverno]] — Kyverno
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
