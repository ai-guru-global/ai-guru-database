---
title: Production Assessment
category: 13-agent-production-16-agent-evaluation-assessment
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> Protocols for evaluating AI agents in production environments"
created: 2026-05-31
updated: 2026-05-31
---

# Production Assessment

> Protocols for evaluating AI agents in production environments

## Overview

This document provides comprehensive protocols for assessing AI agents in production environments, including pre-deployment evaluation, shadow testing, canary deployments, continuous monitoring, and rollback procedures.

---

## 1. Pre-Deployment Evaluation Checklist

### 1.1 Comprehensive Pre-Deployment Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                 PRE-DEPLOYMENT EVALUATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PHASE 1: QUALIFICATION GATE                                    │
│  ─────────────────────────────────────────────────────────────  │
│  □ Core benchmark suite passed (>80% score)                     │
│  □ Safety evaluation passed (100% critical tests)               │
│  □ Performance baseline established                             │
│  □ Resource requirements documented                             │
│                                                                  │
│  PHASE 2: INTEGRATION VERIFICATION                              │
│  ─────────────────────────────────────────────────────────────  │
│  □ API compatibility verified                                   │
│  □ Authentication/authorization tested                          │
│  □ Rate limiting configured and tested                          │
│  □ Error handling verified                                      │
│  □ Timeout configurations validated                             │
│                                                                  │
│  PHASE 3: OPERATIONAL READINESS                                 │
│  ─────────────────────────────────────────────────────────────  │
│  □ Monitoring dashboards configured                             │
│  □ Alerting rules defined and tested                            │
│  □ Logging integration verified                                 │
│  □ Runbooks prepared for common issues                          │
│  □ On-call rotation aware of new agent                          │
│                                                                  │
│  PHASE 4: DOCUMENTATION                                         │
│  ─────────────────────────────────────────────────────────────  │
│  □ Agent capabilities documented                                │
│  □ Known limitations documented                                 │
│  □ Failure modes and recovery procedures documented             │
│  □ Escalation paths defined                                     │
│                                                                  │
│  PHASE 5: APPROVAL                                              │
│  ─────────────────────────────────────────────────────────────  │
│  □ Technical review completed                                   │
│  □ Security review completed                                    │
│  □ Stakeholder sign-off obtained                                │
│  □ Rollback plan approved                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Qualification Gate Criteria

```yaml
qualification_gate:
  minimum_requirements:
    benchmark_score:
      overall: 80
      accuracy: 85
      safety: 100  # Zero tolerance for safety failures
      
    test_coverage:
      core_functionality: 100%
      edge_cases: 80%
      adversarial: 100%
      
    performance:
      p95_latency: "<3000ms"
      error_rate: "<5%"
      
  blocking_issues:
    - Any critical safety failure
    - Security vulnerabilities (high/critical)
    - Core functionality failure rate >10%
    - Data leakage incidents
    
  conditional_pass:
    - Minor functionality gaps with documented workarounds
    - Performance slightly below target with improvement plan
    - Non-critical edge case failures with monitoring
```

---

## 2. Shadow Mode Testing Protocol

### 2.1 Shadow Mode Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SHADOW MODE TESTING                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌──────────────┐                              │
│                    │   Incoming   │                              │
│                    │   Request    │                              │
│                    └──────┬───────┘                              │
│                           │                                      │
│                    ┌──────▼───────┐                              │
│                    │   Traffic    │                              │
│                    │   Splitter   │                              │
│                    └──────┬───────┘                              │
│                           │                                      │
│              ┌────────────┼────────────┐                        │
│              │            │            │                        │
│              ▼            │            ▼                        │
│       ┌──────────┐       │     ┌──────────┐                    │
│       │Production│       │     │  Shadow  │                    │
│       │  Agent   │       │     │  Agent   │                    │
│       └────┬─────┘       │     └────┬─────┘                    │
│            │             │          │                           │
│            ▼             │          ▼                           │
│       ┌──────────┐       │     ┌──────────┐                    │
│       │  User    │       │     │ Discard  │                    │
│       │ Response │       │     │ Response │                    │
│       └──────────┘       │     └──────────┘                    │
│                          │          │                           │
│                          │          ▼                           │
│                          │     ┌──────────┐                    │
│                          │     │ Compare  │                    │
│                          └────▶│ & Analyze│                    │
│                                └──────────┘                    │
│                                                                  │
│  • Shadow agent receives same requests as production            │
│  • Shadow responses are NOT returned to users                   │
│  • Both responses are logged and compared                       │
│  • No user impact from shadow agent failures                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Shadow Testing Configuration

```yaml
shadow_testing_config:
  duration:
    minimum: "7 days"
    recommended: "14 days"
    
  traffic_sampling:
    percentage: 100  # Mirror all traffic in shadow
    filters:
      - exclude_pii: true
      - exclude_sensitive_operations: true
      
  comparison_metrics:
    response_similarity:
      method: "semantic_similarity"
      threshold: 0.85
      
    performance_delta:
      latency_tolerance: "20%"
      error_rate_tolerance: "2%"
      
    output_quality:
      correctness_comparison: true
      safety_comparison: true
      
  success_criteria:
    response_similarity: "≥85% matching decisions"
    performance: "Within 20% of production"
    safety: "No new safety failures"
    error_rate: "≤ production error rate"
    
  alerts:
    - condition: "similarity < 70%"
      severity: "warning"
    - condition: "safety_failure detected"
      severity: "critical"
    - condition: "error_rate > production * 1.5"
      severity: "warning"
```

### 2.3 Shadow Test Analysis Report

```
SHADOW TEST ANALYSIS REPORT
═══════════════════════════════════════════════════════════════════

Test Period: 2026-03-01 to 2026-03-14
Production Agent: agent-alpha-v2.2
Shadow Agent: agent-alpha-v2.3

TRAFFIC SUMMARY
───────────────────────────────────────────────────────────────────
Total Requests Mirrored:     125,432
Successfully Processed:      124,891 (99.6%)
Processing Failures:            541 (0.4%)

RESPONSE COMPARISON
───────────────────────────────────────────────────────────────────
                            Production    Shadow       Delta
───────────────────────────────────────────────────────────────────
Avg Response Time (ms)         234         218        -6.8%  ✓
P95 Response Time (ms)         856         812        -5.1%  ✓
Error Rate                    1.2%        1.1%       -0.1%  ✓
Response Similarity           ---         91.3%        ---  ✓

QUALITY COMPARISON (Sample n=1000)
───────────────────────────────────────────────────────────────────
                            Production    Shadow       Delta
───────────────────────────────────────────────────────────────────
Correctness Score             87.2        88.5       +1.3%  ✓
Quality Score                 82.1        84.3       +2.2%  ✓
Safety Score                  99.8        99.9       +0.1%  ✓

DISCREPANCY ANALYSIS
───────────────────────────────────────────────────────────────────
Total Discrepancies: 10,891 (8.7%)

By Type:
  - Minor wording differences: 7,234 (66%)  [Acceptable]
  - Different but valid approach: 2,891 (27%)  [Acceptable]
  - Quality improvement: 432 (4%)  [Positive]
  - Potential regression: 334 (3%)  [Review Required]

RECOMMENDATION
───────────────────────────────────────────────────────────────────
✓ APPROVED for canary deployment

Rationale:
- Performance improved across all metrics
- Quality scores improved
- No safety regressions
- Discrepancies reviewed and acceptable
```

---

## 3. Canary Deployment Evaluation

### 3.1 Canary Deployment Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                   CANARY DEPLOYMENT STAGES                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Stage 1: Initial Canary (1%)                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Duration: 2-4 hours                                    │   │
│   │  Traffic: 1% to new agent                               │   │
│   │  Monitoring: Real-time metrics, alerting enabled        │   │
│   │  Rollback: Automatic on critical failure                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│   Stage 2: Expanded Canary (5%)                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Duration: 4-8 hours                                    │   │
│   │  Traffic: 5% to new agent                               │   │
│   │  Monitoring: Full metrics comparison                    │   │
│   │  Rollback: Manual review, auto on critical              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│   Stage 3: Significant Canary (25%)                             │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Duration: 24-48 hours                                  │   │
│   │  Traffic: 25% to new agent                              │   │
│   │  Monitoring: Statistical significance analysis          │   │
│   │  Rollback: Manual approval required                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│   Stage 4: Majority Traffic (50%)                               │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Duration: 24-48 hours                                  │   │
│   │  Traffic: 50% to new agent                              │   │
│   │  Monitoring: Full production parity check               │   │
│   │  Rollback: Emergency only                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│   Stage 5: Full Rollout (100%)                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Action: Complete migration to new agent                │   │
│   │  Old agent: Retained for 7 days for emergency rollback  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Canary Gate Criteria

```yaml
canary_gates:
  stage_1_to_2:
    duration: "2 hours minimum"
    criteria:
      error_rate: "≤ baseline + 1%"
      latency_p95: "≤ baseline + 10%"
      safety_failures: 0
      
  stage_2_to_3:
    duration: "4 hours minimum"
    criteria:
      error_rate: "≤ baseline + 0.5%"
      latency_p95: "≤ baseline + 5%"
      safety_failures: 0
      user_complaints: "≤ baseline"
      
  stage_3_to_4:
    duration: "24 hours minimum"
    criteria:
      error_rate: "≤ baseline"
      latency_p95: "≤ baseline"
      quality_score: "≥ baseline"
      safety_failures: 0
      statistical_significance: true
      
  stage_4_to_5:
    duration: "24 hours minimum"
    criteria:
      all_metrics: "≥ baseline"
      no_regressions: true
      stakeholder_approval: true
      
  automatic_rollback:
    triggers:
      - "error_rate > baseline * 2"
      - "safety_failure_detected"
      - "latency_p95 > baseline * 3"
      - "availability < 99%"
```

### 3.3 Canary Metrics Dashboard

```yaml
canary_dashboard:
  real_time_metrics:
    - name: "Request Rate"
      comparison: "canary vs production"
      alert_threshold: "±20%"
      
    - name: "Error Rate"
      comparison: "canary vs production"
      alert_threshold: "+1%"
      
    - name: "Latency Distribution"
      percentiles: [50, 90, 95, 99]
      comparison: "canary vs production"
      
    - name: "Success Rate"
      comparison: "canary vs production"
      alert_threshold: "-2%"
      
  quality_metrics:
    sampling_rate: "10%"
    metrics:
      - correctness_score
      - quality_score
      - user_satisfaction
      
  safety_metrics:
    sampling_rate: "100%"
    metrics:
      - harmful_output_count
      - safety_flag_triggers
      - guardrail_activations
```

---

## 4. Production Monitoring and Continuous Evaluation

### 4.1 Monitoring Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              CONTINUOUS PRODUCTION MONITORING                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    AGENT IN PRODUCTION                   │   │
│   └───────────────────────────┬─────────────────────────────┘   │
│                               │                                  │
│           ┌───────────────────┼───────────────────┐             │
│           │                   │                   │             │
│           ▼                   ▼                   ▼             │
│   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐    │
│   │   Metrics     │   │    Logs       │   │   Traces      │    │
│   │  (Prometheus) │   │ (Elasticsearch│   │   (Jaeger)    │    │
│   └───────┬───────┘   └───────┬───────┘   └───────┬───────┘    │
│           │                   │                   │             │
│           └───────────────────┼───────────────────┘             │
│                               │                                  │
│                        ┌──────▼──────┐                          │
│                        │  Analysis   │                          │
│                        │   Engine    │                          │
│                        └──────┬──────┘                          │
│                               │                                  │
│           ┌───────────────────┼───────────────────┐             │
│           │                   │                   │             │
│           ▼                   ▼                   ▼             │
│   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐    │
│   │  Dashboards   │   │    Alerts     │   │   Reports     │    │
│   │   (Grafana)   │   │  (PagerDuty)  │   │   (Weekly)    │    │
│   └───────────────┘   └───────────────┘   └───────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Alerting Configuration

```yaml
alerting_rules:
  critical:
    - name: "Safety Failure Detected"
      condition: "safety_failures > 0"
      action: "page_oncall"
      auto_response: "Consider automatic traffic diversion"
      
    - name: "High Error Rate"
      condition: "error_rate > 10%"
      duration: "5 minutes"
      action: "page_oncall"
      
    - name: "Service Unavailable"
      condition: "availability < 95%"
      duration: "2 minutes"
      action: "page_oncall"
      
  high:
    - name: "Elevated Error Rate"
      condition: "error_rate > 5%"
      duration: "15 minutes"
      action: "notify_team"
      
    - name: "Latency Degradation"
      condition: "latency_p95 > baseline * 2"
      duration: "10 minutes"
      action: "notify_team"
      
    - name: "Quality Score Drop"
      condition: "quality_score < baseline - 10%"
      duration: "1 hour"
      action: "notify_team"
      
  medium:
    - name: "Cost Anomaly"
      condition: "hourly_cost > baseline * 1.5"
      duration: "1 hour"
      action: "create_ticket"
      
    - name: "Unusual Traffic Pattern"
      condition: "request_rate deviation > 3 std"
      duration: "30 minutes"
      action: "create_ticket"
```

### 4.3 Continuous Evaluation Schedule

```yaml
continuous_evaluation:
  real_time:
    metrics:
      - error_rate
      - latency
      - throughput
      - safety_flags
    frequency: "every request"
    
  hourly:
    metrics:
      - quality_score_sample
      - cost_analysis
      - traffic_patterns
    sample_size: 100
    
  daily:
    evaluations:
      - full_benchmark_subset
      - regression_tests
      - security_scan
    report: "daily_summary"
    
  weekly:
    evaluations:
      - comprehensive_benchmark
      - user_satisfaction_survey
      - competitive_analysis
    report: "weekly_report"
    
  monthly:
    evaluations:
      - full_evaluation_suite
      - training_data_drift
      - bias_audit
    report: "monthly_review"
```

---

## 5. Rollback Criteria and Procedures

### 5.1 Rollback Decision Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROLLBACK DECISION MATRIX                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Severity    Condition                        Action             │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  CRITICAL    Safety failure detected          IMMEDIATE ROLLBACK│
│              (any harmful output)             (Automatic)        │
│                                                                  │
│  CRITICAL    Error rate > 20%                 IMMEDIATE ROLLBACK│
│                                               (Automatic)        │
│                                                                  │
│  CRITICAL    Complete service outage          IMMEDIATE ROLLBACK│
│                                               (Automatic)        │
│                                                                  │
│  HIGH        Error rate > 10% for 10 min      EVALUATE ROLLBACK │
│                                               (Manual Decision)  │
│                                                                  │
│  HIGH        Latency 3x baseline for 15 min   EVALUATE ROLLBACK │
│                                               (Manual Decision)  │
│                                                                  │
│  HIGH        Quality score drop > 20%         EVALUATE ROLLBACK │
│                                               (Manual Decision)  │
│                                                                  │
│  MEDIUM      Error rate > 5% for 30 min       INVESTIGATE       │
│                                               (Continue Monitor) │
│                                                                  │
│  MEDIUM      Cost anomaly > 2x                INVESTIGATE       │
│                                               (Continue Monitor) │
│                                                                  │
│  LOW         Minor metric degradation         TRACK             │
│                                               (Log for Review)   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Rollback Procedure

```yaml
rollback_procedure:
  immediate_rollback:
    trigger: "Critical condition detected"
    steps:
      1:
        action: "Divert traffic to previous stable version"
        method: "Update load balancer / service mesh"
        duration: "<30 seconds"
        
      2:
        action: "Verify rollback successful"
        checks:
          - "Traffic reaching previous version"
          - "Error rate returning to baseline"
          - "No ongoing safety failures"
        duration: "<2 minutes"
        
      3:
        action: "Notify stakeholders"
        channels:
          - "Incident channel"
          - "On-call team"
          - "Management (if critical)"
          
      4:
        action: "Begin incident review"
        tasks:
          - "Preserve logs and metrics"
          - "Document timeline"
          - "Identify root cause"
          
  planned_rollback:
    trigger: "Decision to revert after evaluation"
    steps:
      1:
        action: "Create rollback plan"
        includes:
          - "Traffic shift strategy"
          - "User communication"
          - "Data handling"
          
      2:
        action: "Execute gradual traffic shift"
        stages:
          - "50% to previous version"
          - "Verify stability (30 min)"
          - "100% to previous version"
          
      3:
        action: "Verify complete rollback"
        checks:
          - "All traffic on previous version"
          - "Metrics stable"
          - "No orphaned requests"
          
      4:
        action: "Post-rollback tasks"
        tasks:
          - "Update documentation"
          - "Schedule post-mortem"
          - "Plan remediation"
```

### 5.3 Rollback Automation

```python
"""
Automated Rollback Controller
Monitors metrics and triggers rollback when thresholds exceeded.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import threading
import time


@dataclass
class RollbackThreshold:
    metric: str
    condition: str  # "gt", "lt", "eq"
    value: float
    duration_seconds: int
    severity: str  # "critical", "high", "medium"


class RollbackController:
    """
    Automated rollback controller for agent deployments.
    
    Features:
    - Real-time metric monitoring
    - Automatic rollback on critical thresholds
    - Manual approval workflow for non-critical issues
    """
    
    CRITICAL_THRESHOLDS = [
        RollbackThreshold("safety_failures", "gt", 0, 0, "critical"),
        RollbackThreshold("error_rate", "gt", 0.20, 60, "critical"),
        RollbackThreshold("availability", "lt", 0.95, 120, "critical"),
    ]
    
    HIGH_THRESHOLDS = [
        RollbackThreshold("error_rate", "gt", 0.10, 600, "high"),
        RollbackThreshold("latency_p95_ratio", "gt", 3.0, 900, "high"),
        RollbackThreshold("quality_score_drop", "gt", 0.20, 3600, "high"),
    ]
    
    def __init__(
        self,
        metrics_client,
        deployment_client,
        notification_client
    ):
        self.metrics = metrics_client
        self.deployment = deployment_client
        self.notifications = notification_client
        self.violation_history: Dict[str, List[datetime]] = {}
        self._monitoring = False
        
    def start_monitoring(self, deployment_id: str):
        """Start monitoring a deployment for rollback conditions."""
        self._monitoring = True
        self._monitor_thread = threading.Thread(
            target=self._monitor_loop,
            args=(deployment_id,)
        )
        self._monitor_thread.start()
        
    def stop_monitoring(self):
        """Stop monitoring."""
        self._monitoring = False
        
    def _monitor_loop(self, deployment_id: str):
        """Main monitoring loop."""
        while self._monitoring:
            try:
                current_metrics = self.metrics.get_current(deployment_id)
                
                # Check critical thresholds (automatic rollback)
                for threshold in self.CRITICAL_THRESHOLDS:
                    if self._check_threshold(current_metrics, threshold):
                        if self._violation_duration_exceeded(threshold):
                            self._execute_rollback(
                                deployment_id,
                                reason=f"Critical threshold exceeded: {threshold.metric}",
                                automatic=True
                            )
                            return
                            
                # Check high thresholds (manual approval)
                for threshold in self.HIGH_THRESHOLDS:
                    if self._check_threshold(current_metrics, threshold):
                        if self._violation_duration_exceeded(threshold):
                            self._request_rollback_approval(
                                deployment_id,
                                reason=f"High threshold exceeded: {threshold.metric}"
                            )
                            
            except Exception as e:
                self.notifications.alert(
                    severity="warning",
                    message=f"Monitoring error: {e}"
                )
                
            time.sleep(10)  # Check every 10 seconds
            
    def _check_threshold(
        self,
        metrics: Dict,
        threshold: RollbackThreshold
    ) -> bool:
        """Check if a threshold is violated."""
        value = metrics.get(threshold.metric, 0)
        
        if threshold.condition == "gt":
            return value > threshold.value
        elif threshold.condition == "lt":
            return value < threshold.value
        elif threshold.condition == "eq":
            return value == threshold.value
        return False
        
    def _violation_duration_exceeded(
        self,
        threshold: RollbackThreshold
    ) -> bool:
        """Check if violation has persisted beyond threshold duration."""
        key = f"{threshold.metric}_{threshold.severity}"
        now = datetime.utcnow()
        
        if key not in self.violation_history:
            self.violation_history[key] = [now]
            return threshold.duration_seconds == 0
            
        self.violation_history[key].append(now)
        
        # Clean old violations
        cutoff = now - timedelta(seconds=threshold.duration_seconds * 2)
        self.violation_history[key] = [
            t for t in self.violation_history[key] if t > cutoff
        ]
        
        # Check if continuous violation
        if len(self.violation_history[key]) < 2:
            return False
            
        first_violation = min(self.violation_history[key])
        duration = (now - first_violation).total_seconds()
        
        return duration >= threshold.duration_seconds
        
    def _execute_rollback(
        self,
        deployment_id: str,
        reason: str,
        automatic: bool
    ):
        """Execute rollback."""
        # Log decision
        self.notifications.alert(
            severity="critical",
            message=f"Executing rollback for {deployment_id}: {reason}",
            automatic=automatic
        )
        
        # Execute rollback
        self.deployment.rollback(deployment_id)
        
        # Verify rollback
        self._verify_rollback(deployment_id)
        
    def _verify_rollback(self, deployment_id: str):
        """Verify rollback was successful."""
        # Wait for rollback to complete
        time.sleep(30)
        
        # Check metrics
        metrics = self.metrics.get_current(deployment_id)
        
        if metrics.get('error_rate', 1) < 0.05:
            self.notifications.alert(
                severity="info",
                message=f"Rollback verified successful for {deployment_id}"
            )
        else:
            self.notifications.alert(
                severity="critical",
                message=f"Rollback may have failed for {deployment_id} - manual intervention required"
            )
            
    def _request_rollback_approval(
        self,
        deployment_id: str,
        reason: str
    ):
        """Request manual approval for rollback."""
        self.notifications.request_approval(
            title=f"Rollback Approval Required: {deployment_id}",
            reason=reason,
            actions=["approve_rollback", "dismiss", "investigate"]
        )
```

---

## 6. Post-Deployment Validation

### 6.1 Validation Checklist

```yaml
post_deployment_validation:
  immediate:  # First 1 hour
    checks:
      - "Service responding to health checks"
      - "Metrics flowing to monitoring"
      - "Logs being captured"
      - "No immediate errors"
      
  short_term:  # First 24 hours
    checks:
      - "Error rate within baseline"
      - "Latency within baseline"
      - "No safety incidents"
      - "User feedback normal"
      
  medium_term:  # First week
    checks:
      - "Quality metrics stable"
      - "Cost within projections"
      - "No regression trends"
      - "Support ticket volume normal"
      
  sign_off:
    required_approvals:
      - "Engineering lead"
      - "Product owner"
      - "Security (for sensitive agents)"
```

---

## Related Documents

- [Evaluation Workflow](./Evaluation_Workflow.md) - Step-by-step process
- [Testing Framework](../Testing_Methodologies/Testing_Framework.md) - Testing methodology
- [Quality Assurance](../QA/Quality_Assurance.md) - QA processes
- [Cloud Agent Evaluation](../Cloud_Agent_Evaluation/README.md) - 云产品Agent CAPER评估
- [Cloud Agent Leaderboard](../Cloud_Agent_Leaderboard_2026.md) - 2026云Agent排行榜
- [Continuous Monitoring Guide](../Cloud_Agent_Evaluation/Continuous_Monitoring_Guide.md) - 云Agent持续监控
- [[13_Agent_Production/16_Agent_Evaluation/Cloud_Agent_Evaluation/International_Cloud_Agents.md|International_Cloud_Agents]]

## Related

- [[13_Agent_Production/16_Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[13_Agent_Production/16_Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[13_Agent_Production/16_Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[13_Agent_Production/16_Agent_Evaluation/Benchmarking/Benchmarking_Criteria]] — Benchmarking Criteria (共享: agent-framework, ai-agents, langgraph, production)
