'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/layout/TopBar';
import BPTrendChart from '@/components/charts/BPTrendChart';
import SugarTrendChart from '@/components/charts/SugarTrendChart';
import { formatDate } from '@/lib/utils/formatters';

export default function HealthReportPage() {
  const [profile, setProfile] = useState<any>(null);
  const [bpData, setBpData] = useState<any[]>([]);
  const [sugarData, setSugarData] = useState<any[]>([]);
  const [meds, setMeds] = useState<any[]>([]);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const [profileRes, bpRes, sugarRes, medsRes] = await Promise.all([
        supabase.from('profiles').select('*, patient_profiles(*)').eq('id', user.id).single(),
        supabase.from('health_readings').select('*').eq('user_id', user.id).eq('reading_type', 'bp').gte('recorded_at', since).order('recorded_at'),
        supabase.from('health_readings').select('*').eq('user_id', user.id).eq('reading_type', 'blood_sugar').gte('recorded_at', since).order('recorded_at'),
        supabase.from('medications').select('*').eq('user_id', user.id).eq('is_active', true),
      ]);
      setProfile(profileRes.data);
      setBpData(bpRes.data || []);
      setSugarData(sugarRes.data || []);
      setMeds(medsRes.data || []);
    }
    load();
  }, [period]);

  const avgBP = bpData.length > 0
    ? { sys: Math.round(bpData.reduce((s, r) => s + r.systolic, 0) / bpData.length), dia: Math.round(bpData.reduce((s, r) => s + r.diastolic, 0) / bpData.length) }
    : null;
  const avgSugar = sugarData.length > 0
    ? Math.round(sugarData.reduce((s, r) => s + r.sugar_value, 0) / sugarData.length)
    : null;

  return (
    <div>
      <TopBar title="Health Report 📊" showBack />
      <div className="px-4 py-4 space-y-4" id="health-report">
        <div className="bg-[#1B6B4A] text-white rounded-xl p-4 text-center">
          <div className="text-lg font-semibold">🏥 Show this report to your doctor</div>
          <div className="text-sm opacity-80">यह रिपोर्ट अपने डॉक्टर को दिखाएं</div>
        </div>

        {/* Period */}
        <div className="flex gap-2">
          {(['7d','30d','90d'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${period === p ? 'bg-[#1B6B4A] text-white' : 'bg-white border border-gray-200 text-[#64748B]'}`}>
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>

        {/* Patient Info */}
        {profile && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#1E293B] mb-2">Patient Information</h3>
            <div className="text-sm text-[#64748B] space-y-1">
              <div>Name: <span className="text-[#1E293B] font-medium">{profile.full_name}</span></div>
              <div>Report Period: <span className="text-[#1E293B]">{formatDate(new Date(Date.now() - (period === '7d' ? 7 : period === '30d' ? 30 : 90) * 86400000).toISOString())} — {formatDate(new Date().toISOString())}</span></div>
            </div>
          </div>
        )}

        {/* Averages */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-sm text-[#64748B] mb-1">Avg BP</div>
            <div className="font-mono-health text-2xl font-bold text-[#1E293B]">
              {avgBP ? `${avgBP.sys}/${avgBP.dia}` : '—'}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-sm text-[#64748B] mb-1">Avg Sugar</div>
            <div className="font-mono-health text-2xl font-bold text-[#1E293B]">
              {avgSugar ? `${avgSugar} mg/dL` : '—'}
            </div>
          </div>
        </div>

        {/* BP Chart */}
        {bpData.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#1E293B] mb-3">BP Trend</h3>
            <BPTrendChart readings={bpData} />
          </div>
        )}

        {/* Sugar Chart */}
        {sugarData.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#1E293B] mb-3">Sugar Trend</h3>
            <SugarTrendChart readings={sugarData} />
          </div>
        )}

        {/* Medications */}
        {meds.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#1E293B] mb-2">Current Medications</h3>
            {meds.map(m => (
              <div key={m.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-[#1B6B4A]">💊</span>
                <span className="text-sm text-[#1E293B]">{m.name} {m.dosage} — {m.frequency?.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => window.print()}
          className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-semibold touch-target">
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
