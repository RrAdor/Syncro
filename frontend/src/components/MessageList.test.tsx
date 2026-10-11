import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageList } from './MessageList';
import { ChatMessage } from '../types/chat';

describe('MessageList component', () => {
  it('renders welcome empty state when no messages are provided', () => {
    render(<MessageList messages={[]} currentUsername="Alice" />);
    expect(screen.getByText(/welcome to the room/i)).toBeInTheDocument();
    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
  });

  it('renders message sender, content, and marks own message as You', () => {
    const messages: ChatMessage[] = [
      {
        sender: 'Alice',
        content: 'Hello everyone!',
        timestamp: '2026-10-12T10:30:00Z',
      },
      {
        sender: 'Bob',
        content: 'Hi Alice, nice to meet you.',
        timestamp: '2026-10-12T10:31:00Z',
      },
    ];

    render(<MessageList messages={messages} currentUsername="Alice" />);

    // Alice is current user, so displayed as "You"
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Hello everyone!')).toBeInTheDocument();

    // Bob is another user
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Hi Alice, nice to meet you.')).toBeInTheDocument();
  });

  it('safely renders user input without HTML injection', () => {
    const maliciousPayload = '<script>alert("xss")</script><img src="x" onerror="alert(1)">';
    const messages: ChatMessage[] = [
      {
        sender: 'Attacker',
        content: maliciousPayload,
        timestamp: '2026-10-12T10:35:00Z',
      },
    ];

    const { container } = render(
      <MessageList messages={messages} currentUsername="Alice" />
    );

    // Ensure raw text exists in DOM, but no script or img elements were created
    expect(screen.getByText(maliciousPayload)).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });
});

