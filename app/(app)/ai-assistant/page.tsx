import AIChat from '@/components/ai/AIChat';
import TopBar from '@/components/layout/TopBar';

export default function AIAssistantPage() {
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      <TopBar title="AI Health Assistant 🤖" showBack />
      <div className="flex-1 overflow-hidden flex flex-col pt-2">
        <AIChat />
      </div>
    </div>
  );
}
