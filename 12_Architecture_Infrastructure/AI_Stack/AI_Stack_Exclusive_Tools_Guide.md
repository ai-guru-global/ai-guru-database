---
title: "AI Stack 专属运维工具指南"
category: "12-architecture-infrastructure"
tags: ["ai-stack", "stackops", "aiocontroller", "operations", "systemctl"]
summary: "> **一句话理解**: stackops 是 AI Stack 内置运维工具集，用于镜像 hash、版本查询等操作；aioController 是 AI Stack 控制引擎核心服务，通过 systemctl 管理其生命周期。"
created: "2026-06-16"
updated: "2026-06-16"
---

# AI Stack 专属运维工具指南

> **一句话理解**: `stackops` 是 AI Stack 内置运维工具集，用于镜像 hash、版本查询等操作；`aioController` 是 AI Stack 控制引擎核心服务，通过 `systemctl` 管理其生命周期。

---

## 1. 工具选型矩阵

| 工具 | 用途 | 典型场景 | 操作对象 |
|------|------|----------|----------|
| **stackops** | AI Stack 运维工具集 | 镜像 tag 校验、版本查询、运维脚本入口 | AI Stack 软件包/镜像 |
| **aioController** | AI Stack 控制引擎 | 平台服务重启、状态管理 | systemd 服务 |

---

## 2. 常用命令

### 2.1 stackops

```bash
# 查看 AI Stack 版本
stackops version

# 计算 asllm 镜像 hash（用于版本一致性校验）
stackops asllm-hash <tag>

# 示例：校验 qwen3-8b v1.0 镜像 hash
stackops asllm-hash qwen3-8b:v1.0
```

### 2.2 aioController

```bash
# 查看服务状态
systemctl status aioController

# 启动/停止/重启控制引擎
systemctl start aioController
systemctl stop aioController
systemctl restart aioController

# 查看实时日志
journalctl -u aioController -f

# 查看启动以来日志
journalctl -u aioController --since "1 hour ago"
```

---

## 3. 生产环境 Checklist

- [ ] 变更 `aioController` 配置后，使用 `systemctl restart aioController` 生效；变更前先在测试环境验证。
- [ ] 重启 `aioController` 前确认当前无关键训练/推理任务正在执行，或已在平台层设置维护窗口。
- [ ] 使用 `stackops version` 核对 AI Stack 软件版本与文档/发布说明一致。
- [ ] 对 asllm 镜像进行 hash 校验，确保不同节点加载的镜像版本一致，避免推理行为差异。
- [ ] 配置 `aioController` 日志轮转，防止 `/var/log/journal` 无限增长。
- [ ] 将 `aioController` 纳入节点级监控和告警（systemd 服务状态、CPU/内存、端口健康）。
- [ ] 限制 `stackops` 与 `systemctl` 命令的执行权限，仅运维人员可操作。

---

## 4. 故障排查速查

| 现象 | 排查命令 | 常见原因 |
|------|----------|----------|
| 平台控制台无法访问 | `systemctl status aioController` | 控制引擎未启动、端口冲突 |
| 镜像 hash 不一致 | `stackops asllm-hash <tag>` | 节点镜像未同步、tag 被覆盖 |
| 服务启动失败 | `journalctl -u aioController -n 100` | 配置错误、依赖服务未就绪、证书过期 |
| 重启后部分功能异常 | `systemctl status aioController` + 平台日志 | 初始化顺序错误、数据库连接失败 |
| stackops 命令不存在 | `which stackops` / `rpm -qa \| grep stackops` | 未安装或未加入 PATH |

---

## 5. 与其他工具的关系

```
AI Stack 平台层
    ├── aioController (控制引擎，systemd 管理)
    ├── stackops (运维 CLI 入口)
    └── 底层调用
        ├── nerdctl / crictl / kubectl (容器/K8s 操作)
        ├── nvidia-smi / ppu-smi (GPU 监控)
        └── vllm serve / sglang (推理服务)
```

---

## Related

- [[12_Architecture_Infrastructure/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_Architecture_Infrastructure/AI_Stack_Container_Runtime_Guide|AI Stack 容器与运行时指南]]
- [[12_Architecture_Infrastructure/AI_Stack_K8s_Operations_Guide|AI Stack K8s 编排指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Deep_Dive|阿里云 AI Stack 软硬一体推理平台]]
