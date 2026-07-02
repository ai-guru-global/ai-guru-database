---
title: "Capacity Planning for AI Systems 2026"
tags: [ai-ops, capacity-planning, gpu, scaling, production, cost]
status: complete
last_updated: 2026-07-02
sources: []
---

# Capacity Planning for AI Systems 2026

## Overview

Capacity planning for AI systems requires understanding **GPU compute**, **memory**, **storage**, and **network** requirements across training and inference workloads. Unlike traditional web services, AI workloads have unique characteristics: GPU-bound computation, large model weights, and bursty traffic patterns.

## Capacity Planning Framework

```
┌─────────────────────────────────────────────────────┐
│                Capacity Planning Cycle                │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Forecast │→│  Model   │→│ Provision │          │
│  │ Demand   │  │ Capacity │  │ Resources │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│       ↑                                    │        │
│       │         ┌──────────┐               │        │
│       └─────────│ Monitor  │←──────────────┘        │
│                 │ & Adjust │                         │
│                 └──────────┘                         │
└─────────────────────────────────────────────────────┘
```

## Inference Capacity Planning

### Key Metrics

| Metric | Definition | Typical Target |
|--------|-----------|----------------|
| **Throughput** | Requests/second or tokens/second | Depends on SLA |
| **Latency (TTFT)** | Time to first token | < 500ms (p99) |
| **Latency (TPOT)** | Time per output token | < 50ms (p99) |
| **Latency (E2E)** | End-to-end request time | < 5s (p99) |
| **GPU Utilization** | Compute utilization | 70-85% |
| **Memory Utilization** | HBM usage | < 90% |
| **Cost per 1M tokens** | Total cost / tokens served | Minimize |

### Sizing Formula

```python
def estimate_inference_capacity(
    daily_requests: int,
    avg_input_tokens: int,
    avg_output_tokens: int,
    target_p99_latency_ms: int,
    model_params_b: float,
    gpu_type: str = "H100"
):
    """Estimate GPU requirements for LLM inference."""
    
    # Model memory (FP16)
    model_memory_gb = model_params_b * 2  # 2 bytes per param
    
    # KV cache per request (approximate)
    kv_cache_per_token_gb = 0.0002 * model_params_b  # Rough estimate
    max_concurrent = daily_requests / 86400 * (target_p99_latency_ms / 1000)
    
    # Tokens per second needed
    total_tokens_per_sec = (avg_output_tokens * daily_requests) / 86400
    
    # GPU throughput estimates (tokens/sec)
    gpu_throughput = {
        "H100": 4000,    # ~4K tokens/sec for 70B model
        "A100": 2000,    # ~2K tokens/sec for 70B model
        "L40S": 1500,    # ~1.5K tokens/sec for 70B model
    }
    
    # Number of GPUs needed
    gpus_needed = math.ceil(total_tokens_per_sec / gpu_throughput[gpu_type])
    
    # Memory check
    gpu_memory = {"H100": 80, "A100": 80, "L40S": 48}
    gpus_for_memory = math.ceil(model_memory_gb / gpu_memory[gpu_type])
    
    return {
        "gpus_compute": gpus_needed,
        "gpus_memory": gpus_for_memory,
        "gpus_total": max(gpus_needed, gpus_for_memory),
        "max_concurrent_requests": int(max_concurrent),
        "peak_tokens_per_sec": total_tokens_per_sec * 2.5,  # Peak factor
    }

# Example: 100K daily requests, 70B model
result = estimate_inference_capacity(
    daily_requests=100_000,
    avg_input_tokens=500,
    avg_output_tokens=200,
    target_p99_latency_ms=2000,
    model_params_b=70,
    gpu_type="H100"
)
print(f"Need {result['gpus_total']}x H100 GPUs")
```

### GPU Memory Breakdown (70B Model)

| Component | FP16 | INT8 | INT4 |
|-----------|------|------|------|
| Model weights | 140 GB | 70 GB | 35 GB |
| KV cache (per request) | ~1.5 GB | ~0.75 GB | ~0.4 GB |
| Activations | ~2 GB | ~2 GB | ~2 GB |
| Overhead | ~5 GB | ~5 GB | ~5 GB |
| **Total per instance** | **~148 GB** | **~78 GB** | **~42 GB** |
| **GPUs needed (80GB)** | **2x H100** | **1x H100** | **1x H100** |

## Training Capacity Planning

### Training Compute Formula

```
FLOPs ≈ 6 × N × D

Where:
  N = number of parameters
  D = number of training tokens

Example: 70B model, 2T tokens
FLOPs = 6 × 70×10^9 × 2×10^12 = 8.4 × 10^23 FLOPs
```

### GPU-Hours Estimation

```python
def estimate_training_gpus(
    model_params_b: float,
    training_tokens_b: float,
    gpu_type: str = "H100",
    target_days: int = 30,
    utilization: float = 0.45  # MFU (Model FLOPs Utilization)
):
    """Estimate GPU requirements for model training."""
    
    total_flops = 6 * model_params_b * 1e9 * training_tokens_b * 1e12
    
    gpu_flops = {
        "H100": 990e12,   # 990 TFLOPS FP16
        "A100": 312e12,   # 312 TFLOPS FP16
        "MI300X": 1634e12, # 1634 TFLOPS FP16
    }
    
    effective_flops_per_gpu = gpu_flops[gpu_type] * utilization
    total_gpu_seconds = total_flops / effective_flops_per_gpu
    total_gpu_hours = total_gpu_seconds / 3600
    
    gpu_days = total_gpu_hours / 24
    gpus_needed = math.ceil(gpu_days / target_days)
    
    return {
        "total_gpu_hours": total_gpu_hours,
        "gpus_needed": gpus_needed,
        "estimated_days": target_days,
        "estimated_cost_usd": total_gpu_hours * gpu_hourly_cost[gpu_type]
    }

# Example: Train 70B model on 2T tokens in 30 days
result = estimate_training_gpus(
    model_params_b=70,
    training_tokens_b=2000,
    gpu_type="H100",
    target_days=30
)
print(f"Need {result['gpus_needed']}x H100 for {result['estimated_days']} days")
print(f"Estimated cost: ${result['estimated_cost_usd']:,.0f}")
```

### Training vs Inference Resource Split

| Workload | GPU % | Memory % | Storage % | Network % |
|----------|-------|----------|-----------|-----------|
| Pre-training | 90% | 80% | 60% | 70% |
| Fine-tuning | 60% | 50% | 30% | 40% |
| Inference (serving) | 40% | 60% | 20% | 50% |
| Evaluation | 30% | 30% | 40% | 20% |

## Scaling Strategies

### Horizontal Scaling (Inference)

```yaml
# HPA for LLM inference
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
  - type: Pods
    pods:
      metric:
        name: gpu_utilization_average
      target:
        type: AverageValue
        averageValue: "70"
  - type: Pods
    pods:
      metric:
        name: pending_requests
      target:
        type: AverageValue
        averageValue: "100"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Pods
        value: 2
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Pods
        value: 1
        periodSeconds: 120
```

### Vertical Scaling (Training)

```yaml
# Resource quotas for training namespaces
apiVersion: v1
kind: ResourceQuota
metadata:
  name: training-quota
  namespace: ml-training
spec:
  hard:
    requests.nvidia.com/gpu: "64"
    limits.nvidia.com/gpu: "64"
    requests.memory: "512Gi"
    persistentvolumeclaims: "20"
```

### Auto-Scaling Decision Tree

```
Traffic Pattern:
├── Predictable (business hours)
│   └── Scheduled scaling (cron-based)
├── Bursty (sporadic spikes)
│   └── Reactive scaling (metrics-based)
├── Growing (steady increase)
│   └── Forecast-based provisioning
└── Batch (training jobs)
    └── Queue-based scaling (Kueue)
```

## Storage Capacity

### Storage Requirements by Phase

| Component | Size Estimate | Growth Rate |
|-----------|--------------|-------------|
| Model weights (70B FP16) | 140 GB per version | Per release |
| Training data (2T tokens) | 4-8 TB | Per training run |
| Checkpoints (70B) | 140 GB × 10 = 1.4 TB | Per run |
| Vector DB embeddings | ~1 GB per 1M docs | Linear with data |
| Logs/telemetry | 10-100 GB/day | Continuous |
| Evaluation datasets | 10-100 GB | Per benchmark |

### Storage Tier Strategy

```
┌─────────────────────────────────────────┐
│           Storage Tiering               │
├──────────┬──────────┬───────────────────┤
│ Hot      │ Warm     │ Cold              │
│ (SSD/NVMe)│ (HDD/S3) │ (Archive/Glacier)│
├──────────┼──────────┼───────────────────┤
│ Active   │ Recent   │ Historical        │
│ models   │ checkpoints│ training data   │
│ KV cache │ Old logs │ Old artifacts     │
│ Features │ Datasets │ Compliance data   │
└──────────┴──────────┴───────────────────┘
```

## Network Capacity

### Bandwidth Requirements

| Operation | Bandwidth | Latency |
|-----------|-----------|---------|
| Model download (70B) | 10 Gbps → 2 min | N/A |
| Checkpoint sync | 25 Gbps | < 100ms |
| All-reduce (training) | 100-400 Gbps | < 10ms |
| Inference request | 1-10 Mbps | < 50ms |
| Vector DB query | 10-100 Mbps | < 10ms |

### RDMA/InfiniBand for Training

```yaml
# Network-optimized training job
apiVersion: kubeflow.org/v1
kind: PyTorchJob
metadata:
  name: distributed-training
spec:
  pytorchReplicaSpecs:
    Master:
      replicas: 1
      template:
        spec:
          containers:
          - name: pytorch
            resources:
              limits:
                nvidia.com/gpu: 8
                rdma/rdma_shared_device_a: 1
            volumeMounts:
            - name: shm
              mountPath: /dev/shm
    Worker:
      replicas: 7
      template:
        spec:
          containers:
          - name: pytorch
            resources:
              limits:
                nvidia.com/gpu: 8
                rdma/rdma_shared_device_a: 1
```

## Cost Optimization

### GPU Cost Comparison

| Provider | Instance | GPU | Spot/hr | On-Demand/hr | Savings |
|----------|----------|-----|---------|-------------|---------|
| AWS | p5.48xlarge | 8× H100 | $29.50 | $98.32 | 70% |
| GCP | a3-highgpu-8g | 8× H100 | $29.51 | $98.35 | 70% |
| Azure | ND H100 v5 | 8× H100 | $33.87 | $96.77 | 65% |
| Alibaba | ecs.gn8ae | 8× H100 | ¥204 | ¥680 | 70% |

### Cost Optimization Strategies

| Strategy | Savings | Complexity | Risk |
|----------|---------|------------|------|
| Spot/Preemptible instances | 60-70% | Low | Preemption |
| Reserved instances (1-3yr) | 30-50% | Low | Commitment |
| Right-sizing | 20-40% | Medium | Under-provisioning |
| Model quantization | 50-75% | Medium | Quality loss |
| Request batching | 20-30% | Low | Latency increase |
| Caching (prompt/KV) | 30-50% | Medium | Staleness |

## Monitoring & Alerting

### Key Capacity Metrics

```yaml
# Prometheus alerts for capacity
groups:
- name: ai-capacity
  rules:
  - alert: GPUUtilizationHigh
    expr: nvidia_gpu_utilization_gpu > 90
    for: 15m
    labels:
      severity: warning
    annotations:
      summary: "GPU utilization above 90% for 15 minutes"
  
  - alert: GPUMemoryHigh
    expr: nvidia_gpu_memory_used_bytes / nvidia_gpu_memory_total_bytes > 0.9
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "GPU memory usage above 90%"
  
  - alert: InferenceQueueBacklog
    expr: vllm:num_requests_waiting > 100
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Inference queue backlog growing"
  
  - alert: StorageCapacityLow
    expr: node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.1
    for: 10m
    labels:
      severity: critical
    annotations:
      summary: "Storage capacity below 10%"
```

## Capacity Planning Template

```markdown
## Quarterly Capacity Plan

### Current State
- GPU Inventory: X× H100, Y× A100
- Utilization: 75% average, 90% peak
- Storage: X TB used / Y TB total

### Demand Forecast (Next Quarter)
- Training: Z new models, estimated X GPU-hours
- Inference: Y% traffic growth
- New projects: [list]

### Capacity Gaps
- [Gap 1]: X additional GPUs needed by [date]
- [Gap 2]: Y TB additional storage by [date]

### Procurement Plan
- [Item 1]: [specification], [quantity], [timeline]
- [Item 2]: [specification], [quantity], [timeline]

### Cost Budget
- Compute: $X/month
- Storage: $Y/month
- Network: $Z/month
- Total: $T/month (±15% variance)
```

## Related Topics

- [[GPU_Cost_Optimization]]: Detailed cost strategies
- [[Distributed_Training_2026]]: Training infrastructure
- [[Inference_Performance_Fundamentals]]: Performance optimization
- [[FinOps_for_AI]]: Financial operations
