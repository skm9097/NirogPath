import { NextRequest, NextResponse } from 'next/server';
import { callGroqJSON } from '@/lib/ai/groq-client';
import { RISK_ASSESSMENT_PROMPT } from '@/lib/ai/prompts';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const supabase = await createClient();

    const [profileRes, readingsRes, medsRes] = await Promise.all([
      supabase.from('patient_profiles').select('*').eq('user_id', userId).single(),
      supabase.from('health_readings').select('*').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(20),
      supabase.from('medications').select('name, dosage, purpose').eq('user_id', userId).eq('is_active', true),
    ]);

    const context = JSON.stringify({
      patient_profile: profileRes.data,
      recent_readings: readingsRes.data,
      medications: medsRes.data,
    });

    const result = await callGroqJSON(RISK_ASSESSMENT_PROMPT, `Analyze this patient data: ${context}`);

    await supabase.from('ai_consultations').insert({
      user_id: userId,
      consultation_type: 'risk_assessment',
      input_data: { userId, context },
      ai_response: result,
      model_used: 'groq/llama-3.3-70b-versatile',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Risk assessment error:', error);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}
