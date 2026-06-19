'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/layout/TopBar';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, setLanguage, setProfile } = useAppStore();
  const [profile, setLocalProfile] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setLocalProfile(data);
    }
    load();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    router.push('/');
    toast.success('Signed out');
  }

  const menuItems = [
    { icon: '🤖', label: 'AI Assistant', href: '/ai-assistant' },
    { icon: '📅', label: 'Follow-ups', href: '/followups' },
    { icon: '👨‍👩‍👧', label: 'Guardian', href: '/guardian' },
    { icon: '👨‍⚕️', label: 'Doctor Mode', href: '/doctor' },
    { icon: '🏘️', label: 'Community Dashboard', href: '/community' },
    { icon: '📊', label: 'Health Report', href: '/health-report' },
  ];

  return (
    <div>
      <TopBar title="Profile" />
      <div className="px-4 py-4 space-y-4">
        {/* User card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#E8F5EE] flex items-center justify-center text-2xl">👤</div>
          <div>
            <div className="font-semibold text-[#1E293B] text-lg">{profile?.full_name || 'Your Name'}</div>
            <div className="text-sm text-[#64748B]">{profile?.phone}</div>
            <div className="text-xs text-[#1B6B4A] capitalize">{profile?.role || 'patient'}</div>
          </div>
        </div>

        {/* Language toggle */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <div className="font-medium text-[#1E293B]">Language</div>
            <div className="text-sm text-[#64748B]">App language</div>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="px-4 py-2 rounded-full border-2 border-[#1B6B4A] text-[#1B6B4A] font-semibold text-sm">
            {language === 'en' ? 'हिन्दी' : 'English'}
          </button>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {menuItems.map((item, i) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-100' : ''}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-[#1E293B]">{item.label}</span>
              <span className="ml-auto text-gray-300">›</span>
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <button onClick={signOut}
          className="w-full py-4 rounded-xl border-2 border-red-200 text-red-500 font-semibold text-base hover:bg-red-50 transition-colors touch-target">
          Sign Out
        </button>

        <p className="text-center text-xs text-[#64748B] pb-2">
          NirogPath v1.0 · Made for India 🇮🇳<br />
          NCD health data belongs to you.
        </p>
      </div>
    </div>
  );
}
