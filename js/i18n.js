import english from "./locales/en.js";
import french from "./locales/fr.js";
import haitianCreole from "./locales/ht.js";
import spanish from "./locales/es.js";
import portuguese from "./locales/pt.js";
import german from "./locales/de.js";
import italian from "./locales/it.js";
import arabic from "./locales/ar.js";
import chineseSimplified from "./locales/zh-Hans.js";
import chineseTraditional from "./locales/zh-Hant.js";
import japanese from "./locales/ja.js";
import korean from "./locales/ko.js";
import russian from "./locales/ru.js";
import { LANGS, directionFor } from "./languages.js";

export { LANGS } from "./languages.js";
export const CATEGORIES = ["account", "payment", "technical", "report_user", "feedback", "bug", "admin_panel", "other"];
export const STATUSES = ["open", "pending", "in_progress", "resolved", "closed"];
export const PRIORITIES = ["low", "normal", "high", "urgent"];
export const PLATFORMS = ["all", "ios", "ipados", "android", "web"];

const locales = {
  en: english, fr: french, ht: haitianCreole,
  es: spanish, pt: portuguese, de: german, it: italian, ar: arabic,
  "zh-Hans": chineseSimplified, "zh-Hant": chineseTraditional,
  ja: japanese, ko: korean, ru: russian
};
const saved = localStorage.getItem("cc_lang");
const preferred = (navigator.language || "en");
const localeAlias = { "zh-CN": "zh-Hans", "zh-SG": "zh-Hans", "zh-TW": "zh-Hant", "zh-HK": "zh-Hant", "zh-MO": "zh-Hant" };
const preferredLocale = locales[preferred] ? preferred : localeAlias[preferred] || preferred.split("-")[0];
let lang = saved && locales[saved] ? saved : (locales[preferredLocale] ? preferredLocale : "en");

export const getLang = () => lang;
export function t(key, vars = {}) {
  const message = locales[lang].messages[key];
  if (typeof message !== "string") throw new Error(`Missing ${lang} translation: ${key}`);
  return message.replace(/\{([^}]+)\}/g, (match, key) => Object.hasOwn(vars, key) ? vars[key] : match);
}
export function articleTranslation(id) {
  const article = locales[lang].articles[id];
  if (!article) throw new Error(`Missing ${lang} article: ${id}`);
  return article;
}
export function setLang(code) {
  if (!Object.hasOwn(locales, code)) throw new Error(`Unavailable language: ${code}`);
  lang = code;
  localStorage.setItem("cc_lang", code);
  document.documentElement.lang = code;
  document.documentElement.dir = directionFor(code);
  applyI18n();
  window.dispatchEvent(new CustomEvent("cc:lang"));
}
export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach(n => { n.textContent = t(n.dataset.i18n); });
  root.querySelectorAll("[data-i18n-ph]").forEach(n => { n.placeholder = t(n.dataset.i18nPh); });
  root.querySelectorAll("[data-i18n-aria]").forEach(n => { n.setAttribute("aria-label", t(n.dataset.i18nAria)); });
  root.querySelectorAll("[data-lang-select]").forEach(sel => { sel.value = lang; });
}
export function fmtDate(iso) {
  return new Date(iso).toLocaleString(lang === "ht" ? "fr" : lang, { dateStyle: "medium", timeStyle: "short" });
}
document.documentElement.lang = lang;
document.documentElement.dir = directionFor(lang);
