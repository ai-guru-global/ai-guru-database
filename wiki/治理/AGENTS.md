---
name_zh: "AI 协作指令"
---
# AGENTS.md — 项目协作指令

> 中文简称：AI 协作指令

本文件为所有 AI agent（opencode / claude / codex 等）在本仓库工作时必须遵守的统一规则。

---

## 🔒 生产安全 · 强制风险评估规则（最高优先级）

> **适用范围**：本仓库内产生的**每一个**命令、脚本、方案、PR、迁移步骤，
> 无论出现在对话回复、TODO、commit message、PR description 还是文档中，
> 都**必须**附带风险等级标识与说明。仅根目录规则不够，必须在每个输出处落地。

### 1. 风险等级定义

| 等级 | 标识 | 触发条件（满足其一即归入） |
|------|------|--------------------------|
| 🔴 高危 | `⚠️ HIGH-RISK` | 数据删除/覆盖、生产库 DDL/DML、不可逆操作、`rm -rf`、`DROP/TRUNCATE/DELETE`、`git push --force`、`git reset --hard`、`chmod 777`、停止/重启服务、改权限/网络/防火墙、批量脚本、CI/CD 改动、密钥轮换、降级/回滚、缩容、清缓存、直接连生产执行任何写操作 |
| 🟡 中危 | `🔶 MEDIUM-RISK` | 配置文件修改、依赖升级/降级、数据库迁移（非破坏性）、环境变量变更、重启单实例、灰度发布、schema 增量、`git rebase`、`git merge`、构建产物发布到测试环境 |
| 🟢 低危 | `🟢 LOW-RISK` | 只读查询、`git status/diff/log`、本地开发、日志查看、文档修改、单元测试、lint/typecheck、`ls/cat`（非生产） |

### 2. 标注格式（强制）

每条命令 / 每个方案步骤输出时，必须在**同一行或紧邻位置**附带：

```
<命令或步骤>
# 🟢 LOW-RISK / 🔶 MEDIUM-RISK / ⚠️ HIGH-RISK — <一句话影响> [回滚：<如何回滚>]
```

**🔴 高危命令额外必须包含 4 要素**（缺一不可）：
1. **影响范围**：哪些服务/表/用户/数据受影响
2. **不可逆性**：是否可逆，不可逆需明确标注
3. **前置确认**：是否已备份 / 已灰度 / 已审批 / 已 dry-run
4. **回滚方案**：具体可执行的回滚步骤（"无法回滚"也必须明写）

### 3. 执行原则

- **生产环境默认升级一级**：任何针对生产环境的操作，风险等级在原基础上**上调一级**评估。
- **批量/管道/自动化命令默认升级一级**：`xargs`、`for ... do`、`| xargs rm`、`find ... -delete`、shell 循环、定时任务等。
- **高危命令执行前必须 dry-run / 预演**：能预演的（SQL EXPLAIN、`--dry-run`、`git diff`）必须先跑；无法预演的必须显式提示"无法预演，请人工二次确认"。
- **高危命令不自动执行**：即使任务要求执行，高危命令也必须先**输出方案 + 风险说明 + 回滚**，等待用户显式确认后才执行，禁止静默执行。
- **密钥/凭证**：禁止打印明文密钥；禁止 `echo $SECRET`；禁止把密钥写入被 git 跟踪的文件。
- **破坏性 git 操作**：`force push`、`reset --hard` 到他人分支、删除分支前必须检查是否影响他人。

### 4. 示例

✅ 正确：
```bash
git push --force origin main
# ⚠️ HIGH-RISK — 强推覆盖远程 main 分支历史
#   影响：所有协作者本地历史将不一致，已被推送的 commit 可能丢失
#   不可逆：部分（被覆盖的远程 commit 需 reflog 才能找回）
#   前置确认：[ ] 已与团队确认无人在 main 上有未合并工作 [ ] 已备份远程 HEAD
#   回滚：git push origin <旧HEAD SHA>:main，或联系有 reflog 的人
```

❌ 错误（缺等级、缺回滚、静默执行）：
```bash
rm -rf node_modules && git reset --hard && npm install
```

### 5. 高危命令清单（命中即默认 ⚠️ HIGH-RISK）

| 类别 | 关键词 |
|------|--------|
| 文件删除 | `rm -rf`, `find -delete`, `truncate`, `shred` |
| 数据库 | `DROP`, `TRUNCATE`, `DELETE FROM`, `ALTER TABLE`(生产), `DROP COLUMN` |
| Git | `push --force`, `push -f`, `reset --hard`, `clean -fd`, `branch -D`, `rebase` 到共享分支 |
| 权限 | `chmod 777`, `chown -R`, `chmod -R` |
| 服务 | `kill -9`, `systemctl stop`, `docker rm -f`, `kubectl delete`, 停服/重启 |
| 网络 | 防火墙规则、安全组、DNS 变更 |
| 凭证 | `aws iam delete`, 密钥删除/轮换、`revoke` |
| 批量 | `xargs`, `parallel`, `for ...; do`, cron 写入 |

---

## 📁 项目说明

本仓库是 **AI 知识库 / Obsidian wiki**（ai-guru-database），不是传统应用代码仓库。
内容以 Markdown 为主，包含 AI 各领域知识、论文、课程、面试题等。
典型操作以**文档读写、git 提交、wiki 维护脚本**为主，生产风险主要来自：
- 误删大量 wiki 页面（`rm -rf 概念/` 等）
- 强推覆盖远程历史
- 误改 manifest / index / 配置导致 wiki 工具链失效

---

## 🛠 通用约定

- 不主动 commit / push，除非用户明确要求。
- 修改前先读文件理解上下文，遵循现有风格。
- 不添加无关注释。
- 长任务用 todo 跟踪。
- 中文优先（本仓库主要语言为中文）。

## 关联

本文件定义 Agent 在知识库中的协作契约，下列文档规定了具体执行规则与质量标准。

- [[治理/CONTRIBUTING|贡献指南]] — 人类与 Agent 共用的贡献流程规范
- [[治理/Document_Templates|文档模板规范]] — Agent 创建文件必须遵循的模板
- [[治理/Content_Governance|内容治理]] — 审核流程与质量门禁
- [[治理/Quality_Metrics|质量度量]] — 验收使用的量化指标
- [[治理/Import_Guide|导入指南]] — 外部资料导入的处理规则
- [[治理/Production_Safety_Policy|生产安全策略]] — Agent 操作的边界与红线
- [[治理/log|项目日志]] — Agent 工作记录归档
- [[治理/_directory-conventions|目录结构规范]] — 文件归位的命名约定
