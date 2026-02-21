# Prompt: Project Structure Reorganization

## Goal
Reorganize the project structure to follow professional standards. Do NOT change any functionality or visual behavior — this is purely structural.

## Tasks

### 1. Create `src/types/`
- Extract all TypeScript interfaces and types that are currently defined inside components, pages, hooks, or lib files
- Create dedicated type files:
  - `src/types/case.ts` — Case and Observation interfaces
  - `src/types/sign.ts` — Sign, Category, Severity types
  - `src/types/channel.ts` — Reporting channel types
  - `src/types/common.ts` — Shared/generic types (if any, like ConcernLevel)
- Update all imports across the project to use the new type paths
- Add `src/types/index.ts` barrel file to export everything

### 2. Create `src/utils/`
- Extract utility functions that are currently inside components or pages into dedicated files:
  - `src/utils/concernLevel.ts` — concern level calculation logic (severity engine)
  - `src/utils/pdf.ts` — PDF generation/export logic
  - `src/utils/date.ts` — date formatting helpers (if any)
  - Only create files for logic that actually exists — don't create empty files
- Update all imports across the project

### 3. Update `.gitignore`
- Add `prompt.md` to `.gitignore` — this is an internal workflow file, should not be in the public repo
- Verify that `node_modules/`, `dist/`, `.env` are already listed

### 4. Verify
- Run `npm run build` — must succeed with zero errors
- Run the app and confirm all pages work: /, /identify, /document, /document/new, /act, /sources
- No functionality or visual changes — only file locations and imports changed

## Rules
- Do NOT rename `data/` folder — keep as is
- Do NOT create empty files or placeholder utils that don't have real logic to extract
- Do NOT change any component logic, styling, or behavior
- Do NOT modify i18n files
- All code/comments in English
- Maintain TypeScript strict mode — no `any` types
- Follow existing conventions from CLAUDE.md