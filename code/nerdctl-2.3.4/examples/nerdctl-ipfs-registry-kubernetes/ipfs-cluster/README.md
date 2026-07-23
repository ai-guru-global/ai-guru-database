# Example: Node-to-Node image sharing on Kubernetes with content replication using `nerdctl ipfs registry` with ipfs-cluster

This directory contains an example Kubernetes setup for node-to-node image sharing with content replication (ipfs-cluster).

Usage:
- Generate `bootstrap.yaml` by executing `bootstrap.yaml.sh` (e.g. `./bootstrap.yaml.sh > ${DIR_LOCATION}/bootstrap.yaml`)
  - [`ipfs-swarm-key-gen`](https://github.com/Kubuxu/go-ipfs-swarm-key-gen) is required (see https://github.com/ipfs/kubo/blob/v0.15.0/docs/experimental-features.md#private-networks)
  - [`ipfs-key`](https://github.com/whyrusleeping/ipfs-key) is required (see https://ipfscluster.io/documentation/guides/k8s/)
- Deploy `bootstrap.yaml` and `nerdctl-ipfs-registry.yaml` (e.g. using `kubectl apply`)
- Make sure nodes contain containerd >= v1.5.8
- You might want to change some configuration written in `nerdctl-ipfs-registry.yaml` (e.g. [chaning profile based on your node's resouce requirements](https://docs.ipfs.tech/how-to/default-profile/#available-profiles))

## Example on kind

Prepare cluster (make sure kind nodes contain containerd >= v1.5.8).

```console
$ cat <<EOF > /tmp/kindconfig.yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker
- role: worker
EOF
$ kind create cluster --image=kindest/node:v1.25.2 --config=/tmp/kindconfig.yaml
$ ./bootstrap.yaml.sh > ./bootstrap.yaml
$ kubectl apply -f .
```

Prepare `kind-worker` (1st node) for importing an image to IPFS

(in `kind-worker`)

```console
$ docker exec -it kind-worker /bin/bash
(kind-worker)# NERDCTL_VERSION=0.23.0
(kind-worker)# curl -o /tmp/nerdctl.tgz -fsSL --proto '=https' --tlsv1.2 https://github.com/containerd/nerdctl/releases/download/v${NERDCTL_VERSION}/nerdctl-${NERDCTL_VERSION}-linux-amd64.tar.gz
(kind-worker)# tar zxvf /tmp/nerdctl.tgz -C /usr/local/bin/
```

Add an image to `kind-worker`.

> NOTE: port 9095 needs to be used as the IPFS API port instead of 5001 (see also https://cluster.ipfs.io/documentation/reference/proxy/)

```console
$ docker exec -it kind-worker /bin/bash
(kind-worker)# mkdir -p /tmp/ipfsapi ; echo -n /ip4/127.0.0.1/tcp/9095 >  /tmp/ipfsapi/api
(kind-worker)# export IPFS_PATH=/tmp/ipfsapi
(kind-worker)# nerdctl pull ghcr.io/stargz-containers/jenkins:2.60.3-org
(kind-worker)# nerdctl push ipfs://ghcr.io/stargz-containers/jenkins:2.60.3-org
(kind-worker)# nerdctl rmi ghcr.io/stargz-containers/jenkins:2.60.3-org
```

The image added to `kind-worker` is shared to other nodes via IPFS.
You can run this image on the nodes using the following manifest.
CID of the pushed image is printed when `nerdctl push` is succeeded (we assume that the image is added to IPFS as CID `bafkreictyyoysj56v772xbfhyfrcvmgmfpa4vodmqaroz53ytvai7nof6u`).

```console
$ cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins
spec:
  replicas: 2
  selector:
    matchLabels:
      app: jenkins
  template:
    metadata:
      labels:
        app: jenkins
    spec:
      containers:
      - name: jenkins
        image: localhost:5050/ipfs/bafkreictyyoysj56v772xbfhyfrcvmgmfpa4vodmqaroz53ytvai7nof6u
        resources:
          requests:
            cpu: 1
EOF
```

> NOTE: Kubernetes doesn't support `ipfs://CID` URL on YAML as of now so we need to use `localhost:5050/ipfs/CID` form instead. In the future, this limitation should be eliminated.

The image runs on the nodes.

```console
$ kubectl get pods -owide | grep jenkins
jenkins-7fcb4687c4-9gmrr          1/1     Running   0          22s     10.244.1.3   kind-worker    <none>           <none>
jenkins-7fcb4687c4-kvdbl          1/1     Running   0          22s     10.244.3.3   kind-worker3   <none>           <none>
```

You can see that ipfs-cluster is activated on the cluster.

```console
$ kubectl exec -it ipfs-n59wf -c ipfs-cluster -- /bin/sh
/ # ipfs-cluster-ctl status bafkreictyyoysj56v772xbfhyfrcvmgmfpa4vodmqaroz53ytvai7nof6u
bafkreictyyoysj56v772xbfhyfrcvmgmfpa4vodmqaroz53ytvai7nof6u:
    > ipfs-6cmlq           : PINNED | 2022-10-18T06:28:46Z | Attempts: 0 | Priority: false
    > ipfs-rvcb2           : PINNED | 2022-10-18T06:28:46Z | Attempts: 0 | Priority: false
    > ipfs-2m4tm           : REMOTE | 2022-10-18T06:30:16.23637825Z | Attempts: 0 | Priority: false
    > ipfs-bootstrap-67c54bc878-mgtg4 : REMOTE | 2022-10-18T06:30:16.23637825Z | Attempts: 0 | Priority: false
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

## 进阶内容补充

| 主题 | 深度解析 | 实践要点 | 参考资源 |
|------|----------|----------|----------|
| 原理深入 | 底层机制剖析 | 源码阅读+实验验证 | 官方文档+论文 |
| 工程实现 | 生产级代码实践 | 设计模式+测试覆盖 | 开源项目 |
| 性能调优 | 瓶颈定位+优化 | Profiling+基准测试 | 性能工具 |
| 安全加固 | 威胁建模+防护 | 安全审计+渗透测试 | 安全框架 |
| 架构演进 | 系统设计与重构 | 渐进式改造+验证 | 架构书籍 |

## 实践操作指南

| 步骤 | 操作 | 验证方法 | 常见问题 |
|------|------|----------|----------|
| 环境搭建 | 安装依赖+配置 | 运行hello world | 版本冲突 |
| 基础使用 | 核心API调用 | 单元测试通过 | 参数错误 |
| 功能开发 | 业务逻辑实现 | 集成测试通过 | 边界条件 |
| 性能优化 | 热点优化+缓存 | 压测达标 | 内存泄漏 |
| 部署上线 | 容器化+CI/CD | 灰度验证通过 | 配置差异 |

## 技术选型决策

| 考量因素 | 权重 | 评估方法 | 决策标准 |
|----------|------|----------|----------|
| 功能匹配 | 30% | 需求清单对比 | 覆盖核心需求 |
| 性能表现 | 25% | 基准测试 | 满足SLA |
| 社区生态 | 20% | Star/Issue/更新频率 | 活跃维护 |
| 学习成本 | 15% | 文档质量+上手时间 | 团队可接受 |
| 长期维护 | 10% | 路线图+兼容性 | 可持续发展 |

## 故障排查流程

| 阶段 | 动作 | 工具 | 产出 |
|------|------|------|------|
| 复现 | 稳定复现问题 | 日志+断点 | 复现步骤 |
| 定位 | 缩小问题范围 | 二分法+排除法 | 问题模块 |
| 分析 | 找到根本原因 | 源码+文档 | 根因报告 |
| 修复 | 实施修复方案 | 代码修改+测试 | 修复PR |
| 验证 | 确认问题消除 | 回归测试 | 验证报告 |
| 预防 | 防止再次发生 | 监控+文档 | 改进措施 |

## 知识关联图谱

| 关联领域 | 关系 | 学习顺序 |
|----------|------|----------|
| 前置基础 | 必须先掌握 | 先学 |
| 并行技能 | 相互增强 | 同步 |
| 进阶方向 | 深入发展 | 后学 |
| 应用场景 | 价值体现 | 实践 |
| 工具支撑 | 效率提升 | 随时 |

## 持续改进清单

- [ ] 定期回顾和更新知识
- [ ] 实践验证理论认知
- [ ] 关注社区最新动态
- [ ] 参与技术讨论和分享
- [ ] 将经验沉淀为文档
- [ ] 持续优化工作流程
