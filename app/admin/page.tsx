import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/admin-auth';
import { getServerSupabase } from '@/lib/supabase-server';
import { TASKS } from '@/lib/tasks';
import AdminPanelClient from './admin-panel-client';

export const dynamic = 'force-dynamic';

interface TaskAttemptRow {
  id: string;
  session_id: string;
  level_number: number;
  task_key: string;
  started_at: string;
  completed_at: string | null;
  hints_used: number;
  wrong_taps: number;
  attempts: number;
  status: string;
  choice_correct: boolean | null;
  metadata: Record<string, unknown> | null;
}

interface ParticipantRow {
  id: string;
  name: string;
  age: number | null;
  language: string | null;
  venue: string | null;
  visit_date: string | null;
  created_at: string;
  sessions: {
    id: string;
    started_at: string;
    completed_at: string | null;
    current_level: number;
  }[];
}

interface AssessmentRow {
  id: string;
  learner_id: string;
  task_id: string;
  phase: string;
  can_do_unaided: boolean | null;
  confidence_rating: number | null;
  facilitator_observed_pass: boolean | null;
}

interface AssessmentTaskRow {
  id: string;
  name: string;
  module: string;
  display_order: number;
}

export default async function AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!verifySessionToken(token)) {
    redirect('/admin/login');
  }

  const supabase = getServerSupabase();

  // Parallel fetch: participants+sessions, task_attempts, assessments, assessment_tasks
  const [
    { data: participantsData, error: pErr },
    { data: attemptsData, error: aErr },
    { data: assessmentsData, error: asErr },
    { data: assessmentTasksData, error: atErr },
  ] = await Promise.all([
    supabase.from('participants').select(`
      id, name, age, language, venue, visit_date, created_at,
      sessions ( id, started_at, completed_at, current_level )
    `),
    supabase.from('task_attempts').select('*'),
    supabase.from('assessments').select('id, learner_id, task_id, phase, can_do_unaided, confidence_rating, facilitator_observed_pass'),
    supabase.from('assessment_tasks').select('id, name, module, display_order').order('display_order'),
  ]);

  if (pErr || aErr || asErr || atErr) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-lg font-semibold text-destructive">Failed to load data</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {(pErr || aErr || asErr || atErr)?.message}
          </p>
        </div>
      </div>
    );
  }

  const participants = (participantsData ?? []) as unknown as ParticipantRow[];
  const attempts = (attemptsData ?? []) as TaskAttemptRow[];

  // Build lookup: sessionId -> attempts
  const attemptsBySession = new Map<string, TaskAttemptRow[]>();
  for (const a of attempts) {
    const arr = attemptsBySession.get(a.session_id) ?? [];
    arr.push(a);
    attemptsBySession.set(a.session_id, arr);
  }

  // Serialize everything for the client component
  const data = participants.map((p) => {
    const session = p.sessions?.[0];
    const sessionAttempts = session ? (attemptsBySession.get(session.id) ?? []) : [];
    return {
      id: p.id,
      name: p.name,
      age: p.age,
      language: p.language,
      venue: p.venue,
      visit_date: p.visit_date,
      created_at: p.created_at,
      session: session
        ? {
            id: session.id,
            started_at: session.started_at,
            completed_at: session.completed_at,
            current_level: session.current_level,
          }
        : null,
      attempts: sessionAttempts.map((a) => ({
        task_key: a.task_key,
        level_number: a.level_number,
        started_at: a.started_at,
        completed_at: a.completed_at,
        hints_used: a.hints_used,
        wrong_taps: a.wrong_taps,
        attempts: a.attempts,
        status: a.status,
        choice_correct: a.choice_correct,
        metadata: a.metadata,
      })),
    };
  });

  const taskKeys = TASKS.map((t) => t.key);

  const assessmentTasks = (assessmentTasksData ?? []) as AssessmentTaskRow[];
  const assessmentRows = (assessmentsData ?? []) as AssessmentRow[];

  // Build assessment data: learnerId -> array of assessments
  const assessmentsByLearner = new Map<string, AssessmentRow[]>();
  for (const a of assessmentRows) {
    const arr = assessmentsByLearner.get(a.learner_id) ?? [];
    arr.push(a);
    assessmentsByLearner.set(a.learner_id, arr);
  }

  const assessmentData = data.map((p) => ({
    learner_id: p.id,
    assessments: (assessmentsByLearner.get(p.id) ?? []).map((a) => ({
      task_id: a.task_id,
      phase: a.phase,
      can_do_unaided: a.can_do_unaided,
      confidence_rating: a.confidence_rating,
      facilitator_observed_pass: a.facilitator_observed_pass,
    })),
  }));

  return (
    <AdminPanelClient
      participants={data}
      taskKeys={taskKeys}
      assessmentTasks={assessmentTasks.map((t) => ({ id: t.id, name: t.name, module: t.module, display_order: t.display_order }))}
      assessments={assessmentData}
    />
  );
}
