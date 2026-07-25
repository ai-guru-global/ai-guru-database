---
title: Spring AI 与 Agent Skills 集成
category: 15-agent-production-agent-skills
tags: ["ai-agents", "agent-framework", "production", "langgraph", "spring-ai"]
summary: "> Spring AI 是支持 Agent Skills 开放标准的 Java AI 应用框架之一。本文档说明如何在 Spring AI 项目中使用 Agent Skills。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
aliases:
  - "Spring Ai Skills Integration"
  - "Spring AI Skills Integration"
  - Spring_AI_Skills_Integration
sources: []

---
# Spring AI 与 Agent Skills 集成

> Spring AI 是支持 Agent Skills 开放标准的 Java AI 应用框架之一。本文档说明如何在 Spring AI 项目中使用 Agent Skills。

---

## Spring AI 对 Agent Skills 的支持

Spring AI 从 1.0.x 版本开始兼容 Agent Skills 开放标准，支持：

- **Skill 发现**：扫描 `.agents/skills/` 目录加载 Skill 元数据
- **Skill 激活**：通过 `ChatClient` 的 Advisor 链注入 Skill 指令
- **Skill 执行**：利用 Spring AI 的 Function Calling 机制执行 Skill 中引用的脚本

---

## 在 Spring AI 项目中使用 Agent Skills

### 项目结构

```
my-spring-ai-app/
├── src/
│   └── main/
│       ├── java/
│       └── resources/
├── .agents/
│   └── skills/
│       ├── csv-analyzer/
│       │   └── SKILL.md
│       └── pdf-processing/
│           └── SKILL.md
└── pom.xml
```

### 配置 Skill 扫描路径

```yaml
spring:
  ai:
    skills:
      scan-paths:
        - .agents/skills/
        - ~/.agents/skills/
      enabled: true
```

### ChatClient 中使用 Skill

```java
@Service
public class SkillAwareChatService {

    private final ChatClient chatClient;

    public String executeWithSkill(String userMessage) {
        return chatClient.prompt()
            .user(userMessage)
            .skills() // 自动匹配并激活相关 Skill
            .call()
            .content();
    }
}
```

### 自定义 Skill Advisor

```java
@Component
public class SkillActivationAdvisor implements CallAroundAdvisor {

    private final SkillRegistry skillRegistry;

    @Override
    public AdvisedResponse aroundCall(AdvisedRequest request, CallAroundAdvisorChain chain) {
        // 根据用户消息匹配 Skill
        List<Skill> matchedSkills = skillRegistry.findByDescription(request.userText());
        
        // 将 Skill 指令注入 Prompt
        String enhancedPrompt = enhanceWithSkills(request.userText(), matchedSkills);
        
        AdvisedRequest enhancedRequest = AdvisedRequest.from(request)
            .withUserText(enhancedPrompt)
            .build();
        
        return chain.nextAroundCall(enhancedRequest);
    }
}
```

---

## 为 Spring AI 项目创建 Agent Skills

Spring AI 项目的 Skill 遵循标准 Agent Skills 格式，无额外要求：

1. **标准 SKILL.md**：YAML frontmatter + Markdown body
2. **脚本支持**：`scripts/` 下的脚本可被 Spring AI 的 Function Calling 调用
3. **依赖管理**：利用 PEP 723（Python）或 Spring 的依赖注入（Java）

### 示例：Spring Boot 部署 Skill

```markdown
---
name: spring-boot-deploy
description: Deploy a Spring Boot application. Use when the user wants to deploy, build, or package a Spring Boot app.
---

## Workflow

1. Check if Maven or Gradle: `ls pom.xml` or `ls build.gradle`
2. Build the project:
   - Maven: `./mvnw clean package -DskipTests`
   - Gradle: `./gradlew bootJar`
3. Run the application:
   - `java -jar target/*.jar` (Maven)
   - `java -jar build/libs/*.jar` (Gradle)

## Gotchas
- Spring Boot 3.x requires Java 17+
- `application.yml` profiles may affect startup behavior
```

---

## 完整 Spring AI 文档

Spring AI 框架的深度技术文档（ChatClient、Advisor、RAG、MCP、Observability 等）已迁移至：

📄 [Java 生态 AI / Spring AI 深度解析](01_数学基础/11_Java_Ecosystem_AI/Spring_AI_Deep_Dive.md)

---

## 🔗 相关主题

- [Agent Skills 深度解析](./Agent_Skills_Deep_Dive.md) — Agent Skills 完整规范
- [Agent Skills 实战指南](./Agent_Skills_Practical_Guide.md) — 创建和优化 Skill
- [Spring AI 架构设计](../../12_架构基建/02_Architecture_Overview/Spring_AI_Architecture)
- [Spring AI RAG 深度解析](14_RAG系统/06_RAG_Frameworks/Spring_AI_RAG_Deep_Dive.md)

## Related

- [[15_智能体/07_Agent_Evaluation/Agent_Harness_Complete_2026]] — Agent Harness 完整指南：生产级 Agent 评估框架 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent_Evaluation/Agent_Red_Teaming_2026]] — Agent Red Teaming Framework 2026 (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent_Evaluation/Assessment/Evaluation_Workflow]] — Evaluation Workflow (共享: agent-framework, ai-agents, langgraph, production)
- [[15_智能体/07_Agent_Evaluation/Assessment/Production_Assessment]] — Production Assessment (共享: agent-framework, ai-agents, langgraph, production)

## 附录：核心概念速查

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Agent Loop | 感知-思考-行动循环 | 核心执行流程 |
| Tool Use | 调用外部工具/API | 扩展能力 |
| Memory | 短期/长期记忆 | 上下文维护 |
| Planning | 任务分解与排序 | 复杂任务 |
| Reflection | 自我评估改进 | 质量提升 |
| Multi-Agent | 多Agent协作 | 分布式任务 |

## 附录：技术栈对比

| 框架/工具 | 特点 | 适用场景 | 成熟度 |
|----------|------|----------|--------|
| LangChain | 链式调用 | 通用Agent | ★★★★☆ |
| LangGraph | 图结构编排 | 复杂流程 | ★★★★☆ |
| AutoGen | 多Agent对话 | 协作任务 | ★★★★☆ |
| CrewAI | 角色分工 | 团队模拟 | ★★★☆☆ |
| OpenAI SDK | 官方框架 | 快速原型 | ★★★★☆ |
| Semantic Kernel | 企业级 | .NET/Java | ★★★★☆ |

## 附录：学习路径

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | 基础概念文档 | 理解Agent |
| 进阶 | 本文档深度内容 | 掌握技术 |
| 实践 | 动手项目 | 构建应用 |
| 前沿 | 最新论文/产品 | 跟踪发展 |

## 附录：常见问题

| 问题 | 解答 |
|------|------|
| Agent和Chatbot的区别？ | Agent能自主决策+使用工具+持续执行 |
| 需要什么前置知识？ | LLM基础+编程+系统设计 |
| 如何评估Agent？ | 任务完成率+效率+安全性 |
| 2026年趋势？ | 多Agent协作/企业级/具身智能 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 智能体 | Agent | 自主决策AI系统 |
| 工具调用 | Tool Use | 使用外部工具 |
| 记忆 | Memory | 上下文/历史 |
| 规划 | Planning | 任务分解 |
| 反思 | Reflection | 自我评估 |
| 编排 | Orchestration | 流程管理 |
| 协议 | Protocol | 通信标准 |
| 护栏 | Guardrails | 安全约束 |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解核心概念 | Agent架构 | ☐ |
| 掌握工具调用 | MCP/Function Calling | ☐ |
| 了解记忆机制 | 短期/长期 | ☐ |
| 理解规划推理 | CoT/ReAct | ☐ |
| 动手实践 | 构建Agent | ☐ |
| 了解评估方法 | 质量度量 | ☐ |

> 💡 智能体是AI从"对话"走向"行动"的关键跨越。掌握Agent开发，是2026年AI工程师的核心竞争力。

---
*Last updated: 2026-07-21*
