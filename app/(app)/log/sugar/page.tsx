'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { classifySugar } from '@/lib/constants/health-ranges';
import TopBar from '@/components/layout/TopBar';
import { toast } from 'sonner';

const TEST_TYPES = [
  { val: 'fasting', label: 'Fasting', labelHi: 'फास्टिंग' },
  { val: 'pp', label: 'After Meal (PP)', labelHi: 'खाने के बाद' },
  { val: 'random', label: 'Random', labelHi: 'रैंडम' },
  { val: 'hba1c', label: 'HbA1c (%)', labelHi: 'HbA1c' },
];

export default function LogSugarPage() {
  const router = useRouter();
  const supabase = createClient();
  const [value, setValue] = useState(100);
  const [testType, setTestType] = useState('fasting');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const isHba1c = testType === 'hba1c';
  const min = isHba1c ? 4 : 40;
  const max = isHba1c ? 15 : 500;
  const { status, label, color, isCrisis } = classifySugar(value, testType);

  async function save() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    const { error } = await supabase.from('health_readings').insert({
      user_id: user.id,
      reading_type: 'blood_sugar',
      sugar_value: value,
      sugar_test_type: testType,
      status,
      notes,
      recorded_at: new Date().toISOString(),
    });
    setLoading(false);
    if (error) { toast.error('Failed to save'); return; }
    toast.success('Sugar reading saved!');
    router.push('/dashboard');
  }

  return (
    <div>
      <TopBar title="Log Blood Sugar" showBack />
      <div className="px-4 py-6 space-y-6">
        {/* Test type */}
        <div className="grid grid-cols-2 gap-2">
          {TEST_TYPES.map(t => (
            <button key={t.val} onClick={() => setTestType(t.val)}
              className={`py-3 px-3 rounded-xl text-sm font-medium border-2 transition-colors touch-target ${
                testType === t.val ? 'bg-[#1B6B4A] text-white border-[#1B6B4A]' : 'bg-white text-[#1E293B] border-gray-200'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Value */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="text-sm text-[#64748B] mb-1">{isHba1c ? 'HbA1c' : 'Blood Sugar'}</div>
          <div className="font-mono-health text-6xl font-bold text-[#1E293B] mb-1">{value}</div>
          <div className="text-sm text-[#64748B] mb-3">{isHba1c ? '%' : 'mg/dL'}</div>
          <input type="range" min={min} max={max} step={isHba1c ? 0.1 : 1} value={value}
            onChange={e => setValue(isHba1c ? parseFloat(e.target.value) : parseInt(e.target.value))}
            className="w-full accent-[#1B6B4A]" />
          <div className="mt-2">
            <input type="number" value={value} min={min} max={max} step={isHba1c ? 0.1 : 1}
              onChange={e => setValue(Math.min(max, Math.max(min, isHba1c ? parseFloat(e.target.value) : parseInt(e.target.value))))}
              className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-center text-lg font-bold outline-none focus:border-[#1B6B4A]" />
          </div>
        </div>

        {/* Status */}
        <div className={`rounded-xl p-4 text-center border-2 ${isCrisis ? 'animate-pulse-danger border-red-300 bg-red-50' : 'bg-white border-gray-100'}`}>
          <div className="text-3xl mb-1">{color === '#16A34A' ? '🟢' : color === '#F59E0B' ? '🟡' : '🔴'}</div>
          <div className="text-xl font-bold" style={{ color }}>{label}</div>
          {isCrisis && (
            <div className="mt-2">
              <p className="text-sm font-semibold text-red-600 mb-2">
                ⚠️ Sugar level is dangerously {value <= 50 ? 'low' : 'high'}. Seek medical help immediately.
              </p>
              <a href="tel:108" className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-bold">📞 Call 108</a>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-2">Notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Before breakfast..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A] resize-none" rows={2} />
        </div>

        <button onClick={save} disabled={loading}
          className="w-full bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 touch-target">
          {loading ? 'Saving...' : '✓ Save Reading'}
        </button>
      </div>
    </div>
  );
}
