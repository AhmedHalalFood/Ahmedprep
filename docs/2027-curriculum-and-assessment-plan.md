# 2027 curriculum and assessment plan (DRAFT — owner review required)

Status: **draft, not final, not published.** Rendered for review at `/curriculum-2027` (noindex, not in the sitemap or navigation). Source of truth: `lib/curriculum-2027.ts`, built on the approved calendars in `lib/cohorts-2027.ts`.

## Session structure

Every session is 3 hours: **75 min Math, 75 min ELA / Reading and Writing, 30 min cumulative practice and review.** Exceptions: session 1 (full-length diagnostic) and mock-exam sessions use the full three hours for testing.

| Course | Cohorts | Sessions | Hours | Diagnostic | Mock exams | Cumulative checkpoints |
| --- | --- | --- | --- | --- | --- | --- |
| Winter / Spring | 8 | 24 | 72 | Session 1 | Sessions 12, 22 | Sessions 7, 17 |
| Summer weekday intensive | 2 | 32 | 96 | Session 1 | Sessions 11, 21, 30 | Sessions 8, 18, 27 |
| Summer weekend | 2 | 16 | 48 | Session 1 | Sessions 8, 15 | Sessions 6, 13 |

Topic sequence: 14 Math and 14 verbal topics per program. 16-session courses combine adjacent topics; 24-session courses split some topics; the 32-session intensive splits most topics into a teach session and an apply-at-test-speed session.

- **SHSAT** — aligned to the NYC DOE SHSAT Student Handbook (Math; ELA Revising/Editing Parts A and B; Reading Comprehension, informational, literary, and poetry).
- **Digital SAT** — aligned to College Board domains: Algebra, Advanced Math, Problem-Solving and Data Analysis, Geometry and Trigonometry; Craft and Structure, Information and Ideas, Standard English Conventions, Expression of Ideas. Every Math session pairs the topic with a Desmos technique.

Dated session-by-session syllabi: `/curriculum-2027/<cohort-id>`. Proposed makeup dates are labeled "Proposed makeup — not yet approved".

## Assessment plan

| Assessment | Frequency | Scoring |
| --- | --- | --- |
| Initial diagnostic | Session 1 | SHSAT: paper, existing GradeCam workflow. Digital SAT: Bluebook score report |
| Weekly quiz (15 min) | Once per week, in the review block | Paper, existing GradeCam workflow |
| Cumulative review checkpoint | 2 per 16/24-session course, 3 per 32-session course | Paper, existing GradeCam workflow |
| Full-length mock exam | 2 per 16/24-session course, 3 per 32-session course | SHSAT: official NYC DOE practice test, GradeCam workflow. Digital SAT: Bluebook |
| Student error log | Every session; teacher review weekly | Not scored; reason codes: content, careless, timing, guess |
| Parent progress report | After diagnostic, after each mock, at course end | Instructor-prepared |

**GradeCam:** the plan is designed for AhmedPrep's existing manual GradeCam scanning workflow. The website has **no** GradeCam integration and none is claimed.

### Progress indicators

- **SHSAT:** Math and ELA raw scores vs. diagnostic; accuracy by Math domain and by ELA area; weekly quiz trend; blanks/guesses under time pressure; error-log categories; attendance and homework.
- **Digital SAT:** section and total Bluebook scores vs. diagnostic; accuracy by the eight content domains; weekly quiz trend; Module 2 difficulty reached; Desmos vs. by-hand solutions; error-log categories; attendance and homework.

## Needs owner decision

1. Wording of the AhmedPrep **SMART method** — the acronym's expansion is not in the codebase, so the curriculum references it by name only.
2. Approval of the topic sequence, mock-exam placement, and which official practice tests are used for diagnostic and mocks.
3. Approval of every makeup date still marked proposed.
4. Whether diagnostic and mock sessions may depart from the 75/75/30 structure (as drafted).
