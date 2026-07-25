---
title: 'AI 系统容量规划指南 (Capacity Planning 2026)'
category: '12-architecture-infrastructure'
tags: ["architecture", "infrastructure", "kubernetes", "high-availability"]
summary: '> **一句话理解**: 容量规划是 AI 系统的"预算管理"——预测未来负载、评估资源需求、制定扩缩容策略，确保系统在满足 SLA 的同时控制成本。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Capacity Planning 2026"
  - Capacity_Planning_2026
sources: []

---
# AI 系统容量规划指南 (Capacity Planning 2026)

> **一句话理解**: 容量规划是 AI 系统的"预算管理"——预测未来负载、评估资源需求、制定扩缩容策略，确保系统在满足 SLA 的同时控制成本。

> **相关文档**: [AI 基础设施指南](./AI_Infrastructure_2026.md) | [成本优化](./AI_Cost_Optimization_2026.md) | [高可用设计](./High_Availability_2026.md) | [AI 系统架构](./AI_System_Architecture_2026.md)

---

## 1. 容量规划概述

### 1.1 为什么需要容量规划？

| 挑战 | 无规划 | 有规划 |
|-----|-------|-------|
| **突发流量** | 服务崩溃、用户流失 | 自动扩容、平稳应对 |
| **成本失控** | 资源浪费、预算超支 | 精准配置、成本可控 |
| **性能下降** | 用户投诉、业务损失 | 提前预警、及时优化 |
| **资源浪费** | 过度配置、闲置浪费 | 按需配置、弹性伸缩 |

### 1.2 AI 系统容量规划特点

```
传统 Web 服务 vs AI 服务容量规划

传统 Web 服务:
├── 资源: CPU、内存、带宽
├── 计算: 固定算法，可预测
├── 响应时间: 毫秒级
└── 成本: 基础设施成本

AI 服务:
├── 资源: GPU、显存、Token 配额
├── 计算: 模型推理，Token 相关
├── 响应时间: 秒级到分钟级
├── 成本: GPU + API Token
└── 特殊考量: 模型版本、上下文长度、温度参数
```

### 1.3 规划周期与目标

| 规划类型 | 周期 | 目标 |
|---------|------|------|
| **实时调度** | 秒/分钟 | 自动扩缩容、负载均衡 |
| **短期规划** | 天/周 | 资源预分配、成本控制 |
| **中期规划** | 月 | 容量评估、采购决策 |
| **长期规划** | 季度/年 | 架构演进、预算制定 |

---

## 2. 负载建模

### 2.1 请求特征分析

```python
"""
AI 系统请求特征分析
"""

from dataclasses import dataclass
from typing import List, Dict, Optional
from datetime import datetime
import numpy as np

@dataclass
class RequestProfile:
    """请求画像"""
    request_id: str
    timestamp: datetime
    
    # 请求属性
    request_type: str        # chat, completion, embedding, etc.
    model: str               # gpt-4, claude-3, etc.
    
    # Token 相关
    prompt_tokens: int
    max_completion_tokens: int
    actual_completion_tokens: int
    
    # 性能指标
    latency_ms: float
    queue_time_ms: float
    processing_time_ms: float
    
    # 资源消耗
    gpu_memory_mb: float
    gpu_utilization: float
    cpu_utilization: float
    
    # 成本
    cost_usd: float
    
    # 上下文
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    priority: int = 0


class RequestAnalyzer:
    """请求分析器"""
    
    def __init__(self, profiles: List[RequestProfile]):
        self.profiles = profiles
    
    def analyze_by_model(self) -> Dict[str, Dict]:
        """按模型分析"""
        results = {}
        
        for profile in self.profiles:
            model = profile.model
            if model not in results:
                results[model] = {
                    'count': 0,
                    'total_tokens': 0,
                    'total_latency_ms': 0,
                    'total_cost': 0,
                    'latencies': [],
                    'prompt_tokens': [],
                    'completion_tokens': []
                }
            
            results[model]['count'] += 1
            results[model]['total_tokens'] += profile.prompt_tokens + profile.actual_completion_tokens
            results[model]['total_latency_ms'] += profile.latency_ms
            results[model]['total_cost'] += profile.cost_usd
            results[model]['latencies'].append(profile.latency_ms)
            results[model]['prompt_tokens'].append(profile.prompt_tokens)
            results[model]['completion_tokens'].append(profile.actual_completion_tokens)
        
        # 计算统计量
        for model, data in results.items():
            data['avg_latency_ms'] = np.mean(data['latencies'])
            data['p50_latency_ms'] = np.percentile(data['latencies'], 50)
            data['p95_latency_ms'] = np.percentile(data['latencies'], 95)
            data['p99_latency_ms'] = np.percentile(data['latencies'], 99)
            data['avg_prompt_tokens'] = np.mean(data['prompt_tokens'])
            data['avg_completion_tokens'] = np.mean(data['completion_tokens'])
            data['tokens_per_request'] = data['total_tokens'] / data['count']
        
        return results
    
    def analyze_by_hour(self) -> Dict[int, Dict]:
        """按时段分析"""
        hourly = {}
        
        for profile in self.profiles:
            hour = profile.timestamp.hour
            if hour not in hourly:
                hourly[hour] = {'count': 0, 'total_tokens': 0, 'total_cost': 0}
            
            hourly[hour]['count'] += 1
            hourly[hour]['total_tokens'] += profile.prompt_tokens + profile.actual_completion_tokens
            hourly[hour]['total_cost'] += profile.cost_usd
        
        return hourly
    
    def calculate_peak_metrics(self) -> Dict:
        """计算峰值指标"""
        hourly = self.analyze_by_hour()
        
        peak_hour = max(hourly.items(), key=lambda x: x[1]['count'])
        avg_count = np.mean([h['count'] for h in hourly.values()])
        
        return {
            'peak_hour': peak_hour[0],
            'peak_requests': peak_hour[1]['count'],
            'peak_tokens': peak_hour[1]['total_tokens'],
            'peak_cost': peak_hour[1]['total_cost'],
            'peak_to_avg_ratio': peak_hour[1]['count'] / avg_count if avg_count > 0 else 1,
            'avg_hourly_requests': avg_count
        }
```

### 2.2 流量预测模型

```python
"""
流量预测模型
"""

import numpy as np
from typing import Tuple, List
from datetime import datetime, timedelta

class TrafficForecaster:
    """流量预测器"""
    
    def __init__(self, historical_data: List[Tuple[datetime, int]]):
        """
        Args:
            historical_data: [(timestamp, request_count), ...]
        """
        self.data = historical_data
        self.timestamps = [d[0] for d in historical_data]
        self.counts = [d[1] for d in historical_data]
    
    def forecast_arima(
        self, 
        periods: int = 24
    ) -> Tuple[List[float], List[float]]:
        """
        ARIMA 预测 (简化版)
        
        Returns:
            (predictions, confidence_intervals)
        """
        from statsmodels.tsa.arima.model import ARIMA
        
        series = np.array(self.counts)
        model = ARIMA(series, order=(2, 1, 2))
        fitted = model.fit()
        
        forecast = fitted.forecast(periods)
        predictions = forecast.tolist()
        
        # 简化的置信区间
        std_error = np.std(self.counts[-24:])  # 最近24小时的标准差
        confidence_intervals = [
            (p - 1.96 * std_error, p + 1.96 * std_error)
            for p in predictions
        ]
        
        return predictions, confidence_intervals
    
    def forecast_prophet(
        self,
        periods: int = 24,
        include_holidays: bool = True
    ) -> Tuple[List[float], List[float]]:
        """
        Prophet 预测
        
        更适合处理:
        - 季节性模式
        - 节假日效应
        - 趋势变化
        """
        try:
            from prophet import Prophet
            import pandas as pd
            
            df = pd.DataFrame({
                'ds': self.timestamps,
                'y': self.counts
            })
            
            model = Prophet(
                daily_seasonality=True,
                weekly_seasonality=True,
                yearly_seasonality=True
            )
            
            if include_holidays:
                # 添加节假日效应
                model.add_country_holidays(country_name='CN')
            
            model.fit(df)
            
            future = model.make_future_dataframe(periods=periods, freq='H')
            forecast = model.predict(future)
            
            predictions = forecast['yhat'].tail(periods).tolist()
            lower = forecast['yhat_lower'].tail(periods).tolist()
            upper = forecast['yhat_upper'].tail(periods).tolist()
            
            return predictions, list(zip(lower, upper))
            
        except ImportError:
            # 回退到简单预测
            return self._simple_forecast(periods)
    
    def _simple_forecast(self, periods: int) -> Tuple[List[float], List[float]]:
        """简单预测 (移动平均)"""
        window = min(24, len(self.counts))
        avg = np.mean(self.counts[-window:])
        
        predictions = [avg] * periods
        std = np.std(self.counts[-window:])
        confidence_intervals = [
            (avg - 1.96 * std, avg + 1.96 * std)
            for _ in range(periods)
        ]
        
        return predictions, confidence_intervals
    
    def calculate_growth_rate(self) -> float:
        """计算增长率"""
        if len(self.counts) < 2:
            return 0.0
        
        # 计算周环比增长率
        weekly_totals = []
        for i in range(0, len(self.counts), 168):  # 168 = 7 * 24
            weekly_totals.append(sum(self.counts[i:i+168]))
        
        if len(weekly_totals) >= 2:
            return (weekly_totals[-1] - weekly_totals[-2]) / weekly_totals[-2]
        
        return 0.0


class SeasonalPattern:
    """季节性模式分析"""
    
    @staticmethod
    def analyze_daily_pattern(
        hourly_data: Dict[int, int]
    ) -> Dict[str, any]:
        """分析日模式"""
        counts = [hourly_data.get(h, 0) for h in range(24)]
        
        peak_hour = np.argmax(counts)
        low_hour = np.argmin(counts)
        
        return {
            'peak_hour': peak_hour,
            'peak_ratio': counts[peak_hour] / np.mean(counts) if np.mean(counts) > 0 else 1,
            'low_hour': low_hour,
            'low_ratio': counts[low_hour] / np.mean(counts) if np.mean(counts) > 0 else 1,
            'pattern_type': 'business_hours' if peak_hour in range(9, 18) else 'off_hours'
        }
    
    @staticmethod
    def analyze_weekly_pattern(
        daily_data: Dict[int, int]  # weekday -> count
    ) -> Dict[str, any]:
        """分析周模式"""
        weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        counts = [daily_data.get(i, 0) for i in range(7)]
        
        return {
            'weekday_avg': np.mean(counts[:5]),
            'weekend_avg': np.mean(counts[5:]),
            'weekend_ratio': np.mean(counts[5:]) / np.mean(counts[:5]) if np.mean(counts[:5]) > 0 else 1,
            'peak_day': weekdays[np.argmax(counts)],
            'pattern_type': 'weekday_heavy' if np.mean(counts[:5]) > np.mean(counts[5:]) else 'weekend_heavy'
        }
```

---

## 3. 资源需求计算

### 3.1 GPU 显存计算

```python
"""
GPU 显存需求计算
"""

from dataclasses import dataclass
from typing import List, Optional

@dataclass
class ModelConfig:
    """模型配置"""
    name: str
    parameters_billion: float
    hidden_size: int
    num_layers: int
    num_heads: int
    vocab_size: int
    max_sequence_length: int
    precision: str = "fp16"  # fp16, fp32, int8, int4

class GPUMemoryCalculator:
    """GPU 显存计算器"""
    
    # 常见 GPU 规格
    GPU_SPECS = {
        'A100-40GB': {'memory_gb': 40, 'memory_bandwidth_gbps': 1559},
        'A100-80GB': {'memory_gb': 80, 'memory_bandwidth_gbps': 2039},
        'H100-80GB': {'memory_gb': 80, 'memory_bandwidth_gbps': 3352},
        'L40S-48GB': {'memory_gb': 48, 'memory_bandwidth_gbps': 864},
        'V100-32GB': {'memory_gb': 32, 'memory_bandwidth_gbps': 900},
        'RTX4090-24GB': {'memory_gb': 24, 'memory_bandwidth_gbps': 1008},
    }
    
    def __init__(self, model_config: ModelConfig):
        self.config = model_config
    
    def calculate_model_weights(self) -> float:
        """计算模型权重显存 (GB)"""
        params = self.config.parameters_billion * 1e9
        
        precision_bytes = {
            'fp32': 4,
            'fp16': 2,
            'int8': 1,
            'int4': 0.5
        }
        
        bytes_per_param = precision_bytes.get(self.config.precision, 2)
        memory_bytes = params * bytes_per_param
        memory_gb = memory_bytes / (1024 ** 3)
        
        return memory_gb
    
    def calculate_kv_cache(
        self,
        batch_size: int,
        sequence_length: int
    ) -> float:
        """
        计算 KV Cache 显存 (GB)
        
        KV Cache = 2 * num_layers * batch_size * sequence_length * hidden_size * bytes_per_element
        """
        bytes_per_element = 2 if self.config.precision in ['fp16', 'int8'] else 4
        
        kv_cache_bytes = (
            2 *  # K 和 V
            self.config.num_layers *
            batch_size *
            sequence_length *
            self.config.hidden_size *
            bytes_per_element
        )
        
        return kv_cache_bytes / (1024 ** 3)
    
    def calculate_activation_memory(
        self,
        batch_size: int,
        sequence_length: int
    ) -> float:
        """
        计算激活内存 (GB)
        
        激活内存 ≈ batch_size * sequence_length * hidden_size * num_layers * bytes_per_element
        """
        bytes_per_element = 2 if self.config.precision == 'fp16' else 4
        
        activation_bytes = (
            batch_size *
            sequence_length *
            self.config.hidden_size *
            self.config.num_layers *
            bytes_per_element *
            2  # 估算因子
        )
        
        return activation_bytes / (1024 ** 3)
    
    def calculate_total_memory(
        self,
        batch_size: int,
        sequence_length: int,
        overhead_factor: float = 1.1
    ) -> float:
        """计算总显存需求 (GB)"""
        model_weights = self.calculate_model_weights()
        kv_cache = self.calculate_kv_cache(batch_size, sequence_length)
        activation = self.calculate_activation_memory(batch_size, sequence_length)
        
        total = (model_weights + kv_cache + activation) * overhead_factor
        
        return total
    
    def recommend_gpu(
        self,
        batch_size: int,
        sequence_length: int,
        utilization_target: float = 0.8
    ) -> List[str]:
        """推荐合适的 GPU"""
        required_memory = self.calculate_total_memory(batch_size, sequence_length)
        required_with_util = required_memory / utilization_target
        
        recommendations = []
        for gpu_name, specs in self.GPU_SPECS.items():
            if specs['memory_gb'] >= required_with_util:
                recommendations.append(gpu_name)
        
        return recommendations
    
    def calculate_max_batch_size(
        self,
        gpu_memory_gb: float,
        sequence_length: int,
        utilization_target: float = 0.8
    ) -> int:
        """计算最大批处理大小"""
        available_memory = gpu_memory_gb * utilization_target
        
        # 模型权重是固定的
        model_weights = self.calculate_model_weights()
        remaining_memory = available_memory - model_weights
        
        if remaining_memory <= 0:
            return 0
        
        # 二分查找最大 batch size
        low, high = 1, 256
        best_batch = 1
        
        while low <= high:
            mid = (low + high) // 2
            memory_needed = (
                self.calculate_kv_cache(mid, sequence_length) +
                self.calculate_activation_memory(mid, sequence_length)
            )
            
            if memory_needed <= remaining_memory:
                best_batch = mid
                low = mid + 1
            else:
                high = mid - 1
        
        return best_batch


# 常见模型配置预设
MODEL_CONFIGS = {
    'llama-7b': ModelConfig(
        name='LLaMA-7B',
        parameters_billion=7,
        hidden_size=4096,
        num_layers=32,
        num_heads=32,
        vocab_size=32000,
        max_sequence_length=2048
    ),
    'llama-70b': ModelConfig(
        name='LLaMA-70B',
        parameters_billion=70,
        hidden_size=8192,
        num_layers=80,
        num_heads=64,
        vocab_size=32000,
        max_sequence_length=4096
    ),
    'qwen-72b': ModelConfig(
        name='Qwen-72B',
        parameters_billion=72,
        hidden_size=8192,
        num_layers=80,
        num_heads=64,
        vocab_size=151936,
        max_sequence_length=32768
    ),
}


# 使用示例
def calculate_deployment_requirements(
    model_name: str,
    expected_qps: int,
    avg_sequence_length: int,
    target_latency_ms: float = 500
) -> dict:
    """计算部署需求"""
    config = MODEL_CONFIGS.get(model_name)
    if not config:
        raise ValueError(f"Unknown model: {model_name}")
    
    calculator = GPUMemoryCalculator(config)
    
    # 估算所需批处理大小
    # batch_size ≈ QPS * target_latency / 1000
    estimated_batch = int(expected_qps * target_latency_ms / 1000)
    
    # 计算显存需求
    memory_needed = calculator.calculate_total_memory(
        batch_size=estimated_batch,
        sequence_length=avg_sequence_length
    )
    
    # 推荐 GPU
    recommended_gpus = calculator.recommend_gpu(
        estimated_batch,
        avg_sequence_length
    )
    
    return {
        'model': model_name,
        'estimated_batch_size': estimated_batch,
        'memory_required_gb': memory_needed,
        'recommended_gpus': recommended_gpus,
        'avg_sequence_length': avg_sequence_length
    }
```

### 3.2 吞吐量计算

```python
"""
系统吞吐量计算
"""

from dataclasses import dataclass
from typing import List, Dict
import math

@dataclass
class ThroughputMetrics:
    """吞吐量指标"""
    requests_per_second: float
    tokens_per_second: float
    batch_size: int
    num_gpus: int
    latency_ms: float
    utilization: float

class ThroughputCalculator:
    """吞吐量计算器"""
    
    # 经验数据：不同模型在不同 GPU 上的吞吐量
    # 单位: tokens/sec/GPU
    THROUGHPUT_BENCHMARKS = {
        ('llama-7b', 'A100-40GB'): 12000,
        ('llama-7b', 'A100-80GB'): 11000,
        ('llama-7b', 'H100-80GB'): 18000,
        ('llama-70b', 'A100-80GB'): 2500,
        ('llama-70b', 'H100-80GB'): 4000,
        ('qwen-72b', 'A100-80GB'): 2200,
        ('qwen-72b', 'H100-80GB'): 3500,
    }
    
    def __init__(self, model_name: str, gpu_type: str):
        self.model_name = model_name
        self.gpu_type = gpu_type
        
        self.base_throughput = self.THROUGHPUT_BENCHMARKS.get(
            (model_name, gpu_type), 5000
        )
    
    def calculate_qps(
        self,
        avg_tokens_per_request: int,
        num_gpus: int,
        target_latency_ms: float = None,
        batch_size: int = None
    ) -> ThroughputMetrics:
        """
        计算 QPS
        
        两种模式:
        1. 已知批处理大小 -> 计算 QPS 和延迟
        2. 已知目标延迟 -> 计算最优批处理大小和 QPS
        """
        if batch_size:
            # 模式1：已知批处理大小
            throughput = self.base_throughput * num_gpus
            latency = (batch_size * avg_tokens_per_request) / throughput * 1000
            qps = throughput / avg_tokens_per_request
            
        elif target_latency_ms:
            # 模式2：已知目标延迟
            # 最优批处理大小 = 目标延迟 * 吞吐量 / 1000
            throughput = self.base_throughput * num_gpus
            batch_size = int(target_latency_ms * throughput / 1000 / avg_tokens_per_request)
            batch_size = max(1, batch_size)
            
            latency = (batch_size * avg_tokens_per_request) / throughput * 1000
            qps = throughput / avg_tokens_per_request
        
        else:
            raise ValueError("必须提供 batch_size 或 target_latency_ms")
        
        utilization = min(1.0, qps / (self.base_throughput * num_gpus / avg_tokens_per_request))
        
        return ThroughputMetrics(
            requests_per_second=qps,
            tokens_per_second=self.base_throughput * num_gpus,
            batch_size=batch_size,
            num_gpus=num_gpus,
            latency_ms=latency,
            utilization=utilization
        )
    
    def calculate_gpu_count(
        self,
        target_qps: float,
        avg_tokens_per_request: int,
        max_latency_ms: float
    ) -> int:
        """计算所需 GPU 数量"""
        # 估算单 GPU 最大 QPS
        max_latency_sec = max_latency_ms / 1000
        single_gpu_qps = self.base_throughput / avg_tokens_per_request
        
        # 考虑延迟约束
        batch_per_latency = single_gpu_qps * max_latency_sec
        if batch_per_latency < 1:
            # 需要多 GPU 才能满足延迟
            gpus_for_latency = math.ceil(1 / batch_per_latency)
        else:
            gpus_for_latency = 1
        
        # 考虑 QPS 约束
        gpus_for_qps = math.ceil(target_qps / single_gpu_qps)
        
        return max(gpus_for_latency, gpus_for_qps)
    
    def optimize_batch_size(
        self,
        gpu_memory_gb: float,
        sequence_length: int,
        model_params_billion: float
    ) -> int:
        """优化批处理大小"""
        # 简化计算：基于显存和模型大小
        model_memory_gb = model_params_billion * 2 / 1024  # fp16
        available_memory = gpu_memory_gb - model_memory_gb
        
        # KV Cache 估算
        # 每个 token 约占用 2KB (简化估算)
        kv_cache_per_token = 0.002  # GB
        
        # 最大批处理大小
        max_batch = int(available_memory / (sequence_length * kv_cache_per_token))
        
        # 实际最优批处理大小通常在最大值的 60-80%
        optimal_batch = int(max_batch * 0.7)
        
        return max(1, optimal_batch)


class CapacityPlanningResult:
    """容量规划结果"""
    
    def __init__(self):
        self.scenarios = []
    
    def add_scenario(
        self,
        name: str,
        qps: float,
        latency_ms: float,
        num_gpus: int,
        gpu_type: str,
        cost_per_hour: float,
        details: dict = None
    ):
        """添加场景"""
        self.scenarios.append({
            'name': name,
            'qps': qps,
            'latency_ms': latency_ms,
            'num_gpus': num_gpus,
            'gpu_type': gpu_type,
            'cost_per_hour': cost_per_hour,
            'details': details or {}
        })
    
    def get_recommendation(self) -> dict:
        """获取推荐方案"""
        if not self.scenarios:
            return None
        
        # 按性价比排序
        for s in self.scenarios:
            s['cost_per_qps'] = s['cost_per_hour'] / s['qps'] if s['qps'] > 0 else float('inf')
        
        sorted_scenarios = sorted(self.scenarios, key=lambda x: x['cost_per_qps'])
        
        return sorted_scenarios[0]
    
    def generate_report(self) -> str:
        """生成报告"""
        lines = []
        lines.append("=" * 80)
        lines.append("CAPACITY PLANNING REPORT")
        lines.append("=" * 80)
        
        for s in self.scenarios:
            lines.append(f"\n### {s['name']} ###")
            lines.append(f"  QPS: {s['qps']:.2f}")
            lines.append(f"  Latency: {s['latency_ms']:.0f}ms")
            lines.append(f"  GPUs: {s['num_gpus']}x {s['gpu_type']}")
            lines.append(f"  Cost: ${s['cost_per_hour']:.2f}/hour")
            lines.append(f"  Cost/QPS: ${s.get('cost_per_qps', 0):.4f}/hour")
        
        recommendation = self.get_recommendation()
        if recommendation:
            lines.append("\n" + "=" * 80)
            lines.append("RECOMMENDATION")
            lines.append("=" * 80)
            lines.append(f"  Recommended: {recommendation['name']}")
            lines.append(f"  Reason: Best cost-performance ratio")
        
        return '\n'.join(lines)
```

---

## 4. 成本估算

### 4.1 成本模型

```python
"""
AI 服务成本模型
"""

from dataclasses import dataclass
from typing import Dict, List
from enum import Enum

class CostType(Enum):
    GPU_COMPUTE = "gpu_compute"
    API_TOKENS = "api_tokens"
    STORAGE = "storage"
    NETWORK = "network"
    INFRASTRUCTURE = "infrastructure"

@dataclass
class PricingConfig:
    """定价配置"""
    # GPU 价格 (美元/小时)
    gpu_prices: Dict[str, float] = None
    
    # API Token 价格 (美元/千Token)
    token_prices: Dict[str, Dict[str, float]] = None
    
    # 存储价格 (美元/GB/月)
    storage_price_per_gb: float = 0.023
    
    # 网络价格 (美元/GB)
    network_price_per_gb: float = 0.09
    
    def __post_init__(self):
        if self.gpu_prices is None:
            self.gpu_prices = {
                'A100-40GB': 2.50,
                'A100-80GB': 3.50,
                'H100-80GB': 4.50,
                'L40S-48GB': 1.50,
                'V100-32GB': 1.20,
                'RTX4090-24GB': 0.80,
            }
        
        if self.token_prices is None:
            self.token_prices = {
                'gpt-4-turbo': {'input': 0.01, 'output': 0.03},
                'gpt-4': {'input': 0.03, 'output': 0.06},
                'gpt-3.5-turbo': {'input': 0.0005, 'output': 0.0015},
                'claude-3-opus': {'input': 0.015, 'output': 0.075},
                'claude-3-sonnet': {'input': 0.003, 'output': 0.015},
                'claude-3-haiku': {'input': 0.00025, 'output': 0.00125},
            }

class CostEstimator:
    """成本估算器"""
    
    def __init__(self, pricing: PricingConfig = None):
        self.pricing = pricing or PricingConfig()
    
    def estimate_gpu_cost(
        self,
        gpu_type: str,
        num_gpus: int,
        hours_per_month: float = 730
    ) -> float:
        """估算 GPU 成本"""
        hourly_rate = self.pricing.gpu_prices.get(gpu_type, 2.0)
        return num_gpus * hourly_rate * hours_per_month
    
    def estimate_api_cost(
        self,
        model: str,
        input_tokens: int,
        output_tokens: int
    ) -> float:
        """估算 API 成本"""
        prices = self.pricing.token_prices.get(model, {'input': 0.01, 'output': 0.03})
        
        input_cost = (input_tokens / 1000) * prices['input']
        output_cost = (output_tokens / 1000) * prices['output']
        
        return input_cost + output_cost
    
    def estimate_monthly_api_cost(
        self,
        model: str,
        daily_requests: int,
        avg_input_tokens: int,
        avg_output_tokens: int
    ) -> float:
        """估算月度 API 成本"""
        daily_cost = daily_requests * self.estimate_api_cost(
            model, avg_input_tokens, avg_output_tokens
        )
        return daily_cost * 30
    
    def compare_hosted_vs_api(
        self,
        model: str,
        monthly_requests: int,
        avg_input_tokens: int,
        avg_output_tokens: int,
        gpu_type: str = 'A100-80GB',
        num_gpus: int = 2
    ) -> Dict:
        """比较自托管和 API 调用成本"""
        # API 成本
        api_cost = monthly_requests * self.estimate_api_cost(
            model, avg_input_tokens, avg_output_tokens
        )
        
        # 自托管成本
        hosted_cost = self.estimate_gpu_cost(gpu_type, num_gpus)
        
        # 添加运维成本 (估算为 GPU 成本的 20%)
        hosted_cost *= 1.2
        
        # 计算盈亏平衡点
        if api_cost > 0:
            break_even_requests = hosted_cost / (api_cost / monthly_requests)
        else:
            break_even_requests = float('inf')
        
        return {
            'api_cost_monthly': api_cost,
            'hosted_cost_monthly': hosted_cost,
            'savings_monthly': api_cost - hosted_cost,
            'break_even_requests': break_even_requests,
            'recommendation': 'hosted' if hosted_cost < api_cost else 'api'
        }
    
    def generate_cost_report(
        self,
        scenarios: List[Dict]
    ) -> str:
        """生成成本报告"""
        lines = []
        lines.append("=" * 80)
        lines.append("COST ANALYSIS REPORT")
        lines.append("=" * 80)
        
        for s in scenarios:
            lines.append(f"\n### {s['name']} ###")
            lines.append(f"  GPU Cost: ${s.get('gpu_cost', 0):,.2f}/month")
            lines.append(f"  API Cost: ${s.get('api_cost', 0):,.2f}/month")
            lines.append(f"  Storage Cost: ${s.get('storage_cost', 0):,.2f}/month")
            lines.append(f"  Network Cost: ${s.get('network_cost', 0):,.2f}/month")
            lines.append(f"  Total: ${s.get('total_cost', 0):,.2f}/month")
        
        return '\n'.join(lines)


class BudgetPlanner:
    """预算规划器"""
    
    def __init__(self, monthly_budget: float):
        self.budget = monthly_budget
    
    def allocate_budget(
        self,
        expected_qps: float,
        avg_tokens_per_request: int,
        latency_sla_ms: float
    ) -> Dict:
        """在预算约束下分配资源"""
        # 预算分配策略
        allocation = {
            'gpu_compute': self.budget * 0.60,  # 60% 用于计算
            'api_tokens': self.budget * 0.25,   # 25% 用于 API
            'storage': self.budget * 0.10,      # 10% 用于存储
            'network': self.budget * 0.05,      # 5% 用于网络
        }
        
        # 计算可支撑的 QPS
        avg_tokens = avg_tokens_per_request * 2  # input + output
        
        # 假设平均 token 成本
        avg_token_cost = 0.01 / 1000  # $0.01 per 1K tokens
        
        max_qps_from_api = (allocation['api_tokens'] / 30 / 24 / 3600) / (avg_tokens * avg_token_cost)
        
        return {
            'allocation': allocation,
            'max_supported_qps': min(expected_qps, max_qps_from_api),
            'budget_utilization': expected_qps / max_qps_from_api if max_qps_from_api > 0 else 1.0
        }
```

---

## 5. 扩缩容策略

### 5.1 自动扩缩容配置

```yaml
# Kubernetes HPA 配置示例
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: llm-inference-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: llm-inference
  minReplicas: 2
  maxReplicas: 20
  metrics:
    # 基于 CPU 利用率
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    
    # 基于自定义指标 (请求队列深度)
    - type: Pods
      pods:
        metric:
          name: request_queue_depth
        target:
          type: AverageValue
          averageValue: 10
    
    # 基于自定义指标 (QPS)
    - type: Pods
      pods:
        metric:
          name: requests_per_second
        target:
          type: AverageValue
          averageValue: 100
  
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300  # 5分钟稳定窗口
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Percent
          value: 100
          periodSeconds: 30
        - type: Pods
          value: 4
          periodSeconds: 30
      selectPolicy: Max
```

### 5.2 扩缩容决策逻辑

```python
"""
自动扩缩容决策引擎
"""

from dataclasses import dataclass
from typing import List, Optional
from enum import Enum
import time

class ScalingAction(Enum):
    SCALE_UP = "scale_up"
    SCALE_DOWN = "scale_down"
    NO_ACTION = "no_action"

@dataclass
class ScalingDecision:
    """扩缩容决策"""
    action: ScalingAction
    current_replicas: int
    target_replicas: int
    reason: str
    confidence: float

class ScalingEngine:
    """扩缩容引擎"""
    
    def __init__(
        self,
        min_replicas: int = 2,
        max_replicas: int = 20,
        scale_up_threshold: float = 0.8,
        scale_down_threshold: float = 0.3,
        cooldown_seconds: int = 300
    ):
        self.min_replicas = min_replicas
        self.max_replicas = max_replicas
        self.scale_up_threshold = scale_up_threshold
        self.scale_down_threshold = scale_down_threshold
        self.cooldown_seconds = cooldown_seconds
        
        self.last_scaling_time = 0
        self.current_replicas = min_replicas
    
    def evaluate(
        self,
        metrics: dict,
        predicted_load: Optional[float] = None
    ) -> ScalingDecision:
        """
        评估是否需要扩缩容
        
        Args:
            metrics: {
                'cpu_utilization': float,
                'gpu_utilization': float,
                'memory_utilization': float,
                'queue_depth': int,
                'avg_latency_ms': float,
                'qps': float
            }
            predicted_load: 预测的未来负载 (QPS)
        """
        # 检查冷却期
        if time.time() - self.last_scaling_time < self.cooldown_seconds:
            return ScalingDecision(
                action=ScalingAction.NO_ACTION,
                current_replicas=self.current_replicas,
                target_replicas=self.current_replicas,
                reason="In cooldown period",
                confidence=1.0
            )
        
        # 计算综合利用率
        utilization = self._calculate_utilization(metrics)
        
        # 基于当前指标和预测负载做决策
        if utilization > self.scale_up_threshold:
            return self._scale_up(metrics, predicted_load)
        elif utilization < self.scale_down_threshold:
            return self._scale_down(metrics)
        else:
            return ScalingDecision(
                action=ScalingAction.NO_ACTION,
                current_replicas=self.current_replicas,
                target_replicas=self.current_replicas,
                reason=f"Utilization normal ({utilization:.1%})",
                confidence=0.8
            )
    
    def _calculate_utilization(self, metrics: dict) -> float:
        """计算综合利用率"""
        weights = {
            'gpu_utilization': 0.5,
            'cpu_utilization': 0.2,
            'memory_utilization': 0.15,
            'queue_depth_factor': 0.15
        }
        
        # 队列深度因子
        queue_depth = metrics.get('queue_depth', 0)
        queue_factor = min(1.0, queue_depth / 100)
        
        utilization = (
            metrics.get('gpu_utilization', 0) * weights['gpu_utilization'] +
            metrics.get('cpu_utilization', 0) * weights['cpu_utilization'] +
            metrics.get('memory_utilization', 0) * weights['memory_utilization'] +
            queue_factor * weights['queue_depth_factor']
        )
        
        return utilization
    
    def _scale_up(
        self, 
        metrics: dict,
        predicted_load: Optional[float]
    ) -> ScalingDecision:
        """扩容决策"""
        current_qps = metrics.get('qps', 1)
        
        # 计算需要的副本数
        if predicted_load:
            target_qps = max(current_qps, predicted_load) * 1.2  # 20% 余量
        else:
            target_qps = current_qps * 1.5
        
        qps_per_replica = current_qps / self.current_replicas
        target_replicas = int(target_qps / qps_per_replica) + 1
        
        # 限制最大值
        target_replicas = min(target_replicas, self.max_replicas)
        
        if target_replicas > self.current_replicas:
            return ScalingDecision(
                action=ScalingAction.SCALE_UP,
                current_replicas=self.current_replicas,
                target_replicas=target_replicas,
                reason=f"High utilization, scaling from {self.current_replicas} to {target_replicas}",
                confidence=0.9
            )
        
        return ScalingDecision(
            action=ScalingAction.NO_ACTION,
            current_replicas=self.current_replicas,
            target_replicas=self.current_replicas,
            reason="Already at max replicas",
            confidence=1.0
        )
    
    def _scale_down(self, metrics: dict) -> ScalingDecision:
        """缩容决策"""
        # 保守缩容：一次只减少 1 个副本
        target_replicas = max(self.min_replicas, self.current_replicas - 1)
        
        if target_replicas < self.current_replicas:
            return ScalingDecision(
                action=ScalingAction.SCALE_DOWN,
                current_replicas=self.current_replicas,
                target_replicas=target_replicas,
                reason=f"Low utilization, scaling down from {self.current_replicas} to {target_replicas}",
                confidence=0.7
            )
        
        return ScalingDecision(
            action=ScalingAction.NO_ACTION,
            current_replicas=self.current_replicas,
            target_replicas=self.current_replicas,
            reason="Already at min replicas",
            confidence=1.0
        )
    
    def apply_decision(self, decision: ScalingDecision):
        """应用决策"""
        if decision.action != ScalingAction.NO_ACTION:
            self.current_replicas = decision.target_replicas
            self.last_scaling_time = time.time()
```

---

## 6. 容量规划案例

### 6.1 案例：对话系统容量规划

```python
"""
案例：100万日活的对话系统容量规划
"""

def plan_conversational_system():
    """对话系统容量规划"""
    
    # 1. 需求分析
    daily_active_users = 1_000_000
    conversations_per_user = 3
    turns_per_conversation = 5
    avg_tokens_per_turn = 100
    
    # 2. 计算日请求量
    daily_requests = (
        daily_active_users *
        conversations_per_user *
        turns_per_conversation
    )
    
    # 3. 流量分布 (假设 12小时高峰)
    peak_hours = 12
    peak_traffic_ratio = 0.7  # 70% 流量在高峰期
    
    peak_hourly_requests = (
        daily_requests * peak_traffic_ratio / peak_hours
    )
    
    # 4. 计算 QPS
    peak_qps = peak_hourly_requests / 3600
    
    # 5. 容量计算
    # 假设使用 GPT-3.5-Turbo
    model = 'gpt-3.5-turbo'
    avg_latency_ms = 500  # 目标延迟
    
    calculator = ThroughputCalculator(model, 'A100-40GB')
    metrics = calculator.calculate_qps(
        avg_tokens_per_request=avg_tokens_per_turn,
        num_gpus=1,
        target_latency_ms=avg_latency_ms
    )
    
    # 6. 计算 GPU 数量
    gpu_needed = calculator.calculate_gpu_count(
        target_qps=peak_qps,
        avg_tokens_per_request=avg_tokens_per_turn,
        max_latency_ms=avg_latency_ms
    )
    
    # 7. 成本估算
    pricing = PricingConfig()
    estimator = CostEstimator(pricing)
    
    # API 成本
    api_cost = estimator.estimate_monthly_api_cost(
        model=model,
        daily_requests=daily_requests,
        avg_input_tokens=avg_tokens_per_turn,
        avg_output_tokens=avg_tokens_per_turn
    )
    
    # 自托管成本
    hosted_cost = estimator.estimate_gpu_cost('A100-40GB', gpu_needed)
    
    return {
        'daily_requests': daily_requests,
        'peak_qps': peak_qps,
        'gpu_needed': gpu_needed,
        'api_cost_monthly': api_cost,
        'hosted_cost_monthly': hosted_cost * 1.2,  # 加运维
        'recommendation': 'api' if api_cost < hosted_cost * 1.2 else 'hosted'
    }
```

---

## 7. 监控与告警

### 7.1 关键监控指标

| 指标类别 | 具体指标 | 告警阈值 |
|---------|---------|---------|
| **负载指标** | QPS、队列深度、并发数 | 队列深度 > 50 |
| **资源指标** | GPU/CPU/内存利用率 | GPU 利用率 > 90% |
| **性能指标** | P95/P99 延迟、超时率 | P95 > SLA×1.5 |
| **成本指标** | 日/月消费、Token 消耗 | 日消费超预算 20% |
| **容量指标** | 剩余容量、扩缩容事件 | 剩余容量 < 20% |

### 7.2 容量预警规则

```yaml
# Prometheus 告警规则
groups:
  - name: capacity-alerts
    rules:
      - alert: HighGPUUtilization
        expr: gpu_utilization > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "GPU 利用率过高"
          description: "当前利用率 {{ $value }}%，建议扩容"
      
      - alert: ApproachingCapacityLimit
        expr: |
          current_qps / max_qps > 0.8
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "接近容量上限"
          description: "当前 QPS 已达最大容量的 {{ $value }}%"
      
      - alert: CostOverrun
        expr: |
          daily_cost_usd > budget_daily_usd * 1.2
        for: 1h
        labels:
          severity: critical
        annotations:
          summary: "成本超支"
          description: "日消费 {{ $value }} 美元，超出预算 20%"
```

---

## 8. 最佳实践

### 8.1 规划原则

| 原则 | 说明 |
|-----|------|
| **预留余量** | 保持 20-30% 容量冗余 |
| **分步扩容** | 避免一次性大规模扩容 |
| **成本优化** | 持续监控成本效率 |
| **预案准备** | 制定突发流量应对方案 |
| **定期复盘** | 每月审查容量规划准确性 |

### 8.2 检查清单

```markdown
容量规划检查清单:

□ 流量分析
  □ 确定日均/峰值 QPS
  □ 分析流量时间分布
  □ 识别周期性模式
  
□ 资源评估
  □ 计算 GPU 显存需求
  □ 确定最优批处理大小
  □ 评估存储和网络需求
  
□ 成本预算
  □ 比较 API vs 自托管成本
  □ 制定月度预算
  □ 设置成本告警
  
□ 弹性配置
  □ 配置自动扩缩容
  □ 设置扩缩容阈值
  □ 测试扩缩容流程
  
□ 监控告警
  □ 部署关键指标监控
  □ 配置告警规则
  □ 建立值班机制
```

---

## 9. 参考资源

- [Kubernetes HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [NVIDIA GPU Specifications](https://www.nvidia.com/en-us/data-center/products/)
- [AWS EC2 Pricing](https://aws.amazon.com/ec2/pricing/)
- [OpenAI Pricing](https://openai.com/pricing)
- [Anthropic Pricing](https://www.anthropic.com/pricing)

---

*Last updated: 2026-04-13*
*Version: 1.0.0*

## Related

- [[架构基建/Architecture_Overview/AI_Infrastructure_2026|AI_Infrastructure_2026]]
- [[架构基建/Architecture_Fundamentals/Architecture-in-nutshell.md|Architecture-in-nutshell]]
- [[架构基建/Architecture_Fundamentals/Architecture_Infrastructure_for_dummy.md|Architecture_Infrastructure_for_dummy]]
- [[架构基建/Architecture_Overview/Spring_AI_Architecture|Spring_AI_Architecture]]
- [[概念/LLM/llm-infrastructure.md|llm-infrastructure]]
