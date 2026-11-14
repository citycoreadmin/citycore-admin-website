import { LANGS, getLang, setLang, applyI18n, t } from "./i18n.js";
import { readPreference, writePreference } from "./preferences.js";

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
  const saved = readPreference("cc_theme");
  const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelectorAll("[data-theme-toggle]").forEach(b => b.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    writePreference("cc_theme", next);
  }));
}

export function initMobileNav() {
  const trigger = document.querySelector(".mobile-menu-trigger");
  const dialog = document.querySelector("#mobileMenu");
  if (!trigger || !dialog) return;

  const mobile = matchMedia("(max-width: 860px)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const close = () => {
    if (!dialog.open || dialog.classList.contains("is-closing")) return;
    if (reducedMotion.matches) {
      dialog.close();
    } else {
      dialog.classList.add("is-closing");
    }
  };

  trigger.addEventListener("click", () => {
    dialog.showModal();
    document.body.classList.add("mobile-menu-open");
    trigger.setAttribute("aria-expanded", "true");
  });
  dialog.querySelector(".mobile-menu-close").addEventListener("click", close);
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll("button, a[href]")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  });
  dialog.querySelectorAll("a").forEach(link => link.addEventListener("click", () => dialog.close()));
  dialog.addEventListener("animationend", event => {
    if (event.target === dialog && dialog.classList.contains("is-closing")) dialog.close();
  });
  dialog.addEventListener("close", () => {
    dialog.classList.remove("is-closing");
    document.body.classList.remove("mobile-menu-open");
    trigger.setAttribute("aria-expanded", "false");
    if (mobile.matches) trigger.focus();
  });
  mobile.addEventListener("change", () => {
    if (!mobile.matches && dialog.open) dialog.close();
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches && dialog.classList.contains("is-closing")) dialog.close();
  });
}

export function initLangSelects() {
  const triggers = [...document.querySelectorAll("[data-lang-select]")];
  if (!triggers.length) return;

  const search = h("input", {
    id: "languageSearch", class: "language-search", type: "search", autocomplete: "off"
  });
  const empty = h("p", { class: "language-empty", "aria-live": "polite", hidden: true });
  const list = h("div", { class: "language-list" });
  const dialog = h("dialog", { id: "languageDialog", class: "language-dialog", "aria-labelledby": "languageDialogTitle" });
  const title = h("h2", { id: "languageDialogTitle" });
  const close = h("button", { type: "button", class: "icon-btn", "aria-label": "", onclick: () => dialog.close() }, "×");
  const heading = h("div", { class: "language-dialog-head" }, title, close);
  const searchLabel = h("label", { for: search.id, class: "language-search-label" });
  dialog.append(heading, searchLabel, search, empty, list);
  document.body.append(dialog);

  let activeTrigger = null;
  const statusKey = status => ({
    complete: "language_complete",
    review: "language_review",
    unavailable: "language_unavailable"
  })[status];

  function filterLanguages() {
    const query = search.value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
    let visible = 0;
    for (const group of list.children) {
      let groupVisible = false;
      for (const row of group.querySelectorAll(".language-option")) {
        row.hidden = query !== "" && !row.dataset.search.includes(query);
        groupVisible ||= !row.hidden;
        visible += row.hidden ? 0 : 1;
      }
      group.hidden = !groupVisible;
    }
    empty.hidden = visible > 0;
  }

  function draw() {
    title.textContent = t("language_choose");
    close.setAttribute("aria-label", t("close"));
    searchLabel.textContent = t("language_search");
    search.placeholder = t("language_search");
    empty.textContent = t("language_no_results");

    const groups = [
      { status: "complete", title: t("language_complete") },
      { status: "review", title: t("language_review") },
      { status: "unavailable", title: t("language_unavailable") }
    ];
    list.replaceChildren(...groups.map(({ status, title: groupTitle }) => {
      const languages = LANGS.filter(language =>
        status === "complete" ? language.complete :
          status === "review" ? language.review : !language.complete && !language.review
      );
      const rows = languages.map(language => {
        const statusText = t(statusKey(status));
        const flag = displayFlag(language.flag);
        const radio = h("input", {
          type: "radio", name: "cc-language", value: language.code,
          checked: language.code === getLang(),
          disabled: !language.complete,
          onchange: () => {
            if (!radio.checked) return;
            setLang(language.code);
            dialog.close();
          }
        });
        const row = h("label", {
          class: `language-option${language.code === getLang() ? " is-selected" : ""}${language.complete ? "" : " is-unavailable"}`,
          "data-search": `${language.label} ${language.code}`.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase()
        },
        radio,
        h("span", { class: "language-flag", "aria-hidden": "true" }, flag),
        h("span", { class: "language-option-label" },
          h("span", { class: "language-name" }, language.label),
          h("span", { class: "language-code" }, language.code)
        ),
        h("span", { class: "language-status" }, statusText));
        return row;
      });
      return h("fieldset", { class: `language-group status-${status}` },
        h("legend", {}, `${groupTitle} (${languages.length})`), ...rows);
    }));

    triggers.forEach(trigger => {
      const language = LANGS.find(item => item.code === getLang());
      const status = language.complete ? "complete" : language.review ? "review" : "unavailable";
      const flag = displayFlag(language.flag);
      trigger.replaceChildren(
        h("span", { class: "language-trigger-flag", "aria-hidden": "true" }, flag),
        h("span", { class: "language-trigger-label" }, language.label),
        h("span", { class: "language-trigger-status" }, t(statusKey(status)))
      );
      trigger.setAttribute("aria-label", `${t("language")}: ${language.label} (${language.code}), ${t(statusKey(status))}`);
      trigger.setAttribute("aria-controls", "languageDialog");
      trigger.setAttribute("aria-expanded", String(dialog.open));
    });
    filterLanguages();
  }

  triggers.forEach(trigger => trigger.addEventListener("click", () => {
    activeTrigger = trigger;
    search.value = "";
    filterLanguages();
    trigger.setAttribute("aria-expanded", "true");
    dialog.showModal();
    search.focus();
  }));
  search.addEventListener("input", filterLanguages);
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    triggers.forEach(trigger => trigger.setAttribute("aria-expanded", "false"));
    activeTrigger?.focus();
    activeTrigger = null;
  });
  window.addEventListener("cc:lang", draw);
  draw();
  applyI18n();
}

const subdivisionFlagSupport = new Map();

function displayFlag(flag) {
  return subdivisionFlagSupported(flag) ? flag :
    /[\u{E0067}-\u{E007F}]/u.test(flag) ? "🌐" : flag;
}

function subdivisionFlagSupported(flag) {
  if (!/[\u{E0067}-\u{E007F}]/u.test(flag)) return true;
  if (subdivisionFlagSupport.has(flag)) return subdivisionFlagSupport.get(flag);
  const canvas = document.createElement("canvas");
  canvas.width = 48;
  canvas.height = 48;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    subdivisionFlagSupport.set(flag, false);
    return false;
  }
  context.font = '40px "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji", sans-serif';
  const render = value => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(value, 2, 42);
    return context.getImageData(0, 0, canvas.width, canvas.height).data;
  };
  let supported;
  try {
    const flagPixels = render(flag);
    const fallbackPixels = render("🏴");
    supported = flagPixels.some((pixel, index) => pixel !== fallbackPixels[index]);
  } catch (error) {
    if (error.name !== "SecurityError" && error.name !== "NotSupportedError") throw error;
    supported = false;
  }
  subdivisionFlagSupport.set(flag, supported);
  return supported;
}
