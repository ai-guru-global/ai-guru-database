# Metrics Collection

> Automated and manual methods for collecting evaluation metrics

## Overview

This document describes methodologies for collecting evaluation metrics, including automated pipelines, manual evaluation protocols, statistical analysis methods, and bias detection techniques.

---

## 1. Automated Metrics Collection

### 1.1 Collection Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 AUTOMATED COLLECTION PIPELINE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│   │  Agent   │───▶│ Metrics  │───▶│  Time-   │───▶│ Analysis │ │
│   │ Execution│    │ Collector│    │  Series  │    │  Engine  │ │
│   └──────────┘    └──────────┘    │    DB    │    └──────────┘ │
│        │              │           └──────────┘         │        │
│        │              │                                │        │
│        ▼              ▼                                ▼        │
│   ┌──────────┐    ┌──────────┐                    ┌──────────┐ │
│   │   Logs   │    │ Traces   │                    │ Reports  │ │
│   │ (ELK)    │    │ (Jaeger) │                    │Dashboard │ │
│   └──────────┘    └──────────┘                    └──────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Metrics Collector Implementation

```python
"""
Agent Metrics Collector
Collects and aggregates evaluation metrics from agent executions.
"""

import time
import json
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from datetime import datetime
import threading
from queue import Queue


@dataclass
class TaskMetrics:
    """Metrics for a single task execution."""
    task_id: str
    agent_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    
    # Timing metrics
    time_to_first_token_ms: Optional[float] = None
    total_response_time_ms: Optional[float] = None
    
    # Accuracy metrics
    task_completed: bool = False
    first_attempt_success: bool = False
    error_count: int = 0
    error_severity: List[str] = field(default_factory=list)
    
    # Resource metrics
    tokens_input: int = 0
    tokens_output: int = 0
    cost_usd: float = 0.0
    
    # Quality metrics
    correctness_score: Optional[float] = None
    quality_score: Optional[float] = None
    
    # Safety metrics
    safety_flags: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'task_id': self.task_id,
            'agent_id': self.agent_id,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'timing': {
                'ttft_ms': self.time_to_first_token_ms,
                'total_ms': self.total_response_time_ms
            },
            'accuracy': {
                'completed': self.task_completed,
                'first_attempt': self.first_attempt_success,
                'errors': self.error_count,
                'error_severities': self.error_severity
            },
            'resources': {
                'tokens_in': self.tokens_input,
                'tokens_out': self.tokens_output,
                'cost': self.cost_usd
            },
            'quality': {
                'correctness': self.correctness_score,
                'quality': self.quality_score
            },
            'safety': {
                'flags': self.safety_flags
            }
        }


class MetricsCollector:
    """
    Collects and aggregates metrics from agent evaluations.
    
    Usage:
        collector = MetricsCollector()
        collector.start()
        
        # Record metrics
        task = collector.start_task("task-001", "agent-alpha")
        # ... agent executes task ...
        collector.record_first_token(task.task_id, ttft_ms=150)
        collector.complete_task(task.task_id, success=True)
        
        # Get aggregated results
        results = collector.get_aggregated_metrics("agent-alpha")
    """
    
    def __init__(self, buffer_size: int = 1000):
        self.metrics_buffer: Queue = Queue(maxsize=buffer_size)
        self.task_registry: Dict[str, TaskMetrics] = {}
        self.aggregated: Dict[str, Dict] = {}
        self._lock = threading.Lock()
        self._running = False
        
    def start(self):
        """Start the background metrics processing."""
        self._running = True
        self._processor_thread = threading.Thread(target=self._process_metrics)
        self._processor_thread.daemon = True
        self._processor_thread.start()
        
    def stop(self):
        """Stop metrics collection."""
        self._running = False
        self._processor_thread.join(timeout=5)
        
    def start_task(self, task_id: str, agent_id: str) -> TaskMetrics:
        """Start tracking a new task."""
        metrics = TaskMetrics(
            task_id=task_id,
            agent_id=agent_id,
            start_time=datetime.utcnow()
        )
        with self._lock:
            self.task_registry[task_id] = metrics
        return metrics
        
    def record_first_token(self, task_id: str, ttft_ms: float):
        """Record time to first token."""
        with self._lock:
            if task_id in self.task_registry:
                self.task_registry[task_id].time_to_first_token_ms = ttft_ms
                
    def record_tokens(self, task_id: str, input_tokens: int, output_tokens: int):
        """Record token usage."""
        with self._lock:
            if task_id in self.task_registry:
                self.task_registry[task_id].tokens_input = input_tokens
                self.task_registry[task_id].tokens_output = output_tokens
                
    def record_error(self, task_id: str, severity: str):
        """Record an error during task execution."""
        with self._lock:
            if task_id in self.task_registry:
                self.task_registry[task_id].error_count += 1
                self.task_registry[task_id].error_severity.append(severity)
                
    def record_safety_flag(self, task_id: str, flag: str):
        """Record a safety concern."""
        with self._lock:
            if task_id in self.task_registry:
                self.task_registry[task_id].safety_flags.append(flag)
                
    def complete_task(
        self,
        task_id: str,
        success: bool,
        first_attempt: bool = True,
        correctness: float = None,
        quality: float = None
    ):
        """Mark task as complete and finalize metrics."""
        with self._lock:
            if task_id in self.task_registry:
                metrics = self.task_registry[task_id]
                metrics.end_time = datetime.utcnow()
                metrics.task_completed = success
                metrics.first_attempt_success = first_attempt and success
                metrics.correctness_score = correctness
                metrics.quality_score = quality
                
                # Calculate total response time
                duration = (metrics.end_time - metrics.start_time).total_seconds()
                metrics.total_response_time_ms = duration * 1000
                
                # Queue for processing
                self.metrics_buffer.put(metrics.to_dict())
                
    def _process_metrics(self):
        """Background thread for processing and aggregating metrics."""
        while self._running:
            try:
                if not self.metrics_buffer.empty():
                    metrics = self.metrics_buffer.get(timeout=1)
                    self._aggregate_metrics(metrics)
            except:
                pass
                
    def _aggregate_metrics(self, metrics: Dict):
        """Aggregate individual metrics into summary statistics."""
        agent_id = metrics['agent_id']
        
        with self._lock:
            if agent_id not in self.aggregated:
                self.aggregated[agent_id] = {
                    'total_tasks': 0,
                    'completed_tasks': 0,
                    'first_attempt_successes': 0,
                    'total_errors': 0,
                    'ttft_samples': [],
                    'response_time_samples': [],
                    'correctness_scores': [],
                    'quality_scores': [],
                    'safety_flags': []
                }
            
            agg = self.aggregated[agent_id]
            agg['total_tasks'] += 1
            
            if metrics['accuracy']['completed']:
                agg['completed_tasks'] += 1
            if metrics['accuracy']['first_attempt']:
                agg['first_attempt_successes'] += 1
            agg['total_errors'] += metrics['accuracy']['errors']
            
            if metrics['timing']['ttft_ms']:
                agg['ttft_samples'].append(metrics['timing']['ttft_ms'])
            if metrics['timing']['total_ms']:
                agg['response_time_samples'].append(metrics['timing']['total_ms'])
            if metrics['quality']['correctness']:
                agg['correctness_scores'].append(metrics['quality']['correctness'])
            if metrics['quality']['quality']:
                agg['quality_scores'].append(metrics['quality']['quality'])
            agg['safety_flags'].extend(metrics['safety']['flags'])
            
    def get_aggregated_metrics(self, agent_id: str) -> Dict:
        """Get aggregated metrics for an agent."""
        import statistics
        
        with self._lock:
            if agent_id not in self.aggregated:
                return {}
                
            agg = self.aggregated[agent_id]
            
            def calc_percentiles(samples: List[float]) -> Dict:
                if not samples:
                    return {}
                sorted_samples = sorted(samples)
                n = len(sorted_samples)
                return {
                    'p50': sorted_samples[int(n * 0.50)],
                    'p95': sorted_samples[int(n * 0.95)] if n > 20 else sorted_samples[-1],
                    'p99': sorted_samples[int(n * 0.99)] if n > 100 else sorted_samples[-1],
                    'mean': statistics.mean(sorted_samples),
                    'std': statistics.stdev(sorted_samples) if n > 1 else 0
                }
            
            return {
                'agent_id': agent_id,
                'summary': {
                    'total_tasks': agg['total_tasks'],
                    'completion_rate': agg['completed_tasks'] / agg['total_tasks'] * 100,
                    'first_attempt_rate': agg['first_attempt_successes'] / agg['total_tasks'] * 100,
                    'error_rate': agg['total_errors'] / agg['total_tasks']
                },
                'latency': {
                    'ttft': calc_percentiles(agg['ttft_samples']),
                    'total_response': calc_percentiles(agg['response_time_samples'])
                },
                'quality': {
                    'correctness_mean': statistics.mean(agg['correctness_scores']) if agg['correctness_scores'] else None,
                    'quality_mean': statistics.mean(agg['quality_scores']) if agg['quality_scores'] else None
                },
                'safety': {
                    'total_flags': len(agg['safety_flags']),
                    'flag_types': list(set(agg['safety_flags']))
                }
            }
```

### 1.3 Integration with Monitoring Stack

```yaml
# prometheus_metrics.yaml
# Prometheus metrics configuration for agent evaluation

metrics:
  - name: agent_task_duration_seconds
    type: histogram
    help: "Duration of agent task execution"
    labels:
      - agent_id
      - task_type
      - status
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60, 120]
    
  - name: agent_task_total
    type: counter
    help: "Total number of tasks processed"
    labels:
      - agent_id
      - task_type
      - status
      
  - name: agent_error_total
    type: counter
    help: "Total number of errors"
    labels:
      - agent_id
      - error_severity
      
  - name: agent_token_usage_total
    type: counter
    help: "Total tokens processed"
    labels:
      - agent_id
      - direction  # input/output
      
  - name: agent_safety_flags_total
    type: counter
    help: "Safety flags triggered"
    labels:
      - agent_id
      - flag_type
```

---

## 2. Manual Evaluation Protocols

### 2.1 Human-in-the-Loop Evaluation

```
┌─────────────────────────────────────────────────────────────────┐
│              HUMAN EVALUATION WORKFLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. TASK DISTRIBUTION                                          │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  • Randomly assign tasks to evaluators                   │  │
│   │  • Ensure blind evaluation (evaluator doesn't know agent)│  │
│   │  • Minimum 2 evaluators per task for calibration        │  │
│   └──────────────────────────────────────────────────────────┘  │
│                          ↓                                      │
│   2. EVALUATION EXECUTION                                       │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  • Evaluator reviews agent output                        │  │
│   │  • Scores using standardized rubric                      │  │
│   │  • Records qualitative notes                             │  │
│   └──────────────────────────────────────────────────────────┘  │
│                          ↓                                      │
│   3. CALIBRATION CHECK                                          │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  • Compare scores between evaluators                     │  │
│   │  • Flag significant discrepancies                        │  │
│   │  • Resolve through discussion or third evaluator         │  │
│   └──────────────────────────────────────────────────────────┘  │
│                          ↓                                      │
│   4. AGGREGATION                                                │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  • Calculate inter-rater reliability                     │  │
│   │  • Aggregate scores (average, median, consensus)         │  │
│   │  • Document disagreements                                │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Evaluation Rubric Template

```yaml
human_evaluation_rubric:
  task_type: "Code Generation"
  version: "1.0"
  
  dimensions:
    correctness:
      weight: 0.35
      scale: 1-5
      criteria:
        5: "Code is fully correct, handles all cases, no bugs"
        4: "Code is mostly correct, minor issues that don't affect functionality"
        3: "Code works for main cases, has some bugs or missing edge cases"
        2: "Code has significant bugs, only partially works"
        1: "Code doesn't work or is completely incorrect"
        
    quality:
      weight: 0.25
      scale: 1-5
      criteria:
        5: "Excellent style, highly readable, well-structured"
        4: "Good style, readable, reasonable structure"
        3: "Acceptable style, somewhat readable"
        2: "Poor style, hard to read or follow"
        1: "Very poor style, confusing or unmaintainable"
        
    completeness:
      weight: 0.20
      scale: 1-5
      criteria:
        5: "Fully complete, includes all requested features"
        4: "Nearly complete, missing minor elements"
        3: "Partially complete, has main features"
        2: "Incomplete, missing significant portions"
        1: "Largely incomplete or missing"
        
    efficiency:
      weight: 0.10
      scale: 1-5
      criteria:
        5: "Optimal or near-optimal solution"
        4: "Efficient solution, minor optimization possible"
        3: "Reasonable efficiency, some inefficiencies"
        2: "Inefficient, significant optimization needed"
        1: "Very inefficient or inappropriate approach"
        
    documentation:
      weight: 0.10
      scale: 1-5
      criteria:
        5: "Excellent documentation, clear comments, good examples"
        4: "Good documentation, helpful comments"
        3: "Basic documentation, some comments"
        2: "Minimal documentation"
        1: "No documentation or misleading comments"
```

### 2.3 LLM-as-Judge Protocol

```python
"""
LLM-as-Judge Evaluation Protocol
Uses calibrated LLM evaluators for consistent scoring.
"""

from dataclasses import dataclass
from typing import List, Dict, Optional
import json


@dataclass
class JudgeConfig:
    """Configuration for LLM judge."""
    model: str = "gpt-4-turbo"
    temperature: float = 0.0  # Deterministic for consistency
    max_tokens: int = 1000
    
    
JUDGE_PROMPT_TEMPLATE = """
You are an expert evaluator assessing AI agent outputs. Evaluate the following
agent response according to the provided criteria.

## Task Description
{task_description}

## Agent Response
{agent_response}

## Expected Output (Reference)
{expected_output}

## Evaluation Criteria
{criteria}

## Instructions
1. Carefully compare the agent response to the expected output
2. Score each criterion on a 1-5 scale
3. Provide brief justification for each score
4. Calculate the weighted overall score

## Output Format (JSON)
{{
    "scores": {{
        "criterion_name": {{
            "score": <1-5>,
            "justification": "brief explanation"
        }}
    }},
    "overall_score": <weighted average>,
    "summary": "overall assessment"
}}
"""


class LLMJudge:
    """
    LLM-based evaluator for agent outputs.
    
    Features:
    - Calibrated scoring with reference examples
    - Multi-criteria evaluation
    - Confidence estimation
    """
    
    def __init__(self, config: JudgeConfig):
        self.config = config
        self.calibration_examples: List[Dict] = []
        
    def calibrate(self, examples: List[Dict]):
        """
        Calibrate judge with known-score examples.
        
        Examples should include:
        - task_description
        - agent_response
        - expected_output
        - human_scores (ground truth)
        """
        self.calibration_examples = examples
        # Verify calibration accuracy
        self._verify_calibration()
        
    def _verify_calibration(self):
        """Verify judge scores align with human scores."""
        discrepancies = []
        for example in self.calibration_examples:
            judge_scores = self._evaluate_single(
                example['task_description'],
                example['agent_response'],
                example['expected_output'],
                example['criteria']
            )
            
            # Compare with human scores
            for criterion, human_score in example['human_scores'].items():
                judge_score = judge_scores['scores'][criterion]['score']
                if abs(judge_score - human_score) > 1:
                    discrepancies.append({
                        'criterion': criterion,
                        'human': human_score,
                        'judge': judge_score
                    })
                    
        if len(discrepancies) > len(self.calibration_examples) * 0.1:
            raise ValueError(f"Calibration failed: {len(discrepancies)} discrepancies")
            
    def evaluate(
        self,
        task_description: str,
        agent_response: str,
        expected_output: str,
        criteria: Dict
    ) -> Dict:
        """
        Evaluate agent response.
        
        Returns:
            Evaluation results with scores and justifications
        """
        # Primary evaluation
        result = self._evaluate_single(
            task_description,
            agent_response,
            expected_output,
            criteria
        )
        
        # Add confidence based on calibration alignment
        result['confidence'] = self._estimate_confidence(result)
        
        return result
        
    def _evaluate_single(
        self,
        task_description: str,
        agent_response: str,
        expected_output: str,
        criteria: Dict
    ) -> Dict:
        """Perform single evaluation."""
        prompt = JUDGE_PROMPT_TEMPLATE.format(
            task_description=task_description,
            agent_response=agent_response,
            expected_output=expected_output,
            criteria=json.dumps(criteria, indent=2)
        )
        
        # Call LLM (implementation depends on your LLM client)
        response = self._call_llm(prompt)
        
        return json.loads(response)
        
    def _estimate_confidence(self, result: Dict) -> float:
        """Estimate confidence in evaluation."""
        # Run multiple times with slight temperature variation
        # Confidence = 1 - variance in scores
        return 0.85  # Placeholder
        
    def _call_llm(self, prompt: str) -> str:
        """Call LLM API."""
        # Implementation depends on LLM provider
        pass
```

---

## 3. Statistical Analysis Methods

### 3.1 Descriptive Statistics

```python
"""
Statistical analysis utilities for evaluation metrics.
"""

import numpy as np
from scipy import stats
from typing import List, Dict, Tuple


def descriptive_statistics(data: List[float]) -> Dict:
    """
    Calculate comprehensive descriptive statistics.
    
    Returns:
        Dictionary with central tendency, dispersion, and distribution metrics
    """
    data = np.array(data)
    
    return {
        'count': len(data),
        'central_tendency': {
            'mean': float(np.mean(data)),
            'median': float(np.median(data)),
            'mode': float(stats.mode(data, keepdims=True)[0][0]),
            'trimmed_mean': float(stats.trim_mean(data, 0.1))  # 10% trimmed
        },
        'dispersion': {
            'std': float(np.std(data, ddof=1)),
            'variance': float(np.var(data, ddof=1)),
            'range': float(np.max(data) - np.min(data)),
            'iqr': float(np.percentile(data, 75) - np.percentile(data, 25)),
            'cv': float(np.std(data) / np.mean(data)) if np.mean(data) != 0 else None
        },
        'percentiles': {
            'p5': float(np.percentile(data, 5)),
            'p25': float(np.percentile(data, 25)),
            'p50': float(np.percentile(data, 50)),
            'p75': float(np.percentile(data, 75)),
            'p95': float(np.percentile(data, 95)),
            'p99': float(np.percentile(data, 99))
        },
        'distribution': {
            'skewness': float(stats.skew(data)),
            'kurtosis': float(stats.kurtosis(data)),
            'normality_test': {
                'statistic': float(stats.shapiro(data[:5000])[0]) if len(data) <= 5000 else None,
                'p_value': float(stats.shapiro(data[:5000])[1]) if len(data) <= 5000 else None
            }
        }
    }


def compare_distributions(
    sample_a: List[float],
    sample_b: List[float],
    alpha: float = 0.05
) -> Dict:
    """
    Compare two distributions with appropriate statistical tests.
    """
    a, b = np.array(sample_a), np.array(sample_b)
    
    # Test for normality
    _, p_normal_a = stats.shapiro(a[:5000]) if len(a) <= 5000 else (None, 0)
    _, p_normal_b = stats.shapiro(b[:5000]) if len(b) <= 5000 else (None, 0)
    
    both_normal = p_normal_a > alpha and p_normal_b > alpha
    
    results = {
        'sample_a': descriptive_statistics(sample_a),
        'sample_b': descriptive_statistics(sample_b),
        'mean_difference': float(np.mean(a) - np.mean(b)),
        'tests': {}
    }
    
    if both_normal:
        # Parametric tests
        # t-test
        t_stat, t_pvalue = stats.ttest_ind(a, b)
        results['tests']['t_test'] = {
            'statistic': float(t_stat),
            'p_value': float(t_pvalue),
            'significant': t_pvalue < alpha
        }
        
        # Levene's test for variance equality
        l_stat, l_pvalue = stats.levene(a, b)
        results['tests']['levene'] = {
            'statistic': float(l_stat),
            'p_value': float(l_pvalue),
            'equal_variance': l_pvalue > alpha
        }
    else:
        # Non-parametric tests
        # Mann-Whitney U
        u_stat, u_pvalue = stats.mannwhitneyu(a, b, alternative='two-sided')
        results['tests']['mann_whitney'] = {
            'statistic': float(u_stat),
            'p_value': float(u_pvalue),
            'significant': u_pvalue < alpha
        }
        
    # Effect size (Cohen's d)
    pooled_std = np.sqrt((np.var(a) + np.var(b)) / 2)
    cohens_d = (np.mean(a) - np.mean(b)) / pooled_std if pooled_std > 0 else 0
    
    results['effect_size'] = {
        'cohens_d': float(cohens_d),
        'interpretation': (
            'negligible' if abs(cohens_d) < 0.2 else
            'small' if abs(cohens_d) < 0.5 else
            'medium' if abs(cohens_d) < 0.8 else
            'large'
        )
    }
    
    return results
```

### 3.2 Inter-Rater Reliability

```python
def calculate_inter_rater_reliability(
    ratings: List[List[float]]
) -> Dict:
    """
    Calculate inter-rater reliability metrics.
    
    Args:
        ratings: List of rating lists, one per rater
                Shape: [n_raters, n_items]
                
    Returns:
        Dictionary with reliability metrics
    """
    import krippendorff  # pip install krippendorff
    
    ratings_array = np.array(ratings)
    n_raters, n_items = ratings_array.shape
    
    results = {
        'n_raters': n_raters,
        'n_items': n_items
    }
    
    # Krippendorff's alpha (works for any number of raters)
    results['krippendorff_alpha'] = krippendorff.alpha(
        reliability_data=ratings_array,
        level_of_measurement='interval'
    )
    
    if n_raters == 2:
        # Cohen's Kappa (for 2 raters)
        from sklearn.metrics import cohen_kappa_score
        results['cohens_kappa'] = cohen_kappa_score(
            ratings_array[0],
            ratings_array[1],
            weights='quadratic'
        )
        
        # Pearson correlation
        results['pearson_correlation'] = float(
            np.corrcoef(ratings_array[0], ratings_array[1])[0, 1]
        )
        
    # Intraclass Correlation Coefficient (ICC)
    # Using ICC(2,1) - two-way random, single measure
    results['icc'] = calculate_icc(ratings_array)
    
    # Interpretation
    alpha = results['krippendorff_alpha']
    results['reliability_interpretation'] = (
        'excellent' if alpha >= 0.80 else
        'good' if alpha >= 0.67 else
        'acceptable' if alpha >= 0.50 else
        'poor'
    )
    
    return results


def calculate_icc(ratings: np.ndarray) -> float:
    """Calculate Intraclass Correlation Coefficient ICC(2,1)."""
    n_subjects, n_raters = ratings.shape
    
    # Calculate means
    subject_means = np.mean(ratings, axis=1)
    rater_means = np.mean(ratings, axis=0)
    grand_mean = np.mean(ratings)
    
    # Sum of squares
    ss_between = n_raters * np.sum((subject_means - grand_mean) ** 2)
    ss_within = np.sum((ratings - subject_means[:, np.newaxis]) ** 2)
    ss_raters = n_subjects * np.sum((rater_means - grand_mean) ** 2)
    ss_error = ss_within - ss_raters
    
    # Mean squares
    ms_between = ss_between / (n_subjects - 1)
    ms_error = ss_error / ((n_subjects - 1) * (n_raters - 1))
    
    # ICC(2,1)
    icc = (ms_between - ms_error) / (ms_between + (n_raters - 1) * ms_error)
    
    return float(icc)
```

---

## 4. Bias Detection and Mitigation

### 4.1 Bias Categories

```yaml
bias_categories:
  evaluation_bias:
    types:
      - name: "Ordering Bias"
        description: "Scores influenced by presentation order"
        detection: "Randomize order, compare first vs last scores"
        mitigation: "Randomize presentation order"
        
      - name: "Anchoring Bias"
        description: "First score influences subsequent scores"
        detection: "Compare independent vs sequential evaluations"
        mitigation: "Independent evaluation of each item"
        
      - name: "Halo Effect"
        description: "Overall impression affects individual criteria"
        detection: "Check correlation between criteria scores"
        mitigation: "Evaluate criteria in isolation"
        
  agent_bias:
    types:
      - name: "Training Data Bias"
        description: "Agent performs differently on under/over-represented topics"
        detection: "Compare performance across demographic groups"
        mitigation: "Balanced test sets"
        
      - name: "Prompt Bias"
        description: "Performance varies with prompt phrasing"
        detection: "Test same task with different phrasings"
        mitigation: "Standardized prompt templates"
```

### 4.2 Bias Detection Implementation

```python
def detect_evaluation_bias(
    scores: List[Dict],
    metadata: List[Dict]
) -> Dict:
    """
    Detect potential biases in evaluation scores.
    
    Args:
        scores: List of score records
        metadata: List of metadata (order, evaluator, time, etc.)
        
    Returns:
        Bias detection report
    """
    results = {
        'ordering_bias': detect_ordering_bias(scores, metadata),
        'evaluator_bias': detect_evaluator_bias(scores, metadata),
        'temporal_bias': detect_temporal_bias(scores, metadata),
        'demographic_bias': detect_demographic_bias(scores, metadata)
    }
    
    # Overall bias risk
    bias_flags = sum(1 for v in results.values() if v.get('detected', False))
    results['overall_bias_risk'] = (
        'high' if bias_flags >= 3 else
        'medium' if bias_flags >= 2 else
        'low' if bias_flags >= 1 else
        'minimal'
    )
    
    return results


def detect_ordering_bias(scores: List[Dict], metadata: List[Dict]) -> Dict:
    """Detect if evaluation order affects scores."""
    # Group scores by position in evaluation sequence
    positions = {}
    for score, meta in zip(scores, metadata):
        pos = meta.get('position', 0)
        if pos not in positions:
            positions[pos] = []
        positions[pos].append(score['overall_score'])
    
    # Compare early vs late scores
    if len(positions) >= 2:
        early = [s for p, scores in positions.items() if p < len(positions)/2 for s in scores]
        late = [s for p, scores in positions.items() if p >= len(positions)/2 for s in scores]
        
        _, p_value = stats.ttest_ind(early, late)
        
        return {
            'early_mean': float(np.mean(early)),
            'late_mean': float(np.mean(late)),
            'p_value': float(p_value),
            'detected': p_value < 0.05
        }
    
    return {'detected': False, 'note': 'Insufficient data'}


def detect_evaluator_bias(scores: List[Dict], metadata: List[Dict]) -> Dict:
    """Detect if specific evaluators score consistently different."""
    evaluator_scores = {}
    for score, meta in zip(scores, metadata):
        evaluator = meta.get('evaluator_id', 'unknown')
        if evaluator not in evaluator_scores:
            evaluator_scores[evaluator] = []
        evaluator_scores[evaluator].append(score['overall_score'])
    
    if len(evaluator_scores) >= 2:
        # ANOVA test
        groups = list(evaluator_scores.values())
        f_stat, p_value = stats.f_oneway(*groups)
        
        # Calculate evaluator means
        evaluator_means = {
            e: float(np.mean(s)) for e, s in evaluator_scores.items()
        }
        
        return {
            'evaluator_means': evaluator_means,
            'f_statistic': float(f_stat),
            'p_value': float(p_value),
            'detected': p_value < 0.05
        }
    
    return {'detected': False, 'note': 'Insufficient evaluators'}
```

---

## 5. Data Export and Storage

### 5.1 Export Formats

```yaml
export_formats:
  json:
    description: "Full fidelity data export"
    use_case: "Programmatic analysis"
    schema_version: "1.0"
    
  csv:
    description: "Tabular data for spreadsheet analysis"
    use_case: "Quick analysis, reporting"
    
  parquet:
    description: "Columnar format for large datasets"
    use_case: "Big data analysis, ML pipelines"
```

### 5.2 Storage Schema

```sql
-- Evaluation Results Database Schema

CREATE TABLE evaluation_runs (
    run_id UUID PRIMARY KEY,
    agent_id VARCHAR(255) NOT NULL,
    agent_version VARCHAR(50),
    run_timestamp TIMESTAMP NOT NULL,
    run_config JSONB,
    status VARCHAR(20),
    summary_metrics JSONB
);

CREATE TABLE task_results (
    result_id UUID PRIMARY KEY,
    run_id UUID REFERENCES evaluation_runs(run_id),
    task_id VARCHAR(255) NOT NULL,
    task_type VARCHAR(100),
    
    -- Timing
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    ttft_ms FLOAT,
    total_time_ms FLOAT,
    
    -- Accuracy
    completed BOOLEAN,
    first_attempt_success BOOLEAN,
    error_count INTEGER,
    
    -- Scores
    correctness_score FLOAT,
    quality_score FLOAT,
    overall_score FLOAT,
    
    -- Resources
    tokens_input INTEGER,
    tokens_output INTEGER,
    cost_usd DECIMAL(10, 6),
    
    -- Raw data
    input_data JSONB,
    output_data JSONB,
    evaluation_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE human_evaluations (
    eval_id UUID PRIMARY KEY,
    result_id UUID REFERENCES task_results(result_id),
    evaluator_id VARCHAR(255),
    evaluation_timestamp TIMESTAMP,
    scores JSONB,
    notes TEXT
);

-- Indexes for common queries
CREATE INDEX idx_task_results_run ON task_results(run_id);
CREATE INDEX idx_task_results_agent ON task_results(run_id, task_type);
CREATE INDEX idx_human_evals_result ON human_evaluations(result_id);
```

---

---

## 6. 云产品Agent指标采集补充

> **关联文档**: 本节补充云产品Agent在CAPER框架下的指标采集方法。

### 6.1 CAPER维度数据采集映射

```yaml
caper_collection_mapping:
  correctness:
    primary_source: "LLM-as-Judge评分"
    secondary_source: "人工验证抽样(10%)"
    collection_method: "每题自动评分，批量聚合"
    storage_field: "caper_correctness_score"
    
  action:
    primary_source: "任务执行结果自动化验证"
    secondary_source: "沙箱环境执行结果"
    collection_method: "Mock API响应匹配 + 代码编译/运行"
    storage_field: "caper_action_score"
    
  performance:
    primary_source: "自动化计时 + Token统计"
    collection_method: "每次API调用自动记录"
    metrics_collected:
      - "time_to_first_token_ms"
      - "total_response_time_ms"
      - "tokens_input"
      - "tokens_output"
    storage_field: "caper_performance_score"
    
  engagement:
    primary_source: "LLM-as-Judge多轮对话评估"
    collection_method: "使用专用多轮对话评估模板"
    storage_field: "caper_engagement_score"
    
  risk_safety:
    primary_source: "安全测试套件自动执行"
    collection_method: "预定义攻击向量 + 自动判定"
    storage_field: "caper_risk_safety_score"
```

### 6.2 批量Agent数据采集

```python
class CloudAgentMetricsCollector(MetricsCollector):
    """云产品Agent专用指标收集器"""
    
    def __init__(self):
        super().__init__()
        self.caper_dimensions = [
            'correctness', 'action', 'performance',
            'engagement', 'risk_safety'
        ]
        
    def record_caper_scores(
        self,
        agent_id: str,
        scores: Dict[str, float],
        weights: Dict[str, float]
    ):
        """记录CAPER五维评分"""
        total = sum(
            scores.get(d, 0) * weights.get(d, 0)
            for d in self.caper_dimensions
        )
        
        with self._lock:
            if agent_id not in self.aggregated:
                self.aggregated[agent_id] = {}
            self.aggregated[agent_id]['caper'] = {
                'dimension_scores': scores,
                'weights': weights,
                'total_score': total,
                'timestamp': datetime.utcnow().isoformat()
            }
```

---

## Related Documents

- [Evaluation Metrics](./Evaluation_Metrics.md) - Complete metrics catalog
- [Quality Assurance](../QA/Quality_Assurance.md) - QA processes
- [Implementation Guide](../Implementation/Implementation_Guide.md) - Setup instructions
- [Cloud Agent Evaluation](../Cloud_Agent_Evaluation/README.md) - 云产品Agent评估
- [API Integration Guide](../Implementation/API_Integration_Guide.md) - Agent API封装
- [Corpus Assessment](../Corpus_Assessment/README.md) - 语料库评估
