---
title: "Fluent Bit"
category: -concepts
tags: ["kubernetes", "k8s", "observability", "logging", "fluentd", "cloud-native", "alibaba-cloud"]
summary: "Fluent Bit 是 CNCF 孵化的轻量级日志处理器和转发器，资源占用极低，是 Kubernetes 场景下替代 Fluentd 的主流日志 Agent。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "FluentBit"
  - "日志采集 Agent"
relationships:
  - target: "_concepts/loki"
    type: related_to
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/opentelemetry"
    type: related_to
sources: []
---

# Fluent Bit

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

- [[_concepts/loki|Loki]] — 日志聚合后端
- [[_concepts/opentelemetry|OpenTelemetry]] — 统一可观测性
- [[_concepts/kubernetes|Kubernetes]] — 容器编排
- [[12_Architecture_Infrastructure/Kubernetes_Observability_Stack|Kubernetes 可观测性栈]]
