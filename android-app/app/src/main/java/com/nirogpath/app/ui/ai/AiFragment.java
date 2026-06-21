package com.nirogpath.app.ui.ai;

import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.nirogpath.app.R;

public class AiFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        LinearLayout root = new LinearLayout(requireContext());
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(16), dp(16), dp(16), dp(16));
        root.setGravity(Gravity.CENTER);
        root.setBackgroundColor(getResources().getColor(R.color.background, null));

        // Icon
        TextView icon = new TextView(requireContext());
        icon.setText("🤖");
        icon.setTextSize(48);
        icon.setGravity(Gravity.CENTER);
        icon.setPadding(0, dp(40), 0, dp(16));
        root.addView(icon);

        // Title
        TextView title = new TextView(requireContext());
        title.setText("AI Health Assistant");
        title.setTextSize(22);
        title.setTextColor(getResources().getColor(R.color.text_primary, null));
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, 0, 0, dp(8));
        root.addView(title);

        // Subtitle
        TextView subtitle = new TextView(requireContext());
        subtitle.setText("Powered by Groq AI (Llama 3.3)\nAsk questions about your health, medications, diet, and more.");
        subtitle.setTextSize(14);
        subtitle.setTextColor(getResources().getColor(R.color.text_secondary, null));
        subtitle.setGravity(Gravity.CENTER);
        subtitle.setPadding(0, 0, 0, dp(24));
        root.addView(subtitle);

        // Quick questions
        String[] quickQuestions = {
                "What should I eat to control BP?",
                "How to manage diabetes with diet?",
                "When should I see a doctor?",
                "Tips for medication adherence"
        };

        for (String q : quickQuestions) {
            Button btn = new Button(requireContext());
            btn.setText(q);
            btn.setTextSize(14);
            btn.setAllCaps(false);
            btn.setTextColor(getResources().getColor(R.color.primary, null));
            btn.setBackgroundResource(R.drawable.rounded_card);
            btn.setPadding(dp(16), dp(12), dp(16), dp(12));
            btn.setGravity(Gravity.START | Gravity.CENTER_VERTICAL);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            params.bottomMargin = dp(8);
            btn.setLayoutParams(params);
            btn.setOnClickListener(v -> {
                Intent intent = new Intent(requireContext(), AiConsultActivity.class);
                intent.putExtra("question", q);
                startActivity(intent);
            });
            root.addView(btn);
        }

        // Open chat button
        Button openChat = new Button(requireContext());
        openChat.setText("Start a Conversation");
        openChat.setTextSize(16);
        openChat.setAllCaps(false);
        openChat.setTextColor(getResources().getColor(R.color.white, null));
        openChat.setBackgroundResource(R.drawable.rounded_button);
        LinearLayout.LayoutParams chatParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        chatParams.topMargin = dp(16);
        openChat.setLayoutParams(chatParams);
        openChat.setOnClickListener(v -> startActivity(new Intent(requireContext(), AiConsultActivity.class)));
        root.addView(openChat);

        android.widget.ScrollView scrollView = new android.widget.ScrollView(requireContext());
        scrollView.addView(root);
        return scrollView;
    }

    private int dp(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density);
    }
}
