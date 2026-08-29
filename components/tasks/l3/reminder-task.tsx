'use client';

import { useState } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import type { TaskProps } from '../task-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, Bell, CheckCircle2, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ReminderTask({ tr, onComplete }: TaskProps) {
  const [hours, setHours] = useState(20); // 8 PM = 20:00
  const [minutes, setMinutes] = useState(0);
  const [label, setLabel] = useState('');
  const [repeatDaily, setRepeatDaily] = useState(false);
  const [saved, setSaved] = useState(false);
  const completedRef = useState({ done: false })[0];

  const handleSave = () => {
    if (!label.trim()) return;
    if (!completedRef.done) {
      completedRef.done = true;
      setSaved(true);
      setTimeout(() => onComplete({ metadata: { time: `${hours}:${minutes}`, label, repeatDaily } }), 1000);
    }
  };

  const formatHour = (h: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const display = h % 12 || 12;
    return `${display} ${ampm}`;
  };

  return (
    <PhoneFrame wifiOn appName={tr('phoneClock')}>
      <div className="flex-1 bg-white">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {['Alarm', 'Clock', 'Timer'].map((tab, i) => (
            <button
              key={tab}
              className={cn(
                'flex-1 py-3 text-sm font-medium',
                i === 0 ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="px-5 py-5">
          <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Bell className="h-5 w-5 text-blue-600" />
            {tr('reminderNameLabel')}
          </h3>
          <p className="mb-4 text-sm text-gray-500">{tr('task_reminder_instruction')}</p>

          {/* Time picker */}
          <div className="mb-5">
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              {tr('reminderTimeLabel')}
            </Label>
            <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-gray-50 py-4">
              <button
                onClick={() => setHours((h) => (h + 23) % 24)}
                className="touch-target flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl font-bold text-gray-600 shadow-sm hover:bg-gray-100"
              >
                −
              </button>
              <div className="flex items-center gap-1">
                <Clock className="h-6 w-6 text-gray-400" />
                <span className="min-w-[80px] text-center text-2xl font-bold text-gray-900">
                  {formatHour(hours)}:{minutes.toString().padStart(2, '0')}
                </span>
              </div>
              <button
                onClick={() => setHours((h) => (h + 1) % 24)}
                className="touch-target flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl font-bold text-gray-600 shadow-sm hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <div className="mt-2 flex justify-center gap-2">
              {[15, 30, 45, 0].map((m) => (
                <button
                  key={m}
                  onClick={() => setMinutes(m)}
                  className={cn(
                    'touch-target rounded-lg px-3 py-1.5 text-sm font-medium',
                    minutes === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  :{m.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          {/* Label field */}
          <div className="mb-5">
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              {tr('reminderNameLabel')}
            </Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={tr('reminderNamePlaceholder')}
              className="h-12 text-base"
            />
          </div>

          {/* Repeat daily toggle */}
          <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Repeat className="h-5 w-5 text-gray-500" />
              <span className="text-base font-medium text-gray-900">{tr('reminderRepeatDaily')}</span>
            </div>
            <Switch checked={repeatDaily} onCheckedChange={setRepeatDaily} />
          </div>

          {saved && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-sm font-medium text-success">{tr('reminderSaved')}</span>
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={!label.trim() || saved}
            className="h-12 w-full py-3.5 text-base font-semibold"
          >
            {tr('reminderSave')}
          </Button>
        </div>
      </div>
    </PhoneFrame>
  );
}
