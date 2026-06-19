'use client';

interface FunnelData {
  screened: number;
  diagnosed: number;
  on_treatment: number;
  controlled: number;
}

export default function CascadeFunnel({ data }: { data: FunnelData }) {
  const steps = [
    { label: 'Screened', labelHi: 'जांच हुई', value: data.screened, color: '#2563EB' },
    { label: 'Diagnosed', labelHi: 'बीमारी मिली', value: data.diagnosed, color: '#F59E0B' },
    { label: 'On Treatment', labelHi: 'इलाज में', value: data.on_treatment, color: '#F97316' },
    { label: 'Controlled', labelHi: 'नियंत्रित', value: data.controlled, color: '#16A34A' },
  ];
  const max = data.screened || 1;

  return (
    <div className="space-y-2">
      {steps.map((step) => (
        <div key={step.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#1E293B] font-medium">{step.label}</span>
            <span className="font-mono-health font-bold" style={{ color: step.color }}>{step.value}</span>
          </div>
          <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(step.value / max) * 100}%`, backgroundColor: step.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
