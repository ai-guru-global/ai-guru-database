# Python Multiprocessing

## Debugging

Please see the [Troubleshooting][troubleshooting-python-multiprocessing]
page for information on known issues and how to solve them.

## Introduction

!!! warning
    The source code references are to the state of the code at the time of writing in December, 2024.

The use of Python multiprocessing in vLLM is complicated by:

- The use of vLLM as a library and the inability to control the code using vLLM
- Varying levels of incompatibilities between multiprocessing methods and vLLM
  dependencies

This document describes how vLLM deals with these challenges.

## Multiprocessing Methods

[Python multiprocessing methods](https://docs.python.org/3/library/multiprocessing.html#contexts-and-start-methods) include:

- `spawn` - spawn a new Python process. The default on Windows and macOS.

- `fork` - Use `os.fork()` to fork the Python interpreter. The default on
  Linux for Python versions prior to 3.14.

- `forkserver` - Spawn a server process that will fork a new process on request.
  The default on Linux for Python version 3.14 and newer.

### Tradeoffs

`fork` is the fastest method, but is incompatible with dependencies that use
threads. If you are under macOS, using `fork` may cause the process to crash.

`spawn` is more compatible with dependencies, but can be problematic when vLLM
is used as a library. If the consuming code does not use a `__main__` guard (`if
__name__ == "__main__":`), the code will be inadvertently re-executed when vLLM
spawns a new process. This can lead to infinite recursion, among other problems.

`forkserver` will spawn a new server process that will fork new processes on
demand. This unfortunately has the same problem as `spawn` when vLLM is used as
a library. The server process is created as a spawned new process, which will
re-execute code not protected by a `__main__` guard.

For both `spawn` and `forkserver`, the process must not depend on inheriting any
global state as would be the case with `fork`.

## Compatibility with Dependencies

Multiple vLLM dependencies indicate either a preference or requirement for using
`spawn`:

- <https://pytorch.org/docs/stable/notes/multiprocessing.html#cuda-in-multiprocessing>
- <https://pytorch.org/docs/stable/multiprocessing.html#sharing-cuda-tensors>
- <https://docs.habana.ai/en/latest/PyTorch/Getting_Started_with_PyTorch_and_Gaudi/Getting_Started_with_PyTorch.html?highlight=multiprocessing#torch-multiprocessing-for-dataloaders>

It is perhaps more accurate to say that there are known problems with using
`fork` after initializing these dependencies.

## Current State (v0)

The environment variable `VLLM_WORKER_MULTIPROC_METHOD` can be used to control which method is used by vLLM. The current default is `fork`.

- <https://github.com/vllm-project/vllm/blob/d05f88679bedd73939251a17c3d785a354b2946c/vllm/envs.py#L339-L342>

When we know we own the process because the `vllm` command was used, we use
`spawn` because it's the most widely compatible.

- <https://github.com/vllm-project/vllm/blob/d05f88679bedd73939251a17c3d785a354b2946c/vllm/scripts.py#L123-L140>

The `multiproc_xpu_executor` forces the use of `spawn`.

- <https://github.com/vllm-project/vllm/blob/d05f88679bedd73939251a17c3d785a354b2946c/vllm/executor/multiproc_xpu_executor.py#L14-L18>

There are other miscellaneous places hard-coding the use of `spawn`:

- <https://github.com/vllm-project/vllm/blob/d05f88679bedd73939251a17c3d785a354b2946c/vllm/distributed/device_communicators/custom_all_reduce_utils.py#L135>
- <https://github.com/vllm-project/vllm/blob/d05f88679bedd73939251a17c3d785a354b2946c/vllm/entrypoints/openai/api_server.py#L184>

Related PRs:

- <gh-pr:8823>

## Prior State in v1

There was an environment variable to control whether multiprocessing is used in
the v1 engine core, `VLLM_ENABLE_V1_MULTIPROCESSING`. This defaulted to off.

- <https://github.com/vllm-project/vllm/blob/d05f88679bedd73939251a17c3d785a354b2946c/vllm/envs.py#L452-L454>

When it was enabled, the v1 `LLMEngine` would create a new process to run the
engine core.

- <https://github.com/vllm-project/vllm/blob/d05f88679bedd73939251a17c3d785a354b2946c/vllm/v1/engine/llm_engine.py#L93-L95>
- <https://github.com/vllm-project/vllm/blob/d05f88679bedd73939251a17c3d785a354b2946c/vllm/v1/engine/llm_engine.py#L70-L77>
- <https://github.com/vllm-project/vllm/blob/d05f88679bedd73939251a17c3d785a354b2946c/vllm/v1/engine/core_client.py#L44-L45>

It was off by default for all the reasons mentioned above - compatibility with
dependencies and code using vLLM as a library.

### Changes Made in v1

There is not an easy solution with Python's `multiprocessing` that will work
everywhere. As a first step, we can get v1 into a state where it does "best
effort" choice of multiprocessing method to maximize compatibility.

- Default to `fork`.
- Use `spawn` when we know we control the main process (`vllm` was executed).
- If we detect `cuda` was previously initialized, force `spawn` and emit a
  warning. We know `fork` will break, so this is the best we can do.

The case that is known to still break in this scenario is code using vLLM as a
library that initializes `cuda` before calling vLLM. The warning we emit should
instruct users to either add a `__main__` guard or to disable multiprocessing.

If that known-failure case occurs, the user will see two messages that explain
what is happening. First, a log message from vLLM:

```console
WARNING 12-11 14:50:37 multiproc_worker_utils.py:281] CUDA was previously
    initialized. We must use the `spawn` multiprocessing start method. Setting
    VLLM_WORKER_MULTIPROC_METHOD to 'spawn'. See
    https://docs.vllm.ai/en/latest/usage/debugging.html#python-multiprocessing
    for more information.
```

Second, Python itself will raise an exception with a nice explanation:

```console
RuntimeError:
        An attempt has been made to start a new process before the
        current process has finished its bootstrapping phase.

        This probably means that you are not using fork to start your
        child processes and you have forgotten to use the proper idiom
        in the main module:

            if __name__ == '__main__':
                freeze_support()
                ...

        The "freeze_support()" line can be omitted if the program
        is not going to be frozen to produce an executable.

        To fix this issue, refer to the "Safe importing of main module"
        section in https://docs.python.org/3/library/multiprocessing.html
```

## Alternatives Considered

### Detect if a `__main__` guard is present

It has been suggested that we could behave better if we could detect whether
code using vLLM as a library has a `__main__` guard in place. This [post on
stackoverflow](https://stackoverflow.com/questions/77220442/multiprocessing-pool-in-a-python-class-without-name-main-guard)
was from a library author facing the same question.

It is possible to detect whether we are in the original, `__main__` process, or
a subsequent spawned process. However, it does not appear to be straight forward
to detect whether a `__main__` guard is present in the code.

This option has been discarded as impractical.

### Use `forkserver`

At first it appears that `forkserver` is a nice solution to the problem.
However, the way it works presents the same challenges that `spawn` does when
vLLM is used as a library.

### Force `spawn` all the time

One way to clean this up is to just force the use of `spawn` all the time and
document that the use of a `__main__` guard is required when using vLLM as a
library. This would unfortunately break existing code and make vLLM harder to
use, violating the desire to make the `LLM` class as easy as possible to use.

Instead of pushing this on our users, we will retain the complexity to do our
best to make things work.

## Future Work

We may want to consider a different worker management approach in the future
that works around these challenges.

1. We could implement something `forkserver`-like, but have the process manager
   be something we initially launch by running our own subprocess and a custom
   entrypoint for worker management (launch a `vllm-manager` process).

2. We can explore other libraries that may better suit our needs. Examples to
   consider:

- <https://github.com/joblib/loky>

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
