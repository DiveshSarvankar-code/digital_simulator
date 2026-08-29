'use client';

import { useState } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import { SettingsApp, type ActiveSettingsScreen } from '@/components/phone/settings-app';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import type { TaskProps } from '../task-router';
import { Wifi, Lock, CheckCircle2, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FakeNetwork {
  ssid: string;
  secured: boolean;
  signal: number;
}

const NETWORKS: FakeNetwork[] = [
  { ssid: 'Home_WiFi_5G', secured: true, signal: 3 },
  { ssid: 'BharatNet_Free', secured: false, signal: 2 },
  { ssid: 'CommunityNet', secured: true, signal: 1 },
];

export function WifiTask({ tr, onComplete }: TaskProps) {
  const [screen, setScreen] = useState<ActiveSettingsScreen>(null);
  const [wifiOn, setWifiOn] = useState(false);
  const [selectedNet, setSelectedNet] = useState<string | null>(null);
  const [connectedNet, setConnectedNet] = useState<string | null>(null);
  const completedRef = useState({ done: false })[0];

  const handleConnect = () => {
    if (!selectedNet || connectedNet) return;
    setConnectedNet(selectedNet);
    if (!completedRef.done) {
      completedRef.done = true;
      setTimeout(() => onComplete({}), 600);
    }
  };

  const networkContent = (
    <div className="px-5 py-4">
      <h3 className="text-lg font-semibold text-gray-900">{tr('wifiTitle')}</h3>
      <p className="mb-4 text-sm text-gray-500">{tr('wifiSubtitle')}</p>

      {/* Wi-Fi toggle */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full',
            wifiOn ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
          )}>
            <Wifi className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-medium text-gray-900">{tr('wifiUseWifi')}</p>
            <p className="text-xs text-gray-500">
              {wifiOn ? tr('connected') : tr('notConnected')}
            </p>
          </div>
        </div>
        <Switch checked={wifiOn} onCheckedChange={setWifiOn} />
      </div>

      {wifiOn && (
        <div className="app-fade-in">
          <p className="mb-2 text-sm font-medium text-gray-700">{tr('wifiSelectNetwork')}</p>
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
            {connectedNet && (
              <div className="flex items-center gap-3 bg-green-50 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-900">{connectedNet}</p>
                  <p className="text-xs text-success">{tr('connected')}</p>
                </div>
              </div>
            )}
            {NETWORKS.filter((n) => n.ssid !== connectedNet).map((net) => (
              <button
                key={net.ssid}
                onClick={() => setSelectedNet(net.ssid)}
                disabled={!!connectedNet}
                className={cn(
                  'flex w-full touch-target items-center gap-3 px-4 py-3 text-left transition-colors disabled:opacity-50',
                  selectedNet === net.ssid ? 'bg-blue-50' : 'hover:bg-gray-50'
                )}
              >
                <Wifi className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-900">{net.ssid}</p>
                  <p className="text-xs text-gray-500">
                    {net.secured ? `🔒 ${tr('wifiSecured')}` : tr('wifiOpen')}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((s) => (
                    <Signal
                      key={s}
                      className={cn(
                        'h-3 w-3',
                        s <= net.signal ? 'text-blue-600' : 'text-gray-200'
                      )}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>

          {selectedNet && !connectedNet && (
            <Button
              onClick={handleConnect}
              className="mt-4 h-12 w-full text-base font-semibold"
            >
              {tr('connectButton')}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <PhoneFrame
      wifiOn={wifiOn}
      appName={tr('phoneSettings')}
      showBack={screen !== null}
      onBack={() => setScreen(null)}
    >
      <SettingsApp
        activeScreen={screen}
        onOpenScreen={setScreen}
        networkContent={networkContent}
        onWrongTap={() => {}}
        taskRelevantRows={['settingsNetwork']}
      />
    </PhoneFrame>
  );
}
