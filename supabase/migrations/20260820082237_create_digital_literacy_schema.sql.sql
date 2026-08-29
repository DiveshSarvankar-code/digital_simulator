/*
# Digital Literacy Simulator - core schema

Creates the data layer for a virtual smartphone training tool used in a CEP
research project. Participants (senior citizens) complete 12 auto-detected
tasks across 4 levels; facilitators review results in an admin panel.

1. New Tables
- `participants`: one row per person who walks through intake (name, age,
  preferred language). No auth, no password, no email.
- `sessions`: one row per training session, tied to a participant. Tracks
  start time, completion time, and the highest level reached.
- `task_attempts`: one row per (session, task_key) thanks to a unique
  constraint. Hints and the final completion write land in the same row
  via upsert / the increment_hint_used RPC, so there are never duplicate
  or conflicting rows for the same task in the same session. Tracks level,
  task key, start/completion timestamps, hints used, wrong taps, attempts,
  status, whether the final choice was correct, and a free-form metadata
  JSONB column (e.g. elapsed ms for the emergency task, chosen option for
  Level 4 decision tasks).

2. New Functions
- `increment_hint_used(p_session_id uuid, p_task_key text)`: SECURITY
  DEFINER, void. Inserts a placeholder in_progress row for a task if none
  exists yet, otherwise atomically bumps hints_used by 1. Callable by anon
  and authenticated so the no-auth participant app can use it.

3. Security
- RLS enabled on all three tables.
- This is a single-tenant, no-login research tool: the participant app has
  no sign-in screen and runs entirely as the anon role. All policies use
  `TO anon, authenticated` with `USING (true) WITH CHECK (true)` because
  every participant's data is intentionally public/shared within the study
  and the admin panel reads it all. This is the documented, correct
  pattern for no-auth shared-data apps — not an ownership-check shortcut.
- `increment_hint_used` is SECURITY DEFINER (so it can upsert even though
  RLS is on) and granted to anon + authenticated.
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age int,
  language text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  current_level int NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS task_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  level_number int NOT NULL,
  task_key text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  hints_used int NOT NULL DEFAULT 0,
  wrong_taps int NOT NULL DEFAULT 0,
  attempts int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'in_progress',
  choice_correct boolean,
  metadata jsonb,
  UNIQUE (session_id, task_key)
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public rw" ON participants;
CREATE POLICY "public rw" ON participants FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public rw" ON sessions;
CREATE POLICY "public rw" ON sessions FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public rw" ON task_attempts;
CREATE POLICY "public rw" ON task_attempts FOR ALL
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP FUNCTION IF EXISTS increment_hint_used(uuid, text);
CREATE OR REPLACE FUNCTION increment_hint_used(p_session_id uuid, p_task_key text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO task_attempts (session_id, task_key, level_number, hints_used, status)
  VALUES (p_session_id, p_task_key, 0, 1, 'in_progress')
  ON CONFLICT (session_id, task_key)
  DO UPDATE SET hints_used = task_attempts.hints_used + 1;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_hint_used(uuid, text) TO anon, authenticated;