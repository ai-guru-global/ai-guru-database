---
title: "Label Studio (开源数据标注平台)"
category: -concepts
tags: ["data-labeling", "annotation", "ml", "human-in-the-loop", "open-source"]
relationships:
  - target: "概念/mlflow"
    type: related_to
  - target: "概念/giskard"
    type: related_to
sources:
  - 架构基建/AI_Stack_Deep_Dive.md
summary: "HumanSignal 开源的多模态数据标注平台，支持图像/文本/音频/视频标注，内置主动学习和 ML 辅助标注，是 ML 数据流水线的核心工具。"
provenance:
  extracted: 0.55
  inferred: 0.35
  ambiguous: 0.10
base_confidence: 0.85
lifecycle: reviewed
created: 2026-06-12
updated: 2026-07-21
tier: core
---

# Label Studio

[Label Studio](https://github.com/HumanSignal/label-studio) 是 [HumanSignal](https://humansignal.com/)（原 Heartex）开源的**多模态数据标注平台**，支持图像分类、目标检测、文本分类、NER、音频分割、视频标注等几乎所有标注任务类型。它的核心差异化在于**ML Backend 集成**——可以将 ML 模型连接到标注界面，实现预标注（Pre-labeling）和主动学习（Active Learning），大幅提升标注效率。

## 核心特性

### 1. 多模态标注

| 数据类型 | 标注任务 |
|----------|----------|
| **图像** | 分类、检测框、分割、关键点 |
| **文本** | 分类、NER、关系、摘要 |
| **音频** | 分类、分割、转录 |
| **视频** | 分类、时间线标注 |
| **HTML** | 网页元素标注 |
| **时间序列** | 异常标注、事件标注 |

### 2. 可配置标注界面

```xml
<!-- 标注配置 (XML) -->
<View>
  <Header value="Select the sentiment:"/>
  <Text name="text" value="$text"/>
  <Choices name="sentiment" toName="text" choice="single">
    <Choice value="Positive"/>
    <Choice value="Negative"/>
    <Choice value="Neutral"/>
  </Choices>
</View>

<!-- NER 配置 -->
<View>
  <Labels name="ner" toName="text">
    <Label value="Person" background="red"/>
    <Label value="Organization" background="green"/>
    <Label value="Location" background="blue"/>
  </Labels>
  <Text name="text" value="$text"/>
</View>
```

### 3. ML Backend 集成

```python
# ML Backend: 自动预标注
from label_studio_ml.model import LabelStudioMLBase

class MyMLBackend(LabelStudioMLBase):
    def predict(self, tasks, **kwargs):
        # 使用 ML 模型生成预标注
        predictions = []
        for task in tasks:
            text = task["data"]["text"]
            # 调用模型
            result = my_ner_model.predict(text)
            predictions.append({
                "result": result,
                "score": 0.95,
                "model_version": "v1"
            })
        return predictions
```

### 4. 主动学习

```
主动学习循环:

1. 标注少量数据 → 训练初始模型
2. 模型对未标注数据预测
3. 选择模型最不确定的样本 → 人工标注
4. 加入训练集 → 重新训练模型
5. 重复 2-4，用最少标注达到最大效果
```

### 5. 数据管理

- **导入**: CSV、JSON、图片文件夹、云存储（S3、GCS、Azure）
- **导出**: JSON、COCO、YOLO、VOC、CONLL 等标准格式
- **过滤**: 按标注状态、评分、标签筛选
- **版本**: 标注历史版本管理

## 与 Scale AI 对比

| 维度 | Label Studio | Scale AI |
|------|-------------|----------|
| **类型** | 开源自托管 | SaaS 平台 |
| **成本** | 免费 (自建) | 按标注量付费 |
| **标注员** | 自带团队 | 提供标注员 |
| **ML 辅助** | ✅ (原生) | ✅ |
| **定制性** | 极高 | 中 |
| **数据驻留** | 自选 | Scale 云 |
| **企业合规** | 自建 | SOC2/ISO |

## 典型应用场景

- **NLP 标注**: NER、文本分类、情感分析数据集构建
- **CV 标注**: 目标检测、图像分割数据标注
- **RLHF**: 人类偏好数据收集
- **评估数据**: 构建 LLM 评估 Golden Set
- **主动学习**: 最小标注成本训练最优模型

## 安装

```bash
pip install label-studio

# 启动
label-studio start

# Docker
docker run -p 8080:8080 heartexlabs/label-studio:latest
```

## K8s 部署

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: label-studio
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: label-studio
        image: heartexlabs/label-studio:latest
        ports:
        - containerPort: 8080
        env:
        - name: DJANGO_DB
          value: "default"
        - name: POSTGRE_NAME
          value: "label_studio"
        - name: POSTGRE_HOST
          value: "postgres-svc"
        volumeMounts:
        - name: data
          mountPath: /label-studio/data
```

## 参考资源

- [Label Studio GitHub](https://github.com/HumanSignal/label-studio)
- [Label Studio 文档](https://labelstud.io/)
- [HumanSignal](https://humansignal.com/)

## 相关概念

- [[概念/mlflow]] — MLflow 实验追踪与模型管理
- [[概念/giskard]] — Giskard AI 模型测试与评估
- [[概念/scale-ai]] — Scale AI 数据标注平台

---

## 2026 Label Studio 生态

| 特性/工具 | 说明 | 状态 |
|------|------|------|
| **Label Studio** | 开源数据标注平台 | GA |
| **多模态支持** | 图像/文本/音频/视频标注 | GA |
| **ML 后端** | 模型辅助标注 | GA |
| **Label Studio Cloud** | 托管标注服务 | GA |
| **API 集成** | REST API 集成 | GA |

## 生产最佳实践

1. **开源优先**：数据标注优先选择 Label Studio
2. **ML 辅助**：启用模型辅助标注，提升效率
3. **质量控制**：多人标注 + 一致性检查
4. **与训练集成**：标注数据直接用于训练
5. **权限管理**：标注任务权限管理
