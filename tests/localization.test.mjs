import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import english from "../js/locales/en.js";
import french from "../js/locales/fr.js";
import haitianCreole from "../js/locales/ht.js";
import { ARTICLES, HELP_CATEGORIES } from "../js/articles.js";
import { LANGS, COMPLETE_LOCALES, RTL_LOCALES, directionFor } from "../js/languages.js";

const locales = { en: english, fr: french, ht: haitianCreole };
const requested = "en fr ht es pt de it ar zh-Hans zh-Hant ja ko ru hi bn ur tr nl pl uk ro el sv nb da fi is cs sk hu bg sr hr bs sl sq mk lt lv et ga cy gd mt eu ca gl af sw am so yo ig ha zu xh mg rw sn st fa he ps kmr hy ka az kk uz mn ne si ta te kn ml mr gu pa or th vi id ms fil my km lo mi".split(" ");
const ios = "en-US en-GB da de es es-419 fr ht hr it lt hu nl nb pl pt-BR ro fi sv tr cs el bg ru uk hi th zh-Hans zh-Hant ja ko vi ca gl eu sl sr mk be lv is ga gd cy mt sq am ti so sw yo ig zu xh sn rw rn wo ar fa ps ur bn pa gu mr ta te kn ml si ne my km lo mn tg kk uz ky mi sm to fj qu ay gn nah".split(" ");

test("registry has unique codes, explicit coverage, and the requested RTL directions", () => {
  assert.equal(new Set(LANGS.map(language => language.code)).size, LANGS.length);
  assert.equal(requested.length, 89);
  assert.equal(ios.length, 88);
  assert.deepEqual(new Set(LANGS.map(language => language.code)), new Set([...requested, ...ios]));
  assert.equal(LANGS.length, 106);
  assert.deepEqual(LANGS.filter(language => language.complete).map(language => language.code), COMPLETE_LOCALES);
  for (const code of ["ar", "he", "fa", "ur", "ps"]) {
    assert.ok(RTL_LOCALES.includes(code));
    assert.equal(directionFor(code), "rtl");
  }
  assert.equal(directionFor("en"), "ltr");
});

test("complete locales cover every message and article without empty translations", () => {
  for (const [code, locale] of Object.entries(locales)) {
    assert.deepEqual(Object.keys(locale.messages).sort(), Object.keys(english.messages).sort(), code);
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
