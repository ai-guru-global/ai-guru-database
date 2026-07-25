---
title: Agent 部署 (Agent Deployment)
category: 05-agents
tags: ["agent-deployment", "containerization", "scaling", "canary-release"]
summary: "Agent 部署完整指南：容器化部署、状态管理、自动扩缩容、灰度发布、多 Agent 编排部署、生产监控与 2026 最佳实践。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# Agent 部署 (Agent Deployment)

## 1. Agent 部署挑战

```
Agent vs 传统 Web 服务:

传统服务: 无状态 / 请求-响应 / 毫秒级 / 确定性
Agent:    有状态 / 多步执行 / 秒-分钟级 / 非确定性

部署挑战:
- 长时运行: 一个任务可能执行 1-10 分钟
- 状态持久化: 中途崩溃需恢复
- 资源波动: LLM 调用是 I/O 密集
- 并发控制: 工具调用可能有限流
- 成本控制: 防止 Agent 无限循环烧钱
- 安全隔离: Agent 有操作权限，需沙箱
```

## 2. 部署架构

```python
AGENT_DEPLOYMENT_ARCHITECTURE = {
    "计算层": {
        "容器化": "Docker + K8s (每个 Agent 一个 Pod)",
        "Serverless": "AWS Lambda / Cloud Run (轻量 Agent)",
        "长任务": "Temporal / Inngest (持久化执行)",
    },
    "状态层": {
        "会话状态": "Redis (短期) / PostgreSQL (长期)",
        "执行状态": "Temporal Workflow (可恢复)",
        "向量存储": "Pinecone / pgvector (Agent 记忆)",
    },
    "通信层": {
        "同步": "HTTP/gRPC (简单请求)",
        "异步": "消息队列 (RabbitMQ/Kafka)",
        "实时": "WebSocket / SSE (流式输出)",
    },
    "编排层": {
        "单 Agent": "直接部署",
        "多 Agent": "CrewAI / LangGraph / AutoGen",
        "工作流": "Temporal / Prefect",
    },
}
```

## 3. 容器化部署

```yaml
# docker-compose.yml - Agent 服务
services:
  agent-api:
    image: my-agent:latest
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - REDIS_URL=redis://redis:6379
      - MAX_STEPS=50
      - TIMEOUT_SECONDS=300
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 2G
          cpus: "1.0"
    depends_on:
      - redis
      - postgres

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: agent_state
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

## 4. 扩缩容策略

```python
SCALING_STRATEGY = {
    "指标": {
        "并发任务数": "每个 Pod 最多处理 N 个并发 Agent",
        "队列深度": "等待处理的任务队列长度",
        "LLM API 延迟": "上游 API 变慢时减少并发",
        "成本": "每小时 token 消耗超预算时缩容",
    },
    "策略": {
        "HPA": "基于 CPU/内存/自定义指标自动扩缩",
        "KEDA": "基于队列深度扩缩 (更精确)",
        "定时": "工作时间扩容/夜间缩容",
    },
    "限制": [
        "每个 Agent 最大步数 (防无限循环)",
        "每个任务最大 token 预算",
        "全局并发上限 (API 限流)",
        "单用户并发限制",
    ],
}
```

## 5. 灰度发布

```python
CANARY_DEPLOYMENT = {
    "流程": [
        "1. 新版本部署到 5% 流量",
        "2. 对比关键指标 (成功率/延迟/成本)",
        "3. 无异常 → 逐步扩大到 25% → 50% → 100%",
        "4. 异常 → 自动回滚",
    ],
    "对比指标": {
        "任务成功率": "新版 >= 旧版 * 0.95",
        "平均步数": "新版 <= 旧版 * 1.2",
        "成本": "新版 <= 旧版 * 1.3",
        "错误率": "新版 <= 旧版 * 1.1",
    },
    "回滚条件": [
        "成功率下降 > 5%",
        "错误率上升 > 2%",
        "成本上升 > 50%",
        "出现安全事件",
    ],
}
```

## 6. 生产监控

```python
AGENT_MONITORING = {
    "业务指标": [
        "任务完成率 (按类型)",
        "平均完成时间",
        "用户满意度",
    ],
    "技术指标": [
        "LLM 调用延迟 P50/P99",
        "工具调用成功率",
        "每任务 token 消耗",
        "错误/重试率",
    ],
    "告警规则": [
        "成功率 < 80% 持续 5 分钟 → P1",
        "单任务 > 10 分钟 → 超时告警",
        "token 消耗异常 (>3x 均值) → 成本告警",
        "连续失败 > 3 次 → 熔断",
    ],
}
```

## 7. 交叉引用

- [[15_智能体/|智能体系统]]
- [[15_智能体/07_Agent_Evaluation/Agent_Evaluation|Agent 评估]]
- [[10_部署推理/Serving_Architecture|服务架构]]
- [[13_运维/Incident_Management|事故管理]]
- [[12_架构基建/Multi_Tenancy|多租户]]

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
