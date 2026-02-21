# Prompt: iOS Install Hint — Show on All iOS Browsers

## Goal
The iOS install hint ("Tap Share → Add to Home Screen") currently only shows on Safari. It should show on ALL iOS browsers (Safari, Chrome, Firefox, etc.) since the process is the same on all of them.

## Task
- In `src/hooks/useInstallPrompt.ts` (or wherever the iOS detection logic is):
  - Remove the `CriOS` exclusion from the iOS detection
  - Detect iOS by checking for "iPhone" or "iPad" in the user agent — that's it
  - The hint should show on any iOS browser that does NOT support `beforeinstallprompt`
- Keep all existing localStorage dismiss logic unchanged
- Keep all existing banner text and styling unchanged

## Do NOT change:
- The Android/desktop install banner behavior
- Any other component, page, or file
- Any styling or text

## Verify
- `npm run build` — zero errors
- Test logic: if userAgent contains "iPhone" or "iPad" AND `beforeinstallprompt` is not supported → show iOS hint