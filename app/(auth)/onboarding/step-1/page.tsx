'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const INDIAN_STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

export default function OnboardingStep1() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ full_name: '', date_of_birth: '', gender: '', city: '', state: '', language: 'hi' });
  const [loading, setLoading] = useState(false);

  async function next() {
    if (!form.full_name || !form.gender) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      phone: user.phone || '',
      full_name: form.full_name,
      date_of_birth: form.date_of_birth || null,
      gender: form.gender,
      city: form.city,
      state: form.state,
      language: form.language,
      onboarding_complete: false,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    router.push('/onboarding/step-2');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-1.5 w-8 rounded-full ${i === 1 ? 'bg-[#1B6B4A]' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm text-[#64748B]">Step 1 of 4</span>
      </div>

      <h1 className="text-2xl font-bold text-[#1E293B] font-poppins mb-6">Basic Information</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-1">Full Name *</label>
          <input
            value={form.full_name}
            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
            placeholder="Your full name"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-1">Date of Birth</label>
          <input
            type="date"
            value={form.date_of_birth}
            onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
            defaultValue="1980-01-01"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-2">Gender *</label>
          <div className="grid grid-cols-3 gap-2">
            {['male', 'female', 'other'].map(g => (
              <button
                key={g}
                onClick={() => setForm(f => ({ ...f, gender: g }))}
                className={`py-3 rounded-xl font-medium capitalize text-sm border-2 transition-colors touch-target ${
                  form.gender === g ? 'bg-[#1B6B4A] text-white border-[#1B6B4A]' : 'bg-white text-[#1E293B] border-gray-200'
                }`}
              >
                {g === 'male' ? '👨 Male' : g === 'female' ? '👩 Female' : '🧑 Other'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-1">City</label>
          <input
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            placeholder="Your city"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-1">State</label>
          <select
            value={form.state}
            onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A] bg-white"
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-2">Language Preference</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ val: 'hi', label: 'हिन्दी' }, { val: 'en', label: 'English' }].map(l => (
              <button
                key={l.val}
                onClick={() => setForm(f => ({ ...f, language: l.val }))}
                className={`py-3 rounded-xl font-medium text-sm border-2 transition-colors touch-target ${
                  form.language === l.val ? 'bg-[#1B6B4A] text-white border-[#1B6B4A]' : 'bg-white text-[#1E293B] border-gray-200'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={next}
        disabled={loading}
        className="w-full mt-8 bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 touch-target"
      >
        {loading ? 'Saving...' : 'Next →'}
      </button>
    </div>
  );
}
