'use client';

import { useState, type ReactNode } from 'react';
import { useLang } from '@/lib/language-context';
import { t, type TranslationDict } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import {
  Wifi as WifiIcon,
  Bluetooth,
  AppWindow,
  Bell,
  BatteryFull,
  Volume2,
  Sun,
  Image as ImageIcon,
  Accessibility,
  Shield,
  MapPin,
  ShieldAlert,
  KeyRound,
  Settings as SettingsIcon,
  Info,
  ChevronRight,
} from 'lucide-react';

type SettingsRowKey =
  | 'settingsNetwork' | 'settingsConnectedDevices' | 'settingsApps'
  | 'settingsNotifications' | 'settingsBattery' | 'settingsSound'
  | 'settingsDisplay' | 'settingsWallpaper' | 'settingsAccessibility'
  | 'settingsSecurity' | 'settingsLocation' | 'settingsSafety'
  | 'settingsPasswords' | 'settingsSystem' | 'settingsAbout';

interface Row {
  key: SettingsRowKey;
  icon: typeof WifiIcon;
}

const ALL_ROWS: Row[] = [
  { key: 'settingsNetwork', icon: WifiIcon },
  { key: 'settingsConnectedDevices', icon: Bluetooth },
  { key: 'settingsApps', icon: AppWindow },
  { key: 'settingsNotifications', icon: Bell },
  { key: 'settingsBattery', icon: BatteryFull },
  { key: 'settingsSound', icon: Volume2 },
  { key: 'settingsDisplay', icon: Sun },
  { key: 'settingsWallpaper', icon: ImageIcon },
  { key: 'settingsAccessibility', icon: Accessibility },
  { key: 'settingsSecurity', icon: Shield },
  { key: 'settingsLocation', icon: MapPin },
  { key: 'settingsSafety', icon: ShieldAlert },
  { key: 'settingsPasswords', icon: KeyRound },
  { key: 'settingsSystem', icon: SettingsIcon },
  { key: 'settingsAbout', icon: Info },
];

export type ActiveSettingsScreen = 'display' | 'network' | null;

interface SettingsAppProps {
  activeScreen: ActiveSettingsScreen;
  onOpenScreen: (screen: ActiveSettingsScreen) => void;
  displayContent?: ReactNode;
  networkContent?: ReactNode;
  onWrongTap: () => void;
  taskRelevantRows: SettingsRowKey[];
}

export function SettingsApp({
  activeScreen,
  onOpenScreen,
  displayContent,
  networkContent,
  onWrongTap,
  taskRelevantRows,
}: SettingsAppProps) {
  const { lang } = useLang();
  const [wrongTapMsg, setWrongTapMsg] = useState(false);

  const handleRowTap = (row: Row) => {
    if (taskRelevantRows.includes(row.key)) {
      if (row.key === 'settingsDisplay') onOpenScreen('display');
      else if (row.key === 'settingsNetwork') onOpenScreen('network');
      else onOpenScreen('display'); // display is the only functional deep screen besides network
    } else {
      onWrongTap();
      setWrongTapMsg(true);
      setTimeout(() => setWrongTapMsg(false), 2500);
    }
  };

  const tr = (key: keyof TranslationDict) => t(lang, key);

  if (activeScreen === 'display') {
    return (
      <div className="app-fade-in flex h-full flex-col bg-white">
        <div className="flex h-12 items-center gap-3 border-b border-gray-100 px-4">
          <button
            onClick={() => onOpenScreen(null)}
            className="touch-target -ml-2 flex items-center text-base text-blue-600"
            aria-label="Back"
          >
            ‹ {tr('phoneSettings')}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{displayContent}</div>
      </div>
    );
  }

  if (activeScreen === 'network') {
    return (
      <div className="app-fade-in flex h-full flex-col bg-white">
        <div className="flex h-12 items-center gap-3 border-b border-gray-100 px-4">
          <button
            onClick={() => onOpenScreen(null)}
            className="touch-target -ml-2 flex items-center text-base text-blue-600"
            aria-label="Back"
          >
            ‹ {tr('phoneSettings')}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{networkContent}</div>
      </div>
    );
  }

  return (
    <div className="app-fade-in h-full bg-white">
      {/* Search bar placeholder like Android settings */}
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex h-9 items-center rounded-full bg-gray-100 px-4 text-sm text-gray-400">
          {tr('phoneSettings')}
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {ALL_ROWS.map((row) => {
          const Icon = row.icon;
          const isRelevant = taskRelevantRows.includes(row.key);
          return (
            <button
              key={row.key}
              onClick={() => handleRowTap(row)}
              className={cn(
                'flex w-full touch-target items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50',
                isRelevant && 'bg-blue-50/40'
              )}
            >
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                isRelevant ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="flex-1 text-base text-gray-900">{tr(row.key)}</span>
              <ChevronRight className="h-5 w-5 text-gray-300" />
            </button>
          );
        })}
      </div>
      {wrongTapMsg && (
        <div className="slide-up fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {tr('notNeededForTask')}
        </div>
      )}
    </div>
  );
}
