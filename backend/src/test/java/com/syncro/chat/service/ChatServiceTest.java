package com.syncro.chat.service;

import com.syncro.chat.config.ChatConstants;
import com.syncro.chat.model.ChatMessageRequest;
import com.syncro.chat.model.ChatMessageResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class ChatServiceTest {

    private ChatService chatService;

    @BeforeEach
    void setUp() {
        chatService = new ChatService();
    }

    @Test
    @DisplayName("Successfully processes a valid message and assigns a timestamp")
    void testProcessValidMessage() {
        ChatMessageRequest request = new ChatMessageRequest("Alice", "Hello World!");
        Instant before = Instant.now().minusSeconds(1);

        ChatMessageResponse response = chatService.processMessage(request);

        assertNotNull(response);
        assertEquals("Alice", response.getSender());
        assertEquals("Hello World!", response.getContent());
        assertNotNull(response.getTimestamp());
        assertTrue(response.getTimestamp().isAfter(before) || response.getTimestamp().equals(before));
    }

    @Test
    @DisplayName("Normalizes and trims whitespace from sender and content")
    void testTrimsSenderAndContent() {
        ChatMessageRequest request = new ChatMessageRequest("   Bob   ", "   Trimmed message   ");

        ChatMessageResponse response = chatService.processMessage(request);

        assertEquals("Bob", response.getSender());
        assertEquals("Trimmed message", response.getContent());
    }

    @Test
    @DisplayName("Throws exception when request is null")
    void testNullRequest() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                chatService.processMessage(null)
        );
        assertTrue(ex.getMessage().contains("null"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   ", "\t", "\n"})
    @DisplayName("Throws exception when sender is blank")
    void testBlankSender(String blankSender) {
        ChatMessageRequest request = new ChatMessageRequest(blankSender, "Valid content");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                chatService.processMessage(request)
        );
        assertTrue(ex.getMessage().contains("Username"));
    }

    @Test
    @DisplayName("Throws exception when sender is null")
    void testNullSender() {
        ChatMessageRequest request = new ChatMessageRequest(null, "Valid content");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                chatService.processMessage(request)
        );
        assertTrue(ex.getMessage().contains("Username"));
    }

    @Test
    @DisplayName("Throws exception when sender exceeds max length")
    void testOversizedSender() {
        String longSender = "a".repeat(ChatConstants.MAX_SENDER_LENGTH + 1);
        ChatMessageRequest request = new ChatMessageRequest(longSender, "Valid content");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                chatService.processMessage(request)
        );
        assertTrue(ex.getMessage().contains("maximum length"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   ", "\t", "\n"})
    @DisplayName("Throws exception when content is blank")
    void testBlankContent(String blankContent) {
        ChatMessageRequest request = new ChatMessageRequest("Alice", blankContent);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                chatService.processMessage(request)
        );
        assertTrue(ex.getMessage().contains("Message content"));
    }

    @Test
    @DisplayName("Throws exception when content is null")
    void testNullContent() {
        ChatMessageRequest request = new ChatMessageRequest("Alice", null);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                chatService.processMessage(request)
        );
        assertTrue(ex.getMessage().contains("Message content"));
    }

    @Test
    @DisplayName("Throws exception when content exceeds max length")
    void testOversizedContent() {
        String longContent = "x".repeat(ChatConstants.MAX_CONTENT_LENGTH + 1);
        ChatMessageRequest request = new ChatMessageRequest("Alice", longContent);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                chatService.processMessage(request)
        );
        assertTrue(ex.getMessage().contains("maximum length"));
    }
}
