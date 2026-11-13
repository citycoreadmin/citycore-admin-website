# CityCore Admin localization QA report

**Review date:** 2026-11-13  
**Scope:** All 106 locale modules in `js/locales/` and the public website surfaces  
**Disposition:** Technical checks passed; linguistic and policy approval remain outstanding. No locale was approved or enabled.

## Summary

- The registry contains 106 locales and all 106 have a module: English is complete/enabled, while the other 105 are review-needed/disabled.
- All 105 review-needed modules are AI-generated drafts; this includes 103 non-English locales and the English (US) and English (UK) regional variants. No fluent-speaker review or operator approval is recorded.
- Automated checks found no missing locale modules, required public message values, article IDs/steps, or placeholder mismatches.
- The Japanese (`ja`) footer was an exact English carryover. It is now a Japanese draft consistent with the Japanese copyright wording elsewhere in the module; native copyediting and approval are still required.
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

- Corrected public copy includes punctuation spacing in the greeting, consistent “konfidansyalite” terminology, revised privacy wording, more natural category/status labels, and clearer article instructions. English interface labels remain unchanged and are now distinguished typographically.
- The `{mb}` placeholder and all locale keys are preserved.
- `s_title` (“Tablo bò sipò”) and `mark_read` (“Make tout tankou li”) remain unresolved. They belong to support/dashboard messaging rather than the public website and were not changed in this pass; review them in a separately authorized support-localization task if those strings are in use.
- The full Privacy Policy still requires native-speaker review and separate operator approval.

### French (`fr`)

- Corrected the App Store privacy disclosure wording, the no-processing-time guarantee, and public assistance terminology. Article instructions now use consistent French phrasing and distinguish exact English interface labels; “bogues” replaces the English “bugs” in the public troubleshooting article.
- The `{mb}` placeholder and all locale keys are preserved.
- Fluent review must confirm the assistance/ticket terminology and that quoted English control names match the shipped interface.
- The full Privacy Policy still requires fluent-speaker review and separate operator approval; do not approve it based only on structural checks.

### Other machine-generated drafts

- Japanese (`ja`): replaced the exact English footer carryover with `© 2026 CityCore Admin. 無断複製・転載を禁じます。` as a draft. A native Japanese reviewer must confirm that this rendering is appropriate before enabling `ja`.
- Other exact matches found by the scan include shared product terms, common software labels, and valid cognates (for example platform/support labels). These are not automatically treated as errors, but reviewers should confirm that each is natural and intentional in its locale.
- The English (US) and English (UK) modules are regional variants, not translations into another language; review their regional wording and policy presentation separately.
- No spelling, grammar, idiom, or legal-policy claim is marked “passed” for any locale without a fluent speaker and operator review.

## Corrections made in this pass

- `ht` public messages: refined `skip_content`, language-selector labels, Privacy Policy wording (`policy_intro`, `policy_website_intro`, `policy_website_data`, `policy_app_link`, `policy_app_after`, `policy_app_unknown`, `policy_contact_before`, `policy_contact_after`), the homepage greeting, search/platform/category labels, and contact-status copy. Removed the space before `?` in the homepage greeting and used “konfidansyalite” consistently for privacy references.
- Follow-up Haitian Creole terminology requests were applied: `Panno administrasyon` → `Panèl administrasyon` (including the related article heading and sentence), `Chanje tèm` → `Chanje aparans`, `Gade kategori yo` → `Eksplore kategori yo`, `Disponibilite sipò` → `Kilè sipò disponib`, the language-search empty state was revised, and the app-crash instruction now says `Fèmen aplikasyon an nèt`.
- `ht` Help Center: edited the title/instructions in `servers`, `panel-settings`, `roles`, `account-settings`, `get-started`, `invite-members`, and `app-crash`; clarified the password-reset step, privacy link wording, and `contact` article. All ten public article IDs were reviewed.
- `fr` public messages: revised `policy_app_unknown` and `policy_contact_after`, and standardized public support status wording as “messagerie d'assistance par ticket”.
- `fr` Help Center: edited interface-label presentation and wording in `servers`, `panel-settings`, `roles`, `account-settings`, `get-started`, `login-problems`, `invite-members`, `app-crash`, and `contact`; changed “bugs” to “bogues”. All ten public article IDs were reviewed.
- French terminology follow-up found public assistance wording consistent (`Assistance`, `messagerie d'assistance`, `messagerie d'assistance par ticket`). The 15 English control labels in article instructions remain exact and are quoted; no French text change was needed for this check.
- `ja`: replaced `messages.footer` English text with `© 2026 CityCore Admin. 無断複製・転載を禁じます。` as an unapproved draft and added a regression assertion.
- Retained all keys, article IDs/step counts, and placeholder names, including `{mb}`. No locale status or enabled-language list was changed.
- No locale status or enabled-language list was changed. The edits are still AI-assisted drafts and are not approvals.

## Unresolved questions for reviewers

- A Haitian Creole speaker should review the corrected public wording, decide on the preferred terms for interface concepts, and assess the legal-policy text. Support/dashboard-only `s_title`, `mark_read`, and other non-public support/auth/staff strings in the locale module were not edited; they remain outside this public-site correction pass.
- A French speaker should confirm the revised legal prose, register, assistance/ticket terminology, and all quoted UI labels against the shipped interface.
- A Japanese speaker should approve the new footer wording.
- The operator must confirm that each localized Privacy Policy accurately reflects the live website and App Store disclosures. No legal or factual claims have been independently confirmed by this copyedit.
- The French `privacy-security` article and unmodified public labels were reviewed and left as drafted where no correction was made; native approval is still required.
- Haitian Creole speakers should confirm whether the newly requested “Panèl administrasyon” form and the other requested UI phrasings are natural across regions. They should also resolve the separate non-public support/dashboard wording noted above.

## Technical verification

- `npm test`: 11 tests passed after these corrections. This checks registry coverage, required public message keys, article structure, placeholder parity, disabled-locale gating, the Japanese footer regression, privacy/navigation markup, RTL direction rules, and storage behavior.
- `npm run test:mobile`: all 12 WebKit viewport/storage combinations passed at 320, 375, 390, and 430 px.
- The mobile suite checks mobile overflow and RTL policy layout and renders RTL policy drafts from Urdu (`ur`), Hebrew (`he`), and Pashto (`ps`) at each viewport. These locales remain disabled in the product.
- A Workers preview returned HTTP 200 for all 106 locale module assets and `/privacy`; the excluded test asset returned 404. The existing `.assetsignore` locale allow rule is present.

These are technical and AI-assisted triage results only. They are not a substitute for fluent-speaker copyediting or operator/privacy approval.

## Approval gate before enabling any locale

1. Record a named fluent-speaker review and resolve all language-specific corrections for the entire public module.
2. Record operator approval and fluent-speaker review of that locale’s Privacy Policy.
3. Re-run coverage, placeholder, mobile, RTL, and Workers asset checks on the corrected module.
4. Only after both approvals, deliberately move that locale from review-needed to complete/enabled and verify the selector and runtime behavior. Until then, keep it disabled.

No merge or production deployment is authorized by this report.
