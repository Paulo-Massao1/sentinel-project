# Prompt: Code Documentation & Final Cleanup

## Goal
Add professional, concise English documentation to key files and do a final code cleanup pass. Documentation should be useful, not excessive — do NOT add obvious or redundant comments.

---

## 1. Add JSDoc Documentation

### src/utils/ — All utility files
- Add JSDoc to each exported function: brief description, @param, @returns
- Keep descriptions to 1 line. Example:
```ts
/** Compute concern level based on checked signs and their severities. */
```

### src/hooks/ — All hook files
- Add JSDoc to each exported hook: what it does and what it returns
- Example:
```ts
/** Manages CRUD operations for cases and observations in IndexedDB. */
```

### src/types/ — All type files
- Add a brief comment above each interface/type describing what it represents
- Example:
```ts
/** A documented case being monitored for potential child abuse. */
export interface Case { ... }
```

### src/lib/ — db.ts, detectLocale.ts
- Add brief JSDoc to exported functions and the database class/instance

### Do NOT add documentation to:
- Page components (src/pages/*) — file names are self-descriptive
- UI components (src/components/*) — unless the component has non-obvious props
- i18n files, JSON data files, config files
- Inline code that is already clear

---

## 2. Final Code Cleanup

### Check all files in src/ for:
- **Comments in Portuguese** — translate any to English
- **console.log statements** — remove all except those inside catch blocks (error logging is fine)
- **Unused imports** — remove any
- **Unused variables** — remove any
- **Commented-out code** — remove any dead code

---

## 3. Verify
- Run `npm run build` — zero errors, zero warnings
- All pages must work: /, /identify, /document, /document/new, /document/:id, /act, /sources
- No functionality or visual changes — only documentation and cleanup

## Rules
- All documentation in English
- Keep comments concise and professional — no filler
- Do NOT change any logic, styling, or behavior
- Do NOT modify i18n translation files