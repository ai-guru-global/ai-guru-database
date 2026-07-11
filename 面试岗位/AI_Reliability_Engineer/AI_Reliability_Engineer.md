---
title: "AI Reliability Engineer 面试指南"
category: "21-interviews-ai-reliability-engineer"
tags: ["interviews", "career", "experience", "practitioners", "sre", "ai-reliability", "monitoring", "incident-response", "llm-ops", "model-drift"]
summary: "AI Reliability Engineer 面试全流程指南，覆盖 AI SRE、模型监控与漂移检测、线上故障处理、SLO/SLI 设计、容量规划、AI 系统高可用架构和事件响应流程。适用于 Google、Meta、OpenAI、Amazon 等公司的 AI Reliability/SRE 岗位。"
created: 2026-05-31
updated: 2026-07-11
tier: supporting
aliases:
  - "AI_Reliability_Engineer"
  - "AI Reliability Engineer 面试指南"
  - "AI_Reliability_Engineer Interview Guide"
  - "AI SRE"
  - "ML Reliability Engineer"
sources: []
---

# AI Reliability Engineer 面试指南

> **一句话理解**: AI Reliability Engineer 是 AI 生产系统的守护者——将传统 SRE 方法论扩展到非确定性的 AI 系统，监控模型漂移和性能退化，设计快速恢复机制，确保 AI 服务在高负载和异常情况下的持续可用。

---

## Table of Contents

- [1. 岗位定位与核心职责](#1-岗位定位与核心职责)
  - [1.1 岗位定位](#11-岗位定位)
  - [1.2 核心职责](#12-核心职责)
  - [1.3 核心技能栈](#13-核心技能栈)
  - [1.4 与相近岗位的区别](#14-与相近岗位的区别)
- [2. 技术能力要求](#2-技术能力要求)
- [3. 核心知识领域](#3-核心知识领域)
- [4. 高频面试问题](#4-高频面试问题)
- [5. 系统设计题](#5-系统设计题)
- [6. 编程与实操题](#6-编程与实操题)
- [7. 备考策略与学习路径](#7-备考策略与学习路径)
- [8. 行业薪资范围参考](#8-行业薪资范围参考)
- [9. 面试 Checklist](#9-面试-checklist)
- [Related](#related)

---

## 1. 岗位定位与核心职责

### 1.1 岗位定位

AI Reliability Engineer（AI 可靠性工程师，也称为 AI SRE）是将站点可靠性工程（Site Reliability Engineering）方法论应用于 AI/ML 系统的专业岗位。与传统软件 SRE 相比，AI SRE 面临独特的挑战：

- **非确定性故障**: AI 模型的输出不确定，"正确"与"错误"之间的边界模糊
- **模型漂移**: 随着时间推移，模型性能会因为数据分布变化而退化
- **延迟特性不同**: LLM 推理延迟高且变化大（首个 Token 延迟 vs 生成速度）
- **成本敏感性**: 每次推理都有成本，重试和冗余会直接增加开支
- **依赖链复杂**: AI 系统通常依赖向量库、GPU 集群、外部 API 等多种组件
- **质量监控难**: 传统 SRE 监控基础设施指标，AI SRE 还要监控模型质量指标

AI Reliability Engineer 的核心使命是**确保 AI 系统在生产环境中持续提供可靠、高质量的服务**，平衡可靠性、成本和迭代速度。

### 1.2 核心职责

| 职责领域 | 具体内容 | 交付物 |
|---------|---------|--------|
| **SLO/SLI 设计** | 为 AI 服务定义合适的服务等级目标和指标 | SLO 文档、Error Budget 策略 |
| **监控体系** | 建立覆盖基础设施、模型质量和业务指标的监控 | 监控仪表盘、告警规则 |
| **漂移检测** | 检测和预警数据漂移、概念漂移和模型性能退化 | 漂移检测系统、退化告警 |
| **事件响应** | 处理 AI 系统的线上故障，进行根因分析和修复 | 事后分析报告（Postmortem） |
| **容量规划** | 预测 GPU/TPU 需求，规划推理容量 | 容量规划报告、伸缩策略 |
| **自动化** | 建设自动化运维工具，减少人工干预 | 自动化脚本、自愈系统 |
| **混沌工程** | 通过故障注入测试系统的弹性 | 混沌实验计划、改进方案 |
| **成本管控** | 监控和优化 AI 推理的成本 | 成本报告、优化方案 |

### 1.3 核心技能栈

| 维度 | 关键技能 | 常见工具/框架 |
|------|---------|--------------|
| **SRE 方法论** | SLO/SLI/Error Budget、故障分析、Postmortem | SRE Book 方法论 |
| **监控系统** | 时序数据、日志、链路追踪 | Prometheus, Grafana, Datadog, ELK |
| **LLM 推理运维** | 推理引擎、GPU 调度、KV Cache 管理 | vLLM, TensorRT-LLM, Triton Inference Server |
| **模型监控** | 数据漂移、概念漂移、性能监控 | Evidently AI, Arize, Fiddler, WhyLabs |
| **Kubernetes** | K8s 运维、GPU 调度、HPA/KEDA | kubectl, Helm, GPU Operator |
| **编程** | Python, Go, Bash 自动化 | Python, Go, Shell |
| **事件管理** | 故障分级、响应流程、沟通协调 | PagerDuty, Opsgenie, Slack |
| **云平台** | 云基础设施运维 | AWS/GCP/Azure |

### 1.4 与相近岗位的区别

| 岗位 | 核心关注点 | 与 AI Reliability Engineer 的差异 |
|------|-----------|--------------------------------|
| **传统 SRE** | 基础设施可靠性、微服务运维 | 不涉及模型质量监控和漂移检测 |
| **MLOps Engineer** | ML 流水线自动化、CI/CD | 更偏 Pipeline 自动化，AI SRE 更偏线上稳定性 |
| **AI Infrastructure Engineer** | GPU 集群、训练基础设施 | 更偏基础设施搭建，AI SRE 更偏运维和可靠性 |
| **AI Evaluation Engineer** | 离线评估、基准测试 | 更偏质量评估方法论，AI SRE 更偏线上监控 |
| **Cloud Ops Engineer** | 云资源运维 | 不涉及 AI 特有的运维挑战 |

---

## 2. 技术能力要求

### 基础级 (初级 AI Reliability Engineer)

- **SRE 基础**: 理解 SLI、SLO、SLA、Error Budget 的概念和应用
- **系统监控**: 熟悉 Prometheus + Grafana 或类似的监控体系
- **Kubernetes**: 能进行基本的 K8s 运维操作，理解 Pod、Service、Deployment
- **AI 基础**: 理解 ML 模型的基本工作原理和常见的性能指标
- **编程能力**: 熟练使用 Python 或 Go 进行自动化脚本编写
- **事件响应**: 了解基本的故障响应流程和 Postmortem 方法论

### 进阶级 (中级 AI Reliability Engineer)

- **AI 系统运维**: 能独立运维 LLM 推理服务（vLLM/TGI/TensorRT-LLM 部署和调优）
- **模型监控**: 能设计和实施模型漂移检测方案（数据漂移、概念漂移、预测分布变化）
- **SLO 设计**: 能为 AI 服务设计合理的 SLO，平衡可靠性和迭代速度
- **容量规划**: 能基于历史数据和预测进行 GPU/TPU 容量规划
- **自动化**: 能建设自动化运维工具，减少人工干预
- **成本优化**: 能分析和优化 AI 推理的成本

### 专家级 (高级 AI Reliability Engineer)

- **系统架构**: 能设计高可用的 AI 系统架构，包括多活部署、故障隔离和快速恢复
- **混沌工程**: 能设计和执行混沌实验，系统性提升系统弹性
- **事件管理**: 能主导重大事件的响应和协调，推动组织级改进
- **SRE 文化**: 能在组织内推动 SRE 文化和最佳实践
- **前沿技术**: 跟踪 AI 推理技术和运维工具的最新发展

---

## 3. 核心知识领域

### 3.1 AI 系统的 SLI/SLO 设计

**核心主题**:
- **AI 特有的 SLI**:
  - 延迟: 首个 Token 延迟（TTFT）、每个 Token 生成时间（TPOT）、端到端延迟
  - 吞吐: 每秒处理请求数（QPS）、每秒生成 Token 数
  - 质量: 生成准确率（需要延迟评估）、用户满意度
  - 安全: 有害输出率、安全拦截率
  - 成本: 每请求平均成本、Error Budget 消耗

- **SLO 设计原则**:
  - 基于用户体验而非系统内部指标
  - 区分关键路径和非关键路径
  - 设置合理的 Error Budget
  - 定期 Review 和调整

**示例 SLO**:
```
LLM Chat Service SLO:
- 可用性: 99.9% 的请求成功返回
- 延迟: 95% 的请求 TTFT < 2s
- 延迟: 95% 的请求 TPOT < 50ms
- 质量: 90%+ 的回答被用户标记为有用
- 安全: 有害内容生成率 < 0.1%
```

### 3.2 模型漂移检测

**核心主题**:
- **漂移类型**:
  - **数据漂移（Data Drift）**: 输入数据分布变化（用户查询模式变了）
  - **概念漂移（Concept Drift）**: 输入与输出的关系变化（业务规则变了）
  - **预测漂移（Prediction Drift）**: 模型输出分布变化

- **检测方法**:
  - 统计检验: KS 检验、卡方检验、PSI（Population Stability Index）
  - 距离度量: Wasserstein 距离、KL 散度、JS 散度
  - 机器学习方法: 训练漂移检测分类器

- **监控指标**:
  - 特征分布 PSI
  - 预测分布变化
  - 置信度分布变化
  - 延迟标注的准确率变化

### 3.3 LLM 推理服务运维

**核心主题**:
- **推理引擎**: vLLM、TensorRT-LLM、SGLang、TGI 的运维特点
- **关键指标**:
  - GPU 利用率和显存使用
  - KV Cache 命中率和使用率
  - 批处理效率（Continuous Batching）
  - 队列深度和等待时间

- **常见问题**:
  - OOM（显存不足）
  - 推理延迟突增
  - 热加载失败
  - 模型权重加载慢

- **调优策略**:
  - Batch Size 优化
  - KV Cache 大小调整
  - 并发请求管理
  - 模型量化（INT8/INT4）

### 3.4 事件响应与故障处理

**核心主题**:
- **故障分级**:
  - SEV1: 全面服务中断
  - SEV2: 部分功能不可用或性能严重退化
  - SEV3: 局部问题，影响有限

- **AI 特有的故障类型**:
  - 模型输出质量退化（幻觉增加、准确率下降）
  - 推理延迟突增（GPU 热节流、显存碎片）
  - 上游 LLM API 故障（供应商服务中断）
  - 数据管道故障导致 RAG 检索失败
  - 安全护栏误拦截（正常请求被拦截）

- **响应流程**:
  - 发现 → 分级 → 响应 → 缓解 → 根因分析 → 修复 → Postmortem

- **Postmortem 原则**:
  - Blameless（不追究个人责任）
  - 关注系统性改进
  - 行动项跟踪和闭环

### 3.5 容量规划与弹性伸缩

**核心主题**:
- **容量预测**:
  - 基于历史流量模式预测未来需求
  - 考虑模型更新带来的性能变化
  - 规划 GPU/TPU 采购周期

- **弹性伸缩**:
  - HPA（Horizontal Pod Autoscaler）: 基于 CPU/GPU/内存的伸缩
  - KEDA: 基于自定义指标（队列深度、延迟）的伸缩
  - 预测性伸缩: 基于流量预测提前扩容

- **GPU 调度**:
  - GPU 共享和时间分片
  - MIG（Multi-Instance GPU）
  - 多租户 GPU 集群管理

### 3.6 成本监控与优化

**核心主题**:
- **成本指标**:
  - 每请求平均成本
  - 每用户月均成本
  - Error Budget 消耗速率
  - GPU 利用率和单位算力成本

- **优化策略**:
  - 模型路由（简单请求用小模型）
  - 语义缓存（相似请求复用结果）
  - 批处理聚合（非实时请求）
  - Spot Instance（可中断推理任务）
  - 自动缩容到零（低峰时段）

### 3.7 混沌工程

**核心主题**:
- **故障注入**:
  - GPU 故障模拟
  - 网络延迟和分区
  - 上游 API 不可用
  - 数据库连接耗尽
  - 模型权重加载失败

- **弹性验证**:
  - 自动故障转移是否生效
  - 降级策略是否正常
  - 监控告警是否及时
  - 容量是否足够应对突发流量

---

## 4. 高频面试问题

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

### 4.1 SRE 方法论 (7 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | 如何为 LLM 推理服务设计 SLO？需要考虑哪些特殊因素？ | ⭐⭐ | 🔴 |
| 2 | Error Budget 的概念是什么？如何在 AI 团队中实施？ | ⭐ | 🔴 |
| 3 | AI 系统的可用性与传统软件有什么不同？如何衡量？ | ⭐⭐ | 🟡 |
| 4 | 描述一个你处理的重大线上故障，从发现到解决的完整流程 | ⭐⭐ | 🔴 |
| 5 | 什么是 Blameless Postmortem？为什么它很重要？ | ⭐ | 🟡 |
| 6 | 如何平衡系统可靠性和产品迭代速度？ | ⭐⭐ | 🟡 |
| 7 | 你如何设计一个 AI 服务的降级策略？ | ⭐⭐ | 🟡 |

### 4.2 模型监控与漂移 (6 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 8 | 什么是模型漂移？数据漂移和概念漂移有什么区别？ | ⭐ | 🔴 |
| 9 | 如何检测 LLM 输出质量的退化？有哪些监控指标？ | ⭐⭐ | 🔴 |
| 10 | PSI（Population Stability Index）的原理是什么？如何使用？ | ⭐⭐ | 🟡 |
| 11 | 如何设计一个模型漂移的自动化告警系统？ | ⭐⭐ | 🟡 |
| 12 | 发现模型性能退化后，你的响应流程是什么？ | ⭐⭐ | 🔴 |
| 13 | 如何监控 RAG 系统的检索质量退化？ | ⭐⭐ | 🟢 |

### 4.3 LLM 推理运维 (6 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 14 | vLLM 的 PagedAttention 原理是什么？它如何提升推理效率？ | ⭐⭐ | 🔴 |
| 15 | LLM 推理服务遇到 OOM 怎么办？如何排查和解决？ | ⭐⭐ | 🔴 |
| 16 | 如何设计 LLM 推理服务的自动伸缩策略？ | ⭐⭐ | 🔴 |
| 17 | TTFT（Time To First Token）和 TPOT 的区别？如何优化？ | ⭐ | 🟡 |
| 18 | 如何处理上游 LLM API（如 OpenAI）的故障？ | ⭐⭐ | 🟡 |
| 19 | GPU 集群的利用率如何监控和优化？ | ⭐⭐ | 🟡 |

### 4.4 系统设计 (4 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 20 | 设计一个 LLM 推理服务的监控告警体系 | ⭐⭐⭐ | 🔴 |
| 21 | 设计一个模型漂移检测和自动重训练的系统 | ⭐⭐⭐ | 🟡 |
| 22 | 设计一个高可用的多区域 AI 推理服务 | ⭐⭐⭐ | 🟡 |
| 23 | 设计一个 AI 安全事件的实时检测和响应系统 | ⭐⭐⭐ | 🟢 |

### 4.5 行为面试 (4 题)

| # | 问题 | 频率 |
|---|------|------|
| 24 | 描述一次你在高压下处理线上故障的经历 | 🔴 |
| 25 | 你和模型团队在"是否回滚"上有分歧时如何处理？ | 🟡 |
| 26 | 你如何推动团队改善线上可靠性？ | 🟡 |
| 27 | 描述一次你通过自动化消除了重复性运维工作 | 🟡 |

---

## 5. 系统设计题

### 5.1 设计 LLM 推理服务的监控体系

**题目**: 为一个日处理 1000 万次请求的 LLM 推理服务设计完整的监控告警体系。

**考察要点**:

1. **监控层次**:
   ```
   基础设施层 → 推理引擎层 → 模型质量层 → 用户体验层 → 业务层
   ```

2. **基础设施监控**:
   - GPU 利用率、显存使用、温度
   - 网络带宽、IOPS
   - 节点健康状态

3. **推理引擎监控**:
   - QPS、TTFT、TPOT、端到端延迟分布
   - KV Cache 使用率和命中率
   - 批处理效率、队列深度
   - 模型加载时间

4. **模型质量监控**:
   - 输出长度分布变化
   - 拒绝率变化
   - 用户反馈（点赞/点踩）率
   - 安全拦截率
   - 延迟标注的准确率

5. **告警设计**:
   - 分级告警（P0-P3）
   - 告警阈值和窗口
   - 告警路由和值班
   - 告警抑制和聚合

### 5.2 设计模型漂移检测和自动重训练系统

**考察要点**:
1. 漂移检测: 统计检验 + ML 方法
2. 触发条件: 什么程度的漂移需要触发重训练
3. 数据收集: 自动收集新数据用于重训练
4. 重训练 Pipeline: 自动化的训练-评估-部署流程
5. 回滚机制: 新模型不如旧模型时自动回滚
6. 通知和审计

### 5.3 设计高可用 AI 推理服务

**考察要点**:
1. 多区域部署: 跨区域容灾
2. 故障转移: 自动检测和切换
3. 降级策略: 模型降级（大→小）、功能降级
4. 流量管理: 负载均衡、限流、熔断
5. 数据一致性: 多区域向量库同步
6. 成本控制: 多区域部署的成本优化

---

## 6. 编程与实操题

### 6.1 实现模型漂移检测

```python
import numpy as np
from scipy import stats

class DriftDetector:
    """模型漂移检测器，支持多种检测方法。"""
    
    def __init__(self, reference_data):
        """reference_data: 训练时的参考数据分布"""
        self.reference = np.array(reference_data)
        self.ref_mean = np.mean(self.reference)
        self.ref_std = np.std(self.reference)
    
    def detect_population_stability_index(self, current_data, bins=10):
        """
        PSI (Population Stability Index)
        PSI < 0.1: 稳定
        0.1 <= PSI < 0.25: 轻微漂移
        PSI >= 0.25: 显著漂移
        """
        ref_hist, edges = np.histogram(self.reference, bins=bins, density=True)
        cur_hist, _ = np.histogram(current_data, bins=edges, density=True)
        
        # 避免 0 值
        ref_hist = np.where(ref_hist == 0, 0.0001, ref_hist)
        cur_hist = np.where(cur_hist == 0, 0.0001, cur_hist)
        
        psi = np.sum((cur_hist - ref_hist) * np.log(cur_hist / ref_hist))
        
        return {
            'psi': psi,
            'level': 'stable' if psi < 0.1 else 'slight_drift' if psi < 0.25 else 'significant_drift'
        }
    
    def detect_ks_test(self, current_data):
        """KS 检验: 比较两个分布是否有显著差异"""
        statistic, p_value = stats.ks_2samp(self.reference, current_data)
        return {
            'statistic': statistic,
            'p_value': p_value,
            'drifted': p_value < 0.05
        }
```

### 6.2 实现 SLO 监控和 Error Budget 计算

```python
from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass
class SLO:
    name: str
    target: float  # e.g., 0.999 for 99.9%
    window: timedelta  # e.g., 30 days
    
class ErrorBudgetTracker:
    """追踪 SLO 的 Error Budget 消耗。"""
    
    def __init__(self, slo: SLO):
        self.slo = slo
        self.events = []  # (timestamp, is_good)
    
    def record(self, is_good: bool):
        self.events.append((datetime.now(), is_good))
    
    def compute_error_budget_status(self):
        """计算当前 Error Budget 消耗状态"""
        cutoff = datetime.now() - self.slo.window
        recent = [(ts, ok) for ts, ok in self.events if ts > cutoff]
        
        total = len(recent)
        if total == 0:
            return None
        
        good = sum(1 for _, ok in recent if ok)
        actual_reliability = good / total
        
        # Error Budget = (1 - target) * window
        budget_fraction = 1 - self.slo.target
        actual_error_rate = 1 - actual_reliability
        budget_consumed = actual_error_rate / budget_fraction if budget_fraction > 0 else 1
        
        remaining_budget = 1 - budget_consumed
        burn_rate = budget_consumed / (self.slo.window.total_seconds() / 3600)  # per hour
        
        return {
            'slo_name': self.slo.name,
            'target': f"{self.slo.target * 100}%",
            'actual': f"{actual_reliability * 100:.2f}%",
            'budget_remaining': f"{remaining_budget * 100:.1f}%",
            'budget_consumed': f"{budget_consumed * 100:.1f}%",
            'burn_rate_per_hour': burn_rate,
            'status': 'healthy' if remaining_budget > 0 else 'exhausted'
        }
```

### 6.3 实现推理服务健康检查

```python
import time
from dataclasses import dataclass

@dataclass
class HealthCheckResult:
    healthy: bool
    latency_ms: float
    error: str = None

class LLMHealthChecker:
    """LLM 推理服务健康检查。"""
    
    def __init__(self, endpoint, timeout=5, warmup_prompt="Hello"):
        self.endpoint = endpoint
        self.timeout = timeout
        self.warmup_prompt = warmup_prompt
    
    async def check(self) -> HealthCheckResult:
        """执行健康检查。"""
        try:
            start = time.time()
            # 发送简单请求
            response = await self._send_request(self.warmup_prompt)
            latency = (time.time() - start) * 1000
            
            # 检查响应质量
            if not response or len(response) < 2:
                return HealthCheckResult(
                    healthy=False, latency_ms=latency,
                    error="Empty or too short response"
                )
            
            return HealthCheckResult(healthy=True, latency_ms=latency)
            
        except Exception as e:
            return HealthCheckResult(healthy=False, latency_ms=0, error=str(e))
```

### 6.4 实现自动故障转移

```python
class FailoverManager:
    """多区域推理服务的自动故障转移。"""
    
    def __init__(self, regions):
        self.regions = regions  # [{"name": "us-east", "endpoint": "...", "health": 1.0}]
        self.current_primary = 0
        self.failover_threshold = 0.5  # 健康分数低于此值触发故障转移
    
    def update_health(self, region_name, health_score):
        """更新区域健康分数"""
        for r in self.regions:
            if r['name'] == region_name:
                r['health'] = health_score
    
    def get_best_region(self):
        """获取当前最佳区域"""
        primary = self.regions[self.current_primary]
        
        if primary['health'] < self.failover_threshold:
            # 寻找最健康的备用区域
            best = max(self.regions, key=lambda r: r['health'])
            if best['health'] > primary['health'] + 0.2:  # 显著更好才切换
                self.current_primary = self.regions.index(best)
                return best, True  # 返回 (最佳区域, 是否发生了切换)
        
        return primary, False
```

### 6.5 实现推理成本监控

```python
from collections import defaultdict
from datetime import datetime

class InferenceCostMonitor:
    """追踪和分析推理成本。"""
    
    def __init__(self, pricing):
        """pricing: {"gpt-4o": {"input": 0.0025/1K, "output": 0.01/1K}}"""
        self.pricing = pricing
        self.usage = defaultdict(lambda: {"input_tokens": 0, "output_tokens": 0, "requests": 0})
    
    def record(self, model, input_tokens, output_tokens):
        self.usage[model]["input_tokens"] += input_tokens
        self.usage[model]["output_tokens"] += output_tokens
        self.usage[model]["requests"] += 1
    
    def compute_cost(self, model):
        data = self.usage[model]
        price = self.pricing[model]
        input_cost = (data["input_tokens"] / 1000) * price["input"]
        output_cost = (data["output_tokens"] / 1000) * price["output"]
        return input_cost + output_cost
    
    def report(self):
        total_cost = 0
        report = {}
        for model in self.usage:
            cost = self.compute_cost(model)
            total_cost += cost
            data = self.usage[model]
            report[model] = {
                "cost": cost,
                "requests": data["requests"],
                "avg_input_tokens": data["input_tokens"] / max(data["requests"], 1),
                "avg_output_tokens": data["output_tokens"] / max(data["requests"], 1),
                "cost_per_request": cost / max(data["requests"], 1)
            }
        report["total_cost"] = total_cost
        return report
```

---

## 7. 备考策略与学习路径

### 7.1 基础阶段（1-2 个月）

1. **SRE 基础**:
   - 阅读《Site Reliability Engineering》(Google SRE Book)
   - 理解 SLI/SLO/Error Budget 方法论
   - 学习事件响应和 Postmortem 流程

2. **监控体系**:
   - 学习 Prometheus + Grafana 的使用
   - 理解 metrics、logging、tracing 三大支柱
   - 实践搭建基本的监控仪表盘

3. **Kubernetes 运维**:
   - 获取 CKA 或等效知识
   - 理解 K8s 中的 GPU 调度
   - 实践部署一个推理服务

### 7.2 进阶阶段（2-3 个月）

1. **AI 推理运维**:
   - 学习 vLLM/TensorRT-LLM 的部署和调优
   - 理解 LLM 推理的性能特征
   - 实践推理服务的容量规划和伸缩

2. **模型监控**:
   - 学习数据漂移和概念漂移的检测方法
   - 实践使用 Evidently AI 或 WhyLabs
   - 搭建模型质量监控 Dashboard

3. **故障处理实践**:
   - 参与实际的值班和故障响应
   - 练习编写 Postmortem
   - 设计和执行混沌实验

### 7.3 面试冲刺阶段（1 个月）

1. **案例准备**: 准备 2-3 个线上故障处理案例
2. **系统设计**: 练习设计 AI 监控和高可用系统
3. **SLO 设计**: 练习为不同场景设计 SLO
4. **公司研究**: 了解目标公司的 AI 基础设施和运维实践

---

## 8. 行业薪资范围参考

> 以下数据基于 2025-2026 年美国市场，仅供参考。

| 级别 | 公司类型 | 年薪范围 (美元) | 说明 |
|------|---------|---------------|------|
| 初级 (1-3 年) | FAANG / AI 公司 | $160K - $250K | SRE + AI 方向 |
| 中级 (3-6 年) | FAANG / AI 公司 | $240K - $400K | 能独立负责服务可靠性 |
| 高级 (6+ 年) | FAANG / AI 公司 | $350K - $600K+ | 可靠性架构师、SRE 经理 |

**中国市场** (人民币):
- 初级 (1-3 年): 40-80 万
- 中级 (3-6 年): 80-150 万
- 高级 (6+ 年): 150-250 万

---

## 9. 面试 Checklist

- [ ] 能为 AI 服务设计合理的 SLO 和 Error Budget
- [ ] 理解模型漂移的类型和检测方法
- [ ] 能设计 LLM 推理服务的监控体系
- [ ] 了解 LLM 推理引擎的运维要点
- [ ] 能描述一个完整的故障响应流程
- [ ] 理解 Blameless Postmortem 方法论
- [ ] 能设计自动故障转移和降级方案
- [ ] 了解 GPU 集群的容量规划和调度
- [ ] 能实现漂移检测和成本监控代码
- [ ] 准备了故障处理和改进的案例
- [ ] 了解混沌工程在 AI 系统中的应用
- [ ] 能够讨论可靠性与成本、速度之间的 trade-off

---

## Related

- [[面试岗位/README|AI 面试准备 (Interviews)]]
- [[面试岗位/jobs|AI 相关岗位与工种清单]]
- [[面试岗位/MLOps_Engineer/MLOps_Engineer|MLOps Engineer 面试指南]]
- [[面试岗位/AI_Infrastructure_Engineer/question_bank|AI Infrastructure Engineer 题库]]
- [[面试岗位/AI_Evaluation_Engineer/AI_Evaluation_Engineer|AI Evaluation Engineer 面试指南]]
- [[面试岗位/AI_Security_Engineer/AI_Security_Engineer|AI Security Engineer 面试指南]]

---

*Last updated: 2026-07-11*
