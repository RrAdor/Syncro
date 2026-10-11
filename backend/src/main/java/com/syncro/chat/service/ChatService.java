package com.syncro.chat.service;

import com.syncro.chat.config.ChatConstants;
import com.syncro.chat.model.ChatMessageRequest;
import com.syncro.chat.model.ChatMessageResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class ChatService {

    /**
     * Validates, normalizes, and packages an incoming chat message request
     * into a broadcast-ready response with a server-assigned timestamp.
     *
     * @param request the incoming request payload
     * @return the normalized and timestamped response
     * @throws IllegalArgumentException if the sender or content fails validation
     */
    public ChatMessageResponse processMessage(ChatMessageRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Message payload cannot be null");
        }

        String sender = normalizeSender(request.getSender());
        String content = normalizeContent(request.getContent());

        return new ChatMessageResponse(sender, content, Instant.now());
    }

    public String normalizeSender(String sender) {
        if (sender == null || sender.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required and cannot be empty");
        }
        String trimmed = sender.trim();
        if (trimmed.length() > ChatConstants.MAX_SENDER_LENGTH) {
            throw new IllegalArgumentException(
                    "Username exceeds maximum length of " + ChatConstants.MAX_SENDER_LENGTH + " characters"
            );
        }
        return trimmed;
    }

    public String normalizeContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be blank");
        }
        String trimmed = content.trim();
        if (trimmed.length() > ChatConstants.MAX_CONTENT_LENGTH) {
            throw new IllegalArgumentException(
                    "Message content exceeds maximum length of " + ChatConstants.MAX_CONTENT_LENGTH + " characters"
            );
        }
        return trimmed;
    }
}

