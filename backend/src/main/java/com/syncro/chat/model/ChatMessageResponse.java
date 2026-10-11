package com.syncro.chat.model;

import java.time.Instant;

public class ChatMessageResponse {

    private String sender;
    private String content;
    private Instant timestamp;

    public ChatMessageResponse() {
    }

    public ChatMessageResponse(String sender, String content, Instant timestamp) {
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}

