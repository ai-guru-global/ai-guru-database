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
