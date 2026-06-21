package com.nirogpath.app.ui.onboarding;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.nirogpath.app.R;
import com.nirogpath.app.data.model.UserProfile;
import com.nirogpath.app.data.repository.LocalDataStore;
import com.nirogpath.app.ui.dashboard.MainActivity;

import java.util.ArrayList;

public class OnboardingActivity extends AppCompatActivity {
    private int currentStep = 1;
    private static final int TOTAL_STEPS = 2;

    private LinearLayout step1, step2, progressDots;
    private TextView tvStepInfo;
    private EditText etName, etAge, etHeight, etWeight;
    private Spinner spGender;
    private CheckBox cbHypertension, cbDiabetesT2, cbDiabetesT1, cbHeartDisease, cbKidney, cbThyroid;
    private Button btnNext, btnSkip;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_onboarding);

        if (LocalDataStore.getInstance().isOnboardingComplete()) {
            startActivity(new Intent(this, MainActivity.class));
            finish();
            return;
        }

        initViews();
        setupGenderSpinner();
        updateUI();

        btnNext.setOnClickListener(v -> nextStep());
        btnSkip.setOnClickListener(v -> skipToMain());
    }

    private void initViews() {
        step1 = findViewById(R.id.step1);
        step2 = findViewById(R.id.step2);
        progressDots = findViewById(R.id.progressDots);
        tvStepInfo = findViewById(R.id.tvStepInfo);
        etName = findViewById(R.id.etName);
        etAge = findViewById(R.id.etAge);
        etHeight = findViewById(R.id.etHeight);
        etWeight = findViewById(R.id.etWeight);
        spGender = findViewById(R.id.spGender);
        cbHypertension = findViewById(R.id.cbHypertension);
        cbDiabetesT2 = findViewById(R.id.cbDiabetesT2);
        cbDiabetesT1 = findViewById(R.id.cbDiabetesT1);
        cbHeartDisease = findViewById(R.id.cbHeartDisease);
        cbKidney = findViewById(R.id.cbKidney);
        cbThyroid = findViewById(R.id.cbThyroid);
        btnNext = findViewById(R.id.btnNext);
        btnSkip = findViewById(R.id.btnSkip);
    }

    private void setupGenderSpinner() {
        String[] genders = {"Select Gender", "Male", "Female", "Other"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, genders);
        spGender.setAdapter(adapter);
    }

    private void updateUI() {
        progressDots.removeAllViews();
        for (int i = 1; i <= TOTAL_STEPS; i++) {
            View dot = new View(this);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    dpToPx(32), dpToPx(6));
            params.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            dot.setLayoutParams(params);
            dot.setBackgroundResource(i <= currentStep ? R.drawable.rounded_button : R.drawable.rounded_input);
            progressDots.addView(dot);
        }
        tvStepInfo.setText(getString(R.string.step_format, currentStep, TOTAL_STEPS));

        step1.setVisibility(currentStep == 1 ? View.VISIBLE : View.GONE);
        step2.setVisibility(currentStep == 2 ? View.VISIBLE : View.GONE);

        btnNext.setText(currentStep == TOTAL_STEPS ? getString(R.string.finish_setup) : getString(R.string.next));
    }

    private void nextStep() {
        if (currentStep == 1) {
            String name = etName.getText().toString().trim();
            if (name.isEmpty()) {
                Toast.makeText(this, "Please enter your name", Toast.LENGTH_SHORT).show();
                return;
            }
            currentStep = 2;
            updateUI();
        } else {
            saveProfileAndFinish();
        }
    }

    private void saveProfileAndFinish() {
        UserProfile profile = new UserProfile();
        profile.name = etName.getText().toString().trim();
        profile.id = LocalDataStore.getInstance().getUserId();

        try { profile.age = Integer.parseInt(etAge.getText().toString().trim()); } catch (Exception ignored) {}
        try { profile.heightCm = Integer.parseInt(etHeight.getText().toString().trim()); } catch (Exception ignored) {}
        try { profile.weightKg = Float.parseFloat(etWeight.getText().toString().trim()); } catch (Exception ignored) {}

        int genderPos = spGender.getSelectedItemPosition();
        if (genderPos == 1) profile.gender = "male";
        else if (genderPos == 2) profile.gender = "female";
        else if (genderPos == 3) profile.gender = "other";

        profile.conditions = new ArrayList<>();
        if (cbHypertension.isChecked()) profile.conditions.add("hypertension");
        if (cbDiabetesT2.isChecked()) profile.conditions.add("diabetes_type2");
        if (cbDiabetesT1.isChecked()) profile.conditions.add("diabetes_type1");
        if (cbHeartDisease.isChecked()) profile.conditions.add("heart_disease");
        if (cbKidney.isChecked()) profile.conditions.add("kidney_disease");
        if (cbThyroid.isChecked()) profile.conditions.add("thyroid");

        profile.onboardingComplete = true;

        LocalDataStore.getInstance().saveProfile(profile);
        LocalDataStore.getInstance().setOnboardingComplete(true);

        Toast.makeText(this, "Setup complete! Welcome to NirogPath", Toast.LENGTH_LONG).show();
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }

    private void skipToMain() {
        UserProfile profile = new UserProfile();
        profile.name = etName.getText().toString().trim();
        if (profile.name.isEmpty()) profile.name = "User";
        profile.onboardingComplete = true;
        LocalDataStore.getInstance().saveProfile(profile);
        LocalDataStore.getInstance().setOnboardingComplete(true);
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }

    private int dpToPx(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density);
    }
}
