package com.nirogpath.app.data.api;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class SupabaseClient {
    private static SupabaseClient instance;
    private final String baseUrl;
    private final String anonKey;
    private String accessToken;
    private final OkHttpClient client;
    private final Gson gson = new Gson();
    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

    private SupabaseClient(String url, String key) {
        this.baseUrl = url;
        this.anonKey = key;
        this.client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .build();
    }

    public static void init(String url, String key) {
        instance = new SupabaseClient(url, key);
    }

    public static SupabaseClient getInstance() {
        return instance;
    }

    public void setAccessToken(String token) {
        this.accessToken = token;
    }

    private Request.Builder baseRequest(String path) {
        Request.Builder builder = new Request.Builder()
                .addHeader("apikey", anonKey)
                .addHeader("Content-Type", "application/json");
        if (accessToken != null) {
            builder.addHeader("Authorization", "Bearer " + accessToken);
        }
        return builder;
    }

    public JsonObject signInWithOtp(String phone) throws IOException {
        JsonObject body = new JsonObject();
        body.addProperty("phone", phone);
        Request request = baseRequest("/auth/v1/otp")
                .url(baseUrl + "/auth/v1/otp")
                .post(RequestBody.create(body.toString(), JSON))
                .build();
        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "{}";
            return JsonParser.parseString(responseBody).getAsJsonObject();
        }
    }

    public JsonObject verifyOtp(String phone, String token) throws IOException {
        JsonObject body = new JsonObject();
        body.addProperty("phone", phone);
        body.addProperty("token", token);
        body.addProperty("type", "sms");
        Request request = baseRequest("/auth/v1/verify")
                .url(baseUrl + "/auth/v1/verify")
                .post(RequestBody.create(body.toString(), JSON))
                .build();
        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "{}";
            JsonObject result = JsonParser.parseString(responseBody).getAsJsonObject();
            if (result.has("access_token")) {
                setAccessToken(result.get("access_token").getAsString());
            }
            return result;
        }
    }

    public JsonArray query(String table, String select, String filter) throws IOException {
        String url = baseUrl + "/rest/v1/" + table + "?select=" + select;
        if (filter != null && !filter.isEmpty()) {
            url += "&" + filter;
        }
        Request request = baseRequest(url)
                .url(url)
                .get()
                .build();
        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "[]";
            JsonElement element = JsonParser.parseString(responseBody);
            if (element.isJsonArray()) return element.getAsJsonArray();
            JsonArray arr = new JsonArray();
            arr.add(element);
            return arr;
        }
    }

    public JsonObject insert(String table, JsonObject data) throws IOException {
        Request request = baseRequest("/rest/v1/" + table)
                .url(baseUrl + "/rest/v1/" + table)
                .addHeader("Prefer", "return=representation")
                .post(RequestBody.create(data.toString(), JSON))
                .build();
        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "{}";
            JsonElement element = JsonParser.parseString(responseBody);
            if (element.isJsonArray() && element.getAsJsonArray().size() > 0) {
                return element.getAsJsonArray().get(0).getAsJsonObject();
            }
            return element.isJsonObject() ? element.getAsJsonObject() : new JsonObject();
        }
    }

    public JsonObject update(String table, JsonObject data, String filter) throws IOException {
        String url = baseUrl + "/rest/v1/" + table + "?" + filter;
        Request request = baseRequest(url)
                .url(url)
                .addHeader("Prefer", "return=representation")
                .patch(RequestBody.create(data.toString(), JSON))
                .build();
        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "{}";
            JsonElement element = JsonParser.parseString(responseBody);
            if (element.isJsonArray() && element.getAsJsonArray().size() > 0) {
                return element.getAsJsonArray().get(0).getAsJsonObject();
            }
            return element.isJsonObject() ? element.getAsJsonObject() : new JsonObject();
        }
    }
}
