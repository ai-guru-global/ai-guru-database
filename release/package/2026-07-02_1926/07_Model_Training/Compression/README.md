---
title: "Compression Techniques for Model Training"
tags: [model-training, compression, quantization, pruning, distillation]
status: complete
last_updated: 2026-07-02
sources: []
---

# Compression Techniques for Model Training

## Purpose

This directory covers model compression techniques for reducing model size and inference cost while preserving quality.

## Contents

| File | Description |
|------|-------------|
| Pruning_and_Knowledge_Distillation.md | Pruning and distillation fundamentals |
| Model_Compression_Complete_Guide.md | Comprehensive compression guide (quantization, pruning, distillation, NAS) |

## Key Topics

1. **Quantization**: Reduce numerical precision (FP16, INT8, INT4)
2. **Pruning**: Remove unimportant weights or structures
3. **Knowledge Distillation**: Transfer knowledge from large to small models
4. **Low-Rank Factorization**: Decompose weight matrices
5. **Architecture Design**: Efficient architectures (MobileNet, EfficientNet)

## Quick Reference

| Technique | Size Reduction | Quality Impact | Implementation |
|-----------|---------------|----------------|----------------|
| INT8 Quantization | 4x | Minimal | PTQ or QAT |
| INT4 Quantization | 8x | Small | GPTQ, AWQ |
| 50% Pruning | 2x | 1-2% | Magnitude-based |
| Distillation | 2-10x | 2-5% | Teacher-student |

## Related Directories

- [[Optimization]]: Training optimization
- [[07_Model_Training/Distributed_Training/index]]: Distributed training techniques
- Quantization: Deployment quantization (in 10_Deployment_Inference)
