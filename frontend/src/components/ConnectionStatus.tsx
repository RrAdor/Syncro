import React from 'react';
import { ConnectionState } from '../types/chat';

interface ConnectionStatusProps {
  status: ConnectionState;
  onReconnect?: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  onReconnect,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'CONNECTED':
        return {
          label: 'Connected',
          colorClass: 'status-connected',
          dotColor: '#10b981',
        };
      case 'CONNECTING':
        return {
          label: 'Connecting...',
          colorClass: 'status-connecting',
          dotColor: '#f59e0b',
        };
      case 'RECONNECTING':
        return {
          label: 'Reconnecting...',
          colorClass: 'status-reconnecting',
          dotColor: '#f59e0b',
        };
      case 'ERROR':
        return {
          label: 'Connection Error',
          colorClass: 'status-error',
          dotColor: '#ef4444',
        };
      case 'DISCONNECTED':
      default:
        return {
          label: 'Disconnected',
          colorClass: 'status-disconnected',
          dotColor: '#6b7280',
        };
    }
  };

  const config = getStatusConfig();
  const showRetry = (status === 'DISCONNECTED' || status === 'ERROR') && onReconnect;

  return (
    <div className={`connection-status-pill ${config.colorClass}`} role="status" aria-live="polite">
      <span
        className="status-dot"
        style={{ backgroundColor: config.dotColor }}
        aria-hidden="true"
      />
      <span className="status-label">{config.label}</span>
      {showRetry && (
        <button
          type="button"
          onClick={onReconnect}
          className="reconnect-button"
          aria-label="Reconnect to chat server"
        >
          Reconnect
        </button>
      )}
    </div>
  );
};

