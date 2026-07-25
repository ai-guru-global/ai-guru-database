---
title: '世界模型 (World Models) - 2026年完整指南'
category: '03-deep-learning-world-models'
tags: ["deep-learning", "neural-networks", "backpropagation"]
summary: '> **一句话理解**: 世界模型就像AI的"内部模拟器"——它不是生成像素来预测未来，而是在抽象的表征空间中学习世界的运行规律，让AI能够像人类一样进行想象、规划和推理。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "World Models 2026"
  - World_Models_2026
sources: []

---
# 世界模型 (World Models) - 2026 年完整指南

> **一句话理解**: 世界模型就像 AI 的"内部模拟器"——它不是生成像素来预测未来，而是在抽象的表征空间中学习世界的运行规律，让 AI 能够像人类一样进行想象、规划和推理。

---

## 1. 概述 (Overview)

### 什么是世界模型？

**世界模型 (World Model)** 是让AI系统能够预测环境未来状态的内部表示机制。与传统生成模型（如GPT、Sora）不同，世界模型**不直接生成像素或文本**，而是学习**抽象的、压缩的世界表征**，并在这个表征空间中进行预测和规划。

**核心思想演变**:

```
传统生成模型 (Sora/GPT):
输入 → [生成完整输出] → 像素/文本
         ↓
    浪费计算在不可预测的细节上
    (树叶抖动、水波纹的具体形状)

世界模型 (JEPA):
输入 → [编码为抽象表征] → 预测未来表征
         ↓
    学习"本质"和"规律"
    (物体持久性、重力、运动轨迹)
```

### 为什么世界模型是AI的下一个前沿？

| 挑战 | 生成模型局限 | 世界模型优势 |
|------|-------------|-------------|
| **预测不确定性** | 试图预测每个像素，陷入噪声 | 预测抽象表征，忽略无关细节 |
| **规划能力** | 只能"想象"下一步，难以长期规划 | 可在表征空间模拟多步未来 |
| **样本效率** | 需要海量标注数据 | 自监督学习，从观察中学习 |
| **物理理解** | 表面的统计模式匹配 | 学习物体持久性、因果关系 |

### 2026年世界模型里程碑

```
2022.06: LeCun发布"A Path Towards Autonomous Machine Intelligence"
         提出JEPA架构作为通往AGI的路径
2023: I-JEPA (图像版) - CVPR 2023
2024.02: V-JEPA (视频版) - 从视频学习时空表征
2025: V-JEPA 2 - 支持动作条件预测、规划能力
2025.11: LeJEPA - 理论升级，证明可扩展性和防坍塌
2026.01: V-JEPA 2.1 - 密集特征学习，机器人抓取成功率提升20点
2026.03: Yann LeCun创立新公司，专注世界模型商业化
```

---

## 2. 核心概念 (Core Concepts)

### 2.1 JEPA 架构家族

**Joint Embedding Predictive Architecture (联合嵌入预测架构)** 是 Meta AI 在 Yann LeCun 领导下开发的世界模型范式。

```
JEPA核心架构:

┌─────────────────────────────────────────────────────────────┐
│                      JEPA 架构图                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   输入 x (可见区域)              目标 y (被遮挡区域)           │
│       ↓                               ↓                      │
│   ┌─────────┐                    ┌─────────┐                │
│   │ Encoder │                    │ Encoder │                │
│   │   Eₓ    │                    │   Eᵧ    │                │
│   └────┬────┘                    └────┬────┘                │
│        │                              │                     │
│        ↓                              ↓                     │
│    sₓ (上下文表征)                sᵧ (目标表征)              │
│        │                              │                     │
│        └────────┬─────────────────────┘                     │
│                 ↓                                           │\n│           ┌─────────┐                                       │
│           │Predictor│  ← 预测被遮挡区域的表征                │
│           │    P    │                                       │
│           └────┬────┘                                       │
│                ↓                                            │
│            ŝᵧ (预测的目标表征)                              │
│                                                              │
│   损失函数: ‖ŝᵧ - sᵧ‖²  (表征空间预测误差)                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**JEPA vs 生成模型关键区别**:

| 特性 | 生成模型 (MAE/VAE) | JEPA |
|------|-------------------|------|
| **预测目标** | 重建像素/输入 | 预测表征 |
| **损失函数** | 像素级重建误差 | 表征空间距离 |
| **对噪声鲁棒性** | 差 (必须预测每个细节) | 强 (只学本质) |
| **计算效率** | 低 (解码器昂贵) | 高 (无解码器) |

### 2.2 JEPA 家族成员详解

#### I-JEPA (Image JEPA)

**核心创新**: 从图像学习语义表征，无需手工数据增强

```
I-JEPA 掩码策略:

原始图像:           掩码后:              预测目标:
┌────┬────┐        ┌────┬────┐         ┌────┬────┐
│ 1  │ 2  │        │███ │ 2  │         │ 1  │    │
├────┼────┤   →    ├────┼────┤   →     ├────┼────┤
│ 3  │ 4  │        │ 3  │ 4  │         │    │    │
└────┴────┘        └────┴────┘         └────┴────┘

- 块1被遮挡
- 从块2,3,4预测块1的表征
- 不使用像素重建
```

**性能**: 在 ImageNet 上，I-JEPA 学习的表征在下游任务上优于 MAE 和对比学习方法。

#### V-JEPA (Video JEPA)

**核心创新**: 从视频学习时空表征，理解物体运动和物理规律

```
V-JEPA 时空预测:

时间 →

帧t-2:  [可见] ──┐
                ├─→ Predictor ─→ [预测帧t的表征]
帧t-1:  [可见] ──┘         ↑
                          │
帧t:    [被遮挡] ──────────┘ (目标表征)

关键能力:
1. 物体持久性: 遮挡后重新出现时识别同一物体
2. 运动预测: 预测物体轨迹
3. 物理直觉: 理解重力、碰撞等规律
```

#### V-JEPA 2 (2025)

**重大突破**: 支持动作条件预测，可用于机器人控制

| 特性 | V-JEPA | V-JEPA 2 |
|------|--------|----------|
| **训练数据** | 视频观察 | 视频 + 动作标签 |
| **预测能力** | 被动观察 | 动作条件预测 |
| **应用场景** | 表征学习 | 机器人规划 |
| **下游性能** | 分类/检测 | 抓取成功率+20% |

**V-JEPA 2-AC (Action Conditioning)**:
```python
# 概念性伪代码
class VJEPA2AC(nn.Module):
    """动作条件的V-JEPA"""
    
    def forward(self, video_frames, actions):
        # video_frames: [T, C, H, W]
        # actions: [T, action_dim]
        
        # 编码观测
        visual_tokens = self.visual_encoder(video_frames)
        
        # 融合动作信息
        action_tokens = self.action_encoder(actions)
        fused_tokens = visual_tokens + action_tokens
        
        # 预测未来表征
        future_representations = self.predictor(fused_tokens)
        
        return future_representations
```

#### LeJEPA (2025.11) - 理论突破

**核心贡献**: 从理论上证明 JEPA 的可扩展性和防表征坍塌

```
传统自监督学习的问题:
- 需要大量的手工设计技巧防止坍塌
- 训练不稳定，对超参数敏感

LeJEPA的解决方案:
- 基于分布匹配的通用目标函数
- 无需stop-gradient、EMA等启发式技巧
- 提供收敛性和表征质量的数学保证
```

**LeJEPA 核心思想**:
- 将预测问题转化为分布匹配问题
- 使用能量模型框架
- 自然避免表征坍塌

#### VL-JEPA (2025.12) - 视觉语言版

**核心创新**: 将 JEPA 扩展到视觉-语言领域，非自回归生成

```
VL-JEPA vs 传统VLM:

传统VLM (自回归):
图像 → 编码 → [自回归解码] → "一只猫坐在..."
                         ↓
                    逐个token生成，速度慢

VL-JEPA (非自回归):
图像 → 编码 → [预测文本表征] → 完整文本表征
                         ↓
                    一次预测完整语义，
                    仅在语义变化时解码
                    
优势:
- 速度: 并行生成，非顺序
- 选择性解码: 只在需要时解码
- 效率: 对于稳定视频，输出几乎恒定
```

### 2.3 世界模型与规划

**模型预测控制 (MPC) 与世界模型**:

```
传统MPC:                    世界模型MPC:
                           
[观测] → [简化模型] → [轨迹优化]    [观测] → [编码] → [世界模型]
   ↑           ↓                           ↑           ↓
   └───────────┘                    [最优动作] ← [表征空间规划]
                                    
传统模型:                    世界模型优势:
- 需要人工设计动力学方程    - 从数据学习
- 只在特定领域有效          - 通用性强
- 难以处理复杂环境          - 可处理高维观测
```

**世界模型在机器人中的应用**:

```
机器人任务: "抓取桌上的红球"

1. 观测编码:
   摄像头图像 → V-JEPA编码器 → 场景表征

2. 动作条件预测:
   候选动作: "向前移动10cm"
           ↓
   V-JEPA 2-AC → 预测新场景表征

3. 评估与规划:
   - 预测表征中球是否被抓取器覆盖？
   - 距离目标有多远？
   - 选择最优动作序列

4. 执行与闭环:
   执行动作 → 新观测 → 重新规划
```

---

## 3. 2026年技术详解

### 3.1 V-JEPA 2.1 技术突破 (2026.03)

V-JEPA 2.1在多个维度实现突破：

| 维度 | V-JEPA 2 | V-JEPA 2.1 | 提升 |
|------|----------|------------|------|
| **密集预测** | 全局表征 | 像素级密集特征 | 支持精细操作 |
| **深度监督** | 仅最后层 | 多层监督 | 表征质量↑ |
| **多模态** | 仅视频 | 图像+视频统一 | 数据效率↑ |
| **机器人抓取** | 60.8% | 80.8% | +20点 |

**密集特征学习**:
```
传统V-JEPA:                V-JEPA 2.1:

输入视频 → [编码器] → 全局向量    输入视频 → [编码器] → 特征图
                                              ↓
                                      每个位置有独立表征
                                              ↓
                                      支持像素级任务:
                                      - 深度估计
                                      - 物体分割
                                      - 关键点检测
```

### 3.2 能量模型视角

JEPA可以看作**能量模型**:

```
能量函数: E(x, y) = ‖P(Eₓ(x)) - Eᵧ(y)‖²

- 能量低: 预测准确，x和y语义一致
- 能量高: 预测错误，x和y不相关

训练目标: 最小化能量 (让预测更准)
```

**能量模型的优势**:
1. **不确定性建模**: 能量高低反映预测置信度
2. **组合推理**: 可以组合多个约束的能量函数
3. **生成能力**: 通过能量最小化生成合理的未来状态

### 3.3 世界模型 vs 世界模拟器

**重要区分** (2026年理论共识):

| 概念 | 定义 | 代表 |
|------|------|------|
| **世界模拟器** | 生成逼真的未来观测 (像素/文本) | Sora、GPT-4 |
| **世界模型** | 学习预测未来的抽象表征 | JEPA、V-JEPA |

**LeCun的论点**:
> "像素的预测是不可行的——你无法预测风吹树叶的具体抖动模式。但你可以预测树叶会动。世界模型学习的是这个层面的理解，而非像素。"

---

## 4. 应用场景

### 4.1 自动驾驶

**世界模型在自动驾驶中的价值**:

```
传统方法:                   世界模型方法:

感知 → 预测 → 规划          端到端学习世界模型
   ↓      ↓                      ↓
独立模块，误差累积            统一表征，可梯度优化

场景: "前方车辆突然刹车"
- 传统: 检测车辆 → 预测轨迹 → 计算制动距离
- 世界模型: 场景表征 → 预测危险表征 → 直接输出制动动作
```

### 4.2 机器人操作

**V-JEPA 2 在机器人中的实际部署**:

| 任务 | 传统方法 | V-JEPA 2 方法 | 成功率 |
|------|----------|-------------|--------|
| **抓取** | 关键点检测+运动规划 | 视觉表征直接预测抓取结果 | 80.8% |
| **导航** | SLAM+路径规划 | 世界模型预测碰撞风险 | 5.687 ATE |
| **物体交互** | 预定义行为树 | 学习交互 affordance | 7.71 mAP |

### 4.3 视频理解与生成

**VL-JEPA 的应用**:

- **视频问答**: 预测问题的表征，而非逐字生成答案
- **长视频理解**: 高效处理长序列，选择性解码关键片段
- **视频编辑**: 在表征空间操作，实现语义级编辑

---

## 5. 代码实战

### 5.1 I-JEPA极简实现

```python
"""
I-JEPA (Image Joint Embedding Predictive Architecture) 简化实现
参考: https://github.com/facebookresearch/ijepa
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
from vit import VisionTransformer  # 假设已有ViT实现

class IJEPA(nn.Module):
    """I-JEPA: 图像联合嵌入预测架构"""
    
    def __init__(
        self,
        img_size=224,
        patch_size=16,
        embed_dim=768,
        predictor_embed_dim=384,
        depth=12,
        num_heads=12,
    ):
        super().__init__()
        
        self.patch_size = patch_size
        self.num_patches = (img_size // patch_size) ** 2
        
        # 上下文编码器 (处理可见区域)
        self.context_encoder = VisionTransformer(
            img_size=img_size,
            patch_size=patch_size,
            embed_dim=embed_dim,
            depth=depth,
            num_heads=num_heads,
        )
        
        # 目标编码器 (处理被遮挡区域，使用stop-gradient)
        self.target_encoder = VisionTransformer(
            img_size=img_size,
            patch_size=patch_size,
            embed_dim=embed_dim,
            depth=depth,
            num_heads=num_heads,
        )
        
        # 预测器 (窄于编码器，强制学习有效表征)
        self.predictor = Predictor(
            num_patches=self.num_patches,
            embed_dim=embed_dim,
            predictor_embed_dim=predictor_embed_dim,
            depth=6,  # 更浅的预测器
            num_heads=12,
        )
        
        # 初始化目标编码器为上下文编码器的EMA
        self._initialize_target_encoder()
    
    def _initialize_target_encoder(self):
        """用上下文编码器初始化目标编码器"""
        for param_c, param_t in zip(
            self.context_encoder.parameters(),
            self.target_encoder.parameters()
        ):
            param_t.data.copy_(param_c.data)
            param_t.requires_grad = False  # stop-gradient
    
    @torch.no_grad()
    def _update_target_encoder(self, momentum=0.996):
        """EMA更新目标编码器"""
        for param_c, param_t in zip(
            self.context_encoder.parameters(),
            self.target_encoder.parameters()
        ):
            param_t.data = momentum * param_t.data + (1 - momentum) * param_c.data
    
    def forward(self, images, mask_context, mask_target):
        """
        Args:
            images: [B, 3, H, W]
            mask_context: [B, N] bool, 可见区域
            mask_target: [B, M] bool, 目标区域
        Returns:
            loss: 标量
        """
        # 1. 编码上下文
        x_context = self.context_encoder(images, mask_context)  # [B, N_vis, D]
        
        # 2. 预测目标表征
        pred_target = self.predictor(
            x_context, 
            mask_context, 
            mask_target
        )  # [B, M, D]
        
        # 3. 编码目标 (无梯度)
        with torch.no_grad():
            target = self.target_encoder(images, mask_target)  # [B, M, D]
        
        # 4. 计算损失 (L2距离)
        loss = F.mse_loss(pred_target, target)
        
        return loss


class Predictor(nn.Module):
    """窄预测器 - 迫使编码器学习有用的表征"""
    
    def __init__(self, num_patches, embed_dim, predictor_embed_dim, depth, num_heads):
        super().__init__()
        
        # 降维投影
        self.predictor_embed = nn.Linear(embed_dim, predictor_embed_dim)
        
        # 位置编码 (可学习的位置嵌入)
        self.mask_token = nn.Parameter(torch.zeros(1, 1, predictor_embed_dim))
        self.pos_embed = nn.Parameter(
            torch.zeros(1, num_patches, predictor_embed_dim)
        )
        
        # Transformer预测器
        self.blocks = nn.ModuleList([
            PredictorBlock(predictor_embed_dim, num_heads)
            for _ in range(depth)
        ])
        
        self.norm = nn.LayerNorm(predictor_embed_dim)
        
        # 升维投影回编码器维度
        self.predictor_proj = nn.Linear(predictor_embed_dim, embed_dim)
    
    def forward(self, x_context, mask_context, mask_target):
        """
        Args:
            x_context: [B, N_vis, D]
            mask_context: [B, N]
            mask_target: [B, M]
        """
        B = x_context.shape[0]
        
        # 投影到低维
        x = self.predictor_embed(x_context)
        
        # 获取位置编码
        N = mask_context.shape[1]
        pos_embed_vis = self.pos_embed[mask_context].view(B, -1, x.shape[-1])
        x = x + pos_embed_vis
        
        # 添加mask token作为目标位置的占位符
        M = mask_target.shape[1]
        mask_tokens = self.mask_token.expand(B, M, -1)
        pos_embed_target = self.pos_embed[mask_target].view(B, -1, x.shape[-1])
        mask_tokens = mask_tokens + pos_embed_target
        
        # 拼接上下文和mask token
        x = torch.cat([x, mask_tokens], dim=1)
        
        # Transformer处理
        for block in self.blocks:
            x = block(x)
        
        x = self.norm(x)
        
        # 取最后M个位置作为预测
        pred = x[:, -M:]
        
        # 投影回原始维度
        pred = self.predictor_proj(pred)
        
        return pred


# 掩码策略实现
def apply_random_mask(num_patches, mask_ratio=0.75, num_masks=4):
    """
    生成随机掩码
    - mask_ratio: 被遮挡的比例
    - num_masks: 目标块的数量
    """
    # 可见区域 (上下文)
    context_mask = torch.rand(num_patches) > mask_ratio
    
    # 目标区域 (被遮挡)
    target_indices = torch.randperm(num_patches)[:int(num_patches * mask_ratio)]
    target_mask = torch.zeros(num_patches, dtype=torch.bool)
    target_mask[target_indices[:num_masks]] = True
    
    return context_mask, target_mask


# 使用示例
if __name__ == "__main__":
    model = IJEPA(img_size=224, patch_size=16, embed_dim=768)
    
    # 模拟输入
    images = torch.randn(2, 3, 224, 224)
    
    # 生成掩码
    num_patches = (224 // 16) ** 2  # 196
    mask_context, mask_target = apply_random_mask(num_patches)
    mask_context = mask_context.unsqueeze(0).expand(2, -1)
    mask_target = mask_target.unsqueeze(0).expand(2, -1)
    
    # 前向传播
    loss = model(images, mask_context, mask_target)
    print(f"Loss: {loss.item():.4f}")
```

### 5.2 世界模型用于规划

```python
"""
基于世界模型的简单规划器
"""
import torch
import torch.nn as nn

class WorldModelPlanner:
    """使用世界模型进行模型预测控制 (MPC)"""
    
    def __init__(self, world_model, horizon=10, num_samples=100):
        """
        Args:
            world_model: 训练好的世界模型 (V-JEPA 2-AC)
            horizon: 预测 horizon
            num_samples: 采样动作数
        """
        self.world_model = world_model
        self.horizon = horizon
        self.num_samples = num_samples
    
    def plan(self, current_observation, goal_representation):
        """
        使用CEM (Cross-Entropy Method) 进行规划
        
        Args:
            current_observation: 当前观测
            goal_representation: 目标状态的表征
        
        Returns:
            optimal_action: 最优动作
        """
        # 初始化动作分布
        action_mean = torch.zeros(self.horizon, self.action_dim)
        action_std = torch.ones(self.horizon, self.action_dim)
        
        for iteration in range(5):  # CEM迭代
            # 采样动作序列
            actions = torch.randn(
                self.num_samples, self.horizon, self.action_dim
            ) * action_std + action_mean
            
            # 评估每个动作序列
            scores = self._evaluate_action_sequences(
                current_observation, actions, goal_representation
            )
            
            # 选择top-k动作
            k = self.num_samples // 10
            top_indices = torch.topk(scores, k).indices
            top_actions = actions[top_indices]
            
            # 更新分布
            action_mean = top_actions.mean(dim=0)
            action_std = top_actions.std(dim=0) + 1e-6
        
        # 返回第一个动作
        return action_mean[0]
    
    def _evaluate_action_sequences(self, obs, action_sequences, goal):
        """
        评估动作序列的质量
        
        返回: 每个序列的得分 (越高越好)
        """
        scores = []
        
        for actions in action_sequences:
            # 使用世界模型 rollout
            current_rep = self.world_model.encode(obs)
            total_distance = 0
            
            for t in range(self.horizon):
                # 预测下一状态表征
                next_rep = self.world_model.predict(current_rep, actions[t])
                
                # 计算与目标的距离
                distance = torch.norm(next_rep - goal)
                total_distance += distance
                
                current_rep = next_rep
            
            # 得分是负距离 (距离越近越好)
            scores.append(-total_distance.item())
        
        return torch.tensor(scores)
```

---

## 6. 与其他技术的关系

### 6.1 世界模型 vs 强化学习

```
传统RL:                      World Model + RL (Dreamer/TD-MPC):
                              
环境 → [策略网络] → 动作      环境 → [编码器] → 表征
         ↑                         ↓
         └─奖励                   [世界模型] ← 动作
                              ↓
                         [策略] → 动作
                              
优势:
- 样本效率更高 (在想象中学习)
- 可规划多步
- 更好迁移性
```

### 6.2 世界模型 vs 生成模型

| 应用场景 | 推荐技术 | 原因 |
|----------|----------|------|
| **内容创作** | 生成模型 (Sora/DALL-E) | 需要高质量像素输出 |
| **机器人控制** | 世界模型 (JEPA) | 需要理解物理，快速规划 |
| **视频理解** | 两者结合 | JEPA 理解，生成模型增强 |
| **自动驾驶** | 世界模型为主 | 安全关键，需要可解释性 |

---

## 7. 挑战与未来

### 7.1 当前挑战

| 挑战 | 现状 | 研究方向 |
|------|------|----------|
| **长程预测** | 只能预测几帧 | 分层世界模型 |
| **多模态** | 主要是视觉 | 触觉、声音融合 |
| **因果推理** | 相关性学习 | 因果发现算法 |
| **不确定性** | 点预测 | 概率世界模型 (VJEPA) |

### 7.2 未来方向 (2026-2030)

```
2026-2027:
├── 世界模型在机器人中的大规模部署
├── V-JEPA 3: 多模态(视觉+语言+动作)
└── 与LLM结合: 语言作为规划的高级抽象

2028-2030:
├── 通用世界模型: 跨领域迁移
├── 因果世界模型: 理解干预效果
└── 社会世界模型: 理解人类行为
```

### 7.3 Yann LeCun的新公司 (2026.01)

**重大意义**:
- 世界模型从研究走向商业化
- 专注物理AI (机器人、自动驾驶)
- 端到端自监督训练

---

## 8. 参考资源

### 核心论文
- [A Path Towards Autonomous Machine Intelligence](https://openreview.net/pdf?id=BZ5a1r-kVsf) - LeCun 2022
- [I-JEPA](https://arxiv.org/abs/2301.08243) - CVPR 2023
- [V-JEPA](https://arxiv.org/abs/2402.08667) - 2024
- [V-JEPA 2](https://arxiv.org/abs/2506.09985) - 2025
- [LeJEPA](https://arxiv.org/abs/2511.08544) - 2025
- [V-JEPA 2.1](https://arxiv.org/abs/2603.14482) - 2026

### 开源代码
- [facebookresearch/ijepa](https://github.com/facebookresearch/ijepa)
- [facebookresearch/v-jepa](https://github.com/facebookresearch/v-jepa)

### 相关综述
- [Awesome Physical AI](https://github.com/keon/awesome-physical-ai) - 物理 AI 资源汇总
- [World Models in Deep Learning](https://worldmodels.github.io/) - Ha & Schmidhuber

---

*Last updated: 2026-04-01* (Added V-JEPA 2.1, LeJEPA, VL-JEPA updates)

## 相关链接

- [[03_深度学习/07_World_Models/JEPA_Architecture_2026|JEPA 架构 2026]] — 世界模型的代表架构
- [[03_深度学习/07_World_Models/README|世界模型概览]] — 世界模型主题导览
- [[03_深度学习/07_World_Models/index|世界模型索引]] — 世界模型索引
- [[概念/Vision/world-models|世界模型]] — 世界模型概念卡片
- [[概念/Vision/world-models-jepa|JEPA]] — JEPA 概念卡片
- [[06_强化学习/05_Robotics_Embodied_AI/index|机器人与具身智能]] — 世界模型在具身智能中的应用
