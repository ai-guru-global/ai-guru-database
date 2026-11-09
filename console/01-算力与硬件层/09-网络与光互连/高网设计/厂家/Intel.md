---
层: 厂家
域: 厂家
更新: 2026-10-27
---

# Intel × GPU 高网

> XPU 与开放互联的联合推动者：Gaudi 走标准以太网组网证明「无私有 fabric」可行，UALink 联合主导，但在 AI 网络芯片上的存在感弱于 Broadcom/NVIDIA。

## 在 GPU 高网中的角色

- 开放互联的联合旗手：与 AMD 共同主导 UALink，试图在 scale-up 层建立对 NVLink 的开放替代。
- 以太网原教旨路线的实证者：Gaudi 3 用标准 RoCE v2 + OAM 形态组 AI 集群，官方口径支持单机架 96 卡以太网组网，证明 AI 后端网络可以完全建在通用以太网上。
- 网络存在感偏弱：交换芯片（Tofino）投入收缩，AI 网络重心在 NIC/IPU 与标准组织，而非与 Broadcom/NVIDIA 正面竞争交换或 fabric。
- Barefoot/Tofino 的教训：可编程交换的差异化未能兑换成数据中心主流份额，投入收缩（报道口径，待核实）。
- 标准+生态打法：在 UALink（scale-up）、UEC（scale-out）、UCIe（die-to-die）三线均有席位，是开放互联覆盖面最广的玩家之一。

## 产品谱系

| 分组 | 代际 | 规格与锚点 |
|---|---|---|
| AI 加速器 | Gaudi 2（2022） | OAM 形态，板载 100G 以太网组网（公开口径） |
| | Gaudi 3（2024） | OAM 形态；官方口径单机架 96 卡以太网组网；片上集成 200G RoCE 网卡（口径待核实） |
| | Gaudi 后续路线 | Falcon Shores 公开口径转为内部测试芯片（2024 末报道），下一代代号与节奏待核实 |
| 开放互联 | UALink 1.0（2025） | 与 AMD 等联合主导，scale-up 开放互联 |
| 标准生态 | UEC 参与者 / UCIe 发起（2022） | 以太网统一阵营成员；芯粒开放互联标准发起者（公开口径） |
| 交换芯片 | Tofino/Tofino 2（收购 Barefoot，2019–20） | P4 可编程交换；Tofino 2 12.8T；后续投入状态待核实 |
| IPU/DPU | Mount Evans（2021） | 首代 ASIC IPU，200G |
| | E2000 | 后续代际 ASIC，量产节奏待核实 |
| NIC | E810 系列 | 100/200G 以太网适配器，前端与存储网络常见 |

## 技术路线与取舍

- 以太网 + 开放标准 + CPU 生态协同：赌「AI 网络最终回归通用以太网」，自身提供 CPU、IPU 与标准话语权，不做私有 fabric。
- P4 可编程的遗产：Barefoot 收购带来的可编程交换芯片路线未成主流，但 P4 语言成为可编程网络的事实工具，影响远超产品本身。
- 主机侧协同：以 CPU/PCIe 生态 + IPU 卸载切入 AI 集群的主机侧网络，而非 fabric 侧；与 GPU 厂商合作大于对抗。
- Gaudi 的组网启示：把 RoCE 网卡做进加速器基板，机架内以太网组网即插即用，是以太网路线的硬件表达。
- CPU 侧红利：PCIe/CXL 生态与 oneAPI 编程层是其在 AI 系统中的传统阵地，网络策略服务于此。
- 以太网原教旨的代价：无自有 fabric 意味着性能上限交给生态（NVIDIA 则自持），赌的是标准化的长期胜利。

## 竞争与对标

- 现实处境：在 AI 网络芯片（交换/DSP/fabric）存在感不足，交换芯片主导权早已让与 Broadcom，GPU 出货落后 NVIDIA/AMD。
- 机会：UALink/UEC 标准层话语权、CPU+IPU 主机侧协同、以开放姿态承接「反锁定」需求。
- vs AMD：UALink 内部共同主导，XPU 市场正面竞争；vs NVIDIA：体系级对抗（x86+开放生态 vs CUDA 生态）。
- vs Marvell/NVIDIA DPU：IPU 与 BlueField/Pensando 在主机侧卸载三分，存在感偏弱但企业渗透尚可（估计口径）。
- 现实检验：Gaudi 商业表现未改变 GPU 格局（估计口径），价值更多在第二供应商与开放路线样本。

## 近况（2025–26，仅用已核实事实）

- UALink 1.0 于 2025 年发布（AMD/Intel 主导）。
- 其余路线调整类信息（Gaudi 后续、IPU 代际、Tofino 状态）均以谱系表标注的待核实口径为准。

## 关联

- [开放互联路线](../知识点/02-机内互联/开放互联路线.md)
- [UCIe与芯粒互联](../知识点/02-机内互联/UCIe与芯粒互联.md)
- [IB-RoCE-UEC路线](../知识点/03-跨机网络/IB-RoCE-UEC路线.md)
- [网卡与DPU](../知识点/03-跨机网络/网卡与DPU.md)
- [AMD](./AMD.md)
