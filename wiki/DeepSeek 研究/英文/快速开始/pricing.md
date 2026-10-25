# Models & Pricing

*The prices listed below are in units of per 1M tokens. A token, the smallest unit of text that the model recognizes, can be a word, a number, or even a punctuation mark. We will bill based on the total number of input and output tokens by the model.*

**Path:** Quick Start > Models & Pricing

---

**Source:** https://api-docs.deepseek.com/quick_start/pricing

# Models & Pricing

The prices listed below are in units of per 1M tokens. A token, the smallest unit of text that the model recognizes, can be a word, a number, or even a punctuation mark. We will bill based on the total number of input and output tokens by the model.

---

## Model Details ​

| MODEL | deepseek-v4-flash^(1) | deepseek-v4-pro |
|---|---|---|
| BASE URL (OpenAI Format) | [https://api.deepseek.com](https://api.deepseek.com) |
| BASE URL (Anthropic Format) | [https://api.deepseek.com/anthropic](https://api.deepseek.com/anthropic) |
| MODEL VERSION | DeepSeek-V4-Flash | DeepSeek-V4-Pro |
| THINKING MODE | Supports both non-thinking and thinking (default) modes
See [Thinking Mode](/guides/thinking_mode) for how to switch |
| CONTEXT LENGTH | 1M |
| MAX OUTPUT | MAXIMUM: 384K |
| FEATURES | [Json Output](/guides/json_mode) | ✓ | ✓ |
| [Tool Calls](/guides/tool_calls) | ✓ | ✓ |
| [Chat Prefix Completion（Beta）](/guides/chat_prefix_completion) | ✓ | ✓ |
| [FIM Completion（Beta）](/guides/fim_completion) | Non-thinking mode only | Non-thinking mode only |
| PRICING | 1M INPUT TOKENS (CACHE HIT) | $0.0028 | $0.003625 |
| 1M INPUT TOKENS (CACHE MISS) | $0.14 | $0.435 |
| 1M OUTPUT TOKENS | $0.28 | $0.87 |
| Concurrency Limit^(2) | 2500 | 500 |

(1) The model names `deepseek-chat` and `deepseek-reasoner` will be deprecated on 2026/07/24 15:59 UTC. For compatibility, they correspond to the non-thinking mode and thinking mode of `deepseek-v4-flash`, respectively.

(2) For more details on concurrency limits, please refer to [Rate Limit & Isolation](/quick_start/rate_limit)

---

## Deduction Rules ​

The expense = number of tokens × price.
The corresponding fees will be directly deducted from your topped-up balance or granted balance, with a preference for using the granted balance first when both balances are available.

Product prices may vary and DeepSeek reserves the right to adjust them. We recommend topping up based on your actual usage and regularly checking this page for the most recent pricing information.
