-- NirogPath Database Schema
-- Run this in your Supabase SQL editor

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  language TEXT DEFAULT 'hi' CHECK (language IN ('en', 'hi')),
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'guardian', 'community_anchor')),
  city TEXT,
  state TEXT,
  pincode TEXT,
  avatar_url TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE patient_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  blood_group TEXT,
  is_diabetic BOOLEAN DEFAULT FALSE,
  is_hypertensive BOOLEAN DEFAULT FALSE,
  diabetes_type TEXT CHECK (diabetes_type IN ('type1', 'type2', 'gestational', 'prediabetes', NULL)),
  diabetes_diagnosed_date DATE,
  hypertension_diagnosed_date DATE,
  smoking_status TEXT CHECK (smoking_status IN ('never', 'former', 'current')),
  alcohol_status TEXT CHECK (alcohol_status IN ('never', 'occasional', 'regular')),
  family_history_diabetes BOOLEAN DEFAULT FALSE,
  family_history_hypertension BOOLEAN DEFAULT FALSE,
  family_history_heart_disease BOOLEAN DEFAULT FALSE,
  other_conditions TEXT[],
  allergies TEXT[],
  cbac_score INTEGER,
  risk_level TEXT CHECK (risk_level IN ('low', 'moderate', 'high', 'very_high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE health_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reading_type TEXT NOT NULL CHECK (reading_type IN ('bp', 'blood_sugar', 'weight', 'heart_rate')),
  systolic INTEGER,
  diastolic INTEGER,
  sugar_value NUMERIC,
  sugar_test_type TEXT CHECK (sugar_test_type IN ('fasting', 'pp', 'random', 'hba1c')),
  weight_kg NUMERIC,
  heart_rate_bpm INTEGER,
  status TEXT CHECK (status IN ('normal', 'borderline', 'high', 'very_high', 'low', 'critical')),
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_readings_user_type ON health_readings(user_id, reading_type, recorded_at DESC);

CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  generic_name TEXT,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  timing TEXT[] NOT NULL,
  purpose TEXT,
  prescribed_by TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_time TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  taken BOOLEAN DEFAULT FALSE,
  taken_at TIMESTAMPTZ,
  skipped_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(medication_id, scheduled_date, scheduled_time)
);

CREATE TABLE guardian_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guardian_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guardian_phone TEXT NOT NULL,
  guardian_name TEXT NOT NULL,
  relationship TEXT CHECK (relationship IN ('son', 'daughter', 'spouse', 'sibling', 'parent', 'friend', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'revoked')),
  alert_on_missed_meds BOOLEAN DEFAULT TRUE,
  alert_on_danger_reading BOOLEAN DEFAULT TRUE,
  alert_on_missed_followup BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES profiles(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'danger_bp', 'danger_sugar', 'missed_medication',
    'missed_followup', 'borderline_trend', 'medication_reminder',
    'followup_reminder', 'weekly_summary'
  )),
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reading_id UUID REFERENCES health_readings(id),
  is_read BOOLEAN DEFAULT FALSE,
  sent_via TEXT[] DEFAULT '{"push"}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  consultation_type TEXT NOT NULL CHECK (consultation_type IN (
    'risk_assessment', 'treatment_suggestion', 'medication_review',
    'lifestyle_advice', 'referral_recommendation', 'doctor_decision_support'
  )),
  input_data JSONB NOT NULL,
  ai_response JSONB NOT NULL,
  model_used TEXT DEFAULT 'groq/llama-3.3-70b-versatile',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  followup_type TEXT CHECK (followup_type IN ('doctor_visit', 'lab_test', 'screening')),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  reminder_days_before INTEGER[] DEFAULT '{3, 1, 0}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE doctor_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  patient_age INTEGER NOT NULL,
  patient_gender TEXT,
  systolic INTEGER,
  diastolic INTEGER,
  fasting_sugar NUMERIC,
  pp_sugar NUMERIC,
  hba1c NUMERIC,
  creatinine NUMERIC,
  current_medications TEXT[],
  comorbidities TEXT[],
  ai_risk_assessment TEXT,
  ai_treatment_suggestion JSONB,
  ai_referral_recommendation TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE community_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anchor_id UUID REFERENCES profiles(id),
  pincode TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  total_users INTEGER DEFAULT 0,
  screened INTEGER DEFAULT 0,
  diagnosed INTEGER DEFAULT 0,
  on_treatment INTEGER DEFAULT 0,
  controlled INTEGER DEFAULT 0,
  uncontrolled INTEGER DEFAULT 0,
  missed_followup INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pincode, date)
);

CREATE TABLE cbac_screenings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  age_group TEXT,
  smoking BOOLEAN DEFAULT FALSE,
  alcohol BOOLEAN DEFAULT FALSE,
  waist_female_above_80 BOOLEAN,
  waist_male_above_90 BOOLEAN,
  physical_activity_less_150min BOOLEAN DEFAULT FALSE,
  family_history_diabetes BOOLEAN DEFAULT FALSE,
  family_history_hypertension BOOLEAN DEFAULT FALSE,
  family_history_heart BOOLEAN DEFAULT FALSE,
  total_score INTEGER NOT NULL,
  risk_category TEXT CHECK (risk_category IN ('low', 'moderate', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users see own health profile" ON patient_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own readings" ON health_readings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own medications" ON medications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own med logs" ON medication_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own guardian links" ON guardian_links FOR ALL USING (auth.uid() = patient_id OR auth.uid() = guardian_id);
CREATE POLICY "Users see own alerts" ON alerts FOR ALL USING (auth.uid() = user_id OR auth.uid() = target_user_id);

CREATE POLICY "Guardians see patient readings" ON health_readings FOR SELECT
  USING (
    user_id IN (
      SELECT patient_id FROM guardian_links
      WHERE guardian_id = auth.uid() AND status = 'active'
    )
  );
