---
title: "模型服务 SLA 管理"
category: "13-ai-ops"
tags: ["sla", "slo", "sli", "error-budget", "model-serving", "latency", "autoscaling", "on-call"]
summary: "模型服务 SLA 管理全景：SLO/SLI/Error Budget 框架、延迟分位数(P50/P95/P99)、TTFT/TPS/ITL 指标体系、自动扩缩容策略、多模型路由与降级、A/B 测试流量管理、容量规划、On-call 与告警设计。"
created: 2026-07-19
updated: 2026-07-19
tier: supporting
aliases:
  - "Model Serving SLA Management"
  - Model_Serving_SLA_Management
sources: []

name_zh: "模型服务 SLA 管理"
---
# 模型服务 SLA 管理

> 中文简称：模型服务 SLA 管理

> **一句话理解**: 为 LLM/AI 推理服务建立完整的 SLA 管理体系——从指标定义、错误预算到自动扩缩容、降级策略和 On-call 响应。

---

## 一、概述

### 1.1 模型服务 SLA 的独特挑战

```
传统 API 服务 SLA              模型服务 SLA
═══════════════════           ═══════════════════
响应时间固定                   延迟取决于输入/输出 Token 数
成功 = HTTP 200               成功还需考虑输出质量
扩容秒级 (无状态)              扩容分钟级 (加载模型权重)
资源消耗均匀                   GPU 显存/算力消耗差异大
单一模型版本                   多模型/多版本并行服务
降级 = 返回缓存               降级 = 切换小模型/截断输出
```

### 1.2 SLA 层级关系

```
┌─────────────────────────────────────────────────┐
│  SLA (Service Level Agreement)                  │
│  对外合同承诺，违约有经济赔偿                      │
│  "可用性 99.9%，P99 延迟 < 10s，否则赔 10%"      │
├─────────────────────────────────────────────────┤
│  SLO (Service Level Objective)                  │
│  内部目标，比 SLA 更严格                          │
│  "可用性 99.95%，P99 延迟 < 8s"                 │
├─────────────────────────────────────────────────┤
│  SLI (Service Level Indicator)                  │
│  实际测量值                                      │
│  "过去 30 天可用性 = 99.97%，P99 = 6.2s"        │
└─────────────────────────────────────────────────┘
```

---

## 二、SLO/SLI/Error Budget 框架

### 2.1 模型服务 SLI 定义

#### 可用性 SLI

| SLI | 定义 | 计算方式 | 目标 |
|-----|------|---------|------|
| 请求成功率 | 非 5xx 响应占比 | success / total | > 99.9% |
| 有效响应率 | 返回有意义输出的占比 | valid / total | > 99.5% |
| 流式完整率 | SSE 流正常完成的占比 | complete_streams / total_streams | > 99.8% |

#### 延迟 SLI

| SLI | 定义 | 典型目标 | 测量点 |
|-----|------|---------|--------|
| **TTFT** (Time To First Token) | 请求到首 Token 的时间 | P95 < 2s | Gateway → 首 Token |
| **TPS** (Tokens Per Second) | 生成阶段每秒 Token 数 | P50 > 40 tok/s | 生成阶段 |
| **ITL** (Inter-Token Latency) | 相邻 Token 间隔 | P95 < 100ms | 流式输出 |
| **E2E Latency** | 端到端总延迟 | P99 < 30s | 请求 → 完成 |
| **Queue Time** | 排队等待时间 | P95 < 5s | 请求入队 → 开始处理 |

#### 质量 SLI

| SLI | 定义 | 测量方式 | 目标 |
|-----|------|---------|------|
| 幻觉率 | 包含事实错误的响应占比 | 采样评估 | < 5% |
| 拒绝率 | 不当拒绝正常请求的占比 | 采样评估 | < 2% |
| 格式合规率 | 输出符合指定格式的占比 | 自动校验 | > 98% |

### 2.2 Error Budget 计算

```python
"""Error Budget 计算器"""
from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass
class SLODefinition:
    name: str
    target: float          # 目标值 (如 0.999 = 99.9%)
    window_days: int       # 评估窗口 (天)
    metric_type: str       # "availability" | "latency"

class ErrorBudgetCalculator:
    """Error Budget 计算与追踪"""
    
    def __init__(self, slo: SLODefinition):
        self.slo = slo
    
    def calculate_budget(self, current_value: float) -> dict:
        """计算剩余 Error Budget"""
        total_budget = 1 - self.slo.target  # 允许的错误比例
        consumed = max(0, self.slo.target - current_value) if \
                   self.slo.metric_type == "availability" else \
                   max(0, current_value - self.slo.target)
        remaining = total_budget - consumed
        
        # 转换为时间
        window_minutes = self.slo.window_days * 24 * 60
        budget_minutes = total_budget * window_minutes
        consumed_minutes = consumed * window_minutes
        remaining_minutes = remaining * window_minutes
        
        return {
            "slo_target": self.slo.target,
            "current_value": current_value,
            "total_budget_pct": total_budget * 100,
            "consumed_pct": consumed * 100,
            "remaining_pct": remaining * 100,
            "budget_minutes": budget_minutes,
            "consumed_minutes": consumed_minutes,
            "remaining_minutes": remaining_minutes,
            "burn_rate": consumed / total_budget if total_budget > 0 else 0,
        }
    
    def should_freeze_changes(self, current_value: float) -> bool:
        """Error Budget 耗尽时冻结变更"""
        budget = self.calculate_budget(current_value)
        return budget["remaining_pct"] <= 0

# 使用示例
slo = SLODefinition(
    name="LLM API Availability",
    target=0.999,      # 99.9%
    window_days=30,
    metric_type="availability"
)
calculator = ErrorBudgetCalculator(slo)
result = calculator.calculate_budget(current_value=0.9985)
# 总预算: 0.1% = 43.2 分钟/30天
# 已消耗: 0.05% = 21.6 分钟
# 剩余: 0.05% = 21.6 分钟
```

### 2.3 Error Budget 策略矩阵

| Budget 剩余 | 状态 | 允许的操作 | 禁止的操作 |
|------------|------|-----------|-----------|
| > 50% | 健康 | 所有变更、实验、发布 | 无 |
| 25-50% | 注意 | 常规发布、小实验 | 高风险变更 |
| 10-25% | 警告 | 仅 Bug fix、可靠性改进 | 新功能发布、A/B 测试 |
| < 10% | 危急 | 仅紧急修复 | 所有非关键变更 |
| ≤ 0% | 耗尽 | 冻结所有变更 | 一切变更直到恢复 |

---

## 三、延迟分位数详解

### 3.1 为什么关注 P95/P99 而非平均值

```
假设 1000 个请求的延迟分布:
- 950 个请求: 500ms
- 40 个请求: 2000ms
- 9 个请求: 5000ms
- 1 个请求: 30000ms (超时)

平均值 = 795ms  ← 看起来还行
P50 = 500ms    ← 多数用户体验好
P95 = 2000ms   ← 5% 用户等待 2s+
P99 = 5000ms   ← 1% 用户等待 5s+
P99.9 = 30000ms ← 极端情况
```

### 3.2 延迟指标采集实现

```python
"""模型服务延迟指标采集"""
import time
import asyncio
from dataclasses import dataclass, field
from prometheus_client import Histogram, Counter, Gauge

# Prometheus 指标定义
TTFT_HISTOGRAM = Histogram(
    "llm_time_to_first_token_seconds",
    "Time to first token",
    ["model", "endpoint"],
    buckets=[0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0]
)

TPS_HISTOGRAM = Histogram(
    "llm_tokens_per_second",
    "Tokens generated per second",
    ["model", "endpoint"],
    buckets=[5, 10, 20, 30, 50, 80, 100, 150]
)

ITL_HISTOGRAM = Histogram(
    "llm_inter_token_latency_seconds",
    "Inter-token latency",
    ["model"],
    buckets=[0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1.0]
)

E2E_HISTOGRAM = Histogram(
    "llm_e2e_latency_seconds",
    "End-to-end request latency",
    ["model", "endpoint", "status"],
    buckets=[0.5, 1.0, 2.0, 5.0, 10.0, 30.0, 60.0, 120.0]
)

QUEUE_HISTOGRAM = Histogram(
    "llm_queue_time_seconds",
    "Time spent in queue before processing",
    ["model", "priority"],
    buckets=[0.01, 0.05, 0.1, 0.5, 1.0, 5.0, 10.0, 30.0]
)

REQUEST_COUNTER = Counter(
    "llm_requests_total",
    "Total requests",
    ["model", "endpoint", "status", "error_type"]
)

@dataclass
class InferenceMetrics:
    """单次推理的完整指标"""
    request_id: str
    model: str
    endpoint: str
    queue_time: float = 0.0
    ttft: float = 0.0
    total_tokens: int = 0
    generation_time: float = 0.0
    token_timestamps: list = field(default_factory=list)
    
    @property
    def tps(self) -> float:
        if self.generation_time > 0:
            return self.total_tokens / self.generation_time
        return 0.0
    
    @property
    def itl_values(self) -> list[float]:
        """计算所有 Inter-Token Latency"""
        return [
            self.token_timestamps[i+1] - self.token_timestamps[i]
            for i in range(len(self.token_timestamps) - 1)
        ]
    
    def record(self):
        """记录到 Prometheus"""
        labels = {"model": self.model, "endpoint": self.endpoint}
        TTFT_HISTOGRAM.labels(**labels).observe(self.ttft)
        TPS_HISTOGRAM.labels(**labels).observe(self.tps)
        E2E_HISTOGRAM.labels(
            **labels, status="success"
        ).observe(self.ttft + self.generation_time)
        
        for itl in self.itl_values:
            ITL_HISTOGRAM.labels(model=self.model).observe(itl)
```

### 3.3 延迟分位数 SLO 设计原则

| 原则 | 说明 | 示例 |
|------|------|------|
| 按 Token 数分桶 | 短/中/长输出延迟差异大 | <100tok: P95<3s; >1000tok: P95<30s |
| 区分 Prefill/Decode | 两阶段瓶颈不同 | TTFT 看 Prefill; TPS 看 Decode |
| 排除客户端因素 | 只测量服务端延迟 | 不含网络传输时间 |
| 流式 vs 非流式分开 | 体验完全不同 | 流式: TTFT; 非流式: E2E |
| 按优先级分层 | VIP 用户 vs 免费用户 | P0: P99<5s; P1: P99<15s |

---

## 四、自动扩缩容策略

### 4.1 扩缩容指标选择

```yaml
# KEDA ScaledObject - 基于自定义指标扩缩容
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: llm-inference-scaler
  namespace: inference
spec:
  scaleTargetRef:
    name: llm-inference-deployment
  minReplicaCount: 2
  maxReplicaCount: 32
  cooldownPeriod: 300
  pollingInterval: 15
  triggers:
    # 基于 GPU 利用率
    - type: prometheus
      metadata:
        serverAddress: http://prometheus:9090
        metricName: gpu_utilization
        query: |
          avg(DCGM_FI_DEV_GPU_UTIL{namespace="inference"})
        threshold: "80"
    
    # 基于请求队列深度
    - type: prometheus
      metadata:
        serverAddress: http://prometheus:9090
        metricName: request_queue_depth
        query: |
          sum(llm_pending_requests{namespace="inference"})
        threshold: "50"
    
    # 基于 TTFT P95
    - type: prometheus
      metadata:
        serverAddress: http://prometheus:9090
        metricName: ttft_p95
        query: |
          histogram_quantile(0.95,
            rate(llm_time_to_first_token_seconds_bucket[5m]))
        threshold: "2.0"
```

### 4.2 扩缩容策略对比

| 策略 | 触发条件 | 扩容速度 | 缩容速度 | 适用场景 |
|------|---------|---------|---------|---------|
| 基于 QPS | 请求量超阈值 | 快 (预热后) | 慢 (cooldown) | 流量可预测 |
| 基于 GPU 利用率 | GPU > 80% | 中 | 慢 | 通用 |
| 基于队列深度 | 排队 > N | 快 | 中 | 异步推理 |
| 基于延迟 SLO | P95 超标 | 快 | 慢 | SLA 敏感 |
| 预测式扩容 | 历史流量预测 | 提前 | 渐进 | 周期性流量 |
| 定时扩缩 | Cron 表达式 | 提前 | 定时 | 已知高峰 |

### 4.3 模型加载优化（冷启动）

```python
"""模型预热与冷启动优化"""
import time
import torch
from pathlib import Path

class ModelWarmer:
    """模型预热管理器 - 减少冷启动延迟"""
    
    def __init__(self, model_path: str, device: str = "cuda"):
        self.model_path = model_path
        self.device = device
    
    def warm_up(self, model) -> float:
        """执行模型预热，返回预热时间"""
        start = time.perf_counter()
        
        # 1. 预分配 KV Cache
        self._preallocate_kv_cache(model)
        
        # 2. CUDA Graph 捕获 (固定 shape)
        self._capture_cuda_graphs(model)
        
        # 3. 执行 dummy 推理 (触发 JIT 编译)
        dummy_input = torch.randint(0, 32000, (1, 128)).to(self.device)
        for _ in range(3):
            with torch.no_grad():
                model.generate(dummy_input, max_new_tokens=10)
        
        torch.cuda.synchronize()
        elapsed = time.perf_counter() - start
        return elapsed
    
    def _preallocate_kv_cache(self, model):
        """预分配 KV Cache 避免运行时分配"""
        max_batch = 64
        max_seq = 4096
        # vLLM 自动管理; 手动场景:
        torch.cuda.empty_cache()
        torch.cuda.memory.set_per_process_memory_fraction(0.9)
    
    def _capture_cuda_graphs(self, model):
        """CUDA Graph 减少 kernel launch 开销"""
        # 适用于固定 batch size 的推理
        pass
```

---

## 五、多模型路由与降级

### 5.1 路由策略

```python
"""多模型智能路由"""
from enum import Enum
from dataclasses import dataclass

class ModelTier(Enum):
    PREMIUM = "premium"      # 大模型 (70B+)
    STANDARD = "standard"    # 中模型 (7B-70B)
    LIGHTWEIGHT = "light"    # 小模型 (<7B)

@dataclass
class RoutingDecision:
    model: str
    tier: ModelTier
    reason: str

class ModelRouter:
    """基于多维度决策的模型路由器"""
    
    def __init__(self):
        self.tier_config = {
            ModelTier.PREMIUM: {
                "models": ["llama-405b", "claude-opus"],
                "max_queue": 100,
                "timeout": 60,
            },
            ModelTier.STANDARD: {
                "models": ["llama-70b", "qwen-72b"],
                "max_queue": 500,
                "timeout": 30,
            },
            ModelTier.LIGHTWEIGHT: {
                "models": ["llama-8b", "qwen-7b"],
                "max_queue": 2000,
                "timeout": 10,
            },
        }
    
    def route(self, request) -> RoutingDecision:
        """路由决策逻辑"""
        # 1. 用户优先级
        if request.user_tier == "enterprise":
            return self._route_premium(request)
        
        # 2. 任务复杂度评估
        complexity = self._estimate_complexity(request)
        if complexity > 0.8:
            return self._route_premium(request)
        elif complexity > 0.4:
            return self._route_standard(request)
        else:
            return self._route_lightweight(request)
    
    def degrade(self, target_tier: ModelTier) -> RoutingDecision:
        """降级策略: 大模型不可用时降级到小模型"""
        fallback_chain = {
            ModelTier.PREMIUM: ModelTier.STANDARD,
            ModelTier.STANDARD: ModelTier.LIGHTWEIGHT,
            ModelTier.LIGHTWEIGHT: None,  # 无降级，返回错误
        }
        fallback = fallback_chain[target_tier]
        if fallback:
            config = self.tier_config[fallback]
            return RoutingDecision(
                model=config["models"][0],
                tier=fallback,
                reason=f"degraded_from_{target_tier.value}"
            )
        raise ServiceUnavailableError("All model tiers exhausted")
```

### 5.2 降级策略矩阵

| 触发条件 | 降级动作 | 用户感知 | 恢复条件 |
|---------|---------|---------|---------|
| GPU 利用率 > 95% | 限制 max_tokens | 输出变短 | 利用率 < 80% |
| 队列深度 > 阈值 | 切换小模型 | 质量略降 | 队列恢复 |
| TTFT P95 > SLO | 减少 batch size | 吞吐降低 | 延迟恢复 |
| 大模型 OOM | 降级到中模型 | 质量降低 | 内存恢复 |
| 全部 GPU 故障 | 返回缓存/模板 | 无个性化 | GPU 恢复 |
| 网络分区 | 就近推理 | 可能用旧模型 | 网络恢复 |

---

## 六、A/B 测试流量管理

### 6.1 流量分割架构

```python
"""A/B 测试流量管理"""
import hashlib
from dataclasses import dataclass

@dataclass
class Experiment:
    name: str
    variants: dict[str, float]  # variant_name -> traffic_ratio
    model_mapping: dict[str, str]  # variant_name -> model_endpoint
    start_time: str
    end_time: str
    target_metrics: list[str]

class ABTestRouter:
    """A/B 测试流量路由器"""
    
    def __init__(self):
        self.experiments: list[Experiment] = []
    
    def assign_variant(self, user_id: str, experiment: Experiment) -> str:
        """基于用户 ID 的确定性分流"""
        # 使用 hash 确保同一用户始终进入同一组
        hash_input = f"{experiment.name}:{user_id}"
        hash_value = int(hashlib.sha256(hash_input.encode()).hexdigest(), 16)
        bucket = (hash_value % 10000) / 10000  # [0, 1)
        
        cumulative = 0.0
        for variant, ratio in experiment.variants.items():
            cumulative += ratio
            if bucket < cumulative:
                return variant
        
        return list(experiment.variants.keys())[-1]
    
    def route_request(self, user_id: str, request) -> str:
        """路由请求到对应模型"""
        for exp in self.active_experiments():
            if self._matches_targeting(exp, request):
                variant = self.assign_variant(user_id, exp)
                return exp.model_mapping[variant]
        
        return self.default_endpoint

# 配置示例
experiment = Experiment(
    name="llama405b_vs_qwen72b_coding",
    variants={"control": 0.5, "treatment": 0.5},
    model_mapping={
        "control": "llama-405b-endpoint",
        "treatment": "qwen-72b-endpoint",
    },
    start_time="2026-07-01",
    end_time="2026-07-31",
    target_metrics=["ttft_p95", "user_satisfaction", "cost_per_token"]
)
```

### 6.2 A/B 测试注意事项

| 注意点 | 说明 | 解决方案 |
|--------|------|---------|
| 流式输出一致性 | 同一会话不能切换模型 | Session affinity |
| 指标归因 | 区分模型差异 vs 基础设施差异 | 同集群部署 |
| 样本量 | LLM 输出方差大，需更多样本 | 功效分析计算 |
| 冷启动偏差 | 新模型需要预热 | 排除前 N 分钟数据 |
| 成本追踪 | 不同模型成本不同 | 按 variant 分账 |

---

## 七、容量规划

### 7.1 容量计算模型

```python
"""GPU 容量规划计算器"""
from dataclasses import dataclass

@dataclass
class CapacityPlan:
    model_name: str
    model_params_b: float       # 参数量 (B)
    avg_input_tokens: int       # 平均输入 Token
    avg_output_tokens: int      # 平均输出 Token
    peak_qps: float             # 峰值 QPS
    target_ttft_p95: float      # TTFT P95 目标 (s)
    target_tps_p50: float       # TPS P50 目标 (tok/s)
    gpu_type: str = "H100-80GB"

class CapacityCalculator:
    """GPU 容量规划"""
    
    GPU_SPECS = {
        "H100-80GB": {"memory_gb": 80, "tflops_bf16": 989, "bandwidth_tb_s": 3.35},
        "A100-80GB": {"memory_gb": 80, "tflops_bf16": 312, "bandwidth_tb_s": 2.0},
        "H200-141GB": {"memory_gb": 141, "tflops_bf16": 989, "bandwidth_tb_s": 4.8},
        "B200-192GB": {"memory_gb": 192, "tflops_bf16": 2250, "bandwidth_tb_s": 8.0},
    }
    
    def calculate(self, plan: CapacityPlan) -> dict:
        spec = self.GPU_SPECS[plan.gpu_type]
        
        # 1. 模型显存需求 (BF16)
        model_memory_gb = plan.model_params_b * 2  # 2 bytes per param
        
        # 2. KV Cache 显存 (per request)
        # 简化: 每 Token ~0.5KB (70B 模型)
        kv_per_request_mb = (plan.avg_input_tokens + plan.avg_output_tokens) * 0.5 / 1024
        
        # 3. 可用显存 (扣除模型和系统开销)
        available_memory_gb = spec["memory_gb"] * 0.85 - model_memory_gb
        
        # 4. 最大并发请求数
        max_concurrent = int(available_memory_gb * 1024 / kv_per_request_mb)
        
        # 5. 吞吐量估算 (Decode 阶段是 memory-bandwidth bound)
        tokens_per_second_per_gpu = spec["bandwidth_tb_s"] * 1e12 / (plan.model_params_b * 2)
        
        # 6. 所需 GPU 数量
        total_tps_needed = plan.peak_qps * plan.avg_output_tokens
        gpus_for_throughput = total_tps_needed / (tokens_per_second_per_gpu * max_concurrent / 10)
        
        # 7. TTFT 约束 (Prefill 是 compute bound)
        prefill_flops = 2 * plan.model_params_b * 1e9 * plan.avg_input_tokens
        prefill_time = prefill_flops / (spec["tflops_bf16"] * 1e12)
        gpus_for_ttft = prefill_time / plan.target_ttft_p95
        
        recommended_gpus = max(
            int(gpus_for_throughput) + 1,
            int(gpus_for_ttft) + 1,
            2  # 最少 2 个用于高可用
        )
        
        return {
            "model_memory_gb": model_memory_gb,
            "max_concurrent_requests": max_concurrent,
            "estimated_tps_per_gpu": tokens_per_second_per_gpu,
            "gpus_for_throughput": int(gpus_for_throughput) + 1,
            "gpus_for_ttft": int(gpus_for_ttft) + 1,
            "recommended_gpus": recommended_gpus,
            "recommended_replicas": (recommended_gpus + 7) // 8,  # 8 GPU per node
            "headroom_pct": 30,  # 建议 30% 余量
        }
```

### 7.2 容量规划 Checklist

| 维度 | 考虑因素 | 数据来源 |
|------|---------|---------|
| 流量预测 | 日/周/月峰值、增长趋势 | 历史监控数据 |
| 模型规格 | 参数量、精度、KV Cache 大小 | 模型 Card |
| 延迟要求 | TTFT/TPS/E2E 的 P50/P95/P99 | 产品 SLA |
| 并发需求 | 峰值并发、排队容忍度 | 业务需求 |
| 冗余要求 | N+1/N+2、多 AZ | 可靠性目标 |
| 成本约束 | GPU 预算、Spot vs On-demand | 财务 |

---

## 八、On-call 与告警设计

### 8.1 告警分级

| 级别 | 条件 | 响应时间 | 通知方式 | 示例 |
|------|------|---------|---------|------|
| P0 (Critical) | 服务完全不可用 | 5 min | 电话 + 短信 + IM | 所有 GPU 宕机 |
| P1 (High) | SLO 严重违反 | 15 min | 短信 + IM | P99 > 3x SLO |
| P2 (Medium) | SLO 轻微违反 | 1 hour | IM | P95 接近 SLO |
| P3 (Low) | 潜在风险 | 4 hours | IM/邮件 | 单 GPU ECC 错误 |
| P4 (Info) | 信息通知 | 下个工作日 | 邮件 | 容量预警 |

### 8.2 告警规则设计

```yaml
# AlertManager 路由配置
route:
  receiver: 'default'
  group_by: ['alertname', 'model', 'cluster']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty-critical'
      group_wait: 10s
      repeat_interval: 30m
    - match:
        severity: warning
      receiver: 'slack-warnings'
      repeat_interval: 4h

receivers:
  - name: 'pagerduty-critical'
    pagerduty_configs:
      - service_key: '<PAGERDUTY_KEY>'
        severity: critical
  - name: 'slack-warnings'
    slack_configs:
      - channel: '#ai-infra-alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}'
```

### 8.3 On-call Runbook 模板

```markdown
## [P1] TTFT P95 超过 SLO

### 快速诊断 (5 min)
1. 检查 Grafana Dashboard: [LLM Inference Overview]
2. 确认影响范围: 全部模型 or 特定模型?
3. 检查 GPU 利用率: `kubectl top pods -n inference`
4. 检查队列深度: `curl http://gateway/metrics | grep queue`

### 常见原因与处理
| 原因 | 验证方式 | 处理 |
|------|---------|------|
| 流量突增 | QPS 曲线 | 手动扩容 / 触发 HPA |
| GPU 故障 | DCGM 告警 | 隔离节点，重新调度 |
| 模型加载 | Pod 重启日志 | 等待预热完成 |
| 网络延迟 | IB 错误计数 | 联系网络团队 |
| 长输入请求 | 输入 Token 分布 | 启用输入长度限制 |

### 升级条件
- 15 min 内未恢复 → 升级 P0
- 影响 > 50% 用户 → 立即升级
```

---

## 九、生产案例

### 案例 1: 流式输出中断

```
现象: 用户报告流式输出中途停止
影响: 约 2% 请求
根因: Nginx proxy_read_timeout 默认 60s，长输出超时
修复: 
  - proxy_read_timeout 300s
  - 添加 heartbeat (每 15s 发送空 SSE event)
  - 客户端添加断线重连
教训: 流式场景需要全链路超时对齐
```

### 案例 2: 扩容后延迟反而升高

```
现象: HPA 扩容后 P95 延迟从 2s 升到 5s
影响: 扩容后 5 分钟内所有请求
根因: 新 Pod 模型加载需要 3 分钟，期间请求被路由到未就绪 Pod
修复:
  - 添加 startupProbe (initialDelaySeconds=180)
  - Readiness gate: 模型预热完成后才标记 Ready
  - 使用 PodWarmup hook
教训: GPU 服务扩容 ≠ 即时可用，需要预热机制
```

### 案例 3: Error Budget 驱动的发布决策

```
背景: 月度 Error Budget 剩余 15%，产品要求发布新模型版本
决策: 
  - 新模型上线属于高风险变更
  - 按策略，Budget < 25% 时禁止高风险变更
  - 妥协: 先对 1% 流量灰度，观察 48h
  - 结果: 新模型 TTFT P95 超标 → 回滚 → 避免了 SLO 违反
教训: Error Budget 是客观决策依据，避免主观判断
```

---

## 十、工具对比表

| 工具 | 类别 | 核心功能 | 适用场景 |
|------|------|---------|---------|
| Prometheus | 监控 | 指标采集/存储/告警 | 所有规模 |
| Grafana | 可视化 | Dashboard/告警面板 | 所有规模 |
| OpenSLO | SLO 管理 | SLO 定义/Budget 追踪 | 中大规模 |
| Sloth | SLO 管理 | Prometheus SLO 生成器 | K8s 环境 |
| KEDA | 扩缩容 | 事件驱动自动扩缩 | K8s 环境 |
| Istio | 流量管理 | A/B 09_测试/金丝雀/熔断 | 服务网格 |
| Envoy | 代理 | 负载均衡/限流/路由 | 高性能网关 |
| vLLM | 推理引擎 | 高吞吐推理/连续批处理 | GPU 推理 |
| Triton | 推理服务 | 多模型服务/动态批处理 | 多模型 |
| PagerDuty | On-call | 告警路由/升级/排班 | 所有规模 |
| Kubecost | 成本 | GPU 成本追踪/分账 | K8s 环境 |

---

## 十一、最佳实践

### 11.1 SLO 设计原则

1. **从用户视角定义** — TTFT 比 GPU 利用率更接近用户体验
2. **少即是多** — 3-5 个核心 SLO 足够，不要过度定义
3. **可测量** — 每个 SLI 必须有明确的数据源和计算方式
4. **留有余量** — 内部 SLO 比外部 SLA 严格 0.05-0.1%
5. **定期回顾** — 每月 Review SLO 是否合理，调整目标

### 11.2 运维黄金法则

1. **Error Budget 是契约** — 开发团队和 SRE 团队共同遵守
2. **告警必须可操作** — 每条告警对应一个 Runbook
3. **自动化响应** — P3 以下告警应自动处理
4. **演练降级** — 定期测试降级策略是否有效
5. **全链路追踪** — 从 Gateway 到 GPU 的完整 Trace

---

## 十二、2026 趋势

| 趋势 | 说明 | 影响 |
|------|------|------|
| 推理即服务 (Inference-as-a-Service) | 云厂商托管推理 SLA | SLA 管理外包 |
| 多模型编排 SLA | Agent 调用多模型的复合 SLO | 更复杂的 Budget 计算 |
| AI 驱动的容量规划 | 用 AI 预测流量和容量需求 | 减少人工规划 |
| 边缘推理 SLA | 端侧推理的延迟保证 | 新的 SLI 维度 |
| 成本感知 SLO | SLO 与成本联合优化 | 性价比导向 |
| 自适应 SLO | 根据系统状态动态调整 SLO | 弹性承诺 |
| 统一可观测性 | Metrics + Traces + Logs 融合 | 更快根因定位 |

---

## 十三、相关概念

- [[13_运维/02_SRE与可靠性/22_SRE_for_AI_系统]] — AI 系统 SRE 实践总纲
- [[SLO_Error_Budget_AI_Deep_Dive]] — Error Budget 深度解析
- [[13_运维/02_SRE与可靠性/18_LLM推理_SLO_指南]] — LLM 推理 SLO 指南
- [[13_运维/02_SRE与可靠性/19_LLM推理_Slow_Unavailable_操作手册]] — 推理慢/不可用 Runbook
- [[GPU_Cluster_Operations_2026]] — GPU 集群运维
- [[13_运维/02_SRE与可靠性/01_AI_故障应急_Playbook]] — AI 事故响应手册
- [[13_运维/02_SRE与可靠性/09_成本优化_AI_深入分析]] — AI 成本优化
- [[13_运维/02_SRE与可靠性/06_Chaos_工程_AI]] — AI 系统混沌工程
- [[13_运维/02_SRE与可靠性/15_故障应急_for_AI_系统]] — AI 系统事故响应
