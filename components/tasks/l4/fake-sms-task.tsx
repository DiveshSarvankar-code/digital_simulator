'use client';

import { useState } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import type { TaskProps } from '../task-router';
import { CheckCircle2, AlertTriangle, Info, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type Selected = 'legitimate' | 'scam' | null;

export function FakeSmsTask({ tr, onComplete, onWrongTap }: TaskProps) {
  const [selected, setSelected] = useState<Selected>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const completedRef = useState({ done: false })[0];

  const handleSelect = (which: 'legitimate' | 'scam') => {
    if (completedRef.done) return;
    setSelected(which);

    if (which === 'scam') {
      if (!completedRef.done) {
        completedRef.done = true;
        setAttempts((a) => a + 1);
        setTimeout(() => onComplete({ choiceCorrect: true, attempts: attempts + 1 }), 1200);
      }
    } else {
      // Wrong: legitimate message tapped
      setAttempts((a) => a + 1);
      onWrongTap();
      setShowExplanation(true);
      setTimeout(() => {
        setShowExplanation(false);
        setSelected(null);
      }, 3500);
    }
  };

  return (
    <PhoneFrame wifiOn appName={tr('phoneMessages')}>
      <div className="flex-1 bg-gray-50">
        {/* Messages header */}
        <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-2">
          <ArrowLeft className="h-5 w-5 text-gray-400" />
          <span className="text-base font-semibold text-gray-900">{tr('phoneMessages')}</span>
        </div>

        <div className="p-4">
          <p className="mb-3 text-center text-sm text-gray-500">{tr('task_fake_sms_instruction')}</p>

          <div className="space-y-3">
            {/* Legitimate message */}
            <button
              onClick={() => handleSelect('legitimate')}
              disabled={completedRef.done}
              className={cn(
                'w-full touch-target rounded-2xl border-2 p-4 text-left transition-all disabled:opacity-50',
                selected === 'legitimate'
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">SBI-BANK</span>
                <span className="ml-auto text-xs text-gray-400">2:30 PM</span>
              </div>
              <p className="text-base text-gray-800">{tr('smsLegitimate')}</p>
            </button>

            {/* Scam message */}
            <button
              onClick={() => handleSelect('scam')}
              disabled={completedRef.done}
              className={cn(
                'w-full touch-target rounded-2xl border-2 p-4 text-left transition-all disabled:opacity-50',
                selected === 'scam'
                  ? 'border-success bg-success/5'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium text-gray-500">+91 91234 56780</span>
                <span className="ml-auto text-xs text-gray-400">2:31 PM</span>
              </div>
              <p className="text-base text-gray-800">{tr('smsScam')}</p>
            </button>
          </div>

          {/* Explanation for wrong choice */}
          {showExplanation && (
            <div className="slide-up mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-900">{tr('smsLegitimateExplanation')}</p>
                  <p className="mt-1 text-sm text-amber-700">{tr('smsTapScam')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {selected === 'scam' && completedRef.done && (
            <div className="slide-up mt-4 flex items-start gap-2 rounded-xl border border-success/20 bg-success/5 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <p className="text-sm font-medium text-success">{tr('smsScamSelected')}</p>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
