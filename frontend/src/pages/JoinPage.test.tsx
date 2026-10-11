import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JoinPage } from './JoinPage';

describe('JoinPage component', () => {
  it('renders title, input, and join button', () => {
    render(<JoinPage onJoin={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /syncro/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your display name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join chat room/i })).toBeInTheDocument();
  });

  it('shows error banner when submitting empty username', () => {
    const handleJoin = vi.fn();
    render(<JoinPage onJoin={handleJoin} />);

    const button = screen.getByRole('button', { name: /join chat room/i });
    fireEvent.click(button);

    expect(handleJoin).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/please enter a display name/i);
  });

  it('submits trimmed username when valid', () => {
    const handleJoin = vi.fn();
    render(<JoinPage onJoin={handleJoin} />);

    const input = screen.getByLabelText(/your display name/i);
    fireEvent.change(input, { target: { value: '  Jordan Lee  ' } });

    const button = screen.getByRole('button', { name: /join chat room/i });
    fireEvent.click(button);

    expect(handleJoin).toHaveBeenCalledWith('Jordan Lee');
  });
});

