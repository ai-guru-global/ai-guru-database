---
title: "百炼应用与工作流编排"
category: 12_架构基建/Alibaba_Cloud
tags: ["bailian", "app", "workflow", "orchestration"]
summary: "分清 text chat、app call、managed-agent 三层调用面，掌握应用调用流、decision 决策模型与 pipeline 工作流的边界。"
created: 2026-11-06
updated: 2026-11-06
tier: supporting
aliases: ["应用编排", "App and Workflow Orchestration"]
sources: []
name_zh: "应用与工作流编排"
---

# 百炼应用与工作流编排

> 中文简称：应用与工作流编排

> **一句话理解**: 同样是「问一句话拿回答」，背后可能是裸模型、控制台搭好的应用、或代码声明的托管 Agent——先分清调的是哪一层再动手。

---

基于 bl v2.5.1（2026-11）实测提炼，命令细节以 `bl <cmd> --help` 为准。

## 一、三层调用面辨析

`bl` 里「发一句话拿结果」的入口不止一个，先分层再选命令：

| **调用面** | **命令** | **调用对象** | **什么时候用** |
| --- | --- | --- | --- |
| 直连模型 | bl text chat | 模型本身 | 裸推理，不需要编排与绑定 |
| 应用 | bl app call | 控制台发布的应用 | 已带编排 / Prompt / 知识库绑定的成品能力 |
| 托管 Agent | bl managed-agent session run | agents.yaml 声明的 Agent | 声明式基础设施，配置随代码库管理 |

三层的本质差异在「配置放哪」：直连什么都没有；应用的配置在控制台里，调用方不可见；托管 Agent 的配置在 agents.yaml 里，随代码库走。选择顺序：先问要不要编排，再问配置想放控制台还是代码库。

---

## 二、应用调用流：list 拿 code，call 传 prompt

调应用固定两步：先按关键词找到应用拿 code（app id），再带 prompt 调用：

```bash
# 1. 按关键词找应用
bl app list --name 客服 --output json
# 2. 从响应里取 code（即 app id）
# 3. 调用
bl app call --app-id <code> --prompt "帮我查一下订单进度"
# 4. 应用声明了 user_prompt_params 时，用 --biz-params 传业务参数
bl app call --app-id <code> --prompt "查订单" \
  --biz-params '{"order_id": "123"}'
```

两个前置条件与一个易错点：

- app 面命令需要 Console 登录，只配 API Key 不够；报权限错误先查登录态。
- `--biz-params` 的值是 JSON 字符串，key 要与应用里声明的参数名一致。
- code 取自 `app list` 响应的字段，不是应用显示名；拿显示名去 call 会失败。
- 找不到应用时，先与用户确认应用是否已在控制台发布，未发布的编排调不到。

---

## 三、决策模型：要判断，不要生成

「这句话是不是要退款」「工单该分给哪个组」这类封闭判断题，用 decision，而不是让 chat 模型生成一段含「是/否」的文本再解析：

```bash
bl decision --workspace-id <id> \
  --state "Is this requesting a refund?" \
  --questions '{"refund": {"type": "noul"}}'
```

与 chat 的关键差异：

| **维度** | **bl decision** | **bl text chat** |
| --- | --- | --- |
| 输出 | choice / noul / score 与概率 | 生成文本 |
| 稳定性 | 结构固定，程序可直接分支 | 要解析与兜底 |
| 成本 | 更省 token | 随生成长度上涨 |
| 适用 | 分类、判断、结构化决策 | 开放性生成 |

经验法则：下游代码要写 `if/else` 分支就用 decision；要给人看一段话就用 chat。

---

## 四、pipeline 工作流：流程内的一步，不是调度器

```bash
# 先验证定义，再执行
bl pipeline validate --file flow.yaml
bl pipeline run --file flow.yaml
```

- 工作流定义接受 JSON / YAML 两种格式。
- validate 先拦坏定义，比 run 跑到一半失败便宜。
- 定位边界：pipeline 是 bl 流程内的步骤编排，不是通用调度器；定时触发、跨系统依赖编排不要压到它身上。
- 与 app 的分工：应用是面向用户的成品入口，pipeline 是把多个步骤串起来的执行单元，两者在同一系统里各司其职。

---

## 五、文件上传：两套接口不要混

```bash
bl file upload --file report.pdf
# 响应显式给出 oss:// URL
```

`bl file upload` 拿到的 oss:// URL 是给百炼工作流内的步骤消费的，不是通用文件托管；Sandbox 场景的模板文件上传是另一套接口。判断标准只有一条：文件给谁用——给百炼工作流用 file upload，给沙箱环境用 Sandbox 自己的上传接口。

---

## 六、职责边界速记

| **需求** | **归谁** |
| --- | --- |
| 调用已上线的应用（含编排、知识库绑定） | app |
| 声明式管理 Agent 基础设施 | managed-agent |
| 生图生视频 | gen |

边界之外的细分：裸推理归各模态命令（text / speech 等）；知识库本身的管理与检索测试见知识库 RAG 一页。

---

## 交叉引用

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/13_Managed_Agent_IaC|托管 Agent 与 IaC]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/17_Knowledge_Base_RAG|知识库与 RAG]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/07_Image_Video_Generation|图像与视频生成]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/20_BL_CLI_Guide|BL CLI 使用指南]]

---

*Last updated: 2026-11-06*
