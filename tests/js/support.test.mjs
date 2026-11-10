// Run with: node --test tests/js/   (no dependencies, no network)
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");
let n = 0;

function env({ host = "localhost", cfg = {} } = {}) {
  const store = new Map();
  globalThis.localStorage = { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
  globalThis.window = { CITYCORE_CONFIG: cfg, addEventListener() {} };
  globalThis.location = { hostname: host, origin: `https://${host}`, href: `https://${host}/` };
  return store;
}
const load = async () => import(`../../js/backend.js?${++n}`);
const file = (type = "image/png", size = 100) => ({ name: "a.png", type, size });
const as = async (b, email, pw = "secret1") => { try { await b.signUp(email, pw); } catch { await b.signIn(email, pw); } };

test("static: no secrets or service-role strings in shipped files", () => {
  for (const f of ["js/backend.js", "js/widget.js", "js/staff.js", "js/home.js", "js/ui.js", "js/i18n.js", "js/config.js", "index.html", "staff.html"]) {
    const s = read(f);
    assert.ok(!/service_role/i.test(s), `${f} mentions service_role`);
    assert.ok(!/eyJ[A-Za-z0-9_-]{20,}\./.test(s), `${f} contains a JWT`);
    assert.ok(!/sb_secret_/.test(s), `${f} contains a secret key`);
  }
});

test("static: committed config.js is blank", () => {
  const s = read("js/config.js");
  assert.match(s, /SUPABASE_URL:\s*""/);
  assert.match(s, /SUPABASE_ANON_KEY:\s*""/);
});

test("static: onAuthStateChange callback is synchronous (no deadlock risk)", () => {
  const s = read("js/backend.js");
  const i = s.indexOf("onAuthStateChange(");
  assert.ok(i > 0);
  const cb = s.slice(i, s.indexOf("});", i));
  assert.ok(!/async|await/.test(cb), "auth callback must not await");
  assert.ok(!/sb\./.test(cb.replace(/sb\.auth\.onAuthStateChange\(/, "")), "auth callback must not call Supabase");
});

test("static: i18n keys match across EN / FR / HT", () => {
  const src = read("js/i18n.js");
  const a = src.indexOf("const D = {"), b = src.indexOf("\n};", a);
  const D = new Function(`return ${src.slice(a + 10, b + 2)}`)();
  const en = Object.keys(D.en).sort();
  for (const l of ["fr", "ht"]) {
    const k = Object.keys(D[l]).sort();
    assert.deepEqual(en.filter(x => !k.includes(x)), [], `${l} missing keys`);
    assert.deepEqual(k.filter(x => !en.includes(x)), [], `${l} extra keys`);
  }
  assert.ok(en.includes("err_attach_partial"));
});

test("static: attachment MIME allowlist matches the migration (and excludes SVG)", async () => {
  env();
  const { ALLOWED_MIME } = await load();
  const sql = read("supabase/migrations/20261105000000_support_system.sql");
  for (const m of ALLOWED_MIME) assert.ok(sql.includes(`'${m}'`), `${m} missing in migration`);
  assert.ok(!ALLOWED_MIME.some(m => /svg|html|javascript/.test(m)));
});

test("validateFiles: allowlist, size and count", async () => {
  env(); const { validateFiles } = await load();
  assert.equal(validateFiles([file()]), true);
  assert.equal(validateFiles([file("video/mp4")]), true);
  assert.equal(validateFiles([file("image/svg+xml")]), false);
  assert.equal(validateFiles([file("text/html")]), false);
  assert.equal(validateFiles([file("image/png", 0)]), false);
  assert.equal(validateFiles([file("image/png", 51 * 1024 * 1024)]), false);
  assert.equal(validateFiles(Array.from({ length: 5 }, () => file())), true);
  assert.equal(validateFiles(Array.from({ length: 6 }, () => file())), false);
});

test("hosting: non-localhost without config is unavailable, never demo", async () => {
  env({ host: "citycoreadmin.com" });
  const m = await load();
  assert.equal(m.isDemo, false); assert.equal(m.unavailable, true);
  await assert.rejects(m.backend.signIn("a@b.c", "x"), /temporarily unavailable/);
});

test("hosting: localhost without config uses demo", async () => {
  env(); const m = await load();
  assert.equal(m.isDemo, true); assert.equal(m.backend.mode, "demo");
});

test("guard: configured project without matching EXPECTED_PROJECT_REF disables the backend", async () => {
  env({ cfg: { SUPABASE_URL: "https://abc.supabase.co", SUPABASE_ANON_KEY: "x" } });
  assert.equal((await load()).unavailable, true);
  env({ cfg: { SUPABASE_URL: "https://abc.supabase.co", SUPABASE_ANON_KEY: "x", EXPECTED_PROJECT_REF: "other" } });
  assert.equal((await load()).unavailable, true);
});

test("demo: ticket isolation between users", async () => {
  env(); const { backend: b } = await load();
  await as(b, "u1@t.test");
  const t1 = await b.createTicket({ category: "account", subject: "s", body: "b", platform: "web", language: "en" });
  assert.match(t1.ticket_number, /^CC-\d+$/);
  await b.signOut(); await as(b, "u2@t.test");
  assert.deepEqual(await b.myTickets(), []);
  await assert.rejects(b.ticketDetail(t1.id));
  await assert.rejects(b.reply(t1.id, "hi"));
  await assert.rejects(b.allTickets(), /forbidden/);
  await assert.rejects(b.stats(), /forbidden/);
  await assert.rejects(b.auditLog(), /forbidden/);
  assert.equal(await b.staffRole(), null);
});

test("demo: staff roles, founder-only permission management, audit", async () => {
  env(); const { backend: b } = await load();
  await as(b, "u1@t.test");
  const t = await b.createTicket({ category: "bug", subject: "s", body: "b" });
  await b.signOut(); await as(b, "staff@t.test"); await b.signOut();
  await b.signIn("founder@demo.test", "x").catch(async () => { await b.signUp("founder@demo.test", "secret1"); });
  assert.equal((await b.staffRole()).role, "founder");
  await b.demoGrantRole("staff@t.test", "admin_1");
  await b.signOut(); await b.signIn("staff@t.test", "secret1");
  const me = await b.staffRole();
  assert.equal(me.role, "admin_1"); assert.equal(me.permissions.assign, false);
  await b.reply(t.id, "we are on it");
  await assert.rejects(b.updateTicket(t.id, { priority: "urgent" }), /forbidden/);
  await assert.rejects(b.updateTicket(t.id, { subject: "x" }), /forbidden field/);
  await assert.rejects(b.setRolePermissions("admin_1", { assign: true }), /forbidden/);
  await assert.rejects(b.auditLog(), /forbidden/);
  await b.updateTicket(t.id, { status: "in_progress" });
  await b.signOut(); await b.signIn("founder@demo.test", "secret1");
  await b.setRolePermissions("admin_1", { reply: true, assign: true });
  assert.ok((await b.auditLog()).some(a => a.action === "role_permissions_changed"));
  await b.signOut(); await b.signIn("u1@t.test", "secret1");
  assert.equal((await b.notifications()).length, 1);
  assert.equal((await b.ticketDetail(t.id)).ticket.status, "in_progress");
});

test("demo: closed tickets reject user replies", async () => {
  env(); const { backend: b } = await load();
  await as(b, "u1@t.test");
  const t = await b.createTicket({ category: "other", subject: "s", body: "b" });
  await b.signOut(); await b.signUp("founder@demo.test", "secret1");
  await b.updateTicket(t.id, { status: "closed" });
  await b.signOut(); await b.signIn("u1@t.test", "secret1");
  await assert.rejects(b.reply(t.id, "again"), /closed/);
});
