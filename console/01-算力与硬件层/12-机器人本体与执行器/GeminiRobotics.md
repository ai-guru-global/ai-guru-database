---
层: 01-算力与硬件层
节点: 12-机器人本体与执行器
类型: 学习页
状态: 活跃
更新: 2026-08-31
证据: 证据层/具身智能/GeminiRobotics.md
---

# GeminiRobotics

> Google DeepMind 的机器人基础模型主线：把 Gemini 的多模态理解移植到物理世界，从视觉理解走到「全身智能」控制。

## 是什么

Gemini Robotics 是 DeepMind 将 Gemini 多模态模型能力迁移到机器人领域的产品线，与 Apptronik 等硬件伙伴合作，定位为「机器人时代的 Android」。产品分两条线：Gemini Robotics（视觉-语言-动作模型，直接输出控制）与 Gemini Robotics ER（Embodied Reasoning，嵌入机器人控制系统的推理层）。

2026 年该线进入第二代：Robotics 2 主打「全身智能」（whole-body intelligence），ER 2 加入视频理解、任务编排与多机器人协作。该线索追踪其模型迭代与商业化落地。

### 2026-07

- **2026-07-30** · [Gemini Robotics 2 / ER 2 发布](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/)
  第二代平台：全身智能控制（高灵巧操作 + 安全性提升）；ER 2 新增视频理解、任务编排与多机器人协作（The Verge、Engadget、Ars Technica、Axios 多源报道）。

### 2026-06

- **2026-06-12** · [DeepMind 机器人加速器启动，首批 15 家初创公司](https://aihot.virxact.com/items/cmqatz4nc0otgslld30imx725)
  DeepMind 官方宣布机器人方向加速器开跑，首批 15 家初创公司接入其机器人模型栈——「平台 + 扶植生态」的 Android 式路线从模型发布延伸到应用层。

### 2026-04

- **2026-04-14** · [Gemini Robotics-ER 1.6 发布](https://aihot.virxact.com/items/cmnys6sen00iwsl0foeekwbol)
  官方博客发布 ER 线迭代：通过增强具身推理让真实世界机器人任务更可靠——ER 线沿 1.5 → 1.6 → ER 2 小步快跑，为下游厂商持续升级「大脑外挂」。

### 2025-03

- **2025-03** · Gemini Robotics 与 ER 1.5 首次发布
  DeepMind 与 Apptronik 合作，把 Gemini 2.0 的多模态能力带入机器人：VLA 模型直接输出动作，ER 版本嵌入第三方控制系统，确立「双线产品」架构。

## 怎么看

1. **「大厂平台化」路径的代表性样本**：DeepMind 不自造机器人本体，而是把模型做成可嵌入各类硬件的平台（对标 Android 模式），与 Figure/特斯拉的「自研本体 + 自研模型」垂直路线形成两种范式竞争。

2. **ER 与 VLA 双线并行是聪明的分层**：ER 让现有机器人厂商以最低改造成本接入 Gemini 推理能力，快速铺开生态；VLA 线则押注端到端控制的长期上限——既赚当下的生态位，也不放弃终局。

3. **从演示到「全身智能」的工程化转折**：第二代主打全身协调与安全性，说明竞争重心从「能不能做任务」转向「能不能稳定、安全地在真实产线运行」——物理 AI 进入可用性竞赛阶段。

## 关键锚点

- **2026-07-30** · [Gemini Robotics 2 / ER 2 发布](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/)
- **2026-06-12** · [DeepMind 机器人加速器启动，首批 15 家初创公司](https://aihot.virxact.com/items/cmqatz4nc0otgslld30imx725)
- **2026-04-14** · [Gemini Robotics-ER 1.6 发布](https://aihot.virxact.com/items/cmnys6sen00iwsl0foeekwbol)
- **2025-03** · Gemini Robotics 与 ER 1.5 首次发布

## 下钻

- [证据时间线（原始线索卡）](../../../证据层/具身智能/GeminiRobotics.md)
- [具身智能/Figure](../../../证据层/具身智能/Figure.md)
- [具身智能/特斯拉Optimus](../../../证据层/具身智能/特斯拉Optimus.md)
- [世界模型/Genie](../../../证据层/世界模型/Genie.md)
