---
title: 生产安全策略 · Production Safety Policy
category: meta
visibility: internal
tags: [meta, safety, production, policy]
last_updated: 2026-07-02
---

# 生产安全策略 · Production Safety Policy

> 本页是 ai-guru-database 仓库所有操作类文档引用的**唯一权威安全策略**。
> 任何操作类文档顶部的「生产安全提示」横幅均指向本页。

---

## 1. 适用范围

本仓库内产生的**每一个**命令、脚本、方案、PR、迁移步骤，无论出现在文档、对话回复、TODO、commit message 还是 PR description 中，都必须附带风险等级标识与说明。

> ⚠️ 仅在根目录 `AGENTS.md` 写规则不够，必须在**每个操作文档、每条命令处**落地标注。

## 2. 风险等级定义

| 等级 | 标识 | 触发条件（满足其一即归入） |
|------|------|--------------------------|
| 🔴 高危 | `⚠️ HIGH-RISK` | 数据删除/覆盖、生产库 DDL/DML、不可逆操作、`rm -rf`、`DROP/TRUNCATE/DELETE`、`git push --force`、`git reset --hard`、`chmod 777`、停止/重启服务、改权限/网络/防火墙、批量脚本、CI/CD 改动、密钥轮换、降级/回滚、缩容、清缓存、直接连生产执行任何写操作 |
| 🟡 中危 | `🔶 MEDIUM-RISK` | 配置文件修改、依赖升级/降级、数据库迁移（非破坏性）、环境变量变更、重启单实例、灰度发布、schema 增量、`git rebase`、`git merge`、构建产物发布到测试环境 |
| 🟢 低危 | `🟢 LOW-RISK` | 只读查询、`git status/diff/log`、本地开发、日志查看、文档修改、单元测试、lint/typecheck、`ls/cat`（非生产） |

## 3. 标注格式（强制）

```
<命令或步骤>
# 🟢 LOW-RISK / 🔶 MEDIUM-RISK / ⚠️ HIGH-RISK — <一句话影响> [回滚：<如何回滚>]
```

**🔴 高危命令额外必须包含 4 要素**（缺一不可）：
1. **影响范围**：哪些服务/表/用户/数据受影响
2. **不可逆性**：是否可逆，不可逆需明确标注
3. **前置确认**：是否已备份 / 已灰度 / 已审批 / 已 dry-run
4. **回滚方案**：具体可执行的回滚步骤（"无法回滚"也必须明写）

## 4. 执行原则

- **生产环境默认升级一级**：任何针对生产环境的操作，风险等级上调一级评估。
- **批量/管道/自动化命令默认升级一级**：`xargs`、`for ... do`、`| xargs rm`、`find ... -delete`、shell 循环、定时任务等。
- **高危命令执行前必须 dry-run / 预演**：能预演的（SQL EXPLAIN、`--dry-run`、`git diff`）必须先跑；无法预演的必须显式提示"无法预演，请人工二次确认"。
- **高危命令不自动执行**：必须先输出方案 + 风险说明 + 回滚，等待显式确认后才执行。
- **密钥/凭证**：禁止打印明文密钥；禁止把密钥写入被 git 跟踪的文件。
- **破坏性 git 操作**：`force push`、`reset --hard` 到他人分支、删除分支前必须检查是否影响他人。

## 5. 高危命令清单（命中即默认 ⚠️ HIGH-RISK）

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

## 6. 文档标注约定（横幅标记）

操作类文档顶部统一加横幅，并以 HTML 注释标记，便于统一维护与精确回滚：

```
> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），
> 高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
```

回滚（精确移除所有横幅，不影响其他内容）：

```bash
# 🟢 LOW-RISK — 仅删除本批安全横幅标记块 [回滚：重新运行标注脚本]
```
