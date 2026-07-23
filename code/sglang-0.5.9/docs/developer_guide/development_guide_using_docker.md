# Development Guide Using Docker

## Setup VSCode on a Remote Host
(Optional - you can skip this step if you plan to run sglang dev container locally)

1. In the remote host, download `code` from [Https://code.visualstudio.com/docs/?dv=linux64cli](https://code.visualstudio.com/download) and run `code tunnel` in a shell.

Example
```bash
wget https://vscode.download.prss.microsoft.com/dbazure/download/stable/fabdb6a30b49f79a7aba0f2ad9df9b399473380f/vscode_cli_alpine_x64_cli.tar.gz
tar xf vscode_cli_alpine_x64_cli.tar.gz

# https://code.visualstudio.com/docs/remote/tunnels
./code tunnel
```

2. In your local machine, press F1 in VSCode and choose "Remote Tunnels: Connect to Tunnel".

## Setup Docker Container

### Option 1. Use the default dev container automatically from VSCode
There is a `.devcontainer` folder in the sglang repository root folder to allow VSCode to automatically start up within dev container. You can read more about this VSCode extension in VSCode official document [Developing inside a Container](https://code.visualstudio.com/docs/devcontainers/containers).
![image](https://github.com/user-attachments/assets/6a245da8-2d4d-4ea8-8db1-5a05b3a66f6d)
(*Figure 1: Diagram from VSCode official documentation [Developing inside a Container](https://code.visualstudio.com/docs/devcontainers/containers).*)

To enable this, you only need to:
1. Start Visual Studio Code and install [VSCode dev container extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
2. Press F1, type and choose "Dev Container: Open Folder in Container.
3. Input the `sglang` local repo path in your machine and press enter.

The first time you open it in dev container might take longer due to docker pull and build. Once it's successful, you should set on your status bar at the bottom left displaying that you are in a dev container:

![image](https://github.com/user-attachments/assets/650bba0b-c023-455f-91f9-ab357340106b)

Now when you run `sglang.launch_server` in the VSCode terminal or start debugging using F5, sglang server will be started in the dev container with all your local changes applied automatically:

![image](https://github.com/user-attachments/assets/748c85ba-7f8c-465e-8599-2bf7a8dde895)


### Option 2. Start up containers manually (advanced)

The following startup command is an example for internal development by the SGLang team. You can **modify or add directory mappings as needed**, especially for model weight downloads, to prevent repeated downloads by different Docker containers.

❗️ **Note on RDMA**

    1. `--network host` and `--privileged` are required by RDMA. If you don't need RDMA, you can remove them but keeping them there does not harm. Thus, we enable these two flags by default in the commands below.
    2. You may need to set `NCCL_IB_GID_INDEX` if you are using RoCE, for example: `export NCCL_IB_GID_INDEX=3`.

```bash
# Change the name to yours
docker run -itd --shm-size 32g --gpus all -v <volumes-to-mount> --ipc=host --network=host --privileged --name sglang_dev lmsysorg/sglang:dev /bin/zsh
docker exec -it sglang_dev /bin/zsh
```
Some useful volumes to mount are:
1. **Huggingface model cache**: mounting model cache can avoid re-download every time docker restarts. Default location on Linux is `~/.cache/huggingface/`.
2. **SGLang repository**: code changes in the SGLang local repository will be automatically synced to the .devcontainer.

Example 1: Mounting local cache folder `/opt/dlami/nvme/.cache` but not the SGLang repo. Use this when you prefer to manually transfer local code changes to the devcontainer.
```bash
docker run -itd --shm-size 32g --gpus all -v /opt/dlami/nvme/.cache:/root/.cache --ipc=host --network=host --privileged --name sglang_zhyncs lmsysorg/sglang:dev /bin/zsh
docker exec -it sglang_zhyncs /bin/zsh
```
Example 2: Mounting both HuggingFace cache and local SGLang repo. Local code changes are automatically synced to the devcontainer as the SGLang is installed in editable mode in the dev image.
```bash
docker run -itd --shm-size 32g --gpus all -v $HOME/.cache/huggingface/:/root/.cache/huggingface -v $HOME/src/sglang:/sgl-workspace/sglang --ipc=host --network=host --privileged --name sglang_zhyncs lmsysorg/sglang:dev /bin/zsh
docker exec -it sglang_zhyncs /bin/zsh
```
## Debug SGLang with VSCode Debugger
1. (Create if not exist) open `launch.json` in VSCode.
2. Add the following config and save. Please note that you can edit the script as needed to apply different parameters or debug a different program (e.g. benchmark script).
     ```JSON
       {
          "version": "0.2.0",
          "configurations": [
              {
                  "name": "Python Debugger: launch_server",
                  "type": "debugpy",
                  "request": "launch",
                  "module": "sglang.launch_server",
                  "console": "integratedTerminal",
                  "args": [
                      "--model-path", "meta-llama/Llama-3.2-1B",
                      "--host", "0.0.0.0",
                      "--port", "30000",
                      "--trust-remote-code",
                  ],
                  "justMyCode": false
              }
          ]
      }
    ```

3. Press "F5" to start. VSCode debugger will ensure that the program will pause at the breakpoints even if the program is running at remote SSH/Tunnel host + dev container.

## Profile

```bash
# Change batch size, input, output and add `disable-cuda-graph` (for easier analysis)
# e.g. DeepSeek V3
nsys profile -o deepseek_v3 python3 -m sglang.bench_one_batch --batch-size 1 --input 128 --output 256 --model deepseek-ai/DeepSeek-V3 --trust-remote-code --tp 8 --disable-cuda-graph
```

## Evaluation

```bash
# e.g. gsm8k 8 shot
python3 benchmark/gsm8k/bench_sglang.py --num-questions 2000 --parallel 2000 --num-shots 8
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
