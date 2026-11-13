import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import english from "../js/locales/en.js";
import french from "../js/locales/fr.js";
import haitianCreole from "../js/locales/ht.js";
import spanish from "../js/locales/es.js";
import portuguese from "../js/locales/pt.js";
import german from "../js/locales/de.js";
import italian from "../js/locales/it.js";
import arabic from "../js/locales/ar.js";
import chineseSimplified from "../js/locales/zh-Hans.js";
import chineseTraditional from "../js/locales/zh-Hant.js";
import japanese from "../js/locales/ja.js";
import korean from "../js/locales/ko.js";
import russian from "../js/locales/ru.js";
import { ARTICLES, HELP_CATEGORIES } from "../js/articles.js";
import {
  LANGS, COMPLETE_LOCALES, REVIEW_LOCALES, PENDING_LOCALES, RTL_LOCALES, directionFor
} from "../js/languages.js";

const locales = {
  en: english, fr: french, ht: haitianCreole,
  es: spanish, pt: portuguese, de: german, it: italian, ar: arabic,
  "zh-Hans": chineseSimplified, "zh-Hant": chineseTraditional,
  ja: japanese, ko: korean, ru: russian
};
const initialLocales = ["es", "pt", "de", "it", "ar", "zh-Hans", "zh-Hant", "ja", "ko", "ru"];
const publicMessageKeys = [
  "skip_content", "close", "page_home_title", "page_privacy_title",
  "language_available", "language_review", "language_unavailable",
  "policy_updated", "policy_intro", "policy_website_intro", "policy_website",
  "policy_website_data", "policy_ios", "policy_app_link", "policy_app_before",
  "policy_app_after", "policy_app_unknown", "policy_contact", "policy_contact_before",
  "policy_contact_after", "policy_copyright", "nav_home", "nav_help", "nav_support",
  "hero_title", "search_ph", "search_btn", "platform", "p_all", "p_ios",
  "p_ipados", "p_android", "p_web", "language", "theme", "help_cats", "articles",
  "results", "no_results", "back", "article_count", "cat_getting_started",
  "cat_account_login", "cat_admin_panels", "cat_roles", "cat_invitations",
  "cat_troubleshooting", "cat_privacy", "cat_contact", "contact_status_title",
  "contact_status_body", "footer", "privacy"
].sort();
const requested = "en fr ht es pt de it ar zh-Hans zh-Hant ja ko ru hi bn ur tr nl pl uk ro el sv nb da fi is cs sk hu bg sr hr bs sl sq mk lt lv et ga cy gd mt eu ca gl af sw am so yo ig ha zu xh mg rw sn st fa he ps kmr hy ka az kk uz mn ne si ta te kn ml mr gu pa or th vi id ms fil my km lo mi".split(" ");
const ios = "en-US en-GB da de es es-419 fr ht hr it lt hu nl nb pl pt-BR ro fi sv tr cs el bg ru uk hi th zh-Hans zh-Hant ja ko vi ca gl eu sl sr mk be lv is ga gd cy mt sq am ti so sw yo ig zu xh sn rw rn wo ar fa ps ur bn pa gu mr ta te kn ml si ne my km lo mn tg kk uz ky mi sm to fj qu ay gn nah".split(" ");

test("registry has unique codes, explicit coverage, and the requested RTL directions", () => {
  assert.equal(new Set(LANGS.map(language => language.code)).size, LANGS.length);
  assert.equal(requested.length, 89);
  assert.equal(ios.length, 88);
  assert.deepEqual(new Set(LANGS.map(language => language.code)), new Set([...requested, ...ios]));
  assert.equal(LANGS.length, 106);
  assert.deepEqual(LANGS.filter(language => language.complete).map(language => language.code), COMPLETE_LOCALES);
  assert.deepEqual(COMPLETE_LOCALES, ["en"]);
  assert.deepEqual(LANGS.filter(language => language.review).map(language => language.code), REVIEW_LOCALES);
  assert.deepEqual(REVIEW_LOCALES, ["fr", "ht", ...initialLocales]);
  assert.equal(PENDING_LOCALES.length, 93);
  assert.deepEqual(
    LANGS.filter(language => !language.complete && !language.review).map(language => language.code),
    PENDING_LOCALES
  );
  for (const code of ["ar", "he", "fa", "ur", "ps"]) {
    assert.ok(RTL_LOCALES.includes(code));
    assert.equal(directionFor(code), "rtl");
  }
  assert.equal(directionFor("en"), "ltr");
});

test("reviewed and pending locales are never represented as complete", () => {
  for (const language of LANGS) {
    assert.equal(language.complete, COMPLETE_LOCALES.includes(language.code), language.code);
    assert.equal(language.review, REVIEW_LOCALES.includes(language.code), language.code);
  }
  for (const [code, locale] of Object.entries(locales)) {
    for (const key of publicMessageKeys) {
      const placeholders = value => [...value.matchAll(/\{([^}]+)\}/g)].map(match => match[1]).sort();
      assert.deepEqual(placeholders(locale.messages[key]), placeholders(english.messages[key]), `${code}:${key} placeholders`);
    }
  }
});

test("initial review locales can be selected and return their own UI and article translations", async () => {
  const globals = ["document", "localStorage", "navigator", "window", "CustomEvent"];
  const saved = new Map(globals.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const html = { lang: "", dir: "" };
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { documentElement: html, querySelectorAll: () => [] }
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: () => null, setItem: () => {} }
  });
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { language: "en" }
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { dispatchEvent: () => true }
  });
  Object.defineProperty(globalThis, "CustomEvent", {
    configurable: true,
    value: class { constructor(type) { this.type = type; } }
  });

  try {
    const { getLang, setLang, t, articleTranslation } = await import("../js/i18n.js?locale-switch-test");
    for (const code of initialLocales) {
      setLang(code);
      assert.equal(getLang(), code);
      assert.equal(html.lang, code);
      assert.equal(html.dir, directionFor(code));
      assert.ok(t("hero_title"), `${code}:hero_title`);
      assert.notEqual(t("hero_title"), english.messages.hero_title, `${code}:hero_title`);
      assert.ok(articleTranslation("contact").title, `${code}:contact article`);
    }
    assert.throws(() => setLang("hi"), /Unavailable language: hi/);
  } finally {
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});

test("locale files cover their required messages and all articles without empty translations", () => {
  for (const [code, locale] of Object.entries(locales)) {
    const expectedKeys = ["en", "fr", "ht"].includes(code)
      ? Object.keys(english.messages).sort()
      : publicMessageKeys;
    assert.deepEqual(Object.keys(locale.messages).sort(), expectedKeys, code);
    for (const [key, value] of Object.entries(locale.messages)) {
      assert.equal(typeof value, "string", `${code}:${key}`);
      if (key !== "policy_app_before") assert.ok(value.trim(), `${code}:${key}`);
    }
    assert.deepEqual(Object.keys(locale.articles).sort(), ARTICLES.map(article => article.id).sort(), code);
    for (const article of ARTICLES) {
      const translation = locale.articles[article.id];
      assert.ok(translation.title.trim(), `${code}:${article.id}`);
      assert.equal(translation.steps.length, english.articles[article.id].steps.length, `${code}:${article.id}`);
      assert.ok(translation.steps.every(step => step.trim()), `${code}:${article.id}`);
    }
    for (const category of HELP_CATEGORIES) assert.ok(locale.messages[`cat_${category}`], `${code}:${category}`);
  }
});

test("HTML localization keys exist and both pages retain language and privacy navigation", async () => {
  for (const file of ["index.html", "privacy.html"]) {
    const html = await readFile(file, "utf8");
    assert.match(html, /data-lang-select/);
    for (const [, key] of html.matchAll(/data-i18n(?:-ph|-aria)?="([^"]+)"/g)) {
      for (const [code, locale] of Object.entries(locales)) {
        assert.ok(Object.hasOwn(locale.messages, key), `${file}: ${code}:${key}`);
      }
    }
  }
  const homepage = await readFile("index.html", "utf8");
  const policy = await readFile("privacy.html", "utf8");
  assert.match(homepage, /href="\/privacy"/);
  assert.match(policy, /href="https:\/\/citycoreadmin\.com\/privacy"/);
  assert.match(policy, /href="mailto:citycoreadmin@gmail\.com"/);
});

test("public RTL styles use reading direction without changing support or staff layout rules", async () => {
  const css = await readFile("css/styles.css", "utf8");
  assert.match(css, /\[dir="rtl"\] \.skip:focus/);
  assert.match(css, /\[dir="rtl"\] \.search input\s*\{\s*text-align:\s*start;/);
  assert.match(css, /\[dir="rtl"\] \.privacy-policy/);
});
