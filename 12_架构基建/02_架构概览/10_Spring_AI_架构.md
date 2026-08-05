---
title: Spring AI 系统架构设计
category: 12-architecture-infrastructure
tags: ["architecture", "infrastructure", "kubernetes", "high-availability"]
summary: "> 📚 **Spring AI 基础**: 如果你还不熟悉 Spring AI 的核心概念，请先阅读 [Spring AI 深度解析](01_数学基础/11_Java生态与AI/03_Spring_AI_深入分析.md)。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Spring Ai Architecture"
  - "Spring AI Architecture"
  - Spring_AI_Architecture
sources: []

name_zh: "Spring AI 系统架构设计"
---
# Spring AI 系统架构设计

> 中文简称：Spring AI 系统架构设计

> 📚 **Spring AI 基础**: 如果你还不熟悉 Spring AI 的核心概念，请先阅读 [Spring AI 深度解析](01_数学基础/11_Java生态与AI/03_Spring_AI_深入分析.md)。
>
> **一句话理解**: Spring AI 架构是 Java 企业级 AI 应用的设计蓝图 —— 用 Spring 的方式将 LLM、向量存储、RAG Pipeline 和 Agent 编排整合到统一的企业架构中。

> **相关文档**: [AI 系统架构全景图](./03_AI_系统_架构_2026.md) | [Spring AI 深度解析](01_数学基础/11_Java生态与AI/03_Spring_AI_深入分析.md) | [多租户架构](./09_Multi_Tenant_架构.md) | [高可用设计](./06_高可用_2026.md)

---

## 目录

1. [Spring AI 在 AI 架构中的定位](#1-spring-ai-在-ai-架构中的定位)
2. [Spring AI 核心架构](#2-spring-ai-核心架构)
3. [分层架构设计](#3-分层架构设计)
4. [集成架构模式](#4-集成架构模式)
5. [微服务 AI 架构](#5-微服务-ai-架构)
6. [性能与扩展性设计](#6-性能与扩展性设计)
7. [可观测性架构](#7-可观测性架构)
8. [架构决策记录 (ADR)](#8-架构决策记录-adr)

---

## 1. Spring AI 在 AI 架构中的定位

### 1.1 架构定位图

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AI 系统架构中的 Spring AI                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  L4 应用层    ┌───────────┐ ┌───────────┐ ┌───────────┐           │
│               │  Chat UI  │ │ API 网关   │ │ Admin UI  │           │
│               └─────┬─────┘ └─────┬─────┘ └─────┬─────┘           │
│                     │            │              │                   │
│  L3 服务层    ┌─────▼────────────▼──────────────▼─────┐           │
│               │          Spring AI Service Layer        │           │
│               │  ┌─────────────────────────────────┐   │           │
│               │  │ ChatClient │ Advisor │ ETL │ RAG │   │           │
│               │  └─────────────────────────────────┘   │           │
│               │  ┌─────────────────────────────────┐   │           │
│               │  │ Model Abstraction │ Vector Store │   │           │
│               │  └─────────────────────────────────┘   │           │
│               └─────────────────┬───────────────────────┘           │
│                                 │                                   │
│  L2 数据层    ┌────────────────▼───────────────────────┐           │
│               │ PGVector │ Redis │ Kafka │ S3 │ Oracle │           │
│               └────────────────────────────────────────┘           │
│                                                                     │
│  L1 基础设施  ┌────────────────────────────────────────┐           │
│               │ K8s │ JVM │ Docker │ GraalVM │ GPU     │           │
│               └────────────────────────────────────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Spring AI 的架构角色

| 角色 | 说明 |
|------|------|
| **LLM 统一抽象层** | 屏蔽不同 LLM 提供商的差异，统一 Chat/Embedding/Image API |
| **RAG 编排引擎** | 文档加载 → 分块 → 嵌入 → 检索 → 生成的完整 Pipeline |
| **Agent 运行时** | Function Calling、Tool Use、多轮对话编排 |
| **企业集成桥梁** | 将 AI 能力无缝接入 Spring Security、Spring Data、Spring Cloud |

---

## 2. Spring AI 核心架构

### 2.1 核心抽象模型

```
Spring AI 核心抽象
════════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────┐
│                     ChatClient (高层 API)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Prompt   │  │ Advisor  │  │   Tool   │  │ Structur │     │
│  │  Template │  │  Chain   │  │ Calling  │  │  Output  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└───────────────────────────┬───────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                    Model API (中层 API)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   Chat   │  │ Embedding│  │  Image   │  │  Audio   │     │
│  │  Model   │  │  Model   │  │  Model   │  │  Model   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└───────────────────────────┬───────────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                  Vector Store (向量存储抽象)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ PGVector │  │  Milvus  │  │  Chroma  │  │  Redis   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└───────────────────────────────────────────────────────────────┘
```

### 2.2 ChatClient API

```java
var chatClient = ChatClient.builder(chatModel)
    .defaultSystem("你是一个专业的{domain}助手")
    .defaultAdvisors(
        MessageChatMemoryAdvisor.of(chatMemory),
        SimpleLoggerAdvisor.create()
    )
    .defaultTools("searchDocuments", "queryDatabase")
    .build();

String response = chatClient.prompt()
    .user("分析这份财报中的风险因素")
    .system(s -> s.param("domain", "金融分析"))
    .call()
    .content();
```

### 2.3 Advisor 模式

```
Advisor 链：Spring AI 的中间件模式
════════════════════════════════════════════════════════════════════

请求流 ────────▶
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  Advisor 1: Chat Memory (注入对话历史)                       │
│      │                                                     │
│      ▼                                                     │
│  Advisor 2: RAG (检索增强文档)                               │
│      │                                                     │
│      ▼                                                     │
│  Advisor 3: Rate Limiting (限流控制)                        │
│      │                                                     │
│      ▼                                                     │
│  Advisor 4: Logging (请求日志)                              │
│      │                                                     │
│      ▼                                                     │
│  [ChatModel 调用]                                           │
│      │                                                     │
│  ◀── 响应流回                                               │
│                                                            │
└────────────────────────────────────────────────────────────┘
◀──────── 响应流
```

---

## 3. 分层架构设计

### 3.1 企业级 Spring AI 分层

```
┌─────────────────────────────────────────────────────────────┐
│                   Controller Layer                           │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐  │
│  │ ChatCtrl  │ │ RAG Ctrl  │ │Agent Ctrl │ │ AdminCtrl │  │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘  │
├────────┼─────────────┼─────────────┼─────────────┼──────────┤
│        └─────────────┼─────────────┼─────────────┘          │
│                   Service Layer                               │
│  ┌─────────────────▼─────────────────▼─────────────────┐   │
│  │            Spring AI Services                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │ChatSvc   │ │ RAG Svc  │ │ AgentSvc │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │EmbedSvc  │ │VectorSvc │ │ ToolSvc  │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  └──────────────────────┬──────────────────────────────┘   │
├─────────────────────────┼──────────────────────────────────┤
│                      Integration Layer                      │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │   │
│  │  │OpenAI  │ │Milvus  │ │ Kafka  │ │Tika    │       │   │
│  │  │Client  │ │Client  │ │Client  │ │Parser  │       │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │   │
│  └─────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│                      Infrastructure Layer                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │Security  │ │Config    │ │Metrics   │ │Logging   │     │
│  │Filter    │ │Properties│ │Registry  │ │Framework │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 包结构规范

```
com.example.ai/
├── config/                        # 配置类
│   ├── AiConfig.java             # Spring AI Bean 配置
│   ├── VectorStoreConfig.java    # 向量存储配置
│   └── SecurityConfig.java       # 安全配置
├── controller/                    # REST 控制器
│   ├── ChatController.java
│   ├── RagController.java
│   └── AgentController.java
├── service/                       # 业务逻辑层
│   ├── ChatService.java
│   ├── RagService.java
│   ├── AgentService.java
│   └── EmbeddingService.java
├── advisor/                       # 自定义 Advisor
│   ├── RateLimitAdvisor.java
│   ├── ContentFilterAdvisor.java
│   └── AuditLogAdvisor.java
├── tool/                          # Function Calling 工具
│   ├── DatabaseQueryTool.java
│   ├── WebSearchTool.java
│   └── DocumentSearchTool.java
├── model/                         # 数据模型
│   ├── dto/                      # 数据传输对象
│   ├── entity/                   # JPA 实体
│   └── mapper/                   # MapStruct 映射器
├── loader/                        # 文档加载器
│   ├── PdfDocumentLoader.java
│   └── WebDocumentLoader.java
└── exception/                     # 异常处理
    ├── AiExceptionHandler.java
    └── RateLimitExceededException.java
```

---

## 4. 集成架构模式

### 4.1 多模型集成

```java
@Configuration
public class MultiModelConfig {

    @Bean
    public ChatModel primaryChatModel() {
        return new OpenAiChatModel(openAiApi(), ChatOptionsBuilder.builder()
            .model("gpt-4o")
            .temperature(0.7)
            .build());
    }

    @Bean
    public ChatModel fallbackChatModel() {
        return new OllamaChatModel(ollamaApi(), ChatOptionsBuilder.builder()
            .model("qwen2.5:72b")
            .build());
    }

    @Bean
    public ChatModel routingChatModel(
            ChatModel primary, ChatModel fallback) {
        return new FallbackChatModel(primary, fallback);
    }
}
```

```
多模型路由架构
════════════════════════════════════════════════════════════════════

                    ┌──────────────┐
                    │  请求路由器    │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
     ┌────────▼──┐  ┌──────▼───┐  ┌────▼────────┐
     │  GPT-4o   │  │ Claude   │  │ Qwen2.5-72B │
     │ (复杂推理) │  │ (长文本)  │  │  (本地部署)  │
     └───────────┘  └──────────┘  └─────────────┘

路由策略:
────────────────────────────────────────────────────────────────
• 基于任务类型: 代码 → GPT-4o, 长文 → Claude, 私密数据 → 本地
• 基于成本: 日常 → 本地, 关键 → Cloud
• 基于延迟: 实时 → 本地, 批量 → Cloud
• Fallback: Cloud 不可用 → 本地模型
```

### 4.2 向量存储集成

```java
@Configuration
public class VectorStoreConfig {

    @Bean
    public VectorStore pgvectorStore(JdbcTemplate jdbcTemplate,
                                      EmbeddingModel embeddingModel) {
        return new PgVectorStore.Builder(jdbcTemplate, embeddingModel)
            .dimensions(1536)
            .distanceType(CosineDistance.INSTANCE)
            .indexType(HnswIndex.builder()
                .m(16)
                .efConstruction(64)
                .build())
            .initializeSchema(true)
            .build();
    }

    @Bean
    public VectorStore milvusStore(MilvusServiceClient milvusClient,
                                    EmbeddingModel embeddingModel) {
        return MilvusVectorStore.builder(milvusClient, embeddingModel)
            .collectionName("enterprise_docs")
            .databaseName("ai_knowledge")
            .metricType(MetricType.COSINE)
            .build();
    }
}
```

### 4.3 文档处理 Pipeline

```
Spring AI ETL Pipeline
════════════════════════════════════════════════════════════════════

┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Reader   │───▶│ Transformer│──▶│  Writer  │──▶│  Vector  │
│  文档读取  │    │  文本处理   │    │  写入存储 │    │  Store   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘

Reader 实现:
────────────────────────────────────────────────────────────────
• PagePdfDocumentReader      Adobe PDF 解析
• TikaDocumentReader         Apache Tika（支持 50+ 格式）
• JsonReader                 JSON 文档读取
• MarkdownDocumentReader     Markdown 解析

Transformer 实现:
────────────────────────────────────────────────────────────────
• TokenTextSplitter          基于 Token 数量分块
• ContentFormatTransformer   格式统一化
• KeywordExtractor           关键词提取
• SummaryExtractor           摘要提取

Writer 实现:
────────────────────────────────────────────────────────────────
• VectorStoreWriter          写入向量数据库
• FileDocumentWriter         写入文件系统
```

---

## 5. 微服务 AI 架构

### 5.1 Spring Cloud AI 微服务

```
┌─────────────────────────────────────────────────────────────────┐
│                  Spring Cloud AI 微服务架构                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    API Gateway (Spring Cloud Gateway)      │ │
│  │        路由 │ 限流 │ 认证 │ AI 请求增强                     │ │
│  └───────────────────────┬───────────────────────────────────┘ │
│                          │                                      │
│  ┌───────────┬───────────┼───────────┬───────────┐            │
│  │           │           │           │           │            │
│  ▼           ▼           ▼           ▼           ▼            │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│ │ Chat   │ │  RAG   │ │ Agent  │ │Embed   │ │ Admin  │     │
│ │Service │ │Service │ │Service │ │Service │ │Service │     │
│ │        │ │        │ │        │ │        │ │        │     │
│ │Spring  │ │Spring  │ │Spring  │ │Spring  │ │Spring  │     │
│ │AI Chat │ │AI RAG  │ │AI Agent│ │AI Embd │ │Boot    │     │
│ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘     │
│     │          │          │          │          │            │
│  ┌──▼──────────▼──────────▼──────────▼──────────▼──┐        │
│  │            Service Discovery (Nacos/Eureka)       │        │
│  └──────────────────────────────────────────────────┘        │
│     │          │          │          │                        │
│  ┌──▼──────────▼──────────▼──────────▼──────────────────┐   │
│  │     共享基础设施                                       │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │ PGVector│ │  Kafka  │ │  Redis  │ │  MinIO  │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 服务间通信

| 通信方式 | 适用场景 | 实现 |
|---------|---------|------|
| **同步 REST** | 简单查询、低延迟 | OpenFeign / RestClient |
| **异步消息** | 批量处理、解耦 | Kafka + Spring Kafka |
| **流式 SSE** | LLM 流式响应 | Spring WebFlux + SSE |
| **gRPC** | 内部服务高性能通信 | grpc-spring-boot-starter |

---

## 6. 性能与扩展性设计

### 6.1 并发模型

```
Java 21 虚拟线程 + Spring AI
════════════════════════════════════════════════════════════════════

传统线程模型 (Platform Threads):
────────────────────────────────────────────────────────────────
  200 个并发请求 = 200 个 OS 线程 × 2MB 栈 = 400MB 内存

虚拟线程模型 (Virtual Threads):
────────────────────────────────────────────────────────────────
  10,000 个并发请求 = 10,000 个虚拟线程 × ~1KB = ~10MB 内存
  背后仅使用少量 OS 线程（Carrier Threads）

配置:
────────────────────────────────────────────────────────────────
spring.threads.virtual.enabled=true

@SpringBootApplication
public class AiApplication {
    public static void main(String[] args) {
        SpringApplication.run(AiApplication.class, args);
    }
}
```

### 6.2 缓存策略

```java
@Configuration
@EnableCaching
public class AiCacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return CacheManagerBuilder.newBuilder()
            .withCache("embeddingCache",
                CacheConfigurationBuilder.newCacheConfigurationBuilder(
                    String.class, float[].class,
                    ResourcePoolsBuilder.heap(10000)
                        .offheap(100, MemoryUnit.MB)))
            .withCache("chatResponseCache",
                CacheConfigurationBuilder.newCacheConfigurationBuilder(
                    String.class, String.class,
                    ResourcePoolsBuilder.heap(5000)))
            .build();
    }
}
```

```
三级缓存架构
════════════════════════════════════════════════════════════════════

L1: 本地缓存 (Caffeine)
├── 热点 Embedding 缓存
├── 相同 Prompt 缓存
└── TTL: 5 分钟

L2: 分布式缓存 (Redis)
├── 跨实例共享 Embedding
├── 用户会话上下文
└── TTL: 1 小时

L3: 向量缓存 (Vector Store)
├── 语义相似度缓存（SemCache）
├── 相似度阈值 > 0.95 时复用
└── 无 TTL，定期清理
```

### 6.3 限流设计

```java
@Component
public class AiRateLimitAdvisor implements CallAroundAdvisor {

    private final RateLimiter rateLimiter;
    private final TokenBucket tokenBucket;

    @Override
    public AdvisedResponse aroundCall(AdvisedRequest request, CallAroundAdvisorChain chain) {
        String userId = extractUserId(request);
        if (!rateLimiter.tryAcquire(userId)) {
            throw new RateLimitExceededException("AI 请求过于频繁，请稍后再试");
        }
        tokenBucket.consume(request.prompt().getContents().length());
        return chain.nextAroundCall(request);
    }
}
```

---

## 7. 可观测性架构

### 7.1 Micrometer 指标

```
Spring AI 可观测性指标体系
════════════════════════════════════════════════════════════════════

Metrics (Micrometer → Prometheus):
────────────────────────────────────────────────────────────────
• spring.ai.chat.calls.total           聊天调用总数
• spring.ai.chat.calls.duration        调用延迟分布
• spring.ai.chat.tokens.used           Token 消耗量
• spring.ai.embedding.calls.total      Embedding 调用数
• spring.ai.vector.store.similarity    向量检索延迟
• spring.ai.cost.daily                 每日成本

Tracing (Micrometer Tracing → Zipkin/Jaeger):
────────────────────────────────────────────────────────────────
• ChatModel.call()        Span: "ai.chat.completion"
• VectorStore.search()    Span: "ai.vector.search"
• EmbeddingModel.embed()  Span: "ai.embedding"
• Tool execution          Span: "ai.tool.execution"

Logging (SLF4J + Logback):
────────────────────────────────────────────────────────────────
• 请求/响应日志（脱敏后）
• Token 使用量日志
• 异常和 Fallback 日志
```

### 7.2 Grafana Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│                  Spring AI Dashboard                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │   AI 请求 QPS        │  │   Token 消耗/小时    │          │
│  │   ▅▃▇▅▆▇▃▅▇▆▅▃▇    │  │   ▂▄▆█▇▅▃▂▄▆█▇▅    │          │
│  │   p50: 1.2s         │  │   总计: 2.5M        │          │
│  │   p99: 4.8s         │  │   成本: $127.50     │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │   模型使用分布        │  │   错误率             │          │
│  │   GPT-4o: 45%       │  │   429 Rate Limit: 2% │          │
│  │   Claude: 30%       │  │   500 Server: 0.1%  │          │
│  │   Qwen: 25%         │  │   Timeout: 0.5%     │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. 架构决策记录 (ADR)

### ADR-001: 选择 Spring AI 还是 LangChain4j

| 维度 | Spring AI | LangChain4j |
|------|-----------|-------------|
| **与 Spring 生态集成** | 原生 | 需要 Starter 桥接 |
| **抽象层级** | 高层 (ChatClient) + 低层 | 偏中层 |
| **Spring Boot 配置** | application.yml 原生支持 | 需额外配置 |
| **向量存储支持** | 官方维护 10+ | 社区维护 |
| **社区规模** | Spring 社区 | 独立社区 |
| **推荐场景** | Spring 企业项目 | 非 Spring Java 项目 |

**决策**: Spring Boot 项目优先选 Spring AI；纯 Java 项目或需要更多灵活控制时选 LangChain4j。

### ADR-002: 向量数据库选择

| 向量库 | 适用场景 | Spring AI 支持 |
|--------|---------|---------------|
| **PGVector** | 已有 PostgreSQL，中等规模 | ✅ 官方 |
| **Milvus** | 超大规模，10 亿+ 向量 | ✅ 官方 |
| **Redis** | 缓存 + 向量双用，低延迟 | ✅ 官方 |
| **Chroma** | 开发/测试，轻量级 | ✅ 官方 |
| **Elasticsearch** | 全文 + 向量混合检索 | ✅ 官方 |

**决策**: 已有 PG → PGVector；大规模 → Milvus；混合检索 → Elasticsearch。

### ADR-003: GraalVM Native Image 部署

| 因素 | JVM 模式 | Native Image |
|------|---------|-------------|
| 启动时间 | 2-5 秒 | < 50ms |
| 内存占用 | 512MB+ | 50-100MB |
| 首次请求延迟 | JIT 预热 | 稳定 |
| 构建时间 | 秒级 | 分钟级 |
| 反射/动态代理 | 完全支持 | 需显式配置 |

**决策**: Serverless / K8s HPA 频繁扩缩容 → Native Image；长期运行服务 → JVM 模式。

---

## 关键术语速查

| 术语 | 说明 |
|------|------|
| **ChatClient** | Spring AI 高层 API，封装 Prompt、Advisor、Tool Calling |
| **Advisor** | Spring AI 的中间件模式，类似 Servlet Filter |
| **VectorStore** | 向量数据库统一抽象接口 |
| **ETL Pipeline** | 文档读取 → 转换 → 写入的数据处理管线 |
| **Function Calling** | LLM 调用外部工具/函数的能力 |
| **Native Image** | GraalVM AOT 编译产物，启动快、内存少 |

---

## 9. 事件驱动 AI 架构

### 9.1 Kafka + Spring AI 事件流

```
┌───────────────────────────────────────────────────────────────────┐
│                事件驱动 AI 架构                                      │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ 用户消息  │  │ 文档更新  │  │ 定时触发  │  │ 外部事件  │        │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘        │
│        │             │             │             │               │
│  ┌─────▼─────────────▼─────────────▼─────────────▼─────┐        │
│  │                    Kafka Topics                       │        │
│  │  ai-chat-requests │ doc-update-events │ ai-batch-jobs │        │
│  └─────┬─────────────┬─────────────┬───────────────────┘        │
│        │             │             │                             │
│  ┌─────▼─────┐ ┌────▼────┐  ┌────▼─────┐                      │
│  │ Chat      │ │ Indexing │  │ Batch    │                      │
│  │ Consumer  │ │ Consumer │  │ Consumer │                      │
│  │ (Spring   │ │ (Spring  │  │ (Spring  │                      │
│  │  AI Chat) │ │  AI ETL) │  │  AI Map) │                      │
│  └─────┬─────┘ └────┬────┘  └────┬─────┘                      │
│        │             │             │                             │
│  ┌─────▼─────────────▼─────────────▼─────┐                      │
│  │              Reply Topics               │                      │
│  │  ai-chat-responses │ index-complete    │                      │
│  └────────────────────────────────────────┘                      │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### 9.2 Kafka 消费者实现

```java
@Component
public class AiChatConsumer {

    private final ChatClient chatClient;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @KafkaListener(topics = "ai-chat-requests", groupId = "ai-service")
    public void processChat(ConsumerRecord<String, String> record) {
        String requestId = record.key();
        String message = record.value();

        String response = chatClient.prompt()
            .user(message)
            .call()
            .content();

        kafkaTemplate.send("ai-chat-responses", requestId, response);
    }
}
```

---

## 10. CI/CD Pipeline

### 10.1 GitHub Actions for Spring AI

```yaml
name: Spring AI CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: pgvector/pgvector:pg16
        env:
          POSTGRES_DB: test_ai
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
      - name: Run Tests
        run: ./gradlew test
        env:
          SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/test_ai
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

  build-native:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: graalvm/setup-graalvm@v1
        with:
          java-version: '21'
          distribution: 'graalvm'
      - name: Build Native Image
        run: ./gradlew nativeCompile
      - name: Build Docker Image
        run: docker build -f Dockerfile.native -t ai-service:native .

  deploy:
    needs: build-native
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to K8s
        run: kubectl set image deployment/ai-service ai-service=ai-service:native
```

---

## 11. 数据流设计

### 11.1 AI 数据流全景

```
┌────────────────────────────────────────────────────────────────┐
│                   Spring AI 数据流全景                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  离线数据流 (文档索引):                                          │
│  ─────────────────────────────────────────────                 │
│  文档源 → Tika 解析 → TokenSplitter → Embedding → VectorStore │
│  (S3/NFS)  (Reader)   (Transformer)  (Model)    (PG/Milvus)   │
│                                                                │
│  在线数据流 (用户请求):                                          │
│  ─────────────────────────────────────────────                 │
│  用户 → Gateway → ChatClient → Advisor链 → LLM → 响应         │
│        (Auth/    (Memory/RAG   (OpenAI/      (SSE/           │
│         Rate)    /Filter)       Ollama)       JSON)           │
│                                                                │
│  异步数据流 (批量处理):                                          │
│  ─────────────────────────────────────────────                 │
│  Kafka → Consumer → Spring AI Batch → 结果 → Kafka/DB         │
│  Topic  (并行消费)  (Map/Reduce)       (聚合)  (Output Topic) │
│                                                                │
│  监控数据流:                                                     │
│  ─────────────────────────────────────────────                 │
│  Micrometer → Prometheus → Grafana → AlertManager             │
│  (指标采集)   (存储)      (展示)     (告警)                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 12. 多模型负载均衡算法

### 12.1 轮询与加权负载均衡

```java
@Service
public class ModelLoadBalancer {

    private final List<ChatModel> models;
    private final Map<String, Integer> weights;
    private final AtomicInteger counter = new AtomicInteger(0);

    public ChatModel selectModel(LoadBalanceStrategy strategy) {
        return switch (strategy) {
            case ROUND_ROBIN -> models.get(counter.getAndIncrement() % models.size());
            case WEIGHTED -> selectWeighted();
            case LEAST_LATENCY -> selectLeastLatency();
            case COST_OPTIMIZED -> selectCheapest();
            case QUALITY_FIRST -> selectHighestQuality();
        };
    }

    private ChatModel selectWeighted() {
        int totalWeight = weights.values().stream().mapToInt(Integer::intValue).sum();
        int random = ThreadLocalRandom.current().nextInt(totalWeight);
        int cumulative = 0;
        for (Map.Entry<String, Integer> entry : weights.entrySet()) {
            cumulative += entry.getValue();
            if (random < cumulative) {
                return getModelByName(entry.getKey());
            }
        }
        return models.get(0);
    }

    private ChatModel selectLeastLatency() {
        return models.stream()
            .min(Comparator.comparingDouble(this::getAverageLatency))
            .orElse(models.get(0));
    }

    private ChatModel selectCheapest() {
        return models.stream()
            .min(Comparator.comparingDouble(this::getCostPerToken))
            .orElse(models.get(0));
    }
}

enum LoadBalanceStrategy {
    ROUND_ROBIN, WEIGHTED, LEAST_LATENCY, COST_OPTIMIZED, QUALITY_FIRST
}
```

### 12.2 算法对比

```
负载均衡策略对比
════════════════════════════════════════════════════════════════════

策略            适用场景                优点            缺点
──────────────────────────────────────────────────────────────────
Round Robin    模型能力相同             简单公平        不考虑性能差异
Weighted       模型能力不同             按权重分配      权重需手动调
Least Latency  实时交互场景             用户体验最好    监控开销大
Cost Optimized 大批量处理              成本最低        可能牺牲质量
Quality First  关键业务决策             质量最高        成本最高
──────────────────────────────────────────────────────────────────

推荐组合:
• 日常查询 → Cost Optimized (GPT-4o-mini)
• 重要分析 → Quality First (Claude/GPT-4o)
• 实时聊天 → Least Latency (最快的模型)
```

---

## 13. 配置中心模式

### 13.1 多环境 AI 配置

```yaml
# application-ai.yml (Spring Cloud Config)
ai:
  models:
    chat:
      primary:
        provider: openai
        model: gpt-4o
        temperature: 0.7
        max-tokens: 4096
        fallback:
          provider: anthropic
          model: claude-3-5-sonnet
      fast:
        provider: openai
        model: gpt-4o-mini
        temperature: 0.3
        max-tokens: 2048
    embedding:
      provider: openai
      model: text-embedding-3-small
      dimensions: 1536

  rate-limit:
    requests-per-minute: 60
    tokens-per-day: 500000

  circuit-breaker:
    failure-threshold: 5
    recovery-timeout: 30s
    half-open-requests: 3

  cost:
    daily-budget: 200
    alert-threshold: 0.8
```

### 13.2 动态配置刷新

```java
@RestController
@RequestMapping("/admin/ai-config")
@RefreshScope
public class AiConfigController {

    private final AiModelConfig config;

    @PostMapping("/model/{name}/switch")
    public String switchModel(@PathVariable String name,
                              @RequestBody ModelSwitchRequest request) {
        config.updateModel(name, request.provider(), request.model());
        return "Model switched: " + name + " → " + request.provider() + "/" + request.model();
    }

    @PostMapping("/rate-limit")
    public String updateRateLimit(@RequestBody RateLimitConfig rateLimit) {
        config.updateRateLimit(rateLimit);
        return "Rate limit updated: " + rateLimit.requestsPerMinute() + "/min";
    }

    @GetMapping("/cost/today")
    public CostReport getDailyCost() {
        return config.getDailyCostReport();
    }
}

record ModelSwitchRequest(String provider, String model) {}
```

---

## 14. 灰度发布策略

### 14.1 AI 模型灰度发布

```
灰度发布流程
════════════════════════════════════════════════════════════════════

阶段 1: 内部测试 (5% 流量)
────────────────────────────────────────────────────────────────
  Header: X-AI-Model-Version: v2
  用户组: 内部员工 / 测试用户
  监控: 延迟 P99、错误率、输出质量

阶段 2: 灰度扩大 (20% 流量)
────────────────────────────────────────────────────────────────
  条件: 阶段 1 错误率 < 1%，延迟无劣化
  用户组: 逐步扩大到随机 20%
  监控: 新增用户满意度评分

阶段 3: 全量发布 (100% 流量)
────────────────────────────────────────────────────────────────
  条件: 阶段 2 持续 24h 无异常
  保留: 旧版本保留 48h 可回滚
  监控: 全量观察 7 天

回滚触发条件:
────────────────────────────────────────────────────────────────
• 错误率 > 5%
• P99 延迟增长 > 50%
• 用户投诉量 > 阈值
• Token 成本异常飙升
```

### 14.2 灰度路由实现

```java
@Component
public class CanaryModelRouter {

    private final Map<String, ChatModel> modelVersions;
    private final CanaryConfig config;

    public ChatModel route(HttpServletRequest request) {
        String version = request.getHeader("X-AI-Model-Version");

        if (version != null && modelVersions.containsKey(version)) {
            return modelVersions.get(version);
        }

        String userId = extractUserId(request);
        if (config.getCanaryUsers().contains(userId)) {
            return modelVersions.get("v2");
        }

        if (ThreadLocalRandom.current().nextInt(100) < config.getCanaryPercentage()) {
            return modelVersions.get("v2");
        }

        return modelVersions.get("v1");
    }
}
```

---

## 15. 生产 Runbook

### 15.1 AI 服务故障等级定义

| 等级 | 现象 | 响应时间 | 处理方式 |
|------|------|---------|---------|
| P0 | AI 服务完全不可用 | 5 分钟 | 启用静态回复兜底，切换备用模型 |
| P1 | 响应延迟 > 10s | 15 分钟 | 降级到快速模型，扩容 |
| P2 | 错误率 > 5% | 30 分钟 | 排查日志，检查 API Key/配额 |
| P3 | Token 成本异常 | 2 小时 | 分析用量，检查异常调用 |

### 15.2 常见故障排查清单

```
生产故障排查手册
════════════════════════════════════════════════════════════════════

故障 1: AI 服务超时
────────────────────────────────────────────────────────────────
□ 检查 LLM 提供商状态页 (status.openai.com)
□ 检查网络连通性: curl https://api.openai.com/v1/models
□ 检查请求 Token 数是否超限
□ 检查熔断器是否打开
□ 临时措施: 切换 fallback 模型

故障 2: Token 费用飙升
────────────────────────────────────────────────────────────────
□ 检查 Prometheus: sum(ai_token_usage_daily)
□ 排查 Top 调用方: topk(10, ai_token_usage_by_user)
□ 检查是否有循环调用（Tool Calling 死循环）
□ 检查 RAG 是否检索了过多文档
□ 临时措施: 降低 max-tokens，启用 rate-limit

故障 3: RAG 返回无关内容
────────────────────────────────────────────────────────────────
□ 检查 Embedding 模型版本是否一致
□ 检查相似度阈值设置
□ 抽查向量库数据质量
□ 检查分块策略是否合理
□ 检查 Metadata 过滤条件

故障 4: 内存泄漏
────────────────────────────────────────────────────────────────
□ jmap -heap <pid> 查看堆内存
□ jmap -histo <pid> | head -20 查看对象分布
□ 检查 ChatMemory 是否无限增长
□ 检查 VectorStore 查询结果缓存
□ 检查 Predictor/ZooModel 是否正确关闭
```

---

## 16. Event Sourcing + CQRS 模式

### 16.1 AI 事件溯源

```java
@Entity
@Table(name = "ai_event_store")
public class AiEvent {

    @Id
    private UUID eventId;
    private String conversationId;
    private String eventType;
    private String payload;
    private Instant timestamp;
    private String userId;
    private String model;
    private int promptTokens;
    private int completionTokens;
    private BigDecimal cost;
}

@Service
public class AiEventStore {

    private final JdbcTemplate jdbc;
    private final ApplicationEventPublisher publisher;

    public void append(String conversationId, String eventType, Object payload) {
        AiEvent event = AiEvent.builder()
            .eventId(UUID.randomUUID())
            .conversationId(conversationId)
            .eventType(eventType)
            .payload(toJson(payload))
            .timestamp(Instant.now())
            .build();

        jdbc.update("""
            INSERT INTO ai_event_store
            (event_id, conversation_id, event_type, payload, timestamp)
            VALUES (?, ?, ?, ?::jsonb, ?)
            """, event.getEventId(), event.getConversationId(),
                event.getEventType(), event.getPayload(), event.getTimestamp());

        publisher.publishEvent(event);
    }

    public List<AiEvent> getConversationEvents(String conversationId) {
        return jdbc.query(
            "SELECT * FROM ai_event_store WHERE conversation_id = ? ORDER BY timestamp",
            (rs, rowNum) -> AiEvent.builder()
                .eventId(UUID.fromString(rs.getString("event_id")))
                .conversationId(rs.getString("conversation_id"))
                .eventType(rs.getString("event_type"))
                .payload(rs.getString("payload"))
                .timestamp(rs.getTimestamp("timestamp").toInstant())
                .build(),
            conversationId);
    }
}
```

### 16.2 CQRS 读写分离

```
AI 服务 CQRS 架构
════════════════════════════════════════════════════════════════════

写路径 (Command):
────────────────────────────────────────────────────────────────
┌──────────┐    ┌──────────────┐    ┌───────────────┐
│ Chat API │───▶│ CommandBus   │───▶│ Event Store   │
│ (同步)    │    │ (异步处理)    │    │ (PostgreSQL)  │
└──────────┘    └──────────────┘    └───────┬───────┘
                                           │ Event
                                           ▼
                                    ┌───────────────┐
                                    │ Projector     │
                                    │ (更新读模型)   │
                                    └───────┬───────┘
                                            │
读路径 (Query):                              ▼
────────────────────────────────────────────────────────────────
┌──────────┐    ┌──────────────┐    ┌───────────────┐
│ Query API│───▶│ QueryService │───▶│ Read Model    │
│ (同步)    │    │              │    │ (Redis/ES)    │
└──────────┘    └──────────────┘    └───────────────┘

写模型: 事件流 (完整审计追溯)
读模型: 聚合视图 (高效查询)

适用场景:
• 需要完整审计日志的 AI 应用
• 对话历史需要事件回溯
• Token 用量需要精确统计
• 多系统需要订阅 AI 事件
```

---

## 17. Service Mesh 集成

### 17.1 Istio + Spring AI

```yaml
# VirtualService - AI 流量管理
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ai-service
spec:
  hosts:
    - ai-service
  http:
    - match:
        - headers:
            x-canary:
              exact: "true"
      route:
        - destination:
            host: ai-service
            subset: canary
          weight: 100
    - route:
        - destination:
            host: ai-service
            subset: stable
          weight: 95
        - destination:
            host: ai-service
            subset: canary
          weight: 5
---
# DestinationRule - 熔断配置
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: ai-service
spec:
  host: ai-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        h2UpgradePolicy: DEFAULT
        http1MaxPendingRequests: 50
        http2MaxRequests: 200
    outlierDetection:
      consecutive5xxErrors: 3
      interval: 30s
      baseEjectionTime: 60s
      maxEjectionPercent: 50
  subsets:
    - name: stable
      labels:
        version: stable
    - name: canary
      labels:
        version: canary
```

### 17.2 Envoy 外部 LLM 代理

```
Service Mesh 数据流
════════════════════════════════════════════════════════════════════

                    ┌─────────────┐
                    │   Client     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Envoy      │  ← mTLS, Rate Limit, Circuit Breaker
                    │  Sidecar     │  ← LLM API 调用监控
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                  │
  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
  │ ai-service  │  │ ai-service  │  │ ai-service  │
  │   (v1)      │  │   (v2)      │  │   (v3)      │
  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
         │                 │                  │
         └─────────────────┼─────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Envoy      │  ← Egress 网关
                    │  Egress      │  ← LLM API 密钥管理
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ OpenAI API  │
                    └─────────────┘

Service Mesh 优势:
• 零代码改动实现 mTLS
• 统一限流和熔断策略
• LLM API 调用全链路追踪
• 金丝雀发布无需应用层代码
```

---

## 18. 数据库选型深度对比

### 18.1 AI 应用数据库选型

```
AI 服务数据库选型矩阵
════════════════════════════════════════════════════════════════════

用途              推荐方案          备选方案           不推荐
──────────────────────────────────────────────────────────────────
向量存储          PGVector          Milvus             Pinecone(延迟)
                 (简单场景)        (大规模场景)
                 
对话记忆          PostgreSQL        Redis              内存(生产不可靠)
                 (持久化)          (高性能)

事件存储          PostgreSQL        EventStoreDB       MongoDB
                 (JSONB + 分区)    (专业方案)

审计日志          PostgreSQL        Elasticsearch      文件
                 (结构化查询)      (全文搜索)

缓存              Redis             Caffeine(本地)     无缓存
                 (分布式)          (单实例)

配置中心          Spring Cloud      Consul             硬编码
                 Config

用户数据          PostgreSQL        MySQL              NoSQL
──────────────────────────────────────────────────────────────────

PostgreSQL 是 AI 应用的最佳默认选择:
────────────────────────────────────────────────────────────────
• PGVector: 向量搜索 + 结构化查询一体
• JSONB: 灵活的 Metadata 存储
• Row Level Security: 多租户隔离
• 成熟的连接池和复制方案
• 团队熟悉度高
```

---

*Last updated: 2026-04*

## Related

- [[12_架构基建/02_架构概览/02_AI_基础设施_2026]] — AI Infrastructure 2026 完全指南 (共享: architecture, high-availability, infrastructure, kubernetes)
- [[12_架构基建/Architecture-in-nutshell]] — AI 架构速成指南 (共享: architecture, high-availability, infrastructure, kubernetes)
- [[12_架构基建/02_架构概览/02_AI_基础设施_2026]] — AI 架构基础设施 - 小白版 (共享: architecture, high-availability, infrastructure, kubernetes)
- [[12_架构基建/07_硬件与算力/07_边缘_AI_2026|Edge_AI_2026]]
- [[12_架构基建/02_架构概览/05_Capacity_Planning_2026|Capacity_Planning_2026]]
