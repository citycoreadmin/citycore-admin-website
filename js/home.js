import { t, articleTranslation, PLATFORMS, applyI18n } from "./i18n.js";
import { ARTICLES, HELP_CATEGORIES } from "./articles.js";
import { h, initTheme, initLangSelects } from "./ui.js";
import { readPreference, writePreference } from "./preferences.js";

initTheme();
initLangSelects();

const $ = id => document.getElementById(id);
const state = { q: "", cat: null, platform: readPreference("cc_platform") || "all" };
if (!PLATFORMS.includes(state.platform)) state.platform = "all";

function renderContactStatusBody() {
  const body = $("contactStatusBody");
  const message = t("contact_status_body");
  const email = "citycoreadmin@gmail.com";
  const emailIndex = message.indexOf(email);
  if (emailIndex < 0) {
    body.textContent = message;
    return;
  }
  body.replaceChildren(
    message.slice(0, emailIndex),
    h("a", { href: `mailto:${email}` }, email),
    message.slice(emailIndex + email.length)
  );
}

const platformSel = $("platformSel");
function drawPlatforms() {
  platformSel.replaceChildren(...PLATFORMS.map(p => h("option", { value: p }, t("p_" + p))));
  platformSel.value = state.platform;
}
platformSel.addEventListener("change", () => { state.platform = platformSel.value; writePreference("cc_platform", state.platform); render(); });

const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const tr = a => articleTranslation(a.id);
const forPlatform = a => state.platform === "all" || !a.platforms.length || a.platforms.includes(state.platform);
const articleText = a => norm([a.kw, tr(a).title, ...tr(a).steps].join(" "));

function matches(a) {
  if (!forPlatform(a)) return false;
  if (state.cat && a.cat !== state.cat) return false;
  if (!state.q) return true;
  const text = articleText(a);
  return norm(state.q).split(/\s+/).filter(Boolean).every(w => text.includes(w));
}

function render() {
  const browsing = state.q || state.cat;
  $("catView").hidden = !!browsing;
  $("listView").hidden = !browsing;
  if (!browsing) {
    $("catGrid").replaceChildren(...HELP_CATEGORIES.map(c => {
      if (c === "contact") {
        return h("button", { class: "cat-card", onclick: () => { state.cat = c; render(); } },
          h("span", { class: "cat-ico" }, ICONS[c]), h("strong", {}, t("cat_contact")), h("span", { class: "muted small" }, t("contact_status_title")));
      }
      const n = ARTICLES.filter(a => a.cat === c && forPlatform(a)).length;
      return h("button", { class: "cat-card", onclick: () => { state.cat = c; render(); } },
        h("span", { class: "cat-ico" }, ICONS[c]), h("strong", {}, t("cat_" + c)), h("span", { class: "muted small" }, `${n} ${t("article_count")}`));
    }));
    return;
  }
  $("listTitle").textContent = state.q ? `${t("results")}: “${state.q}”` : t("cat_" + state.cat);
  const rows = ARTICLES.filter(matches);
  $("artGrid").replaceChildren(...rows.map(a => h("button", { class: "art-card", onclick: () => openArticle(a) },
    a.img ? h("img", { src: a.img, alt: "", loading: "lazy" }) : h("div", { class: "art-ph" }, ICONS[a.cat]),
    h("span", { class: "tag" }, t("cat_" + a.cat)), h("strong", {}, tr(a).title))));
  $("noResults").hidden = rows.length > 0;
}

const ICONS = { getting_started: "🚀", account_login: "👤", admin_panels: "🛡️", roles: "🔑", invitations: "✉️", troubleshooting: "🛠️", privacy: "🔒", contact: "💬" };

const dlg = $("artDialog");
let openId = null;
function openArticle(a) {
  openId = a.id;
  $("artTitle").textContent = tr(a).title;
  $("artImg").hidden = !a.img; if (a.img) $("artImg").src = a.img;
  $("artSteps").replaceChildren(...tr(a).steps.map(s => h("li", {}, s)));
  if (!dlg.open) dlg.showModal();
}
$("artClose").addEventListener("click", () => { dlg.close(); openId = null; });
dlg.addEventListener("click", e => { if (e.target === dlg) { dlg.close(); openId = null; } });

$("searchForm").addEventListener("submit", e => { e.preventDefault(); state.q = $("searchInput").value.trim(); state.cat = null; render(); $("help").scrollIntoView({ behavior: "smooth" }); });
$("searchInput").addEventListener("input", e => { if (!e.target.value.trim() && state.q) { state.q = ""; render(); } });
$("listBack").addEventListener("click", () => { state.q = ""; state.cat = null; $("searchInput").value = ""; render(); });
window.addEventListener("cc:lang", () => {
  drawPlatforms(); render(); applyI18n();
  renderContactStatusBody();
  if (dlg.open && openId) openArticle(ARTICLES.find(a => a.id === openId));
});

drawPlatforms();
render();
renderContactStatusBody();
