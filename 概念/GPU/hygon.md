---
title: "海光 CPU (Hygon CPU)"
category: -concepts
tags: ["hygon", "cpu", "x86", "chinese-cpu", "ai-stack", "hardware"]
relationships:
  - target: "概念/apg-gpu"
    type: related_to
  - target: "概念/ascend-npu"
    type: related_to
  - target: "概念/apsara-stack"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "海光（Hygon）是国产 x86 服务器 CPU，基于 AMD Zen 架构授权。AI Stack 一体机服务器底层运行海光 CPU，提供国产化算力基座。"
provenance:
  extracted: 0.20
  inferred: 0.70
  ambiguous: 0.10
base_confidence: 0.75
lifecycle: reviewed
tier: supporting
---

# 海光 CPU (Hygon)

> **一句话理解**: 海光是"国产 x86 CPU"——基于 AMD Zen 架构授权，为国产服务器提供 CPU 算力，是 AI Stack 一体机的底层硬件基座之一。

---

## 1. 公司背景

| 维度 | 信息 |
|------|------|
| **公司名** | 海光信息技术股份有限公司 |
| **上市** | 科创板 (688041.SH) |
| **技术来源** | AMD Zen 架构授权（2016 年合资协议） |
| **产品线** | 海光 CPU (服务器) + 深算 DCU (AI 加速卡) |
| **定位** | 国产 x86 服务器 CPU |

---

## 2. 产品系列

| 产品 | 类型 | 说明 |
|------|------|------|
| **海光 7000 系列** | 服务器 CPU | 高端双路，32-64 核心 |
| **海光 5000 系列** | 服务器 CPU | 中端，16-32 核心 |
| **海光 3000 系列** | 工作站/边缘 | 入门级 |
| **深算 DCU** | AI 加速卡 | 类 AMD CDNA，对标 MI250 |

---

## 3. 与 AI Stack 的关系

```
AI Stack 一体机硬件架构
│
├── CPU 层
│   ├── 海光 Hygon（国产 x86）← 本文
│   └── Intel Xeon（国际 x86）
│
├── GPU 层
│   ├── APG 自研加速卡（首选）
│   ├── NVIDIA A800/H20（合规版）
│   └── 华为昇腾 910B/C（国产替代）
│
└── 互联层
    └── 卡间互联（PCIE/CXL/NVLink）
```

### 国产化适配意义

| 维度 | 说明 |
|------|------|
| **自主可控** | 减少对美国 CPU 的依赖 |
| **信创合规** | 满足政府/央企国产化要求 |
| **生态兼容** | x86 指令集，无需迁移应用 |
| **性能对标** | 接近 AMD EPYC 一代/二代水平 |

---

## 4. 国产 CPU 对比

| 维度 | 海光 Hygon | 飞腾 Phytium | 鲲鹏 Kunpeng | 龙芯 Loongson |
|------|-----------|-------------|-------------|-------------|
| **架构** | x86 (AMD Zen) | ARM v8 | ARM v8 (华为) | 自主 LoongArch |
| **生态** | x86 兼容 | ARM 生态 | 华为生态 | 自主生态 |
| **迁移成本** | 极低 | 中 | 中 | 高 |
| **性能** | 中高 | 中 | 中高 | 中 |
| **适用场景** | 服务器 | 嵌入式/服务器 | 服务器 | 桌面/嵌入式 |

---

## Related

- [[概念/apg-gpu]] — APG 自研加速卡
- [[概念/ascend-npu]] — 华为昇腾 NPU
- [[概念/apsara-stack]] — 飞天企业版
- [[架构基建/AI_Stack_Deep_Dive]] — AI Stack 深度解析
