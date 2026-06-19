'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, PlusCircle, Pill, User } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { href: '/dashboard', icon: Home, labelEn: 'Home', labelHi: 'होम' },
  { href: '/trends', icon: TrendingUp, labelEn: 'Trends', labelHi: 'रिपोर्ट' },
  { href: '/log', icon: PlusCircle, labelEn: 'Log', labelHi: 'लॉग' },
  { href: '/medications', icon: Pill, labelEn: 'Meds', labelHi: 'दवाई' },
  { href: '/profile', icon: User, labelEn: 'Me', labelHi: 'मैं' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {navItems.map(({ href, icon: Icon, labelEn, labelHi }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const label = language === 'hi' ? labelHi : labelEn;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 touch-target transition-colors ${
                active ? 'text-[#1B6B4A]' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} fill={active ? '#E8F5EE' : 'none'} />
              <span className="text-[11px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
