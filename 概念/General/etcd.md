---
title: "etcd"
category: -concepts
tags: ["etcd", "distributed-database", "key-value", "kubernetes", "consensus", "raft", "cncf"]
relationships:
  - target: "概念/kubernetes"
    type: used_by
  - target: "概念/consensus"
    type: implements
  - target: "概念/distributed-systems"
    type: extends
sources:
  - 架构基建/Architecture_Overview/AI_Infrastructure_2026
summary: "etcd 是 CNCF Graduated 的分布式键值存储，使用 Raft 共识算法，是 Kubernetes 的元数据存储后端，也广泛用于服务发现、配置管理和分布式锁。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-06-16
aliases:
  - Etcd

---
# etcd

> 分布式系统的「共享笔记本」——高可用、强一致的键值存储，K8s 的配置就靠它。

---

## 1. 一句话定义

**etcd** 是 CNCF Graduated 的**分布式键值存储**，使用 **Raft 共识算法**保证一致性和高可用。它是 Kubernetes 的元数据存储后端，保存所有集群状态、配置和资源对象，也广泛用于服务发现、配置中心和分布式锁。

---

## 2. 核心能力

| 能力 | 说明 |
|------|------|
| **键值存储** | 扁平的键值对存储 |
| **强一致性** | Raft 共识保证线性一致性 |
| **Watch 机制** | 监听键变化，实现事件驱动 |
| **TTL** | 键值过期机制 |
| **事务** | 支持多键原子操作 |
| **高可用** | 通常 3/5 节点集群部署 |

---

## 3. 典型场景

1. **Kubernetes 元数据存储**：Pod、Service、Deployment 等所有资源对象。
2. **服务发现**：注册和发现服务实例。
3. **配置中心**：动态配置下发。
4. **Leader 选举**：分布式组件选主。
5. **分布式锁**：协调分布式任务。

---

## 4. 与相关技术的关系

| 技术 | 关系 |
|------|------|
| **Kubernetes** | etcd 是 K8s 的大脑 |
| **ZooKeeper** | 功能类似的分布式协调服务 |
| **Consul** | 服务发现 + KV 存储 |
| **Raft** | etcd 使用的共识算法 |

---

## 5. 常用命令

```bash
# 查看成员
etcdctl member list

# 读取键值
etcdctl get /registry/pods/default/my-pod

# 备份
etcdctl snapshot save backup.db
```

---

## Related

- [[概念/kubernetes]] — Kubernetes
- [[概念/distributed-systems]] — 分布式系统
- [[概念/consensus]] — 共识算法
- [[架构基建/Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施 2026
