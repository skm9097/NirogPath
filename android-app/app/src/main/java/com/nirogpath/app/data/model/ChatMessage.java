package com.nirogpath.app.data.model;

public class ChatMessage {
    public String role; // "user" or "assistant"
    public String content;
    public long timestamp;

    public ChatMessage(String role, String content) {
        this.role = role;
        this.content = content;
        this.timestamp = System.currentTimeMillis();
    }
}
