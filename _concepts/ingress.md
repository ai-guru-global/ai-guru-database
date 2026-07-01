---
title: "Ingress"
category: -concepts
tags: ["kubernetes", "k8s", "networking", "cloud-native", "alibaba-cloud"]
summary: "Kubernetes Ingress 是集群七层（HTTP/HTTPS）流量入口的声明式 API，用于将外部请求按域名、路径路由到内部 Service，常与 Ingress Controller 配合使用。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Ingress"
  - "K8s Ingress"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/kubectl"
    type: related_to
  - target: "_concepts/helm"
    type: part_of
---

# Ingress

> **一句话理解**: Ingress 是 Kubernetes 集群的「大门」——把外部 HTTP/HTTPS 流量按域名和路径转发到集群内部 Service。

## 核心要点

- **七层入口**: Ingress 只描述路由规则，不直接处理流量；真正转发由 Ingress Controller（如 NGINX、Traefik）完成。
- **声明式 API**: 通过 YAML 定义主机、路径、TLS、重写等规则，kube-apiserver 持久化后 Controller 自动生效。
- **依赖 Service**: Ingress 后端 target 必须是 Service，不能直接指向 Pod；Service 再负责负载均衡到 Pod。
- **Controller 生态**: 常见实现有 NGINX Ingress Controller、Traefik、HAProxy、ALB Ingress Controller（阿里云）等。
- **安全能力**: 支持 TLS/SSL 终止、basic auth、速率限制、WAF 集成，通常配合 Secret 与 cert-manager 使用。
- **与 LoadBalancer Service 区别**: Service LoadBalancer 提供四层（TCP/UDP）入口，Ingress 提供七层（HTTP/HTTPS）路由与域名管理。

## 典型 YAML / 命令示例

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ai-app-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - ai.example.com
    secretName: ai-tls-secret
  rules:
  - host: ai.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: ai-api-svc
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ai-web-svc
            port:
              number: 80
```

```bash
# 部署 Ingress
kubectl apply -f ingress.yaml

# 查看 Ingress 规则与地址
kubectl get ingress
kubectl describe ingress ai-app-ingress

# 调试后端 Service 是否可达
kubectl get svc -n default
```

## 常见场景

| 场景 | 方案 | 说明 |
|------|------|------|
| 单域名多服务 | 按路径路由 `/api` → `api-svc`，`/` → `web-svc` | 最常用，可节省公网 IP |
| HTTPS 终止 | `spec.tls` + `Secret` | 在 Ingress Controller 处卸载 TLS |
| 灰度发布 | 基于权重的 Ingress Controller 注解 | 配合 Canary 发布流量切分 |
| 限流 / 白名单 | `nginx.ingress.kubernetes.io/limit-rps` 等 | 在入口层做访问控制 |
| 多租户隔离 | 不同 namespace 使用独立 Ingress + Controller | 避免配置互相影响 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）ACK 专有版 / 敏捷版中，Ingress 能力通常由自研或开源 Ingress Controller 提供，可与洛神（Luoshen）网络、SLB 负载均衡及 ASCM 统一运维平台联动。专有云环境需关注 Ingress Controller 与 SLB 监听的对接、TLS 证书在 Secret 中的托管，以及通过 Tianji 进行故障定位与日志回溯。

## Related

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排
- [[_concepts/kubectl|kubectl]] — K8s 命令行工具
- [[_concepts/helm|Helm]] — K8s 包管理
- [[_concepts/cri|CRI]] — 容器运行时接口
- [[_concepts/containerd|containerd]] — 容器运行时
