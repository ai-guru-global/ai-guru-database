---
title: 内容补充执行计划 (2026-07-01)
category: meta
tags: [meta, plan, content-gap, production, 2026]
summary: 基于 _content-audit-2026-07-01.md 的审计结果，制定分批次内容补充计划，优先补齐跨章节引用频率最高的生产环境必备（P0）文档。
created: 2026-07-01
updated: 2026-07-01
sources: []
---

# 内容补充执行计划 (2026-07-01)

生成时间: 2026-07-01

## 一、执行原则

1. **P0 优先**: 只补充审计中标记为 P0（生产环境必备）且在 ≥2 个章节中被反复提及的主题。
2. **横向复用**: 优先创建可被多个章节 README 引用的横向文档（如 AI SRE、LLM 部署、RAG 生产架构）。
3. **保持风格**: 新文档必须包含标准 frontmatter、目录、Related 章节，并与现有文档的术语/标签保持一致。
4. **增量验证**: 每批创建后运行 `工具/check_links.py` 和 `工具/count_words.py` 检查质量。

## 二、优先级矩阵

| 优先级 | 批次 | 文件数 | 目标 |
|--------|------|--------|------|
| P0 | 第一批：横向生产基础设施 | 5 | 补齐 AI SRE、LLM/Agent/RAG 生产部署、安全护栏 |
| P0 | 第二批：评估、训练、成本 | 4 | 补齐训练 FinOps、RAG/Agent 评估、GRPO 训练 |
| P0 | 第三批：应用、代码、岗位、模板 | 5 | 补齐行业生产架构、代码安全审计、Agent 岗位面试、LLM Gateway 模板 |

## 三、第一批：横向生产基础设施（5 个文件）

### 1. `12_架构基建/AI_SRE_Runbook.md`

- **定位**: AI 系统的站点可靠性工程 Runbook，覆盖 SLO/SLI、on-call、事故响应、容量规划、灾备。
- **目标读者**: AI Infra 工程师、SRE、平台负责人。
- **必须包含**:
  - AI 服务 SLO/SLI 定义（延迟、吞吐、可用性、成本）
  - GPU 集群容量规划模型
  - 线上事故分级与响应流程（P0/P1/P2）
  - 模型回滚与热切换策略
  - 灾备 RTO/RPO 设计
  - 可观测性三板斧（metrics/logs/traces）
  - 与 `AI运维`、 `MLOps`、 `部署推理` 的交叉引用

### 2. `11_模型运维/10_LLMOps/LLM_Guardrails_and_Safety_Ops_2026.md`

- **定位**: LLM 生产环境输入输出护栏的工程化实践。
- **目标读者**: MLOps/LLMOps 工程师、AI 安全工程师。
- **必须包含**:
  - Prompt Injection / Jailbreak 检测与防御
  - PII/敏感信息过滤与脱敏
  - 输出毒性、偏见、幻觉检测
  - 护栏编排框架（Llama Guard、Nemo Guardrails、Guardrails AI、AWS Bedrock Guardrails）
  - Guardrails as Code：配置版本化、CI/CD 集成
  - 审计日志与合规留痕

### 3. `05_大模型/LLM_Production_Deployment_Runbook.md`

- **定位**: 大语言模型从模型文件到线上服务的完整部署 Runbook。
- **目标读者**: LLM Platform 工程师、后端工程师。
- **必须包含**:
  - 推理引擎选型：vLLM / TGI / SGLang / TensorRT-LLM / llama.cpp
  - 服务化架构：API Gateway、负载均衡、自动扩缩容
  - KV Cache / Prefix Caching 配置
  - 量化与投机解码在生产中的权衡
  - 多模型路由与 Fallback 策略
  - 安全、监控、成本优化 checklist

### 4. `15_智能体/01_Agent_Foundations/Agent_Production_Deployment_Runbook.md`

- **定位**: Agent 系统上线生产环境的完整 Runbook。
- **目标读者**: Agent 平台工程师、AI 应用架构师。
- **必须包含**:
  - Agent 架构组件（Planner、Memory、Tools、Sandbox、Orchestrator）
  - 有状态 vs 无状态部署
  - K8s 部署模式：Deployment / StatefulSet / HPA / 持久化记忆
  - 工具调用安全与沙箱隔离（E2B / Daytona / Firecracker）
  - 版本管理：Prompt / Skill / Config 版本化与 CI/CD
  - 可观测性：Trace、Step 级别监控、成本 Dashboard
  - 灾难恢复：会话状态、长期记忆、任务队列备份

### 5. `14_RAG系统/05_RAG_Production/RAG_Production_Architecture_Deep_Dive.md`

- **定位**: RAG 系统生产级架构设计与最佳实践。
- **目标读者**: RAG 系统架构师、AI 应用工程师。
- **必须包含**:
  - 经典 RAG vs Advanced RAG vs Agentic RAG 架构演进
  - 文档摄取管线：解析、切分、Embedding、索引、版本管理
  - 检索策略：Hybrid Search、Rerank、Query Expansion、GraphRAG
  - 生成环节：上下文压缩、引用生成、幻觉抑制
  - 评估与监控：检索命中率、答案忠实度、延迟、成本
  - 安全合规：权限隔离、数据出境、AIGC 标识

## 四、第二批：评估、训练、成本（4 个文件）

### 6. `07_模型训练/Training_Cost_Optimization_and_FinOps_2026.md`

- **定位**: 大模型训练的成本优化与 FinOps 实践。
- **必须包含**:
  - GPU 利用率分析与瓶颈定位
  - Spot/抢占式实例训练策略
  - Checkpoint 与恢复策略
  - 混合精度、ZeRO、Offloading 的成本收益
  - 训练任务成本归因与预算告警
  - 云厂商训练服务成本对比（SageMaker / Vertex / PAI）

### 7. `08_模型评估/RAG_Evaluation_Deep_Dive.md`

- **定位**: RAG 系统系统化评估方法。
- **必须包含**:
  - 检索评估：Recall@K、MRR、NDCG
  - 生成评估：Faithfulness、Answer Relevance、Context Precision
  - RAGAS、Ares、TruLens 等框架
  - LLM-as-Judge 偏见控制
  - 端到端测试数据集构建
  - A/B 测试与线上监控

### 8. `AI测试/Agent_Evaluation_Deep_Dive.md`

- **定位**: Agent 系统评估方法论与工具。
- **必须包含**:
  - 任务成功率、工具选择准确率、轨迹评估
  - Human-in-the-loop 评估
  - AgentBench、SWE-bench、WebArena 等基准
  - LLM-as-Judge 在 Agent 评估中的应用
  - 成本与延迟约束下的评估策略

### 9. `06_强化学习/GRPO_Training_Deep_Dive.md`

- **定位**: GRPO（Group Relative Policy Optimization）训练详解，面向 DeepSeek-R1 / Qwen3 / o1-class 推理模型。
- **必须包含**:
  - GRPO 算法原理与 PPO/DPO 对比
  - Reward Function 设计（规则奖励、模型奖励、过程奖励）
  - KL 控制与训练稳定性
  - 数据构造与课程学习
  - 显存优化与分布式训练配置
  - 案例：复现 DeepSeek-R1-Zero / Qwen3 推理训练

## 五、第三批：应用、代码、岗位、模板（5 个文件）

### 10. `18_行业应用/AI_Production_Architecture_2026.md`

- **定位**: 跨行业的 AI 生产架构通用模式与参考实现。
- **必须包含**:
  - 通用 AI 应用架构分层（数据层、模型层、服务层、网关层、应用层）
  - 行业架构模板：金融风控、医疗影像、自动驾驶、零售推荐、智能制造
  - 模型治理、漂移检测、退市流程
  - 安全合规 checklist（等保、EU AI Act、HIPAA、FDA）
  - 成本优化与 FinOps

### 11. `AI编程/AI_Code_Security_Audit_Runbook.md`

- **定位**: AI 辅助代码的安全审计流程与工具链。
- **必须包含**:
  - AI 生成代码的常见漏洞（注入、依赖混淆、密钥泄露、幻觉 API）
  - SAST/SCA/Secret Scan 工具配置
  - AI 代码审查工具对比（CodeRabbit、PR-Agent、Copilot Review）
  - 审计 checklist 与高危漏洞样例库
  - CI/CD 集成与企业合规要求

### 12. `04_计算机视觉/CV_Deployment_and_Inference_2026.md`

- **定位**: 计算机视觉模型生产部署与推理优化。
- **必须包含**:
  - 模型格式转换：ONNX / TensorRT / OpenVINO / TF-Lite / Core ML
  - 服务化：Triton / TorchServe / NVIDIA Triton
  - 量化、剪枝、蒸馏在 CV 中的实践
  - 边缘/移动端部署（Jetson / iOS / Android）
  - 可观测性与 A/B 测试
  - 工业质检、自动驾驶感知案例

### 13. `21_面试岗位/Agent_Engineer_2026.md`

- **定位**: Agent 工程师岗位面试指南。
- **必须包含**:
  - 岗位定位与技能栈
  - 核心考点：ReAct / Plan-and-Execute / Multi-Agent / Memory / Tool Use
  - 系统设计题：设计一个客服 Agent / 多 Agent 协作平台
  - 代码题：Function Calling、RAG、Agent 循环
  - 行为面试与领导力面试题
  - 学习路径推荐

### 14. `模板/LLM_Gateway_Deep_Dive.md`

- **定位**: LLM Gateway 的设计、实现与运维模板。
- **必须包含**:
  - Gateway 核心能力：路由、负载均衡、Fallback、限流、密钥管理
  - 主流方案对比：LiteLLM、Portkey、Cloudflare AI Gateway、Kong AI Gateway
  - 成本归因与配额管理
  - 可观测性集成
  - Terraform / Helm 部署模板片段

## 六、执行检查清单

每批完成后执行：

- [ ] 文件已写入指定目录
- [ ] frontmatter 完整且符合规范
- [ ] 包含目录、Related 章节、交叉链接
- [ ] 对应章节 README.md 已更新导航
- [ ] `工具/check_links.py` 无新增断链
- [ ] `工具/count_words.py` 统计字数合理（≥3000 字）

## 七、风险与调整

- **风险**: 14 个深度文档工作量较大，可能无法一次完成。
- **调整策略**: 若进度受阻，优先保留第一批 5 个文件；其余放入下一轮迭代计划。

---

*Related*
- [[治理/_content-audit-2026-07-01|全章节内容审计与缺口分析报告]]
- [[README]]
- [[ROADMAP]]
