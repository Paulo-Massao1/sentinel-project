import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import EmergencyModal from "./EmergencyModal";
import channelsData from "../data/channels.json";
import { detectCountry } from "../lib/detectLocale";
import type { Country } from "../types";

const STORAGE_KEY = "sentinel-country";

export default function EmergencyButton() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [country, setCountry] = useState<Country>(() => {
    return detectCountry() as Country;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, country);
  }, [country]);

  // Also sync if Act page changes it
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && e.newValue in channelsData) {
        setCountry(e.newValue as Country);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const countries: Country[] = ["brazil", "canada", "usa", "portugal", "uk"];

  return (
    <>
      {/* Floating emergency button */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1.5 sm:bottom-5 sm:right-5 sm:gap-2">
        {/* Country picker dropdown */}
        {showPicker && (
          <div className="mb-1 w-36 rounded-lg border border-white/10 bg-[#1A2B4A] p-1.5 shadow-xl sm:w-44 sm:p-2">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:mb-2 sm:text-xs">
              {t("emergency.selectCountry")}
            </p>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCountry(c);
                  setShowPicker(false);
                }}
                className={`w-full rounded px-2.5 py-1.5 text-left text-xs transition focus:outline-none sm:px-3 sm:py-2 sm:text-sm ${
                  country === c
                    ? "bg-[#2C5F8A] font-medium text-white"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                {t(`act.channels.countries.${c}`)}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Country selector toggle */}
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#1A2B4A] text-xs font-bold text-slate-300 shadow-lg transition hover:bg-[#2C5F8A] focus:outline-none focus:ring-2 focus:ring-[#2C5F8A] sm:h-10 sm:w-10"
            aria-label={t("emergency.selectCountry")}
          >
            {channelsData[country].flag}
          </button>

          {/* Emergency call button */}
          <button
            onClick={() => {
              setShowPicker(false);
              setShowModal(true);
            }}
            aria-label={t("emergency.button")}
            className="flex h-10 items-center gap-1.5 rounded-full bg-red-600 px-3 shadow-lg shadow-red-900/40 transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 sm:h-12 sm:gap-2 sm:px-5"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-white"
            >
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-bold text-white sm:hidden">
              SOS
            </span>
            <span className="hidden text-sm font-bold text-white sm:inline">
              {t("emergency.button")}
            </span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <EmergencyModal
          country={country}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
