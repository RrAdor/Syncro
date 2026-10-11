# Claude Code Project Guide

Read `AGENTS.md` and the documents in `docs/` before implementing features.

## Working style
- First inspect the existing repository and identify what is already implemented.
- For non-trivial work, propose a short plan before editing.
- Work in small, testable steps.
- Avoid broad rewrites unless explicitly requested.
- When finished, summarize changed files, commands run, test results, and any remaining limitations.

## Project priorities
1. A user can enter a display name and join the shared room.
2. Messages are broadcast to connected clients in real time over WebSocket/STOMP.
3. The interface handles connection states and errors clearly.
4. Input is validated on the server and user content is rendered safely.
5. Setup and architecture documentation stay accurate.

## Boundaries
- Do not invent successful test results.
- Do not add authentication, database persistence, direct messages, or file uploads without approval.
- Do not expose secrets in source code or frontend environment variables.
