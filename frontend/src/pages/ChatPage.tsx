import React from 'react';
import { useChatSocket } from '../hooks/useChatSocket';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';

interface ChatPageProps {
  username: string;
  onLeave: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ username, onLeave }) => {
  const {
    messages,
    connectionState,
    errorMessage,
    sendMessage,
    clearError,
    reconnect,
  } = useChatSocket({ username });

  const isConnected = connectionState === 'CONNECTED';

  return (
    <div className="chat-page-container">
      {/* Top Header */}
      <header className="chat-header">
        <div className="chat-header-left">
          <div className="chat-room-badge" aria-hidden="true">#</div>
          <div>
            <h1 className="chat-room-title">Syncro Shared Room</h1>
            <p className="chat-room-desc">Public team messaging room</p>
          </div>
        </div>

        <div className="chat-header-right">
          <ConnectionStatus status={connectionState} onReconnect={reconnect} />
          
          <div className="chat-user-badge">
            <span className="user-indicator-dot" aria-hidden="true" />
            <span className="user-name-text">{username}</span>
          </div>

          <button
            type="button"
            onClick={onLeave}
            className="leave-room-button"
            title="Leave room and return to join screen"
          >
            Leave
          </button>
        </div>
      </header>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="chat-error-banner" role="alert">
          <span className="error-icon" aria-hidden="true">⚠️</span>
          <span className="error-text">{errorMessage}</span>
          <button
            type="button"
            onClick={clearError}
            className="error-dismiss-button"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Messages Viewport */}
      <main className="chat-main-content">
        <MessageList messages={messages} currentUsername={username} />
      </main>

      {/* Bottom Composer */}
      <footer className="chat-footer">
        <MessageInput onSendMessage={sendMessage} disabled={!isConnected} />
      </footer>
    </div>
  );
};

