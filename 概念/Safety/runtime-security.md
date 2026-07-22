---
title: "Runtime Security（运行时安全）"
category: -concepts
tags: [runtime-security, falco, ebpf, kubernetes, threat-detection, observability]
aliases:
  - "Runtime Security"
  - "运行时安全"
  - "Runtime Threat Detection"
relationships:
  - target: "概念/falco"
    type: implemented_by
  - target: "概念/policy-as-code"
    type: complementary
  - target: "概念/observability"
    type: related_to
sources:
  - 概念/falco.md
summary: "Runtime Security（运行时安全）通过监控运行时行为（系统调用、网络、文件访问）检测威胁；Falco 是 CNCF 毕业项目，用 eBPF/Kernel Module 捕获异常行为并告警，是云原生运行时安全的代表。"
lifecycle: reviewed
tier: core
provenance:
  extracted: 0.80
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.85
created: 2026-06-24
updated: 2026-07-21
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

- [[概念/falco]] — Falco（CNCF 毕业项目）
- [[概念/policy-as-code]] — Policy as Code
- [[概念/observability]] — 可观测性
- [[伦理安全/README|伦理安全]] — 安全章节

---

## 2026 运行时安全生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Falco** | CNCF 毕业项目，运行时威胁检测 | GA |
| **Tetragon** | eBPF 运行时安全 | GA |
| **Tracee** | eBPF 安全监控 | GA |
| **KubeArmor** | 容器运行时防护 | GA |
| **Runtime Class** | K8s 运行时类隔离 | GA |

## 生产最佳实践

1. **运行时监控**：用 Falco/Tetragon 监控运行时行为
2. **eBPF 优势**：eBPF 工具性能开销低，适合生产
3. **基线检测**：建立正常行为基线，检测异常
4. **自动响应**：检测到威胁自动响应（隔离/告警）
5. **与 SIEM 集成**：安全事件集成到 SIEM 系统

## 运行时安全架构图

```
运行时安全架构:
┌─────────────────────────────────────────┐
│  数据采集层: eBPF / Kernel Module       │
├─────────────────────────────────────────┤
│  规则引擎: YAML 规则 + 行为基线       │
├─────────────────────────────────────────┤
│  检测分析: 异常检测 + 威胁情报        │
├─────────────────────────────────────────┤
│  响应层: 告警 / 阻断 / 隔离           │
├─────────────────────────────────────────┤
│  集成层: SIEM / SOAR / Slack          │
└─────────────────────────────────────────┘
```

## Tetragon 策略示例

```yaml
apiVersion: cilium.io/v1alpha1
kind: TracingPolicy
metadata:
  name: monitor-sensitive-files
spec:
  kprobes:
  - call: "fd_install"
    syscall: false
    args:
    - index: 1
      type: "file"
    selectors:
    - matchArgs:
      - index: 1
        operator: "Equal"
        values:
        - "/etc/shadow"
        - "/etc/passwd"
        - "/root/.ssh/*"
```

## AI 系统运行时安全

| 场景 | 监控点 | 告警条件 |
|------|--------|----------|
| **模型推理** | 文件访问 | 读取模型权重文件 |
| **Agent 工具** | 系统调用 | 异常 execve/connect |
| **数据管道** | 网络流量 | 异常数据外发 |
| **GPU 资源** | 进程行为 | 异常训练任务 |

## 延伸阅读

- [[概念/Safety/container-security|容器安全]] — 容器镜像与编排安全
- [[概念/Safety/supply-chain-security|供应链安全]] — 软件供应链安全
- [[概念/Safety/model-security|模型安全]] — AI 模型保护
- [[概念/K8s/kubernetes|Kubernetes]] — 容器编排基础

> ℹ️ 运行时安全是最后一道防线，与 Policy as Code 互补，实现全链路安全防护。
> 生产环境建议部署 Falco/Tetragon，并配置自动响应策略。
> AI Agent 系统需特别监控工具调用行为，防止 Agent 被对抗攻击利用。
> 定期审查和更新检测规则，跟踪最新威胁情报。
> eBPF 工具性能开销低，适合生产环境大规模部署。
> 多租户环境必须启用运行时监控，防止横向移动和数据泄露。
> 安全事件应集成到 SIEM/SOAR 系统，实现自动化响应。
> 金融/医疗/政府等合规场景必须部署运行时安全监控。