---
title: "Checkpoint 与模型存储"
category: 12-architecture-infrastructure
subcategory: storage
tags: ["checkpoint", "storage", "model", "backup", "recovery", "alibaba-cloud"]
summary: "系统讲解 AI 训练 Checkpoint 的设计原则、写入性能优化、版本化模型存储，以及灾难恢复策略。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
---

# Checkpoint 与模型存储

> **一句话理解**: Checkpoint 是训练的「存档点」，写慢了 GPU 空等，丢了模型几周白跑；模型存储是推理的「弹药库」，版本乱了服务就错了。

## 目录

- [1. Checkpoint 的作用](#1-checkpoint-的作用)
- [2. Checkpoint 性能瓶颈](#2-checkpoint-性能瓶颈)
- [3. Checkpoint 优化策略](#3-checkpoint-优化策略)
- [4. 模型版本存储](#4-模型版本存储)
- [5. 恢复与灾难恢复](#5-恢复与灾难恢复)
- [Related](#related)

---

## 1. Checkpoint 的作用

- **容错**: 训练失败时从最近 checkpoint 恢复
- **实验管理**: 保存不同超参数结果
- **模型选择**: 保存验证效果最好的模型
- **长训练**: 定期保存防止数据丢失

## 2. Checkpoint 性能瓶颈

| 瓶颈 | 原因 | 影响 |
|------|------|------|
| 同步写 | 所有 rank 同时写 | GPU 等待 |
| 小文件多 | 每个参数一个文件 | IO 碎片化 |
| 网络慢 | 写到远程存储 | 带宽不足 |
| 单点存储 | 所有人写同一位置 | 锁竞争 |

## 3. Checkpoint 优化策略

- **异步 checkpoint**: 用 CPU offload 后台写
- **分片合并**: FSDP 的 `state_dict_type=SHARDED_STATE_DICT`
- **本地缓存**: 先写本地 NVMe，再异步上传
- **减少频率**: 平衡可靠性与性能
- **压缩**: 使用 safetensors 格式

## 4. 模型版本存储

```text
模型仓库
├── model-name/
│   ├── v1.0/
│   │   ├── model.safetensors
│   │   ├── config.json
│   │   └── tokenizer.json
│   └── v1.1/
```

推荐使用 MLflow Registry 或自研模型仓库管理版本与 stage（Staging/Production/Archived）。

## 5. 恢复与灾难恢复

- **自动恢复**: 训练框架检测到 checkpoint 后自动续训
- **跨区域复制**: 关键模型 artifact 复制到多个 region/bucket
- **定期备份**: 每周全量备份，每日增量备份
- **恢复演练**: 定期验证 checkpoint 可恢复性

---

## Related

- [[_concepts/checkpoint|Checkpoint]]
- [[_concepts/safetensors|Safetensors]]
- [[_concepts/mlflow|MLflow]]
- [[MLOps/Troubleshooting/Model_Version_Rollback_Playbook|模型版本回滚 Runbook]]
