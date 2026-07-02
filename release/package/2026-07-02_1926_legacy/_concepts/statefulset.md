---
title: "StatefulSet"
category: -concepts
tags: ["kubernetes", "k8s", "statefulset", "stateful-app", "cloud-native", "alibaba-cloud"]
summary: "StatefulSet 是 Kubernetes 中用于管理有状态应用的工作负载控制器，为 Pod 提供稳定网络标识、有序部署和持久化存储，适用于数据库、消息队列等需要稳定身份的场景。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "StatefulSet"
  - "K8s StatefulSet"
  - "有状态集"
relationships:
  - target: "_concepts/kubernetes"
    type: related_to
  - target: "_concepts/deployment"
    type: related_to
  - target: "_concepts/pod"
    type: part_of
  - target: "_concepts/service"
    type: related_to
---

# StatefulSet

> **一句话理解**: StatefulSet 是 Kubernetes 里给有状态应用「发身份证」的控制器——每个 Pod 都有固定名字、固定网络标识和专属存储，重启后还能找回自己。

## 核心要点

- **有状态工作负载控制器**: 与 Deployment 不同，StatefulSet 管理的是需要稳定身份和持久状态的应用，如 MySQL、Kafka、ZooKeeper、Redis Sentinel、etcd 等。
- **稳定网络标识**: 每个 Pod 拥有按序编号且固定的 hostname（如 `web-0`、`web-1`），并通过 Headless Service 提供稳定的 DNS 名称（如 `web-0.nginx.default.svc.cluster.local`）。
- **有序部署与扩缩容**: Pod 按序号顺序创建（0 → 1 → 2），缩容时逆序删除（2 → 1 → 0），滚动更新也遵循此顺序，便于主从架构安全切换。
- **持久化存储绑定**: 通过 `volumeClaimTemplates` 为每个 Pod 自动创建并绑定独立的 PVC，Pod 被重新调度后仍能挂载原来的 PersistentVolume。
- **删除策略需谨慎**: 默认级联删除会同时删除 Pod 和 PVC，生产环境操作前务必确认数据备份或保留策略，避免误删数据。
- **与 Deployment 的取舍**: 无状态、可互换的应用优先用 Deployment；需要固定身份、独立存储、有序启动/停止的应用才用 StatefulSet。

## 典型 YAML / 命令示例

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: default
spec:
  serviceName: mysql-headless
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8.0
          ports:
            - containerPort: 3306
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysql-secret
                  key: password
          volumeMounts:
            - name: data
              mountPath: /var/lib/mysql
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 20Gi
```

```bash
# 查看 StatefulSet 及 Pod 序号
kubectl get statefulset mysql
kubectl get pods -l app=mysql

# 查看某个 Pod 的固定网络标识
kubectl exec -it mysql-0 -- hostname
# 输出: mysql-0

# 缩容（按逆序删除）
kubectl scale statefulset mysql --replicas=1

# 查看 PVC 与 Pod 的绑定关系
kubectl get pvc -l app=mysql
```

## 选型对比

| 维度 | StatefulSet | Deployment |
|------|-------------|------------|
| **Pod 身份** | 固定、有序编号（如 `name-0`） | 随机、无固定标识 |
| **网络标识** | 通过 Headless Service 提供稳定 DNS | 通过 ClusterIP Service 负载均衡 |
| **存储** | 每个 Pod 独立 PVC，可持久保留 | 多个 Pod 通常共享或无需持久存储 |
| **启动/停止顺序** | 有序创建、逆序删除 | 并行、无序 |
| **典型场景** | 数据库、消息队列、分布式协调服务 | Web 服务、API、推理服务、无状态应用 |
| **运维复杂度** | 较高，需要关注脑裂、选主、数据一致性 | 较低，水平扩展简单 |

## 阿里云专有云关联

在阿里云专有云（Apsara Stack）的 ACK 专有版 / 敏捷版中，StatefulSet 常用于部署 MySQL、PostgreSQL、RocketMQ、Kafka、ZooKeeper 等有状态中间件。由于专有云中存储后端通常对接盘古分布式存储或企业自有的 SAN/NAS，创建 `StorageClass` 后，StatefulSet 的 `volumeClaimTemplates` 即可自动申请持久卷。运维人员在处理 ACK 工单时，需特别注意 Pod 漂移后的存储挂载一致性、Headless Service 的 DNS 解析，以及缩容或删除 StatefulSet 时的 PVC 保留策略，避免客户数据误删。

## Related

- [[_concepts/kubernetes|Kubernetes]] — K8s 编排平台
- [[_concepts/deployment|Deployment]] — 无状态工作负载控制器
- [[_concepts/pod|Pod]] — K8s 最小调度单元
- [[_concepts/service|Service]] — K8s 服务发现
- [[_concepts/secret|Secret]] — 敏感配置管理
- [[_concepts/helm|Helm]] — K8s 应用包管理
