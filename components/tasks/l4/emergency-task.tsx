'use client';

import { useState, useRef } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import type { TaskProps } from '../task-router';
import { Phone, PhoneOff, CheckCircle2, MapPin, Share2, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'call' | 'calling' | 'callEnded' | 'shareLocation' | 'shared' | 'done';

export function EmergencyTask({ tr, onComplete }: TaskProps) {
  const [step, setStep] = useState<Step>('call');
  const completedRef = useState({ done: false })[0];
  const startTimeRef = useRef<number>(0);
  const callStartRef = useRef<number>(0);

  const handleCall = () => {
    if (step !== 'call') return;
    startTimeRef.current = Date.now();
    callStartRef.current = Date.now();
    setStep('calling');
    // Simulated call lasts 3 seconds
    setTimeout(() => setStep('callEnded'), 3000);
  };

  const handleProceedToShare = () => {
    if (step !== 'callEnded') return;
    setStep('shareLocation');
  };

  const handleShare = () => {
    if (step !== 'shareLocation') return;
    const elapsedMs = Date.now() - startTimeRef.current;
    if (!completedRef.done) {
      completedRef.done = true;
      setStep('shared');
      setTimeout(() => {
        onComplete({
          metadata: {
            elapsed_ms: elapsedMs,
            elapsed_sec: Math.round(elapsedMs / 1000),
            contact: tr('emergencyContactName'),
          },
        });
      }, 1200);
    }
  };

  const callElapsed = step === 'calling' || step === 'callEnded'
    ? Math.min(3, Math.floor((Date.now() - callStartRef.current) / 1000))
    : 0;

  return (
    <PhoneFrame wifiOn appName={tr('phonePhone')}>
      <div className="flex-1 bg-white">
        {step === 'call' && (
          <div className="app-fade-in flex flex-col items-center px-5 py-8">
            <p className="mb-4 text-center text-sm text-gray-600">{tr('task_emergency_instruction')}</p>

            {/* Emergency contact card */}
            <div className="w-full rounded-2xl border-2 border-red-300 bg-red-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <User className="h-7 w-7 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-red-600">{tr('task_emergency_title')}</p>
                  <p className="text-lg font-bold text-gray-900">{tr('emergencyContactName')}</p>
                  <p className="text-sm text-gray-500">+91 98XXX 12345</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCall}
              className="touch-target mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-red-500 py-4 text-lg font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-600 active:scale-95 transition-all"
            >
              <Phone className="h-6 w-6" />
              {tr('emergencyCallContact')} {tr('emergencyContactName')}
            </button>
          </div>
        )}

        {(step === 'calling' || step === 'callEnded') && (
          <div className="app-fade-in flex flex-1 flex-col items-center bg-gradient-to-b from-gray-800 to-gray-900 px-5 py-8 text-white">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 pulse-ring">
              <User className="h-12 w-12 text-white/70" />
            </div>
            <p className="text-lg font-semibold">{tr('emergencyContactName')}</p>
            <p className="text-sm text-white/50">+91 98XXX 12345</p>

            <div className="mt-3 flex items-center gap-1.5 text-sm text-white/60">
              <Clock className="h-4 w-4" />
              <span>0:0{callElapsed}</span>
            </div>

            {step === 'calling' && (
              <p className="mt-2 text-sm text-white/70">{tr('emergencyCalling')}</p>
            )}

            {step === 'callEnded' && (
              <>
                <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  {tr('emergencyCallEnded')}
                </div>
                <button
                  onClick={handleProceedToShare}
                  className="touch-target mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-base font-semibold text-white hover:bg-blue-700"
                >
                  <Share2 className="h-5 w-5" />
                  {tr('emergencyShareLocation')}
                </button>
              </>
            )}
          </div>
        )}

        {step === 'shareLocation' && (
          <div className="app-fade-in flex flex-col px-5 py-6">
            {/* Map preview */}
            <div className="relative mb-4 h-32 overflow-hidden rounded-xl bg-emerald-50">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `linear-gradient(rgba(100,160,100,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,100,0.2) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <MapPin className="h-8 w-8 fill-red-500 text-red-600" />
              </div>
            </div>

            <p className="mb-2 text-base font-medium text-gray-900">{tr('emergencyShareLocation')}</p>
            <p className="mb-4 text-sm text-gray-500">{tr('emergencyShareTo')}</p>

            {/* Share sheet */}
            <div className="space-y-2">
              <button
                onClick={handleShare}
                className="touch-target flex w-full items-center gap-3 rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-left transition-all hover:bg-blue-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">{tr('emergencyContactName')}</p>
                  <p className="text-xs text-gray-500">+91 98XXX 12345</p>
                </div>
                <Share2 className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
        )}

        {step === 'shared' && (
          <div className="app-fade-in flex flex-col items-center justify-center px-5 py-16">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <p className="text-center text-lg font-semibold text-gray-900">{tr('emergencyLocationShared')}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 text-red-500" />
              <span>Location: 18.5204°N, 73.8567°E</span>
            </div>
            <p className="mt-2 text-sm font-medium text-success">{tr('emergencyDone')}</p>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
