---
title: Implementation Guide
category: 15-agent-production-agent-evaluation-implementation
tags: ["ai-agents", "agent-framework", "production", "langgraph"]
summary: "> Practical guide for deploying the agent evaluation framework"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Implementation Guide"
  - Implementation_Guide
sources: []

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# Implementation Guide

> Practical guide for deploying the agent evaluation framework

## Overview

This document provides step-by-step instructions for implementing the agent evaluation framework in your environment, including infrastructure setup, tool configuration, and integration with existing DevOps pipelines.

---

## 1. Infrastructure Requirements

### 1.1 Minimum Requirements

```yaml
infrastructure_requirements:
  compute:
    evaluation_controller:
      cpu: "4 vCPU"
      memory: "16 GB"
      storage: "100 GB SSD"
      
    test_runners:
      count: "2-4 nodes"
      cpu_per_node: "8 vCPU"
      memory_per_node: "32 GB"
      
  networking:
    internal_bandwidth: "1 Gbps"
    external_access: "As needed for agent APIs"
    
  storage:
    metrics_database: "500 GB (time-series optimized)"
    logs: "200 GB"
    artifacts: "100 GB"
```

### 1.2 Recommended Production Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                 RECOMMENDED ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                 KUBERNETES CLUSTER                       │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│   │  │ Evaluation  │  │   Test      │  │   Test      │     │   │
│   │  │ Controller  │  │  Runner 1   │  │  Runner 2   │     │   │
│   │  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│   │         │                │                │              │   │
│   │         └────────────────┼────────────────┘              │   │
│   │                          │                               │   │
│   │  ┌─────────────────────────────────────────────────┐    │   │
│   │  │              MONITORING STACK                    │    │   │
│   │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │    │   │
│   │  │  │Prometheus│ │ Grafana  │ │  Jaeger  │        │    │   │
│   │  │  └──────────┘ └──────────┘ └──────────┘        │    │   │
│   │  └─────────────────────────────────────────────────┘    │   │
│   │                                                          │   │
│   │  ┌─────────────────────────────────────────────────┐    │   │
│   │  │              DATA LAYER                          │    │   │
│   │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │    │   │
│   │  │  │TimescaleDB│ │  Redis   │ │   S3     │        │    │   │
│   │  │  └──────────┘ └──────────┘ └──────────┘        │    │   │
│   │  └─────────────────────────────────────────────────┘    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   External Services:                                            │
│   • Agent APIs (under evaluation)                               │
│   • LLM Judge API (for automated evaluation)                    │
│   • Notification services (Slack, PagerDuty)                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Tool and Dependency Setup

### 2.1 Core Dependencies

```yaml
# requirements.txt / dependencies
dependencies:
  python:
    version: ">=3.10"
    packages:
      - pytest>=7.0.0
      - pytest-asyncio>=0.21.0
      - httpx>=0.24.0
      - pydantic>=2.0.0
      - numpy>=1.24.0
      - scipy>=1.10.0
      - pandas>=2.0.0
      - prometheus-client>=0.16.0
      
  infrastructure:
    - docker>=24.0
    - kubernetes>=1.27
    - helm>=3.12
    
  monitoring:
    - prometheus>=2.45
    - grafana>=10.0
    - jaeger>=1.45
```

### 2.2 Installation Script

```bash
#!/bin/bash
# setup_evaluation_framework.sh
# Sets up the agent evaluation framework

set -e

echo "=== Agent Evaluation Framework Setup ==="

# 1. Check prerequisites
echo "Checking prerequisites..."
command -v docker >/dev/null 2>&1 || { echo "Docker required"; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "kubectl required"; exit 1; }
command -v helm >/dev/null 2>&1 || { echo "Helm required"; exit 1; }

# 2. Create namespace
echo "Creating Kubernetes namespace..."
kubectl create namespace agent-evaluation --dry-run=client -o yaml | kubectl apply -f -

# 3. Install monitoring stack
echo "Installing monitoring stack..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
    --namespace agent-evaluation \
    --set prometheus.prometheusSpec.retention=30d

# 4. Install Jaeger for tracing
echo "Installing Jaeger..."
kubectl apply -f https://raw.githubusercontent.com/jaegertracing/jaeger-operator/main/deploy/crds/jaegertracing.io_jaegers_crd.yaml
kubectl apply -n agent-evaluation -f - <<EOF
apiVersion: jaegertracing.io/v1
kind: Jaeger
metadata:
  name: agent-eval-jaeger
spec:
  strategy: production
  storage:
    type: elasticsearch
EOF

# 5. Install TimescaleDB for metrics storage
echo "Installing TimescaleDB..."
helm upgrade --install timescaledb timescale/timescaledb-single \
    --namespace agent-evaluation \
    --set replicaCount=2 \
    --set persistentVolumes.data.size=100Gi

# 6. Deploy evaluation controller
echo "Deploying evaluation controller..."
kubectl apply -n agent-evaluation -f ./k8s/evaluation-controller.yaml

# 7. Verify installation
echo "Verifying installation..."
kubectl wait --for=condition=ready pod -l app=evaluation-controller \
    --namespace agent-evaluation --timeout=300s

echo "=== Setup Complete ==="
echo "Access Grafana: kubectl port-forward svc/prometheus-grafana 3000:80 -n agent-evaluation"
echo "Access Jaeger: kubectl port-forward svc/agent-eval-jaeger-query 16686:16686 -n agent-evaluation"
```

### 2.3 Docker Compose Alternative

```yaml
# docker-compose.yml
# Simplified setup for development/small deployments

version: '3.8'

services:
  evaluation-controller:
    build: ./evaluation-controller
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@timescaledb:5432/evaluation
      - REDIS_URL=redis://redis:6379
      - PROMETHEUS_URL=http://prometheus:9090
    depends_on:
      - timescaledb
      - redis
      - prometheus

  test-runner:
    build: ./test-runner
    deploy:
      replicas: 2
    environment:
      - CONTROLLER_URL=http://evaluation-controller:8080
    depends_on:
      - evaluation-controller

  timescaledb:
    image: timescale/timescaledb:latest-pg15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=evaluation
    volumes:
      - timescale-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  prometheus:
    image: prom/prometheus:v2.45.0
    ports:
      - "9090:9090"
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus

  grafana:
    image: grafana/grafana:10.0.0
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - ./config/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - grafana-data:/var/lib/grafana

volumes:
  timescale-data:
  prometheus-data:
  grafana-data:
```

---

## 3. Integration with DevOps Pipelines

### 3.1 GitHub Actions Integration

```yaml
# .github/workflows/agent-evaluation.yml
name: Agent Evaluation Pipeline

on:
  workflow_dispatch:
    inputs:
      agent_id:
        description: 'Agent ID to evaluate'
        required: true
      evaluation_type:
        description: 'Evaluation type'
        required: true
        default: 'standard'
        type: choice
        options:
          - quick
          - standard
          - comprehensive
  schedule:
    # Weekly comprehensive evaluation
    - cron: '0 2 * * 0'

env:
  EVALUATION_ENDPOINT: ${{ secrets.EVALUATION_ENDPOINT }}
  AGENT_API_KEY: ${{ secrets.AGENT_API_KEY }}

jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      evaluation_id: ${{ steps.init.outputs.evaluation_id }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Initialize Evaluation
        id: init
        run: |
          EVAL_ID=$(curl -s -X POST "${EVALUATION_ENDPOINT}/api/v1/evaluations" \
            -H "Authorization: Bearer ${{ secrets.EVAL_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{
              "agent_id": "${{ inputs.agent_id }}",
              "type": "${{ inputs.evaluation_type }}",
              "triggered_by": "github_actions"
            }' | jq -r '.evaluation_id')
          echo "evaluation_id=$EVAL_ID" >> $GITHUB_OUTPUT
          
  run-tests:
    needs: prepare
    runs-on: ubuntu-latest
    strategy:
      matrix:
        test_suite:
          - core_functionality
          - edge_cases
          - safety
          - performance
    steps:
      - name: Run Test Suite
        run: |
          curl -X POST "${EVALUATION_ENDPOINT}/api/v1/evaluations/${{ needs.prepare.outputs.evaluation_id }}/run" \
            -H "Authorization: Bearer ${{ secrets.EVAL_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{
              "test_suite": "${{ matrix.test_suite }}"
            }'
            
      - name: Wait for Completion
        run: |
          while true; do
            STATUS=$(curl -s "${EVALUATION_ENDPOINT}/api/v1/evaluations/${{ needs.prepare.outputs.evaluation_id }}/status" \
              -H "Authorization: Bearer ${{ secrets.EVAL_API_KEY }}" | jq -r '.status')
            if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ]; then
              break
            fi
            sleep 30
          done
          
  analyze:
    needs: [prepare, run-tests]
    runs-on: ubuntu-latest
    steps:
      - name: Generate Report
        run: |
          curl -X POST "${EVALUATION_ENDPOINT}/api/v1/evaluations/${{ needs.prepare.outputs.evaluation_id }}/report" \
            -H "Authorization: Bearer ${{ secrets.EVAL_API_KEY }}" \
            -o evaluation_report.pdf
            
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: evaluation-report
          path: evaluation_report.pdf
          
      - name: Check Pass/Fail
        run: |
          RESULT=$(curl -s "${EVALUATION_ENDPOINT}/api/v1/evaluations/${{ needs.prepare.outputs.evaluation_id }}/result" \
            -H "Authorization: Bearer ${{ secrets.EVAL_API_KEY }}")
          SCORE=$(echo $RESULT | jq -r '.composite_score')
          GRADE=$(echo $RESULT | jq -r '.grade')
          
          echo "Evaluation Score: $SCORE"
          echo "Grade: $GRADE"
          
          if [ "$GRADE" = "F" ] || [ "$GRADE" = "D" ]; then
            echo "::error::Evaluation failed with grade $GRADE"
            exit 1
          fi
          
      - name: Notify Slack
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Agent Evaluation Complete",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Agent Evaluation Results*\nAgent: ${{ inputs.agent_id }}\nStatus: ${{ job.status }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### 3.2 GitLab CI Integration

```yaml
# .gitlab-ci.yml
stages:
  - prepare
  - test
  - analyze
  - report

variables:
  EVALUATION_ENDPOINT: ${EVALUATION_ENDPOINT}

prepare_evaluation:
  stage: prepare
  script:
    - |
      EVAL_ID=$(curl -s -X POST "${EVALUATION_ENDPOINT}/api/v1/evaluations" \
        -H "Authorization: Bearer ${EVAL_API_KEY}" \
        -H "Content-Type: application/json" \
        -d "{\"agent_id\": \"${AGENT_ID}\", \"type\": \"${EVAL_TYPE:-standard}\"}" \
        | jq -r '.evaluation_id')
      echo "EVALUATION_ID=${EVAL_ID}" >> prepare.env
  artifacts:
    reports:
      dotenv: prepare.env

run_tests:
  stage: test
  parallel:
    matrix:
      - TEST_SUITE: [core_functionality, edge_cases, safety, performance]
  script:
    - |
      curl -X POST "${EVALUATION_ENDPOINT}/api/v1/evaluations/${EVALUATION_ID}/run" \
        -H "Authorization: Bearer ${EVAL_API_KEY}" \
        -H "Content-Type: application/json" \
        -d "{\"test_suite\": \"${TEST_SUITE}\"}"
  needs:
    - prepare_evaluation

analyze_results:
  stage: analyze
  script:
    - |
      curl -s "${EVALUATION_ENDPOINT}/api/v1/evaluations/${EVALUATION_ID}/result" \
        -H "Authorization: Bearer ${EVAL_API_KEY}" > result.json
      cat result.json | jq .
  artifacts:
    paths:
      - result.json
  needs:
    - run_tests

generate_report:
  stage: report
  script:
    - |
      curl -X POST "${EVALUATION_ENDPOINT}/api/v1/evaluations/${EVALUATION_ID}/report" \
        -H "Authorization: Bearer ${EVAL_API_KEY}" \
        -o evaluation_report.pdf
  artifacts:
    paths:
      - evaluation_report.pdf
  needs:
    - analyze_results
```

### 3.3 Jenkins Pipeline Integration

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    parameters {
        string(name: 'AGENT_ID', description: 'Agent ID to evaluate')
        choice(name: 'EVAL_TYPE', choices: ['quick', 'standard', 'comprehensive'], description: 'Evaluation type')
    }
    
    environment {
        EVALUATION_ENDPOINT = credentials('evaluation-endpoint')
        EVAL_API_KEY = credentials('eval-api-key')
    }
    
    stages {
        stage('Initialize') {
            steps {
                script {
                    def response = httpRequest(
                        url: "${EVALUATION_ENDPOINT}/api/v1/evaluations",
                        httpMode: 'POST',
                        contentType: 'APPLICATION_JSON',
                        customHeaders: ``[ [name: 'Authorization', value: "Bearer ${EVAL_API_KEY}"] ]``,
                        requestBody: """{"agent_id": "${params.AGENT_ID}", "type": "${params.EVAL_TYPE}"}"""
                    )
                    def json = readJSON text: response.content
                    env.EVALUATION_ID = json.evaluation_id
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Core Tests') {
                    steps {
                        runTestSuite('core_functionality')
                    }
                }
                stage('Edge Cases') {
                    steps {
                        runTestSuite('edge_cases')
                    }
                }
                stage('Safety Tests') {
                    steps {
                        runTestSuite('safety')
                    }
                }
                stage('Performance') {
                    steps {
                        runTestSuite('performance')
                    }
                }
            }
        }
        
        stage('Analyze') {
            steps {
                script {
                    def response = httpRequest(
                        url: "${EVALUATION_ENDPOINT}/api/v1/evaluations/${EVALUATION_ID}/result",
                        customHeaders: ``[ [name: 'Authorization', value: "Bearer ${EVAL_API_KEY}"] ]``
                    )
                    def result = readJSON text: response.content
                    
                    echo "Composite Score: ${result.composite_score}"
                    echo "Grade: ${result.grade}"
                    
                    if (result.grade in ['F', 'D']) {
                        error("Evaluation failed with grade ${result.grade}")
                    }
                }
            }
        }
        
        stage('Report') {
            steps {
                httpRequest(
                    url: "${EVALUATION_ENDPOINT}/api/v1/evaluations/${EVALUATION_ID}/report",
                    customHeaders: ``[ [name: 'Authorization', value: "Bearer ${EVAL_API_KEY}"] ]``,
                    outputFile: 'evaluation_report.pdf'
                )
                archiveArtifacts artifacts: 'evaluation_report.pdf'
            }
        }
    }
    
    post {
        always {
            slackSend(
                channel: '#agent-evaluations',
                message: "Agent Evaluation: ${params.AGENT_ID} - ${currentBuild.result}"
            )
        }
    }
}

def runTestSuite(String suite) {
    httpRequest(
        url: "${EVALUATION_ENDPOINT}/api/v1/evaluations/${EVALUATION_ID}/run",
        httpMode: 'POST',
        contentType: 'APPLICATION_JSON',
        customHeaders: ``[ [name: 'Authorization', value: "Bearer ${EVAL_API_KEY}"] ]``,
        requestBody: """{"test_suite": "${suite}"}"""
    )
}
```

---

## 4. Automation Scripts

### 4.1 Evaluation Runner Script

```python
#!/usr/bin/env python3
"""
Agent Evaluation Runner
Orchestrates evaluation execution and reporting.
"""

import argparse
import asyncio
import json
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import List, Optional

import httpx


@dataclass
class EvaluationConfig:
    """Evaluation configuration."""
    agent_id: str
    agent_endpoint: str
    evaluation_type: str = "standard"
    test_suites: List[str] = None
    output_dir: Path = Path("./results")
    
    def __post_init__(self):
        if self.test_suites is None:
            if self.evaluation_type == "quick":
                self.test_suites = ["core_functionality", "safety"]
            elif self.evaluation_type == "comprehensive":
                self.test_suites = [
                    "core_functionality", "edge_cases", "safety",
                    "performance", "stress", "domain_specific"
                ]
            else:
                self.test_suites = [
                    "core_functionality", "edge_cases", "safety", "performance"
                ]


class EvaluationRunner:
    """
    Runs agent evaluations.
    
    Usage:
        runner = EvaluationRunner(config)
        await runner.run()
    """
    
    def __init__(self, config: EvaluationConfig):
        self.config = config
        self.client = httpx.AsyncClient(timeout=300)
        self.evaluation_id: Optional[str] = None
        self.results = {}
        
    async def run(self) -> dict:
        """Execute full evaluation."""
        print(f"Starting evaluation for {self.config.agent_id}")
        
        try:
            # Initialize
            await self._initialize()
            
            # Run test suites
            for suite in self.config.test_suites:
                print(f"Running test suite: {suite}")
                result = await self._run_test_suite(suite)
                self.results[suite] = result
                
            # Analyze results
            analysis = await self._analyze()
            
            # Generate report
            report = await self._generate_report()
            
            # Save results
            self._save_results(analysis, report)
            
            return analysis
            
        finally:
            await self.client.aclose()
            
    async def _initialize(self):
        """Initialize evaluation session."""
        self.evaluation_id = f"eval-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}"
        self.config.output_dir.mkdir(parents=True, exist_ok=True)
        
    async def _run_test_suite(self, suite: str) -> dict:
        """Run a single test suite."""
        # Load test cases
        test_cases = self._load_test_cases(suite)
        
        results = []
        for test in test_cases:
            result = await self._execute_test(test)
            results.append(result)
            
        return {
            "suite": suite,
            "total": len(results),
            "passed": sum(1 for r in results if r["passed"]),
            "failed": sum(1 for r in results if not r["passed"]),
            "results": results
        }
        
    async def _execute_test(self, test: dict) -> dict:
        """Execute a single test case."""
        start_time = datetime.utcnow()
        
        try:
            # Call agent
            response = await self.client.post(
                self.config.agent_endpoint,
                json={"input": test["input"]}
            )
            response.raise_for_status()
            
            output = response.json()
            
            # Evaluate output
            passed = self._evaluate_output(test, output)
            
            return {
                "test_id": test["id"],
                "passed": passed,
                "output": output,
                "duration_ms": (datetime.utcnow() - start_time).total_seconds() * 1000
            }
            
        except Exception as e:
            return {
                "test_id": test["id"],
                "passed": False,
                "error": str(e),
                "duration_ms": (datetime.utcnow() - start_time).total_seconds() * 1000
            }
            
    def _load_test_cases(self, suite: str) -> List[dict]:
        """Load test cases for a suite."""
        # Implementation would load from test data files
        pass
        
    def _evaluate_output(self, test: dict, output: dict) -> bool:
        """Evaluate if output meets test criteria."""
        # Implementation would compare output to expected results
        pass
        
    async def _analyze(self) -> dict:
        """Analyze all results and calculate scores."""
        total_tests = sum(r["total"] for r in self.results.values())
        total_passed = sum(r["passed"] for r in self.results.values())
        
        return {
            "evaluation_id": self.evaluation_id,
            "agent_id": self.config.agent_id,
            "timestamp": datetime.utcnow().isoformat(),
            "summary": {
                "total_tests": total_tests,
                "passed": total_passed,
                "failed": total_tests - total_passed,
                "pass_rate": total_passed / total_tests * 100 if total_tests > 0 else 0
            },
            "by_suite": {
                suite: {
                    "pass_rate": r["passed"] / r["total"] * 100 if r["total"] > 0 else 0
                }
                for suite, r in self.results.items()
            }
        }
        
    async def _generate_report(self) -> str:
        """Generate evaluation report."""
        # Implementation would generate formatted report
        return json.dumps(self.results, indent=2)
        
    def _save_results(self, analysis: dict, report: str):
        """Save results to output directory."""
        output_path = self.config.output_dir / f"{self.evaluation_id}"
        output_path.mkdir(exist_ok=True)
        
        with open(output_path / "analysis.json", "w") as f:
            json.dump(analysis, f, indent=2)
            
        with open(output_path / "report.json", "w") as f:
            f.write(report)
            
        print(f"Results saved to {output_path}")


async def main():
    parser = argparse.ArgumentParser(description="Run agent evaluation")
    parser.add_argument("--agent-id", required=True, help="Agent ID")
    parser.add_argument("--endpoint", required=True, help="Agent API endpoint")
    parser.add_argument("--type", default="standard", choices=["quick", "standard", "comprehensive"])
    parser.add_argument("--output", default="./results", help="Output directory")
    
    args = parser.parse_args()
    
    config = EvaluationConfig(
        agent_id=args.agent_id,
        agent_endpoint=args.endpoint,
        evaluation_type=args.type,
        output_dir=Path(args.output)
    )
    
    runner = EvaluationRunner(config)
    results = await runner.run()
    
    # Exit with appropriate code
    if results["summary"]["pass_rate"] < 70:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    asyncio.run(main())
```

---

## 5. Monitoring Setup

### 5.1 Grafana Dashboard Configuration

```json
{
  "dashboard": {
    "title": "Agent Evaluation Dashboard",
    "panels": [
      {
        "title": "Evaluation Score Over Time",
        "type": "timeseries",
        "targets": [
          {
            "expr": "agent_evaluation_score{agent_id=\"$agent_id\"}",
            "legendFormat": "{{agent_id}}"
          }
        ]
      },
      {
        "title": "Test Pass Rate",
        "type": "gauge",
        "targets": [
          {
            "expr": "sum(agent_test_passed{agent_id=\"$agent_id\"}) / sum(agent_test_total{agent_id=\"$agent_id\"}) * 100"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "min": 0,
            "max": 100,
            "thresholds": {
              "steps": [
                {"color": "red", "value": 0},
                {"color": "yellow", "value": 70},
                {"color": "green", "value": 90}
              ]
            }
          }
        }
      },
      {
        "title": "Response Time Distribution",
        "type": "histogram",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, agent_response_time_bucket{agent_id=\"$agent_id\"})"
          }
        ]
      },
      {
        "title": "Safety Incidents",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(agent_safety_incidents_total{agent_id=\"$agent_id\"})"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "steps": [
                {"color": "green", "value": 0},
                {"color": "red", "value": 1}
              ]
            }
          }
        }
      }
    ],
    "templating": {
      "list": [
        {
          "name": "agent_id",
          "type": "query",
          "query": "label_values(agent_evaluation_score, agent_id)"
        }
      ]
    }
  }
}
```

### 5.2 Alerting Rules

```yaml
# prometheus/alerts.yml
groups:
  - name: agent_evaluation_alerts
    rules:
      - alert: AgentScoreDrop
        expr: |
          agent_evaluation_score < 70
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Agent {{ $labels.agent_id }} score dropped below 70"
          
      - alert: SafetyIncident
        expr: |
          increase(agent_safety_incidents_total[1h]) > 0
        labels:
          severity: critical
        annotations:
          summary: "Safety incident detected for {{ $labels.agent_id }}"
          
      - alert: HighErrorRate
        expr: |
          sum(rate(agent_test_failed[5m])) / sum(rate(agent_test_total[5m])) > 0.1
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High error rate for {{ $labels.agent_id }}"
```

---

## 6. Quick Start Checklist

```
IMPLEMENTATION QUICK START CHECKLIST
═══════════════════════════════════════════════════════════════════

□ 1. INFRASTRUCTURE
     □ Provision compute resources (controller + runners)
     □ Set up Kubernetes namespace (or Docker Compose)
     □ Deploy monitoring stack (Prometheus, Grafana)
     □ Configure storage (TimescaleDB, S3)

□ 2. CONFIGURATION
     □ Copy and customize config templates
     □ Set up API credentials for agents
     □ Configure notification channels
     □ Set up alerting rules

□ 3. TEST DATA
     □ Prepare test cases for each suite
     □ Set up test data storage
     □ Validate test data format

□ 4. INTEGRATION
     □ Configure CI/CD pipeline integration
     □ Set up webhook endpoints
     □ Test end-to-end flow

□ 5. VALIDATION
     □ Run smoke test evaluation
     □ Verify metrics collection
     □ Test alerting
     □ Validate report generation

□ 6. DOCUMENTATION
     □ Document environment-specific configs
     □ Create runbooks for common issues
     □ Train team on usage

Ready to evaluate! Start with: ./run_evaluation.py --agent-id <id> --type quick
```

---

## 7. Agent Harness 基础设施与实现

> **核心目标**: 构建企业级Agent Harness基础设施，支持从开发到生产的全流程测试与评估。

### 7.1 Harness 基础设施架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   AGENT HARNESS 基础设施架构                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     KUBERNETES CLUSTER                           │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │   │
│   │  │  Harness    │  │   Agent     │  │  Monitor    │             │   │
│   │  │  Controller │  │   Sandbox   │  │  & Logs     │             │   │
│   │  │  (API + UI) │  │  (隔离运行)  │  │  (可观测性)  │             │   │
│   │  └─────────────┘  └─────────────┘  └─────────────┘             │   │
│   │         │               │               │                      │   │
│   │         └───────────────┼───────────────┘                      │   │
│   │                         │                                       │   │
│   │  ┌──────────────────────┴────────────────────────┐             │   │
│   │  │              NETWORK POLICIES                  │             │   │
│   │  │  • 命名空间隔离  • 网络策略  • 出口控制          │             │   │
│   │  └────────────────────────────────────────────────┘             │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      DATA LAYER                                  │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │   │
│   │  │ TimescaleDB │  │    Redis    │  │  Object     │             │   │
│   │  │  (Metrics)  │  │  (Session)  │  │  Storage    │             │   │
│   │  └─────────────┘  └─────────────┘  └─────────────┘             │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 容器化沙箱环境

#### 7.2.1 Dockerfile 模板

```dockerfile
# Dockerfile.agent-sandbox
# Agent沙箱基础镜像

FROM python:3.11-slim

# 安全：创建非root用户
RUN groupadd -r agentuser && useradd -r -g agentuser agentuser

# 安装基础工具
RUN apt-get update && apt-get install -y \
    git \
    curl \
    jq \
    && rm -rf /var/lib/apt/lists/*  # ⚠️ HIGH-RISK — 递归强制删除，不可逆 [回滚：见文档/备份]

# 安装Python依赖
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# 创建工作目录
WORKDIR /workspace
RUN chown agentuser:agentuser /workspace

# 安全：限制权限
USER agentuser

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD python -c "print('healthy')" || exit 1

# 默认命令
CMD ["python", "-c", "while True: import time; time.sleep(60)"]
```

#### 7.2.2 Kubernetes 部署配置

```yaml
# k8s/harness-sandbox.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agent-sandbox-pool
  namespace: agent-harness
spec:
  replicas: 5
  selector:
    matchLabels:
      app: agent-sandbox
  template:
    metadata:
      labels:
        app: agent-sandbox
    spec:
      securityContext:
        runAsNonRoot: true
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: sandbox
        image: agent-sandbox:latest
        resources:
          limits:
            cpu: "1"
            memory: "2Gi"
          requests:
            cpu: "500m"
            memory: "1Gi"
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: workspace
          mountPath: /workspace
      volumes:
      - name: tmp
        emptyDir: {}
      - name: workspace
        emptyDir:
          sizeLimit: 500Mi
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: sandbox-network-policy
  namespace: agent-harness
spec:
  podSelector:
    matchLabels:
      app: agent-sandbox
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: harness-controller
    ports:
    - protocol: TCP
      port: 8080
  egress:
  # 仅允许访问特定外部服务
  - to:
    - namespaceSelector:
        matchLabels:
          name: agent-harness
  - to:
    - ipBlock:
        cidr: 8.8.8.8/32  # 允许DNS
    ports:
    - protocol: UDP
      port: 53
```

### 7.3 Harness 配置管理

#### 7.3.1 分层配置结构

```yaml
# config/harness-config.yaml
harness:
  version: "2.0.0"
  
  # 全局配置
  global:
    environment: "production"
    log_level: "INFO"
    metrics_enabled: true
    
  # 沙箱配置
  sandbox:
    type: "kubernetes"
    namespace: "agent-harness"
    image: "agent-sandbox:latest"
    resources:
      cpu_limit: "1"
      memory_limit: "2Gi"
      storage_limit: "5Gi"
    network:
      mode: "restricted"
      allowed_hosts:
        - "api.openai.com"
        - "api.anthropic.com"
      blocked_hosts:
        - "*.internal.company.com"
    security:
      run_as_non_root: true
      read_only_root_fs: true
      seccomp_profile: "RuntimeDefault"
      
  # 评估配置
  evaluation:
    models:
      judge_model: "gpt-4"
      fallback_model: "gpt-3.5-turbo"
    criteria:
      accuracy:
        weight: 0.3
        threshold: 0.8
      efficiency:
        weight: 0.2
        threshold: 0.7
      safety:
        weight: 0.3
        threshold: 0.95
      helpfulness:
        weight: 0.2
        threshold: 0.75
        
  # 测试套件配置
  test_suites:
    devops:
      path: "./suites/devops.yaml"
      timeout: 300
      parallel: 4
    code_generation:
      path: "./suites/code_generation.yaml"
      timeout: 180
      parallel: 2
    safety:
      path: "./suites/safety.yaml"
      timeout: 120
      parallel: 1  # 串行执行
      
  # 监控配置
  monitoring:
    tracing:
      enabled: true
      backend: "jaeger"
      sample_rate: 1.0
    metrics:
      enabled: true
      backend: "prometheus"
      push_interval: 30
    alerting:
      enabled: true
      channels:
        - type: "slack"
          webhook: "${SLACK_WEBHOOK_URL}"
        - type: "pagerduty"
          key: "${PAGERDUTY_KEY}"
```

#### 7.3.2 环境特定配置覆盖

```python
# harness/config_loader.py
"""
分层配置加载器
支持：默认值 -> 环境配置 -> 本地覆盖
"""

from pathlib import Path
from typing import Dict, Any
import yaml
import os

class HarnessConfigLoader:
    """Harness配置加载器"""
    
    def __init__(self, config_dir: str = "./config"):
        self.config_dir = Path(config_dir)
        self.env = os.getenv("HARNESS_ENV", "development")
        
    def load(self) -> Dict[str, Any]:
        """加载完整配置"""
        # 1. 加载默认配置
        config = self._load_yaml(self.config_dir / "harness-config.yaml")
        
        # 2. 加载环境特定配置
        env_config_path = self.config_dir / f"harness-config.{self.env}.yaml"
        if env_config_path.exists():
            env_config = self._load_yaml(env_config_path)
            config = self._deep_merge(config, env_config)
            
        # 3. 加载本地覆盖（gitignored）
        local_config_path = self.config_dir / "harness-config.local.yaml"
        if local_config_path.exists():
            local_config = self._load_yaml(local_config_path)
            config = self._deep_merge(config, local_config)
            
        # 4. 应用环境变量覆盖
        config = self._apply_env_overrides(config)
        
        return config
        
    def _load_yaml(self, path: Path) -> Dict:
        """加载YAML文件"""
        with open(path, 'r') as f:
            return yaml.safe_load(f)
            
    def _deep_merge(self, base: Dict, override: Dict) -> Dict:
        """深度合并配置"""
        result = base.copy()
        for key, value in override.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = self._deep_merge(result[key], value)
            else:
                result[key] = value
        return result
        
    def _apply_env_overrides(self, config: Dict) -> Dict:
        """应用环境变量覆盖"""
        # HARNESS__SANDBOX__RESOURCES__CPU_LIMIT -> config['sandbox']['resources']['cpu_limit']
        for key, value in os.environ.items():
            if key.startswith("HARNESS__"):
                path = key.replace("HARNESS__", "").lower().split("__")
                self._set_nested_value(config, path, value)
        return config
        
    def _set_nested_value(self, config: Dict, path: list, value: Any):
        """设置嵌套值"""
        for key in path[:-1]:
            config = config.setdefault(key, {})
        config[path[-1]] = value

# 使用示例
loader = HarnessConfigLoader()
config = loader.load()
print(f"Sandbox image: {config['sandbox']['image']}")
print(f"Judge model: {config['evaluation']['models']['judge_model']}")
```

### 7.4 CI/CD 集成

#### 7.4.1 GitHub Actions 完整工作流

```yaml
# .github/workflows/agent-harness.yml
name: Agent Harness Evaluation

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1'  # 每周一凌晨2点
  workflow_dispatch:
    inputs:
      agent_id:
        description: 'Agent ID to evaluate'
        required: true
      evaluation_type:
        description: 'Evaluation type'
        type: choice
        options:
          - quick
          - standard
          - comprehensive
        default: 'standard'
      test_suites:
        description: 'Test suites to run (comma-separated)'
        default: 'devops,code_generation,safety'

env:
  HARNESS_VERSION: "2.0.0"
  KUBECONFIG: ${{ secrets.KUBECONFIG }}

jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      harness_id: ${{ steps.init.outputs.harness_id }}
      config_hash: ${{ steps.config.outputs.hash }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Harness CLI
        run: |
          curl -sSL https://install.agent-harness.io | bash
          harness --version
          
      - name: Initialize Harness Environment
        id: init
        run: |
          HARNESS_ID=$(harness env create \
            --name "ci-${{ github.run_id }}" \
            --config ./config/harness-config.ci.yaml \
            --output json | jq -r '.id')
          echo "harness_id=$HARNESS_ID" >> $GITHUB_OUTPUT
          
      - name: Cache Configuration Hash
        id: config
        run: |
          HASH=$(find ./config -type f -exec md5sum {} \; | sort | md5sum | cut -d' ' -f1)
          echo "hash=$HASH" >> $GITHUB_OUTPUT

  build-sandbox:
    runs-on: ubuntu-latest
    needs: setup
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Cache Docker layers
        uses: actions/cache@v3
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ needs.setup.outputs.config_hash }}
          restore-keys: |
            ${{ runner.os }}-buildx-
            
      - name: Build Sandbox Image
        run: |
          docker buildx build \
            --file ./sandbox/Dockerfile.agent-sandbox \
            --tag agent-sandbox:${{ github.sha }} \
            --tag agent-sandbox:latest \
            --cache-from type=local,src=/tmp/.buildx-cache \
            --cache-to type=local,dest=/tmp/.buildx-cache-new,mode=max \
            --load \
            ./sandbox
            
      - name: Push to Registry
        run: |
          echo "${{ secrets.REGISTRY_PASSWORD }}" | docker login \
            ${{ secrets.REGISTRY_URL }} -u ${{ secrets.REGISTRY_USER }} --password-stdin
          docker tag agent-sandbox:${{ github.sha }} \
            ${{ secrets.REGISTRY_URL }}/agent-sandbox:${{ github.sha }}
          docker push ${{ secrets.REGISTRY_URL }}/agent-sandbox:${{ github.sha }}

  run-tests:
    runs-on: ubuntu-latest
    needs: [setup, build-sandbox]
    strategy:
      matrix:
        test_suite: ${{ fromJson(format('[{0}]', inputs.test_suites || 'devops,code_generation,safety')) }}
      fail-fast: false
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Harness CLI
        run: |
          curl -sSL https://install.agent-harness.io | bash
          
      - name: Configure Kubernetes
        run: |
          echo "${{ secrets.KUBECONFIG }}" | base64 -d > ~/.kube/config
          kubectl config use-context ci-cluster
          
      - name: Run Test Suite
        id: run_tests
        run: |
          harness test run \
            --env-id ${{ needs.setup.outputs.harness_id }} \
            --suite ${{ matrix.test_suite }} \
            --agent-id "${{ inputs.agent_id || github.sha }}" \
            --parallel 4 \
            --output junit \
            --output-file ./results/${{ matrix.test_suite }}.xml
            
      - name: Upload Test Results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results-${{ matrix.test_suite }}
          path: ./results/${{ matrix.test_suite }}.xml
          
      - name: Upload Traces
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: traces-${{ matrix.test_suite }}
          path: ./traces/

  safety-scan:
    runs-on: ubuntu-latest
    needs: setup
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Safety Scan
        run: |
          harness security scan \
            --env-id ${{ needs.setup.outputs.harness_id }} \
            --agent-id "${{ inputs.agent_id || github.sha }}" \
            --suite full \
            --output sarif \
            --output-file ./safety-results.sarif
            
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: ./safety-results.sarif

  analyze:
    runs-on: ubuntu-latest
    needs: [run-tests, safety-scan]
    if: always()
    steps:
      - uses: actions/checkout@v4
      
      - name: Download All Results
        uses: actions/download-artifact@v4
        with:
          path: ./results
          pattern: test-results-*
          
      - name: Generate Report
        run: |
          harness report generate \
            --results ./results/ \
            --template comprehensive \
            --output ./evaluation-report.html
            
      - name: Publish Report
        uses: actions/upload-artifact@v4
        with:
          name: evaluation-report
          path: ./evaluation-report.html
          
      - name: Post to PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const summary = fs.readFileSync('./summary.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: summary
            });

  cleanup:
    runs-on: ubuntu-latest
    needs: [run-tests, safety-scan, analyze]
    if: always()
    steps:
      - name: Cleanup Harness Environment
        run: |
          harness env delete --id ${{ needs.setup.outputs.harness_id }} --force
```

### 7.5 监控与可观测性

#### 7.5.1 OpenTelemetry 集成

```python
# harness/telemetry.py
"""
Agent Harness 遥测系统
集成 OpenTelemetry 实现全链路追踪
"""

from opentelemetry import trace, metrics
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.prometheus import PrometheusMetricReader
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from functools import wraps
import time

class HarnessTelemetry:
    """Harness遥测管理器"""
    
    def __init__(self, config: dict):
        self.config = config
        self.resource = Resource.create({
            "service.name": "agent-harness",
            "service.version": config.get("version", "2.0.0"),
            "deployment.environment": config.get("environment", "production")
        })
        
        # 初始化Tracer
        self._setup_tracing()
        
        # 初始化Metrics
        self._setup_metrics()
        
        # 自动埋点
        RequestsInstrumentor().instrument()
        
    def _setup_tracing(self):
        """配置分布式追踪"""
        provider = TracerProvider(resource=self.resource)
        
        # OTLP导出到Jaeger
        otlp_exporter = OTLPSpanExporter(
            endpoint=self.config.get("jaeger_endpoint", "http://jaeger:4317"),
            insecure=True
        )
        
        provider.add_span_processor(
            BatchSpanProcessor(otlp_exporter)
        )
        
        trace.set_tracer_provider(provider)
        self.tracer = trace.get_tracer(__name__)
        
    def _setup_metrics(self):
        """配置指标收集"""
        reader = PrometheusMetricReader()
        provider = MeterProvider(resource=self.resource, metric_readers=[reader])
        metrics.set_meter_provider(provider)
        self.meter = metrics.get_meter(__name__)
        
        # 定义指标
        self.test_counter = self.meter.create_counter(
            "harness.tests.total",
            description="Total number of tests run"
        )
        
        self.test_duration = self.meter.create_histogram(
            "harness.tests.duration",
            description="Test execution duration",
            unit="s"
        )
        
        self.token_usage = self.meter.create_histogram(
            "harness.tokens.used",
            description="Token usage per test",
            unit="1"
        )
        
        self.safety_score = self.meter.create_gauge(
            "harness.safety.score",
            description="Current safety score"
        )
        
    def trace_test(self, func):
        """测试方法追踪装饰器"""
        @wraps(func)
        def wrapper(*args, **kwargs):
            with self.tracer.start_as_current_span(
                f"test.{func.__name__}",
                attributes={
                    "test.function": func.__name__,
                    "test.module": func.__module__
                }
            ) as span:
                start_time = time.time()
                try:
                    result = func(*args, **kwargs)
                    span.set_attribute("test.status", "passed")
                    return result
                except Exception as e:
                    span.set_attribute("test.status", "failed")
                    span.set_attribute("test.error", str(e))
                    span.record_exception(e)
                    raise
                finally:
                    duration = time.time() - start_time
                    self.test_duration.record(duration)
                    span.set_attribute("test.duration_ms", duration * 1000)
        return wrapper
        
    def record_test_result(self, test_id: str, status: str, metrics: dict):
        """记录测试结果"""
        self.test_counter.add(1, {"status": status})
        
        if "token_usage" in metrics:
            self.token_usage.record(
                metrics["token_usage"],
                {"test_id": test_id}
            )
            
    def record_safety_scan(self, score: float, findings: list):
        """记录安全扫描结果"""
        self.safety_score.set(score)
        
        with self.tracer.start_as_current_span("safety.scan") as span:
            span.set_attribute("safety.score", score)
            span.set_attribute("safety.findings_count", len(findings))
            for i, finding in enumerate(findings):
                span.set_attribute(f"safety.finding.{i}.severity", finding.get("severity"))
                span.set_attribute(f"safety.finding.{i}.type", finding.get("type"))

# 使用示例
telemetry = HarnessTelemetry(config={
    "jaeger_endpoint": "http://jaeger:4317",
    "environment": "production"
})

class MyTestSuite:
    @telemetry.trace_test
    def test_code_generation(self, agent):
        result = agent.run("Generate Python code")
        telemetry.record_test_result(
            "CODE-001",
            "passed",
            {"token_usage": result["tokens"]}
        )
        return result
```

#### 7.5.2 Prometheus 指标导出

```yaml
# config/prometheus-rules.yml
groups:
  - name: agent_harness
    rules:
      - alert: HarnessTestFailureRateHigh
        expr: |
          (
            sum(rate(harness_tests_total{status="failed"}[5m]))
            /
            sum(rate(harness_tests_total[5m]))
          ) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High test failure rate in Agent Harness"
          description: "Test failure rate is above 10%"
          
      - alert: HarnessSafetyScoreDrop
        expr: |
          harness_safety_score < 0.9
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Agent safety score dropped below threshold"
          description: "Current safety score: {{ $value }}"
          
      - alert: HarnessTestDurationHigh
        expr: |
          histogram_quantile(0.95, 
            sum(rate(harness_tests_duration_bucket[5m])) by (le)
          ) > 60
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Test execution time is high"
          description: "P95 test duration is above 60s"
```

### 7.6 生产级 Agent Harness 完整实现

```python
# agent_harness/production.py
"""
生产级 Agent Harness 实现
企业级功能：多租户、RBAC、审计日志、高可用
"""

from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum
import hashlib
import json
from dataclasses import dataclass, asdict
import asyncio
from concurrent.futures import ThreadPoolExecutor

class TenantIsolation(Enum):
    NAMESPACE = "namespace"
    CLUSTER = "cluster"
    VPC = "vpc"

@dataclass
class Tenant:
    """租户定义"""
    id: str
    name: str
    isolation_level: TenantIsolation
    resource_quota: Dict
    allowed_models: List[str]
    created_at: datetime = datetime.utcnow()

@dataclass
class AuditEvent:
    """审计事件"""
    timestamp: datetime
    tenant_id: str
    user_id: str
    action: str
    resource_type: str
    resource_id: str
    status: str
    details: Dict
    ip_address: str
    user_agent: str

class MultiTenantHarness:
    """多租户Agent Harness"""
    
    def __init__(self, config: dict):
        self.config = config
        self.tenants: Dict[str, Tenant] = {}
        self.audit_logger = AuditLogger(config.get("audit_db_url"))
        self.resource_manager = ResourceManager(config)
        self.auth = RBACAuth(config.get("auth_config"))
        
    async def create_tenant(
        self,
        name: str,
        isolation: TenantIsolation,
        quota: Dict
    ) -> Tenant:
        """创建新租户"""
        tenant_id = self._generate_tenant_id(name)
        
        # 创建隔离环境
        if isolation == TenantIsolation.NAMESPACE:
            await self._create_namespace(tenant_id)
        elif isolation == TenantIsolation.CLUSTER:
            await self._provision_cluster(tenant_id)
            
        tenant = Tenant(
            id=tenant_id,
            name=name,
            isolation_level=isolation,
            resource_quota=quota,
            allowed_models=[]
        )
        
        self.tenants[tenant_id] = tenant
        
        # 审计日志
        await self.audit_logger.log(AuditEvent(
            timestamp=datetime.utcnow(),
            tenant_id=tenant_id,
            user_id="system",
            action="tenant.create",
            resource_type="tenant",
            resource_id=tenant_id,
            status="success",
            details={"name": name, "isolation": isolation.value},
            ip_address="",
            user_agent=""
        ))
        
        return tenant
        
    async def run_evaluation(
        self,
        tenant_id: str,
        agent_id: str,
        test_suite: str,
        user: dict
    ) -> dict:
        """运行评估（带权限检查）"""
        # 权限检查
        if not self.auth.check_permission(user, "evaluation:run", tenant_id):
            raise PermissionError("User does not have permission to run evaluation")
            
        tenant = self.tenants.get(tenant_id)
        if not tenant:
            raise ValueError(f"Tenant {tenant_id} not found")
            
        # 资源配额检查
        if not await self.resource_manager.check_quota(tenant_id, tenant.resource_quota):
            raise ResourceWarning("Tenant resource quota exceeded")
            
        # 创建隔离的Harness实例
        harness = await self._create_tenant_harness(tenant)
        
        # 记录开始
        eval_id = self._generate_eval_id()
        await self.audit_logger.log(AuditEvent(
            timestamp=datetime.utcnow(),
            tenant_id=tenant_id,
            user_id=user["id"],
            action="evaluation.start",
            resource_type="evaluation",
            resource_id=eval_id,
            status="started",
            details={"agent_id": agent_id, "test_suite": test_suite},
            ip_address=user.get("ip"),
            user_agent=user.get("user_agent")
        ))
        
        try:
            # 执行评估
            results = await harness.run_suite(agent_id, test_suite)
            
            # 记录完成
            await self.audit_logger.log(AuditEvent(
                timestamp=datetime.utcnow(),
                tenant_id=tenant_id,
                user_id=user["id"],
                action="evaluation.complete",
                resource_type="evaluation",
                resource_id=eval_id,
                status="success",
                details={
                    "results_summary": results["summary"],
                    "duration": results["duration"]
                },
                ip_address=user.get("ip"),
                user_agent=user.get("user_agent")
            ))
            
            return results
            
        except Exception as e:
            # 记录失败
            await self.audit_logger.log(AuditEvent(
                timestamp=datetime.utcnow(),
                tenant_id=tenant_id,
                user_id=user["id"],
                action="evaluation.failed",
                resource_type="evaluation",
                resource_id=eval_id,
                status="failed",
                details={"error": str(e)},
                ip_address=user.get("ip"),
                user_agent=user.get("user_agent")
            ))
            raise
            
    async def _create_tenant_harness(self, tenant: Tenant) -> "TenantHarness":
        """为租户创建隔离的Harness实例"""
        return TenantHarness(
            tenant=tenant,
            namespace=f"harness-{tenant.id}",
            resource_limits=tenant.resource_quota
        )
        
    def _generate_tenant_id(self, name: str) -> str:
        """生成租户ID"""
        hash_input = f"{name}-{datetime.utcnow().isoformat()}"
        return hashlib.sha256(hash_input.encode()).hexdigest()[:12]
        
    def _generate_eval_id(self) -> str:
        """生成评估ID"""
        return f"eval-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}-{hashlib.sha256(str(datetime.utcnow()).encode()).hexdigest()[:8]}"

class AuditLogger:
    """审计日志记录器"""
    
    def __init__(self, db_url: str):
        self.db_url = db_url
        self.batch_queue = []
        self.batch_size = 100
        
    async def log(self, event: AuditEvent):
        """记录审计事件"""
        self.batch_queue.append(asdict(event))
        
        if len(self.batch_queue) >= self.batch_size:
            await self._flush()
            
    async def _flush(self):
        """批量写入日志"""
        if not self.batch_queue:
            return
            
        # 写入数据库或发送到日志服务
        events = self.batch_queue[:]
        self.batch_queue = []
        
        # 异步写入
        asyncio.create_task(self._persist_events(events))
        
    async def _persist_events(self, events: List[dict]):
        """持久化事件"""
        # 实现具体的存储逻辑
        pass

# 使用示例
async def main():
    harness = MultiTenantHarness({
        "audit_db_url": "postgresql://...",
        "auth_config": {...}
    })
    
    # 创建租户
    tenant = await harness.create_tenant(
        name="Acme Corp",
        isolation=TenantIsolation.NAMESPACE,
        quota={"cpu": 10, "memory": "20Gi", "storage": "100Gi"}
    )
    
    # 运行评估
    results = await harness.run_evaluation(
        tenant_id=tenant.id,
        agent_id="agent-prod-v1",
        test_suite="comprehensive",
        user={"id": "user-123", "role": "evaluator"}
    )
    
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
```

## Related Documents

- [Config Templates](./Config_Templates.md) - Configuration file templates
- [Sample Reports](./Sample_Reports.md) - Report examples
- [Production Assessment](../Assessment/Production_Assessment.md) - Production protocols
- [Agent Harness Deep Dive](../Agent_Harness_Deep_Dive.md) - Comprehensive technical deep dive
- [LLM as Judge Templates](./LLM_as_Judge_Templates.md) - LLM 评估提示词模板（6 套评估 Prompt）
- [API Integration Guide](./API_Integration_Guide.md) - 9 大 Agent API 封装与批量调度器
- [Cloud Agent Evaluation](../Cloud_Agent_Evaluation/README.md) - 云产品 Agent CAPER 评估框架
- [Corpus Assessment](../Corpus_Assessment/README.md) - 语料库 COVR 覆盖率评估
- [[15_Agent_Production/Agent_Evaluation/Cloud_Agent_Evaluation/Cloud_Agent_Benchmark_2026.md|Cloud_Agent_Benchmark_2026]]

## Related

- [[15_Agent_Production/Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_Agent_Production/Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)
