'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageProvider } from '@/lib/language-context';
import { supabase } from '@/lib/supabase-browser';
import { t, type TranslationDict } from '@/lib/i18n';
import { TASKS, TOTAL_TASKS, STORAGE_KEY, levelNameKey, taskByKey, type TaskKey, type ParticipantState } from '@/lib/tasks';
import { TaskRouter } from '@/components/tasks/task-router';
import { HintButton } from '@/components/tasks/hint-button';
import { CheckCircle2, Loader2 } from 'lucide-react';

function LearnContent() {
  const router = useRouter();
  const [state, setState] = useState<ParticipantState | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        router.replace('/');
        return;
      }
      const parsed = JSON.parse(raw) as ParticipantState;
      setState(parsed);
      setLoading(false);
    } catch {
      router.replace('/');
    }
  }, [router]);

  const currentTask = TASKS[currentIndex];

  const handleComplete = useCallback(
    (opts?: { choiceCorrect?: boolean; metadata?: Record<string, unknown>; wrongTaps?: number; attempts?: number }) => {
      if (!state || advancing) return;
      setAdvancing(true);
      setShowComplete(true);

      const task = currentTask;
      const now = new Date().toISOString();

      // Fire-and-forget: write to DB in the background, don't block the UI transition.
      // Progress continues locally regardless of network speed.
      supabase.from('task_attempts').upsert({
        session_id: state.sessionId,
        task_key: task.key,
        level_number: task.level,
        completed_at: now,
        hints_used: 0,
        wrong_taps: opts?.wrongTaps ?? 0,
        attempts: opts?.attempts ?? 1,
        status: 'completed',
        choice_correct: opts?.choiceCorrect ?? null,
        metadata: opts?.metadata ?? null,
      }, { onConflict: 'session_id,task_key' }).then();

      if (currentIndex + 1 >= TOTAL_TASKS) {
        supabase
          .from('sessions')
          .update({ completed_at: now, current_level: 4 })
          .eq('id', state.sessionId)
          .then();
      } else {
        const nextLevel = TASKS[currentIndex + 1].level;
        if (nextLevel > task.level) {
          supabase
            .from('sessions')
            .update({ current_level: nextLevel })
            .eq('id', state.sessionId)
            .then();
        }
      }

      // Short, snappy transition — no artificial wait for DB
      setTimeout(() => {
        setShowComplete(false);
        if (currentIndex + 1 >= TOTAL_TASKS) {
          router.push('/assessment?phase=post');
        } else {
          setCurrentIndex((i) => i + 1);
          setAdvancing(false);
        }
      }, 700);
    },
    [state, advancing, currentTask, currentIndex, router]
  );

  const handleWrongTap = useCallback(
    (taskKey: TaskKey) => {
      if (!state) return;
      // Fire-and-forget
      supabase
        .from('task_attempts')
        .upsert({
          session_id: state.sessionId,
          task_key: taskKey,
          level_number: taskByKey(taskKey)?.level ?? 0,
          wrong_taps: 1,
          status: 'in_progress',
        }, { onConflict: 'session_id,task_key' })
        .then();
    },
    [state]
  );

  const handleHint = useCallback(
    (taskKey: TaskKey) => {
      if (!state) return;
      // Fire-and-forget
      supabase.rpc('increment_hint_used', {
        p_session_id: state.sessionId,
        p_task_key: taskKey,
      }).then();
    },
    [state]
  );

  if (loading || !state) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const tr = (key: keyof TranslationDict) => t(state.language, key);
  const levelName = tr(levelNameKey(currentTask.level));

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-slate-50">
      {/* Top bar: progress + level/task info */}
      <div className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-muted-foreground">
              {tr('levelLabel')} {currentTask.level} · {levelName}
            </p>
            <p className="truncate text-lg font-semibold text-gray-900">
              {tr('taskLabel')} {currentIndex + 1}/{TOTAL_TASKS}: {tr(currentTask.titleKey)}
            </p>
          </div>
          <HintButton
            hints={[tr(currentTask.hintKeys[0]), tr(currentTask.hintKeys[1]), tr(currentTask.hintKeys[2])]}
            onHint={() => handleHint(currentTask.key)}
            label={tr('hintButton')}
            title={tr('hintTitle')}
            noMoreText={tr('hintNoMore')}
          />
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentIndex / TOTAL_TASKS) * 100}%` }}
          />
        </div>
      </div>

      {/* Instruction */}
      <div className="px-3 py-3">
        <div className="rounded-xl bg-accent/50 px-4 py-3.5 text-lg leading-relaxed text-accent-foreground">
          {tr(currentTask.instructionKey)}
        </div>
      </div>

      {/* Task area — fills the rest of the screen, scrolls internally */}
      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3">
        <TaskRouter
          taskKey={currentTask.key}
          lang={state.language}
          onComplete={handleComplete}
          onWrongTap={() => handleWrongTap(currentTask.key)}
        />
      </div>

      {/* Completion overlay — fast */}
      {showComplete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <div className="slide-up flex flex-col items-center rounded-2xl bg-white px-8 py-6 shadow-2xl">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <p className="text-base font-semibold text-gray-900">{tr('taskComplete')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LearnContentWithLang />
    </Suspense>
  );
}

function LearnContentWithLang() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ParticipantState;
        setLang(parsed.language);
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <LanguageProvider initialLang={lang}>
      <LearnContent />
    </LanguageProvider>
  );
}
