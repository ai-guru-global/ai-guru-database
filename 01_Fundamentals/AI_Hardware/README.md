---
title: "AI 硬件基础设施"
category: "01-fundamentals"
tags: ["hardware", "gpu", "ai-chip", "infrastructure", "t-head", "ppu", "chinese-chip"]
summary: "AI 计算硬件基础设施总览，覆盖 GPU、AI 加速卡、国产芯片（含平头哥真武 PPU）等硬件选型和部署方案。"
created: 2026-06-12
updated: 2026-06-15
---

# AI 硬件基础设施

> **一句话理解**: AI 计算的物理基础——从 GPU 到专用加速卡，硬件选型决定了训练和推理的效率与成本。

---

## 页面索引

### 国际 AI 芯片

| 页面 | 厂商 | 核心内容 | 状态 |
|------|------|---------|------|
| [[01_Fundamentals/AI_Hardware/NVIDIA_AMD_GPU_Deep_Dive|NVIDIA & AMD GPU 深度解析]] | NVIDIA + AMD | H200/B200/GB200/MI300X/MI350X 完整规格+部署案例 | ✅ 详细 |
| [[01_Fundamentals/AI_Hardware/Google_TPU_Deep_Dive|Google TPU 深度解析]] | Google | TPU v5p/v6e/TPU7x Ironwood 全代际+部署案例 | ✅ 详细 |

### 国产 AI 芯片

| 页面 | 厂商 | 核心芯片 | 梯队 |
|------|------|---------|------|
| [[01_Fundamentals/AI_Hardware/Chinese_AI_Chips_Deep_Dive|国产 AI 芯片深度解析]] | 12+ 家厂商 | 全线覆盖 | T1-T3 |
| [[01_Fundamentals/AI_Hardware/T_Head_PPU_Deep_Dive|平头哥真武 PPU 深度解析]] | 平头哥 (T-Head) | 真武 810E / M890 | T2 |

### NVIDIA/AMD 快速对比

| GPU | 显存 | FP8 算力 | 带宽 | 价格 | 定位 |
|-----|------|----------|------|------|------|
| H100 SXM | 80GB | 1,979 TF | 3.35 TB/s | $33k | 训练主力 |
| H200 SXM | 141GB | 1,979 TF | 4.8 TB/s | $40k | 推理旗舰 |
| B200 SXM | 192GB | 2,250 TF | 8 TB/s | $65k | 下一代旗舰 |
| GB200 NVL72 | 13.8TB | 144 PFLOPS | 1.8 TB/s | 企业定制 | 机柜级超算 |
| MI300X | 192GB | 2,614 TF | 5.3 TB/s | $15k | 性价比之王 |
| MI350X | 288GB | 4,000+ TF | 6 TB/s | $25k | AMD 新旗舰 |

### 国产芯片快速对比

| 厂商 | 芯片 | FP16 算力 | 显存 | 定位 | 官网 |
|------|------|----------|------|------|------|
| 华为昇腾 | 910C | 400+ TF | 96GB | 训练+推理 | [hiascend.com](https://www.hiascend.com/) |
| 寒武纪 | 思元 590 | 512 TF | 96GB | 训练+推理 | [cambricon.com](https://www.cambricon.com/) |
| 平头哥 | 真武 810E | — | 96GB HBM2e | 训推一体 | [t-head.cn](https://www.t-head.cn/) |
| 平头哥 | 真武 M890 | — | 144GB | 新一代训推一体 | [t-head.cn](https://www.t-head.cn/) |
| 海光 | DCU K100 | 200+ TF | 64GB | CUDA 兼容 | [hgon.com](https://www.hgon.com/) |
| 摩尔线程 | S5000 | 200+ TF | 64GB | 全功能 GPU | [mthreads.com](https://www.mthreads.com/) |
| 壁仞 | 壁砺 166M | 1000+ TF | 64GB | 高算力 | [birentech.com](https://www.birentech.com/) |
| 百度昆仑 | 昆仑 3 | 512 TF | 64GB | 推理优化 | [kunlun.baidu.com](https://kunlun.baidu.com/) |

### 国际 GPU

| 厂商 | 旗舰产品 | 说明 |
|------|---------|------|
| NVIDIA | H100/H200/B200 | 训练+推理首选 |
| AMD | MI300X | CUDA 替代方案 |

---

## 选型决策树

```
训练 or 推理?
├── 训练 → NVIDIA H100 (首选) / 华为 910C (国产) / 平头哥 真武 (阿里生态) / 海光 K100 (迁移)
├── 推理 → NVIDIA L40S / 华为 310P / 平头哥 真武 PPU / 寒武纪 370-S4
└── 边缘 → 地平线 J6 (车载) / 算能 BM1688 / 寒武纪 220
```

> **关联**: -> [[01_Fundamentals|基础]] | [[07_Model_Training|模型训练]] | [[09_Deployment_Inference|部署推理]] | [[12_Architecture_Infrastructure|架构基础]]
