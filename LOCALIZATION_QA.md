# CityCore Admin localization QA report

**Review date:** 2026-11-14  
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

## First ten language status (updated 2026-11-14)

| Language | Technical draft | Activation / approval status |
| --- | --- | --- |
| English (`en`) | Existing source locale remains complete and enabled. | No translation activation is needed. Operator confirmation of the English Privacy Policy's factual accuracy remains unrecorded. |
| Haitian Creole (`ht`) | Public messages, articles, accessibility labels, and mobile navigation/App Store labels are present. | Disabled; fluent-speaker review of all public copy and operator approval of the Privacy Policy are outstanding. |
| French (`fr`) | Public messages, articles, accessibility labels, and mobile navigation/App Store labels are present. | Disabled; fluent-speaker review of all public copy and operator approval of the Privacy Policy are outstanding. |
| Spanish (`es`) | Public messages, articles, accessibility labels, and mobile navigation/App Store labels are present. | Disabled; fluent-speaker review of all public copy and operator approval of the Privacy Policy are outstanding. |
| Portuguese (`pt`) | Public messages, articles, accessibility labels, and mobile navigation/App Store labels are present. | Disabled; fluent-speaker review of all public copy and operator approval of the Privacy Policy are outstanding. |
| German (`de`) | Public messages, articles, accessibility labels, and mobile navigation/App Store labels are present. | Disabled; fluent-speaker review of all public copy and operator approval of the Privacy Policy are outstanding. |
| Italian (`it`) | Public messages, articles, accessibility labels, and mobile navigation/App Store labels are present. | Disabled; fluent-speaker review of all public copy and operator approval of the Privacy Policy are outstanding. |
| Arabic (`ar`) | Public messages, articles, accessibility labels, and mobile navigation/App Store labels are present; RTL layout has a mobile regression check. | Disabled; fluent-speaker review of all public copy and operator approval of the Privacy Policy are outstanding. |
| Simplified Chinese (`zh-Hans`) | Public messages, articles, accessibility labels, and mobile navigation/App Store labels are present. | Disabled; fluent-speaker review of all public copy and operator approval of the Privacy Policy are outstanding. |
| Japanese (`ja`) | Public messages, articles, accessibility labels, and mobile navigation/App Store labels are present. | Disabled; fluent-speaker review of all public copy and operator approval of the Privacy Policy are outstanding. |

The nine translated modules remain unapproved drafts, not activation-ready locales. Before enabling any of them, a named fluent speaker must review and correct the entire public module, the operator must approve the corresponding Privacy Policy against actual data practices and App Store disclosures, and the corrected modules must pass the technical checks below. No new locale was enabled in this pass. English remains enabled as the source locale; its policy still needs operator factual confirmation before its accuracy can be represented as approved.

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
- Added translated mobile menu, open-menu accessibility, and App Store download labels to the nine non-English target drafts; the localization test now requires these keys for those drafts.
- Added Arabic to the mobile RTL policy-layout regression cases. No mobile navigation markup, styles, App Store destination, locale definitions, or asset rules were changed.
- Added the source `all_cats` message to the seven priority drafts that lacked it (`es`, `pt`, `de`, `it`, `ar`, `zh-Hans`, `ja`). The key is currently unused by the public runtime; the localization test now requires it for all nine target drafts.
- No locale status or enabled-language list was changed. The edits are still AI-assisted drafts and are not approvals.

## First-nine side-by-side editorial review

This review compared the public website message strings, accessibility/mobile-menu labels, Privacy Policy text, and all ten Help Center article titles and steps with `js/locales/en.js`. Auth, ticketing, support dashboard, and staff-only copy are excluded. Entries below are concrete source-to-draft findings for a fluent reviewer; they are not fluent-speaker approvals. Unlisted lines had no definite meaning mismatch identified by this pass, but still need language review before activation.

| Locale | English source → reviewed draft wording | Finding / remaining reviewer action |
| --- | --- | --- |
| Haitian Creole (`ht`) | `p_web`: “Web” → “Web”; `articles.app-crash.title`: “The app crashes or won't load” → “Aplikasyon an sispann fonksyone sanzatann oswa li pa chaje” (“the app unexpectedly stops working or doesn't load”); `invite-members.steps[3]`: “Revoke an invitation” → “Ou ka anile envitasyon an nenpòt ki lè sou menm ekran an” (“you can cancel the invitation at any time on the same screen”). | Priority 1. The requested distinctions are explicit in the draft. Confirm the Haitian Creole idiom and whether “anile” accurately describes revoking an invitation. Also confirm `theme` (“Toggle theme” → “Chanje aparans”, “change appearance”) and `cat_contact` (“Support availability” → “Kilè sipò disponib”, phrased as a question) fit the UI and article-title context. |
| French (`fr`) | `login-problems.steps[0]`: “Check your email address and password for typos.” → “Vérifiez votre adresse e-mail et votre mot de passe pour repérer les fautes de frappe.” | Priority 2. The omitted typo detail is restored. Confirm idiom/register and that quoted English app controls are still the shipped labels; verify ticket/support terminology in the intended region. |
| Spanish (`es`) | Source key `all_cats`: “All categories”; previously absent → now “Todas las categorías”. | The key omission is corrected in the draft; the key is not currently rendered by the runtime. No definite semantic mismatch was identified in the other reviewed public strings or articles. |
| Portuguese (`pt`) | `articles.app-crash.title`: “The app crashes or won't load” → “A aplicação encerra inesperadamente ou não carrega” (“the app closes unexpectedly or doesn't load”). | The revised wording explicitly distinguishes unexpected termination from a freeze. Confirm European Portuguese idiom. The missing `all_cats` key is now present as “Todas as categorias”. |
| German (`de`) | `nav_support`: “Support” → “Support” (unchanged); source key `all_cats`: “All categories”; previously absent → now “Alle Kategorien”. | “Support” is a common German borrowing, not automatically an error; confirm it matches the site's chosen terminology. The missing key is corrected in the draft and is not currently rendered. |
| Italian (`it`) | `nav_home`: “Home” → “Home” (unchanged); `articles.app-crash.title`: “The app crashes or won't load” → “L'app si chiude inaspettatamente o non si carica” (“the app closes unexpectedly or doesn't load”). | Confirm whether “Home” is the intended Italian navigation label or should be localized, and whether the revised crash wording is idiomatic. The missing `all_cats` key is now present as “Tutte le categorie”. |
| Arabic (`ar`) | `nav_download_app_store`: “Download on the App Store” → “حمّل تطبيق CityCore Admin من App Store” (“Download the CityCore Admin app from App Store”). | The button is now an imperative. Confirm register/address form and RTL/brand rendering in context. The missing `all_cats` key is now present as “كل الفئات”. |
| Simplified Chinese (`zh-Hans`) | `articles.panel-settings.steps[3]`: “Use Moderation for sanction and moderation settings.” → “使用‘Moderation’配置处罚和内容审核。” (“configure sanctions and content review/moderation”). | Updated terminology from broad “content management” to “content review/moderation,” including the related `get-started.steps[3]`. Ask the fluent reviewer to confirm this matches the product concept. The missing `all_cats` key is now present as “所有分类”. |
| Japanese (`ja`) | `articles.servers.title`: “Find and create Admin Panels” → “管理パネルを見つけて作成する” (“find and create admin panels”). | The title now explicitly conveys finding. Confirm natural Japanese phrasing. The missing `all_cats` key is now present as “すべてのカテゴリー”. |

The low-risk wording corrections listed above have been applied as unapproved drafts. English app-control names in article steps remain unchanged because they are intended to match the shipped app interface. Reviewers should verify all remaining strings and article steps, not only the corrected examples in this table. No locale has been approved or enabled.

## WOOBENS STUDIO Privacy Policy approval checklist

### Facts verified from this repository's current public implementation

- The public pages are a static Help Center and Privacy Policy. The homepage contains client-side article search and a support-availability notice, not an account/payment form or support-ticket submission form (`index.html`, `js/home.js`).
- The site persists selected language, theme, and platform in browser `localStorage` (`cc_lang`, `cc_theme`, `cc_platform`); the preference code reads/writes those keys and continues for the page if browser storage is blocked or full (`js/i18n.js`, `js/ui.js`, `js/home.js`, `js/preferences.js`).
- The mobile download button and policy link point to the CityCore Admin App Store URL recorded in `index.html` and `privacy.html`.
- The English policy itself states that hosting-provider request-data handling has not been confirmed and that the operator has not confirmed the published app's complete data practices (`privacy.html`, English message keys `policy_website_data` and `policy_app_unknown`).

These are code-inspection facts, not an independent audit of production traffic, hosting-provider behavior, the iOS app, or legal compliance.

### Operator decisions and evidence required before policy approval

- [ ] Confirm the legal identity and role of WOOBENS STUDIO as operator/controller, the correct contact address, and the jurisdictions served.
- [ ] Confirm the live website storage behavior against the list above, including the purpose and lifetime of each preference, whether any additional storage or cookies are used, and whether any analytics, advertising, or third-party scripts are active.
- [ ] Obtain Cloudflare/hosting-provider documentation or operator configuration evidence for request metadata (including IP addresses), logs, cookies, subprocessors, retention/deletion periods, and any cross-border processing. Do not treat these as absent merely because they are not implemented in the repository.
- [ ] Open the current public App Store listing and compare its privacy labels with the policy sentence naming Name, Email Address, and Photos or Videos, including whether each data category is collected, linked, and used for App Functionality. Preserve a dated copy or review record. This review could not retrieve the listing independently.
- [ ] Confirm the iOS app's actual collection and use, purposes, user linkage, sharing, tracking, permissions, SDKs/processors, security controls, retention, deletion (including backups), and practices involving children. The App Store label alone does not establish these facts.
- [ ] Confirm the process for account/data deletion requests, identity checks, exclusions, actual processing time, and whether deletion reaches processors and backups. The current policy intentionally promises no automatic deletion or processing timeframe.
- [ ] Confirm the policy's legal disclosures and rights for each intended jurisdiction, the effective/last-updated date, and whether any user categories or age restrictions need to be described.
- [ ] Have an appropriately qualified operator/legal reviewer approve the English source policy and record the reviewer, date, and policy revision. Then have fluent reviewers check each localized policy for complete and equivalent meaning; translations do not themselves establish operator approval.

**Verified facts:** only the code-level website behaviors listed above. **Unresolved claims:** operator identity/jurisdiction, production hosting/logging and storage behavior, current App Store labels, all iOS app data practices, deletion/retention/security/children, and legal sufficiency. No policy approval is recorded.

## Exact remaining activation actions for the nine translations

For each locale below, the locale-specific language reviewer must resolve the listed candidate wording and sign off the full public UI, mobile/accessibility labels, all ten Help Center articles, and complete Privacy Policy. Separately, WOOBENS STUDIO must complete the checklist above and approve that locale's policy. Record named reviewers, dates, policy revision, and corrections. Then rerun the localization and deployment checks on the final corrected text. Only after both approvals may the locale be moved from review-needed to complete/enabled and tested in the selector. No locale is enabled by this approval package.

| Locale | Remaining locale-specific speaker review |
| --- | --- |
| `ht` | Confirm idiom for “Web,” unexpected app termination, and invitation cancellation, plus theme and contact-category terminology; review all other public copy and policy. |
| `fr` | Confirm restored typo wording, terminology, and quoted app controls; review all public copy and policy. |
| `es` | Review all public copy and policy; confirm the newly supplied all-categories label. |
| `pt` | Confirm the unexpected-termination wording is idiomatic; review all public copy and policy. |
| `de` | Confirm “Support” terminology; review all public copy and policy. |
| `it` | Confirm “Home” and unexpected-termination wording; review all public copy and policy. |
| `ar` | Confirm imperative App Store button wording and rendered RTL copy; review all public copy and policy. |
| `zh-Hans` | Confirm the moderation terminology in both cited article steps; review all public copy and policy. |
| `ja` | Confirm naturalness of the revised “find and create” article title; review all public copy and policy. |

## Unresolved questions for reviewers

- A Haitian Creole speaker should review the corrected public wording, decide on the preferred terms for interface concepts, and assess the legal-policy text. Support/dashboard-only `s_title`, `mark_read`, and other non-public support/auth/staff strings in the locale module were not edited; they remain outside this public-site correction pass.
- A French speaker should confirm the revised legal prose, register, assistance/ticket terminology, and all quoted UI labels against the shipped interface.
- A Japanese speaker should approve the new footer wording.
- The operator must confirm that each localized Privacy Policy accurately reflects the live website and App Store disclosures. No legal or factual claims have been independently confirmed by this copyedit.
- The French `privacy-security` article and unmodified public labels were reviewed and left as drafted where no correction was made; native approval is still required.
- Haitian Creole speakers should confirm whether the newly requested “Panèl administrasyon” form and the other requested UI phrasings are natural across regions. They should also resolve the separate non-public support/dashboard wording noted above.

## Technical verification

- `npm test`: 11 tests passed after the mobile-label assertions were added. This checks the 106-locale registry, required public message keys, article structure, placeholder parity, disabled-locale gating, the Japanese footer regression, privacy/navigation markup, RTL direction rules, and storage behavior.
- `npm run test:mobile`: 18 WebKit cases passed against a local Workers preview. This includes the mobile navigation and App Store destinations, storage scenarios, and mobile widths 320, 375, 390, and 430 px.
- The mobile suite checks mobile overflow and RTL policy layout and now renders the Arabic (`ar`) policy draft, in addition to Urdu (`ur`), Hebrew (`he`), and Pashto (`ps`), at each viewport. These locales remain disabled in the product.
- The preview returned HTTP 200 for `/` and `/privacy`; the mobile suite reported no failed assets or page errors. A prior full Workers asset probe returned HTTP 200 for all 106 locale modules and 404 for the excluded test asset; `.assetsignore` was not changed in this pass.

These are technical and AI-assisted triage results only. They are not a substitute for fluent-speaker copyediting or operator/privacy approval.

## Approval gate before enabling any locale

1. Record a named fluent-speaker review and resolve all language-specific corrections for the entire public module.
2. Record operator approval and fluent-speaker review of that locale’s Privacy Policy.
3. Re-run coverage, placeholder, mobile, RTL, and Workers asset checks on the corrected module.
4. Only after both approvals, deliberately move that locale from review-needed to complete/enabled and verify the selector and runtime behavior. Until then, keep it disabled.

No merge or production deployment is authorized by this report.
