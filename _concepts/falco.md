---
title: "Falco"
category: -concepts
tags: ["falco", "security", "runtime-security", "kubernetes", "syscall", "threat-detection", "cncf"]
relationships:
  - target: "_concepts/runtime-security"
    type: implements
  - target: "_concepts/kubernetes"
    type: used_by
  - target: "_concepts/opa"
    type: related_to
  - target: "_concepts/kyverno"
    type: related_to
sources:
  - 17_Ethics_Safety/LLM_Security_Complete_Guide.md
summary: "Falco 是 CNCF Incubating 的运行时安全检测工具，通过监控系统调用和 K8s 审计日志发现异常行为，广泛应用于容器逃逸、权限提升、敏感文件访问等威胁检测。"
provenance:
  extracted: 0.75
  inferred: 0.2
  ambiguous: 0.05
base_confidence: 0.85
lifecycle: stable
tier: core
created: 2026-06-16
updated: 2026-06-16
---

# Falco

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

- [[_concepts/runtime-security]] — 运行时安全
- [[_concepts/opa]] — OPA
- [[_concepts/kyverno]] — Kyverno
- [[_concepts/kubernetes]] — Kubernetes
- [[17_Ethics_Safety/LLM_Security_Complete_Guide]] — LLM 安全完整指南
