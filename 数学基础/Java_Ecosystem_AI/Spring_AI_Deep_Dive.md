---
title: Spring AI 深度解析
category: 01-fundamentals-java-ecosystem-ai
tags: ["fundamentals", "math", "algorithms", "basics", "spring-ai"]
summary: "> **一句话理解**: Spring AI 是 Spring 官方的 AI 应用框架 —— 用 Spring 的方式统一接入 LLM、构建 RAG、编排 Agent，让 Java 开发者用熟悉的编程模型构建企业级 AI 应用。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Spring Ai Deep Dive"
  - "Spring AI Deep Dive"
  - Spring_AI_Deep_Dive
sources: []

---
# Spring AI 深度解析

> **一句话理解**: Spring AI 是 Spring 官方的 AI 应用框架 —— 用 Spring 的方式统一接入 LLM、构建 RAG、编排 Agent，让 Java 开发者用熟悉的编程模型构建企业级 AI 应用。

> **相关文档**: [Java 生态 AI 概览](数学基础/Java_Ecosystem_AI/Java_Ecosystem_AI_Overview.md) | [Spring AI 架构设计](../../架构基建/Architecture_Overview/Spring_AI_Architecture) | [Spring AI RAG 深度解析](RAG系统/RAG_Frameworks/Spring_AI_RAG_Deep_Dive.md) | [Spring AI 网关与安全](架构基建/AI_Gateway/Spring_AI_Gateway_Security.md)

---

## 目录

1. [Spring AI 概述](#1-spring-ai-概述)
2. [核心概念与 API](#2-核心概念与-api)
3. [ChatClient 深度解析](#3-chatclient-深度解析)
4. [Advisor 模式](#4-advisor-模式)
5. [Function Calling 与 Tool Use](#5-function-calling-与-tool-use)
6. [Structured Output](#6-structured-output)
7. [模型提供商集成](#7-模型提供商集成)
8. [向量存储集成](#8-向量存储集成)
9. [MCP 协议集成](#9-mcp-协议集成)
10. [最佳实践与生产就绪](#10-最佳实践与生产就绪)

---

## 1. Spring AI 概述

### 1.1 项目背景

```
Spring AI 项目概览
════════════════════════════════════════════════════════════════════

发起:     2023 年（Spring 团队）
GA 版本:   1.0.0 (2025年5月)
当前版本:  1.0.x
维护:     Spring 团队 (Broadcom / VMware)
许可证:   Apache 2.0
GitHub:   github.com/spring-projects/spring-ai

核心理念:
────────────────────────────────────────────────────────────────
"让 Java 开发者用 Spring 的方式构建 AI 应用"

• 可移植的模型抽象 API
• Spring Boot 自动配置
• 生态集成（Security、Data、Cloud）
• 企业级生产就绪
```

### 1.2 核心模块

| 模块 | 说明 | Maven Artifact |
|------|------|---------------|
| **spring-ai-core** | 核心抽象 | spring-ai-core |
| **spring-ai-model** | 模型接口 | spring-ai-model |
| **spring-ai-client** | ChatClient | spring-ai-client |
| **spring-ai-advisors** | Advisor 链 | spring-ai-advisors |
| **spring-ai-rag** | RAG 组件 | spring-ai-rag |
| **spring-ai-vector-store** | 向量存储抽象 | spring-ai-vector-store |

### 1.3 快速开始

**Maven 依赖**:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-bom</artifactId>
            <version>1.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
    </dependency>
</dependencies>
```

**application.yml**:

```yaml
spring:
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}
      chat:
        options:
          model: gpt-4o
          temperature: 0.7
```

**第一个 AI 应用**:

```java
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatModel chatModel) {
        this.chatClient = ChatClient.builder(chatModel).build();
    }

    @PostMapping
    public String chat(@RequestBody String message) {
        return chatClient.prompt()
            .user(message)
            .call()
            .content();
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(@RequestParam String message) {
        return chatClient.prompt()
            .user(message)
            .stream()
            .content();
    }
}
```

---

## 2. 核心概念与 API

### 2.1 模型抽象体系

```
Spring AI 模型抽象层次
════════════════════════════════════════════════════════════════════

                    ┌───────────────────┐
                    │    ChatClient      │  高层 Fluent API
                    │   (推荐使用)        │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │    ChatModel       │  模型抽象接口
                    │  (Generic)         │
                    └────────┬──────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───┐  ┌──────▼─────┐  ┌────▼────────┐
     │  OpenAI    │  │ Anthropic  │  │   Ollama    │
     │ ChatModel  │  │ ChatModel  │  │  ChatModel  │
     └────────────┘  └────────────┘  └─────────────┘

同样适用于:
────────────────────────────────────────────────────────────────
• EmbeddingModel     文本向量化
• ImageModel         图像生成
• AudioModel         语音合成/识别
• ModerationModel    内容审核
```

### 2.2 Prompt 与 Prompt Template

```java
PromptTemplate template = new PromptTemplate("""
    你是一个{role}，专注于{domain}领域。
    
    请根据以下信息回答用户的问题：
    {context}
    
    用户问题: {question}
    
    要求:
    1. 用专业但易懂的语言回答
    2. 如果信息不足，明确指出
    3. 给出具体的建议
    """);

Prompt prompt = template.create(Map.of(
    "role", "高级数据分析师",
    "domain", "电商运营",
    "context", documentContent,
    "question", userQuestion
));

ChatResponse response = chatModel.call(prompt);
```

### 2.3 Message 类型

```java
List<Message> messages = List.of(
    new SystemMessage("你是一个 Java 架构师"),
    new UserMessage("帮我设计一个 Spring AI 微服务架构"),
    new AssistantMessage("基于你的需求，我建议..."),
    new UserMessage("如何处理高并发？"),
    new ToolResponseMessage(toolResults)
);
```

---

## 3. ChatClient 深度解析

### 3.1 构建器模式

```java
ChatClient chatClient = ChatClient.builder(chatModel)
    .defaultSystem("你是一个{domain}领域的专家")
    .defaultUser("请用{style}的语气回答")
    .defaultAdvisors(
        MessageChatMemoryAdvisor.of(chatMemory, 50),
        SimpleLoggerAdvisor.create()
    )
    .defaultTools(calendarTool, weatherTool)
    .build();
```

### 3.2 调用模式

```java
// 同步调用
String response = chatClient.prompt()
    .user("解释 Spring AI")
    .call()
    .content();

// 同步调用 - 获取完整响应
ChatResponse chatResponse = chatClient.prompt()
    .user("分析这段代码")
    .call()
    .chatResponse();

// 流式调用
Flux<String> stream = chatClient.prompt()
    .user("写一篇关于 AI 的文章")
    .stream()
    .content();

// 流式调用 - 获取完整 ChatResponse 流
Flux<ChatResponse> responseStream = chatClient.prompt()
    .user("逐步分析这个问题")
    .stream()
    .chatResponses();
```

### 3.3 参数配置

```java
String response = chatClient.prompt()
    .user("生成一个创意方案")
    .options(ChatOptionsBuilder.builder()
        .model("gpt-4o")
        .temperature(0.9)
        .topP(0.95)
        .maxTokens(2000)
        .presencePenalty(0.6)
        .frequencyPenalty(0.3)
        .build())
    .call()
    .content();
```

---

## 4. Advisor 模式

### 4.1 Advisor 执行链

```
Advisor 链执行流程
════════════════════════════════════════════════════════════════════

用户请求
    │
    ▼
┌──────────────────────────────────┐
│ Advisor 1: Chat Memory          │
│   注入对话历史到 Prompt          │
│   ┌──────────────────────────┐  │
│   │ Advisor 2: RAG           │  │
│   │   检索相关文档注入上下文   │  │
│   │   ┌──────────────────┐   │  │
│   │   │ Advisor 3: Guard  │   │  │
│   │   │   内容安全审查     │   │  │
│   │   │   ┌──────────┐   │   │  │
│   │   │   │  LLM 调用 │   │   │  │
│   │   │   └──────────┘   │   │  │
│   │   └──────────────────┘   │  │
│   └──────────────────────────┘  │
└──────────────────────────────────┘
    │
    ▼
响应返回
```

### 4.2 内置 Advisor

| Advisor | 用途 | 说明 |
|---------|------|------|
| `MessageChatMemoryAdvisor` | 对话记忆 | 自动注入历史消息 |
| `VectorStoreChatMemoryAdvisor` | 持久化记忆 | 从向量库检索相关记忆 |
| `SimpleLoggerAdvisor` | 日志 | 请求/响应日志 |
| `SafeGuardAdvisor` | 安全 | 关键词过滤 |
| `QuestionAnswerAdvisor` | RAG | 向量检索增强 |

### 4.3 自定义 Advisor

```java
@Component
public class AuditLogAdvisor implements CallAroundAdvisor {

    private final AuditLogService auditLogService;

    @Override
    public String getName() {
        return "AuditLogAdvisor";
    }

    @Override
    public AdvisedResponse aroundCall(AdvisedRequest request,
                                       CallAroundAdvisorChain chain) {
        String userId = request.systemParams().get("userId");
        String userMessage = request.userText();
        Instant startTime = Instant.now();

        AdvisedResponse response = chain.nextAroundCall(request);

        auditLogService.log(AuditEntry.builder()
            .userId(userId)
            .input(userMessage)
            .output(response.response().getResult().getOutput().getText())
            .model(response.response().getMetadata().getModel())
            .tokenUsage(response.response().getMetadata().getUsage())
            .duration(Duration.between(startTime, Instant.now()))
            .build());

        return response;
    }
}
```

---

## 5. Function Calling 与 Tool Use

### 5.1 声明式工具定义

```java
@Configuration
public class ToolConfig {

    @Bean
    @Description("查询指定城市的天气信息")
    public Function<WeatherRequest, WeatherResponse> weatherFunction() {
        return request -> weatherService.getWeather(request.city());
    }

    @Bean
    @Description("搜索企业知识库中的相关文档")
    public Function<SearchRequest, SearchResponse> searchDocuments() {
        return request -> documentService.search(request.query(), request.limit());
    }

    @Bean
    @Description("查询数据库中的订单信息")
    public Function<OrderQueryRequest, List<OrderDto>> queryOrders() {
        return request -> orderService.query(
            request.customerId(), request.dateRange());
    }
}
```

### 5.2 使用工具

```java
record WeatherRequest(String city) {}
record WeatherResponse(String city, double temperature, String condition) {}

ChatClient chatClient = ChatClient.builder(chatModel)
    .defaultTools("weatherFunction")
    .build();

String response = chatClient.prompt()
    .user("北京今天天气怎么样？适合出门吗？")
    .call()
    .content();
// LLM 会自动调用 weatherFunction，获取天气数据，然后生成回答
```

### 5.3 工具调用流程

```
Function Calling 流程
════════════════════════════════════════════════════════════════════

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  用户请求  │────▶│ Spring AI│────▶│   LLM    │────▶│  判断需要 │
│          │     │ChatClient│     │          │     │  调用工具 │
└──────────┘     └──────────┘     └──────────┘     └─────┬────┘
                                                         │
                                                         ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  最终响应  │◀────│ 生成回答  │◀────│  工具结果  │◀────│ 执行工具 │
│  返回用户  │     │ (含工具数据)│     │ 返回 LLM  │     │  调用    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

---

## 6. Structured Output

### 6.1 对象映射

```java
record ActorFilms(String actor, List<String> movies) {}

ActorFilms result = chatClient.prompt()
    .user("列出 Tom Hanks 的 5 部电影")
    .call()
    .entity(ActorFilms.class);
```

### 6.2 列表映射

```java
List<ActorFilms> results = chatClient.prompt()
    .user("列出 3 位演员及其代表作")
    .call()
    .entity(new ParameterizedTypeReference<List<ActorFilms>>() {});
```

### 6.3 自定义输出格式

```java
record AnalysisResult(
    String summary,
    List<String> keyPoints,
    Sentiment sentiment,
    double confidence
) {}

enum Sentiment { POSITIVE, NEGATIVE, NEUTRAL }

@Configuration
public class OutputConfig {
    @Bean
    public ChatClient chatClient(ChatModel chatModel) {
        return ChatClient.builder(chatModel)
            .defaultOptions(ChatOptionsBuilder.builder()
                .model("gpt-4o")
                .responseFormat("json_object")
                .build())
            .build();
    }
}
```

---

## 7. 模型提供商集成

### 7.1 支持的提供商矩阵

| 提供商 | Chat | Embedding | Image | Audio | Function Calling |
|--------|------|-----------|-------|-------|-----------------|
| **OpenAI** | ✅ GPT-4o/o3/o4-mini | ✅ text-embedding-3 | ✅ DALL-E 3 | ✅ TTS/Whisper | ✅ |
| **Anthropic** | ✅ Claude 3.5/4 | ❌ | ❌ | ❌ | ✅ |
| **Google Vertex AI** | ✅ Gemini 2.0 | ✅ | ✅ Imagen | ✅ | ✅ |
| **AWS Bedrock** | ✅ 多模型 | ✅ Titan | ❌ | ✅ | ✅ |
| **Ollama** | ✅ 本地模型 | ✅ | ❌ | ❌ | ✅ |
| **Mistral** | ✅ Mistral Large | ✅ | ❌ | ❌ | ✅ |
| **智谱 AI** | ✅ GLM-4 | ✅ | ✅ CogView | ✅ | ✅ |
| **通义千问** | ✅ Qwen-Max | ✅ | ✅ | ✅ | ✅ |
| **DeepSeek** | ✅ DeepSeek-V3 | ❌ | ❌ | ❌ | ✅ |
| **Azure OpenAI** | ✅ GPT-4o | ✅ | ✅ DALL-E | ✅ | ✅ |

### 7.2 OpenAI 集成配置

```yaml
spring:
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}
      base-url: https://api.openai.com
      chat:
        options:
          model: gpt-4o
          temperature: 0.7
          max-tokens: 4096
      embedding:
        options:
          model: text-embedding-3-small
```

### 7.3 Ollama 本地模型

```yaml
spring:
  ai:
    ollama:
      base-url: http://localhost:11434
      chat:
        options:
          model: qwen2.5:72b
          temperature: 0.7
      embedding:
        options:
          model: nomic-embed-text
```

### 7.4 多模型切换

```java
@Service
public class MultiModelService {

    private final Map<String, ChatModel> models;

    public MultiModelService(
            @Qualifier("openAiChatModel") ChatModel openAi,
            @Qualifier("ollamaChatModel") ChatModel ollama,
            @Qualifier("anthropicChatModel") ChatModel anthropic) {
        this.models = Map.of(
            "openai", openAi,
            "ollama", ollama,
            "anthropic", anthropic
        );
    }

    public String chat(String model, String message) {
        ChatModel chatModel = models.getOrDefault(model, models.get("openai"));
        return ChatClient.builder(chatModel).build()
            .prompt().user(message).call().content();
    }
}
```

---

## 8. 向量存储集成

### 8.1 VectorStore 抽象

```java
public interface VectorStore extends DocumentWriter {
    void add(List<Document> documents);
    void delete(List<String> idList);
    List<Document> similaritySearch(String query);
    List<Document> similaritySearch(SearchRequest request);
}
```

### 8.2 支持的向量存储

| 向量存储 | 说明 | 适用场景 |
|---------|------|---------|
| **PGVector** | PostgreSQL 扩展 | 中等规模、已有 PG |
| **Milvus** | 分布式向量数据库 | 超大规模 |
| **Chroma** | 轻量级向量库 | 开发/测试 |
| **Redis** | Redis 向量模块 | 缓存+向量双用 |
| **Weaviate** | 语义搜索引擎 | 混合检索 |
| **Elasticsearch** | ES 向量搜索 | 全文+向量 |
| **Pinecone** | 云托管向量服务 | 全托管 |
| **Qdrant** | 高性能向量库 | 高吞吐场景 |

### 8.3 向量存储配置

```yaml
spring:
  ai:
    vectorstore:
      pgvector:
        index-type: HNSW
        distance-type: cosine
        dimensions: 1536
```

```java
@Bean
public VectorStore vectorStore(JdbcTemplate jdbcTemplate,
                                EmbeddingModel embeddingModel) {
    return PgVectorStore.builder(jdbcTemplate, embeddingModel)
        .dimensions(1536)
        .distanceType(CosineDistance.INSTANCE)
        .indexType(HnswIndex.builder().m(16).efConstruction(64).build())
        .initializeSchema(true)
        .build();
}
```

---

## 9. MCP 协议集成

### 9.1 Spring AI MCP 模块

```
Spring AI MCP 集成架构
════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────┐
│                  Spring AI 应用                       │
│  ┌─────────────┐          ┌───────────────┐         │
│  │ ChatClient   │────────▶│ MCP Client    │         │
│  │ + Tools      │         │ (Sync/Stdio)  │         │
│  └─────────────┘          └───────┬───────┘         │
│                                   │                   │
└───────────────────────────────────┼───────────────────┘
                                    │ MCP Protocol
                    ┌───────────────┼───────────────┐
                    │               │               │
            ┌───────▼──┐   ┌───────▼──┐   ┌───────▼──┐
            │ MCP      │   │ MCP      │   │ MCP      │
            │ Server 1 │   │ Server 2 │   │ Server 3 │
            │ (文件系统)│   │ (数据库)  │   │ (搜索)   │
            └──────────┘   └──────────┘   └──────────┘
```

### 9.2 MCP Client 配置

```yaml
spring:
  ai:
    mcp:
      client:
        type: SYNC
        servers:
          filesystem:
            command: npx
            args:
              - "-y"
              - "@modelcontextprotocol/server-filesystem"
              - "/path/to/documents"
          database:
            command: npx
              - "-y"
              - "@modelcontextprotocol/server-postgres"
              - "postgresql://localhost/mydb"
```

### 9.3 MCP 作为 Tool 使用

```java
@Bean
public ChatClient chatClient(ChatModel chatModel, McpSyncClient mcpClient) {
    return ChatClient.builder(chatModel)
        .defaultTools(McpToolUtils.getToolCallbacks(mcpClient))
        .build();
}
```

---

## 10. 最佳实践与生产就绪

### 10.1 配置管理

```yaml
spring:
  ai:
    chat:
      client:
        enabled: true
    openai:
      api-key: ${AI_API_KEY}
      chat:
        options:
          model: ${AI_MODEL:gpt-4o}
          temperature: ${AI_TEMPERATURE:0.7}

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    tags:
      application: ${spring.application.name}
```

### 10.2 错误处理

```java
@RestControllerAdvice
public class AiExceptionHandler {

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ErrorResponse> handleRateLimit(RateLimitExceededException ex) {
        return ResponseEntity.status(429)
            .header("Retry-After", "60")
            .body(new ErrorResponse("请求过于频繁", "RATE_LIMIT"));
    }

    @ExceptionHandler(ModelClientException.class)
    public ResponseEntity<ErrorResponse> handleModelError(ModelClientException ex) {
        return ResponseEntity.status(502)
            .body(new ErrorResponse("AI 服务暂时不可用", "MODEL_ERROR"));
    }
}
```

### 10.3 健康检查

```java
@Component
public class AiHealthIndicator implements HealthIndicator {

    private final ChatModel chatModel;

    @Override
    public Health health() {
        try {
            ChatResponse response = chatModel.call(new Prompt("ping"));
            return Health.up()
                .withDetail("model", response.getMetadata().getModel())
                .build();
        } catch (Exception e) {
            return Health.down()
                .withException(e)
                .build();
        }
    }
}
```

### 10.4 生产检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| API Key 安全 | 使用 Vault/环境变量，不硬编码 | ☐ |
| 限流配置 | 用户级 + 全局限流 | ☐ |
| 超时设置 | 连接超时 + 读取超时 | ☐ |
| Fallback 模型 | 主模型不可用时的备选 | ☐ |
| 日志脱敏 | 不记录完整 Prompt/Response | ☐ |
| Token 监控 | 用量告警和成本追踪 | ☐ |
| 缓存策略 | 相同 Embedding 缓存 | ☐ |
| 健康检查 | AI 服务可用性探测 | ☐ |
| 链路追踪 | Micrometer Tracing | ☐ |
| 文档更新 | Prompt 版本管理 | ☐ |

---

## 关键术语速查

| 术语 | 说明 |
|------|------|
| **ChatClient** | Spring AI 高层 Fluent API，推荐的使用方式 |
| **ChatModel** | 模型抽象接口，底层 API |
| **Advisor** | 请求/响应中间件，类似 Filter 链 |
| **Function Calling** | LLM 调用 Java 方法的机制 |
| **Structured Output** | LLM 输出直接映射为 Java 对象 |
| **VectorStore** | 向量数据库统一接口 |
| **MCP** | Model Context Protocol，模型上下文协议 |
| **ETL Pipeline** | 文档加载 → 转换 → 存储的数据管线 |
| **Prompt Template** | 参数化 Prompt 模板 |
| **BOM** | Bill of Materials，统一管理 Spring AI 版本 |

---

## 11. ReAct Agent 模式

### 11.1 ReAct (Reason + Act) 实现

```java
@Component
public class ReactAgent {

    private final ChatClient chatClient;
    private final Map<String, FunctionTool> tools;

    public String execute(String task, int maxIterations) {
        String thought = task;
        List<Map<String, String>> trace = new ArrayList<>();

        for (int i = 0; i < maxIterations; i++) {
            AgentStep step = chatClient.prompt()
                .system("""
                    你是一个 ReAct Agent。对于每一步：
                    1. Thought: 分析当前情况，决定下一步
                    2. Action: 选择一个工具执行
                    3. Observation: 分析工具返回的结果
                    
                    可用工具: %s
                    
                    返回 JSON 格式:
                    {"thought": "...", "action": "tool_name", "actionInput": {...}, "finalAnswer": "..."}
                    """.formatted(String.join(", ", tools.keySet())))
                .user(thought)
                .call()
                .entity(AgentStep.class);

            trace.add(Map.of("step", String.valueOf(i), "thought", step.thought()));

            if (step.finalAnswer() != null) {
                return step.finalAnswer();
            }

            FunctionTool tool = tools.get(step.action());
            String observation = tool.execute(step.actionInput());
            thought = "Thought: %s\nAction: %s\nObservation: %s\n\n请继续分析。".formatted(
                step.thought(), step.action(), observation);
        }

        return "达到最大迭代次数，未能完成任务。执行轨迹: " + trace;
    }
}

record AgentStep(String thought, String action, Map<String, Object> actionInput, String finalAnswer) {}
```

### 11.2 多 Agent 协作

```java
@Component
public class MultiAgentOrchestrator {

    private final ChatClient planner;
    private final ChatClient executor;
    private final ChatClient reviewer;

    public OrchestratedResult execute(String task) {
        String plan = planner.prompt()
            .system("你是一个任务规划 Agent，将复杂任务分解为子任务")
            .user(task)
            .call()
            .entity(TaskPlan.class)
            .steps();

        List<String> results = new ArrayList<>();
        for (String step : plan.split("\n")) {
            String result = executor.prompt()
                .system("你是一个执行 Agent，按步骤完成任务")
                .user(step)
                .call()
                .content();
            results.add(result);
        }

        String review = reviewer.prompt()
            .system("你是一个审查 Agent，评估执行结果的质量")
            .user("任务: " + task + "\n执行结果: " + String.join("\n", results))
            .call()
            .content();

        return new OrchestratedResult(plan, results, review);
    }
}

record OrchestratedResult(String plan, List<String> executionResults, String review) {}
```

---

## 12. Observability 深度集成

### 12.1 OpenTelemetry 集成

```yaml
management:
  tracing:
    sampling:
      probability: 1.0
  otlp:
    tracing:
      endpoint: http://localhost:4318/v1/traces
  metrics:
    export:
      otlp:
        url: http://localhost:4318/v1/metrics
```

### 12.2 自定义 Span

```java
@Component
public class InstrumentedChatService {

    private final ChatClient chatClient;
    private final Tracer tracer;

    public String chat(String message) {
        Span span = tracer.nextSpan().name("ai.chat.custom").start();
        try (Tracer.SpanInScope ws = tracer.withSpan(span)) {
            span.tag("ai.input.length", String.valueOf(message.length()));
            Instant start = Instant.now();

            String response = chatClient.prompt().user(message).call().content();

            span.tag("ai.output.length", String.valueOf(response.length()));
            span.tag("ai.latency.ms", String.valueOf(Duration.between(start, Instant.now()).toMillis()));
            return response;
        } finally {
            span.end();
        }
    }
}
```

### 12.3 告警看板指标

| 指标 | PromQL | 告警阈值 |
|------|--------|---------|
| AI 请求 QPS | `rate(ai_chat_calls_total[5m])` | > 500/min |
| P99 延迟 | `histogram_quantile(0.99, rate(ai_chat_duration_bucket[5m]))` | > 10s |
| Token 成本 | `sum(ai_token_cost_daily)` | > $200/day |
| 错误率 | `rate(ai_chat_calls_total{status="error"}[5m])` | > 5% |
| Fallback 触发 | `increase(ai_model_fallback_total[10m])` | > 10 |

---

## 13. 对话记忆后端深度对比

### 13.1 四种记忆后端

```
Spring AI 对话记忆后端
════════════════════════════════════════════════════════════════════

InMemoryChatMemoryRepository
├── 存储: JVM 内存
├── 持久化: 无（重启丢失）
├── 适用: 开发测试、单实例部署
└── 性能: 最快

JdbcChatMemoryRepository
├── 存储: 关系数据库
├── 持久化: 完全持久化
├── 适用: 生产环境、多实例共享
└── 性能: 中等

RedisChatMemoryRepository
├── 存储: Redis
├── 持久化: 可配置 TTL
├── 适用: 高并发、分布式部署
└── 性能: 快

VectorStoreChatMemoryRepository
├── 存储: 向量数据库
├── 持久化: 完全持久化
├── 适用: 长期记忆、语义检索记忆
└── 性能: 较慢但功能最强
```

### 13.2 JDBC 记忆后端实现

```java
@Configuration
public class ChatMemoryConfig {

    @Bean
    public ChatMemory chatMemory(DataSource dataSource) {
        JdbcChatMemoryRepository repository = JdbcChatMemoryRepository.builder()
            .dataSource(dataSource)
            .schemaLocation("classpath:schema-chat-memory.sql")
            .build();
        return ChatMemory.of(repository);
    }
}
```

```sql
CREATE TABLE IF NOT EXISTS chat_memory (
    conversation_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    "timestamp" TIMESTAMP NOT NULL,
    PRIMARY KEY (conversation_id, "timestamp")
);
```

### 13.3 向量记忆后端（长期记忆）

```java
@Bean
public ChatMemory semanticMemory(VectorStore vectorStore) {
    VectorStoreChatMemoryRepository repo = VectorStoreChatMemoryRepository.builder()
        .vectorStore(vectorStore)
        .build();
    return ChatMemory.of(repo);
}
```

```
短期记忆 vs 长期记忆
════════════════════════════════════════════════════════════════════

短期记忆 (InMemory/JDBC):
────────────────────────────────────────────────────────────────
• 保留最近 N 轮对话
• 精确匹配，速度快
• 适合: 当前会话上下文

长期记忆 (VectorStore):
────────────────────────────────────────────────────────────────
• 向量化存储所有历史对话
• 基于语义相似度检索
• 适合: "上次我问过xxx" 跨会话记忆

最佳实践: 短期 + 长期组合
────────────────────────────────────────────────────────────────
Advisor 链:
  VectorStoreMemoryAdvisor (检索相关长期记忆)
    → MessageChatMemoryAdvisor (注入最近对话)
      → RAG Advisor (检索知识库)
        → LLM 调用
```

---

## 14. 流式响应高级模式

### 14.1 SSE + React 前端集成

```java
@RestController
@RequestMapping("/api/chat")
public class StreamingChatController {

    private final ChatClient chatClient;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<ChatChunk>> streamChat(@RequestParam String message) {
        return chatClient.prompt()
            .user(message)
            .stream()
            .chatResponses()
            .map(response -> {
                ChatResponseMetadata meta = response.getMetadata();
                String content = response.getResult().getOutput().getText();
                return ServerSentEvent.<ChatChunk>builder()
                    .event("chunk")
                    .data(new ChatChunk(content, meta.getUsage()))
                    .build();
            })
            .concatWith(Flux.just(
                ServerSentEvent.<ChatChunk>builder()
                    .event("done")
                    .data(new ChatChunk("", null))
                    .build()
            ));
    }
}

record ChatChunk(String content, Usage usage) {}
```

### 14.2 背压控制

```java
@GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> streamWithBackpressure(@RequestParam String message) {
    return chatClient.prompt()
        .user(message)
        .stream()
        .content()
        .onBackpressureBuffer(1000, () -> {
            log.warn("Backpressure buffer overflow, dropping oldest");
        })
        .rateLimit(50);
}
```

---

## 15. Tool Calling 多轮循环

### 15.1 自动工具调用循环

```java
@Service
public class ToolLoopService {

    private final ChatClient chatClient;
    private final int maxToolRounds = 5;

    public String executeWithToolLoop(String userMessage) {
        String currentMessage = userMessage;
        StringBuilder toolTrace = new StringBuilder();

        for (int round = 0; round < maxToolRounds; round++) {
            ChatResponse response = chatClient.prompt()
                .user(currentMessage)
                .call()
                .chatResponse();

            if (response.getMetadata().getToolCalls() == null
                || response.getMetadata().getToolCalls().isEmpty()) {
                return response.getResult().getOutput().getText();
            }

            toolTrace.append("Round ").append(round).append(": ")
                .append(response.getMetadata().getToolCalls()).append("\n");

            currentMessage = "工具已执行。继续处理。当前进度:\n" + toolTrace;
        }

        return chatClient.prompt()
            .user(currentMessage + "\n请给出最终回答。")
            .call()
            .content();
    }
}
```

### 15.2 工具权限控制

```java
@Configuration
public class ToolSecurityConfig {

    @Bean
    @Description("查询用户订单信息")
    public Function<OrderQuery, OrderResult> queryOrders(
            OrderService orderService, SecurityContext security) {
        return query -> {
            String currentUser = security.getAuthentication().getName();
            if (!query.userId().equals(currentUser)
                && !security.hasRole("AI_ADMIN")) {
                throw new AccessDeniedException("只能查询自己的订单");
            }
            return orderService.query(query);
        };
    }

    @Bean
    @Description("执行数据库 SQL 查询（仅管理员）")
    public Function<SqlQuery, SqlResult> executeSql(
            JdbcTemplate jdbc, SecurityContext security) {
        return query -> {
            if (!security.hasRole("AI_ADMIN")) {
                throw new AccessDeniedException("仅管理员可执行 SQL");
            }
            validateSafeSql(query.sql());
            return jdbc.query(query.sql(), new SqlResultRowMapper());
        };
    }
}
```

---

## 16. 多模态处理

### 16.1 图像理解

```java
@RestController
@RequestMapping("/api/vision")
public class VisionController {

    private final ChatClient chatClient;

    @PostMapping("/analyze")
    public VisionAnalysis analyzeImage(@RequestParam MultipartFile image,
                                        @RequestParam String question) {
        return chatClient.prompt()
            .user(userSpec -> userSpec
                .text(question)
                .media(MimeTypeUtils.IMAGE_PNG, image.getResource()))
            .call()
            .entity(VisionAnalysis.class);
    }

    @PostMapping("/compare")
    public ComparisonResult compareImages(@RequestParam MultipartFile image1,
                                           @RequestParam MultipartFile image2) {
        return chatClient.prompt()
            .user(userSpec -> userSpec
                .text("对比这两张图片的异同")
                .media(MimeTypeUtils.IMAGE_JPEG, image1.getResource())
                .media(MimeTypeUtils.IMAGE_JPEG, image2.getResource()))
            .call()
            .entity(ComparisonResult.class);
    }
}

record VisionAnalysis(
    String description,
    List<String> objects,
    String scene,
    Map<String, Double> attributes
) {}

record ComparisonResult(
    List<String> similarities,
    List<String> differences,
    double similarityScore
) {}
```

### 16.2 音频处理

```java
@Service
public class AudioProcessingService {

    private final ChatClient chatClient;

    public String transcribe(Resource audioFile) {
        return chatClient.prompt()
            .user(userSpec -> userSpec
                .text("转录以下音频内容")
                .media(MimeType.valueOf("audio/mp3"), audioFile))
            .call()
            .content();
    }

    public MeetingSummary summarizeMeeting(Resource audioFile) {
        return chatClient.prompt()
            .system("""
                你是会议纪要专家。请生成：
                1. 会议摘要
                2. 关键决策
                3. 行动项（含负责人）
                4. 待跟进事项
                """)
            .user(userSpec -> userSpec
                .text("分析这次会议")
                .media(MimeType.valueOf("audio/mp3"), audioFile))
            .call()
            .entity(MeetingSummary.class);
    }
}

record MeetingSummary(
    String summary,
    List<String> keyDecisions,
    List<ActionItem> actionItems,
    List<String> followUps
) {}

record ActionItem(String task, String assignee, String deadline) {}
```

---

## 17. Structured Output 深度模式

### 17.1 复杂嵌套结构

```java
@Service
public class DocumentAnalysisService {

    public AnalysisReport analyzeDocument(String documentText) {
        return chatClient.prompt()
            .system("""
                分析文档并返回结构化报告。
                确保所有字段都有值，如果信息不足请标注 "未提及"。
                """)
            .user(documentText)
            .call()
            .entity(AnalysisReport.class);
    }
}

record AnalysisReport(
    DocumentMetadata metadata,
    ExecutiveSummary executiveSummary,
    List<SectionAnalysis> sections,
    RiskAssessment risks,
    List<Recommendation> recommendations,
    ComplianceCheck compliance
) {}

record DocumentMetadata(
    String documentType,
    String primaryTopic,
    List<String> keywords,
    LocalDate referenceDate,
    String language
) {}

record ExecutiveSummary(
    String oneParagraph,
    String keyTakeaway,
    int importanceLevel
) {}

record SectionAnalysis(
    String sectionTitle,
    String summary,
    List<String> keyPoints,
    Sentiment sentiment,
    List<String> mentionedEntities
) {}

record RiskAssessment(
    List<RiskItem> risks,
    String overallRiskLevel,
    String mitigationPriority
) {}

record RiskItem(String description, String impact, String likelihood, String mitigation) {}

record Recommendation(String recommendation, String rationale, String priority) {}

record ComplianceCheck(
    boolean meetsRequirements,
    List<String> gaps,
    List<String> requiredActions
) {}

enum Sentiment { POSITIVE, NEGATIVE, NEUTRAL, MIXED }
```

### 17.2 输出校验与重试

```java
@Service
public class RobustEntityExtractor {

    private final ChatClient chatClient;
    private final Validator validator;

    public <T> T extractWithValidation(String input, Class<T> type) {
        int maxAttempts = 3;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            T result = chatClient.prompt()
                .system(buildValidationPrompt(type))
                .user(input)
                .call()
                .entity(type);

            Set<ConstraintViolation<T>> violations = validator.validate(result);
            if (violations.isEmpty()) {
                return result;
            }

            String errors = violations.stream()
                .map(v -> v.getPropertyPath() + " " + v.getMessage())
                .collect(Collectors.joining(", "));

            log.warn("Attempt {} validation failed: {}", attempt, errors);
        }

        throw new EntityExtractionException("Failed to produce valid output after " + maxAttempts + " attempts");
    }

    private String buildValidationPrompt(Class<?> type) {
        return """
            提取信息并返回严格符合要求的 JSON。
            注意：
            - 所有必填字段必须有值
            - 日期格式: yyyy-MM-dd
            - 金额必须为正数
            - 枚举值必须严格匹配
            """;
    }
}
```

---

## 18. Observability 分布式追踪集成

### 18.1 OpenTelemetry 配置

```yaml
# application.yml
management:
  tracing:
    sampling:
      probability: 1.0
  otlp:
    tracing:
      endpoint: http://otel-collector:4317

spring:
  ai:
    chat:
      observations:
        include-completion: true
        include-prompt: true
```

### 18.2 自定义 Span

```java
@Component
public class AiTracingAdvisor implements CallAroundAdvisor {

    private final Tracer tracer;

    @Override
    public AdvisedResponse aroundCall(AdvisedRequest request, CallAroundAdvisorChain chain) {
        Span span = tracer.nextSpan()
            .name("ai.chat.advisor")
            .tag("ai.model", extractModel(request))
            .tag("ai.prompt.length", String.valueOf(request.userText().length()))
            .tag("ai.tools.count", String.valueOf(request.toolNames().size()))
            .start();

        try (Tracer.SpanInScope ws = tracer.withSpan(span)) {
            AdvisedResponse response = chain.nextAroundCall(request);
            span.tag("ai.response.length",
                String.valueOf(response.response().getResult().getOutput().getText().length()));
            span.tag("ai.tokens.prompt",
                String.valueOf(response.response().getMetadata().getUsage().getPromptTokens()));
            span.tag("ai.tokens.completion",
                String.valueOf(response.response().getMetadata().getUsage().getCompletionTokens()));
            return response;
        } catch (Exception e) {
            span.tag("error", true);
            span.tag("ai.error.type", e.getClass().getSimpleName());
            throw e;
        } finally {
            span.end();
        }
    }

    @Override
    public String getName() { return "AiTracing"; }
}
```

### 18.3 追踪数据流

```
分布式追踪数据流
════════════════════════════════════════════════════════════════════

Trace: 用户请求 → AI 回答
├── Span: HTTP POST /api/chat (Spring MVC)
│   ├── Span: ai.chat.advisor (自定义)
│   │   ├── Span: rag.retrieval (检索)
│   │   │   └── Span: pgvector.query (数据库)
│   │   ├── Span: chat-memory.load (记忆加载)
│   │   │   └── Span: redis.get (缓存)
│   │   ├── Span: openai.chat.completions (LLM API)
│   │   │   └── Span: http.client (OkHttp)
│   │   ├── Span: chat-memory.save (记忆存储)
│   │   └── Span: ai.logging (审计)
│   └── Span: response.serialize (序列化)

关键 Span 标签:
────────────────────────────────────────────────────────────────
• ai.model: 使用的模型名
• ai.tokens.prompt / ai.tokens.completion: Token 用量
• ai.tools.called: 调用的工具列表
• ai.rag.documents: 检索的文档数
• ai.cost.estimate: 预估成本
```

---

*Last updated: 2026-04*

## Related

- [[数学基础/AI_Hardware/README]] — AI硬件与芯片 (AI Hardware) (共享: algorithms, basics, fundamentals, math)
- [[数学基础/Fundamentals-in-nutshell]] — AI 基础速成指南 (共享: algorithms, basics, fundamentals, math)
- [[数学基础/Java_Ecosystem_AI/Java_Ecosystem_AI_Overview]] — Java 生态与 AI：全景概览 (共享: algorithms, basics, fundamentals, math)
- [[数学基础/README]] — 01 基础理论 (Fundamentals) (共享: algorithms, basics, fundamentals, math)
