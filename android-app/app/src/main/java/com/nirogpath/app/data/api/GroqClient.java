package com.nirogpath.app.data.api;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class GroqClient {
    private static final String BASE_URL = "https://api.groq.com/openai/v1";
    private static final String MODEL = "llama-3.3-70b-versatile";
    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

    private static GroqClient instance;
    private final String apiKey;
    private final OkHttpClient client;

    public static final String HEALTH_SYSTEM_PROMPT =
            "You are NirogPath AI, a health assistant for Indian patients managing hypertension and diabetes. " +
            "Follow WHO PEN protocol and Indian HTN Guidelines 2023. " +
            "Provide advice in simple language that patients can understand. " +
            "Always recommend consulting a doctor for serious concerns. " +
            "You can respond in both Hindi and English. " +
            "Focus on: medication adherence, lifestyle changes (diet, exercise, stress), " +
            "understanding readings, when to seek emergency care. " +
            "Never diagnose or prescribe medications. Keep responses concise and actionable.";

    public static final String RISK_ASSESSMENT_PROMPT =
            "You are NirogPath AI. Analyze the patient's health data and provide a risk assessment. " +
            "Consider BP trends, sugar levels, medication adherence, BMI, age, and conditions. " +
            "Classify risk as LOW, MODERATE, or HIGH. Provide specific recommendations. " +
            "Return JSON: {\"risk_level\": \"...\", \"risk_score\": 0-100, \"factors\": [...], \"recommendations\": [...]}";

    private GroqClient(String apiKey) {
        this.apiKey = apiKey;
        this.client = new OkHttpClient.Builder()
                .connectTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .build();
    }

    public static void init(String apiKey) {
        instance = new GroqClient(apiKey);
    }

    public static GroqClient getInstance() {
        return instance;
    }

    public String chat(String systemPrompt, String userMessage) throws IOException {
        JsonObject body = new JsonObject();
        body.addProperty("model", MODEL);
        body.addProperty("temperature", 0.7);
        body.addProperty("max_tokens", 1024);

        JsonArray messages = new JsonArray();

        JsonObject systemMsg = new JsonObject();
        systemMsg.addProperty("role", "system");
        systemMsg.addProperty("content", systemPrompt);
        messages.add(systemMsg);

        JsonObject userMsg = new JsonObject();
        userMsg.addProperty("role", "user");
        userMsg.addProperty("content", userMessage);
        messages.add(userMsg);

        body.add("messages", messages);

        Request request = new Request.Builder()
                .url(BASE_URL + "/chat/completions")
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(body.toString(), JSON))
                .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";
            if (!response.isSuccessful()) {
                throw new IOException("Groq API error: " + response.code() + " - " + responseBody);
            }
            JsonObject result = JsonParser.parseString(responseBody).getAsJsonObject();
            return result.getAsJsonArray("choices")
                    .get(0).getAsJsonObject()
                    .getAsJsonObject("message")
                    .get("content").getAsString();
        }
    }
}
