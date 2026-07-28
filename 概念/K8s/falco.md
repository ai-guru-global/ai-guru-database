---
title: "Falco"
category: -concepts
tags: ["falco", "security", "runtime-security", "kubernetes", "syscall", "threat-detection", "cncf"]
relationships:
  - target: "概念/runtime-security"
    type: implements
  - target: "概念/kubernetes"
    type: used_by
  - target: "概念/opa"
    type: related_to
  - target: "概念/kyverno"
    type: related_to
sources:
  - 17_伦理安全/LLM_Security_Complete_Guide.md
summary: "Falco 是 CNCF Incubating 的运行时安全检测工具，通过监控系统调用和 K8s 审计日志发现异常行为，广泛应用于容器逃逸、权限提升、敏感文件访问等威胁检测。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: reviewed
tier: archived
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Falco

name_zh: "运行时安全检测"
---

> **归档提示**: 此概念为通用云原生工具，与AI核心关联度较低。如需学习完整的K8s知识，请参考 CNCF 官方文档。

# Falco

> 中文简称：运行时安全检测

> 容器运行时的「安全摄像头」——通过系统调用发现异常行为。

---

## 1. 一句话定义

**Falco** 是 CNCF Incubating 的开源**运行时安全检测工具**，通过监控系统调用和 Kubernetes 审计日志发现异常行为。它可以检测容器逃逸、权限提升、敏感文件访问、异常网络连接等威胁，是云原生环境 runtime security 的核心工具。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **系统调用监控** | eBPF 或内核模块采集 syscall |
| **K8s 审计日志** | 监听 API Server 审计事件 |
| **规则引擎** | 用 YAML 定义检测规则 |
| **异常行为检测** | 如 shell 启动、敏感文件读取、特权容器 |
| **输出集成** | 对接 Prometheus/Alertmanager/SIEM |
| **轻量 Agent** | 以 DaemonSet 运行在 K8s 节点 |

---

## 3. 典型场景

1. **容器逃逸检测**：发现异常 mount、ptrace、特权升级。
2. **敏感数据访问**：监控 /etc/shadow、模型权重文件访问。
3. **异常网络连接**：检测 Pod 连向可疑 IP。
4. **AI 工作负载保护**：监控训练容器是否被注入恶意代码。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **OPA/Kyverno** | 准入控制（部署前）；Falco 运行时检测（部署后） |
| **eBPF** | Falco 可选的底层采集技术 |
| **Prometheus/Alertmanager** | Falco 可输出告警 |
| **SIEM** | 可对接企业安全运营中心 |

---

## 5. 优势与局限

### 优势
- 专注于运行时威胁检测。
- 规则丰富，社区活跃。
- eBPF 模式性能开销小。

### 局限
- 主要检测已知模式，对新型攻击需要自定义规则。
- 高噪声场景需调优规则。

---

## Related

- [[概念/runtime-security]] — 运行时安全
- [[概念/opa]] — OPA
- [[概念/kyverno]] — Kyverno
- [[概念/kubernetes]] — Kubernetes
- [[概念/trivy]] — Trivy 漏洞扫描
- [[17_伦理安全/LLM_Security_Complete_Guide]] — LLM 安全完整指南

---

## 2026 Falco 生态

| 特性 | 说明 | 状态 |
|------|------|------|
| **CNCF 孵化** | 社区活跃 | GA |
| **eBPF 探针** | 低开销采集 | GA |
| **插件系统** | 扩展数据源 | GA |
| **Falcosidekick** | 告警路由 | GA |

## 生产最佳实践

1. **eBPF 模式**：生产环境使用 eBPF 探针，降低开销
2. **规则调优**：根据业务场景调优规则，减少误报
3. **告警集成**：对接 Prometheus/Alertmanager/SIEM
4. **与准入控制配合**：OPA/Kyverno 管部署前，Falco 管运行时

## Falco 架构

| 组件 | 功能 |
|------|------|
| Falco | 运行时安全检测 |
| falco-driver | 内核事件捕获 |
| falco-exporter | Prometheus 指标 |
| falcosidekick | 告警分发 |

## Falco 规则类型

| 类型 | 说明 |
|------|------|
| Rules | 检测规则 |
| Macros | 可复用条件片段 |
| Lists | 可复用列表 |

## Falco 规则示例

```yaml
- rule: Detect GPU Container Escape
  desc: 检测 GPU 容器逃逸尝试
  condition: >
    spawned_process and container
    and proc.name in (nvidia-smi, nvidia-debugdump)
    and not proc.pname in (containerd, docker)
  output: >
    GPU 工具异常执行 (user=%user.name command=%proc.cmdline container=%container.name)
  priority: WARNING
  tags: [container, gpu, escape]
```

## AI 场景检测规则

| 规则 | 说明 |
|------|------|
| GPU 容器逃逸 | 检测异常 GPU 工具执行 |
| 模型文件篡改 | 检测模型目录写入 |
| 异常网络访问 | 检测训练数据外传 |
| 特权容器 | 检测特权模式使用 |
| 敏感文件访问 | 检测 Secret/ConfigMap 读取 |

## Falco vs 其他安全工具

| 工具 | 类型 | 时机 | 适用场景 |
|------|------|------|------|
| Falco | 运行时检测 | 运行时 | 入侵检测 |
| Kyverno | 准入控制 | 部署前 | 策略验证 |
| OPA | 策略引擎 | 部署前 | 通用策略 |
| Trivy | 漏洞扫描 | 构建时 | 镜像安全 |

> 💡 Falco 是 K8s 运行时安全的标准方案，2026 年 AI 集群推荐 Falco + Kyverno 实现全链路安全。

## 部署方式

| 方式 | 说明 | 适用场景 |
|------|------|------|
| DaemonSet | 每节点一个 | 生产环境 |
| Helm | 一键部署 | 快速部署 |
| 系统服务 | 直接安装 | 特殊环境 |

## 告警级别

| 级别 | 说明 | 响应 |
|------|------|------|
| Emergency | 系统不可用 | 立即处理 |
| Alert | 严重安全事件 | 尽快处理 |
| Critical | 关键错误 | 优先处理 |
| Error | 错误 | 正常处理 |
| Warning | 警告 | 关注 |
| Notice | 通知 | 记录 |
| Info | 信息 | 忽略 |
| Debug | 调试 | 忽略 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 误报多 | 规则不匹配 | 调优规则/添加排除 |
| 性能影响 | 规则过多 | 优化规则数量 |
| 驱动不兼容 | 内核版本 | 使用 eBPF 驱动 |
| 告警丢失 | 资源不足 | 增加资源限制 |

