---
title: "Model Security"
category: -concepts
tags: ["security", "ai", "model", "adversarial", "privacy", "alibaba-cloud"]
summary: "Model Security（模型安全）是保护 AI 模型免受窃取、逆向、后门、对抗样本等攻击的安全实践。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "模型安全"
relationships:
  - target: "概念/runtime-security"
    type: part_of
  - target: "概念/adversarial-attack"
    type: related_to
sources: []
---

# Model Security

> **一句话理解**: 模型安全就是防止你的模型被坏人「偷走、骗过、或者训练时就被植入了后门」。

## 核心要点

- **模型窃取**: 通过大量 API 查询复制模型行为
- **模型逆向**: 从模型输出推断训练数据
- **后门攻击**: 训练数据中被植入触发器
- **对抗样本**: 微小扰动导致错误输出
- **提示注入**: LLM 场景的特殊攻击

## 防护措施

| 威胁 | 防护 |
|------|------|
| 模型窃取 | 访问控制、水印、速率限制 |
| 数据泄露 | 差分隐私、输出过滤 |
| 后门 | 数据审计、对抗训练 |
| 对抗样本 | 对抗训练、输入校验 |
| 提示注入 | 输入过滤、沙箱执行 |

## 阿里云专有云关联

在阿里云专有云环境中，模型安全可通过模型仓库 RBAC、审计日志、输出内容过滤实现。

## Related

- [[概念/runtime-security|Runtime Security]]
- [[概念/adversarial-attack|Adversarial Attack]]
- [[概念/prompt-injection|Prompt Injection]]
- [[12_架构基建/10_Security/AI_Security_Fundamentals|AI 安全基础]]

---

## 2026 模型安全生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Prompt Injection 防护** | 输入过滤/输出验证 | GA |
| **模型水印** | 模型版权保护 | GA |
| **对抗训练** | 提升模型鲁棒性 | GA |
| **模型加密** | 模型参数加密保护 | GA |
| **安全评估框架** | 自动化安全评估 | GA |

## 生产最佳实践

1. **输入验证**：所有用户输入必须验证和过滤
2. **输出过滤**：模型输出必须过滤敏感内容
3. **对抗训练**：关键模型进行对抗训练
4. **安全评估**：上线前进行安全评估
5. **监控异常**：监控模型输出异常，发现攻击

## 模型安全威胁全景

```
模型安全威胁分层:
┌─────────────────────────────────────────┐
│  应用层: Prompt Injection / Jailbreak    │
├─────────────────────────────────────────┤
│  模型层: 对抗样本 / 后门触发 / 模型窃取  │
├─────────────────────────────────────────┤
│  数据层: 训练数据投毒 / 数据泄露       │
├─────────────────────────────────────────┤
│  基建层: 模型文件篡改 / 推理框架漏洞   │
└─────────────────────────────────────────┘
```

## 模型水印与版权保护

| 技术 | 原理 | 适用场景 |
|------|------|----------|
| **输出水印** | 在生成文本中嵌入统计模式 | LLM 版权追踪 |
| **权重水印** | 在模型参数中嵌入签名 | 模型所有权证明 |
| **API 指纹** | 模型对特定输入的独特响应 | 模型窃取检测 |

## 安全评估框架

```python
# 使用 Garak 进行模型安全评估
import garak
from garak.probes import promptinject

# 配置评估
probe = promptinject.PromptInject()
probe.model_name = "gpt-4o"
results = probe.run()

# 分析结果
for r in results:
    if r.success:
        print(f"❗ 漏洞: {r.prompt[:50]}...")
```

## 模型窃取攻击与防护

| 攻击方式 | 原理 | 防护 |
|----------|------|------|
| **API 查询复制** | 大量查询构建影子模型 | 速率限制 + 查询模式检测 |
| **梯度窃取** | 利用 API 返回的概率信息 | 只返回 top-1 结果 |
| **侧信道** | 时序/功耗分析 | 恒定时间响应 |
| **内部威胁** | 员工窃取模型文件 | DLP + 访问审计 |

## 后门攻击检测

| 检测方法 | 原理 | 工具 |
|----------|------|------|
| **Neural Cleanse** | 逆向工程触发器 | 开源 |
| **STRIP** | 输入扰动检测 | 开源 |
| **Activation Clustering** | 异常激活模式 | 开源 |
| **Spectral Signatures** | 表示层异常检测 | 开源 |

## 模型加密与保护

```python
# 模型文件加密存储
from cryptography.fernet import Fernet
import torch

# 生成密钥
key = Fernet.generate_key()
cipher = Fernet(key)

# 加密模型权重
state_dict = torch.load("model.pt")
encrypted = cipher.encrypt(torch.save(state_dict, "model.pt"))

# 解密加载
decrypted = cipher.decrypt(encrypted)
torch.save(decrypted, "model_decrypted.pt")
model = torch.load("model_decrypted.pt")
```

## 2026 模型安全工具链

| 工具 | 功能 | 类型 | 状态 |
|------|------|------|------|
| **Garak** | LLM 漏洞扫描 | 开源 | GA |
| **Rebuff** | Prompt Injection 检测 | 开源 | GA |
| **LLM Guard** | 输入/输出安全护栏 | 开源 | GA |
| **NVIDIA NeMo Guardrails** | 对话安全护栏 | 开源 | GA |
| **Microsoft Counterfit** | 对抗攻击模拟 | 开源 | GA |
| **Adversarial Robustness Toolbox** | 对抗鲁棒性工具 | 开源 | GA |

## 安全开发生命周期 (SDL)

```
模型安全 SDL:
1. 设计阶段 → 威胁建模 (STRIDE)
2. 数据阶段 → 数据源审计 + 投毒检测
3. 训练阶段 → 对抗训练 + 后门检测
4. 评估阶段 → 红队测试 + 安全基准
5. 部署阶段 → 护栏 + 监控 + 审计
6. 运维阶段 → 持续监控 + 定期红队
```

## 模型安全合规框架

| 框架 | 范围 | 关键要求 |
|------|------|----------|
| **NIST AI RMF** | 美国 | 风险管理、可解释性 |
| **EU AI Act** | 欧盟 | 高风险 AI 安全评估 |
| **ISO/IEC 42001** | 国际 | AI 管理体系 |
| **OWASP Top 10 for LLM** | 行业 | LLM 安全漏洞清单 |

## 模型安全检查清单

- [ ] 模型来源已验证（Hash/签名）
- [ ] 输入/输出护栏已部署
- [ ] 红队测试已完成
- [ ] 访问控制已配置（RBAC）
- [ ] 审计日志已启用
- [ ] 异常监控已配置
- [ ] 应急响应流程已制定

## 延伸阅读

- [[概念/Safety/adversarial-attack|对抗攻击]] — 对抗样本与 Prompt Injection
- [[概念/Safety/runtime-security|运行时安全]] — 运行时威胁检测
- [[概念/Safety/supply-chain-security|供应链安全]] — 模型来源验证
- [[概念/LLM/llmops|LLMOps]] — LLM 运维安全

> ℹ️ 模型安全是 AI 系统安全的最后一道防线，需要多层防护协同工作。
