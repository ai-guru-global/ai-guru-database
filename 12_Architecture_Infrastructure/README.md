# 架构与基础设施 (Architecture & Infrastructure)

> **一句话理解**: AI 系统架构是智能应用的"骨架与神经系统"——决定系统能支撑多少用户、响应有多快、运行有多稳、成本有多低。

---

## 本章内容

| 文档 | 内容 | 适用读者 |
|------|------|----------|
| [AI System Architecture 2026](./AI_System_Architecture_2026.md) | 四层架构全景图：应用层→服务层→数据层→基础设施层 | 架构师、技术负责人 |
| [AI Infrastructure 2026](./AI_Infrastructure_2026.md) | GPU 集群、存储网络、训练/推理基础设施 | 基础设施工程师 |
| [Capacity Planning 2026](./Capacity_Planning_2026.md) | QPS/并发模型、GPU 显存估算、成本预测 | 架构师、SRE |
| [High Availability 2026](./High_Availability_2026.md) | 多活架构、故障转移、灾备演练 | 运维工程师 |
| [AI Cost Optimization 2026](./AI_Cost_Optimization_2026.md) | 模型量化、缓存策略、批处理优化 | 成本敏感型团队 |
| [Edge AI 2026](./Edge_AI_2026.md) | 边缘部署、模型压缩、端侧推理 | 移动端/IoT 开发者 |
| [Multi Tenant Architecture](./Multi_Tenant_Architecture.md) | 租户隔离、资源配额、计费计量 | SaaS 架构师 |
| [Spring AI Architecture](./Spring_AI_Architecture.md) | Spring AI 企业级架构设计 | Java 生态开发者 |

---

## 学习路径

- **架构概览** → [AI System Architecture 2026](./AI_System_Architecture_2026.md)（1-2 小时）
- **容量规划** → [Capacity Planning 2026](./Capacity_Planning_2026.md) + [AI Cost Optimization 2026](./AI_Cost_Optimization_2026.md)
- **高可用设计** → [High Availability 2026](./High_Availability_2026.md) + [Multi Tenant Architecture](./Multi_Tenant_Architecture.md)
- **边缘场景** → [Edge AI 2026](./Edge_AI_2026.md)
- **Java 生态** → [Spring AI Architecture](./Spring_AI_Architecture.md)

---

## 与其他章节的关联

### 前置知识
- [深度学习](../03_Deep_Learning/README.md) — 理解模型计算特性
- [部署推理](../09_Deployment_Inference/README.md) — 推理优化是架构设计的基础
- [RAG 系统](../11_RAG_Systems/README.md) — 检索系统的架构考量

### 进阶方向
- [AI Gateway](../14_AI_Gateway/README.md) — 流量接入层设计
- [AI Ops](../16_AI_Ops/README.md) — 运维监控与自动化
- [Agent 生产](../13_Agent_Production/README.md) — Agent 系统的架构模式
- [云运维 Agent](../18_Cloud_Ops_Agent/) — 云原生运维体系

---

*本章内容持续完善中。*
