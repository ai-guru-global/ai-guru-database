---
title: "Fluent Bit"
category: -concepts
tags: ["kubernetes", "k8s", "observability", "logging", "fluentd", "cloud-native", "alibaba-cloud"]
summary: "Fluent Bit 是 CNCF 孵化的轻量级日志处理器和转发器，资源占用极低，是 Kubernetes 场景下替代 Fluentd 的主流日志 Agent。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "FluentBit"
  - "日志采集 Agent"
relationships:
  - target: "概念/loki"
    type: related_to
  - target: "概念/kubernetes"
    type: related_to
  - target: "概念/opentelemetry"
    type: related_to
sources: []
name_zh: "轻量日志转发器"
---

# Fluent Bit

> 中文简称：轻量日志转发器

> **一句话理解**: Fluent Bit 是 Kubernetes 上最常用的轻量日志「搬运工」，以 DaemonSet 跑在每个节点上，把容器日志收集并转发到 Loki/ES/Kafka/SLS 等后端。

## 核心要点

- **资源占用低**: 相比 Fluentd，内存占用仅几 MB，适合大规模节点部署。
- **以 DaemonSet 部署**: 每个节点一个 Pod，读取 `/var/log/containers` 下的日志文件。
- **强大的解析能力**: 支持 JSON、Regex、LTSV、Multiline 等解析器。
- **丰富的输出插件**: Loki、Elasticsearch、Kafka、OpenTelemetry、阿里云 SLS 等。
- **可过滤与修改**: 支持 Kubernetes 元数据注入、日志级别提取、字段增删改。

## 典型配置

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
data:
  fluent-bit.conf: |
    [INPUT]
        Name              tail
        Tag               kube.*
        Path              /var/log/containers/*.log
        Parser            docker
        DB                /var/log/flb_kube.db

    [FILTER]
        Name              kubernetes
        Match             kube.*
        Kube_URL          https://kubernetes.default.svc:443
        Merge_Log         On
        Keep_Log          Off

    [OUTPUT]
        Name              loki
        Match             *
        Host              loki.monitoring.svc.cluster.local
        Labels            job=fluentbit, namespace=$kubernetes['namespace_name'], pod=$kubernetes['pod_name']
```

## 选型对比

| 方案 | 资源 | 解析能力 | 典型场景 |
|------|------|---------|---------|
| **Fluent Bit** | 极低 | 强 | K8s 节点日志采集 |
| **Fluentd** | 较高 | 极强 | 复杂日志处理网关 |
| **Vector** | 低 | 强 | 新兴替代方案 |

## 阿里云专有云关联

在阿里云专有云环境中，Fluent Bit 常与 Loki 或阿里云 SLS 私有化版本配合，作为 ACK 集群的日志采集层。工单中遇到「Pod 日志没进日志系统」时，常需检查 Fluent Bit DaemonSet 是否 Running、ConfigMap 输出目标是否可达、节点 /var/log/containers 挂载是否正常。

## Related

- [[概念/loki|Loki]] — 日志聚合后端
- [[概念/opentelemetry|OpenTelemetry]] — 统一可观测性
- [[概念/kubernetes|Kubernetes]] — 容器编排
- [[12_架构基建/04_Kubernetes核心/03_Kubernetes_可观测性_Stack|Kubernetes 可观测性栈]]

---

## 2026 Fluent Bit 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Fluent Bit** | 轻量级日志采集器 | GA |
| **K8s DaemonSet** | K8s 日志采集 | GA |
| **多输出** | 支持多种输出后端 | GA |
| **与 Loki 配合** | Fluent Bit + Loki | GA |
| **与 OpenTelemetry 配合** | Fluent Bit + OTel | GA |

## 生产最佳实践

1. **日志采集**：K8s 日志用 Fluent Bit 采集
2. **轻量级**：Fluent Bit 比 Fluentd 更轻量
3. **与 Loki 配合**：Fluent Bit + Loki 日志栈
4. **资源限制**：配置 Fluent Bit 资源限制
5. **过滤规则**：配置日志过滤规则

## AI/LLM 场景日志采集

| 场景 | 采集内容 | 输出目标 |
|------|----------|----------|
| **vLLM 推理** | 请求日志、延迟、错误 | Loki + Prometheus |
| **训练任务** | loss、梯度、异常 | Kafka → 分析平台 |
| **Agent 执行** | 工具调用、步骤日志 | OpenTelemetry |
| **数据管道** | ETL 状态、异常 | Elasticsearch |

## 高级过滤配置

```yaml
# 过滤敏感信息 + 添加元数据
[FILTER]
    Name              modify
    Match             kube.*
    Remove            password
    Remove            api_key
    Add               cluster prod-cluster-01
    Add               env production

[FILTER]
    Name              grep
    Match             kube.*
    Exclude           log ^DEBUG

[FILTER]
    Name              throttle
    Match             kube.*
    Rate              1000
    Window            60
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 日志丢失 | 缓冲溢出/节点重启 | 增大 Mem_Buf_Limit + 启用 WAL |
| CPU 占用高 | 日志量过大/正则复杂 | 简化解析、增加资源 |
| 输出失败 | 后端不可达 | 配置 Retry_Limit + 备用输出 |
| Pod 重启后日志重复 | DB 文件丢失 | 持久化 DB 到 PVC |
| 多行日志截断 | 未配置 multiline | 启用 multiline.parser |

## 版本兼容性

| 组件 | 推荐版本 | 说明 |
|------|----------|------|
| Fluent Bit | 3.x | 最新稳定版 |
| Kubernetes | 1.28+ | 部署平台 |
| Loki | 3.x | 日志后端 |
| OpenTelemetry | 1.25+ | 遥测输出 |
| Helm Chart | 0.47+ | 部署工具 |

## 生产检查清单

1. 配置资源限制（CPU 200m / Memory 256Mi）
2. 启用 DB 持久化防止重启后日志重复
3. 配置 Retry_Limit 和备用输出防止数据丢失
4. 过滤敏感字段（password、api_key）
5. 设置日志采样率控制存储成本
6. 监控 Fluent Bit 自身指标（input/output bytes）

## 总结

Fluent Bit 是 Kubernetes 日志采集的事实标准，以极低的资源占用提供强大的日志收集、解析、过滤和转发能力。在 AI/LLM 场景中，它是推理服务、训练任务、Agent 执行日志的统一采集层。

> 💡 Fluent Bit 的核心价值：以 DaemonSet 形式跑在每个节点，内存仅占几 MB，却能处理 GB 级日志流量——是云原生日志管道的“最后一公里”。

## Fluent Bit 配置示例

```yaml
# K8s DaemonSet 配置 - AI 推理服务日志采集
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
data:
  fluent-bit.conf: |
    [INPUT]
        Name              tail
        Path              /var/log/containers/inference-*.log
        Parser            json
        Tag               inference.*
        Refresh_Interval  5
    [FILTER]
        Name              grep
        Match             inference.*
        Exclude           level debug
    [OUTPUT]
        Name              loki
        Match             *
        Host              loki-gateway.monitoring
        Port              3100
        Labels            job=fluentbit, app=$kubernetes['labels']['app']
```

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 日志丢失 | 缓冲溢出 | 增大 Mem_Buf_Limit |
| CPU 占用高 | 解析规则复杂 | 简化 Parser + 采样 |
| 背压严重 | 输出端慢 | 增加重试 + 备用输出 |
| Pod 重启丢日志 | 未持久化缓冲 | 配置 storage.type filesystem |

## 生产检查清单

1. ✅ 以 DaemonSet 部署，每节点一个实例
2. ✅ 配置资源限制（memory: 64Mi）
3. ✅ 启用文件系统缓冲防丢失
4. ✅ 与 Loki/ES 输出端集成
5. ✅ 监控 Fluent Bit 自身指标
6. ✅ 定期更新解析规则适应新服务

## 总结

Fluent Bit 是云原生日志采集的事实标准，2026 年已成为 K8s 环境 AI 服务日志管道的核心组件。其轻量、高性能和插件化架构使其成为 Loki/ES 等日志后端的最佳采集器。

> 💡 Fluent Bit 的核心哲学：“轻量、可靠、无处不在”——每个节点一个 DaemonSet，日志采集零侵入。
