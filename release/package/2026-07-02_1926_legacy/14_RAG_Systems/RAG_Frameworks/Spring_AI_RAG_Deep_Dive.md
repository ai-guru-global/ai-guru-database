---
title: Spring AI RAG 深度解析
category: 14-rag-systems
tags: ["rag", "retrieval", "vector-database", "embedding"]
summary: "> 📚 **Spring AI 基础**: 如果你还不熟悉 Spring AI 的核心概念，请先阅读 [Spring AI 深度解析](数学基础/Java_Ecosystem_AI/Spring_AI_Deep_Dive.md)。"
created: 2026-05-31
updated: 2026-05-31
tier: core
aliases:
  - "Spring Ai Rag Deep Dive"
  - "Spring AI RAG Deep Dive"
  - Spring_AI_RAG_Deep_Dive

---
# Spring AI RAG 深度解析

> 📚 **Spring AI 基础**: 如果你还不熟悉 Spring AI 的核心概念，请先阅读 [Spring AI 深度解析](数学基础/Java_Ecosystem_AI/Spring_AI_Deep_Dive.md)。
>
> **一句话理解**: Spring AI RAG 是用 Spring 的方式构建检索增强生成系统 —— 从文档加载、分块策略、向量存储到检索增强的完整 Pipeline，让 Java 企业应用拥有知识库问答能力。

> **相关文档**: [Spring AI 深度解析](数学基础/Java_Ecosystem_AI/Spring_AI_Deep_Dive.md) | [Spring AI 架构设计](架构基建/Architecture_Overview/Spring_AI_Architecture) | [Milvus 深度解析](RAG系统/Vector_Databases/Milvus_Deep_Dive.md) | [RAG 高级专题](RAG系统/Advanced_RAG/RAG_Advanced_2026.md) | [RAG 基础入门](RAG系统/RAG_Systems_for_dummy.md)

---

## 目录

1. [Spring AI RAG 概述](#1-spring-ai-rag-概述)
2. [ETL Pipeline 详解](#2-etl-pipeline-详解)
3. [文档分块策略](#3-文档分块策略)
4. [向量存储集成](#4-向量存储集成)
5. [检索增强模式](#5-检索增强模式)
6. [完整 RAG 示例](#6-完整-rag-示例)
7. [高级 RAG 模式](#7-高级-rag-模式)
8. [性能优化](#8-性能优化)

---

## 1. Spring AI RAG 概述

### 1.1 RAG in Spring AI

```
Spring AI RAG 架构
════════════════════════════════════════════════════════════════════

                    ┌──────────────────────────────────┐
                    │         用户提问                   │
                    │   "公司差旅报销标准是什么？"        │
                    └──────────────┬───────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │     Query Enhancement             │
                    │     查询增强（改写/扩展）           │
                    └──────────────┬───────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │     Embedding Model               │
                    │     问题 → 向量化                  │
                    └──────────────┬───────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │     Vector Store Search           │
                    │     向量相似度检索                  │
                    │     Top-K: 5 documents            │
                    └──────────────┬───────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │     Context Assembly              │
                    │     组装上下文 (文档 + 问题)        │
                    └──────────────┬───────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │     LLM Generation                │
                    │     基于上下文生成回答              │
                    └──────────────┬───────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │     带引用的回答                    │
                    │   "根据《差旅管理办法》第3条..."     │
                    └──────────────────────────────────┘
```

### 1.2 Spring AI RAG 组件

| 组件 | 说明 | 接口/类 |
|------|------|--------|
| **DocumentReader** | 文档读取 | `DocumentReader` |
| **DocumentTransformer** | 文档转换/分块 | `DocumentTransformer` |
| **EmbeddingModel** | 文本向量化 | `EmbeddingModel` |
| **VectorStore** | 向量存储与检索 | `VectorStore` |
| **QuestionAnswerAdvisor** | 检索增强 Advisor | `QuestionAnswerAdvisor` |
| **RetrievalAugmentationAdvisor** | 高级检索增强 | `RetrievalAugmentationAdvisor` |

---

## 2. ETL Pipeline 详解

### 2.1 离线索引 Pipeline

```java
@Service
public class DocumentIndexingService {

    private final VectorStore vectorStore;

    public void indexDocuments(String directoryPath) {
        // Step 1: 读取文档
        List<Document> documents = new PagePdfDocumentReader(
                new FileSystemResource(directoryPath),
                PdfDocumentReaderConfig.builder()
                    .withPageExtractedTextFormatter(
                        new ExtractedTextFormatter.Builder()
                            .withNumberOfPagesText("第 {0} 页")
                            .build())
                    .withPagesPerDocument(1)
                    .build())
            .get();

        // Step 2: 文本分块
        List<Document> chunks = new TokenTextSplitter(
                800,    // defaultChunkSize
                200,    // minChunkSizeChars
                5,      // minChunkLengthToEmbed
                10000,  // maxNumChunks
                true    // keepSeparator
            ).apply(documents);

        // Step 3: 写入向量存储（自动调用 Embedding）
        vectorStore.add(chunks);
    }
}
```

### 2.2 支持的文档格式

| 格式 | Reader | 说明 |
|------|--------|------|
| **PDF** | `PagePdfDocumentReader` | Adobe PDF 库解析 |
| **PDF (Tika)** | `TikaDocumentReader` | Apache Tika，支持 OCR |
| **Markdown** | `MarkdownDocumentReader` | Markdown 解析 |
| **JSON** | `JsonReader` | JSON 结构化文档 |
| **HTML** | `TikaDocumentReader` | 网页内容提取 |
| **Word/Excel/PPT** | `TikaDocumentReader` | Office 文档 |
| **纯文本** | `TextReader` | TXT 文件 |

### 2.3 文档元数据

```java
Document doc = new Document(
    "文档内容...",
    Map.of(
        "source", "company_policy.pdf",
        "page", 15,
        "department", "HR",
        "version", "2.0",
        "date", "2026-03-01",
        "security_level", "internal"
    )
);
```

### 2.4 批量索引

```java
@Service
public class BatchIndexingService {

    private final VectorStore vectorStore;
    private final ExecutorService executor;

    @Scheduled(cron = "0 0 2 * * *")
    public void scheduledIndexing() {
        Path docsDir = Path.of("/data/documents");
        try (Stream<Path> files = Files.walk(docsDir)) {
            files.filter(p -> p.toString().endsWith(".pdf"))
                 .collect(Collectors.groupingBy(p -> p.toString().hashCode() % 10))
                 .values()
                 .parallelStream()
                 .forEach(batch -> {
                     List<Document> docs = batch.stream()
                         .flatMap(p -> readPdf(p).stream())
                         .toList();
                     List<Document> chunks = new TokenTextSplitter(800, 200, 5, 10000, true)
                         .apply(docs);
                     vectorStore.add(chunks);
                 });
        }
    }
}
```

---

## 3. 文档分块策略

### 3.1 分块策略对比

| 策略 | 实现 | 适用场景 | 优点 | 缺点 |
|------|------|---------|------|------|
| **固定大小** | `TokenTextSplitter` | 通用 | 简单可控 | 可能切断语义 |
| **段落分割** | 自定义 | 文章/报告 | 保持段落完整 | 段落大小不均 |
| **语义分块** | 自定义 | 高质量 RAG | 语义连贯 | 计算成本高 |
| **递归分割** | 自定义 | 代码/结构化文本 | 保持结构 | 实现复杂 |

### 3.2 TokenTextSplitter 参数调优

```java
TokenTextSplitter splitter = new TokenTextSplitter(
    800,    // defaultChunkSize: 每个分块的目标 Token 数
    200,    // minChunkSizeChars: 最小分块字符数
    5,      // minChunkLengthToEmbed: 最小嵌入长度
    10000,  // maxNumChunks: 最大分块数
    true    // keepSeparator: 是否保留分隔符
);
```

```
分块效果示例
════════════════════════════════════════════════════════════════════

原始文档 (3000 tokens):
┌──────────────────────────────────────────────────────────┐
│ 第一章 公司简介... [800 tokens]... 第二章 差旅管理...     │
│ [800 tokens]... 第三章 报销流程... [800 tokens]... 第四章 │
│ 审批权限... [600 tokens]...                               │
└──────────────────────────────────────────────────────────┘

分块结果 (chunk_size=800, overlap=200):
┌────────────────┐
│ Chunk 1        │  第一章 + 第二章开头 (800 tokens)
│ [第一章内容]    │
│ [第二章开头]    │
└────────────────┘
┌────────────────┐
│ Chunk 2        │  第二章末尾重叠 + 第二章主体 (800 tokens)
│ [第二章开头重叠]│  ← 200 tokens 重叠，保证上下文连续
│ [第二章主体]    │
└────────────────┘
┌────────────────┐
│ Chunk 3        │
│ [第三章内容]    │
└────────────────┘
```

### 3.3 自定义分块策略

```java
@Component
public class SemanticChunker implements DocumentTransformer {

    private final EmbeddingModel embeddingModel;
    private final double similarityThreshold;

    @Override
    public List<Document> apply(List<Document> documents) {
        List<Document> chunks = new ArrayList<>();
        for (Document doc : documents) {
            List<String> sentences = splitIntoSentences(doc.getText());
            List<float[]> embeddings = sentences.stream()
                .map(s -> embeddingModel.embed(s))
                .toList();

            List<String> currentChunk = new ArrayList<>();
            for (int i = 0; i < sentences.size(); i++) {
                currentChunk.add(sentences.get(i));
                if (i < sentences.size() - 1) {
                    double similarity = cosineSimilarity(
                        embeddings.get(i), embeddings.get(i + 1));
                    if (similarity < similarityThreshold) {
                        chunks.add(createChunk(currentChunk, doc.getMetadata()));
                        currentChunk = new ArrayList<>();
                    }
                }
            }
            if (!currentChunk.isEmpty()) {
                chunks.add(createChunk(currentChunk, doc.getMetadata()));
            }
        }
        return chunks;
    }
}
```

---

## 4. 向量存储集成

### 4.1 PGVector 配置

```yaml
spring:
  ai:
    vectorstore:
      pgvector:
        index-type: HNSW
        distance-type: COSINE
        dimensions: 1536
        initialize-schema: true
  datasource:
    url: jdbc:postgresql://localhost:5432/ai_knowledge
    username: ${DB_USER}
    password: ${DB_PASSWORD}
```

### 4.2 Milvus 配置

```java
@Bean
public VectorStore milvusVectorStore(MilvusServiceClient milvusClient,
                                      EmbeddingModel embeddingModel) {
    return MilvusVectorStore.builder(milvusClient, embeddingModel)
        .collectionName("enterprise_docs")
        .metricType(MetricType.COSINE)
        .embeddingDimension(1536)
        .indexType(IndexType.IVF_FLAT)
        .build();
}
```

### 4.3 Elasticsearch 配置

```java
@Bean
public VectorStore elasticVectorStore(RestClient restClient,
                                       EmbeddingModel embeddingModel) {
    return ElasticsearchVectorStore.builder(restClient, embeddingModel)
        .indexName("ai_documents")
        .similarity(Similarity.COSINE)
        .initializeSchema(true)
        .build();
}
```

### 4.4 混合检索（全文 + 向量）

```java
@Service
public class HybridSearchService {

    private final VectorStore vectorStore;
    private final ElasticsearchOperations esOps;

    public List<SearchResult> hybridSearch(String query, int topK) {
        // 向量检索
        List<Document> vectorResults = vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(query)
                .topK(topK)
                .similarityThreshold(0.7)
                .build());

        // 全文检索
        NativeQuery esQuery = NativeQuery.builder()
            .withQuery(q -> q.multiMatch(
                mm -> mm.fields("content", "title", "summary")
                        .query(query)))
            .withPageable(PageRequest.of(0, topK))
            .build();
        SearchHits<Document> esResults = esOps.search(esQuery, Document.class);

        // RRF (Reciprocal Rank Fusion) 合并
        return reciprocalRankFusion(vectorResults, esResults, topK);
    }
}
```

---

## 5. 检索增强模式

### 5.1 QuestionAnswerAdvisor (简单模式)

```java
ChatClient chatClient = ChatClient.builder(chatModel)
    .defaultAdvisors(
        new QuestionAnswerAdvisor(vectorStore, 
            SearchRequest.builder()
                .similarityThreshold(0.7)
                .topK(5)
                .build())
    )
    .defaultSystem("""
        基于以下参考文档回答用户问题。
        如果参考文档中没有相关信息，请明确说明。
        回答时请引用来源。
        
        参考文档:
        {question_answer_context}
        """)
    .build();
```

### 5.2 RetrievalAugmentationAdvisor (高级模式)

```java
@Bean
public RetrievalAugmentationAdvisor ragAdvisor(VectorStore vectorStore) {
    return RetrievalAugmentationAdvisor.builder()
        .queryTransformer(
            QueryTransformer.builder()
                .chatModel(chatModel)
                .build())
        .documentRetriever(
            VectorStoreDocumentRetriever.builder()
                .vectorStore(vectorStore)
                .similarityThreshold(0.7)
                .topK(5)
                .build())
        .documentAugmenter(
            DefaultDocumentAugmenter.builder()
                .order(Order.SEQUENTIAL)
                .build())
        .build();
}
```

### 5.3 检索增强流程

```
RetrievalAugmentationAdvisor 执行流程
════════════════════════════════════════════════════════════════════

用户查询: "差旅报销的标准是什么？"
    │
    ▼
┌─────────────────────────┐
│ Query Transformer        │  查询改写/扩展
│ "差旅报销标准" →         │
│ "公司差旅费用报销政策     │
│  和标准规定"             │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Document Retriever       │  向量检索
│ 从向量库中检索 Top-5     │
│ 相关文档片段              │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Document Augmenter       │  上下文组装
│ 将检索到的文档组装到      │
│ Prompt 的上下文部分       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ LLM Generation          │  LLM 生成回答
│ 基于检索到的上下文        │
│ 生成准确、有引用的回答    │
└─────────────────────────┘
```

---

## 6. 完整 RAG 示例

### 6.1 企业知识库问答系统

```java
@Configuration
public class RagConfig {

    @Bean
    public ChatClient ragChatClient(ChatModel chatModel, VectorStore vectorStore) {
        return ChatClient.builder(chatModel)
            .defaultSystem("""
                你是公司的智能助手，负责回答关于公司政策、流程和规章的问题。
                
                规则:
                1. 只基于提供的参考文档回答
                2. 如果文档中没有答案，明确说明并建议咨询相关部门
                3. 引用具体的文档来源
                4. 用专业但易懂的语言回答
                
                参考文档:
                {question_answer_context}
                """)
            .defaultAdvisors(
                new QuestionAnswerAdvisor(vectorStore,
                    SearchRequest.builder()
                        .topK(5)
                        .similarityThreshold(0.7)
                        .build()),
                MessageChatMemoryAdvisor.of(
                    InMemoryChatMemoryRepository.create(), 10),
                SimpleLoggerAdvisor.create()
            )
            .build();
    }
}
```

```java
@RestController
@RequestMapping("/api/knowledge")
public class KnowledgeController {

    private final ChatClient ragChatClient;

    @PostMapping("/ask")
    public ResponseEntity<KnowledgeAnswer> ask(@RequestBody QuestionRequest request) {
        KnowledgeAnswer answer = ragChatClient.prompt()
            .user(request.question())
            .call()
            .entity(KnowledgeAnswer.class);

        return ResponseEntity.ok(answer);
    }

    @PostMapping("/ask/stream")
    public Flux<String> askStream(@RequestBody QuestionRequest request) {
        return ragChatClient.prompt()
            .user(request.question())
            .stream()
            .content();
    }
}

record QuestionRequest(String question, String department) {}
record KnowledgeAnswer(
    String answer,
    List<String> sources,
    double confidence,
    boolean hasDefinitiveAnswer
) {}
```

### 6.2 文档上传与索引 API

```java
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final VectorStore vectorStore;

    @PostMapping("/upload")
    public ResponseEntity<UploadResult> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", defaultValue = "general") String category) {

        Resource resource = file.getResource();
        List<Document> documents = new TikaDocumentReader(resource).get();

        List<Document> enrichedDocs = documents.stream()
            .map(doc -> {
                doc.getMetadata().put("filename", file.getOriginalFilename());
                doc.getMetadata().put("category", category);
                doc.getMetadata().put("uploadedAt", Instant.now().toString());
                return doc;
            })
            .toList();

        List<Document> chunks = new TokenTextSplitter(800, 200, 5, 10000, true)
            .apply(enrichedDocs);

        vectorStore.add(chunks);

        return ResponseEntity.ok(new UploadResult(
            file.getOriginalFilename(), chunks.size(), category));
    }
}
```

---

## 7. 高级 RAG 模式

### 7.1 查询路由

```java
@Component
public class QueryRouter {

    private final ChatModel chatModel;

    public String route(String query) {
        RouteDecision decision = ChatClient.builder(chatModel)
            .build()
            .prompt()
            .system("""
                根据用户问题，决定应该查询哪个知识库:
                - HR: 人力资源相关问题（假期、薪资、晋升）
                - FINANCE: 财务相关问题（报销、预算、采购）
                - IT: IT 相关问题（系统、账号、网络）
                - GENERAL: 其他问题
                只返回类别代码。
                """)
            .user(query)
            .call()
            .entity(RouteDecision.class);

        return decision.category();
    }
}

record RouteDecision(String category, double confidence) {}
```

### 7.2 多跳检索

```java
@Component
public class MultiHopRetriever {

    private final VectorStore vectorStore;
    private final ChatModel chatModel;

    public List<Document> multiHopRetrieve(String query, int maxHops) {
        List<Document> allDocs = new ArrayList<>();
        String currentQuery = query;

        for (int hop = 0; hop < maxHops; hop++) {
            List<Document> docs = vectorStore.similaritySearch(
                SearchRequest.builder()
                    .query(currentQuery)
                    .topK(3)
                    .build());

            if (docs.isEmpty()) break;
            allDocs.addAll(docs);

            currentQuery = ChatClient.builder(chatModel).build()
                .prompt()
                .system("基于检索结果，生成一个后续问题以获取更多相关信息。")
                .user("原始问题: " + query + "\n已检索信息: " + summarize(docs))
                .call()
                .content();
        }

        return deduplicate(allDocs);
    }
}
```

### 7.3 父子文档检索

```java
@Service
public class ParentChildRetriever {

    private final VectorStore vectorStore;
    private final Map<String, Document> parentStore;

    public List<Document> retrieve(String query, int topK) {
        // 先检索子文档（小分块，精度高）
        List<Document> childDocs = vectorStore.similaritySearch(
            SearchRequest.builder().query(query).topK(topK).build());

        // 通过子文档的元数据找到父文档（上下文完整）
        return childDocs.stream()
            .map(child -> {
                String parentId = child.getMetadata().get("parent_id").toString();
                return parentStore.get(parentId);
            })
            .filter(Objects::nonNull)
            .distinct()
            .toList();
    }

    public void indexWithParentChild(List<Document> documents) {
        for (Document parent : documents) {
            String parentId = UUID.randomUUID().toString();
            parentStore.put(parentId, parent);

            List<Document> children = new TokenTextSplitter(300, 50, 5, 100, true)
                .apply(List.of(parent));

            children.forEach(child ->
                child.getMetadata().put("parent_id", parentId));

            vectorStore.add(children);
        }
    }
}
```

---

## 8. 性能优化

### 8.1 Embedding 缓存

```java
@Configuration
public class EmbeddingCacheConfig {

    @Bean
    public EmbeddingModel cachedEmbeddingModel(EmbeddingModel delegate) {
        return new CachingEmbeddingModel(delegate, CacheBuilder.newBuilder()
            .maximumSize(50_000)
            .expireAfterWrite(Duration.ofHours(6))
            .build());
    }
}
```

### 8.2 异步索引

```java
@Service
public class AsyncIndexingService {

    private final VectorStore vectorStore;
    private final ExecutorService indexingExecutor;

    @Async("indexingExecutor")
    public CompletableFuture<Integer> indexAsync(List<Document> documents) {
        List<Document> chunks = new TokenTextSplitter(800, 200, 5, 10000, true)
            .apply(documents);

        // 分批写入，每批 100 个
        Iterables.partition(chunks, 100).forEach(vectorStore::add);

        return CompletableFuture.completedFuture(chunks.size());
    }

    @Bean("indexingExecutor")
    public ExecutorService indexingExecutor() {
        return Executors.newVirtualThreadPerTaskExecutor();
    }
}
```

### 8.3 检索性能优化

| 优化策略 | 说明 | 预期收益 |
|---------|------|---------|
| **Embedding 缓存** | 缓存已计算的向量 | 减少 80%+ Embedding 调用 |
| **查询缓存** | 相同查询直接返回 | 响应时间从秒级降到毫秒 |
| **预计算 Top-K** | 热门查询预取结果 | 降低 P99 延迟 |
| **索引优化** | HNSW 参数调优 | 检索速度提升 2-5x |
| **批量操作** | 批量 add/search | 吞吐量提升 3-10x |
| **分片/分区** | 按类别/部门分区 | 缩小检索范围 |
| **Metadata 过滤** | 先过滤再检索 | 减少 50%+ 无关结果 |

---

## 关键术语速查

| 术语 | 说明 |
|------|------|
| **ETL Pipeline** | Extract-Transform-Load，文档加载→转换→存储 |
| **TokenTextSplitter** | 基于 Token 数量的文本分块器 |
| **VectorStore** | Spring AI 的向量数据库统一抽象 |
| **QuestionAnswerAdvisor** | 简单 RAG Advisor，自动检索并注入上下文 |
| **RetrievalAugmentationAdvisor** | 高级 RAG Advisor，支持查询改写、多路检索 |
| **Hybrid Search** | 向量检索 + 全文检索的混合模式 |
| **Parent-Child** | 小分块检索、大分块返回的策略 |
| **Semantic Chunking** | 基于语义相似度的智能分块 |

---

## 9. Agentic RAG 模式

### 9.1 自适应检索 Agent

```java
@Component
public class AgenticRAG {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final WebSearchTool webSearch;

    public String query(String question, int maxSteps) {
        String currentQuestion = question;
        StringBuilder accumulatedContext = new StringBuilder();

        for (int step = 0; step < maxSteps; step++) {
            RetrievalDecision decision = chatClient.prompt()
                .system("""
                    分析用户问题和已有信息，决定下一步操作:
                    - SEARCH_KB: 从知识库检索
                    - SEARCH_WEB: 从网络搜索
                    - GENERATE: 信息足够，生成回答
                    - REFINE: 改写问题重新检索
                    """)
                .user("问题: " + question + "\n已有信息: " + accumulatedContext)
                .call()
                .entity(RetrievalDecision.class);

            switch (decision.action()) {
                case "SEARCH_KB" -> {
                    List<Document> docs = vectorStore.similaritySearch(
                        SearchRequest.builder().query(currentQuestion).topK(5).build());
                    docs.forEach(d -> accumulatedContext.append(d.getText()).append("\n"));
                }
                case "SEARCH_WEB" -> {
                    String webResult = webSearch.search(currentQuestion);
                    accumulatedContext.append(webResult).append("\n");
                }
                case "GENERATE" -> {
                    return chatClient.prompt()
                        .system("基于以下信息回答用户问题: " + accumulatedContext)
                        .user(question)
                        .call()
                        .content();
                }
                case "REFINE" -> {
                    currentQuestion = decision.refinedQuery();
                }
            }
        }
        return chatClient.prompt()
            .system("基于有限信息尽可能回答: " + accumulatedContext)
            .user(question)
            .call()
            .content();
    }
}

record RetrievalDecision(String action, String refinedQuery, double confidence) {}
```

### 9.2 GraphRAG 知识图谱增强

```java
@Component
public class GraphRAGService {

    private final VectorStore vectorStore;
    private final Neo4jClient neo4jClient;
    private final ChatClient chatClient;

    public String query(String question) {
        List<Document> docs = vectorStore.similaritySearch(
            SearchRequest.builder().query(question).topK(5).build());

        String entities = chatClient.prompt()
            .system("从以下文本中提取实体和关系，返回 JSON 列表")
            .user(docs.stream().map(Document::getText).collect(Collectors.joining("\n")))
            .call()
            .content();

        String graphContext = neo4jClient.query(
            "MATCH (e:Entity)-[r]-(e2:Entity) WHERE e.name IN $entities RETURN e.name, type(r), e2.name",
            Map.of("entities", parseEntities(entities)))
            .stream().map(Object::toString).collect(Collectors.joining("\n"));

        return chatClient.prompt()
            .system("基于文档内容和知识图谱关系回答问题")
            .user("文档: " + docs + "\n知识图谱: " + graphContext + "\n问题: " + question)
            .call()
            .content();
    }
}
```

---

## 10. RAG 评估框架

### 10.1 评估指标

| 指标 | 说明 | 计算方式 |
|------|------|---------|
| **Faithfulness** | 回答是否忠于检索文档 | 回答中的声明 vs 文档事实 |
| **Answer Relevancy** | 回答与问题的相关性 | 回答嵌入与问题嵌入的相似度 |
| **Context Precision** | 检索文档的精确度 | 相关文档在检索结果中的排名 |
| **Context Recall** | 检索文档的召回率 | 所需信息被检索到的比例 |
| **Answer Correctness** | 回答正确性 | 与标准答案的 F1 分数 |

### 10.2 自动化评估

```java
@Component
public class RagEvaluator {

    private final ChatClient judgeClient;

    public EvaluationResult evaluate(EvalSample sample) {
        FaithfulnessScore faithfulness = judgeClient.prompt()
            .system("""
                评估回答是否忠于提供的上下文文档。
                评分 0-1，列出任何与文档矛盾的回答内容。
                """)
            .user("上下文: " + sample.context() + "\n回答: " + sample.answer())
            .call()
            .entity(FaithfulnessScore.class);

        RelevancyScore relevancy = judgeClient.prompt()
            .system("评估回答与问题的相关性，评分 0-1")
            .user("问题: " + sample.question() + "\n回答: " + sample.answer())
            .call()
            .entity(RelevancyScore.class);

        return new EvaluationResult(faithfulness, relevancy);
    }
}

record EvalSample(String question, String context, String answer, String groundTruth) {}
record FaithfulnessScore(double score, List<String> contradictions) {}
record RelevancyScore(double score, String reasoning) {}
record EvaluationResult(FaithfulnessScore faithfulness, RelevancyScore relevancy) {}
```

### 10.3 评估数据集管理

```
RAG 评估数据集结构
════════════════════════════════════════════════════════════════════

src/test/resources/rag-eval/
├── dataset.jsonl              # 评估数据集
│   {"question": "...", "groundTruth": "...", "context": [...]}
├── results/                   # 评估结果
│   ├── 2026-04-30.json
│   └── trend.json             # 趋势对比
└── thresholds.yml             # 通过阈值
    faithfulness: 0.85
    relevancy: 0.80
    context_precision: 0.75
    context_recall: 0.70
```

---

## 11. 增量索引策略

### 11.1 基于文件哈希的增量更新

```java
@Service
public class IncrementalIndexingService {

    private final VectorStore vectorStore;
    private final DocumentHashRepository hashRepo;

    public IndexingResult incrementalIndex(List<Resource> files) {
        int added = 0, updated = 0, skipped = 0;

        for (Resource file : files) {
            String currentHash = computeHash(file);
            String filename = file.getFilename();
            Optional<DocumentHash> existing = hashRepo.findByFilename(filename);

            if (existing.isPresent() && existing.get().getHash().equals(currentHash)) {
                skipped++;
                continue;
            }

            List<Document> docs = new TikaDocumentReader(file).get();
            List<Document> chunks = new TokenTextSplitter(800, 200, 5, 10000, true)
                .apply(docs);

            if (existing.isPresent()) {
                vectorStore.delete(List.of(existing.get().getDocumentIds()));
                updated++;
            } else {
                added++;
            }

            vectorStore.add(chunks);

            hashRepo.save(DocumentHash.builder()
                .filename(filename)
                .hash(currentHash)
                .documentIds(chunks.stream().map(Document::getId).toList())
                .indexedAt(Instant.now())
                .build());
        }

        return new IndexingResult(added, updated, skipped);
    }

    private String computeHash(Resource resource) {
        try (InputStream is = resource.getInputStream()) {
            return DigestUtils.sha256Hex(is);
        }
    }
}

record IndexingResult(int added, int updated, int skipped) {}
```

### 11.2 事件驱动增量索引

```
增量索引数据流
════════════════════════════════════════════════════════════════════

文件变更事件源:
────────────────────────────────────────────────────────────────
┌──────────┐     ┌──────────┐     ┌──────────────┐
│ Git Push │────▶│ Webhook  │────▶│ Kafka Topic  │
│ 文档更新  │     │ 触发器   │     │ doc-events   │
└──────────┘     └──────────┘     └──────┬───────┘
                                          │
┌──────────┐     ┌──────────┐     ┌──────▼───────┐
│ S3 Event │────▶│ Lambda   │────▶│ Spring AI    │
│ 新文件   │     │ 转发事件  │     │ Indexer      │
└──────────┘     └──────────┘     └──────────────┘
                                          │
                                  ┌──────▼───────┐
                                  │ 增量更新      │
                                  │ 1. 计算 Hash  │
                                  │ 2. 对比变更   │
                                  │ 3. 删除旧块   │
                                  │ 4. 索引新块   │
                                  └──────────────┘
```

---

## 12. Metadata 过滤实战

### 12.1 过滤表达式

```java
@Service
public class FilteredSearchService {

    public List<Document> searchByDepartment(String query, String department) {
        return vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(query)
                .topK(5)
                .filterExpression(
                    new Expression(EQ, new Key("department"), new Value(department)))
                .build());
    }

    public List<Document> searchByDateRange(String query, LocalDate from, LocalDate to) {
        return vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(query)
                .topK(5)
                .filterExpression(
                    new Expression(AND,
                        new Expression(GTE, new Key("date"), new Value(from.toString())),
                        new Expression(LTE, new Key("date"), new Value(to.toString()))))
                .build());
    }

    public List<Document> searchBySecurityLevel(String query, int userLevel) {
        return vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(query)
                .topK(5)
                .filterExpression(
                    new Expression(LTE, new Key("security_level"), new Value(userLevel)))
                .build());
    }
}
```

### 12.2 Metadata 字段设计规范

```
Metadata 字段设计规范
════════════════════════════════════════════════════════════════════

必填字段:
────────────────────────────────────────────────────────────────
• source: 文件名 / URL（用于引用展示）
• chunk_index: 分块序号（用于父子文档关联）
• total_chunks: 总分块数（用于进度展示）
• indexed_at: 索引时间（用于增量更新）

推荐字段:
────────────────────────────────────────────────────────────────
• department: 部门（HR/Finance/IT）
• category: 分类（policy/guide/faq）
• security_level: 安全级别 (1=公开 2=内部 3=机密)
• version: 文档版本号
• language: 语言（zh/en）

过滤性能优化:
────────────────────────────────────────────────────────────────
• PGVector: WHERE 子句过滤，支持 B-tree 索引
• Milvus: 标量字段过滤，支持倒排索引
• Elasticsearch: Bool Query + Vector Query 联合
```

---

## 13. RAG 调试技巧

### 13.1 检索质量调试 Advisor

```java
@Component
public class RetrievalDebugAdvisor implements CallAroundAdvisor {

    private final VectorStore vectorStore;

    @Override
    public AdvisedResponse aroundCall(AdvisedRequest request, CallAroundAdvisorChain chain) {
        String query = request.userText();

        List<Document> results = vectorStore.similaritySearch(
            SearchRequest.builder().query(query).topK(10).build());

        log.info("=== RAG Debug ===");
        log.info("Query: {}", query);
        for (int i = 0; i < results.size(); i++) {
            Document doc = results.get(i);
            log.info("  [{}] score={:.3f} source={} chunk={}/{} text_len={}",
                i, doc.getScore(), doc.getMetadata().get("source"),
                doc.getMetadata().get("chunk_index"),
                doc.getMetadata().get("total_chunks"),
                doc.getText().length());
            log.info("      preview: {}",
                doc.getText().substring(0, Math.min(100, doc.getText().length())));
        }

        return chain.nextAroundCall(request);
    }

    @Override
    public String getName() { return "RetrievalDebug"; }
}
```

### 13.2 常见 RAG 问题与排查

| 问题 | 症状 | 排查方法 | 解决方案 |
|------|------|---------|---------|
| **检索不到** | 回答"我没有相关信息" | 检查 Embedding 模型是否一致 | 统一 Embedding 模型 |
| **检索不准** | 回答偏离主题 | 检查 Top-K 参数和相似度阈值 | 降低阈值或增加 Top-K |
| **幻觉** | 回答包含文档中没有的信息 | 检查 System Prompt 是否强调"只基于文档" | 加强 Prompt 约束 |
| **重复** | 同一内容多次出现 | 检查文档去重逻辑 | 按内容 Hash 去重 |
| **分块断裂** | 回答不完整 | 检查分块大小和重叠 | 增大 overlap 到 20-30% |
| **语言混乱** | 中英混杂回答 | 检查文档语言标记 | 添加 language metadata 过滤 |

---

## 14. GraphRAG 实战

### 14.1 知识图谱增强检索

```java
@Service
public class GraphRagService {

    private final Neo4jClient neo4jClient;
    private final ChatClient chatClient;
    private final EmbeddingModel embeddingModel;

    public GraphRagResponse query(String question) {
        float[] queryEmbedding = embeddingModel.embed(question);

        List<GraphNode> relevantNodes = findSimilarNodes(queryEmbedding, 5);
        List<GraphRelation> relations = findRelations(relevantNodes);
        String graphContext = buildGraphContext(relevantNodes, relations);

        String answer = chatClient.prompt()
            .system("""
                基于以下知识图谱信息回答问题。
                图谱节点: {nodes}
                图谱关系: {relations}
                综合以上信息，给出准确、完整的回答。
                """)
            .user(question)
            .call()
            .content();

        return new GraphRagResponse(answer, relevantNodes, relations);
    }

    private List<GraphNode> findSimilarNodes(float[] embedding, int topK) {
        return neo4jClient.query("""
            MATCH (n:Entity)
            WHERE n.embedding IS NOT NULL
            WITH n, gds.similarity.cosine(n.embedding, $embedding) AS score
            ORDER BY score DESC
            LIMIT $topK
            RETURN n.name AS name, n.type AS type, n.description AS description, score
            """)
            .bind(embedding).to("embedding")
            .bind(topK).to("topK")
            .fetch().mappedBy((type, record) -> new GraphNode(
                record.get("name").asString(),
                record.get("type").asString(),
                record.get("description").asString(),
                record.get("score").asDouble()))
            .all();
    }

    private String buildGraphContext(List<GraphNode> nodes, List<GraphRelation> relations) {
        StringBuilder sb = new StringBuilder("知识图谱:\n");
        nodes.forEach(n -> sb.append("- ").append(n).append("\n"));
        relations.forEach(r -> sb.append("- ").append(r).append("\n"));
        return sb.toString();
    }
}

record GraphNode(String name, String type, String description, double score) {}
record GraphRelation(String source, String target, String relationType) {}
record GraphRagResponse(String answer, List<GraphNode> nodes, List<GraphRelation> relations) {}
```

### 14.2 GraphRAG vs Vector RAG 对比

```
GraphRAG vs Vector RAG
════════════════════════════════════════════════════════════════════

维度          Vector RAG          GraphRAG             混合模式
──────────────────────────────────────────────────────────────────
检索方式      语义相似度          图结构遍历            向量初筛 + 图扩展
擅长          事实性问答          关系推理、多跳问答    两者兼具
构建成本      低（自动 Embedding） 高（需抽取实体关系）  中等
存储          向量数据库          图数据库              两者都要
查询延迟      ~50ms              ~100ms               ~150ms
典型场景      "差旅标准是什么"     "谁审核谁的报销"      企业级知识库
──────────────────────────────────────────────────────────────────

推荐方案: 混合模式
────────────────────────────────────────────────────────────────
1. Vector RAG 做初筛 → 找到相关文档片段
2. GraphRAG 做扩展 → 沿实体关系补充上下文
3. 合并上下文送入 LLM → 生成综合回答
```

---

## 15. 多租户 RAG 隔离

### 15.1 租户级数据隔离

```java
@Service
public class TenantRagService {

    private final VectorStore vectorStore;

    public String query(String tenantId, String question) {
        return chatClient.prompt()
            .advisors(QuestionAnswerAdvisor.builder()
                .vectorStore(vectorStore)
                .searchRequest(SearchRequest.builder()
                    .query(question)
                    .topK(5)
                    .filterExpression(
                        new Expression(EQ, new Key("tenant_id"), new Value(tenantId)))
                    .build())
                .build())
            .user(question)
            .call()
            .content();
    }

    public void indexDocument(String tenantId, Document document) {
        document.getMetadata().put("tenant_id", tenantId);
        vectorStore.add(List.of(document));
    }
}
```

### 15.2 多租户 RAG 架构

```
多租户 RAG 架构
════════════════════════════════════════════════════════════════════

方案 1: Metadata 过滤（推荐，简单高效）
────────────────────────────────────────────────────────────────
• 共享 VectorStore，每条记录带 tenant_id
• 查询时 filterExpression: tenant_id = {current_tenant}
• 优点: 成本低，运维简单
• 缺点: 数据量大时性能下降

方案 2: Schema 隔离（中等规模）
────────────────────────────────────────────────────────────────
• 每个 tenant 一个 PGVector Schema
• 查询时切换 Schema: SET search_path = tenant_{id}
• 优点: 数据完全隔离
• 缺点: 管理复杂度随租户增加

方案 3: 独立 VectorStore（大型/合规要求）
────────────────────────────────────────────────────────────────
• 每个 tenant 独立的 Milvus Collection 或 PGVector 实例
• 完全物理隔离
• 优点: 最高级别隔离
• 缺点: 成本高，资源开销大

选型建议:
────────────────────────────────────────────────────────────────
• < 100 租户 → Metadata 过滤
• 100-1000 租户 → Schema 隔离
• > 1000 租户或有合规要求 → 独立 VectorStore
```

---

## 16. RAG + Agent 结合模式

### 16.1 Agentic RAG 实现

```java
@Service
public class AgenticRagService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final WebSearchTool webSearchTool;

    public String query(String question) {
        boolean needWebSearch = chatClient.prompt()
            .system("判断以下问题是否需要搜索互联网获取最新信息，只回答 true 或 false")
            .user(question)
            .call()
            .entity(Boolean.class);

        StringBuilder context = new StringBuilder();

        context.append("=== 内部知识库 ===\n");
        List<Document> docs = vectorStore.similaritySearch(
            SearchRequest.builder().query(question).topK(5).build());
        docs.forEach(d -> context.append(d.getText()).append("\n\n"));

        if (needWebSearch) {
            context.append("=== 互联网搜索 ===\n");
            String webResult = webSearchTool.search(question);
            context.append(webResult).append("\n\n");
        }

        return chatClient.prompt()
            .system("""
                基于以下信息回答问题。如果信息不足以回答，请明确说明。
                优先使用内部知识库信息，互联网信息仅作补充。
                
                {context}
                """)
            .user(question)
            .call()
            .content();
    }
}
```

### 16.2 Self-RAG 模式

```java
@Service
public class SelfRagService {

    public SelfRagResult query(String question) {
        RetrievalDecision decision = decideRetrieval(question);

        if (!decision.needsRetrieval()) {
            return new SelfRagResult(
                chatClient.prompt().user(question).call().content(),
                "直接回答", List.of(), 1.0);
        }

        List<Document> docs = vectorStore.similaritySearch(
            SearchRequest.builder().query(question).topK(decision.topK()).build());

        RelevanceCheck check = checkRelevance(question, docs);
        if (!check.isRelevant()) {
            String rewritten = rewriteQuery(question);
            docs = vectorStore.similaritySearch(
                SearchRequest.builder().query(rewritten).topK(5).build());
        }

        String answer = generateAnswer(question, docs);
        HallucinationCheck hallucination = verifyAnswer(answer, docs);

        return new SelfRagResult(answer, "Self-RAG",
            docs, hallucination.confidence());
    }

    private RetrievalDecision decideRetrieval(String question) {
        return chatClient.prompt()
            .system("判断问题是否需要检索知识库。返回 JSON: {needsRetrieval: bool, topK: int}")
            .user(question)
            .call()
            .entity(RetrievalDecision.class);
    }

    private HallucinationCheck verifyAnswer(String answer, List<Document> docs) {
        String context = docs.stream().map(Document::getText).collect(Collectors.joining("\n"));
        return chatClient.prompt()
            .system("""
                验证回答是否基于给定上下文。返回: {isGrounded: bool, confidence: 0-1}
                上下文: %s
                """.formatted(context))
            .user(answer)
            .call()
            .entity(HallucinationCheck.class);
    }
}

record RetrievalDecision(boolean needsRetrieval, int topK) {}
record RelevanceCheck(boolean isRelevant) {}
record HallucinationCheck(boolean isGrounded, double confidence) {}
record SelfRagResult(String answer, String strategy, List<Document> sources, double confidence) {}
```

---

*Last updated: 2026-04*

## Related

- [[RAG系统/RAG-in-nutshell]] — RAG (检索增强生成) 速成指南 (共享: embedding, rag, retrieval, vector-database)
- [[RAG系统/RAG_Systems]] — RAG 系统 (RAG Systems) (共享: embedding, rag, retrieval, vector-database)
- [[RAG系统/README_Advanced]] — RAG高级实践 2026 (共享: embedding, rag, retrieval, vector-database)
- [[_synthesis/rag-vector-database]] — RAG 系统 × 向量数据库 (共享: embedding, rag, retrieval, vector-database)
- [[RAG系统/RAG_Frameworks/Dify_Deep_Dive.md|Dify_Deep_Dive]]
- [[RAG系统/Vector_Databases/Weaviate_Deep_Dive.md|Weaviate_Deep_Dive]]
- [[RAG系统/RAG_Frameworks/Flowise_Deep_Dive.md|Flowise_Deep_Dive]]
- [[RAG系统/RAG_Frameworks/LangFlow_Deep_Dive.md|LangFlow_Deep_Dive]]
