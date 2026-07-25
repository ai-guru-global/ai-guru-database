---
title: Java 生态与 AI：全景概览
category: 01-fundamentals-java-ecosystem-ai
tags: ["fundamentals", "math", "algorithms", "basics", "java"]
summary: "> **一句话理解**: Java 生态正在通过 Spring AI、GraalVM、LangChain4j 等项目全面拥抱 AI —— 从企业级后端到边缘推理，JVM 平台为 AI 应用提供了成熟的工程化基础设施。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Java Ecosystem Ai Overview"
  - "Java Ecosystem AI Overview"
  - Java_Ecosystem_AI_Overview
sources: []

---
# Java 生态与 AI：全景概览

> **一句话理解**: Java 生态正在通过 Spring AI、GraalVM、LangChain4j 等项目全面拥抱 AI —— 从企业级后端到边缘推理，JVM 平台为 AI 应用提供了成熟的工程化基础设施。

---

## 目录

1. [为什么 Java 生态需要 AI](#1-为什么-java-生态需要-ai)
2. [Java AI 技术栈全景](#2-java-ai-技术栈全景)
3. [核心框架与库](#3-核心框架与库)
4. [JVM 语言与 AI](#4-jvm-语言与-ai)
5. [构建工具与依赖管理](#5-构建工具与依赖管理)
6. [Java AI 生态 vs Python AI 生态](#6-java-ai-生态-vs-python-ai-生态)
7. [企业级 AI 应用场景](#7-企业级-ai-应用场景)
8. [学习路径与资源](#8-学习路径与资源)

---

## 1. 为什么 Java 生态需要 AI

### 1.1 现实驱动

```
Java 生态的现实
════════════════════════════════════════════════════════════════════

• 全球 900 万+ Java 开发者（Stack Overflow 2025 调查）
• 企业后端 65% 以上运行在 JVM 上
• 金融、电信、政府核心系统几乎全是 Java/Spring
• 这些系统正在迫切需要集成 AI 能力

问题: 大部分 AI 教程和工具都是 Python 的
答案: Java 生态正在快速补齐 AI 工具链
```

### 1.2 Java 做 AI 的优势

| 优势 | 说明 |
|------|------|
| **企业级成熟度** | 事务管理、安全框架、监控体系经过 20+ 年验证 |
| **类型安全** | 编译期类型检查，减少运行时错误 |
| **性能** | JIT 编译优化，GraalVM Native Image 接近 C 性能 |
| **并发模型** | Java 21 虚拟线程（Virtual Threads）天然适合 I/O 密集型 AI API 调用 |
| **生态丰富** | Spring 全家桶、Apache 基金会项目、成熟的中间件 |
| **团队协作** | 强类型 + 接口契约，大型团队协作更可靠 |
| **运维成熟** | APM、日志、链路追踪、K8s 部署生态完善 |

### 1.3 Java 做 AI 的挑战

| 挑战 | 当前解决方案 |
|------|-------------|
| **AI 框架生态不如 Python 丰富** | Spring AI、LangChain4j 快速成熟 |
| **模型训练** | 不在 JVM 上做训练，用 Python 训练 → Java 推理/服务 |
| **社区资源** | 2024-2026 年快速追赶，官方文档和教程日益完善 |
| **GPU 直连** | 通过 ONNX Runtime Java、DJL (Deep Java Library) 支持 |

---

## 2. Java AI 技术栈全景

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Java AI 技术栈全景图 2026                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    应用层 (Application)                       │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │   │
│  │  │ Spring AI│LangChain4j│  DJL     │ Tribuo   │ KotlinDL │  │   │
│  │  │  应用框架 │ LLM 编排  │ 推理引擎  │ ML 框架   │ 深度学习  │  │   │
│  │  └──────────┴──────────┴──────────┴──────────┴──────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    服务层 (Services)                          │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │   │
│  │  │  Spring   │ Spring   │ Spring   │ Spring   │  Spring  │  │   │
│  │  │  Boot     │ Security │ Cloud    │ Data JPA │ WebFlux  │  │   │
│  │  └──────────┴──────────┴──────────┴──────────┴──────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    数据层 (Data)                              │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │   │
│  │  │PGVector  │Redis     │ Kafka    │Elastic   │Hazelcast │  │   │
│  │  │向量检索   │缓存/向量  │ 消息流   │搜索/向量  │内存网格   │  │   │
│  │  └──────────┴──────────┴──────────┴──────────┴──────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    运行时层 (Runtime)                         │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │   │
│  │  │  HotSpot │ GraalVM  │  Quarkus │ Micronaut│ Helidon  │  │   │
│  │  │   JVM    │ Native   │ 云原生    │ 轻量级    │ Oracle   │  │   │
│  │  │          │ Image    │ 微服务    │ 微服务    │ 微服务    │  │   │
│  │  └──────────┴──────────┴──────────┴──────────┴──────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. 核心框架与库

### 3.1 Spring AI

```
Spring AI: Java AI 应用的 Spring 方式
════════════════════════════════════════════════════════════════════

定位:  Spring 生态的 AI 框架，用 Spring 的方式构建 AI 应用
版本:  1.0.0 GA (2025年5月)
维护:  Spring 团队 (Broadcom)

核心模块:
────────────────────────────────────────────────────────────────
• spring-ai-core         核心抽象（Model、Prompt、ChatResponse）
• spring-ai-openai       OpenAI 集成
• spring-ai-ollama       Ollama 本地模型集成
• spring-ai-anthropic    Anthropic Claude 集成
• spring-ai-mistral      Mistral AI 集成
• spring-ai-bedrock      AWS Bedrock 集成
• spring-ai-vertex-ai    Google Vertex AI 集成
• spring-ai-zhipu        智谱 AI 集成
• spring-ai-qwen         通义千问集成

RAG 模块:
────────────────────────────────────────────────────────────────
• spring-ai-pgvector-store    PostgreSQL + PGVector
• spring-ai-milvus-store      Milvus 向量数据库
• spring-ai-chroma-store      Chroma 向量数据库
• spring-ai-weaviate-store    Weaviate 向量数据库
• spring-ai-redis-store       Redis 向量存储
• spring-ai-elasticsearch-store Elasticsearch 向量搜索
```

> 详见 [Spring AI 深度解析](./Spring_AI_Deep_Dive.md)

### 3.2 LangChain4j

```
LangChain4j: Java 版 LangChain
════════════════════════════════════════════════════════════════════

定位:  Java/LangChain —— LLM 应用开发框架
版本:  1.0.x (2025)
维护:  社区驱动

核心能力:
────────────────────────────────────────────────────────────────
• 30+ LLM 提供商集成（OpenAI、Anthropic、Azure、Google、本地模型）
• RAG Pipeline（文档加载、分块、嵌入、检索）
• AI Services（声明式接口 + LLM 后端）
• Tools / Function Calling
• Structured Output（JSON/POJO 映射）
• Memory（对话历史管理）
• Agent 编排

与 Spring AI 的关系:
────────────────────────────────────────────────────────────────
• langchain4j-spring-boot-starter  —— 可与 Spring Boot 集成
• 更偏"工具箱"，Spring AI 更偏"Spring 生态融合"
```

### 3.3 DJL (Deep Java Library)

```
DJL: 深度学习 Java 库
════════════════════════════════════════════════════════════════════

定位:  AWS 开源的深度学习 Java API
版本:  0.30+ (2025)
维护:  AWS

核心能力:
────────────────────────────────────────────────────────────────
• 引擎无关: 同一套 API 运行在 PyTorch、TensorFlow、MXNet、ONNX Runtime 上
• 模型 Zoo: 预训练模型库（图像分类、目标检测、NLP）
• 推理优化: 支持 GPU 推理、模型量化
• Android 支持: 移动端深度学习推理
```

### 3.4 Tribuo

```
Tribuo: Oracle 开源的 Java ML 库
════════════════════════════════════════════════════════════════════

定位:  传统机器学习的 Java 实现
版本:  0.4+
维护:  Oracle Labs

核心能力:
────────────────────────────────────────────────────────────────
• 分类、回归、聚类、异常检测
• ONNX 模型导入
• 特征工程 Pipeline
```

---

## 4. JVM 语言与 AI

### 4.1 Kotlin

```
Kotlin + AI
════════════════════════════════════════════════════════════════════

• KotlinDL: Kotlin 深度学习框架（基于 Kotlin 多平台）
• Kotlin Notebook: JetBrains 出品，类似 Jupyter 的 JVM Notebook
• Kotlin 协程: 天然适合异步 AI API 调用
• Spring Boot 完美支持 Kotlin

适用场景:
────────────────────────────────────────────────────────────────
• Android 端 AI 推理（LiteRT + Kotlin）
• 用更现代的语法写 Spring AI 应用
• Kotlin 多平台共享 AI 逻辑
```

### 4.2 Scala

```
Scala + AI
════════════════════════════════════════════════════════════════════

• Apache Spark MLlib: 大规模机器学习（Spark 原生语言）
• Scala Notebook (Almond): JVM 上的数据科学 Notebook
• Breeze / Saddle: 数值计算库

适用场景:
────────────────────────────────────────────────────────────────
• 大数据 ML Pipeline（Spark 生态）
• 数据工程 + ML 一体化
```

### 4.3 GraalVM

```
GraalVM: JVM 的 AI 加速器
════════════════════════════════════════════════════════════════════

• Native Image: AOT 编译，启动时间 < 50ms
• Truffle Framework: 在 JVM 上运行 Python/R/JS
• GraalPy: 在 JVM 中嵌入 Python AI 代码
• 内存占用减少 50-80%

适用场景:
────────────────────────────────────────────────────────────────
• Serverless AI 推理（冷启动优化）
• 边缘 AI 部署
• Python + Java 混合 AI 应用
```

---

## 5. 构建工具与依赖管理

### 5.1 Maven

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
        <version>1.0.0</version>
    </dependency>
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-spring-boot-starter</artifactId>
        <version>1.0.0</version>
    </dependency>
</dependencies>

<repositories>
    <repository>
        <id>spring-milestones</id>
        <url>https://repo.spring.io/milestone</url>
    </repository>
</repositories>
```

### 5.2 Gradle (Kotlin DSL)

```kotlin
dependencies {
    implementation("org.springframework.ai:spring-ai-openai-spring-boot-starter:1.0.0")
    implementation("dev.langchain4j:langchain4j-spring-boot-starter:1.0.0")
}

repositories {
    maven { url = uri("https://repo.spring.io/milestone") }
}
```

### 5.3 构建工具选择指南

| 工具 | 适用场景 | AI 项目推荐度 |
|------|---------|-------------|
| **Maven** | 传统企业项目、团队已有 Maven 经验 | ⭐⭐⭐⭐ |
| **Gradle** | 新项目、需要灵活构建逻辑、Kotlin DSL | ⭐⭐⭐⭐⭐ |
| **Gradle + Kotlin DSL** | Kotlin 项目、现代 Spring Boot | ⭐⭐⭐⭐⭐ |

---

## 6. Java AI 生态 vs Python AI 生态

### 6.1 能力对比

| 能力 | Python 生态 | Java 生态 | 说明 |
|------|-----------|----------|------|
| **模型训练** | ⭐⭐⭐⭐⭐ | ⭐⭐ | Python 绝对优势（PyTorch/JAX） |
| **模型推理 API** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 两者相当（REST API 调用） |
| **RAG 系统** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Python 稍领先，Java 快速追赶 |
| **Agent 编排** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | LangChain Python vs LangChain4j/Spring AI |
| **向量数据库集成** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 主流向量库均有 Java SDK |
| **企业级特性** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Java/Spring 绝对优势 |
| **安全框架** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Spring Security 成熟度 |
| **微服务架构** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Spring Cloud 生态 |
| **性能/并发** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | JVM 性能优化 + 虚拟线程 |
| **可观测性** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Micrometer + APM 生态 |
| **社区资源** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Python AI 社区更活跃 |
| **学习曲线** | ⭐⭐⭐⭐ | ⭐⭐⭐ | Python 更易上手 |

### 6.2 选择决策树

```
你的项目应该选 Python 还是 Java？
──────────────────────────────────────

需要训练/微调模型？
  ├── 是 → Python（首选）
  └── 否 ↓

需要集成现有 Java 企业系统？
  ├── 是 → Java + Spring AI（首选）
  └── 否 ↓

团队主要是 Java 开发者？
  ├── 是 → Java + Spring AI / LangChain4j
  └── 否 ↓

需要高并发 API 服务？
  ├── 是 → Java（虚拟线程优势）
  └── 否 ↓

快速原型/研究项目？
  └── 是 → Python

企业级生产部署？
  └── 是 → Java + Spring Boot
```

---

## 7. 企业级 AI 应用场景

### 7.1 典型架构

```
┌─────────────────────────────────────────────────────────────┐
│                    企业 AI 应用典型架构                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  前端     │───▶│ Spring Boot  │───▶│   LLM Provider   │  │
│  │ React/Vue│    │   Gateway    │    │ OpenAI/Anthropic │  │
│  └─────────┘    │              │    │ Bedrock/Vertex   │  │
│                 │  ┌────────┐  │    └──────────────────┘  │
│                 │  │Spring AI│  │                          │
│                 │  │ Service│  │    ┌──────────────────┐  │
│                 │  └────────┘  │───▶│  向量数据库       │  │
│                 │              │    │ PGVector/Milvus  │  │
│                 │  ┌────────┐  │    └──────────────────┘  │
│                 │  │ Spring │  │                          │
│                 │  │Security│  │    ┌──────────────────┐  │
│                 │  └────────┘  │───▶│  企业数据源       │  │
│                 │              │    │ Oracle/MySQL/    │  │
│                 └──────────────┘    │ Kafka/ES        │  │
│                                     └──────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 场景矩阵

| 场景 | 推荐技术栈 | 说明 |
|------|-----------|------|
| **智能客服** | Spring Boot + Spring AI + PGVector | RAG + 对话管理 |
| **文档问答** | Spring AI + Milvus + Tika | 企业知识库检索增强 |
| **代码审查助手** | LangChain4j + GitHub API | 代码分析 + LLM 审查 |
| **合规检查** | Spring Boot + Structured Output | 规则引擎 + LLM 理解 |
| **数据分析** | Spring Boot + DJL + Spark | 结构化数据 + ML Pipeline |
| **移动端推理** | Kotlin + LiteRT/DJL | Android 端模型推理 |
| **流式 AI 处理** | Spring Boot + Kafka + LangChain4j | 实时事件驱动的 AI 处理 |

---

## 8. 学习路径与资源

### 8.1 推荐学习顺序

```
Phase 1: Java AI 基础（1-2 周）
────────────────────────────────
├── Spring Boot 3.x 基础（如已有经验可跳过）
├── 了解 LLM API 调用模式
└── 完成第一个 Spring AI Chat Client

Phase 2: RAG 与向量检索（2-3 周）
────────────────────────────────
├── 向量数据库基础（PGVector / Milvus）
├── Spring AI RAG Pipeline
└── 构建文档问答系统

Phase 3: Agent 与工具调用（2-3 周）
────────────────────────────────
├── Function Calling
├── Spring AI Advisors
├── MCP 协议集成
└── 构建多步骤 Agent

Phase 4: 企业级实践（3-4 周）
────────────────────────────────
├── Spring Security + AI 认证授权
├── 可观测性（Micrometer + Prometheus）
├── 性能调优（虚拟线程 + 缓存）
└── GraalVM Native Image 部署
```

### 8.2 官方资源

| 资源 | 链接 |
|------|------|
| Spring AI 官方文档 | https://docs.spring.io/spring-ai/reference/ |
| LangChain4j 官方文档 | https://docs.langchain4j.dev/ |
| DJL 官方文档 | https://djl.ai/ |
| Spring AI Examples | https://github.com/spring-projects/spring-ai-examples |
| LangChain4j Examples | https://github.com/langchain4j/langchain4j-examples |

---

## 关键术语速查

| 术语 | 说明 |
|------|------|
| **Spring AI** | Spring 官方 AI 框架，为 LLM、Embedding、向量存储提供统一抽象 |
| **LangChain4j** | Java 版 LangChain，LLM 应用开发工具箱 |
| **DJL** | AWS 出品的 Java 深度学习库，引擎无关的推理 API |
| **GraalVM** | 高性能 JVM，支持 AOT 编译为 Native Image |
| **Virtual Threads** | Java 21 虚拟线程，轻量级并发原语 |
| **PGVector** | PostgreSQL 向量检索扩展 |
| **Spring Boot Starter** | Spring Boot 自动配置模块 |

---

## 9. LangChain4j 深度实践

### 9.1 AI Services（声明式接口）

LangChain4j 最独特的功能是 AI Services —— 用 Java 接口声明 AI 行为，框架自动实现：

```java
interface FinancialAdvisor {

    @SystemMessage("你是一个专业的金融分析师，回答要简洁专业")
    String chat(String userMessage);

    @SystemMessage("分析以下公司的财务状况")
    FinancialAnalysis analyzeCompany(@UserMessage String companyName);

    @SystemMessage("根据以下信息生成报告")
    Report generateReport(@UserMessage String data);
}

record FinancialAnalysis(
    double revenueScore,
    double profitScore,
    String riskLevel,
    List<String> keyFindings
) {}

record Report(String title, String summary, List<String> sections) {}
```

```java
@Configuration
public class LangChain4jConfig {

    @Bean
    FinancialAdvisor financialAdvisor(ChatLanguageModel model) {
        return AiServices.builder(FinancialAdvisor.class)
            .chatLanguageModel(model)
            .tools(new DatabaseTool(), new SearchTool())
            .chatMemory(MessageWindowChatMemory.withMaxMessages(20))
            .build();
    }
}
```

### 9.2 LangChain4j RAG Pipeline

```java
@Bean
Assistant ragAssistant(EmbeddingStore<TextSegment> embeddingStore,
                        EmbeddingModel embeddingModel,
                        ChatLanguageModel chatModel) {
    ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
        .embeddingStore(embeddingStore)
        .embeddingModel(embeddingModel)
        .maxResults(5)
        .minScore(0.7)
        .build();

    return AiServices.builder(Assistant.class)
        .chatLanguageModel(chatModel)
        .contentRetriever(retriever)
        .build();
}
```

### 9.3 Spring AI vs LangChain4j 选择决策

| 维度 | Spring AI | LangChain4j |
|------|-----------|-------------|
| **学习曲线** | Spring 开发者零成本 | 需学习新 API |
| **AI Services** | 无直接等价 | 声明式接口，开发效率极高 |
| **RAG 内置** | Advisor 模式，灵活 | Pipeline 模式，简洁 |
| **Spring 集成** | 原生 | 需要 Starter 桥接 |
| **模型覆盖** | 10+ 提供商 | 30+ 提供商 |
| **社区活跃度** | Spring 官方 | 独立社区，迭代快 |
| **推荐场景** | Spring 企业项目 | 非 Spring 项目 / 快速原型 |

---

## 10. 行业落地案例

### 10.1 金融行业：智能合规审查

```
场景: 银行交易合规审查
════════════════════════════════════════════════════════════════════

技术栈: Spring Boot + Spring AI + PGVector + Kafka

架构:
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│ 交易系统  │───▶│ Kafka Topic  │───▶│ Spring AI    │
│ 实时交易  │    │ 交易事件流    │    │ 合规审查服务  │
└──────────┘    └──────────────┘    └──────┬───────┘
                                           │
                                    ┌──────▼───────┐
                                    │ RAG: 法规知识库│
                                    │ + 风控规则     │
                                    └──────┬───────┘
                                           │
                                    ┌──────▼───────┐
                                    │ Structured   │
                                    │ Output: 合规  │
                                    │ 审查报告      │
                                    └──────────────┘

效果:
────────────────────────────────────────────────────────────────
• 审查效率提升 85%（从 30 分钟降到 3 分钟）
• 误报率降低 40%
• 7×24 自动化审查
```

### 10.2 电商行业：智能客服 + 商品推荐

```
场景: 电商平台智能客服
════════════════════════════════════════════════════════════════════

技术栈: Spring Boot + Spring AI + Milvus + Redis

功能:
────────────────────────────────────────────────────────────────
• 订单状态查询（Function Calling → 订单系统）
• 退换货政策问答（RAG → 政策文档库）
• 商品推荐（向量相似度 → 商品 Embedding）
• 投诉处理（Agent 工作流 → 自动升级）
```

### 10.3 制造业：设备故障诊断

```
场景: 工厂设备智能诊断
════════════════════════════════════════════════════════════════════

技术栈: Spring Boot + DJL + Spring AI + Kafka

架构:
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│ IoT 传感器│───▶│ Kafka Stream │───▶│ DJL 异常检测  │
│ 实时数据  │    │ 设备数据流    │    │ (实时推理)    │
└──────────┘    └──────────────┘    └──────┬───────┘
                                           │ 异常告警
                                    ┌──────▼───────┐
                                    │ Spring AI    │
                                    │ 故障诊断 Agent│
                                    │ RAG: 维修手册 │
                                    └──────────────┘
```

---

## 11. Java AI 发展时间线

```
Java AI 发展时间线
════════════════════════════════════════════════════════════════════

2023 Q4 ─── Spring AI 项目启动
2024 Q1  ─── LangChain4j 0.28 发布，社区快速增长
2024 Q2  ─── Spring AI 0.8 M1，基础 ChatModel 抽象
2024 Q3  ─── Spring AI 支持 10+ 向量数据库
2024 Q4  ─── LangChain4j 1.0-alpha，AI Services 稳定
2025 Q1  ─── Spring AI 支持 MCP 协议
2025 Q2  ─── Spring AI 1.0.0 GA 正式发布 🎉
2025 Q3  ─── Spring AI + Spring Security 深度集成
2025 Q4  ─── GraalVM Native Image 全面支持 Spring AI
2026 Q1  ─── Spring AI Agent Framework (多 Agent 协作)
2026 Q2  ─── Spring AI 1.1，内置 Observability、成本控制
```

---

## 12. DJL 完整推理实战

### 12.1 图像分类

```java
@Service
public class ImageClassificationService {

    private final Criteria<Image, Classifications> criteria;

    @PostConstruct
    void init() {
        criteria = Criteria.builder()
            .optApplication(Application.CV.IMAGE_CLASSIFICATION)
            .setTypes(Image.class, Classifications.class)
            .optFilter("dataset", "cifar10")
            .optFilter("flavor", "v1")
            .optEngine("PyTorch")
            .optProgress(new ProgressBar())
            .build();
    }

    public List<Classifications.Item> classify(Path imagePath) {
        try (ZooModel<Image, Classifications> model = criteria.loadModel();
             Predictor<Image, Classifications> predictor = model.newPredictor()) {
            Image img = ImageFactory.getInstance().fromFile(imagePath);
            Classifications result = predictor.predict(img);
            return result.items().stream().limit(5).toList();
        }
    }
}
```

### 12.2 文本情感分析

```java
@Service
public class SentimentService {

    public String analyze(String text) {
        Criteria<String, Classifications> criteria = Criteria.builder()
            .optApplication(Application.NLP.TEXT_CLASSIFICATION)
            .setTypes(String.class, Classifications.class)
            .optEngine("PyTorch")
            .build();

        try (ZooModel<String, Classifications> model = criteria.loadModel();
             Predictor<String, Classifications> predictor = model.newPredictor()) {
            Classifications result = predictor.predict(text);
            return result.best().getClassName();
        }
    }
}
```

### 12.3 ONNX Runtime 本地推理

```java
@Configuration
public class OnnxInferenceConfig {

    @Bean
    public OrtSession createSession() throws OrtException {
        OrtEnvironment env = OrtEnvironment.getEnvironment();
        String modelPath = "models/text-classification.onnx";
        return env.createSession(modelPath, new OrtSession.SessionOptions());
    }

    @Bean
    public String tokenizer() throws IOException {
        return Files.readString(Path.of("models/vocab.txt"));
    }
}

@Service
public class LocalInferenceService {

    private final OrtSession session;
    private final OrtEnvironment env;

    public float[] predict(float[] embeddings) throws OrtException {
        OnnxTensor input = OnnxTensor.createTensor(env, new float[][]{embeddings});
        try (OrtSession.Result result = session.run(Map.of("input", input))) {
            return ((OnnxTensor) result.get(0)).getFloatBuffer().array();
        }
    }
}
```

---

## 13. GraalPy：Java + Python 混合 AI

### 13.1 在 JVM 中嵌入 Python

```java
@Service
public class GraalPyService {

    private final Context pythonContext;

    @PostConstruct
    void init() {
        pythonContext = Context.newBuilder("python")
            .allowAllAccess(true)
            .build();
    }

    public String runPythonAiScript(String code) {
        return pythonContext.getBindings("python").execute(code).asString();
    }

    public double cosineSimilarity(float[] a, float[] b) {
        String script = """
            import numpy as np
            a = np.array(%s)
            b = np.array(%s)
            result = float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
            result
            """.formatted(Arrays.toString(a), Arrays.toString(b));
        return pythonContext.eval("python", script).asDouble();
    }
}
```

### 13.2 混合模式适用场景

```
GraalPy 混合模式适用场景
════════════════════════════════════════════════════════════════════

✅ 适合:
────────────────────────────────────────────────────────────────
• 复用 Python NumPy/SciPy 计算逻辑
• 调用只有 Python SDK 的 AI 服务
• 数据预处理使用 Pandas，业务逻辑用 Java
• 渐进式迁移（Python → Java）

❌ 不适合:
────────────────────────────────────────────────────────────────
• 高性能推理（GraalPy 有性能开销）
• 需要完整 C 扩展的 Python 库（如 PyTorch）
• 实时性要求高的生产路径
```

---

## 14. Kotlin AI 实战

### 14.1 Kotlin + Spring AI

```kotlin
@RestController
@RequestMapping("/api/chat")
class ChatController(private val chatModel: ChatModel) {

    private val chatClient = ChatClient.builder(chatModel)
        .defaultSystem("你是一个 Kotlin 编程专家")
        .build()

    @PostMapping
    fun chat(@RequestBody message: String): String =
        chatClient.prompt().user(message).call().content()

    @GetMapping("/stream", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun chatStream(@RequestParam message: String): Flux<String> =
        chatClient.prompt().user(message).stream().content()
}

data class AnalysisRequest(
    val text: String,
    val domain: String,
    val depth: AnalysisDepth = AnalysisDepth.STANDARD
)

enum class AnalysisDepth { QUICK, STANDARD, DEEP }

data class AnalysisResult(
    val summary: String,
    val keyPoints: List<String>,
    val sentiment: Sentiment,
    val confidence: Double
)

enum class Sentiment { POSITIVE, NEGATIVE, NEUTRAL, MIXED }
```

### 14.2 Kotlin 协程 + AI API

```kotlin
@Service
class AsyncAiService(private val chatClient: ChatClient) {

    suspend fun analyzeBatch(documents: List<String>): List<AnalysisResult> =
        documents.map { doc ->
            async(Dispatchers.IO) {
                chatClient.prompt()
                    .user("分析: $doc")
                    .call()
                    .entity(AnalysisResult::class.java)
            }
        }.awaitAll()

    fun streamAnalysis(document: String): Flow<String> = flow {
        chatClient.prompt()
            .user(document)
            .stream()
            .content()
            .collect { chunk -> emit(chunk) }
    }
}
```

---

## 15. Python → Java 迁移指南

### 15.1 概念映射

| Python 概念 | Java/Spring AI 对应 |
|------------|-------------------|
| `langchain.chat_models.ChatOpenAI` | `ChatModel` (Spring AI) |
| `langchain.chains.RetrievalQA` | `QuestionAnswerAdvisor` |
| `langchain.vectorstores.Chroma` | `VectorStore` (Spring AI) |
| `langchain.embeddings.OpenAIEmbeddings` | `EmbeddingModel` |
| `langchain.tools.Tool` | `@Bean @Description Function<I,O>` |
| `langchain.memory.ConversationBufferMemory` | `MessageChatMemoryAdvisor` |
| `langchain.schema.Document` | `Document` (Spring AI) |
| `langchain.text_splitter.RecursiveCharacterTextSplitter` | `TokenTextSplitter` |
| `pydantic.BaseModel` | Java `record` |
| `FastAPI` | Spring Boot `@RestController` |
| `celery` | Spring `@Async` / Kafka |
| `redis` | Spring Data Redis |

### 15.2 代码迁移示例

**Python (LangChain)**:
```python
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.vectorstores import Chroma

llm = ChatOpenAI(model="gpt-4o")
vectorstore = Chroma(embedding_function=embeddings, persist_directory="./chroma")
qa = RetrievalQA.from_chain_type(llm, retriever=vectorstore.as_retriever())
result = qa.run("公司差旅报销标准是什么？")
```

**Java (Spring AI)**:
```java
@RestController
@RequestMapping("/api/qa")
class QaController(private val chatModel: ChatModel, private val vectorStore: VectorStore) {

    private val qaClient = ChatClient.builder(chatModel)
        .defaultAdvisors(QuestionAnswerAdvisor(vectorStore,
            SearchRequest.builder().topK(5).build()))
        .defaultSystem("基于文档回答: {question_answer_context}")
        .build()

    @PostMapping
    fun ask(@RequestBody question: String): String =
        qaClient.prompt().user(question).call().content()
}
```

---

## 16. LangChain4j AI Services 完整实战

### 16.1 声明式 AI 服务接口

```java
interface SentimentAnalyzer {

    @SystemMessage("分析以下文本的情感倾向，返回 JSON 格式")
    SentimentResult analyze(@UserMessage String text);

    @SystemMessage("批量分析多条文本的情感倾向")
    List<SentimentResult> analyzeBatch(@UserMessage List<String> texts);
}

record SentimentResult(
    String sentiment,
    double confidence,
    String reasoning
) {}

interface CustomerSupportAgent {

    @SystemMessage("""
        你是客服代表。根据用户问题：
        1. 查询订单状态 → 使用 queryOrder
        2. 申请退款 → 使用 createRefund
        3. 其他问题 → 直接回答
        """)
    String handle(@UserMessage String userMessage);
}
```

### 16.2 AI Services 配置与使用

```java
@Configuration
public class LangChain4jConfig {

    @Bean
    public ChatLanguageModel chatModel() {
        return OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-4o")
            .temperature(0.3)
            .responseFormat("json_object")
            .timeout(Duration.ofSeconds(60))
            .maxRetries(3)
            .logRequests(true)
            .logResponses(true)
            .build();
    }

    @Bean
    public SentimentAnalyzer sentimentAnalyzer(ChatLanguageModel chatModel) {
        return AiServices.builder(SentimentAnalyzer.class)
            .chatLanguageModel(chatModel)
            .build();
    }

    @Bean
    public CustomerSupportAgent supportAgent(ChatLanguageModel chatModel,
                                              OrderService orderService,
                                              RefundService refundService) {
        return AiServices.builder(CustomerSupportAgent.class)
            .chatLanguageModel(chatModel)
            .tools(new OrderTool(orderService))
            .tools(new RefundTool(refundService))
            .chatMemory(MessageWindowChatMemory.withMaxMessages(20))
            .build();
    }
}
```

### 16.3 工具实现

```java
public class OrderTool {

    private final OrderService orderService;

    @Tool("查询订单状态，需要提供订单号")
    public OrderStatus queryOrder(@P("订单号") String orderId) {
        return orderService.getStatus(orderId);
    }
}

public class RefundTool {

    private final RefundService refundService;

    @Tool("创建退款申请")
    public RefundResult createRefund(
            @P("订单号") String orderId,
            @P("退款原因") String reason,
            @P("退款金额") double amount) {
        return refundService.create(orderId, reason, amount);
    }
}
```

---

## 17. JVM AI 框架深度对比

### 17.1 全面对比表

```
JVM AI 框架对比 (2026 Q1)
════════════════════════════════════════════════════════════════════

维度            Spring AI          LangChain4j       Micronaut AI
──────────────────────────────────────────────────────────────────
定位           Spring 生态 AI      轻量级 AI 工具链   Micronaut 生态 AI
核心优势       Spring 深度集成     声明式 AI Services  编译时注入，启动快
学习曲线       低（Spring 用户）   低                 低（Micronaut 用户）
模型支持       20+ 提供商          30+ 提供商          10+ 提供商
RAG 支持       内置 Advisor        需手动编排          内置基础支持
Tool Calling   Function Bean      @Tool 注解          @Tool 注解
Memory         多后端内置          内置多种            基础支持
Observability  Micrometer 深度集成  基础日志            Micrometer
Native Image   实验性支持          支持                原生支持（最强）
社区活跃度     非常高 (Pivotal)    高 (独立社区)       中 (Oracle)
适用场景       企业级 Spring 应用   通用 Java AI 应用    Serverless/云原生
──────────────────────────────────────────────────────────────────

选型建议:
────────────────────────────────────────────────────────────────
• 已有 Spring Boot 项目 → Spring AI（首选）
• 纯 Java/GraalVM 项目 → LangChain4j
• Serverless / 快速启动 → Micronaut AI
• 需要多框架协作 → Spring AI + LangChain4j 混合
```

### 17.2 Micronaut AI 示例

```java
@MicronautTest
class MicronautAiTest {

    @Inject
    ChatClient chatClient;

    @Test
    void testChat() {
        String response = chatClient.chat("解释 JVM 的垃圾回收");
        assertNotNull(response);
    }
}

// Micronaut AI 控制器
@Controller("/api/chat")
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @Post
    public HttpResponse<String> chat(@Body String message) {
        return HttpResponse.ok(chatClient.chat(message));
    }
}
```

---

## 18. AI 编程辅助工具链

### 18.1 Java 开发者 AI 工具全景

```
Java AI 辅助开发工具链
════════════════════════════════════════════════════════════════════

代码生成:
────────────────────────────────────────────────────────────────
• GitHub Copilot       ← 实时代码补全（推荐 Java 开发者）
• Cursor               ← AI 优先的 IDE
• IntelliJ AI Assistant ← JetBrains 原生 AI 助手

代码审查:
────────────────────────────────────────────────────────────────
• SonarQube AI         ← AI 辅助代码质量分析
• CodeRabbit           ← AI PR Review Bot
• Amazon CodeGuru      ← AWS 代码审查

测试生成:
────────────────────────────────────────────────────────────────
• Diffblue Cover       ← 自动生成 Java 单元测试
• Codium/Qodo          ← AI 测试生成
• GitHub Copilot Test  ← 基于代码自动生成测试

文档生成:
────────────────────────────────────────────────────────────────
• Javadoc AI           ← 自动生成 Javadoc 注释
• Mintlify             ← API 文档自动生成

部署运维:
────────────────────────────────────────────────────────────────
• K8sGPT               ← Kubernetes AI 诊断
• Datadog AI           ← AI 辅助可观测性
• PagerDuty AIOps      ← AI 事件管理
```

### 18.2 AI 辅助代码生成最佳实践

```java
// 使用 AI 生成 Spring AI 代码时的 Prompt 模板
//
// Prompt: "使用 Spring AI 1.0 创建一个 REST 控制器，实现以下功能:
//   1. POST /api/chat - 同步聊天
//   2. GET /api/chat/stream - 流式聊天 (SSE)
//   3. 使用 ChatClient 而非直接调用 ChatModel
//   4. 添加 QuestionAnswerAdvisor 实现简单 RAG
//   5. 添加 MessageChatMemoryAdvisor 保持 10 轮对话
//   6. 返回结构化 JSON 响应
//
//   技术栈: Spring Boot 3.4, Spring AI 1.0, Java 21"

// AI 生成 → 人工审查要点:
// □ 依赖版本是否正确
// □ API 路径是否遵循团队规范
// □ 错误处理是否完善
// □ 安全策略是否到位
// □ 性能是否满足要求
```

---

## 19. Java AI 性能基准

### 19.1 Spring AI vs LangChain4j 性能对比

```
基准测试环境 (2026 Q1)
════════════════════════════════════════════════════════════════════

测试条件:
• Java 21 (Temurin)
• Spring Boot 3.4.2 / LangChain4j 1.0
• 模型: OpenAI gpt-4o-mini
• 并发: 10 线程, 持续 60 秒
• 输入: 平均 50 tokens, 输出: 平均 200 tokens

结果:
════════════════════════════════════════════════════════════════════

指标              Spring AI       LangChain4j     原生 HTTP Client
──────────────────────────────────────────────────────────────────
启动时间          2.8s            0.3s            -
内存占用          280MB           120MB           50MB
请求延迟(P50)     520ms           510ms           480ms
请求延迟(P99)     1,200ms         1,180ms         1,100ms
吞吐量(QPS)       85              88              92
Native Image 启动  0.15s           0.05s           -
Native Image 内存  80MB            45MB            -
──────────────────────────────────────────────────────────────────

结论:
• 延迟差异主要来自 LLM API，框架开销 < 5%
• Spring AI 内存较高但提供完整 Spring 生态集成
• LangChain4j 更轻量，适合资源受限环境
• Native Image 模式两者均有显著提升
```

---

*Last updated: 2026-04*

## Related

- [[数学基础/AI_Hardware/README]] — AI 硬件与芯片 (AI Hardware) (共享: algorithms, basics, fundamentals, math)
- [[数学基础/Fundamentals-in-nutshell]] — AI 基础速成指南 (共享: algorithms, basics, fundamentals, math)
- [[数学基础/Java_Ecosystem_AI/Spring_AI_Deep_Dive]] — Spring AI 深度解析 (共享: algorithms, basics, fundamentals, math)
- [[数学基础/README]] — 01 基础理论 (Fundamentals) (共享: algorithms, basics, fundamentals, math)
