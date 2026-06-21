package com.nirogpath.app.data.model;

import java.util.ArrayList;
import java.util.List;

public class UserProfile {
    public String id;
    public String phone;
    public String name;
    public int age;
    public String gender;
    public int heightCm;
    public float weightKg;
    public List<String> conditions = new ArrayList<>();
    public boolean onboardingComplete;
    public String language = "en";

    public float getBmi() {
        if (heightCm <= 0 || weightKg <= 0) return 0;
        float heightM = heightCm / 100f;
        return weightKg / (heightM * heightM);
    }

    public String getBmiCategory() {
        float bmi = getBmi();
        if (bmi <= 0) return "Unknown";
        if (bmi < 18.5f) return "Underweight";
        if (bmi < 25f) return "Normal";
        if (bmi < 30f) return "Overweight";
        return "Obese";
    }
}
