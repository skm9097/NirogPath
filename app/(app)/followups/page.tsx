'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import TopBar from '@/components/layout/TopBar';
import { formatDate } from '@/lib/utils/formatters';
import { toast } from 'sonner';
import { Plus, Check } from 'lucide-react';

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', followup_type: 'doctor_visit', scheduled_date: '' });
  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('followups').select('*').eq('user_id', user.id).order('scheduled_date').limit(20);
    setFollowups(data || []);
  }

  async function addFollowup() {
    if (!form.title || !form.scheduled_date) { toast.error('Please fill all fields'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('followups').insert({ user_id: user.id, ...form });
    toast.success('Follow-up added!');
    setShowAdd(false);
    setForm({ title: '', followup_type: 'doctor_visit', scheduled_date: '' });
    load();
  }

  async function markComplete(id: string) {
    await supabase.from('followups').update({ completed: true, completed_at: new Date().toISOString() }).eq('id', id);
    setFollowups(prev => prev.map(f => f.id === id ? { ...f, completed: true } : f));
  }

  const upcoming = followups.filter(f => !f.completed);
  const past = followups.filter(f => f.completed);

  return (
    <div>
      <TopBar title="Follow-ups 📅" />
      <div className="px-4 py-4 space-y-4">
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center justify-center gap-2 w-full bg-[#1B6B4A] text-white py-3 rounded-xl font-semibold touch-target">
          <Plus size={20} /> Add Follow-up
        </button>

        {showAdd && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Blood Test, Dr. Sharma Visit"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]" />
            <select value={form.followup_type} onChange={e => setForm(f => ({ ...f, followup_type: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A] bg-white">
              <option value="doctor_visit">Doctor Visit</option>
              <option value="lab_test">Lab Test</option>
              <option value="screening">Screening</option>
            </select>
            <input type="date" value={form.scheduled_date} onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:border-[#1B6B4A]" />
            <div className="flex gap-2">
              <button onClick={addFollowup} className="flex-1 bg-[#1B6B4A] text-white py-3 rounded-xl font-semibold">Save</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-gray-100 text-[#64748B] py-3 rounded-xl font-semibold">Cancel</button>
            </div>
          </div>
        )}

        {upcoming.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-2">Upcoming</h3>
            <div className="space-y-2">
              {upcoming.map(f => {
                const isPast = new Date(f.scheduled_date) < new Date();
                return (
                  <div key={f.id} className={`bg-white rounded-xl p-4 shadow-sm border flex items-center gap-3 ${isPast ? 'border-red-200' : 'border-gray-100'}`}>
                    <span className="text-xl">{f.followup_type === 'doctor_visit' ? '👨‍⚕️' : f.followup_type === 'lab_test' ? '🔬' : '📋'}</span>
                    <div className="flex-1">
                      <div className="font-medium text-[#1E293B]">{f.title}</div>
                      <div className={`text-sm ${isPast ? 'text-red-500' : 'text-[#64748B]'}`}>
                        {isPast ? '⚠️ Overdue — ' : ''}{formatDate(f.scheduled_date)}
                      </div>
                    </div>
                    <button onClick={() => markComplete(f.id)} className="w-9 h-9 rounded-full bg-[#E8F5EE] flex items-center justify-center">
                      <Check size={16} className="text-[#1B6B4A]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide mb-2">Completed</h3>
            <div className="space-y-2">
              {past.slice(0, 5).map(f => (
                <div key={f.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3 opacity-60">
                  <span className="text-xl">✅</span>
                  <div>
                    <div className="font-medium text-[#64748B] line-through">{f.title}</div>
                    <div className="text-sm text-[#64748B]">{formatDate(f.scheduled_date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {followups.length === 0 && (
          <div className="text-center py-12 text-[#64748B]">
            <div className="text-4xl mb-3">📅</div>
            <p>No follow-ups scheduled yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
