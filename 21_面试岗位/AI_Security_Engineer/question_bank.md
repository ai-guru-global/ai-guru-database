---
title: AI Security Engineer 题库
category: 21-interviews-ai-security-engineer
tags: ["interviews", "career", "ai-security", "prompt-injection", "red-teaming", "adversarial", "model-stealing", "ai-appsec"]
summary: "AI Security Engineer 面试题库，覆盖 Prompt Injection、对抗攻击、模型窃取、AI 供应链安全、红队与 AI 应用安全工程，含难度与频率标注。"
created: 2026-07-23
updated: 2026-07-23
tier: supporting
sources: []
name_zh: "AI Security Engineer 题库"
---

# AI Security Engineer 题库

> 中文简称：AI Security Engineer 题库

> **难度标注**: ⭐ Basic | ⭐⭐ Intermediate | ⭐⭐⭐ Advanced
> **频率标注**: 🔴 高频 | 🟡 中频 | 🟢 低频

---

## AI 应用安全基础 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 1 | OWASP LLM Top 10（2025）有哪些？L01 Prompt Injection 的危害？ | ⭐⭐ | 🔴 |
| 2 | AI Security Engineer 和传统 AppSec / AI Safety Engineer 的区别？ | ⭐ | 🔴 |
| 3 | LLM 应用的攻击面（attack surface）与传统 Web 应用有何不同？ | ⭐⭐ | 🔴 |
| 4 | 解释"非确定性系统（Non-deterministic）"对安全测试的挑战 | ⭐⭐ | 🟡 |
| 5 | AI Agent 的安全风险（工具调用/数据外泄/权限提升）有哪些？ | ⭐⭐⭐ | 🔴 |
| 6 | RAG 系统的安全风险（知识库投毒/越权检索/数据泄露）？ | ⭐⭐⭐ | 🔴 |
| 7 | 如何对 LLM 应用做威胁建模（Threat Modeling，STRIDE/LINDDUN）？ | ⭐⭐ | 🟡 |
| 8 | 多租户 LLM 服务的数据隔离（跨租户泄露）如何保证？ | ⭐⭐⭐ | 🟡 |
| 9 | MCP / Function Calling 的安全边界如何设计？ | ⭐⭐⭐ | 🟡 |
| 10 | LLM 应用的日志审计应该记录哪些安全相关事件？ | ⭐⭐ | 🟢 |

---

## Prompt Injection 与越狱 (10 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 11 | Direct vs Indirect Prompt Injection 的区别？各举一例 | ⭐⭐ | 🔴 |
| 12 | 解释"指令优先级"问题：用户输入为何能覆盖 system prompt？ | ⭐⭐⭐ | 🔴 |
| 13 | 常见越狱（Jailbreak）技术：角色扮演/编码混淆/多轮诱导/前缀注入？ | ⭐⭐⭐ | 🔴 |
| 14 | Prompt Injection 的防御分层（输入过滤/指令层级/输出校验）？ | ⭐⭐⭐ | 🔴 |
| 15 | 为什么"系统提示词保密"不可靠？模型会泄露 prompt 吗？ | ⭐⭐ | 🟡 |
| 16 | 如何防御 Indirect Prompt Injection（RAG 中的恶意文档）？ | ⭐⭐⭐ | 🟡 |
| 17 | 多模态 Prompt Injection（图片/音频中隐藏指令）如何检测？ | ⭐⭐⭐ | 🟡 |
| 18 | 解释"Many-shot Jailbreak"（长上下文攻击），如何缓解？ | ⭐⭐⭐ | 🟡 |
| 19 | 如何系统化测试模型的越狱鲁棒性（HarmBench/AdvBench）？ | ⭐⭐ | 🟡 |
| 20 | Prompt Injection 能否被"完全解决"？为什么很难？ | ⭐⭐⭐ | 🟢 |

---

## 对抗攻击与模型鲁棒性 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 21 | FGSM / PGD 对抗样本生成的原理？L∞ vs L2 约束？ | ⭐⭐ | 🟡 |
| 22 | 白盒 vs 黑盒对抗攻击的区别？迁移性（Transferability）如何？ | ⭐⭐ | 🟡 |
| 23 | 文本对抗攻击（TextFooler/BERT-Attack）与图像的差异？ | ⭐⭐⭐ | 🟢 |
| 24 | 对抗训练（Adversarial Training）的代价和效果？ | ⭐⭐ | 🟢 |
| 25 | 认证鲁棒性（Certified Robustness，如 randomized smoothing）？ | ⭐⭐⭐ | 🟢 |
| 26 | LLM 是否容易被对抗样本攻击？与 CV 模型差异？ | ⭐⭐ | 🟡 |
| 27 | 模型蒸馏/量化对鲁棒性的影响？ | ⭐⭐ | 🟢 |
| 28 | 如何评估模型的对抗鲁棒性基准（如 RobustBench）？ | ⭐⭐ | 🟢 |

---

## 模型窃取与隐私攻击 (8 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 29 | 模型窃取（Model Extraction）攻击的原理？如何检测和防御？ | ⭐⭐⭐ | 🔴 |
| 30 | 训练数据抽取（Data Extraction）攻击：如何让模型吐出训练数据？ | ⭐⭐⭐ | 🟡 |
| 31 | 成员推理攻击（Membership Inference Attack, MIA）原理与防御？ | ⭐⭐⭐ | 🟡 |
| 32 | 差分隐私（Differential Privacy）训练如何防隐私泄露？代价是什么？ | ⭐⭐⭐ | 🟡 |
| 33 | PII（个人敏感信息）泄露如何检测和过滤（输入/输出/训练数据）？ | ⭐⭐ | 🔴 |
| 34 | 模型水印（Watermarking）和指纹（Fingerprinting）如何防窃取？ | ⭐⭐⭐ | 🟢 |
| 35 | 反向工程系统提示词（Prompt Leaking）的常见手法和防御？ | ⭐⭐ | 🟡 |
| 36 | 如何评估 LLM 的隐私泄露风险（如 Memorization benchmark）？ | ⭐⭐ | 🟢 |

---

## AI 供应链与部署安全 (7 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 37 | 开源模型/huggingface 的供应链风险（恶意权重/pickle 反序列化）？ | ⭐⭐⭐ | 🔴 |
| 38 | 模型文件（safetensors vs pickle）的安全差异？ | ⭐⭐ | 🟡 |
| 39 | 训练数据投毒（Data Poisoning）如何检测和防御？ | ⭐⭐⭐ | 🟡 |
| 40 | 后门攻击（Backdoor/Trojan）在模型中的表现和检测？ | ⭐⭐⭐ | 🟡 |
| 41 | 第三方 LLM API 的供应链风险（数据外泄/服务中断）？ | ⭐⭐ | 🟡 |
| 42 | SBOM（软件物料清单）在 AI 系统的延伸（Model Card/Data Card）？ | ⭐⭐ | 🟢 |
| 43 | 微调/LoRA 权重的安全验证？ | ⭐⭐ | 🟢 |

---

## 红队与安全工程实践 (7 题)

| # | 问题 | 难度 | 频率 |
|---|------|------|------|
| 44 | 如何设计一个 AI 红队测试流程（目标/范围/方法/报告）？ | ⭐⭐⭐ | 🔴 |
| 45 | 自动化红队工具（GCG/PAIR/Automated Red Teaming）的原理？ | ⭐⭐⭐ | 🟡 |
| 46 | AI 应用的 WAF（Web Application Firewall）策略有何不同？ | ⭐⭐ | 🟡 |
| 47 | 内容安全过滤（输入/输出）的工程实现（规则 + 模型）？ | ⭐⭐ | 🔴 |
| 48 | LLM Guardrails（如 NeMo Guardrails/Llama Guard）的架构？ | ⭐⭐⭐ | 🟡 |
| 49 | 如何做 AI 系统的安全代码审计（与普通代码差异）？ | ⭐⭐ | 🟢 |
| 50 | AI 事故的应急响应（如模型被大规模越狱）流程？ | ⭐⭐⭐ | 🟡 |

---

## 行为面试 (4 题)

| # | 问题 | 频率 |
|---|------|------|
| 51 | 描述一次你发现的严重 AI 安全漏洞及修复经历 | 🔴 |
| 52 | 当安全要求与业务功能冲突时你如何平衡？ | 🔴 |
| 53 | 你如何向非技术高管解释 AI 安全风险并争取资源？ | 🟡 |
| 54 | 如何在团队建立"安全左移（Shift Left Security）"文化？ | 🟡 |

---

## 编程与系统设计题 (4 题)

| # | 方向 | 频率 | 示例 |
|---|------|------|------|
| 55 | 攻击实现 | 🔴 | 实现 PGD / 一个 Indirect Prompt Injection PoC |
| 56 | 防御实现 | 🔴 | 实现一个输出内容过滤器 |
| 57 | 系统设计 | 🔴 | 设计一个 LLM 应用的多层防御架构 |
| 58 | 检测脚本 | 🟡 | 检测模型是否被窃取（水印验证） |

---

## 知识框架速查

| 安全维度 | 威胁 | 关键防御 | 评估基准 |
|---------|------|---------|---------|
| 完整性 | Prompt Injection / 对抗样本 | 输入过滤/指令层级/对抗训练 | HarmBench/AdvBench |
| 机密性 | 数据抽取/MIA/Prompt 泄露 | DP 训练/输出过滤/水印 | Memorization |
| 可用性 | DoS/资源耗尽（长 prompt） | 限流/长度限制/成本控制 | — |
| 真实性 | Deepfake/虚假信息 | 内容标识/溯源 | — |
| 供应链 | 恶意权重/后门 | safetensors/校验/沙箱 | Trojan Detection |

---

*Last updated: 2026-07-23*

## Related

- [[21_面试岗位/AI_Security_Engineer/interview_answers|AI Security Engineer 面试题实例答案]]
- [[21_面试岗位/AI_Security_Engineer/company_level_question_bank|AI Security Engineer 按公司/级别区分的题库]]
- [[21_面试岗位/AI_Security_Engineer/index|AI Security Engineer 首页]]
- [[17_伦理安全/index|伦理安全]]
- [[12_架构基建/11_AI_Gateway/index|AI Gateway]]
- [[21_面试岗位/AI_Safety_Engineer/index|AI Safety Engineer]]
- [[21_面试岗位/Interview_Guide/System_Design_for_AI|AI 系统设计面试]]
- [[21_面试岗位/Interview_Guide/jobs|AI 相关岗位与工种清单]]
