---

name: wiki-history-ingest
tags: [wiki, history-ingest, router]
description: >
  Unified wiki-history-ingest entrypoint for conversation/session sources. Use this when the user says
  "/wiki-history-ingest claude", "/wiki-history-ingest copilot", "/wiki-history-ingest codex",
  "/wiki-history-ingest pi", or asks to ingest agent history without naming the underlying skill.
  This router dispatches to the specialized history skill.
---

# Unified History Ingest Router

This is a thin router for **history sources only**. It does not replace `wiki-ingest` for documents.

## Subcommands

If the user invokes `/wiki-history-ingest <target>` (or equivalent text command), dispatch directly:

| Subcommand | Route To |
|---|---|
| `claude` | `claude-history-ingest` |
| `copilot` | `copilot-history-ingest` |
| `codex` | `codex-history-ingest` |
| `hermes` | `hermes-history-ingest` |
| `openclaw` | `openclaw-history-ingest` |
| `pi` | `pi-history-ingest` |
| `auto` | infer from context using rules below |

## Routing Rules

1. If the user explicitly says `claude`, `copilot`, `codex`, `hermes`, `openclaw`, or `pi`, route directly.
2. If the user provides a path/source:
   - `~/.claude` or Claude memory/session JSONL artifacts -> `claude-history-ingest`
   - `~/.copilot`, `session-store.db`, VS Code copilot-chat transcripts -> `copilot-history-ingest`
   - `~/.codex` or rollout/session index artifacts -> `codex-history-ingest`
   - `~/.hermes` or Hermes memories/session artifacts -> `hermes-history-ingest`
   - `~/.openclaw` or OpenClaw MEMORY.md/session JSONL artifacts -> `openclaw-history-ingest`
   - `~/.pi/agent/sessions` or Pi session JSONL artifacts -> `pi-history-ingest`
3. If ambiguous, ask one short clarification:
   - "Should I ingest `claude`, `copilot`, `codex`, `hermes`, `openclaw`, or `pi` history?"

## Execution Contract

- After routing, execute the destination skill's workflow exactly.
- Do not duplicate destination logic in this file.
- Leave manifest/index/log update semantics to the destination skill.

## Design Decision: Why 6 Separate Skills (Not One Parametrized Skill)

Each source skill stays separate on purpose — this is **not** accidental duplication:

1. **Progressive disclosure** — merged body would exceed the ~1500-2000 line / 5000-token guidance
   for a single SKILL.md. Separation keeps each skill under the 500-line budget.
2. **Source-specific data formats** — `~/.claude/` audit logs, `~/.copilot/session-store.db`
   (SQLite), Codex rollout JSONL, Hermes memories, OpenClaw MEMORY.md, and Pi message-role
   schemas each need dedicated extraction rules and privacy filters. Co-locating them would
   bloat every activation with irrelevant parsing details.
3. **Trigger precision** — the catalog (Tier 1) shows 6 precise descriptions instead of one
   generic "ingest agent history", so the model activates exactly the right parser.
4. **Independent evolution** — formats change per tool; each skill can be updated in isolation
   without touching the other five.

This router is the single entry point; the specialized skills are the implementation layer.
Revisit this decision only if a source's parser drops below ~100 lines of unique logic.

## UX Convention

- Use `wiki-ingest` for **documents/content sources**
- Use `wiki-history-ingest` for **agent history sources**

Examples:

- `/wiki-history-ingest claude`
- `/wiki-history-ingest copilot`
- `/wiki-history-ingest codex`
- `/wiki-history-ingest hermes`
- `/wiki-history-ingest openclaw`
- `/wiki-history-ingest pi`
- `$wiki-history-ingest claude` (agents that use `$skill` invocation)
- `$wiki-history-ingest copilot`
