---
title: LLM 服务架构 (Serving Architecture)
category: 07-deployment
tags: ["serving", "load-balancing", "auto-scaling", "model-routing", "inference-architecture"]
summary: "LLM 推理服务架构完整指南：负载均衡、自动扩缩容、多模型路由、Prefill/Decode 分离、灰度发布与 2026 生产架构设计。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# LLM 服务架构 (Serving Architecture)

## 1. 架构全景

```
生产级 LLM 服务架构:

用户请求 → API Gateway → 路由层 → 推理集群 → 响应
                ↓            ↓          ↓
           认证/限流    模型选择    负载均衡
           计费/日志    降级策略    健康检查

推理集群内部:
  ┌─────────────────────────────────────┐
  │  Prefill 节点 (计算密集)             │
  │  → 处理 prompt, 生成 KV Cache       │
  ├─────────────────────────────────────┤
  │  Decode 节点 (内存带宽密集)          │
  │  → 逐 token 生成                    │
  ├─────────────────────────────────────┤
  │  KV Cache 存储 (分布式)             │
  │  → 跨节点共享缓存                   │
  └─────────────────────────────────────┘
```

## 2. 核心组件

### 2.1 API Gateway

```python
class LLMGateway:
    """
    LLM API 网关: 统一入口
    
    职责:
    - 认证 (API Key / OAuth)
    - 限流 (Rate Limiting)
    - 路由 (选择后端模型)
    - 计费 (Token 计数)
    - 日志 (请求/响应记录)
    - 降级 (故障切换)
    """
    def __init__(self, config):
        self.rate_limiter = TokenBucketRateLimiter(
            requests_per_minute=config.rpm,
            tokens_per_minute=config.tpm,
        )
        self.router = ModelRouter(config.models)
        self.billing = TokenBilling(config.pricing)
    
    async def handle_request(self, request):
        # 1. 认证
        self.authenticate(request.api_key)
        
        # 2. 限流
        if not self.rate_limiter.allow(request.api_key):
            raise RateLimitError("429 Too Many Requests")
        
        # 3. 路由
        backend = self.router.select(request)
        
        # 4. 转发
        response = await backend.inference(request)
        
        # 5. 计费
        self.billing.charge(request.api_key, response.tokens_used)
        
        return response
```

### 2.2 模型路由

```python
class ModelRouter:
    """
    智能模型路由: 根据请求特征选择最优后端
    
    路由策略:
    - 按模型: 用户指定模型 → 对应集群
    - 按复杂度: 简单问题 → 小模型, 复杂 → 大模型
    - 按成本: 预算有限 → 便宜模型
    - 按延迟: 实时 → 快模型, 批量 → 大模型
    - 按负载: 自动避开过载节点
    """
    def __init__(self, models_config):
        self.models = models_config
        # 模型层级
        self.tiers = {
            "fast": ["llama-3.1-8b", "qwen2.5-7b"],      # 快/便宜
            "balanced": ["llama-3.1-70b", "qwen2.5-72b"], # 平衡
            "powerful": ["gpt-4o", "claude-4"],            # 最强
        }
    
    def select(self, request):
        # 用户指定模型
        if request.model:
            return self.get_backend(request.model)
        
        # 自动路由
        complexity = self.estimate_complexity(request.prompt)
        
        if complexity < 0.3:
            tier = "fast"
        elif complexity < 0.7:
            tier = "balanced"
        else:
            tier = "powerful"
        
        # 在 tier 内选负载最低的
        candidates = self.tiers[tier]
        return self.least_loaded(candidates)
```

## 3. 扩缩容策略

### 3.1 自动扩缩容

```python
class LLMAutoScaler:
    """
    LLM 推理自动扩缩容
    
    挑战: GPU 实例启动慢 (5-10 分钟)
    解决: 预测性扩容 + 缓冲池
    """
    def __init__(self, config):
        self.min_replicas = config.min_replicas  # 最少实例
        self.max_replicas = config.max_replicas
        self.target_gpu_util = 0.75  # 目标 GPU 利用率
        self.scale_up_threshold = 0.85
        self.scale_down_threshold = 0.5
        self.cooldown = 300  # 冷却期 (秒)
    
    def evaluate(self, metrics):
        """评估是否需要扩缩容"""
        current_replicas = metrics.active_replicas
        gpu_util = metrics.avg_gpu_utilization
        queue_depth = metrics.pending_requests
        p99_latency = metrics.p99_latency_ms
        
        # 扩容条件
        if gpu_util > self.scale_up_threshold:
            desired = int(current_replicas * gpu_util / self.target_gpu_util)
            return ScaleAction("up", min(desired, self.max_replicas))
        
        if queue_depth > current_replicas * 10:
            return ScaleAction("up", current_replicas + 2)
        
        # 缩容条件
        if gpu_util < self.scale_down_threshold and current_replicas > self.min_replicas:
            desired = max(
                int(current_replicas * gpu_util / self.target_gpu_util),
                self.min_replicas
            )
            return ScaleAction("down", desired)
        
        return ScaleAction("none", current_replicas)
```

### 3.2 Kubernetes 部署

```yaml
# K8s 部署 LLM 推理服务:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference
spec:
  replicas: 4
  selector:
    matchLabels:
      app: llm-inference
  template:
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        args:
          - --model=meta-llama/Llama-3.1-8B-Instruct
          - --tensor-parallel-size=2
          - --max-model-len=8192
          - --gpu-memory-utilization=0.9
        resources:
          limits:
            nvidia.com/gpu: 2
            memory: "128Gi"
        ports:
        - containerPort: 8000
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 120  # 模型加载慢
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: llm-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: llm-inference
  minReplicas: 2
  maxReplicas: 16
  metrics:
  - type: Pods
    pods:
      metric:
        name: gpu_utilization
      target:
        type: AverageValue
        averageValue: "75"
```

## 4. Prefill/Decode 分离

### 4.1 分离架构

```python
# 2026 趋势: Prefill 和 Decode 分离部署

PREFILL_DECODE_DISAGGREGATION = {
    "原理": {
        "Prefill": "处理输入 prompt → 计算密集 → 高 GPU 利用",
        "Decode": "逐 token 生成 → 内存带宽密集 → 低 GPU 利用",
        "问题": "混合部署时互相干扰",
        "解决": "分离到不同节点",
    },
    "架构": {
        "Prefill 集群": "少量高算力 GPU (H100/B200)",
        "Decode 集群": "大量内存带宽 GPU",
        "KV Cache 传输": "RDMA / NVLink 跨节点",
    },
    "优势": [
        "Prefill 不受 Decode 阻塞",
        "Decode 不受 Prefill 抢占",
        "各自独立扩缩容",
        "总体吞吐提升 30-50%",
    ],
    "实现": [
        "vLLM: 原生支持 P/D 分离",
        "SGLang: 支持分离部署",
        "Mooncake: 分布式 KV Cache",
    ],
}
```

## 5. 高可用设计

```python
HIGH_AVAILABILITY = {
    "多副本": "每个模型至少 2 个副本",
    "健康检查": "每 10s 探测 /health",
    "故障转移": "自动切换到健康节点",
    "灰度发布": "新模型先接 5% 流量",
    "降级策略": {
        "大模型不可用": "自动降级到小模型",
        "所有 GPU 不可用": "返回缓存/拒绝",
        "部分节点故障": "重新路由到存活节点",
    },
    "监控告警": {
        "P99 延迟 > 5s": "告警 + 扩容",
        "错误率 > 1%": "告警 + 回滚",
        "GPU 温度 > 85°C": "降频 + 告警",
    },
}
```

## 6. 交叉引用

- [[10_部署推理/02_Inference_Engines/|推理引擎]]
- [[10_部署推理/LLM_Caching/|LLM 缓存]]
- [[10_部署推理/Edge_Deployment/|边缘部署]]
- [[12_架构基建/|架构基建]]
- [[13_运维/|运维]]
- [[10_部署推理/04_Inference_Performance/|推理性能]]
