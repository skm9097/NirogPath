'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function OnboardingStep2() {
  const router = useRouter();
  const supabase = createClient();
  const [condition, setCondition] = useState('');
  const [height, setHeight] = useState(160);
  const [weight, setWeight] = useState(65);
  const [onMeds, setOnMeds] = useState<boolean | null>(null);
  const [diagnosedYear, setDiagnosedYear] = useState('');
  const [loading, setLoading] = useState(false);

  async function next() {
    if (!condition) { toast.error('Please select your condition'); return; }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    await supabase.from('patient_profiles').upsert({
      user_id: user.id,
      height_cm: height,
      weight_kg: weight,
      is_diabetic: condition === 'diabetes' || condition === 'both',
      is_hypertensive: condition === 'hypertension' || condition === 'both',
      diabetes_diagnosed_date: (condition === 'diabetes' || condition === 'both') && diagnosedYear ? `${diagnosedYear}-01-01` : null,
      hypertension_diagnosed_date: (condition === 'hypertension' || condition === 'both') && diagnosedYear ? `${diagnosedYear}-01-01` : null,
    });
    setLoading(false);
    const needsCBAC = condition === 'neither';
    router.push(needsCBAC ? '/onboarding/step-3' : '/onboarding/step-4');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-1.5 w-8 rounded-full ${i <= 2 ? 'bg-[#1B6B4A]' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm text-[#64748B]">Step 2 of 4</span>
      </div>

      <h1 className="text-2xl font-bold text-[#1E293B] font-poppins mb-2">Health Profile</h1>
      <p className="text-base text-[#64748B] mb-6">Has a doctor told you that you have...</p>

      <div className="space-y-3 mb-6">
        {[
          { val: 'hypertension', emoji: '💓', label: 'High Blood Pressure (Hypertension)' },
          { val: 'diabetes', emoji: '🩸', label: 'Diabetes (Sugar)' },
          { val: 'both', emoji: '⚕️', label: 'Both' },
          { val: 'neither', emoji: '❓', label: "Neither / I don't know" },
        ].map((c) => (
          <button
            key={c.val}
            onClick={() => setCondition(c.val)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors touch-target text-left ${
              condition === c.val ? 'bg-[#E8F5EE] border-[#1B6B4A]' : 'bg-white border-gray-200'
            }`}
          >
            <span className="text-2xl">{c.emoji}</span>
            <span className="font-medium text-[#1E293B]">{c.label}</span>
          </button>
        ))}
      </div>

      {(condition === 'hypertension' || condition === 'diabetes' || condition === 'both') && (
        <div className="mb-6">
          <label className="text-sm font-medium text-[#1E293B] block mb-1">Year first diagnosed (approx)</label>
          <input
            type="number"
            min="1970"
            max={new Date().getFullYear()}
            value={diagnosedYear}
            onChange={e => setDiagnosedYear(e.target.value)}
            placeholder="e.g. 2018"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="text-sm font-medium text-[#1E293B] block mb-2">
          Height: <span className="text-[#1B6B4A] font-bold">{height} cm</span>
        </label>
        <input type="range" min="140" max="200" value={height} onChange={e => setHeight(+e.target.value)}
          className="w-full accent-[#1B6B4A]" />
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-[#1E293B] block mb-2">
          Weight: <span className="text-[#1B6B4A] font-bold">{weight} kg</span>
        </label>
        <input type="range" min="30" max="150" value={weight} onChange={e => setWeight(+e.target.value)}
          className="w-full accent-[#1B6B4A]" />
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-[#1E293B] block mb-2">
          Are you currently taking any medication?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[{ val: true, label: 'Yes' }, { val: false, label: 'No' }].map(o => (
            <button
              key={String(o.val)}
              onClick={() => setOnMeds(o.val)}
              className={`py-3 rounded-xl font-medium border-2 transition-colors touch-target ${
                onMeds === o.val ? 'bg-[#1B6B4A] text-white border-[#1B6B4A]' : 'bg-white text-[#1E293B] border-gray-200'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={next} disabled={loading}
        className="w-full bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 touch-target">
        {loading ? 'Saving...' : 'Next →'}
      </button>
    </div>
  );
}
