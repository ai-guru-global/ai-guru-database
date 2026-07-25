---
title: '隐私保护 AI (Privacy-Preserving AI) 2026'
category: '17-ethics-safety-privacy-preserving-ai'
tags: ["ai-ethics", "safety", "alignment", "red-teaming", "serving"]
summary: '> **一句话理解**: 隐私保护AI是在"数据价值释放"和"隐私安全保护"之间找到平衡的技术体系——不是简单的数据脱敏，而是通过联邦学习、同态加密差分隐私等前沿技术，让AI在看不到原始数据的情况下仍能学习。'
created: '2026-05-31'
updated: '2026-05-31'
tier: supporting
aliases:
  - "Privacy Preserving Ai"
  - "Privacy Preserving AI"
  - Privacy_Preserving_AI
sources: []

---
# 隐私保护 AI (Privacy-Preserving AI) 2026

> **一句话理解**: 隐私保护 AI 是在"数据价值释放"和"隐私安全保护"之间找到平衡的技术体系——不是简单的数据脱敏，而是通过联邦学习、同态加密差分隐私等前沿技术，让 AI 在看不到原始数据的情况下仍能学习。

---

## 1. 概述 (Overview)

### 1.1 为什么隐私保护AI至关重要

```
2026年隐私挑战:

数据困境:
├── AI需要大量数据训练才能达到高性能
├── 但数据往往包含个人隐私信息
├── 监管要求越来越严格 (GDPR, CCPA, 中国PIPL)
└── 数据泄露风险和成本持续上升

2026关键数据:
├── 82% 的用户担心AI使用个人数据
├── 平均数据泄露成本: $488万
├── 监管罚款同比增长: 45%
└── 67% 的AI项目因隐私问题延迟
```

### 1.2 隐私保护技术全景

```
┌─────────────────────────────────────────────────────────────┐
│                Privacy-Preserving AI Technologies           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  数据保护层                                                   │
│  ├── 差分隐私 (Differential Privacy)                        │
│  ├── 联邦学习 (Federated Learning)                          │
│  └── 安全多方计算 (Secure Multi-Party Computation)          │
│                                                              │
│  计算保护层                                                   │
│  ├── 同态加密 (Homomorphic Encryption)                     │
│  ├── TEE可信执行环境 (Trusted Execution Environment)       │
│  └── 安全飞地 (Secure Enclaves)                            │
│                                                              │
│  输出保护层                                                   │
│  ├── PII检测与脱敏                                          │
│  ├── 输出审计与过滤                                         │
│  └── 成员推断防御                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 差分隐私 (Differential Privacy)

### 2.1 核心概念

```
差分隐私定义:

一个随机机制M提供(ε, δ)-差分隐私，如果对于任何两个相邻数据集
D和D'（相差一个元素），以及任何输出集合S:

Pr[M(D) ∈ S] ≤ e^ε · Pr[M(D') ∈ S] + δ

参数解读:
├── ε (epsilon): 隐私预算，越小越隐私
├── δ (delta): 失败概率，通常很小
└── 核心思想: 添加随机噪声，使得无法判断个体是否在数据集中
```

### 2.2 差分隐私实现

```python
"""差分隐私机制实现"""

import numpy as np
import torch
from typing import Callable

class DifferentialPrivacy:
    """差分隐私机制"""
    
    @staticmethod
    def laplace_mechanism(
        query_result: float,
        sensitivity: float,
        epsilon: float
    ) -> float:
        """
        拉普拉斯机制
        
        Args:
            query_result: 原始查询结果
            sensitivity: 敏感度 (相邻数据集查询结果的最大差异)
            epsilon: 隐私预算
        """
        # 拉普拉斯噪声的scale参数
        scale = sensitivity / epsilon
        
        # 添加拉普拉斯噪声
        noise = np.random.laplace(0, scale)
        
        return query_result + noise
    
    @staticmethod
    def gaussian_mechanism(
        query_result: float,
        sensitivity: float,
        epsilon: float,
        delta: float = 1e-5
    ) -> float:
        """
        高斯机制
        
        适用于需要更严格隐私保证的场景
        """
        # 计算所需的标准差
        c = np.sqrt(2 * np.log(1.25 / delta))
        sigma = c * sensitivity / epsilon
        
        noise = np.random.normal(0, sigma)
        
        return query_result + noise
    
    @staticmethod
    def compose_dp_mechanisms(
        mechanisms: list,
        epsilon_budget: float
    ) -> float:
        """
        差分隐私组合定理
        多个DP机制组合后的隐私保证
        """
        # 序列组合: 总隐私预算 = sum(ε_i)
        total_epsilon = sum(m["epsilon"] for m in mechanisms)
        
        if total_epsilon > epsilon_budget:
            raise ValueError(
                f"Privacy budget exceeded: {total_epsilon} > {epsilon_budget}"
            )
        
        return epsilon_budget - total_epsilon


class DPGradientDescent:
    """
    差分隐私梯度下降 (DP-SGD)
    用于训练隐私保护的机器学习模型
    """
    
    def __init__(
        self,
        epsilon: float = 1.0,
        delta: float = 1e-5,
        max_grad_norm: float = 1.0,
        noise_multiplier: float = 1.1
    ):
        self.epsilon = epsilon
        self.delta = delta
        self.max_grad_norm = max_grad_norm
        self.noise_multiplier = noise_multiplier
    
    def clip_gradients(self, gradients: torch.Tensor) -> torch.Tensor:
        """
        梯度裁剪
        每条梯度的L2范数不超过max_grad_norm
        """
        grad_norm = torch.norm(gradients)
        
        if grad_norm > self.max_grad_norm:
            gradients = gradients * (self.max_grad_norm / grad_norm)
        
        return gradients
    
    def add_noise(self, gradients: torch.Tensor) -> torch.Tensor:
        """
        添加高斯噪声
        """
        noise = torch.randn_like(gradients) * self.noise_multiplier * self.max_grad_norm
        return gradients + noise
    
    def train_step(
        self,
        model: torch.nn.Module,
        optimizer: torch.optim.Optimizer,
        inputs: torch.Tensor,
        targets: torch.Tensor
    ) -> dict:
        """
        单步差分隐私训练
        """
        model.train()
        
        # 前向传播
        outputs = model(inputs)
        loss = torch.nn.functional.cross_entropy(outputs, targets)
        
        # 反向传播
        optimizer.zero_grad()
        loss.backward()
        
        # 获取梯度
        gradients = []
        for param in model.parameters():
            if param.grad is not None:
                # 1. 裁剪
                clipped_grad = self.clip_gradients(param.grad)
                # 2. 添加噪声
                noisy_grad = self.add_noise(clipped_grad)
                gradients.append(noisy_grad)
                param.grad = noisy_grad
        
        optimizer.step()
        
        return {
            "loss": loss.item(),
            "grad_norm": torch.norm(
                torch.stack([g.norm() for g in gradients])
            ).item()
        }
```

### 2.3 PATE 框架

```python
"""PATE (Teacher Ensemble) 差分隐私学习框架"""

import numpy as np
from collections import Counter

class PATE:
    """
    PATE: 通过教师集合实现差分隐私知识迁移
    
    核心思想:
    1. 用有隐私的数据训练多个"教师"模型
    2. 教师对学生模型进行"投票"，噪声注入保护隐私
    3. 最终学生模型学到的是聚合后的知识，而非原始数据
    """
    
    def __init__(self, n_teachers: int, epsilon: float):
        self.n_teachers = n_teachers
        self.epsilon = epsilon
        self.teachers = []
    
    def train_teachers(self, datasets: list):
        """
        用不同子集训练教师模型
        """
        for i, dataset in enumerate(datasets):
            teacher = self._create_teacher()
            teacher.fit(dataset)
            self.teachers.append(teacher)
            print(f"Teacher {i+1}/{self.n_teachers} trained")
    
    def _create_teacher(self):
        """创建教师模型"""
        # 这里可以是任何分类模型
        from sklearn.ensemble import RandomForestClassifier
        return RandomForestClassifier(n_estimators=100)
    
    def student_prediction(
        self,
        unlabeled_data: np.ndarray,
        noise_threshold: int = None
    ) -> np.ndarray:
        """
        学生模型预测
        
        教师们对无标签数据进行预测
        聚合结果时添加噪声来保护隐私
        """
        # 收集所有教师的预测
        predictions = np.array([
            teacher.predict(unlabeled_data)
            for teacher in self.teachers
        ])
        
        # 投票聚合
        n_samples = unlabeled_data.shape[0]
        aggregated = []
        
        for i in range(n_samples):
            votes = predictions[:, i]
            label_counts = Counter(votes)
            
            # 添加拉普拉斯噪声
            if noise_threshold is None:
                noisy_counts = {
                    label: count + np.random.laplace(0, 1/self.epsilon)
                    for label, count in label_counts.items()
                }
                predicted_label = max(noisy_counts, key=noisy_counts.get)
            else:
                # Gaussian noise for threshold
                max_count = max(label_counts.values())
                if max_count + np.random.normal(0, 1/self.epsilon) < noise_threshold:
                    predicted_label = -1  # 拒绝预测
                else:
                    predicted_label = max(label_counts, key=label_counts.get)
            
            aggregated.append(predicted_label)
        
        return np.array(aggregated)
```

---

## 3. 联邦学习 (Federated Learning)

### 3.1 联邦学习概念

```
联邦学习架构:

┌─────────────────────────────────────────────────────────────┐
│                    Central Server                            │
│                    (协调器/聚合器)                           │
│                         ▲                                    │
│                         │ 加密梯度                            │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Client A │    │ Client B │    │ Client C │
    │ (手机)   │    │ (医院)   │    │ (银行)   │
    └──────────┘    └──────────┘    └──────────┘
          │               │               │
          ▼               ▼               ▼
    本地数据训练     本地数据训练     本地数据训练
    (不离开设备)     (不离开设备)     (不离开设备)
```

### 3.2 联邦学习实现

```python
"""联邦学习框架"""

import torch
import torch.nn as nn
from typing import List, Dict
import numpy as np

class FederatedLearning:
    """联邦学习框架"""
    
    def __init__(self, model_fn, n_clients: int):
        self.model_fn = model_fn
        self.n_clients = n_clients
        self.global_model = model_fn()
    
    def client_update(
        self,
        client_id: int,
        local_data: torch.utils.data.DataLoader,
        local_epochs: int = 5
    ) -> Dict[str, torch.Tensor]:
        """
        客户端本地更新
        
        只有梯度被发送回服务器，原始数据保留在本地
        """
        # 复制全局模型到本地
        local_model = self.model_fn()
        local_model.load_state_dict(self.global_model.state_dict())
        
        # 本地训练
        optimizer = torch.optim.SGD(local_model.parameters(), lr=0.01)
        
        for epoch in range(local_epochs):
            for batch_data, batch_labels in local_data:
                optimizer.zero_grad()
                outputs = local_model(batch_data)
                loss = nn.functional.cross_entropy(outputs, batch_labels)
                loss.backward()
                optimizer.step()
        
        # 返回模型更新 (权重差异)
        updates = {
            k: v - self.global_model.state_dict()[k]
            for k in self.global_model.state_dict().keys()
        }
        
        return {
            "client_id": client_id,
            "n_samples": len(local_data.dataset),
            "updates": updates
        }
    
    def server_aggregate(
        self,
        client_updates: List[Dict]
    ) -> None:
        """
        服务器端聚合 (FedAvg)
        
        加权平均客户端的模型更新
        """
        total_samples = sum(u["n_samples"] for u in client_updates)
        
        # 初始化聚合梯度
        aggregated_updates = {
            k: torch.zeros_like(v)
            for k, v in self.global_model.state_dict().items()
        }
        
        # 加权平均
        for update in client_updates:
            weight = update["n_samples"] / total_samples
            for k in aggregated_updates.keys():
                aggregated_updates[k] += weight * update["updates"][k]
        
        # 应用聚合更新
        with torch.no_grad():
            for k in self.global_model.state_dict().keys():
                self.global_model.state_dict()[k] += aggregated_updates[k]
    
    def federated_round(
        self,
        client_dataLoaders: List[torch.utils.data.DataLoader],
        local_epochs: int = 5
    ) -> Dict:
        """
        一轮联邦学习
        """
        # 1. 并行训练
        client_updates = []
        for i, dataLoader in enumerate(client_dataLoaders):
            update = self.client_update(i, dataLoader, local_epochs)
            client_updates.append(update)
        
        # 2. 聚合
        self.server_aggregate(client_updates)
        
        # 3. 计算这一轮的统计信息
        return {
            "n_clients": len(client_updates),
            "total_samples": sum(u["n_samples"] for u in client_updates),
            "aggregation": "fedavg"
        }


class SecureFederatedLearning(FederatedLearning):
    """
    安全增强的联邦学习
    
    防御:
    - 模型逆向攻击
    - 成员推断攻击
    - 梯度泄露攻击
    """
    
    def __init__(self, *args, dp_epsilon: float = 1.0, **kwargs):
        super().__init__(*args, **kwargs)
        self.dp_epsilon = dp_epsilon
    
    def client_update_secure(
        self,
        client_id: int,
        local_data: torch.utils.data.DataLoader,
        local_epochs: int = 5
    ) -> Dict:
        """
        安全客户端更新 - 添加差分隐私
        """
        # 获取普通更新
        update = self.client_update(client_id, local_data, local_epochs)
        
        # 添加噪声
        for k in update["updates"].keys():
            sensitivity = torch.norm(update["updates"][k])
            noise = torch.randn_like(update["updates"][k]) * sensitivity / self.dp_epsilon
            update["updates"][k] += noise
        
        return update
```

### 3.3 垂直联邦学习

```python
"""垂直联邦学习 - 数据垂直切分"""

class VerticalFederatedLearning:
    """
    垂直联邦: 不同客户端拥有不同特征
    例如: 银行有信用特征，电商有消费特征
    
    挑战: 如何在不共享特征的情况下联合建模
    """
    
    def __init__(self, n_parties: int):
        self.n_parties = n_parties
        self.local_models = []
        self.aggregator = None
    
    def train_vertically(
        self,
        party_features: List[torch.Tensor],  # 每个参与方的特征
        party_labels: List[torch.Tensor],      # 标签 (只在一方)
        label_holder: int = 0                  # 标签持有方
    ):
        """
        垂直联邦训练
        """
        # Step 1: 各方并行训练本地模型
        local_outputs = []
        for i, features in enumerate(party_features):
            if i == label_holder:
                # 标签持有方: 训练监督学习
                local_model = self._train_supervised(features, party_labels[i])
            else:
                # 非标签方: 训练表示学习
                local_model = self._train_representation(features)
            
            self.local_models.append(local_model)
            local_outputs.append(local_model(features))
        
        # Step 2: 安全聚合
        # 使用加密技术确保各方无法看到其他方的中间输出
        aggregated = self._secure_aggregate(local_outputs)
        
        # Step 3: 标签方完成最终训练
        final_model = self._train_final(aggregated, party_labels[label_holder])
        
        return final_model
    
    def _secure_aggregate(self, local_outputs: list) -> torch.Tensor:
        """
        安全聚合 - 使用秘密共享
        """
        # 简化示例: 实际需要使用安全多方计算
        return torch.mean(torch.stack(local_outputs), dim=0)
```

---

## 4. 同态加密 (Homomorphic Encryption)

### 4.1 同态加密概念

```
同态加密允许在密文上直接进行计算:

传统模式:
明文数据 → 加密 → 密文 → 解密 → 明文 → 计算 → ...

同态加密模式:
明文数据 → 加密 → 密文 → (密文上计算) → 密文结果 → 解密 → 明文结果

支持的操作:
├── HE: 加法、乘法 (多项式深度限制)
├── FHE: 任意次数的加法和乘法
└── TFHE: 任意布尔电路

适用场景:
├── 加密数据推理
├── 加密数据训练 (实验性)
└── 安全外包计算
```

### 4.2 同态加密实现

```python
"""使用Concrete (TFHE)进行隐私保护推理"""

# !pip install concrete-ml
from concrete.ml.torch.compile import compile_torch_model
import numpy as np

class PrivacyPreservingInference:
    """
    使用同态加密的隐私保护推理
    """
    
    def __init__(self, model: torch.nn.Module, input_shape: tuple):
        self.model = model
        self.input_shape = input_shape
        self.compiled_model = None
    
    def compile_for_fhe(self, x_train: np.ndarray):
        """
        将PyTorch模型编译为FHE兼容模型
        """
        # 创建示例输入
        x_example = np.random.randn(*self.input_shape).astype(np.float32)
        
        # 编译
        self.compiled_model = compile_torch_model(
            self.model,
            x_example,
            n_bits=8  # 量化位数
        )
        
        print("Model compiled for FHE execution")
        print(f"Table lookups required: {self.compiled_model.complexity}")
    
    def encrypt_and_infer(self, x: np.ndarray, client_key) -> dict:
        """
        在客户端加密数据并发送到服务器推理
        """
        # 客户端: 加密输入
        x_encrypted = client_key.encrypt(x)
        
        # 发送到服务器 (服务器从未看到明文)
        # 服务器: 在密文上执行推理
        result_encrypted = self.compiled_model.quantize_run(x_encrypted)
        
        # 客户端: 解密结果
        result = client_key.decrypt(result_encrypted)
        
        return {
            "prediction": result,
            "data_never_exposed": True
        }


# 示例: 隐私保护医疗诊断
def privacy_preserving_medical_ai():
    """
    场景: 医院A有患者数据，想让AI服务商B进行诊断
    但双方都不愿意共享原始数据
    """
    
    # Step 1: AI服务商训练模型
    diagnostic_model = build_diagnostic_model()
    diagnostic_model.train(train_data)
    
    # Step 2: 编译为FHE模型
    ppi = PrivacyPreservingInference(diagnostic_model, input_shape=(1, 100))
    ppi.compile_for_fhe(x_train)
    
    # Step 3: 生成客户端密钥
    from concrete.ml.deployment.deployment_utils import (
        generate_bootstrap_keys
    )
    client_key = generate_bootstrap_keys(ppi.compiled_model)
    
    # Step 4: 医院A加密患者数据
    patient_data = extract_features(patient_record)
    encrypted_prediction = ppi.encrypt_and_infer(patient_data, client_key)
    
    # 医院A得到诊断结果，但AI服务商B不知道患者任何信息
    return encrypted_prediction["prediction"]
```

### 4.3 隐私保护技术全景对比

| **技术** | **隐私保证类型** | **计算开销** | **通信开销** | **模型精度损失** | **数据可见性** | **可扩展性** |
|---|---|---|---|---|---|---|
| 差分隐私 (DP-SGD) | 数学可证明 | 增加 20-50% | 无额外开销 | 2-10% | 原始数据不可见 | 高 |
| 联邦学习 (FedAvg) | 数据不出本地 | 无额外开销 | 梯度传输 | 1-5% | 仅梯度可见 | 中 |
| 同态加密 (FHE) | 加密计算 | 增加 100-10000× | 密文传输 | 0% (精确) | 全程密文 | 低 |
| TEE 可信执行环境 | 硬件隔离 | 增加 5-15% | 无额外开销 | 0% (精确) | 内存加密 | 高 |
| 安全多方计算 (MPC) | 密码学保证 | 增加 100-1000× | 多轮通信 | 0% (精确) | 分片不可见 | 低 |
| PATE 框架 | 差分隐私+集成 | 增加 50-100% | 投票通信 | 3-8% | 聚合标签可见 | 中 |

### 4.4 隐私预算 (ε) 与精度权衡

| **隐私预算 (ε)** | **隐私保护级别** | **模型精度影响** | **典型应用场景** | **所需噪声量** | **合规要求** |
|---|---|---|---|---|---|
| ε = 0.1 | 极强保护 | 精度下降 15-30% | 医疗敏感数据 | 极大 | GDPR 严格条款 |
| ε = 1.0 | 强保护 | 精度下降 5-10% | 金融风控模型 | 大 | PIPL 推荐标准 |
| ε = 5.0 | 中等保护 | 精度下降 2-5% | 推荐系统 | 中 | 一般合规 |
| ε = 10.0 | 基础保护 | 精度下降 1-2% | 通用 NLP 模型 | 小 | 最低要求 |
| ε = ∞ (无 DP) | 无保护 | 无精度损失 | 公开数据训练 | 无 | 不适用 |

> **注**: ε 值越小隐私保护越强，但模型效用会降低。实际部署中 ε=1.0~8.0 是常见选择区间。

---

## 5. 隐私攻击与防御

### 5.1 成员推断攻击 (Membership Inference Attack)

```python
"""成员推断攻击"""

class MembershipInferenceAttack:
    """
    攻击者判断某个数据是否被用于训练模型
    
    原理: 模型对其训练数据往往有更高的置信度
    """
    
    def __init__(self, target_model):
        self.target_model = target_model
    
    def attack(
        self,
        shadow_model,
        target_data: list,
        train_data: list
    ) -> dict:
        """
        成员推断攻击
        """
        # Step 1: 训练shadow model
        shadow_model.train(train_data)
        
        # Step 2: 创建攻击数据集
        attack_samples = []
        
        # 成员样本 (训练数据)
        for x in train_data[:1000]:
            pred = shadow_model.predict(x)
            attack_samples.append((x, 1, pred))  # label=1 表示成员
        
        # 非成员样本
        for x in target_data:
            if x not in train_data:
                pred = shadow_model.predict(x)
                attack_samples.append((x, 0, pred))  # label=0 表示非成员
        
        # Step 3: 训练攻击模型
        attack_model = self._train_attack_model(attack_samples)
        
        # Step 4: 在真实目标上评估
        results = []
        for x in target_data:
            pred = self.target_model.predict(x)
            is_member = attack_model.predict(pred.reshape(1, -1))
            results.append({"data": x, "is_member": is_member})
        
        return {
            "attack_success_rate": sum(r["is_member"] for r in results) / len(results),
            "members_identified": [r for r in results if r["is_member"]]
        }


class MembershipDefense:
    """
    成员推断攻击防御
    """
    
    @staticmethod
    def apply_regularization(model, train_loader):
        """
        通过正则化减少过拟合
        降低模型对训练数据的置信度
        """
        for name, param in model.named_parameters():
            if "weight" in name:
                # 权重衰减
                param.data *= 0.99
        
        return model
    
    @staticmethod
    def add_noise_to_predictions(predictions, epsilon=0.1):
        """
        对预测添加噪声
        """
        noisy_predictions = predictions + np.random.laplace(0, epsilon)
        return noisy_predictions
    
    @staticmethod
    def use_dropout(model, rate=0.5):
        """
        训练时使用dropout使推理不确定性增加
        """
        for module in model.modules():
            if isinstance(module, torch.nn.Dropout):
                module.p = rate
        return model
```

### 5.2 模型逆向攻击 (Model Inversion Attack)

```python
"""模型逆向攻击与防御"""

class ModelInversionAttack:
    """
    攻击者通过查询模型恢复训练数据
    """
    
    def __init__(self, model):
        self.model = model
    
    def reconstruct_training_data(
        self,
        class_label: int,
        n_iterations: int = 1000
    ) -> np.ndarray:
        """
        从模型输出重建某个类别的典型训练数据
        """
        # 从随机噪声开始
        x = np.random.randn(1, *self.input_shape)
        x.requires_grad = True
        
        for i in range(n_iterations):
            # 前向传播
            output = self.model(x)
            
            # 最大化目标类的概率
            loss = -output[0, class_label]
            
            # 反向传播
            loss.backward()
            
            # 梯度上升
            x.grad = None
            x = x + 0.01 * x.grad
        
        return x.detach()


class ModelInversionDefense:
    """
    模型逆向攻击防御
    """
    
    @staticmethod
    def gradient_sparsification(gradients, sparsity=0.9):
        """
        梯度稀疏化: 只传递大部分梯度
        """
        k = int(gradients.numel() * sparsity)
        values, indices = torch.topk(
            torch.abs(gradients.flatten()), k
        )
        sparse_grad = torch.zeros_like(gradients.flatten())
        sparse_grad[indices] = values
        return sparse_grad.reshape(gradients.shape)
    
    @staticmethod
    def confidence_calibration(model, calibration_data):
        """
        置信度校准: 降低过高置信度
        """
        from sklearn.calibration import CalibratedClassifierCV
        
        # 使用Platt缩放校准
        # ...
        return model
```

### 5.3 隐私攻击与防御方法对照表

| **攻击类型** | **攻击目标** | **攻击成功率** | **所需信息** | **对应防御措施** | **防御后成功率** |
|---|---|---:|---|---|---:|
| 成员推断攻击 | 判断数据是否在训练集 | 60-85% | 模型查询权限 | DP-SGD, 正则化 | 52-58% |
| 模型逆向攻击 | 重建训练数据特征 | 40-70% | 大量模型查询 | 输出噪声, 置信度校准 | 15-25% |
| 梯度泄露攻击 | 从梯度恢复原始数据 | 70-95% | 联邦学习梯度 | 梯度裁剪+DP噪声 | 20-35% |
| 属性推断攻击 | 推断训练数据属性 | 55-75% | 模型输出概率 | 输出扰动, PATE | 50-55% |
| 模型提取攻击 | 复制目标模型行为 | 80-95% | 大量查询 | 查询速率限制, 水印 | 60-70% |
| 数据投毒攻击 | 植入后门/降低精度 | 50-80% | 训练数据访问 | 数据审计, 鲁棒聚合 | 10-25% |

---

## 6. 隐私保护 AI 最佳实践

### 6.1 企业隐私保护 AI 框架

```
隐私保护AI实施路径:

┌─────────────────────────────────────────────────────────────┐
│                   Privacy-Preserving AI Journey             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Phase 1: 评估与规划                                          │
│  ├── 数据隐私审计                                            │
│  ├── 识别敏感数据                                            │
│  ├── 确定隐私预算                                            │
│  └── 选择技术方案                                            │
│                                                              │
│  Phase 2: 技术实施                                           │
│  ├── 数据预处理 (脱敏、加密)                                 │
│  ├── 模型训练 (联邦学习、DP-SGD)                             │
│  ├── 推理部署 (同态加密、安全飞地)                           │
│  └── 监控审计                                                │
│                                                              │
│  Phase 3: 持续优化                                           │
│  ├── 隐私预算管理                                            │
│  ├── 攻击模拟测试                                            │
│  └── 策略更新                                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 隐私技术选择指南

| 场景 | 推荐技术 | 理由 |
|------|----------|------|
| 多方数据联合建模 | 联邦学习 | 数据不出本地 |
| 敏感数据统计分析 | 差分隐私 | 数学隐私保证 |
| 外包 AI 推理 | 同态加密 | 加密数据计算 |
| 实时隐私保护 | TEE 可信执行环境 | 高性能+安全性 |
| 合规性数据处理 | 传统脱敏+审计 | 监管要求 |

---

## 7. 参考资源

### 框架与库
- [OpenDP](https://opendp.org) - 差分隐私库
- [TensorFlow Privacy](https://github.com/tensorflow/privacy) - DP机器学习
- [PySyft](https://github.com/OpenMined/PySyft) - 联邦学习
- [Concrete ML](https://github.com/zama-ai/concrete-ml) - 同态加密

### 法规
- [GDPR](https://gdpr.eu)
- [CCPA](https://oag.ca.gov/privacy/ccpa)
- [中国PIPL](http://www.cac.gov.cn/2021-08/20/c_1310133901.htm)

---

## 隐私保护技术全景对比

### 技术方法对比

| **技术** | **隐私保证** | **性能开销** | **适用阶段** | **成熟度** | **典型应用** |
|----------|-------------|-------------|-------------|-----------|-------------|
| **差分隐私 (DP)** | 数学可证明 (ε,δ) | 中等 (精度↓2-5%) | 训练+推理 | 成熟 | Apple/Google 数据收集 |
| **联邦学习 (FL)** | 数据不出本地 | 通信开销高 | 训练 | 成熟 | 医疗多机构协作 |
| **同态加密 (HE)** | 密文计算 | 极高 (100-1000×) | 推理 | 发展中 | 金融风控 |
| **安全飞地 (TEE)** | 硬件隔离 | 低 (~10%) | 训练+推理 | 成熟 | Azure Confidential |
| **安全多方计算 (MPC)** | 密码学保证 | 高 (通信密集) | 推理 | 发展中 | 联合查询 |
| **数据脱敏** | 经验性 | 低 | 预处理 | 成熟 | PII 移除 |

### 隐私预算 (ε) 对照表

| **ε 值** | **隐私强度** | **典型场景** | **数据效用** |
|----------|-------------|-------------|-------------|
| ε < 1 | 极强隐私 | 医疗/金融敏感数据 | 损失较大 |
| 1 ≤ ε < 5 | 强隐私 | 用户行为统计 | 可接受 |
| 5 ≤ ε < 10 | 中等隐私 | 推荐系统 | 较好 |
| ε ≥ 10 | 弱隐私 | 公开数据增强 | 接近原始 |

### 法规合规对照表

| **法规** | **地域** | **核心要求** | **技术映射** |
|----------|---------|-------------|-------------|
| **GDPR** | 欧盟 | 数据最小化、被遗忘权 | DP + 数据脱敏 |
| **PIPL** | 中国 | 知情同意、数据本地化 | FL + TEE |
| **CCPA** | 加州 | 数据访问/删除权 | 数据治理 + DP |
| **HIPAA** | 美国医疗 | PHI 保护 | HE + FL + 脱敏 |

---

*Last updated: 2026-04-10*

## 相关链接

- [[17_伦理安全/10_Privacy_Preserving_AI/Privacy_Preserving_AI_for_dummy|隐私保护 AI (小白版)]] — 本篇的零基础版本
- [[17_伦理安全/10_Privacy_Preserving_AI/index|隐私保护 AI 索引]] — 主题导览
- [[17_伦理安全/11_Federated_Learning/Federated_Learning_Deep_Dive|联邦学习深度解读]] — 隐私保护核心技术
- [[概念/Safety/privacy-preserving-ai|隐私保护 AI]] — 概念卡片
- [[概念/General/federated-learning|联邦学习]] — 联邦学习概念卡片
- [[概念/Safety/presidio|Presidio]] — 隐私数据脱敏工具
