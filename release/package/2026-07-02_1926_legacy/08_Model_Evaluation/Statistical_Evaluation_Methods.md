---
title: "Statistical Evaluation Methods for AI"
tags: [evaluation, statistics, significance-testing, confidence-intervals, production]
status: complete
last_updated: 2026-07-02
---

# Statistical Evaluation Methods for AI

## Why Statistical Rigor Matters

In production AI, claiming "Model A beats Model B" without statistical validation is **unreliable**. Key questions:
- Is the improvement real or due to random variation?
- How many evaluation samples are needed for reliable comparison?
- How do we handle multiple comparisons (testing many models)?

## Confidence Intervals for Metrics

### Bootstrap Confidence Intervals

```python
import numpy as np
from scipy import stats

def bootstrap_ci(metric_fn, y_true, y_pred, n_bootstrap=1000, ci=0.95):
    """Compute bootstrap confidence interval for any metric."""
    scores = []
    n = len(y_true)
    for _ in range(n_bootstrap):
        idx = np.random.choice(n, n, replace=True)
        scores.append(metric_fn(y_true[idx], y_pred[idx]))
    
    alpha = (1 - ci) / 2
    lower = np.percentile(scores, alpha * 100)
    upper = np.percentile(scores, (1 - alpha) * 100)
    return np.mean(scores), lower, upper

# Example: Accuracy with 95% CI
mean_acc, ci_low, ci_high = bootstrap_ci(
    lambda y, p: np.mean(y == p), y_true, y_pred
)
print(f"Accuracy: {mean_acc:.3f} [{ci_low:.3f}, {ci_high:.3f}]")
```

### Clopper-Pearson (Exact Binomial CI)

For accuracy/precision/recall on binary outcomes:

```python
from scipy.stats import binom

def exact_binomial_ci(successes, trials, confidence=0.95):
    """Exact Clopper-Pearson confidence interval."""
    alpha = 1 - confidence
    lower = binom.ppf(alpha / 2, trials, successes / trials) / trials
    upper = binom.ppf(1 - alpha / 2, trials, successes / trials) / trials
    return lower, upper
```

### Wilson Score Interval

Better for small samples and extreme proportions:

```python
def wilson_ci(successes, trials, confidence=0.95):
    """Wilson score confidence interval."""
    z = stats.norm.ppf(1 - (1 - confidence) / 2)
    p = successes / trials
    denominator = 1 + z**2 / trials
    center = (p + z**2 / (2 * trials)) / denominator
    spread = z * np.sqrt((p * (1 - p) + z**2 / (4 * trials)) / trials) / denominator
    return center - spread, center + spread
```

## Hypothesis Testing for Model Comparison

### Paired t-Test (Per-Sample Comparison)

```python
from scipy.stats import ttest_rel

def paired_t_test(scores_a, scores_b, alpha=0.05):
    """Test if Model A significantly differs from Model B."""
    t_stat, p_value = ttest_rel(scores_a, scores_b)
    
    # Effect size (Cohen's d)
    diff = scores_a - scores_b
    cohens_d = np.mean(diff) / np.std(diff, ddof=1)
    
    result = {
        't_statistic': t_stat,
        'p_value': p_value,
        'significant': p_value < alpha,
        'cohens_d': cohens_d,
        'effect_size': 'small' if abs(cohens_d) < 0.5 
                      else 'medium' if abs(cohens_d) < 0.8 
                      else 'large'
    }
    return result

# Example: Compare two models on same test set
result = paired_t_test(model_a_scores, model_b_scores)
print(f"p={result['p_value']:.4f}, Cohen's d={result['cohens_d']:.2f} ({result['effect_size']})")
```

### McNemar's Test (Classification Comparison)

```python
from scipy.stats import chi2

def mcnemar_test(y_true, pred_a, pred_b):
    """Test if two classifiers have significantly different error rates."""
    # Contingency table
    correct_a = pred_a == y_true
    correct_b = pred_b == y_true
    
    # b: A correct, B wrong; c: A wrong, B correct
    b = np.sum(correct_a & ~correct_b)
    c = np.sum(~correct_a & correct_b)
    
    # McNemar's statistic with continuity correction
    if b + c == 0:
        return {'chi2': 0, 'p_value': 1.0, 'significant': False}
    
    chi2_stat = (abs(b - c) - 1)**2 / (b + c)
    p_value = 1 - chi2.cdf(chi2_stat, df=1)
    
    return {
        'chi2': chi2_stat,
        'p_value': p_value,
        'significant': p_value < 0.05,
        'a_only_correct': b,
        'b_only_correct': c
    }
```

### Bootstrap Hypothesis Test

```python
def bootstrap_test(metric_fn, y_true, pred_a, pred_b, n_bootstrap=10000, alpha=0.05):
    """Non-parametric bootstrap test for model comparison."""
    n = len(y_true)
    diff_observed = metric_fn(y_true, pred_a) - metric_fn(y_true, pred_b)
    
    # Bootstrap under null hypothesis (models are equal)
    bootstrap_diffs = []
    for _ in range(n_bootstrap):
        idx = np.random.choice(n, n, replace=True)
        diff = metric_fn(y_true[idx], pred_a[idx]) - metric_fn(y_true[idx], pred_b[idx])
        bootstrap_diffs.append(diff)
    
    # Two-tailed p-value
    p_value = np.mean(np.abs(bootstrap_diffs) >= np.abs(diff_observed))
    
    return {
        'observed_diff': diff_observed,
        'p_value': p_value,
        'significant': p_value < alpha,
        'ci_95': np.percentile(bootstrap_diffs, [2.5, 97.5])
    }
```

## Sample Size Estimation

### Power Analysis

```python
from scipy.stats import norm

def required_sample_size(effect_size, alpha=0.05, power=0.8):
    """Calculate required sample size for detecting a given effect."""
    z_alpha = norm.ppf(1 - alpha / 2)
    z_beta = norm.ppf(power)
    n = ((z_alpha + z_beta) / effect_size) ** 2
    return int(np.ceil(n))

# Example: Detect 1% accuracy improvement
# Assuming baseline accuracy ~90%, std ~0.3
effect = 0.01 / 0.3  # Standardized effect size
n = required_sample_size(effect)
print(f"Need {n} samples to detect 1% improvement with 80% power")
```

### Minimum Detectable Effect

```python
def minimum_detectable_effect(n, alpha=0.05, power=0.8, std=1.0):
    """Given sample size, what's the smallest effect we can detect?"""
    z_alpha = norm.ppf(1 - alpha / 2)
    z_beta = norm.ppf(power)
    mde = (z_alpha + z_beta) * std / np.sqrt(n)
    return mde
```

## Multiple Comparisons

### Bonferroni Correction

```python
def bonferroni_correction(p_values, alpha=0.05):
    """Control family-wise error rate."""
    n_tests = len(p_values)
    adjusted_alpha = alpha / n_tests
    significant = [p < adjusted_alpha for p in p_values]
    return adjusted_alpha, significant
```

### Benjamini-Hochberg (FDR Control)

```python
def benjamini_hochberg(p_values, alpha=0.05):
    """Control false discovery rate."""
    n = len(p_values)
    sorted_idx = np.argsort(p_values)
    sorted_p = np.array(p_values)[sorted_idx]
    
    # Find threshold
    thresholds = alpha * np.arange(1, n + 1) / n
    max_idx = np.where(sorted_p <= thresholds)[0]
    
    if len(max_idx) == 0:
        return [False] * n
    
    threshold = thresholds[max_idx[-1]]
    significant = [p <= threshold for p in p_values]
    return significant
```

## Evaluation Design Patterns

### Stratified Evaluation

```python
def stratified_evaluation(y_true, y_pred, groups):
    """Evaluate per-group performance with CIs."""
    results = {}
    for group in np.unique(groups):
        mask = groups == group
        if mask.sum() < 30:
            results[group] = {'note': 'insufficient samples', 'n': mask.sum()}
            continue
        
        acc = np.mean(y_true[mask] == y_pred[mask])
        ci = bootstrap_ci(lambda y, p: np.mean(y == p), y_true[mask], y_pred[mask])
        results[group] = {
            'accuracy': acc,
            'ci_95': ci,
            'n_samples': mask.sum()
        }
    return results
```

### Cross-Validation with Statistical Tests

```python
from sklearn.model_selection import StratifiedKFold

def cv_statistical_comparison(model_a, model_b, X, y, n_splits=10):
    """Compare models using cross-validation with paired t-test."""
    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)
    scores_a, scores_b = [], []
    
    for train_idx, test_idx in skf.split(X, y):
        X_train, X_test = X[train_idx], X[test_idx]
        y_train, y_test = y[train_idx], y[test_idx]
        
        model_a.fit(X_train, y_train)
        model_b.fit(X_train, y_train)
        
        scores_a.append(model_a.score(X_test, y_test))
        scores_b.append(model_b.score(X_test, y_test))
    
    result = paired_t_test(np.array(scores_a), np.array(scores_b))
    return result
```

## Calibration Evaluation

### Reliability Diagram

```python
def reliability_diagram(y_true, y_prob, n_bins=10):
    """Compute calibration data for reliability diagram."""
    bin_edges = np.linspace(0, 1, n_bins + 1)
    bin_true = np.zeros(n_bins)
    bin_pred = np.zeros(n_bins)
    bin_count = np.zeros(n_bins)
    
    for i in range(n_bins):
        mask = (y_prob >= bin_edges[i]) & (y_prob < bin_edges[i + 1])
        if mask.sum() > 0:
            bin_true[i] = y_true[mask].mean()
            bin_pred[i] = y_prob[mask].mean()
            bin_count[i] = mask.sum()
    
    # Expected Calibration Error
    ece = np.sum(bin_count / bin_count.sum() * np.abs(bin_true - bin_pred))
    
    return {
        'bin_true': bin_true,
        'bin_pred': bin_pred,
        'bin_count': bin_count,
        'ece': ece
    }
```

### Brier Score

```python
def brier_score(y_true, y_prob):
    """Brier score: lower is better, measures calibration + discrimination."""
    return np.mean((y_prob - y_true) ** 2)
```

## LLM-Specific Statistical Evaluation

### Win Rate with Confidence

```python
def llm_win_rate_wilson(wins, total, confidence=0.95):
    """Win rate with Wilson score interval."""
    return wilson_ci(wins, total, confidence)

# Example: LLM-as-judge evaluation
wins_model_a = 156
total_comparisons = 300
rate, ci_low, ci_high = llm_win_rate_wilson(wins_model_a, total_comparisons)
print(f"Win rate: {rate:.1%} [{ci_low:.1%}, {ci_high:.1%}]")
```

### Inter-Annotator Agreement

```python
from sklearn.metrics import cohen_kappa_score

def inter_annotator_agreement(annotations_a, annotations_b):
    """Measure agreement between annotators (or LLM judges)."""
    kappa = cohen_kappa_score(annotations_a, annotations_b)
    
    interpretation = (
        'poor' if kappa < 0.2 else
        'fair' if kappa < 0.4 else
        'moderate' if kappa < 0.6 else
        'substantial' if kappa < 0.8 else
        'almost perfect'
    )
    
    return {'kappa': kappa, 'interpretation': interpretation}
```

## Reporting Best Practices

### Standard Evaluation Report Template

```markdown
## Model Comparison Report

### Setup
- Test set: N=1000, stratified by class
- Metrics: Accuracy, F1, Latency
- Significance level: α=0.05

### Results
| Model | Accuracy | 95% CI | F1 | Latency (p50/p99) |
|-------|----------|--------|-----|-------------------|
| Baseline | 92.3% | [90.8, 93.7] | 0.918 | 12ms / 45ms |
| Proposed | 93.8% | [92.4, 95.1] | 0.934 | 11ms / 42ms |

### Statistical Tests
- Paired t-test: p=0.003, Cohen's d=0.34 (small-medium effect)
- McNemar's test: p=0.012, 23 cases only Proposed correct
- Bootstrap 95% CI for Δaccuracy: [0.2%, 2.8%]

### Conclusion
The proposed model shows statistically significant improvement 
(p < 0.05) with a small-to-medium practical effect size.
```

## Related Topics

- Evaluation Metrics: Metric definitions
- [[Unified_Benchmark_Comparison]]: Benchmark comparison
- [[LLM_as_Judge_Deep_Dive]]: LLM evaluation methods
- [[Model_Evaluation]]: General evaluation framework
