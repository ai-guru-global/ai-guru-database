---
title: "AI 存储诊断命令集"
category: 12-architecture-infrastructure
subcategory: storage
tags: ["storage", "diagnostics", "commands", "checkpoint", "nas", "oss", "alibaba-cloud"]
summary: "面向 AI 训练与推理的存储诊断命令集：覆盖本地磁盘、NAS、OSS、并行文件系统的性能测试与问题定位。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# AI 存储诊断命令集

> **使用方式**: 存储慢、挂载失败、Checkpoint 写入失败时，按存储类型选择命令。

---

## 1. 本地磁盘

```bash
# 查看磁盘空间
df -h

# 查看 IO 统计
iostat -x 1 10

# 测试顺序读写
fio --name=test --filename=/data/test.bin --direct=1 --rw=write --bs=1M --size=10G --numjobs=8 --ioengine=libaio

# 测试随机读写
fio --name=test --filename=/data/test.bin --direct=1 --rw=randread --bs=4k --size=1G --numjobs=8

# 查看磁盘挂载
lsblk
mount | grep /data
```

---

## 2. NAS

```bash
# 查看 NFS 挂载
showmount -e <nfs-server>

# 查看挂载参数
cat /proc/mounts | grep nfs

# 测试 NFS 读写
fio --name=nfs-test --directory=/data --direct=0 --rw=write --bs=1M --size=1G

# 查看 NFS 统计
cat /proc/self/mountstats
```

---

## 3. OSS/S3

```bash
# 测试 OSS 上传速度
ossutil cp -r /data/test.bin oss://bucket/test.bin

# 测试下载速度
ossutil cp oss://bucket/test.bin /tmp/test.bin

# 使用 s3cmd 测试
s3cmd put /data/test.bin s3://bucket/test.bin

# 查看 bucket 列表
ossutil ls oss://bucket
```

---

## 4. 并行文件系统（Lustre/GPFS/CPFS）

```bash
# 查看文件系统状态
lfs df -h

# 查看 OST 状态
lfs osts

# 查看 striping
lfs getstripe /data

# 测试并行读写
mpirun -np 8 ./ior -w -r -t 1m -b 16m -s 16 -F -C -e -o /data/test

# 查看锁状态
cat /proc/fs/lustre/.../dump_state
```

---

## 5. Checkpoint 写入问题

```bash
# 查看写入带宽
python -c "
import time, torch
x = torch.randn(1024, 1024, 1024)  # ~4GB
start = time.time()
torch.save(x, '/data/checkpoint.pt')
print('Write time:', time.time() - start)
"

# 查看文件系统同步时间
time sync
```

---

## Related

- [[架构基建/Storage/AI_Storage_Patterns|AI 存储模式]]
- [[架构基建/Storage/Checkpoint_and_Model_Storage|Checkpoint 与模型存储]]

## 架构核心组件对比

| 组件层 | 功能 | 关键技术 | 选型考量 |
|--------|------|----------|----------|
| 计算层 | 模型训练/推理 | GPU/TPU/NPU集群 | 算力需求+成本 |
| 存储层 | 数据/模型/检查点 | 分布式存储/对象存储 | 容量+IOPS+成本 |
| 网络层 | 节点间通信 | RDMA/RoCE/InfiniBand | 带宽+延迟 |
| 调度层 | 资源编排 | K8s/Slurm/Ray | 弹性+效率 |
| 服务层 | 模型服务化 | vLLM/TGI/Triton | 吞吐+延迟 |
| 网关层 | 流量管理 | API Gateway/负载均衡 | 可用性+安全 |
| 监控层 | 可观测性 | Prometheus/Grafana/OTel | 全面+实时 |

## 架构设计原则

| 原则 | 说明 | 实践方法 |
|------|------|----------|
| 高可用 | 消除单点故障 | 多副本+故障转移+多AZ |
| 可扩展 | 水平扩展无瓶颈 | 无状态设计+分片 |
| 高性能 | 最小化延迟 | 缓存+并行+异步 |
| 安全性 | 纵深防御 | 加密+认证+审计 |
| 可观测 | 全链路可见 | Trace+Metrics+Logging |
| 成本优化 | 资源利用率最大化 | 弹性伸缩+混合部署 |

## 性能基准参考

| 场景 | 关键指标 | 目标值 | 优化方向 |
|------|----------|--------|----------|
| 模型推理 | 首Token延迟 | <500ms | 模型优化+缓存 |
| 批量推理 | 吞吐量 | >1000 req/s | 批处理+并行 |
| 训练任务 | GPU利用率 | >85% | 数据管道+通信优化 |
| 存储读写 | IOPS | >100K | NVMe+分布式 |
| 网络通信 | 带宽利用率 | >90% | RDMA+拓扑优化 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 |
|------|----------|----------|
| GPU利用率低 | 数据加载瓶颈 | 预取+多worker+NVMe |
| 推理延迟高 | 模型过大/批处理不当 | 量化+动态batch |
| 存储IO瓶颈 | 检查点写入集中 | 异步写入+分布式存储 |
| 网络拥塞 | AllReduce通信密集 | 梯度压缩+拓扑优化 |
| 资源碎片 | 调度策略不当 | Gang调度+资源预留 |

## 技术选型决策树

| 决策点 | 选项A | 选项B | 选择依据 |
|--------|-------|-------|----------|
| 训练框架 | PyTorch DDP | DeepSpeed/Megatron | 模型规模>10B用后者 |
| 推理引擎 | vLLM | TensorRT-LLM | 灵活性vs极致性能 |
| 存储方案 | 本地NVMe | 分布式存储(Ceph) | 数据规模+共享需求 |
| 网络方案 | 以太网 | InfiniBand | 集群规模+预算 |
| 调度系统 | K8s | Slurm | 云原生vs HPC传统 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 基础架构概念+组件认知 | 1-2周 | 理解全景图 |
| 基础 | 单一组件深入(存储/网络) | 2-3周 | 掌握核心原理 |
| 进阶 | 系统集成+性能优化 | 3-4周 | 能设计完整方案 |
| 实战 | 生产环境部署运维 | 4-6周 | 独立运维能力 |
| 精通 | 架构演进+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| RDMA | 远程直接内存访问(绕过CPU) |
| NVLink | GPU间高速互联 |
| InfiniBand | 高性能网络互连技术 |
| Checkpoint | 训练中间状态保存点 |
| Gang Scheduling | 一组Pod同时调度 |
| Data Parallelism | 数据并行(每GPU处理不同数据) |
| Model Parallelism | 模型并行(模型分片到多GPU) |
| Pipeline Parallelism | 流水线并行(层间流水) |
| Tensor Parallelism | 张量并行(层内切分) |
| KV Cache | 推理时缓存注意力键值 |

## 检查清单

- [ ] 理解AI基础设施全景架构
- [ ] 掌握计算/存储/网络核心组件
- [ ] 了解主流框架和工具链
- [ ] 能进行基本的性能分析和优化
- [ ] 熟悉生产环境最佳实践
- [ ] 关注硬件和架构演进趋势
