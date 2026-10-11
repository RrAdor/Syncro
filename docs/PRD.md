# Product Requirements Document

## 1. Product summary
A lightweight, browser-based group chat application. Users enter a display name, join one shared room, and exchange messages in real time without refreshing the page.

## 2. Goals
- Demonstrate real-time, bidirectional communication.
- Provide a simple, polished, responsive chat experience.
- Demonstrate separation between a React client and a Spring Boot backend.
- Keep the MVP small enough to build, test, and explain in an interview.

## 3. MVP user stories
- As a visitor, I can enter a username before joining the chat.
- As a participant, I can see the chat room after joining.
- As a participant, I can send a non-empty message.
- As a participant, I can see messages from other connected participants appear without refreshing.
- As a participant, I can distinguish my own messages from other users' messages.
- As a participant, I can see whether the WebSocket connection is connected or disconnected.
- As a participant, I receive understandable feedback when a message cannot be sent.

## 4. Functional requirements
- Username is required and trimmed; define a reasonable maximum length (for example, 24 characters).
- Message text is trimmed; empty messages are rejected.
- Messages have a server-generated timestamp where practical.
- Message payloads include a sender/display name, text, and timestamp.
- A new message is broadcast to the shared room's currently connected subscribers.
- The UI handles initial connection, connected, disconnected, and error states.
- The UI supports Enter to send and preserves a usable multiline/mobile experience if a textarea is used.

## 5. Out of scope for MVP
- User accounts, passwords, and authorization
- Private/direct messages or multiple named rooms
- Durable message history and database persistence
- File/image attachments, read receipts, typing indicators, reactions
- End-to-end encryption
- Moderation tools and administrative dashboards

## 6. Non-functional requirements
- Responsive layout for desktop and mobile.
- Safe rendering of user-supplied text; no HTML injection.
- Server-side validation in addition to client-side validation.
- Clear setup instructions for local development.
- Automated tests for core validation and message handling.
- Production deployments must use secure WebSockets (WSS) and explicit origin configuration.

## 7. Acceptance criteria
- Two browser sessions can join using different names and exchange messages live.
- Neither session needs a page refresh to see a new message.
- Empty/whitespace-only messages are not broadcast.
- Disconnected state is visible and sending failures are communicated.
- Frontend build and backend tests pass using the repository's configured commands.
- Documentation matches the actual implementation.
