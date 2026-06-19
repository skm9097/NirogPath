'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/layout/TopBar';
import { formatDate } from '@/lib/utils/formatters';

export default function DoctorHistoryPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('doctor_consultations').select('*').eq('doctor_id', user.id).order('created_at', { ascending: false }).limit(20);
      setConsultations(data || []);
    }
    load();
  }, []);

  return (
    <div>
      <TopBar title="Past Consultations" showBack />
      <div className="px-4 py-4 space-y-3">
        {consultations.length === 0 ? (
          <div className="text-center py-12 text-[#64748B]">No consultations yet</div>
        ) : (
          consultations.map(c => (
            <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-[#1E293B]">
                  {c.patient_age}yr {c.patient_gender} · BP {c.systolic}/{c.diastolic}
                </div>
                <div className="text-xs text-[#64748B]">{formatDate(c.created_at)}</div>
              </div>
              <div className="text-sm text-[#64748B]">
                {c.fasting_sugar && `FBS: ${c.fasting_sugar}  `}
                {c.hba1c && `HbA1c: ${c.hba1c}%  `}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
