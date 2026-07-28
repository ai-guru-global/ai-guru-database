---
title: "AI 开发环境配置: Jupyter + Conda + GPU 一步到位"
category: 01-fundamentals
tags: ["environment", "jupyter", "conda", "gpu", "cuda", "setup", "tools"]
summary: "从安装 Python 到配置 GPU 训练环境的完整指南。覆盖 Conda 环境管理、Jupyter Notebook、VS Code、Google Colab，以及 CUDA/cuDNN 的排查方法。"
created: 2026-06-01
updated: 2026-06-01
tier: supporting
aliases:
  - "Ai Development Environment Setup"
  - "AI Development Environment Setup"
  - AI_Development_Environment_Setup
sources: []

name_zh: "AI 开发环境配置: Jupyter + Conda + GPU 一步到位"
---

> [!warning] 生产安全提示 · Production Safety
> 本文档含可执行命令/操作步骤。执行前请核对风险等级（🟢低/🔶中/🔴高），高危命令必须 dry-run 并确认回滚方案。完整策略见 [生产安全策略](治理/Production_Safety_Policy.md)。
<!-- op-safety-banner v1 -->
# AI 开发环境配置: Jupyter + Conda + GPU 一步到位

> 中文简称：AI 开发环境配置: Jupyter + Conda + GPU 一步到位

> **一句话理解**: 好的环境配置就像好的工作台——工具顺手，效率翻倍。本文帮你一次性搭好 AI 开发的全套工具链。

---

## 1. 环境配置全景图

```
AI 开发环境组件:

┌─────────────────────────────────────────────────────────────┐
│                    你的电脑                                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  操作系统层                                                   │
│  ├── Windows 11 / macOS / Linux (Ubuntu)                    │
│  └── 推荐: Linux > macOS > Windows                          │
│                                                              │
│  环境隔离层 (Conda)                                          │
│  ├── base 环境 (系统默认)                                    │
│  ├── ai-project  (项目A)                                    │
│  ├── nlp-env     (项目B)                                    │
│  └── cv-env      (项目C)                                    │
│                                                              │
│  Python + 核心库                                             │
│  ├── Python 3.10 / 3.11                                     │
│  ├── NumPy / Pandas / Matplotlib                            │
│  └── Scikit-learn / Jupyter                                 │
│                                                              │
│  深度学习框架 (按需安装)                                      │
│  ├── PyTorch  ← 学术界首选                                  │
│  └── TensorFlow / JAX                                       │
│                                                              │
│  GPU 加速层 (可选)                                           │
│  ├── NVIDIA GPU + CUDA Toolkit                              │
│  └── cuDNN (深度学习加速库)                                  │
│                                                              │
│  IDE / 编辑器                                                │
│  ├── VS Code (+ Python 插件)  ← 最推荐                      │
│  ├── Jupyter Notebook / JupyterLab                          │
│  └── PyCharm                                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Conda: 环境管理神器

### 2.1 为什么需要 Conda？

```
问题场景:
├── 项目A需要 PyTorch 1.12 + Python 3.9
├── 项目B需要 PyTorch 2.0 + Python 3.10
└── 项目C需要 TensorFlow 2.11

如果没有 Conda:
└── 你只能反复卸载/重装，最终环境混乱

有了 Conda:
└── 每个项目一个独立环境，互不干扰
```

### 2.2 安装 Miniconda

```bash
# 下载: https://docs.conda.io/en/latest/miniconda.html
# 安装后重启终端

# 验证
conda --version
# conda 23.7.4
```

### 2.3 核心命令

```bash
# 创建环境 (指定 Python 版本)
conda create -n ai python=3.11

# 激活环境
conda activate ai

# 退出环境
conda deactivate

# 查看所有环境
conda env list

# 删除环境
conda remove -n ai --all

# 导出环境配置 (分享给队友)
conda env export > environment.yml

# 从配置文件创建环境
conda env create -f environment.yml
```

### 2.4 在 AI 环境中安装包

```bash
# 激活 AI 环境
conda activate ai

# 安装数据科学基础包
conda install numpy pandas matplotlib scikit-learn jupyter

# 安装 PyTorch (根据官网命令，自动匹配 CUDA 版本)
# 访问 https://pytorch.org/get-started/locally/ 获取最新命令
conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia

# 或者 pip 安装 (如果 conda 找不到)
pip install torch torchvision torchaudio
```

---

## 3. Jupyter Notebook: 交互式编程

### 3.1 为什么 AI 都用 Jupyter？

```
传统编程:       Jupyter:
写完全部代码    写一行 → 看结果 → 再写一行
出错难定位      每步结果可视化
改一点重跑全部  只重跑修改的单元格
不方便展示      直接导出 PDF/HTML 分享
```

### 3.2 启动与使用

```bash
# 安装
pip install jupyter notebook

# 启动 (在项目目录下)
jupyter notebook

# 会自动打开浏览器，地址: http://localhost:8888
```

### 3.3 Jupyter 快捷键

| 快捷键 | 作用 | 使用频率 |
|--------|------|----------|
| `Shift + Enter` | 运行当前单元格 | ⭐⭐⭐⭐⭐ |
| `A` | 上方插入单元格 | ⭐⭐⭐⭐ |
| `B` | 下方插入单元格 | ⭐⭐⭐⭐ |
| `DD` | 删除单元格 | ⭐⭐⭐⭐ |
| `M` | 切换为 Markdown (写说明) | ⭐⭐⭐⭐ |
| `Y` | 切换为 Code | ⭐⭐⭐⭐ |
| `Ctrl + S` | 保存 | ⭐⭐⭐⭐⭐ |

### 3.4 JupyterLab (下一代)

```bash
pip install jupyterlab
jupyter lab  # 更现代的界面，支持文件浏览器、终端、笔记本分屏
```

---

## 4. VS Code: 专业级 AI 开发

### 4.1 为什么推荐 VS Code？

- 免费、轻量、插件丰富
- 原生支持 Jupyter Notebook (`.ipynb` 文件)
- 代码补全、调试、Git 集成
- 远程开发 (连接服务器/GPU 集群)

### 4.2 必装插件

| 插件 | 功能 |
|------|------|
| Python (Microsoft) | Python 语言支持、调试、Linting |
| Jupyter (Microsoft) | 在 VS Code 中运行 Notebook |
| Pylance | 类型检查、智能补全 |
| GitLens | Git 历史查看 |
| Markdown All in One | Markdown 增强 |

### 4.3 连接远程服务器 (GPU 训练必备)

```bash
# 本地 VS Code 安装 Remote-SSH 插件
# 按 Ctrl+Shift+P → "Remote-SSH: Connect to Host"
# 输入: ssh username@server_ip

# 连接后，远程服务器的文件、终端、Jupyter 都在 VS Code 中操作
# 就像操作本地电脑一样
```

---

## 5. Google Colab: 零配置 GPU

### 5.1 什么时候用 Colab？

```
适合场景:
├── 没有 GPU 的电脑 (笔记本/Mac)
├── 快速验证想法 (不用配环境)
├── 学习、教学、复现论文
└── 轻量实验 (免费版有 12h 限制)

不适合场景:
├── 大规模训练 (免费 GPU 有限)
├── 处理隐私数据 (数据上传到 Google)
└── 长时间运行 (会断开)
```

### 5.2 Colab 使用技巧

```python
# 在 Colab 中挂载 Google Drive
from google.colab import drive
drive.mount('/content/drive')

# 切换 GPU 运行时
# 菜单: Runtime → Change runtime type → Hardware accelerator: GPU

# 查看分配的 GPU
!nvidia-smi

# 安装额外包
!pip install transformers datasets

# 上传文件
from google.colab import files
uploaded = files.upload()
```

---

## 6. GPU 环境配置 (NVIDIA)

### 6.1 检查 GPU 是否可用

```bash
# 查看 NVIDIA GPU
nvidia-smi

# 预期输出:
# +---------------------------------------------------------------------------------------+
# | NVIDIA-SMI 535.104.05             Driver Version: 535.104.05   CUDA Version: 12.2     |
# |-----------------------------------------+----------------------+----------------------+
# | GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
# | Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
# |                                         |                      |               MIG M. |
# |=========================================+======================+======================|
# |   0  NVIDIA GeForce RTX 4090        Off | 00000000:01:00.0 Off |                  Off |
# |  0%   45C    P8              20W / 450W |    512MiB / 24564MiB |      0%      Default |
# +-----------------------------------------+----------------------+----------------------+
```

### 6.2 PyTorch 检测 GPU

```python
import torch

print(f"PyTorch 版本: {torch.__version__}")
print(f"CUDA 可用: {torch.cuda.is_available()}")

if torch.cuda.is_available():
    print(f"CUDA 版本: {torch.version.cuda}")
    print(f"GPU 数量: {torch.cuda.device_count()}")
    print(f"GPU 名称: {torch.cuda.get_device_name(0)}")
    
    # 创建一个张量放到 GPU 上
    x = torch.rand(1000, 1000).cuda()
    print(f"张量所在设备: {x.device}")
else:
    print("⚠️ 没有检测到 GPU，训练将使用 CPU (慢 10-100 倍)")
```

### 6.3 常见问题排查

```
问题1: CUDA out of memory
├── 原因: 模型/数据太大，显存不够
└── 解决: 减小 batch_size，使用 torch.cuda.empty_cache()

问题2: CUDA version mismatch
├── 原因: PyTorch 的 CUDA 版本与系统 CUDA 不一致
└── 解决: 重新安装匹配版本的 PyTorch

问题3: No module named 'torch'
├── 原因: 在 base 环境而非 ai 环境中运行
└── 解决: conda activate ai

问题4: Jupyter 中 import 报错
├── 原因: Jupyter 内核没选对环境
└── 解决: python -m ipykernel install --user --name=ai
```

---

## 7. 完整配置清单

```bash
# Step 1: 安装 Miniconda
# https://docs.conda.io/en/latest/miniconda.html

# Step 2: 创建并激活环境
conda create -n ai python=3.11
conda activate ai

# Step 3: 安装基础工具
conda install numpy pandas matplotlib scikit-learn jupyter
pip install jupyterlab

# Step 4: 安装深度学习框架 (选其一)
# PyTorch (推荐)
conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia

# TensorFlow
pip install tensorflow

# Step 5: 验证安装
python -c "import torch; print(torch.__version__); print(torch.cuda.is_available())"
python -c "import numpy, pandas, sklearn; print('All OK')"

# Step 6: 安装 VS Code + Python/Jupyter 插件
# https://code.visualstudio.com/

# Step 7: 将环境注册到 Jupyter
python -m ipykernel install --user --name=ai --display-name="Python (AI)"
```

---

## Related

- [[01_数学基础/Python_for_AI_Basics]] — Python 语法基础
- [[01_数学基础/Python_Data_Science_Toolkit]] — NumPy / Pandas / Matplotlib
- [[01_数学基础/10_AI_Hardware/AI_Hardware_2026]] — GPU 选型指南
- [[02_机器学习/02_Supervised_Learning/Your_First_ML_Model]] — 第一个 ML 模型实战
- [[治理/python-data-science-pipeline|Python × 数据科学]] — 环境配置与工具链
