# Create FIM Completion (Beta)

*The FIM (Fill-In-the-Middle) Completion API.*

**Path:** API Reference > Completions > Create FIM Completion (Beta)

---

**Source:** https://api-docs.deepseek.com/api/create-completion

# Create FIM Completion (Beta)

```
POST /completions
```

The FIM (Fill-In-the-Middle) Completion API.
User must set `base_url="https://api.deepseek.com/beta"` to use this feature.

## Request ​

- application/json

### Body

required

## Responses ​

- 200

OK

- application/json

- Schema
- Example (from schema)

Schema

```
{  "id": "string",  "choices": [    {      "finish_reason": "stop",      "index": 0,      "logprobs": {        "text_offset": [          0        ],        "token_logprobs": [          0        ],        "tokens": [          "string"        ],        "top_logprobs": [          {}        ]      },      "text": "string"    }  ],  "created": 0,  "model": "string",  "system_fingerprint": "string",  "object": "text_completion",  "usage": {    "completion_tokens": 0,    "prompt_tokens": 0,    "prompt_cache_hit_tokens": 0,    "prompt_cache_miss_tokens": 0,    "total_tokens": 0,    "completion_tokens_details": {      "reasoning_tokens": 0    }  }}
```
