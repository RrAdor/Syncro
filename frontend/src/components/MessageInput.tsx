import React, { useState } from 'react';
import { LIMITS } from '../constants/destinations';

interface MessageInputProps {
  onSendMessage: (content: string) => boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [content, setContent] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    const trimmed = content.trim();
    if (!trimmed) {
      setInputError('Please enter a message');
      return;
    }

    if (trimmed.length > LIMITS.MAX_CONTENT_LENGTH) {
      setInputError(`Message exceeds ${LIMITS.MAX_CONTENT_LENGTH} characters`);
      return;
    }

    const success = onSendMessage(trimmed);
    if (success) {
      setContent('');
      setInputError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (inputError) {
      setInputError(null);
    }
  };

  const charCount = content.length;
  const isOverLimit = charCount > LIMITS.MAX_CONTENT_LENGTH;

  return (
    <form className="message-input-form" onSubmit={handleSubmit} noValidate>
      {inputError && (
        <div className="input-inline-error" role="alert">
          {inputError}
        </div>
      )}
      <div className="input-row">
        <textarea
          className={`message-textarea ${inputError ? 'has-error' : ''}`}
          placeholder={
            disabled
              ? 'Connecting to chat server...'
              : 'Type a message... (Press Enter to send, Shift+Enter for new line)'
          }
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={2}
          maxLength={LIMITS.MAX_CONTENT_LENGTH + 50}
          aria-label="Type your message"
        />
        <button
          type="submit"
          className="send-button"
          disabled={disabled || !content.trim() || isOverLimit}
          aria-label="Send message"
        >
          <span>Send</span>
          <svg
            className="send-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <div className="input-meta-bar">
        <span className="input-shortcut-hint">
          <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for newline
        </span>
        <span
          className={`char-counter ${isOverLimit ? 'char-over-limit' : ''}`}
          aria-live="polite"
        >
          {charCount}/{LIMITS.MAX_CONTENT_LENGTH}
        </span>
      </div>
    </form>
  );
};

