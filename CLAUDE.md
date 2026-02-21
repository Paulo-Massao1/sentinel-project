# Sentinel — Project Guide for Claude Code

## What is Sentinel

A Progressive Web App that helps adults identify signs of child abuse, document observations securely, and get directed to reporting channels in their country. 100% client-side, no backend, no tracking.

**Tagline:** "Every child deserves someone who won't stay silent."
**Live:** https://sentinel-protect.vercel.app/
**Repo:** https://github.com/Paulo-Massao1/sentinel-project (branch: main)

## Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 + TypeScript (strict) | Type safety, mature PWA ecosystem |
| Build | Vite + vite-plugin-pwa | Fast builds, service worker, offline caching |
| Styling | Tailwind CSS v4 | Consistent design system, responsive |
| Routing | React Router v7 | Client-side navigation |
| Local DB | Dexie.js (IndexedDB) | Persistent local storage across sessions |
| i18n | react-i18next | EN (default) + PT-BR |
| PDF | jsPDF + jspdf-autotable | Client-side report generation |
| Hosting | Vercel | Free, HTTPS, global CDN, auto-deploy on push |

## Architecture Principles

- **No backend. No server. No exceptions.** 100% client-side. Zero data collection, no analytics, no cookies, no tracking.
- **Local-first persistence.** All records stored in IndexedDB via Dexie.js. Data survives sessions and works offline.
- **i18n everywhere.** All user-facing strings come from i18n files. Never hardcode display text.
- **Simplicity over complexity.** Clean, readable, maintainable code. Effective, secure, good UX.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── EmergencyButton.tsx
│   ├── EmergencyModal.tsx
│   ├── InstallBanner.tsx
│   └── LanguageToggle.tsx
├── data/                # Static data (JSON)
│   ├── channels.json    # Reporting channels by country
│   ├── signs.json       # Abuse signs by category (UNICEF/WHO sourced)
│   └── sources.json     # Official references and URLs
├── hooks/               # Custom React hooks
│   ├── useCases.ts      # CRUD for cases and observations
│   └── useInstallPrompt.ts  # PWA install prompt logic
├── i18n/                # Internationalization
│   ├── en.json          # English (default)
│   ├── pt-BR.json       # Portuguese Brazil
│   └── index.ts         # i18n configuration
├── lib/                 # Core utilities
│   ├── db.ts            # Dexie.js database schema and config
│   └── detectLocale.ts  # Language/country auto-detection
├── pages/               # Full page components (one per route)
│   ├── Home.tsx         # Landing page
│   ├── Identify.tsx     # Signs checklist + severity engine
│   ├── CasesList.tsx    # /document — list of all cases
│   ├── NewCase.tsx      # /document/new — create case + first observation
│   ├── CaseDetail.tsx   # /document/:id — timeline + observations
│   ├── Act.tsx          # Reporting guidelines and channels
│   └── Sources.tsx      # Official references
├── types/               # TypeScript interfaces
│   ├── case.ts          # Case, Observation interfaces
│   ├── sign.ts          # Sign, Category, Severity types
│   ├── channel.ts       # Country type
│   ├── common.ts        # ConcernLevel type
│   └── index.ts         # Barrel export
├── utils/               # Business logic utilities
│   ├── concernLevel.ts  # Concern level calculation + style helpers
│   ├── date.ts          # Date formatting (no seconds)
│   └── pdf.ts           # Per-case PDF report generation
├── App.tsx              # Router config
├── index.css            # Global styles
└── main.tsx             # Entry point
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Landing with tagline and 3 pillar cards |
| `/identify` | Identify | Category selector → checklist → concern level → CTA |
| `/document` | CasesList | All tracked cases with "My Cases" section |
| `/document/new` | NewCase | Create case with first observation |
| `/document/:id` | CaseDetail | Case timeline, add/edit observations, export PDF |
| `/act` | Act | Do/don't guidelines, reporting channels by country, FAQ |
| `/sources` | Sources | Official references and methodology |

## Design System

- **Palette:** Navy `#1A2B4A` (primary bg), Blue `#2C5F8A` (accents), light tones for contrast
- **Concern level colors:** Red = Emergency, Orange = High, Blue = Medium, Gray = Low
- **Tone:** Sober, institutional, professional. No emojis. No childish colors.
- **Mobile-first** and responsive. Must look good on both phone and desktop.
- **Visually polished.** Professional, trustworthy, clean spacing and alignment.
- **Intuitive UX.** Every screen self-explanatory. Clear labels, obvious CTAs, logical flow.

## Data Model

### Cases table
```typescript
interface Case {
  id?: number;
  name: string;           // User-defined (e.g., "Neighbor's child")
  category: string;       // physical | emotional | sexual | neglect | unsure
  status: string;         // monitoring | reported | closed
  createdAt: string;
  updatedAt: string;
}
```

### Observations table
```typescript
interface Observation {
  id?: number;
  caseId: number;         // Foreign key → Cases
  date: string;           // ISO date of observation
  description: string;    // What was seen/heard/told
  childInfo: string;      // Age, context, relationship (captured on case creation)
  signsChecked: string[]; // Sign IDs from checklist (optional)
  concernLevel: string;   // low | medium | high | emergency
  createdAt: string;
}
```

## Severity Classification (UNICEF, WHO, Child Welfare Info Gateway, StatPearls/NIH)

**Severe** — direct indicators requiring immediate attention:
- Physical: unexplained fractures, object-shaped marks, patterned burns
- Sexual: difficulty walking/sitting, stained/torn underwear, STDs or pregnancy under 14, age-inappropriate sexual knowledge
- Neglect: malnutrition, untreated serious medical issues

**Moderate** — strong warning signs that need context:
- Physical: unexplained bruises, injuries at different healing stages, flinches at touch
- Emotional: extreme behavior swings, acts adult-like or regresses
- Sexual: fear of specific person/place, sexualized drawings/play, recurring nightmares
- Neglect: poor hygiene, weather-inappropriate clothing, constant hunger

**Mild** — concerning when combined with other signs:
- Physical: always on alert, fear of going home, inconsistent stories
- Emotional: speech/sleep disturbances, somatic complaints, low self-esteem
- Neglect: frequent school absences, takes on adult responsibilities

## Concern Level Engine

| Level | Criteria | CTA |
|-------|----------|-----|
| Emergency | 2+ severe signs OR any severe sexual sign | "Call [emergency#] now" + "Record what you observed" |
| High | 1 severe + 2 moderate, OR 4+ moderate, OR 3+ categories | "See reporting guide" + "Record what you observed" |
| Medium | 3+ signs any severity, OR 2+ moderate | "Record what you observed" + monitor advice |
| Low | 1-2 mild/moderate | "Record what you observed" + keep observing |

## Reporting Channels

| Country | Main Channel | Emergency | Online | Notes |
|---------|-------------|-----------|--------|-------|
| Brazil | Disque 100 (24h) | 190 | App Direitos Humanos BR | — |
| Canada | Kids Help Phone 1-800-668-6868 | 911 | kidshelpphone.ca | Reporting handled at provincial level via Children's Aid Society |
| USA | Childhelp 1-800-422-4453 | 911 | childhelp.org | Guidance/referral hotline, not direct reporting. Report via state CPS. |
| Portugal | SOS Criança 116 111 | 112 | iacrianca.pt | IAC — European child helpline |
| UK | NSPCC 0808 800 5000 | 999 | nspcc.org.uk | Adults can report concerns |

## Content Sources — DO NOT modify without verification

- UNICEF — Caring for Child Survivors of Sexual Abuse Guidelines (2nd ed.)
- WHO — Clinical Guidelines on Child Abuse and Neglect
- Child Welfare Information Gateway (USA) — Signs and Symptoms
- StatPearls/NIH — Child Abuse and Neglect (Nursing), 2025
- ECA (Brazil) — Estatuto da Criança e do Adolescente (Art. 5, 17, 18, 98)
- California Dept. of Education — Child Abuse Identification & Reporting Guidelines
- British Journal of Social Work (2025) — Children's Access to Child Protection Through Mobile Apps

## What's Built ✅

- Home page — tagline, 3 pillar cards, privacy footer, Sources link
- Identify — 5 category filters, 29 signs checklist, severity engine, dynamic CTAs
- Document system — case-based tracking, multiple observations per case, "My Cases" section
- Case detail — expandable timeline, concern-level colored borders, numbered observations
- Add/edit/delete observations — edit pre-fills form, delete requires confirmation
- PDF export — per-case "Full Report" with navy header, numbered observations, formatted dates
- Act page — do/don't guidelines, reporting channels by country with contextual notes, FAQ
- Emergency button — fixed on all screens, country selector, confirmation modal, adapts per country
- Sources page — official references organized by category
- Auto-detect — language via navigator.language, country via timezone, manual override
- i18n — full EN + PT-BR translations
- PWA — service worker, offline caching, installable, app icons (192/512/maskable), iOS meta tags
- Install prompt — banner with localStorage persistence, iOS Safari hint
- Local persistence — IndexedDB via Dexie.js
- Deployed on Vercel with auto-deploy on push

## What's NOT Built Yet ❌

- [ ] Encryption — user PIN + AES-256-GCM via Web Crypto API + PBKDF2 key derivation
- [ ] Additional languages — Spanish, French
- [ ] Automated tests — Vitest + Testing Library

## Code Standards

- All code, variables, components, file names, and comments in **English**
- JSDoc documentation on utils, hooks, types, and lib files
- No `any` types — use proper interfaces from `src/types/`
- Business logic in `src/utils/` or `src/hooks/`, not in components
- Every change that touches user-facing text **must update both** en.json and pt-BR.json
- Commit messages: conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`)

## Critical Rules

1. **Child safety first.** All content must be accurate and based on official sources.
2. **No photo upload** in MVP.
3. **Delete actions** always require confirmation modal.
4. **PDF exports** are per-case, observations in chronological order (oldest first).
5. **Emergency CTA** must always include secondary "Record what you observed" option.
6. **No hardcoded strings.** Everything user-facing comes from i18n.
7. **Back navigation** uses "← Back" link top-left corner on all screens.
8. **Design quality matters.** Every screen must look professional and trustworthy.
9. **Don't change what wasn't asked.** Only modify what the prompt explicitly requests.