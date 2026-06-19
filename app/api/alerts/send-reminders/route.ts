import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const TIMING_HOURS: Record<string, number> = {
  morning: 8,
  afternoon: 13,
  evening: 18,
  night: 22,
};

export async function GET() {
  try {
    const supabase = await createClient();
    const now = new Date();
    const currentHour = now.getHours();
    const today = now.toISOString().split('T')[0];

    const currentTiming = Object.entries(TIMING_HOURS).find(
      ([, hour]) => currentHour >= hour && currentHour < hour + 2
    )?.[0];

    if (!currentTiming) return NextResponse.json({ message: 'Not a medication time' });

    const { data: meds } = await supabase
      .from('medications')
      .select('id, user_id, name, dosage, timing')
      .eq('is_active', true)
      .contains('timing', [currentTiming]);

    if (!meds?.length) return NextResponse.json({ reminded: 0 });

    const reminders = [];
    for (const med of meds) {
      const { data: log } = await supabase
        .from('medication_logs')
        .select('id, taken')
        .eq('medication_id', med.id)
        .eq('scheduled_date', today)
        .eq('scheduled_time', currentTiming)
        .single();

      if (!log) {
        await supabase.from('medication_logs').insert({
          medication_id: med.id,
          user_id: med.user_id,
          scheduled_time: currentTiming,
          scheduled_date: today,
          taken: false,
        });
        reminders.push({
          user_id: med.user_id,
          alert_type: 'medication_reminder',
          severity: 'info',
          title: '💊 Medication Reminder',
          message: `Time to take your ${med.name} ${med.dosage}`,
        });
      } else if (!log.taken && currentHour >= TIMING_HOURS[currentTiming] + 2) {
        reminders.push({
          user_id: med.user_id,
          alert_type: 'missed_medication',
          severity: 'warning',
          title: '⚠️ Missed Medication',
          message: `You missed your ${med.name} ${med.dosage} ${currentTiming} dose.`,
        });
      }
    }

    if (reminders.length) {
      await supabase.from('alerts').insert(reminders);
    }

    return NextResponse.json({ reminded: reminders.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
