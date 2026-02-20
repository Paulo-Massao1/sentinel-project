import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const cards = [
  { key: "identify", href: "/identify" },
  { key: "document", href: "/document" },
  { key: "act", href: "/act" },
] as const;

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col">
      {/* Header */}
      <header className="pt-16 pb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-[0.25em] text-white sm:text-5xl">
          {t("app.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md px-6 text-base leading-relaxed text-slate-300">
          {t("app.tagline")}
        </p>
      </header>

      {/* Navigation cards */}
      <main className="flex flex-1 items-start justify-center px-6 pt-4 pb-12">
        <div className="grid w-full max-w-lg gap-4">
          {cards.map(({ key, href }) => (
            <Link
              key={key}
              to={href}
              className="rounded-lg border border-white/10 bg-[#2C5F8A]/30 px-6 py-5 transition hover:bg-[#2C5F8A]/50 focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]"
            >
              <span className="block text-lg font-bold tracking-wider text-white">
                {t(`nav.${key}`)}
              </span>
              <span className="mt-1 block text-sm text-slate-300">
                {t(`nav.${key}Desc`)}
              </span>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 text-center text-xs text-slate-400">
        {t("app.footer")}
      </footer>
    </div>
  );
}
