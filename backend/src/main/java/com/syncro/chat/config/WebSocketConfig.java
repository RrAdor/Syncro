package com.syncro.chat.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final String[] allowedOrigins;

    public WebSocketConfig(
            @Value("${app.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000}")
            String allowedOriginsProperty
    ) {
        this.allowedOrigins = Arrays.stream(allowedOriginsProperty.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toArray(String[]::new);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Simple in-memory message broker prefix
        registry.enableSimpleBroker(ChatConstants.BROKER_TOPIC_PREFIX, ChatConstants.USER_PREFIX);
        // Prefix for messages routed to @MessageMapping handlers
        registry.setApplicationDestinationPrefixes(ChatConstants.APP_PREFIX);
        // Prefix for user-specific destinations
        registry.setUserDestinationPrefix(ChatConstants.USER_PREFIX);
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Native WebSocket endpoint
        registry.addEndpoint(ChatConstants.WS_ENDPOINT)
                .setAllowedOriginPatterns(allowedOrigins);

        // Fallback endpoint with SockJS
        registry.addEndpoint(ChatConstants.WS_ENDPOINT + "-sockjs")
                .setAllowedOriginPatterns(allowedOrigins)
                .withSockJS();
    }
}

