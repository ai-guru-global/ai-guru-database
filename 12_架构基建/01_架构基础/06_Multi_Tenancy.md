---
title: GPU 多租户架构 (Multi-Tenancy for AI)
category: 10-infrastructure
tags: ["multi-tenancy", "gpu-isolation", "quota", "billing", "resource-management"]
summary: "AI 平台多租户架构：GPU 隔离（MIG/vGPU/时间片）、资源配额、计费模型、调度策略与 2026 企业 AI 平台设计。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "GPU 多租户架构"
---
# GPU 多租户架构

> 中文简称：GPU 多租户架构

## 1. 多租户需求

```
企业 AI 平台多租户场景:
- 多团队共享 GPU 集群
- 资源隔离 (互不影响)
- 配额管理 (公平分配)
- 计费 (成本分摊)
- 安全 (数据隔离)

挑战:
- GPU 不像 CPU 容易虚拟化
- 显存隔离困难
- 性能干扰 (noisy neighbor)
- 碎片化 (GPU 不能无限切分)
```

## 2. GPU 隔离技术

| 技术 | 隔离级别 | 粒度 | 性能损耗 | 适用 |
|------|---------|------|---------|------|
| MIG (A100/H100) | 硬件 | 1/7 GPU | 0% | 推理/小训练 |
| vGPU (NVIDIA) | 驱动 | 自定义 | 5-10% | VDI/推理 |
| 时间片 | 调度 | 任务级 | 10-20% | 开发/测试 |
| 整卡分配 | 物理 | 1 GPU | 0% | 训练 |
| 容器隔离 | 软件 | Pod级 | <5% | 通用 |

### 2.1 MIG (Multi-Instance GPU)

```python
# NVIDIA MIG: 硬件级 GPU 分区
# A100 80GB: 最多 7 个实例
# H100 80GB: 最多 7 个实例

MIG_PROFILES = {
    "A100 80GB": {
        "1g.10gb": "1/7 算力, 10GB 显存",
        "2g.20gb": "2/7 算力, 20GB 显存",
        "3g.40gb": "3/7 算力, 40GB 显存",
        "4g.40gb": "4/7 算力, 40GB 显存",
        "7g.80gb": "整卡",
    },
}

# 配置 MIG:
"""
# 启用 MIG 模式
sudo nvidia-smi -i 0 -mig 1

# 创建 MIG 实例
sudo nvidia-smi mig -i 0 -cgi 9,9,9,9 -C  # 4个 1g.10gb

# 列出实例
nvidia-smi mig -i 0 -lgi
"""

# K8s 中使用 MIG:
"""
resources:
  limits:
    nvidia.com/mig-1g.10gb: 1  # 请求一个 MIG 实例
"""
```

## 3. 配额与调度

```python
class GPUQuotaManager:
    """GPU 配额管理"""
    
    def __init__(self, cluster_config):
        self.quotas = {}  # team → quota
        self.usage = {}   # team → current usage
    
    def set_quota(self, team, gpu_count, gpu_type="H100"):
        self.quotas[team] = {
            "gpu_count": gpu_count,
            "gpu_type": gpu_type,
            "max_job_duration": "72h",
            "priority": "normal",
        }
    
    def can_schedule(self, team, requested_gpus):
        """检查是否可以调度"""
        quota = self.quotas[team]
        current = self.usage.get(team, 0)
        return current + requested_gpus <= quota["gpu_count"]
    
    def fair_share_scheduling(self, pending_jobs):
        """公平份额调度"""
        # 按配额比例分配
        # 未使用的配额可以临时借给其他团队
        # 但配额所有者有优先权 (抢占)
        pass
```

## 4. 计费模型

```python
BILLING_MODELS = {
    "按 GPU 小时": {
        "公式": "GPU数 × 使用时长 × 单价",
        "单价": "H100: $3-5/GPU-hour, A100: $2-3/GPU-hour",
        "适用": "训练任务",
    },
    "按 Token": {
        "公式": "输入token × 单价 + 输出token × 单价",
        "适用": "推理服务 (API)",
    },
    "按配额": {
        "公式": "月度固定费用 (预留 GPU)",
        "适用": "稳定负载团队",
    },
    "混合": {
        "公式": "基础配额 + 超出按量",
        "适用": "大多数企业",
    },
}
```

## 5. 交叉引用

- [[12_架构基建/|架构基建]]
- [[13_运维/05_成本管理/01_Cost_Operations|成本运营]]
- [[10_部署推理/01_部署基础/09_Serving_架构|服务架构]]
- [[概念/General/single-tenant-architecture|单租户架构]]

## 架构核心组件对比

| 组件层 | 功能 | 关键技术 | 选型考量 |
|--------|------|----------|----------|
| 计算层 | 07_模型训练/推理 | GPU/TPU/NPU集群 | 算力需求+成本 |
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
