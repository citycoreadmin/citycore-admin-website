# CityCore Admin public website

The public website is a static Help Center with article search, language selection across the 106-locale registry,
light/dark themes, and the CityCore Admin privacy policy.

Support ticket messaging and the staff dashboard are intentionally not included in this public release. The support
system will be enabled only after the separate Supabase staging security and functional tests pass.

Cloudflare Workers serves `privacy.html` at the canonical `/privacy` URL and redirects `/privacy.html` to it using
`auto-trailing-slash` HTML handling. Test both direct URLs in a Workers preview before publication.
Workers publishes only the `.assetsignore` allowlist, including every runtime dependency of the public JavaScript.
Keep new public modules in that allowlist. A simple HTTP server does not apply these exclusions and can hide
deployment-only missing-asset errors; use the Workers preview for release checks.

The language selector lists the union of the requested website languages and the iOS language selector. English is
the only locale currently marked complete and enabled. French and Haitian Creole, plus initial translations for
Spanish, Portuguese, German, Italian, Arabic, Simplified and Traditional Chinese, Japanese, Korean, Russian,
Hindi, Bengali, Urdu, and Turkish, as well as Dutch, Polish, Ukrainian, Romanian, Greek, Swedish, Norwegian Bokmål,
Danish, Finnish, Icelandic, Slovenian, Lithuanian, Latvian, Czech, Slovak, Hungarian, Bulgarian, Serbian, Croatian, Bosnian,
Albanian, Macedonian, Estonian, Irish, Welsh, Scottish Gaelic, Maltese, Basque, Amharic, Somali, Yoruba, Igbo, Hausa,
Zulu, Xhosa, Malagasy, Kinyarwanda, Shona, Sesotho, Pashto, Kurmanji, Armenian, Georgian, Azerbaijani, Kazakh, Uzbek,
Mongolian, Nepali, Sinhala, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Odia, Burmese, Khmer,
Catalan, Galician, Afrikaans, Swahili, Persian, Hebrew, Thai,
Vietnamese, Indonesian,
Malay, Filipino, US and UK English, Latin American Spanish, and Brazilian Portuguese, are marked Review needed
(90 locales total) and disabled. The regional drafts build on their existing
base-language translations; their regional wording also requires fluent-speaker review. French and Haitian
Creole should be prioritized for fluent-speaker review. All non-English Privacy Policy
translations require operator and native-speaker review. These initial translations were drafted from the English
source and need fluent-speaker review before completion. The other 15 locales remain marked Coming soon and
disabled until all public UI, Help Center articles, search, errors, and policy text are translated and reviewed.
Locale data is in `js/locales/`. Run coverage checks with `node --test tests/localization.test.mjs`.

The language chooser is a searchable, keyboard-accessible dialog that identifies Complete, Review needed, and
Coming soon locales. It is constrained to the viewport on mobile; unsupported Wales and Scotland subdivision
flags fall back to a globe while keeping the native language names visible.

If browser storage is denied or full, public controls continue to work for the current page and log a warning.
No unavailable translation is enabled by this fallback.

Run unit checks with `npm ci && npm test`. For repeatable touch-enabled WebKit checks at 320, 375, 390, and 430px,
install the test browser with `npx playwright install --with-deps webkit`, start a local Workers preview with
`npx wrangler dev --local --port 8124`, and run `npm run test:mobile`. This checks normal, denied, and quota-limited
storage, asset loading, language approval restrictions, search, categories, navigation, theme, and `/privacy` routing.
Set `PREVIEW_URL` to run the same checks against a hosted branch preview instead.

Run locally with `python3 -m http.server 8123` and open `http://localhost:8123`. This simple server does not emulate
Cloudflare's extensionless HTML routing; open `/privacy.html` directly for local policy checks.
GitHub Pages is also configured to publish `main` at `/` for `citycoreadmin.com`; its routing must be verified
separately. Confirm Cloudflare production settings before publication.
