---
title: "无损网络配置核查"
category: 12-architecture-infrastructure
subcategory: networking
tags: ["gpu-network", "roce", "lossless-network", "config-audit"]
summary: "RoCE 无损网络六项核查清单、逐项命令实操与四类经典事故复盘，外加 IB 侧对照核查。"
created: 2026-10-27
updated: 2026-10-27
tier: supporting
aliases: ["无损配置核查", "Lossless Config Audit"]
sources: []
name_zh: "无损网络配置核查"
---

# 无损网络配置核查

> 中文简称：无损网络配置核查

> **一句话理解**: RoCE 网络的吞吐悬崖和静默丢包，多数不是硬件坏了，而是 PFC、ECN、MTU 这些配置有一处没对齐——照清单逐项核查。

---

## 一、RoCE 六项核查清单

| **核查项** | **核查要点** | **通过标准** |
|---|---|---|
| PFC | 使能 + watchdog + 阈值 | 端侧与交换机侧同优先级都开启；watchdog 启用；暂停阈值与 buffer 水位联动 |
| ECN | 标记阈值与带宽匹配 | 阈值随端口速率与线缆时延调整；标记率有遥测可查 |
| buffer | 水位与 headroom | headroom 覆盖 PFC 反应往返时间内的数据量；ingress/egress 水位不越界 |
| MTU | 端到端一致 | 全路径（网卡、每一跳交换机）统一 jumbo 9000，不允许中间任何一跳是 1500 |
| DSCP/PCP | 端网映射一致 | 端侧打标与交换机的 TC/队列映射一一对应，中间设备不改写 |
| DCBX/LLDP | 协商正常 | 两端 PFC/ETS 协商结果一致，无半开（一边以为开了、一边没开） |

核查节奏：全量核查在新集群交付、大版本升级、故障复盘后各做一次；日常巡检只看 counter 类（pause、ECN 标记增速），配置漂移靠变更管理兜住。责任边界也要明确：端侧三项（PFC 使能、打标、MTU）归主机侧，网侧三项归网络组，交界处的 DCBX 协商结果两边都要确认。

清单的适用边界：面向数据中心内部计算网；跨机房链路在六项之外还要叠加时延、重传与带宽保障策略核查。清单本身随平台代际更新——每次换交换机或网卡，逐项对表重新确认一遍。

---

## 二、逐项命令实操

**端侧（主机）**

```bash
mlnx_qos -i <dev>                  # PFC 各优先级使能状态 + DCBX 协商结果
ethtool -S <dev> | grep -i pause   # rx/tx pause 帧计数（看增速不看绝对值）
ethtool --show-fec <dev>           # FEC 模式与纠错计数
cat /sys/bus/pci/devices/<bdf>/cma_roce_tos   # RDMA 流量的 TOS/DSCP 打标值
```

**交换机侧（命令形态随厂商 CLI 而异）**

```bash
show pfc counters                  # 每优先级 Tx/Rx pause，风暴时这里先爆
show ecn                           # ECN 标记统计与标记阈值
show interface counters            # 错包、drop 分布
show running-config interface <if> # 核对该端口的 PFC/队列/MTU 配置
```

**MTU 全链路核对**

```bash
ip link set <dev> mtu 9000         # 端侧设置
ip link show <dev>                 # 验证生效
# 交换机侧逐跳核对：确认每一跳接口 MTU 均 >= 9000，漏一台 spine 就是大包黑洞
```

**DCBX 协商验证**：`mlnx_qos -i <dev>` 输出里的 PFC 协商列要与交换机侧配置互证；LLDP 被中间设备透传破坏（或被当成安全策略关掉）时，端侧会带着错误配置「自认为正常」，这是最难查的一类半开状态。

实操顺序建议：先 MTU（最快排除大包黑洞），再 PFC/DCBX（协商态），再 ECN/buffer（阈值类），最后 DSCP 映射（最繁琐）——按命中概率与检查成本排序。

---

## 三、常见事故案例

| **事故** | **机理** | **症状** | **修复** |
|---|---|---|---|
| MTU 不一致 | 中间某跳仍是 1500，超过路径 MTU 的大包被丢弃且无 ICMP 反馈 | 小消息正常、大消息 RDMA 读写超时——典型「大包黑洞」静默丢包 | 逐跳核对并统一 MTU，全量打流验证 |
| PFC 未开启 | RoCE 依赖 PFC 止损；丢包触发大面积重传，拥塞雪崩 | 吞吐悬崖：实测带宽只有预期的零头 | 端与网两侧同优先级开启 PFC 并验证 watchdog |
| ECN 阈值过低 | 提前标记导致发送端过激降速，带宽欠载后再恢复，反复振荡 | 吞吐周期性抖动，时延锯齿 | 按端口速率与线缆长度上调标记阈值 |
| watchdog 缺失 | PFC 风暴没有刹车，pause 沿拓扑扩散到无故障区域 | 大面积业务挂起，远端正常租户一起停 | 启用 PFC watchdog 并联动端口风暴处置 |

四个案例的共同点：硬件全部正常，常规 counter 上也「看不到错误」——丢的是配置一致性，不是可见的错包。这正是无损网络核查要独立成清单、周期执行的原因。

案例复盘的产出物：每个案例沉淀为一条可执行的核查项或告警规则；事故不复盘成规则，等于预定了一次重演。

---

## 四、变更管理纪律

阈值类改动（PFC/ECN/buffer）是低感知高危变更：

- 灰度：先改一台交换机或一个 pod，观察 pause/ECN 曲线与业务吞吐至少一个完整训练周期再推广；
- 先非生产平面验证：有独立验证平面就先跑全量打流，没有就把灰度规模压到最小；
- 回滚预案：改前备份 running-config，变更单上写明回滚命令与回滚后的验证点（打流达标 + counter 归零）；
- 禁止同类配置多处不同值：全网维护一套「标准无损参数」，逐端口 diff 对齐，任何例外都要登记原因与有效期；
- 变更窗口避开大作业长跑时段——阈值抖动对 in-flight 的 allreduce 影响最直接；
- 每次阈值变更后重钉基线：打流与 pause/ECN 曲线基线随配置版本走，避免用旧基线评判新配置；
- 核查发现的偏差一律走变更流程修正，不直接手改——绕过变更的修正会成为下一次核查发现的「不明差异」。

---

## 五、IB 侧对照核查

IB 在链路层用 credit 流控天然不丢包，不需要 PFC/ECN 那一套，但有自己的一票核查项：

| **核查项** | **要点** |
|---|---|
| SM 状态 | 主备 SM 各就各位、Master 稳定不震荡；SM 异常会触发全网路由重算 |
| SL/VL 映射 | 跨交换机一致；映射错会导致部分流量挤同一虚信道，人为制造拥塞 |
| 自适应路由 | 版本与配置全网一致；开启后复核接收侧乱序重排压力 |
| PKey | 默认 PKey 范围收紧，多租户分区配置与设计一致 |

```bash
sminfo                  # SM 状态与优先级
iblinkinfo              # 全网链路状态一览（Active/降档一眼扫出）
smpquery sl2vl <lid>    # SL→VL 映射抽查
```

IB 与 RoCE 混部集群：两套清单并行维护，交界设备（协议桥接或双栈接入点）单独建档，排障时先确认流量走的是哪一侧。

---

## 交叉引用

- [[12_架构基建/08_网络/07_GPU_高网设计/04_协议传输/02_Lossless_Ethernet_PFC_ECN_DCQCN|无损以太网 PFC/ECN/DCQCN]]
- [[12_架构基建/08_网络/06_RDMA_and_RoCE_for_AI|RDMA 与 RoCE for AI]]
- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/01_Failure_Distribution_Patterns|网络故障分布与模式]]
- [[12_架构基建/08_网络/07_GPU_高网设计/07_运维故障/06_Telemetry_Baseline_Monitoring|网络遥测与监控基线]]

---

*Last updated: 2026-10-27*
