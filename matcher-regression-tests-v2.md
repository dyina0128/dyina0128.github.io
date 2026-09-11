# Benefit Matcher V2 regression checks

Use these checks after rule-engine changes. These are product regression checks, not a new feasibility round.

## Regional hard-gate checks

1. Incheon / Namdong profile must never receive Seoul, Busan, Daegu, or another Incheon district-only benefit as a shown recommendation.
2. Seoul profile must never receive Incheon-only or Namdong-only benefits as shown recommendations.
3. Incheon / Yeonsu profile must never receive Namdong-only benefits as shown recommendations.
4. If a district is required by a rule but the user leaves district blank, the rule must remain `needs_info`; it must not be promoted to `likely` or `automatic`.
5. Regions whose district selector is not implemented may receive only nationwide rules plus rules whose `region` exactly matches the selected province/city. District-only rules must not be guessed.

## Test User #001 sanity check

Profile: Incheon, Namdong-gu, 1972 birth year, 2-person household, spouse yes, children no, employed, one earner, income band 500–700, jeonse.

Expected behavior:
- Incheon Citizen Safety Insurance can appear as automatic when no other rule blocks it.
- Child-only benefits must be excluded.
- Youth age-limited benefits must be excluded.
- Namdong youth challenge must be excluded by age/employment.
- Housing/welfare rules requiring recognized income/assets must remain `needs_info` rather than being approved from salary band alone.
- Transit/ferry/bridge/digital-learning benefits that depend on actual use or interest should remain `conditional_use`.

## Release rule

Do not merge V2 into `main` during the current AdSense review. Before any future public release, run these checks on mobile and desktop and record failures/fixes.
