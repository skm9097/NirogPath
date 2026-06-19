import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';

export default function LogPage() {
  return (
    <div>
      <TopBar title="Log Reading" showBack />
      <div className="px-4 py-6 space-y-4">
        {[
          { href: '/log/bp', emoji: '💓', label: 'Blood Pressure', sub: 'Systolic / Diastolic mmHg', color: '#DC2626' },
          { href: '/log/sugar', emoji: '🩸', label: 'Blood Sugar', sub: 'mg/dL or HbA1c %', color: '#F59E0B' },
          { href: '/log/weight', emoji: '⚖️', label: 'Weight', sub: 'Kilograms', color: '#2563EB' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-[#1B6B4A] transition-colors">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: item.color + '20' }}>
              {item.emoji}
            </div>
            <div>
              <div className="font-semibold text-[#1E293B]">{item.label}</div>
              <div className="text-sm text-[#64748B]">{item.sub}</div>
            </div>
            <div className="ml-auto text-gray-300">›</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
