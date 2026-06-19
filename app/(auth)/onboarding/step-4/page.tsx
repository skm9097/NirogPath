'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function OnboardingStep4() {
  const router = useRouter();
  const supabase = createClient();
  const [guardian, setGuardian] = useState({ name: '', phone: '', relationship: '' });
  const [enableReminders, setEnableReminders] = useState(true);
  const [loading, setLoading] = useState(false);

  async function finish() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    if (guardian.name && guardian.phone) {
      await supabase.from('guardian_links').insert({
        patient_id: user.id,
        guardian_id: user.id,
        guardian_phone: '+91' + guardian.phone,
        guardian_name: guardian.name,
        relationship: guardian.relationship || 'other',
        status: 'active',
      });
    }

    await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id);
    setLoading(false);
    toast.success('Setup complete! Welcome to NirogPath');
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-1.5 w-8 rounded-full bg-[#1B6B4A]" />
          ))}
        </div>
        <span className="text-sm text-[#64748B]">Step 4 of 4</span>
      </div>

      <h1 className="text-2xl font-bold text-[#1E293B] font-poppins mb-6">Setup Complete (Optional)</h1>

      {/* Guardian */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <h3 className="font-semibold text-[#1E293B] mb-1">👨‍👩‍👧 Add a Family Guardian</h3>
        <p className="text-xs text-[#64748B] mb-3">They'll get alerts if something looks wrong with your health</p>
        <div className="space-y-3">
          <input value={guardian.name} onChange={e => setGuardian(g => ({ ...g, name: e.target.value }))}
            placeholder="Guardian's name" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]" />
          <input value={guardian.phone} onChange={e => setGuardian(g => ({ ...g, phone: e.target.value.replace(/\D/g,'').slice(0,10) }))}
            placeholder="Their mobile number" inputMode="numeric"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]" />
          <select value={guardian.relationship} onChange={e => setGuardian(g => ({ ...g, relationship: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A] bg-white">
            <option value="">Relationship</option>
            {['son','daughter','spouse','sibling','parent','friend','other'].map(r => (
              <option key={r} value={r} className="capitalize">{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#1E293B]">🔔 Enable Daily Reminders</h3>
            <p className="text-xs text-[#64748B]">Get notified to take your medications</p>
          </div>
          <button
            onClick={() => setEnableReminders(v => !v)}
            className={`w-12 h-6 rounded-full transition-colors ${enableReminders ? 'bg-[#1B6B4A]' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow mx-0.5 transition-transform ${enableReminders ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <button onClick={finish} disabled={loading}
        className="w-full bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 touch-target mb-3">
        {loading ? 'Setting up...' : '🎉 Go to Dashboard'}
      </button>
      <button onClick={() => { supabase.from('profiles').update({ onboarding_complete: true }); router.push('/dashboard'); }}
        className="w-full text-sm text-[#64748B] py-2">
        Skip for now
      </button>
    </div>
  );
}
