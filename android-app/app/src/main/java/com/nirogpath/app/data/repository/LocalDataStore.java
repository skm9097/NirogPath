package com.nirogpath.app.data.repository;

import android.content.Context;
import android.content.SharedPreferences;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.nirogpath.app.data.model.HealthReading;
import com.nirogpath.app.data.model.Medication;
import com.nirogpath.app.data.model.UserProfile;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

public class LocalDataStore {
    private static LocalDataStore instance;
    private final SharedPreferences prefs;
    private final Gson gson = new Gson();

    private static final String PREF_NAME = "nirogpath_data";
    private static final String KEY_PROFILE = "user_profile";
    private static final String KEY_READINGS = "health_readings";
    private static final String KEY_MEDICATIONS = "medications";
    private static final String KEY_ACCESS_TOKEN = "access_token";
    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_ONBOARDING = "onboarding_complete";

    private LocalDataStore(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public static void init(Context context) {
        instance = new LocalDataStore(context.getApplicationContext());
    }

    public static LocalDataStore getInstance() {
        return instance;
    }

    public void saveProfile(UserProfile profile) {
        prefs.edit().putString(KEY_PROFILE, gson.toJson(profile)).apply();
    }

    public UserProfile getProfile() {
        String json = prefs.getString(KEY_PROFILE, null);
        if (json == null) return new UserProfile();
        return gson.fromJson(json, UserProfile.class);
    }

    public void saveAccessToken(String token, String userId) {
        prefs.edit()
                .putString(KEY_ACCESS_TOKEN, token)
                .putString(KEY_USER_ID, userId)
                .apply();
    }

    public String getAccessToken() {
        return prefs.getString(KEY_ACCESS_TOKEN, null);
    }

    public String getUserId() {
        return prefs.getString(KEY_USER_ID, null);
    }

    public boolean isLoggedIn() {
        return getAccessToken() != null;
    }

    public void setOnboardingComplete(boolean complete) {
        prefs.edit().putBoolean(KEY_ONBOARDING, complete).apply();
    }

    public boolean isOnboardingComplete() {
        return prefs.getBoolean(KEY_ONBOARDING, false);
    }

    public void addReading(HealthReading reading) {
        List<HealthReading> readings = getReadings();
        reading.id = UUID.randomUUID().toString();
        reading.timestamp = System.currentTimeMillis();
        readings.add(0, reading);
        prefs.edit().putString(KEY_READINGS, gson.toJson(readings)).apply();
    }

    public List<HealthReading> getReadings() {
        String json = prefs.getString(KEY_READINGS, null);
        if (json == null) return new ArrayList<>();
        Type type = new TypeToken<List<HealthReading>>(){}.getType();
        return gson.fromJson(json, type);
    }

    public List<HealthReading> getTodaysReadings() {
        List<HealthReading> all = getReadings();
        List<HealthReading> today = new ArrayList<>();
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        long startOfDay = cal.getTimeInMillis();
        for (HealthReading r : all) {
            if (r.timestamp >= startOfDay) today.add(r);
        }
        return today;
    }

    public HealthReading getLatestBpReading() {
        for (HealthReading r : getReadings()) {
            if ("bp".equals(r.type)) return r;
        }
        return null;
    }

    public HealthReading getLatestSugarReading() {
        for (HealthReading r : getReadings()) {
            if ("sugar".equals(r.type)) return r;
        }
        return null;
    }

    public void addMedication(Medication med) {
        List<Medication> meds = getMedications();
        med.id = UUID.randomUUID().toString();
        med.createdAt = System.currentTimeMillis();
        meds.add(med);
        prefs.edit().putString(KEY_MEDICATIONS, gson.toJson(meds)).apply();
    }

    public List<Medication> getMedications() {
        String json = prefs.getString(KEY_MEDICATIONS, null);
        if (json == null) return new ArrayList<>();
        Type type = new TypeToken<List<Medication>>(){}.getType();
        return gson.fromJson(json, type);
    }

    public void markMedicationTaken(String medId) {
        List<Medication> meds = getMedications();
        for (Medication m : meds) {
            if (m.id.equals(medId)) {
                m.takenToday = true;
                break;
            }
        }
        prefs.edit().putString(KEY_MEDICATIONS, gson.toJson(meds)).apply();
    }

    public void logout() {
        prefs.edit().clear().apply();
    }
}
