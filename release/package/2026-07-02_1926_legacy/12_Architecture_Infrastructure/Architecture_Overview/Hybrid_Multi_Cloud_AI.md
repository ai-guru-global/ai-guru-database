---
title: "Hybrid & Multi-Cloud AI Architecture"
tags: [architecture, hybrid-cloud, multi-cloud, kubernetes, production, infrastructure]
status: complete
last_updated: 2026-07-02
---

# Hybrid & Multi-Cloud AI Architecture

## Overview

Most enterprises run AI workloads across **multiple environments**: on-premises data centers, private clouds, and public clouds. This guide covers architecture patterns for building resilient, cost-effective AI infrastructure that spans environments.

## Why Hybrid/Multi-Cloud for AI?

| Driver | Description | Example |
|--------|-------------|---------|
| **Data sovereignty** | Regulations require data residency | GDPR, China PIPL |
| **Cost optimization** | Spot/preemptible GPU pricing | AWS P4d spot vs on-demand |
| **Burst capacity** | Overflow to cloud during peak | Training jobs burst to cloud |
| **Vendor lock-in avoidance** | Multi-cloud strategy | Avoid single vendor dependency |
| **Latency** | Edge inference close to users | Regional deployment |
| **Existing investment** | On-prem GPU clusters already purchased | Leverage existing hardware |

## Architecture Patterns

### Pattern 1: Cloud Burst

```
┌─────────────────────────────────────────────┐
│  On-Premises Data Center                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ GPU Node │  │ GPU Node │  │ GPU Node │  │
│  │ (Training)│  │(Inference)│  │ (Data)   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│         │                                    │
│    ┌────┴────┐     VPN/专线                  │
│    │ Job     │ ─────────────────────┐       │
│    │Scheduler│                      │       │
│    └─────────┘                      │       │
└─────────────────────────────────────┼───────┘
                                      │
┌─────────────────────────────────────┼───────┐
│  Public Cloud (AWS/Azure/GCP)        │       │
│  ┌──────────┐  ┌──────────┐  ┌──────┴───┐  │
│  │ Burst    │  │ Burst    │  │ Object   │  │
│  │ Training │  │ Training │  │ Storage  │  │
│  │ (P4d/P5) │  │ (A100)   │  │ (S3/OSS) │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
```

### Pattern 2: Federated Training

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Region A │    │  Region B │    │  Region C │
│  On-Prem  │    │  Cloud    │    │  Edge     │
│  ┌──────┐ │    │  ┌──────┐ │    │  ┌──────┐ │
│  │Local │ │    │  │Local │ │    │  │Local │ │
│  │Train │ │    │  │Train │ │    │  │Train │ │
│  └──┬───┘ │    │  └──┬───┘ │    │  └──┬───┘ │
│     │      │    │     │      │    │     │      │
│  ┌──┴───┐ │    │  ┌──┴───┐ │    │  ┌──┴───┐ │
│  │Agg.  │ │    │  │Agg.  │ │    │  │Agg.  │ │
│  └──┬───┘ │    │  └──┬───┘ │    │  └──┬───┘ │
└─────┼──────┘    └─────┼──────┘    └─────┼──────┘
      └────────────────┼────────────────┘
                       │
              ┌────────┴────────┐
              │  Global Aggregator │
              │  (Model Merge)     │
              └───────────────────┘
```

### Pattern 3: Multi-Cloud Active-Active

```
┌─────────────────────────────────────────────────┐
│                Global Load Balancer               │
│            (Latency/Health-based routing)         │
└────────┬──────────────────┬───────────────────┘
         │                  │
┌────────┴──────┐  ┌───────┴───────┐
│   AWS Region   │  │  Azure Region  │
│  ┌───────────┐ │  │  ┌───────────┐ │
│  │ EKS + GPU │ │  │  │ AKS + GPU │ │
│  │ (Inference)│ │  │  │ (Inference)│ │
│  └───────────┘ │  │  └───────────┘ │
│  ┌───────────┐ │  │  ┌───────────┐ │
│  │ S3 Models │ │  │  │ Blob Models│ │
│  └───────────┘ │  │  └───────────┘ │
└────────────────┘  └────────────────┘
         │                  │
         └───── Replication ┘
```

## Kubernetes Multi-Cluster

### Cluster Federation with KubeFed

```yaml
# KubeFedCluster registration
apiVersion: core.kubefed.io/v1beta1
kind: KubeFedCluster
metadata:
  name: onprem-gpu-cluster
  namespace: kube-federation-system
spec:
  apiEndpoint: https://onprem-k8s.example.com:6443
  secretRef:
    name: onprem-cluster-secret
---
apiVersion: core.kubefed.io/v1beta1
kind: KubeFedCluster
metadata:
  name: cloud-gpu-cluster
  namespace: kube-federation-system
spec:
  apiEndpoint: https://cloud-k8s.example.com:6443
  secretRef:
    name: cloud-cluster-secret
```

### Multi-Cluster Inference Service

```yaml
# FederatedDeployment for multi-cloud inference
apiVersion: types.kubefed.io/v1beta1
kind: FederatedDeployment
metadata:
  name: llm-inference
  namespace: ai-services
spec:
  template:
    metadata:
      labels:
        app: llm-inference
    spec:
      replicas: 3
      selector:
        matchLabels:
          app: llm-inference
      template:
        spec:
          containers:
          - name: vllm
            image: vllm/vllm-openai:latest
            resources:
              limits:
                nvidia.com/gpu: 1
            volumeMounts:
            - name: model-storage
              mountPath: /models
  placement:
    clusters:
    - name: onprem-gpu-cluster
    - name: cloud-gpu-cluster
  overrides:
  - clusterName: onprem-gpu-cluster
    clusterOverrides:
    - path: "/spec/replicas"
      value: 5  # More replicas on-prem (cheaper)
  - clusterName: cloud-gpu-cluster
    clusterOverrides:
    - path: "/spec/replicas"
      value: 2  # Fewer in cloud (burst)
```

## Data Management Across Environments

### Data Replication Strategy

| Data Type | Replication | Consistency | Tool |
|-----------|-------------|-------------|------|
| Model weights | Async push | Eventual | Rclone, Restic |
| Training data | Read replicas | Eventual | LakeFS, Delta Lake |
| Real-time features | Sync replication | Strong | Redis Cluster |
| Logs/telemetry | Async stream | Eventual | Kafka, Fluentd |
| Config/secrets | Sync | Strong | Vault, Sealed Secrets |

### Cross-Cloud Model Registry

```yaml
# MLflow with cross-cloud artifact storage
# mlflow.conf
MLFLOW_S3_ENDPOINT_URL=https://s3.amazonaws.com
MLFLOW_ARTIFACT_STORE=s3://mlflow-artifacts-prod

# Sync model to Aliyun OSS for China deployment
# rclone sync
rclone sync s3:mlflow-artifacts-prod oss:mlflow-artifacts-cn \
  --include "*.yaml" --include "*.bin" --include "*.safetensors"
```

## Network Architecture

### Connectivity Options

| Option | Bandwidth | Latency | Cost | Use Case |
|--------|-----------|---------|------|----------|
| VPN over Internet | 100 Mbps-1 Gbps | 50-200ms | Low | Non-urgent sync |
| Direct Connect / ExpressRoute | 1-100 Gbps | 5-20ms | Medium | Training data transfer |
| Cross-cloud peering | 10-50 Gbps | 1-10ms | High | Active-active inference |
| Satellite / 5G | 100 Mbps-10 Gbps | 20-100ms | Variable | Edge connectivity |

### Network Topology for AI

```
┌──────────────────────────────────────────────────────┐
│                    SD-WAN Fabric                       │
│                                                       │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────┐ │
│  │  On-Prem DC  │    │  Cloud VPC   │    │  Edge    │ │
│  │              │    │              │    │  Sites   │ │
│  │  ┌────────┐  │    │  ┌────────┐  │    │ ┌──────┐│ │
│  │  │ GPU    │  │    │  │ GPU    │  │    │ │Infer.││ │
│  │  │Cluster │  │◄──►│  │Cluster │  │◄──►│ │Nodes ││ │
│  │  └────────┘  │    │  └────────┘  │    │ └──────┘│ │
│  │  ┌────────┐  │    │  ┌────────┐  │    │         │ │
│  │  │ Storage│  │    │  │ Storage│  │    │         │ │
│  │  │(NFS/LF)│  │    │  │(S3/OSS)│  │    │         │ │
│  │  └────────┘  │    │  └────────┘  │    │         │ │
│  └─────────────┘    └─────────────┘    └──────────┘ │
└──────────────────────────────────────────────────────┘
```

## Security Across Environments

### Zero-Trust Architecture

```yaml
# NetworkPolicy for zero-trust inference
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: inference-isolation
spec:
  podSelector:
    matchLabels:
      app: llm-inference
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: api-gateway
    ports:
    - port: 8000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: model-storage
    ports:
    - port: 443
```

### Secrets Management

| Tool | Multi-Cloud | K8s Native | Use Case |
|------|-------------|------------|----------|
| HashiCorp Vault | Yes | Via CSI | General secrets |
| AWS Secrets Manager | AWS only | External Secrets | AWS-native |
| K8s Sealed Secrets | Yes | Native | GitOps friendly |
| SOPS + KMS | Yes | Manual | Encrypted configs |

## Cost Optimization

### GPU Cost Comparison (2026)

| Provider | Instance | GPU | On-Demand/hr | Spot/hr | Savings |
|----------|----------|-----|-------------|---------|---------|
| AWS | p5.48xlarge | 8x H100 | $98.32 | $29.50 | 70% |
| Azure | ND H100 v5 | 8x H100 | $96.77 | $33.87 | 65% |
| GCP | a3-highgpu-8g | 8x H100 | $98.35 | $29.51 | 70% |
| Alibaba | ecs.gn8ae | 8x H100 | ¥680 | ¥204 | 70% |
| On-Prem | DGX H100 | 8x H100 | ~$15* | N/A | Amortized |

*Assuming 3-year amortization, power, cooling, staffing

### Cost Optimization Strategy

```
┌─────────────────────────────────────────┐
│         Workload Classification          │
├──────────────┬──────────────┬───────────┤
│  Latency     │  Batch       │  Training │
│  Critical    │  Tolerant    │  Jobs     │
├──────────────┼──────────────┼───────────┤
│ On-Prem or   │ Spot/Preempt │ Spot +    │
│ Reserved     │ Cloud        │ Checkpoint│
│ Instances    │ Instances    │ + Resume  │
└──────────────┴──────────────┴───────────┘
```

## Disaster Recovery

### RTO/RPO Targets

| Component | RTO | RPO | Strategy |
|-----------|-----|-----|----------|
| Inference service | < 5 min | 0 | Active-active, multi-region |
| Model registry | < 1 hour | < 1 hour | Cross-cloud replication |
| Training jobs | < 4 hours | Last checkpoint | Checkpoint to object storage |
| Training data | < 24 hours | < 1 hour | Cross-region replication |
| Monitoring | < 15 min | 0 | Multi-cloud observability |

### Failover Runbook

```bash
# 1. Health check failure detected
# 2. DNS failover to secondary region
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234 \
  --change-batch '{"Changes":[{"Action":"UPSERT","ResourceRecordSet":{"Name":"api.example.com","Type":"CNAME","TTL":60,"ResourceRecords":[{"Value":"api-secondary.example.com"}]}}]}'

# 3. Scale up secondary
kubectl --context=secondary scale deployment/inference --replicas=10

# 4. Verify traffic routing
curl -s https://api.example.com/health
```

## Implementation Checklist

- [ ] Network connectivity between environments (VPN/Direct Connect)
- [ ] Kubernetes federation or multi-cluster management
- [ ] Cross-cloud storage sync (model weights, data)
- [ ] Unified observability (Prometheus federation, Grafana)
- [ ] Secrets management across environments
- [ ] Cost monitoring and alerting
- [ ] DR runbook and regular failover testing
- [ ] Security policies (network, IAM, encryption)
- [ ] CI/CD pipeline that deploys to multiple environments
- [ ] Documentation and runbooks

## Related Topics

- AI Stack Deep Dive: AI infrastructure stack
- [[Kubernetes_Core_Components_Deep_Dive]]: K8s fundamentals
- README: Provider-specific guides
- [[Capacity_Planning_2026]]: Resource planning
