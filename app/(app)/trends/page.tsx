'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import BPTrendChart from '@/components/charts/BPTrendChart';
import SugarTrendChart from '@/components/charts/SugarTrendChart';
import AdherenceBarChart from '@/components/charts/AdherenceBarChart';
import TopBar from '@/components/layout/TopBar';
import { useAppStore } from '@/store/useAppStore';

type Period = '7d' | '30d' | '90d';

export default function TrendsPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const [bpData, setBpData] = useState<any[]>([]);
  const [sugarData, setSugarData] = useState<any[]>([]);
  const [adherenceData, setAdherenceData] = useState<any[]>([]);
  const { language } = useAppStore();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const since = new Date(Date.now() - days * 86400000).toISOString();

      const [bpRes, sugarRes] = await Promise.all([
        supabase.from('health_readings').select('*').eq('user_id', user.id).eq('reading_type', 'bp').gte('recorded_at', since).order('recorded_at'),
        supabase.from('health_readings').select('*').eq('user_id', user.id).eq('reading_type', 'blood_sugar').gte('recorded_at', since).order('recorded_at'),
      ]);

      setBpData(bpRes.data || []);
      setSugarData(sugarRes.data || []);

      // Build adherence for last 7 days
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(Date.now() - (6 - i) * 86400000);
        return d.toISOString().split('T')[0];
      });
      const logsRes = await supabase.from('medication_logs').select('*').eq('user_id', user.id).in('scheduled_date', last7);
      const logs = logsRes.data || [];
      const adherence = last7.map(date => {
        const dayLogs = logs.filter((l: any) => l.scheduled_date === date);
        const taken = dayLogs.filter((l: any) => l.taken).length;
        const total = dayLogs.length;
        return {
          day: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
          percent: total > 0 ? Math.round((taken / total) * 100) : 0,
        };
      });
      setAdherenceData(adherence);
    }
    load();
  }, [period]);

  return (
    <div>
      <TopBar title={language === 'hi' ? 'रिपोर्ट' : 'Trends'} showLanguage />
      <div className="px-4 py-4 space-y-6">
        {/* Period selector */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p ? 'bg-[#1B6B4A] text-white' : 'bg-white text-[#64748B] border border-gray-200'
              }`}>
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>

        {/* BP Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#1E293B] font-poppins mb-3">💓 Blood Pressure Trend</h3>
          {bpData.length > 0 ? (
            <BPTrendChart readings={bpData} />
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-[#64748B]">
              No BP data for this period
            </div>
          )}
          <div className="flex gap-4 mt-2 text-xs text-[#64748B]">
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-red-500 inline-block rounded" /> Systolic</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-blue-500 inline-block rounded" /> Diastolic</span>
          </div>
        </div>

        {/* Sugar Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#1E293B] font-poppins mb-3">🩸 Blood Sugar Trend</h3>
          {sugarData.length > 0 ? (
            <SugarTrendChart readings={sugarData} />
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-[#64748B]">
              No sugar data for this period
            </div>
          )}
        </div>

        {/* Adherence */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#1E293B] font-poppins mb-3">💊 Medication Adherence (7 Days)</h3>
          {adherenceData.length > 0 ? (
            <AdherenceBarChart data={adherenceData} />
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-[#64748B]">
              No medication data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
