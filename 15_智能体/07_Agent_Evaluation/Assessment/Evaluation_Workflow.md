---
title: Evaluation Workflow
category: 15-agent-production-agent-evaluation-assessment
tags: ["ai-agents", "agent-framework", "production", "langgraph", "model-evaluation"]
summary: "> Step-by-step process for comprehensive agent evaluation"
created: 2026-05-31
updated: 2026-05-31
tier: core
aliases:
  - "Evaluation Workflow"
  - Evaluation_Workflow
sources: []

name_zh: "评估工作流"
---
# Evaluation Workflow

> 中文简称：评估工作流

> Step-by-step process for comprehensive agent evaluation

## Overview

This document provides a detailed, actionable workflow for evaluating AI agents from initial planning through final reporting. It includes role assignments, timeline guidance, and documentation requirements.

---

## 1. Evaluation Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    EVALUATION WORKFLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │  PLAN    │──▶│  PREPARE │──▶│ EXECUTE  │──▶│ ANALYZE  │    │
│  │          │   │          │   │          │   │          │    │
│  │ 1-2 days │   │ 2-3 days │   │ 5-10 days│   │ 2-3 days │    │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘    │
│       │              │              │              │            │
│       ▼              ▼              ▼              ▼            │
│  • Define scope  • Set up env   • Run tests    • Score        │
│  • Select tests  • Configure    • Collect      • Compare      │
│  • Assign roles  • Validate     • Monitor      • Report       │
│                                                                  │
│                                   ┌──────────┐                  │
│                                   │  REPORT  │                  │
│                                   │          │                  │
│                                   │ 1-2 days │                  │
│                                   └──────────┘                  │
│                                        │                        │
│                                        ▼                        │
│                                   • Final report                │
│                                   • Recommendations             │
│                                   • Sign-off                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase 1: Planning (1-2 Days)

### 2.1 Define Evaluation Scope

```yaml
evaluation_scope_template:
  evaluation_id: "EVAL-2026-001"
  created_date: "2026-03-01"
  
  objectives:
    primary: "Determine if Agent X is ready for production deployment"
    secondary:
      - "Compare performance against current production agent"
      - "Identify capability gaps"
      - "Establish performance baselines"
      
  agents_under_evaluation:
    - agent_id: "agent-x-v1.0"
      type: "DevOps Automation"
      version: "1.0.0"
      
  comparison_baseline:
    - agent_id: "agent-current-v2.3"
      description: "Current production agent"
      
  scope_boundaries:
    included:
      - "Core DevOps tasks (CI/CD, IaC, monitoring)"
      - "Standard operational scenarios"
      - "Edge case handling"
    excluded:
      - "Multi-language support (future evaluation)"
      - "Custom integrations (separate evaluation)"
      
  constraints:
    timeline: "2 weeks"
    budget: "$5,000"
    resources: "2 evaluators, 1 reviewer"
```

### 2.2 Select Test Suite

```yaml
test_suite_selection:
  evaluation_type: "Full Production Readiness"
  
  test_categories:
    core_functionality:
      tests: 100
      priority: "Required"
      pass_threshold: 85%
      
    edge_cases:
      tests: 50
      priority: "Required"
      pass_threshold: 70%
      
    stress_testing:
      tests: 20
      priority: "Required"
      pass_threshold: 90%
      
    safety_testing:
      tests: 50
      priority: "Critical"
      pass_threshold: 100%
      
    domain_specific:
      tests: 80
      priority: "Required"
      pass_threshold: 80%
      
  total_tests: 300
  estimated_duration: "5-7 days automated, 2-3 days manual review"
```

### 2.3 Planning Checklist

```
PLANNING PHASE CHECKLIST
═══════════════════════════════════════════════════════════════════

□ Evaluation objectives documented and approved
□ Agents identified and access verified
□ Test suite selected and customized if needed
□ Evaluation criteria and pass thresholds defined
□ Timeline created and communicated
□ Resources allocated (personnel, infrastructure, budget)
□ Stakeholders identified and notified
□ Kick-off meeting scheduled

Approvals Required:
□ Technical Lead
□ Product Owner
□ Evaluation Team Lead
```

---

## 3. Phase 2: Preparation (2-3 Days)

### 3.1 Environment Setup

```yaml
environment_setup:
  infrastructure:
    compute:
      type: "Kubernetes cluster"
      nodes: 3
      specs: "8 vCPU, 32GB RAM per node"
      
    storage:
      type: "SSD"
      capacity: "500GB"
      
    networking:
      isolation: "Dedicated namespace"
      egress: "Controlled, logged"
      
  agent_deployment:
    method: "Container deployment"
    configuration:
      resource_limits:
        cpu: "4"
        memory: "16Gi"
      replicas: 2
      
  monitoring_setup:
    metrics: "Prometheus + Grafana"
    logging: "ELK Stack"
    tracing: "Jaeger"
    
  test_data:
    source: "Production anonymized + synthetic"
    volume: "10,000 test cases"
    validation: "Schema validated, PII removed"
```

### 3.2 Configuration Validation

```yaml
configuration_validation:
  agent_connectivity:
    tests:
      - "API endpoint accessible"
      - "Authentication working"
      - "Rate limits configured"
    status: "pending"
    
  metrics_collection:
    tests:
      - "Metrics endpoint responding"
      - "Prometheus scraping working"
      - "Grafana dashboards loading"
    status: "pending"
    
  logging:
    tests:
      - "Logs flowing to Elasticsearch"
      - "Log levels configured correctly"
      - "Sensitive data not logged"
    status: "pending"
    
  test_harness:
    tests:
      - "Test framework installed"
      - "Test data loaded"
      - "Dry run successful"
    status: "pending"
```

### 3.3 Preparation Checklist

```
PREPARATION PHASE CHECKLIST
═══════════════════════════════════════════════════════════════════

Infrastructure:
□ Evaluation environment provisioned
□ Agent deployed and accessible
□ Network policies configured
□ Resource limits set

Monitoring:
□ Metrics collection verified
□ Dashboards configured
□ Alerting rules set up
□ Log aggregation working

Test Data:
□ Test data prepared
□ Data validation complete
□ Test cases loaded
□ Baseline data captured

Validation:
□ Dry run executed successfully
□ Sample tests passing
□ Metrics being recorded
□ No blocking issues

Ready for Execution:
□ All systems green
□ Team briefed
□ Escalation paths confirmed
```

---

## 4. Phase 3: Execution (5-10 Days)

### 4.1 Execution Schedule

```
EXECUTION TIMELINE
═══════════════════════════════════════════════════════════════════

Day 1-2: Automated Core Testing
───────────────────────────────────────────────────────────────────
□ Execute core functionality test suite (100 tests)
□ Execute edge case test suite (50 tests)
□ Monitor for blocking issues
□ Daily status check

Day 3-4: Stress and Performance Testing
───────────────────────────────────────────────────────────────────
□ Execute load testing
□ Execute stress testing
□ Execute soak testing (24 hour)
□ Performance analysis

Day 5-6: Safety and Security Testing
───────────────────────────────────────────────────────────────────
□ Execute safety test suite (50 tests)
□ Execute adversarial tests
□ Security scan
□ Safety review meeting

Day 7-8: Domain-Specific and Manual Evaluation
───────────────────────────────────────────────────────────────────
□ Execute domain-specific tests (80 tests)
□ Manual evaluation sessions
□ LLM-as-judge evaluation
□ Human-in-the-loop review

Day 9-10: A/B Comparison (if applicable)
───────────────────────────────────────────────────────────────────
□ Head-to-head comparison tests
□ Statistical significance analysis
□ Qualitative comparison
□ Final data collection
```

### 4.2 Daily Monitoring Protocol

```yaml
daily_monitoring:
  morning_check:
    time: "09:00"
    tasks:
      - "Review overnight test results"
      - "Check for failures or anomalies"
      - "Verify resource utilization"
      - "Update status dashboard"
      
  midday_review:
    time: "13:00"
    tasks:
      - "Progress check against schedule"
      - "Address any blocking issues"
      - "Adjust test schedule if needed"
      
  end_of_day:
    time: "17:00"
    tasks:
      - "Summarize day's results"
      - "Document any issues"
      - "Plan next day's activities"
      - "Send status update"
      
  status_report_template:
    format: |
      ## Daily Status: EVAL-2026-001
      Date: {date}
      
      ### Progress
      - Tests Completed: {completed}/{total}
      - Pass Rate: {pass_rate}%
      
      ### Issues
      - Blocking: {blocking_count}
      - Non-blocking: {non_blocking_count}
      
      ### Next Steps
      - {next_steps}
```

### 4.3 Issue Escalation Matrix

```
ISSUE ESCALATION MATRIX
═══════════════════════════════════════════════════════════════════

Severity    Response Time    Escalation Path           Action
───────────────────────────────────────────────────────────────────
Critical    < 1 hour        Eval Lead → Tech Lead     Stop evaluation
            (Blocking)      → Management              Resolve immediately

High        < 4 hours       Eval Lead → Tech Lead     Pause affected tests
                                                      Continue others

Medium      < 24 hours      Eval Lead                 Document and track
                                                      Continue evaluation

Low         Next review     Document in report        No immediate action
───────────────────────────────────────────────────────────────────

Examples:
- Critical: Agent producing harmful outputs
- High: Test infrastructure failure, major test failures
- Medium: Minor test failures, data quality issues
- Low: Documentation gaps, minor configuration issues
```

### 4.4 Execution Checklist

```
EXECUTION PHASE CHECKLIST
═══════════════════════════════════════════════════════════════════

Test Execution:
□ Core functionality tests complete
□ Edge case tests complete
□ Stress tests complete
□ Safety tests complete
□ Domain-specific tests complete
□ Manual evaluation complete
□ A/B comparison complete (if applicable)

Quality Gates:
□ Core functionality: ≥85% pass rate
□ Safety tests: 100% pass rate
□ No critical failures
□ Performance within thresholds

Documentation:
□ All test results recorded
□ Failures documented with details
□ Anomalies noted
□ Raw data preserved

Sign-off:
□ Execution complete
□ Data quality verified
□ Ready for analysis
```

---

## 5. Phase 4: Analysis (2-3 Days)

### 5.1 Analysis Workflow

```
ANALYSIS WORKFLOW
═══════════════════════════════════════════════════════════════════

Step 1: Data Aggregation (4 hours)
───────────────────────────────────────────────────────────────────
□ Collect all test results
□ Aggregate metrics
□ Calculate summary statistics
□ Validate data completeness

Step 2: Score Calculation (4 hours)
───────────────────────────────────────────────────────────────────
□ Apply scoring formulas
□ Calculate component scores (RAPS)
□ Calculate domain-specific scores
□ Compute composite score

Step 3: Statistical Analysis (4 hours)
───────────────────────────────────────────────────────────────────
□ Calculate confidence intervals
□ Perform significance tests (if comparing)
□ Analyze distributions
□ Identify outliers

Step 4: Qualitative Analysis (8 hours)
───────────────────────────────────────────────────────────────────
□ Review failure cases
□ Analyze edge case performance
□ Assess safety incidents
□ Evaluate human feedback

Step 5: Comparative Analysis (4 hours)
───────────────────────────────────────────────────────────────────
□ Compare against baseline
□ Compare against benchmarks
□ Identify strengths and weaknesses
□ Document performance gaps

Step 6: Synthesis (4 hours)
───────────────────────────────────────────────────────────────────
□ Synthesize findings
□ Draft recommendations
□ Prepare visualizations
□ Review with team
```

### 5.2 Scoring Calculation Worksheet

```
SCORING CALCULATION WORKSHEET
═══════════════════════════════════════════════════════════════════

Agent: {agent_id}
Evaluation: {eval_id}
Date: {date}

RAPS CORE SCORES (60% of total)
───────────────────────────────────────────────────────────────────
                        Raw Score    Weight    Contribution
Reasoning                  ___        25%         ___
Accuracy                   ___        30%         ___
Performance                ___        25%         ___
Safety                     ___        20%         ___
                                    ─────────────────────
                         RAPS Subtotal:          ___

ADDITIONAL SCORES (40% of total)
───────────────────────────────────────────────────────────────────
                        Raw Score    Weight    Contribution
Domain Specific            ___        20%         ___
Quality Factors            ___        10%         ___
Reliability                ___         5%         ___
User Satisfaction          ___         5%         ___
                                    ─────────────────────
                    Additional Subtotal:         ___

COMPOSITE SCORE
───────────────────────────────────────────────────────────────────
RAPS Contribution (60%):                         ___
Additional Contribution (40%):                   ___
                                    ─────────────────────
COMPOSITE SCORE:                                 ___

GRADE: ___

Confidence Interval (95%): [___ , ___]
```

### 5.3 Analysis Checklist

```
ANALYSIS PHASE CHECKLIST
═══════════════════════════════════════════════════════════════════

Data Processing:
□ All data collected and aggregated
□ Data quality verified
□ Missing data documented
□ Outliers identified and handled

Scoring:
□ Component scores calculated
□ Composite score calculated
□ Confidence intervals computed
□ Grade assigned

Statistical Analysis:
□ Distributions analyzed
□ Significance tests performed
□ Effect sizes calculated
□ Bias checks completed

Qualitative Analysis:
□ Failure analysis complete
□ Edge cases reviewed
□ Safety incidents analyzed
□ Feedback synthesized

Comparison:
□ Baseline comparison complete
□ Benchmark comparison complete
□ Strengths identified
□ Weaknesses identified

Ready for Reporting:
□ All analyses complete
□ Findings documented
□ Visualizations prepared
□ Draft recommendations ready
```

---

## 6. Phase 5: Reporting (1-2 Days)

### 6.1 Report Structure

```yaml
report_structure:
  executive_summary:
    length: "1 page"
    content:
      - "Overall recommendation"
      - "Key scores"
      - "Critical findings"
      - "Next steps"
      
  detailed_findings:
    sections:
      - title: "Evaluation Overview"
        content: "Scope, methodology, timeline"
        
      - title: "Performance Summary"
        content: "Scores, grades, comparisons"
        
      - title: "Capability Analysis"
        content: "Strengths, weaknesses, gaps"
        
      - title: "Safety and Compliance"
        content: "Safety results, compliance status"
        
      - title: "Recommendations"
        content: "Go/no-go decision, conditions, improvements"
        
  appendices:
    - "Detailed test results"
    - "Statistical analysis"
    - "Raw data references"
    - "Methodology notes"
```

### 6.2 Report Review Process

```
REPORT REVIEW PROCESS
═══════════════════════════════════════════════════════════════════

Step 1: Internal Review (4 hours)
───────────────────────────────────────────────────────────────────
Reviewer: Evaluation Team
Focus:
□ Data accuracy
□ Calculation verification
□ Consistency check
□ Completeness

Step 2: Technical Review (4 hours)
───────────────────────────────────────────────────────────────────
Reviewer: Technical Lead
Focus:
□ Methodology soundness
□ Technical accuracy
□ Recommendation validity
□ Risk assessment

Step 3: Stakeholder Review (4 hours)
───────────────────────────────────────────────────────────────────
Reviewer: Product Owner / Stakeholders
Focus:
□ Business alignment
□ Recommendation clarity
□ Action items
□ Timeline feasibility

Step 4: Final Approval (2 hours)
───────────────────────────────────────────────────────────────────
Approver: Evaluation Sponsor
□ Final review
□ Sign-off
□ Distribution approval
```

### 6.3 Reporting Checklist

```
REPORTING PHASE CHECKLIST
═══════════════════════════════════════════════════════════════════

Report Preparation:
□ Executive summary drafted
□ Detailed findings written
□ Visualizations created
□ Appendices compiled

Review Process:
□ Internal review complete
□ Technical review complete
□ Stakeholder review complete
□ All feedback incorporated

Final Steps:
□ Final proofreading
□ Report formatted
□ Approval obtained
□ Distribution list confirmed

Delivery:
□ Report distributed
□ Presentation scheduled (if needed)
□ Q&A session planned
□ Follow-up actions assigned
```

---

## 7. Role Assignments

### 7.1 Role Definitions

| Role | Responsibilities | Time Commitment |
|------|------------------|-----------------|
| **Evaluation Lead** | Overall coordination, decision making, reporting | 80% during evaluation |
| **Test Engineer** | Test execution, data collection, issue triage | 100% during execution |
| **Analyst** | Score calculation, statistical analysis | 100% during analysis |
| **Technical Reviewer** | Technical validation, methodology review | 20% throughout |
| **Stakeholder/Sponsor** | Requirements, approvals, decisions | 10% throughout |

### 7.2 RACI Matrix

```
RACI MATRIX
═══════════════════════════════════════════════════════════════════

Activity              Lead    Engineer    Analyst    Reviewer    Sponsor
───────────────────────────────────────────────────────────────────
Define Scope           A         C          C          C           R
Select Tests           A         R          C          C           I
Setup Environment      A         R          I          C           I
Execute Tests          A         R          I          C           I
Collect Data           I         R          A          I           I
Calculate Scores       A         I          R          C           I
Analyze Results        A         I          R          C           I
Write Report           R         C          C          C           I
Review Report          A         I          I          R           C
Final Approval         A         I          I          C           R
───────────────────────────────────────────────────────────────────

R = Responsible, A = Accountable, C = Consulted, I = Informed
```

---

## 8. Timeline Templates

### 8.1 Quick Evaluation (1 Week)

```
QUICK EVALUATION TIMELINE
═══════════════════════════════════════════════════════════════════

Day 1: Planning & Preparation
□ Morning: Define scope, select core tests
□ Afternoon: Setup environment, validate

Day 2-3: Core Execution
□ Execute automated core tests
□ Execute safety tests
□ Initial manual review

Day 4: Analysis
□ Score calculation
□ Basic analysis
□ Draft findings

Day 5: Reporting
□ Write summary report
□ Review and approve
□ Distribute

Best for: Quick assessments, minor updates, urgent decisions
```

### 8.2 Standard Evaluation (2 Weeks)

```
STANDARD EVALUATION TIMELINE
═══════════════════════════════════════════════════════════════════

Week 1
───────────────────────────────────────────────────────────────────
Day 1-2: Planning
Day 3-5: Preparation + Core Testing

Week 2
───────────────────────────────────────────────────────────────────
Day 6-8: Advanced Testing + Manual Evaluation
Day 9: Analysis
Day 10: Reporting

Best for: Production readiness, regular evaluations
```

### 8.3 Comprehensive Evaluation (4 Weeks)

```
COMPREHENSIVE EVALUATION TIMELINE
═══════════════════════════════════════════════════════════════════

Week 1: Planning & Preparation
Week 2: Automated Testing
Week 3: Manual Evaluation + A/B Testing
Week 4: Analysis & Reporting

Best for: Major releases, competitive analysis, annual reviews
```

---

## 9. Documentation Requirements

### 9.1 Required Documentation

| Document | When | Owner | Template |
|----------|------|-------|----------|
| Evaluation Plan | Planning | Lead | eval_plan_template.md |
| Test Configuration | Preparation | Engineer | test_config_template.yaml |
| Daily Status | Execution | Lead | daily_status_template.md |
| Issue Log | Execution | Engineer | issue_log_template.md |
| Raw Results | Execution | Engineer | (automated) |
| Analysis Worksheet | Analysis | Analyst | analysis_worksheet.xlsx |
| Final Report | Reporting | Lead | report_template.md |

### 9.2 Retention Policy

```yaml
documentation_retention:
  final_report:
    retention: "Permanent"
    storage: "Document management system"
    
  raw_data:
    retention: "2 years"
    storage: "Data warehouse"
    
  analysis_artifacts:
    retention: "1 year"
    storage: "Project repository"
    
  working_documents:
    retention: "6 months"
    storage: "Team storage"
```

---

## 10. 云产品 Agent 评估工作流 (CAPER Path)

> **适用场景**: 评估云产品智能 Agent（国内云、国际云、DevOps Agent、通用聊天 Agent）时，使用 CAPER 五维评估模型替代或补充标准 RAPS 工作流。

### 10.1 CAPER 评估流程概览

```
┌─────────────────────────────────────────────────────────────────┐
│              CAPER 云产品Agent评估工作流                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │  PLAN    │──▶│  PREPARE │──▶│ EXECUTE  │──▶│ ANALYZE  │    │
│  │ (CAPER)  │   │ (Cloud)  │   │ (5-Dim)  │   │ (Score)  │    │
│  │          │   │          │   │          │   │          │    │
│  │ 1 day    │   │ 2 days   │   │ 3-5 days │   │ 2 days   │    │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘    │
│       │              │              │              │            │
│       ▼              ▼              ▼              ▼            │
│  • 选择Agent类别  • API对接     • C维度测试    • CAPER计算    │
│  • 确定权重配置   • Mock配置    • A维度测试    • 排行榜更新    │
│  • 选择题库子集   • 语料评估    • P维度测试    • 报告生成      │
│  • 选择评估模板                • E维度测试                    │
│                                • R维度测试                    │
│                                                                  │
│                              ┌──────────┐                       │
│                              │  REPORT  │                       │
│                              │ (Cloud)  │                       │
│                              │ 1-2 days │                       │
│                              └──────────┘                       │
│                                   │                             │
│                                   ▼                             │
│                              • CAPER评分卡                    │
│                              • 排行榜更新                      │
│                              • 语料改进建议                    │
│                              • 持续监控配置                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Agent 类别与权重配置

```yaml
caper_weight_profiles:
  domestic_cloud:  # 国内云产品Agent
    correctness: 0.25
    action: 0.25
    performance: 0.20
    engagement: 0.15
    risk_safety: 0.15
    
  international_cloud:  # 国际云产品Agent
    correctness: 0.25
    action: 0.25
    performance: 0.20
    engagement: 0.15
    risk_safety: 0.15
    
  devops_agent:  # DevOps Agent
    correctness: 0.20
    action: 0.30
    performance: 0.25
    engagement: 0.10
    risk_safety: 0.15
    
  general_chat:  # 通用聊天Agent
    correctness: 0.30
    action: 0.15
    performance: 0.15
    engagement: 0.25
    risk_safety: 0.15
```

### 10.3 评估时间线

```
CAPER QUICK TIMELINE (1 Week)
═════════════════════════════════════════════════════════════════════

Day 1: Planning & Agent接入
□ 确认评估Agent列表与类别
□ 配置Agent API连接（参考 Implementation/API_Integration_Guide.md）
□ 选择对应权重配置与题库子集

Day 2: Preparation
□ 部署Mock Cloud API环境
□ 配置LLM-as-Judge评估模板
□ 准备语料覆盖率评估（COVR模型）

Day 3-5: 五维测试执行
□ Correctness: 产品文档QA + 配置建议 + 故障诊断 (100题)
□ Action: 资源创建 + 代码生成 + 多步骤流程 (80题)
□ Performance: 延迟基准 + Token效率 + 并发处理 (50题)
□ Engagement: 多轮对话 + 主动建议 + 错误引导 (60题)
□ Risk/Safety: 危险操作拦截 + 数据保护 + 合规 (50题)

Day 6: Analysis & Scoring
□ CAPER五维分数计算
□ 排行榜更新（参考 Cloud_Agent_Leaderboard_2026.md）
□ 语料覆盖率报告生成

Day 7: Reporting
□ 生成CAPER评分卡
□ 排行榜发布
□ 语料改进建议
□ 配置持续监控
```

### 10.4 与标准 RAPS 工作流的关系

```
标准评估工作流 (§1-§9)              CAPER评估工作流 (§10)
┌──────────────────────┐          ┌──────────────────────┐
│ 适用: DevOps/代码/    │          │ 适用: 云产品/          │
│       通用Agent       │          │       SaaS Agent      │
│ 框架: RAPS四维        │◄────────►│ 框架: CAPER五维       │
│ 权重: 标准/高可靠/开发  │  映射    │ 权重: 按Agent类别     │
│ 报告: RAPS报告模板    │          │ 报告: CAPER评分卡     │
└──────────────────────┘          └──────────────────────┘
         │                                  │
         └────────── 共享基础设施 ───────────┘
              • Agent Harness (§7)
              • LLM-as-Judge
              • 统计分析引擎
              • 监控与报告系统
```

---

## Related Documents

- [Production Assessment](./Production_Assessment.md) - Production protocols
- [Testing Framework](../Testing_Methodologies/Testing_Framework.md) - Testing methodology
- [Sample Reports](../Implementation/Sample_Reports.md) - Report templates
- [Cloud Agent Evaluation](../Cloud_Agent_Evaluation/README.md) - 云产品Agent评估框架
- [Cloud Agent Leaderboard](../Cloud_Agent_Leaderboard_2026.md) - 2026排行榜
- [Implementation/API Integration Guide](../Implementation/API_Integration_Guide.md) - Agent API对接
- [Implementation/LLM as Judge Templates](../Implementation/LLM_as_Judge_Templates.md) - LLM评估模板
- [Corpus Assessment](../Corpus_Assessment/README.md) - 语料库评估
- [[15_智能体/07_Agent_Evaluation/Test_Bank/Test_Bank_Overview.md|Test_Bank_Overview]]

## Related

- [[15_智能体/07_Agent_Evaluation/Cloud_Agent_Evaluation/README]] — Cloud Agent Evaluation (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
- [[15_智能体/07_Agent_Evaluation/Cloud_Agent_Evaluation_System_2026]] — Cloud Agent Evaluation System 2026 (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
- [[15_智能体/07_Agent_Evaluation/Metrics/Evaluation_Metrics]] — Evaluation Metrics (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
- [[15_智能体/07_Agent_Evaluation/Multi_Agent_Evaluation_2026]] — Multi-Agent System Evaluation Framework 2026 (共享: agent-framework, ai-agents, langgraph, model-evaluation, pro)
- [[治理/agent-evaluation-model-evaluation|Agent 评估 × 模型评估]] — 从指标到行为的评估范式迁移
