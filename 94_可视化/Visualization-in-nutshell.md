---
title: "AI 可视化速览 (AI Visualization in a Nutshell)"
category: 94-visualization
tags: [visualization, tensorboard, wandb, embedding-viz, attention-viz, dashboard]
summary: "AI 可视化四大子域速览：训练监控、评估解释、系统监控与最佳实践，附工具选型表和图表选择决策指南。"
created: 2026-07-27
updated: 2026-07-27
tier: supporting
aliases:
  - "AI Visualization in nutshell"
  - "AI 可视化速览"
sources: []

name_zh: "AI 可视化速览"
---
# AI 可视化速览 (AI Visualization in a Nutshell)

> 中文简称：AI 可视化速览

> **一句话理解**: 可视化是 AI 工程师的"仪表盘"——模型训不训得动、好不好、跑得稳不稳，一张图看清比一堆日志好用一百倍。

---

## TL;DR

- **四大子域**: 训练可视化（曲线/embedding）、评估可视化（混淆矩阵/注意力）、系统可视化（架构/推理服务）、最佳实践（图表设计原则）
- **工具三层**: 实验跟踪（TensorBoard/W&B）→ 通用图表（Matplotlib/Plotly）→ 定制交互（D3.js）
- **降维双雄**: t-SNE 看局部聚类，UMAP 兼顾全局结构——embedding 可视化必备
- **训练三张图**: loss 曲线、学习率调度、梯度范数——90% 的训练问题都能从中定位
- **解释性可视化**: 注意力热图、Grad-CAM、SHAP 让黑盒模型"开口说话"
- **原则第一**: 图表类型服从数据关系（比较/分布/构成/关联），少即是多

```mermaid
flowchart TB
    subgraph 训练阶段
        T1[Loss/指标曲线] --> T2[Embedding 投影]
        T2 --> T3[实验跟踪对比]
    end
    subgraph 评估阶段
        E1[混淆矩阵/PR 曲线] --> E2[注意力热图]
        E2 --> E3[可解释性 SHAP/Grad-CAM]
    end
    subgraph 生产阶段
        S1[系统 Dashboard] --> S2[推理服务监控]
        S2 --> S3[知识图谱/架构图]
    end
    训练阶段 --> 评估阶段 --> 生产阶段
```

---

## 1. 四大子域导航

| 子域 | 解决什么问题 | 代表内容 | 入口 |
|------|--------------|----------|------|
| Training_Viz | 训练过程透明化 | 训练曲线、embedding、实验跟踪 | [[94_可视化/Training_Viz/index\|训练可视化]] |
| Evaluation_Viz | 模型好坏与为什么 | 注意力、降维、可解释性 | [[94_可视化/Evaluation_Viz/index\|评估可视化]] |
| System_Viz | 系统状态一目了然 | Dashboard、推理监控、架构图 | [[94_可视化/System_Viz/index\|系统可视化]] |
| Best_Practices | 图做得对不对 | 图表选型、配色、反模式 | [[94_可视化/Best_Practices/index\|最佳实践]] |

---

## 2. 工具选型速查

| 工具 | 定位 | 适用场景 | 不适用 |
|------|------|----------|--------|
| TensorBoard | 训练标配 | loss 曲线、直方图、embedding projector | 多人协作对比 |
| Weights & Biases | 实验管理 | 超参扫描、团队协作、报告 | 离线/内网受限环境 |
| Matplotlib/Seaborn | 论文图表 | 静态出版级图表 | 交互探索 |
| Plotly | 交互图表 | Notebook 交互、Web Dashboard | 超大规模数据点 |
| D3.js | 完全定制 | 知识图谱、定制交互叙事 | 快速出图 |
| Grafana | 生产监控 | GPU/延迟/吞吐实时面板 | 模型内部可解释性 |

---

## 3. 训练可视化三张图

| 图 | 看什么 | 异常信号 → 诊断 |
|----|--------|-----------------|
| Loss 曲线 | 收敛趋势、train/val 间距 | 间距拉大 → 过拟合；不降 → 学习率/数据问题 |
| 学习率调度 | warmup 与衰减是否符合预期 | loss 尖刺常与 LR 突变对齐 |
| 梯度范数 | 数值稳定性 | 爆炸 → 加 clip；趋零 → 梯度消失/死层 |

深入: [[94_可视化/Training_Viz/Training_Curves_Analysis|训练曲线分析]] · [[94_可视化/Training_Viz/Training_Monitoring_Visualization|训练监控可视化]] · [[94_可视化/Training_Viz/Experiment_Tracking_Visualization|实验跟踪可视化]]

---

## 4. 评估与解释可视化

| 技术 | 回答的问题 | 入口 |
|------|-----------|------|
| 注意力热图 | 模型在"看"哪里 | [[94_可视化/Evaluation_Viz/Attention_Visualization_Guide\|注意力可视化指南]] |
| t-SNE / UMAP | embedding 空间长什么样 | [[94_可视化/Evaluation_Viz/Dimensionality_Reduction_Viz\|降维可视化]] |
| SHAP / Grad-CAM | 哪个特征/像素决定了预测 | [[94_可视化/Evaluation_Viz/Model_Interpretability_Visualization\|可解释性可视化]] |
| 混淆矩阵 / PR 曲线 | 错在哪一类、阈值怎么选 | [[94_可视化/Evaluation_Viz/Evaluation_Visualization_Guide\|评估可视化指南]] |

> t-SNE vs UMAP 一句话：**t-SNE 局部聚类更漂亮，UMAP 更快且全局距离更可信**；两者的簇间距离都不能过度解读。

---

## 5. 图表选择决策

| 数据关系 | 推荐图表 | 反模式 |
|----------|----------|--------|
| 比较 | 条形图、雷达图 | 3D 柱状图（视觉欺骗） |
| 分布 | 直方图、箱线图、小提琴图 | 只报均值不看分布 |
| 构成 | 堆叠条形、Treemap | 超过 5 类的饼图 |
| 关联 | 散点图、热力图 | 双 Y 轴暗示因果 |
| 演化 | 折线图、面积图 | 截断 Y 轴夸大趋势 |

完整原则: [[94_可视化/Best_Practices/Data_Visualization_Best_Practices|数据可视化最佳实践]]

---

## 延伸阅读 (Further Reading)

| 主题 | 说明 | 入口 |
|------|------|------|
| 神经网络结构图 | 网络结构绘制方法 | [[94_可视化/Training_Viz/Neural_Network_Visualization_Guide|网络可视化指南]] |
| Embedding 可视化 | 词向量/句向量投影 | [[94_可视化/Training_Viz/Embedding_Visualization_Guide|Embedding 指南]] |
| 系统 Dashboard | AI 系统监控面板设计 | [[94_可视化/System_Viz/AI_System_Dashboard|AI 系统 Dashboard]] |
| 推理服务监控 | 延迟/吞吐/GPU 可视化 | [[94_可视化/System_Viz/Inference_Serving_Visualization|推理服务可视化]] |

---

*Last updated: 2026-07-27*

## 相关链接

- [[94_可视化/index|可视化首页]] — 章节总览
- [[94_可视化/README_for_dummy|可视化小白指南]] — 零基础版
- [[07_模型训练/index|模型训练]] — 训练监控的上游
- [[08_模型评估/index|模型评估]] — 评估可视化的上游
- [[11_模型运维/index|模型运维]] — 生产监控体系
