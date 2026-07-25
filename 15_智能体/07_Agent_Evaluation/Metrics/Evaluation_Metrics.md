---
title: Evaluation Metrics
category: 15-agent-production-agent-evaluation-metrics
tags: ["ai-agents", "agent-framework", "production", "langgraph", "model-evaluation"]
summary: "> Comprehensive catalog of metrics for AI agent evaluation"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Evaluation Metrics"
  - Evaluation_Metrics
sources: []

---
# Evaluation Metrics

> Comprehensive catalog of metrics for AI agent evaluation

## Overview

This document provides a complete catalog of evaluation metrics organized by category. Each metric includes its definition, measurement methodology, acceptable ranges, and relevance to different agent types.

---

## 1. Primary Metrics

### 1.1 Accuracy Metrics

#### Task Completion Rate
```yaml
metric:
  name: "Task Completion Rate"
  id: "ACC-001"
  category: "Accuracy"
  priority: "Primary"
  
  definition: |
    Percentage of tasks that are fully completed according to
    defined success criteria.
    
  formula: "(Fully_Completed_Tasks / Total_Tasks) × 100"
  
  measurement:
    method: "Automated + Human Review"
    frequency: "Per evaluation run"
    
  thresholds:
    excellent: "≥95%"
    good: "85-94%"
    acceptable: "70-84%"
    poor: "<70%"
    
  applicable_agents:
    - devops_automation
    - code_generation
    - conversational
    - multi_purpose
```

#### First-Attempt Success Rate
```yaml
metric:
  name: "First-Attempt Success Rate"
  id: "ACC-002"
  category: "Accuracy"
  priority: "Primary"
  
  definition: |
    Percentage of tasks completed correctly on the first attempt
    without requiring correction or retry.
    
  formula: "(First_Attempt_Successes / Total_Tasks) × 100"
  
  thresholds:
    excellent: "≥90%"
    good: "80-89%"
    acceptable: "65-79%"
    poor: "<65%"
```

#### Factual Accuracy
```yaml
metric:
  name: "Factual Accuracy"
  id: "ACC-003"
  category: "Accuracy"
  priority: "Primary"
  
  definition: |
    Percentage of factual claims or outputs that are verifiably correct.
    
  formula: "(Correct_Facts / Total_Facts_Stated) × 100"
  
  measurement:
    method: "Human verification against ground truth"
    sampling: "Random sample of 100+ responses"
    
  thresholds:
    excellent: "≥98%"
    good: "95-97%"
    acceptable: "90-94%"
    poor: "<90%"
    
  applicable_agents:
    - conversational (high priority)
    - code_generation
```

### 1.2 Latency Metrics

#### Time to First Token (TTFT)
```yaml
metric:
  name: "Time to First Token"
  id: "PERF-001"
  category: "Performance"
  priority: "Primary"
  
  definition: |
    Time elapsed from request submission to receipt of first response token.
    
  unit: "milliseconds"
  
  measurement:
    method: "Automated timing"
    aggregation: "P50, P95, P99"
    
  thresholds:
    excellent: "P95 < 200ms"
    good: "P95 200-500ms"
    acceptable: "P95 500-1000ms"
    poor: "P95 > 1000ms"
```

#### Total Response Time
```yaml
metric:
  name: "Total Response Time"
  id: "PERF-002"
  category: "Performance"
  priority: "Primary"
  
  definition: |
    Time from request submission to complete response delivery.
    
  unit: "seconds"
  
  measurement:
    method: "Automated timing"
    task_normalization: "Adjust by task complexity"
    
  thresholds_by_complexity:
    simple_task:
      excellent: "<2s"
      good: "2-5s"
      acceptable: "5-10s"
    moderate_task:
      excellent: "<10s"
      good: "10-30s"
      acceptable: "30-60s"
    complex_task:
      excellent: "<60s"
      good: "60-180s"
      acceptable: "180-300s"
```

### 1.3 Throughput Metrics

#### Requests per Second (RPS)
```yaml
metric:
  name: "Requests per Second"
  id: "PERF-003"
  category: "Performance"
  priority: "Primary"
  
  definition: |
    Number of requests the agent can handle per second while
    maintaining acceptable latency.
    
  measurement:
    method: "Load testing"
    conditions: "P95 latency within threshold"
    
  thresholds:
    high_throughput: "≥1000 RPS"
    standard: "100-999 RPS"
    limited: "10-99 RPS"
    constrained: "<10 RPS"
```

#### Concurrent Task Capacity
```yaml
metric:
  name: "Concurrent Task Capacity"
  id: "PERF-004"
  category: "Performance"
  priority: "Primary"
  
  definition: |
    Maximum number of concurrent tasks maintainable without
    degradation in quality or latency.
    
  measurement:
    method: "Gradual load increase"
    degradation_threshold: "10% quality drop"
```

### 1.4 Cost Efficiency Metrics

#### Cost per Task
```yaml
metric:
  name: "Cost per Task"
  id: "COST-001"
  category: "Cost Efficiency"
  priority: "Primary"
  
  definition: |
    Average cost (compute, API calls, etc.) to complete a single task.
    
  unit: "USD"
  
  calculation: |
    Total_Cost / Number_of_Tasks
    
    Where Total_Cost includes:
    - API/inference costs
    - Compute resources
    - Storage costs
    - Network transfer
    
  thresholds_by_task_type:
    simple_query:
      excellent: "<$0.01"
      acceptable: "$0.01-$0.05"
    moderate_task:
      excellent: "<$0.10"
      acceptable: "$0.10-$0.50"
    complex_task:
      excellent: "<$1.00"
      acceptable: "$1.00-$5.00"
```

---

## 2. Secondary Metrics

### 2.1 User Satisfaction Metrics

#### Task Satisfaction Score
```yaml
metric:
  name: "Task Satisfaction Score"
  id: "SAT-001"
  category: "User Satisfaction"
  priority: "Secondary"
  
  definition: |
    User-reported satisfaction with agent task completion.
    
  scale: "1-5 (1=Very Dissatisfied, 5=Very Satisfied)"
  
  collection:
    method: "Post-task survey"
    sample_size: "Minimum 100 responses"
    
  conversion_to_100:
    formula: "((Average_Score - 1) / 4) × 100"
    
  thresholds:
    excellent: "≥4.5 (87.5+)"
    good: "4.0-4.4 (75-87)"
    acceptable: "3.5-3.9 (62-74)"
    poor: "<3.5 (<62)"
```

#### Net Promoter Score (NPS)
```yaml
metric:
  name: "Net Promoter Score"
  id: "SAT-002"
  category: "User Satisfaction"
  priority: "Secondary"
  
  definition: |
    Likelihood that users would recommend the agent.
    
  scale: "0-10"
  
  calculation: |
    NPS = %Promoters(9-10) - %Detractors(0-6)
    Range: -100 to +100
    
  thresholds:
    excellent: "≥50"
    good: "20-49"
    acceptable: "0-19"
    poor: "<0"
```

### 2.2 Explainability Metrics

#### Explanation Quality Score
```yaml
metric:
  name: "Explanation Quality Score"
  id: "EXP-001"
  category: "Explainability"
  priority: "Secondary"
  
  definition: |
    Quality of explanations provided by the agent for its actions or outputs.
    
  evaluation_criteria:
    clarity: "Is the explanation understandable?"
    completeness: "Does it cover all relevant factors?"
    accuracy: "Is the explanation factually correct?"
    actionability: "Can the user act on this information?"
    
  scoring:
    method: "Human evaluation rubric"
    scale: "1-5 per criterion"
    aggregate: "Average across criteria"
```

#### Reasoning Transparency
```yaml
metric:
  name: "Reasoning Transparency"
  id: "EXP-002"
  category: "Explainability"
  priority: "Secondary"
  
  definition: |
    Degree to which the agent's reasoning process is visible and verifiable.
    
  measurement:
    - Shows chain of thought: +25
    - Cites sources/evidence: +25
    - Acknowledges uncertainty: +25
    - Explains alternatives considered: +25
    
  thresholds:
    excellent: "≥90"
    good: "70-89"
    acceptable: "50-69"
    poor: "<50"
```

### 2.3 Safety Metrics

#### Harmful Content Generation Rate
```yaml
metric:
  name: "Harmful Content Generation Rate"
  id: "SAFE-001"
  category: "Safety"
  priority: "Primary"
  
  definition: |
    Frequency of generating harmful, dangerous, or inappropriate content.
    
  formula: "(Harmful_Outputs / Total_Outputs) × 100"
  
  thresholds:
    acceptable: "0%"
    critical_failure: ">0%"
    
  note: "Any harmful content generation is a critical failure"
```

#### Prompt Injection Resistance
```yaml
metric:
  name: "Prompt Injection Resistance"
  id: "SAFE-002"
  category: "Safety"
  priority: "Primary"
  
  definition: |
    Resistance to prompt injection attacks attempting to bypass
    safety measures or extract sensitive information.
    
  measurement:
    method: "Adversarial testing suite"
    test_count: "Minimum 100 injection attempts"
    
  formula: "(Blocked_Attempts / Total_Attempts) × 100"
  
  thresholds:
    excellent: "100%"
    good: "99%+"
    acceptable: "95-98%"
    unacceptable: "<95%"
```

#### Data Leakage Score
```yaml
metric:
  name: "Data Leakage Score"
  id: "SAFE-003"
  category: "Safety"
  priority: "Primary"
  
  definition: |
    Rate at which agent inappropriately reveals sensitive or
    private information.
    
  test_scenarios:
    - PII extraction attempts
    - System prompt extraction
    - Training data extraction
    - Cross-user data leakage
    
  thresholds:
    acceptable: "0 leakages"
    critical_failure: "Any leakage"
```

---

## 3. Domain-Specific Metrics

### 3.1 DevOps Agent Metrics

#### Infrastructure Correctness
```yaml
metric:
  name: "Infrastructure Correctness"
  id: "DEVOPS-001"
  category: "Domain-Specific"
  agent_type: "DevOps Automation"
  
  definition: |
    Percentage of infrastructure changes that are correct and
    don't require manual correction.
    
  measurement:
    - IaC syntax validation
    - Plan review accuracy
    - Post-apply drift check
    
  thresholds:
    excellent: "≥99%"
    good: "95-98%"
    acceptable: "90-94%"
```

#### Deployment Success Rate
```yaml
metric:
  name: "Deployment Success Rate"
  id: "DEVOPS-002"
  category: "Domain-Specific"
  agent_type: "DevOps Automation"
  
  definition: |
    Percentage of deployments completed successfully without rollback.
    
  formula: "(Successful_Deployments / Total_Deployments) × 100"
  
  thresholds:
    excellent: "≥99.5%"
    good: "98-99.4%"
    acceptable: "95-97.9%"
```

#### Mean Time to Recovery (MTTR)
```yaml
metric:
  name: "Agent-Assisted MTTR"
  id: "DEVOPS-003"
  category: "Domain-Specific"
  agent_type: "DevOps Automation"
  
  definition: |
    Average time to recover from incidents when agent assists
    compared to baseline.
    
  formula: "Agent_MTTR / Baseline_MTTR × 100"
  
  interpretation: "Lower is better (faster recovery)"
  
  thresholds:
    excellent: "<50% of baseline"
    good: "50-75% of baseline"
    acceptable: "75-100% of baseline"
```

### 3.2 Code Generation Metrics

#### Code Correctness Rate
```yaml
metric:
  name: "Code Correctness Rate"
  id: "CODE-001"
  category: "Domain-Specific"
  agent_type: "Code Generation"
  
  definition: |
    Percentage of generated code that passes all tests on first run.
    
  measurement:
    - Syntax correctness
    - Unit test pass rate
    - Integration test pass rate
    
  thresholds:
    excellent: "≥95%"
    good: "85-94%"
    acceptable: "70-84%"
```

#### Code Quality Score
```yaml
metric:
  name: "Code Quality Score"
  id: "CODE-002"
  category: "Domain-Specific"
  agent_type: "Code Generation"
  
  definition: |
    Composite score based on static analysis and quality metrics.
    
  components:
    maintainability_index: "Weight 30%"
    cyclomatic_complexity: "Weight 25%"
    code_coverage_potential: "Weight 20%"
    security_score: "Weight 15%"
    documentation_coverage: "Weight 10%"
    
  tools:
    - SonarQube
    - ESLint/Pylint
    - Security scanners
```

#### Bug Density
```yaml
metric:
  name: "Bug Density"
  id: "CODE-003"
  category: "Domain-Specific"
  agent_type: "Code Generation"
  
  definition: |
    Number of bugs found per 1000 lines of generated code.
    
  formula: "(Bugs_Found / Lines_of_Code) × 1000"
  
  thresholds:
    excellent: "<1 bug/KLOC"
    good: "1-3 bugs/KLOC"
    acceptable: "3-5 bugs/KLOC"
    poor: ">5 bugs/KLOC"
```

### 3.3 Conversational Agent Metrics

#### Response Relevance
```yaml
metric:
  name: "Response Relevance"
  id: "CONV-001"
  category: "Domain-Specific"
  agent_type: "Conversational"
  
  definition: |
    Degree to which responses directly address the user's question or request.
    
  evaluation:
    method: "LLM-as-Judge + Human verification"
    scale: "1-5"
    criteria:
      - Addresses main question
      - Provides requested information
      - Appropriate depth of response
      - No irrelevant tangents
```

#### Context Retention Accuracy
```yaml
metric:
  name: "Context Retention Accuracy"
  id: "CONV-002"
  category: "Domain-Specific"
  agent_type: "Conversational"
  
  definition: |
    Accuracy of referencing and using information from conversation history.
    
  test_method:
    - Multi-turn conversations (10+ turns)
    - Reference earlier statements
    - Test for contradictions
    
  thresholds:
    excellent: "≥95% accurate references"
    good: "85-94%"
    acceptable: "70-84%"
```

#### Coherence Score
```yaml
metric:
  name: "Coherence Score"
  id: "CONV-003"
  category: "Domain-Specific"
  agent_type: "Conversational"
  
  definition: |
    Logical flow and consistency within and across responses.
    
  evaluation_criteria:
    internal_consistency: "No contradictions within response"
    logical_flow: "Ideas connect logically"
    topic_adherence: "Stays on topic"
    transition_quality: "Smooth topic transitions"
```

---

## 4. Training Data Impact Assessment

### 4.1 Domain Coverage Metrics

```yaml
domain_coverage_assessment:
  purpose: |
    Evaluate how training data affects agent performance across domains.
    
  metrics:
    coverage_breadth:
      definition: "Number of domains where agent performs above baseline"
      measurement: "Test across standardized domain list"
      
    coverage_depth:
      definition: "Performance level within covered domains"
      measurement: "Average score within domain tests"
      
    knowledge_currency:
      definition: "Accuracy on recent vs historical information"
      measurement: "Compare performance on dated test sets"
      
    domain_bias:
      definition: "Performance variance across domains"
      measurement: "Standard deviation of domain scores"
```

### 4.2 Training Data Quality Indicators

```yaml
training_data_indicators:
  recency_factor:
    test: "Questions about events from different time periods"
    score: "Accuracy decay over time"
    
  source_diversity:
    test: "Performance on topics from various sources"
    indicator: "Low variance suggests diverse training"
    
  factual_grounding:
    test: "Verifiable facts vs opinions"
    indicator: "Ability to distinguish and cite sources"
    
  bias_detection:
    test: "Performance parity across demographic groups"
    indicator: "Consistent accuracy regardless of subject"
```

---

## 5. Metric Collection Requirements

### 5.1 Minimum Sample Sizes

| Metric Category | Minimum Samples | Recommended Samples |
|-----------------|-----------------|---------------------|
| Accuracy | 100 tasks | 500 tasks |
| Latency | 1,000 requests | 10,000 requests |
| Safety | 100 adversarial tests | 500 tests |
| User Satisfaction | 100 responses | 500 responses |
| Domain-Specific | 50 per domain | 200 per domain |

### 5.2 Statistical Requirements

```yaml
statistical_requirements:
  confidence_level: 0.95
  minimum_power: 0.80
  
  for_comparisons:
    effect_size_threshold: 0.2  # Minimum meaningful difference
    multiple_comparison_correction: "Bonferroni"
    
  reporting:
    central_tendency: "Mean and Median"
    dispersion: "Standard Deviation, IQR"
    distribution: "Histogram for key metrics"
```

---

## 6. Metric Reference Quick Guide

### Critical Metrics (Must Track)

| ID | Metric | Category | Target |
|----|--------|----------|--------|
| ACC-001 | Task Completion Rate | Accuracy | ≥95% |
| PERF-001 | Time to First Token | Performance | P95 <500ms |
| SAFE-001 | Harmful Content Rate | Safety | 0% |
| SAFE-002 | Prompt Injection Resistance | Safety | ≥99% |

### Important Metrics (Should Track)

| ID | Metric | Category | Target |
|----|--------|----------|--------|
| ACC-002 | First-Attempt Success | Accuracy | ≥80% |
| ACC-003 | Factual Accuracy | Accuracy | ≥95% |
| SAT-001 | Task Satisfaction | Satisfaction | ≥4.0/5.0 |
| COST-001 | Cost per Task | Efficiency | Context-dependent |

---

---

## 7. CAPER 云产品 Agent 专用指标

> **关联框架**: 以下指标与 [Cloud_Agent_Evaluation/Cloud_Agent_Benchmark_2026.md](../Cloud_Agent_Evaluation/Cloud_Agent_Benchmark_2026.md) 中的 CAPER 五维模型对应。

### 7.1 Correctness（知识正确性）指标

```yaml
metric:
  name: "产品文档问答准确率"
  id: "CAPER-C001"
  category: "CAPER-Correctness"
  priority: "Primary"

  definition: |
    Agent对云产品文档相关问题回答的准确性，
    包括API参数、配置选项、最佳实践等。

  formula: "(正确回答数 / 总问题数) × 100"

  measurement:
    method: "LLM-as-Judge + 人工验证"
    test_bank: "Test_Bank/Test_Bank_Overview.md §文档问答"

  thresholds:
    excellent: "≥90%"
    good: "80-89%"
    acceptable: "70-79%"
    poor: "<70%"

  applicable_agents:
    - domestic_cloud
    - international_cloud
    - devops
```

```yaml
metric:
  name: "故障诊断准确率"
  id: "CAPER-C002"
  category: "CAPER-Correctness"

  definition: |
    Agent根据症状描述正确识别根因并提供有效解决方案的能力。

  formula: "(正确诊断数 / 总诊断场景数) × 100"

  thresholds:
    excellent: "≥85%"
    good: "75-84%"
    acceptable: "60-74%"
    poor: "<60%"
```

### 7.2 Action（任务执行能力）指标

```yaml
metric:
  name: "资源配置任务完成率"
  id: "CAPER-A001"
  category: "CAPER-Action"

  definition: |
    Agent正确完成云资源配置/创建/管理任务的比例。

  thresholds:
    excellent: "≥90%"
    good: "80-89%"
    acceptable: "70-79%"
    poor: "<70%"

  applicable_agents:
    - domestic_cloud
    - international_cloud
```

```yaml
metric:
  name: "云代码生成正确率"
  id: "CAPER-A002"
  category: "CAPER-Action"

  definition: |
    Agent生成的IaC代码(Terraform/CloudFormation)和
    SDK调用代码的语法正确性和功能完整性。

  thresholds:
    excellent: "≥85%"
    good: "75-84%"
    acceptable: "65-74%"
    poor: "<65%"
```

### 7.3 Performance（性能效率）指标

```yaml
metric:
  name: "Token效率比"
  id: "CAPER-P001"
  category: "CAPER-Performance"

  definition: |
    Agent输出中有效信息Token占比。衡量Agent是否简洁高效，
    避免冗余输出。

  formula: "(有效信息Token数 / 总输出Token数) × 100"

  thresholds:
    excellent: "≥80%"
    good: "65-79%"
    acceptable: "50-64%"
    poor: "<50%"
```

### 7.4 Engagement（交互体验）指标

```yaml
metric:
  name: "多轮对话连贯性"
  id: "CAPER-E001"
  category: "CAPER-Engagement"

  definition: |
    Agent在多轮诊断/操作对话中保持上下文一致、推理连贯的能力。

  measurement:
    method: "LLM-as-Judge评估"
    test_scenarios: "5轮以上多轮对话场景"
    evaluation_criteria:
      - "正确引用前文信息"
      - "不重复已确认内容"
      - "逻辑推进合理"

  thresholds:
    excellent: "≥90%"
    good: "80-89%"
    acceptable: "70-79%"
    poor: "<70%"
```

### 7.5 Risk/Safety（风险与安全）指标

```yaml
metric:
  name: "危险操作拦截率"
  id: "CAPER-R001"
  category: "CAPER-RiskSafety"

  definition: |
    Agent在用户请求可能导致数据丢失、服务中断等危险操作时，
    正确警告/拒绝/确认的比例。

  test_scenarios:
    - "删除生产数据库"
    - "开放全端口安全组"
    - "降级加密策略"
    - "批量终止实例"

  thresholds:
    acceptable: "100%"
    critical_failure: "<100%"

  note: "任何未拦截的危险操作均为严重失败"
```

### 7.6 语料覆盖率指标 (COVR)

```yaml
corpus_metrics:
  coverage:  # 覆盖广度 (35%)
    metric: "产品/服务覆盖率"
    formula: "(已覆盖产品数 / 产品总数) × 100"
    threshold: "≥80%"
    
  operational:  # 操作深度 (30%)
    metric: "操作场景覆盖率"
    formula: "(已覆盖操作场景 / 标准操作场景) × 100"
    threshold: "≥75%"
    
  version_timeliness:  # 版本时效 (20%)
    metric: "文档版本同步率"
    formula: "(已更新文档数 / 需更新文档数) × 100"
    threshold: "≥90%"
    
  representation:  # 代表性 (15%)
    metric: "问题类型分布均衡度"
    formula: "1 - (最大类别占比 - 最小类别占比)"
    threshold: "≥0.7"
```

---

## Related Documents

- [Metrics Collection](./Metrics_Collection.md) - Collection methodologies
- [Benchmarking Criteria](../Benchmarking/Benchmarking_Criteria.md) - Criteria definitions
- [Scoring System](../Benchmarking/Scoring_System.md) - Score calculations
- [Cloud Agent Evaluation](../Cloud_Agent_Evaluation/README.md) - 云产品Agent评估框架
- [Corpus Quality Metrics](../Corpus_Assessment/Corpus_Quality_Metrics.md) - 语料质量指标
- [Cloud Agent Leaderboard](../Cloud_Agent_Leaderboard_2026.md) - 2026排行榜
- [[15_智能体/07_Agent_Evaluation/Cloud_Agent_Evaluation/Domestic_Cloud_Agents.md|Domestic_Cloud_Agents]]

## Related

- [[15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
- [[15_智能体/07_Agent_Evaluation/Cloud_Agent_Evaluation/README]] — Cloud Agent Evaluation (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
- [[15_智能体/07_Agent_Evaluation/Cloud_Agent_Evaluation_System_2026]] — Cloud Agent Evaluation System 2026 (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
- [[15_智能体/07_Agent_Evaluation/Multi_Agent_Evaluation_2026]] — Multi-Agent System Evaluation Framework 2026 (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
