import { LANGS, getLang, setLang, applyI18n } from "./i18n.js";

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
  document.querySelectorAll("[data-lang-select]").forEach(sel => {
    sel.replaceChildren(...LANGS.map(l => h("option", { value: l.code }, `${l.flag} ${l.label}`)));
    sel.value = getLang();
    sel.addEventListener("change", () => setLang(sel.value));
  });
  applyI18n();
}
