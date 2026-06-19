import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center">
      <div className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🟢</span>
              <span className="text-2xl font-bold text-[#1B6B4A] font-poppins">NirogPath</span>
            </div>
            <div className="text-lg text-[#1B6B4A] font-devanagari font-medium">निरोगपथ</div>
          </div>
          <Link href="/login" className="text-sm text-[#1B6B4A] font-medium underline">Login</Link>
        </header>

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-48 h-48 mx-auto mb-6 bg-[#E8F5EE] rounded-3xl flex items-center justify-center text-8xl">
            🫀
          </div>
          <h1 className="text-2xl font-bold text-[#1E293B] font-poppins mb-2">
            "Screening hua, aage kya?"
          </h1>
          <p className="text-base text-[#64748B] mb-1">Got screened, now what?</p>
          <p className="text-base text-[#1E293B] font-medium">
            Track your BP & Sugar.<br />
            Get AI health guidance.<br />
            Keep your family informed.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/login"
          className="w-full bg-[#1B6B4A] text-white text-center py-4 rounded-xl text-lg font-semibold touch-target mb-8 block hover:bg-[#155a3d] transition-colors"
        >
          Start Free — Enter Phone No.
        </Link>

        {/* How it works */}
        <div className="mb-8">
          <h2 className="text-center text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-4">
            — How it works —
          </h2>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { emoji: '📊', label: 'Log' },
              { emoji: '🤖', label: 'AI Guides' },
              { emoji: '💊', label: 'Track Meds' },
              { emoji: '👨‍👩‍👧', label: 'Family Alerts' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <div className="text-3xl">{item.emoji}</div>
                <div className="text-xs text-[#64748B] font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor section */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-semibold text-[#1E293B] mb-1">— For Doctors —</h3>
          <p className="text-sm text-[#64748B] mb-3">
            AI-powered NCD treatment decision support. Free.
          </p>
          <Link href="/login?role=doctor" className="text-sm font-semibold text-[#1B6B4A]">
            I'm a Doctor →
          </Link>
        </div>

        {/* Community section */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-8">
          <h3 className="font-semibold text-[#1E293B] mb-1">— For Communities —</h3>
          <p className="text-sm text-[#64748B] mb-3">
            See your area's NCD health at a glance.
          </p>
          <Link href="/community" className="text-sm font-semibold text-[#1B6B4A]">
            Community Dashboard →
          </Link>
        </div>

        {/* Trust badges */}
        <div className="text-center text-sm text-[#64748B] space-y-1 pb-8">
          <p>Made for India 🇮🇳</p>
          <p>Works offline • Hindi + English</p>
          <p>🔒 Your data is private & secure</p>
        </div>
      </div>
    </div>
  );
}
