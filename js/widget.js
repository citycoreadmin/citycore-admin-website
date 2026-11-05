import { backend, isDemo, validateFiles } from "./backend.js";
import { t, CATEGORIES, fmtDate } from "./i18n.js";
import { h } from "./ui.js";

const CFG = window.CITYCORE_CONFIG || {};

export function mountWidget(getPlatform = () => "web") {
  const state = { view: "home", category: null, ticketId: null, open: false, unread: 0, files: [], afterAuth: null, authMode: "signin" };
  let unsub = null;

  const badge = h("span", { class: "fab-badge", hidden: true });
  const fab = h("button", { class: "fab", "aria-label": t("w_open"), onclick: toggle }, h("span", { class: "fab-icon", "aria-hidden": "true" }, "💬"), badge);
  const body = h("div", { class: "wp-body" });
  const bell = h("button", { class: "wp-icon-btn", "aria-label": t("notif"), onclick: () => go("notifs") }, "🔔");
  const bellDot = h("span", { class: "wp-dot", hidden: true });
  bell.append(bellDot);
  const backBtn = h("button", { class: "wp-icon-btn", "aria-label": t("back"), hidden: true, onclick: () => go(state.view === "thread" || state.view === "notifs" ? "tickets" : "home") }, "←");
  const closeBtn = h("button", { class: "wp-icon-btn", "aria-label": t("w_close"), onclick: toggle }, "✕");
  const title = h("div", { class: "wp-title" });
  const panel = h("section", { class: "wp", role: "dialog", "aria-label": t("w_title"), hidden: true },
    h("header", { class: "wp-head" }, backBtn, h("img", { src: "citycore-logo.png", alt: "", class: "wp-logo" }), title, bell, closeBtn), body);
  document.body.append(panel, fab);

  function toggle() {
    state.open = !state.open;
    panel.hidden = !state.open;
    fab.classList.toggle("is-open", state.open);
    if (state.open) render();
  }
  function go(view, extra = {}) { Object.assign(state, { view }, extra); render(); }
  window.addEventListener("cc:open-support", () => { if (!state.open) toggle(); go("home"); });
  window.addEventListener("cc:lang", () => { fab.setAttribute("aria-label", t("w_open")); if (state.open) render(); });

  async function refreshUnread() {
    const u = await backend.getUser();
    state.unread = 0;
    if (u) { try { state.unread = (await backend.notifications()).filter(n => !n.read).length; } catch { /* ignore */ } }
    badge.hidden = bellDot.hidden = state.unread === 0;
    badge.textContent = String(state.unread);
  }

  async function render() {
    if (unsub) { unsub(); unsub = null; }
    const u = await backend.getUser();
    title.textContent = t("w_title");
    backBtn.hidden = state.view === "home";
    bell.hidden = !u;
    body.replaceChildren();
    const v = { home: viewHome, auth: viewAuth, compose: viewCompose, tickets: viewTickets, thread: viewThread, notifs: viewNotifs }[state.view];
    await v(u);
    body.scrollTop = 0;
    refreshUnread();
  }

  const bubble = (...kids) => h("div", { class: "bubble" }, ...kids);

  async function viewHome(u) {
    body.append(
      h("div", { class: "msgs" },
        bubble(h("strong", {}, t("w_welcome_1"))),
        bubble(t("w_welcome_2")), bubble(t("w_welcome_3"))),
      h("div", { class: "wp-section" }, t("w_pick")),
      h("div", { class: "chips" }, CATEGORIES.map(c => h("button", { class: "chip", onclick: () => startCategory(c) }, t("cat_" + c)))),
      h("div", { class: "wp-actions" },
        h("button", { class: "btn btn-ghost", onclick: () => requireAuth(() => go("tickets")) }, "🎫 " + t("w_my_tickets")),
        u ? h("button", { class: "btn btn-link", onclick: async () => { await backend.signOut(); go("home"); } }, `${t("sign_out")} (${u.email})`) : null));
  }

  async function startCategory(c) { state.category = c; requireAuth(() => go("compose")); }
  async function requireAuth(next) {
    if (await backend.getUser()) next(); else { state.afterAuth = next; go("auth"); }
  }

  async function viewAuth() {
    const err = h("p", { class: "form-err", role: "alert" });
    const email = h("input", { type: "email", required: true, autocomplete: "email", id: "ccEmail" });
    const pw = h("input", { type: "password", required: true, minlength: 6, autocomplete: state.authMode === "signin" ? "current-password" : "new-password", id: "ccPw" });
    const form = h("form", { class: "form", onsubmit: async e => {
      e.preventDefault(); err.textContent = "";
      try {
        await (state.authMode === "signin" ? backend.signIn(email.value, pw.value) : backend.signUp(email.value, pw.value));
        const n = state.afterAuth; state.afterAuth = null; n ? n() : go("home");
      } catch (x) { err.textContent = x.message; }
    } },
      h("p", { class: "muted" }, t("auth_needed")),
      isDemo ? h("p", { class: "demo-note" }, t("auth_demo")) : null,
      h("div", { class: "tabs" },
        h("button", { type: "button", class: "tab" + (state.authMode === "signin" ? " on" : ""), onclick: () => go("auth", { authMode: "signin" }) }, t("sign_in")),
        h("button", { type: "button", class: "tab" + (state.authMode === "signup" ? " on" : ""), onclick: () => go("auth", { authMode: "signup" }) }, t("sign_up"))),
      h("label", { for: "ccEmail" }, t("email")), email, h("label", { for: "ccPw" }, t("password")), pw, err,
      h("button", { class: "btn btn-primary", type: "submit" }, state.authMode === "signin" ? t("sign_in") : t("sign_up")));
    body.append(form);
  }

  function filePicker(onChange) {
    const list = h("div", { class: "file-list" });
    const err = h("p", { class: "form-err", role: "alert" });
    const input = h("input", { type: "file", multiple: true, accept: "image/*,video/*", hidden: true, onchange: () => {
      const picked = [...input.files]; input.value = "";
      if (!validateFiles(picked)) { err.textContent = t("err_file", { mb: CFG.MAX_ATTACHMENT_MB || 50 }); return; }
      err.textContent = ""; state.files.push(...picked); draw(); onChange && onChange();
    } });
    function draw() {
      list.replaceChildren(...state.files.map((f, i) => h("span", { class: "file-chip" }, `📎 ${f.name}`,
        h("button", { type: "button", "aria-label": t("w_close"), onclick: () => { state.files.splice(i, 1); draw(); } }, "×"))));
    }
    draw();
    return h("div", {}, h("button", { type: "button", class: "btn btn-ghost btn-sm", onclick: () => input.click() }, "📎 " + t("attach")), input, list, err);
  }

  async function viewCompose() {
    state.files = [];
    const err = h("p", { class: "form-err", role: "alert" });
    const subject = h("input", { type: "text", maxlength: 200, required: true, id: "ccSubj" });
    const msg = h("textarea", { rows: 5, maxlength: 5000, required: true, placeholder: t("msg_ph"), id: "ccMsg" });
    const submit = h("button", { class: "btn btn-primary", type: "submit" }, t("submit_ticket"));
    body.append(h("form", { class: "form", onsubmit: async e => {
      e.preventDefault(); err.textContent = "";
      if (!subject.value.trim() || !msg.value.trim()) { err.textContent = t("err_required"); return; }
      submit.disabled = true; submit.textContent = t("sending");
      try {
        const tk = await backend.createTicket({ category: state.category, subject: subject.value, body: msg.value, files: state.files, platform: getPlatform(), language: document.documentElement.lang });
        state.files = []; go("thread", { ticketId: tk.id });
      } catch (x) { err.textContent = x.message === "file" ? t("err_file", { mb: CFG.MAX_ATTACHMENT_MB || 50 }) : t("err_generic"); submit.disabled = false; submit.textContent = t("submit_ticket"); }
    } },
      h("div", { class: "cat-pill" }, t("cat_" + state.category)),
      h("label", { for: "ccSubj" }, t("subject")), subject,
      h("label", { for: "ccMsg" }, t("message")), msg,
      filePicker(), err, submit));
  }

  const statusPill = s => h("span", { class: "pill st-" + s }, t("st_" + s));

  async function viewTickets() {
    const list = h("div", { class: "tlist" });
    body.append(h("div", { class: "wp-section" }, t("w_my_tickets")), list,
      h("button", { class: "btn btn-primary", onclick: () => go("home") }, "+ " + t("w_new")));
    async function load() {
      let rows;
      try { rows = await backend.myTickets(); } catch { go("home"); return; }
      list.replaceChildren(...(rows.length ? rows.map(r => h("button", { class: "titem", onclick: () => go("thread", { ticketId: r.id }) },
        h("div", { class: "titem-top" }, h("strong", {}, r.ticket_number), statusPill(r.status)),
        h("div", { class: "titem-sub" }, r.subject),
        h("div", { class: "muted small" }, `${t("cat_" + r.category)} · ${fmtDate(r.updated_at)}`)))
        : [h("p", { class: "muted" }, t("no_tickets"))]));
    }
    await load(); unsub = backend.onChange(load);
  }

  function renderMessage(m, mine) {
    return h("div", { class: "msg " + (mine ? "me" : "them") },
      h("div", { class: "msg-who" }, m.is_staff ? t("support") : t("you")),
      h("div", { class: "bubble" }, m.body,
        (m.attachments || []).map(a => /^image\//.test(a.mime) ? h("a", { href: a.url, target: "_blank", rel: "noopener" }, h("img", { src: a.url, alt: a.name, class: "att" }))
          : /^video\//.test(a.mime) ? h("video", { src: a.url, controls: true, class: "att", preload: "metadata" })
          : h("a", { href: a.url, target: "_blank", rel: "noopener" }, a.name))),
      h("time", { class: "muted small", datetime: m.created_at }, fmtDate(m.created_at)));
  }

  async function viewThread(u) {
    state.files = [];
    const head = h("div", { class: "thread-head" });
    const msgs = h("div", { class: "msgs thread" });
    const err = h("p", { class: "form-err", role: "alert" });
    const text = h("textarea", { rows: 2, maxlength: 5000, placeholder: t("reply_ph"), "aria-label": t("reply_ph") });
    const send = h("button", { class: "btn btn-primary", type: "submit" }, t("send"));
    const composer = h("form", { class: "form composer", onsubmit: async e => {
      e.preventDefault(); err.textContent = "";
      if (!text.value.trim()) return;
      send.disabled = true;
      try { await backend.reply(state.ticketId, text.value, state.files); text.value = ""; state.files = []; fp.replaceWith(fp = filePicker()); await load(); }
      catch (x) { err.textContent = x.message === "file" ? t("err_file", { mb: CFG.MAX_ATTACHMENT_MB || 50 }) : t("err_generic"); }
      send.disabled = false;
    } }, text);
    let fp = filePicker();
    composer.append(fp, err, send);
    body.append(head, msgs, composer);
    async function load() {
      let d;
      try { d = await backend.ticketDetail(state.ticketId); } catch { go("tickets"); return; }
      head.replaceChildren(h("strong", {}, d.ticket.ticket_number), statusPill(d.ticket.status), h("div", { class: "muted small" }, `${t("cat_" + d.ticket.category)} · ${t("created")} ${fmtDate(d.ticket.created_at)}`), h("div", { class: "thread-subj" }, d.ticket.subject));
      const atBottom = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 80;
      msgs.replaceChildren(...d.messages.map(m => renderMessage(m, m.author_id === (u && u.id))));
      composer.hidden = d.ticket.status === "closed";
      if (d.ticket.status === "closed") msgs.append(h("p", { class: "muted" }, t("closed_note")));
      if (atBottom) msgs.scrollTop = msgs.scrollHeight;
    }
    await load(); msgs.scrollTop = msgs.scrollHeight; unsub = backend.onChange(load);
  }

  async function viewNotifs() {
    const rows = await backend.notifications();
    body.append(h("div", { class: "wp-section" }, t("notif")),
      h("div", { class: "tlist" }, rows.length ? rows.map(n => h("button", { class: "titem" + (n.read ? "" : " unread"), onclick: () => go("thread", { ticketId: n.ticket_id }) },
        h("strong", {}, `${t("notif_reply")} ${n.ticket_number || ""}`), h("div", { class: "muted small" }, fmtDate(n.created_at)))) : [h("p", { class: "muted" }, t("notif_none"))]),
      rows.some(n => !n.read) ? h("button", { class: "btn btn-ghost btn-sm", onclick: async () => { await backend.markNotificationsRead(); render(); } }, t("mark_read")) : null);
  }

  backend.onChange(() => { refreshUnread(); if (state.open && state.view !== "home") backend.getUser().then(u => { if (!u && state.view !== "auth") go("home"); }); });
  refreshUnread();
}
