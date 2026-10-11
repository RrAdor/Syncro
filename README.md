# Syncro — Real-Time Chat Application

A simplified WhatsApp/Slack-style web application where multiple users join a shared chat room and exchange messages in real time without refreshing the browser.

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript, `@stomp/stompjs`
- **Backend**: Java 21, Spring Boot 3.3.4, Spring WebSocket / STOMP
- **Real-Time Transport**: STOMP over WebSocket
- **Build & Test Tools**: npm, Maven Wrapper (`./mvnw`), Vitest, JUnit 5

## MVP Features
- **Display name entry**: Join screen with client & server validation (1–24 chars, trimmed).
- **Shared chat room**: Real-time group room with live message feed.
- **Bidirectional live broadcasting**: Message publishing via `/app/chat.send` and broadcast via `/topic/chat`.
- **Server timestamps**: Normalized timestamps assigned by the backend upon message processing.
- **Sender distinction**: Messages visually distinguish between the user's own messages and others.
- **Connection status lifecycle**: Visual status pill (Connected, Connecting, Reconnecting, Disconnected, Error) with manual reconnect button.
- **Validation & error handling**: Blank, whitespace-only, and oversized messages are rejected on both frontend and backend; server errors are received via `/topic/errors`.
- **Responsive & accessible design**: Mobile and desktop optimized layout with keyboard navigation (Enter to send, Shift+Enter for newline).

## Project Layout
```text
Syncro/
├── frontend/                     # React 18 + Vite + TypeScript application
│   ├── src/
│   │   ├── components/           # ConnectionStatus, MessageList, MessageInput
│   │   ├── pages/                # JoinPage, ChatPage
│   │   ├── hooks/                # useChatSocket (STOMP client lifecycle)
│   │   ├── constants/            # destinations.ts (centralized WebSocket destinations)
│   │   ├── types/                # chat.ts (ChatMessage, ConnectionState, etc.)
│   │   └── test/                 # Test setup and test suites
│   ├── package.json
│   └── vite.config.ts
├── backend/                      # Spring Boot 3 + Java 21 backend
│   ├── src/main/java/com/syncro/chat/
│   │   ├── config/               # WebSocketConfig, ChatConstants, WebSocketEventListener
│   │   ├── controller/           # ChatController, HealthController
│   │   ├── model/                # ChatMessageRequest, ChatMessageResponse, ErrorMessageResponse
│   │   └── service/              # ChatService (validation, normalization, timestamping)
│   ├── src/test/java/com/syncro/chat/ # ChatServiceTest, WebSocketIntegrationTest
│   ├── pom.xml
│   └── mvnw                      # Maven Wrapper script
├── docs/                         # PRD, Architecture, API, Database documents
├── AGENTS.md                     # Coding agent mission and guardrails
├── README.md
└── TODO.md                       # Task checklist
```

## Prerequisites
- Node.js (v18+) and npm
- Java 21 (or Java 17+)
- Maven (or use bundled `./mvnw`)

## Running Locally

### 1. Backend (Spring Boot)
From the repository root:
```bash
cd backend
./mvnw spring-boot:run
```
The backend server runs on `http://localhost:8080`.
Verify backend health:
```bash
curl http://localhost:8080/api/health
```

### 2. Frontend (React + Vite)
From the repository root:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will start on `http://localhost:5173`. Open two browser windows to test real-time messaging between different users!

## Running Tests

### Frontend Tests & Quality Checks
```bash
cd frontend
npm run lint    # Type check via tsc --noEmit
npm run build   # Production bundle build
npm run test    # Vitest unit & component test suite (16 tests)
```

### Backend Tests
```bash
cd backend
./mvnw test     # JUnit 5 unit & integration tests (18 tests)
```

## WebSocket Contract Overview
- **WebSocket Endpoint**: `ws://localhost:8080/ws` (with fallback at `/ws-sockjs`)
- **Application Destination**: `/app/chat.send`
- **Broadcast Topic**: `/topic/chat`
- **Error Topic**: `/topic/errors`

See [docs/API.md](docs/API.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), and [docs/PRD.md](docs/PRD.md) for full specifications.
