# FIM 补全（Beta）

*FIM（Fill-In-the-Middle）补全 API。*

---

**Source:** https://api-docs.deepseek.com/zh-cn/api/create-completion

# FIM 补全（Beta）

```
POST /completions
```

FIM（Fill-In-the-Middle）补全 API。

用户需要设置 `base_url="https://api.deepseek.com/beta"` 来使用此功能。

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
