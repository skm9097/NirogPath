'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/layout/TopBar';
import CascadeFunnel from '@/components/charts/CascadeFunnel';

export default function CommunityPage() {
  const [stats, setStats] = useState<any>(null);
  const [pincode, setPincode] = useState('');
  const [userPincode, setUserPincode] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('pincode').eq('id', user.id).single();
      const pc = profile?.pincode || '110001';
      setUserPincode(pc);
      setPincode(pc);
      const { data } = await supabase.from('community_stats').select('*').eq('pincode', pc).order('date', { ascending: false }).limit(1).single();
      setStats(data);
    }
    load();
  }, []);

  const mockStats = stats || {
    screened: 342, diagnosed: 268, on_treatment: 194, controlled: 127,
    uncontrolled: 67, missed_followup: 41,
  };

  return (
    <div>
      <TopBar title="Community Health 🏘️" showLanguage />
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-lg font-semibold text-[#1E293B] font-poppins">Pincode: {userPincode}</div>
            <div className="text-sm text-[#64748B]">NCD Health Dashboard</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#1E293B] font-poppins mb-4">NCD Care Cascade</h3>
          <CascadeFunnel data={mockStats} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#FEF3C7] rounded-xl p-3 border border-amber-200">
            <div className="text-2xl font-bold text-amber-600">{mockStats.uncontrolled}</div>
            <div className="text-sm text-amber-700">Uncontrolled</div>
          </div>
          <div className="bg-[#FEE2E2] rounded-xl p-3 border border-red-200">
            <div className="text-2xl font-bold text-red-600">{mockStats.missed_followup}</div>
            <div className="text-sm text-red-700">Missed Follow-up</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 text-xs text-[#64748B] text-center">
          🔒 This data is 100% anonymized. No personal information is shared.
        </div>
      </div>
    </div>
  );
}
