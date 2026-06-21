package com.nirogpath.app.ui.health;

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
import com.nirogpath.app.data.model.HealthReading;
import com.nirogpath.app.data.repository.LocalDataStore;
import com.nirogpath.app.utils.HealthUtils;

import java.util.List;

public class HealthFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        LinearLayout root = new LinearLayout(requireContext());
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(16), dp(16), dp(16), dp(16));
        root.setBackgroundColor(getResources().getColor(R.color.background, null));

        // Title
        TextView title = new TextView(requireContext());
        title.setText("📊 Health History");
        title.setTextSize(22);
        title.setTextColor(getResources().getColor(R.color.text_primary, null));
        title.setPadding(0, 0, 0, dp(16));
        root.addView(title);

        // Add buttons
        LinearLayout btnRow = new LinearLayout(requireContext());
        btnRow.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        rowParams.bottomMargin = dp(16);
        btnRow.setLayoutParams(rowParams);

        Button btnAddBp = createButton("+ BP Reading");
        btnAddBp.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), AddReadingActivity.class);
            intent.putExtra("type", "bp");
            startActivity(intent);
        });
        btnRow.addView(btnAddBp);

        Button btnAddSugar = createButton("+ Sugar Reading");
        btnAddSugar.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), AddReadingActivity.class);
            intent.putExtra("type", "sugar");
            startActivity(intent);
        });
        LinearLayout.LayoutParams sugarParams = (LinearLayout.LayoutParams) btnAddSugar.getLayoutParams();
        sugarParams.leftMargin = dp(8);
        btnRow.addView(btnAddSugar);

        root.addView(btnRow);

        // Readings list
        List<HealthReading> readings = LocalDataStore.getInstance().getReadings();
        if (readings.isEmpty()) {
            TextView empty = new TextView(requireContext());
            empty.setText("No health readings yet.\nTap the buttons above to add your first reading.");
            empty.setTextSize(15);
            empty.setTextColor(getResources().getColor(R.color.text_hint, null));
            empty.setGravity(Gravity.CENTER);
            empty.setPadding(0, dp(60), 0, 0);
            root.addView(empty);
        } else {
            for (HealthReading reading : readings) {
                root.addView(createReadingCard(reading));
            }
        }

        android.widget.ScrollView scrollView = new android.widget.ScrollView(requireContext());
        scrollView.addView(root);
        return scrollView;
    }

    private View createReadingCard(HealthReading reading) {
        LinearLayout card = new LinearLayout(requireContext());
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackgroundResource(R.drawable.rounded_card);
        card.setPadding(dp(16), dp(12), dp(16), dp(12));
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.bottomMargin = dp(8);
        card.setLayoutParams(params);

        // Type and time row
        LinearLayout row = new LinearLayout(requireContext());
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);

        TextView type = new TextView(requireContext());
        type.setText("bp".equals(reading.type) ? "🩸 Blood Pressure" : "🍬 Blood Sugar");
        type.setTextSize(15);
        type.setTextColor(getResources().getColor(R.color.text_primary, null));
        LinearLayout.LayoutParams typeParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        type.setLayoutParams(typeParams);
        row.addView(type);

        TextView time = new TextView(requireContext());
        time.setText(HealthUtils.formatDateTime(reading.timestamp));
        time.setTextSize(12);
        time.setTextColor(getResources().getColor(R.color.text_hint, null));
        row.addView(time);

        card.addView(row);

        // Value
        TextView value = new TextView(requireContext());
        if ("bp".equals(reading.type)) {
            value.setText(reading.systolic + "/" + reading.diastolic + " mmHg");
        } else {
            value.setText(reading.sugarValue + " mg/dL (" + reading.sugarType + ")");
        }
        value.setTextSize(20);
        value.setTextColor(getResources().getColor(R.color.text_primary, null));
        card.addView(value);

        // Classification
        TextView status = new TextView(requireContext());
        status.setText(HealthReading.getDisplayLabel(reading.classification));
        status.setTextSize(13);
        card.addView(status);

        return card;
    }

    private Button createButton(String text) {
        Button btn = new Button(requireContext());
        btn.setText(text);
        btn.setTextSize(13);
        btn.setAllCaps(false);
        btn.setTextColor(getResources().getColor(R.color.white, null));
        btn.setBackgroundResource(R.drawable.rounded_button);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, dp(44), 1);
        btn.setLayoutParams(params);
        return btn;
    }

    private int dp(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density);
    }
}
