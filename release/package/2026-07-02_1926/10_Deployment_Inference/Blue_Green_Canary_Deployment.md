---
title: "蓝绿部署与金丝雀发布完全指南 (Blue-Green & Canary Deployment)"
category: 10-deployment-inference
tags: ["deployment", "blue-green", "canary", "progressive-delivery", "rollback"]
summary: "蓝绿部署和金丝雀发布是 AI 模型上线的安全网——从策略设计到自动化回滚，系统解析生产环境模型发布的最佳实践。"
created: 2026-07-02
updated: 2026-07-02
tier: core
aliases:
  - "Blue Green Canary Deployment"
  - "Progressive Delivery"
  - Blue_Green_Canary_Deployment
sources: []

---
# 蓝绿部署与金丝雀发布完全指南 (Blue-Green & Canary Deployment)

> 蓝绿部署和金丝雀发布是 AI 模型上线的安全网——从策略设计到自动化回滚，系统解析生产环境模型发布的最佳实践。

---

## 1. 概述 (Overview)

模型部署策略决定了新模型如何安全地替换旧模型。直接全量替换风险巨大——一个 bug 可能影响所有用户。蓝绿部署和金丝雀发布通过渐进式发布，将风险控制在最小范围。

### 为什么需要渐进式发布？

```
直接全量替换的风险:
  - 新模型可能有未知 bug
  - 性能可能不如预期
  - 回滚耗时长
  - 影响所有用户

渐进式发布的价值:
  - 小范围验证，降低风险
  - 快速回滚，最小化影响
  - 实时监控，及时发现问题
  - A/B 测试，量化效果
```

### 发布策略对比

| 策略 | 风险 | 速度 | 资源 | 适用场景 |
|------|------|------|------|---------|
| **全量替换** | 最高 | 最快 | 最少 | 紧急修复 |
| **蓝绿部署** | 低 | 快 | 2x | 需要快速回滚 |
| **金丝雀发布** | 最低 | 慢 | 1.1-1.5x | 高风险模型 |
| **滚动更新** | 中 | 中 | 少 | 无状态服务 |
| **影子部署** | 无 | - | 2x | 验证新模型 |

---

## 2. 蓝绿部署 (Blue-Green Deployment)

### 2.1 原理

```
蓝绿部署: 同时维护两个完全相同的环境

┌─────────┐     ┌─────────┐
│  Blue   │     │  Green  │
│ (当前)  │     │ (新版)  │
└────┬────┘     └────┬────┘
     │               │
     └───────┬───────┘
             │
        ┌────┴────┐
        │  负载   │
        │  均衡器 │
        └────┬────┘
             │
           用户

切换: 负载均衡器将流量从 Blue 切换到 Green
回滚: 切换回 Blue (秒级)
```

### 2.2 实现

```yaml
# Kubernetes 蓝绿部署
apiVersion: apps/v1
kind: Deployment
metadata:
  name: model-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: model
      version: blue
  template:
    metadata:
      labels:
        app: model
        version: blue
    spec:
      containers:
      - name: model
        image: model:v1.0
---
apiVersion: v1
kind: Service
metadata:
  name: model-service
spec:
  selector:
    app: model
    version: blue  # 切换到 green 实现蓝绿部署
  ports:
  - port: 80
```

### 2.3 优缺点

```
优点:
  - 发布和回滚秒级完成
  - 零停机时间
  - 简单可靠

缺点:
  - 需要 2x 资源
  - 数据库迁移复杂
  - 长连接可能中断

适用:
  - 无状态模型服务
  - 需要快速回滚
  - 资源充足
```

---

## 3. 金丝雀发布 (Canary Deployment)

### 3.1 原理

```
金丝雀发布: 将新版本逐步推送给更多用户

阶段 1: 1% 流量 → 新版本
  └─ 监控: 无异常？继续

阶段 2: 5% 流量 → 新版本
  └─ 监控: 无异常？继续

阶段 3: 25% 流量 → 新版本
  └─ 监控: 无异常？继续

阶段 4: 50% 流量 → 新版本
  └─ 监控: 无异常？继续

阶段 5: 100% 流量 → 新版本
  └─ 发布完成

任何阶段异常 → 自动回滚到旧版本
```

### 3.2 实现

```yaml
# Kubernetes 金丝雀部署 (Istio)
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: model-service
spec:
  hosts:
  - model-service
  http:
  - route:
    - destination:
        host: model-service
        subset: stable
      weight: 90
    - destination:
        host: model-service
        subset: canary
      weight: 10
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: model-service
spec:
  host: model-service
  subsets:
  - name: stable
    labels:
      version: v1.0
  - name: canary
    labels:
      version: v2.0
```

### 3.3 金丝雀指标

```
关键监控指标:

延迟:
  - P50 延迟增加 > 10% → 告警
  - P95 延迟增加 > 20% → 暂停
  - P99 延迟增加 > 50% → 回滚

错误率:
  - 错误率增加 > 0.1% → 告警
  - 错误率增加 > 1% → 暂停
  - 错误率增加 > 5% → 回滚

业务指标:
  - 转化率下降 > 5% → 告警
  - 转化率下降 > 10% → 暂停
  - 用户投诉增加 → 回滚
```

---

## 4. 影子部署 (Shadow Deployment)

### 4.1 原理

```
影子部署: 新版本接收真实流量但不影响用户

用户请求
    │
    ├──→ 当前版本 → 返回给用户
    │
    └──→ 新版本 → 记录结果，不返回

对比分析:
  - 比较两个版本的输出
  - 分析性能差异
  - 验证新版本质量
```

### 4.2 应用场景

```
AI 模型影子部署:

  用户查询 → 当前模型 → 响应给用户
           → 新模型 → 记录响应

  分析:
  - 响应质量对比
  - 延迟对比
  - 错误率对比
  - 成本对比

优势:
  - 零风险验证
  - 真实流量测试
  - 可以长期运行

劣势:
  - 需要 2x 计算资源
  - 需要对比分析系统
```

---

## 5. 特征标志 (Feature Flags)

### 5.1 模型版本控制

```
使用特征标志控制模型版本:

  if feature_flag("new-rec-model"):
      model = load_model("v2.0")
  else:
      model = load_model("v1.0")

  result = model.predict(input)

优势:
  - 无需重新部署即可切换
  - 可以按用户/群体灰度
  - 支持快速回滚
  - 可以进行 A/B 测试
```

### 5.2 实现

```python
# 特征标志配置
feature_flags = {
    "new-rec-model": {
        "enabled": True,
        "rollout_percentage": 10,
        "whitelist": ["user-123", "user-456"],
        "blacklist": [],
    }
}

def get_model_version(user_id):
    flag = feature_flags["new-rec-model"]
    
    if not flag["enabled"]:
        return "v1.0"
    
    if user_id in flag["blacklist"]:
        return "v1.0"
    
    if user_id in flag["whitelist"]:
        return "v2.0"
    
    # 基于用户 ID 哈希决定
    hash_value = hash(user_id) % 100
    if hash_value < flag["rollout_percentage"]:
        return "v2.0"
    
    return "v1.0"
```

---

## 6. 自动化回滚 (Automated Rollback)

### 6.1 回滚策略

```
自动回滚触发条件:

1. 错误率阈值
   - 错误率 > 5% → 自动回滚

2. 延迟阈值
   - P95 延迟 > 2x 基线 → 自动回滚

3. 业务指标
   - 转化率下降 > 10% → 自动回滚

4. 健康检查
   - 健康检查连续失败 → 自动回滚

5. 人工触发
   - 运维人员手动回滚
```

### 6.2 回滚流程

```
检测异常
    │
    ├─→ 自动告警
    │
    ├─→ 暂停新版本流量
    │
    ├─→ 切换回旧版本
    │
    ├─→ 验证旧版本正常
    │
    └─→ 记录回滚原因和日志

目标: 从检测到回滚完成 < 5 分钟
```

---

## 7. 工程实践 (Engineering Practice)

### 7.1 策略选择

```
你的场景是什么？
├── 高风险模型 (核心业务) → 金丝雀发布 + 影子部署
├── 低风险模型 (辅助功能) → 蓝绿部署
├── 需要快速回滚 → 蓝绿部署
├── 需要长期验证 → 影子部署
├── 需要 A/B 测试 → 金丝雀发布 + 特征标志
└── 紧急修复 → 全量替换 (有风险)
```

### 7.2 最佳实践

```
1. 自动化一切
   - 自动化部署流程
   - 自动化监控告警
   - 自动化回滚决策

2. 渐进式发布
   - 从小比例开始
   - 逐步增加流量
   - 每个阶段观察足够时间

3. 监控先行
   - 部署前建立监控基线
   - 定义明确的回滚阈值
   - 设置多级告警

4. 回滚演练
   - 定期演练回滚流程
   - 确保回滚路径畅通
   - 记录回滚时间

5. 文档化
   - 记录发布流程
   - 记录回滚流程
   - 记录历史发布
```

---

## 相关阅读

- [[10_Deployment_Inference/Deployment_Inference]] — 部署与推理
- [[10_Deployment_Inference/Model_Registry]] — 模型注册中心
- [[11_MLOps_Pipeline/CI_CD/index]] — CI/CD
- [[09_Testing/AB_Testing_AI_Systems]] — A/B 测试
- Observability — 可观测性
- [[11_MLOps_Pipeline/Model_Serving_Patterns]] — 模型服务模式
