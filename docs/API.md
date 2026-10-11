# WebSocket API Contract

This document describes the implemented Syncro MVP contract.

## Connection
- WebSocket/STOMP endpoint: `/ws` (native WebSocket) and `/ws-sockjs` (SockJS fallback)
- Application destination prefix: `/app`
- Shared room topic: `/topic/chat`
- Errors broadcast topic: `/topic/errors`
- HTTP Health Check: `GET /api/health`

## Publish a Message
- Destination: `/app/chat.send`

Example payload:
```json
{
  "sender": "Rabby",
  "content": "Hello everyone!"
}
```

## Broadcast Message
- Subscribe to: `/topic/chat`

Example server-broadcast payload:
```json
{
  "sender": "Rabby",
  "content": "Hello everyone!",
  "timestamp": "2026-10-12T10:30:00.123456Z"
}
```

## Error Reporting
- Subscribe to: `/topic/errors`

Example error payload:
```json
{
  "error": "Message content cannot be blank",
  "timestamp": "2026-10-12T10:30:00.123456Z"
}
```

## Validation Rules
- `sender`: required, trimmed, 1 to 24 characters (`ChatConstants.MAX_SENDER_LENGTH`). Treated as a display name in MVP, not verified identity.
- `content`: required, trimmed, non-blank, 1 to 1000 characters (`ChatConstants.MAX_CONTENT_LENGTH`).
- `timestamp`: server-generated (`Instant.now()`), not trusted from the client.

## CORS and Origin Policy
Configured in `application.properties` via `app.cors.allowed-origins` (e.g. `http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000`).
