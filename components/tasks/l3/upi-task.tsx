'use client';

import { useState } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import type { TaskProps } from '../task-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, CheckCircle2, ShieldAlert, UserCheck, IndianRupee, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'scan' | 'verify' | 'amount' | 'done';

// Deterministic QR module pattern (fixed, looks like a real QR)
const QR_SIZE = 21;
function generateModules(): boolean[][] {
  const grid: boolean[][] = [];
  for (let i = 0; i < QR_SIZE; i++) {
    grid.push([]);
    for (let j = 0; j < QR_SIZE; j++) {
      // Pseudo-random but deterministic pattern
      const val = (i * 7 + j * 13 + (i ^ j) * 3 + (i & j) * 5) % 7;
      grid[i].push(val < 3);
    }
  }
  // Finder patterns (3 corners)
  const placeFinder = (r: number, c: number) => {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const ri = r + i;
        const cj = c + j;
        if (ri < 0 || ri >= QR_SIZE || cj < 0 || cj >= QR_SIZE) continue;
        if (i === -1 || i === 7 || j === -1 || j === 7) {
          grid[ri][cj] = false; // quiet zone
        } else if (i === 0 || i === 6 || j === 0 || j === 6) {
          grid[ri][cj] = true; // outer border
        } else if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
          grid[ri][cj] = true; // inner block
        } else {
          grid[ri][cj] = false; // white
        }
      }
    }
  };
  placeFinder(0, 0);
  placeFinder(0, QR_SIZE - 7);
  placeFinder(QR_SIZE - 7, 0);
  return grid;
}

const QR_MODULES = generateModules();

export function UpiTask({ tr, onComplete }: TaskProps) {
  const [step, setStep] = useState<Step>('scan');
  const [scanning, setScanning] = useState(false);
  const [amount, setAmount] = useState('');
  const completedRef = useState({ done: false })[0];

  const handleScan = () => {
    if (scanning) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setStep('verify');
    }, 2000);
  };

  const handleVerify = (correct: boolean) => {
    if (correct) {
      setStep('amount');
    } else {
      setStep('scan');
    }
  };

  const handleConfirm = () => {
    const amt = parseInt(amount, 10);
    if (!amt || amt <= 0) return;
    if (!completedRef.done) {
      completedRef.done = true;
      setStep('done');
      setTimeout(() => onComplete({ metadata: { amount: amt, receiver: tr('upiReceiverName') } }), 1200);
    }
  };

  return (
    <PhoneFrame wifiOn appName={tr('phoneUpi')}>
      {/* Persistent simulated payment banner */}
      <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 border-b border-amber-200">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
        {tr('upiSimulatedBanner')}
      </div>

      <div className="flex-1 bg-white">
        {step === 'scan' && (
          <div className="app-fade-in flex flex-col items-center px-5 py-6">
            <p className="mb-4 text-center text-sm text-gray-600">{tr('upiScanPrompt')}</p>

            {/* QR code visual with scan line */}
            <div className="relative rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm">
              <div className="relative" style={{ width: '200px', height: '200px' }}>
                {/* QR modules */}
                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${QR_SIZE}, 1fr)`, gridTemplateRows: `repeat(${QR_SIZE}, 1fr)` }}>
                  {QR_MODULES.flatMap((row, i) =>
                    row.map((on, j) => (
                      <div key={`${i}-${j}`} className={cn(on ? 'bg-gray-900' : 'bg-white')} />
                    ))
                  )}
                </div>
                {/* Scan line */}
                {scanning && (
                  <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden">
                    <div className="scanline h-full w-full bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.7)]" />
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleScan}
              disabled={scanning}
              className="mt-6 h-12 w-full text-base font-semibold"
            >
              {scanning ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {tr('upiScanning')}
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-5 w-5" />
                  {tr('upiScanPrompt')}
                </>
              )}
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="app-fade-in flex flex-col items-center px-5 py-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
            <p className="mb-2 text-center text-base font-medium text-gray-900">{tr('upiVerifyPrompt')}</p>
            <div className="mb-6 w-full rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3 text-center">
              <p className="text-lg font-bold text-gray-900">{tr('upiReceiverName')}</p>
              <p className="text-xs text-gray-500">UPI ID: ramesh@okbank</p>
            </div>
            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                onClick={() => handleVerify(false)}
                className="h-12 flex-1 text-base"
              >
                {tr('upiReceiverWrong')}
              </Button>
              <Button
                onClick={() => handleVerify(true)}
                className="h-12 flex-1 text-base font-semibold"
              >
                {tr('upiReceiverConfirm')}
              </Button>
            </div>
          </div>
        )}

        {step === 'amount' && (
          <div className="app-fade-in flex flex-col px-5 py-6">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">{tr('upiReceiverName')}</p>
                <p className="text-xs text-gray-500">ramesh@okbank</p>
              </div>
            </div>

            <p className="mb-2 text-sm font-medium text-gray-700">{tr('upiAmountPrompt')}</p>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={tr('upiAmountPlaceholder')}
                className="h-14 pl-11 text-2xl font-bold"
                inputMode="numeric"
              />
            </div>

            {/* Quick amount chips */}
            <div className="mt-3 flex gap-2">
              {['100', '500', '1000'].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className="touch-target rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ₹{v}
                </button>
              ))}
            </div>

            {/* Explicitly NO numeric PIN pad */}
            <Button
              onClick={handleConfirm}
              disabled={!amount || parseInt(amount, 10) <= 0}
              className="mt-6 h-14 w-full text-lg font-semibold"
            >
              {tr('upiConfirm')}
            </Button>
          </div>
        )}

        {step === 'done' && (
          <div className="app-fade-in flex flex-col items-center justify-center px-5 py-16">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <p className="text-center text-lg font-semibold text-gray-900">
              {tr('upiPaymentSuccess', { amount: amount, name: tr('upiReceiverName') })}
            </p>
            <p className="mt-2 text-xs text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              {tr('upiSimulatedBanner')}
            </p>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
