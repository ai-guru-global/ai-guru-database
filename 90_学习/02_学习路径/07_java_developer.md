---
title: Java 开发者 AI 路径
category: 90-learn-pathways
tags: ["learning", "education", "courses", "study-path", "java"]
summary: "> **面向：有 Java/Spring 经验、想转型或扩展到 AI 应用开发的后端工程师 | 前置要求：Java 17+、Spring Boot 基础 | 预计时间：50-70 小时**"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Java Developer"
  - "java developer"
sources: []

name_zh: "Java 开发者 AI 路径"
---
# Java 开发者 AI 路径

> 中文简称：Java 开发者 AI 路径

> **面向：有 Java/Spring 经验、想转型或扩展到 AI 应用开发的后端工程师 | 前置要求：Java 17+、Spring Boot 基础 | 预计时间：50-70 小时**

从你熟悉的 Java/Spring 生态出发，掌握用 Spring AI 构建企业级 AI 应用的完整技能栈。学完后你能将 AI 能力无缝集成到现有 Java 企业系统中。

---

## 路径概况

| 属性 | 值 |
|------|---|
| 目标人群 | Java/Spring 后端开发者，想在企业系统中集成 AI |
| 前置要求 | Java 17+ 基础、Spring Boot 开发经验 |
| 预计时间 | 50-70 小时（每天 2-3 小时，约 4-5 周） |
| 核心产出 | 构建生产级 Spring AI 应用：RAG 知识库、Agent 工作流、安全网关 |
| 适合你如果…… | 想在现有 Java 项目中集成 AI，目标岗位是 AI 应用工程师 / Java AI 工程师 |

---

## 完整路线图

```
Phase 1 AI 基础概念（快速了解）
    ↓
Phase 2 Spring AI 核心能力（Chat + Function Calling）
    ↓
Phase 3 RAG 与向量检索（企业知识库）
    ↓
Phase 4 Agent 与工具编排（多步骤 Agent）
    ↓
Phase 5 企业级实践（安全 + 部署 + 多云）
    ↓
完成：Java 企业级 AI 应用全栈开发能力
```

---

## 学习阶段

### Phase 1: AI 基础概念（第 1 周，快速浏览）

**🎯 目标**：理解 AI/LLM 核心概念，了解 Java 生态的 AI 布局。

**📚 核心阅读**：
- [Stage 1: 基础概念](90_学习/01_概念认知/03_stage1_foundation.md)（快速浏览）
- [Java 生态 AI 全景概览](01_数学基础/11_Java生态与AI/02_Java生态与AI_概览.md)（重点）

**🔗 深入阅读**：
- [LLM 架构（小白版）](05_大模型/README.md)
- [RAG 系统入门](14_RAG系统/README.md)
- [AI 系统架构全景图](12_架构基建/02_架构概览/03_AI_系统_架构_2026.md)

**💡 重点理解**：
- LLM 的工作原理：Token、上下文窗口、Temperature
- Python AI 生态 vs Java AI 生态的分工
- Java 做 AI 的定位：不做训练，做推理/服务/编排
- Spring AI、LangChain4j、DJL 的分工

**✅ 学会标志**：
- [ ] 能解释 Token、Embedding、RAG 的基本概念
- [ ] 了解 Java AI 技术栈的核心框架
- [ ] 能判断什么场景用 Java、什么场景用 Python

---

### Phase 2: Spring AI 核心能力（第 2 周）

**🎯 目标**：掌握 Spring AI 的 ChatClient、Prompt 模板、Function Calling、Structured Output。

**📚 核心阅读**：
- [Spring AI 深度解析](01_数学基础/11_Java生态与AI/03_Spring_AI_深入分析.md)（重点精读）

**🔧 实践任务**：

| 任务 | 说明 |
|------|------|
| Task 1 | 搭建 Spring Boot + Spring AI 项目，完成第一个 Chat API |
| Task 2 | 实现 Prompt Template + 系统消息 + 多轮对话 |
| Task 3 | 实现 Function Calling（天气查询工具） |
| Task 4 | 实现 Structured Output（JSON → Java Record） |
| Task 5 | 实现 Advisor 链（日志 + 限流） |

**🔗 参考文档**：
- [Spring AI 架构设计](12_架构基建/02_架构概览/Spring_AI_Architecture)

**💻 代码示例**：

```java
// Task 1: 第一个 Chat API
@RestController
public class ChatController {
    private final ChatClient chatClient;

    public ChatController(ChatModel chatModel) {
        this.chatClient = ChatClient.builder(chatModel)
            .defaultSystem("你是一个专业的Java开发助手")
            .build();
    }

    @PostMapping("/chat")
    public String chat(@RequestBody String message) {
        return chatClient.prompt().user(message).call().content();
    }
}
```

**✅ 学会标志**：
- [ ] 能用 ChatClient 完成同步和流式对话
- [ ] 能定义 Function Calling 工具并让 LLM 自动调用
- [ ] 能将 LLM 输出映射为 Java Record
- [ ] 能编写自定义 Advisor

---

### Phase 3: RAG 与向量检索（第 3 周）

**🎯 目标**：掌握用 Spring AI 构建 RAG 系统 —— 文档加载、分块、向量存储、检索增强。

**📚 核心阅读**：
- [Spring AI RAG 深度解析](14_RAG系统/06_RAG框架/07_Spring_AI_RAG_深入分析.md)（重点精读）
- [RAG 高级专题](14_RAG系统/04_高级RAG/12_RAG_高级_2026.md)（选读）

**🔧 实践任务**：

| 任务 | 说明 |
|------|------|
| Task 1 | 配置 PGVector 向量存储，完成文档索引 |
| Task 2 | 实现 ETL Pipeline（PDF → 分块 → 向量化） |
| Task 3 | 使用 QuestionAnswerAdvisor 构建简单 RAG |
| Task 4 | 使用 RetrievalAugmentationAdvisor 构建高级 RAG |
| Task 5 | 实现文档上传 API + 异步索引 |
| Task 6 | 构建完整的企业知识库问答系统 |

**🔗 参考文档**：
- [Milvus 深度解析](14_RAG系统/03_向量数据库/03_Milvus_深入分析.md)
- [Spring AI 网关与安全](12_架构基建/11_AI网关/13_Spring_AI网关_安全.md)

**✅ 学会标志**：
- [ ] 能配置 PGVector/Milvus 向量存储
- [ ] 能实现完整的 ETL 文档处理 Pipeline
- [ ] 能区分 QuestionAnswerAdvisor 和 RetrievalAugmentationAdvisor
- [ ] 能实现混合检索（向量 + 全文）

---

### Phase 4: Agent 与工具编排（第 4 周）

**🎯 目标**：掌握 Agent 编排、MCP 协议、多步骤工作流。

**📚 核心阅读**：
- [Spring AI 深度解析 - MCP 部分](01_数学基础/11_Java生态与AI/03_Spring_AI_深入分析.md#9-mcp-协议集成)
- [Agent Skills 深度解析](15_智能体/05_Agent技能/02_Agent_技能_深入分析.md)

**🔧 实践任务**：

| 任务 | 说明 |
|------|------|
| Task 1 | 实现多工具 Agent（数据库查询 + 搜索 + 计算） |
| Task 2 | 集成 MCP Server（文件系统 + 数据库） |
| Task 3 | 实现 ReAct 风格的多步骤 Agent |
| Task 4 | 实现查询路由 + 多知识库 RAG |

**✅ 学会标志**：
- [ ] 能定义多个 Function Calling 工具并编排
- [ ] 能集成 MCP Server 扩展 Agent 能力
- [ ] 能实现多跳检索和查询路由

---

### Phase 5: 企业级实践（第 5 周）

**🎯 目标**：掌握安全、部署、多云、测试等生产就绪技能。

**📚 核心阅读**：
- [Spring AI 网关与安全](12_架构基建/11_AI网关/13_Spring_AI网关_安全.md)（重点）
- [JVM AI 部署与推理](10_部署推理/02_推理引擎/10_JVM_AI_部署.md)（重点）
- [Java AI 测试实践](09_测试/02_测试框架/03_Java_AI测试.md)（重点）
- [Java Cloud SDK 指南](11_模型运维/14_云运维Agent/04_Java_云_SDK_指南.md)（选读）

**🔧 实践任务**：

| 任务 | 说明 |
|------|------|
| Task 1 | 配置 Spring Security + AI 端点保护 |
| Task 2 | 实现 Prompt 注入防御 Advisor |
| Task 3 | 配置限流 + 熔断 + Fallback |
| Task 4 | Docker 容器化 + K8s 部署 |
| Task 5 | 编写 RAG 集成测试（TestContainers） |
| Task 6 | 配置多云 AI 路由（OpenAI + 本地模型 Fallback） |

**✅ 学会标志**：
- [ ] 能实现完整的 AI 安全防护链
- [ ] 能用 Docker/K8s 部署 Spring AI 应用
- [ ] 能编写 AI 应用的单元测试和集成测试
- [ ] 能配置多模型 Fallback 和成本控制

---

## 能力对照表

学完本路径后，你将具备以下能力：

| 能力 | 对应岗位要求 |
|------|-------------|
| Spring AI ChatClient 开发 | AI 应用工程师 ✅ |
| RAG 系统设计与实现 | LLM 应用工程师 ✅ |
| Agent 工具编排 | AI Agent 工程师 ✅ |
| AI 安全与合规 | 企业级 AI 开发 ✅ |
| JVM AI 部署与优化 | AI 后端工程师 ✅ |
| 多云 AI 集成 | AI 基础设施工程师 ✅ |
| AI 应用测试 | 质量保障 ✅ |

---

## 推荐资源

### 官方文档

| 资源 | 链接 |
|------|------|
| Spring AI 官方文档 | https://docs.spring.io/spring-ai/reference/ |
| Spring AI GitHub | https://github.com/spring-projects/spring-ai |
| Spring AI Examples | https://github.com/spring-projects/spring-ai-examples |
| LangChain4j 文档 | https://docs.langchain4j.dev/ |
| DJL 文档 | https://djl.ai/ |

### 开源项目参考

| 项目 | 说明 |
|------|------|
| Spring AI Examples | 官方示例集 |
| LangChain4j Examples | LangChain4j 示例 |
| Spring AI + RAG Demo | 社区 RAG 示例 |
| AI Dashboard | Spring AI 管理面板 |

---

## 与其他路径的关系

```
                        ┌──────────────────┐
                        │  绝对新手路径      │
                        │ (AI 概念入门)     │
                        └────────┬─────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
            ┌───────▼──┐ ┌──────▼─────┐ ┌────▼────────┐
            │ML 研究者  │ │ LLM 工程师 │ │Java 开发者   │ ← 你在这里
            │ 路径      │ │  路径      │ │ AI 路径      │
            └──────────┘ └────────────┘ └─────────────┘
                                     │
                              ┌──────▼──────┐
                              │  产品经理    │
                              │  路径        │
                              └─────────────┘
```

本路径专注于 **Java/Spring 生态的 AI 应用开发**。如果你想更深入了解 AI 底层原理，建议同时学习 [LLM 工程师路径](90_学习/02_学习路径/08_llm_engineer.md)。

---

## 毕业项目：构建完整的企业 AI 中台

完成上述 5 个 Phase 后，建议用一个综合项目串联所有技能：

### 项目描述

构建一个**企业 AI 知识中台**，包含以下模块：

| 模块 | 技术要求 | 对应 Phase |
|------|---------|-----------|
| 文档管理 API | 文档上传、ETL Pipeline、PGVector 索引 | Phase 3 |
| 智能问答 API | RAG + 对话记忆 + 引用来源 | Phase 3 |
| Agent 工作流 | 多工具编排 + MCP 集成 | Phase 4 |
| 安全网关 | Spring Security + Prompt 注入防御 + 限流 | Phase 5 |
| 多模型路由 | OpenAI + Ollama Fallback + 成本控制 | Phase 5 |
| 监控看板 | Prometheus + Grafana + 告警 | Phase 5 |
| 容器化部署 | Docker + K8s + HPA | Phase 5 |
| 测试套件 | 单元测试 + 集成测试 + 安全测试 | Phase 5 |

---

## 面试准备：Java AI 工程师常见问题

### 基础概念

| 问题 | 参考答案 |
|------|---------|
| 什么是 Spring AI？它与 LangChain4j 有什么区别？ | Spring AI 是 Spring 官方 AI 框架，原生集成 Spring 生态；LangChain4j 是独立的 Java AI 工具箱，AI Services 声明式接口是其特色 |
| RAG 的完整流程是什么？ | 文档加载 → 分块 → Embedding → 向量存储 → 检索 → 上下文组装 → LLM 生成 |
| Function Calling 的执行流程？ | 用户输入 → LLM 判断需要调用工具 → Spring AI 执行 Java 方法 → 结果返回 LLM → 最终回答 |

### 架构设计

| 问题 | 参考答案 |
|------|---------|
| 如何设计一个支持多租户的 RAG 系统？ | 向量存储 metadata 加 tenant_id 字段，检索时自动注入租户过滤条件 |
| 如何保证 AI 服务的高可用？ | 多模型 Fallback + 熔断器 + 限流 + K8s HPA + 健康检查 |
| 如何控制 AI 调用成本？ | 模型路由（简单→小模型）、Embedding 缓存、本地模型 Fallback、Token 配额 |

### 安全

| 问题 | 参考答案 |
|------|---------|
| 如何防御 Prompt 注入攻击？ | 多层防御：关键词正则过滤 → LLM 判断意图 → 间接注入检测 → 输出过滤 |
| 如何管理多个 LLM API Key？ | 使用 Vault/Secrets Manager 存储，定时轮换，不硬编码、不落日志 |

### 代码实战

| 问题 | 参考答案 |
|------|---------|
| 写一个带 RAG 的 ChatClient | ChatClient.builder + QuestionAnswerAdvisor + VectorStore + System Prompt |
| 写一个自定义 Advisor 实现审计日志 | 实现 CallAroundAdvisor，记录 userId/model/tokens/cost/latency |
| 如何测试 Spring AI 应用？ | Mock ChatModel 做单元测试，TestContainers 做集成测试，快照测试做 Prompt 回归 |

---

## 常见问题 (FAQ)

**Q: 我没有 Python 经验，能学这个路径吗？**
A: 完全可以。本路径专门为 Java 开发者设计，所有内容基于 Java/Spring 生态。不需要写 Python。

**Q: Spring AI 1.0 稳定吗？可以用于生产吗？**
A: Spring AI 1.0.0 GA 于 2025 年 5 月发布，已经稳定。多家企业在生产环境使用。

**Q: 本地开发需要 GPU 吗？**
A: 不需要。使用 OpenAI/Anthropic 等云端 API 只需网络连接。只有本地推理（Ollama 大模型）才需要 GPU。

**Q: 学完这个路径能找到 AI 工程师的工作吗？**
A: 这个路径覆盖了 Java AI 工程师的核心技能。建议同时补充 AI 基础概念（Phase 1 涵盖），并完成毕业项目作为作品集。

**Q: Spring AI 和 LangChain4j 应该先学哪个？**
A: 如果你的项目基于 Spring Boot，先学 Spring AI。LangChain4j 可以作为补充，特别是它的 AI Services 功能。

---

## 每周详细日程

### Phase 1: 第 1-2 周详细日程

```
Week 1: Java AI 生态认知
════════════════════════════════════════════════════════════════════

Day 1-2: 环境搭建 + Spring AI 入门
────────────────────────────────────────────────────────────────
□ JDK 21 安装 (sdk install java 21-temurin)
□ 创建 Spring Boot 3.4 项目 (start.spring.io)
□ 添加 spring-ai-openai-spring-boot-starter 依赖
□ 配置 OPENAI_API_KEY
□ 运行第一个 ChatClient 示例
□ 阅读文档: → [Java 生态概览](01_数学基础/11_Java生态与AI/02_Java生态与AI_概览.md)

Day 3-4: Spring AI 核心概念
────────────────────────────────────────────────────────────────
□ 理解 ChatModel / EmbeddingModel / ImageModel
□ 配置多模型切换
□ 实现一个简单的 REST Chat API
□ 了解 Advisor 模式
□ 阅读文档: → [Spring AI 架构](12_架构基建/02_架构概览/Spring_AI_Architecture)

Day 5: 小测验 + 实践
────────────────────────────────────────────────────────────────
□ 完成 Spring AI 基础概念测验
□ 实现一个"代码审查助手"小项目
□ 提交到 Git 仓库

Week 2: RAG 基础
══════════════════════════════════════════════════════════════════

Day 1-2: Embedding + 向量数据库
────────────────────────────────────────────────────────────────
□ 安装 PGVector (docker run pgvector/pgvector)
□ 理解 Embedding 原理
□ 实现文档 → Embedding → PGVector 写入
□ 阅读文档: → [RAG 深度指南](14_RAG系统/06_RAG框架/07_Spring_AI_RAG_深入分析.md)

Day 3-5: 构建第一个 RAG 应用
────────────────────────────────────────────────────────────────
□ 实现文档加载 (PDF/Markdown)
□ 实现文本分块 (TokenTextSplitter)
□ 实现向量检索 + LLM 回答
□ 添加引用来源展示
□ 端到端测试
```

### Phase 2: 第 3-4 周详细日程

```
Week 3: Tool Calling + Agent
══════════════════════════════════════════════════════════════════

Day 1-2: Function Calling
────────────────────────────────────────────────────────────────
□ 注册自定义 Function Bean
□ 实现天气查询 / 数据库查询工具
□ 理解 LLM 如何选择调用工具
□ 阅读文档: → [Spring AI 深度指南](01_数学基础/11_Java生态与AI/03_Spring_AI_深入分析.md)

Day 3-5: 构建 Agent
────────────────────────────────────────────────────────────────
□ 实现 ReAct Agent 循环
□ 添加多工具编排
□ 实现记忆管理
□ 构建一个"数据分析 Agent"

Week 4: 高级 RAG
══════════════════════════════════════════════════════════════════

Day 1-2: 高级分块 + 检索策略
────────────────────────────────────────────────────────────────
□ 实现语义分块 (Semantic Chunking)
□ 实现混合检索 (向量 + 关键词)
□ 实现 Re-ranking

Day 3-5: RAG 评估与优化
────────────────────────────────────────────────────────────────
□ 构建评估数据集
□ 测量 Faithfulness / Relevancy
□ 调优分块参数和检索参数
□ 编写 RAG 质量报告
```

### Phase 3: 第 5-8 周详细日程

```
Week 5-6: 生产架构
══════════════════════════════════════════════════════════════════

Week 5:
────────────────────────────────────────────────────────────────
Day 1-2: 安全防护
  □ 实现 Prompt 注入防御
  □ 配置 OAuth2 + API Key 认证
  □ 实现速率限制
  □ 阅读文档: → [Gateway 安全](12_架构基建/11_AI网关/13_Spring_AI网关_安全.md)

Day 3-5: 可观测性
  □ 集成 Micrometer + Prometheus
  □ 配置分布式追踪 (OpenTelemetry)
  □ 搭建 Grafana 仪表盘
  □ 配置告警规则

Week 6:
────────────────────────────────────────────────────────────────
Day 1-3: 事件驱动架构
  □ 实现 Kafka + Spring AI 集成
  □ 构建异步文档处理管道
  □ 实现增量索引

Day 4-5: 多模型管理
  □ 实现模型负载均衡
  □ 实现降级与熔断
  □ 配置动态模型切换

Week 7-8: 部署与测试
══════════════════════════════════════════════════════════════════

Week 7: 测试
────────────────────────────────────────────────────────────────
Day 1-2: 单元测试
  □ Mock ChatModel 测试
  □ 测试数据工厂搭建
  □ 阅读文档: → [Java AI 测试](09_测试/02_测试框架/03_Java_AI测试.md)

Day 3-5: 集成测试 + 安全测试
  □ Testcontainers 集成测试
  □ Prompt 注入测试套件
  □ CI 流水线配置

Week 8: 部署
────────────────────────────────────────────────────────────────
Day 1-3: Docker + K8s
  □ GraalVM Native Image 构建
  □ Docker 镜像优化
  □ Kubernetes 部署配置
  □ 阅读文档: → [JVM AI 部署](10_部署推理/02_推理引擎/10_JVM_AI_部署.md)

Day 4-5: 监控与运维
  □ 生产就绪检查清单
  □ 灰度发布配置
  □ Runbook 编写
```

### Phase 4: 第 9-12 周详细日程

```
Week 9-10: 毕业项目开发
══════════════════════════════════════════════════════════════════

Week 9: 核心功能开发
────────────────────────────────────────────────────────────────
Day 1-2: 项目骨架 + 数据模型
  □ Spring Boot 项目初始化
  □ 数据库 Schema 设计
  □ 基础 CRUD API

Day 3-5: RAG 管道搭建
  □ 文档上传 + 解析
  □ 分块 + Embedding + 入库
  □ 检索 + 生成回答 API

Week 10: Agent + 高级功能
────────────────────────────────────────────────────────────────
Day 1-2: Tool Calling 集成
  □ 数据库查询工具
  □ 外部 API 调用工具
  □ 报表生成工具

Day 3-5: 安全 + 部署
  □ 认证授权
  □ 速率限制 + 成本控制
  □ Docker Compose 部署

Week 11-12: 打磨 + 展示
══════════════════════════════════════════════════════════════════

Week 11: 测试 + 优化
────────────────────────────────────────────────────────────────
Day 1-3: 全面测试
  □ 单元测试覆盖率 > 80%
  □ 集成测试
  □ RAG 评估

Day 4-5: 性能优化
  □ 缓存策略
  □ Embedding 预计算
  □ 负载测试

Week 12: 文档 + 展示
────────────────────────────────────────────────────────────────
Day 1-3: 项目文档
  □ README + 架构图
  □ API 文档 (Swagger)
  □ 部署指南

Day 4-5: 面试准备 + 项目展示
  □ 模拟面试
  □ 项目 Demo 录制
  □ 代码开源 (可选)
```

---

## 扩展阅读清单

### 必读

| 资源 | 类型 | 链接 |
|------|------|------|
| Spring AI 官方文档 | 文档 | https://docs.spring.io/spring-ai/reference/ |
| LangChain4j 官方文档 | 文档 | https://docs.langchain4j.dev/ |
| DJL 官方文档 | 文档 | https://djl.ai/ |
| Spring AI Examples | 代码 | https://github.com/spring-projects/spring-ai |

### 推荐

| 资源 | 类型 | 说明 |
|------|------|------|
| Baeldung Spring AI 系列 | 教程 | 深入浅出的 Spring AI 教程 |
| Josh Long 的 Spring AI 视频 | 视频 | Spring 官方布道师讲解 |
| "Building AI Applications with Spring Boot" | 书籍 | 实战导向 |
| Deep Java Learning 示例仓库 | 代码 | DJL 官方示例集 |

### 进阶

| 资源 | 类型 | 说明 |
|------|------|------|
| Argo Rollouts 文档 | 文档 | K8s 灰度发布 |
| OpenTelemetry Java Agent | 文档 | 分布式追踪 |
| GraalVM Native Image 指南 | 文档 | 云原生 Java |
| Vector DB Benchmarks | 网站 | 向量数据库性能对比 |

---

## 社区与生态资源

### 中文社区

```
Java AI 学习社区
════════════════════════════════════════════════════════════════════

GitHub 组织:
────────────────────────────────────────────────────────────────
• spring-projects/spring-ai      ← Spring AI 源码
• langchain4j/langchain4j       ← LangChain4j 源码
• deepjavalibrary/djl            ← DJL 源码

技术博客:
────────────────────────────────────────────────────────────────
• Spring Blog (spring.io/blog)   ← Spring AI 发布公告
• VLounge (virtuel-lounge.de)    ← Juergen Hoeller 的 Java 分享
• DZone Java Zone                ← Java 技术文章聚合

问答与讨论:
────────────────────────────────────────────────────────────────
• Stack Overflow: [spring-ai] 标签
• GitHub Discussions: spring-ai 仓库
• Discord: Spring Community Server
```

---

## 关键术语对照表

| 英文术语 | 中文 | 释义 |
|---------|------|------|
| ChatModel | 聊天模型 | Spring AI 中与大语言模型交互的核心接口 |
| Embedding | 嵌入 | 将文本转换为向量表示 |
| VectorStore | 向量存储 | 存储和检索 Embedding 向量的数据库 |
| Advisor | 顾问 | Spring AI 的拦截器模式，类似 Servlet Filter |
| Tool Calling | 工具调用 | LLM 请求执行外部函数的能力 |
| RAG | 检索增强生成 | 结合外部知识库的 AI 回答模式 |
| Semantic Chunking | 语义分块 | 基于语义边界而非固定长度的文本分割 |
| Native Image | 原生镜像 | GraalVM 编译的无需 JVM 的可执行文件 |
| Prompt Template | 提示词模板 | 参数化的 System/User Prompt |
| Memory | 对话记忆 | 跨轮次保持对话上下文的机制 |

---

## 常见陷阱与避坑指南

### Spring AI 开发 Top 10 陷阱

```
常见陷阱清单
════════════════════════════════════════════════════════════════════

陷阱 1: ChatModel 直接注入使用
────────────────────────────────────────────────────────────────
❌ chatModel.call(new Prompt(message))
✅ chatClient.prompt().user(message).call().content()

原因: ChatClient 提供完整的 Advisor 链、记忆管理、
      工具调用编排等高级功能。

陷阱 2: 忘记关闭 DJL Predictor
────────────────────────────────────────────────────────────────
❌ predictor.predict(input);  // 未关闭
✅ try (Predictor p = model.newPredictor()) { p.predict(input); }

原因: Predictor 持有 GPU 资源，不关闭会内存泄漏。

陷阱 3: VectorStore 查询不带 Metadata 过滤
────────────────────────────────────────────────────────────────
❌ vectorStore.similaritySearch(query)  // 返回所有租户数据
✅ vectorStore.similaritySearch(
      SearchRequest.builder().query(query)
        .filterExpression(new Expression(EQ, new Key("tenant_id"), ...))
        .build())

陷阱 4: Token 计数不准确导致成本失控
────────────────────────────────────────────────────────────────
❌ 不监控 Token 使用量
✅ 每次 LLM 调用后记录 usage，设置日预算告警

陷阱 5: System Prompt 硬编码
────────────────────────────────────────────────────────────────
❌ @Value("${ai.prompt}") String prompt
✅ 使用 PromptTemplate + 外部文件管理

陷阱 6: 同步调用 LLM 阻塞线程池
────────────────────────────────────────────────────────────────
❌ chatClient.prompt().user(msg).call()  // 在 WebFlux 中
✅ chatClient.prompt().user(msg).stream() // 或使用虚拟线程

陷阱 7: 不处理 LLM 调用失败
────────────────────────────────────────────────────────────────
❌ String result = chatClient.prompt().user(msg).call().content();
✅ try { ... } catch (Exception e) { fallback(); }

陷阱 8: RAG 不做分块优化
────────────────────────────────────────────────────────────────
❌ 整篇文档作为一个 chunk
✅ TokenTextSplitter(800, 200, 5, 10000, true)

陷阱 9: Native Image 不做反射配置
────────────────────────────────────────────────────────────────
❌ 直接 native compile Spring AI 项目
✅ 添加 reflect-config.json + @RegisterReflectionForBinding

陷阱 10: 生产环境用 InMemoryChatMemory
────────────────────────────────────────────────────────────────
❌ ChatMemory.of(new InMemoryChatMemoryRepository())
✅ ChatMemory.of(JdbcChatMemoryRepository.builder().dataSource(ds).build())
```

---

## 面试真题深度解析

### 初级 (1-3 年)

**Q1: Spring AI 中 ChatModel 和 ChatClient 有什么区别？**
> ChatModel 是底层 LLM 调用接口，负责与具体 AI 模型通信。ChatClient 是高层封装，提供了 Advisor 链（类似过滤器链）、对话记忆、工具调用编排、RAG 集成等能力。生产中应始终使用 ChatClient。

**Q2: 什么是 RAG？Spring AI 如何实现？**
> RAG (Retrieval-Augmented Generation) 是在 LLM 生成回答前，先从外部知识库检索相关文档，将文档内容注入 Prompt 上下文。Spring AI 通过 QuestionAnswerAdvisor + VectorStore + EmbeddingModel 三者配合实现，核心流程：用户提问 → Embedding → 向量检索 → 文档注入 Prompt → LLM 生成回答。

**Q3: Spring AI 的 Function Calling 是怎么工作的？**
> LLM 在生成回答时如果判断需要调用外部工具，会返回一个工具调用请求（包含函数名和参数）。Spring AI 自动匹配注册的 Function Bean，执行并将结果回传给 LLM，LLM 再基于工具结果生成最终回答。这个过程是自动的，开发者只需注册 Function Bean。

### 中级 (3-5 年)

**Q4: 如何设计一个支持多租户的 RAG 系统？**
> 三种方案：(1) Metadata 过滤 — 共享 VectorStore，每条记录带 tenant_id，查询时过滤；(2) Schema 隔离 — 每租户独立 PGVector Schema；(3) 物理隔离 — 独立 VectorStore 实例。推荐方案 1（< 100 租户），成本低且实现简单。关键是确保每次查询都带 tenant_id 过滤条件。

**Q5: 如何处理 LLM API 的高延迟和不可用？**
> (1) 异步流式响应减少用户感知延迟；(2) 熔断器 (Resilience4j) 防止级联故障；(3) 多模型 Fallback — 主模型不可用时自动切换备用模型；(4) 预计算缓存 — 对高频相同查询缓存回答；(5) 静态兜底 — 所有模型不可用时返回预设回复。

**Q6: Spring AI Native Image 有哪些坑？**
> 主要问题：(1) 反射 — Jackson 序列化 AI 响应对象需要 reflect-config.json；(2) 动态代理 — AOP 相关的动态代理需要 proxy-config.json；(3) 资源文件 — Prompt 模板等资源文件需要 resource-config.json；(4) 运行时初始化 — OkHttp、JDBC 等需要在运行时初始化。建议使用 Spring AOT 处理和 GraalVM Tracing Agent 辅助生成配置。

### 高级 (5 年+)

**Q7: 如何设计一个 AI Agent 的 Tool Calling 安全框架？**
> (1) 权限分层 — 按工具敏感度分级（只读/写入/管理）；(2) 用户身份透传 — 工具执行时验证当前用户权限；(3) 参数校验 — LLM 生成的工具参数必须经过验证（如 SQL 注入检测）；(4) 审计日志 — 每次工具调用记录完整参数和结果；(5) 调用频率限制 — 防止 LLM 进入工具调用死循环（设置最大轮次 5）。

**Q8: 如何评估和优化 RAG 系统质量？**
> (1) 离线评估 — 构建 (question, ground_truth) 数据集，测量 Faithfulness（忠实度）、Answer Relevancy（相关性）、Context Precision（检索精度）、Context Recall（召回率）；(2) 在线评估 — 收集用户反馈（点赞/踩），监测"我不知道"回答比例；(3) 优化手段 — 调整分块大小/重叠、尝试不同 Embedding 模型、增加 Re-ranking、优化 System Prompt。

---

## 开源贡献指南

### 参与贡献的路径

```
Spring AI 开源贡献路线
════════════════════════════════════════════════════════════════════

Level 1: 文档贡献（最容易入门）
────────────────────────────────────────────────────────────────
• 修复文档中的错误或过时信息
• 补充缺少的代码示例
• 翻译文档（中文化）
• 仓库: spring-projects/spring-ai

Level 2: Bug 修复
────────────────────────────────────────────────────────────────
• 从 GitHub Issues 中找 good-first-issue
• 添加缺失的单元测试
• 修复边界条件 Bug

Level 3: 新功能开发
────────────────────────────────────────────────────────────────
• 添加新的 Model 提供商支持
• 实现新的 VectorStore 适配器
• 添加新的 Advisor 实现

贡献流程:
────────────────────────────────────────────────────────────────
1. Fork 仓库
2. 创建 feature 分支
3. 编写代码 + 测试（覆盖率 > 80%）
4. 提交 PR（填写 PR 模板）
5. 等待 Review（通常 1-7 天）
6. 根据反馈修改
7. 合并

代码规范:
────────────────────────────────────────────────────────────────
• 遵循 Spring 代码风格
• 所有 public 方法添加 Javadoc
• 新功能必须附带测试
• 使用 Spring AI 现有的工具类和模式
```

---

*Last updated: 2026-04*

## Related

- [[90_学习/04_实践指南/07_milestones]] — 里程碑自测 (共享: courses, education, learning, study-path)
- [[90_学习/02_学习路径/01_absolute_beginner]] — 零基础通识路径 (共享: courses, education, learning, study-path)
- [[90_学习/02_学习路径/03_ai_researcher]] — AI 研究者路径 (共享: courses, education, learning, study-path)
- [[90_学习/02_学习路径/08_llm_engineer]] — LLM 工程师路径 (共享: courses, education, learning, study-path)
