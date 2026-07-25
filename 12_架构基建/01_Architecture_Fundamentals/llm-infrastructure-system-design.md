---
title: "LLM 基础设施 × 传统系统架构 — 从 Web 服务到 Token 工厂"
category: -synthesis
tags: [llm-infrastructure, ai-infrastructure, system-design, gpu, serving, architecture]
sources:
  - "[[概念/llm-infrastructure]]"
  - "[[12_架构基建/02_Architecture_Overview/AI_Infrastructure_2026]]"
  - "[[12_架构基建/AI_System_Architecture_2026]]"
  - "[[12_架构基建/AI_Stack_Deep_Dive]]"
created: 2026-06-05
updated: 2026-06-05
summary: "传统系统架构（微服务、负载均衡、数据库）的哪些经验能迁移到 LLM 基础设施，哪些需要彻底重写？从 Web 服务架构师到 AI 基础设施工程师的认知迁移指南。"
provenance:
  extracted: 0.2
  inferred: 0.7
  ambiguous: 0.1
lifecycle: draft
lifecycle_changed: 2026-06-05
tier: core
aliases:
  - "Llm Infrastructure System Design"
  - "llm infrastructure system design"

---
# LLM 基础设施 × 传统系统架构 — 从 Web 服务到 Token 工厂

## The Connection

LLM 基础设施不是从零发明的——它大量借鉴了传统 Web 服务架构（API Gateway、负载均衡、缓存、监控），但又有几个**根本性差异**使得直接套用 Web 架构会踩坑。理解哪些经验能迁移、哪些需要重写，是从系统架构师转型 AI 基础设施工程师的关键。

## Where They Co-occur

- **AI Gateway**：传统 API Gateway（Kong、Envoy）的 LLM 适配版——路由、限流、鉴权、token 计费
- **推理服务化**：vLLM/TGI 的 deployment 模式复用 Kubernetes 的 Service/Deployment/HPA 概念
- **KV Cache 管理**：类似传统数据库的 buffer pool，但数据是 attention key-value tensor
- **多租户隔离**：从 VM/Container 隔离到 GPU 算力隔离（MIG、MPS、vGPU）
- **可观测性**：从 APM（延迟、吞吐、错误率）到 LLM Ops（token 延迟、TTFT、幻觉率）

## Cross-cutting Insight

传统架构和 LLM 基础设施的核心差异可以归结为**三个范式转换**：

### 1. 从请求-响应到流式推理
传统 Web 服务：请求 → 处理 → 响应（毫秒级，确定性）。LLM 推理：请求 → Prefill → 逐 token Decode（秒级，流式输出）。这改变了负载均衡（不能简单 round-robin，需要感知 GPU 显存和 KV cache 占用）和超时策略（不能用固定 timeout，需要 token 级进度检测）。

### 2. 从水平扩展到 GPU 拓扑感知
传统服务：加更多 Pod 即可。LLM 服务：需要考虑 GPU 拓扑（NVLink 连接、PCIe 带宽）、张量并行的设备亲和性、跨节点推理的通信开销。这催生了"拓扑感知调度"——不是把请求发到任意 GPU，而是发到与模型分片匹配的 GPU 组。

### 3. 从无状态到有状态推理
传统 Web 服务：天然无状态，水平扩展简单。LLM 推理：KV cache 是有状态的，迁移代价高（PagedAttention 的 block 不能跨实例共享）。这导致传统 sticky session 策略不够——需要 cache-aware routing（将续写请求路由到同一实例以复用 KV cache）。

## Tensions and Trade-offs

| 张力 | 传统做法 | LLM 做法 | 折中 |
|------|---------|---------|------|
| 扩展策略 | HPA (CPU/Memory) | GPU 利用率 + KV cache 占用率 | 自定义 metrics + KEDA |
| 缓存层 | Redis/Memcached | Prefix caching (PagedAttention) | 分层：Redis 存 prompt cache，GPU 存 KV cache |
| 服务发现 | Consul/Eureka | 静态 GPU 拓扑 + 动态负载 | 拓扑感知的 service mesh |
| 数据库 | PostgreSQL/MySQL | 向量数据库 (Milvus/Qdrant) | 混合：关系数据用 PG，向量用专用 DB |
| 监控 | Prometheus + Grafana | Prometheus + OpenTelemetry LLM 语义 | 统一观测面，区分传统和 LLM 指标 |

## Open Questions

- Serverless LLM 推理（如 Modal、Replicate）是否会替代自建 GPU 集群，像 AWS Lambda 替代自建服务器一样
- 如何将传统微服务的 circuit breaker 模式应用于 LLM 调用链——当上游 LLM 超时，是否应该降级到更小的模型
- LLM 推理的"冷启动"问题（模型加载到 GPU 需要分钟级）是否可以通过 checkpoint streaming 解决

## Related

- [[概念/llm-infrastructure]] — LLM 基础设施概念
- [[12_架构基建/02_Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施 2026
- [[12_架构基建/AI_System_Architecture_2026]] — AI 系统架构
- [[12_架构基建/AI_Stack_Deep_Dive]] — AI 技术栈深度解读
- [[10_部署推理/02_Inference_Engines/vLLM_Deep_Dive]] — vLLM 推理引擎
- [[12_架构基建/11_AI_Gateway/AI_Gateway_2026]] — AI Gateway 2026
- [[治理/serving-deployment]] — 服务化 × 部署

## 架构核心组件对比

| 组件层 | 功能 | 关键技术 | 选型考量 |
|--------|------|----------|----------|
| 计算层 | 07_模型训练/推理 | GPU/TPU/NPU集群 | 算力需求+成本 |
| 存储层 | 数据/模型/检查点 | 分布式存储/对象存储 | 容量+IOPS+成本 |
| 网络层 | 节点间通信 | RDMA/RoCE/InfiniBand | 带宽+延迟 |
| 调度层 | 资源编排 | K8s/Slurm/Ray | 弹性+效率 |
| 服务层 | 模型服务化 | vLLM/TGI/Triton | 吞吐+延迟 |
| 网关层 | 流量管理 | API Gateway/负载均衡 | 可用性+安全 |
| 监控层 | 可观测性 | Prometheus/Grafana/OTel | 全面+实时 |

## 架构设计原则

| 原则 | 说明 | 实践方法 |
|------|------|----------|
| 高可用 | 消除单点故障 | 多副本+故障转移+多AZ |
| 可扩展 | 水平扩展无瓶颈 | 无状态设计+分片 |
| 高性能 | 最小化延迟 | 缓存+并行+异步 |
| 安全性 | 纵深防御 | 加密+认证+审计 |
| 可观测 | 全链路可见 | Trace+Metrics+Logging |
| 成本优化 | 资源利用率最大化 | 弹性伸缩+混合部署 |

## 性能基准参考

| 场景 | 关键指标 | 目标值 | 优化方向 |
|------|----------|--------|----------|
| 模型推理 | 首Token延迟 | <500ms | 模型优化+缓存 |
| 批量推理 | 吞吐量 | >1000 req/s | 批处理+并行 |
| 训练任务 | GPU利用率 | >85% | 数据管道+通信优化 |
| 存储读写 | IOPS | >100K | NVMe+分布式 |
| 网络通信 | 带宽利用率 | >90% | RDMA+拓扑优化 |

## 常见问题与解决方案

| 问题 | 根因分析 | 解决方案 |
|------|----------|----------|
| GPU利用率低 | 数据加载瓶颈 | 预取+多worker+NVMe |
| 推理延迟高 | 模型过大/批处理不当 | 量化+动态batch |
| 存储IO瓶颈 | 检查点写入集中 | 异步写入+分布式存储 |
| 网络拥塞 | AllReduce通信密集 | 梯度压缩+拓扑优化 |
| 资源碎片 | 调度策略不当 | Gang调度+资源预留 |

## 技术选型决策树

| 决策点 | 选项A | 选项B | 选择依据 |
|--------|-------|-------|----------|
| 训练框架 | PyTorch DDP | DeepSpeed/Megatron | 模型规模>10B用后者 |
| 推理引擎 | vLLM | TensorRT-LLM | 灵活性vs极致性能 |
| 存储方案 | 本地NVMe | 分布式存储(Ceph) | 数据规模+共享需求 |
| 网络方案 | 以太网 | InfiniBand | 集群规模+预算 |
| 调度系统 | K8s | Slurm | 云原生vs HPC传统 |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 基础架构概念+组件认知 | 1-2周 | 理解全景图 |
| 基础 | 单一组件深入(存储/网络) | 2-3周 | 掌握核心原理 |
| 进阶 | 系统集成+性能优化 | 3-4周 | 能设计完整方案 |
| 实战 | 生产环境部署运维 | 4-6周 | 独立运维能力 |
| 精通 | 架构演进+前沿探索 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| RDMA | 远程直接内存访问(绕过CPU) |
| NVLink | GPU间高速互联 |
| InfiniBand | 高性能网络互连技术 |
| Checkpoint | 训练中间状态保存点 |
| Gang Scheduling | 一组Pod同时调度 |
| Data Parallelism | 数据并行(每GPU处理不同数据) |
| Model Parallelism | 模型并行(模型分片到多GPU) |
| Pipeline Parallelism | 流水线并行(层间流水) |
| Tensor Parallelism | 张量并行(层内切分) |
| KV Cache | 推理时缓存注意力键值 |

## 检查清单

- [ ] 理解AI基础设施全景架构
- [ ] 掌握计算/存储/网络核心组件
- [ ] 了解主流框架和工具链
- [ ] 能进行基本的性能分析和优化
- [ ] 熟悉生产环境最佳实践
- [ ] 关注硬件和架构演进趋势

## 架构演进趋势(2026)

| 趋势 | 影响 | 应对策略 |
|------|------|----------|
| 异构计算普及 | GPU/NPU/TPU混合部署 | 统一抽象层+调度优化 |
| 存算一体 | 减少数据搬运开销 | 关注新型硬件架构 |
| 液冷散热 | 支持更高功率密度 | 数据中心改造规划 |
| 光互连 | 突破带宽瓶颈 | 网络架构升级 |
| 云边协同 | 推理下沉到边缘 | 模型压缩+边缘部署 |
| AI for Infra | 智能运维和调优 | 引入AIOps工具 |

## 容量规划参考

| 模型规模 | GPU需求 | 存储需求 | 网络需求 | 月成本估算 |
|----------|---------|----------|----------|------------|
| 7B推理 | 1x A100 | 50GB SSD | 10Gbps | 2-3万 |
| 70B推理 | 4x A100 | 200GB SSD | 25Gbps | 8-12万 |
| 7B训练 | 8x A100 | 5TB NVMe | 100Gbps | 15-20万 |
| 70B训练 | 64x A100 | 50TB并行存储 | 400Gbps IB | 100-150万 |
| 405B训练 | 512x H100 | 200TB并行存储 | 800Gbps IB | 800万+ |

## 可靠性设计

| 层级 | 故障类型 | 恢复策略 | RTO目标 |
|------|----------|----------|---------|
| 硬件层 | GPU/磁盘故障 | 自动检测+热备替换 | <5min |
| 节点层 | 整机宕机 | 任务迁移+检查点恢复 | <15min |
| 网络层 | 链路中断 | 多路径+自动切换 | <1min |
| 服务层 | 进程崩溃 | 自动重启+流量切换 | <30s |
| 区域层 | 机房故障 | 跨区域切换 | <5min |

## 安全合规要点

| 安全域 | 关键措施 | 合规要求 |
|--------|----------|----------|
| 数据安全 | 加密存储+传输+脱敏 | GDPR/个保法 |
| 访问控制 | RBAC+最小权限+审计 | SOC2/ISO27001 |
| 模型安全 | 模型加密+水印+防窃取 | 商业秘密保护 |
| 供应链安全 | 镜像扫描+依赖审计 | NIST SSDF |
| 网络安全 | 微隔离+WAF+DDoS防护 | 等保2.0 |

## 运维监控体系

| 监控维度 | 关键指标 | 告警阈值 | 工具 |
|----------|----------|----------|------|
| GPU | 利用率/温度/显存 | >90%温度/>95%显存 | DCGM/nvidia-smi |
| 存储 | IOPS/延迟/容量 | >10ms延迟/>80%容量 | Ceph dashboard |
| 网络 | 带宽/丢包/延迟 | >1%丢包/>5us延迟 | Prometheus |
| 服务 | QPS/延迟/错误率 | >1%错误率/P99>2s | Grafana |
| 任务 | 完成率/排队时间 | <90%完成率/>30min排队 | 自定义 |

## 快速自检清单

- [ ] 架构设计满足高可用要求
- [ ] 性能指标达到业务SLA
- [ ] 安全措施覆盖各层级
- [ ] 监控告警体系完善
- [ ] 容灾备份方案已验证
- [ ] 成本优化持续进行
- [ ] 文档和运维手册齐全
