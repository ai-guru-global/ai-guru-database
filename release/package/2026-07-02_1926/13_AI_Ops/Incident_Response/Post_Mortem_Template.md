---
title: "AI Incident Post-Mortem Template"
tags: [ai-ops, incident-response, post-mortem, sre, production]
status: complete
last_updated: 2026-07-02
sources: []
---

# AI Incident Post-Mortem Template

## Purpose

A blameless post-mortem documents what happened during an incident, why, how it was resolved, and what actions will prevent recurrence. This template is adapted for AI/ML-specific incidents.

---

## Post-Mortem Report

### Incident Summary

| Field | Value |
|-------|-------|
| **Incident ID** | INC-YYYY-NNNN |
| **Severity** | SEV1 / SEV2 / SEV3 |
| **Duration** | X hours Y minutes |
| **Impact** | Brief description of user/business impact |
| **Detection** | How was the incident detected? |
| **Responders** | Names and roles |

### Timeline

| Time (UTC) | Event |
|------------|-------|
| T+0min | Incident began (first bad request / metric spike) |
| T+Xmin | Alert fired / user reported |
| T+Xmin | On-call engineer acknowledged |
| T+Xmin | Root cause identified |
| T+Xmin | Mitigation applied |
| T+Xmin | Full resolution / all-clear |

### Impact Analysis

| Dimension | Details |
|-----------|---------|
| **Users affected** | Number / percentage |
| **Duration** | Total downtime / degraded period |
| **Revenue impact** | Estimated $ if applicable |
| **Data impact** | Any data loss or corruption? |
| **SLA breach** | Which SLO was violated? |

### Root Cause Analysis

#### 5 Whys

1. **Why** did the incident happen?
   - Answer
2. **Why** did [answer to #1]?
   - Answer
3. **Why** did [answer to #2]?
   - Answer
4. **Why** did [answer to #3]?
   - Answer
5. **Why** did [answer to #4]?
   - Root cause

#### Contributing Factors

- [ ] Data quality issue
- [ ] Model drift / degradation
- [ ] Infrastructure failure
- [ ] Deployment/pipeline error
- [ ] Configuration change
- [ ] Dependency failure
- [ ] Capacity exhaustion
- [ ] Security incident

### AI-Specific Incident Categories

#### Model Quality Incident
```
Symptom: Output quality degraded (hallucinations, bias, toxicity)
Possible Causes:
├── Training data contamination
├── Distribution shift in input
├── Model version mismatch
├── Prompt template regression
├── Temperature/sampling parameter change
└── Evaluation gap (issue not caught by tests)
```

#### Inference Performance Incident
```
Symptom: Latency spike, throughput drop, timeout
Possible Causes:
├── GPU OOM (memory leak, batch size change)
├── KV cache exhaustion
├── Model loading failure
├── Traffic spike beyond capacity
├── Network bottleneck (model download, vector DB)
└── Hardware degradation (ECC errors, thermal throttling)
```

#### Data Pipeline Incident
```
Symptom: Stale features, missing data, incorrect embeddings
Possible Causes:
├── Upstream data source failure
├── Schema change without migration
├── ETL job failure
├── Data validation gap
├── Feature store inconsistency
└── Vector database corruption
```

### Resolution

| Step | Action | Result |
|------|--------|--------|
| 1 | Immediate mitigation | What stopped the bleeding? |
| 2 | Root cause fix | What addressed the root cause? |
| 3 | Verification | How was the fix confirmed? |
| 4 | Monitoring | What monitoring was added? |

### Action Items

| ID | Action | Owner | Priority | Due Date | Status |
|----|--------|-------|----------|----------|--------|
| AI-001 | Preventive action | @name | P0 | YYYY-MM-DD | Open |
| AI-002 | Detection improvement | @name | P1 | YYYY-MM-DD | Open |
| AI-003 | Process improvement | @name | P2 | YYYY-MM-DD | Open |
| AI-004 | Documentation update | @name | P2 | YYYY-MM-DD | Open |

### Lessons Learned

#### What went well?
- Point 1
- Point 2

#### What went poorly?
- Point 1
- Point 2

#### Where did we get lucky?
- Point 1
- Point 2

### Prevention Measures

#### Detection Improvements
- [ ] Add metric: [specific metric]
- [ ] Add alert: [specific threshold]
- [ ] Add logging: [specific log point]

#### Process Improvements
- [ ] Update runbook: [specific runbook]
- [ ] Add review step: [specific checkpoint]
- [ ] Improve testing: [specific test]

#### Architecture Improvements
- [ ] Add redundancy: [specific component]
- [ ] Add circuit breaker: [specific dependency]
- [ ] Add rollback: [specific deployment step]

---

## AI-Specific Post-Mortem Examples

### Example 1: LLM Hallucination Spike

```
Incident: Production chatbot started generating fabricated citations
Duration: 4 hours
Impact: 12,000 users received hallucinated responses

Root Cause: Vector database index was corrupted after a failed 
scaling operation, causing retrieval to return irrelevant chunks.
The model then hallucinated to fill the context gap.

5 Whys:
1. Why hallucinated? → Retrieved context was irrelevant
2. Why irrelevant? → Vector DB returned wrong results
3. Why wrong results? → Index corrupted during scaling
4. Why corrupted? → No graceful shutdown during rebalancing
5. Why no graceful shutdown? → Missing pre-stop hook in K8s

Action Items:
- Add health check for vector DB relevance (not just availability)
- Add pre-stop hook for vector DB pods
- Implement retrieval quality monitoring
- Add citation verification in post-processing
```

### Example 2: Training Job Cascade Failure

```
Incident: All GPU training jobs failed simultaneously
Duration: 6 hours
Impact: 2 days of training progress lost

Root Cause: Shared NFS storage ran out of inodes due to 
excessive checkpoint files from an unconfigured auto-checkpoint 
script, causing all jobs to fail on write.

5 Whys:
1. Why jobs failed? → NFS write error
2. Why NFS error? → Out of inodes
3. Why out of inodes? → Too many checkpoint files
4. Why too many files? → Auto-checkpoint every 10 minutes, no cleanup
5. Why no cleanup? → Missing retention policy in checkpoint script

Action Items:
- Add inode monitoring to NFS alerts
- Implement checkpoint retention policy (keep last 5)
- Move checkpoints to object storage (S3/OSS)
- Add disk quota per namespace
```

## Blameless Culture Principles

1. **Assume positive intent** — everyone did their best with the information they had
2. **Focus on systems** — ask "what allowed this to happen?" not "who caused this?"
3. **Document facts** — timeline, actions, observations; avoid speculation
4. **Share widely** — post-mortems are learning opportunities for the entire org
5. **Follow through** — action items without owners and dates are meaningless

## Related Topics

- [[AI_Incident_Response_Framework]]: Incident response process
- [[SRE_for_AI_Systems]]: SRE practices for AI
- [[LLM_Inference_SLO_Guide]]: SLO definition
- Observability: Monitoring and alerting
