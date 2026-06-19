---
title: Hot Pages
---

# Hot Pages — 最近新增与高价值页面

*Last updated: 2026-06-19*

## 2026-06-19 ModelScope 全量厂商模型导入（15 厂商 / 1,621 模型）

> 通过 ModelScope 官方 API 全量抓取 15 家中国大模型厂商的组织信息与已发布模型清单，共 1,621 个官方模型、1.97 亿次累计下载。

### 模型目录与索引（04_NLP_LLMs/Chinese_LLM_Ecosystem/）
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/ModelScope_Model_Catalog]] — 15 家厂商 ModelScope 模型目录（组织信息 + Top 模型精选 + 许可/任务统计）
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/ModelScope_Model_Index]] — 全量 1,621 个模型完整索引表（按厂商分组、下载量排序）

### 原始数据（_sources/modelscope/）
- `_sources/modelscope/README.md` — 数据源说明 + 抓取方法 + org→namespace 映射
- `_sources/modelscope/raw/*.json` — 15 个厂商的完整模型元数据（含可复跑 `scraper.py`）

**亮点**: Qwen 437 模型 / 1.46 亿次下载居首；发现 ByteDance 官方模型实际位于 `bytedance-community`（非 `ByteDance-Seed`）、InternLM 归属 `Shanghai_AI_Laboratory` namespace。

## 2026-06-19 Yeasy 全书蒸馏补全（10 新页）

> 完成最后两本未蒸馏书（llm_internals、ai_beginner_guide 剩余章节），yeasy 9 本书全部融入 wiki。

### LLM 原理与架构（4 页，04_NLP_LLMs/）
- [[04_NLP_LLMs/LLM_Internals_Architecture]] — 序列建模演进、注意力机制、Transformer 组件、位置编码
- [[04_NLP_LLMs/LLM_Internals_Training]] — 预训练/Scaling Law、AdamW、分布式训练、对齐 SFT/RLHF/DPO/LoRA
- [[04_NLP_LLMs/LLM_Internals_Inference]] — 解码策略、KV Cache/GQA/MLA、Flash Attention、量化、投机解码
- [[04_NLP_LLMs/LLM_Internals_Models_Frontiers]] — BERT/GPT/Llama/DeepSeek 家族、MoE/SSM/测试时计算

### AI 入门基础（6 页，跨目录）
- [[00_AI_Introduction/AI_Beginner_Fundamentals]] — AI 定义/历史/强vs弱、AI⊃ML⊃DL、技术生态
- [[02_Machine_Learning/ML_For_Beginners]] — 四大学习范式、评估指标与选型
- [[03_Deep_Learning/Deep_Learning_For_Beginners]] — 神经网络、梯度下降、主流架构与局限
- [[04_NLP_LLMs/LLM_For_Beginners]] — Next Token Prediction、注意力、预训练→微调→RLHF
- [[00_AI_Introduction/AI_Application_Scenarios]] — BROKE 框架、上下文工程、五大应用场景
- [[19_Ethics_Safety/AI_Ethics_And_Future_For_Beginners]] — 伦理/对齐、就业、AGI、AI 硬件与量子

---

## 2026-06-19 Yeasy 深度蒸馏（15 新页 + 5 页去重精简）

> 在 26 页初版基础上进一步消化蒸馏：概念原子化、跨书综合、速查表、去重压缩。

### 概念原子页（8 页，concepts/）
- [[concepts/mcp]] — MCP 模型上下文协议
- [[concepts/agent-loop]] — Agent Loop 运行时循环
- [[concepts/agent-harness]] — Agent Harness 执行治理层
- [[concepts/context-engineering]] — 上下文工程
- [[concepts/prompt-injection]] — 提示注入攻击与防御
- [[concepts/hallucination]] — LLM 幻觉根因与缓解
- [[concepts/a2a-protocol]] — A2A 智能体互操作协议
- [[concepts/guardrails]] — AI 护栏体系

### 跨书综合页（4 页，_meta/）
- [[_meta/synthesis-engineering-evolution]] — 提示词→上下文→Harness 三阶演进
- [[_meta/synthesis-llm-security-pipeline]] — 安全全链路：训练投毒到推理防御
- [[_meta/synthesis-architecture-selection-guide]] — 架构选型决策树
- [[_meta/synthesis-memory-systems]] — 记忆体系全景：KV Cache 到知识图谱

### 速查表（3 页，_meta/）
- [[_meta/cheatsheet-llm-inference]] — LLM 推理技术速查
- [[_meta/cheatsheet-agent-design]] — 智能体架构设计速查
- [[_meta/cheatsheet-security-defense]] — LLM 安全防御速查

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
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/GLM_Zhipu_Deep_Dive]] — 新增 §"GLM-5.2 正式发布与开源详解" (9 小节, 含架构/国产算力/部署/Agent 产品/未来路线)
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/Chinese_LLM_Comparison_Matrix]] — GLM 行升级到 GLM-5.2, 国产算力适配列扩展为 8 家
- [[04_NLP_LLMs/Chinese_LLM_Ecosystem/README]] — 第一梯队 GLM 行更新
- [[_sources/wechat/2026-06-glm-5.2-release]] — 原文存档

### 信源
- 原文: https://mp.weixin.qq.com/s/GRzZ1NCCe1hWzYvCxN003Q
- 官方 Blog: https://z.ai/blog/glm-5.2
- GitHub: https://github.com/zai-org/GLM-5

---

## 2026-06-16 Yeasy AI 知识库系列融合（26 页）

### 提示词与上下文工程
- [[04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering_Complete_Guide]] — 提示词工程核心技术
- [[04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering_Advanced_Apps]] — 提示词高级应用
- [[04_NLP_LLMs/Prompt_Engineering/Prompt_Engineering_Templates_Patterns]] — 模板库与反模式
- [[04_NLP_LLMs/Context_Engineering_Guide]] — 上下文工程权威指南
- [[04_NLP_LLMs/Context_Engineering_Patterns]] — 上下文工程模式

### LLM 原理与架构
- [[04_NLP_LLMs/Transformer_Deep_Dive]] — Transformer 深度解析
- [[04_NLP_LLMs/LLM_Training_Deep_Dive]] — LLM 训练深度解析
- [[04_NLP_LLMs/LLM_Inference_Deep_Dive]] — LLM 推理深度解析
- [[04_NLP_LLMs/LLM_Architecture_Evolution]] — LLM 架构演进

### AI 入门与新架构
- [[00_AI_Introduction/AI_Reasoning_Models_Guide]] — 推理模型指南
- [[00_AI_Introduction/AI_New_Architectures]] — 新架构（SSM/DeepSeek）
- [[00_AI_Introduction/AI_Multimodal_GenAI]] — 多模态与生成式 AI

### Claude 与 AI 编码
- [[17_AI_Coding/02_Tools/Claude_Complete_Guide]] — Claude 完整指南
- [[17_AI_Coding/02_Tools/Claude_Code_Deep_Dive]] — Claude Code 深度解析
- [[17_AI_Coding/01_Theory/Claude_Agent_Architecture]] — Claude Agent 架构

### 智能体与 Harness
- [[13_Agent_Production/Agent_Foundations/Agentic_AI_Complete_Guide]] — 智能体 AI 完整指南
- [[13_Agent_Production/Agent_Foundations/Multi_Agent_Systems_Guide]] — 多智能体系统
- [[13_Agent_Production/Agent_Workflow/AgentOps_Production_Guide]] — AgentOps 生产指南
- [[13_Agent_Production/Agent_Harness/Harness_Engineering_Complete_Guide]] — Harness 工程完整指南
- [[13_Agent_Production/Agent_Harness/Harness_Core_Subsystems]] — Harness 核心子系统
- [[13_Agent_Production/Agent_Harness/Harness_Production_Security]] — Harness 生产安全

### OpenClaw
- [[13_Agent_Production/23_OpenClaw_Ecosystem/OpenClaw_Complete_Guide]] — OpenClaw 完整指南
- [[13_Agent_Production/23_OpenClaw_Ecosystem/OpenClaw_Internals]] — OpenClaw 内部实现

### 安全
- [[19_Ethics_Safety/LLM_Security_Complete_Guide]] — LLM 安全完整指南
- [[19_Ethics_Safety/LLM_Security_Defense_Guide]] — LLM 安全防御指南
- [[19_Ethics_Safety/Agent_RAG_Security]] — Agent 与 RAG 安全
