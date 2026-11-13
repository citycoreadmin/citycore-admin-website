# CityCore Admin public website

The public website is a static Help Center with article search, language selection (English, French and Haitian Creole),
light/dark themes, and the CityCore Admin privacy policy.

Support ticket messaging and the staff dashboard are intentionally not included in this public release. The support
system will be enabled only after the separate Supabase staging security and functional tests pass.

Cloudflare Workers serves `privacy.html` at the canonical `/privacy` URL and redirects `/privacy.html` to it using
`auto-trailing-slash` HTML handling. Test both direct URLs in a Workers preview before publication.

The language selector lists the union of the requested website languages and the iOS language selector. English is
the only locale currently marked complete. French and Haitian Creole remain selectable but are explicitly marked
for review; their Privacy Policy translations require operator and native-speaker review. The other 103 locales
remain unavailable until all public UI, Help Center articles, search, errors, and policy text are translated and
reviewed. Locale data is in `js/locales/`. Run coverage checks with `node --test tests/localization.test.mjs`.

Run locally with `python3 -m http.server 8123` and open `http://localhost:8123`. This simple server does not emulate
Cloudflare's extensionless HTML routing; open `/privacy.html` directly for local policy checks.
GitHub Pages is also configured to publish `main` at `/` for `citycoreadmin.com`; its routing must be verified
separately. Confirm Cloudflare production settings before publication.
