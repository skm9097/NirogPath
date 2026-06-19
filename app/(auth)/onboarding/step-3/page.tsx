'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CBAC_QUESTIONS, getCBACRisk } from '@/lib/constants/cbac-questions';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

export default function OnboardingStep3() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useAppStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const q = CBAC_QUESTIONS[currentQ];

  function calcScore() {
    return CBAC_QUESTIONS.reduce((sum, q) => {
      const ans = answers[q.id];
      if (!ans) return sum;
      if (q.type === 'yesno') return sum + (ans === 'yes' ? (q.score_if_yes || 0) : 0);
      const opt = q.options?.find(o => o.value === ans);
      return sum + (opt?.score || 0);
    }, 0);
  }

  async function finish() {
    const score = calcScore();
    const { category } = getCBACRisk(score);
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    await supabase.from('cbac_screenings').insert({
      user_id: user.id,
      total_score: score,
      risk_category: category,
      smoking: answers['smoking'] === 'yes',
      alcohol: answers['alcohol'] === 'yes',
      physical_activity_less_150min: answers['physical_activity'] === 'yes',
      family_history_diabetes: answers['family_diabetes'] === 'yes',
      family_history_hypertension: answers['family_hypertension'] === 'yes',
      family_history_heart: answers['family_heart'] === 'yes',
    });
    await supabase.from('patient_profiles').update({ cbac_score: score, risk_level: category }).eq('user_id', user.id);
    setLoading(false);
    setShowResult(true);
  }

  function answerAndNext(val: string) {
    setAnswers(a => ({ ...a, [q.id]: val }));
    if (currentQ < CBAC_QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      finish();
    }
  }

  if (showResult) {
    const score = calcScore();
    const risk = getCBACRisk(score);
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{risk.category === 'low' ? '🟢' : risk.category === 'moderate' ? '🟡' : '🔴'}</div>
          <h2 className="text-2xl font-bold text-[#1E293B] font-poppins mb-2">
            {risk.category === 'low' ? 'Low Risk' : risk.category === 'moderate' ? 'Moderate Risk' : 'High Risk'}
          </h2>
          <p className="text-base text-[#64748B] mb-2">CBAC Score: {score}/8</p>
          <p className="text-base font-medium" style={{ color: risk.color }}>{risk.message}</p>
        </div>
        <button
          onClick={() => router.push('/onboarding/step-4')}
          className="w-full bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base touch-target"
        >
          Continue Setup →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-1.5 w-8 rounded-full ${i <= 3 ? 'bg-[#1B6B4A]' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm text-[#64748B]">Step 3 of 4</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-[#64748B] mb-2">
          <span>Question {currentQ + 1} of {CBAC_QUESTIONS.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-[#1B6B4A] rounded-full transition-all" style={{ width: `${((currentQ + 1) / CBAC_QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-[#1E293B] mb-6">
        {language === 'hi' ? q.question_hi : q.question}
      </h2>

      {q.type === 'yesno' ? (
        <div className="grid grid-cols-2 gap-3">
          {['yes', 'no'].map(v => (
            <button key={v} onClick={() => answerAndNext(v)}
              className="py-5 rounded-xl font-semibold text-lg border-2 border-gray-200 bg-white hover:bg-[#E8F5EE] hover:border-[#1B6B4A] transition-colors touch-target capitalize">
              {v === 'yes' ? (language === 'hi' ? 'हाँ' : 'Yes') : (language === 'hi' ? 'नहीं' : 'No')}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {q.options?.map(opt => (
            <button key={opt.value} onClick={() => answerAndNext(opt.value)}
              className="w-full py-4 px-5 rounded-xl font-medium border-2 border-gray-200 bg-white hover:bg-[#E8F5EE] hover:border-[#1B6B4A] transition-colors text-left text-[#1E293B] touch-target">
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="mt-6 text-center text-[#64748B]">Calculating your risk score...</div>
      )}
    </div>
  );
}
