export type ConnectionState =
  | 'CONNECTING'
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'RECONNECTING'
  | 'ERROR';

export interface ChatMessage {
  id?: string;
  sender: string;
  content: string;
  timestamp: string; // ISO-8601 string from backend
}

export interface SendMessagePayload {
  sender: string;
  content: string;
}

export interface ErrorMessage {
  error: string;
  timestamp: string;
}

