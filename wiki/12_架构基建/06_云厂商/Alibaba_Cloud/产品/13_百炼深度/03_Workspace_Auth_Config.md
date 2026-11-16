---
title: "百炼工作空间鉴权与配置"
category: 12_架构基建/Alibaba_Cloud
tags: ["bailian", "auth", "workspace", "profile"]
summary: "讲清百炼 workspace 隔离单元、鉴权三式（API Key / Console / 订阅套餐）、Profile 多配置体系与 Agent 调用归因环境变量。"
created: 2026-11-06
updated: 2026-11-06
tier: supporting
aliases: ["百炼鉴权与配置", "Bailian Workspace Auth and Config"]
sources: []
name_zh: "工作空间鉴权与配置"
---

# 百炼工作空间鉴权与配置

> 中文简称：工作空间鉴权与配置

> **一句话理解**: workspace 是百炼里资源归属与隔离的「文件夹」，谁（鉴权方式）在哪个文件夹（workspace）里、带什么偏好（profile）干活，本页一次讲清。

基于 bl v2.5.1（2026-11）实测提炼，命令细节以 `bl <cmd> --help` 为准。

---

## 一、workspace：资源归属与隔离单元

百炼里的部署、数据集、Agent、webhook 等资源都挂在某个 workspace 下，它是账号内的资源归属与隔离边界：

- `bl workspace list` 列出可见工作空间；
- 一批命令用 `--workspace-id` 显式指定目标空间，覆盖 decision、managed-agent、webhook、sandbox 四组；
- 跨空间的资源默认互不可见，开发 / 测试 / 生产隔离靠多个 workspace 实现。

`--workspace-id` 的四组消费方都涉及跨空间资源或外部回调，显式指定目标空间可以避免「建错空间」类事故。

sandbox 与 workspace 绑定最深，访问域名直接把 workspace 编进 URL：

```text
{workspace_id}.cn-beijing.maas.aliyuncs.com
```

两条前置纪律：

- sandbox 域名当前只落在 **cn-beijing** region；
- 首次使用前需事先完成 **SLR（服务关联角色）授权**，未授权时创建会被拒绝。

---

## 二、鉴权三式

| **方式** | **进入命令** | **要点** |
| ------- | ----------- | ------- |
| **API Key** | `bl auth login --api-key sk-...` | 程序化调用与 CI 的标准方式 |
| **Console 登录** | `bl auth login --console` | 浏览器账号授权，适合交互式探索与管控操作 |
| **订阅套餐** | 仅 API Key | Token Plan / Coding Plan 只能用 API Key 登录 |

Console 登录的两个细节：

- 国际站账号要加 `--console-site international`，否则会打到国内站点；
- 授权流程**可能自动创建一个普通 API Key**，Console 登录最终仍以 key 形态供 CLI 使用。

`bl auth status` 的定位是**账号就绪检查**：百炼没有独立的实名闸门，登录后先看 auth status 确认身份与环境就绪，而不是等到第一次调用才报错。

```bash
bl auth login --api-key sk-***   # 方式一：API Key（CI / 生产）
bl auth login --console          # 方式二：Console 登录（国际站加 --console-site international）
bl auth status                   # 账号就绪检查
bl workspace list                # 顺手确认目标 workspace
```

---

## 三、Profile 多配置体系

`--config <name>` 隔离多套环境，每套 profile 可有自己的 base_url、key、默认模型、水印等偏好：

- 常见拆法：sandbox 一套专用 profile、image / video 等 media 工作流一套专用 profile，与日常默认配置互不污染；
- 需要临时切到某套环境时，在命令上显式带 `--config <name>`，不动默认 profile；
- `bl config show` 查看当前配置，`bl config set` 修改配置项；
- `language` 配置项控制 CLI 输出语言（zh-CN / en-US）；
- `watermark` 配置项控制生成内容水印开关。

**Base URL 解析优先级**：`--base-url` > 环境变量 `DASHSCOPE_BASE_URL` > profile 内配置。排查「连错环境」时按这个顺序逐层核对，显式 flag 永远赢。

```bash
bl config show   # 查看当前生效的 profile 与全局配置
```

---

## 四、环境变量清单与 Agent 调用归因

| **环境变量** | **作用** | **谁设置** |
| ---------- | ------- | --------- |
| **`DASHSCOPE_API_KEY`** | 鉴权 key | 人 / CI |
| **`DASHSCOPE_BASE_URL`** | 覆盖默认接入点（优先级低于 `--base-url`） | 人 / CI |
| **`BAILIAN_CALLER_TYPE` / `BAILIAN_CALLER_NAME`** | 调用方归因遥测 | 仅 agent |
| **`BAILIAN_SKILL_NAME` / `BAILIAN_SKILL_VERSION`** | 技能归因遥测 | 仅 agent |
| **`NO_COLOR`** | 去色输出纯文本 | 按需 |

归因四变量的纪律：**仅由 agent（编排层）设置，人不手动设置**。它们把调用归因到具体调用方与技能版本，人手设会污染遥测数据。

`NO_COLOR=1` 让 CLI 输出纯文本：重定向到文件或接日志管道前先设它，避免 ANSI 转义序列污染日志。

```bash
NO_COLOR=1 bl workspace list   # 纯文本输出，可安全重定向
```

---

## 五、上线前检查单

1. `bl auth status`——身份就绪；
2. `bl workspace list` 并在命令上带 `--workspace-id`——资源落在正确空间；
3. `bl config show`——profile、语言、水印等偏好符合预期；
4. 涉及 sandbox——确认 region 是 cn-beijing 且 SLR 授权已完成；
5. CI / agent 环境——`DASHSCOPE_API_KEY` 就位，归因四变量由 agent 层统一注入。

---

## 交叉引用

- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/01_Bailian_Platform_Overview|百炼平台全景与生态位]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/13_Managed_Agent_IaC|托管 Agent 与 IaC]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/15_Sandbox_Lifecycle|沙箱生命周期]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/20_BL_CLI_Guide|bl CLI 全指南]]
- [[12_架构基建/06_云厂商/Alibaba_Cloud/产品/13_百炼深度/02_Billing_Plans_And_Cost|计费体系与套餐]]

---

*Last updated: 2026-11-06*
