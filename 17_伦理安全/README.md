---
title: 08 AI 伦理、安全与对齐 (Ethics, Safety & Alignment)
category: 17-ethics-safety
tags: ["ai-ethics", "safety", "alignment", "red-teaming"]
summary: "本章探讨 AI 系统的可信度与责任性，涵盖价值对齐技术（RLHF/DPO）、AI 安全与红队测试（对抗攻击/提示词注入）。随着 AI 能力增强，确保系统安全、公平、可控变得至关重要。"
created: 2026-05-31
updated: 2026-05-31
tier: supporting
sources: []

name_zh: "08 AI 伦理、安全与对齐"
---
# 08 AI 伦理、安全与对齐 (Ethics, Safety & Alignment)

> 中文简称：08 AI 伦理、安全与对齐

本章探讨 AI 系统的可信度与责任性，涵盖价值对齐技术（RLHF/DPO）、AI 安全与红队测试（对抗攻击/提示词注入）。随着 AI 能力增强，确保系统安全、公平、可控变得至关重要。

## 学习路径 (Learning Path)

```
    ┌─────────────────────────────────────────────────────────┐
    │  基础安全与对齐层                                        │
    │  ┌──────────────────────┐  ┌──────────────────────┐   │
    │  │  价值对齐             │  │  AI 安全与红队        │   │
    │  │  Value Alignment     │  │  AI Safety &         │   │
    │  │  (RLHF/DPO)          │  │  Red Teaming         │   │
    │  └──────────────────────┘  │ (对抗/防御)          │   │
    │           │                 └──────────────────────┘   │
    │           └──────────────────┬─────────────────────────┘
    │                              │
    │                              ▼
    │  ┌───────────────────────────────────────────────────┐
    │  │              专业安全研究层                        │
    │  │  ┌──────────────┐ ┌──────────────┐              │
    │  │  │ 模型安全机制  │ │ 隐私保护AI    │              │
    │  │  │ Mechanistic  │ │ Privacy-     │              │
    │  │  │ Interpret-   │ │ Preserving   │              │
    │  │  │ ability      │ │ AI           │              │
    │  │  └──────────────┘ └──────────────┘              │
    │  │  ┌──────────────┐ ┌──────────────┐              │
    │  │  │ 深度伪造安全  │ │ AI供应链安全  │              │
    │  │  │ Deepfake     │ │ Supply Chain │              │
    │  │  │ Security     │ │ Security     │              │
    │  │  └──────────────┘ └──────────────┘              │
    │  └───────────────────────────────────────────────────┘
    │                              │
    │                              ▼
    │  ┌───────────────────────────────────────────────────┐
    │  │              生产安全实践层                        │
    │  │         AI安全 2026 (OWASP/ASI框架)               │
    │  └───────────────────────────────────────────────────┘
    └─────────────────────────────────────────────────────────┘
```

## 内容索引 (Content Index)

### 基础层

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 价值对齐 (Value Alignment) | 进阶 | RLHF、DPO、奖励建模，让 AI 输出符合人类偏好 | [04_Value_对齐.md](17_伦理安全/02_价值对齐/04_Value_对齐.md) |
| AI 安全与红队 (AI Safety & Red Teaming) | 实战 | 对抗样本、提示词注入、越狱攻击、安全护栏，防御恶意使用 | [02_AI安全_RedTeaming.md](17_伦理安全/04_AI安全与红队/02_AI安全_RedTeaming.md) |

### 专业安全研究层

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| 模型安全机制 (Mechanistic Interpretability) | 专业 | 逆向工程神经网络、电路追踪、形式化验证，实现可证明的 AI 安全 | [02_机制可解释性.md](17_伦理安全/05_机制可解释性/02_机制可解释性.md) |
| 隐私保护 AI (Privacy-Preserving AI) | 专业 | 差分隐私、联邦学习、同态加密、成员推断攻击防御 | [02_隐私保护AI.md](17_伦理安全/10_隐私保护AI/02_隐私保护AI.md) |
| 深度伪造检测 (Deepfake Detection) | 专业 | 深度伪造检测技术、音视频伪造识别、内容真实性验证 | [02_深度fake_安全.md](17_伦理安全/09_深度伪造安全/02_深度fake_安全.md) |
| AI 供应链安全 (Supply Chain Security) | 专业 | 数据投毒防御、模型后门检测、依赖安全、SBOM 管理 | [01_AI_AI供应链安全.md](17_伦理安全/08_AI供应链安全/01_AI_AI供应链安全.md) |
| **联邦学习 (Federated Learning)** | **专业** | **FedAvg/FedProx/SCAFFOLD、差分隐私+安全聚合、联邦 LLM 微调** | **[Federated_Learning/](./11_联邦学习/)** |

### 生产实践层

| 主题 | 难度 | 描述 | 文档链接 |
|------|------|------|---------|
| AI 安全 2026 (AI Security 2026) | 实战 | OWASP LLM Top 10 + ASI Agentic AI 安全框架，生产级防御 | [01_AI安全2026.md](17_伦理安全/07_AI安全2026/01_AI安全2026.md) |
| K8s 策略引擎 — OPA/Gatekeeper | 实战 | 通用策略即代码：Rgo 语言、K8s 准入控制、API 授权 | [05_OPA_深入分析.md](./07_AI安全2026/05_OPA_深入分析.md) |
| K8s 原生策略 — Kyverno | 实战 | YAML 策略引擎：验证、变更、生成、镜像签名 | [04_Kyverno_深入分析.md](./07_AI安全2026/04_Kyverno_深入分析.md) |
| 运行时安全 — Falco | 实战 | 容器系统调用监控：逃逸检测、敏感文件访问、异常网络 | [02_Falco_深入分析.md](./07_AI安全2026/02_Falco_深入分析.md) |
| AI 监管工程化 2026 | 实战 | 欧盟 AI 法案、监管即代码、合规生命周期管理、可审计性 | [03_AI监管工程2026.md](17_伦理安全/03_AI治理/03_AI监管工程2026.md) |
| AI 安全评测框架 (Safety Evaluation) | 实战 | 毒性/偏见/幻觉评测、对抗鲁棒性、红队测试方法论与基准 | [05_安全评估_框架.md](17_伦理安全/04_AI安全与红队/05_安全评估_框架.md) |

## 前置知识 (Prerequisites)

- **必修**: [大语言模型架构](05_大模型/05_LLM架构/05_LLM架构.md)（理解 LLM 行为）
- **必修**: [微调技术](05_大模型/07_微调技术/03_微调技术.md)（RLHF 是微调的一种）
- **推荐**: [深度强化学习](06_强化学习/02_深度强化学习/02_深度强化学习.md)（RLHF 中的 PPO）
- **推荐**: [提示词工程](../05_大模型/08_提示工程/)（理解越狱攻击）

## 关键术语速查 (Key Terms)

### 对齐与安全基础
- **RLHF (Reinforcement Learning from Human Feedback)**: 基于人类反馈的强化学习，训练奖励模型后用 PPO 优化策略
- **DPO (Direct Preference Optimization)**: 直接偏好优化，绕过奖励模型的对齐方法
- **奖励模型 (Reward Model)**: 学习人类偏好的评分模型，用于 RLHF
- **对齐 (Alignment)**: 确保 AI 行为符合人类价值观和意图
- **红队测试 (Red Teaming)**: 模拟攻击者测试 AI 系统的安全性和鲁棒性
- **对抗样本 (Adversarial Examples)**: 精心构造的输入，欺骗模型产生错误输出
- **提示词注入 (Prompt Injection)**: 通过特殊提示词绕过 AI 安全限制
- **越狱 (Jailbreaking)**: 诱导模型输出违反安全政策的内容
- **安全护栏 (Safety Guardrails)**: 检测和阻止有害输入/输出的机制
- **公平性 (Fairness)**: 确保 AI 系统不歧视特定群体，输出无偏见

### 模型安全机制
- **Mechanistic Interpretability**: 机制可解释性，逆向工程神经网络理解内部工作原理
- **Circuit Tracing**: 电路追踪，定位执行特定任务的神经元和连接
- **Activation Patching**: 激活修补，因果干预方法定位关键计算组件
- **Sparse Autoencoder (SAE)**: 稀疏自编码器，将神经网络激活分解为可解释特征
- **Formal Verification**: 形式化验证，数学证明模型满足安全性质
- **Superalignment**: 超级对齐，用较弱 AI 监督控制更强 AI 的挑战

### 隐私保护
- **Differential Privacy (DP)**: 差分隐私，数学保证个体信息不被泄露
- **Privacy Budget (ε)**: 隐私预算，量化隐私保护强度的参数
- **Federated Learning**: 联邦学习，数据不出域的分布式训练
- **Secure Aggregation**: 安全聚合，保护客户端更新隐私的协议
- **Homomorphic Encryption**: 同态加密，密文上进行计算的加密技术
- **Membership Inference Attack**: 成员推断攻击，判断数据是否在训练集中
- **Model Inversion Attack**: 模型逆向攻击，从模型重构训练数据

### 深度伪造
- **Deepfake**: 深度伪造，使用深度学习生成的虚假音视频内容
- **Face Swapping**: 人脸替换，将一张脸替换到另一视频中的技术
- **Expression Reenactment**: 表情重演，驱动目标人脸模仿源视频表情
- **Voice Cloning**: 语音克隆，合成特定人声音的技术
- **Temporal Consistency**: 时序一致性，视频帧间的时间连贯性
- **Liveness Detection**: 活体检测，区分真人实时视频和伪造视频

### 供应链安全
- **Data Poisoning**: 数据投毒，污染训练数据影响模型行为
- **Model Backdoor**: 模型后门，植入隐藏触发器激活恶意行为
- **Supply Chain Attack**: 供应链攻击，通过第三方组件攻击系统
- **SBOM (Software Bill of Materials)**: 软件物料清单，组件清单和依赖关系
- **Typosquatting**: 拼写混淆攻击，使用相似名称的恶意包
- **Neural Cleanse**: 神经清洗，检测和缓解模型后门的算法
- **Model Watermarking**: 模型水印，嵌入所有权证明的技术

---
*Last updated: 2026-04-10* - 新增模型安全机制、隐私保护AI、深度伪造检测、AI供应链安全四大专业模块

## Related
- [[17_伦理安全/11_联邦学习/Federated_Learning_Deep_Dive|联邦学习深度解读: 从 FedAvg 到联邦 LLM 微调]]
- [[17_伦理安全/11_联邦学习/README|联邦学习 (Federated Learning)]]
- [[17_伦理安全/README|08 AI 伦理、安全与对齐 - 小白版]]

- [[17_伦理安全/04_AI安全与红队/02_AI安全_RedTeaming]] — AI 安全与红队 (AI Safety & Red Teaming) (共享: ai-ethics, alignment, red-teaming, safety)
- [[17_伦理安全/07_AI安全2026/README]] — AI安全 2026 (AI Security) (共享: ai-ethics, alignment, red-teaming, safety)
- [[17_伦理安全/08_AI供应链安全/AI_Supply_Chain_Security]] — AI 供应链安全 2026 (共享: ai-ethics, alignment, red-teaming, safety)
- [[17_伦理安全/Ethics_Safety-in-nutshell|AI 伦理与安全速览]] — 一张图看懂 AI 伦理与安全全貌 (共享: ai-safety, alignment, rlhf, red-teaming)
- [[17_伦理安全/Ethics-in-nutshell]] — AI 伦理与安全速成指南 (共享: ai-ethics, alignment, red-teaming, safety)
- [[17_伦理安全/04_AI安全与红队/AI_Safety_RedTeaming_for_dummy]] — AI_Safety_RedTeaming_for_dummy
- [[17_伦理安全/10_隐私保护AI/Privacy_Preserving_AI]] — Privacy_Preserving_AI
- [[17_伦理安全/10_隐私保护AI/Privacy_Preserving_AI_for_dummy]] — Privacy_Preserving_AI_for_dummy
- [[17_伦理安全/02_价值对齐/04_Value_对齐]] — 价值对齐 (Value Alignment)
- [[17_伦理安全/02_价值对齐/04_Value_对齐]] — 价值对齐 - 小白版
- [[17_伦理安全/09_深度伪造安全/Deepfake_Security]] — Deepfake_Security
- [[17_伦理安全/09_深度伪造安全/Deepfake_Security_for_dummy]] — Deepfake_Security_for_dummy
- [[17_伦理安全/05_机制可解释性/Mechanistic_Interpretability]] — Mechanistic_Interpretability
- [[17_伦理安全/05_机制可解释性/Mechanistic_Interpretability_for_dummy]] — Mechanistic_Interpretability_for_dummy
- [[17_伦理安全/07_AI安全2026/01_AI安全2026]] — AI_Security_2026
- [[17_伦理安全/08_AI供应链安全/AI_Supply_Chain_Security_for_dummy]] — AI_Supply_Chain_Security_for_dummy
- [[17_伦理安全/03_AI治理/01_AI治理合规2026.md|AI_Governance_Compliance_2026]]
- [[17_伦理安全/README|README_for_dummy]]
- [[治理/ai-ethics-future|Ai Ethics Future]]
- [[17_伦理安全/04_AI安全与红队/Safety_Evaluation_Framework|AI 安全评测框架]] — 安全评测基准与红队测试方法论

- [[AI_Ethics_Safety_Future|AI 伦理、安全与未来]]
- [[Agent_Security_Ethics_AGI|智能体安全、价值对齐与 AGI 路径]]

## 新增页面

- [[17_伦理安全/04_AI安全与红队/03_Guardrails_生产_指南|AI 护栏生产实践]]
- [[17_伦理安全/04_AI安全与红队/01_AI_红队测试_指南|AI 红队测试指南]]
