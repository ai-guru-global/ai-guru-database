---
title: "Agentic Commerce (智能体商务与支付协议)"
tags: [agentic-commerce, x402, ap2, acp, payments, agent-payments]
created: 2026-11-09
updated: 2026-11-09
tier: supporting
aliases:
  - "Agentic Commerce"
  - "智能体商务"
  - "Agent Payments"
  - "x402"
  - "AP2"
  - "Agent Commerce Protocol"
category: -concepts
lifecycle: seed
review_by: 2027-02-09
relationships:
  - target: "概念/Agent/a2a-protocol"
    type: builds_on
  - target: "概念/Agent/tool-use"
    type: requires
sources:
  - "Google AP2: Agent Payments Protocol (2025-09)"
  - "Coinbase x402 protocol (2025)"
  - "OpenAI Instant Checkout / ACP (2025-09)"
name_zh: "智能体商务"
---

# Agentic Commerce (智能体商务与支付协议)

> 中文简称：智能体商务

> **一句话理解**: 智能体商务 = AI 代理代替人完成「逛-选-买-付」全链路；2025 下半年三大协议（Google AP2、Coinbase x402、OpenAI/Stripe ACP）竞逐标准，2026-08~11 进入互操作与商户接入的落地竞速。

---

## 定义

**Agentic Commerce（智能体商务）**: 由 AI 智能体代表用户执行商品发现、比较、下单与支付的商业形态。核心不是「AI 推荐商品」，而是**交易权限与责任的转移**——智能体持有用户的授权凭证去花钱，因此需要全新的信任与审计层。

## 三大协议对比（2025-09 定局格局，2026 持续演进）

| 协议 | 发起方 | 支付轨道 | 核心机制 |
|------|------|------|------|
| **AP2** (Agent Payments Protocol) | Google + 60 余家支付机构 | 信用卡/借记卡等传统轨道 | **Mandate（授权凭证）**：用户以加密签名凭证授权智能体的购物意图与范围，可审计「谁在何时授权了什么」；与 [[概念/Agent/a2a-protocol\|A2A 协议]] 体系同源 |
| **x402** | Coinbase | 稳定币（USDC） | 复活 HTTP 402「Payment Required」状态码：API/内容按次收费，agent 携带签名支付自取——机器对机器的原生付费层 |
| **ACP** (Agentic Commerce Protocol) | OpenAI × Stripe | 传统轨道 | Instant Checkout：在 ChatGPT 会话内完成「善意的商户」接入下单，平台代持交易流程 |

## 为什么需要专门协议（而非让 agent 调用支付 API）

1. **授权链问题**: 用户→agent→商户三层都要可证明（用户确实授权、agent 没超范围、交易可回溯争议）——Mandate 类签名凭证就是为此而生。
2. **责任归属**: agent 买错/买贵/被骗，退款与风控追责路径要重新定义（传统「持卡人确认」假设失效）。
3. **抗欺诈**: agent 是提示注入的高危载体（[[概念/Safety/prompt-injection|提示注入]]）——恶意商品页诱导 agent 越权支付是新型攻击面。
4. **机器原生计费**: x402 解决的是「agent 之间按次付费调用 API」的微支付，传统卡轨道做不了 0.01 美元级。

## 2026-08~11 观察

- 三协议从竞争转向**互操作声明**：AP2 与 x402 公布桥接（传统轨道 + 加密轨道互通），商户接入成本成为竞争焦点。
- 「Agent 就绪」成为电商基础设施新维度：商品 feed 结构化、机器可读条款、agent 专属客服。
- 国内映射：支付宝/微信的 agent 支付探索 + 淘宝/京东的 agent 购物入口（跟踪期，标准未定）。

## 面试快问快答

1. **AP2 的 Mandate 是什么？** — 用户签名的加密授权凭证，绑定购物意图、金额范围与有效期，使「agent 花钱」可审计可争议——是 agentic 支付的信任基石。
2. **x402 为什么用稳定币？** — 机器间微支付需要低手续费、即时结算、无拒付的轨道；HTTP 402 + 签名支付让「先钱后内容」成为一行请求。
3. **三大协议最大分歧？** — 信任模型：AP2 靠金融业联盟与法律凭证，x402 靠密码学与链上结算，ACP 靠平台担保——对应三种「谁为错误买单」的答案。
4. **最大安全风险？** — 间接提示注入劫持支付决策：商品页/评价里的恶意指令诱导 agent 越权购买；缓解靠 Mandate 范围限制、支付动作人工确认阈值、页面内容沙箱。

## Related

- [[概念/Agent/a2a-protocol|A2A Protocol]]
- [[概念/Agent/tool-use|Tool Use]]
- [[概念/Safety/prompt-injection|Prompt Injection]]
- [[概念/Agent/computer-use|Computer Use]]

---

*Last updated: 2026-11-09*
