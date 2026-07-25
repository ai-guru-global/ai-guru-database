---
title: "Chaos Engineering"
category: -concepts
tags: ["sre", "reliability", "chaos-engineering", "resilience", "alibaba-cloud"]
summary: "Chaos Engineering（混沌工程）是通过在生产环境中主动注入故障，验证系统韧性和恢复能力的工程实践。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "混沌工程"
  - "Resilience Engineering"
relationships:
  - target: "概念/sre"
    type: part_of
  - target: "概念/incident-response"
    type: related_to
sources: []
---

# Chaos Engineering

> **一句话理解**: 混沌工程就是「主动搞破坏」来验证系统能不能扛住故障，而不是等真出事才发现问题。

## 核心要点

- **稳态假设**: 先定义系统正常行为
- **故障注入**: 网络延迟、Pod 删除、节点宕机、依赖故障
- **真实环境**: 最好在类生产环境执行
- **最小爆炸半径**: 控制影响范围
- **自动恢复**: 验证系统自愈能力

## 常见实验

| 实验 | 目标 |
|------|------|
| Pod 删除 | 验证副本自愈 |
| 网络延迟 | 验证超时与重试 |
| 节点宕机 | 验证调度与数据持久化 |
| 依赖故障 | 验证降级策略 |
| 资源耗尽 | 验证限流与扩容 |

## 工具

- Chaos Mesh
- Litmus
- Gremlin
- PowerfulSeal

## 阿里云专有云关联

在阿里云专有云环境中，可在 ACK 测试集群使用 Chaos Mesh 对 AI 训练/推理服务进行故障演练。

## Related

- [[概念/resilience|Resilience]]
- [[概念/incident-response|Incident Response]]
- [[13_运维/02_SRE_Reliability/Chaos_Engineering_for_AI_Systems|AI 系统混沌工程]]

---

## 2026 混沌工程生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Chaos Mesh** | K8s 原生混沌工程 | GA |
| **Litmus** | K8s 混沌工程 | GA |
| **Gremlin** | 企业级混沌工程 | GA |
| **故障注入** | 网络/Pod/节点故障注入 | GA |
| **AI 系统混沌** | AI 系统韧性测试 | 研究 |

## 生产最佳实践

1. **定期演练**：定期进行混沌工程演练
2. **生产环境**：在生产环境进行混沌工程
3. **自动化**：混沌工程自动化执行
4. **AI 系统**：AI 系统也要混沌工程
5. **事后复盘**：演练后复盘改进

## 混沌工程原则

| 原则 | 说明 | 实践 |
|------|------|------|
| 稳态假设 | 定义正常行为 | 监控指标基线 |
| 真实事件 | 模拟真实故障 | 网络/Pod/节点故障 |
| 生产环境 | 在真实环境执行 | 类生产环境 |
| 最小爆炸 | 控制影响范围 | 限制故障范围 |
| 自动化 | 持续自动执行 | CI/CD 集成 |

## 配置示例

```yaml
# Chaos Mesh Pod 删除实验
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: kill-inference-pod
spec:
  action: pod-kill
  mode: one
  selector:
    namespaces:
      - ai-inference
    labelSelectors:
      app: llm-inference
  scheduler:
    cron: "0 */6 * * *"  # 每 6 小时执行一次
---
# 网络延迟实验
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: delay-inference-network
spec:
  action: delay
  mode: all
  selector:
    namespaces:
      - ai-inference
  delay:
    latency: "500ms"
    jitter: "100ms"
  duration: "60s"
```

## AI 系统混沌工程场景

| 场景 | 故障类型 | 验证目标 |
|------|----------|----------|
| GPU 故障 | 节点 GPU 不可用 | 自动转移 + 恢复 |
| 模型加载失败 | 存储不可用 | 降级 + 告警 |
| 推理超时 | 网络延迟 | 超时 + 重试 |
| OOM | 内存耗尽 | 自动重启 + 限流 |
| 依赖服务故障 | 下游不可用 | 熔断 + 降级 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 演练影响生产 | 爆炸半径过大 | 限制故障范围 |
| 团队抵触 | 担心影响业务 | 从测试环境开始 |
| 缺乏自动化 | 手动执行 | CI/CD 集成 |
| 结果不清晰 | 缺乏指标 | 定义稳态假设 |

## 相关概念

- [[概念/General/resilience|Resilience]] — 系统韧性
- [[概念/incident-response|Incident Response]] — 事故响应
- [[概念/General/sre|SRE]] — 站点可靠性工程
- [[概念/error-budget|Error Budget]] — 错误预算

## 总结

混沌工程是通过在生产环境中主动注入故障，验证系统韧性和恢复能力的工程实践。在 AI 系统中用于验证 GPU 故障、模型加载失败和推理超时等场景的应对能力。

---

> 💡 混沌工程就是「主动搞破坏」来验证系统能不能抗住故障，而不是等真出事才发现问题。

## 工具对比

| 工具 | 定位 | 特点 | 适用场景 |
|------|------|------|----------|
| **Chaos Mesh** | K8s 原生 | CNCF、CRD 驱动 | K8s 环境 |
| **Litmus** | K8s 混沌 | 实验市场 | K8s 环境 |
| **Gremlin** | 企业级 | 安全、合规 | 企业生产 |
| **PowerfulSeal** | K8s 专用 | 场景化 | K8s 集群 |
| **Toxiproxy** | 网络故障 | 代理模式 | 依赖服务故障 |

## 混沌工程成熟度

| 级别 | 特征 | 典型表现 |
|------|------|----------|
| L1 手动 | 手动注入故障 | 偶尔测试 |
| L2 定期 | 定期演练 | 季度演练 |
| L3 自动化 | CI/CD 集成 | 自动执行 |
| L4 持续 | 持续混沌 | 生产环境持续注入 |
| L5 智能 | AI 驱动 | 自动发现弱点 |

## 演练工作流

```
1. 定义稳态 → 2. 设计实验 → 3. 执行注入
       ↓                              ↓
4. 观察影响 → 5. 分析结果 → 6. 改进修复 → 7. 复盘报告
```

## 版本兼容性

| 工具 | 版本 | 状态 |
|------|------|------|
| Chaos Mesh | 2.7+ | 稳定 |
| Litmus | 3.15+ | 稳定 |
| Gremlin | SaaS | GA |

## 相关概念

- [[概念/resilience|Resilience]] — 系统韧性设计
- [[概念/sre|SRE]] — 站点可靠性工程
- [[概念/incident-response|Incident Response]] — 事故响应

> 💡 混沌工程的核心价值是将“被动救火”转变为“主动验证”，让团队对故障有预期、有预案、有信心。

