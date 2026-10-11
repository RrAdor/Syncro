import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionStatus } from './ConnectionStatus';

describe('ConnectionStatus component', () => {
  it('renders Connected state with appropriate label', () => {
    render(<ConnectionStatus status="CONNECTED" />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /reconnect/i })).not.toBeInTheDocument();
  });

  it('renders Connecting... state', () => {
    render(<ConnectionStatus status="CONNECTING" />);
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('renders Disconnected state with Reconnect button', () => {
    const handleReconnect = vi.fn();
    render(<ConnectionStatus status="DISCONNECTED" onReconnect={handleReconnect} />);
    
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /reconnect/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleReconnect).toHaveBeenCalledTimes(1);
  });

  it('renders Connection Error state with Reconnect button', () => {
    const handleReconnect = vi.fn();
    render(<ConnectionStatus status="ERROR" onReconnect={handleReconnect} />);
    
    expect(screen.getByText('Connection Error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reconnect/i })).toBeInTheDocument();
  });
});

