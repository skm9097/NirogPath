import BottomNav from '@/components/layout/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-lg mx-auto w-full safe-pb">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
