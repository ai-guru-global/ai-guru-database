# thinking_mode_api_example_non_streaming

---

**Source:** https://api-docs.deepseek.com/api_samples/thinking_mode_api_example_non_streaming

```
from openai import OpenAIclient = OpenAI(api_key="<DeepSeek API Key>", base_url="https://api.deepseek.com")# Turn 1messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]response = client.chat.completions.create(    model="deepseek-v4-pro",    messages=messages,    reasoning_effort="high"    extra_body={"thinking": {"type": "enabled"}},)reasoning_content = response.choices[0].message.reasoning_contentcontent = response.choices[0].message.content# Turn 2# The reasoning_content will be ignored by the APImessages.append(response.choices[0].message)messages.append({'role': 'user', 'content': "How many Rs are there in the word 'strawberry'?"})response = client.chat.completions.create(    model="deepseek-v4-pro",    messages=messages,    reasoning_effort="high"    extra_body={"thinking": {"type": "enabled"}},)# ...
```
