import { useTranslation } from "react-i18next";
import channelsData from "../data/channels.json";

type Country = keyof typeof channelsData;

interface EmergencyModalProps {
  country: Country;
  onClose: () => void;
}

export default function EmergencyModal({ country, onClose }: EmergencyModalProps) {
  const { t } = useTranslation();
  const phone = channelsData[country].emergency.phone;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-[#1A2B4A] p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white">
          {t("emergency.modalTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {t("emergency.modalMessage", {
            phone,
            service: t(`emergency.services.${country}`),
          })}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
          >
            {t("emergency.cancel")}
          </button>
          <a
            href={`tel:${phone.replace(/[\s-]/g, "")}`}
            className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={onClose}
          >
            {t("emergency.callNow")}
          </a>
        </div>
      </div>
    </div>
  );
}
