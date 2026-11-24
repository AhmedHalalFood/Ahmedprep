# AhmedPrep Student Learning Portal: implementation blueprint

Status: PLANNED ONLY. Owner requested secure class-specific student login, homework, online quizzes, online practice tests, and automatic grading. This document is a technical design proposal, not an implemented portal. Do not modify production or enable student accounts without approval and verified testing.

## Product goal

An authenticated portal embedded at ahmedprep.com/student (not a generic external link). Accounts for students, instructors, and optionally parents. Students can access only their own class(es), work and results. Admins manage course rosters, teachers, assignments, original AhmedPrep question bank, grading rules and parent reports. Existing public practice tools remain separate.

## Current site findings (Nov 2026)

- Next.js 16 / React 19 on Vercel; pg/Drizzle and Neon lead database are present.
- lib/student-portal.ts only exposes an approved external HTTPS URL via NEXT_PUBLIC_STUDENT_PORTAL_URL. Main navigation shows Student Login only if this variable is configured. This is not an authentication system.
- Public /weekly-shsat-challenge and /tools/shsat-readiness-quiz are unrelated to authenticated assignments and do not establish persistent per-student grades.
- GradeCam use is currently a separate, manual workflow. No GradeCam connector or score import is currently implemented.
- Do not reuse lead forms/lead_submissions as a learning-management database. Use separate properly authorized tables and storage.

## Role-based experiences

Student: login with individual account; see only active enrolled cohorts and past personal results; assignments due, timed quizzes, full-length practice exams, feedback, progress charts, and downloads. Finished cohorts disappear from public marketing but remain in student's private academic history.

Teacher: assigned class roster, upload/author questions and answer keys, assign due dates, set test time windows and question navigation rules, monitor attempts, manually grade open responses, release grades and explanations.

Admin: create cohorts and enrollments, invite/disable accounts, assign instructors, publish assessments, audit submissions, export records, correct answer keys with regrading and an audit trail.

Parent/guardian (optional Phase 2): view only linked minor's progress, homework status and teacher comments, never other students.

## Proposed URL architecture

- /student/login and /student (protected home)
- /student/classes/[cohortId]
- /student/assignments/[assignmentId]
- /student/attempts/[attemptId]/review
- /student/progress
- /teacher, /teacher/classes/[cohortId], /teacher/question-bank, /teacher/assessments
- /admin/portal (admin-only; enrollment and access audit)

## Phase 1: minimum viable portal

1. Choose and integrate managed authentication with email verification, secure sessions, password reset, rate limiting, and a safe account invitation flow. Do not build custom password cryptography. Avoid creating real minor accounts with shared passwords.
2. Implement database schema (separate migration, reviewed before running):
   users (auth ID, role, active state), student_profiles (minimal data), cohorts (reference existing canonical cohort IDs), enrollments (student/cohort/instructor), assignments, questions (type/topic/answer key/explanation), question_options, submissions/attempts, responses, grading_events, optional files/resources.
3. Enforce server-side authorization on every read/write; never accept a student ID/role from untrusted client input. Test cross-class access and direct URL tampering.
4. Teacher can assign one multiple-choice quiz to one cohort, students submit once and receive raw score and teacher-approved explanations. Save individual answers and timestamps. Teacher can see class completion and export CSV.
5. Homework: linked PDF and online quiz assignments with due dates, late status, and manual grading where required.
6. Automated raw-score grading: exact multiple choice, multi-select, and properly normalized numeric responses, with versioned answer key. No unofficial scaled SAT score claims. Free response routes to teacher review. Retakes configurable; changes audit-logged.
7. Hide answer keys until submit or scheduled release. Timer enforced server-side with clear time accommodations; persistence across refresh; prevent simultaneous submission races.
8. Protect minors: collect only needed fields, confirm age and parental/guardian consent requirements, role-separated access, privacy notice/retention policy, secure storage; never post performance publicly.

## Phase 2: course assessments & parent tracking

- Question bank tagged SHSAT ELA/Math and Digital SAT Reading & Writing/Math by skill, standards, difficulty (teacher-only), source/license, version, and expected time.
- Multiple quiz forms, randomized option order without breaking answer keys, partial credit rules defined explicitly, progress by strand/topic, diagnostic vs follow-up comparison.
- Exam mode: configurable section/module timing, breaks, allowed calculator, accommodations, submission recovery and teacher review. Describe Digital SAT practice as AhmedPrep simulations; College Board Bluebook remains the official digital practice testing app. Do not claim an unofficial practice is adaptive or provides official 400–1600 scoring.
- Parent weekly/four-week progress reports generated from verified results and instructor notes; teacher approval before sending. Optional guardian view with verified relationship.

## GradeCam interoperability

Treat GradeCam as optional separate integration; do not imply it is connected. First assess whether supported export/import or permitted API exists. If no supported automated integration, allow a teacher-controlled CSV import with validated student mapping and duplicate protection.

## Relation to program retirement

Public seasonal ads, schedules and enrollment opportunities retire after final class. Private authenticated students retain access to their already-assigned graded work and historical reports according to retention policy. Teachers retain records for legitimate educational use, subject to retention/deletion policy. This distinction is intentional.

## Security and launch gates

- Preview environment and database separate from production; migrations first in dev; no production data copied without safeguards.
- Verify authentication, recovery, invite flow, role access, cross-student isolation, data export, retention, and incident handling.
- Load test full 12-student class simultaneous timed submissions; verify server-side deadline/timer and auto-grading accuracy.
- Test responsiveness/accessibility and keyboard navigation.
- Obtain owner approval for login provider, privacy/parent policy, question import requirements, and first pilot cohort.
- Never merge/deploy or send student invitations without explicit owner approval.

## Recommended launch sequence

Pilot one class with 10–20 original AhmedPrep questions and a test student account; teacher reviews every answer key and explanation. After pilot success, add SHSAT and SAT homework, full-length original mock exams, and parent dashboards. Full Bluebook equivalence is neither claimed nor required.
