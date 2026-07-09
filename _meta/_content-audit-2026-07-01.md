---
title: 全章节内容审计与缺口分析报告 (2026-07-01)
category: meta
tags: [meta, audit, content-gap, production, 2026]
summary: 对 ai-guru-database 全部 25 个数字章节进行内容完整性审计，从高校教材与企业生产环境双重视角识别缺口，列出 P0/P1/P2 优先级补充建议。
created: 2026-07-01
updated: 2026-07-01
sources: []
---

# 全章节内容审计与缺口分析报告

生成时间: 2026-07-01

## 一、审计方法

- **审计范围**: 00-21 主知识章节 + 90/93/94 辅助章节，共 25 个目录。
- **审计视角**: 高校教材系统度 + 企业生产环境完备度（可扩展、可观测、高可用、成本优化、安全合规）。
- **优先级定义**:
  - **P0（生产环境必备）**: 缺失会直接影响线上可靠性、合规性或工程落地。
  - **P1（行业主流）**: 2024-2026 年该领域的关键技术/框架/平台，教材应覆盖。
  - **P2（前沿补充）**: 扩展视野、提升前瞻性的内容。

## 二、总体评分一览

| 章节 | 评分 | 一句话结论 |
|------|------|-----------|
| 00_AI_Introduction | -/10 | `AI入门` 作为高校 AI 通识课教材导入章节已具备扎实骨架，概念、历史、工具、伦理、案例、实验覆盖较全，小白版与可运行实验是亮点；但面向企业生产环境的内容明显薄弱，RA... |
| 01_Fundamentals | -/10 | 作为连接统计与机器学习的进阶数学基础，可与概率统计章节形成进阶路径。... |
| 02_Machine_Learning | -/10 | 一句话结论：该章节在经典机器学习理论与核心算法上覆盖较全（尤其集成学习、推荐、时序、异常检测、AutoML 深度好），但严重偏向“学习/竞赛”视角，生产环境所需的 MLOps、部署、监控、特征平台、可... |
| 03_Deep_Learning | -/10 | `深度学习` 在神经网络基础、优化方法、前沿话题（SSM/GNN/SSL/World Models）上质量较高且覆盖较全，但作为深度学习章节的「主章节」，仍缺少 CNN/Tra... |
| 04_Computer_Vision | -/10 | 一句话结论：`计算机视觉` 在概念教学、零基础入门和代码示例层面已相当扎实，但距离「企业生产级知识库」仍有明显缺口——缺少部署运维、成本安全、MLOps 数据管线、实时视频分... |
| 05_NLP_LLMs | -/10 | `大模型` 在基础理论、模型生态、微调/提示词工程、数据工程方面覆盖扎实，中外大模型生态与 2026 推理/长上下文专题表现突出；但作为"生产环境必备"的 RAG、部署 Runbook... |
| 06_Reinforcement_Learning | -/10 | 8. Neuromorphic RL / 边缘 RL 硬件部署。... |
| 07_Model_Training | -/10 | 5. TinyML / 边缘模型训练：端侧小模型训练、知识蒸馏到边缘设备缺失。... |
| 08_Model_Evaluation | -/10 | > 注意：目录下存在大量 `* 2.md` 重复文件（如 `Agentic_Benchmark_Guide 2.md` 等），是内容治理层面的问题。... |
| 09_Testing | -/10 | `AI测试` 已建立起结构清晰、代码示例丰富的 LLM 测试知识体系，尤其在 RAG 评估、Prompt 测试、安全红队、回归测试、契约测试和 Java/Spring AI 测试方面达到行... |
| 10_Deployment_Inference | -/10 | 7. 联邦/隐私推理：TEE（可信执行环境）、联邦学习推理、端云协同推理。... |
| 11_MLOps_Pipeline | -/10 | 10. AutoML Ops（自动化架构搜索流水线）... |
| 12_Architecture_Infrastructure | -/10 | 25. 神经形态/模拟计算芯片... |
| 13_AI_Ops | -/10 | `AI运维` 在 SRE 方法论、事故响应 Playbook、GPU/K8s 排障和顶层全景方面已经达到较高水准，但可观测性、成本治理、混沌工程、Agent/LLM Ops、安全运营等子领域... |
| 14_RAG_Systems | -/10 | `RAG系统` 在 RAG 概念普及、主流框架、向量数据库和嵌入模型方面已有扎实覆盖，尤其适合初学者和选型阶段；但生产级运维、安全合规、系统评估、成本优化以及 GraphRAG/Re... |
| 15_Agent_Production | -/10 | 8. Agent 量化与边缘部署（端侧 Agent、TinyAgent、移动设备推理优化）... |
| 16_AI_Coding | -/10 | 一句话结论：骨架扎实、方法论领先，但工具指南深度参差不齐、企业生产级 Runbook 与合规治理不足、开源生态与多语言实践覆盖薄弱，亟需补齐 P0 级文件并清理重复文件。... |
| 17_Ethics_Safety | -/10 | `伦理安全` 已经具备了从入门到进阶、从攻击面到防御架构、从对齐技术到治理合规的完整骨架，核心文档（AI Security 2026、Safety Evaluation、LLM... |
| 18_AI_Applications_Industry | -/10 | 30. 开源/商业平台选型 — 缺 Hugging Face、NVIDIA AI Enterprise、Azure OpenAI、百度千帆等行业选型。... |
| 19_Talks | -/10 | > 注：若保持「按人物组织」风格，可新建 `业界观点/Synthesis/` 子目录存放上述主题合成文件；若希望与人物目录同级，可直接放在 `业界观点/` 根目录。... |
| 20_Papers_and_Research | -/10 | 10. 论文阅读方法论与复现指南：如何读论文、复现 checklist、Baseline 调试、实验设计。... |
| 21_Interviews | -/10 | 一句话结论：`面试岗位` 在「头部工程岗位（Infra/MLE/LLM Platform/NLP）」已具备可使用的题库骨架，但约 70% 的岗位仍停留在单文件骨架状态，且 Agent... |
| 90_Learn | -/10 | 8. 量子机器学习概览 2026：量子计算对 ML 的潜在影响。... |
| 93_Templates | -/10 | `93_Templates` 现有的 3 篇工具领域文章质量尚可，文档模板规范也较为完整，但目录结构扁平、重复文件未清理、缺少生产环境刚需的 Runbook 与工具链覆盖，也未能反映 2024-202... |
| 94_Visualization | -/10 | `94_Visualization` 在训练监控、模型可解释性和基础系统仪表盘方面已有扎实的入门-进阶内容，但在 LLM 可观测性、云原生 MLOps 监控、成本治理、事故 Runbook 以及 20... |

## 三、各章节详细审计

### 00_AI_Introduction

`AI入门` 是 ai-guru-database 的通识导入章节（supporting tier），定位为大专院校 AI 通识课教材入口，面向零基础读者建立 AI 认知框架。全章为扁平结构，共 20 个 Markdown 文件、约 12,344 行，围绕「概念 → 技术全景 → 历史 → 工具 → 伦理 → 未来 → 学习资源 → 案例/实验」展开，并配套了小白版 README 与可运行代码实验指南。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- AI 应用/Agent 架构设计：缺通用 LLM 应用架构（RAG、Agent、Function Calling、MCP）的通识级讲解。
- 模型评估与测试基础：仅实验指南有少量评估，缺面向生产的 evaluation metrics、red-teaming、benchmarking 概念。
- AI 安全与输入输出防护：缺 prompt injection、jailbreak、输出毒性/偏见、guardrails、内容安全合规。
- 隐私与数据治理：现有伦理文档提及，但缺生产级 PII 处理、数据脱敏、联邦学习概念、隐私计算通识。
- 成本与性能优化：缺 token 成本、缓存策略、量化、模型路由、批处理等成本控制概念。
- AI 可观测性（Observability）：缺 tracing、logging、LLM 调用监控、A/B 测试、反馈闭环。
- 部署与推理基础：Hands_On 有 vLLM 实验，但缺面向非开发者的部署概念（API、on-premise vs cloud、edge）。
- AI 合规与审计：EU AI Act 已有，但缺企业落地 checklist、模型卡片（Model Card）、影响评估。
- 人机协作与 AI 产品管理：缺产品经理视角的 AI 产品设计原则、UX、人在回路（HITL）。
- 国产/信创 AI 生态：缺对国产芯片（昇腾、寒武纪）、国产框架（MindSpore、Paddle）、国产大模型（通义、文心、豆包、DeepSeek）的系统梳理。

#### P1 — 行业主流

- RAG（检索增强生成）基础：当前仅实验指南有一个实验，缺通识级 RAG 原理、向量数据库、检索策略。
- AI Agent 与 Multi-Agent 系统：AI_Fundamentals 提了 Agent，但缺 Agent 架构、ReAct、Plan-and-Execute、Multi-Agent 协作。
- MCP（Model Context Protocol）：README 提到 2026 MCP，但无专门文档。
- Fine-tuning 与 Adapter 概念：缺 LoRA、QLoRA、PEFT、领域适配通识讲解。
- 多模态模型详解：AI_Multimodal_GenAI 较浅，缺 CLIP、VLM、端到端多模态架构。
- 代码生成与 AI 编程：Cursor/Copilot/Windsurf 等在工具指南有提及，但缺 SWE-bench、AI 代码审查、dev agent 概念。
- AI 智能体平台/低代码工具：Dify、Coze、n8n、LangFlow 等面向业务人员的 Agent 搭建平台。
- 合成数据与数据标注产业：数据标注在实验里有，但缺合成数据、数据质量、标注平台产业。
- AI 芯片与算力基础：AI_Technology_Landscape 有硬件层，但缺 GPU/TPU/NPU 原理、算力成本、集群概念。
- 开源模型生态与模型许可：Hugging Face、Llama 系列、Qwen、DeepSeek、模型许可证（Apache/LLaMA/Meta）通识。

#### P2 — 前沿补充

- 世界模型（World Models）与物理 AI：AI_Future_Trends 提了，但缺专题 Deep Dive。
- 神经符号 AI 与因果推理：新架构文档涉及，但深度不足。
- AI for Science：AlphaFold 在案例里有，但缺 AI4Science 整体专题。
- 具身智能与机器人操作系统：AI_Fundamentals 提了机器人，但缺 ROS、Sim-to-Real、人形机器人产业链。
- AI 幻觉（Hallucination）专题：分散在各处，缺系统性讲解与 mitigation。
- AI 经济学与商业模式：缺 AI 初创公司、API 经济、定价模式、估值逻辑。
- AI 与就业/教育变革：伦理里有提及，但可独立为案例/专题。
- AI 艺术、版权与知识产权：缺 AIGC 版权、训练数据合法性、生成内容水印。
- AI 竞赛与 Benchmark 文化：缺 Kaggle、Leaderboard、刷榜现象通识。
- AGI 安全与对齐：AI_Future_Trends 提到对齐，但缺 RLHF、Constitutional AI、Superalignment 基础。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``AI_Engineering_Fundamentals.md`` | P0 | `AI入门/` |
| ``AI_Safety_and_Guardrails_for_dummy.md`` | P0 | `AI入门/` |
| ``AI_Cost_Optimization_2026.md`` | P0 | `AI入门/` |
| ``AI_Compliance_and_Audit_Runbook.md`` | P0 | `AI入门/` |
| ``AI_Product_Management_Case_Study.md`` | P0 | `AI入门/` |
| ``Chinese_AI_Ecosystem_Deep_Dive.md`` | P0 | `AI入门/` |
| ``RAG_Fundamentals_for_dummy.md`` | P1 | `AI入门/` |
| ``AI_Agents_and_MCP_2026.md`` | P1 | `AI入门/` |
| ``Fine_tuning_Basics_in_nutshell.md`` | P1 | `AI入门/` |
| ``AI_Code_Assistants_Deep_Dive.md`` | P1 | `AI入门/` |

### 01_Fundamentals

`数学基础` 是知识库的“基础理论”支撑章节（`tier: supporting`），定位在数学、计算机科学、编程语言、开发环境与 AI 硬件四个维度，为后续机器学习、深度学习、大模型等应用章节提供前置知识。README 中明确了线性代数 → 概率统计 → 数据结构/分布式系统的主学习路径，并额外补充了 Python、Java、AI 硬件与开发环境等工程入门内容。整体上，该章节更偏向“学习者入门地图”，对生产环境所需的工程化、运维、安全合规、成本优化等主题覆盖较弱。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- AI 开发环境可复现性（Docker / Conda lock / 镜像管理）
- GPU 集群 / 训练机器部署 Runbook
- 分布式训练运维与故障排查
- AI 安全与合规基础
- AI 成本优化与 TCO 评估
- 实验管理与可观测性基础
- AI 服务的 CI/CD 与版本控制

#### P1 — 行业主流

- 优化理论与自动微分
- CUDA / GPU 编程基础
- AI 网络与 RDMA/InfiniBand
- AI 存储与 Checkpoint 策略
- 边缘 AI / TinyML 与端侧芯片
- 云原生 AI 开发（K8s / Serverless / 云平台）
- Python 测试与代码质量

#### P2 — 前沿补充

- 量子计算与 AI 交叉
- 神经形态计算 / 类脑芯片
- 可持续 AI / 绿色计算
- 因果推断基础

#### 建议新建/补充的文件

- 暂无。

### 02_Machine_Learning

`机器学习` 是知识库的辅助章节（tier: supporting），定位在深度学习之前的主流经典机器学习方法。README 明确其覆盖监督学习、无监督学习、特征工程、集成学习、时间序列、异常检测、推荐系统、AutoML、贝叶斯方法与因果推断，目标是帮助读者建立从数据中学习规律的工程化能力，并为后续深度学习打基础。

- **总体评分**: -/10

#### P0 — 生产环境必备

- 无明显缺失或已较好覆盖。

#### P1 — 行业主流

- 无明显缺失或已较好覆盖。

#### P2 — 前沿补充

- 无明显缺失或已较好覆盖。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``ML_System_Architecture_and_Deployment.md`` | P0 | 根目录 `机器学习/` |
| ``Feature_Store_Design_Runbook.md`` | P0 | `Feature_Engineering/` |
| ``Model_Monitoring_and_Drift_Detection_Runbook.md`` | P0 | 根目录 `机器学习/` |
| ``ML_Pipeline_Orchestration_2026.md`` | P0 | 根目录 `机器学习/` |
| ``Model_Interpretability_and_Explainability.md`` | P0 | 根目录 `机器学习/` |
| ``AB_Testing_for_ML_Case_Study.md`` | P0 | 根目录 `机器学习/` |
| ``ML_Data_Validation_Runbook.md`` | P0 | 根目录 `机器学习/` |
| ``Modern_Tabular_Deep_Learning_2026.md`` | P1 | 根目录 `机器学习/` |
| ``Foundation_Models_for_Time_Series_2026.md`` | P1 | `Time_Series/` |
| ``LLM_Based_Recommendation_Systems_2026.md`` | P1 | `Recommendation_Systems/` |

### 03_Deep_Learning

`深度学习` 是 ai-guru-database 中 L1 模型层的「神经网络核心」支撑章节，定位为连接数学基础（01）与具体应用领域（CV/NLP/RL）的桥梁。当前内容以反向传播、优化器、正则化、核心架构组件为主线，辅以 2026 年新增的状态空间模型、图神经网络、自监督学习和世界模型等前沿方向。整体来看，该目录在「教材式入门」和「前沿技术跟踪」上做得较好，但在企业生产级工程实践、主流架构深度拆解（CNN/RNN/Transformer/生成模型）、以及 2024-2026 行业关键技术栈方面存在明显缺口。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- CNN 深度拆解：仅有 nutshell 速览，缺少独立 `CNN_Deep_Dive.md`，无法系统覆盖 ResNet/EfficientNet/ConvNeXt 等工业视觉 backbone。
- Transformer/注意力机制深度文档：自注意力、多头注意力、RoPE、ALiBi、KV Cache 等只在 nutshell 提及，生产微调和大模型推理急需。
- 混合精度训练深度指南：`Optimization.md` 提及但篇幅有限，缺少系统讲解 FP16/BF16、GradScaler、损失缩放、数值稳定性排查。
- 神经网络训练调试 Runbook：损失不下降/NaN/梯度爆炸/过拟合/欠拟合的系统化排查流程与 checklist。
- 模型量化与压缩（框架层）：INT8/FP16/AWQ/GPTQ/动态量化在 PyTorch/ONNX/TensorRT 中的实践。
- PyTorch 生产部署 Runbook：TorchScript、TorchExport、`torch.compile`、TorchServe、ONNX 导出、推理优化。
- 分布式训练深度文档：虽然 `模型训练/Distributed_Training/` 存在，但 `深度学习` 作为框架层缺少 DDP/FSDP/DeepSpeed/Megatron 的入门与原理衔接。
- 生成模型深度文档（VAE/GAN/Diffusion）：仅在初学者文档中提及，缺少系统深度文档。

#### P1 — 行业主流

- MoE（混合专家模型）深度解析：2024-2026 大模型主流架构（Switch Transformer、Mixtral、Qwen-MoE、DeepSeek-MoE）。
- 长上下文模型技术：Ring Attention、Longformer、Mistral/Claude 长上下文机制、位置编码外推。
- KV Cache 优化：PagedAttention、vLLM、StreamingLLM、H2O、压缩与量化。
- 神经架构搜索（NAS）：AutoML 在 CNN/Transformer 中的应用、效率与可解释性。
- 持续学习 / 灾难性遗忘： rehearsal、EWC、LoRA-based continual learning，企业多任务部署刚需。
- Test-Time Compute / 推理时扩展：o1-like reasoning、self-consistency、best-of-N、过程奖励模型。
- 模型合并技术：TIES、DARE、Task Arithmetic、SLERP，2024-2025 社区主流。
- 多模态架构深度解析：CLIP、LLaVA、Flamingo、Qwen-VL 等视觉-语言架构。
- JAX/Flax 深度指南：Google/DeepMind 生态，大规模 TPU 训练的主流选择。
- Diffusion/Flow Matching 生成模型：Stable Diffusion 3、Flux、DiT、Flow Matching 是 2024-2026 图像/视频生成的核心。

#### P2 — 前沿补充

- 现代记忆架构（Titans、xLSTM、MinLSTM/MinGRU）：2024-2025 对 Transformer/RNN 的新探索。
- BitNet / 1-bit / 量化大模型：2024-2026 边缘部署与高效推理方向。
- 因果表示学习：与世界模型、JEPA 互补的因果推断视角。
- NeRF/3D 表示学习：与 CV 章节交叉，但属于深度学习架构前沿。
- 能量模型与基于能量的预测：与 JEPA 深度关联的理论视角。
- Test-Time Training（TTT）：2024 提出的新型序列建模层。
- DeepSeek 架构解析（MLA、 MTP）：2024-2025 具有行业影响力的国产大模型工程创新。
- 硬件感知神经网络设计：MobileNetV4、EfficientNetV2、神经架构与 NPU/TPU 协同设计。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``CNN_Deep_Dive.md`` | P0 | 根目录或 `Neural_Network_Core/` |
| ``Transformer_Architecture_Deep_Dive.md`` | P0 | 根目录或 `Neural_Network_Core/` |
| ``Attention_Mechanisms_Deep_Dive.md`` | P0 | 根目录 |
| ``Mixed_Precision_Training_Deep_Dive.md`` | P0 | `Optimization/` |
| ``Neural_Network_Debugging_Runbook.md`` | P0 | 根目录 |
| ``PyTorch_Production_Deployment_Runbook.md`` | P0 | `DL_Frameworks/` |
| ``Model_Quantization_Deep_Dive.md`` | P0 | 根目录或 `DL_Frameworks/` |
| ``Distributed_Training_for_dummy.md`` | P0 | `DL_Frameworks/` |
| ``Generative_Models_Deep_Dive.md`` | P1 | 根目录 |
| ``MoE_Deep_Dive.md`` | P1 | 根目录 |

### 04_Computer_Vision

`计算机视觉` 是 ai-guru-database 中定位为 supporting（辅助章节） 的计算机视觉主模块，当前以「教学型知识库」为主：覆盖图像分类/检测、分割、多模态视觉、生成模型、视频生成、3D 视觉、OCR 七大主题，并为每个主题配备了 `for_dummy` 小白版，形成了较好的零基础→进阶的双层内容结构。整体来看，该章节更偏向概念讲解与代码示例，企业生产环境视角（部署、运维、成本、安全、合规）和 2025-2026 前沿技术跟进明显薄弱。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- 视觉模型部署与推理优化：无专门文件讲解 TensorRT/ONNX/OpenVINO/TF-Lite 转换、量化、动态 batch、服务化（Triton/TorchServe）。
- CV 工程化 MLOps / 数据管线：缺少数据标注pipeline（CVAT/Label Studio）、版本管理（DVC）、数据漂移检测、主动学习。
- 边缘/移动端 CV 部署：无 ARM/NPU/Hardware-aware NAS、YOLO/ EfficientNet 在 iOS/Android/树莓派/Jetson 的落地。
- CV 系统可观测性与运维 Runbook：无模型性能监控、推理延迟/吞吐/显存监控、错误样本回传、A/B 测试、回滚策略。
- CV 安全与合规：无对抗样本/模型反演/数据投毒、Deepfake 检测、C2PA/水印、隐私合规（GDPR/AI Act/中国深度合成规定）。
- 视觉大模型（VLM）生产架构：无多模态大模型服务部署、KV Cache 优化、视觉 token 压缩、长视频处理架构。
- CV 成本优化与容量规划：无 GPU 选型、batch 调优、spot 实例、模型蒸馏/剪枝/量化的成本收益分析。
- 计算机视觉案例分析 / 端到端 Case Study：缺少工业质检、自动驾驶感知、零售货架、医疗影像等完整落地案例。
- 实时视频分析管线：无视频流接入（RTSP/Kafka）、帧采样策略、时序一致性、跟踪（DeepSORT/ByteTrack）与行为分析。
- 多模态 Agent / VLA 视觉动作模型：作为 2025-2026 热点，仅在 README 相关链接中提及，无独立内容。

#### P1 — 行业主流

- SAM 2 / SAM 2.1 深度解读：Segmentation.md 仅一笔带过 SAM 2，无专门深度文件。
- FLUX.1 / SD3 / Stable Diffusion 4 系列：Diffusion Deep Dive 已覆盖部分，但缺少 FLUX 生态/工作流/微调专题。
- DiT（Diffusion Transformer）架构专题：仅散见于生成模型中，无独立解读。
- YOLOv11 / YOLO-World / RT-DETR v2：Classification/Detection 仍停在 YOLOv10，未更新 YOLOv11 与开放词汇检测。
- Depth Anything V2 / Metric3D / Mamba-based 视觉：3D Vision 深度估计部分未紧跟 2024-2025 SOTA。
- Mamba / Vision Mamba / Selective Scan in CV：无状态空间模型在视觉的应用。
- OpenAI GPT-4o 原生多模态 / Gemini 2.5 / Claude 4 Vision / Qwen2.5-VL：Multimodal Vision 仍停留在 GPT-4V/4o、Claude 3.5 时代。
- Wan 2.1 / CogVideoX / LTX-Video 开源视频生成：Video Generation 提到但无实战/部署内容。
- 3D Gaussian Splatting 深度专题：3D Vision 有代码片段但缺少渲染管线、生产应用（数字孪生、AR）。
- 视觉 Foundation Model 自监督预训练（DINOv2 / iBOT / MAE v3）：缺少系统梳理。

#### P2 — 前沿补充

- 神经渲染 / 逆渲染与物理仿真结合（PhysGaussian、GaussianShader）。
- 世界模型与视觉生成结合（Sora-like world simulator、JEPA、V-JEPA）。
- AI 图像/视频水印与溯源（Stable Signature、Imagen 水印、C2PA 实践）。
- 合成数据生成与 Domain Randomization（NVIDIA Isaac Sim、Unity Perception）。
- 具身智能视觉感知（Ego4D、视觉语言动作模型 VLA、机器人抓取）。
- 医疗影像 CV 专题（DICOM、联邦学习、3D U-Net、nnU-Net）。
- 遥感与卫星图像 CV（变化检测、超分辨率、地物分类）。
- CV 竞赛与 Benchmark 2025-2026（ImageNet-22K、LVIS、nuScenes、DocVQA 最新榜单）。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``CV_Deployment_and_Inference_2026.md`` | P0 | `计算机视觉/` 根目录 |
| ``CV_MLOps_Data_Pipeline_Runbook.md`` | P0 | `计算机视觉/` 根目录 |
| ``CV_Security_and_Compliance_2026.md`` | P0 | `计算机视觉/` 根目录 |
| ``Edge_CV_Deployment_Case_Study.md`` | P0 | `计算机视觉/` 根目录 |
| ``Video_Analytics_Pipeline_Runbook.md`` | P0 | `计算机视觉/Video_Generation/` 或 |
| ``VLM_Production_Architecture_2026.md`` | P0 | `计算机视觉/Multimodal_Vision/` |
| ``CV_Cost_Optimization_Guide.md`` | P0 | `计算机视觉/` 根目录 |
| ``Industrial_Quality_Inspection_Case_Study.md`` | P0 | `计算机视觉/Image_Classification |
| ``SAM_2_Deep_Dive.md`` | P1 | `计算机视觉/Segmentation/` |
| ``FLUX_Ecosystem_Deep_Dive.md`` | P1 | `计算机视觉/Generative_Models/` |

### 05_NLP_LLMs

`大模型` 是知识库的支持章节（supporting tier），定位为 NLP 与大模型技术的"核心能力层"：从序列模型、Transformer 架构出发，覆盖 LLM 架构、微调、提示词工程、中外生态、推理模型、多模态、端侧 LLM 与数据工程。README 与 README_for_dummy 构建了清晰的"入门→进阶→实战"学习路径，2026 年新增的中外大模型生态、Reasoning Models、Long Context 等专题紧跟行业热点。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- RAG 系统架构与优化：企业 80% LLM 应用基于 RAG，当前仅在 README/Prompt 中零散提及，缺系统文档。
- LLM 生产化部署 Runbook：vLLM/TGI/SGLang/Transformer API 服务化、负载均衡、扩缩容。
- LLM 安全与输入输出防护：Prompt Injection、越狱、PII 泄露、毒性/偏见过滤、Guardrails。
- LLM 成本优化与容量规划：Token 计费、Batching、缓存、模型路由、成本-延迟权衡。
- Function Calling / Tool Use 生产实践：Schema 设计、工具注册、错误恢复、并行调用。
- LLM 在线评测与监控：A/B 测试、输出漂移、延迟/可用性监控、BAD CASE 闭环。
- 数据隐私与合规：GDPR、国内算法备案、AIGC 内容标识、数据出境。
- LLM 应用框架：LangChain / LlamaIndex / DSPy 的选型、生命周期与最佳实践。
- Agent 架构设计：ReAct、Plan-and-Execute、Multi-Agent、记忆、工具编排。
- 多语言与机器翻译（NMT）：作为 NLP 核心任务，当前几乎空白。

#### P1 — 行业主流

- LLM 应用框架：LangChain / LlamaIndex / DSPy 的选型、生命周期与最佳实践。
- Agent 架构设计：ReAct、Plan-and-Execute、Multi-Agent、记忆、工具编排。
- 多语言与机器翻译（NMT）：作为 NLP 核心任务，当前几乎空白。
- 向量数据库与语义检索：Embedding 模型选型、索引、重排序、混合检索。
- RLHF / GRPO / DPO 全流程实战：已有概念文件，但缺端到端流水线与代码案例。
- LLM 缓存策略：语义缓存、前缀缓存、KV Cache 共享、多级缓存。
- 传统 NLP 任务实战：NER、文本分类、信息抽取、情感分析。
- 模型量化与推理加速实战：INT8/INT4/FP8、AWQ/GPTQ/GGUF 选型与精度对比。
- Test-time Scaling 前沿综述：推理时计算扩展的系统方法论。
- LLM for Science：数学、代码、生物、材料等领域的科学发现应用。

#### P2 — 前沿补充

- Test-time Scaling 前沿综述：推理时计算扩展的系统方法论。
- LLM for Science：数学、代码、生物、材料等领域的科学发现应用。
- 模型水印与可溯源：文本水印、模型指纹、版权保护。
- 绿色 AI / 低碳训练：能耗评估、碳足迹、高效训练策略。
- 世界模型与语言模型结合：从纯文本到具身/物理世界理解。

#### 建议新建/补充的文件

- 暂无。

### 06_Reinforcement_Learning

`强化学习` 是当前知识库的 supporting（辅助）章节，定位为「从 MDP 数学基础 → 深度 RL 算法 → 具身智能/机器人」的垂直技术栈。Agent 相关内容已迁移至 `Agent`，本章保留 RL 本体内容，并同时提供入门版（`_for_dummy`）、进阶主文档和深度解读（`_Deep_Dive`）三种形态。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- RL 工程框架与工具链：Stable-Baselines3、RLlib、Ray、Tianshou、CleanRL、verl、OpenRLHF、LLaMA-Factory 的选型与使用。
- RL 生产部署 Runbook：模型导出（ONNX/TorchScript/TensorRT）、在线服务、A/B 测试、回滚、监控与告警。
- RLHF 生产 Runbook：从 SFT → RM → PPO 的完整工程链路，包含 trl/OpenRLHF 配置、显存优化、Checkpoint 管理。
- GRPO 训练深度指南：DeepSeek-R1 / Qwen3 / o1 式推理模型训练，含 reward function 设计、KL 控制、过程奖励接入。
- Offline RL 深度解读：BCQ / CQL / IQL / AWAC，解决医疗、金融、推荐等无法在线交互场景。
- Multi-Agent RL：MADDPG、QMIX、VDN、CTDE、对手建模，游戏与自动驾驶必备。
- Safe RL：约束 MDP、CPO、Lyapunov-based RL，生产安全与机器人防撞。
- RL 在推荐/广告/调度领域的 Case Study：把「游戏 AI」案例拓展到真正创造收入的业务系统。
- RL 实验追踪与 MLOps：W&B / MLflow / Weights & Biases 在 RL 中的特殊指标（episode return、Q 值、entropy、KL）。
- 机器人 Sim-to-Real 部署 Runbook：域随机化、系统辨识、数字孪生、真实环境微调、失败恢复。

#### P1 — 行业主流

- Model-Based RL 深度解读：MuZero、MBPO、Dyna、DreamerV3、PlaNet。
- 经典算法补全：A3C / A2C / TRPO / DDPG 深度解读（目前只有 DQN/PPO/SAC/TD3）。
- Imitation Learning & Inverse RL：Behavior Cloning、GAIL、IRL、DAgger，机器人遥操作核心。
- Hierarchical RL：Options Framework、Feudal Networks、HIRO，服务长程任务。
- Process Reward Model (PRM) 深度解读：2026 年推理模型训练关键组件。
- RLVR（RL with Verifiable Rewards）：GRPO 的泛化与行业标准定义。
- Online DPO / SPIN / Self-Play RL：对齐训练的在线化与自我博弈方向。
- NVIDIA Isaac Lab Runbook：Isaac Gym 已演进为 Isaac Lab，需更新工具链。
- LLM 对齐训练 Recipes 2026：Tulu 3、Llama 3、Qwen3、Mistral 的公开配方。
- RL 评测基准与框架 2026：Gymnasium、MuJoCo、Procgen、MiniHack、V-Bench、Robot Learning Benchmarks。

#### P2 — 前沿补充

- Meta-RL（MAML / RL² / PEARL）：快速适应新任务。
- Curiosity-Driven Exploration：ICM、RND、NGU，解决稀疏奖励。
- Transfer & Multi-Task RL：MT-Opt、Agent57。
- Reward Shaping / Reward Model 设计：避免 reward hacking 的系统方法。
- Diffusion Policy for Robotics：2026 机器人模仿学习主流动作表示。
- RL for Game AI Case Study：AlphaStar、OpenAI Five、MuJoCo Soccer 详细复盘。
- Causal RL / 世界模型与 RL 结合。
- Neuromorphic RL / 边缘 RL 硬件部署。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``RL_Frameworks_and_Toolchain_2026.md`` | P0 | `强化学习/` |
| ``RL_Production_Deployment_Runbook.md`` | P0 | `强化学习/` |
| ``RLHF_Production_Runbook.md`` | P0 | `强化学习/` |
| ``GRPO_Training_Deep_Dive.md`` | P0 | `强化学习/` |
| ``Offline_RL_Deep_Dive.md`` | P0 | `强化学习/Deep_RL/` |
| ``Multi_Agent_RL_Deep_Dive.md`` | P0 | `强化学习/Deep_RL/` |
| ``Safe_RL_Deep_Dive.md`` | P0 | `强化学习/Deep_RL/` |
| ``RL_for_Recommendations_Case_Study.md`` | P0 | `强化学习/` |
| ``RL_MLOps_and_Experiment_Tracking_2026.md`` | P0 | `强化学习/` |
| ``Sim_to_Real_Runbook.md`` | P0 | `强化学习/Robotics_Embo |

### 07_Model_Training

`模型训练` 是 ai-guru-database 的 supporting 辅助章节，定位为"模型训练的工程实战手册"。它以 2 个 README（主版+小白版）为入口，下设 6 个子目录（Data、Optimization、Distributed_Training、Alignment、Compression、Monitoring），覆盖从数据准备、分布式训练、优化加速到对齐压缩的全链路。当前特点是深度专题较全、故障排查Runbook领先、工程框架覆盖好，但系统性教材内容、生产级成本/安全/调度、前沿多模态/MoE 等存在明显缺口。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- 训练成本优化与 FinOps：当前只有零星成本估算，缺少 GPU 利用率分析、Spot/抢占式实例训练、训练任务成本归因、预算告警。
- Checkpoint 管理与灾难恢复：大模型训练 checkpoint 策略（同步/异步、分层保存、校验和恢复）未系统覆盖。
- 训练资源调度与编排：Slurm、Kubernetes Training Operator、Volcano、Ray Cluster 自动化扩缩容实战不足。
- 云平台训练服务：AWS SageMaker Training、Azure ML、Google Vertex AI、阿里云 PAI/DLC 的厂商级指南缺失。
- 训练安全与数据合规：PII 检测与脱敏、训练数据版权、模型记忆攻击防护、RLHF 对齐安全审计未独立成文。
- 端到端训练案例研究：缺少一个从数据准备到上线评测的完整项目案例（如 LLaMA 预训练复现、领域模型微调案例）。
- MoE（混合专家模型）训练实战：MoE 仅在 Scaling Laws 和 Megatron/DeepSpeed 中提及，缺少独立深度专题。
- 长上下文训练扩展：RoPE/NTK/YaRN/PI、上下文并行、长文本数据构造未系统成文。

#### P1 — 行业主流

- FP8/BF16 低精度训练：混合精度文件仍偏重 FP16/BF16，缺少 FP8（H100/H200）训练实战与精度保持。
- 多模态模型训练：CLIP、LLaVA、视频-语言模型、音频-语言模型的预训练/微调专题缺失。
- 模型合并（Model Merging）：TIES、DARE、SLERP、Task Arithmetic 等主流合并技术未覆盖。
- 高级合成数据 Pipeline：Self-Instruct/Evol-Instruct 已有基础，但缺少 Agent 合成数据、多轮对话合成、质量反馈循环。
- 课程学习与数据排序：Difficulty-based、能力感知的动态课程学习未覆盖。
- 测试时计算 / 推理时训练：o1/R1 风格的推理时 Scaling 已在 Scaling Laws 提及，但独立专题不足。
- 持续学习与灾难性遗忘缓解： lifelong learning、replay、EWC、LoRA-based 持续学习缺失。
- 训练数据版权与许可合规：开源数据许可协议（ODC、CC）、合规数据集选择指南缺失。

#### P2 — 前沿补充

- Agentic RL 训练：Hello_Agents_L11 仅是课程笔记，缺少独立 Agent 强化学习训练专题。
- 扩散模型训练：Stable Diffusion、视频扩散模型训练缺失（属于生成模型，但训练链路差异大）。
- NAS / 高效架构搜索 for LLM：Mamba、RetNet、RWKV 等新型架构训练专题不足。
- 科学计算/蛋白质/分子模型训练：垂直领域大模型训练案例缺失。
- TinyML / 边缘模型训练：端侧小模型训练、知识蒸馏到边缘设备缺失。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``Training_Cost_Optimization_and_FinOps_2026.md`` | P0 | `模型训练/Optimization/` |
| ``Checkpoint_Management_and_Disaster_Recovery_Runbook.md`` | P0 | `模型训练/Monitoring/` |
| ``Training_Resource_Scheduling_K8s_Slurm_2026.md`` | P0 | `模型训练/Distributed_Training/ |
| ``Cloud_Training_Platforms_Guide_2026.md`` | P0 | `模型训练/Distributed_Training/ |
| ``Training_Safety_and_Data_Compliance_2026.md`` | P0 | `模型训练/Data/` 或新建 `Security/ |
| ``End_to_End_LLM_Pretraining_Case_Study.md`` | P0 | `模型训练/` 根目录 |
| ``MoE_Training_Deep_Dive.md`` | P0 | `模型训练/Distributed_Training/ |
| ``Long_Context_Training_2026.md`` | P0 | `模型训练/Optimization/` |
| ``FP8_Training_Deep_Dive.md`` | P1 | `模型训练/Optimization/` |
| ``Multimodal_Model_Training_2026.md`` | P1 | `模型训练/` 根目录或新建 `Multimodal/ |

### 08_Model_Evaluation

`模型评估` 是 ai-guru-database 中围绕 AI 模型评测方法论、指标体系、基准测试与工程化评估 的核心章节。当前覆盖从传统 ML 指标、LLM/Agent/多模态基准，到 LLM-as-Judge、在线 A/B 测试、CI/CD 自动评估等生产实践，整体偏向 LLM 时代的大模型评测。然而，章节在结构化教学路径、企业级评估运维、2024–2026 最新工具链与领域特定评估方面仍存在明显缺口，大量文件还存在 ` 2.md` 重复副本，需要内容治理。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- 无明显缺失或已较好覆盖。

#### P1 — 行业主流

- 无明显缺失或已较好覆盖。

#### P2 — 前沿补充

- 无明显缺失或已较好覆盖。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``RAG_Evaluation_Deep_Dive.md`` | P0 | `模型评估/` 根目录或新建 `RAG_Evalu |
| ``Agent_Evaluation_Runbook.md`` | P0 | `模型评估/Evaluation_Tools/` |
| ``Evaluation_Cost_Optimization.md`` | P0 | `模型评估/` |
| ``Data_Contamination_Detection_Deep_Dive.md`` | P0 | `模型评估/` |
| ``Model_Card_Template.md`` | P0 | `模型评估/` |
| ``Calibration_Uncertainty_Evaluation.md`` | P0 | `模型评估/` |
| ``Domain_Evaluation_Medical_Financial_Legal.md`` | P0 | `模型评估/` |
| ``Safety_Red_Team_Evaluation_Deep_Dive.md`` | P0 | `模型评估/` |
| ``Evaluation_Dataset_Constrution_Guide.md`` | P0 | `模型评估/` |
| ``Evaluation_Monitoring_Runbook.md`` | P0 | `模型评估/` |

### 09_Testing

`AI测试` 是 ai-guru-database 的核心章节（tier: core），定位为「AI 测试与评估」全栈知识库，覆盖从 Prompt 测试、RAG 评估、Agent 行为验证、LLM 安全红队到契约测试的完整测试金字塔。章节结构完整：包含 `README.md`、`README_for_dummy.md`、`{Topic}-in-nutshell.md`、`{Topic}_for_dummy.md` 等入门级入口，也包含多个 `{Topic}_Deep_Dive.md` 进阶深度文档，适合高校系统学习与工程参考。  > 注意：该目录下存在 6 个带 ` 2.md` 后

- **总体评分**: -/10

#### P0 — 生产环境必备

- Agent 评估方法论与工具：当前仅在 `in-nutshell` 中提及 Agent 指标，缺少系统性的 Agent 任务成功率、工具选择准确率、轨迹评估、Human-in-the-loop 评估实践（虽然 `Agent/Agent_Evaluation` 存在，但 `AI测试` 作为测试主章应独立成章）。
- LLM-as-Judge 的偏见控制与校准：现有文档多处使用 Judge LLM，但缺少位置偏差、自我偏好、verbosity bias 的识别与缓解方法。
- 测试成本优化与 CI 预算管理：LLM 测试调用费用高昂，缺少按影响面选择测试子集、缓存策略、本地小模型预筛选、成本上限控制。
- A/B 测试与影子测试（Shadow Testing）：生产环境模型切换缺少离线/在线 A/B、灰度、影子流量对比方法论。
- 测试环境管理（Test Environment / Test Bed）：缺少沙箱、隔离环境、模型版本与数据版本矩阵管理。
- 可观测性驱动的测试（Observability for Testing）：缺少基于线上 trace 自动挖掘回归用例、异常聚类生成测试集的方法。
- 多模态模型测试：当前测试数据管理提及多模态输入，但缺少图像、音频、视频模型的系统测试框架。
- 合规与审计测试（AI Act / 生成式 AI 管理办法 / GDPR）：缺少合规留痕、可解释性验证、数据隐私影响评估（DPIA）相关测试。
- 关键故障注入与混沌测试：仅 `Java_AI_Testing.md` 有一节，缺少通用的 LLM API 降级、超时、限流、网络分区故障注入 Runbook。
- 生成代码的测试（Code Gen Evaluation）：缺少 SWE-bench、HumanEval、代码执行型评估的工程实践。

#### P1 — 行业主流

- 主流评估平台覆盖不足：缺少 Braintrust、LangSmith、Galileo、TruLens、OpenAI Evals、Weights & Biases Weave 的对比与选型。
- 评估数据集与基准构建：缺少如何自建行业/企业私有评估集的方法论（ beyond 黄金集）。
- Prompt 版本管理与 diff 评估：缺少 Prompt 版本控制、A/B Prompt、变更影响面分析。
- 检索质量专项测试：RAGAS 覆盖生成侧，但缺少嵌入模型评估、chunking 策略评估、query 改写测试、重排序测试。
- 模型漂移与数据漂移检测：回归测试文档提及概念，但缺少 drift detector（如 embedding 分布检测、KS 检验、PSI）的实现。
- 合成数据生成工具与实践：Test_Data_Management 有基础工厂，但缺少 SDV、Most Likely AI、Gretel、LLM-based synthesizer 等工具链。
- 安全评估自动化平台：Garak/PyRIT 有介绍，但缺少企业级自动化红队平台、攻击库维护、CVE 跟踪。
- 性能与负载测试：仅有 Java 文件简单示例，缺少 LLM 服务压测、吞吐量、P50/P99 延迟、token/s、并发模型切换测试。
- RAG 端到端诊断与根因分析：缺少从 query → 检索 → 重排 → 生成的根因定位方法论。
- 测试指标体系建设：缺少企业级测试指标看板、SLI/SLO 定义、质量门禁设计。

#### P2 — 前沿补充

- 形式化验证与模型鲁棒性认证：缺少神经网络验证、对抗鲁棒性边界、抽象解释等前沿方法。
- 基于过程奖励模型（PRM）的推理链评估：针对 o1/R1 等推理模型的步骤级评估。
- 联邦学习与分布式 AI 测试：分布式场景下的模型评估与隐私保护测试。
- 测试中的因果推断与反事实评估：用于归因模型失败根因。
- AutoEval / 自进化评估系统：用 LLM 自动生成、维护、优化测试用例。
- Green AI / 低碳测试：测试碳足迹估算与绿色评估策略。
- 人机协作评估（Human-in-the-loop Evaluation）：众包、专家标注、反馈闭环设计。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``Agent_Evaluation_Deep_Dive.md`` | P0 | `AI测试/` |
| ``LLM_as_Judge_Bias_and_Calibration_Deep_Dive.md`` | P0 | `AI测试/` |
| ``AI_Testing_Cost_Optimization_2026.md`` | P0 | `AI测试/` |
| ``Shadow_AB_Testing_for_LLM_Deep_Dive.md`` | P0 | `AI测试/` |
| ``LLM_Chaos_Engineering_Runbook.md`` | P0 | `AI测试/` |
| ``Compliance_Testing_for_AI_Deep_Dive.md`` | P0 | `AI测试/` |
| ``Multimodal_AI_Testing_Deep_Dive.md`` | P0/P1 | `AI测试/` |
| ``Code_Generation_Evaluation_Deep_Dive.md`` | P0/P1 | `AI测试/` |
| ``Retrieval_Quality_Testing_Deep_Dive.md`` | P1 | `AI测试/` |
| ``Testing_Platforms_Comparison_2026.md`` | P1 | `AI测试/` |

### 10_Deployment_Inference

`部署推理` 是 ai-guru-database 中负责“模型到生产的最后一公里”的辅助章节（tier: supporting），核心定位是帮助读者把训练好的模型高效、稳定、可扩展地部署为推理服务。当前内容以推理引擎选型、性能优化、量化压缩、国产芯片适配为主线，覆盖了主流开源/商业引擎、KV Cache/调度/PD 分离等性能技术，以及 Ascend、海光、寒武纪、摩尔线程等国产硬件，整体呈现出“引擎多、优化深、国产化足”的特点。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- 无明显缺失或已较好覆盖。

#### P1 — 行业主流

- 无明显缺失或已较好覆盖。

#### P2 — 前沿补充

- 无明显缺失或已较好覆盖。

#### 建议新建/补充的文件

- 暂无。

### 11_MLOps_Pipeline

`MLOps` 是知识库的支撑章节（tier: supporting），定位为“ML 建设期”（Build-time）工程实践，与 `AI运维`（Run-time 运维）明确分界。本章采用双主线结构：传统 MLOps 全生命周期管理 + LLM 时代的 LLMOps 升级，2026 年 6 月已将 16 个工具深度解析从 `AI运维` 迁入，形成以概念页为纲、工具 Deep Dive 为目、Runbook 与 Tutorial 为实战补充的体系。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- LLM 安全护栏工程化（Safety/Guardrails as Code）
- MLOps 灾备与业务连续性 Runbook
- 数据血缘与 ML 元数据管理
- 实时特征流水线（Streaming Feature Pipeline）
- GPU 集群调度与资源配额治理
- 生产多租户隔离与权限治理
- ML 流水线测试策略
- 模型服务高可用与多活架构
- SRE 视角的 SLO/SLA/错误预算落地

#### P1 — 行业主流

- Agent Ops / 多智能体编排运维
- MCP / A2A 协议集成与运维
- 合成数据流水线（Synthetic Data Pipeline）
- 模型蒸馏与小型化流水线
- 多模态 MLOps
- Lakehouse for ML / Delta Lake 实践
- 数据标注流水线大规模运营
- 模型可解释性监控（XAI Monitoring）
- FinOps for MLOps 深度实践
- ML 元数据与模型卡片自动化

#### P2 — 前沿补充

- 边缘 MLOps（Edge MLOps）
- 联邦学习运维（Federated Learning Ops）
- 持续预训练流水线（Continual Pre-training Pipeline）
- 因果推断流水线（Causal Inference Pipeline）
- 模型合并（Model Merging）运维
- LLM 红队自动化（Red Teaming Automation）
- 模型水印与溯源（Model Watermarking & Provenance）
- 科学计算 MLOps（如 AI4Science/药物发现）
- 神经符号 / 规则-模型混合流水线
- AutoML Ops（自动化架构搜索流水线）

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``LLM_Guardrails_and_Safety_Ops_2026.md`` | P0 | 根目录或 `Observability/` |
| ``MLOps_Disaster_Recovery_Runbook.md`` | P0 | `Troubleshooting/` |
| ``Data_Lineage_and_ML_Metadata_2026.md`` | P0 | `Orchestration/` |
| ``Streaming_Feature_Pipeline_Deep_Dive.md`` | P0 | `Feature_Store/` |
| ``GPU_Cluster_Scheduling_and_Quota_Deep_Dive.md`` | P0 | `Cost/` 或新建 `Infrastructure/` |
| ``Multi_Tenant_MLOps_Governance.md`` | P0 | 根目录 |
| ``ML_Testing_in_Pipeline_Deep_Dive.md`` | P0 | `CI_CD/` |
| ``Model_Serving_HA_and_Multi_Region_Runbook.md`` | P0 | `Troubleshooting/` |
| ``Agent_Ops_2026.md`` | P1 | 根目录 |
| ``MCP_A2A_Integration_Ops.md`` | P1 | `Orchestration/` |

### 12_Architecture_Infrastructure

---

- **总体评分**: -/10

#### P0 — 生产环境必备

- AI 系统 SRE 与运维 Runbook
- FinOps / AI 成本治理体系
- 机密计算与 TEE 隐私保护
- AI 系统灾备与 RTO/RPO Runbook
- 多租户隔离与配额治理深度实践
- AI 服务可观测性深度方案
- 模型服务灰度发布与 A/B 测试
- AI 基础设施安全合规（等保/ISO 42001/EU AI Act）
- 容量规划计算工具与模板
- AI 集群网络 Fabric 设计与实现

#### P1 — 行业主流

- 大规模并行文件系统 Deep Dive
- Prefill-Decode 分离推理架构
- MoE 模型推理基础设施
- 长上下文服务架构（128K-1M）
- AI 模型分发与缓存系统
- 混合云/多云 AI 架构
- AI 训练 Job 调度与弹性
- 边缘 AI 部署与 MLOps
- AI 网关产品矩阵全景 2026
- 国产 AI 芯片生态深度

#### P2 — 前沿补充

- 数据中心物理层（供电/液冷/机柜）
- AI 基础设施碳排放与可持续计算
- CXL / 存内计算 / 硅光子工程实践
- AI Agent 运行时基础设施
- 神经形态/模拟计算芯片

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``AI_SRE_Runbook.md`` | P0 | `Architecture_Overview/` 或新建 `SRE/` |
| ``AI_FinOps_2026.md`` | P0 | `Architecture_Overview/` |
| ``Confidential_Computing_for_AI.md`` | P0 | `Security/` |
| ``AI_Disaster_Recovery_Runbook.md`` | P0 | `Architecture_Overview/` |
| ``Multi_Tenant_Governance_Deep_Dive.md`` | P0 | `Architecture_Overview/` |
| ``LLM_Observability_2026.md`` | P0 | `Architecture_Overview/` |
| ``LLM_Gradual_Release_and_AB_Testing.md`` | P0 | `Architecture_Overview/` |
| ``AI_Security_Compliance_2026.md`` | P0 | `Security/` |
| ``GPU_Cluster_Capacity_Planning_Toolkit.md`` | P0 | `Architecture_Overview/` |
| ``AI_Cluster_Network_Fabric_Deep_Dive.md`` | P0 | `Networking/` |

### 13_AI_Ops

`AI运维` 是知识库中负责 AI 系统运行期运维与可观测性 的核心章节，定位在「Run-time 运营」（与 `MLOps` 的 Build-time 工具链形成边界）。当前内容以 SRE、事故响应、GPU/K8s 排障、成本优化为重心，顶层全景文档较完整，但多个子目录（可观测性、成本治理、混沌工程、事故响应框架）篇幅薄弱，且存在大量重复命名的 `* 2.md` 文件干扰检索。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- 无明显缺失或已较好覆盖。

#### P1 — 行业主流

- 无明显缺失或已较好覆盖。

#### P2 — 前沿补充

- 无明显缺失或已较好覆盖。

#### 建议新建/补充的文件

- 暂无。

### 14_RAG_Systems

`RAG系统` 是 ai-guru-database 中聚焦 RAG（检索增强生成） 的辅助章节（tier: supporting），定位是把 RAG 从“概念”讲到“能跑的生产系统”。README 已经画出清晰的学习路径：小白版 → 速成版 → 系统学习 → 高级实践 → 向量数据库/框架/嵌入模型专题。整体覆盖偏 “概念 + 工具选型 + 代码示例”，但在 生产运维、安全合规、系统评估、成本优化 等工程化主题上明显薄弱。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- 无明显缺失或已较好覆盖。

#### P1 — 行业主流

- 无明显缺失或已较好覆盖。

#### P2 — 前沿补充

- 无明显缺失或已较好覆盖。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``RAG_Production_Architecture_Deep_Dive.md`` | P0 | `RAG系统/Production_RAG/`（新建） |
| ``RAG_Security_and_Compliance_Runbook.md`` | P0 | `RAG系统/Production_RAG/` |
| ``RAG_Evaluation_Framework_Deep_Dive.md`` | P0 | `RAG系统/Production_RAG/` 或 `Adva |
| ``RAG_Monitoring_and_Observability_Runbook.md`` | P0 | `RAG系统/Production_RAG/` |
| ``RAG_Cost_Optimization_Deep_Dive.md`` | P0 | `RAG系统/Production_RAG/` |
| ``Reranker_Deep_Dive.md`` | P0 | `RAG系统/Advanced_RAG/` |
| ``Vector_DB_Production_Runbook.md`` | P0 | `RAG系统/Production_RAG/` |
| ``Incremental_Indexing_and_Data_Pipeline_Runbook.md`` | P0 | `RAG系统/Production_RAG/` |
| ``GraphRAG_Deep_Dive.md`` | P0 | `RAG系统/Advanced_RAG/` |
| ``Pinecone_Deep_Dive.md`` | P1 | `RAG系统/Vector_Databases/` |

### 15_Agent_Production

`Agent` 是知识库 L4 应用层的辅助章节（`tier: supporting`），定位是“从 Agent 原型到生产级系统的完整工程体系”。目录按 能力层 → 评测层 → 生态层 → 工具与学习层 四层组织，共 16 个 L2 子目录 + 多个根级课件，已覆盖框架、协议、Harness 工程、评估、平台、编码工具等核心主题。但企业生产所需的 SRE/Runbook、成本优化、安全合规、部署基线、沙箱基础设施、多模态/Browser Agent 等实战内容明显薄弱。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- Agent 成本优化与 FinOps 实践（Token/步数/重试成本控制、预算配额、模型路由降本）
- Agent 生产部署 Runbook（上线前 Checklist、回滚、扩缩容、事故响应）
- Agent 安全合规治理（沙箱隔离、RBAC、审计日志、PII 过滤、GDPR/数据出境）
- Agent 可观测性工程实战（Trace/Metrics/Logs 统一、LLM-as-Judge 监控、成本 Dashboard）
- Agent 在 K8s 上的部署架构（Stateful Session、HPA、Istio/AI Gateway、持久化记忆服务）
- Agent 沙箱与代码执行基础设施（E2B/Daytona/Firecracker 对比、最小权限、网络隔离）
- Agent 版本管理与 CI/CD（Prompt/Skill/配置版本化、A/B 测试、金丝雀发布）
- Agent 灾难恢复与备份（会话状态、长期记忆、任务队列的 RPO/RTO）
- Agent 多租户隔离架构（租户级资源配额、数据隔离、模型密钥管理）
- Agent 性能基准与容量规划（并发模型、延迟/吞吐/成本三角、压测方法）

#### P1 — 行业主流

- Browser / Computer Use Agent 深度解析（Operator、Computer Use、UI-TARS、Skywork 等 2024-2026 主流）
- MCP 生态与 Server Registry（官方/社区 MCP Server、认证、市场、安全审查）
- Workflow Orchestration 平台（n8n、Flowise、LangFlow、Zapier AI、Make 对比）
- Agent 记忆基础设施选型（Mem0、Zep、Letta、向量库 Qdrant/Milvus/Pinecone 对比）
- 多模态 Agent 架构（视觉感知 + Agent、VLM 工具调用、视频/音频输入处理）
- Agent 网关（AI Gateway）模式（统一路由、限流、缓存、Fallback、模型聚合）
- 企业级 Agent 平台（Microsoft Copilot Studio、Salesforce Agentforce、ServiceNow AI Agents）
- Agent 评估 Benchmark 实战（SWE-bench、OSWorld、GAIA、WebArena、AgentBench 产线集成）
- RAG + Agent 融合架构（Agentic RAG、Self-RAG、Corrective RAG 生产实践）
- Agent 人机协作（Human-in-the-loop）设计（审批、纠错、置信度阈值、回退策略）

#### P2 — 前沿补充

- Embodied / Robotics Agent 与 Sim-to-Real（虽在 RL 章节，但生产视角缺）
- Agent 联邦学习与隐私计算（跨组织 Agent 协作、MPC、TEE）
- Agent 法律与责任归属（AI 造成损害的责任划分、保险、SLA 法务条款）
- Agent 经济系统与 Agent 市场（Skill 定价、Agent 间支付、Token 经济）
- 神经符号 Agent（Neuro-Symbolic Agents）（与符号推理结合的生产路径）
- Agent 因果推理与反事实规划（高级规划能力）
- 开源 Agent 操作系统（如 OpenAI 的 Agent OS 趋势、轻量级本地 Agent 运行时）
- Agent 量化与边缘部署（端侧 Agent、TinyAgent、移动设备推理优化）

#### 建议新建/补充的文件

- 暂无。

### 16_AI_Coding

`AI编程` 是知识库中定位为 supporting 的辅助章节，聚焦"AI 辅助编程"这一横向能力领域，目标读者覆盖从完全新手到生产环境落地的工程师。目录结构按 理论（Theory）→ 工具（Tools）→ 方法论（Methodology）→ 实战（Practice） 四层组织，并以 Vibe Coding / Agentic Coding 作为 2026 年核心叙事主线。总体已完成从入门到进阶的骨架搭建，但在高校教学实验、企业生产运维、行业主流工具深度三个维度存在明显缺口。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- AI 代码安全审计 Runbook：现有文档提及 SAST/SCA，但缺少可执行的审计步骤、工具配置模板、高危漏洞样例库。
- 规模化成本治理与预算管控：Claude_Cost_Optimization 偏 Claude 个人使用，缺少按团队/项目/模型的月度预算、配额告警、成本分摊方案。
- 企业合规与数据治理指南：GDPR/等保/SOX/PCI-DSS 下如何审批 AI 工具、数据分级、出境评估、审计留痕。
- 私有部署与本地化 AI 编程方案：无网络/涉密场景下的本地模型（Ollama + Code Llama/DeepSeek-Coder）、私有化 Copilot 替代、内网 Agent 部署。
- AI 代码变更的 CI/CD 集成实战：已有流程图，但缺少 GitHub Actions / GitLab CI 的完整可复用 workflow 文件和 PR 标签策略。
- 生产事故应急响应 Runbook：故障 2/3/4 有描述，但缺事件分级、值班流程、事后复盘模板、与现有 PagerDuty/OpsGenie 集成的示例。
- AI 辅助 Code Review 工具链：CodeRabbit、PR-Agent、GitHub Copilot Review、Amazon CodeGuru 的对比与配置。
- 模型路由与网关运维：OpenRouter 系列偏使用，缺少企业网关的 SRE 运维（限流、降级、Fallback、成本监控告警）。
- 代码模型评测与基准：SWE-bench、HumanEval、Terminal-Bench、Aider 多语言基准的解读与选型参考。
- 多语言 AI 编程专项实践：Python/TypeScript/Java/Go/Rust 在 AI 编程下的最佳实践、LSP 配置、测试框架差异。

#### P1 — 行业主流

- 开源 Agent 工具深度指南：Aider、Cline、Roo Code、Continue.dev 的安装、配置、MCP 集成、与 Cursor/Claude Code 的对比。
- MCP（Model Context Protocol）协议实战：已有提及但无独立深度文档，缺 Server 开发、权限模型、安全隔离。
- JetBrains 生态 AI 编程：IntelliJ IDEA / PyCharm 的 AI Assistant、GitHub Copilot、通义灵码在 Java/Kotlin 生态的落地。
- AI 测试生成专项：单元测试、集成测试、E2E 测试（Playwright/Cypress）、契约测试、变异测试的 AI 辅助策略。
- AI 编程与 DevOps/GitOps 集成：Terraform/Kubernetes/ArgoCD 配置生成、AI 辅助 SRE 运维脚本、基础设施即代码审查。
- 低代码/无代码 + AI 编程平台：v0、Bolt.new、Replit Agent、Lovable、Tempo 的适用场景与局限性。
- AI 编程团队成熟度评估与治理框架：已有成熟度模型，但缺评估问卷、基线指标、晋升路径、治理委员会职责。
- 代码生成质量度量体系：AI 代码接受率、bug 密度、回归率、审查轮次、技术债指数的度量方法与仪表盘搭建。
- 移动端与跨平台 AI 编程：iOS（Swift/Xcode）、Android（Kotlin/Android Studio）、Flutter、React Native 的 AI 辅助开发。
- AI 编程工具采购与 POC 评估指南：企业选型时的安全问卷、ROI 计算、POC  checklist、供应商谈判要点。

#### P2 — 前沿补充

- AI 编程与软件架构设计：AI 辅助绘制 C4 模型、DDD 上下文映射、架构决策记录（ADR）生成、技术雷达维护。
- AI 辅助遗留系统现代化：COBOL/Fortran/旧 Java 系统的 AI 辅助迁移、技术债识别、等价性验证。
- AI 编程伦理与偏见：代码生成中的版权风险、许可证污染、算法偏见、生成代码的知识产权归属。
- AI 编程教育与课程设计：高校/培训机构如何设计实验课、作业、项目、考核、师资培训。
- 多模态 AI 编程：Figma/截图 → 前端代码、手绘流程图 → 应用、语音驱动编程。
- AI 编程竞赛与社区实践：Kaggle/开源贡献/黑客松中 AI 辅助编程的边界与最佳实践。
- 量子计算/边缘设备等特殊场景的 AI 编程： niche 但可作为前沿补充。
- AGENTS.md / CLAUDE.md / .cursorrules 标准化规范：已有分散模板，但缺跨工具统一规范和组织级模板库。

#### 建议新建/补充的文件

- 暂无。

### 17_Ethics_Safety

`伦理安全` 是 ai-guru-database 的 supporting（辅助）章节，定位为“AI 可信度与责任性”专题。README 将其划分为三层：基础安全与对齐层（价值对齐、红队测试）、专业安全研究层（机械可解释性、隐私保护 AI、Deepfake、供应链安全、联邦学习）、生产安全实践层（OWASP/ASI 框架、K8s 策略引擎、监管工程化、安全评测）。章节内同时提供了 `README_for_dummy.md` 和多份 `_for_dummy.md` 入门版本，整体覆盖了从概念到代码示例的完整梯度。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- AI 安全事件响应 Runbook：缺少标准化的事件响应流程、取证模板、升级路径。
- LLM 生产安全部署架构/清单：虽有框架和防御指南，但缺一份“生产上线前 Checklist + 参考架构图”。
- AI 安全运营中心（AI SOC）集成：如何将 LLM 日志、护栏告警、红队结果接入 SIEM/SOAR 缺实践。
- LLM API 安全网关设计：统一认证、限流、密钥管理、审计、模型路由的安全网关缺专题。
- AI 系统身份与最小权限（IAM）：缺针对 AI Agent、工具、模型的 RBAC/ABAC 设计。
- 模型供应链可信工具链：Sigstore、SLSA、SBOM、模型签名/验证缺实战文档。
- AI 生成内容水印与溯源：C2PA / SynthID / Imagen 水印缺系统讲解。
- 云端 AI 安全服务对比：AWS Bedrock Guardrails、Azure AI Safety、Vertex AI 缺横向对比。
- AI 安全成本优化与性能权衡：护栏延迟、模型调用成本、安全与体验的量化权衡缺专题。
- AI 合规证据自动化采集：缺把监管要求转化为 CI/CD 证据收集流水线的内容。

#### P1 — 行业主流

- ISO/IEC 42001 AI 管理体系：2024 年发布的主流标准，目录未覆盖。
- NIST AI 600-1 GenAI Profile：NIST 针对生成式 AI 的风险剖面，值得独立成篇。
- MITRE ATLAS 红队战术手册：LLM 安全指南中仅提及，缺战术手册级落地内容。
- 多模态大模型安全：图像/视频/音频越狱、跨模态攻击、MM-SafetyBench 实践缺专题。
- 推理模型（Reasoning Model）安全：思维链注入、推理越狱、o1/DeepSeek-R1 安全缺独立文档。
- AI 公平性与偏见缓解工具链：AIF360、Fairlearn、What-If Tool 缺深度实践。
- AI 红队自动化平台对比：Garak、PyRIT、Purple Llama、inspect-ai、AgentDojo 缺横向选型。
- 监管审计与 Model Cards 实践：Model Cards Toolkit、透明度报告、数据溯源缺工程化内容。
- AI 供应链安全评估框架：缺针对 Hugging Face、模型仓库、插件市场的评估方法。
- AI 安全成熟度模型落地：缺从 L1 到 L5 的评估问卷与改进路径。

#### P2 — 前沿补充

- 超级对齐与可扩展监督：Debate、Recursive Reward Modeling、Weak-to-Strong Generalization。
- 神经网络形式化验证：针对安全属性的可证明安全方向。
- 跨文化 AI 伦理与本地化对齐：不同文化下的价值观冲突与原则本地化。
- 具身智能 / 机器人安全：物理世界中的 AI 安全与伦理。
- 生成式 AI 环境影响与绿色 AI：能耗、碳足迹、可持续训练推理。
- AI 意识与道德主体性：学术讨论与政策启示。
- 去中心化 AI 与 DAO 治理：Web3/DAO 视角下的 AI 治理。
- AI 深度伪造对抗取证前沿：实时检测、主动防御、司法取证。

#### 建议新建/补充的文件

- 暂无。

### 18_AI_Applications_Industry

`行业应用` 是知识库的 辅助章节（tier: supporting），定位为“AI 应用与行业融合”全景，覆盖医疗、金融、制造、零售、自动驾驶、教育、内容媒体、法律政务、农业、能源气候、代码生成、AI for Science 等 10+ 个行业。核心目标是提供 2025–2026 年的行业渗透率、标杆案例、技术趋势和 ROI 数据，面向行业分析师、产品经理和初学者建立跨行业认知地图。

- **总体评分**: -/10

#### P0 — 生产环境必备

- 行业 AI 生产架构设计 — 各行业都没有端到端部署架构图（数据流、模型服务、网关、缓存、灾备）。
- 行业 AI 运维 Runbook — 无 SLA/SLO 定义、无监控告警、无回滚、无故障排查手册。
- 模型治理与 AI 风险管理 — 缺少模型版本管理、漂移检测、偏见审计、退市流程。
- 成本优化与 FinOps — 仅有 ROI 概览，缺 GPU/Token 成本估算、缓存策略、模型路由降本。
- 安全合规实践 — 医疗 HIPAA/FDA、金融算法备案/反洗钱、汽车准入等只有法规罗列，缺落地 checklist。
- 数据工程与 MLOps 工具链 — 缺行业特征平台、数据标注 pipeline、离线/在线一致性方案。
- 多 Agent 生产编排 — Agentic AI 提得多，但无 CrewAI/AutoGen/LangGraph 等行业落地模式。
- 边缘 AI / IoT 部署 — 制造、农业、自动驾驶缺边缘推理、模型量化、OTA 更新。
- 行业 LLM 选型与 RAG 评估 — 金融/法律/医疗缺 RAG 准确率、幻觉率、引用可追溯性评估。
- 行业案例研究（Case Study） — 现有案例多为 3–5 行简介，缺完整背景、方案、数据、教训。

#### P1 — 行业主流

- 代码生成行业深度 — `AI_Code_Generation_2026.md` 过薄，缺 GitHub Copilot、Cursor、Devin、SWE-agent 对比。
- AI 安全/网络安全行业 — 完全缺失（威胁检测、SOC、漏洞挖掘、红队 AI）。
- 电信与 5G/6G AI — 缺失 RAN 优化、网络切片、AIOps、客服机器人。
- 游戏与互动娱乐 — 仅内容媒体提及 NPC，缺 AI 生成游戏、世界模型、玩家匹配。
- 人力资源与招聘 — 缺失简历筛选、AI 面试、员工敬业度分析。
- 房地产与建筑 AEC — 缺失 BIM+AI、施工安全、能耗优化。
- AI 法务 Agent 工作流 — 法律文件只有产品罗列，缺合同审查 Agent 完整流程。
- 金融实时风控工程 — 缺特征平台、规则/模型混合引擎、毫秒级决策架构。
- 医疗 AI 临床集成（HIS/PACS/EMR） — 缺 DICOM/FHIR 集成、科室落地流程。
- 零售 AI 购物助手产品化 — 缺对话式商务、退货 AI、虚拟试穿的工程方案。

#### P2 — 前沿补充

- 高校教材式实验/Lab — 全目录无实验手册、代码 notebook、数据集。
- 行业数据集与基准 — 缺公开数据集列表、行业 benchmark（如 MIMIC、Credit Default、COCO 工业版）。
- AI for Science 实验/代码 — 缺 AlphaFold API、Molecular Dynamics 入门实验。
- 农业机器人与无人机 — 农业文件已有，但缺采摘机器人、无人机植保案例。
- 气候与碳中和大模型 — 能源气候缺 GenCast/GraphCast 详细技术解析。
- AI 伦理与社会影响行业化 — 缺各行业偏见案例、公平性评估。
- 中国/全球监管地图 — 缺欧盟 AI Act、中国算法备案、美国 FDA/NHTSA 对比矩阵。
- 行业 AI 投资回报测算模板 — 缺可复用的 TCO/ROI 计算框架。
- 跨行业 AI 平台/AI Factory — 缺企业级 AI 中台、模型即服务（MaaS）架构。
- 开源/商业平台选型 — 缺 Hugging Face、NVIDIA AI Enterprise、Azure OpenAI、百度千帆等行业选型。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``AI_Production_Architecture_2026.md`` | P0 | 根目录 |
| ``AI_Industry_Runbook.md`` | P0 | 根目录 |
| ``AI_Model_Governance_and_Risk_Management.md`` | P0 | 根目录 |
| ``AI_Industry_Cost_Optimization_2026.md`` | P0 | 根目录 |
| ``Healthcare/AI_Healthcare_Integration_Runbook.md`` | P0 | Healthcare/ |
| ``Finance/AI_Finance_Risk_Architecture_2026.md`` | P0 | Finance/ |
| ``Manufacturing/AI_Edge_AI_for_Manufacturing_Runbook.md`` | P0 | Manufacturing/ |
| ``Legal_Government/AI_Legal_Agent_Workflow_2026.md`` | P0 | Legal_Government/ |
| ``Finance/AI_Finance_Case_Study.md`` | P0 | Finance/ |
| ``Healthcare/AI_Healthcare_Case_Study.md`` | P0 | Healthcare/ |

### 19_Talks

`业界观点` 当前定位为 AI 名人演讲与观点（Talks） 的辅助章节（`tier: supporting`），采用「按人物组织」的结构：29 个演讲者/频道子目录，每个目录下基本为 `about.md`（人物简介与立场）+ `sayings.md`（金句摘录），并在根目录提供 `README.md`、`README_for_dummy.md`、`Talks_for_dummy.md` 与 `Talks_Synthesis_2026.md`。该章节目的是帮助读者从技术领袖视角理解 AI 发展脉络与争议，但本质上是一本「人物观点速查手册」，尚未形成面向教材、企业生产或行业主流的深度内容

- **总体评分**: -/10

#### P0 — 生产环境必备

- 企业 AI 技术战略与投资决策框架
- AI 团队组织与人才建设观点
- AI 产品商业化与落地案例
- AI 安全治理、合规与审计框架
- AI 基础设施成本优化与算力采购观点
- AI 供应商与模型选型决策
- AI 项目失败案例与反模式
- AI 伦理审查与风险管理 Runbook

#### P1 — 行业主流

- Agent 智能体观点合成
- 推理模型 / Test-Time Compute 观点
- MCP / 工具调用生态观点
- 多模态模型与内容生成观点
- 开源 vs 闭源 2026 最新态势
- 中国 AI 与全球竞争格局
- AI 创业与融资观点
- 边缘 AI / 端侧模型观点
- AI 编程与 Vibe Coding 主流化
- 主要技术大会演讲索引

#### P2 — 前沿补充

- 具身智能 / 机器人领袖观点
- AI for Science 领袖观点
- 世界模型 / 神经符号观点
- AI 监管与政策领袖观点
- AI 与就业 / 社会经济影响
- 更多元化声音

#### 建议新建/补充的文件

- 暂无。

### 20_Papers_and_Research

`论文精读` 是 ai-guru-database 的 辅助章节（tier: supporting），承担两个角色：一是「22 篇必读 AI 论文清单」的论文精读入口，为各主章节（深度学习、CV、NLP、RL 等）提供源头论文解读；二是「课题研究（Methodology）」模板区，用于沉淀问题导向的专题研究。当前内容以 2012–2023 年的经典论文 Deep Dive 为主，2024–2026 前沿补充极少，工程化、工具链、Runbook 类内容几乎空白。

- **总体评分**: -/10

#### P0 — 生产环境必备

- 推理优化论文群：FlashAttention、vLLM（PagedAttention）、Speculative Decoding、StreamingLLM、KV Cache 量化（KV Cache Compression）是企业部署 LLM 的核心。
- Agent / 工具调用 / Function Calling 论文：ReAct、Toolformer、Gorilla、AutoGPT 等，Agent 已成为生产主流架构。
- 长上下文与上下文压缩：LongLoRA、Longformer、Ring Attention、Mamba / State Space Models，解决生产中的长文档处理。
- 模型评测与红队：HELM、MMLU、HumanEval、SWE-bench、AgentBench 等基准论文，缺系统评测方法论。
- RAG 生产化演进：Dense Passage Retrieval（DPR）、ColBERT、BGE/M3E、GraphRAG、Self-RAG、Corrective RAG 等缺独立 Deep Dive。
- 模型量化与压缩：GPTQ、AWQ、GGUF/llama.cpp、SmoothQuant、SpinQuant 是企业端侧/成本优化关键。
- 分布式训练工程：ZeRO（DeepSpeed）、Megatron-LM、FSDP、3D Parallelism、Pipeline Parallelism 论文/技术报告。
- 数据工程与数据质量：The Pile、Dolma、FineWeb、DataComp 等数据配比/筛选论文。
- AI 安全与对齐生产实践：Constitutional AI、RLAIF、Jailbreak 攻防、Prompt Injection 防御、AI 审计 Runbook。
- 观测与可解释性：Mechanistic Interpretability、Logit Lens、Transformer Circuits、可解释性论文群。

#### P1 — 行业主流

- 推理模型 / Test-time Compute：OpenAI o1/o3、DeepSeek-R1、Kimi k1.5、QwQ 等「慢思考」论文与技术报告。
- 强化学习新范式：GRPO（Group Relative Policy Optimization）、DAPO、PPO/RLHF 后续改进。
- 多模态大模型：CLIP（虽有）、LLaVA、GPT-4V 技术报告、Qwen2-VL、Gemini 技术报告、扩散 Transformer（DiT）。
- 开源模型生态：LLaMA 3/3.1/3.2、Qwen2/2.5、Mistral、Mixtral、Gemma 技术报告。
- MoE 与高效架构：Mixtral 8x7B/8x22B、DeepSeek-V2/V3/R1、Jamba、Mamba-2。
- 代码 / 数学 / 科学智能体：AlphaCode、Devin、SWE-agent、OpenAI Codex、Mathematica/Lean 证明助手。
- 合成数据与自举训练：Self-Instruct、Alpaca、Evol-Instruct、SynthID、Constitutional AI 自举。
- 检索与向量数据库：HNSW、FAISS、Milvus/Pinecone 架构论文，Embedding 模型（BGE、E5、GTE、MTEB）。
- AI  infra 平台：Kubernetes + LLM Serving、TGI、Triton TensorRT-LLM、SGLang、LMDeploy 架构。
- 企业应用架构：RAG 架构设计、Agent 编排（LangGraph、AutoGen、Dify）、多 Agent 协作论文。

#### P2 — 前沿补充

- 世界模型与具身智能：Sora 技术报告、Video Diffusion、World Models（Ha & Schmidhuber）、RT-2、VLA 模型。
- 神经符号与程序合成：AlphaProof、LeanDojo、DSPy、Reflection 等。
- 模型融合与编辑：Model Soups、Task Arithmetic、ROME/MEMIT、知识编辑。
- 高效采样与解码：Contrastive Decoding、Best-of-N、Structured Decoding、Outlines。
- 边缘 AI 与端侧部署：MobileLLM、Phi、Gemma 2B、Apple Intelligence、端侧量化。
- AI 经济学与成本模型：大模型训练/推理成本测算、TCO 分析、碳排放评估。
- 前沿架构探索：RWKV、RetNet、Linear Attention、TTT、Mamba 替代路线。
- 多语言与低资源：mT5、XLM-R、Aya、多语言对齐。
- AI 安全政策与合规：EU AI Act、NIST AI RMF、中国生成式 AI 管理办法解读。
- 论文阅读方法论与复现指南：如何读论文、复现 checklist、Baseline 调试、实验设计。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``FlashAttention_Deep_Dive.md`` | P0 | `Efficiency/` |
| ``vLLM_PagedAttention_Deep_Dive.md`` | P0 | `Efficiency/` |
| ``Speculative_Decoding_Deep_Dive.md`` | P0 | `Efficiency/` |
| ``ReAct_Deep_Dive.md`` | P0 | `RL/` 或新建 `Agents/` |
| ``Toolformer_Deep_Dive.md`` | P0 | `RL/` 或新建 `Agents/` |
| ``RAG_2026.md`` | P0 | `Retrieval/` |
| ``Mamba_State_Space_Models_Deep_Dive.md`` | P0 | `Architecture/` |
| ``DeepSeek_R1_Technical_Report.md`` | P0 | `Frontier/` |
| ``Constitutional_AI_Deep_Dive.md`` | P0 | `Alignment/` |
| ``LLM_Evaluation_Benchmarks_2026.md`` | P0 | `Methodology/` 或新建 `Evaluation/` |

### 21_Interviews

`面试岗位` 是 ai-guru-database 的辅助章节（supporting tier），定位为 AI/ML 全岗位的面试准备资料集，覆盖 20+ 个岗位的核心职责、能力要求、考点梳理与题库。章节以「岗位即目录」组织，期望每个岗位形成 `interview_preparing.md → question_bank.md → company_level_question_bank.md → interview_answers.md` 的完整备考闭环，但目前仅约 1/3 岗位达到了该完整度。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- Agent / AI Agent Engineer 岗位面试资料：README 已引用 `Agent`，但 `面试岗位` 内完全没有 Agent Engineer、Agent 平台工程师、Multi-Agent 工程师的考点。
- 大模型后训练 / Post-Training Engineer 岗位：SFT、RLHF、DPO、GRPO、模型蒸馏、数据配比等无专门岗位。
- AI 编译器 / AI Compiler Engineer 岗位：TVM、MLIR、XLA、triton kernel、算子融合是生产推理核心，无覆盖。
- 端侧 AI / Edge AI Engineer 岗位：ONNX Runtime、TensorRT、Core ML、NNAPI、手机 NPU 部署无岗位。
- 多模态 / Multimodal Engineer 岗位：VLM、跨模态检索、多模态 RAG 无专门考点。
- AI 数据工程 / Data-Centric AI 岗位：数据飞轮、数据标注管线、合成数据、数据质量门禁缺失。
- 行业案例与系统设计题解：现有题目多为问答列表，缺少「设计一个日活千万的 RAG 客服系统」的完整解题框架。
- 行为面试与领导力面试（Behavioral / Leadership）：仅 MLE 有 7 题行为题，其他岗位完全没有。
- 简历模板 / 项目 STAR 拆解模板：`interview_notes_template.md` 仅复盘，无简历项目和面试故事模板。
- On-Call / 事故响应 Runbook 面试题：Cloud Ops 有概念题，但无「P0 告警后 30 分钟操作手册」式题目。

#### P1 — 行业主流

- MCP / A2A / Agent 协议：2024-2025 年 Agent 互操作主流协议未出现在任何题库。
- Reasoning 模型考点：o1/o3/DeepSeek-R1 的推理时 scaling、Test-time compute、长思维链评估缺失。
- 模型上下文与长上下文工程：LongRoPE、YaRN、上下文压缩、RAG vs Long Context 选型无系统题。
- 高效微调与参数高效方法：LoRA 有涉及，但 DoRA、QLoRA、LoRA-FA、PiSSA、Adapter 系列不系统。
- 推理引擎对比深化：vLLM/SGLang/TensorRT-LLM/llama.cpp 有提及，但 TGI、Triton、MLC-LLM、KTransformers 未覆盖。
- 向量与图 RAG 进阶：GraphRAG、HippoRAG、Self-RAG、CRAG、Agentic RAG 概念题不足。
- 模型安全与红队测试实操：AI Security 骨架中无具体越狱攻击面、评估数据集（如 HarmBench）、防护方案题。
- AI 产品成本与商业化定价：Token 成本、路由降级、模型级联、计费设计是 AI PM/Architect 高频题，缺专题。
- 国产化/信创 AI 基础设施：昇腾、寒武纪、海光接入仅在 AI Infra/Cloud Ops 中各 1 题，缺体系。
- AI 平台可观测性：LLM Trace、Prompt 版本追踪、反馈闭环、在线评估体系无专题。

#### P2 — 前沿补充

- World Model / 具身智能面试考点：Robotics 岗位仍偏传统 ROS/SLAM，VLA、扩散策略、Sim2Real 缺失。
- AI for Science / 科学计算岗位：材料、生物、气象等垂直 AI 岗位未涉及。
- AI 伦理与审计岗位：AI Policy 只有政策合规，缺 AI Ethics Auditor、Responsible AI Engineer。
- 语音/音乐/视频生成工程师岗位：TTS、SVD、音乐生成无专门目录。
- AI 基础设施调度前沿：H100/H200/B300、Blackwell、GB200 NVL、液冷、能耗 PUE 等考点。
- 联邦学习与隐私计算面试题：AI Security 中未单独成块。
- AI 竞赛/Kaggle 项目复盘模板：作为非科班转行的主要项目来源，无准备指南。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``Agent_Engineer_2026.md`` | P0 | `面试岗位/Agent_Engineer/` |
| ``Agent_Engineer_for_dummy.md`` | P0 | `面试岗位/Agent_Engineer/` |
| ``Post_Training_Engineer_2026.md`` | P0 | `面试岗位/Post_Training_Engineer/` |
| ``AI_Compiler_Engineer_2026.md`` | P0 | `面试岗位/AI_Compiler_Engineer/` |
| ``Edge_AI_Engineer_2026.md`` | P0 | `面试岗位/Edge_AI_Engineer/` |
| ``Multimodal_Engineer_2026.md`` | P0 | `面试岗位/Multimodal_Engineer/` |
| ``AI_Data_Engineer_Runbook.md`` | P0 | `面试岗位/AI_Data_Engineer/` |
| ``Behavioral_Interview_Case_Study.md`` | P0 | `面试岗位/` 根目录 |
| ``System_Design_for_AI_Case_Study.md`` | P0 | `面试岗位/` 根目录 |
| ``Resume_Project_STAR_Template.md`` | P0 | `面试岗位/` 根目录 |

### 90_Learn

`90_Learn` 是 ai-guru-database 的学习导航中心，不直接讲授技术细节，而是通过“概念分层（Stage 0-4）+ 角色路径（零基础/ML/LLM/PM/Java/研究者）+ 外部课程映射 + 自测里程碑”四件套，帮助读者定位起点并规划学习路线。目录定位清晰，但与实际章节内容的衔接存在链接/命名不一致问题。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- LLM/RAG 生产环境 Runbook：故障排查、降级、回滚、SLO/SLA、值班响应。
- AI Gateway 部署与运维指南：多模型路由、限流、熔断、Token 成本控制的落地配置。
- LLM 成本优化与 FinOps 实战：模型路由、缓存、量化、批处理的成本测算。
- AI 安全合规检查清单 2026：Prompt 注入、PII 泄露、审计日志、EU AI Act / 中国算法备案。
- RAG 系统端到端实验/作业：从文档切分到评估指标，配套代码与答案。
- LLMOps / MLOps 流水线实操案例：CI/CD、模型版本、数据漂移、自动再训练。
- AI 应用性能压测与容量规划指南：并发、延迟、显存、自动扩缩容。
- 模型 Incident Response 与灾难恢复流程：线上模型异常、数据中毒、回滚策略。
- 推理模型学习路径 2026：o1/o3、DeepSeek-R1、QwQ、Kimi k1.5、Test-Time Compute。
- MCP 协议入门与实战：Model Context Protocol 的核心概念与代码示例。

#### P1 — 行业主流

- 推理模型学习路径 2026：o1/o3、DeepSeek-R1、QwQ、Kimi k1.5、Test-Time Compute。
- MCP 协议入门与实战：Model Context Protocol 的核心概念与代码示例。
- A2A / ANP Agent 通信协议入门：多 Agent 协作的协议栈。
- Agentic RL / GRPO 学习指南：SFT → GRPO、推理与工具使用训练。
- 多模态 AI 2026 全景与选型：原生多模态、视频生成、VLM/VLA 边界。
- AI 编程工具学习路径 2026：Cursor、Claude Code、Codex、Windsurf 的工程化使用。
- 小模型 / 端侧 LLM 部署指南：Phi-4、Gemma 2B、昇腾/Apple 端侧推理。
- 合成数据与数据工程 2026：数据墙背景下的合成数据pipeline。
- LLM 评测与 Benchmark 2026 解读：Agentic Benchmark、LLM-as-Judge、RAGAS。
- 长上下文 vs RAG 决策框架：何时用 128K+ 长上下文，何时必须 RAG。

#### P2 — 前沿补充

- 世界模型 / JEPA 入门：Yann LeCun JEPA 与 V-JEPA 的核心思想。
- VLA 与具身智能入门：视觉-语言-动作模型、sim-to-real、机器人控制。
- Test-Time Compute Scaling 2026：推理时计算扩展的原理与实践。
- AGI 路径与评估 2026：窄义/广义 AGI、ARC-AGI、AgentBench。
- AI 芯片与基础设施 2026：NVIDIA Blackwell、AMD MI350、国产昇腾、RoCE/InfiniBand。
- AI for Science 案例研究：AlphaFold、材料发现、气象预测。
- 神经符号 / 形式化验证入门：符号推理与神经网络融合。
- 量子机器学习概览 2026：量子计算对 ML 的潜在影响。

#### 建议新建/补充的文件

- 暂无。

### 93_Templates

`93_Templates` 被 README 定位为「工具领域知识文章 + 项目运维指南」的支撑章节：一方面承载 API 设计、文档自动化、Prompt 管理平台等通用工具方法论，另一方面沉淀知识库自身的文档模板与导入规范。然而实际目录非常扁平，仅有 5 份有效知识文件（其余 7 份为带 ` 2.md` 后缀的重复副本），无任何子目录，也没有为工具类主题提供 `for_dummy`、`in-nutshell`、`Case_Study`、`Runbook` 等多形态内容。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- LLM 网关（LLM Gateway）：统一路由、负载均衡、回退、密钥管理、速率限制，生产部署刚需。
- AI 应用可观测性（Observability）：OpenTelemetry + LLM 追踪、指标、日志、成本归因。
- AI 服务 CI/CD Runbook：模型版本灰度、A/B 测试、回滚、审批流水线。
- AI 成本优化指南：Token 计费、缓存策略、模型降级、批处理、预算告警。
- AI 安全与合规 Runbook：输入输出过滤、PII 脱敏、审计、GDPR/等保对齐。
- Prompt 安全与治理：Prompt 注入防护、沙箱、权限模型、版本审计。
- AI API 测试策略：契约测试、混沌测试、模型输出回归测试。
- 密钥与模型配置管理：Secrets rotation、多环境配置、模型端点管理。
- RAG 生产化工具链：向量数据库选型、重排序、Embedding 服务、评估工具。
- Agent 生产部署框架：编排、状态持久化、人机协同、多 Agent 通信协议。

#### P1 — 行业主流

- AI 编码助手全景 2026：Cursor、Windsurf、GitHub Copilot、Devin、Codeium 对比与选型。
- MCP / A2A 协议实践：模型上下文协议与 Agent2Agent 协议的原理、工具注册、安全边界。
- 向量数据库对比 2026：Milvus、Pinecone、Weaviate、Qdrant、pgvector、TiDB Vector 选型矩阵。
- 多模型编排框架：LangChain / LlamaIndex / PydanticAI / smolagents / CrewAI 适用场景。
- AI 文档/知识库 Agent：RAGFlow、Dify、FastGPT、MaxKB、AnythingLLM 部署实践。
- 模型评测与实验平台：Weights & Biases、MLflow、Comet、DVC、Hugging Face Evaluate。
- AI 数据工程工具链：数据标注、合成数据、数据版本、数据质量（Cleanlab、Great Expectations）。
- 边缘/端侧 AI 工具：ONNX Runtime、TensorRT、Core ML、MediaPipe、GGUF/llama.cpp 部署。
- AI 产品分析平台：Amplitude / Mixpanel / PostHog 与 LLM 会话分析结合。
- 企业知识库导入/迁移 Runbook：从 Confluence、Notion、Wiki、SharePoint 迁移到 Obsidian/自建库。

#### P2 — 前沿补充

- AI Agent 安全红队测试： jailbreak、间接提示注入、工具滥用评估。
- 模型水印与溯源工具：SynthID、IMATAG、AIGC 水印合规。
- 联邦学习/隐私计算工具链：PySyft、OpenFL、TEE 推理部署。
- AI 伦理审查模板：影响评估、偏见检查表、模型卡片自动化。
- AI 开源许可证与合规：模型权重许可、数据集许可、商用风险清单。
- 多模态内容审核工具：文本/图像/视频/音频统一审核平台。
- AI 能耗与碳足迹评估工具：ML CO₂ Impact、CodeCarbon、Green AI 实践。
- AI 演讲/播客/视频生成工作流： NotebookLM、ElevenLabs、HeyGen、Sora 生产化。
- 量子-经典混合 AI 工具预览：Qiskit Machine Learning、PennyLane 入门。
- AI 辅助学术写作与论文复现工具：Elicit、Consensus、PaperQA2、开源复现工作流。

#### 建议新建/补充的文件

| 建议文件名 | 优先级 | 目标子目录 |
|---|---|---|
| ``LLM_Gateway_Deep_Dive.md`` | P0 | `93_Templates/LLM_Gateway/` |
| ``LLM_Gateway_for_dummy.md`` | P0 | `93_Templates/LLM_Gateway/` |
| ``AI_Observability_Runbook.md`` | P0 | `93_Templates/AI_Operations/` |
| ``AI_Cost_Optimization_Runbook.md`` | P0 | `93_Templates/AI_Operations/` |
| ``AI_Security_Compliance_Runbook.md`` | P0 | `93_Templates/AI_Security/` |
| ``Prompt_Security_Deep_Dive.md`` | P0 | `93_Templates/AI_Security/` |
| ``AI_API_Testing_Guide.md`` | P0 | `93_Templates/AI_Testing/` |
| ``AI_CICD_Runbook.md`` | P0 | `93_Templates/AI_Operations/` |
| ``RAG_Production_Toolchain_2026.md`` | P0 | `93_Templates/RAG_Tools/` |
| ``Vector_Databases_2026.md`` | P1 | `93_Templates/RAG_Tools/` |

### 94_Visualization

`94_Visualization` 当前是一个支撑型（supporting）章节，兼具两类角色：   1. 知识图谱导航工具：通过 `index.html` + `data.json` 把整个知识库的章节/文档关系以交互式图谱呈现；   2. AI 可视化学习内容载体：用 4 份主文档覆盖了训练监控、模型可解释性、AI 系统仪表盘与小白入门。   整体定位偏向“让 AI 训练与推理过程可观测、可解释”，但尚未形成面向生产环境、LLM 时代与前沿研究的系统化子目录体系。  ---

- **总体评分**: -/10

#### P0 — 生产环境必备

- LLM/Agent 可观测性平台深度实践（LangSmith、Langfuse、OpenLIT、Phoenix/Arize）—— 缺少 traces/spans、prompt 版本、token 成本、评估指标的一体化监控。
- Prometheus + Grafana MLOps 监控 Runbook—— 模型服务延迟、吞吐量、GPU、错误率、SLO/告警的工程化仪表盘。
- LLM API / GPU 集群成本治理与配额可视化—— 按项目/模型/用户维度的成本分摊、预算告警、降本策略。
- 生产环境 AI 仪表盘事故响应 Runbook—— 异常识别、回滚、根因分析、on-call 流程。
- RAG 检索质量与漂移可视化—— 相关性、召回率、答案忠实度、embedding/文档漂移监控。
- Agent 执行链路追踪与回放—— 多步工具调用、重试、错误栈、决策路径可视化。
- LLM 可解释性深度方法（Logit Lens、Attention Attribution、Activation Patching、Layer-wise Probing）。
- Mechanistic Interpretability + Sparse Autoencoders（SAE）可视化—— 特征可解释性、神经元激活、steering vectors。
- 生成式模型/扩散模型 latent 空间可视化—— Stable Diffusion 注意力图、latent traversal、生成过程监控。
- 多模态（VLM）可视化—— CLIP/LLaVA 的跨模态注意力、grounding、segmentation 叠加。

#### P1 — 行业主流

- LLM 可解释性深度方法（Logit Lens、Attention Attribution、Activation Patching、Layer-wise Probing）。
- Mechanistic Interpretability + Sparse Autoencoders（SAE）可视化—— 特征可解释性、神经元激活、steering vectors。
- 生成式模型/扩散模型 latent 空间可视化—— Stable Diffusion 注意力图、latent traversal、生成过程监控。
- 多模态（VLM）可视化—— CLIP/LLaVA 的跨模态注意力、grounding、segmentation 叠加。
- 实时交互式仪表盘框架选型（2024-2026）—— Plotly Dash、Streamlit、Gradio、Panel、React+Vega、Observable 对比与最佳实践。
- 向量数据库与 Embedding 空间可视化—— 2D/3D 投影、nearest-neighbor 图、聚类、异常 chunk 定位。
- LLM 评估与 Judge 可视化—— 排行榜、pairwise 对比、ELO 评分、人类反馈热力图。
- Prompt 工程/测试可视化—— prompt 版本差异、token 热力图、prompt chain 流程图。
- 3D 视觉/NeRF/Gaussian Splatting 可视化—— 点云、辐射场、高斯溅射渲染与交互。
- 因果推断与反事实解释可视化—— 反事实样本、因果图、干预效果展示。

#### P2 — 前沿补充

- 3D 视觉/NeRF/Gaussian Splatting 可视化—— 点云、辐射场、高斯溅射渲染与交互。
- 因果推断与反事实解释可视化—— 反事实样本、因果图、干预效果展示。
- 隐私/公平性/合规仪表盘—— PII 检测、差分隐私预算、群体公平性指标。
- 合成数据质量可视化—— 分布相似性、样本异常、隐私-效用权衡。
- 图神经网络/知识图谱可视化—— GNN 节点嵌入、注意力、子图解释。
- 具身智能/机器人策略 rollout 可视化—— 感知输入、动作轨迹、价值函数热图。

#### 建议新建/补充的文件

- 暂无。

## 四、跨章节共性缺口

基于审计，以下主题在多个章节反复出现，建议作为横向专项优先补齐：

1. **LLM/Agent 生产部署与运维 Runbook**: 00/05/11/12/13/14/15/16/18 均缺上线、回滚、扩缩容、事故响应。
2. **AI 成本优化与 FinOps**: 00/05/07/10/11/12/15/16/18 均缺成本归因、预算告警、模型路由降本。
3. **AI 安全与合规治理**: 00/05/11/14/15/16/17/18 均缺护栏、审计、合规 checklist、事件响应。
4. **可观测性与 LLM Tracing**: 00/04/09/11/12/13/14/15/16/94 均缺 trace/metrics/logs 一体化。
5. **RAG/Agent 评估体系**: 08/09/14/15 均缺系统化评估框架、LLM-as-Judge 偏见控制。
6. **AI SRE / 灾备 / 业务连续性**: 11/12/13/18 均缺 SLO、RTO/RPO、灾难恢复。
7. **行业端到端落地案例**: 04/06/18 缺工业质检、推荐、调度、自动驾驶等完整案例。

## 五、下一步行动

1. 以本报告为基础，制定 `_meta/_content-supplement-plan-2026-07-01.md` 执行计划。
2. 优先创建 P0 级别、跨章节引用频率最高的核心文档。
3. 每创建一批文档后更新对应章节 README.md，保持导航一致。
4. 运行 `_tools/check_links.py` 和 `_tools/count_words.py` 验证新增文件质量。

---
*本报告由 Agent 自动审计生成，人工复核后可作为内容补充的路线图。*