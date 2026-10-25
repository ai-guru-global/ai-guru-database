# chat_nodejs

---

**Source:** https://api-docs.deepseek.com/api_samples/chat_nodejs

```
// Please install OpenAI SDK first: `npm install openai`import OpenAI from "openai";const openai = new OpenAI({        baseURL: 'https://api.deepseek.com',        apiKey: process.env.DEEPSEEK_API_KEY,});async function main() {  const completion = await openai.chat.completions.create({    messages: [{ role: "system", content: "You are a helpful assistant." }],    model: "deepseek-v4-pro",    thinking: {"type": "enabled"},    reasoning_effort: "high",    stream: false,  });  console.log(completion.choices[0].message.content);}main();
```
