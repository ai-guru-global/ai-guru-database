---
线索: Genie
主题: 世界模型
别名: [Genie 2, Genie 3, 交互式世界模型]
状态: 活跃
创建: 2026-07-30
更新: 2026-09-04
关键角色: [Google DeepMind]
---

# Genie

> DeepMind 的交互式世界模型系列：从 2D 游戏生成到可实时游玩的 3D 世界，世界模型路线的技术标杆。

## 概述

Genie 是 Google DeepMind 的「生成式交互环境（Generative Interactive Environments）」系列模型：不只是生成视频，而是生成可以被动作控制的世界——用户/智能体输入动作，模型实时生成下一帧的世界状态。它被 DeepMind 定位为通向 AGI 的关键组件（为具身智能体提供无限训练环境）。

该线索追踪 Genie 系列的迭代与世界模型赛道（含 World Labs、NVIDIA Cosmos 等）的路线竞争。

### 2026-08

- **2026-08-31** · [Runway 发布 Interface World Models 首个模型 Solaris，实时逐帧生成可交互界面](https://aihot.virxact.com/items/cmthhmoi10e71rodmx6wngoz1)
  Runway 官方发布 Interface World Models 系列首个模型 Solaris，实时逐帧生成可交互界面——继 6 月设立世界模型研究中心后正式交卷，视频生成头部厂商与 Genie 的「生成可交互世界」路线正面交汇。

### 2026-07

- **2026-07-20** · [NVIDIA 发布 Cosmos 3 Edge：4B 参数开源世界模型](https://aihot.virxact.com/items/cmrtgmuyf3366bitl3gnpc8eo)
  为机器人及边缘 AI 提供实时推理与动作生成，NVIDIA 物理 AI 世界模型平台向端侧下沉。
- **2026-07-20** · [昆仑万维发布并开源可交互世界模型 Matrix-Game 3.5](https://aihot.virxact.com/items/cmrtal6bt1vmsbitl1mta8hxg)
  官方同期宣布 2026 为「世界模型元年」（7 月 19 日官方公众号），中国厂商加速入场世界模型赛道。

### 2026-05

- **2026-05-22** · [Project Genie 与谷歌街景合作推出交互式世界](https://aihot.virxact.com/items/cmph294ju0ko5sljwmb0hxida)
  Google DeepMind 官方宣布，Genie 世界模型接入谷歌街景，可交互探索真实地点生成的世界。

### 2026-01

- **2026-01-29** · [Project Genie（Genie 3）向公众开放](https://mashable.com/article/google-launches-project-genie-3-how-to-try)
  Genie 3 世界模型通过 Project Genie 网页界面向 Google AI Ultra（$249.99）美国订阅用户（18 岁+）推出，可从文本生成可探索的交互式 3D 环境。这是 Genie 系列首次面向消费者开放。

### 2025-08

- **2025-08** · [Genie 3 发布](https://deepmind.google/discover/blog/)
  实时 720p/24fps 交互式世界生成，环境一致性保持数分钟，支持文本事件注入（如「下雨」）；与 SIMA 智能体结合形成「世界模型训练 Agent」闭环，被广泛视为世界模型路线的里程碑。

### 2024-12

- **2024-12-04** · [Genie 2 发布](https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/)
  单张图像即可生成可交互 3D 世界（键鼠控制），物理效果、光影、NPC 行为涌现，最长交互约一分钟——从 2D 平台跳跃到 3D 具身环境的跨越。

### 2024-03

- **2024-03** · SIMA 通用游戏智能体发布
  在多款商业 3D 游戏中执行自然语言指令的通用 Agent，与 Genie 构成 DeepMind「环境 + 智能体」双线布局。

### 2024-02

- **2024-02** · Genie 1 论文发布
  11B 参数模型，从 20 万小时无标注游戏视频中无监督学出「潜在动作空间」——证明世界的可控性可以从纯视频中涌现，奠定系列方法论。

## 分析

1. **世界模型的两条路线**：Sora 代表「生成视频顺便理解世界」，Genie 代表「生成可交互世界本身」。后者直接服务具身智能训练（无限模拟环境 = 具身数据引擎），商业与研究价值路径更清晰。

2. **具身智能的数据答案**：机器人领域最大瓶颈是真实交互数据稀缺，Genie 式世界模型若足够逼真，将把具身训练从「真机采数据」解放为「模拟中无限试错」——这是 DeepMind 押注的战略逻辑。

3. **赛道快速拥挤**：李飞飞的 World Labs（空间智能）、NVIDIA Cosmos（物理 AI 平台）、Decart/Odyssey 等创业公司相继入场，世界模型已从学术概念升格为公认的下一代平台竞争点。

## 关联线索

- [[世界模型/WorldLabs]]
- [[多模态大模型/Sora]]
- [[具身智能/Figure]]
