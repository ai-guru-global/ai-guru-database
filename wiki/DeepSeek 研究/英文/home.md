# Your First API Call

*The DeepSeek API uses an API format compatible with OpenAI/Anthropic. By modifying the configuration, you can use the OpenAI/Anthropic SDK or softwares compatible with the OpenAI/Anthropic API to access the DeepSeek API.*

**Path:** Quick Start > Your First API Call

---

**Source:** https://api-docs.deepseek.com/

# Your First API Call

The DeepSeek API uses an API format compatible with OpenAI/Anthropic. By modifying the configuration, you can use the OpenAI/Anthropic SDK or softwares compatible with the OpenAI/Anthropic API to access the DeepSeek API.

| PARAM | VALUE |
|---|---|
| base_url (OpenAI) | `https://api.deepseek.com` |
| base_url (Anthropic) | `https://api.deepseek.com/anthropic` |
| api_key | apply for an [API key](https://platform.deepseek.com/api_keys) |
| model^* | `deepseek-v4-flash`
`deepseek-v4-pro`
`deepseek-chat` (to be deprecated on 2026/07/24)
`deepseek-reasoner` (to be deprecated on 2026/07/24) |

* The model names `deepseek-chat` and `deepseek-reasoner` will be deprecated on 2026/07/24 15:59 UTC. For compatibility, they correspond to the non-thinking mode and thinking mode of `deepseek-v4-flash`, respectively.

## Integrate with Agent Tools ​

The DeepSeek API is supported by many popular AI agent and coding assistant tools. If you use tools like Claude Code, GitHub Copilot, or OpenCode, you can use DeepSeek as the backend model directly — no code required.

See the [Agent Integrations Guide](/quick_start/agent_integrations/claude_code) for details.

## Invoke The Chat API ​

Once you have obtained an API key, you can access the DeepSeek model using the following example scripts in the OpenAI API format. This is a non-stream example, you can set the `stream` parameter to `true` to get stream response.

For examples using the Anthropic API format, please refer to [Anthropic API](/guides/anthropic_api).

- curl
- python
- nodejs

```
curl https://api.deepseek.com/chat/completions \  -H "Content-Type: application/json" \  -H "Authorization: Bearer ${DEEPSEEK_API_KEY}" \  -d '{        "model": "deepseek-v4-pro",        "messages": [          {"role": "system", "content": "You are a helpful assistant."},          {"role": "user", "content": "Hello!"}        ],        "thinking": {"type": "enabled"},        "reasoning_effort": "high",        "stream": false      }'
```

```
# Please install OpenAI SDK first: `pip3 install openai`import osfrom openai import OpenAIclient = OpenAI(    api_key=os.environ.get('DEEPSEEK_API_KEY'),    base_url="https://api.deepseek.com")response = client.chat.completions.create(    model="deepseek-v4-pro",    messages=[        {"role": "system", "content": "You are a helpful assistant"},        {"role": "user", "content": "Hello"},    ],    stream=False,    reasoning_effort="high",    extra_body={"thinking": {"type": "enabled"}})print(response.choices[0].message.content)
```

```
// Please install OpenAI SDK first: `npm install openai`import OpenAI from "openai";const openai = new OpenAI({        baseURL: 'https://api.deepseek.com',        apiKey: process.env.DEEPSEEK_API_KEY,});async function main() {  const completion = await openai.chat.completions.create({    messages: [{ role: "system", content: "You are a helpful assistant." }],    model: "deepseek-v4-pro",    thinking: {"type": "enabled"},    reasoning_effort: "high",    stream: false,  });  console.log(completion.choices[0].message.content);}main();
```
