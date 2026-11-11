# CityCore Admin public website

The public website is a static Help Center with article search, language selection (English, French and Haitian Creole),
light/dark themes, and the CityCore Admin privacy policy.

Support ticket messaging and the staff dashboard are intentionally not included in this public release. The support
system will be enabled only after the separate Supabase staging security and functional tests pass.

Run locally with `python3 -m http.server 8123` and open `http://localhost:8123`.
GitHub Pages is configured to publish `main` at `/` for `citycoreadmin.com`. Cloudflare Workers Builds is used for
branch previews; confirm its production branch/deploy settings in the Cloudflare dashboard before publication.
