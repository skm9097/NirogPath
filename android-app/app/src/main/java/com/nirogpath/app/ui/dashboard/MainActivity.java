package com.nirogpath.app.ui.dashboard;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.nirogpath.app.R;
import com.nirogpath.app.ui.health.HealthFragment;
import com.nirogpath.app.ui.medications.MedicationsFragment;
import com.nirogpath.app.ui.ai.AiFragment;
import com.nirogpath.app.ui.settings.SettingsFragment;

public class MainActivity extends AppCompatActivity {
    private BottomNavigationView bottomNav;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setOnItemSelectedListener(item -> {
            Fragment fragment;
            int id = item.getItemId();
            if (id == R.id.nav_home) fragment = new DashboardFragment();
            else if (id == R.id.nav_health) fragment = new HealthFragment();
            else if (id == R.id.nav_meds) fragment = new MedicationsFragment();
            else if (id == R.id.nav_ai) fragment = new AiFragment();
            else if (id == R.id.nav_more) fragment = new SettingsFragment();
            else return false;

            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragmentContainer, fragment)
                    .commit();
            return true;
        });

        if (savedInstanceState == null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.fragmentContainer, new DashboardFragment())
                    .commit();
        }
    }
}
