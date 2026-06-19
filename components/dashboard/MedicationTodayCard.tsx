'use client';
import { Check } from 'lucide-react';

interface Med {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  taken: boolean;
}

interface Props {
  medications: Med[];
  onToggle: (id: string, taken: boolean) => void;
  language?: 'en' | 'hi';
}

export default function MedicationTodayCard({ medications, onToggle, language = 'en' }: Props) {
  const taken = medications.filter(m => m.taken).length;
  const total = medications.length;
  const pct = total > 0 ? Math.round((taken / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[#1E293B] font-poppins">
          💊 {language === 'hi' ? 'आज की दवाइयां' : "Today's Medications"}
        </h3>
        <span className="text-sm text-gray-500">{taken}/{total} {language === 'hi' ? 'ली' : 'taken'}</span>
      </div>

      <div className="space-y-2 mb-3">
        {medications.map((med) => (
          <button
            key={med.id}
            onClick={() => onToggle(med.id, !med.taken)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors touch-target"
          >
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
              med.taken ? 'bg-[#1B6B4A] border-[#1B6B4A]' : 'border-gray-300'
            }`}>
              {med.taken && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
            <span className={`flex-1 text-left text-sm ${med.taken ? 'line-through text-gray-400' : 'text-[#1E293B]'}`}>
              {med.name} {med.dosage}
            </span>
            <span className="text-xs text-gray-400 capitalize">{med.timing}</span>
          </button>
        ))}
      </div>

      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? '#16A34A' : pct >= 50 ? '#F59E0B' : '#DC2626' }}
        />
      </div>
      <div className="text-xs text-gray-400 mt-1">{pct}% {language === 'hi' ? 'पूरा' : 'complete'}</div>
    </div>
  );
}
