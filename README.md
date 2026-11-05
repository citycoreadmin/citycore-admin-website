# CityCore Admin website & support center

Static site (GitHub Pages): help center (`index.html`), support widget + ticket system, staff dashboard (`staff.html`),
EN/FR/HT, light/dark.

- `js/config.js`: leave the Supabase values empty for **demo mode** (data stays in the browser's localStorage; sign up as
  `founder@demo.test` to get the demo founder role). Fill in URL + anon key for production. See `supabase/README.md`.
- Local run: `python3 -m http.server 8123`, then open http://localhost:8123
