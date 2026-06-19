---
title: Scoring System
category: 13-agent-production-16-agent-evaluation-benchmarking
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> Comprehensive methodology for calculating and comparing agent scores"
created: 2026-05-31
updated: 2026-05-31
---

# Scoring System

> Comprehensive methodology for calculating and comparing agent scores

## Overview

This document defines the scoring system used to evaluate and compare AI agents. It provides detailed algorithms for score calculation, normalization techniques for fair comparison, and statistical methods for ensuring validity.

---

## 1. Weighted Scoring Model

### 1.1 Primary Scoring Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPOSITE SCORE CALCULATION                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                      ┌──────────────────┐                        │
│                      │  COMPOSITE SCORE │                        │
│                      │    (0-100)       │                        │
│                      └────────┬─────────┘                        │
│                               │                                  │
│     ┌──────────┬──────────┬───┴───┬──────────┐                  │
│     │          │          │       │          │                  │
│     ▼          ▼          ▼       ▼          ▼                  │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐              │
│ │ RAPS  │ │Domain │ │Quality│ │Reliab │ │ User  │              │
│ │ Core  │ │Specif │ │Factors│ │ ility │ │ Satis │              │
│ │  60%  │ │  20%  │ │  10%  │ │   5%  │ │   5%  │              │
│ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 RAPS Core Scoring (60% of Total)

| Component | Weight | Sub-Components |
|-----------|--------|----------------|
| **Reasoning** | 25% | Logical (30%), Causal (25%), Abstract (20%), Analogical (15%), Common Sense (10%) |
| **Accuracy** | 30% | Completion (35%), First-Attempt (25%), Error Rate (25%), Consistency (15%) |
| **Performance** | 25% | Latency (30%), Throughput (30%), Efficiency (20%), Scalability (20%) |
| **Safety** | 20% | Security (35%), Guardrails (35%), Ethics (20%), Audit (10%) |

### 1.3 Weight Adjustment by Use Case

```yaml
weight_profiles:
  default:
    reasoning: 0.25
    accuracy: 0.30
    performance: 0.25
    safety: 0.20
    
  high_stakes_production:
    reasoning: 0.20
    accuracy: 0.35
    performance: 0.15
    safety: 0.30
    
  development_assistance:
    reasoning: 0.30
    accuracy: 0.35
    performance: 0.25
    safety: 0.10
    
  real_time_systems:
    reasoning: 0.15
    accuracy: 0.25
    performance: 0.40
    safety: 0.20
    
  regulated_industries:
    reasoning: 0.20
    accuracy: 0.25
    performance: 0.15
    safety: 0.40
```

---

## 2. Score Calculation Algorithms

### 2.1 Component Score Calculation

```python
# RAPS Core Score Calculation Algorithm

def calculate_raps_score(metrics: dict, weights: dict) -> float:
    """
    Calculate RAPS composite score from component metrics.
    
    Args:
        metrics: Dictionary containing all metric measurements
        weights: Weight profile for scoring
    
    Returns:
        Composite score (0-100)
    """
    # Reasoning Score
    reasoning = (
        metrics['logical_reasoning'] * 0.30 +
        metrics['causal_reasoning'] * 0.25 +
        metrics['abstract_reasoning'] * 0.20 +
        metrics['analogical_reasoning'] * 0.15 +
        metrics['common_sense'] * 0.10
    )
    
    # Accuracy Score
    accuracy = (
        metrics['completion_rate'] * 0.35 +
        metrics['first_attempt_success'] * 0.25 +
        (100 - metrics['weighted_error_rate']) * 0.25 +
        metrics['consistency_score'] * 0.15
    )
    
    # Performance Score
    performance = (
        metrics['latency_score'] * 0.30 +
        metrics['throughput_score'] * 0.30 +
        metrics['efficiency_score'] * 0.20 +
        metrics['scalability_score'] * 0.20
    )
    
    # Safety Score
    safety = (
        metrics['security_score'] * 0.35 +
        metrics['guardrail_score'] * 0.35 +
        metrics['ethics_score'] * 0.20 +
        metrics['audit_score'] * 0.10
    )
    
    # Apply critical failure penalties
    if metrics.get('critical_security_failure', False):
        safety = 0
    if metrics.get('critical_safety_failure', False):
        safety = 0
    
    # Composite RAPS Score
    raps_score = (
        reasoning * weights['reasoning'] +
        accuracy * weights['accuracy'] +
        performance * weights['performance'] +
        safety * weights['safety']
    )
    
    return round(raps_score, 2)
```

### 2.2 Latency Score Conversion

```python
def calculate_latency_score(actual_p95_ms: float, target_p95_ms: float) -> float:
    """
    Convert latency measurement to score (0-100).
    
    Better than target = 100
    At target = 80
    2x target = 50
    5x target = 0
    """
    if actual_p95_ms <= target_p95_ms * 0.5:
        return 100
    elif actual_p95_ms <= target_p95_ms:
        # Linear interpolation from 100 to 80
        ratio = actual_p95_ms / (target_p95_ms * 0.5)
        return 100 - (ratio - 1) * 20
    elif actual_p95_ms <= target_p95_ms * 2:
        # Linear interpolation from 80 to 50
        ratio = (actual_p95_ms - target_p95_ms) / target_p95_ms
        return 80 - ratio * 30
    elif actual_p95_ms <= target_p95_ms * 5:
        # Linear interpolation from 50 to 0
        ratio = (actual_p95_ms - target_p95_ms * 2) / (target_p95_ms * 3)
        return 50 - ratio * 50
    else:
        return 0
```

### 2.3 Error Rate Scoring

```python
def calculate_error_score(errors: dict, total_tasks: int) -> float:
    """
    Calculate weighted error score.
    
    Args:
        errors: Dictionary with error counts by severity
        total_tasks: Total number of tasks evaluated
    
    Returns:
        Weighted error rate (lower is better)
    """
    weights = {
        'critical': 10,
        'major': 5,
        'moderate': 2,
        'minor': 1
    }
    
    weighted_errors = sum(
        errors.get(severity, 0) * weight 
        for severity, weight in weights.items()
    )
    
    # Normalize to percentage
    max_weighted = total_tasks * weights['critical']
    error_rate = (weighted_errors / max_weighted) * 100
    
    return min(error_rate, 100)
```

---

## 3. Normalization Techniques

### 3.1 Min-Max Normalization

Used when comparing agents on metrics with different scales:

```python
def min_max_normalize(value: float, min_val: float, max_val: float) -> float:
    """
    Normalize value to 0-100 scale.
    
    Formula: (value - min) / (max - min) * 100
    """
    if max_val == min_val:
        return 50  # Avoid division by zero
    
    normalized = (value - min_val) / (max_val - min_val) * 100
    return max(0, min(100, normalized))
```

### 3.2 Z-Score Normalization

Used for comparing agents against population statistics:

```python
def z_score_normalize(value: float, mean: float, std_dev: float) -> float:
    """
    Calculate z-score and convert to percentile.
    
    Returns value on 0-100 scale based on population distribution.
    """
    import scipy.stats as stats
    
    if std_dev == 0:
        return 50
    
    z_score = (value - mean) / std_dev
    percentile = stats.norm.cdf(z_score) * 100
    
    return percentile
```

### 3.3 Benchmark-Relative Normalization

```python
def benchmark_normalize(value: float, benchmark: dict) -> float:
    """
    Normalize relative to industry benchmarks.
    
    Args:
        value: Measured value
        benchmark: Dict with 'baseline', 'good', 'excellent' thresholds
    
    Returns:
        Score on 0-100 scale
    """
    baseline = benchmark['baseline']
    good = benchmark['good']
    excellent = benchmark['excellent']
    
    if value >= excellent:
        return 100
    elif value >= good:
        # Scale from 80-100
        ratio = (value - good) / (excellent - good)
        return 80 + ratio * 20
    elif value >= baseline:
        # Scale from 50-80
        ratio = (value - baseline) / (good - baseline)
        return 50 + ratio * 30
    else:
        # Scale from 0-50
        ratio = value / baseline
        return ratio * 50
```

---

## 4. Composite Score Calculation

### 4.1 Full Score Calculation

```python
def calculate_composite_score(
    raps_score: float,
    domain_score: float,
    quality_score: float,
    reliability_score: float,
    user_satisfaction: float
) -> dict:
    """
    Calculate final composite score with breakdown.
    """
    # Weight distribution
    weights = {
        'raps': 0.60,
        'domain': 0.20,
        'quality': 0.10,
        'reliability': 0.05,
        'user_satisfaction': 0.05
    }
    
    composite = (
        raps_score * weights['raps'] +
        domain_score * weights['domain'] +
        quality_score * weights['quality'] +
        reliability_score * weights['reliability'] +
        user_satisfaction * weights['user_satisfaction']
    )
    
    # Determine grade
    grade = assign_grade(composite)
    
    return {
        'composite_score': round(composite, 2),
        'grade': grade,
        'breakdown': {
            'raps_contribution': round(raps_score * weights['raps'], 2),
            'domain_contribution': round(domain_score * weights['domain'], 2),
            'quality_contribution': round(quality_score * weights['quality'], 2),
            'reliability_contribution': round(reliability_score * weights['reliability'], 2),
            'satisfaction_contribution': round(user_satisfaction * weights['user_satisfaction'], 2)
        }
    }

def assign_grade(score: float) -> str:
    """Assign letter grade based on score."""
    if score >= 90:
        return 'S'
    elif score >= 80:
        return 'A'
    elif score >= 70:
        return 'B'
    elif score >= 60:
        return 'C'
    elif score >= 50:
        return 'D'
    else:
        return 'F'
```

### 4.2 Score Breakdown Visualization

```
SCORE BREAKDOWN EXAMPLE
═══════════════════════════════════════════════════════════════════

Agent: DevOps Assistant v2.3
Composite Score: 84.5 (Grade: A)

Component Scores:
─────────────────────────────────────────────────────────────────
RAPS Core (60%)
├── Reasoning:    82  ████████████████░░░░ (contrib: 12.3)
├── Accuracy:     91  ██████████████████░░ (contrib: 16.4)
├── Performance:  78  ███████████████░░░░░ (contrib: 11.7)
└── Safety:       88  █████████████████░░░ (contrib: 10.6)
                                    RAPS Total: 51.0

Domain Specific (20%)
└── DevOps:       85  █████████████████░░░ (contrib: 17.0)

Quality (10%)
└── Score:        80  ████████████████░░░░ (contrib: 8.0)

Reliability (5%)
└── Score:        92  ██████████████████░░ (contrib: 4.6)

User Satisfaction (5%)
└── Score:        78  ███████████████░░░░░ (contrib: 3.9)

═══════════════════════════════════════════════════════════════════
TOTAL COMPOSITE SCORE: 84.5 / 100
```

---

## 5. Statistical Significance

### 5.1 Confidence Intervals

```python
def calculate_confidence_interval(
    scores: list,
    confidence_level: float = 0.95
) -> tuple:
    """
    Calculate confidence interval for score.
    
    Returns:
        (mean, lower_bound, upper_bound)
    """
    import numpy as np
    from scipy import stats
    
    n = len(scores)
    mean = np.mean(scores)
    std_err = stats.sem(scores)
    
    # t-distribution for small samples
    t_value = stats.t.ppf((1 + confidence_level) / 2, n - 1)
    margin = t_value * std_err
    
    return (
        round(mean, 2),
        round(mean - margin, 2),
        round(mean + margin, 2)
    )
```

### 5.2 Score Comparison Significance Test

```python
def compare_agents(
    agent_a_scores: list,
    agent_b_scores: list,
    alpha: float = 0.05
) -> dict:
    """
    Determine if score difference is statistically significant.
    
    Returns:
        Comparison results with significance determination
    """
    from scipy import stats
    import numpy as np
    
    # Perform two-sample t-test
    t_stat, p_value = stats.ttest_ind(agent_a_scores, agent_b_scores)
    
    mean_a = np.mean(agent_a_scores)
    mean_b = np.mean(agent_b_scores)
    difference = mean_a - mean_b
    
    # Effect size (Cohen's d)
    pooled_std = np.sqrt(
        (np.var(agent_a_scores) + np.var(agent_b_scores)) / 2
    )
    cohens_d = difference / pooled_std if pooled_std > 0 else 0
    
    return {
        'agent_a_mean': round(mean_a, 2),
        'agent_b_mean': round(mean_b, 2),
        'difference': round(difference, 2),
        'p_value': round(p_value, 4),
        'is_significant': p_value < alpha,
        'effect_size': round(cohens_d, 3),
        'effect_interpretation': interpret_effect_size(cohens_d)
    }

def interpret_effect_size(d: float) -> str:
    """Interpret Cohen's d effect size."""
    d = abs(d)
    if d < 0.2:
        return 'negligible'
    elif d < 0.5:
        return 'small'
    elif d < 0.8:
        return 'medium'
    else:
        return 'large'
```

### 5.3 Multiple Comparison Correction

```python
def bonferroni_correction(p_values: list, alpha: float = 0.05) -> list:
    """
    Apply Bonferroni correction for multiple comparisons.
    
    Returns:
        List of (original_p, adjusted_p, is_significant) tuples
    """
    n_comparisons = len(p_values)
    adjusted_alpha = alpha / n_comparisons
    
    results = []
    for p in p_values:
        adjusted_p = min(p * n_comparisons, 1.0)
        is_significant = p < adjusted_alpha
        results.append({
            'original_p': round(p, 4),
            'adjusted_p': round(adjusted_p, 4),
            'is_significant': is_significant
        })
    
    return results
```

---

## 6. Grade Definitions

### 6.1 Grade Scale

```
┌──────────────────────────────────────────────────────────────────┐
│                        GRADE DEFINITIONS                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Grade S (90-100) - EXCEPTIONAL                                  │
│  ─────────────────────────────────────────────────────────────── │
│  • Industry-leading performance                                  │
│  • Suitable for mission-critical production                      │
│  • Minimal supervision required                                  │
│  • Recommended as primary solution                               │
│                                                                   │
│  Grade A (80-89) - EXCELLENT                                     │
│  ─────────────────────────────────────────────────────────────── │
│  • Production-ready                                              │
│  • High reliability and accuracy                                 │
│  • Light supervision recommended                                 │
│  • Recommended for general production use                        │
│                                                                   │
│  Grade B (70-79) - GOOD                                          │
│  ─────────────────────────────────────────────────────────────── │
│  • Production-capable with monitoring                            │
│  • Occasional errors expected                                    │
│  • Regular oversight required                                    │
│  • Suitable for non-critical tasks                               │
│                                                                   │
│  Grade C (60-69) - ACCEPTABLE                                    │
│  ─────────────────────────────────────────────────────────────── │
│  • Limited production use                                        │
│  • Frequent verification needed                                  │
│  • Close supervision required                                    │
│  • Consider for development/testing                              │
│                                                                   │
│  Grade D (50-59) - BELOW STANDARD                                │
│  ─────────────────────────────────────────────────────────────── │
│  • Development/testing only                                      │
│  • Not recommended for production                                │
│  • Significant improvements needed                               │
│  • Consider alternatives                                         │
│                                                                   │
│  Grade F (<50) - FAILING                                         │
│  ─────────────────────────────────────────────────────────────── │
│  • Not recommended for any use                                   │
│  • Fundamental issues present                                    │
│  • Requires major revision                                       │
│  • Do not deploy                                                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 Grade Distribution Guidelines

Expected grade distribution for healthy agent ecosystem:

```
Grade    Expected %    Action
────────────────────────────────────────
S        5-10%        Promote as leaders
A        20-30%       Primary recommendations
B        30-40%       Acceptable options
C        15-20%       Limited use cases
D        5-10%        Improvement required
F        <5%          Remove from consideration
```

---

## 7. Score Reporting

### 7.1 Score Card Template

```yaml
agent_scorecard:
  agent_id: "devops-assistant-v2.3"
  evaluation_date: "2026-03-15"
  evaluation_version: "1.0.0"
  
  summary:
    composite_score: 84.5
    grade: "A"
    confidence_interval: [82.1, 86.9]
    percentile_rank: 78
    
  raps_breakdown:
    reasoning:
      score: 82
      grade: "A"
    accuracy:
      score: 91
      grade: "S"
    performance:
      score: 78
      grade: "B"
    safety:
      score: 88
      grade: "A"
      
  domain_score: 85
  quality_score: 80
  reliability_score: 92
  user_satisfaction: 78
  
  strengths:
    - "Excellent task completion rate (95%+)"
    - "Strong safety guardrails"
    - "High reliability under load"
    
  areas_for_improvement:
    - "Latency at P95 above target"
    - "Some edge cases not handled"
    
  recommendation: "APPROVED for production use with monitoring"
```

---

## 8. CAPER Cloud Agent Scoring Model

> 用于云产品智能体评估的 CAPER 五维评分模型，与通用 RAPS 模型并存

### 8.1 CAPER Composite Score

```
CAPER Composite = C×0.25 + A×0.25 + P×0.20 + E×0.15 + R×0.15

其中：
  C = 知识问答准确率 (0-100)
  A = 任务完成率 (0-100)
  P = 性价比 (0-100)
  E = 交互质量 (0-100)
  R = 安全合规 (0-100)
```

### 8.2 CAPER Score Calculation

```python
def calculate_caper_score(metrics: dict) -> dict:
    weights = {
        'correctness': 0.25,
        'action': 0.25,
        'performance': 0.20,
        'engagement': 0.15,
        'risk_safety': 0.15
    }
    
    scores = {
        'correctness': calculate_correctness(metrics),
        'action': calculate_action(metrics),
        'performance': calculate_performance(metrics),
        'engagement': calculate_engagement(metrics),
        'risk_safety': calculate_risk(metrics)
    }
    
    composite = sum(
        scores[k] * weights[k] for k in weights
    )
    
    return {
        'composite_score': round(composite, 2),
        'grade': assign_caper_grade(composite),
        'dimension_scores': {k: round(v, 2) for k, v in scores.items()}
    }

def assign_caper_grade(score: float) -> str:
    if score >= 95: return 'S+'
    elif score >= 90: return 'S'
    elif score >= 85: return 'A+'
    elif score >= 80: return 'A'
    elif score >= 75: return 'B+'
    elif score >= 70: return 'B'
    elif score >= 60: return 'C'
    else: return 'D'
```

### 8.3 CAPER vs RAPS Mapping

```
场景                    推荐模型        说明
─────────────────────────────────────────────────────────────
云产品智能体评估         CAPER          专为云产品设计
通用 Agent 评估          RAPS           通用评估框架
DevOps Agent 评估        RAPS           运维场景通用
语料库评估               COVR           语料专项评估
```

### 8.4 CAPER Scoring by Agent Category

```yaml
weight_profiles_cloud:
  domestic_cloud_agent:
    correctness: 0.25
    action: 0.25
    performance: 0.20
    engagement: 0.15
    risk_safety: 0.15
    
  international_cloud_agent:
    correctness: 0.25
    action: 0.25
    performance: 0.20
    engagement: 0.15
    risk_safety: 0.15
    
  devops_agent:
    correctness: 0.20
    action: 0.30
    performance: 0.20
    engagement: 0.10
    risk_safety: 0.20
    
  general_chat_agent:
    correctness: 0.30
    action: 0.20
    performance: 0.15
    engagement: 0.25
    risk_safety: 0.10
```

---

## Related Documents

- [Benchmarking Criteria](./Benchmarking_Criteria.md) - Evaluation criteria definitions
- [Scoring Rubrics](../Rubrics/Scoring_Rubrics.md) - Detailed rubrics for evaluation
- [Ranking System](../Rubrics/Ranking_System.md) - Agent ranking methodology
- [Cloud Agent Benchmark](../Cloud_Agent_Evaluation/Cloud_Agent_Benchmark_2026.md) - CAPER 云产品评估框架
- [Cloud Agent Leaderboard](../Cloud_Agent_Leaderboard_2026.md) - 云产品 Agent 排行榜

## Related

- [[13_Agent_Production/16_Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[13_Agent_Production/16_Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[13_Agent_Production/16_Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[13_Agent_Production/16_Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
