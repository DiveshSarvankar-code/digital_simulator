'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users, TrendingUp, Lightbulb, Clock, Download, Printer, LogOut,
  ChevronDown, ChevronUp, ChevronRight, CheckCircle2, XCircle, ArrowUpDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TASKS, TOTAL_TASKS } from '@/lib/tasks';
import { translations } from '@/lib/i18n';

interface ParticipantData {
  id: string;
  name: string;
  age: number | null;
  language: string | null;
  created_at: string;
  session: {
    id: string;
    started_at: string;
    completed_at: string | null;
    current_level: number;
  } | null;
  attempts: {
    task_key: string;
    level_number: number;
    started_at: string;
    completed_at: string | null;
    hints_used: number;
    wrong_taps: number;
    attempts: number;
    status: string;
    choice_correct: boolean | null;
    metadata: Record<string, unknown> | null;
  }[];
}

interface Props {
  participants: ParticipantData[];
  taskKeys: string[];
}

type SortKey = 'name' | 'age' | 'level' | 'completed' | 'time' | 'hints' | 'wrongTaps' | 'date';

function fmtDuration(sec: number | null): string {
  if (sec === null || sec === undefined) return '—';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function taskTitle(key: string): string {
  const task = TASKS.find((t) => t.key === key);
  if (!task) return key;
  return translations.en[task.titleKey];
}

export default function AdminPanelClient({ participants, taskKeys }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [printMode, setPrintMode] = useState(false);

  // Compute per-participant stats
  const participantStats = useMemo(() => {
    return participants.map((p) => {
      const completed = p.attempts.filter((a) => a.status === 'completed').length;
      const completionPct = (completed / TOTAL_TASKS) * 100;
      const totalHints = p.attempts.reduce((sum, a) => sum + a.hints_used, 0);
      const totalWrongTaps = p.attempts.reduce((sum, a) => sum + a.wrong_taps, 0);
      const levelReached = p.session?.current_level ?? 1;

      let totalSec: number | null = null;
      if (p.session?.started_at && p.session?.completed_at) {
        totalSec = Math.round(
          (new Date(p.session.completed_at).getTime() - new Date(p.session.started_at).getTime()) / 1000
        );
      }

      return {
        ...p,
        completed,
        completionPct,
        totalHints,
        totalWrongTaps,
        levelReached,
        totalSec,
      };
    });
  }, [participants]);

  // Summary stats
  const summary = useMemo(() => {
    const total = participants.length;
    if (total === 0) {
      return { total: 0, avgCompletion: 0, avgHints: 0, avgTime: 0 };
    }
    const avgCompletion = participantStats.reduce((s, p) => s + p.completionPct, 0) / total;
    const avgHints = participantStats.reduce((s, p) => s + p.totalHints, 0) / total;
    const completedSessions = participantStats.filter((p) => p.totalSec !== null);
    const avgTime = completedSessions.length > 0
      ? completedSessions.reduce((s, p) => s + (p.totalSec ?? 0), 0) / completedSessions.length
      : 0;
    return { total, avgCompletion, avgHints, avgTime };
  }, [participantStats, participants.length]);

  // Per-task difficulty
  const taskDifficulty = useMemo(() => {
    return TASKS.map((task) => {
      const taskAttempts = participants.flatMap((p) =>
        p.attempts.filter((a) => a.task_key === task.key)
      );
      const completedCount = taskAttempts.filter((a) => a.status === 'completed').length;
      const completionRate = taskAttempts.length > 0 ? (completedCount / taskAttempts.length) * 100 : 0;
      const avgHints = taskAttempts.length > 0
        ? taskAttempts.reduce((s, a) => s + a.hints_used, 0) / taskAttempts.length
        : 0;
      const completedWithTime = taskAttempts.filter((a) => a.status === 'completed' && a.started_at && a.completed_at);
      const avgTime = completedWithTime.length > 0
        ? completedWithTime.reduce((s, a) => {
            return s + (new Date(a.completed_at!).getTime() - new Date(a.started_at).getTime()) / 1000;
          }, 0) / completedWithTime.length
        : 0;
      return {
        key: task.key,
        level: task.level,
        title: taskTitle(task.key),
        attempts: taskAttempts.length,
        completedCount,
        completionRate,
        avgHints,
        avgTime: Math.round(avgTime),
      };
    });
  }, [participants]);

  // Level 4 safety literacy
  const safetyStats = useMemo(() => {
    const calc = (taskKey: 'fake_sms' | 'otp_scam') => {
      const allAttempts = participants.flatMap((p) =>
        p.attempts.filter((a) => a.task_key === taskKey)
      );
      const correctFirstTry = allAttempts.filter((a) => a.choice_correct === true && a.attempts <= 1).length;
      const correctAfterWrong = allAttempts.filter((a) => a.choice_correct === true && a.attempts > 1).length;
      const total = allAttempts.length;
      return { correctFirstTry, correctAfterWrong, total };
    };
    return {
      sms: calc('fake_sms'),
      otp: calc('otp_scam'),
    };
  }, [participants]);

  // Sorting
  const sorted = useMemo(() => {
    const sortedCopy = [...participantStats];
    sortedCopy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'age': cmp = (a.age ?? 0) - (b.age ?? 0); break;
        case 'level': cmp = a.levelReached - b.levelReached; break;
        case 'completed': cmp = a.completed - b.completed; break;
        case 'time': cmp = (a.totalSec ?? 0) - (b.totalSec ?? 0); break;
        case 'hints': cmp = a.totalHints - b.totalHints; break;
        case 'wrongTaps': cmp = a.totalWrongTaps - b.totalWrongTaps; break;
        case 'date': cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sortedCopy;
  }, [participantStats, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const handleLogout = async () => {
    await fetch('/admin/api/logout', { method: 'POST' });
    router.refresh();
  };

  const downloadCSV = () => {
    const rows: string[] = [];
    rows.push('Participant,Age,Language,Level Reached,Tasks Completed,Total Time (s),Total Hints,Total Wrong Taps,Session Completed Date,' +
      TASKS.map((t) => `${taskTitle(t.key)} - Status`).join(',') + ',' +
      TASKS.map((t) => `${taskTitle(t.key)} - Hints`).join(',') + ',' +
      TASKS.map((t) => `${taskTitle(t.key)} - Wrong Taps`).join(',') + ',' +
      TASKS.map((t) => `${taskTitle(t.key)} - Attempts`).join(',') + ',' +
      TASKS.map((t) => `${taskTitle(t.key)} - Time (s)`).join(',') + ',' +
      TASKS.map((t) => `${taskTitle(t.key)} - Choice Correct`).join(','));

    for (const p of participantStats) {
      const attemptMap = new Map(p.attempts.map((a) => [a.task_key, a]));
      const values: string[] = [
        `"${p.name.replace(/"/g, '""')}"`,
        String(p.age ?? ''),
        String(p.language ?? ''),
        String(p.levelReached),
        String(p.completed),
        String(p.totalSec ?? ''),
        String(p.totalHints),
        String(p.totalWrongTaps),
        p.session?.completed_at ? new Date(p.session.completed_at).toISOString() : '',
      ];
      for (const task of TASKS) {
        const a = attemptMap.get(task.key);
        values.push(a?.status ?? 'not_started');
      }
      for (const task of TASKS) {
        const a = attemptMap.get(task.key);
        values.push(String(a?.hints_used ?? 0));
      }
      for (const task of TASKS) {
        const a = attemptMap.get(task.key);
        values.push(String(a?.wrong_taps ?? 0));
      }
      for (const task of TASKS) {
        const a = attemptMap.get(task.key);
        values.push(String(a?.attempts ?? 0));
      }
      for (const task of TASKS) {
        const a = attemptMap.get(task.key);
        let timeStr = '';
        if (a?.completed_at && a?.started_at) {
          timeStr = String(Math.round((new Date(a.completed_at).getTime() - new Date(a.started_at).getTime()) / 1000));
        }
        values.push(timeStr);
      }
      for (const task of TASKS) {
        const a = attemptMap.get(task.key);
        values.push(a?.choice_correct === null ? '' : String(a?.choice_correct ?? ''));
      }
      rows.push(values.join(','));
    }

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `digital-literacy-data-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (printMode) {
    return <PrintView participants={participantStats} taskDifficulty={taskDifficulty} safetyStats={safetyStats} summary={summary} onExit={() => setPrintMode(false)} />;
  }

  const SortHeader = ({ label, keyName }: { label: string; keyName: SortKey }) => (
    <button
      onClick={() => handleSort(keyName)}
      className="flex items-center gap-1 hover:text-foreground"
    >
      {label}
      <ArrowUpDown className={cn('h-3 w-3', sortKey === keyName ? 'text-primary' : 'text-muted-foreground/50')} />
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Digital Literacy Simulator — CEP Research</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPrintMode(true)} className="gap-2">
              <Printer className="h-4 w-4" /> Print View
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCSV} className="gap-2">
              <Download className="h-4 w-4" /> CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {/* Summary stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<Users className="h-5 w-5" />} label="Total Participants" value={String(summary.total)} color="blue" />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Avg Completion" value={`${summary.avgCompletion.toFixed(0)}%`} color="green" />
          <StatCard icon={<Lightbulb className="h-5 w-5" />} label="Avg Hints Used" value={summary.avgHints.toFixed(1)} color="amber" />
          <StatCard icon={<Clock className="h-5 w-5" />} label="Avg Session Time" value={fmtDuration(Math.round(summary.avgTime))} color="slate" />
        </div>

        {participants.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-lg font-medium text-gray-900">No participants yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Data will appear here once participants start completing tasks.</p>
          </Card>
        ) : (
          <>
            {/* Participant table */}
            <Card className="overflow-hidden">
              <div className="border-b border-border px-4 py-3">
                <h2 className="font-semibold text-gray-900">Participants</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-medium"><SortHeader label="Name" keyName="name" /></th>
                      <th className="px-3 py-2.5 text-left font-medium"><SortHeader label="Age" keyName="age" /></th>
                      <th className="px-3 py-2.5 text-left font-medium"><SortHeader label="Level" keyName="level" /></th>
                      <th className="px-3 py-2.5 text-left font-medium"><SortHeader label="Done /12" keyName="completed" /></th>
                      <th className="px-3 py-2.5 text-left font-medium"><SortHeader label="Time" keyName="time" /></th>
                      <th className="px-3 py-2.5 text-left font-medium"><SortHeader label="Hints" keyName="hints" /></th>
                      <th className="px-3 py-2.5 text-left font-medium"><SortHeader label="Wrong" keyName="wrongTaps" /></th>
                      <th className="px-3 py-2.5 text-left font-medium"><SortHeader label="Date" keyName="date" /></th>
                      <th className="px-3 py-2.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sorted.map((p) => (
                      <ParticipantRow key={p.id} participant={p} expanded={expanded === p.id} onToggle={() => setExpanded(expanded === p.id ? null : p.id)} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Per-task difficulty */}
            <Card className="overflow-hidden">
              <div className="border-b border-border px-4 py-3">
                <h2 className="font-semibold text-gray-900">Per-Task Difficulty</h2>
                <p className="text-xs text-muted-foreground">Identify which tasks are hardest across all participants</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-medium">Level</th>
                      <th className="px-3 py-2.5 text-left font-medium">Task</th>
                      <th className="px-3 py-2.5 text-left font-medium">Attempts</th>
                      <th className="px-3 py-2.5 text-left font-medium">Completed</th>
                      <th className="px-3 py-2.5 text-left font-medium">Completion Rate</th>
                      <th className="px-3 py-2.5 text-left font-medium">Avg Hints</th>
                      <th className="px-3 py-2.5 text-left font-medium">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {taskDifficulty.map((t) => (
                      <tr key={t.key} className="hover:bg-muted/30">
                        <td className="px-3 py-2.5">
                          <Badge variant="outline">L{t.level}</Badge>
                        </td>
                        <td className="px-3 py-2.5 font-medium text-gray-900">{t.title}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{t.attempts}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{t.completedCount}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  t.completionRate >= 80 ? 'bg-success' : t.completionRate >= 50 ? 'bg-warning' : 'bg-destructive'
                                )}
                                style={{ width: `${t.completionRate}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{t.completionRate.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">{t.avgHints.toFixed(1)}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{fmtDuration(t.avgTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Level 4 safety literacy */}
            <Card className="p-5">
              <div className="mb-4">
                <h2 className="font-semibold text-gray-900">Level 4 Safety Literacy</h2>
                <p className="text-xs text-muted-foreground">Correct choice on first try vs after a wrong attempt</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <SafetyCard title="Fake SMS Identification" stats={safetyStats.sms} />
                <SafetyCard title="OTP Scam Recognition" stats={safetyStats.otp} />
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: 'blue' | 'green' | 'amber' | 'slate' }) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    slate: 'bg-slate-100 text-slate-600',
  };
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', colorMap[color])}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}

function ParticipantRow({ participant, expanded, onToggle }: { participant: ParticipantData & { completed: number; completionPct: number; totalHints: number; totalWrongTaps: number; levelReached: number; totalSec: number | null }; expanded: boolean; onToggle: () => void }) {
  const completedDate = participant.session?.completed_at
    ? new Date(participant.session.completed_at).toLocaleDateString()
    : '—';

  return (
    <>
      <tr className="cursor-pointer hover:bg-muted/30" onClick={onToggle}>
        <td className="px-3 py-3 font-medium text-gray-900">{participant.name}</td>
        <td className="px-3 py-3 text-muted-foreground">{participant.age ?? '—'}</td>
        <td className="px-3 py-3"><Badge variant="outline">L{participant.levelReached}</Badge></td>
        <td className="px-3 py-3">
          <span className={cn('font-medium', participant.completed === TOTAL_TASKS ? 'text-success' : 'text-gray-700')}>
            {participant.completed}/{TOTAL_TASKS}
          </span>
        </td>
        <td className="px-3 py-3 text-muted-foreground">{fmtDuration(participant.totalSec)}</td>
        <td className="px-3 py-3 text-muted-foreground">{participant.totalHints}</td>
        <td className="px-3 py-3 text-muted-foreground">{participant.totalWrongTaps}</td>
        <td className="px-3 py-3 text-muted-foreground">{completedDate}</td>
        <td className="px-3 py-3 text-right">
          {expanded ? <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground" /> : <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={9} className="bg-slate-50 px-3 py-4">
            <div className="rounded-lg border border-border bg-white p-4">
              <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">Per-Task Breakdown</p>
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium">Task</th>
                    <th className="px-2 py-2 text-left font-medium">Status</th>
                    <th className="px-2 py-2 text-left font-medium">Attempts</th>
                    <th className="px-2 py-2 text-left font-medium">Hints</th>
                    <th className="px-2 py-2 text-left font-medium">Wrong Taps</th>
                    <th className="px-2 py-2 text-left font-medium">Time</th>
                    <th className="px-2 py-2 text-left font-medium">Choice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {TASKS.map((task) => {
                    const a = participant.attempts.find((x) => x.task_key === task.key);
                    return (
                      <tr key={task.key}>
                        <td className="px-2 py-2 font-medium text-gray-900">
                          <span className="text-xs text-muted-foreground">L{task.level}</span>{' '}
                          {taskTitle(task.key)}
                        </td>
                        <td className="px-2 py-2">
                          {a?.status === 'completed' ? (
                            <span className="flex items-center gap-1 text-success">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                            </span>
                          ) : a?.status === 'in_progress' ? (
                            <span className="text-amber-600">In Progress</span>
                          ) : (
                            <span className="text-muted-foreground">Not started</span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-muted-foreground">{a?.attempts ?? '—'}</td>
                        <td className="px-2 py-2 text-muted-foreground">{a?.hints_used ?? 0}</td>
                        <td className="px-2 py-2 text-muted-foreground">{a?.wrong_taps ?? 0}</td>
                        <td className="px-2 py-2 text-muted-foreground">
                          {a?.completed_at && a?.started_at
                            ? fmtDuration(Math.round((new Date(a.completed_at).getTime() - new Date(a.started_at).getTime()) / 1000))
                            : '—'}
                        </td>
                        <td className="px-2 py-2">
                          {a?.choice_correct === true && <span className="text-success">✓ Correct</span>}
                          {a?.choice_correct === false && <span className="text-destructive">✗ Wrong</span>}
                          {(a?.choice_correct === null || a?.choice_correct === undefined) && <span className="text-muted-foreground">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function SafetyCard({ title, stats }: { title: string; stats: { correctFirstTry: number; correctAfterWrong: number; total: number } }) {
  const firstTryPct = stats.total > 0 ? (stats.correctFirstTry / stats.total) * 100 : 0;
  const afterWrongPct = stats.total > 0 ? (stats.correctAfterWrong / stats.total) * 100 : 0;
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="mb-3 font-medium text-gray-900">{title}</p>
      {stats.total === 0 ? (
        <p className="text-sm text-muted-foreground">No data yet</p>
      ) : (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Correct on first try</span>
              <span className="font-semibold text-success">{stats.correctFirstTry} ({firstTryPct.toFixed(0)}%)</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-success" style={{ width: `${firstTryPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Correct after wrong attempt</span>
              <span className="font-semibold text-warning">{stats.correctAfterWrong} ({afterWrongPct.toFixed(0)}%)</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-warning" style={{ width: `${afterWrongPct}%` }} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Total attempts: {stats.total}</p>
        </div>
      )}
    </div>
  );
}

function PrintView({ participants, taskDifficulty, safetyStats, summary, onExit }: {
  participants: (ParticipantData & { completed: number; completionPct: number; totalHints: number; totalWrongTaps: number; levelReached: number; totalSec: number | null })[];
  taskDifficulty: { key: string; level: number; title: string; attempts: number; completedCount: number; completionRate: number; avgHints: number; avgTime: number }[];
  safetyStats: { sms: { correctFirstTry: number; correctAfterWrong: number; total: number }; otp: { correctFirstTry: number; correctAfterWrong: number; total: number } };
  summary: { total: number; avgCompletion: number; avgHints: number; avgTime: number };
  onExit: () => void;
}) {
  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      <div className="mx-auto max-w-4xl print:hidden">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">Print Summary</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900">Digital Literacy Simulator — Research Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generated: {new Date().toLocaleString()}</p>

        <div className="mt-6 grid grid-cols-4 gap-3">
          <div className="border border-border p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Participants</p>
            <p className="text-xl font-bold">{summary.total}</p>
          </div>
          <div className="border border-border p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Avg Completion</p>
            <p className="text-xl font-bold">{summary.avgCompletion.toFixed(0)}%</p>
          </div>
          <div className="border border-border p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Avg Hints</p>
            <p className="text-xl font-bold">{summary.avgHints.toFixed(1)}</p>
          </div>
          <div className="border border-border p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">Avg Time</p>
            <p className="text-xl font-bold">{fmtDuration(Math.round(summary.avgTime))}</p>
          </div>
        </div>

        <h2 className="mt-8 text-lg font-semibold">Participants</h2>
        <table className="mt-2 w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-1.5 text-left">Name</th>
              <th className="py-1.5 text-left">Age</th>
              <th className="py-1.5 text-left">Level</th>
              <th className="py-1.5 text-left">Done</th>
              <th className="py-1.5 text-left">Time</th>
              <th className="py-1.5 text-left">Hints</th>
              <th className="py-1.5 text-left">Wrong</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id} className="border-b border-border/50">
                <td className="py-1.5">{p.name}</td>
                <td className="py-1.5">{p.age ?? '—'}</td>
                <td className="py-1.5">L{p.levelReached}</td>
                <td className="py-1.5">{p.completed}/{TOTAL_TASKS}</td>
                <td className="py-1.5">{fmtDuration(p.totalSec)}</td>
                <td className="py-1.5">{p.totalHints}</td>
                <td className="py-1.5">{p.totalWrongTaps}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-8 text-lg font-semibold">Per-Task Difficulty</h2>
        <table className="mt-2 w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-1.5 text-left">Task</th>
              <th className="py-1.5 text-left">Completion</th>
              <th className="py-1.5 text-left">Avg Hints</th>
              <th className="py-1.5 text-left">Avg Time</th>
            </tr>
          </thead>
          <tbody>
            {taskDifficulty.map((t) => (
              <tr key={t.key} className="border-b border-border/50">
                <td className="py-1.5">L{t.level} — {t.title}</td>
                <td className="py-1.5">{t.completionRate.toFixed(0)}%</td>
                <td className="py-1.5">{t.avgHints.toFixed(1)}</td>
                <td className="py-1.5">{fmtDuration(t.avgTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-8 text-lg font-semibold">Level 4 Safety Literacy</h2>
        <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
          <div className="border border-border p-3 rounded-lg">
            <p className="font-medium">Fake SMS</p>
            <p>First try: {safetyStats.sms.correctFirstTry}/{safetyStats.sms.total}</p>
            <p>After wrong: {safetyStats.sms.correctAfterWrong}/{safetyStats.sms.total}</p>
          </div>
          <div className="border border-border p-3 rounded-lg">
            <p className="font-medium">OTP Scam</p>
            <p>First try: {safetyStats.otp.correctFirstTry}/{safetyStats.otp.total}</p>
            <p>After wrong: {safetyStats.otp.correctAfterWrong}/{safetyStats.otp.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
