/*
# Pre/Post Assessment Module

Adds a facilitator-driven assessment layer on top of the existing DLS
training flow. Facilitators record a baseline (pre) check before the
training session and a post check after, for 4 key digital-literacy tasks.

## 1. Modified Tables

### participants
- `venue` (text, nullable): where the assessment took place (e.g. "Pune Library").
- `visit_date` (date, nullable): the date of the visit/session.

These are added with ALTER TABLE ... ADD COLUMN IF NOT EXISTS so existing
rows are untouched.

## 2. New Tables

### assessment_tasks
Reference table seeded with 4 rows representing the skills being assessed.
- `id` (uuid PK)
- `name` (text, not null) — human-readable task name
- `module` (text, not null) — category/module grouping
- `display_order` (int, default 0) — controls ordering on the assessment form

### assessments
One row per (learner, task, phase). Phase is 'pre' or 'post'.
- `id` (uuid PK)
- `learner_id` (uuid, FK → participants, ON DELETE CASCADE)
- `task_id` (uuid, FK → assessment_tasks, ON DELETE CASCADE)
- `phase` (text, CHECK in ('pre','post'))
- `can_do_unaided` (boolean, nullable) — facilitator answers "Can [learner] do this unaided?"
- `confidence_rating` (int, nullable, CHECK 1–5) — facilitator-rated confidence slider
- `facilitator_observed_pass` (boolean, nullable) — only filled for phase='post'
- `created_at` (timestamptz, default now())
- UNIQUE (learner_id, task_id, phase) — prevents duplicate pre/post rows

## 3. Seed Data

4 assessment_tasks:
1. WhatsApp message (communication)
2. WhatsApp video call (communication)
3. Scam/phishing recognition (safety)
4. UPI payment (digital_services)

## 4. Security

- RLS enabled on both new tables.
- This is a single-tenant, no-login research tool (same model as the
  existing tables). All policies use `TO anon, authenticated` with
  `USING (true) WITH CHECK (true)` because facilitator and admin data
  is intentionally shared within the study.
- `assessment_tasks` is read-only reference data — SELECT only for
  anon/authenticated (seeded by this migration, never written by the app).

## 5. Indexes

- `assessments(learner_id)` — frequent lookups by participant.
- `assessments(learner_id, phase)` — fetching all pre or all post for a learner.
*/

-- Add venue + visit_date to participants
ALTER TABLE participants ADD COLUMN IF NOT EXISTS venue text;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS visit_date date;

-- Assessment tasks reference table
CREATE TABLE IF NOT EXISTS assessment_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  module text NOT NULL,
  display_order int NOT NULL DEFAULT 0
);

ALTER TABLE assessment_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_assessment_tasks" ON assessment_tasks;
CREATE POLICY "anon_read_assessment_tasks" ON assessment_tasks FOR SELECT
  TO anon, authenticated USING (true);

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES assessment_tasks(id) ON DELETE CASCADE,
  phase text NOT NULL CHECK (phase IN ('pre','post')),
  can_do_unaided boolean,
  confidence_rating int CHECK (confidence_rating IS NULL OR (confidence_rating BETWEEN 1 AND 5)),
  facilitator_observed_pass boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (learner_id, task_id, phase)
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_assessments" ON assessments;
CREATE POLICY "anon_select_assessments" ON assessments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_assessments" ON assessments;
CREATE POLICY "anon_insert_assessments" ON assessments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_assessments" ON assessments;
CREATE POLICY "anon_update_assessments" ON assessments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_assessments" ON assessments;
CREATE POLICY "anon_delete_assessments" ON assessments FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assessments_learner_id ON assessments(learner_id);
CREATE INDEX IF NOT EXISTS idx_assessments_learner_phase ON assessments(learner_id, phase);

-- Seed assessment tasks (idempotent: only insert if table is empty)
INSERT INTO assessment_tasks (name, module, display_order)
SELECT * FROM (VALUES
  ('WhatsApp message', 'communication', 1),
  ('WhatsApp video call', 'communication', 2),
  ('Scam/phishing recognition', 'safety', 3),
  ('UPI payment (simulated)', 'digital_services', 4)
) AS v(name, module, display_order)
WHERE NOT EXISTS (SELECT 1 FROM assessment_tasks);
