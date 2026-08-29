'use client';

import { useState } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import { SettingsApp, type ActiveSettingsScreen } from '@/components/phone/settings-app';
import { DragSlider } from '@/components/phone/drag-slider';
import type { TaskProps } from '../task-router';
import { CheckCircle2 } from 'lucide-react';

export function TextSizeTask({ tr, onComplete }: TaskProps) {
  const [screen, setScreen] = useState<ActiveSettingsScreen>(null);
  const [fontSize, setFontSize] = useState(50); // 0-100, default mid
  const completedRef = useState({ done: false })[0];

  const handleCommit = (v: number) => {
    if (v >= 70 && !completedRef.done) {
      completedRef.done = true;
      setTimeout(() => onComplete({}), 400);
    }
  };

  const samplePx = 16 + (fontSize / 100) * 20; // 16px to 36px

  const displayContent = (
    <div className="px-5 py-4">
      <h3 className="text-lg font-semibold text-gray-900">{tr('fontSizeTitle')}</h3>
      <p className="mb-4 text-sm text-gray-500">{tr('fontSizeSubtitle')}</p>

      {/* Preview */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p style={{ fontSize: `${samplePx}px`, lineHeight: 1.5 }} className="text-gray-800">
          {tr('sampleText')}
        </p>
      </div>

      {/* Small "A" and large "A" indicators */}
      <div className="mb-2 flex items-center justify-between text-gray-400">
        <span className="text-sm font-bold">A</span>
        <span className="text-2xl font-bold">A</span>
      </div>

      <DragSlider
        value={fontSize}
        onChange={setFontSize}
        onCommit={handleCommit}
        ariaLabel={tr('fontSizeTitle')}
      >
        {fontSize >= 70 && <CheckCircle2 className="h-4 w-4 text-success" />}
      </DragSlider>
    </div>
  );

  return (
    <PhoneFrame wifiOn={false} appName={tr('phoneSettings')} showBack={screen !== null} onBack={() => setScreen(null)}>
      <SettingsApp
        activeScreen={screen}
        onOpenScreen={setScreen}
        displayContent={displayContent}
        onWrongTap={() => {}}
        taskRelevantRows={['settingsDisplay']}
      />
    </PhoneFrame>
  );
}
