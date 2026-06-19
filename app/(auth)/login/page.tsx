'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  async function sendOTP() {
    const full = '+91' + phone.replace(/\D/g, '');
    if (full.length !== 13) { toast.error('Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: full });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setStep('otp');
    setCountdown(30);
    const timer = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(timer); return 0; } return c - 1; }), 1000);
    toast.success('OTP sent!');
  }

  async function verifyOTP() {
    const full = '+91' + phone.replace(/\D/g, '');
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ phone: full, token: otp, type: 'sms' });
    setLoading(false);
    if (error) { toast.error('Invalid OTP. Please try again.'); return; }
    if (data.user) {
      const { data: profile } = await supabase.from('profiles').select('onboarding_complete').eq('id', data.user.id).single();
      if (!profile?.onboarding_complete) {
        router.push('/onboarding/step-1');
      } else {
        router.push('/dashboard');
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🟢</div>
          <h1 className="text-2xl font-bold text-[#1B6B4A] font-poppins">NirogPath</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-[#1E293B] mb-1">Welcome</h2>
          <p className="text-lg text-[#64748B] font-devanagari mb-6">स्वागत है</p>

          {step === 'phone' ? (
            <>
              <div className="flex gap-2 mb-4">
                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-sm font-medium text-[#1E293B]">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Mobile Number"
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-[#1E293B] text-base outline-none focus:border-[#1B6B4A] focus:ring-1 focus:ring-[#1B6B4A]"
                  inputMode="numeric"
                />
              </div>
              <button
                onClick={sendOTP}
                disabled={loading || phone.length !== 10}
                className="w-full bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 hover:bg-[#155a3d] transition-colors touch-target"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-[#64748B] mb-4">OTP sent to +91 {phone}</p>
              <div className="flex gap-2 mb-4 justify-center">
                {[0,1,2,3,4,5].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={otp[i] || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/, '');
                      const arr = otp.split('');
                      arr[i] = val;
                      setOtp(arr.join('').slice(0, 6));
                      if (val && i < 5) {
                        (document.querySelectorAll('.otp-input')[i+1] as HTMLInputElement)?.focus();
                      }
                    }}
                    className="otp-input w-11 h-12 border-2 border-gray-200 rounded-lg text-center text-lg font-bold text-[#1E293B] outline-none focus:border-[#1B6B4A]"
                    inputMode="numeric"
                  />
                ))}
              </div>
              <button
                onClick={verifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#1B6B4A] text-white py-4 rounded-xl font-semibold text-base disabled:opacity-50 hover:bg-[#155a3d] transition-colors touch-target mb-3"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                onClick={countdown > 0 ? undefined : sendOTP}
                disabled={countdown > 0}
                className="w-full text-sm text-[#64748B] py-2 disabled:opacity-50"
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#64748B] mt-4">
          🔒 Your data stays on your phone. We never share it.
        </p>
      </div>
    </div>
  );
}
