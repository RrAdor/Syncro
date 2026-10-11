import React, { useState } from 'react';
import { LIMITS } from '../constants/destinations';

interface JoinPageProps {
  onJoin: (username: string) => void;
}

export const JoinPage: React.FC<JoinPageProps> = ({ onJoin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (!trimmed) {
      setError('Please enter a display name to continue');
      return;
    }

    if (trimmed.length > LIMITS.MAX_USERNAME_LENGTH) {
      setError(`Display name cannot exceed ${LIMITS.MAX_USERNAME_LENGTH} characters`);
      return;
    }

    setError(null);
    onJoin(trimmed);
  };

  return (
    <div className="join-page-container">
      <div className="join-card">
        <div className="join-header">
          <div className="app-logo-badge" aria-hidden="true">
            ⚡
          </div>
          <h1 className="join-title">Syncro</h1>
          <p className="join-subtitle">
            Instant real-time group chat. Enter your name to join the room.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="join-form" noValidate>
          {error && (
            <div className="join-error-banner" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username-input" className="form-label">
              Your Display Name
            </label>
            <input
              id="username-input"
              type="text"
              className={`form-input ${error ? 'has-error' : ''}`}
              placeholder="e.g. Alex Rivera"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              maxLength={LIMITS.MAX_USERNAME_LENGTH}
              autoFocus
              autoComplete="off"
              required
            />
            <span className="form-hint">
              Between 1 and {LIMITS.MAX_USERNAME_LENGTH} characters.
            </span>
          </div>

          <button type="submit" className="join-submit-button">
            Join Chat Room
          </button>
        </form>

        <div className="join-footer">
          <p>
            Connected via WebSocket/STOMP. No password required for this room demo.
          </p>
        </div>
      </div>
    </div>
  );
};

