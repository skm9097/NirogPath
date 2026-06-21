package com.nirogpath.app.ui.settings;

import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.nirogpath.app.R;
import com.nirogpath.app.data.model.UserProfile;
import com.nirogpath.app.data.repository.LocalDataStore;
import com.nirogpath.app.ui.doctor.DoctorReportActivity;
import com.nirogpath.app.ui.guardian.GuardianActivity;
import com.nirogpath.app.ui.login.LoginActivity;

public class SettingsFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        LinearLayout root = new LinearLayout(requireContext());
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(16), dp(16), dp(16), dp(16));
        root.setBackgroundColor(getResources().getColor(R.color.background, null));

        // Title
        TextView title = new TextView(requireContext());
        title.setText("⚙️ Settings & More");
        title.setTextSize(22);
        title.setTextColor(getResources().getColor(R.color.text_primary, null));
        title.setPadding(0, 0, 0, dp(20));
        root.addView(title);

        // Profile card
        UserProfile profile = LocalDataStore.getInstance().getProfile();
        LinearLayout profileCard = createCard();

        TextView profileTitle = new TextView(requireContext());
        profileTitle.setText("👤 " + (profile.name != null ? profile.name : "User"));
        profileTitle.setTextSize(18);
        profileTitle.setTextColor(getResources().getColor(R.color.text_primary, null));
        profileCard.addView(profileTitle);

        if (profile.age > 0) {
            TextView age = new TextView(requireContext());
            age.setText("Age: " + profile.age + " | Gender: " + (profile.gender != null ? profile.gender : "Not set"));
            age.setTextSize(13);
            age.setTextColor(getResources().getColor(R.color.text_secondary, null));
            profileCard.addView(age);
        }

        if (profile.heightCm > 0 && profile.weightKg > 0) {
            TextView bmi = new TextView(requireContext());
            float bmiVal = profile.getBmi();
            bmi.setText(String.format("BMI: %.1f (%s)", bmiVal, profile.getBmiCategory()));
            bmi.setTextSize(13);
            bmi.setTextColor(getResources().getColor(R.color.text_secondary, null));
            profileCard.addView(bmi);
        }

        if (!profile.conditions.isEmpty()) {
            TextView conditions = new TextView(requireContext());
            conditions.setText("Conditions: " + String.join(", ", profile.conditions));
            conditions.setTextSize(13);
            conditions.setTextColor(getResources().getColor(R.color.text_secondary, null));
            profileCard.addView(conditions);
        }

        root.addView(profileCard);

        // Menu items
        root.addView(createMenuItem("👨‍👩‍👧 Family Guardian", "Add a family member for health alerts", v -> {
            startActivity(new Intent(requireContext(), GuardianActivity.class));
        }));

        root.addView(createMenuItem("📄 Doctor Report", "Generate a health summary for your doctor", v -> {
            startActivity(new Intent(requireContext(), DoctorReportActivity.class));
        }));

        root.addView(createMenuItem("🌐 Language", "Switch between Hindi and English", v -> {
            Toast.makeText(requireContext(), "Language switching coming soon!", Toast.LENGTH_SHORT).show();
        }));

        root.addView(createMenuItem("📋 CBAC Screening", "Check your NCD risk score", v -> {
            Toast.makeText(requireContext(), "CBAC screening coming soon!", Toast.LENGTH_SHORT).show();
        }));

        // Logout button
        Button logoutBtn = new Button(requireContext());
        logoutBtn.setText("Logout");
        logoutBtn.setTextSize(16);
        logoutBtn.setAllCaps(false);
        logoutBtn.setTextColor(getResources().getColor(R.color.error, null));
        logoutBtn.setBackgroundResource(R.drawable.rounded_card);
        LinearLayout.LayoutParams logoutParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        logoutParams.topMargin = dp(20);
        logoutBtn.setLayoutParams(logoutParams);
        logoutBtn.setOnClickListener(v -> {
            LocalDataStore.getInstance().logout();
            startActivity(new Intent(requireContext(), LoginActivity.class));
            requireActivity().finish();
        });
        root.addView(logoutBtn);

        // Version
        TextView version = new TextView(requireContext());
        version.setText("NirogPath v1.0.0\nBuilt with ❤️ for Indian patients");
        version.setTextSize(12);
        version.setTextColor(getResources().getColor(R.color.text_hint, null));
        version.setGravity(Gravity.CENTER);
        version.setPadding(0, dp(24), 0, 0);
        root.addView(version);

        android.widget.ScrollView scrollView = new android.widget.ScrollView(requireContext());
        scrollView.addView(root);
        return scrollView;
    }

    private LinearLayout createCard() {
        LinearLayout card = new LinearLayout(requireContext());
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackgroundResource(R.drawable.rounded_card);
        card.setPadding(dp(16), dp(16), dp(16), dp(16));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.bottomMargin = dp(12);
        card.setLayoutParams(params);
        return card;
    }

    private View createMenuItem(String titleText, String subtitleText, View.OnClickListener listener) {
        LinearLayout card = createCard();
        card.setOrientation(LinearLayout.VERTICAL);
        card.setOnClickListener(listener);

        TextView title = new TextView(requireContext());
        title.setText(titleText);
        title.setTextSize(16);
        title.setTextColor(getResources().getColor(R.color.text_primary, null));
        card.addView(title);

        TextView subtitle = new TextView(requireContext());
        subtitle.setText(subtitleText);
        subtitle.setTextSize(13);
        subtitle.setTextColor(getResources().getColor(R.color.text_secondary, null));
        card.addView(subtitle);

        return card;
    }

    private int dp(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density);
    }
}
