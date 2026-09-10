# Benefit Matcher V2 — 10-person MVP test (2026-09-10)

Branch-only test. Do not merge to main during AdSense review.

## Personas
1. Incheon/Namdong, born 1972, employed, married 2-person household, no children, jeonse.
2. Incheon/Namdong, born 1998, unemployed/jobseeker, single, rent.
3. Incheon/Namdong, born 1993, employed, married, child present, rent.
4. Incheon/Namdong, born 1982, self-employed, married, children, owner-occupied.
5. Incheon/Namdong, born 1960, jobseeker, single, rent.
6. Incheon/Namdong, born 1950, retired/other, single, owner-occupied.
7. Incheon/Yeonsu, born 1988, employed, single, jeonse.
8. Seoul, born 1975, employed, married, owner-occupied.
9. Incheon/Namdong, born 2003, student, single, rent.
10. Incheon/Namdong, born 1990, business/self-employed, single, rent.

## Findings

### PASS
- Residence filtering works: Incheon-only rules are excluded for the Seoul persona.
- District filtering works: Namdong-only rules do not leak to Yeonsu.
- Hard age exclusions work for youth and senior programs.
- Employment filtering correctly separates employed/jobseeker/business/student cases where the rule declares allowed states.
- Automatic citizen safety insurance is correctly surfaced for Incheon residents.
- Eligibility uncertainty and practical relevance are separated (`needs_info` vs `conditional_use`).

### FAIL / COVERAGE GAPS
1. **Child/family profile is collected but barely used.** A parent with a young child does not yet receive core child benefits because the DB lacks child-age fields and family rules. Incheon currently publishes child/family programs such as 천사(1040)지원금, so this is a material omission.
2. **Income band is collected but the engine does not use it.** Income-tested rules fall into `needs_info` regardless of broad income band. This is safe but creates too many unresolved results.
3. **Household size, spouse and children are collected but not used by most rules.** This makes the questionnaire feel longer than the matching intelligence currently justifies.
4. **Application freshness is static.** `check_current_program`, `first_come`, and `planned_or_ongoing` can become stale without a date/status refresh layer.
5. **Benefit value is not ranked.** Counseling/services can compete visually with cash, insurance, discounts, and high-value training support.
6. **Some relevance flags need explicit engine support.** New rules using `needsDigitalLearningInterest` and `needsBridgeUse` must always map to `conditional_use` rather than plain `likely`.
7. **Coverage is too Incheon/adult-heavy for a general launch.** Current DB is useful for the Test User #001 case but not yet representative of families, young parents, or nationwide users.
8. **Namdong youth rule needs a verified official URL before production.**

## Test verdict after round 2
**MVP concept: PASS. Production readiness: NOT YET.**

The core rule architecture behaves sensibly on hard constraints, but the database and profile schema are not yet balanced. The most important round-3 fixes are:

1. Make every collected question earn its place: either use household/spouse/children/income-band in rules or remove/defer it.
2. Add a small verified family/child rule set and child-age progressive question.
3. Add benefit kind/value tier so money/insurance/discount/training outrank low-value services.
4. Add stale-status protection using verification dates/application dates.
5. Fix/verify missing official URLs and rerun the same 10 personas.

Round 3 must end with GO / MODIFY-THEN-GO / STOP; no indefinite extra test loop.
