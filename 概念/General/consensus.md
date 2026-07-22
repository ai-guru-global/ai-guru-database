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
updated: 2026-07-21
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

---

## 2026 共识算法生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Raft** | 易理解的共识算法 | GA |
| **Paxos** | 经典共识算法 | GA |
| **PBFT** | 实用拜占庭容错 | GA |
| **etcd** | Raft 实现 | GA |
| **分布式一致性** | 分布式系统一致性 | GA |

## 生产最佳实践

1. **Raft 优先**：共识算法优先选择 Raft
2. **etcd 使用**：K8s 用 etcd 实现共识
3. **节点数**：共识集群奇数节点
4. **网络分区**：处理网络分区场景
5. **性能监控**：监控共识延迟和吐量

## 共识算法对比

| 算法 | 容错 | 性能 | 复杂度 | 典型实现 |
|------|------|------|--------|----------|
| **Raft** | f < n/2 | 高 | 低 | etcd, TiKV |
| **Paxos** | f < n/2 | 中 | 极高 | Chubby |
| **PBFT** | f < n/3 | 中 | 高 | 区块链 |
| **Viewstamped** | f < n/2 | 高 | 中 | - |

## AI 场景中的共识

| 场景 | 用途 | 算法 |
|------|------|------|
| **K8s 控制平面** | 集群状态一致性 | Raft (etcd) |
| **分布式训练** | 参数同步协调 | AllReduce |
| **模型服务发现** | 服务注册/发现 | Raft (etcd) |
| **分布式锁** | GPU 资源协调 | Raft (etcd) |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 脑裂 | 网络分区 | 多数派决策 |
| Leader 频繁切换 | 网络不稳定 | 调大选举超时 |
| 写入延迟高 | 磁盘 IOPS 不足 | 使用 SSD |
| 集群不可用 | 多数节点宕机 | 3/5 节点跨 AZ |

## 版本兼容性

| 实现 | 版本 | 说明 |
|------|------|------|
| etcd | 3.5+ | Raft 实现 |
| TiKV | 7.x | Raft 存储 |
| ZooKeeper | 3.9+ | ZAB 协议 |

## 生产检查清单

1. 共识集群 3/5 节点跨可用区
2. 使用 SSD 存储确保写入性能
3. 监控 Leader 切换频率和延迟
4. 配置网络分区处理策略
5. 定期备份共识数据
6. 测试节点故障恢复流程

## 版本兼容性

| 算法/实现 | 版本 | 特性 | 适用场景 |
|------|------|------|------|
| **Raft (etcd)** | 3.5+ | 强一致 KV | K8s/服务发现 |
| **Paxos (ZooKeeper)** | 3.9+ | 协调服务 | 分布式锁/选举 |
| **PBFT** | - | 拜占庭容错 | 区块链 |
| **HotStuff** | - | 线性视图变更 | 高性能区块链 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| 写入延迟高 | 多数节点确认慢 | 优化网络/使用 SSD |
| Leader 选举频繁 | 心跳超时过短 | 调大 election-timeout |
| 日志膨胀 | 未做快照压缩 | 定期 snapshot + compact |
| 脑裂风险 | 网络分区 | 确保多数派可达 |

## 总结

共识算法是分布式系统的基石，保证多节点间的数据一致性和协调。在 AI 基础设施中，Raft/etcd 支撑着 K8s 集群管理、服务发现、分布式锁等关键功能。

> 💡 共识算法的核心价值：在不可靠的网络上实现可靠的状态一致——这是所有分布式系统的根本挑战。

## 相关概念

- [[概念/etcd]] — etcd 分布式键值存储
- [[概念/raft]] — Raft 共识算法
- [[概念/paxos]] — Paxos 共识协议
- [[概念/distributed-training]] — 分布式训练
