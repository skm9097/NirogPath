'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

const COMORBIDITIES = ['CKD', 'CAD', 'Stroke', 'Obesity', 'Thyroid', 'Heart Failure', 'COPD'];

export default function DoctorConsultPage() {
  const { profile } = useAppStore();
  const [form, setForm] = useState({
    age: '', gender: 'male', systolic: '', diastolic: '',
    fastingSugar: '', ppSugar: '', hba1c: '', creatinine: '',
  });
  const [medications, setMedications] = useState<string[]>([]);
  const [medInput, setMedInput] = useState('');
  const [comorbidities, setComorbidities] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function consult() {
    if (!form.age) { toast.error('Please enter patient age'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/ai/doctor-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: profile?.id,
          patientData: {
            age: parseInt(form.age),
            gender: form.gender,
            systolic: form.systolic ? parseInt(form.systolic) : null,
            diastolic: form.diastolic ? parseInt(form.diastolic) : null,
            fastingSugar: form.fastingSugar ? parseFloat(form.fastingSugar) : null,
            ppSugar: form.ppSugar ? parseFloat(form.ppSugar) : null,
            hba1c: form.hba1c ? parseFloat(form.hba1c) : null,
            creatinine: form.creatinine ? parseFloat(form.creatinine) : null,
            medications,
            comorbidities,
          },
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      toast.error('AI service unavailable');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <TopBar title="Doctor Mode — AI Consult" showBack />
      <div className="px-4 py-4 space-y-5">
        <div className="bg-[#E8F5EE] rounded-xl p-3 text-sm text-[#1B6B4A] font-medium">
          👨‍⚕️ NirogPath provides guideline-based decision support. Clinical judgment always prevails.
        </div>

        {/* Patient Details */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-[#1E293B]">Patient Details</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm text-[#64748B]">Age</label>
              <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                placeholder="e.g. 55" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base outline-none focus:border-[#1B6B4A] mt-1" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-[#64748B]">Gender</label>
              <div className="flex gap-2 mt-1">
                {['male','female'].map(g => (
                  <button key={g} onClick={() => setForm(f => ({ ...f, gender: g }))}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 capitalize ${
                      form.gender === g ? 'bg-[#1B6B4A] text-white border-[#1B6B4A]' : 'bg-white text-[#1E293B] border-gray-200'
                    }`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Readings */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-semibold text-[#1E293B]">Readings</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-[#64748B]">Systolic BP</label>
              <input type="number" value={form.systolic} onChange={e => setForm(f => ({ ...f, systolic: e.target.value }))}
                placeholder="mmHg" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B6B4A] mt-1" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[#64748B]">Diastolic BP</label>
              <input type="number" value={form.diastolic} onChange={e => setForm(f => ({ ...f, diastolic: e.target.value }))}
                placeholder="mmHg" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B6B4A] mt-1" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-[#64748B]">Fasting Sugar</label>
              <input type="number" value={form.fastingSugar} onChange={e => setForm(f => ({ ...f, fastingSugar: e.target.value }))}
                placeholder="mg/dL" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B6B4A] mt-1" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[#64748B]">PP Sugar</label>
              <input type="number" value={form.ppSugar} onChange={e => setForm(f => ({ ...f, ppSugar: e.target.value }))}
                placeholder="mg/dL" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B6B4A] mt-1" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-[#64748B]">HbA1c (%)</label>
              <input type="number" step="0.1" value={form.hba1c} onChange={e => setForm(f => ({ ...f, hba1c: e.target.value }))}
                placeholder="%" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B6B4A] mt-1" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[#64748B]">Creatinine</label>
              <input type="number" step="0.1" value={form.creatinine} onChange={e => setForm(f => ({ ...f, creatinine: e.target.value }))}
                placeholder="mg/dL" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B6B4A] mt-1" />
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#1E293B] mb-3">Current Medications</h3>
          <div className="flex gap-2 mb-2">
            <input value={medInput} onChange={e => setMedInput(e.target.value)} placeholder="Add medication..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B6B4A]"
              onKeyDown={e => { if (e.key === 'Enter' && medInput.trim()) { setMedications(prev => [...prev, medInput.trim()]); setMedInput(''); }}} />
            <button onClick={() => { if (medInput.trim()) { setMedications(prev => [...prev, medInput.trim()]); setMedInput(''); }}}
              className="px-4 py-2.5 bg-[#1B6B4A] text-white rounded-lg text-sm font-medium">+</button>
          </div>
          {medications.map((m, i) => (
            <div key={i} className="flex items-center gap-2 py-1">
              <span className="text-sm text-[#1E293B]">+ {m}</span>
              <button onClick={() => setMedications(prev => prev.filter((_, j) => j !== i))} className="text-gray-400 text-xs">✕</button>
            </div>
          ))}
        </div>

        {/* Comorbidities */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#1E293B] mb-3">Comorbidities</h3>
          <div className="flex flex-wrap gap-2">
            {COMORBIDITIES.map(c => (
              <button key={c} onClick={() => setComorbidities(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  comorbidities.includes(c) ? 'bg-[#1B6B4A] text-white border-[#1B6B4A]' : 'bg-white text-[#64748B] border-gray-200'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <button onClick={consult} disabled={loading}
          className="w-full bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 touch-target">
          {loading ? '🤖 Getting AI Recommendation...' : '🤖 Get AI Recommendation'}
        </button>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-[#1E293B] text-lg">🤖 AI Treatment Suggestion</h3>

            {result.risk_stratification && (
              <div>
                <div className="text-sm font-semibold text-[#64748B] mb-1">Risk Level</div>
                <div className="text-base font-bold text-[#DC2626] uppercase">{result.risk_stratification.overall_cvd_risk}</div>
              </div>
            )}

            {result.hypertension_management?.recommendation && (
              <div>
                <div className="text-sm font-semibold text-[#64748B] mb-1">Hypertension Management</div>
                <p className="text-sm text-[#1E293B]">{result.hypertension_management.recommendation}</p>
                <p className="text-xs text-[#64748B]">Target: {result.hypertension_management.target_bp} · Reassess: {result.hypertension_management.timeline_for_reassessment}</p>
              </div>
            )}

            {result.diabetes_management?.recommendation && (
              <div>
                <div className="text-sm font-semibold text-[#64748B] mb-1">Diabetes Management</div>
                <p className="text-sm text-[#1E293B]">{result.diabetes_management.recommendation}</p>
              </div>
            )}

            {result.additional_medications?.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-[#64748B] mb-1">Additional Medications</div>
                {result.additional_medications.map((m: any, i: number) => (
                  <div key={i} className="text-sm text-[#1E293B]">• {m.drug}: {m.reason}</div>
                ))}
              </div>
            )}

            {result.labs_to_order?.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-[#64748B] mb-1">Labs to Order</div>
                <div className="text-sm text-[#1E293B]">{result.labs_to_order.join(', ')}</div>
              </div>
            )}

            {result.referral_criteria?.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-[#64748B] mb-1">Refer if</div>
                {result.referral_criteria.map((r: string, i: number) => (
                  <div key={i} className="text-sm text-[#1E293B]">• {r}</div>
                ))}
              </div>
            )}

            <div className="bg-[#FFF7ED] rounded-lg p-3 text-xs text-[#F59E0B]">
              ⚠️ {result.disclaimer || 'AI decision support — clinical judgment prevails.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
