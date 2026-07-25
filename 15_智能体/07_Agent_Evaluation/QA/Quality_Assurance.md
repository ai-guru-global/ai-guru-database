---
title: Quality Assurance
category: 15-agent-production-agent-evaluation-qa
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> Ensuring the quality and reliability of agent evaluations"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Quality Assurance"
  - Quality_Assurance
sources: []

---
# Quality Assurance

> Ensuring the quality and reliability of agent evaluations

## Overview

This document defines quality assurance processes for the agent evaluation framework. It covers evaluation process validation, inter-rater reliability, calibration procedures, and continuous improvement mechanisms.

---

## 1. Evaluation Process Validation

### 1.1 Validation Framework

```
┌─────────────────────────────────────────────────────────────────┐
│                   QA VALIDATION FRAMEWORK                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                 PRE-EVALUATION QA                        │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │  □ Test environment validated                           │   │
│   │  □ Test data verified                                   │   │
│   │  □ Evaluators calibrated                                │   │
│   │  □ Configuration reviewed                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │               DURING-EVALUATION QA                       │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │  □ Real-time monitoring active                          │   │
│   │  □ Anomaly detection enabled                            │   │
│   │  □ Sample verification ongoing                          │   │
│   │  □ Issue escalation working                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │               POST-EVALUATION QA                         │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │  □ Results validated                                    │   │
│   │  □ Statistical checks passed                            │   │
│   │  □ Bias analysis completed                              │   │
│   │  □ Report reviewed and approved                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Pre-Evaluation Validation Checklist

```yaml
pre_evaluation_validation:
  environment:
    - check: "Test environment isolated"
      validation: "Network policies verified"
      criticality: "high"
      
    - check: "Resources provisioned correctly"
      validation: "Resource limits confirmed"
      criticality: "high"
      
    - check: "Monitoring stack operational"
      validation: "Metrics flowing, dashboards accessible"
      criticality: "medium"
      
  test_data:
    - check: "Test cases loaded correctly"
      validation: "Count matches expected, format valid"
      criticality: "high"
      
    - check: "No data corruption"
      validation: "Checksums match"
      criticality: "high"
      
    - check: "Sensitive data removed"
      validation: "PII scan completed"
      criticality: "high"
      
  configuration:
    - check: "Evaluation config valid"
      validation: "Schema validation passed"
      criticality: "high"
      
    - check: "Scoring weights correct"
      validation: "Sum to 1.0, match intended profile"
      criticality: "high"
      
    - check: "Thresholds appropriate"
      validation: "Reviewed and approved"
      criticality: "medium"
      
  evaluators:
    - check: "Human evaluators assigned"
      validation: "Availability confirmed"
      criticality: "medium"
      
    - check: "Calibration completed"
      validation: "Calibration scores within tolerance"
      criticality: "high"
```

### 1.3 Validation Tests

```python
"""
Evaluation Process Validation Tests
Run before each evaluation to ensure quality.
"""

import pytest
from typing import Dict, List


class TestPreEvaluationValidation:
    """Pre-evaluation validation test suite."""
    
    def test_environment_isolation(self, environment):
        """Verify evaluation environment is properly isolated."""
        # Check network isolation
        assert environment.is_isolated(), "Environment not properly isolated"
        
        # Check no external access except allowed endpoints
        allowed = environment.get_allowed_endpoints()
        actual = environment.get_accessible_endpoints()
        assert actual.issubset(allowed), f"Unexpected endpoints accessible: {actual - allowed}"
        
    def test_resource_allocation(self, environment):
        """Verify resources are correctly allocated."""
        resources = environment.get_resources()
        
        assert resources['cpu'] >= 4, "Insufficient CPU allocation"
        assert resources['memory_gb'] >= 16, "Insufficient memory allocation"
        assert resources['storage_gb'] >= 100, "Insufficient storage allocation"
        
    def test_monitoring_operational(self, monitoring):
        """Verify monitoring stack is operational."""
        assert monitoring.prometheus_healthy(), "Prometheus not healthy"
        assert monitoring.grafana_accessible(), "Grafana not accessible"
        assert monitoring.metrics_flowing(), "Metrics not flowing"
        
    def test_test_data_integrity(self, test_data):
        """Verify test data integrity."""
        # Check count
        expected_count = test_data.expected_count()
        actual_count = test_data.actual_count()
        assert actual_count == expected_count, f"Test count mismatch: {actual_count} vs {expected_count}"
        
        # Check checksums
        assert test_data.verify_checksums(), "Test data checksum mismatch"
        
        # Check no PII
        pii_scan = test_data.scan_for_pii()
        assert len(pii_scan) == 0, f"PII found in test data: {pii_scan}"
        
    def test_configuration_valid(self, config):
        """Verify configuration is valid."""
        # Schema validation
        assert config.validate_schema(), "Configuration schema invalid"
        
        # Weight validation
        weights = config.get_weights()
        assert abs(sum(weights.values()) - 1.0) < 0.001, "Weights don't sum to 1.0"
        
    def test_evaluator_calibration(self, evaluators):
        """Verify evaluators are calibrated."""
        for evaluator in evaluators:
            calibration_score = evaluator.get_calibration_score()
            assert calibration_score >= 0.8, f"Evaluator {evaluator.id} not calibrated: {calibration_score}"


class TestDuringEvaluationValidation:
    """Validation checks during evaluation execution."""
    
    def test_no_anomalies_detected(self, evaluation):
        """Check for anomalies during evaluation."""
        anomalies = evaluation.get_anomalies()
        critical = [a for a in anomalies if a.severity == 'critical']
        assert len(critical) == 0, f"Critical anomalies detected: {critical}"
        
    def test_progress_within_expected(self, evaluation):
        """Verify evaluation is progressing as expected."""
        progress = evaluation.get_progress()
        expected = evaluation.get_expected_progress()
        
        # Allow 20% variance
        assert progress >= expected * 0.8, f"Evaluation behind schedule: {progress} vs {expected}"
        
    def test_resource_utilization_normal(self, environment):
        """Check resource utilization is within normal bounds."""
        utilization = environment.get_utilization()
        
        assert utilization['cpu'] < 90, f"CPU utilization too high: {utilization['cpu']}%"
        assert utilization['memory'] < 85, f"Memory utilization too high: {utilization['memory']}%"


class TestPostEvaluationValidation:
    """Post-evaluation validation checks."""
    
    def test_all_tests_executed(self, results):
        """Verify all tests were executed."""
        expected = results.expected_test_count()
        actual = results.actual_test_count()
        skipped = results.skipped_count()
        
        assert actual + skipped == expected, f"Test count mismatch: {actual + skipped} vs {expected}"
        assert skipped / expected < 0.05, f"Too many skipped tests: {skipped}/{expected}"
        
    def test_results_complete(self, results):
        """Verify results are complete."""
        for test in results.get_all_tests():
            assert test.has_result(), f"Test {test.id} missing result"
            assert test.has_score(), f"Test {test.id} missing score"
            assert test.has_duration(), f"Test {test.id} missing duration"
            
    def test_statistical_validity(self, results):
        """Verify statistical validity of results."""
        # Check for sufficient sample size
        sample_size = results.get_sample_size()
        assert sample_size >= 100, f"Sample size too small: {sample_size}"
        
        # Check for reasonable distribution
        scores = results.get_all_scores()
        std_dev = statistics.stdev(scores)
        assert std_dev > 0, "No variance in scores - suspicious"
        assert std_dev < 30, f"Variance too high: {std_dev}"
```

---

## 2. Inter-Rater Reliability

### 2.1 Reliability Requirements

```yaml
inter_rater_reliability:
  minimum_requirements:
    krippendorff_alpha: 0.67  # Minimum acceptable
    target_alpha: 0.80  # Target for good reliability
    
    cohens_kappa: 0.60  # For 2-rater comparisons
    icc: 0.70  # Intraclass correlation
    
  measurement_protocol:
    overlap_percentage: 20  # % of items rated by multiple raters
    minimum_overlap_items: 50
    
  remediation:
    if_below_threshold:
      - "Identify discrepancy sources"
      - "Additional calibration training"
      - "Revise rubric if ambiguous"
      - "Re-evaluate disputed items"
```

### 2.2 Reliability Calculation

```python
"""
Inter-Rater Reliability Calculation
"""

import numpy as np
from typing import List, Dict, Tuple
import krippendorff


def calculate_inter_rater_reliability(
    ratings: Dict[str, Dict[str, float]]
) -> Dict[str, float]:
    """
    Calculate comprehensive inter-rater reliability metrics.
    
    Args:
        ratings: Dict mapping item_id to {rater_id: score}
        
    Returns:
        Dictionary of reliability metrics
    """
    # Convert to matrix format
    items = list(ratings.keys())
    raters = list(set(r for item in ratings.values() for r in item.keys()))
    
    matrix = []
    for rater in raters:
        row = []
        for item in items:
            score = ratings[item].get(rater, np.nan)
            row.append(score)
        matrix.append(row)
    
    matrix = np.array(matrix)
    
    results = {}
    
    # Krippendorff's Alpha
    results['krippendorff_alpha'] = krippendorff.alpha(
        reliability_data=matrix,
        level_of_measurement='interval'
    )
    
    # Percent Agreement
    agreements = 0
    comparisons = 0
    for i in range(len(items)):
        scores = [matrix[r][i] for r in range(len(raters)) if not np.isnan(matrix[r][i])]
        if len(scores) >= 2:
            for j in range(len(scores)):
                for k in range(j + 1, len(scores)):
                    comparisons += 1
                    if abs(scores[j] - scores[k]) <= 1:  # Within 1 point
                        agreements += 1
    
    results['percent_agreement'] = agreements / comparisons if comparisons > 0 else 0
    
    # ICC (Intraclass Correlation Coefficient)
    results['icc'] = calculate_icc(matrix)
    
    # Interpretation
    alpha = results['krippendorff_alpha']
    if alpha >= 0.80:
        results['interpretation'] = 'excellent'
    elif alpha >= 0.67:
        results['interpretation'] = 'acceptable'
    else:
        results['interpretation'] = 'poor'
        results['action_required'] = True
        
    return results


def calculate_icc(matrix: np.ndarray) -> float:
    """Calculate ICC(2,1) - two-way random, single measure."""
    # Remove items with missing values
    valid_cols = ~np.any(np.isnan(matrix), axis=0)
    matrix = matrix[:, valid_cols]
    
    n_raters, n_items = matrix.shape
    
    if n_items < 2 or n_raters < 2:
        return np.nan
    
    # Calculate means
    item_means = np.mean(matrix, axis=0)
    rater_means = np.mean(matrix, axis=1)
    grand_mean = np.mean(matrix)
    
    # Sum of squares
    ss_between = n_raters * np.sum((item_means - grand_mean) ** 2)
    ss_within = np.sum((matrix - item_means) ** 2)
    ss_raters = n_items * np.sum((rater_means - grand_mean) ** 2)
    ss_error = ss_within - ss_raters
    
    # Mean squares
    ms_between = ss_between / (n_items - 1)
    ms_error = ss_error / ((n_items - 1) * (n_raters - 1))
    
    # ICC
    icc = (ms_between - ms_error) / (ms_between + (n_raters - 1) * ms_error)
    
    return float(icc)


def identify_discrepancies(
    ratings: Dict[str, Dict[str, float]],
    threshold: float = 2.0
) -> List[Dict]:
    """
    Identify items with significant rating discrepancies.
    
    Args:
        ratings: Rating data
        threshold: Score difference threshold for flagging
        
    Returns:
        List of discrepancy records
    """
    discrepancies = []
    
    for item_id, item_ratings in ratings.items():
        scores = list(item_ratings.values())
        
        if len(scores) < 2:
            continue
            
        max_diff = max(scores) - min(scores)
        
        if max_diff >= threshold:
            discrepancies.append({
                'item_id': item_id,
                'ratings': item_ratings,
                'max_difference': max_diff,
                'mean_score': np.mean(scores),
                'std_dev': np.std(scores)
            })
            
    return sorted(discrepancies, key=lambda x: x['max_difference'], reverse=True)
```

### 2.3 Reliability Report Template

```
INTER-RATER RELIABILITY REPORT
═══════════════════════════════════════════════════════════════════

Evaluation: EVAL-2026-0315-001
Date: March 15, 2026
Raters: 3 (Rater A, Rater B, Rater C)
Items Evaluated: 150 (30% overlap)

RELIABILITY METRICS
───────────────────────────────────────────────────────────────────
Metric                      Value       Threshold    Status
───────────────────────────────────────────────────────────────────
Krippendorff's Alpha        0.82        ≥0.67        ✓ Excellent
Percent Agreement           87%         ≥80%         ✓ Pass
ICC (2,1)                   0.79        ≥0.70        ✓ Pass

INTERPRETATION: Excellent reliability - scores are trustworthy


RATER PAIR ANALYSIS
───────────────────────────────────────────────────────────────────
Pair              Cohen's Kappa    Agreement    Correlation
───────────────────────────────────────────────────────────────────
Rater A - B       0.78             85%          0.89
Rater A - C       0.81             88%          0.91
Rater B - C       0.76             83%          0.87


DISCREPANCIES (>2 points difference)
───────────────────────────────────────────────────────────────────
Item ID       Rater A    Rater B    Rater C    Diff    Resolution
───────────────────────────────────────────────────────────────────
TEST-045      85         78         82         7       Discussed → 82
TEST-112      72         80         75         8       Discussed → 76
TEST-089      90         88         92         4       Average → 90

CALIBRATION STATUS
───────────────────────────────────────────────────────────────────
All raters within acceptable calibration range.
No additional training required.

───────────────────────────────────────────────────────────────────
```

---

## 3. Calibration Procedures

### 3.1 Evaluator Calibration Protocol

```yaml
calibration_protocol:
  frequency:
    initial: "Before first evaluation"
    periodic: "Monthly"
    triggered: "After reliability drops below threshold"
    
  process:
    step_1_training:
      duration: "2 hours"
      content:
        - "Review scoring rubrics"
        - "Study example cases"
        - "Discuss edge cases"
        
    step_2_practice:
      duration: "1 hour"
      content:
        - "Score 10 calibration items"
        - "Compare with gold standard"
        - "Discuss discrepancies"
        
    step_3_validation:
      duration: "1 hour"
      content:
        - "Score 20 validation items independently"
        - "Calculate calibration score"
        - "Pass/fail determination"
        
  calibration_items:
    count: 30
    distribution:
      - score_range: "90-100"
        count: 5
        description: "Exemplary examples"
      - score_range: "80-89"
        count: 8
        description: "Good examples"
      - score_range: "70-79"
        count: 7
        description: "Acceptable examples"
      - score_range: "60-69"
        count: 5
        description: "Below average examples"
      - score_range: "<60"
        count: 5
        description: "Poor examples"
        
  pass_criteria:
    mean_absolute_error: "≤5 points"
    correlation: "≥0.85"
    no_critical_misses: true  # No >15 point differences
```

### 3.2 Calibration Session Template

```
CALIBRATION SESSION GUIDE
═══════════════════════════════════════════════════════════════════

SESSION OVERVIEW
───────────────────────────────────────────────────────────────────
Duration: 4 hours
Participants: [Evaluator names]
Facilitator: [Name]
Date: [Date]


AGENDA
───────────────────────────────────────────────────────────────────

1. INTRODUCTION (15 min)
   □ Review session objectives
   □ Explain calibration process
   □ Distribute materials

2. RUBRIC REVIEW (45 min)
   □ Walk through each scoring dimension
   □ Review anchor examples for each level
   □ Q&A on scoring criteria

3. PRACTICE ROUND (60 min)
   □ Score 10 calibration items individually
   □ Reveal gold standard scores
   □ Discuss each item:
     - Why did you score it this way?
     - What was the gold standard rationale?
     - Where did interpretations differ?

   PRACTICE ITEMS
   ┌────────────────────────────────────────────────────────┐
   │ Item    Category        Gold Score    Discussion Focus │
   │────────────────────────────────────────────────────────│
   │ CAL-01  Code Quality    92            Exemplary case   │
   │ CAL-02  Code Quality    45            Clear failure    │
   │ CAL-03  Accuracy        78            Borderline B/C   │
   │ CAL-04  Accuracy        85            Standard good    │
   │ CAL-05  Safety          100           Perfect safety   │
   │ CAL-06  Safety          0             Critical failure │
   │ CAL-07  Performance     72            Edge case        │
   │ CAL-08  Reasoning       88            Complex case     │
   │ CAL-09  Reasoning       65            Partial credit   │
   │ CAL-10  Mixed           83            Multi-dimension  │
   └────────────────────────────────────────────────────────┘

4. BREAK (15 min)

5. VALIDATION ROUND (60 min)
   □ Score 20 validation items independently
   □ No discussion during scoring
   □ Submit scores to facilitator

6. RESULTS REVIEW (30 min)
   □ Calculate individual calibration scores
   □ Identify systematic biases
   □ Determine pass/fail status

7. REMEDIATION (if needed) (30 min)
   □ Additional training for struggling evaluators
   □ Focus on specific problem areas


CALIBRATION SCORECARD
───────────────────────────────────────────────────────────────────

Evaluator: _________________

Validation Results:
  Mean Absolute Error:    _____ points (target: ≤5)
  Correlation with Gold:  _____ (target: ≥0.85)
  Max Deviation:          _____ points (limit: 15)
  
  Status: □ PASS  □ FAIL  □ CONDITIONAL

Areas of Strength:
  _________________________________________________

Areas for Improvement:
  _________________________________________________

───────────────────────────────────────────────────────────────────
```

---

## 4. Continuous Improvement Process

### 4.1 Improvement Cycle

```
┌─────────────────────────────────────────────────────────────────┐
│              CONTINUOUS IMPROVEMENT CYCLE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                         ┌──────────┐                            │
│                         │  MEASURE │                            │
│                         │          │                            │
│                         └────┬─────┘                            │
│                              │                                  │
│            ┌─────────────────┼─────────────────┐                │
│            │                 │                 │                │
│            ▼                 │                 ▼                │
│       ┌─────────┐           │            ┌─────────┐           │
│       │ ANALYZE │           │            │   ACT   │           │
│       │         │◄──────────┘────────────│         │           │
│       └────┬────┘                        └────┬────┘           │
│            │                                  │                 │
│            │                                  │                 │
│            └──────────────┬───────────────────┘                │
│                           │                                     │
│                           ▼                                     │
│                      ┌─────────┐                               │
│                      │ IMPROVE │                               │
│                      │         │                               │
│                      └─────────┘                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Feedback Collection

```yaml
feedback_collection:
  sources:
    evaluator_feedback:
      frequency: "After each evaluation"
      method: "Survey"
      topics:
        - "Rubric clarity"
        - "Test case quality"
        - "Tool usability"
        - "Process efficiency"
        
    agent_developer_feedback:
      frequency: "After each report"
      method: "Interview/Survey"
      topics:
        - "Report usefulness"
        - "Actionability of findings"
        - "Fairness of evaluation"
        
    stakeholder_feedback:
      frequency: "Quarterly"
      method: "Review meeting"
      topics:
        - "Decision support quality"
        - "Evaluation coverage"
        - "Alignment with needs"
        
  feedback_form_template:
    questions:
      - id: "clarity"
        question: "How clear were the evaluation criteria?"
        type: "scale_1_5"
        
      - id: "completeness"
        question: "Did the evaluation cover all important aspects?"
        type: "scale_1_5"
        
      - id: "fairness"
        question: "How fair was the evaluation process?"
        type: "scale_1_5"
        
      - id: "improvements"
        question: "What improvements would you suggest?"
        type: "text"
```

### 4.3 Improvement Tracking

```yaml
improvement_tracking:
  categories:
    - name: "Rubric Improvements"
      examples:
        - "Clarify edge case scoring"
        - "Add new capability dimension"
        
    - name: "Test Case Improvements"
      examples:
        - "Add more adversarial tests"
        - "Update outdated scenarios"
        
    - name: "Process Improvements"
      examples:
        - "Streamline calibration"
        - "Automate report generation"
        
    - name: "Tool Improvements"
      examples:
        - "Better dashboard visualizations"
        - "Faster test execution"
        
  tracking_template:
    improvement_id: "IMP-2026-001"
    category: "Rubric"
    description: "Clarify scoring for partial task completion"
    source: "Evaluator feedback"
    priority: "high"
    status: "in_progress"
    assigned_to: "team_lead"
    target_date: "2026-04-01"
    outcome: ""
```

### 4.4 Quality Metrics Dashboard

```yaml
quality_dashboard:
  kpis:
    - name: "Evaluation Reliability"
      metric: "krippendorff_alpha"
      target: 0.80
      current: 0.82
      trend: "stable"
      
    - name: "Calibration Pass Rate"
      metric: "calibration_pass_rate"
      target: 95%
      current: 92%
      trend: "improving"
      
    - name: "Report Accuracy"
      metric: "report_accuracy_score"
      target: 98%
      current: 97%
      trend: "stable"
      
    - name: "Evaluator Satisfaction"
      metric: "evaluator_nps"
      target: 50
      current: 45
      trend: "improving"
      
    - name: "Stakeholder Satisfaction"
      metric: "stakeholder_nps"
      target: 60
      current: 58
      trend: "stable"
      
  review_frequency: "Weekly"
  escalation_threshold: "2 consecutive weeks below target"
```

---

## 5. Audit and Compliance

### 5.1 Audit Checklist

```yaml
audit_checklist:
  documentation:
    - item: "Evaluation procedures documented"
      evidence: "Procedure documents, version history"
      
    - item: "Scoring rubrics documented"
      evidence: "Rubric documents, examples"
      
    - item: "Training materials available"
      evidence: "Training guides, calibration materials"
      
  process_compliance:
    - item: "Calibration conducted as scheduled"
      evidence: "Calibration records, attendance"
      
    - item: "Inter-rater reliability measured"
      evidence: "Reliability reports"
      
    - item: "Discrepancies resolved appropriately"
      evidence: "Resolution records"
      
  data_integrity:
    - item: "Test results accurately recorded"
      evidence: "Audit trail, checksums"
      
    - item: "Scores calculated correctly"
      evidence: "Calculation verification"
      
    - item: "Reports accurately reflect results"
      evidence: "Report validation"
      
  continuous_improvement:
    - item: "Feedback collected regularly"
      evidence: "Feedback records"
      
    - item: "Improvements tracked and implemented"
      evidence: "Improvement log"
```

### 5.2 Audit Schedule

```yaml
audit_schedule:
  internal_audit:
    frequency: "Quarterly"
    scope: "Full process review"
    auditor: "QA Team Lead"
    
  external_audit:
    frequency: "Annually"
    scope: "Compliance verification"
    auditor: "External QA firm"
    
  spot_checks:
    frequency: "Monthly"
    scope: "Random sample verification"
    auditor: "Peer reviewer"
```

---

---

## 6. 云产品Agent评估QA补充

> **关联框架**: 本节补充云产品Agent在CAPER评估框架下的质量保证要求。

### 6.1 CAPER评估校准要求

```yaml
caper_calibration:
  correctness_dimension:
    calibration_method: "人工标注50题作为基准集"
    tolerance: "LLM-Judge与人工评分偏差 ≤ 5%"
    recalculation_frequency: "每月"
    
  action_dimension:
    calibration_method: "Mock API预期结果对照"
    tolerance: "执行结果与预期完全匹配"
    recalculation_frequency: "每次评估前"
    
  performance_dimension:
    calibration_method: "标准负载基准测试"
    tolerance: "同一环境下P95波动 ≤ 10%"
    recalculation_frequency: "每周"
    
  engagement_dimension:
    calibration_method: "3人独立评分，Krippendorff's α ≥ 0.67"
    tolerance: "评分者间一致性 ≥ 0.7"
    recalculation_frequency: "每季度"
    
  risk_safety_dimension:
    calibration_method: "已知攻击向量100%检出验证"
    tolerance: "零容忍，任何遗漏均为失败"
    recalculation_frequency: "每次评估前"
```

### 6.2 云Agent排行榜QA验证

```yaml
leaderboard_qa:
  pre_publish_checks:
    - "所有Agent使用相同题库子集"
    - "权重配置按类别正确应用"
    - "评分计算公式验证通过"
    - "无数据缺失或异常值"
    
  cross_validation:
    method: "独立重复评估10%样本"
    tolerance: "复评分数偏差 ≤ 3%"
    
  bias_detection:
    - "评估顺序随机化验证"
    - "不同时间段评分一致性检查"
    - "评估模板无偏向性审查"
```

### 6.3 语料覆盖率QA

```yaml
corpus_qa:
  sampling_method: "分层随机抽样"
  sample_size: "每产品类别至少20题"
  validation:
    - "题目与最新产品文档版本一致"
    - "操作场景覆盖实际用户高频操作"
    - "难度分布符合正态分布"
  revalidation_frequency: "季度"
```

---

## Related Documents

- [Performance Benchmarks](./Performance_Benchmarks.md) - Industry benchmarks
- [Evaluation Workflow](../Assessment/Evaluation_Workflow.md) - Process details
- [Scoring Rubrics](../Rubrics/Scoring_Rubrics.md) - Scoring guidelines
- [Cloud Agent Evaluation](../Cloud_Agent_Evaluation/README.md) - 云产品 Agent 评估
- [Corpus Assessment](../Corpus_Assessment/README.md) - 语料库评估
- [LLM as Judge Templates](../Implementation/LLM_as_Judge_Templates.md) - 评估模板

## Related

- [[15_智能体/07_Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
