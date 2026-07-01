---
title: "IVF"
category: -concepts
tags: ["rag", "vector-database", "indexing", "approximate-nearest-neighbor", "alibaba-cloud"]
summary: "IVF（Inverted File Index）是一种基于聚类的近似最近邻搜索索引，内存占用低、构建快，适合大规模向量库。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
aliases:
  - "Inverted File Index"
  - "倒排文件索引"
relationships:
  - target: "_concepts/vector-index"
    type: is_a
  - target: "_concepts/vector-database"
    type: used_by
  - target: "_concepts/retrieval-latency"
    type: mitigates
---

# IVF

> **一句话理解**: IVF 先把向量聚成很多类，搜索时只扫最相关的几个类，用内存少、速度快，适合向量特别多的场景。

## 核心要点

- **聚类预过滤**: 用 k-means 把向量分到 nlist 个聚类中心。
- **查询时扫描 nprobe 个聚类**: 减少距离计算量。
- **变体**: IVF_FLAT（精确存储）、IVF_PQ（量化存储，更省内存）。
- **优点**: 内存低、构建快
- **缺点**: 查询延迟通常高于 HNSW，精度依赖 nprobe

## 关键参数

| 参数 | 说明 |
|------|------|
| nlist | 聚类中心数，通常 4×sqrt(N) |
| nprobe | 查询时扫描的聚类数，越大越准越慢 |

## 与 HNSW 对比

| 特性 | HNSW | IVF |
|------|------|-----|
| 查询延迟 | 低 | 中 |
| 内存占用 | 高 | 低 |
| 构建速度 | 慢 | 快 |
| 适合规模 | 中大规模 | 超大规模 |

## 阿里云专有云关联

在阿里云专有云大规模 RAG 系统中，当 HNSW 内存占用过高时，可考虑 IVF_PQ 等量化索引。工单中「向量库内存不足」时，IVF 是可行替代方案。

## Related

- [[_concepts/vector-index|Vector Index]]
- [[_concepts/hnsw|HNSW]]
- [[_concepts/vector-database|Vector Database]]
- [[_concepts/retrieval-latency|Retrieval Latency]]
