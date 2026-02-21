# Sentinel

**Every child deserves someone who won't stay silent.**

Sentinel is a Progressive Web App that helps adults — teachers, neighbors, relatives, any concerned citizen — identify signs of child abuse, document observations securely on their device, and find the correct reporting channels in their country.

No accounts. No servers. No data collection. Everything stays on your device.

🔗 **Live:** [sentinel-protect.vercel.app](https://sentinel-protect.vercel.app)

---

## Why This Exists

Research published in the *British Journal of Social Work* (Carlick & May-Chahal, 2025) found that while mobile apps related to child protection exist, very few provide a clear path from recognizing abuse to actually reporting it — especially for adults who are not professionals in the field.

Most people who suspect a child is being harmed don't know what signs to look for, how to document what they observe, or where to report. They hesitate, second-guess themselves, and often stay silent.

Sentinel exists to close that gap. It walks the user through three steps: **Identify** the signs, **Document** what was observed, and **Act** by connecting to the right reporting channel.

> Carlick, S. & May-Chahal, C. (2025). *Children's access to child protection social work through mobile apps.* The British Journal of Social Work. [doi:10.1093/bjsw/bcaf274](https://doi.org/10.1093/bjsw/bcaf274)

---

## What It Does

### Identify
A checklist of 29 recognized signs of abuse across 5 categories (physical, emotional, sexual, neglect, unsure), sourced from UNICEF, WHO, and other official bodies. A severity engine evaluates the combination of signs and determines a concern level (low, medium, high, emergency) with appropriate calls to action.

### Document
A case-based system where the user creates a case, adds timestamped observations over time, and tracks concern levels. Cases are stored locally in IndexedDB and persist across sessions. Each case can be exported as a structured PDF report.

### Act
Country-specific reporting channels (Brazil, Canada, USA, Portugal, UK) with emergency numbers, online resources, and contextual notes explaining how reporting works in each jurisdiction. Includes do/don't guidelines and a suggested reporting script.

### Emergency Button
A fixed emergency button on every screen with country-specific phone numbers. One tap to call for help.

---

## Privacy & Security

This is a zero-trust, zero-collection architecture:

- **No backend.** The app is 100% client-side. There is no server, no API, no database to breach.
- **No analytics.** No cookies, no tracking pixels, no third-party scripts.
- **Local storage only.** All data lives in the browser's IndexedDB. It never leaves the device.
- **Works offline.** After the first visit, the entire app works without an internet connection.
- **Installable as PWA.** Can be added to the home screen on mobile or desktop and used like a native app.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript (strict mode) |
| Build | Vite + vite-plugin-pwa |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Local Database | Dexie.js (IndexedDB) |
| Internationalization | react-i18next (EN + PT-BR) |
| PDF Generation | jsPDF |
| Hosting | Vercel |

---

## Running Locally

```bash
git clone https://github.com/Paulo-Massao1/sentinel-project.git
cd sentinel-project
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

To test the production build (PWA, offline, service worker):

```bash
npm run build
npm run preview
```

---

## Content Sources

All signs, severity classifications, and reporting channels are based on verified sources:

- **UNICEF** — Caring for Child Survivors of Sexual Abuse Guidelines (2nd ed.)
- **WHO** — Clinical Guidelines on Child Abuse and Neglect
- **Child Welfare Information Gateway (USA)** — Signs and Symptoms of Abuse
- **StatPearls / NIH** — Child Abuse and Neglect (Nursing), 2025
- **ECA (Brazil)** — Estatuto da Criança e do Adolescente
- **California Dept. of Education** — Child Abuse Identification & Reporting Guidelines

---

## What's Next

- **Encryption** — PIN-based encryption (AES-256-GCM) via Web Crypto API to protect stored case data
- **Additional languages** — Spanish and French support
- **Automated testing** — Vitest + React Testing Library

---

## Development

This project was built by me using Claude (Anthropic) as a development tool for code generation, refactoring, and iteration. All architectural decisions, content verification, and quality control were done by the developer.

---

## License

This project is open source and available for anyone working to protect children.
