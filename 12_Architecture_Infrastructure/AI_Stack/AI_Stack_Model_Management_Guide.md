---
title: "AI Stack 模型下载与管理指南"
category: "12-architecture-infrastructure"
tags: ["ai-stack", "model-management", "huggingface", "modelscope", "git-lfs", "download"]
summary: "> **一句话理解**: AI Stack 模型管理需要兼顾国内网络环境和 HuggingFace 生态，分别使用 modelscope（国内首选）、huggingface-cli（海外/官方）和 git-lfs（通用大文件下载）。"
created: "2026-06-16"
updated: "2026-06-16"
tier: supporting
aliases:
  - "Ai Stack Model Management Guide"
  - "AI Stack Model Management Guide"
  - AI_Stack_Model_Management_Guide

---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# AI Stack 模型下载与管理指南

> **一句话理解**: AI Stack 模型管理需要兼顾国内网络环境和 HuggingFace 生态，分别使用 `modelscope`（国内首选）、`huggingface-cli`（海外/官方）和 `git-lfs`（通用大文件下载）。

---

## 1. 工具选型矩阵

| 工具 | 来源 | 适用场景 | 特点 |
|------|------|----------|------|
| **huggingface-cli** | HuggingFace Hub | 海外环境、HF 生态原生 | 命令简洁、生态丰富、需网络可达 |
| **modelscope** | 魔搭（ModelScope） | 国内环境、阿里云生态 | 国内下载快、与 AI Stack/百炼集成好 |
| **git-lfs** | Git 大文件存储 | 私有模型仓库、通用大文件 | 版本控制、适合团队协作 |

---

## 2. 常用命令

### 2.1 huggingface-cli

```bash
# 登录（需要 HF token）
huggingface-cli login

# 下载整个模型仓库到默认缓存目录
huggingface-cli download Qwen/Qwen3-8B

# 下载到指定目录
huggingface-cli download Qwen/Qwen3-8B \
  --local-dir /data/models/Qwen3-8B \
  --local-dir-use-symlinks False

# 仅下载特定文件
huggingface-cli download Qwen/Qwen3-8B \
  --include "*.safetensors" "config.json" "tokenizer.json"

# 设置国内镜像（HF-Mirror）
export HF_ENDPOINT=https://hf-mirror.com
huggingface-cli download Qwen/Qwen3-8B
```

### 2.2 modelscope

```bash
# 下载模型到指定目录
modelscope download --model Qwen/Qwen3-8B --local_dir /data/models/Qwen3-8B

# 仅下载指定文件
modelscope download --model Qwen/Qwen3-8B \
  --files config.json model.safetensors.index.json \
  --local_dir /data/models/Qwen3-8B

# 在 Python 中使用
from modelscope import snapshot_download
model_dir = snapshot_download("Qwen/Qwen3-8B", cache_dir="/data/models")
```

### 2.3 git-lfs

```bash
# 安装并初始化
git lfs install

# 克隆包含大文件的仓库
git lfs clone https://huggingface.co/Qwen/Qwen3-8B

# 仅拉取特定分支/标签
git lfs clone --branch v1.0 https://huggingface.co/Qwen/Qwen3-8B

# 单独拉取 LFS 对象
git lfs pull

# 查看已跟踪的大文件
git lfs ls-files
```

---

## 3. 生产环境 Checklist

- [ ] 模型目录使用共享存储（NFS/S3/并行文件系统），所有计算节点统一挂载到相同路径，如 `/data/models/<org>/<model>/<version>`。
- [ ] 建立模型命名规范：`<org>_<model>_<version>_<precision>`，例如 `qwen_Qwen3-8B_v1.0_bf16`。
- [ ] 下载完成后校验文件完整性：对比 `sha256` 或 `model.safetensors.index.json` 中的记录。
- [ ] 生产环境避免在容器启动时实时下载模型，应预下载到共享存储并做只读挂载。
- [ ]  HuggingFace 下载失败时，优先切换到 `HF_ENDPOINT=https://hf-mirror.com` 或使用 `modelscope`。
- [ ] 对私有模型配置 token/SSH key，避免凭据写入镜像。
- [ ] 定期清理缓存目录，避免磁盘膨胀（HF 默认缓存位于 `~/.cache/huggingface`）。

---

## 4. 故障排查速查

| 现象 | 排查命令 | 常见原因 |
|------|----------|----------|
| 下载速度慢 | `curl -I <url>` 测速 | 国际链路拥堵、未使用镜像 |
| 文件校验失败 | `sha256sum <file>` | 下载中断、CDN 缓存污染 |
| git-lfs 文件显示为指针 | `git lfs pull` | 未安装 git-lfs、未执行 pull |
| modelscope 找不到模型 | `modelscope search <keyword>` | 模型 ID 错误、命名空间拼写错误 |
| 容器内找不到模型 | `ls /data/models/...` | 挂载路径不一致、权限不足 |
| 权限被拒绝 | `ls -l <model-dir>` | 共享存储 uid/gid 与容器不一致 |

---

## 5. 目录组织建议

```
/data/models/
├── huggingface/
│   └── Qwen/
│       └── Qwen3-8B/
├── modelscope/
│   └── Qwen/
│       └── Qwen3-8B/
└── private/
    └── my-org/
        └── my-model-v1.0/
```

---

## Related

- [[12_Architecture_Infrastructure/AI_Stack_Production_Toolchain|AI Stack 生产工具链总览]]
- [[12_Architecture_Infrastructure/AI_Stack_Inference_Serving_Guide|AI Stack 推理服务指南]]
- [[12_Architecture_Infrastructure/AI_Stack_Training_Launchers_Guide|AI Stack 训练启动器指南]]
- [[05_NLP_LLMs/Chinese_LLM_Ecosystem/README|中国大模型生态]]
- [[07_Model_Training/Distributed_Training/ms_swift_Deep_Dive|ms-swift 深度解析]]
- [[_concepts/model-deployment|LLM 部署]]
