---
title: "Network Policy"
category: -concepts
tags: ["kubernetes", "k8s", "network-policy", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes Network Policy 用于在 Pod 级别定义入站/出站流量规则，实现零信任网络分段，是集群东西向流量安全的核心控制手段。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Network Policy"
  - "网络策略"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/pod"
    type: related_to
  - target: "_concepts/service"
    type: part_of
sources: []
---

# Network Policy

> **一句话理解**: Network Policy 是 K8s 的「Pod 级防火墙」，通过标签选择 Pod 并决定谁能访问谁，默认不隔离、声明即生效。

## 核心要点

- **作用范围**: 以 Namespace 为边界，使用 `podSelector` / `namespaceSelector` 匹配目标 Pod 和来源/目标端点。
- **方向控制**: 分 `ingress`（入站）和 `egress`（出站），可单独或同时定义；未匹配到的流量默认放行，除非显式拒绝规则存在。
- **依赖 CNI**: 规则本身只是声明，真正生效需要 CNI 插件支持，如 Calico、Cilium、Flannel（部分版本）或 Terway。
- **默认宽松**: 没有 Network Policy 时所有 Pod 互通；创建第一条 Policy 后，该 Pod 只接受 Policy 允许的流量。
- **关键字段**: `policyTypes` 声明方向，`ports` 限定协议端口，`from`/`to` 限定来源/目标，支持 IPBlock、podSelector、namespaceSelector 三种选择器。

## 典型 YAML / 命令示例

### 仅允许同 namespace 的 frontend Pod 访问 backend 的 8080 端口

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-allow-frontend
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080
```

### 允许 monitoring namespace 的 Pod 访问任意 Pod 的 9090 端口

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-monitoring
  namespace: default
spec:
  podSelector: {}
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: monitoring
      ports:
        - protocol: TCP
          port: 9090
```

### 常用命令

```bash
# 列出所有 NetworkPolicy
kubectl get networkpolicy -A

# 查看规则详情
kubectl describe networkpolicy backend-allow-frontend -n default

# 验证 Pod 标签是否匹配选择器
kubectl get pods -n default -l app=backend --show-labels
```

## 常见场景

| 场景 | 推荐做法 | 注意事项 |
|------|----------|----------|
| **微服务东西向隔离** | 每个服务只暴露必要的端口和来源标签 | 先梳理服务依赖，避免误拦截 |
| **多租户环境隔离** | 按 Namespace 划分默认拒绝规则，仅放行白名单 | 配合 RBAC 防止租户越权修改 |
| **数据库访问收敛** | 仅允许 app Pod 访问 db Pod 的 3306/5432 | 同时限制 egress，防止数据外带 |
| **Ingress/Egress 统一管控** | 默认 deny-all，再按需开放 | 需确认 CNI 已启用 NetworkPolicy 引擎 |
| **运维/监控流量放行** | 通过 namespaceSelector 放行监控、日志采集 | 注意 `kube-system` DNS 也要放行 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 集群中，Network Policy 的能力由 CNI 插件提供。ACK 敏捷版/专有云版通常基于 Calico 或自研 Terway 网络方案实现策略下发；如果工单中出现「Pod 能 ping 通但服务无法访问」或「跨 namespace 访问被阻断」，应首先检查目标 Namespace 是否新建了 NetworkPolicy、CNI 后端是否启用了策略控制器，以及 `kube-system`/`kube-public` 等系统命名空间的 DNS 和管控流量是否被误拦截。对于 Luoshen/Tianji 等底层网络底座，策略最终通过节点上的 iptables/eBPF 规则落地。

## Related

- [[_concepts/kubernetes|Kubernetes]] — 编排平台
- [[_concepts/pod|Pod]] — NetworkPolicy 作用的最小单元
- [[_concepts/service|Service]] — 与 NetworkPolicy 共同构成服务网络边界
- [[_concepts/namespace|Namespace]] — NetworkPolicy 的默认隔离边界
- [[_concepts/rbac|RBAC]] — 防止未授权用户修改网络策略
