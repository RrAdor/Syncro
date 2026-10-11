package com.syncro.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.syncro.chat.config.ChatConstants;
import com.syncro.chat.model.ChatMessageRequest;
import com.syncro.chat.model.ChatMessageResponse;
import com.syncro.chat.model.ErrorMessageResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class WebSocketIntegrationTest {

    @LocalServerPort
    private int port;

    private WebSocketStompClient createStompClient() {
        WebSocketStompClient client = new WebSocketStompClient(new StandardWebSocketClient());
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setObjectMapper(objectMapper);
        client.setMessageConverter(converter);
        return client;
    }

    @Test
    @DisplayName("Single client sends message and receives broadcast on /topic/chat")
    void testSingleClientBroadcast() throws Exception {
        WebSocketStompClient stompClient = createStompClient();
        String url = "ws://localhost:" + port + ChatConstants.WS_ENDPOINT;
        CompletableFuture<ChatMessageResponse> resultFuture = new CompletableFuture<>();

        StompSessionHandler sessionHandler = new StompSessionHandlerAdapter() {
            @Override
            public void handleTransportError(StompSession session, Throwable exception) {
                resultFuture.completeExceptionally(exception);
            }
        };

        StompSession session = stompClient.connectAsync(url, sessionHandler).get(5, TimeUnit.SECONDS);
        assertTrue(session.isConnected(), "STOMP session should be connected");

        session.subscribe(ChatConstants.CHAT_TOPIC, new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return ChatMessageResponse.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                resultFuture.complete((ChatMessageResponse) payload);
            }
        });

        Thread.sleep(200);

        ChatMessageRequest request = new ChatMessageRequest("Rabby", "Hello from integration test!");
        session.send(ChatConstants.APP_PREFIX + ChatConstants.CHAT_SEND_MAPPING, request);

        ChatMessageResponse response = resultFuture.get(5, TimeUnit.SECONDS);

        assertNotNull(response);
        assertEquals("Rabby", response.getSender());
        assertEquals("Hello from integration test!", response.getContent());
        assertNotNull(response.getTimestamp());

        session.disconnect();
    }

    @Test
    @DisplayName("Two distinct client sessions exchange messages in real-time")
    void testTwoClientsLiveMessageExchange() throws Exception {
        String url = "ws://localhost:" + port + ChatConstants.WS_ENDPOINT;

        WebSocketStompClient clientAlice = createStompClient();
        WebSocketStompClient clientBob = createStompClient();

        StompSession sessionAlice = clientAlice.connectAsync(url, new StompSessionHandlerAdapter() {})
                .get(5, TimeUnit.SECONDS);
        StompSession sessionBob = clientBob.connectAsync(url, new StompSessionHandlerAdapter() {})
                .get(5, TimeUnit.SECONDS);

        assertTrue(sessionAlice.isConnected());
        assertTrue(sessionBob.isConnected());

        BlockingQueue<ChatMessageResponse> aliceInbox = new LinkedBlockingQueue<>();
        BlockingQueue<ChatMessageResponse> bobInbox = new LinkedBlockingQueue<>();

        sessionAlice.subscribe(ChatConstants.CHAT_TOPIC, new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return ChatMessageResponse.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                aliceInbox.offer((ChatMessageResponse) payload);
            }
        });

        sessionBob.subscribe(ChatConstants.CHAT_TOPIC, new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return ChatMessageResponse.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                bobInbox.offer((ChatMessageResponse) payload);
            }
        });

        Thread.sleep(200);

        // 1. Alice sends message
        sessionAlice.send(
                ChatConstants.APP_PREFIX + ChatConstants.CHAT_SEND_MAPPING,
                new ChatMessageRequest("Alice", "Hi Bob! How are you?")
        );

        // Both Alice and Bob should receive the broadcast
        ChatMessageResponse msgForBob = bobInbox.poll(5, TimeUnit.SECONDS);
        assertNotNull(msgForBob, "Bob should receive Alice's message");
        assertEquals("Alice", msgForBob.getSender());
        assertEquals("Hi Bob! How are you?", msgForBob.getContent());

        ChatMessageResponse msgForAlice = aliceInbox.poll(5, TimeUnit.SECONDS);
        assertNotNull(msgForAlice, "Alice should receive her own broadcast");
        assertEquals("Alice", msgForAlice.getSender());

        // 2. Bob replies
        sessionBob.send(
                ChatConstants.APP_PREFIX + ChatConstants.CHAT_SEND_MAPPING,
                new ChatMessageRequest("Bob", "Hey Alice! Real-time chat works great.")
        );

        ChatMessageResponse replyForAlice = aliceInbox.poll(5, TimeUnit.SECONDS);
        assertNotNull(replyForAlice, "Alice should receive Bob's reply");
        assertEquals("Bob", replyForAlice.getSender());
        assertEquals("Hey Alice! Real-time chat works great.", replyForAlice.getContent());

        sessionAlice.disconnect();
        sessionBob.disconnect();
    }

    @Test
    @DisplayName("Sends invalid blank message: error sent to /topic/errors and NOT to /topic/chat")
    void testBlankMessageRejection() throws Exception {
        String url = "ws://localhost:" + port + ChatConstants.WS_ENDPOINT;
        WebSocketStompClient stompClient = createStompClient();

        CompletableFuture<ErrorMessageResponse> errorFuture = new CompletableFuture<>();
        BlockingQueue<ChatMessageResponse> chatQueue = new LinkedBlockingQueue<>();

        StompSession session = stompClient.connectAsync(url, new StompSessionHandlerAdapter() {})
                .get(5, TimeUnit.SECONDS);

        session.subscribe(ChatConstants.ERRORS_TOPIC, new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return ErrorMessageResponse.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                errorFuture.complete((ErrorMessageResponse) payload);
            }
        });

        session.subscribe(ChatConstants.CHAT_TOPIC, new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return ChatMessageResponse.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                chatQueue.offer((ChatMessageResponse) payload);
            }
        });

        Thread.sleep(200);

        // Publish invalid message with blank content
        session.send(
                ChatConstants.APP_PREFIX + ChatConstants.CHAT_SEND_MAPPING,
                new ChatMessageRequest("Rabby", "   ")
        );

        // Verify error was received
        ErrorMessageResponse errorResponse = errorFuture.get(5, TimeUnit.SECONDS);
        assertNotNull(errorResponse);
        assertTrue(errorResponse.getError().contains("Message content"));

        // Verify nothing was broadcast to /topic/chat
        ChatMessageResponse unbroadcast = chatQueue.poll(500, TimeUnit.MILLISECONDS);
        assertNull(unbroadcast, "Blank message must not be broadcast to /topic/chat");

        session.disconnect();
    }
}

