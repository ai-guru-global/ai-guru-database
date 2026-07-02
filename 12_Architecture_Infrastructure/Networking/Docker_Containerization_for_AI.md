---
title: "Docker & Containerization for AI"
tags: [infrastructure, docker, containers, kubernetes, gpu, production]
status: complete
last_updated: 2026-07-02
sources: []
---

# Docker & Containerization for AI

## Why Containers for AI?

| Benefit | Description |
|---------|-------------|
| **Reproducibility** | Exact same environment across dev/staging/prod |
| **Isolation** | Different CUDA versions, Python versions per project |
| **Portability** | Run anywhere: cloud, on-prem, edge |
| **Scalability** | Kubernetes orchestration for GPU workloads |
| **Efficiency** | Better GPU utilization vs VMs |

## GPU Container Setup

### NVIDIA Container Toolkit

```bash
# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

### Basic GPU Dockerfile

```dockerfile
# Multi-stage build for LLM inference
FROM nvidia/cuda:12.4.0-devel-ubuntu22.04 AS builder

RUN apt-get update && apt-get install -y python3.11 python3-pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM nvidia/cuda:12.4.0-runtime-ubuntu22.04

# Copy Python and dependencies
COPY --from=builder /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=builder /usr/local/bin/python3.11 /usr/local/bin/python3.11
COPY --from=builder /usr/local/lib/python3.11/dist-packages /usr/local/lib/python3.11/dist-packages

WORKDIR /app
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000
CMD ["python3.11", "-m", "vllm.entrypoints.openai.api_server", \
     "--model", "/models/llama-3-70b", \
     "--tensor-parallel-size", "4", \
     "--gpu-memory-utilization", "0.9"]
```

### Multi-GPU Docker Compose

```yaml
version: '3.8'

services:
  vllm-server:
    build: .
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 4
              capabilities: [gpu]
    volumes:
      - model-cache:/models
      - ./config:/config
    ports:
      - "8000:8000"
    environment:
      - CUDA_VISIBLE_DEVICES=0,1,2,3
      - NCCL_DEBUG=INFO
    shm_size: '16gb'  # Shared memory for PyTorch
    
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs

volumes:
  model-cache:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /mnt/models
```

## Docker Best Practices for AI

### Layer Optimization

```dockerfile
# Bad: Installs everything in one layer
RUN pip install torch transformers vllm

# Good: Separate concerns, leverage cache
COPY requirements-base.txt .
RUN pip install --no-cache-dir -r requirements-base.txt

COPY requirements-app.txt .
RUN pip install --no-cache-dir -r requirements-app.txt

COPY . .
```

### Model Weight Management

```dockerfile
# Don't bake large models into image (too large, slow build)
# Bad:
# COPY ./models/llama-3-70b /models/llama-3-70b  # 140GB!

# Good: Use volumes or init containers
VOLUME ["/models"]

# Or download at startup
COPY download_model.py .
RUN python download_model.py --model meta-llama/Llama-3-70B --output /models
```

### Security Hardening

```dockerfile
# Run as non-root
RUN useradd -m -u 1000 appuser
USER appuser

# Read-only filesystem
# docker run --read-only --tmpfs /tmp

# No new privileges
# docker run --security-opt no-new-privileges

# Scan for vulnerabilities
# docker scout cves my-image:latest
```

## Kubernetes GPU Containers

### GPU Pod Specification

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: llm-inference
spec:
  containers:
  - name: vllm
    image: vllm/vllm-openai:latest
    resources:
      limits:
        nvidia.com/gpu: 4
        memory: "64Gi"
        cpu: "8"
      requests:
        nvidia.com/gpu: 4
        memory: "32Gi"
        cpu: "4"
    volumeMounts:
    - name: model-storage
      mountPath: /models
    - name: shm
      mountPath: /dev/shm
    env:
    - name: NCCL_DEBUG
      value: "INFO"
  volumes:
  - name: model-storage
    persistentVolumeClaim:
      claimName: model-pvc
  - name: shm
    emptyDir:
      medium: Memory
      sizeLimit: "16Gi"
  nodeSelector:
    nvidia.com/gpu.product: "NVIDIA-H100-80GB-HBM3"
  tolerations:
  - key: nvidia.com/gpu
    operator: Exists
    effect: NoSchedule
```

### Multi-Node Training Job

```yaml
apiVersion: kubeflow.org/v1
kind: PyTorchJob
metadata:
  name: pretraining-job
spec:
  pytorchReplicaSpecs:
    Master:
      replicas: 1
      template:
        spec:
          containers:
          - name: pytorch
            image: my-registry/training:latest
            resources:
              limits:
                nvidia.com/gpu: 8
            env:
            - name: MASTER_ADDR
              value: "pretraining-job-master-0"
            - name: MASTER_PORT
              value: "29500"
            - name: WORLD_SIZE
              value: "32"
    Worker:
      replicas: 3
      template:
        spec:
          containers:
          - name: pytorch
            image: my-registry/training:latest
            resources:
              limits:
                nvidia.com/gpu: 8
```

## Container Image Size Optimization

| Base Image | Size | Use Case |
|-----------|------|----------|
| nvidia/cuda:12.4.0-devel | ~8 GB | Training (needs nvcc) |
| nvidia/cuda:12.4.0-runtime | ~3 GB | Inference |
| python:3.11-slim + CUDA | ~1.5 GB | Light inference |
| distroless + CUDA | ~500 MB | Minimal attack surface |

### Build Optimization

```bash
# Build with BuildKit for better caching
DOCKER_BUILDKIT=1 docker build -t my-ai-app:latest .

# Multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 -t my-ai-app:latest .

# Squash layers
docker build --squash -t my-ai-app:squashed .
```

## CI/CD for Container Images

```yaml
# GitHub Actions
name: Build and Push AI Image
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Login to registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ghcr.io/myorg/ai-app:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max
    
    - name: Scan vulnerabilities
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: ghcr.io/myorg/ai-app:latest
```

## Related Topics

- [[Kubernetes_Core_Components_Deep_Dive]]: K8s fundamentals
- [[AI_Stack_Container_Runtime_Guide]]: Container runtime for AI
- [[CI_CD_Pipeline_AI_2026]]: CI/CD pipelines
- [[12_Architecture_Infrastructure/Architecture_Overview/AI_Infrastructure_2026]]: GPU management
