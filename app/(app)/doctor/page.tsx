import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';

export default function DoctorDashboard() {
  return (
    <div>
      <TopBar title="Doctor Mode 👨‍⚕️" showBack />
      <div className="px-4 py-6 space-y-4">
        <div className="bg-[#E8F5EE] rounded-xl p-4 border border-[#1B6B4A]/20">
          <h2 className="font-semibold text-[#1B6B4A] mb-1">AI-Assisted NCD Consultation</h2>
          <p className="text-sm text-[#64748B]">Get guideline-based treatment suggestions for your NCD patients.</p>
        </div>
        <Link href="/doctor/consult" className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-[#1B6B4A] transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">🩺</div>
          <div>
            <div className="font-semibold text-[#1E293B]">New Consultation</div>
            <div className="text-sm text-[#64748B]">Enter patient data & get AI recommendation</div>
          </div>
          <div className="ml-auto text-gray-300">›</div>
        </Link>
        <Link href="/doctor/history" className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-[#1B6B4A] transition-colors">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">📋</div>
          <div>
            <div className="font-semibold text-[#1E293B]">Past Consultations</div>
            <div className="text-sm text-[#64748B]">Review previous cases</div>
          </div>
          <div className="ml-auto text-gray-300">›</div>
        </Link>
      </div>
    </div>
  );
}
