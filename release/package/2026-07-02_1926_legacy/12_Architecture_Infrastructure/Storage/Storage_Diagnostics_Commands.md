---
title: "AI 存储诊断命令集"
category: 12-architecture-infrastructure
subcategory: storage
tags: ["storage", "diagnostics", "commands", "checkpoint", "nas", "oss", "alibaba-cloud"]
summary: "面向 AI 训练与推理的存储诊断命令集：覆盖本地磁盘、NAS、OSS、并行文件系统的性能测试与问题定位。"
created: 2026-06-26
updated: 2026-06-26
tier: supporting
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](../../_meta/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->

# AI 存储诊断命令集

> **使用方式**: 存储慢、挂载失败、Checkpoint 写入失败时，按存储类型选择命令。

---

## 1. 本地磁盘

```bash
# 查看磁盘空间
df -h

# 查看 IO 统计
iostat -x 1 10

# 测试顺序读写
fio --name=test --filename=/data/test.bin --direct=1 --rw=write --bs=1M --size=10G --numjobs=8 --ioengine=libaio

# 测试随机读写
fio --name=test --filename=/data/test.bin --direct=1 --rw=randread --bs=4k --size=1G --numjobs=8

# 查看磁盘挂载
lsblk
mount | grep /data
```

---

## 2. NAS

```bash
# 查看 NFS 挂载
showmount -e <nfs-server>

# 查看挂载参数
cat /proc/mounts | grep nfs

# 测试 NFS 读写
fio --name=nfs-test --directory=/data --direct=0 --rw=write --bs=1M --size=1G

# 查看 NFS 统计
cat /proc/self/mountstats
```

---

## 3. OSS/S3

```bash
# 测试 OSS 上传速度
ossutil cp -r /data/test.bin oss://bucket/test.bin

# 测试下载速度
ossutil cp oss://bucket/test.bin /tmp/test.bin

# 使用 s3cmd 测试
s3cmd put /data/test.bin s3://bucket/test.bin

# 查看 bucket 列表
ossutil ls oss://bucket
```

---

## 4. 并行文件系统（Lustre/GPFS/CPFS）

```bash
# 查看文件系统状态
lfs df -h

# 查看 OST 状态
lfs osts

# 查看 striping
lfs getstripe /data

# 测试并行读写
mpirun -np 8 ./ior -w -r -t 1m -b 16m -s 16 -F -C -e -o /data/test

# 查看锁状态
cat /proc/fs/lustre/.../dump_state
```

---

## 5. Checkpoint 写入问题

```bash
# 查看写入带宽
python -c "
import time, torch
x = torch.randn(1024, 1024, 1024)  # ~4GB
start = time.time()
torch.save(x, '/data/checkpoint.pt')
print('Write time:', time.time() - start)
"

# 查看文件系统同步时间
time sync
```

---

## Related

- [[架构基建/Storage/AI_Storage_Patterns|AI 存储模式]]
- [[架构基建/Storage/Checkpoint_and_Model_Storage|Checkpoint 与模型存储]]
