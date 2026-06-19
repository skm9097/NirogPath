'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/layout/TopBar';
import { toast } from 'sonner';

export default function MedicationsPage() {
  const [meds, setMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('medications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setMeds(data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('medications').update({ is_active: !current }).eq('id', id);
    setMeds(prev => prev.map(m => m.id === id ? { ...m, is_active: !current } : m));
    toast.success(current ? 'Medication deactivated' : 'Medication reactivated');
  }

  const active = meds.filter(m => m.is_active);
  const inactive = meds.filter(m => !m.is_active);

  return (
    <div>
      <TopBar title="Medications 💊" />
      <div className="px-4 py-4">
        <Link href="/medications/add"
          className="flex items-center justify-center gap-2 w-full bg-[#1B6B4A] text-white py-3 rounded-xl font-semibold mb-6 touch-target">
          <Plus size={20} /> Add Medication
        </Link>

        {loading ? (
          <div className="text-center text-[#64748B] py-8">Loading...</div>
        ) : meds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💊</div>
            <p className="text-[#64748B]">No medications added yet</p>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-3">Active</h3>
                <div className="space-y-3">
                  {active.map(med => (
                    <div key={med.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-[#1E293B]">{med.name} {med.dosage}</div>
                          <div className="text-sm text-[#64748B] capitalize">{med.frequency?.replace('_', ' ')} · {med.timing?.join(', ')}</div>
                          {med.purpose && <div className="text-xs text-[#1B6B4A] mt-0.5 capitalize">{med.purpose?.replace('_', ' ')}</div>}
                        </div>
                        <button onClick={() => toggleActive(med.id, true)} className="text-gray-400 hover:text-red-500 p-1">
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {inactive.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-3">Inactive</h3>
                <div className="space-y-3">
                  {inactive.map(med => (
                    <div key={med.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 opacity-60">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-[#64748B] line-through">{med.name} {med.dosage}</div>
                        </div>
                        <button onClick={() => toggleActive(med.id, false)} className="text-[#1B6B4A] text-xs font-medium">
                          Reactivate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
