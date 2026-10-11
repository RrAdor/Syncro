import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types/chat';

interface MessageListProps {
  messages: ChatMessage[];
  currentUsername: string;
}

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function getAvatarColor(name: string): string {
  const colors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f97316',
    '#10b981', '#06b6d4', '#6366f1', '#14b8a6'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUsername,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="empty-chat-state" aria-live="polite">
        <div className="empty-chat-icon" aria-hidden="true">💬</div>
        <h3>Welcome to the room!</h3>
        <p>No messages yet. Be the first to say hello!</p>
      </div>
    );
  }

  return (
    <div className="message-list-container" role="log" aria-label="Chat messages" aria-live="polite">
      {messages.map((msg, index) => {
        const isOwn = msg.sender.trim().toLowerCase() === currentUsername.trim().toLowerCase();
        const avatarLetter = (msg.sender[0] || '?').toUpperCase();
        const avatarBg = getAvatarColor(msg.sender);

        return (
          <div
            key={msg.id || `${msg.sender}-${msg.timestamp}-${index}`}
            className={`message-item-wrapper ${isOwn ? 'own-message' : 'other-message'}`}
          >
            {!isOwn && (
              <div
                className="message-avatar"
                style={{ backgroundColor: avatarBg }}
                aria-hidden="true"
              >
                {avatarLetter}
              </div>
            )}
            <div className="message-bubble-group">
              <div className="message-meta">
                <span className="message-sender">{isOwn ? 'You' : msg.sender}</span>
                {msg.timestamp && (
                  <span className="message-time" title={msg.timestamp}>
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>
              <div className="message-bubble">
                <p className="message-text">{msg.content}</p>
              </div>
            </div>
            {isOwn && (
              <div
                className="message-avatar own-avatar"
                style={{ backgroundColor: '#4f46e5' }}
                aria-hidden="true"
              >
                {avatarLetter}
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

