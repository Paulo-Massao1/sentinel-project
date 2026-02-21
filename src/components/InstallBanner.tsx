import { useTranslation } from "react-i18next";
import { useInstallPrompt, useIosInstallHint } from "../hooks/useInstallPrompt";

export default function InstallBanner() {
  const { t } = useTranslation();
  const { canInstall, promptInstall, dismiss } = useInstallPrompt();
  const { showIosHint, dismissIosHint } = useIosInstallHint();

  if (!canInstall && !showIosHint) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 z-40 mx-auto max-w-md rounded-lg border border-white/10 bg-[#1A2B4A] px-4 py-3 shadow-xl sm:bottom-20 sm:left-auto sm:right-5">
      <div className="flex items-center gap-3">
        <p className="flex-1 text-sm text-slate-200">
          {canInstall ? t("install.message") : t("install.iosHint")}
        </p>
        {canInstall && (
          <button
            onClick={promptInstall}
            className="shrink-0 rounded-lg bg-[#2C5F8A] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2C5F8A]/80 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
          >
            {t("install.button")}
          </button>
        )}
        <button
          onClick={canInstall ? dismiss : dismissIosHint}
          className="shrink-0 text-slate-400 transition hover:text-white focus:outline-none"
          aria-label={t("install.dismiss")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
