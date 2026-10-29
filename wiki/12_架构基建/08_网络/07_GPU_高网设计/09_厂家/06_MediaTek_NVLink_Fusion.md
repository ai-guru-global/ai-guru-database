---
title: "联发科与 NVLink Fusion"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["gpu-network", "mediatek", "nvlink-fusion", "asic"]
summary: "拆解联发科作为首批 NVLink Fusion 合作伙伴的角色：为云厂商/ODM 定制接入 NVLink 生态的 CPU 与 ASIC，及其对 NVLink 生态开放化的意义。"
created: 2026-10-27
updated: 2026-10-27
tier: supporting
aliases: ["联发科 NVLink Fusion", "MediaTek NVLink Fusion"]
sources: []
name_zh: "联发科与 NVLink Fusion"
---

# 联发科与 NVLink Fusion

> 中文简称：联发科与 NVLink Fusion

> **一句话理解**: 联发科帮云厂商和 ODM 定制"能接进 NVLink 机架"的芯片——NVLink 从 NVIDIA 自家封闭互连变成可授权生态，联发科是第一批拿到钥匙的人。

---

## 一、Computex 2025：首批 NVLink Fusion 合作伙伴

Computex 2025 上 NVIDIA 发布 NVLink Fusion：把 NVLink/NVSwitch 互连向第三方芯片开放授权。联发科（MediaTek）与 Marvell 同列首批合作伙伴，围绕两者的是一串 IP/EDA 与整机伙伴（Synopsys、Cadence 等）与 ODM（鸿海、广达、纬创等）。

首批伙伴的构成透露了 NVIDIA 的意图：

- **芯片设计伙伴**（MediaTek、Marvell）：负责把第三方 CPU/ASIC 接入 NVLink，是生态的"接口施工方"。
- **IP/EDA 伙伴**：提供设计 IP 与工具链支持，降低接入门槛。
- **ODM 整机伙伴**：负责 NVLink Fusion 机架的制造交付，保证产能落地。
- **名单里没有 GPU 竞争对手**：授权对象是"互补品"（CPU、定制 ASIC、连接器件）而非"替代品"，开放边界经过精心设计。

对 NVIDIA，这是防守 UALink 开放阵营的主动开放化；对联发科，这是从手机 SoC 厂商跨入数据中心 AI 芯片定制领域的入场券——两个动机在 2025 年 Computex 的舞台上合流。

时间点也值得玩味：NVLink Fusion 发布在 UALink 1.0 规范（2025-04）之后约一个月（Computex 2025-05），开放阵营每前进一步，NVIDIA 的授权口子就跟着松一格。

---

## 二、角色：把 NVLink 从封闭互连变成可授权生态

NVLink 原本是"只连 NVIDIA 自家芯片"的私有互连。NVLink Fusion 之后，第三方 CPU、自研加速器（ASIC）可以通过授权接口接入 NVSwitch 机架域：

```text
NVLink Fusion 生态角色分工（示意）
NVIDIA      ：NVLink/NVSwitch 授权方、机架规范定义者
MediaTek    ：定制 CPU/ASIC 接入 NVLink（芯片设计服务）
Marvell     ：互连接入芯片 + 定制 ASIC 双角色
IP/EDA 伙伴 ：设计 IP 与工具链支持
ODM         ：NVLink Fusion 机架整机集成
```

- 没有这一层授权，云厂商自研 ASIC 只能留在标准以太/UALink 阵营；有了它，"自研加速器 + NVLink 机架"成为混合选项。
- 生态意义：NVLink 从垂直封闭走向"核心私有 + 接口授权"的半开放模式——类似当年 x86 授权史的某种重演，但主导权始终在 NVIDIA 手里。
- 与 UALink 的开放方式对比：联盟规范人人可读、任何人可实现；NVLink Fusion 是双边商业授权——"开放"一词在两个语境下含义并不相同。

判断半开放生态的成色有个简单办法：看第三方芯片真正流片量产的时间，而不是合作宣布的时间——前者才算生态兑现。

---

## 三、既有合作基础：GB10 Grace Blackwell 超级芯片

- 联发科与 NVIDIA 的合作不是从零开始：GB10 Grace Blackwell 超级芯片（Project DIGITS，后演进为 DGX Spark 类桌面超算）即由联发科与 NVIDIA 联合设计，MediaTek 在其中承担了重要的芯片协同设计角色。
- GB10 的定位是桌面级 AI 超算：把 Grace + Blackwell 的组合塞进小体积整机，面向开发者与工作站场景，是 NVLink 生态向小规模延伸的产品。
- GB10 证明了联发科有能力在 NVIDIA 的旗舰平台上做复杂 SoC 协同设计——这是被选为 NVLink Fusion 首批伙伴的信任基础。
- 对联发科，这条合作线把其工程能力从消费电子量级带入数据中心级质量标准（可靠性、长供货、企业级验证）。

这条合作线的信号价值大于营收价值：GB10 本身是小众产品，但它让联发科的团队完整走过了 NVIDIA 旗舰平台的开发与验证流程——这种经验买不来。桌面超算虽然量小，却是开发者第一次能在桌面摸到 NVLink 级互连的载体，生态渗透往往从开发者桌面开始。

---

## 四、ASIC 定制性价比与台系供应链地位

**表：NVLink Fusion 生态中的角色与贡献**

| 角色 | 代表 | 贡献 |
| --- | --- | --- |
| **标准与授权方** | NVIDIA | NVLink/NVSwitch 授权、机架规范 |
| **定制芯片伙伴** | MediaTek、Marvell | 定制 CPU/ASIC 及 NVLink 接入设计 |
| **IP/EDA 伙伴** | Synopsys、Cadence 等 | 设计 IP 与工具链 |
| **整机集成** | 鸿海、广达、纬创等 | 机架制造与交付 |

- 联发科的核心竞争力是 ASIC 定制性价比：台湾系芯片设计工程人力成本低于美国大厂，且习惯低毛利、大批量的运营模式，与云厂商定制 ASIC 的成本诉求高度匹配。
- 台系供应链地位（与 ODM 鸿海/广达/纬创的长期协作关系）让"联发科定制芯片 + ODM 整机"的打包交付路径顺畅，这是美国 EDA/芯片厂不易复制的组合。
- 定制 ASIC 的商业模式通常按"设计费 + 量产分成"组织，对联发科意味着收入弹性取决于客户芯片放量速度，而非自身产品定价权。
- 需要克制预期：NVLink Fusion 定制芯片的规格、代际与商业条款均未完全公开，采购判断应以 NVIDIA 与伙伴的正式产品公告为准。

与 Marvell 的分工差异值得注意：Marvell 更偏互连接入芯片与网络侧 ASIC，联发科更偏 CPU/SoC 协同设计与整机级整合，两家在生态位上互补多于竞争。云厂商的算盘则是用联发科等设计服务压低定制成本，同时保留"接入 NVLink"与"走开放标准"的双向选择权。

---

## 五、意义与风险：授权边界由 NVIDIA 掌控

**意义**：

- NVLink 生态扩大：接入芯片种类变多，NVSwitch 机架体系对自研 ASIC 的云厂商更有吸引力。
- 客户侧多了一个中间态：不必在"NVIDIA 全套"与"全开放阵营"之间二选一，可以"自研计算 + 授权互连"混合组网。
- 对国内供应链而言，台系设计 + 台系制造的组合在地理与产能上形成一支独立于美系 vendor 的交付力量。

**风险**：

- 授权边界（谁能接入、接入哪一层、条款如何）完全由 NVIDIA 单方掌控，伙伴与客户的议价能力天然不对称。
- 生态繁荣与否取决于 NVIDIA 的节奏：授权收缩、版本迭代放缓或定价变化都可能让伙伴投资悬空。
- 对联发科而言，这条线的收入规模取决于云厂商定制需求兑现速度，存在不确定性。

---

## 六、对联发科估值与 AI 叙事的影响

- 联发科的传统叙事是手机 SoC 与边缘芯片，数据中心存在感长期缺位；NVLink Fusion + GB10 组合第一次给了它"数据中心 AI 芯片设计服务"的市场身份。
- 资本市场对这类身份切换通常给予估值溢价：AI 叙事从"消费电子周期股"切换到"AI 基础设施参与者"，即便收入兑现滞后，估值锚也会先变。
- 冷静看：定制芯片服务是"卖工时与良率"的生意，毛利与话语权都低于 IP/标准持有方；联发科在 NVLink Fusion 生态中的长期位置取决于能否从"设计代工"升级到"平台伙伴"。
- 观察指标比叙事更有用：后续是否有公开的云厂商定制芯片落地案例、GB10 类合作是否延续到下一代平台，是判断这条线成色的两个硬信号。
- 对同行的启示：NVLink Fusion 展示了"借生态上位"的路径——不必从零对抗 CUDA，先做生态的施工方，再图平台化。

对观察者的一句话：把联发科当作 NVLink Fusion 生态的"工程成色试纸"——它的定制项目推进速度，比任何发布会都更真实地反映 NVIDIA 开放化的诚意。

---

## 交叉引用

- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/04_NVLink_Fusion|NVLink Fusion]]
- [[12_架构基建/08_网络/07_GPU_高网设计/01_分层体系/01_Scale_Up_NVLink_NVSwitch|Scale-up：NVLink 与 NVSwitch]]
- [[12_架构基建/08_网络/07_GPU_高网设计/09_厂家/01_NVIDIA_Networking_Stack|NVIDIA 网络全栈]]
- [[12_架构基建/08_网络/07_GPU_高网设计/09_厂家/04_Marvell_Networking_Optics|Marvell 网络与光互连]]
- [[12_架构基建/08_网络/07_GPU_高网设计/10_视角/05_Vendor_Selection_Angle|厂家选型视角]]

---

*Last updated: 2026-10-27*
