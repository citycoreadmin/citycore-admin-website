# CityCore Admin localization QA report

**Review date:** 2026-11-13  
**Scope:** All 106 locale modules in `js/locales/` and the public website surfaces  
**Disposition:** Technical checks passed; linguistic and policy approval remain outstanding. No locale was approved or enabled.

## Summary

- The registry contains 106 locales and all 106 have a module: English is complete/enabled, while the other 105 are review-needed/disabled.
- All 105 review-needed modules are AI-generated drafts; this includes 103 non-English locales and the English (US) and English (UK) regional variants. No fluent-speaker review or operator approval is recorded.
- Automated checks found no missing locale modules, required public message values, article IDs/steps, or placeholder mismatches.
- An exact-source comparison flagged one likely untranslated public value: Japanese (`ja`) `messages.footer` is still “© 2026 CityCore Admin. All rights reserved.” This needs Japanese copyediting and approval.
- Haitian Creole (`ht`) and French (`fr`) are the first human-review priorities. Potential wording and punctuation concerns are listed below; they are flags for a fluent reviewer, not definitive corrections.
- The 103 non-English Privacy Policies need both operator approval and fluent-speaker review. The English (US) and English (UK) variants also need operator and regional-copy review. Do not enable any locale until its required reviews are documented.

## Per-locale review queue

Each code below is a separate locale requiring the following before approval:

1. A fluent speaker must review spelling, grammar, natural wording, terminology consistency, placeholders, navigation, buttons, accessibility labels, errors, all Help Center articles and steps, and the complete Privacy Policy; make corrections where needed.
2. The operator must review and approve the Privacy Policy for accuracy against the actual website, the iOS App Store disclosures, and the intended data practices.
3. Keep the locale disabled until both reviews are recorded and the corrected module passes the technical checks.

**Priority 1 — Haitian Creole:** `ht`  
**Priority 2 — French:** `fr`

**Remaining 103 locales, in registry order:** `es`, `pt`, `de`, `it`, `ar`, `zh-Hans`, `zh-Hant`, `ja`, `ko`, `ru`, `hi`, `bn`, `ur`, `tr`, `nl`, `pl`, `uk`, `ro`, `el`, `sv`, `nb`, `da`, `fi`, `is`, `cs`, `sk`, `hu`, `bg`, `sr`, `hr`, `bs`, `sl`, `sq`, `mk`, `lt`, `lv`, `et`, `ga`, `cy`, `gd`, `mt`, `eu`, `ca`, `gl`, `af`, `sw`, `am`, `so`, `yo`, `ig`, `ha`, `zu`, `xh`, `mg`, `rw`, `sn`, `st`, `fa`, `he`, `ps`, `kmr`, `hy`, `ka`, `az`, `kk`, `uz`, `mn`, `ne`, `si`, `ta`, `te`, `kn`, `ml`, `mr`, `gu`, `pa`, `or`, `th`, `vi`, `id`, `ms`, `fil`, `my`, `km`, `lo`, `mi`, `en-US`, `en-GB`, `es-419`, `pt-BR`, `be`, `ti`, `rn`, `wo`, `tg`, `ky`, `sm`, `to`, `fj`, `qu`, `ay`, `gn`, `nah`.

## Triage findings

### Haitian Creole (`ht`)

- The module has all required public strings, article content, and matching placeholders.
- A fluent copyeditor should assess punctuation spacing in phrases such as “Bonjou, ki jan nou ka ede w ?”, “Bonjou !”, and “Kisa ou bezwen èd pou li ?”.
- “Tablo bò sipò” (`s_title`) and “Make tout tankou li” (`mark_read`) may be unnatural or unclear in context; verify and correct as the reviewer judges appropriate.
- Review consistency and appropriateness of product/interface terms such as “Panèl Admin”, “tikè”, and “bug”.
- The full Privacy Policy needs native-speaker review and separate operator approval.

### French (`fr`)

- The module has all required public strings, article content, and matching placeholders. No full public message or article step matched its English source exactly, aside from legitimate shared French vocabulary and product/interface labels.
- Review consistency of support terminology (“assistance”, “support”, and “ticket”) and ensure the English control names quoted in article instructions match the shipped interface.
- The full Privacy Policy needs fluent-speaker review and separate operator approval; the policy must not be approved solely because its placeholders and structure pass.

### Other machine-generated drafts

- Japanese (`ja`): the exact-source scan found the English footer quoted above. Replace it with an approved Japanese rendering before enabling `ja`.
- Other exact matches found by the scan include shared product terms, common software labels, and valid cognates (for example platform/support labels). These are not automatically treated as errors, but reviewers should confirm that each is natural and intentional in its locale.
- The English (US) and English (UK) modules are regional variants, not translations into another language; review their regional wording and policy presentation separately.
- No spelling, grammar, idiom, or legal-policy claim is marked “passed” for any locale without a fluent speaker and operator review.

## Technical verification

- `npm test`: 11 tests passed. This checks registry coverage, required public message keys, article structure, placeholder parity, disabled-locale gating, privacy/navigation markup, RTL direction rules, and storage behavior.
- `npm run test:mobile`: all 12 WebKit viewport/storage combinations passed at 320, 375, 390, and 430 px.
- The mobile suite checks mobile overflow and RTL policy layout and renders RTL policy drafts from Urdu (`ur`), Hebrew (`he`), and Pashto (`ps`) at each viewport. These locales remain disabled in the product.
- A Workers preview returned HTTP 200 for all 106 locale module assets; the excluded test asset returned 404. The existing `.assetsignore` locale allow rule is present.

These are technical and AI-assisted triage results only. They are not a substitute for fluent-speaker copyediting or operator/privacy approval.

## Approval gate before enabling any locale

1. Record a named fluent-speaker review and resolve all language-specific corrections for the entire public module.
2. Record operator approval and fluent-speaker review of that locale’s Privacy Policy.
3. Re-run coverage, placeholder, mobile, RTL, and Workers asset checks on the corrected module.
4. Only after both approvals, deliberately move that locale from review-needed to complete/enabled and verify the selector and runtime behavior. Until then, keep it disabled.

No merge or production deployment is authorized by this report.
