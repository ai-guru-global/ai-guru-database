---
title: 'AI 系统混沌工程实践 (Chaos Engineering for AI Systems)'
category: '13-ai-ops'
tags: ["ai-ops", "observability", "monitoring", "incident-response"]
summary: '> **一句话理解**: 混沌工程是 AI 系统的"疫苗"——通过主动注入故障，发现系统弱点，提前修复潜在问题，让系统在真实故障面前更具韧性。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Chaos Engineering Ai"
  - "Chaos Engineering AI"
  - Chaos_Engineering_AI
sources: []

---
# AI 系统混沌工程实践 (Chaos Engineering for AI Systems)

> **一句话理解**: 混沌工程是 AI 系统的"疫苗"——通过主动注入故障，发现系统弱点，提前修复潜在问题，让系统在真实故障面前更具韧性。

---

## 1. 混沌工程概述

### 1.1 为什么 AI 系统需要混沌工程？

| 挑战 | 传统系统 | AI 系统 | 混沌工程价值 |
|-----|---------|--------|------------|
| **依赖复杂性** | API、数据库 | 模型服务、向量库、推理引擎 | 验证故障隔离能力 |
| **不确定性** | 确定性错误 | 模型输出不稳定、幻觉 | 测试降级策略 |
| **资源敏感** | CPU/内存 | GPU 显存、Token 配额 | 验证资源耗尽处理 |
| **延迟敏感** | 毫秒级 | 秒级到分钟级 | 测试超时和中断处理 |
| **成本敏感** | 固定成本 | 动态 Token 成本 | 验证成本控制机制 |

### 1.2 AI 系统故障分类

```
AI 系统故障类型

├── 基础设施故障
│   ├── GPU 节点故障
│   ├── 网络分区
│   ├── 存储故障
│   └── 电源/冷却故障
│
├── 服务依赖故障
│   ├── LLM API 不可用
│   ├── 向量数据库延迟/宕机
│   ├── Redis 缓存失效
│   └── 消息队列积压
│
├── 模型相关故障
│   ├── 模型推理超时
│   ├── 模型输出异常
│   ├── Token 配额耗尽
│   └── 上下文长度溢出
│
├── 数据相关故障
│   ├── 数据管道中断
│   ├── 向量索引损坏
│   ├── 配置数据错误
│   └── 训练数据污染
│
└── 负载相关故障
    ├── 流量突增
    ├── 恶意请求
    ├── 资源竞争
    └── 级联故障
```

### 1.3 混沌工程原则

| 原则 | 说明 | AI 系统应用 |
|-----|------|-----------|
| **建立稳态假设** | 定义系统正常行为指标 | 响应时间、成功率、Token 消耗 |
| **模拟真实故障** | 注入真实可能发生的故障 | 模拟 LLM API 延迟、GPU 故障 |
| **最小爆炸半径** | 控制故障影响范围 | 在 staging 环境或小流量实验 |
| **自动化实验** | 持续运行混沌实验 | CI/CD 集成、定期演练 |
| **可观测性优先** | 实验前完善监控 | 指标、日志、追踪完备 |

---

## 2. 实验设计框架

### 2.1 实验设计模板

```python
"""
混沌实验设计框架
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Callable
from enum import Enum
from datetime import datetime, timedelta

class FaultType(Enum):
    """故障类型"""
    # 基础设施
    POD_KILL = "pod_kill"
    CPU_STRESS = "cpu_stress"
    MEMORY_STRESS = "memory_stress"
    NETWORK_DELAY = "network_delay"
    NETWORK_DROP = "network_drop"
    DISK_FILL = "disk_fill"
    
    # AI 特有
    LLM_LATENCY = "llm_latency"
    LLM_ERROR_RATE = "llm_error_rate"
    LLM_TOKEN_LIMIT = "llm_token_limit"
    VECTOR_DB_DOWN = "vector_db_down"
    EMBEDDING_FAILURE = "embedding_failure"
    GPU_OOM = "gpu_oom"

class ExperimentStatus(Enum):
    """实验状态"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    ABORTED = "aborted"
    FAILED = "failed"

@dataclass
class SteadyStateHypothesis:
    """稳态假设"""
    name: str
    description: str
    # 稳态条件
    conditions: List[Dict] = field(default_factory=list)
    # 验证方法
    verification: Optional[Callable] = None
    
    def verify(self) -> bool:
        """验证稳态"""
        if self.verification:
            return self.verification()
        return all(cond.get("satisfied", False) for cond in self.conditions)

@dataclass
class FaultInjection:
    """故障注入配置"""
    fault_type: FaultType
    target: str                    # 目标服务/组件
    duration_seconds: int = 60
    intensity: float = 0.5         # 0-1 故障强度
    
    # 故障参数
    parameters: Dict = field(default_factory=dict)
    
    # 注入时机
    delay_seconds: int = 0
    schedule: Optional[str] = None  # cron 表达式

@dataclass
class BlastRadius:
    """爆炸半径控制"""
    # 环境限制
    environments: List[str] = field(default_factory=lambda: ["staging"])
    
    # 流量限制
    max_traffic_percentage: float = 5.0  # 最大影响流量比例
    
    # 资源限制
    max_affected_pods: int = 1
    max_affected_nodes: int = 0
    
    # 时间限制
    allowed_windows: List[Dict] = field(default_factory=lambda: [
        {"start": "02:00", "end": "06:00", "timezone": "UTC"}
    ])
    
    # 自动终止条件
    auto_abort_conditions: List[Dict] = field(default_factory=list)

@dataclass
class ChaosExperiment:
    """混沌实验"""
    id: str
    name: str
    description: str
    tags: List[str] = field(default_factory=list)
    
    # 稳态假设
    hypothesis: SteadyStateHypothesis = None
    
    # 故障注入
    fault_injections: List[FaultInjection] = field(default_factory=list)
    
    # 爆炸半径
    blast_radius: BlastRadius = None
    
    # 执行配置
    timeout_seconds: int = 600
    rollback_on_failure: bool = True
    
    # 状态
    status: ExperimentStatus = ExperimentStatus.PENDING
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    
    # 结果
    results: Dict = field(default_factory=dict)

class ChaosExperimentBuilder:
    """混沌实验构建器"""
    
    def __init__(self):
        self.experiment = ChaosExperiment(
            id=self._generate_id(),
            name="",
            description=""
        )
    
    def with_name(self, name: str) -> 'ChaosExperimentBuilder':
        self.experiment.name = name
        return self
    
    def with_description(self, desc: str) -> 'ChaosExperimentBuilder':
        self.experiment.description = desc
        return self
    
    def with_hypothesis(self, 
                        name: str,
                        conditions: List[Dict]) -> 'ChaosExperimentBuilder':
        self.experiment.hypothesis = SteadyStateHypothesis(
            name=name,
            conditions=conditions
        )
        return self
    
    def with_fault(self,
                   fault_type: FaultType,
                   target: str,
                   duration: int = 60,
                   intensity: float = 0.5,
                   **params) -> 'ChaosExperimentBuilder':
        self.experiment.fault_injections.append(FaultInjection(
            fault_type=fault_type,
            target=target,
            duration_seconds=duration,
            intensity=intensity,
            parameters=params
        ))
        return self
    
    def with_blast_radius(self,
                          environments: List[str] = None,
                          max_traffic: float = 5.0,
                          max_pods: int = 1) -> 'ChaosExperimentBuilder':
        self.experiment.blast_radius = BlastRadius(
            environments=environments or ["staging"],
            max_traffic_percentage=max_traffic,
            max_affected_pods=max_pods
        )
        return self
    
    def build(self) -> ChaosExperiment:
        return self.experiment
    
    def _generate_id(self) -> str:
        import uuid
        return f"exp-{str(uuid.uuid4())[:8]}"
```

### 2.2 AI 特有故障注入器

```python
"""
AI 系统特有故障注入器
"""

from abc import ABC, abstractmethod
from typing import Dict, Any
import time
import random

class AIChaosInjector(ABC):
    """AI 混沌注入器基类"""
    
    @abstractmethod
    def inject(self, config: FaultInjection) -> Dict:
        """注入故障"""
        pass
    
    @abstractmethod
    def recover(self, config: FaultInjection) -> Dict:
        """恢复故障"""
        pass

class LLMFaultInjector(AIChaosInjector):
    """LLM 服务故障注入器"""
    
    def __init__(self, llm_client, proxy_layer=None):
        self.llm_client = llm_client
        self.proxy_layer = proxy_layer
        self.original_config = {}
    
    def inject(self, config: FaultInjection) -> Dict:
        """注入 LLM 故障"""
        fault_type = config.fault_type
        
        if fault_type == FaultType.LLM_LATENCY:
            return self._inject_latency(config)
        elif fault_type == FaultType.LLM_ERROR_RATE:
            return self._inject_errors(config)
        elif fault_type == FaultType.LLM_TOKEN_LIMIT:
            return self._inject_token_limit(config)
        else:
            raise ValueError(f"Unknown fault type: {fault_type}")
    
    def _inject_latency(self, config: FaultInjection) -> Dict:
        """注入延迟"""
        latency_ms = config.parameters.get(
            "latency_ms", 
            int(1000 * config.intensity * 10)  # 0-10s
        )
        
        # 通过代理层注入延迟
        if self.proxy_layer:
            self.proxy_layer.add_delay(
                target=config.target,
                delay_ms=latency_ms
            )
        
        return {
            "injected": True,
            "type": "latency",
            "latency_ms": latency_ms,
            "target": config.target
        }
    
    def _inject_errors(self, config: FaultInjection) -> Dict:
        """注入错误率"""
        error_rate = config.intensity
        error_types = config.parameters.get(
            "error_types",
            ["rate_limit", "timeout", "service_unavailable"]
        )
        
        if self.proxy_layer:
            self.proxy_layer.add_error_rate(
                target=config.target,
                error_rate=error_rate,
                error_types=error_types
            )
        
        return {
            "injected": True,
            "type": "error_rate",
            "error_rate": error_rate,
            "error_types": error_types
        }
    
    def _inject_token_limit(self, config: FaultInjection) -> Dict:
        """注入 Token 限制"""
        # 模拟 Token 配额耗尽
        limit = config.parameters.get("remaining_tokens", 0)
        
        if self.proxy_layer:
            self.proxy_layer.set_token_limit(
                target=config.target,
                remaining=limit
            )
        
        return {
            "injected": True,
            "type": "token_limit",
            "remaining_tokens": limit
        }
    
    def recover(self, config: FaultInjection) -> Dict:
        """恢复故障"""
        if self.proxy_layer:
            self.proxy_layer.clear_faults(config.target)
        
        return {"recovered": True, "target": config.target}


class VectorDBFaultInjector(AIChaosInjector):
    """向量数据库故障注入器"""
    
    def __init__(self, vector_db_client):
        self.vector_db = vector_db_client
        self.fault_active = False
    
    def inject(self, config: FaultInjection) -> Dict:
        """注入向量数据库故障"""
        fault_type = config.fault_type
        
        if fault_type == FaultType.VECTOR_DB_DOWN:
            return self._inject_outage(config)
        elif fault_type == FaultType.NETWORK_DELAY:
            return self._inject_latency(config)
        else:
            return self._inject_degraded(config)
    
    def _inject_outage(self, config: FaultInjection) -> Dict:
        """注入完全中断"""
        # 模拟数据库不可用
        self.vector_db.set_unavailable(True)
        self.fault_active = True
        
        return {
            "injected": True,
            "type": "outage",
            "target": config.target
        }
    
    def _inject_latency(self, config: FaultInjection) -> Dict:
        """注入延迟"""
        latency_ms = int(config.intensity * 5000)  # 0-5s
        
        self.vector_db.set_simulated_latency(latency_ms)
        
        return {
            "injected": True,
            "type": "latency",
            "latency_ms": latency_ms
        }
    
    def _inject_degraded(self, config: FaultInjection) -> Dict:
        """注入降级状态"""
        # 部分分片不可用
        unavailable_shards = int(config.intensity * 3)
        
        return {
            "injected": True,
            "type": "degraded",
            "unavailable_shards": unavailable_shards
        }
    
    def recover(self, config: FaultInjection) -> Dict:
        """恢复"""
        self.vector_db.set_unavailable(False)
        self.vector_db.set_simulated_latency(0)
        self.fault_active = False
        
        return {"recovered": True}


class GPUFaultInjector(AIChaosInjector):
    """GPU 故障注入器"""
    
    def __init__(self, k8s_client, namespace: str = "default"):
        self.k8s = k8s_client
        self.namespace = namespace
    
    def inject(self, config: FaultInjection) -> Dict:
        """注入 GPU 故障"""
        fault_type = config.fault_type
        
        if fault_type == FaultType.GPU_OOM:
            return self._inject_oom(config)
        elif fault_type == FaultType.CPU_STRESS:
            return self._inject_stress(config)
        else:
            return self._inject_pod_kill(config)
    
    def _inject_oom(self, config: FaultInjection) -> Dict:
        """注入 GPU OOM"""
        # 方法1: 限制显存
        pod_name = config.target
        
        # 使用 Kubernetes 资源限制
        self.k8s.patch_pod(
            name=pod_name,
            namespace=self.namespace,
            patch={
                "spec": {
                    "containers": [{
                        "name": "inference",
                        "resources": {
                            "limits": {
                                "nvidia.com/gpu-memory": "1Gi"  # 限制为 1GB
                            }
                        }
                    }]
                }
            }
        )
        
        return {
            "injected": True,
            "type": "gpu_oom",
            "target": pod_name
        }
    
    def _inject_stress(self, config: FaultInjection) -> Dict:
        """注入资源压力"""
        # 启动压力测试 Pod
        stress_manifest = {
            "apiVersion": "batch/v1",
            "kind": "Job",
            "metadata": {
                "name": f"stress-{config.target}",
                "namespace": self.namespace
            },
            "spec": {
                "template": {
                    "spec": {
                        "containers": [{
                            "name": "stress",
                            "image": "polinux/stress",
                            "command": ["stress", "--cpu", "4", "--timeout", f"{config.duration_seconds}s"]
                        }],
                        "restartPolicy": "Never"
                    }
                }
            }
        }
        
        self.k8s.create_job(stress_manifest)
        
        return {"injected": True, "type": "stress"}
    
    def _inject_pod_kill(self, config: FaultInjection) -> Dict:
        """注入 Pod 终止"""
        self.k8s.delete_pod(
            name=config.target,
            namespace=self.namespace
        )
        
        return {
            "injected": True,
            "type": "pod_kill",
            "target": config.target
        }
    
    def recover(self, config: FaultInjection) -> Dict:
        """恢复"""
        # Kubernetes 会自动重建 Pod
        return {"recovered": True, "note": "Pod will be recreated by deployment"}
```

---

## 3. 实验执行引擎

### 3.1 执行引擎实现

```python
"""
混沌实验执行引擎
"""

from typing import Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
import threading
import time
import logging

logger = logging.getLogger(__name__)

@dataclass
class ExperimentResult:
    """实验结果"""
    experiment_id: str
    status: str
    start_time: datetime
    end_time: Optional[datetime] = None
    
    # 稳态验证
    hypothesis_verified: bool = False
    hypothesis_details: Dict = field(default_factory=dict)
    
    # 故障注入结果
    injection_results: List[Dict] = field(default_factory=list)
    
    # 系统指标
    metrics_before: Dict = field(default_factory=dict)
    metrics_during: Dict = field(default_factory=dict)
    metrics_after: Dict = field(default_factory=dict)
    
    # 异常事件
    anomalies: List[Dict] = field(default_factory=list)
    
    # 结论
    resilience_score: float = 0.0
    recommendations: List[str] = field(default_factory=list)

class ChaosEngine:
    """混沌实验引擎"""
    
    def __init__(self,
                 metrics_collector,
                 alert_manager=None,
                 dry_run: bool = False):
        self.metrics = metrics_collector
        self.alerts = alert_manager
        self.dry_run = dry_run
        
        # 注入器注册表
        self.injectors: Dict[str, AIChaosInjector] = {}
        
        # 运行中的实验
        self.running_experiments: Dict[str, ChaosExperiment] = {}
    
    def register_injector(self, name: str, injector: AIChaosInjector):
        """注册故障注入器"""
        self.injectors[name] = injector
    
    def run_experiment(self, experiment: ChaosExperiment) -> ExperimentResult:
        """运行混沌实验"""
        result = ExperimentResult(
            experiment_id=experiment.id,
            status="running",
            start_time=datetime.now()
        )
        
        try:
            # 1. 验证爆炸半径
            if not self._validate_blast_radius(experiment):
                result.status = "rejected"
                result.recommendations.append("爆炸半径验证失败")
                return result
            
            # 2. 记录基线指标
            result.metrics_before = self.metrics.collect()
            
            # 3. 验证初始稳态
            if experiment.hypothesis:
                initial_check = experiment.hypothesis.verify()
                if not initial_check:
                    result.status = "failed"
                    result.hypothesis_details = {
                        "error": "初始稳态验证失败"
                    }
                    return result
            
            # 4. 注入故障
            for injection in experiment.fault_injections:
                injection_result = self._inject_fault(injection)
                result.injection_results.append(injection_result)
            
            # 5. 监控故障期间
            self._monitor_during_fault(experiment, result)
            
            # 6. 验证稳态假设
            if experiment.hypothesis:
                result.hypothesis_verified = experiment.hypothesis.verify()
                result.hypothesis_details = {
                    "conditions": [
                        c for c in experiment.hypothesis.conditions
                    ]
                }
            
            # 7. 恢复故障
            for injection in experiment.fault_injections:
                self._recover_fault(injection)
            
            # 8. 记录恢复后指标
            time.sleep(30)  # 等待恢复
            result.metrics_after = self.metrics.collect()
            
            # 9. 计算韧性分数
            result.resilience_score = self._calculate_resilience(result)
            
            # 10. 生成建议
            result.recommendations = self._generate_recommendations(result)
            
            result.status = "completed"
            result.end_time = datetime.now()
            
        except Exception as e:
            logger.error(f"实验执行失败: {e}")
            result.status = "failed"
            result.anomalies.append({
                "type": "execution_error",
                "message": str(e)
            })
            
            # 确保恢复故障
            for injection in experiment.fault_injections:
                try:
                    self._recover_fault(injection)
                except:
                    pass
        
        return result
    
    def _validate_blast_radius(self, experiment: ChaosExperiment) -> bool:
        """验证爆炸半径"""
        radius = experiment.blast_radius
        if not radius:
            return True
        
        # 检查环境
        current_env = self._get_current_environment()
        if current_env not in radius.environments:
            logger.warning(f"环境 {current_env} 不在允许范围内")
            return False
        
        # 检查时间窗口
        if not self._is_within_allowed_window(radius.allowed_windows):
            logger.warning("不在允许的时间窗口内")
            return False
        
        return True
    
    def _inject_fault(self, injection: FaultInjection) -> Dict:
        """注入故障"""
        if self.dry_run:
            return {"dry_run": True, "config": injection.__dict__}
        
        injector = self._get_injector(injection.fault_type)
        if injector:
            return injector.inject(injection)
        
        raise ValueError(f"未找到注入器: {injection.fault_type}")
    
    def _recover_fault(self, injection: FaultInjection) -> Dict:
        """恢复故障"""
        injector = self._get_injector(injection.fault_type)
        if injector:
            return injector.recover(injection)
        return {"recovered": False}
    
    def _get_injector(self, fault_type: FaultType) -> Optional[AIChaosInjector]:
        """获取对应的注入器"""
        mapping = {
            FaultType.LLM_LATENCY: "llm",
            FaultType.LLM_ERROR_RATE: "llm",
            FaultType.LLM_TOKEN_LIMIT: "llm",
            FaultType.VECTOR_DB_DOWN: "vector_db",
            FaultType.GPU_OOM: "gpu",
            FaultType.POD_KILL: "gpu",
        }
        
        injector_name = mapping.get(fault_type)
        return self.injectors.get(injector_name)
    
    def _monitor_during_fault(self, 
                               experiment: ChaosExperiment,
                               result: ExperimentResult):
        """故障期间监控"""
        start_time = time.time()
        duration = experiment.timeout_seconds
        
        while time.time() - start_time < duration:
            # 收集指标
            current_metrics = self.metrics.collect()
            result.metrics_during = current_metrics
            
            # 检测异常
            anomalies = self._detect_anomalies(current_metrics)
            if anomalies:
                result.anomalies.extend(anomalies)
                
                # 检查自动终止条件
                if self._should_abort(experiment, anomalies):
                    logger.warning("检测到严重异常，中止实验")
                    result.status = "aborted"
                    break
            
            time.sleep(10)
    
    def _detect_anomalies(self, metrics: Dict) -> List[Dict]:
        """检测异常"""
        anomalies = []
        
        # 检查关键指标
        if metrics.get("error_rate", 0) > 0.5:
            anomalies.append({
                "type": "high_error_rate",
                "value": metrics["error_rate"],
                "threshold": 0.5
            })
        
        if metrics.get("latency_p99", 0) > 30000:  # 30s
            anomalies.append({
                "type": "high_latency",
                "value": metrics["latency_p99"],
                "threshold": 30000
            })
        
        return anomalies
    
    def _should_abort(self, 
                      experiment: ChaosExperiment,
                      anomalies: List[Dict]) -> bool:
        """判断是否应该中止"""
        if not experiment.blast_radius:
            return False
        
        abort_conditions = experiment.blast_radius.auto_abort_conditions
        
        for condition in abort_conditions:
            anomaly_type = condition.get("anomaly_type")
            threshold = condition.get("threshold")
            
            for anomaly in anomalies:
                if anomaly["type"] == anomaly_type and anomaly["value"] > threshold:
                    return True
        
        return False
    
    def _calculate_resilience(self, result: ExperimentResult) -> float:
        """计算韧性分数"""
        score = 100.0
        
        # 扣分项
        if not result.hypothesis_verified:
            score -= 30
        
        score -= len(result.anomalies) * 10
        
        # 检查恢复速度
        if result.metrics_before and result.metrics_after:
            recovery_ratio = self._compare_metrics(
                result.metrics_before,
                result.metrics_after
            )
            score *= recovery_ratio
        
        return max(0, min(100, score))
    
    def _compare_metrics(self, before: Dict, after: Dict) -> float:
        """比较指标恢复程度"""
        # 简化：比较关键指标
        key_metrics = ["latency_p50", "error_rate", "throughput"]
        
        ratios = []
        for metric in key_metrics:
            if metric in before and metric in after:
                if before[metric] > 0:
                    ratio = min(1.0, before[metric] / max(after[metric], 0.001))
                    ratios.append(ratio)
        
        return sum(ratios) / len(ratios) if ratios else 1.0
    
    def _generate_recommendations(self, result: ExperimentResult) -> List[str]:
        """生成改进建议"""
        recommendations = []
        
        if not result.hypothesis_verified:
            recommendations.append("系统在故障情况下未能维持稳态，需要增强容错机制")
        
        for anomaly in result.anomalies:
            if anomaly["type"] == "high_error_rate":
                recommendations.append("高错误率：考虑添加重试机制和熔断器")
            elif anomaly["type"] == "high_latency":
                recommendations.append("高延迟：检查降级策略和超时配置")
        
        if result.resilience_score < 70:
            recommendations.append("韧性分数较低，建议进行全面架构审查")
        
        return recommendations
    
    def _get_current_environment(self) -> str:
        """获取当前环境"""
        import os
        return os.environ.get("ENVIRONMENT", "development")
    
    def _is_within_allowed_window(self, windows: List[Dict]) -> bool:
        """检查是否在允许的时间窗口"""
        if not windows:
            return True
        
        from datetime import datetime
        now = datetime.now()
        current_time = now.strftime("%H:%M")
        
        for window in windows:
            if window["start"] <= current_time <= window["end"]:
                return True
        
        return False
```

---

## 4. 典型实验场景

### 4.1 LLM 服务中断实验

```python
"""
实验：LLM 服务中断时系统的响应
"""

def create_llm_outage_experiment():
    """创建 LLM 中断实验"""
    builder = ChaosExperimentBuilder()
    
    experiment = (builder
        .with_name("llm-outage-resilience")
        .with_description("测试 LLM 服务中断时系统的降级和恢复能力")
        .with_tags(["llm", "critical", "outage"])
        
        # 稳态假设：系统应保持响应，错误率 < 5%
        .with_hypothesis(
            name="系统可用性",
            conditions=[
                {"metric": "availability", "operator": ">=", "value": 0.99},
                {"metric": "error_rate", "operator": "<=", "value": 0.05}
            ]
        )
        
        # 故障注入：模拟 LLM API 不可用
        .with_fault(
            fault_type=FaultType.LLM_ERROR_RATE,
            target="primary-llm-service",
            duration=180,  # 3分钟
            intensity=1.0,  # 100% 错误率
            error_types=["service_unavailable"]
        )
        
        # 爆炸半径限制
        .with_blast_radius(
            environments=["staging"],
            max_traffic=5.0,
            max_pods=1
        )
        .build()
    )
    
    return experiment


# 预期发现：
# 1. 系统是否正确降级到备用模型
# 2. 降级是否影响用户体验
# 3. 恢复后是否正常工作
# 4. 监控和告警是否及时触发
```

### 4.2 向量数据库延迟实验

```python
"""
实验：向量数据库延迟对 RAG 系统的影响
"""

def create_vector_db_latency_experiment():
    """创建向量数据库延迟实验"""
    builder = ChaosExperimentBuilder()
    
    experiment = (builder
        .with_name("vector-db-latency")
        .with_description("测试向量数据库延迟对 RAG 检索性能的影响")
        .with_tags(["vector-db", "rag", "latency"])
        
        .with_hypothesis(
            name="响应时间可控",
            conditions=[
                {"metric": "p99_latency", "operator": "<=", "value": 5000},  # 5s
                {"metric": "cache_hit_rate", "operator": ">=", "value": 0.8}  # 缓存生效
            ]
        )
        
        .with_fault(
            fault_type=FaultType.NETWORK_DELAY,
            target="vector-db-service",
            duration=300,
            intensity=0.6,  # 模拟 3s 延迟
            latency_ms=3000
        )
        
        .with_blast_radius(
            environments=["staging"],
            max_traffic=10.0
        )
        .build()
    )
    
    return experiment


# 预期发现：
# 1. RAG 系统是否有超时和降级机制
# 2. 缓存层是否有效缓解延迟
# 3. 用户请求是否正确排队或降级
```

### 4.3 GPU 资源耗尽实验

```python
"""
实验：GPU 显存耗尽时的系统行为
"""

def create_gpu_oom_experiment():
    """创建 GPU OOM 实验"""
    builder = ChaosExperimentBuilder()
    
    experiment = (builder
        .with_name("gpu-oom-recovery")
        .with_description("测试 GPU 显存耗尽时推理服务的恢复能力")
        .with_tags(["gpu", "inference", "critical"])
        
        .with_hypothesis(
            name="服务自动恢复",
            conditions=[
                {"metric": "service_recovery_time", "operator": "<=", "value": 60},
                {"metric": "failed_requests_retried", "operator": "==", "value": True}
            ]
        )
        
        .with_fault(
            fault_type=FaultType.GPU_OOM,
            target="inference-server-0",
            duration=120,
            intensity=1.0
        )
        
        .with_blast_radius(
            environments=["staging"],
            max_traffic=5.0,
            max_pods=1
        )
        .build()
    )
    
    return experiment
```

---

## 5. 持续混沌实践

### 5.1 自动化流水线集成

```yaml
# .github/workflows/chaos-experiments.yml
name: Chaos Engineering Pipeline

on:
  schedule:
    # 每周二凌晨 3 点运行
    - cron: '0 3 * * 2'
  workflow_dispatch:
    inputs:
      experiment:
        description: 'Experiment to run'
        required: false
        default: 'all'

jobs:
  chaos-experiments:
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Chaos Tools
        run: |
          pip install chaoslib chaoslib-plugin-k8s
          
      - name: Run Chaos Experiments
        env:
          KUBECONFIG: ${{ secrets.KUBECONFIG_STAGING }}
        run: |
          python scripts/run_chaos_experiments.py \
            --environment staging \
            --experiments ${{ inputs.experiment || 'all' }}
            
      - name: Generate Report
        run: |
          python scripts/generate_chaos_report.py \
            --output reports/chaos-report.html
            
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: chaos-report
          path: reports/
          
      - name: Notify on Failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          channel-id: ${{ secrets.SLACK_CHANNEL }}
          slack-message: '⚠️ Chaos experiment failed - check report'
```

### 5.2 游戏日 (Game Day) 流程

```
混沌工程游戏日流程

准备阶段 (1周前)
├── 确定实验范围和目标
├── 评审爆炸半径
├── 准备回滚方案
├── 通知相关团队
└── 配置监控面板

执行阶段 (游戏日当天)
├── 09:00 站会，确认参与人员
├── 09:30 验证系统基线状态
├── 10:00 开始实验序列
│   ├── 实验1: LLM 服务中断
│   ├── 实验2: 向量数据库延迟
│   └── 实验3: GPU 资源压力
├── 12:00 午休
├── 13:00 复杂场景实验
│   ├── 组合故障
│   └── 级联故障
├── 16:00 结束实验，恢复系统
└── 17:00 复盘会议

复盘阶段 (1周内)
├── 整理实验结果
├── 分析发现的问题
├── 制定改进计划
├── 分配责任人和截止日期
└── 发布游戏日报告
```

---

## 6. 最佳实践

### 6.1 实验设计原则

| 原则 | 说明 | 示例 |
|-----|------|------|
| **小步快跑** | 从小规模实验开始 | 先测试单个 Pod 故障 |
| **渐进增强** | 逐步增加故障强度 | 从 10% 错误率开始 |
| **自动化优先** | 将成功实验加入自动化 | CI/CD 定期运行 |
| **可观测性完备** | 确保监控能发现问题 | 关键指标+告警 |
| **有意义的假设** | 假设应该可验证 | "错误率 < 5%" 而非 "系统正常" |

### 6.2 爆炸半径控制清单

| 检查项 | 要求 |
|-------|------|
| 环境隔离 | 仅在 staging 或特定命名空间 |
| 流量限制 | 影响流量 < 5% |
| 时间窗口 | 避开业务高峰期 |
| 自动终止 | 配置严重异常自动中止 |
| 人工确认 | 生产环境实验需审批 |
| 回滚准备 | 确保有快速恢复手段 |

### 6.3 常见陷阱

| 陷阱 | 后果 | 避免 |
|-----|------|------|
| 爆炸半径过大 | 影响生产用户 | 严格限制流量百分比 |
| 缺乏回滚 | 故障无法快速恢复 | 准备一键回滚脚本 |
| 监控盲区 | 无法发现问题 | 实验前检查监控覆盖 |
| 假设过于乐观 | 无法发现问题 | 使用可量化的假设 |
| 单次实验 | 结论不可靠 | 多次重复实验 |

---

## 7. FAQ

### Q1: 混沌工程和生产事故测试有什么区别？

**A**: 
- **混沌工程**：主动、可控、有假设、在非高峰期
- **事故测试**：被动、不可控、无准备、任意时间
- 混沌工程是"打疫苗"，事故测试是"得病"

### Q2: 如何获得管理层支持？

**A**:
1. 从低风险实验开始，展示价值
2. 量化发现的问题和潜在风险
3. 对比修复成本和事故成本
4. 建立"发现问题是好事"的文化

### Q3: 多久运行一次混沌实验？

**A**:
- **关键路径**：每次发布前
- **常规实验**：每周/每两周
- **复杂场景**：每月游戏日
- **生产实验**：每季度（经审批）

---

*文档版本: 1.0.0* 
*最后更新: 2026-04-13*

## Related

- [[运维/AIOps_Fundamentals/AIOps-in-nutshell.md|AIOps-in-nutshell]]
- [[运维/SRE_Reliability/AI_Incident_Response_Playbook|AI_Incident_Response_Playbook]]
- [[运维/AIOps_Fundamentals/AI_Ops_for_dummy.md|AI_Ops_for_dummy]]
- [[运维/README.md|运维 README]]
- [[运维/README_for_dummy.md|README_for_dummy]]
