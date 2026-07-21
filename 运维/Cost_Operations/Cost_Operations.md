---
title: AI 成本运营 (Cost Operations / FinOps for AI)
category: 11-operations
tags: ["finops", "gpu-cost", "cost-optimization", "billing", "cloud-cost"]
summary: "AI 成本运营完整体系：GPU 成本分析、推理成本优化、训练成本控制、FinOps 实践、成本分摊模型与 2026 降本策略。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# AI 成本运营 (FinOps for AI)

## 1. AI 成本结构

```
AI 系统成本构成:

训练成本 (一次性):
  GPU 计算: 70-80% (最大头)
  存储: 10-15% (数据集/检查点)
  网络: 5-10% (跨节点通信)
  人力: 另计

推理成本 (持续性):
  GPU 计算: 60-70%
  API 调用: 20-30% (如果用第三方)
  存储/缓存: 5-10%
  网络/CDN: 5%

2026 参考成本:
  训练 7B (1T tokens): ~$50K-100K
  训练 70B (2T tokens): ~$500K-1M
  推理 (每百万 token): $0.1-5 (取决于模型)
```

## 2. 推理成本优化

```python
INFERENCE_COST_OPTIMIZATION = {
    "模型选择": {
        "策略": "简单任务用小模型，复杂任务用大模型",
        "节省": "50-80%",
        "实现": "模型路由 (Router)",
    },
    "量化": {
        "策略": "FP16 → INT8/INT4",
        "节省": "50-75% 显存 → 更多并发",
        "实现": "AWQ/GPTQ/FP8",
    },
    "缓存": {
        "策略": "语义缓存 + Prompt 缓存",
        "节省": "30-60% 调用量",
        "实现": "Redis 向量搜索 / API 原生缓存",
    },
    "批处理": {
        "策略": "Continuous Batching 提高 GPU 利用率",
        "节省": "30-50% 单位成本",
        "实现": "vLLM/SGLang",
    },
    "Spot/抢占实例": {
        "策略": "非实时任务用 Spot GPU",
        "节省": "60-80%",
        "风险": "可能被中断",
    },
    "蒸馏": {
        "策略": "大模型蒸馏到小模型",
        "节省": "80-95% (推理时)",
        "代价": "一次性训练成本",
    },
}
```

## 3. 成本监控

```python
class AICostMonitor:
    """AI 成本监控仪表板"""
    
    METRICS = {
        "每请求成本": "total_cost / num_requests",
        "每 token 成本": "gpu_cost / total_tokens",
        "GPU 利用率": "actual_flops / peak_flops",
        "成本/收入比": "ai_cost / revenue_attributed",
        "闲置成本": "idle_gpu_hours × hourly_rate",
    }
    
    ALERTS = {
        "日成本超预算 120%": "通知 + 限流",
        "GPU 利用率 < 50% 持续 1h": "缩容建议",
        "单用户成本异常": "检查滥用",
        "月度预测超预算": "提前预警",
    }
```

## 4. 成本分摊

```python
COST_ALLOCATION = {
    "按团队": "各团队 GPU 使用量 × 单价",
    "按项目": "项目标签追踪资源消耗",
    "按产品": "产品级 P&L (收入-成本)",
    "共享成本": "平台/运维成本按使用比例分摊",
    
    "工具": [
        "Kubecost: K8s 成本追踪",
        "CloudHealth: 多云成本管理",
        "自建: GPU 使用日志 + 计费引擎",
    ],
}
```

## 5. 交叉引用

- [[运维/|运维]]
- [[运维/Incident_Management/|事故管理]]
- [[架构基建/Multi_Tenancy/|多租户]]
- [[部署推理/Cost/|推理成本]]
- [[概念/General/finops|FinOps]]
