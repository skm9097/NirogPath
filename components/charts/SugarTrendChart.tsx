'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { formatDate } from '@/lib/utils/formatters';

interface SugarReading {
  recorded_at: string;
  sugar_value: number;
  sugar_test_type: string;
}

const typeColors: Record<string, string> = {
  fasting: '#2563EB',
  pp: '#F97316',
  random: '#8B5CF6',
  hba1c: '#EC4899',
};

export default function SugarTrendChart({ readings }: { readings: SugarReading[] }) {
  const data = readings.map((r) => ({
    date: formatDate(r.recorded_at, 'en-IN').replace(/\d{4}$/, '').trim(),
    value: r.sugar_value,
    type: r.sugar_test_type,
    color: typeColors[r.sugar_test_type] || '#64748B',
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
        <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
          formatter={(value) => [`${value} mg/dL`]}
        />
        <ReferenceLine y={100} stroke="#16A34A" strokeDasharray="4 4" />
        <ReferenceLine y={126} stroke="#F59E0B" strokeDasharray="4 4" />
        <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={{ r: 3, fill: '#2563EB' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
