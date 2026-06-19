'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  language: 'en' | 'hi';
  role: 'patient' | 'doctor' | 'guardian' | 'community_anchor';
  onboarding_complete: boolean;
}

interface AppState {
  profile: Profile | null;
  language: 'en' | 'hi';
  isOnline: boolean;
  setProfile: (p: Profile | null) => void;
  setLanguage: (l: 'en' | 'hi') => void;
  setIsOnline: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      language: 'hi',
      isOnline: true,
      setProfile: (p) => set({ profile: p }),
      setLanguage: (l) => set({ language: l }),
      setIsOnline: (v) => set({ isOnline: v }),
    }),
    { name: 'nirogpath-store' }
  )
);
