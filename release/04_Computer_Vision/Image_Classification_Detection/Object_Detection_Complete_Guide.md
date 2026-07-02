---
title: "Object Detection Complete Guide"
tags: [computer-vision, object-detection, deep-learning, yolo, production]
status: complete
last_updated: 2026-07-02
---

# Object Detection Complete Guide

## Overview

Object detection is one of the most fundamental and widely-deployed computer vision tasks. It combines **classification** (what is it?) with **localization** (where is it?) to detect and locate objects in images/video with bounding boxes.

## Evolution of Object Detection

### Two-Stage Detectors (High Accuracy)

| Model | Year | Key Innovation | mAP (COCO) |
|-------|------|---------------|-------------|
| R-CNN | 2014 | Selective Search + CNN features | 58.5 |
| Fast R-CNN | 2015 | ROI Pooling, single-pass feature extraction | 70.0 |
| Faster R-CNN | 2016 | Region Proposal Network (RPN) | 73.2 |
| FPN | 2017 | Feature Pyramid Network for multi-scale | 76.8 |
| Cascade R-CNN | 2018 | Progressive refinement of detections | 82.1 |
| DINO | 2022 | Self-supervised DETR with denoising | 63.3 (zero-shot) |

### One-Stage Detectors (High Speed)

| Model | Year | Key Innovation | FPS | mAP (COCO) |
|-------|------|---------------|-----|-------------|
| YOLOv1 | 2016 | Unified single-shot detection | 45 | 63.4 |
| SSD | 2016 | Multi-scale feature maps | 59 | 74.3 |
| RetinaNet | 2017 | Focal Loss for class imbalance | 43 | 80.1 |
| YOLOv5 | 2020 | PyTorch native, auto-augmentation | 140 | 68.9 |
| YOLOv8 | 2023 | Anchor-free, decoupled head | 160 | 72.2 |
| YOLOv9 | 2024 | PGI, GELAN architecture | 150 | 73.5 |
| YOLOv10 | 2024 | NMS-free, consistent dual assignment | 170 | 74.5 |
| YOLO11 | 2025 | C3k2 block, SPPF optimization | 180 | 75.2 |
| YOLOv12 | 2025 | Area Attention, R-ELAN | 175 | 75.8 |

### Transformer-Based Detectors

| Model | Year | Key Innovation | mAP (COCO) |
|-------|------|---------------|-------------|
| DETR | 2020 | End-to-end, set prediction | 42.0 |
| Deformable DETR | 2021 | Deformable attention, faster convergence | 46.2 |
| DINO | 2022 | Mixed query selection, denoising training | 63.3 |
| Co-DETR | 2023 | Collaborative hybrid assignment | 66.1 |
| RT-DETR | 2023 | Real-time DETR for production | 54.8 (real-time) |

## Core Concepts

### Anchor-Based vs Anchor-Free

**Anchor-Based** (Faster R-CNN, SSD, RetinaNet):
- Predefined boxes of various sizes/ratios
- Match ground truth to anchors via IoU
- Regress offsets from matched anchors

**Anchor-Free** (FCOS, CenterNet, YOLOv8+):
- Predict object centers directly
- No anchor hyperparameter tuning
- Simpler, often better generalization

### Non-Maximum Suppression (NMS)

```python
def nms(boxes, scores, iou_threshold=0.5):
    """Standard NMS for post-processing detections."""
    order = scores.argsort()[::-1]
    keep = []
    while order.size > 0:
        i = order[0]
        keep.append(i)
        ious = compute_iou(boxes[i], boxes[order[1:]])
        mask = ious <= iou_threshold
        order = order[1:][mask]
    return keep
```

**NMS Variants:**
- **Soft-NMS**: Decay scores instead of hard suppression
- **DIoU-NMS**: Use distance-IoU for better suppression
- **NMS-Free**: DETR-style set prediction eliminates NMS entirely

### Loss Functions

| Loss | Purpose | Formula Type |
|------|---------|-------------|
| IoU Loss | Bounding box regression | 1 - IoU |
| GIoU Loss | Better gradient for non-overlapping | Generalized IoU |
| DIoU Loss | Consider center distance | Distance IoU |
| CIoU Loss | Complete IoU with aspect ratio | Complete IoU |
| Focal Loss | Handle class imbalance | -α(1-p)^γ log(p) |
| Varifocal Loss | Asymmetric focal for IoU-aware | Quality focal |

## Production Implementation

### YOLOv8/v11 Production Pipeline

```python
from ultralytics import YOLO

# Load pretrained model
model = YOLO("yolo11x.pt")

# Train on custom dataset
results = model.train(
    data="custom_dataset.yaml",
    epochs=100,
    imgsz=640,
    batch=16,
    device=[0, 1],  # Multi-GPU
    augment=True,
    mosaic=1.0,
    mixup=0.1,
    copy_paste=0.1,
)

# Export for production
model.export(format="onnx", dynamic=True, simplify=True)
model.export(format="engine", half=True)  # TensorRT FP16
model.export(format="coreml")  # iOS deployment
```

### Dataset Preparation (COCO Format)

```yaml
# dataset.yaml
path: /data/detection
train: images/train
val: images/val
test: images/test

names:
  0: person
  1: vehicle
  2: equipment
  # ... extend as needed
```

**Data Augmentation Pipeline:**
- Mosaic: Combine 4 images into one
- MixUp: Blend two images with alpha
- Copy-Paste: Paste object segments
- HSV jitter: Hue, saturation, value
- Random flip, scale, rotate
- Albumentations integration for advanced transforms

### Evaluation Metrics

| Metric | Definition | Use Case |
|--------|-----------|----------|
| mAP@0.5 | Mean AP at IoU=0.5 | General detection |
| mAP@0.5:0.95 | Mean AP averaged over IoU thresholds | COCO standard |
| AP50/AP75 | AP at specific IoU | Strict/loose matching |
| AR@100 | Max recall with 100 detections | Recall-sensitive tasks |
| F1 Score | Harmonic mean of precision/recall | Balanced evaluation |
| Latency (ms) | Inference time per image | Real-time requirements |
| Throughput (FPS) | Frames per second | Video processing |

### Per-Class Analysis

```python
from ultralytics import YOLO

model = YOLO("best.pt")
results = model.val(data="dataset.yaml")

# Per-class AP
for cls_id, cls_name in model.names.items():
    print(f"{cls_name}: AP@0.5={results.box.ap50[cls_id]:.3f}")
```

## Deployment Patterns

### Real-Time Video Detection

```python
import cv2
from ultralytics import YOLO

model = YOLO("yolo11n.engine")  # TensorRT engine

cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    results = model(frame, conf=0.5, iou=0.45, stream=True)
    for r in results:
        annotated = r.plot()
        cv2.imshow("Detection", annotated)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
```

### Edge Deployment

| Platform | Format | Tool | Typical FPS |
|----------|--------|------|-------------|
| NVIDIA Jetson | TensorRT | trtexec | 30-120 |
| Mobile (iOS) | CoreML | coremltools | 15-60 |
| Mobile (Android) | TFLite | tflite_convert | 10-45 |
| Browser | ONNX.js | onnxruntime-web | 5-20 |
| Raspberry Pi | NCNN | ncnn | 5-15 |
| MCU | TFLite Micro | tflite-micro | 1-5 |

### Scaling Detection Service

```python
# FastAPI + YOLO inference service
from fastapi import FastAPI, UploadFile
from ultralytics import YOLO
import torch

app = FastAPI()
model = YOLO("yolo11x.engine")

@app.post("/detect")
async def detect(file: UploadFile, conf: float = 0.5):
    image = await file.read()
    results = model(image, conf=conf, verbose=False)
    return {
        "detections": [
            {
                "class": r.names[int(c)],
                "confidence": float(s),
                "bbox": b.tolist()
            }
            for r in results
            for b, s, c in zip(r.boxes.xyxy, r.boxes.conf, r.boxes.cls)
        ]
    }
```

## Industry Applications

| Industry | Use Case | Requirements |
|----------|---------|-------------|
| Autonomous Driving | Pedestrian, vehicle detection | Real-time, 99.9% recall |
| Manufacturing | Defect detection | High precision, low false positive |
| Retail | Shelf monitoring, customer analytics | Multi-object, occlusion handling |
| Security | Intrusion detection, weapon detection | Low latency, high recall |
| Medical | Tumor/lesion detection | High sensitivity, explainability |
| Agriculture | Crop disease, pest detection | Edge deployment, variable lighting |
| Construction | Safety compliance (helmet, vest) | Outdoor, variable conditions |

## Common Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Small objects | Higher resolution input, FPN, SAHI slicing |
| Class imbalance | Focal Loss, oversampling, class weights |
| Occlusion | Part-based models, NMS tuning |
| Domain shift | Domain adaptation, fine-tuning on target |
| Real-time constraint | Model pruning, TensorRT, lighter architecture |
| Label noise | CleanLab, confident learning, human review |

## 2026 Trends

1. **Open-Vocabulary Detection**: Detect any class from text description (Grounding DINO, OWL-ViT)
2. **3D Object Detection**: LiDAR + camera fusion for autonomous driving
3. **Video Object Detection**: Temporal consistency, tubelet-based methods
4. **Foundation Model Detectors**: SAM2, Florence-2 for universal detection
5. **Efficient Edge Detection**: Sub-1W inference on MCUs

## Related Topics

- [[Segmentation]]: Pixel-level vs box-level localization
- [[3D_Vision]]: 3D bounding box detection
- [[Video_Generation_2026]]: Video understanding and detection
- [[Multimodal_Vision]]: Vision-language detection models
