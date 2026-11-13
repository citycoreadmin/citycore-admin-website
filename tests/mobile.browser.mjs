import test from "node:test";
import assert from "node:assert/strict";
import { webkit } from "playwright";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:8124";

test("public mobile controls work with normal, denied, and quota-limited storage", async t => {
  const browser = await webkit.launch();
  try {
    for (const width of [320, 375, 390, 430]) {
      for (const storage of ["normal", "denied", "quota"]) {
        await t.test(`${width}px / ${storage} storage`, async () => {
          const context = await browser.newContext({
            viewport: { width, height: 667 }, isMobile: true, hasTouch: true
          });
          context.setDefaultTimeout(5000);
          try {
            await context.addInitScript(mode => {
              if (mode === "denied") {
                Object.defineProperty(window, "localStorage", {
                  get() { throw new DOMException("Storage denied", "SecurityError"); }
                });
              } else {
                localStorage.setItem("cc_lang", "fr");
                if (mode === "quota") {
                  Storage.prototype.setItem = () => {
                    throw new DOMException("Storage full", "QuotaExceededError");
                  };
                }
              }
            }, storage);
            const page = await context.newPage();
            const errors = [];
            const failedAssets = [];
            page.on("pageerror", error => errors.push(error.message));
            page.on("requestfailed", request => failedAssets.push(request.url()));
            page.on("response", response => {
              if (response.status() >= 400) failedAssets.push(`${response.status()} ${response.url()}`);
            });
            assert.equal((await page.goto(base)).status(), 200);
            await page.locator(".cat-card").first().waitFor();
            assert.equal(await page.locator(".cat-card").count(), 8);
            assert.equal(await page.locator("#platformSel option").count(), 5);
            assert.equal(await page.locator("html").getAttribute("lang"), "en");
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
            const rtl = await page.evaluate(() => {
              document.documentElement.dir = "rtl";
              return {
                overflow: document.documentElement.scrollWidth > innerWidth,
                searchAlignment: getComputedStyle(document.querySelector("#searchInput")).textAlign,
                policyAlignment: getComputedStyle(document.querySelector(".cta")).textAlign
              };
            });
            assert.equal(rtl.overflow, false);
            assert.equal(rtl.searchAlignment, "start");
            assert.equal(rtl.policyAlignment, "center");
            await page.evaluate(() => { document.documentElement.dir = "ltr"; });

            await page.locator("[data-lang-select]").tap();
            const dialog = page.locator("#languageDialog");
            assert.equal(await dialog.evaluate(node => node.open), true);
            const bounds = await dialog.boundingBox();
            assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
            assert.ok(bounds.y >= 0 && bounds.y + bounds.height <= 667);
            assert.equal(await dialog.locator("input[type=radio]").count(), 106);
            assert.deepEqual(await dialog.locator("input[type=radio]:enabled").evaluateAll(nodes => nodes.map(n => n.value)), ["en"]);
            assert.equal(await dialog.locator(".status-review input:disabled").count(), 50);
            assert.equal(await dialog.locator(".status-unavailable input:disabled").count(), 55);
            await page.locator("#languageSearch").fill("es-419");
            assert.equal(await dialog.locator(".language-option:visible").count(), 1);
            assert.equal(await dialog.locator("input[value=es-419]").isDisabled(), true);
            await page.locator("#languageSearch").fill("Nederlands");
            assert.equal(await dialog.locator(".language-option:visible").count(), 1);
            assert.equal(await dialog.locator("input[value=nl]").isDisabled(), true);
            for (const code of ["sv", "ro", "id", "fa", "vi", "cs", "sr", "bn", "ur", "he", "fi", "th"]) {
              await page.locator("#languageSearch").fill(code);
              const row = dialog.locator(`.language-option:visible input[value="${code}"]`);
              assert.equal(await row.count(), 1);
              assert.equal(await row.isDisabled(), true);
            }
            await page.locator("#languageSearch").fill("English");
            await dialog.locator("input[value=en]").tap();
            await dialog.getByRole("button", { name: "Close", exact: true }).tap();
            await page.waitForFunction(() => document.activeElement === document.querySelector("[data-lang-select]"));

            const theme = await page.locator("html").getAttribute("data-theme");
            await page.locator("[data-theme-toggle]").tap();
            assert.notEqual(await page.locator("html").getAttribute("data-theme"), theme);
            await page.selectOption("#platformSel", "web");
            await page.locator("#searchInput").fill("transfer ownership");
            await page.locator("#searchForm button[type=submit]").tap();
            assert.equal(await page.locator("#noResults").isVisible(), true);
            await page.selectOption("#platformSel", "all");
            assert.equal(await page.locator(".art-card").count(), 1);
            await page.locator(".art-card").tap();
            assert.equal(await page.locator("#artDialog").evaluate(node => node.open), true);
            await page.locator("#artClose").tap();
            await page.locator("#listBack").tap();
            await page.locator(".cat-card").first().tap();
            assert.equal(await page.locator(".art-card").count(), 1);
            await page.locator("#listBack").tap();
            for (const hash of ["#home", "#help", "#contact"]) {
              const link = page.locator(`.nav-links a[href="${hash}"]`);
              assert.equal(await link.isVisible(), true);
              await link.tap();
              assert.equal(new URL(page.url()).hash, hash);
            }
            await page.locator('a[href="/privacy"]').tap();
            await page.waitForURL(/\/privacy$/);
            assert.match(page.url(), /\/privacy$/);
            assert.equal(await page.locator(".privacy-policy h1").textContent(), "Privacy Policy");
            const rtlPolicy = await page.evaluate(() => {
              document.documentElement.dir = "rtl";
              return {
                overflow: document.documentElement.scrollWidth > innerWidth,
                alignment: getComputedStyle(document.querySelector(".privacy-policy")).textAlign
              };
            });
            assert.deepEqual(rtlPolicy, { overflow: false, alignment: "start" });
            await page.evaluate(() => { document.documentElement.dir = "ltr"; });
            for (const code of ["ur", "he"]) {
              const draftLayout = await page.evaluate(async localeCode => {
                const { default: draft } = await import(`/js/locales/${localeCode}.js`);
                const nodes = [...document.querySelectorAll(".privacy-policy [data-i18n]")];
                const original = nodes.map(node => node.textContent);
                for (const node of nodes) node.textContent = draft.messages[node.dataset.i18n];
                document.documentElement.dir = "rtl";
                const result = {
                  overflow: document.documentElement.scrollWidth > innerWidth,
                  direction: getComputedStyle(document.querySelector(".privacy-policy")).direction,
                  title: document.querySelector(".privacy-policy h1").textContent
                };
                nodes.forEach((node, index) => { node.textContent = original[index]; });
                document.documentElement.dir = "ltr";
                return { ...result, expectedTitle: draft.messages.privacy };
              }, code);
              assert.equal(draftLayout.overflow, false, `${code} policy must fit`);
              assert.equal(draftLayout.direction, "rtl");
              assert.equal(draftLayout.title, draftLayout.expectedTitle);
            }
            await page.locator("[data-lang-select]").tap();
            assert.deepEqual(await page.locator("#languageDialog input:enabled[type=radio]").evaluateAll(nodes => nodes.map(n => n.value)), ["en"]);
            await page.keyboard.press("Escape");
            assert.equal(await page.locator("#languageDialog").evaluate(node => node.open), false);
            assert.equal((await page.goto(`${base}/privacy.html`)).status(), 200);
            assert.match(page.url(), /\/privacy$/);
            assert.deepEqual(errors, []);
            assert.deepEqual(failedAssets, []);
          } finally {
            await context.close();
          }
        });
      }
    }
  } finally {
    await browser.close();
  }
});
