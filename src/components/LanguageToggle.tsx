import { useTranslation } from "react-i18next";
import { setLanguage } from "../lib/detectLocale";

export default function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  function toggle() {
    const newLang = isEn ? "pt-BR" : "en";
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
      aria-label={t("common.switchLanguage")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
          clipRule="evenodd"
        />
      </svg>
      <span className={isEn ? "font-bold text-white" : ""}>EN</span>
      <span className="text-slate-500">|</span>
      <span className={!isEn ? "font-bold text-white" : ""}>PT</span>
    </button>
  );
}
