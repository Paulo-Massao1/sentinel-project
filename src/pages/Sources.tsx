import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import sourcesData from "../data/sources.json";

interface Source {
  id: string;
  name: string;
  title: string;
  edition?: string;
  url: string;
}

interface SourceSection {
  key: string;
  sources: Source[];
}

const sections: SourceSection[] = [
  { key: "international", sources: sourcesData.international },
  { key: "brazil", sources: sourcesData.brazil },
  { key: "internationalGov", sources: sourcesData.international_gov },
  { key: "academic", sources: sourcesData.academic },
];

export default function Sources() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col">
      {/* Back */}
      <div className="px-6 pt-8">
        <Link
          to="/"
          className="inline-block text-sm text-slate-400 transition hover:text-white"
        >
          &larr; {t("sources.back")}
        </Link>
      </div>

      <main className="flex-1 px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <header className="mt-4 pb-4">
            <h1 className="text-3xl font-extrabold tracking-[0.2em] text-white sm:text-4xl">
              {t("sources.title")}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
              {t("sources.subtitle")}
            </p>
          </header>
          {/* Sections */}
          <div className="space-y-10">
            {sections.map(({ key, sources }) => (
              <section key={key}>
                <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  {t(`sources.sections.${key}`)}
                </h2>
                <div className="space-y-3">
                  {sources.map((source) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-white/10 bg-[#2C5F8A]/20 px-5 py-4 transition hover:bg-[#2C5F8A]/35 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
                    >
                      <span className="block text-sm font-bold text-white">
                        {source.name}
                      </span>
                      <span className="mt-1 block text-sm text-slate-300">
                        {source.title}
                        {source.edition && ` — ${source.edition}`}
                      </span>
                      <span className="mt-2 block text-xs text-[#2C5F8A]">
                        {source.url}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Commitment callout */}
          <div className="mt-12 rounded-lg border border-white/10 bg-[#1A2B4A] px-5 py-5">
            <p className="text-sm leading-relaxed text-slate-300">
              {t("sources.commitment")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
