package com.nirogpath.app.ui.doctor;

import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.nirogpath.app.R;
import com.nirogpath.app.data.model.HealthReading;
import com.nirogpath.app.data.model.Medication;
import com.nirogpath.app.data.model.UserProfile;
import com.nirogpath.app.data.repository.LocalDataStore;
import com.nirogpath.app.utils.HealthUtils;

import java.util.List;

public class DoctorReportActivity extends AppCompatActivity {
    private LinearLayout reportContainer;
    private Button btnGenerate, btnShare;
    private ProgressBar progressBar;
    private String reportText = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        ScrollView scrollView = new ScrollView(this);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(16), dp(16), dp(16), dp(16));
        root.setBackgroundColor(getResources().getColor(R.color.background, null));
        scrollView.addView(root);

        // Header
        LinearLayout header = new LinearLayout(this);
        header.setOrientation(LinearLayout.HORIZONTAL);
        header.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout.LayoutParams headerParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        headerParams.bottomMargin = dp(20);
        header.setLayoutParams(headerParams);

        android.widget.ImageView backBtn = new android.widget.ImageView(this);
        backBtn.setImageResource(R.drawable.ic_back);
        backBtn.setPadding(dp(8), dp(8), dp(8), dp(8));
        backBtn.setOnClickListener(v -> finish());
        header.addView(backBtn, dp(40), dp(40));

        TextView title = new TextView(this);
        title.setText("📄 Doctor Report");
        title.setTextSize(20);
        title.setTextColor(getResources().getColor(R.color.text_primary, null));
        title.setPadding(dp(8), 0, 0, 0);
        header.addView(title);
        root.addView(header);

        // Generate button
        btnGenerate = new Button(this);
        btnGenerate.setText("Generate Health Report");
        btnGenerate.setTextSize(16);
        btnGenerate.setAllCaps(false);
        btnGenerate.setTextColor(getResources().getColor(R.color.white, null));
        btnGenerate.setBackgroundResource(R.drawable.rounded_button);
        LinearLayout.LayoutParams genParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, dp(52));
        genParams.bottomMargin = dp(16);
        root.addView(btnGenerate, genParams);

        progressBar = new ProgressBar(this);
        progressBar.setVisibility(View.GONE);
        progressBar.setIndeterminateTintList(getResources().getColorStateList(R.color.primary, null));
        LinearLayout.LayoutParams progParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        progParams.gravity = Gravity.CENTER;
        progParams.bottomMargin = dp(16);
        root.addView(progressBar, progParams);

        // Report container
        reportContainer = new LinearLayout(this);
        reportContainer.setOrientation(LinearLayout.VERTICAL);
        reportContainer.setBackgroundResource(R.drawable.rounded_card);
        reportContainer.setPadding(dp(16), dp(16), dp(16), dp(16));
        reportContainer.setVisibility(View.GONE);
        root.addView(reportContainer, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        // Share button
        btnShare = new Button(this);
        btnShare.setText("Share Report");
        btnShare.setTextSize(16);
        btnShare.setAllCaps(false);
        btnShare.setTextColor(getResources().getColor(R.color.white, null));
        btnShare.setBackgroundResource(R.drawable.rounded_button);
        btnShare.setVisibility(View.GONE);
        LinearLayout.LayoutParams shareParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, dp(52));
        shareParams.topMargin = dp(16);
        root.addView(btnShare, shareParams);

        btnGenerate.setOnClickListener(v -> generateReport());
        btnShare.setOnClickListener(v -> shareReport());

        setContentView(scrollView);
    }

    private void generateReport() {
        progressBar.setVisibility(View.VISIBLE);
        btnGenerate.setEnabled(false);

        UserProfile profile = LocalDataStore.getInstance().getProfile();
        List<HealthReading> readings = LocalDataStore.getInstance().getReadings();
        List<Medication> meds = LocalDataStore.getInstance().getMedications();

        StringBuilder report = new StringBuilder();
        report.append("═══════════════════════════════\n");
        report.append("   NIROGPATH HEALTH REPORT\n");
        report.append("═══════════════════════════════\n\n");
        report.append("Date: ").append(HealthUtils.formatDate(System.currentTimeMillis())).append("\n\n");

        report.append("── PATIENT INFORMATION ──\n");
        report.append("Name: ").append(profile.name != null ? profile.name : "Not provided").append("\n");
        if (profile.age > 0) report.append("Age: ").append(profile.age).append(" years\n");
        if (profile.gender != null) report.append("Gender: ").append(profile.gender).append("\n");
        if (profile.heightCm > 0) report.append("Height: ").append(profile.heightCm).append(" cm\n");
        if (profile.weightKg > 0) report.append("Weight: ").append(profile.weightKg).append(" kg\n");
        if (profile.heightCm > 0 && profile.weightKg > 0) {
            report.append("BMI: ").append(String.format("%.1f", profile.getBmi()))
                    .append(" (").append(profile.getBmiCategory()).append(")\n");
        }
        if (!profile.conditions.isEmpty()) {
            report.append("Conditions: ").append(String.join(", ", profile.conditions)).append("\n");
        }

        report.append("\n── RECENT READINGS ──\n");
        int count = 0;
        for (HealthReading r : readings) {
            if (count >= 10) break;
            if ("bp".equals(r.type)) {
                report.append(HealthUtils.formatDateTime(r.timestamp)).append(" | BP: ")
                        .append(r.systolic).append("/").append(r.diastolic)
                        .append(" | ").append(r.classification).append("\n");
            } else {
                report.append(HealthUtils.formatDateTime(r.timestamp)).append(" | Sugar: ")
                        .append(r.sugarValue).append(" mg/dL (").append(r.sugarType)
                        .append(") | ").append(r.classification).append("\n");
            }
            count++;
        }
        if (readings.isEmpty()) report.append("No readings recorded\n");

        report.append("\n── MEDICATIONS ──\n");
        if (meds.isEmpty()) {
            report.append("No medications recorded\n");
        } else {
            for (Medication m : meds) {
                report.append("• ").append(m.name).append(" - ").append(m.dosage)
                        .append(" (").append(m.timeOfDay).append(")\n");
            }
        }

        report.append("\n═══════════════════════════════\n");
        report.append("Generated by NirogPath App\n");
        report.append("For doctor's reference only\n");

        reportText = report.toString();

        progressBar.setVisibility(View.GONE);
        btnGenerate.setEnabled(true);
        reportContainer.setVisibility(View.VISIBLE);
        btnShare.setVisibility(View.VISIBLE);

        reportContainer.removeAllViews();
        TextView tvReport = new TextView(this);
        tvReport.setText(reportText);
        tvReport.setTextSize(13);
        tvReport.setTextColor(getResources().getColor(R.color.text_primary, null));
        tvReport.setTypeface(android.graphics.Typeface.MONOSPACE);
        reportContainer.addView(tvReport);
    }

    private void shareReport() {
        if (reportText.isEmpty()) {
            Toast.makeText(this, "Generate report first", Toast.LENGTH_SHORT).show();
            return;
        }
        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/plain");
        shareIntent.putExtra(Intent.EXTRA_SUBJECT, "NirogPath Health Report");
        shareIntent.putExtra(Intent.EXTRA_TEXT, reportText);
        startActivity(Intent.createChooser(shareIntent, "Share Report via"));
    }

    private int dp(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density);
    }
}
