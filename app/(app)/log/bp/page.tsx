'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { classifyBP } from '@/lib/constants/health-ranges';
import TopBar from '@/components/layout/TopBar';
import { toast } from 'sonner';

export default function LogBPPage() {
  const router = useRouter();
  const supabase = createClient();
  const [sys, setSys] = useState(120);
  const [dia, setDia] = useState(80);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { status, label, color, isCrisis } = classifyBP(sys, dia);

  async function save() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    const { error } = await supabase.from('health_readings').insert({
      user_id: user.id,
      reading_type: 'bp',
      systolic: sys,
      diastolic: dia,
      status,
      notes,
      recorded_at: new Date().toISOString(),
    });
    setLoading(false);
    if (error) { toast.error('Failed to save'); return; }
    toast.success('BP reading saved!');
    router.push('/dashboard');
  }

  return (
    <div>
      <TopBar title="Log Blood Pressure" showBack />
      <div className="px-4 py-6 space-y-6">
        {/* Systolic */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="text-sm text-[#64748B] mb-1">Systolic (SYS)</div>
          <div className="font-mono-health text-6xl font-bold text-[#1E293B] mb-1">{sys}</div>
          <div className="text-sm text-[#64748B] mb-3">mmHg</div>
          <input type="range" min="70" max="220" value={sys} onChange={e => setSys(+e.target.value)}
            className="w-full accent-[#1B6B4A]" />
          <div className="mt-2">
            <input type="number" value={sys} onChange={e => setSys(Math.min(220, Math.max(70, +e.target.value)))}
              className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-center text-lg font-bold outline-none focus:border-[#1B6B4A]" />
          </div>
        </div>

        {/* Diastolic */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="text-sm text-[#64748B] mb-1">Diastolic (DIA)</div>
          <div className="font-mono-health text-6xl font-bold text-[#1E293B] mb-1">{dia}</div>
          <div className="text-sm text-[#64748B] mb-3">mmHg</div>
          <input type="range" min="40" max="140" value={dia} onChange={e => setDia(+e.target.value)}
            className="w-full accent-[#1B6B4A]" />
          <div className="mt-2">
            <input type="number" value={dia} onChange={e => setDia(Math.min(140, Math.max(40, +e.target.value)))}
              className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-center text-lg font-bold outline-none focus:border-[#1B6B4A]" />
          </div>
        </div>

        {/* Status */}
        <div className={`rounded-xl p-4 text-center border-2 ${isCrisis ? 'animate-pulse-danger border-red-300 bg-red-50' : 'bg-white border-gray-100'}`}
          style={{ borderColor: isCrisis ? undefined : color }}>
          <div className="text-3xl mb-1">{color === '#16A34A' ? '🟢' : color === '#F59E0B' ? '🟡' : color === '#F97316' ? '🟠' : '🔴'}</div>
          <div className="text-xl font-bold" style={{ color }}>{label}</div>
          {isCrisis && (
            <div className="mt-2">
              <p className="text-sm font-semibold text-red-600 mb-2">
                ⚠️ This reading is dangerously high. Please visit the nearest health facility or call 108 immediately.
              </p>
              <a href="tel:108" className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-bold">
                📞 Call 108
              </a>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-[#1E293B] block mb-2">Notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="e.g. After morning walk..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A] resize-none"
            rows={2} />
        </div>

        <button onClick={save} disabled={loading}
          className="w-full bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 touch-target">
          {loading ? 'Saving...' : '✓ Save Reading'}
        </button>
      </div>
    </div>
  );
}
