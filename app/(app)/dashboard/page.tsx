'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BPStatusCard, SugarStatusCard } from '@/components/dashboard/HealthStatusCard';
import MedicationTodayCard from '@/components/dashboard/MedicationTodayCard';
import NextFollowupCard from '@/components/dashboard/NextFollowupCard';
import QuickLogFAB from '@/components/dashboard/QuickLogFAB';
import TopBar from '@/components/layout/TopBar';
import { getGreeting } from '@/lib/utils/formatters';
import { useAppStore } from '@/store/useAppStore';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [latestBP, setLatestBP] = useState<any>(null);
  const [latestSugar, setLatestSugar] = useState<any>(null);
  const [todayMeds, setTodayMeds] = useState<any[]>([]);
  const [followups, setFollowups] = useState<any[]>([]);
  const [aiTip, setAiTip] = useState('');
  const { language } = useAppStore();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, bpRes, sugarRes, medsRes, followupRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('health_readings').select('*').eq('user_id', user.id).eq('reading_type', 'bp').order('recorded_at', { ascending: false }).limit(1).single(),
        supabase.from('health_readings').select('*').eq('user_id', user.id).eq('reading_type', 'blood_sugar').order('recorded_at', { ascending: false }).limit(1).single(),
        supabase.from('medications').select('*').eq('user_id', user.id).eq('is_active', true),
        supabase.from('followups').select('*').eq('user_id', user.id).eq('completed', false).order('scheduled_date').limit(2),
      ]);

      setProfile(profileRes.data);
      setLatestBP(bpRes.data);
      setLatestSugar(sugarRes.data);
      setFollowups(followupRes.data || []);

      if (medsRes.data) {
        const today = new Date().toISOString().split('T')[0];
        const hour = new Date().getHours();
        const timing = hour < 12 ? 'morning' : hour < 16 ? 'afternoon' : hour < 20 ? 'evening' : 'night';
        const logsRes = await supabase.from('medication_logs').select('*').eq('user_id', user.id).eq('scheduled_date', today);
        const logs = logsRes.data || [];
        const meds = medsRes.data.map((m: any) => ({
          id: m.id,
          name: m.name,
          dosage: m.dosage,
          timing,
          taken: logs.some((l: any) => l.medication_id === m.id && l.taken),
        }));
        setTodayMeds(meds);
      }

      try {
        const tipRes = await fetch('/api/ai/lifestyle-advice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Give me a short health tip for today', language }),
        });
        const tipData = await tipRes.json();
        setAiTip(tipData.response?.split('\n')[0] || '');
      } catch {}
    }
    load();
  }, []);

  async function toggleMed(id: string, taken: boolean) {
    const today = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();
    const timing = hour < 12 ? 'morning' : hour < 16 ? 'afternoon' : hour < 20 ? 'evening' : 'night';
    await supabase.from('medication_logs').upsert({
      medication_id: id,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      scheduled_date: today,
      scheduled_time: timing,
      taken,
      taken_at: taken ? new Date().toISOString() : null,
    }, { onConflict: 'medication_id,scheduled_date,scheduled_time' });
    setTodayMeds(prev => prev.map(m => m.id === id ? { ...m, taken } : m));
  }

  return (
    <div>
      <TopBar showBell showLanguage />
      <div className="px-4 pt-4 space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1E293B] font-poppins">
            {getGreeting(profile?.full_name?.split(' ')[0] || 'there', language)}
          </h1>
          <p className="text-sm text-[#64748B]">
            {language === 'hi' ? 'आज की सेहत' : 'Your Health Today'}
          </p>
        </div>

        {/* BP + Sugar cards */}
        {(latestBP || latestSugar) && (
          <div className="flex gap-3">
            {latestBP ? (
              <BPStatusCard systolic={latestBP.systolic} diastolic={latestBP.diastolic}
                recordedAt={latestBP.recorded_at} language={language} />
            ) : (
              <Link href="/log/bp" className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-dashed border-gray-200 flex items-center justify-center">
                <span className="text-sm text-[#64748B]">+ Log BP</span>
              </Link>
            )}
            {latestSugar ? (
              <SugarStatusCard value={latestSugar.sugar_value} testType={latestSugar.sugar_test_type}
                recordedAt={latestSugar.recorded_at} language={language} />
            ) : (
              <Link href="/log/sugar" className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-dashed border-gray-200 flex items-center justify-center">
                <span className="text-sm text-[#64748B]">+ Log Sugar</span>
              </Link>
            )}
          </div>
        )}

        {!latestBP && !latestSugar && (
          <div className="bg-[#E8F5EE] rounded-xl p-4 border border-[#1B6B4A]/20">
            <p className="text-sm font-medium text-[#1B6B4A]">
              👋 {language === 'hi' ? 'अपना पहला रीडिंग लॉग करें' : 'Log your first reading to get started'}
            </p>
            <div className="flex gap-2 mt-2">
              <Link href="/log/bp" className="flex-1 text-center bg-[#1B6B4A] text-white text-sm py-2 rounded-lg font-medium">Log BP</Link>
              <Link href="/log/sugar" className="flex-1 text-center bg-[#1B6B4A] text-white text-sm py-2 rounded-lg font-medium">Log Sugar</Link>
            </div>
          </div>
        )}

        {/* Medications */}
        {todayMeds.length > 0 && (
          <MedicationTodayCard medications={todayMeds} onToggle={toggleMed} language={language} />
        )}

        {/* Trends mini */}
        <Link href="/trends" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 block">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1E293B] font-poppins">📈 7-Day Trend</h3>
            <span className="text-xs text-[#1B6B4A] font-medium">See all →</span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            {language === 'hi' ? 'पूरी रिपोर्ट देखें' : 'View detailed BP & Sugar charts'}
          </p>
        </Link>

        {/* Followups */}
        {followups.length > 0 && <NextFollowupCard followups={followups} language={language} />}

        {/* AI tip */}
        {aiTip && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#1E293B] font-poppins mb-2">🤖 AI Health Tip</h3>
            <p className="text-sm text-[#1E293B] leading-relaxed">{aiTip}</p>
            <Link href="/ai-assistant" className="text-xs text-[#1B6B4A] font-medium mt-2 block">
              Ask AI more →
            </Link>
          </div>
        )}
      </div>
      <QuickLogFAB />
    </div>
  );
}
