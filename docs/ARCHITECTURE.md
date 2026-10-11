# Architecture

## Overview
The browser runs a React application. It establishes a WebSocket connection to the Spring Boot server using STOMP over WebSocket. A client publishes a message to an application destination; the backend validates it and broadcasts it to subscribers of the shared-room topic.

```text
Browser A (React)
  ├── WebSocket/STOMP publish: /app/chat.send
  ▼
Spring Boot WebSocket endpoint: /ws
  ├── validate and normalize payload
  └── broadcast: /topic/chat
       ├── Browser A subscriber
       ├── Browser B subscriber
       └── Browser N subscriber
```

## Suggested frontend modules
- `src/pages/JoinPage` — username entry and join flow
- `src/pages/ChatPage` — room layout and message list
- `src/components/MessageList` — message history visible in the current session
- `src/components/MessageInput` — compose and send UI
- `src/components/ConnectionStatus` — connection state
- `src/hooks/useChatSocket` — connect, subscribe, publish, disconnect, reconnect behavior
- `src/types/chat.ts` — shared client-side message types

Adapt the layout to the framework and conventions already in the repository.

## Suggested backend modules
- WebSocket configuration — endpoint, broker, application destination prefix, allowed origins
- Chat message DTO — sender, content, timestamp
- Chat controller/handler — receive, validate, and broadcast messages
- Validation/error handling — reject invalid payloads and keep errors understandable
- Unit/integration tests — validation and WebSocket message flow

## Message flow
1. User enters a display name and joins.
2. Frontend opens a WebSocket/STOMP connection.
3. Frontend subscribes to `/topic/chat`.
4. User submits a message to `/app/chat.send`.
5. Backend validates the payload and applies a server timestamp.
6. Backend broadcasts to `/topic/chat`.
7. Connected subscribers append the incoming message to the UI.

## Important design notes
- A broker configured in Spring Boot may be an in-memory simple broker. This is suitable for a demo, not automatically a horizontally scalable production system.
- Without a database, message history is not durable; users who join later may not see prior messages.
- A display name is not authentication and can be impersonated.
- In production, use HTTPS/WSS, explicit allowed origins, rate limiting, payload limits, monitoring, and an appropriate broker/persistence architecture.
- Avoid assuming messages are delivered exactly once. Reconnects and retries need deliberate handling if stronger guarantees are required.
