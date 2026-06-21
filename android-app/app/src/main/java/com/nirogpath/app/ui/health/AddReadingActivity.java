package com.nirogpath.app.ui.health;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.nirogpath.app.R;
import com.nirogpath.app.data.model.HealthReading;
import com.nirogpath.app.data.repository.LocalDataStore;

public class AddReadingActivity extends AppCompatActivity {
    private boolean isBpMode = true;
    private EditText etSystolic, etDiastolic, etPulse, etSugarValue, etNotes;
    private Button btnBpTab, btnSugarTab, btnSave;
    private LinearLayout bpFields, sugarFields, classificationCard;
    private RadioGroup rgSugarType;
    private TextView tvTitle, tvClassification, tvClassificationDesc;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_reading);

        initViews();

        String type = getIntent().getStringExtra("type");
        if ("sugar".equals(type)) {
            isBpMode = false;
            showSugarMode();
        }

        setupListeners();
    }

    private void initViews() {
        etSystolic = findViewById(R.id.etSystolic);
        etDiastolic = findViewById(R.id.etDiastolic);
        etPulse = findViewById(R.id.etPulse);
        etSugarValue = findViewById(R.id.etSugarValue);
        etNotes = findViewById(R.id.etNotes);
        btnBpTab = findViewById(R.id.btnBpTab);
        btnSugarTab = findViewById(R.id.btnSugarTab);
        btnSave = findViewById(R.id.btnSave);
        bpFields = findViewById(R.id.bpFields);
        sugarFields = findViewById(R.id.sugarFields);
        classificationCard = findViewById(R.id.classificationCard);
        rgSugarType = findViewById(R.id.rgSugarType);
        tvTitle = findViewById(R.id.tvTitle);
        tvClassification = findViewById(R.id.tvClassification);
        tvClassificationDesc = findViewById(R.id.tvClassificationDesc);

        findViewById(R.id.btnBack).setOnClickListener(v -> finish());
    }

    private void setupListeners() {
        btnBpTab.setOnClickListener(v -> {
            isBpMode = true;
            showBpMode();
        });
        btnSugarTab.setOnClickListener(v -> {
            isBpMode = false;
            showSugarMode();
        });

        TextWatcher classificationWatcher = new TextWatcher() {
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            public void onTextChanged(CharSequence s, int start, int before, int count) {}
            public void afterTextChanged(Editable s) { updateClassification(); }
        };
        etSystolic.addTextChangedListener(classificationWatcher);
        etDiastolic.addTextChangedListener(classificationWatcher);
        etSugarValue.addTextChangedListener(classificationWatcher);

        btnSave.setOnClickListener(v -> saveReading());
    }

    private void showBpMode() {
        bpFields.setVisibility(View.VISIBLE);
        sugarFields.setVisibility(View.GONE);
        btnBpTab.setBackgroundResource(R.drawable.rounded_button);
        btnBpTab.setTextColor(getResources().getColor(R.color.white, null));
        btnSugarTab.setBackgroundColor(0);
        btnSugarTab.setTextColor(getResources().getColor(R.color.text_secondary, null));
        tvTitle.setText(R.string.record_bp);
        classificationCard.setVisibility(View.GONE);
    }

    private void showSugarMode() {
        bpFields.setVisibility(View.GONE);
        sugarFields.setVisibility(View.VISIBLE);
        btnSugarTab.setBackgroundResource(R.drawable.rounded_button);
        btnSugarTab.setTextColor(getResources().getColor(R.color.white, null));
        btnBpTab.setBackgroundColor(0);
        btnBpTab.setTextColor(getResources().getColor(R.color.text_secondary, null));
        tvTitle.setText(R.string.record_sugar);
        classificationCard.setVisibility(View.GONE);
    }

    private void updateClassification() {
        if (isBpMode) {
            try {
                int sys = Integer.parseInt(etSystolic.getText().toString());
                int dia = Integer.parseInt(etDiastolic.getText().toString());
                if (sys > 0 && dia > 0) {
                    String cls = HealthReading.classifyBP(sys, dia);
                    classificationCard.setVisibility(View.VISIBLE);
                    tvClassification.setText(HealthReading.getDisplayLabel(cls));
                    tvClassificationDesc.setText(getClassificationAdvice(cls, true));
                }
            } catch (NumberFormatException ignored) {
                classificationCard.setVisibility(View.GONE);
            }
        } else {
            try {
                int val = Integer.parseInt(etSugarValue.getText().toString());
                if (val > 0) {
                    String sugarType = getSugarType();
                    String cls = HealthReading.classifySugar(val, sugarType);
                    classificationCard.setVisibility(View.VISIBLE);
                    tvClassification.setText(HealthReading.getDisplayLabel(cls));
                    tvClassificationDesc.setText(getClassificationAdvice(cls, false));
                }
            } catch (NumberFormatException ignored) {
                classificationCard.setVisibility(View.GONE);
            }
        }
    }

    private String getSugarType() {
        int id = rgSugarType.getCheckedRadioButtonId();
        if (id == R.id.rbPostMeal) return "pp";
        if (id == R.id.rbRandom) return "random";
        return "fasting";
    }

    private String getClassificationAdvice(String cls, boolean isBp) {
        switch (cls) {
            case "crisis": return isBp ? "Seek immediate medical attention!" : "Dangerously high. Visit hospital immediately.";
            case "high": return isBp ? "Schedule a doctor visit soon." : "Consult your doctor about medication adjustment.";
            case "elevated": return isBp ? "Monitor closely and follow lifestyle changes." : "Watch your diet and monitor regularly.";
            default: return isBp ? "Keep up the good work!" : "Your levels are within normal range.";
        }
    }

    private void saveReading() {
        HealthReading reading = new HealthReading();
        reading.userId = LocalDataStore.getInstance().getUserId();

        if (isBpMode) {
            try {
                reading.systolic = Integer.parseInt(etSystolic.getText().toString());
                reading.diastolic = Integer.parseInt(etDiastolic.getText().toString());
            } catch (NumberFormatException e) {
                Toast.makeText(this, "Please enter valid BP values", Toast.LENGTH_SHORT).show();
                return;
            }
            try { reading.pulse = Integer.parseInt(etPulse.getText().toString()); } catch (Exception ignored) {}
            reading.type = "bp";
            reading.classification = HealthReading.classifyBP(reading.systolic, reading.diastolic);
        } else {
            try {
                reading.sugarValue = Integer.parseInt(etSugarValue.getText().toString());
            } catch (NumberFormatException e) {
                Toast.makeText(this, "Please enter a valid sugar value", Toast.LENGTH_SHORT).show();
                return;
            }
            reading.type = "sugar";
            reading.sugarType = getSugarType();
            reading.classification = HealthReading.classifySugar(reading.sugarValue, reading.sugarType);
        }

        reading.color = HealthReading.getColor(reading.classification);
        reading.notes = etNotes.getText().toString().trim();

        LocalDataStore.getInstance().addReading(reading);
        Toast.makeText(this, "Reading saved!", Toast.LENGTH_SHORT).show();
        finish();
    }
}
