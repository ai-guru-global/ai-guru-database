---
title: '自动驾驶感知技术深度解析 (2026)'
category: '04-computer-vision-cv-fundamentals'
tags: ["computer-vision", "autonomous-driving", "bev", "occupancy", "end-to-end", "sensor-fusion"]
summary: '> **一句话秒懂**: 自动驾驶感知让车辆像人类司机一样"看懂"道路——从BEV鸟瞰图到Occupancy占用网络，从模块化到端到端，AI正在重新定义"开车"这件事。'
created: '2026-07-19'
updated: '2026-07-19'
tier: deep-dive
aliases:
  - "Autonomous Driving Perception 2026"
  - "AD Perception"
  - Autonomous_Driving_Perception_2026
sources: []

name_zh: "自动驾驶感知技术深度解析"
---
# 自动驾驶感知技术深度解析 (2026)

> 中文简称：自动驾驶感知技术深度解析

> **一句话秒懂**: 自动驾驶感知让车辆像人类司机一样"看懂"道路——从BEV鸟瞰图到Occupancy占用网络，从模块化到端到端，AI正在重新定义"开车"这件事。

---

## 目录

- [概述](#概述)
- [BEV感知](#bev感知)
- [Occupancy Network](#occupancy-network)
- [多传感器融合](#多传感器融合)
- [端到端自动驾驶](#端到端自动驾驶)
- [4D检测与预测](#4d检测与预测)
- [世界模型在AD中的应用](#世界模型在ad中的应用)
- [代表模型对比](#代表模型对比)
- [实践指南](#实践指南)
- [2026产业格局](#2026产业格局)
- [2026前沿](#2026前沿)
- [相关概念](#相关概念)

---

## 概述

### 自动驾驶感知系统全景

```
自动驾驶感知 = 车辆的"眼睛"和"大脑"

输入: 多传感器数据
├── 相机 (6-12个): RGB图像, 360°环视
├── LiDAR (1-5个): 3D点云, 精确距离
├── Radar (5-6个): 速度+距离, 全天候
├── IMU/GPS: 自车定位
└── 高精地图 (可选): 先验信息

输出: 驾驶决策所需信息
├── 3D目标检测: 车辆/行人/骑行者的位置+速度
├── 车道线检测: 道路结构
├── 交通标志/信号灯: 交通规则
├── 可行驶区域: 哪里能开
├── Occupancy: 3D空间占用
└── 预测: 其他交通参与者未来轨迹
```

### 技术演进路线

```
2016-2019: 2D感知时代
- 2D检测 + 单目深度估计
- 多传感器后融合
- 规则驱动

2020-2022: 3D感知崛起
- 3D目标检测 (点云/图像)
- BEV感知范式确立
- 多传感器前融合

2022-2024: BEV + Occupancy
- BEV统一表示
- Occupancy Network
- 时空感知 (4D)

2024-2026: 端到端 + 世界模型
- 端到端自动驾驶 (UniAD, VAD)
- 世界模型 (GAIA, DriveDreamer)
- 大模型赋能 (DriveVLM, DriveLM)
- 去高精地图

技术趋势: 模块化 → 端到端 → 世界模型
```

### 核心挑战

| 挑战 | 描述 | 影响 |
|------|------|------|
| 长尾场景 | 罕见但危险的场景 (施工区、异常行为) | 安全性 |
| 恶劣天气 | 雨/雪/雾/夜间 | 鲁棒性 |
| 遮挡 | 物体被部分遮挡 | 完整性 |
| 远距离 | 200m+目标检测 | 提前规划 |
| 实时性 | <100ms延迟要求 | 安全性 |
| 泛化 | 新城市/新道路 | 可扩展性 |
| 可解释性 | 为什么做这个决策 | 法规/信任 |

---

## BEV感知

### 什么是BEV (Bird's Eye View)?

```
BEV = 鸟瞰图视角

传统视角: 透视投影 (近大远小)
┌─────────────────────┐
│    远处(小)          │
│   /    \            │
│  /      \           │
│ / 近处(大)\          │
└─────────────────────┘

BEV视角: 俯视投影 (统一尺度)
┌─────────────────────┐
│  ·  ·  ·  ·  ·     │
│  ·  ·  🚗  ·  ·    │
│  ·  ·  |  ·  ·     │
│  ·  ·  🚙  ·  ·    │  ← 自车
└─────────────────────┘

为什么BEV好?
✓ 统一尺度: 远近物体大小一致
✓ 易于融合: 多相机/LiDAR统一坐标系
✓ 易于规划: 直接对应俯视图路径规划
✓ 时序融合: 多帧BEV直接拼接
```

### 图像到BEV的转换方法

```
核心问题: 如何从2D透视图像得到BEV特征?

方法1: LSS (Lift-Splat-Shoot) [2020]
- 对每个像素预测深度分布
- 将2D特征"提升"到3D空间
- "拍扁"到BEV平面
- 优点: 简单高效
- 缺点: 深度估计不准

方法2: BEVFormer [2022]
- 可学习BEV queries
- 通过Deformable Attention从多视角图像采样
- 时空注意力 (融合历史帧)
- 优点: 精度高
- 缺点: 计算量大

方法3: BEVDet / BEVDepth [2022]
- 显式深度估计 + LSS
- 深度监督提升精度
- 优点: 精度与速度平衡
- 缺点: 需要深度标注

方法4: SparseBEV [2023]
- 稀疏查询 + 自适应采样
- 不依赖密集深度
- 优点: 高效
- 缺点: 稀疏区域信息损失
```

### BEVFormer 架构详解

```
BEVFormer (2022, 上海AI Lab):

输入: 6个环视相机图像 (900×1600)

1. BEV Queries:
   - 可学习: 200×200×C 的BEV网格
   - 每个query代表BEV空间一个位置

2. Spatial Cross-Attention:
   - 每个BEV query → 投影到6个相机
   - 在对应位置采样图像特征
   - Deformable Attention (多点采样)
   → 获取该BEV位置的视觉信息

3. Temporal Self-Attention:
   - 当前BEV + 历史BEV (对齐后)
   - 自注意力融合时序信息
   → 获取运动/历史信息

4. 输出:
   - BEV特征 → 3D检测头
   - BEV特征 → 地图分割头
   - BEV特征 → 运动预测头

性能: nuScenes NDS 56.9 (纯视觉)
```

### BEV感知任务

| 任务 | 输入 | 输出 | 代表方法 |
|------|------|------|----------|
| 3D检测 | 多视角图像/LiDAR | 3D BBox | BEVDet, BEVFormer |
| 地图构建 | 多视角图像 | 车道线/道路边界 | MapTR, StreamMapNet |
| 运动预测 | BEV时序 | 轨迹预测 | ST-P3, UniAD |
| 占据预测 | BEV特征 | 3D Occupancy | OccNet, FB-OCC |
| 规划 | BEV + 目标 | 自车轨迹 | UniAD, VAD |

---

## Occupancy Network

### 为什么需要Occupancy?

```
3D检测的局限:
- 只能检测"已知类别" (车、人、自行车...)
- 无法表示"未知障碍物" (掉落物、施工设施)
- 无法表示"自由空间" (哪里能开)

Occupancy Network:
- 将3D空间离散化为体素网格
- 每个体素: 占用/空闲 + 语义类别
- 不依赖预定义类别
- 完整表示3D空间

示例:
传统检测: [车A at (10,5), 行人B at (15,3)]
Occupancy: 整个3D空间每个0.5m体素的状态
  → 包含未知障碍物、路面、植被等一切
```

### Occupancy表示

```
3D体素网格:
- 范围: [-40m, 40m] × [-40m, 40m] × [-1m, 5.4m]
- 分辨率: 0.4m/体素
- 网格: 200×200×16 = 640,000 体素
- 每个体素: 语义类别 (16-256类)

语义类别示例:
0: 空闲 (free)
1: 车辆 (vehicle)
2: 行人 (pedestrian)
3: 自行车 (cyclist)
4: 道路 (road)
5: 人行道 (sidewalk)
6: 植被 (vegetation)
7: 建筑 (building)
8: 交通设施 (traffic)
9-15: 其他/未知

关键: 类别9-15可表示任意未知障碍物!
```

### 代表方法

```
TPVFormer (2023):
- 三视角表示 (Tri-Perspective View)
- 3个正交平面代替完整3D体素
- 大幅减少计算量
- 精度接近完整3D

OccNet (2023):
- 级联体素解码
- 多尺度3D特征
- 场景流预测

FB-OCC (2023):
- 前向-后向双向投影
- 高效2D→3D转换
- nuScenes Occupancy Challenge冠军

SurroundOcc (2023):
- 环视图像输入
- 多尺度3D卷积
- 稠密占用预测

GaussianFormer (2024):
- 3D Gaussian表示Occupancy
- 稀疏表示, 高效
- 自适应分辨率
```

### Occupancy vs 3D Detection

| 维度 | 3D Detection | Occupancy |
|------|-------------|-----------|
| 表示 | 稀疏 (bbox) | 稠密 (体素) |
| 类别 | 固定 (已知类) | 开放 (含未知) |
| 形状 | 矩形框 | 任意形状 |
| 信息量 | 少 (位置+大小) | 多 (完整3D) |
| 计算量 | 低 | 高 |
| 下游用途 | 检测/跟踪 | 规划/避障 |
| 标注成本 | 中 (3D框) | 高 (体素标注) |

---

## 多传感器融合

### 传感器特性对比

| 传感器 | 优势 | 劣势 | 信息 |
|--------|------|------|------|
| **Camera** | 纹理/颜色/语义丰富 | 受光照/天气影响 | 2D RGB |
| **LiDAR** | 精确3D距离 | 稀疏/无纹理/贵 | 3D点云 |
| **Radar** | 全天候/测速 | 分辨率低/噪声大 | 距离+速度 |
| **IMU/GPS** | 自车定位 | 累积误差 | 位姿 |

### 融合策略

```
融合层级:

1. 后融合 (Late Fusion / 结果级):
   Camera检测 ──→ 2D结果 ──┐
                            ├──→ 融合匹配 ──→ 最终结果
   LiDAR检测 ───→ 3D结果 ──┘
   
   优点: 模块独立, 易调试
   缺点: 信息损失, 匹配困难

2. 前融合 (Early Fusion / 数据级):
   Camera图像 ──┐
               ├──→ 统一表示 ──→ 检测
   LiDAR点云 ──┘
   
   优点: 信息保留完整
   缺点: 对齐困难, 计算量大

3. 中融合 (Mid Fusion / 特征级): ★主流
   Camera → 特征提取 ──┐
                       ├──→ 特征融合 ──→ 检测
   LiDAR → 特征提取 ──┘
   
   优点: 平衡信息保留与效率
   代表: BEVFusion, TransFusion, FUTR3D

4. 查询融合 (Query-based):
   统一queries → 从各传感器特征中采样
   代表: FUTR3D, CMT, UniTR
```

### BEVFusion: 统一BEV融合

```
BEVFusion (MIT, 2022):

Camera分支:
6×图像 → Backbone → 2D特征
    → LSS (深度估计) → BEV特征

LiDAR分支:
点云 → VoxelNet/PointPillars → 3D特征
    → 投影到BEV → BEV特征

融合:
Camera BEV ──┐
             ├──→ Concat/Attention → 统一BEV → 检测头
LiDAR BEV ──┘

关键: 在BEV空间融合, 天然对齐!

性能: nuScenes NDS 72.9 (Camera+LiDAR)
速度: 31 FPS (TensorRT优化后)
```

---

## 端到端自动驾驶

### 模块化 vs 端到端

```
传统模块化Pipeline:
感知 → 预测 → 规划 → 控制
  ↓       ↓       ↓       ↓
3D检测  轨迹预测  路径规划  油门/转向

问题:
✗ 误差累积: 感知错 → 预测错 → 规划错
✗ 信息瓶颈: 模块间只传递有限信息
✗ 目标不一致: 各模块独立优化
✗ 长尾难处理: 规则难以覆盖所有情况

端到端 (End-to-End):
传感器输入 ──→ 单一神经网络 ──→ 驾驶轨迹/控制

优势:
✓ 全局优化: 一个损失函数
✓ 信息保留: 无中间瓶颈
✓ 数据驱动: 从数据中学习所有
✓ 长尾处理: 学习人类驾驶经验
```

### UniAD: 统一自动驾驶

```
UniAD (2023, 上海AI Lab, CVPR Best Paper):

核心思想: 所有任务统一在一个框架中

架构:
多视角图像 → BEV Encoder → BEV Features
                                ↓
                    ┌───────────┼───────────┐
                    ↓           ↓           ↓
              Track Query  Map Query  Motion Query
                    ↓           ↓           ↓
              3D跟踪      在线建图    运动预测
                    ↓           ↓           ↓
                    └───────────┼───────────┘
                                ↓
                          Occupancy预测
                                ↓
                          规划 (Planning)

关键设计:
1. 统一查询: 所有任务共享BEV特征
2. 级联: 检测→跟踪→建图→预测→规划
3. 联合训练: 所有任务端到端优化
4. 规划导向: 最终目标是安全规划

性能: nuScenes Planning L2 0.48m (SOTA)
```

### VAD: 向量化自动驾驶

```
VAD (2023, Horizon Robotics):

创新: 用向量化表示替代栅格化

传统: BEV栅格 (200×200) → 密集计算
VAD:  向量化场景表示 → 稀疏高效

架构:
多视角图像 → BEV Encoder
                ↓
    Vectorized Scene Representation:
    - 车辆: 向量 (位置+朝向+速度)
    - 地图: 折线段 (车道线向量)
    - 自车: 规划轨迹向量
                ↓
    Vectorized Planning Head
    → 输出: 未来自车轨迹点

优势:
- 计算效率: 比栅格化快3-5x
- 表示紧凑: 只保留关键信息
- 易于部署: 适合车端计算

性能: nuScenes L2 0.54m, 速度 35 FPS
```

### 端到端方案对比

| 方案 | 输入 | 输出 | 中间表示 | 速度 | 可解释性 |
|------|------|------|----------|------|----------|
| **UniAD** | 多视角图像 | 规划轨迹 | BEV+多任务 | 5 FPS | 中 |
| **VAD** | 多视角图像 | 规划轨迹 | 向量化 | 35 FPS | 中 |
| **GenAD** | 多视角图像 | 规划轨迹 | 生成式 | 10 FPS | 低 |
| **DriveVLM** | 图像+文本 | 规划+解释 | VLM | 2 FPS | 高 |
| **Tesla FSD v13** | 8相机 | 控制信号 | 隐式 | 实时 | 低 |
| **PARA-Drive** | 多传感器 | 规划轨迹 | 并行化 | 15 FPS | 中 |

---

## 4D检测与预测

### 4D = 3D + 时间

```
3D检测: 当前帧的3D目标 (位置+大小+朝向)
4D检测: 目标的3D状态随时间变化 (位置+速度+加速度+轨迹)

4D感知包含:
1. 4D检测: 3D bbox + 速度 + 加速度
2. 4D跟踪: 跨帧目标关联 + 轨迹
3. 4D预测: 未来N秒的3D轨迹
4. 4D占用: 时空Occupancy (未来占用预测)
```

### 时空融合方法

```
时序信息融合策略:

1. BEV拼接 (BEVFormer):
   当前BEV + 历史BEV (位姿对齐) → 自注意力
   
2. 查询传播 (StreamPETR):
   上一帧的object queries → 传递到当前帧
   → 隐式编码运动信息

3. 点云场景流 (4D-Net):
   相邻帧点云 → 估计场景流
   → 运动特征辅助检测

4. 时空Transformer (ST-P3):
   时空注意力: 同时关注空间和时间
   → 联合建模时空关系
```

### 轨迹预测

```
任务: 预测周围交通参与者未来轨迹

输入: 目标历史轨迹 + 场景上下文
输出: 未来N秒的多模态轨迹分布

方法分类:
1. 回归式: 直接预测坐标
2. 生成式: 扩散/VAE生成多模态轨迹
3. 图网络: 建模交互关系
4. 端到端: 从原始传感器直接预测

代表:
- QCNet: 查询中心的轨迹预测
- MTR: 运动Transformer
- Wayformer: 统一预测模型
- GameFormer: 博弈论预测
```

---

## 世界模型在AD中的应用

### 什么是驾驶世界模型?

```
世界模型 (World Model):
"如果自车这样开，世界会怎样变化?"

输入: 当前状态 + 动作 (规划轨迹)
输出: 未来场景预测 (图像/BEV/状态)

用途:
1. 规划评估: 评估不同规划方案的安全性
2. 数据生成: 合成训练数据 (corner cases)
3. 仿真测试: 闭环仿真验证
4. 预训练: 学习驾驶世界知识
```

### 代表工作

```
GAIA-1 (Wayve, 2023):
- 视频生成世界模型
- 输入: 当前帧 + 文本/动作
- 输出: 未来驾驶视频
- 规模: 9B参数

DriveDreamer (2023):
- 结构化驾驶世界模型
- 输入: BEV布局 + 3D框 + 动作
- 输出: 未来多视角图像
- 可控: 编辑交通参与者行为

Drive-WM (2024):
- 多视角世界模型
- 生成未来多视角视频
- 用于闭环规划评估

Vista (2024):
- 高分辨率驾驶世界模型
- 长时序预测
- 动作条件生成

UniSim (2024):
- 统一仿真世界模型
- 支持多种传感器模拟
- 闭环评估
```

### 世界模型 + 规划

```
传统规划:
感知结果 → 规则/优化 → 轨迹

世界模型规划:
感知结果 → 世界模型预测多个候选轨迹的未来
         → 评估每个轨迹的安全性/舒适性
         → 选择最优轨迹

优势:
- 考虑交互: 预测其他车辆对自车动作的反应
- 前瞻: 评估未来多步的后果
- 安全: 在"想象"中测试危险情况
```

---

## 代表模型对比

### BEV感知模型对比

| 模型 | 年份 | 输入 | 方法 | NDS | mAP | FPS | 特点 |
|------|------|------|------|-----|-----|-----|------|
| **BEVFormer v2** | 2023 | 6 Camera | Deformable Attn | 63.4 | 55.6 | 4 | 高精度 |
| **BEVDet** | 2022 | 6 Camera | LSS+Depth | 51.5 | 39.2 | 30 | 高效 |
| **BEVFusion** | 2022 | Cam+LiDAR | BEV融合 | 72.9 | 68.5 | 31 | 多模态 |
| **StreamPETR** | 2023 | 6 Camera | 流式查询 | 55.0 | 45.0 | 25 | 时序高效 |
| **SparseBEV** | 2023 | 6 Camera | 稀疏采样 | 59.2 | 50.1 | 20 | 自适应 |
| **Far3D** | 2023 | 6 Camera | 远距离 | 56.8 | 48.3 | 15 | 200m+ |

### 端到端模型对比

| 模型 | 年份 | 方法 | L2 (1s) | L2 (3s) | Col. | 特点 |
|------|------|------|---------|---------|------|------|
| **UniAD** | 2023 | 统一多任务 | 0.44 | 1.02 | 0.31% | CVPR Best |
| **VAD** | 2023 | 向量化 | 0.41 | 0.89 | 0.27% | 高效 |
| **GenAD** | 2024 | 生成式 | 0.38 | 0.85 | 0.22% | 多模态 |
| **PARA-Drive** | 2024 | 并行化 | 0.35 | 0.82 | 0.19% | 模块化E2E |
| **DriveVLM** | 2024 | VLM | 0.52 | 1.15 | 0.35% | 可解释 |
| **FusionAD** | 2023 | 多模态融合 | 0.40 | 0.92 | 0.25% | Cam+LiDAR |

### Occupancy模型对比

| 模型 | 年份 | 输入 | 分辨率 | mIoU | 特点 |
|------|------|------|--------|------|------|
| **TPVFormer** | 2023 | 6 Camera | 0.4m | 27.8 | 三视角 |
| **FB-OCC** | 2023 | 6 Camera | 0.4m | 37.4 | 前向-后向 |
| **SurroundOcc** | 2023 | 6 Camera | 0.4m | 27.5 | 环视 |
| **GaussianFormer** | 2024 | 6 Camera | 自适应 | 30.2 | 高斯表示 |
| **OccWorld** | 2024 | 6 Camera | 0.4m | 35.1 | 世界模型 |
| **SparseOcc** | 2024 | 6 Camera | 稀疏 | 32.5 | 稀疏高效 |

---

## 实践指南

### 数据集

| 数据集 | 规模 | 传感器 | 标注 | 用途 |
|--------|------|--------|------|------|
| **nuScenes** | 1000场景 | 6Cam+1LiDAR+5Radar | 3D框/地图 | 标准基准 |
| **Waymo Open** | 1150场景 | 5Cam+5LiDAR | 3D框/流 | 大规模 |
| **ONCE** | 15K场景 | 7Cam+1LiDAR | 3D框 | 半监督 |
| **Argoverse 2** | 1000场景 | 7Cam+2LiDAR | 3D框/地图 | 预测 |
| **nuPlan** | 1500h | 多传感器 | 规划标注 | 规划 |
| **OpenScene** | 1000场景 | 多传感器 | Occupancy | 占用 |

### 开发环境搭建

```bash
# 基础环境
conda create -n ad_perception python=3.9
conda activate ad_perception

# PyTorch + CUDA
pip install torch==2.1.0 torchvision --index-url https://download.pytorch.org/whl/cu118

# 3D检测基础库
pip install mmdet3d mmcv-full mmdet mmsegmentation

# BEV感知
pip install flash-attn --no-build-isolation
# BEVFormer
git clone https://github.com/fundamentalvision/BEVFormer

# 点云处理
pip install open3d spconv-cu118

# 可视化
pip install nuscenes-devkit pyquaternion
```

### 模型部署要点

```
车端部署约束:
- 算力: 100-500 TOPS (Orin/征程6)
- 延迟: <100ms (10Hz)
- 功耗: <100W
- 温度: -40°C ~ 85°C

优化策略:
1. 模型压缩:
   - 量化: FP32 → FP16 → INT8
   - 剪枝: 结构化剪枝
   - 蒸馏: 大模型→小模型

2. 推理加速:
   - TensorRT: NVIDIA平台
   - TVM: 跨平台
   - 自定义CUDA kernel

3. 架构优化:
   - 稀疏化: 只处理有信息的区域
   - 级联: 粗→细
   - 异步: 多传感器异步处理

4. 部署框架:
   - NVIDIA Drive (Orin)
   - 地平线 天工开物 (征程)
   - 华为 MDC (Ascend)
```

### 评估指标

| 指标 | 含义 | 计算 |
|------|------|------|
| mAP | 平均精度 | 多阈值IoU下的AP均值 |
| NDS | nuScenes检测分数 | mAP + ATE + ASE + AOE + AVE + AAE |
| ATE | 平均平移误差 | 中心点距离 |
| ASE | 平均尺度误差 | 3D IoU |
| AOE | 平均朝向误差 | 朝向角差 |
| L2 | 规划误差 | 预测轨迹与GT的L2距离 |
| Col. | 碰撞率 | 规划轨迹的碰撞比例 |
| mIoU | 平均交并比 | Occupancy语义分割 |

---

## 2026产业格局

### 主要玩家技术路线

| 公司 | 路线 | 传感器 | 特点 | 进展 |
|------|------|--------|------|------|
| **Waymo** | L4 Robotaxi | 5LiDAR+29Cam+6Radar | 多传感器冗余 | 旧金山/凤凰城运营 |
| **Tesla FSD** | 纯视觉端到端 | 8 Camera | 去LiDAR/去地图 | v13端到端神经网络 |
| **华为ADS** | 融合感知 | 1LiDAR+11Cam+3Radar | GOD网络+端到端 | 城区NCA全国开城 |
| **小鹏** | 端到端 | 2LiDAR+12Cam | XNet+端到端 | XNGP全国 |
| **理想** | 端到端 | 1LiDAR+11Cam | 双系统(快慢) | 城市NOA |
| **蔚来** | 融合感知 | 1LiDAR+11Cam+5Radar | 世界模型 | 城区NOP+ |
| **Mobileye** | 纯视觉 | 11 Camera | RSS安全模型 | EyeQ6 |
| **地平线** | 芯片+算法 | 可配置 | 征程6 | 多家OEM合作 |

### Tesla FSD v13 技术解析

```
Tesla FSD v13 (2025-2026):

核心: 端到端神经网络

架构:
8路相机 → Vision Encoder → BEV特征
                              ↓
                    时空Transformer
                    (时序融合+空间推理)
                              ↓
                    神经网络规划器
                    (直接输出控制)
                              ↓
                    油门/刹车/转向

特点:
- 纯视觉: 无LiDAR/Radar
- 去地图: 无高精地图依赖
- 端到端: 感知→规划一体化
- 数据飞轮: 百万车队数据
- 影子模式: 人类驾驶数据自动标注

训练数据: 数十亿英里驾驶视频
算力: Dojo + H100集群
```

### 华为ADS 3.0

```
华为ADS 3.0 (2025-2026):

架构:
- GOD网络 (General Obstacle Detection):
  类Occupancy, 检测任意障碍物
- PDP网络 (Prediction-Decision-Planning):
  预测-决策-规划一体化
- 端到端: 从传感器到轨迹

传感器:
- 1× 192线LiDAR
- 11× Camera
- 3× Radar
- 12× 超声波

特点:
- 城区NCA: 全国无图可用
- 高速NCA: 类人驾驶
- 泊车: 代客泊车
- 安全: 全向防碰撞
```

### 产业趋势 (2026)

```
1. 端到端成为主流:
   - 从学术走向量产
   - Tesla/华为/小鹏已落地
   - 模块化作为安全冗余保留

2. 去高精地图:
   - 在线建图替代离线地图
   - 降低运营成本
   - 提升泛化能力

3. 纯视觉 vs 多传感器:
   - Tesla坚持纯视觉
   - 中国厂商保留LiDAR
   - 4D Radar作为折中

4. 大模型赋能:
   - VLM理解复杂场景
   - 世界模型仿真
   - 自然语言交互

5. 数据闭环:
   - 量产车采集 → 自动标注 → 训练
   - 仿真数据补充长尾
   - 数据飞轮加速迭代
```

---

## 2026前沿

### 大模型 + 自动驾驶

```
VLM在AD中的应用:

1. 场景理解:
   "前方施工区域，有工人和锥桶" → 理解语义

2. 决策解释:
   "为什么减速?" → "因为前方有行人过马路"

3. 长尾处理:
   罕见场景 → VLM推理 → 安全决策

4. 数据标注:
   VLM自动标注 → 降低标注成本

代表:
- DriveVLM: VLM驾驶
- DriveLM: 驾驶语言模型
- LMDrive: 语言引导驾驶
- GPT-Driver: GPT做规划器
```

### 生成式仿真

```
用生成模型创建训练/测试数据:

1. 场景生成:
   文本 → 驾驶场景 (布局+外观)
   "雨天高速公路，前方有事故"

2. 数据增强:
   真实场景 → 变换天气/时间/交通
   晴天 → 雨天/雪天/夜间

3. 闭环仿真:
   世界模型 → 实时生成传感器数据
   替代路测, 加速验证

4. Corner Case生成:
   针对性生成危险场景
   鬼探头/逆行/施工区

代表:
- DriveDreamer: 结构化场景生成
- MagicDrive: 可控驾驶视频生成
- UniSim: 统一传感器仿真
- GAIA-2: 大规模世界模型
```

### 4D Occupancy预测

```
从当前Occupancy → 未来Occupancy:

输入: 当前多视角图像 + 自车规划
输出: 未来N秒的3D占用预测

用途:
- 安全验证: 规划轨迹是否安全
- 交互预测: 其他车辆如何反应
- 空间推理: 哪里将变为可用

代表:
- OccWorld: 世界模型预测Occupancy
- DriveWorld: 4D世界模型
- GaussianWorld: 高斯世界模型
```

### 群体智能与V2X

```
车路协同 (V2X) + 自动驾驶:

单车智能局限:
- 视野受限 (遮挡)
- 感知距离有限
- 无法预知前方

V2X增强:
- 路侧感知 → 超视距信息
- 车车通信 → 共享感知
- 云端协同 → 全局优化

技术挑战:
- 通信延迟
- 信息融合
- 隐私保护
- 标准化
```

### 具身智能与AD的融合

```
自动驾驶 → 具身智能:

共同技术:
- 3D感知
- 运动规划
- 世界模型
- 端到端学习

融合方向:
- 自动驾驶技术 → 机器人导航
- 机器人操作 → 自动泊车/充电
- 统一世界模型 → 驾驶+操作

代表:
- Tesla Optimus + FSD 共享AI
- 华为 车机+机器人
- 学术: 统一导航-操作模型
```

---

## 相关概念

### 本知识库相关页面

- [[3D_Vision]] - 3D计算机视觉 (3D检测/点云基础)
- [[04_计算机视觉/01_CV基础/05_ViT_深入分析]] - Vision Transformer (BEV感知骨干)
- [[概念/Vision/object-detection]] - 目标检测 (2D/3D检测基础)
- [[概念/Vision/object-detection]] - 目标检测完整指南
- [[04_计算机视觉/01_CV基础/02_CV基础]] - 计算机视觉基础
- [[04_计算机视觉/01_CV基础/03_cv_deep_learning]] - 深度学习与CV
- [[概念/Vision/image-segmentation]] - 图像分割 (语义/实例分割)
- [[概念/Vision/clip]] - CLIP (视觉-语言对齐)
- [[概念/Vision/vision-language-model]] - VLM (驾驶VLM)
- [[概念/Vision/video-generation]] - 视频生成 (世界模型)
- [[04_计算机视觉/05_三维视觉/01_3D生成2026]] - 3D生成 (仿真数据生成)
- [[04_计算机视觉/09_CV部署/01_CV部署_and_推理_2026]] - CV部署 (车端部署)
- [[04_计算机视觉/06_生成模型/01_扩散_模型_深入分析]] - 扩散模型 (生成式仿真)

### 关键术语表

| 术语 | 英文 | 含义 |
|------|------|------|
| 鸟瞰图 | Bird's Eye View (BEV) | 俯视视角的统一表示 |
| 占用网络 | Occupancy Network | 3D空间体素占用预测 |
| 端到端 | End-to-End (E2E) | 传感器到控制一体化 |
| 多传感器融合 | Multi-sensor Fusion | 相机+LiDAR+Radar融合 |
| 场景流 | Scene Flow | 3D点云的运动场 |
| 轨迹预测 | Trajectory Prediction | 预测目标未来运动 |
| 世界模型 | World Model | 预测动作后果的模型 |
| 在线建图 | Online Mapping | 实时构建局部地图 |
| 数据闭环 | Data Engine | 采集-标注-训练循环 |
| 影子模式 | Shadow Mode | 静默运行对比人类驾驶 |

---

## 参考资源

### 论文

- BEVFormer: Learning Bird's-Eye-View Representation (2022)
- UniAD: Planning-oriented Autonomous Driving (2023, CVPR Best)
- VAD: Vectorized Scene Representation for Efficient AD (2023)
- BEVFusion: Multi-Task Multi-Sensor Fusion with BEV (2022)
- TPVFormer: Tri-Perspective View for Vision-Based 3D (2023)
- GAIA-1: A Generative World Model for AD (2023)
- DriveVLM: The Convergence of AD and VLM (2024)

### 开源项目

- BEVFormer: github.com/fundamentalvision/BEVFormer
- UniAD: github.com/OpenDriveLab/UniAD
- mmdetection3d: github.com/open-mmlab/mmdetection3d
- OpenPilot: github.com/commaai/openpilot
- nuScenes devkit: github.com/nutonomy/nuscenes-devkit

### 数据集

- nuScenes: nuscenes.org
- Waymo Open Dataset: waymo.com/open
- Argoverse 2: argoverse.org
- ONCE: once-for-auto-driving.github.io

---

> **总结**: 自动驾驶感知正经历从"模块化感知"到"端到端智能"的范式转变。2026年的三大核心趋势: (1) 端到端成为量产主流，Tesla/华为/小鹏已落地; (2) 世界模型赋能仿真与规划; (3) 大模型(VLM)处理长尾场景。技术栈上，BEV+Occupancy+端到端+世界模型构成完整技术体系。产业上，中美两强格局明确，纯视觉vs多传感器路线之争仍将持续。
