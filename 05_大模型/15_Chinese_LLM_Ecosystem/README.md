---
title: 中国大模型生态全景 (Chinese LLM Ecosystem)
category: 05-nlp-llms-chinese-llm-ecosystem
tags: ["chinese-llm", "deepseek", "qwen", "glm", "kimi", "minimax", "baidu", "baichuan", "yi", "tencent", "iflytek", "sensetime", "internlm", "bytedance", "stepfun", "xiaomi", "modelscope", "moe", "open-source"]
summary: "系统梳理中国 15 家大模型厂商的技术路线、模型矩阵、核心创新与 Benchmark 对比，覆盖第一梯队（DeepSeek/Qwen/GLM/Kimi/MiniMax/MiMo）和第二梯队（百度/百川/零一万物/阶跃星辰/腾讯/讯飞/商汤/InternLM/字节跳动）。"
created: 2026-06-01
updated: 2026-06-19
tier: supporting
sources: []

name_zh: "中国大模型生态全景"
---
# 中国大模型生态全景 (Chinese LLM Ecosystem)

> 中文简称：中国大模型生态全景

> **一句话理解**: 中国大模型已经从"百模大战"进入"十五强格局"——DeepSeek 用最低成本打败巨头，Qwen 打造最全开源舰队，百度文心依托搜索生态，腾讯混元凭借视频生成，讯飞星火融合语音基因，字节豆包靠超级App分发——它们共同构成了全球第二活跃的大模型创新生态。

---

## 第一梯队（头部厂商）

> 技术公开充分、社区影响力大、Benchmark 达到 GPT-4 级别

| **厂商** | **成立** | **核心技术** | **旗舰模型** | **总参数** | **最大亮点** | 深度文档 |
|----------|---------|-------------|-------------|-----------|-------------|---------|
| **DeepSeek** | 2023 | MLA + MoE + FP8 | DeepSeek-V4 Pro | 1.6T / 49B active | $5.6M 训练出 GPT-4 级模型 | [[DeepSeek_Deep_Dive]] |
| **Qwen** (通义千问) | 2023 | Hybrid Thinking + MoE | Qwen3.7-Max | 未公开（闭源旗舰） | 1M 上下文（开源 235B-A22B-2507）+ 数学/中文最强 + 最全开源生态 | [[Qwen_Deep_Dive]] |
| **GLM/智谱 AI** | 2019 | MLA + 256 专家 MoE + DSA | GLM-5.2 | 744B / 40B active | 1M 上下文 + MIT 纯开源 + 最强开源编码 | [[GLM_Zhipu_Deep_Dive]] |
| **Kimi/月之暗面** | 2023 | MuonClip + MoE + MLA | Kimi K2.6 | 1.04T / 32.6B active | 256K 上下文 + 多模态理解 | [[Kimi_Moonshot_Deep_Dive]] |
| **MiniMax** | 2021 | MSA 稀疏注意力 + MoE | MiniMax-M3 | ~428B / ~23B active | 原生多模态（文/图/视频）+ 1M 上下文 + Coding & Cowork | [[MiniMax_Deep_Dive]] |
| **小米 MiMo** | 2025 | MoE + Agent-First + MTP | MiMo-V2.5-Pro | 1T / 42B active | Agent 大脑 + 极致性价比 | [[Xiaomi_MiMo_Deep_Dive]] |

---

## 第二梯队（重要参与者）

> 各具技术特色或在垂直领域/生态场景中占据重要位置

| **厂商** | **成立** | **核心技术** | **旗舰模型** | **核心特色** | 深度文档 |
|----------|---------|-------------|-------------|-------------|---------|
| **百度文心** | 2019 | 知识增强 + 搜索增强 | ERNIE 4.5 Ultra | 搜索增强 + 50+ 行业模型 | [[Baidu_ERNIE_Deep_Dive]] |
| **百川智能** | 2023 | 搜索增强 + MoE | Baichuan-4 | 搜索基因 + 医疗垂直 | [[Baichuan_Deep_Dive]] |
| **零一万物 Yi** | 2023 | GQA + 长上下文 | Yi-1.5-34B | Apache 2.0 开源 + 编程模型 | [[Yi_01AI_Deep_Dive]] |
| **阶跃星辰** | 2023 | MoE + 多模态 | Step-2 | 万亿参数 MoE + 视觉理解 | [[StepFun_Deep_Dive]] |
| **腾讯混元** | 2023 | MoE + 视频生成 | Hunyuan-Pro 2.0 | 微信生态 + 视频生成 SOTA | [[Tencent_Hunyuan_Deep_Dive]] |
| **讯飞星火** | 2023 | 语音-文本融合 | Spark 4.5 | 语音AI + 教育深耕 + 昇腾 | [[iFlytek_Spark_Deep_Dive]] |
| **商汤日日新** | 2023 | 视觉+多模态 | SenseNova 5.0 | CV基因 + 数字人 + 大装置 | [[SenseTime_SenseNova_Deep_Dive]] |
| **书生浦语** | 2020 | 开源工具链 | InternLM3 | LMDeploy + OpenCompass | [[InternLM_Deep_Dive]] |
| **字节豆包** | 2023 | 超级App分发 | Doubao-1.5 Pro | 抖音分发 + Coze平台 | [[ByteDance_Doubao_Deep_Dive]] |

---

## 旗舰模型 Benchmark 对比

### 推理与数学

| **Benchmark** | **DeepSeek-R1** | **Qwen3** | **GLM-5.2** | **Kimi K2** | **ERNIE 4.5** | **Hunyuan-Pro 2.0** |
|---------------|----------------|-----------|-------------|-------------|---------------|-------------------|
| **MMLU** | 88.5% | ~88% | — | 89.5% | ~88% | ~86% |
| **MATH-500** | 97.3% | — | — | — | ~68% | ~58% |
| **AIME 2024** | 79.8% | — | — | 69.6% | — | — |

### 代码与工程

| **Benchmark** | **DeepSeek-V3** | **GLM-5.2** | **Kimi K2** | **MiniMax-M2.5** | **Yi-Coder-9B** |
|---------------|----------------|-------------|-------------|-----------------|----------------|
| **HumanEval** | 82.6% | — | — | — | 79.3% |
| **SWE-bench** | — | — | 65.8% | 80.2% | — |

> **🆕 GLM-5.2 (2026-06) 新增基准**: FrontierSWE (Opus 4.8 -1%, GPT-5.5 +1%), Terminal-Bench 2.1 (Opus 4.8 -4%, 较 GLM-5.1 +17.5%), MCP-Atlas (Opus 4.8 -0.8%), Code Arena (全球可用模型第一)。详见 [[GLM_Zhipu_Deep_Dive]] §GLM-5.2 正式发布与开源详解。

---

## 核心技术路线对比

### 注意力机制

| **厂商** | **注意力方案** | **复杂度** | **最大上下文** |
|----------|---------------|-----------|--------------|
| DeepSeek / GLM-5.2 | **MLA** | KV cache 压缩 95% | 1M |
| Kimi | **MLA** | KV cache 压缩 | 128K |
| MiniMax | **Lightning Attention** | O(n) 线性 | **4M** (外推) |
| Qwen / 百度 | **GQA** | 标准 O(n²) | 128K |
| 腾讯/阶跃/讯飞 | **GQA** | 标准 | 128K |

### MoE 架构采用

| **厂商** | **总参数** | **激活参数** | **专家数** | **路由策略** |
|----------|-----------|-------------|-----------|-------------|
| DeepSeek V4 | 1.6T | 49B | 256 | Top-8 + 共享专家 |
| Kimi K2 | 1.04T | 32.6B | 384 | Top-8 + 1 共享 |
| GLM-5.2 | 744B | 40B | 256 | MoE + 共享 + **IndexShare** (每4层共享 indexer) |
| Qwen3 | 235B | 22B | 128 | Top-8 |
| MiniMax M2.5 | 230B | 10B | — | 稀疏 MoE |
| 腾讯 Hunyuan-Large | 389B | 52B | ~64 | Top-2 + 1 共享 |
| 阶跃 Step-2 | ~1T+ | ~100B | ~64 | Top-2 |

---

## 开源生态对比

| **厂商** | **开源许可** | **HF 模型数** | **GitHub Stars** | **开源策略** |
|----------|-------------|-------------|-----------------|------------|
| DeepSeek | MIT / DeepSeek License | 50+ | 90K+ | 全量开源 |
| Qwen | Apache 2.0 | 100+ | 15K+ | 全量开源 |
| 零一万物 Yi | Apache 2.0 | 30+ | 8K+ | 全量开源 |
| GLM | **MIT** (GLM-5.2) / Apache 2.0 (旧版) | 40+ | 12K+ | GLM-5.2 MIT 纯开源 + Day 0 八家国产算力 |
| 书生浦语 | Apache 2.0 | 20+ | 20K+ (含工具链) | 全量+工具链 |
| 百川 | Baichuan License | 15+ | 17K+ | 模型开源 |
| 腾讯混元 | Hunyuan License | 10+ | 5K+ | 部分开源 |
| Kimi | Apache 2.0 | 10+ | 5K+ | 部分开源 |
| MiniMax | Apache 2.0 | 20+ | 3K+ | 部分开源 |
| 百度文心 | Apache 2.0 (框架) | — | — | 仅框架开源 |
| 字节豆包 | — | — | — | 几乎不开源 |

---

## 特色能力矩阵

| **能力维度** | **最强者** | **次强** |
|-------------|-----------|---------|
| 数学推理 | DeepSeek-R1, GLM-5.2 | Qwen3, Kimi K2 |
| 代码生成 | DeepSeek-V3, Yi-Coder | Qwen-Coder, GLM |
| 中文理解 | ERNIE 4.5, Qwen | DeepSeek-V3, GLM |
| 长上下文 | MiniMax (4M), DeepSeek | Qwen (1M), Kimi |
| 多模态 | Qwen-VL, Step-1.5V | GLM-4V, ERNIE |
| 视频生成 | HunyuanVideo, MiniMax Hailuo | 豆包视频 |
| 语音AI | 讯飞星火 | 百度文心 |
| 教育AI | 讯飞星火 | 百度文心 |
| 搜索增强 | 百度文心, 百川 | — |
| 数字人生成 | 商汤如影 | — |
| Agent 能力 | GLM-AutoGLM, MiMo | Kimi K2, MiniMax |
| 开发者平台 | Coze (字节), 千帆 (百度) | 方舟 (火山), TI (腾讯) |
| 端侧部署 | Qwen2.5-0.5B, ERNIE Tiny | Yi-1.5-6B |
| 评测工具 | OpenCompass (InternLM) | — |

---

## 学习路径

```mermaid
flowchart TD
    Start[开始学习中国大模型] --> Q1{你的目标?}
    
    Q1 -->|理解架构创新| Arch[架构对比]
    Q1 -->|选型部署| Deploy[实战部署]
    Q1 -->|学术研究| Research[论文与技术报告]
    Q1 -->|行业应用| Industry[行业场景]
    
    Arch --> A1[[DeepSeek_Deep_Dive]]<br/>MLA + MoE + FP8
    Arch --> A2[[MiniMax_Deep_Dive]]<br/>Lightning Attention
    Arch --> A3[[Kimi_Moonshot_Deep_Dive]]<br/>MuonClip + MoE
    
    Deploy --> D1[[Qwen_Deep_Dive]]<br/>最全模型选择
    Deploy --> D2[[Yi_01AI_Deep_Dive]]<br/>Apache 2.0 开源
    Deploy --> D3[[InternLM_Deep_Dive]]<br/>LMDeploy 工具链
    
    Research --> R1[[DeepSeek_Deep_Dive]]<br/>GRPO + R1 推理
    Research --> R2[[Qwen_Deep_Dive]]<br/>Hybrid Thinking
    
    Industry --> I1[[Baidu_ERNIE_Deep_Dive]]<br/>搜索增强 + 行业
    Industry --> I2[[iFlytek_Spark_Deep_Dive]]<br/>语音 + 教育
    Industry --> I3[[ByteDance_Doubao_Deep_Dive]]<br/>超级App + Coze
```

**推荐阅读顺序**:
1. 先读本文的对比表格，建立全局视野
2. 阅读 [[Chinese_LLM_Comparison_Matrix]] 了解全厂商横向对比
3. 选择感兴趣的厂商，深入其 Deep Dive 文档
4. 参考 [[05_大模型/05_LLM_Architectures/MoE_Case_Studies_DeepSeek_Mixtral]] 了解 MoE 共性

---

## 前置知识 (Prerequisites)

- **必修**: [[05_大模型/05_LLM_Architectures/LLM_Architectures]] — 理解 Transformer、MoE、GQA 等基础架构
- **推荐**: [[05_大模型/05_LLM_Architectures/MoE_Case_Studies_DeepSeek_Mixtral]] — MoE 路由与负载均衡
- **推荐**: [[05_大模型/09_Reasoning_Models/DeepSeek_R1_Technical_Analysis]] — 推理模型深度分析

---

## 开源生态与工具链

> 除了大模型本身，中国还拥有蓬勃的开源 AI 生态

- [[Chinese_Open_Source_Top100]] — 中国开源大模型生态 Top 100 项目全景（含开源基金会、GitHub 星标排名、选型决策树）
- [[Chinese_LLM_Comparison_Matrix]] — 全厂商技术/Benchmark/定价/选型对比
- [[Chinese_LLM_Training_Inference_Platforms]] — 训推平台实战参考（分布式训练/MoE/RLHF/推理优化）

### ModelScope 模型托管数据

> 基于 ModelScope 魔搭社区官方 API 全量抓取（2026-06-19，共 1,621 个官方模型、1.97 亿次下载）

- [[ModelScope_Model_Catalog]] — 15 家厂商 ModelScope 模型目录（组织信息 + Top 模型精选 + 统计）
- [[ModelScope_Model_Index]] — 全量 1,621 个模型完整索引表（Qwen/InternLM 已拆分）
- [[ModelScope_Model_Index_Qwen]] — 通义千问 437 个模型完整索引（拆分页）
- [[ModelScope_Model_Index_InternLM]] — 书生 InternLM 443 个模型完整索引（拆分页）
- 原始数据：`来源/modelscope/raw/`（含可复跑抓取脚本）

---

## 关键术语速查 (Key Terms)

- **MLA (Multi-head Latent Attention)**: 多头潜在注意力，通过低秩压缩减少 KV Cache 95%
- **Lightning Attention**: 闪电注意力，线性复杂度 O(n) 处理超长序列
- **GRPO (Group Relative Policy Optimization)**: 分组相对策略优化，无需 Critic 的 RL 算法
- **MuonClip**: Kimi K2 的优化器，结合 Muon + QK-Clip 稳定训练
- **Hybrid Thinking**: 混合思考模式，在深度推理和快速响应间动态切换
- **FP8 Training**: 8 位浮点训练，内存减半速度翻倍
- **MTP (Multi-token Prediction)**: 多 Token 预测，提升训练吞吐量
- **SAG (Search-Augmented Generation)**: 搜索增强生成，百度/百川核心能力
- **Agent-First Design**: MiMo 的设计理念，模型作为 Agent 系统大脑

---

*Last updated: 2026-06-19*
