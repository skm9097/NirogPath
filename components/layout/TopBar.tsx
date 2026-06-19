'use client';
import { ArrowLeft, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LanguageToggle from './LanguageToggle';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showBell?: boolean;
  showLanguage?: boolean;
}

export default function TopBar({ title, showBack = false, showBell = false, showLanguage = false }: TopBarProps) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between max-w-lg mx-auto w-full">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => router.back()} className="touch-target flex items-center justify-center -ml-2">
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
        )}
        {title && <h1 className="text-lg font-semibold text-[#1E293B] font-poppins">{title}</h1>}
      </div>
      <div className="flex items-center gap-2">
        {showLanguage && <LanguageToggle />}
        {showBell && (
          <button className="touch-target flex items-center justify-center relative">
            <Bell size={22} className="text-gray-700" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        )}
      </div>
    </header>
  );
}
