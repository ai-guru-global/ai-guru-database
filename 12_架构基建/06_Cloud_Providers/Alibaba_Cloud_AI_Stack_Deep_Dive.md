---
title: "阿里云 AI Stack 深度解读 — 专有云 AI 推理平台"
category: 12-architecture-infrastructure
tags: [ai-infrastructure, model-serving, alibaba-cloud, dedicated-cloud, gpu, model-gateway, rag]
summary: "阿里云专有云 AI Stack 是面向企业的单机/多机 AI 推理平台，三层架构（控制台→控制层→资源层），内置 Qwen3-Pro 优化模型、模型网关、RAG 应用和 GPU 虚拟化。"
sources:
  - "AI Stack 用户指南.pdf"
created: 2026-06-05
updated: 2026-06-05
provenance:
  extracted: 0.7
  inferred: 0.2
  ambiguous: 0.1
base_confidence: 0.8
lifecycle: draft
lifecycle_changed: 2026-06-05
tier: core
aliases:
  - "Alibaba Cloud Ai Stack Deep Dive"
  - "Alibaba Cloud AI Stack Deep Dive"
  - Alibaba_Cloud_AI_Stack_Deep_Dive

---
# 阿里云 AI Stack 深度解读 — 专有云 AI 推理平台

## 1. 概述

AI Stack 是阿里云**专有云**产品线中的 AI 推理服务平台（V2.14.0，文档版本 20260529），面向企业内部部署大模型推理服务。采用**单租户架构**，所有硬件资源归属单一用户，无多租户虚拟化共享。

**核心定位**：为企业提供开箱即用的大模型推理能力，降低从"模型文件"到"在线服务"的工程门槛。

---

## 2. 三层架构

```
┌─────────────────────────────────────┐
│  上层：控制台 (Control Panel)        │  ← 用户交互中心
│  轻量 UI，API-only 与下层通信        │
├─────────────────────────────────────┤
│  中层：控制层 (Control Layer)        │  ← 业务逻辑枢纽
│  权限/告警/DB/服务生命周期调度        │
├─────────────────────────────────────┤
│  下层：资源层 (Resource Layer)       │  ← 资源编排与执行
│  GPU 分配/模型存储/容器启停/虚拟化    │
└─────────────────────────────────────┘
```

- **上层**：轻量 UI，不深度嵌套，通过 API 与中层通信
- **中层**：将上层请求转为可执行命令向下分发，聚合底层状态反馈
- **下层**：实时资源调度，GPU 任务迁移不可中断

---

## 3. 推理服务 (Inference Services)

### 3.1 模型网关 (Model Gateway)

统一接入多个后端推理服务，提供：
- **负载均衡**：round-robin / IP hash / least connections
- **流控**：请求速率限制
- **API-Key 管理**：支持全量/部分/无认证三种模式
- **网关 API Key 管理**：API 列表、调用明细、配置管理

**前提**：后端推理服务必须已在线且成功加载。

### 3.2 模型仓库 (Model Repository)

- 管理模型文件，RBAC 权限控制
- 系统模型不可删除，仅自定义模型支持删除
- 支持模糊查询
- 内置 **Qwen3-Pro**（APG 优化版，性能约为开源 Qwen3-VL-235B 的 1.9 倍）

### 3.3 镜像库 (Image Repository)

- 预装深度优化的容器镜像
- 自定义镜像通过 `RepoTags` 中 `ai.stack.application="custom"` 标识
- 系统镜像不可删除

### 3.4 在线服务 (Online Services)

- **容器化部署**：所有模型服务强制以 containerd 容器形式部署
- **GPU 虚拟化**：支持 GPU 共享模式和 GPU 独占模式
- **实例规格**：
  - 极速配置：1 GPU / 8 CPU
  - 高级配置：2 GPU / 48 CPU
  - 基础配置：4 GPU / 48 CPU
  - 标准配置：8 GPU / 96 CPU
  - 专业配置：16 GPU / 256 CPU
- **高级选项**：KVCache 加速、KVCache 存储（APFS）、seccomp 禁用、entrypoint 覆盖
- **服务隔离**：各在线服务相互隔离

### 3.5 模型观测 (Model Observation)

监控指标：
- Token 消耗量
- 首 Token 延迟 (TTFT)
- 平均输出 Token 生成速率 (TPOT)
- 成功率

API Key 与观测支持矩阵：
| 启用 API Key | 启用观测服务 | 是否支持观测 |
|---|---|---|
| 否 | 否 | 支持 |
| 是 | 否 | 不支持 |
| 是 | 是 | 支持 |

---

## 4. Qwen3-Pro 模型

### 性能对比（vs 开源 Qwen3-VL-235B）

| Benchmark | Qwen3-Pro | Qwen3-VL-235B | 说明 |
|---|---|---|---|
| MMMU | 78.1 | 78.8 | 多学科多模态理解，开源排名第一 |
| MMMU-PRO | 67.6 | 67.9 | 高难子集 |
| MathVision | 65.5 | 66.9 | 数学视觉推理，超越人类平均 |
| MMBench-En | 90.8 | 90.3 | 英文综合评测 90.8% |
| RealWorldQA | 79.7 | 78.7 | 真实世界常识理解 |

### 推理性能

| 序列长度 | 整机吞吐 | 并发数 |
|---|---|---|
| 1K/1K | 34,200 tokens/sec | 2,048 |
| 2K/2K | 27,300 tokens/sec | 1,600 |

- 测试数据格式：INT8
- SLO：TTFT < 2s，TPOT < 100ms
- 单机/集群推理性能是开源版的 **1.9 倍**

### 输出规格

- 推理模型：Qwen3-Pro-Instruct
- 系统模型：Qwen3-Pro-INT8、Qwen3-Pro-VL-BF16
- 限制：不支持多机节点批量部署

### 核心能力

- **通用推理**：指令执行、逻辑推理、文本理解、数学/编程
- **多模态推理**：STEM 领域，因果分析
- **视觉理解**：PC/手机 GUI 交互、UI 元素识别
- **长上下文**：原生 256K tokens，可扩展至 1M
- **空间感知**：2D+3D 定位，支持具身智能

---

## 5. 模型体验与 RAG

### 5.1 文本模型体验

可配置参数：`stop`、`max_tokens`、`presence_penalty`（-2~2）、`frequency_penalty`、`logit_bias`、`user`

### 5.2 视觉模型体验

- 基于 Qwen2.5-VL-72B-Instruct
- 支持 functions/function_call、temperature、top_p 配置
- 最多同时体验 3 个模型

### 5.3 知识库 (Knowledge Base)

构建流程：
1. 选择 Embedding 模型
2. 设定最低分数阈值（排序配置）
3. 上传文档（支持 doc/docx/pdf/txt）
4. 文档切分（目前仅支持智能切分）

### 5.4 RAG 应用

基于本地知识库 + 大模型快速构建 RAG 应用：
- **温度系数**：控制生成多样性
- **最长回复长度**：模型间限制不同
- **召回片段数**：越高覆盖越广但 token 消耗越大
- **回复范围**：定义检索结果与用户输入的相关性判定
- 支持 API Key 管理、对话测试、API 调用

---

## 6. 安全与运维

### 6.1 RBAC 四角色

| 角色 | 数量 | 核心权限 |
|---|---|---|
| 管理员 (Manager) | 1 | 查看日志、管理模型、创建/修改用户 |
| 安全管理员 | 1 | 创建/删除用户 |
| 审计员 | 1 | 查看审计日志（不可修改） |
| 应用管理员 | 多个 | 查看和使用运行中的服务 |

### 6.2 网络安全

| 端口 | 用途 | 安全建议 |
|---|---|---|
| 30000-35000 | 模型服务 | TOTK 认证，不支持 HTTPS，建议使用可信网络 |
| 80 | AI Stack 控制台 | 平台账号密码认证 |
| 22 | SSH 访问 | 高权限，严格访问控制 |
| 默认全部拒绝 | 防反向控制 | 细粒度权限调整 |

### 6.3 日志存储

- 管控日志：`/usr/bin/aioController/log`，单文件 100MB，保留 40 个历史文件（max 4GB）
- 安装日志：`/usr/local/aio_clonescripts/aio_clone.log`
- 运行日志：`aio-ops-start.log`

### 6.4 节点监控

- CPU/内存/GPU/磁盘使用率实时监控
- 高频数据采集，实时更新

---

## 7. 多机版本

- 支持控制台切换
- 创建/扩容/缩容/删除多机集群
- 多机在线服务、多机模型网关、多机模型观测

---

## 8. 与传统 AI 基础设施的对比

| 维度 | AI Stack（专有云） | 公有云 AI 服务 |
|---|---|---|
| 部署模式 | 单机/多机本地部署 | 云端按需 |
| 租户模型 | 单租户，资源独占 | 多租户，资源共享 |
| 数据出域 | 不出域 | 上传云端 |
| 模型优化 | APG 深度优化（Qwen3-Pro 1.9x） | 通用优化 |
| 适用场景 | 数据安全敏感企业 | 弹性扩展需求 |

---

## Related

- [[概念/model-serving]] — 模型服务化部署概念
- [[概念/model-gateway]] — 模型网关概念
- [[概念/llm-infrastructure]] — LLM 基础设施
- [[10_部署推理/Deployment_Inference]] — 部署与推理系统全景
- [[14_RAG系统/RAG_Systems]] — RAG 系统全景
- [[12_架构基建/02_Architecture_Overview/AI_Infrastructure_2026]] — AI 基础设施 2026
- [[12_架构基建/11_AI_Gateway/AI_Gateway_2026]] — AI Gateway 2026
- [[治理/llm-infrastructure-system-design|LLM 基础设施 × 传统系统架构]] — 从 Web 服务到 Token 工厂
- [[治理/rag-vector-database|RAG × 向量数据库]] — RAG 系统合成
