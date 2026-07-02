---
title: Agent Harness 部署与运维指南
category: 15-agent-production-agent-harness
tags: ["ai-agents", "agent-framework", "production", "langgraph", "model-deployment"]
summary: "> 从开发环境到生产环境的完整部署路径，涵盖容器化、K8s 编排、监控告警和运维最佳实践。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Harness Deployment Guide"
  - Harness_Deployment_Guide

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Agent Harness 部署与运维指南

> 从开发环境到生产环境的完整部署路径，涵盖容器化、K8s 编排、监控告警和运维最佳实践。

---

## 一、容器化部署

### 1.1 Docker 部署

#### Dockerfile

```dockerfile
# Dockerfile
FROM python:3.11-slim

# 安全：非 root 用户
RUN useradd -m -s /bin/bash agent

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    git \
    docker.io \
    && rm -rf /var/lib/apt/lists/*  # ⚠️ HIGH-RISK — 递归强制删除，不可逆 [回滚：见文档/备份]

# Python 依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 应用代码
COPY harness/ /app/harness/
COPY main.py /app/
WORKDIR /app

# 工作区
RUN mkdir -p /workspace && chown agent:agent /workspace

USER agent

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["python", "main.py"]
```

#### docker-compose.yml

```yaml
version: "3.8"

services:
  harness:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - HARNESS_WORKSPACE=/workspace
      - HARNESS_MAX_COST=10.0
    volumes:
      - ./workspace:/workspace
      - ./audit:/audit
      - /var/run/docker.sock:/var/run/docker.sock  # 用于启动子沙箱
    networks:
      - harness-net
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    networks:
      - harness-net

  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - harness-net

  grafana:
    image: grafana/grafana
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3000:3000"
    networks:
      - harness-net

volumes:
  redis-data:
  prometheus-data:
  grafana-data:

networks:
  harness-net:
    driver: bridge
```

### 1.2 启动命令

```bash
# 1. 构建
docker-compose build

# 2. 启动
docker-compose up -d

# 3. 查看日志
docker-compose logs -f harness

# 4. 健康检查
curl http://localhost:8000/health

# 5. 停止
docker-compose down
```

---

## 二、Kubernetes 部署

### 2.1 基础部署

```yaml
# k8s/harness-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agent-harness
  labels:
    app: agent-harness
spec:
  replicas: 3
  selector:
    matchLabels:
      app: agent-harness
  template:
    metadata:
      labels:
        app: agent-harness
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      containers:
      - name: harness
        image: agent-harness:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: harness-secrets
              key: openai-api-key
        - name: HARNESS_WORKSPACE
          value: "/workspace"
        - name: HARNESS_MAX_COST
          value: "10.0"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
        volumeMounts:
        - name: workspace
          mountPath: /workspace
        - name: audit
          mountPath: /audit
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: workspace
        persistentVolumeClaim:
          claimName: workspace-pvc
      - name: audit
        persistentVolumeClaim:
          claimName: audit-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: agent-harness
spec:
  selector:
    app: agent-harness
  ports:
  - port: 80
    targetPort: 8000
  type: ClusterIP
---
apiVersion: v1
kind: Secret
metadata:
  name: harness-secrets
type: Opaque
stringData:
  openai-api-key: "sk-..."
  anthropic-api-key: "sk-ant-..."
```

### 2.2 HPA 自动扩缩容

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: agent-harness-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: agent-harness
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

### 2.3 部署命令

```bash
# 创建命名空间
kubectl create namespace agent-system

# 应用配置
kubectl apply -f k8s/ -n agent-system

# 查看状态
kubectl get pods -n agent-system
kubectl get svc -n agent-system
kubectl get hpa -n agent-system

# 查看日志
kubectl logs -f deployment/agent-harness -n agent-system

# 水平扩展（手动）
kubectl scale deployment agent-harness --replicas=5 -n agent-system
```

---

## 三、监控与告警

### 3.1 Prometheus 指标

```python
# harness/metrics.py
from prometheus_client import Counter, Histogram, Gauge, Info, start_http_server

# 任务指标
TASK_COUNTER = Counter("harness_tasks_total", "Total tasks", ["status"])
TASK_DURATION = Histogram("harness_task_duration_seconds", "Task duration")
TASK_COST = Histogram("harness_task_cost_dollars", "Task cost")

# 性能指标
ACTIVE_TASKS = Gauge("harness_active_tasks", "Active tasks")
CONTEXT_USAGE = Gauge("harness_context_usage_ratio", "Context window usage")

# 安全指标
SECURITY_EVENTS = Counter("harness_security_events_total", "Security events", ["severity"])
BLOCKED_COMMANDS = Counter("harness_blocked_commands_total", "Blocked commands")

# 沙箱指标
SANDBOX_COUNT = Gauge("harness_sandbox_active", "Active sandboxes")
SANDBOX_CREATION_TIME = Histogram("harness_sandbox_creation_seconds", "Sandbox creation time")

class MetricsCollector:
    def __init__(self, port: int = 9090):
        start_http_server(port)
    
    def record_task(self, status: str, duration: float, cost: float):
        TASK_COUNTER.labels(status=status).inc()
        TASK_DURATION.observe(duration)
        TASK_COST.observe(cost)
    
    def record_security_event(self, severity: str):
        SECURITY_EVENTS.labels(severity=severity).inc()
    
    def set_active_tasks(self, count: int):
        ACTIVE_TASKS.set(count)
```

### 3.2 Grafana 仪表盘

```json
{
  "dashboard": {
    "title": "Agent Harness",
    "panels": [
      {
        "title": "Task Success Rate",
        "type": "stat",
        "targets": [{
          "expr": "sum(rate(harness_tasks_total{status='success'}[5m])) / sum(rate(harness_tasks_total[5m]))"
        }]
      },
      {
        "title": "Active Tasks",
        "type": "graph",
        "targets": [{"expr": "harness_active_tasks"}]
      },
      {
        "title": "P95 Task Duration",
        "type": "graph",
        "targets": [{
          "expr": "histogram_quantile(0.95, rate(harness_task_duration_seconds_bucket[5m]))"
        }]
      },
      {
        "title": "Daily Cost",
        "type": "stat",
        "targets": [{
          "expr": "sum(increase(harness_task_cost_dollars[1d]))"
        }]
      },
      {
        "title": "Security Events",
        "type": "graph",
        "targets": [{"expr": "sum(rate(harness_security_events_total[5m])) by (severity)"}]
      },
      {
        "title": "Context Usage",
        "type": "gauge",
        "targets": [{"expr": "avg(harness_context_usage_ratio)"}]
      }
    ]
  }
}
```

### 3.3 告警规则

```yaml
# prometheus/alerts.yml
groups:
- name: harness-alerts
  rules:
  - alert: HighTaskFailureRate
    expr: sum(rate(harness_tasks_total{status='failure'}[5m])) / sum(rate(harness_tasks_total[5m])) > 0.2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Task failure rate > 20%"
      description: "{{ $value | humanizePercentage }} of tasks are failing"

  - alert: HighCost
    expr: sum(increase(harness_task_cost_dollars[1h])) > 50
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Hourly cost > $50"

  - alert: CriticalSecurityEvent
    expr: sum(rate(harness_security_events_total{severity='critical'}[5m])) > 0
    for: 0m
    labels:
      severity: critical
    annotations:
      summary: "Critical security event detected"

  - alert: ContextWindowNearLimit
    expr: harness_context_usage_ratio > 0.9
    for: 1m
    labels:
      severity: warning
    annotations:
      summary: "Context window usage > 90%"

  - alert: SandboxPoolExhausted
    expr: harness_sandbox_active / harness_sandbox_limit > 0.95
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "Sandbox pool > 95% utilized"
```

---

## 四、日志管理

### 4.1 结构化日志

```python
import structlog
import logging

structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# 使用
logger.info("task_started", task_id="123", agent_id="agent-1")
logger.warning("high_cost_alert", task_id="123", cost=8.5, threshold=10.0)
logger.error("sandbox_crash", task_id="123", error="OOM")
```

### 4.2 ELK 集成

```yaml
# docker-compose.logging.yml
version: "3.8"

services:
  elasticsearch:
    image: elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes:
      - es-data:/usr/share/elasticsearch/data

  logstash:
    image: logstash:8.5.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: kibana:8.5.0
    ports:
      - "5601:5601"

volumes:
  es-data:
```

---

## 五、备份与恢复

### 5.1 备份策略

| 数据 | 备份频率 | 保留期 | 方式 |
|------|---------|--------|------|
| 工作区文件 | 每小时 | 7 天 | rsync + S3 |
| 审计日志 | 实时 | 90 天 | 流式归档 |
| 向量数据库 | 每日 | 30 天 | pg_dump / 快照 |
| 配置 | 每次变更 | 无限 | Git |

### 5.2 恢复流程

```bash
#!/bin/bash
# restore.sh

BACKUP_DIR="s3://harness-backups/$(date -d '1 day ago' +%Y%m%d)"
WORKSPACE="/workspace"

# 1. 停止服务
kubectl scale deployment agent-harness --replicas=0

# 2. 恢复数据
aws s3 sync $BACKUP_DIR/workspace $WORKSPACE

# 3. 验证
ls -la $WORKSPACE

# 4. 重启
kubectl scale deployment agent-harness --replicas=3

# 5. 健康检查
kubectl rollout status deployment/agent-harness
```

---

## 六、运维手册

### 6.1 日常巡检

```bash
#!/bin/bash
# daily-check.sh

echo "=== Agent Harness Daily Check ==="

# 1. Pod 状态
kubectl get pods -n agent-system

# 2. 资源使用
kubectl top pods -n agent-system

# 3. 任务成功率（最近 1 小时）
curl -s http://prometheus:9090/api/v1/query \
  --data-urlencode 'query=sum(rate(harness_tasks_total{status="success"}[1h])) / sum(rate(harness_tasks_total[1h]))'

# 4. 安全检查
curl -s http://prometheus:9090/api/v1/query \
  --data-urlencode 'query=sum(rate(harness_security_events_total[1d]))'

# 5. 成本检查
curl -s http://prometheus:9090/api/v1/query \
  --data-urlencode 'query=sum(increase(harness_task_cost_dollars[1d]))'

echo "=== Check Complete ==="
```

### 6.2 常见问题处理

| 问题 | 诊断 | 修复 |
|------|------|------|
| Pod CrashLoopBackOff | `kubectl logs --previous` | 检查环境变量、资源限制 |
| 高延迟 | Grafana P99 延迟图 | 扩容、优化 Prompt、启用缓存 |
| 成本飙升 | 成本仪表盘 | 启用模型路由、检查循环任务 |
| 沙箱频繁崩溃 | 沙箱日志 | 增加内存限制、检查 OOM |
| 安全告警 | 审计日志 | 隔离 Agent、审查命令历史 |

---

## 🔗 相关主题

- [Harness Implementation Guide](./Harness_Implementation_Guide.md) — 应用代码实现
- [Harness Security Guide](./Harness_Security_Guide.md) — 安全加固
- [Agent Harness 技术架构 2026](./Agent_Harness_Architecture_2026.md) — 架构设计
- [Harness-in-nutshell.md](./Harness-in-nutshell.md) — 上线检查清单

---

> 📅 **最后更新**：2026-05-07

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Harness/Multi_Agent_Harness_Design.md|Multi_Agent_Harness_Design]]
