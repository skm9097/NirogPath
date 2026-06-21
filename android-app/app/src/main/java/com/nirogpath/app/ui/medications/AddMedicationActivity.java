package com.nirogpath.app.ui.medications;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.nirogpath.app.R;
import com.nirogpath.app.data.model.Medication;
import com.nirogpath.app.data.repository.LocalDataStore;

public class AddMedicationActivity extends AppCompatActivity {

    private static final String[] COMMON_MEDICATIONS = {
            "Select Medication", "Amlodipine", "Telmisartan", "Metformin", "Glimepiride",
            "Atenolol", "Losartan", "Enalapril", "Hydrochlorothiazide", "Aspirin",
            "Rosuvastatin", "Metoprolol", "Ramipril", "Pioglitazone", "Voglibose",
            "Sitagliptin", "Insulin Glargine", "Insulin Aspart", "Empagliflozin",
            "Dapagliflozin", "Other"
    };

    private static final String[] TIME_OPTIONS = {"Morning", "Afternoon", "Evening", "Night"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        android.widget.ScrollView scrollView = new android.widget.ScrollView(this);
        android.widget.LinearLayout root = new android.widget.LinearLayout(this);
        root.setOrientation(android.widget.LinearLayout.VERTICAL);
        root.setPadding(dp(16), dp(16), dp(16), dp(16));
        root.setBackgroundColor(getResources().getColor(R.color.background, null));
        scrollView.addView(root);

        // Back + Title
        android.widget.LinearLayout header = new android.widget.LinearLayout(this);
        header.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        header.setGravity(android.view.Gravity.CENTER_VERTICAL);
        android.widget.LinearLayout.LayoutParams headerParams = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
        headerParams.bottomMargin = dp(20);
        header.setLayoutParams(headerParams);

        android.widget.ImageView backBtn = new android.widget.ImageView(this);
        backBtn.setImageResource(R.drawable.ic_back);
        backBtn.setPadding(dp(8), dp(8), dp(8), dp(8));
        backBtn.setOnClickListener(v -> finish());
        header.addView(backBtn, dp(40), dp(40));

        android.widget.TextView title = new android.widget.TextView(this);
        title.setText("💊 Add Medication");
        title.setTextSize(20);
        title.setTextColor(getResources().getColor(R.color.text_primary, null));
        title.setPadding(dp(8), 0, 0, 0);
        header.addView(title);
        root.addView(header);

        // Medication spinner
        addLabel(root, "Medication");
        Spinner spMedication = new Spinner(this);
        spMedication.setBackgroundResource(R.drawable.rounded_input);
        spMedication.setPadding(dp(16), 0, dp(16), 0);
        ArrayAdapter<String> medAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, COMMON_MEDICATIONS);
        spMedication.setAdapter(medAdapter);
        android.widget.LinearLayout.LayoutParams spParams = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        spParams.bottomMargin = dp(16);
        root.addView(spMedication, spParams);

        // Custom name
        addLabel(root, "Or enter medication name");
        EditText etCustomName = new EditText(this);
        etCustomName.setHint("Custom medication name");
        etCustomName.setBackgroundResource(R.drawable.rounded_input);
        etCustomName.setPadding(dp(16), dp(12), dp(16), dp(12));
        etCustomName.setTextSize(16);
        android.widget.LinearLayout.LayoutParams nameParams = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        nameParams.bottomMargin = dp(16);
        root.addView(etCustomName, nameParams);

        // Dosage
        addLabel(root, "Dosage");
        EditText etDosage = new EditText(this);
        etDosage.setHint("e.g. 5mg, 500mg");
        etDosage.setBackgroundResource(R.drawable.rounded_input);
        etDosage.setPadding(dp(16), dp(12), dp(16), dp(12));
        etDosage.setTextSize(16);
        android.widget.LinearLayout.LayoutParams dosParams = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        dosParams.bottomMargin = dp(16);
        root.addView(etDosage, dosParams);

        // Time of day
        addLabel(root, "Time of Day");
        Spinner spTime = new Spinner(this);
        spTime.setBackgroundResource(R.drawable.rounded_input);
        spTime.setPadding(dp(16), 0, dp(16), 0);
        ArrayAdapter<String> timeAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, TIME_OPTIONS);
        spTime.setAdapter(timeAdapter);
        android.widget.LinearLayout.LayoutParams timeParams = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        timeParams.bottomMargin = dp(24);
        root.addView(spTime, timeParams);

        // Save button
        Button btnSave = new Button(this);
        btnSave.setText("Save Medication");
        btnSave.setTextSize(16);
        btnSave.setAllCaps(false);
        btnSave.setTextColor(getResources().getColor(R.color.white, null));
        btnSave.setBackgroundResource(R.drawable.rounded_button);
        android.widget.LinearLayout.LayoutParams saveParams = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        root.addView(btnSave, saveParams);

        btnSave.setOnClickListener(v -> {
            int pos = spMedication.getSelectedItemPosition();
            String name = etCustomName.getText().toString().trim();
            if (name.isEmpty() && pos > 0 && pos < COMMON_MEDICATIONS.length - 1) {
                name = COMMON_MEDICATIONS[pos];
            }
            if (name.isEmpty()) {
                Toast.makeText(this, "Please select or enter a medication name", Toast.LENGTH_SHORT).show();
                return;
            }

            String dosage = etDosage.getText().toString().trim();
            if (dosage.isEmpty()) {
                Toast.makeText(this, "Please enter dosage", Toast.LENGTH_SHORT).show();
                return;
            }

            String time = TIME_OPTIONS[spTime.getSelectedItemPosition()].toLowerCase();
            Medication med = new Medication(name, dosage, time);
            LocalDataStore.getInstance().addMedication(med);
            Toast.makeText(this, "Medication added!", Toast.LENGTH_SHORT).show();
            finish();
        });

        setContentView(scrollView);
    }

    private void addLabel(android.widget.LinearLayout parent, String text) {
        android.widget.TextView label = new android.widget.TextView(this);
        label.setText(text);
        label.setTextSize(14);
        label.setTextColor(getResources().getColor(R.color.text_primary, null));
        android.widget.LinearLayout.LayoutParams params = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
        params.bottomMargin = dp(4);
        parent.addView(label, params);
    }

    private int dp(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density);
    }
}
