import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useCases } from "../hooks/useCases";

function categoryBadgeClass() {
  return "border-[#2C5F8A]/40 bg-[#2C5F8A]/20 text-blue-300";
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "reported":
      return "border-green-500/40 bg-green-900/20 text-green-300";
    case "closed":
      return "border-slate-500/40 bg-slate-900/20 text-slate-400";
    default:
      return "border-yellow-500/40 bg-yellow-900/20 text-yellow-300";
  }
}

export default function CasesList() {
  const { t } = useTranslation();
  const { cases } = useCases();

  return (
    <div className="flex min-h-svh flex-col">
      <header className="px-6 pt-8 pb-4">
        <div className="mx-auto max-w-lg">
          <Link
            to="/"
            className="inline-block text-sm text-slate-400 transition hover:text-white"
          >
            &larr; {t("document.back")}
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold tracking-[0.2em] text-white sm:text-4xl">
            {t("document.title")}
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
            {t("document.subtitle")}
          </p>
        </div>
      </header>

      <main className="flex-1 px-6 pb-12">
        <div className="mx-auto max-w-lg">
          <Link
            to="/document/new"
            className="mb-6 block w-full rounded-lg bg-[#2C5F8A] px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-[#2C5F8A]/80 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
          >
            {t("document.cases.newCase")}
          </Link>

          {cases.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-400">
                {t("document.cases.empty")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cases.map((c) => (
                <Link
                  key={c.id}
                  to={`/document/${c.id}`}
                  className="block rounded-lg border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-white">{c.name}</h3>
                    <svg
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryBadgeClass()}`}
                    >
                      {t(`document.form.categoryOptions.${c.category}`)}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(c.status)}`}
                    >
                      {t(`document.cases.statuses.${c.status}`)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {t("document.cases.created", {
                      date: new Date(c.createdAt).toLocaleDateString(),
                    })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
