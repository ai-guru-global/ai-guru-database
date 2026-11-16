---
title: "百炼计费体系与套餐"
category: 12_架构基建/Alibaba_Cloud
tags: ["bailian", "billing", "capacity", "subscription"]
summary: "拆解百炼 lora / ptu / mu 三档推理计费、闲置护栏、kTPM 容量口径、Token / Coding 订阅套餐与免费额度查询。"
created: 2026-11-06
updated: 2026-11-06
tier: supporting
aliases: ["百炼计费与套餐", "Bailian Billing Plans and Cost"]
sources: []
name_zh: "计费体系与套餐"
---

# 百炼计费体系与套餐

> 中文简称：计费体系与套餐

> **一句话理解**: 调模型按 token 付钱，但部署出去的推理实例不用时也可能持续计费，本页讲清三档计费、闲置护栏、容量口径与订阅套餐查询。

基于 bl v2.5.1（2026-11）实测提炼，命令细节以 `bl <cmd> --help` 为准；具体价格以控制台为准，本页只讲计费口径与护栏。

---

## 一、推理部署三档：lora / ptu / mu

部署推理服务（含微调后部署）时，plan 决定计费方式与资源形态：

| **plan 档位** | **计费方式** | **关键参数** | **定位** |
| ------------ | ------------ | ------------ | ------- |
| **lora** | 按 token 计费，闲置一般不计费 | — | 文本 / 图像微调模型的默认档 |
| **ptu** | TPM 预留（预留吞吐） | 需 `--input-tpm` / `--output-tpm` | 有稳定流量、要保吞吐 |
| **mu** | 容量实例（整实例计费） | 需 `--deploy-spec` / `--capacity` | 重度使用、要独占容量 |

模型类型对档位的硬约束：

- **音频 TTS 微调模型只支持 mu**；
- **图像生成微调只支持 lora**；
- **直接部署基座（不经微调）通常只支持 ptu / mu**。

选档速查：

- 微调文本 / 图像模型、流量小或波动大 → lora，用多少付多少；
- 稳定业务流量、要保吞吐下限 → ptu，预留 TPM；
- 重度独占使用 → mu，整容量实例。

踩坑表现：选错档位时创建命令会在参数校验阶段被拦下，按模型类型换档即可，不需要换模型。

---

## 二、闲置计费风险与护栏

ptu / mu 是预留型资源：**创建即计费，与有没有流量无关**。护栏按顺序执行：

1. **创建前人工确认**：mu / ptu 的创建是花钱动作，必须先向使用者确认规格与档位，不允许静默创建；
2. **暂停优先于删除**：`bl deploy pause` 对 mu / ptu 停止计费并保留配置；
3. **删除有前置状态**：`delete` 只能删除 STOPPED / FAILED 状态的实例，标准路径是先 pause 再 delete；
4. **退订走控制台**：`bl capacity unsubscribe` 生成计费控制台的退订链接，API 无退款能力，退款在链接内完成。

```bash
# 闲置实例的标准处置顺序
bl deploy pause          # mu/ptu 停止计费，状态转 STOPPED
bl deploy delete         # 只能删除 STOPPED / FAILED 状态的实例
bl capacity unsubscribe  # 生成控制台退订链接（API 无退款）
```

记忆点：**pause 是止血，delete 是清理，unsubscribe 是退订**——三步各管一段，不能互相替代。

---

## 三、容量口径：kTPM 与三个读数

capacity 以 **kTPM（千 token / 分钟）** 为计量单位，读数要区分三个值：

- **target**：申请 / 期望的目标容量；
- **configured**：系统实际配置下去的容量；
- **effective**：当前实际生效的容量。

三值不相等是常态，容量变更进行中或配额受限时都会拉开差距；排障以 effective 为准，对账以 configured 为准，跨档位比较先统一换算成 kTPM。

两个高危认知点：

- **scale 是单实例绝对值，不是增量**：`bl capacity scale` 传的是目标值，按「在现有基础上加多少」理解会直接超调；
- **HTTP 200 不等于成功**：容量类操作是异步语义，返回 200 只说明请求被受理；要么加 `--wait` 等待收敛，要么事后查 `operation_status` 确认终态。

---

## 四、订阅套餐：Token Plan 与 Coding Plan

| **套餐** | **形态** | **特征** | **查询命令** |
| ------- | ------- | -------- | ------------ |
| **Token Plan** | 按期订阅的 token 包 | 自带模型原生联网搜索；endpoint 特征 `token-plan.<region>.maas.aliyuncs.com` | `bl usage token-plan` |
| **Coding Plan** | 面向 coding agent 的订阅 | 配额按 harness 发放，分「已发放 / 发放中」 | `bl usage coding-plan` / `bl token-plan harness-quota` |
| **免费额度** | 平台赠送额度 | 到量自动停用，可显式关闭 | `bl usage free` / `bl usage freetier` |

Token Plan 三条纪律：

- 只能以 **API Key 登录**，Console 登录进不了订阅 endpoint；
- endpoint 特征是 `token-plan.<region>.maas.aliyuncs.com`，与普通 endpoint 不同域；
- 其 key **不能**授权 Bailian MCP 搜索，MCP 搜索走普通鉴权体系。

Coding Plan 的配额分两个状态：**已发放**（harness 配额已到账）与**发放中**（尚未到账）。报「配额不足」之前，先看发放中是否还有在途配额。

---

## 五、免费额度与查询命令表

免费额度到量后的自动停用行为可显式关闭：`bl usage free --off`（或 `bl usage freetier --off`），适合压测或长跑任务不想被自动停用的场景。

| **命令** | **用途** |
| ------- | ------ |
| **`bl usage stats`** | 总体用量统计 |
| **`bl usage token-plan`** | Token Plan 用量 |
| **`bl usage coding-plan`** | Coding Plan 已发放 / 发放中配额 |
| **`bl usage free` / `bl usage freetier`** | 免费额度余量与自动停用开关（`--off` 关闭） |
| **`bl quota list`** | 配额清单 |
| **`bl quota check`** | 检查单项配额是否满足操作 |
| **`bl quota request`** | 申请提升配额 |

成本巡检的固定动作：`bl usage stats` 看总消耗 → 盘点在跑的 mu / ptu 实例 → 闲置实例执行 pause → 确认要退订的容量走 unsubscribe。配额不够时用 `bl quota request` 提额，不要靠反复创建实例绕配额。

---

## 交叉引用

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/01_Bailian_Platform_Overview|百炼平台全景与生态位]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/09_Finetune_Pipeline|微调流水线]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/10_Deploy_Capacity_Management|部署与容量管理]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/21_Shared_Protocol_Guardrails|共享协议与护栏]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/09_Token经济与商业化|Token 经济与商业化]]

---

*Last updated: 2026-11-06*
