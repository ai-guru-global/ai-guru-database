---
title: "CDI 规范 (Container Device Interface Spec) — 官方源引用"
category: -references
tags: ["references", "cdi", "container-device-interface", "cncf", "specification", "kubernetes", "container-runtime"]
sources:
  - "https://github.com/cncf-tags/container-device-interface"
  - "https://github.com/cncf-tags/container-device-interface/blob/main/SPEC.md"
  - "https://github.com/cncf-tags/container-device-interface/blob/main/TUTORIAL.md"
summary: "CDI (Container Device Interface) 是 CNCF Tags 治理的容器运行时设备接入规范，Apache-2.0 开源。仓库 cncf-tags/container-device-interface 提供 SPEC.md 规范、pkg/cdi Go 参考库与 cdi CLI。本页是该规范在本 wiki 的引用索引，关联本地 CDI 深度文档。"
created: 2026-06-15
updated: 2026-06-15
lifecycle: draft
tier: supporting
---

# CDI 规范 (Container Device Interface Spec) — 官方源引用

> 本页是 CDI 规范**官方源头**的引用索引;深度技术解析见本地 [[12_Architecture_Infrastructure/CDI_Deep_Dive|CDI 深度解析]]。

## 官方源头

| 项 | 内容 |
|----|------|
| **规范仓库** | [github.com/cncf-tags/container-device-interface](https://github.com/cncf-tags/container-device-interface) |
| **规范文件** | [SPEC.md](https://github.com/cncf-tags/container-device-interface/blob/main/SPEC.md) |
| **教程** | [TUTORIAL.md](https://github.com/cncf-tags/container-device-interface/blob/main/TUTORIAL.md) |
| **Go 参考库** | `pkg/cdi`(仓库内);Go module path `tags.cncf.io/container-device-interface` |
| **JSON Schema** | 仓库内 `schema/`(可用于校验 spec 文件) |
| **开源协议** | **Apache-2.0**(完全开源) |
| **治理** | **CNCF Tags**(topic: `tag-runtime`);模型基于 [CNI](https://github.com/containernetworking/cni) |
| **最新版本** | v1.1.0(2025-12-10);规范 `cdiVersion` 当前到 0.6.0+ |
| **社区** | Issues / PR 在 GitHub;贡献见 CONTRIBUTING.md |

## 设备命名约定(规范核心)

```
vendor.com/class=unique_name
└─┬─┘ └─┬─┘  └──┬──┘
  │     │       └─ 设备逻辑名(每 vendor+class 唯一)
  │     └─ 设备类(gpu / nic / fpga ...)
  └─ 厂商 ID
组合 vendor+class 称为 kind(如 nvidia.com/gpu)
```

## Spec 文件约定

- **格式**: JSON 或 YAML(`.json` / `.yaml`)
- **默认搜索目录**: `/etc/cdi`(静态)、`/var/run/cdi`(动态生成)
- **核心字段**: `cdiVersion`、`kind`、`devices[].name`、`containerEdits`(deviceNodes / env / mounts / hooks)
- **可继承**: kind 级 `containerEdits` 被该 kind 下所有 device 继承

## 运行时支持矩阵(实测)

| 运行时 | CDI 支持 | 配置 |
|--------|----------|------|
| **containerd** | 需手动开 | `config.toml` 设 `enable_cdi = true`、`cdi_spec_dirs = ["/etc/cdi","/var/run/cdi"]` |
| **CRI-O** | 默认开启 | 默认即读 `/etc/cdi`、`/var/run/cdi`;`crio config \| grep cdi_spec_dirs` 可查 |
| **Docker** | 25.0+ 支持;**28.2 起默认开** | 25.0–28.1 需 `daemon.json` 加 `{"features":{"cdi":true}}` |
| **Podman** | 4.1+ 支持(v0.3.0 spec) | 无需配置 |

## CLI 工具

| 工具 | 来源 | 用途 |
|------|------|------|
| **`cdi`** | 仓库自带(`make` 构建) | `cdi specs/devices/vendors/classes/validate/monitor/inject` |
| **`nvidia-ctk cdi generate`** | NVIDIA Container Toolkit | 生成 NVIDIA GPU/MIG 的 CDI spec |
| **GPU Operator** | NVIDIA(自动) | v23.9+ 自动维护 `/var/run/cdi/nvidia.yaml` |

## 与本地文档的关联

- 深度解析 → [[12_Architecture_Infrastructure/CDI_Deep_Dive|CDI 深度解析]](含 spec 结构、工作原理、训练/推理定位、常见问题)
- 入门 → [[12_Architecture_Infrastructure/CDI_for_dummy|CDI 小白版]]
- 概念卡 → [[_concepts/cdi|CDI 概念卡片]]
- 配套生态 → [[_concepts/dra|DRA]]、[[_concepts/gpu-operator|GPU Operator]]、[[_concepts/oci-runtime|OCI Runtime Spec]]

## Related

- [[12_Architecture_Infrastructure/CDI_Deep_Dive]]
- [[_concepts/cdi]]
- [[_concepts/dra]]
- [[_concepts/gpu-operator]]
- [[_concepts/oci-runtime]]
