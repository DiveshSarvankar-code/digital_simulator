import type { Language } from '@/lib/i18n';

export type TaskKey =
  | 'text_size'
  | 'brightness'
  | 'wifi'
  | 'whatsapp_message'
  | 'whatsapp_media'
  | 'search'
  | 'maps'
  | 'upi'
  | 'reminder'
  | 'fake_sms'
  | 'otp_scam'
  | 'emergency';

export interface TaskDef {
  key: TaskKey;
  level: 1 | 2 | 3 | 4;
  titleKey: keyof import('@/lib/i18n').TranslationDict;
  instructionKey: keyof import('@/lib/i18n').TranslationDict;
  hintKeys: [keyof import('@/lib/i18n').TranslationDict, keyof import('@/lib/i18n').TranslationDict, keyof import('@/lib/i18n').TranslationDict];
  app: 'settings' | 'whatsapp' | 'browser' | 'maps' | 'upi' | 'clock' | 'messages' | 'phone';
}

export const TASKS: TaskDef[] = [
  { key: 'text_size', level: 1, titleKey: 'task_text_size_title', instructionKey: 'task_text_size_instruction', hintKeys: ['task_text_size_hint1', 'task_text_size_hint2', 'task_text_size_hint3'], app: 'settings' },
  { key: 'brightness', level: 1, titleKey: 'task_brightness_title', instructionKey: 'task_brightness_instruction', hintKeys: ['task_brightness_hint1', 'task_brightness_hint2', 'task_brightness_hint3'], app: 'settings' },
  { key: 'wifi', level: 1, titleKey: 'task_wifi_title', instructionKey: 'task_wifi_instruction', hintKeys: ['task_wifi_hint1', 'task_wifi_hint2', 'task_wifi_hint3'], app: 'settings' },
  { key: 'whatsapp_message', level: 2, titleKey: 'task_whatsapp_message_title', instructionKey: 'task_whatsapp_message_instruction', hintKeys: ['task_whatsapp_message_hint1', 'task_whatsapp_message_hint2', 'task_whatsapp_message_hint3'], app: 'whatsapp' },
  { key: 'whatsapp_media', level: 2, titleKey: 'task_whatsapp_media_title', instructionKey: 'task_whatsapp_media_instruction', hintKeys: ['task_whatsapp_media_hint1', 'task_whatsapp_media_hint2', 'task_whatsapp_media_hint3'], app: 'whatsapp' },
  { key: 'search', level: 2, titleKey: 'task_search_title', instructionKey: 'task_search_instruction', hintKeys: ['task_search_hint1', 'task_search_hint2', 'task_search_hint3'], app: 'browser' },
  { key: 'maps', level: 3, titleKey: 'task_maps_title', instructionKey: 'task_maps_instruction', hintKeys: ['task_maps_hint1', 'task_maps_hint2', 'task_maps_hint3'], app: 'maps' },
  { key: 'upi', level: 3, titleKey: 'task_upi_title', instructionKey: 'task_upi_instruction', hintKeys: ['task_upi_hint1', 'task_upi_hint2', 'task_upi_hint3'], app: 'upi' },
  { key: 'reminder', level: 3, titleKey: 'task_reminder_title', instructionKey: 'task_reminder_instruction', hintKeys: ['task_reminder_hint1', 'task_reminder_hint2', 'task_reminder_hint3'], app: 'clock' },
  { key: 'fake_sms', level: 4, titleKey: 'task_fake_sms_title', instructionKey: 'task_fake_sms_instruction', hintKeys: ['task_fake_sms_hint1', 'task_fake_sms_hint2', 'task_fake_sms_hint3'], app: 'messages' },
  { key: 'otp_scam', level: 4, titleKey: 'task_otp_scam_title', instructionKey: 'task_otp_scam_instruction', hintKeys: ['task_otp_scam_hint1', 'task_otp_scam_hint2', 'task_otp_scam_hint3'], app: 'phone' },
  { key: 'emergency', level: 4, titleKey: 'task_emergency_title', instructionKey: 'task_emergency_instruction', hintKeys: ['task_emergency_hint1', 'task_emergency_hint2', 'task_emergency_hint3'], app: 'phone' },
];

export const TOTAL_TASKS = TASKS.length;

export function levelNameKey(level: number): keyof import('@/lib/i18n').TranslationDict {
  switch (level) {
    case 1: return 'level1Name';
    case 2: return 'level2Name';
    case 3: return 'level3Name';
    case 4: return 'level4Name';
    default: return 'level1Name';
  }
}

export function taskByKey(key: TaskKey): TaskDef | undefined {
  return TASKS.find((t) => t.key === key);
}

export function taskIndex(key: TaskKey): number {
  return TASKS.findIndex((t) => t.key === key);
}

export interface ParticipantState {
  participantId: string;
  sessionId: string;
  name: string;
  language: Language;
}

export const STORAGE_KEY = 'dls_state_v1';
