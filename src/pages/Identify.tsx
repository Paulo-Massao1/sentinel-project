import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import signsData from "../data/signs.json";
import type { Category, Sign, SignType } from "../types";
import { computeConcernLevel } from "../utils/concernLevel";

const categories: Array<Category | "all"> = [
  "physical",
  "emotional",
  "sexual",
  "neglect",
  "all",
];

const allSigns = Object.entries(signsData) as [Category, Sign[]][];

export default function Identify() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Category | "all" | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Build a flat map of id → sign + category for concern calculation
  const signMap = useMemo(() => {
    const map = new Map<string, Sign & { category: Category }>();
    for (const [cat, signs] of allSigns) {
      for (const sign of signs) {
        map.set(sign.id, { ...sign, category: cat });
      }
    }
    return map;
  }, []);

  // Get visible signs based on selected category
  const visibleSigns = useMemo(() => {
    if (!selected) return [];
    if (selected === "all") {
      return allSigns.flatMap(([cat, signs]) =>
        signs.map((s) => ({ ...s, category: cat })),
      );
    }
    const signs = signsData[selected] as Sign[];
    return signs.map((s) => ({ ...s, category: selected }));
  }, [selected]);

  // Group visible signs by type
  const grouped = useMemo(() => {
    const physical = visibleSigns.filter((s) => s.type === "physical");
    const behavioral = visibleSigns.filter((s) => s.type === "behavioral");
    return { physical, behavioral };
  }, [visibleSigns]);

  const concernLevel = computeConcernLevel(checked, signMap);

  function toggleSign(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectCategory(cat: Category | "all") {
    setSelected(cat);
    setChecked(new Set());
  }

  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/"
            className="inline-block text-sm text-slate-400 transition hover:text-white"
          >
            ← {t("identify.back")}
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold tracking-[0.2em] text-white sm:text-4xl">
            {t("identify.title")}
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
            {t("identify.subtitle")}
          </p>
        </div>
      </header>

      <main className="flex-1 px-6 pb-12">
        {/* Category selector */}
        <div className="flex flex-wrap gap-2 pt-2 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#2C5F8A] ${
                selected === cat
                  ? "border-white/30 bg-[#2C5F8A] text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {t(`identify.categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Desktop empty state — instruction when no category is selected */}
        {!selected && (
          <div className="py-12 text-center">
            <div className="mx-auto max-w-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl">
                🔍
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                {t("identify.emptyState")}
              </p>
            </div>
          </div>
        )}

        {/* Signs checklist */}
        {selected && (
          <div className="space-y-6">
            {(["physical", "behavioral"] as SignType[]).map((type) => {
              const signs = grouped[type];
              if (signs.length === 0) return null;
              return (
                <section key={type}>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {t(`identify.typeLabels.${type}`)}
                  </h2>
                  <div className="grid gap-2">
                    {signs.map((sign) => (
                      <label
                        key={sign.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition ${
                          checked.has(sign.id)
                            ? "border-[#2C5F8A] bg-[#2C5F8A]/30"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked.has(sign.id)}
                          onChange={() => toggleSign(sign.id)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#2C5F8A]"
                        />
                        <span className="text-sm leading-snug text-slate-200">
                          {t(sign.text)}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Results */}
        {concernLevel && (
          <div className="mt-8 space-y-4">
            {/* Counter */}
            <p className="text-sm text-slate-400">
              {checked.size === 1
                ? t("identify.checked", { count: checked.size })
                : t("identify.checked_plural", { count: checked.size })}
            </p>

            {/* Concern card */}
            <div
              className={`rounded-lg border p-5 ${
                concernLevel === "emergency"
                  ? "border-red-500/40 bg-red-900/30"
                  : concernLevel === "high"
                    ? "border-orange-500/40 bg-orange-900/20"
                    : "border-white/10 bg-[#2C5F8A]/20"
              }`}
            >
              <h3
                className={`text-lg font-bold ${
                  concernLevel === "emergency"
                    ? "text-red-300"
                    : concernLevel === "high"
                      ? "text-orange-300"
                      : "text-white"
                }`}
              >
                {t(`identify.results.${concernLevel}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {t(`identify.results.${concernLevel}.description`)}
              </p>

              {/* CTA */}
              {concernLevel === "emergency" ? (
                <div>
                  <a
                    href="tel:911"
                    className="mt-4 inline-block w-full rounded-lg bg-red-600 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {t("identify.results.emergency.cta")}
                  </a>
                  <button
                    onClick={() => {
                      navigate("/document/new", {
                        state: {
                          category: selected === "all" ? "unsure" : selected,
                          checkedSigns: [...checked],
                          concernLevel,
                        },
                      });
                    }}
                    className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-center text-sm font-medium text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
                  >
                    {t("identify.results.emergency.secondaryCta")}
                  </button>
                </div>
              ) : concernLevel === "high" ? (
                <div>
                  <Link
                    to="/act"
                    className="mt-4 inline-block w-full rounded-lg bg-[#2C5F8A] px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-[#2C5F8A]/80 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
                  >
                    {t("identify.results.high.cta")}
                  </Link>
                  <button
                    onClick={() => {
                      navigate("/document/new", {
                        state: {
                          category: selected === "all" ? "unsure" : selected,
                          checkedSigns: [...checked],
                          concernLevel,
                        },
                      });
                    }}
                    className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-center text-sm font-medium text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
                  >
                    {t("identify.results.high.secondaryCta")}
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => {
                      navigate("/document/new", {
                        state: {
                          category: selected === "all" ? "unsure" : selected,
                          checkedSigns: [...checked],
                          concernLevel,
                        },
                      });
                    }}
                    className="mt-4 w-full rounded-lg bg-[#2C5F8A] px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-[#2C5F8A]/80 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
                  >
                    {t(`identify.results.${concernLevel}.cta`)}
                  </button>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {t(`identify.results.${concernLevel}.extra`)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Callout disclaimer */}
        {selected && (
          <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-xs leading-relaxed text-slate-400">
              {t("identify.callout")}
            </p>
          </div>
        )}
      </main>

    </div>
  );
}
