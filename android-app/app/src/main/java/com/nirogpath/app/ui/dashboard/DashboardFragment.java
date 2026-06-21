package com.nirogpath.app.ui.dashboard;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.nirogpath.app.R;
import com.nirogpath.app.data.model.HealthReading;
import com.nirogpath.app.data.model.Medication;
import com.nirogpath.app.data.model.UserProfile;
import com.nirogpath.app.data.repository.LocalDataStore;
import com.nirogpath.app.ui.ai.AiConsultActivity;
import com.nirogpath.app.ui.health.AddReadingActivity;
import com.nirogpath.app.utils.HealthUtils;

import java.util.List;

public class DashboardFragment extends Fragment {
    private TextView tvGreeting, tvUserName, tvBpValue, tvBpStatus, tvSugarValue, tvSugarStatus;
    private ImageView ivStatusDot;
    private LinearLayout medsContainer, cardAiAssistant, cardCbac;
    private Button btnAddBp, btnAddSugar;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_dashboard, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initViews(view);
        setupClickListeners();
    }

    @Override
    public void onResume() {
        super.onResume();
        loadData();
    }

    private void initViews(View view) {
        tvGreeting = view.findViewById(R.id.tvGreeting);
        tvUserName = view.findViewById(R.id.tvUserName);
        tvBpValue = view.findViewById(R.id.tvBpValue);
        tvBpStatus = view.findViewById(R.id.tvBpStatus);
        tvSugarValue = view.findViewById(R.id.tvSugarValue);
        tvSugarStatus = view.findViewById(R.id.tvSugarStatus);
        ivStatusDot = view.findViewById(R.id.ivStatusDot);
        medsContainer = view.findViewById(R.id.medsContainer);
        cardAiAssistant = view.findViewById(R.id.cardAiAssistant);
        cardCbac = view.findViewById(R.id.cardCbac);
        btnAddBp = view.findViewById(R.id.btnAddBp);
        btnAddSugar = view.findViewById(R.id.btnAddSugar);
    }

    private void setupClickListeners() {
        btnAddBp.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), AddReadingActivity.class);
            intent.putExtra("type", "bp");
            startActivity(intent);
        });

        btnAddSugar.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), AddReadingActivity.class);
            intent.putExtra("type", "sugar");
            startActivity(intent);
        });

        cardAiAssistant.setOnClickListener(v ->
                startActivity(new Intent(requireContext(), AiConsultActivity.class)));
    }

    private void loadData() {
        LocalDataStore store = LocalDataStore.getInstance();
        UserProfile profile = store.getProfile();

        tvGreeting.setText(HealthUtils.getGreeting());
        tvUserName.setText(profile.name != null && !profile.name.isEmpty() ? profile.name : "User");

        // Load latest BP
        HealthReading latestBp = store.getLatestBpReading();
        if (latestBp != null) {
            tvBpValue.setText(latestBp.systolic + "/" + latestBp.diastolic);
            tvBpStatus.setText(HealthReading.getDisplayLabel(latestBp.classification));
            updateStatusDot(latestBp.color);
        } else {
            tvBpValue.setText("--/--");
            tvBpStatus.setText("No reading");
        }

        // Load latest sugar
        HealthReading latestSugar = store.getLatestSugarReading();
        if (latestSugar != null) {
            tvSugarValue.setText(latestSugar.sugarValue + " mg/dL");
            tvSugarStatus.setText(HealthReading.getDisplayLabel(latestSugar.classification));
        } else {
            tvSugarValue.setText("--");
            tvSugarStatus.setText("No reading");
        }

        // Load medications
        loadMedications();
    }

    private void loadMedications() {
        List<Medication> meds = LocalDataStore.getInstance().getMedications();
        medsContainer.removeAllViews();

        if (meds.isEmpty()) {
            TextView noMeds = new TextView(requireContext());
            noMeds.setText("No medications added yet");
            noMeds.setTextColor(getResources().getColor(R.color.text_hint, null));
            noMeds.setTextSize(14);
            noMeds.setPadding(0, 32, 0, 32);
            noMeds.setGravity(android.view.Gravity.CENTER);
            medsContainer.addView(noMeds);
            return;
        }

        for (Medication med : meds) {
            View item = LayoutInflater.from(requireContext()).inflate(R.layout.item_medication, medsContainer, false);
            ((TextView) item.findViewById(R.id.tvMedName)).setText("💊 " + med.name);
            ((TextView) item.findViewById(R.id.tvMedDosage)).setText(med.dosage);
            ((TextView) item.findViewById(R.id.tvMedTime)).setText(med.timeOfDay);

            Button btnTaken = item.findViewById(R.id.btnTaken);
            if (med.takenToday) {
                btnTaken.setText("✓ Taken");
                btnTaken.setEnabled(false);
                btnTaken.setAlpha(0.6f);
            } else {
                btnTaken.setOnClickListener(v -> {
                    LocalDataStore.getInstance().markMedicationTaken(med.id);
                    loadMedications();
                });
            }
            medsContainer.addView(item);
        }
    }

    private void updateStatusDot(String color) {
        if ("red".equals(color)) {
            ivStatusDot.setImageResource(R.drawable.status_dot_red);
        } else if ("yellow".equals(color)) {
            ivStatusDot.setImageResource(R.drawable.status_dot_yellow);
        } else {
            ivStatusDot.setImageResource(R.drawable.status_dot_green);
        }
    }
}
