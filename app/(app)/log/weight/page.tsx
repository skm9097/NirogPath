'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/layout/TopBar';
import { toast } from 'sonner';

export default function LogWeightPage() {
  const router = useRouter();
  const supabase = createClient();
  const [weight, setWeight] = useState(65);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    await supabase.from('health_readings').insert({
      user_id: user.id,
      reading_type: 'weight',
      weight_kg: weight,
      status: 'normal',
      recorded_at: new Date().toISOString(),
    });
    setLoading(false);
    toast.success('Weight saved!');
    router.push('/dashboard');
  }

  return (
    <div>
      <TopBar title="Log Weight" showBack />
      <div className="px-4 py-6 space-y-6">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="text-sm text-[#64748B] mb-2">Weight</div>
          <div className="font-mono-health text-7xl font-bold text-[#1E293B] mb-1">{weight}</div>
          <div className="text-lg text-[#64748B] mb-4">kg</div>
          <input type="range" min="30" max="150" value={weight} onChange={e => setWeight(+e.target.value)} className="w-full accent-[#1B6B4A]" />
          <div className="mt-3">
            <input type="number" value={weight} min={30} max={150}
              onChange={e => setWeight(Math.min(150, Math.max(30, +e.target.value)))}
              className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-center text-xl font-bold outline-none focus:border-[#1B6B4A]" />
          </div>
        </div>
        <button onClick={save} disabled={loading}
          className="w-full bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 touch-target">
          {loading ? 'Saving...' : '✓ Save Weight'}
        </button>
      </div>
    </div>
  );
}
