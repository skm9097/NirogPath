'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/layout/TopBar';
import { classifyBP, classifySugar } from '@/lib/constants/health-ranges';
import { formatDate } from '@/lib/utils/formatters';

export default function GuardianPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [patientData, setPatientData] = useState<Record<string, any>>({});
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: guardLinks } = await supabase.from('guardian_links')
        .select('*, patient:patient_id(full_name, phone)')
        .eq('guardian_id', user.id).eq('status', 'active');
      setLinks(guardLinks || []);

      for (const link of guardLinks || []) {
        const [bpRes, sugarRes, medsRes, alertsRes] = await Promise.all([
          supabase.from('health_readings').select('*').eq('user_id', link.patient_id).eq('reading_type', 'bp').order('recorded_at', { ascending: false }).limit(1).single(),
          supabase.from('health_readings').select('*').eq('user_id', link.patient_id).eq('reading_type', 'blood_sugar').order('recorded_at', { ascending: false }).limit(1).single(),
          supabase.from('medications').select('id').eq('user_id', link.patient_id).eq('is_active', true),
          supabase.from('alerts').select('*').eq('user_id', link.patient_id).order('created_at', { ascending: false }).limit(5),
        ]);
        const today = new Date().toISOString().split('T')[0];
        const logsRes = await supabase.from('medication_logs').select('*').eq('user_id', link.patient_id).eq('scheduled_date', today);
        const taken = (logsRes.data || []).filter((l: any) => l.taken).length;
        const totalMeds = (medsRes.data || []).length;
        setPatientData(prev => ({
          ...prev,
          [link.patient_id]: { bp: bpRes.data, sugar: sugarRes.data, taken, totalMeds, alerts: alertsRes.data },
        }));
      }
    }
    load();
  }, []);

  if (links.length === 0) {
    return (
      <div>
        <TopBar title="Guardian Dashboard 👨‍👩‍👧" />
        <div className="px-4 py-12 text-center">
          <div className="text-4xl mb-3">👨‍👩‍👧</div>
          <p className="text-[#64748B] mb-4">You are not monitoring anyone yet</p>
          <Link href="/guardian/add" className="inline-block bg-[#1B6B4A] text-white px-6 py-3 rounded-xl font-semibold">
            Add Patient to Monitor
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar title="Guardian Dashboard 👨‍👩‍👧" />
      <div className="px-4 py-4 space-y-4">
        {links.map(link => {
          const data = patientData[link.patient_id] || {};
          const bpClass = data.bp ? classifyBP(data.bp.systolic, data.bp.diastolic) : null;
          const sugarClass = data.sugar ? classifySugar(data.sugar.sugar_value, data.sugar.sugar_test_type) : null;
          return (
            <div key={link.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-[#1E293B]">{link.guardian_name || link.patient?.full_name}</div>
                  <div className="text-xs text-[#64748B] capitalize">{link.relationship}</div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${link.guardian_phone}`} className="w-9 h-9 rounded-full bg-[#E8F5EE] flex items-center justify-center">
                    <Phone size={16} className="text-[#1B6B4A]" />
                  </a>
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-lg p-3 mb-3">
                <div className="text-xs font-semibold text-[#64748B] mb-2">Today's Status</div>
                <div className="flex gap-4 text-sm">
                  {bpClass && (
                    <div>BP: <span style={{ color: bpClass.color }}>
                      {bpClass.color === '#16A34A' ? '🟢' : '🔴'} {data.bp.systolic}/{data.bp.diastolic}
                    </span></div>
                  )}
                  {sugarClass && (
                    <div>Sugar: <span style={{ color: sugarClass.color }}>
                      {sugarClass.color === '#16A34A' ? '🟢' : '🟡'} {data.sugar.sugar_value}
                    </span></div>
                  )}
                  {data.totalMeds > 0 && (
                    <div>Meds: <span className={data.taken < data.totalMeds ? 'text-[#F59E0B]' : 'text-[#16A34A]'}>
                      {data.taken}/{data.totalMeds} {data.taken < data.totalMeds ? '⚠️' : '✅'}
                    </span></div>
                  )}
                </div>
              </div>

              {data.alerts?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-[#64748B] mb-2">🔔 Recent Alerts</div>
                  <div className="space-y-1">
                    {data.alerts.slice(0, 3).map((alert: any) => (
                      <div key={alert.id} className="text-xs text-[#1E293B] flex items-start gap-1">
                        <span>{alert.severity === 'critical' ? '🔴' : '⚠️'}</span>
                        <span>{formatDate(alert.created_at)} — {alert.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <Link href="/guardian/add" className="flex items-center justify-center gap-2 w-full bg-white border-2 border-dashed border-gray-200 py-4 rounded-xl text-[#64748B] font-medium">
          + Add Another Patient
        </Link>
      </div>
    </div>
  );
}
