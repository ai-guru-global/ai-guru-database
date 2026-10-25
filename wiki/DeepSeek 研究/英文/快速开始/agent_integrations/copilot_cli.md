# Integrate with GitHub Copilot CLI

*Configure GitHub Copilot CLI to use DeepSeek V4 models via BYOK (Bring Your Own Key) with the Anthropic-compatible endpoint.*

**Path:** Quick Start > Agent Integrations > GitHub Copilot CLI

---

**Source:** https://api-docs.deepseek.com/quick_start/agent_integrations/copilot_cli

# Integrate with GitHub Copilot CLI

Configure GitHub Copilot CLI to use DeepSeek V4 models via BYOK (Bring Your Own Key) with the Anthropic-compatible endpoint.

> **Important:** Use `anthropic` as the provider type. The `openai` type triggers a `400` error: `The reasoning_content in the thinking mode must be passed back to the API.` — DeepSeek requires `reasoning_content` to be echoed back on subsequent requests, which Copilot CLI's OpenAI integration does not support. The Anthropic Messages API endpoint avoids this issue entirely.

#### 1. Install GitHub Copilot CLI ​

```
npm install -g @github/copilot
```

Requires Node.js 22 or later. See the [official getting-started guide](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-getting-started) for details.

#### 2. Get a DeepSeek API Key ​

- Go to [DeepSeek Platform](https://platform.deepseek.com/api_keys) and create an API key.
- Copy the key (it starts with `sk-`).

#### 3. Configure Environment Variables ​

Linux / Mac:

```
export COPILOT_PROVIDER_TYPE=anthropicexport COPILOT_PROVIDER_BASE_URL=https://api.deepseek.com/anthropicexport COPILOT_PROVIDER_API_KEY=sk-your-deepseek-api-keyexport COPILOT_MODEL=deepseek-v4-pro
```

Windows (PowerShell):

```
$env:COPILOT_PROVIDER_TYPE="anthropic"$env:COPILOT_PROVIDER_BASE_URL="https://api.deepseek.com/anthropic"$env:COPILOT_PROVIDER_API_KEY="sk-your-deepseek-api-key"$env:COPILOT_MODEL="deepseek-v4-pro"
```

Available models: `deepseek-v4-pro`, `deepseek-v4-flash`. Switch by changing `COPILOT_MODEL`.

#### 4. Start Copilot CLI ​

```
copilot
```

Full agent mode, tool calling, and MCP support — all powered by DeepSeek.

#### Optional: Token Limits ​

Since `deepseek-v4-pro` is not in Copilot CLI's built-in model catalog, configure the token limits explicitly:

Linux / Mac:

```
export COPILOT_PROVIDER_MAX_PROMPT_TOKENS=840000export COPILOT_PROVIDER_MAX_OUTPUT_TOKENS=128000
```

Windows (PowerShell):

```
$env:COPILOT_PROVIDER_MAX_PROMPT_TOKENS="840000"$env:COPILOT_PROVIDER_MAX_OUTPUT_TOKENS="128000"
```

Run `copilot help providers` for all available environment variables.

#### Optional: Offline Mode ​

Linux / Mac:

```
export COPILOT_OFFLINE=true
```

Windows (PowerShell):

```
$env:COPILOT_OFFLINE="true"
```

Note: your prompts still go to `api.deepseek.com` — offline mode only blocks GitHub's API calls.

#### Resources ​

- [GitHub Copilot CLI BYOK docs](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-byok-models)
