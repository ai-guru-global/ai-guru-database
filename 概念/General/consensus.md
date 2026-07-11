---
title: "Consensus Algorithm（共识算法）"
category: -concepts
tags: [consensus, raft, paxos, etcd, distributed-systems, blockchain]
aliases:
  - "Consensus"
  - "Consensus Algorithm"
  - "共识算法"
relationships:
  - target: "概念/etcd"
    type: used_by
  - target: "概念/distributed-systems"
    type: belongs_to
sources:
  - 概念/etcd.md
summary: "Consensus（共识）算法让分布式系统中的多个节点就某个值达成一致；常见实现包括 Raft（etcd/Consul 用）、Paxos、PBFT 等；etcd 是 K8s 用 Raft 实现强一致 KV 存储的代表。"
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

# Consensus Algorithm（共识算法）

## 核心要点

- **目标**：在部分节点故障、网络分区的情况下，仍让集群多数节点对某个值达成一致。
- **经典算法**：
  - **Paxos**（Lamport 1998）— 理论奠基，难理解难实现
  - **Raft**（Ongaro 2014）— 工程友好（etcd / Consul / TiKV 用）
  - **PBFT**（Practical Byzantine Fault Tolerance）— 容忍恶意节点（联盟链）
  - **PoW / PoS** — 区块链大规模共识
- **CAP 三角**：Consistency / Availability / Partition tolerance 通常只能三选二
- **应用场景**：
  - 分布式 KV 存储（etcd / Consul）
  - 数据库主从选举（PostgreSQL / MongoDB）
  - 服务发现（K8s 用 etcd）
  - 消息队列（Kafka 用 ISR）

## 一句话解释

> Consensus = "多数人同意才算数"；在分布式系统中让 5 个节点即使 2 个挂了也能给出一致答案。

## Raft 三个子问题

```
Leader Election（选主）
  → 节点启动或 Leader 故障时通过超时选举新 Leader
Log Replication（日志复制）
  → Leader 接收写入 → 复制到多数节点 → 提交
Safety（安全性）
  → 已提交的日志不会被覆盖
```

## 主流实现

| 系统 | 共识算法 | 场景 |
|------|---------|------|
| **etcd** | Raft | K8s 配置与服务发现 |
| **Consul** | Raft | 服务发现 + 健康检查 |
| **TiKV** | Raft | 分布式 NewSQL |
| **CockroachDB** | Raft | 分布式 SQL |
| **Kafka** | ISR（类 Raft） | 消息队列 |
| **PostgreSQL**（Citus） | Raft | 分布式 PG |

## 与 CAP 的关系

```
                 Consistency
                     ▲
                    / \
                   /   \
                  /     \
                 /   CA  \
                /  (传统  \
               /   RDBMS)  \
              /             \
             ▼_______________▼
        Partition ◄────► Availability
                  CP          AP
              (etcd)      (Cassandra)
```

- **CP 系统**（etcd / ZooKeeper）：放弃可用性保一致性
- **AP 系统**（Cassandra / DynamoDB）：放弃强一致性保可用性

## 何时使用

✅ **推荐**：
- 需要强一致配置中心（K8s）
- 主从选举场景
- 分布式锁服务

⚠️ **不推荐**：
- 高写入吞吐 + 最终一致性可接受 → 用 AP 系统

## Related

- [[概念/etcd]] — etcd（K8s 用 Raft）
- [[概念/distributed-systems]] — 分布式系统
- [[数学基础/Distributed_Systems/Distributed_Systems]] — 分布式系统章节