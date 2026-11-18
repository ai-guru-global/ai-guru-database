# Integrate with Claude Code

*Claude Code is an AI coding assistant that runs in the terminal.*

**Path:** Quick Start > Agent Integrations > Claude Code

---

**Source:** https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code

# Integrate with Claude Code

Claude Code is an AI coding assistant that runs in the terminal.

## Migrate from Existing Installation to DeepSeek ​

If you already have Claude Code installed, simply configure the following environment variables to point to the [DeepSeek Anthropic API](https://api.deepseek.com/anthropic). Get your API Key from the [DeepSeek Platform](https://platform.deepseek.com/api_keys):

Linux / Mac users:

```
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropicexport ANTHROPIC_AUTH_TOKEN=<your DeepSeek API Key>export ANTHROPIC_MODEL=deepseek-v4-pro[1m]export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flashexport CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flashexport CLAUDE_CODE_EFFORT_LEVEL=max
```

Windows users:

```
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"$env:ANTHROPIC_AUTH_TOKEN="<your DeepSeek API Key>"$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"$env:CLAUDE_CODE_EFFORT_LEVEL="max"
```

Then enter your project directory and run claude:

```
cd /path/to/my-projectclaude
```

## Install Claude Code from Scratch ​

#### 1. Install Claude Code ​

- Install [Node.js](https://nodejs.org/en/download/) 18+.
- Windows users need to install [Git for Windows](https://git-scm.com/download/win).
- Run the following command in your terminal to install Claude Code:

```
npm install -g @anthropic-ai/claude-code
```

- After installation, run the following command. If the version number is displayed, the installation is successful:

```
claude --version
```

#### 2. Configure Environment Variables ​

Linux / Mac users, run the following commands to configure environment variables for the [DeepSeek Anthropic API](https://api.deepseek.com/anthropic). Get your API Key from the [DeepSeek Platform](https://platform.deepseek.com/api_keys):

```
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropicexport ANTHROPIC_AUTH_TOKEN=<your DeepSeek API Key>export ANTHROPIC_MODEL=deepseek-v4-pro[1m]export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flashexport CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flashexport CLAUDE_CODE_EFFORT_LEVEL=max
```

Windows users, run:

```
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"$env:ANTHROPIC_AUTH_TOKEN="<your DeepSeek API Key>"$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"$env:CLAUDE_CODE_EFFORT_LEVEL="max"
```

#### 3. Enter the project directory and execute the claude command to get started. ​

```
cd /path/to/my-projectclaude
```

---

## Using Web Search in Claude Code ​

The DeepSeek API natively supports the Web Search feature in Claude Code. When using Claude Code, if the model determines that your question requires a web search, it will invoke the Web Search tool and perform the search through the API provided by DeepSeek. Because invoking the Web Search tool generates additional LLM API requests to summarize the retrieved search content, additional model token costs will be incurred.

The following image shows an example of triggering the Web Search feature in Claude Code, where the user's question (Help me to search for best Rust tutorials) triggered the Web Search tool:

---

## Model Mapping When Using Claude Code or Claude Desktop APP ​

When you use Claude Code or Claude Desktop APP, we map the Claude model names you pass in:

- Models starting with claude-opus are mapped to deepseek-v4-pro
- Models starting with claude-haiku or claude-sonnet are mapped to deepseek-v4-flash

With this mapping, when using the developer mode of the new Claude Desktop APP, you can bypass the APP's model name restrictions by simply changing the base_url and api_key to connect to DeepSeek models.
