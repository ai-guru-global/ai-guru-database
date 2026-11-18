# Create Chat Completion

*Creates a model response for the given chat conversation.*

**Path:** API Reference > Chat > Create Chat Completion

---

**Source:** https://api-docs.deepseek.com/api/create-chat-completion

# Create Chat Completion

```
POST /chat/completions
```

Creates a model response for the given chat conversation.

## Request ​

- application/json

### Body

required

## Responses ​

- 200 (No streaming)
- 200 (Streaming)

OK, returns a `chat completion object`

- application/json

- Schema
- Example (from schema)
- Example

Schema

```
{  "id": "string",  "choices": [    {      "finish_reason": "stop",      "index": 0,      "message": {        "content": "string",        "reasoning_content": "string",        "tool_calls": [          {            "id": "string",            "type": "function",            "function": {              "name": "string",              "arguments": "string"            }          }        ],        "role": "assistant"      },      "logprobs": {        "content": [          {            "token": "string",            "logprob": 0,            "bytes": [              0            ],            "top_logprobs": [              {                "token": "string",                "logprob": 0,                "bytes": [                  0                ]              }            ]          }        ],        "reasoning_content": [          {            "token": "string",            "logprob": 0,            "bytes": [              0            ],            "top_logprobs": [              {                "token": "string",                "logprob": 0,                "bytes": [                  0                ]              }            ]          }        ]      }    }  ],  "created": 0,  "model": "string",  "system_fingerprint": "string",  "object": "chat.completion",  "usage": {    "completion_tokens": 0,    "prompt_tokens": 0,    "prompt_cache_hit_tokens": 0,    "prompt_cache_miss_tokens": 0,    "total_tokens": 0,    "completion_tokens_details": {      "reasoning_tokens": 0    }  }}
```

```
{  "id": "930c60df-bf64-41c9-a88e-3ec75f81e00e",  "choices": [    {      "finish_reason": "stop",      "index": 0,      "message": {        "content": "Hello! How can I help you today?",        "role": "assistant"      }    }  ],  "created": 1705651092,  "model": "deepseek-v4-pro",  "object": "chat.completion",  "usage": {    "completion_tokens": 10,    "prompt_tokens": 16,    "total_tokens": 26  }}
```

OK, returns a streamed sequence of `chat completion chunk` objects

- text/event-stream

- Schema
- Example

Schema

- Array [
- ]

```
data: {"id": "1f633d8bfc032625086f14113c411638", "choices": [{"index": 0, "delta": {"content": "", "role": "assistant"}, "finish_reason": null, "logprobs": null}], "created": 1718345013, "model": "deepseek-v4-pro", "system_fingerprint": "fp_a49d71b8a1", "object": "chat.completion.chunk", "usage": null}data: {"choices": [{"delta": {"content": "Hello", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-v4-pro", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}data: {"choices": [{"delta": {"content": "!", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-v4-pro", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}data: {"choices": [{"delta": {"content": " How", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-v4-pro", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}data: {"choices": [{"delta": {"content": " can", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-v4-pro", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}data: {"choices": [{"delta": {"content": " I", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-v4-pro", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}data: {"choices": [{"delta": {"content": " assist", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-v4-pro", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}data: {"choices": [{"delta": {"content": " you", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-v4-pro", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}data: {"choices": [{"delta": {"content": " today", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-v4-pro", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}data: {"choices": [{"delta": {"content": "?", "role": "assistant"}, "finish_reason": null, "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-v4-pro", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1"}data: {"choices": [{"delta": {"content": "", "role": null}, "finish_reason": "stop", "index": 0, "logprobs": null}], "created": 1718345013, "id": "1f633d8bfc032625086f14113c411638", "model": "deepseek-v4-pro", "object": "chat.completion.chunk", "system_fingerprint": "fp_a49d71b8a1", "usage": {"completion_tokens": 9, "prompt_tokens": 17, "total_tokens": 26}}data: [DONE]
```
