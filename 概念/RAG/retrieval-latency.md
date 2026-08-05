---
title: "Retrieval Latency"
category: -concepts
tags: ["rag", "retrieval", "vector-database", "latency", "optimization", "hnsw", "reranker"]
summary: "Retrieval Latency 指 RAG 系统中从用户查询到返回相关文档片段的时间，受 embedding、向量索引、过滤、reranker 等多环节影响。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
lifecycle: reviewed
aliases:
  - "检索延迟"
relationships:
  - target: "概念/rag-systems"
    type: part_of
  - target: "概念/vector-database"
    type: related_to
  - target: "概念/hnsw"
    type: mitigated_by
sources: []
name_zh: "检索延迟"
---

# Retrieval Latency（检索延迟）

> 中文简称：检索延迟

> **一句话理解**: 检索延迟 = RAG 系统「找答案」用了多久——从把问题转成向量，到从向量库搜出相关文档，再到排序返回。

## 定义

Retrieval Latency 是 RAG 系统中从用户查询到返回相关文档片段的端到端时间，由 embedding 生成、向量搜索、payload 过滤、reranker 排序等多环节累加而成。

## 延迟构成

```
用户查询
  ↓
Embedding 生成 (10-50ms)
  ↓
向量搜索 (5-30ms)
  ↓
Payload 过滤 (1-10ms)
  ↓
Reranker 排序 (20-100ms)
  ↓
返回结果

总延迟: 36-190ms (P50)
```

## 优化阶梯

| 步骤 | 优化 | 效果 | 难度 |
|------|------|------|------|
| 1 | 使用 HNSW 索引 | 向量搜索 < 10ms | 低 |
| 2 | 给过滤字段加索引 | 减少 payload 扫描 | 低 |
| 3 | 减小 top_k | 降低 reranker 输入 | 低 |
| 4 | 轻量 reranker | 排序延迟降 50% | 中 |
| 5 | Query 缓存 | 命中时省掉全流程 | 中 |
| 6 | 批处理 embedding | 提高吞吐 | 低 |
| 7 | GPU 加速 embedding | 延迟降 3-5x | 高 |

## 2026 年基准数据

| 向量库 | 1M 向量 P95 | 10M 向量 P95 | 特色 |
|---------|------------|-------------|------|
| **Qdrant** | 8ms | 15ms | Rust 实现、过滤强 |
| **Milvus** | 10ms | 20ms | 分布式、GPU 索引 |
| **Weaviate** | 12ms | 25ms | 混合搜索 |
| **pgvector** | 15ms | 50ms | PostgreSQL 原生 |
| **Chroma** | 20ms | 60ms | 轻量、嵌入式 |

## 生产最佳实践

1. **监控 P95/P99**：不只看平均值，尾部延迟影响用户体验
2. **HNSW 参数调优**：`ef_search` 越高越准但越慢，建议 128-256
3. **Reranker 是最大瓶颈**：考虑轻量 cross-encoder 或 ColBERT
4. **缓存热门查询**：Redis 缓存 embedding + 结果，命中率可达 30%+
5. **异步检索**：非实时场景可批量处理，提高吞吐

## Related

- [[概念/rag-systems|RAG Systems]]
- [[概念/vector-database|Vector Database]]
- [[概念/hnsw|HNSW]]
- [[概念/hybrid-search|Hybrid Search]]
- [[概念/RAG/reranker|Reranker]]
- [[概念/Inference/ttft|TTFT]] — 检索延迟影响首 token 时间
- [[14_RAG系统/04_高级RAG/RAG_Retrieval_Latency_Optimization|RAG 检索延迟优化]]

## 2026 检索延迟优化生态

| 技术 | 延迟降低 | 适用场景 | 状态 |
|------|------|------|------|
| HNSW 索引 | 50-70% | 通用向量检索 | ✅ 成熟 |
| 量化 (PQ/SQ) | 30-50% | 大规模检索 | ✅ 成熟 |
| GPU 加速检索 | 80-90% | 高吐吐量 | ✅ 新增 |
| 缓存层 | 60-80% | 重复查询 | ✅ 成熟 |
| 异步检索 | 40-60% | 多路召回 | ✅ 成熟 |
| 预计算 | 90%+ | 固定查询 | ✅ 成熟 |

## 延迟预算分配

| 阶段 | 目标延迟 | 优化手段 |
|------|------|------|
| Embedding | < 10ms | 模型量化 + GPU |
| 向量检索 | < 5ms | HNSW + 缓存 |
| Rerank | < 20ms | 轻量模型 + top-k 截断 |
| 总计 | < 50ms | 异步 + 缓存 + 预计算 |

## 检查清单

- [ ] 检索延迟已监控（P50/P99）
- [ ] 索引类型已优化
- [ ] 缓存层已配置
- [ ] 批量查询已启用
- [ ] 异步检索已配置
- [ ] 延迟预算已分配

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| P99 延迟高 | 索引未优化 | 调整 HNSW ef_search 参数 |
| 吐吐量低 | 单线程检索 | 启用批量 + 并行检索 |
| 缓存命中率低 | 查询多样 | 语义缓存 + 预计算 |
| GPU 利用率低 | batch 太小 | 增大 batch size |

## 延伸阅读

- [[概念/RAG/hnsw|HNSW]] — 图索引算法
- [[概念/RAG/hybrid-search|Hybrid Search]] — 混合检索
- [[概念/RAG/reranker|Reranker]] — 重排序
- [[概念/Inference/ttft|TTFT]] — 首 token 时间
- [[14_RAG系统/04_高级RAG/RAG_Retrieval_Latency_Optimization|RAG 检索延迟优化]]

> ℹ️ 检索延迟是 RAG 用户体验的关键指标，2026年通过 HNSW + GPU 加速 + 语义缓存组合，P99 延迟可控制在 50ms 以内。

## 延迟优化架构图

```
用户查询 → 语义缓存 (Redis) → 命中? → 直接返回
                    ↓ 未命中
        Embedding (GPU, <10ms)
                    ↓
    向量检索 (HNSW, <5ms) + BM25 (<2ms)
                    ↓
        RRF 融合 + Rerank (<20ms)
                    ↓
            返回结果 (<50ms 总计)
```

## 性能基准参考

| 数据规模 | HNSW P50 | HNSW P99 | GPU 加速 P99 |
|------|------|------|------|
| 100K | 1ms | 3ms | 1ms |
| 1M | 2ms | 5ms | 2ms |
| 10M | 5ms | 15ms | 5ms |
| 100M | 10ms | 30ms | 10ms |

## 2026 检索优化生态现状

| 优化技术 | 延迟降低 | 适用场景 | 状态 |
|------|------|------|------|
| GPU 索引 (RAFT) | 5-10x | 大规模向量检索 | ✅ 成熟 |
| 量化 (PQ/SQ) | 2-3x | 内存受限 | ✅ 主流 |
| 缓存 (Redis) | 10-50x | 重复查询 | ✅ 主流 |
| 预计算/预热 | 2-5x | 冷启动 | ✅ 成熟 |
| 异步检索 | 感知降低 | 多路召回 | ✅ 主流 |
| 边缘部署 | 3-5x | 低延迟要求 | 🟡 发展中 |

## 检查清单

- [ ] P50/P95/P99 延迟已建立基线
- [ ] 向量索引参数已调优（ef_search/M）
- [ ] 热点查询缓存已启用
- [ ] 批量查询已使用异步/并行模式
- [ ] 监控看板已配置延迟分位数
- [ ] 容量规划已考虑峰值 QPS

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|------|
| P99 延迟 > 100ms | 索引未预热/内存不足 | 预热索引 + 扩容内存 |
| 延迟波动大 | GC/网络抖动 | 调优 GC + 连接池 |
| 冷启动慢 | 索引加载耗时 | 持久化索引 + 预加载 |
| 吐吐量不足 | 单线程查询 | 并行查询 + 分片 |

## 延伸阅读

- [[概念/RAG/hnsw|HNSW]] — 向量索引算法
- [[概念/RAG/vector-database|Vector Database]] — 向量数据库
- [[概念/RAG/hybrid-search|Hybrid Search]] — 混合检索
- [[概念/Inference/model-serving|Model Serving]] — 模型服务化
- [[14_RAG系统/04_高级RAG/RAG_Retrieval_Latency_Optimization|检索延迟优化专题]]

> ℹ️ 检索延迟优化核心策略：索引调优 + 缓存 + 异步并行 + GPU 加速，生产 RAG 目标 P99 < 50ms。

## 延迟预算分配

| 阶段 | 目标延迟 | 优化手段 |
|------|------|------|
| Embedding | < 10ms | 批处理/缓存 |
| 向量检索 | < 20ms | HNSW 调优/GPU |
| Rerank | < 30ms | 小模型/截断 |
| 总计 | < 50ms | 异步并行 |
