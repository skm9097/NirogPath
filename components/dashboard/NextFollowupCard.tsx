'use client';
import { Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';

interface Followup {
  id: string;
  title: string;
  scheduled_date: string;
  followup_type: string;
}

export default function NextFollowupCard({ followups, language = 'en' }: { followups: Followup[]; language?: string }) {
  if (!followups.length) return null;
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-[#1E293B] font-poppins mb-2">
        📅 {language === 'hi' ? 'अगली अपॉइंटमेंट' : 'Next Follow-up'}
      </h3>
      <div className="space-y-2">
        {followups.slice(0, 2).map((f) => (
          <div key={f.id} className="flex items-center gap-3">
            <Calendar size={16} className="text-[#2563EB] shrink-0" />
            <div>
              <div className="text-sm font-medium text-[#1E293B]">{f.title}</div>
              <div className="text-xs text-gray-400">{formatDate(f.scheduled_date)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
