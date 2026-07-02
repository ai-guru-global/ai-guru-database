---
title: 'AI 系统 SRE Runbook (AI SRE Runbook)'
category: '12-architecture-infrastructure'
tags: ["sre", "reliability", "gpu", "kubernetes", "observability", "incident-response", "capacity-planning"]
summary: '> **一句话理解**: AI 系统 SRE Runbook 是生产环境的"作战手册"——通过定义 SLO/SLI、容量规划、事故响应、模型回滚、灾备和可观测性体系，让 AI Infra 团队在面对 GPU 故障、模型异常和流量突增时能够按 playbook 稳定止损。'
created: '2026-07-02'
updated: '2026-07-02'
tier: production
aliases:
  - "AI SRE Runbook"
  - AI_SRE_Runbook
sources: []
---

# AI 系统 SRE Runbook (AI SRE Runbook)

> **一句话理解**: AI 系统 SRE Runbook 是生产环境的"作战手册"——通过定义 SLO/SLI、容量规划、事故响应、模型回滚、灾备和可观测性体系，让 AI Infra 团队在面对 GPU 故障、模型异常和流量突增时能够按 playbook 稳定止损。

> **适用读者**: AI Infra 工程师、SRE、平台负责人、On-call 值班人员。

---

## 目录

1. [AI SRE 与传统 SRE 的差异](#1-ai-sre-与传统-sre-的差异)
2. [SLO / SLI 体系](#2-slo--sli-体系)
3. [GPU 集群容量规划模型](#3-gpu-集群容量规划模型)
4. [On-call 与事故响应](#4-on-call-与事故响应)
5. [模型回滚与热切换策略](#5-模型回滚与热切换策略)
6. [灾备 RTO / RPO 设计](#6-灾备-rto--rpo-设计)
7. [可观测性三板斧](#7-可观测性三板斧)
8. [生产就绪检查清单](#8-生产就绪检查清单)
9. [持续运营与文化](#9-持续运营与文化)

---

## 1. AI SRE 与传统 SRE 的差异

AI 服务将传统 SRE 的复杂度从"请求-响应"扩展到了"模型-加速器-长上下文-成本"四维空间。以下是关键差异：

| 维度 | 传统 Web SRE | [[_concepts/ai-sre|AI SRE]] |
|------|-------------|--------|
| **核心资源** | CPU、内存、带宽 | GPU、显存、HBM、NVLink/RDMA 带宽 |
| **启动时间** | 秒级 | 分钟级（大模型权重加载、KV Cache 预热） |
| **延迟构成** | 网络 + 业务逻辑 | 排队 + 推理计算 + Token 生成 + 解码 |
| **故障模式** | 进程崩溃、OOM | GPU ECC 错误、CUDA OOM、NCCL 超时、模型幻觉导致业务异常 |
| **成本敏感度** | 相对稳定 | Token 级计费、GPU 按秒计费、 spot 实例波动 |
| **版本管理** | 代码 + 配置 | 模型权重、Prompt、LoRA、推理引擎、运行时多版本并存 |
| **可观测性** | RED 指标 | RED + Token 指标 + GPU 指标 + 模型质量指标 |

基于这些差异，AI SRE 必须将**模型生命周期**、**GPU 健康度**、**成本效率**与**生成质量**纳入同一套可靠性框架。传统 SRE 的"稳态"假设在 AI 场景下往往失效：同一模型在不同输入长度、不同批大小、不同温度参数下的资源消耗可能相差数倍，因此容量规划和告警阈值必须围绕 Token 特征动态建模，而非简单按 QPS 线性估算。

AI SRE 团队通常需要与 ML 工程师、数据工程师、安全工程师和成本运营（FinOps）团队紧密协作。SRE 不再只是"保证服务不挂"，而是要保证**模型以可预期的质量、成本和延迟持续为用户创造价值**。

---

## 2. SLO / SLI 体系

### 2.1 AI 服务 SLI 定义

SLI（Service Level Indicator）必须可量化、可观测、与用户感知强相关。AI 服务建议至少定义以下五类 SLI：

| SLI 类别 | 指标 | 说明 | 典型采集方式 |
|---------|------|------|-------------|
| **延迟** | TTFT（Time To First Token） | 首 Token 返回时间，决定用户"开始等待"体验 | 网关层埋点 |
| **延迟** | TPOT（Time Per Output Token） | 解码阶段每 Token 耗时，决定流式体验 | 推理引擎暴露 |
| **延迟** | E2E Latency | 端到端总耗时 | APM Trace |
| **吞吐** | QPS / RPS | 每秒请求数 | 网关 / Ingress |
| **吞吐** | Tokens/s | 生成 Token 速率 | vLLM / SGLang metrics |
| **可用性** | 服务成功率 | 非 5xx 且非业务失败请求占比 | 网关日志 |
| **可用性** | 模型加载成功率 | 新模型版本上线时成功加载比例 | 部署流水线 |
| **成本** | $/1K Tokens | 每千 Token 推理成本 | FinOps 标签 |
| **成本** | GPU 利用率 | 计算利用率 vs 显存利用率 | DCGM / Prometheus |
| **质量** | 幻觉率 / 有害输出率 | 安全护栏拦截或用户反馈比例 | Guardrails + 反馈队列 |

在选择 SLI 时，要避免"虚荣指标"陷阱。例如，单独看 GPU 利用率高低并不能说明服务质量：利用率过低可能是资源浪费，利用率过高可能是排队恶化。真正值得关注的是**利用率与延迟的联合分布**，以及单位成本下能够支撑的 Token 吞吐。

### 2.2 SLO 示例

以企业级 Chat 服务为例：

| SLO | 目标 | 测量窗口 |  burn rate |
|-----|------|---------|-----------|
| TTFT P99 < 800 ms | 99% | 28 天 | 14.4（2% 错误预算 6 小时耗尽） |
| E2E Latency P99 < 8 s | 99% | 28 天 | 14.4 |
| 服务可用性 > 99.95% | 99.95% | 28 天 | 14.4 |
| 成功率 > 99.9% | 99.9% | 28 天 | 14.4 |
| 有害输出率 < 0.01% | 99.99% | 28 天 | 14.4 |

SLO 目标不是越高越好。每提升一个"9"，基础设施和运维成本通常呈指数级增长。建议与产品、业务方共同召开 SLO 工作坊，明确不同等级用户的体验预期：付费企业客户可能需要 99.95% 可用性，而免费试用用户可以接受到 99.9%。

### 2.3 错误预算与告警策略

错误预算（Error Budget）用于在 SLO 接近阈值时触发冻结发布或启动降级。推荐采用 multi-window、multi-burn-rate 告警：

```yaml
# Prometheus 告警规则示例
groups:
  - name: ai-sre-slo
    rules:
      - alert: AITTFTBurnRateHigh
        expr: |
          (
            sum(rate(ai_ttft_seconds_bucket{le="0.8"}[1h])) /
            sum(rate(ai_ttft_seconds_count[1h])) < 0.99
          and
            sum(rate(ai_ttft_seconds_bucket{le="0.8"}[5m])) /
            sum(rate(ai_ttft_seconds_count[5m])) < 0.95
          )
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "AI TTFT burn rate 超过 14.4，错误预算将在 6 小时内耗尽"
```

### 2.4 SLO 治理流程

- **每月 SLO 评审会**: 复盘上月错误预算消耗，识别"慢性出血"指标。
- **发布冻结策略**: 当错误预算消耗超过 50% 时，暂停非必要发布；超过 80% 时，仅允许 P0 修复。
- **SLI 基线漂移检测**: 随着模型版本和硬件升级，历史基线可能不再适用，每季度校准一次阈值。

### 2.5 SLO 制定工作坊

建议按以下步骤组织跨团队工作坊，确保 SLO 既反映用户真实体验，又具备工程可实现性：

1. **用户旅程映射**: 列出核心用户路径，例如"发起对话"、"上传文档 RAG"、"调用代码助手"。
2. **痛点优先级排序**: 通过客服反馈、NPS、监控数据识别最影响体验的环节。
3. **候选 SLI 提案**: 每个环节提出 1-2 个可观测指标，避免指标过多导致注意力分散。
4. **目标值谈判**: 结合历史数据与业务期望，确定 P50/P95/P99 目标。
5. **错误预算计算**: 明确 28 天或 30 天窗口内的错误预算，并配置 burn rate 告警。
6. **Runbook 配套**: 每个 SLO 都对应一份异常处理 Runbook。
7. **定期复审**: 每季度根据业务变化调整 SLO。

---

## 3. GPU 集群容量规划模型

### 3.1 容量规划公式

GPU 集群容量规划需要同时满足**延迟约束**和**吞吐约束**，取两者较大值：

```
所需 GPU 数 = max(
  GPU_for_latency,
  GPU_for_throughput,
  GPU_for_redundancy
)
```

其中：

- **GPU_for_throughput** = `目标 QPS × 平均 tokens/请求 / 单 GPU 每秒 tokens`
- **GPU_for_latency** = `1 / (目标 TTFT × 单 GPU 可并发请求数)`（满足首 Token 响应）
- **GPU_for_redundancy** = 按可用区、故障域、N+1 冗余预留

### 3.2 显存估算要点

大模型推理的显存占用主要由三部分组成：

1. **模型权重**: 参数量 × 精度字节数。例如 70B 模型以 FP16 加载约需 140 GB。
2. **KV Cache**: `2 × 层数 × batch_size × 序列长度 × 隐藏维度 × 精度字节数`。
3. **激活值与开销**: 通常预留 10%-20% 的显存余量应对 CUDA context 和临时张量。

实际规划中，建议使用 80% 作为显存利用率上限，避免推理过程中因输入变长导致 OOM。

### 3.3 容量规划配置示例

以下 Prometheus Recording Rule 用于持续跟踪容量饱和度：

```yaml
# capacity_saturation.rules
groups:
  - name: ai_capacity
    interval: 30s
    rules:
      - record: ai:gpu_utilization:avg5m
        expr: avg_over_time(nvidia_gpu_utilization_gpu[5m])

      - record: ai:request_qps:rate1m
        expr: sum(rate(ai_requests_total[1m]))

      - record: ai:tokens_per_second:rate1m
        expr: sum(rate(ai_generated_tokens_total[1m]))

      - record: ai:capacity_saturation_ratio
        expr: |
          (
            ai:request_qps:rate1m * avg(ai_request_tokens_total) /
            (ai:gpu_count * ai:gpu_max_tokens_per_second)
          )

      - alert: GPUCapacitySaturationHigh
        expr: ai:capacity_saturation_ratio > 0.75
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "GPU 容量饱和度超过 75%，建议触发扩容评审"
```

### 3.4 容量规划决策表

| 场景 | 关键输入 | 决策动作 | 触发条件 |
|-----|---------|---------|---------|
| **日常增长** | 周环比 QPS、Token 增长 | HPA 扩容 | 饱和度 > 60% 持续 1h |
| **活动峰值** | 营销/发布日历 | 提前预热池、预扩容 | 事前 24h |
| **模型升级** | 新模型吞吐/显存需求 | 灰度替换、双跑对比 | 发布窗口 |
| **GPU 故障** | 坏卡数量、AZ 分布 | 驱逐 + 跨 AZ 补充 | DCGM 报错 |
| **成本约束** | 月度预算 | 缩容、切换 spot | 预算消耗 > 80% |

### 3.5 GPU 选型与多租户考量

不同 GPU 在推理场景下的性价比差异显著。以下是常见选型参考：

| GPU | 显存 | 内存带宽 | 适用场景 | 注意事项 |
|-----|------|---------|---------|---------|
| H100-80GB | 80 GB | 3.35 TB/s | 大模型推理、高并发 | 成本高，适合生产主路径 |
| A100-80GB | 80 GB | 2.0 TB/s | 主流大模型推理、训练 | 性价比高，部署广泛 |
| A100-40GB | 40 GB | 1.56 TB/s | 中小模型、开发测试 | 显存受限，不适合长上下文 |
| L40S-48GB | 48 GB | 864 GB/s | 推理、图形渲染混合 | 无 NVLink，多卡扩展受限 |
| RTX 4090-24GB | 24 GB | 1.0 TB/s | 小规模 PoC、边缘 | 不支持多机 RDMA |

在多租户场景下，还需要考虑 GPU 虚拟化与隔离方案，例如 MIG、HAMi 或 vGPU，避免一个租户的长上下文请求挤占其他租户资源。

### 3.6 容量规划常见误区

- **只看 QPS 不看 Token**: 长上下文请求的资源消耗可能是短请求的 10 倍以上。
- **忽视批大小上限**: 增大 batch size 能提升吞吐，但会显著增加 TTFT。
- **线性外推**: AI 流量常受产品功能、营销活动、模型能力突变影响，线性预测容易失真。
- **未预留故障余量**: 单 AZ 故障时，剩余 AZ 必须能承接全部流量，否则冗余设计只是"纸面安全"。
- **忽略冷启动时间**: 大模型加载和预热可能需要数分钟，扩容决策必须提前触发。

---

## 4. On-call 与事故响应

### 4.1 事故分级

| 级别 | 定义 | 响应时间 | 处理目标 | 示例 |
|-----|------|---------|---------|------|
| **P0** | 生产完全不可用或核心 AI 能力中断 | 5 分钟内响应 | 30 分钟内止血 | 所有 AZ 的 LLM 服务返回 5xx、GPU 集群全部离线 |
| **P1** | 主要功能受损、部分用户受影响 | 15 分钟内响应 | 1 小时内恢复 | 单模型版本异常、某可用区推理延迟飙升 |
| **P2** | 非核心功能降级或潜在风险 | 1 小时内响应 | 4 小时内恢复 | 监控误报率升高、成本异常波动 |
| **P3** | 一般性问题或优化项 | 下一个工作日 | 按排期处理 | 文档缺失、低优告警清理 |

### 4.2 事故响应流程

```
检测（Alert / 用户反馈 / 监控面板）
  │
  ▼
分级（P0/P1/P2/P3，依据影响范围与 SLA）
  │
  ▼
止损（隔离、回滚、降级、扩容、切流量）
  │
  ▼
调查（保留现场：日志、Trace、GPU 状态、模型版本）
  │
  ▼
修复（根因修复或临时补丁）
  │
  ▼
验证（SLO 恢复、回归测试）
  │
  ▼
复盘（24h 内完成 Postmortem，更新 Runbook）
```

### 4.3 On-call 响应模板

```markdown
# Incident: {{ incident_id }}

- **级别**: P0 / P1 / P2 / P3
- **发现时间**: {{ timestamp }}
- **影响服务**: {{ service_name }}
- **影响范围**: {{ user_count }} 用户 / {{ az }} 可用区
- **当前 SLO 影响**: {{ error_budget_burn }}
- **指挥者 (IC)**: {{ commander }}
- **沟通频道**: {{ slack_channel }}

## 已执行止血动作
1. {{ action_1 }}
2. {{ action_2 }}

## 下一步
- {{ next_step }}

## 根因假设
- {{ hypothesis }}
```

### 4.4 常见故障 Runbook 速查

| 故障现象 | 可能根因 | 止血动作 | 排查命令 |
|---------|---------|---------|---------|
| 推理延迟突增 | GPU 利用率饱和、批大小过大、长上下文请求暴增 | 扩容、限流、切流量 | `nvidia-smi dmon`、`curl /metrics` |
| CUDA OOM | KV Cache 过长、批大小过大、显存碎片 | 降低 batch size、限制 max_tokens | Pod 日志、DCGM 显存指标 |
| NCCL 超时 | RDMA/RoCE 网络抖动、拓扑变更 | 重启分布式任务、切到健康节点 | `ibdiagnet`、`nccl-tests` |
| GPU ECC 错误 | 硬件故障或驱动问题 | 驱逐 Pod、标记节点不可调度 | `nvidia-smi -q -d ECC`、`dcgmi diag -r 3` |
| 模型加载失败 | 权重文件损坏、显存不足、格式不兼容 | 回滚到上一版本、检查 checksum | Pod 启动日志、对象存储访问日志 |
| 幻觉/有害输出激增 | Prompt 注入、护栏失效、模型版本退化 | 开启严格护栏、回滚模型 | Guardrails 日志、用户反馈队列 |

### 4.5 沟通与升级机制

- **内部沟通**: 建立固定的事故响应 Slack 频道或飞书群，IC 每 15 分钟同步一次进展。
- **外部沟通**: P0/P1 事故需在 30 分钟内向客户/业务方发送初步公告，包含影响范围、预计恢复时间、规避方案。
- **升级链**: 一线 SRE → 二线平台工程师 → 架构师/研发负责人 → 管理层。超过处理目标未恢复时自动升级。

### 4.6 事故指挥官（Incident Commander）职责

每起 P0/P1 事故必须指定一名 IC，负责统筹协调而非直接执行所有操作：

- **信息整合**: 收集监控、日志、Trace、用户反馈，形成统一事实。
- **决策制定**: 决定何时回滚、何时扩容、何时切换流量。
- **沟通同步**: 每 15 分钟向内部团队和利益相关方同步进展。
- **资源调配**: 协调研发、安全、网络、云厂商支持团队。
- **复盘主导**: 组织 Postmortem，跟踪 Action Items 闭环。

---

## 5. 模型回滚与热切换策略

### 5.1 部署策略对比

| 策略 | 切换粒度 | 风险 | 回滚时间 | 适用场景 |
|-----|---------|------|---------|---------|
| **滚动更新** | Pod 级 | 中 | 分钟级 | 小模型、无状态服务 |
| **蓝绿部署** | 服务级 | 低 | 秒级（DNS/LB 切换） | 大模型、需要快速回滚 |
| **金丝雀** | 流量百分比 | 低 | 秒级 | 新模型效果验证 |
| **A/B 测试** | 用户/请求维度 | 低 | 配置级 | 模型质量对比 |

### 5.2 模型热切换配置示例

使用 KServe / vLLM + Gateway 实现金丝雀发布：

```yaml
# model_canary.yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: llm-chat
  namespace: ai-services
  annotations:
    serving.kserve.io/canaryTrafficPercent: "10"
spec:
  predictor:
    canary:
      model:
        modelFormat:
          name: huggingface
        storageUri: s3://models/llm-chat/v2.1
        resources:
          limits:
            nvidia.com/gpu: "1"
    model:
      modelFormat:
        name: huggingface
      storageUri: s3://models/llm-chat/v2.0
      resources:
        limits:
          nvidia.com/gpu: "1"
```

### 5.3 回滚决策树

```
新模型上线
  │
  ├─ 健康检查通过？
  │    ├─ 否 → 立即回滚到上一个稳定版本
  │    └─ 是 → 进入金丝雀观察
  │
  ├─ 金丝雀指标异常？（延迟↑ / 错误率↑ / 有害输出↑）
  │    ├─ 是 → 回滚并保留现场样本
  │    └─ 否 → 逐步提高流量比例
  │
  └─ 全量后 2h 内无异常 → 标记为新基线
```

### 5.4 模型版本治理

- **模型注册表**: 使用 MLflow、ModelScope 或自研注册表记录每个版本的训练数据、评估指标、部署历史。
- **Prompt 版本化**: Prompt 与模型版本解耦，避免模型回滚时连带回滚业务逻辑。
- **LoRA 与适配器管理**: 多租户场景下，LoRA 适配器应支持动态加载/卸载，回滚时只切换对应适配器。

---

## 6. 灾备 RTO / RPO 设计

### 6.1 灾备策略矩阵

| 策略 | RTO | RPO | 成本系数 | 适用场景 |
|-----|-----|-----|---------|---------|
| **备份恢复** | 小时级 ~ 天级 | 小时级 | 1.05x | 开发/测试模型 |
| **Pilot Light** | 15-60 min | 分钟级 ~ 小时级 | 1.2x | 非核心推理服务 |
| **Warm Standby** | 5-15 min | < 1 min | 1.5x | 企业级 Chat / API |
| **Active-Active** | < 1 min | ~ 0 | 2x+ | 金融、医疗、自动驾驶 |

### 6.2 RTO / RPO 目标设计

以多区域企业级 LLM 服务为例：

| 组件 | RTO | RPO | 实现方式 |
|-----|-----|-----|---------|
| 推理服务 | < 5 min | N/A（无状态） | 多 AZ + 多区域副本 + Global LB |
| KV Cache / 会话状态 | < 5 min | < 30 s | Redis Cluster 跨区复制 |
| 向量数据库 | < 10 min | < 1 min | Milvus / Pinecone 跨区域副本 |
| 模型权重 | < 15 min | N/A | 对象存储多区域复制 + P2P 分发 |
| 配置 / Prompt | < 1 min | ~ 0 | GitOps + 多区域 ConfigMap |
| 审计日志 | N/A | < 5 min | 日志代理异步复制 |

### 6.3 灾备切换脚本示例

```bash
#!/bin/bash
# failover_region.sh

PRIMARY_REGION="cn-beijing"
DR_REGION="cn-shanghai"
SERVICE="llm-inference"

# 1. 检查主区域健康
if ! curl -fsS "https://${PRIMARY_REGION}.ai.example/health" > /dev/null; then
  echo "Primary region ${PRIMARY_REGION} unhealthy, initiating failover..."

  # 2. 提升 DR 区域权重
  kubectl patch ingress ${SERVICE} \
    --patch "{\"metadata\":{\"annotations\":{\"alb.ingress.kubernetes.io/weights\":\"{\\\"${DR_REGION}\\\":100,\\\"${PRIMARY_REGION}\\\":0}\"}}}"

  # 3. 扩容 DR 区域副本
  kubectl scale deployment ${SERVICE} -n ai-services --replicas=8 --context ${DR_REGION}

  # 4. 触发告警
  curl -X POST https://pagerduty.example/integration-key \
    -H "Content-Type: application/json" \
    -d "{\"severity\":\"critical\",\"summary\":\"AI region failover: ${PRIMARY_REGION} -> ${DR_REGION}\"}"
fi
```

### 6.4 备份策略与数据一致性

- **模型权重备份**: 对象存储版本控制 + 异地复制，定期进行 checksum 校验。
- **配置与 Prompt 备份**: 使用 Git 仓库作为单一事实来源，所有变更通过 PR 合并并自动同步到多区域。
- **向量索引备份**: 定期快照向量数据库索引，确保灾难恢复时无需重新做完整 Embedding。
- **会话状态一致性**: 强一致性要求高的场景使用 Redis Cluster 或分布式 KV 的同步复制；最终一致性场景允许秒级 RPO。

---

## 7. 可观测性三板斧

### 7.1 Metrics：量化系统状态

AI 服务需要分层 metrics：

| 层级 | 关键指标 | 采集源 |
|-----|---------|--------|
| **业务层** | QPS、成功率、TTFT、TPOT、E2E Latency、Token 数 | Gateway / APM |
| **模型层** | 模型加载时间、批次大小、KV Cache 命中率、显存占用 | vLLM / TGI / SGLang |
| **基础设施层** | GPU 利用率、显存、温度、功耗、ECC 错误、NCCL 延迟 | DCGM Exporter / Node Exporter |
| **成本层** | $/1K tokens、GPU 小时、spot 中断率 | FinOps 平台 |
| **质量层** | 护栏拦截率、幻觉率、用户反馈差评率 | Guardrails / 反馈系统 |

### 7.2 Logs：保留上下文与审计

日志必须支持**请求链路追踪**和**安全审计**：

```json
{
  "timestamp": "2026-07-02T08:15:30.123Z",
  "trace_id": "abc123",
  "span_id": "span-456",
  "service": "llm-inference",
  "model": "qwen-72b",
  "model_version": "v2.1.3",
  "user_id": "user_xxx",
  "request_tokens": 1024,
  "response_tokens": 256,
  "ttft_ms": 120,
  "total_latency_ms": 3200,
  "gpu_node": "gpu-node-07",
  "guardrail_decision": "pass",
  "sensitive_data_detected": false
}
```

### 7.3 Traces：端到端请求链路

AI 请求通常经过 Gateway → Router → 推理引擎 → 向量数据库 → 工具调用，Trace 需要覆盖：

- Prompt 渲染
- 向量检索
- 推理计算（prefill + decode）
- 工具/插件调用
- 后处理与护栏

```python
# OpenTelemetry 手动埋点示例
from opentelemetry import trace

tracer = trace.get_tracer("ai.inference")

def generate(request):
    with tracer.start_as_current_span("llm.generate") as span:
        span.set_attribute("model.name", request.model)
        span.set_attribute("model.version", request.version)
        span.set_attribute("request.tokens", request.prompt_tokens)

        with tracer.start_as_current_span("llm.prefill"):
            logits = model.prefill(request.prompt)

        with tracer.start_as_current_span("llm.decode"):
            output = model.decode(logits, max_tokens=request.max_tokens)

        span.set_attribute("response.tokens", len(output))
        return output
```

### 7.4 告警降噪与 On-call 效率

- **告警分层**: 将告警分为 page（立即响应）、ticket（工作时间内处理）、info（仅记录）。
- **相关性抑制**: 当 GPU 节点整体故障时，抑制该节点上所有 Pod 的单独告警，只触发节点级告警。
- **自动化初诊**: 使用 K8sGPT、HolmesGPT 等 AI SRE 工具对告警进行初步根因分析，缩短 MTTD。
- **值班疲劳监控**: 统计每位 On-call 工程师的告警数量和夜间唤醒次数，避免 burnout。

### 7.5 可观测性成本与 Cardinality 管理

AI 服务的高维度标签（如 user_id、model_version、gpu_node）容易导致 metrics cardinality 爆炸，进而拖垮 TSDB。建议：

- 对高基数标签进行采样或聚合，例如按租户等级而非单个 user_id 聚合。
- 设置 label 白名单，禁止随意添加新标签。
- 日志采样：对成功请求按 1% 采样，对错误请求全量保留。
- Trace 采样：对延迟异常、错误请求、金丝雀流量全量追踪，普通请求按 10% 采样。

---

## 8. 生产就绪检查清单

在将 AI 服务标记为 production-ready 之前，逐项确认：

### SLO / 容量

- [ ] 已定义 TTFT、TPOT、E2E Latency、成功率、可用性、成本 SLI
- [ ] 已配置 SLO Dashboard 与 multi-burn-rate 告警
- [ ] 已完成容量规划评审，明确扩容触发条件
- [ ] 已配置 HPA / VPA 或自定义推理调度器扩缩容
- [ ] 已预留 N+1 / 跨 AZ 冗余容量

### 事故响应

- [ ] 已建立 P0/P1/P2/P3 分级标准与响应时效
- [ ] 已建立 On-call 轮值与升级链
- [ ] 已准备常见故障 Runbook（GPU 故障、OOM、模型加载失败、NCCL 超时）
- [ ] 已进行至少一次 GameDay / 故障演练
- [ ] 已定义事故复盘模板与知识沉淀流程

### 模型部署

- [ ] 新模型上线必须走蓝绿 / 金丝雀 / A/B 流程
- [ ] 已配置自动回滚条件（错误率、延迟、有害输出阈值）
- [ ] 模型权重存储多副本，支持快速回滚
- [ ] Prompt / 配置已版本化并纳入 GitOps

### 灾备

- [ ] 已明确 RTO / RPO 目标并获得业务方确认
- [ ] 已配置跨区域模型权重同步
- [ ] 已配置会话状态 / KV Cache 持久化与复制
- [ ] 已测试灾备切换与回切流程
- [ ] 已定期演练数据恢复与模型重新加载

### 可观测性

- [ ] 已部署 Metrics / Logs / Traces 三支柱
- [ ] 已配置 GPU 健康监控（DCGM / ppu-smi / rocm-smi）
- [ ] 已配置模型质量监控（护栏拦截、用户反馈）
- [ ] 已配置成本监控与预算告警
- [ ] 关键告警已接入 PagerDuty / OpsGenie / 钉钉 / Slack

---

## 9. 持续运营与文化

### 9.1 GameDay 与混沌工程

定期开展故障演练是验证 Runbook 有效性的唯一方式。建议每季度至少进行一次 GameDay：

- 随机 kill 一个 GPU 节点，验证自动驱逐和调度。
- 人为注入高延迟，测试熔断和 Fallback。
- 模拟单 AZ 网络分区，验证跨区域切换。
- 注入异常 Token 分布，测试容量饱和告警。

### 9.2 Postmortem 文化

事故复盘不是追责会议，而是系统改进的输入。每起 P0/P1 事故应在 24 小时内完成 Postmortem，包含：

- 时间线（精确到分钟）
- 影响范围与 SLO 消耗
- 根因分析（使用 5 Whys 或鱼骨图）
- 已执行的止血动作
- 后续改进项（Action Items）与负责人
- Runbook 更新记录

### 9.3 知识沉淀

将事故案例、排查经验、优化方案沉淀为可检索的知识库。推荐使用结构化模板，便于 AI 助手在值班时快速检索相似案例，辅助决策。

---

## 参考资源

- [Google SRE Book](https://sre.google/sre-book/table-of-contents/)
- [NVIDIA DCGM](https://developer.nvidia.com/dcgm)
- [KServe Documentation](https://kserve.github.io/website/latest/)
- [OpenTelemetry](https://opentelemetry.io/)
- [AWS Well-Architected AI/ML Lens](https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/)

---

*Last updated: 2026-07-02*  
*Version: 1.0.0*

## Related

- [[13_AI_Ops/README|AI Ops：运维监控与自动化]]
- [[11_MLOps_Pipeline/README|MLOps Pipeline：模型生命周期与 CI/CD]]
- [[10_Deployment_Inference/README|部署与推理：推理优化基础]]
- [[12_Architecture_Infrastructure/Architecture_Overview/Capacity_Planning_2026|AI 系统容量规划指南]]
- [[12_Architecture_Infrastructure/Architecture_Overview/High_Availability_2026|AI 系统高可用架构设计]]
- [[12_Architecture_Infrastructure/Kubernetes_Observability_Stack|Kubernetes 可观测性栈]]
- [[_meta/Production_Safety_Policy|生产安全策略]] — 操作风险评估与安全规范
