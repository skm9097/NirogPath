'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { formatDate } from '@/lib/utils/formatters';

interface BPReading {
  recorded_at: string;
  systolic: number;
  diastolic: number;
}

export default function BPTrendChart({ readings }: { readings: BPReading[] }) {
  const data = readings.map((r) => ({
    date: formatDate(r.recorded_at, 'en-IN').replace(/\d{4}$/, '').trim(),
    systolic: r.systolic,
    diastolic: r.diastolic,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
        <YAxis domain={[60, 200]} tick={{ fontSize: 11, fill: '#64748B' }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
          formatter={(value, name) => [`${value} mmHg`, name === 'systolic' ? 'Systolic' : 'Diastolic']}
        />
        <ReferenceLine y={120} stroke="#16A34A" strokeDasharray="4 4" label={{ value: '120', fontSize: 10, fill: '#16A34A' }} />
        <ReferenceLine y={80} stroke="#16A34A" strokeDasharray="4 4" label={{ value: '80', fontSize: 10, fill: '#16A34A' }} />
        <Line type="monotone" dataKey="systolic" stroke="#DC2626" strokeWidth={2} dot={{ r: 3, fill: '#DC2626' }} />
        <Line type="monotone" dataKey="diastolic" stroke="#2563EB" strokeWidth={2} dot={{ r: 3, fill: '#2563EB' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
