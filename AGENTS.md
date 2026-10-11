# AI Coding Agent Instructions

## Mission
Build a reliable, approachable real-time chat MVP using React on the frontend and Java/Spring Boot on the backend, with WebSocket messaging.

## Before changing code
1. Inspect the repository, existing dependencies, scripts, and conventions.
2. Read `README.md` and relevant files in `docs/`.
3. Summarize your implementation plan for changes that affect multiple modules.
4. Prefer incremental changes over replacing working code.

## Technical expectations
- Keep frontend UI, state, and transport logic in separate modules.
- Keep backend WebSocket configuration, message models, validation, and handlers/controllers separated.
- Use clear, descriptive names and small functions.
- Validate and normalize usernames and message content on the server, not only in the UI.
- Define and document the WebSocket destination names in one place where practical.
- Handle reconnects, disconnects, empty messages, and malformed payloads gracefully.
- Show connection state to the user.
- Do not claim delivery guarantees, message persistence, authentication, or encryption unless implemented and tested.

## Security and privacy
- Never commit credentials, tokens, private keys, or real `.env` files.
- Treat usernames and message content as untrusted input.
- Render user-provided content as text; do not inject it as HTML.
- Configure allowed origins explicitly for production.
- Do not add authentication or persistence without documenting the design and trade-offs.
- Avoid logging full message bodies or sensitive data unnecessarily.

## Quality gates
- Add or update tests for message validation and important UI behavior.
- Run frontend lint/build/test commands that actually exist in `package.json`.
- Run backend tests with Maven.
- Report commands run and their results accurately. If a command was not run, say so.
- Keep documentation aligned with the actual implementation.

## Scope control
- Implement the MVP described in `docs/PRD.md` first.
- Ask before introducing a database, authentication provider, deployment platform, or unrelated feature.
- Do not add dependencies when a small existing utility will do.
- Keep changes focused and explain any trade-offs.
