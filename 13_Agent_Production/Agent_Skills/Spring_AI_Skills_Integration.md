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

📄 [Java 生态 AI / Spring AI 深度解析](../../01_Fundamentals/Java_Ecosystem_AI/Spring_AI_Deep_Dive.md)

---

## 🔗 相关主题

- [Agent Skills 深度解析](./Agent_Skills_Deep_Dive.md) — Agent Skills 完整规范
- [Agent Skills 实战指南](./Agent_Skills_Practical_Guide.md) — 创建和优化 Skill
- [Spring AI 架构设计](../../12_Architecture_Infrastructure/Spring_AI_Architecture.md)
- [Spring AI RAG 深度解析](../../11_RAG_Systems/Spring_AI_RAG_Deep_Dive.md)
