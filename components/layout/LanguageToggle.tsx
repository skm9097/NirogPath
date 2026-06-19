'use client';
import { useAppStore } from '@/store/useAppStore';

export default function LanguageToggle() {
  const { language, setLanguage } = useAppStore();
  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="px-3 py-1.5 rounded-full border border-[#1B6B4A] text-[#1B6B4A] text-sm font-medium transition-colors hover:bg-[#E8F5EE]"
    >
      {language === 'en' ? 'हिन्दी' : 'EN'}
    </button>
  );
}
