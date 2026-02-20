import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCases } from "../hooks/useCases";

const categoryKeys = ["physical", "emotional", "sexual", "neglect", "unsure"] as const;
const concernLevels = ["low", "medium", "high", "emergency"] as const;

function toLocalDatetimeValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

interface LocationState {
  category?: string;
  checkedSigns?: string[];
  concernLevel?: string;
}

export default function NewCase() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const { createCase, addObservation } = useCases();

  const [name, setName] = useState("");
  const [category, setCategory] = useState(state.category ?? "");
  const [date, setDate] = useState(toLocalDatetimeValue(new Date()));
  const [description, setDescription] = useState("");
  const [childInfo, setChildInfo] = useState("");
  const [signsChecked] = useState<string[]>(state.checkedSigns ?? []);
  const [concernLevel, setConcernLevel] = useState(state.concernLevel ?? "");

  async function handleSave() {
    if (!name.trim() || !category || !concernLevel) return;
    const caseId = await createCase(name.trim(), category);
    await addObservation(caseId, {
      date: new Date(date).toISOString(),
      description,
      childInfo,
      signsChecked,
      concernLevel,
    });
    navigate(`/document/${caseId}`, { replace: true });
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="px-6 pt-8 pb-4">
        <Link
          to="/document"
          className="inline-block text-sm text-slate-400 transition hover:text-white"
        >
          &larr; {t("document.back")}
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-[0.2em] text-white sm:text-4xl">
          {t("document.newCase.title")}
        </h1>
      </header>

      <main className="flex-1 px-6 pb-12">
        <div className="mx-auto max-w-lg space-y-5">
          {/* Case name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t("document.newCase.nameLabel")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("document.newCase.namePlaceholder")}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-[#2C5F8A] focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t("document.form.categoryLabel")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition focus:border-[#2C5F8A] focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
            >
              <option value="" disabled>
                {t("document.form.categoryPlaceholder")}
              </option>
              {categoryKeys.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1A2B4A]">
                  {t(`document.form.categoryOptions.${cat}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Divider — first observation */}
          <div className="border-t border-white/10 pt-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t("document.newCase.firstObservation")}
            </h2>
          </div>

          {/* Date/time */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t("document.form.dateLabel")}
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition focus:border-[#2C5F8A] focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t("document.form.descriptionLabel")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("document.form.descriptionPlaceholder")}
              rows={4}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-[#2C5F8A] focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
            />
          </div>

          {/* Child info */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t("document.form.childInfoLabel")}
            </label>
            <textarea
              value={childInfo}
              onChange={(e) => setChildInfo(e.target.value)}
              placeholder={t("document.form.childInfoPlaceholder")}
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-[#2C5F8A] focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
            />
          </div>

          {/* Signs summary (read-only, from Identify) */}
          {signsChecked.length > 0 && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                {t("document.form.signsLabel")}
              </label>
              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <ul className="space-y-1">
                  {signsChecked.map((signId) => (
                    <li key={signId} className="text-sm text-slate-300">
                      &bull; {t(`identify.signs.${signId.split("-").join("")}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Concern level */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              {t("document.form.concernLevelLabel")}
            </label>
            <div className="flex flex-wrap gap-2">
              {concernLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setConcernLevel(level)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#2C5F8A] ${
                    concernLevel === level
                      ? level === "emergency"
                        ? "border-red-500/40 bg-red-900/30 text-red-300"
                        : level === "high"
                          ? "border-orange-500/40 bg-orange-900/20 text-orange-300"
                          : level === "medium"
                            ? "border-yellow-500/40 bg-yellow-900/20 text-yellow-300"
                            : "border-white/30 bg-[#2C5F8A] text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {t(`document.form.concernLevels.${level}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!name.trim() || !category || !concernLevel}
            className="w-full rounded-lg bg-[#2C5F8A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#2C5F8A]/80 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("document.newCase.save")}
          </button>
        </div>
      </main>
    </div>
  );
}
