---
title: "System Design for AI Interviews"
tags: [interviews, system-design, ai, ml, architecture]
status: complete
last_updated: 2026-07-02
sources: []
---

# System Design for AI Interviews

## Overview

AI system design interviews assess your ability to design end-to-end ML/AI systems. Unlike traditional system design, these require understanding of ML lifecycle, data pipelines, model serving, and monitoring.

## Framework for AI System Design

### STAR-ML Framework

```
1. Situation: Understand requirements and constraints
   - What problem are we solving?
   - What are the success metrics?
   - What are the scale requirements?

2. Task: Define ML problem formulation
   - Classification, regression, generation, retrieval?
   - Online vs batch prediction?
   - What data is available?

3. Architecture: Design the system
   - Data pipeline
   - Feature engineering
   - Model training
   - Model serving
   - Monitoring & feedback

4. Refinement: Deep dive on critical components
   - Latency optimization
   - Scalability
   - Failure handling
   - Cost optimization
```

## Common System Design Questions

### 1. Design a Recommendation System

```
Requirements:
- 100M users, 10M items
- < 100ms latency
- Handle cold start
- Real-time personalization

Architecture:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ User Events  │────→│ Kafka       │────→│ Feature     │
│ (Click/Purchase)│    │ Stream      │     │ Store (Redis)│
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
┌─────────────┐     ┌─────────────┐     ┌──────┴──────┐
│ Candidate    │────→│ Ranking     │────→│ Business    │
│ Generation   │     │ Model       │     │ Rules       │
│ (ANN Search) │     │ (DeepFM)    │     │ & Re-ranking│
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                        ┌──────┴──────┐
                                        │ Response    │
                                        │ (Top-K)     │
                                        └─────────────┘

Key Decisions:
- Candidate generation: Two-tower model + ANN (FAISS/ScaNN)
- Ranking: DeepFM or DCN-v2
- Features: User history, item embeddings, context
- Cold start: Content-based features, popularity fallback
- Real-time: Feature store with streaming updates
```

### 2. Design a Content Moderation System

```
Requirements:
- Text + Image + Video
- < 500ms for text, < 2s for images
- 99% recall for policy violations
- Multi-language support

Architecture:
Content → Pre-filter (regex/hash) → ML Classifier → Human Review Queue
                                          ↓
                                    Confidence < 0.8? → Human
                                    Confidence > 0.95? → Auto-action
                                    Confidence 0.8-0.95? → Priority queue

Models:
- Text: Fine-tuned BERT/mBERT for toxicity
- Image: CLIP + fine-tuned classifier
- Video: Keyframe extraction + image model
- Ensemble: Combine signals for final decision
```

### 3. Design an LLM-Powered Search System

```
Requirements:
- 1B documents
- Sub-second latency
- Support natural language queries
- Citation of sources

Architecture:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ User Query   │────→│ Query       │────→│ Hybrid      │
│              │     │ Understanding│     │ Retrieval   │
└─────────────┘     │ (LLM)       │     │ (BM25+ANN)  │
                    └─────────────┘     └──────┬──────┘
                                               │
                    ┌─────────────┐     ┌──────┴──────┐
                    │ LLM         │────→│ Re-ranking  │
                    │ Generation  │     │ (Cross-encoder)│
                    │ (RAG)       │     └──────┬──────┘
                    └──────┬──────┘            │
                           │            ┌──────┴──────┐
                           └───────────→│ Response    │
                                        │ + Citations │
                                        └─────────────┘

Key Decisions:
- Retrieval: BM25 (sparse) + Dense embeddings (hybrid)
- Vector DB: FAISS/Milvus/Qdrant for ANN
- Re-ranking: Cross-encoder (ms-marco)
- Generation: GPT-4/Claude with retrieved context
- Chunking: 512 tokens with 50 token overlap
```

### 4. Design a Fraud Detection System

```
Requirements:
- 10K transactions/second
- < 100ms latency
- 99.9% precision (low false positives)
- Real-time + batch detection

Architecture:
Transaction → Feature Engineering → ML Model → Decision Engine
     ↓              ↓                   ↓            ↓
  Streaming    Real-time features   Ensemble      Rule Engine
  (Kafka)      (Feature Store)      (XGBoost +    (Business rules)
                                      Deep)

Two-stage:
1. Real-time model: Fast, simple (XGBoost, < 10ms)
2. Async deep model: Complex, for borderline cases
3. Human review: For high-value or uncertain

Features:
- Transaction amount, merchant, location
- User history (avg spend, frequency)
- Device fingerprint, IP geolocation
- Velocity features (transactions/hour)
- Graph features (merchant-user network)
```

### 5. Design a Chatbot/Conversational AI

```
Requirements:
- Multi-turn conversation
- Domain-specific knowledge
- < 2s response time
- Handle 10K concurrent users

Architecture:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ User Message │────→│ Intent      │────→│ Dialog      │
│              │     │ Classification│    │ Manager     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌─────────────┐     ┌──────┴──────┐
                    │ Response    │────→│ Knowledge   │
                    │ Generation  │     │ Retrieval   │
                    │ (LLM)       │     │ (RAG)       │
                    └─────────────┘     └─────────────┘

Key Decisions:
- Base model: Fine-tuned Llama/GPT for domain
- Context: RAG for knowledge, conversation memory
- Safety: Output filtering, toxicity detection
- Fallback: Human handoff when confidence low
- Caching: Common queries cached
```

## Key Components to Discuss

### Data Pipeline

```
Sources → Ingestion → Validation → Transformation → Storage → Serving

Tools:
- Batch: Spark, dbt, Airflow
- Streaming: Kafka, Flink, Spark Streaming
- Feature Store: Feast, Tecton, Hopsworks
- Data Quality: Great Expectations, Deequ
```

### Model Training

```
Data → Feature Engineering → Model Selection → Training → Evaluation → Registry

Considerations:
- Offline vs online training
- Distributed training for large models
- Experiment tracking (MLflow, W&B)
- Model versioning and lineage
```

### Model Serving

```
Request → Load Balancer → Inference Service → Response

Options:
- Real-time: vLLM, TGI, TensorRT-LLM
- Batch: Spark ML, SageMaker Batch
- Edge: ONNX, TFLite, CoreML

Considerations:
- Latency requirements
- Throughput vs cost
- Model versioning / A/B testing
- Graceful degradation
```

### Monitoring

```
Metrics to Monitor:
- System: Latency, throughput, errors, GPU utilization
- ML: Prediction distribution, feature drift, model quality
- Business: Conversion rate, user satisfaction

Tools:
- System: Prometheus + Grafana
- ML: Arize, WhyLabs, Evidently
- Logging: ELK, Loki
```

## Evaluation Criteria

| Criterion | What Interviewers Look For |
|-----------|---------------------------|
| Requirements | Ask clarifying questions, define scope |
| ML Formulation | Choose right problem type, metrics |
| Data | Identify data sources, quality issues |
| Architecture | End-to-end design, component selection |
| Trade-offs | Discuss alternatives, justify choices |
| Scale | Handle millions of users/requests |
| Monitoring | ML-specific monitoring, drift detection |
| Failure | Graceful degradation, fallback strategies |

## Practice Questions

1. Design a real-time translation system
2. Design an image search engine
3. Design a code generation system (like Copilot)
4. Design a news feed ranking system
5. Design an ad click prediction system
6. Design an anomaly detection system for IoT
7. Design a voice assistant (like Siri)
8. Design a content recommendation system for short videos
9. Design an automated resume screening system
10. Design a real-time bidding system for ads

## Related Topics

- [[AI_Solutions_Architect]]: Solutions architect role
- [[21_Interviews/Machine_Learning_Engineer/question_bank]]: ML engineer interview prep
- [[AI_Product_Manager]]: Product sense for AI
- [[21_Interviews/AI_Infrastructure_Engineer/question_bank]]: Infrastructure interview prep
