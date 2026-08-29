'use client';

import { useState, useRef, useCallback } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import type { TaskProps } from '../task-router';
import { Mic, CheckCircle2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const GALLERY_COLORS = [
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-sky-400 to-blue-500',
  'from-violet-400 to-purple-500',
  'from-lime-400 to-green-500',
];

export function WhatsappMediaTask({ tr, onComplete }: TaskProps) {
  const [messages, setMessages] = useState<{ id: number; type: 'photo' | 'voice'; color?: string; duration?: number }[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const completedRef = useState({ done: false })[0];
  const sentPhotoRef = useRef(false);
  const sentVoiceRef = useRef(false);
  const nextId = useRef(1);
  const recordTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(0);

  const checkComplete = useCallback(() => {
    if (sentPhotoRef.current && sentVoiceRef.current && !completedRef.done) {
      completedRef.done = true;
      setTimeout(() => onComplete({}), 800);
    }
  }, [completedRef, onComplete]);

  const handleSendPhoto = (color: string) => {
    if (sentPhotoRef.current) return;
    setMessages((m) => [...m, { id: nextId.current++, type: 'photo', color }]);
    setShowGallery(false);
    sentPhotoRef.current = true;
    checkComplete();
  };

  const handleRecordStart = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (sentVoiceRef.current || recording) return;
    setRecording(true);
    setRecordProgress(0);
    startTime.current = Date.now();

    recordTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const pct = Math.min(100, (elapsed / 2000) * 100);
      setRecordProgress(pct);
      if (elapsed >= 2000) {
        if (recordTimer.current) clearInterval(recordTimer.current);
        setRecording(false);
        setRecordProgress(100);
        sentVoiceRef.current = true;
        setMessages((m) => [...m, { id: nextId.current++, type: 'voice', duration: 2 }]);
        checkComplete();
      }
    }, 50);
  };

  const handleRecordEnd = () => {
    // If released early, cancel the recording
    if (recording && recordTimer.current) {
      const elapsed = Date.now() - startTime.current;
      if (elapsed < 2000) {
        clearInterval(recordTimer.current);
        setRecording(false);
        setRecordProgress(0);
      }
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
        </div>
      </div>

      {/* Chat area */}
      <div
        className="flex-1 space-y-2 overflow-y-auto p-3"
        style={{ backgroundColor: '#E5DDD5' }}
      >
        {messages.length === 0 && (
          <div className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-gray-500">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <p>{tr('task_whatsapp_media_instruction')}</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="flex justify-end">
            {msg.type === 'photo' ? (
              <div className={cn('slide-up h-28 w-28 overflow-hidden rounded-lg bg-gradient-to-br shadow-md', msg.color)}>
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-white/60" />
                </div>
              </div>
            ) : (
              <div className="slide-up flex items-center gap-2 rounded-lg bg-[#DCF8C6] px-3 py-2 shadow-sm">
                <Mic className="h-4 w-4 text-[#075E54]" />
                <div className="flex h-6 w-20 items-center gap-0.5">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-[#075E54]"
                      style={{ height: `${6 + Math.sin(i * 0.7) * 8 + 6}px` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">0:{msg.duration}</span>
                <CheckCircle2 className="h-3 w-3 text-blue-500" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gallery overlay */}
      {showGallery && (
        <div className="absolute inset-0 z-30 flex flex-col bg-white app-fade-in">
          <div className="flex h-12 items-center border-b border-gray-100 px-4">
            <button
              onClick={() => setShowGallery(false)}
              className="touch-target -ml-2 text-base text-blue-600"
            >
              ‹
            </button>
            <span className="ml-2 font-semibold text-gray-900">{tr('gallery')}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-2">
            {GALLERY_COLORS.map((color, i) => (
              <button
                key={i}
                onClick={() => handleSendPhoto(color)}
                className={cn(
                  'aspect-square overflow-hidden rounded-lg bg-gradient-to-br transition-transform hover:scale-95 active:scale-90',
                  color
                )}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-white/60" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar with gallery button + mic */}
      <div className="flex items-center gap-2 border-t border-gray-200 bg-[#F0F0F0] px-3 py-2">
        <button
          onClick={() => setShowGallery(true)}
          disabled={sentPhotoRef.current}
          className="touch-target flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 disabled:opacity-40"
          aria-label={tr('gallery')}
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        {recording ? (
          <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
            <div className="flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-red-500 transition-all"
                  style={{ width: `${recordProgress}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-medium text-gray-600">{tr('recording')}</span>
          </div>
        ) : (
          <div className="flex-1 rounded-full bg-white px-4 py-2 text-sm text-gray-400">
            {tr('chatTypeMessage')}
          </div>
        )}

        {/* Mic button — press and hold */}
        <button
          onPointerDown={handleRecordStart}
          onPointerUp={handleRecordEnd}
          onPointerCancel={handleRecordEnd}
          disabled={sentVoiceRef.current}
          className={cn(
            'touch-target flex h-10 w-10 items-center justify-center rounded-full transition-all',
            sentVoiceRef.current
              ? 'bg-green-500 text-white'
              : recording
              ? 'scale-110 bg-red-500 text-white pulse-ring'
              : 'bg-[#075E54] text-white hover:bg-[#075E54]/90'
          )}
          style={{ touchAction: 'none' }}
          aria-label={tr('holdToRecord')}
        >
          {sentVoiceRef.current ? <CheckCircle2 className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
      </div>

      {!sentVoiceRef.current && !recording && (
        <div className="bg-gray-50 px-4 py-1.5 text-center text-xs text-gray-400">
          {tr('holdToRecord')}
        </div>
      )}
    </PhoneFrame>
  );
}
