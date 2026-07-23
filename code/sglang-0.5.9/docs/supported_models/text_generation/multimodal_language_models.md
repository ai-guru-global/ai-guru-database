# Multimodal Language Models

These models accept multi-modal inputs (e.g., images and text) and generate text output. They augment language models with multimodal encoders.

## Example launch Command

```shell
python3 -m sglang.launch_server \
  --model-path meta-llama/Llama-3.2-11B-Vision-Instruct \  # example HF/local path
  --host 0.0.0.0 \
  --port 30000 \
```

> See the [OpenAI APIs section](https://docs.sglang.io/basic_usage/openai_api_vision.html) for how to send multimodal requests.

## Supported models

Below the supported models are summarized in a table.

If you are unsure if a specific architecture is implemented, you can search for it via GitHub. For example, to search for `Qwen2_5_VLForConditionalGeneration`, use the expression:

```
repo:sgl-project/sglang path:/^python\/sglang\/srt\/models\// Qwen2_5_VLForConditionalGeneration
```

in the GitHub search bar.


| Model Family (Variants)    | Example HuggingFace Identifier             | Description                                                                                                                                                                                                     | Notes |
|----------------------------|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| **Qwen-VL** | `Qwen/Qwen3-VL-235B-A22B-Instruct`              | Alibaba's vision-language extension of Qwen; for example, Qwen2.5-VL (7B and larger variants) can analyze and converse about image content.                                                                     |  |
| **DeepSeek-VL2**           | `deepseek-ai/deepseek-vl2`                 | Vision-language variant of DeepSeek (with a dedicated image processor), enabling advanced multimodal reasoning on image and text inputs.                                                                        |  |
| **DeepSeek-OCR / OCR-2**   | `deepseek-ai/DeepSeek-OCR-2`               | OCR-focused DeepSeek models for document understanding and text extraction.                                                                                                                                    | Use `--trust-remote-code`. |
| **Janus-Pro** (1B, 7B)     | `deepseek-ai/Janus-Pro-7B`                 | DeepSeek's open-source multimodal model capable of both image understanding and generation. Janus-Pro employs a decoupled architecture for separate visual encoding paths, enhancing performance in both tasks. |  |
| **MiniCPM-V / MiniCPM-o**  | `openbmb/MiniCPM-V-2_6`                    | MiniCPM-V (2.6, ~8B) supports image inputs, and MiniCPM-o adds audio/video; these multimodal LLMs are optimized for end-side deployment on mobile/edge devices.                                                 |  |
| **Llama 3.2 Vision** (11B) | `meta-llama/Llama-3.2-11B-Vision-Instruct` | Vision-enabled variant of Llama 3 (11B) that accepts image inputs for visual question answering and other multimodal tasks.                                                                                     |  |
| **LLaVA** (v1.5 & v1.6)    | *e.g.* `liuhaotian/llava-v1.5-13b`         | Open vision-chat models that add an image encoder to LLaMA/Vicuna (e.g. LLaMA2 13B) for following multimodal instruction prompts.                                                                               |  |
| **LLaVA-NeXT** (8B, 72B)   | `lmms-lab/llava-next-72b`                  | Improved LLaVA models (with an 8B Llama3 version and a 72B version) offering enhanced visual instruction-following and accuracy on multimodal benchmarks.                                                       |  |
| **LLaVA-OneVision**        | `lmms-lab/llava-onevision-qwen2-7b-ov`     | Enhanced LLaVA variant integrating Qwen as the backbone; supports multiple images (and even video frames) as inputs via an OpenAI Vision API-compatible format.                                                 |  |
| **Gemma 3 (Multimodal)**   | `google/gemma-3-4b-it`                     | Gemma 3's larger models (4B, 12B, 27B) accept images (each image encoded as 256 tokens) alongside text in a combined 128K-token context.                                                                        |  |
| **Kimi-VL** (A3B)          | `moonshotai/Kimi-VL-A3B-Instruct`          | Kimi-VL is a multimodal model that can understand and generate text from images.                                                                                                                                |  |
| **Mistral-Small-3.1-24B**  | `mistralai/Mistral-Small-3.1-24B-Instruct-2503` | Mistral 3.1 is a multimodal model that can generate text from text or images input. It also supports tool calling and structured output. |  |
| **Phi-4-multimodal-instruct**  | `microsoft/Phi-4-multimodal-instruct` | Phi-4-multimodal-instruct is the multimodal variant of the Phi-4-mini model, enhanced with LoRA for improved multimodal capabilities. It supports text, vision and audio modalities in SGLang. |  |
| **MiMo-VL** (7B)           | `XiaomiMiMo/MiMo-VL-7B-RL`                 | Xiaomi's compact yet powerful vision-language model featuring a native resolution ViT encoder for fine-grained visual details, an MLP projector for cross-modal alignment, and the MiMo-7B language model optimized for complex reasoning tasks. |  |
| **GLM-4.5V** (106B) /  **GLM-4.1V**(9B)           | `zai-org/GLM-4.5V`                   | GLM-4.5V and GLM-4.1V-Thinking: Towards Versatile Multimodal Reasoning with Scalable Reinforcement Learning                                                                                                                                                                                                      | Use `--chat-template glm-4v` |
| **GLM-OCR**          | `zai-org/GLM-OCR`                   | GLM-OCR: A fast and accurate general OCR model                                                                   |  |
| **DotsVLM** (General/OCR)  | `rednote-hilab/dots.vlm1.inst`             | RedNote's vision-language model built on a 1.2B vision encoder and DeepSeek V3 LLM, featuring NaViT vision encoder trained from scratch with dynamic resolution support and enhanced OCR capabilities through structured image data training. |  |
| **DotsVLM-OCR**            | `rednote-hilab/dots.ocr`                   | Specialized OCR variant of DotsVLM optimized for optical character recognition tasks with enhanced text extraction and document understanding capabilities. | Don't use `--trust-remote-code` |
| **NVILA** (8B, 15B, Lite-2B, Lite-8B, Lite-15B) | `Efficient-Large-Model/NVILA-8B` | `chatml` | NVILA explores the full stack efficiency of multi-modal design, achieving cheaper training, faster deployment and better performance. |
| **NVIDIA Nemotron Nano 2.0 VL** | `nvidia/NVIDIA-Nemotron-Nano-12B-v2-VL-BF16` | NVIDIA Nemotron Nano v2 VL enables multi-image reasoning and video understanding, along with strong document intelligence, visual Q&A and summarization capabilities. It builds on Nemotron Nano V2, a hybrid Mamba-Transformer LLM, in order to achieve higher inference throughput in long document and video scenarios. | Use `--trust-remote-code`. You may need to adjust `--max-mamba-cache-size` [default is 512] to fit memory constraints. |
| **Ernie4.5-VL** | `baidu/ERNIE-4.5-VL-28B-A3B-PT`              | Baidu's vision-language models(28B,424B). Support image and video comprehension, and also support thinking.                                                                     |  |
| **JetVLM** |  | JetVLM is an vision-language model designed for high-performance multimodal understanding and generation tasks built upon Jet-Nemotron. | Coming soon |
| **Step3-VL** (10B) | `stepfun-ai/Step3-VL-10B` | StepFun's lightweight open-source 10B parameter VLM for multimodal intelligence, excelling in visual perception, complex reasoning, and human alignment. |  |
| **Qwen3-Omni** | `Qwen/Qwen3-Omni-30B-A3B-Instruct` |  Alibaba's omni-modal MoE model. Currently supports the **Thinker** component (multimodal understanding for text, images, audio, and video), while the **Talker** component (audio generation) is not yet supported. |  |

## Video Input Support

SGLang supports video input for Vision-Language Models (VLMs), enabling temporal reasoning tasks such as video question answering, captioning, and holistic scene understanding. Video clips are decoded, key frames are sampled, and the resulting tensors are batched together with the text prompt, allowing multimodal inference to integrate visual and linguistic context.

| Model Family | Example Identifier | Video notes |
|--------------|--------------------|-------------|
| **Qwen-VL** (Qwen2-VL, Qwen2.5-VL, Qwen3-VL, Qwen3-Omni) | `Qwen/Qwen3-VL-235B-A22B-Instruct` | The processor gathers `video_data`, runs Qwen's frame sampler, and merges the resulting features with text tokens before inference. |
| **GLM-4v** (4.5V, 4.1V, MOE) | `zai-org/GLM-4.5V` | Video clips are read with Decord, converted to tensors, and passed to the model alongside metadata for rotary-position handling. |
| **NVILA** (Full & Lite) | `Efficient-Large-Model/NVILA-8B` | The runtime samples eight frames per clip and attaches them to the multimodal request when `video_data` is present. |
| **LLaVA video variants** (LLaVA-NeXT-Video, LLaVA-OneVision) | `lmms-lab/LLaVA-NeXT-Video-7B` | The processor routes video prompts to the LlavaVid video-enabled architecture, and the provided example shows how to query it with `sgl.video(...)` clips. |
| **NVIDIA Nemotron Nano 2.0 VL** | `nvidia/NVIDIA-Nemotron-Nano-12B-v2-VL-BF16` | The processor samples at 2 FPS, at a max of 128 frames, as per model training. The model uses [EVS](../../python/sglang/srt/multimodal/evs/README.md), a pruning method that removes redundant tokens from video embeddings. By default `video_pruning_rate=0.7`. Change this by providing: `--json-model-override-args '{"video_pruning_rate": 0.0}'` to disable EVS, for example. |
| **JetVLM** |  | The runtime samples eight frames per clip and attaches them to the multimodal request when `video_data` is present. |

Use `sgl.video(path, num_frames)` when building prompts to attach clips from your SGLang programs.

Example OpenAI-compatible request that sends a video clip:

```python
import requests

url = "http://localhost:30000/v1/chat/completions"

data = {
    "model": "Qwen/Qwen3-VL-30B-A3B-Instruct",
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What’s happening in this video?"},
                {
                    "type": "video_url",
                    "video_url": {
                        "url": "https://github.com/sgl-project/sgl-test-files/raw/refs/heads/main/videos/jobs_presenting_ipod.mp4"
                    },
                },
            ],
        }
    ],
    "max_tokens": 300,
}

response = requests.post(url, json=data)
print(response.text)
```

## Usage Notes

### Performance Optimization

For multimodal models, you can use the `--keep-mm-feature-on-device` flag to optimize for latency at the cost of increased GPU memory usage:

- **Default behavior**: Multimodal feature tensors are moved to CPU after processing to save GPU memory
- **With `--keep-mm-feature-on-device`**: Feature tensors remain on GPU, reducing device-to-host copy overhead and improving latency, but consuming more GPU memory

Use this flag when you have sufficient GPU memory and want to minimize latency for multimodal inference.

### Multimodal Inputs Limitation

- **Use `--mm-process-config '{"image":{"max_pixels":1048576},"video":{"fps":3,"max_pixels":602112,"max_frames":60}}'`**: To set `image`, `video`, and `audio` input limits.

This can reduce GPU memory usage, improve inference speed, and help to avoid OOM, but may impact model performance, thus set a proper value based on your specific use case. Currently, only `qwen_vl` supports this config. Please refer to [qwen_vl processor](https://github.com/sgl-project/sglang/blob/main/python/sglang/srt/multimodal/processors/qwen_vl.py) for understanding the meaning of each parameter.

### Bidirectional Attention in Multimodal Model Serving
**Note for serving the Gemma-3 multimodal model**:

As mentioned in [Welcome Gemma 3: Google's all new multimodal, multilingual, long context open LLM
](https://huggingface.co/blog/gemma3#multimodality), Gemma-3 employs bidirectional attention between image tokens during the prefill phase. Currently, SGLang only supports bidirectional attention when using the Triton Attention Backend. Note, however, that SGLang's current bidirectional attention implementation is incompatible with both CUDA Graph and Chunked Prefill.

To enable bidirectional attention, you can use the `TritonAttnBackend` while disabling CUDA Graph and Chunked Prefill. Example launch command:
```shell
python -m sglang.launch_server \
  --model-path google/gemma-3-4b-it \
  --host 0.0.0.0 --port 30000 \
  --enable-multimodal \
  --dtype bfloat16 --triton-attention-reduce-in-fp32 \
  --attention-backend triton \ # Use Triton attention backend
  --disable-cuda-graph \ # Disable Cuda Graph
  --chunked-prefill-size -1 # Disable Chunked Prefill
```

If higher serving performance is required and a certain degree of accuracy loss is acceptable, you may choose to use other attention backends, and you can also enable features like CUDA Graph and Chunked Prefill for better performance, but note that the model will fall back to using causal attention instead of bidirectional attention.

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
