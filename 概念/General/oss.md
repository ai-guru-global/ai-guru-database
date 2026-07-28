---
title: "OSS"
category: -concepts
tags: ["storage", "object-storage", "cloud", "alibaba-cloud"]
summary: "OSS（Object Storage Service）是阿里云提供的海量、安全、低成本、高可靠的对象存储服务，常用于 AI 训练数据、模型和日志的存储。"
created: 2026-06-26
updated: 2026-07-21
tier: supporting
aliases:
  - "Object Storage Service"
  - "阿里云 OSS"
relationships:
  - target: "概念/storage"
    type: is_a
  - target: "概念/alibaba-cloud"
    type: provided_by
sources: []
name_zh: "对象存储服务"
---

# OSS

> 中文简称：对象存储服务

> **一句话理解**: OSS 是云上的「大硬盘」，适合存海量文件，按量付费，常用于存训练数据、模型权重和日志。

## 核心要点

- **对象存储**: 以对象（Object）形式存储，通过 HTTP/HTTPS 访问
- **高可靠**: 多副本冗余
- **低成本**: 适合冷数据和归档
- **大文件支持**: 适合模型权重、Checkpoint
- **生命周期管理**: 自动转冷存、过期删除

## 与 NAS/文件系统对比

| 特性 | OSS | NAS |
|------|-----|-----|
| 协议 | HTTP/S3 API | NFS/SMB |
| 延迟 | 较高 | 较低 |
| 成本 | 低 | 中 |
| 适用 | 备份、归档、大文件 | 共享工作目录 |

## 阿里云专有云关联

在阿里云专有云环境中，盘古对象存储提供 OSS 兼容接口，可作为 AI Stack 的模型仓库、数据集和日志存储。

## Related

- [[概念/storage|Storage]]
- [[概念/nas|NAS]]
- [[概念/alibaba-cloud|Alibaba Cloud]]

---

## 2026 OSS 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **阿里云 OSS** | 对象存储服务 | GA |
| **S3 兼容** | 兼容 S3 API | GA |
| **生命周期管理** | 自动分层/过期 | GA |
| **跨区域复制** | 数据容灾 | GA |
| **AI 数据湖** | 训练数据存储 | GA |

## 生产最佳实践

1. **数据存储**：训练数据/模型用 OSS 存储
2. **生命周期**：配置生命周期自动分层
3. **跨区域复制**：重要数据跨区域复制
4. **访问控制**：配置 Bucket 访问权限
5. **与 NAS 配合**：OSS + NAS 分层存储

## 架构与组件

| 组件 | 职责 | 说明 |
|------|------|------|
| **Bucket** | 存储容器 | 对象存储的基本单元 |
| **Object** | 存储对象 | 文件 + 元数据 |
| **Endpoint** | 访问入口 | 地域访问域名 |
| **AccessKey** | 身份认证 | AK/SK 认证 |
| **CDN** | 加速分发 | 内容分发网络 |

## 配置示例

```python
# Python SDK 上传模型到 OSS
import oss2

auth = oss2.Auth('access-key-id', 'access-key-secret')
bucket = oss2.Bucket(auth, 'https://oss-cn-hangzhou.aliyuncs.com', 'ai-models')

# 上传模型文件
bucket.put_object_from_file(
    'models/llama-3-8b/model.safetensors',
    '/local/path/model.safetensors'
)

# 生成预签名 URL (1小时有效)
url = bucket.sign_url('GET', 'models/llama-3-8b/model.safetensors', 3600)
print(f"Download URL: {url}")
```

## AI 场景应用

| 场景 | OSS 作用 | 配置建议 |
|------|----------|----------|
| 训练数据 | 存储数据集 | 标准存储 + 生命周期 |
| 模型仓库 | 存储模型权重 | 标准存储 + 版本控制 |
| Checkpoint | 训练断点 | 标准存储 + 跨区域复制 |
| 日志归档 | 训练日志 | 低频/归档存储 |
| 数据分发 | 数据集下载 | CDN 加速 |

## 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 上传慢 | 网络/文件大 | 分片上传 + 多线程 |
| 访问被拒 | 权限不足 | 检查 Bucket Policy |
| 费用高 | 请求次数多 | 批量操作 + 缓存 |
| 数据丢失 | 误删除 | 开启版本控制 |

## 相关概念

- [[概念/nas|NAS]] — 文件存储
- [[概念/storage|Storage]] — 存储概念
- [[概念/alibaba-cloud|Alibaba Cloud]] — 阿里云
- [[概念/lakefs|LakeFS]] — 数据湖版本控制

## 总结

OSS 是阿里云对象存储服务，提供海量、安全、低成本的存储能力。在 AI 场景中用于训练数据、模型权重和日志的存储与分发。

---

> 💡 OSS 是云上的「大硬盘」，适合存海量文件，按量付费，常用于存训练数据、模型权重和日志。

## 存储类型对比

| 类型 | 延迟 | 成本 | 适用场景 |
|------|------|------|----------|
| 标准存储 | 低 | 高 | 训练数据、模型 |
| 低频访问 | 中 | 中 | 不常访问的数据 |
| 归档存储 | 高 | 低 | 日志归档 |
| 冷归档 | 极高 | 极低 | 长期保存 |
| 深度冷归档 | 极高 | 最低 | 合规保存 |

## 生命周期管理示例

```xml
<!-- OSS 生命周期规则 -->
<LifecycleConfiguration>
  <Rule>
    <ID>ai-data-lifecycle</ID>
    <Prefix>training-data/</Prefix>
    <Status>Enabled</Status>
    <Transition>
      <Days>30</Days>
      <StorageClass>IA</StorageClass>
    </Transition>
    <Transition>
      <Days>90</Days>
      <StorageClass>Archive</StorageClass>
    </Transition>
    <Expiration>
      <Days>365</Days>
    </Expiration>
  </Rule>
</LifecycleConfiguration>
```

## 安全与合规

| 维度 | 措施 | 说明 |
|------|------|------|
| 传输加密 | TLS 1.2+ | HTTPS 强制 |
| 存储加密 | SSE-KMS | 服务端加密 |
| 访问控制 | Bucket Policy + RAM | 细粒度权限 |
| 审计 | ActionTrail | 操作日志 |
| 防篡改 | WORM | 一次写入多次读取 |
| 跨区域复制 | CRR | 数据容灾 |

## 性能优化

| 优化项 | 方法 | 效果 |
|--------|------|------|
| 分片上传 | Multipart Upload | 大文件加速 |
| 多线程 | 并发上传/下载 | 提升吞吐 |
| CDN 加速 | 绑定 CDN 域名 | 降低延迟 |
| 传输加速 | 全球加速 Endpoint | 跨地域加速 |
| 缓存 | 本地 SSD 缓存 | 减少重复下载 |

## 版本兼容性

| 产品 | 版本 | 状态 |
|------|------|------|
| 阿里云 OSS | S3 兼容 | 稳定 |
| oss2 SDK | 2.18+ | 稳定 |
| ossutil | 1.7+ | 稳定 |

## 常用命令

| 命令 | 说明 |
|------|------|
| `ossutil ls oss://bucket` | 列出对象 |
| `ossutil cp file oss://bucket/path` | 上传文件 |
| `ossutil rm oss://bucket/path` | 删除对象 |

