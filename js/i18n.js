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
import hindi from "./locales/hi.js";
import bengali from "./locales/bn.js";
import urdu from "./locales/ur.js";
import turkish from "./locales/tr.js";
import dutch from "./locales/nl.js";
import polish from "./locales/pl.js";
import ukrainian from "./locales/uk.js";
import romanian from "./locales/ro.js";
import greek from "./locales/el.js";
import swedish from "./locales/sv.js";
import norwegianBokmal from "./locales/nb.js";
import danish from "./locales/da.js";
import finnish from "./locales/fi.js";
import icelandic from "./locales/is.js";
import czech from "./locales/cs.js";
import slovak from "./locales/sk.js";
import slovenian from "./locales/sl.js";
import lithuanian from "./locales/lt.js";
import latvian from "./locales/lv.js";
import hungarian from "./locales/hu.js";
import bulgarian from "./locales/bg.js";
import serbian from "./locales/sr.js";
import croatian from "./locales/hr.js";
import bosnian from "./locales/bs.js";
import albanian from "./locales/sq.js";
import macedonian from "./locales/mk.js";
import estonian from "./locales/et.js";
import irish from "./locales/ga.js";
import welsh from "./locales/cy.js";
import scottishGaelic from "./locales/gd.js";
import maltese from "./locales/mt.js";
import basque from "./locales/eu.js";
import amharic from "./locales/am.js";
import catalan from "./locales/ca.js";
import galician from "./locales/gl.js";
import afrikaans from "./locales/af.js";
import swahili from "./locales/sw.js";
import persian from "./locales/fa.js";
import hebrew from "./locales/he.js";
import thai from "./locales/th.js";
import vietnamese from "./locales/vi.js";
import indonesian from "./locales/id.js";
import malay from "./locales/ms.js";
import filipino from "./locales/fil.js";
import englishUS from "./locales/en-US.js";
import englishGB from "./locales/en-GB.js";
import spanishLatinAmerica from "./locales/es-419.js";
import portugueseBrazil from "./locales/pt-BR.js";
import { COMPLETE_LOCALES, LANGS, directionFor } from "./languages.js";
import { readPreference, writePreference } from "./preferences.js";

export { LANGS } from "./languages.js";
export const CATEGORIES = ["account", "payment", "technical", "report_user", "feedback", "bug", "admin_panel", "other"];
export const STATUSES = ["open", "pending", "in_progress", "resolved", "closed"];
export const PRIORITIES = ["low", "normal", "high", "urgent"];
export const PLATFORMS = ["all", "ios", "ipados", "android", "web"];

const locales = {
  en: english, fr: french, ht: haitianCreole,
  es: spanish, pt: portuguese, de: german, it: italian, ar: arabic,
  "zh-Hans": chineseSimplified, "zh-Hant": chineseTraditional,
  ja: japanese, ko: korean, ru: russian, hi: hindi, bn: bengali, ur: urdu, tr: turkish,
  nl: dutch, pl: polish, uk: ukrainian, ro: romanian, el: greek, sv: swedish, nb: norwegianBokmal, da: danish, fi: finnish,
  is: icelandic, sl: slovenian, lt: lithuanian, lv: latvian, cs: czech, sk: slovak, hu: hungarian, bg: bulgarian, sr: serbian, hr: croatian, bs: bosnian,
  sq: albanian, mk: macedonian, et: estonian, ga: irish, cy: welsh, gd: scottishGaelic, mt: maltese, eu: basque, am: amharic,
  ca: catalan, gl: galician, af: afrikaans, sw: swahili, fa: persian, he: hebrew, th: thai, vi: vietnamese,
  id: indonesian, ms: malay, fil: filipino,
  "en-US": englishUS, "en-GB": englishGB,
  "es-419": spanishLatinAmerica, "pt-BR": portugueseBrazil
};
const saved = readPreference("cc_lang");
const preferred = (navigator.language || "en");
const localeAlias = { "zh-CN": "zh-Hans", "zh-SG": "zh-Hans", "zh-TW": "zh-Hant", "zh-HK": "zh-Hant", "zh-MO": "zh-Hant" };
const preferredLocale = locales[preferred] ? preferred : localeAlias[preferred] || preferred.split("-")[0];
const isComplete = code => COMPLETE_LOCALES.includes(code) && Object.hasOwn(locales, code);
let lang = isComplete(saved) ? saved : (isComplete(preferredLocale) ? preferredLocale : "en");

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
  if (!isComplete(code)) throw new Error(`Unavailable language: ${code}`);
  lang = code;
  writePreference("cc_lang", code);
  document.documentElement.lang = code;
  document.documentElement.dir = directionFor(code);
  applyI18n();
  window.dispatchEvent(new CustomEvent("cc:lang"));
}
export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach(n => { n.textContent = t(n.dataset.i18n); });
  root.querySelectorAll("[data-i18n-ph]").forEach(n => { n.placeholder = t(n.dataset.i18nPh); });
  root.querySelectorAll("[data-i18n-aria]").forEach(n => { n.setAttribute("aria-label", t(n.dataset.i18nAria)); });
  root.querySelectorAll("[data-lang-select]").forEach(sel => { sel.dataset.language = lang; });
}
export function fmtDate(iso) {
  return new Date(iso).toLocaleString(lang === "ht" ? "fr" : lang, { dateStyle: "medium", timeStyle: "short" });
}
document.documentElement.lang = lang;
document.documentElement.dir = directionFor(lang);
