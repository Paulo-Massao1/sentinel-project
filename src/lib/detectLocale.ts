const LANG_KEY = "sentinel-lang";
const COUNTRY_KEY = "sentinel-country";

type SupportedCountry = "brazil" | "canada" | "usa" | "portugal" | "uk";

const VALID_COUNTRIES: SupportedCountry[] = ["brazil", "canada", "usa", "portugal", "uk"];

const timezoneToCountry: Record<string, SupportedCountry> = {
  "America/Sao_Paulo": "brazil",
  "America/Fortaleza": "brazil",
  "America/Recife": "brazil",
  "America/Bahia": "brazil",
  "America/Belem": "brazil",
  "America/Manaus": "brazil",
  "America/Cuiaba": "brazil",
  "America/Porto_Velho": "brazil",
  "America/Boa_Vista": "brazil",
  "America/Rio_Branco": "brazil",
  "America/Toronto": "canada",
  "America/Vancouver": "canada",
  "America/Edmonton": "canada",
  "America/Winnipeg": "canada",
  "America/Halifax": "canada",
  "America/St_Johns": "canada",
  "America/Regina": "canada",
  "America/New_York": "usa",
  "America/Chicago": "usa",
  "America/Denver": "usa",
  "America/Los_Angeles": "usa",
  "America/Phoenix": "usa",
  "America/Anchorage": "usa",
  "Pacific/Honolulu": "usa",
  "Europe/Lisbon": "portugal",
  "Europe/London": "uk",
};

/** Detect user language from localStorage or browser settings, defaulting to English. */
export function detectLanguage(): string {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored) return stored;

  const browserLang = navigator.language || "";
  const lang = browserLang.startsWith("pt") ? "pt-BR" : "en";
  localStorage.setItem(LANG_KEY, lang);
  return lang;
}

/** Persist the selected language to localStorage. */
export function setLanguage(lang: string): void {
  localStorage.setItem(LANG_KEY, lang);
}

/** Detect user country from localStorage or timezone, defaulting to USA. */
export function detectCountry(): SupportedCountry {
  const stored = localStorage.getItem(COUNTRY_KEY);
  if (stored && VALID_COUNTRIES.includes(stored as SupportedCountry)) {
    return stored as SupportedCountry;
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const country = timezoneToCountry[tz] || "usa";
    localStorage.setItem(COUNTRY_KEY, country);
    return country;
  } catch {
    localStorage.setItem(COUNTRY_KEY, "usa");
    return "usa";
  }
}
