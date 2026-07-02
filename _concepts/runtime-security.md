---
title: "Runtime Security（运行时安全）"
category: -concepts
tags: [runtime-security, falco, ebpf, kubernetes, threat-detection, observability]
aliases:
  - "Runtime Security"
  - "运行时安全"
  - "Runtime Threat Detection"
relationships:
  - target: "_concepts/falco"
    type: implemented_by
  - target: "_concepts/policy-as-code"
    type: complementary
  - target: "_concepts/observability"
    type: related_to
sources:
  - _concepts/falco.md
summary: "Runtime Security（运行时安全）通过监控运行时行为（系统调用、网络、文件访问）检测威胁；Falco 是 CNCF 毕业项目，用 eBPF/Kernel Module 捕获异常行为并告警，是云原生运行时安全的代表。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-06-24
---

# Runtime Security（运行时安全）

## 核心要点

- **目标**：检测运行时异常行为（容器逃逸、挖矿、横向移动、数据外泄）。
- **核心机制**：
  - **eBPF**：Linux 内核级观测，无侵入
  - **系统调用监控**：execve / open / connect
  - **行为基线**：学习正常流量，偏离即告警
  - **规则引擎**：YAML 规则声明异常模式
- **主流工具**：

| 工具 | 提供方 | 强项 |
|------|--------|------|
| **Falco** | CNCF 毕业 | eBPF/Kmod，规则丰富 |
| **Tetragon** | Cilium | eBPF + 内核级阻断 |
| **Tracee** | Aqua Security | eBPF 开源运行时 |
| **Sysdig Secure** | Sysdig | 商业 SaaS |
| **Aqua Enterprise** | Aqua | 商业 + 开源组合 |

## 一句话解释

> Runtime Security = "盯着容器内部在干啥"，通过 eBPF/系统调用抓异常行为；和 Policy as Code（静态拦截）互补。

## 与 Policy as Code 的分工

```
请求进入 K8s API
├── Policy as Code（拦截）→ 拒绝 / 允许
└── 通过 → 容器开始运行
            └── Runtime Security（监控）→ 异常检测
                  ├── 异常 → 告警 / 阻断
                  └── 正常 → 继续观察
```

## Falco 规则示例

```yaml
- rule: Detect Crypto Mining
  desc: Detect cryptocurrency mining process execution
  condition: >
    spawned_process and container and
    proc.name in (xmrig, minerd, minergate)
  output: >
    Crypto mining detected
    (user=%user.name command=%proc.cmdline container=%container.name)
  priority: CRITICAL
  tags: [cryptomining, mitre_T1496]

- rule: Container Drift Detected
  desc: New process spawned in container (drift detection)
  condition: >
    spawned_process and container and
    not proc.name in (allowed_processes)
  output: >
    Unexpected process in container
    (proc=%proc.name container=%container.name image=%container.image.repository)
  priority: WARNING
```

## 在 AI 系统中的角色

- **Agent 工具调用审计**：哪些 API 被实际调用、参数是什么
- **数据外泄检测**：敏感数据是否被异常外发
- **模型权重保护**：防止模型文件被未授权读取
- **GPU 资源滥用**：检测异常的训练/推理任务
- **MCP Server 异常行为**：检测异常工具调用模式

## 何时使用

✅ **推荐**：
- 多租户 K8s 集群（强合规需求）
- 金融/医疗/政府场景
- AI Agent 生产环境（防止 Agent 滥用）
- 大模型推理服务（防止权重泄露）

⚠️ **不推荐**：
- 个人开发环境（开销过大）
- 单租户小型集群

## Related

- [[_concepts/falco]] — Falco（CNCF 毕业项目）
- [[_concepts/policy-as-code]] — Policy as Code
- [[_concepts/observability]] — 可观测性
- [[17_Ethics_Safety/README|17_Ethics_Safety]] — 安全章节