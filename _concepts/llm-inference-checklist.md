---
title: LLM 推理上线检查清单
category: concepts
tags:
  - llm
  - inference
  - production
  - checklist
  - serving
  - deployment
aliases:
  - LLM Inference Checklist
  - 推理上线检查清单
  - LLM Serving Checklist
relationships:
  - target: "_concepts/model-inference"
    type: part_of
  - target: "_concepts/ttft"
    type: related_to
  - target: "_concepts/tpot"
    type: related_to
  - target: "_concepts/kv-cache"
    type: related_to
summary: 本页汇总 LLM 推理服务上线前需要检查的技术点，包括解码参数、性能优化、稳定性、安全性和可观测性。
lifecycle: reviewed
tier: supporting
created: 2026-06-25
updated: 2026-06-25
sources: []
---

# LLM 推理上线检查清单

## 一句话总结

LLM 推理服务上线前，需要从**解码效果**、**性能**、**稳定性**、**安全性**和**可观测性**五个维度进行系统检查。

---

## 1. 解码参数配置

- [ ] 根据任务类型选择合适的解码策略（[[_concepts/decoding-strategies-decision-tree|决策树]]）
- [ ] 设置合理的 `temperature`（事实任务低，创意任务高）
- [ ] 设置合理的 `top_p` / `top_k`（通常 `top_p=0.9`, `top_k=50`）
- [ ] 配置 `repetition_penalty` 或 `frequency_penalty` 减少重复
- [ ] 设置 `max_new_tokens` 上限，防止超长生成
- [ ] 确认 `eos_token_id` 和停止词（stop sequences）
- [ ] 是否固定 `seed` 以保证可复现性（测试/基准场景）

---

## 2. 性能与资源

- [ ] 测量并满足 TTFT 目标（首 token 延迟）
- [ ] 测量并满足 TPOT 目标（每 token 延迟）
- [ ] 确认是否启用 KV Cache
- [ ] 评估 KV Cache 显存占用，避免长上下文 OOM
- [ ] 选择合适的推理引擎（vLLM、TensorRT-LLM、SGLang 等）
- [ ] 是否启用 Continuous Batching 提高吞吐
- [ ] 是否需要模型量化（INT8/FP8/INT4）节省显存
- [ ] 长序列场景是否使用 GQA / MQA / MLA 减少 KV Cache

---

## 3. 稳定性与可靠性

- [ ] 设置请求超时和最大生成长度
- [ ] 实现输入长度限制和截断策略
- [ ] 处理异常输入（空 prompt、超长 prompt、特殊字符）
- [ ] 设置并发请求上限，避免服务过载
- [ ] 配置健康检查和自动重启
- [ ] 准备降级方案（如切换到小模型或缓存回复）
- [ ] 实现输入/输出日志，便于问题排查

---

## 4. 安全与合规

- [ ] 配置内容安全过滤（有害内容、偏见、隐私信息）
- [ ] 实现输入审查（jailbreak、注入攻击）
- [ ] 对敏感输出进行脱敏或后处理
- [ ] 设置用户权限和 rate limiting
- [ ] 符合数据隐私法规（如 GDPR）
- [ ] 记录审计日志

---

## 5. 可观测性

- [ ] 监控 TTFT、TPOT、吞吐量
- [ ] 监控 GPU 利用率、显存占用、温度
- [ ] 记录错误率、超时率、重试率
- [ ] 收集用户反馈，持续优化解码参数
- [ ] A/B 测试不同解码策略的效果

---

## 6. 测试用例

| 测试类型 | 检查点 |
|---|---|
| **功能测试** | 常见 prompt 输出正确、格式符合预期 |
| **边界测试** | 空输入、超长输入、特殊 token |
| **压力测试** | 高并发下的延迟和稳定性 |
| **安全测试** | 注入攻击、有害内容生成 |
| **回归测试** | 模型更新后输出是否一致 |

---

## 延伸阅读

- [[_concepts/model-inference|模型推理]]
- [[_concepts/ttft|TTFT]]
- [[_concepts/tpot|TPOT]]
- [[_concepts/kv-cache|KV Cache]]
- [[_concepts/decoding-strategies|解码策略]]
- [[_concepts/paged-attention|PagedAttention]]
- [[_concepts/continuous-batching|Continuous Batching]]
