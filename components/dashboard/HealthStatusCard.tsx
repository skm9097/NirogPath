'use client';
import { classifyBP, classifySugar } from '@/lib/constants/health-ranges';
import { formatTime } from '@/lib/utils/formatters';

interface BPCardProps {
  systolic: number;
  diastolic: number;
  recordedAt: string;
  language?: 'en' | 'hi';
}

interface SugarCardProps {
  value: number;
  testType: string;
  recordedAt: string;
  language?: 'en' | 'hi';
}

export function BPStatusCard({ systolic, diastolic, recordedAt, language = 'en' }: BPCardProps) {
  const { label, color, isCrisis } = classifyBP(systolic, diastolic);
  const dot = color === '#16A34A' ? '🟢' : color === '#F59E0B' ? '🟡' : color === '#F97316' ? '🟠' : '🔴';
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 ${isCrisis ? 'animate-pulse-danger border-red-300' : ''}`}>
      <div className="text-sm text-gray-500 mb-1">{language === 'hi' ? 'ब्लड प्रेशर' : 'Blood Pressure'}</div>
      <div className="text-2xl mb-1">{dot}</div>
      <div className="font-mono-health text-3xl font-bold text-[#1E293B]">{systolic}/{diastolic}</div>
      <div className="text-sm font-medium mt-1" style={{ color }}>{label}</div>
      <div className="text-xs text-gray-400 mt-1">{formatTime(recordedAt)}</div>
    </div>
  );
}

export function SugarStatusCard({ value, testType, recordedAt, language = 'en' }: SugarCardProps) {
  const { label, color, isCrisis } = classifySugar(value, testType);
  const dot = color === '#16A34A' ? '🟢' : color === '#F59E0B' ? '🟡' : '🔴';
  const typeLabel: Record<string, string> = { fasting: 'Fasting', pp: 'After Meal', random: 'Random', hba1c: 'HbA1c' };
  const typeLabelHi: Record<string, string> = { fasting: 'फास्टिंग', pp: 'खाने के बाद', random: 'रैंडम', hba1c: 'HbA1c' };
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 ${isCrisis ? 'animate-pulse-danger border-red-300' : ''}`}>
      <div className="text-sm text-gray-500 mb-1">{language === 'hi' ? 'शुगर' : 'Blood Sugar'}</div>
      <div className="text-2xl mb-1">{dot}</div>
      <div className="font-mono-health text-3xl font-bold text-[#1E293B]">{value}</div>
      <div className="text-sm font-medium mt-1" style={{ color }}>{label}</div>
      <div className="text-xs text-gray-400 mt-1">
        {language === 'hi' ? typeLabelHi[testType] : typeLabel[testType]} · {formatTime(recordedAt)}
      </div>
    </div>
  );
}
