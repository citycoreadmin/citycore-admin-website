import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
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
import hindi from "../js/locales/hi.js";
import bengali from "../js/locales/bn.js";
import urdu from "../js/locales/ur.js";
import turkish from "../js/locales/tr.js";
import dutch from "../js/locales/nl.js";
import polish from "../js/locales/pl.js";
import ukrainian from "../js/locales/uk.js";
import romanian from "../js/locales/ro.js";
import greek from "../js/locales/el.js";
import swedish from "../js/locales/sv.js";
import norwegianBokmal from "../js/locales/nb.js";
import danish from "../js/locales/da.js";
import finnish from "../js/locales/fi.js";
import icelandic from "../js/locales/is.js";
import czech from "../js/locales/cs.js";
import slovak from "../js/locales/sk.js";
import slovenian from "../js/locales/sl.js";
import lithuanian from "../js/locales/lt.js";
import latvian from "../js/locales/lv.js";
import hungarian from "../js/locales/hu.js";
import bulgarian from "../js/locales/bg.js";
import serbian from "../js/locales/sr.js";
import croatian from "../js/locales/hr.js";
import bosnian from "../js/locales/bs.js";
import albanian from "../js/locales/sq.js";
import macedonian from "../js/locales/mk.js";
import estonian from "../js/locales/et.js";
import irish from "../js/locales/ga.js";
import welsh from "../js/locales/cy.js";
import scottishGaelic from "../js/locales/gd.js";
import maltese from "../js/locales/mt.js";
import basque from "../js/locales/eu.js";
import amharic from "../js/locales/am.js";
import somali from "../js/locales/so.js";
import yoruba from "../js/locales/yo.js";
import igbo from "../js/locales/ig.js";
import hausa from "../js/locales/ha.js";
import zulu from "../js/locales/zu.js";
import xhosa from "../js/locales/xh.js";
import malagasy from "../js/locales/mg.js";
import kinyarwanda from "../js/locales/rw.js";
import shona from "../js/locales/sn.js";
import sesotho from "../js/locales/st.js";
import pashto from "../js/locales/ps.js";
import kurmanji from "../js/locales/kmr.js";
import armenian from "../js/locales/hy.js";
import georgian from "../js/locales/ka.js";
import azerbaijani from "../js/locales/az.js";
import kazakh from "../js/locales/kk.js";
import uzbek from "../js/locales/uz.js";
import mongolian from "../js/locales/mn.js";
import nepali from "../js/locales/ne.js";
import sinhala from "../js/locales/si.js";
import catalan from "../js/locales/ca.js";
import galician from "../js/locales/gl.js";
import afrikaans from "../js/locales/af.js";
import swahili from "../js/locales/sw.js";
import persian from "../js/locales/fa.js";
import hebrew from "../js/locales/he.js";
import thai from "../js/locales/th.js";
import vietnamese from "../js/locales/vi.js";
import indonesian from "../js/locales/id.js";
import malay from "../js/locales/ms.js";
import filipino from "../js/locales/fil.js";
import englishUS from "../js/locales/en-US.js";
import englishGB from "../js/locales/en-GB.js";
import spanishLatinAmerica from "../js/locales/es-419.js";
import portugueseBrazil from "../js/locales/pt-BR.js";
import { ARTICLES, HELP_CATEGORIES } from "../js/articles.js";
import {
  LANGS, COMPLETE_LOCALES, REVIEW_LOCALES, PENDING_LOCALES, RTL_LOCALES, directionFor
} from "../js/languages.js";

const locales = {
  en: english, fr: french, ht: haitianCreole,
  es: spanish, pt: portuguese, de: german, it: italian, ar: arabic,
  "zh-Hans": chineseSimplified, "zh-Hant": chineseTraditional,
  ja: japanese, ko: korean, ru: russian, hi: hindi, bn: bengali, ur: urdu, tr: turkish,
  nl: dutch, pl: polish, uk: ukrainian, ro: romanian, el: greek, sv: swedish, nb: norwegianBokmal, da: danish, fi: finnish,
  is: icelandic, sl: slovenian, lt: lithuanian, lv: latvian,
  cs: czech, sk: slovak, hu: hungarian, bg: bulgarian, sr: serbian, hr: croatian, bs: bosnian,
  sq: albanian, mk: macedonian, et: estonian, ga: irish, cy: welsh, gd: scottishGaelic, mt: maltese, eu: basque, am: amharic,
  so: somali, yo: yoruba, ig: igbo, ha: hausa, zu: zulu, xh: xhosa, mg: malagasy, rw: kinyarwanda, sn: shona, st: sesotho,
  ps: pashto, kmr: kurmanji, hy: armenian, ka: georgian, az: azerbaijani, kk: kazakh, uz: uzbek, mn: mongolian, ne: nepali, si: sinhala,
  ca: catalan, gl: galician, af: afrikaans, sw: swahili, fa: persian, he: hebrew, th: thai, vi: vietnamese,
  id: indonesian, ms: malay, fil: filipino,
  "en-US": englishUS, "en-GB": englishGB,
  "es-419": spanishLatinAmerica, "pt-BR": portugueseBrazil
};
const initialLocales = ["es", "pt", "de", "it", "ar", "zh-Hans", "zh-Hant", "ja", "ko", "ru", "hi", "tr"];
const newDrafts = ["nl", "pl", "uk", "ro", "sv", "nb", "da", "cs", "sk", "sr", "hr", "bs", "ca", "gl", "af", "sw", "fa", "vi", "id", "ms", "fil", "en-US", "en-GB", "es-419", "pt-BR"];
const batchDrafts = ["bn", "ur", "el", "bg", "he", "fi", "hu", "sq", "mk", "et", "th"];
const newBatch = ["is", "sl", "lt", "lv", "ga", "cy", "gd", "mt", "eu", "am"];
const currentBatch = ["so", "yo", "ig", "ha", "zu", "xh", "mg", "rw", "sn", "st"];
const nextBatch = ["ps", "kmr", "hy", "ka", "az", "kk", "uz", "mn", "ne", "si"];
const publicMessageKeys = [
  "skip_content", "close", "page_home_title", "page_privacy_title",
  "language_available", "language_complete", "language_review", "language_unavailable",
  "language_choose", "language_search", "language_no_results",
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
  assert.deepEqual(new Set(REVIEW_LOCALES), new Set(["fr", "ht", ...initialLocales, ...newDrafts, ...batchDrafts, ...newBatch, ...currentBatch, ...nextBatch]));
  assert.equal(PENDING_LOCALES.length, 25);
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

test("representative flags are preserved, including subdivision flags and regional Spanish", () => {
  const flagFor = code => LANGS.find(language => language.code === code).flag;
  const expected = {
    sw: "🇹🇿", am: "🇪🇹", so: "🇸🇴", yo: "🇳🇬", ig: "🇳🇬", ha: "🇳🇬",
    zu: "🇿🇦", xh: "🇿🇦", mg: "🇲🇬", rw: "🇷🇼", sn: "🇿🇼", st: "🇱🇸",
    ta: "🇮🇳", te: "🇮🇳", kn: "🇮🇳", ml: "🇮🇳", mr: "🇮🇳", gu: "🇮🇳",
    pa: "🇮🇳", or: "🇮🇳", "es-419": "🌎"
  };
  for (const [code, flag] of Object.entries(expected)) assert.equal(flagFor(code), flag, code);
  const subdivisionFlag = code =>
    `🏴${[...code].map(letter => String.fromCodePoint(0xE0000 + letter.codePointAt(0))).join("")}${String.fromCodePoint(0xE007F)}`;
  assert.equal(flagFor("cy"), subdivisionFlag("gbwls"));
  assert.equal(flagFor("gd"), subdivisionFlag("gbsct"));
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

test("only complete locales can be selected, including when an unapproved locale is saved or preferred", async () => {
  const globals = ["document", "localStorage", "navigator", "window", "CustomEvent"];
  const saved = new Map(globals.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const html = { lang: "", dir: "" };
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { documentElement: html, querySelectorAll: () => [] }
  });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: { getItem: () => "fr", setItem: () => {} }
  });
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { language: "fr" }
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
    assert.equal(getLang(), "en");
    assert.equal(html.lang, "en");
    assert.equal(html.dir, "ltr");
    assert.equal(t("hero_title"), english.messages.hero_title);
    assert.ok(articleTranslation("contact").title);
    assert.deepEqual(LANGS.filter(language => language.complete).map(language => language.code), ["en"]);
    for (const code of [...REVIEW_LOCALES, ...PENDING_LOCALES]) {
      assert.throws(() => setLang(code), new RegExp(`Unavailable language: ${code}`));
      assert.equal(getLang(), "en", `${code} must not change the active locale`);
    }
    setLang("en");
    assert.equal(getLang(), "en");
  } finally {
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});

test("locale files cover their required messages and all articles without empty translations", () => {
  assert.deepEqual(
    Object.keys(locales).sort(),
    [...COMPLETE_LOCALES, ...REVIEW_LOCALES].sort(),
    "only complete and review-needed locale modules are shipped"
  );
  for (const [code, locale] of Object.entries(locales)) {
    const expectedKeys = ["en", "fr", "ht", "en-US", "en-GB"].includes(code)
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

test("regional drafts retain localized policy and article content", () => {
  assert.equal(englishGB.messages.policy_updated, "Last updated: 12 November 2026");
  assert.match(spanishLatinAmerica.articles.servers.steps[1], /Toca/);
  assert.match(portugueseBrazil.messages.policy_website_data, /Você/);
  assert.match(portugueseBrazil.articles["login-problems"].steps[0], /senha/);
  for (const code of [...newDrafts, ...batchDrafts, ...newBatch, ...currentBatch, ...nextBatch]) {
    assert.ok(REVIEW_LOCALES.includes(code));
    assert.ok(!COMPLETE_LOCALES.includes(code));
  }
});

test("new non-English drafts do not use English sentences as placeholders", () => {
  const sharedTerms = new Set(["p_ios", "p_ipados", "p_android", "p_web"]);
  for (const code of ["nl", "pl", "uk", "ro", "sv", "nb", "da", "cs", "sk", "sr", "hr", "bs", "ca", "gl", "af", "sw", "fa", "vi", "id", "ms", "fil", "es-419", "pt-BR", ...batchDrafts, ...newBatch, ...currentBatch, ...nextBatch]) {
    const locale = locales[code];
    for (const key of publicMessageKeys) {
      if (sharedTerms.has(key) || (code === "nl" && ["nav_home", "platform"].includes(key)) ||
          (code === "sv" && key === "nav_support") ||
          (code === "da" && ["nav_support", "platform"].includes(key)) ||
          (code === "ca" && ["articles", "article_count"].includes(key)) ||
          (["af", "hu", "id", "ms"].includes(code) && key === "platform")) continue;
      assert.notEqual(locale.messages[key], english.messages[key], `${code}:${key}`);
    }
    for (const [id, article] of Object.entries(locale.articles)) {
      assert.notEqual(article.title, english.articles[id].title, `${code}:${id}:title`);
      article.steps.forEach((step, index) => {
        if (code === "nl" && id === "servers" && index === 0) return;
        assert.notEqual(step, english.articles[id].steps[index], `${code}:${id}:${index}`);
      });
    }
  }
});

test("no Coming soon locale module is published as an unreviewed translation", async () => {
  const files = new Set((await readdir(new URL("../js/locales/", import.meta.url)))
    .filter(file => file.endsWith(".js"))
    .map(file => file.slice(0, -3)));
  assert.deepEqual([...files].sort(), [...COMPLETE_LOCALES, ...REVIEW_LOCALES].sort());
  for (const code of PENDING_LOCALES) assert.equal(files.has(code), false, code);
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
  assert.match(homepage, /<button[^>]*data-lang-select[^>]*aria-haspopup="dialog"/);
  assert.match(policy, /<button[^>]*data-lang-select[^>]*aria-haspopup="dialog"/);
  assert.match(policy, /href="https:\/\/citycoreadmin\.com\/privacy"/);
  assert.match(policy, /href="mailto:citycoreadmin@gmail\.com"/);
});

test("public RTL styles use reading direction without changing support or staff layout rules", async () => {
  const css = await readFile("css/styles.css", "utf8");
  assert.match(css, /\[dir="rtl"\] \.skip:focus/);
  assert.match(css, /\[dir="rtl"\] \.search input\s*\{\s*text-align:\s*start;/);
  assert.match(css, /\[dir="rtl"\] \.privacy-policy/);
});
