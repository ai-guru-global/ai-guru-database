---
title: Hot Pages
tier: peripheral
aliases:
  - Hot
sources: []

name_zh: "热门页面"
---
# Hot Pages — 最近新增与高价值页面

> 中文简称：热门页面

*Last updated: 2026-06-25T15:59:34+08:00*

## 2026-06-25 21 个概念大白话 + 26 张概念卡片

> 把架构、训练、推理、优化、应用、Agentic、评估、Harness 八大类 21 个核心概念用大白话讲清楚，并沉淀为 `概念/` 概念卡片 + 6 张主章节 for_dummy 专题页。

### 补充：2 个深度学习基础概念卡片
- [[概念/activation-value|激活值]] — 神经网络神经元的输出响应强度
- [[概念/gradient-descent|梯度下降]] — 最小化模型误差的参数优化算法

### 主章节大白话专题页
- [[05_大模型/05_LLM架构/04_LLM_架构_Evolution|LLM 架构演进大白话]] — KV 压缩、Mamba、RetNet
- [[07_模型训练/Data_and_FineTuning_for_dummy|数据与微调大白话]] — 数据清洗 Pipeline、DoRA、RS-LoRA
- [[10_部署推理/03_推理优化/06_kv_cache_inference_optimization|推理优化大白话]] — SGLang、动态批调度、GGUF、SmoothQuant、TensorRT-LLM
- [[14_RAG系统/04_高级RAG/02_Agentic_RAG_指南|Agentic RAG 应用大白话]] — Agentic RAG、Text2SQL、代码生成工作流
- [[15_智能体/Agent_Safety_Evaluation_for_dummy|Agent 安全与评估大白话]] — 工具调用安全、Agent 评估基准
- [[08_模型评估/02_基准测试/LLM_Benchmarks_for_dummy|LLM 评估与测试大白话]] — BBH、Arena、红队测试、CI 集成评估、A/B 测试框架

### 新增概念卡片（26 张）
- 架构：[[概念/kv-cache-compression|KV Cache 压缩]]、[[概念/mamba|Mamba]]、[[概念/retnet|RetNet]]
- 训练：[[概念/data-cleaning-pipeline|数据清洗 Pipeline]]、[[概念/dora|DoRA]]、[[概念/rs-lora|RS-LoRA]]
- 推理：[[概念/sglang|SGLang]]、[[概念/dynamic-batch-scheduling|动态批调度]]
- 优化：[[概念/gguf|GGUF]]、[[概念/smoothquant|SmoothQuant]]、[[概念/tensorrt-llm|TensorRT-LLM]]
- 应用：[[概念/agentic-rag|Agentic RAG]]、[[概念/text2sql|Text2SQL]]、[[概念/code-generation-workflow|代码生成工作流]]
- Agentic：[[概念/tool-calling|工具调用]]、[[概念/tool-calling-safety|工具调用安全]]、[[概念/agent-evaluation-benchmarks|Agent 评估基准]]
- 评估：[[概念/bbh|BBH]]、[[概念/llm-arena|LLM Arena]]、[[概念/red-teaming|红队测试]]
- Harness：[[概念/ci-integrated-evaluation|CI 集成评估]]、[[概念/ab-testing-framework|A/B 测试框架]]、[[概念/online-evaluation|在线评估]]
- 基础：[[概念/code-generation|代码生成]]、[[概念/llm-safety|LLM 安全]]、[[概念/llm-production-pipeline|LLM 生产流水线]]

## 2026-06-25 GPUStack 专题补完 FAQ

> 在 GPUStack 深度解析和入门指南中新增两个高频问题的大白话解答。

- [[10_部署推理/05_硬件与算力/01_GPUStack_深入分析|GPUStack 深度解析]] — 新增 14.4 大白话 FAQ: GPUStack 底座不是 K8s; PPU 通过驱动 + Runtime 探测纳管
- [[概念/GPU/gpustack|GPUStack 入门指南]] — 新增“常见问题（大白话）”节, 解释 K8s 关系与 PPU 纳管
- [[概念/gpustack|GPUStack 概念卡片]] — 补充“底座不是 K8s”和“PPU 国产芯片纳管”要点

## 2026-06-15 大白话概念系列（2 页）

> 用生活化语言拆解 AI 核心概念，降低理解门槛。

- [[概念/embeddings-vectors-mrl-plain]] — Embedding、向量与 MRL 大白话
- [[概念/how-llm-answers-plain]] — 大模型回答问题是一道数学题吗？大白话

## 2026-06-19 ModelScope 全量厂商模型导入（15 厂商 / 1,621 模型）

> 通过 ModelScope 官方 API 全量抓取 15 家中国大模型厂商的组织信息与已发布模型清单，共 1,621 个官方模型、1.97 亿次累计下载。

### 模型目录与索引（05_大模型/15_中国LLM生态/）
- [[05_大模型/15_中国LLM生态/ModelScope_Model_Catalog]] — 15 家厂商 ModelScope 模型目录（组织信息 + Top 模型精选 + 许可/任务统计）
- [[05_大模型/15_中国LLM生态/ModelScope_Model_Index]] — 全量 1,621 个模型完整索引表（按厂商分组、下载量排序）

### 原始数据（来源/modelscope/）
- `来源/modelscope/README.md` — 数据源说明 + 抓取方法 + org→namespace 映射
- `来源/modelscope/raw/*.json` — 15 个厂商的完整模型元数据（含可复跑 `scraper.py`）

**亮点**: Qwen 437 模型 / 1.46 亿次下载居首；发现 ByteDance 官方模型实际位于 `bytedance-community`（非 `ByteDance-Seed`）、InternLM 归属 `Shanghai_AI_Laboratory` namespace。

## 2026-06-19 Yeasy 全书蒸馏补全（10 新页）

> 完成最后两本未蒸馏书（llm_internals、ai_beginner_guide 剩余章节），yeasy 9 本书全部融入 wiki。

### LLM 原理与架构（4 页，05_大模型/）
- [[05_大模型/05_LLM架构/06_LLM_Internals_架构]] — 序列建模演进、注意力机制、Transformer 组件、位置编码
- [[05_大模型/05_LLM架构/09_LLM_Internals_训练]] — 预训练/Scaling Law、AdamW、分布式训练、对齐 SFT/RLHF/DPO/LoRA
- [[05_大模型/05_LLM架构/07_LLM_Internals_推理]] — 解码策略、KV Cache/GQA/MLA、Flash Attention、量化、投机解码
- [[05_大模型/05_LLM架构/LLM_Internals_Models_Frontiers]] — BERT/GPT/Llama/DeepSeek 家族、MoE/SSM/测试时计算

### AI 入门基础（6 页，跨目录）
- [[00_入门/01_基础入门/02_AI基础]] — AI 定义/历史/强vs弱、AI⊃ML⊃DL、技术生态
- [[02_机器学习/01_机器学习基础/07_ML_入门]] — 四大学习范式、评估指标与选型
- [[03_深度学习/Deep_Learning_For_Beginners]] — 神经网络、梯度下降、主流架构与局限
- [[05_大模型/01_LLM基础/04_LLM_入门]] — Next Token Prediction、注意力、预训练→微调→RLHF
- [[00_入门/AI_Application_Scenarios]] — BROKE 框架、上下文工程、五大应用场景
- [[17_伦理安全/01_伦理基础/04_ai_ethics_future]] — 伦理/对齐、就业、AGI、AI 硬件与量子

---

## 2026-06-19 Yeasy 深度蒸馏（15 新页 + 5 页去重精简）

> 在 26 页初版基础上进一步消化蒸馏：概念原子化、跨书综合、速查表、去重压缩。

### 概念原子页（8 页，概念/）
- [[概念/mcp]] — MCP 模型上下文协议
- [[概念/agent-loop]] — Agent Loop 运行时循环
- [[概念/agent-harness]] — Agent Harness 执行治理层
- [[概念/context-engineering]] — 上下文工程
- [[概念/prompt-injection]] — 提示注入攻击与防御
- [[概念/hallucination]] — LLM 幻觉根因与缓解
- [[概念/a2a-protocol]] — A2A 智能体互操作协议
- [[概念/guardrails]] — AI 护栏体系

### 跨书综合页（4 页，治理/）
- [[治理/_meta/_synthesis-readme-archive]] — 提示词→上下文→Harness 三阶演进
- [[治理/synthesis-llm-security-pipeline]] — 安全全链路：训练投毒到推理防御
- [[治理/synthesis-architecture-selection-guide]] — 架构选型决策树
- [[治理/synthesis-memory-systems]] — 记忆体系全景：KV Cache 到知识图谱

### 速查表（3 页，治理/）
- [[治理/cheatsheets/cheatsheet-llm-inference]] — LLM 推理技术速查
- [[治理/cheatsheets/cheatsheet-agent-design]] — 智能体架构设计速查
- [[治理/cheatsheets/cheatsheet-security-defense]] — LLM 安全防御速查

### 去重精简（5 页，共减少 198 行）
- Prompt_Engineering_Advanced_Apps (-112 行): ReAct/提示注入/MCP 压缩为引用
- Claude_Agent_Architecture (-34 行): Extended Thinking/ReAct 压缩为引用
- Claude_Complete_Guide (-23 行): MCP 压缩为引用
- Agentic_AI_Complete_Guide (-16 行): CoT/MCP 压缩为引用
- AgentOps_Production_Guide (-13 行): Agent Loop 压缩为引用

---

## 2026-06-17 GLM-5.2 正式上线并开源 (智谱 AI)

> **重大厂商事件** — 智谱发布 GLM-5.2，定位"长程任务"Agent 大脑，多维度刷新中国开源大模型上限。

### 关键事实
- 🥇 **Code Arena 全球可用模型第一** (百万用户盲测前端开发)
- 📏 **Solid 1M 无损上下文** (数百 K 后不劣化)
- 🏗️ **IndexShare 稀疏注意力**: 每 4 层共享 indexer，1M 上下文 FLOPs/token 降至 1/2.9
- 🇨🇳 **Day 0 八家国产算力适配**: 昇腾 / 平头哥 / 摩尔线程 / 寒武纪 / 昆仑芯 / 沐曦 / 海光 / 壁仞
- 📜 **MIT 协议开源** (无地域限制)
- 📊 **Benchmark**: FrontierSWE 仅落后 Opus 4.8 1% (超 GPT-5.5 / Opus 4.7), Terminal-Bench 2.1 较 GLM-5.1 +17.5%

### 更新页面
- [[05_大模型/15_中国LLM生态/09_GLM_Zhipu_深入分析]] — 新增 §"GLM-5.2 正式发布与开源详解" (9 小节, 含架构/国产算力/部署/Agent 产品/未来路线)
- [[05_大模型/15_中国LLM生态/04_Chinese_LLM_对比_矩阵]] — GLM 行升级到 GLM-5.2, 国产算力适配列扩展为 8 家
- [[05_大模型/15_中国LLM生态/README]] — 第一梯队 GLM 行更新
- [[来源/wechat/2026-06-glm-5.2-release]] — 原文存档

### 信源
- 原文: https://mp.weixin.qq.com/s/GRzZ1NCCe1hWzYvCxN003Q
- 官方 Blog: https://z.ai/blog/glm-5.2
- GitHub: https://github.com/zai-org/GLM-5

---

## 2026-06-16 Yeasy AI 知识库系列融合（26 页）

### 提示词与上下文工程
- [[05_大模型/08_提示工程/13_Prompt工程_完整_指南]] — 提示词工程核心技术
- [[05_大模型/08_提示工程/12_Prompt工程_高级_Apps]] — 提示词高级应用
- [[05_大模型/08_提示工程/15_Prompt工程_模板_模式]] — 模板库与反模式
- [[05_大模型/08_提示工程/01_Context_工程_指南]] — 上下文工程权威指南
- [[05_大模型/08_提示工程/02_Context_工程_模式]] — 上下文工程模式

### LLM 原理与架构
- [[05_大模型/Transformer_Deep_Dive]] — Transformer 深度解析
- [[07_模型训练/01_训练基础/03_LLM_训练_深入分析]] — LLM 训练深度解析
- [[10_部署推理/03_推理优化/02_LLM推理_深入分析]] — LLM 推理深度解析
- [[05_大模型/05_LLM架构/04_LLM_架构_Evolution]] — LLM 架构演进

### AI 入门与新架构
- [[00_入门/02_技术概览/04_AI_推理模型_指南]] — 推理模型指南
- [[00_入门/AI_New_Architectures]] — 新架构（SSM/DeepSeek）
- [[00_入门/02_技术概览/02_AI_多模态_GenAI]] — 多模态与生成式 AI

### Claude 与 AI 编码
- [[16_编程/05_开发工具/03_Claude_完整_指南]] — Claude 完整指南
- [[16_编程/05_开发工具/02_Claude_Code_深入分析]] — Claude Code 深度解析
- [[16_编程/02_理论基础/02_Claude_Agent_架构]] — Claude Agent 架构

### 智能体与 Harness
- [[15_智能体/01_Agent基础/12_Agentic_AI_完整_指南]] — 智能体 AI 完整指南
- [[概念/Agent/multi-agent]] — 多智能体系统
- [[15_智能体/03_Agent工作流/03_AgentOps_生产_指南]] — AgentOps 生产指南
- [[15_智能体/04_Agent脚手架/05_脚手架_工程_完整_指南]] — Harness 工程完整指南
- [[15_智能体/04_Agent脚手架/02_脚手架_核心_Subsystems]] — Harness 核心子系统
- [[15_智能体/04_Agent脚手架/07_脚手架_生产_安全]] — Harness 生产安全

### OpenClaw
- [[15_智能体/11_OpenClaw生态/04_OpenClaw_完整_指南]] — OpenClaw 完整指南
- [[15_智能体/11_OpenClaw生态/06_OpenClaw_Internals]] — OpenClaw 内部实现

### 安全
- [[17_伦理安全/06_系统安全/05_LLM_安全_完整_指南]] — LLM 安全完整指南
- [[17_伦理安全/06_系统安全/06_LLM_安全_Defense_指南]] — LLM 安全防御指南
- [[17_伦理安全/06_系统安全/01_Agent_RAG_安全]] — Agent 与 RAG 安全
