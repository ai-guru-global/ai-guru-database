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
  - 12_架构基建/02_Architecture_Overview/AI_Infrastructure_2026
summary: "etcd 是 CNCF Graduated 的分布式键值存储，使用 Raft 共识算法，是 Kubernetes 的元数据存储后端，也广泛用于服务发现、配置管理和分布式锁。"
provenance:
  extracted: 0.8
  inferred: 0.15
  ambiguous: 0.05
base_confidence: 0.9
lifecycle: reviewed
tier: core
created: 2026-06-16
updated: 2026-07-21
aliases:
  - Etcd

name_zh: "分布式键值存储"
---
# etcd

> 中文简称：分布式键值存储

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
- [[12_架构基建/02_Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施 2026

---

## 2026 etcd 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **etcd** | 分布式键值存储 | GA |
| **Raft 共识** | 分布式一致性 | GA |
| **K8s 后端** | K8s 控制平面存储 | GA |
| **服务发现** | 分布式服务发现 | GA |
| **配置管理** | 分布式配置管理 | GA |

## 生产最佳实践

1. **K8s 必用**：K8s 控制平面必须用 etcd
2. **高可用**：etcd 集群高可用部署
3. **备份**：etcd 数据定期备份
4. **性能优化**：etcd 性能优化
5. **监控**：监控 etcd 集群健康

## etcd 集群部署配置

```yaml
# etcd 集群配置 (3 节点)
name: etcd-node-1
data-dir: /var/lib/etcd
listen-client-urls: https://0.0.0.0:2379
advertise-client-urls: https://10.0.1.1:2379
listen-peer-urls: https://0.0.0.0:2380
initial-cluster: etcd-node-1=https://10.0.1.1:2380,etcd-node-2=https://10.0.1.2:2380,etcd-node-3=https://10.0.1.3:2380
initial-cluster-state: new
# 性能调优
quota-backend-bytes: 8589934592  # 8GB
snapshot-count: 5000
heartbeat-interval: 100
election-timeout: 1000
```

## AI 场景中的 etcd 用途

| 场景 | 用途 | 说明 |
|------|------|------|
| **K8s AI 集群** | 存储 GPU 节点、Pod 状态 | 控制平面核心 |
| **模型服务发现** | 注册/发现推理服务实例 | 动态扩缩容 |
| **分布式训练** | Leader 选举、任务协调 | 多节点训练 |
| **配置中心** | 动态下发模型配置 | 热更新 |
| **分布式锁** | 协调 GPU 资源分配 | 防止冲突 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 集群不可用 | 多数节点宕机 | 确保 3/5 节点跨 AZ |
| 写入慢 | 磁盘 IOPS 不足 | 使用 SSD/NVMe |
| 数据库膨胀 | 历史版本未压缩 | 定期 compact + defrag |
| Leader 频繁切换 | 网络不稳定 | 调大 election-timeout |
| 备份失败 | 数据量过大 | 增量备份 + 分片 |

## 版本兼容性

| 组件 | 推荐版本 | 说明 |
|------|----------|------|
| etcd | 3.5+ | 最新稳定版 |
| Kubernetes | 1.28+ | 内置 etcd |
| etcdctl | 3.5+ | CLI 工具 |
| etcd-operator | 最新 | K8s 部署 |

## 生产检查清单

1. 3/5 节点跨可用区部署
2. 使用 SSD/NVMe 存储
3. 每日自动备份 + 异地存储
4. 配置磁盘告警（使用率 > 80%）
5. 定期 compact + defrag 防止膨胀
6. 监控 Leader 切换频率和延迟

## 版本兼容性

| 组件 | 推荐版本 | K8s 兼容性 | 备注 |
|------|------|------|------|
| **etcd** | 3.5.x / 3.6.x | K8s 1.28+ | 生产推荐 3.5.12+ |
| **K8s** | 1.28-1.31 | 内置 etcd | kubeadm 自动管理 |
| **CoreDNS** | 1.11+ | 依赖 etcd | 服务发现 |
| **Calico** | 3.27+ | 可选 etcd | 网络策略存储 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| `mvcc: database space exceeded` | 未定期 compact | 设置 auto-compaction + 手动 defrag |
| Leader 频繁切换 | 磁盘 I/O 延迟高 | 使用 SSD，分离 etcd 磁盘 |
| 集群脑裂 | 网络分区 | 确保奇数节点 + 稳定网络 |
| 快照恢复失败 | 版本不匹配 | 使用同版本 etcdctl 恢复 |

## 生产检查清单

1. ✅ 集群节点数为奇数（3/5/7）
2. ✅ 使用 SSD 存储，IOPS > 3000
3. ✅ 配置自动快照备份（每小时）
4. ✅ 配置磁盘告警（使用率 > 80%）
5. ✅ 定期 compact + defrag 防止膨胀
6. ✅ 监控 Leader 切换频率和延迟

## 总结

etcd 是 Kubernetes 和分布式系统的基石，提供强一致的键值存储和服务协调能力。在 AI 基础设施中，etcd 支撑着 K8s 集群管理、模型服务发现、分布式训练协调等关键功能。

> 💡 etcd 的核心价值：分布式系统的“单一事实来源”——所有集群状态、配置、服务注册都存储在 etcd，它的可用性直接决定整个系统的可用性。
