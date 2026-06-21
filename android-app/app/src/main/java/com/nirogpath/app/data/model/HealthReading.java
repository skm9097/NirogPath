package com.nirogpath.app.data.model;

public class HealthReading {
    public String id;
    public String userId;
    public String type; // "bp" or "sugar"
    public int systolic;
    public int diastolic;
    public int pulse;
    public int sugarValue;
    public String sugarType; // "fasting", "pp", "random", "hba1c"
    public String classification; // "normal", "elevated", "high", "crisis"
    public String color; // "green", "yellow", "red"
    public String notes;
    public long timestamp;

    public static String classifyBP(int systolic, int diastolic) {
        if (systolic >= 180 || diastolic >= 120) return "crisis";
        if (systolic >= 140 || diastolic >= 90) return "high";
        if (systolic >= 130 || diastolic >= 80) return "elevated";
        return "normal";
    }

    public static String classifySugar(int value, String type) {
        switch (type) {
            case "fasting":
                if (value >= 200) return "crisis";
                if (value >= 126) return "high";
                if (value >= 100) return "elevated";
                return "normal";
            case "pp":
                if (value >= 300) return "crisis";
                if (value >= 200) return "high";
                if (value >= 140) return "elevated";
                return "normal";
            default:
                if (value >= 300) return "crisis";
                if (value >= 200) return "high";
                if (value >= 140) return "elevated";
                return "normal";
        }
    }

    public static String getColor(String classification) {
        switch (classification) {
            case "crisis": return "red";
            case "high": return "red";
            case "elevated": return "yellow";
            default: return "green";
        }
    }

    public static String getDisplayLabel(String classification) {
        switch (classification) {
            case "crisis": return "🔴 Crisis - Seek immediate care";
            case "high": return "🟠 High - Consult doctor";
            case "elevated": return "🟡 Elevated - Monitor closely";
            default: return "🟢 Normal";
        }
    }
}
