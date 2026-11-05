import { backend, isDemo, PLATFORM_ROLES } from "./backend.js";
import { t, CATEGORIES, STATUSES, PRIORITIES, fmtDate } from "./i18n.js";
import { h, initTheme, initLangSelects } from "./ui.js";

initTheme();
initLangSelects();

const app = document.getElementById("app");
const S = { tab: "tickets", filters: {}, selected: null, me: null, role: null, staff: [], cache: 0 };
const PERMS = ["reply", "assign", "change_status", "view_stats", "view_audit"];
const can = p => !!(S.role && S.role.permissions && S.role.permissions[p]);

async function boot() {
  S.me = await backend.getUser();
  S.role = S.me ? await backend.staffRole() : null;
  render();
}
backend.onChange(() => { if (S.role) refresh().catch(boot); else boot(); });
window.addEventListener("cc:lang", () => render());

function render() {
  app.replaceChildren();
  if (!S.me) return app.append(loginView());
  // Authorization is enforced server-side (RLS); this only decides what to display.
  if (!S.role) return app.append(h("div", { class: "card" }, h("p", {}, t("s_denied")),
    h("button", { class: "btn btn-ghost", onclick: async () => { await backend.signOut(); boot(); } }, t("sign_out"))));
  const tabs = [["tickets", "s_tickets", true], ["stats", "s_stats", can("view_stats")], ["team", "s_team", S.role.role === "founder"], ["audit", "s_audit", can("view_audit")]];
  app.append(h("div", { class: "staff-bar" },
    h("div", { class: "tabs" }, tabs.filter(x => x[2]).map(([k, l]) => h("button", { class: "tab" + (S.tab === k ? " on" : ""), onclick: () => { S.tab = k; render(); } }, t(l)))),
    h("span", { class: "muted small" }, `${S.me.email} · ${t("r_" + S.role.role)}`),
    h("button", { class: "btn btn-ghost btn-sm", onclick: async () => { await backend.signOut(); boot(); } }, t("sign_out"))));
  const body = h("div", { id: "tabBody" });
  app.append(body);
  Promise.resolve(({ tickets: ticketsTab, stats: statsTab, team: teamTab, audit: auditTab }[S.tab])(body)).catch(async () => {
    const u = await backend.getUser();
    if (!u || !S.me || u.id !== S.me.id) boot();
  });
}
async function refresh() { const b = document.getElementById("tabBody"); if (b && S.tab === "tickets") await ticketsTab(b); }

function loginView() {
  const err = h("p", { class: "form-err", role: "alert" });
  const email = h("input", { type: "text", required: true, autocomplete: "username", autocapitalize: "none", spellcheck: "false", "aria-label": t("auth_identifier") });
  const pw = h("input", { type: "password", required: true, autocomplete: "current-password" });
  return h("form", { class: "card form narrow", onsubmit: async e => {
    e.preventDefault(); err.textContent = "";
    try { await backend.signIn(email.value, pw.value); await boot(); } catch (x) { err.textContent = x.message; }
  } }, h("h2", {}, t("s_title")),
    isDemo ? h("p", { class: "demo-note" }, t("auth_demo") + " (founder@demo.test)") : null,
    h("label", {}, t("auth_identifier")), email, h("label", {}, t("password")), pw, err,
    h("button", { class: "btn btn-primary", type: "submit" }, t("sign_in")),
    backend.hasGoogle ? h("button", { type: "button", class: "btn btn-ghost", onclick: async () => {
      try { await backend.signInWithGoogle(); } catch (x) { err.textContent = x.message; }
    } }, t("auth_google")) : null);
}

function selectOf(opts, value, onchange, allLabel) {
  const s = h("select", { class: "select", onchange: () => onchange(s.value) },
    allLabel ? h("option", { value: "" }, allLabel) : null, opts.map(([v, l]) => h("option", { value: v }, l)));
  s.value = value || ""; return s;
}

async function ticketsTab(root, keepSelection) {
  const f = S.filters;
  const staff = await backend.staffList().catch(() => []);
  S.staff = staff;
  const rows = await backend.allTickets(f);
  const nameOf = id => (staff.find(s => s.user_id === id) || {}).email || "—";
  const list = h("div", { class: "tlist" }, rows.length ? rows.map(r => h("button", { class: "titem" + (S.selected === r.id ? " sel" : ""), onclick: () => { S.selected = r.id; ticketsTab(root); } },
    h("div", { class: "titem-top" }, h("strong", {}, r.ticket_number), h("span", { class: "pill st-" + r.status }, t("st_" + r.status)), h("span", { class: "pill pr-" + r.priority }, t("pr_" + r.priority))),
    h("div", { class: "titem-sub" }, r.subject),
    h("div", { class: "muted small" }, `${r.requester_email || ""} · ${t("cat_" + r.category)} · ${nameOf(r.assigned_to)} · ${fmtDate(r.updated_at)}`))) : [h("p", { class: "muted" }, t("no_results"))]);
  const q = h("input", { type: "search", class: "select", placeholder: t("s_search"), value: f.q || "", "aria-label": t("s_search"),
    onkeydown: e => { if (e.key === "Enter") { f.q = q.value; ticketsTab(root); } } });
  const filters = h("div", { class: "filters" }, q,
    selectOf(STATUSES.map(s => [s, t("st_" + s)]), f.status, v => { f.status = v; ticketsTab(root); }, `${t("s_status")}: ${t("s_all")}`),
    selectOf(CATEGORIES.map(c => [c, t("cat_" + c)]), f.category, v => { f.category = v; ticketsTab(root); }, `${t("s_category")}: ${t("s_all")}`),
    selectOf(PRIORITIES.map(p => [p, t("pr_" + p)]), f.priority, v => { f.priority = v; ticketsTab(root); }, `${t("s_priority")}: ${t("s_all")}`),
    selectOf([["none", t("s_unassigned")], ...staff.map(s => [s.user_id, s.email])], f.assigned, v => { f.assigned = v; ticketsTab(root); }, `${t("s_assignee")}: ${t("s_all")}`));
  const detail = h("div", { class: "card detail" }, h("p", { class: "muted" }, t("s_select")));
  root.replaceChildren(filters, h("div", { class: "split" }, list, detail));
  if (S.selected && rows.some(r => r.id === S.selected)) await ticketDetail(detail, S.selected, staff, root);
}

async function ticketDetail(root, id, staff, listRoot) {
  const d = await backend.ticketDetail(id);
  const tk = d.ticket;
  const patch = async p => { try { await backend.updateTicket(id, p); } catch { alert(t("s_no_perm")); } ticketsTab(listRoot); };
  const err = h("p", { class: "form-err", role: "alert" });
  const text = h("textarea", { rows: 3, placeholder: t("reply_ph"), "aria-label": t("reply_ph") });
  const files = [];
  const fi = h("input", { type: "file", multiple: true, accept: "image/*,video/*", onchange: () => { files.length = 0; files.push(...fi.files); } });
  const reply = h("form", { class: "form", onsubmit: async e => {
    e.preventDefault(); err.textContent = "";
    if (!text.value.trim()) return;
    try { await backend.reply(id, text.value, files); ticketsTab(listRoot); } catch (x) { err.textContent = x.message === "forbidden" ? t("s_no_perm") : t("err_generic"); }
  } }, text, fi, err, h("button", { class: "btn btn-primary", type: "submit", disabled: !can("reply") }, t("send")));
  root.replaceChildren(
    h("div", { class: "detail-head" }, h("h3", {}, `${tk.ticket_number} — ${tk.subject}`),
      h("div", { class: "muted small" }, `${tk.requester_email || ""} · ${t("cat_" + tk.category)} · ${tk.platform || ""} · ${tk.language || ""}`)),
    h("div", { class: "filters" },
      selectOf(STATUSES.map(s => [s, t("st_" + s)]), tk.status, v => patch({ status: v })),
      selectOf(PRIORITIES.map(p => [p, t("pr_" + p)]), tk.priority, v => patch({ priority: v })),
      selectOf(staff.map(s => [s.user_id, s.email]), tk.assigned_to, v => patch({ assigned_to: v || null }), t("s_unassigned")),
      h("button", { class: "btn btn-ghost btn-sm", onclick: () => patch({ assigned_to: S.me.id }) }, t("s_assign_me"))),
    h("div", { class: "msgs thread" }, d.messages.map(m => h("div", { class: "msg " + (m.is_staff ? "me" : "them") },
      h("div", { class: "msg-who" }, m.is_staff ? t("support") : tk.requester_email || t("you")),
      h("div", { class: "bubble" }, m.body, (m.attachments || []).map(a => /^image\//.test(a.mime) ? h("a", { href: a.url, target: "_blank", rel: "noopener" }, h("img", { class: "att", src: a.url, alt: a.name }))
        : /^video\//.test(a.mime) ? h("video", { class: "att", src: a.url, controls: true }) : h("a", { href: a.url, target: "_blank", rel: "noopener" }, a.name))),
      h("time", { class: "muted small" }, fmtDate(m.created_at))))), reply);
}

async function statsTab(root) {
  const s = await backend.stats();
  const box = (label, val) => h("div", { class: "stat" }, h("div", { class: "stat-n" }, String(val)), h("div", { class: "muted" }, label));
  const bars = (obj, label) => h("div", { class: "card" }, h("h3", {}, label), Object.entries(obj).map(([k, v]) => h("div", { class: "bar-row" },
    h("span", {}, t(k in { open: 1, pending: 1, in_progress: 1, resolved: 1, closed: 1 } ? "st_" + k : "cat_" + k)),
    h("div", { class: "bar" }, h("i", { style: `width:${Math.max(4, v / Math.max(1, s.total) * 100)}%` })), h("b", {}, String(v)))));
  root.replaceChildren(h("div", { class: "stats" }, box(t("s_total"), s.total), box(t("s_last7"), s.last_7_days), box(t("s_unassigned_open"), s.unassigned)),
    h("div", { class: "two" }, bars(s.by_status, t("s_by_status")), bars(s.by_category, t("s_by_category"))));
}

async function teamTab(root) {
  const [staff, rolePerms] = await Promise.all([backend.staffList(), backend.rolePermissions()]);
  const err = h("p", { class: "form-err", role: "alert" });
  const permList = p => (p || {});
  const members = h("div", { class: "card" }, h("p", { class: "muted small" }, t("s_team_note")),
    h("div", { class: "tbl-wrap" }, h("table", { class: "tbl" }, h("thead", {}, h("tr", {}, [t("email"), t("s_role"), "Permissions"].map(x => h("th", {}, x)))),
      h("tbody", {}, staff.map(s => h("tr", {}, h("td", {}, s.email), h("td", {}, t("r_" + s.role)),
        h("td", {}, s.role === "founder" ? "★" : PERMS.filter(p => permList(s.permissions)[p]).map(p => t("s_perm_" + p)).join(", ") || "—")))))));
  const current = rolePerms;
  const rows = PLATFORM_ROLES.map(r => {
    const boxes = Object.fromEntries(PERMS.map(p => [p, h("input", { type: "checkbox", checked: !!permList(current[r])[p], "aria-label": `${t("r_" + r)} ${t("s_perm_" + p)}` })]));
    const save = h("button", { class: "btn btn-ghost btn-sm", type: "button", onclick: async () => {
      err.textContent = "";
      try { await backend.setRolePermissions(r, Object.fromEntries(PERMS.map(p => [p, boxes[p].checked]))); err.textContent = t("s_saved"); }
      catch (x) { err.textContent = x.message; }
    } }, t("s_save"));
    return h("tr", {}, h("td", {}, t("r_" + r)), PERMS.map(p => h("td", {}, boxes[p])), h("td", {}, save));
  });
  const matrix = h("div", { class: "card" }, h("h3", {}, t("s_role_perms")),
    h("div", { class: "tbl-wrap" }, h("table", { class: "tbl" }, h("thead", {}, h("tr", {}, [t("s_role"), ...PERMS.map(p => t("s_perm_" + p)), ""].map(x => h("th", {}, x)))), h("tbody", {}, rows))), err);
  root.replaceChildren(members, matrix, isDemo ? demoGrant(root) : null);
}

function demoGrant(root) {
  const email = h("input", { type: "email", required: true, "aria-label": t("email") });
  const role = selectOf(PLATFORM_ROLES.map(r => [r, t("r_" + r)]), "admin_1", () => {});
  const err = h("p", { class: "form-err", role: "alert" });
  return h("form", { class: "card form", onsubmit: async e => {
    e.preventDefault(); err.textContent = "";
    try { await backend.demoGrantRole(email.value, role.value); teamTab(root); } catch (x) { err.textContent = x.message; }
  } }, h("h3", {}, "Demo only: simulate platform_administrators"), h("p", { class: "demo-note" }, "The live site never assigns platform roles."),
    email, role, err, h("button", { class: "btn btn-primary", type: "submit" }, t("s_save")));
}

async function auditTab(root) {
  const rows = await backend.auditLog();
  root.replaceChildren(h("div", { class: "card" }, h("table", { class: "tbl" },
    h("thead", {}, h("tr", {}, [t("s_when"), t("s_actor"), t("s_action"), "Details"].map(x => h("th", {}, x)))),
    h("tbody", {}, rows.map(r => h("tr", {}, h("td", {}, fmtDate(r.created_at)), h("td", {}, r.actor_email || "—"), h("td", {}, r.action), h("td", {}, JSON.stringify(r.details || {}))))))));
}

boot();
