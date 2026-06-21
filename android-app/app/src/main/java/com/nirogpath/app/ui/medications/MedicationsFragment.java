package com.nirogpath.app.ui.medications;

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
import com.nirogpath.app.data.model.Medication;
import com.nirogpath.app.data.repository.LocalDataStore;

import java.util.List;

public class MedicationsFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        LinearLayout root = new LinearLayout(requireContext());
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(16), dp(16), dp(16), dp(16));
        root.setBackgroundColor(getResources().getColor(R.color.background, null));

        // Title row
        LinearLayout titleRow = new LinearLayout(requireContext());
        titleRow.setOrientation(LinearLayout.HORIZONTAL);
        titleRow.setGravity(Gravity.CENTER_VERTICAL);
        LinearLayout.LayoutParams titleRowParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        titleRowParams.bottomMargin = dp(16);
        titleRow.setLayoutParams(titleRowParams);

        TextView title = new TextView(requireContext());
        title.setText("💊 Medications");
        title.setTextSize(22);
        title.setTextColor(getResources().getColor(R.color.text_primary, null));
        LinearLayout.LayoutParams tParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        title.setLayoutParams(tParams);
        titleRow.addView(title);

        Button addBtn = new Button(requireContext());
        addBtn.setText("+ Add");
        addBtn.setTextSize(13);
        addBtn.setAllCaps(false);
        addBtn.setTextColor(getResources().getColor(R.color.white, null));
        addBtn.setBackgroundResource(R.drawable.rounded_button);
        addBtn.setPadding(dp(16), dp(4), dp(16), dp(4));
        addBtn.setOnClickListener(v -> startActivity(new Intent(requireContext(), AddMedicationActivity.class)));
        titleRow.addView(addBtn);

        root.addView(titleRow);

        // Medications list
        List<Medication> meds = LocalDataStore.getInstance().getMedications();
        if (meds.isEmpty()) {
            TextView empty = new TextView(requireContext());
            empty.setText("No medications added yet.\nTap '+ Add' to add your medications.");
            empty.setTextSize(15);
            empty.setTextColor(getResources().getColor(R.color.text_hint, null));
            empty.setGravity(Gravity.CENTER);
            empty.setPadding(0, dp(60), 0, 0);
            root.addView(empty);
        } else {
            for (Medication med : meds) {
                View item = inflater.inflate(R.layout.item_medication, root, false);
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
                        refreshView();
                    });
                }
                root.addView(item);
            }
        }

        android.widget.ScrollView scrollView = new android.widget.ScrollView(requireContext());
        scrollView.addView(root);
        return scrollView;
    }

    private void refreshView() {
        if (getParentFragmentManager() != null) {
            getParentFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragmentContainer, new MedicationsFragment())
                    .commit();
        }
    }

    private int dp(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density);
    }
}
