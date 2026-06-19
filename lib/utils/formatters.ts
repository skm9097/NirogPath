export function formatDate(date: string | Date, locale = 'en-IN'): string {
  return new Date(date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(date: string | Date, locale = 'en-IN'): string {
  return new Date(date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

export function formatBP(systolic: number, diastolic: number): string {
  return `${systolic}/${diastolic}`;
}

export function getGreeting(name: string, lang = 'en'): string {
  const hour = new Date().getHours();
  if (lang === 'hi') {
    if (hour < 12) return `सुप्रभात, ${name}`;
    if (hour < 17) return `नमस्कार, ${name}`;
    return `शुभ संध्या, ${name}`;
  }
  if (hour < 12) return `Good Morning, ${name}`;
  if (hour < 17) return `Good Afternoon, ${name}`;
  return `Good Evening, ${name}`;
}

export function calcBMI(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}

export function calcAge(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
