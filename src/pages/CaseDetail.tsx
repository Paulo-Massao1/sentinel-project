import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCases, useCaseDetail } from "../hooks/useCases";
import type { Observation } from "../types";
import { toLocalDatetimeValue } from "../utils/date";
import { exportCasePdf } from "../utils/pdf";

const concernLevels = ["low", "medium", "high", "emergency"] as const;
const statuses = ["monitoring", "reported", "closed"] as const;

function concernBadgeClass(level: string) {
  switch (level) {
    case "emergency":
      return "border-red-500/40 bg-red-900/30 text-red-300";
    case "high":
      return "border-orange-500/40 bg-orange-900/20 text-orange-300";
    case "medium":
      return "border-yellow-500/40 bg-yellow-900/20 text-yellow-300";
    default:
      return "border-white/10 bg-white/5 text-slate-300";
  }
}

function concernBorderClass(level: string) {
  switch (level) {
    case "emergency":
      return "border-l-red-500";
    case "high":
      return "border-l-orange-500";
    case "medium":
      return "border-l-blue-500";
    default:
      return "border-l-slate-500";
  }
}

export default function CaseDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseId = id ? Number(id) : undefined;
  const { updateCaseStatus, deleteCase, addObservation, deleteObservation } =
    useCases();
  const { caseData, observations, chronologicalObservations } =
    useCaseDetail(caseId);

  // Observation form
  const [showForm, setShowForm] = useState(false);
  const [obsDate, setObsDate] = useState(toLocalDatetimeValue(new Date()));
  const [obsDescription, setObsDescription] = useState("");
  const [obsConcernLevel, setObsConcernLevel] = useState("");

  // Expanded observation
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Delete modals
  const [showDeleteCase, setShowDeleteCase] = useState(false);
  const [deleteObsId, setDeleteObsId] = useState<number | null>(null);

  // Reset form date when opening
  useEffect(() => {
    if (showForm) setObsDate(toLocalDatetimeValue(new Date()));
  }, [showForm]);

  if (!caseData) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-slate-400">{t("document.caseDetail.notFound")}</p>
      </div>
    );
  }

  async function handleAddObservation() {
    if (!caseId || !obsConcernLevel) return;
    await addObservation(caseId, {
      date: new Date(obsDate).toISOString(),
      description: obsDescription,
      childInfo: "",
      signsChecked: [],
      concernLevel: obsConcernLevel,
    });
    setShowForm(false);
    setObsDescription("");
    setObsConcernLevel("");
  }

  async function handleDeleteCase() {
    if (!caseId) return;
    await deleteCase(caseId);
    navigate("/document", { replace: true });
  }

  async function handleDeleteObservation() {
    if (deleteObsId === null) return;
    await deleteObservation(deleteObsId);
    setDeleteObsId(null);
    if (expandedId === deleteObsId) setExpandedId(null);
  }

  async function handleStatusChange(status: string) {
    if (!caseId) return;
    await updateCaseStatus(caseId, status);
  }

  async function handleExportPdf() {
    if (!caseData) return;
    await exportCasePdf({
      caseData,
      observations: chronologicalObservations,
      t,
    });
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="px-6 pt-6 pb-0">
        <Link
          to="/document"
          className="inline-block text-sm text-slate-400 transition hover:text-white"
        >
          &larr; {t("document.back")}
        </Link>
        <div className="mx-auto max-w-2xl">
          <h1 className="mt-3 text-xl font-bold text-white md:mt-2">
            {caseData.name}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <span
              className="rounded-full border px-2.5 py-0.5 text-xs font-medium border-[#2C5F8A]/40 bg-[#2C5F8A]/20 text-blue-300"
            >
              {t(`document.form.categoryOptions.${caseData.category}`)}
            </span>
            <span className="text-xs text-slate-400">{t("document.caseDetail.statusLabel")}</span>
            <select
              value={caseData.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 transition focus:border-[#2C5F8A] focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-[#1A2B4A]">
                  {t(`document.cases.statuses.${s}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 border-t border-white/10" />
        </div>
      </header>

      <main className="flex-1 px-6 pb-8">
        <div className="mx-auto max-w-2xl">
          {/* Action buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex-1 rounded-lg bg-[#2C5F8A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2C5F8A]/80 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
            >
              {t("document.caseDetail.addObservation")}
            </button>
            <button
              onClick={handleExportPdf}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
            >
              {t("document.caseDetail.exportPdf")}
            </button>
          </div>

          {/* Add observation form (inline) */}
          {showForm && (
            <div className="mt-4 space-y-4 rounded-lg border border-white/10 bg-white/5 p-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {t("document.form.dateLabel")}
                </label>
                <input
                  type="datetime-local"
                  value={obsDate}
                  onChange={(e) => setObsDate(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition focus:border-[#2C5F8A] focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {t("document.form.descriptionLabel")}
                </label>
                <textarea
                  value={obsDescription}
                  onChange={(e) => setObsDescription(e.target.value)}
                  placeholder={t("document.form.descriptionPlaceholder")}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition focus:border-[#2C5F8A] focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {t("document.form.concernLevelLabel")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {concernLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setObsConcernLevel(level)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#2C5F8A] ${
                        obsConcernLevel === level
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
              <div className="flex gap-3">
                <button
                  onClick={handleAddObservation}
                  disabled={!obsConcernLevel}
                  className="flex-1 rounded-lg bg-[#2C5F8A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2C5F8A]/80 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("document.form.save")}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
                >
                  {t("document.caseDetail.cancel")}
                </button>
              </div>
            </div>
          )}

          {/* Observations timeline */}
          <h2 className="mt-5 mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            {t("document.caseDetail.timeline")} ({observations.length})
          </h2>

          {observations.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-slate-400">
                {t("document.caseDetail.noObservations")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {observations.map((obs: Observation) => (
                <div
                  key={obs.id}
                  className={`cursor-pointer rounded-lg border border-white/10 border-l-4 bg-white/5 p-4 transition hover:bg-white/10 ${concernBorderClass(obs.concernLevel)}`}
                  onClick={() =>
                    setExpandedId(expandedId === obs.id ? null : obs.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs text-slate-400">
                      {new Date(obs.date).toLocaleString()}
                    </p>
                    <svg
                      className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform ${expandedId === obs.id ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  <div className="mt-1.5">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${concernBadgeClass(obs.concernLevel)}`}
                    >
                      {t(
                        `document.form.concernLevels.${obs.concernLevel}`,
                      )}
                    </span>
                  </div>

                  {/* Description preview */}
                  {obs.description && expandedId !== obs.id && (
                    <div className="mt-1.5">
                      <span className="text-xs font-semibold text-slate-400">{t("document.form.descriptionLabel")}: </span>
                      <span className="text-sm leading-relaxed text-slate-300">
                        {obs.description.length > 120
                          ? obs.description.slice(0, 120) + "..."
                          : obs.description}
                      </span>
                    </div>
                  )}

                  {/* Expanded details */}
                  {expandedId === obs.id && (
                    <div className="mt-3 space-y-2.5 border-t border-white/10 pt-3">
                      {obs.description && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                            {t("document.form.descriptionLabel")}
                          </p>
                          <p className="mt-1 text-sm text-slate-300">
                            {obs.description}
                          </p>
                        </div>
                      )}

                      {obs.childInfo && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                            {t("document.form.childInfoLabel")}
                          </p>
                          <p className="mt-1 text-sm text-slate-300">
                            {obs.childInfo}
                          </p>
                        </div>
                      )}

                      {obs.signsChecked.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                            {t("document.form.signsLabel")}
                          </p>
                          <ul className="mt-1 space-y-1">
                            {obs.signsChecked.map((signId) => (
                              <li
                                key={signId}
                                className="text-sm text-slate-300"
                              >
                                &bull;{" "}
                                {t(
                                  `identify.signs.${signId.split("-").join("")}`,
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteObsId(obs.id);
                        }}
                        className="mt-2 rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-2 text-xs font-medium text-red-300 transition hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {t("document.caseDetail.deleteObservation")}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Delete case link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowDeleteCase(true)}
              className="text-xs text-red-400 transition hover:text-red-300 focus:outline-none"
            >
              {t("document.caseDetail.deleteCaseLink")}
            </button>
          </div>
        </div>
      </main>

      {/* Delete case confirmation modal */}
      {showDeleteCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-sm rounded-lg border border-white/10 bg-[#1A2B4A] p-6 shadow-xl">
            <p className="text-sm leading-relaxed text-slate-300">
              {t("document.caseDetail.deleteCaseConfirm")}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowDeleteCase(false)}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
              >
                {t("document.caseDetail.cancel")}
              </button>
              <button
                onClick={handleDeleteCase}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {t("document.caseDetail.deleteCase")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete observation confirmation modal */}
      {deleteObsId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-sm rounded-lg border border-white/10 bg-[#1A2B4A] p-6 shadow-xl">
            <p className="text-sm leading-relaxed text-slate-300">
              {t("document.caseDetail.deleteObsConfirm")}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteObsId(null)}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
              >
                {t("document.caseDetail.cancel")}
              </button>
              <button
                onClick={handleDeleteObservation}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {t("document.caseDetail.deleteObservation")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
