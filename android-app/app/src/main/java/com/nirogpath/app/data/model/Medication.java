package com.nirogpath.app.data.model;

public class Medication {
    public String id;
    public String userId;
    public String name;
    public String dosage;
    public String frequency; // "daily", "twice_daily", "weekly"
    public String timeOfDay; // "morning", "afternoon", "evening", "night"
    public boolean active;
    public boolean takenToday;
    public long createdAt;

    public Medication() {}

    public Medication(String name, String dosage, String timeOfDay) {
        this.name = name;
        this.dosage = dosage;
        this.timeOfDay = timeOfDay;
        this.frequency = "daily";
        this.active = true;
        this.takenToday = false;
    }
}
