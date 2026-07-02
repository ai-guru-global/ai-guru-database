---
title: "Text Generation & Decoding Strategies"
tags: [nlp, llm, text-generation, decoding, sampling, production]
status: complete
last_updated: 2026-07-02
---

# Text Generation & Decoding Strategies

## Overview

How LLMs generate text token-by-token is governed by **decoding strategies**. Understanding these is critical for controlling output quality, diversity, and determinism in production applications.

## Autoregressive Generation

```
Input: "The capital of France is"
                │
                ▼
┌─────────────────────────────┐
│  Transformer Forward Pass    │
│  (processes all tokens)      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Logits (vocab_size)         │
│  [0.1, -2.3, 5.7, ..., 1.2]│
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Decoding Strategy           │
│  (greedy/beam/sample/etc.)   │
└──────────────┬──────────────┘
               │
               ▼
         Token: "Paris"
         (index 4827)
```

## Decoding Strategies

### 1. Greedy Decoding

```python
def greedy_decode(logits):
    """Always pick the highest probability token."""
    return torch.argmax(logits, dim=-1)

# Deterministic, fast, but repetitive
# Use for: factual QA, code generation, classification
```

**Pros**: Deterministic, fast
**Cons**: Repetitive, misses diverse options

### 2. Beam Search

```python
def beam_search(model, input_ids, beam_width=5, max_length=100):
    """Maintain top-k candidate sequences."""
    beams = [(input_ids, 0.0)]  # (sequence, log_prob)
    
    for _ in range(max_length):
        all_candidates = []
        for seq, score in beams:
            logits = model(seq)
            log_probs = F.log_softmax(logits[:, -1, :], dim=-1)
            top_k = log_probs.topk(beam_width)
            
            for i in range(beam_width):
                token = top_k.indices[0, i].unsqueeze(0)
                new_score = score + top_k.values[0, i].item()
                new_seq = torch.cat([seq, token.unsqueeze(0)], dim=-1)
                all_candidates.append((new_seq, new_score))
        
        # Keep top beams
        beams = sorted(all_candidates, key=lambda x: x[1], reverse=True)[:beam_width]
    
    return beams[0]  # Best sequence
```

**Variants**:
| Variant | Description | Use Case |
|---------|-------------|----------|
| Standard beam | Top-k sequences | Translation |
| Length-normalized | Penalize short sequences | Summarization |
| Diverse beam | Encourage diversity | Multiple hypotheses |
| Constrained beam | Enforce constraints | Controlled generation |

### 3. Top-K Sampling

```python
def top_k_sampling(logits, k=50, temperature=1.0):
    """Sample from top-k most likely tokens."""
    logits = logits / temperature
    
    # Zero out all but top-k
    top_k_values, top_k_indices = torch.topk(logits, k)
    mask = torch.full_like(logits, float('-inf'))
    mask.scatter_(1, top_k_indices, top_k_values)
    
    # Sample from filtered distribution
    probs = F.softmax(mask, dim=-1)
    token = torch.multinomial(probs, num_samples=1)
    return token
```

**Parameters**:
- `k=1`: Greedy decoding
- `k=50`: Good balance of quality and diversity
- `k=vocab_size`: Full random sampling

### 4. Top-P (Nucleus) Sampling

```python
def top_p_sampling(logits, p=0.9, temperature=1.0):
    """Sample from smallest set of tokens with cumulative prob >= p."""
    logits = logits / temperature
    probs = F.softmax(logits, dim=-1)
    
    # Sort probabilities in descending order
    sorted_probs, sorted_indices = torch.sort(probs, descending=True)
    cumulative_probs = torch.cumsum(sorted_probs, dim=-1)
    
    # Find cutoff: first token where cumulative prob > p
    cutoff_idx = (cumulative_probs > p).int().argmax(dim=-1)
    
    # Zero out tokens beyond cutoff
    mask = torch.zeros_like(sorted_probs)
    for i in range(len(cutoff_idx)):
        mask[i, :cutoff_idx[i] + 1] = 1.0
    
    filtered_probs = sorted_probs * mask
    filtered_probs = filtered_probs / filtered_probs.sum(dim=-1, keepdim=True)
    
    # Sample
    token_idx = torch.multinomial(filtered_probs, num_samples=1)
    token = sorted_indices.gather(1, token_idx)
    return token
```

**Advantage over Top-K**: Adapts to the distribution shape. When the model is confident, it uses fewer tokens; when uncertain, it uses more.

### 5. Min-P Sampling

```python
def min_p_sampling(logits, min_p=0.1, temperature=1.0):
    """Sample from tokens with prob >= min_p * max_prob."""
    logits = logits / temperature
    probs = F.softmax(logits, dim=-1)
    
    max_prob = probs.max(dim=-1, keepdim=True).values
    threshold = max_prob * min_p
    
    mask = probs >= threshold
    filtered_probs = probs * mask
    filtered_probs = filtered_probs / filtered_probs.sum(dim=-1, keepdim=True)
    
    token = torch.multinomial(filtered_probs, num_samples=1)
    return token
```

**Advantage**: More stable than Top-P across different distributions.

### 6. Temperature Scaling

```python
def temperature_scaled_logits(logits, temperature=0.7):
    """Control randomness via temperature.
    
    temperature < 1.0: More deterministic (sharper distribution)
    temperature = 1.0: No change
    temperature > 1.0: More random (flatter distribution)
    temperature → 0: Greedy decoding
    temperature → ∞: Uniform random
    """
    return logits / temperature
```

### 7. Repetition Penalty

```python
def apply_repetition_penalty(logits, generated_tokens, penalty=1.2):
    """Penalize tokens that have already been generated."""
    for token_id in set(generated_tokens):
        if logits[0, token_id] > 0:
            logits[0, token_id] /= penalty
        else:
            logits[0, token_id] *= penalty
    return logits
```

**Related Parameters**:
- `frequency_penalty`: Penalize by frequency of occurrence
- `presence_penalty`: Penalize if token appeared at all (binary)

## Combined Strategy: Production Defaults

```python
class ProductionDecoder:
    """Standard production decoding pipeline."""
    
    def __init__(self, config):
        self.temperature = config.get("temperature", 0.7)
        self.top_p = config.get("top_p", 0.9)
        self.top_k = config.get("top_k", 50)
        self.repetition_penalty = config.get("repetition_penalty", 1.1)
        self.max_tokens = config.get("max_tokens", 1024)
    
    def decode_step(self, logits, generated_tokens):
        # 1. Temperature scaling
        logits = logits / self.temperature
        
        # 2. Repetition penalty
        logits = self.apply_repetition_penalty(logits, generated_tokens)
        
        # 3. Top-K filtering
        if self.top_k > 0:
            logits = self.top_k_filter(logits, self.top_k)
        
        # 4. Top-P filtering
        if self.top_p < 1.0:
            logits = self.top_p_filter(logits, self.top_p)
        
        # 5. Sample
        probs = F.softmax(logits, dim=-1)
        token = torch.multinomial(probs, num_samples=1)
        return token
```

## Strategy Selection Guide

| Task | Temperature | Top-P | Top-K | Strategy |
|------|------------|-------|-------|----------|
| Factual QA | 0.0-0.3 | 1.0 | 1-10 | Greedy or near-greedy |
| Code generation | 0.0-0.2 | 0.95 | 40 | Deterministic |
| Creative writing | 0.7-1.0 | 0.9-0.95 | 50-100 | Diverse sampling |
| Chatbot | 0.5-0.8 | 0.9 | 40-50 | Balanced |
| Summarization | 0.3-0.5 | 0.9 | 40 | Focused |
| Brainstorming | 0.8-1.2 | 0.95 | 100 | Very diverse |
| Translation | 0.0-0.3 | 1.0 | 1-5 | Beam search |

## Constrained Decoding

### Grammar-Constrained Generation

```python
# Using Outlines library
import outlines

model = outlines.models.transformers("meta-llama/Llama-3-8B")

# JSON-constrained generation
generator = outlines.generate.json(model, schema={
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "age": {"type": "integer"},
        "skills": {"type": "array", "items": {"type": "string"}}
    },
    "required": ["name", "age"]
})

result = generator("Generate a person profile")
# Guaranteed valid JSON output
```

### Regex-Constrained Generation

```python
# Generate email addresses only
generator = outlines.generate.regex(
    model,
    r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
)
result = generator("Generate an email address:")
```

## Structured Output with Instructor

```python
import instructor
from openai import OpenAI
from pydantic import BaseModel

client = instructor.from_openai(OpenAI())

class ExtractedEntity(BaseModel):
    name: str
    entity_type: str
    confidence: float

class ExtractionResult(BaseModel):
    entities: list[ExtractedEntity]
    summary: str

result = client.chat.completions.create(
    model="gpt-4o",
    response_model=ExtractionResult,
    messages=[{"role": "user", "content": "Extract entities from: ..."}]
)
# Guaranteed to match Pydantic schema
```

## Speculative Decoding

```python
def speculative_decode(draft_model, target_model, prompt, k=4):
    """Use small draft model to propose tokens, verify with target."""
    generated = prompt.clone()
    
    while len(generated) < max_length:
        # Draft model proposes k tokens
        draft_tokens = []
        draft_input = generated
        for _ in range(k):
            draft_logits = draft_model(draft_input)
            draft_token = sample(draft_logits)
            draft_tokens.append(draft_token)
            draft_input = torch.cat([draft_input, draft_token], dim=-1)
        
        # Target model verifies all k tokens at once
        target_logits = target_model(torch.cat([generated] + draft_tokens, dim=-1))
        
        # Accept/reject each draft token
        accepted = 0
        for i, draft_token in enumerate(draft_tokens):
            target_prob = F.softmax(target_logits[:, len(generated) + i, :], dim=-1)
            draft_prob = ...  # Draft model probability
            
            if torch.rand(1) < min(1, target_prob / draft_prob):
                generated = torch.cat([generated, draft_token], dim=-1)
                accepted += 1
            else:
                # Resample from target distribution
                corrected_token = sample(target_logits[:, len(generated) + i, :])
                generated = torch.cat([generated, corrected_token], dim=-1)
                break
    
    return generated
```

**Speedup**: 2-3x faster than standard autoregressive generation.

## Related Topics

- [[LLM_Inference_Deep_Dive]]: Inference optimization
- [[Structured_Output_Guide]]: Output formatting
- [[Transformer_Architecture]]: Model internals
- [[Prompt_Engineering]]: Input-side control
