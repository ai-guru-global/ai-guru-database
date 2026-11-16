---
title: "百炼产品深度沉淀"
category: 12_架构基建/Alibaba_Cloud
tags: ["bailian", "dashscope", "maas", "agent", "fine-tuning", "mcp"]
summary: "阿里云百炼（Model Studio）产品深度沉淀：基于 bl CLI 技能家族 v2.5.1 实测提炼的 25 页知识体系——平台计费、模型矩阵、微调部署、Managed Agent IaC、Sandbox、MCP、记忆、可观测与面试视角。"
created: 2026-11-06
updated: 2026-11-06
tier: core
aliases: ["百炼深度", "Bailian Deep Dive", "Model Studio 深度"]
sources: ["本机 bailian-* 技能家族（bl v2.5.1，2026-11）"]
name_zh: "百炼产品深度沉淀"
---

# 百炼产品深度沉淀

> 中文简称：百炼深度

> **一句话理解**: 把阿里云百炼从「一个能调模型的控制台」拆开看透：平台怎么计费、模型怎么选、微调部署怎么闭环、Agent 基建（IaC/沙箱/记忆/MCP）怎么搭、上了生产怎么管——全部来自本机 11 个官方技能的第一手提炼。

> 信源与时效：本系列基于用户本机安装的 bailian-* 技能家族（`bl` CLI v2.5.1，2026-11 时点）提炼，命令细节以 `bl <cmd> --help` 为准；概览层见 [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/07_MaaS平台_百炼与千问AI平台|MaaS 平台：百炼与千问AI平台]]，本系列是其逐域深潜。

---

## 一、体系结构

25 页按「功能域 × 视角」组织：

| 组 | 页码 | 回答的问题 |
|--------|------|------------|
| 平台与生态 | 01-04 | 百炼在阿里 AI 版图的位置？怎么计费、鉴权、从 OpenAI 迁入？ |
| 模型服务 | 05-08 | 模型广场有什么货？怎么选型？多模态怎么调？ |
| 微调与部署 | 09-12 | 数据→微调→部署→调用的完整闭环与避坑 |
| Agent 基建 | 13-16 | Managed Agent IaC、Session/记忆库、Sandbox、MCP/Skill 生态 |
| 知识与记忆 | 17-19 | 知识库 RAG、联网搜索路由、个人长期记忆 |
| CLI 工程 | 20-22 | bl 总纲、共享协议护栏、三层文档库（Agent 工程范本） |
| 视角 | 23-25 | 竞品对比、生产可观测、面试 25 题 |

---

## 二、全目录

### 平台与生态

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/01_Bailian_Platform_Overview|百炼平台全景与生态位]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/02_Billing_Plans_And_Cost|计费体系与套餐]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/03_Workspace_Auth_Config|工作空间鉴权与配置]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/04_OpenAI_Compatibility_SDK|OpenAI 兼容与 SDK 双轨]]

### 模型服务

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/05_Model_Matrix_Plaza|模型矩阵与模型广场]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/06_Model_Selection_Methodology|模型选型方法论]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/07_Image_Video_Generation|图像与视频生成]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/08_Speech_TTS_ASR|语音合成与识别]]

### 微调与部署

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/09_Finetune_Pipeline|微调全流程]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/10_Deploy_Capacity_Management|部署与容量管理]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/11_Train_To_Deploy_Playbook|训练到部署闭环实战]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/12_App_Workflow_Orchestration|应用与工作流编排]]

### Agent 基建

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/13_Managed_Agent_IaC|Managed Agent 声明式基础设施]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/14_Session_MemoryStore|Session 交互与 Memory Store]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/15_Sandbox_Lifecycle|Sandbox 沙箱生命周期]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/16_MCP_Marketplace_Skills|MCP 市场与 Skill 生态]]

### 知识与记忆

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/17_Knowledge_Base_RAG|知识库与 RAG]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/18_Web_Search_Routing|联网搜索路由]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/19_Personal_Memory|个人长期记忆]]

### CLI 工程

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/20_BL_CLI_Guide|bl CLI 总纲]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/21_Shared_Protocol_Guardrails|共享协议与安全护栏]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/22_Docs_Three_Layer_Wiki|文档知识库三层架构]]

### 视角

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/23_Competitor_Comparison|竞品对比视角]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/24_Production_Observability|生产实践与可观测视角]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/25_Interview_Angle|面试视角（25 题）]]

---

## 三、五条学习路径

**应用开发者线**：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/01_Bailian_Platform_Overview|平台全景]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/04_OpenAI_Compatibility_SDK|OpenAI 兼容]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/06_Model_Selection_Methodology|选型方法论]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/17_Knowledge_Base_RAG|知识库 RAG]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/18_Web_Search_Routing|联网搜索]]

**模型工程师线**：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/05_Model_Matrix_Plaza|模型矩阵]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/09_Finetune_Pipeline|微调全流程]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/10_Deploy_Capacity_Management|部署与容量]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/11_Train_To_Deploy_Playbook|闭环实战]]

**Agent 工程师线**：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/13_Managed_Agent_IaC|Managed Agent IaC]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/14_Session_MemoryStore|Session 与记忆库]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/15_Sandbox_Lifecycle|Sandbox]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/16_MCP_Marketplace_Skills|MCP 与 Skill]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/19_Personal_Memory|个人记忆]]

**运维与成本线**：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/02_Billing_Plans_And_Cost|计费体系]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/24_Production_Observability|生产可观测]] → [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/21_Shared_Protocol_Guardrails|安全护栏]]

**面试速通线**：[[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/25_Interview_Angle|面试 25 题]]（每题指向对应知识页）

---

## 四、与既有页面的关系

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/14_OpenTrek/README|OpenTrek 产品深度沉淀]]：私有化智能体工厂姊妹篇（本系列=公有云 MaaS 视角）
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/07_MaaS平台_百炼与千问AI平台|MaaS 平台总览]]：概览层，本系列是其深潜
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/06_Qwen模型家族_2026|Qwen 模型家族 2026]]：模型侧全景
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/09_Token经济与商业化|Token 经济与商业化]]：商业侧（Token Plan/计费背景）
- [[12_架构基建/06_云厂商/Alibaba_Cloud/架构方案/13_架构方案_企业知识库RAG|企业知识库 RAG 架构方案]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/架构方案/14_架构方案_Agent智能体平台|Agent 智能体平台架构方案]]、[[12_架构基建/06_云厂商/Alibaba_Cloud/架构方案/18_架构方案_模型微调与行业定制|模型微调架构方案]]：对应架构方案层
- [[15_智能体/20_Agentic_Infra/09_Sandbox_隔离技术与沙箱平台选型|Sandbox 隔离技术与平台选型]]：沙箱横评（百炼 Sandbox 是其中一个选项）
- [[概念/General/bailian-exclusive|百炼专属概念]]、[[概念/General/alibaba-cloud|阿里云]]：概念卡

---

*Last updated: 2026-11-06*
