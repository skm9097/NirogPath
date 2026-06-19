'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_ACTIONS = [
  { label: 'Analyze my week', labelHi: 'मेरा हफ्ता', prompt: 'Analyze my health data from this week and tell me how I am doing.' },
  { label: 'Food advice', labelHi: 'खाने की सलाह', prompt: 'What foods should I eat or avoid for my condition today?' },
  { label: 'Explain my meds', labelHi: 'दवाई समझाएं', prompt: 'Explain my current medications and why I am taking them.' },
  { label: 'Prepare for visit', labelHi: 'डॉक्टर के लिए', prompt: 'Help me prepare questions to ask my doctor at my next visit.' },
];

export default function AIChat({ language = 'en' }: { language?: 'en' | 'hi' }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/lifestyle-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Sorry, I could not get a response.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {messages.length === 0 && (
        <div className="px-4 pb-3">
          <p className="text-sm text-gray-500 mb-3">{language === 'hi' ? 'जल्दी पूछें:' : 'Quick Actions:'}</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => sendMessage(a.prompt)}
                className="text-left p-3 rounded-xl border border-[#E8F5EE] bg-[#F8FAFC] text-sm text-[#1B6B4A] font-medium hover:bg-[#E8F5EE] transition-colors touch-target"
              >
                {language === 'hi' ? a.labelHi : a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-[#1B6B4A] text-white rounded-br-sm'
                : 'bg-white text-[#1E293B] border border-gray-100 rounded-bl-sm shadow-sm'
            }`}>
              {msg.role === 'assistant' && (
                <div className="text-xs text-[#1B6B4A] font-medium mb-1">🤖 NirogPath AI</div>
              )}
              {msg.content}
              {msg.role === 'assistant' && (
                <div className="text-xs text-gray-400 mt-2 border-t border-gray-100 pt-1">
                  ⚠️ AI guidance only — not a prescription
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-100 shadow-sm">
              <Loader2 size={16} className="animate-spin text-[#1B6B4A]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pt-2 pb-2">
        <div className="flex gap-2 items-center bg-white border border-gray-200 rounded-2xl px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder={language === 'hi' ? 'अपना सवाल लिखें...' : 'Type your question...'}
            className="flex-1 text-sm outline-none text-[#1E293B] placeholder-gray-400"
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-full bg-[#1B6B4A] flex items-center justify-center disabled:opacity-40">
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
