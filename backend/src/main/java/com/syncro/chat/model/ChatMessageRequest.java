package com.syncro.chat.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChatMessageRequest {

    @NotBlank(message = "Sender name cannot be empty")
    @Size(min = 1, max = 24, message = "Sender name must be between 1 and 24 characters")
    private String sender;

    @NotBlank(message = "Message content cannot be empty")
    @Size(min = 1, max = 1000, message = "Message content must be between 1 and 1000 characters")
    private String content;

    public ChatMessageRequest() {
    }

    public ChatMessageRequest(String sender, String content) {
        this.sender = sender;
        this.content = content;
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
}

