// Flags are representative; a language can be used in more than one country.
const definitions = [
  ["en", "🇺🇸", "English"], ["fr", "🇫🇷", "Français"], ["ht", "🇭🇹", "Kreyòl Ayisyen"],
  ["es", "🇪🇸", "Español"], ["pt", "🇵🇹", "Português"], ["de", "🇩🇪", "Deutsch"],
  ["it", "🇮🇹", "Italiano"], ["ar", "🇸🇦", "العربية"], ["zh-Hans", "🇨🇳", "简体中文"],
  ["zh-Hant", "🇹🇼", "繁體中文"], ["ja", "🇯🇵", "日本語"], ["ko", "🇰🇷", "한국어"],
  ["ru", "🇷🇺", "Русский"], ["hi", "🇮🇳", "हिन्दी"], ["bn", "🇧🇩", "বাংলা"],
  ["ur", "🇵🇰", "اردو"], ["tr", "🇹🇷", "Türkçe"], ["nl", "🇳🇱", "Nederlands"],
  ["pl", "🇵🇱", "Polski"], ["uk", "🇺🇦", "Українська"], ["ro", "🇷🇴", "Română"],
  ["el", "🇬🇷", "Ελληνικά"], ["sv", "🇸🇪", "Svenska"], ["nb", "🇳🇴", "Norsk Bokmål"],
  ["da", "🇩🇰", "Dansk"], ["fi", "🇫🇮", "Suomi"], ["is", "🇮🇸", "Íslenska"],
  ["cs", "🇨🇿", "Čeština"], ["sk", "🇸🇰", "Slovenčina"], ["hu", "🇭🇺", "Magyar"],
  ["bg", "🇧🇬", "Български"], ["sr", "🇷🇸", "Српски"], ["hr", "🇭🇷", "Hrvatski"],
  ["bs", "🇧🇦", "Bosanski"], ["sl", "🇸🇮", "Slovenščina"], ["sq", "🇦🇱", "Shqip"],
  ["mk", "🇲🇰", "Македонски"], ["lt", "🇱🇹", "Lietuvių"], ["lv", "🇱🇻", "Latviešu"],
  ["et", "🇪🇪", "Eesti"], ["ga", "🇮🇪", "Gaeilge"],
  ["cy", "\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "Cymraeg"],
  ["gd", "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "Gàidhlig"],
  ["mt", "🇲🇹", "Malti"], ["eu", "🇪🇸", "Euskara"],
  ["ca", "🇪🇸", "Català"], ["gl", "🇪🇸", "Galego"], ["af", "🇿🇦", "Afrikaans"],
  ["sw", "🇹🇿", "Kiswahili"], ["am", "🇪🇹", "አማርኛ"], ["so", "🇸🇴", "Soomaali"],
  ["yo", "🇳🇬", "Yorùbá"], ["ig", "🇳🇬", "Igbo"], ["ha", "🇳🇬", "Hausa"],
  ["zu", "🇿🇦", "isiZulu"], ["xh", "🇿🇦", "isiXhosa"], ["mg", "🇲🇬", "Malagasy"],
  ["rw", "🇷🇼", "Kinyarwanda"], ["sn", "🇿🇼", "chiShona"], ["st", "🇱🇸", "Sesotho"],
  ["fa", "🇮🇷", "فارسی"], ["he", "🇮🇱", "עברית"], ["ps", "🇦🇫", "پښتو"],
  ["kmr", "🇹🇷", "Kurmancî"], ["hy", "🇦🇲", "Հայերեն"], ["ka", "🇬🇪", "ქართული"],
  ["az", "🇦🇿", "Azərbaycanca"], ["kk", "🇰🇿", "Қазақша"], ["uz", "🇺🇿", "Oʻzbekcha"],
  ["mn", "🇲🇳", "Монгол"], ["ne", "🇳🇵", "नेपाली"], ["si", "🇱🇰", "සිංහල"],
  ["ta", "🇮🇳", "தமிழ்"], ["te", "🇮🇳", "తెలుగు"], ["kn", "🇮🇳", "ಕನ್ನಡ"],
  ["ml", "🇮🇳", "മലയാളം"], ["mr", "🇮🇳", "मराठी"], ["gu", "🇮🇳", "ગુજરાતી"],
  ["pa", "🇮🇳", "ਪੰਜਾਬੀ"], ["or", "🇮🇳", "ଓଡ଼ିଆ"], ["th", "🇹🇭", "ไทย"],
  ["vi", "🇻🇳", "Tiếng Việt"], ["id", "🇮🇩", "Bahasa Indonesia"], ["ms", "🇲🇾", "Bahasa Melayu"],
  ["fil", "🇵🇭", "Filipino"], ["my", "🇲🇲", "မြန်မာဘာသာ"], ["km", "🇰🇭", "ភាសាខ្មែរ"],
  ["lo", "🇱🇦", "ລາວ"], ["mi", "🇳🇿", "Te Reo Māori"],
  ["en-US", "🇺🇸", "English (US)"], ["en-GB", "🇬🇧", "English (UK)"],
  ["es-419", "🌎", "Español (Latinoamérica)"], ["pt-BR", "🇧🇷", "Português (Brasil)"],
  ["be", "🇧🇾", "Беларуская"], ["ti", "🇪🇷", "ትግርኛ"], ["rn", "🇧🇮", "Ikirundi"],
  ["wo", "🇸🇳", "Wolof"], ["tg", "🇹🇯", "Тоҷикӣ"], ["ky", "🇰🇬", "Кыргызча"],
  ["sm", "🇼🇸", "Gagana Samoa"], ["to", "🇹🇴", "Lea faka-Tonga"],
  ["fj", "🇫🇯", "Na Vosa Vakaviti"], ["qu", "🇵🇪", "Runasimi"],
  ["ay", "🇧🇴", "Aymar aru"], ["gn", "🇵🇾", "Avañe’ẽ"], ["nah", "🇲🇽", "Nāhuatl"]
];

export const COMPLETE_LOCALES = ["en"];
export const REVIEW_LOCALES = [
  "fr", "ht", "es", "pt", "de", "it", "ar", "zh-Hans", "zh-Hant", "ja", "ko", "ru", "hi", "bn", "ur", "tr",
  "nl", "pl", "uk", "ro", "el", "sv", "nb", "da", "fi", "is", "cs", "sk", "hu", "bg", "sr", "hr", "bs", "sl", "sq", "mk", "lt", "lv", "et",
  "ga", "cy", "gd", "mt", "eu", "ca", "gl", "af", "sw", "am", "so", "yo", "ig", "ha", "zu", "xh", "mg", "rw", "sn", "st", "fa", "he", "th", "vi", "id", "ms", "fil",
  "en-US", "en-GB", "es-419", "pt-BR"
];
export const PENDING_LOCALES = definitions
  .map(([code]) => code)
  .filter(code => !COMPLETE_LOCALES.includes(code) && !REVIEW_LOCALES.includes(code));
export const LANGS = definitions.map(([code, flag, label]) => ({
  code, flag, label,
  complete: COMPLETE_LOCALES.includes(code),
  review: REVIEW_LOCALES.includes(code)
}));
export const RTL_LOCALES = ["ar", "he", "fa", "ur", "ps"];
export const directionFor = code => RTL_LOCALES.includes(code) ? "rtl" : "ltr";
