# RAG高级实践 2026

## 文档导航

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [RAG_Advanced_2026.md](./RAG_Advanced_2026.md) | 混合检索、重排序、Agentic RAG | 进阶学习 |

## 关键技术

### 准确率提升路径

```
基础RAG: 60-70%
├── 语义分块: +15%
├── 混合检索: +20%
├── 重排序: +25%
├── 上下文压缩: +10%
└── Agentic RAG: +15%

高级RAG: 90%+
```

### 核心组件

| 组件 | 技术 | 作用 |
|------|------|------|
| 分块 | Parent-Document | 保持语义完整 |
| 检索 | Hybrid (Dense+Sparse) | 召回率提升 |
| 融合 | RRF | 多路召回融合 |
| 重排 | Cross-Encoder | 精准排序 |
| 压缩 | Contextual | 减少噪声 |

## 一句话总结

> **2026年的RAG是精密工程** — 混合检索+智能重排+上下文压缩让准确率从60%提升至90%+。

---

## 参考

- [LangChain RAG Templates](https://python.langchain.com/docs/templates/)
- [LlamaIndex](https://www.llamaindex.ai/)
- [RAGAS Evaluation](https://docs.ragas.io/)
