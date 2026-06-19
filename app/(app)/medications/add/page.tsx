'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { COMMON_NCD_MEDICATIONS } from '@/lib/constants/medications-db';
import TopBar from '@/components/layout/TopBar';
import { toast } from 'sonner';

const FREQUENCIES = [
  { val: 'once_daily', label: 'Once Daily' },
  { val: 'twice_daily', label: 'Twice Daily' },
  { val: 'thrice_daily', label: 'Thrice Daily' },
  { val: 'as_needed', label: 'As Needed' },
];

const TIMINGS = ['morning', 'afternoon', 'evening', 'night'];

export default function AddMedicationPage() {
  const router = useRouter();
  const supabase = createClient();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('once_daily');
  const [timing, setTiming] = useState<string[]>(['morning']);
  const [purpose, setPurpose] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('');
  const [loading, setLoading] = useState(false);

  const filtered = COMMON_NCD_MEDICATIONS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 6);

  async function save() {
    if (!selected && !search) { toast.error('Please select a medication'); return; }
    if (!dosage) { toast.error('Please enter dosage'); return; }
    if (!timing.length) { toast.error('Please select at least one timing'); return; }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    const { error } = await supabase.from('medications').insert({
      user_id: user.id,
      name: selected?.name || search,
      generic_name: selected?.generic || null,
      dosage,
      frequency,
      timing,
      purpose: purpose || selected?.purpose || null,
      prescribed_by: prescribedBy || null,
      is_active: true,
      start_date: new Date().toISOString().split('T')[0],
    });
    setLoading(false);
    if (error) { toast.error('Failed to save'); return; }
    toast.success('Medication added!');
    router.push('/medications');
  }

  return (
    <div>
      <TopBar title="Add Medication" showBack />
      <div className="px-4 py-4 space-y-5">
        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-2">Search Medication</label>
          <input value={search} onChange={e => { setSearch(e.target.value); setSelected(null); }}
            placeholder="Type medication name..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]" />
          {search && !selected && (
            <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {filtered.map(m => (
                <button key={m.name} onClick={() => { setSelected(m); setSearch(m.name); setDosage(m.dosages[0]); setPurpose(m.purpose); }}
                  className="w-full px-4 py-3 text-left hover:bg-[#E8F5EE] border-b border-gray-100 last:border-0">
                  <div className="font-medium text-[#1E293B]">{m.name}</div>
                  <div className="text-xs text-[#64748B]">{m.category} · {m.dosages.join(', ')}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div>
            <label className="text-sm font-medium text-[#1E293B] block mb-2">Dosage</label>
            <div className="flex flex-wrap gap-2">
              {selected.dosages.map((d: string) => (
                <button key={d} onClick={() => setDosage(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    dosage === d ? 'bg-[#1B6B4A] text-white border-[#1B6B4A]' : 'bg-white text-[#1E293B] border-gray-200'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {!selected && (
          <div>
            <label className="text-sm font-medium text-[#1E293B] block mb-1">Dosage</label>
            <input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g. 5mg"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]" />
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-2">Frequency</label>
          <div className="grid grid-cols-2 gap-2">
            {FREQUENCIES.map(f => (
              <button key={f.val} onClick={() => setFrequency(f.val)}
                className={`py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                  frequency === f.val ? 'bg-[#1B6B4A] text-white border-[#1B6B4A]' : 'bg-white text-[#1E293B] border-gray-200'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-2">When to take</label>
          <div className="grid grid-cols-2 gap-2">
            {TIMINGS.map(t => (
              <button key={t} onClick={() => setTiming(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                className={`py-2.5 rounded-lg text-sm font-medium border-2 transition-colors capitalize ${
                  timing.includes(t) ? 'bg-[#1B6B4A] text-white border-[#1B6B4A]' : 'bg-white text-[#1E293B] border-gray-200'
                }`}>
                {t === 'morning' ? '🌅 Morning' : t === 'afternoon' ? '☀️ Afternoon' : t === 'evening' ? '🌆 Evening' : '🌙 Night'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-1">Prescribed by (optional)</label>
          <input value={prescribedBy} onChange={e => setPrescribedBy(e.target.value)} placeholder="Doctor's name"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]" />
        </div>

        <button onClick={save} disabled={loading}
          className="w-full bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 touch-target">
          {loading ? 'Saving...' : '+ Add Medication'}
        </button>
      </div>
    </div>
  );
}
