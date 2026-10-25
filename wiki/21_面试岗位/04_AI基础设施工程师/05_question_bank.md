---
title: AI Infrastructure Engineer 题库
category: 21-interviews-ai-infrastructure-engineer
tags: ["interviews", "career", "infrastructure", "gpu", "kubernetes", "distributed-training", "mlops"]
summary: "AI Infrastructure Engineer 面试题库，覆盖 GPU/集群、分布式训练、推理部署、MLOps 和系统设计，含难度与频率标注。"
created: 2026-05-31
updated: 2026-06-04
tier: supporting
sources: []
name_zh: "AI Infrastructure Engineer 题库"
---

# AI Infrastructure Engineer 题库

> 中文简称：AI Infrastructure Engineer 题库

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

---

## GPU 与集群基础 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | NVIDIA GPU 架构演进 (Volta→Ampere→Hopper→Blackwell) 的核心改进？ | ⭐⭐ | 🟡 |
| 2 | 解释 CUDA Core vs Tensor Core vs RT Core 的区别 | ⭐ | 🟡 |
| 3 | GPU 显存带宽 vs 计算 FLOPS：什么是 Memory-bound vs Compute-bound？ | ⭐⭐ | 🔴 |
| 4 | NVLink vs PCIe vs InfiniBand：GPU 间和节点间通信的差异？ | ⭐⭐ | 🔴 |
| 5 | 解释 GPU 的 SM (Streaming Multiprocessor) 和 Warp 调度机制 | ⭐⭐⭐ | 🟢 |
| 6 | MIG (Multi-Instance GPU) 的原理和适用场景？ | ⭐⭐ | 🟡 |
| 7 | 如何监控 GPU 利用率？nvidia-smi / DCGM / Prometheus 的使用 | ⭐ | 🔴 |
| 8 | 解释 FP32 / FP16 / BF16 / FP8 / INT8 精度对训练和推理的影响 | ⭐⭐ | 🔴 |
| 9 | H100 的 Transformer Engine 和 FP8 训练的原理？ | ⭐⭐⭐ | 🟡 |
| 10 | 如何做 GPU 集群的容量规划？TCO 如何估算？ | ⭐⭐⭐ | 🟡 |

## 分布式训练 (12 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 数据并行 (DDP) vs 模型并行 (TP/PP) vs 流水线并行的区别？ | ⭐⭐ | 🔴 |
| 2 | ZeRO 优化的三个阶段 (ZeRO-1/2/3) 分别优化什么？ | ⭐⭐ | 🔴 |
| 3 | DeepSpeed vs FSDP vs Megatron-LM 的区别和选型？ | ⭐⭐⭐ | 🟡 |
| 4 | 解释 All-Reduce / All-Gather / Reduce-Scatter 集合通信操作 | ⭐⭐ | 🔴 |
| 5 | 分布式训练中的通信瓶颈如何定位和优化？ | ⭐⭐⭐ | 🟡 |
| 6 | 混合精度训练 (AMP) 的原理？Loss Scaling 为什么必要？ | ⭐⭐ | 🔴 |
| 7 | 训练任务失败 (OOM/Crash) 后如何做 Checkpoint 恢复？ | ⭐⭐ | 🔴 |
| 8 | 如何做大规模训练的超参数搜索？Population Based Training | ⭐⭐⭐ | 🟢 |
| 9 | Flash Attention 的 IO-aware 优化思路？为什么能大幅加速？ | ⭐⭐⭐ | 🟡 |
| 10 | 解释 Gradient Accumulation 和 Gradient Checkpointing 的原理 | ⭐⭐ | 🟡 |
| 11 | 训练数据加载 (DataLoader) 的性能瓶颈如何排查和优化？ | ⭐⭐ | 🟡 |
| 12 | 多租户 GPU 集群的任务调度：Slurm / Kubernetes + GPU Operator | ⭐⭐ | 🔴 |

## 推理与部署 (12 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | vLLM 的 PagedAttention 原理？为什么比 HuggingFace 快数倍？ | ⭐⭐ | 🔴 |
| 2 | TensorRT-LLM 的优化策略：KV Cache / In-flight Batching / Quantization | ⭐⭐⭐ | 🟡 |
| 3 | SGLang 的 RadixAttention 和 Prefix Caching 是什么？ | ⭐⭐⭐ | 🟡 |
| 4 | 解释 Continuous Batching vs Static Batching 的区别 | ⭐⭐ | 🔴 |
| 5 | 模型量化方法对比：GPTQ vs AWQ vs GGUF vs SmoothQuant | ⭐⭐ | 🔴 |
| 6 | 推理引擎选型：vLLM vs TensorRT-LLM vs SGLang vs llama.cpp | ⭐⭐ | 🔴 |
| 7 | 如何设计 LLM 推理服务的自动扩缩容？HPA vs KEDA | ⭐⭐⭐ | 🟡 |
| 8 | Speculative Decoding 的原理和适用条件？ | ⭐⭐⭐ | 🟡 |
| 9 | KV Cache 的内存管理：PagedAttention vs 分层 KV Cache | ⭐⭐⭐ | 🟡 |
| 10 | 如何做模型的多副本负载均衡？路由策略设计 | ⭐⭐ | 🟡 |
| 11 | 边缘推理方案对比：ONNX Runtime / TensorRT / Core ML / TFLite | ⭐⭐ | 🟡 |
| 12 | 推理延迟的 SLA 如何设计？P50/P95/P99 的含义 | ⭐ | 🔴 |

## MLOps 与平台 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 模型版本管理：MLflow / W&B / DVC 的选型和使用 | ⭐⭐ | 🔴 |
| 2 | 训练任务的可复现性如何保证？(环境/数据/代码 快照) | ⭐⭐ | 🟡 |
| 3 | 如何设计一个自助模型训练平台？(用户提交任务→自动调度→结果交付) | ⭐⭐⭐ | 🟡 |
| 4 | 模型服务的灰度发布和金丝雀部署如何做？ | ⭐⭐ | 🔴 |
| 5 | GPU 集群的成本优化：Spot Instance / 混合调度 / 利用率提升 | ⭐⭐⭐ | 🟡 |
| 6 | Kubernetes GPU 调度：Device Plugin / GPU Sharing / MIG | ⭐⭐ | 🔴 |
| 7 | 训练数据管道的自动化：数据版本化 + 质量校验 + 增量更新 | ⭐⭐⭐ | 🟢 |
| 8 | 如何构建端到端的 ML CI/CD Pipeline？ | ⭐⭐⭐ | 🟡 |

## 编程与实战 (5 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 用 PyTorch DDP 写一个多 GPU 训练脚本 | ⭐⭐ | 🔴 |
| 2 | 用 DeepSpeed ZeRO-2 配置一个 7B 模型训练 | ⭐⭐ | 🟡 |
| 3 | 用 vLLM 部署一个 OpenAI 兼容的 LLM 推理服务 | ⭐ | 🔴 |
| 4 | 编写 Kubernetes HPA 实现 GPU 推理服务的自动扩缩容 | ⭐⭐ | 🟡 |
| 5 | 写一个 GPU 集群监控 Dashboard (Grafana + Prometheus) | ⭐⭐ | 🟢 |

## K8s for AI 专项 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | Kubernetes 中 GPU 调度的完整链路：Device Plugin → kube-scheduler → Pod | ⭐⭐ | 🔴 |
| 2 | GPU Operator 的作用是什么？驱动、容器运行时、Device Plugin 如何协同？ | ⭐⭐ | 🔴 |
| 3 | HAMi 与 MIG、Time Slicing 的 GPU 共享方案如何选择？ | ⭐⭐⭐ | 🟡 |
| 4 | 如何在 K8s 上运行一个 PyTorchJob？写出 YAML 关键字段 | ⭐⭐ | 🔴 |
| 5 | Volcano 调度器相比默认 scheduler 在 AI 训练场景有哪些增强？ | ⭐⭐⭐ | 🟡 |
| 6 | 训练 Pod 出现 OOMKilled，如何区分是主机内存还是 GPU 显存？ | ⭐⭐ | 🔴 |
| 7 | NCCL Socket / IB 网络在 K8s 中如何配置？Network Operator 的作用？ | ⭐⭐⭐ | 🟢 |
| 8 | KServe 与原生 Deployment 部署 LLM 推理服务的区别？ | ⭐⭐ | 🟡 |
| 9 | 如何在 K8s 中实现推理服务的金丝雀发布和 A/B 测试？ | ⭐⭐⭐ | 🟡 |
| 10 | 多租户 AI 集群的配额、优先级、抢占如何设计？ | ⭐⭐⭐ | 🟢 |

## LLM 训练/推理排障专项 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | LLM 微调任务在 K8s 中失败，你的排查总线是什么？ | ⭐⭐ | 🔴 |
| 2 | 分布式训练 NCCL timeout / hang，如何定位是网络、驱动还是代码问题？ | ⭐⭐⭐ | 🔴 |
| 3 | GPU OOM 在训练与推理场景下的根因差异？如何修复？ | ⭐⭐ | 🔴 |
| 4 | LLM 推理 TTFT/TPOT 突然升高，K8s 侧和引擎侧分别看什么？ | ⭐⭐ | 🔴 |
| 5 | KV Cache 爆显存，可以从哪些方向优化？ | ⭐⭐⭐ | 🟡 |
| 6 | 训练任务 checkpoint 写入慢导致 GPU 空闲，如何优化？ | ⭐⭐⭐ | 🟡 |
| 7 | 推理服务 HPA 触发频繁但效果差，可能是什么原因？ | ⭐⭐ | 🟡 |
| 8 | 模型热加载后输出乱码或崩溃，如何回滚与定位？ | ⭐⭐ | 🟡 |

## 阿里云/AI Stack/PAI 专项 (7 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 阿里云专有云 ACK 专有版 vs 敏捷版在 AI 场景如何选择？ | ⭐⭐ | 🟡 |
| 2 | PAI-DLC 任务失败，如何联动 PAI 控制台和 ACK 排查？ | ⭐⭐ | 🔴 |
| 3 | AI Stack 一体机中，训练任务如何通过 torchrun / swift / deepspeed 启动？ | ⭐⭐ | 🟡 |
| 4 | 专有云环境中 MLflow Tracking Server 不可达，分层排查思路？ | ⭐⭐ | 🟡 |
| 5 | 天基、ASCM、洛神、盘古在 AI 工单中分别管什么？ | ⭐⭐ | 🔴 |
| 6 | 国产化推理场景中，昇腾/寒武纪/海光/摩尔线程如何接入 ACK？ | ⭐⭐⭐ | 🟢 |
| 7 | 阿里云 AI Stack 的模型管理、GPU 监控、推理服务如何与 ACK 集成？ | ⭐⭐ | 🟡 |

---

## Related

- [[21_面试岗位/AI_Infrastructure_Engineer/company_level_question_bank|AI Infrastructure Engineer 按公司/级别区分的题库]]
- [[21_面试岗位/04_AI基础设施工程师/03_interview_answers|AI Infrastructure Engineer 面试题实例答案]]
- [[21_面试岗位/04_AI基础设施工程师/04_interview_preparing|AI Infrastructure Engineer 面试准备]]
- [[21_面试岗位/README|AI 面试准备 (Interviews)]]
- [[21_面试岗位/18_面试指南/05_jobs|AI 相关岗位与工种清单]]
---
title: AI Infrastructure Engineer 题库
category: 21-interviews-ai-infrastructure-engineer
tags: ["interviews", "career", "experience", "practitioners"]
summary: "分布式系统常见一致性问题有哪些？"
created: 2026-05-31
updated: 2026-06-04
tier: supporting
aliases:
  - "Question Bank"
  - "question bank"
  - question_bank

---
# AI Infrastructure Engineer 题库

## 基础
- 分布式系统常见一致性问题有哪些？
- 存储与网络对训练性能的影响？
- GPU/CPU 资源调度的关键指标？

## 项目
- 描述一个训练平台或集群建设项目。
- 如何优化 I/O 与数据管道？
- 如何保障多租户隔离与稳定性？

## 系统设计
- 设计一个大规模训练集群架构。
- 资源调度与配额管理如何实现？
- 监控与告警体系如何设计？

## 案例
- 训练集群出现性能退化如何排查？
- 节点频繁故障如何处理？
- 数据管道瓶颈导致训练停滞怎么办？

---
*Last updated: 2026-06-04*

## Related

- [[21_面试岗位/AI_Infrastructure_Engineer/company_level_question_bank|AI Infrastructure Engineer 按公司/级别区分的题库]]
- [[21_面试岗位/04_AI基础设施工程师/03_interview_answers|AI Infrastructure Engineer 面试题实例答案]]
- [[21_面试岗位/04_AI基础设施工程师/04_interview_preparing|AI Infrastructure Engineer 面试准备]]
- [[21_面试岗位/README|AI 面试准备 (Interviews)]]
- [[21_面试岗位/18_面试指南/05_jobs|AI 相关岗位与工种清单]]

## 面试核心知识框架

| 知识域 | 核心要点 | 考察频率 | 准备优先级 |
|--------|----------|----------|------------|
| 基础理论 | 核心概念/原理/公式 | 每轮必考 | P0 |
| 工程实践 | 设计模式/最佳实践 | 高频 | P0 |
| 系统设计 | 架构/扩展/权衡 | 中高频 | P1 |
| 项目经验 | 难点/方案/成果 | 每轮必问 | P0 |
| 前沿趋势 | 新技术/新方向 | 中频 | P2 |
| 软技能 | 沟通/协作/领导力 | 行为面 | P1 |

## 高频问题与应答策略

| 问题类型 | 典型问题 | 应答策略 |
|----------|----------|----------|
| 概念题 | 解释XX的原理 | 定义+原理+应用+对比 |
| 对比题 | A和B的区别 | 维度对比+适用场景+选型建议 |
| 设计题 | 设计一个XX系统 | 需求分析+架构+权衡+扩展 |
| 经验题 | 遇到的最大挑战 | STAR法则+量化成果+反思 |
| 开放题 | 如何看待XX趋势 | 现状+分析+判断+行动 |

## 面试评分维度

| 维度 | 优秀表现 | 一般表现 | 不佳表现 |
|------|----------|----------|----------|
| 技术深度 | 深入原理+举一反三 | 知道概念但浅 | 概念模糊/错误 |
| 编码能力 | 最优解+代码整洁 | 可行解但非最优 | 无法完成/bug多 |
| 系统思维 | 全面考虑+合理权衡 | 基本方案可行 | 忽略关键约束 |
| 表达能力 | 逻辑清晰+重点突出 | 能表达但冗长 | 混乱/答非所问 |
| 学习潜力 | 快速理解+主动探索 | 需要提示能跟上 | 无法理解新概念 |

## 面试准备资源

| 资源类型 | 推荐 | 用途 |
|----------|------|------|
| 算法平台 | LeetCode/Codeforces | 编码能力训练 |
| 系统设计 | System Design Primer | 架构思维培养 |
| 技术书籍 | 岗位相关经典书籍 | 深度理解 |
| 技术博客 | 目标公司工程博客 | 了解技术栈 |
| Mock平台 | Pramp/interviewing.io | 模拟实战 |

## 检查清单

- [ ] 核心知识点已系统复习
- [ ] 高频算法题型已熟练掌握
- [ ] 项目案例已深度准备
- [ ] 系统设计方法论已掌握
- [ ] 目标岗位JD已仔细研究
- [ ] 面试问题已模拟回答
- [ ] 心态调整到位
