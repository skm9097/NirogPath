import { NextRequest, NextResponse } from 'next/server';
import { callGroqJSON } from '@/lib/ai/groq-client';
import { DOCTOR_CONSULT_PROMPT } from '@/lib/ai/prompts';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { doctorId, patientData } = await req.json();
    const supabase = await createClient();

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', doctorId).single();
    if (profile?.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized: Doctor role required' }, { status: 403 });
    }

    const result = await callGroqJSON(
      DOCTOR_CONSULT_PROMPT,
      `Patient data for consultation: ${JSON.stringify(patientData)}`
    );

    await supabase.from('doctor_consultations').insert({
      doctor_id: doctorId,
      patient_age: patientData.age,
      patient_gender: patientData.gender,
      systolic: patientData.systolic,
      diastolic: patientData.diastolic,
      fasting_sugar: patientData.fastingSugar,
      pp_sugar: patientData.ppSugar,
      hba1c: patientData.hba1c,
      creatinine: patientData.creatinine,
      current_medications: patientData.medications || [],
      comorbidities: patientData.comorbidities || [],
      ai_treatment_suggestion: result,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Doctor consult error:', error);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}
