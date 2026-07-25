---
title: 分块策略 (Chunking Strategies)
category: 05-rag
tags: ["chunking", "semantic-chunking", "recursive-splitting", "document-structure"]
summary: "RAG 分块策略完整指南：固定/递归/语义/文档结构分块、2026 最佳实践、分块大小选择、重叠策略与评估方法。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# 分块策略 (Chunking Strategies)

## 1. 为什么分块重要？

```
分块 = RAG 质量的基础

太大: 检索不精确，噪声多，超出上下文窗口
太小: 语义不完整，缺乏上下文
刚好: 语义完整 + 检索精确 + 上下文充足

分块质量直接影响:
- 检索准确率 (recall/precision)
- 回答质量 (faithfulness)
- 幻觉率 (不相关块 → 幻觉)
```

## 2. 主要策略

### 2.1 策略对比

| 策略 | 原理 | 优势 | 劣势 | 适用 |
|------|------|------|------|------|
| 固定大小 | 按字符/token 数切 | 简单快速 | 切断语义 | 快速原型 |
| 递归分割 | 按分隔符层次切 | 保留结构 | 需调参 | 通用文本 |
| 语义分块 | 按语义相似度切 | 语义完整 | 较慢 | 高质量 |
| 文档结构 | 按标题/段落切 | 保留层次 | 依赖格式 | 结构化文档 |
| 句子窗口 | 句子+周围上下文 | 精确+上下文 | 冗余 | QA |
| 命题分块 | 拆为独立命题 | 最精确 | 最慢 | 知识库 |

### 2.2 实现

```python
class ChunkingStrategies:
    """分块策略实现"""
    
    def fixed_size(self, text, chunk_size=512, overlap=50):
        """固定大小分块"""
        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start = end - overlap  # 重叠
        return chunks
    
    def recursive_split(self, text, chunk_size=512, 
                        separators=["\n\n", "\n", ". ", " "]):
        """递归分割 (LangChain 默认)"""
        if len(text) <= chunk_size:
            return [text]
        
        # 找最合适的分隔符
        for sep in separators:
            if sep in text:
                parts = text.split(sep)
                chunks = []
                current = ""
                for part in parts:
                    if len(current) + len(part) + len(sep) <= chunk_size:
                        current += sep + part if current else part
                    else:
                        if current:
                            chunks.append(current)
                        current = part
                if current:
                    chunks.append(current)
                return chunks
        
        # 没有分隔符，强制切
        return self.fixed_size(text, chunk_size)
    
    def semantic_chunking(self, text, embeddings, 
                          breakpoint_threshold=0.3):
        """语义分块: 按语义断裂点切"""
        sentences = split_sentences(text)
        sentence_embeddings = embeddings.encode(sentences)
        
        # 计算相邻句子的相似度
        similarities = [
            cosine_similarity(sentence_embeddings[i], sentence_embeddings[i+1])
            for i in range(len(sentences) - 1)
        ]
        
        # 相似度骤降处 = 语义断裂点
        chunks = []
        current_chunk = [sentences[0]]
        
        for i, sim in enumerate(similarities):
            if sim < breakpoint_threshold:
                # 断裂! 开始新块
                chunks.append(" ".join(current_chunk))
                current_chunk = [sentences[i + 1]]
            else:
                current_chunk.append(sentences[i + 1])
        
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        
        return chunks
    
    def document_structure(self, doc):
        """按文档结构分块 (Markdown/HTML)"""
        chunks = []
        current_section = ""
        current_headers = []
        
        for line in doc.split("\n"):
            if line.startswith("#"):
                # 新章节
                if current_section:
                    chunks.append({
                        "content": current_section,
                        "headers": current_headers.copy(),
                    })
                current_headers.append(line)
                current_section = line + "\n"
            else:
                current_section += line + "\n"
        
        if current_section:
            chunks.append({
                "content": current_section,
                "headers": current_headers,
            })
        
        return chunks
```

## 3. 2026 最佳实践

```python
CHUNKING_BEST_PRACTICES = {
    "大小选择": {
        "通用": "256-512 tokens (最常用)",
        "QA": "128-256 tokens (精确)",
        "摘要": "512-1024 tokens (完整)",
        "代码": "按函数/类切",
    },
    "重叠": {
        "推荐": "10-20% 重叠",
        "目的": "避免边界信息丢失",
    },
    "元数据": [
        "保留标题层次 (breadcrumb)",
        "保留页码/段落号",
        "保留文档来源",
    ],
    "2026 趋势": [
        "Late Chunking: 先编码全文再切 (保留全局上下文)",
        "Contextual Retrieval: Anthropic 的上下文增强分块",
        "Agentic Chunking: 用 LLM 决定分块边界",
    ],
}
```

## 4. 交叉引用

- [[14_RAG系统/|RAG 系统]]
- [[14_RAG系统/Knowledge_Graph_RAG/|知识图谱 RAG]]
- [[概念/RAG/rag-patterns|RAG 模式]]
- [[概念/RAG/embedding-models|嵌入模型]]
- [[09_测试/RAGAS/|RAGAS 评估]]

## 进阶知识拓展

| 主题 | 深度内容 | 应用场景 | 参考资源 |
|------|----------|----------|----------|
| 核心原理 | 底层机制和数学推导 | 深度理解+优化 | 经典教材+论文 |
| 工程实践 | 生产级实现细节 | 项目落地 | 开源项目+案例 |
| 性能优化 | 瓶颈分析+调优策略 | 提升效率 | 性能分析工具 |
| 安全合规 | 安全威胁+防护措施 | 风险管控 | 安全框架+标准 |
| 前沿研究 | 最新进展+未来方向 | 技术预判 | 顶会论文+博客 |

## 实践指南

| 步骤 | 行动 | 工具/方法 | 预期产出 |
|------|------|-----------|----------|
| 1. 学习 | 系统学习核心知识 | 教材/课程/文档 | 知识体系建立 |
| 2. 练习 | 动手实践加深理解 | 实验/项目/练习 | 技能熟练 |
| 3. 应用 | 在实际项目中应用 | 工作项目/开源 | 经验积累 |
| 4. 优化 | 持续改进和优化 | 性能分析/重构 | 质量提升 |
| 5. 分享 | 输出和分享知识 | 博客/演讲/教学 | 影响力建设 |

## 常见误区

| 误区 | 正确认知 | 建议 |
|------|----------|------|
| 只学理论不实践 | 实践是检验理解的唯一标准 | 每学一个概念就动手验证 |
| 追求完美再开始 | 完成比完美更重要 | 先做MVP再迭代 |
| 忽视基础知识 | 基础决定上限 | 定期回顾基础 |
| 盲目追新 | 新技术需要验证 | 评估后再采用 |
| 单打独斗 | 协作效率更高 | 积极参与社区 |

## 知识图谱关联

| 关联主题 | 关系类型 | 参考路径 |
|----------|----------|----------|
| 基础理论 | 前置依赖 | 相关基础目录 |
| 工具实践 | 实现支撑 | 工具/编程相关 |
| 应用场景 | 价值体现 | 18_行业应用/ |
| 前沿研究 | 发展方向 | 20_论文精读/ |
| 工程方法 | 质量保障 | 09_测试/13_运维/ |

## 版本更新记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2025-01 | 初始创建 |
| v1.1 | 2025-06 | 内容补充 |
| v2.0 | 2026-01 | 全面扩写 |
| v2.1 | 2026-07 | 质量强化+结构化增强 |

## 快速自检

- [ ] 核心概念能向他人清晰解释
- [ ] 已完成至少一个实践项目
- [ ] 了解主流方案优劣势和适用场景
- [ ] 掌握常见问题排查方法
- [ ] 关注最新技术动态
- [ ] 知识已文档化沉淀
