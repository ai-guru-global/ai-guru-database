---
title: 云产品运维 Agent 运维指南 (Operations)
category: 18-cloud-ops-agent-docs-operations
tags: ["cloud-ops", "devops", "sre", "automation", "ai-agents"]
summary: "> 🎯 **目标**: 为运维工程师提供 Cloud Ops Agent 的日常运维、监控告警、故障处理、性能调优、安全运维的完整实操指南，确保系统稳定高效运行。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# 云产品运维 Agent 运维指南 (Operations)

> 🎯 **目标**: 为运维工程师提供 Cloud Ops Agent 的日常运维、监控告警、故障处理、性能调优、安全运维的完整实操指南，确保系统稳定高效运行。

---

## 1. 运维职责与角色

### 1.1 运维团队职责矩阵

| 角色 | 主要职责 | 技能要求 |
|-----|---------|---------|
| **SRE** | 可靠性工程、容量规划、SLO 达成 | 分布式系统、K8s、监控 |
| **Ops Engineer** | 日常运维、故障处理、变更执行 | 云平台、脚本、自动化 |
| **Security Ops** | 安全监控、漏洞响应、合规 | 安全工具、日志分析 |
| **NOC Engineer** | 7x24 监控、告警响应 | 监控工具、沟通能力 |

### 1.2 运维流程

```
运维流程
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│                         运维生命周期                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1️⃣ 监控 (Monitoring)                                               │
│     └─ 指标采集 → 告警检测 → 状态可视化                               │
│                                                                      │
│  2️⃣ 事件 (Incident)                                                │
│     └─ 发现 → 分级 → 响应 → 诊断 → 解决 → 复盘                       │
│                                                                      │
│  3️⃣ 变更 (Change)                                                  │
│     └─ 申请 → 审批 → 执行 → 验证 → 完成                              │
│                                                                      │
│  4️⃣ 问题 (Problem)                                                  │
│     └─ 分析 → 根因 → 解决 → 预防                                     │
│                                                                      │
│  5️⃣ 知识 (Knowledge)                                               │
│     └─ 积累 → 审核 → 发布 → 应用                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. 日常运维

### 2.1 日常检查清单

```bash
#!/bin/bash
# 每日运维检查脚本

echo "===== Cloud Ops Agent 每日检查 ====="

# 1. 系统健康检查
echo "[1/8] 检查系统健康状态..."
curl -s http://localhost:8080/health | jq .

# 2. Agent 实例状态
echo "[2/8] 检查 Agent 实例..."
kubectl get pods -n cloud-ops -l app=cloud-ops-agent

# 3. 错误率检查
echo "[3/8] 检查错误率..."
promql query 'rate(cloud_ops_errors_total[5m])' | head -5

# 4. 延迟 P99 检查
echo "[4/8] 检查延迟..."
promql query 'histogram_quantile(0.99, rate(cloud_ops_request_duration_seconds_bucket[5m]))'

# 5. 任务队列状态
echo "[5/8] 检查任务队列..."
kubectl get queues -n cloud-ops

# 6. 磁盘使用情况
echo "[6/8] 检查磁盘..."
df -h | grep -E '/var/log|/data'

# 7. 证书过期检查
echo "[7/8] 检查证书..."
check_cert_expiry.sh --days 30

# 8. 安全日志检查
echo "[8/8] 检查安全告警..."
kubectl logs -n cloud-ops -l app=security-agent --tail=100 | grep -i alert

echo "===== 检查完成 ====="
```

### 2.2 指标监控

```yaml
# 监控指标配置
monitoring:
  # 基础设施指标
  infrastructure:
    - name: "cpu_usage"
      query: 'avg(rate(container_cpu_usage_seconds_total{app="cloud-ops-agent"}[5m]))'
      threshold: 80
      alert: "warning"

    - name: "memory_usage"
      query: 'avg(container_memory_usage_bytes{app="cloud-ops-agent"}) / container_spec_memory_limit_bytes'
      threshold: 85
      alert: "warning"

    - name: "disk_usage"
      query: 'node_filesystem_avail_bytes / node_filesystem_size_bytes'
      threshold: 90
      alert: "critical"

  # 应用指标
  application:
    - name: "request_rate"
      query: 'rate(cloud_ops_requests_total[5m])'
      threshold: 1000
      alert: "warning"

    - name: "error_rate"
      query: 'rate(cloud_ops_errors_total[5m]) / rate(cloud_ops_requests_total[5m])'
      threshold: 0.01
      alert: "critical"

    - name: "p99_latency"
      query: 'histogram_quantile(0.99, rate(cloud_ops_request_duration_seconds_bucket[5m]))'
      threshold: 2.0
      alert: "warning"

    - name: "task_queue_depth"
      query: 'cloud_ops_task_queue_depth'
      threshold: 100
      alert: "warning"

  # Agent 特有指标
  agent:
    - name: "active_agents"
      query: 'cloud_ops_active_agents'
      threshold: 3
      alert: "critical"

    - name: "task_success_rate"
      query: 'rate(cloud_ops_tasks_completed_total{status="success"}[5m]) / rate(cloud_ops_tasks_total[5m])'
      threshold: 0.95
      alert: "warning"

    - name: "tool_call_error_rate"
      query: 'rate(cloud_ops_tool_errors_total[5m]) / rate(cloud_ops_tool_calls_total[5m])'
      threshold: 0.01
      alert: "warning"
```

### 2.3 告警配置

```yaml
# 告警规则
alerts:
  - name: "high_error_rate"
    condition: "error_rate > 0.01"
    severity: "critical"
    channels: ["pagerduty", "slack"]
    message: |
      Cloud Ops Agent 错误率超过 1%
      当前错误率: {{ $value }}
      请立即检查！

  - name: "high_latency"
    condition: "p99_latency > 5s"
    severity: "warning"
    channels: ["slack"]
    message: |
      Cloud Ops Agent P99 延迟超过 5 秒
      当前 P99: {{ $value }}

  - name: "agent_down"
    condition: "active_agents < 2"
    severity: "critical"
    channels: ["pagerduty", "slack"]
    message: |
      Agent 实例数量不足！
      当前活跃实例: {{ $value }}
      请立即处理！

  - name: "task_queue_full"
    condition: "task_queue_depth > 500"
    severity: "warning"
    channels: ["slack"]
    message: |
      任务队列积压严重
      当前队列深度: {{ $value }}

  - name: "security_violation"
    condition: "security_violations > 0"
    severity: "critical"
    channels: ["pagerduty", "slack", "email"]
    message: |
      检测到安全违规事件！
      请立即介入调查。
```

---

## 3. 故障处理

### 3.1 故障分级

| 级别 | 定义 | 响应时间 | 解决时间 | 通知范围 |
|-----|------|---------|---------|---------|
| **P0 - 严重** | 全系统不可用 | 5 分钟 | 1 小时 | 全员通知 |
| **P1 - 高** | 核心功能不可用 | 15 分钟 | 4 小时 | 团队 + 管理层 |
| **P2 - 中** | 非核心功能受损 | 1 小时 | 24 小时 | 团队 |
| **P3 - 低** | 轻微问题 | 4 小时 | 72 小时 | 相关人员 |

### 3.2 故障处理流程

```python
"""故障处理流程"""

class IncidentHandler:
    """故障处理器"""

    def __init__(self):
        self.notification_service = NotificationService()
        self.escalation_manager = EscalationManager()
        self.runbook_runner = RunbookRunner()

    async def handle_incident(
        self,
        incident: Incident
    ):
        """处理故障"""

        # 1. 接收告警
        await self._receive_alert(incident)

        # 2. 创建故障单
        ticket = await self._create_ticket(incident)

        # 3. 分级响应
        severity = self._assess_severity(incident)

        # 4. 通知相关人员
        await self._notify_stakeholders(incident, severity)

        # 5. 开始诊断
        diagnosis = await self._start_diagnosis(incident)

        # 6. 执行恢复
        if incident.auto_recoverable:
            recovery = await self._auto_recover(incident)
        else:
            recovery = await self._manual_recover(incident, ticket)

        # 7. 验证恢复
        await self._verify_recovery(incident)

        # 8. 关闭故障单
        await self._close_ticket(ticket)

        # 9. 生成报告
        report = await self._generate_report(incident, ticket)

        # 10. 复盘
        if severity in ["P0", "P1"]:
            await self._schedule_postmortem(incident, report)

    async def _auto_recover(
        self,
        incident: Incident
    ):
        """自动恢复"""

        # 根据故障类型选择恢复策略
        if incident.type == "agent_down":
            await self._restart_agent(incident)
        elif incident.type == "high_latency":
            await self._scale_out(incident)
        elif incident.type == "queue_full":
            await self._drain_queue(incident)

        # 等待恢复
        await asyncio.sleep(30)

        # 验证
        if not await self._is_recovered(incident):
            raise RecoveryFailedError()
```

### 3.3 常见故障处理手册

```markdown
## 故障处理手册 (Runbook)

### 故障 #1: Agent 实例无响应

**症状**: Agent 无法处理请求，健康检查失败

**排查步骤**:
1. 检查 Pod 状态: `kubectl get pods -n cloud-ops | grep agent`
2. 查看日志: `kubectl logs -f <pod-name> -n cloud-ops`
3. 检查资源: `kubectl top pod <pod-name> -n cloud-ops`

**可能原因**:
- OOM (内存不足)
- CPU Throttling
- 网络问题
- 代码死锁

**修复步骤**:
```bash
# 1. 重启 Pod
kubectl delete pod <pod-name> -n cloud-ops  # ⚠️ HIGH-RISK — 删除 K8s 资源，服务可能中断 [回滚：见文档/备份]

# 2. 如果频繁重启，检查资源限制
kubectl edit deployment cloud-ops-agent -n cloud-ops

# 3. 增加资源
resources:
  requests:
    memory: "4Gi"
    cpu: "2"
  limits:
    memory: "8Gi"
    cpu: "4"
```

---

### 故障 #2: 任务队列积压

**症状**: 任务队列深度持续 > 100，延迟增加

**排查步骤**:
1. 检查队列状态: `kubectl get queues -n cloud-ops`
2. 查看 Worker 日志: `kubectl logs -f <worker-pod> -n cloud-ops`
3. 检查 Worker 数量: `kubectl get deployment -n cloud-ops`

**修复步骤**:
```bash
# 1. 扩容 Worker
kubectl scale deployment cloud-ops-worker --replicas=10 -n cloud-ops

# 2. 如果队列仍积压，增加并发
kubectl set env deployment/cloud-ops-worker MAX_CONCURRENT_TASKS=20 -n cloud-ops

# 3. 如果消息有问题，清空队列
kubectl exec -it <queue-manager> -n cloud-ops -- redis-cli FLUSHDB
```

---

### 故障 #3: 云 API 调用失败

**症状**: Tool 调用失败，错误信息 "API Rate Limit Exceeded"

**排查步骤**:
1. 查看错误日志: `kubectl logs -f -l app=cloud-ops-agent | grep "rate limit"`
2. 检查 API 配额: 登录云控制台查看

**修复步骤**:
```bash
# 1. 降低调用频率
kubectl set env deployment/cloud-ops-agent TOOL_CALL_DELAY=1s -n cloud-ops

# 2. 如果是云厂商问题，等待重试
# (系统有内置重试机制)

# 3. 如果需要，临时扩容以分散请求
kubectl scale deployment cloud-ops-agent --replicas=10 -n cloud-ops
```
```

---

## 4. 变更管理

### 4.1 变更流程

```python
"""变更管理流程"""

class ChangeManager:
    """变更管理器"""

    def __init__(self):
        self.approval_service = ApprovalService()
        self.change_control = ChangeControl()
        self.backup_service = BackupService()

    async def submit_change(
        self,
        change_request: ChangeRequest
    ) -> ChangeTicket:
        """提交变更"""

        # 1. 风险评估
        risk_assessment = await self._assess_risk(change_request)

        # 2. 生成变更计划
        plan = await self._generate_plan(change_request)

        # 3. 获取审批
        approvals = await self._get_approvals(change_request, risk_assessment)

        # 4. 创建变更单
        ticket = await self.change_control.create_ticket(
            request=change_request,
            risk_assessment=risk_assessment,
            plan=plan,
            approvals=approvals
        )

        return ticket

    async def execute_change(
        self,
        ticket_id: str
    ):
        """执行变更"""

        ticket = await self.change_control.get_ticket(ticket_id)

        # 1. 备份
        await self.backup_service.backup_state()

        # 2. 执行前检查
        pre_checks = await self._run_pre_checks(ticket)
        if not all(pre_checks.values()):
            raise PreCheckFailedError(pre_checks)

        # 3. 执行变更
        result = await self._execute_plan(ticket.plan)

        # 4. 验证
        if not await self._verify_change(ticket):
            # 回滚
            await self._rollback_change(ticket)
            raise ChangeFailedError()

        # 5. 完成
        await self.change_control.complete_ticket(ticket_id)
```

### 4.2 变更风险评估

```python
"""变更风险评估"""

RISK_ASSESSMENT_CRITERIA = {
    "change_type": {
        "routine": 1,      # 例行变更
        "minor": 2,       # 小变更
        "significant": 4, # 重要变更
        "major": 8        # 重大变更
    },
    "impact_area": {
        "none": 0,
        "single_component": 1,
        "multiple_components": 3,
        "entire_system": 5
    },
    "rollback_difficulty": {
        "trivial": 1,
        "easy": 2,
        "moderate": 4,
        "difficult": 8
    },
    "downtime_required": {
        "none": 0,
        "minimal": 1,
        "some": 3,
        "significant": 5
    }
}

def calculate_risk_score(change: ChangeRequest) -> int:
    """计算风险分数"""
    score = 0
    score += RISK_ASSESSMENT_CRITERIA["change_type"].get(change.type, 0)
    score += RISK_ASSESSMENT_CRITERIA["impact_area"].get(change.impact, 0)
    score += RISK_ASSESSMENT_CRITERIA["rollback_difficulty"].get(change.rollback_difficulty, 0)
    score += RISK_ASSESSMENT_CRITERIA["downtime_required"].get(change.downtime, 0)
    return score

RISK_LEVELS = {
    "low": (0, 4),       # 无需审批
    "medium": (5, 10),   # 团队负责人审批
    "high": (11, 18),    # 部门负责人审批
    "critical": (19, 20) # 多级审批 + 安全审批
}
```

---

## 5. 性能调优

### 5.1 性能基线

```yaml
# 性能基线配置
performance_baseline:
  # 延迟基线 (秒)
  latency:
    p50: 0.2      # 200ms
    p95: 1.0      # 1s
    p99: 2.0      # 2s
    p999: 5.0     # 5s

  # 吞吐量基线 (请求/秒)
  throughput:
    baseline: 500
    target: 1000
    max: 2000

  # 资源使用基线
  resources:
    cpu_utilization: 0.7     # 70%
    memory_utilization: 0.8   # 80%
    disk_io: 0.6             # 60%

  # 任务执行基线
  tasks:
    avg_execution_time: 10    # 秒
    max_execution_time: 60   # 秒
    success_rate: 0.98
```

### 5.2 性能调优参数

```yaml
# 调优参数配置
tuning:
  # Agent 配置
  agent:
    max_concurrent_tasks: 50
    task_timeout_seconds: 300
    retry_max_attempts: 3
    retry_backoff_seconds: 5

  # 工具调用配置
  tool:
    call_timeout_seconds: 30
    max_concurrent_calls: 100
    rate_limit_per_second: 1000

  # 缓存配置
  cache:
    enabled: true
    ttl_seconds: 300
    max_size_mb: 1024

  # 连接池配置
  connection_pool:
    redis:
      min_connections: 10
      max_connections: 50
      timeout_seconds: 5

    database:
      min_connections: 20
      max_connections: 100
      timeout_seconds: 10
```

---

## 6. 安全运维

### 6.1 安全运维检查

```bash
#!/bin/bash
# 安全检查脚本

echo "===== Cloud Ops Agent 安全检查 ====="

# 1. 检查未授权访问
echo "[1/5] 检查未授权访问..."
kubectl logs -n cloud-ops -l app=gateway | grep "401 Unauthorized" | wc -l

# 2. 检查权限违规
echo "[2/5] 检查权限违规..."
kubectl logs -n cloud-ops -l app=agent | grep "Permission denied" | tail -20

# 3. 检查异常操作模式
echo "[3/5] 检查异常操作..."
kubectl logs -n cloud-ops -l app=agent | grep -E "(delete.*\*|drop.*table)" | head -10

# 4. 检查证书状态
echo "[4/5] 检查证书..."
openssl s_client -connect api.cloudops.example:443 -showcerts 2>/dev/null | openssl x509 -noout -dates

# 5. 检查网络连接
echo "[5/5] 检查网络连接..."
netstat -an | grep ESTABLISHED | wc -l

echo "===== 安全检查完成 ====="
```

### 6.2 安全事件响应

```python
"""安全事件响应"""

class SecurityIncidentHandler:
    """安全事件处理器"""

    async def handle_security_incident(
        self,
        incident: SecurityIncident
    ):
        """处理安全事件"""

        # 1. 确认事件
        confirmed = await self._confirm_incident(incident)
        if not confirmed:
            return

        # 2. 隔离影响
        await self._isolate_impact(incident)

        # 3. 收集证据
        evidence = await self._collect_evidence(incident)

        # 4. 分析根因
        root_cause = await self._analyze_root_cause(evidence)

        # 5. 修复漏洞
        await self._remediate(incident, root_cause)

        # 6. 恢复服务
        await self._restore_service(incident)

        # 7. 通知
        await self._notify_security_team(incident, evidence, root_cause)

        # 8. 生成报告
        await self._generate_security_report(incident, evidence, root_cause)

# 安全事件类型
SECURITY_INCIDENT_TYPES = {
    "unauthorized_access": {
        "severity": "critical",
        "response_time": "5m",
        "actions": ["isolate", "notify", "investigate"]
    },
    "data_breach": {
        "severity": "critical",
        "response_time": "5m",
        "actions": ["isolate", "notify", "contain", "escalate"]
    },
    "permission_violation": {
        "severity": "high",
        "response_time": "15m",
        "actions": ["block", "investigate", "notify"]
    },
    "suspicious_activity": {
        "severity": "medium",
        "response_time": "1h",
        "actions": ["monitor", "investigate", "notify"]
    }
}
```

---

## 7. 容量管理

### 7.1 容量规划

```python
"""容量规划"""

class CapacityPlanner:
    """容量规划器"""

    def plan_capacity(
        self,
        current_usage: Dict,
        growth_rate: float,
        time_horizon_months: int
    ) -> CapacityPlan:
        """规划容量"""

        # 1. 分析当前使用
        current_capacity = self._analyze_current_capacity(current_usage)

        # 2. 预测增长
        predictions = self._predict_growth(
            current_usage,
            growth_rate,
            time_horizon_months
        )

        # 3. 识别瓶颈
        bottlenecks = self._identify_bottlenecks(predictions)

        # 4. 生成建议
        recommendations = self._generate_recommendations(
            predictions,
            bottlenecks
        )

        # 5. 成本估算
        cost_estimate = self._estimate_cost(recommendations)

        return CapacityPlan(
            current_capacity=current_capacity,
            predictions=predictions,
            bottlenecks=bottlenecks,
            recommendations=recommendations,
            cost_estimate=cost_estimate,
            timeline=self._generate_timeline(recommendations)
        )

    def _predict_growth(
        self,
        current_usage: Dict,
        growth_rate: float,
        months: int
    ) -> List[Prediction]:
        """预测增长"""
        predictions = []

        for month in range(1, months + 1):
            predicted = {
                "month": month,
                "cpu": current_usage["cpu"] * (1 + growth_rate) ** month,
                "memory": current_usage["memory"] * (1 + growth_rate) ** month,
                "storage": current_usage["storage"] * (1 + growth_rate * 0.5) ** month,
                "requests": current_usage["requests"] * (1 + growth_rate) ** month
            }
            predictions.append(predicted)

        return predictions
```

### 7.2 扩容操作

```bash
# 扩容 Agent
kubectl scale deployment cloud-ops-agent --replicas=10 -n cloud-ops

# 扩容 Worker
kubectl scale deployment cloud-ops-worker --replicas=20 -n cloud-ops

# 扩容 Redis
kubectl scale statefulset redis --replicas=3 -n cloud-ops

# 扩容 PostgreSQL
kubectl scale statefulset postgresql --replicas=3 -n cloud-ops
```

---

## 8. 运维自动化

### 8.1 自动化运维任务

```yaml
# 自动化运维任务
automations:
  - name: "auto_restart_failed_pods"
    schedule: "*/5 * * * *"  # 每 5 分钟
    action: |
      kubectl get pods -n cloud-ops -o json | jq -r '.items[] |
        select(.status.phase != "Running") |
        .metadata.name' | xargs -r kubectl delete pod -n cloud-ops  # ⚠️ HIGH-RISK — 删除 K8s 资源，服务可能中断 [回滚：见文档/备份]

  - name: "auto_cleanup_old_logs"
    schedule: "0 2 * * *"  # 每天凌晨 2 点
    action: |
      find /var/log/cloud-ops -mtime +30 -delete  # ⚠️ HIGH-RISK — find 删除文件，不可逆 [回滚：见文档/备份]

  - name: "auto_scale_on_load"
    trigger: "cpu_usage > 80%"
    action: |
      kubectl scale deployment cloud-ops-agent --current-replicas=3 --replicas=6 -n cloud-ops

  - name: "auto_health_check"
    schedule: "*/1 * * * *"
    action: |
      curl -f http://localhost:8080/health || kubectl rollout restart deployment/cloud-ops-agent -n cloud-ops
```

### 8.2 自愈机制

```python
"""自愈机制"""

class SelfHealingManager:
    """自愈管理器"""

    HEALING_RULES = {
        "agent_down": {
            "condition": "agent_unavailable > 1",
            "action": "restart_agent",
            "cooldown": 300
        },
        "high_error_rate": {
            "condition": "error_rate > 0.05",
            "action": "scale_out",
            "cooldown": 600
        },
        "queue_full": {
            "condition": "queue_depth > 200",
            "action": "scale_workers",
            "cooldown": 300
        },
        "disk_space_low": {
            "condition": "disk_usage > 90%",
            "action": "cleanup_logs",
            "cooldown": 3600
        },
        "memory_pressure": {
            "condition": "memory_usage > 90%",
            "action": "restart_and_scale",
            "cooldown": 600
        }
    }

    async def check_and_heal(self):
        """检查并自愈"""
        for rule_name, rule in self.HEALING_RULES.items():
            if await self._check_condition(rule["condition"]):
                if self._check_cooldown(rule_name, rule["cooldown"]):
                    await self._execute_action(rule["action"])
                    self._update_cooldown(rule_name)

    async def _execute_action(self, action: str):
        """执行自愈动作"""
        if action == "restart_agent":
            await self.kubernetes.restart_pods("cloud-ops-agent")
        elif action == "scale_out":
            await self.kubernetes.scale("cloud-ops-agent", replicas=+3)
        elif action == "scale_workers":
            await self.kubernetes.scale("cloud-ops-worker", replicas=+5)
        elif action == "cleanup_logs":
            await self.storage.cleanup_old_logs(days=7)
        elif action == "restart_and_scale":
            await self.kubernetes.restart_and_scale("cloud-ops-agent", replicas=+2)
```

---

## 9. SLO 管理

### 9.1 SLO 定义

```yaml
# SLO 配置
slos:
  - name: "availability"
    display_name: "系统可用性"
    description: "Agent 可处理请求的时间占比"
    target: 99.95
    window: "30d"
    sli: |
      1 - (sum(error_5xx_total) / sum(requests_total))
    error_budget:
      target: 99.95
      alert_threshold: 99.9

  - name: "latency"
    display_name: "响应延迟"
    description: "P99 响应时间"
    target: "< 2s"
    window: "30d"
    sli: |
      histogram_quantile(0.99, rate(request_duration_seconds_bucket[5m]))
    alert_threshold: "3s"

  - name: "task_success"
    display_name: "任务成功率"
    description: "Agent 成功完成任务的比例"
    target: 98
    window: "30d"
    sli: |
      sum(task_completed_total{status="success"}) / sum(task_completed_total)
    error_budget:
      target: 98
      alert_threshold: 95

  - name: "mttr"
    display_name: "故障恢复时间"
    description: "平均故障恢复时间"
    target: "< 5min"
    window: "30d"
    sli: |
      avg(incident_resolution_time_seconds)
    alert_threshold: "10min"
```

---

## 10. 最佳实践清单

### 10.1 运维最佳实践

- [ ] **自动化优先**: 能自动化的不手动执行
- [ ] **基础设施即代码**: 所有配置使用代码管理
- [ ] **监控全面化**: 覆盖所有关键指标
- [ ] **告警智能化**: 减少误报，提高信噪比
- [ ] **文档同步更新**: 操作变更时更新文档
- [ ] **知识沉淀**: 将经验转化为 Runbook

### 10.2 故障处理最佳实践

- [ ] **快速响应**: 按 SLA 要求及时响应
- [ ] **止损优先**: 先恢复服务，再分析根因
- [ ] **信息透明**: 及时同步状态给相关方
- [ ] **完整记录**: 保留故障处理全过程
- [ ] **复盘改进**: 重大故障必须复盘

### 10.3 变更管理最佳实践

- [ ] **风险评估**: 变更前评估风险
- [ ] **审批流程**: 按风险等级执行审批
- [ ] **灰度发布**: 先小范围验证
- [ ] **回滚方案**: 变更前准备回滚方案
- [ ] **变更窗口**: 选择低峰期执行变更

---

## 11. 交叉引用

| 相关文档 | 说明 |
|---------|------|
| [架构设计](../architecture/索引.md) | 了解系统架构 |
| [研发指南](../development/索引.md) | 了解如何修复问题 |
| [测试指南](../testing/索引.md) | 了解测试验收 |
| [集成测试](./integration_testing/索引.md) | 了解集成测试 |
| [语料指南](./corpus/索引.md) | 了解 AI 能力 |
| [产品指南](./product/索引.md) | 了解产品需求 |

---

*最后更新: 2026-04-15*
*版本: 2.0.0*
*维护者: 运维团队*

## Related

- [[18_Cloud_Ops_Agent/CloudOps-in-nutshell]] — 云产品运维 Agent 速成指南 (共享: ai-agents, automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/Cloud_Product_Ops_for_dummy]] — 云产品运维 Agent 入门指南 (for Dummies) (共享: ai-agents, automation, cloud-ops, devops, sre)
- index — 云产品运维 Agent 架构设计指南 (Architecture) (共享: ai-agents, automation, cloud-ops, devops, sre)
- index — 云产品运维 Agent 语料工程指南 (Corpus Engineering) (共享: ai-agents, automation, cloud-ops, devops, sre)
