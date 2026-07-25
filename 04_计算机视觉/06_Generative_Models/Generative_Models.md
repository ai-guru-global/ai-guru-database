---
title: '生成模型 (Generative Models)'
category: '04-computer-vision-generative-models'
tags: ["computer-vision", "cnn", "image-processing"]
summary: '> **一句话理解**: 生成模型就像"AI 画家"——给定文字描述或随机噪声,能创作出逼真的图像、音乐甚至视频,它们不是简单地记忆训练数据,而是学会了"创造"的能力。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Generative Models"
  - Generative_Models
sources: []

---
# 生成模型 (Generative Models)

> **一句话理解**: 生成模型就像"AI 画家"——给定文字描述或随机噪声,能创作出逼真的图像、音乐甚至视频,它们不是简单地记忆训练数据,而是学会了"创造"的能力。

## 1. 概述 (Overview)

生成模型 (Generative Models) 旨在学习数据的真实分布 $p_{data}(x)$,并生成与真实数据相似的全新样本。与判别模型 (区分"是什么") 不同,生成模型关注"如何创造"。

### 核心任务

1. **图像生成**: 根据文本/草图生成高清图像 (Stable Diffusion, DALL-E)
2. **图像编辑**: 局部修改、风格迁移、超分辨率
3. **视频生成**: Sora, Runway Gen-2
4. **3D 生成**: NeRF, DreamFusion
5. **跨模态生成**: 文本→图像、图像→文本

### 发展历程

```
传统方法 (2014 年前):
  - 纹理合成、马尔可夫随机场
  - 效果差,泛化能力弱

GAN 时代 (2014-2020):
  2014: GAN 问世 - 对抗训练范式
  2016: DCGAN - 卷积 GAN
  2018: StyleGAN - 高清人脸生成
  2019: BigGAN - 大规模 ImageNet 生成
  问题: 训练不稳定、模式坍塌

VAE 并行发展:
  2013: VAE - 变分推断框架
  优点: 训练稳定
  缺点: 生成质量模糊

Diffusion 崛起 (2020-至今):
  2020: DDPM - 扩散模型基础
  2022: Stable Diffusion - 开源文生图革命
  2023: Midjourney v5, DALL-E 3 - 商业化成熟
  2024: Sora, Stable Diffusion 3 - 视频生成
  优点: 质量高、训练稳定、可控性强
```

---

## 2. 核心概念 (Core Concepts)

### 2.1 生成对抗网络 (GANs)

#### 核心思想: 对抗博弈

GAN 由两个网络组成,通过对抗训练达到纳什均衡:
- **生成器 (Generator)**: 从噪声生成假样本,目标是"骗过"判别器
- **判别器 (Discriminator)**: 区分真假样本,目标是"识破"生成器

```
       随机噪声 z ~ N(0, I)
              │
              ▼
        ┌──────────┐
        │ Generator│  G(z) → 假图像
        │    G     │
        └────┬─────┘
             │
             ▼ 假图像
        ┌──────────┐      真实图像
        │Discrimina│  ◄───────────
        │   tor D  │
        └────┬─────┘
             │
             ▼
      输出: 真(1) or 假(0)

训练目标: G 想最大化 D(G(z)) (让判别器认为假图是真的)
         D 想最大化 D(真图) 且最小化 D(G(z))
```

#### 损失函数

**判别器损失** (二分类交叉熵):
$$
\mathcal{L}_D = -\mathbb{E}_{x \sim p_{data}}[\log D(x)] - \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]
$$

**生成器损失**:
$$
\mathcal{L}_G = -\mathbb{E}_{z \sim p_z}[\log D(G(z))]
$$

**完整目标** (Min-Max Game):
$$
\min_G \max_D \mathbb{E}_{x \sim p_{data}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]
$$

#### GAN 训练不稳定性原因

| 问题 | 原因 | 表现 | 解决方案 |
|------|------|------|---------|
| **模式坍塌 (Mode Collapse)** | G 只学会生成少数几种样本 | 多样性差 | Unrolled GAN, Spectral Norm |
| **梯度消失** | D 过强时,$\log(1-D(G(z))) \approx 0$ | G 不更新 | Non-saturating Loss, Least Squares GAN |
| **训练不平衡** | D 和 G 更新速度不同步 | 震荡不收敛 | WGAN, Two Time-scale Update Rule |
| **生成质量评估难** | 无客观指标,需人工评估 | 调参困难 | Inception Score, FID |

#### 改进版本对比

| 模型 | 核心改进 | 优点 | 代表应用 |
|------|---------|------|---------|
| **DCGAN** | 全卷积架构,BatchNorm | 训练更稳定 | 图像生成基础 |
| **WGAN** | Wasserstein 距离 + 梯度惩罚 | 解决梯度消失 | 理论基础 |
| **StyleGAN** | 风格注入,AdaIN | 高清人脸,可控生成 | ThisPersonDoesNotExist |
| **BigGAN** | 大 Batch,自注意力 | ImageNet 级别生成 | 大规模生成 |
| **StyleGAN3** | 旋转等变性 | 无伪影 | 最新 SOTA |

### 2.2 扩散模型 (Diffusion Models)

#### 核心思想: 逐步去噪

扩散模型通过两个马尔可夫过程实现生成:
1. **前向过程 (加噪)**: 逐步向数据添加高斯噪声,直到变成纯噪声
2. **反向过程 (去噪)**: 训练神经网络逐步去除噪声,恢复数据

```
前向过程 (固定,不需训练):
x₀ (原图) → x₁ → x₂ → ... → x_T (纯噪声)
 添加噪声   添加噪声        完全噪声

q(x_t | x_{t-1}) = N(x_t; √(1-β_t)·x_{t-1}, β_t·I)


反向过程 (需要训练):
x_T (纯噪声) → x_{T-1} → ... → x₁ → x₀ (生成图)
   去噪         去噪            清晰图像

p_θ(x_{t-1} | x_t) ≈ N(x_{t-1}; μ_θ(x_t, t), Σ_θ(x_t, t))
```

#### 前向过程数学推导

给定初始数据 $x_0$,逐步添加噪声:

$$
q(x_t | x_{t-1}) = \mathcal{N}(x_t; \sqrt{1 - \beta_t} x_{t-1}, \beta_t I)
$$

其中 $\beta_t$ 是噪声调度 (Noise Schedule),通常从 0.0001 到 0.02 线性增长。

**重要性质**: 可以直接从 $x_0$ 采样 $x_t$ (无需迭代):

$$
x_t = \sqrt{\bar{\alpha}_t} x_0 + \sqrt{1 - \bar{\alpha}_t} \epsilon, \quad \epsilon \sim \mathcal{N}(0, I)
$$

其中 $\bar{\alpha}_t = \prod_{i=1}^t (1 - \beta_i)$。

#### 反向过程: 去噪网络

训练 U-Net 预测每一步添加的噪声 $\epsilon$:

$$
\mathcal{L} = \mathbb{E}_{t, x_0, \epsilon}\left[\|\epsilon - \epsilon_\theta(x_t, t)\|^2\right]
$$

**训练算法** (DDPM):
```python
for step in range(num_steps):
    x0 = sample_from_dataset()
    t = random.randint(1, T)
    epsilon = torch.randn_like(x0)
    
    # 前向加噪 (单步直达)
    alpha_bar_t = get_alpha_bar(t)
    xt = sqrt(alpha_bar_t) * x0 + sqrt(1 - alpha_bar_t) * epsilon
    
    # 预测噪声
    epsilon_pred = unet(xt, t)
    
    # 损失
    loss = mse_loss(epsilon_pred, epsilon)
    loss.backward()
```

#### DDPM vs DDIM 采样对比

| 维度 | DDPM | DDIM |
|------|------|------|
| **采样步数** | 1000 步 (慢) | 50 步 (快 20×) |
| **随机性** | 随机采样 (每次不同) | 确定性 (种子相同则相同) |
| **质量** | 高 | 几乎相同 |
| **加速原理** | 马尔可夫链 | **非马尔可夫**,跳步采样 |

**DDIM 加速示意**:
```
DDPM: x_1000 → x_999 → x_998 → ... → x_1 → x_0 (1000 步)
DDIM: x_1000 → x_980 → x_960 → ... → x_20 → x_0 (50 步)
       每次跳 20 步,总时间减少 20×
```

### 2.3 Stable Diffusion 架构

Stable Diffusion 的核心创新是在**潜在空间 (Latent Space)** 而非像素空间进行扩散,大幅降低计算量。

#### Pipeline 完整流程

```
文本提示: "A cat wearing a hat"
    ↓ CLIP Text Encoder
Text Embeddings (77×768)
    ↓
┌───────────────────────────────────────┐
│     Latent Diffusion Model (LDM)      │
│                                       │
│  1. 随机噪声 (4×64×64 latent)         │
│         ↓                             │
│  2. U-Net 去噪 (条件: Text Embeddings)│
│         ↓ 重复 50 次                  │
│  3. 清晰 Latent (4×64×64)             │
└───────────────┬───────────────────────┘
                ▼
          VAE Decoder
                ▼
     最终图像 (3×512×512)
```

**关键组件**:

1. **VAE (Variational Autoencoder)**:
   - Encoder: 图像 (512×512×3) → Latent (64×64×4) (压缩 8×)
   - Decoder: Latent → 图像

2. **U-Net**:
   - 输入: Noisy Latent + 时间步 t + 文本嵌入
   - 输出: 预测的噪声
   - 结构: Encoder (下采样) + Bottleneck (最深层) + Decoder (上采样) + Skip Connections

3. **CLIP Text Encoder**:
   - 将文本编码为 768 维向量
   - 通过 Cross-Attention 注入到 U-Net

#### 为什么在 Latent Space 扩散?

| 维度 | 像素空间 (DALL-E 2) | Latent 空间 (Stable Diffusion) |
|------|---------------------|-------------------------------|
| **分辨率** | 512×512×3 = 786K 维 | 64×64×4 = 16K 维 (压缩 48×) |
| **训练速度** | 慢 (需大量 GPU) | 快 |
| **显存占用** | 高 (>40GB) | 低 (~10GB) |
| **生成速度** | 慢 (每张数分钟) | 快 (A100 上 <2 秒) |

---

## 3. 关键算法/技术详解 (Key Algorithms/Techniques)

### 3.1 条件生成与控制方法

#### ControlNet: 精细化控制

ControlNet 通过额外的"控制分支"为 Stable Diffusion 添加空间控制 (姿态、边缘、深度图等)。

```
        Control Image (如 Canny 边缘图)
                │
                ▼
        ┌──────────────┐
        │ControlNet    │  ← 复制预训练 U-Net 权重
        │(可训练副本)   │
        └───────┬──────┘
                │ 控制信号
                ▼
        ┌──────────────┐
        │   U-Net      │  ← 冻结原始权重
        │(预训练 SD)    │
        └──────────────┘
```

**支持的控制类型**:
- Canny Edge (边缘)
- Depth Map (深度图)
- Pose (姿态关键点)
- Segmentation (分割掩码)
- Normal Map (法线图)

#### IP-Adapter: 图像提示

通过图像嵌入 (而非文本) 控制生成风格。

```
参考图像 → CLIP Image Encoder → Image Embeddings
                                        ↓
Text Embeddings ─────────────► Cross-Attention (U-Net)
```

### 3.2 生成质量评估指标

| 指标 | 全称 | 原理 | 优点 | 缺点 |
|------|------|------|------|------|
| **IS** | Inception Score | 预测多样性 + 清晰度 | 简单 | 不考虑真实分布 |
| **FID** | Fréchet Inception Distance | 真实与生成分布的距离 | **最常用** | 需大量样本 |
| **CLIP Score** | - | 图像-文本匹配度 | 评估文生图对齐 | 仅评估语义 |
| **Human Eval** | 人工评估 | 人类偏好投票 | 最准确 | 成本高 |

#### FID 计算流程

```
1. 从真实数据集和生成模型各采样 10K 张图像
2. 用预训练 Inception-v3 提取特征 (最后池化层)
3. 假设特征服从多元高斯分布: N(μ₁, Σ₁), N(μ₂, Σ₂)
4. 计算 Fréchet 距离:
   FID = ||μ₁ - μ₂||² + Tr(Σ₁ + Σ₂ - 2√(Σ₁Σ₂))
```

**FID 分数越低越好** (0 表示两个分布完全相同)。

### 3.3 加速技术

| 方法 | 原理 | 加速比 | 质量损失 |
|------|------|--------|---------|
| **DDIM** | 非马尔可夫采样 | 20× | 几乎无 |
| **LCM (Latent Consistency Models)** | 蒸馏到一致性模型 | 50× (4-8 步) | 轻微 |
| **Turbo** | 对抗蒸馏 | 100× (1-2 步) | 中等 |
| **Lightning** | 渐进蒸馏 | 10× | 极小 |

---

## 4. 代码实战 (Hands-on Code)

### 使用 Diffusers 库生成图像

```python
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
import torch

# ========== 1. 加载模型 ==========
model_id = "stabilityai/stable-diffusion-2-1"
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    use_safetensors=True
)

# 优化: 使用更快的采样器
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)

# 加载到 GPU
pipe = pipe.to("cuda")

# 可选: 启用内存优化 (适合显存 <16GB)
# pipe.enable_model_cpu_offload()
# pipe.enable_xformers_memory_efficient_attention()

# ========== 2. 生成图像 ==========
prompt = "A serene landscape with mountains at sunset, highly detailed, 4k"
negative_prompt = "blurry, low quality, distorted"

image = pipe(
    prompt=prompt,
    negative_prompt=negative_prompt,
    num_inference_steps=25,  # DDIM 步数 (越大越慢但质量更好)
    guidance_scale=7.5,      # CFG 强度 (7-9 平衡真实与创意)
    height=768,
    width=768,
    generator=torch.manual_seed(42)  # 固定随机种子
).images[0]

image.save("output.png")
print("Image saved to output.png")

# ========== 3. 批量生成 (多样化) ==========
images = pipe(
    prompt=prompt,
    num_images_per_prompt=4,  # 一次生成 4 张
    num_inference_steps=20
).images

for i, img in enumerate(images):
    img.save(f"output_{i}.png")

# ========== 4. 图像到图像 (img2img) ==========
from diffusers import StableDiffusionImg2ImgPipeline
from PIL import Image

img2img_pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16
).to("cuda")

init_image = Image.open("input.jpg").convert("RGB").resize((768, 768))

new_image = img2img_pipe(
    prompt="Turn this into a watercolor painting",
    image=init_image,
    strength=0.75,  # 0-1,越大改动越大
    guidance_scale=7.5,
    num_inference_steps=50
).images[0]

new_image.save("img2img_output.png")

# ========== 5. ControlNet 姿态控制 ==========
from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
from controlnet_aux import OpenposeDetector

# 加载 ControlNet (姿态控制)
controlnet = ControlNetModel.from_pretrained(
    "lllyasviel/control_v11p_sd15_openpose",
    torch_dtype=torch.float16
)

pipe = StableDiffusionControlNetPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    controlnet=controlnet,
    torch_dtype=torch.float16
).to("cuda")

# 提取姿态
openpose = OpenposeDetector.from_pretrained("lllyasviel/ControlNet")
pose_image = openpose(Image.open("person.jpg"))

# 生成
result = pipe(
    prompt="A person in superhero costume",
    image=pose_image,
    num_inference_steps=30
).images[0]

result.save("controlnet_output.png")

# ========== 6. 模型微调 (DreamBooth) ==========
# 训练自己的概念 (如你的宠物)
# 参考: https://github.com/huggingface/diffusers/tree/main/examples/dreambooth
```

### 文本到图像生成的关键参数

| 参数 | 说明 | 推荐值 | 影响 |
|------|------|--------|------|
| **num_inference_steps** | 去噪步数 | 20-50 | 越高质量越好但越慢 |
| **guidance_scale** | CFG (Classifier-Free Guidance) 强度 | 7-9 | 越高越贴合提示词,但过高会过饱和 |
| **negative_prompt** | 负面提示词 | "blurry, low quality" | 避免不想要的特征 |
| **strength** (img2img) | 对原图的修改程度 | 0.5-0.8 | 0=不变, 1=完全重绘 |

---

## 5. 应用场景与案例 (Applications & Cases)

### 5.1 AI 艺术创作
- **工具**: Midjourney, DALL-E 3, Stable Diffusion
- **应用**: 概念设计、插画、NFT 艺术

### 5.2 图像编辑
- **局部编辑**: Inpainting (修复/替换局部区域)
- **超分辨率**: Real-ESRGAN, Stable Diffusion Upscaler
- **风格迁移**: 将照片转为油画/水彩风格

### 5.3 游戏与影视
- **纹理生成**: 游戏场景纹理自动生成
- **概念图**: 快速原型设计
- **视频生成**: Sora, Runway Gen-2 (文本→视频)

### 5.4 虚拟试衣与电商
- **Try-On**: 虚拟试穿衣服
- **产品图生成**: 根据描述生成商品图

### 5.5 医疗影像增强
- **数据增广**: 生成合成医学图像用于训练
- **图像去噪**: 提升低质量 CT/MRI 图像

---

## 6. 进阶话题 (Advanced Topics)

### 6.1 为什么 GAN 训练困难?

**理论原因** (Arjovsky 等,2017):
- GAN 优化的是 JS 散度,当真实分布和生成分布不重叠时,梯度为 0
- 判别器过强时,生成器接收不到有效梯度信号

**实践技巧**:
1. **使用 Spectral Normalization**: 限制判别器的 Lipschitz 常数
2. **标签平滑**: 真实样本标签从 1 改为 0.9
3. **Two Time-scale Update Rule**: D 更新频率 > G

### 6.2 为什么 Diffusion 比 GAN 效果好?

| 维度 | GAN | Diffusion |
|------|-----|----------|
| **训练稳定性** | 不稳定 (对抗) | 稳定 (重构) |
| **模式覆盖** | 易模式坍塌 | 覆盖完整 |
| **生成质量** | 好 | **更好** |
| **训练目标** | Min-Max 博弈 | 简单 MSE 损失 |
| **采样速度** | 快 (1 次前向) | 慢 (50+ 次) |

**为什么稳定?**
- Diffusion 是回归问题 (预测噪声),GAN 是博弈问题
- 损失函数明确,无对抗震荡

### 6.3 常见陷阱

1. **过拟合训练集**: 模型记忆训练数据而非学习分布
   - **解决**: 增大数据集,数据增强
2. **文本对齐差**: 生成图像与提示词不符
   - **解决**: 提高 guidance_scale,优化 Prompt
3. **生成偏见**: 模型可能继承训练数据的社会偏见
   - **解决**: 数据清洗,后处理过滤

---

## 7. 与其他主题的关联 (Connections)

### 前置知识
- [卷积神经网络](../02_Image_Classification_Detection/Image_Classification_Detection.md): U-Net 基础
- [自编码器](03_深度学习/02_Neural_Network_Core/Neural_Network_Core.md): VAE 原理
- [Transformer](05_大模型/04_Transformer_Revolution/Transformer_Revolution.md): CLIP, Attention 机制

### 后续推荐
- [多模态视觉](../08_Multimodal_Vision/Multimodal_Vision.md): CLIP, BLIP
- [图像分割](../03_Segmentation/Segmentation.md): Segment Anything (SAM)
- [3D 视觉](../05_3D_Vision/3D_Vision.md): NeRF, 3D 生成

### 跨领域应用
- [强化学习](../../06_强化学习/README.md): RLHF 对齐生成模型

---

## 8. 面试高频问题 (Interview FAQs)

### Q1: GAN 为什么训练困难?如何解决?

**答**: 核心问题是**对抗训练的不稳定性**。

**具体原因**:
1. **梯度消失**: 判别器过强时,$D(G(z)) \approx 0$,生成器梯度消失
2. **模式坍塌**: 生成器只学会生成少数几种样本
3. **超参数敏感**: 学习率、更新频率需精细调节

**解决方案**:
- **WGAN**: 用 Wasserstein 距离替代 JS 散度
- **Spectral Normalization**: 稳定判别器训练
- **Progressive Growing**: 从低分辨率逐步增长到高分辨率 (StyleGAN)

### Q2: Diffusion Model 为什么比 GAN 效果好?

**答**:
1. **训练稳定**: 优化简单的 MSE 损失 (预测噪声),无对抗博弈
2. **模式覆盖完整**: 逐步去噪覆盖整个数据分布,不会模式坍塌
3. **理论基础扎实**: 基于变分推断和随机微分方程 (SDE)

**代价**: 采样慢 (需要多次前向传播),但 DDIM/LCM 等方法已缓解。

### Q3: Stable Diffusion 的 Latent Space 有什么优势?

**答**: 在**压缩的潜在空间**而非原始像素空间扩散。

**优势**:
1. **降维**: 512×512×3 → 64×64×4 (压缩 48×)
2. **计算高效**: 训练和推理速度快 10-20×
3. **语义平滑**: VAE 的 Latent Space 更平滑,插值效果好

**关键**: VAE 预训练良好,能保留图像主要信息。

### Q4: 如何提升文生图的质量?

**答**:
1. **优化 Prompt**:
   - 详细描述: "A serene lake at sunset, photorealistic, 4k"
   - 添加风格词: "in the style of Studio Ghibli"
   - 使用 Negative Prompt: "blurry, low quality, distorted"

2. **调整参数**:
   - 增加采样步数 (30-50)
   - guidance_scale 7-9 (平衡真实与创意)

3. **后处理**:
   - 超分辨率 (Real-ESRGAN)
   - 面部修复 (CodeFormer)

4. **模型选择**:
   - 使用微调模型 (如 Realistic Vision, DreamShaper)

### Q5: GAN 和 VAE 的区别?

| 维度 | GAN | VAE |
|------|-----|-----|
| **训练方式** | 对抗训练 (博弈) | 变分推断 (重构) |
| **损失函数** | Min-Max | ELBO (重构 + KL 散度) |
| **生成质量** | 清晰 | 略模糊 |
| **训练稳定性** | 不稳定 | **稳定** |
| **潜在空间** | 不可解释 | 可解释 (连续分布) |
| **应用** | 图像生成 | 图像压缩、异常检测 |

**VAE 为什么模糊?**
- 使用 MSE 重构损失,倾向于生成平均化的模糊图像
- GAN 通过判别器强制生成清晰图像

---

## 9. 参考资源 (References)

### 论文
- [Generative Adversarial Networks (GAN)](https://arxiv.org/abs/1406.2661) - Goodfellow et al., 2014
- [Denoising Diffusion Probabilistic Models (DDPM)](https://arxiv.org/abs/2006.11239) - Ho et al., 2020
- [High-Resolution Image Synthesis with Latent Diffusion Models (Stable Diffusion)](https://arxiv.org/abs/2112.10752)
- [StyleGAN2](https://arxiv.org/abs/1912.04958)
- [DDIM: Denoising Diffusion Implicit Models](https://arxiv.org/abs/2010.02502)
- [ControlNet](https://arxiv.org/abs/2302.05543)

### 开源项目
- [Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) - 最流行的 SD 界面
- [Diffusers (Hugging Face)](https://github.com/huggingface/diffusers) - 官方 Python 库
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI) - 节点式工作流
- [Invoke AI](https://github.com/invoke-ai/InvokeAI) - 专业创作工具

### 预训练模型
- [Stable Diffusion 2.1](https://huggingface.co/stabilityai/stable-diffusion-2-1)
- [SDXL 1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) - 更高质量
- [Realistic Vision](https://civitai.com/models/4201/realistic-vision) - 写实风格
- [DreamShaper](https://civitai.com/models/4384/dreamshaper) - 艺术风格

### 社区与教程
- [Civitai](https://civitai.com/) - 模型与 Prompt 分享社区
- [Lexica](https://lexica.art/) - Stable Diffusion 提示词搜索
- [Hugging Face Diffusion 课程](https://huggingface.co/learn/diffusion-course/unit0/1)
- [Stable Diffusion Art](https://stable-diffusion-art.com/) - 教程博客

### 论文解读
- [The Annotated Diffusion Model](https://huggingface.co/blog/annotated-diffusion)
- [Lilian Weng's Blog - Diffusion Models](https://lilianweng.github.io/posts/2021-07-11-diffusion-models/)

## Related

- [[../../05_大模型/10_Multimodal_Models/Multimodal_Architectures_2026|多模态架构]] — 视觉语言模型的架构基础
- [[../../03_深度学习/04_Generative_Models/Diffusion_Models_Deep_Dive|Diffusion 深度页]] — 扩散模型技术细节
- [[../../03_深度学习/04_Generative_Models/GAN_Deep_Dive|GAN 深度页]] — 对抗生成网络详解
- [[../../概念/Vision/generative-vision-models|生成式视觉模型概念卡]] — 概念定义与分类
- [[../../14_RAG系统/05_RAG_Production|视觉 RAG]] — 图像生成与检索增强结合

---

*Last updated: 2026-02-10*
