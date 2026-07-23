# Using CNI with nerdctl

nerdctl uses CNI plugins for its container network, you can set network by
either `--network` or `--net` option.

## Basic networks

nerdctl support some basic types of CNI plugins without any configuration
needed(you should have CNI plugin be installed), for Linux systems the basic
CNI plugin types are `bridge`, `portmap`, `firewall`, `tuning`, for Windows
system, the supported CNI plugin types are `nat` only.

The default network `bridge` for Linux and `nat` for Windows if you
don't set any network options.

Configuration of the default network `bridge` of Linux:

```json
{
  "cniVersion": "1.0.0",
  "name": "bridge",
  "plugins": [
    {
      "type": "bridge",
      "bridge": "nerdctl0",
      "isGateway": true,
      "ipMasq": true,
      "hairpinMode": true,
      "ipam": {
        "type": "host-local",
        "routes": [{ "dst": "0.0.0.0/0" }],
        "ranges": [
          [
            {
              "subnet": "10.4.0.0/24",
              "gateway": "10.4.0.1"
            }
          ]
        ]
      }
    },
    {
      "type": "portmap",
      "capabilities": {
        "portMappings": true
      }
    },
    {
      "type": "firewall",
      "ingressPolicy": "same-bridge"
    },
    {
      "type": "tuning"
    }
  ]
}
```

## Bridge isolation

nerdctl >= 0.18 sets the `ingressPolicy` to `same-bridge` when `firewall` plugin >= 1.1.0 is installed.
This `ingressPolicy` replaces the CNI `isolation` plugin used in nerdctl <= 0.17.

When `firewall` plugin >= 1.1.0 is not found, nerdctl does not enable the bridge isolation.
This means a container in `--net=foo` can connect to a container in `--net=bar`.

## macvlan/IPvlan networks

nerdctl also support macvlan and IPvlan network driver.

To create a `macvlan` network which bridges with a given physical network interface, use `--driver macvlan` with
`nerdctl network create` command.

```
# nerdctl network create mac0 --driver macvlan \
  --subnet=192.168.5.0/24
  --gateway=192.168.5.2
  -o parent=eth0
```

You can specify the `parent`, which is the interface the traffic will physically go through on the host,
defaults to default route interface.

And the `subnet` should be under the same network as the network interface,
an easier way is to use DHCP to assign the IP:

```
# nerdctl network create mac0 --driver macvlan --ipam-driver=dhcp
```

Using `--driver ipvlan` can create `ipvlan` network, the default mode for IPvlan is `l2`.

## DHCP host-name and other DHCP options

Nerdctl automatically sets the DHCP host-name option to the hostname value of the container.

Furthermore, on network creation, nerdctl supports the ability to set other DHCP options through `--ipam-options`.

Currently, the following options are supported by the DHCP plugin:
```
dhcp-client-identifier
subnet-mask
routers
user-class
vendor-class-identifier
```

For example:
```
# nerdctl network create --driver macvlan \
    --ipam-driver dhcp \
    --ipam-opt 'vendor-class-identifier={"type": "provide", "value": "Hey! Its me!"}' \
    my-dhcp-net
```

## Custom networks

You can also customize your CNI network by providing configuration files.

When rootful, the expected root location is `/etc/cni/net.d`.
For rootless, the expected root location is `~/.config/cni/net.d/`

Configuration files (like `10-mynet.conf`) can be placed either in the root location,
or under a subfolder.
If in the root location, this network will be available to all nerdctl namespaces.
If placed in a subfolder, it will be available only to the identically named namespace.

For example, you have one configuration file(`/etc/cni/net.d/10-mynet.conf`)
for `bridge` network:

```json
{
  "cniVersion": "1.0.0",
  "name": "mynet",
  "type": "bridge",
  "bridge": "cni0",
  "isGateway": true,
  "ipMasq": true,
  "ipam": {
    "type": "host-local",
    "subnet": "172.19.0.0/24",
    "routes": [
      { "dst": "0.0.0.0/0" }
    ]
  }
}
```

This will configure a new CNI network with the name `mynet`, and you can use
this network to create a container in any namespace:

```console
# nerdctl run -it --net mynet --rm alpine ip addr show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
3: eth0@if6120: <BROADCAST,MULTICAST,UP,LOWER_UP,M-DOWN> mtu 1500 qdisc noqueue state UP
    link/ether 5e:5b:3f:0c:36:56 brd ff:ff:ff:ff:ff:ff
    inet 172.19.0.51/24 brd 172.19.0.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::5c5b:3fff:fe0c:3656/64 scope link tentative
       valid_lft forever preferred_lft forever
```

## 核心知识框架

| 知识层 | 内容 | 深度要求 | 优先级 |
|--------|------|----------|--------|
| 基础概念 | 定义/原理/分类 | 理解并能解释 | P0 |
| 核心方法 | 算法/技术/工具 | 掌握并能应用 | P0 |
| 工程实践 | 设计/实现/优化 | 独立完成项目 | P1 |
| 前沿进展 | 最新研究/趋势 | 了解并跟踪 | P2 |
| 应用案例 | 实际场景/经验 | 参考并借鉴 | P1 |

## 技术要点速查

| 要点 | 说明 | 注意事项 |
|------|------|----------|
| 核心原理 | 理解底层机制 | 不要死记硬背 |
| 实践方法 | 动手验证理论 | 从简单开始 |
| 性能优化 | 瓶颈分析+调优 | 数据驱动 |
| 错误排查 | 系统化定位问题 | 日志+复现 |
| 最佳实践 | 遵循行业标准 | 因地制宜 |
| 持续学习 | 跟踪技术发展 | 选择性深入 |

## 对比分析表

| 维度 | 方案一 | 方案二 | 方案三 | 推荐 |
|------|--------|--------|--------|------|
| 复杂度 | 低 | 中 | 高 | 按需选择 |
| 性能 | 基础 | 良好 | 优秀 | 按需求 |
| 可维护性 | 高 | 中 | 低 | 优先高 |
| 学习曲线 | 平缓 | 中等 | 陡峭 | 按团队 |
| 社区支持 | 广泛 | 一般 | 有限 | 优先广泛 |

## 常见问题FAQ

| 问题 | 解答 |
|------|------|
| 如何快速入门? | 先理解核心概念，再通过实践加深理解 |
| 如何选择技术方案? | 根据场景需求、团队能力、成本约束综合评估 |
| 遇到问题如何排查? | 复现问题→定位范围→分析原因→验证修复 |
| 如何持续提升? | 系统学习+项目实践+社区交流+定期复盘 |
| 如何评估效果? | 设定明确指标→对比基线→持续监控 |

## 学习路径

| 阶段 | 内容 | 时间 | 产出 |
|------|------|------|------|
| 入门 | 核心概念+基础操作 | 1-2周 | 基本理解 |
| 基础 | 工具使用+简单实践 | 2-3周 | 能独立操作 |
| 进阶 | 深入原理+复杂场景 | 3-4周 | 能解决问题 |
| 实战 | 生产级应用 | 4-6周 | 独立负责 |
| 精通 | 架构+创新 | 持续 | 技术领导 |

## 术语表

| 术语 | 含义 |
|------|------|
| Best Practice | 行业最佳实践 |
| Trade-off | 权衡取舍 |
| Scalability | 可扩展性 |
| Maintainability | 可维护性 |
| Observability | 可观测性 |
| Reliability | 可靠性 |

## 检查清单

- [ ] 核心概念已理解
- [ ] 基本操作已掌握
- [ ] 实践项目已完成
- [ ] 常见问题能解决
- [ ] 前沿趋势有关注
- [ ] 知识已沉淀文档化
