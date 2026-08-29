'use client';

import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';
import { STORAGE_KEY } from '@/lib/tasks';
import { Button } from '@/components/ui/button';
import { CheckCircle2, PartyPopper } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CompletePage() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setLang(parsed.language);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleNewSession = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('dls_progress');
      localStorage.removeItem('dls_task_state');
    } catch {
      // ignore
    }
    router.push('/');
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-white px-4 py-6">
      <div className="w-full max-w-md text-center">
        <div className="relative mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-14 w-14 text-success" />
          </div>
          <PartyPopper className="absolute -right-2 -top-2 h-8 w-8 text-warning" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t(lang, 'thankYouTitle')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {t(lang, 'thankYouMessage')}
        </p>

        <Button
          onClick={handleNewSession}
          className="mt-8 h-14 w-full text-lg font-semibold"
        >
          {t(lang, 'startNewSession')}
        </Button>
      </div>
    </div>
  );
}
