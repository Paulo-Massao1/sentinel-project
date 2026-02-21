import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import channelsData from "../data/channels.json";
import type { Country } from "../types";

const countries: Country[] = ["brazil", "canada", "usa", "portugal", "uk"];

const flagEmoji: Record<string, string> = {
  BR: "\u{1F1E7}\u{1F1F7}",
  CA: "\u{1F1E8}\u{1F1E6}",
  US: "\u{1F1FA}\u{1F1F8}",
  PT: "\u{1F1F5}\u{1F1F9}",
  GB: "\u{1F1EC}\u{1F1E7}",
};

export default function Act() {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<Country>("usa");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const channel = channelsData[selectedCountry];

  const faqItems = [
    { q: t("act.faq.q1"), a: t("act.faq.a1") },
    { q: t("act.faq.q2"), a: t("act.faq.a2") },
    { q: t("act.faq.q3"), a: t("act.faq.a3") },
    { q: t("act.faq.q4"), a: t("act.faq.a4") },
  ];

  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <Link
          to="/"
          className="inline-block text-sm text-slate-400 transition hover:text-white"
        >
          &larr; {t("act.back")}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-[0.2em] text-white sm:text-4xl">
          {t("act.title")}
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
          {t("act.subtitle")}
        </p>
      </header>

      <main className="flex-1 px-6 pb-12">
        {/* DO and DON'T sections */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* WHAT TO DO */}
          <section className="rounded-lg border border-green-500/30 bg-green-900/15 p-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-green-400">
              {t("act.do.title")}
            </h2>
            <ol className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-200">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-xs font-bold text-green-400">
                    {i}
                  </span>
                  <span>
                    {t(`act.do.step${i}`)}
                    {i === 3 && (
                      <Link
                        to="/document"
                        className="ml-1 text-green-400 underline underline-offset-2 transition hover:text-green-300"
                      >
                        {t("act.do.documentLink")}
                      </Link>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* WHAT NOT TO DO */}
          <section className="rounded-lg border border-red-500/30 bg-red-900/15 p-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-red-400">
              {t("act.dont.title")}
            </h2>
            <ol className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-200">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                    {i}
                  </span>
                  <span>{t(`act.dont.step${i}`)}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* REPORTING CHANNELS */}
        <section className="mt-8">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">
            {t("act.channels.title")}
          </h2>

          {/* Country selector */}
          <div className="mb-4 flex flex-wrap gap-2">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#2C5F8A] ${
                  selectedCountry === c
                    ? "border-white/30 bg-[#2C5F8A] text-white"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {flagEmoji[channelsData[c].flag]} {t(`act.channels.countries.${c}`)}
              </button>
            ))}
          </div>

          {/* Channel card */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <div className="mb-4 text-2xl">
              {flagEmoji[channel.flag]}
            </div>

            {/* Main channel */}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {t("act.channels.mainChannel")}
              </p>
              <p className="mt-1 text-lg font-bold text-white">
                {channel.main.name}
              </p>
              {channel.main.phone && (
                <a
                  href={`tel:${channel.main.phone.replace(/[\s-]/g, "")}`}
                  className="mt-1 inline-block text-[#5BA3D9] underline underline-offset-2 transition hover:text-white"
                >
                  {channel.main.phone}
                </a>
              )}
              {(() => {
                const detailKey = `act.channels.details.${selectedCountry}`;
                const i18nDetail = t(detailKey, { defaultValue: "" });
                const detail = i18nDetail || channel.main.detail;
                return detail ? (
                  <span className="ml-2 text-sm text-slate-400">
                    ({detail})
                  </span>
                ) : null;
              })()}
            </div>

            {/* Emergency */}
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {t("act.channels.emergency")}
              </p>
              <a
                href={`tel:${channel.emergency.phone}`}
                className="mt-1 inline-block text-lg font-bold text-red-400 underline underline-offset-2 transition hover:text-red-300"
              >
                {channel.emergency.phone}
              </a>
            </div>

            {/* Online */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {t("act.channels.online")}
              </p>
              <a
                href={channel.online.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-[#5BA3D9] underline underline-offset-2 transition hover:text-white"
              >
                {channel.online.name}
              </a>
            </div>

            {/* Country-specific note */}
            {t(`act.channels.notes.${selectedCountry}`, { defaultValue: "" }) && (
              <div className="mt-4 rounded-md border border-yellow-500/20 bg-yellow-900/10 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400/80">
                  {t("act.channels.note")}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">
                  {t(`act.channels.notes.${selectedCountry}`)}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SUGGESTED REPORTING SCRIPT */}
        <section className="mt-8">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">
            {t("act.script.title")}
          </h2>
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="mb-3 text-sm text-slate-300">
              {t("act.script.intro")}
            </p>
            <ol className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2C5F8A]/40 text-xs font-bold text-[#5BA3D9]">
                    {i}
                  </span>
                  <span>{t(`act.script.item${i}`)}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-8">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">
            {t("act.faq.title")}
          </h2>
          <div className="space-y-2">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-white/10 bg-white/5"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
                >
                  <span>{item.q}</span>
                  <span className="ml-3 shrink-0 text-slate-400">
                    {openFaq === idx ? "\u2212" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="border-t border-white/10 px-5 py-4">
                    <p className="text-sm leading-relaxed text-slate-300">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
