import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageInput } from './MessageInput';

describe('MessageInput component', () => {
  it('renders textarea and submit button', () => {
    render(<MessageInput onSendMessage={() => true} />);
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('submits trimmed message and clears input on success', () => {
    const handleSend = vi.fn().mockReturnValue(true);
    render(<MessageInput onSendMessage={handleSend} />);

    const textarea = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(textarea, { target: { value: '  Hello Syncro!  ' } });

    const submitBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitBtn);

    expect(handleSend).toHaveBeenCalledWith('Hello Syncro!');
    expect(textarea).toHaveValue('');
  });

  it('submits on Enter key and prevents default', () => {
    const handleSend = vi.fn().mockReturnValue(true);
    render(<MessageInput onSendMessage={handleSend} />);

    const textarea = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(textarea, { target: { value: 'Keyboard submit' } });

    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    expect(handleSend).toHaveBeenCalledWith('Keyboard submit');
    expect(textarea).toHaveValue('');
  });

  it('allows newline on Shift+Enter without sending', () => {
    const handleSend = vi.fn().mockReturnValue(true);
    render(<MessageInput onSendMessage={handleSend} />);

    const textarea = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(textarea, { target: { value: 'Line 1' } });

    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('shows error and blocks send when message is empty or whitespace only', () => {
    const handleSend = vi.fn();
    render(<MessageInput onSendMessage={handleSend} />);

    const textarea = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(textarea, { target: { value: '   ' } });

    // Send button should be disabled for empty/whitespace
    const submitBtn = screen.getByRole('button', { name: /send message/i });
    expect(submitBtn).toBeDisabled();

    // Trigger form submit directly
    fireEvent.submit(textarea.closest('form')!);

    expect(handleSend).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/please enter a message/i);
  });

  it('disables textarea and button when disabled prop is true', () => {
    render(<MessageInput onSendMessage={() => true} disabled={true} />);
    expect(screen.getByPlaceholderText(/connecting to chat server/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });
});

