'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DayData {
  day: string;
  percent: number;
}

export default function AdherenceBarChart({ data }: { data: DayData[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
        <Tooltip formatter={(v) => [`${v}%`, 'Adherence']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
          {data.map((entry, idx) => (
            <Cell
              key={idx}
              fill={entry.percent >= 80 ? '#16A34A' : entry.percent >= 50 ? '#F59E0B' : '#DC2626'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
