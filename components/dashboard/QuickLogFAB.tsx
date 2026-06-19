'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Activity, Droplets, Scale, X } from 'lucide-react';

export default function QuickLogFAB() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <>
          <Link href="/log/weight" onClick={() => setOpen(false)}
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100">
            <Scale size={18} className="text-[#2563EB]" />
            <span className="text-sm font-medium text-[#1E293B]">Weight</span>
          </Link>
          <Link href="/log/sugar" onClick={() => setOpen(false)}
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100">
            <Droplets size={18} className="text-[#F59E0B]" />
            <span className="text-sm font-medium text-[#1E293B]">Sugar</span>
          </Link>
          <Link href="/log/bp" onClick={() => setOpen(false)}
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-100">
            <Activity size={18} className="text-[#DC2626]" />
            <span className="text-sm font-medium text-[#1E293B]">BP</span>
          </Link>
        </>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-[#1B6B4A] shadow-lg flex items-center justify-center text-white transition-transform active:scale-95"
      >
        {open ? <X size={24} /> : <Plus size={28} strokeWidth={2.5} />}
      </button>
    </div>
  );
}
