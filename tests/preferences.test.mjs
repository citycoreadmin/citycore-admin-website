import test from "node:test";
import assert from "node:assert/strict";
import { readPreference, writePreference } from "../js/preferences.js";

test("preferences tolerate denied storage and full quotas but propagate unexpected failures", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const warn = console.warn;
  const warnings = [];
  console.warn = (...args) => warnings.push(args);
  try {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() { throw new DOMException("Blocked", "SecurityError"); }
    });
    assert.equal(readPreference("cc_lang"), null);
    assert.doesNotThrow(() => writePreference("cc_theme", "dark"));
    assert.equal(warnings.length, 2);

    const values = new Map([["cc_lang", "en"]]);
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: key => values.get(key) ?? null,
        setItem: () => { throw new DOMException("Full", "QuotaExceededError"); }
      }
    });
    assert.equal(readPreference("cc_lang"), "en");
    assert.doesNotThrow(() => writePreference("cc_theme", "light"));
    assert.equal(warnings.length, 3);

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: () => { throw new TypeError("Unexpected"); },
        setItem: () => { throw new TypeError("Unexpected"); }
      }
    });
    assert.throws(() => readPreference("cc_lang"), /Unexpected/);
    assert.throws(() => writePreference("cc_theme", "dark"), /Unexpected/);
  } finally {
    console.warn = warn;
    if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
    else delete globalThis.localStorage;
  }
});
