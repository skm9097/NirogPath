'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/layout/TopBar';
import { toast } from 'sonner';

export default function AddGuardianPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ name: '', phone: '', relationship: '' });
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!form.name || !form.phone) { toast.error('Please enter name and phone'); return; }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    const { error } = await supabase.from('guardian_links').insert({
      patient_id: user.id,
      guardian_id: user.id,
      guardian_phone: '+91' + form.phone,
      guardian_name: form.name,
      relationship: form.relationship || 'other',
      status: 'active',
    });
    setLoading(false);
    if (error) { toast.error('Failed to add guardian'); return; }
    toast.success('Guardian added!');
    router.push('/guardian');
  }

  return (
    <div>
      <TopBar title="Add Guardian" showBack />
      <div className="px-4 py-6 space-y-4">
        <div className="bg-[#E8F5EE] rounded-xl p-4 text-sm text-[#1B6B4A]">
          👨‍👩‍👧 Your guardian will receive alerts if your readings are dangerous or you miss medications.
        </div>
        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-1">Guardian's Name *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Priya Devi" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]" />
        </div>
        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-1">Mobile Number *</label>
          <div className="flex gap-2">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm font-medium">🇮🇳 +91</div>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g,'').slice(0,10) }))}
              placeholder="10-digit mobile" inputMode="numeric"
              className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-2">Relationship</label>
          <div className="grid grid-cols-3 gap-2">
            {['son','daughter','spouse','sibling','parent','other'].map(r => (
              <button key={r} onClick={() => setForm(f => ({ ...f, relationship: r }))}
                className={`py-2.5 rounded-lg text-sm font-medium border-2 capitalize ${
                  form.relationship === r ? 'bg-[#1B6B4A] text-white border-[#1B6B4A]' : 'bg-white text-[#1E293B] border-gray-200'
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <button onClick={save} disabled={loading}
          className="w-full bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 touch-target">
          {loading ? 'Adding...' : '+ Add Guardian'}
        </button>
      </div>
    </div>
  );
}
