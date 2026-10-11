export const DEFAULT_WS_URL =
  import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

export const DESTINATIONS = {
  APP_SEND: '/app/chat.send',
  TOPIC_CHAT: '/topic/chat',
  TOPIC_ERRORS: '/topic/errors',
} as const;

export const LIMITS = {
  MAX_USERNAME_LENGTH: 24,
  MAX_CONTENT_LENGTH: 1000,
} as const;

