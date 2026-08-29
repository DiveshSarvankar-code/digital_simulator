'use client';

import { useState } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import type { TaskProps } from '../task-router';
import { Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WhatsappMessageTask({ tr, onComplete }: TaskProps) {
  const [messages, setMessages] = useState<{ id: number; text: string; fromMe: boolean }[]>([
    { id: 0, text: tr('chatContactName') === 'Ramesh' ? 'Namaste! How are you?' : tr('suggestedMessage'), fromMe: false },
  ]);
  const [sent, setSent] = useState(false);
  const completedRef = useState({ done: false })[0];
  const [nextId, setNextId] = useState(1);

  const handleSendChip = () => {
    if (sent) return;
    setMessages((m) => [...m, { id: nextId, text: tr('suggestedMessage'), fromMe: true }]);
    setNextId((n) => n + 1);
    setSent(true);
    if (!completedRef.done) {
      completedRef.done = true;
      setTimeout(() => onComplete({}), 800);
    }
  };

  return (
    <PhoneFrame wifiOn appName={tr('phoneWhatsapp')}>
      {/* Chat header */}
      <div className="flex h-14 items-center gap-3 bg-[#075E54] px-3 text-white">
        <ArrowLeft className="h-5 w-5" />
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
          {tr('chatContactName').charAt(0)}
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold">{tr('chatContactName')}</p>
          <p className="text-xs text-white/70">online</p>
        </div>
      </div>

      {/* Chat area */}
      <div
        className="flex-1 space-y-2 overflow-y-auto p-3"
        style={{
          backgroundColor: '#E5DDD5',
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex', msg.fromMe ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm slide-up',
                msg.fromMe ? 'bg-[#DCF8C6] text-gray-800' : 'bg-white text-gray-800'
              )}
            >
              {msg.text}
              {msg.fromMe && (
                <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] text-gray-500">
                  <CheckCircle2 className="h-3 w-3 text-blue-500" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested message chip — OUTSIDE / separate from input area */}
      {!sent && (
        <div className="border-t border-gray-200 bg-white px-3 py-2">
          <p className="mb-1.5 text-xs text-gray-400">{tr('suggestedMessage')}</p>
          <button
            onClick={handleSendChip}
            className="touch-target flex w-full items-center justify-between gap-2 rounded-full border-2 border-[#25D366] bg-[#25D366]/10 px-4 py-3 text-left text-base font-medium text-[#075E54] transition-all hover:bg-[#25D366]/20 active:scale-[0.98]"
          >
            <span>{tr('suggestedMessage')}</span>
            <Send className="h-5 w-5 text-[#25D366]" />
          </button>
        </div>
      )}

      {/* Input bar (non-functional, just visual) */}
      <div className="flex items-center gap-2 border-t border-gray-200 bg-[#F0F0F0] px-3 py-2">
        <div className="flex-1 rounded-full bg-white px-4 py-2 text-sm text-gray-400">
          {tr('chatTypeMessage')}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#075E54]">
          <Send className="h-4 w-4 text-white" />
        </div>
      </div>
    </PhoneFrame>
  );
}
