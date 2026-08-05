---
title: AI 水印 (AI Watermarking)
category: 05-ethics
tags: ["ai-watermarking", "content-provenance", "deepfake-detection", "c2pa"]
summary: "AI 水印完整指南：文本水印（Logit Bias/语义水印）、图像水印（隐写术/频域）、C2PA 内容溯源标准、Deepfake 检测、2026 法规要求。"
created: 2026-07-21
updated: 2026-07-21
tier: supporting
sources: []

name_zh: "AI 水印"
---
# AI 水印 (AI Watermarking)

> 中文简称：AI 水印

## 1. 为什么需要 AI 水印？

```
2026 背景:
- AI 生成内容爆炸: 文本/图像/视频/音频
- Deepfake 泛滥: 虚假新闻/诈骗/名誉损害
- 法规要求: 欧盟 AI Act / 中国 AI 生成内容标识
- 版权保护: AI 生成内容的知识产权

AI 水印 = 在 AI 生成内容中嵌入不可见标记
目的:
1. 溯源: 判断内容是否 AI 生成
2. 归因: 追踪由哪个模型/用户生成
3. 完整性: 检测内容是否被篡改
4. 合规: 满足法规标识要求
```

## 2. 文本水印

```python
class TextWatermark:
    """
    LLM 文本水印原理:
    在 token 采样时引入统计偏差 (Logit Bias)
    - 将词表分为 "绿色" 和 "红色" 两组
    - 采样时偏向绿色 token
    - 人类阅读无感知，但统计检测可识别
    """
    def __init__(self, gamma=0.5, delta=2.0, seed=42):
        self.gamma = gamma  # 绿色比例
        self.delta = delta  # 偏置强度
        self.seed = seed
    
    def get_green_tokens(self, prev_token, vocab_size):
        """基于前一个 token 确定绿色集合"""
        rng = hash((self.seed, prev_token)) % (2**32)
        num_green = int(vocab_size * self.gamma)
        # 伪随机选择绿色 token
        green_ids = pseudo_random_selection(rng, vocab_size, num_green)
        return set(green_ids)
    
    def apply_watermark(self, logits, prev_token):
        """在 logits 上添加水印偏置"""
        green_ids = self.get_green_tokens(prev_token, len(logits))
        for token_id in green_ids:
            logits[token_id] += self.delta  # 偏向绿色
        return logits
    
    def detect(self, text, tokenizer):
        """检测文本是否含水印"""
        tokens = tokenizer.encode(text)
        green_count = 0
        for i in range(1, len(tokens)):
            green_ids = self.get_green_tokens(tokens[i-1], tokenizer.vocab_size)
            if tokens[i] in green_ids:
                green_count += 1
        
        # 统计检验: 绿色比例是否显著高于 gamma
        ratio = green_count / (len(tokens) - 1)
        # z-test
        z_score = (ratio - self.gamma) / math.sqrt(
            self.gamma * (1 - self.gamma) / (len(tokens) - 1)
        )
        return z_score > 4.0  # p < 0.0001
```

## 3. 图像/视频水印

```python
IMAGE_WATERMARKING = {
    "隐写术": {
        "原理": "在像素最低有效位 (LSB) 嵌入信息",
        "优势": "简单/容量大",
        "劣势": "抗压缩/裁剪能力弱",
    },
    "频域水印": {
        "原理": "在 DCT/DWT 频域系数中嵌入",
        "优势": "抗压缩/缩放",
        "代表": "DwtDct/DwtDctSvd (invisible-watermark)",
    },
    "AI 生成水印": {
        "原理": "在生成过程中嵌入 (如 Stable Signature)",
        "优势": "与生成绑定/难以移除",
        "代表": "Meta Stable Signature / Google SynthID",
    },
    "元数据水印": {
        "原理": "C2PA/Content Credentials 元数据",
        "优势": "标准化/可验证",
        "劣势": "可被剥离",
    },
}
```

## 4. C2PA 与内容溯源

```python
C2PA_CONTENT_PROVENANCE = {
    "标准": "Coalition for Content Provenance and Authenticity",
    "成员": "Adobe/Microsoft/BBC/Intel/Google/Meta",
    "原理": [
        "内容创建时签名 (谁/何时/用什么工具)",
        "每次编辑追加记录 (编辑历史)",
        "密码学签名保证不可篡改",
    ],
    "实现": [
        "Adobe Firefly: 自动附加 Content Credentials",
        "OpenAI DALL-E: C2PA 元数据",
        "相机: Leica/Sony 支持 C2PA",
    ],
    "中国标准": [
        "《人工智能生成合成内容标识办法》(2025)",
        "显式标识: 用户可见的 AI 生成标记",
        "隐式标识: 元数据/水印",
    ],
}
```

## 5. Deepfake 检测

```python
DEEPFAKE_DETECTION = {
    "视觉线索": [
        "眨眼频率异常",
        "嘴唇-语音不同步",
        "面部边缘伪影",
        "光照/阴影不一致",
    ],
    "频域分析": [
        "GAN 指纹 (频谱特征)",
        "压缩伪影不一致",
    ],
    "2026 工具": [
        "Intel FakeCatcher (实时)",
        "Microsoft Video Authenticator",
        "Hive AI Detection",
        "开源: FaceForensics++ 检测器",
    ],
    "挑战": [
        "检测 vs 生成 军备竞赛",
        "泛化性 (新模型生成的难检测)",
        "误报率 (真实内容被误判)",
    ],
}
```

## 6. 交叉引用

- [[17_伦理安全/|伦理安全]]
- [[17_伦理安全/03_AI治理/07_模型_Card_Documentation|模型卡]]
- [[14_RAG系统/05_RAG生产实践/06_RAG_安全|RAG 安全]]
- [[05_大模型/|大模型 (生成内容)]]
- [[18_行业应用/19_其他行业/Public_Safety|公共安全 (Deepfake)]]
