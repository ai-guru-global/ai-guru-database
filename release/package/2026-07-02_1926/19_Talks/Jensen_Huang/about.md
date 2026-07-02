---
title: Jensen Huang 简介 (Jensen Huang)
category: 19-talks-jensen-huang
tags: ["talks", "speeches", "insights", "leaders", "NVIDIA", "GPU", "accelerated-computing", "physical-AI"]
summary: "NVIDIA 联合创始人兼 CEO，用 GPU 重新定义了 AI 计算基础设施的芯片 visionary。"
created: 2026-05-31
updated: 2026-06-05
tier: supporting
aliases:
  - About
sources: []

---
# Jensen Huang 简介 (Jensen Huang)

## 一句话概括

> NVIDIA 联合创始人兼 CEO——用 GPU 加速计算重新定义了 AI 基础设施，让"每家公司都成为 AI 公司"的愿景成为现实。

---

## 核心贡献 (Key Contributions)

- **GPU 通用计算平台 (CUDA) 的缔造者**: 2006 年推出 CUDA 平台，将 GPU 从图形处理器转型为通用并行计算引擎，为深度学习革命奠定了硬件基础。截至 2025 年，全球超过 400 万开发者使用 CUDA 生态。
- **AI 数据中心革命的推动者**: 推动 NVIDIA 从游戏显卡公司转型为 AI 基础设施巨头，H100/H200/B100/B200/GB200 系列 GPU 成为全球 AI 训练和推理的核心算力，数据中心业务占 NVIDIA 营收超 80%。
- **加速计算全栈战略**: 构建从芯片（GPU/Grace CPU/Blackwell/NVLink）到系统（DGX/HGX）到软件（CUDA/TensorRT/Triton）到平台（NVIDIA AI Enterprise/Omniverse）的完整 AI 计算栈。
- **"AI 工厂"概念的提出者**: 将数据中心重新定义为"AI 工厂"——输入数据和电力，输出智能。提出"每个行业都将拥有自己的 AI 工厂"的产业愿景。
- **数字孪生与工业 AI**: 推动 Omniverse 平台，将 AI 与物理模拟结合，应用于自动驾驶训练、机器人仿真、工厂数字孪生等场景。
- **Physical AI 与机器人**: 推动 NVIDIA Isaac 机器人平台和 Cosmos 世界基础模型，为自动驾驶、人形机器人和工业智能提供端到端解决方案。

---

## 代表性演讲 (Notable Talks & Papers)

### 1. GTC 2023 主题演讲 (2023.03)

> *"Accelerated computing and generative AI mark a new industrial revolution."*
> *"加速计算与生成式 AI 代表新的工业革命。"*

- **核心要点**: 宣布 AI 的"iPhone 时刻"已到来，展示 NVIDIA 全栈 AI 平台，提出"每家公司都是 AI 公司"愿景
- **来源**: [NVIDIA GTC 2023 Keynote](https://www.nvidia.com/gtc/)
- **影响**: NVIDIA 股价在演讲后数周内上涨超 40%，AI 基础设施投资热潮全面爆发

### 2. GTC 2024 主题演讲 (2024.03)

> *"Every company will be an intelligence manufacturer."*
> *"每家公司都会成为智能制造商。"*

- **核心要点**: 发布 Blackwell 架构（B200/GB200），展示"AI 工厂"概念，强调推理侧的算力需求将超过训练侧
- **来源**: [NVIDIA GTC 2024 Keynote](https://www.nvidia.com/en-us/gtc/keynote/)
- **影响**: 进一步确立 NVIDIA 在 AI 基础设施领域的垄断地位

### 3. GTC 2025 / Computex 2025 主题演讲 (2025)

> *"The next wave of AI is physical AI — robots that understand and interact with the real world."*
> *"AI 的下一波浪潮是物理 AI——理解并与真实世界交互的机器人。"*

- **核心要点**: 发布 NVIDIA Isaac 机器人平台升级、Cosmos 世界基础模型、Omniverse 工业 AI 新能力，展示"Physical AI"完整愿景
- **来源**: [NVIDIA GTC 2025 Keynote](https://www.nvidia.com/en-us/gtc/keynote/)
- **影响**: 将"Physical AI"从概念推向产业化，推动机器人和自动驾驶领域的新一轮投资

---

## 技术观点 (Technical Positions & Beliefs)

### Scaling vs 效率

Jensen Huang 是"算力 Scaling"最坚定的布道者。他的核心论点是："AI 需要算力基建，买更多 GPU！"他认为模型规模的增长远未触顶，同时强调推理侧的计算扩展（inference-time scaling）将创造比训练更大的算力需求。NVIDIA 的产品路线图（每年一个新架构）本身就是对"规模信仰"的硬件表达。这一立场与 [[19_Talks/Sam_Altman/about]] 的 Scaling Laws 信仰高度一致。

### 开源 vs 闭源

Huang 在开源问题上采取务实立场。NVIDIA 大力推动 CUDA 生态的开放（开源工具、SDK、框架如 TensorRT-LLM），但核心驱动（CUDA Runtime）保持闭源，形成"开放上层、锁定底层"的商业策略。他支持 AI 模型的开源，认为更多开发者使用 AI 将带动更多 GPU 需求。

### AI 安全

Huang 属于"实用主义派"，认为 AI 安全应通过技术迭代而非暂停来解决。他在多次采访中表示"AI 安全是一个持续优化的工程问题"，反对暂停 AI 开发的呼吁。此立场与 [[19_Talks/Dario_Amodei/about]] 的"安全优先"形成对比。

### 物理 AI (Physical AI)

2025-2026 年 Huang 最频繁推广的概念。他认为 AI 的下一个前沿不是纯数字世界，而是理解和操控物理世界的机器人——自动驾驶、工业机器人、数字孪生工厂。NVIDIA Cosmos 世界基础模型是实现 Physical AI 的核心技术基座。

### 数据中心架构与网络

Huang 将数据中心视为 AI 时代的"工厂"，其核心产品不仅是 GPU 芯片，更是完整的系统级解决方案。NVLink/NVSwitch 高速互联、DGX SuperPOD 集群架构、Spectrum-X 网络平台等技术创新，使 NVIDIA 从芯片供应商升级为"AI 基础设施全栈提供商"。他强调未来的 AI 数据中心将是"token 工厂"——将电力转化为智能 token。

---

## 公司/团队 (Current Role & Organization)

| 项目 | 详情 |
|------|------|
| **当前职位** | NVIDIA 联合创始人、总裁兼 CEO（1993 年至今） |
| **公司总部** | 美国加利福尼亚州圣克拉拉 |
| **公司使命** | "加速计算解决世界上最困难的问题" (Accelerate computing to solve the world's most challenging problems) |
| **关键产品** | H100/H200/B200/GB200 GPU、DGX 系统、CUDA 平台、Omniverse、TensorRT、Isaac、Cosmos |
| **市场地位** | 全球 AI 训练/推理 GPU 市场份额超 80%；公司市值一度突破 $3.5T |
| **员工规模** | 约 32,000+（截至 2025 年） |
| **个人荣誉** | IEEE 创始人奖章 (2020)、《时代》杂志年度人物候选人、总统自由勋章 (2025) |

---

## 名言金句 (Memorable Quotes)

1. **"Accelerated computing and generative AI mark a new industrial revolution."**
   *"加速计算与生成式 AI 代表新的工业革命。"*
   -- GTC 2023 Keynote

2. **"Every company will be an intelligence manufacturer."**
   *"每家公司都会成为智能制造商。"*
   -- GTC 2024 采访

3. **"Buy more GPUs! AI needs compute infrastructure."**
   *"买更多 GPU！AI 需要算力基建。"*
   -- 多次公开场合引用

4. **"The next wave of AI is physical AI — robots that understand and interact with the real world."**
   *"AI 的下一波浪潮是物理 AI——理解并与真实世界交互的机器人。"*
   -- GTC 2025 / Computex 2025 Keynote

5. **"The more you buy, the more you save."**
   *"买得越多，省得越多。"*
   -- GTC 2024，以幽默方式论证 GPU 投资的 ROI

---

## 交叉引用 (Cross-References)

- [Talks 主题合成 2026](19_Talks/Talks_Synthesis_2026.md) -- Scaling Laws、AI 安全、中国 AI 与全球格局等主题中 Huang 的立场
- [Jensen Huang 金句集](19_Talks/Jensen_Huang/sayings.md) -- 更多金句与权威来源链接
- [AI 历史时间线](00_AI_Introduction/AI_History_Timeline.md) -- CUDA 发布与 GPU 计算革命
- [AI 未来趋势](00_AI_Introduction/AI_Future_Trends.md) -- "AI 工厂"与"物理 AI"趋势预判
- [架构与基础设施](../../12_Architecture_Infrastructure/README.md) -- GPU 集群、数据中心与 AI 计算架构
- [模型训练](../../07_Model_Training/README.md) -- 大规模分布式训练与 GPU 算力需求
- [部署与推理](../../10_Deployment_Inference/README.md) -- 推理优化与 GPU 推理引擎
- [机器人系统](../../11_MLOps_Pipeline/README.md) -- Physical AI、Isaac 平台与机器人仿真
- [Sam Altman](19_Talks/Jensen_Huang/about.md) -- Scaling Laws 信仰与算力需求共识
- [Demis Hassabis](19_Talks/Jensen_Huang/about.md) -- AI for Science 与 GPU 算力支撑
- [Yann LeCun](19_Talks/Jensen_Huang/about.md) -- 开源模型生态与 CUDA 开发者平台

---

## 最新动态与权威来源 (Latest Updates & Sources)

- **官方简介**: [NVIDIA Newsroom - Jensen Huang Bio](https://nvidianews.nvidia.com/bios/jensen-huang)
- **公司概览**: [About NVIDIA](https://www.nvidia.com/en-us/about-nvidia/)
- **GTC 大会**: [NVIDIA GTC](https://www.nvidia.com/gtc/)
- **技术博客**: [NVIDIA Blog](https://blogs.nvidia.com/)
- **Cosmos 世界模型**: [NVIDIA Cosmos](https://developer.nvidia.com/cosmos)

---

*Last updated: 2026-06-05*

## Related

- [[19_Talks/Jensen_Huang/sayings]] -- Jensen Huang 关于 AI 的观点 (Jensen Huang on AI)
- [[19_Talks/Sam_Altman/about]] -- Sam Altman 简介 (共享: scaling, AI infrastructure demand)
- [[19_Talks/Satya_Nadella/about]] -- Satya Nadella 简介 (共享: Azure + NVIDIA cloud partnership)
- [[19_Talks/Andrej_Karpathy/about]] -- Andrej Karpathy 简介 (共享: insights, leaders, speeches, talks)
- [[19_Talks/Andrew_Ng/about]] -- Andrew Ng 简介 (共享: insights, leaders, speeches, talks)
- [[19_Talks/Bill_Gates/about]] -- Bill Gates 简介 (共享: insights, leaders, speeches, talks)
