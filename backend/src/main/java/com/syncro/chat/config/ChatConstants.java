package com.syncro.chat.config;

/**
 * Centralized constants for WebSocket destinations, topics, and limits.
 */
public final class ChatConstants {

    private ChatConstants() {
        // Prevent instantiation
    }

    public static final String WS_ENDPOINT = "/ws";
    public static final String APP_PREFIX = "/app";
    public static final String BROKER_TOPIC_PREFIX = "/topic";
    public static final String USER_PREFIX = "/user";

    public static final String CHAT_SEND_MAPPING = "/chat.send";
    public static final String CHAT_TOPIC = "/topic/chat";
    public static final String ERRORS_TOPIC = "/topic/errors";
    public static final String USER_QUEUE_ERRORS = "/queue/errors";

    public static final int MAX_SENDER_LENGTH = 24;
    public static final int MAX_CONTENT_LENGTH = 1000;
}

