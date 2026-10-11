package com.syncro.chat.controller;

import com.syncro.chat.config.ChatConstants;
import com.syncro.chat.model.ChatMessageRequest;
import com.syncro.chat.model.ChatMessageResponse;
import com.syncro.chat.model.ErrorMessageResponse;
import com.syncro.chat.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Receives messages sent to /app/chat.send, validates them, and broadcasts
     * the timestamped response to all subscribers of /topic/chat.
     */
    @MessageMapping(ChatConstants.CHAT_SEND_MAPPING)
    @SendTo(ChatConstants.CHAT_TOPIC)
    public ChatMessageResponse handleChatMessage(ChatMessageRequest request) {
        logger.debug("Received chat message from user: {}", request != null ? request.getSender() : "null");
        return chatService.processMessage(request);
    }

    /**
     * Captures validation or illegal argument errors during message processing
     * and broadcasts a feedback error message to /topic/errors.
     */
    @MessageExceptionHandler
    @SendTo(ChatConstants.ERRORS_TOPIC)
    public ErrorMessageResponse handleException(Exception ex) {
        logger.warn("Message processing error: {}", ex.getMessage());
        return new ErrorMessageResponse(ex.getMessage(), Instant.now());
    }
}

