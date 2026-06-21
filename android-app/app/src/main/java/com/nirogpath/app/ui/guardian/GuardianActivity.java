package com.nirogpath.app.ui.guardian;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.nirogpath.app.R;

public class GuardianActivity extends AppCompatActivity {
    private static final String[] RELATIONSHIPS = {
            "Relationship", "Son", "Daughter", "Spouse", "Sibling", "Parent", "Friend", "Other"
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        android.widget.ScrollView scrollView = new android.widget.ScrollView(this);
        android.widget.LinearLayout root = new android.widget.LinearLayout(this);
        root.setOrientation(android.widget.LinearLayout.VERTICAL);
        root.setPadding(dp(16), dp(16), dp(16), dp(16));
        root.setBackgroundColor(getResources().getColor(R.color.background, null));
        scrollView.addView(root);

        // Header
        android.widget.LinearLayout header = new android.widget.LinearLayout(this);
        header.setOrientation(android.widget.LinearLayout.HORIZONTAL);
        header.setGravity(android.view.Gravity.CENTER_VERTICAL);
        android.widget.LinearLayout.LayoutParams headerParams = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
        headerParams.bottomMargin = dp(24);
        header.setLayoutParams(headerParams);

        android.widget.ImageView backBtn = new android.widget.ImageView(this);
        backBtn.setImageResource(R.drawable.ic_back);
        backBtn.setPadding(dp(8), dp(8), dp(8), dp(8));
        backBtn.setOnClickListener(v -> finish());
        header.addView(backBtn, dp(40), dp(40));

        android.widget.TextView title = new android.widget.TextView(this);
        title.setText("👨‍👩‍👧 Family Guardian");
        title.setTextSize(20);
        title.setTextColor(getResources().getColor(R.color.text_primary, null));
        title.setPadding(dp(8), 0, 0, 0);
        header.addView(title);
        root.addView(header);

        // Description
        android.widget.TextView desc = new android.widget.TextView(this);
        desc.setText("Add a family member who will receive health alerts and can monitor your readings.");
        desc.setTextSize(14);
        desc.setTextColor(getResources().getColor(R.color.text_secondary, null));
        android.widget.LinearLayout.LayoutParams descParams = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
        descParams.bottomMargin = dp(20);
        root.addView(desc, descParams);

        // Name
        addLabel(root, "Guardian's Name");
        EditText etName = new EditText(this);
        etName.setHint("Enter guardian's name");
        etName.setBackgroundResource(R.drawable.rounded_input);
        etName.setPadding(dp(16), dp(12), dp(16), dp(12));
        etName.setTextSize(16);
        addField(root, etName);

        // Phone
        addLabel(root, "Guardian's Phone");
        android.widget.LinearLayout phoneRow = new android.widget.LinearLayout(this);
        phoneRow.setOrientation(android.widget.LinearLayout.HORIZONTAL);

        android.widget.TextView prefix = new android.widget.TextView(this);
        prefix.setText("🇮🇳 +91");
        prefix.setBackgroundResource(R.drawable.rounded_input);
        prefix.setGravity(android.view.Gravity.CENTER);
        prefix.setPadding(dp(12), dp(12), dp(12), dp(12));
        prefix.setTextSize(15);
        phoneRow.addView(prefix, dp(80), dp(52));

        EditText etPhone = new EditText(this);
        etPhone.setHint("Mobile number");
        etPhone.setInputType(android.text.InputType.TYPE_CLASS_NUMBER);
        etPhone.setBackgroundResource(R.drawable.rounded_input);
        etPhone.setPadding(dp(16), dp(12), dp(16), dp(12));
        etPhone.setTextSize(16);
        android.widget.LinearLayout.LayoutParams phoneParams = new android.widget.LinearLayout.LayoutParams(
                0, dp(52), 1);
        phoneParams.leftMargin = dp(8);
        phoneRow.addView(etPhone, phoneParams);

        android.widget.LinearLayout.LayoutParams rowParams = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
        rowParams.bottomMargin = dp(16);
        root.addView(phoneRow, rowParams);

        // Relationship
        addLabel(root, "Relationship");
        Spinner spRelationship = new Spinner(this);
        spRelationship.setBackgroundResource(R.drawable.rounded_input);
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, RELATIONSHIPS);
        spRelationship.setAdapter(adapter);
        android.widget.LinearLayout.LayoutParams spParams = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        spParams.bottomMargin = dp(24);
        root.addView(spRelationship, spParams);

        // Save button
        Button btnSave = new Button(this);
        btnSave.setText("Save Guardian");
        btnSave.setTextSize(16);
        btnSave.setAllCaps(false);
        btnSave.setTextColor(getResources().getColor(R.color.white, null));
        btnSave.setBackgroundResource(R.drawable.rounded_button);
        root.addView(btnSave, new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, dp(52)));

        btnSave.setOnClickListener(v -> {
            String name = etName.getText().toString().trim();
            String phone = etPhone.getText().toString().replaceAll("\\D", "");
            if (name.isEmpty()) {
                Toast.makeText(this, "Please enter guardian's name", Toast.LENGTH_SHORT).show();
                return;
            }
            if (phone.length() != 10) {
                Toast.makeText(this, "Please enter a valid 10-digit number", Toast.LENGTH_SHORT).show();
                return;
            }
            Toast.makeText(this, "Guardian saved! They will receive health alerts.", Toast.LENGTH_LONG).show();
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

    private void addField(android.widget.LinearLayout parent, android.widget.EditText field) {
        android.widget.LinearLayout.LayoutParams params = new android.widget.LinearLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, dp(52));
        params.bottomMargin = dp(16);
        parent.addView(field, params);
    }

    private int dp(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density);
    }
}
