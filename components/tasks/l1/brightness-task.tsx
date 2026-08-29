'use client';

import { useState } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import { SettingsApp, type ActiveSettingsScreen } from '@/components/phone/settings-app';
import { DragSlider } from '@/components/phone/drag-slider';
import type { TaskProps } from '../task-router';
import { Sun, CheckCircle2 } from 'lucide-react';

export function BrightnessTask({ tr, onComplete }: TaskProps) {
  const [screen, setScreen] = useState<ActiveSettingsScreen>(null);
  const [brightness, setBrightness] = useState(30); // starts dim
  const completedRef = useState({ done: false })[0];

  const handleCommit = (v: number) => {
    if (v >= 70 && !completedRef.done) {
      completedRef.done = true;
      setTimeout(() => onComplete({}), 400);
    }
  };

  const displayContent = (
    <div className="px-5 py-4">
      <h3 className="text-lg font-semibold text-gray-900">{tr('brightnessTitle')}</h3>
      <p className="mb-4 text-sm text-gray-500">{tr('brightnessSubtitle')}</p>

      {/* Preview area that dims/brightens */}
      <div
        className="mb-5 flex h-24 items-center justify-center rounded-xl border border-gray-200 transition-all"
        style={{
          background: `linear-gradient(135deg, hsl(45, 80%, ${20 + brightness * 0.5}%), hsl(200, 70%, ${15 + brightness * 0.6}%))`,
        }}
      >
        <Sun
          className="h-10 w-10 transition-all"
          style={{
            opacity: 0.3 + brightness / 100 * 0.7,
            filter: `drop-shadow(0 0 ${brightness / 8}px rgba(255, 220, 100, 0.6))`,
          }}
        />
      </div>

      <DragSlider
        value={brightness}
        onChange={setBrightness}
        onCommit={handleCommit}
        ariaLabel={tr('brightnessTitle')}
      >
        {brightness >= 70 && <CheckCircle2 className="h-4 w-4 text-success" />}
      </DragSlider>
    </div>
  );

  return (
    <PhoneFrame
      wifiOn={false}
      brightness={brightness / 100}
      appName={tr('phoneSettings')}
      showBack={screen !== null}
      onBack={() => setScreen(null)}
    >
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
