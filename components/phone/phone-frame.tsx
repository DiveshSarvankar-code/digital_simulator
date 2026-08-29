'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Signal, Wifi, WifiOff, BatteryMedium } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
  wifiOn?: boolean;
  brightness?: number;
  className?: string;
  appName?: string;
  onBack?: () => void;
  showBack?: boolean;
}

/**
 * Full-screen app container optimized for real Android phones.
 * Fills the actual device screen using dvh units — no fake bezel.
 */
export function PhoneFrame({
  children,
  wifiOn = false,
  brightness = 1,
  className,
  appName,
  onBack,
  showBack = false,
}: PhoneFrameProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      setTime(`${h % 12 || 12}:${m.toString().padStart(2, '0')}`);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={cn('flex h-full w-full flex-col overflow-hidden bg-white', className)}>
      {/* Simulated status bar — thin, real time/icons */}
      <div className="flex h-7 shrink-0 items-center justify-between bg-white px-4 text-[11px] font-medium text-gray-900">
        <span className="tabular-nums">{time}</span>
        <div className="flex items-center gap-1.5">
          <Signal className="h-3 w-3" />
          {wifiOn ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3 text-gray-400" />
          )}
          <BatteryMedium className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* App header */}
      {appName && (
        <div className="flex h-11 shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-3">
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="touch-target -ml-1 flex items-center text-base text-blue-600"
              aria-label="Back"
            >
              ‹
            </button>
          )}
          <span className="text-sm font-semibold text-gray-900">{appName}</span>
        </div>
      )}

      {/* Content area — fills remaining screen, scrolls if needed */}
      <div className="relative flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto overscroll-contain">{children}</div>
        {brightness < 1 && (
          <div
            className="pointer-events-none absolute inset-0 z-40 bg-black transition-opacity"
            style={{ opacity: (1 - brightness) * 0.7 }}
          />
        )}
      </div>
    </div>
  );
}
