package com.nirogpath.app.ui.ai;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.nirogpath.app.R;
import com.nirogpath.app.data.api.GroqClient;
import com.nirogpath.app.data.model.ChatMessage;
import com.nirogpath.app.data.model.HealthReading;
import com.nirogpath.app.data.model.UserProfile;
import com.nirogpath.app.data.repository.LocalDataStore;

import java.util.ArrayList;
import java.util.List;

public class AiConsultActivity extends AppCompatActivity {
    private RecyclerView rvMessages;
    private EditText etMessage;
    private Button btnSend;
    private LinearLayout loadingIndicator;
    private ChatAdapter adapter;
    private final List<ChatMessage> messages = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ai_consult);

        rvMessages = findViewById(R.id.rvMessages);
        etMessage = findViewById(R.id.etMessage);
        btnSend = findViewById(R.id.btnSend);
        loadingIndicator = findViewById(R.id.loadingIndicator);

        findViewById(R.id.btnBack).setOnClickListener(v -> finish());

        adapter = new ChatAdapter(messages);
        rvMessages.setLayoutManager(new LinearLayoutManager(this));
        rvMessages.setAdapter(adapter);

        // Welcome message
        messages.add(new ChatMessage("assistant",
                "Namaste! 🙏 I'm your NirogPath AI Health Assistant.\n\n" +
                "I can help you with:\n" +
                "• Understanding your BP and sugar readings\n" +
                "• Diet and lifestyle advice\n" +
                "• Medication information\n" +
                "• When to see a doctor\n\n" +
                "How can I help you today?"));
        adapter.notifyItemInserted(0);

        btnSend.setOnClickListener(v -> sendMessage());

        // Check for pre-filled question
        String question = getIntent().getStringExtra("question");
        if (question != null && !question.isEmpty()) {
            etMessage.setText(question);
            sendMessage();
        }
    }

    private void sendMessage() {
        String text = etMessage.getText().toString().trim();
        if (text.isEmpty()) return;

        messages.add(new ChatMessage("user", text));
        adapter.notifyItemInserted(messages.size() - 1);
        rvMessages.scrollToPosition(messages.size() - 1);
        etMessage.setText("");

        loadingIndicator.setVisibility(View.VISIBLE);
        btnSend.setEnabled(false);

        String context = buildPatientContext();
        String fullMessage = context + "\n\nPatient's question: " + text;

        new Thread(() -> {
            try {
                String response = GroqClient.getInstance().chat(
                        GroqClient.HEALTH_SYSTEM_PROMPT, fullMessage);
                runOnUiThread(() -> {
                    loadingIndicator.setVisibility(View.GONE);
                    btnSend.setEnabled(true);
                    messages.add(new ChatMessage("assistant", response));
                    adapter.notifyItemInserted(messages.size() - 1);
                    rvMessages.scrollToPosition(messages.size() - 1);
                });
            } catch (Exception e) {
                runOnUiThread(() -> {
                    loadingIndicator.setVisibility(View.GONE);
                    btnSend.setEnabled(true);
                    messages.add(new ChatMessage("assistant",
                            "Sorry, I couldn't connect to the AI service. Please check your internet connection and try again.\n\nError: " + e.getMessage()));
                    adapter.notifyItemInserted(messages.size() - 1);
                    rvMessages.scrollToPosition(messages.size() - 1);
                });
            }
        }).start();
    }

    private String buildPatientContext() {
        StringBuilder ctx = new StringBuilder("Patient context:\n");
        UserProfile profile = LocalDataStore.getInstance().getProfile();
        if (profile.name != null) ctx.append("Name: ").append(profile.name).append("\n");
        if (profile.age > 0) ctx.append("Age: ").append(profile.age).append("\n");
        if (profile.gender != null) ctx.append("Gender: ").append(profile.gender).append("\n");
        if (!profile.conditions.isEmpty()) {
            ctx.append("Conditions: ").append(String.join(", ", profile.conditions)).append("\n");
        }
        if (profile.heightCm > 0 && profile.weightKg > 0) {
            ctx.append("BMI: ").append(String.format("%.1f", profile.getBmi())).append("\n");
        }

        HealthReading latestBp = LocalDataStore.getInstance().getLatestBpReading();
        if (latestBp != null) {
            ctx.append("Latest BP: ").append(latestBp.systolic).append("/").append(latestBp.diastolic)
                    .append(" (").append(latestBp.classification).append(")\n");
        }
        HealthReading latestSugar = LocalDataStore.getInstance().getLatestSugarReading();
        if (latestSugar != null) {
            ctx.append("Latest Sugar: ").append(latestSugar.sugarValue).append(" mg/dL ")
                    .append(latestSugar.sugarType).append(" (").append(latestSugar.classification).append(")\n");
        }

        return ctx.toString();
    }

    static class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.ViewHolder> {
        private final List<ChatMessage> messages;

        ChatAdapter(List<ChatMessage> messages) {
            this.messages = messages;
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_chat_message, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            ChatMessage msg = messages.get(position);
            holder.tvSender.setText("user".equals(msg.role) ? "You" : "🤖 NirogPath AI");
            holder.tvMessage.setText(msg.content);

            LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) holder.messageContainer.getLayoutParams();
            if ("user".equals(msg.role)) {
                params.gravity = android.view.Gravity.END;
                holder.messageContainer.setBackgroundColor(0xFFE8F5EE);
            } else {
                params.gravity = android.view.Gravity.START;
                holder.messageContainer.setBackgroundColor(0xFFFFFFFF);
            }
            holder.messageContainer.setLayoutParams(params);
        }

        @Override
        public int getItemCount() {
            return messages.size();
        }

        static class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvSender, tvMessage;
            LinearLayout messageContainer;

            ViewHolder(@NonNull View v) {
                super(v);
                tvSender = v.findViewById(R.id.tvSender);
                tvMessage = v.findViewById(R.id.tvMessage);
                messageContainer = v.findViewById(R.id.messageContainer);
            }
        }
    }
}
