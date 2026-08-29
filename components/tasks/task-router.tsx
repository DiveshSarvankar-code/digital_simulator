'use client';

import { useLang } from '@/lib/language-context';
import { t, type TranslationDict } from '@/lib/i18n';
import type { TaskKey } from '@/lib/tasks';
import { TextSizeTask } from '@/components/tasks/l1/text-size-task';
import { BrightnessTask } from '@/components/tasks/l1/brightness-task';
import { WifiTask } from '@/components/tasks/l1/wifi-task';
import { WhatsappMessageTask } from '@/components/tasks/l2/whatsapp-message-task';
import { WhatsappMediaTask } from '@/components/tasks/l2/whatsapp-media-task';
import { SearchTask } from '@/components/tasks/l2/search-task';
import { MapsTask } from '@/components/tasks/l3/maps-task';
import { UpiTask } from '@/components/tasks/l3/upi-task';
import { ReminderTask } from '@/components/tasks/l3/reminder-task';
import { FakeSmsTask } from '@/components/tasks/l4/fake-sms-task';
import { OtpScamTask } from '@/components/tasks/l4/otp-scam-task';
import { EmergencyTask } from '@/components/tasks/l4/emergency-task';

export interface TaskProps {
  lang: 'en' | 'hi' | 'mr';
  tr: (key: keyof TranslationDict, vars?: Record<string, string | number>) => string;
  onComplete: (opts?: { choiceCorrect?: boolean; metadata?: Record<string, unknown>; wrongTaps?: number; attempts?: number }) => void;
  onWrongTap: () => void;
}

export function TaskRouter({
  taskKey,
  lang,
  onComplete,
  onWrongTap,
}: {
  taskKey: TaskKey;
  lang: 'en' | 'hi' | 'mr';
  onComplete: (opts?: { choiceCorrect?: boolean; metadata?: Record<string, unknown>; wrongTaps?: number; attempts?: number }) => void;
  onWrongTap: () => void;
}) {
  const { lang: ctxLang } = useLang();
  const activeLang = ctxLang || lang;
  const tr = (key: keyof TranslationDict, vars?: Record<string, string | number>) =>
    t(activeLang, key, vars);

  const props: TaskProps = { lang: activeLang, tr, onComplete, onWrongTap };

  switch (taskKey) {
    case 'text_size': return <TextSizeTask {...props} />;
    case 'brightness': return <BrightnessTask {...props} />;
    case 'wifi': return <WifiTask {...props} />;
    case 'whatsapp_message': return <WhatsappMessageTask {...props} />;
    case 'whatsapp_media': return <WhatsappMediaTask {...props} />;
    case 'search': return <SearchTask {...props} />;
    case 'maps': return <MapsTask {...props} />;
    case 'upi': return <UpiTask {...props} />;
    case 'reminder': return <ReminderTask {...props} />;
    case 'fake_sms': return <FakeSmsTask {...props} />;
    case 'otp_scam': return <OtpScamTask {...props} />;
    case 'emergency': return <EmergencyTask {...props} />;
    default: return null;
  }
}
