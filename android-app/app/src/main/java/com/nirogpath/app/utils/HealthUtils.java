package com.nirogpath.app.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class HealthUtils {

    public static String getGreeting() {
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        if (hour < 12) return "Good Morning ☀️";
        if (hour < 17) return "Good Afternoon 🌤️";
        return "Good Evening 🌙";
    }

    public static String getGreetingHindi() {
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        if (hour < 12) return "सुप्रभात";
        if (hour < 17) return "नमस्कार";
        return "शुभ संध्या";
    }

    public static String formatDate(long timestamp) {
        return new SimpleDateFormat("dd MMM yyyy", Locale.getDefault()).format(new Date(timestamp));
    }

    public static String formatTime(long timestamp) {
        return new SimpleDateFormat("hh:mm a", Locale.getDefault()).format(new Date(timestamp));
    }

    public static String formatDateTime(long timestamp) {
        return new SimpleDateFormat("dd MMM, hh:mm a", Locale.getDefault()).format(new Date(timestamp));
    }

    public static float calculateBMI(int heightCm, float weightKg) {
        if (heightCm <= 0 || weightKg <= 0) return 0;
        float heightM = heightCm / 100f;
        return weightKg / (heightM * heightM);
    }

    public static String getBMICategory(float bmi) {
        if (bmi <= 0) return "Unknown";
        if (bmi < 18.5f) return "Underweight";
        if (bmi < 25f) return "Normal";
        if (bmi < 30f) return "Overweight";
        return "Obese";
    }

    public static int[] getCbacQuestionScores() {
        return new int[]{
            1, // age 30-39
            2, // age 40-49
            3, // age >= 50
            2, // waist male > 90cm
            2, // waist female > 80cm
            2, // physical activity < 150 min/week
            2, // family history of diabetes/CVD
            2, // smoking/tobacco
        };
    }

    public static String getCbacRiskLevel(int score) {
        if (score >= 4) return "high";
        if (score >= 2) return "moderate";
        return "low";
    }
}
