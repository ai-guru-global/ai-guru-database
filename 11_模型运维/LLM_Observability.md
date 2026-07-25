---
title: LLM 可观测性 (LLM Observability)
category: 12-mlops
tags: ["llm-observability", "tracing", "langsmith", "arize", "monitoring"]
summary: "LLM 可观测性完整体系：追踪（Tracing）、评估监控、Prompt 版本管理、异常检测、主流工具（LangSmith/Arize/Phoenix/Langfuse）与 2026 生产实践。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

---
# LLM 可观测性 (LLM Observability)

## 1. 为什么需要 LLM 可观测性？

```
传统软件: 输入确定 → 输出确定 → 日志/指标/追踪
LLM 应用: 输入不确定 → 输出不确定 → 需要新范式

LLM 可观测性 = 追踪 + 评估 + 监控 + 调试

核心问题:
- 每次 LLM 调用发生了什么? (追踪)
- 输出质量是否在下降? (监控)
- 哪个 Prompt 版本效果更好? (实验)
- 出了 bug 怎么复现? (调试)
- 花了多少钱? (成本)
```

## 2. 追踪 (Tracing)

### 2.1 Trace 结构

```python
# LLM 应用 Trace 结构:

TRACE_EXAMPLE = {
    "trace_id": "abc-123",
    "spans": [
        {
            "name": "user_query",
            "input": "什么是量子计算?",
            "timestamp": "2026-07-21T10:00:00Z",
        },
        {
            "name": "retrieval",
            "input": "量子计算 定义",
            "output": ["doc1", "doc2", "doc3"],
            "latency_ms": 45,
            "metadata": {"top_k": 3, "score_threshold": 0.7},
        },
        {
            "name": "llm_call",
            "model": "gpt-4o",
            "input_tokens": 1250,
            "output_tokens": 380,
            "latency_ms": 2100,
            "cost_usd": 0.015,
            "prompt_version": "v2.3",
            "temperature": 0.7,
        },
        {
            "name": "post_processing",
            "output": "最终回答...",
            "latency_ms": 5,
        },
    ],
    "total_latency_ms": 2150,
    "total_cost_usd": 0.015,
    "user_id": "user_456",
    "session_id": "session_789",
}
```

### 2.2 实现

```python
# 使用 Langfuse (开源) 实现追踪:
from langfuse import Langfuse

langfuse = Langfuse(
    public_key="pk-...",
    secret_key="sk-...",
    host="https://cloud.langfuse.com"
)

# 自动追踪 (装饰器):
@langfuse.trace()
def answer_question(question: str, user_id: str):
    # 检索
    docs = retrieve(question)
    
    # LLM 调用
    response = llm.generate(
        prompt=build_prompt(question, docs),
        model="gpt-4o",
    )
    
    # 记录反馈
    langfuse.score(trace_id=trace.id, name="quality", value=0.9)
    
    return response

# 或使用 OpenTelemetry (标准化):
from opentelemetry import trace
from openinference.instrumentation.openai import OpenAIInstrumentor

OpenAIInstrumentor().instrument()
# 所有 OpenAI 调用自动追踪
```

## 3. 主流工具对比

| 工具 | 类型 | 特色 | 开源 | 价格 |
|------|------|------|------|------|
| LangSmith | SaaS | LangChain 生态/评估 | 否 | $39/月起 |
| Langfuse | 开源+SaaS | 最全面开源方案 | 是 | 免费/云 |
| Arize Phoenix | 开源 | 嵌入可视化/漂移 | 是 | 免费 |
| Weights & Biases | SaaS | 实验追踪 | 否 | $50/月起 |
| Helicone | 开源 | 代理层/简单 | 是 | 免费/云 |
| OpenLIT | 开源 | OTel 原生 | 是 | 免费 |

## 4. 监控告警

```python
LLM_MONITORING_ALERTS = {
    "质量监控": {
        "指标": "LLM-as-Judge 评分 / 用户反馈",
        "告警": "平均分 < 0.7 持续 10 分钟",
        "动作": "通知 + 自动回滚 Prompt",
    },
    "延迟监控": {
        "指标": "TTFT / 总延迟 P50/P99",
        "告警": "P99 > 10s",
        "动作": "扩容 / 降级",
    },
    "错误率": {
        "指标": "API 错误 / 超时 / 拒绝",
        "告警": "错误率 > 5%",
        "动作": "切换备用模型",
    },
    "成本监控": {
        "指标": "每小时/每天 token 消耗",
        "告警": "超出预算 150%",
        "动作": "限流 + 通知",
    },
    "漂移检测": {
        "指标": "输入/输出分布变化",
        "告警": "KL 散度 > 阈值",
        "动作": "触发重新评估",
    },
}
```

## 5. 交叉引用

- [[模型运维/|模型运维]]
- [[运维/Incident_Management/|事故管理]]
- [[测试/|测试]]
- [[概念/General/opentelemetry|OpenTelemetry]]
- [[概念/RAG/langfuse|Langfuse]]
- [[概念/RAG/langsmith|LangSmith]]

## MLOps核心流程对比

| 阶段 | 关键活动 | 工具链 | 质量指标 |
|------|----------|--------|----------|
| 数据管理 | 采集/清洗/标注/版本化 | DVC/LakeFS/Label Studio | 数据质量分/覆盖率 |
| 模型训练 | 实验管理/超参搜索/分布式训练 | MLflow/W&B/Ray | 收敛速度/最终精度 |
| 模型评估 | 离线评估/对比实验/偏差检测 | Great Expectations/Evidently | 准确率/公平性指标 |
| 模型部署 | 容器化/服务化/灰度发布 | K8s/Seldon/vLLM | 延迟/吞吐/可用性 |
| 模型监控 | 漂移检测/性能退化/告警 | Prometheus/Evidently/Grafana | 漂移分数/告警准确率 |
| 模型迭代 | A/B测试/自动重训/版本回滚 | Argo/Kubeflow/MLflow | 迭代周期/线上指标 |

## 运维关键指标体系

| 指标类别 | 具体指标 | 目标值 | 监控频率 |
|----------|----------|--------|----------|
| 可用性 | 服务可用率 | >99.9% | 实时 |
| 性能 | P99推理延迟 | <2s | 实时 |
| 质量 | 模型准确率 | >基线5% | 每日 |
| 漂移 | 数据/概念漂移分数 | <阈值 | 每小时 |
| 成本 | GPU利用率/每请求成本 | >80%利用率 | 每日 |
| 安全 | 对抗攻击检测率 | >95% | 实时 |

## 常见运维问题与解决方案

| 问题 | 根因 | 解决方案 | 预防措施 |
|------|------|----------|----------|
| 模型性能退化 | 数据分布漂移 | 触发重训/回滚 | 漂移监控+自动告警 |
| 推理延迟飙升 | 流量突增/资源不足 | 自动扩容+限流 | 容量规划+压测 |
| GPU OOM | 批处理过大/显存泄漏 | 减小batch/重启 | 显存监控+限制 |
| 数据管道中断 | 上游变更/格式错误 | Schema验证+告警 | 契约测试+版本化 |
| 模型版本混乱 | 缺乏版本管理 | MLflow统一注册 | 强制版本化流程 |

## 模型生命周期管理

| 阶段 | 状态 | 关键操作 | 负责人 |
|------|------|----------|--------|
| 开发 | Staging | 训练+评估+注册 | ML工程师 |
| 验证 | Validating | 集成测试+性能测试 | QA+ML工程师 |
| 发布 | Released | 灰度发布+监控 | MLOps工程师 |
| 运行 | Active | 监控+维护+告警 | SRE+MLOps |
| 退役 | Archived | 流量切换+归档 | MLOps工程师 |

## 自动化运维实践

| 实践 | 实现方式 | 收益 |
|------|----------|------|
| CI/CD for ML | 自动化训练-评估-部署流水线 | 迭代速度提升5x |
| 自动重训 | 漂移触发+定时触发 | 模型始终保持最新 |
| 自动扩缩容 | HPA基于QPS/GPU利用率 | 成本优化30-50% |
| 自动回滚 | 指标异常自动切回旧版本 | 故障恢复<5min |
| 自动告警 | 多级告警+智能降噪 | 减少误报80% |

## 学习路径建议

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | MLOps概念+基础工具 | 1-2周 | 理解全流程 |
| 基础 | 模型部署+基础监控 | 2-3周 | 能部署和监控模型 |
| 进阶 | 自动化流水线+漂移检测 | 3-4周 | 构建CI/CD流水线 |
| 实战 | 生产级运维体系 | 4-6周 | 独立运维能力 |
| 精通 | 平台化+规模化运维 | 持续 | 技术领导力 |

## 术语速查表

| 术语 | 含义 |
|------|------|
| MLOps | 机器学习运维(ML+DevOps) |
| Model Drift | 模型性能随时间退化 |
| Data Drift | 输入数据分布变化 |
| Concept Drift | 目标关系变化 |
| Canary Release | 金丝雀发布(小流量验证) |
| Blue-Green | 蓝绿部署(双环境切换) |
| Feature Store | 特征存储(统一管理特征) |
| Model Registry | 模型注册中心(版本管理) |
| Serving | 模型服务化(在线推理) |
| Batch Inference | 批量推理(离线处理) |

## 检查清单

- [ ] 模型版本管理和注册中心已建立
- [ ] 自动化CI/CD流水线已配置
- [ ] 模型监控和漂移检测已部署
- [ ] 自动扩缩容策略已配置
- [ ] 告警规则和响应流程已定义
- [ ] 回滚机制已测试验证
- [ ] 成本监控和优化持续进行
- [ ] 安全审计和合规检查已覆盖
