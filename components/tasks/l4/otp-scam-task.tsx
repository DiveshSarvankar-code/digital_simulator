'use client';

import { useState } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import type { TaskProps } from '../task-router';
import { Phone, PhoneOff, CheckCircle2, AlertTriangle, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  textKey: 'otpOption1' | 'otpOption2' | 'otpOption3' | 'otpOptionCorrect';
  isCorrect: boolean;
}

const OPTIONS: Option[] = [
  { id: '1', textKey: 'otpOption1', isCorrect: false },
  { id: '2', textKey: 'otpOption2', isCorrect: false },
  { id: '3', textKey: 'otpOption3', isCorrect: false },
  { id: '4', textKey: 'otpOptionCorrect', isCorrect: true },
];

export function OtpScamTask({ tr, onComplete, onWrongTap }: TaskProps) {
  const [callActive, setCallActive] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const completedRef = useState({ done: false })[0];

  const handleSelect = (opt: Option) => {
    if (completedRef.done) return;
    setSelected(opt.id);

    if (opt.isCorrect) {
      if (!completedRef.done) {
        completedRef.done = true;
        setAttempts((a) => a + 1);
        setTimeout(() => onComplete({ choiceCorrect: true, attempts: attempts + 1 }), 1500);
      }
    } else {
      setAttempts((a) => a + 1);
      onWrongTap();
      setShowExplanation(true);
      setTimeout(() => {
        setShowExplanation(false);
        setSelected(null);
      }, 4000);
    }
  };

  return (
    <PhoneFrame wifiOn appName={tr('phonePhone')}>
      <div className="flex-1 bg-white">
        {/* Incoming call screen */}
        {callActive && (
          <div className="app-fade-in flex flex-1 flex-col bg-gradient-to-b from-gray-800 to-gray-900 px-5 py-6 text-white">
            {/* Caller info */}
            <div className="flex flex-col items-center pt-8">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
                <User className="h-12 w-12 text-white/70" />
              </div>
              <p className="text-xs text-white/60">{tr('otpIncomingCall')}</p>
              <p className="mt-1 text-lg font-semibold">+91 98765 43210</p>
            </div>

            {/* Call timer */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-white/50">
              <Clock className="h-4 w-4" />
              <span>0:08</span>
            </div>

            {/* Transcript */}
            <div className="mt-4 rounded-2xl bg-white/10 p-4">
              <p className="text-sm leading-relaxed text-white/90">{tr('otpTranscript')}</p>
            </div>

            {/* End call button */}
            <button
              onClick={() => setCallActive(false)}
              className="touch-target mt-auto flex items-center justify-center gap-2 rounded-full bg-red-500 py-3 text-base font-semibold text-white hover:bg-red-600"
            >
              <PhoneOff className="h-5 w-5" />
              End Call
            </button>
          </div>
        )}

        {/* Options screen after call ends */}
        {!callActive && (
          <div className="app-fade-in px-5 py-5">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <p className="text-base font-semibold text-gray-900">{tr('otpIncomingCall')}</p>
            </div>

            <p className="mb-4 text-sm text-gray-600">{tr('task_otp_scam_instruction')}</p>

            <div className="space-y-3">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  disabled={completedRef.done}
                  className={cn(
                    'touch-target w-full rounded-xl border-2 p-4 text-left text-base font-medium transition-all disabled:opacity-50',
                    selected === opt.id && opt.isCorrect
                      ? 'border-success bg-success/5 text-success'
                      : selected === opt.id && !opt.isCorrect
                      ? 'border-destructive bg-destructive/5 text-destructive'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                  )}
                >
                  {tr(opt.textKey)}
                </button>
              ))}
            </div>

            {/* Wrong explanation */}
            {showExplanation && (
              <div className="slide-up mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <p className="text-sm font-medium text-destructive">{tr('otpWrongExplanation')}</p>
                </div>
              </div>
            )}

            {/* Correct confirmation */}
            {completedRef.done && (
              <div className="slide-up mt-4 flex items-start gap-2 rounded-xl border border-success/20 bg-success/5 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <p className="text-sm font-medium text-success">{tr('otpCorrectExplanation')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
