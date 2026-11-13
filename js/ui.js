import { LANGS, getLang, setLang, applyI18n, t } from "./i18n.js";

// Tiny DOM builder. Text is always set via textContent/text nodes (no innerHTML) to prevent XSS.
export function h(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") n.className = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else if (k === "text") n.textContent = v;
    else n.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) n.append(c.nodeType ? c : document.createTextNode(c));
  return n;
}

export function initTheme() {
  const saved = localStorage.getItem("cc_theme");
  const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelectorAll("[data-theme-toggle]").forEach(b => b.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("cc_theme", next);
  }));
}

export function initLangSelects() {
  const selects = [...document.querySelectorAll("[data-lang-select]")];
  function draw() {
    selects.forEach(sel => {
      const available = h("optgroup", { label: t("language_available") });
      const review = h("optgroup", { label: t("language_review") });
      const unavailable = h("optgroup", { label: t("language_unavailable"), disabled: true });
      LANGS.forEach(language => {
        const group = language.complete ? available : language.review ? review : unavailable;
        group.append(h("option", { value: language.code }, `${language.flag} ${language.label}`));
      });
      sel.replaceChildren(available, review, unavailable);
      sel.value = getLang();
    });
  }
  selects.forEach(sel => sel.addEventListener("change", () => setLang(sel.value)));
  window.addEventListener("cc:lang", draw);
  draw();
  applyI18n();
}
