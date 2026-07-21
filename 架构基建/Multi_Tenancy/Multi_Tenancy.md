---
title: GPU 多租户架构 (Multi-Tenancy for AI)
category: 10-infrastructure
tags: ["multi-tenancy", "gpu-isolation", "quota", "billing", "resource-management"]
summary: "AI 平台多租户架构：GPU 隔离（MIG/vGPU/时间片）、资源配额、计费模型、调度策略与 2026 企业 AI 平台设计。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# GPU 多租户架构

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

- [[架构基建/|架构基建]]
- [[运维/Cost_Operations/|成本运营]]
- [[部署推理/Serving_Architecture/|服务架构]]
- [[概念/General/single-tenant-architecture|单租户架构]]
