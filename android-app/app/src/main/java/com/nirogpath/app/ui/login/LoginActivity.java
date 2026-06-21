package com.nirogpath.app.ui.login;

import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.JsonObject;
import com.nirogpath.app.BuildConfig;
import com.nirogpath.app.R;
import com.nirogpath.app.data.api.GroqClient;
import com.nirogpath.app.data.api.SupabaseClient;
import com.nirogpath.app.data.repository.LocalDataStore;
import com.nirogpath.app.ui.dashboard.MainActivity;
import com.nirogpath.app.ui.onboarding.OnboardingActivity;

public class LoginActivity extends AppCompatActivity {
    private EditText etPhone, etOtp;
    private Button btnSendOtp, btnVerifyOtp, btnResendOtp;
    private LinearLayout phoneSection, otpSection;
    private TextView tvOtpSent;
    private ProgressBar progressBar;
    private String phoneNumber;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // Initialize services
        LocalDataStore.init(this);
        SupabaseClient.init(BuildConfig.SUPABASE_URL, BuildConfig.SUPABASE_ANON_KEY);
        GroqClient.init(BuildConfig.GROQ_API_KEY);

        // Check if already logged in
        if (LocalDataStore.getInstance().isLoggedIn()) {
            if (LocalDataStore.getInstance().isOnboardingComplete()) {
                startActivity(new Intent(this, MainActivity.class));
            } else {
                startActivity(new Intent(this, OnboardingActivity.class));
            }
            finish();
            return;
        }

        initViews();
        setupListeners();
    }

    private void initViews() {
        etPhone = findViewById(R.id.etPhone);
        etOtp = findViewById(R.id.etOtp);
        btnSendOtp = findViewById(R.id.btnSendOtp);
        btnVerifyOtp = findViewById(R.id.btnVerifyOtp);
        btnResendOtp = findViewById(R.id.btnResendOtp);
        phoneSection = findViewById(R.id.phoneSection);
        otpSection = findViewById(R.id.otpSection);
        tvOtpSent = findViewById(R.id.tvOtpSent);
        progressBar = findViewById(R.id.progressBar);
    }

    private void setupListeners() {
        btnSendOtp.setOnClickListener(v -> sendOtp());
        btnVerifyOtp.setOnClickListener(v -> verifyOtp());
        btnResendOtp.setOnClickListener(v -> sendOtp());
    }

    private void sendOtp() {
        String phone = etPhone.getText().toString().replaceAll("\\D", "");
        if (phone.length() != 10) {
            Toast.makeText(this, R.string.enter_valid_number, Toast.LENGTH_SHORT).show();
            return;
        }

        phoneNumber = "+91" + phone;
        setLoading(true);

        new Thread(() -> {
            try {
                SupabaseClient.getInstance().signInWithOtp(phoneNumber);
                runOnUiThread(() -> {
                    setLoading(false);
                    phoneSection.setVisibility(View.GONE);
                    otpSection.setVisibility(View.VISIBLE);
                    tvOtpSent.setText(getString(R.string.otp_sent, phone));
                    Toast.makeText(this, "OTP sent!", Toast.LENGTH_SHORT).show();
                    startResendTimer();
                });
            } catch (Exception e) {
                runOnUiThread(() -> {
                    setLoading(false);
                    Toast.makeText(this, "Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        }).start();
    }

    private void verifyOtp() {
        String otp = etOtp.getText().toString().trim();
        if (otp.length() != 6) {
            Toast.makeText(this, "Enter 6-digit OTP", Toast.LENGTH_SHORT).show();
            return;
        }

        setLoading(true);

        new Thread(() -> {
            try {
                JsonObject result = SupabaseClient.getInstance().verifyOtp(phoneNumber, otp);
                if (result.has("access_token")) {
                    String token = result.get("access_token").getAsString();
                    String userId = result.getAsJsonObject("user").get("id").getAsString();

                    LocalDataStore.getInstance().saveAccessToken(token, userId);
                    SupabaseClient.getInstance().setAccessToken(token);

                    runOnUiThread(() -> {
                        setLoading(false);
                        startActivity(new Intent(this, OnboardingActivity.class));
                        finish();
                    });
                } else {
                    runOnUiThread(() -> {
                        setLoading(false);
                        Toast.makeText(this, R.string.invalid_otp, Toast.LENGTH_SHORT).show();
                    });
                }
            } catch (Exception e) {
                runOnUiThread(() -> {
                    setLoading(false);
                    Toast.makeText(this, "Error: " + e.getMessage(), Toast.LENGTH_LONG).show();
                });
            }
        }).start();
    }

    private void startResendTimer() {
        btnResendOtp.setEnabled(false);
        new CountDownTimer(30000, 1000) {
            public void onTick(long millisUntilFinished) {
                btnResendOtp.setText(getString(R.string.resend_otp_timer, (int)(millisUntilFinished / 1000)));
            }
            public void onFinish() {
                btnResendOtp.setEnabled(true);
                btnResendOtp.setText(R.string.resend_otp);
            }
        }.start();
    }

    private void setLoading(boolean loading) {
        progressBar.setVisibility(loading ? View.VISIBLE : View.GONE);
        btnSendOtp.setEnabled(!loading);
        btnVerifyOtp.setEnabled(!loading);
    }
}
