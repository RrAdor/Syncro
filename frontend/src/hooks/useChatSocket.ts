import { useCallback, useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { ChatMessage, ConnectionState, ErrorMessage } from '../types/chat';
import { DEFAULT_WS_URL, DESTINATIONS, LIMITS } from '../constants/destinations';

interface UseChatSocketOptions {
  username: string;
  wsUrl?: string;
}

interface UseChatSocketReturn {
  messages: ChatMessage[];
  connectionState: ConnectionState;
  errorMessage: string | null;
  sendMessage: (content: string) => boolean;
  clearError: () => void;
  reconnect: () => void;
}

/**
 * Normalizes HTTP/HTTPS URLs to WS/WSS for the WebSocket client.
 */
function normalizeWebSocketUrl(url: string): string {
  if (url.startsWith('http://')) {
    return 'ws://' + url.slice('http://'.length);
  }
  if (url.startsWith('https://')) {
    return 'wss://' + url.slice('https://'.length);
  }
  return url;
}

export function useChatSocket({
  username,
  wsUrl = DEFAULT_WS_URL,
}: UseChatSocketOptions): UseChatSocketReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>('DISCONNECTED');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clientRef = useRef<Client | null>(null);
  const isManuallyDeactivatedRef = useRef<boolean>(false);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const connect = useCallback(() => {
    if (!username.trim()) {
      return;
    }

    if (clientRef.current) {
      clientRef.current.deactivate();
    }

    isManuallyDeactivatedRef.current = false;
    setConnectionState('CONNECTING');
    setErrorMessage(null);

    const brokerUrl = normalizeWebSocketUrl(wsUrl);

    const client = new Client({
      brokerURL: brokerUrl,
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg: string) => {
        if (import.meta.env.DEV) {
          console.debug('[STOMP]', msg);
        }
      },
    });

    client.onConnect = () => {
      setConnectionState('CONNECTED');
      setErrorMessage(null);

      // Subscribe to shared chat topic
      client.subscribe(DESTINATIONS.TOPIC_CHAT, (message: IMessage) => {
        try {
          const payload: ChatMessage = JSON.parse(message.body);
          if (payload && payload.sender && payload.content) {
            setMessages((prev) => [...prev, payload]);
          }
        } catch (err) {
          console.error('Failed to parse incoming chat message', err);
        }
      });

      // Subscribe to errors topic
      client.subscribe(DESTINATIONS.TOPIC_ERRORS, (message: IMessage) => {
        try {
          const payload: ErrorMessage = JSON.parse(message.body);
          if (payload && payload.error) {
            setErrorMessage(payload.error);
          }
        } catch {
          setErrorMessage('Server reported an unexpected error');
        }
      });
    };

    client.onStompError = (frame) => {
      setConnectionState('ERROR');
      setErrorMessage(frame.headers['message'] || 'Broker reported a protocol error');
    };

    client.onWebSocketClose = () => {
      if (!isManuallyDeactivatedRef.current) {
        setConnectionState('RECONNECTING');
      } else {
        setConnectionState('DISCONNECTED');
      }
    };

    clientRef.current = client;
    client.activate();
  }, [username, wsUrl]);

  useEffect(() => {
    connect();

    return () => {
      isManuallyDeactivatedRef.current = true;
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      setConnectionState('DISCONNECTED');
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    connect();
  }, [connect]);

  const sendMessage = useCallback(
    (content: string): boolean => {
      if (!clientRef.current || !clientRef.current.connected) {
        setErrorMessage('Cannot send message: not connected to server');
        return false;
      }

      const trimmedContent = content.trim();
      if (!trimmedContent) {
        setErrorMessage('Cannot send empty message');
        return false;
      }

      if (trimmedContent.length > LIMITS.MAX_CONTENT_LENGTH) {
        setErrorMessage(
          `Message cannot exceed ${LIMITS.MAX_CONTENT_LENGTH} characters`
        );
        return false;
      }

      const trimmedSender = username.trim();
      if (!trimmedSender) {
        setErrorMessage('Username is required');
        return false;
      }

      try {
        clientRef.current.publish({
          destination: DESTINATIONS.APP_SEND,
          body: JSON.stringify({
            sender: trimmedSender,
            content: trimmedContent,
          }),
        });
        return true;
      } catch (err) {
        setErrorMessage('Failed to publish message over WebSocket');
        return false;
      }
    },
    [username]
  );

  return {
    messages,
    connectionState,
    errorMessage,
    sendMessage,
    clearError,
    reconnect,
  };
}

