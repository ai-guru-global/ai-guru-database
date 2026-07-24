---
title: "SAM 2 / 视频分割 2.0 (Segment Anything Model 2 / Meta 2024)"
category: concepts
tags:
  - vision
  - sam
  - sam-2
  - video-segmentation
  - meta
  - foundation-model
  - promptable
aliases:
  - SAM 2
  - Segment Anything Model 2
  - Video Segmentation
  - Meta SAM
  - Foundation Vision Model
relationships:
  - target: "概念/sam"
    type: extends
  - target: "概念/image-segmentation"
    type: related_to
  - target: "概念/foundation-model"
    type: related_to
  - target: "概念/video-llm"
    type: related_to
summary: "SAM 2(2024-07,Meta)是图像 SAM 的"视频版"——统一图像 + 视频分割,流式记忆机制 + 提示式交互,SA-V 数据集 51K 视频、640K mask。在 SA-V 测试 17 FPS 单 GPU 实时,视频分割质量比 SAM 提升 2x。是 2024-2026 视频编辑 / 自动驾驶 / AR / 机器人视觉的核心。"
lifecycle: reviewed
tier: core
created: 2026-07-24
updated: 2026-07-24
sources: []
---

# SAM 2 / 视频分割 2.0

> **一句话理解**:SAM 2 把 SAM 从"图像"扩展到"视频"——用流式记忆 + 提示式交互实现任意视频对象跟踪分割,1 张 GPU 17 FPS 实时,质量比 SAM 提升 2x。Meta 2024-07 开源 + SA-V 数据集,正在重塑视频编辑、自动驾驶、AR、机器人视觉。

---

## 一、为什么需要 SAM 2?

SAM(2023)只能处理图像:
- 视频中物体跨帧跟踪:无记忆
- 漂移、ID 切换、遮挡丢失
- 难处理长视频

SAM 2(2024-07)解决:
- **统一架构**:图像 + 视频同模型
- **流式记忆**:保留历史信息
- **提示式交互**:点 / 框 / mask
- **实时**:1 GPU 17 FPS

---

## 二、关键术语

| 中文 | 英文 | 说明 |
|---|---|---|
| SAM 2 | Segment Anything Model 2 | Meta 2024-07 |
| 流式记忆 | Streaming Memory | 视频处理 |
| 提示式 | Promptable | 点 / 框 / mask 提示 |
| 掩码 | Mask | 像素级分割 |
| 视频分割 | Video Segmentation | 跨帧分割 |
| 目标跟踪 | Object Tracking | 跨帧 ID 一致 |
| SA-V | Segment Anything Video | 数据集 |
| 实时 | Real-time | 17 FPS 单 GPU |
| 基础模型 | Foundation Model | 通用 |
| 零样本 | Zero-Shot | 无需训练 |
| 图像编码器 | Image Encoder | ViT-H |
| 视频编码器 | Video Encoder | 时空编码 |
| 记忆注意力 | Memory Attention | 跨帧信息融合 |
| 提示编码 | Prompt Encoding | 用户输入 |
| 分割头 | Mask Decoder | 输出 mask |
| 自动驾驶 | Autonomous Driving | 视频分割应用 |
| 视频编辑 | Video Editing | 蒙版 / 抠图 |
| 机器人视觉 | Robotics Vision | 物体抓取 |
| 增强现实 | Augmented Reality(AR) | 实时分割 |
| 数据集 | Dataset | SA-V 51K 视频 |
| 评估 | Evaluation | 17 个基准 |

---

## 三、SAM 2 架构

### 3.1 核心组件

```
Video Frame
   ↓
[Image Encoder (ViT-H, 共享)] → frame feature
   ↓
[Memory Attention] (融合历史)
   ↓
[Prompt Encoder] (接受点/框/mask)
   ↓
[Mask Decoder] → output mask
   ↓
[Memory Encoder] (用于下一帧)
```

### 3.2 关键创新

- **流式记忆模块**:
  - 保留最近 N 帧的 mask / 特征
  - 跨帧信息融合
- **多模态提示**:
  - 正/负点击
  - 边界框
  - 已有 mask
- **视频训练**:
  - 51K 视频、640K mask
  - 17 FPS 单 GPU

### 3.3 模型规模

- **Tiny / Small / Base / Large**
- 最大:Large(355M 参数)
- Hiera 图像编码器(SA 优化)

---

## 四、性能对比(SA-V 基准)

| 模型 | 视频 J&F | 速度 | 显存 |
|---|---|---|---|
| **SAM 2 Large** | 79.2 | 17 FPS | 8GB |
| **SAM 2 Base+** | 75.3 | 24 FPS | 6GB |
| **SAM 2 Small** | 72.9 | 32 FPS | 4GB |
| **SAM 2 Tiny** | 70.6 | 47 FPS | 2GB |
| **XMem(2022)** | 70.5 | 30 FPS | 4GB |
| **Cutie(2023)** | 73.5 | 18 FPS | 5GB |
| **DeAOT(2023)** | 71.5 | 25 FPS | 5GB |
| **SAM(图像)** | 不可用 | — | 4GB |

**注**:J&F 是 Jaccard + F-measure 平均

---

## 五、SA-V 数据集

### 5.1 规模

- **51,201 视频**
- **642,036 mask** (平均 12.5 帧/mask)
- **多样化场景**:自然 / 城市 / 室内 / 室外
- **多对象**:每视频最多 100+ 物体

### 5.2 公开

- SA-V CC-BY 4.0
- 最大视频分割数据集
- 推动研究

### 5.3 标注

- 智能 + 人工
- 多轮校正
- 像素级精度

---

## 六、应用场景

### 6.1 视频编辑

- **智能蒙版**:自动跟踪主体
- **背景替换**:实时蒙版
- **特效制作**:对象锁定

### 6.2 自动驾驶

- 动态物体分割(车 / 人)
- 跨帧跟踪
- 端到端驾驶模型

### 6.3 机器人视觉

- 物体抓取
- 视频理解
- AR 交互

### 6.4 医疗影像

- 超声 / 视频内窥镜
- 病变跟踪
- 治疗规划

---

## 七、SAM 2 实战

### 7.1 安装

```bash
pip install sam-2
# 或 git clone
git clone https://github.com/facebookresearch/segment-anything-2
cd segment-anything-2
pip install -e .
```

### 7.2 视频分割

```python
import torch
from sam2.build_sam import build_sam2_video_predictor

predictor = build_sam2_video_predictor(
    config_file="sam2_hiera_large.yaml",
    ckpt_path="sam2_hiera_large.pt",
    device="cuda",
)

# 初始化视频
inference_state = predictor.init_state(video_path="video.mp4")

# 第一帧:点击提示
predictor.add_new_points_or_box(
    inference_state=inference_state,
    frame_idx=0,
    obj_id=1,
    points=np.array([[x, y]]),
    labels=np.array([1]),  # 正点
)

# 视频传播
for frame_idx, obj_ids, masks in predictor.propagate_in_video(inference_state):
    print(f"Frame {frame_idx}: {len(obj_ids)} objects")
```

### 7.3 图像分割(单帧)

```python
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor

predictor = SAM2ImagePredictor(build_sam2(...))
predictor.set_image(image)

masks, scores, _ = predictor.predict(
    point_coords=np.array([[x, y]]),
    point_labels=np.array([1]),
)
```

---

## 八、生产最佳实践

1. **首选 SAM 2 Large**:质量 SOTA。
2. **实时选 SAM 2 Tiny/Small**:30-50 FPS。
3. **视频流式处理**:不要一次性加载,边读边处理。
4. **多对象跟踪**:不同 obj_id 区分。
5. **校正机制**:用户点击校正,避免累积错误。
6. **预训练 + 微调**:SA-V 预训练,垂域微调。
7. **量化加速**:FP16 / INT8 推理,显存降 50%。
8. **A/B 测试**:不同 obj_id 隔离。
9. **内存复用**:长视频分段处理。
10. **替代方案**:XMem(更轻量) / Cutie(2023 SOTA) / SAM 2(2024 SOTA)。

---

## 九、2026 生态速览

| 维度 | 2026 状态 |
|---|---|
| **SAM 2.1** | 2024-12,小模型优化 |
| **SAM 3** | 2026-Q3 预期 |
| **视频理解** | 整合 VLM(VideoLLaMA 3 / SAM 2) |
| **应用** | 自动驾驶 / 视频编辑 / 医疗 / 机器人 |
| **API** | Replicate / Roboflow / 厂商 |
| **微调** | PEFT / LoRA 支持 |
| **ARR 规模** | 视频分割 ARR $50M+ |
| **主要竞品** | SAM 2 / XMem / Cutie / DeAOT |

---

## 十、See Also(官方源)

### 论文与代码

- SAM 2 论文 "SAM 2: Segment Anything in Images and Videos" [arxiv.org/abs/2408.00714](https://arxiv.org/abs/2408.00714)
- 仓库 [github.com/facebookresearch/segment-anything-2](https://github.com/facebookresearch/segment-anything-2)
- SA-V 数据集 [ai.meta.com/datasets/segment-anything-video](https://ai.meta.com/datasets/segment-anything-video/)
- Demo [sam2.metademolab.com](https://sam2.metademolab.com/)

### 演示

- 在线 demo [sam2.metademolab.com](https://sam2.metademolab.com/)
- 论文解读 [ai.meta.com/research/segment-anything-2](https://ai.meta.com/research/segment-anything-2/)

### 相关

- SAM(原版)[github.com/facebookresearch/segment-anything](https://github.com/facebookresearch/segment-anything)
- SAM 2.1(2024-12)[github.com/facebookresearch/sam2](https://github.com/facebookresearch/sam2)
- XMem [github.com/hkchengrex/Cutie](https://github.com/hkchengrex/Cutie)
- Cutie [github.com/hkchengrex/Cutie](https://github.com/hkchengrex/Cutie)

---

## 十一、相关概念卡

- [[概念/sam|Sam]]
- [[概念/image-segmentation|Image Segmentation]]
- [[概念/video-llm|Video Llm]]
- [[概念/vision-language-model|Vision Language Model]]
- [[概念/foundation-model|Foundation Model]]
- [[概念/image-restoration|Image Restoration]]
- [[概念/3d-vision-2|3d Vision 2]]
- [[概念/multimodal-vision|Multimodal Vision]]
