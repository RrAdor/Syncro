# Development Checklist

## Setup
- [x] Create React frontend project in `frontend/`.
- [x] Create Java/Spring Boot backend project in `backend/`.
- [x] Confirm Java, Spring Boot, Node.js, and package manager versions.
- [x] Add local run instructions and verify both services start.

## Backend
- [x] Configure STOMP over WebSocket endpoint `/ws`.
- [x] Configure `/app` application prefix and `/topic` broker prefix.
- [x] Implement message DTO and server-side validation.
- [x] Implement message handler for `/app/chat.send`.
- [x] Broadcast validated messages to `/topic/chat`.
- [x] Configure allowed origins appropriately.
- [x] Add unit tests for blank and oversized messages.
- [x] Add an integration test for message broadcast.

## Frontend
- [x] Build username join screen.
- [x] Build responsive chat layout.
- [x] Implement WebSocket/STOMP connection lifecycle.
- [x] Subscribe to `/topic/chat`.
- [x] Publish messages to `/app/chat.send`.
- [x] Display sender, content, and timestamp.
- [x] Distinguish own messages from others.
- [x] Add connection status and error states.
- [x] Prevent blank sends and support keyboard interaction.
- [x] Add component or hook tests where practical.

## Finish
- [x] Test with at least two browser sessions.
- [x] Run frontend lint/build/tests.
- [x] Run backend Maven tests.
- [x] Review input validation and origin policy.
- [x] Update README and architecture docs to reflect actual behavior.
