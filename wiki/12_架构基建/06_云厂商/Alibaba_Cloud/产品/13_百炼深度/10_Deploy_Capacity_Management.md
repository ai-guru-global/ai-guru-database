---
title: "百炼部署与容量管理：三个名字与一本账"
category: 12_架构基建/Alibaba_Cloud
tags: ["bailian", "deploy", "capacity", "billing"]
summary: "厘清 finetuned_output、--model-name、deployed_model 三个身份名，划清部署生命周期与容量读写的安全边界。"
created: 2026-11-06
updated: 2026-11-06
tier: supporting
aliases: ["部署容量管理", "Bailian Deploy and Capacity Management"]
sources: []
name_zh: "部署与容量管理"
---

# 百炼部署与容量管理：三个名字与一本账

> 中文简称：部署与容量管理

> **一句话理解**: 微调出来的模型名不能直接调用，要先用它换一个部署实例 id；实例背后的容量怎么买、怎么扩、怎么退，是另一本要算清的账。

---

基于 bl v2.5.1（2026-11）实测提炼，命令细节以 `bl <cmd> --help` 为准。

## 一、三大身份名辨析：最高频错误

调用报 `404 Model not exist`，九成是把三个名字用混了。三个名字各管一段：

| **名字** | **出现在哪** | **能否直接用于推理** |
| --- | --- | --- |
| finetuned_output（形如 `<base>-ft-<ts>-<id>`） | finetune create 的响应 | 不能，直接调用报 404 Model not exist |
| --model-name 入参 | deploy text/audio/image create | 不能，它只是部署来源（微调输出名或基座名） |
| output.deployed_model | deploy create 的响应 | 能，推理时 --model 传它 |

```bash
# 用微调输出名（或基座名）创建部署
bl deploy text create --model-name qwen3-8b-ft-xxxx ...
# 响应里取 output.deployed_model
# 之后推理一律用 deployed_model
bl text chat --model <deployed_model> --prompt "你好"
```

记法：微调输出名是「货」，`deployed_model` 是「柜台」，推理只认柜台。排查 404 先对这张表。

---

## 二、状态传播延迟与部署生命周期

部署刚到 RUNNING 就调用，可能短暂 404：状态与路由的传播有延迟，约 1 分钟内稳定。遇到就等十几秒重试，不要急着删掉重建。

生命周期五件套：`list` / `get` / `update` / `scale` / `delete`。

```bash
bl deploy list
bl deploy get --deployed-model <deployed_model>
bl deploy update --deployed-model <deployed_model> ...
bl deploy scale --deployed-model <deployed_model> ...
bl deploy delete --deployed-model <deployed_model>
```

删除的两条硬规则：

- delete 只能删 STOPPED / FAILED 状态的部署。
- RUNNING 的 mu / ptu 部署先 pause 停止计费再删；恢复用 resume，停（pause）与删（delete）是两件事。

---

## 三、查可部署模型与状态过滤的坑

```bash
# 可部署模型与可用 plan：custom=自己的微调产物，base=基座，public=公共
bl deploy models --source custom
bl deploy models --source base
bl deploy models --source public
```

- 部署前先在这里确认两件事：目标模型可部署、它有哪些可用 plan，比提交后才失败便宜得多。
- custom 查不到微调产物时，先回训练侧确认 export 是否完成、名字是否抄对。

`deploy list --status` 的坑：它只对**当前页**做本地过滤，服务端返回的 total 不受影响——分页时条数与总数对不上，先想到这一层。

---

## 四、容量子系统：读写分级

| **操作** | **性质** | **纪律** |
| --- | --- | --- |
| capacity list / capacity get | 只读 | 随时可用 |
| capacity operation get / operation wait | 只读（盯异步操作单据） | 写操作提交后跟踪进展用 |
| capacity create / scale / renew / delete | 高风险写 | 先 --dry-run 预览，再 --yes 确认；每次写只提交一次、不自动重试 |

```bash
# 先预览要发生的变更
bl capacity create ... --dry-run
# 确认无误后正式提交
bl capacity create ... --yes
```

「每次写只提交一次、不自动重试」是防重复开实例的底线：失败就人工看原因再重发，脚本里不要包自动 retry 循环。

---

## 五、容量口径与计费纪律

读容量数字前，先分清单位与三个值：

- 单位是 kTPM（千 token/分钟），不是 QPS，也不是并发连接数。
- effective / configured / target 三个值语义不同：读数、对账、设告警前先确认自己看的是哪一个。

容量写操作的口径坑，按踩坑频率排：

- scale 是**单实例绝对值**不是增量：从 12 扩到 18 要传 18，不是传 6。
- scale 到 0 不是释放，别把它当退订用。
- active 的预付费实例不能直接 DELETE：先 `capacity unsubscribe` 拿计费控制台退订链接，线下完成退订；API 无退款。
- 释放（release）以响应里的 `deleted=true` 为准，不要只看命令退出码。
- 续费设置随购买 / 扩缩 / 续费请求附带；没有独立的自动续费端点，也没有费用估算器，要估费用自己按定价算。

---

## 六、overflow 溢出策略

```bash
bl deploy overflow ...
```

overflow 决定实例流量打满后的溢出行为（溢出到公共资源还是拒绝请求）。注意作用域：它配置在**整个 ModelCode** 上，不是单个部署实例——同一 ModelCode 下的多个实例共享这一策略，改一次影响一片。

---

## 交叉引用

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/09_Finetune_Pipeline|微调全流程]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/11_Train_To_Deploy_Playbook|训练到部署闭环实战]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/02_Billing_Plans_And_Cost|计费方案与成本]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/架构方案/12_架构方案_大模型推理服务|架构方案：大模型推理服务]]

---

*Last updated: 2026-11-06*
