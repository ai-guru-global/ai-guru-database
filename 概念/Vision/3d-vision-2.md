---
title: "3D 视觉 2.0 (NeRF / 3DGS / World Labs / 3D 重建 / Gaussian Splatting)"
category: concepts
tags:
  - vision
  - 3d-vision
  - nerf
  - 3dgs
  - gaussian-splatting
  - 3d-reconstruction
  - photogrammetry
aliases:
  - 3D Vision 2.0
  - NeRF
  - 3D Gaussian Splatting
  - 3DGS
  - 3D Reconstruction
  - Gaussian Splatting
  - Photogrammetry
  - Photogrammetry
relationships:
  - target: "概念/3d-vision"
    type: extends
  - target: "概念/nerf"
    type: related_to
  - target: "概念/world-models-2"
    type: related_to
  - target: "概念/multimodal-vision"
    type: related_to
summary: "3D 视觉 2.0 是 2024-2026 突破"3D 重建"的关键——3DGS(3D Gaussian Splatting,2023 革命性)实时渲染、NeRF / Instant-NGP / Mip-NeRF 360、World Labs 单图 3D、HunyuanWorld 3D 场景生成、EmbodiedGen 机器人 3D。是 AR/VR、自动驾驶、机器人、文化遗产的核心。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# 3D 视觉 2.0

> **一句话理解**:3D 视觉 2.0 把"3D 重建"做到实时+高质量——3D Gaussian Splatting(2023, 实时 100 FPS)、NeRF / Instant-NGP(2022, 静态)、World Labs 单图 3D(2024-09)、HunyuanWorld 3D 场景(2025)。是 AR/VR、自动驾驶、机器人、文化遗产、游戏、电商的底层技术。

---

## 一、为什么需要 3D 视觉 2.0?

传统 3D 重建痛点:
- **点云**:稀疏、无纹理
- **Mesh**:难处理复杂拓扑
- **传统 NeRF**:训练慢(几小时)、渲染慢
- **大场景**:难处理

3D 视觉 2.0 解法:
- **3DGS**:实时 100+ FPS
- **Instant-NGP**:训练快(< 5 分钟)
- **文本/单图 → 3D**:易用
- **多模态融合**:几何 + 语义 + 物理

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| 神经辐射场 | Neural Radiance Fields(NeRF) | 经典 3D 表示 |
| 高斯泼溅 | Gaussian Splatting(3DGS) | 2023 革命 |
| 体渲染 | Volume Rendering | NeRF 渲染 |
| 光线投射 | Ray Casting | 经典方法 |
| 多视角立体 | Multi-View Stereo(MVS) | 传统几何 |
| 结构光 | Structured Light | 深度获取 |
| 点云 | Point Cloud | 3D 数据 |
| 网格 | Mesh | 3D 表面 |
| 隐式表示 | Implicit Representation | NeRF |
| 显式表示 | Explicit Representation | 3DGS |
| 体素 | Voxel | 3D 像素 |
| 八叉树 | Octree | 空间分割 |
| SDF | Signed Distance Function | 表面表示 |
| NeRF 加速 | NeRF Acceleration | Instant-NGP |
| 多分辨率 | Multi-Resolution | 哈希编码 |
| 哈希编码 | Hash Encoding | Instant-NGP 核心 |
| 实时渲染 | Real-time Rendering | 30+ FPS |
| 神经 SDF | Neural SDF | 表面重建 |
| 文本到 3D | Text-to-3D | 0.6x 行业爆发 |
| 图像到 3D | Image-to-3D | World Labs |
| 4D 视觉 | 4D Vision | 时空 |

---

## 三、主流方案对比(2026-02 快照)

| 方案 | 团队 | 速度 | 质量 | 适合 | 许可证 |
|---|---|---|---|---|---|
| **3D Gaussian Splatting** | INRIA / 2023 | 100+ FPS | 极高 | 实时 | Apache 2.0 |
| **Instant-NGP** | NVIDIA 2022 | 30+ FPS | 高 | 训练快 | Apache 2.0 |
| **NeRF(原版)** | UC Berkeley 2020 | 0.5 FPS | 极高 | 经典 | MIT |
| **Mip-NeRF 360** | Google 2022 | 5 FPS | 极高 | 大场景 | Apache 2.0 |
| **NeRF Studio** | Stanford | 多 | 高 | 研究 | Apache 2.0 |
| **nerfstudio** | Berkeley | 多 | 高 | 标准化 | Apache 2.0 |
| **gaussian-splatting-cuda** | INRIA | 100+ FPS | 极高 | 生产 | Apache 2.0 |
| **World Labs** | Fei-Fei Li | 单图 | 极高 | 商业 | 商业 |
| **HunyuanWorld** | 腾讯 | 文生 | 高 | 360° | Apache 2.0 |
| **Wonder3D** | 字节 | 单图 | 中 | 端侧 | Apache 2.0 |
| **TripoSR** | Stability AI | 单图 | 高 | 6s 重建 | MIT |
| **LRM** | 港大 | 单图 | 高 | 大模型 3D | Apache 2.0 |

---

## 四、3D Gaussian Splatting 详解

### 4.1 核心思想(2023, INRIA)

**用 3D 高斯表示场景**:
- 每个高斯有:位置、协方差、颜色、不透明度
- 通过 SfM(Structure from Motion)初始化
- 优化高斯参数
- 体渲染 / Alpha 混合

### 4.2 优势

- **训练快**:1-2 小时(原版 NeRF 几小时 ~ 几天)
- **渲染快**:100+ FPS(NeRF 0.5 FPS)
- **质量高**:PSNR 与 NeRF 持平甚至更好
- **可编辑**:高斯可移动、删除

### 4.3 论文

- "3D Gaussian Splatting for Real-Time Radiance Field Rendering" [arxiv.org/abs/2308.04079](https://arxiv.org/abs/2308.04079)
- 仓库 [github.com/graphdeco-inria/gaussian-splatting](https://github.com/graphdeco-inria/gaussian-splatting)
- 18K+ stars

### 4.4 实战

```bash
# 安装
git clone https://github.com/graphdeco-inria/gaussian-splatting
cd gaussian-splatting
pip install -r requirements.txt

# 训练
python train.py -s data/your_scene/

# 渲染
python render.py -m output/your_scene/
```

### 4.5 变体

- **2DGS**:2D 泼溅(更平滑)
- **Dynamic 3DGS**:动态场景
- **4DGS**:时空 4D
- **Mip-Splatting**:抗锯齿
- **Scaffold-GS**:结构化

---

## 五、Instant-NGP 详解(NVIDIA)

### 5.1 核心

- **哈希编码**:小 MLP + 多分辨率哈希
- 训练时间:< 5 分钟
- 渲染:30+ FPS

### 5.2 优势

- 训练极快
- 显存友好
- 适合快速原型

### 5.3 实战

```python
# nerfstudio 框架
pip install nerfstudio
ns-train instant-ngp --data data/your_scene
```

---

## 六、NeRF Studio 详解(Berkeley)

### 6.1 核心

- 统一 3D 重建框架
- 支持多种方法(NeRF / 3DGS / Instant-NGP / Mip-NeRF 360)
- 可视化 + 评估
- 行业标准

### 6.2 仓库

- nerfstudio [github.com/nerfstudio-project/nerfstudio](https://github.com/nerfstudio-project/nerfstudio)
- 4K+ stars

---

## 七、文本 / 图像到 3D

### 7.1 文本到 3D

- **DreamFusion**(Google):用 2D 扩散做 3D
- **Magic3D**(NVIDIA):高质量
- **HunyuanWorld**(腾讯):场景级

### 7.2 图像到 3D

- **World Labs**(Fei-Fei Li):单图 → 真实 3D
- **TripoSR**(Stability AI):6 秒
- **LRM**(港大):大模型 3D
- **Wonder3D**(字节):端侧

### 7.3 应用

- AR / VR
- 电商(3D 商品)
- 游戏 / 影视
- 文化遗产

---

## 八、生产最佳实践

1. **实时选 3DGS**:100+ FPS,质量高,首选。
2. **快速原型用 Instant-NGP**:5 分钟训练。
3. **大场景用 Mip-NeRF 360**:无界场景。
4. **标准化用 nerfstudio**:统一框架。
5. **文生 3D 用 HunyuanWorld / DreamFusion**:从文本生成。
6. **图生 3D 用 World Labs / TripoSR**:单图快速 3D。
7. **机器人用 3DGS + 物理**:物理一致。
8. **多 GPU 训练**:3DGS 大场景需多卡。
9. **A/B 测试**:3DGS vs NeRF 质量 + 速度。
10. **渲染引擎集成**:Unity / Unreal / Three.js。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **3DGS** | 18K+ stars,实时 SOTA |
| **nerfstudio** | 4K+,统一框架 |
| **World Labs** | 商业化,2024-09 启动 |
| **HunyuanWorld** | 2025,360° 场景 |
| **TripoSR** | 6 秒重建,MIT |
| **LRM** | 大模型 3D,港大 |
| **市场规模** | 3D 重建 ARR $500M+ |
| **主要竞品** | 3DGS / Instant-NGP / NeRF / World Labs / TripoSR |

---

## 十、See Also(官方源)

### 3DGS

- 论文 [arxiv.org/abs/2308.04079](https://arxiv.org/abs/2308.04079)
- 仓库 [github.com/graphdeco-inria/gaussian-splatting](https://github.com/graphdeco-inria/gaussian-splatting)

### NeRF

- 原版 NeRF [arxiv.org/abs/2003.08934](https://arxiv.org/abs/2003.08934)
- Instant-NGP [arxiv.org/abs/2201.05989](https://arxiv.org/abs/2201.05989)
- Mip-NeRF 360 [arxiv.org/abs/2111.12077](https://arxiv.org/abs/2111.12077)
- nerfstudio [github.com/nerfstudio-project/nerfstudio](https://github.com/nerfstudio-project/nerfstudio)

### 文生 / 图生 3D

- DreamFusion [arxiv.org/abs/2209.14988](https://arxiv.org/abs/2209.14988)
- Magic3D [arxiv.org/abs/2211.10440](https://arxiv.org/abs/2211.10440)
- TripoSR [github.com/VAST-AI/TripoSR](https://github.com/VAST-AI/TripoSR)
- HunyuanWorld [github.com/Tencent-Hunyuan/HunyuanWorld](https://github.com/Tencent-Hunyuan/HunyuanWorld)

### World Labs

- 主页 [worldlabs.ai](https://www.worldlabs.ai/)

### 变体

- 2DGS [arxiv.org/abs/2403.17888](https://arxiv.org/abs/2403.17888)
- 4DGS [arxiv.org/abs/2310.08528](https://arxiv.org/abs/2310.08528)
- Mip-Splatting [arxiv.org/abs/2312.07342](https://arxiv.org/abs/2312.07342)

---

## 十一、相关概念卡

- [[概念/3d-vision|3d Vision]]
- [[概念/nerf|Nerf]]
- [[概念/world-models-2|World Models 2]]
- [[概念/multimodal-vision|Multimodal Vision]]
- [[概念/video-generation|Video Generation]]
- [[概念/sam-2|Sam 2]]
- [[概念/vlm-2-0|Vlm 2 0]]
- [[概念/stable-diffusion|Stable Diffusion]]
