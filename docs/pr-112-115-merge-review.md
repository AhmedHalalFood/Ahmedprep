# PR #112 + PR #115: combined Preview decisions

Date: 2026-11-25. **PREVIEW ONLY; NOT OWNER APPROVAL FOR PRODUCTION.**

## Foundation: retained from PR #115
- Founder Tariq Ahmed personally teaches SHSAT and Digital SAT classes, with concise messaging on the homepage, program, About and enrollment pages.
- Short Winter-first enrollment page, reduced duplicate class and tuition sections, improved mobile sticky CTA, and corrected free Sunday schedule.
- Established Winter, Spring and Summer cohort catalog, 12-student cap, 2027 tuition prices and inquiry-only / full-payment process.
- Explicit warning for provisional holiday makeup dates, plus the master-plan reconciliation in `docs/pr-115-2027-master-plan-reconciliation.md`.

## Selected from PR #112 and now integrated
- Added official NYCPS SHSAT and College Board SAT reference-link component to both prep pages. Official exam registration rules and dates remain separate from AhmedPrep class enrollment.
- Preserved PR #112's detailed student learning portal / original question-bank / self-paced subscriptions blueprint as a **planning-only** document, not a live app or advertisement.

## PR #112 additions withheld pending explicit decisions
1. **Spring weekday Digital SAT** was changed to 6:30–9:30 PM live online, versus the earlier approved 5:30–8:30 PM in person.
2. **Summer** proposed dropping Digital SAT weekday and SHSAT weekend cohorts, moving the SHSAT weekday start to July 1, and changing Digital SAT weekends to a five-hour / 72-hour format. The current published plan uses two 96-hour weekday intensives and two 48-hour weekend classes.
3. **Fall 2027** proposed two new intensives; dates, tuition and class structure not approved in the standing source.
4. **Annual SHSAT package** proposed 336 hours and prices of $6,720 / $5,712 / $5,040. Its eligibility, refund and payment conditions require approval.
5. **Automatic retirement** would hide classes after their final date, block inquiries via server API and redirect enrollment pages. This is a good future feature but requires a separate, tested release plan with protection of enquiries already underway. The proposal's date-cutoff tests should be reviewed alongside its impact on cached pages and historical reports.
6. **2026 Digital SAT intensive automatic closure** is safe in principle, but should be tested with the existing deployed route and inquiry API in a separate PR.
7. **30-day vs 28-day early-pay deadlines** remain explicitly unresolved. Preserve the baseline until owner signs off.
8. **Net instruction time vs scheduled hours** requires confirmation of break policy before public guarantees.

## Acceptance conditions
- Maintain Winter 2027 enrollment priority and no human photos.
- Check small-screen layout, class selection, tuition display, and no repeated gold sticky CTA.
- Verify all calendar counts, form validation and responses, full/waitlist cases, and deadline copy.
- Do not merge PR #112 or PR #115 independently after approving this unified revision without comparing their effects.
- No merge, production deploy, database, email, payment or automatic expiry changes without separate owner approval.
