---
title: "NAS"
category: -concepts
tags: ["storage", "file-storage", "cloud", "alibaba-cloud"]
summary: "NAS（Network Attached Storage）是网络附加存储，提供文件级访问接口（NFS/SMB），适合 AI 训练中的共享工作目录和模型仓库。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Network Attached Storage"
  - "阿里云 NAS"
relationships:
  - target: "概念/storage"
    type: is_a
  - target: "概念/alibaba-cloud"
    type: provided_by
sources: []
---

# NAS

> **一句话理解**: NAS 就是网络上的共享硬盘，多台机器可以同时挂载，适合存大家都要读写的文件。

## 核心要点

- **文件级访问**: 支持 NFS/SMB 协议
- **共享**: 多客户端同时访问
- **POSIX 兼容**: 无需改代码
- **适用**: 共享数据集、模型仓库、开发环境 home 目录

## 与 OSS 对比

| 特性 | NAS | OSS |
|------|-----|-----|
| 协议 | NFS/SMB | S3/HTTP |
| 延迟 | 低 | 较高 |
| 小文件 | 友好 | 较差 |
| 扩展性 | 有限 | 无限 |
| 成本 | 中 | 低 |

## 阿里云专有云关联

在阿里云专有云环境中，NAS 可作为 ACK 的 ReadWriteMany PVC，用于多 Pod 共享数据集和模型。

## Related

- [[概念/storage|Storage]]
- [[概念/oss|OSS]]
- [[概念/alibaba-cloud|Alibaba Cloud]]

---

## 2026 NAS 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **阿里云 NAS** | 共享文件存储 | GA |
| **NFS/SMB** | 标准文件协议 | GA |
| **POSIX 兼容** | 完全 POSIX 兼容 | GA |
| **弹性扩容** | 自动扩容 | GA |
| **AI 训练场景** | 训练数据共享存储 | GA |

## 生产最佳实践

1. **共享存储**：多节点训练用 NAS 共享数据
2. **性能选择**：根据 IOPS 需求选择性能型/容量型
3. **与 OSS 配合**：NAS + OSS 分层存储
4. **权限控制**：配置文件访问权限
5. **备份策略**：重要数据定期备份

## 架构与组件

| 组件 | 职责 | 说明 |
|------|------|------|
| **NAS 服务端** | 文件存储与访问 | NFS/SMB 协议 |
| **客户端挂载** | 文件系统访问 | mount 命令 |
| **权限管理** | 访问控制 | POSIX ACL |
| **快照** | 数据保护 | 时间点快照 |
| **加密** | 数据安全 | 传输/存储加密 |

## 配置示例

```bash
# 挂载阿里云 NAS (NFS)
sudo mount -t nfs -o vers=4,minorversion=0,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport \
  file-system-id.region.nas.aliyuncs.com:/ /mnt/nas

# K8s PV 配置
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nas-pv
spec:
  capacity:
    storage: 100Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: file-system-id.region.nas.aliyuncs.com
    path: /
```

## AI 训练场景应用

| 场景 | NAS 作用 | 配置建议 |
|------|----------|----------|
| 多节点训练 | 共享训练数据 | 性能型 NAS |
| 模型仓库 | 存储模型权重 | 容量型 NAS |
| Checkpoint | 训练断点保存 | 性能型 + 快照 |
| 开发环境 | 共享 home 目录 | 容量型 NAS |
| 日志存储 | 训练日志收集 | 容量型 NAS |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 挂载失败 | 网络/权限问题 | 检查安全组和挂载点 |
| 性能不足 | IOPS 达到上限 | 升级性能型或扩容 |
| 文件锁冲突 | 多客户端并发写 | 使用文件锁或分区写 |
| 容量不足 | 数据增长 | 扩容或清理旧数据 |

## 相关概念

- [[概念/oss|OSS]] — 对象存储
- [[概念/storage|Storage]] — 存储概念
- [[概念/alibaba-cloud|Alibaba Cloud]] — 阿里云
- [[概念/kubernetes|Kubernetes]] — 容器编排

## 总结

NAS 是网络附加存储，提供文件级访问接口，适合 AI 训练中的共享工作目录和模型仓库。与 OSS 配合使用可实现分层存储。

---

> 💡 NAS 是网络上的共享硬盘，多台机器可以同时挂载，适合存大家都要读写的文件。

## NAS 类型对比

| 类型 | 性能 | 容量 | 适用场景 |
|------|------|------|----------|
| 性能型 NAS | 高 IOPS | 较小 | 训练数据读取 |
| 容量型 NAS | 中等 | 大 | 模型仓库、日志 |
| 极速型 NAS | 极高 | 小 | 高频读写场景 |
| 通用型 NAS | 平衡 | 中 | 开发环境 |

## 性能调优

| 参数 | 建议值 | 说明 |
|------|--------|------|
| rsize | 1048576 | 读取块大小 |
| wsize | 1048576 | 写入块大小 |
| timeo | 600 | 超时时间 |
| retrans | 2 | 重试次数 |
| hard | 启用 | 硬挂载 |
| noresvport | 启用 | 非保留端口 |

## 与 CPFS/GPFS 对比

| 维度 | NAS | CPFS/GPFS |
|------|-----|----------|
| 定位 | 通用文件存储 | 高性能并行文件系统 |
| 带宽 | 中等 | 极高 (100GB/s+) |
| 适用 | 中小规模训练 | 大规模分布式训练 |
| 成本 | 低 | 高 |
| 协议 | NFS/SMB | POSIX |

## 版本兼容性

| 产品 | 版本 | 状态 |
|------|------|------|
| 阿里云 NAS | NFSv4 | 稳定 |
| 阿里云 NAS | SMB 3.0 | 稳定 |
| 阿里云 CPFS | 2.0 | 稳定 |

## 安全与监控

| 维度 | 措施 | 说明 |
|------|------|------|
| 传输加密 | TLS/SSL | 防止数据窃听 |
| 存储加密 | AES-256 | 静态数据加密 |
| 访问控制 | POSIX ACL | 文件级权限 |
| 网络隔离 | VPC + 安全组 | 限制访问来源 |
| 审计日志 | ActionTrail | 操作审计 |
| 监控告警 | CloudMonitor | IOPS/延迟/容量 |

## 生产检查清单

1. **性能选型**：根据 IOPS 和带宽需求选择 NAS 类型
2. **网络优化**：确保 NAS 与计算节点同 VPC、同可用区
3. **挂载参数**：使用推荐的 rsize/wsize 参数
4. **容量规划**：预留 20% 容量缓冲
5. **备份策略**：重要数据配置快照 + 跨区域备份
6. **权限最小化**：只授予必要的读写权限
7. **监控告警**：对 IOPS、延迟、容量设置告警

## 学习资源

| 资源 | 类型 | 说明 |
|------|------|------|
| 阿里云 NAS 文档 | 官方 | 产品文档 |
| NFS 最佳实践 | 指南 | 挂载参数调优 |
