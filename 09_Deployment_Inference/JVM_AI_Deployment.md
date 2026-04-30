# JVM AI 部署与推理

> **一句话理解**: JVM 平台的 AI 推理部署 —— 从 Spring Boot 容器化到 GraalVM Native Image，从本地模型推理到 Kubernetes 弹性伸缩，覆盖 Java AI 应用的完整部署生命周期。

> **相关文档**: [部署与推理概述](./Deployment_Inference.md) | [Spring AI 架构设计](../12_Architecture_Infrastructure/Spring_AI_Architecture.md) | [高可用设计](../12_Architecture_Infrastructure/High_Availability_2026.md) | [Java 生态 AI 概览](../01_Fundamentals/Java_Ecosystem_AI/Java_Ecosystem_AI_Overview.md)

---

## 目录

1. [JVM AI 部署概览](#1-jvm-ai-部署概览)
2. [Spring Boot 容器化](#2-spring-boot-容器化)
3. [GraalVM Native Image](#3-graalvm-native-image)
4. [JVM 调优](#4-jvm-调优)
5. [本地模型推理](#5-本地模型推理)
6. [Kubernetes 部署](#6-kubernetes-部署)
7. [性能基准](#7-性能基准)
8. [监控与运维](#8-监控与运维)

---

## 1. JVM AI 部署概览

### 1.1 部署模式

```
JVM AI 部署模式
════════════════════════════════════════════════════════════════════

Mode 1: API 代理模式 (最常见)
────────────────────────────────────────────────────────────────
┌──────────┐     ┌──────────────────┐     ┌──────────────┐
│  客户端   │────▶│  Spring Boot App │────▶│  LLM API     │
│          │◀────│  (API 代理)      │◀────│  OpenAI/等   │
└──────────┘     └──────────────────┘     └──────────────┘
特点: 低资源、高并发、轻量 JVM

Mode 2: 本地推理模式
────────────────────────────────────────────────────────────────
┌──────────┐     ┌──────────────────┐     ┌──────────────┐
│  客户端   │────▶│  Spring Boot App │────▶│  本地模型     │
│          │◀────│  + ONNX/DJL      │◀────│  (GPU/CPU)   │
└──────────┘     └──────────────────┘     └──────────────┘
特点: 低延迟、隐私安全、需 GPU

Mode 3: 混合模式
────────────────────────────────────────────────────────────────
┌──────────┐     ┌──────────────────┐
│  客户端   │────▶│  AI Gateway      │──┬──▶ OpenAI (复杂任务)
│          │◀────│  (路由)           │  ├──▶ 本地 (私密数据)
└──────────┘     └──────────────────┘  └──▶ Ollama (日常任务)
特点: 成本优化、灵活路由
```

### 1.2 技术选型矩阵

| 部署目标 | 推荐 runtime | 启动时间 | 内存 | 适用 |
|---------|-------------|---------|------|------|
| **传统 VM** | HotSpot JVM | 3-5s | 512MB+ | 长期运行服务 |
| **Kubernetes** | HotSpot JVM | 3-5s | 512MB+ | 弹性伸缩 |
| **Serverless** | GraalVM Native | <50ms | 50-100MB | 冷启动敏感 |
| **边缘设备** | GraalVM Native | <50ms | 30-50MB | 资源受限 |
| **GPU 推理** | HotSpot JVM + DJL | 5-10s | 2-8GB | 本地模型 |

---

## 2. Spring Boot 容器化

### 2.1 Dockerfile (分层构建)

```dockerfile
# Stage 1: Build
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY gradle/ gradle/
COPY gradlew build.gradle settings.gradle ./
RUN ./gradlew dependencies --no-daemon
COPY src/ src/
RUN ./gradlew bootJar --no-daemon -x test

# Stage 2: Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

COPY --from=builder /app/build/libs/*.jar app.jar

ENV JAVA_OPTS="-XX:+UseZGC \
               -XX:+ZGenerational \
               -XX:MaxRAMPercentage=75.0 \
               -XX:+UseStringDeduplication \
               -Djava.security.egd=file:/dev/./urandom"

USER appuser

EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### 2.2 Docker Compose 开发环境

```yaml
version: '3.8'
services:
  ai-app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_AI_OPENAI_API_KEY=${OPENAI_API_KEY}
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ai_db
      - SPRING_AI_VECTORSTORE_PGVECTOR_INITIALIZE-SCHEMA=true
    depends_on:
      postgres:
        condition: service_healthy
      ollama:
        condition: service_started

  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: ai_db
      POSTGRES_USER: ai_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ai_user -d ai_db"]
      interval: 5s
      timeout: 3s
      retries: 5

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

volumes:
  pgdata:
  ollama_data:
```

### 2.3 镜像优化

| 技术 | 镜像大小 | 启动时间 | 说明 |
|------|---------|---------|------|
| **标准 JRE** | ~400MB | 3-5s | 基础方案 |
| **JLink 定制 JRE** | ~150MB | 2-3s | 只包含需要的模块 |
| **Distroless** | ~200MB | 3-5s | 最小攻击面 |
| **GraalVM Native** | ~80MB | <50ms | 最优启动 |

```dockerfile
# JLink 定制 JRE
FROM eclipse-temurin:21-jdk AS jlink
RUN jlink \
    --add-modules java.base,java.logging,java.sql,java.naming,java.desktop,java.management,java.security.jgss,java.instrument \
    --strip-debug \
    --no-man-pages \
    --no-header-files \
    --compress=2 \
    --output /custom-jre

FROM debian:bookworm-slim
COPY --from=jlink /custom-jre /opt/jre
COPY app.jar /app/app.jar
ENV PATH="/opt/jre/bin:${PATH}"
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

---

## 3. GraalVM Native Image

### 3.1 Spring AI Native Image 配置

```xml
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
</plugin>
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <image>
            <name>ai-service-native</name>
            <builder>paketobuildpacks/builder-jammy-tiny</builder>
            <env>
                <BP_NATIVE_IMAGE>true</BP_NATIVE_IMAGE>
                <BP_JVM_VERSION>21</BP_JVM_VERSION>
            </env>
        </image>
    </configuration>
</plugin>
```

### 3.2 反射配置

```json
// src/main/resources/META-INF/native-image/reflect-config.json
[
  {
    "name": "com.example.ai.model.AnalysisResult",
    "allDeclaredConstructors": true,
    "allDeclaredMethods": true,
    "allDeclaredFields": true
  },
  {
    "name": "com.example.ai.tool.WeatherResponse",
    "allDeclaredConstructors": true,
    "allDeclaredMethods": true,
    "allDeclaredFields": true
  }
]
```

### 3.3 Native Image 注意事项

| 注意点 | 说明 | 解决方案 |
|--------|------|---------|
| **反射** | Native Image 不支持运行时反射 | 使用 `@RegisterReflectionForBinding` |
| **动态代理** | JDK 动态代理需显式配置 | Spring AOT 自动处理 |
| **资源文件** | 默认不包含非代码资源 | `resource-config.json` 声明 |
| **序列化** | Jackson 序列化需配置 | Spring AI 已自动配置 |
| **JNI** | 部分 JNI 调用不兼容 | 避免使用或提供 JNI 配置 |

```java
@SpringBootApplication
@RegisterReflectionForBinding({
    AnalysisResult.class,
    WeatherResponse.class,
    SearchResult.class
})
public class AiApplication {
    public static void main(String[] args) {
        SpringApplication.run(AiApplication.class, args);
    }
}
```

### 3.4 Native Build 性能

| 指标 | JVM 模式 | Native Image |
|------|---------|-------------|
| 构建时间 | 30s | 3-5 min |
| 镜像大小 | 400MB | 80MB |
| 启动时间 | 3.5s | 45ms |
| 首次请求 | 500ms (JIT 预热) | 180ms |
| 稳态吞吐 | 1000 RPS | 850 RPS |
| 内存占用 | 512MB | 80MB |
| 冷启动成本 | 高 | 极低 |

---

## 4. JVM 调优

### 4.1 GC 选择

| GC | 适用场景 | 延迟 | 吞吐 |
|----|---------|------|------|
| **ZGC (Generational)** | AI API 服务 (推荐) | <1ms | 高 |
| **G1GC** | 通用场景 | 10-50ms | 很高 |
| **Shenandoah** | 低延迟 | <10ms | 高 |
| **Serial** | 资源受限 | 长 | 低 |

### 4.2 JVM 参数模板

```bash
# AI API 服务 (高并发，低延迟)
JAVA_OPTS="
  -XX:+UseZGC
  -XX:+ZGenerational
  -XX:MaxRAMPercentage=75.0
  -XX:+UseStringDeduplication
  -XX:+AlwaysPreTouch
  -Djava.security.egd=file:/dev/./urandom
  -Dfile.encoding=UTF-8
  -XX:+EnableDynamicAgentLoading
"

# 本地推理 (大内存)
JAVA_OPTS="
  -XX:+UseG1GC
  -Xms4g -Xmx8g
  -XX:MaxGCPauseMillis=100
  -XX:+UseLargePages
  -XX:LargePageSizeInBytes=2m
"

# Serverless (快速启动)
JAVA_OPTS="
  -XX:+UseZGC
  -Xms128m -Xmx256m
  -XX:+TieredCompilation
  -XX:TieredStopAtLevel=1
  -Dspring.main.lazy-initialization=true
"
```

### 4.3 Virtual Threads 配置

```yaml
spring:
  threads:
    virtual:
      enabled: true
  ai:
    chat:
      client:
        enabled: true

server:
  tomcat:
    threads:
      max: 200
    max-connections: 10000
```

---

## 5. 本地模型推理

### 5.1 Ollama 集成

```yaml
spring:
  ai:
    ollama:
      base-url: http://localhost:11434
      chat:
        options:
          model: qwen2.5:72b
          num-gpu: 1
          temperature: 0.7
      embedding:
        options:
          model: nomic-embed-text
```

### 5.2 ONNX Runtime (DJL)

```java
@Configuration
public class LocalInferenceConfig {

    @Bean
    public ZoeDepthModel depthModel() throws ModelException, IOException {
        Criteria<BufferedImage, DepthResult> criteria = Criteria.builder()
            .optApplication(Application.CV.DEPTH_ESTIMATION)
            .setTypes(BufferedImage.class, DepthResult.class)
            .optFilter("backbone", "vitl")
            .optEngine("PyTorch")
            .optDevice(Device.gpu())
            .build();

        return criteria.loadModel();
    }

    @Bean
    public Predictor<BufferedImage, DepthResult> depthPredictor(ZoeDepthModel model) {
        return model.newPredictor();
    }
}
```

### 5.3 本地 Embedding 模型

```java
@Configuration
public class LocalEmbeddingConfig {

    @Bean
    public EmbeddingModel localEmbeddingModel() {
        return new OnnxEmbeddingModel(
            new File("models/all-MiniLM-L6-v2.onnx"),
            new File("models/tokenizer.json"),
            384
        );
    }
}
```

---

## 6. Kubernetes 部署

### 6.1 Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-service
  labels:
    app: ai-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-service
  template:
    metadata:
      labels:
        app: ai-service
    spec:
      containers:
      - name: ai-service
        image: registry.company.com/ai-service:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_AI_OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: ai-secrets
              key: openai-api-key
        - name: JAVA_OPTS
          value: "-XX:+UseZGC -XX:+ZGenerational -XX:MaxRAMPercentage=75.0"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ai-service
spec:
  selector:
    app: ai-service
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-service
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 60
  - type: Pods
    pods:
      metric:
        name: http_server_requests_seconds_count
      target:
        type: AverageValue
        averageValue: "100"
```

### 6.2 GPU 节点调度 (本地推理)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-inference-gpu
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: inference
        image: registry.company.com/ai-inference:latest
        resources:
          limits:
            nvidia.com/gpu: 1
            memory: "8Gi"
          requests:
            nvidia.com/gpu: 1
            memory: "4Gi"
      nodeSelector:
        gpu-type: nvidia-a100
      tolerations:
      - key: nvidia.com/gpu
        operator: Exists
        effect: NoSchedule
```

---

## 7. 性能基准

### 7.1 Spring AI 吞吐量参考

```
Spring AI 性能基准 (GPT-4o API 代理模式)
════════════════════════════════════════════════════════════════════

测试条件: 4 Core / 8GB RAM / Java 21 / ZGC
────────────────────────────────────────────────────────────────
并发用户    RPS     P50延迟    P99延迟    错误率
10         85      120ms      450ms      0%
50         380     135ms      680ms      0%
100        650     160ms      1200ms     0.1%
200        950     210ms      2800ms     0.5%
500        1200    420ms      5500ms     2.1%

瓶颈分析:
────────────────────────────────────────────────────────────────
• CPU: 不是瓶颈 (AI API 调用是 I/O 密集)
• 网络: LLM API 延迟是主要瓶颈 (500ms-3s)
• 内存: Virtual Threads 使内存不再是瓶颈
• 连接池: HTTP 连接池需合理配置
```

### 7.2 GraalVM vs JVM 对比

| 场景 | JVM (JIT) | Native Image | 优势方 |
|------|-----------|-------------|--------|
| 冷启动 + 1 请求 | 3.5s + 500ms | 45ms + 180ms | Native |
| 稳态 100 RPS | P50: 120ms | P50: 135ms | JVM |
| 稳态 1000 RPS | P50: 160ms | P50: 190ms | JVM |
| K8s 扩容 (0→3) | 25s | 5s | Native |
| 内存占用 | 512MB | 80MB | Native |

### 7.3 优化建议

```
性能优化优先级
════════════════════════════════════════════════════════════════════

P0: 必须做
├── 启用 Virtual Threads (spring.threads.virtual.enabled=true)
├── 配置 HTTP 连接池
├── 设置合理的超时 (connect: 5s, read: 30s)
└── 启用 GZIP 压缩

P1: 推荐做
├── Embedding 缓存 (减少 80% API 调用)
├── 响应缓存 (相似查询复用)
├── ZGC + Generational 模式
└── JVM 参数调优

P2: 可选做
├── GraalVM Native Image (Serverless 场景)
├── 预热策略 (JIT 预热)
├── 连接池预热
└── Native Image 分层缓存
```

---

## 8. 监控与运维

### 8.1 Prometheus 指标

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    tags:
      application: ${spring.application.name}
    export:
      prometheus:
        enabled: true
  endpoint:
    health:
      show-details: when-authorized
```

### 8.2 关键告警规则

```yaml
groups:
  - name: ai-service-alerts
    rules:
      - alert: AiHighErrorRate
        expr: rate(http_server_requests_seconds_count{status=~"5.."}[5m]) > 0.05
        for: 2m
        annotations:
          summary: "AI 服务错误率超过 5%"

      - alert: AiHighLatency
        expr: histogram_quantile(0.99, rate(http_server_requests_seconds_bucket[5m])) > 5
        for: 5m
        annotations:
          summary: "AI 服务 P99 延迟超过 5 秒"

      - alert: AiTokenQuotaNearLimit
        expr: ai_daily_tokens_used / ai_daily_token_limit > 0.8
        for: 10m
        annotations:
          summary: "每日 Token 配额使用超过 80%"

      - alert: AiModelFallback
        expr: increase(ai_model_fallback_total[10m]) > 5
        annotations:
          summary: "10 分钟内模型 Fallback 超过 5 次"
```

---

## 关键术语速查

| 术语 | 说明 |
|------|------|
| **GraalVM Native Image** | AOT 编译，快速启动、低内存 |
| **ZGC** | Z Garbage Collector，低延迟 GC |
| **Virtual Threads** | Java 21 虚拟线程，轻量并发 |
| **DJL** | Deep Java Library，Java 深度学习推理 |
| **HPA** | Horizontal Pod Autoscaler，K8s 水平自动伸缩 |
| **jlink** | JDK 工具，定制最小化 JRE |

---

## 9. Quarkus 与 Micronaut AI 微服务

### 9.1 Quarkus + LangChain4j

```java
@Path("/chat")
public class ChatResource {

    @Inject
    ChatLanguageModel model;

    @POST
    @Produces(MediaType.TEXT_PLAIN)
    public String chat(String message) {
        return model.chat(message);
    }
}
```

```yaml
quarkus:
  langchain4j:
    openai:
      api-key: ${OPENAI_API_KEY}
      model-name: gpt-4o
      temperature: 0.7
```

```
Quarkus AI 优势
════════════════════════════════════════════════════════════════════

• 启动时间: ~30ms (原生编译)
• 内存: ~30MB RSS
• 首次请求: 无 JIT 预热问题
• 扩展: quarkus-langchain4j 集成
• 适用: Serverless、边缘 AI、资源受限环境
```

### 9.2 Micronaut + AI

```java
@Controller("/chat")
public class ChatController {

    @Inject
    ChatClient chatClient;

    @Post
    @Produces(MediaType.TEXT_PLAIN)
    public String chat(@Body String message) {
        return chatClient.chat(message);
    }
}
```

### 9.3 框架选型对比

| 维度 | Spring Boot | Quarkus | Micronaut |
|------|-------------|---------|-----------|
| **启动时间 (JVM)** | 3-5s | 1-2s | 1-2s |
| **启动时间 (Native)** | 50ms | 20ms | 30ms |
| **内存 (Native)** | 80MB | 30MB | 40MB |
| **AI 框架** | Spring AI | LangChain4j | LangChain4j |
| **Spring 生态兼容** | 完全 | 部分 | 不兼容 |
| **企业采纳度** | 最高 | 增长中 | 小众 |
| **推荐场景** | 企业级 | Serverless | 轻量微服务 |

---

## 10. Service Mesh 与 GitOps

### 10.1 Istio + Spring AI

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ai-service-vs
spec:
  hosts: [ai-service]
  http:
  - route:
    - destination:
        host: ai-service
        port: {number: 8080}
      weight: 90
    - destination:
        host: ai-service-canary
        port: {number: 8080}
      weight: 10
    retries:
      attempts: 3
      perTryTimeout: 10s
    timeout: 30s
```

### 10.2 ArgoCD GitOps 部署

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ai-service
spec:
  source:
    repoURL: https://github.com/company/ai-infra
    path: k8s/ai-service
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: ai
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

---

## 11. 蓝绿与金丝雀发布

### 11.1 蓝绿部署

```yaml
# blue-green-deployment.yml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: ai-service
spec:
  replicas: 4
  strategy:
    blueGreen:
      activeService: ai-service-active
      previewService: ai-service-preview
      autoPromotionEnabled: false
      scaleDownDelaySeconds: 600
      prePromotionAnalysis:
        templates:
          - templateName: ai-health-check
        args:
          - name: service-name
            value: ai-service-preview
---
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: ai-health-check
spec:
  metrics:
    - name: error-rate
      provider:
        prometheus:
          query: |
            sum(rate(http_requests_total{service="ai-service",status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total{service="ai-service"}[5m]))
      successCondition: result[0] < 0.01
      failureLimit: 1
    - name: p99-latency
      provider:
        prometheus:
          query: |
            histogram_quantile(0.99,
              sum(rate(http_request_duration_bucket{service="ai-service"}[5m]))
              by (le))
      successCondition: result[0] < 5
      failureLimit: 1
```

### 11.2 金丝雀发布

```yaml
# canary-deployment.yml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: ai-service-canary
spec:
  replicas: 6
  strategy:
    canary:
      steps:
        - setWeight: 5
        - pause: { duration: 10m }
        - setWeight: 20
        - pause: { duration: 30m }
        - setWeight: 50
        - pause: { duration: 1h }
        - setWeight: 80
        - pause: { duration: 30m }
        - setWeight: 100
      canaryMetricTemplate:
        - name: ai-quality-score
          templateRef:
            templateName: ai-output-quality
          provider:
            web:
              url: http://quality-checker:8080/check
```

---

## 12. JFR 性能分析

### 12.1 JVM Flight Recorder 配置

```bash
# 启动时开启 JFR（生产推荐）
java -jar ai-service.jar \
  -XX:StartFlightRecording=\
duration=3600s,\
filename=/tmp/ai-service-$(date +%Y%m%d-%H%M).jfr,\
settings=profile,\
dumponexit=true

# 实时查看热点方法（排查 AI 瓶颈）
jcmd <pid> JFR.check
jcmd <pid> JFR.dump filename=/tmp/dump.jfr
```

### 12.2 AI 服务性能分析维度

```
JFR 性能分析清单
════════════════════════════════════════════════════════════════════

CPU 热点:
────────────────────────────────────────────────────────────────
□ Embedding 计算是否占 CPU 过多
□ JSON 序列化/反序列化开销
□ 正则表达式匹配（Prompt 模板）

GC 分析:
────────────────────────────────────────────────────────────────
□ GC 频率和停顿时间
□ 大对象分配（批量 Embedding 结果）
□ 内存碎片化程度

线程分析:
────────────────────────────────────────────────────────────────
□ HTTP 线程池是否耗尽
□ AI 调用阻塞线程数
□ 异步任务队列积压

网络 I/O:
────────────────────────────────────────────────────────────────
□ LLM API 调用延迟分布
□ 连接池利用率
□ TLS 握手开销

常见性能优化:
────────────────────────────────────────────────────────────────
• Embedding 结果缓存 → 减少 80% 重复计算
• 连接池预热 → 首次请求延迟降低 200ms
• JSON 预分配 Buffer → 减少 GC 压力
• 虚拟线程 (Java 21+) → 同步代码获得异步性能
```

---

## 13. 生产排障手册

### 13.1 快速诊断命令

```bash
# 1. 检查 JVM 状态
jcmd <pid> VM.info
jcmd <pid> GC.heap_info

# 2. 线程转储（排查死锁/阻塞）
jcmd <pid> Thread.print -l > thread_dump.txt

# 3. 堆转储（排查内存泄漏）
jcmd <pid> GC.heap_dump /tmp/heap_dump.hprof

# 4. 查看 AI 服务健康
curl -s http://localhost:8080/actuator/health/ai
curl -s http://localhost:8080/actuator/metrics/ai.chat.calls
curl -s http://localhost:8080/actuator/metrics/ai.chat.duration

# 5. 查看 LLM API 连通性
curl -w "@curl-format.txt" -o /dev/null -s \
  https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# 6. Kubernetes 排查
kubectl logs -f deployment/ai-service --tail=100
kubectl top pods -l app=ai-service
kubectl describe pod <pod-name>
```

### 13.2 日志查询模板

```
生产日志排查模板
════════════════════════════════════════════════════════════════════

# 查找 AI 调用失败的请求
grep "ERROR.*AiChatService" app.log | tail -50

# 查找超时请求
grep "timeout.*LLM" app.log | awk '{print $1, $NF}' | tail -20

# 查找 Token 用量 Top 10 用户
grep "token_usage" app.log | \
  awk -F'user=' '{print $2}' | awk -F',' '{print $1}' | \
  sort | uniq -c | sort -rn | head -10

# 查找 Prompt 注入尝试
grep -i "ignore.*instruction\|system.*prompt\|jailbreak" app.log

# 查找熔断器打开事件
grep "CircuitBreaker.*OPEN" app.log
```

---

## 14. GraalVM Native Image 深度优化

### 14.1 Spring AI Native Image 配置

```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
    <configuration>
        <buildArgs>
            <buildArg>--initialize-at-build-time=org.springframework.ai</buildArg>
            <buildArg>--initialize-at-run-time=io.netty.channel</buildArg>
            <buildArg>-H:+ReportExceptionStackTraces</buildArg>
            <buildArg>--no-fallback</buildArg>
            <buildArg>-Os</buildArg>
        </buildArgs>
        <metadataRepository>
            <enabled>true</enabled>
        </metadataRepository>
    </configuration>
</plugin>
```

### 14.2 Native Image 兼容性处理

```
GraalVM Native Image 兼容性矩阵
════════════════════════════════════════════════════════════════════

组件                兼容性    备注
──────────────────────────────────────────────────────────────────
Spring AI Core      ✅       需要 runtime init 配置
OpenAI Client       ✅       OkHttp 需要反射配置
PGVector Store      ✅       JDBC 需要运行时初始化
Milvus Store        ✅       gRPC 客户端需要配置
Redis Memory        ✅       Lettuce 需要 native hint
Jackson JSON        ✅       需要 reflection-config.json
OkHttp              ✅       需要 --initialize-at-run-time
JDBC (HikariCP)     ✅       需要 --initialize-at-run-time
Hibernate           ⚠️       需要增强插件
Kafka Client        ✅       需要 native hint
──────────────────────────────────────────────────────────────────

常见问题与解决:
────────────────────────────────────────────────────────────────
1. ClassNotFoundException at runtime
   → 添加 reflect-config.json 或 @RegisterReflectionForBinding

2. FileNotFoundException for resources
   → 添加 resource-config.json 或 @IncludeResource

3. Proxy creation failed
   → 添加 proxy-config.json 或 @RegisterReflectionForBinding

4. JNI 注册失败
   → 添加 jni-config.json
```

```json
// src/main/resources/META-INF/native-image/reflect-config.json
[
  {
    "name": "org.springframework.ai.chat.model.ChatResponse",
    "allDeclaredConstructors": true,
    "allPublicMethods": true,
    "allDeclaredFields": true
  },
  {
    "name": "org.springframework.ai.chat.messages.AssistantMessage",
    "allDeclaredConstructors": true,
    "allPublicMethods": true,
    "allDeclaredFields": true
  }
]
```

---

## 15. Kubernetes HPA 自定义指标

### 15.1 基于 AI QPS 的自动扩缩

```yaml
# 自定义指标 PodMonitor
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: ai-service-metrics
spec:
  selector:
    matchLabels:
      app: ai-service
  endpoints:
    - port: http
      path: /actuator/prometheus
      interval: 15s
---
# HPA 配置
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-service
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Pods
      pods:
        metric:
          name: ai_chat_requests_per_second
        target:
          type: AverageValue
          averageValue: "10"
    - type: Pods
      pods:
        metric:
          name: ai_chat_duration_seconds_sum
        target:
          type: AverageValue
          averageValue: "3"
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 70
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 30
      policies:
        - type: Pods
          value: 3
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 1
          periodSeconds: 120
```

### 15.2 扩缩策略

```
HPA 扩缩决策流程
════════════════════════════════════════════════════════════════════

扩容触发:
────────────────────────────────────────────────────────────────
• AI QPS > 10/pod → 扩容 +3 Pod（最快 30s 内）
• P99 延迟 > 3s → 扩容 +2 Pod
• 内存使用 > 70% → 扩容 +1 Pod

缩容触发:
────────────────────────────────────────────────────────────────
• AI QPS < 5/pod 且持续 5 分钟 → 缩容 -1 Pod
• 每 120 秒最多缩 1 Pod（保守策略）

特殊处理:
────────────────────────────────────────────────────────────────
• LLM API 限流时 → 不扩容（扩容也无效）
• Native Image 冷启动 → 设置 readlinessProbe 延迟
• 高峰预扩容 → 定时 CronHPA（如工作日 9:00）
```

---

## 16. 灾难恢复方案

### 16.1 AI 服务 DR 等级

```
AI 服务灾难恢复等级
════════════════════════════════════════════════════════════════════

等级       RTO        RPO        方案                   成本
──────────────────────────────────────────────────────────────────
Tier-1    < 1 min    0          Active-Active 多区域    高
Tier-2    < 5 min    < 1 min    Active-Passive 热备     中
Tier-3    < 30 min   < 15 min   Cold Standby + 备份     低
──────────────────────────────────────────────────────────────────

推荐: Tier-2（适合大多数企业）
────────────────────────────────────────────────────────────────
• 主区域: 全部 AI 服务
• 备区域: 数据库只读副本 + 最小化 AI 服务
• 切换: DNS 故障转移 + 自动健康检查
```

### 16.2 备份策略

```yaml
# Velero 备份配置
apiVersion: velero.io/v1
kind: Schedule
metadata:
  name: ai-service-backup
  namespace: velero
spec:
  schedule: "0 2 * * *"
  template:
    includedNamespaces:
      - ai
    includedResources:
      - deployments
      - configmaps
      - secrets
      - persistentvolumeclaims
    storageLocation: s3-backup
    ttl: 720h
---
# 数据库备份 (PGVector)
apiVersion: batch/v1
kind: CronJob
metadata:
  name: pgvector-backup
spec:
  schedule: "0 */6 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: pg-dump
              image: postgres:16
              command:
                - pg_dump
                - -Fc
                - -f
                - /backup/pgvector-$(date +%Y%m%d-%H%M).dump
              env:
                - name: PGHOST
                  value: pgvector-service
                - name: PGDATABASE
                  value: ai_vectors
```

---

*Last updated: 2026-04*
