---
title: Java Cloud SDK AI 集成指南
category: 18-cloud-ops-agent
tags: ["cloud-ops", "devops", "sre", "automation"]
summary: "> 📚 **Spring AI 基础**: 如果你还不熟悉 Spring AI 的核心概念，请先阅读 [Spring AI 深度解析](../01_Fundamentals/Java_Ecosystem_AI/Spring_AI_Deep_Dive.md)。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
---

# Java Cloud SDK AI 集成指南

> 📚 **Spring AI 基础**: 如果你还不熟悉 Spring AI 的核心概念，请先阅读 [Spring AI 深度解析](../01_Fundamentals/Java_Ecosystem_AI/Spring_AI_Deep_Dive.md)。
>
> **一句话理解**: 用 Java SDK 接入 AWS Bedrock、Azure AI、Google Vertex AI、国内云平台 AI 服务 —— 在 Spring Boot 中统一管理多云 AI 调用，实现企业级多云 AI 基础设施。

> **相关文档**: [Cloud Ops Agent](./Cloud_Product_Ops_2026.md) | [Spring AI 深度解析](../01_Fundamentals/Java_Ecosystem_AI/Spring_AI_Deep_Dive.md) | [AI Gateway 概述](../14_AI_Gateway/AI_Gateway_2026.md) | [Java 生态 AI 概览](../01_Fundamentals/Java_Ecosystem_AI/Java_Ecosystem_AI_Overview.md)

---

## 目录

1. [多云 AI SDK 概览](#1-多云-ai-sdk-概览)
2. [AWS Bedrock Java SDK](#2-aws-bedrock-java-sdk)
3. [Azure AI Java SDK](#3-azure-ai-java-sdk)
4. [Google Vertex AI Java SDK](#4-google-vertex-ai-java-sdk)
5. [国内云平台 Java SDK](#5-国内云平台-java-sdk)
6. [Spring AI 多云集成](#6-spring-ai-多云集成)
7. [成本管理与优化](#7-成本管理与优化)

---

## 1. 多云 AI SDK 概览

### 1.1 云厂商 Java SDK 矩阵

| 云厂商 | Java SDK | Spring AI 集成 | 支持模型 |
|--------|---------|---------------|---------|
| **AWS Bedrock** | AWS SDK v2 | ✅ spring-ai-bedrock | Claude、Llama、Titan、Mistral |
| **Azure AI** | Azure AI SDK | ✅ spring-ai-azure-openai | GPT-4o、GPT-4o-mini |
| **Google Vertex AI** | Google Cloud SDK | ✅ spring-ai-vertex-ai | Gemini 2.0/2.5 |
| **阿里云** | DashScope SDK | ✅ spring-ai-qwen | Qwen-Max/Plus |
| **智谱 AI** | zhipu-sdk-java | ✅ spring-ai-zhipu | GLM-4 |
| **百度** | qianfan SDK | ❌ 需自行封装 | ERNIE Bot |
| **腾讯** | hunyuan SDK | ❌ 需自行封装 | Hunyuan |
| **字节跳动** | volc-sdk-java | ❌ 需自行封装 | Doubao |

### 1.2 多云架构

```
┌─────────────────────────────────────────────────────────────────┐
│                  多云 AI Gateway (Spring Boot)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Spring AI 统一抽象层                         │   │
│  │  ChatClient │ EmbeddingModel │ ImageModel │ AudioModel  │   │
│  └──────────────────────┬──────────────────────────────────┘   │
│                         │                                       │
│  ┌──────────────────────▼──────────────────────────────────┐   │
│  │              云路由 + 负载均衡                             │   │
│  │  成本路由 │ 延迟路由 │ 合规路由 │ 地域路由                │   │
│  └────┬─────┬─────┬─────┬─────┬─────┬─────┬───────────────┘   │
│       │     │     │     │     │     │     │                    │
│  ┌────▼──┐┌──▼───┐┌▼────┐┌▼────┐┌▼────┐┌▼────┐┌──▼───┐      │
│  │AWS    ││Azure ││Google││阿里云││智谱  ││百度  ││腾讯  │      │
│  │Bedrock││OpenAI││Vertex││通义  ││GLM-4 ││文心  ││混元  │      │
│  └───────┘└──────┘└─────┘└─────┘└─────┘└─────┘└─────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. AWS Bedrock Java SDK

### 2.1 Maven 依赖

```xml
<dependencies>
    <dependency>
        <groupId>software.amazon.awssdk</groupId>
        <artifactId>bedrockruntime</artifactId>
        <version>2.29.x</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-aws-bedrock-spring-boot-starter</artifactId>
    </dependency>
</dependencies>
```

### 2.2 配置

```yaml
spring:
  ai:
    bedrock:
      anthropic3:
        chat:
          enabled: true
          model: anthropic.claude-3-5-sonnet-20241022-v2:0
          options:
            max-tokens: 4096
            temperature: 0.7
            top-p: 0.95
      cohere:
        embedding:
          enabled: true
          model: cohere.embed-multilingual-v3
```

### 2.3 直接使用 AWS SDK

```java
@Service
public class BedrockService {

    private final BedrockRuntimeClient client;

    public String chat(String message) {
        var request = InvokeModelRequest.builder()
            .modelId("anthropic.claude-3-5-sonnet-20241022-v2:0")
            .contentType("application/json")
            .body(SdkBytes.fromUtf8String("""
                {
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 4096,
                    "messages": [
                        {"role": "user", "content": "%s"}
                    ]
                }
                """.formatted(message)))
            .build();

        InvokeModelResponse response = client.invokeModel(request);
        JsonNode body = objectMapper.readTree(response.body().asUtf8String());
        return body.at("/content/0/text").asText();
    }
}
```

### 2.4 流式调用

```java
public Flux<String> chatStream(String message) {
    var request = InvokeModelWithResponseStreamRequest.builder()
        .modelId("anthropic.claude-3-5-sonnet-20241022-v2:0")
        .contentType("application/json")
        .body(SdkBytes.fromUtf8String(/* ... */))
        .build();

    return Flux.create(sink -> {
        client.invokeModelWithResponseStream(request)
            .handler(ResponseStream.builder()
                .onChunk(event -> {
                    JsonNode chunk = objectMapper.readTree(
                        event.bytes().asUtf8String());
                    String text = chunk.at("/delta/text").asText("");
                    if (!text.isEmpty()) {
                        sink.next(text);
                    }
                })
                .onComplete(event -> sink.complete())
                .onError(event -> sink.error(event.exception()))
                .build());
    });
}
```

---

## 3. Azure AI Java SDK

### 3.1 Maven 依赖

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-ai-openai</artifactId>
    <version>1.0.0-beta.12</version>
</dependency>
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-azure-openai-spring-boot-starter</artifactId>
</dependency>
```

### 3.2 配置

```yaml
spring:
  ai:
    azure:
      openai:
        api-key: ${AZURE_OPENAI_API_KEY}
        endpoint: https://your-resource.openai.azure.com/
        chat:
          options:
            deployment-name: gpt-4o
            temperature: 0.7
            max-tokens: 4096
        embedding:
          options:
            deployment-name: text-embedding-3-small
```

### 3.3 直接使用 Azure SDK

```java
@Service
public class AzureAiService {

    private final OpenAIClient client;

    public AzureAiService(String endpoint, String apiKey) {
        this.client = new OpenAIClientBuilder()
            .endpoint(endpoint)
            .credential(new AzureKeyCredential(apiKey))
            .buildClient();
    }

    public String chat(String message) {
        ChatCompletionsOptions options = new ChatCompletionsOptions(
            List.of(new ChatRequestUserMessage(message)))
            .setDeploymentName("gpt-4o")
            .setMaxTokens(4096)
            .setTemperature(0.7);

        ChatCompletions response = client.getChatCompletions("gpt-4o", options);
        return response.getChoices().get(0).getMessage().getContent();
    }
}
```

---

## 4. Google Vertex AI Java SDK

### 4.1 Maven 依赖

```xml
<dependency>
    <groupId>com.google.cloud</groupId>
    <artifactId>google-cloud-vertexai</artifactId>
    <version>1.15.0</version>
</dependency>
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-vertex-ai-gemini-spring-boot-starter</artifactId>
</dependency>
```

### 4.2 配置

```yaml
spring:
  ai:
    vertex:
      ai:
        gemini:
          project-id: ${GOOGLE_PROJECT_ID}
          location: us-central1
          chat:
            options:
              model: gemini-2.0-flash
              temperature: 0.7
          embedding:
            options:
              model: text-embedding-004
```

### 4.3 直接使用 Vertex AI SDK

```java
@Service
public class VertexAiService {

    private final VertexAI vertexAi;

    public VertexAiService(String projectId, String location) {
        this.vertexAi = new VertexAI(projectId, location);
    }

    public String chat(String message) {
        GenerateContentResponse response = vertexAi.generateContent(
            Content.newBuilder()
                .addParts(Part.newBuilder().setText(message).build())
                .setRole("user")
                .build(),
            GenerateContentConfig.newBuilder()
                .setModel("gemini-2.0-flash")
                .setTemperature(0.7f)
                .setMaxOutputTokens(4096)
                .build());

        return response.getCandidates(0).getContent().getParts(0).getText();
    }
}
```

---

## 5. 国内云平台 Java SDK

### 5.1 阿里云通义千问

```yaml
spring:
  ai:
    qwen:
      api-key: ${DASHSCOPE_API_KEY}
      chat:
        options:
          model: qwen-max
          temperature: 0.7
      embedding:
        options:
          model: text-embedding-v3
```

```java
@Service
public class QwenService {

    private final ChatClient chatClient;

    public QwenService(@Qualifier("qwenChatModel") ChatModel chatModel) {
        this.chatClient = ChatClient.builder(chatModel).build();
    }

    public String chat(String message) {
        return chatClient.prompt()
            .user(message)
            .call()
            .content();
    }
}
```

### 5.2 智谱 AI (GLM-4)

```yaml
spring:
  ai:
    zhipu:
      api-key: ${ZHIPU_API_KEY}
      chat:
        options:
          model: glm-4-plus
          temperature: 0.7
```

### 5.3 百度文心一言

```java
@Service
public class BaiduAiService {

    private final RestTemplate restTemplate;
    private final String accessToken;

    public String chat(String message) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + accessToken);

        Map<String, Object> body = Map.of(
            "model", "ernie-4.0-8k",
            "messages", List.of(
                Map.of("role", "user", "content", message)
            ),
            "temperature", 0.7
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
            "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions",
            new HttpEntity<>(body, headers),
            Map.class);

        return (String) response.getBody().get("result");
    }
}
```

---

## 6. Spring AI 多云集成

### 6.1 统一多云配置

```java
@Configuration
public class MultiCloudConfig {

    @Bean
    @Primary
    public ChatModel routingChatModel(
            @Qualifier("openAiChatModel") ChatModel openAi,
            @Qualifier("bedrockChatModel") ChatModel bedrock,
            @Qualifier("vertexChatModel") ChatModel vertex,
            @Qualifier("qwenChatModel") ChatModel qwen,
            CloudRoutingStrategy routingStrategy) {
        return new RoutingChatModel(
            Map.of(
                "openai", openAi,
                "bedrock", bedrock,
                "vertex", vertex,
                "qwen", qwen
            ),
            routingStrategy
        );
    }
}
```

### 6.2 智能路由策略

```java
@Component
public class CloudRoutingStrategy {

    private final CostTracker costTracker;
    private final LatencyTracker latencyTracker;

    public String route(AiRequest request) {
        if (request.isPrivacySensitive()) {
            return "qwen";
        }
        if (request.getRegion() == Region.CHINA) {
            return "qwen";
        }
        if (request.getRegion() == Region.US) {
            if (costTracker.getDailySpend("openai") >
                    costTracker.getDailyBudget("openai") * 0.8) {
                return "bedrock";
            }
            return "openai";
        }
        if (request.getRegion() == Region.EU) {
            return "vertex";
        }
        return "openai";
    }
}
```

### 6.3 Fallback 链

```java
@Component
public class CloudFallbackChain {

    private final Map<String, ChatModel> models;

    public Flux<String> chatWithFallback(String message) {
        List<String> chain = List.of("openai", "bedrock", "vertex", "qwen");

        return Flux.defer(() -> {
            for (String provider : chain) {
                try {
                    ChatModel model = models.get(provider);
                    return ChatClient.builder(model).build()
                        .prompt().user(message).stream().content();
                } catch (Exception e) {
                    log.warn("Provider {} failed: {}", provider, e.getMessage());
                }
            }
            return Flux.error(new AiServiceException("All providers failed"));
        });
    }
}
```

---

## 7. 成本管理与优化

### 7.1 成本追踪

```java
@Component
public class CloudCostTracker {

    private final Map<String, AtomicDouble> dailyCosts = new ConcurrentHashMap<>();
    private final Map<String, Double> pricing = Map.of(
        "gpt-4o", 0.005,          // per 1K tokens (input)
        "claude-3.5-sonnet", 0.003,
        "gemini-2.0-flash", 0.0001,
        "qwen-max", 0.0004
    );

    public void recordUsage(String model, Usage usage) {
        double inputCost = usage.getPromptTokens() * pricing.getOrDefault(model, 0.0) / 1000;
        double outputCost = usage.getGenerationTokens() * pricing.getOrDefault(model, 0.0) * 3 / 1000;
        dailyCosts.computeIfAbsent(model, k -> new AtomicDouble(0))
            .addAndGet(inputCost + outputCost);
    }

    public double getDailyTotalCost() {
        return dailyCosts.values().stream()
            .mapToDouble(AtomicDouble::get)
            .sum();
    }
}
```

### 7.2 成本优化策略

| 策略 | 说明 | 预期节省 |
|------|------|---------|
| **模型路由** | 简单任务用小模型 | 50-80% |
| **缓存** | 相同查询复用结果 | 20-40% |
| **Embedding 缓存** | 缓存已计算的向量 | 60-80% |
| **Prompt 优化** | 减少 Token 使用 | 10-30% |
| **本地模型** | 高频低复杂度用 Ollama | 90%+ |
| **批量处理** | 非实时任务用 Batch API | 50% |

---

## 关键术语速查

| 术语 | 说明 |
|------|------|
| **AWS Bedrock** | AWS 托管的 AI 模型服务 |
| **Azure OpenAI** | Azure 上的 OpenAI 服务 |
| **Vertex AI** | Google Cloud 的 AI 平台 |
| **DashScope** | 阿里云的 AI 模型服务平台 |
| **多云路由** | 根据条件选择不同云厂商的 AI 服务 |
| **Fallback 链** | 按优先级尝试多个云服务，失败时自动切换 |

---

## 8. 详细计费与成本控制

### 8.1 各云厂商模型定价 (2026 Q2)

| 模型 | 云厂商 | 输入价格 ($/1M tokens) | 输出价格 ($/1M tokens) | 最佳场景 |
|------|--------|----------------------|----------------------|---------|
| GPT-4o | OpenAI/Azure | $2.50 | $10.00 | 复杂推理 |
| GPT-4o-mini | OpenAI/Azure | $0.15 | $0.60 | 日常任务 |
| Claude 3.5 Sonnet | AWS Bedrock | $3.00 | $15.00 | 长文本分析 |
| Gemini 2.0 Flash | Vertex AI | $0.10 | $0.40 | 高性价比 |
| Gemini 2.5 Pro | Vertex AI | $1.25 | $10.00 | 复杂推理 |
| Qwen-Max | 阿里云 | ¥4.00 | ¥12.00 | 中文优化 |
| GLM-4-Plus | 智谱 | ¥5.00 | ¥15.00 | 中文优化 |
| DeepSeek-V3 | DeepSeek | $0.27 | $1.10 | 代码生成 |

### 8.2 成本计算器

```java
@Component
public class CostCalculator {

    public double calculate(String model, int inputTokens, int outputTokens) {
        ModelPricing pricing = PRICING.get(model);
        if (pricing == null) return 0;
        return (inputTokens * pricing.inputPerToken())
             + (outputTokens * pricing.outputPerToken());
    }

    private static final Map<String, ModelPricing> PRICING = Map.of(
        "gpt-4o", new ModelPricing(2.50e-6, 10.00e-6),
        "gpt-4o-mini", new ModelPricing(0.15e-6, 0.60e-6),
        "gemini-2.0-flash", new ModelPricing(0.10e-6, 0.40e-6),
        "qwen-max", new ModelPricing(0.56e-6, 1.68e-6)
    );
}

record ModelPricing(double inputPerToken, double outputPerToken) {}
```

---

## 9. 云迁移策略

### 9.1 从单一云到多云迁移

```
迁移路径
════════════════════════════════════════════════════════════════════

Phase 1: 单云 (2-4 周)
────────────────────────────────────────────────────────────────
• 选择主云（通常是国内选阿里、海外选 AWS）
• 部署 Spring AI + 单云 SDK
• 建立 RAG Pipeline
• 验证核心功能

Phase 2: 双云 (4-6 周)
────────────────────────────────────────────────────────────────
• 添加第二云作为 Fallback
• 实现成本路由（主云预算到 80% 切到副云）
• 测试跨云 Fallback 链

Phase 3: 多云优化 (持续)
────────────────────────────────────────────────────────────────
• 添加本地模型（Ollama）处理高频低价值请求
• 实现按地域路由（国内用户→国内云，海外→AWS/Azure）
• 成本监控和自动优化
```

### 9.2 灾难恢复

```java
@Component
public class DisasterRecoveryStrategy {

    private final Map<String, ChatModel> cloudModels;
    private final HealthIndicator[] healthIndicators;

    public ChatModel getAvailableModel() {
        for (Map.Entry<String, ChatModel> entry : cloudModels.entrySet()) {
            try {
                entry.getValue().call(new Prompt("health check"));
                return entry.getValue();
            } catch (Exception e) {
                log.error("Cloud {} unavailable: {}", entry.getKey(), e.getMessage());
            }
        }
        throw new AiServiceException("All cloud providers unavailable");
    }
}
```

---

## 10. 云厂商错误处理与重试策略

### 10.1 统一错误处理

```java
@Component
public class CloudErrorHandler {

    public <T> T executeWithRetry(CloudOperation<T> operation, String provider) {
        int maxRetries = 3;
        Exception lastException = null;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return operation.execute();
            } catch (Exception e) {
                lastException = e;
                CloudError error = classifyError(e, provider);

                switch (error.action()) {
                    case RETRY -> {
                        long backoff = calculateBackoff(attempt, error.retryAfter());
                        log.warn("Retry {}/{} for {} after {}ms: {}",
                            attempt, maxRetries, provider, backoff, e.getMessage());
                        sleep(backoff);
                    }
                    case FALLBACK -> {
                        log.error("Fallback triggered for {}: {}", provider, e.getMessage());
                        throw new CloudFallbackException(provider, e);
                    }
                    case FAIL -> throw new CloudPermanentException(provider, e);
                }
            }
        }
        throw new CloudRetriesExhaustedException(provider, lastException);
    }

    private CloudError classifyError(Exception e, String provider) {
        int status = extractHttpStatus(e);
        return switch (status) {
            case 429 -> new CloudError(ErrorAction.RETRY, extractRetryAfter(e));
            case 500, 502, 503 -> new CloudError(ErrorAction.RETRY, 5000L);
            case 401, 403 -> new CloudError(ErrorAction.FAIL, null);
            case 400 -> new CloudError(ErrorAction.FAIL, null);
            default -> new CloudError(ErrorAction.RETRY, 1000L);
        };
    }

    private long calculateBackoff(int attempt, Long retryAfter) {
        if (retryAfter != null) return retryAfter;
        return (long) Math.min(1000 * Math.pow(2, attempt - 1), 30000);
    }
}

record CloudError(ErrorAction action, Long retryAfter) {}
enum ErrorAction { RETRY, FALLBACK, FAIL }
```

### 10.2 各云厂商错误码映射

| HTTP 状态码 | AWS Bedrock | Azure OpenAI | GCP Vertex AI | 处理策略 |
|------------|-------------|-------------|---------------|---------|
| 400 | ValidationException | InvalidRequest | InvalidArgument | 记录日志，不重试 |
| 401 | Unauthorized | Unauthorized | Unauthenticated | 检查凭证，告警 |
| 403 | AccessDenied | Forbidden | PermissionDenied | 检查 IAM 权限 |
| 429 | ThrottlingException | RateLimitExceeded | ResourceExhausted | 指数退避重试 |
| 500 | InternalServerException | InternalError | Internal | 重试 3 次 |
| 503 | ServiceUnavailable | ServiceUnavailable | Unavailable | 重试 + Fallback |

---

## 11. 各云 Embedding 服务对比

### 11.1 性能与成本对比

```
云 Embedding 服务对比 (2026 Q1)
════════════════════════════════════════════════════════════════════

厂商         模型                      维度    QPS    延迟    价格/1M tokens
──────────────────────────────────────────────────────────────────
OpenAI       text-embedding-3-small    1536    3500   ~50ms   $0.02
OpenAI       text-embedding-3-large    3072    3500   ~80ms   $0.13
Azure        同 OpenAI (部署在 Azure)  同上    取决部署  同上   同上 + Azure 加价
AWS          titan-embed-text-v2       1024    250    ~30ms   $0.02
AWS          cohere.embed-english-v3   1024    250    ~40ms   $0.02
GCP          text-embedding-005        768     1500   ~35ms   $0.02
GCP          text-multilingual-002     256     1500   ~30ms   $0.02
──────────────────────────────────────────────────────────────────

推荐选择:
────────────────────────────────────────────────────────────────
• 通用场景:   OpenAI text-embedding-3-small (性价比最佳)
• 高精度:    OpenAI text-embedding-3-large
• AWS 原生:  Titan Embed V2 (私有部署)
• 多语言:    GCP text-multilingual (支持 100+ 语言)
• 成本优先:  自部署 BGE-M3 (通过 Ollama/SageMaker)
```

### 11.2 多云 Embedding 路由

```java
@Service
public class MultiCloudEmbeddingService {

    private final Map<String, EmbeddingModel> providers;
    private final EmbeddingConfig config;

    public float[] embed(String text) {
        String preferred = config.getPreferredProvider();

        try {
            return providers.get(preferred)
                .embed(text);
        } catch (Exception e) {
            log.warn("Primary embedding provider {} failed, trying fallback", preferred);
        }

        for (Map.Entry<String, EmbeddingModel> entry : providers.entrySet()) {
            if (entry.getKey().equals(preferred)) continue;
            try {
                return entry.getValue().embed(text);
            } catch (Exception e) {
                log.warn("Fallback provider {} also failed", entry.getKey());
            }
        }

        throw new EmbeddingServiceException("All embedding providers failed");
    }
}
```

---

## 12. 云端 FinOps（成本优化）

### 12.1 Token 成本监控

```java
@Service
public class TokenCostMonitor {

    private final MeterRegistry registry;
    private final AtomicReference<BigDecimal> dailySpend = new AtomicReference<>(BigDecimal.ZERO);

    @Scheduled(cron = "0 0 0 * * *")
    public void resetDailySpend() {
        dailySpend.set(BigDecimal.ZERO);
    }

    public void recordUsage(String provider, String model, Usage usage) {
        BigDecimal cost = calculateCost(provider, model, usage);
        dailySpend.accumulateAndGet(cost, BigDecimal::add);

        registry.counter("ai.token.cost",
            "provider", provider,
            "model", model
        ).increment(cost.doubleValue());

        registry.counter("ai.token.usage",
            "provider", provider,
            "model", model,
            "type", "prompt"
        ).increment(usage.getPromptTokens());

        registry.counter("ai.token.usage",
            "provider", provider,
            "model", model,
            "type", "completion"
        ).increment(usage.getCompletionTokens());
    }

    private BigDecimal calculateCost(String provider, String model, Usage usage) {
        Map<String, BigDecimal> pricing = getPricing(provider, model);
        BigDecimal promptCost = pricing.get("prompt_per_m")
            .multiply(BigDecimal.valueOf(usage.getPromptTokens()))
            .divide(BigDecimal.valueOf(1_000_000), 6, RoundingMode.HALF_UP);
        BigDecimal completionCost = pricing.get("completion_per_m")
            .multiply(BigDecimal.valueOf(usage.getCompletionTokens()))
            .divide(BigDecimal.valueOf(1_000_000), 6, RoundingMode.HALF_UP);
        return promptCost.add(completionCost);
    }
}
```

---

## 13. AWS Bedrock Agent 集成

### 13.1 Bedrock Agent Java SDK

```java
@Service
public class BedrockAgentService {

    private final BedrockAgentClient agentClient;
    private final BedrockAgentRuntimeClient runtimeClient;

    public String invokeAgent(String agentId, String input, String sessionId) {
        InvokeAgentRequest request = InvokeAgentRequest.builder()
            .agentId(agentId)
            .agentAliasId("TSTALIASID")
            .sessionId(sessionId)
            .inputText(input)
            .enableTrace(true)
            .build();

        StringBuilder response = new StringBuilder();
        InvokeAgentResponseHandler.Visitor visitor = InvokeAgentResponseHandler.Visitor.builder()
            .onChunk(chunk -> response.append(chunk.bytes().toStringUtf8()))
            .onTrace(trace -> log.debug("Agent trace: {}", trace))
            .build();

        runtimeClient.invokeAgent(request, visitor);
        return response.toString();
    }

    public Agent createAgent(String name, String instruction, String modelId) {
        return agentClient.createAgent(CreateAgentRequest.builder()
            .agentName(name)
            .instruction(instruction)
            .foundationModel(modelId)
            .description("Spring AI managed agent")
            .build())
            .agent();
    }
}
```

### 13.2 Bedrock 知识库集成

```java
@Service
public class BedrockKnowledgeBaseService {

    private final BedrockAgentClient agentClient;

    public String createKnowledgeBase(String name, String s3Uri, String description) {
        CreateKnowledgeBaseResponse response = agentClient.createKnowledgeBase(
            CreateKnowledgeBaseRequest.builder()
                .name(name)
                .description(description)
                .knowledgeBaseConfiguration(KnowledgeBaseConfiguration.builder()
                    .type("VECTOR")
                    .vectorKnowledgeBaseConfiguration(VectorKnowledgeBaseConfiguration.builder()
                        .embeddingModelArn("arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2")
                        .build())
                    .build())
                .storageConfiguration(StorageConfiguration.builder()
                    .type("OPENSEARCH_SERVERLESS")
                    .opensearchServerlessConfiguration(OpenSearchServerlessConfiguration.builder()
                        .collectionArn("arn:aws:aoss:us-east-1:123456789:collection/my-collection")
                        .vectorIndexName("bedrock-knowledge-base")
                        .fieldMapping(OpenSearchServerlessFieldMapping.builder()
                            .vectorField("bedrock-knowledge-base-default-vector")
                            .textField("AMAZON_BEDROCK_TEXT_CHUNK")
                            .metadataField("AMAZON_BEDROCK_METADATA")
                            .build())
                        .build())
                    .build())
                .dataSource(DataSource.builder()
                    .type("S3")
                    .s3Configuration(S3DataSourceConfiguration.builder()
                        .bucketArn("arn:aws:s3:::my-knowledge-base-bucket")
                        .inclusionPrefixes(List.of("documents/"))
                        .build())
                    .build())
                .build());

        return response.knowledgeBase().knowledgeBaseId();
    }

    public void syncKnowledgeBase(String knowledgeBaseId) {
        agentClient.startIngestionJob(StartIngestionJobRequest.builder()
            .knowledgeBaseId(knowledgeBaseId)
            .dataSourceId(getDataSourceId(knowledgeBaseId))
            .build());
    }
}
```

---

## 14. Azure AI Search 深度集成

### 14.1 Azure AI Search + Spring AI

```java
@Configuration
public class AzureSearchConfig {

    @Bean
    public SearchClient searchClient() {
        return new SearchClientBuilder()
            .endpoint("https://my-search.search.windows.net")
            .credential(new DefaultAzureCredentialBuilder().build())
            .indexName("ai-documents")
            .buildClient();
    }
}

@Service
public class AzureSearchService {

    private final SearchClient searchClient;
    private final EmbeddingModel embeddingModel;

    public List<SearchResult> hybridSearch(String query) {
        float[] embedding = embeddingModel.embed(query);
        float[] vector = embedding;

        SearchPagedResults results = searchClient.search(
            SearchOptions.builder()
                .vector(new SearchVector()
                    .setFields("content_vector")
                    .setValue(vector)
                    .setKNearestNeighborsCount(5))
                .queryType(SearchQueryType.SEMANTIC)
                .semanticConfigurationName("my-semantic-config")
                .queryAnswer(QueryAnswerType.EXTRACTIVE)
                .queryCaption(QueryCaptionType.EXTRACTIVE)
                .top(10)
                .select("id", "title", "content", "source", "category")
                .filter("category eq 'policy' and security_level le 2")
                .build());

        return results.stream()
            .map(result -> new SearchResult(
                result.getDocument(Map.class).get("title").toString(),
                result.getDocument(Map.class).get("content").toString(),
                result.getScore(),
                result.getDocument(Map.class).get("source").toString()))
            .toList();
    }

    public void indexDocuments(List<Document> documents) {
        List<SearchDocument> searchDocs = documents.stream()
            .map(doc -> {
                float[] vector = embeddingModel.embed(doc.getText());
                SearchDocument sd = new SearchDocument();
                sd.put("id", doc.getId());
                sd.put("content", doc.getText());
                sd.put("content_vector", vector);
                sd.putAll(doc.getMetadata());
                return sd;
            })
            .toList();

        searchClient.uploadDocuments(searchDocs);
    }
}

record SearchResult(String title, String content, double score, String source) {}
```

---

## 15. 私有化部署方案

### 15.1 Ollama + Spring AI 私有化

```yaml
# application-private.yml
spring:
  ai:
    ollama:
      base-url: http://ollama-server:11434
      chat:
        model: qwen2.5:7b
        options:
          temperature: 0.7
          num-predict: 4096
      embedding:
        model: nomic-embed-text
        options:
          dimensions: 768
```

### 15.2 私有化部署架构

```
私有化 AI 部署架构
════════════════════════════════════════════════════════════════════

方案 1: 全私有化 (Ollama + PGVector)
────────────────────────────────────────────────────────────────
┌──────────┐    ┌──────────────┐    ┌───────────────┐
│ Client   │───▶│ Spring AI    │───▶│ Ollama Server │
│          │    │ Service      │    │ (Qwen2.5 7B)  │
└──────────┘    └──────┬───────┘    └───────────────┘
                       │
                ┌──────▼───────┐
                │ PGVector     │
                │ (Embedding)  │
                └──────────────┘

GPU 需求: 1x RTX 4090 (24GB) 或 A10G
月成本: ~$200 (GPU 服务器)
适合: 安全要求高的企业

方案 2: 半私有化 (混合模式)
────────────────────────────────────────────────────────────────
┌──────────┐    ┌──────────────┐    ┌───────────────────┐
│ Client   │───▶│ Spring AI    │───▶│ Route:            │
│          │    │ Gateway      │    │ 敏感数据 → Ollama  │
└──────────┘    └──────┬───────┘    │ 普通数据 → OpenAI  │
                       │            └───────────────────┘
                       │
            ┌──────────▼──────────┐
            │ PGVector + Redis    │
            └─────────────────────┘

GPU 需求: 1x T4 (16GB) + OpenAI API
月成本: ~$100 (GPU) + API 按量
适合: 大多数企业

方案 3: vLLM 高性能私有化
────────────────────────────────────────────────────────────────
• 使用 vLLM 作为推理后端
• 支持 Continuous Batching
• 吞吐量比 Ollama 高 3-5 倍
• GPU 需求: 2x A100 (80GB)
• 适合: 大规模推理场景
```

---

*Last updated: 2026-04*

## Related

- [[18_Cloud_Ops_Agent/CloudOps-in-nutshell]] — 云产品运维 Agent 速成指南 (共享: automation, cloud-ops, devops, sre)
- [[18_Cloud_Ops_Agent/Cloud_Product_Ops_for_dummy]] — 云产品运维 Agent 入门指南 (for Dummies) (共享: automation, cloud-ops, devops, sre)
- index — 云产品运维 Agent 架构设计指南 (Architecture) (共享: automation, cloud-ops, devops, sre)
- index — 云产品运维 Agent 语料工程指南 (Corpus Engineering) (共享: automation, cloud-ops, devops, sre)
- README_for_dummy
