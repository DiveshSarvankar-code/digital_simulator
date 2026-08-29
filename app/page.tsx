'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';
import { LANGUAGES, t, type Language, type TranslationDict } from '@/lib/i18n';
import { STORAGE_KEY, type ParticipantState } from '@/lib/tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, ChevronRight, Loader2 } from 'lucide-react';

export default function IntakePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [venue, setVenue] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [lang, setLang] = useState<Language>('en');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const tr = (key: keyof TranslationDict) => t(lang, key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(tr('nameRequired'));
      return;
    }
    if (!age.trim()) {
      setError(tr('ageRequired'));
      return;
    }
    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      setError(tr('ageRequired'));
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const { data: participant, error: pErr } = await supabase
        .from('participants')
        .insert({
          name: name.trim(),
          age: parsedAge,
          language: lang,
          venue: venue.trim() || null,
          visit_date: visitDate || null,
        })
        .select('id')
        .maybeSingle();
      if (pErr || !participant) throw pErr ?? new Error('Failed to create participant');

      const { data: session, error: sErr } = await supabase
        .from('sessions')
        .insert({ participant_id: participant.id, current_level: 1 })
        .select('id')
        .maybeSingle();
      if (sErr || !session) throw sErr ?? new Error('Failed to create session');

      // Clear any previously cached local progress so a new participant
      // never inherits a previous participant's leftover session data.
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('dls_progress');
        localStorage.removeItem('dls_task_state');
      } catch {
        // localStorage may be unavailable; non-fatal
      }

      const state: ParticipantState = {
        participantId: participant.id,
        sessionId: session.id,
        name: name.trim(),
        language: lang,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      router.push('/assessment?phase=pre');
    } catch (err: unknown) {
      console.error('Participant intake failed', err);
      const errorRecord = typeof err === 'object' && err !== null ? err as Record<string, unknown> : null;
      const message = errorRecord && typeof errorRecord.message === 'string'
        ? errorRecord.message
        : err instanceof Error
          ? err.message
          : 'We could not save your details. Please check your internet connection and try again.';
      setError(message);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gradient-to-b from-sky-50 via-white to-white px-4 py-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Smartphone className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {t(lang, 'appName')}
          </h1>
          <p className="mt-1 text-base text-muted-foreground">{t(lang, 'appTagline')}</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-1 text-xl font-semibold text-gray-900">{tr('intakeTitle')}</h2>
          <p className="mb-6 text-sm text-muted-foreground">{tr('intakeSubtitle')}</p>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                {tr('nameLabel')}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tr('namePlaceholder')}
                className="h-12 text-base"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-base font-medium">
                {tr('ageLabel')}
              </Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={tr('agePlaceholder')}
                className="h-12 text-base"
                min="1"
                max="120"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue" className="text-base font-medium">
                {tr('venueLabel')}
              </Label>
              <Input
                id="venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder={tr('venuePlaceholder')}
                className="h-12 text-base"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitDate" className="text-base font-medium">
                {tr('visitDateLabel')}
              </Label>
              <Input
                id="visitDate"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">{tr('chooseLanguage')}</Label>
              <div className="grid grid-cols-3 gap-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    className={`touch-target flex flex-col items-center justify-center rounded-xl border-2 px-3 py-4 text-base font-semibold transition-all ${
                      lang === l.code
                        ? 'border-primary bg-primary text-primary-foreground shadow-md'
                        : 'border-border bg-background text-gray-700 hover:border-primary/50 hover:bg-accent'
                    }`}
                    aria-pressed={lang === l.code}
                  >
                    <span className="text-lg">{l.nativeLabel}</span>
                    <span className={`mt-1 text-xs font-normal ${lang === l.code ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {l.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="mt-6 h-14 w-full text-lg font-semibold"
          >
            {submitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ChevronRight className="mr-2 h-5 w-5" />
            )}
            {tr('startButton')}
          </Button>
        </form>
      </div>
    </div>
  );
}
