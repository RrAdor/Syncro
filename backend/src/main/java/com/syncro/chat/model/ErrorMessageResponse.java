package com.syncro.chat.model;

import java.time.Instant;

public class ErrorMessageResponse {

    private String error;
    private Instant timestamp;

    public ErrorMessageResponse() {
    }

    public ErrorMessageResponse(String error, Instant timestamp) {
        this.error = error;
        this.timestamp = timestamp;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}

