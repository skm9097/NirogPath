export const BP_RANGES = {
  normal: { systolicMax: 119, diastolicMax: 79, label: 'Normal', color: '#16A34A', emoji: '🟢' },
  elevated: { systolicMin: 120, systolicMax: 129, diastolicMax: 79, label: 'Elevated', color: '#F59E0B', emoji: '🟡' },
  high1: { systolicMin: 130, systolicMax: 139, diastolicMin: 80, diastolicMax: 89, label: 'High', color: '#F97316', emoji: '🟠' },
  high2: { systolicMin: 140, systolicMax: 179, diastolicMin: 90, diastolicMax: 119, label: 'Very High', color: '#DC2626', emoji: '🔴' },
  crisis: { systolicMin: 180, diastolicMin: 120, label: 'DANGER', color: '#DC2626', emoji: '🔴' },
};

export function classifyBP(sys: number, dia: number): { status: string; label: string; color: string; isCrisis: boolean } {
  if (sys >= 180 || dia >= 120) return { status: 'crisis', label: 'DANGER', color: '#DC2626', isCrisis: true };
  if (sys >= 140 || dia >= 90) return { status: 'very_high', label: 'Very High', color: '#DC2626', isCrisis: false };
  if (sys >= 130 || dia >= 80) return { status: 'high', label: 'High', color: '#F97316', isCrisis: false };
  if (sys >= 120 && dia < 80) return { status: 'elevated', label: 'Elevated', color: '#F59E0B', isCrisis: false };
  return { status: 'normal', label: 'Normal', color: '#16A34A', isCrisis: false };
}

export function classifySugar(value: number, testType: string): { status: string; label: string; color: string; isCrisis: boolean } {
  if (value <= 50) return { status: 'critical', label: 'Dangerously Low', color: '#DC2626', isCrisis: true };
  switch (testType) {
    case 'fasting':
      if (value >= 300) return { status: 'critical', label: 'Very High', color: '#DC2626', isCrisis: true };
      if (value >= 126) return { status: 'high', label: 'High', color: '#DC2626', isCrisis: false };
      if (value >= 100) return { status: 'borderline', label: 'Prediabetes', color: '#F59E0B', isCrisis: false };
      return { status: 'normal', label: 'Normal', color: '#16A34A', isCrisis: false };
    case 'pp':
      if (value >= 400) return { status: 'critical', label: 'Very High', color: '#DC2626', isCrisis: true };
      if (value >= 200) return { status: 'high', label: 'High', color: '#DC2626', isCrisis: false };
      if (value >= 140) return { status: 'borderline', label: 'Prediabetes', color: '#F59E0B', isCrisis: false };
      return { status: 'normal', label: 'Normal', color: '#16A34A', isCrisis: false };
    case 'hba1c':
      if (value > 8.0) return { status: 'uncontrolled', label: 'Uncontrolled', color: '#DC2626', isCrisis: false };
      if (value >= 6.5) return { status: 'diabetic', label: 'Diabetic (Fair)', color: '#F97316', isCrisis: false };
      if (value >= 5.7) return { status: 'prediabetes', label: 'Prediabetes', color: '#F59E0B', isCrisis: false };
      return { status: 'normal', label: 'Normal', color: '#16A34A', isCrisis: false };
    default: // random
      if (value >= 300) return { status: 'critical', label: 'Very High', color: '#DC2626', isCrisis: true };
      if (value >= 200) return { status: 'high', label: 'High', color: '#DC2626', isCrisis: false };
      if (value >= 140) return { status: 'borderline', label: 'Borderline', color: '#F59E0B', isCrisis: false };
      return { status: 'normal', label: 'Normal', color: '#16A34A', isCrisis: false };
  }
}
