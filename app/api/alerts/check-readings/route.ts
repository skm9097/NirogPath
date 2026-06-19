import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { classifyBP, classifySugar } from '@/lib/constants/health-ranges';

export async function GET() {
  try {
    const supabase = await createClient();
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { data: readings } = await supabase
      .from('health_readings')
      .select('*')
      .gte('created_at', since);

    if (!readings?.length) return NextResponse.json({ processed: 0 });

    const alerts = [];
    for (const r of readings) {
      if (r.reading_type === 'bp' && r.systolic && r.diastolic) {
        const { isCrisis, status } = classifyBP(r.systolic, r.diastolic);
        if (isCrisis || status === 'very_high') {
          alerts.push({
            user_id: r.user_id,
            alert_type: isCrisis ? 'danger_bp' : 'danger_bp',
            severity: isCrisis ? 'critical' : 'warning',
            title: isCrisis ? '⚠️ DANGER BP' : '⚠️ High BP',
            message: `Your BP ${r.systolic}/${r.diastolic} is ${isCrisis ? 'dangerously high' : 'high'}. ${isCrisis ? 'Call 108 immediately.' : 'Rest and recheck in 30 min.'}`,
            reading_id: r.id,
          });
        }
      }
      if (r.reading_type === 'blood_sugar' && r.sugar_value) {
        const { isCrisis } = classifySugar(r.sugar_value, r.sugar_test_type || 'fasting');
        if (isCrisis) {
          alerts.push({
            user_id: r.user_id,
            alert_type: 'danger_sugar',
            severity: 'critical',
            title: '⚠️ DANGER Sugar',
            message: `Sugar level ${r.sugar_value} mg/dL is dangerously ${r.sugar_value <= 50 ? 'low' : 'high'}. Seek medical help immediately.`,
            reading_id: r.id,
          });
        }
      }
    }

    if (alerts.length) {
      await supabase.from('alerts').insert(alerts);
    }

    return NextResponse.json({ processed: readings.length, alerts: alerts.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
