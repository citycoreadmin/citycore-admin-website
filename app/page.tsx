
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-xl font-bold">
          CITYCORE <span className="text-blue-400">ADMIN</span>
        </div>
        <nav className="flex gap-5 text-sm">
          <a href="#features">Features</a>
          <a href="#support">Help Center</a>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-28 text-center">
        <p className="mb-5 font-semibold text-blue-400">
          Created by WOOBENS STUDIO
        </p>
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Manage Your Game Community
          <span className="block text-blue-400">With Confidence.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-300">
          CITYCORE ADMIN helps your team manage servers,
          staff roles, players, sanctions, and support
          in one organized platform.
        </p>
        <a
          href="#features"
          className="mt-10 inline-block rounded-xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-500"
        >
          Explore Features
        </a>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold">
          Powerful Management Tools
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Server Management", "Organize your game servers and communities."],
            ["Staff & Roles", "Manage team members and their permissions."],
            ["Player Management", "Track players and administrative actions."],
            ["Sanctions", "Maintain clear records of moderation decisions."],
            ["Support Tickets", "Organize support requests and reports."],
            ["Security", "Protect access with account authentication."]
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-7"
            >
              <h3 className="mb-3 text-xl font-semibold">{title}</h3>
              <p className="text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="support" className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">Need Help?</h2>
        <p className="mt-4 text-slate-300">
          The CITYCORE ADMIN Help Center is coming soon.
        </p>
      </section>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-400">
        © 2026 WOOBENS STUDIO. CITYCORE ADMIN.
      </footer>
    </main>
  );
}
