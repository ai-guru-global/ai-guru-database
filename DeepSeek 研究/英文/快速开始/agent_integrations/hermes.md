# Integrate with Hermes Agent

*Hermes is a self-improving AI agent built by Nous Research. It includes a built-in learning loop: it creates skills from experience, improves them during use, persists knowledge, and builds an evolving model of your preferences across sessions.*

**Path:** Quick Start > Agent Integrations > Hermes

---

**Source:** https://api-docs.deepseek.com/quick_start/agent_integrations/hermes

# Integrate with Hermes Agent

Hermes is a self-improving AI agent built by Nous Research. It includes a built-in learning loop: it creates skills from experience, improves them during use, persists knowledge, and builds an evolving model of your preferences across sessions.

#### 1. Install Hermes ​

##### Quick Install ​

Get Hermes Agent up and running in under two minutes with the one-line installer.

##### Linux / macOS / WSL2 ​

```
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

The only prerequisite is Git. The installer automatically handles everything else.

For more installation instructions, please refer to the [Hermes installation page](https://hermes-agent.nousresearch.com/docs/getting-started/installation).

#### 2. Run and Configure ​

Reload your shell and start Hermes configuration:

- Execute the `hermes setup` command
- Choose the Quick Setup option
- When prompted for the model provider, select **DeepSeek**
- Enter your [DeepSeek API Key](https://platform.deepseek.com/api_keys)
- Enter the Base URL as `https://api.deepseek.com`
- Select the `deepseek-v4-pro` model
- Continue with the remaining options
