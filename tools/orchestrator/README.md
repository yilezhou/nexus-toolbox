# Nexus Orchestrator (v0.1) 🎼

**The Engine of the Nexus Way.**

This tool automates the "Assembly Line" workflow for AI development. It replaces manual prompting with a state-driven loop that manages specialized sub-agents.

## Features
- **State Management:** Reads `STATUS.md` to know what to do next.
- **Agent Spawning:** Wraps the OpenClaw API to spawn Architect, Coder, and Auditor agents.
- **Resilience:** Retries failed agents automatically.
- **Git Integration:** Auto-commits finished artifacts to the repo.

## Usage
```bash
node orchestrator.js --project ./my-feature
```
