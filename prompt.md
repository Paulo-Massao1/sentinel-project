# Prompt: Design Polish, Reporting Channels Fix, Edit Observations, PDF Fix

## Goal
Polish the UI, fix reporting channel accuracy, add edit functionality for observations, and fix PDF formatting. Multiple areas addressed in one pass.

---

## 1. Reporting Channels — CRITICAL ACCURACY FIX

The reporting channels on the Act page must be accurate. Update `data/channels.json` and both i18n files with the following corrections:

### 🇧🇷 Brazil
- **Disque 100** — correct, keep as is
- Description: National human rights hotline, free, 24/7. Managed by the Ministry of Human Rights.

### 🇨🇦 Canada
- **Kids Help Phone (1-800-668-6868)** — keep, but clarify it is primarily for children and youth seeking support, not for adults reporting abuse
- **Add note:** "In Canada, child abuse reporting is handled at the provincial level. If you suspect abuse, contact your local Children's Aid Society or provincial child protection service. In an emergency, call 911."
- Add i18n keys for this note in both EN and PT-BR

### 🇺🇸 United States
- **Childhelp (1-800-422-4453)** — keep, but clarify it is a guidance and referral hotline, NOT a direct reporting line
- **Add note:** "The Childhelp Hotline provides guidance and referrals. To report abuse directly, contact your state's Child Protective Services (CPS). In an emergency, call 911."
- Add i18n keys for this note in both EN and PT-BR

### 🇵🇹 Portugal
- **IAC / SOS Criança (116 111)** — correct, keep as is
- Verify the description mentions it is the official European child helpline number operated by Instituto de Apoio à Criança

### 🇬🇧 United Kingdom
- **NSPCC (0808 800 5000)** — correct, keep as is
- Verify the description mentions adults can report concerns and get referrals to Children's Services

### For ALL countries:
- Always include "In an emergency, call [emergency number]" as the first line (911, 190, 112, 999 respectively)
- Update both en.json and pt-BR.json with any new or modified text

---

## 2. Edit Observations

Currently observations can only be deleted. Add edit functionality:

- Add an "Edit" button next to each observation in the expanded view (CaseDetail page)
- Clicking "Edit" opens the observation form pre-filled with existing data (date, description, childInfo, signsChecked, concernLevel)
- User can modify and save — this updates the existing observation in IndexedDB (not create a new one)
- The "Edit" and "Delete" buttons should be subtle (text links or small outlined buttons), not large primary buttons
- Add i18n keys: `observation.edit`, `observation.save`, `observation.cancel` to both language files

---

## 3. Design Polish

### 3a. Document page (CasesList) — Desktop alignment
- Center the page title "DOCUMENT", subtitle, and "New Case" button within the max-width container on desktop
- Case cards should also be centered within the same container
- Keep the current mobile layout unchanged

### 3b. Identify page — Desktop alignment
- Center the page title "IDENTIFY" and subtitle within the max-width container on desktop
- The category filter buttons should remain left-aligned (they're interactive, left-align is better for scanning)
- The checklist items should remain in the centered max-width container as they are now
- Keep the current mobile layout unchanged

### 3c. Case Detail page
- Add a "Type:" label before the category badge (e.g., "Type: Emotional" instead of just the badge)
- Change "Export PDF" button text to "Export Full Report" / "Exportar Relatório Completo" — update both i18n files
- Add slightly more internal padding to observation cards for better readability
- Add i18n keys for "Type:" label in both language files

### 3d. PDF Formatting Fix
- Fix observation alignment/layout in exported PDF — observations should be cleanly formatted with consistent spacing
- Remove seconds from time display — show "6:03 AM" not "6:03:00 AM" (both in PDF and in the case detail UI)
- Ensure all observation fields are properly aligned and not overlapping

---

## Rules
- All code/comments in English
- User-facing text from i18n only — update BOTH en.json and pt-BR.json for every change
- No `any` types
- Do NOT change the overall design system (colors, fonts, dark theme)
- Do NOT change navigation or routing
- Do NOT modify the emergency button behavior
- Follow existing conventions from CLAUDE.md
- Run `npm run build` and verify zero errors before finishing