---
title: Using Nginx
---
[](){ #nginxloadbalancer }

This document shows how to launch multiple vLLM serving containers and use Nginx to act as a load balancer between the servers.

[](){ #nginxloadbalancer-nginx-build }

## Build Nginx Container

This guide assumes that you have just cloned the vLLM project and you're currently in the vllm root directory.

```console
export vllm_root=`pwd`
```

Create a file named `Dockerfile.nginx`:

```console
FROM nginx:latest
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build the container:

```console
docker build . -f Dockerfile.nginx --tag nginx-lb
```

[](){ #nginxloadbalancer-nginx-conf }

## Create Simple Nginx Config file

Create a file named `nginx_conf/nginx.conf`. Note that you can add as many servers as you'd like. In the below example we'll start with two. To add more, add another `server vllmN:8000 max_fails=3 fail_timeout=10000s;` entry to `upstream backend`.

```console
upstream backend {
    least_conn;
    server vllm0:8000 max_fails=3 fail_timeout=10000s;
    server vllm1:8000 max_fails=3 fail_timeout=10000s;
}
server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

[](){ #nginxloadbalancer-nginx-vllm-container }

## Build vLLM Container

```console
cd $vllm_root
docker build -f docker/Dockerfile . --tag vllm
```

If you are behind proxy, you can pass the proxy settings to the docker build command as shown below:

```console
cd $vllm_root
docker build \
    -f docker/Dockerfile . \
    --tag vllm \
    --build-arg http_proxy=$http_proxy \
    --build-arg https_proxy=$https_proxy
```

[](){ #nginxloadbalancer-nginx-docker-network }

## Create Docker Network

```console
docker network create vllm_nginx
```

[](){ #nginxloadbalancer-nginx-launch-container }

## Launch vLLM Containers

Notes:

- If you have your HuggingFace models cached somewhere else, update `hf_cache_dir` below.
- If you don't have an existing HuggingFace cache you will want to start `vllm0` and wait for the model to complete downloading and the server to be ready. This will ensure that `vllm1` can leverage the model you just downloaded and it won't have to be downloaded again.
- The below example assumes GPU backend used. If you are using CPU backend, remove `--gpus device=ID`, add `VLLM_CPU_KVCACHE_SPACE` and `VLLM_CPU_OMP_THREADS_BIND` environment variables to the docker run command.
- Adjust the model name that you want to use in your vLLM servers if you don't want to use `Llama-2-7b-chat-hf`.

```console
mkdir -p ~/.cache/huggingface/hub/
hf_cache_dir=~/.cache/huggingface/
docker run \
    -itd \
    --ipc host \
    --network vllm_nginx \
    --gpus device=0 \
    --shm-size=10.24gb \
    -v $hf_cache_dir:/root/.cache/huggingface/ \
    -p 8081:8000 \
    --name vllm0 vllm \
    --model meta-llama/Llama-2-7b-chat-hf
docker run \
    -itd \
    --ipc host \
    --network vllm_nginx \
    --gpus device=1 \
    --shm-size=10.24gb \
    -v $hf_cache_dir:/root/.cache/huggingface/ \
    -p 8082:8000 \
    --name vllm1 vllm \
    --model meta-llama/Llama-2-7b-chat-hf
```

!!! note
    If you are behind proxy, you can pass the proxy settings to the docker run command via `-e http_proxy=$http_proxy -e https_proxy=$https_proxy`.

[](){ #nginxloadbalancer-nginx-launch-nginx }

## Launch Nginx

```console
docker run \
    -itd \
    -p 8000:80 \
    --network vllm_nginx \
    -v ./nginx_conf/:/etc/nginx/conf.d/ \
    --name nginx-lb nginx-lb:latest
```

[](){ #nginxloadbalancer-nginx-verify-nginx }

## Verify That vLLM Servers Are Ready

```console
docker logs vllm0 | grep Uvicorn
docker logs vllm1 | grep Uvicorn
```

Both outputs should look like this:

```console
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
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
