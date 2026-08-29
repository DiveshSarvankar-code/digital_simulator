'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';
import { t, type TranslationDict } from '@/lib/i18n';
import { STORAGE_KEY, type ParticipantState } from '@/lib/tasks';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, ChevronRight, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentTaskRow {
  id: string;
  name: string;
  module: string;
  display_order: number;
}

interface AssessmentRow {
  id: string;
  task_id: string;
  phase: string;
  can_do_unaided: boolean | null;
  confidence_rating: number | null;
  facilitator_observed_pass: boolean | null;
}

type Phase = 'pre' | 'post';

interface TaskState {
  canDoUnaided: boolean | null;
  confidence: number;
  observedPass: boolean | null;
}

function AssessmentContent() {
  const router = useRouter();
  const params = useSearchParams();
  const phase = (params.get('phase') as Phase) ?? 'pre';

  const [state, setState] = useState<ParticipantState | null>(null);
  const [tasks, setTasks] = useState<AssessmentTaskRow[]>([]);
  const [existing, setExisting] = useState<Map<string, TaskState>>(new Map());
  const [responses, setResponses] = useState<Map<string, TaskState>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const lang = state?.language ?? 'en';
  const tr = (key: keyof TranslationDict) => t(lang, key);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          router.replace('/');
          return;
        }
        const parsed = JSON.parse(raw) as ParticipantState;
        setState(parsed);

        const [
          { data: taskRows, error: tErr },
          { data: existingRows, error: eErr },
        ] = await Promise.all([
          supabase.from('assessment_tasks').select('id, name, module, display_order').order('display_order'),
          supabase.from('assessments').select('id, task_id, phase, can_do_unaided, confidence_rating, facilitator_observed_pass').eq('learner_id', parsed.participantId).eq('phase', phase),
        ]);

        if (cancelled) return;
        if (tErr || !taskRows) {
          setLoading(false);
          return;
        }

        setTasks(taskRows);

        const existingMap = new Map<string, TaskState>();
        const responseMap = new Map<string, TaskState>();
        for (const row of (existingRows ?? []) as AssessmentRow[]) {
          const ts: TaskState = {
            canDoUnaided: row.can_do_unaided,
            confidence: row.confidence_rating ?? 3,
            observedPass: row.facilitator_observed_pass,
          };
          existingMap.set(row.task_id, ts);
          responseMap.set(row.task_id, { ...ts });
        }
        setExisting(existingMap);
        setResponses(responseMap);
      } catch {
        if (!cancelled) router.replace('/');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [router, phase]);

  const setTaskResponse = useCallback((taskId: string, updates: Partial<TaskState>) => {
    setResponses((prev) => {
      const next = new Map(prev);
      const current = next.get(taskId) ?? { canDoUnaided: null, confidence: 3, observedPass: null };
      next.set(taskId, { ...current, ...updates });
      return next;
    });
  }, []);

  const allAnswered = tasks.length > 0 && tasks.every((task) => {
    const r = responses.get(task.id);
    if (!r) return false;
    if (r.canDoUnaided === null) return false;
    if (phase === 'post' && r.observedPass === null) return false;
    return true;
  });

  const handleSave = async () => {
    if (!state) return;
    setSaving(true);

    const rows = tasks.map((task) => {
      const r = responses.get(task.id);
      const ex = existing.get(task.id);
      return {
        learner_id: state.participantId,
        task_id: task.id,
        phase,
        can_do_unaided: r?.canDoUnaided ?? null,
        confidence_rating: r?.confidence ?? null,
        facilitator_observed_pass: phase === 'post' ? r?.observedPass ?? null : null,
        id: ex ? undefined : undefined,
      };
    });

    for (const row of rows) {
      const existingRow = existing.get(row.task_id);
      if (existingRow) {
        await supabase
          .from('assessments')
          .update({
            can_do_unaided: row.can_do_unaided,
            confidence_rating: row.confidence_rating,
            facilitator_observed_pass: row.facilitator_observed_pass,
          })
          .eq('learner_id', row.learner_id)
          .eq('task_id', row.task_id)
          .eq('phase', row.phase);
      } else {
        await supabase.from('assessments').insert({
          learner_id: row.learner_id,
          task_id: row.task_id,
          phase: row.phase,
          can_do_unaided: row.can_do_unaided,
          confidence_rating: row.confidence_rating,
          facilitator_observed_pass: row.facilitator_observed_pass,
        });
      }
    }

    setSaving(false);
    setSaved(true);

    setTimeout(() => {
      if (phase === 'pre') {
        router.push('/learn');
      } else {
        router.push('/complete');
      }
    }, 800);
  };

  const handleSkip = () => {
    if (phase === 'pre') {
      router.push('/learn');
    } else {
      router.push('/complete');
    }
  };

  if (loading || !state) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">
            {phase === 'pre' ? tr('assessmentBaselineTitle') : tr('assessmentPostTitle')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {phase === 'pre' ? tr('assessmentBaselineSubtitle') : tr('assessmentPostSubtitle')}
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {state.name} · {phase === 'pre' ? tr('assessmentBaselineTitle') : tr('assessmentPostTitle')}
          </p>
        </div>
      </div>

      {/* Task assessments */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-lg space-y-4">
          {tasks.map((task, idx) => {
            const r = responses.get(task.id);
            const canDo = r?.canDoUnaided ?? null;
            const confidence = r?.confidence ?? 3;
            const observed = r?.observedPass ?? null;
            const isAnswered = canDo !== null && (phase !== 'post' || observed !== null);

            return (
              <div
                key={task.id}
                className={cn(
                  'rounded-2xl border bg-card p-4 shadow-sm transition-all',
                  isAnswered ? 'border-success/30' : 'border-border'
                )}
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                    isAnswered ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  )}>
                    {isAnswered ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">{task.name}</p>
                    <p className="text-xs text-muted-foreground">{task.module}</p>
                  </div>
                </div>

                {/* Can do unaided? */}
                <div className="mb-4">
                  <Label className="mb-2 block text-sm font-medium text-gray-700">
                    {tr('assessmentCanDoUnaided')}
                  </Label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setTaskResponse(task.id, { canDoUnaided: true })}
                      className={cn(
                        'touch-target flex-1 rounded-xl border-2 py-3 text-base font-semibold transition-all',
                        canDo === true
                          ? 'border-success bg-success/10 text-success'
                          : 'border-border bg-background text-gray-700 hover:border-success/40'
                      )}
                    >
                      {tr('assessmentCanDoYes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskResponse(task.id, { canDoUnaided: false })}
                      className={cn(
                        'touch-target flex-1 rounded-xl border-2 py-3 text-base font-semibold transition-all',
                        canDo === false
                          ? 'border-destructive bg-destructive/10 text-destructive'
                          : 'border-border bg-background text-gray-700 hover:border-destructive/40'
                      )}
                    >
                      {tr('assessmentCanDoNo')}
                    </button>
                  </div>
                </div>

                {/* Confidence slider */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">
                      {tr('assessmentConfidence')}
                    </Label>
                    <span className={cn(
                      'rounded-full px-2.5 py-0.5 text-sm font-bold',
                      confidence >= 4 ? 'bg-success/10 text-success'
                        : confidence >= 3 ? 'bg-warning/10 text-warning'
                        : 'bg-destructive/10 text-destructive'
                    )}>
                      {confidence}/5
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">1</span>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={confidence}
                      onChange={(e) => setTaskResponse(task.id, { confidence: Number(e.target.value) })}
                      className="flex-1 accent-primary"
                    />
                    <span className="text-xs text-muted-foreground">5</span>
                  </div>
                </div>

                {/* Facilitator observed (post only) */}
                {phase === 'post' && (
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-gray-700">
                      {tr('assessmentFacilitatorObserved')}
                    </Label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setTaskResponse(task.id, { observedPass: true })}
                        className={cn(
                          'touch-target flex-1 rounded-xl border-2 py-3 text-base font-semibold transition-all',
                          observed === true
                            ? 'border-success bg-success/10 text-success'
                            : 'border-border bg-background text-gray-700 hover:border-success/40'
                        )}
                      >
                        {tr('assessmentObservedPass')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskResponse(task.id, { observedPass: false })}
                        className={cn(
                          'touch-target flex-1 rounded-xl border-2 py-3 text-base font-semibold transition-all',
                          observed === false
                            ? 'border-destructive bg-destructive/10 text-destructive'
                            : 'border-border bg-background text-gray-700 hover:border-destructive/40'
                        )}
                      >
                        {tr('assessmentObservedFail')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 z-50 border-t border-border bg-white px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={saving}
            className="h-12 flex-shrink-0"
          >
            <SkipForward className="mr-1.5 h-4 w-4" />
            {tr('assessmentSkip')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !allAnswered}
            className="h-12 flex-1 text-base font-semibold"
          >
            {saving ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="mr-2 h-5 w-5" />
            ) : (
              <ChevronRight className="mr-2 h-5 w-5" />
            )}
            {saved ? tr('assessmentSaved') : tr('assessmentSaveContinue')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
