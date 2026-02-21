# Sentinel (Sentinela)

A Progressive Web App that helps adults — teachers, neighbors, relatives, any citizen — identify signs of child abuse, document observations securely, and get directed to the correct reporting channels in their country.

**Tagline:** "Every child deserves someone who won't stay silent."
**PT-BR:** "Toda criança merece alguém que não se cale."

## Target Users

Adults who suspect a child may be in danger but don't know how to act. NOT the child victim — the observing adult.

## Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 + TypeScript (strict) | Type safety, mature PWA ecosystem |
| Build | Vite + vite-plugin-pwa | Fast builds, automatic service worker |
| Styling | Tailwind CSS v4 | Consistent design system, responsive |
| Routing | React Router v7 | Client-side navigation |
| Local DB | Dexie.js (IndexedDB) | Persistent local storage across sessions |
| i18n | react-i18next | EN (default) + PT-BR |
| PDF | jsPDF + jspdf-autotable | Client-side report generation |
| Hosting | Vercel | Free, HTTPS, global CDN |

## Architecture Principles

- **No backend. No server. No exceptions.** 100% client-side. Zero data collection, no analytics, no cookies, no tracking. If we don't collect data, there's no data to leak.
- **Local-first persistence.** All records stored in IndexedDB via Dexie.js. Data survives tab close, browser restart, and works offline. Only lost if user clears browser data or switches device.
- **i18n everywhere.** All user-facing strings come from `src/i18n/en.json` and `src/i18n/pt-BR.json`. Never hardcode display text.
- **Simplicity over complexity.** Code should be clean, readable, and maintainable. Not necessarily complex — but effective, secure, and with good UX.

## Project Structure

```
src/
├── pages/              # Full page components (one per route)
│   ├── Home.tsx
│   ├── Identify.tsx
│   ├── CasesList.tsx   # /document — list of all cases
│   ├── NewCase.tsx     # /document/new — create case + first observation
│   └── CaseDetail.tsx  # /document/:id — case timeline + add observations
├── components/         # Reusable UI components
├── data/
│   └── signs.json      # Abuse signs by category (sourced from UNICEF/WHO)
├── i18n/
│   ├── en.json         # English (default/base)
│   └── pt-BR.json      # Portuguese Brazil
├── lib/
│   ├── db.ts           # Dexie.js database schema and config
│   └── pdfExport.ts    # Per-case PDF report generation
├── hooks/
│   └── useCases.ts     # CRUD for cases and observations
├── App.tsx             # Router config
└── main.tsx            # Entry point
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Landing with tagline and 3 pillar cards |
| `/identify` | Identify | Category selector → checklist → concern level → CTA |
| `/document` | CasesList | All tracked cases |
| `/document/new` | NewCase | Create case with first observation |
| `/document/:id` | CaseDetail | Case timeline, add observations, export PDF |

## Code Standards

- All code, variables, components, file names, and comments in **English**
- Clean code: small focused components, descriptive naming, proper TypeScript types
- **No `any` types** — use proper interfaces and types
- Every change that touches user-facing text **must update both** en.json and pt-BR.json
- Commit messages: conventional commits (`feat:`, `fix:`, `refactor:`)

## Design System

- **Palette:** Navy `#1A2B4A` (primary bg), Blue `#2C5F8A` (accents/interactive), light tones for contrast
- **Tone:** Sober, institutional, professional. No emojis. No childish colors. No decorative illustrations.
- **Typography:** Clean, readable. Short sentences. No long paragraphs on mobile — users in crisis read little.
- **Mobile-first** and responsive. Must look good on both phone and desktop.
- **Visually polished.** The UI must look professional and trustworthy — not generic or ugly. This app deals with a serious cause. Users need to feel confidence when using it. Invest in good spacing, alignment, visual hierarchy, and consistent component styling. If something looks off, fix it.
- **Intuitive UX.** Every screen should be self-explanatory. The user should never wonder "what do I do here?" or "where do I go next?". Clear labels, obvious CTAs, logical flow between pages.
- **Concern level colors:** Red = Emergency, Orange = High, Blue = Medium, Gray = Low

## Data Model

### Cases table
```typescript
interface Case {
  id?: number;            // Auto-incremented
  name: string;           // User-defined (e.g., "Neighbor's child")
  category: string;       // physical | emotional | sexual | neglect | unsure
  status: string;         // monitoring | reported | closed
  createdAt: string;      // ISO date
  updatedAt: string;      // ISO date (updates on new observation)
}
```

### Observations table
```typescript
interface Observation {
  id?: number;            // Auto-incremented
  caseId: number;         // Foreign key → Cases
  date: string;           // ISO date of observation
  description: string;    // What was seen/heard/told
  childInfo: string;      // Age, context, relationship (mainly first obs)
  signsChecked: string[]; // Sign IDs from checklist (optional)
  concernLevel: string;   // low | medium | high | emergency
  createdAt: string;      // ISO date
}
```

## Severity Classification (based on UNICEF, WHO, Child Welfare Info Gateway, StatPearls/NIH)

**Severe** — direct indicators requiring immediate attention:
- Physical: unexplained fractures, object-shaped marks (belt/wire), patterned burns
- Sexual: difficulty walking/sitting, stained/torn underwear, STDs or pregnancy under 14, age-inappropriate sexual knowledge
- Neglect: malnutrition, untreated serious medical issues

**Moderate** — strong warning signs that need context:
- Physical: unexplained bruises, injuries at different healing stages, flinches at touch
- Emotional: extreme behavior swings, acts adult-like or regresses to baby-like behavior
- Sexual: fear of specific person/place, sexualized drawings/play, recurring nightmares
- Neglect: poor hygiene, weather-inappropriate clothing, constant hunger

**Mild** — concerning when combined with other signs:
- Physical: always on alert, fear of going home, inconsistent stories about injuries
- Emotional: speech/sleep disturbances, somatic complaints without medical cause, low self-esteem, disproportionate fear of mistakes
- Neglect: frequent school absences, takes on adult responsibilities, sleeps in class

## Concern Level Engine

| Level | Criteria | CTA |
|-------|----------|-----|
| Emergency | 2+ severe signs OR any severe sexual sign | Primary: "Call [emergency#] now" + Secondary: "Record what you observed" |
| High | 1 severe + 2 moderate, OR 4+ moderate, OR 3+ categories | Primary: "See reporting guide" + Secondary: "Record what you observed" |
| Medium | 3+ signs any severity, OR 2+ moderate | "Record what you observed" + monitor advice |
| Low | 1-2 mild/moderate | "Record what you observed" + keep observing |

**Important:** Emergency and High levels must ALWAYS show a secondary "Record what you observed" CTA. The user must always have the option to document.

## Content Sources — DO NOT modify without verification

All checklist signs, guidelines, and protocols are sourced from:
- UNICEF — Caring for Child Survivors of Sexual Abuse Guidelines (2nd ed.)
- WHO — Clinical Guidelines on Child Abuse and Neglect
- Child Welfare Information Gateway (USA) — Signs and Symptoms
- StatPearls/NIH — Child Abuse and Neglect (Nursing), 2025
- ECA (Brazil) — Estatuto da Criança e do Adolescente (Art. 5, 17, 18, 98)
- California Dept. of Education — Child Abuse Identification & Reporting Guidelines
- British Journal of Social Work (2025) — Children's Access to Child Protection Through Mobile Apps

## Reporting Channels (MVP countries)

| Country | Main Channel | Emergency | Online |
|---------|-------------|-----------|--------|
| Brazil | Disque 100 (24h, free) | 190 | App Direitos Humanos BR |
| Canada | Provincial Child Services | 911 | kidshelpphone.ca |
| USA | Childhelp 1-800-422-4453 | 911 | childhelp.org |
| Portugal | SOS Criança 116 111 | 112 | iacrianca.pt |
| UK | NSPCC 0808 800 5000 | 999 | nspcc.org.uk |

## What's Built ✅

- [x] Home page — tagline, 3 pillar cards, privacy footer
- [x] Identify — 5 category filters, 29 signs checklist, severity engine, dynamic CTAs by concern level
- [x] Document — case-based system with multiple observations per case
- [x] Case timeline — expandable cards with concern-level colored borders
- [x] PDF export — per-case professional report with navy header, numbered observations
- [x] Identify → Document integration — CTA goes to /document/new with pre-filled data
- [x] i18n — EN + PT-BR fully translated
- [x] Local persistence — IndexedDB via Dexie.js
- [x] Git — connected to GitHub repo

## What's NOT Built Yet ❌

- [ ] Act page — do/don't guidelines, reporting channels by country, FAQ, suggested reporting script
- [ ] Emergency button — fixed on all screens, confirmation modal adapted per country
- [ ] Sources page — official references and methodology transparency
- [ ] Auto-detect language/country — navigator.language + Intl.DateTimeFormat timezone (100% client-side, no geolocation API)
- [ ] Encryption — user PIN + AES-256-GCM via Web Crypto API + PBKDF2 key derivation
- [ ] PWA finalization — service worker offline caching, app icons (192/512), installable
- [ ] Automated tests — Vitest + Testing Library

## Critical Rules

1. **Child safety first.** All content must be accurate and based on official sources. No opinions.
2. **No photo upload** in MVP.
3. **Delete actions** always require confirmation modal.
4. **PDF exports** are per-case, observations in chronological order (oldest first).
5. **Emergency CTA** must always include secondary "Record what you observed" option.
6. **No hardcoded strings.** Everything user-facing comes from i18n.
7. **Back navigation** uses simple "← Back" link on all screen sizes.
8. **Design quality matters.** Don't sacrifice visual quality for speed. Every screen must look professional, clean, and trustworthy. If the layout looks broken, misaligned, or ugly — fix it before moving on.