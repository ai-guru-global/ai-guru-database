# Logging Configuration

vLLM leverages Python's `logging.config.dictConfig` functionality to enable
robust and flexible configuration of the various loggers used by vLLM.

vLLM offers two environment variables that can be used to accommodate a range
of logging configurations that range from simple-and-inflexible to
more-complex-and-more-flexible.

- No vLLM logging (simple and inflexible)
  - Set `VLLM_CONFIGURE_LOGGING=0` (leaving `VLLM_LOGGING_CONFIG_PATH` unset)
- vLLM's default logging configuration (simple and inflexible)
  - Leave `VLLM_CONFIGURE_LOGGING` unset or set `VLLM_CONFIGURE_LOGGING=1`
- Fine-grained custom logging configuration (more complex, more flexible)
  - Leave `VLLM_CONFIGURE_LOGGING` unset or set `VLLM_CONFIGURE_LOGGING=1` and
    set `VLLM_LOGGING_CONFIG_PATH=<path-to-logging-config.json>`

## Logging Configuration Environment Variables

### `VLLM_CONFIGURE_LOGGING`

`VLLM_CONFIGURE_LOGGING` controls whether or not vLLM takes any action to
configure the loggers used by vLLM. This functionality is enabled by default,
but can be disabled by setting `VLLM_CONFIGURE_LOGGING=0` when running vLLM.

If `VLLM_CONFIGURE_LOGGING` is enabled and no value is given for
`VLLM_LOGGING_CONFIG_PATH`, vLLM will use built-in default configuration to
configure the root vLLM logger. By default, no other vLLM loggers are
configured and, as such, all vLLM loggers defer to the root vLLM logger to make
all logging decisions.

If `VLLM_CONFIGURE_LOGGING` is disabled and a value is given for
`VLLM_LOGGING_CONFIG_PATH`, an error will occur while starting vLLM.

### `VLLM_LOGGING_CONFIG_PATH`

`VLLM_LOGGING_CONFIG_PATH` allows users to specify a path to a JSON file of
alternative, custom logging configuration that will be used instead of vLLM's
built-in default logging configuration. The logging configuration should be
provided in JSON format following the schema specified by Python's [logging
configuration dictionary
schema](https://docs.python.org/3/library/logging.config.html#dictionary-schema-details).

If `VLLM_LOGGING_CONFIG_PATH` is specified, but `VLLM_CONFIGURE_LOGGING` is
disabled, an error will occur while starting vLLM.

## Examples

### Example 1: Customize vLLM root logger

For this example, we will customize the vLLM root logger to use
[`python-json-logger`](https://github.com/nhairs/python-json-logger)
(which is part of the container image) to log to
STDOUT of the console in JSON format with a log level of `INFO`.

To begin, first, create an appropriate JSON logging configuration file:

**/path/to/logging_config.json:**

```json
{
  "formatters": {
    "json": {
      "class": "pythonjsonlogger.jsonlogger.JsonFormatter"
    }
  },
  "handlers": {
    "console": {
      "class" : "logging.StreamHandler",
      "formatter": "json",
      "level": "INFO",
      "stream": "ext://sys.stdout"
    }
  },
  "loggers": {
    "vllm": {
      "handlers": ["console"],
      "level": "INFO",
      "propagate": false
    }
  },
  "version": 1
}
```

Finally, run vLLM with the `VLLM_LOGGING_CONFIG_PATH` environment variable set
to the path of the custom logging configuration JSON file:

```bash
VLLM_LOGGING_CONFIG_PATH=/path/to/logging_config.json \
    vllm serve mistralai/Mistral-7B-v0.1 --max-model-len 2048
```

### Example 2: Silence a particular vLLM logger

To silence a particular vLLM logger, it is necessary to provide custom logging
configuration for the target logger that configures the logger so that it won't
propagate its log messages to the root vLLM logger.

When custom configuration is provided for any logger, it is also necessary to
provide configuration for the root vLLM logger since any custom logger
configuration overrides the built-in default logging configuration used by vLLM.

First, create an appropriate JSON logging configuration file that includes
configuration for the root vLLM logger and for the logger you wish to silence:

**/path/to/logging_config.json:**

```json
{
  "formatters": {
    "vllm": {
      "class": "vllm.logging_utils.NewLineFormatter",
      "datefmt": "%m-%d %H:%M:%S",
      "format": "%(levelname)s %(asctime)s %(filename)s:%(lineno)d] %(message)s"
    }
  },
  "handlers": {
    "vllm": {
      "class" : "logging.StreamHandler",
      "formatter": "vllm",
      "level": "INFO",
      "stream": "ext://sys.stdout"
    }
  },
  "loggers": {
    "vllm": {
      "handlers": ["vllm"],
      "level": "DEBUG",
      "propagate": false
    },
    "vllm.example_noisy_logger": {
      "propagate": false
    }
  },
  "version": 1
}
```

Finally, run vLLM with the `VLLM_LOGGING_CONFIG_PATH` environment variable set
to the path of the custom logging configuration JSON file:

```bash
VLLM_LOGGING_CONFIG_PATH=/path/to/logging_config.json \
    vllm serve mistralai/Mistral-7B-v0.1 --max-model-len 2048
```

### Example 3: Disable vLLM default logging configuration

To disable vLLM's default logging configuration and silence all vLLM loggers,
simple set `VLLM_CONFIGURE_LOGGING=0` when running vLLM. This will prevent vLLM
for configuring the root vLLM logger, which in turn, silences all other vLLM
loggers.

```bash
VLLM_CONFIGURE_LOGGING=0 \
    vllm serve mistralai/Mistral-7B-v0.1 --max-model-len 2048
```

## Additional resources

- [`logging.config` Dictionary Schema Details](https://docs.python.org/3/library/logging.config.html#dictionary-schema-details)

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
